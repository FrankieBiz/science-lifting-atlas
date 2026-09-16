import { createHash } from 'node:crypto';

export function compareCodepoint(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => compareCodepoint(left, right))
      .map(([key, child]) => [key, canonicalize(child)]),
  );
}

export function canonicalJson(value: unknown) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

export function recordChecksum(value: unknown) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

/**
 * Compute the checksum stored by an approvable record. The checksum field is
 * normalized to null so the digest can be reproduced after the digest itself
 * has been written into the record. Every other field remains covered.
 */
export function recordContentChecksum(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return recordChecksum(value);
  }
  return recordChecksum({
    ...(value as Record<string, unknown>),
    contentChecksum: null,
  });
}
