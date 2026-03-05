import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default engine in 16.1.6
  async rewrites() {
    return [
      {
        source: '/web2wave-internal/:path*',
        destination: 'https://your-funnel.web2wave.com/:path*',
      },
    ];
  },
};

export default nextConfig;
