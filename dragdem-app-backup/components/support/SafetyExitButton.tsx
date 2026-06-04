'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SafetyExitButtonProps {
  onTrigger: (evidence: any) => void;
}

export const SafetyExitButton: React.FC<SafetyExitButtonProps> = ({ onTrigger }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    setIsPressing(true);
    setProgress(0);
    const startTime = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / 3000) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timerRef.current!);
        handleTrigger();
      }
    }, 50);
  };

  const stopPress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPressing(false);
    setProgress(0);
  };

  const handleTrigger = () => {
    // 1. Capture GPS
    // 2. Capture snapshots
    // 3. Notify system
    alert('SAFETY EXIT TRIGGERED. System Lockdown initiated.');
    onTrigger({
      timestamp: new Date().toISOString(),
      gps: 'Captured',
      status: 'LOCKDOWN'
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="rgba(255, 0, 0, 0.2)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#ff0000"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={502.4}
            strokeDashoffset={502.4 - (502.4 * progress) / 100}
            className="transition-all duration-75 ease-linear"
          />
        </svg>
        
        <button
          onMouseDown={startPress}
          onMouseUp={stopPress}
          onMouseLeave={stopPress}
          onTouchStart={startPress}
          onTouchEnd={stopPress}
          className={`relative z-10 w-40 h-48 rounded-full bg-red-600 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] active:scale-95 transition-transform ${
            isPressing ? 'bg-red-500' : ''
          }`}
        >
          <span className="text-4xl mb-2">⚠️</span>
          <span className="text-white font-black uppercase text-center leading-tight">
            Safety Exit<br/>(Hold 3s)
          </span>
        </button>
      </div>
      
      {isPressing && (
        <p className="text-red-500 font-bold animate-pulse">
          INITIATING LOCKDOWN... {Math.round(progress)}%
        </p>
      )}
    </div>
  );
};
