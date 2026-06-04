import Navbar from "@/components/Navbar";
import { getMasterclasses, getMasterclassProgress } from "@/lib/actions/masterclass";
import MasterclassCard from "@/components/masterclass/MasterclassCard";
import { Search, Filter } from "lucide-react";

export default async function MasterclassLandingPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category = 'All' } = await searchParams;
  
  const masterclasses = await getMasterclasses(category);
  const progress = await getMasterclassProgress();

  const categories = ["All", "Business", "Tech", "Safety", "Regional"];

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')] bg-cover bg-center opacity-30 grayscale" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-6xl font-playfair font-black text-white mb-6 italic">
            The <span className="text-pink-500">Masterclass</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-inter leading-relaxed">
            Empowering performers with professional-grade educational resources to master the business and technical aspects of drag.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="What do you want to learn today?"
              className="w-full bg-surface border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-pink-500 outline-hidden transition-all shadow-2xl"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filtering */}
        <div className="flex flex-wrap items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center gap-2 text-gray-500 mr-2 uppercase text-xs font-bold tracking-widest">
            <Filter size={16} /> Filter:
          </div>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/${locale}/masterclass?category=${cat}`}
              className={`px-6 py-2 rounded-full border font-bold text-xs uppercase tracking-widest transition-all ${
                category === cat 
                  ? "bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-600/20" 
                  : "bg-surface border-gray-800 text-gray-500 hover:border-gray-600"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masterclasses.map((mc) => (
            <MasterclassCard 
              key={mc.id} 
              masterclass={mc} 
              progress={progress.find(p => p.masterclass_id === mc.id)}
              locale={locale}
            />
          ))}
        </div>

        {masterclasses.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-900 rounded-3xl">
            <p className="text-gray-600 font-bold uppercase tracking-widest">No masterclasses found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
