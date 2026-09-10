import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
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
export async function serveStaticDirectory(root, mount = '/') {
  const base = await realpath(resolve(root));
  const prefix = mount.endsWith('/') ? mount : `${mount}/`;

  const server = createServer((request, response) => {
    void serveRequest(request, response, base, prefix).catch(() => {
      if (!response.headersSent) {
        response.writeHead(500).end('Internal Server Error');
      } else if (!response.writableEnded) {
        response.destroy();
      }
    });
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolvePromise(server);
    });
  });
}

/**
 * @param {import('node:http').IncomingMessage} request
 * @param {import('node:http').ServerResponse} response
 * @param {string} base
 * @param {string} prefix
 */
async function serveRequest(request, response, base, prefix) {
  const rawTarget = request.url ?? '/';
  let parsedUrl;
  let requestPath;

  try {
    parsedUrl = new URL(rawTarget, 'http://127.0.0.1');
    const suffixIndex = rawTarget.search(/[?#]/u);
    const rawPath = rawTarget.startsWith('/')
      ? suffixIndex === -1
        ? rawTarget
        : rawTarget.slice(0, suffixIndex)
      : parsedUrl.pathname;
    requestPath = decodeURIComponent(rawPath);
  } catch {
    response.writeHead(400).end('Bad Request');
    return;
  }

  if (
    requestPath.includes('\0') ||
    requestPath.split(/[\\/]/u).includes('..')
  ) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  if (!requestPath.startsWith(prefix)) {
    response.writeHead(404).end('Not Found');
    return;
  }

  let relative = requestPath.slice(prefix.length);
  if (relative === '' || relative.endsWith('/')) relative += 'index.html';

  // Reject lexical traversal before touching the filesystem.
  const target = resolve(join(base, normalize(relative)));
  if (!isInside(base, target)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let resolvedTarget;
  try {
    resolvedTarget = await realpath(target);
  } catch (error) {
    respondToFilesystemError(response, error);
    return;
  }

  // realpath containment prevents an intermediate or final symlink from
  // escaping the directory that was explicitly selected for this test server.
  if (!isInside(base, resolvedTarget)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const info = await stat(resolvedTarget);
    if (info.isDirectory()) {
      response
        .writeHead(308, {
          location: `${parsedUrl.pathname}/${parsedUrl.search}`,
        })
        .end();
      return;
    }

    const body = await readFile(resolvedTarget);
    response.writeHead(200, {
      'content-type':
        CONTENT_TYPES[extname(resolvedTarget)] ?? 'application/octet-stream',
      'content-length': String(body.byteLength),
    });
    response.end(body);
  } catch (error) {
    respondToFilesystemError(response, error);
  }
}

/** @param {string} base @param {string} candidate */
function isInside(base, candidate) {
  return candidate === base || candidate.startsWith(base + sep);
}

/**
 * Map only expected path outcomes to 404/403. Anything else is a harness fault,
 * and returning 500 keeps it visible instead of disguising it as a missing file.
 * @param {import('node:http').ServerResponse} response
 * @param {unknown} error
 */
function respondToFilesystemError(response, error) {
  const status = filesystemErrorStatus(error);

  if (status === 404) {
    response.writeHead(status).end('Not Found');
    return;
  }

  if (status === 403) {
    response.writeHead(status).end('Forbidden');
    return;
  }

  response.writeHead(status).end('Internal Server Error');
}

/** @param {unknown} error */
export function filesystemErrorStatus(error) {
  const code =
    error && typeof error === 'object' && 'code' in error ? error.code : null;

  if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
    return 404;
  }

  if (code === 'EACCES' || code === 'EPERM' || code === 'ELOOP') {
    return 403;
  }

  return 500;
}
