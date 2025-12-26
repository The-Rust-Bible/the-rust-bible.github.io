import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { BookOpen, GraduationCap } from 'lucide-react';
import Banner from '../components/Banner';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface Lesson {
  name: string;
  slug: string;
  sections: string[];
}

function getLessons(): Lesson[] {
  const lessonsDir = path.join(process.cwd(), 'public', 'Lessons');
  const lessons: Lesson[] = [];

  try {
    if (fs.existsSync(lessonsDir)) {
      const lessonFolders = fs.readdirSync(lessonsDir);

      for (const folder of lessonFolders) {
        const lessonPath = path.join(lessonsDir, folder);

        if (fs.statSync(lessonPath).isDirectory()) {
          const sections = fs.readdirSync(lessonPath)
            .filter(file => file.endsWith('.md'))
            .map(file => file.replace('.md', ''));

          if (sections.length > 0) {
            lessons.push({
              name: folder,
              slug: folder.replace(/\s+/g, '-').toLowerCase(),
              sections,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading lessons:', error);
  }

  return lessons;
}

export default function SundaySchool() {
  const lessons = getLessons();

  return (
    <main className="min-h-screen">
      <Banner />
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <nav className="mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </nav>

        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-amber-700 mx-auto animate-bounce" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-amber-900">
            Sunday School
          </h1>
          <p className="text-lg md:text-xl text-amber-700 italic max-w-2xl mx-auto">
            Learn the ways of the Rustacean faith
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-4 border-b-2 border-amber-300">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
              Lessons
            </h2>
            <p className="text-sm text-amber-600 mt-1">Study the sacred teachings</p>
          </div>
          <ul className="p-6 space-y-3">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/sunday-school/${lesson.slug}`}
                    className="group block hover:bg-amber-50 p-4 -m-2 rounded transition-all duration-200"
                  >
                    <span className="text-amber-950 group-hover:text-amber-700 text-lg font-medium block mb-1">
                      {lesson.name}
                    </span>
                    <span className="text-sm text-amber-600">
                      {lesson.sections.length} section{lesson.sections.length !== 1 ? 's' : ''}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-amber-600 italic text-center py-8">No lessons yet</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
