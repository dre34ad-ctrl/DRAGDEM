"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Sparkles, LayoutDashboard, Database, User, Settings, Search } from "lucide-react";
import { SupabaseLanguageSwitcher } from "./i18n/SupabaseLanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('nav');
  return (
    <header className="bg-linear-to-r from-secondary to-primary p-4 md:px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="text-white" />
        <span className="font-montserrat font-bold text-xl tracking-widest text-white uppercase">
          DRAGDEM.com
        </span>
      </Link>
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/search" className="flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity">
          <Search size={18} />
          <span>{t('search')}</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity">
          <LayoutDashboard size={18} />
          <span>{t('dashboard')}</span>
        </Link>
        <Link href="/vault" className="flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity">
          <Database size={18} />
          <span>{t('vault')}</span>
        </Link>
        <Link href="/profile/sasha-sparkle" className="flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity">
          <User size={18} />
          <span>{t('profile')}</span>
        </Link>
        <Link href="/settings/rates" className="flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity">
          <Settings size={18} />
          <span>{t('settings')}</span>
        </Link>
        <div className="ml-4 border-l border-white/20 pl-4">
          <SupabaseLanguageSwitcher />
        </div>
      </nav>
      <div className="md:hidden">
        {/* Mobile menu could go here */}
        <span className="text-white">Menu</span>
      </div>
    </header>
  );
}
