
import { PayoutEngine } from './lib/services/payout-engine';

async function testThaiPayout() {
  console.log('--- Testing Thai Payout Routing ---');
  const decision = PayoutEngine.getOptimalProvider('TH', 'THB', 5000);
  console.log('Decision for TH/THB:', JSON.stringify(decision, null, 2));

  console.log('\n--- Testing PromptPay Payout Execution ---');
  // Mock user and data
  const userId = 'user_thai_artist_123';
  const amount = 5000;
  const currency = 'THB';
  const region = 'TH';
  const seekerRegion = 'TH';

  // We need to bypass compliance check in the actual execution or mock it
  // For this script, we'll just check if the routing works in executePayout
  
  // Note: executePayout will fail if user not in DB, so we might just test the routing logic
  // or manually call the internal method if possible (it's private though)
  
  try {
    const result = await PayoutEngine.executePayout(userId, amount, currency, region, seekerRegion, 'test_pp_123');
    console.log('Execution Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Execution Failed (Expected if user not in DB):', err.message);
  }
}

testThaiPayout();
