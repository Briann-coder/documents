import type { NextApiRequest, NextApiResponse } from 'next';
const QRCode: any = require('qrcode');
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const p = typeof req.query.path === 'string' ? req.query.path : '';
  if (!p) return res.status(400).send('path missing');
  try {
    resolveAndCheck(p);
  } catch (e) {
    return res.status(400).send('invalid path');
  }
  const host = req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || (req.socket && (req.socket as any).encrypted ? 'https' : 'http');
  const downloadUrl = `${proto}://${host}/api/upload/download?path=${encodeURIComponent(p)}`;
  try {
    const buffer = await QRCode.toBuffer(downloadUrl, { type: 'png' });
    const wantDownload = req.query.download === '1' || req.query.download === 'true';
    res.setHeader('Content-Type', 'image/png');
    if (wantDownload) {
      const baseName = path.basename(p).replace(/[^a-zA-Z0-9-_\.]/g, '_');
      res.setHeader('Content-Disposition', `attachment; filename="qr-${baseName}.png"`);
    }
    res.end(buffer);
  } catch (err) {
    res.status(500).send('qr generation failed');
  }
}
