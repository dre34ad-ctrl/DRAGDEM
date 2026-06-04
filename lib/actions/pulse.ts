'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreatePulsePostData {
  content: string;
  category: 'global_news' | 'regional_news' | 'backstage' | 'platform_update';
  title?: string;
  region?: string;
  media_url?: string;
  linked_asset_id?: string;
}

/**
 * Creates a new Pulse post.
 */
export async function createPulsePost(data: CreatePulsePostData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: post, error } = await supabase
    .from('pulse_posts')
    .insert({
      author_id: user.id,
      title: data.title,
      content: data.content,
      category: data.category,
      region: data.region,
      media_url: data.media_url,
      linked_asset_id: data.linked_asset_id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating pulse post:', error);
    throw error;
  }

  // Gamification: Update performer's search priority and last pulse timestamp
  try {
    const { data: profile } = await supabase
      .from('performer_profiles')
      .select('search_priority')
      .eq('user_id', user.id)
      .single();

    const currentPriority = profile?.search_priority || 0;
    
    // Increment search_priority by 1 (max 10 as per UI components)
    const newPriority = Math.min(10, currentPriority + 1);

    await supabase
      .from('performer_profiles')
      .update({ 
        search_priority: newPriority,
        last_pulse_at: new Date().toISOString()
      })
      .eq('user_id', user.id);
  } catch (boostError) {
    console.error('Failed to update search priority boost:', boostError);
    // We don't throw here to avoid failing the post creation if just the boost fails
  }

  // Revalidate relevant paths
  revalidatePath('/[locale]/dashboard', 'layout');
  revalidatePath('/[locale]/search', 'page');
  
  return post;
}

/**
 * Fetches Pulse posts with optional filtering.
 */
export async function getPulsePosts(options: { 
  category?: string; 
  region?: string; 
  performerId?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('pulse_posts')
    .select(`
      *,
      author:users (
        id,
        display_name,
        image_url,
        performer_profiles (
          stage_name,
          vanity_url
        )
      ),
      asset:vault_assets (
        id,
        name,
        url,
        category
      )
    `)
    .order('created_at', { ascending: false });

  if (options.category) query = query.eq('category', options.category);
  if (options.region) query = query.eq('region', options.region);
  if (options.performerId) query = query.eq('author_id', options.performerId);
  
  if (options.limit) {
    const from = options.offset || 0;
    const to = from + options.limit - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pulse posts:', error);
    throw error;
  }

  return data || [];
}

/**
 * Adds a 'Snap' (reaction) to a Pulse post.
 */
export async function snapPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('pulse_reactions')
    .insert({
      post_id: postId,
      user_id: user.id,
    });

  if (error) {
    if (error.code === '23505') return { success: true }; // Unique violation = already snapped
    console.error('Error snapping post:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Removes a 'Snap' from a Pulse post.
 */
export async function unsnapPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('pulse_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error unsnapping post:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Checks if the current user has snapped a post.
 */
export async function hasUserSnapped(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from('pulse_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

/**
 * Deletes a Pulse post.
 */
export async function deletePulsePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Verify ownership
  const { data: post, error: fetchError } = await supabase
    .from('pulse_posts')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) throw new Error('Post not found');
  if (post.author_id !== user.id) throw new Error('Forbidden');

  const { error: deleteError } = await supabase
    .from('pulse_posts')
    .delete()
    .eq('id', postId);

  if (deleteError) {
    console.error('Error deleting pulse post:', deleteError);
    throw deleteError;
  }

  revalidatePath('/[locale]/dashboard', 'layout');
  
  return { success: true };
}
