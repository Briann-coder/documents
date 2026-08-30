module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
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
"[project]/pages/api/upload/list.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const UPLOAD_BASE = process.env.UPLOAD_BASE_DIR ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.env.UPLOAD_BASE_DIR) : __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'upload-storage');
function resolveAndCheck(relPath) {
    const safeRel = relPath.replace(/\0/g, '');
    const full = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(UPLOAD_BASE, safeRel);
    if (!full.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
    return full;
}
function walk(dir, base = '') {
    const entries = [];
    for (const name of __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dir)){
        const full = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dir, name);
        const rel = base ? `${base}/${name}` : name;
        const stat = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(full);
        if (stat.isDirectory()) {
            entries.push({
                name,
                path: rel,
                type: 'dir',
                children: walk(full, rel)
            });
        } else {
            entries.push({
                name,
                path: rel,
                type: 'file',
                size: stat.size,
                mtime: stat.mtimeMs
            });
        }
    }
    return entries;
}
function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end('Method not allowed');
    const sub = typeof req.query.sub === 'string' ? req.query.sub : '';
    let dir;
    try {
        dir = resolveAndCheck(sub || '');
    } catch (e) {
        return res.status(400).json({
            error: 'invalid_path'
        });
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) return res.status(404).json({
        error: 'not_found'
    });
    try {
        const listing = walk(dir, sub || '');
        res.json({
            base: UPLOAD_BASE,
            path: sub || '',
            listing
        });
    } catch (e) {
        res.status(500).json({
            error: 'read_failed'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__14vyu1h._.js.map