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
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((ref): ref is string => Boolean(ref?.includes('/assets/')));

    expect(refs.length).toBeGreaterThan(0);

    for (const ref of refs) {
      const response = await fetch(new URL(ref, `${rootUrl}/`));
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

  it('keeps same-origin navigation inside both deployment mounts', async () => {
    const deployments = [
      { pageUrl: `${rootUrl}/`, mount: '/' },
      {
        pageUrl: `${subpathUrl}/science-lifting-atlas/`,
        mount: '/science-lifting-atlas/',
      },
    ];

    for (const deployment of deployments) {
      const page = await fetch(deployment.pageUrl);
      const html = await page.text();
      const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(
        (match) => match[1],
      );

      expect(hrefs.length).toBeGreaterThan(0);

      for (const href of hrefs) {
        if (!href) continue;
        const target = new URL(href, page.url);
        if (target.origin !== new URL(page.url).origin) continue;

        expect(
          target.pathname,
          `navigation ${href} must remain inside ${deployment.mount}`,
        ).toMatch(new RegExp(`^${deployment.mount.replaceAll('/', '\\/')}`));
        expect((await fetch(target)).status).toBe(200);
      }
    }
  });

  it('serves the same built assets from a project subpath', async () => {
    const page = await fetch(`${subpathUrl}/science-lifting-atlas/`);
    expect(page.status).toBe(200);

    const html = await page.text();
    expect(html).toContain('Science-Based Lifting Atlas');
    const assetRefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((ref): ref is string => Boolean(ref?.includes('/assets/')));

    expect(assetRefs.length).toBeGreaterThan(0);

    for (const ref of assetRefs) {
      const assetUrl = new URL(ref, page.url);
      expect(
        assetUrl.pathname,
        `asset ${ref} must remain inside the project subpath`,
      ).toMatch(/^\/science-lifting-atlas\//);

      const response = await fetch(assetUrl);
      expect(
        response.status,
        `asset ${ref} must resolve from the same artifact under a subpath`,
      ).toBe(200);
    }
  });
});
