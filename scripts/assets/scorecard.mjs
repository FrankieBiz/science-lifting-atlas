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
      'commercialUse',
      'modification',
      'webDistribution',
      'attributionRequirements',
      'aiProcessingTerms',
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
      'scriptedStepCount',
      'manualStepCount',
      'repeatedRunCount',
      'structureParity',
      'conversionManifest',
    ],
  },
  {
    id: 'presentation_options',
    label: 'Male/female or inclusive presentation options',
    weight: 5,
    evidenceFields: [
      'adultPresentationOptions',
      'optionParityChecks',
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
    if (
      !Array.isArray(criterion.bands) ||
      !sameValue(
        criterion.bands.map(({ score }) => score),
        [0, 1, 2, 3, 4, 5],
      )
    ) {
      issues.push(`${expected.id} must define ordered score bands 0-5`);
      continue;
    }
    for (const band of criterion.bands) {
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
  const complete =
    !isPlaceholder &&
    unmeasured.length === 0 &&
    issues.length === 0 &&
    licenceIssues.length === 0;

  return {
    id,
    name: candidate.name ?? id,
    status,
    licenceIssues,
    issues,
    unmeasured,
    complete,
    weightedTotal: complete ? Math.round(weighted * 100) / 100 : null,
    rejected: ineligible,
    rejectionReason: belowFloor
      ? `licence clarity ${clarity} is below the required floor of ${LICENSE_CLARITY_FLOOR} (master plan §8.3)`
      : acknowledged
        ? (candidate.ineligibleReason ?? 'recorded as ineligible')
        : null,
  };
}

/**
 * Evaluate a whole inventory. Fails closed on a missing, empty, or non-array
 * candidate list: losing the candidates is the most damaging malformation, and
 * an empty run must never report success.
 *
 * @param {{candidates?: unknown}} inventory
 */
export function evaluateInventory(inventory) {
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

  for (const result of results) {
    if (!result.malformed && seen.has(result.id))
      issues.push(`duplicate candidate id: ${result.id}`);
    if (!result.malformed) seen.add(result.id);
    issues.push(...result.licenceIssues, ...result.issues);
  }

  return { issues, results };
}
