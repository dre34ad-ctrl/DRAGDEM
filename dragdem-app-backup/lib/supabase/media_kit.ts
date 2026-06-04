import { createClient } from './server';

export async function getMediaKit(performerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media_kits')
    .select('*')
    .eq('performer_id', performerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function updateMediaKit(performerId: string, updates: { hero_reel_url?: string, press_photos?: string[] }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media_kits')
    .upsert({
      performer_id: performerId,
      ...updates
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listActClips(mediaKitId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('act_clips')
    .select('*')
    .eq('media_kit_id', mediaKitId);

  if (error) throw error;
  return data;
}

export async function addActClip(clip: { media_kit_id: string, title: string, clip_url: string, genre: string, rider_template_id?: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('act_clips')
    .insert(clip)
    .select()
    .single();

  if (error) throw error;
  return data;
}
