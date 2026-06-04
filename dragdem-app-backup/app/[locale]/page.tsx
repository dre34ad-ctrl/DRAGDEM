import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { WelcomeTrigger } from "@/components/i18n/WelcomeTrigger";
import { SearchSEO } from "@/components/seo/SearchSEO";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="min-h-screen">
      <SearchSEO />
      <WelcomeTrigger />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_70%)] opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-primary/30 text-primary text-sm font-bold mb-8 animate-pulse">
            <Sparkles size={16} />
            <span>{t("hero_badge")}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-montserrat font-extrabold mb-6 tracking-tighter leading-none">
            {t("hero_title_1")}<span className="text-linear-to-r from-primary to-secondary bg-clip-text text-transparent italic">{t("hero_title_italic")}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("hero_description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard" className="px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg">
              {t("cta_get_started")}
              <ArrowRight size={20} />
            </Link>
            <Link href="/profile/sasha-sparkle" className="px-10 py-5 bg-surface border border-gray-800 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg">
              {t("cta_view_demo")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-deep/50 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="text-primary" size={32} />}
              title="Digital Media Kit"
              description="A professional, discoverable landing page for venues and corporate bookers."
            />
            <FeatureCard 
              icon={<Shield className="text-secondary" size={32} />}
              title="The Drag Vault"
              description="Inventory tracking for your costumes, wigs, and digital performance assets."
            />
            <FeatureCard 
              icon={<Globe className="text-accent" size={32} />}
              title="Booking Engine"
              description="Centralized calendar to manage availability, inquiries, and automated contracts."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="glamour-heading text-4xl md:text-6xl mb-8">Join the Evolution of Drag.</h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
            DRAGDEM is built by performers, for performers. Whether you&apos;re a local legend or a global star, we give you the tools to professionalize your passion.
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-800" />
            <div className="w-12 h-12 rounded-full bg-gray-800" />
            <div className="w-12 h-12 rounded-full bg-gray-800" />
            <div className="w-12 h-12 rounded-full bg-gray-800" />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-900 text-center text-gray-600 text-sm">
        &copy; 2026 DRAGDEM.com - The Professional Backbone for Drag Excellence.
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-8 rounded-3xl bg-surface border border-gray-800 hover:border-primary/50 transition-all group">
      <div className="mb-6 p-4 bg-deep inline-block rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
