import { execFile } from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, '../..');
let fixtureRoot = '';

async function copyScript(relativePath: string) {
  const destination = path.join(fixtureRoot, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(repositoryRoot, relativePath), destination);
}

async function expectAdapterToRejectSymlink(
  relativeScriptPath: string,
  expectedRecordPath: string,
) {
  await expect(
    execFileAsync(
      process.execPath,
      [path.join(fixtureRoot, relativeScriptPath)],
      {
        cwd: fixtureRoot,
        encoding: 'utf8',
      },
    ),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining(expectedRecordPath),
  });
}

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), 'sbla-foundation-adapters-'));

  await Promise.all([
    copyScript('scripts/content/validate.mjs'),
    copyScript('scripts/evidence/status.mjs'),
    copyScript('scripts/foundation/foundation-mode.mjs'),
    copyScript('scripts/foundation/scan-records.mjs'),
    copyScript('scripts/graph/validate.mjs'),
    copyScript('src/lib/content/schemas.ts'),
    copyScript('src/lib/content/validation.ts'),
  ]);

  await Promise.all([
    mkdir(path.join(fixtureRoot, 'content/claims'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'content/sources'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'content-drafts/exercises'), {
      recursive: true,
    }),
    mkdir(path.join(fixtureRoot, 'research/packets'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'reviews/evidence'), { recursive: true }),
    writeFile(path.join(fixtureRoot, 'README.md'), 'fixture target\n'),
    symlink(
      path.join(repositoryRoot, 'node_modules'),
      path.join(fixtureRoot, 'node_modules'),
    ),
  ]);

  await Promise.all([
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content/claims/claim.yml'),
    ),
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content/sources/source.yml'),
    ),
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content-drafts/exercises/draft.yml'),
    ),
  ]);
});

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

describe('foundation adapters', () => {
  it('makes content validation fail closed on record symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/content/validate.mjs',
      'content/claims/claim.yml',
    );
  });

  it('makes graph validation fail closed on record symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/graph/validate.mjs',
      'content/claims/claim.yml',
    );
  });

  it('makes evidence status fail closed on source symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/evidence/status.mjs',
      'content/sources/source.yml',
    );
  });
});
