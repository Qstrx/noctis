'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const projectRoot = path.resolve(__dirname, '..');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

// Supports both the original layout and the organized assets/ layout.
function sourcePath(filename, group = 'js') {
  const organized = path.join(projectRoot, 'assets', group, filename);
  return fs.existsSync(organized) ? organized : path.join(projectRoot, filename);
}

function createStaticServer({ root = projectRoot, mountPath = '' } = {}) {
  mountPath = '/' + mountPath.replace(/^\/+|\/+$/g, '');
  if (mountPath === '/') mountPath = '';
  const realRoot = fs.realpathSync(root);
  return http.createServer(async (req, res) => {
    const end = status => { res.writeHead(status); res.end(); };
    if (!['GET', 'HEAD'].includes(req.method)) return end(405);
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch { return end(400); }
    if (mountPath) {
      if (pathname === mountPath) { res.writeHead(308, { Location: mountPath + '/' }); return res.end(); }
      if (!pathname.startsWith(mountPath + '/')) return end(404);
      pathname = pathname.slice(mountPath.length);
    }
    if (pathname.includes('\0') || pathname.includes('\\')) return end(400);
    const pieces = pathname.split('/');
    if (pieces.some(piece => piece.startsWith('.') || piece === 'node_modules')) return end(403);
    const filename = path.resolve(realRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(realRoot + path.sep)) return end(403);
    try {
      const realFile = await fs.promises.realpath(filename);
      if (!realFile.startsWith(realRoot + path.sep)) return end(403);
      const stat = await fs.promises.stat(realFile);
      if (!stat.isFile()) return end(404);
      res.writeHead(200, { 'Content-Type': types[path.extname(realFile)] || 'application/octet-stream', 'Content-Length': stat.size });
      if (req.method === 'HEAD') return res.end();
      const stream = fs.createReadStream(realFile);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    } catch { end(404); }
  });
}

async function startServer(options) {
  const server = createStaticServer(options);
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const mountPath = (options?.mountPath || '').replace(/\/$/, '');
  return { server, origin, baseUrl: origin + mountPath, close: () => new Promise(resolve => server.close(resolve)) };
}

function launchBrowser(options = {}) {
  const launch = { headless: true, ...options };
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  else if (process.env.PLAYWRIGHT_CHANNEL) launch.channel = process.env.PLAYWRIGHT_CHANNEL;
  return playwright.chromium.launch(launch);
}

async function blockExternal(context, origin) {
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
}

module.exports = { ...playwright, projectRoot, sourcePath, createStaticServer, startServer, launchBrowser, blockExternal };
