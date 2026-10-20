'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('aim_theme') as 'dark' | 'light' | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      applyTheme(stored);
    } else {
      // Default to dark mode (Tactical Stealth)
      applyTheme('dark');
    }

    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      }
    };

    window.addEventListener('aim_theme_change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('aim_theme_change' as any, handleThemeChange);
    };
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    try {
      localStorage.setItem('aim_theme', nextTheme);
      window.dispatchEvent(new CustomEvent('aim_theme_change', { detail: { theme: nextTheme } }));
    } catch {}
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle Regimental Theme"
        className={`p-2 rounded-xl border border-[#273623] bg-[#121811] text-amber-400 opacity-60 ${className}`}
      >
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  const isLight = theme === 'light';

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isLight ? 'Switch to Night Ops (Dark Theme)' : 'Switch to Day Ops (Light Theme)'}
        aria-label={isLight ? 'Switch to Night Ops (Dark Theme)' : 'Switch to Day Ops (Light Theme)'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shadow-sm ${
          isLight
            ? 'bg-amber-500/10 border-amber-600/40 text-amber-700 hover:bg-amber-500/20'
            : 'bg-[#121811] border-[#273623] text-amber-400 hover:border-amber-500/60'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isLight ? (
            <Sun className="w-4 h-4 text-amber-600 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-200" />
          )}
        </div>
        <span>{isLight ? 'Day Ops (Light)' : 'Night Ops (Dark)'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isLight ? 'Switch to Night Ops (Dark Theme)' : 'Switch to Day Ops (Light Theme)'}
      aria-label={isLight ? 'Switch to Night Ops (Dark Theme)' : 'Switch to Day Ops (Light Theme)'}
      className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center group ${
        isLight
          ? 'bg-white border-amber-500/40 text-amber-600 hover:border-amber-500 shadow-sm'
          : 'bg-[#121811] border-[#273623] text-amber-400 hover:border-amber-500/50 hover:bg-[#161F15]'
      } ${className}`}
    >
      <div className="transition-transform duration-300 group-hover:rotate-45">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-600" />
        ) : (
          <Moon className="w-4 h-4 text-amber-400" />
        )}
      </div>
    </button>
  );
};
