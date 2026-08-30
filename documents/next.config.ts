import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/upload-app/:path*",
        destination: "http://localhost:3001/:path*",
      },
      {
        source: "/upload-app",
        destination: "http://localhost:3001/",
      },
    ];
  },
};

export default nextConfig;
