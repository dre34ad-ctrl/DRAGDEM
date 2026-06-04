'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import * as vaultService from '@/lib/supabase/vault';
export type { VaultAsset } from '@/lib/supabase/vault';

/**
 * Fetches all assets in a performer's vault (Public).
 */
export async function getVaultAssets(performerId: string) {
  return vaultService.getVaultAssets(performerId);
}

/**
 * Fetches all assets in the current performer's vault.
 */
export async function getMyVaultAssets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  return vaultService.getVaultAssets(user.id);
}

/**
 * Uploads a file to Supabase Storage and records it in the vault.
 */
export async function uploadVaultAsset(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const name = formData.get('name') as string || file.name;
  const category = formData.get('category') as string || 'Uncategorized';
  const type = (formData.get('type') as any) || 
               (file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 
                file.type.startsWith('audio/') ? 'audio' : 'document');
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  // 1. Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('vault-media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('vault-media')
    .getPublicUrl(filePath);

  // 3. Save to database
  const asset = await vaultService.addVaultAsset(user.id, {
    name,
    type,
    url: publicUrl,
    category,
    metadata: JSON.parse(formData.get('metadata') as string || '{}'),
    localized_tags: (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean),
  });

  revalidatePath('/[locale]/vault', 'page');
  revalidatePath('/[locale]/profile/[id]', 'page');
  revalidatePath('/[locale]/dashboard', 'layout');
  
  return asset;
}

/**
 * Deletes an asset from the vault and its storage file.
 */
export async function deleteVaultAsset(assetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Get asset details to know the file path
  const { data: asset, error: fetchError } = await supabase
    .from('vault_assets')
    .select('url')
    .eq('id', assetId)
    .eq('performer_id', user.id)
    .single();

  if (fetchError || !asset) throw new Error('Asset not found or unauthorized');

  const urlParts = asset.url.split('vault-media/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    await supabase.storage.from('vault-media').remove([filePath]);
  }

  // 2. Delete from database
  await vaultService.deleteVaultAsset(assetId, user.id);
  
  revalidatePath('/[locale]/vault', 'page');
  revalidatePath('/[locale]/profile/[id]', 'page');
  revalidatePath('/[locale]/dashboard', 'layout');

  return { success: true };
}
