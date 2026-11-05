'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { startServer } = require('./test-helpers.cjs');
const request = (origin, pathname) => new Promise((resolve, reject) => {
  const req = http.get(origin + pathname, response => { response.resume(); response.on('end', () => resolve(response.statusCode)); });
  req.on('error', reject);
});
test('static helper serves a project prefix and rejects traversal, symlinks and private files', async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'noctis-server-'));
  const root = path.join(temp, 'public');
  await fs.mkdir(root); await fs.writeFile(path.join(root, 'index.html'), '<h1>test</h1>');
  await fs.writeFile(path.join(temp, 'private.txt'), 'private');
  await fs.symlink(path.join(temp, 'private.txt'), path.join(root, 'escape.txt'));
  await fs.mkdir(path.join(root, '.git')); await fs.writeFile(path.join(root, '.git/config'), 'private');
  const server = await startServer({ root, mountPath: '/noctis' });
  try {
    assert.equal(await request(server.origin, '/noctis/'), 200);
    assert.equal(await request(server.origin, '/index.html'), 404, 'only mount path is public');
    assert.equal(await request(server.origin, '/noctis/escape.txt'), 403, 'symlink cannot escape public root');
    assert.equal(await request(server.origin, '/noctis/.git/config'), 403, 'private files are forbidden');
    assert.equal(await request(server.origin, '/noctis/%2e%2e%2fprivate.txt'), 403, 'encoded traversal is forbidden');
    assert.equal(await request(server.origin, '/noctis/%E0%A4%A'), 400, 'malformed URL does not crash server');
  } finally { await server.close(); await fs.rm(temp, { recursive: true, force: true }); }
});
