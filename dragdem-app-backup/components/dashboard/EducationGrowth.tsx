'use client';

import React from 'react';
import { 
  GraduationCap, 
  Play, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface EducationGrowthProps {
  education: {
    coursesStarted: number;
    coursesCompleted: number;
    badges: string[];
    lastActivity: string | null;
  };
}

export const EducationGrowth: React.FC<EducationGrowthProps> = ({ education }) => {
  return (
    <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-montserrat font-bold uppercase tracking-wider flex items-center gap-3 mb-8">
        <GraduationCap className="text-emerald-400" size={24} />
        Education & Growth
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Progress */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Resume Learning</h3>
          <div className="p-6 bg-deep/50 border border-white/5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="z-10">
                <h4 className="font-bold text-white mb-1">Mastering the Technical Rider</h4>
                <p className="text-xs text-gray-400">Module 3 of 5 • 85% Complete</p>
              </div>
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full group-hover:scale-110 transition-transform z-10">
                <Play size={16} fill="currentColor" />
              </div>
            </div>
            
            <div className="relative h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-2 z-10">
              <div className="absolute inset-0 bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Background Icon Glow */}
            <GraduationCap className="absolute -bottom-4 -right-4 text-white/[0.03] scale-150" size={120} />
          </div>

          <button className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2 hover:text-white transition-colors">
            View Course Library <ArrowRight size={14} />
          </button>
        </div>

        {/* Badges & Milestones */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Professional Badges</h3>
          <div className="flex flex-wrap gap-3">
            {education.badges.length > 0 ? (
              education.badges.map((badge, idx) => (
                <div key={idx} className="group relative">
                  <div className="p-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-xl flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <Award size={24} />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-[8px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {badge}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center gap-2 opacity-50">
                <Lock size={16} className="text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500">No badges earned yet</span>
              </div>
            )}
            
            {/* Locked Badges */}
            <div className="p-3 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-700">
              <Award size={24} />
            </div>
            <div className="p-3 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-700">
              <Award size={24} />
            </div>
          </div>

          <div className="mt-6 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Recommended Next Step</h4>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-xs text-white font-bold">Complete your 'Legal Basics' quiz</p>
                <p className="text-[10px] text-gray-500 mt-1">Unlocks the "Contract Master" profile badge and +5% visibility.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
