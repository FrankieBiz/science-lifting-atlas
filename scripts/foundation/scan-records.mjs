import { readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string} absoluteRoot
 * @param {string} repositoryRoot
 * @returns {Promise<string[]>}
 */
export async function listRelativeFiles(absoluteRoot, repositoryRoot) {
  const entries = await readdir(absoluteRoot, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listRelativeFiles(absolutePath, repositoryRoot)));
    } else {
      files.push(
        path.relative(repositoryRoot, absolutePath).split(path.sep).join('/'),
      );
    }
  }

  return files.sort();
}
