import { createClient } from './server';

export const VERIFICATION_TIERS = {
  STANDARD: 'standard',
  VERIFIED: 'verified',
  CORPORATE: 'corporate',
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

interface VerificationRequest {
  seekerId: string;
  tier: keyof typeof VERIFICATION_TIERS;
  documents: string[];
  businessEmail?: string;
  linkedinProfile?: string;
}

export async function submitVerificationRequest(req: VerificationRequest) {
  const supabase = await createClient();
  console.log('Submitting verification request for seeker:', req.seekerId);
  
  if (req.tier === 'CORPORATE') {
    if (!req.businessEmail || !req.businessEmail.includes('@')) {
      throw new Error('Valid business email is required for Corporate Partner tier.');
    }
    if (!req.linkedinProfile || !req.linkedinProfile.includes('linkedin.com')) {
      throw new Error('LinkedIn profile is required for Corporate Partner tier.');
    }
  }

  const { data, error } = await supabase
    .from('seeker_verifications')
    .insert({
      seeker_id: req.seekerId,
      tier: req.tier.toLowerCase(),
      status: 'pending',
      document_urls: req.documents,
      business_email: req.businessEmail,
      linkedin_profile: req.linkedinProfile,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting verification request:', error);
    throw error;
  }

  return { success: true, data };
}

export async function getVerificationStatus(seekerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('seeker_verifications')
    .select('*')
    .eq('seeker_id', seekerId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching verification status:', error);
    return null;
  }

  return data?.[0];
}
