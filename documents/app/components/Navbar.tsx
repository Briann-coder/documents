"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-white/70 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-[41.6px] w-auto min-w-[36px] overflow-hidden">
            <img
              src="/logo.png"
              alt="Documents logo"
              className="h-full w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <span className="font-semibold text-lg">Documents</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/upload-app" className="text-sm px-3 py-2 rounded-md hover:bg-gray-100">Upload</Link>
          <Link href="/storage" className="text-sm px-3 py-2 rounded-md hover:bg-gray-100">Storage</Link>
        </nav>
      </div>
    </header>
  );
}
