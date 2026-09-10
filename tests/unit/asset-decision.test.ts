import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  EXPECTED_DECISION,
  EXPECTED_MISSING_TARGET_IDS,
  resolveRepositoryRoot,
  validateAssetDecision,
} from '../../scripts/assets/decision.mjs';

const ARCHIVES = {
  'isa_BP3D_4.0_obj_99.zip': {
    bytes: 142_903_898,
    sha256: '40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e',
  },
  'partof_BP3D_4.0_obj_99.zip': {
    bytes: 64_888_505,
    sha256: '9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97',
  },
};

function fixture() {
  const mapping = {
    candidate: 'path-c-bodyparts3d',
    datasetVersion: 'BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction',
    coverage: {
      required: 28,
      present: 23,
      absent: 5,
      absentIds: [...EXPECTED_MISSING_TARGET_IDS],
    },
    source: {
      baseUrl: 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/',
      archives: structuredClone(ARCHIVES),
    },
  };

  const inventory = {
    candidates: [
      {
        id: 'path-c-bodyparts3d',
        selectionEligible: true,
        weightedTotal: 73,
        scores: { license_clarity: 4 },
        selection: {
          status: 'approved-bounded-enhancement',
          role: 'optional-progressive-enhancement-only',
          decisionRecord: 'docs/licenses/anatomy-asset-decision.json',
        },
        license: {
          name: 'Creative Commons Attribution 4.0 International',
          version: '4.0',
          source: 'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html',
          attributionString:
            'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International',
        },
      },
    ],
  };

  const feasibility = {
    evidence: {
      directMeasurements: {
        optimizedArtifact: {
          path: 'assets/derived/bodyparts3d/sbla005-representative.glb',
          sha256:
            'b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7',
        },
      },
    },
  };

  const evidenceDigests = {
    'docs/licenses/bodyparts3d-mesh-mapping.json':
      'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
    'docs/licenses/bodyparts3d-feasibility.json':
      '39a8f846ec4b1d179ea9c84f8ed443c6155c3b9848c5875275105d414dacbd39',
    'docs/licenses/bodyparts3d-performance.json':
      'f6be37064594e603a849079ec32e340ae7260efb8702a228a7cb4c7381090019',
  };

  const decision = {
    schemaVersion: 1,
    taskId: 'SBLA-006',
    decisionId: 'gate-a-asset-2026-09-09',
    status: 'approved',
    decision: EXPECTED_DECISION,
    recordedOn: '2026-09-09',
    ownerApproval: {
      approved: true,
      approvedOn: '2026-09-09',
      authorityBasis: 'owner-delegated-project-decision',
      recordedBy: 'Codex acting under owner delegation',
      record: 'The durable owner-delegated approval record.',
    },
    cost: {
      currency: 'USD',
      purchaseRequired: false,
      purchaseUsd: 0,
      recurringUsd: 0,
      purchaseArchiveRequired: false,
      reason: 'No commercial asset is selected or purchased.',
    },
    baseline2d: {
      type: 'project-authored-evidence-reviewed-semantic-vector-and-text',
      role: 'authoritative-core-experience',
      authoritativeForAllRequiredTargets: true,
      thirdPartyAssetSelected: false,
      productionStatus: 'deferred-to-SBLA-008-through-SBLA-013',
      rightsBasis: 'Original project-authored presentation.',
      accessibility: 'Semantic text remains complete without WebGL.',
      checksumStatus: 'Production checksums are deferred to SBLA-013.',
    },
    enhancement3d: {
      candidateId: 'path-c-bodyparts3d',
      role: 'optional-progressive-enhancement-only',
      datasetVersion: mapping.datasetVersion,
      sourceBaseUrl: mapping.source.baseUrl,
      sourceIdentityPolicy: 'Checksums provide immutable source identity.',
      archives: structuredClone(ARCHIVES),
      license: {
        ...structuredClone(inventory.candidates[0]!.license),
        accessedOn: '2026-09-09',
        historicalEmbeddedNotice: 'Historical license notice is preserved.',
      },
      representativeArtifact: structuredClone(
        feasibility.evidence.directMeasurements.optimizedArtifact,
      ),
    },
    coverage: {
      requiredTargets: 28,
      mapped3dTargets: 23,
      missing3dTargetIds: [...EXPECTED_MISSING_TARGET_IDS],
      policy: 'Missing targets remain on the authoritative 2D path.',
    },
    guardrails: {
      bodyparts3dMayBeSoleAnatomySource: false,
      webglRequiredForCoreJourney: false,
      createScientificIllustrationsInThisTask: false,
      publishUnsupportedAnatomy: false,
      generatedAnatomyImagesPermitted: false,
      requiredAttributionMustShipWithEveryDerivative: true,
    },
    evidenceDigests: structuredClone(evidenceDigests),
    acceptedRisks: ['The 3D enhancement has bounded coverage.'],
    rejectedAlternatives: [
      { option: 'commercial-asset', reason: 'No candidate passed every gate.' },
    ],
    laterTaskBoundaries: { SBLA_013: 'Production media validation.' },
  };

  return {
    decision,
    inventory,
    mapping,
    feasibility,
    evidenceDigests,
    decisionDigest: 'a'.repeat(64),
    gatePacketDecisionDigest: 'a'.repeat(64),
  };
}

describe('SBLA-006 asset decision contract', () => {
  it('accepts the bounded, owner-approved hybrid decision', () => {
    expect(validateAssetDecision(fixture())).toEqual([]);
  });

  it('rejects missing owner approval', () => {
    const input = fixture();
    input.decision.ownerApproval.approved = false;
    expect(validateAssetDecision(input)).toContain(
      'ownerApproval.approved must be true',
    );
  });

  it('rejects any purchase or recurring cost', () => {
    const input = fixture();
    input.decision.cost.purchaseUsd = 499;
    expect(validateAssetDecision(input)).toContain(
      'the approved decision must require no purchase and record $0 purchase and recurring cost',
    );
  });

  it('rejects a mutable or mismatched source identity', () => {
    const input = fixture();
    input.decision.enhancement3d.archives['isa_BP3D_4.0_obj_99.zip']!.sha256 =
      '0'.repeat(64);
    expect(validateAssetDecision(input)).toContain(
      'enhancement3d.archives must exactly match the checksum-pinned SBLA-005 source archives',
    );
  });

  it('rejects an inventory that does not record the bounded selection', () => {
    const input = fixture();
    delete (input.inventory.candidates[0] as { selection?: unknown }).selection;
    expect(validateAssetDecision(input)).toContain(
      'candidate inventory must record the approved bounded enhancement selection',
    );
  });

  it('rejects missing 2D authority for complete coverage', () => {
    const input = fixture();
    input.decision.baseline2d.authoritativeForAllRequiredTargets = false;
    expect(validateAssetDecision(input)).toContain(
      'baseline2d must be the authoritative non-WebGL path for all required targets',
    );
  });

  it('rejects dilution of the five measured 3D gaps', () => {
    const input = fixture();
    input.decision.coverage.missing3dTargetIds = ['multifidus'];
    expect(validateAssetDecision(input)).toContain(
      'coverage must preserve the exact 23/28 mapping and five absent target ids',
    );
  });

  it('rejects evidence checksum drift', () => {
    const input = fixture();
    input.evidenceDigests['docs/licenses/bodyparts3d-feasibility.json'] =
      '0'.repeat(64);
    expect(validateAssetDecision(input)).toContain(
      'evidenceDigests must match the checked-in evidence files',
    );
  });

  it('rejects treating the 3D layer as a complete or required experience', () => {
    const input = fixture();
    input.decision.guardrails.bodyparts3dMayBeSoleAnatomySource = true;
    input.decision.guardrails.webglRequiredForCoreJourney = true;
    expect(validateAssetDecision(input)).toEqual(
      expect.arrayContaining([
        'BodyParts3D must not be the sole anatomy source',
        'the core journey must work without WebGL',
      ]),
    );
  });

  it('rejects either unvalidated publication and attribution guardrail inversion', () => {
    const input = fixture();
    input.decision.guardrails.generatedAnatomyImagesPermitted = true;
    input.decision.guardrails.requiredAttributionMustShipWithEveryDerivative = false;
    expect(validateAssetDecision(input)).toEqual(
      expect.arrayContaining([
        'generated anatomy images must remain prohibited until their later evidence and review gates pass',
        'required attribution must ship with every derivative',
      ]),
    );
  });

  it('fails closed when the selected candidate has no license score', () => {
    const input = fixture();
    delete (input.inventory.candidates[0] as { scores?: unknown }).scores;
    expect(validateAssetDecision(input)).toContain(
      'the selected enhancement must remain the eligible 73/100 BodyParts3D candidate with license clarity at least 4/5',
    );
  });

  it('rejects a stale Gate A packet decision checksum', () => {
    const input = fixture();
    input.gatePacketDecisionDigest = 'b'.repeat(64);
    expect(validateAssetDecision(input)).toContain(
      'the Gate A packet must cite the current decision-record SHA-256',
    );
  });

  it('decodes spaces while resolving the repository root', () => {
    const moduleUrl = pathToFileURL(
      '/tmp/Sci Atlas/scripts/assets/decision.mjs',
    ).href;
    expect(resolveRepositoryRoot(moduleUrl)).toBe(
      resolve(fileURLToPath(new URL('../../', moduleUrl))),
    );
  });
});
