import type { NextConfig } from "next";
import path from "path"; // Vergiss nicht, path zu importieren

const nextConfig: NextConfig = {
  // DAS HIER HINZUFÜGEN:
  turbopack: {
    root: __dirname, // Zwingt Turbopack, exakt im /documents-Ordner zu suchen
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