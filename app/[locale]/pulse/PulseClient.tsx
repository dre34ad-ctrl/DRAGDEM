'use client';

import Navbar from "@/components/Navbar";
import { PulseHero } from "@/components/pulse/PulseHero";
import { MagazineGrid } from "@/components/pulse/MagazineGrid";
import { TrendingSidebar } from "@/components/pulse/TrendingSidebar";
import { SafeCityIndex } from "@/components/pulse/SafeCityIndex";
import { NewsAggregator } from "@/components/pulse/NewsAggregator";
import { ARTICLES } from "@/lib/editorial/articles";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, BarChart3, Users } from "lucide-react";

interface PulseClientProps {
  safeCityData: any[];
}

export default function PulseClient({ safeCityData }: PulseClientProps) {
  const { locale } = useParams();
  
  const FEATURED_ARTICLE = ARTICLES.find(a => a.id === 'london-liberty') || ARTICLES[0];
  const REMAINING_ARTICLES = ARTICLES.filter(a => a.id !== FEATURED_ARTICLE.id);

  const TRENDING = [
    {
      id: "t4",
      title: "London Liberty: The Corporate Interview",
      slug: "london-liberty-corporate-chameleon",
      author: "Editorial Team",
      readTime: "5 min read",
      snaps: 892,
      isGold: true
    },
    {
      id: "t5",
      title: "How to apply for a T-Number in Japan",
      slug: "japan-t-number-guide",
      author: "Tax Team",
      readTime: "4 min read",
      snaps: 456
    },
    {
      id: "t1",
      title: "Why Metallic Gold is the New Magenta",
      slug: "#",
      author: "Editorial Team",
      readTime: "5 min read",
      snaps: 245
    }
  ];

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <Link href={`/${locale}/pulse/${FEATURED_ARTICLE.slug}`}>
          <PulseHero 
            title={FEATURED_ARTICLE.title}
            category={FEATURED_ARTICLE.category}
            imageUrl={FEATURED_ARTICLE.imageUrl}
          />
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
          <div className="lg:col-span-2 space-y-20">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 pb-4 mb-8">
                Latest Stories
              </h2>
              <MagazineGrid articles={REMAINING_ARTICLES} />
            </section>

            <section id="safety-index">
              <SafeCityIndex data={safeCityData} />
            </section>
          </div>
          
          <aside className="space-y-12">
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
               <div className="flex items-center gap-3 mb-6">
                 <ShieldAlert className="text-pink-500" size={20} />
                 <h3 className="text-white font-black uppercase tracking-widest text-xs">Verified Safety</h3>
               </div>
               <p className="text-gray-500 text-[11px] leading-relaxed mb-6">
                 Have you experienced a venue firsthand? Help the community by contributing to our Safety Index.
               </p>
               <div className="flex flex-col gap-3">
                 <Link 
                  href={`/${locale}/community/safety`}
                  className="w-full inline-flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                 >
                   View Safety Index
                 </Link>
                 <Link 
                  href={`/${locale}/community/safety/report`}
                  className="w-full inline-flex items-center justify-center py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-glow-pink/20"
                 >
                   Report an Incident
                 </Link>
               </div>
            </div>

            <NewsAggregator />

            <TrendingSidebar items={TRENDING} />

            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-cyan-400" size={16} />
                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Hub Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-[10px] uppercase">Active Readers</span>
                  <span className="text-cyan-400 font-mono text-xl font-bold">4,210</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-[10px] uppercase">Verified Sources</span>
                  <span className="text-cyan-400 font-mono text-xl font-bold">128</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Global Pulse Ticker Placeholder */}
      <div className="fixed bottom-0 left-0 w-full bg-crimson-velvet border-t border-luxury-gold py-2 z-50 overflow-hidden shadow-glow-gold/10">
        <div className="flex whitespace-nowrap animate-marquee text-[10px] font-black uppercase tracking-widest text-white">
          <span className="mx-4"><span className="text-secondary">BREAKING:</span> London Liberty Verified for B2B • Tokyo T-Number System Live • PIX Instant Rails Live in Brazil • Thailand PromptPay B2B Integration Complete • Germany KSK Liability Calculator Live • Mexico CFDI 4.0 Automated Invoicing System Live • Global Drag Market hits $500M •</span>
          <span className="mx-4"><span className="text-secondary">BREAKING:</span> London Liberty Verified for B2B • Tokyo T-Number System Live • PIX Instant Rails Live in Brazil • Thailand PromptPay B2B Integration Complete • Germany KSK Liability Calculator Live • Mexico CFDI 4.0 Automated Invoicing System Live • Global Drag Market hits $500M •</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
