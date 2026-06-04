import { createClient } from './server';

export async function createDigitalContract(bookingId: string, contractHash: string, policySnapshot: any, riderSnapshotId: string, financialData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('digital_contracts')
    .insert({
      booking_id: bookingId,
      contract_hash: contractHash,
      policy_snapshot: policySnapshot,
      rider_snapshot_id: riderSnapshotId,
      financial_data: financialData,
      status: 'draft',
      audit_log: [{ event: 'CONTRACT_GENERATED', timestamp: new Date().toISOString() }]
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating digital contract:', error);
    throw error;
  }

  return data;
}

export async function acceptContract(contractId: string, actorType: 'seeker' | 'performer', metadata: any) {
  const supabase = await createClient();
  const column = actorType === 'seeker' ? 'seeker_accepted_at' : 'performer_accepted_at';
  
  const { data: contract, error: contractError } = await supabase
    .from('digital_contracts')
    .update({ 
      [column]: new Date().toISOString(),
      status: actorType === 'performer' ? 'active' : 'pending_acceptance'
    })
    .eq('id', contractId)
    .select()
    .single();

  if (contractError) throw contractError;

  const { error: metaError } = await supabase
    .from('contract_acceptance_metadata')
    .insert({
      contract_id: contractId,
      actor_type: actorType,
      ip_address: metadata.ip,
      user_agent: metadata.userAgent,
      device_fingerprint: metadata.fingerprint,
      timestamp: new Date().toISOString()
    });

  if (metaError) throw metaError;

  return contract;
}
