import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, FileText, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default async function InstitutionalProPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('InstitutionalPro');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* Ticker */}
      <div className="bg-black border-b border-white/10 py-3 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[1, 2].map((i) => (
            <div key={i} className="flex shrink-0">
              <span className="mx-12 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold">{t('infrastructure_fee_title')}</span>
              <span className="mx-12 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold">{t('berlin_ksk')}</span>
              <span className="mx-12 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold">{t('paris_guso')}</span>
              <span className="mx-12 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold">{t('labor_dignity_title')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-20 relative">
          <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent pointer-events-none" />
          
          <Badge variant="outline" className="mb-6 px-6 py-1 border-primary/50 text-primary uppercase tracking-[0.5em] text-[10px] font-bold">
            {t('hero_tagline')}
          </Badge>
          
          <h1 className="text-5xl md:text-8xl font-playfair font-bold italic bg-clip-text text-transparent bg-gradient-to-b from-luxury-gold via-gold-light to-luxury-gold leading-tight mb-8">
            {t('hero_title').split(' ').map((word, i) => (
              <span key={i} className={i >= 3 ? "block md:inline" : ""}>{word} </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            {t('hero_description')}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-primary text-white hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all px-8 py-8 h-auto text-sm font-bold uppercase tracking-widest">
              {t('cta_apply')}
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all px-8 py-8 h-auto text-sm font-bold uppercase tracking-widest">
              {t('cta_demo')}
            </Button>
          </div>
        </section>

        {/* Infrastructure Section */}
        <section id="infrastructure" className="py-32 border-t border-white/5">
          <h2 className="glamour-heading text-4xl md:text-5xl text-center mb-20">{t('infrastructure_title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-all p-8 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('infrastructure_fee_title')}</h3>
              <p className="text-white/50 leading-relaxed">{t('infrastructure_fee_desc')}</p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-all p-8 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('unified_billing_title')}</h3>
              <p className="text-white/50 leading-relaxed">{t('unified_billing_desc')}</p>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-all p-8 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('labor_dignity_title')}</h3>
              <p className="text-white/50 leading-relaxed">{t('labor_dignity_desc')}</p>
            </Card>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <div className="bg-[#8B0000] py-20">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-primary mb-2 shadow-text">0.3%</h2>
            <p className="text-xs font-bold uppercase tracking-[0.3em]">{t('fee_standard')}</p>
          </div>
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-cyan-400 mb-2 shadow-text">100%</h2>
            <p className="text-xs font-bold uppercase tracking-[0.3em]">{t('tax_compliance')}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-5xl md:text-7xl font-bold text-luxury-gold mb-2 shadow-text">18</h2>
            <p className="text-xs font-bold uppercase tracking-[0.3em]">{t('global_hubs')}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Compliance Section */}
        <section id="compliance" className="py-32">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="glamour-heading text-5xl md:text-6xl leading-tight">{t('audit_ready_title')}</h2>
              <p className="text-xl text-white/60 leading-relaxed">{t('audit_ready_desc')}</p>
              
              <ul className="space-y-6 pt-6">
                {[
                  { title: "Berlin KSK", text: t('berlin_ksk') },
                  { title: "Paris GUSO", text: t('paris_guso') },
                  { title: "London VAT", text: t('london_vat') }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
                    <span className="text-lg font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <Card className="relative bg-white/5 border-luxury-gold/30 overflow-hidden rounded-[2rem]">
                <div className="aspect-video relative grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700">
                  <Image 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" 
                    alt="Dashboard" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="p-8 border-t border-luxury-gold/20">
                  <p className="text-primary font-bold text-xs uppercase tracking-[0.5em]">{t('real_time_fiscal')}</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Seal Section */}
        <section className="py-32 text-center border-t border-white/5">
          <div className="relative inline-block mb-12">
            <div className="absolute inset-0 bg-luxury-gold/40 blur-3xl rounded-full" />
            <Image 
              src="/assets/labor_dignity_seal.png" 
              alt="Labor Dignity Seal" 
              width={300} 
              height={300} 
              className="relative drop-shadow-[0_0_50px_rgba(212,175,55,0.5)]"
            />
          </div>
          <h2 className="glamour-heading text-4xl md:text-5xl mb-8">{t('gold_seal_title')}</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            {t('gold_seal_desc')}
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="glamour-heading text-5xl md:text-7xl">{t('join_standard_title')}</h2>
              <p className="text-white/60 text-lg">{t('join_standard_desc')}</p>
            </div>
            
            <form className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('org_name')}</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-none p-4 focus:border-primary outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('business_email')}</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-none p-4 focus:border-primary outline-none transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('interested_hub')}</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-none p-4 focus:border-primary outline-none transition-colors appearance-none">
                  <option className="bg-neutral-900">Berlin (KSK Automation)</option>
                  <option className="bg-neutral-900">Paris (GUSO Support)</option>
                  <option className="bg-neutral-900">London (VAT Framework)</option>
                  <option className="bg-neutral-900">NYC (DCLA Grant Readiness)</option>
                  <option className="bg-neutral-900">CDMX (RESICO Bridge)</option>
                </select>
              </div>
              <Button size="lg" className="w-full bg-primary py-8 text-sm font-bold uppercase tracking-[0.3em]">
                {t('request_access')}
              </Button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <div>© 2026 DRAGDEM.COM | THE ORANGE ECONOMY OS</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Infrastructure</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
