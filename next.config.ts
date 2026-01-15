import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Output static HTML for all pages at build time
   * This enables full SSG for SEO-friendly static site
   */
  output: 'export',

  /**
   * Strict mode for React
   */
  reactStrictMode: true,

  /**
   * Image optimization settings
   * Using unoptimized for static export
   */
  images: {
    unoptimized: true,
  },

  /**
   * Trailing slash for static export compatibility
   */
  trailingSlash: true,
};

export default nextConfig;

