import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import LessonViewer from './LessonViewer';
import Banner from '@/app/components/Banner';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface LessonPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getLessonContent(lessonSlug: string, sectionSlug?: string) {
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');

  if (!fs.existsSync(lessonsDir)) {
    return null;
  }

  const lessonFolders = fs.readdirSync(lessonsDir);
  const matchingFolder = lessonFolders.find(folder => {
    const folderSlug = folder.replace(/\s+/g, '-').toLowerCase();
    return folderSlug === lessonSlug;
  });

  if (!matchingFolder) {
    return null;
  }

  const lessonPath = path.join(lessonsDir, matchingFolder);
  const sections = fs.readdirSync(lessonPath).filter(file => file.endsWith('.md'));

  // If no specific section requested, return the list
  if (!sectionSlug) {
    return {
      lessonName: matchingFolder,
      sections: sections.map(s => s.replace('.md', '')),
      content: null,
      sectionName: null,
    };
  }

  // Find the matching section
  const matchingSection = sections.find(section => {
    const sectionSlugVersion = section.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
    return sectionSlugVersion === sectionSlug;
  });

  if (!matchingSection) {
    return null;
  }

  const sectionPath = path.join(lessonPath, matchingSection);
  const fileContents = fs.readFileSync(sectionPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    lessonName: matchingFolder,
    sectionName: matchingSection.replace('.md', ''),
    content,
    frontmatter: data,
    sections: sections.map(s => s.replace('.md', '')),
  };
}

export async function generateStaticParams() {
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');
  const params: { slug: string[] }[] = [];

  try {
    if (!fs.existsSync(lessonsDir)) {
      return [];
    }

    const lessonFolders = fs.readdirSync(lessonsDir);

    for (const folder of lessonFolders) {
      const lessonPath = path.join(lessonsDir, folder);

      if (fs.statSync(lessonPath).isDirectory()) {
        const sections = fs.readdirSync(lessonPath).filter(file => file.endsWith('.md'));
        const lessonSlug = folder.replace(/\s+/g, '-').toLowerCase();

        // Add path for lesson overview page
        params.push({ slug: [lessonSlug] });

        // Add paths for each section
        for (const section of sections) {
          const sectionSlug = section.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
          params.push({ slug: [lessonSlug, sectionSlug] });
        }
      }
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }

  return params;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const [lessonSlug, sectionSlug] = resolvedParams.slug;

  const lesson = await getLessonContent(lessonSlug, sectionSlug);

  if (!lesson) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Lesson not found</h1>
          <Link href="/sunday-school" className="text-amber-600 hover:text-amber-800">
            Return to Sunday School
          </Link>
        </div>
      </div>
    );
  }

  // If no section specified, show section list
  if (!lesson.content) {
    return (
      <div className="min-h-screen">
        <Banner />
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <nav className="mb-6 md:mb-8">
            <Link
              href="/sunday-school"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors font-medium"
            >
              <span>←</span>
              <span>Back to Sunday School</span>
            </Link>
          </nav>

          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-100 px-6 md:px-8 py-4 border-b-2 border-amber-300">
              <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
                {lesson.lessonName}
              </h1>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Sections</h2>
              <ul className="space-y-3">
                {lesson.sections.map((section) => {
                  const sectionSlug = section.replace(/\s+/g, '-').toLowerCase();
                  return (
                    <li key={section}>
                      <Link
                        href={`/sunday-school/${lessonSlug}/${sectionSlug}`}
                        className="block hover:bg-amber-50 p-3 rounded transition-all duration-200 text-amber-950 hover:text-amber-700"
                      >
                        {section}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Banner />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <nav className="mb-6 md:mb-8">
          <Link
            href="/sunday-school"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Sunday School</span>
          </Link>
        </nav>

        <LessonViewer
          content={lesson.content}
          lessonName={lesson.lessonName}
          sectionName={lesson.sectionName || ''}
          sections={lesson.sections}
          currentSlug={lessonSlug}
        />
      </div>
    </div>
  );
}
