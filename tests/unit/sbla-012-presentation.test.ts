import { describe, expect, it } from 'vitest';

import {
  SBLA_012_JOURNEYS,
  SBLA_012_PAGE_ARCHETYPES,
  classifyPreviewRecord,
  prototypePreviewEnabled,
} from '../../src/lib/presentation/sbla012';

const reviewedUnpublished = {
  reviewState: 'approved',
  publicationState: 'unpublished',
  approvalManifestId: null,
  contentChecksum: null,
  ownerApprovedAt: null,
} as const;

describe('SBLA-012 presentation contract', () => {
  it('defines every realistic page archetype and formative journey', () => {
    expect(SBLA_012_PAGE_ARCHETYPES).toEqual([
      'home',
      'muscle',
      'exercise',
      'source',
      'methodology',
    ]);
    expect(SBLA_012_JOURNEYS).toEqual([
      'find',
      'understand',
      'verify',
      'share',
    ]);
  });

  it('keeps reviewed but unpublished records out of the normal build', () => {
    expect(classifyPreviewRecord(reviewedUnpublished, false)).toBe('blocked');
  });

  it('allows reviewed records only inside the explicit local prototype', () => {
    expect(classifyPreviewRecord(reviewedUnpublished, true)).toBe('prototype');
  });

  it('requires an exact local-only preview sentinel and refuses CI', () => {
    expect(prototypePreviewEnabled({})).toBe(false);
    expect(
      prototypePreviewEnabled({
        SBLA_012_PROTOTYPE: 'local-owner-review',
      }),
    ).toBe(true);
    expect(
      prototypePreviewEnabled({
        CI: 'true',
        SBLA_012_PROTOTYPE: 'local-owner-review',
      }),
    ).toBe(false);
    expect(
      prototypePreviewEnabled({
        DEPLOYMENT_ENV: 'production',
        SBLA_012_PROTOTYPE: 'local-owner-review',
      }),
    ).toBe(false);
  });
});
