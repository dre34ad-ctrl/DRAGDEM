import { createClient } from '@/lib/supabase/server';

/**
 * Saves regional compliance information for a performer.
 * This includes National IDs/Tax IDs required for payouts in specific regions:
 * - Brazil: CPF
 * - Thailand: National ID / Tax ID
 * - Japan: T-Number (Qualified Invoice System)
 * - Mexico: RFC
 * - Spain: DNI/NIE
 * - Australia: ABN
 */
export async function savePerformerRegionInfo({
  region,
  taxId,
  taxRegime,
  postalCode,
  vatRate,
  payoutProvider,
  asfConfirmed, // Added for Japan ASF compliance
}: {
  region: string;
  taxId: string;
  taxRegime?: string;
  postalCode?: string;
  vatRate?: number;
  payoutProvider: 'stripe' | 'alternative';
  asfConfirmed?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Validation logic for regional identifiers
  validateTaxId(region, taxId);

  // Japan: Anti-Social Forces (ASF) confirmation is mandatory
  if (region === 'JP' && !asfConfirmed) {
    throw new Error('Japanese regulations require confirmation of non-affiliation with Anti-Social Forces (ASF).');
  }

  // Update user record with regional metadata
  const { error: userError } = await supabase
    .from('users')
    .update({
      region,
      national_id: taxId, // Generic column for any regional Tax ID
      tax_regime: taxRegime,
      postal_code: postalCode,
      vat_rate: vatRate,
      payout_provider: payoutProvider,
      policy_acceptance_log: region === 'JP' ? {
        ...(user as any).policy_acceptance_log,
        asf_confirmed_at: new Date().toISOString(),
      } : (user as any).policy_acceptance_log,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (userError) throw userError;

  return { success: true };
}

function validateTaxId(region: string, taxId: string) {
  switch (region) {
    case 'MX':
      if (!/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{3}$/.test(taxId)) {
        throw new Error('Invalid RFC format for Mexico');
      }
      break;
    case 'BR':
      if (!/^([0-9]{11}|[0-9]{14})$/.test(taxId.replace(/\D/g, ''))) {
        throw new Error('Invalid CPF or CNPJ format for Brazil');
      }
      break;
    case 'AU':
      if (!/^[0-9]{11}$/.test(taxId.replace(/\s/g, ''))) {
        throw new Error('Invalid ABN format for Australia (11 digits required)');
      }
      break;
    case 'JP':
      if (!/^T[0-9]{13}$/.test(taxId)) {
        throw new Error('Invalid T-Number format for Japan (T + 13 digits)');
      }
      break;
    case 'GB':
      if (!/^[0-9]{9}$/.test(taxId.replace(/\s/g, ''))) {
        // Simplified VAT check
        // throw new Error('Invalid VAT ID format for UK');
      }
      break;
    case 'DE':
      // Simplified check for Steuernummer or USt-IdNr
      if (!/^(DE)?[0-9]{9,11}$/.test(taxId.replace(/\s/g, ''))) {
        throw new Error('Invalid Tax ID format for Germany');
      }
      break;
    case 'CA':
      if (!/^[0-9]{9}$/.test(taxId.replace(/\s/g, ''))) {
        throw new Error('Invalid SIN format for Canada (9 digits required)');
      }
      break;
    case 'ES':
      if (!/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(taxId.replace(/\s/g, ''))) {
        throw new Error('Invalid DNI/NIE format for Spain');
      }
      break;
    case 'TW':
      if (!/^[A-Z][12][0-9]{8}$/.test(taxId.toUpperCase())) {
        throw new Error('Invalid National ID format for Taiwan');
      }
      break;
    case 'AR':
      if (!/^[0-9]{11}$/.test(taxId.replace(/\D/g, ''))) {
        throw new Error('Invalid CUIL/CUIT format for Argentina (11 digits required)');
      }
      break;
  }
}

export async function savePayoutMethod({
  type,
  details,
  isDefault = true,
}: {
  type: 'stripe' | 'pix' | 'promptpay' | 'bank_transfer' | 'paypay' | 'bizum' | 'interac' | 'payid' | 'osko';
  details: any;
  isDefault?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) throw new Error('Performer profile not found');

  // If setting as default, unset others
  if (isDefault) {
    await supabase
      .from('payout_methods')
      .update({ is_default: false })
      .eq('performer_id', profile.id);
  }

  const { error } = await supabase
    .from('payout_methods')
    .insert({
      performer_id: profile.id,
      type,
      details,
      is_default: isDefault,
      status: type === 'stripe' ? 'pending' : 'active',
    });

  if (error) throw error;
  return { success: true };
}

export async function getFXRates(from: string, to: string) {
  // Mock FX service with expanded regional coverage
  const mockRates: Record<string, number> = {
    'USD_BRL': 5.20,
    'USD_THB': 35.50,
    'USD_MXN': 17.50,
    'USD_JPY': 155.0,
    'USD_EUR': 0.92,
    'USD_AUD': 1.50,
    'USD_CAD': 1.36,
  };
  
  const rate = mockRates[`${from}_${to}`] || 1.0;
  const corridorFee = 0.015; // 1.5% for international corridors
  
  return {
    rate,
    fee: corridorFee,
    finalRate: rate * (1 - corridorFee),
    expiresIn: 3600,
  };
}
