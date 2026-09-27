import { execFile, spawn } from 'node:child_process';
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import {
  TASK_ID_PATTERN,
  buildHandoffDocument,
  parseNameStatus,
  renderGeneratedSections,
  tailLines,
} from './handoff-facts.mjs';

const execFileAsync = promisify(execFile);
const usage =
  'Usage: pnpm handoff <task-id> --base <commit> [--title <title>] [--run "<command>"]... [--write]';

const arguments_ = process.argv.slice(2);
const taskId = arguments_.shift();
let baseArgument;
let title = '<title>';
let write = false;
/** @type {string[]} */
const commands = [];

while (arguments_.length > 0) {
  const flag = arguments_.shift();
  if (flag === '--write') {
    write = true;
    continue;
  }
  const value = arguments_.shift();
  if (!value) {
    console.error(usage);
    process.exit(2);
  }
  if (flag === '--base') baseArgument = value;
  else if (flag === '--title') title = value;
  else if (flag === '--run') commands.push(value);
  else {
    console.error(usage);
    process.exit(2);
  }
}

if (!taskId || !TASK_ID_PATTERN.test(taskId) || !baseArgument) {
  console.error(usage);
  process.exit(2);
}

/** @param {string[]} gitArguments */
async function git(gitArguments) {
  const { stdout } = await execFileAsync('git', gitArguments, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout;
}

/** @param {string} command */
function runCheck(command) {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, env: process.env });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) =>
      resolve({ command, exitCode: code ?? 1, outputTail: tailLines(output) }),
    );
  });
}

const baseCommit = (
  await git(['rev-parse', '--verify', `${baseArgument}^{commit}`])
).trim();
try {
  await git(['merge-base', '--is-ancestor', baseCommit, 'HEAD']);
} catch {
  console.error(`Base commit must be an ancestor of HEAD: ${baseCommit}`);
  process.exit(2);
}

const checks = [];
for (const command of commands) {
  console.error(`Running: ${command}`);
  checks.push(await runCheck(command));
}

const { stdout: pnpmVersion } = await execFileAsync('pnpm', ['--version'], {
  encoding: 'utf8',
});

const facts = {
  taskId,
  branch: (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).trim(),
  baseCommit,
  headCommit: (await git(['rev-parse', 'HEAD'])).trim(),
  headTree: (await git(['rev-parse', 'HEAD^{tree}'])).trim(),
  worktreeClean: (await git(['status', '--porcelain'])).trim() === '',
  nodeVersion: process.version,
  pnpmVersion: pnpmVersion.trim(),
  changedPaths: parseNameStatus(
    await git([
      'diff',
      '--name-status',
      '--no-renames',
      '-z',
      `${baseCommit}...HEAD`,
    ]),
  ),
  checks,
};

if (write) {
  const target = path.join('reviews/releases', `${taskId}-handoff.md`);
  const exists = await access(target).then(
    () => true,
    () => false,
  );
  if (exists) {
    console.error(`Refusing to overwrite an existing handoff: ${target}`);
    process.exit(2);
  }
  const template = await readFile('docs/runbooks/handoff-template.md', 'utf8');
  await writeFile(target, buildHandoffDocument(template, facts, title));
  console.log(`Wrote ${target}. Fill every section not marked as generated.`);
} else {
  for (const [heading, content] of Object.entries(
    renderGeneratedSections(facts),
  )) {
    console.log(`${heading}\n\n${content}\n`);
  }
}

if (checks.some((check) => check.exitCode !== 0)) process.exitCode = 1;
