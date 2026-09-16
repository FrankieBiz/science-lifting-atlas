import { realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse as parseYaml } from 'yaml';

import { validateRecord } from '../../src/lib/content/schemas.ts';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

export const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

const RECORD_ROOTS = ['content', 'research/packets', 'reviews/evidence'];
const CROSS_LINK_ROOTS = ['content', 'content-drafts', 'research', 'reviews'];
/** @type {ReadonlyArray<readonly [string, import('../../src/lib/content/schemas.ts').RecordKind]>} */
const KIND_BY_PREFIX = [
  ['content/claims/', 'claim'],
  ['content/sources/', 'source'],
  ['content/muscles/', 'muscle'],
  ['content/exercises/', 'exercise'],
  ['content/approval-manifests/', 'approvalManifest'],
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

/** @param {unknown} input */
function collectCrossLinks(input) {
  /** @type {Array<{field: string, target: string}>} */
  const links = [];
  const visited = new WeakSet();

  /** @param {unknown} value @param {string} location */
  function visit(value, location) {
    if (!value || typeof value !== 'object' || visited.has(value)) return;
    visited.add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${location}[${index}]`));
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      const childLocation = location ? `${location}.${key}` : key;
      if (key === 'crossLinks' && child && typeof child === 'object') {
        for (const [linkName, target] of Object.entries(child)) {
          if (typeof target === 'string') {
            links.push({
              field: `${childLocation}.${linkName}`,
              target,
            });
          }
        }
      }
      visit(child, childLocation);
    }
  }

  visit(input, '');
  return links;
}

/** @param {string} value */
function crossLinkPath(value) {
  const withoutQueryOrFragment = value.split(/[?#]/, 1)[0] ?? '';
  return withoutQueryOrFragment.replace(
    /@\d+\.\d+\.\d+(?:[-+][a-z0-9.-]+)?$/i,
    '',
  );
}

/**
 * Resolve a repository-relative path one segment at a time. This deliberately
 * does not use existsSync: case-insensitive filesystems would hide casing
 * mistakes that fail on static Linux hosting.
 *
 * @param {string} root
 * @param {string} relativePath
 */
async function resolveExactRepositoryPath(root, relativePath) {
  const normalized = relativePath.replaceAll('\\', '/');
  if (
    normalized !== relativePath ||
    path.posix.isAbsolute(normalized) ||
    /^[a-z]:/i.test(normalized)
  ) {
    return { state: 'invalid', actualPath: null };
  }

  const segments = normalized.split('/');
  if (
    segments.length === 0 ||
    segments.some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    return { state: 'invalid', actualPath: null };
  }

  let current = root;
  const actualSegments = [];
  for (const segment of segments) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return { state: 'missing', actualPath: null };
    }

    const exact = entries.find((entry) => entry.name === segment);
    if (exact) {
      actualSegments.push(exact.name);
      current = path.join(current, exact.name);
      continue;
    }

    const differentlyCased = entries.find(
      (entry) => entry.name.toLowerCase() === segment.toLowerCase(),
    );
    if (differentlyCased) {
      actualSegments.push(differentlyCased.name);
      return {
        state: 'case-mismatch',
        actualPath: [
          ...actualSegments,
          ...segments.slice(actualSegments.length),
        ].join('/'),
      };
    }
    return { state: 'missing', actualPath: null };
  }

  return { state: 'exact', actualPath: actualSegments.join('/') };
}

/**
 * @param {string} root
 * @param {Array<import('../../src/lib/content/schemas.ts').ApprovalManifestRecord>} manifests
 */
export async function validateRequiredReviewArtifacts(root, manifests) {
  const issues = [];

  for (const manifest of manifests) {
    for (const review of manifest.requiredReviews) {
      const resolution = await resolveExactRepositoryPath(root, review.path);
      const issuePath = `${manifest.id}.requiredReviews.${review.id}`;

      if (resolution.state !== 'exact' || !resolution.actualPath) {
        issues.push(
          issue(
            resolution.state === 'case-mismatch'
              ? 'MANIFEST_REVIEW_PATH_CASE_MISMATCH'
              : 'MANIFEST_REVIEW_PATH_MISSING',
            issuePath,
            resolution.state === 'case-mismatch'
              ? `Required review ${review.path} differs from tracked path ${resolution.actualPath} by letter case.`
              : `Required review ${review.path} does not resolve to an exact repository path.`,
            resolution.state === 'case-mismatch'
              ? `Use the exact repository casing ${resolution.actualPath}.`
              : 'Add the immutable review artifact at the recorded path or correct the manifest.',
          ),
        );
        continue;
      }

      const absolutePath = path.join(root, resolution.actualPath);
      const stats = await lstat(absolutePath);
      if (!stats.isFile()) {
        issues.push(
          issue(
            'MANIFEST_REVIEW_NOT_REGULAR_FILE',
            issuePath,
            `Required review ${review.path} is not a regular file.`,
            'Replace it with the checked-in immutable review report.',
          ),
        );
        continue;
      }

      const checksum = createHash('sha256')
        .update(await readFile(absolutePath))
        .digest('hex');
      if (checksum !== review.checksum) {
        issues.push(
          issue(
            'MANIFEST_REVIEW_CHECKSUM_MISMATCH',
            issuePath,
            `Required review ${review.path} does not match checksum ${review.checksum}.`,
            'Record the exact immutable review checksum and obtain owner approval for a new manifest.',
          ),
        );
      }
    }
  }

  return issues;
}

/** @param {string} root */
async function validateCrossLinks(root) {
  const paths = (
    await Promise.all(
      CROSS_LINK_ROOTS.map((crossLinkRoot) =>
        listRelativeFiles(path.join(root, crossLinkRoot), root),
      ),
    )
  ).flat();
  const issues = [];

  for (const relativePath of [...new Set(paths)].sort()) {
    const extension = path.extname(relativePath).toLowerCase();
    if (!RECORD_EXTENSIONS.has(extension)) continue;

    let input;
    try {
      input = parseRecordText(
        relativePath,
        await readFile(path.join(root, relativePath), 'utf8'),
      );
    } catch {
      continue;
    }

    for (const link of collectCrossLinks(input)) {
      const target = crossLinkPath(link.target);
      const resolution = await resolveExactRepositoryPath(root, target);
      if (resolution.state === 'exact') continue;

      const issuePath = `${relativePath}:${link.field}`;
      if (resolution.state === 'case-mismatch') {
        issues.push(
          issue(
            'CROSS_LINK_CASE_MISMATCH',
            issuePath,
            `Cross-link target ${target} differs from tracked path ${resolution.actualPath} by letter case.`,
            `Use the exact repository casing ${resolution.actualPath}.`,
          ),
        );
      } else if (resolution.state === 'invalid') {
        issues.push(
          issue(
            'CROSS_LINK_PATH_INVALID',
            issuePath,
            `Cross-link target ${link.target} is not a normalized repository-relative path.`,
            'Use a forward-slash repository-relative path, optionally followed by @<semantic-version>.',
          ),
        );
      } else {
        issues.push(
          issue(
            'CROSS_LINK_TARGET_MISSING',
            issuePath,
            `Cross-link target ${target} does not exist in the repository.`,
            'Create the target at the recorded path or correct the cross-link.',
          ),
        );
      }
    }
  }

  return issues;
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

  issues.push(
    ...(await validateRequiredReviewArtifacts(
      root,
      records
        .filter((record) => record.kind === 'approvalManifest')
        .map((record) => record.data),
    )),
  );

  issues.push(...(await validateCrossLinks(root)));

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
