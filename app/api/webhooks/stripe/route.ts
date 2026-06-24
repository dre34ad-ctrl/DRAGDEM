import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { RevenueService } from '@/lib/services/revenue-service';

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
        const customerId = session.customer;
        const upgradeType = session.metadata?.upgrade_type;

        await supabase
          .from('users')
          .update({
            subscription_tier: upgradeType === 'signature' ? 'signature' : 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        // Record Subscription Revenue in Ledger
        const { data: user } = await supabase
          .from('users')
          .select('id, region, tax_regime')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await RevenueService.recordRevenue({
            transactionId: session.id,
            revenueAmount: session.amount_total / 100,
            currency: session.currency,
            feeType: 'subscription',
            customerId: user.id,
            customerRegion: user.region,
            customerTaxStatus: user.tax_regime
          });
        }
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

        // Record Platform Fees in Ledger (0.3% from each side as per Phase 15 standards)
        const { data: booking } = await supabase
          .from('bookings')
          .select('seeker_id, performer_id')
          .eq('id', bookingId)
          .single();

        if (booking) {
          const platformFeeAmount = (paymentIntent.amount / 100) * 0.003;

          // Seeker Side
          const { data: seeker } = await supabase
            .from('users')
            .select('region, tax_regime')
            .eq('id', booking.seeker_id)
            .single();
          
          if (seeker) {
            await RevenueService.recordRevenue({
              transactionId: bookingId,
              revenueAmount: platformFeeAmount,
              currency: paymentIntent.currency,
              feeType: 'platform_fee',
              customerId: booking.seeker_id,
              customerRegion: seeker.region,
              customerTaxStatus: seeker.tax_regime
            });
          }

          // Performer Side
          const { data: performer } = await supabase
            .from('users')
            .select('region, tax_regime')
            .eq('id', booking.performer_id)
            .single();
          
          if (performer) {
            await RevenueService.recordRevenue({
              transactionId: bookingId,
              revenueAmount: platformFeeAmount,
              currency: paymentIntent.currency,
              feeType: 'platform_fee',
              customerId: booking.performer_id,
              customerRegion: performer.region,
              customerTaxStatus: performer.tax_regime
            });
          }
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as any;
      const bookingId = paymentIntent.metadata.booking_id;

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'failed' })
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
