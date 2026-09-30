import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro emits `./assets/...` for every page when `assetsPrefix` is relative.
 * That is correct at the artifact root and incorrect at every nested route.
 * This build hook keeps the artifact mount-agnostic while making the prefix
 * relative to each emitted HTML file.
 */
export function relativeAssetUrls() {
  /** @type {import('astro').AstroIntegration} */
  const integration = {
    name: 'sbla-relative-asset-urls',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await rewriteRelativeAssetUrls(fileURLToPath(dir));
      },
    },
  };

  return integration;
}

/** @param {string} outputDirectory */
export async function rewriteRelativeAssetUrls(outputDirectory) {
  const root = resolve(outputDirectory);
  const htmlFiles = await collectHtmlFiles(root);

  await Promise.all(
    htmlFiles.map(async (file) => {
      const relativeRoot = relative(dirname(file), root).split(sep).join('/');
      const prefix = relativeRoot ? `${relativeRoot}/assets/` : './assets/';
      const html = await readFile(file, 'utf8');
      const rewritten = html.replace(/(["'])\.\/assets\//gu, `$1${prefix}`);

      if (rewritten !== html) await writeFile(file, rewritten, 'utf8');
    }),
  );
}

/** @param {string} directory @returns {Promise<string[]>} */
async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(path);
      return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
    }),
  );

  return files.flat();
}
