# Handoff: SBLA-006 — Gate A asset and 2D fallback decision

## Objective

Satisfy master plan §18 task SBLA-006: record the owner decision after the
SBLA-005 benchmark, preserve exact selected source/version/license/checksums,
document a 2D fallback and any purchase archive, commit the result, and stop for
one independent Account-B Claude Review.

## Inputs and exact paths

- Repository: `/Users/frankbisignano/dev/science-lifting-atlas`
- Branch: `codex/SBLA-006-asset-decision`
- Worktree:
  `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-006-asset-decision`
- Accepted SBLA-005 dependency base:
  `2e08f4371b1744b1b917dad858355e0b29b1c484`
- SBLA-005 reviewed candidate:
  `26ce8a2bad292f82c05208fcbe4676739bfaefe1`
- SBLA-005 Account-B report: `reviews/releases/SBLA-005-r1.md`, SHA-256
  `64791abd88cf5cccbac2a0170ddd1224816cd66f99f4bddc50e9cdb42d157e90`,
  PASS with 0 Critical and 0 Important findings
- SBLA-006 implementation before handoff: `514f0f8`
- Implementation tree: `9a2d1fae6f6431d911bc65be6f4a3e015b662c44`
- Machine decision: `docs/licenses/anatomy-asset-decision.json`, SHA-256
  `98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27`
- Gate packet: `docs/product/gates/SBLA-006-asset-decision.md`

The immutable review candidate is the commit that adds this handoff and closes
the builder claim. Its exact commit and tree are recorded in the subsequent
Codex-authored review claim before Account B is dispatched.

## Constraints

- SBLA-006 records a decision; it does not create anatomy illustrations,
  scientific claims, production entity schemas, exercise technique, a rig, or
  the interactive anatomy experience.
- Codex must not infer scientific anatomy from the 3D mesh. SBLA-008 through
  SBLA-011 own evidence and reviewed content; SBLA-012 owns the visual system;
  SBLA-013 owns production media; SBLA-015 owns the complete accessible journey.
- The 73/100 SBLA-005 score remains measurement evidence, not proof that
  BodyParts3D is complete or suitable as a sole source.
- Reviewer-authored reports remain immutable. SBLA-005-r1 was not reformatted or
  edited.
- No commercial purchase was authorized or made.

## Work completed

1. Recorded an owner-delegated Gate A approval of a 2D-authoritative hybrid:
   project-authored, evidence-reviewed semantic vector diagrams and equivalent
   text for all 28 required targets, with BodyParts3D only as optional 3D
   enhancement for its 23 mapped targets.
2. Pinned BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction to the exact two
   source archive names, byte counts, and SHA-256 values already reproduced by
   SBLA-005.
3. Rechecked the official DBCLS license page on 2026-09-09 and recorded CC BY
   4.0, the exact attribution, and conservative handling of historical CC BY-SA
   2.1 Japan OBJ notices.
4. Preserved the exact five 3D gaps: latissimus dorsi, rectus abdominis,
   internal oblique, transversus abdominis, and multifidus. They are explicitly
   2D/text-only until another source passes later gates.
5. Recorded `$0` purchase and `$0` recurring asset cost. No purchase archive is
   applicable because there is no commercial delivery.
6. Added a fail-closed validator that cross-checks owner approval, cost, source
   identity, license, artifact checksum, 23/28 coverage, gap IDs, inventory
   state, core no-WebGL guardrails, and three checked-in evidence digests.
7. Added the validator to the canonical `pnpm verify` contract.
8. Corrected two inherited traceability/reproducibility defects: SBLA-005's
   handoff now names its passed review and accepted dependency base, and ESLint
   globally ignores `.worktrees/**` so verification from the main checkout does
   not traverse generated files in sibling worktrees.

## Decisions made

- **YES:** approve the 2D-authoritative hybrid.
- **YES, bounded:** use BodyParts3D for optional progressive enhancement of only
  the 23 mapped targets.
- **NO:** do not use BodyParts3D as the complete or authoritative anatomy source.
- **NO:** do not purchase an unacquired commercial candidate.
- **NO:** do not combine Z-Anatomy while its model/component boundary remains
  below the 4/5 license-clarity floor.
- **NO:** do not use OpenStax assets in this AI-executed workflow under its
  NonCommercial and AI-ingestion restrictions.
- **NO:** do not defer all 3D; the measured 23-target subset is useful when the
  semantic 2D/text experience remains complete without it.

Authority basis: the owner explicitly delegated next-course/project decisions
to Codex and repeatedly authorized continued execution of the plan. The
machine record is the durable owner-decision artifact; the reviewer should flag
this as Important if that delegation does not satisfy the master plan's owner
approval requirement.

## Tests/checks run and results

- Untouched SBLA-006 worktree baseline: `pnpm install --frozen-lockfile && pnpm verify`
  — PASS; 176 unit tests and 17 portability tests passed.
- Preflight from the main checkout: `pnpm verify` — FAIL before the correction;
  ESLint traversed ignored sibling worktrees and reported 96 generated `.astro`
  errors. A red unit test reproduced the missing `.worktrees/**` global ignore;
  after the correction the focused test passed.
- Decision TDD RED: the focused test initially failed because
  `scripts/assets/decision.mjs` did not exist. Subsequent mutation cases failed
  for missing inventory selection and missing canonical verify wiring before
  their implementations were added.
- Focused GREEN: `pnpm vitest run tests/unit/asset-decision.test.ts tests/unit/asset-spike.test.ts tests/unit/foundation-contract.test.ts`
  — PASS; 83 tests.
- `pnpm assets:spike` — PASS; one eligible measured candidate, two ineligible,
  73/100 BodyParts3D measurement preserved.
- `pnpm assets:decision` — PASS; owner-approved bounded hybrid, 23/28 optional
  3D targets, `$0` purchase.
- First full candidate `pnpm verify` — FAIL on three new TypeScript diagnostics:
  two implicit JSDoc types and one config-union narrowing. Commit `514f0f8`
  corrected those type contracts without changing decision data.
- Fresh final `pnpm verify` — PASS; Prettier clean, ESLint clean, Astro 0
  errors/warnings/hints, 14 unit files and 187 tests passed, production build
  passed, 17 portability tests passed, foundation contract passed, scorecard
  passed, and asset-decision contract passed.
- Fresh final `pnpm test:e2e` — PASS; 1/1 Chromium production-build journey.
- `git diff --check` — PASS.

## Known uncertainties

- The authoritative vector assets do not exist yet. This is intentional: the
  evidence, visual, and production gates must precede their creation and record
  their own checksums.
- No physical mid-tier mobile device has verified the 3D performance profile.
- BodyParts3D still lacks five required targets, source material/UV survival,
  a rig, demonstrated skeleton context in the representative artifact, closed
  topology, and inclusive presentation variants.
- Historical/current BodyParts3D license-notice interaction has not received
  legal advice; both notices remain conservatively applied.
- No Git remote is configured, so this reviewed local history is not backed up
  off the machine.
- Independent SBLA-006 review is pending. This handoff is not self-acceptance.

## Files created or modified

- `README.md`
- `docs/licenses/anatomy-asset-decision.json`
- `docs/licenses/anatomy-assets.md`
- `docs/licenses/asset-candidates.json`
- `docs/product/gates/SBLA-006-asset-decision.md`
- `docs/runbooks/current-work.md`
- `docs/superpowers/plans/2026-09-09-sbla-006-asset-decision.md`
- `eslint.config.mjs`
- `package.json`
- `reviews/releases/SBLA-005-handoff.md`
- `reviews/releases/SBLA-006-handoff.md`
- `scripts/assets/decision.mjs`
- `scripts/assets/spike.mjs`
- `scripts/foundation/contract.mjs`
- `tests/unit/asset-decision.test.ts`
- `tests/unit/asset-spike.test.ts`
- `tests/unit/foundation-contract.test.ts`

## Required reviewer action

Account-B Claude Review must inspect the exact candidate without repairing it
and write only `reviews/releases/SBLA-006-r1.md`. Reproduce the candidate/tree,
run `pnpm verify` and `pnpm test:e2e`, recompute decision/evidence hashes, compare
the selected source to SBLA-005 and current primary license terms, verify the
owner-authority record, and try to falsify every guardrail. The report must state
PASS or FAIL and enumerate Critical, Important, and Minor findings.

## Acceptance criteria

SBLA-006 is complete only when all are independently checkable:

1. Exact BodyParts3D source, version, archive byte counts/checksums, license,
   attribution, representative artifact checksum, and evidence digests match.
2. The owner-delegated decision is explicitly approved and durable in Git.
3. BodyParts3D is bounded to 23 optional 3D targets; all 28 targets retain an
   authoritative semantic 2D/text path; the exact five gaps are not diluted.
4. No purchase occurred; cost is `$0`; no purchase archive is falsely implied.
5. Later scientific, design, production-media, accessibility, and physical-
   device gates remain intact.
6. `pnpm verify`, `pnpm test:e2e`, and `git diff --check` pass on the candidate.
7. The latest independent report says PASS with zero unresolved Critical and
   zero unresolved Important findings.
