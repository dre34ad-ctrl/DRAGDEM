import { createClient } from './server';

export async function resolveDispute(disputeId: string, resolution: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('disputes')
    .update({
      status: 'resolved',
      resolution: resolution
    })
    .eq('id', disputeId)
    .select()
    .single();

  if (error) throw error;

  // Handle escrow release based on resolution
  // This would likely trigger a Supabase Edge Function to interact with Stripe/dLocal
  
  return data;
}

export async function getDisputeWithEvidence(disputeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('disputes')
    .select(`
      *,
      bookings (
        *,
        performer:performer_id (display_name),
        seeker:seeker_id (display_name),
        escrow_transactions (*)
      )
    `)
    .eq('id', disputeId)
    .single();

  if (error) throw error;
  return data;
}

