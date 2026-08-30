export const REQUIRED_OPERATING_PATHS = Object.freeze([
  'AGENTS.md',
  'CLAUDE.md',
  'docs/runbooks/handoff-template.md',
  'docs/runbooks/current-work.md',
  'docs/runbooks/branch-and-worktree.md',
  'docs/runbooks/claude-environments.md',
]);

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
  ]),
  'CLAUDE.md': Object.freeze([
    'docs/product/master-plan.md',
    'docs/runbooks/handoff-template.md',
    'Claude Research',
    'Claude Review',
    'content-drafts/',
    'reviews/',
  ]),
  'docs/runbooks/current-work.md': Object.freeze([
    'Base commit',
    'Expected handoff',
    '24 hours',
    'Codex is the only merge authority',
  ]),
  'docs/runbooks/branch-and-worktree.md': Object.freeze([
    'codex/<task-id>-<slug>',
    'claude-research/<task-id>-<slug>',
    'claude-review/<task-id>-<slug>',
    'git worktree add',
    'Codex is the only merge authority',
  ]),
  'docs/runbooks/claude-environments.md': Object.freeze([
    'Environment type',
    'Git remote',
    'Source-transfer method',
    'Allowed directories',
    'Readiness result',
    'Fallback',
    'SBLA-008',
  ]),
});

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

  const handoffTemplate =
    fileContents.get('docs/runbooks/handoff-template.md') ?? '';
  for (const section of REQUIRED_HANDOFF_SECTIONS) {
    if (!handoffTemplate.includes(section)) {
      issues.push(`handoff template missing required section: ${section}`);
    }
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

  return issues;
}
