"use client";

import { Masterclass, MasterclassProgress } from "@/lib/actions/masterclass";
import { Clock, BarChart, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MasterclassCardProps {
  masterclass: Masterclass;
  progress?: MasterclassProgress;
  locale: string;
}

export default function MasterclassCard({ masterclass, progress, locale }: MasterclassCardProps) {
  const difficultyColor = {
    Beginner: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    Intermediate: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
    Master: "text-magenta-500 border-magenta-500/30 bg-magenta-500/10",
  }[masterclass.difficulty] || "text-gray-400 border-gray-400/30 bg-gray-400/10";

  // Note: Since I don't have tailwind config for 'magenta-500', 
  // I will use 'pink-600' which is close to the Electric Magenta in the project.
  const magentaClass = "text-pink-500 border-pink-500/30 bg-pink-500/10";
  const actualDifficultyColor = masterclass.difficulty === 'Master' ? magentaClass : difficultyColor;

  return (
    <Link 
      href={`/${locale}/masterclass/${masterclass.slug}`}
      className="group bg-surface border border-gray-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 shadow-xl hover:shadow-pink-500/10 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={masterclass.thumbnail_url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"} 
          alt={masterclass.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
        
        {masterclass.pro_only && (
          <div className="absolute top-4 right-4 bg-yellow-600 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <Lock size={10} /> Pro
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter ${actualDifficultyColor}`}>
            {masterclass.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-white/20 bg-black/40 text-white text-[10px] font-bold uppercase tracking-tighter">
            {masterclass.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-playfair font-bold text-white mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
          {masterclass.title}
        </h3>
        <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
          By {masterclass.author_name}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={14} className="text-pink-500" />
              {masterclass.reading_time} min
            </div>
          </div>
          
          {progress && (
            <div className="flex flex-col items-end gap-1">
              <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500" 
                  style={{ width: `${progress.progress_percent}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {progress.completed_at ? "Completed" : `${progress.progress_percent}% Read`}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
