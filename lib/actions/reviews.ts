import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ReviewStatus = 'pending_both' | 'one_submitted' | 'published';

export async function submitReview({
  bookingId,
  rating,
  comment,
  userRole,
}: {
  bookingId: string;
  rating: any;
  comment: string;
  userRole: 'performer' | 'seeker';
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Fetch existing review record
  const { data: existingReview, error: fetchError } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  const isPerformer = userRole === 'performer';
  const updateData: any = isPerformer 
    ? { performer_rating: rating, performer_comment: comment }
    : { seeker_rating: rating, seeker_comment: comment };

  if (existingReview) {
    // Determine new status
    let newStatus: ReviewStatus = 'one_submitted';
    
    const otherPartySubmitted = isPerformer 
      ? !!existingReview.seeker_rating 
      : !!existingReview.performer_rating;

    if (otherPartySubmitted) {
      newStatus = 'published';
    }

    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        ...updateData,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingReview.id);

    if (updateError) throw updateError;
  } else {
    // First submission
    // Fetch booking to get performer and seeker IDs
    const { data: booking } = await supabase
      .from('bookings')
      .select('performer_id, seeker_id')
      .eq('id', bookingId)
      .single();

    if (!booking) throw new Error('Booking not found');

    const visibleAfter = new Date();
    visibleAfter.setDate(visibleAfter.getDate() + 14);

    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        booking_id: bookingId,
        performer_id: booking.performer_id,
        seeker_id: booking.seeker_id,
        ...updateData,
        status: 'one_submitted',
        visible_after: visibleAfter.toISOString(),
      });

    if (insertError) throw insertError;
  }

  revalidatePath(`/dashboard/bookings/${bookingId}`);
  return { success: true };
}

export async function getPublishedReviews(performerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      performer_rating,
      performer_comment,
      created_at,
      seeker:users!seeker_id(full_name, avatar_url)
    `)
    .eq('performer_id', performerId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
