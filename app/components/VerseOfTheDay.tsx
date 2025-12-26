import Link from 'next/link';
import { getRandomVerse } from '../lib/verses';
import { Sparkles } from 'lucide-react';

export default function VerseOfTheDay() {
  const verse = getRandomVerse();

  if (!verse) {
    return null;
  }

  const testamentSlug = verse.testament.toLowerCase().replace(' ', '-');
  const verseUrl = `/book/${testamentSlug}/${verse.bookSlug}#${verse.chapterSlug}`;

  return (
    <Link href={verseUrl}>
      <div className="bg-amber-50 rounded-lg shadow border border-amber-200 p-4 md:p-5 mb-8 hover:shadow-md hover:bg-amber-100 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 group-hover:animate-spin" strokeWidth={2.5} />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Verse of the Day
            </h3>
            <p className="text-sm text-amber-950 italic leading-relaxed line-clamp-2 group-hover:text-amber-900">
              "{verse.text}"
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">
              {verse.book} · {verse.chapter}:{verse.verseNumber}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
