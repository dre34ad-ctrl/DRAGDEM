import { createClient } from './server';

export async function listPendingVerifications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('seeker_verifications')
    .select('*, seeker:seeker_id(business_name)')
    .eq('status', 'pending');

  if (error) throw error;
  return data;
}

export async function updateVerificationStatus(requestId: string, status: 'approved' | 'rejected', notes?: string) {
  const supabase = await createClient();
  const { data: request, error: fetchError } = await supabase
    .from('seeker_verifications')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('seeker_verifications')
    .update({ 
      status, 
      admin_notes: notes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;

  if (status === 'approved') {
    // Update the seeker's profile tier
    const { error: profileError } = await supabase
      .from('talent_seeker_profiles')
      .update({ verification_tier: request.tier })
      .eq('user_id', request.seeker_id);

    if (profileError) throw profileError;
  }

  // Simulated Email Notification
  console.log(`Email sent to seeker: Verification request ${status}.`);

  return data;
}
