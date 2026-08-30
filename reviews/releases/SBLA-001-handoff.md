# Handoff: SBLA-001 — Repository foundation

## Objective

Establish the reproducible repository baseline and stable command contract required by the authoritative SBLA-001 row in the master product plan. This milestone proves a strict, static Astro foundation from a clean checkout. It does not publish scientific claims, anatomy assets, or production evidence records.

## Inputs and exact paths

- Canonical product and execution plan: `docs/product/master-plan.md`
- Approved product design: `docs/superpowers/specs/2026-08-29-science-based-lifting-atlas-design.md`
- Approved implementation plan: `docs/superpowers/plans/2026-08-29-sbla-001-repository-foundation.md`
- Implementation branch: `codex/SBLA-001-repository-foundation`
- Initial branch base: `399966f`
- Accepted implementation candidate: `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`
- Independent review reports: `reviews/releases/SBLA-001-r1.md`, `reviews/releases/SBLA-001-r2.md`

## Constraints

- The authoritative SBLA-001–SBLA-020 queue in master plan §18 controls scope when earlier prose overlaps.
- SBLA-001 owns the repository baseline, root configuration, command contract, and clean-checkout documentation only.
- SBLA-002 owns repository-local agent instructions, branch/worktree rules, environment-readiness documentation, the current-work ledger, and the reusable handoff template.
- SBLA-003 through SBLA-011 own provider decisions, media licensing, evidence schemas, provenance, and graph/search pipelines.
- No unvalidated scientific or anatomy record may silently pass a foundation-stage validator.
- The original user-supplied master plan remains byte-for-byte outside repository formatting via `.prettierignore`.

## Work completed

- Pinned Node.js `24.20.0`, pnpm `11.24.0`, Astro `7.2.9`, TypeScript `6.0.3`, and all development dependencies to exact versions.
- Added the pnpm workspace, lockfile, strict TypeScript, Astro, ESLint, Prettier, Vitest, and Playwright configuration.
- Implemented every stable command required by master plan §13.7, including `verify`, all four test gates, and `evidence:status`.
- Added a dependency-free repository contract that validates required scripts, their order, the pnpm pin, the complete canonical directory tree, and selected workflow invariants.
- Materialized the canonical project roots from master plan §11.3 without pre-empting later tasks.
- Added stage-aware content, graph, and evidence adapters. Empty repositories pass truthfully; eligible records fail closed until SBLA-007/SBLA-011 implement real schemas.
- Added a minimal no-claim static product shell and a JavaScript-disabled production-preview smoke test.
- Added executable foundation contracts for accessibility, deterministic visual viewports, and the initial performance budgets.
- Added CI, monthly/manual source-status automation, a pull-request template, and clean-checkout documentation.
- Added unit, E2E, accessibility, visual-contract, and performance-contract tests.
- Repaired the Round 1 symlink bypass so every non-directory record entry reaches the fail-closed guard, with filesystem-level regression coverage across all three public adapters.

## Decisions made

- TypeScript `6.0.3` is pinned because the current verified Astro checking and typescript-eslint peer ranges do not accept TypeScript 7.
- pnpm 11 project settings live in `pnpm-workspace.yaml`; the esbuild policy uses pnpm 11's `allowBuilds` setting.
- Playwright serves a production Astro preview. Its command sets `ASTRO_PREVIEW_BACKGROUND=0` because Astro 7.2 enables background preview behavior for detected AI-agent environments, which otherwise lets the web-server command exit before Playwright owns its lifecycle.
- `public/health.txt` is the deterministic 200-status readiness target, so Playwright does not depend on a route's response semantics.
- The page is deliberately a restrained foundation shell. SBLA-012 retains ownership of the full site shell, visual system, routes, and public product experience.
- Foundation accessibility, visual, and performance tests validate executable contracts rather than pretending the later full browser matrices already exist.

## Tests/checks run and results

- `pnpm install --frozen-lockfile`: PASS under the pinned Node.js and pnpm versions.
- `pnpm verify`: PASS.
  - Prettier check: PASS.
  - ESLint: PASS with zero warnings.
  - Astro typecheck: 23 files, zero errors, warnings, or hints.
  - Unit tests: 3 files, 10 tests passed.
  - Content adapter: 0 records, foundation mode PASS.
  - Graph adapter: 0 nodes and 0 edges, foundation mode PASS.
  - Evidence adapter: 0 sources, foundation mode PASS.
  - Static build: 1 page generated.
  - Repository foundation contract: PASS.
- `pnpm test:e2e`: 1 Playwright test passed in Chromium with JavaScript disabled.
- `pnpm test:a11y`: 1 test passed.
- `pnpm test:visual`: 1 test passed.
- `pnpm test:performance`: 1 test passed.
- `pnpm audit --audit-level high`: PASS with no known vulnerabilities reported.
- Clean-archive reproduction of accepted candidate `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`: frozen install and `pnpm verify` PASS, independently repeated by the Round 2 reviewer.
- Round 1 review of `f34acc9984b6fbed2dc5c950b99ee894582f018d`: FAIL with one Important symlink-bypass finding and no Critical findings.
- Round 2 review of repaired candidate `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`: PASS with no Critical or Important findings.

## Known uncertainties

- Accessibility, visual, and performance commands are real foundation-stage gates, but they do not yet execute the complete browser/assistive-technology, screenshot-diff, or measured performance regimes assigned to later tasks.
- Source, content, and graph validators intentionally support only the empty foundation state. Adding a record before the owning schema tasks will fail the command contract.
- The repository has no provider selection, licensed anatomy media, exercise-media policy, evidence corpus, 3D renderer, search index, analytics, or production deployment. Those remain queued work.
- The host's default Node.js is newer than the repository engine. Clean-checkout commands must run through the exact Node.js version declared in `.node-version`/`.nvmrc`.
- GitHub Actions currently use approved major-version tags rather than immutable commit SHAs. The accepted review records this as a non-blocking future supply-chain hardening opportunity.

## Files created or modified

- Root manifests/configuration: `.gitignore`, `.node-version`, `.npmrc`, `.nvmrc`, `.prettierignore`, `.prettierrc.mjs`, `astro.config.mjs`, `eslint.config.mjs`, `package.json`, `playwright.config.ts`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `vitest.config.ts`
- Repository documentation: `README.md`, scoped placeholder documentation under `docs/`, and this handoff
- Automation: `.github/workflows/ci.yml`, `.github/workflows/source-status.yml`, `.github/pull_request_template.md`
- Static shell: `public/health.txt`, `src/env.d.ts`, `src/pages/index.astro`, `src/styles/global.css`
- Foundation validation: `scripts/foundation/**`, `scripts/content/validate.mjs`, `scripts/graph/validate.mjs`, `scripts/evidence/status.mjs`, `src/lib/foundation/gates.ts`, `src/content.config.ts`
- Tests: `tests/unit/**`, `tests/e2e/**`, `tests/accessibility/**`, `tests/visual/**`, `tests/performance/**`
- Canonical tracked roots: `content/**`, `content-drafts/**`, `research/**`, `reviews/**`, `public/anatomy/**`, and the remaining `scripts/**`, `src/**`, and `tests/**` directories named by master plan §11.3

## Required reviewer action

Complete. Round 1 identified one Important fail-closed bypass. The implementation author repaired it with red-green filesystem coverage, and Round 2 independently accepted exact candidate `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`. No Critical or Important findings remain. Preserve both immutable review reports with this handoff.

## Acceptance criteria

- Every SBLA-001 output in master plan §18 exists and is internally consistent.
- Exact runtime/package pins and the frozen lockfile reproduce from a clean Git archive.
- `pnpm verify`, `pnpm test:e2e`, `pnpm test:a11y`, `pnpm test:visual`, `pnpm test:performance`, and `pnpm evidence:status` exit zero in the empty foundation state.
- Foundation validators fail closed when unsupported record files appear.
- The complete canonical directory tree is tracked.
- CI executes frozen installation, `pnpm verify`, and the production-preview E2E smoke test.
- The candidate receives an independent PASS review with no unresolved critical or important findings.
- The final working tree is clean.
