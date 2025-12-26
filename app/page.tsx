import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Banner from './components/Banner';

interface Book {
  testament: string;
  number: string;
  name: string;
  slug: string;
}

function getBooks(): Book[] {
  const booksDir = path.join(process.cwd(), 'public', 'Books');
  const books: Book[] = [];

  try {
    const testaments = ['Old Testament', 'New Testament'];

    for (const testament of testaments) {
      const testamentPath = path.join(booksDir, testament);

      if (fs.existsSync(testamentPath)) {
        const files = fs.readdirSync(testamentPath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const match = file.match(/^(\d+)\s+(.+)\.md$/);
            if (match) {
              const [, number, name] = match;
              const urlSafeName = file.replace('.md', '').replace(/\s+/g, '-');
              books.push({
                testament,
                number,
                name,
                slug: `${testament.toLowerCase().replace(' ', '-')}/${urlSafeName}`,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading books:', error);
  }

  return books;
}

export default function Home() {
  const books = getBooks();
  const oldTestament = books.filter(b => b.testament === 'Old Testament');
  const newTestament = books.filter(b => b.testament === 'New Testament');

  return (
    <main className="min-h-screen">
      <Banner />
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <div className="text-6xl md:text-7xl mb-2">📖</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-amber-900">
            The Rust Bible
          </h1>
          <p className="text-lg md:text-xl text-amber-700 italic max-w-2xl mx-auto">
            Sacred writings for the Rustacean faith
          </p>
          <div className="mt-4 text-sm text-amber-600">
            <span className="inline-block px-3 py-1 bg-amber-100 rounded-full">
              Memory Safe · Fearlessly Concurrent · Blazingly Fast
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <section className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-4 border-b-2 border-amber-300">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                Old Testament
              </h2>
              <p className="text-sm text-amber-600 mt-1">The ancient wisdom</p>
            </div>
            <ul className="p-6 space-y-3">
              {oldTestament.length > 0 ? (
                oldTestament.map((book) => (
                  <li key={book.slug}>
                    <Link
                      href={`/book/${book.slug}`}
                      className="group flex items-baseline gap-3 hover:bg-amber-50 p-2 -m-2 rounded transition-all duration-200"
                    >
                      <span className="text-amber-500 font-bold min-w-[2rem]">
                        {book.number}.
                      </span>
                      <span className="text-amber-950 group-hover:text-amber-700 text-lg font-medium">
                        {book.name}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-amber-600 italic text-center py-8">No books yet</li>
              )}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-4 border-b-2 border-amber-300">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                New Testament
              </h2>
              <p className="text-sm text-amber-600 mt-1">The modern revelations</p>
            </div>
            <ul className="p-6 space-y-3">
              {newTestament.length > 0 ? (
                newTestament.map((book) => (
                  <li key={book.slug}>
                    <Link
                      href={`/book/${book.slug}`}
                      className="group flex items-baseline gap-3 hover:bg-amber-50 p-2 -m-2 rounded transition-all duration-200"
                    >
                      <span className="text-amber-500 font-bold min-w-[2rem]">
                        {book.number}.
                      </span>
                      <span className="text-amber-950 group-hover:text-amber-700 text-lg font-medium">
                        {book.name}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-amber-600 italic text-center py-8">No books yet</li>
              )}
            </ul>
          </section>
        </div>

        <footer className="mt-12 text-center text-sm text-amber-600">
          <p className="italic">
            "Fearless concurrency through the borrow checker, world without data races, Amen."
          </p>
        </footer>
      </div>
    </main>
  );
}
