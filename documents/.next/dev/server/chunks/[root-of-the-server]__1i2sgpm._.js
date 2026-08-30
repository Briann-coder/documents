module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/pages/api/upload/qrcode.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
const QRCode = __turbopack_context__.r("[externals]/qrcode [external] (qrcode, cjs, [project]/node_modules/qrcode)");
;
const UPLOAD_BASE = process.env.UPLOAD_BASE_DIR ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.env.UPLOAD_BASE_DIR) : __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'upload-storage');
function resolveAndCheck(relPath) {
    const safeRel = relPath.replace(/\0/g, '');
    const full = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(UPLOAD_BASE, safeRel);
    if (!full.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
    return full;
}
async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end('Method not allowed');
    const p = typeof req.query.path === 'string' ? req.query.path : '';
    if (!p) return res.status(400).send('path missing');
    try {
        resolveAndCheck(p);
    } catch (e) {
        return res.status(400).send('invalid path');
    }
    const host = req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || (req.socket && req.socket.encrypted ? 'https' : 'http');
    const downloadUrl = `${proto}://${host}/api/upload/download?path=${encodeURIComponent(p)}`;
    try {
        const buffer = await QRCode.toBuffer(downloadUrl, {
            type: 'png'
        });
        const wantDownload = req.query.download === '1' || req.query.download === 'true';
        res.setHeader('Content-Type', 'image/png');
        if (wantDownload) {
            const baseName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(p).replace(/[^a-zA-Z0-9-_\.]/g, '_');
            res.setHeader('Content-Disposition', `attachment; filename="qr-${baseName}.png"`);
        }
        res.end(buffer);
    } catch (err) {
        res.status(500).send('qr generation failed');
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1i2sgpm._.js.map