import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('Warning: STRIPE_SECRET_KEY is missing in production environment');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Or latest
  typescript: true,
});
