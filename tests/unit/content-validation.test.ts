import { readFile, readdir } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  lintClaimLanguage,
  validateRecordGraph,
  validateSourceStatus,
} from '../../src/lib/content/validation';
import type {
  ChangeRecord,
  ClaimRecord,
  SourceRecord,
} from '../../src/lib/content/schemas';

const fixtureUrl = new URL('../fixtures/evidence-schemas/', import.meta.url);
const claimsUrl = new URL('../../content/claims/', import.meta.url);

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

  it('rejects a public relationship justified by an unpublished claim', async () => {
    const valid = await readJson<{ claim: ClaimRecord; source: SourceRecord }>(
      'records.valid.json',
    );
    const published = structuredClone(valid.claim);
    const draft = structuredClone(valid.claim);
    draft.id = 'claim-draft-rationale';
    draft.publicationState = 'unpublished';
    published.relationships = [
      {
        type: 'supported-by',
        targetId: 'joint-action-horizontal-adduction',
        claimId: draft.id,
        public: true,
      },
    ];

    expect(
      validateRecordGraph(
        {
          claims: [published, draft],
          sources: [valid.source],
          entityIds: ['joint-action-horizontal-adduction'],
        },
        { asOf: '2026-09-09' },
      ).map((issue) => issue.code),
    ).toContain('PUBLIC_RELATIONSHIP_CLAIM_UNPUBLISHED');
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

  it('does not let calibration in another clause excuse a causal overclaim', () => {
    expect(
      lintClaimLanguage(
        'Resistance training increases hypertrophy; individual results may vary.',
        'low',
      ).map((issue) => issue.code),
    ).toContain('CERTAINTY_OVERSTATED');

    expect(
      lintClaimLanguage(
        'In May 2020 the protocol increases strength.',
        'low',
      ).map((issue) => issue.code),
    ).toContain('CERTAINTY_OVERSTATED');
  });

  it.each([
    'The trial in may 2020 increases pectoralis-major hypertrophy reports.',
    'In May, 2020 the protocol increases strength.',
    'On May 3, 2020 the protocol increases strength.',
  ])(
    'does not treat a calendar month as causal calibration: %s',
    (statement) => {
      expect(
        lintClaimLanguage(statement, 'low').map((issue) => issue.code),
      ).toContain('CERTAINTY_OVERSTATED');
    },
  );

  it.each([
    'Resistance training increases hypertrophy and results may vary by individual.',
    'Resistance training increases hypertrophy, according to limited evidence.',
  ])('accepts a same-clause trailing calibration: %s', (statement) => {
    expect(lintClaimLanguage(statement, 'low')).toEqual([]);
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

  it.each([
    'This helps all participants.',
    'This helps every participant.',
    'This invariably improves strength.',
    'This works without exception.',
    'This succeeds for 100% of participants.',
  ])('rejects common universal wording: %s', (statement) => {
    expect(
      lintClaimLanguage(statement, 'high').map((issue) => issue.code),
    ).toContain('CERTAINTY_UNIVERSAL');
  });

  it.each([
    [
      'Every lifter gains pectoralis size from bench pressing, measured by ultrasound.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'All lifters should expect pectoralis growth in this slice.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'Every trainee benefits from the bench press contrast.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'All lifters gain size regardless of operator experience.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'Every athlete improves when normalised to bodyweight.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'All lifters respond identically in tier-1 programmes.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'All 100 lifters in the general population gain pectoralis size.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'Bench pressing works for the vast majority of all lifters.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'In 20 participants, every human being who trains gains muscle.',
      'moderate',
      'CERTAINTY_UNIVERSAL',
    ],
    [
      'Wide grip increases activation by 40% and causes hypertrophy; this was seen in one study.',
      'low',
      'CERTAINTY_OVERSTATED',
    ],
    [
      'During training, the bench press increases force, improves strength and prevents injury.',
      'low',
      'CERTAINTY_OVERSTATED',
    ],
    [
      'Wide grip increases activation by 40% and produces greater hypertrophy, though results may vary.',
      'low',
      'CERTAINTY_OVERSTATED',
    ],
    [
      'The bench press is better for everything.',
      'moderate',
      'OUTCOME_REQUIRED',
    ],
    ['The bench press is superior strength.', 'moderate', 'OUTCOME_REQUIRED'],
  ] as const)(
    'rejects the SBLA-011 R1 adversarial overclaim: %s',
    (statement, certainty, expectedCode) => {
      expect(
        lintClaimLanguage(statement, certainty).map((issue) => issue.code),
      ).toContain(expectedCode);
    },
  );

  it.each([
    [
      'In 20 participants, every participant gained size.',
      'In 20 participants, every participant gained size, and every lifter everywhere benefits.',
    ],
    [
      'Of all the shoulder muscles, the pectoralis has leverage for adduction.',
      'Of all the shoulder muscles, the pectoralis has leverage for adduction, and all lifters gain size.',
    ],
    [
      'The response was not observed in every study.',
      'The response was not observed in every study, and every lifter gains from it.',
    ],
    [
      'Five studies, all in trained men, report a change.',
      'Five studies, all in trained men, show all lifters gain size.',
    ],
    [
      'Every tier-1 programme in this slice works.',
      'Every tier-1 programme in this slice works, and every lifter gains from it.',
    ],
    [
      'The study reports that every specimen behaved this way.',
      'The study reports that every specimen behaved this way, so every athlete will too.',
    ],
    [
      'Normalised every value.',
      'Normalised every value, we conclude every athlete improves.',
    ],
    [
      'Ten trials were located. The acquisition ladder was recorded for all ten.',
      'Ten trials were located. The acquisition ladder was recorded for all ten, and all humans respond.',
    ],
    [
      'At three sites, the imaging plane, the measurement site and operator experience all change the number obtained.',
      'At three sites, the imaging plane, the measurement site and operator experience all change the number obtained, and all lifters gain size.',
    ],
    [
      'Electromyography is never evidence of hypertrophy.',
      'Electromyography is never evidence of hypertrophy, and the bench press never fails for any lifter.',
    ],
    [
      'The contrast is whole programmes differing in every exercise.',
      'The contrast is whole programmes differing in every exercise, and every lifter gains size.',
    ],
  ])(
    'does not let a scoped phrase launder a joined universal: %s',
    (scopedPart, joinedStatement) => {
      expect(lintClaimLanguage(scopedPart, 'moderate')).toEqual([]);
      expect(
        lintClaimLanguage(joinedStatement, 'moderate').map(
          (issue) => issue.code,
        ),
      ).toContain('CERTAINTY_UNIVERSAL');
    },
  );

  it.each([
    'In 20 participants, every participant gained size. Every lifter everywhere benefits.',
    'In 20 participants, every participant gained size; every lifter everywhere benefits.',
    'Across seven trials, all 7 trials agree that all humans respond.',
    'Five studies, all lifters gain size.',
    'The measured factors all change for every athlete.',
  ])('rejects the R2 certainty-laundering control: %s', (statement) => {
    expect(
      lintClaimLanguage(statement, 'moderate').map((issue) => issue.code),
    ).toContain('CERTAINTY_UNIVERSAL');
  });

  it.each([
    'In one eight-week trial of 20 trained men, wide grip increases activation by 40 per cent and bench pressing prevents shoulder injury.',
    'In one trial of 30 participants, the incline press produces a larger increase in strength and the flat press prevents injury.',
    'Bench pressing may cause hypertrophy, and wide grip increases activation by 40 per cent.',
  ])(
    'does not let scoped causal wording launder a new assertion: %s',
    (statement) => {
      expect(
        lintClaimLanguage(statement, 'low').map((issue) => issue.code),
      ).toContain('CERTAINTY_OVERSTATED');
    },
  );

  it.each([
    'In one trial of 24 men, the incline press increases clavicular activation and reduces sternal activation.',
    'In one trial of 24 men, the press increases activation and significantly reduces fatigue.',
    'Limited evidence suggests wide grip may increase activation and reduce fatigue.',
  ])('keeps same-assertion causal outcomes calibrated: %s', (statement) => {
    expect(lintClaimLanguage(statement, 'low')).toEqual([]);
  });

  it('keeps every promoted statement and plain-language field calibrated', async () => {
    const claimFiles = (await readdir(claimsUrl)).filter((name) =>
      name.endsWith('.json'),
    );
    expect(claimFiles).toHaveLength(23);

    for (const name of claimFiles) {
      const claim = JSON.parse(
        await readFile(new URL(name, claimsUrl), 'utf8'),
      ) as ClaimRecord;
      for (const [field, text] of [
        ['statement', claim.statement],
        ['plainLanguage', claim.plainLanguage],
      ] as const) {
        expect(
          lintClaimLanguage(text, claim.evidence.certainty),
          `${claim.id}.${field}`,
        ).toEqual([]);
      }
    }
  });

  it('does not treat a directly negated causal result as an overclaim', () => {
    expect(
      lintClaimLanguage(
        'This intervention does not increase measured strength.',
        'low',
      ),
    ).toEqual([]);
  });

  it('does not treat a negated universal result as a universal promise', () => {
    expect(
      lintClaimLanguage(
        'This intervention does not help all participants.',
        'low',
      ),
    ).toEqual([]);
  });

  it('accepts a comparative when intervening words still lead to an outcome', () => {
    expect(
      lintClaimLanguage(
        'This may be one of the better available options for measured strength.',
        'low',
      ),
    ).toEqual([]);
  });

  it('requires very-low disclosure independently of low-certainty calibration', () => {
    expect(
      lintClaimLanguage(
        'This intervention may change measured strength.',
        'very-low',
      ).map((issue) => issue.code),
    ).toContain('HYPOTHESIS_DISCLOSURE_REQUIRED');
  });
});

describe('claim-language field coverage', () => {
  it('checks public plain-language and qualifier text as well as the statement', async () => {
    const valid = await readJson<{ claim: ClaimRecord; source: SourceRecord }>(
      'records.valid.json',
    );
    const claim = structuredClone(valid.claim);
    claim.plainLanguage = 'This always works.';
    claim.qualifiers = ['This guarantees the result.'];

    const issues = validateRecordGraph(
      {
        claims: [claim],
        sources: [valid.source],
        entityIds: ['joint-action-horizontal-adduction'],
      },
      { asOf: '2026-09-09' },
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CERTAINTY_UNIVERSAL',
          path: `${claim.id}.plainLanguage`,
        }),
        expect.objectContaining({
          code: 'CERTAINTY_UNIVERSAL',
          path: `${claim.id}.qualifiers.0`,
        }),
      ]),
    );
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

  it('applies review-date currency checks to published change records', async () => {
    const valid = await readJson<{
      claim: ClaimRecord;
      source: SourceRecord;
      changeRecord: ChangeRecord;
    }>('records.valid.json');
    const changeRecord = structuredClone(valid.changeRecord);
    changeRecord.review.lastReviewedAt = '2026-09-10';
    changeRecord.review.reviewDueAt = '2026-09-08';

    const issues = validateRecordGraph(
      {
        claims: [valid.claim],
        sources: [valid.source],
        changeRecords: [changeRecord],
        entityIds: ['joint-action-horizontal-adduction'],
      },
      { asOf: '2026-09-09' },
    ).map((issue) => issue.code);

    expect(issues).toEqual(
      expect.arrayContaining([
        'REVIEW_DATE_IN_FUTURE',
        'REVIEW_SCHEDULE_INVALID',
        'REVIEW_OVERDUE',
      ]),
    );
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
