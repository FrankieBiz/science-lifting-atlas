# SBLA-002 Independent Review — Round 1

## Reviewer identity/capability limitation

This review was performed by a Codex reviewer. I am not either of the separate
Anthropic Claude Team accounts required for the Claude Research and Claude
Review readiness simulations. This report is an independent acceptance review
of the candidate, but neither my identity nor this review can be counted as one
of those two account-readiness simulations or as an end-to-end chat-only
fallback demonstration.

## Candidate and base commits

- Candidate commit: `af1b920afef8614c5cfc58bb1ddedfbab9933bc3`
- Base commit: `141b63913b75791a6630303fdd1936fc615b3471`
- Exact range reviewed:
  `141b63913b75791a6630303fdd1936fc615b3471..af1b920afef8614c5cfc58bb1ddedfbab9933bc3`
- The worktree resolved to the candidate commit and had no tracked or untracked
  changes before verification. No later working-tree implementation changes
  were reviewed.

## Inputs reviewed

- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/product/master-plan.md`
  (especially §§13.2–13.9 and authoritative §18)
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-001-handoff.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-001-r2.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-002-handoff.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/AGENTS.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/CLAUDE.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/current-work.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/branch-and-worktree.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/handoff-template.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/claude-environments.md`
- The complete 15-path candidate diff, including the three new foundation
  scripts, the `verify.mjs` integration, both new unit-test files, and the README
  routing changes.

## Verification performed

- Confirmed the exact candidate/base SHAs and inspected the complete diff and
  commit history. `git diff --check <base> <candidate>` passed.
- Confirmed all six §18 artifacts are regular `100644` blobs in the candidate,
  not merely local working-tree files.
- Counted the reusable handoff template's copied section: all ten §13.6 `##`
  headings are present once and in the authoritative order.
- Used the required PATH-prefixed Node.js `v24.20.0` and pnpm `11.24.0`. The host
  default Node.js `v26.0.0` was rejected by the repository engine gate before
  tests ran; all results below are from the pinned runtime.
- `pnpm verify`: PASS. Prettier and ESLint passed; `astro check` reported 28
  files with 0 errors, warnings, or hints; 5 unit-test files and 24 tests passed;
  all three foundation adapters passed in their empty state; the one-page static
  build completed; and `verify:foundation` passed.
- `pnpm test:a11y`: PASS (1 test). `pnpm test:visual`: PASS (1 test).
  `pnpm test:performance`: PASS (1 test).
- Port 4321 was occupied by a pre-existing Astro preview and was not terminated
  or reused. Ran the exact `tests/e2e/foundation.spec.ts` test through Playwright
  with an equivalent stdin-supplied config on unoccupied port 4322: PASS (1
  Chromium test, JavaScript disabled).
- `pnpm audit --audit-level high`: PASS; no known vulnerabilities reported.
- Confirmed the accepted SBLA-001 command order, `package.json`,
  `contract.mjs`, and accepted SBLA-001 unit/adapter tests are unchanged in this
  range. The refactor in `verify.mjs` preserves the old collector behavior and
  adds the operating-model validator.
- Exercised the role CLI. A direct forbidden path correctly exited 1, but
  `claude-review reviews/../src/pages/index.astro` and
  `claude-research research/../src/pages/index.astro` both incorrectly exited 0.
- Exercised `validateOperatingModel` in memory with all required literal phrases
  retained while reversing the ten headings and adding a rule that grants
  Claude Review merge/lock-clear authority. It returned `[]` (pass).
- Checked repository integration state: `git fsck --full --no-dangling` passed;
  `main` is at `141b63913b75791a6630303fdd1936fc615b3471`; the reflog records a
  fast-forward from `399966fc1ccb0dbcdd8d4d3620e19b3d401e70bb`; both SBLA-001 and
  SBLA-002 worktrees are registered at their relocated paths; the SBLA-001
  branch is preserved; and the old `.git` backup still exists at the recorded
  location.

## Critical findings

None.

## Important findings

### I-1 — The mandatory §18 Claude-role pass condition has not been performed

Master plan `docs/product/master-plan.md:1742-1749` makes the §18 row the
authoritative queue and requires both Claude roles to complete the
path/source/handoff simulation or the chat-only fallback for SBLA-002. The
candidate truthfully records both roles as `OUTSTANDING` and the gate as `NOT
COMPLETE` at `docs/runbooks/claude-environments.md:8-23`; its owner-action list
still requires both six-step runs or an end-to-end fallback at
`docs/runbooks/claude-environments.md:110-120`. The handoff also admits that the
§18 pass condition is not met at `reviews/releases/SBLA-002-handoff.md:138-147`.

Deferring the readiness gate to SBLA-008 follows the earlier narrative in
§13.9, but it cannot override the explicit current-task pass condition in
authoritative §18. This Codex review cannot substitute for either separate
Claude account.

**Recommendation:** run and record the dated six-step simulation for both the
Claude Research and Claude Review accounts, or demonstrate the documented
chat-only bundle round trip end to end, including returned-file checksums,
untrusted-input validation, permitted-path placement, and handoffs. Re-review
the resulting exact commit before accepting SBLA-002.

### I-2 — The role-path boundary check allows `..` traversal and does not independently enumerate changes

`scripts/foundation/role-paths.mjs:14-17` removes only leading `./`, and
`scripts/foundation/role-paths.mjs:38-45` then trusts a raw `startsWith` check.
Consequently, both `reviews/../src/pages/index.astro` for Claude Review and
`research/../src/pages/index.astro` for Claude Research pass with exit 0 even
though they resolve to a prohibited application-code path. The documented claim
that out-of-boundary writes exit non-zero at
`docs/runbooks/claude-environments.md:41-49` is therefore false for accepted
filesystem path syntax.

The CLI also validates only the path arguments supplied by its caller
(`scripts/foundation/check-role-paths.mjs:3-14`); the runbook does not derive a
complete changed-path set from the reviewed base. A caller can omit a prohibited
change. Existing tests cover a prefix-lookalike directory and leading `./`, but
not traversal or complete diff enumeration (`tests/unit/role-paths.test.ts:84-102`).

**Recommendation:** canonicalize and validate repository-relative POSIX paths
before applying boundaries; reject absolute paths, remaining `..` segments,
invalid separators, and paths that escape the repository. Add CLI-level negative
tests for traversal. For a readiness gate, derive the complete path list inside
the checker from a trusted `git diff --name-only -z <reviewed-base>...HEAD` (or
equivalent) instead of trusting a role-supplied subset.

### I-3 — The operating-model contract does not fail closed against the policy changes it claims to guard

The validator treats the ten headings and every load-bearing policy as unordered
literal substrings (`scripts/foundation/operating-model.mjs:29-69` and
`scripts/foundation/operating-model.mjs:90-105`). It therefore passes reordered
headings even though the template says order is checked and must not change
(`docs/runbooks/handoff-template.md:3-5`), and it passes a document that retains
the sentence “Codex is the only merge authority” while immediately granting the
same authority to Claude Review. My in-memory mutant containing both changes
returned no issues. The tests exercise missing text, but not contradictory text,
heading order/uniqueness, or semantic weakening
(`tests/unit/operating-model-contract.test.ts:56-109`).

The filesystem collector also uses `access` and `readFile`, which follow
symbolic links rather than establishing that required policy artifacts are
regular repository files (`scripts/foundation/verify.mjs:28-37` and
`scripts/foundation/verify.mjs:45-55`). That repeats the class of local-vs-clean
checkout ambiguity repaired during SBLA-001.

**Recommendation:** parse actual Markdown headings and enforce their exact
sequence and uniqueness; validate structured policy invariants rather than
presence-only phrases; reject contradictory authority clauses; and use `lstat`
plus repository-tree checks to reject required-document symlinks or non-files.
Add negative regression tests for each bypass and an integration test proving
`verify:foundation` rejects them.

### I-4 — The ownership-lock lifecycle contradicts itself and can leave a post-handoff claim permanently active

The ledger says a claim closes when the handoff lands
(`docs/runbooks/current-work.md:3-5`), and the finishing runbook requires the
ledger entry to be closed before stopping at review
(`docs/runbooks/branch-and-worktree.md:47-53`). The actual SBLA-002 entry instead
stays active after its handoff until review and repairs finish
(`docs/runbooks/current-work.md:23-27`), matching the handoff's explicit decision
at `reviews/releases/SBLA-002-handoff.md:98-99`.

Because the stale rule requires both no handoff and no active session
(`docs/runbooks/current-work.md:9-14`), this already-handed-off active claim
cannot become stale under the documented rule if its author disappears. That
undermines the otherwise correct 24-hour recovery and Codex-only merge controls.

**Recommendation:** choose and document one lifecycle. The safer model is to
close the builder claim when its immutable handoff lands, claim the exact review
file separately for the reviewer, and open a new bounded remediation claim if a
review fails. If a distinct `REVIEW_PENDING` state is preferred, make it
non-owning and give it an explicit abandonment/recovery rule. Add a ledger
contract test for the chosen transition.

## Minor findings

### M-1 — The SBLA-001 implementation candidate and acceptance-record commit are conflated

The approved SBLA-001 handoff identifies
`9ac14081f13f191eaf6feaa67fb98d2f18e14bbd` as the accepted implementation
candidate (`reviews/releases/SBLA-001-handoff.md:12-15` and
`reviews/releases/SBLA-001-handoff.md:67-69`). SBLA-002 instead calls
`141b63913b75791a6630303fdd1936fc615b3471` the accepted dependency/base
(`reviews/releases/SBLA-002-handoff.md:14-17`), and the ledger calls SBLA-001
“Accepted at `141b639`” (`docs/runbooks/current-work.md:31-33`). Git history shows
that `141b639` is the later documentation commit that added the Round 2 report
and finalized the handoff; it did not change the accepted implementation.

This does not make the relocation or fast-forward record false, but it blurs two
different immutable states and weakens the “reviewed base named by the approved
handoff” rule.

**Recommendation:** consistently label `9ac1408…` as the reviewed implementation
candidate and `141b639…` as the acceptance-record/integration base, and explicitly
state why downstream tasks start from the latter.

### M-2 — `CLAUDE.md` drops one named Claude Review responsibility

The Claude Review ownership summary at `CLAUDE.md:49-52` includes content
consistency but omits the master plan's “plagiarism-style checks” responsibility
from `docs/product/master-plan.md:1254-1262`. The required instruction to read
the master plan limits the practical impact, and no contradictory authority was
found in the candidate prose.

**Recommendation:** add plagiarism-style checks to the Claude Review ownership
list so the repository-local role summary is complete.

## Acceptance checklist

- [x] **1. Six required artifacts and no-chat usability:** All six artifacts are
      present as regular candidate blobs, link to one another, and provide enough
      repository context to begin work. This structural pass does not satisfy the
      unperformed readiness result in area 5.
- [x] **2. Role boundaries and authority:** The principal §13.2–13.4 role split,
      Claude write directories, separate accounts/sessions, review independence,
      Codex-only content promotion, and scientific guardrails are encoded without a
      blocking prose-level authority drift. M-2 is a completeness correction.
- [x] **3. Handoff format:** The copied template has all ten §13.6 headings once
      and in order. Its validator is independently deficient under I-3.
- [ ] **4. Ledger/runbook stale and merge safety:** The 24-hour stale rule,
      branch/worktree inspection, preservation of unmerged work, recovery logging,
      and Codex-only merge authority are stated, but I-4 makes the live lock
      lifecycle internally unsafe.
- [ ] **5. Claude environment record/fallback and §18 gate:** The required record
      fields and lawful fallback procedure exist, but neither Claude account has run
      the simulation and the fallback has not been demonstrated. I-1 blocks this
      task now; recording SBLA-008 as blocked does not satisfy §18 SBLA-002.
- [ ] **6. Validator correctness/fail-closed behavior/SBLA-001 preservation:**
      The candidate does not rename, remove, reorder, or weaken an accepted SBLA-001
      command or test, and missing literal artifacts are rejected. I-2 and I-3 show
      that the new validators do not fail closed for accepted path traversal or
      policy weakening.
- [x] **7. Relocation/integration state:** Filesystem, ref, reflog, worktree, and
      backup checks corroborate the recorded relocation and fast-forward. M-1 asks
      for more precise SHA terminology.
- [ ] **8. Security, tests/TDD, reproducibility, and scope:** Pinned-runtime
      verification, E2E on an alternate port, audit, diff hygiene, unchanged
      SBLA-001 gates, and later-task scope boundaries all pass. The traversal bypass
      and missing negative tests in I-2/I-3 remain material security and test-quality
      failures, so this area does not pass overall.

## Verdict

**FAIL.** There are no Critical findings, but I-1 through I-4 are unresolved
Important findings. Most decisively, the authoritative §18 pass condition is
admittedly incomplete: neither separate Claude role has completed its required
simulation and the chat-only fallback has not been demonstrated end to end.
Additionally, both new validators have fail-open cases and the ownership-lock
lifecycle is contradictory. SBLA-002 requires a repaired exact commit and a new
independent review round.
