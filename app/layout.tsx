import type { Metadata } from "next";
import "./globals.css";
import ReadingProgress from "./components/ReadingProgress";
import ScrollToTop from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: "The Rust Bible",
  description: "A sacred text for Rustaceans",
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
      <body className="antialiased bg-amber-50 text-amber-950">
        <ReadingProgress />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
