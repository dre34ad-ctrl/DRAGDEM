import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder'
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      if (session.mode === 'subscription') {
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = session.metadata.supabase_user_id;

        await supabase
          .from('users')
          .update({
            subscription_tier: 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;

      await supabase
        .from('users')
        .update({
          subscription_tier: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as any;
      const bookingId = paymentIntent.metadata.booking_id;

      if (bookingId) {
        await supabase
          .from('escrow_transactions')
          .update({
            status: 'held',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
          
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);
      }
      break;
    }

    case 'account.updated': {
      const account = event.data.object as any;
      const performerId = account.metadata.performer_id;

      if (account.payouts_enabled && performerId) {
        await supabase
          .from('payout_methods')
          .update({ status: 'active' })
          .eq('performer_id', performerId)
          .eq('type', 'stripe');
      }
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
