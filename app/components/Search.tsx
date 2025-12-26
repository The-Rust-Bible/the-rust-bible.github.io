'use client';

import { useEffect, useState, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import Link from 'next/link';

interface SearchEntry {
  id: string;
  title: string;
  type: 'book' | 'chapter' | 'lesson' | 'section';
  url: string;
  content: string;
  testament?: string;
  lesson?: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index on mount
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        setIndex(data);
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIndex();
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = index
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm) ||
          entry.content.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10); // Limit to 10 results

    setResults(filtered);
  }, [query, index]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  if (isLoading) return null;

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors text-sm"
        title="Search (Cmd+K)"
      >
        <SearchIcon className="w-4 h-4" />
        <span>Search</span>
        <kbd className="text-xs font-semibold text-amber-700">⌘K</kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="md:hidden p-2 hover:bg-amber-100 rounded transition-colors"
        title="Search"
      >
        <SearchIcon className="w-5 h-5 text-amber-900" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 md:pt-32">
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-200">
              <SearchIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search books, chapters, lessons..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-amber-950 placeholder-amber-500"
                autoComplete="off"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-amber-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-amber-600" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="divide-y divide-amber-100">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        href={result.url}
                        onClick={handleResultClick}
                        className="block px-4 py-3 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-amber-900">
                              {result.title}
                            </div>
                            <div className="text-xs text-amber-600 mt-1">
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                              {result.testament && ` • ${result.testament}`}
                              {result.lesson && ` • ${result.lesson}`}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="px-4 py-8 text-center text-amber-600">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-amber-600">
                  Start typing to search...
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-amber-200 flex items-center justify-between text-xs text-amber-600">
              <div className="flex gap-3">
                <span>
                  <kbd className="px-2 py-1 bg-amber-100 rounded">↑↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="px-2 py-1 bg-amber-100 rounded">↵</kbd> Select
                </span>
                <span>
                  <kbd className="px-2 py-1 bg-amber-100 rounded">esc</kbd> Close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close modal when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
