'use client';

import React from 'react';
import { 
  DollarSign, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  Info
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
    <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-montserrat font-bold uppercase tracking-wider flex items-center gap-3">
          <DollarSign className="text-luxury-gold" size={24} />
          Financial Hub
        </h2>
        <button className="text-xs font-bold text-luxury-gold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
          Payout Settings <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Pending Payouts */}
        <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/20 rounded-2xl relative group">
          <div className="flex items-center gap-2 text-luxury-gold/60 text-[10px] font-black uppercase tracking-widest mb-2">
            <Clock size={12} />
            In Escrow / Pending
          </div>
          <p className="text-4xl font-montserrat font-black text-luxury-gold mb-1">
            {earnings.pendingAmount.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </p>
          <p className="text-xs text-gray-500 font-medium">Releasing in 2-4 days</p>
          
          <div className="absolute top-6 right-6">
            <ShieldCheck className="text-luxury-gold/30" size={32} />
          </div>
        </div>

        {/* Historical Earnings */}
        <div className="p-6 bg-deep/50 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
            <ArrowUpRight size={12} className="text-emerald-500" />
            YTD Net Earnings
          </div>
          <p className="text-4xl font-montserrat font-black text-white mb-1">
            {earnings.netEarnings.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </p>
          <p className="text-xs text-gray-500 font-medium">After platform fees & taxes</p>
        </div>
      </div>

      {/* Tax Breakdown Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Regional Tax Withholding
            <Info size={12} className="text-gray-600" />
          </h3>
          <span className="text-xs font-bold text-red-400">
            -{earnings.taxWithheld.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
          </span>
        </div>
        
        <div className="space-y-2">
          {earnings.withholdings.length > 0 ? (
            earnings.withholdings.map((tax, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-deep/30 border border-white/5 rounded-xl text-sm">
                <span className="text-gray-400 font-medium">{tax.name}</span>
                <span className="text-white font-bold">
                  {tax.amount.toLocaleString('en-US', { style: 'currency', currency: earnings.currency })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-600 italic px-2">No active withholdings for this period.</p>
          )}
        </div>
      </div>

      {/* Compliance & Tax Identifiers */}
      <div className="mt-8 pt-8 border-t border-white/5">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
          Regional Compliance ({compliance.region})
        </h3>
        <div className="p-4 bg-deep/50 border border-white/5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">
              {
                compliance.region === 'AU' ? 'ABN' : 
                compliance.region === 'JP' ? 'T-Number' : 
                compliance.region === 'MX' ? 'RFC' :
                compliance.region === 'BR' ? 'CPF / CNPJ' :
                compliance.region === 'DE' ? 'Steuernummer' :
                compliance.region === 'TH' ? 'PromptPay ID' :
                'National Tax ID'
              }
            </p>
            <p className="text-sm font-bold text-white">
              {compliance.taxId || 'Not Provided'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {compliance.isVerified ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase">
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase">
                Action Required
              </span>
            )}
          </div>
        </div>
        {!compliance.taxId && (
          <p className="mt-2 text-[10px] text-amber-500/70 italic px-2">
            Missing tax identifier may lead to higher withholding rates (e.g., 47% in Australia).
          </p>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
          View Full Payout History
        </button>
      </div>
    </div>
  );
};
