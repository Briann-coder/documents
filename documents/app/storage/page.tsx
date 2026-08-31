"use client";
import { useEffect, useState } from 'react';

export default function StoragePage() {
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/upload/list');
      const j = await r.json();
      setData(j);
    } catch (e) {
      setData({ listing: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Storage</h1>
      <p className="text-sm text-zinc-600 mb-4">Browse uploaded files and download them.</p>
      <div>
        {data?.listing?.length === 0 && <div className="text-zinc-500">Keine Dateien gefunden.</div>}
        <FileList items={data?.listing || []} prefix="" onDeleted={load} />
      </div>
    </div>
  );
}

function FileList({ items, prefix, onDeleted, nested = false }: { items: any[]; prefix: string; onDeleted?: () => void; nested?: boolean }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (path: string) => setExpanded((s) => ({ ...s, [path]: !s[path] }));

  const containerClass = nested ? 'space-y-2' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3';
  const cardBase = 'bg-white/90 hover:shadow-lg transition rounded-lg p-3 flex flex-col items-start gap-2 text-sm min-w-0';

  return (
    <div className={containerClass}>
      {items.map((it) => (
        <div key={it.path} className={cardBase}>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-shrink-0">
              {it.type === 'dir' ? (
                <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
              <div className={nested ? 'min-w-0' : 'truncate min-w-0'}>
                <div className={nested ? 'font-medium break-words' : 'font-medium truncate'}>{it.name}</div>
              <div className="text-xs text-zinc-400">{it.type === 'file' ? `${(it.size/1024).toFixed(1)} KB` : 'Ordner'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 w-full">
            {it.type === 'file' ? (
              <>
                <a className="flex-1 text-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100" href={`/api/upload/download?path=${encodeURIComponent(it.path)}`}>Download</a>
                <a className="px-2 py-1 bg-zinc-50 text-zinc-700 rounded-md text-xs hover:bg-zinc-100" href={`/api/upload/qrcode?path=${encodeURIComponent(it.path)}`} target="_blank" rel="noreferrer">QR</a>
                <button
                  className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100"
                  onClick={async () => {
                    if (!confirm(`Datei "${it.name}" wirklich löschen?`)) return;
                    try {
                      const res = await fetch(`/api/upload/delete?path=${encodeURIComponent(it.path)}`, { method: 'DELETE' });
                      const json = await res.json();
                      if (res.ok) {
                        onDeleted && onDeleted();
                      } else {
                        alert('Löschen fehlgeschlagen: ' + (json.error || res.status));
                      }
                    } catch (e) {
                      alert('Löschen fehlgeschlagen');
                    }
                  }}
                >
                  Löschen
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs hover:bg-emerald-100"
                  onClick={() => toggle(it.path)}
                >
                  {expanded[it.path] ? 'Schließen' : 'Öffnen'}
                </button>
              </>
            )}
          </div>

          {it.type === 'dir' && expanded[it.path] && (
            <div className="mt-2 w-full">
              <FileList items={it.children || []} prefix={it.path} onDeleted={onDeleted} nested={true} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
