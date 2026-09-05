# Handoff: PLAN-001 Round 1 remediation

## Objective

Close Account-B finding I-1 by making the claimed policy-drift protection real,
and resolve the eight related Minor clarity findings without changing the
substantive execution-quality decision.

## Inputs and exact paths

- Failed candidate:
  `86627faaa5e53fe1f2c741eb0aa3966a3a97c8c9`
- Account-B report role commit:
  `d19e744972b5eee19aa08875879dc120deb41a1a`
- Account-B report integration:
  `902a97ce20807bec31e147a61e197377b8d48cb6`
- Remediation claim commits: `91f34c8` and `238d305`
- Remediation implementation:
  `cc5b38c7c389f039a09e0e9d591bb34f5cd46b29`
- Immutable report: `reviews/releases/PLAN-001-r1.md`
- Report identity: 539 lines, 35,191 bytes, SHA-256
  `2171e965ded4b9021be5ef2031d4ca6cf788eb22bbf1c99d4c54ba48e1fc06aa`
- Branch/worktree: `codex/execution-quality-correction` /
  `.worktrees/sbla-execution-quality-correction`

## Constraints

- Preserve the failed review report byte-for-byte and keep ADR 0006 Proposed.
- Repair only the bounded I-1 enforcement defect and directly related Minor
  ambiguities.
- Do not create another review layer. The next review is the single complete-
  artifact recheck required by the stop rule.
- Do not begin SBLA-004 implementation before PLAN-001 acceptance.

## Work completed

### I-1 — closed

- Added the canonical master plan and ADR 0006 to the required operating paths.
- Added load-bearing sentinels for review count, zero-Critical/Important pass
  threshold, conditional Minor deferral, bounded remediation, progress basis,
  and the SBLA-017 plus owner-approval boundary.
- Added a mutation test that weakens the pass threshold independently in
  `AGENTS.md`, `CLAUDE.md`, the master plan, and ADR 0006 and requires every
  mutation to fail validation.
- Strengthened the structured percentage token to
  `SBLA-017-observed-throughput-and-owner-approved-estimate`.
- Narrowed the design's enforcement statement to literal load-bearing sentinels;
  semantic context still requires independent review.

### Minor findings — closed as low-cost related hardening

- M-1/M-2: scoped `CLAUDE.md` to milestone acceptance, added the named-risk
  pre-review rule, and preserved claim-level/random/high-impact release audits.
- M-3: required a recorded impact and follow-up destination before a
  nonblocking Minor may be deferred in every enforceable prose contract.
- M-4: added owner approval to the structured SBLA-017 percentage boundary.
- M-5: added a recruitment-failure path—SBLA-012 blocks and returns to the owner;
  a smaller convenience sample cannot silently satisfy the gate.
- M-6: recorded the stale SBLA-004 branch, worktree, tip, fork point, and handoff
  locator in the design/plan and recovery log; all old work remains preserved.
- M-7: changed canonical labels to `owner-approved direction` and recorded the
  owner's exact instructions in the design.
- M-8: removed the two Markdown hard-break spaces from the design record.

The immutable Account-B report is not Prettier-formatted. Rather than modify an
append-only external artifact, `.prettierignore` exempts exactly
`reviews/releases/PLAN-001-r1.md`, with its checksum recorded above. No other
review report or directory is exempted.

## Decisions made

- Implemented the stronger repair option: validate all canonical contracts,
  rather than weakening the design's claim.
- Kept I-1 Important and the Round 1 verdict FAIL, as the reviewer recommended.
- Closed all eight Minor findings because their changes were bounded to the same
  contracts and materially reduce future ambiguity.
- Kept the formative participant count a real gate; recruitment failure blocks
  for owner decision rather than automatically weakening the sample.

## Tests/checks run and results

- Focused RED after adding the remediation test/fixture: 15 tests, 11 passed and
  4 failed because the canonical paths, structured owner-approval boundary, and
  prose-threshold enforcement did not yet exist.
- Focused GREEN: 15/15 operating-model tests passed.
- Direct `node scripts/foundation/verify.mjs`: PASS against the real repository
  documents.
- Pinned runtime: Node `v24.20.0`, pnpm `11.24.0`.
- `pnpm verify`: PASS — formatting, lint, Astro check (37 files, zero issues),
  49/49 unit tests, content/graph/evidence foundation gates, production build,
  17/17 portability tests, and foundation contract.
- `pnpm test:e2e`: PASS — 1/1 Chromium JavaScript-disabled journey.
- `git diff --check`: PASS before the remediation implementation commit.

## Known uncertainties

- Literal sentinels detect removal and direct contradiction of load-bearing
  language; they cannot prove that surrounding prose preserves meaning. The
  independent reviewer must still inspect the complete artifact.
- The SBLA-012 participant pool will require owner coordination later. The
  blocked path is now explicit, not automatically waived.
- PLAN-001 still creates no user-facing product capability. The central journey
  remains 0/1 demonstrated until later queue work.

## Files created or modified

- `.prettierignore`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/adr/0006-execution-quality-and-validation-gates.md`
- `docs/product/master-plan.md`
- `docs/runbooks/current-work.md`
- `docs/runbooks/operating-policy.json`
- `docs/superpowers/plans/2026-09-05-execution-quality-correction.md`
- `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`
- `reviews/releases/PLAN-001-remediation-handoff.md`
- `scripts/foundation/operating-model.mjs`
- `tests/unit/operating-model-contract.test.ts`

The remediation did not modify `reviews/releases/PLAN-001-r1.md`.

## Required reviewer action

Claude Review account B must perform one complete-artifact recheck from the
final remediation candidate. Re-run I-1's drift probes across all four prose
contracts and the structured policy, verify M-1 through M-8 are actually closed,
confirm no substantive gate was weakened, and review the exact single-file
Prettier exemption. Write only the separately pre-claimed append-only Round 2
report. Do not repair the candidate.

## Acceptance criteria

- I-1 is closed by executed drift probes, not prose assertion alone.
- No Critical or Important finding remains.
- All five original reviewer questions still PASS.
- The pinned `pnpm verify` and `pnpm test:e2e` evidence is internally consistent.
- ADR 0006 remains Proposed until this recheck passes and owner acceptance is
  recorded.
