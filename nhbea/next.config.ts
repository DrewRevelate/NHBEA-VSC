import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    // Add image domains for external images
    domains: ['firebasestorage.googleapis.com', 'storage.googleapis.com'],
  },
  // Ensure trailing slashes for Firebase hosting
  trailingSlash: true,
  // Temporarily disable TypeScript checks for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations compatible with static export
  experimental: {
    // Enable modern JavaScript for better performance
    esmExternals: true,
  },
  // Compression and optimization
  compress: true,
  // PoweredByHeader removal for security
  poweredByHeader: false,
};

export default nextConfig;
