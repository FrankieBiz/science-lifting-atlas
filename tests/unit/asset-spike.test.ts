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
    JSON.stringify({
      recordedOn: '2026-09-05',
      reverifyBy: '2026-11-30',
      candidates,
    }),
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
    'mobileFallbackPermitted',
    'observedJsHeapBytes',
    'observedJsHeapUnavailableReason',
    'performanceRecord',
  ],
  license_clarity: [
    'primarySourceUrl',
    'accessedOn',
    'completedLicenseReview',
    'authoritativePrimaryTerms',
    'componentTermsReviewed',
    'reviewedTerms',
    'materialContradictionCount',
    'mixedComponentTermsUnresolved',
    'historicalNoticeStatus',
    'conflictStatus',
    'licenseRecord',
  ],
  pipeline_ease: [
    'pinnedToolVersions',
    'sourceInputsPinned',
    'completedAttempt',
    'acceptedGlbProduced',
    'scriptedStepCount',
    'manualStepCount',
    'repeatedRunCount',
    'structureParity',
    'nondeterminismExplained',
    'authorizedOutputsByteIdentical',
    'conversionManifest',
  ],
  presentation_options: [
    'completedPresentationInspection',
    'adultPresentationOptions',
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
    '6e2b1d4853c42125ec4d2df2f2ab52756a800c77a7de6382883e9d3415274f39',
  license_clarity:
    '792990aa38c4a60bfa257c269521ffe6015ab5259de0ae444b5e1834cd470d59',
  pipeline_ease:
    '940ebcf5fb3e3571729a5208617bc318d2966313fb65b16d2b1da22a880e7624',
  presentation_options:
    '7c753ed0a07b9684cfa489a221253b1bd5442264139ec8b36231d12d5f8daf2b',
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

function reviewedLicenseTerms() {
  const evidence = {
    sourceUrl: 'https://example.invalid/license',
    accessedOn: '2026-08-30',
    reviewed: true,
  };
  return {
    commercialUse: { ...evidence, status: 'permitted' },
    modification: { ...evidence, status: 'permitted' },
    webDistribution: { ...evidence, status: 'permitted' },
    attributionRequired: { ...evidence, status: 'required' },
    aiProcessing: { ...evidence, status: 'not-restricted' },
  };
}

function presentationOption(id: string) {
  return {
    id,
    label: `Adult option ${id}`,
    evidenceRef: `feasibility.json#${id}`,
    parity: {
      requiredCoverage: true,
      mapping: true,
      separability: true,
      artifactChecks: true,
    },
  };
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
      mobileFallbackPermitted: true,
      observedJsHeapBytes: null,
      observedJsHeapUnavailableReason: 'not exposed by this browser',
      performanceRecord: 'performance.json',
    },
    license_clarity: {
      primarySourceUrl: 'https://example.invalid/license',
      accessedOn: '2026-08-30',
      completedLicenseReview: true,
      authoritativePrimaryTerms: true,
      componentTermsReviewed: true,
      reviewedTerms: reviewedLicenseTerms(),
      materialContradictionCount: 0,
      mixedComponentTermsUnresolved: false,
      historicalNoticeStatus: 'conservatively-handled',
      conflictStatus: 'conservatively-handled',
      licenseRecord: 'inventory.json',
    },
    pipeline_ease: {
      pinnedToolVersions: true,
      sourceInputsPinned: true,
      completedAttempt: true,
      acceptedGlbProduced: true,
      scriptedStepCount: 5,
      manualStepCount: 0,
      repeatedRunCount: 2,
      structureParity: true,
      conversionManifest: 'conversion.json',
      nondeterminismExplained: true,
      authorizedOutputsByteIdentical: false,
    },
    presentation_options: {
      completedPresentationInspection: true,
      adultPresentationOptions: [
        presentationOption('adult-a'),
        presentationOption('adult-b'),
      ],
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
  measurements.license_clarity.historicalNoticeStatus = 'none';
  measurements.pipeline_ease.authorizedOutputsByteIdentical = true;
  measurements.presentation_options.adultPresentationOptions.push(
    presentationOption('adult-c'),
  );
  return measurements;
}

function candidate(overrides: Record<string, unknown> = {}) {
  const effectiveScores = (overrides.scores ?? scored()) as Record<
    string,
    number | null
  >;
  const scoredCriteria = PLAN_WEIGHTS.map(([id]) => id).filter(
    (id) => effectiveScores[id] !== null,
  );
  const limitedCriteria = scoredCriteria.filter(
    (id) => Number(effectiveScores[id]) < 5,
  );
  const measurementDefaults = measurementsForScoreFour();
  const evidenceRefByCriterion: Record<string, string> = {
    coverage_naming: measurementDefaults.coverage_naming.mappingManifest,
    mesh_separability: measurementDefaults.mesh_separability.mappingManifest,
    visual_quality: measurementDefaults.visual_quality.conversionManifest,
    browser_performance:
      measurementDefaults.browser_performance.performanceRecord,
    license_clarity: measurementDefaults.license_clarity.licenseRecord,
    pipeline_ease: measurementDefaults.pipeline_ease.conversionManifest,
    presentation_options:
      measurementDefaults.presentation_options.feasibilityRecord,
  };
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
    scores: effectiveScores,
    measurements: measurementDefaults,
    scoreRationale: Object.fromEntries(
      scoredCriteria.map((id) => [id, `Evidence-backed rationale for ${id}`]),
    ),
    failureRisks: limitedCriteria.map((criterion) => ({
      criterion,
      evidenceRef: evidenceRefByCriterion[criterion],
      summary: `Measured limitation for ${criterion}`,
    })),
    recommendation: {
      status: 'measured-recommendation-only',
      summary: 'Proceed to the owner decision with measured limitations.',
      selected: false,
      decisionOwner: 'SBLA-006 owner gate',
    },
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

  it('does not grant license clarity from unknown rights or a claimed conflict state', () => {
    const license = measurementsForScoreFive().license_clarity as Record<
      string,
      unknown
    >;
    const reviewedTerms = license.reviewedTerms as Record<
      string,
      Record<string, unknown>
    >;
    reviewedTerms.commercialUse!.status = 'unknown';
    license.conflictStatus = 'none';
    license.completedLicenseReview = true;
    license.authoritativePrimaryTerms = true;
    license.componentTermsReviewed = true;
    license.materialContradictionCount = 0;
    license.mixedComponentTermsUnresolved = true;
    license.historicalNoticeStatus = 'none';

    const derived = deriveCriterionScore('license_clarity', license);
    expect(derived.score).toBeNull();
    expect(derived.issues).toContain(
      'license_clarity: reviewedTerms.commercialUse status is not recognized',
    );
    expect(derived.issues).toContain(
      'license_clarity: conflictStatus none contradicts the structured license facts',
    );
  });

  it('rejects semantic uncertainty synonyms without structured reviewed terms', () => {
    const license = measurementsForScoreFive().license_clarity as Record<
      string,
      unknown
    >;
    license.commercialUse = 'unclear';
    license.modification = 'not known';
    license.webDistribution = 'indeterminate';
    license.attributionRequirements = 'unsure';
    license.aiProcessingTerms = 'not established';
    license.reviewedTerms = {
      commercialUse: { status: 'unclear' },
      modification: { status: 'not known' },
    };

    const derived = deriveCriterionScore('license_clarity', license);
    expect(derived.score).toBeNull();
    expect(derived.issues).toEqual(
      expect.arrayContaining([
        'license_clarity: reviewedTerms.commercialUse status is not recognized',
        'license_clarity: reviewedTerms.commercialUse requires sourceUrl, accessedOn, and reviewed:true',
        'license_clarity: missing reviewed term: webDistribution',
      ]),
    );
  });

  it('does not treat an arbitrary free-text license record as accepted legacy evidence', () => {
    const measurements = measurementsForScoreFour();
    delete (measurements as Partial<typeof measurements>).license_clarity;
    const result = evaluateCandidate(
      candidate({
        scores: { ...scored(), license_clarity: 5 },
        measurements,
      }),
    );

    expect(result.issues).toContain(
      'test: license_clarity: measurement evidence is missing',
    );
    expect(result.complete).toBe(false);
  });

  it('requires an authoritative URL, ISO access date, and completed license review', () => {
    const license = measurementsForScoreFive().license_clarity as Record<
      string,
      unknown
    >;
    license.primarySourceUrl = 'TODO';
    license.accessedOn = 'someday';
    license.completedLicenseReview = false;
    license.authoritativePrimaryTerms = true;
    license.componentTermsReviewed = true;
    license.materialContradictionCount = 0;
    license.mixedComponentTermsUnresolved = false;
    license.historicalNoticeStatus = 'none';

    const derived = deriveCriterionScore('license_clarity', license);
    expect(derived.score).toBeNull();
    expect(derived.issues).toEqual(
      expect.arrayContaining([
        'license_clarity: primarySourceUrl must be an authoritative http(s) URL',
        'license_clarity: accessedOn must be an ISO date (YYYY-MM-DD)',
        'license_clarity: completedLicenseReview must be true',
      ]),
    );
  });

  it('requires mobile fallback evidence for browser bands 3 and 4', () => {
    const performance = measurementsForScoreFour()
      .browser_performance as Record<string, unknown>;
    delete performance.mobileFallbackPermitted;
    expect(deriveCriterionScore('browser_performance', performance).score).toBe(
      null,
    );
    expect(
      deriveCriterionScore('browser_performance', performance).issues,
    ).toContain(
      'browser_performance: missing evidence field: mobileFallbackPermitted',
    );

    performance.mobileFallbackPermitted = false;
    expect(deriveCriterionScore('browser_performance', performance).score).toBe(
      2,
    );
  });

  it('requires the complete pipeline contract and returns no nearest band', () => {
    const incomplete = measurementsForScoreFour().pipeline_ease as Record<
      string,
      unknown
    >;
    delete incomplete.sourceInputsPinned;
    delete incomplete.completedAttempt;
    delete incomplete.acceptedGlbProduced;
    expect(deriveCriterionScore('pipeline_ease', incomplete).score).toBeNull();
    expect(deriveCriterionScore('pipeline_ease', incomplete).issues).toEqual(
      expect.arrayContaining([
        'pipeline_ease: missing evidence field: sourceInputsPinned',
        'pipeline_ease: missing evidence field: completedAttempt',
        'pipeline_ease: missing evidence field: acceptedGlbProduced',
      ]),
    );

    const noBand = {
      ...incomplete,
      sourceInputsPinned: false,
      completedAttempt: true,
      acceptedGlbProduced: true,
      manualStepCount: 2,
    };
    const derived = deriveCriterionScore('pipeline_ease', noBand);
    expect(derived.score).toBeNull();
    expect(derived.issues).toContain(
      'pipeline_ease: completed evidence does not satisfy any frozen score band',
    );
  });

  it('consolidates malformed band issues instead of throwing', () => {
    const malformed = structuredClone(ASSET_SCORE_RUBRIC);
    malformed.criteria[0]!.bands = [null as never, { score: 5 } as never];

    expect(() => validateAssetScoreRubric(malformed)).not.toThrow();
    expect(validateAssetScoreRubric(malformed)).toEqual(
      expect.arrayContaining([
        'coverage_naming band at index 0 must be an object',
        'coverage_naming score bands must contain complete objects for 0-5',
        'coverage_naming exact criterion contract does not match the frozen rubric',
      ]),
    );
  });

  it('rejects null presentation options instead of scoring their array length', () => {
    const presentation = measurementsForScoreFive()
      .presentation_options as Record<string, unknown>;
    presentation.adultPresentationOptions = [null, null, null];

    const derived = deriveCriterionScore('presentation_options', presentation);
    expect(derived.score).toBeNull();
    expect(derived.issues).toEqual(
      expect.arrayContaining([
        'presentation_options: option at index 0 must be an object',
        'presentation_options: option at index 1 must be an object',
        'presentation_options: option at index 2 must be an object',
      ]),
    );
  });

  it('rejects duplicate or blank presentation ids and missing per-option parity', () => {
    const presentation = measurementsForScoreFive()
      .presentation_options as Record<string, unknown>;
    presentation.adultPresentationOptions = [
      {
        id: 'adult-a',
        label: 'Adult A',
        evidenceRef: 'feasibility.json#adult-a',
        parity: {
          requiredCoverage: true,
          mapping: true,
          separability: true,
          artifactChecks: true,
        },
      },
      {
        id: 'adult-a',
        label: 'Duplicate',
        evidenceRef: 'feasibility.json#duplicate',
        parity: {
          requiredCoverage: true,
          mapping: true,
          separability: true,
          artifactChecks: true,
        },
      },
      { id: '  ', label: '', evidenceRef: '', parity: null },
    ];

    const derived = deriveCriterionScore('presentation_options', presentation);
    expect(derived.score).toBeNull();
    expect(derived.issues).toEqual(
      expect.arrayContaining([
        'presentation_options: duplicate option id: adult-a',
        'presentation_options: option at index 2 requires a non-empty id',
        'presentation_options: option <index 2> parity is missing or incomplete',
      ]),
    );
  });

  it('requires completed presentation inspection proof before any score', () => {
    const unproved = {
      adultPresentationOptions: [],
      feasibilityRecord: 'feasibility.json',
    };
    expect(deriveCriterionScore('presentation_options', unproved)).toEqual({
      issues: [
        'presentation_options: missing evidence field: completedPresentationInspection',
      ],
      score: null,
    });

    expect(
      deriveCriterionScore('presentation_options', {
        ...unproved,
        completedPresentationInspection: false,
      }),
    ).toEqual({
      issues: [
        'presentation_options: completedPresentationInspection must be true',
      ],
      score: null,
    });

    expect(
      deriveCriterionScore('presentation_options', {
        ...unproved,
        completedPresentationInspection: true,
      }),
    ).toEqual({ issues: [], score: 0 });
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
    const licenseMeasurement = measurementsForScoreFour().license_clarity;
    licenseMeasurement.conflictStatus = 'unresolved-mixed';
    licenseMeasurement.mixedComponentTermsUnresolved = true;
    licenseMeasurement.historicalNoticeStatus = 'none';
    const ok = evaluateCandidate(
      candidate({
        scores: { ...scored(null), license_clarity: 3 },
        measurements: { license_clarity: licenseMeasurement },
        selectionEligible: false,
        ineligibleReason: 'unresolved mixed licensing',
      }),
    );
    expect(ok.rejected).toBe(true);
    expect(ok.issues).toEqual([]);

    const missingReason = evaluateCandidate(
      candidate({
        scores: { ...scored(null), license_clarity: 3 },
        measurements: { license_clarity: licenseMeasurement },
        selectionEligible: false,
      }),
    );
    expect(
      missingReason.issues.some((i: string) => i.includes('ineligibleReason')),
    ).toBe(true);
  });

  it('honours selectionEligible:false even when clarity is above the floor', () => {
    const licenseMeasurement = measurementsForScoreFour().license_clarity;
    licenseMeasurement.conflictStatus = 'none';
    licenseMeasurement.historicalNoticeStatus = 'none';
    const result = evaluateCandidate(
      candidate({
        scores: { ...scored(null), license_clarity: 5 },
        measurements: { license_clarity: licenseMeasurement },
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

describe('SBLA-005 measured candidate scorecard', () => {
  async function inventoryRecord() {
    return JSON.parse(
      await readFile(
        new URL('../../docs/licenses/asset-candidates.json', import.meta.url),
        'utf8',
      ),
    );
  }

  it('scores the only eligible acquired candidate from all seven evidence records', async () => {
    const inventory = await inventoryRecord();
    const bodyParts = inventory.candidates.find(
      ({ id }: { id: string }) => id === 'path-c-bodyparts3d',
    );
    const evaluation = evaluateCandidate(bodyParts);

    expect(bodyParts.scores).toEqual({
      coverage_naming: 3,
      mesh_separability: 5,
      visual_quality: 1,
      browser_performance: 5,
      license_clarity: 4,
      pipeline_ease: 5,
      presentation_options: 2,
    });
    expect(Object.keys(bodyParts.measurements)).toEqual(
      PLAN_WEIGHTS.map(([id]) => id),
    );
    expect(evaluation.issues).toEqual([]);
    expect(evaluation.licenceIssues).toEqual([]);
    expect(evaluation.unmeasured).toEqual([]);
    expect(evaluation.complete).toBe(true);
    expect(evaluation.rejected).toBe(false);
    expect(evaluation.weightedTotal).toBe(73);
    expect(bodyParts.weightedTotal).toBe(73);
  });

  it('binds the embedded browser score evidence to the authenticated performance record', async () => {
    const inventory = await inventoryRecord();
    const bodyParts = inventory.candidates.find(
      ({ id }: { id: string }) => id === 'path-c-bodyparts3d',
    );
    const measurement = bodyParts.measurements.browser_performance;
    const performance = JSON.parse(
      await readFile(
        new URL(`../../${measurement.performanceRecord}`, import.meta.url),
        'utf8',
      ),
    );

    expect(measurement).toMatchObject({
      optimizedGlbBytes: performance.source.bytes,
      nativeProfile: {
        hardwareBacked: true,
        medianFrameMs:
          performance.profiles.nativeHardware.aggregates.medianFrameMs,
      },
      lowPowerSimulation: {
        profileKind: 'simulation',
        medianFrameMs:
          performance.profiles.lowPowerSimulation.aggregates.medianFrameMs,
      },
      geometryBufferBytes: performance.scene.geometryBufferBytes,
      observedJsHeapBytes: performance.profiles.nativeHardware.jsHeap.bytes,
    });
  });

  it('keeps ineligible and unacquired candidates without technical scores or totals', async () => {
    const inventory = await inventoryRecord();
    const technicalCriteria = PLAN_WEIGHTS.map(([id]) => id).filter(
      (id) => id !== 'license_clarity',
    );

    for (const candidateRecord of inventory.candidates.filter(
      ({ id }: { id: string }) => id !== 'path-c-bodyparts3d',
    )) {
      for (const criterion of technicalCriteria) {
        expect(candidateRecord.scores[criterion]).toBeNull();
      }
      expect(candidateRecord.weightedTotal).toBeNull();
      expect(evaluateCandidate(candidateRecord).weightedTotal).toBeNull();
    }

    const zAnatomy = structuredClone(
      inventory.candidates.find(
        ({ id }: { id: string }) => id === 'path-b-z-anatomy',
      ),
    );
    zAnatomy.scores.visual_quality = 4;
    zAnatomy.measurements = {
      visual_quality: measurementsForScoreFour().visual_quality,
    };
    expect(evaluateCandidate(zAnatomy).issues).toContain(
      'path-b-z-anatomy: ineligible candidates must keep technical scores null: visual_quality',
    );
  });

  it('reports rejected candidates as ineligible and the measured candidate as a recommendation only', async () => {
    const inventory = await inventoryRecord();
    const result = await runSpike(inventory.candidates);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      '- Z-Anatomy: INELIGIBLE — Mixed licensing:',
    );
    expect(result.stdout).toContain(
      '- OpenStax Anatomy & Physiology 2e: INELIGIBLE — NonCommercial',
    );
    expect(result.stdout).toContain(
      '- BodyParts3D / Anatomography: weighted total 73/100 — measured recommendation only',
    );
    expect(result.stdout).toContain(
      'No asset is selected, purchased, or approved. SBLA-005 measures and recommends; SBLA-006 and the owner decide.',
    );
  });

  it('fails closed when an actual BodyParts3D score or evidence value is altered', async () => {
    const inventory = await inventoryRecord();
    const original = inventory.candidates.find(
      ({ id }: { id: string }) => id === 'path-c-bodyparts3d',
    );
    const changedScore = structuredClone(original);
    changedScore.scores.browser_performance = 4;
    expect(
      evaluateCandidate(changedScore).issues.some((issue: string) =>
        issue.includes('does not match evidence-derived score 5'),
      ),
    ).toBe(true);

    const changedEvidence = structuredClone(original);
    changedEvidence.measurements.pipeline_ease.authorizedOutputsByteIdentical = false;
    expect(
      evaluateCandidate(changedEvidence).issues.some((issue: string) =>
        issue.includes('does not match evidence-derived score 4'),
      ),
    ).toBe(true);

    const changedTotal = structuredClone(original);
    changedTotal.weightedTotal = 74;
    expect(
      evaluateCandidate(changedTotal).issues.some((issue: string) =>
        issue.includes('recorded weightedTotal 74 does not match computed 73'),
      ),
    ).toBe(true);
  });

  it('fails closed when the accepted licence-review window has expired', async () => {
    const inventory = await inventoryRecord();
    inventory.reverifyBy = '2026-09-07';

    expect(evaluateInventory(inventory, '2026-09-08').issues).toContain(
      'inventory licence evidence expired on 2026-09-07; re-verify before scoring on 2026-09-08',
    );
  });

  it('fails closed when a scored inventory loses its licence freshness anchor', async () => {
    const inventory = await inventoryRecord();
    delete inventory.reverifyBy;

    expect(evaluateInventory(inventory, '2026-09-08').issues).toContain(
      'scored inventory requires reverifyBy as an ISO date (YYYY-MM-DD)',
    );
  });

  it('fails closed when score rationales, failure risks, or the owner boundary drift', async () => {
    const inventory = await inventoryRecord();
    const original = inventory.candidates.find(
      ({ id }: { id: string }) => id === 'path-c-bodyparts3d',
    );

    const missingRationale = structuredClone(original);
    delete missingRationale.scoreRationale.visual_quality;
    expect(evaluateCandidate(missingRationale).issues).toContain(
      'path-c-bodyparts3d: scoreRationale must contain exactly all seven scored criteria',
    );

    const missingRisk = structuredClone(original);
    missingRisk.failureRisks = missingRisk.failureRisks.filter(
      ({ criterion }: { criterion: string }) => criterion !== 'coverage_naming',
    );
    expect(evaluateCandidate(missingRisk).issues).toContain(
      'path-c-bodyparts3d: failureRisks must cover exactly every scored criterion below 5',
    );

    const selected = structuredClone(original);
    selected.recommendation.selected = true;
    expect(evaluateCandidate(selected).issues).toContain(
      'path-c-bodyparts3d: recommendation must remain measured-recommendation-only with selected:false and the SBLA-006 owner gate',
    );

    const missingBoundary = structuredClone(original);
    delete missingBoundary.scoreRationale;
    delete missingBoundary.failureRisks;
    delete missingBoundary.recommendation;
    expect(evaluateCandidate(missingBoundary).complete).toBe(false);
    expect(evaluateCandidate(missingBoundary).weightedTotal).toBeNull();
  });
});

describe('BodyParts3D exercise-media feasibility evidence', () => {
  async function feasibilityRecord() {
    return JSON.parse(
      await readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-feasibility.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
  }

  it('separates source facts, direct measurements, and reviewer judgments', async () => {
    const record = await feasibilityRecord();

    expect(record.schemaVersion).toBe(1);
    expect(record.candidate).toBe('path-c-bodyparts3d');
    expect(Object.keys(record.evidence)).toEqual([
      'sourceFacts',
      'directMeasurements',
      'reviewerJudgments',
    ]);
  });

  it('records UV, material, topology, coordinate, and origin evidence without inference', async () => {
    const record = await feasibilityRecord();
    const { sourceFacts, directMeasurements } = record.evidence;

    expect(sourceFacts.selectedSourceMeshes).toMatchObject({
      count: 139,
      uvCoordinateMeshes: 0,
      normalMeshes: 139,
      materialUseMeshes: 139,
      materialLibraryMeshes: 0,
    });
    expect(sourceFacts.selectedSourceMeshes.mappingManifest).toBe(
      record.traceability.artifactDigests.mapping.path,
    );
    expect(sourceFacts.selectedSourceMeshes.mappingManifestSha256).toBe(
      record.traceability.artifactDigests.mapping.sha256,
    );
    expect(Object.keys(record.traceability)).toEqual([
      'artifactDigests',
      'criterionEvidence',
    ]);
    expect(directMeasurements.optimizedArtifact).toMatchObject({
      meshCount: 139,
      materialCount: 1,
      textureCount: 0,
      imageCount: 0,
      texcoordPrimitiveCount: 0,
    });
    expect(directMeasurements.materialOutcome.status).toBe(
      'replacement-material-assigned-not-source-material-survival',
    );
    expect(directMeasurements.topology).toMatchObject({
      boundaryEdges: 74524,
      degenerateFaces: 0,
      nonManifoldEdges: 0,
      sameDirectionSharedEdges: 0,
      closedMeshes: 0,
      openMeshesWithInconclusiveGlobalWinding: 139,
    });
    expect(directMeasurements.coordinateAndOrigin).toMatchObject({
      sourceUnits: 'millimetres',
      outputUnits: 'metres',
      scale: 0.001,
      origin: 'world-origin-preserved',
      maximumObservedBrowserTransformDeltaMetres: 4.98e-10,
    });
  });

  it('records that no skeleton, skin, UV texture, rig, or source animation exists', async () => {
    const { sourceFacts, directMeasurements, reviewerJudgments } = (
      await feasibilityRecord()
    ).evidence;

    expect(sourceFacts.sourcePresentation).toMatchObject({
      observedOptions: 1,
      sourceSexDescription: 'adult human male',
      genderClaim: null,
    });
    expect(sourceFacts.sourcePresentation.sourceSexEvidenceUrl).toContain(
      'dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html',
    );
    expect(directMeasurements.optimizedArtifact).toMatchObject({
      skinCount: 0,
      jointCount: 0,
      animationCount: 0,
    });
    expect(reviewerJudgments.shortRiggedLoop).toMatchObject({
      supportedFromCurrentArtifact: false,
      requiredFallback: 'authored-vector-or-staged-diagram',
    });
  });

  it('proves deterministic still and accessible static-fallback feasibility while blocking unapproved technique', async () => {
    const { directMeasurements, reviewerJudgments } = (
      await feasibilityRecord()
    ).evidence;

    expect(directMeasurements.deterministicStill).toMatchObject({
      cleanRuns: 2,
      byteIdentical: true,
      posterBytes: 11906,
      posterCeilingBytes: 200000,
      status: 'feasible',
    });
    expect(directMeasurements.accessibleFallback).toMatchObject({
      format: 'static-joint-path-diagram-plus-text',
      loadWithoutWebgl: true,
      status: 'tooling-feasible-content-blocked',
    });
    expect(reviewerJudgments.techniqueAccuracy).toMatchObject({
      status: 'blocked',
      checkpointOwner: 'Claude Research',
      fabricatedMovementAllowed: false,
    });
  });

  it('binds derived-media rights and attribution to every allowed output', async () => {
    const rights = (await feasibilityRecord()).evidence.sourceFacts
      .derivedMediaRights;

    expect(rights.primaryTerms).toMatchObject({
      license: 'CC BY 4.0 International',
      modification: 'permitted',
      redistribution: 'permitted',
      commercialUse: 'permitted',
    });
    expect(rights.historicalEmbeddedNotice).toMatchObject({
      license: 'CC BY-SA 2.1 Japan',
      handling: 'preserved-and-applied-conservatively',
    });
    expect(rights.outputs).toEqual([
      'optimized-glb',
      'poster',
      'later-staged-still',
      'later-authored-loop',
    ]);
    expect(rights.requiredAttribution).toBe(
      'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International',
    );
  });

  it('recomputes repeated clean-run throughput and derived/source byte ratios', async () => {
    const record = await feasibilityRecord();
    const throughput = record.evidence.directMeasurements.productionThroughput;
    const mapping = JSON.parse(
      await readFile(
        new URL(
          `../../${record.traceability.artifactDigests.mapping.path}`,
          import.meta.url,
        ),
        'utf8',
      ),
    );
    const conversion = JSON.parse(
      await readFile(
        new URL(
          `../../${record.traceability.artifactDigests.conversion.path}`,
          import.meta.url,
        ),
        'utf8',
      ),
    );
    const uniqueMappingMeshes = new Map<string, Record<string, unknown>>();
    for (const target of mapping.coverage.targets) {
      for (const component of target.components) {
        for (const mesh of component.meshes) {
          uniqueMappingMeshes.set(mesh.sha256, mesh);
        }
      }
    }
    const expectedSources = [...uniqueMappingMeshes.values()]
      .map(({ fileId, bytes, sha256, conceptId }) => ({
        fileId,
        bytes,
        sha256,
        conceptId,
      }))
      .sort((a, b) => String(a.fileId).localeCompare(String(b.fileId)));

    expect(throughput.cleanRuns).toHaveLength(2);
    expect(
      new Set(throughput.cleanRuns.map((run: { runId: string }) => run.runId))
        .size,
    ).toBe(2);
    for (const run of throughput.cleanRuns) {
      expect(run.runId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(Number.isNaN(Date.parse(run.createdAt))).toBe(false);
      expect(run.manifestSha256).toMatch(/^[0-9a-f]{64}$/);
      expect(run.objectCount).toBe(139);
      expect(run.meshesPerMinute).toBeCloseTo(
        (run.objectCount * 60) / run.conversionSeconds,
        6,
      );
      expect(run.glbSha256).toBe(
        'b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7',
      );
      expect(run.posterSha256).toBe(
        'd7a3bcb98e380910cfc762f259e5d3f1e1434f71c8caecc66ee163d2fe4b35eb',
      );
      const manifestBytes = await readFile(
        new URL(`../../${run.evidenceManifest}`, import.meta.url),
      );
      expect(createHash('sha256').update(manifestBytes).digest('hex')).toBe(
        run.manifestSha256,
      );
      const manifest = JSON.parse(manifestBytes.toString('utf8'));
      expect(manifest.runIdentity).toMatchObject({
        runId: run.runId,
        createdAt: run.createdAt,
        mode: 'baseline-unpublished',
        source: {
          mappingSha256:
            'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
        },
        tool: {
          versionString: '4.5.13 LTS',
          distributionSha256:
            '663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53',
        },
      });
      expect(manifest.timing).toEqual({
        conversionSeconds: run.conversionSeconds,
        objectCount: run.objectCount,
      });
      expect(manifest.artifacts.glb).toMatchObject({
        bytes: 2874932,
        sha256: run.glbSha256,
      });
      expect(manifest.artifacts.poster).toMatchObject({
        bytes: 11906,
        sha256: run.posterSha256,
      });
      expect(manifest.objects).toEqual(conversion.objects);
      expect(manifest.objects).toHaveLength(139);
      const actualSources = manifest.objects
        .map(
          (object: {
            source: { fileId: string; bytes: number; sha256: string };
            normalized: { entityId: string };
          }) => ({
            ...object.source,
            conceptId: object.normalized.entityId,
          }),
        )
        .sort((a: { fileId: string }, b: { fileId: string }) =>
          a.fileId.localeCompare(b.fileId),
        );
      expect(actualSources).toEqual(expectedSources);
      expect(
        actualSources.reduce(
          (total: number, source: { bytes: number }) => total + source.bytes,
          0,
        ),
      ).toBe(throughput.sourceBytes);
    }
    expect(throughput.sourceBytes).toBe(54495284);
    expect(throughput.derivedBytes).toBe(2874932 + 11906);
    expect(throughput.derivedToSourceByteRatio).toBeCloseTo(
      throughput.derivedBytes / throughput.sourceBytes,
      9,
    );
    expect(throughput.operatorStepsPerRun).toBe(1);
    expect(throughput.manualEditingSteps).toBe(0);
    expect(throughput.forecastClaimed).toBe(false);
    expect(throughput.observedMeshesPerMinuteRange).toEqual([
      Math.min(
        ...throughput.cleanRuns.map(
          ({ meshesPerMinute }: { meshesPerMinute: number }) => meshesPerMinute,
        ),
      ),
      Math.max(
        ...throughput.cleanRuns.map(
          ({ meshesPerMinute }: { meshesPerMinute: number }) => meshesPerMinute,
        ),
      ),
    ]);
  });

  it('freezes poster and loop budgets plus load-on-intent policy', async () => {
    const budgets = (await feasibilityRecord()).evidence.directMeasurements
      .mediaBudgets;

    expect(budgets).toEqual({
      posterTargetBytes: 200000,
      loopTargetBytes: 1500000,
      loopHardCeilingBytes: 3000000,
      loopsLoadOnIntent: true,
      measuredLoopBytes: null,
      measuredLoopUnavailableReason:
        'Current artifact has no rig, joints, skin, or animation.',
    });
  });

  it('records exactly one inspected adult option without inventing sex or inclusive variants', async () => {
    const presentation = (await feasibilityRecord()).evidence.directMeasurements
      .presentationInspection;

    expect(presentation.completed).toBe(true);
    expect(presentation.adultPresentationOptions).toEqual([
      {
        id: 'adult-human-male',
        label: 'Adult human male anatomy',
        evidenceRef:
          'docs/licenses/bodyparts3d-feasibility.json#presentationInspection',
        parity: {
          requiredCoverage: true,
          mapping: true,
          separability: true,
          artifactChecks: true,
        },
      },
    ]);
    expect(presentation.additionalFemaleOrInclusiveVariantsObserved).toBe(0);
  });

  it('binds the measured artifacts and all seven rubric criteria to inspectable evidence', async () => {
    const record = await feasibilityRecord();
    const artifactRoot = new URL('../../', import.meta.url);

    expect(record.traceability.artifactDigests).toEqual({
      mapping: {
        path: 'docs/licenses/bodyparts3d-mesh-mapping.json',
        sha256:
          'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
      },
      conversion: {
        path: 'docs/licenses/bodyparts3d-conversion-manifest.json',
        sha256:
          '8d2cb6813a49be110c47729da208f3093b74788e7ae479b55e6f8abdef684d5d',
      },
      performance: {
        path: 'docs/licenses/bodyparts3d-performance.json',
        sha256:
          'b75315ba9569cf70190c628bcfe1c83cc0f74c8c7f5d3a213b65deaa29e31952',
      },
      poster: {
        path: 'assets/derived/bodyparts3d/sbla005-poster.webp',
        sha256:
          'd7a3bcb98e380910cfc762f259e5d3f1e1434f71c8caecc66ee163d2fe4b35eb',
      },
      optimizedArtifact: {
        path: 'assets/derived/bodyparts3d/sbla005-representative.glb',
        sha256:
          'b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7',
      },
    });
    const digest = async (path: string) =>
      createHash('sha256')
        .update(await readFile(new URL(path, artifactRoot)))
        .digest('hex');

    expect(
      await digest('assets/derived/bodyparts3d/sbla005-representative.glb'),
    ).toBe(record.evidence.directMeasurements.optimizedArtifact.sha256);
    expect(await digest('assets/derived/bodyparts3d/sbla005-poster.webp')).toBe(
      record.evidence.directMeasurements.deterministicStill.sha256,
    );
    expect(record.traceability.criterionEvidence).toEqual({
      coverage_naming: ['docs/licenses/bodyparts3d-mesh-mapping.json'],
      mesh_separability: [
        'docs/licenses/bodyparts3d-mesh-mapping.json',
        'docs/licenses/bodyparts3d-conversion-manifest.json',
      ],
      visual_quality: [
        'docs/licenses/bodyparts3d-conversion-manifest.json',
        'docs/licenses/bodyparts3d-feasibility.json',
      ],
      browser_performance: ['docs/licenses/bodyparts3d-performance.json'],
      license_clarity: [
        'docs/licenses/asset-candidates.json',
        'docs/licenses/anatomy-assets.md',
      ],
      pipeline_ease: [
        'docs/licenses/bodyparts3d-conversion-manifest.json',
        'docs/licenses/bodyparts3d-feasibility.json',
      ],
      presentation_options: ['docs/licenses/bodyparts3d-feasibility.json'],
    });
    for (const evidence of Object.values(
      record.traceability.artifactDigests,
    ) as Array<{ path: string; sha256: string }>) {
      expect(await digest(evidence.path)).toBe(evidence.sha256);
    }
    for (const references of Object.values(
      record.traceability.criterionEvidence,
    ) as string[][]) {
      expect(references.length).toBeGreaterThan(0);
      for (const reference of references) {
        expect(
          (await readFile(new URL(reference, artifactRoot))).length,
        ).toBeGreaterThan(0);
      }
    }

    const mapping = JSON.parse(
      await readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-mesh-mapping.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    const conversion = JSON.parse(
      await readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-conversion-manifest.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    const performance = JSON.parse(
      await readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-performance.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    expect(mapping.coverage).toMatchObject({
      required: 28,
      present: 23,
      selectedMeshes: 139,
    });
    expect(conversion).toMatchObject({
      candidate: 'path-c-bodyparts3d',
      determinism: { cleanRuns: 2, sceneStructureEqual: true },
      timing: { objectCount: 139 },
    });
    expect(performance.profiles).toMatchObject({
      nativeHardware: { status: 'available', geometryBufferBytes: 2753652 },
      lowPowerSimulation: { status: 'available' },
    });
  });
});
