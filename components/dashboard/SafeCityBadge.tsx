'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SafeCityBadgeProps {
  type: 'performer' | 'venue';
  showLabel?: boolean;
}

export default function SafeCityBadge({ type, showLabel = true }: SafeCityBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 group relative cursor-help">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
        <div className="relative bg-deep border border-primary/50 p-1.5 rounded-full shadow-lg shadow-primary/10">
          <ShieldCheck size={18} className="text-primary fill-primary/10" />
        </div>
      </div>
      
      {showLabel && (
        <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-dotted border-gray-600 pb-0.5 group-hover:border-primary transition-colors">
          Safe-City Certified {type === 'performer' ? 'Pro' : 'Venue'}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-3 w-64 bg-charcoal border border-gray-800 p-4 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-primary mt-0.5" />
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest">DRAGDEM Institutional Standard</div>
            <p className="text-[10px] text-gray-400 font-inter leading-relaxed">
              This {type} has passed all 4 modules of the Academy (AC-101 to AC-104), meeting 
              global standards for tax compliance, insurance, production safety, and DEI.
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
          <span className="text-[9px] font-bold text-accent uppercase">Verifiable Badge</span>
          <span className="text-[9px] text-gray-500">Berlin Pride Municipal Code: 2026-X72</span>
        </div>
      </div>
    </div>
  );
}
