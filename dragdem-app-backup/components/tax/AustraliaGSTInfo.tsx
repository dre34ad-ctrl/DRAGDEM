import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

interface AustraliaGSTInfoProps {
  amount: number;
  currency: string;
  hasABN: boolean;
  isB2B: boolean;
}

export const AustraliaGSTInfo: React.FC<AustraliaGSTInfoProps> = ({ 
  amount, 
  currency, 
  hasABN, 
  isB2B 
}) => {
  const gstAmount = amount * 0.10;
  const withholdingAmount = hasABN ? 0 : amount * 0.47;

  return (
    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-3">
      <div className="flex items-center gap-2 text-blue-400">
        <Info size={18} />
        <h4 className="text-sm font-bold uppercase tracking-wider">Australia Tax Info</h4>
      </div>
      
      <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
        <p>
          Goods and Services Tax (GST) of 10% is applicable if the performer is registered.
        </p>
        
        {isB2B && !hasABN && (
          <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertTriangle size={16} className="shrink-0" />
            <p>
              <strong>No ABN Provided:</strong> Australian law requires a mandatory withholding of 47% (No-ABN withholding) for B2B payments. We strongly recommend the performer provides an ABN.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
          <span>Estimated GST (10%):</span>
          <span className="text-white">{currency} {gstAmount.toFixed(2)}</span>
        </div>
        
        {withholdingAmount > 0 && (
          <div className="flex justify-between items-center text-[10px] font-mono text-red-400">
            <span>Mandatory Withholding (47%):</span>
            <span>-{currency} {withholdingAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
