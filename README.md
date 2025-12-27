# The Rust Bible

A parody of the Christian Bible, written for Rustaceans. Built with Next.js and deployed to GitHub Pages.

## Overview

The Rust Bible is a static site that presents Rust concepts and wisdom in the format of a biblical text. The project features:

- **Old Testament & New Testament**: Organized chapters containing Rust teachings and parables
- **Sunday School Lessons**: Guided lessons organized by topic with multiple sections
- **Full-Text Search**: Searchable index of all books, chapters, and lessons
- **Verse of the Day**: Random featured verse displayed on the homepage
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Performance**: Fully static site generation optimized for fast loading

## Project Structure

```
the-rust-bible.github.io/
├── app/                           # Next.js app directory
│   ├── book/[...slug]/           # Dynamic book and chapter pages
│   ├── sunday-school/            # Sunday School section
│   │   ├── page.tsx              # Lessons index
│   │   └── [...slug]/            # Dynamic lesson and section pages
│   ├── components/               # React components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Search.tsx            # Full-text search UI
│   │   ├── VerseOfTheDay.tsx     # Daily verse display
│   │   ├── ChapterNavigation.tsx # Navigation between chapters
│   │   ├── ReadingProgress.tsx   # Progress bar for reading
│   │   ├── DarkModeToggle.tsx    # Theme switcher
│   │   └── [other components]
│   ├── lib/                      # Utility functions
│   │   ├── search.ts             # Search indexing and filtering
│   │   ├── verses.ts             # Verse utilities
│   │   └── navigation.ts         # Navigation helpers
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── public/
│   ├── Books/
│   │   ├── Old Testament/        # Old Testament markdown files
│   │   └── New Testament/        # New Testament markdown files
│   ├── Lessons/
│   │   └── [lesson-name]/        # Sunday School lessons with sections
│   ├── search-index.json         # Generated search index
│   ├── sitemap.xml               # Generated sitemap
│   ├── robots.txt                # SEO robots file
│   └── openingVerse.json         # Verse of the Day data
├── scripts/
│   ├── generate-search-index.js  # Builds searchable index
│   └── generate-sitemap.js       # Generates XML sitemap
├── next.config.ts                # Next.js configuration for static export
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts

```

## Adding Content

### Adding a Book

Create a markdown file in the appropriate testament folder:

**Format:** `<number> <book name>.md`

**Location:**
- Old Testament: `public/Books/Old Testament/`
- New Testament: `public/Books/New Testament/`

**Example:** `public/Books/Old Testament/2 Exodus.md`

The number at the beginning is used for ordering the books in the list.

**Markdown Structure:**
```markdown
# 1 Genesis

Content about the book...

## Chapter 1: The Creation

Chapter content...

## Chapter 2: Adam and Eve

More chapter content...
```

### Adding Sunday School Lessons

Create a folder for the lesson, then add markdown sections inside:

**Structure:**
```
public/Lessons/Lesson Name/
├── 1 Introduction.md
├── 2 Main Content.md
└── 3 Conclusion.md
```

The number prefix determines the section order.

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running the Development Server

The dev server builds the site and serves static files:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This runs the prebuild scripts to generate search index and sitemap, then builds the static export. Output is in the `out/` directory.

### Available Scripts

```bash
npm run dev              # Start dev server with static generation
npm run build            # Build for production
npm run build:analyze    # Build with bundle size analysis
npm run start            # Serve the static build locally
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run clean            # Remove generated files and cache
npm run bundle-size      # Analyze bundle size
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to **Pages**
3. Set **Source** to **GitHub Actions**

The `.github/workflows/deploy.yml` workflow automatically builds and deploys your site on push.

### Manual Deployment

To test the static build locally before pushing:

```bash
npm run build
npm run start
```

## Key Features

### Static Site Generation
- Built with Next.js using static export (`output: "export"`)
- Zero JavaScript overhead where possible
- Fully compatible with GitHub Pages

### Search Functionality
- Full-text search across all books, chapters, and lessons
- Dynamically generated search index (`public/search-index.json`)
- Powered by client-side filtering

### Responsive Design
- Mobile-first approach
- Tailwind CSS with amber/brown biblical theme
- Accessible component structure

### Performance Optimizations
- Bundle size optimization with webpack config
- Tree-shaking and minification enabled
- Optimized Lucide React icon imports
- Trailing slashes for consistent URLs

### Content Management
- Markdown-based content (easy to edit and version control)
- Gray-matter for frontmatter support
- Automatic file discovery and ordering by prefix numbers
- React-markdown for rendering

## Technologies Used

### Core
- **Next.js 15.1**: React framework for static generation
- **React 19**: UI library
- **TypeScript**: Type-safe development

### Styling & UI
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Lucide React 0.559**: Icon library
- **PostCSS & Autoprefixer**: CSS processing

### Content & Utilities
- **React-markdown 9.0**: Markdown rendering
- **Gray-matter 4.0**: YAML frontmatter parsing

### Development Tools
- **ESLint 9.0**: Code linting
- **Prettier 3.4**: Code formatting
- **TypeScript 5.6**: Type checking

## Theme & Styling

The site uses a biblical theme with:
- **Colors**: Amber and brown tones (`amber-*` Tailwind classes)
- **Typography**: Bold, readable fonts
- **Icons**: Lucide React icons for visual interest
- **Animations**: Subtle hover effects and transitions
- **Responsive**: Adapts gracefully from mobile to desktop

## Contributing

Content contributions are welcome. Follow the structure above to add books or lessons, then create a pull request.

## License

MIT License - See LICENSE file for details

## Project Links

- **Repository**: [The Rust Bible on GitHub](https://github.com/The-Rust-Bible/the-rust-bible.github.io)
- **Website**: [the-rust-bible.github.io](https://the-rust-bible.github.io)
