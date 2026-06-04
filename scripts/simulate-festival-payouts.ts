import { FestivalPayoutService } from '../lib/services/festival-payout-service.js';
import { team_db } from '../lib/utils/team-db.js';
import { PayoutEngine } from '../lib/services/payout-engine.js';

// --- MONKEY PATCH FOR SIMULATION ---
(PayoutEngine as any).executePayout = async (userId: string, amount: number, currency: string, region: string, idempotencyKey?: string) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { success: true, ref: `MOCK_${idempotencyKey?.substring(0, 8)}` };
};

async function simulate() {
  console.log('--- STARTING ENHANCED FESTIVAL PAYOUT SIMULATION ---');

  const festivalId = 'FEST-ENHANCED-2026';
  
  console.log('\n[0] Cleaning up...');
  try {
    await team_db(`DELETE FROM payout_jobs WHERE festival_id = '${festivalId}'`);
    await team_db(`DELETE FROM payout_locks WHERE amount IN (500, 1500, 800, 300)`);
  } catch (e) {}
  
  const payouts = [
    { slotId: 'SL-01', performerId: 'PERF-A', amount: 500, currency: 'GBP', region: 'GB', priority: 1 },
    { slotId: 'SL-02', performerId: 'PERF-B', amount: 1500, currency: 'GBP', region: 'GB', priority: 1 },
    { slotId: 'SL-03', performerId: 'PERF-C', amount: 120000, currency: 'USD', region: 'US', priority: 2 }, // High value
    { slotId: 'SL-04', performerId: 'PERF-D', amount: 800, currency: 'EUR', region: 'ES', priority: 1 },
    { slotId: 'SL-05', performerId: 'PERF-E', amount: 300, currency: 'SEK', region: 'SE', priority: 1 },
  ];

  const batch = [];
  for (let i = 0; i < 5; i++) {
    batch.push(...payouts);
  }

  console.log(`\n[1] Queuing batch of ${batch.length} jobs (including many duplicates)...`);
  await FestivalPayoutService.queueFestivalPayouts(festivalId, batch);

  console.log('\n[2] Simulating high-concurrency worker processing (5 parallel workers)...');
  
  const workers = [
    FestivalPayoutService.processQueue(10),
    FestivalPayoutService.processQueue(10),
    FestivalPayoutService.processQueue(10),
    FestivalPayoutService.processQueue(10),
    FestivalPayoutService.processQueue(10)
  ];

  await Promise.all(workers);

  console.log('\n[3] Verifying Results:');
  
  const allJobs = await team_db(`SELECT id, status, amount FROM payout_jobs WHERE festival_id = '${festivalId}'`);
  const completed = allJobs.filter((j: any) => j.status === 'completed');
  const awaiting = allJobs.filter((j: any) => j.status === 'awaiting_approval');
  const locks = await team_db(`SELECT * FROM payout_locks WHERE amount IN (500, 1500, 800, 300)`);

  console.log(`Total jobs in DB: ${allJobs.length}`);
  console.log(`Jobs Completed: ${completed.length}`);
  console.log(`Jobs Awaiting Approval: ${awaiting.length}`);
  console.log(`Unique Locks Acquired (excluding high-value): ${locks.length}`);

  const expectedCompleted = payouts.filter(p => p.amount <= 100000).length;
  const expectedAwaiting = payouts.filter(p => p.amount > 100000).length;

  if (completed.length === expectedCompleted && awaiting.length === expectedAwaiting) {
    console.log('\nSUCCESS: No duplicate payouts occurred despite high concurrency.');
  } else {
    console.error('\nFAILURE: Job count mismatch!');
    console.error(`Expected Completed: ${expectedCompleted}, Got: ${completed.length}`);
    console.error(`Expected Awaiting: ${expectedAwaiting}, Got: ${awaiting.length}`);
  }

  console.log('\n--- SIMULATION COMPLETE ---');
}

simulate().catch(console.error);
