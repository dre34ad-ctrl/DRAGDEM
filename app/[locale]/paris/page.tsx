import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Globe, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Paris" });
  
  return {
    title: `${t("title")} | The Professional Backbone for Drag`,
    description: t("description"),
    openGraph: {
      images: ['/assets/paris_banner.png']
    }
  };
}

export default async function ParisLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Paris");
  const tCommon = await getTranslations("common");
  const tPro = await getTranslations("InstitutionalPro");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(218,24,132,0.15)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-8 px-6 py-2 border-primary/50 text-primary uppercase tracking-[0.5em] text-xs font-bold">
            {t("title")}
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-playfair font-bold italic mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50">
            {t("subtitle")}
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-16">
            {t("description")}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-primary text-white hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all px-10 py-8 h-auto text-sm font-bold uppercase tracking-widest">
              {t("cta")}
            </Button>
            <Link href={`/${locale}/institutional-pro`}>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 px-10 py-8 h-auto text-sm font-bold uppercase tracking-widest">
                {tPro("cta_demo")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local Content Section */}
      <section className="py-32 bg-deep-charcoal/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                <Image 
                  src="/assets/paris_banner.png" 
                  alt="Paris Drag Scene" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <Image src="/assets/paris_badge.png" alt="Paris Pro Badge" width={120} height={120} className="drop-shadow-2xl" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-playfair italic font-bold">
                  {tPro("audit_ready_title")}
                </h2>
                <p className="text-xl text-white/50 font-light leading-relaxed">
                  {t("guso_info")}
                </p>
              </div>

              <div className="grid gap-8">
                <div className="flex gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-primary/30 transition-colors">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tPro("paris_guso")}</h3>
                    <p className="text-white/40">{tPro("infrastructure_fee_desc")}</p>
                  </div>
                </div>

                <div className="flex gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-primary/30 transition-colors">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Shield className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tPro("labor_dignity_title")}</h3>
                    <p className="text-white/40">{tPro("labor_dignity_desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Seal Section */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full" />
                <Image 
                  src="/assets/paris_seal.png" 
                  alt="Paris Labor Dignity Seal" 
                  width={250} 
                  height={250} 
                  className="relative drop-shadow-[0_0_50px_rgba(255,0,255,0.3)]"
                />
             </div>
             <h2 className="text-5xl md:text-7xl font-playfair italic font-bold">
               Verified in Paris.
             </h2>
             <p className="text-2xl text-white/40 font-light italic">
               Le standard professionnel pour Divan du Monde, Madame Arthur, et toute la scène parisienne.
             </p>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="container mx-auto px-4">
          <div className="font-montserrat font-black text-2xl tracking-[0.2em] mb-8">DRAGDEM PARIS</div>
          <div className="text-white/20 text-xs uppercase tracking-[0.5em]">
            © 2026 DRAGDEM.COM | THE PROFESSIONAL BACKBONE
          </div>
        </div>
      </footer>
    </main>
  );
}
