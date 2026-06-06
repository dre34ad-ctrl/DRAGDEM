'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { useTranslations, useLocale } from 'next-intl';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
];

export const SupabaseLanguageSwitcher = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(locale);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentLang(locale);
  }, [locale]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await (supabase.auth as any).getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const handleSwitch = async (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    
    if (userId) {
      await (supabase
        .from('users') as any)
        .update({ preferred_language: code })
        .eq('id', userId);
    }
    
    // Also set a cookie or trigger i18n framework update
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`;
    window.location.reload(); // Refresh to apply new locale
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700 hover:border-pink-500 transition"
      >
        <span>🌐</span>
        <span className="uppercase font-bold text-sm">{currentLang}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSwitch(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-pink-600/20 text-left transition"
            >
              <span>{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
