# SBLA-006 Asset and Fallback Decision Implementation Plan

> **Queue gate:** SBLA-006 from master plan §18. This plan records the owner-delegated Gate A decision, makes it machine-verifiable, and stops at one independent Account-B Claude Review.

## Objective

Record and commit a reviewable asset decision that names the exact selected source, version, license, checksums, cost, scope, fallbacks, and owner authority. The decision must not overstate SBLA-005's 73/100 recommendation or silently convert its five coverage gaps into an anatomy claim.

## Approved design direction

Use a **2D-authoritative hybrid**:

- Project-authored, evidence-reviewed semantic vector diagrams and equivalent text are the complete baseline for all 28 required targets.
- BodyParts3D 4.0 is selected only as an optional progressive 3D enhancement for the 23 targets that SBLA-005 mapped successfully.
- Latissimus dorsi, rectus abdominis, internal oblique, transversus abdominis, and multifidus remain 2D/text-only until a separately licensed, benchmarked, reviewed source passes a later gate.
- No commercial asset is purchased. Z-Anatomy and OpenStax remain ineligible for the reasons already recorded.
- The 3D layer may never be the sole route to content, navigation, meaning, or accessibility.

This direction controls cost and licensing risk while preserving the useful measured 3D work. It also keeps scientific diagram content behind SBLA-008 through SBLA-011 rather than allowing Codex to invent anatomy.

## Task 1: Close inherited traceability and clean-checkout gaps

**Modify:** `reviews/releases/SBLA-005-handoff.md`, `eslint.config.mjs`, `tests/unit/foundation-contract.test.ts`

1. Add an acceptance addendum to the SBLA-005 handoff naming the passing report, report checksum, integrated acceptance commit, and the exact base inherited by SBLA-006.
2. Add a failing contract test proving ignored task worktrees are excluded from lint traversal.
3. Add `.worktrees/**` to the ESLint global ignore list and prove the focused test passes.
4. Preserve every reviewer-authored report byte-for-byte.

## Task 2: Define the decision contract test-first

**Create:** `tests/unit/asset-decision.test.ts`, `scripts/assets/decision.mjs`, `docs/licenses/anatomy-asset-decision.json`

1. Write failing tests for missing owner approval, mutable/ambiguous source identity, incomplete checksums, unapproved coverage, missing 2D fallback, unauthorized purchase, and a valid complete decision.
2. Implement a pure validator plus a CLI that reads the decision, candidate inventory, mesh map, and feasibility evidence.
3. Require exact BodyParts3D 4.0 archive names and SHA-256 values, CC BY 4.0 terms plus the preserved historical notice, 23/28 mapped coverage, the exact five gaps, `$0` cost, no purchase, and explicit later-task boundaries.
4. Add the decision check to the existing `assets:spike` verification path so `pnpm verify` fails closed without changing stable command names.

## Task 3: Record the one-page Gate A packet and license state

**Create:** `docs/product/gates/SBLA-006-asset-decision.md`

**Modify:** `docs/licenses/anatomy-assets.md`, `docs/licenses/asset-candidates.json`, `README.md`

1. Write the one-page packet with decision, evidence links, risks, cost, recommendation, owner yes/no outcome, and rejected alternatives.
2. Mark BodyParts3D as selected only for bounded progressive enhancement; never as a complete anatomy source.
3. Mark the vector baseline as project-authored and pending evidence-reviewed production in the tasks that own it; do not create scientific illustrations in SBLA-006.
4. Keep physical-device testing, inclusive representation, skeleton context, materials, topology, and rig limitations explicit.

## Task 4: Verify, hand off, and stop for review

**Create:** `reviews/releases/SBLA-006-handoff.md`

**Modify:** `docs/runbooks/current-work.md`

1. Run focused red/green tests, `pnpm verify`, `pnpm test:e2e`, and `git diff --check` on the exact candidate.
2. Record all files, checks, known uncertainties, owner authority, candidate commit/tree, and the single required review path.
3. Close the builder claim in the ledger and commit the immutable handoff.
4. Open an exact Account-B Claude Review claim for `reviews/releases/SBLA-006-r1.md`, dispatch only that review, and stop acceptance until it reports zero unresolved Critical and Important findings.

## Non-goals and later owners

- SBLA-007 owns production entity/evidence schemas.
- SBLA-008–010 own scientific questions, research, synthesis, and claim review.
- SBLA-011 owns approved content integration.
- SBLA-012 owns the visual system and formative usability work.
- SBLA-013 owns production media generation and final performance gates.
- SBLA-015 owns the complete accessible interactive anatomy experience and physical-device/fallback acceptance.

## Pass condition

The repository contains a deterministic decision record that an independent reviewer can validate without chat context; the Gate A packet says yes to the bounded hybrid and no to purchase/sole-source 3D; all required checks pass; and the latest Account-B report eventually says PASS with zero unresolved Critical or Important findings.
