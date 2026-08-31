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

function FileList({ items, prefix, onDeleted }: { items: any[]; prefix: string; onDeleted?: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (path: string) => setExpanded((s) => ({ ...s, [path]: !s[path] }));

  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.path} className="border rounded p-2">
          <div className="flex items-center justify-between">
            <div>
              <strong>{it.name}</strong>
              <div className="text-xs text-zinc-500">{it.type === 'file' ? `${(it.size/1024).toFixed(1)} KB` : 'Ordner'}</div>
            </div>
            <div className="flex items-center gap-2">
              {it.type === 'file' ? (
                <>
                  <a className="text-sm text-blue-600" href={`/api/upload/download?path=${encodeURIComponent(it.path)}`}>Download</a>
                  <a className="text-sm text-zinc-700" href={`/api/upload/qrcode?path=${encodeURIComponent(it.path)}`} target="_blank" rel="noreferrer">QR anzeigen</a>
                  <a className="text-sm text-zinc-700" href={`/api/upload/qrcode?path=${encodeURIComponent(it.path)}&download=1`}>QR herunterladen</a>
                  <button
                    className="text-sm text-red-600"
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
                  <button className="text-sm text-blue-600" onClick={() => toggle(it.path)}>
                    {expanded[it.path] ? 'Ordner schließen' : 'Ordner öffnen'}
                  </button>
                </>
              )}
            </div>
          </div>

          {it.type === 'dir' && expanded[it.path] && (
            <div className="mt-2 pl-4">
              <FileList items={it.children || []} prefix={it.path} onDeleted={onDeleted} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
