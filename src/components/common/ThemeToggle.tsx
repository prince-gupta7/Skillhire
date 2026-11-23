import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';

export const ThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel = false }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(APP_CONFIG.storageKeys.theme);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(APP_CONFIG.storageKeys.theme, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(APP_CONFIG.storageKeys.theme, 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs"
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          {showLabel && <span className="text-xs font-semibold">Day</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          {showLabel && <span className="text-xs font-semibold">Night</span>}
        </>
      )}
    </button>
  );
};
