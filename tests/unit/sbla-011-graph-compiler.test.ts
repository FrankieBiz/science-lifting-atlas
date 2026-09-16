import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import type { ContentRegistry } from '../../src/lib/content/registry';
import { compareCodepoint } from '../../src/lib/content/checksum';
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

  it('uses a locale-independent total order for shuffled inputs', async () => {
    const firstRegistry = await registryFixture();
    const secondClaim = structuredClone(firstRegistry.claims[0]!);
    secondClaim.id = 'claim-pec-major-hypertrophy';
    const secondSource = structuredClone(firstRegistry.sources[0]!);
    secondSource.id = 'source-pec-major-hypertrophy';
    secondClaim.sourceLinks[0]!.sourceId = secondSource.id;
    firstRegistry.claims.push(secondClaim);
    firstRegistry.sources.push(secondSource);

    const shuffled = structuredClone(firstRegistry);
    shuffled.claims.reverse();
    shuffled.sources.reverse();

    expect(compareCodepoint('claim-humeral', 'claim-hypertrophy')).toBe(-1);
    expect(
      canonicalJson(
        compileEvidenceGraph(firstRegistry, { asOf: '2026-09-15' }),
      ),
    ).toBe(
      canonicalJson(compileEvidenceGraph(shuffled, { asOf: '2026-09-15' })),
    );
  });
});
