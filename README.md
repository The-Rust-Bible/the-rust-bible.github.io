# The Rust Bible

A parody of the Christian Bible, written for Rustaceans. Built with Next.js and deployed to GitHub Pages.

## Project Structure

```
the-rust-bible.github.io/
├── public/
│   └── Books/
│       ├── Old Testament/
│       │   └── 1 Genesis.md
│       └── New Testament/
│           └── 1 Matthew.md
├── app/
│   ├── book/[...slug]/page.tsx  # Dynamic book pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
└── next.config.ts                # Next.js config with static export
```

## Adding New Books

To add a new book, create a markdown file in the appropriate testament folder:

**Format:** `<number> <book name>.md`

**Example:** `public/Books/Old Testament/2 Exodus.md`

The number at the beginning is used for ordering in the list.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The dev server will be available at http://localhost:3000

## Deployment

This site is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to Pages
3. Set Source to "GitHub Actions"

The `.github/workflows/deploy.yml` workflow will automatically build and deploy your site.

### Local Build

To test the static export locally:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Features

- Static site generation with Next.js
- Automatic listing of Old and New Testament books
- Markdown rendering with react-markdown
- Responsive design with Tailwind CSS
- Bible-themed styling with amber/brown tones