import { PayoutEngine } from '../lib/services/payout-engine.js';
import { ComplianceService } from '../lib/services/compliance-service.js';

async function test() {
  console.log('--- Testing PayoutEngine with German KSK ---');
  
  // Mock Compliance
  (ComplianceService as any).checkPayoutCompliance = async () => ({
    compliant: true,
    context: {
      taxRegime: 'KSK',
      hasTNumber: true
    }
  });

  const result = await PayoutEngine.executePayout(
    'PERF-GERMANY-KSK',
    1000,
    'EUR',
    'DE',
    'DE',
    'test-key'
  );
  
  console.log('Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);
