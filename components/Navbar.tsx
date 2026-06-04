"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Sparkles, LayoutDashboard, Database, User, Settings, Search, Menu } from "lucide-react";
import { SupabaseLanguageSwitcher } from "./i18n/SupabaseLanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('nav');
  return (
    <header className="bg-crimson-velvet border-b-2 border-luxury-gold px-4 md:px-12 py-5 flex justify-between items-center sticky top-0 z-[100] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      <Link href="/" className="flex items-center gap-3 group relative z-10">
        <div className="p-2 bg-black/20 rounded-lg group-hover:scale-110 transition-transform">
          <Sparkles className="text-luxury-gold shadow-glow-gold" size={24} />
        </div>
        <span className="font-playfair font-black text-3xl tracking-tighter text-luxury-gold italic drop-shadow-md">
          DRAGDEM
        </span>
      </Link>

      <nav className="hidden lg:flex gap-10 items-center relative z-10">
        <NavLink href="/search" icon={<Search size={18} />} label={t('search')} accent="cyan" />
        <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label={t('dashboard')} accent="cyan" />
        <NavLink href="/vault" icon={<Database size={18} />} label={t('vault')} accent="cyan" />
        <NavLink href="/masterclass" icon={<Sparkles size={18} />} label="Academy" accent="magenta" />
        <NavLink href="/profile/sasha-sparkle" icon={<User size={18} />} label={t('profile')} accent="cyan" />
        <NavLink href="/settings/rates" icon={<Settings size={18} />} label={t('settings')} accent="cyan" />
        
        <div className="ml-6 border-l border-luxury-gold/40 pl-8">
          <SupabaseLanguageSwitcher />
        </div>
      </nav>

      <div className="lg:hidden flex items-center gap-6 relative z-10">
        <SupabaseLanguageSwitcher />
        <button className="p-2 text-luxury-gold hover:bg-black/20 rounded-lg transition-colors">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}

function NavLink({ href, icon, label, accent }: { href: string, icon: React.ReactNode, label: string, accent: 'cyan' | 'magenta' }) {
  const accentColor = accent === 'cyan' ? 'text-secondary' : 'text-primary';
  const underlineColor = accent === 'cyan' ? 'bg-secondary' : 'bg-primary';
  const blurColor = accent === 'cyan' ? 'shadow-glow-cyan' : 'shadow-glow-magenta';

  return (
    <Link href={href} className="flex items-center gap-2.5 text-white/90 font-montserrat text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all relative group">
      <span className={`group-hover:${accentColor} transition-colors`}>{icon}</span>
      <span>{label}</span>
      <span className={`absolute -bottom-2 left-0 w-0 h-1 ${underlineColor} ${blurColor} group-hover:w-full transition-all duration-500 rounded-full`}></span>
    </Link>
  );
}
