import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Strict mode for React
   */
  reactStrictMode: true,

  /**
   * Image optimization settings
   * Configure remote patterns for Contentstack images
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
      },
      {
        protocol: 'https',
        hostname: 'eu-images.contentstack.com',
      },
    ],
  },

  /**
   * Trailing slash for cleaner URLs
   */
  trailingSlash: true,
};

export default nextConfig;

