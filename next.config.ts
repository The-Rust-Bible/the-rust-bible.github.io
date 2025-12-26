import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  reactStrictMode: true,
  // Force all pages to be static
  trailingSlash: true,
};

export default nextConfig;
