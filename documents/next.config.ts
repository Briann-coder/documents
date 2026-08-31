import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ZWINGT NEXT.JS ZU EINEM STATISCHEN HTML-EXPORT:
  output: "export", 
  
  // Hinweis: Da es ein statischer Export ist, werden 'rewrites' serverseitig 
  // nicht mehr von Next.js verarbeitet. (Das lösen wir gleich über Nginx!)
};

export default nextConfig;
