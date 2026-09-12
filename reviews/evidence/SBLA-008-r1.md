# Evidence review: SBLA-008 vertical-slice scope, round 1

**Task:** SBLA-008 — Vertical-slice research questions, PICO/PECO, search strings, inclusion and
exclusion plan
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review, round 1.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5, fresh independent
reviewer session). I did not author, remediate, or previously review any SBLA-008 candidate, and I
received none of the authoring role's reasoning beyond the committed artifacts (§9.10).
**Review date:** 2026-09-12
**Reviewer worktree:** `C:\src\s008r1`
**Reviewer branch:** `claude-review/SBLA-008-r1`
**Reviewer write path:** `reviews/evidence/SBLA-008-r1.md` (sole permitted path; nothing else modified)

**Reviewed candidate commit:** `56068c222bd8971378586776d133a7cf7a470b96` _(immutable)_
**Reviewed candidate tree:** `fb33be17be7d5365ea27bb08c7a16bc9ee9fbeb8` _(immutable)_
**Candidate parent and declared base:** `0752d5021da72eed840f61ae06f6c1966906c177` _(they match)_
**Research coordination claim:** `09f9ba4cfb4b505612035cb6c463b37a75a279ce` _(present as a Git object)_
**Review coordination claim:** `905ab934d4ec07d2e91a666af7fd7cf419112486` _(present as a Git object)_

Reviewed file blobs and SHA-256 checksums, recomputed in this session:

- `research/questions/SBLA-008-vertical-slice.md` — blob `c0a4607e9581e178e6e652d63cce219cb81f8f96`,
  SHA-256 `d1919cea7f1c38599cddeb5ad6b7530e472c700f43ad56d55495f477b7c8f30a`, 414 lines
- `research/searches/SBLA-008-search-strategy.md` — blob `5953dbfad91e89ac8e628b572027285ad3ac1a6e`,
  SHA-256 `9c5d63f4647811d7ade3fe95416168b4aeb714795aa72be7b6d9ea6c692cb94c`, 746 lines
- `research/screening/SBLA-008-eligibility-plan.md` — blob `bbbee6f397a925b88e06c910e5b7ccb14d3483f2`,
  SHA-256 `ea546b96df7fe20f4d2eece31db979ce7fc1bec73b05141cb54b5a864d33d0b6`, 552 lines
- `research/packets/SBLA-008-handoff.md` — blob `fa8662dc7865062c4fc197a178df2a5fcddc0e8b`,
  SHA-256 `5f7a3a719263ec92ff4b3c6e4eb6a60e62a1a3c63d866c7a5a9d76f1808de56a`, 570 lines

---

## Verdict

**Verdict: FAIL.**
**Critical: 0 · Important: 2 · Minor: 5 · Out-of-scope observation routed to Codex: 1**

PASS requires zero Critical and zero Important findings (CLAUDE.md review stop rule; AGENTS.md). Two
Important findings stand, so the candidate fails round 1. Neither is a defect of scientific reasoning,
and both are bounded and cheap to remediate:

- **I-1** — the Europe PMC composite question query for route E1 _was_ executed and its result count
  recorded, while three sentences across two files state that no composite question query was executed.
- **I-2** — the screening plan makes `awaiting-full-text` a mandatory first-class record state and
  requires the reconciliation arithmetic to close, but the accepted `evidencePacketSchema` is `.strict()`
  and has nowhere to record it. The analogous but smaller schema gap (SE-U1) _is_ flagged; this larger
  one is not.

This is a strong artifact and the FAIL should be read narrowly. I independently re-executed fourteen of
its external platform and vocabulary claims against the official endpoints, and **every one of them
reproduced**, several to the exact integer. The evidence-fencing architecture, the estimand
specification, and the contradiction plan are sound. The FAIL is about two specific correctable
statements, not about the quality of the scoping.

Per CLAUDE.md, one bounded remediation by the authoring role is followed by one complete-artifact
recheck, which becomes `reviews/evidence/SBLA-008-r2.md`. This report is append-only and is never edited.

---

## 1. What this review is, and what it deliberately is not

This is the `scope`-stage acceptance review for SBLA-008 (§9.8 step 1). SBLA-009 owns `search` onward.

**I did not execute the planned SBLA-009 evidence review.** I collected no identifier, opened no record,
screened nothing, and cite no study. No statement in this report is a scientific finding about anatomy,
exercise, or training.

**I did not repair the artifact** (CLAUDE.md). Every finding below returns to the authoring role.

**Where I ran external queries myself**, I held to the same boundary I am asking the candidate to hold.
To verify that the six PubMed strings parse, I appended a zero-yield anchor token
(`AND zzzqqqnonsenseanchor[tiab]`) to each string, so that PubMed still reports `fieldsnotfound` and
`quotedphrasesnotfound` while the result count is structurally zero and no question-level yield is ever
observed. That is the correct discipline for this stage, and it is the technique the candidate itself
used for its Europe PMC anchored parse test — but not for the Europe PMC composite count, which is
finding I-1.

The single exception is that composite: I re-ran it verbatim in order to reproduce a count the candidate
had already published. Reproducing a check the candidate reports is squarely within the review role. The
problem is not that I ran it; it is that it was run at the `scope` stage and then described as not having
been run.

---

## 2. Methods and reproduction

### 2.1 Environment, stated plainly

- Node.js `v24.14.0` in this worktree. The repository engine floor is `>=24.20.0 <25`.
- `pnpm` is not on PATH here, and this worktree has no `node_modules` directory.
- **`pnpm verify` was therefore NOT run by me, and neither was Prettier.** I am not implying a check that
  never ran. This is the same limitation the candidate disclosed for its own environment, and its
  disclosure is correct and complete.
- Independent boundary and verify evidence comes from Codex instead, recorded in the review coordination
  claim `905ab934d4ec07d2e91a666af7fd7cf419112486`: the trusted Claude Research boundary passed for all
  four paths, and under Node 24.20.0 with pnpm 11.24.0 `pnpm verify` passes 233 unit tests, 17
  portability tests, and all build, foundation and asset gates, with committed-range whitespace clean.
  Per CLAUDE.md, that third-party result — not a checker run from my own mutable role branch — is the
  admissible boundary evidence. I did not produce it and do not restate it as mine.

### 2.2 Repository-side reproduction, all reproduced by me

- `git rev-parse` on the candidate returns commit `56068c222bd8971378586776d133a7cf7a470b96`, tree
  `fb33be17be7d5365ea27bb08c7a16bc9ee9fbeb8`, parent `0752d5021da72eed840f61ae06f6c1966906c177`. The
  handoff's declared base is the real parent.
- `git diff --name-status 56068c22^ 56068c22` returns exactly four entries, every one an addition (`A`):
  `research/packets/SBLA-008-handoff.md`, `research/questions/SBLA-008-vertical-slice.md`,
  `research/screening/SBLA-008-eligibility-plan.md`, `research/searches/SBLA-008-search-strategy.md`.
  `git diff --shortstat` reports `4 files changed, 2282 insertions(+)`. No deletions, no modifications,
  nothing outside `research/`, and the set matches the ledger claim at `09f9ba4c…` exactly.
- `git diff --check` across the candidate range is clean, exit 0.
- Both ledger commits resolve as Git objects, and their recorded contents match what the handoff says
  about them, including the four owned research paths and this review's single owned path.
- Every downstream claim the candidate makes about `src/lib/content/schemas.ts` and
  `scripts/content/validate.mjs` was checked line by line against those files. All of them are accurate.
  The problem is not an inaccurate claim; it is a gap the candidate did not claim at all (I-2).

### 2.3 What I could not reproduce, and am therefore carrying as unverified

- Prettier `--check` on the four paths — no `node_modules` in this worktree.
- Cochrane Library Search Manager syntax and its `:pt` value list — see M-5.
- FIPAT / Terminologia Anatomica reachability, the Crossref Retraction Watch labs outage, and PROSPERO
  and SportRxiv query syntax. The candidate already carries all four as unverified (U1, SU1–SU4), so
  re-testing them could not change a verdict. I did not re-test them, and I say so rather than implying
  coverage I do not have.

---

## 3. Independent external verification

Every call below was made by me on **2026-09-12** against the platform's own official endpoint. These
are reproduced checks, clearly separated from the unverified items in §2.3. None of them is evidence
about anatomy or training; they are statements about query languages and controlled vocabularies.

### 3.1 Reproduced exactly

1. **MeSH descriptor D010369.** NLM MeSH SPARQL endpoint `https://id.nlm.nih.gov/mesh/sparql`: the
   descriptor's only `meshv:treeNumber` is `A02.633.567.775`, and a query for descriptors with
   `meshv:broaderDescriptor mesh:D010369` returns **zero bindings**. The MeSH lookup details API returns
   "Pectoralis Major", "Pectoralis Major Muscle", "Pectoralis Minor" and "Pectoralis Minor Muscle" as
   non-preferred **entry terms** of D010369, not as descriptors.
   **Verified vocabulary fact V1 in `research/questions/SBLA-008-vertical-slice.md:76-82` is correct**,
   including the tree number and the "no narrower descriptor" conclusion.
2. **The explosion no-op.** `"Pectoralis Muscles"[mh]` returns 4,938 and `"Pectoralis Muscles"[mh:noexp]`
   returns 4,938. Identical, as V1 states. The index diagnostic of 4,938 at
   `research/searches/SBLA-008-search-strategy.md:216` is an exact match.
3. **Entry terms are not searchable as `[mh]`.** `"Pectoralis Major"[mh]` and `"Pectoralis Minor"[mh]`
   each return 0 with the term listed in `quotedphrasesnotfound`. The claim at
   `research/questions/SBLA-008-vertical-slice.md:73` is correct as written.
4. **UBERON:0002381.** EMBL-EBI OLS4 returns label "pectoralis major", synonyms including "musculus
   pectoralis major", and `database_cross_reference` containing `FMA:9627`, `NCIT:C33284`, `MA:0002354`,
   `SCTID:181624003` and `UMLS:C0585574`. Both identifier anchors in the questions file §2 resolve, and
   the FMA cross-reference is real.
5. **The publication-type finding, which was my strongest falsification target.** `Retraction of
   Publication` is a genuine NLM publication characteristic, so §3.3's claim looked like a likely
   vocabulary error. It is not. Against E-utilities `esearch`:
   - `"Retraction of Publication"[pt]` returns count **0** with the term in `quotedphrasesnotfound`.
   - `"Retraction of Publication"[Publication Type]` and `"Retraction of Publication"[ptyp]` also return
     0 with the same warning; the unquoted form returns 0 as well.
   - `"Retracted Publication"[pt]` returns 34,546 and translates to `[Publication Type]`.
   - `"Published Erratum"[pt]` returns 211,709 and `"Expression of Concern"[pt]` returns 3,902.
     The behaviour asserted at `research/searches/SBLA-008-search-strategy.md:163` and in handoff decision
     **D4** is exactly right, and the decision it drives — drop the value for PubMed, keep it for CENTRAL,
     record the platform difference rather than calling it a vocabulary error — is the correct response.
6. **Proximity syntax `[tiab:~0]`.** Valid; `querytranslation` echoes `[Title/Abstract:~0]`. Hyphen
   normalisation reproduced: `"cross sectional area"[tiab:~0]` and `"cross-sectional area"[tiab:~0]` both
   return **29,138** today against the candidate's 29,137 on 2026-09-11 — one day of index growth, not a
   discrepancy. Order-independence reproduced: `"bench press"[tiab:~0]` and `"press bench"[tiab:~0]` both
   return **2,905**, matching the candidate's diagnostic exactly. §3.2's account of the quoted-phrase trap
   and its fix is accurate and the fix is the right one.
7. **All six PubMed strings parse.** Each of S1–S6, submitted verbatim with my zero-yield anchor,
   returned `fieldsnotfound: []` and `quotedphrasesnotfound: []` with no error. **Criterion 6 is
   independently reproduced**, by a method that observes no question-level yield.
8. **OpenAlex citation direction, reproduced to the integer.** `W2741809807` reports
   `referenced_works_count: 54` and `cited_by_count: 1257`. `filter=cites:W2741809807` returns **1253**
   and the API's own `x_query.oql` reads "works where it cites (W2741809807)".
   `filter=cited_by:W2741809807` returns **44** with `oql` "works where it's cited by (W2741809807)".
   `filter=referenced_works:W2741809807` returns **1253**, identical to `cites:`. Every number and the
   direction semantics in §3.4 are correct, including the warning that the shortfalls are unindexed
   references and must not be read as a complete reference list.
9. **Europe PMC.** `https://europepmc.org/searchsyntax` returns **HTTP 404** and
   `https://europepmc.org/RestfulWebService` returns **HTTP 200**, as row 7 records. The E1 composite
   returns `version: 6.9`, as row 8 records.
10. **ClinicalTrials.gov API v2.** `/api/v2/version` returns `apiVersion 2.0.5` and
    `dataTimestamp 2026-09-11T09:00:04` — identical to row 9, including the timestamp. A deliberately
    invalid Essie area returns **HTTP 400** with `Error parsing query in Other terms: Unknown area name`,
    reproducing the candidate's method for validating `AREA[...]` expressions. `/studies/search-areas`
    serves the area catalogue as described.
11. **OSF SportRxiv legacy archive.** `filter[provider]=sportrxiv` returns `meta.total` **377**, matching
    row 14 exactly and supporting §3.6's conclusion that the OSF endpoint is a frozen legacy archive.

### 3.2 Diverged, and what it means

12. **Cochrane Library help page.** A plain fetch of `https://www.cochranelibrary.com/search-manager-help`
    returned **HTTP 419** for me, where row 6 records HTTP 403. Directionally the same result — scripted
    access is blocked — but not the same code. See M-5 for the consequence.

### 3.3 Downstream compatibility, checked against the accepted SBLA-007 artifacts

13. **SE-U1 is accurate.** `src/lib/content/schemas.ts:301-311` defines `sourceSchema.type` with no
    `preprint` member, and the `publication.status` enum is `current | corrected |
    expression-of-concern | retracted | superseded`, again with no preprint state. The candidate's
    observation and its routing ("Reviewer, to route to Codex if it matters") are both correct.
14. **The `searches[]` and `exclusions[]` claims are accurate, and the gap is real.**
    `src/lib/content/schemas.ts:419-444` defines `evidencePacketSchema` as `.strict()` with
    `searches[]` carrying exactly `database`, `query`, `searchedAt`, `resultCount`; `includedSourceIds`;
    and `exclusions[]` carrying exactly `sourceId` and `reason`. This confirms what the candidate says in
    §5.0 — and contradicts what it says in §8.3. See I-2.

---

## 4. Criterion-by-criterion result against the fourteen acceptance criteria

The criteria are those the candidate states at `research/packets/SBLA-008-handoff.md:526-570`.

1. **Boundary — PASS.** Exactly four paths, all additions, matching the ledger claim at `09f9ba4c…`.
   Reproduced in §2.2.
2. **Base — PASS.** Parent is `0752d5021da72eed840f61ae06f6c1966906c177`. Reproduced.
3. **Two questions with structured fields — PASS.** Q1 decomposes into Q1a (structure), Q1b and Q1c
   (function), each with a PICO/PECO field table where "Comparator" for the descriptive arm is marked not
   applicable **with a stated reason** rather than left blank
   (`research/questions/SBLA-008-vertical-slice.md:204`). Q2 carries population, intervention, comparator,
   outcomes, timeframe, setting, and a fully specified estimand at §5.4. I checked the estimand against
   the standard attributes — population, treatment and comparator conditions, endpoint, population-level
   summary, design contrast, intercurrent events, missing data — and all are present and coherent. The
   treatment-policy strategy is preferred with per-protocol reporting recorded as a downgrade reason,
   which is the right default. The requirement to record measurement timing "because acute swelling
   contaminates short intervals — that is tier 5 crossing into tier 1"
   (`research/questions/SBLA-008-vertical-slice.md:332`) is a genuinely good catch.
4. **Outcome hierarchy with priority order and hard limits — PASS.** Six rows at
   `research/questions/SBLA-008-vertical-slice.md:287-292`. Tier 1 (size change, ≥6 weeks, stated imaging
   requirements) is the only tier that may support a hypertrophy claim. Tier 4 (EMG) carries "**§2.2:**
   must never be presented as a direct measurement of hypertrophy". Tier 5 (acute swelling, pump,
   soreness, hormones) carries "never evidence of long-term growth ... never a reason to prefer either
   exercise". Harms are a mandatory parallel tier with zero-event and not-reported states. Rules H1–H3
   close the remaining routes: H2 forbids reading "no significant difference" as equivalence and requires
   the estimate, interval and precision; H3 forbids "better" without outcome, population, comparator and
   certainty, and forbids a universal best. This is a correct and complete implementation of §2.2.
5. **Exercise definitions reproducible — PASS.** Both specifications separate defining attributes,
   recorded modifiers and distinct conditions
   (`research/questions/SBLA-008-vertical-slice.md:112-157`). Exercise X pins implement, bench
   inclination at 0° ± 5°, body position, pronated grip outside shoulder width, concentric joint actions,
   range of motion and resistance source, and explicitly refuses to pool Smith machine, chest-press
   machine, dumbbell press, incline or decline, floor press, partial-ROM, accommodating resistance,
   unilateral press and push-ups. Exercise Y pins two stacks, shoulder-height pulleys, standing posture,
   a fixed slightly flexed elbow with **no intentional elbow extension**, and horizontal adduction, and
   refuses to pool pec deck, machine fly, bench-lying cable fly, high-to-low and low-to-high crossovers,
   single-arm and banded variants. The "fly performed with intentional elbow extension is a press, not a
   fly" exclusion is the kind of operational boundary a screener can actually apply. Combined with the
   index / related / distinct labels and the four-step thin-description procedure in the eligibility plan
   §2.3, a screener working from the written definitions alone can classify a study.
6. **Search strings complete, copyable, valid — PASS.** Independently reproduced for all six PubMed
   strings (§3.1 item 7). Non-PubMed routes carry complete queries: E1 gives endpoint, parameters and a
   full composite with anatomy, preprint and language variants; C1 gives a nine-line Search Manager
   strategy; T1 gives both `query.intr` and an `AREA[...]` Essie form; O1, X1, P1, R1 and V1 give concrete
   calls. The strings are genuinely copyable as written.
7. **Every route records platform, query, filters, dates, dedup, updates, failure and fallback — PASS on
   content, with I-2 attached.** §8.1 handles dates including the `[edat]`/`[crdt]` versus `[dp]`
   distinction for update runs, which is correct and is the sort of thing that silently loses records when
   got wrong. §8.2 gives a five-step deduplication ladder with the weakest key last and fuzzy matches
   flagged for human confirmation rather than merged silently, and correctly separates multi-report
   linkage from deduplication. §8.4 maps update cadence onto §9.11. §9 gives a thirteen-row failure
   matrix in which every fallback records the failure rather than substituting a different database, and
   "not executed" is never recorded as zero results. The content is excellent. What fails is that §8.3
   presents eight mandatory per-search fields as required "by `evidencePacketSchema.searches`" when the
   strict schema holds four — that is the second limb of I-2, and it is a labelling defect, not a
   methodology defect.
8. **Screening rules operational — PASS on content, with I-2 and M-1 to M-2 attached.** Design
   eligibility is specified per question and per outcome tier (§3.1, §3.2). Systematic reviews are
   eligible "as signposts and as contradiction sources, never as the citation for a primary datum", with
   reference lists mined in both directions and disagreeing syntheses both retained
   (`research/screening/SBLA-008-eligibility-plan.md:188-199`) — that is the correct fence. Language
   (§4.1), publication status (§4.2), multi-report linkage (§4.3), retractions and corrections consistent
   with §9.7 (§4.4), and inaccessible full text with an acquisition ladder (§4.5) are all specified.
   Conflict resolution (§7) covers within-role, between-role and disputed-criterion cases and correctly
   states that the reviewer does not repair the artifact. Every exclusion has a code. The defects are the
   miscount (M-1), the duplicate-state ambiguity (M-2), and the unrepresentable `awaiting-full-text`
   state (I-2).
9. **Deliberate contradiction search — PASS.** §7.1 names five distinct targets: null and
   non-significant results, opposing results, adverse and harm evidence, indirect evidence that undermines
   directness, and evidence that the measurement itself is unreliable (crosstalk, ultrasound reliability,
   acute swelling contaminating post-tests, EMG normalisation). That fifth target is one most plans omit.
   §7.2 makes S4 run unconditionally and logged under the same rules as S1–S3; requires registry-to-
   publication reconciliation with a 24-month unpublished threshold; requires both-directions citation
   chaining; requires reference-list mining of any opposing synthesis; requires a retraction sweep before
   synthesis; requires limitations and conflicts extracted as fields; and requires "searched and found
   nothing" to be recorded as a result with its date, query and zero count, distinct from "not run". §7.3
   adds eight guards, of which the strongest are that eligibility is committed before any search runs, the
   estimand is fixed before extraction so any unplanned subgroup is labelled post-hoc and cannot raise
   certainty, and the contradiction map is an input to synthesis rather than an appendix. This criterion
   is met in substance, not merely in form.
10. **Facts and methodology distinguishable — PASS.** The three labels are defined at
    `research/searches/SBLA-008-search-strategy.md:19-23` and used consistently. The eighteen-row
    verification log gives an official URL, what was verified and what was observed for every row, with a
    single access date. This is the discipline that let me reproduce fourteen claims quickly, and it is
    the artifact's outstanding feature.
11. **No search claimed to have been run, no scientific conclusion anywhere — FAIL.** The second half
    holds: I searched the four files for scientific assertions and found none. Anatomy statements are
    framed as what the questions ask, not what is true; V1 is explicitly a vocabulary fact about MeSH, not
    a fact about the muscle; §4's warning about thin literature is about index footprints, not about
    training. The first half is falsified in the opposite direction from the usual failure mode: a search
    _was_ run and is stated not to have been. See I-1.
12. **Assumptions and unresolved decisions labelled with a named resolver — PASS with a gap noted.** All
    twenty-eight declared items (A1–A4, U1–U5, SA1–SA3, SU1–SU6, EA1–EA4, EU1–EU4, SE-U1) are present,
    typed, and assigned to a named party, with several carrying an explicit deadline
    ("**before** SBLA-009 searches", "**before** screening"). My verdicts are in §7. The gap is that the
    `awaiting-full-text` schema conflict should have been a twenty-ninth item, by exactly the reasoning
    the candidate applied to SE-U1 (I-2).
13. **Handoff stands alone — PASS.** It uses the fixed §13.6 headings and carries objective, exact base,
    inputs, constraints, work done, thirteen numbered decisions with rejected alternatives, checks with
    real output, known uncertainties, exact files, required reviewer action, and its own acceptance
    criteria. I was able to act on it without access to the authoring session, which is the test. Two
    specifics deserve credit: it states "`pnpm verify` was NOT run. It could not be run in this
    environment" with the actual Node version error rather than implying a pass, and it discloses a
    temporary `node_modules` directory junction that was created and removed. D13 also explicitly invites
    the finding I have made: "A reviewer who judges even this to cross the SBLA-008/009 boundary should
    say so." The one accuracy defect is M-1.
14. **Formatting and hygiene — PASS on what I can check.** `git diff --check` across the candidate range
    is clean, exit 0, reproduced by me. Prettier `--check` I could not run; Codex's recorded `pnpm verify`
    covers it. The statement that `pnpm verify` could not run is made plainly and is not dressed up as a
    pass, which is what this criterion actually asks.

**Criteria result: 13 PASS, 1 FAIL (criterion 11).** Criteria 7, 8 and 12 pass on their own terms while
carrying findings recorded below.

---

## 5. The owner's named attention areas

- **(a) Is the slice scoped precisely enough for reproducible screening? — Yes.** See criterion 5. The
  residual softness is "pulleys at approximately shoulder height", but it is bounded from both sides:
  high-to-low and low-to-high crossovers are named distinct conditions, and pulley height is a mandatory
  recorded modifier in absolute or normalised terms. A screener has a decision procedure.
- **(b) Are Q1/Q2 PICO/PECO, estimands, hierarchy and timeframes scientifically coherent? — Yes.** See
  criteria 3 and 4. The ≥6-week floor for tier 1 is correctly labelled a project convention rather than an
  extracted finding (EA4), which is the honest framing.
- **(c) Are EMG, acute biomechanics, proxy outcomes, systematic reviews and indirect evidence fenced from
  hypertrophy conclusions? — Yes, on all five.** Tier 4 fences EMG; tier 5 fences acute responses
  including pump, soreness and hormones; tier 3 mechanics "may explain a tier-1 or tier-2 result; may
  never substitute for one"; systematic reviews are signposts and contradiction sources with claims cited
  to the located primary study; indirect evidence is recorded as indirectness rather than silently
  excluded, and the Q1 directness ladder ranks by directness "for the claim being made, not by study
  prestige" and states that activation "is not the same as contribution to torque". Rule H1 closes the
  last route by forbidding any tier-4-or-5-only study from supporting a comparative recommendation.
- **(d) Are queries, field tags, date semantics, deduplication, update logic and failure fallbacks
  complete and copyable? — Yes on completeness and copyability**, independently verified for the six
  PubMed strings and the E1 composite. The recording contract in §8.3 overstates what the accepted schema
  can hold (I-2).
- **(e) Missing synonyms, machine and dumbbell variants, regional hypertrophy, likely false negatives.**
  Machine and dumbbell variants are well covered in S2 and S3 (`machine press`, `dumbbell press`,
  `smith machine`, `pec deck`, `peck deck`, `pectoral deck`, `butterfly machine`, and the `fly`, `flies`,
  `flye`, `flyes` spellings). Regional hypertrophy is handled properly: S1 carries `clavicular head`,
  `clavicular portion`, `clavicular fibers`, `clavicular fibres`, `sternocostal`, `sternal head`,
  `sternal portion`, `abdominal head`, `costal head`, `regional activation`, `regional difference` and
  `neuromuscular compartment`; tier 1 admits "regional (clavicular vs sternocostal) where reported"; and
  U4 escalates whether regional outcomes sit inside the primary estimand. Two real false-negative
  exposures remain, both Minor and both quantified: M-3 (the `pectoral fly` and `pec fly` spellings) and
  M-4 (E1's term set is thinner than S2's, on the route the plan leans on hardest for Exercise Y).
- **(f) Operational reason codes, multi-report linkage, inaccessible full text, non-English, retractions
  and corrections, conflict resolution — all present and operational**, with the defects at M-1, M-2 and
  I-2.
- **(g) Does the contradiction search genuinely seek null, adverse, indirect and opposing evidence? —
  Yes**, and also measurement-invalidity evidence. See criterion 9.
- **(h) Did bounded index diagnostics cross the SBLA-008/SBLA-009 boundary? — Partly, and the crossing is
  I-1.** The twelve PubMed single-term counts are legitimately what the file says they are: counts of how
  many records use a phrase, which size the strategy and justify its fallbacks. Recording them is a
  reasonable and well-disclosed judgement, and I would not fail the candidate for them. The Europe PMC
  composite is a different object and crosses the line.
- **(i) Which unresolved decisions must be resolved before search execution? — U2 only, plus SE-U1 and
  I-2 before a packet is written.** Full verdicts in §7, summary in §8.
- **(j) Does any sentence present a scientific finding or a search as completed? — No scientific finding.
  One search is presented as not completed when it was.** That is I-1, and it is the inverse of the usual
  overclaim: the file understates what it did.
- **(k) Parent, base, four-file boundary, standalone handoff quality — all verified.** See criteria 1, 2
  and 13.

---

## 6. Findings

### Critical

None.

### Important

#### I-1 — The Europe PMC composite question query was executed, and three sentences say it was not

**Evidence.**

- `research/searches/SBLA-008-search-strategy.md:212` — "and no composite question query was executed."
- `research/searches/SBLA-008-search-strategy.md:229` — "Europe PMC, composite E1 string below,
  `hitCount` 334."
- `research/searches/SBLA-008-search-strategy.md:23` — an Index diagnostic is defined as a bounded count
  "for a _single search term_".
- `research/packets/SBLA-008-handoff.md:399-400` — "Europe PMC composite: `hitCount` 334."
- `research/packets/SBLA-008-handoff.md:402-403` — "No composite question query was executed. See **D13**."
- `research/packets/SBLA-008-handoff.md:305-307` (decision D13) — "No identifier was collected, opened,
  screened, or cited, and no composite question query was executed."

**Reproduction.** I submitted the E1 string from `research/searches/SBLA-008-search-strategy.md:391`
verbatim to `https://www.ebi.ac.uk/europepmc/webservices/rest/search` on 2026-09-12 and received
`"version":"6.9","hitCount":334`. The count reproduces exactly.

**Why this is Important rather than Minor.** Three things are true at once and cannot all stand:

1. The sentence is false as written. A composite question query was executed, on the candidate's own
   record, four lines below the denial.
2. The 334 falls outside the file's own definition of an index diagnostic, which is restricted to a
   single search term. The file's labelling system is its main integrity mechanism, and here it mislabels.
3. Under §9.8 step 2, a `search` artifact is exactly "database, date, full query, filters, and result
   count". Route E1's complete planned query plus its result count is therefore the SBLA-009 search
   artifact for that route, produced at the `scope` stage. SBLA-009's E1 yield is now pre-observed —
   before the reviewer has settled **U2**, the decision that `research/searches/SBLA-008-search-strategy.md:239-241`
   itself says must be settled "_before_ SBLA-009 searches, not after the yield is visible."

**Why this is not Critical.** No identifier was collected, nothing was opened, screened, or cited; the
count is honest, disclosed and exactly reproducible; and no scientific conclusion rests on it. The
candidate also pre-authorised this finding in D13 ("A reviewer who judges even this to cross the
SBLA-008/009 boundary should say so"), and correctly notes that the counts are separable from the rest of
the plan.

**What the authoring role should do.** Do not delete the observation — deleting a disclosed check would
be worse than the defect. Relabel the 334 honestly: move it out of §4, state that it is a route-level
composite count for E1 executed on 2026-09-11 with the platform version, correct the three denial
sentences and D13 to say what was actually run, and carry the count forward into the SBLA-009 search
record so it is reconciled rather than orphaned. Note in the same amendment that the U2 decision is now
being taken with partial yield visibility, so the owner can weigh that.

**Note on the contrast that makes this avoidable.** The candidate already knows the right technique. For
PubMed and for Europe PMC syntax it used an anchored parse test that forces a zero result while still
exercising the parser. Applying that same anchor to the E1 composite would have proved the string parses
without ever observing its yield. That is the remedy for the method, as distinct from the remedy for the
text.

#### I-2 — The plan mandates records the accepted `evidencePacketSchema` cannot hold, and only the smaller half of the gap is flagged

**Evidence — first limb, `awaiting-full-text`.**

- `research/screening/SBLA-008-eligibility-plan.md:371` — an eligible or possibly eligible record with
  unobtainable full text becomes "**`awaiting-full-text`** ... It is **not** an exclusion and **not** an
  inclusion."
- `research/screening/SBLA-008-eligibility-plan.md:375-377` — the state exists precisely so that an
  inaccessible eligible study cannot be made to disappear, and "the count of `awaiting-full-text`" is
  itself reportable.
- `research/screening/SBLA-008-eligibility-plan.md:462` — rule 3: "Every retrieved record ends in exactly
  one state: duplicate, excluded with a code, `awaiting-full-text`, or included. The arithmetic must
  close."
- `research/screening/SBLA-008-eligibility-plan.md:544` — EA1 asserts that four-way outcome is exhaustive.
- `src/lib/content/schemas.ts:419-444` — `evidencePacketSchema` is `.strict()` and offers
  `includedSourceIds: string[]` and `exclusions: {sourceId, reason}[]`. There is no field for
  `awaiting-full-text`, and none for duplicates either.

**Evidence — second limb, the search record.**

- `research/searches/SBLA-008-search-strategy.md:682-693` — §8.3 lists eight mandatory per-search fields
  under the heading "Required by §9.8 step 2 and by `evidencePacketSchema.searches`", including
  Platform version, PubMed `querytranslation` (marked "Mandatory. It is the only proof of what PubMed
  actually executed") and Failures.
- `src/lib/content/schemas.ts:424-435` — the strict `searches[]` object holds exactly `database`,
  `query`, `searchedAt`, `resultCount`. Filters can be carried as separate recorded rows, as §8.2 and
  D6 intend, so filters are fine. Platform version, `querytranslation` and Failures have no home.
- `research/searches/SBLA-008-search-strategy.md:258-260` — §5.0 names the four schema fields
  correctly: it "populates `evidencePacketSchema.searches` (`database`, `query`, `searchedAt`,
  `resultCount`)". So the two sections of the same file disagree about what the schema accepts, and
  §8.3 is the one that is wrong.

**Consequence.** SBLA-009 cannot produce a schema-valid evidence packet that carries the reconciliation
arithmetic this plan makes mandatory, nor the `querytranslation` string this plan calls the only proof of
what PubMed executed. The executor is left with an unrecorded deviation from the plan or an unrecorded
deviation from the schema, and either one quietly defeats the audit trail both documents exist to create.

**Why this is Important.** It blocks executing the plan as written, and the remedy is outside both Claude
roles' write boundaries — schemas belong to Codex. It needs an owner or Codex decision, not a research
edit. It is also the one place where the candidate's own excellent practice was not applied: SE-U1 at
`research/screening/SBLA-008-eligibility-plan.md:552` records the analogous `sourceSchema` preprint gap,
correctly says it is "Not actionable by this role — schemas are outside its write boundary", and routes it
to "Reviewer, to route to Codex if it matters". The `awaiting-full-text` gap is larger, because rule 3
and EA1 make it load-bearing for the PRISMA-style flow, and it is not recorded at all.

**Why this is not Critical.** The scope reasoning is sound; only its downstream representation is
unbudgeted. The fix is one recorded routing decision plus a corrected §8.3 heading, not a rewrite.

**What the authoring role should do.** Add the omission as a declared unresolved item alongside SE-U1,
naming Codex as the resolver and stating which of the two paths the owner must choose: extend
`evidencePacketSchema` (a Codex task, and a schema change to an accepted SBLA-007 artifact), or amend the
eligibility plan so that the four-way outcome maps onto what the schema can express. Correct §8.3 so it
distinguishes what §9.8 step 2 requires from what `evidencePacketSchema.searches` accepts, as §5.0
already does.

### Minor

Recorded with impact and follow-up destination, per CLAUDE.md. None of these blocks acceptance on its
own; all should land in the same bounded remediation round.

#### M-1 — The exclusion reason code count is wrong

`research/packets/SBLA-008-handoff.md:203` states "**§5** thirty-one stable exclusion reason codes in
five families". `research/screening/SBLA-008-eligibility-plan.md:383-448` defines **28** unique codes. The
"five families" is correct (§5.1 Population, §5.2 Exposure and comparator, §5.3 Outcome, §5.4 Design and
method, §5.5 Record and administrative); only the count is wrong, by three. Separately, `E-OUT-3` and
`E-OUT-4` are absent from the sequence — §5.3 runs `E-OUT-1`, `E-OUT-2`, `E-OUT-5` — with no note
explaining the gap. **Impact:** under EA3 codes are stable identifiers that are never redefined, so a gap
that looks like a dropped code invites a later screener to reuse `E-OUT-3` for something else and make two
runs incomparable. Fix the count and either close the numbering or state that the gap is intentional.
**Destination:** SBLA-008 remediation round, before any code is ever used.

#### M-2 — `E-REC-1` makes "duplicate" both a state and an exclusion code, and the arithmetic depends on which

`research/screening/SBLA-008-eligibility-plan.md:435` lists `E-REC-1` "Duplicate record of an
already-included report (deduplication, not an exclusion of a study)" inside §5, which is governed by
"Exactly one **primary** code per excluded record" at `:385`. But rule 3 at `:462` and EA1 at `:544` treat
_duplicate_ as a state distinct from _excluded_. Since `evidencePacketSchema.exclusions[]` is the only
place a reason can be recorded, whether duplicates appear there determines whether the retrieved-versus-
excluded arithmetic closes, and the plan does not say. **Impact:** two conscientious screeners can produce
non-reconciling PRISMA-style flows from the same records. **Destination:** SBLA-008 remediation round;
resolve together with I-2, since both are about mapping the plan's states onto the packet record.

#### M-3 — The `pectoral fly` and `pec fly` spellings are absent from every route

Reviewer index probes against PubMed E-utilities, 2026-09-12, counts only, no identifiers collected:
`"pectoral fly"[tiab:~0]` returns 3 and `"pec fly"[tiab:~0]` returns 3. The plan's full fly, deck and
crossover term set — the twenty-two terms in S2 — returns 72. Adding the four `pectoral fly` / `pec fly` /
`pectoral flye` / `pec flye` forms yields **5 records that no term in the plan matches**, of which **2**
also fall outside S2's broader exercise block (the six exercise MeSH descriptors plus `resistance
training`, `resistance exercise`, `strength training`, `weight training`). **Impact:** roughly two PubMed
records, in a literature the candidate itself measures in single digits for the index comparator. Small in
absolute terms, non-trivial relative to the base. **Credit where due:** SA1 already declares "the reviewer
should treat term coverage as the most likely defect in this file", which is exactly the right
pre-declaration; this finding simply attaches a number to it. **Destination:** add the four spellings to
S2, S3 and E1 in the SBLA-008 remediation round.

#### M-4 — E1's term set is materially thinner than S2's, on the route the plan leans on hardest for Exercise Y

`research/searches/SBLA-008-search-strategy.md:391` (E1) carries `bench press`, `chest press`, `cable
fly`, `cable crossover`, `pec deck`, `dumbbell fly`, `chest fly`, `machine fly` and `resistance training`.
It omits every `flye` and `flyes` spelling, `peck deck`, `pectoral deck`, `butterfly exercise`, `butterfly
machine`, `smith machine`, `machine press` and `dumbbell press` — all of which S2 at `:308` does carry.
Meanwhile `research/searches/SBLA-008-search-strategy.md:238-240` states that "S3, E1, C1, O1 and P1 are
not optional supplements. They are the routes most likely to hold whatever evidence exists for Y."
**Impact:** the route designated to rescue a thin comparator has the weaker vocabulary. The loss is
bounded, because E1's second block also accepts `MESH:"Resistance Training"`, `MESH:"Weight Lifting"` and
`TITLE_ABS:"resistance training"`, so a study indexed under any of those still returns. I did not quantify
it, deliberately: doing so would have required running further composite Europe PMC queries, which is the
boundary at issue in I-1. **Destination:** align E1's exercise block with S2's in the SBLA-008 remediation
round; the fix is mechanical.

#### M-5 — The Cochrane Search Manager claims cannot be independently reproduced, and the retrieval method is not recorded precisely

`research/searches/SBLA-008-search-strategy.md:63` (row 6) records "HTTP 200 via `curl` with a browser
user agent; HTTP 403 to a plain fetch", and `:445-447` records the 403 again as the C1 expected failure. My
plain fetch of `https://www.cochranelibrary.com/search-manager-help` on 2026-09-12 returned **HTTP 419**,
not 403. I did not send a substituted user agent, so **every C1 syntax claim is unverified by me**: the
`[mh ...]` versus `[mh ^...]` explosion behaviour, `NEXT` and `NEAR/x`, the three-character wildcard root,
the rule that wildcards cannot appear inside a quoted phrase, the `:ti :ab :kw :au :pt :so :doi :an :tp
:crg :la` field labels, the MeSH-coverage caveat in §3.5, and the `:pt` value list that includes
`Retraction of publication` — which is the load-bearing half of decision **D4**. Two sub-points.
**First**, a reviewer or executor without Cochrane access cannot reproduce row 6 at all, so the row does
not meet the standard the other seventeen rows meet. **Second**, the file describes retrieving the page by
working around the platform's own access control, on the same route where it says "Do not scrape it; §9.6
forbids scraping where an official route exists" (`:449-450`). Reading a public documentation page is not
harvesting search results, and I do not think the candidate did anything improper — but the file does not
draw the distinction, and a project whose access rules are this strict should draw it explicitly.
**Destination:** SBLA-008 remediation round. Either record the retrieval method precisely and state why it
is compatible with §9.6, or downgrade the C1 syntax claims to the same "syntax unverified at scope time"
status the file already uses honestly for SportRxiv (SU2) and PROSPERO (SU1), and mark the CENTRAL half of
D4 as unverified.

---

## 7. Verdicts on the declared assumptions and unresolved decisions

Blocking severity is stated against the pipeline stage each one actually gates, not against acceptance in
general.

### Questions file — assumptions A1–A4

- **A1** (slice is one muscle plus two named exercises, not a general chest review) — **Accept.
  Non-blocking.** Matches §14 Phase 1 exactly.
- **A2** (the estimand is the difference in change, not an additive "X plus Y" question) — **Accept, with
  a deadline. Non-blocking for search; blocking before extraction.** The search terms are identical under
  either reading, so SBLA-009 can search. The candidate is right that an additive design is a different
  question, and right to flag it rather than assume. The owner should confirm before extraction begins.
- **A3** ("a flat press" is instantiated as the barbell flat bench press) — **Accept. Non-blocking.** §14
  says "a flat press"; the barbell version is the most studied instantiation, and the candidate's own
  index diagnostic of 2,905, which I reproduced, supports that.
- **A4** (full-text access will be uneven, so abstract-only records need a defined fate) — **Accept in
  principle. Non-blocking as an assumption, but see I-2**, which is the machinery this assumption
  implies and the schema cannot hold.

### Questions file — unresolved U1–U5

- **U1** (no Terminologia Anatomica anchor; FIPAT unreachable) — **Non-blocking for SBLA-009 search.**
  Correctly assigned to the executor with instructions to retry and, failing that, record the absence.
  The instruction "do not substitute model memory for official nomenclature" is exactly right. I did not
  re-test FIPAT.
- **U2** (may Exercise Y be widened to pec deck or dumbbell fly if the literature is empty?) —
  **BLOCKING before search execution.** I concur with the candidate's own assignment, and I-1 raises the
  urgency: the E1 composite yield is already visible, so the owner should take this decision knowing it
  is no longer being taken blind. The candidate's handling of the temptation is the right one — D12
  refuses to substitute the pec deck now because it "would have made the searches look healthier while
  changing the question the owner asked for."
- **U3** (do contralateral-limb within-participant designs enter the primary synthesis?) — **Blocking
  before screening, not before search.** No search term changes either way. It must be settled before
  screening so the rule is not chosen once the results are visible, which is precisely why the candidate
  left it open rather than quietly deciding it.
- **U4** (is regional clavicular-versus-sternocostal hypertrophy inside the primary tier-1 estimand?) —
  **Blocking before extraction, not before search.** S1 already carries the full regional vocabulary, so
  discovery is unaffected.
- **U5** (translate non-English records or exclude them?) — **Blocking before screening, not before
  search.** Language is applied as a separately recorded filter step (§6.8, D6), so searching is
  unaffected. It is correctly routed to the owner because it is a cost decision, and `E-ADM-2` already
  exists to record a decision not to fund translation with its date and author. Note the interaction with
  SA2: a non-English study with no English title or abstract is missed by every route regardless of how
  U5 is answered.

### Search strategy — SA1–SA3 and SU1–SU6

- **SA1** (term lists adequate; "the reviewer should treat term coverage as the most likely defect") —
  **Correct self-assessment, and it was.** M-3 and M-4 are the two instances. **Non-blocking** once those
  are fixed.
- **SA2** (English search terms suffice even though non-English records are eligible) — **Accept as a
  recorded limitation. Non-blocking.** It is honestly stated as "recorded rather than solved", which is
  the right posture. Interacts with U5.
- **SA3** (index diagnostics are a fair yield proxy, and true yield is lower not higher) — **Accept.
  Non-blocking.** Conservative in the right direction.
- **SU1** (PROSPERO syntax unverified) — **Non-blocking.** Fallback to manual browse with recorded terms
  is adequate, and "if unusable, record as not executed" is correct.
- **SU2** (SportRxiv current server syntax unverified) — **Non-blocking.** Same reasoning.
- **SU3** (Terminologia Anatomica unreachable) — **Non-blocking.** Same item as U1.
- **SU4** (Crossref Retraction Watch labs endpoint, HTTP 502 then 504) — **Non-blocking.** The fallback —
  Crossref `update-type:retraction`, per-DOI `update-to`/`updated-by`, and PubMed S6 — is adequate, and
  the rule that publication stays blocked until a status check succeeds is the right conservative default
  under §9.7. I did not re-test the endpoint.
- **SU5** (GRADE Book, Cochrane Handbook, PRISMA 2020, CONSORT 2025 not re-fetched) — **Accept.
  Non-blocking.** Saying "I did not open them in this session and make no claim about their current
  contents" is exactly the discipline CLAUDE.md asks for.
- **SU6** (every verification is a 2026-09-11 observation and must be re-verified at execution) —
  **Accept, and independently validated.** My 2026-09-12 re-run found real one-day drift in two counts
  (29,137 to 29,138; 211,686 to 211,709), which is the phenomenon SU6 predicts. **Non-blocking**, and the
  instruction to re-check V1 at execution time should be kept.

### Eligibility plan — EA1–EA4, EU1–EU4, SE-U1

- **EA1** (the four-way record outcome is exhaustive) — **Sound as a screening rule, but blocked
  downstream by I-2.** Exhaustive in the plan; unrepresentable in the packet. **Blocking before SBLA-009
  writes an evidence packet**, not before it searches.
- **EA2** (20% stage-1 and 100% stage-3 double-screening substitutes for two independent screeners) —
  **Accept as recorded. Non-blocking.** It is explicitly "weaker than two screeners and is recorded as a
  limitation, not presented as equivalent", which is the honest framing. If the owner wants stronger, that
  is a resourcing decision, not a defect.
- **EA3** (reason codes are stable identifiers, never redefined) — **Accept. Non-blocking, but M-1 must
  be fixed before any code is used**, because EA3 is what makes an uncorrected numbering gap costly later.
- **EA4** (the ≥6-week tier-1 floor is a project convention, not an extracted finding) — **Accept, and
  the labelling is the important part. Non-blocking.** I accept 6 weeks as a defensible floor for
  detecting training-induced size change with the stated methods. Because it is a convention, any
  published claim that depends on it must say so rather than present it as a threshold the literature
  established.
- **EU1** — same item as U3. **Blocking before screening.**
- **EU2** — same item as U2. **BLOCKING before search execution.**
- **EU3** — same item as U4. **Blocking before extraction.**
- **EU4** — same item as U5. **Blocking before screening.**
- **SE-U1** (`sourceSchema` has no `preprint` type and no preprint publication status) — **Accurate,
  confirmed by me against `src/lib/content/schemas.ts:301-311` and the `publication.status` enum, and
  correctly routed. Blocking before SBLA-009 records a preprint source**, not before it searches. Route it
  to Codex together with I-2, since both are the same class of problem and should be decided once. Note
  the interaction with D10 and §8.2 step 4: the plan deliberately keeps preprints and links a preprint to
  its published version as "one study, two records", which is good practice and is precisely what the
  current `sourceSchema` cannot express.

---

## 8. What must be resolved before SBLA-009 begins

**Before search execution — one item.**

1. **U2 / EU2.** Whether Exercise Y may be widened. Owner or reviewer decision, taken as an explicit
   revised scope file with a date and a reason, never as a quiet pooling decision at synthesis time. The
   candidate is right about that and right to refuse to pre-empt it.

**Before an evidence packet is written — two items, both outside the Claude roles' write boundaries.**

2. **I-2.** How `awaiting-full-text` and duplicate records are recorded, given the strict
   `evidencePacketSchema`, and how the §8.3 fields that the schema cannot hold are preserved.
3. **SE-U1.** How preprints are typed and status-tracked.

**Before screening — U3 / EU1 and U5 / EU4. Before extraction — A2 and U4 / EU3.**

Everything else is non-blocking and correctly carried.

---

## 9. Required remediation and recheck

Per CLAUDE.md, one bounded remediation followed by one complete-artifact recheck. The remediation belongs
to the authoring role (Claude Research), except where noted.

1. **I-1** — correct the three denial sentences and D13; relabel the Europe PMC 334 as a route-level
   composite count with its date and platform version; carry it into the SBLA-009 search record; note
   that U2 is now being decided with partial yield visible. Do not delete the disclosure.
2. **I-2** — declare the `awaiting-full-text` and duplicate representation gap as an unresolved item
   naming Codex as resolver, alongside SE-U1; correct §8.3 to distinguish §9.8 step 2 requirements from
   what `evidencePacketSchema.searches` accepts, as §5.0 already does. The schema decision itself is
   Codex's, not the authoring role's.
3. **M-1** — correct "thirty-one" to the true count; close or annotate the `E-OUT-3` / `E-OUT-4` gap.
4. **M-2** — state whether duplicates are recorded in `exclusions[]`, so the flow arithmetic closes.
5. **M-3** — add `pectoral fly`, `pec fly`, `pectoral flye`, `pec flye` to S2, S3 and E1.
6. **M-4** — align E1's exercise block with S2's term set.
7. **M-5** — record the Cochrane retrieval method precisely and reconcile it with §9.6, or downgrade the
   C1 syntax claims and the CENTRAL half of D4 to "syntax unverified at scope time".

The recheck will be `reviews/evidence/SBLA-008-r2.md` and will re-examine the complete artifact, not only
these items.

---

## 10. Out-of-scope observation routed to Codex

This is not a defect in the candidate. It is a repository-level conflict that this review is the first
artifact able to trigger, and I am not permitted to fix any part of it.

**`reviews/evidence/SBLA-008-r1.md` will fail content validation under `pnpm verify`.**

- `scripts/content/validate.mjs:13-18` lists `reviews/evidence` as a `RECORD_ROOT`.
- `scripts/content/validate.mjs:27` restricts record extensions to `.json`, `.yaml` and `.yml`.
- `scripts/content/validate.mjs:30-38` — `isIgnored()` exempts only dotfiles, `readme.md`, and
  `research/packets/*-handoff.md`. It does not exempt `.md` under `reviews/evidence/`.
- `scripts/foundation/scan-records.mjs` walks the tree recursively, so the file will be found.
- `scripts/content/validate.mjs:94-105` will therefore emit
  `RECORD_EXTENSION_UNSUPPORTED  reviews/evidence/SBLA-008-r1.md`.
- Meanwhile CLAUDE.md requires review reports at `reviews/<discipline>/<task-id>-r<number>.md`, and
  `reviews/evidence/` exists for exactly that purpose.

All 34 existing review reports live under `reviews/releases/`, which is not a record root, and
`reviews/evidence/` has until now contained only `.gitkeep` — which `isIgnored()` skips as a dotfile.
That is why the conflict has never fired before.

I wrote the file at the path CLAUDE.md and the task both specify, because choosing a different path to
satisfy the validator would be a unilateral change to the review contract. Codex owns the resolution and
has three obvious options: exempt `.md` under `reviews/evidence/` in `isIgnored()`, drop
`reviews/evidence` from `RECORD_ROOTS` until a structured review record is actually produced there, or
change the documented report path. I have no view on which, and no authority to implement any of them.

---

## 11. Checks run in this session, with real output

Repository checks, run by me in `C:\src\s008r1`:

- `git rev-parse 56068c22^{commit}` — `56068c222bd8971378586776d133a7cf7a470b96`
- `git rev-parse 56068c22^{tree}` — `fb33be17be7d5365ea27bb08c7a16bc9ee9fbeb8`
- `git rev-parse 56068c22^` — `0752d5021da72eed840f61ae06f6c1966906c177`
- `git diff --name-status 56068c22^ 56068c22` — four lines, all `A`, all under `research/`
- `git diff --shortstat 56068c22^ 56068c22` — `4 files changed, 2282 insertions(+)`
- `git diff --check 56068c22^ 56068c22` — no output, exit 0
- `git cat-file -t 09f9ba4c…` and `git cat-file -t 905ab934…` — `commit` for both
- `sha256sum` on the four candidate files — recorded in the header block above

External checks, run by me on 2026-09-12 against official endpoints, reproduced counts and responses
recorded in §3. Fourteen reproduced, one divergence (M-5), five carried as unverified (§2.3).

Not run by me, stated plainly rather than implied: `pnpm verify`, `pnpm evidence:status`, Prettier
`--check`, and the content validator — Node `v24.14.0` is below the `>=24.20.0` engine floor, `pnpm` is
not on PATH, and this worktree has no `node_modules`.

---

## 12. Files written by this review

`reviews/evidence/SBLA-008-r1.md` — this file, and nothing else. The candidate commit, the research
files, `content/`, schemas, scripts, tests, configuration, prior reviews and the ledger are all
unmodified.
