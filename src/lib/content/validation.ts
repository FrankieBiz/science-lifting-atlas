import type {
  ApprovalManifestRecord,
  Certainty,
  ChangeRecord,
  ClaimRecord,
  ExerciseRecord,
  MuscleRecord,
  SourceRecord,
} from './schemas';
import { recordContentChecksum } from './checksum.ts';

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
  /\b(always|never|guarantees?|everyone|universally|all|every|invariably)\b|\bwithout\s+exception\b|\b100\s*%/gi;
const COMPARATIVE_PATTERN = /\b(best|better|superior|optimal)\b/gi;
const CAUSAL_PATTERN =
  /\b(increases?|decreases?|causes?|prevents?|produces?|improves?|enhances?|reduces?|leads? to|results? in)\b/gi;
const LOW_CALIBRATION_PATTERN =
  /\b(may|might|suggests?|limited evidence|no evidence|is plausible|hypothesis|cannot establish)\b/gi;
const VERY_LOW_DISCLOSURE_PATTERN =
  /\b(is plausible|hypothesis|inference|cannot establish|case report|single published case|one published report|mixed|inconsistent|uncertain|does not settle|no clear difference)\b/i;
const NEW_ASSERTION_BOUNDARY =
  /;|\b(?:and|but|while|whereas|though|although|however|yet|so)\s+(?!(?:\w+ly\s+)?(?:increases?|decreases?|causes?|prevents?|produces?|improves?|enhances?|reduces?|leads?\s+to|results?\s+in)\b)/gi;
const COUNT_TOKEN_SOURCE =
  'one|two|three|four|five|six|seven|eight|nine|ten|fourteen|twenty|thirty|\\d+';
const COUNT_VALUES: Readonly<Record<string, number>> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fourteen: 14,
  twenty: 20,
  thirty: 30,
};

function countValue(token: string) {
  const normalized = token.toLowerCase();
  if (/^\d+$/.test(normalized)) return Number(normalized);
  return COUNT_VALUES[normalized] ?? null;
}

function hasUniversalLanguage(statement: string) {
  for (const match of statement.matchAll(UNIVERSAL_PATTERN)) {
    const prefix = statement.slice(Math.max(0, match.index - 48), match.index);
    const token = match[0].toLowerCase();
    const negation = /\bnot(?:\s+\w+){0,3}\s*$/i.exec(prefix);
    if (
      token !== 'never' &&
      negation &&
      !crossesAssertionBoundary(
        prefix,
        negation.index + 'not'.length,
        prefix.length,
      )
    ) {
      continue;
    }
    if (
      token === 'all' &&
      /\b(?:no|not|none|without)\b[^.!?;]{0,80}\bat\s*$/i.test(prefix)
    ) {
      continue;
    }
    const clausePrefix = clausePrefixBefore(statement, match.index);
    const clauseSuffix = clauseSuffixAfter(
      statement,
      match.index + match[0].length,
    );
    if (token === 'every') {
      const scopedStudy =
        /\b(?:study|trial|series|experiment)\b[^.!?;]{0,100}\breports?\b(?:(?!\b(?:always|never|guarantees?|everyone|universally|all|every|invariably)\b|\bwithout\s+exception\b|\b100\s*%).){0,180}$/i.test(
          clausePrefix,
        );
      if (
        scopedStudy &&
        /^\s+(?:specimen|participant|case)\b/i.test(clauseSuffix)
      ) {
        continue;
      }
      const scopedSample = new RegExp(
        String.raw`\b(?:\d+|fourteen|twenty|thirty)\s+(specimens?|participants?|cases?)\b(?:(?!\b(?:always|never|guarantees?|everyone|universally|all|every|invariably)\b|\bwithout\s+exception\b|\b100\s*%).){0,120}\bevery$`,
        'i',
      ).exec(`${clausePrefix}${match[0]}`);
      const scopedNoun = /^\s+(specimen|participant|case)\b/i.exec(
        clauseSuffix,
      );
      if (
        scopedSample &&
        scopedNoun &&
        scopedSample[1]?.replace(/s$/i, '').toLowerCase() ===
          scopedNoun[1]?.toLowerCase()
      ) {
        continue;
      }
      if (/^\s+tier-\d+\b[^.!?;]{0,100}\bin this slice\b/i.test(clauseSuffix)) {
        continue;
      }
      if (
        /\bdiffering in\s*$/i.test(clausePrefix) &&
        /^\s+(?:exercise|condition)\b/i.test(clauseSuffix)
      ) {
        continue;
      }
      if (
        /\bnormalised\s*$/i.test(clausePrefix) &&
        /^\s+(?:exercise|condition|value)\b/i.test(clauseSuffix)
      ) {
        continue;
      }
    }
    if (
      token === 'never' &&
      /^\s+(?:(?:be\s+)?evidence\s+of|be\s+sole\s+support)\b/i.test(
        clauseSuffix,
      )
    ) {
      continue;
    }
    if (
      token === 'all' &&
      /\bof\s*$/i.test(clausePrefix) &&
      /^\s+the\s+[\w-]+\s+(?:muscles|joints|bones|tendons)\b/i.test(
        clauseSuffix,
      )
    ) {
      continue;
    }
    if (token === 'all') {
      if (
        new RegExp(
          `\\b(?:${COUNT_TOKEN_SOURCE})\\b[^.!?;]{0,80}\\b(?:studies|trials|series|experiments|specimens|participants|cases|sources|records)\\b[^.!?;]{0,80},\\s*$`,
          'i',
        ).test(clausePrefix) &&
        /^\s+(?:small\b|in\b)/i.test(clauseSuffix)
      ) {
        continue;
      }
      const referencedCount = new RegExp(
        `^\\s+(${COUNT_TOKEN_SOURCE})\\b`,
        'i',
      ).exec(clauseSuffix)?.[1];
      if (referencedCount) {
        const enumeratedCounts = statement
          .slice(0, match.index)
          .matchAll(
            new RegExp(
              `\\b(${COUNT_TOKEN_SOURCE})\\b[^.!?;]{0,100}\\b(?:studies|trials|series|experiments|specimens|participants|cases|sources|records)\\b`,
              'gi',
            ),
          );
        if (
          [...enumeratedCounts].some(
            (enumerated) =>
              countValue(enumerated[1] ?? '') === countValue(referencedCount),
          )
        ) {
          continue;
        }
      }
      if (
        /,[^.!?;]{0,100}\band\b[^.!?;]{0,100}\s*$/i.test(clausePrefix) &&
        /^\s+(?:change|vary|differ)\b/i.test(clauseSuffix)
      ) {
        continue;
      }
    }
    return true;
  }
  return false;
}

function hasOutcomeFreeComparative(statement: string) {
  for (const match of statement.matchAll(COMPARATIVE_PATTERN)) {
    const followingClause =
      statement.slice(match.index + match[0].length).split(/[.!?;]/, 1)[0] ??
      '';
    if (
      match[0].toLowerCase() === 'superior' &&
      /^-inferior\b/i.test(followingClause)
    ) {
      continue;
    }
    if (
      !/\b(?:for|at|in terms of)\s+(?!everything\b|anything\b|nothing\b)\S+/i.test(
        followingClause,
      ) &&
      !/^\s+leverage\s+for\s+\S+/i.test(followingClause)
    ) {
      return true;
    }
  }
  return false;
}

function isDirectlyNegated(statement: string, matchIndex: number) {
  const prefix = statement.slice(Math.max(0, matchIndex - 48), matchIndex);
  return /\b(?:do|does|did|is|are|was|were|can|could|would|should|has|have|had)\s+not(?:\s+\w+){0,2}\s*$|\b(?:do|does|did|is|are|was|were|can|could|would|should|has|have|had)n['’]t(?:\s+\w+){0,2}\s*$/i.test(
    prefix,
  );
}

function clauseContaining(statement: string, matchIndex: number) {
  const clauseStart = Math.max(
    statement.lastIndexOf('.', matchIndex - 1),
    statement.lastIndexOf(';', matchIndex - 1),
    statement.lastIndexOf('!', matchIndex - 1),
    statement.lastIndexOf('?', matchIndex - 1),
  );
  const clauseEnds = ['.', ';', '!', '?']
    .map((separator) => statement.indexOf(separator, matchIndex))
    .filter((index) => index >= 0);
  const clauseEnd =
    clauseEnds.length > 0 ? Math.min(...clauseEnds) : statement.length;
  return statement.slice(clauseStart + 1, clauseEnd);
}

function clausePrefixBefore(statement: string, matchIndex: number) {
  const clauseStart = Math.max(
    statement.lastIndexOf('.', matchIndex - 1),
    statement.lastIndexOf(';', matchIndex - 1),
    statement.lastIndexOf('!', matchIndex - 1),
    statement.lastIndexOf('?', matchIndex - 1),
  );
  return statement.slice(clauseStart + 1, matchIndex);
}

function clauseSuffixAfter(statement: string, matchEnd: number) {
  const clauseEnds = ['.', ';', '!', '?']
    .map((separator) => statement.indexOf(separator, matchEnd))
    .filter((index) => index >= 0);
  const clauseEnd =
    clauseEnds.length > 0 ? Math.min(...clauseEnds) : statement.length;
  return statement.slice(matchEnd, clauseEnd);
}

function crossesAssertionBoundary(text: string, from: number, to: number) {
  if (to < from) return true;
  NEW_ASSERTION_BOUNDARY.lastIndex = from;
  const boundary = NEW_ASSERTION_BOUNDARY.exec(text);
  NEW_ASSERTION_BOUNDARY.lastIndex = 0;
  return boundary !== null && boundary.index < to;
}

function lastLowCalibrationEnd(text: string, limit: number) {
  let end = -1;
  for (const match of text.matchAll(LOW_CALIBRATION_PATTERN)) {
    if (match.index >= limit) break;
    const token = match[0].toLowerCase();
    if (token === 'may' || token === 'might') {
      const suffix = text.slice(match.index + match[0].length);
      if (/^\s*,?\s*\d/.test(suffix)) continue;
    }
    end = match.index + match[0].length;
  }
  return end;
}

function hasUncalibratedCausalLanguage(statement: string) {
  const causalMatches = [...statement.matchAll(CAUSAL_PATTERN)];
  return causalMatches.some((match) => {
    if (isDirectlyNegated(statement, match.index)) return false;
    const clause = clauseContaining(statement, match.index);
    const clausePrefix = clausePrefixBefore(statement, match.index);
    const tokenOffset = clausePrefix.length;
    const singleTrialPreamble =
      /^\s*(?:in|within)\s+(?:one|a single|an?)\b(?:\s+[\w-]+){0,6}\s+(?:study|trial|series|experiment)\b/i.exec(
        clause,
      );
    if (
      singleTrialPreamble &&
      /\d/.test(clause) &&
      !crossesAssertionBoundary(
        clause,
        singleTrialPreamble[0].length,
        tokenOffset,
      )
    ) {
      return false;
    }
    if (
      /^\s*During the (?:ascent|descent)\b/i.test(clause) &&
      /\bmoment arm\b/i.test(clause) &&
      /\b(?:shoulder|elbow) axis\b/i.test(clause) &&
      [...clause.matchAll(CAUSAL_PATTERN)].length <= 1
    ) {
      return false;
    }
    const clauseStart = statement.lastIndexOf('.', match.index - 1) + 1;
    const sentence = statement.slice(clauseStart);
    const sentenceTokenOffset = match.index - clauseStart;
    const calibrationEnd = lastLowCalibrationEnd(sentence, sentenceTokenOffset);
    if (
      calibrationEnd >= 0 &&
      !crossesAssertionBoundary(sentence, calibrationEnd, sentenceTokenOffset)
    ) {
      return false;
    }
    if (causalMatches.length === 1) {
      const trailingCalibrationEnd = lastLowCalibrationEnd(
        clause,
        clause.length,
      );
      const causalTokenEnd = tokenOffset + match[0].length;
      if (trailingCalibrationEnd > causalTokenEnd) {
        const crossesBoundary = crossesAssertionBoundary(
          clause,
          causalTokenEnd,
          trailingCalibrationEnd,
        );
        const explicitResultVariability =
          /\band\s+results\s+(?:may|might)\b/i.test(
            clause.slice(causalTokenEnd, trailingCalibrationEnd),
          );
        if (!crossesBoundary || explicitResultVariability) return false;
      }
    }
    return true;
  });
}

export function lintClaimLanguage(
  statement: string,
  certainty: Certainty,
  path = 'statement',
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (hasUniversalLanguage(statement)) {
    issues.push(
      issue(
        'CERTAINTY_UNIVERSAL',
        path,
        'Universal or guaranteed wording is not allowed.',
        'Narrow the population, conditions, comparator, and outcome to what the evidence establishes.',
      ),
    );
  }

  if (hasOutcomeFreeComparative(statement)) {
    issues.push(
      issue(
        'OUTCOME_REQUIRED',
        path,
        'Comparative wording such as “better” must name the outcome.',
        'State better for which measured outcome, population, comparator, and conditions.',
      ),
    );
  }

  if (
    (certainty === 'low' || certainty === 'very-low') &&
    hasUncalibratedCausalLanguage(statement)
  ) {
    issues.push(
      issue(
        'CERTAINTY_OVERSTATED',
        path,
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
        path,
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
  muscles?: MuscleRecord[];
  exercises?: ExerciseRecord[];
  approvalManifests?: ApprovalManifestRecord[];
  changeRecords?: ChangeRecord[];
  entityIds?: string[];
};

type PageRecord = MuscleRecord | ExerciseRecord;

function pageClaimIds(page: PageRecord) {
  return [
    ...page.summaryClaimIds,
    ...page.sections.flatMap((section) => section.claimIds),
  ];
}

function validateManifestChain(
  manifests: ApprovalManifestRecord[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const manifestById = new Map(
    manifests.map((manifest) => [manifest.id, manifest] as const),
  );
  const supersededIds = new Set(
    manifests.flatMap((manifest) =>
      manifest.supersedesManifestId ? [manifest.supersedesManifestId] : [],
    ),
  );

  for (const manifest of manifests) {
    if (
      manifest.supersedesManifestId &&
      !manifestById.has(manifest.supersedesManifestId)
    ) {
      issues.push(
        issue(
          'MANIFEST_SUPERSESSION_MISSING',
          `${manifest.id}.supersedesManifestId`,
          `Superseded manifest ${manifest.supersedesManifestId} does not exist.`,
          'Add the immutable earlier manifest or correct the supersession reference.',
        ),
      );
    }

    const visited = new Set<string>();
    let cursor: ApprovalManifestRecord | undefined = manifest;
    while (cursor?.supersedesManifestId) {
      if (visited.has(cursor.id)) {
        issues.push(
          issue(
            'MANIFEST_SUPERSESSION_CYCLE',
            `${manifest.id}.supersedesManifestId`,
            'The manifest supersession chain contains a cycle.',
            'Replace the cyclic reference with an append-only chain that terminates.',
          ),
        );
        break;
      }
      visited.add(cursor.id);
      cursor = manifestById.get(cursor.supersedesManifestId);
    }
  }

  const currentByScope = new Map<string, string[]>();
  for (const manifest of manifests) {
    if (supersededIds.has(manifest.id)) continue;
    const current = currentByScope.get(manifest.scopeId) ?? [];
    current.push(manifest.id);
    currentByScope.set(manifest.scopeId, current);
  }
  for (const [scopeId, ids] of currentByScope) {
    if (ids.length <= 1) continue;
    issues.push(
      issue(
        'MANIFEST_CURRENT_DUPLICATE',
        scopeId,
        `Scope ${scopeId} has multiple current manifests: ${ids.join(', ')}.`,
        'Append one superseding manifest so exactly one current manifest remains.',
      ),
    );
  }
  return issues;
}

function validatePublishedManifestCoverage(
  record: ClaimRecord | PageRecord | ChangeRecord,
  manifests: ApprovalManifestRecord[],
  supersededManifestIds: ReadonlySet<string>,
  entryType: 'entities' | 'pages',
): ValidationIssue[] {
  if (record.publicationState !== 'published') return [];
  const manifest = manifests.find(
    (candidate) => candidate.id === record.approvalManifestId,
  );
  if (!manifest) {
    return [
      issue(
        'APPROVAL_MANIFEST_MISSING',
        `${record.id}.approvalManifestId`,
        `Approval manifest ${record.approvalManifestId ?? '(null)'} does not exist.`,
        'Reference an immutable approved manifest covering this exact record checksum.',
      ),
    ];
  }
  const issues: ValidationIssue[] = [];
  if (supersededManifestIds.has(manifest.id)) {
    issues.push(
      issue(
        'APPROVAL_MANIFEST_SUPERSEDED',
        `${record.id}.approvalManifestId`,
        `Approval manifest ${manifest.id} has been superseded and is not current.`,
        'Bind the record to the one current owner-approved manifest for its scope.',
      ),
    );
  }
  if (manifest.decision !== 'approved' || !manifest.deploymentEligible) {
    issues.push(
      issue(
        'APPROVAL_MANIFEST_INELIGIBLE',
        `${record.id}.approvalManifestId`,
        `Manifest ${manifest.id} is not approved and deployment eligible.`,
        'Keep the record unpublished until the owner approves a deployment-eligible manifest.',
      ),
    );
  }
  const entry = manifest[entryType].find(
    (candidate) => candidate.id === record.id,
  );
  const computedChecksum = recordContentChecksum(record);
  if (record.contentChecksum !== computedChecksum) {
    issues.push(
      issue(
        'CONTENT_CHECKSUM_MISMATCH',
        `${record.id}.contentChecksum`,
        'The record checksum does not match its canonical content.',
        'Recompute the canonical checksum, obtain review and owner approval, and append a new manifest.',
      ),
    );
  }
  if (!entry || entry.checksum !== computedChecksum) {
    issues.push(
      issue(
        'APPROVAL_CHECKSUM_MISMATCH',
        `${record.id}.contentChecksum`,
        `Manifest ${manifest.id} does not cover the record's exact checksum.`,
        'Regenerate the checksum, obtain review and owner approval, and append a new manifest.',
      ),
    );
  }
  return issues;
}

function validatePublishedReviewDates(
  record: Pick<
    ClaimRecord | ChangeRecord,
    'id' | 'publicationState' | 'review'
  >,
  options: ValidationOptions,
): ValidationIssue[] {
  if (record.publicationState !== 'published') return [];
  const issues: ValidationIssue[] = [];
  const { lastReviewedAt, reviewDueAt } = record.review;

  if (lastReviewedAt && lastReviewedAt > options.asOf) {
    issues.push(
      issue(
        'REVIEW_DATE_IN_FUTURE',
        `${record.id}.review.lastReviewedAt`,
        `The recorded review date ${lastReviewedAt} is after asOf ${options.asOf}.`,
        'Correct lastReviewedAt or use the reproducible asOf date for which the review had already occurred.',
      ),
    );
  }
  if (lastReviewedAt && reviewDueAt && reviewDueAt <= lastReviewedAt) {
    issues.push(
      issue(
        'REVIEW_SCHEDULE_INVALID',
        `${record.id}.review.reviewDueAt`,
        'The next review date must be later than the completed review.',
        'Set reviewDueAt to a policy-compliant date after lastReviewedAt.',
      ),
    );
  }
  if (reviewDueAt && reviewDueAt <= options.asOf) {
    issues.push(
      issue(
        'REVIEW_OVERDUE',
        `${record.id}.review.reviewDueAt`,
        `The record review was due on ${reviewDueAt}.`,
        'Re-review the record and record a new policy-compliant review due date, or unpublish it.',
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
    ...(graph.muscles ?? []).map((muscle) => muscle.id),
    ...(graph.exercises ?? []).map((exercise) => exercise.id),
    ...(graph.approvalManifests ?? []).map((manifest) => manifest.id),
    ...(graph.changeRecords ?? []).map((changeRecord) => changeRecord.id),
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
  const claimById = new Map(
    graph.claims.map((claim) => [claim.id, claim] as const),
  );
  const manifests = graph.approvalManifests ?? [];
  const supersededManifestIds = new Set(
    manifests.flatMap((manifest) =>
      manifest.supersedesManifestId ? [manifest.supersedesManifestId] : [],
    ),
  );
  issues.push(...validateManifestChain(manifests));

  for (const claim of graph.claims) {
    issues.push(
      ...lintClaimLanguage(
        claim.statement,
        claim.evidence.certainty,
        `${claim.id}.statement`,
      ),
      ...lintClaimLanguage(
        claim.plainLanguage,
        claim.evidence.certainty,
        `${claim.id}.plainLanguage`,
      ),
      ...claim.qualifiers.flatMap((qualifier, index) =>
        lintClaimLanguage(
          qualifier,
          claim.evidence.certainty,
          `${claim.id}.qualifiers.${index}`,
        ).filter(
          (languageIssue) =>
            languageIssue.code === 'CERTAINTY_UNIVERSAL' ||
            languageIssue.code === 'OUTCOME_REQUIRED',
        ),
      ),
    );
    issues.push(...validatePublishedReviewDates(claim, options));
    issues.push(
      ...validatePublishedManifestCoverage(
        claim,
        manifests,
        supersededManifestIds,
        'entities',
      ),
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
      if (relationship.claimId) {
        const relationshipClaim = claimById.get(relationship.claimId);
        if (!relationshipClaim) {
          issues.push(
            issue(
              'REFERENCE_MISSING',
              `${claim.id}.relationships.${index}.claimId`,
              `Referenced claim ${relationship.claimId} does not exist.`,
              'Add the validated claim record or correct the claim ID.',
            ),
          );
        } else if (
          relationship.public &&
          relationshipClaim.publicationState !== 'published'
        ) {
          issues.push(
            issue(
              'PUBLIC_RELATIONSHIP_CLAIM_UNPUBLISHED',
              `${claim.id}.relationships.${index}.claimId`,
              `Public relationship cites unpublished claim ${relationship.claimId}.`,
              'Publish and approve the cited claim, cite another published claim, or keep the relationship non-public.',
            ),
          );
        }
      }
    }
  }

  for (const page of [...(graph.muscles ?? []), ...(graph.exercises ?? [])]) {
    issues.push(...validatePublishedReviewDates(page, options));
    issues.push(
      ...validatePublishedManifestCoverage(
        page,
        manifests,
        supersededManifestIds,
        'pages',
      ),
    );
    for (const [index, claimId] of pageClaimIds(page).entries()) {
      const claim = claimById.get(claimId);
      if (!claim) {
        issues.push(
          issue(
            'REFERENCE_MISSING',
            `${page.id}.claimIds.${index}`,
            `Referenced claim ${claimId} does not exist.`,
            'Add the validated claim record or correct the claim ID.',
          ),
        );
      } else if (
        page.publicationState === 'published' &&
        (claim.reviewState !== 'approved' ||
          claim.publicationState !== 'published' ||
          claim.review.ownerApprovedAt === null)
      ) {
        issues.push(
          issue(
            'LIVE_PAGE_CLAIM_INELIGIBLE',
            `${page.id}.claimIds.${index}`,
            `Live page ${page.id} references claim ${claimId}, which is not fully approved and published.`,
            'Publish only after the claim and its exact manifest are owner approved.',
          ),
        );
      }
    }
  }

  for (const changeRecord of graph.changeRecords ?? []) {
    issues.push(...validatePublishedReviewDates(changeRecord, options));
    issues.push(
      ...validatePublishedManifestCoverage(
        changeRecord,
        manifests,
        supersededManifestIds,
        'entities',
      ),
    );
  }

  return issues;
}
