import { execFile } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const checkerPath = path.resolve(
  import.meta.dirname,
  '../../scripts/foundation/check-role-paths.mjs',
);
const rolePathsPath = path.resolve(
  import.meta.dirname,
  '../../scripts/foundation/role-paths.mjs',
);
const operatingPolicyPath = path.resolve(
  import.meta.dirname,
  '../../docs/runbooks/operating-policy.json',
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
  await mkdir(path.join(repository, 'scripts/foundation'), { recursive: true });
  await mkdir(path.join(repository, 'docs/runbooks'), { recursive: true });
  await cp(
    checkerPath,
    path.join(repository, 'scripts/foundation/check-role-paths.mjs'),
  );
  await cp(
    rolePathsPath,
    path.join(repository, 'scripts/foundation/role-paths.mjs'),
  );
  await cp(
    operatingPolicyPath,
    path.join(repository, 'docs/runbooks/operating-policy.json'),
  );
  await writeFile(path.join(repository, 'README.md'), 'base\n');
  await git(repository, 'add', '.');
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

async function commitSymlink(
  repository: string,
  relativePath: string,
  target: string,
) {
  const absolutePath = path.join(repository, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await symlink(target, absolutePath);
  await git(repository, 'add', relativePath);
  await git(repository, 'commit', '--quiet', '-m', `add ${relativePath}`);
}

async function runChecker(repository: string, role: string, base: string) {
  const args = [
    path.join(repository, 'scripts/foundation/check-role-paths.mjs'),
    role,
    '--base',
    base,
  ];
  if (role === 'claude-review') {
    args.push('--allowed-path', 'reviews/releases/SBLA-test-r1.md');
  }

  return execFileAsync(process.execPath, args, {
    cwd: repository,
    encoding: 'utf8',
  });
}

async function runTrustedChecker(
  repository: string,
  role: string,
  base: string,
  allowedPath = role === 'claude-review'
    ? 'reviews/releases/SBLA-test-r1.md'
    : undefined,
) {
  const args = [checkerPath, role, '--base', base, '--repository', repository];
  if (allowedPath) args.push('--allowed-path', allowedPath);

  return execFileAsync(process.execPath, args, { encoding: 'utf8' });
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

  it('requires an exact claimed path for Claude Review', async () => {
    const { repository, base } = await createRepository();
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      execFileAsync(
        process.execPath,
        [
          checkerPath,
          'claude-review',
          '--base',
          base,
          '--repository',
          repository,
        ],
        { encoding: 'utf8' },
      ),
    ).rejects.toMatchObject({
      code: 2,
      stderr: expect.stringContaining(
        'Claude Review requires exactly one --allowed-path',
      ),
    });
  });

  it('rejects modification of an existing review report even when it is the claimed path', async () => {
    const { repository } = await createRepository();
    await commitFile(
      repository,
      'reviews/releases/SBLA-test-r1.md',
      'original\n',
    );
    const base = (await git(repository, 'rev-parse', 'HEAD')).stdout.trim();
    await commitFile(
      repository,
      'reviews/releases/SBLA-test-r1.md',
      'changed\n',
    );

    await expect(
      runTrustedChecker(
        repository,
        'claude-review',
        base,
        'reviews/releases/SBLA-test-r1.md',
      ),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'Claude Review must add a new report instead of modifying',
      ),
    });
  });

  it('rejects changes outside the exact claimed review path even under reviews', async () => {
    const { repository } = await createRepository();
    await commitFile(
      repository,
      'reviews/releases/SBLA-002-handoff.md',
      'original handoff\n',
    );
    const base = (await git(repository, 'rev-parse', 'HEAD')).stdout.trim();
    await commitFile(
      repository,
      'reviews/releases/SBLA-002-handoff.md',
      'modified handoff\n',
    );
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runTrustedChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'Claude Review path is outside the exact claim: reviews/releases/SBLA-002-handoff.md',
      ),
    });
  });

  it('rejects a symlink committed at the exact claimed review path', async () => {
    const { repository, base } = await createRepository();
    await commitSymlink(
      repository,
      'reviews/releases/SBLA-test-r1.md',
      '../../AGENTS.md',
    );

    await expect(
      runTrustedChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'restricted roles may add only regular files: reviews/releases/SBLA-test-r1.md has mode 120000',
      ),
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

  it('rejects same-commit policy self-authorization using the trusted base policy', async () => {
    const { repository, base } = await createRepository();
    const policyPath = path.join(
      repository,
      'docs/runbooks/operating-policy.json',
    );
    const policy = JSON.parse(await readFile(policyPath, 'utf8'));
    policy.writeBoundaries['claude-review'] = [''];
    await commitFile(
      repository,
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );
    await commitFile(repository, 'src/pages/index.astro');
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'role claude-review may not write: docs/runbooks/operating-policy.json',
      ),
    });
  });

  it('lets a trusted checkout validate a target repository even when its checker is modified', async () => {
    const { repository, base } = await createRepository();
    await commitFile(
      repository,
      'scripts/foundation/check-role-paths.mjs',
      'console.log("bypassed");\n',
    );
    await commitFile(repository, 'src/pages/index.astro');
    await commitFile(repository, 'reviews/releases/SBLA-test-r1.md');

    await expect(
      runTrustedChecker(repository, 'claude-review', base),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(
        'role claude-review may not write: scripts/foundation/check-role-paths.mjs',
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
