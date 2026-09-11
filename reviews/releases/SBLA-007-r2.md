# Handoff: SBLA-007 Review R2 (complete-artifact recheck)

**Task:** SBLA-007 — Evidence schemas and validators
**Reviewer role:** Claude Review (Account B), independent acceptance review, round 2 — complete-artifact
recheck after the Round 1 FAIL and its one bounded Codex remediation.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Sonnet 5, fresh independent
reviewer session; did not author, remediate, or previously review any SBLA-007 candidate).
**Review date:** 2026-09-11
**Reviewer worktree:** `C:\src\s007r2`
**Reviewer branch:** `claude-review/SBLA-007-r2`
**Reviewed candidate commit:** `1e724939c7783e893be962df6d4ddce22f0750bb` _(immutable)_
**Reviewed candidate tree:** `2b99d1387aa314034701657768444743da99a638` _(immutable)_
**R1 reviewed candidate:** `a48981a8c1a8a66b4345251633a841fc4e08df5c`, tree `81de159aa0533b318011ed3eda2ff3dca59da8a5`
**R1 report (carried forward byte-identical into this candidate):** `reviews/releases/SBLA-007-r1.md`,
authored commit `6e299c44c465ff34e81ec4e1c492f9b9274b2289`, SHA-256
`eac91752b2a9fa9665390cda0819d0ee31c94b8844e554f764646991a9a0f261` — independently re-hashed in this
session and confirmed to match the ledger record exactly (see Tests/checks below).
**Remediation implementation commit:** `88853733b83e1b5ad48bb953e21768474394687b`, tree
`38c39ddbb148781caf09e5ab9d4d7851deb0e69e`
**Accepted dependency base:** `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`
**Coordination claim commit:** `e996c002f147ecd50011aa9d4b8da9c56985b8dc` (branch
`codex/SBLA-007-review-coordination`; confirmed **not** an ancestor of the candidate, which is correct —
the claim lives on the coordination branch and the reviewed candidate stays immutable)
**Runtime:** Node.js `v24.20.0`, pnpm `11.24.0` (both confirmed in this session)
**Reviewer write path:** `reviews/releases/SBLA-007-r2.md` (sole permitted path; nothing else was modified)

**Verdict: FAIL.**
**Unresolved Critical: 0 · Unresolved Important: 1 · Minor (non-blocking, with destinations): 9**

Four of R1's five recheck targets are genuinely and cleanly resolved: I-1 (timestamp ordering), I-2
(published change-record review-date currency), M-1 (`constructor` checksum bypass), and M-8 (duplicate
identifier lists) all now fail closed on the exact adversarial inputs R1 used, reproduced fresh in this
session through the real commands. I-3 (certainty-language calibration) is **only partially repaired**:
the specific bypass R1 reported (a calibration token in an unrelated trailing clause) is fixed, but the
same underlying defect — an incidental, non-modal occurrence of the word "may" disabling the entire
categorical-causal gate — survives through ordinary calendar-date phrasing that the remediation's narrow
date guard does not cover (lowercase "may", or "May" not immediately followed by a bare four-digit year,
e.g. "May 3, 2020" or "May, 2020"). I reproduced this end-to-end through the real
`node scripts/graph/validate.mjs` command in isolation: a published, `certainty: "low"` claim making an
unqualified categorical causal statement passes the gate solely because its text happens to mention a
date in May. This is the same class of defect I-3 named, still open, so criterion 3 and criterion 7 of
the acceptance rubric are not met and the review fails.

I also found one new, real regression introduced by the I-3 remediation's specific mechanism (clause
scoping bounded to the text *preceding* the causal verb): a legitimately calibrated statement that places
its hedge *after* the causal verb in the same sentence — "Resistance training increases hypertrophy,
though results may vary." — is now wrongly rejected as `CERTAINTY_OVERSTATED`. This fails closed (blocks
correct content, author can reword) rather than open, so — consistent with how this same review lineage
graded analogous language-gate imprecision in R1 (M-3, M-4) — I grade it Minor (M-11), not Important, and
record it with impact and destination below.

---

## Objective

Recheck the complete SBLA-007 candidate produced by the one bounded Codex remediation that followed the
Round 1 FAIL, per `docs/runbooks/branch-and-worktree.md` and the Round 2 required-reviewer-action section
of `reviews/releases/SBLA-007-handoff.md`. Specifically: reproduce R1 Important findings I-1, I-2, and
I-3 and Minor findings M-1 and M-8 against the repaired code; recheck the complete artifact and the
unchanged acceptance rubric; probe for regressions and bypasses; run the pinned required checks; and
return PASS or FAIL with exact evidence, without repairing the candidate.

## Inputs and exact paths

- Repository worktree: `C:\src\s007r2`, branch `claude-review/SBLA-007-r2`, clean at commit
  `1e724939c7783e893be962df6d4ddce22f0750bb` (tree `2b99d1387aa314034701657768444743da99a638`) before and
  after this review.
- `AGENTS.md`, `CLAUDE.md`, `docs/product/master-plan.md` (complete, both halves), and
  `docs/runbooks/operating-policy.json`, `docs/runbooks/branch-and-worktree.md`,
  `docs/runbooks/claude-environments.md`, `docs/runbooks/handoff-template.md` read in full before acting.
- `reviews/releases/SBLA-007-handoff.md` and `reviews/releases/SBLA-007-r1.md` read in full before acting.
- Accepted dependency base `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`, confirmed an ancestor of the
  candidate (`git merge-base --is-ancestor bbeddc06... HEAD`, exit 0).
- Coordination claim commit `e996c002f147ecd50011aa9d4b8da9c56985b8dc` on
  `codex/SBLA-007-review-coordination`, read via `git show`: the sole active ledger row is `SBLA-007
  review R2 recheck`, role `Claude Review (account B)`, branch `claude-review/SBLA-007-r2`, worktree
  `C:\src\s007r2`, base commit `1e724939c7783e893be962df6d4ddce22f0750bb`, expected handoff
  `reviews/releases/SBLA-007-r2.md`, **paths owned: `reviews/releases/SBLA-007-r2.md` only.** This matches
  the dispatch exactly.
- All adversarial mutation work ran in a disposable directory outside the repository
  (`C:\src\_sbla007-r2-adv`, created via `git archive HEAD`, populated with the candidate's own
  `zod@4.5.2` and `yaml@2.9.0` packages copied from this worktree's `node_modules`, since import
  resolution for the copied `.ts` modules needed them; since removed in full). The candidate worktree
  itself was never written to except by build/test tooling's own transient output, and was verified clean
  before and after.

## Constraints

- Did not repair the candidate. Every finding below is returned to its author (Codex).
- Wrote exactly one file in this repository: this report.
- Did not touch `docs/runbooks/current-work.md` — Codex owns that ledger.
- Did not attempt to execute `scripts/foundation/check-role-paths.mjs` myself as acceptance evidence.
  Per `CLAUDE.md`, "the role-path result must come from Codex or CI executing the checker from a trusted
  checkout against your worktree with `--repository`... Do not treat a checker executed from your mutable
  role branch as independent boundary evidence." That gate is Codex's to run and record; it is outside
  this role's remit and this report does not claim it.
- Did not re-derive R1's full battery of checks for code paths this remediation did not touch. Where the
  diff shows a file/function is unchanged, I rely on the fresh, superset unit-test run (228 tests, up from
  R1's 222) plus targeted spot checks, rather than re-running R1's entire manual reproduction set — see
  "What remains verified" below.

## Work completed

1. **Provenance verification** — confirmed branch, HEAD commit/tree, clean worktree, Node/pnpm versions,
   dependency-base ancestry, and the exact single-row/single-path coordination claim, before any review
   work began (see Tests/checks).
2. **Full diff inspection** — read the complete diff from the R1-reviewed candidate
   (`a48981a8c1a8a66b4345251633a841fc4e08df5c`) to `HEAD`, and separately isolated the remediation's actual
   code diff (`6e299c44c...` → `88853733b...`) from the handoff-only commit (`88853733b...` → `HEAD`, a
   pure 56-line append to `reviews/releases/SBLA-007-handoff.md`, 0 deletions). The remediation touches
   exactly five source/test files: `scripts/graph/validate.mjs`, `src/lib/content/schemas.ts`,
   `src/lib/content/validation.ts`, `tests/unit/content-validation.test.ts`,
   `tests/unit/evidence-schemas.test.ts`. No other file changed. Read both modified source files in full
   (not just diff hunks) to understand complete current behavior.
3. **Reran all four required commands fresh** in this session (not copied from the handoff):
   `pnpm install --frozen-lockfile`, `pnpm verify`, `pnpm test:e2e`, and
   `git diff --check bbeddc06b...HEAD` (plus the narrower remediation-range check). All four passed with
   real, first-party output (see Tests/checks).
4. **Reproduced I-1, I-2, M-1, and M-8 against the repaired code**, both by calling the exact exported
   functions the CLI scripts call (`validateRecord`, `validateRecordGraph`, `lintClaimLanguage` from
   `src/lib/content/schemas.ts` / `validation.ts`) and, for the highest-stakes cases, by writing real
   fixture files into an isolated `git archive` export and running the actual
   `node scripts/content/validate.mjs` / `node scripts/graph/validate.mjs` commands against them. All four
   are now fixed; each reproduction below shows the same input that broke R1 now behaving correctly, with
   a passing control alongside it.
5. **Reproduced I-3 against the repaired code** the same way, using R1's exact original bypass input
   first (now fixed), then adversarially probed the fix's actual mechanism (clause-bounded, prefix-only
   calibration scoping plus a narrow capitalized-month-plus-year strip) with fourteen additional
   statements. This surfaced one confirmed residual bypass of the same defect class (fails open, graded
   as I-3 still unresolved) and one confirmed new false-positive regression (fails closed, graded Minor
   M-11). Both are reproduced through the real `node scripts/graph/validate.mjs` command in isolation, not
   only through direct function calls.
6. **Spot-checked two untouched R1 Minors** (M-3, M-9) to confirm the diff's silence on their code paths
   really means unchanged behavior, rather than assuming it.
7. Cleaned up the entire disposable adversarial directory and reconfirmed the candidate worktree clean at
   the same commit/tree before writing this report.

## Findings

### Important

#### I-3 (carried forward, partially repaired) — a non-canonical date phrasing still disables the categorical-causal gate

**Verdict on R1's exact reproduction: FIXED.** R1's bypass — `"Resistance training increases
pectoralis-major hypertrophy; individual results may vary."` at `certainty: "low"` — now correctly
produces `CERTAINTY_OVERSTATED`. The remediation's mechanism, at
`src/lib/content/validation.ts:197-211`:

```ts
function hasUncalibratedCausalLanguage(statement: string) {
  return [...statement.matchAll(CAUSAL_PATTERN)].some((match) => {
    if (isDirectlyNegated(statement, match.index)) return false;
    const clauseStart = Math.max(
      statement.lastIndexOf('.', match.index - 1),
      statement.lastIndexOf(';', match.index - 1),
      statement.lastIndexOf('!', match.index - 1),
      statement.lastIndexOf('?', match.index - 1),
    );
    const clausePrefix = statement
      .slice(clauseStart + 1, match.index)
      .replace(/\bMay\s+\d{4}\b/g, '')
    return !LOW_CALIBRATION_PATTERN.test(clausePrefix);
  });
}
```

now scopes the `LOW_CALIBRATION_PATTERN` search (`validation.ts:159-160`) to the text strictly *preceding*
each causal-verb match, bounded by the nearest `.;!?`, and specifically strips a capitalized month name
immediately followed by a bare four-digit year so `"In May 2020 the protocol increases strength."` is
also now correctly flagged. Both are covered by the new pinned tests at
`tests/unit/content-validation.test.ts:190-202`.

**But the underlying defect the handoff claims this closes — "a calendar expression such as `May 2020` is
not treated as modal calibration" — is not actually closed in general.** The strip regex
`\bMay\s+\d{4}\b` requires an exact capital `M`, a single run of whitespace, and a bare four-digit year
immediately after. Any other realistic rendering of the same date reference still matches
`LOW_CALIBRATION_PATTERN` and still disables the gate. Reproduced through the real command, in an isolated
`git archive` export, with only one claim record present each time:

```text
$ node -e "console.log(require('./content/claims/claim-i3-probe-lowercase-may-bypass.json').statement)"
The trial in may 2020 increases pectoralis-major hypertrophy reports.
$ node scripts/graph/validate.mjs
Graph validation passed: 2 nodes checked; graph generation remains SBLA-011.
exit=0
```

A `certainty: "low"` claim making an unqualified categorical causal assertion ("increases... reports")
passes the graph gate with **zero** issues, purely because the sentence happens to mention a lowercase
month name. Two further variants confirmed via direct call to the same exported `lintClaimLanguage`
function the command uses (same module, same code path):

```text
"In May, 2020 the protocol increases strength."   -> clean (comma breaks the \s+\d{4} match)
"On May 3, 2020 the protocol increases strength." -> clean (day-of-month breaks the match)
```

All three are schema-legal, realistic date renderings (comma after the year is standard American usage;
day-of-month is standard for a specific date), and all three leave a low-certainty categorical claim
unflagged. Control, same isolated-export methodology, confirming the gate is not simply broken in general:

```text
$ node -e "console.log(require('./content/claims/claim-i3-probe-control-clean.json').statement)"
Limited evidence suggests resistance training may increase pectoralis-major hypertrophy.
$ node scripts/graph/validate.mjs
Graph validation passed: 2 nodes checked; graph generation remains SBLA-011.
exit=0
```

This control is *correctly* clean (genuine pre-verb calibration), which is what makes the date-phrasing
cases a real defect rather than a general false-negative — the gate works, and an incidental "may" in a
date is enough to switch it off for the same reason the original I-3 token was: `LOW_CALIBRATION_PATTERN`
cannot distinguish a modal hedge from an unrelated token that happens to match `\b(may|...)\b`, and the
new date guard only special-cases one narrow spelling of that collision.

**Why still Important.** This is the identical defect class R1 graded Important, under the identical
master-plan and design-doc citations R1 used (§9.5 "avoid: causal certainty" at Low; design line 29 "Low-
certainty records cannot use categorical causal language"; §16 risk register: "AI hallucinates or
overstates claims... certainty mismatch," High/Critical likelihood/impact, with this gate named as a
mitigation). The handoff's own remediation section explicitly claims this exact scenario is now handled;
my reproduction shows the claim is true only for one narrow spelling of the date. The acceptance
criterion this maps to (criterion 3: "review dates... and certainty wording are deterministic") is still
not met on schema-legal input, and the fix remains bounded.

**Remediation.** The narrow strip-then-test approach will keep needing a new special case for every date
format. A more robust fix: don't special-case "May" at all; instead require a `may`/`might` match to
actually be followed by a verb rather than a digit/comma, e.g. reject the match as calibration when it is
immediately followed by an optional comma and then a numeral (`/\b(?:may|might)\b(?=\s*,?\s*\d)/i` should
*not* count as calibration), or, more simply, only treat `may`/`might` as calibration when followed by
whitespace and a lowercase alphabetic word (a plausible verb), not a digit. Separately, consider widening
`clausePrefix` to the whole clause (both before *and* after the causal verb, still bounded by `.;!?`)
rather than only the text before it — see M-11 below, which is the mirror-image failure this narrower
choice produces. A single fix that scans the entire bounded clause for calibration, combined with a
digit-aware exclusion for `may`/`might`, should close both I-3's residual bypass and M-11 together. Add
red tests for `"May 3, 2020"`, `"May, 2020"`, and lowercase `"may 2020"` alongside the existing pinned
case, since the current fixtures only cover the one exact spelling that was special-cased.

---

### Minor (non-blocking; impact and destination recorded)

**M-11 (new) — trailing same-clause calibration is no longer recognized, rejecting legitimately hedged
low-certainty prose.** `src/lib/content/validation.ts:200-208`. Because `clausePrefix` only looks at text
*before* the causal-verb match (from the nearest preceding `.;!?` up to the match index), a calibration
token that follows the verb in the same sentence — the ordinary place English puts a trailing hedge — no
longer counts, even with no intervening clause-ending punctuation at all. Reproduced through the real
command in isolation:

```text
$ node -e "console.log(require('./content/claims/claim-i3-probe-and-joined-regression.json').statement)"
Resistance training increases pectoralis-major hypertrophy and results may vary by individual.
$ node scripts/graph/validate.mjs
Graph validation failed:
- [CERTAINTY_OVERSTATED] claim-i3-probe-and-joined-regression.statement: Categorical causal wording
  exceeds the recorded certainty. Remediation: Use calibrated wording such as "may" or "suggests," or
  strengthen and re-review the evidence.
exit=1
```

Also confirmed for comma-joined trailing hedges (`"...increases hypertrophy, according to limited
evidence."`) via direct call to the same exported function. Before this remediation, R1's own reviewed
candidate treated calibration as valid anywhere in the statement, so this exact sentence would have
correctly passed; it is a new false-positive introduced by narrowing the scope to a prefix window. _Impact:_
fail-closed — blocks correct, appropriately-calibrated content rather than admitting bad content, and the
author can reword (e.g., move the hedge before the verb, as the still-passing control
`"Limited evidence suggests resistance training may increase pectoralis-major hypertrophy."` does). This
is the same practical category R1 graded Minor for M-3 and M-4 (fail-closed language-gate imprecision), so
I apply the same grade for consistency rather than treating position-sensitivity as a new, more severe
class of defect. _Follow-up:_ widen `clausePrefix` to cover the whole bounded clause (text on both sides of
the causal-verb match, still stopped at the nearest `.;!?`), not only the prefix; add red tests for a
calibration token following the verb both with and without an intervening comma. _Destination:_ SBLA-007
remediation alongside I-3's residual date-phrasing gap — the same fix (whole-clause scan with a smarter
`may`/`might` test) plausibly resolves both at once.

**M-1 through M-10 disposition (R1's original ten, this round):**

| ID | Status this round | Evidence |
|---|---|---|
| M-1 | **Resolved.** `constructor` target with empty checksums now rejected. | `Object.hasOwn(review.targetChecksums, targetId)` at `schemas.ts:522`; reproduced via real `node scripts/content/validate.mjs` — `[SCHEMA_INVALID] .../review-constructor-probe.json:targetChecksums: Missing immutable checksum for constructor`, exit 1. Control `valueof` still correctly rejected too; untouched valid fixture still passes. |
| M-2 | Unresolved, carried from R1. Not in this remediation's scope (schemas.ts/validation.ts diff does not touch URL typing or the DOI-only canonical check). Destination unchanged: SBLA-007 if §10.8 binds here, otherwise the first task that renders/resolves source URLs. |
| M-3 | Unresolved, carried from R1. **Spot-checked this round:** `"Resistance training reduces all-cause mortality risk in older adults."` at `certainty: "high"` still produces `CERTAINTY_UNIVERSAL` (confirmed via direct call to `lintClaimLanguage`, unchanged). Destination unchanged: SBLA-007 language-gate hardening. |
| M-4 | Unresolved, carried from R1. `hasOutcomeFreeComparative`/`COMPARATIVE_PATTERN` untouched by this diff. Destination unchanged. |
| M-5 | Unresolved, carried from R1. No Unicode/`NFKC` normalization added by this diff. Destination unchanged. |
| M-6 | Unresolved, carried from R1. `scope.population`/`scope.conditions` still not passed to `lintClaimLanguage` (confirmed by reading the current `validateRecordGraph` claim loop, `validation.ts:360-379` — only `statement`, `plainLanguage`, and `qualifiers` are linted). Destination unchanged. |
| M-7 | Unresolved, carried from R1. `scripts/foundation/scan-records.mjs` untouched by this diff. Destination unchanged. |
| M-8 | **Resolved.** Duplicate `includedSourceIds`/`affectedIds` now rejected. | `requireUniqueIds` at `schemas.ts:36-49`, applied at `schemas.ts:473` (evidence packet) and `schemas.ts:567` (change record); reproduced via real `node scripts/content/validate.mjs` for both families, each failing with the expected `must be unique` message; untouched valid fixtures still pass. |
| M-9 | Unresolved, carried from R1. **Spot-checked this round:** an uppercase `.JSON` extension still produces `RECORD_PATH_ID_MISMATCH` rather than an extension-specific message (confirmed via real `node scripts/content/validate.mjs`, unchanged). Destination unchanged: SBLA-007 adapter hardening. |
| M-10 | Unresolved, carried from R1. PMID `"0"` pattern and DOI-URL message concatenation untouched by this diff. Destination unchanged. |

I did not re-derive full new reproductions for M-2, M-4, M-5, M-6, M-7, and M-10 this round beyond
confirming (by reading the current file state, not just the diff) that the code paths R1 cited are
byte-for-byte unchanged; re-running R1's complete manual battery on code neither this remediation nor I
touched would not add information. M-3 and M-9 were spot-checked directly as a sanity control on that
reasoning, and both reproduced exactly as R1 described.

## What remains verified as correct (unchanged since R1)

The full unit suite grew from R1's 222 tests to **228 tests, all passing**, on the exact files R1
exercised plus the five remediated ones — a superset, not a replacement. Combined with the diff showing no
other production file changed, I treat R1 §5's findings (record discovery and parsing on Windows,
deterministic `asOf` handling, date-boundary conventions, source-status adverse-status handling across all
link roles, identifier contracts, publication-lifecycle short-circuit-free issue emission, graph
integrity/reference resolution, provenance-remediation invariants other than M-1/M-8, documentation
coverage of 27 issue codes, and schema composability) as still valid without re-deriving each by hand.
The scope boundary is freshly reconfirmed for this round specifically (see Decisions made and Tests/checks):
the incremental diff since R1 touches only the five files named above plus two review/handoff documents,
with no scientific content, graph output, network client, or later-task production work.

## Decisions made

- **I-3 is reported as "unresolved," not as a fresh, separately-numbered finding.** The residual bypass is
  the same named defect (an incidental token satisfying `LOW_CALIBRATION_PATTERN` without being a genuine
  hedge) that R1 already identified and graded Important; the remediation closed one spelling of it, not
  the underlying gap. Numbering it as a new finding would understate that criterion 3 was never actually
  met and risk it being read as optional polish rather than the carry-forward of an existing blocking
  finding.
- **The new trailing-clause false positive (M-11) is graded Minor, not Important**, applying the same
  fail-open-vs-fail-closed distinction this review lineage already used for M-3 and M-4 in R1: it blocks
  legitimate content rather than admitting unsupported content, and the author can reword around it today.
  I considered grading it Important on the theory that "wrongly enforced on schema-legal input" is exactly
  R1's Important definition, but that definition is satisfied by several of R1's own Minors too; the
  practical fail-open/fail-closed split is the distinction R1 actually applied when choosing between the
  two grades, so I kept that precedent rather than introduce a new standard mid-review.
- **Did not attempt to run `scripts/foundation/check-role-paths.mjs` myself.** `CLAUDE.md` is explicit
  that this evidence must come from Codex or CI against a trusted checkout, and that a checker run from
  the reviewer's own mutable branch is not acceptable boundary evidence even if I ran it. I verified the
  ledger claim instead (single row, single path, matching worktree/base/branch), which is the evidence
  within this role's remit.
- **Did not fully re-litigate M-2, M-4, M-5, M-6, M-7, M-10.** Given AGENTS.md's instruction to avoid
  unnecessary rework and this remediation's diff provably not touching their code paths, re-deriving each
  by hand would be motion without new information. I spot-checked two (M-3, M-9) as a control on that
  judgment rather than accepting it on faith.
- **Used a `git archive` export plus copied `zod`/`yaml` packages, not a full `pnpm install`, for the
  disposable adversarial directory.** The scripts resolve their own repository root from
  `import.meta.url`, so a full copy was unnecessary; copying only the two packages the specific modules
  under test import kept the isolated environment fast to build while still exercising the real,
  unmodified production code path (not a reimplementation of it).

## Tests/checks run and results

All commands below were run by me in `C:\src\s007r2` on the exact candidate unless marked as run in the
disposable export.

**Provenance (all before any review work):**

| Check | Command | Result |
|---|---|---|
| Branch | `git rev-parse --abbrev-ref HEAD` | `claude-review/SBLA-007-r2` |
| Candidate commit | `git rev-parse HEAD` | `1e724939c7783e893be962df6d4ddce22f0750bb` |
| Candidate tree | `git rev-parse "HEAD^{tree}"` | `2b99d1387aa314034701657768444743da99a638` |
| Worktree clean | `git status --porcelain --untracked-files=all` | empty, before and after |
| Node.js | `node --version` | `v24.20.0` |
| pnpm | `pnpm --version` | `11.24.0` |
| Dependency ancestry | `git merge-base --is-ancestor bbeddc06... HEAD` | exit 0 |
| Coordination claim | `git show e996c002... -- docs/runbooks/current-work.md` | one active row; paths owned = `reviews/releases/SBLA-007-r2.md` only |
| Coordination claim ancestry | `git merge-base --is-ancestor e996c002... HEAD` | exit 1 (not an ancestor — correct) |
| R1 report checksum | `sha256sum reviews/releases/SBLA-007-r1.md` | `eac91752b2a9fa9665390cda0819d0ee31c94b8844e554f764646991a9a0f261` — matches the ledger record exactly |
| R1 report byte-identical | `git diff 6e299c44...HEAD -- reviews/releases/SBLA-007-r1.md` | no output (identical) |

**`pnpm install --frozen-lockfile`** — PASS. `Already up to date. Done in 261ms using pnpm v11.24.0`.

**`pnpm verify`** — PASS, exit 0. Real output:

- Prettier `format:check` clean; ESLint clean (`--max-warnings 0`).
- `astro check`: 55 files — 0 errors, 0 warnings, 0 hints.
- `vitest run tests/unit`: **16 files, 228 tests passed** (up from R1's 222; +6 new remediation tests).
- `validate:content`: `Content validation passed: 0 records.`
- `validate:graph`: `Graph validation passed: 0 nodes checked; graph generation remains SBLA-011.`
- `evidence:status`: `Evidence status passed: 0 sources checked as of 2026-09-11; live network acquisition remains a later task.`
- `astro build`: 1 page built, `[build] Complete!`
- `test:portability`: **3 files, 17 tests passed**.
- `verify:foundation`: `Foundation contract passed at C:\src\s007r2\`.
- `assets:spike` and `assets:decision`: both pass (unrelated SBLA-004/005/006 gates, unaffected by this task).

**`pnpm test:e2e`** — PASS, exit 0.
`ok 1 [chromium] › tests\e2e\foundation.spec.ts:5:1 › serves a useful static foundation without client
JavaScript` — `1 passed (5.2s)`.

**`git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a...HEAD`** — PASS, exit 0, no output (full
accepted-base range).
**`git diff --check 6e299c44c465ff34e81ec4e1c492f9b9274b2289...HEAD`** — PASS, exit 0, no output
(remediation-only range).

**Scope-boundary diff (this round):** `git diff --stat a48981a8...HEAD` — 7 files changed:
`reviews/releases/SBLA-007-handoff.md` (+56/−0), `reviews/releases/SBLA-007-r1.md` (+581/−0, the report
itself being carried in), `scripts/graph/validate.mjs` (+8/−8 net across a 5-line change),
`src/lib/content/schemas.ts` (+45/−10 approx), `src/lib/content/validation.ts` (+49/−23 approx),
`tests/unit/content-validation.test.ts` (+51/−1), `tests/unit/evidence-schemas.test.ts` (+65/−0). No
`content/`, `content-drafts/`, `research/`, or `reviews/evidence/` record files; no graph output; the only
`fetch` calls in the tree remain in `scripts/assets/benchmark.mjs` and
`scripts/assets/full-benchmark.mjs`, neither touched.

**Adversarial reproductions (disposable export `C:\src\_sbla007-r2-adv`, since removed), all against the
real repaired modules/commands:**

- I-1 false negative (ms-precision reversal) — real `node scripts/content/validate.mjs`:
  `Content validation failed: [SCHEMA_INVALID] .../evidence-packet-ms-reversed.json:updatedAt: updatedAt
  must not precede createdAt`, exit 1. **Correctly rejected now** (R1 found this passed with exit 0).
- I-1 false positive (legitimate 500ms-later update) — real command: `Content validation passed: 1
  records.`, exit 0. **Correctly accepted now** (R1 found this was wrongly rejected).
- I-1 equal instants, second-precision control, and `changeRecord`-family coverage — all confirmed via
  direct `validateRecord` calls against the same module; see Findings.
- I-2 (published change record, review dated 2029, due 2020) — real `SBLA_AS_OF=2026-09-11 node
  scripts/graph/validate.mjs`: `Graph validation failed:` with `REVIEW_DATE_IN_FUTURE`,
  `REVIEW_SCHEDULE_INVALID`, and `REVIEW_OVERDUE` all reported, exit 1. **Correctly rejected now** (R1
  found this passed all three commands with exit 0).
- M-1 (`constructor` review target, empty checksums) — real `node scripts/content/validate.mjs`:
  `[SCHEMA_INVALID] .../review-constructor-probe.json:targetChecksums: Missing immutable checksum for
  constructor`, exit 1. **Correctly rejected now.**
- M-8 (duplicate `includedSourceIds`) — real `node scripts/content/validate.mjs`: `[SCHEMA_INVALID]
  .../evidence-packet-dup-sources.json:includedSourceIds: Included source IDs must be unique`, exit 1.
  **Correctly rejected now**; `affectedIds` duplicate confirmed via direct `validateRecord` call.
- I-3 original bypass and capitalized "May 2020" — both now produce `CERTAINTY_OVERSTATED` (direct call
  and, for the original bypass, the pinned unit test).
- I-3 residual bypass (`"...in may 2020 increases...reports."`) — real `node scripts/graph/validate.mjs`,
  isolated: `Graph validation passed: 2 nodes checked...`, exit 0. **Not rejected — confirmed open.**
- M-11 (trailing "and"-joined hedge) — real `node scripts/graph/validate.mjs`, isolated:
  `Graph validation failed: [CERTAINTY_OVERSTATED] ...`, exit 1. **Wrongly rejected — confirmed new.**
- Control (legit pre-verb calibration, isolated) — real command: `Graph validation passed: 2 nodes
  checked...`, exit 0. Confirms the gate is not broken in general.
- M-3 spot check (`"...all-cause mortality..."` at high certainty) — direct call: still produces
  `CERTAINTY_UNIVERSAL`. Unchanged.
- M-9 spot check (uppercase `.JSON` extension) — real `node scripts/content/validate.mjs`:
  `RECORD_PATH_ID_MISMATCH` message, not an extension-specific one. Unchanged.

## Known uncertainties

- I did not attempt to enumerate every possible date format or every possible position of a calibration
  token; the four reproductions given (lowercase, comma-after-year, day-of-month, trailing-clause) are
  sufficient to show the fix is pattern-narrow rather than semantically robust, but a future remediation
  should not assume these four are the complete bypass surface.
- The trusted `check-role-paths.mjs` boundary gate was not run by me and is not represented as evidence in
  this report; per `CLAUDE.md` that result must come from Codex/CI against a trusted checkout.
- I did not re-verify R1's Windows-specific record-discovery reproductions (symlinks, malformed
  YAML/JSON, extension handling beyond the M-9 spot check) by hand this round, relying instead on the
  passing superset unit suite and the unchanged file diff. If a future round touches
  `scripts/foundation/scan-records.mjs` or `scripts/content/validate.mjs`'s discovery logic, those should
  be re-derived directly rather than assumed.
- I have not evaluated whether the suggested combined fix (whole-clause scan plus a digit-aware
  `may`/`might` exclusion) is itself free of new edge cases; that judgment belongs to whoever implements
  and to the next independent recheck, not to this report.

## Files created or modified

- `reviews/releases/SBLA-007-r2.md` — this file. Nothing else was created, modified, or deleted in this
  repository. (The disposable directory `C:\src\_sbla007-r2-adv`, used for adversarial fixture testing,
  was outside the repository and has been fully removed.)

## Required reviewer action

None further from this role for this round; the verdict below is final for R2. For the next round, Codex
must perform one bounded remediation addressing:

1. I-3's residual bypass (non-canonical date phrasing still disables `CERTAINTY_OVERSTATED`), and
2. M-11 (trailing same-clause calibration wrongly rejected),

ideally with the single combined fix sketched above (whole-bounded-clause scan, digit-aware `may`/`might`
exclusion instead of a month-name strip), each backed by a red test first. A fresh `claude-review/SBLA-
007-r3-*` branch and worktree must then be created from the immutable commit containing the remediation,
with a new Codex exact-path claim for only `reviews/releases/SBLA-007-r3.md`, and Account B must recheck
the complete artifact again — this finding (I-3) plus M-11, plus a general regression pass, since two
narrow fixes to the same function in sequence are exactly the situation most likely to produce a third
edge case.

## Acceptance criteria

Against `reviews/releases/SBLA-007-handoff.md`'s seven criteria:

1. All five record families validate through one shared Zod authority with stable identity/lifecycle —
   **met**, unaffected by this remediation.
2. Content/graph/evidence commands fail closed with structured errors, truthful at zero records — **met**
   for the record-loading and structural layer; see criterion 3 for the language-gate carve-out.
3. Cross-record references, review dates, publication status, and certainty wording deterministic against
   `asOf` — **not met**. Review-date currency now correctly covers change records (I-2 fixed) and
   timestamp ordering is now instant-based (I-1 fixed), but certainty wording is still not reliably
   enforced: I-3's residual bypass lets a schema-legal, `certainty: "low"` claim with unqualified
   categorical causal wording pass undetected.
4. Every public issue code has a checked-in rejected condition, minimal example, and remediation — **met**,
   unaffected (no issue codes added or removed by this diff).
5. No scientific content, graph output, network client, or later-task production work entered the
   candidate — **met**, reconfirmed via the full incremental diff.
6. `pnpm verify`, Chromium E2E, and the accepted-base range whitespace check pass on the immutable
   candidate — **met**, reproduced fresh in this session.
7. The latest independent Account-B report says PASS with zero unresolved Critical/Important, and the
   trusted exact-path boundary passes — **not met**: this report is FAIL, with one unresolved Important
   finding (I-3). The trusted boundary result is Codex's/CI's to produce and is not addressed by this
   report either way.

**FAIL.**

- **Unresolved Critical: 0**
- **Unresolved Important: 1** — I-3 (partially repaired; residual date-phrasing bypass reproduced through
  the real command)
- **Minor: 9** — M-2 through M-7, M-9, M-10 (carried forward unchanged from R1, destinations as recorded
  there) and M-11 (new, this round), all non-blocking with impact and destination recorded above.
  M-1 and M-8 are resolved and no longer open.

Per `AGENTS.md`, this FAIL is followed by one bounded Codex remediation and one complete-artifact recheck
in a new append-only `reviews/releases/SBLA-007-r3.md`. I did not repair the candidate, and I wrote no
path other than this report.
