import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { ROLE_WRITE_BOUNDARIES, validateRolePaths } from './role-paths.mjs';

const execFileAsync = promisify(execFile);
const arguments_ = process.argv.slice(2);
const role = arguments_.shift();
const roles = Object.keys(ROLE_WRITE_BOUNDARIES).join(', ');
let baseCommit;
let repositoryArgument;
const allowedPaths = [];
let invalidArguments = false;

while (arguments_.length > 0) {
  const flag = arguments_.shift();
  const value = arguments_.shift();

  if (!value) {
    invalidArguments = true;
    break;
  }

  if (flag === '--base' && !baseCommit) {
    baseCommit = value;
  } else if (flag === '--repository' && !repositoryArgument) {
    repositoryArgument = value;
  } else if (flag === '--allowed-path') {
    allowedPaths.push(value);
  } else {
    invalidArguments = true;
    break;
  }
}

if (!role || !baseCommit || invalidArguments) {
  console.error(
    'Usage: node scripts/foundation/check-role-paths.mjs <role> --base <commit-sha> [--repository <worktree-path>] [--allowed-path <exact-path>]',
  );
  console.error(`Known roles: ${roles}`);
  process.exit(2);
}

if (role === 'claude-review' && allowedPaths.length !== 1) {
  console.error('Claude Review requires exactly one --allowed-path.');
  process.exit(2);
}

if (role !== 'claude-review' && allowedPaths.length > 0) {
  console.error('--allowed-path is reserved for exact Claude Review claims.');
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

if (
  basePolicy?.lifecycle?.reviewClaimScope !== 'exact-append-only-report-path'
) {
  console.error(
    'Trusted base policy must require an exact append-only Claude Review report path.',
  );
  process.exit(2);
}

if (role === 'claude-review') {
  const claimIssues = validateRolePaths({
    role,
    changedPaths: allowedPaths,
    writeBoundaries: baseWriteBoundaries,
  });
  if (claimIssues.length > 0) {
    console.error('Claude Review exact claim is invalid:');
    for (const issue of claimIssues) console.error(`- ${issue}`);
    process.exit(2);
  }
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

const changedEntryOutput = await git([
  'diff',
  '--raw',
  '-z',
  '--no-renames',
  '--diff-filter=ACDMRTUXB',
  `${baseCommit}...HEAD`,
  '--',
]);
const rawTokens = changedEntryOutput.stdout.split('\0').filter(Boolean);
const changedEntries = [];

for (let index = 0; index < rawTokens.length; index += 2) {
  const header = rawTokens[index];
  const changedPath = rawTokens[index + 1];

  if (!header || !changedPath) {
    console.error('Role path boundary could not parse the complete Git diff.');
    process.exit(2);
  }

  const match = /^:(\d{6}) (\d{6}) [0-9a-f]+ [0-9a-f]+ ([ACDMRTUXB])$/i.exec(
    header,
  );
  const oldMode = match?.[1];
  const newMode = match?.[2];
  const status = match?.[3];

  if (!oldMode || !newMode || !status) {
    console.error('Role path boundary could not parse the complete Git diff.');
    process.exit(2);
  }

  changedEntries.push({
    oldMode,
    newMode,
    status: status.toUpperCase(),
    path: changedPath,
  });
}

const changedPaths = changedEntries.map((entry) => entry.path);

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

const isRestrictedRole = baseWriteBoundaries[role] !== null;
if (isRestrictedRole) {
  for (const entry of changedEntries) {
    if (
      entry.newMode !== '000000' &&
      entry.newMode !== '100644' &&
      entry.newMode !== '100755'
    ) {
      issues.push(
        `restricted roles may add only regular files: ${entry.path} has mode ${entry.newMode}`,
      );
    }
  }
}

if (role === 'claude-review') {
  const allowedPath = allowedPaths[0];
  if (!allowedPath) {
    console.error('Claude Review requires exactly one --allowed-path.');
    process.exit(2);
  }

  for (const entry of changedEntries) {
    if (entry.path !== allowedPath) {
      issues.push(
        `Claude Review path is outside the exact claim: ${entry.path}`,
      );
    }
    if (entry.status !== 'A') {
      issues.push(
        `Claude Review must add a new report instead of modifying: ${entry.path}`,
      );
    }
  }

  if (!changedPaths.includes(allowedPath)) {
    issues.push(
      `Claude Review did not produce the exact claimed path: ${allowedPath}`,
    );
  }
}

if (issues.length > 0) {
  console.error('Role path boundary failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Role path boundary passed: trusted base policy allows ${role} to write all ${changedPaths.length} changed path(s) from ${baseCommit}...HEAD in ${repositoryPath}.`,
  );
}
