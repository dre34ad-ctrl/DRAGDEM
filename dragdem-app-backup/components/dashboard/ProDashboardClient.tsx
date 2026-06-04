'use client';

import React, { useState, useRef } from 'react';
import Navbar from "@/components/Navbar";
import { MetricsPulse } from "./MetricsPulse";
import { FinancialHub } from "./FinancialHub";
import { BackstageHub } from "./BackstageHub";
import { EducationGrowth } from "./EducationGrowth";
import { BackstageComposer } from "@/components/pulse/BackstageComposer";
import { ProDashboardData } from "@/lib/actions/pro-dashboard";
import { ShieldCheck, User, X } from "lucide-react";

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
    <main className="min-h-screen pb-20 bg-deep text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-surface border-2 border-luxury-gold flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <User size={40} className="text-gray-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-luxury-gold text-deep p-1.5 rounded-full shadow-lg">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-montserrat font-bold text-white">
                Dashboard <span className="text-luxury-gold italic">Pro</span>
              </h1>
              <p className="text-gray-400 mt-1 font-inter flex items-center gap-2">
                Welcome back, {userName} 
                <span className="h-1 w-1 rounded-full bg-gray-600" />
                Your empire is growing.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-surface border border-white/10 hover:border-luxury-gold/50 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Edit Public Profile
            </button>
            <button className="px-6 py-3 bg-luxury-gold text-deep rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-105 transition-all">
              Go Live
            </button>
          </div>
        </div>

        {/* Backstage Composer Overlay/Section */}
        {showComposer && (
          <div ref={composerRef} className="mb-12 animate-in slide-in-from-top duration-500">
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowComposer(false)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} /> CLOSE COMPOSER
              </button>
            </div>
            <BackstageComposer 
              performerName={userName} 
              initialGlowLevel={data.visibility.searchPriority}
            />
          </div>
        )}

        {/* 1. Metrics Visualization */}
        <MetricsPulse 
          metrics={data.metrics} 
          glowLevel={data.visibility.searchPriority} 
        />

        {/* 2 & 3. Financial Hub & Backstage Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FinancialHub earnings={data.earnings} compliance={data.compliance} />
          <BackstageHub 
            visibility={data.visibility} 
            content={data.content} 
            onNewPost={handleNewPost}
          />
        </div>

        {/* 4. Education & Growth */}
        <EducationGrowth education={data.education} />
      </div>
    </main>
  );
}
