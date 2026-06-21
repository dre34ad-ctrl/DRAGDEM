"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Sparkles, LayoutDashboard, Database, User, Settings, Search, Menu, X } from "lucide-react";
import { SupabaseLanguageSwitcher } from "./i18n/SupabaseLanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

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

      {/* Desktop Navigation */}
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

      {/* Mobile Hamburger */}
      <div className="lg:hidden flex items-center gap-6 relative z-10">
        <SupabaseLanguageSwitcher />
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-luxury-gold hover:bg-black/20 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)}>
        <div className={`fixed top-0 right-0 h-full w-72 bg-deep-charcoal border-l border-luxury-gold/20 shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-6 border-b border-luxury-gold/20">
            <span className="font-playfair font-black text-xl text-luxury-gold italic">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="text-luxury-gold p-1 hover:bg-black/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-2">
            <MobileNavLink href="/search" icon={<Search size={20} />} label={t('search')} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label={t('dashboard')} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/vault" icon={<Database size={20} />} label={t('vault')} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/masterclass" icon={<Sparkles size={20} />} label="Academy" onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/profile/sasha-sparkle" icon={<User size={20} />} label={t('profile')} onClick={() => setMobileOpen(false)} />
            <MobileNavLink href="/settings/rates" icon={<Settings size={20} />} label={t('settings')} onClick={() => setMobileOpen(false)} />
          </nav>
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="border-t border-luxury-gold/20 pt-6">
              <SupabaseLanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-4 px-4 py-4 text-white/80 hover:text-white font-montserrat text-sm font-bold uppercase tracking-widest hover:bg-primary/10 rounded-xl transition-all duration-300 group">
      <span className="text-primary group-hover:shadow-glow-magenta transition-shadow">{icon}</span>
      <span>{label}</span>
    </Link>
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
