import Navbar from "@/components/Navbar";
import { SearchSEO } from "@/components/seo/SearchSEO";
import { searchPerformers } from "@/lib/supabase/performers";
import PerformerCard from "@/components/search/PerformerCard";
import { getTranslations } from "next-intl/server";
import SearchFiltersWrapper from "./SearchFiltersWrapper";

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
    <main className="min-h-screen bg-deep text-white">
      <SearchSEO />
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold mb-4 italic tracking-tighter">
          {t("title")}
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          {t("results_count", { count: totalCount })}
        </p>

        <SearchFiltersWrapper 
          initialQuery={q || ""} 
          initialLocation={location || ""} 
          initialCategory={category || ""} 
        />

        {performers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {performers.map((performer) => (
              <PerformerCard key={performer.id} performer={performer} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-gray-800 p-20 rounded-3xl text-center">
            <p className="text-gray-400 text-xl">
              {t("no_results")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
