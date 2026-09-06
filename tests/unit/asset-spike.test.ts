import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  ASSET_SCORE_RUBRIC,
  LICENSE_CLARITY_FLOOR,
  MAX_SCORE,
  REQUIRED_LICENSE_FIELDS,
  SPIKE_CRITERIA,
  VALID_STATUSES,
  deriveCriterionScore,
  evaluateCandidate,
  evaluateInventory,
  validateAssetScoreRubric,
  validateLicenseFields,
} from '../../scripts/assets/scorecard.mjs';

const execFileAsync = promisify(execFile);

async function runSpike(candidates: unknown[]) {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'sbla-asset-spike-'));
  const inventoryPath = join(fixtureRoot, 'inventory.json');
  await writeFile(
    inventoryPath,
    JSON.stringify({ recordedOn: '2026-09-05', candidates }),
  );

  try {
    const result = await execFileAsync(
      process.execPath,
      [
        fileURLToPath(
          new URL('../../scripts/assets/spike.mjs', import.meta.url),
        ),
        inventoryPath,
      ],
      { encoding: 'utf8' },
    );
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const failure = error as Error & {
      code?: number;
      stdout?: string;
      stderr?: string;
    };
    return {
      exitCode: failure.code,
      stdout: failure.stdout ?? '',
      stderr: failure.stderr ?? '',
    };
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

/**
 * Expectations below are LITERALS transcribed from master plan §8.3, not values
 * derived from the module under test. Deriving them would let an edit to the
 * module move the goalposts with the suite green.
 */
const PLAN_WEIGHTS: ReadonlyArray<readonly [string, number]> = [
  ['coverage_naming', 20],
  ['mesh_separability', 15],
  ['visual_quality', 15],
  ['browser_performance', 15],
  ['license_clarity', 20],
  ['pipeline_ease', 10],
  ['presentation_options', 5],
];

const PLAN_LABELS: ReadonlyArray<readonly [string, string]> = [
  ['coverage_naming', 'Anatomical coverage and naming accuracy'],
  ['mesh_separability', 'Mesh separability and mapping'],
  ['visual_quality', 'Visual quality after optimization'],
  ['browser_performance', 'Browser performance'],
  ['license_clarity', 'License clarity and future flexibility'],
  ['pipeline_ease', 'Ease of scripted Blender/glTF pipeline'],
  ['presentation_options', 'Male/female or inclusive presentation options'],
];

const PLAN_EVIDENCE_FIELDS: Record<string, string[]> = {
  coverage_naming: [
    'requiredTargetCount',
    'mappedTargetCount',
    'materialMappingDefectCount',
    'mappingManifest',
  ],
  mesh_separability: [
    'expectedSelectableMeshCount',
    'selectableMeshCount',
    'expectedMappingCount',
    'validMappingCount',
    'duplicateMappingCount',
    'mappingManifest',
  ],
  visual_quality: [
    'deterministicNormalization',
    'artifactChecks',
    'conversionManifest',
    'posterArtifact',
  ],
  browser_performance: [
    'optimizedGlbBytes',
    'nativeProfile',
    'lowPowerSimulation',
    'geometryBufferBytes',
    'observedJsHeapBytes',
    'observedJsHeapUnavailableReason',
    'performanceRecord',
  ],
  license_clarity: [
    'primarySourceUrl',
    'accessedOn',
    'commercialUse',
    'modification',
    'webDistribution',
    'attributionRequirements',
    'aiProcessingTerms',
    'conflictStatus',
    'licenseRecord',
  ],
  pipeline_ease: [
    'pinnedToolVersions',
    'scriptedStepCount',
    'manualStepCount',
    'repeatedRunCount',
    'structureParity',
    'conversionManifest',
  ],
  presentation_options: [
    'adultPresentationOptions',
    'optionParityChecks',
    'feasibilityRecord',
  ],
};

const PLAN_CRITERION_SHA256: Record<string, string> = {
  coverage_naming:
    'a5dbc45ccda3938e9b63c3f5380459d4fc7b65aaaf18ae7b954b1ab05b15797f',
  mesh_separability:
    '3e0f7d378e9417f10fd7bf3e688a4fce1f6d9a2b4daa1e95c9ac5a377f59f388',
  visual_quality:
    '2a34613a60160579afebdb553d16dc05b876364010e7cc09ac1758df1849f29b',
  browser_performance:
    '45652ffe8b1fda29d49000e3985d438b034f1fa1662d364ce305207d0d397470',
  license_clarity:
    '982334bb66c4c25c2d0e0e455bdad545dfee515773a99f747ffd45384e0c0699',
  pipeline_ease:
    'c8e1cb13489046e870d33f5a58dd21fa95f4d754ae503be129a890f539ad2bd3',
  presentation_options:
    'bd0eea88fc2670c200a071fb2dec257d22c1fbe63cdb7e9e740b51f7c4bed43a',
};

type MutableCriterionContract = {
  bands: Array<{ conditions: Record<string, unknown> }>;
  measurement: Record<string, unknown>;
  measurementRequirements: Record<string, unknown>;
  clarityRules: Record<string, unknown>;
};

const PLAN_REQUIRED_LICENSE_FIELDS = [
  'name',
  'version',
  'source',
  'accessedOn',
  'commercialUse',
  'shareAlike',
  'modification',
  'attributionRequired',
  'webDistribution',
];

function scored(value: number | null = 4) {
  return Object.fromEntries(
    SPIKE_CRITERIA.map((c) => [c.key, value]),
  ) as Record<string, number | null>;
}

function measurementsForScoreFour() {
  return {
    coverage_naming: {
      requiredTargetCount: 20,
      mappedTargetCount: 19,
      materialMappingDefectCount: 0,
      mappingManifest: 'mapping.json',
    },
    mesh_separability: {
      expectedSelectableMeshCount: 20,
      selectableMeshCount: 19,
      expectedMappingCount: 20,
      validMappingCount: 19,
      duplicateMappingCount: 0,
      mappingManifest: 'mapping.json',
    },
    visual_quality: {
      deterministicNormalization: true,
      artifactChecks: {
        noHoles: true,
        outwardNormals: true,
        materialsSurvive: true,
        componentsNotOccluded: true,
        usableProportions: false,
      },
      conversionManifest: 'conversion.json',
      posterArtifact: 'poster.webp',
    },
    browser_performance: {
      optimizedGlbBytes: 5_000_000,
      nativeProfile: { hardwareBacked: true, medianFrameMs: 18 },
      lowPowerSimulation: {
        profileKind: 'simulation',
        reducedLod: true,
        cpuThrottlingDocumented: true,
        swiftShader: true,
        medianFrameMs: 33,
      },
      geometryBufferBytes: 96_000_000,
      observedJsHeapBytes: null,
      observedJsHeapUnavailableReason: 'not exposed by this browser',
      performanceRecord: 'performance.json',
    },
    license_clarity: {
      primarySourceUrl: 'https://example.invalid/license',
      accessedOn: '2026-08-30',
      commercialUse: 'permitted',
      modification: 'permitted',
      webDistribution: 'permitted',
      attributionRequirements: 'required',
      aiProcessingTerms: 'not restricted',
      conflictStatus: 'conservatively-handled',
      licenseRecord: 'inventory.json',
    },
    pipeline_ease: {
      pinnedToolVersions: true,
      scriptedStepCount: 5,
      manualStepCount: 0,
      repeatedRunCount: 2,
      structureParity: true,
      conversionManifest: 'conversion.json',
      nondeterminismExplained: true,
      authorizedOutputsByteIdentical: false,
    },
    presentation_options: {
      adultPresentationOptions: ['adult-a', 'adult-b'],
      optionParityChecks: {
        requiredCoverage: true,
        mapping: true,
        separability: true,
        artifactChecks: true,
      },
      feasibilityRecord: 'feasibility.json',
    },
  };
}

function measurementsForScoreFive() {
  const measurements = measurementsForScoreFour();
  measurements.coverage_naming.mappedTargetCount = 20;
  measurements.mesh_separability.selectableMeshCount = 20;
  measurements.mesh_separability.validMappingCount = 20;
  measurements.visual_quality.artifactChecks.usableProportions = true;
  measurements.browser_performance.optimizedGlbBytes = 3_000_000;
  measurements.browser_performance.nativeProfile.medianFrameMs = 16;
  measurements.browser_performance.geometryBufferBytes = 64_000_000;
  measurements.license_clarity.conflictStatus = 'none';
  measurements.pipeline_ease.authorizedOutputsByteIdentical = true;
  measurements.presentation_options.adultPresentationOptions.push('adult-c');
  return measurements;
}

function candidate(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test',
    name: 'Test candidate',
    status: 'inventoried',
    license: {
      name: 'CC BY-SA 4.0',
      version: '4.0',
      source: 'https://example.invalid/license',
      accessedOn: '2026-08-30',
      commercialUse: 'permitted',
      shareAlike: 'required',
      modification: 'permitted',
      attributionRequired: true,
      webDistribution: 'permitted',
    },
    scores: scored(),
    measurements: measurementsForScoreFour(),
    ...overrides,
  };
}

describe('asset spike scorecard', () => {
  it('loads the checked-in JSON rubric as the validated scorecard contract', async () => {
    const onDisk = JSON.parse(
      await readFile(
        new URL('../../docs/licenses/asset-score-rubric.json', import.meta.url),
        'utf8',
      ),
    );

    expect(ASSET_SCORE_RUBRIC).toEqual(onDisk);
    expect(validateAssetScoreRubric(onDisk)).toEqual([]);
    expect(onDisk.frozenBeforeCandidateMeasurement).toBe(true);
  });

  it('pins exactly the seven section 8.3 ids, labels, and weights', () => {
    expect(
      ASSET_SCORE_RUBRIC.criteria.map(
        ({
          id,
          label,
          weight,
        }: {
          id: string;
          label: string;
          weight: number;
        }) => [id, label, weight],
      ),
    ).toEqual(
      PLAN_WEIGHTS.map(([id, weight]) => [
        id,
        PLAN_LABELS.find(([labelId]) => labelId === id)?.[1],
        weight,
      ]),
    );
  });

  it('requires deterministic 0-5 bands and criterion-specific evidence', () => {
    for (const criterion of ASSET_SCORE_RUBRIC.criteria) {
      expect(criterion.evidenceFields).toEqual(
        PLAN_EVIDENCE_FIELDS[criterion.id],
      );
      expect(
        criterion.bands.map(({ score }: { score: number }) => score),
      ).toEqual([0, 1, 2, 3, 4, 5]);
      for (const band of criterion.bands) {
        expect(band.rule).toEqual(expect.any(String));
        expect(band.rule.length).toBeGreaterThan(20);
        expect(band.conditions).toEqual(expect.any(Object));
      }
    }
  });

  it('pins every exact criterion rule and threshold with independent fingerprints', () => {
    expect(
      Object.fromEntries(
        ASSET_SCORE_RUBRIC.criteria.map((criterion) => [
          criterion.id,
          createHash('sha256').update(JSON.stringify(criterion)).digest('hex'),
        ]),
      ),
    ).toEqual(PLAN_CRITERION_SHA256);
  });

  it('freezes the coverage, separability, and normalized visual measurement rules', () => {
    const criterion = (id: string) =>
      ASSET_SCORE_RUBRIC.criteria.find(
        ({ id: candidateId }: { id: string }) => candidateId === id,
      );

    expect(criterion('coverage_naming')?.measurement).toEqual({
      rate: 'mappedTargetCount / requiredTargetCount',
      positiveScoreRequires: { materialMappingDefectCount: 0 },
    });
    expect(criterion('mesh_separability')?.measurement).toEqual({
      rate: 'min(selectableMeshCount / expectedSelectableMeshCount, validMappingCount / expectedMappingCount)',
      positiveScoreRequires: { duplicateMappingCount: 0 },
    });
    expect(criterion('visual_quality')?.measurement).toEqual({
      prerequisite: { deterministicNormalization: true },
      score: 'count of passed required artifactChecks',
      requiredArtifactChecks: [
        'noHoles',
        'outwardNormals',
        'materialsSurvive',
        'componentsNotOccluded',
        'usableProportions',
      ],
    });
  });

  it('freezes browser payload, frame, memory, and profile requirements before measurement', () => {
    const performance = ASSET_SCORE_RUBRIC.criteria.find(
      ({ id }: { id: string }) => id === 'browser_performance',
    );

    expect(performance?.budgets).toEqual({
      desktopTargetBytes: 6_000_000,
      desktopHardCeilingBytes: 10_000_000,
      mobileInteractiveTargetBytes: 3_000_000,
      geometryBufferTargetBytes: 134_217_728,
      geometryBufferHardCeilingBytes: 268_435_456,
      nativeTargetMedianFrameMs: 18.18,
      nativeTopBandMedianFrameMs: 16.67,
      lowPowerSimulationGracefulMedianFrameMs: 33.33,
    });
    expect(performance?.measurementRequirements).toEqual({
      nativeProfileMustBeHardwareBacked: true,
      lowPowerProfileKind: 'simulation',
      lowPowerSimulationRequires: [
        'reduced LOD',
        'documented CPU throttling',
        'SwiftShader software rendering',
      ],
      physicalLowTierDeviceClaimPermitted: false,
      missingNativeOrSimulationScore: null,
    });
  });

  it('preserves accepted license-clarity semantics and the 4-of-5 floor', () => {
    expect(ASSET_SCORE_RUBRIC.rejectionFloor).toEqual({
      criterionId: 'license_clarity',
      minimumScore: 4,
    });
    const license = ASSET_SCORE_RUBRIC.criteria.find(
      ({ id }: { id: string }) => id === 'license_clarity',
    );
    expect(license?.clarityRules).toEqual({
      suitabilityIsSeparateFromClarity: true,
      explicitRestrictionCanStillBeClear: true,
      unresolvedMixedComponentTermsMaximumScore: 3,
      explicitCurrentTermsWithConservativelyHandledHistoricalNoticeScore: 4,
      explicitUnconflictedPrimaryTermsScore: 5,
    });
  });

  it('states that missing evidence is null, never zero, and blocks completeness', () => {
    expect(ASSET_SCORE_RUBRIC.missingMeasurementPolicy).toEqual({
      score: null,
      zeroRequiresCompletedMeasurement: true,
      blocksCandidateCompleteness: true,
    });
  });

  it('rejects rubric mutations instead of accepting moved goalposts', () => {
    const mutated = structuredClone(ASSET_SCORE_RUBRIC);
    mutated.criteria.find(({ id }) => id === 'coverage_naming')!.weight = 19;
    mutated.criteria.find(
      ({ id }) => id === 'browser_performance',
    )!.budgets!.desktopHardCeilingBytes = 25 * 1024 * 1024;
    mutated.criteria.find(
      ({ id }) => id === 'presentation_options',
    )!.evidenceFields = [];

    const issues = validateAssetScoreRubric(mutated);
    expect(
      issues.some((issue: string) => issue.includes('coverage_naming weight')),
    ).toBe(true);
    expect(
      issues.some((issue: string) => issue.includes('desktopHardCeilingBytes')),
    ).toBe(true);
    expect(
      issues.some((issue: string) =>
        issue.includes('presentation_options evidenceFields'),
      ),
    ).toBe(true);
  });

  it('fails closed when any criterion band semantics drift', () => {
    const mutationPaths: Array<
      [string, (criterion: MutableCriterionContract) => void]
    > = [
      [
        'coverage_naming',
        (c) => (c.bands[4]!.conditions.rateMinimumInclusive = 0.8),
      ],
      ['mesh_separability', (c) => (c.measurement.rate = 'selectable only')],
      [
        'visual_quality',
        (c) => (c.measurement.requiredArtifactChecks as string[]).pop(),
      ],
      [
        'browser_performance',
        (c) =>
          (c.measurementRequirements.nativeProfileMustBeHardwareBacked = false),
      ],
      [
        'license_clarity',
        (c) => (c.clarityRules.suitabilityIsSeparateFromClarity = false),
      ],
      ['pipeline_ease', (c) => (c.bands[5]!.conditions.manualStepCount = 1)],
      [
        'presentation_options',
        (c) => (c.bands[4]!.conditions.allParityChecksPass = false),
      ],
    ];

    for (const [id, mutate] of mutationPaths) {
      const changed = structuredClone(ASSET_SCORE_RUBRIC);
      mutate(
        changed.criteria.find(
          (criterion) => criterion.id === id,
        )! as unknown as MutableCriterionContract,
      );
      expect(validateAssetScoreRubric(changed)).toContain(
        `${id} exact criterion contract does not match the frozen rubric`,
      );
    }
  });

  it('derives each score from structured criterion evidence', () => {
    const evidence = measurementsForScoreFour();
    for (const [criterionId, measurement] of Object.entries(evidence)) {
      expect(deriveCriterionScore(criterionId, measurement)).toEqual({
        issues: [],
        score: 4,
      });
    }
  });

  it('treats absent required measurement evidence as null rather than zero', () => {
    expect(deriveCriterionScore('coverage_naming', null)).toEqual({
      issues: ['coverage_naming: measurement evidence is missing'],
      score: null,
    });
    expect(
      evaluateCandidate(
        candidate({
          measurements: {
            ...measurementsForScoreFour(),
            coverage_naming: null,
          },
        }),
      ).weightedTotal,
    ).toBeNull();
  });

  it('rejects a dishonest perfect score against failed coverage evidence', () => {
    const measurements = measurementsForScoreFive();
    measurements.coverage_naming = {
      requiredTargetCount: 28,
      mappedTargetCount: 0,
      materialMappingDefectCount: 12,
      mappingManifest: 'mapping.json',
    };
    const result = evaluateCandidate(
      candidate({ scores: scored(5), measurements }),
    );

    expect(
      result.issues.some((issue: string) =>
        issue.includes(
          'coverage_naming score 5 does not match evidence-derived score 0',
        ),
      ),
    ).toBe(true);
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
  });

  it('requires every evidence field and rejects malformed native or simulation profiles', () => {
    const missing = measurementsForScoreFour().coverage_naming;
    delete (missing as Partial<typeof missing>).mappingManifest;
    expect(deriveCriterionScore('coverage_naming', missing).score).toBeNull();
    expect(deriveCriterionScore('coverage_naming', missing).issues).toContain(
      'coverage_naming: missing evidence field: mappingManifest',
    );

    const performance = measurementsForScoreFour().browser_performance;
    performance.nativeProfile.hardwareBacked = false;
    performance.lowPowerSimulation.profileKind = 'physical-device';
    const derived = deriveCriterionScore('browser_performance', performance);
    expect(derived.score).toBeNull();
    expect(derived.issues).toContain(
      'browser_performance: nativeProfile must be hardware-backed',
    );
    expect(derived.issues).toContain(
      'browser_performance: lowPowerSimulation must be labelled simulation',
    );
  });

  it('reports a malformed criterion instead of crashing rubric validation', () => {
    const malformed = structuredClone(ASSET_SCORE_RUBRIC);
    malformed.criteria[2] = null as never;

    expect(() => validateAssetScoreRubric(malformed)).not.toThrow();
    expect(validateAssetScoreRubric(malformed)).toContain(
      'rubric criterion at index 2 must be an object',
    );
  });

  it('pins each master plan section 8.3 weight, not merely their sum', () => {
    expect(SPIKE_CRITERIA.map((c) => [c.key, c.weight])).toEqual(
      PLAN_WEIGHTS.map(([k, w]) => [k, w]),
    );
    expect(SPIKE_CRITERIA.reduce((s, c) => s + c.weight, 0)).toBe(100);
  });

  it('pins the licence-clarity floor and max score to the plan literals', () => {
    expect(LICENSE_CLARITY_FLOOR).toBe(4);
    expect(MAX_SCORE).toBe(5);
  });

  it('pins the required licence-field list to a literal', () => {
    expect([...REQUIRED_LICENSE_FIELDS]).toEqual(PLAN_REQUIRED_LICENSE_FIELDS);
  });

  it('reports every missing licence field rather than the first', () => {
    const issues = validateLicenseFields({ id: 'x', license: {} });
    for (const field of PLAN_REQUIRED_LICENSE_FIELDS) {
      expect(issues).toContain(`x: missing licence field: ${field}`);
    }
  });

  it('rejects a placeholder source URL and a non-ISO access date', () => {
    const issues = validateLicenseFields(
      candidate({
        license: {
          ...candidate().license,
          source: 'TODO',
          accessedOn: 'banana',
        },
      }),
    );
    expect(issues.some((i) => i.includes('must be an http(s) URL'))).toBe(true);
    expect(issues.some((i) => i.includes('must be an ISO date'))).toBe(true);
  });

  it('accepts a complete licence record', () => {
    expect(validateLicenseFields(candidate())).toEqual([]);
  });

  it('fails an inventory whose candidate list is missing, null, empty, or not an array', () => {
    for (const bad of [undefined, null, [], {}, 'nope']) {
      const { issues, results } = evaluateInventory({
        candidates: bad,
      } as never);
      expect(issues.length).toBeGreaterThan(0);
      expect(results).toEqual([]);
    }
  });

  it('flags an unknown status instead of letting it disable the gates', () => {
    const result = evaluateCandidate(candidate({ status: 'placehlder' }));
    expect(
      result.issues.some((i: string) => i.includes('unknown status')),
    ).toBe(true);
    expect(VALID_STATUSES).toEqual(['inventoried', 'placeholder']);
  });

  it('keeps an unselected commercial placeholder unscored and incomplete', () => {
    const result = evaluateCandidate(
      candidate({
        status: 'placeholder',
        acquired: false,
        scores: scored(null),
      }),
    );

    expect(result.issues).toEqual([]);
    expect(result.licenceIssues).toEqual([]);
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
  });

  it('rejects a placeholder that is acquired or has any measured score', () => {
    const acquired = evaluateCandidate(
      candidate({
        status: 'placeholder',
        acquired: true,
        scores: scored(null),
      }),
    );
    expect(
      acquired.issues.some((i: string) => i.includes('acquired:false')),
    ).toBe(true);

    const scoredPlaceholder = evaluateCandidate(
      candidate({
        status: 'placeholder',
        acquired: false,
        scores: { ...scored(null), license_clarity: 5 },
      }),
    );
    expect(
      scoredPlaceholder.issues.some((i: string) =>
        i.includes('all scores null'),
      ),
    ).toBe(true);
    expect(scoredPlaceholder.complete).toBe(false);
    expect(scoredPlaceholder.weightedTotal).toBeNull();
  });

  it('reports null and non-object candidate entries instead of throwing', () => {
    expect(() =>
      evaluateInventory({ candidates: [null, undefined, 'broken'] }),
    ).not.toThrow();

    const { issues, results } = evaluateInventory({
      candidates: [null, undefined, 'broken'],
    });
    expect(results).toHaveLength(3);
    expect(issues).toHaveLength(3);
    expect(issues.every((issue) => issue.includes('must be an object'))).toBe(
      true,
    );
  });

  it('prints an explicit invalid outcome for a malformed record', async () => {
    const result = await runSpike([null]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain(
      '- <invalid>: INVALID — candidate must be an object',
    );
  });

  it('prints an explicit invalid outcome for a scored placeholder', async () => {
    const invalidPlaceholder = candidate({
      status: 'placeholder',
      acquired: false,
      scores: { ...scored(null), visual_quality: 4 },
    });
    const result = await runSpike([invalidPlaceholder]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain(
      '- Test candidate: INVALID — test: placeholder candidates must keep all scores null',
    );
    expect(result.stdout).not.toContain('PLACEHOLDER');
  });

  it('prints an explicit incomplete outcome for an unlicensed fully scored record', async () => {
    const unlicensed = candidate({
      license: { ...candidate().license, source: 'TODO' },
      scores: scored(5),
      measurements: measurementsForScoreFive(),
    });
    const result = await runSpike([unlicensed]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain(
      '- Test candidate: INCOMPLETE — licence record invalid',
    );
    expect(result.stdout).not.toContain('weighted total 100/100');
  });

  it('flags duplicate candidate ids', () => {
    const { issues } = evaluateInventory({
      candidates: [candidate(), candidate()],
    });
    expect(issues).toContain('duplicate candidate id: test');
  });

  it('fails a sub-floor candidate that does not acknowledge its ineligibility', () => {
    const result = evaluateCandidate(
      candidate({
        scores: { ...scored(), license_clarity: LICENSE_CLARITY_FLOOR - 1 },
      }),
    );
    expect(result.rejected).toBe(true);
    expect(
      result.issues.some((i: string) => i.includes('below the §8.3 floor')),
    ).toBe(true);
  });

  it('allows a sub-floor candidate only when it is explicitly acknowledged with a reason', () => {
    const measurements = measurementsForScoreFour();
    measurements.license_clarity.conflictStatus = 'unresolved-mixed';
    const ok = evaluateCandidate(
      candidate({
        scores: { ...scored(), license_clarity: 3 },
        measurements,
        selectionEligible: false,
        ineligibleReason: 'unresolved mixed licensing',
      }),
    );
    expect(ok.rejected).toBe(true);
    expect(ok.issues).toEqual([]);

    const missingReason = evaluateCandidate(
      candidate({
        scores: { ...scored(), license_clarity: 3 },
        measurements,
        selectionEligible: false,
      }),
    );
    expect(
      missingReason.issues.some((i: string) => i.includes('ineligibleReason')),
    ).toBe(true);
  });

  it('honours selectionEligible:false even when clarity is above the floor', () => {
    const measurements = measurementsForScoreFour();
    measurements.license_clarity.conflictStatus = 'none';
    const result = evaluateCandidate(
      candidate({
        scores: { ...scored(), license_clarity: 5 },
        measurements,
        selectionEligible: false,
        ineligibleReason: 'NonCommercial terms',
      }),
    );
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toContain('NonCommercial');
    expect(result.issues).toEqual([]);
  });

  it('refuses to total a candidate with unmeasured criteria instead of guessing', () => {
    const result = evaluateCandidate(
      candidate({ scores: { ...scored(), browser_performance: null } }),
    );
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
    expect(result.unmeasured).toContain('browser_performance');
  });

  it('refuses to complete or total a fully scored candidate with licence issues', () => {
    const result = evaluateCandidate(
      candidate({
        license: {
          ...candidate().license,
          source: 'TODO',
        },
        scores: scored(5),
      }),
    );

    expect(result.licenceIssues.length).toBeGreaterThan(0);
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
  });

  it('computes a weighted total only when every criterion is measured', () => {
    const result = evaluateCandidate(
      candidate({
        scores: scored(5),
        measurements: measurementsForScoreFive(),
      }),
    );
    expect(result.complete).toBe(true);
    expect(result.weightedTotal).toBe(100);
  });

  it('reports an out-of-range score as an issue rather than throwing', () => {
    const result = evaluateCandidate(
      candidate({ scores: { ...scored(), visual_quality: 9 } }),
    );
    expect(
      result.issues.some((i: string) => i.includes('visual_quality')),
    ).toBe(true);
    expect(result.weightedTotal).toBeNull();
  });

  it('validates candidate score keys and values against rubric bands', () => {
    const result = evaluateCandidate(
      candidate({
        scores: {
          ...scored(),
          visual_quality: 4.5,
          invented_criterion: 5,
        },
      }),
    );

    expect(
      result.issues.some((issue: string) =>
        issue.includes('visual_quality must match a rubric score band'),
      ),
    ).toBe(true);
    expect(
      result.issues.some((issue: string) =>
        issue.includes('unknown score criterion: invented_criterion'),
      ),
    ).toBe(true);
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
  });

  it('is deterministic: identical input yields identical output', () => {
    expect(JSON.stringify(evaluateCandidate(candidate()))).toBe(
      JSON.stringify(evaluateCandidate(candidate())),
    );
  });
});
