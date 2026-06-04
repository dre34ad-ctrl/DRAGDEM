import { createClient } from './server';

export async function savePayoutMethod(performerId: string, type: 'stripe' | 'pix' | 'promptpay' | 'bank_transfer' | 'paypay' | 'paybox' | 'bizum' | 'interac', details: any, isDefault: boolean = true) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payout_methods')
    .upsert({
      performer_id: performerId,
      type,
      details,
      is_default: isDefault,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving payout method:', error);
    throw error;
  }

  return data;
}

export async function getPayoutMethods(performerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payout_methods')
    .select('*')
    .eq('performer_id', performerId);

  if (error) {
    console.error('Error fetching payout methods:', error);
    return [];
  }

  return data;
}
