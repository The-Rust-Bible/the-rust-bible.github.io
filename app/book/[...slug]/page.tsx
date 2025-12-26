import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import BookViewer from './BookViewer';
import Banner from '@/app/components/Banner';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getAllBooksWithNavigation } from '@/app/lib/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface BookPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  // Handle both \n and \r\n
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level });
    }
  }

  return headings;
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
    const urlSafeVersion = fileWithoutExt.replace(/\s+/g, '-').toLowerCase();
    return urlSafeVersion === bookSlug.toLowerCase();
  });

  if (!matchingFile) {
    return null;
  }

  const filePath = path.join(testamentPath, matchingFile);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const headings = extractHeadings(content);

  return {
    content,
    frontmatter: data,
    testament: testamentName,
    bookName: matchingFile.replace('.md', ''),
    headings,
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
        const files = fs.readdirSync(testamentPath)
          .filter(file => file.endsWith('.md'));

        for (const file of files) {
          const fileWithoutExt = file.replace('.md', '');
          const urlSafeSlug = fileWithoutExt.replace(/\s+/g, '-').toLowerCase();
          books.push({
            testament,
            slug: urlSafeSlug,
          });
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

  const books = getAllBooksWithNavigation();
  const breadcrumbItems = [
    { label: book.testament, href: '/' },
    { label: book.bookName, href: `/book/${testament}/${bookSlug}/` },
  ];

  // Find current book and calculate navigation
  const currentBook = books.find((b) => b.slug === bookSlug && b.testament === book.testament);
  let previousChapter = null;
  let nextChapter = null;
  
  if (currentBook && currentBook.chapters.length > 0) {
    // Use first chapter as default for navigation calculation
    const firstChapterSlug = currentBook.chapters[0].slug;
    previousChapter = currentBook.chapters[0];
    nextChapter = currentBook.chapters.length > 1 ? currentBook.chapters[1] : null;
  }

  return (
    <div className="min-h-screen">
      <Banner />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <BookViewer
          content={book.content}
          bookName={book.bookName}
          testament={book.testament}
          headings={book.headings}
          slug={bookSlug}
          previousChapter={previousChapter}
          nextChapter={nextChapter}
        />
      </div>
    </div>
  );
}
