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

      {/* Trust Signal Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-cyan-950/20 via-black to-pink-950/20 border border-white/5 rounded-[3rem] p-12 text-center space-y-6">
          <h2 className="text-3xl font-serif italic text-white">The Professional Backbone</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Drag is business. Business requires transparency. By contributing to the Safety Index, you are helping build a more sustainable and equitable ecosystem for all performers globally.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            <div className="flex flex-col items-center">
              <span className="text-cyan-400 font-mono text-2xl font-bold">100%</span>
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Artist Led</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-pink-600 font-mono text-2xl font-bold">Verified</span>
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Incident Tracking</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
