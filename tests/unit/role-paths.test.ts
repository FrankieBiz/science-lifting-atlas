import { describe, expect, it } from 'vitest';

import {
  ROLE_WRITE_BOUNDARIES,
  validateRolePaths,
} from '../../scripts/foundation/role-paths.mjs';

describe('role write boundaries', () => {
  it('defines the four roles from master plan section 13.7', () => {
    expect(Object.keys(ROLE_WRITE_BOUNDARIES)).toEqual(
      expect.arrayContaining([
        'codex',
        'claude-builder',
        'claude-research',
        'claude-review',
      ]),
    );
  });

  it('rejects an unknown role instead of allowing it through', () => {
    const issues = validateRolePaths({
      role: 'claude-everything',
      changedPaths: ['reviews/evidence/note.md'],
    });

    expect(issues).toContain('unknown role: claude-everything');
  });

  it('lets Codex write anywhere in the repository', () => {
    const issues = validateRolePaths({
      role: 'codex',
      changedPaths: ['src/pages/index.astro', 'content/muscles/pectoralis.md'],
    });

    expect(issues).toEqual([]);
  });

  it('denies ambient Claude Builder writes until the CLI applies an exact claim', () => {
    const issues = validateRolePaths({
      role: 'claude-builder',
      changedPaths: ['src/pages/index.astro'],
    });

    expect(issues).toContain(
      'role claude-builder may not write: src/pages/index.astro',
    );
  });

  it('confines Claude Research to research and draft paths', () => {
    const issues = validateRolePaths({
      role: 'claude-research',
      changedPaths: [
        'research/questions/q1.md',
        'content-drafts/muscles/pectoralis.md',
      ],
    });

    expect(issues).toEqual([]);
  });

  it('stops Claude Research from editing code, published content, or reviews', () => {
    const issues = validateRolePaths({
      role: 'claude-research',
      changedPaths: [
        'src/lib/foundation/gates.ts',
        'content/muscles/pectoralis.md',
        'reviews/evidence/SBLA-009-r1.md',
      ],
    });

    expect(issues).toContain(
      'role claude-research may not write: src/lib/foundation/gates.ts',
    );
    expect(issues).toContain(
      'role claude-research may not write: content/muscles/pectoralis.md',
    );
    expect(issues).toContain(
      'role claude-research may not write: reviews/evidence/SBLA-009-r1.md',
    );
  });

  it('confines Claude Review to reviews and stops it repairing the artifact', () => {
    expect(
      validateRolePaths({
        role: 'claude-review',
        changedPaths: ['reviews/citations/SBLA-010-r1.md'],
      }),
    ).toEqual([]);

    expect(
      validateRolePaths({
        role: 'claude-review',
        changedPaths: ['content-drafts/muscles/pectoralis.md'],
      }),
    ).toContain(
      'role claude-review may not write: content-drafts/muscles/pectoralis.md',
    );
  });

  it('does not let a prefix lookalike directory escape the boundary', () => {
    const issues = validateRolePaths({
      role: 'claude-review',
      changedPaths: ['reviews-draft/sneaky.md'],
    });

    expect(issues).toContain(
      'role claude-review may not write: reviews-draft/sneaky.md',
    );
  });

  it('normalizes a leading ./ before checking the boundary', () => {
    const issues = validateRolePaths({
      role: 'claude-review',
      changedPaths: ['./reviews/ux/SBLA-015-r1.md'],
    });

    expect(issues).toEqual([]);
  });

  it('canonicalizes traversal before applying a role boundary', () => {
    expect(
      validateRolePaths({
        role: 'claude-review',
        changedPaths: ['reviews/../src/pages/index.astro'],
      }),
    ).toContain('role claude-review may not write: src/pages/index.astro');

    expect(
      validateRolePaths({
        role: 'claude-research',
        changedPaths: ['content-drafts/../AGENTS.md'],
      }),
    ).toContain('role claude-research may not write: AGENTS.md');
  });

  it('rejects absolute and repository-escaping paths', () => {
    expect(
      validateRolePaths({
        role: 'claude-review',
        changedPaths: ['/tmp/reviews/report.md', '../reviews/report.md'],
      }),
    ).toEqual([
      'invalid repository-relative path: /tmp/reviews/report.md',
      'invalid repository-relative path: ../reviews/report.md',
    ]);
  });
});
