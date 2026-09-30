import type { Server } from 'node:http';
import { readdir, stat } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
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
    expect(html).toContain('Explore resistance-training anatomy');
  });

  it('keeps and serves every page resource inside both deployment mounts', async () => {
    const deployments = [
      { baseUrl: `${requireUrl(rootUrl, 'root')}/`, mount: '/' },
      {
        baseUrl: `${requireUrl(subpathUrl, 'subpath')}/science-lifting-atlas/`,
        mount: '/science-lifting-atlas/',
      },
    ];
    const routes = await collectHtmlRoutes(DIST);

    for (const deployment of deployments) {
      const pages = await Promise.all(
        routes.map(async (route) => {
          const pageUrl = new URL(route, deployment.baseUrl);
          const page = await fetch(pageUrl);
          expect(page.status, `${pageUrl} must resolve`).toBe(200);
          const references = collectSameOriginResourceReferences(
            await page.text(),
            page.url,
          );
          expect(
            references.length,
            `${pageUrl} must expose a resource`,
          ).toBeGreaterThan(0);

          return { pageUrl, references };
        }),
      );
      const resources = new Map<string, string>();

      for (const { pageUrl, references } of pages) {
        for (const reference of references) {
          expect(
            isPathInsideMount(reference.url.pathname, deployment.mount),
            `${pageUrl}: ${reference.attribute} resource ${reference.raw} must remain inside ${deployment.mount}`,
          ).toBe(true);
          resources.set(
            reference.url.href,
            `${pageUrl}: ${reference.attribute} resource ${reference.raw}`,
          );
        }
      }

      await Promise.all(
        [...resources].map(async ([url, context]) => {
          expect(
            (await fetch(url)).status,
            `${context} must resolve under ${deployment.mount}`,
          ).toBe(200);
        }),
      );
    }
  });

  it('needs no server-side redirect or rewrite rule to serve the index', async () => {
    const response = await fetch(`${requireUrl(rootUrl, 'root')}/`, {
      redirect: 'manual',
    });
    expect(response.status).toBe(200);
  });

  it('keeps every page navigation inside both deployment mounts', async () => {
    const deployments = [
      { baseUrl: `${requireUrl(rootUrl, 'root')}/`, mount: '/' },
      {
        baseUrl: `${requireUrl(subpathUrl, 'subpath')}/science-lifting-atlas/`,
        mount: '/science-lifting-atlas/',
      },
    ];
    const routes = await collectHtmlRoutes(DIST);

    for (const deployment of deployments) {
      const pages = await Promise.all(
        routes.map(async (route) => {
          const pageUrl = new URL(route, deployment.baseUrl);
          const page = await fetch(pageUrl);
          expect(page.status, `${pageUrl} must resolve`).toBe(200);
          const references = collectSameOriginNavigationReferences(
            await page.text(),
            page.url,
          );

          expect(
            references.length,
            `${pageUrl} must expose navigation`,
          ).toBeGreaterThan(0);

          return { pageUrl, references };
        }),
      );
      const destinations = new Map<string, string>();

      for (const { pageUrl, references } of pages) {
        for (const reference of references) {
          expect(
            isPathInsideMount(reference.url.pathname, deployment.mount),
            `${pageUrl}: navigation ${reference.raw} must remain inside ${deployment.mount}`,
          ).toBe(true);
          destinations.set(
            reference.url.href,
            `${pageUrl}: navigation ${reference.raw}`,
          );
        }
      }

      await Promise.all(
        [...destinations].map(async ([url, context]) => {
          expect((await fetch(url)).status, `${context} must resolve`).toBe(
            200,
          );
        }),
      );
    }
  }, 15_000);
});

async function collectHtmlRoutes(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => {
      const file = resolve(entry.parentPath, entry.name);
      const path = relative(directory, file).split(sep).join('/');
      const route =
        path === 'index.html' ? '' : path.replace(/index\.html$/u, '');
      return route
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
    })
    .sort();
}

function requireUrl(value: string | undefined, label: string): string {
  if (!value) throw new Error(`The ${label} portability server did not start.`);
  return value;
}
