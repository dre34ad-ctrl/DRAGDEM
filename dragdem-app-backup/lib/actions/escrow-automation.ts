import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { initiatePayout } from './payouts';

/**
 * This function should be called by a scheduled job (e.g., Vercel Cron or GitHub Action)
 * It checks for all held escrows where the release date has passed and no dispute exists.
 */
export async function autoReleaseEscrow() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. Fetch held transactions where release_date <= now
  const { data: transactions, error } = await supabase
    .from('escrow_transactions')
    .select('*, booking:bookings(id, status)')
    .eq('status', 'held')
    .lte('release_date', now);

  if (error) throw error;
  if (!transactions) return { processed: 0 };

  const results = [];

  for (const tx of transactions) {
    // 2. Skip if there's an active dispute
    if (tx.booking.status === 'disputed') {
      console.log(`Skipping escrow release for booking ${tx.booking_id} due to dispute.`);
      continue;
    }

    try {
      // 3. Capture Stripe payment
      await stripe.paymentIntents.capture(tx.stripe_payment_intent_id!);

      // 4. Update status to released
      await supabase
        .from('escrow_transactions')
        .update({ status: 'released', updated_at: new Date().toISOString() })
        .eq('id', tx.id);

      // 5. Update booking to completed if not already
      await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', tx.booking_id);

      // 6. Trigger payout
      await initiatePayout(tx.booking_id);

      results.push({ id: tx.id, status: 'released' });
    } catch (err: any) {
      console.error(`Failed to release escrow ${tx.id}:`, err.message);
      results.push({ id: tx.id, status: 'error', error: err.message });
    }
  }

  return { processed: results.length, results };
}

export async function lockEscrowForDispute(bookingId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('escrow_transactions')
    .update({ status: 'disputed' })
    .eq('booking_id', bookingId);

  if (error) throw error;
  return { success: true };
}
