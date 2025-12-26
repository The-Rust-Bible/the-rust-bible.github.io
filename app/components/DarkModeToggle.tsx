'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check localStorage and system preference
    const stored = localStorage.getItem('dark-mode');
    if (stored !== null) {
      setIsDark(stored === 'true');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  }, [isDark, isMounted]);

  if (!isMounted) {
    return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900 rounded transition-colors"
      title={isDark ? 'Light mode' : 'Dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-amber-900" />
      )}
    </button>
  );
}
