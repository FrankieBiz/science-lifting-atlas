import { execFile } from 'node:child_process';
import { cp, mkdtemp, rename, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, '../..');
let fixtureRoot = '';

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), 'sbla-operating-model-'));
  const excludedRoots = new Set([
    '.astro',
    '.git',
    'coverage',
    'dist',
    'node_modules',
    'playwright-report',
    'test-results',
  ]);

  await cp(repositoryRoot, fixtureRoot, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(repositoryRoot, source);
      const [root] = relative.split(path.sep);
      return !root || !excludedRoots.has(root);
    },
  });

  await rename(
    path.join(fixtureRoot, 'AGENTS.md'),
    path.join(fixtureRoot, 'AGENTS.real.md'),
  );
  await symlink('AGENTS.real.md', path.join(fixtureRoot, 'AGENTS.md'));
});

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

describe('operating-model filesystem verification', () => {
  it('rejects a required operating document implemented as a symlink', async () => {
    await expect(
      execFileAsync(
        process.execPath,
        [path.join(fixtureRoot, 'scripts/foundation/verify.mjs')],
        { cwd: fixtureRoot, encoding: 'utf8' },
      ),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'missing required operating path: AGENTS.md',
      ),
    });
  });
});
