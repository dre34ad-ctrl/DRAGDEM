import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function processCancellation(bookingId: string, actorType: 'performer' | 'seeker') {
  const supabase = await createClient();
  
  // 1. Fetch booking and escrow status
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, escrow:escrow_transactions(*)')
    .eq('id', bookingId)
    .single();

  if (!booking || !booking.escrow) throw new Error('Booking or escrow record not found');
  if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

  const now = new Date();
  const eventDate = new Date(booking.event_date);
  const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let refundAmount = 0;
  let payoutAmount = 0;
  let platformFeeAction: 'keep' | 'refund' = 'keep';

  if (actorType === 'seeker') {
    if (diffDays > 14) {
      refundAmount = booking.total_fee;
      payoutAmount = 0;
    } else if (diffDays >= 7 && diffDays <= 14) {
      refundAmount = booking.total_fee * 0.5;
      payoutAmount = booking.total_fee * 0.5;
    } else {
      refundAmount = 0;
      payoutAmount = booking.total_fee;
    }
  } else {
    // Performer cancelled
    refundAmount = booking.total_fee;
    payoutAmount = 0;
    platformFeeAction = 'refund';
    
    // Reliability Penalty
    await applyReliabilityPenalty(booking.performer_id, bookingId, diffDays);
  }

  // 2. Stripe Actions
  if (refundAmount > 0) {
    // Full or partial refund
    // Note: Since capture_method is manual, we might just cancel PI and create a new one for the kill fee
    // or capture a partial amount.
    if (refundAmount === booking.total_fee) {
      await stripe.paymentIntents.cancel(booking.escrow.stripe_payment_intent_id);
    } else {
      // Partial capture (The kill fee)
      await stripe.paymentIntents.capture(booking.escrow.stripe_payment_intent_id, {
        amount_to_capture: Math.round(payoutAmount * 100),
      });
    }
  }

  // 3. Update DB
  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  await supabase
    .from('escrow_transactions')
    .update({ 
      status: refundAmount === booking.total_fee ? 'refunded' : 'released',
      updated_at: new Date().toISOString() 
    })
    .eq('id', booking.escrow.id);

  return { success: true, refundAmount, payoutAmount };
}

async function applyReliabilityPenalty(performerId: string, bookingId: string, diffDays: number) {
  const supabase = await createClient();
  
  // Logic for internal reliability penalty
  // If < 48 hours, it's a 'Strike'
  if (diffDays < 2) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('safety_events')
      .insert({
        booking_id: bookingId,
        triggered_by: user?.id,
        event_type: 'urgent_cancellation',
        severity: 'high',
        description: 'Performer cancelled within 48 hours of event.',
      });
      
    // 14-day discovery suspension (Simplified logic: set a flag on profile)
    await supabase
      .from('performer_profiles')
      .update({ 
        is_suspended: true, 
        suspension_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() 
      })
      .eq('id', performerId);
  } else {
    // Standard reliability point deduction
    // await db.rpc('decrement_reliability_score', { user_id: performerId });
  }
}
