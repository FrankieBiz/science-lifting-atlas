export const REQUIRED_OPERATING_PATHS = Object.freeze([
  'AGENTS.md',
  'docs/runbooks/handoff-template.md',
  'docs/runbooks/current-work.md',
  'docs/runbooks/branch-and-worktree.md',
  'docs/runbooks/operating-policy.json',
  'docs/product/master-plan.md',
  'docs/adr/0006-execution-quality-and-validation-gates.md',
  'docs/adr/0007-throughput-and-parallel-delivery.md',
]);

const OPERATING_POLICY_PATH = 'docs/runbooks/operating-policy.json';

/** Master plan section 13.6 fixes the handoff packet headings. */
export const REQUIRED_HANDOFF_SECTIONS = Object.freeze([
  '## Objective',
  '## Inputs and exact paths',
  '## Constraints',
  '## Work completed',
  '## Decisions made',
  '## Tests/checks run and results',
  '## Known uncertainties',
  '## Files created or modified',
  '## Required reviewer action',
  '## Acceptance criteria',
]);

/**
 * Load-bearing rules that must survive any future edit of these documents.
 * Each entry is checked as a literal substring so the contract fails closed
 * when a rule is silently dropped rather than deliberately renegotiated.
 */
export const REQUIRED_DOC_SNIPPETS = Object.freeze({
  'AGENTS.md': Object.freeze([
    'Codex',
    'Claude Research',
    'Claude Review',
    'docs/runbooks/current-work.md',
    'pnpm verify',
    'content-drafts/',
    'reviews/',
    'docs/runbooks/operating-policy.json',
    'One independent acceptance review is the default',
    'zero unresolved Critical and Important findings',
    'their impact and follow-up destination are recorded',
    'new named material risk',
    'one bounded remediation',
    'recheck the complete artifact once',
    'SBLA-017',
    'docs/adr/0007-throughput-and-parallel-delivery.md',
    'Every claim is independently reviewed',
    'There is no third review round outside the evidence tier',
    'Lints are safety nets',
    'Codex records the exact-path claim on',
    'Environment type',
    'Git remote',
    'Source-transfer method',
    'Allowed directories',
    'Readiness result',
    'Fallback',
  ]),
  'docs/runbooks/current-work.md': Object.freeze([
    'Base commit',
    'Expected handoff',
    '24 hours',
    'Codex is the only merge authority',
    'A builder claim closes when its immutable handoff is committed.',
    'restricted-role claim',
  ]),
  'docs/runbooks/branch-and-worktree.md': Object.freeze([
    'codex/<task-id>-<slug>',
    'claude-research/<task-id>-<slug>',
    'claude-review/<task-id>-<slug>',
    'git worktree add',
    'Codex is the only merge authority',
    'A builder claim closes when its immutable handoff is committed.',
    'Codex records the exact append-only report path',
  ]),
  'docs/product/master-plan.md': Object.freeze([
    'one independent acceptance review',
    'zero unresolved Critical and Important findings',
    'their impact and follow-up destination are recorded',
    'one bounded remediation followed by one complete-artifact recheck',
    'SBLA-017 measures vertical-slice throughput',
    'owner approves the revised effort estimate',
    'Every claim still receives independent citation-entailment review',
    'The authoritative 2D plate satisfies this requirement',
  ]),
  'docs/adr/0006-execution-quality-and-validation-gates.md': Object.freeze([
    'one independent acceptance review',
    'zero unresolved Critical and Important findings',
    'their impact and follow-up destination are recorded',
    'one bounded remediation followed by one full-artifact recheck',
    'SBLA-017 records observed throughput',
    'approves the revised estimate',
  ]),
  'docs/adr/0007-throughput-and-parallel-delivery.md': Object.freeze([
    '- Status: Accepted',
    'Every claim is still independently checked.',
    'There is no third round.',
    'Tier E claim review, not the lint, remains the guarantee.',
  ]),
});

export const FORBIDDEN_DOC_SNIPPETS = Object.freeze({
  'AGENTS.md': Object.freeze([
    'Claude Review may merge',
    'Claude Research may merge',
    'Claude Review may clear stale',
    'Claude Research may clear stale',
  ]),
  'docs/runbooks/current-work.md': Object.freeze([
    'claim stays open until independent review',
    'ownership is not released at the review gate',
  ]),
  'docs/runbooks/branch-and-worktree.md': Object.freeze([
    'Claude Review may merge',
    'Claude Research may merge',
    'Claude Review may clear stale',
    'Claude Research may clear stale',
  ]),
});

const REQUIRED_POLICY_FIELDS = Object.freeze({
  schemaVersion: 2,
  'authority.merge': 'codex',
  'authority.staleClaimClearance': 'codex',
  'authority.contentPromotion': 'codex',
  'lifecycle.builderClaimCloses': 'immutable-handoff-commit',
  'lifecycle.reviewClaimRecordedBy': 'codex',
  'lifecycle.reviewClaimScope': 'exact-append-only-report-path',
  'lifecycle.restrictedRoleDiffBase': 'reviewed-artifact-commit',
  'lifecycle.claimRecordLocation': 'codex-coordination-branch',
  'lifecycle.reviewClaimCloses': 'immutable-review-report-commit',
  'lifecycle.failedReviewOpens': 'bounded-remediation-claim',
  'lifecycle.handoffMachineFacts': 'generated-by-pnpm-handoff',
  'qualityControl.defaultIndependentReviewCount': 1,
  'qualityControl.passRequiresZeroCritical': true,
  'qualityControl.passRequiresZeroImportant': true,
  'qualityControl.minorFindingsMayBeDeferredWhenNonblocking': true,
  'qualityControl.additionalPreReviewRequiresNamedMaterialRisk': true,
  'qualityControl.failedReviewAction':
    'bounded-remediation-then-full-artifact-recheck',
  'qualityControl.progressUnit': 'accepted-capabilities-and-user-journey-proof',
  'qualityControl.overallPercentAllowedAfter':
    'SBLA-017-observed-throughput-and-owner-approved-estimate',
  'qualityControl.reviewTiers.evidence':
    'every-claim-rounds-continue-while-science-findings-open',
  'qualityControl.reviewTiers.publish': 'one-review-per-change-set-round-cap',
  'qualityControl.reviewTiers.build':
    'automated-checks-and-milestone-gate-review',
  'qualityControl.nonEvidenceRoundCap': 2,
  'qualityControl.roundCapExceededAction':
    'owner-written-accept-narrow-or-drop',
  'qualityControl.lintBypassFindingSeverity':
    'minor-with-fixture-unless-approved-content-exploits-it',
  'qualityControl.evidencePipelineTiers.descriptive':
    'two-authoritative-sources-locators-citation-entailment',
  'qualityControl.evidencePipelineTiers.mechanistic':
    'saved-targeted-search-extraction-entailment-contradiction-search',
  'qualityControl.evidencePipelineTiers.outcome': 'full-section-9-8-pipeline',
  'roleIdentity.claudeResearchAccount': 'A',
  'roleIdentity.claudeReviewAccount': 'B',
  'roleIdentity.requiresDistinctClaudeTeamAccounts': true,
  'roleIdentity.sameAccountSessionSatisfiesReview': false,
  'roleIdentity.codexRoleMayBeFilledBy':
    'codex-or-claude-code-session-not-authoring-or-reviewing-the-artifact',
  'roleIdentity.claudeRoleEnvironment':
    'repository-capable-claude-code-worktree',
  'delivery.authoritativeAnatomyPath': '2d',
  'delivery.betaGateMayFollow': 'SBLA-018',
});

/** ADR 0007 D5 lanes; compared as exact ordered lists. */
const REQUIRED_DELIVERY_LANES = Object.freeze({
  product: Object.freeze(['SBLA-012', 'SBLA-016']),
  evidence: Object.freeze(['SBLA-017', 'SBLA-018', 'SBLA-019']),
  anatomy3d: Object.freeze(['SBLA-013', 'SBLA-014', 'SBLA-015']),
});

const REQUIRED_POLICY_KEYS = Object.freeze({
  root: Object.freeze([
    'schemaVersion',
    'authority',
    'lifecycle',
    'roleIdentity',
    'qualityControl',
    'delivery',
    'writeBoundaries',
  ]),
  authority: Object.freeze([
    'merge',
    'staleClaimClearance',
    'contentPromotion',
  ]),
  lifecycle: Object.freeze([
    'builderClaimCloses',
    'reviewClaimRecordedBy',
    'reviewClaimScope',
    'restrictedRoleDiffBase',
    'claimRecordLocation',
    'reviewClaimCloses',
    'failedReviewOpens',
    'handoffMachineFacts',
  ]),
  roleIdentity: Object.freeze([
    'claudeResearchAccount',
    'claudeReviewAccount',
    'requiresDistinctClaudeTeamAccounts',
    'sameAccountSessionSatisfiesReview',
    'codexRoleMayBeFilledBy',
    'claudeRoleEnvironment',
  ]),
  qualityControl: Object.freeze([
    'defaultIndependentReviewCount',
    'passRequiresZeroCritical',
    'passRequiresZeroImportant',
    'minorFindingsMayBeDeferredWhenNonblocking',
    'additionalPreReviewRequiresNamedMaterialRisk',
    'failedReviewAction',
    'progressUnit',
    'overallPercentAllowedAfter',
    'reviewTiers',
    'nonEvidenceRoundCap',
    'roundCapExceededAction',
    'lintBypassFindingSeverity',
    'evidencePipelineTiers',
  ]),
  reviewTiers: Object.freeze(['evidence', 'publish', 'build']),
  evidencePipelineTiers: Object.freeze([
    'descriptive',
    'mechanistic',
    'outcome',
  ]),
  delivery: Object.freeze([
    'lanes',
    'authoritativeAnatomyPath',
    'betaGateMayFollow',
  ]),
  lanes: Object.freeze(['product', 'evidence', 'anatomy3d']),
  writeBoundaries: Object.freeze(['codex', 'claude-research', 'claude-review']),
});

/**
 * @param {unknown} value
 * @param {string} dottedPath
 * @returns {unknown}
 */
function valueAtPath(value, dottedPath) {
  let current = value;

  for (const key of dottedPath.split('.')) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = /** @type {Record<string, unknown>} */ (current)[key];
  }

  return current;
}

/**
 * @param {unknown} value
 * @param {readonly string[]} expectedKeys
 */
function hasExactKeys(value, expectedKeys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actualKeys = Object.keys(value).sort();
  return (
    actualKeys.length === expectedKeys.length &&
    actualKeys.every((key, index) => key === [...expectedKeys].sort()[index])
  );
}

/** @param {unknown} policy */
function validateStructuredPolicy(policy) {
  const issues = [];

  /** @type {Array<[string, unknown, readonly string[]]>} */
  const records = [
    ['root', policy, REQUIRED_POLICY_KEYS.root],
    [
      'authority',
      valueAtPath(policy, 'authority'),
      REQUIRED_POLICY_KEYS.authority,
    ],
    [
      'lifecycle',
      valueAtPath(policy, 'lifecycle'),
      REQUIRED_POLICY_KEYS.lifecycle,
    ],
    [
      'roleIdentity',
      valueAtPath(policy, 'roleIdentity'),
      REQUIRED_POLICY_KEYS.roleIdentity,
    ],
    [
      'qualityControl',
      valueAtPath(policy, 'qualityControl'),
      REQUIRED_POLICY_KEYS.qualityControl,
    ],
    [
      'qualityControl.reviewTiers',
      valueAtPath(policy, 'qualityControl.reviewTiers'),
      REQUIRED_POLICY_KEYS.reviewTiers,
    ],
    [
      'qualityControl.evidencePipelineTiers',
      valueAtPath(policy, 'qualityControl.evidencePipelineTiers'),
      REQUIRED_POLICY_KEYS.evidencePipelineTiers,
    ],
    [
      'delivery',
      valueAtPath(policy, 'delivery'),
      REQUIRED_POLICY_KEYS.delivery,
    ],
    [
      'delivery.lanes',
      valueAtPath(policy, 'delivery.lanes'),
      REQUIRED_POLICY_KEYS.lanes,
    ],
    [
      'writeBoundaries',
      valueAtPath(policy, 'writeBoundaries'),
      REQUIRED_POLICY_KEYS.writeBoundaries,
    ],
  ];

  for (const [label, value, keys] of records) {
    if (!hasExactKeys(value, keys)) {
      issues.push(
        `operating policy ${label} must contain exactly: ${keys.join(', ')}`,
      );
    }
  }

  for (const [field, expected] of Object.entries(REQUIRED_POLICY_FIELDS)) {
    if (valueAtPath(policy, field) !== expected) {
      issues.push(`operating policy ${field} must equal ${expected}`);
    }
  }

  const expectedBoundaries = {
    codex: null,
    'claude-research': ['research/', 'content-drafts/'],
    'claude-review': ['reviews/'],
  };

  for (const [role, expected] of Object.entries(expectedBoundaries)) {
    const actual = valueAtPath(policy, `writeBoundaries.${role}`);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      issues.push(
        `operating policy writeBoundaries.${role} must equal ${JSON.stringify(expected)}`,
      );
    }
  }

  for (const [lane, expected] of Object.entries(REQUIRED_DELIVERY_LANES)) {
    const actual = valueAtPath(policy, `delivery.lanes.${lane}`);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      issues.push(
        `operating policy delivery.lanes.${lane} must equal ${JSON.stringify(expected)}`,
      );
    }
  }

  return issues;
}

/**
 * @typedef {object} OperatingModelInput
 * @property {Set<string>} existingPaths
 * @property {Map<string, string>} [fileContents]
 */

/** @param {OperatingModelInput} input */
export function validateOperatingModel({
  existingPaths,
  fileContents = new Map(),
}) {
  const issues = [];

  for (const path of REQUIRED_OPERATING_PATHS) {
    if (!existingPaths.has(path)) {
      issues.push(`missing required operating path: ${path}`);
    }
  }

  const policySource = fileContents.get(OPERATING_POLICY_PATH) ?? '';
  try {
    issues.push(...validateStructuredPolicy(JSON.parse(policySource)));
  } catch {
    issues.push(`operating policy is not valid JSON: ${OPERATING_POLICY_PATH}`);
  }

  const handoffTemplate =
    fileContents.get('docs/runbooks/handoff-template.md') ?? '';
  for (const section of REQUIRED_HANDOFF_SECTIONS) {
    if (!handoffTemplate.includes(section)) {
      issues.push(`handoff template missing required section: ${section}`);
    }
  }

  const actualHandoffSections =
    handoffTemplate.match(/^## .+$/gm)?.map((section) => section.trim()) ?? [];
  if (
    actualHandoffSections.length !== REQUIRED_HANDOFF_SECTIONS.length ||
    actualHandoffSections.some(
      (section, index) => section !== REQUIRED_HANDOFF_SECTIONS[index],
    )
  ) {
    issues.push(
      'handoff template sections must appear exactly once in required order',
    );
  }

  for (const [filePath, snippets] of Object.entries(REQUIRED_DOC_SNIPPETS)) {
    const content = fileContents.get(filePath) ?? '';
    for (const snippet of snippets) {
      if (!content.includes(snippet)) {
        issues.push(
          `operating document missing required content: ${filePath} -> ${snippet}`,
        );
      }
    }
  }

  for (const [filePath, snippets] of Object.entries(FORBIDDEN_DOC_SNIPPETS)) {
    const content = fileContents.get(filePath) ?? '';
    for (const snippet of snippets) {
      if (content.includes(snippet)) {
        issues.push(
          `operating document contains prohibited content: ${filePath} -> ${snippet}`,
        );
      }
    }
  }

  return issues;
}
