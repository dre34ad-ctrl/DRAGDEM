"use client";

import { Info, ShieldCheck, FileText } from "lucide-react";

interface SpainRETAInfoProps {
  amount: number;
  currency: string;
  irpfWithholding: number;
  isB2B: boolean;
  isNewAutonomo: boolean;
}

export function SpainRETAInfo({ 
  amount, 
  currency, 
  irpfWithholding, 
  isB2B,
  isNewAutonomo
}: SpainRETAInfoProps) {
  if (!isB2B) return null;

  return (
    <div className="mt-6 p-6 bg-amber-900/10 border border-amber-500/20 rounded-2xl space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="text-amber-400" size={20} />
        <h3 className="font-bold text-sm text-amber-100 uppercase tracking-wider">Spain: RETA & IVA Compliance</h3>
      </div>
      
      <p className="text-xs text-gray-400 leading-relaxed">
        Performer is registered under the <span className="text-amber-200 font-bold">RETA</span> (Régimen Especial de Trabajadores Autónomos). 
        As a business booker in Spain, you are required to handle the IRPF withholding.
      </p>

      <div className="bg-deep/50 rounded-xl p-4 border border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applied IRPF Rate</span>
          <span className="text-xs font-bold text-amber-400">{isNewAutonomo ? '7%' : '15%'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Withholding Amount</span>
          <span className="text-xs font-bold text-white">{irpfWithholding.toFixed(2)} {currency}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-900/20 rounded-lg">
        <Info className="text-amber-400 shrink-0 mt-0.5" size={12} />
        <p className="text-[10px] text-amber-200/70 leading-tight">
          The 21% IVA (VAT) will be added to your total. You must declare and pay the IRPF withholding to the Agencia Tributaria (Modelo 111).
        </p>
      </div>
    </div>
  );
}
