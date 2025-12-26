import Link from 'next/link';
import { Book } from 'lucide-react';
import Search from './Search';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-sm border-b border-amber-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Book className="w-6 h-6 md:w-7 md:h-7 text-amber-700 dark:text-amber-500" strokeWidth={2} />
          <span className="hidden sm:inline font-bold text-amber-900 dark:text-amber-50">
            The Rust Bible
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Search />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
