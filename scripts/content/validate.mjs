import { realpathSync } from 'node:fs';
import { lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse as parseYaml } from 'yaml';

import { validateRecord } from '../../src/lib/content/schemas.ts';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

export const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

const RECORD_ROOTS = [
  'content',
  'content-drafts',
  'research/packets',
  'reviews/evidence',
];
/** @type {ReadonlyArray<readonly [string, import('../../src/lib/content/schemas.ts').RecordKind]>} */
const KIND_BY_PREFIX = [
  ['content/claims/', 'claim'],
  ['content/sources/', 'source'],
  ['content/changes/', 'changeRecord'],
  ['research/packets/', 'evidencePacket'],
  ['reviews/evidence/', 'review'],
];
const RECORD_EXTENSIONS = new Set(['.json', '.yaml', '.yml']);

/** @param {string} relativePath */
function isIgnored(relativePath) {
  const fileName = path.posix.basename(relativePath);
  return (
    fileName.startsWith('.') ||
    fileName.toLowerCase() === 'readme.md' ||
    (relativePath.startsWith('research/packets/') &&
      fileName.endsWith('-handoff.md')) ||
    (relativePath.startsWith('reviews/evidence/') &&
      /-r[1-9]\d*\.md$/i.test(fileName))
  );
}

/** @param {string} relativePath */
function kindForPath(relativePath) {
  return KIND_BY_PREFIX.find(([prefix]) =>
    relativePath.startsWith(prefix),
  )?.[1];
}

/**
 * @param {string} code
 * @param {string} relativePath
 * @param {string} message
 * @param {string} remediation
 */
function issue(code, relativePath, message, remediation) {
  return { code, path: relativePath, message, remediation };
}

/** @param {string} relativePath @param {string} contents */
function parseRecordText(relativePath, contents) {
  return path.extname(relativePath).toLowerCase() === '.json'
    ? JSON.parse(contents)
    : parseYaml(contents);
}

export async function loadAndValidateRecords(root = repositoryRoot) {
  const paths = (
    await Promise.all(
      RECORD_ROOTS.map((recordRoot) =>
        listRelativeFiles(path.join(root, recordRoot), root),
      ),
    )
  ).flat();
  /** @type {Array<{code: string, path: string, message: string, remediation: string}>} */
  const issues = [];
  /** @type {Array<{kind: import('../../src/lib/content/schemas.ts').RecordKind, path: string, data: any}>} */
  const records = [];

  for (const relativePath of [...new Set(paths)].sort()) {
    if (isIgnored(relativePath)) continue;

    const absolutePath = path.join(root, relativePath);
    const stats = await lstat(absolutePath);
    if (!stats.isFile()) {
      issues.push(
        issue(
          'RECORD_NOT_REGULAR_FILE',
          relativePath,
          'Record paths must be regular files; links and special entries are rejected.',
          'Replace the entry with a checked-in regular JSON or YAML record.',
        ),
      );
      continue;
    }

    const extension = path.extname(relativePath).toLowerCase();
    if (!RECORD_EXTENSIONS.has(extension)) {
      issues.push(
        issue(
          'RECORD_EXTENSION_UNSUPPORTED',
          relativePath,
          `Unsupported record extension ${extension || '(none)'}.`,
          'Use .json, .yaml, or .yml for structured records.',
        ),
      );
      continue;
    }

    const kind = kindForPath(relativePath);
    if (!kind) {
      issues.push(
        issue(
          'RECORD_KIND_UNSUPPORTED',
          relativePath,
          'This repository path does not yet have an accepted record schema.',
          'Move the record to its canonical supported directory or complete the queue task that owns its schema.',
        ),
      );
      continue;
    }

    let input;
    try {
      input = parseRecordText(
        relativePath,
        await readFile(absolutePath, 'utf8'),
      );
    } catch (error) {
      issues.push(
        issue(
          'RECORD_PARSE_FAILED',
          relativePath,
          error instanceof Error
            ? error.message
            : 'The record could not be parsed.',
          'Correct the JSON or YAML syntax and rerun content validation.',
        ),
      );
      continue;
    }

    const result = validateRecord(kind, input);
    if (!result.success) {
      issues.push(
        ...result.issues.map((recordIssue) => ({
          ...recordIssue,
          path: recordIssue.path
            ? `${relativePath}:${recordIssue.path}`
            : relativePath,
        })),
      );
      continue;
    }

    const expectedId = path.basename(relativePath, extension);
    if (result.data.id !== expectedId) {
      issues.push(
        issue(
          'RECORD_PATH_ID_MISMATCH',
          relativePath,
          `Record ID ${result.data.id} does not match filename ${expectedId}.`,
          `Rename the file to ${result.data.id}${extension} or correct the record ID before publication.`,
        ),
      );
      continue;
    }

    records.push({ kind, path: relativePath, data: result.data });
  }

  return { records, issues };
}

/**
 * @param {string} label
 * @param {Array<{code: string, path: string, message: string, remediation: string}>} issues
 */
export function printIssues(label, issues) {
  console.error(`${label} failed:`);
  for (const recordIssue of issues) {
    console.error(
      `- [${recordIssue.code}] ${recordIssue.path}: ${recordIssue.message} Remediation: ${recordIssue.remediation}`,
    );
  }
}

async function main() {
  const result = await loadAndValidateRecords();
  if (result.issues.length > 0) {
    printIssues('Content validation', result.issues);
    process.exitCode = 1;
  } else {
    console.log(`Content validation passed: ${result.records.length} records.`);
  }
}

const invokedPath = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) await main();
