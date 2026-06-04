'use client';

import React from 'react';

interface PulseHeroProps {
  title: string;
  category: string;
  imageUrl: string;
}

export const PulseHero = ({ title, category, imageUrl }: PulseHeroProps) => {
  return (
    <div 
      className="relative h-[500px] w-full bg-cover bg-center flex items-end p-10 md:p-16 border-b-4 border-pink-600 mb-12 rounded-b-3xl overflow-hidden"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
      
      <div className="relative z-10 max-w-3xl">
        <span className="text-cyan-400 uppercase font-black tracking-widest text-xs mb-4 block drop-shadow-md">
          {category}
        </span>
        <h1 className="font-serif italic text-5xl md:text-7xl text-white leading-[1.1] mb-6 drop-shadow-lg">
          {title}
        </h1>
        <button className="bg-pink-600 text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-sm hover:scale-105 transition shadow-[0_0_15px_rgba(219,39,119,0.5)]">
          Read Feature
        </button>
      </div>
    </div>
  );
};
