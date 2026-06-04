'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Saves regional compliance information for a performer.
 */
export async function savePerformerRegionInfo({
  region,
  taxId,
  taxRegime,
  postalCode,
  vatRate,
  payoutProvider,
  asfConfirmed,
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
      national_id: taxId,
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
    case 'DE':
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
    case 'AR':
      if (!/^[0-9]{11}$/.test(taxId.replace(/\D/g, ''))) {
        throw new Error('Invalid CUIL/CUIT format for Argentina (11 digits required)');
      }
      break;
    case 'FR':
      if (!/^[0-9]{9}$|^[0-9]{14}$/.test(taxId.replace(/\s/g, ''))) {
        throw new Error('Invalid SIREN/SIRET format for France');
      }
      break;
  }
}

export async function checkDetailedVerificationStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('region, national_id, tax_regime, trust_score')
    .eq('id', user.id)
    .single();

  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('id, verified_at, institutional_badge')
    .eq('user_id', user.id)
    .single();

  // Fiscal step: has region, taxId and taxRegime
  const fiscal = !!(userData?.region && userData?.national_id && userData?.tax_regime);
  
  // Portfolio step: in a real app we'd check for a minimum number of high-res assets
  // and if a manual audit has passed. For now, check if profile is "verified"
  const portfolio = !!profile?.verified_at;

  // Trust step: check trust score threshold
  const trust = (userData?.trust_score || 0) >= 80;

  return {
    fiscal,
    portfolio,
    trust,
    institutional_badge: !!profile?.institutional_badge
  };
}

export async function savePayoutMethod({
  type,
  details,
  isDefault = true,
}: {
  type: string;
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
