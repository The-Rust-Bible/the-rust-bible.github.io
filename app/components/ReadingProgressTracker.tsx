'use client';

import { useEffect } from 'react';

interface ReadingSession {
  url: string;
  timestamp: number;
  scrollProgress: number;
  timeSpent: number;
}

export default function ReadingProgressTracker() {
  useEffect(() => {
    const startTime = Date.now();
    let lastScrollUpdate = startTime;
    let scrollProgress = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollUpdate < 5000) return; // Only update every 5 seconds

      lastScrollUpdate = now;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      scrollProgress = (scrollTop / documentHeight) * 100;

      // Save to localStorage
      const session: ReadingSession = {
        url: window.location.href,
        timestamp: now,
        scrollProgress: Math.min(scrollProgress, 100),
        timeSpent: now - startTime,
      };

      try {
        const readings = JSON.parse(localStorage.getItem('reading-sessions') || '[]');
        const existingIndex = readings.findIndex(
          (r: ReadingSession) => r.url === session.url
        );

        if (existingIndex >= 0) {
          readings[existingIndex] = session;
        } else {
          readings.push(session);
        }

        // Keep only last 50 readings
        if (readings.length > 50) {
          readings.shift();
        }

        localStorage.setItem('reading-sessions', JSON.stringify(readings));
      } catch (error) {
        console.error('Failed to save reading progress:', error);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null; // This component doesn't render anything
}
