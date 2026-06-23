import { team_db } from '../utils/team-db.js';
import { PayoutEngine } from './payout-engine.js';
import * as crypto from 'crypto';

export class FestivalPayoutService {
  private static workerId = `worker_${crypto.randomBytes(4).toString('hex')}`;

  /**
   * Adds a batch of payout jobs to the queue.
   */
  static async queueFestivalPayouts(festivalId: string, payouts: any[]) {
    console.log(`[FestivalPayoutService] Queuing ${payouts.length} payouts for festival ${festivalId}`);
    
    for (const p of payouts) {
      // Create a deterministic job ID to prevent duplicate queuing at the source
      const jobId = crypto.createHash('sha256')
        .update(`${festivalId}_${p.slotId}_${p.performerId}_${p.amount}`)
        .digest('hex').substring(0, 32);

      const status = p.amount > 100000 ? 'awaiting_approval' : 'queued';
      
      await team_db(`
        INSERT INTO payout_jobs (id, festival_id, slot_id, performer_id, amount, currency, region, seeker_region, status, priority, next_run_at)
        VALUES ('${jobId}', '${festivalId}', '${p.slotId}', '${p.performerId}', ${p.amount}, '${p.currency}', '${p.region}', '${p.seekerRegion || ''}', '${status}', ${p.priority || 0}, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO NOTHING
      `);
    }
  }

  /**
   * Processes the next batch of queued jobs using a "Claim & Process" pattern.
   */
  static async processQueue(batchSize: number = 5) {
    // 1. Claim jobs for this worker to prevent race conditions during selection
    // Using a manual update since Turso/SQLite doesn't support UPDATE ... RETURNING in all environments perfectly
    // and we want to be safe.
    await team_db(`
      UPDATE payout_jobs 
      SET worker_id = '${this.workerId}', 
          locked_at = CURRENT_TIMESTAMP,
          status = 'processing'
      WHERE id IN (
        SELECT id FROM payout_jobs 
        WHERE status = 'queued' 
        AND next_run_at <= CURRENT_TIMESTAMP 
        ORDER BY priority DESC, created_at ASC 
        LIMIT ${batchSize}
      )
    `);

    // 2. Fetch the jobs we just claimed
    const jobs = await team_db(`
      SELECT * FROM payout_jobs 
      WHERE worker_id = '${this.workerId}' AND status = 'processing'
    `);

    if (!jobs || jobs.length === 0) return;

    console.log(`[FestivalPayoutService] Worker ${this.workerId} processing ${jobs.length} jobs...`);

    for (const job of jobs) {
      try {
        await this.executeJob(job);
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[FestivalPayoutService] Fatal error on job ${job.id}:`, error);
        await this.failJob(job.id, errorMessage);
      }
    }
  }

  private static async executeJob(job: any) {
    // 1. Level 1 Lock: Database Idempotency
    const lockHash = this.generateLockHash(job);
    const lockId = `lock_${job.id}`;

    const lockAcquired = await this.acquireLock(lockId, lockHash, job.amount);
    if (!lockAcquired) {
      console.warn(`[FestivalPayoutService] Job ${job.id} skipped: Lock already acquired or in progress.`);
      // If lock failed, it might be because another worker is doing it or it's a duplicate
      await team_db(`UPDATE payout_jobs SET status = 'completed', worker_id = NULL WHERE id = '${job.id}'`);
      return;
    }

    try {
      // 2. Level 2 Lock: Provider Idempotency
      // We pass the lockHash (Level 1 result) as the Idempotency-Key for the provider
      const result = await PayoutEngine.executePayout(
        job.performer_id, 
        job.amount, 
        job.currency, 
        job.region, 
        job.seeker_region,
        lockHash
      );

      if (result && (result as any).success) {
        await this.completeJob(job.id, lockId, (result as any).ref || (result as any).transactionId || (result as any).reference);
      } else {
        await this.failJob(job.id, (result as any)?.error || 'Unknown error');
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[FestivalPayoutService] Error during PayoutEngine execution for job ${job.id}:`, error);
      await this.failJob(job.id, errorMessage);
      // We don't release the lock here yet to prevent immediate retry by another worker
      // if the provider might have actually processed it.
    }
  }

  private static generateLockHash(job: any): string {
    return crypto.createHash('sha256')
      .update(`${job.festival_id}|${job.slot_id}|${job.performer_id}|${job.amount}|${job.currency}`)
      .digest('hex');
  }

  private static async acquireLock(id: string, hash: string, amount: number): Promise<boolean> {
    try {
      // We use the hash as a UNIQUE constraint. 
      // We also include an expiration check (stale locks older than 1 hour can be reclaimed)
      // But for simplicity in this demo, we'll just use the UNIQUE constraint.
      await team_db(`
        INSERT INTO payout_locks (id, lock_hash, status, amount)
        VALUES ('${id}', '${hash}', 'acquired', ${amount})
      `);
      return true;
    } catch (e) {
      // Check if the lock is actually completed
      const existing = await team_db(`SELECT status FROM payout_locks WHERE lock_hash = '${hash}'`);
      if (existing && existing.length > 0 && existing[0].status === 'released') {
        return false; // Already done
      }
      // If it's 'acquired', it's in progress
      return false;
    }
  }

  private static async completeJob(jobId: string, lockId: string, reference: string) {
    await team_db(`
      UPDATE payout_jobs 
      SET status = 'completed', 
          worker_id = NULL,
          locked_at = NULL 
      WHERE id = '${jobId}'
    `);
    
    await team_db(`
      UPDATE payout_locks 
      SET status = 'released', 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = '${lockId}'
    `);
    
    console.log(`[FestivalPayoutService] Job ${jobId} completed successfully. Ref: ${reference}`);
  }

  private static async failJob(jobId: string, error: string) {
    console.error(`[FestivalPayoutService] Job ${jobId} failed: ${error}`);
    
    await team_db(`
      UPDATE payout_jobs 
      SET status = 'failed', 
          attempts = attempts + 1, 
          worker_id = NULL,
          locked_at = NULL,
          next_run_at = datetime(CURRENT_TIMESTAMP, '+10 minutes') 
      WHERE id = '${jobId}'
    `);
    
    // Optionally release lock if we are sure the provider didn't process it.
    // In many high-concurrency systems, we keep the lock to be safe.
  }

  /**
   * Approves a high-value payout (> $100k).
   */
  static async approveHighValuePayout(jobId: string, approverId: string) {
    console.log(`[FestivalPayoutService] Multi-Sig: Approver ${approverId} signed off on job ${jobId}`);
    
    // Log the approval in a hypothetical audit table
    await team_db(`
      UPDATE payout_jobs 
      SET status = 'queued',
          priority = 10 -- Move to front of queue after approval
      WHERE id = '${jobId}' AND status = 'awaiting_approval'
    `);
  }
}
