# Handoff: SBLA-002 Round 4 independent Claude Review and account-B readiness

## Objective

Two deliverables in one run, both required by the authoritative queue row for
SBLA-002 at `docs/product/master-plan.md:1749`:

1. Perform the **independent Round 4 acceptance audit** of the complete SBLA-002
   candidate at commit `107c44504438398934d56755b51cff3437b7e0f9`, returning
   PASS or FAIL per criterion with exact `path:line` or commit evidence.
2. Serve as the **Claude Review account-B environment-readiness simulation**
   required by master plan §13.9 (`docs/product/master-plan.md:1357-1374`), the
   sole external readiness item recorded as outstanding at
   `docs/runbooks/claude-environments.md:198-212`.

### Independence statement

This is **distinct Claude Team account B**, acting as Claude Review. This
session **did not author** SBLA-002, SBLA-003, SBLA-004, or the Claude Research
readiness artifacts. Nothing in this session's context contains authorship of
those artifacts, and this run made no repair to any audited file.

Recorded honestly as a limit on that statement: account identity is a property
of the environment the owner provisioned, not something this session can
cryptographically prove from inside the repository. Every commit in this
repository — Codex, Claude Research, and this one — carries the same Git author
`Francis Bisignano <frankabisignano@gmail.com>`, so **Git metadata cannot
distinguish accounts** and is not evidence of independence for any role. The
standing constraint at `docs/runbooks/claude-environments.md:189-196` therefore
depends on the owner's provisioning and on the ledger's authored/audited record,
not on anything verifiable in-repository. See
[Known uncertainties](#known-uncertainties).

## Inputs and exact paths

### Commits, branch, worktree

| Item                     | Value                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Artifact commit reviewed | `107c44504438398934d56755b51cff3437b7e0f9`                                                    |
| Artifact commit subject  | `docs: record Claude Research readiness pass` (2026-08-31 13:12:43 -0400)                     |
| Codex claim commit       | `6c837d58f27d085c42f8f33b2c03cdeada202dfa`                                                    |
| Claim commit subject     | `docs: assign Claude Review readiness to round four` (2026-08-31 13:15:30 -0400)              |
| Branch                   | `claude-review/SBLA-002-readiness`                                                            |
| Worktree                 | `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-claude-review-readiness` |
| Repository               | `/Users/frankbisignano/dev/science-lifting-atlas`                                             |
| Trusted Codex checkout   | `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model`   |

### Pre-write verification (all four required conditions passed)

- Branch: `git rev-parse --abbrev-ref HEAD` → `claude-review/SBLA-002-readiness`.
- HEAD: `git rev-parse HEAD` → `107c44504438398934d56755b51cff3437b7e0f9`, an
  exact match for the assigned artifact commit.
- Clean: `git status --porcelain` returned empty output.
- Claim: `git show 6c837d5:docs/runbooks/current-work.md:32-34` records role
  `Claude Review (account B)`, branch `claude-review/SBLA-002-readiness`,
  worktree `.worktrees/sbla-002-claude-review-readiness`, base commit
  `107c44504438398934d56755b51cff3437b7e0f9`, started `2026-08-31 13:14 EDT`,
  expected handoff and sole path owned **both** exactly
  `reviews/releases/SBLA-002-r4.md`.

`git diff --name-status 107c4450 6c837d5` returns exactly one row,
`M docs/runbooks/current-work.md`. The claim is therefore isolated on the Codex
coordination branch and does not contaminate this role's diff, as
`docs/runbooks/operating-policy.json:13-14` requires. `107c4450` is confirmed a
strict ancestor of `6c837d5`.

### Artifacts read without editing

`AGENTS.md`; `CLAUDE.md`; `docs/product/master-plan.md` in full (1825 lines,
especially §§13.2–13.9 at `1197-1374`, §18 at `1742-1769`, §19 at `1773-1794`);
`docs/runbooks/current-work.md` at HEAD and at `6c837d5`;
`docs/runbooks/branch-and-worktree.md`; `docs/runbooks/claude-environments.md`;
`docs/runbooks/handoff-template.md`; `docs/runbooks/operating-policy.json`;
`scripts/foundation/check-role-paths.mjs`; `scripts/foundation/role-paths.mjs`;
`scripts/foundation/operating-model.mjs`; `scripts/foundation/verify.mjs`;
`tests/unit/role-paths-cli.test.ts`; `reviews/releases/SBLA-002-handoff.md`;
`reviews/releases/SBLA-002-r1.md`; `-r2.md`; `-r3.md`;
`research/questions/SBLA-002-readiness.md`;
`research/extractions/SBLA-002-readiness.md`;
`research/packets/SBLA-002-claude-research-readiness-handoff.md`.

**Input discrepancy in the dispatch packet:** the packet named
`tests/unit/operating-model.test.ts`. No such file exists at `107c4450`. The
actual files are `tests/unit/operating-model-contract.test.ts` and
`tests/unit/operating-model-filesystem.test.ts`; both were read instead. This is
a packet defect, not an artifact defect, and no criterion turns on it.

### Source used for the extraction audit

The CC0 seven-line readiness fixture supplied inline in the dispatch packet,
lines `[L1]`–`[L7]`, treated as the complete source. No model memory was used as
evidence.

## Constraints

- **Wrote exactly one file:** `reviews/releases/SBLA-002-r4.md`. Nothing else was
  created, modified, renamed, or deleted.
- **Repaired nothing.** Every finding below is referred to its owner. This is
  required by `docs/product/master-plan.md:1264`, `AGENTS.md:43`, and
  `CLAUDE.md:53-55`.
- **Did not edit the ledger.** `docs/runbooks/current-work.md` is outside this
  role's boundary; Codex records and closes the claim (`CLAUDE.md:72-80`).
- **Did not merge, rebase, force-push, or cherry-pick.** Codex is the only merge
  authority (`docs/runbooks/operating-policy.json:4`). The claim at `6c837d5`
  was read with `git show` and deliberately **not** merged into this branch.
- **Did not run the role-boundary checker as acceptance evidence**, per the
  dispatch instruction and `CLAUDE.md:114-117`. The checker was exercised only
  against disposable temporary repositories to falsify its behavior, never
  against this worktree as a self-certification. The command for Codex to run
  from its trusted checkout is in
  [Required reviewer action](#required-reviewer-action).
- Append-only: no prior round's report was read-modified. `-r1`, `-r2`, `-r3`
  are byte-unchanged.

## Work completed

A complete adversarial audit of the SBLA-002 candidate at `107c4450` — not only
the three Research files — including a recheck of every Round 1–3 concern, line-
by-line entailment checking of the Research extraction against the fixture,
independent falsification attempts against the path-boundary gate, and a real
pinned-runtime verification run.

### Recheck of prior rounds

| Prior finding                                   | Status at `107c4450`                                     | Evidence                                                                                                                                                                          |
| ----------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 I-1 / R2-I-1 / R3-I-1 — external Claude gate | Research half **closed**; Review half closed by this run | `docs/runbooks/claude-environments.md:24,93-120`; `docs/runbooks/current-work.md:48`; this report                                                                                 |
| R1 I-2 / R2-I-2 — traversal, deletions, renames | **Resolved**                                             | `scripts/foundation/role-paths.mjs:16-31`; `scripts/foundation/check-role-paths.mjs:103-111`; `tests/unit/role-paths-cli.test.ts:198-236`                                         |
| R1 I-3 / R2-I-3 — policy-by-English-blacklist   | **Resolved**                                             | `docs/runbooks/operating-policy.json:1-22`; `scripts/foundation/operating-model.mjs:105-227`                                                                                      |
| R1 I-4 / R2-I-4 — ownership-lock lifecycle      | **Resolved**                                             | `docs/runbooks/operating-policy.json:8-15`; `docs/runbooks/current-work.md:18-21`; active-claims table empty at HEAD (`docs/runbooks/current-work.md:32-34`)                      |
| R1 M-1 — candidate vs acceptance-record SHA     | **Resolved**                                             | `docs/runbooks/current-work.md:39` distinguishes candidate `9ac1408` from acceptance base `141b639`                                                                               |
| R1 M-2 — dropped plagiarism-style duty          | **Resolved**                                             | `CLAUDE.md:49-52` includes "plagiarism-style checks"                                                                                                                              |
| R2-M-1 — builder-environment mislabel           | **Resolved**                                             | `docs/runbooks/claude-environments.md:79-92` names it the SBLA-002 builder sandbox and denies it is Claude evidence                                                               |
| R3-I-2 — mutable-HEAD policy self-authorization | **Resolved**                                             | `scripts/foundation/check-role-paths.mjs:65-87` loads policy from `<base>` and compares against the immutable contract; regression at `tests/unit/role-paths-cli.test.ts:152-196` |

R3-I-2 was the most consequential repair and it holds. `ROLE_WRITE_BOUNDARIES`
is now a frozen literal (`scripts/foundation/role-paths.mjs:10-14`) rather than
being read from the mutable working-tree policy; the CLI loads the base policy
via `git show <base>:docs/runbooks/operating-policy.json`
(`scripts/foundation/check-role-paths.mjs:66-77`), which is content-addressed and
so cannot be rewritten in the target's object store, and **fails closed** with
exit 2 when the two disagree (`scripts/foundation/check-role-paths.mjs:79-87`).

### Research extraction — line-by-line entailment audit

Every fact was checked against the exact fixture line cited. All seven are
entailed by their cited locator; none exceeds the source.

| Fact | Cited | Fixture line content                                                                         | Entailed |
| ---- | ----- | -------------------------------------------------------------------------------------------- | -------- |
| F1   | L1    | `Title: SBLA Claude Research Readiness Fixture`                                              | Yes      |
| F2   | L2    | `Version: 1.0, dated 2026-08-30`                                                             | Yes      |
| F3   | L3    | `License: CC0 1.0 Universal`                                                                 | Yes      |
| F4   | L4    | `The Science-Based Lifting Atlas uses separate research and review roles.`                   | Yes      |
| F5   | L5    | `Claude Research may write only within research/ and content-drafts/.`                       | Yes      |
| F6   | L6    | `This fixture contains operating-model facts, not scientific lifting evidence.`              | Yes      |
| F7   | L7    | `This fixture is intentionally too narrow to support anatomy, exercise, or training claims.` | Yes      |

Facts and interpretation are genuinely separated: facts occupy
`research/extractions/SBLA-002-readiness.md:25-37` under an explicit "Nothing is
inferred here" (line 27); inference is quarantined at lines `39-53` as I1–I3.
Limitations (`55-65`), applicability (`67-71`), conflicts (`73-76`),
contradictory-evidence scope (`78-87`), access level (`16`), and per-fact
uncertainty (`89-96`) are all recorded, and recorded honestly rather than
flatteringly — the "no contradictory evidence" result is self-labelled
"near-vacuous" at lines `84-87`, and lines `47-51` concede the fixture
"corroborates the repository, does not establish it." Scope discipline holds:
no anatomy, exercise, or training claim is made or implied, and the file forbids
its own promotion. Licensing is clean — CC0 per L3, so full quotation creates no
attribution or share-alike obligation, correctly stated at lines `21-23`.

### Falsification attempts against the boundary gate

Both were run against disposable temporary Git repositories using the checker
from the **trusted** Codex checkout, never against this worktree.

1. **Prefix-scope probe (confirmed defect).** `validateRolePaths` was called
   directly for role `claude-review`. It returns **ALLOWED** for
   `reviews/releases/SBLA-002-handoff.md` (the artifact under review),
   `reviews/releases/SBLA-002-r1.md`, `-r3.md`, and
   `reviews/releases/SBLA-001-r2.md`. It correctly DENIED `reviews`,
   `reviewsX/a.md`, `reviews/../AGENTS.md`, and
   `docs/runbooks/current-work.md`. See R4-I-2.
2. **Symlink-escape probe (confirmed defect, reproduced twice).** A committed
   symlink `reviews/releases/escape.md` → `../../AGENTS.md`, recorded by Git at
   mode `120000`, was accepted alongside a normal report. The trusted checker
   printed `Role path boundary passed: trusted base policy allows claude-review
to write all 2 changed path(s)` and **exited 0**. Run twice in independent
   probe repositories with identical output; both probes were deleted. See
   R4-M-1.

## Decisions made

- **Overall verdict is FAIL, and it is not driven by the Claude simulations.**
  Both role simulations are now materially complete: Research at
  `f2e0f00543bdc923e0b436059598314c237f1f85` (three `research/` paths, trusted
  boundary passed, integrated through `94cd82c`) and Review by this run. The
  FAIL rests on two Important findings in the candidate itself, both repairable
  by Codex without touching either simulation.
- **R4-I-1 is Important, not Critical.** It is a factual contradiction between
  two required artifacts at the same commit, which criterion 7 tests directly.
  It is not Critical because the authoritative record and the ledger agree with
  each other and are correct, and because the handoff errs _conservatively_ —
  it understates progress, so it cannot cause a premature acceptance.
- **R4-I-2 is Important, not Critical.** Exploitation requires a restricted role
  to act in bad faith, and Codex inspects the diff before integrating
  (`AGENTS.md:47-48`). It is not Minor, because "append-only review" is named in
  the acceptance criteria as something that must be _enforceable_, the repository
  declares the machine policy canonical and prose non-overriding
  (`AGENTS.md:8-12`), and the demonstrated gap lets the advertised §13.9 step-6
  gate return exit 0 on an overwrite of an immutable prior report.
- **R4-M-1 kept Minor deliberately.** Planting a symlink does not by itself
  modify the prohibited target; harm needs a further write by trusted tooling.
  Recorded as defense-in-depth, adjacent to the symlink class R2 already
  repaired for required artifacts (`scripts/foundation/verify.mjs:42-60`).
- **Criterion 6 PASSES despite R4-M-2.** The criterion asks whether the
  distinct-account rule is _consistent everywhere_; it is. That the rule is not
  machine-pinned is a durability risk, recorded as Minor rather than promoted to
  a consistency failure it is not.
- **Criterion 5 PASSES despite R4-M-3.** Every fact is entailed by its cited
  line. The imprecise word "quotation" does not weaken any entailment.
- **Did not treat any Codex review as the Claude Review gate.** R1, R2, and R3
  each disclaim standing (e.g. `reviews/releases/SBLA-002-r3.md:3-8`), and
  `docs/runbooks/claude-environments.md:160,191-196` agrees. This report is the
  first Claude Review artifact for SBLA-002.
- **Obtained the pinned runtime rather than reporting a blocked gate.** The host
  default is Node v26.0.0, which `engines` (`package.json:7-10`) and
  `engineStrict: true` (`pnpm-workspace.yaml:4`) correctly reject. Rather than
  record an unrun check, Node v24.20.0 was downloaded, checksum-verified against
  the official `SHASUMS256.txt`, and used. `AGENTS.md:98-99` anticipates exactly
  this and instructs using the pinned runtime, not the default.

## Tests/checks run and results

Real commands, real output. Nothing below was inferred.

### Pinned runtime

| Command          | Result                                                       |
| ---------------- | ------------------------------------------------------------ |
| `node --version` | `v24.20.0` (from the verified local extraction)              |
| `pnpm --version` | `11.24.0` (resolved from `packageManager` in the repository) |

Provenance: the host default Node was `v26.0.0`, outside `>=24.20.0 <25`. Node
`v24.20.0` for `darwin-arm64` was fetched from `nodejs.org/dist/v24.20.0/` and
its SHA-256 verified as
`b7bf7707070b950ba1ec5f1af3bb6de0f2b1962c5033973d94068ab021ef3014`, an exact
match for the entry in the official `SHASUMS256.txt`.

### Result on the host default runtime (recorded because it is the real default)

| Command                          | Exit | Output                                                                             |
| -------------------------------- | ---: | ---------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` |    1 | `ERR_PNPM_UNSUPPORTED_ENGINE` — `Expected version: >=24.20.0 <25` / `Got: v26.0.0` |
| `pnpm verify`                    |    1 | same engine rejection, before any gate ran                                         |

This is the contract working as designed, not a repository defect.

### Required gate on the pinned runtime

| Command                          | Exit | Result                              |
| -------------------------------- | ---: | ----------------------------------- |
| `pnpm install --frozen-lockfile` |    0 | 530 packages resolved; done in 4.3s |
| `pnpm verify`                    |    0 | **PASS**                            |

`pnpm verify` stage detail, as printed:

- `prettier --check .` — `All matched files use Prettier code style!`
- `eslint . --max-warnings 0` — passed, no output
- `astro check` — `Result (30 files): 0 errors, 0 warnings, 0 hints`
- `vitest run tests/unit` — `Test Files 7 passed (7)`, `Tests 42 passed (42)`
- `validate:content` — `foundation mode; 0 records.`
- `validate:graph` — `foundation mode; 0 nodes and 0 edges.`
- `evidence:status` — `foundation mode; 0 sources checked.`
- `astro build` — `1 page(s) built`
- `verify:foundation` — `Foundation contract passed`

`git status --porcelain` was empty after the install and build, confirming
`node_modules/` and `dist/` are correctly ignored (`.gitignore:4-5`).

### Git and scope checks

- `git rev-parse HEAD` → `107c44504438398934d56755b51cff3437b7e0f9`; branch
  `claude-review/SBLA-002-readiness`; `git status --porcelain` empty before
  writing.
- `git diff --name-status 107c4450 6c837d5` → exactly
  `M docs/runbooks/current-work.md`.
- `git merge-base --is-ancestor 107c4450 6c837d5` → true.
- `git diff --name-status e22cdf3 f2e0f00` → exactly three `A` rows, all under
  `research/`: `extractions/SBLA-002-readiness.md`,
  `packets/SBLA-002-claude-research-readiness-handoff.md`,
  `questions/SBLA-002-readiness.md`. Confirms the account-A run stayed inside
  its claimed boundary.
- `git diff --name-status f2e0f00 107c4450` → `M docs/runbooks/claude-environments.md`,
  `M docs/runbooks/current-work.md`, `M reviews/releases/SBLA-002-handoff.md` —
  the integration commit that produced the stale handoff text in R4-I-1.
- `git ls-tree -r 107c4450 -- research/` confirms the three Research files
  present as regular blobs.

### Checks deliberately not run

- The role-boundary checker against this worktree, per the dispatch instruction
  and `CLAUDE.md:114-117`. Codex must run it; the command is below.
- `pnpm test:e2e`, `test:a11y`, `test:visual`, `test:performance`. The SBLA-002
  row (`docs/product/master-plan.md:1749`) requires `pnpm verify`; the auxiliary
  gates were already run green by the R3 reviewer and this role must not present
  another environment's browser result as its own
  (`docs/runbooks/claude-environments.md:90-92`).

## Known uncertainties

- **Account identity is not verifiable in-repository.** Every commit here shares
  one Git author, so nothing in the repository distinguishes account A from
  account B or from Codex. This report's independence rests on the owner's
  provisioning plus the ledger's authored/audited record. If the environment
  running this session is _not_ a distinct account B, criteria 6, 9, and 10 are
  void regardless of what this file says. The standing constraint at
  `docs/runbooks/claude-environments.md:189-196` is the right control; it is
  currently enforced by record-keeping and owner discipline, not by a gate.
- **This run proves plumbing, not audit competence at scale.** A seven-line CC0
  fixture and a documentation-stage repository exercise none of what SBLA-010
  will demand — contradictory sources, paywalled full text, real citation
  entailment across many claims.
- **The trusted boundary result does not yet exist.** Criterion 9 is reported as
  "ready for" that check, not as having passed it. Only Codex can close it.
- **`pnpm verify` cannot judge audit quality.** It proves this file breaks no
  repository gate. It says nothing about whether these findings are correct.
- **Auxiliary gates were not rerun here** (see above), so this report carries no
  independent evidence about E2E, a11y, visual, or performance state at
  `107c4450`.
- **R4-I-2's practical severity depends on Codex's diff discipline**, which is
  documented (`AGENTS.md:47-48`) but not itself machine-enforced. If that
  discipline holds, the finding is latent rather than active.
- The packet's reference to `tests/unit/operating-model.test.ts` was
  unresolvable; the two real operating-model test files were read instead.

## Files created or modified

Created — exactly one file, the sole path claimed at
`6c837d5:docs/runbooks/current-work.md:34`:

- `reviews/releases/SBLA-002-r4.md`

Modified: none. Deleted: none. Renamed: none.

Expected diff from the artifact base:

```
git diff --name-status 107c44504438398934d56755b51cff3437b7e0f9...HEAD
A	reviews/releases/SBLA-002-r4.md
```

Two temporary probe repositories were created under `$TMPDIR` for the
falsification tests and deleted afterwards. Neither was inside the repository.

## Required reviewer action

Codex must, from its trusted checkout:

1. Confirm this worktree is clean and its diff from `107c4450` contains only
   `reviews/releases/SBLA-002-r4.md`.
2. Run the path-boundary gate — this report deliberately provides no self-run
   result:

   ```bash
   node /Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-agent-operating-model/scripts/foundation/check-role-paths.mjs claude-review --base 107c44504438398934d56755b51cff3437b7e0f9 --repository /Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-002-claude-review-readiness
   ```

   Expected: exit 0, one path, under `reviews/`.

3. Independently rerun the pinned `pnpm verify` gate.
4. Integrate this immutable report if valid; close the account-B claim; record
   the account-B readiness result in
   `docs/runbooks/claude-environments.md`.
5. Open a **bounded remediation claim** for R4-I-1 and R4-I-2. Per
   `docs/runbooks/operating-policy.json:15`, a failed review opens a bounded
   remediation claim and does not reopen the builder claim.
6. **Do not accept SBLA-002 on this report.** Round 4 is FAIL. Acceptance
   requires a repaired candidate and a further independent review round.

Each finding's owner is named in
[Acceptance criteria](#acceptance-criteria). No finding is for Claude Review to
repair.

## Acceptance criteria

### Per-criterion result

| #   | Criterion                                                          | Result   | Key evidence                                                                                                               |
| --- | ------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Role definitions and write boundaries match §§13.2–13.4 and policy | **PASS** | `AGENTS.md:34-48`; `CLAUDE.md:17-56`; `docs/runbooks/operating-policy.json:17-21`; `docs/product/master-plan.md:1212-1264` |
| 2   | Branch/worktree, claim, stale-lock, append-only, Codex-only rules  | **FAIL** | R4-I-2, R4-M-1. Append-only is not enforceable; boundary contradicts `AGENTS.md:38`                                        |
| 3   | Checker uses trusted base policy and the complete target diff      | **PASS** | `scripts/foundation/check-role-paths.mjs:58-119`; `tests/unit/role-paths-cli.test.ts:152-196`                              |
| 4   | Account-A simulation satisfies §13.9, three paths, standalone      | **PASS** | `git diff e22cdf3 f2e0f00` = 3 `A` rows under `research/`; `research/packets/…-handoff.md:1-167`                           |
| 5   | F1–F7 entailed; facts vs interpretation; limits recorded honestly  | **PASS** | Entailment table above; `research/extractions/SBLA-002-readiness.md:25-96`. R4-M-3 minor                                   |
| 6   | Distinct A/B consistent; same-account/Codex review never counts    | **PASS** | `docs/runbooks/claude-environments.md:160,164-196`; `CLAUDE.md:13-15`; `reviews/releases/SBLA-002-r3.md:3-8`. R4-M-2 minor |
| 7   | Handoff and environment record enable a cold start                 | **FAIL** | R4-I-1 — `reviews/releases/SBLA-002-handoff.md:254-261` contradicts the same commit's environment record and ledger        |
| 8   | Repository passes the required pinned-runtime verification         | **PASS** | `pnpm verify` exit 0 on Node `v24.20.0` / pnpm `11.24.0`; 7 files, 42 tests, 30 files 0 errors, 1 page                     |
| 9   | This account-B run itself satisfies §13.9                          | **PASS** | Preconditions verified; one permitted file; diff and standalone handoff produced; committed on the correct branch          |
| 10  | Overall SBLA-002 acceptance under §18                              | **FAIL** | Two unresolved Important findings remain (R4-I-1, R4-I-2)                                                                  |

Criterion 9 passes as worded — "ready for a trusted path-boundary check" — and
is subject to the account-identity limit in
[Known uncertainties](#known-uncertainties).

### Overall verdict

**FAIL.**

No Critical findings. The §18 external readiness condition that blocked Rounds
1–3 is now substantially discharged — account A passed and account B has run —
but two Important findings in the candidate remain, so `107c4450` cannot be
accepted.

### Critical findings

None.

### Important findings

#### R4-I-1 — The builder handoff contradicts the environment record and ledger about the §18 gate at the same commit

**Severity:** Important. **Owner:** Codex (owns
`reviews/releases/SBLA-002-handoff.md`; Claude Review must not repair it).
**Criterion:** 7, contributing to 10.

At `reviews/releases/SBLA-002-handoff.md:254-261` the candidate states that
"Claude Team accounts A and B have not been provisioned, so **neither run has
happened**", and that `docs/runbooks/claude-environments.md` "records **both**
roles as `OUTSTANDING`".

At the same commit `107c4450`, all three of these are false:

- `docs/runbooks/claude-environments.md:24` records Claude Research (account A)
  as `PASS (2026-08-31, f2e0f005; trusted boundary passed, see evidence)`.
- `docs/runbooks/claude-environments.md:9` says "The Codex role and Claude
  Research account A **are demonstrated**", and lines `93-120` give the full
  account-A evidence; line `211` repeats "Claude Research account A passed on
  2026-08-31".
- `docs/runbooks/current-work.md:48` records the account-A claim **closed** with
  a passing result and integration through `94cd82c`.

Cause is visible in the diff: `git diff --name-status f2e0f00 107c4450` shows
the integration commit updated `claude-environments.md` and `current-work.md`
but touched the handoff only to add one input line (`Role-mapping reconciliation
candidate: 09cd757…`), leaving the Known uncertainties section stale.

**Why the criterion fails.** Criterion 7 requires the handoff and environment
record together to let a new reviewer start without hidden chat context. The
handoff is the artifact `docs/product/master-plan.md:1769` designates as the
starting point, and it is wrong about the single decisive acceptance condition.
A reviewer trusting it would believe no Claude simulation had occurred and would
not know to audit the account-A artifacts at all. Two required §18 artifacts
contradicting each other at one commit is a defect regardless of which is right.

**Repair for Codex:** update `reviews/releases/SBLA-002-handoff.md:254-261` to
state the actual split state — account A passed at `f2e0f00`, account B is
this round — and re-point the reader at the environment record as authoritative.

#### R4-I-2 — Append-only review and "never write the artifact under review" are not enforceable by the advertised boundary gate

**Severity:** Important. **Owner:** Codex (owns
`docs/runbooks/operating-policy.json` and `scripts/foundation/`).
**Criterion:** 2.

`docs/runbooks/operating-policy.json:20` grants `claude-review` the single
prefix `["reviews/"]`, and `scripts/foundation/role-paths.mjs:64-66` allows any
path where `normalized.startsWith(prefix)`. The consequence, reproduced by
calling `validateRolePaths` directly for role `claude-review`:

| Path                                   | Boundary result | What it is                |
| -------------------------------------- | --------------- | ------------------------- |
| `reviews/releases/SBLA-002-handoff.md` | **ALLOWED**     | the artifact under review |
| `reviews/releases/SBLA-002-r1.md`      | **ALLOWED**     | immutable Round 1 report  |
| `reviews/releases/SBLA-002-r3.md`      | **ALLOWED**     | immutable Round 3 report  |
| `reviews/releases/SBLA-001-r2.md`      | **ALLOWED**     | accepted SBLA-001 report  |

This contradicts four places that state the opposite rule:

- `AGENTS.md:38` — Claude Review "Must never write: Everything else,
  **including the artifact under review**". For SBLA-002 that artifact is
  `reviews/releases/SBLA-002-handoff.md`, which lives inside `reviews/`.
- `docs/product/master-plan.md:1310` — "Review reports are append-only."
- `CLAUDE.md:102-103` and
  `docs/runbooks/branch-and-worktree.md:143` — same rule.

No machine check closes the gap. `grep -rn "append" scripts/ tests/` returns
only the literal policy-string comparisons in
`scripts/foundation/operating-model.mjs:67,112` and their tests; those assert
the _string_ `exact-append-only-report-path` is present in the policy, not that
any file is actually append-only. `scripts/foundation/verify.mjs` has no
immutability check.

**Why the criterion fails.** Criterion 2 requires the append-only rule to be
"enforceable and consistent". It is neither. `AGENTS.md:8-12` declares the
structured policy canonical and says prose "cannot expand or override it" — so
under the repository's own doctrine the narrower prose does not bind the gate,
and the §13.9 step-6 check advertised at
`docs/runbooks/claude-environments.md:43-62` as the boundary control returns
exit 0 for a restricted role that silently rewrites a prior immutable report or
the artifact it was asked to audit. This is the same class of defect as R2-I-3
and R3-I-2 — authority asserted in prose but absent from the machine gate — in a
place those rounds did not examine.

**Repair for Codex (not for this role):** express the sub-boundary structurally
— for example a per-claim exact-path allow-list (the ledger already records one
exact path per review claim), or a policy field distinguishing "may create new
`reviews/<discipline>/<task-id>-r<n>.md`" from "may modify existing files under
`reviews/`" — and enforce it in `check-role-paths.mjs` by rejecting `M`/`D`/`R`
status against pre-existing paths under `reviews/` for restricted roles. Add a
regression in which `claude-review` modifies a prior report and the handoff
under review in one clean committed diff and the gate exits non-zero.

### Minor findings

#### R4-M-1 — A committed symlink inside an allowed directory passes the boundary gate

**Owner:** Codex. **Criterion:** 2 (contributing).

The checker validates path _names_, never Git entry _modes_. In a temporary
repository, a committed symlink `reviews/releases/escape.md` → `../../AGENTS.md`
— recorded by Git at mode `120000`, confirmed via `git ls-tree` — was accepted
by the trusted checker, which printed `Role path boundary passed: trusted base
policy allows claude-review to write all 2 changed path(s)` and **exited 0**.
Reproduced twice with identical output in independent probe repositories; both
were deleted.

Kept Minor: planting the link does not itself alter the prohibited target, and
harm requires a later write by trusted tooling that follows it.
`scripts/foundation/verify.mjs:49-60` already rejects non-regular files, but
only for the seven `REQUIRED_OPERATING_PATHS`, so a symlinked review report is
not caught there either.

**Repair for Codex:** enumerate modes (for example
`git diff --raw <base>...HEAD`) and reject any non-`100644`/`100755` entry from
a restricted role, with a regression.

#### R4-M-2 — The distinct-account A/B rule is prose-only and would survive its own deletion

**Owner:** Codex. **Criterion:** 6 (does not block it).

`docs/product/master-plan.md:1235,1252` fix accounts A and B, and
`docs/runbooks/claude-environments.md:164-196` states the rule correctly. But
`scripts/foundation/operating-model.mjs:32-103` pins no account-identity snippet
in `REQUIRED_DOC_SNIPPETS` and forbids no substitution phrase in
`FORBIDDEN_DOC_SNIPPETS`, and `operating-policy.json` has no identity field. So
`pnpm verify` stays green if the rule is silently dropped or re-weakened to
"a separate session is sufficient".

This is not hypothetical: `docs/runbooks/current-work.md:62` records that a
Claude session asserted exactly that weaker rule and Codex had to correct it,
and `research/packets/SBLA-002-claude-research-readiness-handoff.md:34-39`
confirms the correction. Given
`scripts/foundation/operating-model.mjs:27-31`'s stated purpose — load-bearing
rules must "fail closed when a rule is silently dropped" — this rule qualifies
and is unprotected.

#### R4-M-3 — The extraction overstates its own method as "direct quotation"

**Owner:** Claude Research (account A). **Criterion:** 5 (does not block it).

`research/extractions/SBLA-002-readiness.md:91-92` states that facts F1–F7 are
each "a direct quotation with a line locator". F4–F7 are effectively verbatim,
but F1–F3 are faithful renderings of metadata field lines, not quotations: L1 is
`Title: SBLA Claude Research Readiness Fixture` while F1 reads "The fixture is
titled …". Entailment is unaffected and no fact exceeds its source, so this
changes no result; it is recorded because criterion 5 tests whether the
extraction describes itself honestly. "Faithfully rendered from" would be exact.

#### R4-M-4 — The handoff still describes the pre-R3 checker design

**Owner:** Codex. **Criterion:** none (recorded for completeness).

`reviews/releases/SBLA-002-handoff.md:78-80` calls `role-paths.mjs` a "canonical
path validator **sourced from the structured policy**", which is the design
R3-I-2 rejected. After repair, `scripts/foundation/role-paths.mjs:10-14` holds a
frozen literal and the CLI loads the policy from the trusted base. The same
handoff describes the repaired model correctly at lines `173-177`, so the file
contradicts itself mildly on a resolved point.

### Conditions for acceptance

SBLA-002 may be accepted when all of the following hold, verified by an
independent reviewer on a new exact candidate:

- R4-I-1 repaired: the builder handoff agrees with the environment record and
  the ledger about the state of the §18 gate.
- R4-I-2 repaired: append-only review and the prohibition on writing the
  artifact under review are enforced by the boundary gate, with a regression.
- Both Claude role simulations remain complete and correctly recorded, with
  account-B readiness filled into
  `docs/runbooks/claude-environments.md` and the gate status updated.
- `pnpm verify` green on Node `24.20.0` / pnpm `11.24.0`.
- The trusted `check-role-paths.mjs` run against this worktree exits 0 for one
  `reviews/` path.
- No unresolved blocking finding remains.

R4-M-1 through R4-M-4 should be repaired but do not individually block
acceptance.

### Account-B environment record (§13.9 fields)

| Field                  | Value                                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Environment type       | Repository-capable Claude Code session with its own local Git worktree and shell                                                                                                                |
| Git remote             | None configured; the repository is local-only. Nothing was fetched, pushed, or published                                                                                                        |
| Credential method      | No Git remote credentials exist, were used, or were exposed. No secret, key, or token was read or written                                                                                       |
| Source-transfer method | Direct local filesystem access, plus the CC0 fixture supplied inline in the dispatch packet                                                                                                     |
| Allowed directories    | `reviews/` only, per `docs/runbooks/operating-policy.json:20`                                                                                                                                   |
| Readiness result       | Complete pending Codex's trusted boundary check: preconditions verified, one permitted file created, diff produced, standalone handoff written, committed on `claude-review/SBLA-002-readiness` |
| Fallback status        | Not required. The chat-only bundle fallback (`docs/runbooks/claude-environments.md:129-151`) was not used and remains undemonstrated                                                            |

Additional environment facts worth recording: the host default Node is
`v26.0.0`, which the repository's `engineStrict` contract correctly rejects; the
pinned `v24.20.0` was obtained and checksum-verified locally. Write access to
the repository path had to be granted to this session before the report could be
created; reads were unrestricted throughout.

### Final commit and worktree state

- Branch: `claude-review/SBLA-002-readiness`.
- Parent of the report commit: `107c44504438398934d56755b51cff3437b7e0f9`.
- Sole file in the commit: `reviews/releases/SBLA-002-r4.md`.
- The report commit's own SHA cannot be embedded in the object it names; it is
  returned in this run's result and is to be recorded by Codex when it closes
  the account-B claim.
- The worktree was clean before writing, and contained only this new file
  before committing. Post-commit clean status is confirmed in the returned
  result.

This report is immutable. A further round creates
`reviews/releases/SBLA-002-r5.md` and never edits this file.
