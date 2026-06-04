'use client';

import { useEffect, useState } from 'react';
import { Masterclass, updateMasterclassProgress } from '@/lib/actions/masterclass';
import { ArrowLeft, Download, FileText, Share2, Play, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MasterclassClientProps {
  masterclass: any; // Using any for simplicity as it includes toolkit
  locale: string;
}

export default function MasterclassClient({ masterclass, locale }: MasterclassClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      if (progress > 90 && !isCompleted) {
        setIsCompleted(true);
        updateMasterclassProgress(masterclass.id, 100, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [masterclass.id, isCompleted]);

  // Periodic progress update
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollProgress > 0 && scrollProgress < 90) {
        updateMasterclassProgress(masterclass.id, Math.floor(scrollProgress));
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [masterclass.id, scrollProgress]);

  return (
    <div className="relative">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-900 z-50">
        <div 
          className="h-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link 
          href={`/${locale}/masterclass`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-xs font-black tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-md bg-pink-500/10 border border-pink-500/30 text-pink-500 text-[10px] font-black uppercase tracking-widest">
                  {masterclass.category}
                </span>
                <span className="text-gray-600 font-bold">•</span>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {masterclass.reading_time} min read
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-playfair font-black text-white mb-8 leading-tight italic">
                {masterclass.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-gray-800 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface border border-gray-700 flex items-center justify-center text-xl shadow-lg">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Masterclass By</p>
                    <p className="text-white font-bold">{masterclass.author_name}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-surface border border-gray-800 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Player */}
            {masterclass.video_url && (
               <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 border border-gray-800 shadow-2xl group cursor-pointer">
                 <Image 
                   src={masterclass.thumbnail_url} 
                   alt="Video Cover" 
                   fill 
                   className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(219,39,119,0.5)] group-hover:scale-110 transition-transform">
                     <Play size={40} fill="currentColor" className="ml-2" />
                   </div>
                 </div>
                 <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Video Module</p>
                    <p className="text-sm text-gray-300">Watch the exclusive video session for this masterclass.</p>
                 </div>
               </div>
            )}

            {/* Article Content */}
            <article className="prose prose-invert prose-pink max-w-none mb-20">
              <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
                {masterclass.is_locked ? (
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-3xl p-10 text-center">
                    <Lock className="text-yellow-600 mx-auto mb-6" size={60} />
                    <h3 className="text-2xl font-bold text-white mb-2">Pro Content Locked</h3>
                    <p className="text-gray-400 mb-8">This masterclass is exclusive to Verified Pro members. Upgrade your account to unlock professional business and technical training.</p>
                    <button className="bg-yellow-600 text-black font-black px-10 py-4 rounded-2xl hover:bg-yellow-500 transition-all uppercase tracking-widest shadow-xl shadow-yellow-600/20">
                      Go Pro Now
                    </button>
                  </div>
                ) : (
                  masterclass.content.split('\n').map((para, i) => {
                    if (para.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white pt-8">{para.replace('# ', '')}</h1>;
                    if (para.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-pink-400 pt-6">{para.replace('## ', '')}</h2>;
                    if (para.trim() === '') return null;
                    return <p key={i}>{para}</p>;
                  })
                )}
              </div>
            </article>

            {isCompleted && (
              <div className="bg-pink-900/10 border border-pink-500/20 rounded-3xl p-10 text-center mb-20">
                <CheckCircle2 className="text-pink-500 mx-auto mb-6" size={60} />
                <h3 className="text-2xl font-bold text-white mb-2">Masterclass Completed!</h3>
                <p className="text-gray-400 mb-8">You've unlocked the knowledge in this module. Ready for the next one?</p>
                <Link 
                  href={`/${locale}/masterclass`}
                  className="inline-block bg-pink-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-pink-500 transition-all uppercase tracking-widest shadow-xl shadow-pink-600/20"
                >
                  Explore More Modules
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar / Toolkit */}
          <div className="space-y-8">
            <div className="sticky top-24">
              <div className="bg-surface border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                  <FileText className="text-pink-500" /> The Toolkit
                </h3>
                <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                  Download professional templates and checklists to implement what you've learned.
                </p>

                <div className="space-y-4">
                  {masterclass.toolkit && masterclass.toolkit.length > 0 ? (
                    masterclass.toolkit.map((item: any) => (
                      <a 
                        key={item.id}
                        href={item.file_url}
                        className="flex items-center justify-between p-4 bg-black/40 border border-gray-800 rounded-2xl hover:border-pink-500/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                            <Download size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">{item.label}</p>
                            <p className="text-[10px] text-gray-600 uppercase font-bold">{item.file_type}</p>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="p-8 border border-dashed border-gray-800 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">No assets for this module</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 p-6 bg-pink-500/5 rounded-2xl border border-pink-500/10">
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-3">Expert Insight</p>
                  <p className="text-xs text-gray-400 italic leading-relaxed">
                    "Consistent management of your professional assets is the key to scaling your performance career."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
