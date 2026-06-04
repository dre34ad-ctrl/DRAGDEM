"use client";
/* eslint-disable @next/next/no-img-element */

import { Masterclass, MasterclassProgress } from "@/lib/actions/masterclass";
import { Clock, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MasterclassCardProps {
  masterclass: Masterclass;
  progress?: MasterclassProgress;
  locale: string;
}

export default function MasterclassCard({ masterclass, progress, locale }: MasterclassCardProps) {
  const difficultyColor = {
    Beginner: "text-secondary border-secondary/30 bg-secondary/10 shadow-glow-cyan/20",
    Intermediate: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10 shadow-glow-gold/20",
    Master: "text-primary border-primary/30 bg-primary/10 shadow-glow-magenta/20",
  }[masterclass.difficulty] || "text-gray-400 border-gray-400/30 bg-gray-400/10";

  return (
    <Link 
      href={`/${locale}/masterclass/${masterclass.slug}`}
      className="group glass-panel rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={masterclass.thumbnail_url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"} 
          alt={masterclass.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-deep via-deep/20 to-transparent" />
        
        {masterclass.pro_only && (
          <div className="absolute top-6 right-6 bg-luxury-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-gold">
            <Lock size={12} /> PRO EXCLUSIVE
          </div>
        )}
        
        <div className="absolute bottom-6 left-6 flex gap-3">
          <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${difficultyColor}`}>
            {masterclass.difficulty}
          </span>
          <span className="px-3 py-1 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest">
            {masterclass.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
           <Sparkles size={14} className="text-luxury-gold opacity-50" />
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Certified Module</span>
        </div>
        
        <h3 className="text-2xl font-playfair font-black text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 italic leading-tight">
          {masterclass.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 rounded-full bg-deep-charcoal border border-white/10 flex items-center justify-center text-sm shadow-inner">
             ✨
           </div>
           <p className="text-xs text-gray-400 font-bold tracking-wide">
            {masterclass.author_name}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <Clock size={14} className="text-primary" />
              {masterclass.reading_time} MIN READ
            </div>
          </div>
          
          {progress ? (
            <div className="flex flex-col items-end gap-2">
              <div className="w-24 h-1.5 bg-deep-charcoal rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-primary shadow-glow-magenta" 
                  style={{ width: `${progress.progress_percent}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                {progress.completed_at ? "MASTERED" : `${progress.progress_percent}% PROGRESS`}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              Begin Learning →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
