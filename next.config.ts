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
  
  // Optimize webpack build for better compression and tree-shaking
  webpack: (config, { isServer }) => {
    // Enable minification
    config.optimization = {
      ...config.optimization,
      minimize: true,
      sideEffects: false,
      usedExports: true,
    };
    
    return config;
  },

  // Package import optimization
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
