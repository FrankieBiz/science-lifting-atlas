import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * @typedef {object} ScoreBand
 * @property {number} score
 * @property {string} rule
 * @property {Record<string, unknown>} conditions
 */

/**
 * @typedef {object} RubricCriterion
 * @property {string} id
 * @property {string} label
 * @property {number} weight
 * @property {string[]} evidenceFields
 * @property {ScoreBand[]} bands
 * @property {Record<string, number>} [budgets]
 * @property {Record<string, unknown>} [measurement]
 * @property {Record<string, unknown>} [measurementRequirements]
 * @property {Record<string, unknown>} [clarityRules]
 */

/**
 * @typedef {object} AssetScoreRubric
 * @property {number} schemaVersion
 * @property {boolean} frozenBeforeCandidateMeasurement
 * @property {{minimum:number, maximum:number, allowedScores:number[]}} scoreScale
 * @property {{score:null, zeroRequiresCompletedMeasurement:boolean, blocksCandidateCompleteness:boolean}} missingMeasurementPolicy
 * @property {{criterionId:string, minimumScore:number}} rejectionFloor
 * @property {RubricCriterion[]} criteria
 */

const PLAN_CRITERIA = Object.freeze([
  {
    id: 'coverage_naming',
    label: 'Anatomical coverage and naming accuracy',
    weight: 20,
    evidenceFields: [
      'requiredTargetCount',
      'mappedTargetCount',
      'materialMappingDefectCount',
      'mappingManifest',
    ],
  },
  {
    id: 'mesh_separability',
    label: 'Mesh separability and mapping',
    weight: 15,
    evidenceFields: [
      'expectedSelectableMeshCount',
      'selectableMeshCount',
      'expectedMappingCount',
      'validMappingCount',
      'duplicateMappingCount',
      'mappingManifest',
    ],
  },
  {
    id: 'visual_quality',
    label: 'Visual quality after optimization',
    weight: 15,
    evidenceFields: [
      'deterministicNormalization',
      'artifactChecks',
      'conversionManifest',
      'posterArtifact',
    ],
  },
  {
    id: 'browser_performance',
    label: 'Browser performance',
    weight: 15,
    evidenceFields: [
      'optimizedGlbBytes',
      'nativeProfile',
      'lowPowerSimulation',
      'geometryBufferBytes',
      'mobileFallbackPermitted',
      'observedJsHeapBytes',
      'observedJsHeapUnavailableReason',
      'performanceRecord',
    ],
  },
  {
    id: 'license_clarity',
    label: 'License clarity and future flexibility',
    weight: 20,
    evidenceFields: [
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
  },
  {
    id: 'pipeline_ease',
    label: 'Ease of scripted Blender/glTF pipeline',
    weight: 10,
    evidenceFields: [
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
  },
  {
    id: 'presentation_options',
    label: 'Male/female or inclusive presentation options',
    weight: 5,
    evidenceFields: [
      'completedPresentationInspection',
      'adultPresentationOptions',
      'feasibilityRecord',
    ],
  },
]);

const PERFORMANCE_BUDGETS = Object.freeze({
  desktopTargetBytes: 6_000_000,
  desktopHardCeilingBytes: 10_000_000,
  mobileInteractiveTargetBytes: 3_000_000,
  geometryBufferTargetBytes: 134_217_728,
  geometryBufferHardCeilingBytes: 268_435_456,
  nativeTargetMedianFrameMs: 18.18,
  nativeTopBandMedianFrameMs: 16.67,
  lowPowerSimulationGracefulMedianFrameMs: 33.33,
});

/** @type {Readonly<Record<string, string>>} */
const CRITERION_CONTRACT_SHA256 = Object.freeze({
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
});

/** @param {unknown} value */
function sha256(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

/** @param {unknown} actual @param {unknown} expected */
function sameValue(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

/**
 * Validate the checked-in rubric against plan literals. The application reads
 * its scoring contract from JSON, while these guards prevent that contract
 * from drifting away from master-plan §8.3 or the approved SBLA-005 plan.
 *
 * @param {unknown} rubric
 * @returns {string[]}
 */
export function validateAssetScoreRubric(rubric) {
  const issues = [];
  if (rubric === null || typeof rubric !== 'object' || Array.isArray(rubric)) {
    return ['asset score rubric must be an object'];
  }

  const candidateRubric = /** @type {Partial<AssetScoreRubric>} */ (rubric);

  if (candidateRubric.schemaVersion !== 1)
    issues.push('rubric schemaVersion must be 1');
  if (candidateRubric.frozenBeforeCandidateMeasurement !== true) {
    issues.push('rubric must be frozen before candidate measurement');
  }
  if (
    !sameValue(candidateRubric.scoreScale, {
      minimum: 0,
      maximum: 5,
      allowedScores: [0, 1, 2, 3, 4, 5],
    })
  ) {
    issues.push('rubric scoreScale must contain only integer bands 0-5');
  }
  if (
    !sameValue(candidateRubric.missingMeasurementPolicy, {
      score: null,
      zeroRequiresCompletedMeasurement: true,
      blocksCandidateCompleteness: true,
    })
  ) {
    issues.push(
      'rubric missingMeasurementPolicy must use null and block completeness',
    );
  }
  if (
    !sameValue(candidateRubric.rejectionFloor, {
      criterionId: 'license_clarity',
      minimumScore: 4,
    })
  ) {
    issues.push('rubric license_clarity rejection floor must be 4');
  }

  if (!Array.isArray(candidateRubric.criteria)) {
    issues.push('rubric criteria must be an array');
    return issues;
  }
  const rawCriteria = /** @type {unknown[]} */ (candidateRubric.criteria);
  for (const [index, criterion] of rawCriteria.entries()) {
    if (
      criterion === null ||
      typeof criterion !== 'object' ||
      Array.isArray(criterion)
    ) {
      issues.push(`rubric criterion at index ${index} must be an object`);
    }
  }
  const criteria = /** @type {RubricCriterion[]} */ (
    rawCriteria.filter(
      (criterion) =>
        criterion !== null &&
        typeof criterion === 'object' &&
        !Array.isArray(criterion),
    )
  );
  if (rawCriteria.length !== PLAN_CRITERIA.length) {
    issues.push(
      `rubric must contain exactly ${PLAN_CRITERIA.length} criteria; received ${rawCriteria.length}`,
    );
  }

  for (const expected of PLAN_CRITERIA) {
    const criterion = criteria.find(({ id }) => id === expected.id);
    if (!criterion) {
      issues.push(`rubric missing criterion: ${expected.id}`);
      continue;
    }
    if (criterion.label !== expected.label) {
      issues.push(`${expected.id} label does not match master plan §8.3`);
    }
    if (criterion.weight !== expected.weight) {
      issues.push(
        `${expected.id} weight must be ${expected.weight}; received ${String(criterion.weight)}`,
      );
    }
    if (!sameValue(criterion.evidenceFields, expected.evidenceFields)) {
      issues.push(
        `${expected.id} evidenceFields do not match the frozen contract`,
      );
    }
    const rawBands = Array.isArray(criterion.bands) ? criterion.bands : [];
    for (const [index, band] of rawBands.entries()) {
      if (band === null || typeof band !== 'object' || Array.isArray(band)) {
        issues.push(`${expected.id} band at index ${index} must be an object`);
      }
    }
    const bands = /** @type {ScoreBand[]} */ (
      rawBands.filter(
        (band) =>
          band !== null && typeof band === 'object' && !Array.isArray(band),
      )
    );
    if (
      !Array.isArray(criterion.bands) ||
      bands.length !== rawBands.length ||
      !sameValue(
        bands.map(({ score }) => score),
        [0, 1, 2, 3, 4, 5],
      )
    ) {
      issues.push(
        `${expected.id} score bands must contain complete objects for 0-5`,
      );
    }
    for (const band of bands) {
      if (typeof band.rule !== 'string' || band.rule.trim() === '') {
        issues.push(`${expected.id} score ${band.score} requires a rule`);
      }
      if (
        band.conditions === null ||
        typeof band.conditions !== 'object' ||
        Array.isArray(band.conditions)
      ) {
        issues.push(`${expected.id} score ${band.score} requires conditions`);
      }
    }
    if (sha256(criterion) !== CRITERION_CONTRACT_SHA256[expected.id]) {
      issues.push(
        `${expected.id} exact criterion contract does not match the frozen rubric`,
      );
    }
  }

  const actualIds = criteria.map(({ id }) => id);
  const expectedIds = PLAN_CRITERIA.map(({ id }) => id);
  if (!sameValue(actualIds, expectedIds)) {
    issues.push(
      'rubric criterion ids and ordering must match master plan §8.3',
    );
  }
  if (
    criteria.reduce(
      (sum, criterion) => sum + Number(criterion.weight || 0),
      0,
    ) !== 100
  ) {
    issues.push('rubric criterion weights must total 100');
  }

  const performance = criteria.find(({ id }) => id === 'browser_performance');
  if (performance && !sameValue(performance.budgets, PERFORMANCE_BUDGETS)) {
    issues.push(
      'browser_performance desktopHardCeilingBytes and related frozen budgets do not match the approved plan',
    );
  }

  return issues;
}

/** @param {unknown} value @returns {unknown} */
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

const rubricPath = new URL(
  '../../docs/licenses/asset-score-rubric.json',
  import.meta.url,
);
const loadedRubric = /** @type {unknown} */ (
  JSON.parse(readFileSync(rubricPath, 'utf8'))
);
const rubricIssues = validateAssetScoreRubric(loadedRubric);
if (rubricIssues.length > 0) {
  throw new Error(`Invalid asset score rubric:\n${rubricIssues.join('\n')}`);
}

export const ASSET_SCORE_RUBRIC = /** @type {Readonly<AssetScoreRubric>} */ (
  deepFreeze(loadedRubric)
);

/**
 * Master plan §8.3 fixes these criteria and weights. Both the individual
 * weights and their sum are pinned by unit tests against literals. Runtime
 * criteria are derived from the validated JSON rubric, its single source of
 * truth, so neither a redistribution nor an unbalancing can pass silently.
 */
export const SPIKE_CRITERIA = Object.freeze(
  ASSET_SCORE_RUBRIC.criteria.map(({ id, label, weight }) =>
    Object.freeze({ key: id, label, weight }),
  ),
);

/** §8.3: reject any candidate scoring below this on licence clarity. */
export const LICENSE_CLARITY_FLOOR =
  ASSET_SCORE_RUBRIC.rejectionFloor.minimumScore;

export const MAX_SCORE = ASSET_SCORE_RUBRIC.scoreScale.maximum;

const VISUAL_CHECKS = Object.freeze([
  'noHoles',
  'outwardNormals',
  'materialsSurvive',
  'componentsNotOccluded',
  'usableProportions',
]);

const PRESENTATION_PARITY_CHECKS = Object.freeze([
  'requiredCoverage',
  'mapping',
  'separability',
  'artifactChecks',
]);

/** @type {Readonly<Record<string, readonly string[]>>} */
const LICENSE_TERM_STATUSES = Object.freeze({
  commercialUse: Object.freeze(['permitted', 'prohibited', 'conditional']),
  modification: Object.freeze(['permitted', 'prohibited', 'conditional']),
  webDistribution: Object.freeze(['permitted', 'prohibited', 'conditional']),
  attributionRequired: Object.freeze([
    'required',
    'not-required',
    'conditional',
  ]),
  aiProcessing: Object.freeze([
    'permitted',
    'prohibited',
    'not-restricted',
    'conditional',
  ]),
});

/**
 * Only these exact SBLA-004 records may use the one-time normalization path.
 * Any edited or newly invented free-text record must provide the structured
 * SBLA-005 measurement contract instead.
 * @type {Readonly<Record<string, string>>}
 */
const ACCEPTED_LEGACY_LICENSE_SHA256 = Object.freeze({
  'path-b-z-anatomy':
    '704facfbc69c029fea4ddcd5fe3bb9a657b72197d76ae9dbd97b8cd56c223696',
  'path-c-bodyparts3d':
    'a8a196ca9de8053646cc2c18a9ed9d670e1d4958c12bc85dcec5d648f292c5d5',
  'reference-openstax-ap2e':
    '1e74c1064c4424373c891578ea2563ddcf043f970eda2e4219caf9f40955a4f9',
});

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value */
function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** @param {unknown} value */
function isNonNegativeInteger(value) {
  return isNonNegativeNumber(value) && Number.isInteger(value);
}

/** @param {number} rate */
function rateBand(rate) {
  if (rate < 0.5) return 0;
  if (rate < 0.6) return 1;
  if (rate < 0.75) return 2;
  if (rate < 0.9) return 3;
  if (rate < 1) return 4;
  return 5;
}

/**
 * Derive a rubric score solely from structured evidence. Invalid or absent
 * evidence returns null: zero is reserved for a completed failed measurement.
 *
 * @param {string} criterionId
 * @param {unknown} evidence
 * @returns {{issues:string[], score:number|null}}
 */
export function deriveCriterionScore(criterionId, evidence) {
  const criterion = ASSET_SCORE_RUBRIC.criteria.find(
    ({ id }) => id === criterionId,
  );
  if (!criterion) {
    return {
      issues: [`unknown rubric criterion: ${criterionId}`],
      score: null,
    };
  }
  if (!isRecord(evidence)) {
    return {
      issues: [`${criterionId}: measurement evidence is missing`],
      score: null,
    };
  }

  const issues = [];
  for (const field of criterion.evidenceFields) {
    if (!Object.hasOwn(evidence, field) || evidence[field] === undefined) {
      issues.push(`${criterionId}: missing evidence field: ${field}`);
    }
  }
  if (issues.length > 0) return { issues, score: null };

  switch (criterionId) {
    case 'coverage_naming':
      return deriveCoverageScore(evidence);
    case 'mesh_separability':
      return deriveSeparabilityScore(evidence);
    case 'visual_quality':
      return deriveVisualScore(evidence);
    case 'browser_performance':
      return derivePerformanceScore(evidence);
    case 'license_clarity':
      return deriveLicenseScore(evidence);
    case 'pipeline_ease':
      return derivePipelineScore(evidence);
    case 'presentation_options':
      return derivePresentationScore(evidence);
    default:
      return {
        issues: [`unknown rubric criterion: ${criterionId}`],
        score: null,
      };
  }
}

/** @param {Record<string, unknown>} evidence */
function deriveCoverageScore(evidence) {
  const issues = [];
  const requiredValue = evidence.requiredTargetCount;
  const mappedValue = evidence.mappedTargetCount;
  const defectValue = evidence.materialMappingDefectCount;
  if (!isNonNegativeInteger(requiredValue) || requiredValue === 0)
    issues.push(
      'coverage_naming: requiredTargetCount must be a positive integer',
    );
  if (!isNonNegativeInteger(mappedValue))
    issues.push(
      'coverage_naming: mappedTargetCount must be a non-negative integer',
    );
  if (!isNonNegativeInteger(defectValue))
    issues.push(
      'coverage_naming: materialMappingDefectCount must be a non-negative integer',
    );
  if (
    isNonNegativeInteger(requiredValue) &&
    isNonNegativeInteger(mappedValue) &&
    Number(mappedValue) > Number(requiredValue)
  ) {
    issues.push(
      'coverage_naming: mappedTargetCount cannot exceed requiredTargetCount',
    );
  }
  if (typeof evidence.mappingManifest !== 'string' || !evidence.mappingManifest)
    issues.push('coverage_naming: mappingManifest must be a non-empty path');
  if (issues.length > 0) return { issues, score: null };
  const required = Number(requiredValue);
  const mapped = Number(mappedValue);
  const defects = Number(defectValue);
  if (defects > 0) return { issues: [], score: 0 };
  return { issues: [], score: rateBand(mapped / required) };
}

/** @param {Record<string, unknown>} evidence */
function deriveSeparabilityScore(evidence) {
  const issues = [];
  for (const field of ['expectedSelectableMeshCount', 'expectedMappingCount']) {
    if (!isNonNegativeInteger(evidence[field]) || evidence[field] === 0) {
      issues.push(`mesh_separability: ${field} must be a positive integer`);
    }
  }
  for (const field of [
    'selectableMeshCount',
    'validMappingCount',
    'duplicateMappingCount',
  ]) {
    if (!isNonNegativeInteger(evidence[field])) {
      issues.push(`mesh_separability: ${field} must be a non-negative integer`);
    }
  }
  if (
    isNonNegativeInteger(evidence.selectableMeshCount) &&
    isNonNegativeInteger(evidence.expectedSelectableMeshCount) &&
    Number(evidence.selectableMeshCount) >
      Number(evidence.expectedSelectableMeshCount)
  ) {
    issues.push(
      'mesh_separability: selectableMeshCount cannot exceed expectedSelectableMeshCount',
    );
  }
  if (
    isNonNegativeInteger(evidence.validMappingCount) &&
    isNonNegativeInteger(evidence.expectedMappingCount) &&
    Number(evidence.validMappingCount) > Number(evidence.expectedMappingCount)
  ) {
    issues.push(
      'mesh_separability: validMappingCount cannot exceed expectedMappingCount',
    );
  }
  if (typeof evidence.mappingManifest !== 'string' || !evidence.mappingManifest)
    issues.push('mesh_separability: mappingManifest must be a non-empty path');
  if (issues.length > 0) return { issues, score: null };
  const selectable = Number(evidence.selectableMeshCount);
  const expectedSelectable = Number(evidence.expectedSelectableMeshCount);
  const validMappings = Number(evidence.validMappingCount);
  const expectedMappings = Number(evidence.expectedMappingCount);
  const duplicates = Number(evidence.duplicateMappingCount);
  if (duplicates > 0) return { issues: [], score: 0 };
  const rate = Math.min(
    selectable / expectedSelectable,
    validMappings / expectedMappings,
  );
  return { issues: [], score: rateBand(rate) };
}

/** @param {Record<string, unknown>} evidence */
function deriveVisualScore(evidence) {
  const issues = [];
  const artifactChecks = isRecord(evidence.artifactChecks)
    ? evidence.artifactChecks
    : {};
  if (typeof evidence.deterministicNormalization !== 'boolean') {
    issues.push(
      'visual_quality: deterministicNormalization must be a boolean measurement',
    );
  }
  if (!isRecord(evidence.artifactChecks)) {
    issues.push('visual_quality: artifactChecks must be an object');
  } else {
    for (const check of VISUAL_CHECKS) {
      if (typeof artifactChecks[check] !== 'boolean') {
        issues.push(`visual_quality: artifactChecks.${check} must be boolean`);
      }
    }
  }
  for (const field of ['conversionManifest', 'posterArtifact']) {
    if (typeof evidence[field] !== 'string' || !evidence[field])
      issues.push(`visual_quality: ${field} must be a non-empty path`);
  }
  if (issues.length > 0) return { issues, score: null };
  if (!evidence.deterministicNormalization) return { issues: [], score: 0 };
  const passed = VISUAL_CHECKS.filter(
    (check) => artifactChecks[check] === true,
  ).length;
  return { issues: [], score: passed };
}

/** @param {Record<string, unknown>} evidence */
function derivePerformanceScore(evidence) {
  const issues = [];
  const nativeProfile = isRecord(evidence.nativeProfile)
    ? evidence.nativeProfile
    : {};
  const lowPowerSimulation = isRecord(evidence.lowPowerSimulation)
    ? evidence.lowPowerSimulation
    : {};
  for (const field of ['optimizedGlbBytes', 'geometryBufferBytes']) {
    if (!isNonNegativeInteger(evidence[field])) {
      issues.push(
        `browser_performance: ${field} must be a non-negative integer`,
      );
    }
  }
  if (!isRecord(evidence.nativeProfile)) {
    issues.push('browser_performance: nativeProfile must be an object');
  } else {
    if (nativeProfile.hardwareBacked !== true) {
      issues.push('browser_performance: nativeProfile must be hardware-backed');
    }
    if (!isNonNegativeNumber(nativeProfile.medianFrameMs)) {
      issues.push(
        'browser_performance: nativeProfile.medianFrameMs must be non-negative',
      );
    }
  }
  if (!isRecord(evidence.lowPowerSimulation)) {
    issues.push('browser_performance: lowPowerSimulation must be an object');
  } else {
    if (lowPowerSimulation.profileKind !== 'simulation') {
      issues.push(
        'browser_performance: lowPowerSimulation must be labelled simulation',
      );
    }
    for (const field of [
      'reducedLod',
      'cpuThrottlingDocumented',
      'swiftShader',
    ]) {
      if (lowPowerSimulation[field] !== true) {
        issues.push(
          `browser_performance: lowPowerSimulation.${field} must be true`,
        );
      }
    }
    if (!isNonNegativeNumber(lowPowerSimulation.medianFrameMs)) {
      issues.push(
        'browser_performance: lowPowerSimulation.medianFrameMs must be non-negative',
      );
    }
  }
  if (
    evidence.observedJsHeapBytes !== null &&
    !isNonNegativeInteger(evidence.observedJsHeapBytes)
  ) {
    issues.push(
      'browser_performance: observedJsHeapBytes must be null or a non-negative integer',
    );
  }
  if (
    evidence.observedJsHeapBytes === null &&
    (typeof evidence.observedJsHeapUnavailableReason !== 'string' ||
      !evidence.observedJsHeapUnavailableReason)
  ) {
    issues.push(
      'browser_performance: null observedJsHeapBytes requires an unavailable reason',
    );
  }
  if (typeof evidence.mobileFallbackPermitted !== 'boolean') {
    issues.push(
      'browser_performance: mobileFallbackPermitted must be a boolean measurement',
    );
  }
  if (
    typeof evidence.performanceRecord !== 'string' ||
    !evidence.performanceRecord
  ) {
    issues.push(
      'browser_performance: performanceRecord must be a non-empty path',
    );
  }
  if (issues.length > 0) return { issues, score: null };

  const bytes = Number(evidence.optimizedGlbBytes);
  const geometry = Number(evidence.geometryBufferBytes);
  const nativeMs = Number(nativeProfile.medianFrameMs);
  const simulationMs = Number(lowPowerSimulation.medianFrameMs);
  if (
    bytes > PERFORMANCE_BUDGETS.desktopHardCeilingBytes ||
    geometry > PERFORMANCE_BUDGETS.geometryBufferHardCeilingBytes ||
    nativeMs > 33.33 ||
    simulationMs > 50
  ) {
    return { issues: [], score: 0 };
  }
  if (
    bytes <= 6_000_000 &&
    bytes <= 3_000_000 &&
    geometry <= 67_108_864 &&
    nativeMs <= 16.67 &&
    simulationMs <= 33.33
  ) {
    return { issues: [], score: 5 };
  }
  if (
    bytes <= 6_000_000 &&
    geometry <= 100_663_296 &&
    nativeMs <= 18.18 &&
    simulationMs <= 33.33 &&
    evidence.mobileFallbackPermitted === true
  ) {
    return { issues: [], score: 4 };
  }
  if (
    geometry <= 134_217_728 &&
    nativeMs <= 18.18 &&
    simulationMs <= 33.33 &&
    evidence.mobileFallbackPermitted === true
  ) {
    return { issues: [], score: 3 };
  }
  if (geometry <= 201_326_592 && nativeMs <= 25 && simulationMs <= 40) {
    return { issues: [], score: 2 };
  }
  return { issues: [], score: 1 };
}

/** @param {Record<string, unknown>} evidence */
function deriveLicenseScore(evidence) {
  const issues = [];
  if (
    typeof evidence.primarySourceUrl !== 'string' ||
    !/^https?:\/\/\S+$/.test(evidence.primarySourceUrl)
  ) {
    issues.push(
      'license_clarity: primarySourceUrl must be an authoritative http(s) URL',
    );
  }
  if (
    typeof evidence.accessedOn !== 'string' ||
    !ISO_DATE.test(evidence.accessedOn)
  ) {
    issues.push('license_clarity: accessedOn must be an ISO date (YYYY-MM-DD)');
  }
  if (evidence.completedLicenseReview !== true) {
    issues.push('license_clarity: completedLicenseReview must be true');
  }
  if (typeof evidence.authoritativePrimaryTerms !== 'boolean') {
    issues.push(
      'license_clarity: authoritativePrimaryTerms must be a reviewed boolean fact',
    );
  }
  if (evidence.componentTermsReviewed !== true) {
    issues.push('license_clarity: componentTermsReviewed must be true');
  }

  const reviewedTerms = isRecord(evidence.reviewedTerms)
    ? evidence.reviewedTerms
    : {};
  if (!isRecord(evidence.reviewedTerms)) {
    issues.push('license_clarity: reviewedTerms must be an object');
  }
  const expectedTermKeys = Object.keys(LICENSE_TERM_STATUSES);
  for (const key of Object.keys(reviewedTerms)) {
    if (!Object.hasOwn(LICENSE_TERM_STATUSES, key)) {
      issues.push(`license_clarity: unknown reviewed term: ${key}`);
    }
  }
  for (const termKey of expectedTermKeys) {
    const term = reviewedTerms[termKey];
    if (!isRecord(term)) {
      issues.push(`license_clarity: missing reviewed term: ${termKey}`);
      continue;
    }
    const acceptedStatuses = LICENSE_TERM_STATUSES[termKey] ?? [];
    if (!acceptedStatuses.includes(String(term.status))) {
      issues.push(
        `license_clarity: reviewedTerms.${termKey} status is not recognized`,
      );
    }
    if (
      typeof term.sourceUrl !== 'string' ||
      !/^https?:\/\/\S+$/.test(term.sourceUrl) ||
      typeof term.accessedOn !== 'string' ||
      !ISO_DATE.test(term.accessedOn) ||
      term.reviewed !== true
    ) {
      issues.push(
        `license_clarity: reviewedTerms.${termKey} requires sourceUrl, accessedOn, and reviewed:true`,
      );
    }
  }
  if (typeof evidence.licenseRecord !== 'string' || !evidence.licenseRecord) {
    issues.push('license_clarity: licenseRecord must be a non-empty path');
  }
  if (!isNonNegativeInteger(evidence.materialContradictionCount)) {
    issues.push(
      'license_clarity: materialContradictionCount must be a non-negative integer',
    );
  }
  if (typeof evidence.mixedComponentTermsUnresolved !== 'boolean') {
    issues.push(
      'license_clarity: mixedComponentTermsUnresolved must be boolean',
    );
  }
  if (
    evidence.historicalNoticeStatus !== 'none' &&
    evidence.historicalNoticeStatus !== 'conservatively-handled'
  ) {
    issues.push(
      'license_clarity: historicalNoticeStatus must be none or conservatively-handled',
    );
  }

  const contradictions = Number(evidence.materialContradictionCount);
  const derivedConflict =
    evidence.authoritativePrimaryTerms === false
      ? 'no-authoritative-terms'
      : contradictions >= 3
        ? 'three-plus-contradictions'
        : contradictions >= 1
          ? 'one-or-two-contradictions'
          : evidence.mixedComponentTermsUnresolved === true
            ? 'unresolved-mixed'
            : evidence.historicalNoticeStatus === 'conservatively-handled'
              ? 'conservatively-handled'
              : 'none';
  if (evidence.conflictStatus !== derivedConflict) {
    issues.push(
      `license_clarity: conflictStatus ${String(evidence.conflictStatus)} contradicts the structured license facts`,
    );
  }
  if (issues.length > 0) return { issues, score: null };

  /** @type {Readonly<Record<string, number>>} */
  const scoreByConflict = Object.freeze({
    'no-authoritative-terms': 0,
    'three-plus-contradictions': 1,
    'one-or-two-contradictions': 2,
    'unresolved-mixed': 3,
    'conservatively-handled': 4,
    none: 5,
  });
  const score = scoreByConflict[derivedConflict];
  return score === undefined
    ? {
        issues: [
          'license_clarity: conflictStatus is not a recognized rubric state',
        ],
        score: null,
      }
    : { issues: [], score };
}

/** @param {Record<string, unknown>} evidence */
function derivePipelineScore(evidence) {
  const issues = [];
  for (const field of [
    'pinnedToolVersions',
    'sourceInputsPinned',
    'completedAttempt',
    'acceptedGlbProduced',
    'structureParity',
    'nondeterminismExplained',
    'authorizedOutputsByteIdentical',
  ]) {
    if (typeof evidence[field] !== 'boolean')
      issues.push(`pipeline_ease: ${field} must be boolean`);
  }
  for (const field of [
    'scriptedStepCount',
    'manualStepCount',
    'repeatedRunCount',
  ]) {
    if (!isNonNegativeInteger(evidence[field]))
      issues.push(`pipeline_ease: ${field} must be a non-negative integer`);
  }
  if (
    typeof evidence.conversionManifest !== 'string' ||
    !evidence.conversionManifest
  ) {
    issues.push('pipeline_ease: conversionManifest must be a non-empty path');
  }
  if (evidence.completedAttempt !== true) {
    issues.push(
      'pipeline_ease: completedAttempt must be true to assign a score',
    );
  }
  if (issues.length > 0) return { issues, score: null };
  const manualSteps = Number(evidence.manualStepCount);
  const repeatedRuns = Number(evidence.repeatedRunCount);
  if (evidence.acceptedGlbProduced === false) return { issues: [], score: 0 };
  if (
    evidence.pinnedToolVersions === true &&
    evidence.sourceInputsPinned === true &&
    manualSteps === 0 &&
    repeatedRuns >= 2 &&
    evidence.structureParity === true &&
    evidence.authorizedOutputsByteIdentical === true
  ) {
    return { issues: [], score: 5 };
  }
  if (
    evidence.pinnedToolVersions === true &&
    evidence.sourceInputsPinned === true &&
    manualSteps === 0 &&
    repeatedRuns >= 2 &&
    evidence.structureParity === true &&
    evidence.nondeterminismExplained === true
  ) {
    return { issues: [], score: 4 };
  }
  if (
    evidence.pinnedToolVersions === true &&
    evidence.sourceInputsPinned === true &&
    manualSteps <= 1 &&
    repeatedRuns >= 2 &&
    evidence.structureParity === true
  ) {
    return { issues: [], score: 3 };
  }
  if (
    evidence.sourceInputsPinned === true &&
    manualSteps >= 2 &&
    manualSteps <= 3
  ) {
    return { issues: [], score: 2 };
  }
  if (manualSteps >= 4) return { issues: [], score: 1 };
  return {
    issues: [
      'pipeline_ease: completed evidence does not satisfy any frozen score band',
    ],
    score: null,
  };
}

/** @param {Record<string, unknown>} evidence */
function derivePresentationScore(evidence) {
  const issues = [];
  if (evidence.completedPresentationInspection !== true) {
    issues.push(
      'presentation_options: completedPresentationInspection must be true',
    );
  }
  const rawOptions = Array.isArray(evidence.adultPresentationOptions)
    ? evidence.adultPresentationOptions
    : [];
  if (!Array.isArray(evidence.adultPresentationOptions)) {
    issues.push(
      'presentation_options: adultPresentationOptions must be an array',
    );
  }
  if (
    typeof evidence.feasibilityRecord !== 'string' ||
    !evidence.feasibilityRecord
  ) {
    issues.push(
      'presentation_options: feasibilityRecord must be a non-empty path',
    );
  }
  const options = [];
  const ids = new Set();
  for (const [index, value] of rawOptions.entries()) {
    if (!isRecord(value)) {
      issues.push(
        `presentation_options: option at index ${index} must be an object`,
      );
      continue;
    }
    const rawId = typeof value.id === 'string' ? value.id.trim() : '';
    const optionName = rawId || `<index ${index}>`;
    if (!rawId) {
      issues.push(
        `presentation_options: option at index ${index} requires a non-empty id`,
      );
    } else if (ids.has(rawId)) {
      issues.push(`presentation_options: duplicate option id: ${rawId}`);
    } else {
      ids.add(rawId);
    }
    if (typeof value.label !== 'string' || !value.label.trim()) {
      issues.push(
        `presentation_options: option ${optionName} requires a label`,
      );
    }
    if (typeof value.evidenceRef !== 'string' || !value.evidenceRef.trim()) {
      issues.push(
        `presentation_options: option ${optionName} requires an evidenceRef`,
      );
    }
    const parity = isRecord(value.parity) ? value.parity : null;
    if (
      parity === null ||
      !PRESENTATION_PARITY_CHECKS.every(
        (check) => typeof parity[check] === 'boolean',
      )
    ) {
      issues.push(
        `presentation_options: option ${optionName} parity is missing or incomplete`,
      );
      continue;
    }
    options.push({ id: rawId, parity });
  }
  if (issues.length > 0) return { issues, score: null };
  const count = options.length;
  const parity = options.every((option) =>
    PRESENTATION_PARITY_CHECKS.every((check) => option.parity[check] === true),
  );
  if (count === 0) return { issues: [], score: 0 };
  if (count === 1) return { issues: [], score: parity ? 2 : 1 };
  if (!parity) return { issues: [], score: 3 };
  return { issues: [], score: count === 2 ? 4 : 5 };
}

/** Only these statuses gate behaviour. Anything else is an inventory defect. */
export const VALID_STATUSES = Object.freeze(['inventoried', 'placeholder']);

/**
 * §18 SBLA-004 requires "licence fields complete". A candidate missing any of
 * these cannot be evaluated; the gate fails closed rather than assuming.
 */
export const REQUIRED_LICENSE_FIELDS = Object.freeze([
  'name',
  'version',
  'source',
  'accessedOn',
  'commercialUse',
  'shareAlike',
  'modification',
  'attributionRequired',
  'webDistribution',
]);

const URL_FIELDS = Object.freeze(['source']);
const DATE_FIELDS = Object.freeze(['accessedOn']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @typedef {object} SpikeCandidate
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [status]
 * @property {boolean} [acquired]
 * @property {boolean} [selectionEligible]
 * @property {string} [ineligibleReason]
 * @property {Record<string, unknown>} [license]
 * @property {Record<string, number|null>} [scores]
 * @property {Record<string, Record<string, unknown>|null>} [measurements]
 * @property {number|null} [weightedTotal]
 */

/**
 * Presence is not enough: the acceptance criterion is that each fact carries a
 * real source URL and a real access date, so those two are format-checked.
 *
 * @param {SpikeCandidate} candidate
 */
export function validateLicenseFields(candidate) {
  const id = candidate.id ?? '<unidentified>';
  const license = candidate.license ?? {};
  const issues = [];

  for (const field of REQUIRED_LICENSE_FIELDS) {
    const value = license[field];
    if (value === undefined || value === null || value === '') {
      issues.push(`${id}: missing licence field: ${field}`);
      continue;
    }

    if (URL_FIELDS.includes(field) && !/^https?:\/\/\S+$/.test(String(value))) {
      issues.push(
        `${id}: licence field ${field} must be an http(s) URL; received ${String(value)}`,
      );
    }

    if (DATE_FIELDS.includes(field) && !ISO_DATE.test(String(value))) {
      issues.push(
        `${id}: licence field ${field} must be an ISO date (YYYY-MM-DD); received ${String(value)}`,
      );
    }
  }

  return issues;
}

/**
 * SBLA-004 license records predate the general measurement envelope. Normalize
 * those already structured primary-source facts into the frozen license rubric
 * without trusting prose scores or candidate identities.
 *
 * @param {SpikeCandidate} candidate
 */
function normalizeLicenseMeasurement(candidate) {
  const license = isRecord(candidate.license) ? candidate.license : {};
  const acceptedHash = ACCEPTED_LEGACY_LICENSE_SHA256[candidate.id ?? ''];
  if (acceptedHash === undefined || sha256(license) !== acceptedHash) {
    return null;
  }
  const componentLicences = Array.isArray(license.componentLicences)
    ? license.componentLicences
    : [];
  const hasMixedComponents = componentLicences.length > 0;
  const hasHistoricalNotice =
    typeof license.historicalNotice === 'string' &&
    license.historicalNotice.length > 0;
  const conflictStatus = hasMixedComponents
    ? 'unresolved-mixed'
    : hasHistoricalNotice
      ? 'conservatively-handled'
      : 'none';
  const sourceUrl = license.source;
  const accessedOn = license.accessedOn;
  /** @param {string|null} status */
  const reviewedTerm = (status) => ({
    status: status ?? 'unreviewed',
    sourceUrl,
    accessedOn,
    reviewed: status !== null,
  });

  const commercialUse = String(license.commercialUse ?? '');
  const modification = String(license.modification ?? '');
  const webDistribution = String(license.webDistribution ?? '');
  const aiProcessing = String(license.aiProcessingPermitted ?? '');
  const commercialStatus = commercialUse.startsWith('PROHIBITED')
    ? 'prohibited'
    : commercialUse === 'permitted'
      ? 'permitted'
      : commercialUse.startsWith('permitted for')
        ? 'conditional'
        : null;
  const modificationStatus =
    modification === 'permitted'
      ? 'permitted'
      : modification === 'permitted non-commercially'
        ? 'conditional'
        : modification.startsWith('PROHIBITED')
          ? 'prohibited'
          : null;
  const webDistributionStatus =
    webDistribution === 'permitted'
      ? 'permitted'
      : webDistribution === 'permitted non-commercially'
        ? 'conditional'
        : webDistribution.startsWith('PROHIBITED')
          ? 'prohibited'
          : null;
  const attributionStatus =
    license.attributionRequired === true
      ? 'required'
      : license.attributionRequired === false
        ? 'not-required'
        : null;
  const aiProcessingStatus = aiProcessing.startsWith('PROHIBITED')
    ? 'prohibited'
    : aiProcessing === 'not restricted by the licence text'
      ? 'not-restricted'
      : null;

  return {
    primarySourceUrl: license.source,
    accessedOn: license.accessedOn,
    completedLicenseReview: true,
    authoritativePrimaryTerms: true,
    componentTermsReviewed: true,
    reviewedTerms: {
      commercialUse: reviewedTerm(commercialStatus),
      modification: reviewedTerm(modificationStatus),
      webDistribution: reviewedTerm(webDistributionStatus),
      attributionRequired: reviewedTerm(attributionStatus),
      aiProcessing: reviewedTerm(aiProcessingStatus),
    },
    materialContradictionCount: 0,
    mixedComponentTermsUnresolved: hasMixedComponents,
    historicalNoticeStatus: hasHistoricalNotice
      ? 'conservatively-handled'
      : 'none',
    conflictStatus,
    licenseRecord: 'docs/licenses/asset-candidates.json',
  };
}

/**
 * Evaluate one candidate deterministically. Never throws on bad data: a
 * malformed score becomes a reported issue so a multi-candidate inventory
 * surfaces every problem in one run.
 *
 * @param {SpikeCandidate} candidate
 */
export function evaluateCandidate(candidate) {
  if (
    candidate === null ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ) {
    return {
      id: '<invalid>',
      name: '<invalid>',
      status: '<invalid>',
      licenceIssues: [],
      issues: ['candidate must be an object'],
      unmeasured: [],
      complete: false,
      weightedTotal: null,
      rejected: false,
      rejectionReason: null,
      malformed: true,
    };
  }

  const id = candidate.id ?? '<unidentified>';
  const status = candidate.status ?? 'inventoried';
  const scores = candidate.scores ?? {};
  const measurements = isRecord(candidate.measurements)
    ? candidate.measurements
    : {};
  const issues = [];
  const unmeasured = [];
  let weighted = 0;

  const knownCriteria = new Set(SPIKE_CRITERIA.map(({ key }) => key));
  const suppliedScoreKeys =
    scores !== null && typeof scores === 'object' && !Array.isArray(scores)
      ? Object.keys(scores)
      : [];
  if (scores === null || typeof scores !== 'object' || Array.isArray(scores)) {
    issues.push(`${id}: scores must be an object`);
  }
  for (const key of suppliedScoreKeys) {
    if (!knownCriteria.has(key)) {
      issues.push(`${id}: unknown score criterion: ${key}`);
    }
  }

  if (!VALID_STATUSES.includes(status)) {
    issues.push(
      `${id}: unknown status "${status}"; expected one of ${VALID_STATUSES.join(', ')}`,
    );
  }

  const isPlaceholder = status === 'placeholder';
  if (isPlaceholder && candidate.acquired !== false) {
    issues.push(`${id}: placeholder candidates must set acquired:false`);
  }

  for (const criterion of SPIKE_CRITERIA) {
    const value = scores[criterion.key];

    if (value === undefined || value === null) {
      unmeasured.push(criterion.key);
      continue;
    }

    if (isPlaceholder) {
      issues.push(`${id}: placeholder candidates must keep all scores null`);
      continue;
    }

    if (!ASSET_SCORE_RUBRIC.scoreScale.allowedScores.includes(value)) {
      issues.push(
        `${id}: ${criterion.key} must match a rubric score band (integer 0-${MAX_SCORE}); received ${String(value)}`,
      );
      continue;
    }

    const evidence =
      measurements[criterion.key] ??
      (criterion.key === 'license_clarity'
        ? normalizeLicenseMeasurement(candidate)
        : null);
    const derived = deriveCriterionScore(criterion.key, evidence);
    issues.push(...derived.issues.map((issue) => `${id}: ${issue}`));
    if (derived.score === null) continue;
    if (derived.score !== value) {
      issues.push(
        `${id}: ${criterion.key} score ${value} does not match evidence-derived score ${derived.score}`,
      );
      continue;
    }

    weighted += (value / MAX_SCORE) * criterion.weight;
  }

  const clarity = scores.license_clarity;
  const belowFloor =
    typeof clarity === 'number' && clarity < LICENSE_CLARITY_FLOOR;
  const acknowledged = candidate.selectionEligible === false;
  // A candidate can be ineligible for reasons the clarity score does not
  // capture - NonCommercial terms, an AI-ingestion prohibition - so an explicit
  // selectionEligible:false is honoured on its own.
  const ineligible = belowFloor || acknowledged;

  if (ineligible) {
    for (const criterion of SPIKE_CRITERIA) {
      if (criterion.key === 'license_clarity') continue;
      if (
        scores[criterion.key] !== null &&
        scores[criterion.key] !== undefined
      ) {
        issues.push(
          `${id}: ineligible candidates must keep technical scores null: ${criterion.key}`,
        );
      }
      if (
        Object.hasOwn(measurements, criterion.key) &&
        measurements[criterion.key] !== null
      ) {
        issues.push(
          `${id}: ineligible candidates must not retain technical measurements: ${criterion.key}`,
        );
      }
    }
  }

  // §8.3 rejection is an outcome, not a repo defect - but it must be recorded
  // deliberately. An unacknowledged sub-floor candidate fails the gate.
  if (belowFloor && !acknowledged) {
    issues.push(
      `${id}: licence clarity ${clarity} is below the §8.3 floor of ${LICENSE_CLARITY_FLOOR} and the record does not set selectionEligible:false with a reason`,
    );
  }
  if (acknowledged && !candidate.ineligibleReason) {
    issues.push(`${id}: selectionEligible:false requires an ineligibleReason`);
  }

  const validUnselectedPlaceholder =
    isPlaceholder &&
    candidate.acquired === false &&
    SPIKE_CRITERIA.every(
      (criterion) =>
        scores[criterion.key] === undefined || scores[criterion.key] === null,
    );
  const licenceIssues = validUnselectedPlaceholder
    ? []
    : validateLicenseFields(candidate);
  const scoreEvidenceComplete =
    !isPlaceholder &&
    unmeasured.length === 0 &&
    issues.length === 0 &&
    licenceIssues.length === 0;
  const computedWeightedTotal = scoreEvidenceComplete
    ? Math.round(weighted * 100) / 100
    : null;
  if (
    Object.hasOwn(candidate, 'weightedTotal') &&
    candidate.weightedTotal !== computedWeightedTotal
  ) {
    issues.push(
      `${id}: recorded weightedTotal ${String(candidate.weightedTotal)} does not match computed ${String(computedWeightedTotal)}`,
    );
  }
  const complete = scoreEvidenceComplete && issues.length === 0;

  return {
    id,
    name: candidate.name ?? id,
    status,
    licenceIssues,
    issues,
    unmeasured,
    complete,
    weightedTotal: complete ? computedWeightedTotal : null,
    rejected: ineligible,
    rejectionReason: acknowledged
      ? (candidate.ineligibleReason ?? 'recorded as ineligible')
      : belowFloor
        ? `licence clarity ${clarity} is below the required floor of ${LICENSE_CLARITY_FLOOR} (master plan §8.3)`
        : null,
  };
}

/**
 * Evaluate a whole inventory. Fails closed on a missing, empty, or non-array
 * candidate list: losing the candidates is the most damaging malformation, and
 * an empty run must never report success.
 *
 * @param {{candidates?: unknown, reverifyBy?: unknown}} inventory
 * @param {string} [asOfDate]
 */
export function evaluateInventory(
  inventory,
  asOfDate = new Date().toISOString().slice(0, 10),
) {
  const raw = inventory?.candidates;

  if (!Array.isArray(raw)) {
    return {
      issues: [
        `inventory.candidates must be an array; received ${raw === undefined ? 'undefined' : String(raw === null ? 'null' : typeof raw)}`,
      ],
      results: [],
    };
  }

  if (raw.length === 0) {
    return {
      issues: [
        'inventory.candidates is empty; an inventory with no candidates cannot pass',
      ],
      results: [],
    };
  }

  const results = raw.map((candidate) => evaluateCandidate(candidate));
  const issues = [];
  const seen = new Set();

  if (Object.hasOwn(inventory, 'reverifyBy')) {
    if (
      typeof inventory.reverifyBy !== 'string' ||
      !ISO_DATE.test(inventory.reverifyBy)
    ) {
      issues.push('inventory.reverifyBy must be an ISO date (YYYY-MM-DD)');
    } else if (!ISO_DATE.test(asOfDate)) {
      issues.push('inventory evaluation date must be an ISO date (YYYY-MM-DD)');
    } else if (inventory.reverifyBy < asOfDate) {
      issues.push(
        `inventory licence evidence expired on ${inventory.reverifyBy}; re-verify before scoring on ${asOfDate}`,
      );
    }
  }

  for (const result of results) {
    if (!result.malformed && seen.has(result.id))
      issues.push(`duplicate candidate id: ${result.id}`);
    if (!result.malformed) seen.add(result.id);
    issues.push(...result.licenceIssues, ...result.issues);
  }

  return { issues, results };
}
