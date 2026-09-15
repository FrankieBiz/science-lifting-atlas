import { createHash } from 'node:crypto';

import type { ContentRegistry } from '../content/registry.ts';
import {
  validateRecordGraph,
  type ValidationIssue,
} from '../content/validation.ts';

export type EvidenceGraphNode = {
  id: string;
  kind: 'claim' | 'source' | 'muscle' | 'exercise' | 'approval-manifest';
  label: string;
  reviewState?: string;
  publicationState?: string;
  certainty?: string;
  publicationStatus?: string;
  mixedEvidence?: boolean;
  recordChecksum: string;
};

export type EvidenceGraphEdge = {
  from: string;
  to: string;
  type:
    | 'supports'
    | 'qualifies'
    | 'contradicts'
    | 'neutral-context'
    | 'contains-claim';
  locator?: string;
  supportStrength?: string;
};

export type EvidenceGraphBundle = {
  schemaVersion: 1;
  sourceStatusSnapshot: string | null;
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
};

export class GraphCompilationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super(`Evidence graph compilation failed with ${issues.length} issue(s).`);
    this.name = 'GraphCompilationError';
    this.issues = issues;
  }
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, canonicalize(child)]),
  );
}

export function canonicalJson(value: unknown) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

export function recordChecksum(value: unknown) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function pageClaimIds(page: {
  summaryClaimIds: string[];
  sections: Array<{ claimIds: string[] }>;
}) {
  return [
    ...page.summaryClaimIds,
    ...page.sections.flatMap((section) => section.claimIds),
  ];
}

function edgeKey(edge: EvidenceGraphEdge) {
  return [edge.from, edge.type, edge.to, edge.locator ?? ''].join('\u0000');
}

export function compileEvidenceGraph(
  registry: ContentRegistry,
  options: { asOf: string },
): EvidenceGraphBundle {
  const issues = validateRecordGraph(registry, options);
  if (issues.length > 0) throw new GraphCompilationError(issues);

  const nodes: EvidenceGraphNode[] = [
    ...registry.claims.map((claim): EvidenceGraphNode => ({
      id: claim.id,
      kind: 'claim',
      label: claim.plainLanguage,
      reviewState: claim.reviewState,
      publicationState: claim.publicationState,
      certainty: claim.evidence.certainty,
      mixedEvidence: claim.sourceLinks.some(
        (link) => link.role === 'qualifies' || link.role === 'contradicts',
      ),
      recordChecksum: recordChecksum(claim),
    })),
    ...registry.sources.map((source): EvidenceGraphNode => ({
      id: source.id,
      kind: 'source',
      label: source.title,
      publicationStatus: source.publication.status,
      recordChecksum: recordChecksum(source),
    })),
    ...registry.muscles.map((muscle): EvidenceGraphNode => ({
      id: muscle.id,
      kind: 'muscle',
      label: muscle.name,
      reviewState: muscle.reviewState,
      publicationState: muscle.publicationState,
      recordChecksum: recordChecksum(muscle),
    })),
    ...registry.exercises.map((exercise): EvidenceGraphNode => ({
      id: exercise.id,
      kind: 'exercise',
      label: exercise.name,
      reviewState: exercise.reviewState,
      publicationState: exercise.publicationState,
      recordChecksum: recordChecksum(exercise),
    })),
    ...registry.approvalManifests.map((manifest): EvidenceGraphNode => ({
      id: manifest.id,
      kind: 'approval-manifest',
      label: manifest.scopeId,
      recordChecksum: recordChecksum(manifest),
    })),
  ].sort((left, right) => left.id.localeCompare(right.id));

  const edges: EvidenceGraphEdge[] = [
    ...registry.claims.flatMap((claim) =>
      claim.sourceLinks.map((link): EvidenceGraphEdge => ({
        from: claim.id,
        to: link.sourceId,
        type: link.role,
        locator: link.locator,
        supportStrength: link.supportStrength,
      })),
    ),
    ...[...registry.muscles, ...registry.exercises].flatMap((page) =>
      [...new Set(pageClaimIds(page))].map((claimId): EvidenceGraphEdge => ({
        from: page.id,
        to: claimId,
        type: 'contains-claim',
      })),
    ),
  ].sort((left, right) => edgeKey(left).localeCompare(edgeKey(right)));

  const checkedDates = registry.sources.flatMap((source) =>
    source.publication.statusCheckedAt
      ? [source.publication.statusCheckedAt]
      : [],
  );
  const sourceStatusSnapshot = checkedDates.sort().at(-1) ?? null;

  return { schemaVersion: 1, sourceStatusSnapshot, nodes, edges };
}
