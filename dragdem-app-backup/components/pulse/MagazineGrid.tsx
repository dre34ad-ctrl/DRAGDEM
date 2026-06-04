'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  imageUrl: string;
  region?: string;
}

export const MagazineGrid = ({ articles }: { articles: Article[] }) => {
  const { locale } = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {articles.map((article) => (
        <Link
          key={article.id} 
          href={`/${locale}/pulse/${article.slug}`}
          className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl overflow-hidden hover:border-pink-600/50 transition-all hover:-translate-y-1 group block"
        >
          <div 
            className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${article.imageUrl})` }}
          />
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{article.category}</span>
              {article.region && (
                <span className="bg-cyan-400/10 text-cyan-400 border border-cyan-400 px-2 py-0.5 rounded text-[8px] font-black">{article.region}</span>
              )}
            </div>
            <h3 className="font-serif italic text-2xl text-white mb-4 leading-tight group-hover:text-pink-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-tighter">
              By: {article.author} • {article.readTime}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
