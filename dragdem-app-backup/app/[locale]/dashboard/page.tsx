import { createClient } from "@/lib/supabase/server";
import { getProDashboardData } from "@/lib/actions/pro-dashboard";
import ProDashboardClient from "@/components/dashboard/ProDashboardClient";
import BaseDashboard from "@/components/dashboard/BaseDashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check subscription tier
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, full_name')
    .eq('id', user.id)
    .single();

  const userName = userData?.full_name || user.email?.split('@')[0] || "Artist";

  if (userData?.subscription_tier === 'pro') {
    const dashboardData = await getProDashboardData();
    return <ProDashboardClient data={dashboardData} userName={userName} />;
  }

  return <BaseDashboard userName={userName} />;
}
