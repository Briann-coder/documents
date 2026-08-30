import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // KORREKT FÜR NEXT.JS 16: Auf oberster Ebene ohne "experimental"
  turbopack: {
    root: __dirname, // Absolute Pfadzuweisung für den Plesk-Unterordner
  },
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