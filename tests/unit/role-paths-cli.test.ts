import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const checkerPath = path.resolve(
  import.meta.dirname,
  '../../scripts/foundation/check-role-paths.mjs',
);
const temporaryRepositories: string[] = [];

async function git(repository: string, ...args: string[]) {
  return execFileAsync('git', args, { cwd: repository, encoding: 'utf8' });
}

async function createRepository() {
  const repository = await mkdtemp(path.join(tmpdir(), 'sbla-role-paths-'));
  temporaryRepositories.push(repository);

  await git(repository, 'init', '--quiet');
  await git(repository, 'config', 'user.name', 'SBLA Test');
  await git(repository, 'config', 'user.email', 'sbla-test@example.invalid');
  await writeFile(path.join(repository, 'README.md'), 'base\n');
  await git(repository, 'add', 'README.md');
  await git(repository, 'commit', '--quiet', '-m', 'base');

  return {
    repository,
    base: (await git(repository, 'rev-parse', 'HEAD')).stdout.trim(),
  };
}

async function commitFile(
  repository: string,
  relativePath: string,
  contents = 'fixture\n',
) {
  const absolutePath = path.join(repository, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents);
  await git(repository, 'add', relativePath);
  await git(repository, 'commit', '--quiet', '-m', `add ${relativePath}`);
}

async function removeAndCommit(repository: string, relativePath: string) {
  await git(repository, 'rm', '--quiet', relativePath);
  await git(repository, 'commit', '--quiet', '-m', `remove ${relativePath}`);
}

async function runChecker(repository: string, role: string, base: string) {
  return execFileAsync(process.execPath, [checkerPath, role, '--base', base], {
    cwd: repository,
    encoding: 'utf8',
  });
}

afterEach(async () => {
  await Promise.all(
    temporaryRepositories
      .splice(0)
      .map((repository) => rm(repository, { recursive: true, force: true })),
  );
});

describe('role path boundary CLI', () => {
  it('rejects an empty diff that proves no role work', async () => {
    const { repository, base } = await createRepository();

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'Role path boundary found no changed paths to evaluate',
      ),
    });
  });

  it('derives and accepts the complete allowed diff from a reviewed base', async () => {
    const { repository, base } = await createRepository();
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).resolves.toMatchObject({
      stdout: expect.stringContaining('1 changed path(s)'),
    });
  });

  it('rejects a prohibited path found in the complete diff', async () => {
    const { repository, base } = await createRepository();
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');
    await commitFile(repository, 'src/pages/index.astro');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'role claude-review may not write: src/pages/index.astro',
      ),
    });
  });

  it('rejects a prohibited deletion found in the complete diff', async () => {
    const { repository } = await createRepository();
    await commitFile(repository, 'src/pages/index.astro');
    const base = (await git(repository, 'rev-parse', 'HEAD')).stdout.trim();
    await removeAndCommit(repository, 'src/pages/index.astro');
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'role claude-review may not write: src/pages/index.astro',
      ),
    });
  });

  it('rejects the prohibited source path of a rename into an allowed directory', async () => {
    const { repository } = await createRepository();
    await commitFile(repository, 'src/pages/index.astro');
    const base = (await git(repository, 'rev-parse', 'HEAD')).stdout.trim();
    await mkdir(path.join(repository, 'reviews/releases'), { recursive: true });
    await git(
      repository,
      'mv',
      'src/pages/index.astro',
      'reviews/releases/index.astro',
    );
    await git(repository, 'commit', '--quiet', '-m', 'rename prohibited file');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'role claude-review may not write: src/pages/index.astro',
      ),
    });
  });

  it('rejects a base commit that is not an ancestor of HEAD', async () => {
    const { repository, base } = await createRepository();
    await git(repository, 'checkout', '--quiet', '-b', 'unrelated-base');
    await commitFile(repository, 'branch-only.md');
    const divergentBase = (
      await git(repository, 'rev-parse', 'HEAD')
    ).stdout.trim();
    await git(repository, 'checkout', '--quiet', '-b', 'review-branch', base);
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runChecker(repository, 'claude-review', divergentBase),
    ).rejects.toMatchObject({
      code: 2,
      stderr: expect.stringContaining('must be an ancestor of HEAD'),
    });
  });

  it('refuses a dirty worktree whose changes are outside the committed diff', async () => {
    const { repository, base } = await createRepository();
    await writeFile(path.join(repository, 'untracked.md'), 'not committed\n');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 2,
      stderr: expect.stringContaining(
        'Role path boundary requires a clean worktree',
      ),
    });
  });
});
