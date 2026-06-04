import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, Globe, Star, Play } from "lucide-react";
import { WelcomeTrigger } from "@/components/i18n/WelcomeTrigger";
import { getSearchMetadata } from "@/components/seo/SearchSEO";
import { useTranslations } from "next-intl";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getSearchMetadata({ locale });
}

export default function Home() {
  const t = useTranslations("home");

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
      <section className="relative pt-48 pb-32 overflow-hidden stage-lighting-top">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        {/* Cinematic Backdrop Elements */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-crimson-velvet/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-royal-purple/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-black/80 border border-luxury-gold text-luxury-gold text-xs font-black mb-16 shadow-glow-gold animate-fade-in tracking-[0.4em] uppercase">
            <Star size={14} className="fill-luxury-gold" />
            <span>{t("hero_badge")}</span>
            <Star size={14} className="fill-luxury-gold" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-playfair font-black mb-6 md:mb-10 tracking-tight leading-[1.1] italic animate-slide-up">
            {t("hero_title_1")}<br />
            <span className="relative inline-block mt-4 md:mt-2">
              {/* Prestige Glow Layer */}
              <span 
                className="absolute inset-0 blur-[30px] md:blur-[60px] opacity-50 bg-luxury-gold select-none pointer-events-none"
                aria-hidden="true"
              ></span>
              {/* High-Fidelity Gradient Text */}
              <span className="relative z-10 glamour-heading py-2 block md:inline text-primary">
                {t("hero_title_italic")}
              </span>
            </span>
          </h1>
          
          <p className="text-base md:text-2xl text-gray-400 max-w-4xl mx-auto mb-10 md:mb-16 leading-relaxed font-light tracking-wide animate-fade-in [animation-delay:0.3s]">
            {t("hero_description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 justify-center items-center animate-fade-in [animation-delay:0.6s]">
            <Link href="/dashboard" className="btn-prestige btn-prestige-primary px-10 py-5 md:px-16 md:py-8 text-base md:text-xl group">
              <span className="relative z-10 flex items-center gap-4">
                {t("cta_get_started")}
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link href="/profile/sasha-sparkle" className="btn-prestige btn-prestige-gold px-10 py-5 md:px-16 md:py-8 text-base md:text-xl flex items-center gap-4">
              <Play size={20} className="fill-luxury-gold" />
              {t("cta_view_demo")}
            </Link>
          </div>
        </div>
      </section>

      {/* Global Scale Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4">{t("markets_title")}</h2>
          <h3 className="text-3xl md:text-5xl font-playfair italic font-bold mb-16">{t("markets_subtitle")}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 opacity-40">
            {["Berlin", "CDMX", "Rio", "London", "Tokyo", "Bangkok", "Madrid", "Paris", "NYC", "Sydney", "Toronto", "São Paulo", "Seoul", "Chueca", "Schöneberg", "Roma Norte", "Le Marais", "Shinjuku"].map((m) => (
              <div key={m} className="font-montserrat font-black text-sm tracking-widest hover:text-white transition-colors cursor-default">{m}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Economics / Commission Section */}
      <section className="py-32 bg-[#050505] border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <h2 className="text-luxury-gold font-bold tracking-[0.3em] uppercase text-xs">{t("commission_title")}</h2>
              <h3 className="text-5xl md:text-7xl font-playfair italic font-bold">
                {t("commission_label")} <br/>
                <span className="text-primary">{t("commission_value")}</span>
              </h3>
              <p className="text-gray-400 text-xl leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {t("commission_desc")}
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-2xl">
              <div className="glass-panel p-10 rounded-[3rem] border-primary/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8">
                    <Zap className="text-primary animate-pulse" size={32} />
                 </div>
                 
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                          <span>Traditional Agencies</span>
                          <span>15% - 30%</span>
                       </div>
                       <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-600 w-3/4 rounded-full" />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary">
                          <span>DRAGDEM Model</span>
                          <span>0.3%</span>
                       </div>
                       <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden p-1">
                          <div className="h-full bg-primary w-[1%] rounded-full shadow-glow-magenta" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-12 pt-12 border-t border-white/5 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Disrupting the Legacy Standard</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Proof Line */}
      <section className="py-12 bg-zinc-900/50 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around items-center gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <span className="font-montserrat font-black text-2xl">GLOBAL REACH</span>
            <span className="font-montserrat font-black text-2xl">100% ESCROW SECURE</span>
            <span className="font-montserrat font-black text-2xl">VERIFIED PROS</span>
            <span className="font-montserrat font-black text-2xl">24/7 MEDIATION</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-48 bg-black relative stage-lighting-bottom">
        <div className="container mx-auto px-4">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-montserrat font-black mb-6 tracking-tight">DESIGNED FOR EXCELLENCE</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-glow-magenta" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <FeatureCard 
              icon={<Zap className="text-primary" size={48} />}
              title="Digital Media Kit"
              description="High-fidelity profiles that showcase your acts, ratings, and certifications to global agencies."
              accent="magenta"
            />
            <FeatureCard 
              icon={<Shield className="text-secondary" size={48} />}
              title="The Drag Vault"
              description="Military-grade security for your technical riders, cue sheets, and digital performance assets."
              accent="cyan"
            />
            <FeatureCard 
              icon={<Globe className="text-luxury-gold" size={48} />}
              title="Booking Engine"
              description="A seamless, automated workflow for international bookings, contracts, and tax compliance."
              accent="gold"
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-48 bg-[#050505]">
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
