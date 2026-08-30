/**
 * Master plan §8.3 fixes these criteria and weights. The weights must sum to
 * 100; the unit test asserts it so a future edit cannot silently unbalance the
 * scorecard.
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

/**
 * @typedef {object} SpikeCandidate
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [status]
 * @property {Record<string, unknown>} [license]
 * @property {Record<string, number|null>} [scores]
 */

/** @param {SpikeCandidate} candidate */
export function validateLicenseFields(candidate) {
  const id = candidate.id ?? '<unidentified>';
  const license = candidate.license ?? {};
  const issues = [];

  for (const field of REQUIRED_LICENSE_FIELDS) {
    const value = license[field];
    if (value === undefined || value === null || value === '') {
      issues.push(`${id}: missing licence field: ${field}`);
    }
  }

  return issues;
}

/**
 * Evaluate one candidate deterministically.
 *
 * Returns a plain object with stable key order so repeated runs are
 * byte-identical. An unmeasured criterion yields `weightedTotal: null` — the
 * spike must not invent a number for work SBLA-005 has not done yet.
 *
 * @param {SpikeCandidate} candidate
 */
export function evaluateCandidate(candidate) {
  const id = candidate.id ?? '<unidentified>';
  const scores = candidate.scores ?? {};
  const unmeasured = [];
  let weighted = 0;

  for (const criterion of SPIKE_CRITERIA) {
    const value = scores[criterion.key];

    if (value === undefined || value === null) {
      unmeasured.push(criterion.key);
      continue;
    }

    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > MAX_SCORE
    ) {
      throw new RangeError(
        `${id}: ${criterion.key} must be a number between 0 and ${MAX_SCORE}; received ${String(value)}`,
      );
    }

    weighted += (value / MAX_SCORE) * criterion.weight;
  }

  const clarity = scores.license_clarity;
  const clarityKnown = typeof clarity === 'number';
  const rejected = clarityKnown && clarity < LICENSE_CLARITY_FLOOR;

  return {
    id,
    name: candidate.name ?? id,
    licenceIssues: validateLicenseFields(candidate),
    unmeasured,
    complete: unmeasured.length === 0,
    weightedTotal:
      unmeasured.length === 0 ? Math.round(weighted * 100) / 100 : null,
    rejected,
    rejectionReason: rejected
      ? `licence clarity ${clarity} is below the required floor of ${LICENSE_CLARITY_FLOOR} (master plan §8.3)`
      : null,
  };
}

/** @param {{candidates?: readonly SpikeCandidate[]}} inventory */
export function evaluateInventory(inventory) {
  const candidates = inventory.candidates ?? [];
  return candidates.map((candidate) => evaluateCandidate(candidate));
}
