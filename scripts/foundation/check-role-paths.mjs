import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { ROLE_WRITE_BOUNDARIES, validateRolePaths } from './role-paths.mjs';

const execFileAsync = promisify(execFile);
const [role, baseFlag, baseCommit, ...unexpectedArguments] =
  process.argv.slice(2);
const roles = Object.keys(ROLE_WRITE_BOUNDARIES).join(', ');

if (
  !role ||
  baseFlag !== '--base' ||
  !baseCommit ||
  unexpectedArguments.length > 0
) {
  console.error(
    'Usage: node scripts/foundation/check-role-paths.mjs <role> --base <commit-sha>',
  );
  console.error(`Known roles: ${roles}`);
  process.exit(2);
}

if (!/^[0-9a-f]{7,40}$/i.test(baseCommit)) {
  console.error('Base commit must be a 7-40 character hexadecimal Git SHA.');
  process.exit(2);
}

try {
  await execFileAsync(
    'git',
    ['rev-parse', '--verify', `${baseCommit}^{commit}`],
    { encoding: 'utf8' },
  );
} catch {
  console.error(`Base commit does not resolve to a commit: ${baseCommit}`);
  process.exit(2);
}

try {
  await execFileAsync(
    'git',
    ['merge-base', '--is-ancestor', baseCommit, 'HEAD'],
    { encoding: 'utf8' },
  );
} catch {
  console.error(`Base commit must be an ancestor of HEAD: ${baseCommit}`);
  process.exit(2);
}

const status = await execFileAsync(
  'git',
  ['status', '--porcelain=v1', '-z', '--untracked-files=all'],
  { encoding: 'utf8' },
);

if (status.stdout.length > 0) {
  console.error(
    'Role path boundary requires a clean worktree so no changed path can be omitted.',
  );
  process.exit(2);
}

const changedPathOutput = await execFileAsync(
  'git',
  [
    'diff',
    '--name-only',
    '-z',
    '--no-renames',
    '--diff-filter=ACDMRTUXB',
    `${baseCommit}...HEAD`,
    '--',
  ],
  { encoding: 'utf8' },
);
const changedPaths = changedPathOutput.stdout.split('\0').filter(Boolean);

if (changedPaths.length === 0) {
  console.error(
    'Role path boundary found no changed paths to evaluate; the readiness simulation has not produced a committed artifact.',
  );
  process.exit(1);
}

const issues = validateRolePaths({ role, changedPaths });

if (issues.length > 0) {
  console.error('Role path boundary failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Role path boundary passed: ${role} may write all ${changedPaths.length} changed path(s) from ${baseCommit}...HEAD.`,
  );
}
