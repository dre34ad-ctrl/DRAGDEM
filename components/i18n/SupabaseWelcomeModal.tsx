'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { useTranslations } from 'next-intl';

export const SupabaseWelcomeModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const t = useTranslations('welcome');
  const [selectedLang, setSelectedLang] = useState('en');

  if (!isOpen) return null;

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('users')
        .update({ preferred_language: selectedLang })
        .eq('id', user.id);
    }
    
    document.cookie = `NEXT_LOCALE=${selectedLang}; path=/; max-age=31536000`;
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-pink-500 rounded-3xl w-full max-w-md p-8 shadow-[0_0_50px_rgba(255,0,255,0.3)]">
        <h2 className="text-3xl font-bold text-white mb-2">{t('title')}</h2>
        <p className="text-gray-400 mb-8">{t('description')}</p>

        <div className="space-y-4 mb-10">
          {[
            { code: 'en', label: 'English', native: 'English' },
            { code: 'pt', label: 'Portuguese', native: 'Português' },
            { code: 'th', label: 'Thai', native: 'ไทย' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`w-full flex justify-between items-center px-6 py-4 rounded-xl border-2 transition ${
                selectedLang === lang.code 
                ? 'border-pink-500 bg-pink-500/10 text-white' 
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="font-bold">{lang.native}</span>
              <span className="text-xs opacity-50 uppercase">{lang.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-400 font-bold hover:bg-gray-800 transition"
          >
            Later
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 transition shadow-[0_0_20px_rgba(255,0,255,0.4)]"
          >
            {t('save_continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
