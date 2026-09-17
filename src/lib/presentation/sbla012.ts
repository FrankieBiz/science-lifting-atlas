export const SBLA_012_PAGE_ARCHETYPES = [
  'home',
  'muscle',
  'exercise',
  'source',
  'methodology',
] as const;

export const SBLA_012_JOURNEYS = [
  'find',
  'understand',
  'verify',
  'share',
] as const;

const PROTOTYPE_SENTINEL = 'local-owner-review';

type PreviewEnvironment = Readonly<Record<string, string | undefined>>;

type PreviewRecordLifecycle = Readonly<{
  reviewState: string;
  publicationState: string;
  approvalManifestId: string | null;
  contentChecksum: string | null;
  ownerApprovedAt?: string | null;
  review?: Readonly<{ ownerApprovedAt: string | null }>;
}>;

export type PresentationEligibility = 'public' | 'prototype' | 'blocked';

export function prototypePreviewEnabled(environment: PreviewEnvironment) {
  return (
    environment.SBLA_012_PROTOTYPE === PROTOTYPE_SENTINEL &&
    environment.CI !== 'true' &&
    environment.DEPLOYMENT_ENV !== 'production'
  );
}

export function classifyPreviewRecord(
  record: PreviewRecordLifecycle,
  prototypeEnabled: boolean,
): PresentationEligibility {
  const ownerApprovedAt =
    record.ownerApprovedAt ?? record.review?.ownerApprovedAt ?? null;
  const publicEligible =
    record.reviewState === 'approved' &&
    record.publicationState === 'published' &&
    ownerApprovedAt !== null &&
    record.approvalManifestId !== null &&
    record.contentChecksum !== null;

  if (publicEligible) return 'public';

  const prototypeEligible =
    prototypeEnabled &&
    record.reviewState === 'approved' &&
    record.publicationState === 'unpublished' &&
    ownerApprovedAt === null &&
    record.approvalManifestId === null &&
    record.contentChecksum === null;

  return prototypeEligible ? 'prototype' : 'blocked';
}
