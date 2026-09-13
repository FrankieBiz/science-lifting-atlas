import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  RECORD_KINDS,
  validateRecord,
  type ClaimRecord,
  type EvidencePacketRecord,
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

  it('represents a preprint without discarding its study design', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const source = structuredClone(fixtures.source) as Record<string, unknown>;
    const publication = source.publication as Record<string, unknown>;

    source.type = 'randomized-trial';
    publication.stage = 'preprint';

    expect(validateRecord('source', source)).toMatchObject({ success: true });
  });

  it('requires every source to state its publication stage', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const source = structuredClone(fixtures.source) as Record<string, unknown>;
    const publication = source.publication as Record<string, unknown>;

    delete publication.stage;

    const result = validateRecord('source', source);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.issues.map((issue) => issue.path)).toContain(
      'publication.stage',
    );
  });

  it('orders fractional-second timestamps by instant for entity history', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const claim = structuredClone(fixtures.claim) as ClaimRecord;

    claim.history.createdAt = '2026-09-01T12:00:00.500Z';
    claim.history.updatedAt = '2026-09-01T12:00:00Z';
    expect(validateRecord('claim', claim).success).toBe(false);

    claim.history.createdAt = '2026-09-01T12:00:00Z';
    claim.history.updatedAt = '2026-09-01T12:00:00.500Z';
    expect(validateRecord('claim', claim).success).toBe(true);
  });

  it('orders fractional-second timestamps by instant for evidence packets', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const packet = structuredClone(
      fixtures.evidencePacket,
    ) as EvidencePacketRecord;

    packet.createdAt = '2026-09-01T12:00:00.500Z';
    packet.updatedAt = '2026-09-01T12:00:00Z';
    expect(validateRecord('evidencePacket', packet).success).toBe(false);

    packet.createdAt = '2026-09-01T12:00:00Z';
    packet.updatedAt = '2026-09-01T12:00:00.500Z';
    expect(validateRecord('evidencePacket', packet).success).toBe(true);
  });

  it('requires own checksum entries for every review target', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const review = structuredClone(fixtures.review) as Record<string, unknown>;
    review.targetIds = ['constructor'];
    review.targetChecksums = {};

    const result = validateRecord('review', review);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.issues.map((issue) => issue.path)).toContain(
      'targetChecksums',
    );
  });

  it('rejects duplicate packet and change-record identifier lists', async () => {
    const fixtures =
      await readJson<Record<RecordKind, unknown>>('records.valid.json');
    const packet = structuredClone(fixtures.evidencePacket) as Record<
      string,
      unknown
    >;
    packet.includedSourceIds = ['source-one', 'source-one'];
    expect(validateRecord('evidencePacket', packet).success).toBe(false);

    const changeRecord = structuredClone(fixtures.changeRecord) as Record<
      string,
      unknown
    >;
    changeRecord.affectedIds = ['claim-one', 'claim-one'];
    expect(validateRecord('changeRecord', changeRecord).success).toBe(false);
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

  it('documents every public authoring issue code', async () => {
    const guide = await readFile(
      new URL(
        '../../docs/authoring/evidence-record-errors.md',
        import.meta.url,
      ),
      'utf8',
    );
    const issueCodes = [
      'AS_OF_INVALID',
      'CERTAINTY_OVERSTATED',
      'CERTAINTY_UNIVERSAL',
      'HYPOTHESIS_DISCLOSURE_REQUIRED',
      'ID_DUPLICATE',
      'OUTCOME_REQUIRED',
      'PUBLISHED_CLAIM_UNSOURCED',
      'PUBLIC_RELATIONSHIP_CLAIM_UNPUBLISHED',
      'PUBLIC_RELATIONSHIP_UNCITED',
      'RECORD_EXTENSION_UNSUPPORTED',
      'RECORD_KIND_UNSUPPORTED',
      'RECORD_NOT_REGULAR_FILE',
      'RECORD_PARSE_FAILED',
      'RECORD_PATH_ID_MISMATCH',
      'REFERENCE_MISSING',
      'REVIEW_DATE_IN_FUTURE',
      'REVIEW_OVERDUE',
      'REVIEW_SCHEDULE_INVALID',
      'SCHEMA_INVALID',
      'SOURCE_REEVALUATION_REQUIRED',
      'SOURCE_RETRACTED',
      'SOURCE_STATUS_CHECKED_IN_FUTURE',
      'SOURCE_STATUS_DATE_MISSING',
      'SOURCE_STATUS_METHOD_MISSING',
      'SOURCE_STATUS_OVERDUE',
      'SOURCE_STATUS_SCHEDULE_INVALID',
      'SOURCE_STATUS_SOURCE_MISSING',
    ];

    for (const code of issueCodes) {
      expect(guide, code).toContain(`### \`${code}\``);
    }
  });
});
