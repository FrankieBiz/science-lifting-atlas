# SBLA-002 Independent Review — Round 2

## Reviewer identity/capability limitation

This review was performed by a Codex reviewer. I am not either of the separate
Anthropic Claude Team accounts required for the Claude Research and Claude
Review readiness simulations. This report independently reviews the repaired
repository candidate, but neither my identity nor this work can count as either
Claude-account simulation or as the end-to-end chat-only fallback.

## Candidate, base, and inputs

- Repaired candidate commit:
  `c6f7d52358e12817a01fcdb528735a7cdf6cae5c`
- Round 1 candidate/base for the repair range:
  `af1b920afef8614c5cfc58bb1ddedfbab9933bc3`
- Exact repair range reviewed:
  `af1b920afef8614c5cfc58bb1ddedfbab9933bc3..c6f7d52358e12817a01fcdb528735a7cdf6cae5c`
- Original SBLA-002 dependency/integration base:
  `141b63913b75791a6630303fdd1936fc615b3471`
- The worktree resolved exactly to the repaired candidate and was clean before
  review verification. I reviewed the immutable commit, not later working-tree
  changes.

Authoritative inputs reviewed:

- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/product/master-plan.md`
  (especially §§13.2–13.9 and authoritative §18)
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-001-handoff.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-001-r2.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-002-handoff.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/reviews/releases/SBLA-002-r1.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/AGENTS.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/CLAUDE.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/current-work.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/branch-and-worktree.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/handoff-template.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/docs/runbooks/claude-environments.md`
- The complete 14-path repair diff, including both repair commits, all validator
  and regression-test changes, the immutable Round 1 report, and the finalized
  handoff/ledger state.

## Verification performed

- Confirmed the exact candidate/base SHAs, inspected the full repair diff and
  both repair commits, and ran
  `git diff --check af1b920afef8614c5cfc58bb1ddedfbab9933bc3 c6f7d52358e12817a01fcdb528735a7cdf6cae5c`:
  PASS.
- Confirmed all six §18 artifacts remain regular `100644` candidate blobs. The
  copied handoff template contains all ten §13.6 headings exactly once and in
  order.
- Used the required PATH-prefixed Node.js `v24.20.0` and pnpm `11.24.0`.
- `pnpm verify`: PASS. Prettier and ESLint passed; `astro check` reported 30
  files and 0 errors, warnings, or hints; 7 unit-test files and 34 tests passed;
  the three empty-state foundation adapters passed; the one-page production
  build completed; and `verify:foundation` passed.
- Canonical `pnpm test:e2e`: PASS on port 4321; 1 Chromium test passed with
  JavaScript disabled. `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance`: PASS, 1 test each.
- `pnpm audit --audit-level high`: PASS; no known vulnerabilities reported.
- Exported exact candidate
  `c6f7d52358e12817a01fcdb528735a7cdf6cae5c` with `git archive` into a fresh
  temporary directory. `pnpm install --frozen-lockfile && pnpm verify`: PASS;
  all 530 packages came from the content-addressable store, and the same 30-file,
  34-test result reproduced. The temporary archive was removed after the run.
- Confirmed the accepted SBLA-001 `package.json`, foundation contract, and
  accepted foundation contract/adapter tests are unchanged in the repair range.
  `git fsck --full --no-dangling` passed, registered worktree paths remain
  repaired, `main` remains at the recorded SBLA-001 acceptance-record commit,
  and the SBLA-001 branch remains preserved.
- Ran the Git-derived checker on the clean candidate with role `codex` and exact
  base `af1b920…`: PASS, 14 changed paths derived.
- In isolated temporary Git repositories, independently tested changes that the
  new CLI suite does not cover:
  - deleting prohibited `src/pages/index.astro` while adding one allowed review
    report incorrectly passed Claude Review with exit 0;
  - renaming prohibited `src/pages/index.astro` to
    `reviews/releases/index.astro` incorrectly passed Claude Review with exit 0.
- Mutated candidate policy text in memory while retaining all required phrases.
  Adding “Claude Review is additionally authorized to merge task branches” and
  “Builder ownership remains active throughout independent review” returned
  `[]` from `validateOperatingModel` (pass).

## Round 1 resolution

### I-1 — Mandatory separate Claude simulations/fallback: unresolved

The repair now states the gate accurately, but it does not perform it.
`docs/runbooks/claude-environments.md:8-25` still records both Claude accounts as
not provisioned and `OUTSTANDING`, while
`docs/runbooks/claude-environments.md:115-126` still requires both six-step
simulations or the end-to-end fallback. The handoff repeats the unresolved state
at `reviews/releases/SBLA-002-handoff.md:166-175`.

Authoritative master plan `docs/product/master-plan.md:1742-1749` makes that a
current SBLA-002 pass condition. This Codex review cannot satisfy it.

**Resolution status: OPEN / Important.** Provision and run both separate Claude
accounts, or demonstrate and record the complete lawful chat-only round trip,
then submit the exact resulting commit for another review.

### I-2 — Role path checker: partially resolved, residual bypass remains

Canonicalization now handles slash variants, traversal, absolute paths, and
repository escapes (`scripts/foundation/role-paths.mjs:16-30`), and unit coverage
exists at `tests/unit/role-paths.test.ts:104-130`. The CLI now validates a Git
commit, requires a clean worktree, derives a non-empty diff from the base, and
does not accept caller-supplied path subsets
(`scripts/foundation/check-role-paths.mjs:7-72`). Those Round 1 cases are fixed.

However, the Git command explicitly excludes deletions with
`--diff-filter=ACMRTUXB` and requests only names
(`scripts/foundation/check-role-paths.mjs:53-65`). It therefore omits a prohibited
deletion. For a detected rename from a prohibited path into an allowed path,
`--name-only` supplies only the allowed destination. Both independently tested
cases exited 0. The CLI tests cover allowed additions, prohibited additions,
dirty state, and an empty diff, but neither deletion nor rename source paths
(`tests/unit/role-paths-cli.test.ts:64-116`). The handoff's “complete committed
diff” claim at `reviews/releases/SBLA-002-handoff.md:64-67` is not yet true.

**Resolution status: OPEN / Important.** Include deletions and both sides of
renames. A simple fail-closed approach is `--no-renames` plus a diff filter that
includes `D`, so a move is evaluated as a prohibited deletion and an allowed
addition. Add CLI regressions for prohibited deletion and prohibited-to-allowed
rename, and require the exact reviewed base to be an ancestor of `HEAD`.

### I-3 — Operating-model validator: partially resolved, semantic bypass remains

The validator now enforces actual level-two heading count/order
(`scripts/foundation/operating-model.mjs:117-136`), and `verify.mjs` uses `lstat`
to require regular policy files (`scripts/foundation/verify.mjs:42-59`). Unit and
filesystem regressions cover heading reversal/duplication, one exact authority
phrase, the old post-handoff phrase, and a required-document symlink
(`tests/unit/operating-model-contract.test.ts:120-183` and
`tests/unit/operating-model-filesystem.test.ts:13-59`). Those structural cases
are fixed.

Contradictory policy remains a finite exact-substring blacklist
(`scripts/foundation/operating-model.mjs:73-96` and
`scripts/foundation/operating-model.mjs:149-158`). Semantically equivalent
authority and lifecycle grants evade it, as the fresh in-memory mutant returning
`[]` demonstrates. This is the same fail-open policy class identified in Round
1, whose recommendation was structured invariants rather than presence-only
phrases. The handoff itself acknowledges that the check is not general semantic
validation at `reviews/releases/SBLA-002-handoff.md:176-179`.

**Resolution status: OPEN / Important.** Move authority and lifecycle state into
a small structured, validated policy source from which prose is rendered or
checked, instead of trying to enumerate forbidden English. At minimum, stop
claiming fail-closed contradictory-policy enforcement and add adversarial
rephrasing tests covering equivalent grants and persistent review locks.

### I-4 — Builder/review/remediation ownership lifecycle: partially resolved

The permanent builder lock is removed. The ledger now closes the builder and
bounded remediation claims and has no active builder path
(`docs/runbooks/current-work.md:15-35`); the branch runbook distinguishes builder,
review, and remediation states (`docs/runbooks/branch-and-worktree.md:47-60`).
That portion of Round 1 is fixed.

The separate review claim is not operationally recorded. The ledger says no
repository path is locked (`docs/runbooks/current-work.md:20-27`) while this
Round 2 review owns `reviews/releases/SBLA-002-r2.md`, and the runbook says review
owns its exact append-only path without adding a step to record that ownership
(`docs/runbooks/branch-and-worktree.md:57-60`). `CLAUDE.md:69-78` instructs a
Claude reviewer to claim the ledger, but the same role may write only to
`reviews/` (`CLAUDE.md:54-55`), and the path checker rejects the ledger path.
Without the task chat, another session cannot discover the report-file owner.

**Resolution status: OPEN / Important.** Document that Codex records the exact
review-file claim on the reviewer's behalf before review starts, then records
its closure, or provide an equally durable coordination mechanism outside the
candidate under review. Reconcile `CLAUDE.md` so it does not direct a restricted
role to edit a prohibited ledger path. Add a lifecycle test covering builder
closure, independent review-file ownership, failed-review remediation, and
review closure.

### M-1 — Candidate versus acceptance-record SHA terminology: resolved

The handoff now distinguishes the SBLA-001 implementation candidate
`9ac14081…` from acceptance-record/integration base `141b639…` at
`reviews/releases/SBLA-002-handoff.md:14-20`. The closed ledger makes the same
distinction at `docs/runbooks/current-work.md:31-35`.

### M-2 — Claude Review plagiarism-style duty: resolved

`CLAUDE.md:49-52` now includes content consistency and plagiarism-style checks,
matching master plan `docs/product/master-plan.md:1254-1262`.

## Critical findings

None.

## Important findings

- **R2-I-1:** The mandatory §18 separate-Claude simulation/fallback gate remains
  unperformed. Action: complete and record it before acceptance.
- **R2-I-2:** The Git-derived role checker fails open for prohibited deletions
  and prohibited-to-allowed renames. Action: enumerate all affected old/new
  paths and add regression coverage.
- **R2-I-3:** The policy validator still passes semantically equivalent grants
  of prohibited merge authority and persistent review locks. Action: validate a
  structured policy model rather than a finite English blacklist.
- **R2-I-4:** Review-file ownership is asserted but not durably claimed, and
  Claude is instructed to update a ledger outside its allowed path. Action:
  define and test a Codex-mediated review claim/closure workflow.

## Minor findings

### R2-M-1 — The environment record incorrectly refers to an unprovisioned Claude builder shell

`docs/runbooks/claude-environments.md:73-78` calls the original sandboxed
environment the “original Claude builder shell,” while the same file says both
Claude accounts have not been provisioned or tested
(`docs/runbooks/claude-environments.md:8-25`). The handoff accurately calls it
the original builder sandbox at `reviews/releases/SBLA-002-handoff.md:142-144`.

**Action:** change the environment record to “original Codex builder shell” or
“original SBLA-002 builder sandbox” so it cannot be mistaken for Claude
readiness evidence.

## Acceptance checklist

- [x] **Six artifacts and handoff structure:** All six required artifacts exist
      as regular blobs and the reusable template has all ten §13.6 headings exactly
      once and in order.
- [x] **Role prose and authority:** The principal Codex/Claude role split remains
      faithful, and M-2 is repaired. The review-claim instruction conflict in R2-I-4
      prevents the workflow from passing overall.
- [x] **Stale builder locks and Codex merge authority:** The 24-hour rule,
      unmerged-work preservation, recovery logging, and Codex-only merge authority
      remain stated; the permanent post-handoff builder lock is removed.
- [ ] **Separate review/remediation lifecycle:** Bounded remediation is recorded,
      but exact review-file ownership is not durably claimed; R2-I-4 remains.
- [ ] **Claude environment and authoritative §18 gate:** The record and lawful
      fallback procedure exist, but both Claude simulations/fallback remain
      unperformed under R2-I-1.
- [ ] **Validator fail-closed behavior:** Traversal, absolute paths, dirty/empty
      Git state, heading order/uniqueness, and symlinks are repaired. R2-I-2 and
      R2-I-3 demonstrate unresolved fail-open cases.
- [x] **SBLA-001 preservation, relocation, and scope:** Accepted command order,
      contract/tests, repository relocation/integration records, later-task
      boundaries, and append-only review history are preserved.
- [ ] **Security, test quality/TDD, and reproducibility:** Full gates, canonical
      E2E, audit, and clean-archive reproduction pass. Missing deletion/rename and
      adversarial-policy regressions leave material security and test-quality gaps.

## Verdict

**FAIL.** There are no Critical findings, but four Important findings remain.
Most decisively, the authoritative §18 pass condition is still explicitly
unperformed, so this Codex reviewer cannot accept SBLA-002. The repaired
candidate also retains fail-open deletion/rename and policy-rephrasing cases,
and the independent review-file ownership lifecycle is not durably represented.
A further repaired exact candidate and independent review round are required.
