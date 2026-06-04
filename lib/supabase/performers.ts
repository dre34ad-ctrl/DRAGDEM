import { createClient } from './server';

export interface SearchFilters {
  query?: string;
  location?: string;
  category?: string;
  minRate?: number;
  maxRate?: number;
  limit?: number;
  offset?: number;
}

export async function searchPerformers(filters: SearchFilters) {
  const {
    query,
    location,
    category,
    minRate,
    maxRate,
    limit = 20,
    offset = 0
  } = filters;

  const supabase = await createClient();

  // Basic query on performer_profiles
  let supabaseQuery = supabase
    .from('performer_profiles')
    .select(`
      *,
      users (
        image_url
      ),
      media_kits (
        id,
        act_clips (
          genre
        )
      )
    `, { count: 'exact' });

  if (query) {
    supabaseQuery = supabaseQuery.ilike('stage_name', `%${query}%`);
  }

  if (location) {
    supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
  }

  // category filtering via act_clips genre
  if (category) {
    // We use a filter on the joined table. 
    // In Supabase, this filters the joined rows, but not the parent rows unless we use !inner
    supabaseQuery = supabase.from('performer_profiles').select(`
      *,
      users (
        image_url
      ),
      media_kits!inner (
        id,
        act_clips!inner (
          genre
        )
      )
    `, { count: 'exact' })
    .eq('media_kits.act_clips.genre', category);
    
    // Re-apply other filters if we had to restart the query for !inner
    if (query) supabaseQuery = supabaseQuery.ilike('stage_name', `%${query}%`);
    if (location) supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
  }

  const { data, error, count } = await supabaseQuery
    .order('search_priority', { ascending: false, nullsFirst: false })
    .order('last_pulse_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error searching performers:', error);
    throw error;
  }

  return {
    performers: data || [],
    totalCount: count || 0
  };
}
