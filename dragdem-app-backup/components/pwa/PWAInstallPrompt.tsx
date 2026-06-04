'use client';

import { useState, useEffect } from 'react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gray-900 border-2 border-pink-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.2)] z-40 flex items-center justify-between animate-bounce">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📱</span>
        <div>
          <p className="text-white font-bold text-sm">Install DRAGDEM App</p>
          <p className="text-gray-400 text-xs">Access your gigs faster on the go!</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setShowPrompt(false)}
          className="text-gray-500 text-xs px-2"
        >
          Later
        </button>
        <button 
          onClick={handleInstall}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
        >
          Install
        </button>
      </div>
    </div>
  );
};
