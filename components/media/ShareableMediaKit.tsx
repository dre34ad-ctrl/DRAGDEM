'use client';

import React from 'react';

interface MediaKitProps {
  stageName: string;
  performerImage: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  slug: string;
}

export const ShareableMediaKit: React.FC<MediaKitProps> = ({ stageName, performerImage, rating, reviewCount, tags, slug }) => {
  const profileUrl = `dragdem.com/performer/${slug}`;

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-2 border-pink-500 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,0,255,0.2)]">
      <div className="relative h-64 w-full">
        <img src={performerImage} alt={stageName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-6">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{stageName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400 font-bold">★ {rating}</span>
            <span className="text-gray-400 text-xs">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-pink-900/30 border border-pink-500/50 rounded-full text-[10px] font-bold text-pink-400 uppercase">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase rounded-xl transition shadow-lg flex items-center justify-center gap-3">
            <span>📅</span> Book Performance
          </button>
          <button className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase rounded-xl transition border border-gray-700 flex items-center justify-center gap-3">
            <span>📁</span> View Performance Vault
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Verified Professional Link</p>
          <div className="inline-block bg-black px-4 py-2 rounded-full border border-gray-800 font-mono text-xs text-pink-500">
            {profileUrl}
          </div>
        </div>
      </div>
    </div>
  );
};
