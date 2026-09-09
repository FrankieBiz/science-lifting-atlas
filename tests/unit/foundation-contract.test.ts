import { describe, expect, it } from 'vitest';

import eslintConfig from '../../eslint.config.mjs';

import {
  EXPECTED_PACKAGE_MANAGER,
  REQUIRED_PATHS,
  REQUIRED_SCRIPTS,
  REQUIRED_VERIFY_STEPS,
  REQUIRED_WORKFLOW_SNIPPETS,
  validateFoundation,
} from '../../scripts/foundation/contract.mjs';

function completePackageJson() {
  return {
    packageManager: EXPECTED_PACKAGE_MANAGER,
    scripts: {
      ...Object.fromEntries(REQUIRED_SCRIPTS.map((script) => [script, script])),
      verify: REQUIRED_VERIFY_STEPS.join(' && '),
    },
  };
}

function completeWorkflowFileContents() {
  return new Map(
    Object.entries(REQUIRED_WORKFLOW_SNIPPETS).map(([filePath, snippets]) => [
      filePath,
      snippets.join('\n'),
    ]),
  );
}

describe('repository command contract', () => {
  it('keeps ignored task worktrees outside whole-repository lint traversal', () => {
    const globalIgnores = eslintConfig.flatMap((entry) =>
      'ignores' in entry && Array.isArray(entry.ignores) ? entry.ignores : [],
    );

    expect(globalIgnores).toContain('.worktrees/**');
  });

  it('keeps the approved asset decision in the canonical verification path', () => {
    expect(REQUIRED_VERIFY_STEPS).toContain('pnpm assets:decision');
  });

  it('requires every stable command from master plan section 13.7', () => {
    const issues = validateFoundation({
      packageJson: { scripts: {} },
      existingPaths: new Set<string>(),
      fileContents: new Map<string, string>(),
    });

    expect(REQUIRED_SCRIPTS).toEqual(
      expect.arrayContaining([
        'verify',
        'test:e2e',
        'test:a11y',
        'test:visual',
        'test:performance',
        'evidence:status',
      ]),
    );
    expect(issues).toContain('missing package script: verify');
    expect(issues).toContain('missing package script: test:e2e');
    expect(issues).toContain('missing package script: evidence:status');
  });

  it('rejects a package-manager version other than the repository pin', () => {
    const packageJson = completePackageJson();
    packageJson.packageManager = 'pnpm@latest';

    const issues = validateFoundation({
      packageJson,
      existingPaths: new Set(REQUIRED_PATHS),
      fileContents: new Map<string, string>(),
    });

    expect(issues).toContain(
      `packageManager must be ${EXPECTED_PACKAGE_MANAGER}; received pnpm@latest`,
    );
  });

  it('reports every missing required repository path', () => {
    const issues = validateFoundation({
      packageJson: completePackageJson(),
      existingPaths: new Set<string>(),
      fileContents: new Map<string, string>(),
    });

    expect(issues).toContain('missing required path: docs/adr');
    expect(issues).toContain('missing required path: src/content.config.ts');
    expect(issues).toContain('missing required path: tests/e2e');
  });

  it('rejects a weakened or reordered verify pipeline', () => {
    const packageJson = completePackageJson();
    packageJson.scripts.verify = [
      'pnpm lint',
      'pnpm format:check',
      ...REQUIRED_VERIFY_STEPS.slice(2),
    ].join(' && ');

    const issues = validateFoundation({
      packageJson,
      existingPaths: new Set(REQUIRED_PATHS),
      fileContents: new Map<string, string>(),
    });

    expect(issues).toContain(
      'verify script must contain every required step in the canonical order',
    );
  });

  it('accepts a complete package and path fixture', () => {
    const issues = validateFoundation({
      packageJson: completePackageJson(),
      existingPaths: new Set(REQUIRED_PATHS),
      fileContents: completeWorkflowFileContents(),
    });

    expect(issues).toEqual([]);
  });

  it('rejects workflows that omit pinned reproducibility commands', () => {
    const issues = validateFoundation({
      packageJson: completePackageJson(),
      existingPaths: new Set(REQUIRED_PATHS),
      fileContents: new Map([
        ['.github/workflows/ci.yml', 'name: CI'],
        ['.github/workflows/source-status.yml', 'name: Source status'],
      ]),
    });

    expect(issues).toContain(
      'workflow missing required content: .github/workflows/ci.yml -> pnpm verify',
    );
    expect(issues).toContain(
      'workflow missing required content: .github/workflows/source-status.yml -> pnpm evidence:status',
    );
  });
});
