# SBLA-001 Independent Review — Round 1

- Candidate commit: `f34acc9984b6fbed2dc5c950b99ee894582f018d`
- Inputs reviewed:
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/product/master-plan.md`
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/superpowers/specs/2026-08-29-science-based-lifting-atlas-design.md`
  - `/Users/frankbisignano/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas/.worktrees/sbla-001-repository-foundation/docs/superpowers/plans/2026-08-29-sbla-001-repository-foundation.md`

## Verification performed

- Confirmed `HEAD` and the reviewed tree resolve to the exact candidate SHA; `git diff --check` passed and the implementation worktree was clean before this report was created.
- Ran with Node.js `24.20.0` and pnpm `11.24.0`:
  - `pnpm install --frozen-lockfile`: PASS.
  - `pnpm verify`: PASS; formatting, lint, typecheck, 7 unit tests, empty-state content/graph/evidence adapters, static build, and foundation contract all passed.
  - `pnpm test:e2e`: PASS; 1 Chromium test passed with JavaScript disabled.
  - `pnpm test:a11y`: PASS; 1 test passed.
  - `pnpm test:visual`: PASS; 1 test passed.
  - `pnpm test:performance`: PASS; 1 test passed.
  - `pnpm audit --audit-level high`: PASS; no known vulnerabilities reported.
- Exported the exact candidate with `git archive` into a fresh temporary directory, then ran `pnpm install --frozen-lockfile && pnpm verify`: PASS.
- Inspected the pinned manifest and lockfile, pnpm workspace policies, strict static Astro configuration, test-runner separation, GitHub Actions permissions/setup, tracked canonical roots, foundation adapters, and later-task deferrals.

## Critical findings

None.

## Important findings

### I-1 — Git-trackable symlinks bypass the promised fail-closed record guard

`scripts/foundation/scan-records.mjs:13-22` recurses into directories and records regular files, but silently ignores every other directory-entry type. A symbolic link committed beneath `content/`, `content-drafts/`, or `content/sources/` is therefore omitted from the returned paths. All three public adapters trust that incomplete result (`scripts/content/validate.mjs:9-16`, `scripts/graph/validate.mjs:8-12`, and `scripts/evidence/status.mjs:8-12`), so a non-hidden symlink such as `content/sources/source.yml` can exist while the relevant command reports zero records and exits successfully.

This violates the approved implementation requirement that every foundation adapter fail closed on **any non-hidden file** in a record-bearing root (`docs/superpowers/plans/2026-08-29-sbla-001-repository-foundation.md:255-257`) and contradicts the handoff acceptance claim at `reviews/releases/SBLA-001-handoff.md:92-94`. The current test covers only pre-supplied path strings (`tests/unit/foundation-mode.test.ts:5-18`) and cannot catch filesystem entry-type omissions.

**Recommendation:** treat every non-directory entry as a candidate path, or explicitly reject symbolic links and unsupported entry types. Add filesystem-level regression coverage proving that a non-hidden symlink makes `validate:content`, `validate:graph`, and `evidence:status` fail non-zero; retain the current `.gitkeep` and `README.md` exceptions. Re-run the full suite and clean-archive verification, commit the repair candidate, and obtain Round 2 review against that exact SHA.

## Minor findings

### M-1 — CI actions use mutable major-version tags

`.github/workflows/ci.yml:16-20` and `.github/workflows/source-status.yml:16-20` reference `actions/checkout@v6` and `pnpm/setup@v2`. This satisfies the approved SBLA-001 plan's major-version pinning requirement, and the workflows otherwise use read-only permissions, exact runtime/package versions, frozen installation, and bounded timeouts. As defense in depth, a later hardening change should pin third-party actions to reviewed full commit SHAs and teach the repository contract to require those immutable references.

## Acceptance checklist

- [x] **Exact SBLA-001 scope and §18 outputs:** Repository baseline, root configuration, stable command names, clean-checkout documentation, and handoff are present; SBLA-002 and later outputs are explicitly deferred.
- [x] **Command-contract fidelity and correctness:** All six stable public commands exist; `pnpm verify` composes the required checks in canonical order; the normal empty foundation path passes.
- [x] **Clean-checkout/reproducibility design:** Exact runtime and package-manager pins, frozen lockfile, documented setup, and a fresh `git archive` reproduction passed.
- [ ] **Security/supply-chain and CI posture:** Dependency and workflow posture is suitable for the foundation, but the symlink blind spot breaks the intended fail-closed security boundary for unsupported records.
- [ ] **Test quality and TDD-relevant coverage:** Core contracts and smoke behavior are meaningfully covered, but filesystem-level coverage is missing for the record scanner and allowed the Important bypass above.
- [x] **Scope boundaries:** No production schema, evidence claim, licensed anatomy asset, provider decision, React/Three.js island, full visual system, or other later-task deliverable is falsely claimed complete.

## Verdict

**FAIL.** One Important finding remains unresolved. The candidate is reproducible and otherwise well-scoped, but it cannot be accepted until non-hidden symbolic-link entries fail closed and the repair commit passes a new immutable review round.
