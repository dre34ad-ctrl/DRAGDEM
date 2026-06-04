'use server';

import { searchPerformers, SearchFilters } from '@/lib/supabase/performers';

export async function searchPerformersAction(filters: SearchFilters) {
  try {
    const result = await searchPerformers(filters);
    return { success: true, ...result };
  } catch (error) {
    console.error('Search action failed:', error);
    return { success: false, error: 'Failed to search performers' };
  }
}
