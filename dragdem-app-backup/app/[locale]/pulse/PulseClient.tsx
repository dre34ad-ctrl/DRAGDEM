
'use client';

import Navbar from "@/components/Navbar";
import { PulseHero } from "@/components/pulse/PulseHero";
import { MagazineGrid } from "@/components/pulse/MagazineGrid";
import { TrendingSidebar } from "@/components/pulse/TrendingSidebar";
import { ARTICLES } from "@/lib/editorial/articles";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PulsePage() {
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
          <div className="lg:col-span-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-4 mb-8">
              Latest Stories
            </h2>
            <MagazineGrid articles={REMAINING_ARTICLES} />
          </div>
          
          <aside>
            <TrendingSidebar items={TRENDING} />
          </aside>
        </div>
      </div>

      {/* Global Pulse Ticker Placeholder */}
      <div className="fixed bottom-0 left-0 w-full bg-red-900 border-t border-yellow-600 py-2 z-50 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee text-[10px] font-black uppercase tracking-widest text-cyan-400">
          <span className="mx-4">BREAKING: London Liberty Verified for B2B • Tokyo T-Number System Live • PIX Instant Rails Live in Brazil • Thailand PromptPay B2B Integration Complete • Germany KSK Liability Calculator Live • Mexico CFDI 4.0 Automated Invoicing System Live • Global Drag Market hits $500M •</span>
          <span className="mx-4">BREAKING: London Liberty Verified for B2B • Tokyo T-Number System Live • PIX Instant Rails Live in Brazil • Thailand PromptPay B2B Integration Complete • Germany KSK Liability Calculator Live • Mexico CFDI 4.0 Automated Invoicing System Live • Global Drag Market hits $500M •</span>
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
