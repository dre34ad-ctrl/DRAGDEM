'use client';

import React from 'react';
import { FileText, Info } from 'lucide-react';

interface JapanTNumberFieldProps {
  value: string;
  onChange: (val: string) => void;
}

export const JapanTNumberField: React.FC<JapanTNumberFieldProps> = ({ value, onChange }) => {
  return (
    <div className="bg-surface border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Qualified Invoice System (Japan)</h3>
          <p className="text-xs text-gray-500 font-inter">Required for B2B seekers to claim consumption tax credits.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">T-Number (Registered Invoice ID)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">T</span>
            <input 
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
              placeholder="13-digit number"
              className="w-full bg-deep border border-gray-700 rounded-xl py-4 pl-8 pr-4 focus:outline-hidden focus:border-primary font-mono text-sm tracking-widest"
            />
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
          <Info className="text-primary shrink-0" size={16} />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Registering a T-Number makes you more attractive to corporate venues and event planners in Japan, as it allows them to deduct the 10% consumption tax from their liability.
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Yakuza Exclusion Clause</span>
          <span className="text-[10px] font-black text-accent uppercase px-2 py-1 bg-accent/10 rounded-md">Mandatory</span>
        </div>
        <p className="mt-2 text-[10px] text-gray-600 leading-relaxed">
          Your Japanese profile automatically includes the Anti-Social Forces (ASF) exclusion clause in all generated contracts to comply with local business standards.
        </p>
      </div>
    </div>
  );
};
