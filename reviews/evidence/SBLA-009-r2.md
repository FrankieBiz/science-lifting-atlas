# Evidence review: SBLA-009 evidence pass and draft claims, round 2

**Task:** SBLA-010 — the single complete citation-entailment and adversarial recheck of the SBLA-009
evidence pass (master plan §18 queue row; §14 Phase 1 Task 1.2). This is the one complete-artifact
recheck that follows the one bounded remediation prescribed by `reviews/evidence/SBLA-009-r1.md` §11.
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
remediate, or contribute to any SBLA-009 artifact, and I received none of the authoring role's
reasoning beyond the committed artifacts and the committed handoff (master plan §9.10).
**Review date:** 2026-09-15 (all network evidence timestamped UTC below).
**Reviewer worktree:** `C:\src\s009review-r2`
**Reviewer branch:** `claude-review/SBLA-009-r2`
**Reviewer write path:** `reviews/evidence/SBLA-009-r2.md` — sole permitted path. No other file was
created, edited, staged, or committed. No artifact under review was repaired (AGENTS.md role table;
CLAUDE.md "Never repairs the artifact under review").

**Reviewed candidate commit:** `133151bab1f287f0b2096d0c251dba0268fb3455` _(immutable)_
**Reviewed candidate tree:** `c181020b1bc34605e30b95259683f3bcbd4083f6` _(immutable)_
**Account-A scientific candidate:** `0880d5fbeedd57fb852469d447e9e441bd955d91`
**Integration merge:** `1dc1c41b96508edbd2ae7d2ebff0ca6f5a1eb3f1` (Codex, no scientific edits)
**Accepted integrity-gate mainline:** `c18a107dbf2b7cceb9240b414c4247367a48adf5`
**Frozen decisions:** `reviews/releases/SBLA-009-prerequisite-decisions.md` at `8ca59e85`
**Governing R1 report:** `reviews/evidence/SBLA-009-r1.md` (present in this tree; see §1.4)

---

## 0. Verdict

**FAIL — 0 Critical, 4 Important, 13 Minor.**

The acceptance rule in CLAUDE.md and AGENTS.md is strict: a candidate passes only with **zero
unresolved Critical and zero unresolved Important findings**. This candidate has four Important
findings, so it fails.

**The remediation is substantially successful and should be read that way.** All fourteen R1
Critical and Important findings are closed, and I verified each one against the artifacts and, where
the source was reachable, against the source itself (§3). The reconciliation arithmetic closes from
raw records at the new totals. Every one of the 88 included records has an extraction; every one of
the 88 packet source IDs matches; all 71 claim-ID references in the three drafts resolve; all 23
claims carry certainty, applicability, a resolving source and a non-empty locator; zero retracted
records are included; the single preprint supports no claim; zero included sources remain at
`metadata-only`. The G1016 thesis that was the pivot of R1's Critical finding was genuinely retrieved
— I re-downloaded it in this session and the repository serves exactly the 21,237,276 bytes recorded
— and the attribute determination that keeps it a related condition is, on my independent reading of
its Methods and Figure 2, correct. The headline absence survives every falsification route I ran
(§8).

The candidate fails on four narrower grounds, three of which are new and one of which is the
recurrence of R1's Critical defect on a record R1 did not name:

1. **N-1.** A CC BY full text is recorded as unobtainable. `G1944`'s own recorded acquisition URL
   returns HTTP 200 with a 689,102-byte PDF to my client, and its abstract sits on an open landing
   page, yet the record is held `metadata-only` / `awaiting-full-text` and handoff Decision 3 states
   that "no abstract and no full text could be obtained." This is R1 finding C-1's defect class,
   reproduced on a new record, by an identifiable and systematic mechanism (§7, N-1).
2. **N-2.** `claim-press-versus-fly-activation-mixed` asserts that the 2023 meta-analysis reports a
   sternal difference "favouring the bench press." Its own extraction records only that the sternal
   pectoralis "differs," its own synthesis records only "a sternal difference," and the Results text
   at the locator the claim cites says the greater activation is **in the variable exercise**. The
   direction is obtainable only from the paper's Abstract and Featured Application — which the
   candidate's own uncertainty 9 warns no claim should lean on, and whose unreliability the
   candidate's own contradiction map C-12 records (§7, N-2).
3. **N-3.** All three reader-facing drafts declare `claimSource: …atomic-claims.json@1.0.0` and
   `draftVersion: 1.0.0` while the claims artifact is `2.0.0`. Version 1.0.0 does not contain
   `claim-fly-machine-pectoralis-rupture`, which the fly draft cites three times, and resolving the
   pin binds all three drafts to the exact claim text that failed R1 (§7, N-3).
4. **N-4.** Unbounded universal absence wording survives, unchanged from the R1 candidate, at two
   places in the bench-press draft — including its Practical takeaway. Both cite an absence record
   whose own statement is explicitly bounded to retrieval. This is R1 finding I-5's defect class at
   a fifth location R1 did not enumerate (§7, N-4).

None of the four overturns a scientific conclusion of the slice. All four are repairable inside a
narrow, well-specified remediation, and §9 gives it.

---

## 1. Provenance verification

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD
133151bab1f287f0b2096d0c251dba0268fb3455
$ git rev-parse HEAD^{tree}
c181020b1bc34605e30b95259683f3bcbd4083f6
$ git rev-parse --abbrev-ref HEAD
claude-review/SBLA-009-r2
$ git status --porcelain
(empty)
```

HEAD equals the assigned candidate commit and the assigned tree exactly. The worktree was clean at
review start.

### 1.2 Exact-path claim, verified before writing

Verified at coordination commit `f65501378a091c032e4c8fa1cbbd16f909739d2e`
("docs: claim SBLA-010 evidence review R2"), per CLAUDE.md step 2:

```
$ git show f655013:docs/runbooks/current-work.md
```

| Field            | Recorded value                                  | Matches this session |
| ---------------- | ----------------------------------------------- | -------------------- |
| Task             | SBLA-010 complete citation-entailment review R2 | yes                  |
| Role             | Claude Review (account B)                       | yes                  |
| Branch           | `claude-review/SBLA-009-r2`                     | yes                  |
| Worktree         | `C:\src\s009review-r2`                          | yes                  |
| Base commit      | `133151bab1f287f0b2096d0c251dba0268fb3455`      | yes                  |
| Started          | 2026-09-15 16:23 EDT                            | yes                  |
| Expected handoff | `reviews/evidence/SBLA-009-r2.md`               | yes                  |
| Paths owned      | `reviews/evidence/SBLA-009-r2.md`               | yes                  |

Every field matches. The claim was recorded by Codex on my behalf, as required — my role cannot write
that ledger, and I did not edit it. `reviews/evidence/SBLA-009-r2.md` did not exist at the candidate
commit, so this report creates rather than overwrites, preserving append-only history alongside
`SBLA-009-r1.md`.

### 1.3 Composition of the reviewed candidate

```
$ git diff --name-status 1dc1c41 133151b
A	reviews/evidence/SBLA-009-r1.md

$ git diff --name-status 48e4802 0880d5f
M	content-drafts/exercises/barbell-flat-bench-press.md
M	content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md
M	content-drafts/muscles/pectoralis-major.md
M	content-drafts/syntheses/SBLA-009-atomic-claims.json
M	research/appraisals/SBLA-009-appraisals.md
M	research/extractions/SBLA-009-source-extractions.json
M	research/packets/SBLA-009-handoff.md
M	research/packets/sbla-009-evidence-packet.json
M	research/screening/SBLA-009-screening-flow.json
M	research/searches/SBLA-009-search-receipts.json
M	research/syntheses/SBLA-009-synthesis.md
```

Exactly the eleven claimed research and draft paths in the Account-A range; the integration commit
adds only the immutable R1 report. No `src/`, `tests/`, `scripts/`, `content/`, `.github/` or `docs/`
path appears in either range. `git diff --check` reports no whitespace errors over `1dc1c41..133151b`
or `48e4802..0880d5f`.

**Caveat required by CLAUDE.md:** I ran this scan from my own mutable review worktree. Per the
role-path rule, an authoritative boundary result must come from Codex or CI executing
`check-role-paths.mjs` from a trusted checkout against the candidate with `--repository`. Treat §1.3
as a corroborating scan, not as independent boundary evidence.

### 1.4 The R1 report's presence in this tree, and what it changes

`reviews/evidence/SBLA-009-r1.md` is **absent** from the Account-A candidate `0880d5f` and **present**
in the combined candidate `133151b`, added by the integration commit. This matters for one reported
concern and I resolve it here rather than as a finding of broken links:

- `research/appraisals/SBLA-009-appraisals.md:9` and `research/syntheses/SBLA-009-synthesis.md:9`
  each carry a rendered Markdown link `[…](../../reviews/evidence/SBLA-009-r1.md)`. Both paths, and
  their casing, resolve correctly **in the tree I am reviewing**. They were dangling at the
  Account-A commit and were resolved by integration, not by the author.
- The residue is a documentation inaccuracy, not a broken link: handoff Decision 6 states that the R1
  report "is referenced by commit, **not as a repository cross-link**." That is true of the
  structured `crossLinks` fields, which were correctly moved to `governingReview` blocks, and false
  of these two rendered Markdown links. Recorded as **M-12**.

### 1.5 The Codex continuity and integration path, audited as provenance only

The ledger and the handoff disclose that Account A exhausted its usage limit during the first pass,
that Codex assembled the original continuity handoff mechanically, and that Codex later merged the
Account-A remediation into accepted mainline without scientific edits. I audited this as provenance
and treated it as neither scientific authorship nor evidence of correctness.

- The disclosure is accurate and specific. The remediation handoff's §Authorship states plainly that
  Account A performed all scientific work in the remediation, across two Account-A sessions.
- `git diff --name-status 1dc1c41 133151b` confirms the integration commit changed exactly one path,
  and that path is the immutable R1 report. No scientific artifact was touched at integration.
- R1 finding **M-2** (the Codex-owned inventory table mixing non-blank and total line counts) is
  superseded by an Account-A-owned table that states it uses `wc -l` totals. I verified five of the
  eleven byte counts directly (§5.4); all matched.

---

## 2. Methods

What I did, in the order I did it.

1. Verified HEAD, tree, branch, cleanliness, and the active exact-path claim at `f655013` (§1).
2. Read in full: `AGENTS.md`, `CLAUDE.md`, the SBLA-009 governing sections of the master plan queue
   and evidence rules as cited by the artifacts, the complete R1 report (1,116 lines), the complete
   remediation handoff (`research/packets/SBLA-009-handoff.md`), the closed-claims ledger rows for
   every SBLA-009 gate and review, and all eleven artifacts under review.
3. Recomputed both reconciliation equations, the exclusion-code sum, the receipt sum and the
   retrieval-event total from raw `records[]` rather than from any summary block (§4).
4. Audited all 23 claims and all 5 absence records structurally and semantically (§6), and audited
   the acquisition ladder of all 124 records that carry one (§5.1).
5. Ran live, lawful, unauthenticated network checks against publisher and repository routes: 20
   requests in total, recorded with their HTTP status, byte count, content type and — where a file
   was obtained — its SHA-256 (§5.2, §7). No authentication was used, no paywall was circumvented,
   no user-agent was substituted, and no access control was bypassed.
6. Obtained and read two primary documents in full: the 2023 meta-analysis (G1903) and the
   previously-unobtained G1944, and re-read the open full text of G0062 through the Europe PMC REST
   endpoint.
7. Installed dependencies with `--frozen-lockfile` and ran full `pnpm verify` under the pinned
   runtime (§5.3).
8. Attempted to falsify each of the five adversarial leads routed to me and each of the eleven minor
   probes, proving three leads, rejecting two, and partially rejecting one (§7, §8).

Where a finding below states a number, the command that produced it is given. Where I could not
verify something, §10 says so.

---

## 3. R1 closure matrix

R1 returned 1 Critical, 13 Important and 10 Minor findings. Every one is dispositioned here with the
evidence I used. **All fourteen blocking findings are closed.** Two of them (C-1 and I-5) are closed
at every location R1 named while the same defect class survives elsewhere; those recurrences are new
findings N-1 and N-4, not reopened R1 findings, and they are graded on their own facts.

### 3.1 Critical

| ID      | R1 finding                                                   | Verdict    | Evidence I used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C-1** | Absence and completeness statements rest on unopened records | **Closed** | Recomputed from raw records: **650** acquisition attempts across **124** records; **0** records at `awaiting-full-text` or `included` carry an empty ladder; **0** included sources remain `metadata-only`. G1016 was retrieved and read — I re-fetched its bitstream on 2026-09-15 and the repository returned `HTTP 200, Content-Length 21,237,276, application/pdf`, matching the recorded bytes exactly. Both absence records are now bound to retrieval and carry `boundedBy` arrays. See **N-1** for the recurrence on G1944. |

### 3.2 Important

| ID       | Verdict                                   | Evidence I used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I-1**  | **Closed**                                | `grep -rn 'SBLA-009-evidence-packet' research/ content-drafts/` → **0 hits**. All four `crossLinks.evidencePacket` values read `research/packets/sbla-009-evidence-packet.json@2.0.0`; both rendered Markdown links resolve with exact casing. The accepted case-sensitive cross-link validator passes in full `pnpm verify`.                                                                                                                                                                                                          |
| **I-2**  | **Closed**                                | DOI `10.3390/app13085203` is extracted as **G1903** and cited on claims 14 and 21 and as `externalCorroboration` on absence record 1. I downloaded the exact PDF (3,358,506 bytes, SHA-256 `8ac15532…cbb50d`, matching the handoff) and read it. Its PRISMA flow does cover SPORTDiscus and Web of Science. See **N-2** and **M-1** for defects in how it is used and routed.                                                                                                                                                          |
| **I-3**  | **Closed**                                | `G0062` / `source-pmid-25713681` is now linked to claim 21 with `role: qualifies`. I re-read PMC4327372 live (`europepmc…/PMC4327372/fullTextXML` → HTTP 200, 61,315 bytes) and the Results state verbatim: "higher activity in sequence A (100.13 ± 13.56%) than sequence B (81.47 ± 13.09%) for the chest fly." The claim's qualifier reproduces both values and both SDs exactly.                                                                                                                                                   |
| **I-4**  | **Closed**                                | Backward (R-048) and forward (R-049) citation chasing exist as receipts over the included set, contributing 745 new records. Both bounds are disclosed (200 citing works per seed; 3,479 → 841 relevance filter). See **M-11** on where those bounds are and are not recorded.                                                                                                                                                                                                                                                         |
| **I-5**  | **Closed at the four locations R1 named** | "Nobody has studied this exercise." is gone. The fly draft now opens "**These searches found no study of this exercise.**"; the registry sentence is bounded to the one registry queried; the closing sentence reads "a statement about the retrieved literature, not a proof that no such study exists"; absence record 1's statement is bound to retrieval in all three sentences. See **N-4** for the bench-press draft.                                                                                                            |
| **I-6**  | **Closed**                                | `10.1590/s1517-86922007000100012` is included as **G1896** — I re-fetched its SciELO PDF live (HTTP 200, 37,307 bytes, SHA-256 `4a4f7890…8fc7c3d5`, matching the handoff exactly). `10.12820/rbafs.v.19n3p342` is **G1820**, read in full and excluded `E-EXP-7` with its reason recorded. Non-English vocabulary exists on R-046, R-047 and R-050.                                                                                                                                                                                    |
| **I-7**  | **Closed**                                | "three small trials" now appears in the claim statement, both drafts and appraisal §2.1 ("Three trials survived to full text"). The bench draft adds "two of those three used the bench press," which resolves the ambiguity R1 identified about which trials the claim rests on.                                                                                                                                                                                                                                                      |
| **I-8**  | **Closed**                                | "Ten" appears in the claim qualifier, `barbell-flat-bench-press.md:168` and synthesis L-3. `grep -rni 'eight further\|eight eligible'` → **0 hits**.                                                                                                                                                                                                                                                                                                                                                                                   |
| **I-9**  | **Closed**                                | (a) `pectoralis-major.md:78–81` now reads "A cadaveric series of 80 specimens … within that series, **five** randomly selected muscles were examined by Sihler whole-mount nerve staining, and an intercostal contribution was present in every one of those five"; synthesis §1.2 matches. (b) "**twenty-nine** healthy young females, across two independent experiments" in `pectoralis-major.md:103` and synthesis §1.4.                                                                                                           |
| **I-10** | **Closed**                                | Both qualifiers now state the values: "51 (SD 14) years old at time of death, range 21 to 70 years, 9 male and 5 female" and "mean age of 69.3 (SD 11.8) years, range 48 to 90." Both extraction `quality.notes` are rewritten, and `claim-pectoralis-major-structural-variation` applicability was **lowered** `partially-direct → indirect` — certainty and applicability moved only downward, as required.                                                                                                                          |
| **I-11** | **Closed, exemplarily**                   | New `claim-fly-machine-pectoralis-rupture`, scoped to "training on a chest fly machine, which is a related fly-family condition and not the index," graded `very-low` / `indirect`, carrying the translation ladder state (steps 1 and 2 reached, step 3 not performed) and a "one case has no denominator" qualifier. The fly draft's safety section cites it three times and cites the bench-press rupture claim zero times. The `draftingRule` now states "Mechanical traceability is necessary and not sufficient" and names I-11. |
| **I-12** | **Closed**                                | X-G0042 and X-G0315 are both `full-text-open`. The false qualifier is replaced: the claim now states "The one comparison that reports a difference did not normalise its EMG to any reference contraction," records electrode placement and crosstalk, and carries the 16 % / p = 0.027 / ES 0.36 effect. Nine access levels were corrected upward (G0042, G0140, G0270, G0315, G0361, G0521, G0621, G0244, G0505).                                                                                                                    |
| **I-13** | **Closed on both dimensions**             | _Search:_ stratum N-RS4a exists as R-044 (59 records, 50 new). _Claim:_ `claim-bench-press-inclination-shifts-regional-activation` is re-derived — the monotonic wording is withdrawn, certainty is `low` (was `moderate`), direction is `mixed`, and PMIDs 33049982 and 25799093 are both cited with `role: contradicts`. Contradiction-map row **C-10** records the disagreement across four sources.                                                                                                                                |

### 3.3 Minor

| ID       | Verdict                      | Evidence                                                                                                                                    |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-1**  | **Closed**                   | `fieldContract.retrievalEventsDefault` is a structured field. Summing `retrievalEvents ?? 1` over 1,956 records yields exactly 2,343 (§4).  |
| **M-2**  | **Superseded**               | Inventory table is Account-A-owned and states it uses `wc -l` totals. Five byte counts spot-checked, all matched (§5.4).                    |
| **M-3**  | **Closed**                   | G0244 and G0505 are both `full-text-open`; Bookshelf ladder steps recorded with byte counts (67,303 and 67,065).                            |
| **M-4**  | **Closed**                   | `extraction.language` null count = **0 / 88**.                                                                                              |
| **M-5**  | **Closed**                   | G0127 and G0129 are both `decidedAtStage: stage-3-full-record`. See new **M-7** for a surviving instance of the same label class elsewhere. |
| **M-6**  | **Routed, not actioned**     | `sourceSchemaFields.study` mapping remains a Codex/SBLA-011 item. Still disclosed as L-A3. Correct disposition.                             |
| **M-7**  | **Addressed as recorded**    | `coverageGaps.registries` names the eight untried registries; the fly draft's registry sentence is bounded to ClinicalTrials.gov.           |
| **M-8**  | **Recorded**                 | PMID 18076235 retrieved by citation chasing, screened, excluded `E-EXP-7` with its reason. No longer absent.                                |
| **M-9**  | **Noted, not adopted**       | PMID 40692697 is not cited. Correct — it is a deltoid study and does not narrow absence record 3.                                           |
| **M-10** | **No action, as determined** | Confirmed closed in R1 itself.                                                                                                              |

---

## 4. Raw reconciliation proof

Recomputed from `records[]` in `research/screening/SBLA-009-screening-flow.json`, not from the
`reconciliation` block.

```
records[].length                                  = 1956
terminalState tally  : excluded 1842 | included 88 | awaiting-full-text 26
sum(retrievalEvents ?? 1) over all records        = 2343
equation one : 1956 = 1842 + 26 + 88              closes
equation two : 2343 =  387 + 1956                 closes
sum of exclusionCodeCounts                        = 1842   equals the excluded total
sum of receipts[*].recordsRetrievedIntoScreening  = 2343   equals recordsRetrieved
```

Both equations close, and the `retrievalEventsDefault` of 1 is the only reading under which they do.
The receipt-sum invariant that the remediation broke and repaired is restored: the 51 receipts sum to
exactly the screening `recordsRetrieved`. The handoff's account of the two defects it found and fixed
before commit (a mislabelled candidate-pool field on R-048/R-049, and an under-counted retrieval
event on the screening side) is consistent with every figure I can recompute, and the corrections
table reproduces.

Cross-artifact closure, recomputed independently:

```
screening included (88)        -> extractions (88)              : 0 missing, 0 extra
screening AFT (26)             -> awaitingFullText register (26): 0 mismatched
packet includedSourceIds (88)  -> extraction proposedSourceIds  : 0 missing, 0 extra
claim sourceIds not resolving to an extraction                  : 0
claim recordIds not in the included set                         : 0
records with an empty ladder where one is required              : 0
included sources at metadata-only                               : 0
extractions with null language                                  : 0
```

---

## 5. Gates, ladders and the runtime

### 5.1 The acquisition ladder, audited in full

All 650 attempts across 124 records, recomputed:

| Property                                            | Value                                                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Records carrying an `acquisition` object            | 124 (88 included, 26 awaiting-full-text, 10 excluded)                                     |
| Total structured attempts                           | 650                                                                                       |
| Attempts from the first pass / from the remediation | 42 / 608                                                                                  |
| Records where **no** step reached a server          | **7** (5 excluded with `ladderNotRequiredReason`; 2 where every route returned no record) |
| Attempts carrying a `url`                           | 69 of 650                                                                                 |
| Distinct `attemptedAt` values                       | 1 — `2026-09-13`                                                                          |
| `ladder-5-author-request` steps at `not-performed`  | 90                                                                                        |

Two things I expected to find and did not:

- **The ladders are not empty in substance.** The reported concern that 22 awaiting-full-text plus 43
  abstract-only records carry no HTTP-coded attempt does not survive recomputation. Only **7** records
  have no server contact at all, and five of those are excluded on substance at stage 2 with a
  recorded `ladderNotRequiredReason`, which §4.5 permits. The large `not-available` / `no-pmcid` /
  `no-record` populations are the recorded outcomes of real identifier-resolution and OpenAlex
  `is_oa` lookups, not silence.
- **The dates are real, not back-filled.** Every attempt is dated `2026-09-13`, which at first reads
  as uniform back-dating given that the remediation commit is dated 2026-09-14 17:53 EDT. It is not.
  The remediation base `48e4802` was created 2026-09-13 17:00:59 EDT, the packet `decisionLog`
  records the C-1 ladder run at `2026-09-13T21:40:00Z`, and the receipts disclose the separate
  2026-09-14 verification re-run in a `verification` field while keeping `executedAt` at the original
  execution date. The two Account-A sessions straddle the date boundary exactly as the handoff says.
  **I raise no finding on the dates.**

### 5.2 The research-integrity gate

`pnpm validate:research` inside full `pnpm verify` reports:

```
Research integrity passed: 1 complete bundle checked (SBLA-009).
```

Per the task framing and my own reading of the gate's accepted scope, this proves bookkeeping, not
truth. Findings N-1 through N-4 are all invisible to it by construction: it checks that an attempt
carries a date and a result, not that the result is what the server returned; that a claim cites a
source, not that the source entails the claim; that a file parses, not that a version pin resolves.

### 5.3 `pnpm verify` — full suite, exit 0

Runtime confirmed against the pin before running anything:

```
$ node --version
v24.20.0
$ corepack pnpm --version
11.24.0
$ corepack pnpm install --frozen-lockfile
$ corepack pnpm verify
… EXIT=0
```

The host default Node is v24.14.0 and does not meet the engine; I used the pinned fnm-managed
v24.20.0 and corepack-pinned pnpm 11.24.0, matching `.node-version` and `packageManager` exactly.

| Stage               | Result                                              |
| ------------------- | --------------------------------------------------- |
| `format:check`      | pass — "All matched files use Prettier code style!" |
| `lint`              | pass, zero warnings                                 |
| `typecheck`         | pass                                                |
| `test`              | **17 files, 249 tests passed**                      |
| `validate:content`  | pass, 1 record                                      |
| `validate:graph`    | pass; 0 nodes; graph generation remains SBLA-011    |
| `validate:research` | pass, 1 complete bundle (SBLA-009)                  |
| `evidence:status`   | pass; 0 sources checked as of 2026-09-15            |
| `build`             | pass                                                |
| `test:portability`  | **3 files, 17 tests passed**                        |
| `verify:foundation` | pass                                                |
| `assets:spike`      | pass                                                |
| `assets:decision`   | pass                                                |

### 5.4 Formatting and whitespace on the artifacts under review

```
$ pnpm exec prettier --check <all 11 artifacts>
All matched files use Prettier code style!
$ git diff --check 1dc1c41 133151b      -> clean
$ git diff --check 48e4802 0880d5f      -> clean
```

Byte counts spot-checked against the handoff inventory for five artifacts (search receipts 157,287;
screening flow 1,602,741; extractions 617,578; appraisals 29,261; atomic claims 82,288) — all matched
exactly.

---

## 6. Claim-by-claim and source audit

### 6.1 Structural audit of all 23 claims

Every claim was checked for: a non-empty `certainty`; a non-empty `applicability`; at least one
`sourceLink`; every `sourceId` resolving to an extraction of an **included** record; a non-empty
`locator` on every link; every `recordId` present in the included set; and no citation of a source
held at `metadata-only`.

```
claims audited                                    : 23
claims with any structural defect                 : 0
unresolved sourceIds                              : 0
empty locators                                    : 0
recordIds not in the included set                 : 0
claims citing a metadata-only source              : 0
```

Draft traceability, recomputed across the three drafts:

```
claim-ID references in drafts : 71   (26 muscle, 22 bench, 23 fly)
distinct IDs referenced       : 28
unresolved references         : 0
claims/absence records never cited by any draft : 0
```

### 6.2 Semantic entailment audit — the claims I tested against sources

I could not re-read all 88 sources. I prioritised the claims R1 forced a re-derivation of, the claims
that carry the slice's headline output, every claim whose locator I could reach lawfully, and the
safety claims. Direction of movement was checked on every re-derived claim: **certainty moved only
downward or stayed flat, never upward**, as eligibility plan §6.2 requires.

| Claim                                                               | Certainty          | Entailment verdict                                                                                                                                                                                                   |
| ------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claim-press-versus-fly-activation-mixed`                           | very-low           | **N-2.** Numbers, CI, I², p and the four primary comparisons all verified exact against the sources. The added direction "favouring the bench press" is **not entailed** by the cited locator.                       |
| `claim-bench-press-inclination-shifts-regional-activation`          | low (was moderate) | **Sound as re-derived.** Monotonic wording withdrawn; direction `mixed`; 11 sources including both R1-named contradicting primaries with `role: contradicts`; the 2023 pooled values quoted exactly against Table 3. |
| `claim-fly-machine-pectoralis-rupture`                              | very-low           | **Sound.** Scope confined to the fly machine; translation ladder state recorded honestly; "one case has no denominator"; may not be sole support. The fly draft's three citations all entail.                        |
| `claim-bench-press-pectoralis-rupture`                              | low                | **Sound.** No fly-machine content remains attributed to it. The steroid qualifier matches its `role: qualifies` link to PMID 35413736.                                                                               |
| `claim-pectoralis-major-hypertrophy-with-chest-resistance-training` | low                | **Sound.** "three small trials" reconciles with three cited trial sources, appraisal §2.1 and both drafts; the qualifier names all three and says which contributes direction only.                                  |
| `claim-pectoralis-major-humeral-footprint`                          | moderate           | **Sound.** Donor age and sex now stated (51 ± 14, range 21–70; 9 M / 5 F); the false absence qualifier is gone.                                                                                                      |
| `claim-pectoralis-major-structural-variation`                       | moderate           | **Sound.** Donor mean age 69.3 ± 11.8 recorded; applicability correctly **lowered** to `indirect` as a consequence.                                                                                                  |
| `claim-pectoralis-major-innervation`                                | moderate           | **Sound.** The intercostal contribution is attributed to the five Sihler-stained muscles, with 80 stated as the gross-dissection total.                                                                              |
| `claim-cable-crossover-shoulder-moment-larger-than-bench-press`     | —                  | **Sound as drafted.** Both draft sentences carry the "related condition" label and the three unreported defining attributes. Numbers not independently re-verified (§10).                                            |
| `claim-multi-joint-versus-single-joint-programme-strength`          | —                  | **Sound.** The bench draft explicitly states it is "not evidence about chest muscle growth."                                                                                                                         |
| Remaining 13 claims                                                 | —                  | Structurally clean; spot-checked for scope/certainty presence and locator specificity; no entailment defect found within the sampling I performed (§10).                                                             |

### 6.3 Absence records

All five were read in full.

- **`absence-index-cable-fly-no-evidence`** — bound to retrieval in all three sentences, carries ten
  `searchesThatWouldHaveFoundIt` entries including the four remediation routes, a five-item
  `boundedBy`, and `externalCorroboration` citing the 2023 review. This is the strongest absence
  record I have reviewed in this repository. See **M-11** for three retrieval bounds it omits.
- **`absence-primary-comparison-no-evidence`** — bound to retrieval; seven route entries; two-item
  `boundedBy`. Its statement is correct; two **draft sentences** that cite it are not (**N-4**).
- The remaining three (`contralateral-sensitivity-analysis-empty`, `terminologia-anatomica-anchor`,
  `architectural-parameters`) carry no `boundedBy` array, which I checked and **do not raise**: each
  is self-bounding in its own statement ("No **retrieved** record…", "was unreachable on 2026-09-11
  and again on 2026-09-13", "was extracted **in this pass**").

### 6.4 Retraction, correction, preprint and publication stage

```
records touching retraction   : G0127, G0129, G1063, G1247, G1394, G1504, G1577 — all excluded
any retracted record included : false
publication.stage across 88   : peer-reviewed 84 | other-non-peer-reviewed 3 | preprint 1
the single preprint (G0798)   : cited by a claim? false
G1016 (MSc thesis)            : stage other-non-peer-reviewed, status current, verified 2026-09-13
records touching erratum      : G0022, G0310, G0735, G1009, G1790 — all excluded
```

No claim rests on a retracted source. The single preprint supports nothing. G1016 is cited but is
correctly labelled non-peer-reviewed, and its claim qualifier states it "may never be sole support."

---

## 7. New findings

Every finding states its exact location, the evidence, the impact, and the remediation destination.
**I did not repair any artifact.**

### IMPORTANT

#### N-1 — A CC BY full text is recorded as unobtainable, and two completeness statements are false as a result

**Locations:** `research/screening/SBLA-009-screening-flow.json` — record **G1944**, its
`acquisition.accessLevel: metadata-only`, its `terminalState: awaiting-full-text`, and its
`ladder-1-publisher-open-access` step; `research/packets/SBLA-009-handoff.md` Decision 3;
`content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` Provenance section
("none yielded lawful full text").

**Evidence.** The record is Arseneault, Roy & Sercia (2021), _The Effect of 12 Variations of the Bench
Press Exercise on the EMG Activity of Three Heads of the Pectoralis Major_, International Journal of
Strength and Conditioning, DOI `10.47206/ijsc.v1i1.39`. The candidate records:

```
ladder-1-publisher-open-access
  url    : https://journal.iusca.org/index.php/Journal/article/download/39/124
  result : 200 (23 bytes)
```

and OpenAlex `is_oa=true oa_status=diamond` on the step above it. From my own client, at the **same
URL**, 2026-09-15 20:39 UTC:

```
https://journal.iusca.org/index.php/Journal/article/download/39/124
  -> HTTP 200   689,102 bytes   application/pdf
     sha256 1a01086a81ffff228a766e4a9b2813467e349e8891f8651487f7c4d32f39831e
https://journal.iusca.org/index.php/Journal/article/view/39
  -> HTTP 200    34,509 bytes   text/html   (abstract present in full; licence CC BY)
```

No authentication, no paywall, no user-agent substitution, no access control circumvented. I
extracted and read the PDF: n = 13 trained men, bench press at **-15°, 0° and +30°**, grip widths of
100 % and 200 % biacromial in pronation and supination, at each position's own 12RM, with EMG of the
clavicular, sternocostal and abdominal heads of the pectoralis major.

Handoff Decision 3 states of G1873, G1917, G1941 and G1944: "no abstract and no full text could be
obtained for any of them, so nothing can be extracted." For G1944 both halves of that sentence are
demonstrably false.

**This is a systematic mechanism, not a transcription slip.** I enumerated every attempt recorded as a
2xx with fewer than 6,000 bytes and a URL — 16 attempts — and re-ran all of them. The results separate
cleanly:

| Recorded          | Records                                  | Live result                                                       | Reading                                                                                    |
| ----------------- | ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 22–24 bytes       | G1876, G1896, G1903, G1928, G1944        | **4 of 5 return the full PDF** (1.18 MB, 37 KB, 3.36 MB, 2.17 MB) | A 22–24-byte "200" is a redirect the client did not follow, recorded as a terminal failure |
| 1,444–3,151 bytes | G0042, G0315, G0513, G0684, G1056, G1881 | **reproduce exactly or tighten to 403**                           | Genuine landing pages and interstitials; the dispositions are correct                      |
| 202, 2,009 bytes  | G0964                                    | reproduces (202)                                                  | Correct; figshare async, nothing retrievable                                               |

For four of the five 22–24-byte cases the record was obtained by another route anyway, so the false
result is harmless bookkeeping (recorded as **M-1**). For **G1944 it was not**, and the record was
consequently frozen at `metadata-only` and written up as unobtainable.

**Impact.** An eligible, freely licensed, directly on-topic portion-resolved source was never
extracted, and two artifacts state that it could not be obtained. The affected claim is
`claim-bench-press-inclination-shifts-regional-activation` — the claim R1's I-13 already forced a
re-derivation of. On my reading the source would **corroborate** that claim's current direction
(sternocostal falls as the bench is raised; clavicular higher at 30° in several grip conditions)
rather than overturn it, and it is confounded by grip varying with inclination, so the scientific
risk is low. The defect is the false completeness statement, which is the exact ground on which R1
graded C-1 Critical. **It is graded Important rather than Critical here because the headline absence
is untouched** — G1944 is a bench-press study and bears on neither absence record — and because the
unextracted source points the same way as the claim it would join.

**Remediation destination.** Claude Research — `research/screening/SBLA-009-screening-flow.json`
(G1944's ladder result, access level and terminal state), `research/extractions/…` (extract it, or
record why not), `research/packets/SBLA-009-handoff.md` Decision 3, and the fly draft's Provenance
paragraph. Re-run the remaining 22–24-byte attempts while doing so; note that promoting G1944 to
`included` changes both reconciliation equations and `exclusionCodeCounts`.

#### N-2 — A claim asserts a direction its locator, its extraction and its synthesis do not establish

**Locations:** `content-drafts/syntheses/SBLA-009-atomic-claims.json` →
`claim-press-versus-fly-activation-mixed`, `statement`, final clause; and its `sourceLinks` entry for
`source-doi-10-3390-app13085203`.

**Evidence.** The claim states:

> "…and a 2023 meta-analysis reports a significant sternal difference **favouring the bench press**
> alongside no significant clavicular difference…"

Its locator for that source is "Table 3, Type of exercise, Bench press vs. other variants type …;
Results text naming the six comparator exercise types." I obtained the exact PDF the candidate used
(3,358,506 bytes, SHA-256 `8ac15532…cbb50d`, matching the handoff) and read it. The Results text at
that locator states, twice, verbatim:

> "The analysis shows that there is no significant difference in the activation of the clavicular
> portion when comparing the PB with another exercise; however, there is a greater activation in the
> sternal pectoralis **in the variable exercise** (SMD = 4.04; 95% ICI 0 = 1.74; 6.35) (Figure 6)."

"The variable exercise" is the non-bench-press variant — the surrounding sentences confirm the
pattern ("greater activation in general both in the **push up** vs. BP exercise (SMD = 3.01…)"). The
cited locator therefore states the **opposite** direction to the claim.

The candidate's own upstream layers record no direction at all:

- Extraction `X-G1903`, reported fact 7: "The Results text states that there is no significant
  difference in clavicular activation when comparing the bench press with another exercise, **while
  the sternal pectoralis differs**."
- Synthesis contradiction map **C-11**: "a meta-analysis finds **a sternal difference** with I² = 98 %
  and no clavicular difference."

Both are scrupulously direction-free. The direction appears for the first time in the claim.

Where the direction _is_ supported is the paper's Abstract ("greater activations are also seen in the
original bench press vs. the comparisons (p = 0.023 to 0.001)") and its Featured Application ("BP is
the one that most involves the pectoralis major"). Neither is in the claim's locator, and the
candidate's own handoff uncertainty 9 says a reviewer "should check that **no claim leans on its
Featured Application**," while its own contradiction map **C-12** records that this paper's "Featured
Application and Abstract conclusion" contradict its Table 3 and Results. The claim leans on exactly
the part of the source the candidate identified as unreliable, and records no contradiction for this
contrast.

**What I checked and did not find.** The numeric content is correct. I reconstructed Table 3's SMD
column against seven independently anchored rows (declined sternal −0.75 / p 0.143; declined
clavicular 2.03 / p 0.218; inclined sternal 1.80 / p 0.017, abstract-confirmed; inclined clavicular
0.36 / p 0.81; concentric −0.18 / p 0.029, abstract-confirmed; sternal type-of-exercise 4.04 with CI
1.74–6.35, prose-confirmed; push-up 3.01 with CI 0.46–5.57, prose-confirmed). The mapping is
consistent, and the extraction's attribution of **SMD 4.53 to the clavicular type-of-exercise row** is
**correct**. The reported concern about that attribution is rejected. I-squared 98 / 94.9, the CIs and
the p-values are all exact.

**Impact.** Master plan §9.8 forbids a downstream stage overwriting upstream material; the claim layer
does so here. The defect does **not** propagate: neither the fly draft nor the bench draft repeats the
direction — both describe the pooled result only as too heterogeneous to be precise — so no
reader-facing sentence is wrong today. But the claims file is the promotion source of record, and
`claim-press-versus-fly-activation-mixed` is the claim R1 forced a re-derivation of on four separate
grounds.

**Remediation destination.** Claude Research — remove the direction and state the contrast as the
extraction and synthesis do, or keep it and cite the Abstract explicitly while recording the
source-internal contradiction for the type-of-exercise contrast as a second row alongside C-12.

#### N-3 — All three drafts pin a claim-source version that cannot supply their own citations

**Locations:** `content-drafts/muscles/pectoralis-major.md:3,11`;
`content-drafts/exercises/barbell-flat-bench-press.md:3,11`;
`content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md:3,11`.

**Evidence.** All three drafts declare:

```yaml
draftVersion: '1.0.0'
claimSource: content-drafts/syntheses/SBLA-009-atomic-claims.json@1.0.0
```

while the claims artifact declares `artifactVersion: 2.0.0`. Recomputed against the v1.0.0 file as
committed at `8cee805`:

```
v1.0.0 : artifactVersion 1.0.0 | 22 claims | 5 absence records
v2.0.0 : artifactVersion 2.0.0 | 23 claims | 5 absence records
claims present in v2 but not v1 : ["claim-fly-machine-pectoralis-rupture"]
v1.0.0 contains claim-fly-machine-pectoralis-rupture : false
```

The fly draft cites `[claim-fly-machine-pectoralis-rupture]` at lines 174, 180 and 183 — its entire
Safety context section. Its declared claim source cannot supply any of the three.

The pin is worse than a missing claim. All three drafts were substantively rewritten in the
remediation (25, 41 and 100 changed lines), and the claims file changed by 333 lines. Resolving
`@1.0.0` binds the drafts to the exact claim text that **failed R1** — for instance
`claim-pectoralis-major-hypertrophy-with-chest-resistance-training` reads "in **two** small trials" at
v1.0.0 and "in **three** small trials" at v2.0.0, which is R1 finding I-7. A promoter honouring the
pin would reintroduce I-7, I-8, I-13 and the I-12 qualifier wholesale.

**Impact.** Every reader-facing artifact in the slice carries a false, machine-readable provenance
assertion. The claims file's own `draftingRule` makes claim traceability the governing contract for
these drafts, and the pin is the machine-readable half of that contract. SBLA-011 promotion is the
consumer.

**Remediation destination.** Claude Research — set `draftVersion: 2.0.0` and
`claimSource: …atomic-claims.json@2.0.0` in all three drafts, and update `generatedAt` if the
convention requires it. Related metadata defects are recorded as **M-3** and **M-4**.

#### N-4 — Unbounded universal absence wording survives in the bench-press draft

**Locations:** `content-drafts/exercises/barbell-flat-bench-press.md:33–34` (Practical takeaway) and
`:149–150` (bold, "Comparison with the cable fly").

**Evidence.** Both sentences are existence claims:

> line 33: "Whether it builds more chest muscle than a cable fly is **unknown**: **no study has
> compared them** `[absence-primary-comparison-no-evidence]`."
>
> line 149: "**No study has compared this exercise with a bilateral standing cable fly at shoulder
> height for pectoralis major size** `[absence-primary-comparison-no-evidence]`."

The absence record they both cite says something narrower:

> "No study comparing a barbell flat bench press with any cable fly for a pectoralis major size
> outcome **was retrieved by any route run in this pass or in its R1 remediation**."

Both sentences are unchanged from the R1-reviewed candidate — `git show 8cee805:content-drafts/exercises/barbell-flat-bench-press.md`
carries the second one verbatim at its line 132. R1's I-5 enumerated four locations, all in the fly
draft and the absence record; the remediation fixed all four and did not generalise the fix to the
parallel sentences in the bench draft. The fly draft now reads "**These searches found no study of
this exercise.**" — the correct form — which makes the inconsistency between the two pages plain.

**Impact.** Master plan §2.2 prohibits converting a thin evidence base into a confident universal
statement, and §9.5 prohibits categorical universal language below `high` certainty. The claims file's
own `draftingRule` — added in this remediation — states that "a draft sentence must be **entailed by**
the claim whose ID it cites, not merely adjacent to it." These two sentences are the drafting rule's
own counter-example. One of them is the first thing a reader of the bench-press page sees.

**Remediation destination.** Claude Research — bind both to retrieval, using the fly draft's
now-correct form.

### MINOR — nonblocking, with impact and destination recorded

| ID       | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Impact                                                                                                                                                                                                        | Destination                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **M-1**  | Four attempts record a 22–24-byte "200" for a URL that serves the full PDF (G1876 1.18 MB, G1896 37 KB, G1903 3.36 MB, G1928 2.17 MB, all re-fetched 2026-09-15). In addition, **G1903's `acquisition.fullTextSource`** and its `ladder-outcome` URL (`…/bitstream/handle/10952/9780/2023_Electromyographic%20activity%20of%20the%20pectoralis.pdf`) return **HTTP 404**, while the step recorded `200 (24 bytes)` (`…/bitstream/10952/9780/1/…pectoralis%20major.pdf`) returns the 3,358,506-byte PDF whose SHA-256 matches the handoff exactly. The two URLs are transposed. | Provenance accuracy only. Every affected document was obtained by another route and its hash verifies, so no claim loses support. A re-verifier following `fullTextSource` for G1903 gets a 404.              | Claude Research — screening flow and extraction `accessLadderSteps` for G1876, G1896, G1903, G1928. Shares a root cause with **N-1**. |
| **M-2**  | The fly draft's Provenance section says "**Eight fly-family records** remain at `awaiting-full-text`" and then enumerates five fly-family records plus "**three bench-press records** bearing on regional activation." The collective label is wrong for three of the eight, and the awaiting-full-text set actually holds **five** bench-press regional-activation records (G1084, G1873, G1917, G1941, G1944), not three.                                                                                                                                                    | The five fly-family records are enumerated correctly and completely, so a reader of the fly page is not misled about that page's own gap. The collective label and the bench-press subtotal are wrong.        | Claude Research — fly draft Provenance paragraph.                                                                                     |
| **M-3**  | `research/appraisals/SBLA-009-appraisals.md:11` states "Companions, all at version **1.0.0**" while its own artifact version is 2.0.0 and every companion is at 2.0.0. The synthesis's parallel line correctly says 2.0.0.                                                                                                                                                                                                                                                                                                                                                     | A reader comparing the two headers gets contradictory statements about the same five files.                                                                                                                   | Claude Research — appraisal header.                                                                                                   |
| **M-4**  | `research/packets/sbla-009-evidence-packet.json` declares **no version field at all**, yet four artifacts pin it as `…sbla-009-evidence-packet.json@2.0.0` and the appraisal lists it among companions "at version 1.0.0."                                                                                                                                                                                                                                                                                                                                                     | The packet version pin is unverifiable in either direction. Same class as **N-3**.                                                                                                                            | Claude Research — packet, or Codex if the packet schema owns the field.                                                               |
| **M-5**  | The packet carries no `governingReview` block, while the other four structured artifacts do and handoff Decision 6 states that "**each artifact** carries a `governingReview` block." The packet records the remediation in `decisionLog` instead.                                                                                                                                                                                                                                                                                                                             | Documentation accuracy; the information exists in another field.                                                                                                                                              | Claude Research — packet or handoff Decision 6.                                                                                       |
| **M-6**  | All **90** `ladder-5-author-request` steps carry `result: not-performed` together with `attemptedAt: 2026-09-13`. A step that was never performed carries an attempt date.                                                                                                                                                                                                                                                                                                                                                                                                     | Internal contradiction in the field the integrity gate requires. The accompanying note is honest ("this project operates no outbound correspondence channel").                                                | Claude Research — screening flow; or Codex if the gate should permit a null date for a not-performed step.                            |
| **M-7**  | Five records excluded on substance (G0228, G0267, G0470, G0536, G0593) carry `decidedAtStage: stage-1-title-abstract` while their own `ladderNotRequiredReason` says "the record was excluded on substance **at stage 2**."                                                                                                                                                                                                                                                                                                                                                    | Stage label understates the work done. No effect on the exclusion. Identical in kind to R1 **M-5**, which was closed.                                                                                         | Claude Research — screening flow.                                                                                                     |
| **M-8**  | The 26 awaiting-full-text entries in the extractions register hold all **167** ladder entries as **plain strings**, not the structured attempt objects; the handoff states the migration converted "**every** ladder entry." I verified the migration is genuinely lossless: the register strings are byte-identical to the screening flow's `verbatim` fields for **26 / 26** records, 0 mismatches.                                                                                                                                                                          | No information loss and no date loss — the dates exist in the screening flow. An auditor reading the register alone sees undated strings.                                                                     | Claude Research — extractions AFT register, or handoff wording.                                                                       |
| **M-9**  | Handoff §"External research-integrity gate" prints `node C:\s009integrity\scripts\evidence\research-integrity.mjs --root C:\src\s009fix1 …`. The gate worktree is `C:\src\s009integrity`; the printed path omits `\src` and cannot run as written.                                                                                                                                                                                                                                                                                                                             | Reproducibility of a recorded command. The gate result itself reproduces — I re-ran it through `pnpm validate:research` (§5.2).                                                                               | Claude Research — handoff.                                                                                                            |
| **M-10** | Handoff §I-2 closure says MDPI "served a 2,207-byte interstitial"; the screening flow and extraction both record `200 (2305 bytes)` for the same attempt. My own client received HTTP 403 (414 bytes) on 2026-09-15.                                                                                                                                                                                                                                                                                                                                                           | Two different byte counts for one attempt in two artifacts. No scientific impact; the disposition (interstitial, not the PDF) is correct either way.                                                          | Claude Research — handoff.                                                                                                            |
| **M-11** | `absence-index-cable-fly-no-evidence.boundedBy` lists five bounds and omits three that the candidate discloses elsewhere: forward chasing truncated at 200 citing works per seed, the relevance expression dropping 2,638 chased works, and R-046's inspection of only the first 50 results per probe.                                                                                                                                                                                                                                                                         | The absence record is the reader-facing scientific object and R1's I-5 required absence statements to be bound to retrieval. Nothing is hidden — all three are in handoff uncertainties 1–2 and the receipts. | Claude Research — absence record 1 `boundedBy`.                                                                                       |
| **M-12** | Handoff Decision 6 states the R1 report is referenced "not as a repository cross-link," while `research/appraisals/SBLA-009-appraisals.md:9` and `research/syntheses/SBLA-009-synthesis.md:9` carry rendered Markdown links to it. Both resolve in this tree (§1.4); both were dangling at `0880d5f`.                                                                                                                                                                                                                                                                          | Documentation accuracy. No broken link in the candidate under review.                                                                                                                                         | Claude Research — handoff Decision 6.                                                                                                 |
| **M-13** | The 2023 meta-analysis's Abstract reports the stability contrast as "SMD = -0.18; 95%CI **-0.33 to 3.74**; p = 0.029" against Table 3's "-0.35; -0.03" — a CI that spans zero cannot give p = 0.029. `X-G1903` records the paper's decline-contrast self-contradiction (C-12) but not this one.                                                                                                                                                                                                                                                                                | **None.** No claim in the slice uses the stability contrast. Recorded so it is not re-raised, and because C-12 establishes the precedent for recording this source's internal defects.                        | Claude Research — optional second row on C-12.                                                                                        |

---

## 8. Falsification attempts that failed — verified correct

Recorded so they are not re-litigated. Each is something I actively tried to break and could not.

1. **The headline absence survives.** I could not find any retrieved record studying the index
   condition, and the absence statements are correctly bounded to retrieval at every location in the
   absence records themselves.
2. **The G1016 attribute determination is correct.** I re-fetched the thesis bitstream (HTTP 200,
   Content-Length 21,237,276, exactly as recorded) and read the candidate's reasoning against it. The
   Methods place the arms at chest height and do not state the pulley origin height; the frozen §3.2
   table makes pulley origin a defining attribute and names high-to-low crossover a distinct
   condition. It is a related condition. Index Y remains unstudied.
3. **The acquisition dates are genuine.** See §5.1. The uniform `2026-09-13` is consistent with the
   remediation base commit time, the packet `decisionLog` timestamp `2026-09-13T21:40:00Z`, and the
   separately disclosed 2026-09-14 verification re-run. I raised no finding.
4. **The "empty ladder" concern does not survive recomputation.** Only 7 of 124 records had no server
   contact, five of them legitimately (§5.1).
5. **The SMD 4.53 attribution is correct.** Reconstructed against seven anchor rows (§7, N-2). The
   reported concern is rejected.
6. **Certainty moved only downward.** Claim 14 `moderate → low`; claim 5 applicability
   `partially-direct → indirect`; claim 21 held at `very-low` despite a materially enlarged evidence
   base, with the reason recorded. No claim was upgraded anywhere.
7. **No absence became equivalence.** Every absence record carries an explicit "this is not evidence
   of equivalence / ineffectiveness" interpretation, and both drafts repeat it.
8. **EMG is nowhere presented as hypertrophy evidence.** "Electromyography is never evidence of
   hypertrophy" appears as a qualifier on every activation claim I checked, and both drafts carry it.
9. **No related fly is promoted to index Y.** Every related-condition statement in the fly draft
   carries an explicit "why this is a related condition and not this exercise" label.
10. **No retracted source supports a claim; the single preprint supports nothing** (§6.4).
11. **Cross-artifact closure holds in both directions** for 88 included records, 88 extractions and 88
    packet source IDs (§4).
12. **The remaining small-byte attempts are honest.** Six of the sixteen reproduced exactly or
    tightened to 403 against my client; their `abstract-only` and `metadata-only` dispositions are
    correct (§7, N-1 table).
13. **G0964 is genuinely unobtainable.** figshare returned 202 to the candidate and 202 to me; the v2
    API returns 404 for that article ID.

---

## 9. Bounded remediation plan

Four Important findings, all narrow. This is one bounded remediation followed by the one complete
recheck the stop rule already permits after a failed review — no additional review layer is created
or requested.

1. **N-1 (largest).** Re-run G1944's recorded URL; extract it or record why not; correct its access
   level and terminal state; correct handoff Decision 3 and the fly draft's Provenance paragraph. Also
   re-run the four other 22–24-byte attempts and correct their recorded results and G1903's
   `fullTextSource` (**M-1**). If G1944 becomes `included`, both reconciliation equations and
   `exclusionCodeCounts` must be recomputed and the packet rebuilt.
2. **N-2.** Remove the unentailed direction from `claim-press-versus-fly-activation-mixed`, or cite
   the Abstract explicitly and record the source-internal contradiction for the type-of-exercise
   contrast alongside C-12.
3. **N-3.** Correct `draftVersion` and `claimSource` to `2.0.0` in all three drafts.
4. **N-4.** Bind both bench-press draft sentences to retrieval, matching the fly draft's corrected
   form.
5. **Minors.** M-1 through M-13 may be taken in the same pass or recorded for later hardening with
   their impact and destination, as the stop rule permits. M-1 should be taken with N-1.

---

## 10. Reviewer limitations

Stated plainly, because a reviewer who overstates coverage is the same defect as an author who does.

1. **I did not re-read all 88 sources.** §6.2 lists what I tested. The remaining claims were audited
   structurally and for internal consistency, not against their sources. A claim-level entailment
   error in the untested set would not have been caught.
2. **My role-path scan ran from my own mutable review branch** (§1.3). Per CLAUDE.md the authoritative
   boundary result must come from Codex or CI executing `check-role-paths.mjs` from a trusted checkout
   with `--repository`.
3. **I did not re-execute the search strategy.** I did not independently reproduce the 51 receipts,
   the 2,343 retrieval events, or the citation-chase pools. R1 reproduced nine of nine routes in the
   first pass; I relied on that plus the internal invariants, which close.
4. **I did not re-screen the 848 new records.** The two-pass rule-set method and the 307 records
   screened on title alone are disclosed (synthesis L-11, handoff uncertainty 3); I sampled but did
   not audit the rule set's recall. An over-exclusion in that set would not have been caught.
5. **Network results are point-in-time and client-specific.** Publisher responses vary by client, day
   and geography; my 403s from MDPI and the candidate's 200-with-interstitial are both plausible
   observations of the same resource. Where it mattered I relied on SHA-256 matches rather than status
   codes.
6. **The G1944 finding rests on my own retrieval.** I have given the URL, the status, the byte count
   and the SHA-256 so it can be checked independently. If the journal's behaviour differs for the
   author's client on re-test, the finding should be re-graded on that evidence — but the abstract on
   the open landing page is not subject to that caveat.
7. **I did not verify the 2023 meta-analysis's own extracted data against its 23 included studies.**
   The candidate records its extreme heterogeneity and implausible pooled SMDs as quality defects,
   which is the right disposition; I did not go behind them.
8. **`pdftotext -layout` garbles Table 3.** My SMD column reconstruction (§7, N-2) is an inference
   validated against seven independently anchored values, not a direct read of the rendered table.

---

## 11. Criterion-by-criterion matrix

|   # | Criterion (from the handoff's acceptance list and CLAUDE.md)                                            | Verdict                     | Where            |
| --: | ------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------- |
|   1 | Candidate committed and pushed from the stated base; exactly the eleven claimed paths                   | **PASS**                    | §1.3             |
|   2 | External research-integrity gate exits 0                                                                | **PASS**                    | §5.2             |
|   3 | `pnpm verify` passes under the pinned runtime                                                           | **PASS**                    | §5.3             |
|   4 | Strict evidence packet validates; every cross-link resolves case-sensitively                            | **PASS**                    | §5.3, §3.2 I-1   |
|   5 | Every retrieved record reconciles to exactly one terminal state; both equations close                   | **PASS**                    | §4               |
|   6 | Every acquisition attempt carries a real date                                                           | **PASS**                    | §5.1             |
|   7 | Every acquisition attempt carries an **observed** result                                                | **FAIL**                    | **N-1**, **M-1** |
|   8 | No record that needs a ladder has an empty one                                                          | **PASS**                    | §5.1             |
|   9 | Every draft claim has an opened source, an exact locator, scope, certainty, applicability, access limit | **PASS**                    | §6.1             |
|  10 | Every draft sentence is **entailed by** the claim it cites                                              | **FAIL**                    | **N-4**          |
|  11 | No claim exceeds what its cited locator supports                                                        | **FAIL**                    | **N-2**          |
|  12 | Absence is not converted into equivalence, ineffectiveness or a recommendation                          | **PASS**                    | §8.7, §6.3       |
|  13 | Absence and completeness statements do not rest on unopened records                                     | **FAIL**                    | **N-1**          |
|  14 | Draft provenance resolves                                                                               | **FAIL**                    | **N-3**          |
|  15 | Certainty moved only downward in re-derivation                                                          | **PASS**                    | §8.6             |
|  16 | No retracted source supports a claim; preprint and thesis status handled                                | **PASS**                    | §6.4             |
|  17 | Every R1 Critical and Important finding is closed                                                       | **PASS**                    | §3               |
|  18 | Contradictory evidence is recorded, not hidden                                                          | **PASS** (one gap: **N-2**) | §6.2, §7 N-2     |
|  19 | Reviewer wrote only its one permitted path                                                              | **PASS**                    | §1.2, §12        |

---

## 12. Verdict

**FAIL — 0 Critical, 4 Important, 13 Minor.**

All fourteen R1 Critical and Important findings are closed, and I verified each. The candidate's
reconciliation, cross-artifact closure, claim structure, traceability, retraction handling, absence
bounding and certainty discipline are all sound, and the G1016 retrieval that was the pivot of R1's
Critical finding is genuine and its attribute determination correct.

Acceptance requires zero unresolved Important findings. Four remain:

- **N-1** — a CC BY full text recorded as unobtainable, with two false completeness statements
  (`research/screening/…`, handoff Decision 3, fly draft Provenance).
- **N-2** — an unentailed direction on `claim-press-versus-fly-activation-mixed`.
- **N-3** — an unsatisfiable `claimSource@1.0.0` pin on all three drafts.
- **N-4** — unbounded universal absence wording at two places in the bench-press draft.

One bounded remediation and one complete-artifact recheck (`-r3`) is the prescribed path; §9 gives the
plan. Until that recheck passes, every file in `content-drafts/` remains unpublished and SBLA-011 must
not promote it.

Reviewed at commit `133151bab1f287f0b2096d0c251dba0268fb3455`, tree
`c181020b1bc34605e30b95259683f3bcbd4083f6`.
