'use server';

import { teamDb } from '../db';
import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export interface Masterclass {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  reading_time: number;
  pro_only: boolean;
  thumbnail_url: string;
  video_url?: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface MasterclassProgress {
  masterclass_id: string;
  completed_at: string | null;
  last_read_at: string;
  progress_percent: number;
}

export async function getMasterclasses(category?: string) {
  let sql = 'SELECT * FROM masterclasses';
  if (category && category !== 'All') {
    sql += ` WHERE category = '${category}'`;
  }
  sql += ' ORDER BY created_at DESC';
  
  const results = await teamDb(sql);
  return results as Masterclass[];
}

export async function getMasterclassBySlug(slug: string) {
  const results = await teamDb(`SELECT * FROM masterclasses WHERE slug = '${slug}'`);
  if (!results || results.length === 0) return null;
  
  const masterclass = results[0] as Masterclass;

  // Security Check for Pro Content
  if (masterclass.pro_only) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // In a real app, we'd check the user's subscription tier in the database
    // For this implementation, we'll check if they have a 'pro' metadata or similar
    // Mocking the check for now:
    const isPro = user?.user_metadata?.subscription_tier === 'pro' || user?.email?.includes('pro');
    
    if (!isPro) {
      // Return a partial object or throw error
      return {
        ...masterclass,
        content: "RESTRICTED: This content is exclusive to Verified Pro members.",
        is_locked: true,
        toolkit: []
      };
    }
  }
  
  // Fetch toolkit
  const toolkit = await teamDb(`SELECT * FROM masterclass_toolkit WHERE masterclass_id = '${masterclass.id}'`);
  
  return {
    ...masterclass,
    toolkit: toolkit || []
  };
}

export async function getMasterclassProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const results = await teamDb(`SELECT * FROM masterclass_progress WHERE user_id = '${user.id}'`);
  return results as MasterclassProgress[];
}

export async function updateMasterclassProgress(masterclassId: string, progressPercent: number, completed: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const completedAt = completed ? `'${new Date().toISOString()}'` : 'NULL';
  const id = `${user.id}_${masterclassId}`; // Simplified ID for SQLite

  const sql = `
    INSERT INTO masterclass_progress (id, user_id, masterclass_id, progress_percent, completed_at, last_read_at)
    VALUES ('${id}', '${user.id}', '${masterclassId}', ${progressPercent}, ${completedAt}, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, masterclass_id) DO UPDATE SET
      progress_percent = excluded.progress_percent,
      completed_at = COALESCE(masterclass_progress.completed_at, excluded.completed_at),
      last_read_at = CURRENT_TIMESTAMP
  `;

  await teamDb(sql);
  revalidatePath('/masterclass');
  return { success: true };
}
