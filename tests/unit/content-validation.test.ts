import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  lintClaimLanguage,
  validateRecordGraph,
  validateSourceStatus,
} from '../../src/lib/content/validation';
import type { ClaimRecord, SourceRecord } from '../../src/lib/content/schemas';

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

describe('cross-record graph integrity', () => {
  it('accepts valid references and rejects each adversarial graph fixture', async () => {
    const valid = await readJson<{ claim: ClaimRecord; source: SourceRecord }>(
      'records.valid.json',
    );
    const cases = await readJson<
      Array<{
        name: string;
        mutation: { path: string; value: unknown } | null;
        expectedCodes: string[];
      }>
    >('graph-cases.json');

    for (const testCase of cases) {
      const graph: {
        claims: ClaimRecord[];
        sources: SourceRecord[];
        entityIds: string[];
      } = {
        claims: [structuredClone(valid.claim)],
        sources: [structuredClone(valid.source)],
        entityIds: ['joint-action-horizontal-adduction'],
      };
      if (testCase.mutation?.path === 'duplicateSource') {
        graph.sources.push(structuredClone(valid.source));
      } else if (testCase.mutation) {
        setPath(graph, testCase.mutation.path, testCase.mutation.value);
      }

      expect(
        validateRecordGraph(graph, { asOf: '2026-09-09' }).map(
          (issue) => issue.code,
        ),
        testCase.name,
      ).toEqual(expect.arrayContaining(testCase.expectedCodes));
    }
  });
});

describe('source publication status', () => {
  it('fails closed for overdue and adverse status fixtures', async () => {
    const valid = await readJson<{ source: SourceRecord }>(
      'records.valid.json',
    );
    const cases = await readJson<
      Array<{
        name: string;
        status: SourceRecord['publication']['status'];
        statusCheckedAt: string;
        statusMethod?: string | null;
        nextStatusCheckAt: string;
        asOf: string;
        expectedCodes: string[];
      }>
    >('source-status-cases.json');

    for (const testCase of cases) {
      const source = structuredClone(valid.source);
      Object.assign(source.publication, testCase);
      if ('statusMethod' in testCase) {
        source.publication.statusMethod = testCase.statusMethod;
      }
      expect(
        validateSourceStatus(source, { asOf: testCase.asOf }).map(
          (issue) => issue.code,
        ),
        testCase.name,
      ).toEqual(testCase.expectedCodes);
    }
  });

  it('requires a status source and rejects impossible status-check dates', async () => {
    const valid = await readJson<{ source: SourceRecord }>(
      'records.valid.json',
    );
    const missingSource = structuredClone(valid.source);
    missingSource.publication.statusSource = null;
    expect(
      validateSourceStatus(missingSource, { asOf: '2026-09-09' }).map(
        (issue) => issue.code,
      ),
    ).toContain('SOURCE_STATUS_SOURCE_MISSING');

    const futureCheck = structuredClone(valid.source);
    futureCheck.publication.statusCheckedAt = '2026-09-10';
    expect(
      validateSourceStatus(futureCheck, { asOf: '2026-09-09' }).map(
        (issue) => issue.code,
      ),
    ).toContain('SOURCE_STATUS_CHECKED_IN_FUTURE');

    const reversedSchedule = structuredClone(valid.source);
    reversedSchedule.publication.statusCheckedAt = '2026-09-08';
    reversedSchedule.publication.nextStatusCheckAt = '2026-09-08';
    expect(
      validateSourceStatus(reversedSchedule, { asOf: '2026-09-07' }).map(
        (issue) => issue.code,
      ),
    ).toContain('SOURCE_STATUS_SCHEDULE_INVALID');
  });
});

describe('certainty-language calibration', () => {
  it('rejects universal promises and outcome-free better claims at every grade', () => {
    expect(
      lintClaimLanguage('This is always the best exercise.', 'high').map(
        (issue) => issue.code,
      ),
    ).toEqual(
      expect.arrayContaining(['CERTAINTY_UNIVERSAL', 'OUTCOME_REQUIRED']),
    );
  });

  it('rejects categorical causal wording for low certainty', () => {
    expect(
      lintClaimLanguage('This exercise increases hypertrophy.', 'low').map(
        (issue) => issue.code,
      ),
    ).toContain('CERTAINTY_OVERSTATED');
  });

  it('accepts calibrated low-certainty wording', () => {
    expect(
      lintClaimLanguage(
        'Limited evidence suggests this exercise may increase pectoralis-major hypertrophy.',
        'low',
      ),
    ).toEqual([]);
  });

  it('accepts comparative wording when it names the outcome', () => {
    expect(
      lintClaimLanguage(
        'This setup may be better for pectoralis-major hypertrophy.',
        'low',
      ),
    ).toEqual([]);
  });

  it('rejects additional categorical causal wording for low certainty', () => {
    expect(
      lintClaimLanguage('This exercise will improve strength.', 'low').map(
        (issue) => issue.code,
      ),
    ).toContain('CERTAINTY_OVERSTATED');
  });
});

describe('published-record review dates', () => {
  it('fails closed when a published claim review is due or dated in the future', async () => {
    const valid = await readJson<{ claim: ClaimRecord; source: SourceRecord }>(
      'records.valid.json',
    );
    const due = structuredClone(valid.claim);
    due.review.reviewDueAt = '2026-09-09';
    expect(
      validateRecordGraph(
        {
          claims: [due],
          sources: [valid.source],
          entityIds: ['joint-action-horizontal-adduction'],
        },
        { asOf: '2026-09-09' },
      ).map((issue) => issue.code),
    ).toContain('REVIEW_OVERDUE');

    const future = structuredClone(valid.claim);
    future.review.lastReviewedAt = '2026-09-10';
    expect(
      validateRecordGraph(
        {
          claims: [future],
          sources: [valid.source],
          entityIds: ['joint-action-horizontal-adduction'],
        },
        { asOf: '2026-09-09' },
      ).map((issue) => issue.code),
    ).toContain('REVIEW_DATE_IN_FUTURE');
  });

  it('checks adverse status for every source cited by a published claim', async () => {
    const valid = await readJson<{ claim: ClaimRecord; source: SourceRecord }>(
      'records.valid.json',
    );
    const claim = structuredClone(valid.claim);
    claim.sourceLinks[0]!.role = 'qualifies';
    const source = structuredClone(valid.source);
    source.publication.status = 'retracted';

    expect(
      validateRecordGraph(
        {
          claims: [claim],
          sources: [source],
          entityIds: ['joint-action-horizontal-adduction'],
        },
        { asOf: '2026-09-09' },
      ).map((issue) => issue.code),
    ).toContain('SOURCE_RETRACTED');
  });
});
