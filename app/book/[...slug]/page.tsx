import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import BookViewer from './BookViewer';

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Books</span>
          </Link>
        </nav>

        <BookViewer
          content={book.content}
          bookName={book.bookName}
          testament={book.testament}
        />
      </div>
    </div>
  );
}
