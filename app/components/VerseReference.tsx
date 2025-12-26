'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface VerseReferenceProps {
  bookName: string;
  chapter?: string;
  verse: number;
}

export default function VerseReference({ bookName, chapter, verse }: VerseReferenceProps) {
  const [copied, setCopied] = useState(false);

  const reference = chapter ? `${bookName} ${chapter}:${verse}` : `${bookName} ${verse}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-sm flex-shrink-0 select-none mt-0.5 hover:text-amber-600 transition-colors group"
      title={`Copy: ${reference}`}
      aria-label={`Copy verse reference: ${reference}`}
    >
      <span>{verse}</span>
      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      {copied && (
        <span className="absolute ml-8 text-xs text-green-600 font-semibold whitespace-nowrap">
          <Check className="w-3 h-3 inline mr-1" />
          Copied
        </span>
      )}
    </button>
  );
}
