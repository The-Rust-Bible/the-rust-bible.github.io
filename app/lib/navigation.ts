import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface NavigationBook {
  name: string;
  slug: string;
  testament: string;
  chapters: NavigationChapter[];
}

export interface NavigationChapter {
  name: string;
  slug: string;
}

export interface NavigationLesson {
  name: string;
  slug: string;
  sections: NavigationSection[];
}

export interface NavigationSection {
  name: string;
  slug: string;
}

export function getAllBooksWithNavigation(): NavigationBook[] {
  const booksDir = path.join(process.cwd(), 'public', 'Books');
  const books: NavigationBook[] = [];

  try {
    const testaments = ['Old Testament', 'New Testament'];

    for (const testament of testaments) {
      const testamentPath = path.join(booksDir, testament);

      if (!fs.existsSync(testamentPath)) continue;

      const files = fs.readdirSync(testamentPath);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(testamentPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const bookName = file.replace('.md', '');
        const bookSlug = bookName.replace(/\s+/g, '-').toLowerCase();

        // Extract chapters
        const chapters: NavigationChapter[] = [];
        const lines = content.split('\n');

        for (const line of lines) {
          const h2Match = line.match(/^## (.+)$/);
          if (h2Match) {
            const chapterName = h2Match[1];
            const chapterSlug = chapterName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            chapters.push({
              name: chapterName,
              slug: chapterSlug,
            });
          }
        }

        books.push({
          name: bookName,
          slug: bookSlug,
          testament,
          chapters,
        });
      }
    }
  } catch (error) {
    console.error('Error reading books for navigation:', error);
  }

  return books;
}

export function getAllLessonsWithNavigation(): NavigationLesson[] {
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');
  const lessons: NavigationLesson[] = [];

  try {
    if (!fs.existsSync(lessonsDir)) return lessons;

    const lessonFolders = fs.readdirSync(lessonsDir);

    for (const folder of lessonFolders) {
      const lessonPath = path.join(lessonsDir, folder);

      if (!fs.statSync(lessonPath).isDirectory()) continue;

      const files = fs.readdirSync(lessonPath);
      const sections: NavigationSection[] = [];

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const sectionName = file.replace('.md', '');
        const sectionSlug = sectionName.replace(/\s+/g, '-').toLowerCase();
        sections.push({
          name: sectionName,
          slug: sectionSlug,
        });
      }

      if (sections.length > 0) {
        lessons.push({
          name: folder,
          slug: folder.replace(/\s+/g, '-').toLowerCase(),
          sections,
        });
      }
    }
  } catch (error) {
    console.error('Error reading lessons for navigation:', error);
  }

  return lessons;
}

export function getBookIndex(
  testament: string,
  bookSlug: string,
  books = getAllBooksWithNavigation()
): number {
  const testamentBooks = books.filter(
    (b) => b.testament.toLowerCase().replace(' ', '-') === testament
  );
  return testamentBooks.findIndex((b) => b.slug === bookSlug);
}

export function getPreviousBook(
  testament: string,
  bookSlug: string,
  books = getAllBooksWithNavigation()
): NavigationBook | null {
  const testamentBooks = books.filter(
    (b) => b.testament.toLowerCase().replace(' ', '-') === testament
  );
  const currentIndex = testamentBooks.findIndex((b) => b.slug === bookSlug);
  return currentIndex > 0 ? testamentBooks[currentIndex - 1] : null;
}

export function getNextBook(
  testament: string,
  bookSlug: string,
  books = getAllBooksWithNavigation()
): NavigationBook | null {
  const testamentBooks = books.filter(
    (b) => b.testament.toLowerCase().replace(' ', '-') === testament
  );
  const currentIndex = testamentBooks.findIndex((b) => b.slug === bookSlug);
  return currentIndex < testamentBooks.length - 1
    ? testamentBooks[currentIndex + 1]
    : null;
}

export function getPreviousChapter(
  book: NavigationBook,
  chapterSlug: string
): NavigationChapter | null {
  const currentIndex = book.chapters.findIndex((c) => c.slug === chapterSlug);
  return currentIndex > 0 ? book.chapters[currentIndex - 1] : null;
}

export function getNextChapter(
  book: NavigationBook,
  chapterSlug: string
): NavigationChapter | null {
  const currentIndex = book.chapters.findIndex((c) => c.slug === chapterSlug);
  return currentIndex < book.chapters.length - 1
    ? book.chapters[currentIndex + 1]
    : null;
}

export function getLessonIndex(
  lessonSlug: string,
  lessons = getAllLessonsWithNavigation()
): number {
  return lessons.findIndex((l) => l.slug === lessonSlug);
}

export function getPreviousLesson(
  lessonSlug: string,
  lessons = getAllLessonsWithNavigation()
): NavigationLesson | null {
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  return currentIndex > 0 ? lessons[currentIndex - 1] : null;
}

export function getNextLesson(
  lessonSlug: string,
  lessons = getAllLessonsWithNavigation()
): NavigationLesson | null {
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  return currentIndex < lessons.length - 1
    ? lessons[currentIndex + 1]
    : null;
}
