import React from 'react';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface JapanInvoiceInfoProps {
  amount: number;
  currency: string;
  hasTNumber: boolean;
  isB2B: boolean;
}

export const JapanInvoiceInfo: React.FC<JapanInvoiceInfoProps> = ({ 
  amount, 
  currency, 
  hasTNumber, 
  isB2B 
}) => {
  const consumptionTax = hasTNumber ? amount * 0.10 : 0;
  // Japanese withholding tax for individuals (10.21%)
  const withholdingTax = amount * 0.1021;

  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3">
      <div className="flex items-center gap-2 text-red-400">
        <Info size={18} />
        <h4 className="text-sm font-bold uppercase tracking-wider">Japan Compliance (インボイス)</h4>
      </div>
      
      <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
        <div className="flex items-start gap-2">
          {hasTNumber ? (
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
          )}
          <p>
            {hasTNumber 
              ? "Performer is registered with the Qualified Invoice System (T-Number)." 
              : "Performer is not registered with the Qualified Invoice System. Businesses may have reduced tax deductibility."
            }
          </p>
        </div>

        <p>
          Consumption Tax (10%) is applied {hasTNumber ? "to this booking" : "only for registered businesses"}.
        </p>
        
        {isB2B && (
          <p className="p-2 bg-deep/50 rounded-lg italic">
            Mandatory withholding tax of 10.21% will be deducted from the performer&apos;s payout as required by the National Tax Agency.
          </p>
        )}

        <div className="pt-2 border-t border-white/5 space-y-1 text-[10px] font-mono">
          <div className="flex justify-between items-center">
            <span>Consumption Tax (10%):</span>
            <span className="text-white">{currency} {consumptionTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-red-400">
            <span>Withholding Tax (10.21%):</span>
            <span>-{currency} {withholdingTax.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
