import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { initiatePayout } from './payouts';

export type ResolutionType = 'release' | 'refund' | 'partial';

export async function resolveDisputeAction({
  disputeId,
  bookingId,
  resolution,
  percentage,
  internalNotes,
}: {
  disputeId: string;
  bookingId: string;
  resolution: ResolutionType;
  percentage: number;
  internalNotes: string;
}) {
  const supabase = await createClient();

  // 1. Fetch the dispute and transaction details
  const { data: dispute, error: disputeError } = await supabase
    .from('disputes')
    .select(`
      *,
      bookings (
        *,
        escrow_transactions (*)
      )
    `)
    .eq('id', disputeId)
    .single();

  if (disputeError || !dispute) throw new Error('Dispute not found');

  const booking = dispute.bookings;
  const transaction = booking.escrow_transactions[0];

  if (!transaction || transaction.status !== 'disputed') {
    throw new Error('No active disputed transaction found for this booking');
  }

  const paymentIntentId = transaction.stripe_payment_intent_id;
  const totalAmount = transaction.amount; // in cents

  try {
    if (resolution === 'release') {
      // 100% to Performer
      await stripe.paymentIntents.capture(paymentIntentId);
      
      await supabase.from('escrow_transactions').update({
        status: 'released',
        resolved_at: new Date().toISOString()
      }).eq('id', transaction.id);

      await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId);
      await initiatePayout(bookingId);

    } else if (resolution === 'refund') {
      // 100% to Seeker
      await stripe.paymentIntents.cancel(paymentIntentId);

      await supabase.from('escrow_transactions').update({
        status: 'refunded',
        resolved_at: new Date().toISOString()
      }).eq('id', transaction.id);

      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);

    } else if (resolution === 'partial') {
      // Split between Seeker and Performer
      // percentage is amount to return to SEEKER. So (100 - percentage) is released to Performer.
      // totalAmount is assumed to be in dollars (e.g. 500.00), Stripe needs cents.
      const performerShareInCents = Math.floor((totalAmount * 100) * ((100 - percentage) / 100));
      
      if (performerShareInCents > 0) {
        await stripe.paymentIntents.capture(paymentIntentId, {
          amount_to_capture: performerShareInCents,
        });
        
        await supabase.from('escrow_transactions').update({
          status: 'partially_released',
          amount_released: performerShareInCents / 100,
          amount_refunded: totalAmount - (performerShareInCents / 100),
          resolved_at: new Date().toISOString()
        }).eq('id', transaction.id);

        await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId);
        await initiatePayout(bookingId);
      } else {
        // Effectively a full refund
        await stripe.paymentIntents.cancel(paymentIntentId);
        await supabase.from('escrow_transactions').update({
          status: 'refunded',
          resolved_at: new Date().toISOString()
        }).eq('id', transaction.id);
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      }
    }

    // 2. Update Dispute Status
    await supabase.from('disputes').update({
      status: 'resolved',
      resolution_summary: resolution,
      mediator_notes: internalNotes,
      resolved_at: new Date().toISOString()
    }).eq('id', disputeId);

    return { success: true };
  } catch (err: any) {
    console.error('Resolution Error:', err.message);
    throw new Error(`Failed to resolve dispute: ${err.message}`);
  }
}
