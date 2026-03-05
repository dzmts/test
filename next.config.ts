import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Internal route for the proxy logic — forwards requests to the Web2Wave funnel
        source: "/web2wave-internal/:path*",
        destination: "https://your-funnel.web2wave.com/:path*",
      },
    ];
  },
};

export default nextConfig;
