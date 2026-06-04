'use server';

import { createClient } from '@/lib/supabase/server';
import { teamDb } from '../db';
import { calculateFees } from '../utils/fees';
import { getPulsePosts } from './pulse';

export interface ProDashboardData {
  metrics: {
    viewCount: number;
    bookingCount: number;
    conversionRate: number;
    totalSnaps: number;
  };
  earnings: {
    pendingAmount: number;
    historicalEarnings: number;
    taxWithheld: number;
    netEarnings: number;
    currency: string;
    withholdings: { name: string; amount: number }[];
  };
  education: {
    coursesStarted: number;
    coursesCompleted: number;
    badges: string[];
    lastActivity: string | null;
  };
  content: {
    backstagePosts: number;
    vaultAssets: number;
  };
  visibility: {
    searchPriority: number;
    spotlightStatus: 'none' | 'applied' | 'active';
  };
  compliance: {
    region: string;
    taxId: string | null;
    taxRegime: string | null;
    isVerified: boolean;
    vatRate: number;
    hasABN: boolean;
    hasTNumber: boolean;
  };
}

/**
 * Aggregates all data required for the 'Pro' Performer Dashboard.
 */
export async function getProDashboardData(): Promise<ProDashboardData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Performance Metrics
  const metrics = await getPerformanceMetrics(user.id);

  // 2. Earnings & Tax Logic
  const earnings = await getEarningsAndTax(user.id);

  // 3. Educational Progress (from Turso)
  const education = await getEducationalProgress(user.id);

  // 4. Content Status
  const content = await getContentStatus(user.id);

  // 5. Visibility Boost
  const visibility = await getVisibilityStatus(user.id);

  // 6. Compliance Status
  const compliance = await getComplianceStatus(user.id);

  return {
    metrics,
    earnings,
    education,
    content,
    visibility,
    compliance
  };
}

async function getPerformanceMetrics(performerId: string) {
  const supabase = await createClient();
  
  // Profile Views - Fetch from performer_profiles (assuming view_count column exists)
  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('view_count')
    .eq('user_id', performerId)
    .single();

  const viewCount = profile?.view_count || 0;

  // Booking Conversion
  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('performer_id', performerId);

  const conversionRate = viewCount > 0 ? (bookingCount || 0) / viewCount : 0;

  // Engagement (Snaps on Backstage posts)
  const posts = await getPulsePosts({ performerId, category: 'backstage' });
  let totalSnaps = 0;
  if (posts.length > 0) {
    const postIds = posts.map(p => p.id);
    const { data: reactions, error } = await supabase
      .from('pulse_reactions')
      .select('post_id')
      .in('post_id', postIds);
    
    if (!error) {
      totalSnaps = reactions?.length || 0;
    }
  }

  return {
    viewCount,
    bookingCount: bookingCount || 0,
    conversionRate,
    totalSnaps
  };
}

async function getEarningsAndTax(performerId: string) {
  const supabase = await createClient();
  
  // Pending Payments (Escrow Held/Disputed)
  const { data: pendingTransactions } = await supabase
    .from('escrow_transactions')
    .select('amount')
    .eq('performer_id', performerId)
    .in('status', ['held', 'disputed']);

  const pendingAmount = pendingTransactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  // Historical Earnings (Total Released)
  const { data: releasedTransactions } = await supabase
    .from('escrow_transactions')
    .select('amount, currency')
    .eq('performer_id', performerId)
    .eq('status', 'released');

  const historicalEarnings = releasedTransactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const currency = releasedTransactions?.[0]?.currency || 'USD';

  // Region specific tax info
  const { data: performer } = await supabase
    .from('users')
    .select('region, tax_regime, vat_rate, national_id')
    .eq('id', performerId)
    .single();

  // YTD revenue for Thailand VAT threshold check (1.8M THB)
  const currentYear = new Date().getFullYear();
  const { data: ytdTransactions } = await supabase
    .from('escrow_transactions')
    .select('amount')
    .eq('performer_id', performerId)
    .eq('status', 'released')
    .gte('created_at', `${currentYear}-01-01T00:00:00Z`);

  const ytdRevenue = ytdTransactions?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  // Calculate fees and withholdings using the central logic
  const taxDetails = calculateFees({
    amount: historicalEarnings,
    performerRegion: performer?.region || 'US',
    seekerRegion: 'US', // Aggregated view doesn't have a single seeker
    totalRevenueYTD: ytdRevenue,
    performerTaxRegime: performer?.tax_regime,
    performerVatRate: performer?.vat_rate,
    hasTNumber: !!performer?.national_id && performer?.region === 'JP',
    hasVerifiedABN: !!performer?.national_id && performer?.region === 'AU',
  });

  return {
    pendingAmount,
    historicalEarnings,
    taxWithheld: taxDetails.totalWithholdings,
    netEarnings: historicalEarnings - taxDetails.platformFee - taxDetails.totalWithholdings,
    currency,
    withholdings: taxDetails.withholdings
  };
}

async function getEducationalProgress(performerId: string) {
  // Fetch from Turso shared DB
  const progress = await teamDb(`SELECT * FROM masterclass_progress WHERE user_id = '${performerId}'`);
  
  const completedCount = progress.filter(p => p.completed_at !== null).length;
  
  // Logic for badges: can be expanded into its own table
  const badges = [];
  if (completedCount >= 1) badges.push('Masterclass Apprentice');
  if (completedCount >= 5) badges.push('Verified Expert');
  if (progress.some(p => p.progress_percent === 100)) badges.push('Course Finisher');

  return {
    coursesStarted: progress.length,
    coursesCompleted: completedCount,
    badges,
    lastActivity: progress.length > 0 ? progress[0].last_read_at : null
  };
}

async function getContentStatus(performerId: string) {
  const supabase = await createClient();
  
  // Backstage Posts Count
  const { count: backstageCount } = await supabase
    .from('pulse_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', performerId)
    .eq('category', 'backstage');

  // Drag Vault Assets Count
  const { count: vaultCount } = await supabase
    .from('vault_assets')
    .select('*', { count: 'exact', head: true })
    .eq('performer_id', performerId);

  return {
    backstagePosts: backstageCount || 0,
    vaultAssets: vaultCount || 0
  };
}

async function getVisibilityStatus(performerId: string) {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from('performer_profiles')
    .select('search_priority, spotlight_status')
    .eq('user_id', performerId)
    .single();

  return {
    searchPriority: profile?.search_priority || 0,
    spotlightStatus: (profile?.spotlight_status as any) || 'none'
  };
}

async function getComplianceStatus(performerId: string) {
  const supabase = await createClient();
  
  const { data: user } = await supabase
    .from('users')
    .select('region, national_id, tax_regime, vat_rate')
    .eq('id', performerId)
    .single();

  return {
    region: user?.region || 'US',
    taxId: user?.national_id || null,
    taxRegime: user?.tax_regime || null,
    isVerified: !!user?.national_id, // Simple verification check for now
    vatRate: user?.vat_rate || 0,
    hasABN: !!user?.national_id && user?.region === 'AU',
    hasTNumber: !!user?.national_id && user?.region === 'JP',
  };
}

/**
 * Updates search priority for a performer (Pro feature).
 */
export async function updateSearchPriority(priority: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify Pro status before allowing priority update
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  if (userData?.subscription_tier !== 'pro') {
    throw new Error('Search priority control is a Pro feature.');
  }

  const { error } = await supabase
    .from('performer_profiles')
    .update({ search_priority: priority })
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}

/**
 * Submits an application for the Editorial Spotlight.
 */
export async function applyForSpotlight() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('performer_profiles')
    .update({ spotlight_status: 'applied' })
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}
