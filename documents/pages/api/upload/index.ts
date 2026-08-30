import type { NextApiRequest, NextApiResponse } from 'next';
const formidable: any = require('formidable');
import fs from 'fs';
import path from 'path';
import os from 'os';

const UPLOAD_BASE = process.env.UPLOAD_BASE_DIR
  ? path.resolve(process.env.UPLOAD_BASE_DIR)
  : path.resolve(process.cwd(), 'upload-storage');

fs.mkdirSync(UPLOAD_BASE, { recursive: true });

export const config = {
  api: {
    bodyParser: false,
  },
};

function resolveAndCheck(relPath: string) {
  const safeRel = relPath.replace(/\0/g, '');
  const full = path.resolve(UPLOAD_BASE, safeRel);
  if (!full.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
  return full;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const form = new formidable.IncomingForm({ multiples: false, uploadDir: os.tmpdir(), keepExtensions: true });
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) return res.status(500).json({ error: 'parse_failed' });
    const file = files.file;
    if (!file) return res.status(400).json({ error: 'no_file' });
    const sub = fields.subpath || '';
    let destDir: string;
    try {
      destDir = path.resolve(UPLOAD_BASE, sub);
      if (!destDir.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
      fs.mkdirSync(destDir, { recursive: true });
    } catch (e) {
      return res.status(400).json({ error: 'invalid_path' });
    }

    // Support different formidable versions: prefer `filepath` and `originalFilename` (formidable@2+)
    const tempPath = file.filepath || file.path || file.tmpFilePath || file.tempFilePath;
    const originalName = file.originalFilename || file.name || file.filename || path.basename(String(tempPath || 'upload'));
    const filename = Date.now() + '-' + originalName;
    const destPath = path.join(destDir, filename);
    try {
      if (!tempPath || !fs.existsSync(tempPath)) return res.status(500).json({ error: 'temp_missing' });
      fs.renameSync(tempPath, destPath);
    } catch (e) {
      return res.status(500).json({ error: 'move_failed' });
    }

    const rel = path.relative(UPLOAD_BASE, destPath).split(path.sep).join('/');
    res.json({ path: rel });
  });
}
