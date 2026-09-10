import { get, type Server } from 'node:http';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  filesystemErrorStatus,
  serveStaticDirectory,
} from '../../../scripts/portability/static-server.mjs';
import { closeServer } from './server-lifecycle';

interface TestResponse {
  body: string;
  location: string | undefined;
  status: number;
}

function requestPath(server: Server, path: string): Promise<TestResponse> {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Expected the test server to have a TCP address.');
  }

  return new Promise((resolve, reject) => {
    const request = get(
      {
        hostname: '127.0.0.1',
        path,
        port: address.port,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            body: Buffer.concat(chunks).toString('utf8'),
            location: response.headers.location,
            status: response.statusCode ?? 0,
          });
        });
      },
    );

    request.setTimeout(1_000, () => {
      request.destroy(new Error(`Timed out requesting ${path}`));
    });
    request.on('error', reject);
  });
}

describe('portability static server request safety', () => {
  let fixtureParent: string | undefined;
  let server: Server | undefined;

  beforeAll(async () => {
    fixtureParent = await mkdtemp(join(tmpdir(), 'sbla-portability-server-'));
    const servedRoot = join(fixtureParent, 'served');
    const outsideRoot = join(fixtureParent, 'outside');

    try {
      await Promise.all([
        mkdir(servedRoot, { recursive: true }),
        mkdir(outsideRoot, { recursive: true }),
      ]);
      await Promise.all([
        writeFile(join(servedRoot, 'index.html'), 'safe home'),
        writeFile(join(outsideRoot, 'secret.txt'), 'must not escape'),
      ]);
      await mkdir(join(servedRoot, 'sub'));
      await writeFile(
        join(servedRoot, 'sub', 'index.html'),
        'safe nested page',
      );
      await symlink(outsideRoot, join(servedRoot, 'escape'), 'dir');
      server = await serveStaticDirectory(servedRoot);
    } catch (setupError) {
      const cleanupResults = await Promise.allSettled([
        closeServer(server),
        rm(fixtureParent, { force: true, recursive: true }),
      ]);
      fixtureParent = undefined;
      server = undefined;
      const cleanupErrors = cleanupResults
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason);
      if (cleanupErrors.length > 0) {
        throw new AggregateError(
          [setupError, ...cleanupErrors],
          'Static-server setup and cleanup both failed.',
        );
      }
      throw setupError;
    }
  });

  afterAll(async () => {
    const cleanupTasks: Promise<unknown>[] = [closeServer(server)];
    if (fixtureParent) {
      cleanupTasks.push(rm(fixtureParent, { force: true, recursive: true }));
    }
    server = undefined;
    fixtureParent = undefined;

    const results = await Promise.allSettled(cleanupTasks);
    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);
    if (errors.length > 0) {
      throw new AggregateError(errors, 'Failed to clean up server fixtures.');
    }
  });

  it('returns 400 for malformed percent encoding and remains available', async () => {
    expect((await requestPath(server!, '/%ZZ')).status).toBe(400);
    expect(await requestPath(server!, '/')).toEqual({
      body: 'safe home',
      location: undefined,
      status: 200,
    });
  });

  it('redirects a directory request to its trailing-slash URL', async () => {
    expect(await requestPath(server!, '/sub')).toEqual({
      body: '',
      location: '/sub/',
      status: 308,
    });
    expect(await requestPath(server!, '/sub/')).toEqual({
      body: 'safe nested page',
      location: undefined,
      status: 200,
    });
  });

  it.each(['/%2e%2e/outside/secret.txt', '/%2e%2e%2Foutside/secret.txt'])(
    'rejects the encoded traversal target %s',
    async (path) => {
      expect((await requestPath(server!, path)).status).toBe(403);
    },
  );

  it('does not serve a symlink whose real path escapes the root', async () => {
    const response = await requestPath(server!, '/escape/secret.txt');
    expect(response.status).toBe(403);
    expect(response.body).not.toContain('must not escape');
  });

  it('returns 404 for an expected missing path', async () => {
    expect((await requestPath(server!, '/missing.txt')).status).toBe(404);
  });

  it('does not disguise unexpected filesystem errors as missing files', async () => {
    expect(
      filesystemErrorStatus(
        Object.assign(new Error('deterministic unexpected error'), {
          code: 'EIO',
        }),
      ),
    ).toBe(500);
  });
});
