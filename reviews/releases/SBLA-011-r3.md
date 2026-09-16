# Release review: SBLA-011 criterion-13 focused recheck, round 3

**Task:** SBLA-011 — the owner-authorized focused independent recheck of criterion 13
("certainty-lint exceptions are narrowly bounded") after the second bounded remediation that answers
`I5-R2`, the sole Important finding in `reviews/releases/SBLA-011-r2.md` (master plan §18 queue row
SBLA-011; §14 Phase 1).
**Reviewer role:** Claude Review (Account B), independent adversarial release audit.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
advise on, or remediate any SBLA-011 artifact, and I did not participate in the read-only patch-design
advice that `reviews/releases/SBLA-011-owner-authorization-r3.md` assigns to Claude Code account A. I
received no authoring-role reasoning beyond the committed artifacts, the committed handoffs, and the
coordination ledger. I am the same Account-B role that produced R1 and R2; this is the focused recheck
the owner authorization scheduled, not a self-granted additional review layer.
**Review date:** 2026-09-16.
**Reviewer worktree:** `C:\src\s011review-r3`
**Reviewer branch:** `claude-review/SBLA-011-r3`
**Reviewer write path:** `reviews/releases/SBLA-011-r3.md` — sole permitted path, pre-claimed by Codex
before I wrote (AGENTS.md role table; CLAUDE.md "Never repairs the artifact under review";
`operating-policy.json` `writeBoundaries["claude-review"] = ["reviews/"]`). Every adversarial probe ran
in a scratch working copy held outside the repository.

**Reviewed candidate commit:** `f95cfaf0296332b02bb9df8a49128228a5a7d574` _(immutable)_
**Reviewed candidate tree:** `ae7c8ac3beeb93683af1f97fbafea79803fdc6f7` _(immutable)_
**Remediation implementation commit:** `0a2bc3622f674ac9c9409e7c7933a86b3a61a5ee`, tree
`adb3d9e05acb2a81e35df2e5645101e4f4cb635b`
**Failed R2 candidate:** `ebb1e41bc115e281255c72b3b7242ebc8096cc4d`, tree
`79475730e53bc834ce98731a86f195316b43cf9f`
**Failed R1 candidate:** `478411a7aa11da717d7a3de29fe7ad93d0d3604a`, tree
`c527f9d26de03890d9ad2d8ebca61c968ff76f0d`
**Governing R2 report:** `reviews/releases/SBLA-011-r2.md` at commit
`462c4fb55c14e5618bac936f2e5a30abb487e887` — FAIL, 0 Critical, 1 Important (`I5-R2`), 5 new Minor
**Governing R1 report:** `reviews/releases/SBLA-011-r1.md` at commit
`a01824ffdaf5b37488e907b37146db857773fb6c` — FAIL, 1 Critical, 6 Important, 9 Minor
**Governing authorization:** `reviews/releases/SBLA-011-owner-authorization-r3.md` on
`origin/codex/SBLA-007-review-coordination` at `b5d045db83f4e5d6db273123fbdde1e7d1ee31d6`
**Governing handoff:** `reviews/releases/SBLA-011-r2-remediation-handoff.md`, SHA-256
`f692da8104b043096f4a863a8b7b4cfb3e3599d98e237628ea4d6741a7be2399`
**Accepted base commit:** `6e5948f6423d0e603ef4838c3393398c47c27c9b`
**Committed graph bundle:** `public/data/evidence-graph.v1.json`, SHA-256
`4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`, 67,877 bytes, blob
`df815a014e3eff5c6c93638e8d198f58f9c052c9` — SHA-256 identical to the value R2 recorded, so the bundle
is unchanged across all three rounds. (R2's header stated 67,872 bytes; the true size at every one of
the three candidate commits is 67,877. The digest, not the transcribed byte count, is what binds, and
the digest matches.)
**Primary files under review:**

| Path                                    | SHA-256 at the candidate                                           |
| --------------------------------------- | ------------------------------------------------------------------ |
| `src/lib/content/validation.ts`         | `bef6f9c2b64ef811becf2305f32c884357098b30153dfe7ca31febf5a149f40b` |
| `tests/unit/content-validation.test.ts` | `759477787d37dfa71caa402652ec680a32635d8c7b5b3530ecc7e359af1fb890` |

**Runtime used:** Node.js `v24.20.0`, pnpm `11.24.0` (pinned exactly per AGENTS.md "Runtime"). The host
default Node.js on this machine is `v24.14.0`, which does not satisfy the `>=24.20.0 <25` engine; every
command recorded below ran under the pinned `v24.20.0` toolchain, not the host default.

---

## 0. Verdict

**FAIL — 0 Critical, 1 Important, 3 Minor (nonblocking).**

The acceptance rule in CLAUDE.md, AGENTS.md and `operating-policy.json` (`passRequiresZeroCritical`,
`passRequiresZeroImportant`) is **not** satisfied. One Important finding, `I7-R3`, remains open against
criterion 13.

**This verdict should not obscure how much of the remediation succeeded.** The defect `I5-R2` actually
described — exception tests evaluated against `clauseContaining(statement, match.index)` on the
universal path, so that a comma-joined rider inherits a neighbouring token's exemption — **is closed,
completely and correctly.** I replayed every probe in R2 §3.7 and every one now behaves as it should:

```
R2 3.7 minimal triples (A, B, C) + period/semicolon controls   15/15 correct
R2 3.7 six fresh overclaims that passed in R2                   6/6 now rejected
R2 3.7 legitimate scoped controls that must stay clean         10/10 still clean
                                                        total  30/30 correct
```

The rejection provably lands **on the joined rider token**, not on the legitimate scoped control
(§3.2). The causal single-trial exception withstood 10 of 10 fresh new-subject attacks and the causal
hedge exception 9 of 10 (§3.3). All 46 promoted `statement`/`plainLanguage` texts and all 89 qualifier
fields remain accepted with zero issues and zero content change (§3.4). Nothing regressed at any of the
three candidate commits (§4.4). `pnpm verify` is green twice on the pinned runtime with every count
matching the handoff exactly (§7).

**Why it still fails.** Criterion 13's acceptance text is "certainty-lint exceptions are narrowly
bounded," and the owner authorization scoped this remediation to making exceptions "apply to the
matched universal **or causal** token rather than the whole punctuation clause." Two exception sites
were not converted to that discipline, and each still lets a legitimate scoping device license an
unrelated assertion joined to it by a coordinating conjunction:

| Mechanism                                                                            | Example that passes the gate clean                                        |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **A** — negation-prefix window, universal path (`validation.ts:197`)                 | "This is not always true and all lifters gain size."                      |
| **B** — single-causal-token whole-clause fallback, causal path (`validation.ts:453`) | "Limited evidence suggests a change, but volume causes strength." (`low`) |

Mechanism B is literally `clauseContaining` — the function `I5-R2` named — still ungoverned on the
causal path, and it reproduces R2's own diagnostic signature exactly: the comma-joined form is clean
while the semicolon and period forms are correctly rejected (§4.2). Fifteen natural-prose statements in
total pass the gate but should not (8 universal-path, 7 causal-path), including "All lifters gain
size", "everyone responds" and "all humans respond" — precisely the generic-promise class master plan
§10.8 and this criterion exist to block.

**Both mechanisms are pre-existing, not introduced by this patch** (§4.4). That bears on remediation
sizing and on how the owner may wish to weigh the finding; under the repository's written grading rule
it does not change the severity, because R1 and R2 both graded this same class Important on the same
criterion, and the practical mitigation profile is identical to the one R2 recorded when it graded
`I5-R2` Important: nothing is published, all 26 records are unpublished, and every promoted text passes.

**One prior finding is closed by evidence rather than left pending.** R2 Minor `N1` asserted that eight
certainty-exception branches "serve no promoted claim" and recommended deleting them as part of the
`I5-R2` fix. That premise was incomplete: it counted only the 46 `statement`/`plainLanguage` fields. I
built a scratch variant with exactly those eight branches disabled and measured the result — **nine
promoted qualifier fields fail**, matching the handoff's account precisely (§3.5). The remediation
author was right to retain and token-anchor the branches instead of deleting them, and right to record
the failed first attempt. `N1` should be closed as not-actionable, not carried forward.

§10 states the fix neutrally and bounds it. Whether to spend a third remediation, accept the residual
with a recorded destination, or defer criterion 13 to SBLA-012 is the owner's decision under the review
stop rule, not mine; §10.2 restates the options without recommending one.

---

## 1. Provenance verification — performed before reading anything under review

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD                f95cfaf0296332b02bb9df8a49128228a5a7d574   ✓ required candidate
$ git rev-parse HEAD^{tree}         ae7c8ac3beeb93683af1f97fbafea79803fdc6f7
$ git rev-parse --abbrev-ref HEAD   claude-review/SBLA-011-r3                  ✓ required branch
$ git status --porcelain=v1         (no output)                                ✓ clean
$ git worktree list | grep r3       C:/src/s011review-r3   f95cfaf [claude-review/SBLA-011-r3]
```

The worktree is `C:\src\s011review-r3`, the directory the assignment names. HEAD equals the immutable
candidate `f95cfaf0296332b02bb9df8a49128228a5a7d574` exactly.

### 1.2 Ancestry

```
$ git merge-base --is-ancestor origin/main HEAD    → true (exit 0)
$ git log --oneline --decorate HEAD
f95cfaf  docs: hand off SBLA-011 criterion-13 remediation      ← candidate
0a2bc36  fix: anchor certainty exceptions to matched tokens     ← R2 remediation implementation
462c4fb  review: recheck SBLA-011 remediation R2 — FAIL         ← R2 report commit
ebb1e41  docs: hand off SBLA-011 R1 remediation                 ← failed R2 candidate
805a75b  fix: enforce SBLA-011 publication gates                ← R1 remediation implementation
a01824f  review: audit SBLA-011 production slice R1 — FAIL      ← R1 report commit
478411a  docs: hand off SBLA-011 production slice               ← failed R1 candidate
8df97fc  feat: build approved evidence vertical slice
6e5948f  review: audit SBLA-009 evidence pass R4 — PASS         ← accepted base, origin/main
```

The lineage is exactly the one the governing documents describe: accepted `main` → production slice →
R1 FAIL → bounded remediation → R2 FAIL → owner-authorized second bounded remediation → this candidate.
The candidate is a descendant of accepted `main` and of both immutable review reports, so neither prior
report can have been rewritten beneath it.

### 1.3 Remote parity

```
$ git fetch origin --prune                                    (exit 0, no new objects)
$ git rev-parse origin/codex/SBLA-011-r2-remediation          f95cfaf0296332b02bb9df8a49128228a5a7d574
$ git rev-parse origin/codex/SBLA-007-review-coordination     b5d045db83f4e5d6db273123fbdde1e7d1ee31d6
$ git rev-parse origin/claude-review/SBLA-011-r2              462c4fb55c14e5618bac936f2e5a30abb487e887
$ git rev-parse origin/claude-review/SBLA-011-r1              a01824ffdaf5b37488e907b37146db857773fb6c
$ git rev-parse origin/main                                   6e5948f6423d0e603ef4838c3393398c47c27c9b
$ git rev-parse origin/claude-review/SBLA-011-r3              (does not exist — expected; this report
                                                               creates it)
```

The candidate I am reviewing is published at the remote under the remediation branch and is
byte-identical to my local HEAD. The coordination branch is at the exact commit the assignment names.

### 1.4 The exact one-path review claim, verified before writing

From `docs/runbooks/current-work.md` at coordination commit `b5d045d`, **Active claims**:

| Field            | Recorded value                             |
| ---------------- | ------------------------------------------ |
| Task             | SBLA-011 criterion-13 recheck R3           |
| Role             | Claude Review (account B)                  |
| Branch           | `claude-review/SBLA-011-r3`                |
| Worktree         | `C:\src\s011review-r3`                     |
| Base commit      | `f95cfaf0296332b02bb9df8a49128228a5a7d574` |
| Started          | 2026-09-16 16:16 EDT                       |
| Expected handoff | `reviews/releases/SBLA-011-r3.md`          |
| Paths owned      | `reviews/releases/SBLA-011-r3.md`          |

Every field matches my session. Codex recorded the claim on my behalf, as CLAUDE.md requires, and I
verified it existed before writing my permitted output. I did not edit the ledger.

### 1.5 Role-path boundary

My complete diff from the candidate adds exactly one regular file, `reviews/releases/SBLA-011-r3.md`,
and modifies, deletes or renames nothing. Scratch probe material was created **outside** the repository
tree, under the session scratch directory, and the working tree was confirmed clean after every probe
run and after both `pnpm verify` runs (§7.4). `node_modules/` was installed to run the pinned gate; it
is covered by `.gitignore:4` (`git check-ignore -v node_modules/` → `.gitignore:4:node_modules/`) and
never appears in `git status --porcelain=v1`.

Per CLAUDE.md, the authoritative role-path result must come from Codex or CI running
`scripts/foundation/check-role-paths.mjs` from a **trusted** checkout against this worktree with
`--repository` and `--allowed-path reviews/releases/SBLA-011-r3.md`. I did not run that checker from my
own mutable role branch and I do not present any self-run result as boundary evidence. The statement
above is a description of my diff, to be confirmed independently.

---

## 2. Methods, and the limits of this review

This is a **focused criterion-13 recheck plus regression safety**, as the owner authorization and the
remediation handoff define it. It is deliberately **not** a third complete-artifact audit, and §8
marks plainly which criteria were re-derived and which were checked only for regression.

For every mechanism I wrote an **independent** probe rather than reading the candidate's own test for
it, and paired every negative probe with a **positive control**, so that a blocked exploit is
distinguishable from a gate that rejects everything. Where the remediation supplied fixtures, I treated
them as claims to be checked, not as evidence.

**Probe isolation.** Probes ran against a `git archive HEAD` export held outside the repository, so the
code under probe is the candidate's code byte for byte:

```
$ git show HEAD:src/lib/content/validation.ts | sha256sum
bef6f9c2b64ef811becf2305f32c884357098b30153dfe7ca31febf5a149f40b
$ sha256sum <scratch-export>/src/lib/content/validation.ts
bef6f9c2b64ef811becf2305f32c884357098b30153dfe7ca31febf5a149f40b
```

The exported module was imported directly under Node 24 type-stripping and exercised through the real
exported entry point `lintClaimLanguage`, which is the same function `validateRecordGraph` calls at
`validation.ts:766`, `:771` and `:777`. No probe reimplemented or approximated the gate.

**Cross-version probing.** Because a recheck must distinguish "this patch did not fix X" from "this
patch broke X", I exported the R1 candidate (`478411a`) and the failed R2 candidate (`ebb1e41`)
alongside the current one and ran the same statements against all three (§4.4). That is how every
finding below is classified as pre-existing rather than regressive.

**Beyond replaying R2.** R2's own statements were available to the remediation author as targets, so
passing them proves only that the author read the report. Every family probe in §4 is fresh, written
against the **new** exception logic after reading the diff.

Limits are recorded in §11.

---

## 3. What the remediation closed — verified independently

### 3.1 The named `I5-R2` mechanism is closed on the universal path

`I5-R2` stated: each exception is tested against `clauseContaining(statement, match.index)`, which
splits only on `.`, `;`, `!`, `?`, so a comma-joined rider shares the clause with a scoped quantifier
and inherits its exemption; "the matched token is never required to be the scoped one."

The patch replaces the whole-clause test with `clausePrefixBefore(statement, match.index)` and
`clauseSuffixAfter(statement, match.index + match[0].length)`, both derived from the **current** match
index, and requires each exception's defining syntax to sit immediately around the token being
adjudicated. The two widest branches additionally carry a tempered-greedy guard that refuses to span an
earlier universal token, and the sample branch now requires the noun after the current `every` to agree
with the enumerated sample noun.

Replaying **R2 §3.7 verbatim**, all three minimal triples:

| #   | Statement                                                                                  | R2        | R3 (this candidate) |
| --- | ------------------------------------------------------------------------------------------ | --------- | ------------------- |
| A   | "In 20 participants, every participant gained size."                                       | clean     | **clean**           |
| A   | "Every lifter everywhere benefits."                                                        | REJECT    | **REJECT**          |
| A   | "In 20 participants, every participant gained size, and every lifter everywhere benefits." | **clean** | **REJECT**          |
| B   | "Five studies, all in trained men, report a change."                                       | clean     | **clean**           |
| B   | "All lifters gain size."                                                                   | REJECT    | **REJECT**          |
| B   | "Five studies, all in trained men, show all lifters gain size."                            | **clean** | **REJECT**          |
| C   | "Every tier-1 programme in this slice works."                                              | clean     | **clean**           |
| C   | "Every lifter gains from it."                                                              | REJECT    | **REJECT**          |
| C   | "Every tier-1 programme in this slice works, and every lifter gains from it."              | **clean** | **REJECT**          |

And R2's punctuation controls, which existed to prove clause scope was the cause:

```
REJECT  "In 20 participants, every participant gained size. Every lifter everywhere benefits."
REJECT  "In 20 participants, every participant gained size; every lifter everywhere benefits."
REJECT  "In 20 participants, every participant gained size, and every lifter everywhere benefits."
```

All three now agree. The comma form no longer diverges from the period and semicolon forms, which is
exactly the property `I5-R2` said was missing.

All six fresh overclaims that R2 recorded as passing are now rejected:

| R2 statement                                                                               | R2        | R3         |
| ------------------------------------------------------------------------------------------ | --------- | ---------- |
| "In 20 participants, every participant gained size, and every lifter everywhere benefits." | **clean** | **REJECT** |
| "The study reports that every specimen behaved this way, so every athlete will too."       | **clean** | **REJECT** |
| "Five studies, all in trained men, show all lifters gain size."                            | **clean** | **REJECT** |
| "Across seven trials, all 7 trials agree that all humans respond."                         | **clean** | **REJECT** |
| "Every tier-1 programme in this slice works, and every lifter gains from it."              | **clean** | **REJECT** |
| "Normalised every value, we conclude every athlete improves."                              | **clean** | **REJECT** |

And all ten legitimate scoped controls, including R2's two, stay clean — so this is not a gate that
simply rejects everything:

```
clean  "Not all lifters gain size from this programme."
clean  "There is no evidence at all that this transfers."
clean  "The study reports that every specimen behaved this way."
clean  "Across seven trials, all 7 trials agree."
clean  "Normalised every value, we report a change."
clean  "The contrast is whole programmes differing in every exercise, not two chest exercises."
clean  "It may never be sole support."
clean  "It can never be evidence of causation."
clean  "Of all the pectoralis muscles, one was measured."
clean  "Programmes, protocols and loads all vary."
```

**Total: 30 of 30 correct, 0 false rejections.**

### 3.2 The rejection lands on the joined rider, not on the scoped control

The handoff's acceptance criterion 2 requires the rider to be "rejected **at** the offending joined
token, with the legitimate scoped control still clean" — not merely that some issue is raised
somewhere. `lintClaimLanguage` emits one `CERTAINTY_UNIVERSAL` issue per text without a character
offset, so I localised the rejection by two independent means.

**Rider-neutralisation.** For each joined attack I removed _only_ the rider's universal token, leaving
every other word and the scoped part untouched. If the sentence then goes clean, the scoped token
retained its exemption inside the joined sentence and the rider is what was caught:

| #   | Joined attack | Rider neutralised                                                            |
| --- | ------------- | ---------------------------------------------------------------------------- |
| A   | REJECT        | clean — "…every participant gained size, and trained lifters benefited."     |
| B   | REJECT        | clean — "Five studies, all in trained men, show trained lifters gain size."  |
| C   | REJECT        | clean — "…in this slice works, and trained lifters gained from it."          |
| F2  | REJECT        | clean — "…every specimen behaved this way, so the cohort did too."           |
| F4  | REJECT        | clean — "Across seven trials, all 7 trials agree that the cohort responded." |
| F6  | REJECT        | clean — "Normalised every value, we conclude the cohort improved."           |

6 of 6. **Incremental truncation.** Independently, the prefix of each joined sentence up to the rider is
clean in every case:

```
clean  "In 20 participants, every participant gained size, and "
clean  "Five studies, all in trained men, show "
clean  "Every tier-1 programme in this slice works, and "
clean  "The study reports that every specimen behaved this way, so "
clean  "Across seven trials, all 7 trials agree that "
clean  "Normalised every value, we conclude "
```

Both methods agree: the scoped token keeps its exemption and the rider is rejected. Acceptance
criterion 2 is met for every `I5-R2` example.

### 3.3 The causal new-assertion boundary holds on the two exceptions the patch bounded

The handoff's Required reviewer action item 4 asks for fresh new-subject causal attacks on the
single-trial and hedge exceptions, with same-subject coordinated outcomes confirmed clean. I ran 40
causal probes at `certainty: 'low'`.

**Single-trial preamble — 10 of 10 new-subject attacks rejected**, one per boundary token:

```
REJECT  "…the programme increased pectoralis thickness, and chest training increases size in everyone."
REJECT  "…the programme increased thickness, so resistance training causes hypertrophy."
REJECT  "…the programme increased thickness; bench pressing produces growth."
REJECT  "…the programme increased thickness while heavy loading reduces injury."
REJECT  "…the intervention increased size, although volume causes strength."
REJECT  "…the programme increased thickness, however training prevents atrophy."
REJECT  "…the programme increased thickness, but fly variations improve activation."
REJECT  "…the programme increased thickness, yet cable work enhances stretch."
REJECT  "…the programme increased thickness, whereas machines reduce stability."
REJECT  "…the programme increased thickness, though dumbbells produce more range."
```

**Same-subject coordinated outcomes stay clean — 4 of 4**, which is the property that makes the fix a
scoping rule rather than a blanket ban:

```
clean  "In one 12-week trial of 20 trained men, the programme increased pectoralis thickness."
clean  "In one 12-week trial of 20 trained men, the programme increased thickness and improved strength."
clean  "In a single trial of 14 participants, the intervention increased size, increased strength and reduced soreness."
clean  "Within one 8-week study of 30 lifters, the press increased activation and produced a measurable change."
```

The `NEW_ASSERTION_BOUNDARY` negative lookahead that exempts a coordinated causal verb is doing real
work and is correctly adverb-tolerant:

```
clean   "Chest training may increase thickness and significantly improves strength."
clean   "In one 12-week trial of 20 trained men, the programme increased thickness and reliably improves strength."
```

**Hedge / low-calibration preamble — 9 of 10 new-assertion attacks rejected**, plus both sentence-
boundary controls and all five positive controls correct. The single failure is the entry point to
`I7-R3` mechanism B and is developed in §4.2.

**Ascent/descent moment-arm branch and direct negation** behave correctly:

```
clean   "During the ascent the moment arm about the shoulder axis decreases."
REJECT  "During the ascent the moment arm about the shoulder axis decreases and training increases size."
clean   "Chest training does not increase pectoralis thickness."
clean   "The press did not increase activation."
```

**Certainty gating is intact** — the causal rule fires only at `low` and `very-low`:

```
clean   "Chest training increases pectoralis thickness."   certainty=moderate
clean   "Chest training increases pectoralis thickness."   certainty=high
REJECT  "Chest training increases pectoralis thickness."   certainty=low
```

**Total: 39 of 40 correct, 0 false rejections.**

### 3.4 The promoted corpus and qualifier validation are accepted, with no content change

I loaded the real records from `content/claims/` and linted them through the candidate's own
`lintClaimLanguage`, applying the same code filter `validateRecordGraph` applies to qualifiers:

```
claim record files                                        23
statement fields linted                     23   issues:   0
plainLanguage fields linted                 23   issues:   0
promoted statement + plainLanguage texts    46   issues:   0
qualifier fields linted                     89   gated issues: 0
certainty distribution  {"low":11,"moderate":7,"very-low":2,"high":1,"established-descriptive-fact":2}
```

Zero issues across all 135 promoted texts. Of these, 3 statement/plainLanguage texts and 10 qualifier
texts contain a universal token at all, so the exemption surface is genuinely exercised by real content
rather than being dead code (§3.5).

Full graph validation agrees, from the real gate rather than from my harness:

```
$ pnpm validate:graph
Graph validation passed: 94 nodes and 120 edges match deterministic output.
```

No promoted record changed. Compared at the Git tree level — a byte-exact comparison of every file and
name in each directory — against **both** the failed R2 candidate and the R2 report commit:

| Directory         | `ebb1e41` → `f95cfaf`                                | `462c4fb` → `f95cfaf` |
| ----------------- | ---------------------------------------------------- | --------------------- |
| `content/`        | identical `f4192f51bc5040e33bf912490d3e6bf8623ce701` | identical             |
| `content-drafts/` | identical `f855bf4f343c8f4885a7f9762c2e9e1841ff0cee` | identical             |
| `research/`       | identical `34ec149cace33c941898d38f60ff5559f69c6c34` | identical             |
| `public/data/`    | identical `b1d96bba3f89253374134ad18afff632bab37d09` | identical             |
| `docs/`           | identical `7a47fadcc0a25eab1f4a13c6e68bd3d9568f3e90` | —                     |

No content, research, approval, or graph-data path changed. The graph bundle blob is
`df815a014e3eff5c6c93638e8d198f58f9c052c9` at the candidate, identical to its value at `ebb1e41`.

Publication remains fail-closed across every promoted record:

```
records with publicationState        26
states                               {"unpublished": 26}
non-null ownerApprovedAt              0
non-null approvalManifestId           0
non-null contentChecksum              0
content/approval-manifests/          empty
content/changes/                     empty
```

### 3.5 R2 Minor `N1` is closed by measurement — the eight branches are load-bearing

R2 Minor `N1` stated that eight certainty-exception branches "serve no promoted claim" and R2 §9.1
advised deleting them first, saying it "may be most of the fix". The handoff records that the first
implementation followed that advice, that full graph validation then failed closed on **nine promoted
qualifier fields**, and that the branches were therefore retained and token-anchored instead.

That is a decision to depart from a review's written guidance, so I measured it rather than accepting
it. I built a scratch variant of the candidate validator — outside the repository, with the candidate's
own file as input — disabling exactly the eight branches `N1` named, and diffed the promoted-corpus
result against the candidate:

```
Promoted fields that PASS on the candidate but FAIL with all eight
R2-Minor-N1 branches disabled: 9

  - claim-bench-press-inclination-shifts-regional-activation.qualifiers.7
        "Electromyography is never evidence of hypertrophy."
  - claim-multi-joint-versus-single-joint-programme-strength.qualifiers.2
        "The contrast is whole programmes differing in every exercise, not two chest exercises."
  - claim-pectoralis-major-hypertrophy-with-chest-resistance-training.qualifiers.0
        "Three usable trials, all small, and they are the same three the appraisal section 2.1 …"
  - claim-pectoralis-major-hypertrophy-with-chest-resistance-training.qualifiers.2
        "Ten further eligible tier-1 trials … recorded for all ten on 2026-09-13; all ten remain closed …"
  - claim-pectoralis-major-hypertrophy-with-chest-resistance-training.qualifiers.3
        "… the imaging plane, the measurement site and operator experience all change the number obtained."
  - claim-pectoralis-major-innervation.qualifiers.0
        "… a Sihler-stained series reports the muscle mainly innervated by the lateral pectoral nerve …
         with an intercostal contribution in every specimen."
  - claim-pectoralis-major-surface-emg-limitation.qualifiers.1
        "It applies to every tier-4 activation statement in this slice, including the ones drafted here."
  - claim-press-versus-fly-activation-mixed.qualifiers.2
        "… normalised every exercise to the bench press itself … and may never be sole support."
  - claim-press-versus-fly-activation-mixed.qualifiers.8
        "Electromyography is never evidence of hypertrophy."
```

Exactly nine, matching the handoff's figure. Zero `statement` or `plainLanguage` fields are affected —
which is precisely why R2's count missed them: `N1` measured the 46 public texts and did not measure
the 89 qualifier fields, which `validateRecordGraph` also lints for `CERTAINTY_UNIVERSAL` and
`OUTCOME_REQUIRED` at `validation.ts:776–786`.

Mapping each of `N1`'s eight branches to the promoted text that needs it:

| `N1` branch                      | Required by                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `never be evidence of`           | 2 qualifier fields ("Electromyography is never evidence of …") |
| `… differing in every …`         | `claim-multi-joint-versus-single-joint-programme-strength.q2`  |
| `<N> studies, all`               | `…hypertrophy-with-chest-resistance-training.q0` ("all small") |
| `all <N>`                        | `…hypertrophy-with-chest-resistance-training.q2` ("all ten")   |
| `all change\|vary\|differ`       | `…hypertrophy-with-chest-resistance-training.q3`               |
| `study reports … every specimen` | `claim-pectoralis-major-innervation.q0`                        |
| `tier-\d … in this slice`        | `claim-pectoralis-major-surface-emg-limitation.q1`             |
| `normalised every …`             | `claim-press-versus-fly-activation-mixed.q2`                   |

The tenth universal-bearing qualifier, `claim-pectoralis-major-innervation.qualifiers.3` ("not on all
80 specimens"), relies on the negation-prefix branch, which `N1` did not list — which is why the count
is nine and not ten.

**Conclusion:** the handoff's account is accurate, the retain-and-anchor decision was correct, and the
disclosure of the failed first attempt was the right thing to record. R2 Minor `N1`'s premise was
incomplete and the finding should be closed as not-actionable rather than carried forward. I am
recording this because a later reader following R2 §9.1 would otherwise re-attempt a deletion that
fails closed.

### 3.6 The regression fixtures are substantive, not vacuous

`tests/unit/content-validation.test.ts` adds 11 paired laundering cases, and each pair asserts **both**
halves — `expect(lintClaimLanguage(scopedPart, 'moderate')).toEqual([])` for the legitimate control and
`.toContain('CERTAINTY_UNIVERSAL')` for the joined statement. A gate that simply rejected everything
would fail the first assertion. It also adds R2's period and semicolon controls, count-mismatch and
generic-factor attacks, three causal new-assertion attacks, three same-assertion positive controls
asserted with `toEqual([])`, and a guard that reads `content/claims/`, asserts exactly 23 files, and
requires zero issues on every `statement` and `plainLanguage` field. The fixtures test what the handoff
says they test.

---

## 4. What the remediation did not close — `I7-R3`

### 4.1 Mechanism A — the negation-prefix window launders a conjunction-joined universal

`src/lib/content/validation.ts:195–199`:

```ts
const prefix = statement.slice(Math.max(0, match.index - 48), match.index);
const token = match[0].toLowerCase();
if (token !== 'never' && /\bnot(?:\s+\w+){0,3}\s*$/i.test(prefix)) {
  continue;
}
```

This branch is unchanged by the patch. It is one of the twelve universal-exception families and it is
the one the handoff's Required reviewer action item 3 ("attack every remaining exception with a fresh
second universal token") sends a reviewer at. `prefix` is a raw 48-character window, not a clause
window, and `(?:\s+\w+){0,3}` permits up to three words between `not` and the matched token. A
coordinating conjunction fits inside that slack, so a negation that scopes an **earlier** predicate
exempts a **later, unrelated** universal.

Four fresh natural-prose attacks, all at `certainty: 'moderate'`:

| Statement                                                | Lint      |
| -------------------------------------------------------- | --------- |
| "This is not always true and all lifters gain size."     | **clean** |
| "The response is not uniform and all lifters gain size." | **clean** |
| "It is not settled but everyone responds."               | **clean** |
| "The finding is not robust yet all humans respond."      | **clean** |

The controls that prove the mechanism, and that reproduce R2 §3.7's diagnostic signature:

```
clean   "This is not always true."                                  ← scoped part alone, correctly clean
REJECT  "All lifters gain size."                                    ← rider alone, correctly rejected
clean   "This is not always true and all lifters gain size."        ← CONJUNCTION-joined: laundered
REJECT  "This is not always true, and all lifters gain size."       ← comma form: correctly rejected
REJECT  "This is not always true; all lifters gain size."           ← semicolon control
REJECT  "This is not always true. All lifters gain size."           ← period control
```

The comma, semicolon and period forms all reject; only the bare-conjunction form is clean. Wording is
identical across all four, so the joining device is the cause. "All lifters gain size", "everyone
responds" and "all humans respond" are exactly the generic promises master plan §10.8 and this
criterion exist to block, and the three legitimate negation controls the branch exists to serve stay
clean:

```
clean  "Not all lifters gain size."
clean  "This is not always true."
clean  "The effect is not universally observed."
```

The branch is genuinely needed — it is the only thing protecting
`claim-pectoralis-major-innervation.qualifiers.3` ("not on all 80 specimens") and the promoted
plainLanguage text "though not in every study that measured it" (§3.5). The defect is its breadth, not
its existence.

### 4.2 Mechanism B — the single-causal-token fallback is still whole-clause scoped

`src/lib/content/validation.ts:452–455`, the final statement of `hasUncalibratedCausalLanguage`:

```ts
return !(
  causalMatches.length === 1 &&
  hasLowCalibration(clauseContaining(statement, match.index))
);
```

This is unchanged by the patch, and it calls `clauseContaining` — the exact function `I5-R2` named as
the defect — with no reference to `crossesAssertionBoundary`. When a statement contains exactly one
causal token, any low-calibration word **anywhere in the same punctuation clause** exempts it,
regardless of how many new assertions intervene.

Seven fresh natural-prose attacks, all at `certainty: 'low'`, each asserting uncalibrated causation
about a subject the hedge never covered:

| Statement                                                                        | Lint      |
| -------------------------------------------------------------------------------- | --------- |
| "Limited evidence suggests a change, but volume causes strength."                | **clean** |
| "Limited evidence suggests a change, and volume causes strength."                | **clean** |
| "This is a hypothesis about the fly, so heavy loading causes growth."            | **clean** |
| "The data cannot establish a dose, but the bench press causes hypertrophy."      | **clean** |
| "There is no evidence for the crossover, yet the press causes growth."           | **clean** |
| "The result may be an artefact, however heavy loading produces hypertrophy."     | **clean** |
| "It is plausible that the sample was small, although training prevents atrophy." | **clean** |

The control triad, which is `I5-R2`'s signature reproduced exactly on the causal path:

```
clean   "Limited evidence suggests a change."                              ← scoped alone, correctly clean
REJECT  "Volume causes strength."                                          ← rider alone, correctly rejected
clean   "Limited evidence suggests a change but volume causes strength."   ← conjunction-joined: laundered
clean   "Limited evidence suggests a change, but volume causes strength."  ← COMMA-joined: laundered
REJECT  "Limited evidence suggests a change; volume causes strength."      ← SEMICOLON control
REJECT  "Limited evidence suggests a change. Volume causes strength."      ← PERIOD control
```

The comma form is clean while the semicolon and period forms reject. That is precisely the divergence
R2 used to prove clause scope was the cause of `I5-R2`, and here it survives verbatim.

The `causalMatches.length === 1` gate is demonstrably what opens it — adding a second causal verb to
the same sentence restores the rejection with no other change:

```
clean   "Limited evidence suggests a change, but volume causes strength."
REJECT  "Limited evidence suggests a change, but volume causes strength and increases size."
```

This is why §3.3's hedge attacks mostly passed: nine of ten happened to carry two causal verbs and were
caught by the patched `lastLowCalibrationEnd` / `crossesAssertionBoundary` path. The tenth carried one,
fell through to this fallback, and was laundered.

The legitimate single-causal hedged statements the fallback exists to protect all stay clean, so the
branch is needed and the defect is again its scope:

```
clean  "Limited evidence suggests that chest training increases pectoralis thickness."
clean  "Chest training may increase pectoralis thickness."
clean  "This is a hypothesis: chest training increases thickness."
clean  "The evidence cannot establish that the press increases size."
clean  "There is no evidence that the fly increases activation."
```

### 4.3 Why this is the same finding class, on the same criterion, inside the authorized scope

Three independent grounds, each sufficient on its own:

1. **The owner authorization names it.** Authorized scope item 1 is "make certainty-language exceptions
   apply to the matched universal **or causal** token rather than the whole punctuation clause."
   Mechanism B is the whole punctuation clause, on the causal token, via `clauseContaining`. Mechanism A
   is an exception that does not apply to the matched token — the negation applies to a different word.
2. **The handoff commissioned exactly these probes.** Required reviewer action items 3 and 4 ask the
   reviewer to "attack every remaining exception with a fresh second universal token" and to attack the
   hedge exception with a fresh new-subject causal assertion. Mechanisms A and B are the results of
   running those two tests. Reporting them is executing the handoff's own instruction, not widening
   scope.
3. **The criterion's own text.** Criterion 13 is "certainty-lint exceptions are narrowly bounded."
   Fifteen natural-prose statements of the banned class pass the gate.

The handoff states: "The equivalent causal path is bounded at a new-assertion boundary." That is true
of two of the three causal off-switches — the single-trial preamble and the preceding-hedge path, both
of which I confirmed hold (§3.3). It is not true of the third, the single-token clause-level fallback,
which was left untouched. I read this as an incomplete enumeration rather than a misdescription of what
was implemented: the two paths the handoff describes changing were changed, and changed correctly.

What is **not** in scope, and which I am not reopening: R2's five Minor findings `N2`–`N5`, the eight
open R1 Minors, scientific entailment, and any wording, grade, source or approval question. §10.1
bounds the fix to two code sites and forbids expansion.

### 4.4 Neither mechanism is a regression — cross-version evidence

I ran the same statements against the R1 candidate, the failed R2 candidate and this candidate:

| id  | Statement                                                                              | `478411a` R1 | `ebb1e41` R2 | `f95cfaf` R3 |
| --- | -------------------------------------------------------------------------------------- | ------------ | ------------ | ------------ |
| N1  | "The response is not uniform and all lifters gain size."                               | clean        | clean        | clean        |
| N2  | "This is not always true and all lifters gain size."                                   | clean        | clean        | clean        |
| N3  | "It is not settled but everyone responds."                                             | clean        | clean        | clean        |
| N4  | "The finding is not robust yet all humans respond."                                    | clean        | clean        | clean        |
| N5  | "The result is not clear, so every athlete improves." _(control)_                      | REJECT       | REJECT       | REJECT       |
| S1  | "The study reports a change, and every participant everywhere gains."                  | REJECT       | clean        | clean        |
| T1  | "Every tier-2 lifter everywhere benefits in this slice."                               | clean        | clean        | clean        |
| C1  | "Across seven trials, all 7 humans everywhere respond."                                | clean        | clean        | clean        |
| J1  | "Limited evidence suggests a change, but volume causes strength." `low`                | clean        | clean        | clean        |
| J4  | "The data cannot establish a dose, but the bench press causes hypertrophy." `low`      | clean        | clean        | clean        |
| J7  | "It is plausible that the sample was small, although training prevents atrophy." `low` | clean        | clean        | clean        |

And the patch's own gains over the failed candidate, for contrast:

| id  | Statement                                                                                  | `478411a` | `ebb1e41` | `f95cfaf`  |
| --- | ------------------------------------------------------------------------------------------ | --------- | --------- | ---------- |
| R2a | "In 20 participants, every participant gained size, and every lifter everywhere benefits." | clean     | clean     | **REJECT** |
| R2b | "Five studies, all in trained men, show all lifters gain size."                            | REJECT    | clean     | **REJECT** |
| R2c | "Every tier-1 programme in this slice works, and every lifter gains from it."              | clean     | clean     | **REJECT** |
| R2d | "The study reports that every specimen behaved this way, so every athlete will too."       | REJECT    | clean     | **REJECT** |
| R2e | "Across seven trials, all 7 trials agree that all humans respond."                         | clean     | clean     | **REJECT** |
| R2f | "Normalised every value, we conclude every athlete improves."                              | clean     | clean     | **REJECT** |
| K1  | "…the programme increased thickness, so resistance training causes hypertrophy." `low`     | clean     | clean     | **REJECT** |
| K2  | "Chest training may increase pectoralis thickness, and flies increase activation." `low`   | clean     | clean     | **REJECT** |
| K3  | "…the programme increased thickness and improved strength." `low` _(control)_              | clean     | clean     | clean      |

**No statement that was rejected at `ebb1e41` is clean at `f95cfaf`.** The patch is monotonically
stronger on every probe I ran. Mechanism A, `T1` and `C1` are pre-existing at all three commits; `S1`
was introduced by the **R1** remediation (`ebb1e41`), not by this one; mechanism B is pre-existing at
all three commits. This patch introduced no leak.

---

## 5. Findings

### 5.1 CRITICAL

**None.**

### 5.2 IMPORTANT

**`I7-R3` — Two certainty-lint exceptions still license an unrelated assertion joined by a coordinating
conjunction, so criterion 13's "narrowly bounded" requirement is not met.**

_Sites:_ `src/lib/content/validation.ts:195–199` (mechanism A, universal path) and
`src/lib/content/validation.ts:452–455` (mechanism B, causal path).

_Mechanism A._ The negation exception tests `/\bnot(?:\s+\w+){0,3}\s*$/i` against a raw 48-character
prefix. The three-word slack admits a coordinating conjunction, so a negation scoping an earlier
predicate exempts a later unrelated universal. Four natural statements pass clean, including "This is
not always true and all lifters gain size." and "The finding is not robust yet all humans respond."
The comma, semicolon and period forms of the same wording are all correctly rejected, which isolates
the joining device as the cause (§4.1).

_Mechanism B._ `hasUncalibratedCausalLanguage`'s final fallback calls
`hasLowCalibration(clauseContaining(statement, match.index))` — the whole punctuation clause, via the
exact function `I5-R2` named — whenever the statement contains exactly one causal token. Seven natural
`low`-certainty statements assert uncalibrated causation about a new subject and pass clean, including
"Limited evidence suggests a change, but volume causes strength." The semicolon and period forms reject
while the comma form is clean, reproducing `I5-R2`'s diagnostic signature verbatim; adding a second
causal verb restores the rejection, isolating the `causalMatches.length === 1` gate as the cause
(§4.2).

_Violates:_ master plan §10.8 (banned certainty phrases inconsistent with grade must fail the build);
acceptance criterion 13 "Certainty-lint exceptions are narrowly bounded"; owner authorization item 1
("apply to the matched universal **or causal** token rather than the whole punctuation clause");
remediation handoff acceptance criterion 2 ("Every R2 laundering example **and fresh equivalent** is
rejected at the offending joined token"); and the handoff's statement that "The equivalent causal path
is bounded at a new-assertion boundary," which holds for two of the three causal off-switches but not
the third.

_Severity rationale:_ Important, matching R1's and R2's grading of the same class on the same
criterion. R2 graded `I5-R2` Important because "the acceptance criterion … is not met while a clause
boundary launders an unscoped universal, and the shape is natural prose rather than a contrived
string." Both conditions hold here: the shapes are ordinary English, and the laundered content is the
generic-promise and uncalibrated-causation class the gate exists to block.

_Mitigation:_ substantial and unchanged from R2. No record is published; all 26 records are
`unpublished` with `ownerApprovedAt`, `approvalManifestId` and `contentChecksum` null; all 23 promoted
claims are R4-approved verbatim and all 46 statement/plainLanguage texts and 89 qualifier fields pass;
30 of 30 `I5-R2` probes, 39 of 40 causal probes and 62 of 70 universal-family probes are correct. This
is a mechanism defect in a gate under construction, not a live mis-publication.

_Not a regression:_ both mechanisms are pre-existing at `478411a` and `ebb1e41` and were introduced by
neither this patch nor the R1 remediation (§4.4). This patch introduced no leak and rejected everything
its predecessor rejected.

_Destination:_ SBLA-011 criterion 13. See §10 for the bounded fix and §10.2 for the governance question
this raises for the owner.

### 5.3 MINOR — new in R3, nonblocking, with impact and destination

**`N6-R3` — The `tier-\d … in this slice` branch does not constrain the noun it scopes.**
`validation.ts:237` tests only `^\s+tier-\d+\b[^.!?;]{0,100}\bin this slice\b` against the suffix,
so any noun may follow the tier label and the 100-character window freely crosses commas and
conjunctions. "Every tier-2 lifter everywhere benefits in this slice." passes clean, as does the same
phrase joined to a legitimate control. _Impact:_ lower than `I7-R3` — this is branch breadth rather
than inherited exemption (the rider carries its own `tier-N` and `in this slice`), and the shape is not
natural prose a drafter would produce, because tier labels grade evidence rather than people. Present
at all three candidate commits. _Destination:_ fold into the `I7-R3` fix **only if** free — constrain
the noun to the vocabulary the one real qualifier uses
(`claim-pectoralis-major-surface-emg-limitation.qualifiers.1`, "every tier-4 activation **statement** in
this slice"); otherwise SBLA-012 lint hardening. Must not expand the authorized remediation.

**`N7-R3` — The `all <N>` referenced-count branch matches on the number alone, not the noun.**
`validation.ts:280–301` exempts `all <count>` when the same numeric value was enumerated earlier in the
statement, without requiring the noun to agree. "Across seven trials, all 7 humans everywhere respond."
passes clean. _Impact:_ low — the phrase remains numerically bounded to seven, so it cannot express an
unbounded population promise, and R2's original "all humans respond" attack is now correctly rejected.
Present at all three candidate commits. _Destination:_ SBLA-012 lint hardening; require the noun after
the count to match the enumerated noun, mirroring the noun-agreement rule the patch already added to
the sample branch.

**`N8-R3` — The `study reports … every specimen` branch spans a coordinating conjunction.**
`validation.ts:212–224` guards the tempered-greedy window against an intervening **universal token**
but not against an intervening conjunction, so "The study reports a change, and every participant
everywhere gains." passes clean. _Impact:_ lower than `I7-R3` because the suffix is constrained to
`specimen|participant|case`, which keeps the population inside study vocabulary and blocks every
generic-population noun I attacked it with. This one was introduced by the **R1** remediation
(`ebb1e41`); it was rejected at `478411a`. _Destination:_ the same `crossesAssertionBoundary` call that
closes `I7-R3` mechanism A closes this at no extra cost; if that is not taken, SBLA-012 lint hardening.

### 5.4 Prior findings — status in this candidate

| Finding              | Round | Status in `f95cfaf`                                                                                               |
| -------------------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| `C1`                 | R1    | closed at R2; not re-audited here (regression-only: checksum gate untouched, §6)                                  |
| `I1`–`I4`, `I6`      | R1    | closed at R2; not re-audited here (regression-only, §6)                                                           |
| `I5` → `I5-R2`       | R1/R2 | **the named mechanism is closed** (§3.1–3.2); the criterion still fails via `I7-R3`                               |
| `N1` (R2 Minor)      | R2    | **closed — not actionable.** Measured: the eight branches are load-bearing for 9 promoted qualifier fields (§3.5) |
| `N2`–`N5` (R2 Minor) | R2    | out of authorized scope; destinations unchanged; not reopened and not silently closed                             |
| R1 `M1`–`M7`, `M9`   | R1    | out of authorized scope; remain open with their recorded destinations                                             |
| R1 `M8`              | R1    | closed at R2 by explicit R1 instruction                                                                           |

No prior finding is represented as fixed that I did not verify, and none is silently closed.

---

## 6. Regression safety

The authorization bounds this round to criterion 13, so criteria 1–12 and 14–16 were checked **for
regression only**, not re-derived from scratch. What I confirmed:

- **Diff scope.** `git diff --name-status ebb1e41 f95cfaf` returns exactly four paths: two additions
  that are the immutable R2 report and this remediation's handoff, and two modifications,
  `src/lib/content/validation.ts` and `tests/unit/content-validation.test.ts`. Measured from the R2
  report commit, `git diff --name-status 462c4fb f95cfaf` returns exactly three: the handoff plus those
  same two files. This matches the handoff's declared file list exactly.
- **Blast radius inside the changed file.** The diff is five hunks, all inside the certainty-lint
  region (`@@ -164`, `-179`, `-301`, `-313`, `-335`). Nothing touches `validateManifestChain`,
  `validatePublishedManifestCoverage`, `validatePublishedReviewDates`, `recordContentChecksum` or the
  body of `validateRecordGraph`, which are the surfaces R1's `C1`, `I2` and `I3` and criteria 8–10
  depend on.
- **Protected trees byte-identical** — `content/`, `content-drafts/`, `research/`, `public/data/`,
  `docs/` (§3.4).
- **Graph bundle byte-identical**, blob `df815a01`, SHA-256 `4bd4787c…`, and deterministic across three
  consecutive recompilations (§7.3).
- **Publication still fail-closed** — 26/26 `unpublished`, three approval fields null, manifests and
  changes directories empty (§3.4).
- **No prior artifact modified** — both immutable review reports and both prior handoffs are unchanged
  in the candidate tree.
- **Full gate green twice** on the pinned runtime with every count matching the handoff (§7.2).

---

## 7. Commands run and real results

### 7.1 Pinned runtime

```
$ node --version      v24.20.0      (pinned; host default is v24.14.0 and does not satisfy the engine)
$ pnpm --version      11.24.0
$ pnpm install --frozen-lockfile    Done in 8.6s using pnpm v11.24.0
```

`package.json` declares `"engines": {"node": ">=24.20.0 <25", "pnpm": "11.24.0"}` and
`"packageManager": "pnpm@11.24.0"`. Both are satisfied exactly.

### 7.2 `pnpm evidence:status` and `pnpm verify` — exit 0, twice

```
$ pnpm evidence:status
Evidence status passed: 68 sources checked as of 2026-09-16; live network acquisition remains a later task.
exit 0

$ pnpm verify        (run 1)  exit 0
$ pnpm verify        (run 2)  exit 0
```

Real output from the gate, against the handoff's claims:

| Gate stage                      | Result observed                                                               | Handoff claim | Match |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------- | ----- |
| Prettier / ESLint / Astro check | `Result (69 files): 0 errors, 0 warnings, 0 hints`                            | 69 files, 0   | ✓     |
| Unit tests                      | `Test Files 20 passed (20)`, `Tests 297 passed (297)`                         | 20 / 297      | ✓     |
| Promotion check                 | `SBLA-009 promotion verified 94 production records.`                          | 94            | ✓     |
| Content validation              | `Content validation passed: 95 records.`                                      | 95            | ✓     |
| MDX lint                        | `MDX claim lint passed: 0 public MDX files checked.`                          | pass          | ✓     |
| Graph                           | `Graph validation passed: 94 nodes and 120 edges match deterministic output.` | 94 / 120      | ✓     |
| Research integrity              | `Research integrity passed: 1 complete bundle checked (SBLA-009).`            | 1 bundle      | ✓     |
| Evidence status                 | `Evidence status passed: 68 sources checked as of 2026-09-16.`                | 68 sources    | ✓     |
| Static build                    | `1 page(s) built in 532ms`                                                    | 1 page        | ✓     |
| Portability                     | `Test Files 3 passed (3)`, `Tests 17 passed (17)`                             | 17/17         | ✓     |
| Foundation contract             | `Foundation contract passed at C:\src\s011review-r3\`                         | pass          | ✓     |
| Asset spike / decision          | both passed                                                                   | pass          | ✓     |

Every count the handoff records is accurate.

### 7.3 Focused suite and graph determinism

```
$ pnpm vitest run tests/unit/content-validation.test.ts
Test Files  1 passed (1)
Tests  65 passed (65)
```

65/65, matching the handoff exactly.

```
$ pnpm validate:graph ×3, hashing public/data/evidence-graph.v1.json after each
4bd4787c56d4d14e9aed1059b9fd812a…
4bd4787c56d4d14e9aed1059b9fd812a…
4bd4787c56d4d14e9aed1059b9fd812a…
```

Byte-identical across three recompilations, and identical to the committed blob.

### 7.4 Probe totals, and the candidate was not modified by this review

| Probe set                                                  | Total   | Correct | Leaks  |
| ---------------------------------------------------------- | ------- | ------- | ------ |
| R2 §3.7 replay: triples, controls, fresh six, controls     | 30      | 30      | 0      |
| Rider-localisation (neutralisation + truncation)           | 18      | 18      | 0      |
| Fresh attacks on all 12 universal-exception families       | 70      | 62      | 8      |
| Causal new-assertion boundary (single-trial + hedge)       | 40      | 39      | 1      |
| Single-causal-token fallback, focused                      | 17      | 10      | 7      |
| **Primary probe-set total**                                | **175** | **159** | **16** |
| Cross-version comparison (3 commits)                       | 75      | —       | —      |
| Promoted corpus (`statement`, `plainLanguage`, qualifiers) | 135     | 135     | 0      |
| N1 branch-dependency measurement                           | 135     | —       | —      |

The 16 primary-set leaks are **15 distinct statements**: "Limited evidence suggests a change, but
volume causes strength." appears in both causal sets, once as the single failure of the hedge-boundary
suite and once as the first case of the focused fallback suite.

The one expectation error in my own probe set is recorded for honesty: I initially scored "The
acquisition ladder was executed for all ten on 2026-09-13." as a false rejection. It is not — the real
qualifier field supplies the enumeration "Ten further eligible tier-1 trials" earlier in the same text,
and the full field passes (§3.5). The isolated fragment is correctly rejected. My expectation was
wrong, not the gate.

```
$ git status --porcelain=v1     (no output, after all probes and both verify runs)
$ git rev-parse HEAD            f95cfaf0296332b02bb9df8a49128228a5a7d574
$ git rev-parse HEAD^{tree}     ae7c8ac3beeb93683af1f97fbafea79803fdc6f7
```

The candidate is unmodified. No file under review was repaired, reformatted or staged.

---

## 8. Criterion-by-criterion matrix

Criterion 13 was audited in full. Every other row was checked **for regression only** against the
evidence in §6 and carries its R2 result forward; those rows are not a fresh independent audit and
should not be read as one.

| #   | Criterion (queue row §18 / handoff)                                                        | R1       | R2       | R3                    | Evidence                                                             |
| --- | ------------------------------------------------------------------------------------------ | -------- | -------- | --------------------- | -------------------------------------------------------------------- |
| 1   | Candidate changes only the bounded files listed in the handoff                             | PASS     | PASS     | **PASS**              | §6 — 3 paths from `462c4fb`, exactly the declared list               |
| 2   | `pnpm evidence:status && pnpm verify` passes from a clean checkout                         | PASS     | PASS     | **PASS**              | §7.2 — exit 0 twice on the pinned runtime                            |
| 3   | 23 claims promoted exactly as R4 approved                                                  | PASS     | PASS     | **PASS (regression)** | §3.4 — `content/` tree byte-identical                                |
| 4   | 68 cited sources have faithful production metadata                                         | PASS     | PASS     | **PASS (regression)** | §3.4 — sources tree byte-identical                                   |
| 5   | Sources have valid current status                                                          | PASS     | PASS     | **PASS (regression)** | §7.2 — `evidence:status` exit 0, 68 sources                          |
| 6   | One muscle and two exercise records validate                                               | PASS     | PASS     | **PASS (regression)** | §7.2 — 95 records validated                                          |
| 7   | Deterministic 94-node/120-edge graph with no missing references                            | PARTIAL  | PASS     | **PASS**              | §7.3 — 3/3 recompilations byte-identical                             |
| 8   | Graph fails closed on reference and manifest defects                                       | PARTIAL  | PASS     | **PASS (regression)** | §6 — no hunk touches the manifest/review validators                  |
| 9   | Approval-manifest rules: exact checksum coverage                                           | FAIL     | PASS     | **PASS (regression)** | §6 — checksum path untouched                                         |
| 10  | No claim renders publicly without approved state, owner approval, manifest ID and checksum | FAIL     | PASS     | **PASS (regression)** | §3.4 — 26/26 unpublished, three fields null                          |
| 11  | Mixed/qualified evidence is disclosed with source roles and locators                       | PASS     | PASS     | **PASS (regression)** | §3.4 — records byte-identical                                        |
| 12  | No unconstrained factual MDX or raw HTML passes the lint                                   | FAIL     | PASS     | **PASS (regression)** | §6, §7.2 — MDX lint untouched and green                              |
| 13  | **Certainty-lint exceptions are narrowly bounded**                                         | **FAIL** | **FAIL** | **FAIL**              | **`I7-R3`** — §4.1, §4.2; `I5-R2`'s named mechanism is closed (§3.1) |
| 14  | No owner approval or publication eligibility inferred from R4                              | PASS     | PASS     | **PASS (regression)** | §3.4 — 26/26 unpublished                                             |
| 15  | No SBLA-012+ surface pre-empted                                                            | PASS     | PASS     | **PASS (regression)** | §6 — manifests and changes still empty; one shell page               |
| 16  | Role boundary and immutability respected by this review                                    | PASS     | PASS     | **PASS**              | §1.5, §3.4, §7.4                                                     |

Criterion 13 remains the sole failure, as it was at R2, and it is materially closer to passing.

---

## 9. What this remediation got right

Recorded deliberately, because a FAIL verdict should not obscure it and because none of this should be
redone:

- **The `I5-R2` fix is the right shape.** Deriving the exception window from `match.index` and requiring
  the defining syntax to sit immediately around the adjudicated token is the correct general answer, and
  it generalised cleanly across eleven branches at once. All 30 `I5-R2` probes now behave correctly with
  zero false rejections.
- **`crossesAssertionBoundary` is a genuinely good primitive.** The negative lookahead that lets a
  coordinated causal verb continue the same assertion, while treating a new subject as a new one, is
  subtle and correct — it survived 10 of 10 fresh single-trial attacks across every boundary token while
  keeping 4 of 4 same-subject coordinated outcomes clean, including adverb-modified ones. The only
  defect is that it was not applied at two further sites.
- **Noun agreement on the sample branch is a real strengthening** that R2 did not ask for: "In 20
  participants, every case gained size." is now rejected where a bare noun class would have let it pass.
- **Departing from R2 §9.1 was correct, and disclosed.** R2 told the author to delete eight branches
  first. Doing so fails closed on nine promoted qualifier fields — I measured it independently (§3.5).
  The author tried it, hit the failure, chose token-anchoring instead, kept qualifier validation intact,
  changed no qualifier text, and **recorded the failed attempt in the handoff** rather than quietly
  dropping it. That is the behaviour the evidence rules ask for.
- **The regression fixtures are substantive** (§3.6): every paired case asserts the scoped control is
  clean as well as that the joined statement is rejected, so a reject-everything gate would fail them.
- **The handoff is accurate.** Every count I re-ran matched it: 65/65 focused, 297/297 unit, 94 records,
  95 records, 94/120 graph, 68 sources, 17/17 portability, 69 files 0 diagnostics. Its one incomplete
  statement is the causal-path claim in §4.3, and it is incomplete rather than wrong.

---

## 10. Bounded remediation guidance, and the governance question

### 10.1 The fix, if one is authorized

One finding, one file, two sites, no promoted record, qualifier text or graph data affected. The
primitive needed already exists in the candidate.

**`I7-R3` mechanism A** — `validation.ts:195–199`. Require the negation to govern the matched token
rather than merely to precede it within 48 characters: reject the exemption when a new-assertion
boundary lies between the `not` and the token. `crossesAssertionBoundary` already encodes exactly the
right boundary set (`;` and `and|but|while|whereas|though|although|however|yet|so` not followed by a
coordinated causal verb). The two promoted texts that depend on this branch — "not on all 80 specimens"
and "though not in every study that measured it" — have no intervening boundary, so both stay clean.

**`I7-R3` mechanism B** — `validation.ts:452–455`. Apply the same boundary test the patch already
applies on the sentence path: the exempting calibration token must not be separated from the causal
token by a new assertion. Concretely, reuse `lastLowCalibrationEnd` and `crossesAssertionBoundary`
instead of `hasLowCalibration(clauseContaining(...))`, so the single-causal-token case is governed by
the same rule as the multi-token case rather than falling back to whole-clause scope.

**Regression fixtures** should include, at minimum, the negation triad and the causal triad in §4.1 and
§4.2 **with their comma, semicolon and period controls**, the four mechanism-A statements and the seven
mechanism-B statements, and a re-run of all 23 promoted claims plus all 89 qualifier fields to confirm
no false rejection appears. Test that the rider is rejected **in** the joined sentence while the scoped
control alone stays clean — the pattern the existing fixtures already use correctly.

`N8-R3` is closed for free by the mechanism-A change. `N6-R3` and `N7-R3` should be folded in **only**
if they cost nothing; otherwise they belong in SBLA-012 with the destinations recorded in §5.3. R2's
`N2`–`N5`, the eight open R1 Minors, and every scientific, wording, grade, source and approval question
are **not** part of this and must not expand it. R2's `N1` needs no action at all (§3.5).

### 10.2 The governance question — for the owner, not for a reviewer

`operating-policy.json` (`failedReviewAction: "bounded-remediation-then-full-artifact-recheck"`),
CLAUDE.md and AGENTS.md allow one bounded remediation and one complete-artifact recheck. That budget
was spent at R2. The owner then authorized a second, narrowly bounded remediation and this focused
recheck, recording explicitly that it "does not establish a general additional-review entitlement."

I am not authorized to grant a further round and I am not treating `I7-R3` as a new material risk that
reopens the acceptance scope. It is the unclosed remainder of criterion 13 — the criterion this recheck
existed to test — found by the two probes the remediation handoff itself instructed the reviewer to
run. My role is to state the finding and its evidence, which §4 and §5.2 do. The decision is the
owner's. The options I can see, stated neutrally and without a recommendation:

1. **A third bounded remediation and focused recheck** limited to the two code sites in §10.1, on the
   model of the authorization that produced this round. The fix is small and the primitive already
   exists; against that, the remediation budget has now been extended twice.
2. **Owner override accepting `I7-R3` as a recorded Minor**, on the grounds that nothing is published,
   all 26 records are unpublished, all 135 promoted texts pass, both mechanisms predate this milestone's
   remediation work, and the gate is materially stronger than at R1 or R2. Per the nonblocking-Minor
   rule this requires the impact and follow-up destination to be recorded; §5.2 supplies both.
3. **Defer criterion 13 to SBLA-012** with the certainty lint explicitly placed outside SBLA-011's
   accepted scope, accepting criteria 1–12 and 14–16 now and carrying `I7-R3`, `N6-R3`, `N7-R3` and
   `N8-R3` forward together as one lint-hardening task.

One factual input the owner may want, which is mine to supply and not to weigh: unlike `I5-R2`, this
finding is not a defect the SBLA-011 remediation work introduced or made worse. Every probe that
`ebb1e41` rejected, `f95cfaf` also rejects.

---

## 11. Reviewer limitations

- **Scope.** This is a focused criterion-13 recheck plus regression safety, as authorized. Criteria
  1–12 and 14–16 were checked for regression only (§6) and are marked as such in §8. A reader must not
  treat those rows as a third independent full audit.
- **No network access.** No DOI, PMID, PMCID or URL was resolved and no primary source was read. Source
  identity and status currency are audited as record-internal consistency only.
- **Scientific entailment was not re-litigated.** That is SBLA-010's accepted scope. I checked no claim
  against its sources; I checked only that no claim text changed (§3.4).
- **The certainty lint is a natural-language heuristic, and so is this audit.** I evaluated 175 adversarial and control
  statements across twelve universal-exception families and three causal off-switches, plus 75
  cross-version evaluations. A clean result on a family
  means my attacks on it failed, not that the family is provably sound. Neither R1 nor R2 found
  mechanisms A or B, which is direct evidence that this class of probing is incomplete by nature; a
  fourth reviewer could find a thirteenth shape. This is a limit of regex-based certainty linting, and
  §5.2's grading reflects demonstrated leaks rather than a claim of exhaustiveness.
- **Role-path boundary evidence is not self-certified.** §1.5 describes my diff; the authoritative
  check must be run by Codex or CI from a trusted checkout per CLAUDE.md.
- **Browser, e2e, a11y, visual and performance suites were not run.** They are outside this focused
  scope and outside SBLA-011's queue row.
- **Token usage is not instrumented in this environment**, so I cannot report a figure. Reporting an
  estimate would be a fabricated measurement. What I can record: 2 full `pnpm verify` runs, 1
  `evidence:status` run, 1 focused vitest run, 3 `validate:graph` runs, and twelve scratch probe programs
  covering 175 primary evaluations, 75 cross-version evaluations and 2 full 135-field corpus sweeps.

---

## 12. Verdict

**FAIL — 0 Critical, 1 Important (`I7-R3`), 3 Minor (`N6-R3`, `N7-R3`, `N8-R3`, all nonblocking with
impact and destination recorded).**

`passRequiresZeroCritical` is satisfied. `passRequiresZeroImportant` is not.

**Reviewed commit:** `f95cfaf0296332b02bb9df8a49128228a5a7d574`
**Reviewed tree:** `ae7c8ac3beeb93683af1f97fbafea79803fdc6f7`
**`src/lib/content/validation.ts` SHA-256:**
`bef6f9c2b64ef811becf2305f32c884357098b30153dfe7ca31febf5a149f40b`
**Graph bundle SHA-256:** `4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`, unchanged

The defect `I5-R2` named is closed and independently verified (30/30 probes, rejection localised to the
joined rider, zero false rejections, zero regressions, full gate green twice on the pinned runtime).
Criterion 13's acceptance requirement is nevertheless not met, because two further certainty exceptions
— one universal, one causal — still let a legitimate scoping device license an unrelated assertion
joined by a coordinating conjunction, and fifteen natural-prose statements of the class the gate exists
to block pass it clean. Both predate this remediation; this patch introduced no leak and is
monotonically stronger than the candidate it replaces on every probe run.

Per the repository stop rule, findings go back to the artifact's author. I did not repair the candidate
and did not write outside `reviews/releases/SBLA-011-r3.md`. Whether to authorize the §10.1 fix, accept
`I7-R3` as a recorded Minor, or defer criterion 13 to SBLA-012 is the owner's decision (§10.2); this
report takes no position among the three.
