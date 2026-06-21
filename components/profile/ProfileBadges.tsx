import React from 'react';
import { BadgeCheck, ShieldCheck } from "lucide-react";

interface ProfileBadgesProps {
  isVerified: boolean;
  hasDignitySeal: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileBadges = ({ isVerified, hasDignitySeal, size = 'md' }: ProfileBadgesProps) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 24 : 32;
  
  return (
    <div className="flex items-center gap-3">
      {isVerified && (
        <div className={`flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 ${size === 'sm' ? 'px-3 py-1' : 'px-5 py-2'} rounded-full shadow-glow-gold/5`}>
          <BadgeCheck className="text-luxury-gold" size={iconSize} />
          <span className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.2em]">
            Verified Artist
          </span>
        </div>
      )}
      
      {hasDignitySeal && (
        <div className="relative group">
          <div className={`${size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'} bg-gradient-to-br from-[#D4AF37] via-[#F7EF8A] to-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform`}>
            <ShieldCheck className="text-black" size={iconSize + 4} />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black text-[#D4AF37] tracking-tighter uppercase">Labor Dignity Seal</span>
          </div>
        </div>
      )}
    </div>
  );
};
