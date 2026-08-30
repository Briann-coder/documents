import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_BASE = process.env.UPLOAD_BASE_DIR
  ? path.resolve(process.env.UPLOAD_BASE_DIR)
  : path.resolve(process.cwd(), 'upload-storage');

function resolveAndCheck(relPath: string) {
  const safeRel = relPath.replace(/\0/g, '');
  const full = path.resolve(UPLOAD_BASE, safeRel);
  if (!full.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
  return full;
}

function walk(dir: string, base = ''): any[] {
  const entries: any[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push({ name, path: rel, type: 'dir', children: walk(full, rel) });
    } else {
      entries.push({ name, path: rel, type: 'file', size: stat.size, mtime: stat.mtimeMs });
    }
  }
  return entries;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const sub = typeof req.query.sub === 'string' ? req.query.sub : '';
  let dir;
  try {
    dir = resolveAndCheck(sub || '');
  } catch (e) {
    return res.status(400).json({ error: 'invalid_path' });
  }
  if (!fs.existsSync(dir)) return res.status(404).json({ error: 'not_found' });
  try {
    const listing = walk(dir, sub || '');
    res.json({ base: UPLOAD_BASE, path: sub || '', listing });
  } catch (e) {
    res.status(500).json({ error: 'read_failed' });
  }
}
