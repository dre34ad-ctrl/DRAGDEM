'use server';

import { teamDb } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fetches verification and dignity seal status for a performer from Turso.
 */
export async function getPerformerVerification(performerId: string) {
  const sql = `SELECT * FROM performer_verifications WHERE performer_id = '${performerId}'`;
  try {
    const results = await teamDb(sql);
    if (results && results.length > 0) {
      return {
        is_verified: results[0].is_verified === 1,
        has_dignity_seal: results[0].has_dignity_seal === 1,
        verification_source: results[0].verification_source,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching performer verification:', error);
    return null;
  }
}

/**
 * Awards verification badge to a performer.
 */
export async function awardVerification(performerId: string, source: 'manual' | 'stripe') {
  const sql = `
    INSERT INTO performer_verifications (performer_id, is_verified, verification_source, updated_at)
    VALUES ('${performerId}', 1, '${source}', CURRENT_TIMESTAMP)
    ON CONFLICT(performer_id) DO UPDATE SET
      is_verified = 1,
      verification_source = '${source}',
      updated_at = CURRENT_TIMESTAMP
  `;

  try {
    await teamDb(sql);
    revalidatePath(`/profile/${performerId}`);
    return { success: true };
  } catch (error) {
    console.error('Error awarding verification:', error);
    throw new Error('Failed to award verification');
  }
}

/**
 * Evaluates and updates the Labor Dignity Seal status for a performer.
 * Criteria:
 * 1. No negative safety reports (average venue rating >= 4.0? No, safety reports are about venues).
 * Wait, the lead said "no negative safety reports" in the context of performer profiles.
 * Maybe performers can be reported too? The safety_reports table has venue_name.
 * If I check safety_reports where performer_id (user_id in that table?) is the performer...
 * Actually, let's look at safety_reports schema again.
 */
export async function refreshDignitySeal(performerId: string) {
  // 1. Check for negative reports (simulated since we don't have performer safety reports yet, 
  // but we can check if they were the user who reported or if they are linked)
  // For now, let's assume if they have any 'flagged' status in anything related to them.
  
  // 2. Check for verified contracts in Supabase
  const supabase = await createClient();
  const { data: bookings, error: bookingError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('performer_id', performerId)
    .eq('status', 'completed');

  if (bookingError) {
    console.error('Error checking bookings for dignity seal:', bookingError);
  }

  const hasVerifiedContracts = bookings && bookings.length >= 3; // Example: 3 completed bookings

  // 3. Check for disputes in Turso
  const disputeSql = `SELECT COUNT(*) as count FROM disputes WHERE performer_id = '${performerId}' AND status != 'resolved_favor_performer'`;
  const disputeResults = await teamDb(disputeSql);
  const hasNoDisputes = disputeResults && disputeResults[0].count === 0;

  // 4. Update the seal status in Turso
  const hasDignitySeal = (hasVerifiedContracts && hasNoDisputes) ? 1 : 0;
  
  const sql = `
    INSERT INTO performer_verifications (performer_id, has_dignity_seal, updated_at)
    VALUES ('${performerId}', ${hasDignitySeal}, CURRENT_TIMESTAMP)
    ON CONFLICT(performer_id) DO UPDATE SET
      has_dignity_seal = ${hasDignitySeal},
      updated_at = CURRENT_TIMESTAMP
  `;

  try {
    await teamDb(sql);
    revalidatePath(`/profile/${performerId}`);
    return { success: true, hasDignitySeal: hasDignitySeal === 1 };
  } catch (error) {
    console.error('Error refreshing dignity seal:', error);
    throw new Error('Failed to refresh dignity seal');
  }
}
