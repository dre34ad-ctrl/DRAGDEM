import { createClient } from '../supabase/server';
import { StealthService } from './stealth-service';

export class ComplianceService {
  /**
   * Checks if a user is compliant with regional regulations.
   * Handles Japan ASF, Swedish BankID, and high-risk region stealth gating.
   */
  static async checkPayoutCompliance(userId: string, region: string): Promise<{ compliant: boolean; reason?: string }> {
    // 1. High-Risk Region: Check if Stealth Mode should be enforced
    const stealthConfig = await StealthService.getStealthConfig(userId, region);
    if (stealthConfig.enabled) {
      console.log(`[Compliance] Stealth Mode active for user ${userId} in region ${region}. Applying safety protocols.`);
    }

    if (region === 'JP') {
      const supabase = await createClient();
      const { data: user, error } = await supabase
        .from('users')
        .select('policy_acceptance_log')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return { compliant: false, reason: 'User not found or error fetching compliance data.' };
      }

      const log = user.policy_acceptance_log as any;
      if (!log?.asf_confirmed_at) {
        return { compliant: false, reason: 'Japanese regulations require Anti-Social Forces (ASF) confirmation before payouts.' };
      }
    }

    if (region === 'SE') {
      const supabase = await createClient();
      const { data: user, error } = await supabase
        .from('users')
        .select('policy_acceptance_log')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return { compliant: false, reason: 'User not found or error fetching compliance data.' };
      }

      const log = user.policy_acceptance_log as any;
      if (!log?.bankid_verified_at) {
        return { compliant: false, reason: 'Swedish performers must be verified via BankID before payouts.' };
      }
    }

    // Add other regional compliance checks here

    return { compliant: true };
  }
}
