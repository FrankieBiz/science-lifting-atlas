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
      schemaVersion: 1,
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
      },
      qualityControl: {
        defaultIndependentReviewCount: 1,
        passRequiresZeroCritical: true,
        passRequiresZeroImportant: true,
        minorFindingsMayBeDeferredWhenNonblocking: true,
        additionalPreReviewRequiresNamedMaterialRisk: true,
        failedReviewAction: 'bounded-remediation-then-full-artifact-recheck',
        progressUnit: 'accepted-capabilities-and-user-journey-proof',
        overallPercentAllowedAfter: 'SBLA-017-observed-throughput',
      },
      roleIdentity: {
        claudeResearchAccount: 'A',
        claudeReviewAccount: 'B',
        requiresDistinctClaudeTeamAccounts: true,
        sameAccountSessionSatisfiesReview: false,
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
  it('requires every SBLA-002 operating artifact named by master plan section 18', () => {
    expect(REQUIRED_OPERATING_PATHS).toEqual(
      expect.arrayContaining([
        'AGENTS.md',
        'CLAUDE.md',
        'docs/runbooks/handoff-template.md',
        'docs/runbooks/current-work.md',
        'docs/runbooks/branch-and-worktree.md',
        'docs/runbooks/claude-environments.md',
        'docs/runbooks/operating-policy.json',
      ]),
    );
  });

  it('reports every missing operating artifact together', () => {
    const issues = validateOperatingModel({
      existingPaths: new Set<string>(),
      fileContents: new Map<string, string>(),
    });

    expect(issues).toContain('missing required operating path: AGENTS.md');
    expect(issues).toContain('missing required operating path: CLAUDE.md');
    expect(issues).toContain(
      'missing required operating path: docs/runbooks/current-work.md',
    );
    expect(issues).toContain(
      'missing required operating path: docs/runbooks/claude-environments.md',
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
        'operating policy qualityControl.overallPercentAllowedAfter must equal SBLA-017-observed-throughput',
      ]),
    );
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
});
