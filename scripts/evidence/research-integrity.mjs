import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TERMINAL_STATES = new Set([
  'duplicate',
  'excluded',
  'awaiting-full-text',
  'included',
]);
const LOWER_ACCESS_LEVELS = new Set(['abstract-only', 'metadata-only']);
const FULL_TEXT_ACCESS_LEVELS = new Set([
  'full-text-open',
  'full-text-limited',
]);
const ENGLISH_LANGUAGE_CODES = new Set(['en', 'eng', 'english']);
const ARTIFACT_ORDER = new Map([
  ['bundle', 0],
  ['search', 1],
  ['screening', 2],
  ['extraction', 3],
  ['packet', 4],
]);

export const BUNDLE_VALIDATION_CODES = Object.freeze([
  'ID_INVALID',
  'ID_DUPLICATE',
  'DATE_INVALID',
  'COUNT_INVALID',
  'TERMINAL_STATE_INVALID',
  'SCREENING_TOTAL_MISMATCH',
  'RECONCILIATION_EQUATION_ONE_MISMATCH',
  'RECONCILIATION_EQUATION_TWO_MISMATCH',
  'RETRIEVAL_EVENTS_DEFAULT_MISSING',
  'ACQUISITION_LADDER_REQUIRED',
  'ACQUISITION_ATTEMPT_DATE_INVALID',
  'ACQUISITION_ATTEMPT_RESULT_REQUIRED',
  'INCLUDED_EXTRACTION_IDS_MISMATCH',
  'AWAITING_IDS_MISMATCH',
  'PACKET_SOURCE_IDS_MISMATCH',
  'EXTRACTION_COUNT_MISMATCH',
  'ACCESS_LEVEL_MISMATCH',
  'FULL_TEXT_BASIS_EXCEEDS_ACCESS',
  'LANGUAGE_REQUIRED',
]);

export const CLI_ISSUE_CODES = Object.freeze([
  'ARGUMENT_INVALID',
  'BUNDLE_MISSING',
  'BUNDLE_PARTIAL',
  'JSON_PARSE_FAILED',
]);

/**
 * @typedef {'bundle' | 'search' | 'screening' | 'extraction' | 'packet'} ArtifactKind
 * @typedef {{
 *   code: string,
 *   artifact: ArtifactKind,
 *   path: string,
 *   message: string,
 *   remediation: string,
 * }} IntegrityIssue
 * @typedef {{
 *   search: Record<string, unknown>,
 *   screening: Record<string, unknown>,
 *   extraction: Record<string, unknown>,
 *   packet: Record<string, unknown>,
 * }} ResearchBundle
 */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
function asObject(value) {
  return isObject(value) ? value : {};
}

/**
 * @param {unknown} value
 * @returns {unknown[]}
 */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isIdentifier(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isCount(value) {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

/** @param {unknown} value */
function isRealIsoDate(value) {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) {
    return false;
  }
  if (value.length === 10) return true;
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) && !Number.isNaN(Date.parse(value))
  );
}

/** @param {unknown[]} values */
function sortedIdentifiers(values) {
  return values.filter(isIdentifier).map(String).sort(compareStrings);
}

/** @param {string} left @param {string} right */
function compareStrings(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** @param {IntegrityIssue} left @param {IntegrityIssue} right */
function compareIssues(left, right) {
  const artifactDifference =
    (ARTIFACT_ORDER.get(left.artifact) ?? 99) -
    (ARTIFACT_ORDER.get(right.artifact) ?? 99);
  if (artifactDifference !== 0) return artifactDifference;
  return (
    compareStrings(left.path, right.path) ||
    compareStrings(left.code, right.code) ||
    compareStrings(left.message, right.message)
  );
}

/**
 * @param {IntegrityIssue[]} issues
 * @param {IntegrityIssue} issue
 */
function addIssue(issues, issue) {
  issues.push(issue);
}

/**
 * @param {IntegrityIssue[]} issues
 * @param {ArtifactKind} artifact
 * @param {string} jsonPath
 * @param {unknown} value
 * @param {string} label
 */
function validateDate(issues, artifact, jsonPath, value, label) {
  if (isRealIsoDate(value)) return;
  addIssue(issues, {
    code: 'DATE_INVALID',
    artifact,
    path: jsonPath,
    message: `${label} must be a real ISO 8601 calendar date or timestamp; received ${JSON.stringify(value)}.`,
    remediation:
      'Record the actual execution or decision date in ISO 8601 form.',
  });
}

/**
 * @param {IntegrityIssue[]} issues
 * @param {ArtifactKind} artifact
 * @param {string} jsonPath
 * @param {unknown} value
 * @param {string} label
 */
function validateCount(issues, artifact, jsonPath, value, label) {
  if (isCount(value)) return;
  addIssue(issues, {
    code: 'COUNT_INVALID',
    artifact,
    path: jsonPath,
    message: `${label} must be a nonnegative safe integer; received ${JSON.stringify(value)}.`,
    remediation:
      'Replace the value with the nonnegative integer measured from the underlying records.',
  });
}

/**
 * @param {IntegrityIssue[]} issues
 * @param {ArtifactKind} artifact
 * @param {unknown[]} records
 * @param {string} key
 * @param {string} basePath
 * @param {string} label
 */
function validateUniqueIds(issues, artifact, records, key, basePath, label) {
  /** @type {Map<string, string>} */
  const seen = new Map();
  records.forEach((rawRecord, index) => {
    const record = asObject(rawRecord);
    const value = record[key];
    const jsonPath = `${basePath}[${index}].${key}`;
    if (!isIdentifier(value)) {
      addIssue(issues, {
        code: 'ID_INVALID',
        artifact,
        path: jsonPath,
        message: `${label} must be a nonempty string.`,
        remediation: `Assign this ${label} a stable nonempty identifier before handoff.`,
      });
      return;
    }
    const identifier = String(value);
    const firstPath = seen.get(identifier);
    if (firstPath) {
      addIssue(issues, {
        code: 'ID_DUPLICATE',
        artifact,
        path: jsonPath,
        message: `${label} ${JSON.stringify(identifier)} duplicates ${firstPath}.`,
        remediation: `Give each ${label} one stable unique identifier and update its cross-artifact references.`,
      });
    } else {
      seen.set(identifier, jsonPath);
    }
  });
}

/**
 * @param {IntegrityIssue[]} issues
 * @param {ArtifactKind} artifact
 * @param {unknown[]} values
 * @param {string} basePath
 * @param {string} label
 */
function validateUniqueIdArray(issues, artifact, values, basePath, label) {
  /** @type {Map<string, string>} */
  const seen = new Map();
  values.forEach((value, index) => {
    const jsonPath = `${basePath}[${index}]`;
    if (!isIdentifier(value)) {
      addIssue(issues, {
        code: 'ID_INVALID',
        artifact,
        path: jsonPath,
        message: `${label} must be a nonempty string.`,
        remediation: `Assign this ${label} a stable nonempty identifier before handoff.`,
      });
      return;
    }
    const firstPath = seen.get(value);
    if (firstPath) {
      addIssue(issues, {
        code: 'ID_DUPLICATE',
        artifact,
        path: jsonPath,
        message: `${label} ${JSON.stringify(value)} duplicates ${firstPath}.`,
        remediation: `Give each ${label} one stable unique identifier and update its cross-artifact references.`,
      });
    } else {
      seen.set(value, jsonPath);
    }
  });
}

/** @param {unknown[]} left @param {unknown[]} right */
function identifierDifference(left, right) {
  const leftSet = new Set(sortedIdentifiers(left));
  const rightSet = new Set(sortedIdentifiers(right));
  return {
    missing: [...leftSet]
      .filter((value) => !rightSet.has(value))
      .sort(compareStrings),
    extra: [...rightSet]
      .filter((value) => !leftSet.has(value))
      .sort(compareStrings),
  };
}

/** @param {{missing: string[], extra: string[]}} difference */
function describeDifference(difference) {
  const parts = [];
  if (difference.missing.length > 0) {
    parts.push(`missing [${difference.missing.join(', ')}]`);
  }
  if (difference.extra.length > 0) {
    parts.push(`extra [${difference.extra.join(', ')}]`);
  }
  return parts.join('; ');
}

/**
 * Validate a parsed four-artifact research companion bundle. This function is
 * deterministic and read-only: it neither infers scientific truth nor mutates
 * publication state.
 *
 * @param {unknown} rawBundle
 * @returns {IntegrityIssue[]}
 */
export function validateResearchBundle(rawBundle) {
  const bundle = asObject(rawBundle);
  const search = asObject(bundle.search);
  const screening = asObject(bundle.screening);
  const extraction = asObject(bundle.extraction);
  const packet = asObject(bundle.packet);
  /** @type {IntegrityIssue[]} */
  const issues = [];

  const receipts = asArray(search.receipts);
  validateUniqueIds(
    issues,
    'search',
    receipts,
    'receiptId',
    '$.receipts',
    'receipt ID',
  );
  if (search.generatedAt !== undefined) {
    validateDate(
      issues,
      'search',
      '$.generatedAt',
      search.generatedAt,
      'Search artifact generation date',
    );
  }
  receipts.forEach((rawReceipt, index) => {
    const receipt = asObject(rawReceipt);
    validateDate(
      issues,
      'search',
      `$.receipts[${index}].executedAt`,
      receipt.executedAt,
      'Receipt execution date',
    );
    validateCount(
      issues,
      'search',
      `$.receipts[${index}].resultCount`,
      receipt.resultCount,
      'Receipt result count',
    );
    if (receipt.recordsRetrievedIntoScreening !== undefined) {
      validateCount(
        issues,
        'search',
        `$.receipts[${index}].recordsRetrievedIntoScreening`,
        receipt.recordsRetrievedIntoScreening,
        'Records retrieved into screening',
      );
    }
  });

  const records = asArray(screening.records);
  validateUniqueIds(
    issues,
    'screening',
    records,
    'recordId',
    '$.records',
    'screening record ID',
  );
  if (screening.generatedAt !== undefined) {
    validateDate(
      issues,
      'screening',
      '$.generatedAt',
      screening.generatedAt,
      'Screening artifact generation date',
    );
  }

  const fieldContract = asObject(screening.fieldContract);
  const omittedRetrievalEvents = records.filter(
    (rawRecord) => asObject(rawRecord).retrievalEvents === undefined,
  );
  const explicitDefault = fieldContract.retrievalEventsDefault;
  const hasUsableDefault = isCount(explicitDefault);
  if (omittedRetrievalEvents.length > 0 && !hasUsableDefault) {
    addIssue(issues, {
      code: 'RETRIEVAL_EVENTS_DEFAULT_MISSING',
      artifact: 'screening',
      path: '$.fieldContract.retrievalEventsDefault',
      message: `${omittedRetrievalEvents.length} screening record(s) omit retrievalEvents without a structured nonnegative default.`,
      remediation:
        'Add fieldContract.retrievalEventsDefault (normally 1), or record retrievalEvents explicitly on every screening record.',
    });
  }
  if (explicitDefault !== undefined) {
    validateCount(
      issues,
      'screening',
      '$.fieldContract.retrievalEventsDefault',
      explicitDefault,
      'Retrieval-event default',
    );
  }

  /** @type {Record<string, number>} */
  const terminalCounts = {
    duplicate: 0,
    excluded: 0,
    'awaiting-full-text': 0,
    included: 0,
  };
  let retrievalEventTotal = 0;

  records.forEach((rawRecord, recordIndex) => {
    const record = asObject(rawRecord);
    const state = record.terminalState;
    if (typeof state !== 'string' || !TERMINAL_STATES.has(state)) {
      addIssue(issues, {
        code: 'TERMINAL_STATE_INVALID',
        artifact: 'screening',
        path: `$.records[${recordIndex}].terminalState`,
        message:
          'Each screening record must carry exactly one scalar terminal state from duplicate, excluded, awaiting-full-text, or included.',
        remediation:
          'Replace the value with the single terminal state reached by this record; do not encode multiple states.',
      });
    } else {
      terminalCounts[state] = (terminalCounts[state] ?? 0) + 1;
    }

    const ownRetrievalEvents = record.retrievalEvents;
    if (ownRetrievalEvents !== undefined) {
      validateCount(
        issues,
        'screening',
        `$.records[${recordIndex}].retrievalEvents`,
        ownRetrievalEvents,
        'Record retrieval-event count',
      );
    }
    const eventCount =
      ownRetrievalEvents === undefined ? explicitDefault : ownRetrievalEvents;
    if (isCount(eventCount)) retrievalEventTotal += Number(eventCount);

    const acquisition = asObject(record.acquisition);
    const accessLevel = acquisition.accessLevel;
    const requiresLadder =
      state === 'awaiting-full-text' ||
      (state === 'included' && LOWER_ACCESS_LEVELS.has(String(accessLevel)));
    const attempts = asArray(acquisition.ladderStepsTried);
    if (requiresLadder && attempts.length === 0) {
      addIssue(issues, {
        code: 'ACQUISITION_LADDER_REQUIRED',
        artifact: 'screening',
        path: `$.records[${recordIndex}].acquisition.ladderStepsTried`,
        message: `${state} record ${JSON.stringify(record.recordId)} at ${String(accessLevel || 'unknown')} access has no recorded acquisition attempt.`,
        remediation:
          'Run the lawful acquisition ladder and record each attempt as {step, attemptedAt, result}; keep the terminal state honest if full text remains unavailable.',
      });
    }
    attempts.forEach((rawAttempt, attemptIndex) => {
      const attempt = asObject(rawAttempt);
      const attemptPath = `$.records[${recordIndex}].acquisition.ladderStepsTried[${attemptIndex}]`;
      if (!isRealIsoDate(attempt.attemptedAt)) {
        addIssue(issues, {
          code: 'ACQUISITION_ATTEMPT_DATE_INVALID',
          artifact: 'screening',
          path: `${attemptPath}.attemptedAt`,
          message:
            'Every acquisition attempt must record its real ISO 8601 attemptedAt date.',
          remediation:
            'Replace opaque ladder text with {step, attemptedAt, result} and record the date on which this route was actually tried.',
        });
      }
      if (!isIdentifier(attempt.result)) {
        addIssue(issues, {
          code: 'ACQUISITION_ATTEMPT_RESULT_REQUIRED',
          artifact: 'screening',
          path: `${attemptPath}.result`,
          message: 'Every acquisition attempt must record a nonempty result.',
          remediation:
            'Record the observed response or disposition (for example, HTTP status, no copy found, or version obtained).',
        });
      }
    });
  });

  const reconciliation = asObject(screening.reconciliation);
  const reconciliationKeys = [
    'recordsRetrieved',
    'duplicateRetrievalEvents',
    'uniqueRecordsAfterDeduplication',
    'excluded',
    'awaitingFullText',
    'included',
  ];
  for (const key of reconciliationKeys) {
    validateCount(
      issues,
      'screening',
      `$.reconciliation.${key}`,
      reconciliation[key],
      `Reconciliation ${key}`,
    );
  }

  const uniqueRecordTotal = records.length - (terminalCounts.duplicate ?? 0);
  const expectedScreeningTotals = {
    ...(omittedRetrievalEvents.length === 0 || hasUsableDefault
      ? {
          recordsRetrieved: retrievalEventTotal,
          duplicateRetrievalEvents: retrievalEventTotal - uniqueRecordTotal,
        }
      : {}),
    uniqueRecordsAfterDeduplication: uniqueRecordTotal,
    excluded: terminalCounts.excluded,
    awaitingFullText: terminalCounts['awaiting-full-text'],
    included: terminalCounts.included,
  };
  for (const [key, expected] of Object.entries(expectedScreeningTotals)) {
    if (reconciliation[key] === expected) continue;
    addIssue(issues, {
      code: 'SCREENING_TOTAL_MISMATCH',
      artifact: 'screening',
      path: `$.reconciliation.${key}`,
      message: `Declared ${key} is ${JSON.stringify(reconciliation[key])}; records derive ${expected}.`,
      remediation:
        'Recompute the reconciliation block from records[] and the explicit retrieval-event values/default.',
    });
  }

  const equationOneCloses =
    isCount(reconciliation.uniqueRecordsAfterDeduplication) &&
    isCount(reconciliation.excluded) &&
    isCount(reconciliation.awaitingFullText) &&
    isCount(reconciliation.included) &&
    Number(reconciliation.uniqueRecordsAfterDeduplication) ===
      Number(reconciliation.excluded) +
        Number(reconciliation.awaitingFullText) +
        Number(reconciliation.included) &&
    reconciliation.equationOneCloses === true;
  if (!equationOneCloses) {
    addIssue(issues, {
      code: 'RECONCILIATION_EQUATION_ONE_MISMATCH',
      artifact: 'screening',
      path: '$.reconciliation',
      message:
        'Equation one must close and be marked true: unique records = excluded + awaiting-full-text + included.',
      remediation:
        'Recompute all four values from records[] and set equationOneCloses only after the arithmetic closes.',
    });
  }

  const equationTwoCloses =
    isCount(reconciliation.recordsRetrieved) &&
    isCount(reconciliation.duplicateRetrievalEvents) &&
    isCount(reconciliation.uniqueRecordsAfterDeduplication) &&
    Number(reconciliation.recordsRetrieved) ===
      Number(reconciliation.duplicateRetrievalEvents) +
        Number(reconciliation.uniqueRecordsAfterDeduplication) &&
    reconciliation.equationTwoCloses === true;
  if (!equationTwoCloses) {
    addIssue(issues, {
      code: 'RECONCILIATION_EQUATION_TWO_MISMATCH',
      artifact: 'screening',
      path: '$.reconciliation',
      message:
        'Equation two must close and be marked true: records retrieved = duplicate retrieval events + unique records.',
      remediation:
        'Recompute retrieval events from records[] and the explicit default, then set equationTwoCloses only after the arithmetic closes.',
    });
  }

  const exclusionCodeCounts = asObject(screening.exclusionCodeCounts);
  for (const [code, count] of Object.entries(exclusionCodeCounts)) {
    validateCount(
      issues,
      'screening',
      `$.exclusionCodeCounts.${code}`,
      count,
      `Exclusion count ${code}`,
    );
  }
  /** @type {Record<string, number>} */
  const derivedExclusionCounts = {};
  for (const rawRecord of records) {
    const record = asObject(rawRecord);
    if (
      record.terminalState === 'excluded' &&
      isIdentifier(record.primaryReasonCode)
    ) {
      const code = String(record.primaryReasonCode);
      derivedExclusionCounts[code] = (derivedExclusionCounts[code] ?? 0) + 1;
    }
  }
  const exclusionCodes = new Set([
    ...Object.keys(exclusionCodeCounts),
    ...Object.keys(derivedExclusionCounts),
  ]);
  for (const code of [...exclusionCodes].sort(compareStrings)) {
    const declared = exclusionCodeCounts[code] ?? 0;
    const derived = derivedExclusionCounts[code] ?? 0;
    if (declared === derived) continue;
    addIssue(issues, {
      code: 'SCREENING_TOTAL_MISMATCH',
      artifact: 'screening',
      path: `$.exclusionCodeCounts.${code}`,
      message: `Declared exclusion count for ${code} is ${JSON.stringify(declared)}; records derive ${derived}.`,
      remediation:
        'Recompute exclusionCodeCounts from excluded records and their single primaryReasonCode values.',
    });
  }
  let declaredExclusionTotal = 0;
  for (const value of Object.values(exclusionCodeCounts)) {
    if (isCount(value)) declaredExclusionTotal += value;
  }
  const derivedExcludedTotal = terminalCounts.excluded ?? 0;
  if (declaredExclusionTotal !== derivedExcludedTotal) {
    addIssue(issues, {
      code: 'SCREENING_TOTAL_MISMATCH',
      artifact: 'screening',
      path: '$.exclusionCodeCounts',
      message: `Exclusion-code counts sum to ${declaredExclusionTotal}; excluded records derive ${derivedExcludedTotal}.`,
      remediation:
        'Give every excluded record one primaryReasonCode and recompute exclusionCodeCounts from those records.',
    });
  }

  const extractions = asArray(extraction.extractions);
  const awaitingFullText = asArray(extraction.awaitingFullText);
  validateUniqueIds(
    issues,
    'extraction',
    extractions,
    'extractionId',
    '$.extractions',
    'extraction ID',
  );
  validateUniqueIds(
    issues,
    'extraction',
    extractions,
    'recordId',
    '$.extractions',
    'extraction record ID',
  );
  validateUniqueIds(
    issues,
    'extraction',
    extractions,
    'proposedSourceId',
    '$.extractions',
    'proposed source ID',
  );
  validateUniqueIds(
    issues,
    'extraction',
    awaitingFullText,
    'recordId',
    '$.awaitingFullText',
    'awaiting-full-text record ID',
  );
  if (extraction.generatedAt !== undefined) {
    validateDate(
      issues,
      'extraction',
      '$.generatedAt',
      extraction.generatedAt,
      'Extraction artifact generation date',
    );
  }

  const screeningByRecordId = new Map(
    records
      .map((rawRecord) => asObject(rawRecord))
      .filter((record) => isIdentifier(record.recordId))
      .map((record) => [String(record.recordId), record]),
  );
  extractions.forEach((rawExtraction, extractionIndex) => {
    const extractionRecord = asObject(rawExtraction);
    const sourceFields = asObject(extractionRecord.sourceSchemaFields);
    const access = asObject(sourceFields.access);
    const publication = asObject(sourceFields.publication);
    const extracted = asObject(extractionRecord.extraction);
    const accessLevel = access.level;
    const screeningRecord = screeningByRecordId.get(
      String(extractionRecord.recordId),
    );
    const screeningAccess = asObject(
      asObject(screeningRecord).acquisition,
    ).accessLevel;
    if (
      !isIdentifier(accessLevel) ||
      !isIdentifier(screeningAccess) ||
      accessLevel !== screeningAccess
    ) {
      addIssue(issues, {
        code: 'ACCESS_LEVEL_MISMATCH',
        artifact: 'extraction',
        path: `$.extractions[${extractionIndex}].sourceSchemaFields.access.level`,
        message: `Extraction access ${JSON.stringify(accessLevel)} does not equal screening access ${JSON.stringify(screeningAccess)} for record ${JSON.stringify(extractionRecord.recordId)}.`,
        remediation:
          'Record the same observed access level in screening and extraction; do not infer a higher level from a locator.',
      });
    }

    if (!isIdentifier(extracted.language)) {
      addIssue(issues, {
        code: 'LANGUAGE_REQUIRED',
        artifact: 'extraction',
        path: `$.extractions[${extractionIndex}].extraction.language`,
        message:
          'The contracted extraction language field must not be null or empty.',
        remediation:
          'Record the source language code and preserve any translation method separately.',
      });
    }

    const reportedFacts = asArray(extracted.reportedFacts);
    reportedFacts.forEach((rawFact, factIndex) => {
      const fact = asObject(rawFact);
      const basisParts =
        typeof fact.basis === 'string'
          ? fact.basis
              .toLowerCase()
              .split(',')
              .map((part) => part.trim())
          : [];
      if (
        basisParts.includes('full-text') &&
        !FULL_TEXT_ACCESS_LEVELS.has(String(accessLevel))
      ) {
        addIssue(issues, {
          code: 'FULL_TEXT_BASIS_EXCEEDS_ACCESS',
          artifact: 'extraction',
          path: `$.extractions[${extractionIndex}].extraction.reportedFacts[${factIndex}].basis`,
          message: `Fact basis ${JSON.stringify(fact.basis)} exceeds source access ${JSON.stringify(accessLevel)}.`,
          remediation:
            'Either document lawful full-text access in both artifacts or lower the fact basis to the material actually read.',
        });
      }
    });

    for (const dateKey of ['statusCheckedAt', 'nextStatusCheckAt']) {
      if (publication[dateKey] !== undefined) {
        validateDate(
          issues,
          'extraction',
          `$.extractions[${extractionIndex}].sourceSchemaFields.publication.${dateKey}`,
          publication[dateKey],
          `Publication ${dateKey}`,
        );
      }
    }
  });

  const includedScreeningIds = records
    .map((rawRecord) => asObject(rawRecord))
    .filter((record) => record.terminalState === 'included')
    .map((record) => record.recordId);
  const extractionRecordIds = extractions.map(
    (rawExtraction) => asObject(rawExtraction).recordId,
  );
  const includedDifference = identifierDifference(
    includedScreeningIds,
    extractionRecordIds,
  );
  if (
    includedDifference.missing.length > 0 ||
    includedDifference.extra.length > 0
  ) {
    addIssue(issues, {
      code: 'INCLUDED_EXTRACTION_IDS_MISMATCH',
      artifact: 'extraction',
      path: '$.extractions',
      message: `Extraction record IDs do not equal screening included IDs: ${describeDifference(includedDifference)}.`,
      remediation:
        'Add or remove extraction entries until their recordId set exactly equals the screening included set.',
    });
  }

  const awaitingScreeningIds = records
    .map((rawRecord) => asObject(rawRecord))
    .filter((record) => record.terminalState === 'awaiting-full-text')
    .map((record) => record.recordId);
  const awaitingExtractionIds = awaitingFullText.map(
    (rawRecord) => asObject(rawRecord).recordId,
  );
  const awaitingDifference = identifierDifference(
    awaitingScreeningIds,
    awaitingExtractionIds,
  );
  if (
    awaitingDifference.missing.length > 0 ||
    awaitingDifference.extra.length > 0
  ) {
    addIssue(issues, {
      code: 'AWAITING_IDS_MISMATCH',
      artifact: 'extraction',
      path: '$.awaitingFullText',
      message: `Extraction awaiting-full-text IDs do not equal screening awaiting-full-text IDs: ${describeDifference(awaitingDifference)}.`,
      remediation:
        'Rebuild awaitingFullText from the screening records whose sole terminalState is awaiting-full-text.',
    });
  }

  const counts = asObject(extraction.counts);
  /** @type {Record<string, number>} */
  const derivedExtractionCounts = {
    includedSources: extractions.length,
    fullTextObtained: extractions.filter((rawExtraction) => {
      const sourceFields = asObject(asObject(rawExtraction).sourceSchemaFields);
      return FULL_TEXT_ACCESS_LEVELS.has(
        String(asObject(sourceFields.access).level),
      );
    }).length,
    abstractOnly: extractions.filter((rawExtraction) => {
      const sourceFields = asObject(asObject(rawExtraction).sourceSchemaFields);
      return asObject(sourceFields.access).level === 'abstract-only';
    }).length,
    metadataOnly: extractions.filter((rawExtraction) => {
      const sourceFields = asObject(asObject(rawExtraction).sourceSchemaFields);
      return asObject(sourceFields.access).level === 'metadata-only';
    }).length,
    nonEnglish: extractions.filter((rawExtraction) => {
      const language = asObject(asObject(rawExtraction).extraction).language;
      return (
        isIdentifier(language) &&
        !ENGLISH_LANGUAGE_CODES.has(String(language).toLowerCase())
      );
    }).length,
    preprints: extractions.filter((rawExtraction) => {
      const sourceFields = asObject(asObject(rawExtraction).sourceSchemaFields);
      return asObject(sourceFields.publication).stage === 'preprint';
    }).length,
    corrected: extractions.filter((rawExtraction) => {
      const sourceFields = asObject(asObject(rawExtraction).sourceSchemaFields);
      return asObject(sourceFields.publication).status === 'corrected';
    }).length,
    awaitingFullText: awaitingFullText.length,
  };
  const requiredExtractionCounts = [
    'includedSources',
    'fullTextObtained',
    'abstractOnly',
    'nonEnglish',
    'preprints',
    'corrected',
  ];
  const countKeys = new Set([
    ...requiredExtractionCounts,
    ...Object.keys(counts).filter((key) => key in derivedExtractionCounts),
  ]);
  for (const key of [...countKeys].sort(compareStrings)) {
    const declared = counts[key];
    validateCount(
      issues,
      'extraction',
      `$.counts.${key}`,
      declared,
      `Extraction summary ${key}`,
    );
    const expected = derivedExtractionCounts[key];
    if (declared === expected) continue;
    addIssue(issues, {
      code: 'EXTRACTION_COUNT_MISMATCH',
      artifact: 'extraction',
      path: `$.counts.${key}`,
      message: `Declared ${key} is ${JSON.stringify(declared)}; extraction records derive ${expected}.`,
      remediation:
        'Recompute counts from extractions[] and awaitingFullText after every screening or access change.',
    });
  }

  const packetSourceIds = asArray(packet.includedSourceIds);
  validateUniqueIdArray(
    issues,
    'packet',
    packetSourceIds,
    '$.includedSourceIds',
    'packet included source ID',
  );
  const proposedSourceIds = extractions.map(
    (rawExtraction) => asObject(rawExtraction).proposedSourceId,
  );
  const packetDifference = identifierDifference(
    proposedSourceIds,
    packetSourceIds,
  );
  if (
    packetDifference.missing.length > 0 ||
    packetDifference.extra.length > 0
  ) {
    addIssue(issues, {
      code: 'PACKET_SOURCE_IDS_MISMATCH',
      artifact: 'packet',
      path: '$.includedSourceIds',
      message: `Packet source IDs do not equal extraction proposed-source IDs: ${describeDifference(packetDifference)}.`,
      remediation:
        'Rebuild includedSourceIds from the validated extraction proposedSourceId values.',
    });
  }

  for (const dateKey of ['searchedAt', 'createdAt', 'updatedAt']) {
    if (packet[dateKey] !== undefined) {
      validateDate(
        issues,
        'packet',
        `$.${dateKey}`,
        packet[dateKey],
        `Packet ${dateKey}`,
      );
    }
  }
  asArray(packet.searches).forEach((rawSearch, index) => {
    const packetSearch = asObject(rawSearch);
    if (packetSearch.searchedAt !== undefined) {
      validateDate(
        issues,
        'packet',
        `$.searches[${index}].searchedAt`,
        packetSearch.searchedAt,
        'Packet search date',
      );
    }
    if (packetSearch.resultCount !== undefined) {
      validateCount(
        issues,
        'packet',
        `$.searches[${index}].resultCount`,
        packetSearch.resultCount,
        'Packet search result count',
      );
    }
  });

  return issues.sort(compareIssues);
}

const COMPONENTS = Object.freeze({
  search: {
    directory: 'research/searches',
    suffix: '-search-receipts.json',
  },
  screening: {
    directory: 'research/screening',
    suffix: '-screening-flow.json',
  },
  extraction: {
    directory: 'research/extractions',
    suffix: '-source-extractions.json',
  },
  packet: {
    directory: 'research/packets',
    suffix: '-evidence-packet.json',
  },
});

/**
 * @param {string} root
 * @returns {Promise<Map<string, Map<string, string>>>}
 */
async function discoverComponents(root) {
  /** @type {Map<string, Map<string, string>>} */
  const bundles = new Map();
  for (const [kind, contract] of Object.entries(COMPONENTS)) {
    const directory = path.join(root, contract.directory);
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (isObject(error) && error.code === 'ENOENT') continue;
      throw error;
    }
    for (const entry of entries.sort((left, right) =>
      compareStrings(left.name, right.name),
    )) {
      if (!entry.isFile()) continue;
      if (!entry.name.toLowerCase().endsWith(contract.suffix)) continue;
      const taskId = entry.name.slice(0, -contract.suffix.length).toUpperCase();
      const components = bundles.get(taskId) ?? new Map();
      if (!components.has(kind)) {
        components.set(kind, path.posix.join(contract.directory, entry.name));
      }
      bundles.set(taskId, components);
    }
  }
  return bundles;
}

/**
 * @param {string[]} arguments_
 */
function parseArguments(arguments_) {
  let root = process.cwd();
  let bundleId;
  let invalid = false;
  const remaining = [...arguments_];
  while (remaining.length > 0) {
    const flag = remaining.shift();
    const value = remaining.shift();
    if (!value) {
      invalid = true;
      break;
    }
    if (flag === '--root' && root === process.cwd()) root = path.resolve(value);
    else if (flag === '--bundle' && !bundleId) bundleId = value.toUpperCase();
    else {
      invalid = true;
      break;
    }
  }
  return { root, bundleId, invalid };
}

/** @param {string} value */
function toPlatformPath(value) {
  return value.split('/').join(path.sep);
}

/**
 * @param {IntegrityIssue} issue
 * @param {Partial<Record<Exclude<ArtifactKind, 'bundle'>, string>>} paths
 */
function printIssue(issue, paths) {
  const file = issue.artifact === 'bundle' ? '' : (paths[issue.artifact] ?? '');
  const location = [file, issue.path].filter(Boolean).join(' ');
  console.error(`[${issue.code}] ${location}: ${issue.message}`);
  console.error(`  Remediation: ${issue.remediation}`);
}

/** @param {string[]} arguments_ */
export async function runResearchIntegrityCli(arguments_) {
  const { root, bundleId, invalid } = parseArguments(arguments_);
  if (invalid) {
    console.error(
      '[ARGUMENT_INVALID] Usage: node scripts/evidence/research-integrity.mjs [--root <repository>] [--bundle <task-id>]',
    );
    return 2;
  }

  const discovered = await discoverComponents(root);
  if (bundleId && !discovered.has(bundleId)) {
    printIssue(
      {
        code: 'BUNDLE_MISSING',
        artifact: 'bundle',
        path: bundleId,
        message: `No research companion component was found for ${bundleId}.`,
        remediation:
          'Create the search, screening, extraction, and evidence-packet JSON files, or select the correct task ID.',
      },
      {},
    );
    return 1;
  }

  const selected = [...discovered.entries()]
    .filter(([taskId]) => !bundleId || taskId === bundleId)
    .sort(([left], [right]) => compareStrings(left, right));
  let failed = false;
  let completeCount = 0;
  const checkedIds = [];

  for (const [taskId, componentMap] of selected) {
    const missing = Object.keys(COMPONENTS)
      .filter((kind) => !componentMap.has(kind))
      .sort(compareStrings);
    const paths = Object.fromEntries(componentMap);
    if (missing.length > 0) {
      failed = true;
      printIssue(
        {
          code: 'BUNDLE_PARTIAL',
          artifact: 'bundle',
          path: taskId,
          message: `Research companion bundle is partial; missing ${missing.join(', ')}.`,
          remediation:
            'Complete all four versioned companion files before handoff; partial bundles are never skipped.',
        },
        paths,
      );
      continue;
    }

    /** @type {Partial<ResearchBundle>} */
    const parsed = {};
    let parseFailed = false;
    for (const kind of /** @type {(keyof ResearchBundle)[]} */ (
      Object.keys(COMPONENTS)
    )) {
      const relativePath = componentMap.get(kind);
      if (!relativePath) continue;
      try {
        parsed[kind] = JSON.parse(
          await readFile(path.join(root, toPlatformPath(relativePath)), 'utf8'),
        );
      } catch (error) {
        failed = true;
        parseFailed = true;
        printIssue(
          {
            code: 'JSON_PARSE_FAILED',
            artifact: /** @type {ArtifactKind} */ (kind),
            path: '$',
            message: `JSON could not be parsed: ${error instanceof Error ? error.message : String(error)}.`,
            remediation:
              'Repair the JSON syntax without changing scientific content, then rerun the gate.',
          },
          paths,
        );
      }
    }
    if (parseFailed) continue;

    completeCount += 1;
    checkedIds.push(taskId);
    const issues = validateResearchBundle(parsed);
    if (issues.length > 0) {
      failed = true;
      for (const issue of issues) printIssue(issue, paths);
    }
  }

  if (failed) return 1;
  if (completeCount === 0) {
    console.log('Research integrity passed: 0 complete bundles checked.');
  } else {
    console.log(
      `Research integrity passed: ${completeCount} complete ${completeCount === 1 ? 'bundle' : 'bundles'} checked (${checkedIds.join(', ')}).`,
    );
  }
  return 0;
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  try {
    process.exitCode = await runResearchIntegrityCli(process.argv.slice(2));
  } catch (error) {
    console.error(
      `[JSON_PARSE_FAILED] $: Research integrity could not read the repository: ${error instanceof Error ? error.message : String(error)}.`,
    );
    console.error(
      '  Remediation: confirm the repository path is readable and rerun the gate.',
    );
    process.exitCode = 1;
  }
}
