import { createClient } from './server';

export async function initiateSafetyExit(bookingId: string, userId: string, severity: 'low' | 'medium' | 'high' | 'critical', metadata: any) {
  const supabase = await createClient();
  // 1. Create a safety event record
  const { data, error } = await supabase
    .from('safety_events')
    .insert({
      booking_id: bookingId,
      triggered_by: userId,
      severity,
      location_snapshot: metadata.location,
      media_evidence: metadata.evidence || [],
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Lock escrow for this booking
  await supabase
    .from('bookings')
    .update({ status: 'disputed', escrow_status: 'locked' })
    .eq('id', bookingId);

  // 3. Trigger a notification (handled by Supabase Edge Functions or real-time listeners)
  console.log('Safety Exit notification sent to mediators');

  return data;
}
