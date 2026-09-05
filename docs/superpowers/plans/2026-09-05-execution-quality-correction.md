# Execution Quality Correction Implementation Plan

> **Execution mode:** Follow this plan in the isolated
> `codex/execution-quality-correction` worktree. Do not begin SBLA-004 edits in
> this branch.

**Goal:** Make the approved review stop rule, progress protocol, early usability
gate, and SBLA-004 reconciliation direction part of the enforceable repository
contract.

**Architecture:** Add one proposed ADR and one approved-direction design record,
then synchronize the canonical master plan, agent instructions, Claude
instructions, and machine-readable operating policy. Extend the existing
operating-model validator test-first so `pnpm verify` rejects policy drift.

**Tech stack:** Markdown, JSON, Node.js 24.20.0, pnpm 11.24.0, Vitest.

---

### Task 1: Claim the bounded correction

**Files:**

- Modify: `docs/runbooks/current-work.md`

- [ ] Record the branch, worktree, accepted SBLA-003 base commit, handoff, and
      every path this correction owns.
- [ ] Commit the claim before editing owned artifacts.

Verification: `git show --stat --oneline HEAD` lists only the ledger.

### Task 2: Write the approved-direction design and decision record

**Files:**

- Create: `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`
- Create: `docs/adr/0006-execution-quality-and-validation-gates.md`
- Modify: `docs/adr/README.md`

- [ ] Document the problem, goals, non-goals, selected approach, alternatives,
      failure handling, verification, and owner approval basis.
- [ ] Keep ADR 0006 `Proposed` until the independent review passes and the
      acceptance commit records the owner's already-given direction approval.
- [ ] Do not edit accepted ADRs 0001–0005.

Verification: `pnpm exec prettier --check` on the three paths exits 0.

### Task 3: Extend the operating contract test-first

**Files:**

- Modify: `tests/unit/operating-model-contract.test.ts`
- Modify: `scripts/foundation/operating-model.mjs`
- Modify: `docs/runbooks/operating-policy.json`

- [ ] Add a fixture and test for the one-review threshold, remediation rule,
      risk-triggered extra review, progress unit, and SBLA-017 percentage boundary.
- [ ] Run the focused test before implementation and preserve the expected RED
      result in the handoff.
- [ ] Add exact structured fields and keys to the validator and policy.
- [ ] Run the focused test again and require GREEN.

Verification:

```bash
npx --yes --package=node@24.20.0 --call \
  'corepack pnpm exec vitest run tests/unit/operating-model-contract.test.ts'
```

Expected: 14 tests pass.

### Task 4: Synchronize human-readable policy

**Files:**

- Modify: `docs/product/master-plan.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`

- [ ] Add the one-review stop rule and capability-based progress protocol.
- [ ] Add the 3–5 participant formative test to SBLA-012 without weakening the
      later release beta target.
- [ ] State that extra review requires a named material risk and that PASS ends
      the cycle when no Critical or Important finding remains.

Verification: the focused operating-model test and `pnpm verify` both exit 0.

### Task 5: Produce the independent-review candidate

**Files:**

- Create: `reviews/releases/PLAN-001-handoff.md`
- Modify: `docs/runbooks/current-work.md`

- [ ] Record RED/GREEN evidence, exact file inventory, decision boundaries, and
      the next SBLA-004 reconciliation action.
- [ ] Close the builder claim when the immutable handoff is committed.
- [ ] Run pinned `pnpm verify` and `pnpm test:e2e` from a clean tracked tree.
- [ ] Commit the candidate and open one exact Account-B review report claim.

Expected: zero Critical/Important findings are required for acceptance.

### Task 6: Accept and begin SBLA-004 reconciliation

**Files:** determined by the review result and the existing SBLA-004 handoff.

- [ ] If FAIL, open one bounded remediation and request one complete-artifact
      recheck. If PASS, do not add another review layer.
- [ ] Record owner acceptance, change ADR 0006 to `Accepted`, close the review
      claim, and fast-forward `main` only after all required checks pass.
- [ ] Create a new SBLA-004 branch from the accepted main commit; treat the stale
      SBLA-004 commits as inputs, not as a merge candidate.
- [ ] Port only bounded inventory/spike work, then add lawful real samples and
      repeatable browser measurements before SBLA-004 review.
