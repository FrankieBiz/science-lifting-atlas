import type { Certainty, ClaimRecord, SourceRecord } from './schemas';

export type ValidationIssue = {
  code: string;
  path: string;
  message: string;
  remediation: string;
};

type ValidationOptions = { asOf: string };

function issue(
  code: string,
  path: string,
  message: string,
  remediation: string,
): ValidationIssue {
  return { code, path, message, remediation };
}

function assertIsoDate(value: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${label} must use YYYY-MM-DD`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(parsed.valueOf()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new TypeError(`${label} must be a real calendar date`);
  }
}

export function validateSourceStatus(
  source: SourceRecord,
  options: ValidationOptions,
): ValidationIssue[] {
  assertIsoDate(options.asOf, 'asOf');
  const issues: ValidationIssue[] = [];
  const publication = source.publication;

  if (!publication.statusMethod) {
    issues.push(
      issue(
        'SOURCE_STATUS_METHOD_MISSING',
        `${source.id}.publication.statusMethod`,
        'The source has no reproducible publication-status method.',
        'Record the source-type-specific status method before this source can support publication.',
      ),
    );
  }

  if (!publication.statusCheckedAt || !publication.nextStatusCheckAt) {
    issues.push(
      issue(
        'SOURCE_STATUS_DATE_MISSING',
        `${source.id}.publication`,
        'The source is missing its last or next status-check date.',
        'Run the authoritative status check and record both ISO dates.',
      ),
    );
  } else if (publication.nextStatusCheckAt <= options.asOf) {
    issues.push(
      issue(
        'SOURCE_STATUS_OVERDUE',
        `${source.id}.publication.nextStatusCheckAt`,
        `The source status check was due on ${publication.nextStatusCheckAt}.`,
        'Recheck the authoritative source status and set a new policy-compliant due date.',
      ),
    );
  }

  if (publication.status === 'retracted') {
    issues.push(
      issue(
        'SOURCE_RETRACTED',
        `${source.id}.publication.status`,
        'A retracted source cannot support a live claim.',
        'Block or withdraw dependent claims and publish the required correction record.',
      ),
    );
  } else if (
    publication.status === 'corrected' ||
    publication.status === 'expression-of-concern' ||
    publication.status === 'superseded'
  ) {
    issues.push(
      issue(
        'SOURCE_REEVALUATION_REQUIRED',
        `${source.id}.publication.status`,
        `Source status ${publication.status} requires manual reevaluation.`,
        'Reevaluate every dependent claim before publication or continued use.',
      ),
    );
  }

  return issues;
}

const UNIVERSAL_PATTERN =
  /\b(always|never|guarantees?|everyone|universally)\b/i;
const OUTCOME_FREE_BETTER_PATTERN = /\b(best|better|superior|optimal)\b/i;
const CAUSAL_PATTERN =
  /\b(increases?|decreases?|causes?|prevents?|produces?)\b/i;
const LOW_CALIBRATION_PATTERN =
  /\b(may|might|suggests?|limited evidence|is plausible|hypothesis|cannot establish)\b/i;
const VERY_LOW_DISCLOSURE_PATTERN =
  /\b(is plausible|hypothesis|inference|cannot establish)\b/i;

export function lintClaimLanguage(
  statement: string,
  certainty: Certainty,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (UNIVERSAL_PATTERN.test(statement)) {
    issues.push(
      issue(
        'CERTAINTY_UNIVERSAL',
        'statement',
        'Universal or guaranteed wording is not allowed.',
        'Narrow the population, conditions, comparator, and outcome to what the evidence establishes.',
      ),
    );
  }

  if (OUTCOME_FREE_BETTER_PATTERN.test(statement)) {
    issues.push(
      issue(
        'OUTCOME_REQUIRED',
        'statement',
        'Comparative wording such as “better” must name the outcome.',
        'State better for which measured outcome, population, comparator, and conditions.',
      ),
    );
  }

  if (
    (certainty === 'low' || certainty === 'very-low') &&
    CAUSAL_PATTERN.test(statement) &&
    !LOW_CALIBRATION_PATTERN.test(statement)
  ) {
    issues.push(
      issue(
        'CERTAINTY_OVERSTATED',
        'statement',
        'Categorical causal wording exceeds the recorded certainty.',
        'Use calibrated wording such as “may” or “suggests,” or strengthen and re-review the evidence.',
      ),
    );
  }

  if (
    certainty === 'very-low' &&
    !VERY_LOW_DISCLOSURE_PATTERN.test(statement)
  ) {
    issues.push(
      issue(
        'HYPOTHESIS_DISCLOSURE_REQUIRED',
        'statement',
        'Very-low-certainty wording must disclose hypothesis or inference status.',
        'Explicitly label the statement as a hypothesis, inference, or plausible explanation.',
      ),
    );
  }

  return issues;
}

export type RecordGraph = {
  claims: ClaimRecord[];
  sources: SourceRecord[];
  entityIds?: string[];
};

export function validateRecordGraph(
  graph: RecordGraph,
  options: ValidationOptions,
): ValidationIssue[] {
  assertIsoDate(options.asOf, 'asOf');
  const issues: ValidationIssue[] = [];
  const allIds = [
    ...graph.claims.map((claim) => claim.id),
    ...graph.sources.map((source) => source.id),
    ...(graph.entityIds ?? []),
  ];
  const seen = new Set<string>();

  for (const id of allIds) {
    if (seen.has(id)) {
      issues.push(
        issue(
          'ID_DUPLICATE',
          id,
          `The identifier ${id} occurs more than once.`,
          'Assign one immutable ID to each record and update references deliberately.',
        ),
      );
    }
    seen.add(id);
  }

  const sourceById = new Map(
    graph.sources.map((source) => [source.id, source] as const),
  );

  for (const claim of graph.claims) {
    issues.push(
      ...lintClaimLanguage(claim.statement, claim.evidence.certainty),
    );

    if (
      claim.publicationState === 'published' &&
      claim.sourceLinks.length === 0
    ) {
      issues.push(
        issue(
          'PUBLISHED_CLAIM_UNSOURCED',
          `${claim.id}.sourceLinks`,
          'A published claim has no source links.',
          'Add exact supporting source links or unpublish the claim.',
        ),
      );
    }

    for (const [index, link] of claim.sourceLinks.entries()) {
      const source = sourceById.get(link.sourceId);
      if (!source) {
        issues.push(
          issue(
            'REFERENCE_MISSING',
            `${claim.id}.sourceLinks.${index}.sourceId`,
            `Referenced source ${link.sourceId} does not exist.`,
            'Add the validated source record or correct the source ID.',
          ),
        );
      } else if (
        claim.publicationState === 'published' &&
        link.role === 'supports'
      ) {
        issues.push(...validateSourceStatus(source, options));
      }
    }

    for (const [index, relationship] of claim.relationships.entries()) {
      if (!seen.has(relationship.targetId)) {
        issues.push(
          issue(
            'REFERENCE_MISSING',
            `${claim.id}.relationships.${index}.targetId`,
            `Referenced entity ${relationship.targetId} does not exist.`,
            'Add the validated target record or correct the target ID.',
          ),
        );
      }
      if (relationship.public && !relationship.claimId) {
        issues.push(
          issue(
            'PUBLIC_RELATIONSHIP_UNCITED',
            `${claim.id}.relationships.${index}.claimId`,
            'A public training-relevant relationship has no claim citation.',
            'Attach an approved claim ID or keep the relationship non-public.',
          ),
        );
      }
      if (relationship.claimId && !seen.has(relationship.claimId)) {
        issues.push(
          issue(
            'REFERENCE_MISSING',
            `${claim.id}.relationships.${index}.claimId`,
            `Referenced claim ${relationship.claimId} does not exist.`,
            'Add the validated claim record or correct the claim ID.',
          ),
        );
      }
    }
  }

  return issues;
}
