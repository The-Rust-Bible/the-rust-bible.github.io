import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface LessonViewerProps {
  content: string;
  lessonName: string;
  sectionName: string;
  sections: string[];
  currentSlug: string;
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level });
    }
  }

  return headings;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function LessonViewer({ content, lessonName, sectionName, sections, currentSlug }: LessonViewerProps) {
  const headings = extractHeadings(content);

  return (
    <div className="flex gap-8 relative">
      {/* Table of Contents */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-8 self-start h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md border-2 border-amber-200 p-4 mb-4">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-3 pb-2 border-b border-amber-200">
            Sections
          </h3>
          <nav className="space-y-1">
            {sections.map((section) => {
              const sectionSlug = section.replace(/\s+/g, '-').toLowerCase();
              const isActive = section === sectionName;
              return (
                <Link
                  key={section}
                  href={`/sunday-school/${currentSlug}/${sectionSlug}`}
                  className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {section}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md border-2 border-amber-200 p-4">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-3 pb-2 border-b border-amber-200">
            Contents
          </h3>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block py-1.5 px-2 text-sm rounded transition-colors ${
                  heading.level === 1
                    ? 'font-bold text-amber-900'
                    : heading.level === 2
                    ? 'pl-4 font-semibold text-amber-800'
                    : 'pl-6 text-amber-700'
                } hover:bg-amber-50`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-amber-100 px-6 md:px-8 py-4 border-b-2 border-amber-300">
            <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-1">
              {lessonName}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
              {sectionName}
            </h1>
          </div>

          <article className="prose prose-lg prose-amber max-w-none p-6 md:p-8 lg:p-12">
            <ReactMarkdown
              components={{
                h1: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h1
                      id={id}
                      className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 mt-8 first:mt-0 border-b-2 border-amber-200 pb-3 scroll-mt-8"
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h2
                      id={id}
                      className="text-xl md:text-2xl font-semibold text-amber-800 mb-4 mt-8 flex items-center gap-3 scroll-mt-8"
                    >
                      <span className="text-amber-400">§</span>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h3
                      id={id}
                      className="text-lg md:text-xl font-semibold text-amber-700 mb-3 mt-6 scroll-mt-8"
                    >
                      {children}
                    </h3>
                  );
                },
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-amber-950 text-base md:text-lg">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-400 pl-6 py-2 my-6 italic text-amber-800 bg-amber-50">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 list-disc list-inside">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-2 my-4 list-decimal list-inside">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-base md:text-lg text-amber-950 leading-relaxed">
                    {children}
                  </li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-amber-950 text-amber-50 p-4 rounded-lg overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
