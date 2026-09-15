# Evidence review: SBLA-009 evidence pass and draft claims, round 4

**Task:** SBLA-010 — the complete-artifact recheck that closes the one bounded remediation
prescribed by `reviews/evidence/SBLA-009-r3.md` §9 (master plan §18 queue row; §14 Phase 1
Task 1.2).
**Reviewer role:** Claude Review (Account B), independent adversarial evidence review.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not
author, remediate, or contribute to any SBLA-009 artifact, and I received no authoring-role
reasoning beyond the committed artifacts, the committed reports, and the coordination ledger.
**Review date:** 2026-09-15.
**Reviewer worktree:** `C:\src\s009review-r4`
**Reviewer branch:** `claude-review/SBLA-009-r4`
**Reviewer write path:** `reviews/evidence/SBLA-009-r4.md` — sole permitted path. No other file was
created, edited, staged, or committed. No artifact under review was repaired, reformatted, or
staged (AGENTS.md role table; CLAUDE.md "Never repairs the artifact under review";
`operating-policy.json` `writeBoundaries["claude-review"] = ["reviews/"]`). All scratch work was
held outside the repository.

**Reviewed candidate commit:** `1cdf3ebf321be0f0f837fb3d8709708a83cad549` _(immutable)_
**Reviewed candidate tree:** `d02c48f46ae6cd60261c102d47f84390e1648acb` _(immutable)_
**Remediation base commit:** `1b28cb7e96f83cfd033f89e2e6b589c641a07e5a` (my final R3 report commit;
the candidate is its direct child)
**R3-reviewed artifact commit:** `becc6682c6a23da9c1f78f61ffb980daf4055c1f`, tree
`5f03345693e5ec9209f90fa771c9f837344084c7`
**Coordination claim commit:** `0cfa1bb831727fe10779220a1b1f36c74ad9365f` on
`codex/SBLA-007-review-coordination`

**Governing R3 report:** `reviews/evidence/SBLA-009-r3.md`, SHA-256
`4a1bfe517d85266b6478d463174ab18a15bd8c92a270704f0177a16a7814c199`, 1,028 lines, 94,620 bytes
**Governing R2 report:** `reviews/evidence/SBLA-009-r2.md`, SHA-256
`3428d3feb9b58bb150ac4c93375d868cabc5dc3f5597e83e50503b30a47a12b5`, 844 lines, 79,040 bytes
**Governing R1 report:** `reviews/evidence/SBLA-009-r1.md`, SHA-256
`7c829be485846c7fa71a48637c4795978d003e8d2501c77ffcc31ef671f9f46e`, 1,116 lines, 102,678 bytes

---

## 0. Verdict

**PASS — 0 Critical, 0 Important, 2 new Minor (nonblocking), 9 Minor carried forward from R3.**

The acceptance rule in CLAUDE.md, AGENTS.md and `operating-policy.json`
(`passRequiresZeroCritical`, `passRequiresZeroImportant`) is satisfied: this candidate carries no
unresolved Critical and no unresolved Important finding.

**R3's single blocking finding N5-1 is closed.** All three sentences it named now assert only what
`claim-bench-press-inclination-shifts-regional-activation` supports, and I verified each against the
claim's qualifiers and then against the primary extractions behind them rather than against the
commit message. The remediation also took R3 §9's optional suggestion: the reader-facing page now
names the retrieved counter-example instead of merely softening around it.

**The remediation is exactly as bounded as it was told to be.** Measured from `1b28cb7`, two files
changed. Inside the 1,451-line, 92,327-byte claims file a full recursive tree comparison finds
**exactly one differing node out of 1,261** — the `plainLanguage` string of the one claim named in
N5-1. Key order, array lengths, every source link, locator, role, supportStrength, recordId,
certainty, applicability, direction, magnitude, scope, qualifier, absence record, `artifactVersion`,
`remediationLog` and `governingReview` block are byte-for-byte unchanged. In the bench draft, two
sentences changed and nothing else. No grade moved in either direction. Every wording change moves
strength **downward**, which is the only direction R3 §9 permitted.

Because 242 of the 245 tracked paths are byte-identical to the R3-reviewed candidate, I carry
forward the R1, R2 and R3 closure matrices rather than re-deriving them — but only after proving
ancestry and hash identity path by path (§6), and only for paths I proved unchanged. The two paths
that did change were re-reviewed from first principles.

Two new Minor findings are recorded with impact and destination (§8). Neither is reader-facing in a
way that makes a sentence unentailed, and neither blocks acceptance.

---

## 1. Provenance verification

### 1.1 HEAD, tree, branch, cleanliness — verified before reading anything under review

```
$ git rev-parse HEAD
1cdf3ebf321be0f0f837fb3d8709708a83cad549
$ git rev-parse HEAD^{tree}
d02c48f46ae6cd60261c102d47f84390e1648acb
$ git rev-parse --abbrev-ref HEAD
claude-review/SBLA-009-r4
$ git status --porcelain=v1
(no output — clean)
$ git rev-parse --is-inside-work-tree
true
$ cat .git
gitdir: C:/src/sciatlas/.git/worktrees/s009review-r4
```

HEAD and tree match the assigned immutable candidate exactly. The branch matches the assigned
review branch. The worktree was clean before I wrote this report and clean again after the full
verify run (§10.4).

### 1.2 Ancestry — the candidate is the direct child of my own R3 report commit

```
$ git merge-base --is-ancestor 1b28cb7e96f83cfd033f89e2e6b589c641a07e5a HEAD && echo YES
YES
$ git log --oneline -5
1cdf3eb research: align inclination wording with R3 qualifier
1b28cb7 review: correct one pin-sweep row in SBLA-009-r3
d3f8e1f review: audit SBLA-009 evidence pass R3 — FAIL
becc668 research: remediate SBLA-009 R2 evidence findings N-1..N-4
f67b6df review: audit SBLA-009 evidence pass R2 — FAIL
$ git log -1 --format='%H %T %P' 1cdf3eb
1cdf3ebf321be0f0f837fb3d8709708a83cad549 d02c48f46ae6cd60261c102d47f84390e1648acb 1b28cb7e96f83cfd033f89e2e6b589c641a07e5a
```

The chain is unbroken and linear: R2 report → R2 remediation → R3 report → R3 report correction →
this remediation. There is no merge, no rebase and no intervening commit in which an unreviewed
change could hide.

### 1.3 The exact one-path review claim, verified before writing

`docs/runbooks/current-work.md` at coordination commit `0cfa1bb831727fe10779220a1b1f36c74ad9365f`
(branch `codex/SBLA-007-review-coordination`, "docs: open SBLA-010 R4 evidence review", Frank,
2026-09-15 18:30:08 -0400) carries this active-claim row:

| Field            | Recorded value                                           |
| ---------------- | -------------------------------------------------------- |
| Task             | SBLA-010 citation-entailment review R4                   |
| Role             | Claude Review (account B)                                |
| Branch           | `claude-review/SBLA-009-r4`                              |
| Worktree         | `C:\src\s009review-r4`                                   |
| Base commit      | `1cdf3ebf321be0f0f837fb3d8709708a83cad549`               |
| Started          | 2026-09-15 18:29 EDT                                     |
| Expected handoff | `reviews/evidence/SBLA-009-r4.md`                        |
| Paths owned      | `reviews/evidence/SBLA-009-r4.md` — **exactly one path** |

Every field matches my session. The claim was recorded by Codex on my behalf, as CLAUDE.md requires,
and I verified it existed before writing my permitted output. I did not edit the ledger. The only
other active claim in the table is GRAPH-002 on `codex/GRAPH-002-runtime-repair` in a different
worktree; its owned paths (`.codex/hooks.json`, `.claude/settings.json`, `.agents/…`, `.gitignore`,
`.prettier…`) do not intersect mine or the candidate's two changed paths, so there is no writer
collision.

`reviews/evidence/SBLA-009-r4.md` did not exist at the candidate commit, so this report is an
addition and not an edit. Review reports remain append-only: R3 is a separate immutable file and I
did not touch it.

### 1.4 The three prior reports are present and unaltered

```
$ git show HEAD:reviews/evidence/SBLA-009-r1.md | sha256sum
7c829be485846c7fa71a48637c4795978d003e8d2501c77ffcc31ef671f9f46e   (1,116 lines, 102,678 bytes)
$ git show HEAD:reviews/evidence/SBLA-009-r2.md | sha256sum
3428d3feb9b58bb150ac4c93375d868cabc5dc3f5597e83e50503b30a47a12b5   (844 lines, 79,040 bytes)
$ git show HEAD:reviews/evidence/SBLA-009-r3.md | sha256sum
4a1bfe517d85266b6478d463174ab18a15bd8c92a270704f0177a16a7814c199   (1,028 lines, 94,620 bytes)
```

The R1 and R2 hashes and counts reproduce, digit for digit, the values independently recorded in the
R3 report header and in the claims file's `governingReview` block — three records written at
different times agree, so none of the three was rewritten to match another. The R2 and R3 blobs are
`git rev-parse`-identical to the commits that introduced them (`f67b6df` and `1b28cb7`). The R1 blob
is identical to its blob in `becc668` by the ls-tree comparison in §6.1.

---

## 2. Methods

What I actually did, in order, so that a reader can repeat it:

1. Verified HEAD, tree, branch and cleanliness before opening any artifact (§1.1).
2. Verified the exact one-path coordination claim at `0cfa1bb` before writing (§1.3).
3. Read AGENTS.md, CLAUDE.md, `docs/runbooks/operating-policy.json` and the master-plan sections
   the prior rounds invoke.
4. Read `reviews/evidence/SBLA-009-r3.md` in full, and its N5-1 finding and §9 bounded plan
   verbatim.
5. Took `git diff --name-status`, `--raw` and full textual diff from `1b28cb7` to HEAD.
6. Extracted both versions of the claims file to scratch **outside the repository** and ran a
   recursive structural comparison over every node, key, key order and array length (§4.2), rather
   than trusting the line diff.
7. Read the bench draft's "Bench angle" section end to end at HEAD, and its base version, and the
   claim object in full — statement, plainLanguage, scope, all nine qualifiers, evidence grades, all
   twelve sourceLinks with locators and roles, recordIds and rederivation block.
8. Followed the two facts the new prose asserts down to the extraction records for G1903 and G1944,
   including the sign-convention note that decides direction for the pooled sternal result (§3).
9. Swept all of `content-drafts/` for every phrase R3 named and for eighteen equivalent universal or
   high-certainty constructions (§5).
10. Proved by ls-tree comparison that every other path is byte-identical to the R3-reviewed
    candidate, then carried forward the R1/R2/R3 matrices for those paths only (§6).
11. Re-checked each of R3's nine Minors at its cited location to confirm none was silently absorbed
    (§7).
12. Ran the repository-pinned full `pnpm verify` under Node v24.20.0 and pnpm 11.24.0, plus targeted
    formatting, JSON, referential-integrity, whitespace and role-path assertions (§10).
13. Attempted to falsify the closure, and recorded the attempts that failed (§9).

**Not evidence.** Nothing in this report rests on model memory. Where I state what a source says, I
state the artifact record I read and its locator. I did not re-run the literature searches; R3 §9
forbade a new search and no claim here depends on one.

---

## 3. N5-1 closure evidence

R3 §7 graded exactly one Important finding. Its text: a claim's first qualifier had been weakened,
and three sentences that resolve to that claim still asserted the pre-weakening strength. R3 §9
required those three sentences to be brought into line and nothing else.

### 3.1 The claim the three sentences must be entailed by

`claim-bench-press-inclination-shifts-regional-activation`,
`content-drafts/syntheses/SBLA-009-atomic-claims.json`, `claims[13]`. Its grades at HEAD are
`certainty: low`, `applicability: partially-direct`, `direction: mixed`, `magnitude: not-estimable` —
identical to the base. The `fieldContract` states that `qualifiers` are "Every limit that must travel
with the claim", so the claim for entailment purposes is statement **plus** qualifiers. The two
qualifiers that govern these sentences:

> **Qualifier 1.** "The two portions behave differently and must not be described with one sentence.
> The sternocostal decrease is the more consistent finding, but it is not universal: a
> twelve-variation study of the bench press reports no significant sternocostal difference across
> -15, 0 and +30 degrees within matched pronated grips, and no clavicular advantage for the incline
> at a matched wide pronated grip. The clavicular response is not consistent across studies."

> **Qualifier 3.** "The 2023 systematic review and meta-analysis pools four studies for the
> inclination contrast and reports no significant clavicular difference (standardised mean
> difference 0.36, 95 per cent CI -3.03 to 3.74, p = 0.81) alongside a significant sternal difference
> (1.80, 95 per cent CI 0.40 to 3.19, p = 0.017). Heterogeneity is extreme in both (I-squared 92.6
> and 87.6 per cent), so neither pooled value is a precise estimate."

### 3.2 Sentence 1 — `atomic-claims.json:720`, `plainLanguage` · **CLOSED**

Before (`1b28cb7`):

> "Raising the bench **reliably** takes work away from the lower chest. Whether it adds work to the
> upper chest is not settled: …"

After (`1cdf3eb`, line 720):

> "Raising the bench **usually** takes work away from the lower chest, **though not in every study
> that measured it**. Whether it adds work to the upper chest is not settled: the best single study
> suggests a peak around 30 degrees rather than a steady increase, and pooled evidence finds no clear
> upper-chest difference at all."

**Entailed.** "usually" is the `low`-certainty register master plan §9.5 permits; "reliably" was the
`high` register. "though not in every study that measured it" states exactly what qualifier 1 states
("is not universal"). The self-contradiction R3 identified — qualifier 1 naming a retrieved
counter-example while `plainLanguage` called the effect reliable — no longer exists. The second
sentence is unchanged and was already entailed by qualifiers 2 and 3.

**Is "not in every study that measured it" true?** Yes, and by more than one study. Two retrieved
sources linked to this claim report no such difference: `source-doi-10-47206-ijsc-v1i1-39` (G1944,
role `contradicts`) and `source-pmid-28713459` (role `contradicts`, "no significant pectoralis
activation difference between flat, inclined and declined positions in elite athletes"). So the
hedge is not a courtesy — it is the record.

**Is "usually" true?** Yes. Five linked sources carry the sternocostal decrease in some form
(`pmid-36334406` p < 0.001, `pmid-39764299`, `pmid-33049982`, `pmid-20512064`, and the pooled sternal
result in `doi-10-3390-app13085203`), against two nulls. "Usually" / "the more consistent" is the
honest reading of that split, and matches qualifier 1's own comparative.

This is also the exact wording R3 §9 offered as an example. I checked that this is compliance rather
than deference: the wording is independently correct against the qualifiers, and I would have
accepted any form with the same strength.

### 3.3 Sentence 2 — `barbell-flat-bench-press.md:85–91` · **CLOSED**

Before (`1b28cb7`, lines 85–88):

> "**Bench angle.** The two parts of the muscle do not behave the same way, and one sentence cannot
> describe both. As the bench is raised, sternocostal (lower) activation falls — that is **the
> consistent finding across the studies retrieved** and across a 2023 meta-analysis
> `[claim-bench-press-inclination-shifts-regional-activation]`."

After (`1cdf3eb`, lines 85–91):

> "**Bench angle.** The two parts of the muscle do not behave the same way, and one sentence cannot
> describe both. The sternocostal (lower) activation decrease as the bench is raised is **the more
> consistent of the two regional findings, but it is not universal**: a twelve-variation study
> reported no significant sternocostal difference across -15, 0 and +30 degrees within matched
> pronated grips, while a 2023 meta-analysis found a significant sternal difference
> `[claim-bench-press-inclination-shifts-regional-activation]`."

**The universal quantifier is gone.** "the consistent finding across the studies retrieved" was
false in that form — it quantified over a retrieved set containing two contradicting studies. It no
longer appears anywhere in the repository (§5).

**Clause A — the twelve-variation null — verified to the source record, not to the claim.**
`research/extractions/SBLA-009-source-extractions.json`, `X-G1944`, `proposedSourceId`
`source-doi-10-47206-ijsc-v1i1-39`, "The Effect of 12 Variations of the Bench Press Exercise on the
EMG Activity of Three Heads of the Pectoralis Major" (2021, CC BY 4.0, full text obtained
2026-09-15):

- `designNote`: "three trunk inclinations (-15, 0 and +30 degrees) with two grip types (pronated,
  supinated) and two grip widths" — the draft's "-15, 0 and +30 degrees" and "twelve-variation" are
  exact.
- Finding, locator "Discussion, sternocostal head paragraph": "Within matched pronated grips the
  study reports no significant inclination effect on the sternocostal head: _'the present study
  showed no significant difference in activation of the sternocostal head between the three
  inclinations in both close and wide pronated grips'_."

The draft's clause is a faithful compression of a verbatim source sentence, and the restriction
"within matched pronated grips" is carried, not dropped. Carrying it matters: qualifier 9 records
that this study crosses inclination with grip and loads each cell at its own 12RM, so an unmatched
reading would be confounded. The draft does not make that mistake.

**Clause B — the 2023 pooled sternal result — verified, including its direction.** Extraction
`X-G1903`, `source-doi-10-3390-app13085203`: "Horizontal versus inclined bench press, sternal
portion: pooled standardised mean difference 1.80 (95% CI 0.40 to 3.19), I-squared 87.6 per cent,
t = 2.87, p = 0.017. The Results text states that the inclined-bench variant activates the sternal
portion significantly less." So "a significant sternal difference" is true, and its direction runs
with the sternocostal decrease, which is what the sentence's contrastive "while" implies.

I specifically checked the trap this source sets, because R3 §8.3 flagged it. The same extraction's
quality note records: "The sign convention is not uniform across contrast families… For the
inclination family the Results prose resolves it ('the BP variant with the inclined bench activates
less the sternal portion'), so a positive standardised mean difference favours the horizontal bench
press. For the type-of-exercise family the same prose resolves it the other way." The draft sentence
is in the inclination family, where the prose resolves the sign in the direction the sentence
implies. It does not carry the type-of-exercise convention across. Correct.

Note that clause B is **weaker than the source supports**: the source resolves a direction and the
draft asserts only that a significant difference exists. That is a downward move, which is the only
direction R3 §9 permitted, and it mirrors qualifier 3's own phrasing ("alongside a significant
sternal difference").

**R3 §9's optional suggestion was taken.** R3 wrote: "While there, consider adding one sentence
naming the twelve-variation study's null… That is a suggestion, not a requirement." The page now
names it. R3's observation that "No draft mentions the counter-example at all" no longer holds:
`grep -rin "twelve-variation" content-drafts/` now returns the bench draft at line 88 as well as the
claims file.

### 3.4 Sentence 3 — `barbell-flat-bench-press.md:103–106` · **CLOSED**

Before:

> "So the useful reading is that raising the bench **reliably** takes work away from the lower chest,
> and that any upper-chest gain is smaller, less consistent, and probably does not keep increasing as
> the bench gets steeper."

After:

> "So the useful reading is that raising the bench **usually** takes work away from the lower chest,
> **though not in every study that measured it**, and that any upper-chest gain is smaller, less
> consistent, and probably does not keep increasing as the bench gets steeper."

**Entailed**, on the same grounds as §3.2 — it is now the same hedge, in the same register, as the
claim's own `plainLanguage`, which is the correct relationship between a reader-facing summary
sentence and the claim it cites. The trailing clause about the upper chest is unchanged and is
entailed by qualifiers 2 and 3 as R3 already verified.

### 3.5 The other three sentences citing this claim — rechecked, unchanged, still entailed

The claim ID is cited five times in the bench draft. Two changed; I re-read the other three anyway,
because a claim's meaning changing can unseat a sentence that was not edited.

| Location     | Sentence (abridged)                                                                                                                                           | Entailed by                                                                                 | Status              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| line 28–31   | "…though how much bench angle changes the upper chest specifically is not settled"                                                                            | statement; qualifiers 2, 3, 4                                                               | unchanged, entailed |
| line 93–101  | largest single study peak at 30°, >45° decreases pectoralis performance; second study no upper-pec difference; 2023 meta no significant clavicular difference | qualifiers 2, 3, 4; sourceLinks `pmid-33049982`, `pmid-25799093`, `doi-10-3390-app13085203` | unchanged, entailed |
| line 106–116 | one small trial, site-specific thickness at eight weeks, "only outcome evidence in this direction"; literature contradictory; elite-competitor null           | qualifiers 6, 7; sourceLinks `pmid-32922646`, `pmid-34644424`, `pmid-28713459`              | unchanged, entailed |

The weakening moved the claim **down**, so a sentence entailed by the stronger prior claim could in
principle be unseated. None was: all three of these are hedged or null statements that the weaker
claim still supports, and none of them asserts the sternocostal direction.

### 3.6 Referential integrity of all draft citations

```
barbell-flat-bench-press.md:                     22 citations, 12 unique, unresolved: none
cable-fly-standing-bilateral-shoulder-height.md: 23 citations,  9 unique, unresolved: none
pectoralis-major.md:                             26 citations, 13 unique, unresolved: none
TOTAL 71 citations, 0 unresolved
```

Every `[claim-…]` and `[absence-…]` token in all three drafts resolves to an `id` in the claims
file's `claims[]` or `absenceRecords[]`. The edit introduced no dangling reference and removed no
citation: the changed paragraphs still carry the same claim ID they carried before.

**N5-1 is CLOSED.** All three named sentences are entailed by the claim whose ID they cite. The
`draftingRule` violation R3 identified — "a draft sentence must be entailed by the claim whose ID it
cites, not merely adjacent to it" — is repaired at all three sites.

---

## 4. Semantic-diff proof

### 4.1 Exactly two files changed

```
$ git diff --name-status 1b28cb7 HEAD
M	content-drafts/exercises/barbell-flat-bench-press.md
M	content-drafts/syntheses/SBLA-009-atomic-claims.json
$ git diff --name-only 1b28cb7 HEAD | wc -l
2
$ git diff --stat 1b28cb7 HEAD
 content-drafts/exercises/barbell-flat-bench-press.md | 16 ++++++++++------
 content-drafts/syntheses/SBLA-009-atomic-claims.json |  2 +-
 2 files changed, 11 insertions(+), 7 deletions(-)
$ git diff --raw 1b28cb7 HEAD
:100644 100644 27c704e 367538b M	content-drafts/exercises/barbell-flat-bench-press.md
:100644 100644 dae6fa1 e037a87 M	content-drafts/syntheses/SBLA-009-atomic-claims.json
```

Two paths, both modifications, no additions, no deletions, no renames, no mode changes. Both are
inside `content-drafts/`, which `operating-policy.json` assigns to `claude-research`. Nothing under
`research/`, `reviews/`, `content/`, `src/`, `scripts/`, `docs/` or CI changed.

| File                                                   | Base (`1b28cb7`) SHA-256 / lines / bytes                                            | HEAD (`1cdf3eb`) SHA-256 / lines / bytes                                            |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `content-drafts/exercises/barbell-flat-bench-press.md` | `c9f32e39e7b9b07172f7730aef5b285c22f5230068a6f9999e5a4d1868394772` / 183 / 10,045   | `b8d87fd8b919494009fbcbfd6c5bae6f446fdd361d6526b76bab1e9612d36f85` / 187 / 10,276   |
| `content-drafts/syntheses/SBLA-009-atomic-claims.json` | `dd936b764c528231f13f20eb85693cbd1662bf06265275e1cb3b85176c41e552` / 1,451 / 92,284 | `8c881523881ba2abb7409777313c448796d7865459c8651149bb870f385686e4` / 1,451 / 92,327 |

### 4.2 Inside the JSON: exactly one differing node out of 1,261

A line diff can hide a reordered key or a silently retyped value, so I did not rely on one. I
extracted both versions to scratch outside the repository and walked both trees node by node,
comparing types, values, array lengths and **key order**:

```
TOTAL STRUCTURAL DIFFS: 1
---
PATH : $.claims[13].plainLanguage
KIND : value
BASE : "Raising the bench reliably takes work away from the lower chest. …"
HEAD : "Raising the bench usually takes work away from the lower chest, though not in every study that measured it. …"
=== node counts (base/head): 1261 / 1261
=== claims (base/head): 23 / 23
=== top-level keys base: artifactId,artifactVersion,schemaContract,task,role,account,generatedAt,baseCommit,status,crossLinks,fieldContract,draftingRule,claims,absenceRecords,remediationLog,governingReview
=== top-level keys head: artifactId,artifactVersion,schemaContract,task,role,account,generatedAt,baseCommit,status,crossLinks,fieldContract,draftingRule,claims,absenceRecords,remediationLog,governingReview
```

`KIND: keys-or-order` was never emitted, so no object anywhere in the file had a key added, removed
or reordered. `KIND: array-length` was never emitted, so no array anywhere gained or lost an element.
That is the strongest form of the "no silent movement" check, and it returns a single leaf.

**What this proves did not change, exhaustively, because a single differing node admits no
exception:**

| Field class                                                                                      | Status                                                                |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `artifactVersion` (`2.0.0`)                                                                      | unchanged — R3 §9 forbade a bump; the three N-3 pins stay satisfiable |
| `artifactId`, `schemaContract`, `task`, `role`, `account`, `generatedAt`, `baseCommit`, `status` | unchanged                                                             |
| all 23 claim `id` values                                                                         | unchanged                                                             |
| all 23 `statement` values                                                                        | unchanged (including claim 13's)                                      |
| all `scope.population` / `scope.conditions`                                                      | unchanged                                                             |
| all `qualifiers[]` (claim 13 has 9)                                                              | unchanged, in the same order                                          |
| all `evidence.{certainty,applicability,direction,magnitude}`                                     | unchanged — **zero grade movement in either direction**               |
| all `sourceLinks[]` — sourceId, locator, role, supportStrength                                   | unchanged (claim 13 has 12, including G1944 at role `contradicts`)    |
| all `recordIds[]`                                                                                | unchanged (claim 13 has 12, including `G1944`)                        |
| `rederivation` blocks                                                                            | unchanged                                                             |
| `absenceRecords[]` — all statements, bounds, `boundedBy`                                         | unchanged                                                             |
| `crossLinks`, `fieldContract`, `draftingRule`                                                    | unchanged                                                             |
| `remediationLog` (2 entries)                                                                     | unchanged — see finding R4-M-2                                        |
| `governingReview`                                                                                | unchanged — see finding R4-M-2                                        |

### 4.3 Inside the markdown: exactly two sentences

The full textual diff has two hunks, both inside the "Setup variables that change what is loaded"
section, quoted in full in §3.3 and §3.4. The remainder of the 187-line file — frontmatter
(`draftVersion: '2.0.0'`, `claimSource: …@2.0.0`, `baseCommit`, `generatedAt`, `publicationState`),
"Practical takeaway", "Definition used by this project", the clavicular paragraph, "Grip width",
"Range of motion", the training-response section, "Provenance and open items" and the safety
paragraphs — is byte-identical to the base.

The 4-line and 231-byte growth is fully accounted for by the added counter-example clause plus the
re-wrap of the two touched paragraphs. `git diff --check` reports no whitespace error (§10.3).

### 4.4 The semantic change is exactly what was prescribed

R3 §9 named three edits: one `plainLanguage` leaf and two bench-draft sentences, all weakening, plus
one optional suggestion. The candidate contains one `plainLanguage` leaf change and two bench-draft
sentence changes, all weakening, plus the optional suggestion. There is no fourth edit, no
accompanying "while we were in there" change, and no field the plan did not name.

---

## 5. Overstrong-phrase sweep

R3 named two phrases. I searched for those plus eighteen equivalent universal or high-certainty
constructions across every file in `content-drafts/`:

| Phrase searched                                                                                                                                          | Hits in `content-drafts/`                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reliably`                                                                                                                                               | 2, **neither in this claim or draft** — both are `claim-pectoralis-major-surface-emg-limitation` / the muscle draft, in the negated form "not reliably comparable" |
| `the consistent`                                                                                                                                         | **0**                                                                                                                                                              |
| `consistent finding`                                                                                                                                     | 1 — claims file line 729, inside qualifier 1 itself, in its weakened form "the **more** consistent finding, but it is not universal"                               |
| `across the studies retrieved`                                                                                                                           | **0** — the universal quantifier R3 called false is gone from the repository                                                                                       |
| `always`, `invariably`, `without exception`, `uniformly`, `in all cases`, `never fails`, `guarantees`, `definitively`, `shows that`, `demonstrates that` | **0 each**                                                                                                                                                         |
| `all studies`                                                                                                                                            | 1 — "In two small studies…" (substring match only, not a universal)                                                                                                |
| `consistently`                                                                                                                                           | 1 — claim 13's `statement`, in the **negated** form "clavicular activation does not rise consistently"                                                             |
| `universal`                                                                                                                                              | 2 — both the new negation "it is not universal" (draft line 88; qualifier 1)                                                                                       |
| `in every study` / `every study`                                                                                                                         | 2 — both the new hedge "though not in every study that measured it"                                                                                                |

Every surviving hit is either a negation, a comparative, or unrelated to this claim. The sweep turns
up no equivalent universal language that the three-sentence fix left standing, and no synonym
substitution that would reintroduce the strength elsewhere.

I also checked the other two drafts for a parallel inclination sentence that could carry the old
strength: `cable-fly-standing-bilateral-shoulder-height.md` and `pectoralis-major.md` contain no
sentence citing `claim-bench-press-inclination-shifts-regional-activation` and no inclination
direction claim. R3 reached the same conclusion; I verified it independently rather than inheriting
it.

---

## 6. Carried-forward closure matrices — justified, not assumed

CLAUDE.md requires a complete-artifact recheck, and the master plan forbids rubber-stamping. It does
not require re-deriving conclusions about bytes that provably did not move. My rule here: I carry
forward a prior closure **only** for a path I have proved byte-identical to the commit at which that
closure was verified, and I re-derive everything for paths that changed.

### 6.1 The unchanged-artifact proof

```
$ git rev-parse becc668^{tree}
5f03345693e5ec9209f90fa771c9f837344084c7
$ git diff --name-status becc668 HEAD
M	content-drafts/exercises/barbell-flat-bench-press.md
M	content-drafts/syntheses/SBLA-009-atomic-claims.json
A	reviews/evidence/SBLA-009-r3.md
$ diff <(git ls-tree -r becc668 | sort) <(git ls-tree -r HEAD | sort)
  → 5 differing lines out of 490 (2 modified paths = 4 lines, 1 added path = 1 line)
$ git ls-tree -r HEAD --name-only | wc -l
245
```

`becc6682c6a23da9c1f78f61ffb980daf4055c1f` is the exact commit R3 reviewed and its header names.
Comparing the **full recursive blob listing** — every path and every blob SHA-1 — of that tree with
this one, **242 of 245 tracked paths are byte-identical**. The three that differ are the two files
under review and the R3 report itself, which was added after R3's candidate was frozen and which I
verified unaltered in §1.4.

This is why the carry-forward is legitimate: for every artifact other than the two drafts, the bytes
R3, R2 and R1 audited are literally the bytes in this candidate. A finding closed against those
bytes cannot have reopened.

### 6.2 R1 — fourteen blocking findings

R3 §3 verified all fourteen R1 Critical and Important findings closed against `becc668`, including
the four numeric closures I-7 to I-10 it had to force and the lowered applicability on
`claim-pectoralis-major-structural-variation`. Ten of the fourteen concern paths under `research/`,
which are byte-identical here (§6.1). The four that touch the claims file or the bench draft I
re-derived from the structural diff: claim IDs, statements, grades, sourceLinks, locators, recordIds
and absence records are all unchanged (§4.2), and `claim-pectoralis-major-structural-variation`'s
applicability is still `indirect`. **All fourteen remain closed.**

### 6.3 R2 — four Important findings

| Finding | R3 status                                 | R4 status                                                                                                                                                                                                              |
| ------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N-1     | CLOSED (G1944 obtained, CC BY, extracted) | **Still closed.** `X-G1944` and its ladder records are in the unchanged `research/extractions/…json`; the sourceLink and recordId survive the structural diff. I re-read the extraction in §3.3.                       |
| N-2     | CLOSED (unentailed direction removed)     | **Still closed.** `claim-press-versus-fly-activation-mixed` has zero differing nodes.                                                                                                                                  |
| N-3     | CLOSED (draft version pins satisfiable)   | **Still closed, and deliberately protected.** `artifactVersion` stays `2.0.0` and all three drafts still pin `…atomic-claims.json@2.0.0`. A version bump here would have reopened N-3, which is why R3 §9 forbade one. |
| N-4     | CLOSED at the reader-facing layer         | **Still closed, and strengthened.** N-4's defect class is a draft sentence not entailed by its cited claim; this round removed the last three instances of it.                                                         |

### 6.4 R3 — the one Important finding

N5-1: **CLOSED**, on the evidence in §3.

---

## 7. R3's nine Minor findings — preserved, not silently absorbed

R3 §9 required these be "preserved, not silently absorbed". Since none of the files they cite
changed at all, the correct outcome is that each remains exactly as R3 recorded it — still open,
still routed. I verified each at its cited location rather than inferring it from the diff:

| ID     | R3 destination   | Verification at HEAD                                                                                                                                       | Status          |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| R3-M-1 | Claude Research  | `research/syntheses/SBLA-009-synthesis.md:195` still reads "It says nobody has measured it."                                                               | open, unchanged |
| R3-M-2 | Claude Research  | `synthesis:460` and `research/packets/SBLA-009-handoff.md:275` both still read "index Y remains unstudied"                                                 | open, unchanged |
| R3-M-3 | Claude Research  | `synthesis:190` still reads "close to absent from indexed research"                                                                                        | open, unchanged |
| R3-M-4 | Claude Research  | `absence-index-cable-fly-no-evidence.statement` still bounds to "any route run in this pass or in its R1 remediation" — the asymmetry R3 recorded persists | open, unchanged |
| R3-M-5 | **Codex**        | `sbla-009-evidence-packet.json` has no `version` key (`hasOwnProperty` → false)                                                                            | open, unchanged |
| R3-M-6 | **Codex**        | `sbla-009-evidence-packet.json` has no `governingReview` key (`hasOwnProperty` → false)                                                                    | open, unchanged |
| R3-M-7 | **Codex**        | exactly **90** `ladder-5-author-request` step objects, **90** with `result: not-performed` **and** an `attemptedAt`                                        | open, unchanged |
| R3-M-8 | Codex / SBLA-011 | **13 of 89** extractions carry an empty `sourceSchemaFields.study` object                                                                                  | open, unchanged |
| R3-M-9 | SBLA-011 record  | process finding about single-reader screening of G1944; no artifact state to change                                                                        | open, recorded  |

None was silently fixed, none was silently dropped, and none was upgraded or downgraded. All nine
carry forward to R4 with their R3 impact statements and destinations intact.

---

## 8. New findings

**0 Critical. 0 Important.** Two Minor findings, each with impact and follow-up destination recorded
as CLAUDE.md requires for a nonblocking Minor. **I did not repair either.**

### CRITICAL

None.

### IMPORTANT

None.

### MINOR — nonblocking, with impact and destination recorded

#### R4-M-1 — Both 2023 pooled inclination results are reported without the claim's heterogeneity caveat

**Location:** `content-drafts/exercises/barbell-flat-bench-press.md:90` (new) and `:99–100`
(pre-existing).

**Finding.** The bench draft now reports both of the 2023 meta-analysis's inclination results as bare
significance statements — "found a significant sternal difference" and "finds no significant
clavicular difference … at all" — while qualifier 3 attaches "Heterogeneity is extreme in both
(I-squared 92.6 and 87.6 per cent), so neither pooled value is a precise estimate" to both. The page
carries no heterogeneity or imprecision signal for either; `grep -i "heterogen\|pooled\|imprecise"`
on the bench draft returns nothing relevant.

**Impact.** **Not an entailment failure.** The draft asserts no point estimate and no confidence
interval, and "not a precise estimate" governs magnitude, not the existence of an effect; qualifier 3
itself calls it "a significant sternal difference", so the draft says no more than the claim says.
The surrounding prose is heavily hedged ("not universal", "usually", "not settled", "the inclination
literature is contradictory"). But a reader is handed "significant" from a pooled estimate at
I-squared 87.6 per cent with no fragility signal. The clavicular half of this predates this patch and
was accepted at R3; only the sternal half is new.

**Destination.** Claude Research — bench draft "Bench angle" section, at the next content round.

#### R4-M-2 — This remediation round is not recorded in the artifact's own `remediationLog` or `governingReview`

**Location:** `content-drafts/syntheses/SBLA-009-atomic-claims.json`, `remediationLog` (2 entries)
and `governingReview`.

**Finding.** `remediationLog` still has exactly two entries (R1, R2) and `governingReview` still
names `reviews/evidence/SBLA-009-r2.md` with `nextReview: reviews/evidence/SBLA-009-r3.md`. Neither
records this round, although the file's own `fieldContract` describes `remediationLog` as "An ordered
array of remediation rounds … Each entry names the immutable Account-B report it answers, the
blocking findings it closes, the claims it touched and every certainty movement", and the
`governingReview.note` states that "this governingReview block, not the version string, is what
distinguishes the reviewed 2.0.0 tree from this remediated 2.0.0 tree". This is now a third distinct
2.0.0 state that the block does not distinguish.

**Impact.** Documentation only; no reader-facing sentence is affected and no claim is unentailed. The
omission cannot conceal a certainty rise: I verified programmatically that **zero** grades moved
(§4.2). The change is fully traceable through `1cdf3eb` and through R3 §9. R3 §9 constrained the
remediation to three sentences and did not ask for a log entry, so this is a gap in the plan as much
as in the execution. Project grading practice places documentation-only defects here (R2 M-2;
R3-M-5, R3-M-6), which is why this is Minor and not Important.

**Destination.** Claude Research — `remediationLog` and `governingReview`, folded into the SBLA-011
promotion record or the next content round. Codex should decide whether appending a log entry is
compatible with holding `artifactVersion` at 2.0.0 for N-3.

---

Neither finding blocks acceptance. `operating-policy.json` sets
`minorFindingsMayBeDeferredWhenNonblocking: true`, and CLAUDE.md permits deferral "only when their
impact and follow-up destination are recorded" — both are recorded above.

---

## 9. Falsification attempts that failed

Recorded so they are not re-litigated. Each is something I actively tried to break and could not.

1. **The patch does not hide a second change in the JSON.** I did not trust the line diff. A
   recursive comparison over 1,261 nodes, including key order and array lengths, returns one leaf.
2. **No grade was moved under cover of a wording fix.** Certainty, applicability, direction and
   magnitude are unchanged for all 23 claims. The one claim touched keeps `low` / `mixed`.
3. **The weakening was not over-corrected into a new falsehood.** I checked the opposite failure
   mode — that "usually" and "not in every study" might understate a well-supported effect in order
   to look safe. Five linked sources carry the decrease against two nulls, so "usually" is the honest
   split, not a retreat.
4. **The new counter-example clause is not a paraphrase drifted from its source.** The G1944 null is
   a verbatim source sentence in the extraction, and the draft carries its restriction ("within
   matched pronated grips") rather than dropping it to make the clause read better.
5. **The meta-analysis clause does not invert the sign.** This source uses two different sign
   conventions in two contrast families and the extraction flags it. The draft's clause sits in the
   inclination family, where the Results prose resolves the sign in the direction the sentence
   implies.
6. **The "while" clause is not mis-parsed as evidence of non-universality.** I tested the reading in
   which both clauses after the colon support "not universal", which would make the second clause
   false. "while" is contrastive and the two clauses are explicitly opposed ("no significant" versus
   "a significant"), so the contrastive reading is the available one. No finding.
7. **No sentence that was not edited was unseated by the weakening.** A claim moving down can strand
   an unedited sentence. I re-read all five passages citing the claim; the three unedited ones are
   hedged or null statements the weaker claim still supports (§3.5).
8. **The version pins were not quietly invalidated.** `artifactVersion` is `2.0.0`, all three drafts
   still pin `@2.0.0`, and `crossLinks` is unchanged, so R2's N-3 closure holds.
9. **G1944 was not quietly demoted to make the sentence easier.** Its sourceLink role is still
   `contradicts` with `supportStrength: direct`, and its recordId is still in `recordIds`.
10. **The nine R3 Minors were not silently absorbed.** Each is still present at its cited location
    and still routed (§7). None was fixed without being recorded, and none was dropped.
11. **No absence record moved.** All absence statements and their `boundedBy` arrays are unchanged;
    the headline absence and its retrieval bounding survive untouched.
12. **The remediation stayed inside the research write boundary.** The role-path checker passes for
    `claude-research` over this range and fails for `claude-review` over the same range (§10.5), so
    the pass is discriminating rather than vacuous.

---

## 10. Tests, gates and formatting

### 10.1 Full repository-pinned `pnpm verify` — exit 0

Run from this worktree at the candidate commit. Toolchain resolved to the repository pins:
`package.json` `engines.node >=24.20.0 <25`, `.nvmrc` `24.20.0`, `packageManager pnpm@11.24.0`.

```
##### node v24.20.0
##### pnpm 11.24.0
##### BEGIN pnpm install --frozen-lockfile
##### install exit=0
##### BEGIN pnpm verify
##### verify exit=0
```

| Stage               | Command                                            | Result                                                                                      |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `format:check`      | `prettier --check .`                               | pass — "All matched files use Prettier code style!"                                         |
| `lint`              | `eslint . --max-warnings 0`                        | pass — no output                                                                            |
| `typecheck`         | `astro check`                                      | pass — 57 files, 0 errors, 0 warnings, 0 hints                                              |
| `test`              | `vitest run tests/unit`                            | pass — 17 files, **249/249** tests                                                          |
| `validate:content`  | `node scripts/content/validate.mjs`                | pass — "Content validation passed: 1 records."                                              |
| `validate:graph`    | `node scripts/graph/validate.mjs`                  | pass — "0 nodes checked; graph generation remains SBLA-011."                                |
| `validate:research` | `node scripts/evidence/research-integrity.mjs`     | pass — "Research integrity passed: 1 complete bundle checked (SBLA-009)."                   |
| `evidence:status`   | `node scripts/evidence/status.mjs`                 | pass — "0 sources checked as of 2026-09-15; live network acquisition remains a later task." |
| `build`             | `astro build`                                      | pass — 1 page built in 516 ms                                                               |
| `test:portability`  | `vitest run --config vitest.portability.config.ts` | pass — 3 files, **17/17** tests                                                             |
| `verify:foundation` | `node scripts/foundation/verify.mjs`               | pass — "Foundation contract passed at C:\src\s009review-r4\"                                |
| `assets:spike`      | `node scripts/assets/spike.mjs`                    | pass — 4 candidates, 1 eligible, 2 ineligible                                               |
| `assets:decision`   | `node scripts/assets/decision.mjs`                 | pass — owner-approved 2D-authoritative hybrid                                               |

All thirteen stages pass. `validate:research` is the gate that reads the SBLA-009 bundle, and it
accepts the edited claims file.

### 10.2 Targeted JSON assertions

- Both versions parse under `JSON.parse` with no error.
- Line count identical at 1,451; byte count 92,284 → 92,327 (+43), exactly the length delta of the
  one replaced string.
- No BOM (first three bytes `7b 0a 20` = `{`, newline, space); LF only (**0** CR bytes); trailing
  newline present (last byte `0a`).
- Key order preserved at every level (§4.2 emitted no `keys-or-order` diff).
- 23 claims before and after; 1,261 nodes before and after.

### 10.3 Targeted formatting and whitespace assertions

- `git diff --check 1b28cb7 HEAD` → exit 0; no trailing whitespace, no space-before-tab, no conflict
  marker.
- `git diff --check` on the working tree → exit 0.
- Bench draft: no BOM (`2d 2d 2d` = `---`), **0** CR bytes, trailing newline present.
- `prettier --check` covers both files and passes. The Prettier config (`.prettierrc.mjs`,
  `singleQuote: true`, `trailingComma: 'all'`) sets no `proseWrap`, so the default `preserve` applies
  and Markdown prose lines are never reflowed.
- Line 106 (`steeper. One small trial found a matching`, 41 chars) is a short mid-paragraph line left
  by the re-wrap. The file already contains many short prose lines (lines 62, 90, 113, 122, 130, 147,
  149, 163 range from 11 to 47 chars), Prettier accepts it, and Markdown reflows it on render, so it
  is invisible to a reader. **Recorded as an observation, not a finding.**

### 10.4 No artifact was modified by this review

```
$ git status --porcelain=v1        # after the full verify run, before writing this report
(no output)
```

`pnpm install` created `node_modules/`, which is ignored, and `astro build` created `dist/`, which is
ignored. No tracked file changed. I created, edited and staged exactly one path:
`reviews/evidence/SBLA-009-r4.md`.

### 10.5 Role-path boundary

```
$ node scripts/foundation/check-role-paths.mjs claude-research \
    --base 1b28cb7e96f83cfd033f89e2e6b589c641a07e5a --repository C:\src\s009review-r4
Role path boundary passed: trusted base policy allows claude-research to write all 2 changed path(s)
from 1b28cb7e96f83cfd033f89e2e6b589c641a07e5a...HEAD in C:\src\s009review-r4.          [exit 0]

$ node scripts/foundation/check-role-paths.mjs claude-review \
    --base 1b28cb7e96f83cfd033f89e2e6b589c641a07e5a --repository C:\src\s009review-r4 \
    --allowed-path reviews/evidence/SBLA-009-r4.md
Role path boundary failed:
- role claude-review may not write: content-drafts/exercises/barbell-flat-bench-press.md
- role claude-review may not write: content-drafts/syntheses/SBLA-009-atomic-claims.json
- Claude Review path is outside the exact claim: …
- Claude Review did not produce the exact claimed path: reviews/evidence/SBLA-009-r4.md  [exit 1]
```

The remediation's two paths are inside the `claude-research` boundary that `operating-policy.json`
defines. The second run is a control: the same checker, the same range, a different role, and it
fails — so the first result is discriminating, not vacuous. See L-3 for what this run is **not**
evidence of.

---

## 11. Provenance of the remediation, and why it does not weaken this review

I was told, and I record as stated rather than as verified: **the remediation was implemented by
Codex because Account A (Claude Research) was usage-blocked before it made any write.**

What the repository shows:

```
$ git log -1 --format='%H %an <%ae> %ai%n%s%n%G?' 1cdf3eb
1cdf3ebf321be0f0f837fb3d8709708a83cad549 Frank <frank@beyondlimitscarefoundation.org> 2026-09-15 18:28:54 -0400
research: align inclination wording with R3 qualifier
N   (unsigned)
```

The commit carries the repository's git identity, not a role identity, and it is unsigned, so **git
metadata cannot attribute this change to any particular agent** — it neither confirms nor refutes the
stated provenance. I record what I can verify and label the rest.

Three things follow, and I want them stated plainly:

1. **The write boundary is not violated.** `operating-policy.json` sets
   `writeBoundaries.codex = null` — Codex is unbounded and is the merge and content-promotion
   authority. Codex writing a `content-drafts/` path is permitted by the canonical policy, and the
   checker in §10.5 agrees.
2. **Review independence is intact.** `roleIdentity` requires distinct Claude accounts
   (`requiresDistinctClaudeTeamAccounts: true`, `sameAccountSessionSatisfiesReview: false`). The
   author of this change was not this reviewer, was not this account, and was not any Claude Review
   session. I received no authoring rationale beyond the committed artifacts and R3's own plan.
3. **It changes nothing about how I judged the artifact.** Every conclusion in §3, §4, §5 and §7 is
   derived from bytes in the tree and from the extraction records behind them. I did not accept the
   commit message, the commit subject's `research:` prefix, or any assertion about who typed it as
   evidence of anything. Had the same bytes arrived from Account A, this report would be identical.

One factual note for the coordination record, not a finding: the commit is subject-prefixed
`research:` although the stated implementer is Codex. That is a labelling question for Codex's
ledger, not an evidence question, and it is outside my write path.

---

## 12. Reviewer limitations

Stated plainly so that no reader infers a check that did not run.

- **L-1 — No new literature search.** R3 §9 forbade one and no finding here depends on one. My source
  verification went to the committed extraction records and their quoted verbatim locators, not to
  the publishers. I did not re-download G1944 or the 2023 meta-analysis in this round; R3 verified
  both against the primary sources at `becc668`, and those extraction bytes are unchanged here
  (§6.1).
- **L-2 — Carry-forward is bounded by the hash proof.** For the 242 paths byte-identical to the
  R3-reviewed candidate I relied on R1/R2/R3's verified closures rather than repeating them. That is
  sound only because the bytes are provably identical (§6.1). It is not a fresh audit of those
  artifacts, and I do not claim one.
- **L-3 — The role-path result in §10.5 is not independent boundary evidence.** CLAUDE.md requires
  that result to come from Codex or CI executing the checker from a **trusted checkout** against my
  worktree with `--repository`. I ran it from the worktree under review. For the _remediation_ range
  this is mitigated — the range is two immutable commits and my checkout was unmodified when it ran —
  but for _my own_ role path it proves nothing, because I control this checkout. Codex or CI must
  re-run `check-role-paths.mjs claude-review --base 1cdf3ebf321be0f0f837fb3d8709708a83cad549
--allowed-path reviews/evidence/SBLA-009-r4.md --repository C:\src\s009review-r4` from a trusted
  checkout before treating my one-path compliance as verified.
- **L-4 — `pnpm verify` ran from this worktree.** The same caveat in weaker form: the result is
  reproducible from the candidate commit, but it is my execution, not CI's.
- **L-5 — I cannot verify who authored the change** (§11). I evaluated the artifact.
- **L-6 — Single reviewer.** `defaultIndependentReviewCount` is 1 and no named material risk
  justifies an extra layer, so this closure rests on one independent reviewer. R3-M-9's
  single-screener limitation on G1944 is unchanged and still stands against the underlying evidence.
- **L-7 — Scope.** This report judges the SBLA-009 evidence pass and its three content drafts. It is
  not a promotion review; nothing here authorises publication to `content/`, which Codex owns.
- **L-8 — The two new Minors are deferred, not resolved.** R4-M-1 and R4-M-2 remain open against the
  artifact at this commit.

---

## 13. Criterion-by-criterion matrix

| #   | Acceptance criterion                                                            | Result   | Evidence                                                                                     |
| --- | ------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| 1   | Candidate commit, tree, branch and cleanliness match the assignment             | **PASS** | §1.1 — `1cdf3eb` / `d02c48f` / `claude-review/SBLA-009-r4` / clean                           |
| 2   | Candidate descends directly from the final R3 report commit                     | **PASS** | §1.2 — parent is `1b28cb7`; linear, no merge                                                 |
| 3   | Exact one-path review claim exists at `0cfa1bb` and matches this session        | **PASS** | §1.3 — one owned path; branch, worktree and base all match                                   |
| 4   | R1, R2, R3 reports present and unaltered                                        | **PASS** | §1.4 — three SHA-256 values cross-agree with independently written records                   |
| 5   | Exactly the two named files changed                                             | **PASS** | §4.1 — `--name-status`, `--raw`, count = 2                                                   |
| 6   | Exactly one atomic-claim `plainLanguage` leaf changed in the JSON               | **PASS** | §4.2 — 1 differing node of 1,261; no key, order or length change                             |
| 7   | Exactly two bench-draft sentences changed                                       | **PASS** | §4.3 — two hunks; rest of the file byte-identical                                            |
| 8   | No source, qualifier, grade, ID, version, absence record or other field changed | **PASS** | §4.2 table — every field class unchanged, including `artifactVersion 2.0.0`                  |
| 9   | Sentence 1 entailed by the cited claim                                          | **PASS** | §3.2 — matches qualifier 1; `low` register per master plan §9.5                              |
| 10  | Sentence 2 entailed, including G1944's matched-pronated null                    | **PASS** | §3.3 — verbatim source sentence; restriction carried                                         |
| 11  | Sentence 2 entailed for the 2023 meta-analysis result, with the correct sign    | **PASS** | §3.3 — SMD 1.80, p = 0.017; inclination-family sign convention resolved by the Results prose |
| 12  | Sentence 3 entailed by the cited claim                                          | **PASS** | §3.4                                                                                         |
| 13  | Unedited sentences citing the claim survive the weakening                       | **PASS** | §3.5 — all three re-read and still entailed                                                  |
| 14  | No old overstrong phrase or equivalent universal language survives              | **PASS** | §5 — 20 constructions searched; every hit is a negation, comparative or unrelated            |
| 15  | All draft claim citations resolve                                               | **PASS** | §3.6 — 71 citations, 0 unresolved                                                            |
| 16  | All wording changes move strength downward only                                 | **PASS** | §3.2–§3.4; clause B is weaker than its source supports                                       |
| 17  | R1's fourteen blocking findings remain closed                                   | **PASS** | §6.2                                                                                         |
| 18  | R2's four Important findings remain closed                                      | **PASS** | §6.3 — including N-3, which the no-version-bump discipline protects                          |
| 19  | R3's N5-1 is closed                                                             | **PASS** | §3, §6.4                                                                                     |
| 20  | R3's nine Minors remain nonblocking and were not silently absorbed              | **PASS** | §7 — each verified at its cited location                                                     |
| 21  | Full repository-pinned `pnpm verify` green                                      | **PASS** | §10.1 — 13/13 stages, Node v24.20.0, pnpm 11.24.0, exit 0                                    |
| 22  | Targeted formatting, JSON and whitespace assertions                             | **PASS** | §10.2, §10.3 — `git diff --check` exit 0; no BOM or CRLF; Prettier clean                     |
| 23  | No artifact under review was repaired, reformatted or staged                    | **PASS** | §10.4 — clean tree; one path written                                                         |
| 24  | Remediation stayed inside its write boundary                                    | **PASS** | §10.5, §11 — `claude-research` boundary honoured; `writeBoundaries.codex = null`             |
| 25  | Review independence preserved despite Codex implementation                      | **PASS** | §11 — distinct account; no authoring rationale received; artifact judged on bytes            |
| 26  | Zero unresolved Critical                                                        | **PASS** | §8                                                                                           |
| 27  | Zero unresolved Important                                                       | **PASS** | §8                                                                                           |

27 of 27 criteria pass.

---

## 14. Bounded plan

**None is required.** There is no unresolved Critical or Important finding, so no remediation round
follows this report and no further review layer is warranted. CLAUDE.md is explicit: "Do not request
or create extra review layers after PASS unless a new named material risk changes the acceptance
scope." I name no such risk.

The two new Minors (R4-M-1, R4-M-2) and the nine carried forward from R3 are **recorded, not
scheduled**. They should be folded into the next content round or the SBLA-011 promotion record at
their stated destinations. They must not be treated as reopening this acceptance, and they must not
be silently dropped.

For Codex, two follow-ups that are outside my write path:

1. Close the R4 review claim in `docs/runbooks/current-work.md` once this report is committed
   (`lifecycle.reviewClaimCloses: immutable-review-report-commit`).
2. Re-run the role-path checker from a trusted checkout against this worktree, per L-3, before
   treating my one-path compliance as independently verified.

---

## 15. Verdict

**PASS.**

**0 Critical · 0 Important · 2 new Minor (nonblocking) · 9 Minor carried forward from R3.**

The one bounded remediation prescribed by `reviews/evidence/SBLA-009-r3.md` §9 was executed exactly
as bounded and no further. R3's single Important finding N5-1 is closed: the atomic claim no longer
contradicts itself, and the reader-facing bench-press page no longer asserts a universal that its own
retrieved evidence refutes. The page now names the counter-example rather than omitting it. Every
wording change moves strength downward; no certainty, applicability, direction or magnitude grade
moved in either direction; no source, locator, qualifier, ID, version or absence record changed; and
242 of 245 tracked paths are byte-identical to the candidate I reviewed at R3.

This satisfies the acceptance rule in CLAUDE.md, AGENTS.md and `operating-policy.json`: zero
unresolved Critical and zero unresolved Important findings.

---

**Reviewed candidate:** `1cdf3ebf321be0f0f837fb3d8709708a83cad549`
**Reviewed tree:** `d02c48f46ae6cd60261c102d47f84390e1648acb`
**Remediation base:** `1b28cb7e96f83cfd033f89e2e6b589c641a07e5a`
**R3-reviewed artifact commit:** `becc6682c6a23da9c1f78f61ffb980daf4055c1f`
**Coordination claim:** `0cfa1bb831727fe10779220a1b1f36c74ad9365f`
**This report:** `reviews/evidence/SBLA-009-r4.md` — append-only; R1, R2 and R3 are untouched.
