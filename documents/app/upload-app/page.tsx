"use client";
import { useState, useRef } from 'react';

export default function UploadApp() {
  const [file, setFile] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [subpath, setSubpath] = useState('');
  const [result, setResult] = useState(null);

  async function doUpload(e) {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('subpath', subpath);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    setResult(j);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Upload-App (integriert)</h1>
      <form onSubmit={doUpload} className="flex flex-col gap-3 max-w-lg">
        <input
          ref={inputRef}
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-3 py-2 border rounded bg-white"
            onClick={() => inputRef.current?.click()}
          >
            Datei auswählen
          </button>
          <div className="text-sm text-zinc-600">{file ? file.name : 'Keine Datei ausgewählt'}</div>
        </div>
        <input placeholder="subpath (optional)" value={subpath} onChange={(e) => setSubpath(e.target.value)} className="border px-2 py-1" />
        <button className="bg-black text-white px-3 py-2 rounded" type="submit">Upload</button>
      </form>

      {result && result.path && (
        <div className="mt-6">
          <p>Hochgeladen: <a className="text-blue-600" href={`/api/upload/download?path=${encodeURIComponent(result.path)}`}>Herunterladen</a></p>
          <p className="mt-2">QR-Code:</p>
          <div className="flex items-center gap-4 mt-2">
            <img src={`/api/upload/qrcode?path=${encodeURIComponent(result.path)}`} alt="QR" />
            <a className="px-3 py-2 bg-gray-100 rounded" href={`/api/upload/qrcode?path=${encodeURIComponent(result.path)}&download=1`}>QR herunterladen</a>
          </div>
        </div>
      )}
      {result && result.error && (
        <div className="mt-6 text-red-600">Fehler: {result.error}</div>
      )}
    </div>
  );
}
