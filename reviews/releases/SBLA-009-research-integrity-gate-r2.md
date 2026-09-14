# Handoff: SBLA-009 research-companion integrity gate — Review R2 (complete independent implementation recheck)

**Task:** SBLA-009 research-companion integrity gate — complete-artifact recheck after the one bounded
R1 remediation
**Reviewer role:** Claude Review (Account B), independent implementation acceptance review, round 2.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5; fresh independent
reviewer session; did not author, remediate, or previously review this candidate or any SBLA-009
research artifact).
**Review date:** 2026-09-14
**Reviewer worktree:** `C:\src\s009gate-r2`
**Reviewer branch:** `claude-review/SBLA-009-integrity-gate-r2`
**Reviewed candidate commit:** `866028813f79be0c302e1c9ea3e394d42e9ca4fd` _(immutable)_
**Reviewed candidate tree:** `b03193ce817dc2ea858de12e1f7d4723dd7855fe` _(immutable)_
**Remediation implementation commit inside the candidate:** `8f49f511adcbeaadbec2f76225254b94b01039db`
**Original implementation commit:** `5c9481a59937cc805fe3bd00646d4260b23e6bfd`
**Failed R1 review commit:** `e514937e26031ab322c57be75f247aa381a6ab97`
**Accepted dependency base:** `ff67c615d204a71f414370f4064969435d9bbc70` — confirmed an ancestor of
the candidate (`git merge-base --is-ancestor`, exit 0). `d20625c`, `e514937` and `8f49f51` are also
confirmed ancestors, so the candidate carries the failed R1 report and its remediation in one line.
**Coordination claim commit:** `0831d0854cab27a0d5e5d08e8bde73c132c3d5ea` on
`origin/codex/SBLA-007-review-coordination` ("docs: claim SBLA-009 gate R2 review", 2026-09-14
19:07:48 -0400).
**Account-A evidence candidate checked externally:** `0880d5fbeedd57fb852469d447e9e441bd955d91`
(worktree `C:\src\s009fix1`, branch `claude-research/SBLA-009-r1-remediation`, clean tree; identity
verified with `git rev-parse` before use).
**Frozen failed evidence candidate checked externally:** `8cee805ce53289cec9d62336defce2a45d7b9da5`
(worktree `C:\src\s009research`, clean tree).
**Runtime:** Node.js `v24.20.0` (fnm-managed), pnpm `11.24.0` (corepack, from the `packageManager`
pin). Both confirmed in this session. The host default `node` is `v24.14.0` and the host default
`pnpm` is `11.19.0`; neither was used for any recorded result.
**Reviewer write path:** `reviews/releases/SBLA-009-research-integrity-gate-r2.md` (sole permitted
path; nothing else was created, modified, or deleted).

**Verdict: FAIL.**
**Unresolved Critical: 0 · Unresolved Important: 1 · New Minor (non-blocking, impact and destination
recorded): 5 · Deferred R1 Minor still open as graded: 4 · R1 findings addressed and closed: 6 of 6
(I-1 … I-5, M-1).**

The remediation is substantial, honest, and largely excellent. **Every one of the five R1 Important
findings is closed, and Minor M-1 is closed.** I reproduced all sixteen R1 escape probes against the
real artifacts: every mutation that previously passed silently now fails closed, several of them with
an order-of-magnitude larger tally than the defect they replace. Both external claims in the
remediation handoff reproduce exactly — Account A's `0880d5f` candidate passes with
`1 complete bundle checked (SBLA-009)`, and the frozen `8cee805` candidate still fails with exactly
298 issues in the documented seven-code distribution. All five implementation checksums and line
counts in the handoff match. `pnpm verify` is green end to end. The immutable R1 report is
byte-identical to its own commit.

It fails on one thing, and it is the same defect class R1 named twice. The packet-to-receipt
reconciliation the remediation added compares four fields, and three of them — receipt ID, execution
date, result count — are independently required to exist. The fourth, the **submitted query**, is
not. `submittedQuery` appears exactly once in the entire 1,365-line validator
(`scripts/evidence/research-integrity.mjs:1103`), inside the comparison itself. Because the
comparison is a bare `!==`, two absent values are equal, so deleting the query from both companions —
or renaming the key consistently across both, which leaves every query still sitting in the files —
silently switches that leg of the reconciliation off and the gate prints
`Research integrity passed: 1 complete bundle checked (SBLA-009).` That is the exact shape of R1's
I-3, whose prescribed fix R1 stated as "empty is a legitimate, explicit state; missing is not." The
remediation applied that principle to `reportedFacts` and to the access and basis vocabularies. It
did not apply it to the one field on the search companion — the companion R1's I-1 found uncovered in
the first place.

Nothing is Critical. The gate fails closed on every defect class it claims to detect, on both real
candidates, and `pnpm verify` is not broken.

---

## Objective

Perform the single complete-artifact recheck required by the repository stop rule after the one
bounded R1 remediation. Verify the active coordination claim; read the governing contracts and every
changed implementation, test, fixture and documentation file; reproduce every R1 Critical/Important
probe and the meaningful Minor probes and record a closure disposition for each; then audit the
complete artifact afresh for new false passes, false failures, nondeterminism, path non-portability,
malformed-input handling, discovery edge cases, closed-vocabulary enforcement, exact search-screening
and packet-receipt reconciliation, and truthful empty-root behaviour. Run the focused suite and full
`pnpm verify` independently, and run this candidate's validator externally against Account A's
committed research candidate. Return PASS or FAIL per criterion without repairing the artifact.

## Inputs and exact paths

Read in full before acting: `AGENTS.md`; `CLAUDE.md`; `docs/product/master-plan.md` (complete — all
21 sections, including §9 evidence system, §10 schemas, §11 architecture, §12 quality gates, §13 AI
team operating model and review stop rule, §14 roadmap, §18 task queue, §19 acceptance rubric);
`docs/runbooks/operating-policy.json`; the immutable R1 report
`reviews/releases/SBLA-009-research-integrity-gate-r1.md`; the original candidate handoff
`reviews/releases/SBLA-009-research-integrity-gate-handoff.md`; the remediation handoff
`reviews/releases/SBLA-009-research-integrity-gate-r1-remediation-handoff.md`; and
`origin/codex/SBLA-007-review-coordination:docs/runbooks/current-work.md` at `0831d08`.

**Claim verification.** The ledger's active-claims table carries the row:

> `SBLA-009 integrity gate implementation R2` | `Claude Review (account B)` |
> `claude-review/SBLA-009-integrity-gate-r2` | `C:\src\s009gate-r2` |
> `866028813f79be0c302e1c9ea3e394d42e9ca4fd` | `2026-09-14 19:07 EDT` |
> `reviews/releases/SBLA-009-research-integrity-gate-r2.md` |
> paths owned: `reviews/releases/SBLA-009-research-integrity-gate-r2.md`

Branch, worktree, base commit, expected handoff and the single owned path all match this session
exactly. The claim lives on the coordination branch and is correctly **not** an ancestor of the
reviewed candidate, so the candidate stays immutable. I did not edit the ledger.

**Changed files versus the failed R1 candidate `d20625c`** (7 files, +1320 / −16). The five
implementation files below are the remediation's own change set; the two reports are additive. All
read line by line at the candidate commit.

| Path                                                                          | Lines |                                                            SHA-256 | Handoff table         |
| ----------------------------------------------------------------------------- | ----: | -----------------------------------------------------------------: | --------------------- |
| `scripts/evidence/research-integrity.mjs`                                     | 1,365 | `90367899918e0046b886f8113f75d61f4c7781555bdaaff9a180e713d058a83c` | match                 |
| `tests/unit/research-integrity.test.ts`                                       |   337 | `a4fe1e4623b9a27a90f059a5bfdcb7efa9b599f5f177d7a19c63621cde3914ea` | match                 |
| `tests/fixtures/research-integrity/valid-bundle.json`                         |   182 | `ee2b8e578a1c0912575d21fa3e3bef0652f407d302e7d14f1cffe2663b9964c0` | match                 |
| `tests/fixtures/research-integrity/invalid-bundle.json`                       |   291 | `bf2e7dc3079707476f9cd583dfe0089e109a0846019cae950aed232896aee563` | match                 |
| `docs/authoring/research-integrity-errors.md`                                 |   167 | `327f938f7c9bd7edbc2550f705a725ca09825b8941a38b9b59bd7fa8bc43c129` | match                 |
| `reviews/releases/SBLA-009-research-integrity-gate-r1.md`                     |   664 | `03b4e4d54de44363f06b3b4b9166c68c7754906f2cd8d5b68205147bcaaea7a9` | unchanged (see below) |
| `reviews/releases/SBLA-009-research-integrity-gate-r1-remediation-handoff.md` |   194 |                                               (added at `8660288`) | n/a                   |

All five implementation checksums and line counts in the remediation handoff's table are
independently reproduced and correct. `package.json` is **unchanged** by the remediation
(`git diff d20625c 8660288 -- package.json` is empty), which is correct — `validate:research` was
already wired into `pnpm verify` at `5c9481a`.

**R1 immutability confirmed.** The R1 report in the candidate worktree hashes to
`03b4e4d54de44363f06b3b4b9166c68c7754906f2cd8d5b68205147bcaaea7a9`, byte-identical to
`git show e514937:reviews/releases/SBLA-009-research-integrity-gate-r1.md`. The only change under
`reviews/` since `e514937` is the added remediation handoff. Nothing edited the failed report.

**Real artifacts used as probe input.** Account A's committed candidate `0880d5f` was extracted
read-only with `git show` into a scratch directory outside every repository; every mutation operated
on in-memory copies written to fresh `os.tmpdir()` roots that were deleted afterwards. No repository
file was written at any point. Structure of that candidate, measured independently: 51 search
receipts (51 carrying `submittedQuery`, 48 carrying `recordsRetrievedIntoScreening` summing to
**2,343**), 1,956 screening records (1,842 excluded / 26 awaiting-full-text / 88 included) declaring
`recordsRetrieved: 2343`, 88 extractions plus 26 awaiting entries, 51 packet searches (51 carrying
`query`, 0 carrying an explicit `receiptId`, 51 carrying the `receipt R-###` marker in `database`),
and 237 reported facts across six distinct basis values. Both new cross-artifact identities are
therefore **live on the real data**, not vacuous — except as recorded in finding N-1.

## Constraints observed

- I did not repair, edit, reformat or stage any file under review, and did not touch the claim ledger.
  The only file this session creates is this report.
- Every probe operated on temporary copies outside every repository. `git status --porcelain` in
  `C:\src\s009gate-r2` was clean before the review apart from gitignored `node_modules/` produced by
  `pnpm install --frozen-lockfile`, and afterwards apart from that and this report.
- No live network search, no scientific adjudication, no judgement on whether any SBLA-009 claim is
  true. This is an implementation review of the gate, not the SBLA-010 evidence review.

---

## Closure disposition for every R1 finding

### R1 Important findings — all five CLOSED

#### I-1 · Search companion never reconciled against any other companion — **CLOSED**

Two new codes implement R1's recommended option (a): `SEARCH_SCREENING_TOTAL_MISMATCH`
(`scripts/evidence/research-integrity.mjs:579-591`, summing `recordsRetrievedIntoScreening` at
`:401-405`) and `PACKET_SEARCH_RECEIPTS_MISMATCH` (`:1073-1124`), which matches every packet search to
exactly one receipt and also reports any receipt the packet omits (`:1110-1114`). All six R1 probes
that previously passed with exit 0 now fail:

| R1 probe (re-run against Account A's `0880d5f`)                  | R1 result                           | R2 result                                                                        |
| ---------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| `receipts[0].recordsRetrievedIntoScreening` → `999`              | exit 0, 0 issues                    | exit 1, `SEARCH_SCREENING_TOTAL_MISMATCH` ("declare 3342 … declares 2343")       |
| `resultCount` → `99999` and retrieved → `0`                      | exit 0, 0 issues                    | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH`                                        |
| `search.receipts` emptied to `[]`                                | exit 0, 0 issues                    | exit 1, both codes                                                               |
| invented extra `packet.searches` entry                           | exit 0, 0 issues                    | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH` ("search[51] has no receipt identity") |
| `packet.searches` replaced with one fabricated 0-result entry    | exit 0, 0 issues                    | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH`                                        |
| populated search + screening/extraction/packet emptied to zeroes | exit 0, "1 complete bundle checked" | exit 1, both codes                                                               |

The last row was R1's sharpest: the catastrophic-data-loss shape is now caught. The handoff verb is
now accurate, and `docs/authoring/research-integrity-errors.md:95-98` documents both new identities.
See finding N-1 for the one leg of the packet identity that remains unenforced.

#### I-2 · `accessLevel` closed vocabulary never enforced — **CLOSED**

`ACCESS_LEVEL_INVALID` now fires on both companions (`:494-509` screening, `:778-787` extraction),
`ACCESS_LEVEL_MISMATCH` now additionally requires both values to be nonempty strings (`:788-801`), and
`ACCESS_LEVEL_BREAKDOWN_MISMATCH` (`:963-976`) requires the four allowed categories to account for
every included extraction. R1's Escape 1, reproduced exactly (rename `abstract-only` and
`metadata-only` in both companions — 79 screening records and 46 extractions — then restate the
derived breakdown counts the gate expects):

- **R1:** 223 → 183 issues; `ACQUISITION_LADDER_REQUIRED` 62 → 22; 40 real findings silently cleared.
- **R2:** exit 1 with **126** issues — 125 `ACCESS_LEVEL_INVALID` plus 1
  `ACCESS_LEVEL_BREAKDOWN_MISMATCH`. The escape now costs the author more findings than it clears.

The false-failure direction is also closed. An author recording the natural
`access.level: "full-text"` with `basis: "full-text"` now gets two `ACCESS_LEVEL_INVALID` diagnostics
naming the exact fields (`$.records[4].acquisition.accessLevel` and
`$.extractions[0].sourceSchemaFields.access.level`) and listing the four allowed values, alongside the
breakdown and count mismatches. R1's complaint was that the author was pointed at the wrong field; the
correctly-pointed diagnostic is now primary. (The secondary incoherent message survives — recorded as
new Minor N-6.)

#### I-3 · Full-text basis rule bypassable by rewording or renaming — **CLOSED**

`FACT_BASIS_INVALID` (`:836-849`) validates `basis` against the closed vocabulary at `:20-26`, and
`REPORTED_FACTS_REQUIRED` (`:815-825`) requires the array to exist. Every R1 escape now fails:

| Mutation of Account A's `0880d5f`                              | R1 result                         | R2 result                                |
| -------------------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| `basis` token `full-text` → `full text` (133 facts here)       | tally down 7, full-text-basis → 0 | exit 1, **133** `FACT_BASIS_INVALID`     |
| `extraction.reportedFacts` renamed to `facts` (88 extractions) | tally down 7, full-text-basis → 0 | exit 1, **88** `REPORTED_FACTS_REQUIRED` |
| `basis: "abstract and full-text"` on an `abstract-only` source | exit 0, 0 issues                  | exit 1, `FACT_BASIS_INVALID`             |
| `basis: "full-text (author copy)"`                             | exit 0, 0 issues                  | exit 1, `FACT_BASIS_INVALID`             |
| `basis: ["full-text"]`                                         | exit 0, 0 issues                  | exit 1, `FACT_BASIS_INVALID`             |

#### I-4 · A wrong, missing or shadowed `--root` reports PASS — **CLOSED as prescribed**

`ROOT_INVALID` (`:1241-1255`) fails when the resolved root contains none of the four companion
directories, counted at `:1165`; the `root === process.cwd()` sentinel is replaced by an explicit
`rootSeen` flag (`:1188`, `:1199`). Four of R1's five rows now fail:

| R1 probe                                                              | R1 result                            | R2 result                    |
| --------------------------------------------------------------------- | ------------------------------------ | ---------------------------- |
| `--root C:/definitely-not-here-9f3a`                                  | `passed: 0 complete bundles checked` | exit 1, `ROOT_INVALID`       |
| `--root <directory with no research tree>`                            | `passed: 0 complete bundles checked` | exit 1, `ROOT_INVALID`       |
| no `--root`, run from `<bundle root>/research`                        | `passed: 0 complete bundles checked` | exit 1, `ROOT_INVALID`       |
| all four companions one directory deeper (`research/searches/2026/…`) | `passed: 0 complete bundles checked` | **still passes** — see below |
| `--root . --root C:/definitely-not-here-9f3a` from the bundle root    | exit 0, second root silently used    | exit 2, `ARGUMENT_INVALID`   |

The fourth row is **not** an unclosed I-4. In that shape `research/searches` and its siblings do exist
(they contain the nested directory), so R1's own prescribed condition — "contains none of the four
companion directories" — correctly does not fire. That row is the non-recursive-discovery behaviour R1
graded as **M-5** and deferred, and which the remediation handoff explicitly does not claim to have
fixed. The truthful-empty case still passes correctly (`passed: 0 complete bundles checked` when all
four directories exist and are empty), which this repository needs on its pre-evidence base. A
residual of the prescribed fix is recorded as new Minor N-5.

#### I-5 · The one worked command in the authoring contract does not run — **CLOSED**

`docs/authoring/research-integrity-errors.md:29` now reads `pnpm validate:research --bundle SBLA-009`.
Reproduced verbatim with the pinned toolchain: it invokes
`node scripts/evidence/research-integrity.mjs "--bundle" "SBLA-009"` and reaches `[BUNDLE_MISSING]`
with exit 1, which is the intended behaviour on this pre-evidence base. The old broken form still
errors with `ARGUMENT_INVALID` exit 2, but no tracked document prints it any more — `grep` over all
tracked `.md`, `.json` and `.yml` files finds the broken form only inside the immutable R1 report,
quoting it as the defect. The remediation chose R1's documentation option rather than the
argument-parser option, which R1 explicitly permitted.

### R1 Minor findings

#### M-1 · `step` never validated, though three places promise it — **CLOSED**

`ACQUISITION_ATTEMPT_STEP_REQUIRED` (`:527-536`) fires with an exact path. Deleting `.step` from one
otherwise complete attempt now yields
`[ACQUISITION_ATTEMPT_STEP_REQUIRED] … $.records[4].acquisition.ladderStepsTried[0].step`; a
whitespace-only `step` is rejected identically. The frozen candidate's 75 opaque string attempts now
produce 75 step findings alongside the 75 date and 75 result findings, raising its tally from 223 to 298. The code, the doc (`:69`) and the remediation handoff (`:55-56`) now say the same thing.

#### M-2 · Determinism test vacuous; four CLI behaviours untested — **OPEN, deferred as graded**

`tests/unit/research-integrity.test.ts:103-130` still reverses only the four top-level keys, which
`validateResearchBundle` reads by name, so the assertion still cannot fail. The suite improved
materially elsewhere: line 221-223 now asserts set-equality between the fixture's `expectedCode`
values and `BUNDLE_VALIDATION_CODES` (27 isolated mutations covering all 26 codes), and all five
`CLI_ISSUE_CODES` now have a CLI test (`ROOT_INVALID` and the duplicate-`--root` `ARGUMENT_INVALID`
are new). Still absent: a `CLI_ISSUE_CODES` set-equality assertion — the constant at `:65-71` remains
exported and referenced by nothing outside its own file — and any assertion pinning the issue _count_,
since every per-code assertion uses `expect.arrayContaining`, so a regression adding spurious findings
would pass. **The underlying behaviour is correct and I verified it directly rather than relying on
the test** (see "What I verified as correct"). **Destination:** next tooling-hardening task. **Do not
change the checker's determinism behaviour for this finding.**

#### M-3 · Missing `primaryReasonCode` reported against the count, not the record — **OPEN, deferred as graded**

Unchanged. Deleting `primaryReasonCode` from one excluded record still produces a single
`SCREENING_TOTAL_MISMATCH` at `$.exclusionCodeCounts.E-REC-5` ("Declared … is 39; records derive 38")
with no path to the record that lost its code. With 1,842 excluded records in the current candidate a
per-record path still matters. **Destination:** next tooling-hardening task; a per-record
`EXCLUSION_REASON_REQUIRED` at `$.records[i].primaryReasonCode` would resolve it.

#### M-4 · Degenerate all-zero bundle passes; `retrievalEvents: 0` can derive a negative — **OPEN, deferred as graded**

Both halves reproduce. A bundle with all four files present and everything empty still reports
`Research integrity passed: 1 complete bundle checked`. Three shipped-fixture records forced to
`retrievalEvents: 0` still derive an unsatisfiable negative
(`Declared duplicateRetrievalEvents is 1; records derive -2`, `:593-616`). R1's prediction that the
I-1 remediation would neutralise the first half in combination is confirmed: the "populated search,
emptied downstream" variant now fails closed, so only the fully degenerate bundle still passes.
**Destination:** next tooling-hardening task; requiring `retrievalEvents >= 1` and flagging a derived
negative as its own code would close the second half.

#### M-5 · Discovery non-recursive, first-wins on case-variant duplicates, empty stem accepted — **OPEN, deferred as graded**

Unchanged at `:1152-1180`. Confirmed in this round: four companions one directory deeper are invisible
and the run passes with exit 0; a file named exactly `-search-receipts.json` yields an empty task ID
and prints `Research integrity passed: 1 complete bundle checked ().`. Fully uppercase filenames are
discovered correctly, and a second task present only as a packet file is still correctly reported
`BUNDLE_PARTIAL` naming all three missing components, sorted. **Destination:** next tooling-hardening
task. The filesystem case-collision half remains underived on NTFS (see "Known uncertainties"); a
distinct, newly introduced case-collision defect inside the _reconciliation_ code is recorded
separately as N-4.

---

## New findings

### Important (blocks PASS)

#### N-1 · The submitted query is the only leg of the new packet-to-receipt identity that is never required to exist, so deleting or consistently renaming it on both companions silently disables that leg and the gate reports PASS

**Where:** `scripts/evidence/research-integrity.mjs:1100-1108` (the four-field comparison, with
`packetSearch.query !== receipt.submittedQuery` at `:1103`);
`scripts/evidence/research-integrity.mjs:375-400` (per-receipt validation — `executedAt` at `:377`,
`resultCount` at `:384`, `recordsRetrievedIntoScreening` at `:391`, and **no** `submittedQuery`
check); `scripts/evidence/research-integrity.mjs:358-365` (`receiptId` uniqueness);
`docs/authoring/research-integrity-errors.md:97-98`;
`reviews/releases/SBLA-009-research-integrity-gate-r1-remediation-handoff.md:44-45`.

The remediation handoff states the gate "reconciles every packet search to exactly one receipt using
receipt identity, **exact submitted query**, execution date, and result count", and the shipped
authoring contract repeats it as something the validator "recomputes … rather than trusting their
summaries". Three of those four fields are independently required: an absent `receiptId` yields
`ID_INVALID`, an absent `executedAt` yields `DATE_INVALID`, an absent `resultCount` yields
`COUNT_INVALID`. `submittedQuery` has no such check — the string occurs exactly once in the whole
1,365-line file, at `:1103`, inside the comparison itself. The comparison is a bare `!==`, so two
absent, two `null` or two empty values compare equal and the leg is satisfied vacuously.

**Failure scenarios (all reproduced against Account A's committed `0880d5f` candidate, which
otherwise passes):**

| Mutation                                                                                 | Result                                                           |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| delete `submittedQuery` from all 51 receipts **and** `query` from all 51 packet searches | **exit 0, 0 issues, "Research integrity passed"**                |
| set both to `null` on all 51                                                             | **exit 0, 0 issues, "Research integrity passed"**                |
| set both to `""` on all 51                                                               | **exit 0, 0 issues, "Research integrity passed"**                |
| rename receipt key `submittedQuery`→`query` **and** packet key `query`→`submittedQuery`  | **exit 0, 0 issues** — while all 102 queries remain in the files |
| delete `submittedQuery` from **one** receipt only (control)                              | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH` — correct              |
| delete `query` from **one** packet search only (control)                                 | exit 1, `PACKET_SEARCH_RECEIPTS_MISMATCH` — correct              |
| delete `executedAt` and `resultCount` on both sides too (control)                        | exit 1, 102 issues (51 `DATE_INVALID` + 51 `COUNT_INVALID`)      |

The fourth row is the sharpest and the most reachable. It is not evidence destruction — it is ordinary
schema drift of the kind a regenerated companion produces — and it leaves every exact search string
present in both artifacts while removing the gate's ability to check that they agree. The last row
shows the gap is specific to the query: the other three legs of the same identity fail loudly under
identical treatment.

**Why this is Important and not Minor.** It is structurally the same defect as R1's I-3 — a
depended-upon field whose absence silently switches a check off rather than failing — and R1's
prescribed remediation for I-3 stated the governing principle explicitly: "require every extraction to
carry a `reportedFacts` array (**empty is a legitimate, explicit state; missing is not**)". The
remediation applied that principle to `reportedFacts` (`REPORTED_FACTS_REQUIRED`) and to the access and
basis vocabularies, but not to the search companion, which is the companion R1's I-1 found uncovered in
the first place. It defeats three of R1's mandatory acceptance criteria: #10 (no false pass reachable
by editing recorded values), #11 (all four companions reconciled as claimed) and #14 (shipped
documentation matches enforced behaviour). The exact query is also the one artifact the master plan
singles out at §9.8 step 2 — "Search: Save exact database, date, **full query**, filters, and result
count" — and `scripts/evidence/research-integrity.mjs` is the only script in the repository that reads
`research/searches` at all, so no sibling gate covers it: `scripts/content/validate.mjs:13` scopes
`RECORD_ROOTS` to `content`, `research/packets` and `reviews/evidence`, and
`scripts/foundation/contract.mjs:55` names the directory only as a required-path contract.

**Why this is not Critical.** The real candidate carries all 51 queries, the gate detects everything
else it claims on both real candidates, it fails closed on the artifact under review, and
`pnpm verify` is unaffected.

**Remediation.** Require `submittedQuery` on every receipt and `query` on every packet search as
nonempty strings, each with its own stable code (for example `SEARCH_QUERY_REQUIRED` and
`PACKET_SEARCH_QUERY_REQUIRED`), an exact JSON path and an error-table entry; then keep the existing
equality comparison. Equivalently, make the comparison reject any pair in which either side is not a
nonempty string. Add an isolated mutation for each new code so the set-equality assertion at
`tests/unit/research-integrity.test.ts:221-223` keeps covering every code. Deleting the claim from the
handoff and from `docs/authoring/research-integrity-errors.md:97-98` instead would be honest, but would
leave a four-artifact gate reconciling three fields of a four-field identity; I recommend enforcement.

### Minor (non-blocking; impact and destination recorded)

#### N-2 · `FACT_BASIS_INVALID`'s printed remediation omits the valid `abstract` token, which the current candidate uses 19 times

**Where:** `scripts/evidence/research-integrity.mjs:20-26` (`FACT_BASIS_PARTS` contains `abstract`,
`abstract-only`, `full-text`, `machine-translated`, `metadata`);
`scripts/evidence/research-integrity.mjs:846-847` (the printed remediation names only four of the
five); `docs/authoring/research-integrity-errors.md:82-84` (the doc correctly names all five);
`reviews/releases/SBLA-009-research-integrity-gate-r1-remediation-handoff.md:52-53` (the handoff
correctly names all five).

The tool prints "Use only abstract-only, full-text, metadata, and machine-translated basis tokens,
separated by commas." `abstract` is accepted by the enforced vocabulary, is documented, and is used as
a standalone basis by **19** of the 237 reported facts in Account A's candidate (measured
distribution: `full-text` 131, `abstract-only` 82, `abstract` 19,
`abstract-only, machine-translated` 2, `full-text, machine-translated` 2, `metadata` 1).

**Impact:** an author who follows the printed remediation literally would migrate 19 valid `abstract`
bases to `abstract-only`, which is a different assertion about what was read — the remediation handoff
at `:52-53` deliberately treats the two as distinct. No false pass or false failure results; the
misdirection is in the repair instruction only. This is the same class as R1's M-1 (tool remediation
strings disagreeing with enforced behaviour), in the opposite direction. **Destination:** next
tooling-hardening task; fold into the N-1 remediation if that round touches diagnostics, and keep the
string, the doc and the handoff enumerating the same five tokens.

#### N-3 · Screening `accessLevel` is vocabulary-checked through `String()` coercion, so a non-string value that stringifies into the vocabulary passes on any record with no extraction

**Where:** `scripts/evidence/research-integrity.mjs:494-509`
(`ACCESS_LEVELS.has(String(accessLevel))`); `:510-512` (the ladder predicate, also coerced);
`:788-801` (`ACCESS_LEVEL_MISMATCH` uses `isIdentifier`, but runs only inside the
`extractions.forEach` loop, so it never evaluates a record that has no extraction).

`String(['abstract-only'])` is `'abstract-only'`, so an array-valued `accessLevel` is admitted by the
closed-vocabulary check. On an **included** record this is still caught, because the extraction-side
comparison requires both values to be nonempty strings — reproduced: an array on both companions
yields `ACCESS_LEVEL_MISMATCH` plus `ACCESS_LEVEL_BREAKDOWN_MISMATCH` plus
`EXTRACTION_COUNT_MISMATCH`. On an **awaiting-full-text**, **excluded** or **duplicate** record there
is no extraction, so nothing catches it: setting `G0012.acquisition.accessLevel` to
`["abstract-only"]` yields **exit 0, 0 issues**, whereas the equivalent invalid _string_
`"abstract_only"` is correctly rejected with `ACCESS_LEVEL_INVALID`.

**Impact:** narrow and exotic. The realistic authoring error is a string spelling variant, and that is
now caught everywhere; this needs a type the path contract does not produce, and it cannot disable the
ladder requirement, since an `awaiting-full-text` record requires a ladder regardless of access level.
**Destination:** next tooling-hardening task; test the raw value with `isIdentifier` before the
`ACCESS_LEVELS.has` lookup, in both the screening check at `:499` and the extraction check at `:778`.

#### N-4 · Receipt IDs are uniqueness-checked case-sensitively but reconciled case-insensitively, so two receipts colliding only by case are accepted and silently collapse to one

**Where:** `scripts/evidence/research-integrity.mjs:244-275` (`validateUniqueIds` compares raw
strings); `:1073-1078` (`receiptsById` keys are `.toUpperCase()`); `:123-131` (`packetReceiptId`
uppercases both the explicit `receiptId` and the `receipt R-###` marker).

Adding a second receipt whose `receiptId` is `r-014` alongside the existing `R-014` produces no
`ID_DUPLICATE`, because the uniqueness check is case-sensitive; `Map.set` then makes the later entry
win in `receiptsById`, so the packet reconciles against one of the two and the other is never checked.
Reproduced: cloning `R-014` as `r-014` with `recordsRetrievedIntoScreening: 0` yields **exit 0, 0
issues** while the search companion now declares 52 receipts. The gate does catch the collision when
the colliding receipt differs in query, date or count (reproduced: `PACKET_SEARCH_RECEIPTS_MISMATCH`,
"search[13] does not match R-014 query/date/count"), and a nonzero import count on the duplicate is
caught by `SEARCH_SCREENING_TOTAL_MISMATCH`.

**Impact:** a zero-import near-duplicate receipt can inflate the apparent number of executed searches
without any diagnostic. This is distinct from R1's M-5, which concerns _filenames_ on a case-sensitive
filesystem; this one is a case-sensitivity inconsistency introduced _inside_ the new reconciliation
code and is filesystem-independent. **Destination:** next tooling-hardening task; make the receipt-ID
uniqueness check case-insensitive so it matches the reconciliation map, or key the map
case-sensitively so the two agree.

#### N-5 · An external `--root` check without `--bundle` aimed at a sibling checkout of the same repository still reports "passed"

**Where:** `scripts/evidence/research-integrity.mjs:1241-1255` (`existingDirectoryCount === 0`);
`:1156-1165` (the counter increments once per directory that exists);
`docs/authoring/research-integrity-errors.md:20-30`.

The implemented condition is exactly the one R1 prescribed — fail when the root contains _none_ of the
four companion directories — so one existing directory is enough to proceed. Every worktree of this
repository carries all four directories with `.gitkeep`, so `--root` aimed at the wrong worktree
returns `Research integrity passed: 0 complete bundles checked.` with exit 0. Reproduced against
`C:\src\s009gate-r2` itself (exit 0, "passed"), and against a root containing only `research/packets`
(exit 0, "passed").

**Impact:** the external-check workflow both handoffs actually use is `--root … --bundle SBLA-009`,
and the same wrong root **with** `--bundle` correctly fails (`[BUNDLE_MISSING]`, exit 1 — reproduced).
The authoring contract already directs authors to `--bundle` for exactly this purpose at
`docs/authoring/research-integrity-errors.md:24-30`. The residual is inherent to R1's own
prescription: a truthful empty evidence tree in this repository is indistinguishable from a sibling
checkout by directory existence alone. **Destination:** next tooling-hardening task; either require
`--bundle` alongside `--root`, or print the resolved root and the discovered bundle count on the
zero-bundle success path so a misdirected check is visible in the output rather than silent.

#### N-6 · `FULL_TEXT_BASIS_EXCEEDS_ACCESS` can still print the incoherent "basis 'full-text' exceeds source access 'full-text'"

**Where:** `scripts/evidence/research-integrity.mjs:850-862`, in combination with `:499-508`.

The message R1 called incoherent survives verbatim when an out-of-vocabulary access level happens to
contain the `full-text` substring: `Fact basis "full-text" exceeds source access "full-text"`.

**Impact:** materially reduced and no longer misdirecting on its own — the diagnostic now always
co-occurs with `ACCESS_LEVEL_INVALID` naming the exact offending field and the four allowed values, so
the author is pointed at the real defect first. It cannot cause a false pass or a false failure: the
bundle fails correctly either way. What remains is one confusing line in the output of an
already-failing run. **Destination:** next tooling-hardening task; suppress the basis-versus-access
message when the access level is already reported invalid, or word it as "source access is not a
full-text level".

---

## What I verified as correct

Recorded so the next remediation does not disturb them.

- **Both external claims in the remediation handoff reproduce exactly.** Account A's committed
  candidate `0880d5f` passes: `Research integrity passed: 1 complete bundle checked (SBLA-009).`,
  exit 0, both with and without `--bundle`. The frozen pre-remediation candidate `8cee805` fails with
  exit 1 and exactly **298** issues in the documented distribution:
  `ACQUISITION_ATTEMPT_STEP_REQUIRED` 75, `ACQUISITION_ATTEMPT_DATE_INVALID` 75,
  `ACQUISITION_ATTEMPT_RESULT_REQUIRED` 75, `ACQUISITION_LADDER_REQUIRED` 62,
  `FULL_TEXT_BASIS_EXCEEDS_ACCESS` 7, `LANGUAGE_REQUIRED` 3, `RETRIEVAL_EVENTS_DEFAULT_MISSING` 1.
- **The new cross-artifact identities are live, not vacuous, on the real data.** The frozen candidate
  produces neither `SEARCH_SCREENING_TOTAL_MISMATCH` nor `PACKET_SEARCH_RECEIPTS_MISMATCH`, which
  independently confirms that its receipts already summed to its declared `recordsRetrieved` and its
  packet already mirrored its receipts — the checks pass on real data because the data agrees, not
  because they are switched off. On the remediated candidate, 48 declaring receipts sum to 2,343,
  equal to `screening.reconciliation.recordsRetrieved`, and all 51 packet searches resolve to a
  receipt through the `receipt R-###` marker in `database` (the explicit `receiptId` field is
  supported but unused by the current packet, exactly as the handoff discloses).
- **Determinism** — five consecutive runs against the 298-issue candidate produced byte-identical
  stderr (sha256 prefix `5e0420336e45ed22`, 596 lines, exit 1 each time). A bundle constructed to
  exercise the new order-sensitive paths simultaneously (two exclusion-code mismatches, nine removed
  receipts, five invalid fact bases, one invalid access level — 16 issues across 8 codes) produced
  **byte-identical** stderr under recursive key-order reversal at every nesting level.
- **Non-mutation** — size, SHA-256 and mtime of all four input artifacts unchanged after five runs;
  the in-memory assertion at `tests/unit/research-integrity.test.ts:99-100` also holds.
- **Path portability of `--root`** — seven spellings of the same tree resolve identically and pass:
  backslash, trailing backslash, forward slashes, lowercase drive letter, the `\\?\` extended-length
  prefix, a trailing `\.`, and a `..` traversal. The checker also runs correctly from a copied
  location, so the `isMainModule` comparison at `:1349-1351` is not fragile.
- **Malformed and hostile input** — 22 probes, all exit 1 with correctly-pathed codes, no crash and no
  silent skip: JSON syntax error; `null` artifact; all four artifacts as JSON arrays; `records` as an
  object; `acquisition` as a string; `ladderStepsTried` as a string and as opaque strings; `receipts`
  as a string; `searches` as an object; `extractions` as `null`; `reconciliation`, `counts` and
  `includedSourceIds` each missing entirely; `resultCount` as a float, negative, and above
  `MAX_SAFE_INTEGER`; `executedAt` as `0099-01-01`, `2026-02-30` and `25:00:00Z`; `terminalState` as a
  two-element array; and `retrievalEventsDefault` as prose. A `+05:30` offset timestamp is correctly
  _accepted_ as a legal ISO 8601 form.
- **Discovery and bundle isolation** — two complete bundles in one root are both checked when no
  `--bundle` is given (the broken one is reported, exit 1); `--bundle` isolates correctly (the healthy
  bundle passes, exit 0) and is case-insensitive; fully uppercase filenames are discovered; a second
  task present only as a packet file is correctly reported `BUNDLE_PARTIAL` naming all three missing
  components, sorted.
- **Argument rejection** — unknown flag, `--root` with no value, `--bundle` with no value, duplicate
  `--bundle`, a bare positional, a duplicate non-cwd `--root`, `--root ""`, and a trailing positional
  are all rejected with `ARGUMENT_INVALID` and exit 2. Flag order is immaterial
  (`--bundle … --root …` works).
- **The documented boundary is honest and enforced as far as it can be.** Promoting one included
  `abstract-only` record to `full-text-open` in both companions _without_ restating the counts is
  caught (two `EXTRACTION_COUNT_MISMATCH`); with the counts restated it passes, which is exactly what
  `docs/authoring/research-integrity-errors.md:164-167` discloses ("An internally consistent false
  statement can pass this mechanical gate"). The gate forces such a change to be visible and
  deliberate rather than silent, which is the most a bookkeeping gate can do.
- **`pnpm verify` is green at the candidate**, run in full from `8660288` with Node `v24.20.0` /
  pnpm `11.24.0`: Prettier pass, ESLint 0 errors / 0 warnings, `astro check` 57 files with
  0 errors / 0 warnings / 0 hints, unit tests **17 files / 248 tests passed**, content validation
  pass, graph validation pass, `Research integrity passed: 0 complete bundles checked.`, evidence
  status pass, static build complete (1 page), portability 3 files / 17 tests passed, foundation
  contract pass, asset spike and asset decision pass. Exit code 0 in 29 s. Every number the
  remediation handoff records under "Tests/checks run and results" is reproduced, including the
  245 → 248 unit-test count. `git diff --check ff67c61 8660288` is clean.
- **Command-contract compliance** — `validate:research` is unchanged in `package.json`, no stable
  command name in the AGENTS.md table is renamed or removed, and CI
  (`.github/workflows/ci.yml:13` `ubuntu-latest`, `:31` `pnpm verify`) picks the gate up.
- **Scope discipline** — the gate performs no network access, no scientific adjudication and no
  writes. The remediation did not weaken any pre-existing rule: every code present at `5c9481a`
  survives, and the frozen candidate's original six-code distribution is unchanged apart from the 75
  added step findings.
- **Role and process discipline** — the remediation touched only the five claimed implementation paths
  plus its own handoff; it did not edit the immutable R1 report, Account A's artifacts, or the ledger.

## Decisions made

- **Nothing graded Critical.** The gate fails closed on the artifact under review, detects every
  defect class it claims on both real candidates, and does not break `pnpm verify`. N-1 is a way a
  _future_ bundle could pass while its search evidence is unverifiable, which is the Important band,
  not the Critical one — the same line R1 drew.
- **N-1 is graded Important rather than Minor** because it is the identical structural defect to R1's
  I-3 (a depended-upon field whose absence disables a check), because R1's own prescribed fix for that
  finding stated the principle the remediation then applied everywhere except here, because the
  consistent-rename path is ordinary schema drift rather than deliberate evidence destruction, and
  because no other gate in the repository reads the search companion. I considered grading it Minor on
  the ground that it clears no _existing_ finding; I rejected that because R1's operative acceptance
  criteria #10, #11 and #14 are each defeated by it, and because the gate's whole purpose is to stand
  between a regenerated companion and acceptance.
- **I-4 is recorded as closed even though one of R1's five rows still passes**, because that row is
  governed by the non-recursive-discovery behaviour R1 itself graded M-5 and deferred, and because the
  fix R1 prescribed for I-4 is implemented exactly and demonstrably closes the other four rows. I
  record the residual separately as N-5 rather than reopening I-4, so the disposition of each finding
  stays traceable.
- **I-2's false-failure direction is recorded as closed** even though the incoherent message survives,
  because R1's complaint was that the author was pointed at the wrong field and the correctly-pointed
  diagnostic is now primary. The residual message is recorded as N-6 with its own destination.
- **M-2 remains Minor and I did not grade the weak determinism test higher**, because I verified the
  underlying behaviour byte-exactly under recursive key reversal. A weak test over correct behaviour is
  coverage debt, not a behaviour defect. **Codex should not change the checker's determinism behaviour
  for it.**
- **I did not repair anything.** Per `AGENTS.md`, findings go back to Codex, which owns `scripts/`,
  `tests/`, `docs/` and `package.json`.

## Tests/checks run and results

All commands run from `C:\src\s009gate-r2` at `8660288` with Node `v24.20.0` / pnpm `11.24.0`, unless
a probe names its own root. Probe scripts were written to a scratch directory outside every repository
and are not part of this branch.

|   # | Command / probe                                                                                 | Result                                                                                  |
| --: | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
|   1 | `git rev-parse HEAD` / `HEAD^{tree}`                                                            | `8660288…`, tree `b03193c…`                                                             |
|   2 | `git merge-base --is-ancestor` for `ff67c61`, `d20625c`, `e514937`, `8f49f51`                   | exit 0 for all four                                                                     |
|   3 | `git show origin/codex/SBLA-007-review-coordination:docs/runbooks/current-work.md` at `0831d08` | R2 claim row verified, quoted above                                                     |
|   4 | `git diff --stat d20625c 8660288`                                                               | 7 files, +1320 / −16                                                                    |
|   5 | `git diff --check ff67c61 8660288`                                                              | clean                                                                                   |
|   6 | SHA-256 + line count of the five implementation files                                           | all five match the remediation handoff table                                            |
|   7 | SHA-256 of the R1 report, worktree vs `e514937`                                                 | identical — R1 report immutable                                                         |
|   8 | `git diff d20625c 8660288 -- package.json`                                                      | empty (correctly unchanged)                                                             |
|   9 | `pnpm install --frozen-lockfile`                                                                | done in 4 s with pnpm 11.24.0                                                           |
|  10 | `pnpm exec vitest run tests/unit/research-integrity.test.ts`                                    | 1 file, **10 tests passed**                                                             |
|  11 | `pnpm verify`                                                                                   | **exit 0**, all stages green (detail above); 248 unit tests                             |
|  12 | Gate vs Account A `0880d5f` (`--root C:\src\s009fix1 --bundle SBLA-009`)                        | **exit 0**, `1 complete bundle checked (SBLA-009)`                                      |
|  13 | Gate vs Account A `0880d5f`, no `--bundle`                                                      | exit 0, same result                                                                     |
|  14 | Gate vs frozen `8cee805` (`--root C:\src\s009research --bundle SBLA-009`)                       | exit 1, **298 issues**, distribution matches the handoff exactly                        |
|  15 | Structural measurement of `0880d5f` (receipts, queries, imports, records, searches, facts)      | 51 / 51 / 2343 / 1956 / 51 / 237 — handoff figures reproduced                           |
|  16 | I-1 probes ×6 (R1's full table, re-run on real data)                                            | all now **exit 1**; previously all exit 0 (detail above)                                |
|  17 | I-2 Escape 1 — access levels renamed in both companions, breakdown restated                     | 183 → **126 issues, exit 1**; previously cleared 40 real findings                       |
|  18 | I-2 false-failure — `access.level: "full-text"` with `basis: "full-text"`                       | 2 × `ACCESS_LEVEL_INVALID` naming the exact fields, plus breakdown and count mismatches |
|  19 | I-3 probes ×5 (reword, rename, three malformed bases)                                           | all now **exit 1** (133 / 88 / 1 / 1 / 1 issues); previously all silent                 |
|  20 | I-4 probes ×5 (R1's full table)                                                                 | 4 of 5 now fail (`ROOT_INVALID` ×3, `ARGUMENT_INVALID` ×1); row 4 is M-5                |
|  21 | I-4 controls — truthful empty tree; wrong root **with** `--bundle`                              | `passed: 0 complete bundles checked` / `BUNDLE_MISSING` exit 1 — both correct           |
|  22 | I-5 — `pnpm validate:research --bundle SBLA-009` (the documented form)                          | runs; `BUNDLE_MISSING`, exit 1 — correct on this base                                   |
|  23 | I-5 control — `pnpm validate:research -- --bundle SBLA-009` (no longer documented)              | `ARGUMENT_INVALID`, exit 2                                                              |
|  24 | `grep` for `validate:research` across all tracked `.md` / `.json` / `.yml`                      | broken form appears only inside the immutable R1 report, as the quoted defect           |
|  25 | M-1 — `.step` deleted; `.step` set to whitespace                                                | `ACQUISITION_ATTEMPT_STEP_REQUIRED` with exact path, both cases                         |
|  26 | M-3 — `primaryReasonCode` deleted from one excluded record                                      | 1 × `SCREENING_TOTAL_MISMATCH` at `$.exclusionCodeCounts.E-REC-5`; still no record path |
|  27 | M-4 — degenerate all-zero bundle; three fixture records at `retrievalEvents: 0`                 | passes; derives `-2` — both still open as graded                                        |
|  28 | M-5 — nested companions; empty task stem; uppercase filenames; packet-only second task          | passes / prints `()` / discovered / `BUNDLE_PARTIAL` — as recorded in R1                |
|  29 | Determinism — 5 runs on the 298-issue candidate                                                 | identical stderr sha `5e0420336e45ed22`, 596 lines, exit 1                              |
|  30 | Determinism — recursive key-order reversal on a 16-issue / 8-code bundle                        | **byte-identical** stderr to the natural-order run                                      |
|  31 | Non-mutation — size + SHA-256 + mtime of all four inputs before/after 5 runs                    | unchanged                                                                               |
|  32 | `--root` spellings ×7 incl. `\\?\`, trailing `\.`, `..`; checker run from a copied path         | all resolve identically, exit 0                                                         |
|  33 | Malformed/hostile input battery ×22                                                             | all **exit 1** with correctly-pathed codes; no crash, no silent skip                    |
|  34 | Multi-bundle discovery; `--bundle` isolation; `--bundle` case-insensitivity                     | both bundles checked / isolation correct / case-insensitive                             |
|  35 | Argument rejection battery ×8 plus flag-order independence                                      | `ARGUMENT_INVALID` exit 2 ×8; order immaterial                                          |
|  36 | **N-1** — query deleted / `null` / `""` on both companions; keys renamed on both companions     | **exit 0, 0 issues, "passed"** in all four cases                                        |
|  37 | **N-1 controls** — one-sided deletion ×2; `executedAt` + `resultCount` deleted on both sides    | `PACKET_SEARCH_RECEIPTS_MISMATCH` ×2; 102 issues — other legs required                  |
|  38 | **N-3** — array `accessLevel` on an awaiting-full-text record vs. on an included record         | exit 0, 0 issues / correctly caught by three codes                                      |
|  39 | **N-4** — case-variant duplicate `receiptId` (zero-import clone vs. differing clone)            | exit 0, 0 issues / correctly caught                                                     |
|  40 | **N-5** — `--root` aimed at a sibling worktree, and at a root with only `research/packets`      | `passed: 0 complete bundles checked`, exit 0 (both)                                     |
|  41 | Access-promotion boundary — counts not restated vs. restated                                    | 2 × `EXTRACTION_COUNT_MISMATCH` / passes, as documented                                 |
|  42 | `grep` for other scripts reading `research/searches` or `submittedQuery`                        | only `research-integrity.mjs`; no sibling gate covers it                                |
|  43 | `git status --porcelain` before and after the review                                            | clean apart from gitignored `node_modules/` and this report                             |
|  44 | `pnpm verify` re-run at the final branch state, with this report present                        | **exit 0**; `prettier --check` clean on this file                                       |

## Known uncertainties

- The filesystem half of R1's M-5 — two filenames differing only in case colliding on one task ID —
  remains unobserved directly, because this worktree is on NTFS and CI runs `ubuntu-latest`. It is
  unchanged code, and it stays Minor partly for that reason. N-4 is a _different_,
  filesystem-independent case-collision defect inside the reconciliation code, and that one I
  reproduced directly.
- I did not evaluate whether any SBLA-009 scientific claim is true, entailed, adequately qualified or
  correctly extracted. The gate's own boundaries section says an internally consistent false statement
  passes it; I confirmed that property holds and is disclosed, and nothing more. The complete
  citation-entailment and adversarial review is SBLA-010 and is still owed.
- That Account A's `0880d5f` candidate passes this gate means its bookkeeping reconciles. It does not
  mean its 2,343 retrieval events, 1,842 exclusions, 88 extractions or 237 reported facts are
  accurate, and the validator makes no such claim.
- I did not run `pnpm test:e2e`, `test:a11y`, `test:visual` or `test:performance`. None of them touches
  this change, and `pnpm verify` is the required gate for it.
- N-1's remediation will require deciding whether `submittedQuery` is mandatory on _every_ receipt,
  including the three count-only routes in the current candidate that legitimately omit
  `recordsRetrievedIntoScreening`. I did not pre-compute that outcome, because doing so would be
  remediation design on an artifact I do not own; I note only that all 51 receipts currently carry a
  query, so a mandatory rule is satisfiable by the present data.

## Files created or modified

- Created: `reviews/releases/SBLA-009-research-integrity-gate-r2.md` (this report).
- Nothing else. No implementation, test, fixture, documentation, handoff or ledger file was touched,
  and the immutable R1 report was not modified.

## Required reviewer action

**FAIL.** Per `docs/runbooks/operating-policy.json` (`passRequiresZeroCritical`,
`passRequiresZeroImportant`, `failedReviewAction: "bounded-remediation-then-full-artifact-recheck"`),
one unresolved Important finding blocks PASS. Codex opens **one bounded remediation claim** — not a
reopened builder claim — and addresses:

1. **N-1** — require the submitted query on every search receipt and every packet search as a nonempty
   string, with its own stable code, exact JSON path, error-table entry and isolated fixture mutation;
   keep the existing equality comparison. (Or, less preferably, delete the "exact submitted query"
   claim from the handoff and from `docs/authoring/research-integrity-errors.md:97-98`.)

The remediation should be narrowly scoped to N-1. New Minors N-2 through N-6 are non-blocking and each
carries its impact and destination above; N-2 is a one-line string change and should be folded into
this remediation if it touches diagnostics at all. Deferred R1 Minors M-2 through M-5 remain open as R1
graded them, with their original impact and destination. **Do not change the determinism behaviour for
M-2** — it is verified correct; only the test is weak.

After remediation, one complete-artifact recheck (`-r3`) by this same independent role. This report is
append-only and immutable; a third round creates
`reviews/releases/SBLA-009-research-integrity-gate-r3.md` and never edits this file.

Integration into `main` remains blocked until that recheck returns PASS. As both prior handoffs state,
integration would not by itself make the SBLA-009 research candidate acceptable: Account A's `0880d5f`
candidate passing this gate is a bookkeeping result only, all existing content and cross-link gates
must also pass, and the single complete SBLA-010 citation-entailment and adversarial review is still
owed.

## Acceptance criteria applied

|   # | Criterion                                                                                 | R1 result | R2 result                            |
| --: | ----------------------------------------------------------------------------------------- | --------- | ------------------------------------ |
|   1 | Active coordination claim verified before writing                                         | PASS      | PASS                                 |
|   2 | Candidate reviewed at the immutable commit named in the claim                             | PASS      | PASS                                 |
|   3 | Remediation handoff's file checksums and line counts reproduce                            | PASS      | PASS                                 |
|   4 | Remediation handoff's external detection proofs reproduce exactly (both candidates)       | n/a       | PASS                                 |
|   5 | Remediation handoff's `pnpm verify` result reproduces                                     | PASS      | PASS                                 |
|   6 | Gate is deterministic and non-mutating                                                    | PASS      | PASS                                 |
|   7 | Gate is path-portable and handles malformed input without crashing or silently skipping   | PASS      | PASS                                 |
|   8 | Bundle discovery finds and fails partial bundles; `--bundle` isolates correctly           | PASS      | PASS                                 |
|   9 | Gate is compatible with, and correct against, the current SBLA-009 artifacts              | PASS      | PASS                                 |
|  10 | No false pass reachable by editing recorded values without fixing the underlying evidence | **FAIL**  | **FAIL** (N-1)                       |
|  11 | All four companions are reconciled against one another, as claimed                        | **FAIL**  | **FAIL** (N-1; I-1 otherwise closed) |
|  12 | A misdirected or absent repository root cannot report PASS                                | **FAIL**  | PASS as prescribed (residual N-5)    |
|  13 | No false failure on a well-formed, honestly recorded bundle                               | **FAIL**  | PASS                                 |
|  14 | Shipped documentation is executable and matches enforced behaviour                        | **FAIL**  | **FAIL** (N-1; N-2 non-blocking)     |
|  15 | Tests genuinely exercise every claimed invariant                                          | **FAIL**  | FAIL, non-blocking (M-2)             |
|  16 | Every R1 Important finding is demonstrably closed                                         | n/a       | PASS (5 of 5)                        |
|  17 | R1 Minor M-1 closed; deferred Minors retain impact and destination                        | n/a       | PASS                                 |
|  18 | The immutable R1 report is unmodified                                                     | n/a       | PASS                                 |
|  19 | Reviewer wrote only its single permitted append-only path                                 | PASS      | PASS                                 |

Mandatory criteria 10, 11 and 14 are not met, each for the single reason recorded as N-1.
**Verdict: FAIL — 0 Critical, 1 Important, 5 new Minor, 4 deferred R1 Minor.**
