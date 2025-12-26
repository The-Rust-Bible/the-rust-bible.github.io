import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface BookPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getBookContent(testament: string, bookSlug: string) {
  const testamentName = testament === 'old-testament' ? 'Old Testament' : 'New Testament';
  const testamentPath = path.join(process.cwd(), 'public', 'Books', testamentName);

  if (!fs.existsSync(testamentPath)) {
    return null;
  }

  const files = fs.readdirSync(testamentPath);
  const matchingFile = files.find(file => {
    const fileWithoutExt = file.replace('.md', '');
    const urlSafeVersion = fileWithoutExt.replace(/\s+/g, '-');
    return urlSafeVersion === bookSlug;
  });

  if (!matchingFile) {
    return null;
  }

  const filePath = path.join(testamentPath, matchingFile);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    content,
    frontmatter: data,
    testament: testamentName,
    bookName: matchingFile.replace('.md', ''),
  };
}

function getAllBooks() {
  const booksDir = path.join(process.cwd(), 'public', 'Books');
  const books: { testament: string; slug: string }[] = [];

  try {
    const testaments = ['Old Testament', 'New Testament'];

    for (const testament of testaments) {
      const testamentPath = path.join(booksDir, testament);

      if (fs.existsSync(testamentPath)) {
        const files = fs.readdirSync(testamentPath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const fileWithoutExt = file.replace('.md', '');
            const urlSafeSlug = fileWithoutExt.replace(/\s+/g, '-');
            books.push({
              testament,
              slug: urlSafeSlug,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading books:', error);
  }

  return books;
}

export async function generateStaticParams() {
  const books = getAllBooks();

  return books.map((book) => ({
    slug: [
      book.testament.toLowerCase().replace(' ', '-'),
      book.slug,
    ],
  }));
}

export default async function BookPage({ params }: BookPageProps) {
  const resolvedParams = await params;
  const [testament, ...bookParts] = resolvedParams.slug;
  const bookSlug = bookParts.join('/');

  const book = await getBookContent(testament, bookSlug);

  if (!book) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Book not found</h1>
          <Link href="/" className="text-amber-600 hover:text-amber-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            ← Back to Books
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-amber-100 px-8 py-4 border-b-2 border-amber-300">
            <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-1">
              {book.testament}
            </div>
            <h1 className="text-3xl font-bold text-amber-900">
              {book.bookName}
            </h1>
          </div>

          <article className="prose prose-lg prose-amber max-w-none p-8 md:p-12">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-amber-900 mb-6 mt-8 first:mt-0 border-b-2 border-amber-200 pb-3">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-amber-800 mb-4 mt-8 flex items-center gap-3">
                    <span className="text-amber-400">§</span>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-amber-700 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-amber-950 text-lg">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-400 pl-6 py-2 my-6 italic text-amber-800 bg-amber-50">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 ml-6">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-lg text-amber-950 leading-relaxed">
                    {children}
                  </li>
                ),
              }}
            >
              {book.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
