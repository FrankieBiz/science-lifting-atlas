import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import type { ContentRegistry } from '../../src/lib/content/registry';
import type { ClaimRecord, SourceRecord } from '../../src/lib/content/schemas';
import {
  canonicalJson,
  compileEvidenceGraph,
  GraphCompilationError,
} from '../../src/lib/graph/compiler';

type ValidFixtures = { source: SourceRecord; claim: ClaimRecord };

async function registryFixture(): Promise<ContentRegistry> {
  const fixtures = JSON.parse(
    await readFile(
      new URL(
        '../fixtures/evidence-schemas/records.valid.json',
        import.meta.url,
      ),
      'utf8',
    ),
  ) as ValidFixtures;
  const claim = structuredClone(fixtures.claim);
  claim.publicationState = 'unpublished';
  claim.approvalManifestId = null;
  claim.contentChecksum = null;
  claim.review.ownerApprovedAt = null;
  claim.relationships = [];

  return {
    claims: [claim],
    sources: [fixtures.source],
    muscles: [],
    exercises: [],
    approvalManifests: [],
    changeRecords: [],
  };
}

describe('SBLA-011 evidence graph compiler', () => {
  it('produces canonical deterministic nodes and evidence edges', async () => {
    const registry = await registryFixture();
    const first = compileEvidenceGraph(registry, { asOf: '2026-09-15' });
    const second = compileEvidenceGraph(structuredClone(registry), {
      asOf: '2026-09-15',
    });

    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(first.nodes.map((node) => node.id)).toEqual([
      'claim-pec-major-horizontal-adduction',
      'source-doi-10-1000-valid',
    ]);
    expect(first.edges).toEqual([
      expect.objectContaining({
        from: 'claim-pec-major-horizontal-adduction',
        to: 'source-doi-10-1000-valid',
        type: 'supports',
      }),
    ]);
  });

  it('fails closed when a claim references a missing source', async () => {
    const registry = await registryFixture();
    registry.claims[0]!.sourceLinks[0]!.sourceId = 'source-missing';

    expect(() =>
      compileEvidenceGraph(registry, { asOf: '2026-09-15' }),
    ).toThrow(GraphCompilationError);
  });
});
