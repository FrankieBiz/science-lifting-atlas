import type { Server } from 'node:http';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { serveStaticDirectory } from '../../scripts/portability/static-server.mjs';
import {
  collectSameOriginNavigationReferences,
  collectSameOriginResourceReferences,
  isPathInsideMount,
} from './portability/resource-references';
import { closeServer } from './portability/server-lifecycle';

const DIST = resolve(import.meta.dirname, '../../dist');

/**
 * ADR 0003 claims the build artifact is host-independent: it needs no
 * Cloudflare, Astro, or Node runtime, only a plain static file server. These
 * tests hold that claim to a generic `node:http` server so it cannot silently
 * regress — for example if a task introduces an SSR adapter, a redirect rule, or
 * a host-specific header dependency.
 */
describe('build artifact portability', () => {
  let rootServer: Server | undefined;
  let subpathServer: Server | undefined;
  let rootUrl: string | undefined;
  let subpathUrl: string | undefined;

  beforeAll(async () => {
    await stat(DIST).catch(() => {
      throw new Error(
        `dist/ not found at ${DIST}. Run "pnpm build" before the portability check.`,
      );
    });

    rootServer = await serveStaticDirectory(DIST, '/');
    try {
      subpathServer = await serveStaticDirectory(
        DIST,
        '/science-lifting-atlas/',
      );
    } catch (startupError) {
      try {
        await closeServer(rootServer);
      } catch (closeError) {
        throw new AggregateError(
          [startupError, closeError],
          'The subpath server failed to start and the root server failed to close.',
        );
      } finally {
        rootServer = undefined;
      }
      throw startupError;
    }

    const rootPort = (rootServer.address() as { port: number }).port;
    const subPort = (subpathServer.address() as { port: number }).port;
    rootUrl = `http://127.0.0.1:${rootPort}`;
    subpathUrl = `http://127.0.0.1:${subPort}`;
  });

  afterAll(async () => {
    const servers = [rootServer, subpathServer];
    rootServer = undefined;
    subpathServer = undefined;

    const results = await Promise.allSettled(servers.map(closeServer));
    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);
    if (errors.length > 0) {
      throw new AggregateError(errors, 'Failed to close portability servers.');
    }
  });

  it('serves the home page from a generic static server with no runtime', async () => {
    const response = await fetch(`${requireUrl(rootUrl, 'root')}/`);
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('Science-Based Lifting Atlas');
    expect(html).toContain('Evidence-first resistance training anatomy');
  });

  it('keeps and serves every homepage resource inside both deployment mounts', async () => {
    const deployments = [
      { pageUrl: `${requireUrl(rootUrl, 'root')}/`, mount: '/' },
      {
        pageUrl: `${requireUrl(subpathUrl, 'subpath')}/science-lifting-atlas/`,
        mount: '/science-lifting-atlas/',
      },
    ];

    for (const deployment of deployments) {
      const page = await fetch(deployment.pageUrl);
      expect(page.status).toBe(200);
      const references = collectSameOriginResourceReferences(
        await page.text(),
        page.url,
      );
      expect(references.length).toBeGreaterThan(0);

      for (const reference of references) {
        expect(
          isPathInsideMount(reference.url.pathname, deployment.mount),
          `${reference.attribute} resource ${reference.raw} must remain inside ${deployment.mount}`,
        ).toBe(true);
        expect(
          (await fetch(reference.url)).status,
          `${reference.attribute} resource ${reference.raw} must resolve under ${deployment.mount}`,
        ).toBe(200);
      }
    }
  });

  it('needs no server-side redirect or rewrite rule to serve the index', async () => {
    const response = await fetch(`${requireUrl(rootUrl, 'root')}/`, {
      redirect: 'manual',
    });
    expect(response.status).toBe(200);
  });

  it('keeps same-origin navigation inside both deployment mounts', async () => {
    const deployments = [
      { pageUrl: `${requireUrl(rootUrl, 'root')}/`, mount: '/' },
      {
        pageUrl: `${requireUrl(subpathUrl, 'subpath')}/science-lifting-atlas/`,
        mount: '/science-lifting-atlas/',
      },
    ];

    for (const deployment of deployments) {
      const page = await fetch(deployment.pageUrl);
      const references = collectSameOriginNavigationReferences(
        await page.text(),
        page.url,
      );

      expect(references.length).toBeGreaterThan(0);

      for (const reference of references) {
        expect(
          isPathInsideMount(reference.url.pathname, deployment.mount),
          `navigation ${reference.raw} must remain inside ${deployment.mount}`,
        ).toBe(true);
        expect((await fetch(reference.url)).status).toBe(200);
      }
    }
  });
});

function requireUrl(value: string | undefined, label: string): string {
  if (!value) throw new Error(`The ${label} portability server did not start.`);
  return value;
}
