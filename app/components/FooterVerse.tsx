'use client';

import { useEffect, useState } from 'react';

interface OpeningVerse {
  verses: string[];
}

export default function FooterVerse() {
  const [verse, setVerse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetVerse = async () => {
      try {
        const response = await fetch('/openingVerse.json');
        const data: OpeningVerse = await response.json();
        
        if (data.verses && data.verses.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.verses.length);
          setVerse(data.verses[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to load verse:', error);
        // Fallback to default verse
        setVerse('Fearless concurrency through the borrow checker, world without data races, Amen.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetVerse();
  }, []);

  if (isLoading) {
    return (
      <p className="italic text-amber-600">
        "Loading sacred wisdom..."
      </p>
    );
  }

  return (
    <p className="italic text-amber-600">
      "{verse}"
    </p>
  );
}
