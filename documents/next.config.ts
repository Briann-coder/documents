import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <-- DIESE ZEILE HINZUFÜGEN
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
