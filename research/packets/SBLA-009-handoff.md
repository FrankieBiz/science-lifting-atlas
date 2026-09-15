# Handoff: SBLA-009 — evidence pass and draft claims, R1 bounded remediation

## Objective

SBLA-009 in master plan §18 requires Claude Research, followed by Claude Review, to
deliver:

> Search, screening, extraction, appraisal, synthesis, and draft claims for one
> muscle/two exercises.

Round one of that work was reviewed by Claude Review (Account B) and **failed**:

- **Reviewed candidate:** `8cee805ce53289cec9d62336defce2a45d7b9da5`, tree
  `9a829ae5e8afd9d566a4143806237b358777e81b`
- **Immutable report:** `reviews/evidence/SBLA-009-r1.md` at
  `8154f1167062403a96ee5d6ec0fc63bd50ebfd17` on branch `claude-review/SBLA-009-r1`
- **Verdict:** FAIL — 1 Critical, 13 Important, 10 Minor

That report is not a path in this worktree; it lives on the reviewer branch. Retrieve
it with:

```
git show 8154f1167062403a96ee5d6ec0fc63bd50ebfd17:reviews/evidence/SBLA-009-r1.md
```

This handoff delivers the **one bounded remediation** that report prescribes in its
§11, and requests **exactly one complete-artifact recheck** at
`reviews/evidence/SBLA-009-r2.md`. It is a candidate for independent Account-B review,
not accepted or published content. Nothing in `content/` changed.

### Authorship

Claude Research, Account A, performed all of the work recorded here: the acquisition
ladder, the retrieval expansion, the screening of every new record, the extractions,
the appraisal and synthesis revisions, the claim re-derivations, the packet rebuild and
this handoff. No other role contributed a scientific judgement. Two Account-A sessions
were used; the second resumed the first worktree without resetting it, and both are
Account A.

**Model memory is not evidence anywhere in this remediation.** Every fact added here
was read from a document obtained through a lawful, recorded route, and every route
that failed is recorded with its HTTP status rather than worked around.

## Inputs and exact paths

### Accepted dependency and base

- SBLA-008 accepted: `0fde685a33118c7ffcdcaf189e104c37ac2cea66`
- SBLA-009 prerequisite decisions: `8ca59e850beb0770554074d474a3ff3a9e16710a`
- Failed round-one candidate: `8cee805ce53289cec9d62336defce2a45d7b9da5`
- **This remediation's base commit:** `48e4802786e6862b605800f67702d86f78676d31`

The base is a Codex merge commit. Its first parent is the failed candidate; the only
second-parent changes are an accepted case-sensitive cross-link validator, its test and
its release handoff, integrated on accepted `main` at
`ff67c615d204a71f414370f4064969435d9bbc70` while this worktree was still clean. The
role-path diff below is measured from `48e4802`.

### Workspace identity

- Branch: `claude-research/SBLA-009-r1-remediation`
- Worktree: `C:\src\s009fix1`
- Role: Claude Research, Account A
- Coordination branch carrying the claim: `codex/SBLA-007-review-coordination`
- Claim verified before writing: task "SBLA-009 R1 research remediation", role
  "Claude Research (account A)", base `48e4802786e6862b605800f67702d86f78676d31`,
  eleven owned paths. Every field matched this session. The ledger was not edited by
  this role.

### Governing inputs read in full

`docs/product/master-plan.md`, `AGENTS.md`, `CLAUDE.md`,
`reviews/releases/SBLA-009-prerequisite-decisions.md`,
`research/questions/SBLA-008-vertical-slice.md`,
`research/searches/SBLA-008-search-strategy.md`,
`research/screening/SBLA-008-eligibility-plan.md`, the previous
`research/packets/SBLA-009-handoff.md`, and the complete immutable R1 report.

## Constraints

- Claude Research may write only the eleven claimed `research/` and `content-drafts/`
  paths. No `reviews/`, governance, application code, schema, test, CI, published
  `content/` or `graphify-out/` path was created, edited, staged or committed.
- No access control was circumvented. No user-agent was substituted, no paywall was
  bypassed, no shadow library was accessed. Where a host refused this client the status
  code is recorded and the ladder moved to the next lawful rung.
- No copyrighted full text is stored in the repository. Retrieved documents were read in
  a scratch directory outside the repository; the artifacts retain metadata, lawful
  links, original summaries, minimal locators and checksums.
- A post-hoc amendment may lower certainty and may not raise it (eligibility plan §6.2).
- Index Y stays narrow. No related fly was promoted to index Y.

## Work completed

### Artifact inventory

SHA-256 and byte/line counts measured in this session after the final Prettier pass.
This file cannot contain its own hash; its checksum is reported with the commit.

|   # | Path                                                                       | SHA-256                                                            |     Bytes |  Lines |
| --: | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------: | -----: |
|   1 | `research/searches/SBLA-009-search-receipts.json`                          | `f60dcfe41a716378f20c2cb2ecc8247749fe99785a6b57fe91cacbdad3c3f989` |   157,287 |  1,461 |
|   2 | `research/screening/SBLA-009-screening-flow.json`                          | `3e197033338db26fb00a5e13b72f474ae26c9366f0c80db5c6ce7555db68cd54` | 1,602,741 | 38,530 |
|   3 | `research/extractions/SBLA-009-source-extractions.json`                    | `ec486f9d967eaff8ed05730d535064cc66916b90868dc1c2d9ffa812b8f5e811` |   617,578 | 13,103 |
|   4 | `research/appraisals/SBLA-009-appraisals.md`                               | `489fcc1a0a2dce590bb6edafd0d4c84577db805b90ca2233a677a62b95430ffa` |    29,261 |    335 |
|   5 | `research/syntheses/SBLA-009-synthesis.md`                                 | `09b0f056b759930509e5d672debbd8e2b3526210f670ded37975e4386343ec8d` |    38,280 |    450 |
|   6 | `research/packets/sbla-009-evidence-packet.json`                           | `f197e31e9bb1527ded1d6c6722dbcaeee4520e541ec8a971654a3df6cf20edfe` |    92,200 |    821 |
|   7 | `research/packets/SBLA-009-handoff.md`                                     | _this file; hash reported with the commit_                         |         — |      — |
|   8 | `content-drafts/syntheses/SBLA-009-atomic-claims.json`                     | `0c705ba5a88c589b182ad2416541df4327f27421cae2c416eb0ba4fbbaa2ae35` |    82,288 |  1,388 |
|   9 | `content-drafts/muscles/pectoralis-major.md`                               | `c040ba80c0e60007733326deda72f52ffc1e02d54ab08e712bf446f1c26edd33` |     9,407 |    173 |
|  10 | `content-drafts/exercises/barbell-flat-bench-press.md`                     | `5606ed992a30e62179e75a670988b1a481a13b674bd00ffa8d2a97fb1c046a92` |     9,345 |    174 |
|  11 | `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` | `5d2897760be3913bde5ea869484b30bf582ef5f97fd14334f1d5fbe40a07c93d` |    13,485 |    235 |

All line counts are `wc -l` totals, which is what an independent reviewer running
`wc -l` will see. R1 finding M-2 recorded that the previous inventory mixed non-blank
and total counts without saying so; that table was Codex-owned and is superseded here.

### Reconciliation, recomputed from raw records

```
recordsRetrieved                    = 2343
duplicateRetrievalEvents            =  387
uniqueRecordsAfterDeduplication     = 1956
excluded                            = 1842
awaitingFullText                    =   26
included                            =   88

equation one : 1956 = 1842 + 26 + 88          closes
equation two : 2343 =  387 + 1956             closes
sum of exclusionCodeCounts          = 1842    equals the excluded total
sum of receipts[*].recordsRetrievedIntoScreening = 2343  equals recordsRetrieved
retrievalEvents default             = 1       stated as fieldContract.retrievalEventsDefault
```

Movement from round one: unique 1,109 → 1,956; excluded 1,009 → 1,842;
awaiting-full-text 24 → 26; included 76 → 88; retrieved 1,361 → 2,343; duplicate
retrieval events 252 → 387.

### A cross-artifact contradiction found before commit, and how it was resolved

A reviewer check found that the receipts summed to **5,354**
`recordsRetrievedIntoScreening` against a screening `recordsRetrieved` of **2,227**.
The original 43 receipts sum to exactly 1,361, which was the round-one
`recordsRetrieved`, so the invariant was real and the eight remediation receipts had
broken it. **Two separate defects were found, and both were fixed from raw API output
rather than by adjusting the arithmetic.**

**Defect one, on the receipt side — a mislabelled field.** R-048 and R-049 recorded the
raw citation-chase _candidate pools_ (1,631 backward and 2,219 forward) in a field whose
contract is "how many records this attempt actually pulled into the screening flow".
A candidate pool is not a screened set. R-047 likewise recorded a hit count of 1 for a
result that resolves to no screening record, and R-051 counted four retrievals when one
of the four was already in the flow.

**Defect two, on the screening side — an uncredited retrieval event.** The first pass
credited a retrieval event every time any route returned a record, including records
already in the flow; records carry `retrievalEvents: 7` with seven strata. The
remediation did not do this: when a new route returned a record that was already
screened, the event was silently dropped. That is an **under-count**, and it is the
larger of the two errors.

**Verification.** Both chases and both amended PubMed strata were re-executed against
the live APIs on 2026-09-14. Every route-level figure reproduced exactly — backward
1,631, forward 2,219, union minus seeds 3,559, relevance filter 841 — which confirms the
pools were correctly measured and only mislabelled. The re-run additionally recovered
the backward/forward attribution of the chased records and identified every
already-screened record each remediation route had returned.

**Corrections applied.**

| Receipt |  Was | Now | Basis                                                                                                                                     |
| ------- | ---: | --: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| R-044   |   59 |  59 | 50 new + 9 already-screened records whose re-retrieval is now credited                                                                    |
| R-045   |   26 |  26 | 16 new + 10 already-screened                                                                                                              |
| R-046   |   53 |  55 | 53 new + 2 already-screened; the 6,372 route total moved to `routeLevelCandidateCount`                                                    |
| R-047   |    1 |   0 | its single Europe PMC hit resolves to no screening record                                                                                 |
| R-048   | 1631 | 377 | 209 backward-only + 99 both + 11 unattributable + 43 already-screened backward-only + 15 already-screened both; pool preserved separately |
| R-049   | 2219 | 462 | 425 forward-only + 37 already-screened forward-only; pool preserved separately                                                            |
| R-050   |    0 |   0 | metadata and duplicate resolution only; pulled no record into screening                                                                   |
| R-051   |    4 |   3 | G1903, G1896, G1820; G1016 was already in the flow and its retrieval is an acquisition event, not a search retrieval                      |

Records returned by both chases are attributed to R-048 under a stated **first-touch by
execution order** rule: backward chasing ran first. The 11 records whose OpenAlex work
could not be re-resolved on the verification re-run are credited under the same rule and
labelled as such rather than silently distributed.

**116 retrieval events** were credited to already-screened records that a remediation
route returned again — 9 for N-RS4a, 10 for N-RS7, 2 for the OpenAlex non-English probes
and 95 for citation chasing. Each of those records carries a note saying so.
`recordsRetrieved` therefore rose from 2,227 to **2,343**, duplicate retrieval events
from 271 to **387**, and both equations still close. The receipts now sum to 2,343,
restoring the invariant the original 43 receipts held.

Two new fields keep the two quantities from being conflated again:
`routeLevelCandidateCount` holds the raw pool, and `screeningCredit` states in prose how
each receipt's figure decomposes.

### Packet-to-receipt correspondence

All **51** packet `searches` entries were checked against the receipt each one names:
database, platform endpoint, transport, label, exact submitted query, execution date and
result count. **51 of 51 match; 0 mismatches.** Every receipt is referenced exactly once,
and the packet carries no search entry without a receipt.

### Real acquisition work

The eligibility-plan §4.5 ladder was executed and recorded for every record whose
eligibility could turn on it. **650 acquisition attempts across 124 records**, each
stored as a structured `{step, route, url, attemptedAt, result, note, attemptSource,
verbatim}` object with its real date and observed HTTP result. Zero records held
`awaiting-full-text` or `included` below `full-text-open` carry an empty ladder. Zero
sources remain at `metadata-only`.

Nine sources moved to `full-text-open` once the ladder reached PubMed Central, a
repository or NCBI Bookshelf instead of stopping at the Europe PMC `fullTextXML`
endpoint (which returns 404 for these records): G0042, G0140, G0270, G0315, G0361,
G0521, G0621, G0244, G0505.

Four documents named by the R1 report or surfaced by the new routes were retrieved and
read, with checksums:

| Record | Document                                             | Route                                  |      Bytes | SHA-256                                                            |
| ------ | ---------------------------------------------------- | -------------------------------------- | ---------: | ------------------------------------------------------------------ |
| G1016  | Schanke 2012 MSc thesis, UW–La Crosse                | MINDS@UW repository, no authentication | 21,237,276 | `81a2a094349a0fccd822247cf2d36b08449bffe2035d30869521049c2dc6a950` |
| G1903  | 2023 SR/MA, _Applied Sciences_ 13(8) 5203, CC BY 4.0 | RIUCAM institutional repository        |  3,358,506 | `8ac15532f5cf871ab6e5cb4f7384c1539f3347938a981976e1cff61066cbb50d` |
| G1896  | Rocha Júnior et al. 2007, _Rev Bras Med Esporte_     | SciELO (HTTP 502, then 200 on retry)   |     37,307 | `4a4f78904dcd1bf2e497603f91ab7b680aa2f0b847f2055888f40f0f8fc7c3d5` |
| G1820  | Melo et al. 2014, _RBAFS_                            | RBAFS open-access publisher PDF        |    163,897 | `a3fc9880bfdf5d163f6ce9d8e6a877cf5bae72cccb074a74679d23b844ca7be6` |

### Real retrieval expansion

Eight new receipts, **R-044** through **R-051**, each with its exact submitted query,
endpoint, transport, execution date, HTTP status and count:

| Receipt | Route                                                  | Result                                            |
| ------- | ------------------------------------------------------ | ------------------------------------------------- |
| R-044   | PubMed stratum **N-RS4a**, amended portion terminology | 59 records; 50 new to screening                   |
| R-045   | PubMed stratum **N-RS7**, bench angle                  | 26 records; 16 new                                |
| R-046   | OpenAlex, eight non-English probes                     | 6,372 route-level; 53 into screening after filter |
| R-047   | Europe PMC, the same eight probes                      | 1 hit in total                                    |
| R-048   | Backward citation chasing over the included set        | 1,631 distinct referenced works                   |
| R-049   | Forward citation chasing over the included set         | 2,219 distinct citing works                       |
| R-050   | DOAJ public article API                                | resolved a blocked record and a duplicate         |
| R-051   | Four targeted retrievals                               | all four obtained (table above)                   |

Citation chasing produced 3,559 distinct candidates after removing the seeds; OpenAlex
returned metadata for 3,479; a **pre-specified** relevance expression over the title
retained 841; 96 were already in the flow and **745 were new**. In total the
remediation routes added **848 new unique records**, every one of which was screened to
exactly one terminal state: 11 included, 4 awaiting-full-text, 833 excluded with a
reason code.

## Decisions made

1. **G1016 decides the attribute test from a read document.** Its Methods place the
   arms at chest height and parallel to the floor but **never state the pulley origin
   height**, and Figure 2 depicts handles above shoulder height with a
   downward-and-inward path. The frozen §3.2 table makes pulley origin a defining
   attribute and names high-to-low crossover a distinct condition, so this is a related
   condition and index Y remains unstudied. The absence survives — but it now survives
   on evidence rather than on an assumption.
2. **Certainty was not raised by the enlarged base.** `claim-press-versus-fly-activation-mixed`
   is held at `very-low` despite four primary comparisons and a meta-analysis, because
   three of the four are null, none of the comparators is index Y, the one comparison
   reporting a difference did not normalise its EMG, and the pooled estimates carry
   I² of 94.9 % and 98 %. Eligibility plan §6.2 forbids a post-hoc amendment raising
   certainty, and nothing here would have justified it anyway.
3. **Four eligible records were held back rather than counted as included.** G1873,
   G1917, G1941 and G1944 are eligible on their titles, but no abstract and no full
   text could be obtained for any of them, so nothing can be extracted. §4.5 reserves
   inclusion for records whose content was actually obtained. This lowers the headline
   inclusion count and is the honest disposition.
4. **G1006 was merged into G1022 as a deduplication event.** The DOAJ record carries
   both the Portuguese and English titles of one 2014 RBPFEX report, with an identical
   author list, year and publisher URL. This is a defect that completed retrieval
   exposed; the review was not asked to find it.
5. **Screening of 848 new records used a disclosed two-pass method.** A written,
   deterministic, ordered rule set over title and abstract terminated 756 records; the
   93 survivors were adjudicated individually against the title-stated manipulated
   variable, consistent with dispositions already recorded in round one (G0325 is the
   precedent for a within-exercise variant contrast; G0132, G0265 and G0315 for an
   eligible contrast). The rule set can only exclude, so its errors are over-exclusions
   — recall costs, not false inclusions that could inflate a claim. This is stated as a
   limitation (synthesis L-11), not presented as 756 individual judgements.
6. **The R1 report is referenced by commit, not as a repository cross-link.** It lives
   on the reviewer branch and is not a path in this worktree; the repository validator
   correctly rejected a cross-link claiming otherwise, so each artifact carries a
   `governingReview` block with the commit SHA and the command to retrieve it.
7. **Source IDs were normalised to lowercase kebab case.** Two new DOI-derived IDs used
   underscores and failed `entityIdSchema`; they and the packet's exclusion IDs are now
   kebab-case throughout, with claim references updated in step.

## Finding-by-finding closure

Every finding in the R1 report, with the evidence that closes it.

### Critical

| ID      | Closure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **C-1** | **Closed.** The §4.5 ladder was run and recorded for all 24 awaiting-full-text records and all 52 included records below `full-text-open`: 650 structured attempts across 124 records, each with its real date and HTTP result. Zero empty ladders remain anywhere. **G1016 was retrieved and read in full** (21,237,276 bytes, sha256 `81a2a094…`) and promoted from awaiting-full-text to included; **G1022** was pursued through the DOAJ API after the publisher returned 403 to this client, which both supplied its lawful bilingual abstract and exposed the G1006 duplicate. Nine access levels were corrected upward. The two absence records and the fly draft are now bound to retrieval. The screening and reconciliation were recomputed. |

### Important

| ID       | Closure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I-1**  | **Closed.** All six references now point at the committed lowercase `research/packets/sbla-009-evidence-packet.json`: four `crossLinks.evidencePacket` entries and the two rendered Markdown links in the appraisal and synthesis headers. The accepted case-sensitive cross-link validator integrated into this base passes.                                                                                                                                                                             |
| **I-2**  | **Closed.** DOI `10.3390/app13085203` retrieved from the RIUCAM repository (MDPI served a 2,207-byte interstitial), extracted as **G1903**, and cited on both re-derived claims and as external corroboration on absence record 1. Its PRISMA flow covers SPORTDiscus and Web of Science, partially mitigating the database gap by citation.                                                                                                                                                              |
| **I-3**  | **Closed.** **G0062** is now linked to `claim-press-versus-fly-activation-mixed` with `role: qualifies`, supplying the order-dependence qualifier: chest-fly sternocostal activation was 100.13 % of MVIC when the fly followed the bench press and 81.47 % when it did not. That is the reason no press-versus-fly activation difference is presented as a property of the exercises.                                                                                                                    |
| **I-4**  | **Closed.** Backward (R-048) and forward (R-049) citation chasing now exist over the included set, contributing 745 new records. Both bounds are disclosed: forward chasing is truncated at 200 citing works per seed, and the relevance expression that reduced 3,479 chased works to 841 leaves a quantified residual.                                                                                                                                                                                  |
| **I-5**  | **Closed.** "Nobody has studied this exercise." is gone. The fly draft now reads "These searches found no study of this exercise", the registry sentence is bounded to the one registry actually queried, the closing sentence states it is "a statement about the retrieved literature, not a proof that no such study exists", and both absence records carry `boundedBy` arrays plus the 2023 review as `externalCorroboration`.                                                                       |
| **I-6**  | **Closed on the demonstrated half, disclosed on the structural half.** Non-English vocabulary added to OpenAlex and Europe PMC (R-046, R-047) plus the DOAJ API (R-050). Both records R1 named were retrieved: `10.1590/s1517-86922007000100012` is now included as **G1896**, and `10.12820/rbafs.v.19n3p342` was read in full and excluded `E-EXP-7` with its reason. G1896 needed no machine translation — it carries an authorised English abstract. The structural gap is restated in synthesis L-7. |
| **I-7**  | **Closed.** "Three" now appears in the claim statement, the claim qualifiers, appraisal §4, synthesis §6 and both drafts, and the qualifier names all three trials and states which one contributes direction only. The claim always cited three sources; the word was the error.                                                                                                                                                                                                                         |
| **I-8**  | **Closed.** "Ten" now appears in all five locations. My own recount of tier-1 trials in the awaiting-full-text set is ten, matching the reviewer's independent count.                                                                                                                                                                                                                                                                                                                                     |
| **I-9**  | **Closed.** (a) The Sihler finding is attributed to the **five** randomly selected stained muscles, not 80, in the synthesis §1.2, the muscle draft and the innervation claim; 80 is stated as the gross-dissection total. (b) The high-density EMG sample is **twenty-nine** across two independent experiments in synthesis §1.4 and the muscle draft. Both verified by me from the full texts.                                                                                                         |
| **I-10** | **Closed.** Both qualifiers corrected from the full texts I read: PMC7384958 states "51 ± 14 years old at time of death, range 21–70 years, 9 males and 5 females"; PMC6466946 states "mean age of the cadavers was 69.3 ± 11.8 years (range: 48-90 years)". Both extraction `quality.notes` are rewritten. Recording the second **lowered** `claim-pectoralis-major-structural-variation` applicability from `partially-direct` to `indirect`.                                                           |
| **I-11** | **Closed.** New claim `claim-fly-machine-pectoralis-rupture`, scoped to the fly machine, graded `very-low`, carrying the translation limitation and a "one case has no denominator" qualifier. The fly draft's safety section now cites it instead of the bench-press rupture claim. The `draftingRule` now states that mechanical traceability is necessary but not sufficient.                                                                                                                          |
| **I-12** | **Closed.** X-G0042's access level is corrected to `full-text-open` and its Methods extracted from the full text I read: **"RMS EMG values were not normalized"**, electrodes ~4 cm medial to the axillary fold per SENIAM, cross-talk acknowledged with no mitigation, and the effect 16 % higher in the bench press (p = 0.027, ES 0.36) with per-phase values. The false qualifier is replaced by a statement of the un-normalised amplitude as a material limitation. X-G0315 likewise corrected.     |
| **I-13** | **Closed on both dimensions.** _Search:_ stratum **N-RS4a** (R-044) recovers five of the six PMIDs R1 named, including both contradicting studies. _Claim:_ `claim-bench-press-inclination-shifts-regional-activation` is re-derived — the monotonic wording is withdrawn, certainty drops `moderate` → `low`, direction becomes `mixed`, and PMIDs 33049982 and 25799093 plus the 2023 meta-analysis and PMID 39764299 are all cited. Contradiction-map row **C-10** records the disagreement.           |

### Minor

| ID       | Disposition                                                                                                                                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-1**  | **Closed.** `fieldContract.retrievalEventsDefault = 1` is now a structured field, not prose, and the field contract explains why the literal reading yielded the explicit subtotal.                                                                                                            |
| **M-2**  | **Superseded.** The inventory table above uses `wc -l` totals throughout and says so. The defective table was Codex-owned; this one is Account-A-owned.                                                                                                                                        |
| **M-3**  | **Closed.** Both StatPearls chapters corrected to `full-text-open` with the Bookshelf ladder step recorded (NBK525991, 67,303 bytes; NBK556059, 67,065 bytes). Their facts always carried basis `full-text`, which was the contradiction.                                                      |
| **M-4**  | **Closed.** All three `null` `extraction.language` fields completed; `nullLanguage` is now 0 of 88.                                                                                                                                                                                            |
| **M-5**  | **Closed.** Both `E-REC-4` records moved from `stage-1-title-abstract` to `stage-3-full-record`, with a note stating the label had understated the work done.                                                                                                                                  |
| **M-6**  | **Routed, not actioned.** Source-record `study` mapping belongs to Codex/SBLA-011. Unchanged and still disclosed as L-A3.                                                                                                                                                                      |
| **M-7**  | **Addressed as recorded.** Only ClinicalTrials.gov was queried. `coverageGaps.registries` now names the eight untried registries, cites the reviewer's independent ClinicalTrials.gov and ISRCTN corroboration, and the fly draft's registry sentence is bounded to the one registry searched. |
| **M-8**  | **Recorded.** PMID 18076235 was retrieved by citation chasing, screened, and excluded `E-EXP-7` with the reason that a standing cable press involves intentional elbow extension and is excluded from the fly family by the frozen §3.2 definition. It is no longer absent from the artifacts. |
| **M-9**  | **Noted, not adopted.** PMID 40692697 is a deltoid study and does not narrow absence record 3. It is not cited; the design precedent belongs to whichever task revisits the contralateral sensitivity analysis.                                                                                |
| **M-10** | **No action, as the reviewer determined.** The `-flys` spelling was checked and closed in the R1 report itself.                                                                                                                                                                                |

## Tests/checks run and results

Environment: the host default was Node v24.14.0, which does not meet the pinned engine.
The pinned runtime was installed and used: **Node v24.20.0**, **pnpm 11.24.0**,
matching `.node-version` and `packageManager`.

### External research-integrity gate

Executed from the gate's own trusted checkout against this worktree, exactly as
instructed:

```
node C:\s009integrity\scripts\evidence\research-integrity.mjs --root C:\src\s009fix1 --bundle SBLA-009
```

- **Before this remediation's final pass:** exit 1, with 655
  `ACQUISITION_ATTEMPT_DATE_INVALID`, 655 `ACQUISITION_ATTEMPT_RESULT_REQUIRED`, 1
  `RETRIEVAL_EVENTS_DEFAULT_MISSING` and 1 `PACKET_SOURCE_IDS_MISMATCH`.
- **After:** `Research integrity passed: 1 complete bundle checked (SBLA-009).`
  **exit 0, zero issues.**

The 1,310 acquisition issues were fixed by converting every ladder entry from opaque
text to a structured attempt carrying its real `attemptedAt` and observed `result`,
preserving the original text in a `verbatim` field so the migration is lossless and
auditable. The five stage-2 records excluded on substance were given an **empty**
attempt list plus `ladderNotRequiredReason` rather than a manufactured attempt, because
no acquisition was ever tried for them.

### Strict evidence-packet schema

`validateRecord('evidencePacket', packet)` imported from `src/lib/content/schemas.ts`
under the pinned runtime: **success: true**. Two intermediate failures were found and
fixed honestly — two DOI-derived source IDs used underscores and failed
`entityIdSchema`'s lowercase-kebab rule, and `updatedAt` preceded `createdAt`.

### `pnpm verify` — full suite, exit 0

| Stage               | Result                                                         |
| ------------------- | -------------------------------------------------------------- |
| `format:check`      | pass (Prettier, all files)                                     |
| `lint`              | pass, zero warnings                                            |
| `typecheck`         | pass                                                           |
| `test`              | **16 files, 238 tests passed**                                 |
| `validate:content`  | pass, 1 record                                                 |
| `validate:graph`    | pass; graph generation remains SBLA-011                        |
| `evidence:status`   | pass; 0 sources checked, live acquisition remains a later task |
| `build`             | pass, 1 page built                                             |
| `test:portability`  | 3 files, 17 tests passed                                       |
| `verify:foundation` | pass                                                           |
| `assets:spike`      | pass                                                           |
| `assets:decision`   | pass                                                           |

An earlier `validate:content` run **failed** and is recorded rather than hidden: four
artifacts asserted a `crossLinks.governingReview` pointing at the R1 report, which is
not a path in this worktree. The validator was right; the reference was moved to a
non-cross-link `governingReview` block carrying the commit SHA.

### Cross-artifact closure, recomputed

```
screening included (88)          -> extractions (88)            : 0 missing, 0 extra
screening AFT (26)               -> awaitingFullText register   : 0 mismatched
packet includedSourceIds (88)    -> extraction proposedSourceIds: 0 missing, 0 extra
claim sourceIds not in included set                             : 0
claim recordIds not included                                    : 0
records with an empty ladder where one is required              : 0
sources at metadata-only                                        : 0
extractions with null language                                  : 0
```

## Known uncertainties

1. **The search is still not exhaustive.** 11,765 PubMed composite records across
   S1–S4 against a screened set of 1,956. The residual is quantified per route.
2. **Citation chasing is bounded.** Forward chasing is truncated at 200 citing works
   per seed; 2 of 76 seeds did not resolve in OpenAlex; the relevance expression
   dropped 2,638 chased works before screening. All three bounds are recorded.
3. **Screening of the 848 new records was a two-pass method whose first pass is a rule
   set**, not 756 individual judgements, and 307 of the 848 had no obtainable abstract
   and were screened on title alone. Synthesis L-11 states this.
4. **Cochrane CENTRAL was still not searched**, and SPORTDiscus and Web of Science were
   still not searched by this project. The latter gap is mitigated by citing the 2023
   review, not closed.
5. **Twenty-six records remain awaiting full text**, each with a dated ladder showing
   what was tried. Ten are tier-1 trials whose data cannot be used under the
   abstract-only rule; four are records eligible on title that nothing could be
   obtained for.
6. **Forty-six of 88 included sources are abstract-only.** No claim may exceed what its
   accessible locator supports, and a reviewer should test that.
7. **Double screening on a separate day was still not performed.** This remediation ran
   in the same worktree across two Account-A sessions, not as a blind second pass.
8. **Single analyst; no independent verification of any extracted number** until the
   SBLA-010 citation-entailment audit runs.
9. **The 2023 meta-analysis contradicts itself** on the decline contrast, and its pooled
   standardised mean differences (4.04, 4.53) are implausibly large for surface EMG.
   The extraction relies on its Table 3 and Results and records the defect; a reviewer
   should check that no claim leans on its Featured Application.
10. **My role-path scan below ran from my own mutable branch** and is corroborating
    evidence only. Per CLAUDE.md, the authoritative boundary result must come from
    Codex or CI executing `check-role-paths.mjs` from a trusted checkout with
    `--repository`.

## Files created or modified

Relative to base `48e4802786e6862b605800f67702d86f78676d31`, exactly the eleven claimed
paths, listed in §"Artifact inventory" above. No file under published `content/`,
application code, schemas, tests, CI, release state, `reviews/` or `graphify-out/`
belongs to this remediation.

## Required reviewer action

**Exactly one complete-artifact recheck** is requested, at
`reviews/evidence/SBLA-009-r2.md`, per the stop rule in CLAUDE.md and AGENTS.md and the
bounded plan in R1 §11. This is the single recheck that follows one bounded
remediation. No additional review layer is requested, and none should be created unless
a new named material risk changes the acceptance scope.

Account B must review the **complete eleven-file candidate**, not only this handoff or
the diff. At minimum:

1. Reproduce both reconciliation equations and the `exclusionCodeCounts` sum from raw
   `records[]`, and confirm the `retrievalEventsDefault` of 1 is the only consistent
   reading.
2. Re-run the external research-integrity gate and `pnpm verify` independently.
3. Audit the ladder migration for information loss: every attempt retains a `verbatim`
   field, so the structured form can be checked against the text the pass recorded.
4. Test whether **C-1 is genuinely closed**: sample records across the 650 attempts,
   confirm the dates and HTTP results are real, and confirm no absence or completeness
   statement anywhere rests on an unopened record.
5. **Falsify the G1016 attribute determination.** It is the pivot of the Critical
   finding. The thesis is at `hdl:1793/62857`; read its Methods and Figure 2 and decide
   independently whether the bent-forward cable crossover is index Y.
6. Re-audit the two re-derived claims against their cited locators, and check that
   certainty moved only downward.
7. Sample the 848 newly screened records across every issued code, with attention to
   the 307 screened on title alone, and test whether the rule set over-excluded
   anything eligible.
8. Verify that the G1006/G1022 merge is correct and that no third record is the same
   report.
9. Check every claim and absence record for wording that exceeds retrieval, and confirm
   no related fly has been promoted to index Y.
10. Confirm that EMG is nowhere presented as hypertrophy evidence and that no absence
    has become equivalence.
11. Return PASS or FAIL per criterion with exact paths, and record impact and
    destination for any Minor finding.

## Acceptance criteria

- The candidate is committed and pushed from base
  `48e4802786e6862b605800f67702d86f78676d31`.
- The trusted Claude Research boundary check reports exactly the eleven allowed paths.
- The external research-integrity gate exits 0 and `pnpm verify` passes.
- The strict evidence packet validates and every cross-link resolves case-sensitively.
- Every retrieved record reconciles to exactly one terminal state; both equations close.
- Every acquisition attempt carries a real date and an observed result; no record that
  needs a ladder has an empty one.
- Every draft claim has an opened source, an exact locator, scope, certainty,
  applicability and an access-level limit.
- Absence is not converted into equivalence, ineffectiveness or a universal
  recommendation anywhere.
- Account B's append-only `-r2` report returns PASS with zero unresolved Critical and
  zero unresolved Important findings.

Until those conditions hold, every reader-facing file in `content-drafts/` remains
unpublished and SBLA-010 / SBLA-011 must not promote it.
