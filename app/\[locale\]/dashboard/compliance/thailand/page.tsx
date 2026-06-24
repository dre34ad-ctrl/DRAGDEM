import React from 'react';
import Navbar from "@/components/Navbar";
import { 
  ShieldCheck, 
  BarChart3, 
  AlertCircle, 
  ArrowUpRight,
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import { getThailandVATStatus } from "@/lib/actions/compliance";

export default async function ThailandVATDashboard() {
  const status = await getThailandVATStatus();
  
  const currentRevenue = status.current_annual_revenue_thb || 0;
  const threshold = status.threshold_thb || 1800000;
  const percentage = status.percentage_reached || 0;

  // Determine status color and message
  let statusColor = "text-emerald-500";
  let borderColor = "border-emerald-500/20";
  let bgColor = "bg-emerald-500/5";
  let message = "Currently within safe operating limits.";

  if (percentage >= 90) {
    statusColor = "text-red-500";
    borderColor = "border-red-500/20";
    bgColor = "bg-red-500/5";
    message = "CRITICAL: Immediate VAT registration required.";
  } else if (percentage >= 75) {
    statusColor = "text-amber-500";
    borderColor = "border-amber-500/20";
    bgColor = "bg-amber-500/5";
    message = "WARNING: Approaching threshold. Prepare documentation.";
  }

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg">
              <ShieldCheck className="text-luxury-gold" size={20} />
            </div>
            <span className="text-xs font-bold text-luxury-gold uppercase tracking-[0.4em]">Fiscal Compliance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white tracking-tighter">
            Thailand <span className="glamour-heading">VAT Monitoring</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl font-montserrat text-sm leading-relaxed uppercase tracking-widest">
            Real-time tracking of non-VAT registered Thai revenue against the 1.8M THB threshold.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Metric */}
          <div className="lg:col-span-2 glass-panel rounded-[2rem] p-10 relative overflow-hidden border-white/5">
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <TrendingUp size={120} className="text-luxury-gold" />
             </div>
             
             <div className="flex justify-between items-start mb-8">
               <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Annual Cumulative Revenue</p>
                 <h2 className="text-5xl font-black text-white font-montserrat">
                   ฿{currentRevenue.toLocaleString()}
                 </h2>
               </div>
               <div className={`px-4 py-2 rounded-full border ${borderColor} ${bgColor} ${statusColor} text-[10px] font-black uppercase tracking-widest`}>
                 {percentage}% Reached
               </div>
             </div>

             <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-6">
               <div 
                 className={`h-full transition-all duration-1000 ${percentage >= 90 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : percentage >= 75 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]'}`}
                 style={{ width: `${Math.min(percentage, 100)}%` }}
               />
             </div>

             <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
               <span>฿0</span>
               <span>Threshold: ฿1,800,000</span>
             </div>
          </div>

          {/* Status Card */}
          <div className={`glass-panel rounded-[2rem] p-8 border ${borderColor} ${bgColor} flex flex-col justify-center`}>
            <div className="mb-6">
               <AlertCircle size={32} className={statusColor} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${statusColor}`}>Status Signal</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              {message}
            </p>
            <div className="mt-8 pt-6 border-t border-white/5">
               <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                 View Compliance Guide
               </button>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-panel rounded-2xl p-6 border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <BarChart3 size={18} className="text-luxury-gold" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Source</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Aggregated from 0.3% Seeker fees, 0.3% Performer commissions, and Pro subscriptions.
              </p>
           </div>
           
           <div className="glass-panel rounded-2xl p-6 border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <Clock size={18} className="text-luxury-gold" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking Period</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Current Calendar Year (January 1 - December 31, {new Date().getFullYear()}).
              </p>
           </div>

           <div className="glass-panel rounded-2xl p-6 border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <FileText size={18} className="text-luxury-gold" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Status</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Verified via internal Revenue Ledger. Immutable record established Phase 15.
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
