import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const EXPECTED_DECISION =
  'approve-2d-authoritative-hybrid-with-bounded-bodyparts3d-enhancement';

export const EXPECTED_MISSING_TARGET_IDS = Object.freeze([
  'latissimus-dorsi',
  'rectus-abdominis',
  'internal-oblique',
  'transversus-abdominis',
  'multifidus',
]);

const EXPECTED_EVIDENCE_PATHS = Object.freeze([
  'docs/licenses/bodyparts3d-mesh-mapping.json',
  'docs/licenses/bodyparts3d-feasibility.json',
  'docs/licenses/bodyparts3d-performance.json',
]);

const EXPECTED_BASE_URL =
  'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/';
const EXPECTED_DATASET_VERSION =
  'BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction';
const EXPECTED_LICENSE_SOURCE =
  'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html';
const EXPECTED_ATTRIBUTION =
  'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International';

/** @param {unknown} value */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {unknown} left @param {unknown} right */
function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** @param {unknown} values */
function sameStringSet(values, expected) {
  return (
    Array.isArray(values) &&
    values.length === expected.length &&
    [...values].sort().join('\n') === [...expected].sort().join('\n')
  );
}

/**
 * @param {{
 *   decision?: any,
 *   inventory?: any,
 *   mapping?: any,
 *   feasibility?: any,
 *   evidenceDigests?: Record<string, string>
 * }} input
 */
export function validateAssetDecision({
  decision,
  inventory,
  mapping,
  feasibility,
  evidenceDigests,
}) {
  const issues = [];

  if (!isRecord(decision)) return ['decision must be a JSON object'];
  if (decision.schemaVersion !== 1) issues.push('schemaVersion must be 1');
  if (decision.taskId !== 'SBLA-006') issues.push('taskId must be SBLA-006');
  if (decision.status !== 'approved') issues.push('status must be approved');
  if (decision.decision !== EXPECTED_DECISION) {
    issues.push(`decision must be ${EXPECTED_DECISION}`);
  }

  if (decision.ownerApproval?.approved !== true) {
    issues.push('ownerApproval.approved must be true');
  }
  if (
    typeof decision.ownerApproval?.authorityBasis !== 'string' ||
    decision.ownerApproval.authorityBasis.length === 0 ||
    typeof decision.ownerApproval?.recordedBy !== 'string' ||
    decision.ownerApproval.recordedBy.length === 0 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(decision.ownerApproval?.approvedOn ?? '')
  ) {
    issues.push(
      'ownerApproval must record approval date, authority basis, and recorder',
    );
  }

  if (
    decision.cost?.purchaseRequired !== false ||
    decision.cost?.purchaseUsd !== 0 ||
    decision.cost?.recurringUsd !== 0
  ) {
    issues.push(
      'the approved decision must require no purchase and record $0 purchase and recurring cost',
    );
  }

  if (
    decision.baseline2d?.type !==
      'project-authored-evidence-reviewed-semantic-vector-and-text' ||
    decision.baseline2d?.authoritativeForAllRequiredTargets !== true ||
    decision.baseline2d?.thirdPartyAssetSelected !== false ||
    decision.baseline2d?.productionStatus !==
      'deferred-to-SBLA-008-through-SBLA-013'
  ) {
    issues.push(
      'baseline2d must be the authoritative non-WebGL path for all required targets',
    );
  }

  const candidate = inventory?.candidates?.find?.(
    (entry) => entry?.id === 'path-c-bodyparts3d',
  );
  if (
    !candidate ||
    candidate.selectionEligible === false ||
    candidate.weightedTotal !== 73 ||
    candidate.scores?.license_clarity < 4
  ) {
    issues.push(
      'the selected enhancement must remain the eligible 73/100 BodyParts3D candidate with license clarity at least 4/5',
    );
  }
  if (
    candidate?.selection?.status !== 'approved-bounded-enhancement' ||
    candidate?.selection?.role !== 'optional-progressive-enhancement-only' ||
    candidate?.selection?.decisionRecord !==
      'docs/licenses/anatomy-asset-decision.json'
  ) {
    issues.push(
      'candidate inventory must record the approved bounded enhancement selection',
    );
  }

  if (
    decision.enhancement3d?.candidateId !== 'path-c-bodyparts3d' ||
    decision.enhancement3d?.role !== 'optional-progressive-enhancement-only' ||
    decision.enhancement3d?.datasetVersion !== EXPECTED_DATASET_VERSION ||
    decision.enhancement3d?.datasetVersion !== mapping?.datasetVersion ||
    decision.enhancement3d?.sourceBaseUrl !== EXPECTED_BASE_URL ||
    decision.enhancement3d?.sourceBaseUrl !== mapping?.source?.baseUrl
  ) {
    issues.push(
      'enhancement3d must identify the exact bounded BodyParts3D 4.0 source and role',
    );
  }

  if (!sameJson(decision.enhancement3d?.archives, mapping?.source?.archives)) {
    issues.push(
      'enhancement3d.archives must exactly match the checksum-pinned SBLA-005 source archives',
    );
  }

  if (
    decision.enhancement3d?.license?.name !==
      'Creative Commons Attribution 4.0 International' ||
    decision.enhancement3d?.license?.version !== '4.0' ||
    decision.enhancement3d?.license?.source !== EXPECTED_LICENSE_SOURCE ||
    decision.enhancement3d?.license?.attributionString !==
      EXPECTED_ATTRIBUTION ||
    decision.enhancement3d?.license?.name !== candidate?.license?.name ||
    decision.enhancement3d?.license?.version !== candidate?.license?.version ||
    decision.enhancement3d?.license?.source !== candidate?.license?.source ||
    decision.enhancement3d?.license?.attributionString !==
      candidate?.license?.attributionString
  ) {
    issues.push(
      'enhancement3d license and attribution must match the accepted inventory and primary license source',
    );
  }

  const measuredArtifact =
    feasibility?.evidence?.directMeasurements?.optimizedArtifact;
  if (
    !sameJson(
      decision.enhancement3d?.representativeArtifact,
      measuredArtifact && {
        path: measuredArtifact.path,
        sha256: measuredArtifact.sha256,
      },
    )
  ) {
    issues.push(
      'enhancement3d representative artifact must match the measured SBLA-005 artifact',
    );
  }

  if (
    mapping?.coverage?.required !== 28 ||
    mapping?.coverage?.present !== 23 ||
    mapping?.coverage?.absent !== 5 ||
    !sameStringSet(mapping?.coverage?.absentIds, EXPECTED_MISSING_TARGET_IDS) ||
    decision.coverage?.requiredTargets !== 28 ||
    decision.coverage?.mapped3dTargets !== 23 ||
    !sameStringSet(
      decision.coverage?.missing3dTargetIds,
      EXPECTED_MISSING_TARGET_IDS,
    )
  ) {
    issues.push(
      'coverage must preserve the exact 23/28 mapping and five absent target ids',
    );
  }

  if (decision.guardrails?.bodyparts3dMayBeSoleAnatomySource !== false) {
    issues.push('BodyParts3D must not be the sole anatomy source');
  }
  if (decision.guardrails?.webglRequiredForCoreJourney !== false) {
    issues.push('the core journey must work without WebGL');
  }
  if (
    decision.guardrails?.createScientificIllustrationsInThisTask !== false ||
    decision.guardrails?.publishUnsupportedAnatomy !== false
  ) {
    issues.push(
      'SBLA-006 must not create or publish unreviewed scientific anatomy',
    );
  }

  if (
    !isRecord(evidenceDigests) ||
    !sameJson(decision.evidenceDigests, evidenceDigests) ||
    !sameStringSet(
      Object.keys(evidenceDigests ?? {}),
      EXPECTED_EVIDENCE_PATHS,
    ) ||
    Object.values(evidenceDigests ?? {}).some(
      (digest) => !/^[a-f0-9]{64}$/.test(digest),
    )
  ) {
    issues.push('evidenceDigests must match the checked-in evidence files');
  }

  return issues;
}

/** @param {string} path */
async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

/** @param {string} path */
async function sha256(path) {
  return createHash('sha256')
    .update(await readFile(path))
    .digest('hex');
}

async function runCli() {
  const root = resolve(new URL('../..', import.meta.url).pathname);
  const decisionPath = resolve(
    process.argv[2] ?? `${root}/docs/licenses/anatomy-asset-decision.json`,
  );
  const inventoryPath = `${root}/docs/licenses/asset-candidates.json`;
  const mappingPath = `${root}/docs/licenses/bodyparts3d-mesh-mapping.json`;
  const feasibilityPath = `${root}/docs/licenses/bodyparts3d-feasibility.json`;

  try {
    const evidenceDigests = Object.fromEntries(
      await Promise.all(
        EXPECTED_EVIDENCE_PATHS.map(async (relativePath) => [
          relativePath,
          await sha256(`${root}/${relativePath}`),
        ]),
      ),
    );
    const issues = validateAssetDecision({
      decision: await readJson(decisionPath),
      inventory: await readJson(inventoryPath),
      mapping: await readJson(mappingPath),
      feasibility: await readJson(feasibilityPath),
      evidenceDigests,
    });

    if (issues.length > 0) {
      console.error('SBLA-006 asset decision failed:');
      for (const issue of issues) console.error(`- ${issue}`);
      process.exitCode = 1;
      return;
    }

    console.log(
      'SBLA-006 asset decision passed: owner-approved 2D-authoritative hybrid; BodyParts3D 4.0 is bounded to 23/28 optional 3D targets; $0 purchase.',
    );
  } catch (error) {
    console.error('SBLA-006 asset decision failed to load:');
    console.error(
      `- ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await runCli();
}
