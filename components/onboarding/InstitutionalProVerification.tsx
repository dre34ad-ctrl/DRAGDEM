'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, BookOpen, UserCheck, TrendingUp, ChevronRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { checkAcademyCertification, applyForInstitutionalReview } from '@/lib/actions/academy';
import { checkDetailedVerificationStatus } from '@/lib/actions/onboarding';

export function InstitutionalProVerification() {
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [steps, setSteps] = useState({
    fiscal: false,
    academy: false,
    portfolio: false,
    trust: false,
  });
  const [isCertified, setIsCertified] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const [academyRes, detailedRes] = await Promise.all([
        checkAcademyCertification(),
        checkDetailedVerificationStatus()
      ]);
      
      if (detailedRes) {
        setSteps({
          academy: academyRes,
          fiscal: detailedRes.fiscal,
          portfolio: detailedRes.portfolio,
          trust: detailedRes.trust
        });
        setIsCertified(detailedRes.institutional_badge);
      }
    } catch (err) {
      console.error('Failed to check verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyForInstitutionalReview();
      alert('Application submitted to the local Cultural Secretariat for final audit.');
    } catch (err) {
      console.error(err);
      alert('Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  const allStepsCompleted = Object.values(steps).every(Boolean);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-black/20 rounded-[2rem] border border-white/5">
        <Loader2 className="animate-spin text-luxury-gold" size={32} />
      </div>
    );
  }

  return (
    <section className="bg-linear-to-br from-luxury-gold/5 to-primary/5 border border-luxury-gold/20 rounded-[2rem] p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Award size={120} className="text-luxury-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-luxury-gold/20 rounded-2xl flex items-center justify-center text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Award size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Institutional Pro</h2>
            <p className="text-sm text-gray-400 font-inter font-bold uppercase tracking-widest">Global Elite Certification</p>
          </div>
        </div>

        <p className="text-gray-400 mb-10 max-w-xl font-inter leading-relaxed">
          The DRAGDEM Institutional Pro status is a prestigious credential for performers ready to execute high-stakes municipal and corporate contracts. Verified by local Cultural Secretariats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VerificationStep 
            icon={<ShieldCheck size={20} />}
            title="Fiscal KYC"
            desc="MEI, RETA, or KSK compliance verified."
            completed={steps.fiscal}
          />
          <VerificationStep 
            icon={<BookOpen size={20} />}
            title="Academy Certification"
            desc="Completed AC-101 through AC-104."
            completed={steps.academy}
          />
          <VerificationStep 
            icon={<UserCheck size={20} />}
            title="Portfolio Audit"
            desc="Cinema-grade media kit review."
            completed={steps.portfolio}
          />
          <VerificationStep 
            icon={<TrendingUp size={20} />}
            title="Trust Score Vetting"
            desc="Reliability and rating performance."
            completed={steps.trust}
          />
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${isCertified ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : allStepsCompleted ? 'bg-yellow-500 shadow-[0_0_10px_#f59e0b]' : 'bg-gray-600'}`} />
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
               Status: {isCertified ? 'VERIFIED INSTITUTIONAL PRO' : allStepsCompleted ? 'READY FOR AUDIT' : 'VERIFICATION IN PROGRESS'}
             </span>
          </div>
          
          {!isCertified && (
            <button 
              onClick={handleApply}
              disabled={!allStepsCompleted || isApplying}
              className={`px-10 py-4 rounded-xl font-black transition-all flex items-center gap-3 text-xs uppercase tracking-widest shadow-2xl ${
                allStepsCompleted 
                  ? 'bg-primary text-white hover:scale-105 shadow-primary/20 cursor-pointer' 
                  : 'bg-zinc-800 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
               {isApplying ? <Loader2 className="animate-spin" size={16} /> : null}
               {allStepsCompleted ? 'Apply for Final Review' : 'Requirements Incomplete'} <ChevronRight size={16} />
            </button>
          )}
          
          {isCertified && (
            <div className="px-8 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <CheckCircle2 size={16} /> Elite Status Active
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function VerificationStep({ icon, title, desc, completed }: { icon: any, title: string, desc: string, completed: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 ${completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/40 border-white/5 opacity-60'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-colors duration-500 ${completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-gray-500'}`}>
          {icon}
        </div>
        {completed ? (
          <div className="bg-emerald-500 rounded-full p-1 shadow-[0_0_10px_#10b981]">
            <CheckCircle2 className="text-white" size={14} />
          </div>
        ) : (
          <Clock className="text-gray-400" size={18} />
        )}
      </div>
      <h4 className={`font-bold text-sm uppercase mb-1 ${completed ? 'text-white' : 'text-gray-400'}`}>{title}</h4>
      <p className="text-xs text-gray-500 font-inter leading-relaxed">{desc}</p>
    </div>
  );
}
