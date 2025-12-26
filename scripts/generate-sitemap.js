const fs = require('fs');
const path = require('path');

function getAllBooks() {
  const booksDir = path.join(process.cwd(), 'public', 'Books');
  const books = [];

  try {
    const testaments = ['Old Testament', 'New Testament'];

    for (const testament of testaments) {
      const testamentPath = path.join(booksDir, testament);

      if (!fs.existsSync(testamentPath)) continue;

      const files = fs.readdirSync(testamentPath).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const name = file.replace('.md', '');
        const urlSafeSlug = name.replace(/\s+/g, '-').toLowerCase();
        books.push({
          testament,
          slug: `${testament.toLowerCase().replace(' ', '-')}/${urlSafeSlug}`,
        });
      }
    }
  } catch (error) {
    console.error('Error reading books:', error);
  }

  return books;
}

function getAllLessons() {
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');
  const lessons = [];

  try {
    if (!fs.existsSync(lessonsDir)) return lessons;

    const lessonFolders = fs.readdirSync(lessonsDir);

    for (const folder of lessonFolders) {
      const lessonPath = path.join(lessonsDir, folder);

      if (!fs.statSync(lessonPath).isDirectory()) continue;

      const sections = fs.readdirSync(lessonPath)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));

      const lessonSlug = folder.replace(/\s+/g, '-').toLowerCase();

      lessons.push({ slug: lessonSlug, sections });
    }
  } catch (error) {
    console.error('Error reading lessons:', error);
  }

  return lessons;
}

function generateSitemap() {
  const baseUrl = 'https://the-rust-bible.github.io';
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Home page
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Book pages
  const books = getAllBooks();
  for (const book of books) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/book/${book.slug}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Sunday School pages
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/sunday-school/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  const lessons = getAllLessons();
  for (const lesson of lessons) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/sunday-school/${lesson.slug}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;

    for (const section of lesson.sections) {
      const sectionSlug = section.replace(/\s+/g, '-').toLowerCase();
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/sunday-school/${lesson.slug}/${sectionSlug}/</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += '</urlset>\n';

  return xml;
}

function main() {
  try {
    const sitemap = generateSitemap();
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✓ Generated sitemap.xml`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
