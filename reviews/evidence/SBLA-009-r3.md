# Evidence review: SBLA-009 evidence pass and draft claims, round 3

**Task:** SBLA-010 — the complete citation-entailment and adversarial recheck of the SBLA-009
evidence pass, round 3 (master plan §18 queue row; §14 Phase 1 Task 1.2). This is the one
complete-artifact recheck that follows the one bounded remediation prescribed by
`reviews/evidence/SBLA-009-r2.md` §9.
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
remediate, or contribute to any SBLA-009 artifact, and I received none of the authoring role's
reasoning beyond the committed artifacts and the committed handoff (master plan §9.10).
**Review date:** 2026-09-15 (all network evidence timestamped below).
**Reviewer worktree:** `C:\src\s009review-r3`
**Reviewer branch:** `claude-review/SBLA-009-r3`
**Reviewer write path:** `reviews/evidence/SBLA-009-r3.md` — sole permitted path. No other file was
created, edited, staged, or committed. No artifact under review was repaired, reformatted, or
staged (AGENTS.md role table; CLAUDE.md "Never repairs the artifact under review"). All scratch
work was held outside the repository.

**Reviewed candidate commit:** `becc6682c6a23da9c1f78f61ffb980daf4055c1f` _(immutable)_
**Reviewed candidate tree:** `5f03345693e5ec9209f90fa771c9f837344084c7` _(immutable)_
**Remediation base commit:** `f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46`
**Coordination claim:** `51acdde248e385e272fef50ae821d097cc73dc50`
**Governing R2 report:** `reviews/evidence/SBLA-009-r2.md`, SHA-256
`3428d3feb9b58bb150ac4c93375d868cabc5dc3f5597e83e50503b30a47a12b5`, 844 lines, 79,040 bytes
**Governing R1 report:** `reviews/evidence/SBLA-009-r1.md`, SHA-256
`7c829be485846c7fa71a48637c4795978d003e8d2501c77ffcc31ef671f9f46e`, 1,116 lines, 102,678 bytes

---

## 0. Verdict

**FAIL — 0 Critical, 1 Important, 9 Minor.**

The acceptance rule in CLAUDE.md and AGENTS.md is strict: a candidate passes only with **zero
unresolved Critical and zero unresolved Important findings**. This candidate has one Important
finding, so it fails.

**This remediation is of high quality and the verdict should be read narrowly.** All four R2
Important findings (N-1 to N-4) are genuinely closed, and I verified each against the primary
sources rather than against the handoff. All fourteen R1 Critical and Important findings remain
closed. Eleven of the thirteen R2 Minor findings are fixed, and the two that are not are routed to
Codex for reasons I confirmed in the schema and gate source, not on the builder's word. Every
network observation I re-ran reproduced, most of them byte-for-byte and hash-for-hash. Both
reconciliation equations close from raw records at the new totals. No certainty or applicability
grade moved in either direction, and no ladder provenance was destroyed: across 1,956 records, **0
`verbatim` strings were altered in place** and **0 ladders shrank**.

The candidate fails on one ground, and it is a defect this remediation created:

1. **N5-1 (Important).** The remediation weakened
   `claim-bench-press-inclination-shifts-regional-activation`'s first qualifier — from "the
   sternocostal decrease is **the consistent finding**" to "**the more consistent** finding, **but it
   is not universal**", naming the newly added G1944 as the retrieved counter-example — and did not
   propagate the weakening. The same claim's own `plainLanguage` still reads "Raising the bench
   **reliably** takes work away from the lower chest", and the reader-facing bench-press draft still
   reads "that is **the consistent finding across the studies retrieved**" and "raising the bench
   **reliably** takes work away from the lower chest". Those sentences cite that claim's ID and are
   no longer entailed by it. This is the exact violation the claims file's own `draftingRule`
   defines, and the defect class R2 graded Important in N-4 (§7, N5-1).

Nothing in this finding overturns a scientific conclusion of the slice, and the fix is three
sentences in two files. §9 gives the bounded plan.

---

## 1. Provenance verification

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD
becc6682c6a23da9c1f78f61ffb980daf4055c1f
$ git rev-parse HEAD^{tree}
5f03345693e5ec9209f90fa771c9f837344084c7
$ git rev-parse --abbrev-ref HEAD
claude-review/SBLA-009-r3
$ git status --porcelain
(empty)
```

HEAD equals the assigned candidate commit and the assigned tree exactly. The worktree was clean at
review start, and every check below was run against that exact tree.

### 1.2 Exact-path claim, verified before writing

Verified at coordination commit `51acdde248e385e272fef50ae821d097cc73dc50` ("docs: open SBLA-010 R3
evidence review"), per CLAUDE.md step 2, read from the coordination worktree `C:\src\sciatlas` on
branch `codex/SBLA-007-review-coordination`:

```
$ git show 51acdde:docs/runbooks/current-work.md
```

| Field            | Recorded value                                  | Matches this session |
| ---------------- | ----------------------------------------------- | -------------------- |
| Task             | SBLA-010 complete citation-entailment review R3 | yes                  |
| Role             | Claude Review (account B)                       | yes                  |
| Branch           | `claude-review/SBLA-009-r3`                     | yes                  |
| Worktree         | `C:\src\s009review-r3`                          | yes                  |
| Base commit      | `becc6682c6a23da9c1f78f61ffb980daf4055c1f`      | yes                  |
| Started          | 2026-09-15 17:46 EDT                            | yes                  |
| Expected handoff | `reviews/evidence/SBLA-009-r3.md`               | yes                  |
| Paths owned      | `reviews/evidence/SBLA-009-r3.md`               | yes                  |

Every field matches, and exactly one path is claimed. The claim was recorded by Codex on my behalf,
as required — my role cannot write that ledger, and I did not edit it.
`reviews/evidence/SBLA-009-r3.md` did not exist at the candidate commit, so this report creates
rather than overwrites, preserving append-only history alongside `SBLA-009-r1.md` and
`SBLA-009-r2.md`.

### 1.3 Composition of the reviewed candidate

```
$ git diff --name-status f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46 becc668
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

10 files changed, 3379 insertions(+), 533 deletions(-)
```

Exactly the ten claimed scientific artifacts, all modifications, no additions and no deletions.
Nothing under `src/`, `scripts/`, `tests/`, `content/`, `docs/`, `reviews/`, `.github/`,
`research/searches/`, `research/questions/` or `graphify-out/` was touched. I independently
confirmed that `research/searches/SBLA-009-search-receipts.json` — the path the remediation states
it did not own — is byte-identical across the range (`git diff --stat f67b6df becc668 --
research/searches/` returns nothing).

Ancestry, confirming the candidate is the remediation of the exact reviewed R2 commit:

```
becc668  research: remediate SBLA-009 R2 evidence findings N-1..N-4
f67b6df  review: audit SBLA-009 evidence pass R2 — FAIL
133151b  review: audit SBLA-009 evidence pass R1
1dc1c41  merge: assemble SBLA-009 scientific review candidate
c18a107  review: SBLA-009 integrity gate R3 — PASS
```

### 1.4 The two prior reports are present and unaltered

Both immutable Account-B reports exist at the candidate commit and hash to exactly the values the
ledger and the handoff record:

```
$ git cat-file -p becc668:reviews/evidence/SBLA-009-r1.md | sha256sum
7c829be485846c7fa71a48637c4795978d003e8d2501c77ffcc31ef671f9f46e   1116 lines  102678 bytes
$ git cat-file -p becc668:reviews/evidence/SBLA-009-r2.md | sha256sum
3428d3feb9b58bb150ac4c93375d868cabc5dc3f5597e83e50503b30a47a12b5    844 lines   79040 bytes
```

Neither was edited by the remediation. I read both in full before opening any artifact.

---

## 2. Methods

**Runtime.** Pinned exactly. The host default Node is v24.14.0 and does **not** satisfy
`engines.node` (`>=24.20.0 <25`); I used the fnm-managed v24.20.0 throughout.

```
$ node --version              v24.20.0     (.node-version = 24.20.0)
$ corepack pnpm --version     11.24.0      (packageManager = pnpm@11.24.0)
$ pnpm install --frozen-lockfile           Done in 5.4s
```

**Network policy.** Every request was a lawful, unauthenticated public GET from Node 24.20.0's
default `fetch` with redirects followed. No credentials or cookies were supplied, no challenge was
solved, no user-agent was substituted to evade filtering, no paywall was circumvented and no shadow
library was used. Where a host refused an automated client I recorded the refusal and did not work
around it. No copyrighted full text is committed; every document retrieved was held outside the
repository in the session scratch directory.

**What I did.** I read the entire R1 and R2 reports, the whole R2 remediation section of the
handoff, the governance (CLAUDE.md, AGENTS.md, master plan §2.2, §9.5, §9.8, §18), and all ten
remediated artifacts. I re-derived every reconciliation figure from raw `records[]` rather than from
the `reconciliation` block. I retrieved and read three primary full texts end to end (G1944, G1903,
G1087), re-ran every suspect acquisition route, probed every recorded bot-challenge route, and
followed a stratified sample of primary identifiers to Europe PMC for entailment. I diffed the
claims file and the screening flow programmatically against the base commit to detect silent grade
movement, silent provenance loss and unpropagated edits. I ran the full pinned `pnpm verify` and
independent formatting and whitespace checks.

**What the integrity gate is worth here.** `pnpm validate:research` passes, and I treat that as
**bookkeeping evidence only** — it establishes internal structural consistency, never the truth of a
claim. Every scientific judgement below rests on a source I opened.

---

## 3. R1 closure matrix — all fourteen blocking findings remain closed

R1 returned 1 Critical, 13 Important and 10 Minor findings. R2 verified all fourteen blocking
findings closed. I re-verified each in this tree; none regressed.

### 3.1 Critical

| ID      | Verdict              | Evidence I used in this tree                                                                                                                                                                                                                                                                                                                                             |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **C-1** | **Closed, improved** | Recomputed from raw records: **673** acquisition attempts across **119** records; **0** records at `awaiting-full-text` or `included` carry an empty ladder; **0** included sources remain `metadata-only`. The recurrence R2 raised as N-1 (G1944) is now itself closed (§4.1). Both absence records are bound to retrieval, with **10** and **7** `boundedBy` entries. |

### 3.2 Important

| ID       | Verdict    | Evidence I used in this tree                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I-1**  | **Closed** | `git grep -c 'SBLA-009-evidence-packet' -- research content-drafts` → **0 hits**. Every `@` pin enumerates to 2.0.0 (§4.3). The case-sensitive cross-link validator passes inside full `pnpm verify`.                                                                                                                                                                                     |
| **I-2**  | **Closed** | DOI `10.3390/app13085203` is extracted as **G1903** and cited 3× in the claims file (claims 14 and 21, and absence record 1 `externalCorroboration`). I re-downloaded the exact PDF (3,358,506 bytes, SHA-256 `8ac15532…66cbb50d`) and read it in full; its PRISMA search names PubMed/MEDLINE, SPORTDiscus and Web of Science.                                                           |
| **I-3**  | **Closed** | `source-pmid-25713681` is linked to claim 21 with `role: qualifies`. Europe PMC returns the Results verbatim: "showed considerably higher activity in sequence A (100.13 ± 13.56%) than sequence B (81.47 ± 13.09%) for the chest fly." The claim qualifier reproduces both values and both SDs exactly.                                                                                  |
| **I-4**  | **Closed** | Receipts R-044 to R-050 are referenced across packet, synthesis and claims (5, 3, 7, 5, 8, 9 and 4 references respectively). Both chase bounds are disclosed, and R2 M-11's three omissions are now in `boundedBy`.                                                                                                                                                                       |
| **I-5**  | **Closed** | All four R1 locations remain corrected, and N-4's two further locations are now corrected too (§4.4). Residual universal wording survives only in non-reader-facing narration, recorded as R3-M-1 to R3-M-3.                                                                                                                                                                              |
| **I-6**  | **Closed** | `10.1590/s1517-86922007000100012` (G1896) is included — I re-fetched its SciELO PDF live (HTTP 200, 37,307 bytes, SHA-256 `4a4f7890…8fc7c3d5`, matching exactly). `10.12820/rbafs.v.19n3p342` (G1820) is excluded `E-EXP-7`. Non-English routes exist on R-046, R-047 and R-050.                                                                                                          |
| **I-7**  | **Closed** | "three small trials" appears 3× across claim and drafts; "two small trials" appears **0×**.                                                                                                                                                                                                                                                                                               |
| **I-8**  | **Closed** | `git grep -c -i 'eight further\|eight eligible'` → **0 hits**.                                                                                                                                                                                                                                                                                                                            |
| **I-9**  | **Closed** | "five randomly selected" appears 5× and "twenty-nine healthy" 1× across claims, drafts and synthesis.                                                                                                                                                                                                                                                                                     |
| **I-10** | **Closed** | "51 (SD 14) years" appears 3× and "69.3 (SD 11.8)" 4×. `claim-pectoralis-major-structural-variation` remains `moderate` / **`indirect`** — the lowered applicability R1 required — and it did not drift back (§6.4: zero grade movements in this remediation).                                                                                                                            |
| **I-11** | **Closed** | `claim-fly-machine-pectoralis-rupture` exists, is graded `very-low` / `indirect`, and is cited 3× by the fly draft. Verified live: PMID 35413736 Case history reads "This 33-year-old patient reported a sudden onset of left pectoral pain during training on the chest fly machine as well as a whip-like popping sound", in "a young patient with a normal habitus". Exact.            |
| **I-12** | **Closed** | The claim carries "16 per cent", "p = 0.027" and the ES 0.36 effect, with the non-normalisation qualifier. Access levels remain corrected: **43 `full-text-open` + 46 `abstract-only` = 89**, zero `metadata-only`.                                                                                                                                                                       |
| **I-13** | **Closed** | Stratum N-RS4a exists as R-044. `claim-bench-press-inclination-shifts-regional-activation` is re-derived: certainty `low`, direction `mixed`, **4 `contradicts` / 4 `qualifies` / 4 `supports`** links. I verified both R1-named contradicting sources live (§6.2). Contradiction rows C-10 and C-16 record the disagreement. See **N5-1** for a wording defect downstream of this claim. |

### 3.3 Minor

R2 dispositioned R1's ten Minors as 6 closed, 1 superseded, 1 routed, 1 addressed, 1 noted. I
re-confirmed the structural ones in this tree: `fieldContract.retrievalEventsDefault` still sums to
2,343 (R1 M-1); **0 of 89** extractions carry a null `language` (R1 M-4); G0127 and G0129 remain
`stage-3-full-record` (R1 M-5). R1 M-6 (`sourceSchemaFields.study` mapping) remains a
Codex/SBLA-011 item, still disclosed, carried forward here as **R3-M-8**.
---

## 4. R2 closure matrix — the four Important findings

I reproduced each finding independently before deciding closure, and read the primary sources rather
than relying on the handoff's account of them.

### 4.1 N-1 — a CC BY full text recorded as unobtainable · **CLOSED**

**Acquisition, independently reproduced.** From my own client, 2026-09-15, following redirects:

```
https://journal.iusca.org/index.php/Journal/article/download/39/124
  -> HTTP 200   689,102 bytes   application/pdf
     sha256 1a01086a81ffff228a766e4a9b2813467e349e8891f8651487f7c4d32f39831e
     body begins  %PDF-1.4 … /Linearized 1/L 689102/O 1495/E 124563/N 11
https://journal.iusca.org/index.php/Journal/article/view/39
  -> HTTP 200    34,509 bytes   text/html
     sha256 71075eb7c500ca32c6e4a832650fb0ff5c1d7b3a9e3d5b0439ee35a46202a3f9
```

Both the **byte count and the SHA-256 reproduce the assigned value exactly**, and the landing-page
hash reproduces the handoff's `71075eb7…6202a3f9`. The finding is independently confirmed rather
than taken on trust, and the acquisition is lawful.

**Root cause, independently confirmed.** The recorded 2026-09-13 result for this same URL was
`200 (23 bytes)`. My client, which follows redirects, receives the 689 KB PDF from that URL. A
redirect stub recorded as a terminal result by a client that did not follow redirects is the only
reading consistent with both observations, and it reproduces across the whole suspect class
(§4.1.2).

**The study, read in full.** Arseneault, Roy & Sercia (2021), _The Effect of 12 Variations of the
Bench Press Exercise on the EMG Activity of Three Heads of the Pectoralis Major_, Int J Strength
Cond, DOI `10.47206/ijsc.v1i1.39`, CC BY 4.0 (licence statement on every page). Thirteen healthy men
(age 31.1 ± 6.3 y, training experience 12.2 ± 6.0 y); twelve bench-press cells crossing three
inclinations (−15°, 0°, +30°) × two grip types (pronated, supinated) × two grip widths (100 % and
200 % biacromial); each cell loaded at that cell's own 12RM; surface EMG of the clavicular,
sternocostal and abdominal heads plus the triceps long head; three-factor repeated-measures ANOVA
with Bonferroni post hoc at α = 0.05.

**Inclusion and role, falsified and upheld.** I tested whether `role: contradicts` is right by
deriving the matched contrasts myself from the Results pairwise lists, before reading the
extraction's account of them. Notation: H = 0°, I = +30°, D = −15°; P/S = pronated/supinated;
C/W = close/wide.

- _Sternocostal, matched pronated grips._ The Results enumerate every significant pair. For wide
  pronated, HPW's significant set is {HSC, HSW, IPC, ISC, ISW, DPC, DSC, DSW} — it contains neither
  **IPW** nor **DPW**; IPW's set is {ISC} and DPW's is {ISC, ISW}, and neither names the other. For
  close pronated, HPC's set is {ISC} and contains neither IPC nor DPC. So **no matched pronated
  between-inclination sternocostal contrast is significant, at either width**. The Discussion says
  so directly, and the extraction quotes it **verbatim and exactly**: "the present study showed no
  significant difference in activation of the sternocostal head between the three inclinations in
  both close and wide pronated grips".
- _Clavicular, matched wide pronated grip._ IPW's significant set is {DSW} only and does not contain
  HPW. Practical Application point 1 states it as an author conclusion: "The incline bench press
  (+30°) with a wide pronated grip **does not recruit the clavicular head of pectoralis major more
  than the horizontal (0°) and declined (−15°) using the same grip**."

Both null statements are real, are the paper's own, and bear against the claim's sternocostal limb.
`role: contradicts` is correct. The alternative disposition — reading Table 3's apparent
incline-favours-clavicular pattern as support — is correctly refused, because that pattern is
carried by cells that also differ in grip type, grip width and absolute load. **The confound
argument is honest**, and I verified its factual basis: Table 1's twelve cells range from
57.1 ± 11.1 kg (incline / supinated / close) to 84.9 kg (horizontal and decline / pronated / wide),
and the Discussion reports "a strength difference of almost 18 kg between pronated and supinated
grips".

**Every quality note verified against the source.** I checked all seven and found no error:

| Extraction quality note                                             | Source text I read                                                                                                                                                                                  | Verdict |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Abstract contradicts Table 3 for the clavicular head                | Abstract: "wide pronation grip at 0° can maximize the activation of the three heads of the PM". Table 3, Clavicular row, **Positions with Minimum Activation**: "**HPW**, HSW, DPC, DPW, DSC, DSW". | exact   |
| Practical Application point 3 says a closer grip recruits it better | "a closer grip leads to a better recruitment" of the clavicular head in the horizontal bench press                                                                                                  | exact   |
| Inclination confounded with grip and load                           | Table 1 range 57.1 → 84.9 kg; Discussion "almost 18 kg"                                                                                                                                             | exact   |
| Analysed n ambiguous                                                | "Data were collected from 13 male subjects"; "One subject was, however, forced to leave the study for medical reasons"; the analysed n is never restated                                            | exact   |
| Normalisation reference ambiguous                                   | "normalized (in percentage) according to the highest EMG value obtained during the exercises **and/or** the maximum voluntary isometric contraction for each muscle, respectively"                  | exact   |
| Pairwise significance only, no effect estimates                     | Results enumerate position-versus-position pairs at a single alpha; the underlying values appear only in Figures 1–4                                                                                | exact   |
| sEMG is not hypertrophy evidence                                    | Practical Application points 6 and 7 offer bodybuilding programming advice from an acute measurement                                                                                                | exact   |

**Record corrections.** G1944 is now `included` / `stage-3-full-record` / `full-text-open` /
`open-access-or-repository` / `oa_status: diamond` / `cc by 4.0`, with `fullTextSource` set to the
URL I verified. The 2026-09-13 observations are preserved verbatim and the 2026-09-15 attempts are
appended, not substituted.

**Downstream.** Handoff Decision 3 is **struck in place** rather than rewritten: the original text is
retained and a marked correction withdraws the false sentence for G1944 while explicitly keeping the
decision for G1873, G1917 and G1941. The fly draft's Provenance paragraph is rewritten and states the
withdrawal. Claim 14 gained the G1944 link and **its first qualifier was weakened** — which is
correct, and which is also the origin of finding N5-1 (§7).

**Counts and certainty.** Excluded 1,842 → 1,843; awaiting-full-text 26 → 24; included 88 → 89;
extractions 88 → 89; packet `includedSourceIds` 88 → 89; packet exclusions 75 → 76;
contradiction-map rows 13 → 17. Claims and absence records unchanged at 23 and 5. Certainty movement:
**none** — claim 14 stays `low` / `mixed` and the added source entered as contradicting evidence.

#### 4.1.2 The five suspect 22–24-byte routes, all re-run by me

Every one reproduces the remediation's 2026-09-15 observation exactly, hash included:

| Record | Recorded 2026-09-13 | My observation 2026-09-15                                       | SHA-256 matches record  |
| ------ | ------------------- | --------------------------------------------------------------- | ----------------------- |
| G1944  | 200 (23 bytes)      | 200, **689,102** B, `application/pdf`                           | yes `1a01086a…2f39831e` |
| G1876  | 200 (24 bytes)      | 200, **1,183,736** B, `application/pdf` (PLOS ONE)              | yes `270c2ea7…4197e707` |
| G1896  | 200 (22 bytes)      | 200, **37,307** B, `application/pdf` (SciELO)                   | yes `4a4f7890…8fc7c3d5` |
| G1903  | 200 (24 bytes)      | 200, **3,358,506** B, `application/pdf` (UCAM)                  | yes `8ac15532…66cbb50d` |
| G1928  | 200 (24 bytes)      | 200, **2,171,116** B, `application/pdf;charset=UTF-8` (J-Stage) | yes `ad4f265e…3b30ebaf` |

Five of five. The root cause is systematic and correctly diagnosed. Four of the five cost nothing,
because those documents had already been obtained by another route; for G1944 it cost the source.

#### 4.1.3 The G1903 URL inversion, verified in both directions

```
https://repositorio.ucam.edu/bitstream/10952/9780/1/2023_Electromyographic%20activity%20of%20the%20pectoralis%20major.pdf
  -> HTTP 200  3,358,506 B  application/pdf
     sha256 8ac15532f5cf871ab6e5cb4f7384c1539f3347938a981976e1cff61066cbb50d
     (server redirects to …/bitstream/handle/…%20major.pdf;jsessionid=…?sequence=1, exactly as the note describes)
https://repositorio.ucam.edu/bitstream/handle/10952/9780/2023_Electromyographic%20activity%20of%20the%20pectoralis.pdf
  -> HTTP 404     10,885 B  text/html
```

Both reproduce exactly, including the recorded 404 byte count of 10,885 and the recorded redirect
behaviour. `fullTextSource` and the `ladder-outcome` URL are corrected to the working form; the
original truncated URL survives in `verbatim` with a note. Correct handling.

#### 4.1.4 The four access classes, tested rather than accepted

The review required that observed HTTP facts, metadata inference, bot-protection refusal and true
access control be told apart. I probed each recorded challenge route myself:

| Record               | Recorded                                 | My observation 2026-09-15                                                           |
| -------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| G1084 (TopSCHOLAR)   | 403 (5,690 B, `cf-mitigated: challenge`) | **403, 5,690 B**, `cf-mitigated: challenge`, `<title>Just a moment...</title>`      |
| G1084 control        | 200 (38,463 B)                           | **200, 38,463 B**, "International Journal of Exercise Science \| Vol 2 \| Iss 1"    |
| G1917 (SAGE via DOI) | 403 (5,583 B, `cf-mitigated: challenge`) | **403, 5,583 B**, `cf-mitigated: challenge`, "Just a moment..."                     |
| G1941 (Springer)     | 200 (3,038 B, "Client Challenge")        | **200, 3,038 B**, `<title>Client Challenge</title>`, via `idp.springer.com/transit` |
| G1944 DOAJ rung      | 403 (5,774 B), note says challenge       | **403, 5,562 B**, `cf-mitigated: challenge`, "Just a moment..."                     |

Four of the five reproduce byte-for-byte. The DOAJ body differs by 212 bytes from the recorded 5,774
— Cloudflare challenge bodies vary between requests — and the disposition is unaffected and correctly
recorded as a client refusal rather than an access-control decision. The control request on G1084 is
good discipline: it proves the host answers this client normally and isolates the refusal to the
delivery route.

The two records recorded as **true access control** are distinguished on observed evidence too:
G1003's deposited file returns a repository login form and offers only a request-a-copy workflow, and
G0968's aggregator states institutional authentication is required. Neither was attempted. G1873 is
recorded as **undetermined** (a bare 403 from a retired platform with no challenge marker) rather
than guessed, which is the honest disposition.

**I could not falsify the central distinction.** No record in this bundle now asserts that no lawful
full text exists on the strength of a challenge page or a metadata inference. Where an automated
client was refused, the record says an automated client was refused.

#### 4.1.5 The readiness leads: three correctly not promoted, one correctly promoted

| Record    | Terminal state in this tree            | My check                                                                                                                                                                     |
| --------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G1084** | `awaiting-full-text` / `metadata-only` | **Correctly not promoted.** The route serves a Cloudflare challenge to me too (403, 5,690 B). The earlier lead's "full text" was the interstitial. Nothing was incorporated. |
| **G0117** | `included` / `abstract-only`           | **Correctly not promoted** to `full-text-open`. Access level unchanged; only the `ladder-1` rung changed from an `is_oa=false` inference to an observed HTTP 200.            |
| **G0121** | `awaiting-full-text` / `abstract-only` | **Correctly not promoted.** Same treatment; the retrieved page is an Ovid/LWW article page carrying the abstract with the body behind a login.                               |
| **G1087** | `excluded` under `E-OUT-1`             | **Correctly promoted and correctly excluded** — see below.                                                                                                                   |

**G1087 identity, verified before content was attributed.** Crossref returned, to my client, 1,756
bytes of JSON: DOI `10.51224/sportrxiv.872`, type `posted-content`, title "Names of resistance
exercises", authors James L. Nuzzo and James Steele, posted 2026-05-26, licence
`creativecommons.org/licenses/by/4.0`, primary resource
`https://sportrxiv.org/index.php/server/preprint/view/872/version/1082`. Every field matches what the
handoff records, including the byte count. Only then did I download the galley: **293,800 bytes**,
SHA-256 `78a74ae1796debeb1e26086c51b2a5ea8a19a7f18ec968921f4a4336b73b299d` — matching exactly.

**G1087 exclusion, falsified and upheld.** I read it. Abstract: "A total of 1,849 individuals
completed an online survey; analyses were restricted to **1,425** respondents who passed attention
checks" — both figures exactly as recorded. Decisively, `grep -c -i pectoral` over the extracted text
returns **0**: the document does not contain the string "pectoral" anywhere. It reports no pectoralis
outcome of any kind, so `E-OUT-1` is correct and it narrows no absence record. I considered the
alternative the handoff itself invites — retaining a nomenclature source for the attribute/naming
work — and reject it: the frozen §3.2 attribute table is this project's own scoping instrument, not
an evidential claim this pass may source.

**The two recovered records moved in opposite directions** — one to `included`, one to `excluded` —
which is the signature of screening on substance rather than on retrievability.

### 4.2 N-2 — an unentailed direction · **CLOSED**

I obtained the exact PDF the candidate used (3,358,506 bytes, SHA-256 `8ac15532…66cbb50d`) and read
it, then tested every element of the fix against it.

**The direction is removed everywhere.** `git grep -i -E "favou?ring the (bench|press)"` over the
whole tree excluding `reviews/` returns hits only in the two places that **narrate the removal** —
handoff §N-2 and the packet `decisionLog`. No artifact asserts the direction. The claim now reads "a
significant sternal difference **between the bench press and its pooled comparator exercises** …
**and with the source contradicting itself about which exercise the sternal difference favours**."
Direction-free and accurate.

**The comparator/result direction, verified verbatim.** The Results text reads, twice, at the locator
the claim cites:

> "The analysis shows that there is no significant difference in the activation of the clavicular
> portion when comparing the PB with another exercise; however, there is a greater activation in the
> sternal pectoralis **in the variable exercise** (SMD = 4.04; 95% ICI 0 = 1.74; 6.35) (Figure 6)."

The greater sternal activation is in the comparator. The Abstract states the opposite ("When
comparing by type of exercise, greater activations are also seen in the original bench press vs. the
comparisons (p = 0.023 to 0.001)") and so does the Featured Application ("Focusing on other types of
exercises, BP is the one that most involves the pectoralis major"). All three quotations are exact.

**The contrast-family sign inversion, verified as a real mechanism.** This is the element I most
wanted to falsify, because a claimed "mechanism" is easy to invent. It holds:

- _Inclination family._ "The analysis shows that the BP variant with the inclined bench **activates
  less the sternal portion** (significantly) (SMD = 1.80; 95%CI 0.40 a 3.19; p = 0.017)." A positive
  SMD therefore favours the **horizontal bench press**.
- _Type-of-exercise family._ "there is a greater activation in the sternal pectoralis **in the
  variable exercise** (SMD = 4.04 …)". A positive SMD therefore favours the **comparator**.

The convention genuinely inverts between families, and carrying the first across to the second
produces exactly the error that was made. Recording it as C-14 and taking no direction from the
source is the safest available disposition, and it is the one consistent with the pass's own
uncertainty 9 and with row C-12.

**Both SMD 4.53 rows, disambiguated by full signature.** Verified in the source:

| Result                                        | Signature I read                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Table 3, Type of exercise, **Clavicular** row | `[50] 1,3, [58], [62]` · CI **−4.22; 13.27** · I² **94.9** · t **1.65** · p **0.198** |
| Figure 7, other exercises vs push-up          | "(SMD = 4.53; 95%CI = **4.40; 7.65**) (Figure 7)"                                     |

Two distinct results share the point estimate and are separated only by their confidence intervals,
exactly as C-15 states. The existing attribution of 4.53 to the clavicular type-of-exercise row is
correct. Every citation of 4.53 in the candidate now carries its CI. The sternal row also reproduces
exactly: CI **1.74; 6.35**, I² **98**, t **3.62**, p **0.001**.

**The decline internal contradiction, verified.** Table 3 and the Results prose report no decline
effect — "No differences were shown in the pectoral activation (clavicular or sternal portion) when
compared with the activation in the exercise performed without decline (Figure 3)" — while the
Abstract Conclusions assert the sternal portion "showed greater activation with the declined variant
of bench press" and the Featured Application asserts "the decrease in the clavicular portion should
be considered, as opposed to an increase in the sternal portion". Both quotations exact. C-12 records
it correctly.

**The database-count defect, verified.** Abstract: "an electronic search of **four databases** and
yielded 951 original publications". Methods: "database used were: **PUBMED/MEDLINE, SPORT DISCUS and
Web of Science** databases" — three. Appendix A reproduces exactly three search strings. The
three-database reading used by the extraction is the correct one, and the `designNote` states both.

**Consistency across layers.** Extraction `X-G1903` quality notes, synthesis rows C-11, C-12, C-14 and
C-15, packet `decisionLog`, the claim statement, the claim qualifiers and both drafts now agree. The
drafts never asserted the direction, so no draft repair was required and none is missing — I checked
both renderings (bench draft 167–168; fly draft 150–167) and they describe the pooled result only as
too heterogeneous to be precise.

### 4.3 N-3 — unsatisfiable draft version pins · **CLOSED**

All three drafts now declare `draftVersion: '2.0.0'` and
`claimSource: content-drafts/syntheses/SBLA-009-atomic-claims.json@2.0.0`.

**Complete pin sweep.** Every `<path>@<semver>` pin in the ten artifacts, enumerated:

```
8  content-drafts/syntheses/SBLA-009-atomic-claims.json@2.0.0
6  atomic-claims.json@2.0.0
4  research/packets/sbla-009-evidence-packet.json@2.0.0
3  research/syntheses/SBLA-009-synthesis.md@2.0.0
3  research/searches/SBLA-009-search-receipts.json@2.0.0
3  research/screening/SBLA-009-screening-flow.json@2.0.0
3  research/extractions/SBLA-009-source-extractions.json@2.0.0
3  research/appraisals/SBLA-009-appraisals.md@2.0.0
1  research/packets/sbla-009-evidence-packet.json@2.0.0 (bare filename form)
1  content-drafts/muscles/pectoralis-major.md@2.0.0
1  content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md@2.0.0
1  content-drafts/exercises/barbell-flat-bench-press.md@2.0.0
```

**Zero pins at any version other than 2.0.0.** The only surviving `1.0.0` strings in the bundle are
four `schemaContract` values (`SBLA-009-atomic-claims/1.0.0` and its three siblings), which version
the _shape contract_ rather than the artifact, and two historical mentions inside M-3 disposition
tables that narrate the correction. Neither class acts as current provenance, so neither is a residue
of N-3.

**The fly-safety claim resolves.** I confirmed the defect was real by recomputing against v1.0.0 as
committed at `8cee805`: `artifactVersion 1.0.0`, **22 claims**, and
`claim-fly-machine-pectoralis-rupture` **absent**. Against the now-pinned 2.0.0: 23 claims, the claim
present, all **71** claim-ID references in the three drafts resolve, and **28 of 28** distinct claim
and absence-record IDs are cited by at least one draft.

The bundle staying at artifact version 2.0.0 is the review's own prescription (N-3 asked for
`@2.0.0`, not a new version). The discriminator between the reviewed 2.0.0 tree and this remediated
2.0.0 tree is the `governingReview` block, which now names both rounds. I accept that disposition and
do not require a version bump; the handoff explicitly invited a contrary ruling and I decline to make
one, because a bump would invalidate the three pins the same finding just required.

### 4.4 N-4 — unbounded universal absence wording · **CLOSED at the reader-facing layer**

Both named bench-draft sentences are bound, in the fly draft's corrected form:

- Practical takeaway (lines 33–34): "Whether it builds more chest muscle than a cable fly is
  **unknown**: **these searches retrieved no study comparing them**".
- Comparison section (lines 148–158): "**These searches retrieved no study comparing this exercise
  with a bilateral standing cable fly at shoulder height for pectoralis major size**. That statement
  is bounded by what the searches reached. Forward citation chasing took at most the first 200 citing
  works per seed; the pre-specified title filter over the 3,479 chased works with metadata dropped
  2,638 of them unscreened; 80 further chased candidates returned no metadata at all; the non-English
  route inspected only the first 50 results of each of eight probes; and twenty-four records remain
  unread at `awaiting-full-text`, nine of which could bear on a press-versus-fly comparison. It is a
  statement about the retrieved literature, not a proof that no such study exists, and it is not
  evidence that the two exercises are equivalent."

The final clause also answers master plan §2.2's prohibition on treating "no significant difference"
as proof of equivalence.

**I searched for every universal or near-universal absence sentence, not only the two named.** The
sweep covered all ten artifacts with a broad pattern set (`nobody`, `no one has`, `never been`,
`remains unstudied`, `has not been studied/measured/compared`, `no such study`, `no study has`,
`absent from`, `has ever`). Classification of every hit:

| Class                                                 | Locations                                                                                                                 | Verdict            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Bound to retrieval                                    | bench draft 33–34, 149; claims absence records 1 and 2; synthesis §0 and §4                                               | correct            |
| Explicit disclaimer (negating universality)           | bench draft 158; fly draft 44, 259                                                                                        | correct            |
| Narration of a corrected sentence inside a change log | handoff 360, 804, 817–818; synthesis 488                                                                                  | acceptable         |
| **Surviving universal form**                          | **synthesis 195** ("It says nobody has measured it"); **synthesis 460** and **handoff 275** ("index Y remains unstudied") | **R3-M-1, R3-M-2** |
| Borderline near-universal                             | synthesis 190 ("close to absent from indexed research")                                                                   | **R3-M-3**         |

The four surviving instances are all in research-layer narration, none is reader-facing, none cites a
claim ID, and each is contradicted by its own document's properly bound headline (synthesis §0 reads
"no study of the index cable fly **was retrieved by any route this project ran**"). They are graded
Minor (§7) rather than as a reopening of N-4, whose two named locations are correctly fixed.

**Both absence records are bound to the required families.** Record 1 carries **10** `boundedBy`
entries and record 2 carries **7**, covering: the retrieval families (PubMed composite residual of
11,765 → 911 screened; CENTRAL not searched and why; SPORTDiscus and Web of Science not searched
directly), forward chasing (200-per-seed cap; 2,638 of 3,479 dropped by the title filter; 80 with no
OpenAlex metadata), R-046 truncation (first 50 of each of eight probes against a 6,372-hit pool),
access and translation limits (four challenge-refused routes; the non-English route sampled not
enumerated; 24 unread `awaiting-full-text`, nine of them bearing), and the date (2026-09-15). **A
sixth instance of the defect class outside the drafts was found and fixed by the remediation itself**
— synthesis §4 now reads "the gap is upstream of publication bias, at the point where **these routes
retrieved no such study, registered or published**".
---

## 5. The thirteen R2 Minor findings — exact status

I did not accept any disposition on the builder's word. For the three routed items I read the schema
and the gate source and decided independently whether the routing is structurally forced or a
work-around.

| ID       | Claimed                   | **My verdict**                             | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | ------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-1**  | Fixed                     | **Fixed, verified**                        | All five 22–24-byte routes re-run and recorded; I reproduced all five with matching hashes (§4.1.2). G1903's `fullTextSource` and `ladder-outcome` URL corrected; I reproduced both the working 200 and the 404 (§4.1.3). Across the whole 1,956-record file, **0 `verbatim` strings were altered** and **0 ladders shrank** (15 grew; 650 → 673 attempts).                                                                                                                                                             |
| **M-2**  | Fixed                     | **Fixed, verified**                        | Fly draft now reads "**Nine** records that could bear on this page remain at `awaiting-full-text` … out of **twenty-four** in total. **Five are fly-family** … **Four are bench-press records**". I enumerated the 24 AFT records: fly-family = G1022, G1003, G0968, G0964, G0996 (5); bench-press regional = G1084, G1873, G1917, G1941 (4). The draft's five descriptions match those five titles individually.                                                                                                       |
| **M-3**  | Fixed                     | **Fixed, verified**                        | Appraisal header now reads "Companions, all at version **2.0.0** except the evidence packet, which carries no version" — correct, and it discloses M-4 rather than glossing it. §0/§1 counts updated to 89 / 2,343 / 1,956 with the history stated.                                                                                                                                                                                                                                                                     |
| **M-4**  | Routed to Codex           | **Correctly routed — structurally forced** | I read `src/lib/content/schemas.ts:425`. `evidencePacketSchema` is `z.object({...}).strict()` over a closed 11-key set (`id, question, searchedAt, searches, includedSourceIds, exclusions, synthesis, decisionLog, reviewState, createdAt, updatedAt`) containing no `version`. `scripts/content/validate.mjs:20` maps `research/packets/` → `evidencePacket`, and `pnpm validate:content` reports exactly "1 records" — the packet. Adding `version` would fail validation. Not a work-around. Carried as **R3-M-5**. |
| **M-5**  | Routed to Codex           | **Correctly routed — structurally forced** | Same `.strict()` key set contains no `governingReview`. Handoff Decision 6 is correspondingly corrected to withdraw the false "each artifact" claim, and the remediation is recorded in the packet's `decisionLog`. Carried as **R3-M-6**.                                                                                                                                                                                                                                                                              |
| **M-6**  | Addressed; residue routed | **Correctly routed — structurally forced** | I read `scripts/evidence/research-integrity.mjs:550`: `if (!isRealIsoDate(attempt.attemptedAt))` raises `ACQUISITION_ATTEMPT_DATE_INVALID` for **every** attempt object, with no exemption for `result: 'not-performed'`. A null date is impossible without a Codex gate change. All **90** `ladder-5-author-request` steps are `not-performed`, all **90** carry `attemptedAt`, and all now carry the explanatory note. Carried as **R3-M-7**.                                                                         |
| **M-7**  | Fixed                     | **Fixed, verified**                        | G0228, G0267, G0470, G0536 and G0593 all now read `decidedAtStage: "stage-2-acquisition"`, agreeing with their own `acquisition.ladderNotRequiredReason` text ("excluded on substance at stage 2").                                                                                                                                                                                                                                                                                                                     |
| **M-8**  | Fixed                     | **Fixed, verified**                        | The awaiting-full-text register holds **166 ladder entries across 24 records, of which 0 are plain strings and 166 are structured attempt objects**. The register is now dated when read on its own.                                                                                                                                                                                                                                                                                                                    |
| **M-9**  | Fixed                     | **Fixed, verified**                        | Handoff line 397 now prints `node C:\src\s009integrity\scripts\evidence\research-integrity.mjs …`, with the correction marked in place at lines 401–402.                                                                                                                                                                                                                                                                                                                                                                |
| **M-10** | Fixed                     | **Fixed, verified**                        | Handoff now cites the recorded 2,305 bytes and adds the 2026-09-15 re-run (200, 2,296 B, `text/html`), matching the screening flow and extraction.                                                                                                                                                                                                                                                                                                                                                                      |
| **M-11** | Fixed                     | **Fixed, verified**                        | `absence-index-cable-fly-no-evidence.boundedBy` grew **5 → 10**, adding the three the review named plus two more (80 chased candidates with no OpenAlex metadata; four challenge-refused routes). Record 2 grew **2 → 7**.                                                                                                                                                                                                                                                                                              |
| **M-12** | Fixed                     | **Fixed, verified**                        | Decision 6 corrected; both rendered Markdown links to the Account-B reports resolve in this tree, and both target files exist at the candidate commit with matching hashes (§1.4).                                                                                                                                                                                                                                                                                                                                      |
| **M-13** | Fixed, extended           | **Fixed, verified**                        | Recorded as contradiction row C-15 together with the database-count defect and as extraction quality notes. I confirmed the underlying facts in the source: Table 3's stable-vs-unstable concentric row gives CI **−0.35; −0.03**, t −3.02, p 0.029, while the Abstract prints "SMD = −0.18; 95%CI −0.33 to 3.74; p = 0.029". No claim uses the stability contrast, correctly.                                                                                                                                          |

**Are the three residues genuinely nonblocking?** Yes, and for a reason stronger than
classification. Each is a field a Codex-owned artefact refuses to accept: two would fail
`pnpm validate:content` if written, and one would fail `pnpm validate:research`. An Account-A role
cannot fix them inside an owned path, and the missing information is recorded in a field that does
validate (`synthesis`, `decisionLog`, and a per-step `note` on all 90 rungs respectively). None
touches a claim, a certainty grade, an absence bound, a source attribution or a reader-facing
sentence. They are nonblocking under the repository's rules, they have a named destination, and they
are preserved as R3-M-5 to R3-M-7 so PASS at a later round cannot silently absorb them.

---

## 6. Raw reconciliation, referential integrity and the claim/source audit

### 6.1 Recomputed from raw `records[]`, not from the `reconciliation` block

```
records[].length                                  = 1956
terminalState tally  : excluded 1843 | included 89 | awaiting-full-text 24
sum(retrievalEvents ?? 1) over all records        = 2343
equation one : 1956 = 1843 + 24 + 89              CLOSES
equation two : 2343 =  387 + 1956                 CLOSES
sum of exclusionCodeCounts                        = 1843   equals the excluded total
receipts carrying recordsRetrievedIntoScreening   = 48 of 51, summing to 2343
```

Both equations close at the new totals. The receipt-sum invariant holds: 48 of the 51 receipts carry
`recordsRetrievedIntoScreening` and sum to exactly 2,343; the three that do not (R-001, R-002, R-003)
are route-level count rows that credit no records into screening, exactly as the handoff states.
`research/searches/SBLA-009-search-receipts.json` is unmodified across the range.

Cross-artifact closure, recomputed independently:

```
screening included (89)        -> extractions (89)               : 0 missing, 0 extra
screening AFT (24)             -> awaitingFullText register (24) : 0 mismatched
packet includedSourceIds (89)  -> extraction proposedSourceIds   : 0 missing, 0 extra
packet exclusions                                                : 76
claim sourceLinks                                                : 92, 0 unresolved
claim recordIds not in the included set                          : 0
claims where sourceLinks count != recordIds count                : 0
claims missing certainty or applicability                        : 0
claims with an empty locator on any source link                  : 0
claims with no supporting/qualifying/contradicting source        : 0
claims with no scope                                             : 0
included sources at metadata-only                                : 0
extractions with null language                                   : 0
records with an empty ladder where one is required               : 0
draft claim-ID references                                        : 71, 0 unresolved
distinct claim/absence IDs cited by at least one draft           : 28 of 28
```

Distributions over the 89 included sources: access `full-text-open` 43 / `abstract-only` 46 /
`metadata-only` **0**; publication stage `peer-reviewed` 85 / `other-non-peer-reviewed` 3 /
`preprint` 1; publication status `current` 88 / `corrected` 1.

### 6.2 Semantic entailment — the sources I followed to the primary literature

Eleven of the 92 source links were tested against the primary text rather than against the
extraction. Three full texts were read end to end; eight abstracts were retrieved live from Europe
PMC. Every one entailed its locator.

| Source                     | Claim / role                | What the primary text says                                                                                                                                                                                                                                         | Verdict |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| **G1944** (full text read) | claim 14 · contradicts      | Discussion and Practical Application points 1–2 carry both null statements verbatim; Table 3 and Table 1 as cited (§4.1)                                                                                                                                           | exact   |
| **G1903** (full text read) | claims 14, 21 · qualifies   | Every number in both locators reproduces, including t-statistics and both 4.53 signatures (§4.2)                                                                                                                                                                   | exact   |
| **G1087** (full text read) | excluded `E-OUT-1`          | 1,849 / 1,425 exact; zero occurrences of "pectoral" (§4.1.5)                                                                                                                                                                                                       | exact   |
| PMID 33049982              | claim 14 · contradicts      | "maximal EMG activity for PMUP occurred at a bench inclination of 30°"; "PMMP and PMLP showed higher EMG activity at a 0° bench inclination"; "Inclinations greater than 45° … decrease the muscular performance of the pectoralis major"; "Thirty trained adults" | exact   |
| PMID 25799093              | claim 14 · contradicts      | "The sEMG of upper pectoralis displayed no difference during any of the bench conditions when examining the complete concentric contraction, however differences during 26-50% contraction duration were found"                                                    | exact   |
| PMID 20512064              | claims 9, 14 · supports     | Clavicular greater at 44 vs 0 (p = 0.010) and 56 vs 0 (p = 0.013), with **no** 44-vs-56 contrast listed; sternocostal greater at 44 than 56 (p = 0.001)                                                                                                            | exact   |
| PMID 32922646              | claim 14 · supports         | "second intercostal space … greatest in the incline pressure group compared with the horizontal [mean difference (95% CI) of 0.62 (0.23, 1.0) cm, p=0.003]"; "differed only in one of the three sites"                                                             | exact   |
| PMID 28713459              | claims 14, 15 · contradicts | "Non-significant differences in activation were observed between the three bench positions"; and across three grip widths, in twelve national/international competitors                                                                                            | exact   |
| PMID 25713681              | claim 21 · qualifies        | "higher activity in sequence A (100.13 ± 13.56%) than sequence B (81.47 ± 13.09%) for the chest fly"                                                                                                                                                               | exact   |
| PMID 35413736              | claim 23 · supports         | 33-year-old, normal habitus, chest fly machine, whip-like popping sound                                                                                                                                                                                            | exact   |
| PMID 38240811              | claim 19 · supports         | "Eighty-one (81) active participants"; "resistance training trained 3 days per week, 5 × 12 repetitions"; "no difference between both intervention groups … (p = 0.905-0.983)"                                                                                     | exact   |

Two structural properties of the whole link set also check out: **11 of 92** links carry
`role: contradicts` and **26** carry `role: qualifies`, so contradictory evidence is recorded
throughout rather than only where a reviewer forced it; and the one included preprint (G0798) and the
one source with `status: corrected` (G0521) are each cited by **zero** claims.

### 6.3 Absence records

All five were audited. Records 1 and 2 are bound as described in §4.4. Records 3, 4 and 5
(`absence-contralateral-sensitivity-analysis-empty`, `absence-terminologia-anatomica-anchor`,
`absence-architectural-parameters`) carry no `boundedBy` array — correctly, because none of them is a
retrieval-bounded absence: the first is a pre-specified sensitivity analysis that returned no eligible
records, and the other two are the recorded non-existence of a specific ontology anchor and of a
specific parameter set in the included evidence, each scoped in its own statement. That reading is
unchanged from R1 and R2 and I found no reason to disturb it.

### 6.4 No silent movement — programmatic diff against the base commit

I diffed the claims file and the screening flow object-by-object against `f67b6df`:

```
claims 23 -> 23     absence records 5 -> 5     new claims: none     removed claims: none
certainty grade changes                : 0   (none raised, none lowered)
applicability grade changes            : 0
direction changes                      : 0
sourceLinks count changes              : 1   (claim 14: 11 -> 12, the G1944 link)
claims with changed statement          : 1   (claim 21, the N-2 fix)
claims with changed qualifiers         : 2   (claim 14: 8 -> 9; claim 21: 8 -> 9)
absence records with changed statement : 1   (record 2, adding the R2 remediation round)
absence records with changed boundedBy : 2   (record 1: 5 -> 10; record 2: 2 -> 7)

screening flow, 1956 records both sides
records removed                        : 0
terminalState changes                  : 2   (G1087 AFT -> excluded; G1944 AFT -> included)
ladders that shrank                    : 0
ladders that grew                      : 15
verbatim strings altered in place      : 0
```

This is the strongest single piece of evidence in the review. **No grade moved in either direction, no
record vanished, no original observation was overwritten, and exactly the two claimed records changed
state.** It also bounds the propagation surface to four texts, which is how I found N5-1: of the four,
three were propagated to their drafts and one was not.

---

## 7. New findings

Every finding states its exact location, the evidence, the impact and the remediation destination.
**I did not repair any artifact.**

### IMPORTANT

#### N5-1 — A claim was weakened and its own plain-language rendering and its draft were not

**Locations:** `content-drafts/syntheses/SBLA-009-atomic-claims.json:720` (`plainLanguage` of
`claim-bench-press-inclination-shifts-regional-activation`);
`content-drafts/exercises/barbell-flat-bench-press.md:86–88` and `:100–101`.

**Evidence.** This remediation weakened the claim's first qualifier. Before (`f67b6df`):

> "The two portions behave differently and must not be described with one sentence. **The
> sternocostal decrease is the consistent finding**; the clavicular response is not consistent across
> studies."

After (`becc668`):

> "The two portions behave differently and must not be described with one sentence. **The
> sternocostal decrease is the more consistent finding, but it is not universal: a twelve-variation
> study of the bench press reports no significant sternocostal difference across -15, 0 and +30
> degrees within matched pronated grips**, and no clavicular advantage for the incline at a matched
> wide pronated grip. The clavicular response is not consistent across studies."

The claim's own `remediationLog` records the change as "the first qualifier was weakened from a
consistent sternocostal decrease to a more consistent one with a named exception. This is a downward
move." The weakening is correct — I verified the exception in the source (§4.1).

Three sentences still assert the pre-weakening strength, and all of them resolve to this claim:

1. `atomic-claims.json:720`, inside the **same claim object**, `plainLanguage`:
   > "Raising the bench **reliably** takes work away from the lower chest."
   > The claim now contradicts itself: qualifier 1 says the decrease "is not universal" and names a
   > retrieved counter-example; `plainLanguage` says it is reliable.
2. `barbell-flat-bench-press.md:86–88`, citing `[claim-bench-press-inclination-shifts-regional-activation]`:
   > "As the bench is raised, sternocostal (lower) activation falls — that is **the consistent
   > finding across the studies retrieved** and across a 2023 meta-analysis."
   > This is verbatim the phrase the claim abandoned, plus a universal quantifier over the retrieved
   > set. It is false in that form: among the studies retrieved, G1944 reports no significant
   > sternocostal difference across three inclinations, and PMID 28713459 reports no significant
   > pectoralis activation difference between flat, inclined and declined positions at all.
3. `barbell-flat-bench-press.md:100–101`, citing the same claim:
   > "So the useful reading is that raising the bench **reliably** takes work away from the lower
   > chest."

**This was introduced by this remediation.** Before it, the claim said "the consistent finding" and
the draft said "the consistent finding" — they agreed. `git diff f67b6df becc668 --
content-drafts/exercises/barbell-flat-bench-press.md` shows the draft's entire "Bench angle" section
(lines 85–110) was **not touched**; only the two frontmatter lines and the two N-4 sentences changed.
The mismatch is a side effect of fixing N-1 correctly and not carrying the fix downstream.

**No draft mentions the counter-example at all.** `git grep -i "twelve-variation\|twelve variations\|12
variations\|matched pronated\|Arseneault" -- content-drafts` returns hits only inside the claims
file. A reader of the bench-press page is told the sternocostal decrease is "the consistent finding
across the studies retrieved" with no indication that a retrieved study found no significant
difference.

**Why this is Important and not Minor.**

- It violates the claims file's own governing rule, quoted verbatim: "Mechanical traceability is
  necessary and not sufficient: **a draft sentence must be entailed by the claim whose ID it cites,
  not merely adjacent to it.** R1 finding I-11 was a sentence that resolved to a real claim ID whose
  claim said something else." These three sentences are that rule's counter-example.
- It is **reader-facing**, in the substantive answer to the bench-press page's main mechanics
  question, and it is a certainty overstatement. Master plan §9.5 permits "may", "suggests",
  "limited evidence indicates" at `low` certainty and reserves the declarative register for `high`;
  this claim is `low` with `direction: mixed`, and "reliably" / "the consistent finding" is the
  `high` register.
- It is a **downstream layer contradicting an upstream one**, which master plan §9.8 forbids — the
  same structural defect R2 graded Important in N-2, and the same reader-facing-wording defect it
  graded Important in N-4.
- The project's own grading practice supports it: R2 graded a wrong record count in a draft
  Provenance paragraph (M-2) as Minor, and a draft sentence not entailed by its cited claim (N-4) as
  Important. This is the second kind.

**What I checked and did not find.** The other three changed texts were propagated correctly. Claim
21's direction removal needed no draft change, because neither draft ever asserted the direction — I
read both renderings and they describe the pooled result only as too heterogeneous to be precise.
Both absence-record changes were propagated into the bench and fly drafts in full. The muscles draft
contains no parallel inclination sentence. So the defect is confined to exactly the three sentences
above.

**Remediation destination.** Claude Research — `content-drafts/syntheses/SBLA-009-atomic-claims.json`
(`plainLanguage` of that claim) and `content-drafts/exercises/barbell-flat-bench-press.md` lines 86–88
and 100–101.

### MINOR — nonblocking, with impact and destination recorded

| ID         | Finding                                                                                                                                                                                                                                                                                                                                                   | Impact                                                                                                                                                                                                                                             | Destination                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **R3-M-1** | `research/syntheses/SBLA-009-synthesis.md:195` still carries a bare universal: "Nothing here says the two exercises produce the same hypertrophy. **It says nobody has measured it.**" This is the same construction the remediation itself found and fixed in §4 of the same file ("nobody has run the study" → "these routes retrieved no such study"). | Not reader-facing, cites no claim ID, and is contradicted by the same document's §0, which is correctly bound to "any route this project ran". The §2.1 table above it is a list of this project's own strata.                                     | Claude Research — synthesis §2.1, using the §4 corrected form.         |
| **R3-M-2** | Two further universal forms: `research/syntheses/SBLA-009-synthesis.md:460` and `research/packets/SBLA-009-handoff.md:275` both say "index Y **remains unstudied**" inside R1 change-log narration.                                                                                                                                                       | Narration only; the authoritative absence records are correctly bounded. Same class as R3-M-1.                                                                                                                                                     | Claude Research — synthesis §8 row C-1 and handoff Decision narrative. |
| **R3-M-3** | `research/syntheses/SBLA-009-synthesis.md:190`: "the index exercise is common in gyms and **close to absent from indexed research**." Hedged by "close to" but scoped to indexed research generally rather than to the routes run.                                                                                                                        | Borderline. Recorded so it is not re-raised as a discovery, and so a future editor binds it if the sentence is reused.                                                                                                                             | Claude Research — synthesis §2.1.                                      |
| **R3-M-4** | `absence-index-cable-fly-no-evidence.statement` bounds itself to "any route run in this pass or in its R1 remediation", while the parallel `absence-primary-comparison-no-evidence.statement` was updated to add "**or in its SBLA-010 R2 remediation**". The two records now enumerate different round sets.                                             | **None substantively.** The R2 remediation ran no search and added no retrieval event, so record 1's statement remains literally true, and its `boundedBy` [4] does disclose the 2026-09-15 work. Cosmetic asymmetry between two parallel records. | Claude Research — absence record 1 statement.                          |
| **R3-M-5** | Packet declares no `version` field while four artifacts pin it at `@2.0.0`. **Carried forward from R2 M-4.**                                                                                                                                                                                                                                              | Unverifiable pin. Structurally forced: `evidencePacketSchema` is `.strict()` and owns no such key (§5).                                                                                                                                            | **Codex** — `src/lib/content/schemas.ts`.                              |
| **R3-M-6** | Packet carries no `governingReview` block while the other four structured artifacts do. **Carried forward from R2 M-5.**                                                                                                                                                                                                                                  | Documentation only; recorded in `decisionLog` instead, and handoff Decision 6 is corrected. Structurally forced by the same `.strict()` schema.                                                                                                    | **Codex** — `src/lib/content/schemas.ts`.                              |
| **R3-M-7** | All 90 `ladder-5-author-request` steps carry `result: not-performed` together with an `attemptedAt` date. **Carried forward from R2 M-6.**                                                                                                                                                                                                                | Internal contradiction in a gate-required field, now explained in all 90 notes. Structurally forced: `research-integrity.mjs:550` requires a real ISO date on every attempt.                                                                       | **Codex** — `scripts/evidence/research-integrity.mjs`.                 |
| **R3-M-8** | `sourceSchemaFields.study` remains an empty object; population, sample size, duration, intervention, comparator and outcomes live elsewhere. **Carried forward from R1 M-6 / R2 M-6.**                                                                                                                                                                    | Disclosed as L-A3. An SBLA-011 promotion concern, not an evidence concern.                                                                                                                                                                         | **Codex / SBLA-011.**                                                  |
| **R3-M-9** | G1944 was obtained, screened, extracted and graded by the same role in the same session, with no independent second screener. The handoff discloses this plainly as its limitation 4.                                                                                                                                                                     | Single-reader inclusion judgement. I independently read the full text and reached the same eligibility and `contradicts` disposition (§4.1), which substantially mitigates it, but it is not the same as a second screener at screening time.      | Recorded for the SBLA-011 promotion record; no action required now.    |

---

## 8. Falsification attempts that failed — verified correct

Recorded so they are not re-litigated. Each is something I actively tried to break and could not.

1. **The headline absence survives.** No retrieved record studies the index condition, and every
   absence statement in every reader-facing location is bound to retrieval with its limits
   enumerated. The two records recovered in this remediation are a bench-press EMG study and an
   exercise-naming survey; neither is a cable fly, and the naming survey contains no occurrence of
   "pectoral".
2. **G1944 does not rescue the claim it joined.** I hoped to find that the remediation had graded a
   supporting source as contradicting in order to look conservative. The opposite is true: the
   paper's own Discussion and Practical Application carry two explicit null statements that bear
   against the claim, and the apparent supporting pattern in its Table 3 is confounded by grip and
   load exactly as the extraction says.
3. **The sign-inversion mechanism is real, not a rationalisation.** Both halves are verbatim in the
   source and point in opposite directions for the same positive SMD sign.
4. **The SMD 4.53 attribution is correct.** Two distinct results share the point estimate; the
   candidate attributes it to the right one and now carries the CI that distinguishes them.
5. **No provenance was destroyed to make the corrections fit.** 0 of 1,956 records lost a ladder
   entry; 0 `verbatim` strings were altered; the failed URLs and the original byte counts survive
   alongside the corrections.
6. **No grade drifted upward.** Zero certainty and zero applicability changes in either direction
   across all 23 claims. The one claim that gained a source gained a contradicting one and lost
   assertion strength in its qualifier.
7. **The three routed Minors are not work-arounds.** I read the schema and the gate and confirmed
   that both fields would fail validation if written from an owned path.
8. **The reconciliation was not smoothed.** Both equations, the exclusion-code sum and the receipt
   sum all close from raw records, and the search receipts file — which would be the easy place to
   adjust a total — is byte-identical to the base commit.
9. **G0117 and G0121 were not quietly promoted** on the strength of an abstract page, and G1084 was
   not promoted on the strength of a Cloudflare interstitial. I reproduced the interstitial.
10. **The R1 closures did not regress.** All fourteen hold, including the numeric ones R1 had to
    force (I-7 through I-10) and the lowered applicability on
    `claim-pectoralis-major-structural-variation`.

---

## 9. Bounded remediation plan

One bounded Claude Research remediation, confined to two files and three sentences. Nothing else in
the candidate needs to change, and no artifact should be reopened for any other reason.

**Blocking (must be fixed for PASS):**

1. **N5-1.** Bring three sentences into line with the qualifier the remediation itself weakened.
   - `content-drafts/syntheses/SBLA-009-atomic-claims.json:720` — `plainLanguage` of
     `claim-bench-press-inclination-shifts-regional-activation`: replace "Raising the bench
     **reliably** takes work away from the lower chest" with a `low`-certainty form that matches
     qualifier 1 (for example, "Raising the bench usually takes work away from the lower chest,
     though not in every study that measured it").
   - `content-drafts/exercises/barbell-flat-bench-press.md:86–88` — replace "that is the consistent
     finding across the studies retrieved and across a 2023 meta-analysis" with the claim's own
     current form: the more consistent of the two portions' findings, not universal, with the
     twelve-variation study's null named as the retrieved exception.
   - `content-drafts/exercises/barbell-flat-bench-press.md:100–101` — replace "raising the bench
     **reliably** takes work away from the lower chest" with the same softened register.
   - While there, consider adding one sentence naming the twelve-variation study's null to the
     "Bench angle" section, so the page's evidence base matches the claim's. That is a suggestion,
     not a requirement; the requirement is only that the three sentences be entailed by the claim
     they cite.

**Nonblocking, recorded with destinations (must be preserved, not silently absorbed):** R3-M-1 to
R3-M-4 to Claude Research; R3-M-5 to R3-M-8 to Codex; R3-M-9 recorded for the SBLA-011 promotion
record.

**What must not happen.** No new literature search, no re-derivation of any other claim, no version
bump (it would invalidate the three pins N-3 just required), no change to any certainty or
applicability grade, and no edit to any of the other eight artifacts. The fix must move wording
downward in strength only.

---

## 10. Tests, gates and formatting

### 10.1 Full pinned `pnpm verify` — exit 0

Run from this worktree at the candidate commit with Node v24.20.0 and pnpm 11.24.0.

| Stage               | Result                                                            |
| ------------------- | ----------------------------------------------------------------- |
| `format:check`      | pass — "All matched files use Prettier code style!"               |
| `lint`              | pass — eslint `--max-warnings 0`, no output                       |
| `typecheck`         | pass — `astro check`, 57 files, 0 errors / 0 warnings / 0 hints   |
| `test`              | pass — **17 test files, 249 tests**                               |
| `validate:content`  | pass — "Content validation passed: 1 records."                    |
| `validate:graph`    | pass — 0 nodes; graph generation remains SBLA-011                 |
| `validate:research` | pass — "Research integrity passed: 1 complete bundle (SBLA-009)." |
| `evidence:status`   | pass — 0 sources checked as of 2026-09-15                         |
| `build`             | pass — completed in 343 ms                                        |
| `test:portability`  | pass — **3 test files, 17 tests**                                 |
| `verify:foundation` | pass — "Foundation contract passed at C:\src\s009review-r3\"      |
| `assets:spike`      | pass — 4 candidates; 1 eligible, 2 ineligible                     |
| `assets:decision`   | pass — owner-approved 2D-authoritative hybrid                     |
| **Exit code**       | **0**                                                             |

Test counts match the handoff exactly (249 unit, 17 portability). The integrity gate result is used
here as **bookkeeping evidence only**.

### 10.2 Formatting and whitespace on the artifacts under review

```
$ npx prettier --check <the ten artifacts>
All matched files use Prettier code style!
$ git diff --check f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46 becc668
(no output)
```

Trailing whitespace: 0 occurrences across all ten paths. Every file ends with a newline. Line endings
follow the repository's existing convention, matching the three committed review reports.

### 10.3 Role-path boundary — what I can and cannot attest

`git diff --name-status` from this worktree shows exactly the ten claimed paths (§1.3). Per CLAUDE.md
that is **corroborating, not independent, boundary evidence**, because it was produced from a role
worktree rather than by `scripts/evidence/check-role-paths.mjs` executed from a trusted checkout with
`--repository`. I did not run that checker and **no claim is made that it passed**. Codex or CI must
produce that result for both the candidate and this report. The same caveat applies to my own report:
the single-path proof in §12 is a role-worktree observation.

---

## 11. Reviewer limitations

Stated plainly, because a reviewer who overstates coverage commits the same defect as an author who
does.

1. **Point-in-time, single-client network evidence.** Every observation is one client on one day
   (2026-09-15). Publisher behaviour varies by client, geography and hour. Where it mattered I relied
   on SHA-256 rather than status codes, and every hash reproduced.
2. **I did not read all 89 included full texts.** I read three end to end and verified eight further
   sources against live abstracts, chosen to cover the two re-derived claims, both R1-named
   contradicting sources, the newly added source, the newly excluded source, and the claims R1 forced
   numeric corrections on. The remaining sources were audited structurally, not semantically.
3. **The 24 awaiting-full-text records remain unread by me as well.** Nine bear on the drafts' own
   subject matter. Every absence statement in the candidate is bounded by them, and so is this
   review.
4. **Four routes refused my automated client too**, so I cannot say whether those four texts are
   lawfully readable. I did not attempt to solve any challenge.
5. **G1944's and G1903's figures were not digitised.** For G1944 I derived the matched contrasts from
   the enumerated pairwise significance lists and the Discussion, not from Figures 1–4. For G1903,
   `pdftotext -layout` garbles Table 3's column alignment; I read the clavicular type-of-exercise
   signature directly and confirmed every other value against the Results prose, which is how the
   candidate says it did it too.
6. **I ran no new literature search.** Recall is unchanged from the reviewed pass and is bounded
   exactly as the absence records state. I did not attempt to find a study of the index cable fly by
   a route the project has not run.
7. **The role-path checker was not run from a trusted checkout** (§10.3).
8. **Severity grading is a judgement.** I have given my reasoning for N5-1 explicitly against the
   repository's own drafting rule, master plan §9.5 and §9.8, and the project's established grading
   practice, so that the owner can overrule it on stated grounds rather than on impression.

---

## 12. Criterion-by-criterion matrix

| #   | Acceptance criterion                                                     | Result   | Evidence                                                            |
| --- | ------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------- |
| 1   | HEAD, tree, branch and clean status match the assignment                 | **PASS** | §1.1                                                                |
| 2   | Exact one-path coordination claim verified before writing                | **PASS** | §1.2, coordination commit `51acdde`                                 |
| 3   | Candidate changes exactly the ten claimed artifacts                      | **PASS** | §1.3                                                                |
| 4   | R1 Critical closed and still closed                                      | **PASS** | §3.1                                                                |
| 5   | All 13 R1 Important closed and still closed                              | **PASS** | §3.2                                                                |
| 6   | R2 N-1 closed, with independent acquisition and full-text audit          | **PASS** | §4.1                                                                |
| 7   | R2 N-2 closed, tested against the primary text                           | **PASS** | §4.2                                                                |
| 8   | R2 N-3 closed, no stale pin acting as current provenance                 | **PASS** | §4.3                                                                |
| 9   | R2 N-4 closed at both named reader-facing locations                      | **PASS** | §4.4                                                                |
| 10  | All 13 R2 Minors dispositioned; routed ones verified structurally forced | **PASS** | §5                                                                  |
| 11  | Reconciliation closes from raw records                                   | **PASS** | §6.1 — 1,956 = 1,843 + 24 + 89; 2,343 = 387 + 1,956                 |
| 12  | Referential integrity across all artifacts, claims and drafts            | **PASS** | §6.1 — 0 unresolved of 92 links and 71 draft references             |
| 13  | Claim/source semantic entailment on the sampled set                      | **PASS** | §6.2 — 11 of 11 exact                                               |
| 14  | Absence records bound to retrieval, chasing, truncation, access and date | **PASS** | §4.4, §6.3                                                          |
| 15  | Contradictory evidence recorded, not suppressed                          | **PASS** | §6.2 — 11 `contradicts` links; 17 contradiction-map rows            |
| 16  | Correction, retraction and preprint status handled                       | **PASS** | §6.1 — 1 preprint and 1 corrected source, each cited by zero claims |
| 17  | No certainty or applicability grade raised                               | **PASS** | §6.4 — zero movements in either direction                           |
| 18  | No provenance destroyed by the remediation                               | **PASS** | §6.4 — 0 ladders shrank, 0 `verbatim` strings altered               |
| 19  | Access classes distinguished on observed evidence                        | **PASS** | §4.1.4                                                              |
| 20  | Full pinned `pnpm verify` green                                          | **PASS** | §10.1 — exit 0, 249 + 17 tests                                      |
| 21  | Formatting and whitespace clean on the artifacts under review            | **PASS** | §10.2                                                               |
| 22  | **Every reader-facing sentence entailed by the claim whose ID it cites** | **FAIL** | §7, N5-1 — three sentences assert the pre-weakening strength        |
| 23  | Zero unresolved Critical and zero unresolved Important                   | **FAIL** | One Important (N5-1)                                                |

---

## 13. Verdict

**FAIL.**

- **Critical: 0.**
- **Important: 1** — N5-1, unresolved.
- **Minor: 9** — R3-M-1 to R3-M-9, all nonblocking, each with impact and destination recorded. Four
  of them (R3-M-5 to R3-M-8) are carried forward from earlier rounds and remain owned by Codex.

Twenty-one of the twenty-three acceptance criteria pass. All fourteen R1 Critical and Important
findings remain closed. All four R2 Important findings are closed, and I verified each against the
primary literature rather than against the handoff: I re-downloaded G1944 and reproduced its SHA-256
exactly, read it in full and confirmed both of its null statements verbatim; I read the 2023
meta-analysis in full and confirmed the sign-inversion mechanism, both SMD 4.53 signatures, the
decline contradiction and the database-count defect; I re-ran all five suspect acquisition routes and
matched every hash; I reproduced four of five bot-challenge observations byte-for-byte; and I
confirmed that the remediation destroyed no provenance and moved no grade.

The single blocking finding is narrow and is a side effect of doing N-1 correctly: the claim was
weakened, and its own plain-language rendering and two sentences of the bench-press draft were not.
One bounded Claude Research remediation of three sentences in two files closes it. **I did not repair
it**, as the role forbids.

Under the stop rule in CLAUDE.md and AGENTS.md, this FAIL is followed by one bounded remediation and
one complete-artifact recheck at `reviews/evidence/SBLA-009-r4.md`. No additional review layer is
requested or required, and no named material risk justifies one.
