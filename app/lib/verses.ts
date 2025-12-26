import fs from 'fs';
import path from 'path';

export interface Verse {
  text: string;
  book: string;
  bookSlug: string;
  testament: string;
  chapter: string;
  chapterSlug: string;
  verseNumber: number;
}

export function getAllVerses(): Verse[] {
  const verses: Verse[] = [];
  const booksDir = path.join(process.cwd(), 'public', 'Books');
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
      const bookSlug = bookName.replace(/\s+/g, '-');

      // Extract chapters and verses
      const lines = content.split('\n');
      let currentChapter = '';
      let currentChapterSlug = '';
      let verseCounter = 0;

      for (const line of lines) {
        // Track current chapter
        const h2Match = line.match(/^## (.+)$/);
        if (h2Match) {
          currentChapter = h2Match[1];
          currentChapterSlug = currentChapter.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          verseCounter = 0;
        }

        // Extract paragraph text as verses
        const trimmed = line.trim();
        if (
          trimmed &&
          !trimmed.startsWith('#') &&
          !trimmed.startsWith('- ') &&
          !trimmed.startsWith('> ')
        ) {
          verseCounter++;
          verses.push({
            text: trimmed,
            book: bookName,
            bookSlug,
            testament,
            chapter: currentChapter,
            chapterSlug: currentChapterSlug,
            verseNumber: verseCounter,
          });
        }
      }
    }
  }

  return verses;
}

export function getRandomVerse(): Verse | null {
  const verses = getAllVerses();
  if (verses.length === 0) return null;
  return verses[Math.floor(Math.random() * verses.length)];
}
