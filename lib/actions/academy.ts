'use server';

import { createClient } from '../supabase/server';

export async function checkAcademyCertification() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: completedCertifications, error } = await supabase
    .from('performer_certifications')
    .select('academy_modules(module_code)')
    .eq('performer_id', user.id)
    .not('completed_at', 'is', null);

  if (error || !completedCertifications) {
    console.error('Error checking academy certification:', error);
    return false;
  }

  const completedCodes = completedCertifications.map((c: any) => c.academy_modules.module_code);
  const requiredModules = ['AC-101', 'AC-102', 'AC-103', 'AC-104'];
  return requiredModules.every(code => completedCodes.includes(code));
}

export async function applyForInstitutionalReview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Logic to flag profile for manual audit by cultural secretariat
  const { error } = await supabase
    .from('performer_profiles')
    .update({ 
      verification_status: 'pending_institutional',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}
