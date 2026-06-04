import { createClient } from '@/lib/supabase/server';

export interface StealthModeConfig {
  enabled: boolean;
  anonymousDisplayName: string;
  encryptContracts: boolean;
  panicButtonActive: boolean;
}

export class StealthService {
  /**
   * Retrieves the stealth mode configuration for a user based on their region.
   */
  static async getStealthConfig(userId: string, region: string): Promise<StealthModeConfig> {
    const highRiskRegions = ['AE', 'SA', 'QA', 'KW', 'NG', 'MY'];
    const isHighRisk = highRiskRegions.includes(region);

    const supabase = await createClient();
    const { data: user } = await supabase
      .from('users')
      .select('stealth_mode_enabled, display_name')
      .eq('id', userId)
      .single();

    const enabled = user?.stealth_mode_enabled || isHighRisk;

    return {
      enabled,
      anonymousDisplayName: enabled ? `Artist_${userId.substring(0, 5)}` : (user?.display_name || 'Artist'),
      encryptContracts: enabled,
      panicButtonActive: enabled
    };
  }

  /**
   * Toggles stealth mode for a user.
   */
  static async toggleStealthMode(userId: string, enabled: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('users')
      .update({ stealth_mode_enabled: enabled })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  }

  /**
   * Triggers the 'Panic Button' - immediate profile deactivation and data obfuscation.
   */
  static async triggerPanic(userId: string) {
    const supabase = await createClient();
    console.log(`[StealthService] PANIC TRIGGERED for user ${userId}. Deactivating profile and obfuscating data...`);
    
    const { error } = await supabase
      .from('users')
      .update({ 
        is_active: false,
        display_name: 'DEACTIVATED_USER',
        stealth_mode_enabled: true 
      })
      .eq('id', userId);

    if (error) throw error;
    
    // Also deactivate the performer profile
    await supabase
      .from('performer_profiles')
      .update({ status: 'inactive' })
      .eq('user_id', userId);

    return { success: true, message: 'Panic protocol executed. Profile deactivated.' };
  }
}
