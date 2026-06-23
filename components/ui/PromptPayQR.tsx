'use client';

import React from 'react';
import { PromptPayQR, PromptPayIDType } from '@/lib/utils/promptpay-qr';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface PromptPayQRComponentProps {
  id: string;
  idType: PromptPayIDType;
  amount?: number;
  title?: string;
  description?: string;
  thaiDescription?: string;
}

export const PromptPayQRComponent: React.FC<PromptPayQRComponentProps> = ({
  id,
  idType,
  amount,
  title = 'Pay via PromptPay',
  description = 'Scan this QR code with your Thai banking app to complete the payment.',
  thaiDescription = 'สแกนคิวอาร์โค้ดนี้ด้วยแอปธนาคารของคุณเพื่อชำระเงิน',
}) => {
  const imageUrl = PromptPayQR.getImageUrl({ id, idType, amount });

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden border-2 border-primary/20 bg-white/5 backdrop-blur-sm">
      <CardHeader className="bg-primary/10 pb-4 text-center border-b border-primary/10">
        <CardTitle className="text-xl font-bold flex flex-col items-center gap-2 text-white">
          <img 
            src="/assets/promptpay-logo.png" 
            alt="PromptPay" 
            className="h-10 object-contain mb-1 filter brightness-0 invert" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          {title}
        </CardTitle>
        {amount && (
          <p className="text-3xl font-black text-primary mt-2 drop-shadow-sm">
            ฿{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center p-8 gap-6">
        <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-primary/20">
          <img 
            src={imageUrl} 
            alt="PromptPay QR Code" 
            className="w-56 h-56"
          />
          {/* Decorative frame elements to make it look official */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-200 leading-snug font-medium">
            {description}
          </p>
          <p className="text-sm text-primary leading-snug font-bold">
            {thaiDescription}
          </p>
          <div className="pt-3 flex flex-col gap-1 items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Recipient PromptPay ID</span>
            <code className="text-sm font-mono bg-black/40 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
              {id.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </code>
          </div>
        </div>

        <div className="w-full mt-2 pt-6 border-t border-white/10 border-dashed flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Transfer</span>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Real-time settlement</span>
        </div>
      </CardContent>
    </Card>
  );
};
