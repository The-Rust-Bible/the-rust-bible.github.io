import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
  name: string;
  slug: string;
}

interface SectionNavigationProps {
  lessonSlug: string;
  previousSection: Section | null;
  nextSection: Section | null;
  currentSectionName: string;
}

export default function SectionNavigation({
  lessonSlug,
  previousSection,
  nextSection,
  currentSectionName,
}: SectionNavigationProps) {
  return (
    <nav className="flex items-center justify-between gap-4 py-6 border-t border-b border-amber-200">
      {previousSection ? (
        <Link
          href={`/sunday-school/${lessonSlug}/${previousSection.slug}/`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <div />
      )}

      <div className="text-center text-sm text-amber-700 font-medium">
        {currentSectionName}
      </div>

      {nextSection ? (
        <Link
          href={`/sunday-school/${lessonSlug}/${nextSection.slug}/`}
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
