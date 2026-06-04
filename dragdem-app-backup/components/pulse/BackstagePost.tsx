'use client';

import React, { useState } from 'react';

interface BackstagePostProps {
  id: string;
  category: string;
  date: string;
  imageUrl: string;
  content: string;
  vaultLink?: {
    id: string;
    name: string;
  };
  initialSnaps: number;
  isVerified?: boolean;
}

export const BackstagePost = ({
  id,
  category,
  date,
  imageUrl,
  content,
  vaultLink,
  initialSnaps,
  isVerified = false,
}: BackstagePostProps) => {
  const [snaps, setSnaps] = useState(initialSnaps);
  const [isSnapped, setIsSnapped] = useState(false);

  const handleSnap = () => {
    if (!isSnapped) {
      setSnaps(snaps + 1);
      setIsSnapped(true);
      // Trigger magenta/gold glow effect (handled by CSS/State)
    }
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-lg border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col hover:border-pink-600/40 transition-all group">
      <div className="p-4 border-b border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
        <span className="text-cyan-400">#{category}</span>
        <span>{date}</span>
      </div>
      
      <div 
        className="h-64 bg-cover bg-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {content}
        </p>
        
        {vaultLink && (
          <a 
            href={`/vault/${vaultLink.id}`} 
            className="mt-auto inline-flex items-center gap-2 bg-yellow-600/10 border border-yellow-600/40 text-yellow-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600/20 transition-colors w-fit"
          >
            <span>💎</span>
            <span>View in Vault: {vaultLink.name}</span>
          </a>
        )}
      </div>

      <div className="p-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSnap}
            className={`text-2xl transition-all hover:scale-125 active:scale-95 cursor-pointer ${
              isSnapped 
                ? (isVerified 
                    ? 'drop-shadow-[0_0_15px_#D4AF37] grayscale-0' 
                    : 'drop-shadow-[0_0_15px_#FF00FF] grayscale-0') 
                : 'grayscale opacity-50 hover:opacity-100'
            }`}
          >
            🫰
          </button>
          <span className={`font-montserrat font-black text-xs ${isSnapped && isVerified ? 'text-yellow-500' : 'text-white'}`}>
            {snaps} Snaps
          </span>
        </div>
        <button className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
          Share
        </button>
      </div>

      {isSnapped && !isVerified && (
        <div className="absolute inset-0 pointer-events-none border-2 border-pink-600 rounded-2xl animate-ping opacity-20" />
      )}
    </div>
  );
};
