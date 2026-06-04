import { createClient } from '../supabase/server';
import crypto from 'crypto';

/**
 * Updates performer progress in an Academy module.
 * Persists to Supabase 'performer_certifications'.
 */
export async function updateAcademyProgress(userId: string, moduleId: string, progressPercent: number) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('performer_certifications')
    .upsert({
      performer_id: userId,
      module_id: moduleId,
      progress_percent: progressPercent,
      completed_at: progressPercent >= 100 ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'performer_id, module_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating academy progress in Supabase:', error);
    throw error;
  }

  return data;
}

/**
 * Evaluates a quiz submission and triggers badge issuance if all criteria are met.
 */
export async function evaluateQuiz(userId: string, moduleId: string, answers: any[]) {
  // Logic for quiz evaluation based on Section 72
  // Answers should be compared against stored metadata in academy_modules
  const supabase = await createClient();
  
  const { data: moduleData, error: mError } = await supabase
    .from('academy_modules')
    .select('metadata')
    .eq('id', moduleId)
    .single();

  if (mError) throw mError;

  const correctAnswers = moduleData.metadata?.correct_answers || [];
  const score = answers.filter((a, index) => a.value === correctAnswers[index]).length;
  const total = correctAnswers.length || answers.length;
  const passed = score / total >= 0.8;

  if (passed) {
    await updateAcademyProgress(userId, moduleId, 100);
    // Check if all required modules are completed to trigger badge
    await checkAndIssueBadge(userId);
  }

  return { score, total, passed };
}

/**
 * Checks if a performer has completed all required modules for the 'Institutional Pro' badge.
 */
async function checkAndIssueBadge(userId: string) {
  const supabase = await createClient();
  
  const { data: completedCertifications, error: cError } = await supabase
    .from('performer_certifications')
    .select('academy_modules(module_code)')
    .eq('performer_id', userId)
    .not('completed_at', 'is', null);

  if (cError) throw cError;

  const completedCodes = completedCertifications.map((c: any) => c.academy_modules.module_code);
  const requiredModules = ['AC-101', 'AC-102', 'AC-103', 'AC-104'];
  const allCompleted = requiredModules.every(code => completedCodes.includes(code));

  if (allCompleted) {
    return await issueInstitutionalBadge(userId, completedCodes);
  }
}

/**
 * Issues a cryptographically signed digital badge.
 * Persists to Supabase 'certification_audit_log' and updates 'performer_profiles'.
 */
async function issueInstitutionalBadge(userId: string, modules: string[]) {
  const badgeName = "Institutional Pro";
  const timestamp = new Date().toISOString();
  const certData = {
    badge: badgeName,
    performer_uuid: userId,
    timestamp,
    modules
  };

  // HSM Mock signing (using environment secret)
  const signature = crypto.createHmac('sha256', process.env.ACADEMY_SIGNING_SECRET || 'institutional-secret-key-2032')
    .update(JSON.stringify(certData))
    .digest('base64');

  const certificateHash = crypto.createHash('sha256')
    .update(JSON.stringify({ ...certData, signature }))
    .digest('hex');

  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 2);

  const supabase = await createClient();

  // 1. Log the certification in the audit log
  const { error: logError } = await supabase
    .from('certification_audit_log')
    .insert({
      performer_id: userId,
      badge_name: badgeName,
      issued_at: timestamp,
      modules_completed: modules,
      signature: signature,
      certificate_hash: certificateHash,
      valid_until: validUntil.toISOString()
    });

  if (logError) throw logError;

  // 2. Update Performer Profile to enable the badge and boost search priority
  const { error: profileError } = await supabase
    .from('performer_profiles')
    .update({ 
      search_priority: 15, // Institutional Pro boost
      institutional_badge: true 
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  return { badgeName, certificateHash, signature };
}

/**
 * Verifies a certificate hash against the audit log.
 * Public verification logic.
 */
export async function verifyCertificate(hash: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('certification_audit_log')
    .select('*')
    .eq('certificate_hash', hash)
    .eq('revoked', false)
    .gt('valid_until', new Date().toISOString())
    .single();

  if (error) return null;
  return data;
}
