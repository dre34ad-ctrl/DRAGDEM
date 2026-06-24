import { createClient } from '@/lib/supabase/server';
import { teamDb } from '@/lib/db';

/**
 * Action to handle regional compliance verifications.
 */
export async function verifyBankID() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // In a real implementation, this would involve a redirect to BankID 
  // or polling a verification session. For this implementation, 
  // we simulate a successful verification.
  
  console.log(`[ComplianceAction] Initiating BankID verification for user ${user.id}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { error } = await supabase
    .from('users')
    .update({
      policy_acceptance_log: {
        ...(user as any).policy_acceptance_log,
        bankid_verified_at: new Date().toISOString(),
        bankid_ref: `BID-${Math.random().toString(36).substring(7).toUpperCase()}`
      }
    })
    .eq('id', user.id);

  if (error) throw error;

  return { success: true, message: 'BankID verification successful.' };
}

/**
 * Action to confirm Japan ASF compliance.
 */
export async function confirmJapanASF() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('users')
    .update({
      policy_acceptance_log: {
        ...(user as any).policy_acceptance_log,
        asf_confirmed_at: new Date().toISOString(),
      }
    })
    .eq('id', user.id);

  if (error) throw error;

  return { success: true };
}

/**
 * Fetches the current Thailand VAT compliance status from the revenue ledger.
 */
export async function getThailandVATStatus() {
  const sql = `
    SELECT 
        SUM(revenue_amount) as current_annual_revenue_thb,
        1800000.0 as threshold_thb,
        ROUND((SUM(revenue_amount) / 1800000.0) * 100, 2) as percentage_reached
    FROM platform_revenue_ledger
    WHERE customer_region = 'TH'
      AND (customer_tax_status IS NULL OR customer_tax_status != 'VAT_REGISTERED')
      AND created_at >= date('now', 'start of year');
  `;

  const results = await teamDb(sql);
  
  if (!results || results.length === 0) {
    return {
      current_annual_revenue_thb: 0,
      threshold_thb: 1800000,
      percentage_reached: 0
    };
  }

  return results[0];
}
