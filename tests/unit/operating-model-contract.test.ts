import { describe, expect, it } from 'vitest';

import {
  REQUIRED_DOC_SNIPPETS,
  REQUIRED_HANDOFF_SECTIONS,
  REQUIRED_OPERATING_PATHS,
  validateOperatingModel,
} from '../../scripts/foundation/operating-model.mjs';

function completeDocFileContents() {
  const contents = new Map(
    Object.entries(REQUIRED_DOC_SNIPPETS).map(([filePath, snippets]) => [
      filePath,
      snippets.join('\n'),
    ]),
  );

  contents.set(
    'docs/runbooks/handoff-template.md',
    REQUIRED_HANDOFF_SECTIONS.join('\n\n'),
  );
  contents.set(
    'docs/runbooks/operating-policy.json',
    JSON.stringify({
      schemaVersion: 2,
      authority: {
        merge: 'codex',
        staleClaimClearance: 'codex',
        contentPromotion: 'codex',
      },
      lifecycle: {
        builderClaimCloses: 'immutable-handoff-commit',
        reviewClaimRecordedBy: 'codex',
        reviewClaimScope: 'exact-append-only-report-path',
        restrictedRoleDiffBase: 'reviewed-artifact-commit',
        claimRecordLocation: 'codex-coordination-branch',
        reviewClaimCloses: 'immutable-review-report-commit',
        failedReviewOpens: 'bounded-remediation-claim',
        handoffMachineFacts: 'generated-by-pnpm-handoff',
      },
      qualityControl: {
        defaultIndependentReviewCount: 1,
        passRequiresZeroCritical: true,
        passRequiresZeroImportant: true,
        minorFindingsMayBeDeferredWhenNonblocking: true,
        additionalPreReviewRequiresNamedMaterialRisk: true,
        failedReviewAction: 'bounded-remediation-then-full-artifact-recheck',
        progressUnit: 'accepted-capabilities-and-user-journey-proof',
        overallPercentAllowedAfter:
          'SBLA-017-observed-throughput-and-owner-approved-estimate',
        reviewTiers: {
          evidence: 'every-claim-rounds-continue-while-science-findings-open',
          publish: 'one-review-per-change-set-round-cap',
          build: 'automated-checks-and-milestone-gate-review',
        },
        nonEvidenceRoundCap: 2,
        roundCapExceededAction: 'owner-written-accept-narrow-or-drop',
        lintBypassFindingSeverity:
          'minor-with-fixture-unless-approved-content-exploits-it',
        evidencePipelineTiers: {
          descriptive: 'two-authoritative-sources-locators-citation-entailment',
          mechanistic:
            'saved-targeted-search-extraction-entailment-contradiction-search',
          outcome: 'full-section-9-8-pipeline',
        },
      },
      roleIdentity: {
        claudeResearchAccount: 'A',
        claudeReviewAccount: 'B',
        requiresDistinctClaudeTeamAccounts: true,
        sameAccountSessionSatisfiesReview: false,
        codexRoleMayBeFilledBy:
          'codex-or-claude-code-session-not-authoring-or-reviewing-the-artifact',
        claudeRoleEnvironment: 'repository-capable-claude-code-worktree',
      },
      delivery: {
        lanes: {
          product: ['SBLA-012', 'SBLA-016'],
          evidence: ['SBLA-017', 'SBLA-018', 'SBLA-019'],
          anatomy3d: ['SBLA-013', 'SBLA-014', 'SBLA-015'],
        },
        authoritativeAnatomyPath: '2d',
        betaGateMayFollow: 'SBLA-018',
      },
      writeBoundaries: {
        codex: null,
        'claude-research': ['research/', 'content-drafts/'],
        'claude-review': ['reviews/'],
      },
    }),
  );

  return contents;
}

describe('agent operating-model contract', () => {
  it('requires every load-bearing operating artifact', () => {
    expect(REQUIRED_OPERATING_PATHS).toEqual(
      expect.arrayContaining([
        'AGENTS.md',
        'docs/runbooks/handoff-template.md',
        'docs/runbooks/current-work.md',
        'docs/runbooks/branch-and-worktree.md',
        'docs/runbooks/operating-policy.json',
        'docs/product/master-plan.md',
        'docs/adr/0006-execution-quality-and-validation-gates.md',
        'docs/adr/0007-throughput-and-parallel-delivery.md',
      ]),
    );
  });

  it('reports every missing operating artifact together', () => {
    const issues = validateOperatingModel({
      existingPaths: new Set<string>(),
      fileContents: new Map<string, string>(),
    });

    expect(issues).toContain('missing required operating path: AGENTS.md');
    expect(issues).toContain(
      'missing required operating path: docs/runbooks/current-work.md',
    );
    expect(issues).toContain(
      'missing required operating path: docs/adr/0007-throughput-and-parallel-delivery.md',
    );
  });

  it('rejects a handoff template missing any master plan section 13.6 heading', () => {
    const fileContents = completeDocFileContents();
    fileContents.set(
      'docs/runbooks/handoff-template.md',
      ['## Objective', '## Work completed'].join('\n\n'),
    );

    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents,
    });

    expect(issues).toContain(
      'handoff template missing required section: ## Known uncertainties',
    );
    expect(issues).toContain(
      'handoff template missing required section: ## Acceptance criteria',
    );
  });

  it('rejects operating documents that drop a load-bearing rule', () => {
    const fileContents = completeDocFileContents();
    fileContents.set('AGENTS.md', '# Agents\n\nNothing binding here.');

    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents,
    });

    expect(
      issues.some((issue) =>
        issue.startsWith(
          'operating document missing required content: AGENTS.md',
        ),
      ),
    ).toBe(true);
  });

  it('requires the ledger to carry the stale-ownership recovery rule', () => {
    const fileContents = completeDocFileContents();
    fileContents.set(
      'docs/runbooks/current-work.md',
      '# Current work\n\nNo claims recorded.',
    );

    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents,
    });

    expect(issues).toContain(
      'operating document missing required content: docs/runbooks/current-work.md -> 24 hours',
    );
  });

  it('accepts a complete operating-model fixture', () => {
    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents: completeDocFileContents(),
    });

    expect(issues).toEqual([]);
  });

  it('rejects a structured grant of merge authority to Claude Review', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.authority.merge = 'claude-review';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain('operating policy authority.merge must equal codex');
  });

  it('rejects a structured lifecycle that keeps the builder claim through review', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.lifecycle.builderClaimCloses = 'after-independent-review';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'operating policy lifecycle.builderClaimCloses must equal immutable-handoff-commit',
    );
  });

  it('requires Codex-mediated exact-path review claims and immutable closure', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.lifecycle.reviewClaimRecordedBy = 'claude-review';
    policy.lifecycle.reviewClaimScope = 'all-reviews';
    policy.lifecycle.restrictedRoleDiffBase = 'codex-claim-commit';
    policy.lifecycle.claimRecordLocation = 'reviewer-branch';
    policy.lifecycle.reviewClaimCloses = 'review-start';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents,
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        'operating policy lifecycle.reviewClaimRecordedBy must equal codex',
        'operating policy lifecycle.reviewClaimScope must equal exact-append-only-report-path',
        'operating policy lifecycle.restrictedRoleDiffBase must equal reviewed-artifact-commit',
        'operating policy lifecycle.claimRecordLocation must equal codex-coordination-branch',
        'operating policy lifecycle.reviewClaimCloses must equal immutable-review-report-commit',
      ]),
    );
  });

  it('requires distinct Claude Team accounts as structured policy', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.roleIdentity.sameAccountSessionSatisfiesReview = true;
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'operating policy roleIdentity.sameAccountSessionSatisfiesReview must equal false',
    );
  });

  it('enforces the one-review stop rule and evidence-based progress reporting', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.qualityControl.defaultIndependentReviewCount = 2;
    policy.qualityControl.overallPercentAllowedAfter = 'immediately';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toEqual(
      expect.arrayContaining([
        'operating policy qualityControl.defaultIndependentReviewCount must equal 1',
        'operating policy qualityControl.overallPercentAllowedAfter must equal SBLA-017-observed-throughput-and-owner-approved-estimate',
      ]),
    );
  });

  it('rejects pass-threshold drift in every canonical prose contract', () => {
    const threshold = 'zero unresolved Critical and Important findings';
    const fileContents = completeDocFileContents();
    fileContents.set(
      'AGENTS.md',
      `One independent acceptance review is the default\nSBLA-017\n${threshold}`,
    );
    fileContents.set('docs/product/master-plan.md', threshold);
    fileContents.set(
      'docs/adr/0006-execution-quality-and-validation-gates.md',
      threshold,
    );

    for (const filePath of [
      'AGENTS.md',
      'docs/product/master-plan.md',
      'docs/adr/0006-execution-quality-and-validation-gates.md',
    ]) {
      const mutated = new Map(fileContents);
      mutated.set(
        filePath,
        (mutated.get(filePath) ?? '').replace(
          threshold,
          'zero unresolved Critical findings',
        ),
      );

      expect(
        validateOperatingModel({
          existingPaths: new Set(REQUIRED_OPERATING_PATHS),
          fileContents: mutated,
        }),
      ).toContain(
        `operating document missing required content: ${filePath} -> ${threshold}`,
      );
    }
  });

  it('requires handoff headings exactly once and in canonical order', () => {
    const fileContents = completeDocFileContents();
    fileContents.set(
      'docs/runbooks/handoff-template.md',
      [...REQUIRED_HANDOFF_SECTIONS].reverse().join('\n\n'),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'handoff template sections must appear exactly once in required order',
    );

    fileContents.set(
      'docs/runbooks/handoff-template.md',
      [...REQUIRED_HANDOFF_SECTIONS, '## Objective'].join('\n\n'),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'handoff template sections must appear exactly once in required order',
    );
  });

  it('rejects authority grants that contradict Codex-only policy', () => {
    const fileContents = completeDocFileContents();
    fileContents.set(
      'AGENTS.md',
      `${fileContents.get('AGENTS.md')}\nClaude Review may merge task branches.`,
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'operating document contains prohibited content: AGENTS.md -> Claude Review may merge',
    );
  });

  it('rejects the contradictory post-handoff ownership lifecycle', () => {
    const fileContents = completeDocFileContents();
    fileContents.set(
      'docs/runbooks/current-work.md',
      `${fileContents.get('docs/runbooks/current-work.md')}\nThe claim stays open until independent review completes.`,
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toContain(
      'operating document contains prohibited content: docs/runbooks/current-work.md -> claim stays open until independent review',
    );
  });

  it('enforces the ADR 0007 round cap and risk tiers as structured policy', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.qualityControl.nonEvidenceRoundCap = 5;
    policy.qualityControl.reviewTiers.evidence = 'sampled';
    policy.qualityControl.lintBypassFindingSeverity = 'important';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toEqual(
      expect.arrayContaining([
        'operating policy qualityControl.nonEvidenceRoundCap must equal 2',
        'operating policy qualityControl.reviewTiers.evidence must equal every-claim-rounds-continue-while-science-findings-open',
        'operating policy qualityControl.lintBypassFindingSeverity must equal minor-with-fixture-unless-approved-content-exploits-it',
      ]),
    );
  });

  it('keeps 3D off the content critical path', () => {
    const fileContents = completeDocFileContents();
    const policy = JSON.parse(
      fileContents.get('docs/runbooks/operating-policy.json') ?? '{}',
    );
    policy.delivery.lanes.evidence = ['SBLA-015', 'SBLA-017', 'SBLA-018'];
    policy.delivery.authoritativeAnatomyPath = '3d';
    fileContents.set(
      'docs/runbooks/operating-policy.json',
      JSON.stringify(policy),
    );

    expect(
      validateOperatingModel({
        existingPaths: new Set(REQUIRED_OPERATING_PATHS),
        fileContents,
      }),
    ).toEqual(
      expect.arrayContaining([
        'operating policy delivery.lanes.evidence must equal ["SBLA-017","SBLA-018","SBLA-019"]',
        'operating policy delivery.authoritativeAnatomyPath must equal 2d',
      ]),
    );
  });

  it('rejects an ADR 0007 that is not accepted or drops every-claim review', () => {
    const fileContents = completeDocFileContents();
    const adrPath = 'docs/adr/0007-throughput-and-parallel-delivery.md';
    fileContents.set(
      adrPath,
      (fileContents.get(adrPath) ?? '')
        .replace('- Status: Accepted', '- Status: Proposed')
        .replace('Every claim is still independently checked.', ''),
    );

    const issues = validateOperatingModel({
      existingPaths: new Set(REQUIRED_OPERATING_PATHS),
      fileContents,
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        `operating document missing required content: ${adrPath} -> - Status: Accepted`,
        `operating document missing required content: ${adrPath} -> Every claim is still independently checked.`,
      ]),
    );
  });
});
