'use client';

import React from 'react';
import { PromptPayQRComponent } from '../ui/PromptPayQR';
import { Info } from 'lucide-react';

interface ThaiPromptPayInfoProps {
  amount: number;
  currency: string;
  promptPayId?: string;
  isB2B: boolean;
}

export const ThaiPromptPayInfo: React.FC<ThaiPromptPayInfoProps> = ({
  amount,
  currency,
  promptPayId = '0812345678', // Pilot default
  isB2B,
}) => {
  if (currency !== 'THB') return null;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3">
        <Info className="text-primary shrink-0" size={20} />
        <div className="space-y-1">
          <p className="text-sm font-bold text-white uppercase tracking-tight">PromptPay Pilot Enabled</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            As part of our Bangkok Pilot, you can pay via PromptPay QR for real-time settlement. 
            Funds will be held in our secure escrow until the performance is verified.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PromptPayQRComponent 
          id={promptPayId}
          idType="PHONE"
          amount={amount}
          title="Bangkok Pilot: Pay with PromptPay"
        />
      </div>

      {isB2B && (
        <div className="p-4 border border-dashed border-white/10 rounded-xl">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Tax Note</p>
          <p className="text-[10px] text-gray-600 leading-tight">
            A 3% Withholding Tax (WHT) has been deducted from the artist&apos;s payout as per Thai regulations for B2B transactions.
          </p>
        </div>
      )}
    </div>
  );
};
