'use client';

import React from 'react';
import { Newspaper, ExternalLink, Globe, Rss } from 'lucide-react';
import Link from 'next/link';

interface Source {
  name: string;
  url: string;
  description: string;
  region?: string;
}

const SOURCES: Source[] = [
  { name: 'PinkNews', url: 'https://www.pinknews.co.uk/', description: 'Leading global LGBTQ+ news source covering politics and entertainment.' },
  { name: 'World of Wonder', url: 'https://worldofwonder.com/', description: 'The definitive source for Drag Race updates and official industry announcements.' },
  { name: 'Bushwig Blog', url: 'https://bushwig.com/', description: 'Brooklyn drag festival news and NYC alternative scene coverage.', region: 'NYC' },
  { name: 'SoyHomosensual', url: 'https://www.homosensual.com/category/entretenimiento/drag/', description: 'Mexicos top LGBTQ+ site with local CDMX performer coverage.', region: 'CDMX' },
  { name: 'Revista Híbrida', url: 'https://hibrida.com.br/', description: 'Brazilian LGBTQ+ magazine with deep coverage of Rio de Janeiro drag.', region: 'Rio' },
];

export const NewsAggregator = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="text-cyan-400" size={20} />
          <h2 className="text-xl font-serif italic text-white">Community Pulse</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SOURCES.map((source, i) => (
          <a 
            key={i} 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-cyan-500/20 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest text-white">{source.name}</span>
                {source.region && (
                  <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-[4px] text-[8px] font-black">
                    {source.region}
                  </span>
                )}
              </div>
              <ExternalLink size={12} className="text-gray-700 group-hover:text-white transition-colors" />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
              {source.description}
            </p>
          </a>
        ))}
      </div>

      <div className="pt-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 transition-all">
          <Rss size={14} />
          Subscribe to RSS
        </button>
      </div>
    </div>
  );
};
