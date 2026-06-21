import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';
import CityTicker from "@/components/dashboard/CityTicker";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CDMX" });
  return {
    title: `${t("title")} | The Professional Backbone for Drag`,
    description: t("description"),
    openGraph: {
      images: ['/assets/cdmx_banner.png']
    }
  };
}

export default async function CDMXLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CDMX");
  const tPro = await getTranslations("InstitutionalPro");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      <div className="pt-[72px]">
        <CityTicker city="CDMX" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-64 pb-48 overflow-hidden stage-lighting-top">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(204,85,0,0.2)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-8 px-6 py-2 border-[#CC5500]/50 text-[#CC5500] uppercase tracking-[0.5em] text-xs font-bold">
            {t("title")}
          </Badge>
          <h1 className="text-6xl md:text-9xl font-playfair font-bold italic mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#CC5500]/80 to-white/50 leading-tight">
            {t("subtitle")}
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-3xl text-white/60 font-light leading-relaxed mb-16 italic">
            {t("description")}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#CC5500] text-white hover:bg-[#CC5500]/80 px-12 py-8 text-lg font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105">
                {t("cta")}
              </Button>
            </Link>
            <Link href="/institutional-pro">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 px-12 py-8 text-lg font-bold uppercase tracking-widest rounded-full transition-all">
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
              <div className="absolute -inset-4 bg-[#CC5500]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                <Image
                  src="/assets/cdmx_banner.png"
                  alt="CDMX Drag Scene"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <Image src="/assets/cdmx_badge.png" alt="CDMX Pro Badge" width={120} height={120} className="drop-shadow-2xl" />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-playfair italic font-bold">
                  {tPro("audit_ready_title")}
                </h2>
                <p className="text-xl text-white/50 font-light leading-relaxed">
                  {t("resico_info")}
                </p>
              </div>
              <div className="grid gap-8">
                <div className="flex gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-[#CC5500]/30 transition-colors">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#CC5500]/10 flex items-center justify-center">
                    <CheckCircle2 className="text-[#CC5500]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("sat_sync_title")}</h3>
                    <p className="text-white/40">{t("sat_sync_desc")}</p>
                  </div>
                </div>
                <div className="flex gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-[#73956F]/30 transition-colors">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#73956F]/10 flex items-center justify-center">
                    <Shield className="text-[#73956F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("corporate_title")}</h3>
                    <p className="text-white/40">{t("corporate_desc")}</p>
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
                <div className="absolute inset-0 bg-[#CC5500]/30 blur-[100px] rounded-full" />
                <Image
                  src="/assets/cdmx_seal.png"
                  alt="CDMX Labor Dignity Seal"
                  width={250}
                  height={250}
                  className="relative drop-shadow-[0_0_50px_rgba(204,85,0,0.3)]"
                />
             </div>
             <h2 className="text-5xl md:text-7xl font-playfair italic font-bold">
               Verified in CDMX.
             </h2>
             <p className="text-2xl text-white/40 font-light italic">
               Formalizando la economía naranja en la Ciudad de México.
             </p>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="container mx-auto px-4">
          <div className="font-montserrat font-black text-2xl tracking-[0.2em] mb-8">DRAGDEM CDMX</div>
          <div className="text-white/20 text-xs uppercase tracking-[0.5em]">
            © 2026 DRAGDEM.COM | THE PROFESSIONAL BACKBONE
          </div>
        </div>
      </footer>
    </main>
  );
}
