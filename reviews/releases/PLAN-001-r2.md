# Review: PLAN-001 Round 2 — Complete-artifact recheck (Account-B acceptance)

## Review identity and scope

| Field                      | Value                                                           |
| -------------------------- | --------------------------------------------------------------- |
| Task                       | PLAN-001 — Execution quality correction                         |
| Round                      | R2 (single complete-artifact recheck required by the stop rule) |
| Reviewer role              | Claude Review, Team account B (independent adversarial audit)   |
| Reviewed commit            | `bb1218bd06b6c9fd1acbf924cc96049aec34a4d0`                      |
| Failed Round 1 candidate   | `86627faaa5e53fe1f2c741eb0aa3966a3a97c8c9`                      |
| Base commit                | `f674fb70e6f30f2f6bf979766e46c4b6e98483b2`                      |
| Remediation implementation | `cc5b38c7c389f039a09e0e9d591bb34f5cd46b29`                      |
| Review branch              | `claude-review/PLAN-001-r2`                                     |
| Review worktree            | `.worktrees/plan-001-claude-review-r2`                          |
| Handoff under review       | `reviews/releases/PLAN-001-remediation-handoff.md`              |
| Report path (claimed)      | `reviews/releases/PLAN-001-r2.md`                               |
| Review date                | 2026-09-05                                                      |

`git rev-parse HEAD` in the review worktree returns
`bb1218bd06b6c9fd1acbf924cc96049aec34a4d0`, and `git status --porcelain=v1` was
empty at review start, so this recheck was performed against the exact assigned
artifact with no local modification.

The exact-path claim was verified before writing. The Codex coordination branch
`codex/execution-quality-correction` at `09081d9dac34634db395926065bda73f2dc685ce`
records an active claim for task "PLAN-001 review R2", role "Claude Review
(account B)", branch `claude-review/PLAN-001-r2`, worktree
`.worktrees/plan-001-claude-review-r2`, base commit
`bb1218bd06b6c9fd1acbf924cc96049aec34a4d0`, expected handoff and paths owned
`reviews/releases/PLAN-001-r2.md`. The reviewed artifact commit itself carries an
empty active-claims table, which is the isolation described by
`operating-policy.json` (`lifecycle.claimRecordLocation:
codex-coordination-branch`); the only difference between `bb1218b` and the
coordination tip is that ledger row (1 file, +3/−2).

`test -e reviews/releases/PLAN-001-r2.md` returned absent before authoring, so
the append-only convention is respected. This report creates exactly one new
file. No artifact under review was repaired, and no other path was modified.

## Round 1 inputs read in full

- `reviews/releases/PLAN-001-r1.md` — the immutable Round 1 report (FAIL: zero
  Critical, one Important I-1, eight Minor M-1 … M-8)
- `reviews/releases/PLAN-001-remediation-handoff.md` — the remediation handoff
- `reviews/releases/PLAN-001-handoff.md` — the original builder handoff, for the
  five reviewer questions and the original acceptance criteria

### Round 1 report immutability — verified

The remediation was required to preserve the failed review report byte for byte.
It did.

| Check                                                                                                            | Result                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Blob id of `reviews/releases/PLAN-001-r1.md` at `902a97c`, `91f34c8`, `238d305`, `cc5b38c`, `63ace9b`, `bb1218b` | `863da935a174432310510f6e9771467cf1879d94` at all six — identical                           |
| `git log 902a97c..bb1218b -- reviews/releases/PLAN-001-r1.md`                                                    | Empty — never modified after introduction                                                   |
| Working-tree line/byte/SHA-256                                                                                   | 539 lines, 35,191 bytes, `2171e965ded4b9021be5ef2031d4ca6cf788eb22bbf1c99d4c54ba48e1fc06aa` |
| Identity recorded in the remediation handoff                                                                     | 539 lines, 35,191 bytes, `2171e965…6aa` — exact match                                       |

## Environment

| Item                             | Observed                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Host                             | macOS (darwin 25.6.0), sandboxed review session                                    |
| Node.js available                | `v26.0.0` — **not** the pinned `v24.20.0`                                          |
| pnpm                             | Not usable; aborted with `EPERM … _tmp_*`                                          |
| Pinned runtime declared          | `.nvmrc`/`.node-version` `24.20.0`; `packageManager` `pnpm@11.24.0`                |
| `node_modules/` in this worktree | Absent                                                                             |
| Shell write access to worktree   | **Denied.** `touch reviews/releases/.write-test-$$` → `Operation not permitted`    |
| Editor write access to worktree  | **Permitted.** This report was written directly to the claimed path                |
| Git index operations             | **Denied.** `git add` → `Unable to create '…/index.lock': Operation not permitted` |

### Environment limitation, and what it did _not_ prevent this round

As in Round 1, this sandbox denies shell writes and Git index operations inside
the review worktree, so this report is present but **untracked**; Codex must
commit it to close the review claim.

Unlike Round 1, dependency-backed checks _were_ possible. The builder worktree
`.worktrees/sbla-execution-quality-correction` carries an installed
`node_modules` (Prettier 3.9.6, ESLint, Vitest 4.1.11, Astro, Playwright). I
used those binaries read-only against a **byte-identical scratch copy** of the
candidate (created from `git ls-files`/`tar`, with SHA-256 equality confirmed for
every load-bearing file before running anything). That let me independently
execute most of `pnpm verify` rather than resting on the builder's record.

Everything below is therefore either (a) a read-only Git or filesystem
observation, (b) an execution of the repository's own code under **Node 26, not
the pinned Node 24.20.0**, or (c) explicitly listed under "What I did not
verify". Nothing here claims a pinned-runtime result that this session did not
run.

## Commands run and real results

| #   | Command                                                                            | Result                                                                   |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | `git rev-parse HEAD`                                                               | `bb1218bd06b6c9fd1acbf924cc96049aec34a4d0` — matches the assigned commit |
| 2   | `git status --porcelain=v1`                                                        | Empty at start and after authoring except this one untracked report      |
| 3   | `git merge-base --is-ancestor f674fb7 86627fa` / `86627fa bb1218b`                 | Both true — linear base → failed candidate → recheck candidate           |
| 4   | `git diff --stat 86627fa bb1218b`                                                  | 13 files, +859/−58                                                       |
| 5   | `git diff --stat f674fb7 bb1218b`                                                  | 15 files, +1394/−26                                                      |
| 6   | `git diff --check` on both ranges                                                  | Clean, exit 0 — **M-8 closed**                                           |
| 7   | `git diff f674fb7 bb1218b \| grep '^-'`                                            | 26 removed content lines; all enumerated and adjudicated below           |
| 8   | `node scripts/foundation/verify.mjs` (worktree, Node 26)                           | `Foundation contract passed at …/plan-001-claude-review-r2/`, exit 0     |
| 9   | 60-scenario drift probe against `validateOperatingModel` on the **real** documents | 60/60 behaved as expected; detail below                                  |
| 10  | `prettier --check reviews/releases/PLAN-001-r1.md` with the repo config            | **Fails** — the exemption is load-bearing                                |
| 11  | `prettier --check .` with the repo config and the candidate `.prettierignore`      | `All matched files use Prettier code style!`                             |
| 12  | `eslint . --max-warnings 0`                                                        | exit 0                                                                   |
| 13  | `astro check`                                                                      | `Result (37 files): 0 errors, 0 warnings, 0 hints`, exit 0               |
| 14  | `vitest run` (unit)                                                                | **7 files, 49 passed (49)**                                              |
| 15  | RED replay: pre-remediation validator + post-remediation tests                     | **15 tests, 4 failed / 11 passed** — exactly the recorded RED            |
| 16  | GREEN replay: restore validator                                                    | **15 passed (15)**                                                       |
| 17  | `validate:content`, `validate:graph`, `evidence:status`                            | All exit 0 (foundation mode; 0 records/nodes/sources)                    |
| 18  | `astro build`                                                                      | exit 0, 1 page built                                                     |
| 19  | `vitest run --config vitest.portability.config`                                    | **3 files, 17 passed (17)**                                              |
| 20  | `playwright test`                                                                  | **Blocked by the sandbox** — browser could not launch; see limitations   |
| 21  | `git rev-parse codex/SBLA-004-asset-license-inventory`                             | `01ffe0aa007b9bf4172881bb0b823bc08f517e09` — matches the new locator     |
| 22  | `git merge-base codex/SBLA-004-… f674fb7`                                          | `0df3e9d7c20c8401004ef0a82177471f2a0c65cf` — matches the new locator     |
| 23  | `git merge-base --is-ancestor f674fb7 codex/SBLA-004-…`                            | False — the stale branch is still not descended from accepted main       |
| 24  | `test -e reviews/releases/PLAN-001-r2.md`                                          | Absent before this report                                                |

## I-1 — re-verification by executed drift probes

Round 1's Important finding was two defects in one: the validator did not read
`docs/product/master-plan.md` or `docs/adr/0006-…md` at all, and the design and
handoff asserted a drift guarantee the implementation did not provide. Both
halves were rechecked.

### What the candidate now enforces

`scripts/foundation/verify.mjs` is **unchanged** across the whole range
(`git diff f674fb7 bb1218b -- scripts/foundation/verify.mjs` is empty). It
already collected contents for the union of `REQUIRED_OPERATING_PATHS`,
`REQUIRED_DOC_SNIPPETS` keys and `FORBIDDEN_DOC_SNIPPETS` keys, so adding the two
paths to `operating-model.mjs` is sufficient to make them genuinely read. The
candidate adds `docs/product/master-plan.md` and
`docs/adr/0006-execution-quality-and-validation-gates.md` to
`REQUIRED_OPERATING_PATHS`, gives each six load-bearing sentinels, adds five more
to `AGENTS.md` and six to `CLAUDE.md`, and strengthens
`qualityControl.overallPercentAllowedAfter` to
`SBLA-017-observed-throughput-and-owner-approved-estimate`.

### Drift probe method

I imported the reviewed `operating-model.mjs` directly and fed it the **real**
candidate documents — not the unit-test fixture — then mutated one input per
scenario. This is the same pure function `pnpm verify` reaches through
`verify.mjs`. Sixty scenarios ran; all sixty behaved as expected.

| Group                                                                                                                                                                            | Scenarios | Result                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| A — baseline, unmutated real documents                                                                                                                                           | 1         | Accepted (no issues)                                                                                                                   |
| B — remove each of the 41 load-bearing sentinels, one at a time, across `AGENTS.md`, `CLAUDE.md`, `master-plan.md`, ADR 0006                                                     | 41        | **All 41 rejected.** Every sentinel was also confirmed genuinely present in the real document (each removal actually changed the file) |
| C — semantic weakening: `zero unresolved Critical and Important findings` → `zero unresolved Critical findings`, all other sentinels intact, in each of the four prose contracts | 4         | **All 4 rejected**                                                                                                                     |
| D — structured policy drift across every `qualityControl` field, plus key deletion and block deletion                                                                            | 11        | **All 11 rejected**, including reverting the token to the old `SBLA-017-observed-throughput`                                           |
| E — remove `master-plan.md` / ADR 0006 from the operating paths                                                                                                                  | 2         | **Both rejected** (`missing required operating path: …`)                                                                               |
| F — adversarial: keep every sentinel, **append** a contradicting amendment to `AGENTS.md`                                                                                        | 1         | Accepted — the disclosed limitation, see M-10                                                                                          |

Group C is the decisive one. Round 1's scenario D — a materially weakened
`AGENTS.md` pass threshold that left `pnpm verify` green — is now **rejected**,
and rejected identically in `CLAUDE.md`, the canonical master plan, and ADR 0006,
neither of which the validator previously read at all. `node
scripts/foundation/verify.mjs` is green against the unmutated real documents.

The enforcement also fails **closed** rather than open: because sentinels are
literal substrings matched against whole-file content, any future edit that
rewraps or rewords a load-bearing sentence breaks the build loudly instead of
passing silently. `proseWrap` is left at Prettier's default `preserve`, so
Prettier itself will not rewrap these lines.

### The overstated-claim half

The design's Verification section previously read "The master plan, repository
instructions, Claude instructions, ADR, and policy must state the same
thresholds. `pnpm verify` must reject drift." It now reads that the required
load-bearing threshold sentences "are all inputs to that validator", that
`pnpm verify` "must reject removal or contradiction of those sentinels", and that
"independent review still judges semantic changes that retain the exact words
while altering their context." The remediation handoff's Known uncertainties
states the same limit.

That description is exactly what probes B, C and F measured: removal and direct
contradiction are caught; a sentinel-preserving semantic change is not. The
record no longer asserts a property the implementation lacks.

**I-1 is closed.** It is closed by executed probes against the real documents,
not by prose assertion — which is itself the first acceptance criterion of the
remediation handoff.

## M-1 through M-8 — verification

| #   | Round 1 finding                                                                           | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M-1 | `CLAUDE.md` stop rule lacked "milestone acceptance" scoping and the claim-level carve-out | **Closed** | `CLAUDE.md:57` now reads "one independent **milestone** acceptance review"; `:64` adds "This stop rule does not reduce claim-level review, the random release audit, or any second pass that the master plan explicitly requires for high-impact comparative claims." Both are enforced sentinels (`one independent milestone acceptance review`, `claim-level review`); probes B23 and B27 confirm removal is rejected                                        |
| M-2 | `CLAUDE.md` omitted the risk-triggered pre-review rule                                    | **Closed** | `CLAUDE.md:60` — "An additional internal pre-review requires a named material risk that this required reviewer cannot reasonably cover." Enforced sentinel `named material risk` (probe B26)                                                                                                                                                                                                                                                                   |
| M-3 | Minor-deferral condition existed only in the design                                       | **Closed** | `their impact and follow-up destination are recorded` appears exactly once in each of `AGENTS.md`, `CLAUDE.md`, `master-plan.md` and ADR 0006, and is an enforced sentinel in all four (probes B11, B25, B32, B38)                                                                                                                                                                                                                                             |
| M-4 | `overallPercentAllowedAfter` encoded only half its prose condition                        | **Closed** | Token is now `SBLA-017-observed-throughput-and-owner-approved-estimate`; the master plan requires `SBLA-017 measures vertical-slice throughput` **and** `owner approves the revised effort estimate`, ADR 0006 `SBLA-017 records observed throughput` **and** `approves the revised estimate` — all enforced. Probe D rejects the old weaker token                                                                                                             |
| M-5 | New SBLA-012 participant gate had no recruitment-failure path                             | **Closed** | Failure branch added in three places — design "Failure handling", ADR 0006 Consequences, master plan §13.7 — each stating SBLA-012 is marked blocked and returned to the owner, and that "a smaller convenience check may inform design but does not satisfy the gate" without a new owner-approved ADR. Plan Task 6 carries the same checkbox. The gate is not weakened                                                                                       |
| M-6 | SBLA-004 direction had no repository locator and the ledger had no SBLA-004 record        | **Closed** | Design and plan Task 6 now name branch `codex/SBLA-004-asset-license-inventory`, worktree `.worktrees/sbla-004-asset-license-inventory`, tip `01ffe0aa…f517e09`, fork point `0df3e9d7…1f2a0c65cf`, and the on-branch handoff. A recovery-log row records the branch as preserved input. **Every locator independently verified** (commands 21–23); the worktree exists in `git worktree list` and `reviews/releases/SBLA-004-handoff.md` exists on that branch |
| M-7 | "owner-approved 2026-09-05" stamped on a paraphrased instruction                          | **Closed** | Both master-plan headings now read "owner-approved **direction** 2026-09-05", matching the design's own scoping. The design's Approval record now quotes the owner verbatim rather than paraphrasing, and still states the change "requires the normal independent review before integration". ADR 0006 remains `Proposed`                                                                                                                                     |
| M-8 | `git diff --check` not clean across the reviewed range                                    | **Closed** | The two Markdown hard-break spaces at design lines 3–4 were replaced with blank lines. `git diff --check` is clean and exits 0 over **both** `f674fb7..bb1218b` and `86627fa..bb1218b`                                                                                                                                                                                                                                                                         |

All eight are genuinely closed, not silently dropped. The remediation handoff
records each closure, and the ledger's closed-claim row states "I-1 and related
M-1–M-8 are repaired".

## The single-file Prettier exemption — inspected

The remediation added two lines to `.prettierignore`:

```
# Immutable Account-B report preserved at its reviewer-authored checksum.
reviews/releases/PLAN-001-r1.md
```

| Question                           | Finding                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Is it exactly one file?            | **Yes.** The entry is a literal path with no glob metacharacter (`*`, `?`, `[`, `]`, `!`). It matches exactly one file                                                                                                                                        |
| Are other review reports exempted? | **No.** The other 16 Markdown files under `reviews/releases/` — 11 of them prior review reports — remain subject to Prettier, and the `reviews/` directory is not exempted. The handoff's claim "No other review report or directory is exempted" is accurate |
| Is the exemption necessary?        | **Yes.** `prettier --check reviews/releases/PLAN-001-r1.md` with the repository's own `.prettierrc.mjs` reports "Code style issues found". (Under `--no-config` it passes, so the need comes from the repository config, not from Markdown defaults)          |
| Is it the minimal fix?             | **Yes.** The alternative is editing an append-only external artifact, which the constraints forbid. With the exemption in place, `prettier --check .` over the whole candidate reports "All matched files use Prettier code style!"                           |
| Does it weaken a gate?             | **No.** The format gate still covers every other file. I ran Prettier over all 16 remaining Markdown files under `reviews/releases/`: 16 pass, 0 fail, none modified                                                                                          |
| Precedent                          | `docs/product/master-plan.md` was already exempt at the base commit `f674fb7`, so a narrow path-level exemption is an existing, not a new, pattern                                                                                                            |

I also confirmed that no prior review report was ever silently reformatted:
`SBLA-002-r5.md` (518/37,711/`c974e5d8…`), `SBLA-003-r1.md`
(908/68,419/`51a2a470…`) and `SBLA-003-r2.md` (761/49,882/`04ed3eae…`) all still
match the line/byte/SHA-256 identities recorded in the recovery log.

One residual observation is recorded as M-11: the recorded checksum lives only in
handoff prose; nothing in `pnpm verify` or CI enforces it.

## Removed lines — no gate erosion

`git diff f674fb7 bb1218b` removes 26 content lines. All are accounted for and
none removes a gate:

1. `AGENTS.md` "Every milestone ends with a clean, tested commit and a reviewer
   report." → replaced by "…and its required independent reviewer report."
   Strictly stronger.
2. Seven `docs/adr/README.md` index rows re-emitted at a wider column width.
   ADRs 0001–0005 all retain `Accepted`; ADR 0006 is added at `Proposed`.
3. The `SBLA-012` §18 row, replaced by a superset. The original verification
   text `pnpm test:a11y && pnpm test:visual && pnpm verify` survives verbatim,
   and so does the `owner approves direction` clause.
4. Sixteen `docs/runbooks/current-work.md` recovery-log lines — the table header,
   separator and 14 data rows — re-emitted at a wider column width. **All 14
   historical rows survive**, and two new rows are appended (the PLAN-001 R1
   report identity, and the SBLA-004 preservation record).
5. One test declaration was **renamed**, not deleted: the case formerly named
   for SBLA-002 operating artifacts is now
   `requires every load-bearing operating artifact`. Its assertions are
   extended, not reduced.

The master plan changed in only two hunks across the full range (the §13.7 stop
rule / progress protocol block, and the SBLA-012 §18 row). Spot checks confirm
the gates the correction could plausibly have eroded are byte-unchanged at
`bb1218b`: §12.4's "additional randomly selected 10% plus every high-impact
comparative claim … with zero unsupported claims", §19's "UX usefulness — ≥85%
completion for defined find/understand/verify/share beta tasks", and §7.5/§12's
"zero unresolved applicable Level A or AA success-criterion failures".
`AGENTS.md` retains "Never discard another agent's work" and the ledger retains
"Never delete unmerged work."

## Verification of the builder's recorded evidence

Round 1 could not run these. This round could, on a byte-identical copy under
Node 26.

| Handoff claim                                                      | Independent result                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Focused RED … 15 tests, 11 passed and 4 failed"                   | **Reproduced exactly.** Restoring the `86627fa` validator under the candidate's tests yields `Tests 4 failed \| 11 passed (15)`. The four are `requires every load-bearing operating artifact`, `accepts a complete operating-model fixture`, `enforces the one-review stop rule and evidence-based progress reporting`, and `rejects pass-threshold drift in every canonical prose contract` |
| "Focused GREEN: 15/15"                                             | **Reproduced** — `Tests 15 passed (15)`                                                                                                                                                                                                                                                                                                                                                       |
| "49/49 unit tests"                                                 | **Reproduced** — `Test Files 7 passed (7) / Tests 49 passed (49)`. `pnpm test` is `vitest run tests/unit`, so 49 is the right denominator                                                                                                                                                                                                                                                     |
| "17/17 portability tests"                                          | **Reproduced** — `Test Files 3 passed (3) / Tests 17 passed (17)`. The static count is 15 `it(` plus one `it.each` of two cases                                                                                                                                                                                                                                                               |
| "Astro check (37 files, zero issues)"                              | **Reproduced** — `Result (37 files): 0 errors, 0 warnings, 0 hints`                                                                                                                                                                                                                                                                                                                           |
| "formatting"                                                       | **Reproduced** — `prettier --check .` clean with the candidate `.prettierignore`                                                                                                                                                                                                                                                                                                              |
| "lint"                                                             | **Reproduced** — `eslint . --max-warnings 0` exit 0                                                                                                                                                                                                                                                                                                                                           |
| "content/graph/evidence foundation gates"                          | **Reproduced** — all three exit 0                                                                                                                                                                                                                                                                                                                                                             |
| "production build"                                                 | **Reproduced** — `astro build` exit 0, 1 page                                                                                                                                                                                                                                                                                                                                                 |
| "Foundation contract"                                              | **Reproduced** green both in the worktree and in the copy                                                                                                                                                                                                                                                                                                                                     |
| "`pnpm test:e2e`: PASS — 1/1 Chromium JavaScript-disabled journey" | **Not reproduced** — browser launch blocked by the sandbox. Substance corroborated indirectly: the built `dist/index.html` contains `<h1 id="page-title">Science-Based Lifting Atlas</h1>` and the string `Evidence-first resistance training anatomy` (the spec's two assertions) and contains **zero** `<script>` tags, so a JavaScript-disabled browser sees the asserted content          |
| "Pinned runtime: Node v24.20.0, pnpm 11.24.0"                      | **Not verified** — this session ran Node 26                                                                                                                                                                                                                                                                                                                                                   |

The `pnpm verify` chain is `format:check && lint && typecheck && test &&
validate:content && validate:graph && evidence:status && build &&
test:portability && verify:foundation`. Every leg was independently reproduced
green except under an unpinned runtime. CI (`.github/workflows/ci.yml`) runs
`pnpm install --frozen-lockfile`, `pnpm verify` and `pnpm test:e2e` on
`pnpm@11.24.0` / `node@24.20.0`, so `verify:foundation` — and therefore the new
drift enforcement — is a blocking CI gate.

## Reviewer questions

### Q1 — Does the correction preserve every substantive product, evidence, and release gate? **PASS**

All 26 removed lines are adjudicated above; none removes a gate. The remediation
only strengthened requirements: the Minor-deferral permission gained a condition,
`CLAUDE.md` gained an explicit carve-out preserving claim-level review, the
random release audit and the high-impact second pass, the percentage boundary
gained owner approval, and SBLA-012 gained an explicit blocked path that refuses
a smaller convenience sample. ADR 0006 still states "The policy does not reduce
claim-level review, final release audit, owner approval, or any mandatory
scientific, licensing, accessibility, performance, and resilience gate."

Falsification attempt: I looked specifically for a gate weakened _by the
remediation itself_, including the `AGENTS.md` change from "zero unresolved
Critical **or** Important" to "…**and**…". In this construction both phrasings
require zero of each; the change aligns the wording with the other three
contracts and the policy fields `passRequiresZeroCritical` /
`passRequiresZeroImportant`, both still `true` and both still enforced. The
Prettier exemption removes no check from any file but one immutable external
artifact. No gate is removed, weakened, or made conditional.

### Q2 — Does it state one consistent review lifecycle across all human and structured contracts? **PASS**

| Threshold           | `operating-policy.json`                                                                | master plan §13.7                                                                                       | `AGENTS.md`                                                             | `CLAUDE.md`                                                                          | ADR 0006                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Review count        | `defaultIndependentReviewCount: 1`                                                     | "one independent acceptance review"                                                                     | "One independent acceptance review is the default for each milestone"   | "one independent milestone acceptance review"                                        | "one independent acceptance review"                                                       |
| Pass threshold      | `passRequiresZeroCritical`/`Important: true`                                           | "zero unresolved Critical and Important findings"                                                       | same                                                                    | same                                                                                 | same                                                                                      |
| Minor handling      | `minorFindingsMayBeDeferredWhenNonblocking: true`                                      | "only when their impact and follow-up destination are recorded"                                         | same                                                                    | same                                                                                 | same                                                                                      |
| Extra pre-review    | `additionalPreReviewRequiresNamedMaterialRisk: true`                                   | "names a material risk that the required reviewer cannot reasonably cover"                              | same                                                                    | "requires a named material risk that this required reviewer cannot reasonably cover" | "an extra pre-review requires a named material risk"                                      |
| Failed review       | `failedReviewAction: bounded-remediation-then-full-artifact-recheck`                   | "one bounded remediation followed by one complete-artifact recheck"                                     | "open one bounded remediation, then recheck the complete artifact once" | "one bounded remediation is followed by one complete-artifact recheck"               | "one bounded remediation followed by one full-artifact recheck"                           |
| Progress unit       | `progressUnit: accepted-capabilities-and-user-journey-proof`                           | five-fact protocol                                                                                      | five-fact protocol                                                      | _(not that file's scope)_                                                            | same                                                                                      |
| Percentage boundary | `overallPercentAllowedAfter: SBLA-017-observed-throughput-and-owner-approved-estimate` | "before SBLA-017 measures vertical-slice throughput and the owner approves the revised effort estimate" | same                                                                    | _(not stated)_                                                                       | "before SBLA-017 records observed throughput and the owner approves the revised estimate" |

Round 1 found this criterion met on its terms but flagged four precision gaps
(M-1 … M-4). All four are now closed, and — the material change — the agreement is
no longer merely observed by a reviewer but **enforced by the build**: 41 of these
statements are literal sentinels, and probes B and C show every removal or
weakening is rejected. The only residual divergence is cosmetic and recorded as
M-9 ("full-artifact" in ADR 0006 and the policy token versus "complete-artifact"
in the other three contracts).

### Q3 — Does it prevent misleading progress reporting without hiding queue status? **PASS**

Unchanged in substance from Round 1, and now stronger. The protocol still
prohibits exactly one thing — a single overall product-completion percentage —
and still _requires_ reporting accepted §18 queue gates, the demonstrated state
of the central user journey, current shippable capability, blockers and the next
proof. The master plan retains "queue counts are process progress, not a proxy
for delivered product value."

The boundary is now anchored to both halves of its condition in every contract:
SBLA-017 must measure/record observed throughput **and** the owner must approve
the revised estimate, with the structured token strengthened to match. Probe D
rejects the old half-condition token. The remediation handoff also reports
honestly against this protocol: "PLAN-001 still creates no user-facing product
capability. The central journey remains 0/1 demonstrated."

### Q4 — Does SBLA-012 add useful early validation without replacing the later beta gate? **PASS**

The later gate is intact and untouched at `bb1218b`: §19's "UX usefulness — ≥85%
completion for defined find/understand/verify/share beta tasks; no critical
journey blocker" with evidence artifact "Anonymized beta task report with scripts
and results", Phase 6.5, and §17 Gate E. The SBLA-012 clause remains labelled
formative.

The Round 1 executability risk (M-5) is closed without weakening the gate, which
was the correct direction: recruitment failure marks SBLA-012 **blocked** and
returns the decision to the owner, and a smaller convenience sample explicitly
does **not** satisfy it absent a new owner-approved ADR. Falsification attempt: I
checked whether the new blocked path could be used to bypass SBLA-012 silently.
It cannot — all three statements route to the owner, and the §19 threshold is
unchanged and separately evidenced.

### Q5 — Is the SBLA-004 reconciliation direction executable and non-destructive? **PASS**

Every factual claim in the strengthened direction was independently verified:
tip `01ffe0aa007b9bf4172881bb0b823bc08f517e09` matches, merge-base with accepted
main is `0df3e9d7c20c8401004ef0a82177471f2a0c65cf` as stated, `f674fb7` is not an
ancestor of the branch, the worktree exists, and
`reviews/releases/SBLA-004-handoff.md` exists on that branch.

Non-destructive: the design now calls the commits "preserved inputs", the plan
lists them under "**Preserved inputs:**", the new recovery-log row records "Keep
all unmerged commits/worktree intact", and no instruction anywhere directs
deletion of the branch, worktree or commits. `AGENTS.md` retains "Never discard
another agent's work"; the ledger retains "Never delete unmerged work."

Executable: plan Task 6 sequences a new branch from the accepted main commit
after acceptance and bounds the port. M-6's locator gap is closed, so the
direction is now discoverable from the repository alone without reading history.

## Findings

### Critical — none

No finding in this round violates a §2.2 prohibition, weakens a mandatory §12.4
or §19 gate, or would cause an unsupported claim, unlicensed asset, or
accessibility regression to reach publication.

### Important — none

Round 1's I-1 is closed, verified by 60 executed drift probes against the real
documents rather than by prose assertion. No new Important finding was
identified. Specifically, I attempted and failed to find: a gate weakened by the
remediation, a contract pair that now disagrees, a sentinel absent from the real
document it claims to guard, an inaccurate SBLA-004 locator, a lost recovery-log
row, a modified Round 1 report, an over-broad Prettier exemption, or an
overstated check in the remediation handoff.

### Minor (nonblocking; recorded for follow-up hardening)

Each records impact and follow-up destination, as the candidate's own deferral
condition now requires.

**M-9 — "full-artifact" and "complete-artifact" are both enforced for the same
concept.** ADR 0006 states "one bounded remediation followed by one
**full**-artifact recheck" and the policy token is
`bounded-remediation-then-full-artifact-recheck`, while `AGENTS.md`, `CLAUDE.md`
and the master plan use "**complete**-artifact recheck". Both wordings are now
hard-coded as distinct required sentinels, so the split is cemented in the
validator rather than merely present in prose. _Impact:_ cosmetic only — the two
adjectives are synonymous here and no contract contradicts another; a future
editor normalising the wording in one file would trip a build failure that looks
like drift. _Follow-up destination:_ a future operating-model hardening task
should pick one adjective, update the four contracts and the policy token
together, and adjust the sentinels in one change.

**M-10 — Sentinel enforcement cannot detect a semantically contradicting
addition.** Probe F: appending "Amendment: Important findings may be deferred at
reviewer discretion; only Critical findings block a PASS." to `AGENTS.md` leaves
every sentinel intact, and `validateOperatingModel` returns no issues. _Impact:_
a contract could be hollowed out by addition rather than edit while `pnpm verify`
stays green. This is **not** an overstatement finding — the design's Verification
section and the handoff's Known uncertainties both state this limit explicitly,
which is precisely why I-1 is closed. _Follow-up destination:_ the same
operating-model hardening task could add `FORBIDDEN_DOC_SNIPPETS` entries for
known weakening phrasings (for example "only Critical findings block"), which
fails closed against the most likely contradiction without attempting semantic
analysis. Independent review remains the designed control.

**M-11 — The exempted report's recorded checksum is not machine-enforced.**
`.prettierignore` now excludes `reviews/releases/PLAN-001-r1.md` from the only
automated check that reads it, and the handoff records its SHA-256, but
`grep -rniE "sha-?256|checksum" scripts/ .github/` returns no enforcement: the
foundation contract requires the `reviews/releases` directory to exist and
nothing more. _Impact:_ low and pre-existing — no review report in this
repository has ever been checksum-gated, and Git history already makes tampering
visible — but the exemption slightly widens the gap for this one file by removing
the incidental formatting check. _Follow-up destination:_ a future task could add
an immutable-artifact manifest (path → SHA-256) validated by
`scripts/foundation/verify.mjs`, which would cover every delivered review report,
not only this one.

## Acceptance criteria

### Remediation handoff criteria

| #   | Criterion                                                                            | Result                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | I-1 is closed by executed drift probes, not prose assertion alone                    | **PASS** — 60 probes against the real documents; Round 1's scenario D now rejected in all four prose contracts                                                                                             |
| 2   | No Critical or Important finding remains                                             | **PASS** — zero Critical, zero Important; three Minor recorded                                                                                                                                             |
| 3   | All five original reviewer questions still PASS                                      | **PASS** — Q1–Q5 all PASS above                                                                                                                                                                            |
| 4   | The pinned `pnpm verify` and `pnpm test:e2e` evidence is internally consistent       | **PASS** — every claim reproduced under Node 26 except the browser leg, including the exact RED shape (4 failed / 11 passed of 15). Pinned-runtime execution itself remains unverified and is listed below |
| 5   | ADR 0006 remains Proposed until this recheck passes and owner acceptance is recorded | **PASS** — `docs/adr/0006-…md:3` reads `- Status: Proposed`; `docs/adr/README.md:26` lists `Proposed`; no owner-acceptance commit exists in the range                                                      |

### Original PLAN-001 handoff criteria

| #   | Criterion                                                                                                                       | Result                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | All five review questions PASS with zero unresolved Critical or Important findings                                              | **PASS** — the criterion that failed in Round 1 now passes                                                                                                                              |
| 2   | Structured policy and prose agree on review count, pass threshold, remediation behavior, progress unit, and percentage boundary | **PASS** — verified field by field and now machine-enforced                                                                                                                             |
| 3   | `pnpm verify` and `pnpm test:e2e` pass under the pinned runtime                                                                 | **NOT VERIFIED (not counted against the artifact)** — every `pnpm verify` leg was reproduced green under Node 26; the pinned runtime and the Playwright leg were blocked by the sandbox |
| 4   | ADR 0006 remains Proposed until the review report is integrated and owner acceptance is recorded                                | **PASS**                                                                                                                                                                                |
| 5   | The accepted next task begins from main, not the stale SBLA-004 branch                                                          | **PASS** — plan Task 6 directs a new branch from accepted main; locators verified; branch preserved                                                                                     |

## Reviewer-question summary

| Question                                                              | Round 1 | Round 2  |
| --------------------------------------------------------------------- | ------- | -------- |
| Q1 Preserves every substantive product/evidence/release gate          | PASS    | **PASS** |
| Q2 States one consistent review lifecycle across all contracts        | PASS    | **PASS** |
| Q3 Prevents misleading progress reporting without hiding queue status | PASS    | **PASS** |
| Q4 Adds useful early validation without replacing the later beta gate | PASS    | **PASS** |
| Q5 Executable, non-destructive SBLA-004 reconciliation direction      | PASS    | **PASS** |

## What I did not verify

1. **The pinned runtime.** Every executed check ran on Node `v26.0.0`, not the
   pinned `v24.20.0`, and `pnpm` itself never ran. I used the builder worktree's
   installed binaries against a byte-identical copy. CI enforces the pinned
   runtime on push and pull request.
2. **`pnpm test:e2e`.** Chromium could not launch in this sandbox. The launch
   aborts inside Chromium's Mach port rendezvous with
   `Permission denied (1100)` — a macOS restriction — before any test assertion
   runs. This is an environment failure, **not** an artifact failure, and I do
   not record it as a finding. The spec's two assertions were instead confirmed
   against the built `dist/index.html`, which also contains no `<script>` tags.
3. **Whether the owner's quoted 2026-09-05 instruction is faithfully
   transcribed.** The design now quotes it verbatim rather than paraphrasing,
   which is what M-7 asked for, but no independent record of the owner's words
   exists in the repository, so I can attest only that the quotation is present
   and that the canonical labels were correctly narrowed to "owner-approved
   direction".
4. **The substance of the stale SBLA-004 work** beyond topology, locators and
   file inventory. SBLA-004 is a separate task with its own future review.
5. **Semantic preservation of prose surrounding the sentinels** by machine. That
   is M-10's disclosed limit and is, by design, this review's job rather than the
   validator's; I read the four contracts in full and found no contradiction.

## Verdict

**PASS** — zero Critical findings and zero Important findings.

Round 1's single blocking defect, I-1, is genuinely closed. The canonical master
plan and ADR 0006 are now read by the validator, 41 load-bearing sentences across
the four prose contracts are enforced as literal sentinels, the structured policy
token was strengthened to carry both halves of its condition, and the exact
mutation that made Round 1 fail — a weakened `AGENTS.md` pass threshold that left
`pnpm verify` green — is now rejected, as is the same weakening in `CLAUDE.md`,
the master plan and ADR 0006. The design and handoff no longer claim more than
the implementation delivers. All eight Minor findings M-1 … M-8 are closed rather
than silently deferred, and the Round 1 report is preserved byte-for-byte at
539 lines / 35,191 bytes / SHA-256 `2171e965…c06aa`. The single-file Prettier
exemption is exact, necessary, documented, and weakens no gate.

Three new nonblocking Minor findings (M-9, M-10, M-11) are recorded above with
impact and follow-up destination, as the candidate's own deferral condition
requires. They must not be silently closed.

Per the stop rule this candidate establishes, this was the **single
complete-artifact recheck** following one bounded remediation. No further review
layer should be created. The remaining sequence is owner acceptance, after which
ADR 0006 moves from `Proposed` to `Accepted` and SBLA-004 begins from accepted
main.

## Reviewer boundary statement

This session wrote exactly one file, `reviews/releases/PLAN-001-r2.md`, the path
pre-claimed by Codex on the coordination branch at `09081d9`. It repaired
nothing, edited no artifact under review, and modified no other path.
`git status --porcelain` after authoring reports a single untracked entry and
nothing else, and `git diff --stat HEAD` is empty.

All dependency-backed checks ran against a disposable byte-identical copy outside
the repository; the review worktree itself was never written by any tool other
than the one that created this report.

The sandbox denied Git index operations, so this session could not stage or
commit the report:
`git add` fails with `Unable to create '…/worktrees/plan-001-claude-review-r2/index.lock': Operation not permitted`.
The file is present and untracked in the review worktree. Codex must commit it
byte-for-byte to close the review claim and should record the recovery action, as
it did for the comparable Account-B rounds logged on 2026-08-31, 2026-09-02,
2026-09-04 and 2026-09-05. This report's line, byte and SHA-256 identity is
stated in the delivery message accompanying it, in the same form the recovery log
uses for prior rounds.
