import React from 'react';
import Navbar from "@/components/Navbar";
import { SafetyReportForm } from "@/components/pulse/SafetyReportForm";
import { ShieldAlert } from "lucide-react";

export default function SafetyReportPage() {
  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-pink-600/10 rounded-full border border-pink-500/20">
              <ShieldAlert className="text-pink-500" size={48} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
              Contribute to the <br/><span className="text-pink-600">Safety Index</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Your feedback helps keep the community safe. All reports are vetted by our moderation team to ensure professional integrity.
            </p>
          </div>

          <SafetyReportForm />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-3">Vetted Integrity</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Each report undergoes a verification process to maintain high-quality safety data.</p>
            </div>
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-3">Community First</h3>
              <p className="text-gray-500 text-xs leading-relaxed">We prioritize anonymous, honest feedback that protects artists from predatory environments.</p>
            </div>
            <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-3">Actionable Intel</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Venues with consistent low ratings are flagged for institutional review.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
