
import { calculateFees } from './lib/utils/fees';

async function smokeTest() {
  console.log("Starting Smoke Test for Payment Flow (Phase 13)...");

  // Case 1: Mexico B2B RESICO
  const mxParams = {
    amount: 1000,
    performerRegion: 'MX',
    seekerRegion: 'MX',
    isB2B: true,
    performerTaxRegime: 'RESICO',
    performerVatRate: 0.16,
  };

  const mxFees = calculateFees(mxParams);
  console.log("\n--- Mexico B2B RESICO Test ---");
  console.log("Input Amount:", mxParams.amount);
  console.log("Subtotal:", mxFees.subtotal);
  console.log("Seeker Platform Fee (0.3%):", mxFees.seekerPlatformFee);
  console.log("Performer Platform Fee (0.3%):", mxFees.performerPlatformFee);
  console.log("VAT Amount (16%):", mxFees.vatAmount);
  console.log("Withholdings:", mxFees.withholdings);
  console.log("Total Withholdings:", mxFees.totalWithholdings);
  console.log("Net Payout:", mxFees.netPayout);
  
  const totalPaidBySeeker = mxFees.subtotal + mxFees.vatAmount + mxFees.seekerPlatformFee;
  console.log("Total Paid by Seeker:", totalPaidBySeeker);
  console.log("Expected Platform Revenue (before Stripe costs):", mxFees.seekerPlatformFee + mxFees.performerPlatformFee);

  // Verification
  const expectedISR = 1000 * 0.0125; // 12.50
  const expectedIVAWithholding = 1000 * 0.1066; // 106.60
  if (mxFees.withholdings.find(w => w.name === 'ISR (MX)')?.amount !== expectedISR) {
      console.error("FAIL: ISR calculation incorrect");
  } else {
      console.log("PASS: ISR calculation correct");
  }
  
  if (mxFees.withholdings.find(w => w.name === 'IVA Withholding (MX)')?.amount !== expectedIVAWithholding) {
      console.error("FAIL: IVA Withholding calculation incorrect");
  } else {
      console.log("PASS: IVA Withholding calculation correct");
  }

  // Case 2: France GUSO
  const frParams = {
    amount: 1000,
    performerRegion: 'FR',
    seekerRegion: 'FR',
    isB2B: false,
    performerTaxRegime: 'GUSO',
  };
  
  const frFees = calculateFees(frParams);
  console.log("\n--- France Private GUSO Test ---");
  console.log("Input Amount:", frParams.amount);
  console.log("GUSO Liability Amount (35%):", frFees.gusoLiabilityAmount);
  console.log("Net Payout:", frFees.netPayout);
  
  if (frFees.gusoLiabilityAmount === 350) {
      console.log("PASS: GUSO liability correct");
  } else {
      console.error("FAIL: GUSO liability incorrect");
  }


  // Case 3: Simulation of initiatePayout routing
  console.log("\n--- Payout Routing Simulation ---");
  const performers = [
      { id: 'p1', region: 'BR', payout_provider: 'dlocal' },
      { id: 'p2', region: 'MX', payout_provider: 'stripe' },
      { id: 'p3', region: 'FR', payout_provider: 'stripe' },
      { id: 'p4', region: 'DE', payout_provider: 'stripe' }
  ];

  performers.forEach(performer => {
      const isDLocalRegion = ['BR', 'TH', 'MX'].includes(performer.region);
      const isStripeConnectRegion = ['US', 'GB', 'AU', 'JP', 'DE', 'ES', 'CA'].includes(performer.region);
      
      let provider = 'unknown';
      if (isDLocalRegion && performer.payout_provider !== 'stripe') {
          provider = 'dLocal';
      } else if (isStripeConnectRegion || performer.payout_provider === 'stripe') {
          provider = 'Stripe Connect';
      }
      
      console.log(`Performer ${performer.id} (${performer.region}): Routes to ${provider}`);
  });
}

smokeTest().catch(console.error);
