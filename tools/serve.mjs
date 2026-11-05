#!/usr/bin/env node
/** Local, dependency-free server with the same /noctis/ base path as Pages. */
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 8765);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.vtt': 'text/vtt; charset=utf-8', '.mp4': 'video/mp4' };
http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400).end('Invalid URL'); return; }
    if (pathname === '/noctis') { res.writeHead(302, { Location: '/noctis/' }).end(); return; }
    if (pathname.startsWith('/noctis/')) pathname = pathname.slice('/noctis'.length);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filename = path.resolve(root, '.' + pathname);
    const relative = path.relative(root, filename);
    const publicPath = /^assets[/\\]/.test(relative) || /^[^/\\]+\.html$/.test(relative) || relative === 'sitemap.xml';
    if (relative.startsWith('..') || path.isAbsolute(relative) || !publicPath || relative.split(path.sep).some(part => part.startsWith('.'))) { res.writeHead(404).end('Not found'); return; }
    let contents;
    try { if (!(await stat(filename)).isFile()) throw new Error(); contents = await readFile(filename); }
    catch {
      const body = await readFile(path.join(root, '404.html')).catch(() => Buffer.from('Not found'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(req.method === 'HEAD' ? undefined : body); return;
    }
    const headers = { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff' };
    const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if (range) {
      const start = range[1] ? Number(range[1]) : Math.max(0, contents.length - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), contents.length - 1) : contents.length - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= contents.length) { res.writeHead(416, { 'Content-Range': `bytes */${contents.length}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${contents.length}`, 'Content-Length': end - start + 1 }).end(req.method === 'HEAD' ? undefined : contents.subarray(start, end + 1)); return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': contents.length }).end(req.method === 'HEAD' ? undefined : contents);
  } catch { if (!res.headersSent) res.writeHead(500); res.end('Local server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Local site: http://127.0.0.1:${port}/noctis/`));
