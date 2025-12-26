import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="flex items-center gap-1 text-sm text-amber-600 mb-6"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="hover:text-amber-800 transition-colors font-medium"
      >
        Home
      </Link>

      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-amber-400" />
          {index === items.length - 1 ? (
            <span className="text-amber-950 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-amber-800 transition-colors font-medium"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
