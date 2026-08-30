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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const p = typeof req.query.path === 'string' ? req.query.path : '';
  if (!p) return res.status(400).send('path missing');
  let full: string;
  try {
    full = resolveAndCheck(p);
  } catch (e) {
    return res.status(400).send('invalid path');
  }
  if (!fs.existsSync(full)) return res.status(404).send('not found');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(full)}"`);
  const stream = fs.createReadStream(full);
  stream.pipe(res as any);
}
