/**
 * Helper to format amounts for Stripe API based on currency.
 * Stripe expects amounts in the smallest currency unit (e.g., cents for USD, yen for JPY).
 */
export function formatAmountForStripe(amount: number, currency: string): number {
  const zeroDecimalCurrencies = [
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ];

  const upperCurrency = currency.toUpperCase();
  
  if (zeroDecimalCurrencies.includes(upperCurrency)) {
    return Math.round(amount);
  }
  
  return Math.round(amount * 100);
}
