'use client';

import React from 'react';

interface TrendingItem {
  id: string;
  title: string;
  author: string;
  readTime: string;
  snaps: number;
  isGold?: boolean;
}

export const TrendingSidebar = ({ items }: { items: TrendingItem[] }) => {
  return (
    <div className="space-y-12">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-4">
        Trending Now
      </h2>
      <ul className="space-y-10">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-start gap-6 group">
            <span className="font-montserrat text-4xl font-black text-pink-600/20 stroke-pink-600 stroke-1 select-none transition-colors group-hover:text-pink-600/40" style={{ WebkitTextStroke: '1px rgba(219, 39, 119, 0.5)' }}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              <strong className="block text-white text-sm leading-snug mb-2 group-hover:text-pink-600 transition-colors">
                {item.title}
              </strong>
              <span className="text-[10px] text-gray-500 uppercase tracking-tight">
                By: {item.author} • {item.readTime}
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm shadow-lg transition-transform group-hover:scale-110 cursor-pointer ${
              item.isGold ? 'border-yellow-600 text-yellow-500 shadow-yellow-600/20' : 'border-pink-600 text-pink-500 shadow-pink-600/20'
            }`}>
              🫰
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-gray-900 p-8 rounded-2xl border border-purple-900/50 text-center relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent pointer-events-none" />
        <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Newsletter</h4>
        <p className="text-[10px] text-gray-500 mb-6 relative z-10">Get the Pulse delivered to your inbox.</p>
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full bg-black border border-gray-800 p-3 rounded-lg text-white text-xs mb-4 focus:border-pink-600 outline-hidden transition-colors"
        />
        <button className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-pink-700 transition shadow-lg">
          Subscribe
        </button>
      </div>
    </div>
  );
};
