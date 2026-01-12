import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        pathname: '/v3/assets/**',
      },
    ],
  },
};

export default nextConfig;
