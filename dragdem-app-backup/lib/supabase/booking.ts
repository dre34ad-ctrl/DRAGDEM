import { createClient } from './server';

export async function createBooking(data: any) {
  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      performer_id: data.performerId,
      seeker_id: data.seekerId,
      event_date: data.eventDate,
      total_fee: data.totalFee,
      currency: data.currency,
      status: 'inquiry',
      escrow_status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return booking;
}

export async function updateBookingStatus(bookingId: string, status: string, escrowStatus?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status, 
      ...(escrowStatus && { escrow_status: escrowStatus })
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookingDetails(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      performer:performer_id (*),
      seeker:seeker_id (*)
    `)
    .eq('id', bookingId)
    .single();

  if (error) throw error;
  return data;
}
