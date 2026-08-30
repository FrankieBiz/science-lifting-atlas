import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { ROLE_WRITE_BOUNDARIES, validateRolePaths } from './role-paths.mjs';

const execFileAsync = promisify(execFile);
const [
  role,
  baseFlag,
  baseCommit,
  repositoryFlag,
  repositoryArgument,
  ...unexpectedArguments
] = process.argv.slice(2);
const roles = Object.keys(ROLE_WRITE_BOUNDARIES).join(', ');
const hasRepositoryArgument = repositoryFlag !== undefined;

if (
  !role ||
  baseFlag !== '--base' ||
  !baseCommit ||
  (hasRepositoryArgument &&
    (repositoryFlag !== '--repository' || !repositoryArgument)) ||
  unexpectedArguments.length > 0
) {
  console.error(
    'Usage: node scripts/foundation/check-role-paths.mjs <role> --base <commit-sha> [--repository <worktree-path>]',
  );
  console.error(`Known roles: ${roles}`);
  process.exit(2);
}

const repositoryPath = repositoryArgument
  ? path.resolve(repositoryArgument)
  : process.cwd();

/** @param {string[]} arguments_ */
function git(arguments_) {
  return execFileAsync('git', arguments_, {
    cwd: repositoryPath,
    encoding: 'utf8',
  });
}

if (!/^[0-9a-f]{7,40}$/i.test(baseCommit)) {
  console.error('Base commit must be a 7-40 character hexadecimal Git SHA.');
  process.exit(2);
}

try {
  await git(['rev-parse', '--verify', `${baseCommit}^{commit}`]);
} catch {
  console.error(`Base commit does not resolve to a commit: ${baseCommit}`);
  process.exit(2);
}

try {
  await git(['merge-base', '--is-ancestor', baseCommit, 'HEAD']);
} catch {
  console.error(`Base commit must be an ancestor of HEAD: ${baseCommit}`);
  process.exit(2);
}

let basePolicy;
try {
  const policySource = await git([
    'show',
    `${baseCommit}:docs/runbooks/operating-policy.json`,
  ]);
  basePolicy = JSON.parse(policySource.stdout);
} catch {
  console.error(
    `Trusted base policy could not be loaded: ${baseCommit}:docs/runbooks/operating-policy.json`,
  );
  process.exit(2);
}

const baseWriteBoundaries = basePolicy?.writeBoundaries;
if (
  JSON.stringify(baseWriteBoundaries) !== JSON.stringify(ROLE_WRITE_BOUNDARIES)
) {
  console.error(
    'Trusted base policy write boundaries do not match the immutable checker contract.',
  );
  process.exit(2);
}

const status = await git([
  'status',
  '--porcelain=v1',
  '-z',
  '--untracked-files=all',
]);

if (status.stdout.length > 0) {
  console.error(
    'Role path boundary requires a clean worktree so no changed path can be omitted.',
  );
  process.exit(2);
}

const changedPathOutput = await git([
  'diff',
  '--name-only',
  '-z',
  '--no-renames',
  '--diff-filter=ACDMRTUXB',
  `${baseCommit}...HEAD`,
  '--',
]);
const changedPaths = changedPathOutput.stdout.split('\0').filter(Boolean);

if (changedPaths.length === 0) {
  console.error(
    'Role path boundary found no changed paths to evaluate; the readiness simulation has not produced a committed artifact.',
  );
  process.exit(1);
}

const issues = validateRolePaths({
  role,
  changedPaths,
  writeBoundaries: baseWriteBoundaries,
});

if (issues.length > 0) {
  console.error('Role path boundary failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Role path boundary passed: trusted base policy allows ${role} to write all ${changedPaths.length} changed path(s) from ${baseCommit}...HEAD in ${repositoryPath}.`,
  );
}
