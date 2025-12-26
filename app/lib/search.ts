import fs from 'fs';
import path from 'path';

export interface SearchEntry {
  id: string;
  title: string;
  type: 'book' | 'chapter' | 'lesson' | 'section';
  url: string;
  content: string;
  testament?: string;
  lesson?: string;
}

/**
 * Build search index at build time
 * This generates a JSON file with all searchable content
 */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const booksDir = path.join(process.cwd(), 'public', 'Books');
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');

  // Index books
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
      const testamentSlug = testament.toLowerCase().replace(' ', '-');

      // Add book entry
      entries.push({
        id: `book-${testamentSlug}-${bookSlug}`,
        title: bookName,
        type: 'book',
        url: `/book/${testamentSlug}/${bookSlug}/`,
        content: bookName,
        testament,
      });

      // Add chapter entries
      const lines = content.split('\n');
      for (const line of lines) {
        const h2Match = line.match(/^## (.+)$/);
        if (h2Match) {
          const chapterName = h2Match[1];
          const chapterSlug = chapterName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          entries.push({
            id: `chapter-${testamentSlug}-${bookSlug}-${chapterSlug}`,
            title: `${bookName} - ${chapterName}`,
            type: 'chapter',
            url: `/book/${testamentSlug}/${bookSlug}/#${chapterSlug}`,
            content: chapterName,
            testament,
          });
        }
      }
    }
  }

  // Index lessons
  if (fs.existsSync(lessonsDir)) {
    const lessonFolders = fs.readdirSync(lessonsDir);

    for (const folder of lessonFolders) {
      const lessonPath = path.join(lessonsDir, folder);

      if (!fs.statSync(lessonPath).isDirectory()) continue;

      const lessonSlug = folder.replace(/\s+/g, '-').toLowerCase();

      // Add lesson entry
      entries.push({
        id: `lesson-${lessonSlug}`,
        title: folder,
        type: 'lesson',
        url: `/sunday-school/${lessonSlug}/`,
        content: folder,
      });

      // Add section entries
      const files = fs.readdirSync(lessonPath);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const sectionName = file.replace('.md', '');
        const sectionSlug = sectionName.replace(/\s+/g, '-').toLowerCase();

        entries.push({
          id: `section-${lessonSlug}-${sectionSlug}`,
          title: `${folder} - ${sectionName}`,
          type: 'section',
          url: `/sunday-school/${lessonSlug}/${sectionSlug}/`,
          content: sectionName,
          lesson: folder,
        });
      }
    }
  }

  return entries;
}

/**
 * Generate and write search index to public folder
 * Call this from a build script or next.config
 */
export function generateSearchIndexFile() {
  const index = buildSearchIndex();
  const indexPath = path.join(process.cwd(), 'public', 'search-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`Generated search index with ${index.length} entries`);
}
