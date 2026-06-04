'use client';

import React from 'react';

interface MexicoPayoutBreakdownProps {
  grossFee: number;
  currency: string;
  isrWithholding: number;
  ivaWithholding: number;
  serviceFee: number;
  netPayout: number;
}

export const MexicoPayoutBreakdown = ({
  grossFee,
  currency,
  isrWithholding,
  ivaWithholding,
  serviceFee,
  netPayout,
}: MexicoPayoutBreakdownProps) => {
  return (
    <div className="max-w-[500px] mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl mt-6">
      <div className="bg-red-900/80 p-6 border-b border-yellow-600/50">
        <h3 className="m-0 font-serif italic text-white text-xl">Payout Breakdown</h3>
        <span className="text-[10px] text-yellow-500 uppercase tracking-widest">Mexico • RESICO Compliance</span>
      </div>
      <div className="p-8">
        <div className="flex justify-between mb-6 border-b border-gray-800 pb-2">
          <span className="text-gray-400">Gross Performance Fee</span>
          <span className="font-bold">{grossFee.toLocaleString()} {currency}</span>
        </div>
        
        <div className="mb-6">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-3">Government Withholdings</span>
          <div className="flex justify-between mb-4">
            <span className="text-sm">
              1.25% ISR Withholding <br />
              <small className="text-gray-500">Art. 113-J LISR (B2B)</small>
            </span>
            <span className="text-red-500 font-medium">- {isrWithholding.toLocaleString()} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">
              10.66% IVA Withholding <br />
              <small className="text-gray-500">2/3 of VAT (B2B)</small>
            </span>
            <span className="text-red-500 font-medium">- {ivaWithholding.toLocaleString()} {currency}</span>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Platform Fees</span>
          <div className="flex justify-between">
            <span className="text-sm">DRAGDEM Service Fee (10%)</span>
            <span className="text-gray-400">- {serviceFee.toLocaleString()} {currency}</span>
          </div>
        </div>

        <div className="bg-cyan-400/5 p-6 rounded-lg border border-cyan-400/20 text-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Estimated Net Payout</span>
          <div className="text-3xl font-black text-pink-600 drop-shadow-[0_0_10px_rgba(219,39,119,0.4)]">
            {netPayout.toLocaleString()} {currency}
          </div>
        </div>

        <p className="text-[10px] text-gray-500 mt-6 leading-relaxed">
          *These deductions are mandatory for B2B transactions under the Mexican RESICO tax regime. 
          DRAGDEM will generate a CFDI 4.0 compliant invoice automatically.
        </p>
      </div>
    </div>
  );
};
