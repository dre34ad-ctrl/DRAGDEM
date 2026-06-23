import { createClient } from '../supabase/server';
import { StealthService } from './stealth-service';

export class ComplianceService {
  /**
   * Checks if a user is compliant with regional regulations.
   * Handles Japan ASF, Swedish BankID, and high-risk region stealth gating.
   */
  static async checkPayoutCompliance(userId: string, region: string): Promise<{ compliant: boolean; reason?: string; context?: any }> {
    // 1. High-Risk Region: Check if Stealth Mode should be enforced
    const stealthConfig = await StealthService.getStealthConfig(userId, region);
    if (stealthConfig.enabled) {
      console.log(`[Compliance] Stealth Mode active for user ${userId} in region ${region}. Applying safety protocols.`);
    }

    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('tax_id, policy_acceptance_log, performer_profiles(tax_regime)')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { compliant: false, reason: 'User not found or error fetching compliance data.' };
    }

    const log = user.policy_acceptance_log as any;
    const profile = user.performer_profiles as any;

    if (region === 'JP') {
      if (!log?.asf_confirmed_at) {
        return { compliant: false, reason: 'Japanese regulations require Anti-Social Forces (ASF) confirmation before payouts.' };
      }
    }

    if (region === 'SE') {
      if (!log?.bankid_verified_at) {
        return { compliant: false, reason: 'Swedish performers must be verified via BankID before payouts.' };
      }
    }

    if (region === 'ES') {
      if (!user.tax_id) {
        return { compliant: false, reason: 'Spanish regulations require a valid DNI/NIE for tax withholdings (IRPF).' };
      }
    }

    if (region === 'FR') {
      if (profile?.tax_regime !== 'GUSO' && !user.tax_id) {
        return { compliant: false, reason: 'French Auto-Entrepreneurs must provide a SIRET number for legal invoicing.' };
      }
    }

    if (region === 'DE') {
      if (!user.tax_id) {
        return { compliant: false, reason: 'German regulations require a valid Steuernummer or Steuer-ID for payouts.' };
      }
      
      if (profile?.tax_regime === 'KSK' && !log?.ksk_verified_at) {
        return { compliant: false, reason: 'Performers under KSK regime must have their registration verified before payouts.' };
      }
    }

    if (region === 'TH') {
      if (!log?.promptpay_verified_at) {
        return { compliant: false, reason: 'Thai regulations require PromptPay verification for real-time settlements in the Phase 15 pilot.' };
      }
    }

    return { 
      compliant: true,
      context: {
        taxRegime: profile?.tax_regime,
        hasTNumber: !!user.tax_id // Simplified for now
      }
    };
  }
}
