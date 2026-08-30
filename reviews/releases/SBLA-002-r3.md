# SBLA-002 Independent Review — Round 3

## Reviewer identity/capability limitation

This review was performed by an independent Codex reviewer. I am not either of
the separate Anthropic Claude Team accounts required for the Claude Research and
Claude Review readiness simulations. This report cannot count as either
simulation or as the end-to-end chat-only fallback.

## Candidate, review branch, and coordination claim

- Exact candidate reviewed:
  `3f05124895c974db2d159b75f08ed491ec148912`
- Review branch: `codex/SBLA-002-independent-review-r3`
- Review worktree:
  `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3`
- Round 2 reviewed candidate:
  `c6f7d52358e12817a01fcdb528735a7cdf6cae5c`
- Exact remediation range inspected:
  `c6f7d52358e12817a01fcdb528735a7cdf6cae5c..3f05124895c974db2d159b75f08ed491ec148912`
- Codex coordination-branch claim commit:
  `7bb8fb9b87b781338df38a26a48be920590ef823`

Before writing, `HEAD` and the review branch both resolved to the exact
candidate, and the review worktree was clean. The coordination commit is a
direct child of the candidate and changes only
`docs/runbooks/current-work.md`. At
`7bb8fb9b87b781338df38a26a48be920590ef823:docs/runbooks/current-work.md:32-34`,
it records this reviewer role, exact review branch and worktree, full candidate
SHA, start time, expected handoff, and sole owned path
`reviews/releases/SBLA-002-r3.md`. The claim therefore predates this report and
does not contaminate the review branch's candidate-based diff.

## Inputs reviewed

- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/product/master-plan.md`
  (especially §§13.2–13.9 and authoritative §18)
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/AGENTS.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/CLAUDE.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/runbooks/current-work.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/runbooks/branch-and-worktree.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/runbooks/handoff-template.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/runbooks/claude-environments.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/docs/runbooks/operating-policy.json`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/reviews/releases/SBLA-002-handoff.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/reviews/releases/SBLA-002-r1.md`
- `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-review-r3/reviews/releases/SBLA-002-r2.md`
- The complete 15-path Round 2 remediation diff, including both remediation and
  pre-review coordination-fix commits, validator/test changes, and the immutable
  Round 2 report.

## Verification performed

- `git diff --check c6f7d52358e12817a01fcdb528735a7cdf6cae5c 3f05124895c974db2d159b75f08ed491ec148912`:
  PASS.
- Confirmed the six §18 artifacts remain regular `100644` candidate blobs. The
  reusable handoff template contains all ten §13.6 level-two headings exactly
  once and in order.
- Used the required PATH-prefixed Node.js `v24.20.0` and pnpm `11.24.0`.
- `pnpm verify`: PASS. Prettier and ESLint passed; `astro check` reported 30
  files and 0 errors, warnings, or hints; 7 unit-test files and 40 tests passed;
  all three foundation adapters passed in their empty state; the one-page static
  build completed; and `verify:foundation` passed.
- Canonical `pnpm test:e2e`: PASS on port 4321, 1 Chromium test with JavaScript
  disabled. `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance`: PASS, 1 test each.
- `pnpm audit --audit-level high`: PASS; no known vulnerabilities reported.
- Exported exact candidate
  `3f05124895c974db2d159b75f08ed491ec148912` with `git archive` into a fresh
  temporary directory. `pnpm install --frozen-lockfile && pnpm verify`: PASS;
  the same 30-file, 40-test result reproduced. The temporary archive was removed.
- Independently reproduced the repaired path cases in temporary Git
  repositories:
  - deleting prohibited `src/pages/index.astro` while adding an allowed review
    report exited 1 and named the deleted path;
  - renaming prohibited `src/pages/index.astro` into `reviews/` exited 1 and
    named the source path;
  - the committed tests also exercise and reject a non-ancestor base.
- Independently exercised the new structured policy in a clean temporary copy.
  Changing `writeBoundaries["claude-review"]` to `[""]`, modifying
  `src/pages/index.astro`, and adding a review report produced a clean committed
  diff. The role-path CLI incorrectly exited 0 and allowed all three paths.
  `verify:foundation` separately exited 1 and correctly reported that
  `writeBoundaries.claude-review` must equal `["reviews/"]`.
- Confirmed the accepted SBLA-001 `package.json`, foundation contract,
  foundation contract/adapter tests, and immutable SBLA-001 review reports are
  unchanged in the remediation range. `git fsck --full --no-dangling` passed.

## Round 2 resolution

### R2-I-1 — Mandatory Claude simulations/fallback: unresolved

The candidate accurately keeps both Claude accounts `OUTSTANDING` at
`docs/runbooks/claude-environments.md:8-25`, and the outstanding actions remain
at `docs/runbooks/claude-environments.md:116-127`. The handoff acknowledges the
same open gate at `reviews/releases/SBLA-002-handoff.md:221-230`.

**Status: OPEN / Important.** Authoritative master plan
`docs/product/master-plan.md:1742-1749` requires the two separate simulations or
the demonstrated fallback for SBLA-002. This Codex review cannot satisfy it.

### R2-I-2 — Deletion, rename-source, and base-ancestry checks: resolved

The CLI now requires the base to be an ancestor
(`scripts/foundation/check-role-paths.mjs:40-49`), uses `--no-renames`, and
includes deletions (`scripts/foundation/check-role-paths.mjs:64-77`). Regression
coverage for prohibited deletion, prohibited-to-allowed rename, and divergent
base appears at `tests/unit/role-paths-cli.test.ts:109-165`. Independent
reproduction confirmed the deletion and rename cases exit 1.

The structured-policy circular-trust issue described in R3-I-2 below is a new
boundary-check defect, not a failure of these repaired Git enumeration cases.

### R2-I-3 — Structured authority and lifecycle policy: resolved as a repository contract

`docs/runbooks/operating-policy.json:1-22` now supplies exact authority,
lifecycle, and boundary values. `scripts/foundation/operating-model.mjs:105-227`
validates exact keys and values, and
`scripts/foundation/operating-model.mjs:249-254` rejects invalid JSON. The prose
expressly cannot expand that policy (`AGENTS.md:8-12` and
`docs/runbooks/branch-and-worktree.md:79-81`). Contract tests mutate merge
authority, builder closure, review claim scope/recorder/base/location/closure,
and verify named failures (`tests/unit/operating-model-contract.test.ts:146-215`).

This resolves the English-blacklist-as-authority defect. R3-I-2 concerns the
separate path CLI importing an unvalidated mutable HEAD policy before applying
the boundary.

### R2-I-4 — Codex-mediated review claim lifecycle: resolved

The structured lifecycle requires Codex-recorded exact-path claims on the Codex
coordination branch while restricted diffs remain based on the reviewed artifact
(`docs/runbooks/operating-policy.json:8-15`). `CLAUDE.md:69-80` tells restricted
roles to request and verify the committed claim rather than edit the ledger.
`docs/runbooks/branch-and-worktree.md:47-62` documents claim and closure.

The durable Round 3 instance at
`7bb8fb9b87b781338df38a26a48be920590ef823:docs/runbooks/current-work.md:32-34`
matches the dispatched branch, worktree, candidate, expected report, and exact
owned path. The coordination commit's parent is the candidate and its only
changed file is the ledger.

### R2-M-1 — Builder-environment label: resolved

`docs/runbooks/claude-environments.md:71-83` now calls it the original SBLA-002
builder sandbox and explicitly says that run is not Claude readiness evidence.

## Critical findings

None.

## Important findings

### R3-I-1 — The mandatory §18 external readiness gate is still unperformed

Neither separate Claude Team account has completed its path/source/handoff
simulation, and the chat-only fallback has not been demonstrated end to end.
Exact evidence and required action are recorded under R2-I-1 above.

**Action:** provision and run both separate accounts, or complete the lawful
versioned-bundle round trip with returned checksums, untrusted-input validation,
permitted-path placement, and committed handoffs. Submit that exact resulting
commit for review. Until then, §18 prohibits PASS.

### R3-I-2 — The role boundary checker trusts a HEAD policy that a restricted role can modify to authorize itself

`scripts/foundation/role-paths.mjs:3-19` imports write boundaries directly from
the current checkout's `operating-policy.json`. The CLI imports those boundaries
at `scripts/foundation/check-role-paths.mjs:4` and applies them only after deriving
the diff (`scripts/foundation/check-role-paths.mjs:64-96`). It never validates the
structured policy before trusting it and never loads boundaries from the trusted
reviewed base.

Therefore a restricted role can commit a policy change that grants itself the
empty prefix, commit prohibited application-code changes in the same clean diff,
and receive exit 0 from the advertised path-boundary check. The separate
foundation contract catches the invalid policy, but that does not make the
path-boundary gate itself fail closed. No committed regression covers policy
self-expansion.

**Action:** make the CLI load and validate boundaries from the trusted base
commit (for example, `git show <base>:docs/runbooks/operating-policy.json`) or
validate the current policy against immutable canonical values before it can
construct `ROLE_WRITE_BOUNDARIES`. A restricted diff that changes the policy
must be evaluated using the trusted pre-change boundary and fail. Add an
end-to-end regression in which Claude Review modifies the policy, application
code, and a review file in one clean committed diff.

## Minor findings

None.

## Acceptance checklist

- [x] **Required artifacts and no-chat procedure:** The six §18 artifacts exist;
      the ten handoff headings are exact; the coordination branch and runbooks allow
      this reviewer to verify its durable claim without modifying the candidate.
- [x] **Role prose, lifecycle, and authority source:** Role ownership matches
      master plan §13, the structured values are strict, review/remediation states
      are separate, and Codex remains the only merge/stale-clear/content-promotion
      authority.
- [x] **Round 2 Git enumeration repairs:** Traversal, absolute/escape, dirty and
      empty state, deletion, rename source, and non-ancestor base cases are covered
      and pass their negative tests.
- [ ] **Path-boundary fail-closed behavior:** R3-I-2 allows a restricted role to
      modify the HEAD policy and authorize its own otherwise prohibited diff.
- [x] **SBLA-001 preservation and scope:** Accepted gates and reports are
      unchanged; no scientific content, schema, architecture ADR, media, or product
      surface was added.
- [x] **Security/test/reproducibility checks:** Pinned verify, canonical E2E,
      auxiliary gates, audit, Git integrity, and clean-archive reproduction pass.
- [x] **Coordination claim lifecycle:** The exact report path was durably claimed
      on the Codex coordination branch before dispatch without contaminating this
      review branch. Codex must close it after this immutable report commit.
- [ ] **Authoritative §18 readiness:** Both Claude account simulations/fallback
      remain unperformed under R3-I-1.

## Verdict

**FAIL.** There are no Critical findings, but two Important findings remain. The
mandatory §18 Claude-readiness condition is still unperformed, which alone
prevents acceptance. In addition, the role-path gate can be self-authorized by a
restricted-role policy change even though the separate foundation validator
later rejects that policy. SBLA-002 requires another repaired exact candidate
and independent review after the external gate is actually completed.
