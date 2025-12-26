import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Chapter {
  name: string;
  slug: string;
}

interface ChapterNavigationProps {
  bookSlug: string;
  testament: string;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  currentChapterName: string;
}

export default function ChapterNavigation({
  bookSlug,
  testament,
  previousChapter,
  nextChapter,
  currentChapterName,
}: ChapterNavigationProps) {
  return (
    <nav className="flex items-center justify-between gap-4 py-6 border-t border-b border-amber-200">
      {previousChapter ? (
        <Link
          href={`/book/${testament}/${bookSlug}/#${previousChapter.slug}`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <div />
      )}

      <div className="text-center text-sm text-amber-700 font-medium">
        {currentChapterName}
      </div>

      {nextChapter ? (
        <Link
          href={`/book/${testament}/${bookSlug}/#${nextChapter.slug}`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors text-sm font-medium"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
