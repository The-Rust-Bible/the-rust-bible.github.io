import type { Metadata } from "next";
import "./globals.css";
import ReadingProgress from "./components/ReadingProgress";
import ScrollToTop from "./components/ScrollToTop";
import ReadingProgressTracker from "./components/ReadingProgressTracker";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "The Rust Bible",
  description: "A sacred text for Rustaceans - Learn Rust through our comprehensive guide",
  metadataBase: new URL("https://the-rust-bible.github.io"),
  openGraph: {
    title: "The Rust Bible",
    description: "A sacred text for Rustaceans - Learn Rust through our comprehensive guide",
    type: "website",
    url: "https://the-rust-bible.github.io",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#b45309" />
        <link rel="canonical" href="https://the-rust-bible.github.io" />
      </head>
      <body className="antialiased bg-amber-50 dark:bg-slate-950 text-amber-950 dark:text-amber-50 transition-colors">
        <Header />
        <ReadingProgress />
        {children}
        <ScrollToTop />
        <ReadingProgressTracker />
      </body>
    </html>
  );
}
