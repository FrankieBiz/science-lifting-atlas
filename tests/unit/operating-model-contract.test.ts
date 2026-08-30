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
});
