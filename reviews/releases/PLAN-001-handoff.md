# Handoff: PLAN-001 — Execution quality correction

## Objective

Turn the owner's 2026-09-05 direction correction into an enforceable project
contract: one independent acceptance review by default, a bounded remediation
cycle, capability-based progress reporting, early formative user validation,
and a clean reconciliation requirement for the stale SBLA-004 branch.

## Inputs and exact paths

- Accepted SBLA-003/main base:
  `f674fb70e6f30f2f6bf979766e46c4b6e98483b2`
- Claim commits: `812f8cf` and `05b3731`
- Implementation commit:
  `919caa43aea128b2380972ad1ecb7f1d229b1fa1`
- Branch: `codex/execution-quality-correction`
- Worktree: `.worktrees/sbla-execution-quality-correction`
- Canonical plan: `docs/product/master-plan.md`
- Design:
  `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`
- Decision: `docs/adr/0006-execution-quality-and-validation-gates.md`
- Structured policy: `docs/runbooks/operating-policy.json`

## Constraints

- Preserve every scientific, citation, licensing, accessibility, performance,
  resilience, owner-approval, and release gate.
- Do not edit accepted ADRs 0001–0005.
- Do not represent 3 accepted queue gates as 15% overall product completion.
- Do not integrate the existing stale SBLA-004 branch directly.
- ADR 0006 remains Proposed until independent review passes and acceptance is
  recorded.

## Work completed

- Added a design record explaining the execution problem, selected correction,
  alternatives, failure behavior, and SBLA-004 reconciliation.
- Added proposed ADR 0006 and indexed it without changing accepted architecture
  decisions.
- Added the one-review stop rule and progress protocol to the master plan,
  `AGENTS.md`, and `CLAUDE.md`.
- Added a 3–5 participant formative usability check to SBLA-012 for the
  find/understand/verify/share tasks, before 3D production.
- Added exact `qualityControl` fields to the machine-readable operating policy.
- Extended the foundation validator and unit fixture so policy drift fails
  `pnpm verify`.
- Added a task-level implementation plan whose next action is a fresh SBLA-004
  reconciliation branch from the accepted mainline.

## Decisions made

- Default milestone quality layers are builder self-check, automated gates, and
  one independent acceptance review.
- PASS requires zero unresolved Critical and Important findings. Nonblocking
  Minor findings may be explicit follow-up work.
- FAIL opens one bounded remediation followed by one complete-artifact recheck.
- Extra pre-review requires a named material risk the required reviewer cannot
  reasonably cover.
- Progress reports accepted gates, central-journey proof, current capability,
  blockers, and the next proof. A single overall percentage is prohibited until
  SBLA-017 records observed throughput and owner-approved revised scope.
- SBLA-012 receives formative usability evidence; the later release beta target
  remains unchanged.

## Tests/checks run and results

- Focused RED before implementation: 14 tests ran; 12 passed and 2 failed
  because the validator rejected the new `qualityControl` object and did not yet
  enforce its fields.
- Focused GREEN after implementation: 14/14 operating-model tests passed.
- First full-check wrapper attempt: stopped before project checks because nested
  scripts found host pnpm 11.0.9 instead of required 11.24.0. This was an
  invocation-path issue, not an artifact failure.
- Pinned runtime rerun: Node `v24.20.0`, pnpm `11.24.0`.
- `pnpm verify`: PASS — Prettier, ESLint, Astro 37 files with 0 errors/warnings/
  hints, 48/48 unit tests, content/graph/evidence foundation gates, one-page
  production build, 17/17 portability tests, and foundation contract.
- `pnpm test:e2e`: PASS — 1/1 Chromium JavaScript-disabled foundation journey.
- `git diff --check`: PASS before implementation commit.

## Known uncertainties

- This correction improves execution governance; it does not itself create a
  user-facing journey. The central journey remains 0/1 demonstrated.
- The 3–5 person SBLA-012 check is formative and cannot establish a population
  success rate. The final ≥85% beta gate remains separate.
- SBLA-004's old branch still lacks lawful real sample files and representative
  browser measurements. Its scorecard work must be reconciled, completed, and
  independently reviewed from the accepted base.
- The four nonblocking SBLA-003 Round 2 Minor findings remain explicit hardening
  items and are not silently closed here.

## Files created or modified

- `AGENTS.md`
- `CLAUDE.md`
- `docs/adr/0006-execution-quality-and-validation-gates.md`
- `docs/adr/README.md`
- `docs/product/master-plan.md`
- `docs/runbooks/current-work.md`
- `docs/runbooks/operating-policy.json`
- `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`
- `docs/superpowers/plans/2026-09-05-execution-quality-correction.md`
- `reviews/releases/PLAN-001-handoff.md`
- `scripts/foundation/operating-model.mjs`
- `tests/unit/operating-model-contract.test.ts`

## Required reviewer action

Claude Review account B must independently review the complete final candidate
against this handoff and the canonical plan, writing only the exact pre-claimed
append-only report path. Decide whether the correction:

1. preserves every substantive product/evidence/release gate;
2. states one consistent review lifecycle across all human and structured
   contracts;
3. prevents misleading progress reporting without hiding queue status;
4. adds useful early validation without replacing the later beta gate; and
5. gives an executable, non-destructive SBLA-004 reconciliation direction.

Return PASS only with zero Critical and Important findings. Record nonblocking
Minor findings explicitly. Do not repair the candidate.

## Acceptance criteria

- All five review questions PASS with zero unresolved Critical or Important
  findings.
- Structured policy and prose agree on review count, pass threshold,
  remediation behavior, progress unit, and percentage boundary.
- `pnpm verify` and `pnpm test:e2e` pass under the pinned runtime.
- ADR 0006 remains Proposed until the review report is integrated and owner
  acceptance is recorded.
- The accepted next task begins from main, not the stale SBLA-004 branch.
