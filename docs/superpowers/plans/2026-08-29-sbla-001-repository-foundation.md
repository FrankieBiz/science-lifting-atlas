# SBLA-001 Repository Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reproducible, strict Astro/pnpm repository that implements the master plan's command contract and passes from a clean checkout.

**Architecture:** The initial repository is a static Astro shell with no runtime service, database, React island, evidence schema, or anatomy asset. A small dependency-free foundation verifier enforces the repository/command contract; later SBLA tasks extend the same commands instead of renaming them. Tooling is pinned to Node 24.20.0 LTS, pnpm 11.24.0, and exact package versions verified on 2026-08-29.

**Tech Stack:** Node.js 24.20.0 LTS, pnpm 11.24.0, Astro 7.2.9, TypeScript 6.0.3, ESLint 9.39.5, Prettier 3.9.6, Vitest 4.1.11, Playwright 1.62.1, GitHub Actions. TypeScript 6.0.3 is the newest release compatible with the verified `@astrojs/check` and `typescript-eslint` peer ranges; TypeScript 7 is intentionally not selected.

---

## File map

- `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.node-version`, `.nvmrc`: pinned runtime, workspace, and stable command names.
- `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`: strict static Astro configuration.
- `eslint.config.mjs`, `.prettierrc.mjs`, `.prettierignore`: deterministic lint/format configuration.
- `vitest.config.ts`, `playwright.config.ts`: authoritative, non-overlapping unit/gate and browser test configuration; Playwright serves the production preview rather than the development server.
- `src/pages/index.astro`, `src/styles/global.css`: intentionally minimal static product shell proving routing/build behavior without pre-empting SBLA-012 design work.
- `scripts/foundation/contract.mjs`: pure manifest, path, and selected workflow-content inspection and validation.
- `scripts/foundation/verify.mjs`: CLI adapter for the foundation contract.
- `scripts/content/validate.mjs`, `scripts/graph/validate.mjs`, `scripts/evidence/status.mjs`: stage-aware command adapters that verify their repository roots now and provide stable extension points for SBLA-007/SBLA-011.
- `tests/unit/foundation-contract.test.ts`: red-green unit coverage of the command and directory contract.
- `tests/e2e/foundation.spec.ts`: browser smoke coverage of the static shell and no-JavaScript content.
- `tests/accessibility/foundation.test.ts`, `tests/visual/foundation.test.ts`, `tests/performance/foundation.test.ts`: executable foundation-stage gates whose assertions become richer in later tasks.
- `.github/workflows/ci.yml`, `.github/workflows/source-status.yml`, `.github/pull_request_template.md`: reproducible CI and review entry points.
- `README.md`: exact clean-checkout and verification instructions.
- `reviews/releases/SBLA-001-handoff.md`: the builder handoff required by master plan §18.
- `AGENTS.md`, `CLAUDE.md`, `docs/runbooks/current-work.md`, and the reusable handoff/branch/Claude-environment runbooks are explicitly deferred to SBLA-002, whose row in the authoritative §18 queue owns those outputs.
- `content/**`, `content-drafts/**`, `research/**`, `reviews/**`, `public/**`, `scripts/**`, `src/**`, `tests/**`: tracked roots from master plan §11.3, each kept by a scoped README or `.gitkeep`.

### Task 1: Pin the workspace and expose the command contract

**Files:**

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.npmrc`
- Create: `.node-version`
- Create: `.nvmrc`
- Test: `tests/unit/foundation-contract.test.ts`

- [ ] **Step 1: Add the pinned manifest and install test tooling**

Use `packageManager: "pnpm@11.24.0"`, `engines.node: ">=24.20.0 <25"`, `type: "module"`, and private workspace metadata. Add the stable scripts:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "astro check",
  "test": "vitest run tests/unit",
  "test:e2e": "playwright test",
  "test:a11y": "vitest run tests/accessibility",
  "test:visual": "vitest run tests/visual",
  "test:performance": "vitest run tests/performance",
  "validate:content": "node scripts/content/validate.mjs",
  "validate:graph": "node scripts/graph/validate.mjs",
  "evidence:status": "node scripts/evidence/status.mjs",
  "verify:foundation": "node scripts/foundation/verify.mjs",
  "verify": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm validate:content && pnpm validate:graph && pnpm evidence:status && pnpm build && pnpm verify:foundation"
}
```

Install these exact development dependencies and generate `pnpm-lock.yaml`:

```text
@astrojs/check@0.9.10
@playwright/test@1.62.1
@types/node@24.13.3
astro@7.2.9
eslint@9.39.5
eslint-config-prettier@10.1.8
eslint-plugin-astro@1.6.0
eslint-plugin-jsx-a11y@6.10.2
globals@17.11.0
prettier@3.9.6
prettier-plugin-astro@0.14.1
typescript@6.0.3
typescript-eslint@8.68.0
vitest@4.1.11
```

Configuration/generated scaffold files are the explicit TDD exception; no product behavior is implemented in this step.

- [ ] **Step 2: Write the failing command-contract test**

```ts
import { describe, expect, it } from 'vitest';
import { validateFoundation } from '../../scripts/foundation/contract.mjs';

describe('repository command contract', () => {
  it('requires every stable command from master plan section 13.7', () => {
    const issues = validateFoundation({
      packageJson: { scripts: {} },
      existingPaths: new Set<string>(),
    });

    expect(issues).toContain('missing package script: verify');
    expect(issues).toContain('missing package script: test:e2e');
    expect(issues).toContain('missing package script: evidence:status');
  });
});
```

- [ ] **Step 3: Run the focused test and confirm RED**

Run: `pnpm exec vitest run tests/unit/foundation-contract.test.ts`

Expected: FAIL only because `scripts/foundation/contract.mjs` is missing.

### Task 2: Implement the pure foundation contract

**Files:**

- Create: `scripts/foundation/contract.mjs`
- Create: `scripts/foundation/verify.mjs`
- Modify: `tests/unit/foundation-contract.test.ts`

- [ ] **Step 1: Add tests for a valid and invalid manifest**

Test missing scripts, missing required paths, an incorrect package-manager pin, a weakened or reordered `verify` script, and a complete fixture that returns no issues. `verify` must contain these required steps in order: `format:check`, `lint`, `typecheck`, `test`, `validate:content`, `validate:graph`, `evidence:status`, `build`, `verify:foundation`. Keep filesystem access out of `contract.mjs`; inject parsed package metadata, a set of paths, and a map of selected file contents.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `pnpm exec vitest run tests/unit/foundation-contract.test.ts`

Expected: FAIL because `validateFoundation` is not implemented.

- [ ] **Step 3: Implement minimal validation**

```js
export const REQUIRED_SCRIPTS = Object.freeze([
  'verify',
  'test:e2e',
  'test:a11y',
  'test:visual',
  'test:performance',
  'evidence:status',
]);

export function validateFoundation({
  packageJson,
  existingPaths,
  fileContents = new Map(),
}) {
  const issues = [];
  for (const name of REQUIRED_SCRIPTS) {
    if (!packageJson.scripts?.[name])
      issues.push(`missing package script: ${name}`);
  }
  // Validate the exact pnpm pin, ordered verify composition, required tracked
  // roots, and selected workflow invariants.
  return issues;
}
```

The CLI adapter reads the actual repository, reports every issue, and exits non-zero if any exist.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `pnpm exec vitest run tests/unit/foundation-contract.test.ts`

Expected: PASS.

- [ ] **Step 5: Run the CLI against the incomplete repository**

Run: `pnpm verify:foundation`

Expected: non-zero with a complete list of still-missing repository roots.

### Task 3: Scaffold the strict static Astro shell

**Files:**

- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/e2e/foundation.spec.ts`
- Create: `eslint.config.mjs`
- Create: `.prettierrc.mjs`
- Create: `.prettierignore`

- [ ] **Step 1: Configure the E2E runner and install its browser**

Create `playwright.config.ts` with a fixed base URL, one CI worker, a Chromium-only initial project, and a `webServer` command of `pnpm build && pnpm preview --host 127.0.0.1`. Run `pnpm exec playwright install chromium`. This is runner configuration and generated tooling, not product behavior.

- [ ] **Step 2: Add a failing no-JavaScript browser smoke test**

```ts
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('serves a useful static foundation without client JavaScript', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Science-Based Lifting Atlas' }),
  ).toBeVisible();
  await expect(
    page.getByText('Evidence-first resistance training anatomy'),
  ).toBeVisible();
});
```

- [ ] **Step 3: Run E2E and confirm RED**

Run: `pnpm test:e2e`

Expected: FAIL at the heading/content assertion because the product page is absent—not because Playwright, Chromium, or its configuration is missing.

- [ ] **Step 4: Add the minimal generated/configuration files and page**

The page must identify the product, state that the evidence-first vertical slice is under construction, and link to `/methodology` only after that route exists. Do not create visual-system tokens, React, Three.js, or placeholder factual lifting claims in SBLA-001.

Configure Vitest to include only `tests/unit`, `tests/accessibility`, `tests/visual`, and `tests/performance`; Playwright owns `tests/e2e`, so browser tests can never be collected by `pnpm test`. Configure Playwright with one CI worker, a fixed base URL, and a `webServer` that runs `pnpm build && pnpm preview --host 127.0.0.1`, so the E2E test is also the required production-preview smoke test.

- [ ] **Step 5: Run type check, build, and E2E**

Run: `pnpm typecheck && pnpm build && pnpm test:e2e`

Expected: all exit 0, with one Playwright test passing.

### Task 4: Add stage-aware validation commands

**Files:**

- Create: `scripts/content/validate.mjs`
- Create: `scripts/graph/validate.mjs`
- Create: `scripts/evidence/status.mjs`
- Create: `tests/accessibility/foundation.test.ts`
- Create: `tests/visual/foundation.test.ts`
- Create: `tests/performance/foundation.test.ts`

- [ ] **Step 1: Write failing gate tests**

Each suite must assert a real foundation invariant: accessibility fixtures exist and include a document language; visual regression has a deterministic viewport list; performance budgets from master plan §12.2 are represented as data with unique IDs.

- [ ] **Step 2: Run each command and confirm RED**

Run: `pnpm test:a11y; pnpm test:visual; pnpm test:performance`

Expected: each fails for its missing invariant/module.

- [ ] **Step 3: Implement minimal stage-aware checks**

`validate:content` and `validate:graph` must verify their required roots and explicitly report zero eligible records in foundation mode. `evidence:status` must scan the source-record directory, report zero sources when empty, and never imply that status checking for future records has been implemented. Every foundation adapter must fail closed if it sees any non-hidden file in a record-bearing root, because SBLA-001 has no schema capable of validating real records yet. Gate-test data belongs in focused modules rather than duplicated literals.

- [ ] **Step 4: Confirm GREEN**

Run: `pnpm test:a11y && pnpm test:visual && pnpm test:performance && pnpm validate:content && pnpm validate:graph && pnpm evidence:status`

Expected: all exit 0 with explicit foundation-stage messages.

### Task 5: Track the canonical SBLA-001 repository structure

**Files:**

- Create: `.gitignore`
- Create: `README.md`
- Create: tracked roots from master plan §11.3

- [ ] **Step 1: Add every required root**

Create the complete structure from master plan §11.3, not only its top-level directories:

- `docs/adr/`, `docs/licenses/anatomy-assets.md`, `docs/product/`, `docs/runbooks/`, `docs/evidence-methodology.md`, and `docs/editorial-style.md`;
- every listed `content/` and `content-drafts/` entity directory;
- `research/questions/`, `searches/`, `screening/`, `extractions/`, `appraisals/`, `syntheses/`, and `packets/`;
- `reviews/evidence/`, `citations/`, `ux/`, and `releases/`;
- `public/anatomy/{manifests,models,posters,attributions}/`, `public/exercise-media/`, and `public/fonts/`;
- `scripts/blender/`, `content/`, `evidence/`, `release/`, plus the SBLA-001 `foundation/` and `graph/` adapters;
- `src/content.config.ts` plus the complete `src/components/`, `features/{anatomy-explorer,comparison,evidence,search}/`, `layouts/`, `lib/{content,evidence,graph,seo}/`, `pages/`, and `styles/` roots;
- `tests/unit/`, `integration/`, `e2e/`, `accessibility/`, `performance/`, `visual/`, and `fixtures/`.

Preserve empty roots with `.gitkeep` files or a scoped README. Internal methodology/editorial/license files may contain only a truthful “reserved for the owning future task” status and a link to the canonical master-plan section; they must not pretend those later deliverables are complete.

- [ ] **Step 2: Preserve the authoritative SBLA-002 boundary**

Do not create repository-local `AGENTS.md`, `CLAUDE.md`, `docs/runbooks/current-work.md`, reusable handoff templates, branch/worktree rules, path-boundary simulations, or Claude environment-readiness artifacts. Master plan §18 explicitly assigns those outputs to SBLA-002 and calls that table authoritative when the earlier narrative is ambiguous.

Ignore at minimum: `node_modules/`, `dist/`, `.astro/`, `.superpowers/`, coverage output, Playwright reports/results, local caches, `.DS_Store`, all `.env*` except a committed `.env.example`, secrets/credentials, original or evaluation licensed anatomy sources, `research/full-text/`, and any restricted source-transfer bundle. Keep only authorized public derivatives and attribution files eligible for version control.

- [ ] **Step 3: Document clean-checkout setup**

README commands:

```bash
corepack enable
corepack prepare pnpm@11.24.0 --activate
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm verify
pnpm test:e2e
```

- [ ] **Step 4: Re-run the foundation contract**

Run: `pnpm verify:foundation`

Expected: PASS with the pinned package manager, required scripts, and every tracked root present.

### Task 6: Add continuous integration

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/source-status.yml`
- Create: `.github/pull_request_template.md`
- Modify: `scripts/foundation/contract.mjs`
- Modify: `scripts/foundation/verify.mjs`
- Modify: `tests/unit/foundation-contract.test.ts`

- [ ] **Step 1: Add CI workflow validation tests to the contract**

Require CI and source-status workflow paths plus injected content assertions for read-only permissions, frozen-lockfile installation, pnpm 11.24.0, Node 24.20.0, `pnpm verify`, Chromium dependency installation, and the Playwright command. The CLI loads only these known workflow files into `fileContents`; the pure contract module never reads the filesystem itself.

- [ ] **Step 2: Run focused test and confirm RED**

Run: `pnpm exec vitest run tests/unit/foundation-contract.test.ts`

Expected: FAIL because workflows are absent.

- [ ] **Step 3: Implement workflows**

CI uses read-only contents permissions, a bounded timeout, and a pinned major-version action sequence. It checks out the repository, runs `pnpm/setup@v2` with `version: 11.24.0`, `runtime: node@24.20.0`, `cache: true`, and `install: false`, installs with `pnpm install --frozen-lockfile`, runs `pnpm verify`, installs Chromium with `pnpm exec playwright install --with-deps chromium`, and runs `pnpm test:e2e` with the configuration's single CI worker. The scheduled source-status workflow runs manually and monthly but currently reports foundation mode; it must not claim production retraction monitoring.

- [ ] **Step 4: Confirm GREEN**

Run: `pnpm exec vitest run tests/unit/foundation-contract.test.ts && pnpm verify:foundation`

Expected: PASS.

### Task 7: Verify, commit, independently review, and reproduce from a clean archive

**Files:**

- Create: `reviews/releases/SBLA-001-handoff.md`
- Create: `reviews/releases/SBLA-001-r1.md`

- [ ] **Step 1: Run formatting and inspect the diff**

Run: `pnpm format && git diff --check && git status --short`

Expected: no whitespace errors; only SBLA-001 files are changed.

- [ ] **Step 2: Run the authoritative checks**

Run: `pnpm install --frozen-lockfile && pnpm verify && pnpm test:e2e && pnpm test:a11y && pnpm test:visual && pnpm test:performance`

Expected: every command exits 0 with no warnings promoted to failures.

- [ ] **Step 3: Write the initial handoff packet**

Use the exact master-plan headings. Record tool versions, commands, results, known foundation-mode limitations, created/modified paths, and Claude Review's required acceptance action.

- [ ] **Step 4: Commit the implementation candidate**

```bash
git add --all
git commit -m "chore: initialize lifting atlas foundation"
```

- [ ] **Step 5: Test clean-checkout reproducibility from the candidate commit**

Create a temporary directory with `mktemp -d`, export `HEAD` with `git archive`, install using Node 24.20.0 and pnpm 11.24.0, and run `pnpm verify`. Do not use or delete a broad path.

Expected: clean archive install and verification exit 0.

- [ ] **Step 6: Obtain immutable independent code review**

The reviewer writes only `reviews/releases/SBLA-001-r1.md`, matching master plan §13.7's `<task-id>-r<number>.md` convention, cites the exact reviewed commit, and returns pass/fail for master-plan SBLA-001, command fidelity, reproducibility, security, test quality, and scope boundaries. The implementation author does not edit that report.

- [ ] **Step 7: Repair findings and re-review when required**

Fix every critical or important finding using red-green-refactor for behavior changes, run the complete checks, and commit the repair candidate before re-review. The reviewer then audits that exact repair commit and writes `reviews/releases/SBLA-001-r2.md`; review files are never overwritten. Repeat the commit-then-review sequence until the latest report says PASS, then update the handoff with the accepted commit and results.

- [ ] **Step 8: Commit the immutable review record and final handoff**

```bash
git add reviews/releases/SBLA-001-r*.md reviews/releases/SBLA-001-handoff.md
git commit -m "docs: record SBLA-001 review and handoff"
```

- [ ] **Step 9: Run final verification against the reviewed commit**

Re-run the complete working-tree suite and the clean-archive `pnpm verify` from final `HEAD`. The committed handoff records the candidate verification and review; the final post-documentation verification is reported in the task response so recording it does not create an endless documentation/commit cycle. SBLA-001 is accepted only when the latest immutable reviewer report says PASS, the final tree is clean, and both working-tree and clean-archive checks pass.
