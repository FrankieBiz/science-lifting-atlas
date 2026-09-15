# Handoff: SBLA-009 — evidence pass and draft claims, R1 and R2 bounded remediations

> **Read this first.** This file now records **two** bounded remediation rounds. Sections
> up to and including §"Acceptance criteria" are the **R1** record, preserved as written
> on 2026-09-14 except where a block quote marks an in-place correction made on
> 2026-09-15. The **R2** record — the round that answers
> [`reviews/evidence/SBLA-009-r2.md`](../../reviews/evidence/SBLA-009-r2.md) and is the
> thing Account B is being asked to recheck now — is the final section,
> §"SBLA-010 R2 bounded remediation", and it stands alone: it repeats its own base
> commit, scope, evidence, counts, commands and limitations so that it can be acted on
> without reading the R1 material above it.
>
> Where the R1 text and the R2 section disagree, **the R2 section is current.** Three R1
> statements were factually wrong and are struck in place: Decision 3 (on G1944),
> Decision 6 (on the R1 report's absence from this tree and on the packet's
> `governingReview` block), and the gate command path in §"External research-integrity
> gate".

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

   > **Corrected 2026-09-15 (R2 finding N-1). This decision was wrong about G1944 and
   > the sentence "no abstract and no full text could be obtained for any of them" is
   > withdrawn.** G1944's own recorded `ladder-1` URL,
   > `https://journal.iusca.org/index.php/Journal/article/download/39/124`, returns
   > HTTP 200 with a 689,102-byte `application/pdf` under CC BY 4.0, and its landing
   > page at `.../article/view/39` returns the complete abstract. The 2026-09-13
   > attempt recorded a 23-byte body — a redirect this pass did not follow — as a
   > terminal failure. G1944 has been obtained, read in full, screened on its content
   > and **included** as extraction `X-G1944`. **The decision stands for G1873, G1917
   > and G1941**, and their ladders now record what those hosts actually returned on
   > 2026-09-15 rather than an inference: a bare HTTP 403 from a retired publishing
   > platform, a Cloudflare challenge, and a Springer "Client Challenge" page
   > respectively. Two of those three are automated-client refusals, which establish
   > nothing about whether the text is lawfully readable, and the record now says so.

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

   > **Corrected 2026-09-15 (R2 findings M-12 and M-5).** Two parts of this decision
   > are now false and are withdrawn. **(a)** `reviews/evidence/SBLA-009-r1.md` _is_ a
   > path in this tree: integration commit `1dc1c41b96508edbd2ae7d2ebff0ca6f5a1eb3f1`
   > added it, and `reviews/evidence/SBLA-009-r2.md` arrived with
   > `f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46`. The rendered Markdown links to the R1
   > report at `research/appraisals/SBLA-009-appraisals.md:9` and
   > `research/syntheses/SBLA-009-synthesis.md:9` therefore resolve, and this decision's
   > claim that the report is referenced "not as a repository cross-link" was true only
   > of the structured `crossLinks` fields. The `governingReview` blocks now record both
   > rounds and state this. **(b)** "Each artifact carries a `governingReview` block" is
   > false of `research/packets/sbla-009-evidence-packet.json`, which carries none.
   > `evidencePacketSchema` in `src/lib/content/schemas.ts` is `.strict()` and owns
   > neither a `governingReview` nor a `version` key, so this role cannot add one
   > without editing a Codex-owned schema. The packet records the remediation in its
   > `decisionLog` and states its version in its `synthesis` text instead, and the
   > schema gap is routed to Codex below.

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

| ID       | Closure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I-1**  | **Closed.** All six references now point at the committed lowercase `research/packets/sbla-009-evidence-packet.json`: four `crossLinks.evidencePacket` entries and the two rendered Markdown links in the appraisal and synthesis headers. The accepted case-sensitive cross-link validator integrated into this base passes.                                                                                                                                                                                                          |
| **I-2**  | **Closed.** DOI `10.3390/app13085203` retrieved from the RIUCAM repository (MDPI served a JavaScript interstitial, recorded as 200 with 2,305 bytes in the screening flow and the extraction; a 2026-09-15 re-run of the same URL returned 200 with 2,296 bytes of `text/html`, reproducing the disposition), extracted as **G1903**, and cited on both re-derived claims and as external corroboration on absence record 1. Its PRISMA flow covers SPORTDiscus and Web of Science, partially mitigating the database gap by citation. |
| **I-3**  | **Closed.** **G0062** is now linked to `claim-press-versus-fly-activation-mixed` with `role: qualifies`, supplying the order-dependence qualifier: chest-fly sternocostal activation was 100.13 % of MVIC when the fly followed the bench press and 81.47 % when it did not. That is the reason no press-versus-fly activation difference is presented as a property of the exercises.                                                                                                                                                 |
| **I-4**  | **Closed.** Backward (R-048) and forward (R-049) citation chasing now exist over the included set, contributing 745 new records. Both bounds are disclosed: forward chasing is truncated at 200 citing works per seed, and the relevance expression that reduced 3,479 chased works to 841 leaves a quantified residual.                                                                                                                                                                                                               |
| **I-5**  | **Closed.** "Nobody has studied this exercise." is gone. The fly draft now reads "These searches found no study of this exercise", the registry sentence is bounded to the one registry actually queried, the closing sentence states it is "a statement about the retrieved literature, not a proof that no such study exists", and both absence records carry `boundedBy` arrays plus the 2023 review as `externalCorroboration`.                                                                                                    |
| **I-6**  | **Closed on the demonstrated half, disclosed on the structural half.** Non-English vocabulary added to OpenAlex and Europe PMC (R-046, R-047) plus the DOAJ API (R-050). Both records R1 named were retrieved: `10.1590/s1517-86922007000100012` is now included as **G1896**, and `10.12820/rbafs.v.19n3p342` was read in full and excluded `E-EXP-7` with its reason. G1896 needed no machine translation — it carries an authorised English abstract. The structural gap is restated in synthesis L-7.                              |
| **I-7**  | **Closed.** "Three" now appears in the claim statement, the claim qualifiers, appraisal §4, synthesis §6 and both drafts, and the qualifier names all three trials and states which one contributes direction only. The claim always cited three sources; the word was the error.                                                                                                                                                                                                                                                      |
| **I-8**  | **Closed.** "Ten" now appears in all five locations. My own recount of tier-1 trials in the awaiting-full-text set is ten, matching the reviewer's independent count.                                                                                                                                                                                                                                                                                                                                                                  |
| **I-9**  | **Closed.** (a) The Sihler finding is attributed to the **five** randomly selected stained muscles, not 80, in the synthesis §1.2, the muscle draft and the innervation claim; 80 is stated as the gross-dissection total. (b) The high-density EMG sample is **twenty-nine** across two independent experiments in synthesis §1.4 and the muscle draft. Both verified by me from the full texts.                                                                                                                                      |
| **I-10** | **Closed.** Both qualifiers corrected from the full texts I read: PMC7384958 states "51 ± 14 years old at time of death, range 21–70 years, 9 males and 5 females"; PMC6466946 states "mean age of the cadavers was 69.3 ± 11.8 years (range: 48-90 years)". Both extraction `quality.notes` are rewritten. Recording the second **lowered** `claim-pectoralis-major-structural-variation` applicability from `partially-direct` to `indirect`.                                                                                        |
| **I-11** | **Closed.** New claim `claim-fly-machine-pectoralis-rupture`, scoped to the fly machine, graded `very-low`, carrying the translation limitation and a "one case has no denominator" qualifier. The fly draft's safety section now cites it instead of the bench-press rupture claim. The `draftingRule` now states that mechanical traceability is necessary but not sufficient.                                                                                                                                                       |
| **I-12** | **Closed.** X-G0042's access level is corrected to `full-text-open` and its Methods extracted from the full text I read: **"RMS EMG values were not normalized"**, electrodes ~4 cm medial to the axillary fold per SENIAM, cross-talk acknowledged with no mitigation, and the effect 16 % higher in the bench press (p = 0.027, ES 0.36) with per-phase values. The false qualifier is replaced by a statement of the un-normalised amplitude as a material limitation. X-G0315 likewise corrected.                                  |
| **I-13** | **Closed on both dimensions.** _Search:_ stratum **N-RS4a** (R-044) recovers five of the six PMIDs R1 named, including both contradicting studies. _Claim:_ `claim-bench-press-inclination-shifts-regional-activation` is re-derived — the monotonic wording is withdrawn, certainty drops `moderate` → `low`, direction becomes `mixed`, and PMIDs 33049982 and 25799093 plus the 2023 meta-analysis and PMID 39764299 are all cited. Contradiction-map row **C-10** records the disagreement.                                        |

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
node C:\src\s009integrity\scripts\evidence\research-integrity.mjs --root C:\src\s009fix1 --bundle SBLA-009
```

> **Corrected 2026-09-15 (R2 finding M-9).** The path printed here originally read
> `C:\s009integrity\…`, omitting `\src`, and could not run as written. The gate
> worktree is `C:\src\s009integrity`. The recorded result is unaffected and was
> reproduced in the R2 remediation; see §"SBLA-010 R2 bounded remediation" below.

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

> **For the R2 round**, the base is `f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46` and the
> changed set is **ten** paths, not eleven: `research/searches/SBLA-009-search-receipts.json`
> was not owned by the R2 claim and was not modified. The proof is in
> §"R2 · Checks run, with real results".

## Required reviewer action

> **Superseded 2026-09-15.** The recheck requested below was performed and returned
> **FAIL — 0 Critical, 4 Important, 13 Minor** at `reviews/evidence/SBLA-009-r2.md`. The
> action now required is the recheck described in
> §"R2 · What Account B should recheck", whose destination is
> `reviews/evidence/SBLA-009-r3.md`. The list below is retained because items 1–10 remain
> good tests of the bundle and a reviewer may reuse them.

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

---

# SBLA-010 R2 bounded remediation

**This section stands alone.** A reviewer with no access to any conversation, and
without reading the R1 material above, can act on it.

## R2 · Objective and authority

`reviews/evidence/SBLA-009-r2.md` — the one complete-artifact recheck that followed the
R1 bounded remediation — returned **FAIL: 0 Critical, 4 Important, 13 Minor**. It closed
all fourteen R1 Critical and Important findings and failed the candidate on four
narrower grounds, giving a bounded plan in its §9.

This section delivers that **one bounded remediation**. Under the stop rule in CLAUDE.md
and AGENTS.md it is followed by **exactly one** complete-artifact recheck, at
`reviews/evidence/SBLA-009-r3.md`. No additional review layer is requested or created.
Nothing here is accepted or published; nothing in `content/` changed.

## R2 · Exact provenance

| Field                   | Value                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| Base commit (immutable) | `f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46`                                        |
| Base tree (immutable)   | `779567bad94305ad22e28973e6067915f0d5deac`                                        |
| Branch                  | `claude-research/SBLA-010-r2-remediation`                                         |
| Worktree                | `C:\src\s010fix2`                                                                 |
| Role / account          | Claude Research, Account A                                                        |
| Date                    | 2026-09-15                                                                        |
| Governing report        | `reviews/evidence/SBLA-009-r2.md`, SHA-256 `3428d3fe…a47a12b5`, 844 lines         |
| Exact-path claim        | Coordination commit `e3cdf682c877eea36bfb27ae5b79f52631537ae7`, recorded by Codex |
| Next destination        | `reviews/evidence/SBLA-009-r3.md` (Account B)                                     |

HEAD, tree, branch and a clean `git status --porcelain` were verified against the
assigned base **before** any file was written, and the Account-A claim at `e3cdf68` was
verified to name this exact branch, worktree, base commit and the ten owned paths.

The two immutable Account-B reports were read in full and **never edited**:
`reviews/evidence/SBLA-009-r1.md` (SHA-256 `7c829be4…71f9f46e`, 1,116 lines) and
`reviews/evidence/SBLA-009-r2.md` (SHA-256 `3428d3fe…a47a12b5`, 844 lines).

## R2 · Acquisition evidence

All requests were lawful, unauthenticated public GETs from Node 24.20.0's default
`fetch` with redirects followed. **No credentials or cookies were supplied, no challenge
was solved, no user-agent was substituted to evade filtering, no paywall was
circumvented and no shadow library was used.** No copyrighted full text is committed;
every document retrieved is held outside the repository. Dates are 2026-09-15 UTC.

### Obtained

| Record    | URL                                                                       | Result                            | SHA-256              |
| --------- | ------------------------------------------------------------------------- | --------------------------------- | -------------------- |
| **G1944** | `journal.iusca.org/index.php/Journal/article/download/39/124`             | 200, 689,102 B, `application/pdf` | `1a01086a…2f39831e`  |
| **G1944** | `journal.iusca.org/index.php/Journal/article/view/39` (landing, CC BY)    | 200, 34,509 B, `text/html`        | `71075eb7…6202a3f9`  |
| **G1087** | `sportrxiv.org/index.php/server/preprint/download/872/1856/1774`          | 200, 293,800 B, `application/pdf` | `78a74ae1…b73b299d`  |
| **G1087** | `sportrxiv.org/index.php/server/preprint/view/872/version/1082` (landing) | 200, 23,813 B, `text/html`        | `3ce7466f…65eaa32ad` |
| **G1087** | `api.crossref.org/works/10.51224/sportrxiv.872` (DOI identity)            | 200, 1,756 B, `application/json`  | —                    |
| G1003     | `observatorio.fm.usp.br/handle/OPI/25022` (abstract, openly readable)     | 200, 514,144 B, `text/html`       | `3b778bc0…698667b4`  |

**G1944's hash reproduces the review's recorded value exactly**
(`1a01086a81ffff228a766e4a9b2813467e349e8891f8651487f7c4d32f39831e`), so the finding is
independently confirmed rather than taken on trust.

**G1087 DOI identity was verified before any content was attributed to the record**, as
required. Crossref returns DOI `10.51224/sportrxiv.872`, type `posted-content`, title
"Names of resistance exercises", authors James L. Nuzzo and James Steele, posted
2026-05-26, licence CC BY 4.0, primary resource `…/preprint/view/872/version/1082`. That
landing page is titled "Names of resistance exercises: Text analysis of survey responses
| SportRxiv", matching this record's title exactly, and displays the same DOI. Only then
was the galley at `…/download/872/1856/1774` attributed to G1087.

### The 22–24-byte class, all re-run (R2 findings N-1 and M-1)

Every attempt recorded as a 2xx under 6,000 bytes with a URL was re-run.

| Record | Recorded 2026-09-13 | Observed 2026-09-15                           | Reading                                         |
| ------ | ------------------- | --------------------------------------------- | ----------------------------------------------- |
| G1944  | 200 (23 bytes)      | **200, 689,102 B, PDF**                       | Unfollowed redirect recorded as a failure       |
| G1876  | 200 (24 bytes)      | **200, 1,183,736 B, PDF** `270c2ea7…4197e707` | Same; record already included by another route  |
| G1896  | 200 (22 bytes)      | **200, 37,307 B, PDF** `4a4f7890…8fc7c3d5`    | Same; hash identical to the file already held   |
| G1903  | 200 (24 bytes)      | **200, 3,358,506 B, PDF** `8ac15532…66cbb50d` | Same; this is the route that yielded the text   |
| G1928  | 200 (24 bytes)      | **200, 2,171,116 B, PDF** `ad4f265e…3b30ebaf` | Same; record already included by another route  |
| G0964  | 202 (2,009 bytes)   | 202, 0 B                                      | Reproduces; figshare async, nothing retrievable |
| G1903  | 200 (2,305 bytes)   | 200, 2,296 B `text/html`                      | Reproduces; MDPI JavaScript interstitial        |

**Root cause:** the acquisition client did not follow redirects, and a redirect stub was
recorded as a terminal result. Four of the five 22–24-byte cases cost nothing because
another route had already obtained the document. **For G1944 it cost the source**, which
was frozen at `metadata-only` and written up as unobtainable.

### The G1903 URL inversion (R2 finding M-1)

| URL                                                                                              | Observed                      |
| ------------------------------------------------------------------------------------------------ | ----------------------------- |
| `…/bitstream/handle/10952/9780/2023_Electromyographic%20activity%20of%20the%20pectoralis.pdf`    | **404**, "Resource not found" |
| `…/bitstream/10952/9780/1/2023_Electromyographic%20activity%20of%20the%20pectoralis%20major.pdf` | **200, 3,358,506 B, PDF**     |

The first was recorded as `fullTextSource` and as the `ladder-outcome` URL; its title
segment is truncated and omits `%20major`. Both are corrected to the working URL. The
SHA-256 of the obtained file is unchanged and was re-verified against it.

### Four access classes, now distinguished (R2 finding N-1)

The review required that observed HTTP facts, metadata inference, bot protection and
true access control be told apart. They now are, on every rung this remediation touched.

- **Observed HTTP fact** — a request was made and this is what came back, with status,
  content type, byte count and, where a file was obtained, its SHA-256.
- **Metadata inference** — the rung was resolved from an OpenAlex or identifier lookup
  and **no request was made to the host**. Every such `not-available` rung this
  remediation touched now says so explicitly and is paired with a real request.
- **Bot-protection refusal of an automated client** — evidenced by
  `cf-mitigated: challenge` or a "Client Challenge" body. Observed for **G1084**
  (TopSCHOLAR, 403), **G1917** (SAGE, 403), **G1941** (Springer, 200 challenge page),
  **G1022** (DOAJ 403 and the RBPFEX publisher 403) and the **DOAJ rung of G1944** (403).
- **True access control** — **G1003**'s deposited file returns the repository login form
  and offers only a request-a-copy workflow; **G0968**'s aggregator states that
  institutional authentication is required. Neither was attempted.
- **Undetermined** — **G1873**'s DOI resolves to a retired platform returning a bare
  HTTP 403 with no challenge marker. Recorded as undetermined rather than guessed.

**No record anywhere in this bundle now says that no lawful full text exists on the
strength of a challenge page or an unindexed open location.** Where an automated client
was refused, the record says an automated client was refused.

### Corrections to the earlier readiness lead

An earlier Account-A readiness pass reported having found lawful full text for G0121,
G0117, G1084 and G1087. That lead was treated as investigative, not as evidence, and
re-verified. **Two of its four claims do not survive.**

- **G1084** — the earlier pass's own saved response is an HTTP 403 Cloudflare challenge
  ("Just a moment…"), not full text, and the refusal reproduced on 2026-09-15. Nothing
  was incorporated.
- **G0117 and G0121** — the retrieved pages are Ovid/LWW article pages carrying the
  **abstract** with the body behind a login, not full text. Both records were already at
  `abstract-only`, so no access level changed; what changed is that their `ladder-1` rung
  now records an observed HTTP 200 instead of an `is_oa=false` inference.
- **G1087** — genuine, and incorporated after independent DOI verification above.

Screening substance, not retrievability, decided every disposition. The two records whose
full text was recovered went in **opposite** directions.

## R2 · The four blocking findings

### N-1 — a CC BY full text recorded as unobtainable

**Closed.** G1944 (Arseneault, Roy & Sercia 2021, _The Effect of 12 Variations of the
Bench Press Exercise on the EMG Activity of Three Heads of the Pectoralis Major_, Int J
Strength Cond, DOI `10.47206/ijsc.v1i1.39`, CC BY 4.0) was obtained, read in full and
screened on its content. It is **included** as `X-G1944`. Its ladder, access level,
terminal state, stage, note, licence and open-access status are corrected; handoff
Decision 3 is struck in place; the fly draft's Provenance paragraph is rewritten.

**What it actually reports, and why it does not raise anything.** Its Table 3 appears to
favour the incline for the clavicular head and the decline for the abdominal head, but
its design **crosses** inclination with grip type and grip width and loads each of its
twelve cells at that cell's own 12RM, so no between-inclination contrast in it isolates
inclination. Its own null statements are the part that does: within matched pronated
grips it reports **no significant sternocostal difference across −15°, 0° and +30°**, and
**no clavicular advantage for the incline at a matched wide pronated grip**. That is
evidence **against** the sternocostal limb of
`claim-bench-press-inclination-shifts-regional-activation`, so it was added with
`role: contradicts` and the claim's first qualifier was **weakened**. Certainty stays
`low`, direction stays `mixed`. It also contradicts its own Abstract for the clavicular
head (contradiction row **C-17**, appraisal §3.6), and its analysed sample size,
normalisation reference and absence of effect estimates are recorded as defects.

G1087 was obtained the same day and **excluded** under `E-OUT-1`: it is a survey of what
lifters call resistance exercises, analysed for 1,425 of 1,849 respondents, reporting no
pectoralis outcome of any kind. It narrows no absence record.

### N-2 — an unentailed direction

**Closed.** `claim-press-versus-fly-activation-mixed` asserted a sternal difference
"favouring the bench press". The phrase is **removed**; the claim now states the contrast
without a direction, matching what its extraction and the synthesis had always recorded.

The direction was not merely unsourced — the cited locator states the **opposite**. The
Results text of the 2023 meta-analysis reads, twice and verbatim: _"there is no
significant difference in the activation of the clavicular portion when comparing the PB
with another exercise; however, there is a greater activation in the sternal pectoralis
**in the variable exercise** (SMD = 4.04; 95% ICI 0 = 1.74; 6.35)"_. Its Abstract and
Featured Application say the reverse.

**The mechanism is now recorded** (row **C-14**, extraction quality note): the paper's
**sign convention inverts between its contrast families**. In the inclination family a
positive SMD favours the horizontal bench press; in the type-of-exercise family it
favours the comparator. Carrying the first convention across to the second is exactly the
error that was made. Because the source cannot settle its own direction, **no direction is
taken from it** rather than the Abstract being cited — the safest disposition, and the one
consistent with the pass's own uncertainty 9 and row C-12.

**SMD 4.53 is disambiguated by its full signature** (row **C-15**). Two distinct results
in that paper share the point estimate: Table 3's clavicular type-of-exercise row
(95 % CI −4.22 to 13.27, I² 94.9 %, t 1.65, p 0.198) and the Figure 7 comparison of other
exercises with the push-up (95 % CI 4.40 to 7.65, no I² or p reported). Every citation of
4.53 now carries its confidence interval. The existing attribution to the clavicular row
was verified correct.

**Two further source-internal defects are recorded.** (a) _Decline_: Table 3 reports no
significant decline effect in either portion and the point estimates run **opposite** to
the prose (sternal −0.75, 95 % CI −1.85 to 0.36, p = 0.143; clavicular 2.03, 95 % CI
−2.03 to 6.53, p = 0.218), while the Abstract Conclusions assert _"the sternal portion …
showed greater activation with the declined variant"_ and the Featured Application asserts
a decrease in the clavicular portion "as opposed to an increase in the sternal portion".
(b) _Database count_: the Abstract reports a search of **"four databases"**; Methods §2.1
names **three** and Appendix A reproduces exactly three search strings. The
three-database reading is used, and the extraction's `designNote` now states both.

### N-3 — unsatisfiable draft version pins

**Closed.** All three drafts now declare `draftVersion: '2.0.0'` and
`claimSource: content-drafts/syntheses/SBLA-009-atomic-claims.json@2.0.0`, the version
that actually contains `claim-fly-machine-pectoralis-rupture` and the post-R1 claim text.
All 71 claim-ID references in the three drafts resolve against the pinned version, and
every claim and absence record is cited by at least one draft.

**The bundle stays at artifact version 2.0.0 by the review's own prescription** (N-3 asks
for `@2.0.0`, not a new version). The discriminator between the reviewed 2.0.0 tree and
this remediated 2.0.0 tree is therefore the `governingReview` block, which now names both
rounds, this branch and this base commit, in the screening flow, the extractions and the
claims file. `generatedAt` stays 2026-09-13 across the bundle, matching the convention the
R1 round established and the review accepted. **If Account B considers a version bump the
correct disposition, it is a one-line change and this section is the place to say so.**

### N-4 — unbounded universal absence wording

**Closed.** Both bench-press draft sentences are bound to retrieval, in the fly draft's
corrected form:

- Practical takeaway: _"Whether it builds more chest muscle than a cable fly is
  **unknown**: **these searches retrieved no study comparing them**."_
- Comparison section: _"**These searches retrieved no study comparing this exercise with a
  bilateral standing cable fly at shoulder height for pectoralis major size**"_, followed
  by the retrieval bounds and an explicit "not a proof that no such study exists, and not
  evidence that the two exercises are equivalent".

The bounds named there are the ones the review required: forward chasing truncated at 200
citing works per seed; the title relevance filter dropping **2,638** of the 3,479 chased
works with metadata; **80** further chased candidates for which OpenAlex returned no
metadata at all; the non-English route inspecting only the first 50 results of each of
eight probes; and 24 records still unread at `awaiting-full-text`, nine of which could
bear on a press-versus-fly comparison. All five were added to
`absence-index-cable-fly-no-evidence.boundedBy` (R2 finding **M-11**) and to
`absence-primary-comparison-no-evidence.boundedBy`.

**A sixth instance of the same defect class was found and fixed** outside the drafts:
synthesis §4 said the gap sits "at the point where **nobody has run the study**". It now
says these routes retrieved no such study, registered or published.

## R2 · Minor findings

| ID       | Disposition                                                                                                                                                                                                                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-1**  | **Fixed.** All five 22–24-byte results re-run and recorded; G1903's `fullTextSource` and `ladder-outcome` URL corrected from the 404 form to the working form. Original observations kept in `verbatim`, never overwritten.                                                                                                                           |
| **M-2**  | **Fixed.** The fly draft said "Eight fly-family records" and then enumerated five plus "three bench-press records". It now reads **nine** records that could bear on the page — **five** fly-family, **four** bench-press — out of **24** at `awaiting-full-text`.                                                                                    |
| **M-3**  | **Fixed.** The appraisal header said "Companions, all at version 1.0.0" while every companion was 2.0.0. Corrected. Its §0 and §1 also carried first-pass counts (76 sources, 1,361 retrievals, 1,109 unique records); now 89, 2,343 and 1,956, with the history stated.                                                                              |
| **M-4**  | **Not fixable in an owned path — routed to Codex.** The packet declares no version field. `evidencePacketSchema` is `.strict()` and does not own one, so adding it fails validation. The version is stated in the packet's `synthesis` text instead.                                                                                                  |
| **M-5**  | **Not fixable in an owned path — routed to Codex.** The same schema constraint blocks a `governingReview` block on the packet. The remediation is recorded in the packet's `decisionLog`, and **handoff Decision 6 is corrected** to withdraw the false "each artifact" claim.                                                                        |
| **M-6**  | **Addressed; a residue is routed to Codex.** All 90 `ladder-5-author-request` steps now state that `attemptedAt` on a not-performed rung is the date the ladder run reached it and recorded the decision, not a date a request was sent. The gate requires a real ISO date on every attempt, so the field cannot be null without a Codex gate change. |
| **M-7**  | **Fixed.** The five records carrying `ladderNotRequiredReason` now read `decidedAtStage: stage-2-acquisition`, agreeing with their own reason text and with the field contract, which binds that field to stage-2 substantive exclusions.                                                                                                             |
| **M-8**  | **Fixed.** The 24 awaiting-full-text register entries now hold **structured attempt objects** copied from the authoritative screening flow, not plain strings, so the register is dated when read on its own. The field contract records the shape change and why.                                                                                    |
| **M-9**  | **Fixed.** The gate command path `C:\s009integrity\…` is corrected to `C:\src\s009integrity\…`, with the correction marked in place.                                                                                                                                                                                                                  |
| **M-10** | **Fixed on the recorded evidence.** The handoff said MDPI "served a 2,207-byte interstitial" while the flow and the extraction both record `200 (2305 bytes)`. The handoff now cites the recorded 2,305 and adds the 2026-09-15 re-run (200, 2,296 B, `text/html`).                                                                                   |
| **M-11** | **Fixed.** All three omitted bounds added to absence record 1, plus a fourth the review did not name (80 chased candidates with no OpenAlex metadata) and a fifth on the four challenge-refused routes.                                                                                                                                               |
| **M-12** | **Fixed.** Decision 6 is corrected: both Account-B reports **are** paths in this tree, so the rendered Markdown links resolve and the "not a repository cross-link" claim was true only of the structured `crossLinks` fields. The `governingReview` blocks now say this.                                                                             |
| **M-13** | **Fixed and extended.** Recorded as contradiction row **C-15** together with the database-count defect, and as extraction quality notes. The stability-contrast CI defect the review noted supports no claim and none was added.                                                                                                                      |

## R2 · Before and after

| Quantity                                | Before (`f67b6df`) | After     |
| --------------------------------------- | ------------------ | --------- |
| Unique records after deduplication      | 1,956              | 1,956     |
| Records retrieved (retrieval events)    | 2,343              | 2,343     |
| Duplicate retrieval events              | 387                | 387       |
| **Excluded**                            | 1,842              | **1,843** |
| **Awaiting full text**                  | 26                 | **24**    |
| **Included**                            | 88                 | **89**    |
| Extractions                             | 88                 | **89**    |
| Packet `includedSourceIds`              | 88                 | **89**    |
| Packet exclusions                       | 75                 | **76**    |
| Claims / absence records                | 23 / 5             | 23 / 5    |
| Contradiction-map rows                  | 13                 | **17**    |
| Included sources at `metadata-only`     | 0                  | 0         |
| Abstract-only included sources          | 46                 | 46        |
| Draft claim-ID references (all resolve) | 71                 | 71        |

**No search was re-run and no retrieval event was added**, so `recordsRetrieved`,
`duplicateRetrievalEvents` and `uniqueRecordsAfterDeduplication` are untouched and
equation two is unchanged. `research/searches/SBLA-009-search-receipts.json` was **not
writable by this remediation and was not modified.**

```
equation one : 1956 = 1843 + 24 + 89     closes
equation two : 2343 =  387 + 1956        closes
sum(exclusionCodeCounts) = 1843          equals the excluded total
sum(retrievalEvents ?? 1) = 2343         equals recordsRetrieved
receipts carrying recordsRetrievedIntoScreening sum to 2343
```

**Certainty movement: none upward.** `claim-press-versus-fly-activation-mixed` stays
`very-low` and **loses** an assertion.
`claim-bench-press-inclination-shifts-regional-activation` stays `low` / `mixed` and its
first qualifier is **weakened**. The one source added entered as **contradicting**
evidence. No claim was added, no new reader-facing assertion was created, and no
risk-of-bias or applicability grade was raised.

## R2 · Checks run, with real results

Runtime confirmed against the pin before anything ran: `node --version` → `v24.20.0`
(`.node-version` = 24.20.0); `corepack pnpm --version` → `11.24.0` (`packageManager` =
pnpm@11.24.0). The host default Node is v24.14.0 and does **not** meet the engine; the
fnm-managed v24.20.0 was used throughout.

```
$ corepack pnpm install --frozen-lockfile     Done in 9.8s
$ corepack pnpm validate:research
  Research integrity passed: 1 complete bundle checked (SBLA-009).
$ corepack pnpm verify                        EXIT=0
```

| Stage               | Result                                              |
| ------------------- | --------------------------------------------------- |
| `format:check`      | pass — "All matched files use Prettier code style!" |
| `lint`              | pass — 0 errors                                     |
| `typecheck`         | pass                                                |
| `test`              | **17 files, 249 tests passed**                      |
| `validate:content`  | pass — 1 record                                     |
| `validate:graph`    | pass — 0 nodes; graph generation remains SBLA-011   |
| `validate:research` | pass — 1 complete bundle (SBLA-009)                 |
| `evidence:status`   | pass — 0 sources checked as of 2026-09-15           |
| `build`             | pass — 1 page built                                 |
| `test:portability`  | **3 files, 17 tests passed**                        |
| `verify:foundation` | pass                                                |
| `assets:spike`      | pass                                                |
| `assets:decision`   | pass                                                |

Changed-path proof, from this worktree:

```
$ git diff --name-status f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46
M	content-drafts/exercises/barbell-flat-bench-press.md
M	content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md
M	content-drafts/muscles/pectoralis-major.md
M	content-drafts/syntheses/SBLA-009-atomic-claims.json
M	research/appraisals/SBLA-009-appraisals.md
M	research/extractions/SBLA-009-source-extractions.json
M	research/packets/SBLA-009-handoff.md
M	research/packets/sbla-009-evidence-packet.json
M	research/screening/SBLA-009-screening-flow.json
M	research/syntheses/SBLA-009-synthesis.md

$ git diff --check f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46      (clean)
```

Exactly the ten claimed paths, all modifications, no additions or deletions. No path
under `src/`, `scripts/`, `tests/`, `content/`, `.github/`, `docs/`, `reviews/`,
`research/searches/` or `graphify-out/` appears.

**Role-boundary caveat, stated as CLAUDE.md requires.** The scan above was run from this
mutable research worktree. It is corroborating, **not** independent boundary evidence.
`scripts/evidence/check-role-paths.mjs` was **not** run from a trusted checkout by this
role and **no claim is made that it passed.** Codex or CI must execute it from a trusted
checkout against this candidate with `--repository`.

## R2 · Routed elsewhere, not worked around

1. **Packet `version` field (M-4)** and **packet `governingReview` block (M-5)** —
   `evidencePacketSchema` in `src/lib/content/schemas.ts` is `.strict()` and owns neither
   key. Adding either from this role would fail validation, and the schema is Codex-owned.
   Both are stated in the packet's `synthesis` text and `decisionLog` instead. **Codex
   decision needed.**
2. **`attemptedAt` on a not-performed rung (M-6 residue)** — the integrity gate requires a
   real ISO date on every attempt object, so a `not-performed` rung cannot carry a null
   date. The contradiction is now explained in every one of the 90 notes, but removing it
   needs a gate change. **Codex decision needed.**
3. **`sourceSchemaFields.study` mapping** — unchanged, still an SBLA-011/Codex item (R1
   M-6, disclosed as L-A3).
4. **Search-receipt observation, no edit made.**
   `research/searches/SBLA-009-search-receipts.json` is not an owned path and was not
   touched. For precision: **48 of its 51 receipts carry `recordsRetrievedIntoScreening`
   and they sum to exactly 2,343.** The other three (`R-001` historical, `R-002` and
   `R-003`) are route-level E1 **count** rows that deliberately credit no records into
   screening; the gate skips non-count values, which is why the invariant holds. A future
   reader should not expect all 51 to carry the field.

## R2 · Limitations

Stated plainly, because an author who overstates coverage is the same defect as a reviewer
who does.

1. **Point-in-time, single-client network evidence.** Every observation is one client on
   one day. Publisher behaviour varies by client, geography and hour. Where it mattered,
   SHA-256 was relied on rather than a status code, and G1944's hash reproduces the
   review's exactly.
2. **Four records could not be read because an automated client was refused**, and this
   remediation deliberately does not claim to know whether their text is lawfully
   readable. Solving a challenge was out of bounds and was not attempted.
3. **No new literature search was run**, as instructed. The scope was re-acquisition of
   records already in the flow plus correction. Recall is therefore unchanged and is
   bounded exactly as before.
4. **G1944 was screened and extracted by the same role in the same session that obtained
   it.** There was no independent second screener. Its inclusion rests on a single-reader
   judgement, disclosed here for the recheck.
5. **The 24 awaiting-full-text records remain unread**, nine of which bear on the drafts'
   own subject matter. Every absence statement is bounded by them.
6. **G1944's figures were not digitised.** Its EMG values appear only in Figures 1–4; the
   extraction takes the Results text and Table 3 and records that no effect estimate is
   available from the source.
7. **The 2023 meta-analysis's Table 3 is garbled by `pdftotext -layout`.** The values used
   here were confirmed against the Results prose and against independently anchored rows,
   not read off the rendered table; the clavicular type-of-exercise signature (−4.22;
   13.27, 94.9, 1.65, 0.198) was read directly and matches what was already recorded.
8. **The bundle version stays 2.0.0** while its content changed, by the review's own
   prescription (N-3). The `governingReview` blocks carry the discriminator. If that is
   judged wrong, it is a one-line change.
9. **Pre-R1 statements inside the R1 change-log tables are left as historical record** (for
   example "forty-six of 88" in synthesis §8 and appraisal §7). The current figures are in
   §9 and §8 of those files respectively.

## R2 · What Account B should recheck

The destination is `reviews/evidence/SBLA-009-r3.md`. This is the **one**
complete-artifact recheck the stop rule allows after this **one** bounded remediation.
Review the complete ten-file candidate, not this handoff alone. At minimum:

1. **Re-fetch G1944** at the URL above and confirm the SHA-256. If it differs for your
   client, re-grade N-1 on that evidence — but note the abstract on the open landing page
   is not subject to that caveat.
2. **Read G1944 and falsify its screening.** Is it eligible? Is `role: contradicts` right,
   or does it support the claim it joined? Is the confound argument honest?
3. **Falsify the G1087 exclusion.** Read it and decide independently whether `E-OUT-1` is
   correct, or whether a nomenclature source should have been retained for the
   attribute/naming work.
4. **Recompute both equations, the exclusion-code sum and the receipt sum from raw
   `records[]`**, and confirm nothing was smoothed.
5. **Test the N-2 fix against the source.** Read the 2023 meta-analysis's Results text and
   Abstract and decide whether direction-neutral wording is right, or whether the
   contradiction should be surfaced further.
6. **Check that certainty moved only downward** and that no new assertion entered any
   draft.
7. **Check every "no lawful full text" statement** in the bundle against its ladder, and
   confirm none rests on a challenge page or an unindexed open location.
8. **Ask Codex for the trusted `check-role-paths.mjs` result.** This role did not and
   cannot produce it.
