'use client';

import React from 'react';

interface GermanyKSKWarningProps {
  netFee: number;
  currency: string;
  estimatedContribution: number;
  onAcknowledge: (acknowledged: boolean) => void;
  acknowledged: boolean;
}

export const GermanyKSKWarning = ({
  netFee,
  currency,
  estimatedContribution,
  onAcknowledge,
  acknowledged,
}: GermanyKSKWarningProps) => {
  return (
    <div className="max-w-[600px] mx-auto bg-black border-2 border-yellow-600 rounded-2xl p-10 relative overflow-hidden mt-6 shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl rotate-12 pointer-events-none">
        🇩🇪
      </div>
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="bg-yellow-600 color-black w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold text-black">
          !
        </div>
        <h3 className="m-0 text-white uppercase tracking-widest text-lg font-bold">
          Regulatory Notice: Germany
        </h3>
      </div>

      <p className="text-base text-white leading-relaxed mb-6 relative z-10">
        As a venue/organizer in Germany hiring artistic talent, you are liable for the <strong>Künstlersozialabgabe (KSK)</strong> contribution.
      </p>

      <div className="bg-gray-900/50 p-6 rounded-lg border-l-4 border-pink-600 mb-8 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-medium">Estimated KSK Contribution (5.0%)</span>
          <span className="text-xl font-bold text-pink-600">{estimatedContribution.toLocaleString()} {currency}</span>
        </div>
        <small className="block mt-2 text-gray-500">Based on net fee of {netFee.toLocaleString()} {currency}</small>
      </div>

      <div className="bg-white/5 p-5 rounded-lg text-[13px] text-gray-400 mb-8 border border-gray-800 relative z-10">
        This amount is paid by <strong>YOU</strong> directly to the KSK and is <strong>NOT</strong> included in the platform checkout or the artist's payout.
      </div>

      <label className="flex items-start gap-4 cursor-pointer relative z-10 group">
        <input 
          type="checkbox" 
          className="mt-1 w-5 h-5 accent-pink-600 transition-all group-hover:scale-110"
          checked={acknowledged}
          onChange={(e) => onAcknowledge(e.target.checked)}
        />
        <span className="text-sm text-gray-200 leading-snug">
          I acknowledge my liability for reporting and paying the KSK contribution for this booking.
        </span>
      </label>

      <div className="flex gap-4 mt-10 relative z-10">
        <button className="flex-1 bg-transparent border border-gray-700 text-gray-400 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition">
          Learn More
        </button>
        <button 
          className={`flex-[2] py-3 rounded-lg font-bold text-sm transition shadow-lg ${
            acknowledged 
              ? 'bg-pink-600 text-white hover:bg-pink-700' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!acknowledged}
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
};
