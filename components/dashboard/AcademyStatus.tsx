'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ModuleProgress {
  module_code: string;
  title: string;
  progress_percent: number;
  completed_at: string | null;
}

export default function AcademyStatus() {
  const params = useParams();
  const locale = params.locale as string;
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCertified, setIsCertified] = useState(false);
  const [certHash, setCertHash] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch('/api/academy/status');
        const data = await res.json();
        if (data.success) {
          setProgress(data.progress);
          setIsCertified(data.isCertified);
          setCertHash(data.certificateHash);
        }
      } catch (err) {
        console.error('Failed to fetch academy status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel border-white/5 rounded-[2rem] p-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const completedCount = progress.filter(p => p.progress_percent === 100).length;
  const totalCount = 4; // AC-101 to AC-104

  return (
    <div className="glass-panel border-white/10 rounded-[2.5rem] p-10 mb-16 shadow-3xl overflow-hidden relative group">
      {isCertified && (
        <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
          <Award size={320} className="text-luxury-gold" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-luxury-gold/10 rounded-2xl border border-luxury-gold/30 shadow-glow-gold/20">
               <ShieldCheck className="text-luxury-gold" size={24} />
             </div>
             <div>
               <span className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.4em]">Institutional Standard</span>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">DRAGDEM Academy LMS</p>
             </div>
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-playfair font-black italic ${isCertified ? 'glamour-heading' : 'text-white'}`}>
            {isCertified ? 'INSTITUTIONAL PRO CERTIFIED' : 'PRO CERTIFICATION TRACK'}
          </h2>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex -space-x-3">
              {progress.map((m) => (
                <div 
                  key={m.module_code}
                  className={`w-14 h-14 rounded-2xl border-4 border-deep flex items-center justify-center text-xs font-black transition-all duration-500 ${
                    m.progress_percent === 100 
                      ? 'bg-primary text-white shadow-glow-magenta rotate-3' 
                      : 'bg-deep-charcoal text-gray-600 border-white/5'
                  }`}
                  title={m.title}
                >
                  {m.progress_percent === 100 ? <CheckCircle2 size={20} /> : m.module_code.split('-')[1]}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white font-black tracking-wide">
                {completedCount}/{totalCount} <span className="text-gray-500 font-medium">CORE MODULES MASTERED</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-deep-charcoal rounded-full overflow-hidden border border-white/5">
                   <div 
                     className="h-full bg-primary shadow-glow-magenta"
                     style={{ width: `${(completedCount / totalCount) * 100}%` }}
                   />
                </div>
                <span className="text-[10px] font-black text-primary tracking-widest">{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          {isCertified ? (
             <div className="flex flex-col gap-4">
               <Link 
                 href={`/${locale}/academy/certificate/${certHash}`}
                 className="px-10 py-5 bg-luxury-gold text-black font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.05] hover:shadow-glow-gold transition-all duration-300"
               >
                 <Award size={20} />
                 View Luxury Certificate
               </Link>
               <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <Sparkles size={12} className="text-luxury-gold" />
                  ID: {certHash?.substring(0, 12)}...
               </div>
             </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 space-y-6 min-w-[320px] shadow-2xl relative overflow-hidden group/card">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Next Milestone</p>
                <p className="text-sm text-white font-bold">{progress.find(p => p.progress_percent < 100)?.title || 'Final Exam'}</p>
              </div>

              <button className="w-full py-5 bg-linear-to-r from-primary to-secondary text-white font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-glow-magenta transition-all duration-300">
                Continue Track
                <ArrowRight size={18} />
              </button>
              
              <p className="text-[9px] text-gray-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                Certification unlocks Institutional Tiers <br/>& priority search placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
