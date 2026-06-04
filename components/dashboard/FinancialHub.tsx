'use client';

import React from 'react';
import { 
  DollarSign, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  CreditCard,
  Lock
} from 'lucide-react';

interface FinancialHubProps {
  earnings: {
    pendingAmount: number;
    historicalEarnings: number;
    taxWithheld: number;
    netEarnings: number;
    currency: string;
    withholdings: { name: string; amount: number }[];
  };
  compliance: {
    region: string;
    taxId: string | null;
    isVerified: boolean;
    hasABN: boolean;
    hasTNumber: boolean;
  };
}

export const FinancialHub: React.FC<FinancialHubProps> = ({ earnings, compliance }) => {
  return (
    <div className="glass-panel rounded-[3rem] p-10 h-full border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-luxury-gold to-transparent opacity-30" />
      
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-luxury-gold/10 rounded-2xl">
             <CreditCard className="text-luxury-gold" size={24} />
           </div>
           <h2 className="text-2xl font-black font-montserrat tracking-tight uppercase">
             FINANCIAL <span className="text-luxury-gold">HUB</span>
           </h2>
        </div>
        <button className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          Settings <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pending Payouts */}
        <div className="p-8 bg-luxury-gold/5 border border-luxury-gold/20 rounded-[2rem] relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Lock size={64} className="text-luxury-gold" />
          </div>
          <div className="flex items-center gap-2 text-luxury-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Clock size={12} strokeWidth={3} />
            VAULT STATUS: ESCROW
          </div>
          <p className="text-5xl font-montserrat font-black text-luxury-gold mb-2 drop-shadow-glow-gold">
            {earnings.pendingAmount.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Releasing in 48-72h</p>
        </div>

        {/* Historical Earnings */}
        <div className="p-8 bg-white/2 border border-white/5 rounded-[2rem] group overflow-hidden">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <ArrowUpRight size={12} className="text-emerald-500" strokeWidth={3} />
            YTD NET FLOW
          </div>
          <p className="text-5xl font-montserrat font-black text-white mb-2">
            {earnings.netEarnings.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </p>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Audit Verified</p>
        </div>
      </div>

      {/* Tax Breakdown Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
            REGIONAL WITHHOLDING
            <Info size={12} className="text-gray-700" />
          </h3>
          <span className="text-sm font-black text-red-500/80">
            -{earnings.taxWithheld.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </span>
        </div>
        
        <div className="space-y-3">
          {earnings.withholdings.length > 0 ? (
            earnings.withholdings.map((tax, idx) => (
              <div key={idx} className="flex justify-between items-center p-5 bg-white/2 border border-white/5 rounded-2xl text-sm hover:bg-white/5 transition-colors group">
                <span className="text-gray-400 font-bold uppercase tracking-wider group-hover:text-white transition-colors">{tax.name}</span>
                <span className="text-white font-black">
                  {tax.amount.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center">
               <p className="text-xs text-gray-600 font-black uppercase tracking-widest">No Active Deductions</p>
            </div>
          )}
        </div>
      </div>

      {/* Compliance & Tax Identifiers */}
      <div className="mt-10 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
             COMPLIANCE SIGNAL ({compliance.region})
           </h3>
           {compliance.isVerified ? (
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={14} strokeWidth={3} />
                 SECURE
              </div>
           ) : (
              <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                 <Info size={14} strokeWidth={3} />
                 ACTION REQUIRED
              </div>
           )}
        </div>
        
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-luxury-gold/30 transition-all">
          <div>
            <p className="text-[10px] text-gray-600 uppercase font-black mb-1 tracking-tighter">
              {
                compliance.region === 'AU' ? 'ABN (Australian Business Number)' : 
                compliance.region === 'JP' ? 'Qualified Invoice (T-Number)' : 
                compliance.region === 'MX' ? 'RFC (Mexico Tax ID)' :
                compliance.region === 'BR' ? 'CPF / CNPJ' :
                compliance.region === 'DE' ? 'Steuernummer' :
                compliance.region === 'TH' ? 'PromptPay ID' :
                'National Tax Identifier'
              }
            </p>
            <p className="text-lg font-black text-white font-mono tracking-wider">
              {compliance.taxId || 'NOT_PROVIDED'}
            </p>
          </div>
          <div className="p-3 bg-black rounded-xl border border-white/5 text-gray-600 group-hover:text-luxury-gold transition-colors">
             <Edit3 size={18} />
          </div>
        </div>
        
        {!compliance.taxId && (
          <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <p className="text-[10px] text-amber-500/80 font-bold leading-relaxed uppercase tracking-tight">
              ⚠️ Warning: Missing identifier will trigger default {compliance.region === 'AU' ? '47%' : 'maximum'} withholding rate.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <button className="w-full py-5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all text-gray-500 hover:text-white">
          Access Ledger Archives
        </button>
      </div>
    </div>
  );
};

function Edit3({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}
