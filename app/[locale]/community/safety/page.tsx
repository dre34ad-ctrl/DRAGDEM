import React from 'react';
import Navbar from "@/components/Navbar";
import { SafetyIndexClient } from "@/components/pulse/SafetyIndexClient";
import { getSafetyReports } from "@/lib/actions/safety";

export default async function SafetyPage() {
  const reports = await getSafetyReports();

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-12">
        <SafetyIndexClient reports={reports} />
      </div>

      {/* Trust Signal & Accreditation Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center py-16 bg-zinc-900/50 border border-white/5 rounded-[3rem] backdrop-blur-xl">
          <div className="relative group">
            <div className="w-40 h-40 bg-gradient-to-br from-[#D4AF37] via-[#F7EF8A] to-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="text-black" size={80} />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">Verified Safe</span>
            </div>
          </div>
          
          <div className="max-w-md space-y-6 text-center md:text-left">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Institutional Safety Accreditation</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              The Safety Seal is awarded to venues that maintain a minimum rating of <span className="text-[#D4AF37] font-bold">4.5/5.0</span> based on verified community reports. It signals adherence to DRAGDEM's 'Labor Dignity' standards.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Verified Security
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Private Backstage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Non-Slip Stages
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> Respectful Staff
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Professional Backbone Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-[#00FFFF]/5 via-black to-[#FF00FF]/5 border border-white/5 rounded-[3rem] p-12 text-center space-y-6">
          <h2 className="text-3xl font-serif italic text-white">The Professional Backbone</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Drag is business. Business requires transparency. By contributing to the Safety Index, you are helping build a more sustainable and equitable ecosystem for all performers globally.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            <div className="flex flex-col items-center">
              <span className="text-[#00FFFF] font-mono text-2xl font-bold drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">100%</span>
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Artist Led</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[#FF00FF] font-mono text-2xl font-bold drop-shadow-[0_0_10px_rgba(255,0,255,0.3)]">Verified</span>
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Incident Tracking</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
