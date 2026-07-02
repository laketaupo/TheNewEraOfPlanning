#!/usr/bin/env node
// Local test server that replicates GitHub Pages' actual unmatched-path behavior (serve 404.html
// content with a 404 status, WITHOUT rewriting the browser's address bar) — unlike `serve -s`,
// which silently serves index.html's content for any path at 200, masking bugs that only show up
// when the browser's location genuinely still points at a deep, non-existent path.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const PORT = process.argv[2] ? Number(process.argv[2]) : 8081;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.md': 'text/markdown', '.png': 'image/png',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let filePath = join(ROOT, path);
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, 'index.html');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  }
}).listen(PORT, () => console.log(`gh-pages-like server on http://localhost:${PORT}`));
