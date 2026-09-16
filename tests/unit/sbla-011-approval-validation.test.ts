import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { validateRequiredReviewArtifacts } from '../../scripts/content/validate.mjs';
import { recordContentChecksum } from '../../src/lib/content/checksum';
import type {
  ApprovalManifestRecord,
  ClaimRecord,
  SourceRecord,
} from '../../src/lib/content/schemas';
import { validateRecordGraph } from '../../src/lib/content/validation';

const fixtureUrl = new URL('../fixtures/evidence-schemas/', import.meta.url);

async function publishedFixture() {
  const fixtures = JSON.parse(
    await readFile(new URL('records.valid.json', fixtureUrl), 'utf8'),
  ) as { claim: ClaimRecord; source: SourceRecord };
  const claim = structuredClone(fixtures.claim);
  claim.relationships = [];
  claim.contentChecksum = recordContentChecksum(claim);
  const manifest: ApprovalManifestRecord = {
    id: 'approval-pec-slice-v1',
    scopeId: 'pec-slice',
    sourceCommit: 'a'.repeat(40),
    entities: [{ id: claim.id, checksum: claim.contentChecksum }],
    pages: [],
    requiredReviews: [
      {
        id: 'review-pec-slice-r1',
        path: 'reviews/releases/review-pec-slice-r1.md',
        checksum: 'b'.repeat(64),
      },
    ],
    ownerIdentity: 'owner',
    decision: 'approved',
    decidedAt: '2026-09-02T14:00:00Z',
    integratedBy: 'codex',
    deploymentEligible: true,
    supersedesManifestId: null,
  };
  return { claim, source: fixtures.source, manifest };
}

describe('SBLA-011 approval enforcement', () => {
  it('derives a reproducible checksum from record content and detects mutation', async () => {
    const { claim, source, manifest } = await publishedFixture();
    const graph = {
      claims: [claim],
      sources: [source],
      approvalManifests: [manifest],
      entityIds: ['joint-action-horizontal-adduction'],
    };

    expect(
      validateRecordGraph(graph, { asOf: '2026-09-09' })
        .map((issue) => issue.code)
        .filter((code) => code.includes('CHECKSUM')),
    ).toEqual([]);

    claim.statement = `${claim.statement} Mutated after approval.`;
    expect(
      validateRecordGraph(graph, { asOf: '2026-09-09' }).map(
        (issue) => issue.code,
      ),
    ).toEqual(
      expect.arrayContaining([
        'CONTENT_CHECKSUM_MISMATCH',
        'APPROVAL_CHECKSUM_MISMATCH',
      ]),
    );
  });

  it('rejects records bound to a superseded manifest', async () => {
    const { claim, source, manifest } = await publishedFixture();
    const successor: ApprovalManifestRecord = {
      ...structuredClone(manifest),
      id: 'approval-pec-slice-v2',
      supersedesManifestId: manifest.id,
    };

    expect(
      validateRecordGraph(
        {
          claims: [claim],
          sources: [source],
          approvalManifests: [manifest, successor],
          entityIds: ['joint-action-horizontal-adduction'],
        },
        { asOf: '2026-09-09' },
      ).map((issue) => issue.code),
    ).toContain('APPROVAL_MANIFEST_SUPERSEDED');
  });

  it('hashes each required review from its exact repository path', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'sbla-review-binding-'));
    try {
      const relativePath = 'reviews/releases/review-pec-slice-r1.md';
      const absolutePath = path.join(root, relativePath);
      const contents = '# Immutable review\n\nPASS\n';
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, contents);
      const checksum = createHash('sha256').update(contents).digest('hex');
      const { manifest } = await publishedFixture();
      manifest.requiredReviews[0] = {
        id: 'review-pec-slice-r1',
        path: relativePath,
        checksum,
      };

      expect(await validateRequiredReviewArtifacts(root, [manifest])).toEqual(
        [],
      );

      manifest.requiredReviews[0]!.checksum = '0'.repeat(64);
      expect(
        (await validateRequiredReviewArtifacts(root, [manifest])).map(
          (issue) => issue.code,
        ),
      ).toContain('MANIFEST_REVIEW_CHECKSUM_MISMATCH');

      manifest.requiredReviews[0]!.path = 'reviews/releases/missing.md';
      expect(
        (await validateRequiredReviewArtifacts(root, [manifest])).map(
          (issue) => issue.code,
        ),
      ).toContain('MANIFEST_REVIEW_PATH_MISSING');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
