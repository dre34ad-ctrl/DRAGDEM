import Navbar from "@/components/Navbar";
import { getMasterclasses, getMasterclassProgress } from "@/lib/actions/masterclass";
import MasterclassCard from "@/components/masterclass/MasterclassCard";
import { Search, Filter, Sparkles } from "lucide-react";
import AcademyStatus from "@/components/dashboard/AcademyStatus";
import { useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function MasterclassLandingPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category = 'All' } = await searchParams;
  const messages = await getMessages();
  // Note: in Server Components we can't use useTranslations directly if it's not wrapped in NextIntlClientProvider or using getTranslations
  // But wait, our layout has NextIntlClientProvider.
  // Actually for server components, we use getTranslations.
  
  const masterclasses = await getMasterclasses(category);
  const progress = await getMasterclassProgress();

  const categories = ["All", "Business", "Tech", "Safety", "Regional"];

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--color-crimson-velvet)_0%,_transparent_50%),radial-gradient(circle_at_bottom_left,_#121212_0%,_black_100%)]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/50 border border-luxury-gold/50 text-luxury-gold text-sm font-bold mb-8 shadow-glow-gold animate-neon-pulse">
            <Sparkles size={16} />
            <span className="tracking-[0.2em] uppercase">Academy Excellence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-playfair font-black text-white mb-8 italic">
            The <span className="glamour-heading">Masterclass</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-inter font-light leading-relaxed">
            Stop guessing, start mastering. The definitive educational resources for the modern professional performer.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
              <input 
                type="text" 
                placeholder="Search the archive..." 
                className="w-full bg-deep-charcoal border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-white focus:border-primary/50 outline-hidden transition-all shadow-2xl text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Phase 11: Academy Status Integration */}
        <AcademyStatus />

        {/* Filtering */}
        <div className="flex flex-wrap items-center gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center gap-2 text-gray-500 mr-4 uppercase text-[10px] font-black tracking-[0.3em]">
            <Filter size={14} className="text-primary" /> Filter by Track:
          </div>
          {categories.map((cat) => (
            <a 
              key={cat}
              href={`/${locale}/masterclass?category=${cat}`}
              className={`px-8 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                category === cat 
                  ? "bg-primary border-primary text-white shadow-glow-magenta" 
                  : "bg-deep-charcoal border-white/10 text-gray-500 hover:border-primary/50 hover:text-white"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
          <div className="text-center py-32 glass-panel rounded-[2rem] border-dashed border-white/5">
            <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-sm">No modules found in this track.</p>
          </div>
        )}
      </div>
    </main>
  );
}
