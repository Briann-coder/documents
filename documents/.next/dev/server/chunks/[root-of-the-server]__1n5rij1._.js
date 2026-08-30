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
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/pages/api/upload/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
const formidable = __turbopack_context__.r("[externals]/formidable [external] (formidable, cjs, [project]/node_modules/formidable)");
;
;
;
const UPLOAD_BASE = process.env.UPLOAD_BASE_DIR ? __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.env.UPLOAD_BASE_DIR) : __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'upload-storage');
__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(UPLOAD_BASE, {
    recursive: true
});
const config = {
    api: {
        bodyParser: false
    }
};
function resolveAndCheck(relPath) {
    const safeRel = relPath.replace(/\0/g, '');
    const full = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(UPLOAD_BASE, safeRel);
    if (!full.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
    return full;
}
function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method not allowed');
    const form = new formidable.IncomingForm({
        multiples: false,
        uploadDir: __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["default"].tmpdir(),
        keepExtensions: true
    });
    form.parse(req, (err, fields, files)=>{
        if (err) return res.status(500).json({
            error: 'parse_failed'
        });
        const file = files.file;
        if (!file) return res.status(400).json({
            error: 'no_file'
        });
        const sub = fields.subpath || '';
        let destDir;
        try {
            destDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(UPLOAD_BASE, sub);
            if (!destDir.startsWith(UPLOAD_BASE)) throw new Error('Invalid path');
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(destDir, {
                recursive: true
            });
        } catch (e) {
            return res.status(400).json({
                error: 'invalid_path'
            });
        }
        // Support different formidable versions: prefer `filepath` and `originalFilename` (formidable@2+)
        const tempPath = file.filepath || file.path || file.tmpFilePath || file.tempFilePath;
        const originalName = file.originalFilename || file.name || file.filename || __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(String(tempPath || 'upload'));
        const filename = Date.now() + '-' + originalName;
        const destPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(destDir, filename);
        try {
            if (!tempPath || !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(tempPath)) return res.status(500).json({
                error: 'temp_missing'
            });
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].renameSync(tempPath, destPath);
        } catch (e) {
            return res.status(500).json({
                error: 'move_failed'
            });
        }
        const rel = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].relative(UPLOAD_BASE, destPath).split(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].sep).join('/');
        res.json({
            path: rel
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1n5rij1._.js.map