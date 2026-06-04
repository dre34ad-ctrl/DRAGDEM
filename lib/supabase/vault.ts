import { createClient } from './server';

export const FREE_TIER_VAULT_LIMIT = 15;

export interface VaultAsset {
  id: string;
  performer_id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name?: string;
  category?: string;
  metadata?: any;
  localized_tags?: string[];
  created_at: string;
}

export async function getVaultAssets(performerId: string): Promise<VaultAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vault_assets')
    .select('*')
    .eq('performer_id', performerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addVaultAsset(performerId: string, asset: Partial<VaultAsset>) {
  const supabase = await createClient();
  
  // 1. Check current count for limit enforcement
  const { count, error: countError } = await supabase
    .from('vault_assets')
    .select('*', { count: 'exact', head: true })
    .eq('performer_id', performerId);

  if (countError) throw countError;

  // 2. Check user subscription tier
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', performerId)
    .single();

  if (userError) throw userError;

  if (user.subscription_tier === 'free' && (count || 0) >= FREE_TIER_VAULT_LIMIT) {
    throw new Error(`Vault limit reached for FREE tier (${FREE_TIER_VAULT_LIMIT} assets). Upgrade to PRO for unlimited storage.`);
  }

  // 3. Insert asset
  const { data, error } = await supabase
    .from('vault_assets')
    .insert({
      performer_id: performerId,
      ...asset
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVaultAsset(assetId: string, performerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('vault_assets')
    .delete()
    .eq('id', assetId)
    .eq('performer_id', performerId);

  if (error) throw error;
  return { success: true };
}
