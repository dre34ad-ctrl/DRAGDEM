'use client';

import React, { useState, useRef } from 'react';
import Navbar from "@/components/Navbar";
import { MetricsPulse } from "./MetricsPulse";
import { FinancialHub } from "./FinancialHub";
import { BackstageHub } from "./BackstageHub";
import { EducationGrowth } from "./EducationGrowth";
import { BackstageComposer } from "@/components/pulse/BackstageComposer";
import { ProDashboardData } from "@/lib/actions/pro-dashboard";
import { ShieldCheck, User, X, Edit3, Rocket } from "lucide-react";

interface ProDashboardClientProps {
  data: ProDashboardData;
  userName: string;
}

export default function ProDashboardClient({ data, userName }: ProDashboardClientProps) {
  const [showComposer, setShowComposer] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);

  const handleNewPost = () => {
    setShowComposer(true);
    setTimeout(() => {
      composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <main className="min-h-screen pb-32 bg-black text-white selection:bg-primary">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -mr-96 -mt-96" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full -ml-48 -mb-48" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-zinc-900 border-2 border-luxury-gold flex items-center justify-center overflow-hidden shadow-glow-gold transition-all duration-500 group-hover:scale-105">
                <User size={56} className="text-zinc-700" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-luxury-gold text-black p-2.5 rounded-full shadow-2xl animate-neon-pulse">
                <ShieldCheck size={20} strokeWidth={3} />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-black font-montserrat tracking-tighter text-white leading-none">
                PRO <span className="glamour-heading">COMMAND</span>
              </h1>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-3">
                <span className="text-primary underline decoration-primary/30 underline-offset-4">{userName}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-glow-cyan animate-pulse" />
                Verified Institutional Artist
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-5 bg-zinc-900 border border-white/10 hover:border-white/30 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
              <Edit3 size={16} />
              Edit Profile
            </button>
            <button className="flex-1 md:flex-none btn-prestige btn-prestige-primary py-5 group flex items-center justify-center gap-3">
              <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              Go Live
            </button>
          </div>
        </div>

        {/* Backstage Composer Overlay */}
        {showComposer && (
          <div ref={composerRef} className="mb-16 animate-in slide-in-from-top-8 duration-700">
            <div className="flex justify-between items-center mb-6 px-4">
              <h3 className="text-primary font-black uppercase tracking-[0.3em] text-sm flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary shadow-glow-magenta" />
                 Backstage Composer
              </h3>
              <button 
                onClick={() => setShowComposer(false)}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full"
              >
                <X size={14} /> ESC
              </button>
            </div>
            <div className="glass-panel rounded-[3rem] p-2 border-primary/20 shadow-glow-magenta/5 overflow-hidden">
               <BackstageComposer 
                 performerName={userName} 
                 initialGlowLevel={data.visibility.searchPriority}
               />
            </div>
          </div>
        )}

        <div className="space-y-12">
          {/* 1. Metrics Visualization */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:200ms]">
            <MetricsPulse 
              metrics={data.metrics} 
              glowLevel={data.visibility.searchPriority} 
            />
          </section>

          {/* 2 & 3. Financial Hub & Backstage Hub Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:400ms]">
            <FinancialHub earnings={data.earnings} compliance={data.compliance} />
            <BackstageHub 
              visibility={data.visibility} 
              content={data.content} 
              onNewPost={handleNewPost}
            />
          </div>

          {/* 4. Education & Growth */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:600ms]">
            <EducationGrowth education={data.education} />
          </section>
        </div>
      </div>
    </main>
  );
}
