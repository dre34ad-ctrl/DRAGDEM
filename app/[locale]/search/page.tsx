import Navbar from "@/components/Navbar";
import { getSearchMetadata } from "@/components/seo/SearchSEO";
import { searchPerformers } from "@/lib/supabase/performers";
import PerformerCard from "@/components/search/PerformerCard";
import { getTranslations } from "next-intl/server";
import SearchFiltersWrapper from "./SearchFiltersWrapper";
import type { Metadata } from 'next';
import { Sparkles, Search } from "lucide-react";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; location?: string; category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category, location } = await searchParams;
  
  return getSearchMetadata({
    category: category || 'Drag Queen',
    city: location || 'Global',
    locale
  });
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; location?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { q, location, category } = await searchParams;
  const t = await getTranslations("search");

  const { performers, totalCount } = await searchPerformers({
    query: q,
    location,
    category,
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary">
      <Navbar />
      
      {/* Search Header */}
      <section className="pt-32 pb-20 stage-lighting-top relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Search className="text-secondary" size={20} />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black font-montserrat tracking-tighter italic">
                    {t("title").toUpperCase()}
                  </h1>
               </div>
               <p className="text-gray-500 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3">
                 Institutional Discovery 
                 <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-magenta animate-pulse" />
                 {t("results_count", { count: totalCount })} Matches Detected
               </p>
            </div>
            
            <div className="w-full md:w-auto">
               <SearchFiltersWrapper 
                initialQuery={q || ""} 
                initialLocation={location || ""} 
                initialCategory={category || ""} 
               />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 pb-32">
        {performers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {performers.map((performer) => (
              <PerformerCard key={performer.id} performer={performer} />
            ))}
          </div>
        ) : (
          <div className="glass-panel border-white/5 p-32 rounded-[3rem] text-center">
            <div className="inline-flex p-8 bg-zinc-900 rounded-full border border-white/5 mb-8 text-gray-700">
               <Sparkles size={64} />
            </div>
            <p className="text-gray-500 text-2xl font-light italic tracking-wide">
              {t("no_results")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
