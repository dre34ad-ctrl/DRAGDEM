import { createClient } from "@/lib/supabase/server";
import { getProDashboardData } from "@/lib/actions/pro-dashboard";
import ProDashboardClient from "@/components/dashboard/ProDashboardClient";
import BaseDashboard from "@/components/dashboard/BaseDashboard";
import FestivalRosterManager from "@/components/dashboard/FestivalRosterManager";
import InstitutionalPortal from "@/components/dashboard/InstitutionalPortal";
import { redirect } from "next/navigation";
import { getPerformerVerification, awardVerification } from "@/lib/actions/verifications";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check user role and subscription tier
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, full_name, role')
    .eq('id', user.id)
    .single();

  const userName = userData?.full_name || user.email?.split('@')[0] || "Artist";

  // Case 1: Professional Performers
  if (userData?.subscription_tier === 'pro') {
    // Sync verification status if they are pro
    const verification = await getPerformerVerification(user.id);
    if (!verification || !verification.is_verified) {
      await awardVerification(user.id, 'stripe');
    }

    const dashboardData = await getProDashboardData();
    return <ProDashboardClient data={dashboardData} userName={userName} />;
  }

  // Case 2: Organizers / Talent Seekers (Phase 11 Institutional)
  if (userData?.role === 'organizer' || userData?.role === 'client') {
    return (
      <main className="min-h-screen bg-black pt-20 pb-40 relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-luxury-gold/5 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1px bg-luxury-gold" />
              <span className="text-xs font-bold text-luxury-gold uppercase tracking-[0.5em]">Institutional Access</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white tracking-tighter italic">
              ORGANIZER <span className="glamour-heading">DASHBOARD</span>
            </h1>
            <p className="text-gray-400 mt-6 font-montserrat text-sm uppercase tracking-[0.2em] max-w-xl leading-loose">
              High-performance management for your rosters, bookings, and master technical riders.
            </p>
          </header>
          
            <div className="space-y-12">
              <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 border border-luxury-gold/10">
                <FestivalRosterManager />
              </div>
              
              <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 border border-luxury-gold/10 bg-luxury-gold/[0.02]">
                <header className="mb-12">
                  <h2 className="text-3xl font-playfair font-bold text-white italic">INSTITUTIONAL <span className="glamour-heading">PORTAL</span></h2>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Compliance, Billing & Verification</p>
                </header>
                <InstitutionalPortal />
              </div>
            </div>
        </div>
      </main>
    );
  }

  // Case 3: Standard Dashboard
  return <BaseDashboard userName={userName} />;
}
