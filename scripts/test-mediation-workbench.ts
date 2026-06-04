import { MediationService } from '../lib/services/mediation-service.js';
import { team_db } from '../lib/utils/team-db.js';

async function testMediation() {
  console.log('--- STARTING MEDIATOR WORKBENCH TEST ---');

  // 1. Setup
  console.log('\n[1] Seeding Settlement Precedents...');
  await MediationService.seedPrecedents();

  // 2. Open Dispute
  console.log('\n[2] Opening a high-value dispute ($120k)...');
  const result = await MediationService.openDispute({
    booking_id: 'BK-999',
    festival_id: 'FEST-2032-BERLIN',
    client_id: 'CLIENT-BERLIN-EVENTS',
    performer_id: 'PERF-GLAM-STAR',
    amount: 120000,
    currency: 'EUR',
    reason: 'Reported technical failure: lighting rig did not match technical rider specifications.'
  });

  console.log('\n[3] Automated Triage Results:');
  console.log(JSON.stringify(result, null, 2));

  // 3. Multi-Sig Workflow
  console.log('\n[4] Simulating Multi-Sig Workflow (2-of-3 signatures)...');
  
  console.log(' - Client signs...');
  await MediationService.multiSigSign(result.id, 'client', 'SIG_CLIENT_123');
  
  console.log(' - Mediator reviews AI Evidence and signs override...');
  const finalStatus = await MediationService.multiSigSign(result.id, 'mediator', 'SIG_MEDIATOR_XYZ');
  
  console.log('\n[5] Final Multi-Sig Status:');
  console.log(JSON.stringify(finalStatus, null, 2));

  // 4. Verification
  const dispute = (await team_db(`SELECT * FROM disputes WHERE id = '${result.id}'`))[0];
  const evidence = await team_db(`SELECT * FROM dispute_evidence WHERE dispute_id = '${result.id}'`);

  console.log('\n--- VERIFICATION REPORT ---');
  console.log(`Dispute Status: ${dispute.status}`);
  console.log(`Multi-Sig Status: ${dispute.multi_sig_status}`);
  console.log(`Resolution: ${dispute.resolution_summary}`);
  console.log(`Evidence Pieces Collected: ${evidence.length}`);

  if (dispute.status === 'resolved' && dispute.multi_sig_status === 'fully_signed') {
    console.log('\nSUCCESS: Mediator Workbench integrated and functional.');
  } else {
    console.error('\nFAILURE: Workflow incomplete.');
  }

  console.log('\n--- TEST COMPLETE ---');
}

testMediation().catch(console.error);
