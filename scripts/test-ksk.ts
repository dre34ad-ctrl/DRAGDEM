import { PayoutEngine } from '../lib/services/payout-engine.js';
import { TaxService } from '../lib/services/tax-service.js';
import { ComplianceService } from '../lib/services/compliance-service.js';

async function testKSK() {
  console.log('--- Testing German KSK Detection ---');

  // Mock Compliance
  (ComplianceService as any).checkPayoutCompliance = async () => ({ compliant: true });

  const userId = 'PERF-GERMANY-KSK';
  const amount = 1000;
  const currency = 'EUR';
  const region = 'DE';
  const seekerRegion = 'DE';

  console.log(`Executing payout for ${userId} (Domestic Germany)...`);
  const result = await PayoutEngine.executePayout(userId, amount, currency, region, seekerRegion, 'test-ksk-key');

  console.log('Result:', JSON.stringify(result, null, 2));
}

testKSK().catch(console.error);
