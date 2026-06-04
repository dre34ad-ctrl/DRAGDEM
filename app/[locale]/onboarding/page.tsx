import React from 'react';
import Navbar from '@/components/Navbar';
import RegionalOnboarding from '@/components/onboarding/RegionalOnboarding';
import { getTranslations } from 'next-intl/server';

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('onboarding');

  return (
    <main className="min-h-screen bg-deep text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 font-montserrat uppercase">
            {t('title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-inter">
            Localized verification journeys for the next generation of global drag excellence.
          </p>
        </header>

        <RegionalOnboarding />
      </div>

      <footer className="mt-32 py-12 border-t border-gray-900 text-center">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-gray-600">
          DRAGDEM.com &copy; 2026 | Global Expansion Design System
        </p>
      </footer>
    </main>
  );
}
