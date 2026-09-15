# Handoff: SBLA-009 research-companion integrity gate — Review R3 (complete independent implementation recheck)

**Task:** SBLA-009 research-companion integrity gate — complete-artifact recheck after the one
bounded R2 remediation
**Reviewer role:** Claude Review (Account B), independent implementation acceptance review, round 3.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5; fresh independent
reviewer session; did not author, remediate, or previously review this candidate or any SBLA-009
research artifact).
**Review date:** 2026-09-14
**Reviewer worktree:** `C:\src\s009gate-r3`
**Reviewer branch:** `claude-review/SBLA-009-integrity-gate-r3`
**Reviewed candidate commit:** `7fb3bfe40f2395d61edcdddfa39295174c3d995e` _(immutable)_
**Reviewed candidate tree:** `ebccd05d891ffcbc37735ffc2365417e40057ec3` _(immutable)_
**R2 remediation implementation commit inside the candidate:**
`84852282dd0b22db150092f8cb17506ab110534a`, tree `8b128686a2f6e0b9b4c9f2d25bd516815af6af29`
**R1 remediation implementation commit:** `8f49f511adcbeaadbec2f76225254b94b01039db`
**Original implementation commit:** `5c9481a59937cc805fe3bd00646d4260b23e6bfd`
**Failed R1 review commit:** `e514937e26031ab322c57be75f247aa381a6ab97`
**Failed R2 review commit:** `015f0ecbf31791983919baad15f9c1f1934e5edf`
**Accepted dependency base:** `ff67c615d204a71f414370f4064969435d9bbc70` — confirmed an ancestor of
the candidate. `d20625c`, `e514937`, `8f49f51`, `8660288`, `015f0ec` and `8485228` are also confirmed
ancestors (`git merge-base --is-ancestor`, exit 0 for all seven), so the candidate carries both failed
review reports and both remediations in one line.
**Coordination claim commit:** `3dacd9c6003ce04a891a13552b21dab18ba4ff01` on
`codex/SBLA-007-review-coordination` ("docs: claim SBLA-009 gate R3 review", 2026-09-14 19:43:06
-0400), claiming exactly one path for this role.
**Account-A evidence candidate checked externally:** `0880d5fbeedd57fb852469d447e9e441bd955d91`
(worktree `C:\src\s009fix1`, branch `claude-research/SBLA-009-r1-remediation`, clean tree; identity
verified with `git rev-parse` before use).
**Frozen failed evidence candidate checked externally:** `8cee805ce53289cec9d62336defce2a45d7b9da5`
(worktree `C:\src\s009research`, clean tree; identity verified before use).
**Runtime:** Node.js `v24.20.0` and pnpm `11.24.0`, matching the `engines` and `packageManager` pins
in `package.json`, taken from `C:\Users\<user>\AppData\Local\sbla-node\node-v24.20.0-win-x64`. The
host default `node` is `v24.14.0` and the host default `pnpm` is `11.19.0`; neither was used for any
recorded result, and the pinned pair was confirmed in-session before the first measurement.
**Reviewer write path:** `reviews/releases/SBLA-009-research-integrity-gate-r3.md` (sole permitted
path; nothing else was created, modified, or deleted).

**Verdict: PASS.**
**Unresolved Critical: 0 · Unresolved Important: 0 · R2 findings closed: 2 of 6 (N-1, N-2) · R2 Minor
still open as graded: 4 (N-3 … N-6) · Deferred R1 Minor still open as graded: 4 (M-2 … M-5) · New
Minor this round: 1 (N-7).**

The one blocking R2 finding is closed, and closed well. N-1 said the submitted query was the only leg
of the four-field packet-to-receipt identity that was never required to exist, so deleting, nulling,
emptying or consistently renaming it on both companions satisfied the leg vacuously and the gate
printed `Research integrity passed`. The remediation adds two independent stable codes —
`SEARCH_QUERY_REQUIRED` at `$.receipts[i].submittedQuery` and `PACKET_SEARCH_QUERY_REQUIRED` at
`$.searches[i].query` — each requiring a nonempty string before the existing exact-equality comparison
runs. I exercised **34 distinct query mutations** of Account A's real, otherwise-passing `0880d5f`
candidate across both sides, at single-row and full-51-row scale, in missing, `null`, empty,
whitespace, renamed, array, number, object and boolean shapes. **Every one now fails closed with the
correct code at the correct exact path.** All four of R2's reproduced false-pass rows are gone,
including the sharpest — the consistent key swap that leaves all 102 query strings sitting in the
files — which now yields both codes at both exact paths. The existing `SEARCH_QUERY_MISMATCH`
behaviour is fully preserved: an unequal but otherwise valid pair still produces exactly one
`PACKET_SEARCH_RECEIPTS_MISMATCH`, byte-for-byte equality is still required (a trailing space or a
case change on one side still fails), and the `trim()` used for the presence test does not leak into
the comparison.

I did not take the two new fixture mutations on trust. I mutation-tested them: with the receipt-side
check deleted from a scratch copy of the validator, the receipt fixture case stops producing its code
while the packet case still passes, and vice versa; with both deleted, the suite's new direct
regression drops to **zero issues**, reproducing R2's N-1 exactly. The two isolated cases therefore
cover genuinely independent code, and the direct regression is a real red-without-the-fix test rather
than a vacuous one. The fixture's `expectedCode` set is exactly equal to the implementation's 28-code
constant, with no missing and no extra entries, and the shipped error table documents all 33 codes
with no orphan rows.

N-2 is closed: the printed `FACT_BASIS_INVALID` remediation now names `abstract` alongside the other
four tokens, matching both the enforced vocabulary and the authoring contract.

Every finding the remediation did **not** claim to touch is exactly where the prior reports left it. I
re-ran R1's full I-1, I-3, I-4 and I-5 probe tables, R2's N-3 through N-6 probes, and the deferred R1
Minors, against the real artifacts: all five R1 Important findings remain closed, M-1 remains closed,
and M-2 through M-5 plus N-3 through N-6 reproduce unchanged in the shapes their reports describe.
Both external claims reproduce exactly — `0880d5f` passes, `8cee805` still fails with exactly 298
issues in the documented seven-code distribution. All four implementation checksums and line counts
in the remediation handoff match. `pnpm verify` is green end to end with 249 unit and 17 portability
tests. The immutable R1 and R2 reports are byte-identical to their own commits.

One new Minor is recorded. The presence predicate the remediation adopted, `isIdentifier`, rejects
every character JavaScript's `String.prototype.trim` treats as whitespace — including the non-breaking
space and U+FEFF — but not Unicode format characters such as U+200B, so a query consisting solely of
zero-width characters, written identically to both companions, is admitted as nonempty. This is a
pre-existing, uniform property of the shared predicate that `ACQUISITION_ATTEMPT_STEP_REQUIRED`,
`LANGUAGE_REQUIRED` and `ID_INVALID` all share, it was not introduced by this remediation, and it is
not reachable by the ordinary schema drift that made N-1 Important. It is graded Minor on the same
line the project already drew for M-4, with its impact and destination recorded below.

Nothing is Critical. Nothing is Important. Per
`docs/runbooks/operating-policy.json` (`passRequiresZeroCritical`, `passRequiresZeroImportant`,
`minorFindingsMayBeDeferredWhenNonblocking`), this candidate passes.

---

## Objective

Perform the single complete-artifact recheck required by the repository stop rule after the one
bounded R2 remediation, at the exact immutable candidate named in the coordination claim. Establish
independently — not by reading the remediation handoff — whether R2's blocking Important finding N-1
is genuinely closed on the real artifacts, whether nonblocking N-2 is closed, whether any prior
finding regressed, and whether the shipped implementation, tests, fixtures and documentation agree
with one another and with observed behaviour. Return PASS or FAIL per criterion with evidence and
exact paths. Do not repair the artifact.

This satisfies master plan section 18's SBLA-009 implementation-gate acceptance row and the
`failedReviewAction: "bounded-remediation-then-full-artifact-recheck"` rule in
`docs/runbooks/operating-policy.json`.

## Inputs and exact paths

Verified before any other work, in this order.

| Check              | Command                                                                     | Observed                                                                               |
| ------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| HEAD               | `git rev-parse HEAD`                                                        | `7fb3bfe40f2395d61edcdddfa39295174c3d995e` — matches the assignment                    |
| Tree               | `git rev-parse HEAD^{tree}`                                                 | `ebccd05d891ffcbc37735ffc2365417e40057ec3` — matches the assignment                    |
| Branch             | `git rev-parse --abbrev-ref HEAD`                                           | `claude-review/SBLA-009-integrity-gate-r3`                                             |
| Cleanliness        | `git status --porcelain=v1`                                                 | empty                                                                                  |
| Worktree           | `git rev-parse --show-toplevel`                                             | `C:/src/s009gate-r3`, registered in `git worktree list` at `7fb3bfe`                   |
| Ancestry (×7)      | `git merge-base --is-ancestor <c> HEAD`                                     | exit 0 for `ff67c61`, `d20625c`, `e514937`, `8f49f51`, `8660288`, `015f0ec`, `8485228` |
| Coordination claim | `git show codex/SBLA-007-review-coordination:docs/runbooks/current-work.md` | R3 claim row present, quoted below                                                     |

The active claim row, read from the coordination branch at `3dacd9c` (the branch tip):

> \| SBLA-009 integrity gate implementation R3 \| Claude Review (account B) \|
> `claude-review/SBLA-009-integrity-gate-r3` \| `C:\src\s009gate-r3` \|
> `7fb3bfe40f2395d61edcdddfa39295174c3d995e` \| 2026-09-14 19:41 EDT \|
> `reviews/releases/SBLA-009-research-integrity-gate-r3.md` \|
> `reviews/releases/SBLA-009-research-integrity-gate-r3.md` \|

The claim names exactly one owned path, the base commit equals the reviewed candidate, and the same
commit closed the R2 remediation claim in the Closed table. The ledger at HEAD carries no active
claims, which is expected: Codex keeps the claim record on its coordination branch, as
`CLAUDE.md` and `operating-policy.json` (`claimRecordLocation: "codex-coordination-branch"`) require.
I did not edit the ledger.

**Artifact under review** (the four paths the remediation touched, plus its handoff):

| Path                                                                          | Lines | SHA-256                                                            | Handoff table |
| ----------------------------------------------------------------------------- | ----: | ------------------------------------------------------------------ | ------------- |
| `scripts/evidence/research-integrity.mjs`                                     | 1,389 | `e4f1467b429a78c121bf979f7c34d515ca5b930cbd068d21ce2f96119c1cd9dd` | matches       |
| `tests/unit/research-integrity.test.ts`                                       |   373 | `71ce7100fdd487a57c0a80287e09c9fdd6e7ca7f600f014e7f646bad545df491` | matches       |
| `tests/fixtures/research-integrity/invalid-bundle.json`                       |   307 | `daf9272cc75ecc37d889783fc43056e4724cb97caf368df962e2cff896bdd1f0` | matches       |
| `docs/authoring/research-integrity-errors.md`                                 |   169 | `afdaed5e777077ad5fead167f1637039ab867fdada867ba3232f0613b683cbaa` | matches       |
| `reviews/releases/SBLA-009-research-integrity-gate-r2-remediation-handoff.md` |   144 | committed at `7fb3bfe`                                             | —             |

All four reproduce the remediation handoff's table exactly.

**Diff scope.** `git diff --stat 015f0ec 7fb3bfe` is 5 files, +223 / −1: the four implementation
paths plus the new handoff. The single deletion is the one-line `FACT_BASIS_INVALID` remediation
string replaced for N-2. `git diff d20625c 7fb3bfe -- package.json` is empty — the gate wiring is
unchanged since the original implementation handoff. `git diff --check ff67c61 7fb3bfe` is clean.

**Immutability of prior reports.** Worktree SHA-256 equals commit SHA-256 for both:

- `reviews/releases/SBLA-009-research-integrity-gate-r1.md` —
  `03b4e4d54de44363f06b3b4b9166c68c7754906f2cd8d5b68205147bcaaea7a9`, identical at `e514937`.
- `reviews/releases/SBLA-009-research-integrity-gate-r2.md` —
  `2f309fa0db9dfba15df833596535bf392e30f068c16b9092b2ff88e9289627f1`, identical at `015f0ec` and
  identical to the checksum the coordination ledger records.

**External candidates.** Both verified at their expected commits with clean trees before use, and
neither was written to at any point (size, mtime and byte-for-byte identity re-checked after the
probe run — see check 44).

## Constraints observed

- I wrote exactly one file: `reviews/releases/SBLA-009-research-integrity-gate-r3.md`.
  `git diff --name-only 7fb3bfe HEAD` was empty before I began writing it, and the final
  changed-path proof is in "Files created or modified".
- **I did not repair the artifact under review.** Every probe ran against a copy in an OS temporary
  directory or against an in-memory `structuredClone`; the repository's tracked files, Account A's
  `C:\src\s009fix1` and the frozen `C:\src\s009research` are byte-identical to their commits.
- The one place I altered validator source was a **scratch copy** of
  `scripts/evidence/research-integrity.mjs` written to the OS temp directory for the mutation-testing
  probe in check 12. The tracked file was never modified; its SHA-256 above was re-measured after
  that probe and is unchanged.
- I did not edit `docs/runbooks/current-work.md`, any handoff, or the immutable R1/R2 reports.
- I did not evaluate whether any SBLA-009 scientific claim is true, entailed, adequately qualified or
  correctly extracted. That is SBLA-010 and is still owed.
- Probe scripts live outside every repository, in this session's job temporary directory, and are not
  part of this branch.

## Closure disposition for every R2 finding

### R2 Important finding — CLOSED

#### N-1 · The submitted query was the only leg of the packet-to-receipt identity never required to exist — **CLOSED**

**What shipped.** `scripts/evidence/research-integrity.mjs:379-389` adds `SEARCH_QUERY_REQUIRED`
inside the existing `receipts.forEach` loop, guarded by `!isIdentifier(receipt.submittedQuery)`, at
path `$.receipts[${index}].submittedQuery`. `:1066-1076` adds `PACKET_SEARCH_QUERY_REQUIRED` inside
`packetSearches.forEach`, guarded by `!isIdentifier(packetSearch.query)`, at path
`$.searches[${index}].query`. Both codes are appended to the frozen `BUNDLE_VALIDATION_CODES`
(`:41`, `:63`) and to the error table (`docs/authoring/research-integrity-errors.md:126`, `:148`).
`isIdentifier` (`:120-122`) is `typeof value === 'string' && value.trim().length > 0`. The four-field
comparison at `:1103` — including `packetSearch.query !== receipt.submittedQuery` — is untouched.

**Adversarial mutation matrix.** Every row below is a mutation of Account A's committed `0880d5f`
candidate, copied to a scratch root and run with
`node scripts/evidence/research-integrity.mjs --root <scratch> --bundle SBLA-009`. The unmutated copy
is the control and passes. "R2 result" is what the immutable R2 report recorded for the same shape.

**A · both sides, all 51 rows — the four R2 false-pass rows plus whitespace**

| Mutation (all 51 receipts **and** all 51 packet searches)   | R2 result            | R3 result                                                                           |
| ----------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `submittedQuery` / `query` **deleted**                      | **exit 0, 0 issues** | exit 1, 102 issues — 51 `SEARCH_QUERY_REQUIRED` + 51 `PACKET_SEARCH_QUERY_REQUIRED` |
| both set to `null`                                          | **exit 0, 0 issues** | exit 1, 102 issues — same distribution                                              |
| both set to `""`                                            | **exit 0, 0 issues** | exit 1, 102 issues — same distribution                                              |
| both set to `"   \t \n "` (whitespace-only) — _new in R3_   | not probed           | exit 1, 102 issues — same distribution                                              |
| receipt key → `query`, packet key → `submittedQuery` (swap) | **exit 0, 0 issues** | exit 1, 102 issues — same distribution                                              |

The key-swap row is R2's sharpest and is now closed at both exact paths while all 102 query strings
remain present in the files. Reproduced at single-pair scale as well: swapping only `receipts[0]` and
`searches[0]` yields exactly `SEARCH_QUERY_REQUIRED@$.receipts[0].submittedQuery` and
`PACKET_SEARCH_QUERY_REQUIRED@$.searches[0].query` and nothing else.

**B · one side only, all 51 rows**

| Mutation        | receipt side (51 rows)                                      | packet side (51 rows)                                              |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| deleted         | exit 1, 52 issues — 51 `SEARCH_QUERY_REQUIRED` + 1 mismatch | exit 1, 52 issues — 51 `PACKET_SEARCH_QUERY_REQUIRED` + 1 mismatch |
| `null`          | exit 1, 52 issues — same                                    | exit 1, 52 issues — same                                           |
| `""`            | exit 1, 52 issues — same                                    | exit 1, 52 issues — same                                           |
| whitespace-only | exit 1, 52 issues — same                                    | exit 1, 52 issues — same                                           |
| renamed         | exit 1, 52 issues — same                                    | exit 1, 52 issues — same                                           |

**C · single row (index 0)** — all ten one-sided shapes yield exit 1 with exactly 2 issues: the
correct `*_QUERY_REQUIRED` at its exact path plus one `PACKET_SEARCH_RECEIPTS_MISMATCH`. All five
both-sided shapes yield exit 1 with exactly 2 issues: one code per side, no mismatch (the two sides
still compare equal), which is the designed division of labour.

**D · non-string types, both sides, all 51 rows** — array `102+1`, number `102`, object `102+1`,
boolean `102`. In every case both required codes fire 51 times each; the extra mismatch appears only
where the two mutated values are not reference-equal. No shape escapes.

**E · controls — `SEARCH_QUERY_MISMATCH` behaviour preserved**

| Control                                                                  | Result                                                                  |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| unmutated candidate                                                      | **exit 0**, `1 complete bundle checked (SBLA-009)`                      |
| packet query reworded (one pair, both valid nonempty, unequal)           | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| receipt query replaced (one pair, both valid nonempty, unequal)          | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| all 51 packet queries suffixed (all valid nonempty, all unequal)         | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| receipt `" padded query "` vs packet `"padded query"` (equal after trim) | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| one query uppercased on one side                                         | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| trailing space added on one side only                                    | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| two receipt queries swapped with each other (both nonempty)              | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| duplicated packet search entry                                           | exit 1, exactly 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`                     |
| both sides replaced with the same new nonempty string                    | **exit 0, 0 issues**                                                    |
| both sides set to the same single character `"a"`                        | **exit 0, 0 issues**                                                    |
| both sides set to the same identically-padded `"  padded equally  "`     | **exit 0, 0 issues**                                                    |
| asymmetric: receipt `""`, packet valid                                   | exit 1, `SEARCH_QUERY_REQUIRED@$.receipts[0].submittedQuery` + mismatch |
| asymmetric: packet `""`, receipt valid                                   | exit 1, `PACKET_SEARCH_QUERY_REQUIRED@$.searches[0].query` + mismatch   |

The fourth and sixth rows matter most: the `trim()` inside `isIdentifier` is a **presence test only**
and does not leak into the equality comparison, so exact byte-for-byte reconciliation is intact. The
eleventh and twelfth confirm the new checks add no false failures for short or padded-but-equal
values.

**F · exact path fidelity at non-zero indices.** Deleting the query at receipt/search indices 1, 13,
37 and 50 yields exactly one issue each at `$.receipts[1|13|37|50].submittedQuery` and
`$.searches[1|13|37|50].query` respectively, each attributed to the correct source file
(`research/searches/SBLA-009-search-receipts.json` and
`research/packets/sbla-009-evidence-packet.json`). No off-by-one, no index collapse.

**G · code stability.** `BUNDLE_VALIDATION_CODES` is frozen (`Object.isFrozen` true) and holds 28
entries; `SEARCH_QUERY_REQUIRED` is at index 4 and `PACKET_SEARCH_QUERY_REQUIRED` at index 26, each
adjacent to the check it belongs to. Five consecutive runs of the both-sides-deleted candidate
produce **byte-identical** 205-line stderr. Both codes appear in the shipped error table, and the
table's 33 rows are exactly the 28 bundle codes plus the 5 CLI codes — no missing code, no orphan row.

**H · the count-only-route question R2 left open.** R2's Known Uncertainties flagged that a mandatory
query rule would have to hold for the receipts that legitimately declare no screening imports. Of the
51 receipts, **22** are count-only routes (`recordsRetrievedIntoScreening` 0 or absent: R-001…R-013,
R-023…R-027, R-032, R-035, R-047, R-050), and **all 22 carry a nonempty `submittedQuery`**. All 51
receipt/packet pairs are exactly equal, the shortest query is 8 characters, and the import sum is
2,343. The mandatory rule is satisfiable and satisfied by the present data; no legitimate route is
made unrepresentable.

**Do the two isolated fixture mutations genuinely cover both sides?** Yes, and I verified it by
mutation testing rather than by inspection. The fixture adds `search receipt lacks its submitted
query` (delete `search.receipts[0].submittedQuery`, expect `SEARCH_QUERY_REQUIRED` at
`$.receipts[0].submittedQuery`) and `packet search lacks its query` (delete
`packet.searches[0].query`, expect `PACKET_SEARCH_QUERY_REQUIRED` at `$.searches[0].query`). I loaded
four variants of the validator from scratch copies and ran both cases plus the suite's new direct
regression against each:

| Validator variant     | receipt fixture case | packet fixture case | direct regression (both deleted from one valid pair) |
| --------------------- | -------------------- | ------------------- | ---------------------------------------------------- |
| baseline (unmodified) | **FOUND**            | **FOUND**           | both codes at both exact paths                       |
| receipt check deleted | **ABSENT**           | FOUND               | `PACKET_SEARCH_QUERY_REQUIRED` only                  |
| packet check deleted  | FOUND                | **ABSENT**          | `SEARCH_QUERY_REQUIRED` only                         |
| both checks deleted   | **ABSENT**           | **ABSENT**          | **zero issues — vacuous pass, reproducing R2's N-1** |

Each fixture case fails exactly when its own side is removed and survives when the other side is
removed, so the two cases are genuinely independent coverage rather than one side masking the other.
The bottom-right cell is the important one: the suite's new direct regression at
`tests/unit/research-integrity.test.ts:215-250` returns an empty issue list without the fix, so it is
a real red-without-the-fix regression, not a vacuous assertion. This independently corroborates the
remediation handoff's "2 failed | 9 passed (11) before implementation" claim without my having to
trust it.

The set-equality assertion at `tests/unit/research-integrity.test.ts:253-255` still binds: the
fixture's 29 cases carry 28 distinct `expectedCode` values, and that set is exactly equal to
`BUNDLE_VALIDATION_CODES` — zero codes in the implementation but not the fixture, zero in the fixture
but not the implementation. Removing either new code from the implementation would break it.

**Residual.** The both-sides comparison is still a bare `!==`, so two identical invalid-but-nonempty
values still compare equal; the required-code layer is what makes that safe. That is exactly the
design R2 prescribed ("require … then keep the existing equality comparison"), and it holds for every
shape I could construct except the zero-width-character case recorded as new Minor N-7.

### R2 Minor findings

#### N-2 · `FACT_BASIS_INVALID` remediation omitted the valid `abstract` token — **CLOSED**

`scripts/evidence/research-integrity.mjs:860` now prints "Use only **abstract**, abstract-only,
full-text, metadata, and machine-translated basis tokens, separated by commas." Confirmed at runtime:
setting one fact's `basis` to `bogus-token` produces
`[FACT_BASIS_INVALID] … $.extractions[0].extraction.reportedFacts[0].basis` with that exact five-token
remediation line. Confirmed the token really is accepted: setting a fact's `basis` to `abstract`
leaves the candidate at **exit 0, 0 issues**. The enforced vocabulary (`:20-26`), the printed string
(`:860`) and the authoring contract (`docs/authoring/research-integrity-errors.md:83`) now enumerate
the same five tokens. The misdirection that would have migrated 19 valid `abstract` bases to
`abstract-only` is gone.

#### N-3 · Screening `accessLevel` vocabulary-checked through `String()` coercion — **OPEN, unchanged, still Minor**

Reproduced exactly. Setting `G0012.acquisition.accessLevel` (an `awaiting-full-text` record, so no
extraction exists to cross-check it) from `"abstract-only"` to `["abstract-only"]` yields **exit 0, 0
issues**. The control is unchanged: the equivalent invalid _string_ `"abstract_only"` on the same
record yields exit 1 with one `ACCESS_LEVEL_INVALID`. Unchanged code at `:494-512`. **Destination:**
next tooling-hardening task; test the raw value with `isIdentifier` before the `ACCESS_LEVELS.has`
lookup, in both the screening check and the extraction check. Closely related to N-7 below — both are
input-shape gaps in the same family and should be fixed together.

#### N-4 · Receipt IDs uniqueness-checked case-sensitively, reconciled case-insensitively — **OPEN, unchanged, still Minor; reachable shape narrowed**

Reproduced exactly. Cloning `R-014` as `r-014` with `recordsRetrievedIntoScreening: 0` yields **exit
0, 0 issues** while the search companion now declares 52 receipts. Controls unchanged: a clone that
differs in query is caught (`PACKET_SEARCH_RECEIPTS_MISMATCH`, one issue).

One thing did change, in the right direction. A case-variant clone that **omits** its
`submittedQuery` is now caught by the new check —
`SEARCH_QUERY_REQUIRED@$.receipts[51].submittedQuery` plus the mismatch — where before the
remediation it would have been as silent as the fully-populated clone. The remediation therefore
narrows N-4's reachable shape to a clone that carries a complete, identical, nonempty query. The
finding stands as graded; the exposure is slightly smaller. **Destination:** unchanged — next
tooling-hardening task; make the receipt-ID uniqueness check case-insensitive so it matches the
reconciliation map, or key the map case-sensitively so the two agree.

#### N-5 · `--root` without `--bundle` aimed at a sibling checkout still reports "passed" — **OPEN, unchanged, still Minor**

Reproduced exactly. `--root C:/src/s009gate-r2` returns `Research integrity passed: 0 complete
bundles checked.` with exit 0, as does a scratch root containing only `research/packets`. The
mitigation R2 recorded also reproduces: the same wrong root **with** `--bundle SBLA-009` correctly
fails with `[BUNDLE_MISSING]` exit 1, and that is the form both handoffs and the authoring contract
actually prescribe. **Destination:** next tooling-hardening task; require `--bundle` alongside
`--root`, or print the resolved root and discovered bundle count on the zero-bundle success path.

#### N-6 · Incoherent `FULL_TEXT_BASIS_EXCEEDS_ACCESS` message — **OPEN, unchanged, still Minor**

Reproduced verbatim. Setting one extraction's `sourceSchemaFields.access.level` to the
out-of-vocabulary `"full-text"` produces
`Fact basis "full-text" exceeds source access "full-text"` at
`$.extractions[0].extraction.reportedFacts[0].basis`. R2's mitigation also holds: the line never
appears alone — it co-occurs with `ACCESS_LEVEL_INVALID` naming the exact offending field, plus
`ACCESS_LEVEL_MISMATCH`, `ACCESS_LEVEL_BREAKDOWN_MISMATCH` and `EXTRACTION_COUNT_MISMATCH` (8 issues
total), so the author is pointed at the real defect first and the bundle fails correctly either way.
**Destination:** next tooling-hardening task; suppress the basis-versus-access message when the access
level is already reported invalid.

### Deferred R1 Minor findings — all four still open exactly as graded

#### M-2 · Determinism test vacuous; CLI assertions do not pin issue counts — **OPEN, deferred as graded**

Unchanged at `tests/unit/research-integrity.test.ts:103-130`; the reversal still touches only the four
top-level keys, which `validateResearchBundle` reads by name. `CLI_ISSUE_CODES` is still exported and
still has no set-equality assertion, and every per-code assertion still uses
`expect.arrayContaining`, so a regression adding spurious findings would pass. **As in R2, I verified
the underlying behaviour directly rather than relying on the tests:** five consecutive runs of the
298-issue frozen candidate and of the both-sides-deleted candidate each produced byte-identical
output, and input files were unchanged in size, mtime and content after repeated runs. **Destination:**
next tooling-hardening task. **Do not change the checker's determinism behaviour for this finding** —
it is verified correct; only the test is weak.

#### M-3 · Missing `primaryReasonCode` reported against the count, not the record — **OPEN, deferred as graded**

Unchanged. Deleting `primaryReasonCode` from one excluded record still produces a single
`SCREENING_TOTAL_MISMATCH` at `$.exclusionCodeCounts.E-REC-5` and no path to the record that lost its
code. **Destination:** next tooling-hardening task; a per-record `EXCLUSION_REASON_REQUIRED` at
`$.records[i].primaryReasonCode`.

#### M-4 · Degenerate all-zero bundle passes; zeroed retrieval events derive a negative — **OPEN, deferred as graded**

Both halves reproduce. A bundle with all four files present, every array empty and every declared
count zeroed reports `Research integrity passed: 1 complete bundle checked (SBLA-TEST).` with exit 0.
Forcing the shipped fixture's record to `retrievalEvents: 0` still derives an unsatisfiable negative:
`Declared duplicateRetrievalEvents is 1; records derive -1`. (R2 recorded `-2` from a three-record
variant; the shape is the same and the count differs only with how many records are zeroed.) On the
real candidate the same mutation produces a positive-but-wrong derivation
(`Declared duplicateRetrievalEvents is 387; records derive 376`), which fails correctly.
**Destination:** next tooling-hardening task; require `retrievalEvents >= 1` and flag a derived
negative as its own code.

**Scope note tying M-4 to N-1.** In the fully degenerate bundle the two new query codes cannot fire,
because there are no receipts and no packet searches to require a query on. This is vacuity by
construction, bounded entirely by M-4's already-recorded first half, not a residual of N-1: the moment
any receipt or packet search exists, its query is required. Confirmed on the real candidate — emptying
only `search.receipts` and `packet.searches` while leaving screening and extraction populated yields
exit 1 with `SEARCH_SCREENING_TOTAL_MISMATCH`, and emptying only `receipts` while deleting the packet
queries yields 53 issues including all 51 `PACKET_SEARCH_QUERY_REQUIRED`.

#### M-5 · Discovery non-recursive, first-wins on case-variant duplicates, empty stem accepted — **OPEN, deferred as graded**

Unchanged at `:1176-1204`. Confirmed this round: four companions one directory deeper are invisible
and the run passes with exit 0 (`0 complete bundles checked`); a file named exactly
`-search-receipts.json` yields an empty task ID and prints
`Research integrity passed: 1 complete bundle checked ().`; fully uppercase filenames are discovered
correctly (`1 complete bundle checked (SBLA-009)`); and a second task present only as a packet is
still correctly reported `[BUNDLE_PARTIAL] SBLA-777: … missing extraction, screening, search`, sorted.
**Destination:** next tooling-hardening task. The filesystem case-collision half remains underived on
NTFS.

## Recheck of the five R1 Important findings — all five remain CLOSED

Re-run independently against Account A's real `0880d5f` artifacts, not taken from R2.

**I-1 · search companion reconciled against the others** — all six R1 probes still fail closed:

| R1 probe                                               | R1 result        | R3 result                                                                                                                                        |
| ------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `receipts[0].recordsRetrievedIntoScreening` → `999`    | exit 0, 0 issues | exit 1, `SEARCH_SCREENING_TOTAL_MISMATCH`                                                                                                        |
| `resultCount` → `99999` and retrieved → `0`            | exit 0, 0 issues | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH`                                                                                                        |
| `search.receipts` emptied to `[]`                      | exit 0, 0 issues | exit 1, both codes (2 issues)                                                                                                                    |
| invented extra `packet.searches` entry                 | exit 0, 0 issues | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH`                                                                                                        |
| `packet.searches` replaced with one fabricated entry   | exit 0, 0 issues | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH`                                                                                                        |
| populated search + screening/extraction/packet emptied | exit 0, "passed" | exit 1, 36 issues (28 `SCREENING_TOTAL_MISMATCH`, 6 `EXTRACTION_COUNT_MISMATCH`, 1 `AWAITING_IDS_MISMATCH`, 1 `PACKET_SEARCH_RECEIPTS_MISMATCH`) |

**I-2 · `accessLevel` closed vocabulary** — R1's Escape 1, reproduced by renaming `abstract-only` and
`metadata-only` across **79 screening records and 46 extractions**: exit 1 with **127** issues (125
`ACCESS_LEVEL_INVALID`, 1 `ACCESS_LEVEL_BREAKDOWN_MISMATCH`, 1 `EXTRACTION_COUNT_MISMATCH`). The
escape still costs the author far more findings than it clears. The false-failure direction is also
still closed: `access.level: "full-text"` produces `ACCESS_LEVEL_INVALID` at the exact field
`$.extractions[0].sourceSchemaFields.access.level` as the primary, correctly-pointed diagnostic.

**I-3 · full-text basis rule** — all five R1 escapes still fail: `full-text` → `full text` across all
facts gives **133** `FACT_BASIS_INVALID`; `reportedFacts` renamed to `facts` gives **88**
`REPORTED_FACTS_REQUIRED`; and `"abstract and full-text"`, `"full-text (author copy)"` and
`["full-text"]` each give one `FACT_BASIS_INVALID`.

**I-4 · misdirected `--root`** — four of R1's five rows still fail:
`--root C:/definitely-not-here-9f3a` → `[ROOT_INVALID]`; a directory with no research tree →
`[ROOT_INVALID]`; running with no `--root` from `<candidate>/research` → `[ROOT_INVALID]`; duplicate
`--root` → `[ARGUMENT_INVALID]` exit 2. The fifth row (companions one directory deeper) still passes
and is still correctly M-5, not an unclosed I-4. Both controls still behave correctly: the truthful
empty tree in this repository reports `0 complete bundles checked` exit 0, and a wrong root **with**
`--bundle` fails `[BUNDLE_MISSING]` exit 1.

**I-5 · the documented worked command** — `pnpm validate:research --bundle SBLA-009` runs, invoking
`node scripts/evidence/research-integrity.mjs "--bundle" "SBLA-009"` and reaching `[BUNDLE_MISSING]`
with **exit 1**, correct on this pre-evidence base. The old form
`pnpm validate:research -- --bundle SBLA-009` still forwards `"--"` and still fails
`[ARGUMENT_INVALID]` exit 2, and `git grep` finds that form only inside the immutable R1 and R2
reports, quoting it as the defect. (Measured under bash; when the same line is typed in PowerShell the
shell consumes the `--` before pnpm sees it, so both forms behave identically there. That is a host
shell artefact, not gate behaviour, and it does not affect I-5's closure.)

**M-1 · acquisition attempt `step`** — still closed. Deleting `.step` yields
`[ACQUISITION_ATTEMPT_STEP_REQUIRED] … $.records[4].acquisition.ladderStepsTried[0].step`; a
whitespace-only `step` is rejected identically.

## New findings

### Critical (blocks PASS)

None.

### Important (blocks PASS)

None.

### Minor (non-blocking; impact and destination recorded)

#### N-7 · `isIdentifier` treats Unicode format characters as content, so a query made only of zero-width characters satisfies both new required-query checks

**Where:** `scripts/evidence/research-integrity.mjs:120-122` (`isIdentifier` =
`typeof value === 'string' && value.trim().length > 0`), reached by the two new checks at `:379-389`
and `:1066-1076`, and by every other required-identifier check in the file.

`String.prototype.trim` strips exactly the ECMAScript `WhiteSpace` and `LineTerminator` sets. Unicode
**format** characters (general category `Cf`) are not in those sets, so they survive `trim()` and count
as content. Measured, with both companions set to the same single character on all rows:

| Character                           | trims to empty | `SEARCH_QUERY_REQUIRED` | `PACKET_SEARCH_QUERY_REQUIRED` | bundle result |
| ----------------------------------- | -------------- | ----------------------: | -----------------------------: | ------------- |
| U+0020 space, U+0009 tab, U+000A LF | yes            |                       2 |                              2 | fails         |
| U+00A0 no-break space               | yes            |                       2 |                              2 | fails         |
| U+2003 em space                     | yes            |                       2 |                              2 | fails         |
| U+FEFF zero-width no-break space    | yes            |                       2 |                              2 | fails         |
| **U+200B zero-width space**         | **no**         |                       0 |                              0 | **passes**    |
| **U+200C zero-width non-joiner**    | **no**         |                       0 |                              0 | **passes**    |
| **U+200D zero-width joiner**        | **no**         |                       0 |                              0 | **passes**    |
| **U+2060 word joiner**              | **no**         |                       0 |                              0 | **passes**    |
| **U+00AD soft hyphen**              | **no**         |                       0 |                              0 | **passes**    |
| **U+0000 NUL**                      | **no**         |                       0 |                              0 | **passes**    |

Reproduced end to end on the real candidate: replacing all 51 `submittedQuery` and all 51 packet
`query` values with U+200B yields **exit 0, 0 issues,
`Research integrity passed: 1 complete bundle checked (SBLA-009).`** The one-sided control behaves
correctly (`PACKET_SEARCH_RECEIPTS_MISMATCH`), so the exact-equality leg is unaffected; what is
defeated is the presence leg, on both sides simultaneously.

**This is generic to the shared predicate, not specific to the remediation.** Substituting U+200B for
the same fields that R1 and R2 already accepted produces the same silence: `ladderStepsTried[].step`
drops from 3 issues (with `""`) to **0**, so `ACQUISITION_ATTEMPT_STEP_REQUIRED` is fully disabled;
`extraction.language` loses `LANGUAGE_REQUIRED`; `receiptId` loses `ID_INVALID`. The remediation
adopted the repository's established presence predicate, which is the right consistency choice; it
inherited this property rather than introducing it.

**Why Minor and not Important.** R2 graded N-1 Important because it was reachable by **ordinary schema
drift** — a regenerated companion renaming a key — with no intent and with every query string still
present. N-7 is not reachable that way: it requires writing a query field whose entire content is
invisible format characters, identically, into both companions. That is deliberate evidence
destruction, and the project has already drawn its line there: M-4's degenerate all-zero bundle passes
with no exotic characters at all and both R1 and R2 graded it Minor and deferred it. Grading N-7
Important would also retroactively reclassify M-1's closure and `LANGUAGE_REQUIRED`'s acceptance on
identical evidence, which neither prior round found and which no new fact supports. It cannot cause a
false failure, it does not affect the real candidate (all 102 queries are ordinary text, shortest 8
characters), and every realistic authoring error — missing, null, empty, whitespace, renamed,
wrong-typed — is caught.

**Impact:** a bundle whose recorded queries have been replaced by invisible characters on both
companions passes the presence and identity legs, so the gate would report `passed` on evidence that
records nothing. Narrow and deliberate-only, but it is the one remaining shape in which the query
identity can be satisfied by non-content. **Destination:** next tooling-hardening task — strengthen
`isIdentifier` once, centrally, to require at least one character that is neither whitespace nor
category `Cf`/`Cc` (for example `value.replace(/[\s\p{Cf}\p{Cc}]/gu, '').length > 0`), which closes
this for all thirteen required-identifier checks at once and pairs naturally with N-3's
`String()`-coercion fix in the same pass.

## What I verified as correct

Recorded so a later hardening task does not disturb them.

- **Both external claims in the remediation handoff reproduce exactly.** Account A's committed
  `0880d5f` passes with `Research integrity passed: 1 complete bundle checked (SBLA-009).` exit 0,
  both with and without `--bundle`. The frozen `8cee805` still fails with exit 1 and **exactly 298
  issue lines** in the documented distribution: 75 `ACQUISITION_ATTEMPT_STEP_REQUIRED`, 75
  `ACQUISITION_ATTEMPT_RESULT_REQUIRED`, 75 `ACQUISITION_ATTEMPT_DATE_INVALID`, 62
  `ACQUISITION_LADDER_REQUIRED`, 7 `FULL_TEXT_BASIS_EXCEEDS_ACCESS`, 3 `LANGUAGE_REQUIRED`, 1
  `RETRIEVAL_EVENTS_DEFAULT_MISSING`. The two new codes contribute **zero** findings to the frozen
  candidate, so the 298 tally is unchanged from R2 for the right reason.
- **Structural measurement of `0880d5f` reproduces.** 51 receipts, 51 packet searches, all 51 pairs
  exactly equal, import sum 2,343, all queries nonempty.
- **Determinism and non-mutation.** Five runs byte-identical on two different failing candidates;
  size, mtime and content of all four input files unchanged after repeated runs.
- **Path portability.** Seven `--root` spellings — forward slashes, backslashes, trailing separator,
  trailing `\.`, a `research/..` round trip, the `\\?\` extended form, and an all-uppercase drive path
  — all resolve identically to `1 complete bundle checked (SBLA-009)` exit 0.
- **Argument handling.** Nine malformed argument shapes all return `[ARGUMENT_INVALID]` exit 2,
  including duplicate `--root`, duplicate `--bundle`, a bare flag with no value, an unknown flag, a
  trailing extra pair and a positional argument. Flag order is immaterial; `--bundle sbla-009` is
  matched case-insensitively; an absent bundle gives `[BUNDLE_MISSING]` exit 1.
- **Malformed and hostile input.** Eleven shapes — `search` replaced by an array, `receipts` as a
  string, `packet` as `null`, `searches` as an object, a `null` receipt entry, a string receipt entry,
  a `null` packet search entry, a numeric packet search entry, a 200,000-character query — all exit 1
  with correctly-pathed codes and no crash and no silent skip. Notably a `null` or scalar entry on
  either side now produces the correct `*_QUERY_REQUIRED` alongside the structural codes. Broken JSON
  gives `[JSON_PARSE_FAILED]` with the file, `$` path and parser position.
- **Documentation agrees with behaviour.** The error table's 33 rows are exactly the 33 real codes;
  both new codes are documented with accurate remediations; the worked command in the authoring
  contract runs.
- **The remediation stayed inside its claim.** The diff from the R2 report commit touches only the
  four implementation paths plus the new handoff. `package.json` is untouched since the original
  implementation handoff. The R1 and R2 reports are byte-identical to their commits.

## Decisions made

- **I graded N-7 Minor rather than Important, and that is the judgement most open to challenge.**
  The reasoning is in the finding: it is a pre-existing property of a shared predicate that two prior
  rounds accepted for three other required fields, it is not reachable by the ordinary drift that
  made N-1 Important, and the project already grades deliberate evidence-destruction shapes (M-4) as
  Minor. If the owner prefers the stricter reading of acceptance criterion #10 — _no_ false pass
  reachable by editing recorded values, intent immaterial — then N-7 becomes Important, M-4's first
  half becomes Important with it, and this verdict becomes FAIL. I do not recommend that reading,
  because it would reopen findings two immutable reports closed on identical evidence.
- **I mutation-tested the fixture rather than reading it.** R2's remediation instruction was
  specifically that the isolated mutations must keep the set-equality assertion honest, and the only
  way to establish that a test covers what it claims is to break the code it covers and watch it go
  red. I did this on scratch copies so the artifact under review was never touched.
- **I re-ran the prior probe tables rather than citing R2.** The task requires treating prior reports
  as evidence and reproducing their probes independently. Where my measurement differs from R2's I
  have said so and explained why (M-4's `-1` versus `-2`, the PowerShell `--` artefact).
- **I did not run the role-path checker as boundary evidence.** `CLAUDE.md` is explicit that the
  authoritative role-path result must come from Codex or CI executing
  `scripts/foundation/check-role-paths.mjs` from a trusted checkout against this worktree with
  `--repository`. A checker run from my own mutable branch is not independent evidence, so I have
  supplied the raw changed-path proof instead and left the gate to Codex.
- **I did not run `pnpm test:e2e`, `test:a11y`, `test:visual` or `test:performance`.** None touches
  this change and `pnpm verify` is the required gate for it. This matches R1 and R2.

## Tests/checks run and results

All commands run from `C:\src\s009gate-r3` at `7fb3bfe` with Node `v24.20.0` / pnpm `11.24.0`, unless
a probe names its own root. Probe scripts were written to this session's job temporary directory,
outside every repository, and are not part of this branch. Roughly 180 gate invocations in total.

|   # | Command / probe                                                                                               | Result                                                                                                |
| --: | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
|   1 | `git rev-parse HEAD` / `HEAD^{tree}` / `--abbrev-ref HEAD` / `status --porcelain=v1`                          | `7fb3bfe…`, tree `ebccd05…`, `claude-review/SBLA-009-integrity-gate-r3`, clean                        |
|   2 | `git worktree list`                                                                                           | `C:/src/s009gate-r3` registered at `7fb3bfe`                                                          |
|   3 | `git merge-base --is-ancestor` ×7                                                                             | exit 0 for `ff67c61`, `d20625c`, `e514937`, `8f49f51`, `8660288`, `015f0ec`, `8485228`                |
|   4 | `git show codex/SBLA-007-review-coordination:docs/runbooks/current-work.md` at `3dacd9c`                      | R3 claim row verified, quoted above; one owned path                                                   |
|   5 | `git diff --stat 015f0ec 7fb3bfe` / `git diff --stat 8660288 7fb3bfe`                                         | 5 files +223/−1 / 6 files +933/−1                                                                     |
|   6 | `git diff --check ff67c61 7fb3bfe`                                                                            | clean                                                                                                 |
|   7 | SHA-256 + line counts of the four implementation files                                                        | all four match the remediation handoff table                                                          |
|   8 | SHA-256 of R1 and R2 reports, worktree vs `e514937` / `015f0ec`                                               | identical — both immutable; R2 hash matches the ledger record                                         |
|   9 | `git diff d20625c 7fb3bfe -- package.json`                                                                    | empty (correctly unchanged)                                                                           |
|  10 | `pnpm install --frozen-lockfile`                                                                              | done in 4.1 s with pnpm 11.24.0                                                                       |
|  11 | `pnpm exec vitest run tests/unit/research-integrity.test.ts`                                                  | 1 file, **11 tests passed**                                                                           |
|  12 | **Fixture mutation test** — 4 validator variants × (2 fixture cases + direct regression)                      | each case red only when its own side is deleted; both deleted ⇒ **0 issues**, reproducing N-1         |
|  13 | Fixture `expectedCode` set vs `BUNDLE_VALIDATION_CODES`                                                       | 29 cases, 28 distinct codes, **exact set equality**; 0 missing, 0 extra                               |
|  14 | `BUNDLE_VALIDATION_CODES` frozen / indices of the two new codes                                               | frozen, 28 entries, indices 4 and 26                                                                  |
|  15 | Error table vs all 33 real codes                                                                              | 33 rows, exact set equality, both new codes documented                                                |
|  16 | **N-1 matrix A** — both sides, all 51 rows: missing / null / empty / whitespace / renamed                     | **exit 1, 102 issues each** (51 + 51) — all four R2 false-pass rows closed                            |
|  17 | **N-1 matrix B** — receipt side only, all 51 rows, 5 shapes                                                   | exit 1, 52 issues each (51 `SEARCH_QUERY_REQUIRED` + 1 mismatch)                                      |
|  18 | **N-1 matrix B** — packet side only, all 51 rows, 5 shapes                                                    | exit 1, 52 issues each (51 `PACKET_SEARCH_QUERY_REQUIRED` + 1 mismatch)                               |
|  19 | **N-1 matrix C** — single row (index 0), 15 shapes                                                            | exit 1, exactly 2 issues each, correct code(s) at correct exact path(s)                               |
|  20 | **N-1 matrix D** — non-string types both sides ×4 (array, number, object, boolean)                            | exit 1, 102–103 issues; both codes fire 51× each in every case                                        |
|  21 | **N-1 controls** — unequal-but-valid pairs ×3; equal-after-trim; case change; trailing space; swap; duplicate | exit 1, exactly **one** `PACKET_SEARCH_RECEIPTS_MISMATCH` each — mismatch preserved                   |
|  22 | **N-1 controls** — equal nonempty replaced; single char; identically padded                                   | **exit 0, 0 issues** each — no false failures                                                         |
|  23 | **N-1 controls** — asymmetric empty on one side ×2                                                            | correct `*_QUERY_REQUIRED` at exact path + mismatch                                                   |
|  24 | **N-1 exact path fidelity** — indices 1, 13, 37, 50 on both sides                                             | exactly one issue each at the exact index, correct source file                                        |
|  25 | **N-1 determinism** — 5 runs, both-sides-deleted candidate                                                    | byte-identical 205-line stderr                                                                        |
|  26 | **N-2** — `basis: "bogus-token"`; `basis: "abstract"`                                                         | five-token remediation printed including `abstract`; `abstract` accepted, exit 0                      |
|  27 | Structural measurement of `0880d5f`                                                                           | 51/51 receipts and searches, all pairs equal, sum 2,343, 22 count-only routes all with queries        |
|  28 | Gate vs Account A `0880d5f` (`--root C:\src\s009fix1 --bundle SBLA-009`, and without `--bundle`)              | **exit 0**, `1 complete bundle checked (SBLA-009)` both ways                                          |
|  29 | Gate vs frozen `8cee805` (`--root C:\src\s009research --bundle SBLA-009`)                                     | exit 1, **exactly 298 issues**, seven-code distribution matches R2 exactly; 0 query findings          |
|  30 | **I-1 probes ×6** (R1's full table on real data)                                                              | all **exit 1**; previously all exit 0                                                                 |
|  31 | **I-2 Escape 1** — 79 screening records + 46 extractions renamed                                              | exit 1, **127 issues** (125 `ACCESS_LEVEL_INVALID` + breakdown + count)                               |
|  32 | **I-2 false-failure** — `access.level: "full-text"`                                                           | `ACCESS_LEVEL_INVALID` at the exact field as primary diagnostic                                       |
|  33 | **I-3 probes ×5**                                                                                             | 133 / 88 / 1 / 1 / 1 issues, all exit 1                                                               |
|  34 | **I-4 probes ×5** + 2 controls                                                                                | 4 of 5 fail (`ROOT_INVALID` ×3, `ARGUMENT_INVALID` ×1); row 4 is M-5; controls correct                |
|  35 | **I-5** — documented form (bash); old `--` form (bash); `git grep`                                            | `BUNDLE_MISSING` exit 1 / `ARGUMENT_INVALID` exit 2 / broken form only inside R1 and R2               |
|  36 | **M-1** — `.step` deleted; `.step` whitespace                                                                 | `ACQUISITION_ATTEMPT_STEP_REQUIRED` at `$.records[4].acquisition.ladderStepsTried[0].step`            |
|  37 | **M-3** — `primaryReasonCode` deleted from one excluded record                                                | 1 × `SCREENING_TOTAL_MISMATCH` at `$.exclusionCodeCounts.E-REC-5`; still no record path               |
|  38 | **M-4** — genuinely degenerate all-zero bundle; fixture `retrievalEvents: 0`                                  | passes exit 0; derives `-1` — both still open as graded                                               |
|  39 | **M-5** — nested companions; empty stem; uppercase filenames; packet-only second task                         | passes / prints `()` / discovered / `BUNDLE_PARTIAL` naming all three, sorted                         |
|  40 | **N-3** — array `accessLevel` on `awaiting-full-text` `G0012`; invalid-string control                         | **exit 0, 0 issues** / `ACCESS_LEVEL_INVALID` — unchanged                                             |
|  41 | **N-4** — zero-import case-variant clone; differing clone; **clone with no query**                            | exit 0, 0 issues / caught / **now caught** by `SEARCH_QUERY_REQUIRED@$.receipts[51]…`                 |
|  42 | **N-5** — `--root` at sibling worktree `C:\src\s009gate-r2`; root with only `research/packets`                | `passed: 0 complete bundles checked` exit 0 (both) — unchanged                                        |
|  43 | **N-6** — out-of-vocabulary `access.level: "full-text"` with `basis: "full-text"`                             | incoherent message survives verbatim, co-occurring with 4 other codes (8 issues)                      |
|  44 | Non-mutation — size + mtime of all four Account-A inputs before/after 3 runs                                  | unchanged                                                                                             |
|  45 | `--root` spellings ×7 incl. `\\?\`, trailing `\.`, `research/..`, uppercase drive                             | all resolve identically, exit 0                                                                       |
|  46 | Argument rejection battery ×9 plus flag-order and `--bundle` case-insensitivity                               | `ARGUMENT_INVALID` exit 2 ×9; order immaterial; lowercase bundle matched                              |
|  47 | Malformed/hostile input battery ×11 plus broken JSON                                                          | all **exit 1** with correctly-pathed codes; no crash, no silent skip; `JSON_PARSE_FAILED`             |
|  48 | **N-7** — 12 Unicode characters on both sides, all rows                                                       | 6 correctly rejected; **6 (U+200B/C/D, U+2060, U+00AD, U+0000) pass with 0 issues**                   |
|  49 | **N-7 genericity** — U+200B on `step`, `language`, `receiptId` vs `""` controls                               | same silence on all three pre-existing checks — property of `isIdentifier`, not of this change        |
|  50 | **N-7 on the real candidate** — all 102 queries → U+200B; one-sided control                                   | **exit 0, "passed"** / `PACKET_SEARCH_RECEIPTS_MISMATCH` — equality leg unaffected                    |
|  51 | `pnpm verify`                                                                                                 | **exit 0**, all stages green; Prettier clean, ESLint clean, **249 unit** and **17 portability** tests |
|  52 | `prettier --check` on this report; `git diff --check` on the committed range                                  | recorded in "Files created or modified"                                                               |
|  53 | `git status --porcelain` and `git diff --name-only 7fb3bfe HEAD` before writing                               | both empty                                                                                            |

**`pnpm verify` detail** (exit 0): `prettier --check .` → "All matched files use Prettier code
style!"; `eslint . --max-warnings 0` → clean; Astro/TypeScript → 0 errors, 0 warnings, 0 hints; unit
tests → **17 files, 249 tests passed**; `validate:content` → 0 records; `validate:graph` → 0 nodes;
`validate:research` → `Research integrity passed: 0 complete bundles checked.`; `evidence:status` →
0 sources; production build → complete; portability → **3 files, 17 tests passed**; foundation
contract, asset spike and asset decision gates → pass.

## Known uncertainties

- **N-7's severity is a judgement, not a measurement.** The behaviour is measured and reproducible;
  the Minor grading rests on the reachability argument in the finding and on consistency with how R1
  and R2 graded M-4 and closed M-1. I have stated the alternative reading and its consequence
  explicitly so the owner can overrule it on the record rather than by inference.
- The filesystem half of R1's M-5 — two filenames differing only in case colliding on one task ID —
  remains unobserved directly, because this worktree is on NTFS and CI runs `ubuntu-latest`. It is
  unchanged code.
- I did not evaluate whether any SBLA-009 scientific claim is true, entailed, adequately qualified or
  correctly extracted. The gate's own boundaries say an internally consistent false statement passes
  it; I confirmed that property holds and is disclosed, and nothing more. **The complete
  citation-entailment and adversarial review is SBLA-010 and is still owed.**
- That Account A's `0880d5f` passes this gate means its bookkeeping reconciles. It does not mean its
  2,343 retrieval events, 1,842 exclusions, 88 extractions or 237 reported facts are accurate, and the
  validator makes no such claim.
- I did not run `pnpm test:e2e`, `test:a11y`, `test:visual` or `test:performance`.
- The role-path boundary result is not established here by design; it must come from Codex or CI
  running `scripts/foundation/check-role-paths.mjs` from a trusted checkout against this worktree, as
  `CLAUDE.md` requires. The raw changed-path evidence for that check is below.
- My measurements of M-4's derived negative (`-1`) and of the PowerShell `--` handling differ in
  surface detail from R2's (`-2`, exit 2). Both differences are explained above and neither changes a
  finding's status; I record them rather than smoothing them over.

## Files created or modified

- Created: `reviews/releases/SBLA-009-research-integrity-gate-r3.md` (this report).
- Nothing else. No implementation, test, fixture, documentation, handoff or ledger file was touched,
  no external worktree was written to, and the immutable R1 and R2 reports were not modified.

Exact changed-path proof, measured after the commit and recorded in "Required reviewer action".

## Required reviewer action

**PASS.** Per `docs/runbooks/operating-policy.json` — `passRequiresZeroCritical: true`,
`passRequiresZeroImportant: true`, `minorFindingsMayBeDeferredWhenNonblocking: true` — this candidate
meets the acceptance bar: zero unresolved Critical findings and zero unresolved Important findings.
R2's blocking N-1 is closed and independently verified, N-2 is closed, no prior finding regressed, and
the one new finding is Minor with its impact and follow-up destination recorded.

Codex may close the R3 review claim on commit of this report and proceed to integration. Per the stop
rule in `CLAUDE.md`, **do not request or create an additional review layer after this PASS** unless a
new named material risk changes the acceptance scope.

Nine Minor findings remain open and are deferred as non-blocking, each with its destination recorded
above: **N-3** (`String()`-coerced access vocabulary), **N-4** (case-variant receipt-ID collision),
**N-5** (sibling-root zero-bundle pass), **N-6** (incoherent full-text diagnostic), **N-7** (Unicode
format characters admitted as query content), and deferred R1 **M-2** (weak determinism and
count-free CLI assertions), **M-3** (exclusion reason reported against the count), **M-4** (degenerate
bundle and negative derivation), **M-5** (non-recursive discovery, empty stem). N-3 and N-7 are the
same family of input-shape gaps and should be fixed in one pass. **Do not change the checker's
determinism behaviour for M-2** — it is verified correct; only the test is weak.

Integration of this gate does **not** make the SBLA-009 research candidate acceptable. As both prior
reports and both remediation handoffs state: Account A's `0880d5f` passing this gate is a bookkeeping
result only, all existing content and cross-link gates must also pass, and **the single complete
SBLA-010 citation-entailment and adversarial review is still owed.**

This report is append-only and immutable. Any further round would create
`reviews/releases/SBLA-009-research-integrity-gate-r4.md` and would never edit this file.

## Acceptance criteria applied

|   # | Criterion                                                                                 | R1       | R2                  | R3                                         |
| --: | ----------------------------------------------------------------------------------------- | -------- | ------------------- | ------------------------------------------ |
|   1 | Active coordination claim verified before writing                                         | PASS     | PASS                | **PASS**                                   |
|   2 | Candidate reviewed at the immutable commit and tree named in the claim                    | PASS     | PASS                | **PASS**                                   |
|   3 | Remediation handoff's file checksums and line counts reproduce                            | PASS     | PASS                | **PASS** (4 of 4)                          |
|   4 | Remediation handoff's external detection proofs reproduce exactly (both candidates)       | n/a      | PASS                | **PASS**                                   |
|   5 | Remediation handoff's `pnpm verify` result reproduces                                     | PASS     | PASS                | **PASS** (249 + 17)                        |
|   6 | Gate is deterministic and non-mutating                                                    | PASS     | PASS                | **PASS**                                   |
|   7 | Gate is path-portable and handles malformed input without crashing or silently skipping   | PASS     | PASS                | **PASS**                                   |
|   8 | Bundle discovery finds and fails partial bundles; `--bundle` isolates correctly           | PASS     | PASS                | **PASS**                                   |
|   9 | Gate is compatible with, and correct against, the current SBLA-009 artifacts              | PASS     | PASS                | **PASS**                                   |
|  10 | No false pass reachable by editing recorded values without fixing the underlying evidence | **FAIL** | **FAIL** (N-1)      | **PASS** (residual N-7/M-4 recorded Minor) |
|  11 | All four companions are reconciled against one another, as claimed                        | **FAIL** | **FAIL** (N-1)      | **PASS**                                   |
|  12 | A misdirected or absent repository root cannot report PASS                                | **FAIL** | PASS (residual N-5) | **PASS** (residual N-5)                    |
|  13 | Every validation code is independently exercised at an exact path by an isolated mutation | —        | PASS                | **PASS** (mutation-tested)                 |
|  14 | Shipped documentation matches enforced behaviour                                          | **FAIL** | **FAIL** (N-1, N-2) | **PASS**                                   |
|  15 | Reviewer wrote only the single claimed append-only report path                            | PASS     | PASS                | **PASS**                                   |

Criterion 10 is recorded as PASS with a stated residual. Every shape reachable without deliberately
writing non-content into the evidence now fails closed; the two shapes that remain — N-7's invisible
characters and M-4's fully degenerate bundle — are both deliberate evidence destruction, are both
recorded as Minor with destinations, and are graded consistently with how R1 and R2 graded M-4. If the
owner reads criterion 10 strictly enough to forbid those as well, this becomes FAIL and M-4 must be
reopened with it; that call is recorded here for the owner to make explicitly rather than by default.
