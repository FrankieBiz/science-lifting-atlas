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

export function validateAsOfDate(asOf: string): ValidationIssue[] {
  try {
    assertIsoDate(asOf, 'asOf');
    return [];
  } catch (error) {
    return [
      issue(
        'AS_OF_INVALID',
        'asOf',
        error instanceof Error ? error.message : 'asOf is not a valid date.',
        'Set SBLA_AS_OF to a real calendar date in YYYY-MM-DD form.',
      ),
    ];
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

  if (!publication.statusSource) {
    issues.push(
      issue(
        'SOURCE_STATUS_SOURCE_MISSING',
        `${source.id}.publication.statusSource`,
        'The source has no authoritative publication-status source.',
        'Record the authoritative URL, registry, publisher, or issuer used for the status check.',
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
  } else {
    if (publication.statusCheckedAt > options.asOf) {
      issues.push(
        issue(
          'SOURCE_STATUS_CHECKED_IN_FUTURE',
          `${source.id}.publication.statusCheckedAt`,
          `The source status check date ${publication.statusCheckedAt} is after asOf ${options.asOf}.`,
          'Correct the check date or use the reproducible asOf date for which the check had already occurred.',
        ),
      );
    }
    if (publication.nextStatusCheckAt <= publication.statusCheckedAt) {
      issues.push(
        issue(
          'SOURCE_STATUS_SCHEDULE_INVALID',
          `${source.id}.publication.nextStatusCheckAt`,
          'The next source-status check must be later than the completed check.',
          'Set nextStatusCheckAt to a policy-compliant date after statusCheckedAt.',
        ),
      );
    }
    if (publication.nextStatusCheckAt <= options.asOf) {
      issues.push(
        issue(
          'SOURCE_STATUS_OVERDUE',
          `${source.id}.publication.nextStatusCheckAt`,
          `The source status check was due on ${publication.nextStatusCheckAt}.`,
          'Recheck the authoritative source status and set a new policy-compliant due date.',
        ),
      );
    }
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
const OUTCOME_FREE_BETTER_PATTERN =
  /\b(best|better|superior|optimal)\b(?!\s+(?:for|at|in terms of)\s+\S+)/i;
const CAUSAL_PATTERN =
  /\b(increases?|decreases?|causes?|prevents?|produces?|improves?|enhances?|reduces?|will|leads? to|results? in)\b/i;
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

function validatePublishedReviewDates(
  claim: ClaimRecord,
  options: ValidationOptions,
): ValidationIssue[] {
  if (claim.publicationState !== 'published') return [];
  const issues: ValidationIssue[] = [];
  const { lastReviewedAt, reviewDueAt } = claim.review;

  if (lastReviewedAt && lastReviewedAt > options.asOf) {
    issues.push(
      issue(
        'REVIEW_DATE_IN_FUTURE',
        `${claim.id}.review.lastReviewedAt`,
        `The recorded review date ${lastReviewedAt} is after asOf ${options.asOf}.`,
        'Correct lastReviewedAt or use the reproducible asOf date for which the review had already occurred.',
      ),
    );
  }
  if (lastReviewedAt && reviewDueAt && reviewDueAt <= lastReviewedAt) {
    issues.push(
      issue(
        'REVIEW_SCHEDULE_INVALID',
        `${claim.id}.review.reviewDueAt`,
        'The next review date must be later than the completed review.',
        'Set reviewDueAt to a policy-compliant date after lastReviewedAt.',
      ),
    );
  }
  if (reviewDueAt && reviewDueAt <= options.asOf) {
    issues.push(
      issue(
        'REVIEW_OVERDUE',
        `${claim.id}.review.reviewDueAt`,
        `The claim review was due on ${reviewDueAt}.`,
        'Re-review the claim and record a new policy-compliant review due date, or unpublish it.',
      ),
    );
  }

  return issues;
}

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
    issues.push(...validatePublishedReviewDates(claim, options));

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
      } else if (claim.publicationState === 'published') {
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
