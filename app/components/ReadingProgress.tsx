'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      
      const totalScroll = (scrollTop / documentHeight) * 100;
      setProgress(Math.min(totalScroll, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 z-50 transition-all duration-300"
      style={{ width: `${progress}%` }}
      aria-label={`Page read: ${Math.round(progress)}%`}
    />
  );
}
