import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createConnectAccountSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Get performer profile
  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('id, user:users(email, region)')
    .eq('user_id', user.id)
    .single();

  if (!profile) throw new Error('Performer profile not found');

  const userData = Array.isArray(profile.user) ? profile.user[0] : profile.user;
  if (!userData) throw new Error('User data not found');

  // 2. Check for existing payout method
  const { data: existingMethod } = await supabase
    .from('payout_methods')
    .select('*')
    .eq('performer_id', profile.id)
    .eq('type', 'stripe')
    .single();

  let stripeAccountId = existingMethod?.details?.stripe_account_id;

  if (!stripeAccountId) {
    // Create a new Connect Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: userData.email,
      country: userData.region || 'US',
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { performer_id: profile.id, user_id: user.id },
    });
    stripeAccountId = account.id;

    // Save to payout_methods
    await supabase
      .from('payout_methods')
      .insert({
        performer_id: profile.id,
        type: 'stripe',
        details: { stripe_account_id: stripeAccountId },
        is_default: true,
      });
  }

  // 3. Create Account Link
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payouts/reauth`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payouts/return`,
    type: 'account_onboarding',
  });

  if (accountLink.url) {
    redirect(accountLink.url);
  }
}

export async function getConnectLoginLink() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data: payoutMethod } = await supabase
    .from('payout_methods')
    .select('*')
    .eq('performer_id', profile?.id)
    .eq('type', 'stripe')
    .single();

  if (!payoutMethod?.details?.stripe_account_id) {
    throw new Error('No Stripe Connect account found');
  }

  const loginLink = await stripe.accounts.createLoginLink(
    payoutMethod.details.stripe_account_id
  );

  return loginLink.url;
}
