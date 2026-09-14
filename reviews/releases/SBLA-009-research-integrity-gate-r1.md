# Handoff: SBLA-009 research-companion integrity gate — Review R1 (independent implementation review)

**Task:** SBLA-009 research-companion integrity gate — Codex hardening follow-up for the SBLA-009
evidence workflow
**Reviewer role:** Claude Review (Account B), independent implementation acceptance review, round 1.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5; fresh independent
reviewer session; did not author, remediate, or previously review this candidate or any SBLA-009
research artifact).
**Review date:** 2026-09-14
**Reviewer worktree:** `C:\src\s009gate-r1`
**Reviewer branch:** `claude-review/SBLA-009-integrity-gate-r1`
**Reviewed candidate commit:** `d20625c10397cd9659e379bda4872490b1664111` _(immutable)_
**Reviewed candidate tree:** `56993bd6ba9982ed50afe6af47ee6c669cd664c4` _(immutable)_
**Implementation commit inside the candidate:** `5c9481a59937cc805fe3bd00646d4260b23e6bfd`
**Accepted dependency base:** `ff67c615d204a71f414370f4064969435d9bbc70` — confirmed an ancestor of the
candidate (`git merge-base --is-ancestor ff67c61 d20625c`, exit 0).
**Coordination claim commit:** `c33423a0f8de7937e42943f0b3849c865c34fecc` on
`origin/codex/SBLA-007-review-coordination`; confirmed **not** an ancestor of the candidate, which is
correct — the claim lives on the coordination branch and the reviewed candidate stays immutable.
**Runtime:** Node.js `v24.20.0`, pnpm `11.24.0` (both confirmed in this session; the host default
`node` is `v24.14.0` and was not used for any recorded result).
**Reviewer write path:** `reviews/releases/SBLA-009-research-integrity-gate-r1.md` (sole permitted
path; nothing else was created, modified, or deleted).

**Verdict: FAIL.**
**Unresolved Critical: 0 · Unresolved Important: 5 · Minor (non-blocking, with impact and destination
recorded): 5 · Total findings: 10**

The gate is real work and most of its claims hold. I reproduced the handoff's frozen-candidate proof
exactly — 223 issues in the documented six-code distribution against the untouched Account-A candidate
`8cee805ce53289cec9d62336defce2a45d7b9da5` — and independently confirmed that the checker is
byte-deterministic across repeated runs and across key-order-reversed input, does not mutate its
inputs, is `--root` path-portable on Windows across four path spellings, and leaves `pnpm verify`
green. All six file checksums and line counts in the handoff match the implementation commit exactly.

It fails on coverage, not on arithmetic. The gate's stated purpose is to "prove that the four SBLA
research companions agree with one another," and one of the four — the search companion — is never
cross-checked against anything (I-1); the handoff nevertheless lists `search-count` among what the
gate "reconciles." Two of the gate's own checks depend on closed vocabularies that are never enforced,
so an out-of-vocabulary value silently switches the check off instead of failing: renaming the access
levels clears 40 of the 62 real acquisition-ladder findings (I-2), and rewording one token or renaming
one field clears all 7 real full-text-basis findings (I-3). A wrong or absent `--root` reports PASS
(I-4), which matters because `--root` is the exact mechanism the handoff used to produce its own proof.
And the one worked command in the authoring contract this change ships does not run (I-5).

None of these rise to Critical: the gate detects everything it claims to detect on the real artifacts
as they stand today, it fails closed on the candidate under review, and `pnpm verify` is not broken.
But each Important finding is a way for the next SBLA-009 remediation round to clear findings without
fixing anything, and this gate exists specifically to stand between that remediation and acceptance.

---

## Objective

Independently audit the SBLA-009 research-companion integrity gate as an implementation artifact:
verify the active coordination claim; read the governing contracts and every changed
implementation, test, fixture, and documentation file against base `ff67c61`; and adversarially probe
for false passes, false failures, nondeterminism, path non-portability, malformed-input handling,
incomplete bundle discovery, actual compatibility with the current SBLA-009 artifacts, and whether the
tests genuinely exercise every claimed invariant. Return PASS or FAIL per the repository stop rule
without repairing the artifact.

## Inputs and exact paths

Read in full before acting:

- `AGENTS.md`, `CLAUDE.md`, `docs/product/master-plan.md` (complete, including §9 research pipeline,
  §12 quality gates, §18 task queue, §19 acceptance rubric), `docs/runbooks/operating-policy.json`.
- `reviews/releases/SBLA-009-research-integrity-gate-handoff.md` (the candidate handoff).
- `origin/codex/SBLA-007-review-coordination:docs/runbooks/current-work.md` at
  `c33423a0f8de7937e42943f0b3849c865c34fecc`.

**Claim verification.** The ledger's active-claims table carries the row:

> `SBLA-009 integrity gate implementation R1` | `Claude Review (account B)` |
> `claude-review/SBLA-009-integrity-gate-r1` | `C:\src\s009gate-r1` |
> `d20625c10397cd9659e379bda4872490b1664111` | `2026-09-14 17:24 EDT` |
> `reviews/releases/SBLA-009-research-integrity-gate-r1.md` |
> paths owned: `reviews/releases/SBLA-009-research-integrity-gate-r1.md`

Branch, worktree, base commit, expected handoff, and the single owned path all match this session
exactly. The builder claim for `SBLA-009 research-companion integrity gate` (Codex, worktree
`C:\src\s009integrity`, base `ff67c61`) is also present and its seven owned paths are exactly the seven
files this candidate touches. No writer collision. I did not edit the ledger.

**Changed files versus `ff67c615d204a71f414370f4064969435d9bbc70`** (7 files, +2030 / −1), all read
line by line:

| Path                                                           | Lines |                                               SHA-256 at `5c9481a` | Handoff table |
| -------------------------------------------------------------- | ----: | -----------------------------------------------------------------: | ------------- |
| `package.json`                                                 |    59 | `3f5960aac3450c1433a5167a00229b9deef2f92a2baa7dcb4317496ac3fd51c0` | match         |
| `scripts/evidence/research-integrity.mjs`                      | 1,164 | `c8ff88d8d3d9942eb923300d4cd72ccc4aa4083ce459d2a724b9dfb45496ae9f` | match         |
| `tests/unit/research-integrity.test.ts`                        |   220 | `de486013b99799e7d52ffa6549de24e24e5abb2c1447220a5683768611801370` | match         |
| `tests/fixtures/research-integrity/valid-bundle.json`          |   166 | `48935ea3f2a3d6243bbd16cd1c51b4de3611b67ebd6280246fac1861c14020e5` | match         |
| `tests/fixtures/research-integrity/invalid-bundle.json`        |   207 | `2d24543af5733c1610016329a3deef3d8307c9de9c847b3f1c64eb6698b76b92` | match         |
| `docs/authoring/research-integrity-errors.md`                  |   139 | `6260d67ed540c31bdc726e6eb5940fcf5db35a30610d34dd3424fcb5f9f3ff2d` | match         |
| `reviews/releases/SBLA-009-research-integrity-gate-handoff.md` |   132 |                                               (added at `d20625c`) | n/a           |

All six implementation checksums and line counts in the handoff's table are independently reproduced
and correct.

Also read for context and convention comparison: `scripts/evidence/status.mjs`,
`scripts/content/validate.mjs`, `docs/authoring/evidence-record-errors.md`, `vitest.portability.config.ts`,
`.github/workflows/ci.yml`, and the SBLA-007 review lineage for report format.

**Real SBLA-009 companion artifacts used as probe input** (copied read-only into a scratch directory
outside every repository; no repository file was written at any point):

- Frozen Account-A candidate `8cee805ce53289cec9d62336defce2a45d7b9da5`.
- Current remediation tip `origin/claude-research/SBLA-009-r1-remediation` =
  `48e4802786e6862b605800f67702d86f78676d31`. Its four companion blobs are **byte-identical** to the
  frozen candidate's (e.g. both screening flows are blob
  `06f1cbf71bf85584dbe7b0f1e760b714a8bbb57c`), so the frozen-candidate result below is also the
  current-artifact result. No remediation has landed on that remote branch yet.

## Constraints observed

- I did not repair, edit, or reformat any file under review, and did not touch the claim ledger.
- The worktree was clean at `d20625c` before and after this review (`git status --porcelain` empty
  apart from the gitignored `node_modules/` produced by `pnpm install --frozen-lockfile`, and this
  report).
- Every mutation probe operated on in-memory copies written to `os.tmpdir()` scratch roots that were
  deleted afterwards. The frozen and remediation artifacts were extracted with `git show` into a
  scratch directory, never into a working tree.
- No live network search, no scientific adjudication, no judgement on whether any SBLA-009 claim is
  true. This is an implementation review of the gate, not the SBLA-010 evidence review.

---

## Findings

### Important (all five block PASS)

#### I-1 · The search companion is never reconciled against any other companion, and the handoff says it is

**Where:** `scripts/evidence/research-integrity.mjs:327-370` (the complete extent of search-artifact
validation); `scripts/evidence/research-integrity.mjs:361-369`;
`scripts/evidence/research-integrity.mjs:927-947`;
`reviews/releases/SBLA-009-research-integrity-gate-handoff.md:36-38`.

The handoff states the gate "reconciles terminal-state, retrieval-event, exclusion-code,
extraction-access, language, awaiting-full-text, included-source, **search-count**, and packet-source
totals and identifier sets." It does not. Lines 327-370 are the only code that reads
`bundle.search`, and every one of those checks is a type/shape check on a value in isolation:
receipt IDs unique, `executedAt` a real date, `resultCount` a nonnegative integer,
`recordsRetrievedIntoScreening` a nonnegative integer _if present_. Nothing compares any search value
to any screening, extraction, or packet value. `packet.searches` (lines 927-947) is treated the same
way — each entry's date and count are type-checked, never compared to `search.receipts`.

This is not a theoretical gap. The real SBLA-009 artifacts contain a genuine, checkable identity that
the gate steps over: `sum(search.receipts[].recordsRetrievedIntoScreening)` = **1361** across the 40
receipts that declare it, and `screening.reconciliation.recordsRetrieved` = **1361**. The two
companions do agree today; the gate would not notice if they stopped.

**Failure scenario (reproduced).** Against the untouched frozen candidate, reducing the search
companion to a single receipt reporting `resultCount: 0` and `recordsRetrievedIntoScreening: 0` —
while screening continues to declare 1,361 records retrieved from 43 searches — leaves the diagnostic
output **completely unchanged at 223 issues** in the identical six-code distribution. The gate emits
nothing about the search companion at all. On the minimal fixture, all of the following pass with
exit 0 and zero issues:

| Probe                                                                               | Result                              |
| ----------------------------------------------------------------------------------- | ----------------------------------- |
| `search.receipts[0].recordsRetrievedIntoScreening` `4` → `999`, screening unchanged | exit 0, 0 issues                    |
| `search.receipts[0].resultCount` `4` → `99999` and retrieved → `0`                  | exit 0, 0 issues                    |
| `search.receipts` emptied to `[]` entirely                                          | exit 0, 0 issues                    |
| invented extra `packet.searches` entry `{searchedAt, resultCount: 999}`             | exit 0, 0 issues                    |
| `packet.searches` replaced wholesale with one fabricated 0-result entry             | exit 0, 0 issues                    |
| populated search companion + screening/extraction/packet emptied to zeroes          | exit 0, "1 complete bundle checked" |

The last row is the sharpest: a bundle whose search companion records real executed searches while
every downstream companion has been emptied — the exact shape of a catastrophic data loss or a
truncated regeneration — is reported as a clean, complete, passing bundle.

Either reading of the handoff sentence is a defect. If "search-count" was meant as cross-artifact
reconciliation, it is unimplemented. If it was meant as the per-field type checks at lines 354-369,
then the verb "reconciles" and the gate's stated purpose ("prove that the four SBLA research
companions agree with one another") both misdescribe what shipped.

**Remediation.** Either (a) implement the reconciliation: derive
`screening.reconciliation.recordsRetrieved` from `sum(search.receipts[].recordsRetrievedIntoScreening)`
when the receipts declare it, and reconcile `packet.searches` against `search.receipts` by receipt
identity, date, and count — both links exist and agree in the real data today, so the check is
satisfiable by the current artifacts; or (b) delete `search-count` from the handoff bullet, replace
"reconciles" with the accurate verb for the search companion, and state in
`docs/authoring/research-integrity-errors.md` that the search companion is validated in isolation and
that its totals are not cross-checked. Option (b) is honest but leaves a four-artifact gate that only
reconciles three artifacts; I recommend (a).

---

#### I-2 · `accessLevel` has no closed-vocabulary check, so an unrecognized value silently switches off the acquisition-ladder requirement

**Where:** `scripts/evidence/research-integrity.mjs:11` (`LOWER_ACCESS_LEVELS`);
`scripts/evidence/research-integrity.mjs:12-15` (`FULL_TEXT_ACCESS_LEVELS`);
`scripts/evidence/research-integrity.mjs:459-461` (the ladder predicate);
`scripts/evidence/research-integrity.mjs:704-717` (`ACCESS_LEVEL_MISMATCH`);
`scripts/evidence/research-integrity.mjs:819-853` (derived access counts).

The ladder requirement at line 459-461 fires when the terminal state is `awaiting-full-text`, or when
the state is `included` **and** `LOWER_ACCESS_LEVELS.has(String(accessLevel))`. `LOWER_ACCESS_LEVELS`
is a closed set of two strings, but nothing anywhere validates that `acquisition.accessLevel` or
`sourceSchemaFields.access.level` is drawn from any vocabulary at all. `ACCESS_LEVEL_MISMATCH` (704-717)
only requires the two artifacts to carry the _same_ nonempty string as each other. Compare
`TERMINAL_STATE_INVALID` (lines 429-438), where the equivalent closed set _is_ enforced with its own
diagnostic. Access level is the one field the ladder rule keys on, and it is the one closed vocabulary
left unenforced.

The consequence is symmetrical and both directions are wrong:

**False pass (reproduced on the real frozen candidate).** Renaming `abstract-only` → `abstract_only`
and `metadata-only` → `metadata_only` in _both_ companions — 83 screening records and 52 extractions —
and restating the derived breakdown counts the gate itself now expects (`counts.abstractOnly` → 0)
drops the tally from 223 issues to 183:

```
ACQUISITION_LADDER_REQUIRED   62  ->  22
(everything else unchanged)
```

All **40** included-record ladder findings disappear. Not one new diagnostic replaces them. The
frozen candidate's 62 ladder findings break down as 22 `awaiting-full-text` records (caught regardless
of access level) and 40 `included` records at lower access (52 at `abstract-only`, 10 at
`metadata-only` across both groups) — and the entire second group is optional to the author. On a
bundle whose other findings have been genuinely repaired, this is a full false pass: probe `PA`
against the minimal fixture, where the only remaining awaiting-full-text record is separately
satisfied, passes with the included lower-access record carrying `ladderStepsTried: []` and no
diagnostic.

Nothing else catches the substitution. The access-level breakdown counts (819-853) are each derived
from the same renamed values, so zeroing them is exactly what the gate demands; and there is no check
that `fullTextObtained + abstractOnly + metadataOnly` accounts for `includedSources`, so 52 of the 76
included sources silently belong to no access category.

**False failure (reproduced).** The mirror case is just as real: an author who records the perfectly
natural `access.level: "full-text"` — not in `FULL_TEXT_ACCESS_LEVELS`, which holds only
`full-text-open` and `full-text-limited` — with `basis: "full-text"` is told
`FULL_TEXT_BASIS_EXCEEDS_ACCESS`: _"Fact basis "full-text" exceeds source access "full-text""_. That
diagnostic is incoherent and points the author at the wrong field.

This matters more than an ordinary coverage gap because of who is being gated. Account A is about to
work 62 ladder findings, and the cheapest way to clear 40 of them is a vocabulary change that the gate
accepts, rewards with a smaller tally, and never mentions.

**Remediation.** Validate both `acquisition.accessLevel` and `sourceSchemaFields.access.level`
against the closed vocabulary `{full-text-open, full-text-limited, abstract-only, metadata-only}` with
a new stable code (e.g. `ACCESS_LEVEL_INVALID`), document it in the error table, and require the
derived access-level breakdown to account for every included source. Adding a new access level then
becomes a deliberate, reviewable schema change rather than a silent gate bypass.

---

#### I-3 · The full-text basis rule matches one exact token shape inside one optional field, so rewording clears every real finding

**Where:** `scripts/evidence/research-integrity.mjs:731-754`.

`basis` is only examined when it is a `string`; it is lowercased, split on `,`, trimmed, and the rule
fires only when one resulting element is exactly `full-text`. `reportedFacts` itself is read through
`asArray(extracted.reportedFacts)`, so its absence yields an empty list and no check at all. Nothing
requires `reportedFacts` to exist, and nothing constrains `basis` to a vocabulary.

**Failure scenario (both reproduced on the real frozen candidate).**

| Mutation of the untouched frozen candidate                                | Tally | `FULL_TEXT_BASIS_EXCEEDS_ACCESS` |
| ------------------------------------------------------------------------- | ----- | -------------------------------: |
| none (baseline)                                                           | 223   |                                7 |
| `basis` token `full-text` → `full text` (90 facts, a search-and-replace)  | 216   |                            **0** |
| `extraction.reportedFacts` renamed to `extraction.facts` (76 extractions) | 216   |                            **0** |

All seven real findings vanish in both cases, silently. On the minimal fixture the same holds for
`basis: "abstract and full-text"`, `basis: "full-text (author copy)"`, and
`basis: ["full-text"]` — each passes with exit 0 and zero issues on an `abstract-only` source.

The printed remediation for this code is _"Either document lawful full-text access in both artifacts
or lower the fact basis to the material actually read."_ A third, unintended option exists: reword the
basis into anything the parser does not recognize. The real data happens to use exactly the
comma-delimited form the parser expects (175 facts across five distinct values), which is why the
check works today — it is one token away from not working, with no signal either way.

This is the same root defect as I-2 (a closed vocabulary that is depended upon but never enforced) in a
different field, and it is graded the same way for the same reason.

**Remediation.** Validate `basis` against a closed vocabulary with its own code, treat an
unrecognized token as an error rather than as "no full-text claim," and require every extraction to
carry a `reportedFacts` array (empty is a legitimate, explicit state; missing is not).

---

#### I-4 · A wrong, missing, or shadowed `--root` reports PASS

**Where:** `scripts/evidence/research-integrity.mjs:975-1001` (`discoverComponents`, ENOENT → `continue`);
`scripts/evidence/research-integrity.mjs:1007` (`let root = process.cwd()`);
`scripts/evidence/research-integrity.mjs:1018` (the `root === process.cwd()` sentinel);
`scripts/evidence/research-integrity.mjs:1137-1145` (`completeCount === 0` → exit 0).

When no companion directory exists under `root`, every `readdir` returns ENOENT, discovery yields zero
bundles, and the command prints `Research integrity passed: 0 complete bundles checked.` and exits 0.
That behaviour is documented and correct for a truthful empty repository
(`docs/authoring/research-integrity-errors.md:20-22`). It is not correct, and is not distinguished,
when the root is simply wrong.

**Failure scenarios (all reproduced, all exit 0 with "passed"):**

| Probe                                                                   | Result                               |
| ----------------------------------------------------------------------- | ------------------------------------ |
| `--root C:/definitely-not-here-9f3a` (path does not exist)              | `passed: 0 complete bundles checked` |
| `--root <a directory with no research tree>`                            | `passed: 0 complete bundles checked` |
| no `--root`, run from `<bundle root>/research` (one level down)         | `passed: 0 complete bundles checked` |
| all four companions one directory deeper (`research/searches/2026/…`)   | `passed: 0 complete bundles checked` |
| `--root . --root C:/definitely-not-here-9f3a`, run from the bundle root | `passed: 0 complete bundles checked` |

The last row is a distinct parse defect. Line 1018 guards duplicate `--root` with
`root === process.cwd()`, using "still equal to cwd" as a proxy for "not yet set." A first
`--root .` resolves to cwd and therefore does not trip the sentinel, so a second `--root` is silently
accepted and wins. A second `--root` after a _non_-cwd first value is correctly rejected with
`ARGUMENT_INVALID` — so the protection exists and is bypassable, and the bypass lands on the silent-pass
path.

Why this is Important rather than cosmetic: `--root` is not a convenience flag. It is the mechanism
the handoff itself used to produce its frozen-candidate proof (`--root C:\src\s009research`), the
mechanism the authoring doc offers for "trusted external checks"
(`docs/authoring/research-integrity-errors.md:29-30`), and therefore the mechanism a future reviewer
or Codex will use to re-verify a remediated candidate from outside its worktree. A mistyped or stale
path returns the word "passed." Note the contrast with `scripts/evidence/status.mjs:9`, whose sibling
validator resolves the repository root from `import.meta.url` and so cannot be aimed at the wrong tree
at all; and with this gate's own `--bundle` path, which _does_ fail correctly (`BUNDLE_MISSING`, exit 1)
against the same nonexistent root.

**Remediation.** Fail with a distinct code when the resolved root contains none of the four companion
directories (a repository that legitimately has an empty evidence tree still has
`research/searches/.gitkeep` and its siblings, as this one does, so the truthful-empty case stays
distinguishable); and replace the `root === process.cwd()` sentinel at line 1018 with an explicit
"already seen" flag so a duplicate `--root` is always rejected.

---

#### I-5 · The one worked command in the authoring contract this change ships does not run

**Where:** `docs/authoring/research-integrity-errors.md:23-27`.

The doc instructs: _"To require one task even when none of its files exists, run:"_

```text
pnpm validate:research -- --bundle SBLA-009
```

Reproduced verbatim with the pinned toolchain (Node `v24.20.0`, pnpm `11.24.0`):

```text
$ node scripts/evidence/research-integrity.mjs "--" "--bundle" "SBLA-009"
[ARGUMENT_INVALID] Usage: node scripts/evidence/research-integrity.mjs [--root <repository>] [--bundle <task-id>]
[ELIFECYCLE] Command failed with exit code 2.
```

pnpm 11.24.0 forwards the literal `--` to the script, `parseArguments` reads it as an unknown flag
(`scripts/evidence/research-integrity.mjs:1020-1023`), and the command exits 2 with a usage error
instead of checking the bundle. The working form is `pnpm validate:research --bundle SBLA-009`, which
I confirmed produces the intended `[BUNDLE_MISSING]` with exit 1 on this base.

This fails loudly, so it creates no false pass — but the authoring contract is the artifact Account A
is directed to during the remediation round that starts next, its single executable example is wrong,
and the handoff asserts that this document "defines the authoring contract and every diagnostic." A
shipped contract whose worked example errors out is not deferrable to a later hardening pass.

**Remediation.** Change line 26 to `pnpm validate:research --bundle SBLA-009`, or make
`parseArguments` skip a bare leading `--` (and then keep the documented form). Either is a one-line
change; the report records no preference beyond picking one and documenting it.

---

### Minor (non-blocking; impact and destination recorded)

#### M-1 · `step` is never validated, though three places promise it

**Where:** `scripts/evidence/research-integrity.mjs:473-497` (attempt validation reads only
`attemptedAt` and `result`); `scripts/evidence/research-integrity.mjs:470` and `:484` (the tool's own
remediation strings promise `{step, attemptedAt, result}`);
`reviews/releases/SBLA-009-research-integrity-gate-handoff.md:32-33`;
`docs/authoring/research-integrity-errors.md:55-64`.

Deleting `.step` from an otherwise complete acquisition attempt yields exit 0 and zero issues
(independently reproduced). The handoff says the gate "requires each acquisition-ladder attempt to be
a structured `{step, attemptedAt, result}` object"; it requires two of the three. The doc is more
careful — its normative sentence at lines 66-67 names only `attemptedAt` and `result` — but it
presents the three-field object as "this shape," and the tool's own printed remediation names all
three.

**Impact:** an attempt can record when acquisition was tried and what happened without recording which
lawful route was tried, so the ladder evidence does not by itself establish which access channels were
exhausted. The load-bearing evidence (date and observed result) is enforced, and opaque string
attempts of the kind the R1 artifacts used _are_ correctly rejected — `ladderStepsTried:
["europepmc-fulltextxml:200"]` produces both `ACQUISITION_ATTEMPT_DATE_INVALID` and
`ACQUISITION_ATTEMPT_RESULT_REQUIRED` — so this is a narrowing of the contract, not a hole in it.
**Destination:** fold into the same bounded remediation as I-2 if that remediation is opened (both
touch the acquisition contract); otherwise the next tooling-hardening task. Whichever way it is
resolved, the handoff bullet at line 32-33 and the code's remediation strings at 470/484 must end up
saying the same thing the checker does.

#### M-2 · The determinism test is vacuous, and four CLI behaviours have no test at all

**Where:** `tests/unit/research-integrity.test.ts:103-130`;
`tests/unit/research-integrity.test.ts:138-154`; `scripts/evidence/research-integrity.mjs:47-52`.

The test named "keeps issue ordering deterministic regardless of object insertion order" builds its
second bundle with `Object.fromEntries(Object.entries(invalid).reverse())` — reversing only the four
_top-level_ keys, which `validateResearchBundle` reads by name at lines 320-323. Top-level order
cannot affect the result, so the assertion cannot fail and proves nothing about the orderings that do
vary (`exclusionCodeCounts` and `counts` key order, and the final `issues.sort`).

Determinism nevertheless **holds** — I verified it independently and byte-exactly rather than relying
on the test: five consecutive runs against the real 223-issue frozen bundle produced identical stderr
(sha256 prefix `74cfa54c2875386e`, 447 lines, exit 1 each time), and a variant with object key order
reversed recursively at _every_ level produced byte-identical output. So this is a test-strength
finding, not a behaviour defect, and Codex should not "fix" the checker for it.

Also untested: `ARGUMENT_INVALID` (no test exercises it, and `CLI_ISSUE_CODES` at lines 47-52 is
exported and referenced by nothing — the coverage assertion at test line 138-140 pins
`BUNDLE_VALIDATION_CODES` only); the `duplicate` terminal state (the valid fixture contains none, so
the `records.length - duplicates` branch at line 519 is never exercised — I checked it by hand and it
is correct); the zero-bundle pass path; multi-bundle discovery and `--bundle` isolation; and CLI exit-1
on a _semantically_ invalid bundle, since all four CLI failure tests are structural (partial, missing,
malformed JSON). The per-code assertions use `expect.arrayContaining`, so no mutation pins the issue
_count_; a regression that adds spurious findings would pass. The `toEqual([])` assertion on the valid
fixture is the one genuine false-positive guard and it does its job.

**Impact:** the suite would not catch an ordering regression, an argument-parsing regression, or a
collateral-false-positive regression. **Destination:** next tooling-hardening task; a determinism test
that reverses keys recursively and asserts byte-equal issue arrays, plus a `CLI_ISSUE_CODES`
set-equality test mirroring line 138-140, would close most of it.

#### M-3 · A missing `primaryReasonCode` is reported against the count, not the record, and its remediation makes things worse

**Where:** `scripts/evidence/research-integrity.mjs:596-639`.

Deleting `primaryReasonCode` from an excluded record produces exactly one issue, at
`$.exclusionCodeCounts.E-OUT-1`, saying the declared count is 1 but records derive 0. There is no code
or path pointing at the record that lost its reason code. Following the printed remediation
("Recompute `exclusionCodeCounts` from excluded records and their single `primaryReasonCode` values")
produces `{}`, which then trips the aggregate check at lines 630-639 on the next run.

**Impact:** the gate does eventually refuse the bundle, but only after two rounds and an instruction
that points at the wrong file first. With 1,009 excluded records in the real artifact, a per-record
path matters. **Destination:** next tooling-hardening task; a per-record
`EXCLUSION_REASON_REQUIRED` at `$.records[i].primaryReasonCode` would resolve it.

#### M-4 · A degenerate all-zero bundle passes, and `retrievalEvents: 0` can derive an unsatisfiable negative total

**Where:** `scripts/evidence/research-integrity.mjs:107-109` (`isCount` admits 0);
`scripts/evidence/research-integrity.mjs:519-542`.

A bundle with all four files present, zero records, zero extractions, zero sources, and a correctly
zeroed reconciliation block passes as `Research integrity passed: 1 complete bundle checked` — no
minimum-substance check exists. Separately, because `retrievalEvents` may be 0 while each record
inherently represents at least one retrieval, `duplicateRetrievalEvents` can derive negative: with
three fixture records set to 0 the gate reports _"Declared duplicateRetrievalEvents is 1; records
derive -3."_ No value satisfying `isCount` can ever match −3, so that bundle can never pass by any
edit to the reconciliation block.

**Impact:** the first is mostly theoretical in isolation but compounds I-1 (see the "populated search,
emptied downstream" row); the second is an unsatisfiable state reachable only from a semantically
wrong input, where the diagnostic names an impossible target instead of the real defect.
**Destination:** next tooling-hardening task; requiring `retrievalEvents >= 1` and flagging a derived
negative as its own code would fix the second, and the first is naturally resolved by the I-1
remediation.

#### M-5 · Discovery is non-recursive, first-wins on case-variant duplicates, and accepts an empty task stem

**Where:** `scripts/evidence/research-integrity.mjs:987-998`.

`readdir` is not recursive (see the I-4 table: four companions one directory deeper are invisible and
the run passes). The lowercase-suffix match plus `.toUpperCase()` stem is what makes the real bundle's
mixed casing work — `SBLA-009-screening-flow.json` alongside `sbla-009-evidence-packet.json` — and I
confirmed fully uppercase filenames are also discovered correctly. But the `if (!components.has(kind))`
guard at line 994 means that on a case-sensitive filesystem (CI runs `ubuntu-latest`), two files whose
stems differ only in case resolve to the same task ID and the sort-order winner is used while the
other is silently ignored. A file named exactly `-search-receipts.json` yields an empty task ID and
prints `Research integrity passed: 1 complete bundle checked ().`

**Impact:** all three require a filesystem state that the path contract already forbids, and the
partial-bundle rule catches the realistic mixed cases (I confirmed a second task present only as a
packet file is correctly reported `BUNDLE_PARTIAL`). **Destination:** next tooling-hardening task;
reporting a distinct error for two files colliding on one task ID, and rejecting an empty stem, would
close it.

---

## What I verified as correct

These are recorded so the remediation does not disturb them.

- **Frozen-candidate proof reproduces exactly.** Against the untouched Account-A candidate
  `8cee805`, the gate exits 1 with 223 issues in precisely the distribution the handoff tabulates:
  `ACQUISITION_LADDER_REQUIRED` 62, `ACQUISITION_ATTEMPT_DATE_INVALID` 75,
  `ACQUISITION_ATTEMPT_RESULT_REQUIRED` 75, `FULL_TEXT_BASIS_EXCEEDS_ACCESS` 7, `LANGUAGE_REQUIRED` 3,
  `RETRIEVAL_EVENTS_DEFAULT_MISSING` 1. Every real defect class the handoff claims to detect is
  detected. The current remediation tip carries byte-identical artifacts, so this is also the
  current-artifact result.
- **Determinism** — byte-exact across five runs and across recursively key-order-reversed input (M-2).
- **Non-mutation** — input file size, SHA-256, and mtime unchanged after five runs; the in-memory
  assertion at test line 99-100 also holds.
- **Path portability of `--root`** — trailing backslash, forward slashes, lowercase drive letter, and
  the `\\?\` extended-length prefix all resolve identically on Windows. The checker also runs
  correctly when invoked from a copied location, so the `isMainModule` comparison at lines 1148-1150
  is not fragile in practice.
- **Malformed and missing input** — JSON syntax errors, `null` artifacts, artifacts that are JSON
  arrays, `records` as an object, `acquisition` as a string, and `ladderStepsTried` as a string all
  fail closed with exit 1 and codes that name the right artifact and JSON path. No crash, no silent
  skip.
- **Partial-bundle rule** — a second task present only as a packet file is correctly reported
  `BUNDLE_PARTIAL` naming all three missing components, sorted.
- **Argument rejection** — unknown flags, a flag with no value, a duplicate `--bundle`, a bare
  positional argument, and a duplicate non-cwd `--root` are all rejected with `ARGUMENT_INVALID` and
  exit 2 (the one hole is I-4's `--root .` case). `--bundle` is correctly case-insensitive.
- **Reconciliation arithmetic** — the `duplicate` terminal-state branch, which the fixture never
  exercises, is correct: a duplicate record is excluded from the unique total while its retrieval
  event still counts, and a bundle built that way passes.
- **`pnpm verify` is green at the candidate**, run in full from `d20625c`: Prettier pass, ESLint
  0 errors / 0 warnings, `astro check` 57 files with 0 errors / 0 warnings / 0 hints, unit tests
  17 files / 245 tests passed, content validation pass, graph validation pass,
  `Research integrity passed: 0 complete bundles checked.`, evidence status pass, static build
  complete, portability 3 files / 17 tests passed, foundation contract pass, asset spike and decision
  pass. `git diff --check` clean. Every number the handoff records under "Verification" is reproduced.
- **Command-contract compliance** — `validate:research` is added, not substituted; no stable command
  name in the AGENTS.md table is renamed or removed; CI (`ubuntu-latest`) picks the new step up
  through `pnpm verify`.
- **Scope discipline** — the gate performs no network access, no scientific adjudication, and no
  writes, exactly as `docs/authoring/research-integrity-errors.md:126-139` claims. The boundaries
  section of that document is accurate and well written.

## Decisions made

- **Nothing graded Critical.** The gate fails closed on the artifact under review, detects every
  defect class it claims on the real data, and does not break `pnpm verify`. I-1 through I-4 are ways
  a _future_ bundle could pass while wrong, and I-5 fails loudly. That is the Important band, not the
  Critical one.
- **I-2 and I-3 are graded separately despite sharing a root cause** (a depended-upon closed
  vocabulary that is never enforced), because the fixes land in different code and the
  I-2 false-failure direction is independently wrong.
- **M-1 is Minor, not Important**, because the doc's normative sentence requires only `attemptedAt`
  and `result`, both of which are enforced, and because the opaque-string attempts that motivated the
  rule are correctly rejected. Only the handoff's summary and the tool's remediation strings overstate
  it. I record it with impact and destination rather than deferring it silently.
- **M-2 is Minor, not Important**, because I verified the underlying behaviour holds by direct
  byte-comparison. A weak test over correct behaviour is a coverage debt; it is not a defect in the
  artifact's behaviour, and grading it Important would invite a remediation that changes working code.
- **I did not repair anything.** Per `AGENTS.md`, findings go back to Codex, which owns
  `scripts/`, `tests/`, `docs/`, and `package.json`.

## Tests/checks run and results

All commands run from `C:\src\s009gate-r1` at `d20625c` with Node `v24.20.0` / pnpm `11.24.0`.

|   # | Command / probe                                                                                                                                                                                                    | Result                                                                                          |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
|   1 | `git rev-parse HEAD` / `HEAD^{tree}`                                                                                                                                                                               | `d20625c…`, tree `56993bd…`                                                                     |
|   2 | `git merge-base --is-ancestor ff67c61 d20625c`                                                                                                                                                                     | exit 0 (base is an ancestor)                                                                    |
|   3 | `git show origin/codex/SBLA-007-review-coordination:docs/runbooks/current-work.md`                                                                                                                                 | claim row verified, quoted above                                                                |
|   4 | `git diff --stat ff67c61..d20625c`                                                                                                                                                                                 | 7 files, +2030 / −1                                                                             |
|   5 | `git diff --check ff67c61..d20625c`                                                                                                                                                                                | clean                                                                                           |
|   6 | SHA-256 + line count of all six implementation files at `5c9481a`                                                                                                                                                  | all six match the handoff table                                                                 |
|   7 | `pnpm install --frozen-lockfile`                                                                                                                                                                                   | 529 packages, done                                                                              |
|   8 | `pnpm vitest run tests/unit/research-integrity.test.ts`                                                                                                                                                            | 1 file, 7 tests passed                                                                          |
|   9 | `pnpm verify`                                                                                                                                                                                                      | **exit 0**, all stages green (detail above)                                                     |
|  10 | Gate vs. frozen candidate `8cee805` (`--root … --bundle SBLA-009`)                                                                                                                                                 | exit 1, 223 issues, distribution matches handoff exactly                                        |
|  11 | Frozen ladder findings split                                                                                                                                                                                       | 22 awaiting-full-text + 40 included; 52 at `abstract-only`, 10 at `metadata-only`               |
|  12 | Escape 1 — access levels renamed in both companions, breakdown counts restated                                                                                                                                     | 223 → **183**; ladder 62 → **22**; 40 real findings silently cleared (I-2)                      |
|  13 | Escape 2 — `basis` `full-text` → `full text` (90 facts)                                                                                                                                                            | 223 → 216; full-text-basis 7 → **0** (I-3)                                                      |
|  14 | Escape 3 — `reportedFacts` renamed to `facts` (76 extractions)                                                                                                                                                     | 223 → 216; full-text-basis 7 → **0** (I-3)                                                      |
|  15 | Escape 4 — search companion gutted to one 0-result receipt                                                                                                                                                         | **223, unchanged** — no diagnostic (I-1)                                                        |
|  16 | Fixture probes: `recordsRetrievedIntoScreening` 999 / receipts emptied / invented `packet.searches`                                                                                                                | exit 0, 0 issues each (I-1)                                                                     |
|  17 | Fixture probe: populated search + emptied screening/extraction/packet                                                                                                                                              | exit 0, "1 complete bundle checked" (I-1, M-4)                                                  |
|  18 | Fixture probe: `.step` deleted from a complete attempt                                                                                                                                                             | exit 0, 0 issues (M-1)                                                                          |
|  19 | Fixture probes: `basis` as `"abstract and full-text"` / `"full text"` / `["full-text"]` / `"full-text (author copy)"`                                                                                              | exit 0, 0 issues each (I-3)                                                                     |
|  20 | Determinism: 5 runs on the 223-issue bundle                                                                                                                                                                        | identical stderr sha `74cfa54c2875386e`, 447 lines, exit 1                                      |
|  21 | Determinism: recursively key-order-reversed input                                                                                                                                                                  | byte-identical stderr to the natural-order run                                                  |
|  22 | Non-mutation: input size + SHA-256 + mtime before/after 5 runs                                                                                                                                                     | unchanged                                                                                       |
|  23 | `--root` spellings: trailing `\`, forward slashes, lowercase drive, `\\?\` prefix                                                                                                                                  | all exit 0, identical output                                                                    |
|  24 | `--root` wrong/absent: nonexistent path, no research tree, run one level down, nested companions                                                                                                                   | all **exit 0 "passed: 0 complete bundles checked"** (I-4)                                       |
|  25 | `--root . --root C:/definitely-not-here-9f3a` from the bundle root                                                                                                                                                 | exit 0, silently used the second root (I-4)                                                     |
|  26 | Same nonexistent root **with** `--bundle`                                                                                                                                                                          | exit 1, `BUNDLE_MISSING` (correct)                                                              |
|  27 | `pnpm validate:research -- --bundle SBLA-009` (as documented)                                                                                                                                                      | **exit 2, `ARGUMENT_INVALID`** (I-5)                                                            |
|  28 | `pnpm validate:research --bundle SBLA-009`                                                                                                                                                                         | exit 1, `BUNDLE_MISSING` (correct)                                                              |
|  29 | Argument probes: unknown flag, missing value, duplicate `--bundle`, positional, duplicate non-cwd `--root`                                                                                                         | `ARGUMENT_INVALID`, exit 2 each                                                                 |
|  30 | Malformed input: `null` artifact, JSON arrays, `records` as object, `acquisition` as string, `ladderStepsTried` as string, opaque string attempts                                                                  | all exit 1 with correctly-pathed codes                                                          |
|  31 | Boundary values: `retrievalEvents` 0 ×3, year `0099`, `2999-12-31`, `+05:30` offset, `25:00:00Z`, missing `counts`/`reconciliation`/`extractions`/`includedSourceIds`, excluded record without `primaryReasonCode` | recorded in M-3, M-4; no other defect                                                           |
|  32 | Discovery: uppercase filenames, unrelated `.json`, second task with only a packet, empty task stem, nested directories                                                                                             | M-5 and I-4 as recorded; partial detection correct                                              |
|  33 | Checker invoked from a copied path (`isMainModule` robustness)                                                                                                                                                     | exit 0, ran correctly                                                                           |
|  34 | `git status --porcelain` before and after the review                                                                                                                                                               | clean apart from gitignored `node_modules/` and this report                                     |
|  35 | `pnpm verify` re-run at the final branch state, with this report present                                                                                                                                           | **exit 0**; `prettier --check` clean on this file, so the report itself does not break the gate |

Probe scripts were written to a scratch directory outside every repository and are not part of this
branch; every mutation operated on temporary copies, and no repository file was modified.

## Known uncertainties

- I could not observe the case-sensitivity behaviour in M-5 directly, because this worktree is on
  NTFS. That finding is derived from reading `scripts/evidence/research-integrity.mjs:987-998` plus
  the fact that CI runs `ubuntu-latest`; it is graded Minor partly for that reason.
- I did not evaluate whether any SBLA-009 scientific claim is true, entailed, or adequately qualified.
  That is the SBLA-010 evidence review and is explicitly out of this artifact's scope, which the
  candidate documents correctly.
- The 1,789 omitted per-record retrieval values in the real screening artifact are currently
  unreconciled because `RETRIEVAL_EVENTS_DEFAULT_MISSING` suppresses the derivation
  (`scripts/evidence/research-integrity.mjs:521-526`). That suppression is deliberate and correct, but
  it means the remediation that adds `fieldContract.retrievalEventsDefault` will newly expose whether
  the declared 1,361 / 252 / 1,109 totals actually close. I did not pre-compute that outcome, because
  doing so would be remediation work on an artifact I do not own.
- I did not run `pnpm test:e2e`, `test:a11y`, `test:visual`, or `test:performance`. None of them touch
  this change, and `pnpm verify` is the required gate for it.

## Files created or modified

- Created: `reviews/releases/SBLA-009-research-integrity-gate-r1.md` (this report).
- Nothing else. No implementation, test, fixture, documentation, or ledger file was touched.

## Required reviewer action

**FAIL.** Per `docs/runbooks/operating-policy.json` (`passRequiresZeroCritical`,
`passRequiresZeroImportant`, `failedReviewAction: "bounded-remediation-then-full-artifact-recheck"`),
Codex opens **one bounded remediation claim** — not a reopened builder claim — and addresses:

1. **I-1** — implement search-companion reconciliation, or correct the handoff and the authoring doc
   to state that the search companion is not reconciled.
2. **I-2** — enforce the access-level closed vocabulary and require the access breakdown to account
   for every included source.
3. **I-3** — enforce the `basis` closed vocabulary and require `reportedFacts` to be present.
4. **I-4** — fail on a root with no companion directories; fix the duplicate-`--root` sentinel.
5. **I-5** — correct `docs/authoring/research-integrity-errors.md:26`.

M-1 through M-5 are non-blocking and each carries its impact and destination above; M-1 should be
resolved alongside I-2 if that remediation touches the acquisition contract. **Do not change the
determinism behaviour for M-2** — it is verified correct; only the test is weak.

After remediation, one complete-artifact recheck (`-r2`) by this same independent role. This report is
append-only and immutable; a second round creates
`reviews/releases/SBLA-009-research-integrity-gate-r2.md` and never edits this file.

Integration into `main` remains blocked until that recheck returns PASS. As the candidate handoff
already states, integration would not by itself make the current SBLA-009 research candidate
acceptable: Account A must still satisfy this gate on its eleven owned artifacts, all existing content
and cross-link gates must pass, and the single complete SBLA-010 scientific review is still owed.

## Acceptance criteria applied

|   # | Criterion                                                                                 | Result                                  |
| --: | ----------------------------------------------------------------------------------------- | --------------------------------------- |
|   1 | Active coordination claim verified before writing                                         | PASS                                    |
|   2 | Candidate reviewed at the immutable commit named in the claim                             | PASS                                    |
|   3 | Handoff's file checksums and line counts reproduce                                        | PASS                                    |
|   4 | Handoff's frozen-candidate detection proof reproduces exactly                             | PASS                                    |
|   5 | Handoff's `pnpm verify` result reproduces                                                 | PASS                                    |
|   6 | Gate is deterministic and non-mutating                                                    | PASS                                    |
|   7 | Gate is path-portable and handles malformed input without crashing or silently skipping   | PASS                                    |
|   8 | Bundle discovery finds and fails partial bundles; no silent skip of a present bundle      | PASS                                    |
|   9 | Gate is compatible with, and correct against, the current SBLA-009 artifacts              | PASS                                    |
|  10 | No false pass reachable by editing recorded values without fixing the underlying evidence | **FAIL** (I-2, I-3)                     |
|  11 | All four companions are reconciled against one another, as claimed                        | **FAIL** (I-1)                          |
|  12 | A misdirected or absent repository root cannot report PASS                                | **FAIL** (I-4)                          |
|  13 | No false failure on a well-formed, honestly recorded bundle                               | **FAIL** (I-2, false-failure direction) |
|  14 | Shipped documentation is executable and matches enforced behaviour                        | **FAIL** (I-5; M-1)                     |
|  15 | Tests genuinely exercise every claimed invariant                                          | **FAIL, non-blocking** (M-2)            |
|  16 | Reviewer wrote only its single permitted append-only path                                 | PASS                                    |

Mandatory criteria 10 through 14 are not met. **Verdict: FAIL — 0 Critical, 5 Important, 5 Minor.**
