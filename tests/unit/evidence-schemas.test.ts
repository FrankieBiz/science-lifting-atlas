import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  RECORD_KINDS,
  validateRecord,
  type RecordKind,
} from '../../src/lib/content/schemas';

const fixtureUrl = new URL('../fixtures/evidence-schemas/', import.meta.url);

async function readJson<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(new URL(name, fixtureUrl), 'utf8')) as T;
}

function setPath(target: unknown, dottedPath: string, value: unknown) {
  const parts = dottedPath.split('.');
  let cursor = target as Record<string, unknown>;
  for (const part of parts.slice(0, -1)) {
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts.at(-1)!] = value;
}

describe('SBLA-007 evidence record schemas', () => {
  it('publishes the five required record kinds', () => {
    expect(RECORD_KINDS).toEqual([
      'claim',
      'source',
      'evidencePacket',
      'review',
      'changeRecord',
    ]);
  });

  it('accepts every canonical valid fixture', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');

    for (const kind of RECORD_KINDS) {
      expect(validateRecord(kind, fixtures[kind]), kind).toMatchObject({
        success: true,
      });
    }
  });

  it('rejects every one-field invalid fixture at the documented path', async () => {
    const valid =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const cases = await readJson<
      Array<{
        name: string;
        kind: RecordKind;
        path: string;
        value: unknown;
        expectedPath: string;
      }>
    >('records.invalid.json');

    for (const testCase of cases) {
      const record = structuredClone(valid[testCase.kind]);
      setPath(record, testCase.path, testCase.value);
      const result = validateRecord(testCase.kind, record);
      expect(result.success, testCase.name).toBe(false);
      if (result.success) continue;
      expect(
        result.issues.map((issue) => issue.path).join('\n'),
        testCase.name,
      ).toContain(testCase.expectedPath);
      expect(result.issues.every((issue) => issue.remediation.length > 0)).toBe(
        true,
      );
    }
  });
});
