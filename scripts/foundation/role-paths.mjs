import path from 'node:path';

import operatingPolicy from '../../docs/runbooks/operating-policy.json' with { type: 'json' };

/**
 * Write boundaries from master plan sections 13.3, 13.4, and 13.7.
 * `null` means unrestricted. Every other role is confined to the listed
 * directory prefixes, and anything not listed is denied.
 *
 * @type {Readonly<Record<string, readonly string[] | null>>}
 */
export const ROLE_WRITE_BOUNDARIES = Object.freeze(
  Object.fromEntries(
    Object.entries(operatingPolicy.writeBoundaries).map(([role, prefixes]) => [
      role,
      prefixes === null ? null : Object.freeze([...prefixes]),
    ]),
  ),
);

/** @param {string} changedPath */
function normalize(changedPath) {
  const portablePath = changedPath.replaceAll('\\', '/');
  if (
    !portablePath ||
    portablePath.includes('\0') ||
    path.posix.isAbsolute(portablePath) ||
    /^[A-Za-z]:\//.test(portablePath)
  ) {
    return null;
  }

  const normalized = path.posix.normalize(portablePath);
  if (normalized === '..' || normalized.startsWith('../')) return null;
  return normalized.replace(/^\.\/+/, '');
}

/**
 * @typedef {object} RolePathsInput
 * @property {string} role
 * @property {readonly string[]} changedPaths
 */

/** @param {RolePathsInput} input */
export function validateRolePaths({ role, changedPaths }) {
  if (!Object.hasOwn(ROLE_WRITE_BOUNDARIES, role)) {
    return [`unknown role: ${role}`];
  }

  // `hasOwn` above guarantees the key exists, so the only falsy value that
  // reaches here is the `null` unrestricted marker.
  const allowedPrefixes = ROLE_WRITE_BOUNDARIES[role];
  if (!allowedPrefixes) return [];

  const issues = [];

  for (const changedPath of changedPaths) {
    const normalized = normalize(changedPath);
    if (!normalized) {
      issues.push(`invalid repository-relative path: ${changedPath}`);
      continue;
    }

    const allowed = allowedPrefixes.some((prefix) =>
      normalized.startsWith(prefix),
    );

    if (!allowed) {
      issues.push(`role ${role} may not write: ${normalized}`);
    }
  }

  return issues;
}
