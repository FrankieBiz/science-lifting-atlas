/**
 * Master plan §8.3 fixes these criteria and weights. Both the individual
 * weights and their sum are pinned by unit tests against literals, so neither a
 * redistribution nor an unbalancing can pass silently.
 */
export const SPIKE_CRITERIA = Object.freeze([
  {
    key: 'coverage_naming',
    label: 'Anatomical coverage and naming accuracy',
    weight: 20,
  },
  {
    key: 'mesh_separability',
    label: 'Mesh separability and mapping',
    weight: 15,
  },
  {
    key: 'visual_quality',
    label: 'Visual quality after optimization',
    weight: 15,
  },
  { key: 'browser_performance', label: 'Browser performance', weight: 15 },
  {
    key: 'license_clarity',
    label: 'License clarity and future flexibility',
    weight: 20,
  },
  {
    key: 'pipeline_ease',
    label: 'Ease of scripted Blender/glTF pipeline',
    weight: 10,
  },
  {
    key: 'presentation_options',
    label: 'Male/female or inclusive presentation options',
    weight: 5,
  },
]);

/** §8.3: reject any candidate scoring below this on licence clarity. */
export const LICENSE_CLARITY_FLOOR = 4;

export const MAX_SCORE = 5;

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

    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > MAX_SCORE
    ) {
      issues.push(
        `${id}: ${criterion.key} must be a number between 0 and ${MAX_SCORE}; received ${String(value)}`,
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
