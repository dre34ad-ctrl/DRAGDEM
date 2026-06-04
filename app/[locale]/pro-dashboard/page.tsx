import { getProDashboardData } from "@/lib/actions/pro-dashboard";
import ProDashboardClient from "@/components/dashboard/ProDashboardClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch pro dashboard data via server action
  const dashboardData = await getProDashboardData();

  return (
    <ProDashboardClient 
      data={dashboardData} 
      userName={user.user_metadata?.full_name || user.email?.split('@')[0] || "Artist"} 
    />
  );
}
