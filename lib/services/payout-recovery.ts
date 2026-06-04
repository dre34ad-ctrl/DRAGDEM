import { createClient } from '@/lib/supabase/server';
import { initiatePayout } from '../actions/payouts';

export class PayoutRecoveryService {
  /**
   * Scans for failed or stuck payouts and attempts recovery with concurrency limits.
   * Optimized for global scale across different regions.
   */
  static async runSettlementRecovery(region?: string) {
    const supabase = await createClient();
    
    // 1. Find payouts that failed or are stuck. 
    // If region is provided, focus on that region to allow sharding by timezone.
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    
    let query = supabase
      .from('payouts')
      .select('id, booking_id, status, retry_count, region')
      .or(`status.eq.failed,and(status.eq.pending,created_at.lt.${fourHoursAgo})`)
      .lt('retry_count', 3);

    if (region) {
      query = query.eq('region', region);
    }

    const { data: stuckPayouts, error } = await query.limit(50); // Process in batches of 50

    if (error) {
      console.error('[SettlementRecovery] Error fetching stuck payouts:', error);
      return;
    }

    console.log(`[SettlementRecovery] Found ${stuckPayouts?.length || 0} payouts for recovery${region ? ` in ${region}` : ''}.`);

    // 2. Process in parallel with a concurrency limit
    const CONCURRENCY_LIMIT = 5;
    const chunks = [];
    for (let i = 0; i < (stuckPayouts?.length || 0); i += CONCURRENCY_LIMIT) {
      chunks.push(stuckPayouts.slice(i, i + CONCURRENCY_LIMIT));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(payout => this.recoverPayout(payout)));
    }
  }

  private static async recoverPayout(payout: any) {
    const supabase = await createClient();
    try {
      console.log(`[SettlementRecovery] Retrying payout ${payout.id} for booking ${payout.booking_id}`);
      
      await supabase
        .from('payouts')
        .update({ 
          retry_count: (payout.retry_count || 0) + 1,
          status: 'retrying',
          updated_at: new Date().toISOString()
        })
        .eq('id', payout.id);

      await initiatePayout(payout.booking_id);
      
      console.log(`[SettlementRecovery] Successfully re-initiated payout for booking ${payout.booking_id}`);
    } catch (retryError) {
      console.error(`[SettlementRecovery] Failed to recover payout ${payout.id}:`, retryError);
      await supabase
        .from('payouts')
        .update({ status: 'failed' })
        .eq('id', payout.id);
    }
  }
}
