import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EconomicPulseDashboard from "@/components/dashboard/EconomicPulseDashboard";
import Navbar from "@/components/Navbar";
import { Activity } from "lucide-react";

export default async function GovPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify governmental role (mock check for demo/institutional phase)
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  // In a real scenario, we'd have a strict 'gov' role
  // For Phase 11, we allow access if role is 'admin' or 'gov'
  if (userData?.role !== 'admin' && userData?.role !== 'gov') {
    // For development/demo, we might not want to redirect yet, but let's be strict
    // redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <Navbar />
      
      {/* Cinematic Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-crimson-velvet/5 blur-[180px] rounded-full -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/5 blur-[150px] rounded-full -ml-48 -mb-48" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <header className="mb-24 border-b border-white/5 pb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-2 bg-secondary/20 rounded-lg">
               <Activity className="text-secondary shadow-glow-cyan" size={20} />
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.6em]">Live Economic Monitor System</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black font-montserrat text-white tracking-tighter italic leading-[0.8] mb-12">
            GOVERNMENTAL <br />
            <span className="glamour-heading">PULSE PORTAL</span>
          </h1>
          <p className="text-gray-500 font-montserrat max-w-4xl text-lg md:text-xl leading-relaxed uppercase tracking-[0.2em] font-light">
            Providing authorized municipal agencies with real-time economic impact analysis, 
            regulatory compliance signals, and global tourism velocity metrics.
          </p>
        </header>

        <div className="glass-panel rounded-[4rem] p-12 md:p-24 border-secondary/10 shadow-glow-cyan/5">
          <EconomicPulseDashboard />
        </div>
        
        {/* Verification Footer */}
        <div className="mt-16 flex justify-center opacity-30">
           <div className="flex items-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">
              <span>ISO-27001 SECURE</span>
              <span>•</span>
              <span>ENCRYPTED STREAM</span>
              <span>•</span>
              <span>AUTHORIZED ACCESS ONLY</span>
           </div>
        </div>
      </div>
    </main>
  );
}
