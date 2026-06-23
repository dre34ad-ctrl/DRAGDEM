import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, Globe, Star, Play } from "lucide-react";
import { WelcomeTrigger } from "@/components/i18n/WelcomeTrigger";
import { getSearchMetadata } from "@/components/seo/SearchSEO";
import type { Metadata } from 'next';

const locales = ['en', 'de', 'fr', 'mx', 'br', 'pt', 'th', 'jp', 'it', 'il', 'es', 'pl', 'sv', 'no', 'da', 'ko', 'vi', 'ar', 'zh', 'ph', 'he', 'kr'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getSearchMetadata({ locale });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <WelcomeTrigger />
      <Navbar />

      {/* Ticker for Global Pulse vibe */}
      <div className="ticker-wrap fixed top-[72px] z-40">
        <div className="ticker-content">
          {[1,2,3,4].map((i) => (
            <span key={i} className="ticker-item">
              London • Tokyo • New York • Berlin • São Paulo • Bangkok • Madrid • Toronto • Paris • Sydney •
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section with Stage Lighting */}
      <section className="relative pt-32 md:pt-48 pb-32 overflow-hidden stage-lighting-top">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Cinematic Backdrop Elements */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-crimson-velvet/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-royal-purple/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-deep-charcoal border border-white/10 mb-12 animate-fade-in shadow-glow-magenta/20">
            <Sparkles className="text-primary animate-pulse" size={20} />
            <span className="text-sm font-bold tracking-widest uppercase">International Performer Network</span>
          </div>

          <h1 className="glamour-heading text-4xl sm:text-7xl md:text-[11rem] italic leading-tight mb-8">
            {t("hero_title_1")} <br/> <span className="text-primary">{t("hero_title_italic")}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-2xl mb-16 leading-relaxed font-light italic">
            {t("hero_description")}
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/search" className="btn-prestige btn-prestige-primary px-12 py-6 text-xl group">
              {t("cta_get_started")} <ArrowRight className="inline ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/onboarding" className="btn-prestige px-12 py-6 text-xl border-white/20 hover:bg-white/5">
              {t("cta_view_demo")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-48 bg-black relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="animate-slide-up" style={{animationDelay: '0.1s', animationFillMode: 'both'}}>
              <FeatureCard
                icon={<Shield size={48} className="text-primary" />}
                title="Enterprise Security"
                description="Your assets are protected with military-grade encryption and secure vault access."
                accent="magenta"
              />
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
              <FeatureCard
                icon={<Zap size={48} className="text-secondary" />}
                title="Instant Settlements"
                description="Real-time payments and automated invoicing across 22+ currencies and local systems."
                accent="cyan"
              />
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.5s', animationFillMode: 'both'}}>
              <FeatureCard
                icon={<Star size={48} className="text-luxury-gold" />}
                title="Elite Management"
                description="Institutional-level performer management for festivals, corporate events, and world tours."
                accent="gold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase / Experience Section */}
      <section className="py-64 bg-deep-charcoal border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(218,24,132,0.05)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-10">
              <span className="text-primary font-bold tracking-[0.3em] uppercase">The Backstage Advantage</span>
              <h2 className="text-5xl md:text-7xl font-playfair italic font-bold">From Backstage to <br/><span className="text-primary">Mainstage.</span></h2>
              <p className="text-gray-400 text-xl leading-relaxed font-light">
                Our platform manages the logistics so you can focus on the performance. From automated PIX payouts in Brazil to KSK compliance in Germany, we handle the boring stuff.
              </p>
              <div className="space-y-6">
                {[
                  "Automated Regional Tax Handling",
                  "Verified Performance Insurance (PLI)",
                  "Real-time Booking Insights",
                  "Institutional Pro Certifications"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-glow-cyan" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-zinc-900 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <Play size={32} className="fill-white translate-x-1" />
                  </div>
               </div>
               <div className="absolute bottom-8 left-8 text-xs font-black tracking-widest uppercase opacity-40">System Preview v2.4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="py-64 text-center bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-royal-purple)_0%,_transparent_70%)] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative inline-block mb-16">
            <span
              className="absolute inset-0 blur-[50px] opacity-30 bg-primary select-none pointer-events-none"
              aria-hidden="true"
            ></span>
            <h2 className="relative z-10 glamour-heading text-6xl md:text-[9rem] italic leading-none">
              Join the Evolution.
            </h2>
          </div>
          <p className="text-gray-400 mb-20 max-w-4xl mx-auto text-2xl md:text-3xl font-light italic leading-relaxed">
            &quot;DRAGDEM is the professional backbone we&apos;ve been waiting for. It elevates the entire industry.&quot;
          </p>
          <Link href="/dashboard" className="btn-prestige btn-prestige-primary px-20 py-10 text-2xl hover:scale-110">
             Create Your Pro Profile
          </Link>
        </div>
      </section>

      <footer className="py-32 border-t border-white/5 text-center bg-black relative">
        <div className="container mx-auto px-4">
          <div className="mb-12 font-montserrat font-black text-3xl tracking-[0.2em]">DRAGDEM</div>
          <div className="flex justify-center gap-12 mb-16 text-gray-500 font-bold text-sm tracking-widest uppercase">
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">TikTok</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
          </div>
          <div className="text-gray-600 text-[10px] tracking-[0.5em] uppercase">
            &copy; 2026 DRAGDEM.com - The Professional Backbone for Drag Excellence.
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description, accent }: any) {
  const glowClass = {
    magenta: "group-hover:shadow-glow-magenta",
    cyan: "group-hover:shadow-glow-cyan",
    gold: "group-hover:shadow-glow-gold",
  }[accent as string] || "";

  const textAccentClass = {
    magenta: "group-hover:text-primary",
    cyan: "group-hover:text-secondary",
    gold: "group-hover:text-luxury-gold",
  }[accent as string] || "";

  return (
    <div className={`p-12 rounded-[3rem] bg-deep-charcoal border border-white/5 transition-all duration-700 group hover:-translate-y-4 glass-panel ${glowClass}`}>
      <div className="mb-12 p-8 bg-black rounded-[2rem] inline-block group-hover:scale-110 transition-transform duration-700 border border-white/5 relative">
        <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity bg-current ${textAccentClass}`} />
        <div className="relative z-10">{icon}</div>
      </div>
      <h3 className={`text-4xl font-playfair font-bold mb-8 text-white transition-colors duration-500 italic ${textAccentClass}`}>{title}</h3>
      <p className="text-gray-400 leading-relaxed text-xl font-light">{description}</p>
    </div>
  );
}
