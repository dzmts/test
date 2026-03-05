import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default engine in 16.1.6
  async rewrites() {
    return [
      // If a request for a script comes in, we have to pick ONE destination.
      // For a POC, pointing to your primary variant's assets usually works.
      {
        source: '/_next/:path*',
        destination: 'https://skin.luvly.care/_next/:path*', 
      },
      {
        source: '/static/:path*',
        destination: 'https://skin.luvly.care/static/:path*',
      },
    ];
  },
};

export default nextConfig;
