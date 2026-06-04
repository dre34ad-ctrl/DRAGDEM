"use client";

import { Info, Landmark, FileText } from "lucide-react";
import { useState } from "react";

interface FranceGUSOFormProps {
  onValidated: (data: { siret: string; accountNum: string }) => void;
}

export function FranceGUSOForm({ onValidated }: FranceGUSOFormProps) {
  const [siret, setSiret] = useState("");
  const [accountNum, setAccountNum] = useState("");

  return (
    <div className="mt-6 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Landmark className="text-blue-400" size={20} />
        <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider">France: GUSO Compliance</h3>
      </div>
      
      <p className="text-xs text-gray-400 leading-relaxed mb-4">
        As a French venue or occasional employer, you are required to use the GUSO system for simplified administrative declarations and social contributions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">SIRET Number</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
            <input 
              type="text"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
              placeholder="123 456 789 00012"
              className="w-full bg-deep border border-gray-800 rounded-lg py-2 pl-10 pr-3 text-xs focus:border-blue-500 outline-hidden transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">GUSO Account Number</label>
          <div className="relative">
            <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
            <input 
              type="text"
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
              placeholder="G123456789"
              className="w-full bg-deep border border-gray-800 rounded-lg py-2 pl-10 pr-3 text-xs focus:border-blue-500 outline-hidden transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-900/20 rounded-lg">
        <Info className="text-blue-400 shrink-0 mt-0.5" size={12} />
        <p className="text-[10px] text-blue-200/70 leading-tight">
          By providing these details, we will facilitate the generation of the GUSO declaration. Social contributions are to be paid directly to GUSO.
        </p>
      </div>
    </div>
  );
}
