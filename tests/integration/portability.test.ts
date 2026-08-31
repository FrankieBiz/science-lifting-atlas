import type { Server } from 'node:http';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { serveStaticDirectory } from '../../scripts/portability/static-server.mjs';

const DIST = resolve(import.meta.dirname, '../../dist');

/**
 * ADR 0003 claims the build artifact is host-independent: it needs no
 * Cloudflare, Astro, or Node runtime, only a plain static file server. These
 * tests hold that claim to a generic `node:http` server so it cannot silently
 * regress — for example if a task introduces an SSR adapter, a redirect rule, or
 * a host-specific header dependency.
 */
describe('build artifact portability', () => {
  let rootServer: Server;
  let subpathServer: Server;
  let rootUrl: string;
  let subpathUrl: string;

  beforeAll(async () => {
    await stat(DIST).catch(() => {
      throw new Error(
        `dist/ not found at ${DIST}. Run "pnpm build" before the portability check.`,
      );
    });

    rootServer = await serveStaticDirectory(DIST, '/');
    subpathServer = await serveStaticDirectory(DIST, '/science-lifting-atlas/');

    const rootPort = (rootServer.address() as { port: number }).port;
    const subPort = (subpathServer.address() as { port: number }).port;
    rootUrl = `http://127.0.0.1:${rootPort}`;
    subpathUrl = `http://127.0.0.1:${subPort}`;
  });

  afterAll(async () => {
    await Promise.all(
      [rootServer, subpathServer].map(
        (s) => new Promise<void>((r) => s?.close(() => r())),
      ),
    );
  });

  it('serves the home page from a generic static server with no runtime', async () => {
    const response = await fetch(`${rootUrl}/`);
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('Science-Based Lifting Atlas');
    expect(html).toContain('Evidence-first resistance training anatomy');
  });

  it('resolves every asset the built HTML references, at a domain root', async () => {
    const html = await (await fetch(`${rootUrl}/`)).text();
    const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map(
      (m) => m[1],
    );

    expect(refs.length).toBeGreaterThan(0);

    for (const ref of refs) {
      const response = await fetch(`${rootUrl}${ref}`);
      expect(
        response.status,
        `asset ${ref} must resolve at a domain root`,
      ).toBe(200);
    }
  });

  it('needs no server-side redirect or rewrite rule to serve the index', async () => {
    const response = await fetch(`${rootUrl}/`, { redirect: 'manual' });
    expect(response.status).toBe(200);
  });

  it('documents the known subpath limitation: root-absolute assets escape a subpath', async () => {
    const page = await fetch(`${subpathUrl}/science-lifting-atlas/`);
    expect(page.status).toBe(200);

    const html = await page.text();
    const assetRefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)]
      .map((m) => m[1])
      .filter((ref): ref is string => Boolean(ref?.startsWith('/_astro/')));

    expect(
      assetRefs.length,
      'the build still emits root-absolute /_astro/ asset paths',
    ).toBeGreaterThan(0);

    // If this assertion ever fails, the build has become subpath-safe. That is
    // an improvement: update ADR 0003, which currently records the opposite.
    for (const ref of assetRefs) {
      const response = await fetch(`${subpathUrl}${ref}`);
      expect(
        response.status,
        `ADR 0003 records that ${ref} 404s under a subpath. If this now resolves, the constraint is gone and ADR 0003 must be updated.`,
      ).toBe(404);
    }
  });
});
