import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compress: true,
  // Force all pages to be static
  trailingSlash: true,
};

export default nextConfig;
