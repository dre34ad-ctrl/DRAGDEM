'use client';

import { useState, useEffect } from 'react';
import { SupabaseWelcomeModal } from './SupabaseWelcomeModal';

export const WelcomeTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simple check: if the cookie isn't set, show the welcome modal
    const hasLocaleCookie = document.cookie.split(';').some((item) => item.trim().startsWith('NEXT_LOCALE='));
    if (!hasLocaleCookie) {
      setIsOpen(true);
    }
  }, []);

  return <SupabaseWelcomeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};
