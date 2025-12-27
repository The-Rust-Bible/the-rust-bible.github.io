import fs from 'fs';
import path from 'path';

export interface Verse {
  text: string;
  book: string;
  bookSlug: string;
  testament: string;
  chapter: string;
  chapterNumber: number;
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
      // Remove the prefix like "1.0 ", "1.1 ", "10.1 " from filename
      const bookName = file.replace(/^\d+\.\d+\s+/, '').replace('.md', '');
      const bookSlug = file.replace('.md', '').toLowerCase().replace(/\s+/g, '-');

      // Extract chapters and verses
      const lines = content.split('\n');
      let currentChapter = '';
      let currentChapterNumber = 0;
      let currentChapterSlug = '';

      for (const line of lines) {
         // Track current chapter (h1 format: "# Chapter X - Title")
         const h1Match = line.match(/^#\s+(.+)$/i);
         if (h1Match) {
           const fullChapterText = h1Match[1];
           const numberMatch = fullChapterText.match(/Chapter\s+(\d+)/i);
           if (numberMatch) {
             currentChapterNumber = parseInt(numberMatch[1], 10);
             currentChapter = fullChapterText;
             currentChapterSlug = fullChapterText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           }
         }

        // Extract paragraph text as verses
        const trimmed = line.trim();
        if (
          trimmed &&
          !trimmed.startsWith('#') &&
          !trimmed.startsWith('- ') &&
          !trimmed.startsWith('> ')
        ) {
          // Extract verse number from the beginning of the line (e.g., "1 " from "1 In the beginning...")
          const verseMatch = trimmed.match(/^(\d+)\s+(.+)$/);
          if (verseMatch) {
            const verseNumber = parseInt(verseMatch[1], 10);
            const verseText = verseMatch[2];
            verses.push({
              text: verseText,
              book: bookName,
              bookSlug,
              testament,
              chapter: currentChapter,
              chapterNumber: currentChapterNumber,
              chapterSlug: currentChapterSlug,
              verseNumber,
            });
          }
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
