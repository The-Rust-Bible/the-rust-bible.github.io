import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rust Bible",
  description: "A sacred text for Rustaceans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-amber-50 text-amber-950">
        {children}
      </body>
    </html>
  );
}
