'use client';

import { useEffect, useState } from 'react';
import { Masterclass, updateMasterclassProgress } from '@/lib/actions/masterclass';
import { ArrowLeft, Download, FileText, Share2, Play, CheckCircle2, Lock, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MasterclassClientProps {
  masterclass: any; 
  locale: string;
}

export default function MasterclassClient({ masterclass, locale }: MasterclassClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
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
    }, 10000); 

    return () => clearInterval(interval);
  }, [masterclass.id, scrollProgress]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-deep-charcoal z-50">
        <div 
          className="h-full bg-primary shadow-glow-magenta transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Header Area */}
      <div className="relative pt-32 pb-20 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-crimson-velvet)_0%,_transparent_70%)] opacity-30" />
         <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
         
         <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <Link 
              href={`/${locale}/masterclass`}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.3em] group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Archive
            </Link>

            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest shadow-glow-magenta/10">
                {masterclass.category}
              </span>
              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <Clock size={14} className="text-luxury-gold" />
                {masterclass.reading_time} MIN READ
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white mb-10 leading-tight italic">
              <span className="glamour-heading">{masterclass.title}</span>
            </h1>

            <div className="flex items-center justify-between py-8 border-y border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-deep-charcoal border border-luxury-gold/30 flex items-center justify-center text-2xl shadow-glow-gold/20">
                  ✨
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Curated By</p>
                  <p className="text-xl text-white font-black">{masterclass.author_name}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {masterclass.video_url && (
               <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden mb-20 border border-white/10 shadow-3xl group cursor-pointer">
                 <Image 
                   src={masterclass.thumbnail_url} 
                   alt="Video Cover" 
                   fill 
                   className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white shadow-glow-magenta group-hover:scale-110 transition-all">
                     <Play size={44} fill="currentColor" className="ml-2" />
                   </div>
                 </div>
                 <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-3xl">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Exclusive Video Module</p>
                    <p className="text-lg text-white font-medium">Watch the masterclass session with {masterclass.author_name}.</p>
                 </div>
               </div>
            )}

            {/* Article Content */}
            <article className="prose prose-invert prose-pink max-w-none mb-32">
              <div className="space-y-10 text-gray-300 text-xl leading-relaxed font-light">
                {masterclass.is_locked ? (
                  <div className="glass-panel border-luxury-gold/30 rounded-[3rem] p-16 text-center">
                    <div className="w-24 h-24 rounded-full bg-luxury-gold/10 border border-luxury-gold/50 flex items-center justify-center mx-auto mb-8 shadow-glow-gold">
                      <Lock className="text-luxury-gold" size={40} />
                    </div>
                    <h3 className="text-3xl font-playfair font-black text-white mb-4 italic">Pro Content Locked</h3>
                    <p className="text-gray-400 mb-10 text-lg">This module is reserved for our elite performers. Join the 'Institutional Pro' ranks to unlock this knowledge.</p>
                    <button className="bg-luxury-gold text-black font-black px-12 py-5 rounded-2xl hover:bg-gold-glow transition-all uppercase tracking-widest shadow-glow-gold text-sm">
                      Go Pro Now
                    </button>
                  </div>
                ) : (
                  masterclass.content.split('\n').map((para, i) => {
                    if (para.startsWith('# ')) return <h1 key={i} className="glamour-heading text-4xl md:text-5xl pt-12 pb-6">{para.replace('# ', '')}</h1>;
                    if (para.startsWith('## ')) return <h2 key={i} className="text-3xl font-playfair font-black text-primary pt-10 pb-4 italic">{para.replace('## ', '')}</h2>;
                    if (para.trim() === '') return null;
                    return <p key={i} className="mb-6">{para}</p>;
                  })
                )}
              </div>
            </article>

            {isCompleted && (
              <div className="glass-panel border-primary/30 rounded-[3rem] p-16 text-center mb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CheckCircle2 size={120} className="text-primary" />
                </div>
                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/50 flex items-center justify-center mx-auto mb-8 shadow-glow-magenta relative z-10">
                  <Sparkles className="text-primary" size={40} />
                </div>
                <h3 className="text-3xl font-playfair font-black text-white mb-4 italic">Module Mastered!</h3>
                <p className="text-gray-400 mb-10 text-lg">You&apos;ve successfully absorbed the wisdom of this masterclass. Your certification progress has been updated.</p>
                <Link 
                  href={`/${locale}/masterclass`}
                  className="inline-block bg-primary text-white font-black px-12 py-5 rounded-2xl hover:shadow-glow-magenta transition-all uppercase tracking-widest text-sm"
                >
                  Return to Archive
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar / Toolkit */}
          <div className="space-y-10">
            <div className="sticky top-24">
              <div className="glass-panel border-white/10 rounded-[2.5rem] p-10 shadow-3xl">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-luxury-gold/10 rounded-2xl border border-luxury-gold/30">
                     <FileText className="text-luxury-gold" size={24} />
                   </div>
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">The Toolkit</h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-10 leading-relaxed font-medium">
                  Implement the knowledge immediately with these professional-grade downloads.
                </p>

                <div className="space-y-5">
                  {masterclass.toolkit && masterclass.toolkit.length > 0 ? (
                    masterclass.toolkit.map((item: any) => (
                      <a 
                        key={item.id}
                        href={item.file_url}
                        className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-luxury-gold/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                            <Download size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white group-hover:text-luxury-gold transition-colors">{item.label}</p>
                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">{item.file_type}</p>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
                      <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">No assets found</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 p-8 bg-luxury-gold/5 rounded-[2rem] border border-luxury-gold/10 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                     <Sparkles size={60} className="text-luxury-gold" />
                  </div>
                  <p className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.4em] mb-4 relative z-10">Expert Insight</p>
                  <p className="text-sm text-gray-400 italic leading-relaxed relative z-10 font-medium">
                    &quot;Your business assets are as important as your stage performance. Treat them with the same creative rigor.&quot;
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
