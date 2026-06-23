import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function createBookingPayment(bookingId: string) {
  const supabase = await createClient();
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, performer:performer_profiles(*), seeker:users(*)')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) throw new Error('Booking not found');

  // 1. Create PaymentIntent with manual capture
  const isThaiPayment = booking.currency?.toLowerCase() === 'thb';
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.total_fee * 100),
    currency: booking.currency || 'usd',
    capture_method: isThaiPayment ? 'automatic' : 'manual', // PromptPay does not support manual capture
    metadata: { booking_id: bookingId },
    ...(isThaiPayment 
      ? { payment_method_types: ['promptpay', 'card'] } 
      : { setup_future_usage: 'off_session' }
    ),
  });

  // 2. Record in escrow_transactions
  const releaseDate = new Date(booking.event_date);
  releaseDate.setHours(releaseDate.getHours() + (booking.duration_hours || 2) + 48);

  const { error: escrowError } = await supabase
    .from('escrow_transactions')
    .insert({
      booking_id: bookingId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: booking.total_fee,
      currency: booking.currency || 'usd',
      status: 'held',
      release_date: releaseDate.toISOString(),
    });

  if (escrowError) throw escrowError;

  return { clientSecret: paymentIntent.client_secret };
}

export async function captureEscrow(bookingId: string) {
  const supabase = await createClient();
  const { data: escrow } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (!escrow || escrow.status !== 'held') throw new Error('Escrow not in held state');

  // 1. Capture in Stripe (only for manual capture payments)
  if (escrow.currency?.toLowerCase() !== 'thb') {
    await stripe.paymentIntents.capture(escrow.stripe_payment_intent_id);
  } else {
    console.log(`[Escrow] Skipping Stripe capture for THB transaction ${escrow.stripe_payment_intent_id} (automatic capture used)`);
  }

  // 2. Update status
  const { error: updateError } = await supabase
    .from('escrow_transactions')
    .update({ status: 'released', updated_at: new Date().toISOString() })
    .eq('id', escrow.id);

  if (updateError) throw updateError;

  // 3. Trigger Payout logic (Simplified)
  // This would ideally be a background job or separate service
  // await initiatePayout(bookingId);

  return { success: true };
}
