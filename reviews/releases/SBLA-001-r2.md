# SBLA-001 Independent Review — Round 2

- Candidate commit: `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`
- Inputs reviewed:
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/product/master-plan.md`
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/superpowers/specs/2026-08-29-science-based-lifting-atlas-design.md`
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/superpowers/plans/2026-08-29-sbla-001-repository-foundation.md`
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/reviews/releases/SBLA-001-r1.md`

## Verification performed

- Confirmed `HEAD` resolves to the exact repair candidate and inspected the complete diff from Round 1 candidate `f34acc9984b6fbed2dc5c950b99ee894582f018d`; the implementation changes are limited to the shared scanner and its regression test, plus the immutable Round 1 report.
- `git diff --check f34acc9984b6fbed2dc5c950b99ee894582f018d 9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`: PASS.
- Ran with Node.js `24.20.0` and pnpm `11.24.0`:
  - `pnpm install --frozen-lockfile`: PASS.
  - `pnpm verify`: PASS; formatting, lint, typecheck, 10 unit/foundation tests, empty-state content/graph/evidence adapters, static build, and repository contract passed.
  - `pnpm test:e2e`: PASS; 1 Chromium test passed with JavaScript disabled.
  - `pnpm test:a11y`: PASS; 1 test passed.
  - `pnpm test:visual`: PASS; 1 test passed.
  - `pnpm test:performance`: PASS; 1 test passed.
  - `pnpm audit --audit-level high`: PASS; no known vulnerabilities reported.
- Exported exact commit `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd` with `git archive` into a fresh temporary directory, then ran `pnpm install --frozen-lockfile && pnpm verify`: PASS.
- Inspected the regression fixture's real symbolic links, child-process execution of the three public adapters, asserted exit status, stderr path evidence, and temporary-directory cleanup.

## Round 1 resolution

### I-1 — Resolved

`scripts/foundation/scan-records.mjs:13-21` now recurses only into real directories and returns every other directory entry as a candidate record path. Git-trackable symbolic links therefore reach the existing `findUnexpectedRecordFiles` guard instead of disappearing from the scan.

`tests/unit/foundation-adapters.test.ts:45-78` creates non-hidden symbolic-link records in `content/claims`, `content/sources`, and `content-drafts/exercises` inside a real temporary filesystem tree. The tests at `tests/unit/foundation-adapters.test.ts:85-105` execute `scripts/content/validate.mjs`, `scripts/graph/validate.mjs`, and `scripts/evidence/status.mjs` as child processes and require exit code `1` plus the offending record path. This directly covers the bypass identified in Round 1 and runs in the authoritative `pnpm verify` pipeline through `package.json:19`.

No scanner regression or new scope drift was found.

## Critical findings

None.

## Important findings

None.

## Minor findings

### M-1 — CI action references remain mutable major-version tags

The Round 1 defense-in-depth note remains unchanged: `.github/workflows/ci.yml:16-20` and `.github/workflows/source-status.yml:16-20` use `actions/checkout@v6` and `pnpm/setup@v2`. These references satisfy the approved SBLA-001 plan's explicit major-version action requirement and do not block this milestone. Pinning reviewed full commit SHAs remains a reasonable later supply-chain hardening improvement.

## Acceptance checklist

- [x] **Exact SBLA-001 scope and §18 outputs:** The repository baseline, root configuration, command contract, clean-checkout documentation, and handoff remain present and correctly scoped.
- [x] **Command-contract fidelity and correctness:** All stable commands remain wired in canonical order and pass in the empty foundation state.
- [x] **Clean-checkout/reproducibility design:** Exact runtime/package pins, frozen lockfile, documented setup, and an independent clean-archive reproduction pass.
- [x] **Security/supply-chain and CI posture:** The fail-closed symlink boundary is repaired and regression-tested; dependencies audit cleanly and CI retains read-only permissions, bounded jobs, frozen installation, and exact runtime/tool versions.
- [x] **Test quality and TDD-relevant coverage:** The repair adds focused filesystem-level coverage at the shared boundary and proves all three public adapters return non-zero with actionable paths.
- [x] **Scope boundaries:** The repair adds no scientific content, production schema, anatomy/media asset, provider decision, application framework, or other later-task output.

## Verdict

**PASS.** Round 1 Important finding I-1 is resolved, all authoritative and clean-archive checks pass, and no Critical or Important findings remain.
