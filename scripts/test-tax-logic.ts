import { TaxService } from '../lib/services/tax-service.js';

async function test() {
  console.log('--- Testing TaxService German KSK ---');
  const result = await TaxService.calculateGlobalTax({
    amount: 1000,
    performerRegion: 'DE',
    seekerRegion: 'DE',
    performerTaxRegime: 'KSK'
  });
  console.log(JSON.stringify(result, null, 2));
  
  if (result.withholdings.find(w => w.name === 'KSK Contribution (DE)') && result.isLiabilityToVenue === true) {
    console.log('SUCCESS: KSK Contribution detected and marked as venue liability.');
  } else {
    console.log('FAILURE: KSK Contribution logic failed.');
  }
}

test().catch(console.error);
