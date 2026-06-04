'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { calculateFees } from '../utils/fees';
import { DLocalService } from '../services/dlocal';
import { formatAmountForStripe } from '../utils/stripe-helpers';

import { FXService } from '../services/fx-service';

export async function initiatePayout(bookingId: string, options: { rateLockId?: string } = {}) {
  const supabase = await createClient();
  
  // 1. Get booking and escrow info
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, escrow:escrow_transactions(*)')
    .eq('id', bookingId)
    .single();

  if (!booking || !booking.escrow || booking.escrow.status !== 'released') {
    throw new Error('Escrow not released yet');
  }

  // 2. Get performer's payout method and region info
  const { data: performer } = await supabase
    .from('users')
    .select('id, region, payout_provider, national_id, display_name, tax_regime, postal_code, vat_rate')
    .eq('id', booking.performer_id)
    .single();

  if (!performer) throw new Error('Performer not found');

  // 2b. Get seeker info for tax compliance
  const { data: seeker } = await supabase
    .from('talent_seeker_profiles')
    .select('*')
    .eq('user_id', booking.seeker_id)
    .single();

  const { data: payoutMethod } = await supabase
    .from('payout_methods')
    .select('*')
    .eq('performer_id', performer.id)
    .eq('is_default', true)
    .single();

  if (!payoutMethod) throw new Error('No default payout method found');

  // 2c. Calculate YTD revenue for VAT/GST thresholds
  const currentYear = new Date().getFullYear();
  const { data: ytdTransactions } = await supabase
    .from('escrow_transactions')
    .select('amount')
    .eq('performer_id', performer.id)
    .eq('status', 'released')
    .gte('created_at', `${currentYear}-01-01T00:00:00Z`);

  const totalRevenueYTD = ytdTransactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  // 2d. Japan ASF Check
  if (performer.region === 'JP') {
    const policyLog = (performer as any).policy_acceptance_log;
    if (!policyLog?.asf_confirmed_at) {
      throw new Error('Payout blocked: Anti-Social Forces (ASF) confirmation missing for Japan.');
    }
  }

  // 3. Calculate Fees
  const isB2B = seeker?.verification_tier === 'corporate';
  const seekerRegion = seeker?.region || 'US';
  
  // France GUSO logic: applies for one-off bookings by non-corporate seekers in France
  const derivedTaxRegime = (seekerRegion === 'FR' && !isB2B && performer.region === 'FR') 
    ? 'GUSO' 
    : performer.tax_regime;

  const fees = calculateFees({
    amount: booking.total_fee,
    performerRegion: performer.region || 'US',
    seekerRegion: seekerRegion,
    isB2B,
    performerTaxRegime: derivedTaxRegime,
    performerVatRate: performer.vat_rate,
    totalRevenueYTD,
    hasTNumber: !!performer.national_id && performer.region === 'JP', // Japan specific
    hasVerifiedABN: !!performer.national_id && performer.region === 'AU', // Australia specific
  });

  let netPayout = fees.netPayout;

  // 3b. Volatility Protection (Rate Lock Application)
  let lockedRate: number | undefined = undefined;
  if (options.rateLockId) {
    const rate = await FXService.getLockedRate(options.rateLockId, performer.id);
    if (rate) {
      lockedRate = rate;
      console.log(`[Payout] Using locked FX rate: ${lockedRate}`);
    }
  }

  // 4. Routing Logic (Provider Switch)
  
  // dLocal Regions (Emerging Markets with specific local rails)
  const isDLocalRegion = ['BR', 'TH', 'MX'].includes(performer.region || '');
  
  // Local Rails Regions (Phase 3)
  const isStripeConnectRegion = ['US', 'GB', 'AU', 'JP', 'DE', 'ES', 'CA'].includes(performer.region || '');

  if (isDLocalRegion && payoutMethod.type !== 'stripe') {
    return await processDLocalPayout(booking, performer, payoutMethod, netPayout, lockedRate);
  } else if (isStripeConnectRegion || performer.payout_provider === 'stripe' || payoutMethod.type === 'stripe') {
    return await processStripeTransfer(booking, payoutMethod, netPayout);
  } else {
    // Fallback or generic bank transfer (could be batch processed via local rails)
    return await processAlternativePayout(booking, payoutMethod, netPayout);
  }
}

async function processDLocalPayout(booking: any, user: any, method: any, netAmount: number, lockedRate?: number) {
  const payout = await DLocalService.createPayout({
    amount: netAmount,
    currency: booking.currency,
    country: user.region,
    payout_method: method.type.toUpperCase() as 'PIX' | 'PROMPTPAY' | 'SPEI',
    beneficiary: DLocalService.formatBeneficiary(user, method),
    external_id: booking.id,
  });

  const supabase = await createClient();
  await supabase.from('payouts').insert({
    booking_id: booking.id,
    amount: netAmount,
    currency: booking.currency,
    status: 'pending',
    method_id: method.id,
    transaction_ref: payout.id,
    fx_rate: lockedRate, // Store the locked rate for audit
  });

  return { success: true, dlocalId: payout.id };
}

async function processStripeTransfer(booking: any, payoutMethod: any, netAmount: number) {
  // Use specialized formatter for Stripe amounts (handles zero-decimal currencies like JPY)
  const stripeAmount = formatAmountForStripe(netAmount, booking.currency || 'usd');

  // Ensure currency is supported or defaulted
  const currency = booking.currency?.toLowerCase() || 'usd';

  // Stripe Connect Transfer
  const transfer = await stripe.transfers.create({
    amount: stripeAmount,
    currency: currency,
    destination: payoutMethod.details.stripe_account_id,
    metadata: { 
      booking_id: booking.id,
      region: payoutMethod.region
    },
  });

  return { transferId: transfer.id };
}

async function processAlternativePayout(booking: any, payoutMethod: any, netAmount: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('payouts')
    .insert({
      user_id: booking.performer_id,
      booking_id: booking.id,
      amount: netAmount,
      currency: booking.currency,
      provider: payoutMethod.type,
      status: 'pending_batch',
      method_id: payoutMethod.id,
      details: payoutMethod.details,
    });

  if (error) throw error;
  
  return { success: true, status: 'pending_batch' };
}
