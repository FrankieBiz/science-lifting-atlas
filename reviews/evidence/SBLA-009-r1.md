# Evidence review: SBLA-009 evidence pass and draft claims, round 1

**Task:** SBLA-009 — Search, screening, extraction, appraisal, synthesis, and draft claims for one
muscle and two exercises (master plan §18 queue row; §14 Phase 1 Task 1.2). Round 1 independent
adversarial acceptance review of the complete eleven-file candidate.
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
remediate, or contribute to any SBLA-009 artifact, and I received none of the authoring role's
reasoning beyond the committed artifacts (master plan §9.10).
**Review date:** 2026-09-13 (all network evidence timestamped UTC below)
**Reviewer worktree:** `C:\src\s009r1`
**Reviewer branch:** `claude-review/SBLA-009-r1`
**Reviewer write path:** `reviews/evidence/SBLA-009-r1.md` — sole permitted path. No other file was
created, edited, staged, or committed. No research artifact was repaired (AGENTS.md role table;
CLAUDE.md "Never repairs the artifact under review").

**Reviewed candidate commit:** `8cee805ce53289cec9d62336defce2a45d7b9da5` _(immutable)_
**Reviewed candidate tree:** `9a829ae5e8afd9d566a4143806237b358777e81b` _(immutable)_
**Candidate parent / diff base:** `303b23fb7e4a8794c9d83e64b5b3d4253006074f`
**Accepted dependency:** SBLA-008 accepted at `0fde685a33118c7ffcdcaf189e104c37ac2cea66`
**Frozen decisions:** `reviews/releases/SBLA-009-prerequisite-decisions.md` at
`8ca59e850beb0770554074d474a3ff3a9e16710a`

---

## 0. Verdict

**FAIL — 1 Critical, 13 Important, 10 Minor.**

The acceptance rule in CLAUDE.md and AGENTS.md is strict: a candidate passes only with **zero
unresolved Critical and zero unresolved Important findings**. This candidate has one Critical and
thirteen Important findings, so it fails. One bounded remediation followed by one complete-artifact
recheck (`-r2`) is the prescribed path; §10 gives the bounded plan.

This verdict should not be read as a judgement that the work is poor. It is not. Large parts of this
candidate are the strongest evidence work I have reviewed in this repository, and §9 records every
falsification attempt that failed. The reconciliation arithmetic reproduces exactly from raw records.
Nine of nine reproducible search routes returned my independently measured counts to the record. Both
retracted sources were correctly found and blocked. No claim cites a retracted source, the corrected
review supplies no number, the single preprint supports nothing, no related fly is promoted to index
Y, and EMG is nowhere presented as hypertrophy evidence. The two headline absence claims survived
every falsification route I ran.

The candidate fails on a narrower and more specific ground: **it states completeness properties it did
not establish.** Twenty-two of its own twenty-four `awaiting-full-text` records carry
`ladderStepsTried: []` — zero recorded acquisition attempts — while notes on those records read "no
lawful full text was obtained," and while the reader-facing draft states in bold that "Nobody has
studied this exercise." The single record the candidate itself calls "potentially the most directly
relevant tier-4 press-versus-fly source found" is freely downloadable; I retrieved it in this session.
Around that central defect sit a set of individually small, individually verifiable errors — a
sixteen-fold overstated sample size, a mis-transcribed participant count, two qualifiers asserting
that source facts are absent when they are present, an entailment failure on the only safety statement
on the index-Y page, and six cross-links that break on any case-sensitive filesystem.

---

## 1. Provenance verification

### 1.1 HEAD and tree

```
$ git rev-parse HEAD
8cee805ce53289cec9d62336defce2a45d7b9da5
$ git rev-parse HEAD^{tree}
9a829ae5e8afd9d566a4143806237b358777e81b
$ git status --porcelain
(empty)
$ git branch --show-current
claude-review/SBLA-009-r1
```

HEAD equals the assigned candidate commit and the assigned tree exactly. The worktree was clean at
review start.

### 1.2 Exact-path claim

Verified before writing, per CLAUDE.md step 2:

```
$ git show origin/codex/SBLA-007-review-coordination:docs/runbooks/current-work.md
```

The active claim reads:

| Field            | Recorded value                             |
| ---------------- | ------------------------------------------ |
| Task             | SBLA-009 evidence review R1                |
| Role             | Claude Review (account B)                  |
| Branch           | `claude-review/SBLA-009-r1`                |
| Worktree         | `C:\src\s009r1`                            |
| Base commit      | `8cee805ce53289cec9d62336defce2a45d7b9da5` |
| Started          | 2026-09-13 16:10 EDT                       |
| Expected handoff | `reviews/evidence/SBLA-009-r1.md`          |
| Paths owned      | `reviews/evidence/SBLA-009-r1.md`          |

Every field matches this session. The claim was recorded by Codex on my behalf, as required — my role
cannot write that ledger, and I did not edit it. `reviews/evidence/SBLA-009-r1.md` did not exist at
the candidate commit, so this report creates rather than overwrites, preserving append-only history
alongside `SBLA-008-r1.md`, `-r2.md`, `-r3.md`.

### 1.3 Role boundary

```
$ git diff --name-status 303b23fb7e4a8794c9d83e64b5b3d4253006074f 8cee805ce53289cec9d62336defce2a45d7b9da5
A  content-drafts/exercises/barbell-flat-bench-press.md
A  content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md
A  content-drafts/muscles/pectoralis-major.md
A  content-drafts/syntheses/SBLA-009-atomic-claims.json
A  research/appraisals/SBLA-009-appraisals.md
A  research/extractions/SBLA-009-source-extractions.json
A  research/packets/SBLA-009-handoff.md
A  research/packets/sbla-009-evidence-packet.json
A  research/screening/SBLA-009-screening-flow.json
A  research/searches/SBLA-009-search-receipts.json
A  research/syntheses/SBLA-009-synthesis.md
11 files changed, 29560 insertions(+)
```

Exactly eleven added paths, 29,560 insertions, all inside `research/` and `content-drafts/`. No
`src/`, `tests/`, `scripts/`, `content/`, `.github/`, `docs/` or `reviews/` path appears.
`git diff --check` over the committed range reports no whitespace errors.

**Caveat required by CLAUDE.md:** I ran this scan from my own mutable review worktree. Per the
role-path rule, an authoritative boundary result must come from Codex or CI executing
`check-role-paths.mjs` from a trusted checkout against the candidate with `--repository`. Treat §1.3
as a corroborating scan, not as independent boundary evidence.

### 1.4 Codex continuity handoff, audited as provenance only

The handoff discloses that Claude Research Account A reached its usage limit after 1 h 16 min, and that
Codex then corrected the packet filename, executed Account A's `build-packet.mjs`, formatted the
artifacts without changing scientific content, repaired the `content-drafts/` validation gate on a
separate branch, and assembled the handoff mechanically. The transfer is pre-recorded in coordination
commit `6cbfd32` and in the closed-claims ledger, which states Codex "adds or approves no scientific
claim."

I audited this as provenance and treated it as neither scientific authorship nor evidence of
correctness. Findings:

- The disclosure is accurate and specific, and it correctly instructs Account B to audit the
  continuity path. It does not overstate what Account A verified — uncertainty 11 explicitly warns
  against inferring a completed Account-A self-check.
- The mechanical claims are independently reproducible: `pnpm verify` passes (§5.3), the packet
  validates (§5.2), the arithmetic closes (§4).
- Codex's one substantive act — renaming the packet to lowercase so the path-to-ID validator would
  pass (Decision 8) — was **not propagated** to the six artifacts that reference it. That is
  finding **I-1**, and it is exactly the class of defect the continuity disclosure told me to look for.
- Handoff Decision 6 ("Apply the full-text rule even when costly") and the artifact-inventory line
  counts are both inaccurate as written; see **C-1** and **M-2**.

I found no instance of Codex adding or altering a scientific claim.

---

## 2. Methods

All commands were run from `C:\src\s009r1` at the candidate commit. Network evidence was gathered
only through public, unauthenticated APIs and public web pages, with an honest project User-Agent. **No
access control was circumvented, no user-agent substitution was used, and no paywall or shadow library
was accessed.** Where a host blocked my client, I recorded the status code rather than working around it.

**Toolchain.** The host default was Node.js v24.14.0 / pnpm 11.19.0, which does not meet the pinned
engine (`node >=24.20.0 <25`, `pnpm 11.24.0`; `.node-version` = 24.20.0). I installed the pinned
runtime rather than run under the default:

```
Invoke-WebRequest https://nodejs.org/dist/v24.20.0/node-v24.20.0-win-x64.zip   # 37,539,751 bytes
node --version   -> v24.20.0
corepack prepare pnpm@11.24.0 --activate
pnpm --version   -> 11.24.0
pnpm install --frozen-lockfile   -> Done in 11.4s using pnpm v11.24.0
```

**Static analysis.** Node scripts over the five structured artifacts for reconciliation, terminal-state
uniqueness, exclusion-code recomputation, deduplication consistency, cross-link resolution,
claim-to-source closure, and draft claim-ID resolution.

**Schema validation.** `validateRecord('evidencePacket', packet)` imported directly from
`src/lib/content/schemas.ts` via `tsx` under the pinned runtime.

**Search reproduction.** NCBI E-utilities `esearch.fcgi` (GET, paced, no API key) for the six PubMed
strata; Europe PMC REST `search` v6.9 for the E1 composites and the fly-family stratum;
ClinicalTrials.gov API v2; OpenAlex; Crossref; EMBL-EBI OLS4.

**Source verification.** Europe PMC REST `core` result type and `fullTextXML`; NCBI PMC and Bookshelf
web pages; publisher and repository endpoints.

**Same-account specialist support.** A read-only absence-falsification memo was prepared in a separate
same-account session (transcript
`…/projects/C--src-s009r1/5648bd75-d905-4a1c-b0f1-e7cdc596c901.jsonl`, last assistant message, 35,782
characters). That session created, edited, staged and committed nothing; `git status --porcelain` was
empty and HEAD unchanged at `8cee805` on its completion. It is **reviewer support, not a second
independent review**, and it issued no verdict. I treated every assertion in it as a lead to be
checked, not as evidence. Each memo-derived finding cited below (**C-1, I-2, I-3, I-4, I-5, I-6**,
**M-7** through **M-10**) records my own independent verification command and result. Where the memo
and I differ on severity, my grading governs; I record one such difference in §6. The memo also warns
that a `WebSearch` summariser twice fabricated a citation ("Dell'Avanzia et al. 2025, _Frontiers in
Physiology_") that resolves in no primary index; I did not chase it, and I record it here only so it is
never mistaken for a contradiction to an absence record.

---

## 3. Artifact inventory

SHA-256 and byte/line counts recomputed in this session at the candidate commit. Git blob IDs are from
`git rev-parse 8cee805:<path>`.

|   # | Path                                                                       | Git blob   | SHA-256                                                            |   Bytes |  Lines |
| --: | -------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ | ------: | -----: |
|   1 | `research/searches/SBLA-009-search-receipts.json`                          | `7bdbcbc0` | `75eebe4cd252471724feda3fd356ab480fa4d19aaafe60cd84b634907d4ece4e` | 133,277 |  1,185 |
|   2 | `research/screening/SBLA-009-screening-flow.json`                          | `06f1cbf7` | `407108ca0c240e14fb905ef4ba86f40e977095dbccd4e1c655ef0762a69eda34` | 752,730 | 18,450 |
|   3 | `research/extractions/SBLA-009-source-extractions.json`                    | `090d48d3` | `81a5dd9d8a3a22c261d6410798d81c3f3f47f3cbdba42cd92168c43a7a679912` | 303,079 |  6,756 |
|   4 | `research/appraisals/SBLA-009-appraisals.md`                               | `546ebeb4` | `8626c5e20920a85dd646b6e23254736a8e8d50877c3d553ac5b558c76b8c2551` |  21,479 |    290 |
|   5 | `research/syntheses/SBLA-009-synthesis.md`                                 | `aa5af0da` | `d3f380359886e788263d9976d9d14947b1c05da3e63898c90b092fef1fd6888f` |  25,325 |    379 |
|   6 | `research/packets/sbla-009-evidence-packet.json`                           | `54004a04` | `3b20611f8648c62c6a7619172e2f2578a73169ecad3601f25b82e52e79bb9625` |  60,307 |    465 |
|   7 | `research/packets/SBLA-009-handoff.md`                                     | `2c07beff` | `c7de4e6b3d130d2f58833383d78e92f2e0d84ba66d14bdd4fe4fff0f8b867103` |  20,276 |    356 |
|   8 | `content-drafts/muscles/pectoralis-major.md`                               | `d1eb8cbd` | `ed1cc528b1747f93a3af184590ca1ff3e6f093b1d888891df2d7c015a21db1e2` |   8,990 |    168 |
|   9 | `content-drafts/exercises/barbell-flat-bench-press.md`                     | `d1c5fdaa` | `d9bc0858a90637ed5a41e76f7961094eb262810d657cbb2ef86d2243ce4cc1b7` |   8,144 |    157 |
|  10 | `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` | `1aa76465` | `6f18acce199af1d54f13cf111a9f262fa6016b4bf67feab2106697323d6cc391` |  10,351 |    191 |
|  11 | `content-drafts/syntheses/SBLA-009-atomic-claims.json`                     | `5b1694bf` | `0b7d9213cbe80461c31ddcdfc2a6704f92340e18159d5c47ab6a3728b9ab1a4e` |  60,380 |  1,163 |

All byte counts match the handoff's inventory table exactly. Five line counts do not; see **M-2**.

---

## 4. Raw reconciliation proof

Recomputed from `records[]` in `research/screening/SBLA-009-screening-flow.json`, not read from the
declared `reconciliation` block.

### 4.1 Terminal states — every record exactly once

```
records.length                       = 1109
duplicate recordIds                  = 0
records missing terminalState        = 0
records with array-valued state      = 0
terminalState counts                 = {"excluded":1009,"included":76,"awaiting-full-text":24}
```

1,009 + 24 + 76 = **1,109**. **Equation one closes and reproduces exactly from raw records.**

No record carries `terminalState: "duplicate"`, which is correct: under the frozen SE-U2/SU8 decision
duplicates are deduplication events folded into the retained record, not array members.

### 4.2 Retrieval events

```
records carrying an explicit retrievalEvents field = 152   (distribution {2:85,3:44,4:16,5:5,6:1,7:1})
records omitting the field                         = 957
sum of explicit retrievalEvents                    = 404
404 + 957 (implicit 1 each)                        = 1361  = declared recordsRetrieved
404 - 152 (events beyond the first)                = 252   = declared duplicateRetrievalEvents
```

1,361 = 252 + 1,109. **Equation two closes**, but only under an implicit default of
`retrievalEvents = 1` for the 957 records that omit the field. The field contract states "Sum over all
records equals recordsRetrieved" and does not state that default; applied literally it yields 404. See
**M-1**.

### 4.3 Exclusion codes

```
declared exclusionCodeCounts sum      = 1009
recomputed from records[]             = 1009
per-code mismatches                   = 0   (across all 21 issued codes)
excluded records with no reason code  = 0
non-excluded records carrying a code  = 0
E-REC-1 issued anywhere               = false
```

`E-REC-1` (duplicate) is never issued. This is correct and is a deliberate, well-judged conflict
resolution: the SBLA-008 eligibility plan §6.4 and line 393 direct duplicates into `exclusions[]`
under `E-REC-1`, but the later frozen SE-U2/SU8 decision supersedes that mapping and forbids encoding
a duplicate as a substantive exclusion. The executor followed the superseding decision.

### 4.4 Deduplication and the thirteen fuzzy-only merges

```
merged records (events>1) lacking dedupKeysMatched = 0
unmerged records carrying dedupKeysMatched         = 0
fuzzyOnlyMerge === true                            = 13   (matches handoff AM-2)
```

I inspected all thirteen. Twelve are unambiguous. The thirteenth, **G0104**, merges two distinct PMIDs
(35916746 and 33927112) and two DOIs, which I treated as a candidate mis-merge and verified against
Europe PMC:

| PMID     | Journal record                           | DOI                            | Pages     |
| -------- | ---------------------------------------- | ------------------------------ | --------- |
| 35916746 | _J Strength Cond Res_ 2022, vol 36 iss 8 | `10.1519/jsc.0000000000003971` | 2176–2185 |
| 33927112 | _J Strength Cond Res_ 2021, no vol/iss   | `10.1519/jsc.00000000000039`   | —         |

Identical title, identical seven-author list (Davies, Halaki, Orr, Mitchell, Helms, Clarke, Hackett).
This is an ahead-of-print record and its version of record, correctly merged into one unique record;
the truncated DOI on the ahead-of-print entry is why the normalised-title key was needed. **The merge
is correct.** No finding.

### 4.5 Awaiting-full-text and packet exclusions

All 24 `awaiting-full-text` records carry `primaryReasonCode: undefined` — none is encoded as an
exclusion. All 16 packet exclusions map to screening records whose terminal state is `excluded`, with
packet code equal to screening code in all 16 cases:

```
packet exclusions not mapping to an excluded record = 0
packet exclusions citing an awaiting-full-text record = 0
packet exclusions citing an included record           = 0
excluded records in screening = 1009 ; packet carries 16 (deliberate subset)
```

The 16 are exactly those that reached candidate-evidence stage or required explicit
retraction/multi-report handling, as the handoff states. **The four-state discipline is correctly
implemented.** No finding.

### 4.6 Cross-artifact closure

```
screening included (76)  ->  extractions (76)          : 0 missing, 0 extra
screening AFT (24)       ->  awaitingFullText register : 0 mismatched
packet includedSourceIds ->  extraction proposedSourceIds : 0 missing, 0 extra
duplicate proposedSourceIds : 0
access levels: full-text-open 24, abstract-only 50, metadata-only 2  (= 76)
publication.stage: peer-reviewed 73, other-non-peer-reviewed 2, preprint 1
publication.status: current 75, corrected 1
statusCheckedAt missing 0 ; nextStatusCheckAt missing 0
distinct sourceIds cited by the 22 claims = 59 ; cited but not in the included set = 0
draft claim-ID references = 66 across 3 drafts ; unresolved IDs = 0 ; orphan claims = 0
```

Structural integrity is complete. Note that 24 + 50 + 2 = 76 means **52** included sources lack full
text, not 50; the handoff's "fifty of 76" is literally true of `abstract-only` but omits the two
`metadata-only` records (**M-3**).

---

## 5. Contract, schema and repository gates

### 5.1 Cross-links

Twenty-seven cross-links across the five structured artifacts. Twenty-one resolve. Six do not, on any
case-sensitive filesystem — see **I-1**. A naive `fs.existsSync` check on Windows reports all
twenty-seven as present because NTFS is case-insensitive; I re-checked case-sensitively against
`git ls-tree`, which is authoritative.

### 5.2 Strict evidence-packet schema

```
$ npx tsx  → import("file:///C:/src/s009r1/src/lib/content/schemas.ts")
exports: …, evidencePacketSchema, …, validateRecord
validateRecord("evidencePacket", packet)  →  { "success": true, "data": { "id": "sbla-009-evidence-packet", … } }
```

**Validates.** Packet internals: 43 searches, 76 `includedSourceIds`, 16 `exclusions`, `synthesis`,
`decisionLog`, `reviewState`. (The temporary loader script used for this check was deleted
immediately; `git status --porcelain` was empty afterwards.)

### 5.3 `pnpm verify`

Run under the pinned runtime on the candidate tree. **Exit code 0.**

| Gate                               | Result                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| `prettier --check .`               | All matched files use Prettier code style                      |
| `eslint . --max-warnings 0`        | pass, 0 warnings                                               |
| `astro check`                      | 55 files — 0 errors, 0 warnings, 0 hints                       |
| `vitest run tests/unit`            | 16 files, **237 tests passed**                                 |
| `validate:content`                 | Content validation passed: 1 records                           |
| `validate:graph`                   | Graph validation passed: 0 nodes (generation remains SBLA-011) |
| `evidence:status`                  | passed: 0 sources checked (promotion remains SBLA-011)         |
| `astro build`                      | 1 page built, static                                           |
| `test:portability`                 | 3 files, **17 tests passed**                                   |
| `verify:foundation`                | Foundation contract passed                                     |
| `assets:spike` / `assets:decision` | pass / pass                                                    |

Every figure the handoff reports for `pnpm verify` is independently reproduced. Note that the suite
passes **despite** I-1, because it runs here on a case-insensitive filesystem and no test asserts
cross-link resolution.

---

## 6. Per-claim citation-entailment matrix

Legend — **E**: entailed by the cited locator at the recorded access level. **V**: verified by me
against the primary source in this session. **Verdict**: PASS, or the finding ID that attaches.

### 6.1 The 22 draft claims

|   # | Claim ID                                                            | Type                    | Certainty                    |  V  | Verdict and note                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --: | ------------------------------------------------------------------- | ----------------------- | ---------------------------- | :-: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | `claim-pectoralis-major-attachments`                                | anatomy                 | established-descriptive-fact |  ✔  | **PASS.** StatPearls NBK525991 read in full: origins verbatim-match ("anterior surface of the medial half of the clavicle, the anterior surface of the sternum, the first 7 costal cartilages, the sternal end of the sixth rib, and the aponeurosis of the external oblique"). Claim generalises "first 7 costal cartilages" to "upper costal cartilages" — a loss of specificity, not an overreach. Background attribution of G0292's introduction to "its own reference 1" is accurate and correctly typed `neutral-context`. Access label: **M-3**. |
|   2 | `claim-pectoralis-major-humeral-footprint`                          | anatomy                 | moderate                     |  ✔  | **I-10.** Numbers exact against PMC7384958: 75 ± 9 mm S-I, 7 ± 1 mm M-L, clavicular 19 ± 8 mm vs sternal 38 ± 8 mm superiorly, n=14. But the qualifier "donor age and sex are not stated in the retrieved text" is false — the retrieved full text states 51 ± 14 years (range 21–70), 9 male / 5 female.                                                                                                                                                                                                                                               |
|   3 | `claim-pectoralis-major-enthesis-unilaminar`                        | anatomy                 | low                          |  ✔  | **PASS.** "All specimens demonstrated a unilaminar, not bilaminar, enthesis", abundant fibrocartilage, three methods, n=14 — exact. Qualifier that a layered structure elsewhere in the tendon is not excluded is verified against the paper's own statement that the medial tendon is generally described as layered. Exemplary handling of a contested finding.                                                                                                                                                                                       |
|   4 | `claim-pectoralis-major-portions`                                   | anatomy                 | established-descriptive-fact |  ✔  | **PASS.** "2 heads, the clavicular and sternocostal"; sternocostal "described as having between 2 and 7 distinct segments" — verbatim match.                                                                                                                                                                                                                                                                                                                                                                                                            |
|   5 | `claim-pectoralis-major-structural-variation`                       | anatomy                 | moderate                     |  ✔  | **I-10.** 63.75 % of 80 specimens from 40 cadavers (22 M / 18 F), separate clavicular portion most frequent — all exact against PMC6466946. Qualifier "donor age is not stated in the retrieved text" is false: "The mean age of the cadavers was 69.3 ± 11.8 years (range: 48-90 years)". An elderly cadaveric sample is a material applicability limitation for a page written for lifters.                                                                                                                                                           |
|   6 | `claim-pectoralis-major-innervation`                                | anatomy                 | moderate                     |  ✔  | **PASS at claim level; I-9 downstream.** The claim's own wording ("a Sihler-stained series") is defensible. Verified: "PM is mainly innervated by the lateral pectoral nerve"; "In all specimens stained by Sihler's technique, the contribution of the intercostal nerves in PM innervation was confirmed." The extraction records this correctly. The synthesis and muscle draft inflate it to "80 specimens" — see I-9.                                                                                                                              |
|   7 | `claim-pectoralis-major-adduction`                                  | function                | high                         |  —  | **PASS.** Three sources, `qualifies` link used correctly to keep internal rotation out of the headline. The moment-arm-is-not-force qualifier is present and correct; `high` is defensible for a measured-leverage claim with consistent multi-source support.                                                                                                                                                                                                                                                                                          |
|   8 | `claim-pectoralis-major-regional-differentiation`                   | function                | moderate                     |  ✔  | **PASS at claim level; I-9 downstream.** "12-108 % more than the clavicular and the superior sternocostal region in extension, adduction with external rotation, and high elevation internal rotation" — verbatim exact against PMID 35093733. Eight sources across five method families, magnitudes explicitly not pooled, and the qualifier that regional activation is not evidence of selective growth is exactly right. Sample size mis-stated downstream: see I-9.                                                                                |
|   9 | `claim-pectoralis-major-regional-activation-varies-with-position`   | function                | moderate                     |  ✔  | **I-13 (partial).** PMID 20512064 verified exact: clavicular greater at 44° vs 0° (p=0.010) and 56° vs 0° (p=0.013). Sound as written. But the stratum that should have fed it omits the "upper/middle/lower portion" vocabulary, so two directly relevant studies never entered screening.                                                                                                                                                                                                                                                             |
|  10 | `claim-pectoralis-major-surface-emg-limitation`                     | exercise-mechanics      | moderate                     |  —  | **PASS.** The strongest methodological move in the candidate: a measurement-fragility claim sourced from inside the evidence set and applied as a mandatory qualifier to every tier-4 statement.                                                                                                                                                                                                                                                                                                                                                        |
|  11 | `claim-pectoralis-major-hypertrophy-with-chest-resistance-training` | longitudinal-adaptation | low                          |  ✔  | **I-7, I-8.** Statement says "two small trials"; three trial sources are cited (PMIDs 38240811, 32922646, 29541130) and appraisal §2.1 says "Three trials survived to full text and can carry a tier-1 statement." Qualifier says "eight further eligible trials"; appraisal, synthesis L-3, the bench-press draft and the handoff all say ten. Numbers within the claim are exact (see 19).                                                                                                                                                            |
|  12 | `claim-bench-press-pectoralis-activation`                           | acute-response          | moderate                     |  —  | **PASS.** EMG-is-not-growth qualifier present; surface-EMG qualifier cross-linked; sample range stated.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|  13 | `claim-bench-press-shoulder-moment-arm-decreases`                   | exercise-mechanics      | low                          |  —  | **PASS.** A 1989 elite-powerlifter study correctly graded `low` with a generalisability qualifier and two `qualifies` links constraining the method.                                                                                                                                                                                                                                                                                                                                                                                                    |
|  14 | `claim-bench-press-inclination-shifts-regional-activation`          | exercise-mechanics      | moderate                     |  ✔  | **I-13.** Cited numbers verified exact (0.62 cm, 95 % CI 0.23–1.0, p = 0.003; PMID 28713459 null). But the statement asserts a monotonic shift, and it is not supported at the top of the claim's own stated range (to 56°): its own source PMID 20512064 shows no clavicular increase from 44° to 56°, and two never-screened studies contradict the monotonic reading outright.                                                                                                                                                                       |
|  15 | `claim-bench-press-grip-width-activation-mixed`                     | exercise-mechanics      | low                          |  ✔  | **PASS.** "The 6-RM loads were 5.8-11.1% greater using a medium and wide grip compared to narrow grip width" — exact. The null is correctly recorded as "cannot distinguish no difference from not enough information," honouring master plan §2.2.                                                                                                                                                                                                                                                                                                     |
|  16 | `claim-bench-press-pectoralis-rupture`                              | safety-context          | low                          |  ✔  | **PASS as written; I-11 in use.** Scope is confined to bench pressing; the no-denominator qualifier is present; the steroid-association qualifier is verified against PMID 35413736. The claim itself is sound. The defect is that the fly draft uses this ID for a fly-machine statement it does not cover.                                                                                                                                                                                                                                            |
|  17 | `claim-cable-crossover-shoulder-moment-larger-than-bench-press`     | exercise-mechanics      | low                          |  ✔  | **PASS — exemplary.** Every figure exact against PMC8877248: 0.650 ± 0.113 vs 0.442 ± 0.046 Nm/kg at 15 % BW; 1.026 ± 0.192 vs 0.760 ± 0.079 at 30 %; p < 0.0125. Inclusion criterion 18–45 y with ≥2 h/week confirmed in Methods §2.1. All four qualifiers verified, including that pulley height, elbow angle and stance are unreported, and the authors' own scapula limitation. The refusal to call this index Y is correct and conservative.                                                                                                       |
|  18 | `claim-cable-crossover-elbow-excursion-smaller-than-bench-press`    | exercise-mechanics      | low                          |  ✔  | **PASS.** 21.8 ± 10.9° vs 79.5 ± 6.2° at 15 % BW — exact. The between-participant-variation qualifier matches the paper.                                                                                                                                                                                                                                                                                                                                                                                                                                |
|  19 | `claim-machine-fly-increases-pectoralis-thickness`                  | longitudinal-adaptation | low                          |  ✔  | **PASS.** Verified against PMC11129965: 5 × 10–12 at 10–12RM, 90 s rest, 3 ×/week, 8 weeks vs non-training control; strength vs control right d = 0.533 p = 0.029, left d = 0.721 p = 0.002; stretching vs strength right p = 0.983, left p = 0.905. Randomisation, allocation concealment and blinding are indeed not described. Single supra-axillary site confirmed. The stretching qualifier is reported at full prominence, as §2.2 requires.                                                                                                      |
|  20 | `claim-dumbbell-fly-clavicular-activation`                          | acute-response          | low                          |  ✔  | **PASS.** "2 channel TECA TE4 electromyograph", 24 male volunteers, "all of the tested exercises developed high levels of action potential" — the qualifier about two-channel instrumentation and absent numeric values is exact.                                                                                                                                                                                                                                                                                                                       |
|  21 | `claim-press-versus-fly-activation-mixed`                           | acute-response          | very-low                     |  ✔  | **I-2, I-3, I-12.** Both cited directions verified exact (PMID 33239937 press higher across most phases; PMID 15903389 no significant difference, shorter relative activation time in the fly). But the qualifier "Both studies were read as abstracts only … could not be verified" is false for PMID 33239937, whose full text I read; and the claim is drawn without a directly on-topic 2023 meta-analysis, without an included full-text source already in the set, and without the Schanke thesis.                                                |
|  22 | `claim-multi-joint-versus-single-joint-programme-strength`          | longitudinal-adaptation | low                          |  ✔  | **PASS — exemplary.** "bench press 1 RM (8.1 and 10.9% for SJ and MJ)" and "no differences were found for body composition" — exact. The five qualifiers, especially that the outcome is the exercise only one group trained, are precisely the anti-overreach discipline §2.2 demands.                                                                                                                                                                                                                                                                 |

### 6.2 The 5 absence records

|   # | Absence ID                                         |  V  | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --: | -------------------------------------------------- | :-: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  A1 | `absence-index-cable-fly-no-evidence`              |  ✔  | **Sentence 1 PASS; sentence 2 I-5.** "No study … was retrieved by any route in this pass" survived every route I ran (§7.3) and every route the specialist memo ran. Sentence 2 — "The index comparator condition has no evidence of any tier" — is an unbounded existence claim the retrieval design cannot support, and it was asserted over G1016, a record never opened (**C-1**).                                                                                                    |
|  A2 | `absence-primary-comparison-no-evidence`           |  ✔  | **PASS as a retrieval statement.** I could not falsify it through Europe PMC, PubMed, OpenAlex, Crossref or ClinicalTrials.gov. The interpretation paragraph is a model of correct absence handling: explicitly not equivalence, not ineffectiveness, not a recommendation. The follow-on "has no direct evidence" should carry the same retrieval bound (**I-5**).                                                                                                                       |
|  A3 | `absence-contralateral-sensitivity-analysis-empty` |  ✔  | **PASS.** Confirmed from raw records: every included tier-1 study is `between-participant`; `contrastType` distribution is `{within-participant: 32, not-applicable: 38, between-participant: 6}`. An empty pre-specified analysis correctly reported as a result. **M-9** records an out-of-scope design precedent.                                                                                                                                                                      |
|  A4 | `absence-terminologia-anatomica-anchor`            |  ✔  | **PASS.** I reproduced the failure: `https://fipat.library.dal.ca/ta2/` → connection failure from my client, 2026-09-13 20:33 UTC. The substitute anchors are verified: MeSH D010369 = "Pectoralis Muscles", tree A02.633.567.775, **`children: []`** (confirming the draft's statement that MeSH cannot separate major from minor); UBERON:0002381 = "pectoralis major" with xref **FMA:9627**. Refusing to substitute model memory for an unreachable official anchor is exactly right. |
|  A5 | `absence-architectural-parameters`                 |  —  | **PASS.** Correctly narrows the muscle draft to qualitative architecture and records the gap.                                                                                                                                                                                                                                                                                                                                                                                             |

---

## 7. Search reproduction and contradictory-source search

### 7.1 Route-by-route reproduction — 9 of 9 exact

Every reproducible route returned my independently measured count to the record, 2026-09-13:

| Receipt | Route                                              | Declared | My count | Result |
| ------- | -------------------------------------------------- | -------: | -------: | ------ |
| R-014   | PubMed N-RS1 — 30-phrase fly family                |       77 |   **77** | exact  |
| R-015   | PubMed N-RS2 — pectoral × hypertrophy × RT         |       87 |   **87** | exact  |
| R-016   | PubMed N-RS3 — syntheses                           |       53 |   **53** | exact  |
| R-017   | PubMed N-RS4 — portion-level terms                 |      277 |  **277** | exact  |
| R-018   | PubMed N-RS5 — architecture/attachment/innervation |      206 |  **206** | exact  |
| R-019   | PubMed N-RS6 — contradiction/harms/measurement     |      211 |  **211** | exact  |
| R-002   | Europe PMC E1, original window                     |      397 |  **397** | exact  |
| R-003   | Europe PMC E1, window to execution date            |      398 |  **398** | exact  |
| R-020   | Europe PMC fly-family stratum                      |       51 |   **51** | exact  |

Stratum total 77 + 87 + 53 + 277 + 206 + 211 = **911**, matching the declared "six retrieval strata
pulled 911 PubMed records into screening." **Search reproducibility is excellent** and materially
better than the SBLA-008 baseline.

### 7.2 Access failures reproduced from my own client

Per the task requirement to confirm failures from the client I actually use, with client-specific
limits stated. My client: `curl` with User-Agent
`science-based-lifting-atlas/SBLA-009-review (research; contact via repository)`, no cookies, no
session, no authentication.

| Target                                    | Candidate recorded   | My result (2026-09-13 20:33 UTC) |
| ----------------------------------------- | -------------------- | -------------------------------- |
| `cochranelibrary.com/`                    | HTTP 412 cookie gate | **HTTP 302**                     |
| `cochranelibrary.com/search-manager-help` | HTTP 200             | **HTTP 200**                     |
| `cochranelibrary.com/central`             | —                    | **HTTP 302**                     |
| `onlinelibrary.wiley.com` (article)       | HTTP 403             | **HTTP 403**                     |
| `sciencedirect.com` (article)             | 403/interstitial     | **HTTP 302**                     |
| `mdpi.com` (PDF endpoint)                 | HTTP 403             | **HTTP 403**                     |
| `fipat.library.dal.ca/ta2/`               | connection failure   | **connection failure**           |

My 302 on the Cochrane root is a fourth distinct response code across four dates, which corroborates
rather than contradicts the candidate's explicit statement that the block response "is still not stable
across dates … and that instability is itself recorded rather than smoothed."

**The stated reason for not searching CENTRAL is independently sound.** A 200 on the help page confers
no search access; CENTRAL Search Manager is an interactive subscription-gated interface with no public
API, and this project holds no session. No user-agent substitution was attempted by the candidate, and
none by me. This correctly closes SBLA-008 R2 finding M-10, and it narrows the earlier over-broad
sentence as that finding required. **No finding.**

### 7.3 Independent contradictory-source search

Routes I ran against the two headline absences, all 2026-09-13:

- Europe PMC: fly-family phrases × hypertrophy/thickness/CSA/volume (hitCount 143); "bench press" ×
  fly family × hypertrophy (576); title-restricted fly/pec-deck/crossover × pectoral/chest (133);
  pectoralis major × hypertrophy 2020–2026 (789); bench/chest press × fly family × randomised (196).
- PubMed E-utilities: the six strata, plus an amended portion-terminology stratum (§7.4).
- ClinicalTrials.gov API v2: `query.intr` for six fly-family terms. Raw counts are non-zero
  ("chest fly" 14, "butterfly exercise" 36) but record-level inspection shows every one is loose
  free-text matching on protocol prose — resistance training in compression therapy, congenital heart
  disease, fibromyalgia, firearm-storage implementation. **Zero registrations manipulate a fly-family
  exercise.** The candidate's registry conclusion is independently corroborated.
- OpenAlex: cable fly / chest fly / pec deck × hypertrophy and thickness.

**I could not falsify either headline absence.** No study of the bilateral standing cable fly at
shoulder height, and no press-versus-cable-fly pectoralis size comparison, surfaced through any route.

### 7.4 A demonstrated search-syntax gap, quantified

Stratum N-RS4 is the designated Q1b/Q1c portion-level stratum and underpins claims 8, 9 and 14. Its
portion vocabulary is `clavicular head|clavicular portion|clavicular fibers|clavicular fibres|
sternocostal|sternal head|sternal portion|abdominal head|costal head|regional activation|regional
difference(s)|neuromuscular compartment(s)`. It contains no "upper/middle/lower portion" or
"upper/lower pectoralis" term — the dominant regional vocabulary in the applied training-EMG
literature.

I tested every stratum for three directly relevant records and then quantified the gap:

```
R-014 … R-019  contains any of PMIDs 33049982 / 25799093 / 42003891  ->  0, 0, 0, 0, 0, 0
amended portion stratum ("upper portion" OR "lower portion" OR "middle portion"
  OR "upper pectoralis" OR "lower pectoralis" OR "upper pec" OR "lower pec")  ->  40 records
  already in the 1,109-record screening flow :  6
  never entered screening                    : 34
```

Most of the 34 are clinical, surgical or veterinary and would have been excluded. Four are squarely in
scope, and two of those contradict the claim they bear on:

- **PMID 33049982** — _Effect of Five Bench Inclinations on the Electromyographic Activity of the
  Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise_ (2020,
  n = 30 trained, 60 % 1RM, 0/15/30/45/60°, open access). Verbatim: "the maximal EMG activity for PMUP
  occurred at a bench inclination of 30°… **Inclinations greater than 45° produce significantly higher
  activation of the anterior deltoid and decrease the muscular performance of the pectoralis major.**"
  The relationship is **non-monotonic and reverses above 45°**, inside claim 14's own stated range (to
  56°).
- **PMID 25799093** — _Influence of bench angle on upper extremity muscular activation during bench
  press exercise_ (2016, n = 14, 65 % 1RM). Verbatim: "The sEMG of upper pectoralis displayed **no
  difference during any of the bench conditions** when examining the complete concentric contraction",
  with differences only in the 26–50 % sub-phase. A partial null.
- **PMID 39764299** — _Comparison of muscle activities during bench press at different angles in
  beginners_ (2025, open access). Directly on claim 14.
- **PMID 42003891**, **PMID 32856145**, **PMID 36148298** — bench-press pectoralis sEMG studies bearing
  on claim 12.

Neither contradicting study appears anywhere in the 1,109 records. This is **I-13**, and it is a
different thing from the honestly disclosed composite residual (L-1): it is an identifiable defect in a
pre-specified stratum, not an unscreened remainder.

### 7.5 Retraction, correction, preprint and multi-report verification

| Check                                       | Result                                                                                                                                                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PMID 31188644                               | Europe PMC `pubTypeList` = **["Retracted Publication","Journal Article"]**; "Retraction in" _Int J Sports Physiol Perform_ 2020;15(6):914. Correctly `E-REC-4`.                                                        |
| PMID 30779716                               | `pubTypeList` = **["Retracted Publication","Randomized Controlled Trial","Journal Article"]**; "Expression of concern in" _MSSE_ 2020;52(11):2490 **and** "Retraction in" _MSSE_ 2021;53(6):1318. Correctly `E-REC-4`. |
| Either retracted source cited by any claim? | **No** — `31188644`, `30779716`, `G0127`, `G0129` all absent from the claims file.                                                                                                                                     |
| Corrected review G0521 (PMID 30411350)      | `publication.status: corrected`; cited by **no** claim. The "no number from this review is carried into any claim" statement is true.                                                                                  |
| Single preprint (Research Square, CC BY)    | `publication.stage: preprint`; cited by **no** claim. SBLA-008's "never sole support" limit is satisfied strictly.                                                                                                     |
| Multi-report linkage                        | Four `E-REC-2` secondary reports correctly linked rather than counted; G0104 ahead-of-print merge verified correct (§4.4).                                                                                             |

This section is a clear pass and reflects genuine discipline.

### 7.6 Published-data integrity caught by the author, verified by me

The candidate flags that PMID 29541130 prints identical pectoralis major values for both randomised
arms. I verified this from PMC5812864: bench-press group **17.0 ± 2.8 → 20.8 ± 4.8 mm**; push-up group
**17.0 ± 2.8 → 20.8 ± 4.8 mm** — identical means _and_ SDs at both timepoints, while biceps and triceps
values differ between arms as expected. Every other extracted figure matches exactly (n = 9/arm, 40 %
1RM, 2 ×/week, 8 weeks, 48 h post-test, protein supplement). Setting risk of bias to `high` and using
direction only is the correct response. **This is exemplary work and I record it as a credit.**

---

## 8. Findings

Every finding states its exact location, its impact, and its remediation destination, as CLAUDE.md and
AGENTS.md require. **I did not repair any artifact.**

### CRITICAL

#### C-1 — Absence and completeness statements rest on records that were never opened

**Locations:**
`research/screening/SBLA-009-screening-flow.json` — 22 of 24 `awaiting-full-text` records;
`content-drafts/syntheses/SBLA-009-atomic-claims.json` → `absenceRecords[0].statement`;
`content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` lines ~28 and ~191;
`research/packets/SBLA-009-handoff.md` Decision 6.

**Evidence.** Recomputed from raw records:

```
awaiting-full-text records with empty ladderStepsTried : 22 / 24
awaiting-full-text acquisition objects carrying a date : 0 / 24
abstract-only included sources with empty ladderStepsTried : 40 / 50
```

Eligibility plan §4.5 requires an `awaiting-full-text` record to be logged "with `access.level:
abstract-only`, **the ladder steps tried, and the date**." An empty array is a record that nothing was
tried. Yet the per-record notes read "no lawful full text was obtained," which reads to any reviewer as
an attempted-and-failed acquisition, and handoff Decision 6 presents the set as a principled cost paid:
"Apply the full-text rule even when costly."

The decisive instance is **G1016**, whose own screening note calls it "potentially the most directly
relevant tier-4 press-versus-fly source found, but no lawful full text was obtained," recorded
`metadata-only` with `ladderStepsTried: []`. It is Schanke, W. (2012), _Electromyographical analysis of
the pectoralis major muscle during various chest exercises_, MSc thesis, University of
Wisconsin–La Crosse; OpenAlex `W2902661686`, handle `hdl:1793/62857`. I retrieved it from my own
client:

```
2026-09-13 20:36 UTC
https://minds.wisc.edu/handle/1793/62857                                  -> HTTP 200
https://minds.wisc.edu/server/api/core/bitstreams/02538747-…/content      -> HTTP 200
                                       application/pdf   21,237,276 bytes
```

No authentication, no paywall, no access control circumvented, no user-agent substitution.

The specialist memo read that full text. Its Table 2 (page 14) reports EMG normalised to the barbell
bench press (= 100), n = 14 trained men at 80 % 1RM: **bent-forward cable crossovers 93 ± 22.0 (not
significantly different from the bench press)**, peck deck 98 ± 26.4, inclined dumbbell flys 69 ± 30.5
(significantly lower, p < .05). On the frozen §3.2 attribute test the exercise is a **related
condition, not index Y** — pulley height is not stated in the Methods, and Figure 2 depicts a
high-to-low path, a variant the frozen definition explicitly refuses to pool. So absence record A1's
first sentence survives.

**That is precisely why this is Critical rather than a recall finding.** Whether the index condition
had tier-4 evidence turned on a pulley height recorded in a document the candidate located, flagged as
decisive, and declined to open. The absence happens to hold; the candidate could not have known that,
and asserted it anyway — in the artifact's second sentence ("no evidence of any tier") and in bolded
reader-facing prose ("Nobody has studied this exercise"). Master plan §2.2 prohibits presenting a thin
or unexamined evidence base as a settled one, and §9.8 step 3 requires acquisition to be an auditable
stage with its own record.

The defect is not uniform, and the remediation should not be either. For the ten tier-1 trials held at
`awaiting-full-text` I independently confirmed the disposition is substantively **correct**: all ten
return `isOpenAccess=N`, `inEPMC=N`, `inPMC=N` in Europe PMC and `is_oa=false`, `oa_status=closed`,
`best_oa_location=none` in OpenAlex. For those, C-1 is a documentation defect. For G1016 — and, per the
memo, G1022, which carries a DOAJ open-access landing page while held `metadata-only` with an empty
ladder — it is substantive.

**Impact.** The slice's headline scientific output is an absence. An absence claim cannot stand over
evidence the author identified as decisive and never attempted to retrieve. The defect also
misrepresents method: "no lawful full text was obtained" and "apply the full-text rule even when
costly" both describe a cost that was not incurred.

**Remediation destination.** Claude Research, `research/screening/SBLA-009-screening-flow.json`
(acquisition objects for all 22 records, plus a date field), `research/extractions/…` (G1016, and G1022
via the translation ladder), `content-drafts/syntheses/SBLA-009-atomic-claims.json` (absence records 1
and 2, and `claim-press-versus-fly-activation-mixed`), and the cable-fly draft. Note that screening a
newly obtained record changes both reconciliation equations and `exclusionCodeCounts`.

### IMPORTANT

#### I-1 — Six cross-links break on any case-sensitive filesystem

**Locations:** `research/searches/SBLA-009-search-receipts.json:14`;
`research/screening/SBLA-009-screening-flow.json:13`;
`research/extractions/SBLA-009-source-extractions.json:15`;
`content-drafts/syntheses/SBLA-009-atomic-claims.json:17` (all `crossLinks.evidencePacket`);
`research/appraisals/SBLA-009-appraisals.md:13` and `research/syntheses/SBLA-009-synthesis.md:13`
(rendered Markdown hyperlinks).

All six reference `research/packets/SBLA-009-evidence-packet.json`. The committed file is
`research/packets/sbla-009-evidence-packet.json`:

```
$ git ls-tree --name-only 8cee805 research/packets/
research/packets/SBLA-002-claude-research-readiness-handoff.md
research/packets/SBLA-008-handoff.md
research/packets/SBLA-009-handoff.md
research/packets/sbla-009-evidence-packet.json
```

Root cause is disclosed in handoff Decision 8 — Codex renamed the packet to lowercase so the
path-to-ID validator would pass — but the rename was not propagated. **Impact:** the frozen SE-U2/SU8
decision requires three versioned companion artifacts "with explicit cross-links"; four of five
structured artifacts have a broken `crossLinks.evidencePacket`, and two rendered links 404. The
repository is a static-first build targeting case-sensitive hosting. `pnpm verify` passes here only
because NTFS is case-insensitive and no test asserts cross-link resolution.
**Remediation destination:** Claude Research for the six references. A cross-link-resolution test is a
Codex follow-up (see §11).

#### I-2 — A directly on-topic systematic review and meta-analysis was missed entirely

**Location:** absent from all eleven artifacts. _Electromyographic Activity of the Pectoralis Major
Muscle during Traditional Bench Press and Other Variants of Pectoral Exercises: A Systematic Review and
Meta-Analysis_, **DOI `10.3390/app13085203`**, _Applied Sciences_ 2023, 13(8), 5203, CC BY 4.0
(Crossref-verified in this session, published 2023-04-21). `grep -ril "app13085203"` across `research/`
and `content-drafts/` → **0 hits**.

Its PRISMA flowchart draws from PubMed n = 1019, **SPORTDiscus n = 138, Web of Science n = 781**, →
951 screened → 23 included; all outcomes are EMG, none is muscle size. **Impact:** it narrows
`claim-press-versus-fly-activation-mixed`, currently graded `very-low` / `mixed` from two abstract-only
primaries; and it converts "SPORTDiscus and Web of Science were not searched" from a disclosed
limitation into a demonstrated loss of a synthesis-level source sitting on the review question. MDPI
returned HTTP 403 to my client as it did to the candidate's; an institutional repository copy is open.
**Remediation destination:** Claude Research — screening flow, extractions, and re-derivation of
claim 21.

#### I-3 — An included full-text source bearing on press-versus-fly supports no claim

**Location:** `G0062` / `source-pmid-25713681` (Soncin et al. 2014, _J Hum Kinet_, PMC4327372, CC BY),
`terminalState: included`, `access.level: full-text-open`. Its own screening note reads:
"portion-resolved tier-4 activation data **bearing on press versus fly**."

```
claims file contains "G0062"                -> false
claims file contains "source-pmid-25713681" -> false
```

**Impact.** The one included, open-access, full-text source the candidate itself flagged as bearing on
press-versus-fly is cited by the press-versus-fly claim not at all, while that claim is graded
`very-low` on two abstract-only sources. Seventeen included sources support no claim, which is
acceptable in general; this one is not, because its recorded purpose is the claim it does not support.
**Remediation destination:** Claude Research — extract the contrast and link it to claim 21, or record
why it is unused.

#### I-4 — No backward or forward citation chasing anywhere in the retrieval design

**Location:** `research/searches/SBLA-009-search-receipts.json`, `retrievalDesign` and all 43 receipts.
A search across the receipts, screening flow and synthesis for
`backward|forward citation|snowball|citation chas|cited-by|reference list|hand-search` returns **one**
incidental `hand-search` token and no route. Master plan §9.6 names "citation chaining from included
reviews and primary studies" as a primary discovery channel. **Impact:** for a review whose headline
output is an absence, omitting citation chasing is a first-order recall defect; the specialist memo
recovered I-2 by forward chasing alone from seeds already inside the candidate's own included set.
**Remediation destination:** Claude Research — add backward and forward chasing over the 76 included
sources, recorded as new receipts.

#### I-5 — Unbounded universal absence wording in reader-facing prose and in an absence record

**Locations:** `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` — "**Nobody
has studied this exercise.**" (bold, first line of Practical takeaway), "It reports that the study has
not been done." (closing section), and "…so there is **not even** a registered-but-unpublished study to
suspect"; `content-drafts/syntheses/SBLA-009-atomic-claims.json` →
`absenceRecords[0].statement` sentence 2, "The index comparator condition has no evidence of any tier."

Each is an existence claim. The retrieval design cannot support one: 911 of 11,765 composite hits
entered screening (L-1), CENTRAL was not searched (L-2), SPORTDiscus and Web of Science were not
searched (I-2), there is no citation chasing (I-4), and 22 records were never opened (C-1). The
surrounding prose is careful — "That is not a verdict on the exercise. It is a statement about the
literature" is exactly right — but the bolded sentence is what a reader takes away.
**Impact.** Master plan §2.2 prohibits converting a thin evidence base into a confident universal
statement; §9.5 prohibits categorical universal language below `high` certainty.
**Remediation destination:** Claude Research — bind every one to retrieval ("…was retrieved by the
routes listed"), and cite I-2 as external corroboration, which is stronger than the candidate's own
search can be.

#### I-6 — Non-English recall gap demonstrated, not merely disclosed

**Location:** `research/searches/SBLA-009-search-receipts.json` → `coverageGaps.languages`, which
concedes assumption SA2 (every route uses English terms). A single Portuguese probe surfaces records
absent from all eleven artifacts (both Crossref-verified by me; `grep` → 0 hits each):

| DOI                               | Record                                                                                                   | Bearing                                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `10.1590/s1517-86922007000100012` | _Comparação entre a atividade EMG do peitoral maior… supino reto e crucifixo_, Rev Bras Med Esporte 2007 | A fourth press-versus-fly EMG comparison (machine fly, related condition), n = 13 trained men at 10RM |
| `10.12820/rbafs.v.19n3p342`       | _A utilização de superfície instável aumenta a atividade eletromiográfica…_, RBAFS 2014                  | Clavicular PM EMG, fly on stable vs unstable surface                                                  |

The candidate did retrieve a third Portuguese record (**G1022**) but holds it `metadata-only` with
`ladderStepsTried: []` (verified) despite an open landing page — overlapping C-1.
**Impact:** the frozen U5/EU4 decision forbids a language exclusion; an all-English query vocabulary is
a de facto one, and it costs records directly on claim 21 and on Q1c.
**Remediation destination:** Claude Research — add non-English exercise terms (`crucifixo`,
`aperturas` / `cruce de poleas`, `Fliegende`, 팩덱플라이) to at least the OpenAlex and Europe PMC routes,
and start the translation ladder on G1022.

#### I-7 — The tier-1 trial count is internally inconsistent

**Locations:** `content-drafts/syntheses/SBLA-009-atomic-claims.json` →
`claim-pectoralis-major-hypertrophy-with-chest-resistance-training` (statement: "in **two** small
trials"; qualifier: "**Two** usable trials"); `research/appraisals/SBLA-009-appraisals.md` §2.1
("**Three** trials survived to full text and can carry a tier-1 statement"); the claim cites three
trial sources (PMIDs 38240811, 32922646, 29541130); `research/syntheses/SBLA-009-synthesis.md` §6
("the two usable trials"); both exercise/muscle drafts repeat "two".

The qualifier "One of the two trials prints identical pectoralis values" points at PMID 29541130, which
the claim links as `supports/indirect` — apparently not one of "the two" — so a reader cannot determine
which two trials the claim rests on. **Impact:** the trial count is the stated basis of the `low`
certainty grade on the slice's only tier-1 hypertrophy claim, and it propagates into two reader-facing
drafts. **Remediation destination:** Claude Research — reconcile the count across claim, appraisal,
synthesis and both drafts, or split the claim by exercise family as the appraisal's own §4 table does.

#### I-8 — The awaiting-full-text count is internally inconsistent

**Locations:** "**eight** further eligible trials" in
`content-drafts/syntheses/SBLA-009-atomic-claims.json` (claim 11 qualifier) and
`content-drafts/muscles/pectoralis-major.md`; "**Ten**" in `research/appraisals/SBLA-009-appraisals.md`
§2.1, `research/syntheses/SBLA-009-synthesis.md` L-3,
`content-drafts/exercises/barbell-flat-bench-press.md` ("Ten eligible hypertrophy trials could not be
read in full"), and `research/packets/SBLA-009-handoff.md`. My own count of tier-1 trials in the
`awaiting-full-text` set is **ten**.
**Impact:** two reader-facing draft pages state different sizes for the unread evidence base, which is
the single most decision-relevant number for a reader judging how much to trust the tier-1 section.
**Remediation destination:** Claude Research — same five locations.

#### I-9 — Two downstream numeric overstatements in reader-facing text

The extraction layer is correct in both cases; the error is introduced downstream, which master plan
§9.8 forbids ("A downstream stage may not overwrite upstream material").

**(a) Sihler staining, 80 vs 5.** `research/syntheses/SBLA-009-synthesis.md` §1.2 — "G0292, using
Sihler intramuscular staining **on 80 specimens**"; `content-drafts/muscles/pectoralis-major.md` — "A
**Sihler-stained series of 80 specimens**". The source (PMID 31061824, PMC6466946) states verbatim:
"**five randomly selected muscles** were examined using Sihler's whole mount nerve staining technique."
Eighty is the gross-dissection total. The intercostal-contribution finding rests on **five** specimens.
The extraction records it correctly ("In all specimens stained by the Sihler technique"). **Impact:** a
sixteen-fold overstatement of the evidence base for the contradicting finding that downgrades the
innervation claim from `established-descriptive-fact` to `moderate`, in reader-facing prose.

**(b) High-density EMG sample, 20 vs 29.** `research/syntheses/SBLA-009-synthesis.md` §1.4 — "twenty
healthy females"; `content-drafts/muscles/pectoralis-major.md` — "One high-density study of **twenty**
healthy females". PMID 35093733 states "**twenty-nine** healthy young females across two independent
experiments." **Impact:** a wrong sample size in reader-facing prose describing what the synthesis
calls "the best-supported statement in this pass." The direction is conservative — it understates n —
but it is still a citation-integrity error.

**Remediation destination:** Claude Research — `research/syntheses/SBLA-009-synthesis.md` §1.2 and
§1.4, and `content-drafts/muscles/pectoralis-major.md`.

#### I-10 — Two claims assert that source facts are absent when the retrieved full text states them

**Locations:** `content-drafts/syntheses/SBLA-009-atomic-claims.json` →
`claim-pectoralis-major-humeral-footprint` qualifier ("donor age and sex are not stated in the
retrieved text") and `claim-pectoralis-major-structural-variation` qualifier ("donor age is not stated
in the retrieved text"); mirrored in `research/extractions/SBLA-009-source-extractions.json`
`quality.notes` for X-G0281 and X-G0292.

Both sources are recorded `access.level: full-text-open` with full text obtained
(`open-access-html`, `europe-pmc-full-text`). Verified by me:

| Source                     | Claim says             | Full text states                                                           |
| -------------------------- | ---------------------- | -------------------------------------------------------------------------- |
| PMID 32169467 / PMC7384958 | age and sex not stated | "51 ± 14 years old at time of death, range 21–70"; "9 males and 5 females" |
| PMID 31061824 / PMC6466946 | age not stated         | "The mean age of the cadavers was 69.3 ± 11.8 years (range: 48-90 years)"  |

**Impact.** A mean donor age of 69.3 years is a material applicability limitation for a claim about
"adult humans" presented on a page written for lifters, and it is suppressed rather than stated. The
candidate is inconsistent with itself: appraisal §2.5 cites a mean donor age of 57.9 years for another
series and §5 acknowledges "older donors."
**Remediation destination:** Claude Research — both qualifiers, both extraction `quality.notes`, and a
reconsideration of claim 5's `applicability` grade.

#### I-11 — Citation-entailment failure: a fly-machine safety statement is attributed to a bench-press claim

**Location:** `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md`, Safety context
section:

> "A published case report describes a humeral rupture of the pectoralis major in a 33-year-old man of
> normal habitus who felt sudden pectoral pain and heard a whip-like popping sound **while training on
> a chest fly machine** `[claim-bench-press-pectoralis-rupture]`."
> "One case establishes that the injury can occur **on a fly machine** and nothing about how often."
> "The report is in German and was read through machine-assisted translation without a second
> independent check… `[claim-bench-press-pectoralis-rupture]`"

`claim-bench-press-pectoralis-rupture` states: "Rupture of the pectoralis major tendon is reported to
occur **during the bench press**, and published case reports describe it happening **during a bench
press manoeuvre**," with `scope.conditions: ["bench pressing, …"]`. It carries no fly-machine content
and no translation qualifier. Its link to PMID 35413736 is `role: qualifies`, locator "Abstract,
Introduction (steroid association…)" — the steroid sentence only.

The underlying fact is **correctly extracted** — X-G0032 records the chest-fly-machine mechanism
faithfully and labels it "related condition (machine fly)" — and appraisal §4 even grades the statement
("Pectoralis major rupture occurs during the bench press **and on a fly machine** — low"). The claims
file simply has no claim for it. **Impact:** this is the only safety statement on the index-Y page, it
is a harms assertion about the fly family, and it violates the claims file's own `draftingRule` ("A
sentence in a draft that is not traceable to a claim ID here… is a defect"). Mechanical traceability
passes — all 66 draft claim-ID references resolve — so only semantic entailment review catches it.
**Remediation destination:** Claude Research — add a scoped fly-machine rupture claim with its own
certainty, applicability and translation limitation, and cite it; or remove the statement.

#### I-12 — Accessible full texts recorded as abstract-only, and a claim qualifier that is false as a result

**Locations:** `research/extractions/SBLA-009-source-extractions.json` — X-G0042 (PMID 33239937,
PMC7675616) and X-G0315 (PMID 26488636, PMC4732391), both `access.level: abstract-only`;
`content-drafts/syntheses/SBLA-009-atomic-claims.json` → `claim-press-versus-fly-activation-mixed`
qualifier.

Both records' ladders stop at the Europe PMC `fullTextXML` endpoint. I reproduced that failure exactly
— `https://www.ebi.ac.uk/europepmc/webservices/rest/<PMCID>/fullTextXML` → **HTTP 404** for both — so
the recorded steps are accurate. But ladder step 2 is "PubMed Central, including author manuscripts,"
and both are fully readable at the modern PMC host, which the candidate itself used successfully
elsewhere (G0621 records `pmc-modern-host: 200`). I read PMC7675616 in this session: Methods and
Results complete.

The claim's qualifier states: "Both studies were read as abstracts only; **normalisation, electrode
placement and crosstalk handling could not be verified**." All three are in the readable full text:

- **"RMS EMG values were not normalized**, as the aim of the study was to compare the muscle activity
  within subjects between two quite similar exercises." No reference contraction was used.
- Electrodes "~4 cm medial to the axillary fold."
- Crosstalk acknowledged as an inherent risk, with no mitigation described.
- Effect: "Mean RMS EMG activity in the pectoralis major was **16 % higher in the BBP** compared to the
  DF … during the whole movement (**p = 0.027, ES = 0.36**)."

**Impact.** The un-normalised amplitude comparison is a material methodological defect that the claim
omits while asserting it could not be checked, and it interacts directly with claim 10's surface-EMG
limitation. The claim records `magnitude: not-estimable` when the full text estimates it.
**Remediation destination:** Claude Research — correct both access levels and ladders, and re-derive
claim 21 (jointly with I-2, I-3 and C-1/G1016, which all feed the same claim).

#### I-13 — Stratum terminology gap cost two contradicting studies, and claim 14's wording exceeds its evidence

**Locations:** `research/searches/SBLA-009-search-receipts.json` receipt **R-017** (stratum N-RS4);
`content-drafts/syntheses/SBLA-009-atomic-claims.json` →
`claim-bench-press-inclination-shifts-regional-activation`;
`content-drafts/exercises/barbell-flat-bench-press.md`, "Bench angle";
`research/syntheses/SBLA-009-synthesis.md` §1.4 and §2.7.

Full evidence in §7.4. The designated portion-level stratum omits "upper/middle/lower portion" and
"upper/lower pectoralis"; an amended stratum returns 40 records of which **34 never entered screening**,
including PMID 33049982 (upper-portion EMG peaks at **30°**; inclinations **> 45° decrease pectoralis
performance**) and PMID 25799093 (**no** upper-pectoralis difference across bench conditions over the
whole concentric contraction).

Claim 14 asserts a monotonic shift across a scope running to 56°, at `moderate` certainty. That wording
is not supported even by its own cited source: PMID 20512064 reports clavicular activation greater at
44° and 56° than at 0°, but reports no increase from 44° to 56°, and reports sternocostal activation
greater at 44° than at 56°. **Impact:** two dimensions — a reproducible search-syntax defect distinct
from the disclosed composite residual, and a claim whose statement and certainty grade outrun the
retrieved evidence while the two most direct contradicting primaries are absent from the contradiction
map. Master plan §2.2 prohibits hiding contradictory evidence and null results.
**Remediation destination:** Claude Research for the claim wording, certainty and contradiction map;
the stratum-string defect joins the two syntax defects already routed to the SBLA-008 scope owner under
synthesis L-9.

### MINOR — nonblocking, with impact and destination recorded

| ID       | Finding                                                                                                                                                                                                                                                                                                            | Impact                                                                                                                                                                                                                           | Destination                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **M-1**  | `fieldContract.retrievalEvents` states "Sum over all records equals recordsRetrieved" but 957 of 1,109 records omit the field; the implicit default of 1 is undocumented. Literal application yields 404, not 1,361 (§4.2).                                                                                        | Reproducibility only. Both equations close under the default, and I verified the default is the only consistent reading.                                                                                                         | Claude Research — `research/screening/SBLA-009-screening-flow.json` field contract.      |
| **M-2**  | The handoff inventory reports **non-blank** line counts for the five Markdown artifacts and **total** line counts for the JSON artifacts, without saying so. `wc -l` gives 290 / 379 / 168 / 157 / 191 against the stated 233 / 314 / 135 / 125 / 150; all byte counts match exactly.                              | An independent reviewer running `wc -l` gets a different number for 5 of 10 artifacts. No scientific impact.                                                                                                                     | Codex — `research/packets/SBLA-009-handoff.md` inventory table, on next edit.            |
| **M-3**  | X-G0244 and X-G0505 (StatPearls NBK525991, NBK556059) are `access.level: metadata-only`, yet all seven of their reported facts carry `basis: "full-text"` with chapter-section locators. I verified both chapters are freely readable full text, and that every fact entails exactly.                              | Internal contradiction: a claim graded `supports/direct` cites a `metadata-only` source, which would fail a mechanical "claim must not exceed access level" audit. Direction is conservative; the facts are genuinely full-text. | Claude Research — correct both to `full-text-open` and record the Bookshelf ladder step. |
| **M-4**  | `extraction.language` is `null` for 3 of 76 included sources (G0244, G0505, G0798).                                                                                                                                                                                                                                | Completeness of a contracted field.                                                                                                                                                                                              | Claude Research — extractions.                                                           |
| **M-5**  | The two `E-REC-4` retracted records carry `decidedAtStage: stage-1-title-abstract` while their notes and contradiction-map entry state they were read.                                                                                                                                                             | Stage label understates the work done. No effect on the block.                                                                                                                                                                   | Claude Research — screening flow.                                                        |
| **M-6**  | `sourceSchemaFields.study` is `{}` for **all 76** extractions, and `funding` / `conflicts` are `null` for all 76, though master plan §10.4 defines population, sampleSize, durationWeeks, intervention, comparator, outcomes. The data lives in `reportedFacts` instead, and L-A3 discloses the `null` convention. | Deferred mapping cost at promotion, not an evidence defect. Disclosed.                                                                                                                                                           | Codex / SBLA-011 — source-record mapping.                                                |
| **M-7**  | Only one trial registry (ClinicalTrials.gov). WHO ICTRP, ISRCTN, ReBEC, ANZCTR, CTRI, ChiCTR, UMIN, IRCT untried.                                                                                                                                                                                                  | **Conclusion unaffected** — I independently verified credible zeros on ClinicalTrials.gov, and the specialist memo verified ISRCTN. Only the warrant is thin.                                                                    | Claude Research — cite the independent checks, or add WHO ICTRP.                         |
| **M-8**  | PMID 18076235 (Santana et al. 2007, standing cable press vs bench press) is in no artifact.                                                                                                                                                                                                                        | **None.** Out of scope: a press with intentional elbow extension, and unilateral. Recorded as a recall datapoint.                                                                                                                | Claude Research — coverage-gap note.                                                     |
| **M-9**  | PMID 40692697 (dumbbell vs cable lateral raises, within-participant contralateral, 2025) is the exact design the frozen U3/EU1 sensitivity analysis specifies, applied to the cable-vs-free-weight contrast.                                                                                                       | **None** — deltoid, not pectoralis major; does not narrow A3. Useful as a design precedent.                                                                                                                                      | Claude Research — optional citation seed.                                                |
| **M-10** | The `-flys` spelling (no _e_) is absent from every search string. **Checked and closed:** PubMed `"cable flys"/"chest flys"/"dumbbell flys"/"pec flys"/"pectoral flys"[tiab]` → n = 0, all phrases not-found; Europe PMC equivalent → 4 hits, all already retrieved.                                               | **None.** The 30-phrase net was adequate and `[tiab:~0]` absorbed hyphen variants. Recorded so it is not re-raised.                                                                                                              | No action.                                                                               |

---

## 9. Falsification attempts that failed — verified correct

Recorded so a remediation round does not re-litigate them and so credit is visible.

1. **Both reconciliation equations reproduce exactly from raw records** (§4.1–4.3), including all 21
   exclusion-code counts, with zero per-code mismatches.
2. **All 13 fuzzy-only merges are correct**, including G0104, which I suspected of merging two distinct
   studies and verified as an ahead-of-print / version-of-record pair (§4.4).
3. **No duplicate or `awaiting-full-text` record is encoded as a substantive exclusion**, and `E-REC-1`
   is never issued — a correct application of the superseding frozen decision over the older
   eligibility-plan mapping (§4.3, §4.5).
4. **Exclusion sampling across all 21 issued codes** (3 per code, 61 records) found no misclassification.
   The `E-REC-5` proximity-artefact code is a genuine and well-reasoned amendment: `"machine
fly"[tiab:~0]` really does retrieve "on-the-fly machine learning."
5. **The ten tier-1 `awaiting-full-text` dispositions are substantively correct.** All ten return
   `isOpenAccess=N` / `inEPMC=N` in Europe PMC and `is_oa=false` / `oa_status=closed` in OpenAlex.
6. **Zero of the 50 abstract-only sources are flagged open access** in Europe PMC. Only two are in PMC
   at all, and both are I-12.
7. **Nine of nine reproducible search routes returned my counts exactly** (§7.1).
8. **Both retractions, the corrected review, the preprint, and all four multi-report linkages are
   handled correctly** (§7.5). No claim cites a retracted source.
9. **The published data-integrity anomaly in PMID 29541130 is real** and was caught by the author
   before me (§7.6).
10. **The cable-crossover "related condition, not index Y" classification is correct and conservative.**
    I read PMC8877248: the paper states only "a cable pulley system with two separate towers that were
    height-adjustable," confirming pulley height, elbow angle and stance are unreported.
11. **The pec-deck exclusions are correct.** The specialist memo verified from full text that
    PMIDs 35319000 and 38625580 use a named "pec deck machine (Apollo350)"; `E-EXP-3` is right.
12. **EMG is nowhere presented as hypertrophy evidence**, and no related fly is promoted to index Y, in
    any of the 22 claims. The estimand discipline holds: no additive contrast is mixed with a
    substitution contrast, contralateral designs are sensitivity-only and the set is empty, and
    regional hypertrophy stays secondary.
13. **Absence is never converted into equivalence, ineffectiveness, or a universal recommendation.** A1
    and A2 state the opposite explicitly, and no claim uses "better."
14. **The ontology anchors are exact.** MeSH D010369 has `children: []`, confirming the muscle draft's
    statement that MeSH cannot separate major from minor; UBERON:0002381 cross-references FMA:9627.
15. **The Cochrane non-search is correctly reasoned and correctly narrowed** (§7.2).
16. **Every one of the 66 draft claim-ID references resolves**, and every claim and absence record is
    referenced by at least one draft — mechanical traceability is complete.
17. **The "Dell'Avanzia et al. 2025" study does not exist.** Flagged by the specialist memo as a
    search-summariser confabulation, absent from PubMed, Europe PMC, OpenAlex, Crossref and DOAJ. It is
    **not** a contradiction to any absence record and must not be chased.

---

## 10. Criterion-by-criterion PASS/FAIL matrix

Criteria are the ten acceptance conditions in `research/packets/SBLA-009-handoff.md`, plus the
governing constraints from the frozen decisions and master plan §2.2 / §9.4 / §9.5 / §9.8 / §9.9.

|   # | Criterion                                                                                                                              |   Result   | Basis                                                                                                                                    |
| --: | -------------------------------------------------------------------------------------------------------------------------------------- | :--------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | Candidate committed and pushed from the exact stated base                                                                              |  **PASS**  | §1.1, §1.3 — parent `303b23f`, tree matches                                                                                              |
|   2 | Role boundary reports exactly the eleven allowed paths                                                                                 | **PASS**\* | §1.3 — 11 added paths, no forbidden path. \*Not independent boundary evidence; needs the trusted checker                                 |
|   3 | Committed-range whitespace and full `pnpm verify` pass                                                                                 |  **PASS**  | §5.3 — exit 0; 237 unit + 17 portability tests; `git diff --check` clean                                                                 |
|   4 | All structured files parse; strict evidence packet validates                                                                           |  **PASS**  | §5.2 — `validateRecord` returns `success: true`                                                                                          |
|   5 | Every retrieved record reconciles to exactly one terminal state; both equations close                                                  |  **PASS**  | §4.1–4.2 — reproduced from raw records; M-1 is documentation only                                                                        |
|   6 | Every draft claim has an opened source, exact locator, scope, certainty, applicability, and access-level limit                         |  **FAIL**  | I-10 (two qualifiers assert absent facts that are present), I-12 (access level wrong; qualifier false), M-3                              |
|   7 | Absence is not converted into equivalence, ineffectiveness, or a universal training recommendation                                     |  **FAIL**  | Equivalence and ineffectiveness: **PASS**, explicitly and well. Universality: **FAIL** — I-5, over C-1                                   |
|   8 | Contradictory, corrected, retracted, abstract-only, preprint, inaccessible and non-English evidence handled as required                |  **FAIL**  | Corrected/retracted/preprint: **PASS** (§7.5). Inaccessible: **FAIL** — C-1. Non-English: **FAIL** — I-6. Contradictory: **FAIL** — I-13 |
|   9 | Report returns PASS with zero unresolved Critical and zero unresolved Important                                                        |  **FAIL**  | 1 Critical, 13 Important                                                                                                                 |
|  10 | Any nonblocking Minor finding states impact and follow-up destination                                                                  |  **PASS**  | §8 Minor table — all ten routed                                                                                                          |
|  11 | Index Y stays narrow; no related condition silently promoted or pooled                                                                 |  **PASS**  | §9.10, §9.12; the G0034 and G1016 classifications are both correct and conservative                                                      |
|  12 | No mechanics or EMG presented as hypertrophy evidence                                                                                  |  **PASS**  | §9.12; claim 10 applied as a mandatory qualifier throughout                                                                              |
|  13 | Contralateral designs sensitivity-only; regional hypertrophy secondary; difference-in-change estimand; no additive/substitution mixing |  **PASS**  | §6.2 A3, §9.12                                                                                                                           |
|  14 | Preprints never sole support                                                                                                           |  **PASS**  | §7.5 — the single preprint supports no claim                                                                                             |
|  15 | Search reproducibility: exact query, count, transport, timestamp per route                                                             |  **PASS**  | §7.1 — 9 of 9 exact                                                                                                                      |
|  16 | Search completeness adequate to the strength of the stated conclusions                                                                 |  **FAIL**  | I-2, I-4, I-6, I-13; C-1                                                                                                                 |
|  17 | Certainty calibration and language per §9.4 / §9.5                                                                                     |  **FAIL**  | I-13 (claim 14 monotonic wording at `moderate`), I-5 (universal language), I-7                                                           |
|  18 | Extracted fact separated from author interpretation and from project inference                                                         |  **PASS**  | Exemplary — `reportedFacts` / `authorsInterpretation` / `researchRoleInference` are kept strictly apart in every extraction I read       |
|  19 | No copyrighted full text stored; licences recorded; no access control circumvented                                                     |  **PASS**  | No stored full text; licences recorded; §7.2 confirms blocks were recorded, not bypassed                                                 |
|  20 | Cross-links, versions and identifiers valid                                                                                            |  **FAIL**  | I-1 — six broken on a case-sensitive filesystem                                                                                          |
|  21 | Codex continuity path adds no scientific claim                                                                                         |  **PASS**  | §1.4 — audited; disclosure accurate; one unpropagated rename is I-1                                                                      |
|  22 | Handoff is standalone and matches the §13.6 format                                                                                     |  **PASS**  | All ten required sections present; M-2 is a counting-method defect only                                                                  |

**14 PASS, 7 FAIL, 1 PASS with a stated caveat.**

---

## 11. Bounded remediation plan

One bounded remediation, then one complete-artifact recheck at `reviews/evidence/SBLA-009-r2.md`. All
work below belongs to **Claude Research** on a `claude-research/SBLA-009-*-remediation` branch, claimed
by Codex in the ledger before editing, except where noted.

**Step 1 — Acquisition (closes C-1, feeds I-6, I-12).** Run the eligibility-plan §4.5 ladder for all 22
`awaiting-full-text` records with empty ladders and all 40 abstract-only records with empty ladders.
Record every step and its HTTP result, with the date, whether or not it succeeds. Retrieve G1016 and
G1022, and correct the two PMC-hosted access levels. Re-screen each newly obtained record to a terminal
state.

**Step 2 — Retrieval (closes I-2, I-4, I-6, I-13-search).** Add the 2023 SR/MA (`10.3390/app13085203`);
run backward and forward citation chasing over the 76 included sources as new receipts; add the
non-English exercise vocabulary to the OpenAlex and Europe PMC routes; add the portion-terminology
amendment to the N-RS4 stratum and screen its 34 unscreened records.

**Step 3 — Re-derivation (closes I-3, I-12-claim, I-13-claim).** Re-derive
`claim-press-versus-fly-activation-mixed` against all of: the 2023 meta-analysis, G0062, Schanke
(grey literature, tier-4, surface-EMG caveats), and the un-normalised-EMG limitation in PMID 33239937.
Re-derive `claim-bench-press-inclination-shifts-regional-activation`: replace the monotonic wording,
re-grade certainty, and add PMIDs 33049982 and 25799093 to the contradiction map.

**Step 4 — Corrections (closes I-5, I-7, I-8, I-9, I-10, I-11).** Bound every universal absence
statement to retrieval and cite the 2023 SR as external corroboration. Reconcile the trial count and
the awaiting-full-text count across claim, appraisal, synthesis and both drafts. Correct Sihler 80→5
and HD-EMG 20→29. Correct the two donor-demographic qualifiers and reconsider claim 5's applicability.
Add a scoped fly-machine rupture claim, or remove the statement from the fly draft.

**Step 5 — Integrity (closes I-1, M-1 through M-5).** Correct the six packet cross-links; document the
`retrievalEvents` default; correct the two StatPearls access levels; fill the three null language
fields; correct the two `E-REC-4` stage labels.

**Step 6 — Recount.** Steps 1 and 2 add records, so `reconciliation`, `exclusionCodeCounts`, the
included/AFT counts, the packet, and every count quoted in the synthesis, appraisal, handoff and drafts
must be recomputed together. Re-run `pnpm verify` and the packet schema validation.

**Routed to Codex, not to this remediation:** M-2 (handoff line counts); M-6 (source-record mapping,
SBLA-011); and a new suggestion — add a repository test that resolves every `crossLinks` target
case-sensitively, since `pnpm verify` passed on Windows with six broken links (I-1).

**Implicated research paths:**
`research/screening/SBLA-009-screening-flow.json`,
`research/extractions/SBLA-009-source-extractions.json`,
`research/searches/SBLA-009-search-receipts.json`,
`research/appraisals/SBLA-009-appraisals.md`,
`research/syntheses/SBLA-009-synthesis.md`,
`research/packets/sbla-009-evidence-packet.json`,
`content-drafts/syntheses/SBLA-009-atomic-claims.json`,
`content-drafts/muscles/pectoralis-major.md`,
`content-drafts/exercises/barbell-flat-bench-press.md`,
`content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md`.

Until this closes, every file in `content-drafts/` remains unpublished, and SBLA-010 / SBLA-011 must
not promote it.

---

## 12. Reviewer limitations

Stated plainly, because a review that hides its own bounds is worth less than one that does not.

1. **I verified 20 of 22 claims against at least one primary source and 15 against full text.** Claims 7
   and 13 were assessed on internal consistency, locator plausibility and grading discipline only.
2. **I sampled exclusions at 3 per code (61 of 1,009 records), not exhaustively.** A misclassification
   outside that sample would not have been caught.
3. **I did not read all 50 abstract-only sources.** I tested their access status exhaustively (all 50)
   and read a targeted subset.
4. **My role-path scan ran from my own mutable branch** and is not independent boundary evidence (§1.3).
5. **Client-specific limits.** `pubmed.ncbi.nlm.nih.gov` HTML returned a cookie gate to my client, so I
   used the Europe PMC and E-utilities APIs instead. Wiley, MDPI PDF and ScienceDirect blocked me, as
   they blocked the candidate. I circumvented nothing.
6. **The specialist memo is same-account support, not a second independent review.** Every finding I
   took from it, I re-verified with my own command, recorded above. Where I graded differently, I say
   so: the memo graded its C-1 as Critical and I agree, but I narrowed it — for the ten tier-1
   awaiting-full-text records I independently confirmed the disposition is substantively correct, so
   the defect there is documentation, and the substantive failure is specific to G1016 and G1022.
7. **`pnpm verify` ran on Windows/NTFS.** I-1 is invisible to it there; a Linux CI run would behave
   differently.
8. **This is one review round.** It does not replace the SBLA-010 citation-entailment and adversarial
   pass, the random pre-release audit, or owner approval.

---

## 13. Verdict

**FAIL — 1 Critical, 13 Important, 10 Minor.**

Zero unresolved Critical and zero unresolved Important findings are required for PASS. This candidate
has one Critical (**C-1**) and thirteen Important (**I-1** … **I-13**). The ten Minor findings are
genuinely nonblocking and each carries its impact and destination; four of them (**M-7** … **M-10**) are
verified as having no effect on any conclusion.

One bounded remediation per §11, then one complete-artifact recheck at
`reviews/evidence/SBLA-009-r2.md`. This report is append-only and immutable; a second round creates
`-r2` and never edits this file.

I want to record, without softening the verdict, that the failure mode here is unusually narrow. The
candidate's arithmetic, search reproducibility, retraction control, estimand discipline, fact/inference
separation and refusal to manufacture an answer for Q2 are all genuinely strong, and §9 lists seventeen
attacks that failed against it. What it does not yet have is the right to the completeness statements it
makes. Bounding those statements to what was actually retrieved — and opening the records it already
identified as decisive — is most of the distance to PASS.

---

_Reviewed by Claude Review (Account B) on 2026-09-13 against commit
`8cee805ce53289cec9d62336defce2a45d7b9da5`, tree `9a829ae5e8afd9d566a4143806237b358777e81b`._
