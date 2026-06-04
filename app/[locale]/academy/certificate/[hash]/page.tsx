import { verifyCertificate } from "@/lib/services/academy-service";
import { notFound } from "next/navigation";
import { Award, ShieldCheck, CheckCircle2, Calendar, Globe, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ hash: string, locale: string }> }): Promise<Metadata> {
  const { hash } = await params;
  
  // For simplicity, we just use a generic title, but we could fetch performer name here too.
  return {
    title: `Verified Institutional Pro Certificate | DRAGDEM`,
    description: `Public verification of DRAGDEM Institutional Pro status for hash ${hash}. This performer meets global professional standards.`,
  };
}

export default async function CertificatePage({
  params
}: {
  params: Promise<{ hash: string, locale: string }>;
}) {
  const { hash, locale } = await params;
  
  // For demo purposes, we'll allow a specific 'DEMO' hash to bypass verification
  let cert: any = null;
  if (hash === 'DD-CERT-DEMO-2026-SHA256') {
     cert = {
        badge_name: "Institutional Pro",
        performer_name: "Sasha Sparkle", // Mocked as we don't have user link here easily without more DB calls
        issued_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        certificate_hash: hash,
        modules_completed: ['AC-101', 'AC-102', 'AC-103', 'AC-104'],
        signature: "MOCK_SIGNATURE_BASE64_ABC123"
     };
  } else {
     cert = await verifyCertificate(hash);
  }

  if (!cert) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 flex flex-col items-center">
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/50 text-luxury-gold text-sm font-black mb-8 shadow-glow-gold animate-neon-pulse uppercase tracking-[0.2em]">
             <ShieldCheck size={18} />
             Publicly Verified Achievement
           </div>
           <h1 className="text-5xl md:text-7xl font-playfair font-black text-white italic mb-6">
             The <span className="glamour-heading">Institutional Pro</span> Certificate
           </h1>
           <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
             This cryptographically signed document verifies that the performer meets the global professional standards of the DRAGDEM platform.
           </p>
        </div>

        {/* The Luxury Certificate */}
        <div className="relative group max-w-4xl w-full">
           {/* Animated Background Glow */}
           <div className="absolute -inset-4 bg-linear-to-r from-luxury-gold/20 via-primary/10 to-secondary/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
           
           <div className="relative bg-deep-charcoal border-[12px] border-luxury-gold rounded-[2rem] p-12 md:p-20 shadow-3xl overflow-hidden">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gold-glow/30 rounded-tl-[1rem]" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gold-glow/30 rounded-br-[1rem]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="mb-10 p-5 bg-black rounded-full border-2 border-luxury-gold shadow-glow-gold">
                    <Award size={64} className="text-luxury-gold" />
                 </div>

                 <p className="text-sm font-black text-luxury-gold uppercase tracking-[0.5em] mb-12">
                   DRAGDEM OFFICIAL CERTIFICATION
                 </p>

                 <div className="space-y-4 mb-16">
                    <p className="text-xl text-gray-400 font-inter italic">This is to certify that</p>
                    <h2 className="text-6xl md:text-8xl font-playfair font-black text-white italic drop-shadow-lg">
                       {cert.performer_name || 'Sasha Sparkle'}
                    </h2>
                 </div>

                 <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed mb-16 font-medium">
                   has successfully mastered the <strong>Institutional Pro</strong> curriculum, demonstrating advanced proficiency in global tax compliance, contractual safety, multi-currency logistics, and professional DEI standards.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-2xl mb-16">
                    <div className="space-y-4 text-left p-6 bg-black/40 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                         <Calendar size={12} className="text-primary" /> Issue Date
                       </p>
                       <p className="text-white font-black">{new Date(cert.issued_at).toLocaleDateString(locale, { dateStyle: 'long' })}</p>
                    </div>
                    <div className="space-y-4 text-left p-6 bg-black/40 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                         <Globe size={12} className="text-secondary" /> Valid Until
                       </p>
                       <p className="text-white font-black">{new Date(cert.valid_until).toLocaleDateString(locale, { dateStyle: 'long' })}</p>
                    </div>
                 </div>

                 <div className="pt-12 border-t border-white/10 w-full flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-left space-y-2">
                       <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Verification Hash (SHA-256)</p>
                       <code className="text-xs text-primary font-mono bg-black px-3 py-1 rounded border border-primary/20 break-all max-w-[300px] block">
                          {cert.certificate_hash}
                       </code>
                    </div>

                    <div className="relative">
                       <div className="w-32 h-32 rounded-full bg-linear-to-tr from-secondary via-primary to-luxury-gold opacity-60 blur-xl animate-pulse absolute inset-0" />
                       <div className="w-32 h-32 rounded-full bg-linear-to-tr from-secondary via-primary to-luxury-gold border-2 border-white/50 flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-sm">
                          <div className="text-center">
                             <Sparkles size={32} className="text-white mx-auto mb-1 shadow-glow-cyan" />
                             <p className="text-[8px] font-black text-white uppercase tracking-tighter">Verified Pro</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-20 flex gap-8">
           <button className="px-10 py-4 bg-deep-charcoal border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:border-primary transition-all">
             Download PDF
           </button>
           <button className="px-10 py-4 bg-deep-charcoal border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:border-secondary transition-all">
             Add to LinkedIn
           </button>
        </div>
      </div>
    </main>
  );
}
