import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

/**
 * A deliberately minimal static file server: no framework, no adapter, no
 * host-specific behaviour. ADR 0003 claims the build artifact is portable to any
 * plain static host, and the only honest way to test that is to serve it with
 * something that provides nothing beyond files over HTTP.
 */
/** @type {Readonly<Record<string, string>>} */
const CONTENT_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
});

/**
 * @param {string} root absolute directory to serve
 * @param {string} mount path prefix the site is served under, e.g. '/' or '/repo/'
 * @returns {Promise<import('node:http').Server>} a listening server on an ephemeral port
 */
export function serveStaticDirectory(root, mount = '/') {
  const base = resolve(root);
  const prefix = mount.endsWith('/') ? mount : `${mount}/`;

  const server = createServer(async (request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url ?? '/', 'http://127.0.0.1').pathname,
    );

    if (!requestPath.startsWith(prefix)) {
      response.writeHead(404).end('Not Found');
      return;
    }

    let relative = requestPath.slice(prefix.length);
    if (relative === '' || relative.endsWith('/')) relative += 'index.html';

    // Reject traversal before touching the filesystem.
    const target = resolve(join(base, normalize(relative)));
    if (target !== base && !target.startsWith(base + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const info = await stat(target);
      if (info.isDirectory()) {
        response.writeHead(404).end('Not Found');
        return;
      }

      const body = await readFile(target);
      response.writeHead(200, {
        'content-type':
          CONTENT_TYPES[extname(target)] ?? 'application/octet-stream',
        'content-length': String(body.byteLength),
      });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not Found');
    }
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolvePromise(server));
  });
}
