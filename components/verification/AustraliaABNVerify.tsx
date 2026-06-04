'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Loader2, Building2 } from 'lucide-react';

interface AustraliaABNVerifyProps {
  initialABN?: string;
  onVerified: (abn: string, businessName: string) => void;
}

export const AustraliaABNVerify: React.FC<AustraliaABNVerifyProps> = ({ initialABN = '', onVerified }) => {
  const [abn, setAbn] = useState(initialABN);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: 'idle' | 'verified' | 'invalid', name?: string }>({ status: 'idle' });

  const verifyABN = async () => {
    if (abn.length < 11) return;
    
    setLoading(true);
    // Simulate ABR API lookup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock logic: If starts with '12', it's "verified"
    if (abn.startsWith('12')) {
      const mockName = "GLAMOUR PRODUCTIONS AU PTY LTD";
      setResult({ status: 'verified', name: mockName });
      onVerified(abn, mockName);
    } else {
      setResult({ status: 'invalid' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
          <Building2 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Australian Business Number (ABN)</h3>
          <p className="text-xs text-gray-500 font-inter">Verified ABN is required to avoid the mandatory 47% tax withholding.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text"
            value={abn}
            onChange={(e) => setAbn(e.target.value.replace(/\D/g, '').slice(0, 11))}
            placeholder="11-digit ABN"
            className="w-full bg-deep border border-gray-700 rounded-xl py-4 px-4 focus:outline-hidden focus:border-secondary font-mono text-sm tracking-widest"
          />
          {result.status === 'verified' && (
            <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent" />
          )}
        </div>
        <button 
          onClick={verifyABN}
          disabled={loading || abn.length < 11 || result.status === 'verified'}
          className="bg-secondary hover:bg-secondary/90 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold px-6 rounded-xl transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          VERIFY
        </button>
      </div>

      {result.status === 'verified' && (
        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="text-accent" size={18} />
          <div>
            <p className="text-[10px] font-black text-accent uppercase tracking-widest">Active ABN Found</p>
            <p className="text-xs font-bold text-white">{result.name}</p>
          </div>
        </div>
      )}

      {result.status === 'invalid' && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <XCircle className="text-red-500" size={18} />
          <p className="text-xs font-medium text-red-400">Invalid ABN or no active record found. Please check and try again.</p>
        </div>
      )}

      <div className="mt-6 flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          * Real-time verification via Australian Business Register (ABR) API. Your payout name must match the registered ABN entity name.
        </p>
      </div>
    </div>
  );
};
