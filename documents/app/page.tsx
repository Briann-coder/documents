import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-gradient-to-r from-white to-zinc-50 p-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome to Documents</h1>
          <p className="mt-2 text-zinc-600">Zentrale Anlaufstelle für das Upload von Dateien.</p>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/upload-app" className="px-4 py-2 bg-black text-white rounded-md">Upload</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card title="Upload-App" href="/upload-app">Dateien hochladen und QR-Code  generieren.</Card>
      </section>
    </div>
  );
}

function Card({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-lg border p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{children}</p>
    </Link>
  );
}
