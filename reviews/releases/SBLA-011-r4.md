# Release review: SBLA-011 criterion-13 focused recheck, round 4

**Role:** Claude Review, account B — independent adversarial auditor
**Round:** R4 (final owner-authorized criterion-13 recheck)
**Reviewed commit:** `59ec56d774cbbd2e7ec1810fb22d506bf2864a9e`
**Reviewed tree:** `dc3f4f3212072f995374d6e5309687ed62d8f5f6`
**Branch:** `claude-review/SBLA-011-r4`
**Worktree:** `C:\src\s011review-r4`
**Date:** 2026-09-16

This report is append-only and self-contained. It does not amend
[`SBLA-011-r3.md`](SBLA-011-r3.md); a reader with no access to the session that
produced it must be able to act on this file alone. I did not author, advise on,
review drafts of, or contribute to the patch under review. I did not repair the
candidate and wrote nothing outside this file.

---

## 0. Verdict

**PASS — 0 Critical, 0 Important, 3 Minor (`N9-R4`, `N10-R4`, `N11-R4`, all
nonblocking, each recorded with impact and follow-up destination).**

`passRequiresZeroCritical` is satisfied. `passRequiresZeroImportant` is
satisfied.

**`I7-R3` is CLOSED.** Both named mechanisms are repaired at the two authorized
sites. All eleven statements R3 reproduced as demonstrating `I7-R3` — four on
the universal path (§4.1) and seven on the causal path (§4.2) — are now
rejected. Every joining-device control (bare conjunction, comma, semicolon,
period) behaves correctly, all three legitimate negation controls stay clean,
all five legitimate single-causal hedge controls stay clean, and all four
legitimate trailing-calibration controls stay clean. Seventeen fresh attacks I
wrote myself against the two changed sites, using wording that appears nowhere
in R3, the handoff or the test fixtures, are all rejected.

**Criterion 13 PASSES.** The exceptions are now bound to the token they scope.

The patch is **monotonically stronger** than every earlier candidate. Across a
703-statement differential corpus evaluated against all four candidate commits,
**zero** statements that were rejected at `478411a` (R1), `ebb1e41` (R2) or
`f95cfaf` (R3) are clean at `59ec56d`, and **321** statements that were clean at
`f95cfaf` are now rejected. There are **zero** false rejections: all 135
promoted texts pass, unchanged, with the identical certainty distribution R3
recorded.

**What I found that R3 did not, and why it does not block.** The shared
primitive `NEW_ASSERTION_BOUNDARY` (`validation.ts:169–170`) enumerates only
`;` and `and|but|while|whereas|though|although|however|yet|so`. Joiners outside
that list — `because`, `since`, `or`, `therefore`, `whilst`, `plus`, `then`,
`also` — are not recognised as new assertions, so exception families built on
`crossesAssertionBoundary` can still be crossed by them. I record this as
`N9-R4`, **Minor**, for four independently sufficient reasons set out in §5.3:
it is a **third code site** that the owner authorization expressly forbade
changing; it is **byte-for-byte pre-existing at all four candidate commits**
(R1, R2, R3 and R4 all clean, verified statement-by-statement); it equally
affects the preceding-hedge and single-trial paths that **R3 examined and
passed** in its §3.3, so it is not a defect of this remediation; and R3 §10.1
itself certified this vocabulary as "exactly the right boundary set" and
instructed the author to reuse it, which the author did exactly.

Nothing is published. All 26 records remain `unpublished` with
`ownerApprovedAt`, `approvalManifestId` and `contentChecksum` null.

---

## 1. Provenance verification — performed before reading anything under review

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD                 59ec56d774cbbd2e7ec1810fb22d506bf2864a9e
$ git rev-parse HEAD^{tree}          dc3f4f3212072f995374d6e5309687ed62d8f5f6
$ git rev-parse --abbrev-ref HEAD    claude-review/SBLA-011-r4
$ git status --porcelain=v1          (no output)
$ git rev-parse --show-toplevel      C:/src/s011review-r4
```

HEAD is exactly the commit the assignment names as the immutable candidate. The
worktree is the one pre-claimed for this task. The tree was clean before any
work and, re-checked after every probe, both `pnpm verify` runs and three graph
recompilations, is still clean (§7.4).

### 1.2 Ancestry

```
$ git merge-base --is-ancestor cf7efc5 59ec56d    -> true  (R3 report commit)
$ git merge-base --is-ancestor 6e5948f 59ec56d    -> true  (origin/main)
$ git log --oneline -5 59ec56d
  59ec56d docs: hand off final SBLA-011 criterion-13 closure
  a0ee0dd fix: bind remaining certainty exceptions
  cf7efc5 review: recheck SBLA-011 criterion 13 R3 — FAIL
  f95cfaf docs: hand off SBLA-011 criterion-13 remediation
  0a2bc36 fix: anchor certainty exceptions to matched tokens
```

The candidate descends from the immutable R3 report commit, which descends from
the failed R3 candidate `f95cfaf`. Commit metadata:

```
commit  59ec56d774cbbd2e7ec1810fb22d506bf2864a9e
tree    dc3f4f3212072f995374d6e5309687ed62d8f5f6
parent  a0ee0ddd98186862d99d9591de7472e7d1cc8fd8
date    Wed Sep 16 16:49:19 2026 -0400
subject docs: hand off final SBLA-011 criterion-13 closure
```

Implementation commit `a0ee0dd…` and handoff commit `59ec56d…` match the
remediation handoff's declared values exactly.

### 1.3 Remote parity

```
$ git rev-parse origin/codex/SBLA-011-r3-remediation
  59ec56d774cbbd2e7ec1810fb22d506bf2864a9e
$ git branch -a --contains 59ec56d
  claude-review/SBLA-011-r4
  codex/SBLA-011-r3-remediation
  remotes/origin/codex/SBLA-011-r3-remediation
```

The candidate is pushed and the local commit is identical to the published one,
so what I reviewed is what a third party fetching the remote would get.
`origin/claude-review/SBLA-011-r4` did not exist before this review; this report
creates it, which is correct for a new round.

### 1.4 The exact one-path review claim, verified before writing

```
$ git rev-parse origin/codex/SBLA-007-review-coordination
  839de0679225de51d93f9b5d10ca9b1583bfb09e
```

The claim recorded by Codex at `839de06` in
`docs/runbooks/current-work.md` reads:

| Field            | Recorded value                             |
| ---------------- | ------------------------------------------ |
| Task             | SBLA-011 criterion-13 recheck R4           |
| Role             | Claude Review (account B)                  |
| Branch           | `claude-review/SBLA-011-r4`                |
| Worktree         | `C:\src\s011review-r4`                     |
| Base commit      | `59ec56d774cbbd2e7ec1810fb22d506bf2864a9e` |
| Started          | 2026-09-16 16:50 EDT                       |
| Expected handoff | `reviews/releases/SBLA-011-r4.md`          |
| Paths owned      | `reviews/releases/SBLA-011-r4.md`          |

Every field matches this session. The same commit closes the Codex remediation
row and records that "One final focused Account-B R4 recheck is active." I
verified the claim existed before writing any output and did not edit the
ledger, which my role may not write.

### 1.5 Role-path boundary

`reviews/releases/SBLA-011-r4.md` did not exist at HEAD before this review
(`git cat-file -e HEAD:reviews/releases/SBLA-011-r4.md` → absent), so this
report adds exactly one new regular file and modifies, deletes and renames
nothing. Per CLAUDE.md, this self-description is **not** authoritative boundary
evidence: the binding check is `scripts/foundation/check-role-paths.mjs
claude-review --base 59ec56d… --repository C:\src\s011review-r4 --allowed-path
reviews/releases/SBLA-011-r4.md`, run by Codex or CI from a trusted checkout.

### 1.6 Immutability of prior artifacts

The R3 report is byte-identical on all three branches that carry it, and its
content hash matches the value R3 recorded for itself:

```
blob at cf7efc5 : 6c781894e8ee83cd7554490e116f4507c1df18d0
blob at 59ec56d : 6c781894e8ee83cd7554490e116f4507c1df18d0
blob at 839de06 : 6c781894e8ee83cd7554490e116f4507c1df18d0
SHA-256         : b5cee8420b5f406d4a282229e330e30549437696e808dd6a7159b3ebbde81873
R3 self-recorded: b5cee8420b5f406d4a282229e330e30549437696e808dd6a7159b3ebbde81873   ✓
```

`SBLA-011-r1.md`, `SBLA-011-r2.md`, `SBLA-011-handoff.md` and both earlier
remediation handoffs are unchanged between `f95cfaf` and `59ec56d`. No prior
round was edited to accommodate this one.

### 1.7 Documents read before reviewing

`AGENTS.md`, `CLAUDE.md`, `reviews/releases/SBLA-011-r3.md` and
`reviews/releases/SBLA-011-owner-authorization-r4.md` from coordination commit
`839de06`; `reviews/releases/SBLA-011-r3-remediation-handoff.md` from the
candidate, which is where it lives — it is not present on the coordination
branch, and the assignment's expectation that it would be is a harmless
misdirection, recorded here only so the next reader does not repeat the search.

---

## 2. Methods, and the limits of this review

This is a focused criterion-13 recheck plus regression safety, matching the
authorized scope. Criteria 1–12 and 14–16 were checked for **regression only**
(§6) and are marked as such in §8; they are not a fourth independent full audit.

I evaluated the candidate's real `lintClaimLanguage` by importing
`src/lib/content/validation.ts` directly, on the pinned runtime, with no
modification to the file. For cross-version work I extracted
`src/lib/content/` from each of the four candidate commits into a scratch
directory outside the repository and imported each in the same process, so a
single probe program evaluates one statement against four implementations with
no rebuild between them. Every probe program lived outside the repository; the
worktree was never written to (§7.4).

Probe inventory:

| Suite                                                            | Distinct statements | Evaluations |
| ---------------------------------------------------------------- | ------------------: | ----------: |
| R3 §4.1/§4.2 replay, controls, and my own fresh attacks (§3, §4) |                  70 |          70 |
| Cross-version differential grid, 4 commits (§3.5, §6)            |                 703 |       2,812 |
| Residual and shared-primitive study, 4 commits (§4)              |                  31 |         124 |
| Promoted corpus sweep, candidate and R3 (§3.4)                   |                 135 |         270 |
| **Total**                                                        |             **939** |   **3,276** |

Limits, stated plainly:

- **The certainty lint is a natural-language heuristic, and so is this audit.**
  A clean result on a family means my attacks on it failed, not that the family
  is sound. R3 predicted that "a fourth reviewer could find a thirteenth shape";
  §4 is that shape. A fifth reviewer may find another. §5 grades demonstrated
  behaviour, not exhaustiveness.
- **No network access.** No DOI, PMID, PMCID or URL was resolved and no primary
  source was opened. Source identity and currency are audited as record-internal
  consistency only.
- **Scientific entailment was not re-litigated.** That is SBLA-010's accepted
  scope. I verified only that no claim text changed (§3.4).
- **Browser, e2e, a11y, visual and performance suites were not run.** They are
  outside this focused scope and outside SBLA-011's queue row.
- **Role-path boundary evidence is not self-certified** (§1.5).
- **Token usage is not instrumented in this environment.** I cannot report a
  figure and will not estimate one, because a fabricated measurement is worse
  than an absent one. Measurable proxies are in §7.5.

---

## 3. What the remediation closed — verified independently

### 3.1 The patch is exactly the two authorized sites

`git diff --name-status cf7efc5 59ec56d` returns exactly three paths:

```
A  reviews/releases/SBLA-011-r3-remediation-handoff.md
M  src/lib/content/validation.ts
M  tests/unit/content-validation.test.ts
```

This matches the handoff's declared file list exactly. Inside the changed file
the diff is three hunks:

```
@@ -194,7 +194,16 @@ function hasUniversalLanguage
@@ -383,18 +392,6 @@ (removal of hasLowCalibration)
@@ -449,10 +446,26 @@ function hasUncalibratedCausalLanguage
```

Mechanism A now locates the actual `not` span and refuses the exemption when a
new-assertion boundary lies between that `not` and the matched universal token.
Mechanism B no longer calls `hasLowCalibration(clauseContaining(...))` — the
function `I5-R2` named, now deleted outright — and instead locates the trailing
calibration token and tests its position and boundary relative to the causal
token. Both use the existing primitive, exactly as owner authorization items 1
and 2 and R3 §10.1 specify.

### 3.2 Nothing else in the file moved

I hashed each critical validator's body at `f95cfaf` and at `59ec56d`:

| Function                            | Result        |
| ----------------------------------- | ------------- |
| `validateManifestChain`             | **identical** |
| `validatePublishedManifestCoverage` | **identical** |
| `validatePublishedReviewDates`      | **identical** |
| `recordContentChecksum`             | **identical** |
| `validateRecordGraph`               | **identical** |
| `validateSourceStatus`              | **identical** |
| `validateAsOfDate`                  | **identical** |

These are the surfaces R1's `C1`, `I2` and `I3` and criteria 8–10 depend on. The
shared primitives are also untouched — `crossesAssertionBoundary`,
`lastLowCalibrationEnd`, `clauseContaining`, `clausePrefixBefore`,
`clauseSuffixAfter`, `isDirectlyNegated` and the `NEW_ASSERTION_BOUNDARY`
literal are all byte-identical to `f95cfaf`. That last fact is load-bearing for
§5.3: the author did not widen the shared vocabulary, because the authorization
did not permit it.

### 3.3 `I7-R3` mechanism A is closed — the universal path

All four statements R3 reproduced in §4.1 now reject, and the joining-device
control set is now uniform across all four devices:

```
REJECT  "This is not always true and all lifters gain size."           (was clean at R3)
REJECT  "The response is not uniform and all lifters gain size."       (was clean at R3)
REJECT  "It is not settled but everyone responds."                     (was clean at R3)
REJECT  "The finding is not robust yet all humans respond."            (was clean at R3)

clean   "This is not always true."                          <- scoped part alone, correctly clean
REJECT  "All lifters gain size."                            <- rider alone, correctly rejected
REJECT  "This is not always true and all lifters gain size."   <- CONJUNCTION (R3: clean)
REJECT  "This is not always true, and all lifters gain size."  <- comma
REJECT  "This is not always true; all lifters gain size."      <- semicolon
REJECT  "This is not always true. All lifters gain size."      <- period
```

The divergence R3 used to prove the mechanism — conjunction clean while comma,
semicolon and period reject — is gone. The three legitimate negation controls
the branch exists to serve stay clean, and so does R3's `N5` reject-control:

```
clean   "Not all lifters gain size."
clean   "This is not always true."
clean   "The effect is not universally observed."
REJECT  "The result is not clear, so every athlete improves."
```

**Fresh attacks, my wording, none appearing in R3, the handoff or the fixtures.**
Nine statements exercising every joiner in the recorded boundary set:

| #   | Statement                                                     | Lint       |
| --- | ------------------------------------------------------------- | ---------- |
| D1  | "The mechanism is not established and every athlete adapts."  | **REJECT** |
| D2  | "This has not been shown although all trainees benefit."      | **REJECT** |
| D3  | "Adaptation is not linear however everyone gains strength."   | **REJECT** |
| D4  | "The protocol is not validated while all beginners improve."  | **REJECT** |
| D5  | "The transfer is not proven whereas all novices respond."     | **REJECT** |
| D6  | "The effect is not consistent though every trainee improves." | **REJECT** |
| D7  | "The carryover is not certain yet everyone benefits."         | **REJECT** |
| D8  | "The dose is not known so all lifters should train hard."     | **REJECT** |
| D9  | "It is not proven but every programme works."                 | **REJECT** |

9 of 9 rejected.

### 3.4 `I7-R3` mechanism B is closed — the causal path

All seven statements R3 reproduced in §4.2 now reject, and `I5-R2`'s diagnostic
signature is gone from the causal path:

```
REJECT  "Limited evidence suggests a change, but volume causes strength."             (was clean)
REJECT  "Limited evidence suggests a change, and volume causes strength."             (was clean)
REJECT  "This is a hypothesis about the fly, so heavy loading causes growth."         (was clean)
REJECT  "The data cannot establish a dose, but the bench press causes hypertrophy."   (was clean)
REJECT  "There is no evidence for the crossover, yet the press causes growth."        (was clean)
REJECT  "The result may be an artefact, however heavy loading produces hypertrophy."  (was clean)
REJECT  "It is plausible that the sample was small, although training prevents atrophy." (was clean)

clean   "Limited evidence suggests a change."                              <- scoped alone, correctly clean
REJECT  "Volume causes strength."                                          <- rider alone
REJECT  "Limited evidence suggests a change but volume causes strength."   <- conjunction (R3: clean)
REJECT  "Limited evidence suggests a change, but volume causes strength."  <- COMMA (R3: clean)
REJECT  "Limited evidence suggests a change; volume causes strength."      <- semicolon
REJECT  "Limited evidence suggests a change. Volume causes strength."      <- period
REJECT  "Limited evidence suggests a change, but volume causes strength and increases size."
```

All four joining devices now agree. The five legitimate single-causal hedged
statements the fallback exists to protect all stay clean, so the branch still
does its job:

```
clean  "Limited evidence suggests that chest training increases pectoralis thickness."
clean  "Chest training may increase pectoralis thickness."
clean  "This is a hypothesis: chest training increases thickness."
clean  "The evidence cannot establish that the press increases size."
clean  "There is no evidence that the fly increases activation."
```

The legitimate trailing-calibration controls — the two disclosures the handoff
says it deliberately preserved — stay clean:

```
clean  "Resistance training increases hypertrophy and results may vary by individual."
clean  "Resistance training increases hypertrophy and results might vary by individual."
clean  "Chest training increases thickness according to limited evidence."
clean  "The press increases size, according to limited evidence."
```

**Fresh attacks, my wording.** Eight statements, each a hedge scoping one
subject joined to an uncalibrated causal assertion about a different subject, at
`certainty: 'low'`:

| #   | Statement                                                                            | Lint       |
| --- | ------------------------------------------------------------------------------------ | ---------- |
| E1  | "The sample may be unrepresentative, but the squat causes hypertrophy."              | **REJECT** |
| E2  | "No evidence addresses the taper, and deloading prevents overreaching."              | **REJECT** |
| E3  | "This is a hypothesis about tendon stiffness, so eccentric work increases strength." | **REJECT** |
| E4  | "The trial cannot establish a threshold, although partial reps improve size."        | **REJECT** |
| E5  | "The finding suggests a trend, however cluster sets enhance power."                  | **REJECT** |
| E6  | "It is plausible that recall was poor, while protein timing reduces soreness."       | **REJECT** |
| E7  | "Limited evidence covers the elderly, yet machine training produces growth."         | **REJECT** |
| E8  | "The press may be mistimed, whereas the row increases thickness."                    | **REJECT** |

8 of 8 rejected.

### 3.5 The promoted corpus is accepted with zero false rejections and no content change

I loaded the real records from `content/claims/` and linted every field through
the candidate's own `lintClaimLanguage`, applying to qualifiers the exact code
filter `validateRecordGraph` applies at `validation.ts:794–798`:

```
claim record files                                        23
statement fields linted                     23   issues:   0
plainLanguage fields linted                 23   issues:   0
promoted statement + plainLanguage texts    46   issues:   0
qualifier fields linted                     89   gated issues: 0
TOTAL PROMOTED TEXTS                       135   issues:   0
certainty distribution  {"low":11,"moderate":7,"very-low":2,"high":1,"established-descriptive-fact":2}
```

Zero issues across all 135. The certainty distribution is identical to the one
R3 recorded, confirming I linted the same corpus with the same certainty inputs.
Running the same sweep against the `f95cfaf` implementation gives the identical
135/0 result, so the patch introduced **no** false rejection.

Thirteen promoted texts carry a universal token, so the exemption surface is
genuinely exercised by real content. The two the mechanism-A branch exists to
protect — the ones R3 §10.1 warned must not break — both stay clean:

```
clean  "The intercostal contribution was established by Sihler whole-mount nerve staining on
        five randomly selected muscles, not on all 80 specimens."
        (claim-pectoralis-major-innervation.qualifiers.3)
clean  "Raising the bench usually takes work away from the lower chest, though not in every
        study that measured it."
        (claim-bench-press-inclination-shifts-regional-activation.plainLanguage)
```

Note the second: it contains `though`, which **is** a boundary token, yet stays
clean — because the negation directly governs `every` with no boundary between
them. The boundary test is positional, not a blanket ban on the vocabulary
appearing in the sentence. That is the correct behaviour and it is what makes
the fix compatible with real prose.

Protected trees, compared at the Git tree level against the failed R3 candidate:

| Directory         | `f95cfaf` → `59ec56d`                                |
| ----------------- | ---------------------------------------------------- |
| `content/`        | identical `f4192f51bc5040e33bf912490d3e6bf8623ce701` |
| `content-drafts/` | identical `f855bf4f343c8f4885a7f9762c2e9e1841ff0cee` |
| `research/`       | identical `34ec149cace33c941898d38f60ff5559f69c6c34` |
| `public/data/`    | identical `b1d96bba3f89253374134ad18afff632bab37d09` |
| `docs/`           | identical `7a47fadcc0a25eab1f4a13c6e68bd3d9568f3e90` |

`reviews/releases/` is the only protected-adjacent tree that differs, and the
difference is exactly the added remediation handoff. No content, research,
approval or graph-data path changed.

The graph bundle blob is `df815a014e3eff5c6c93638e8d198f58f9c052c9`, identical
to its value at `f95cfaf`, SHA-256
`4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446` — byte-equal
to the value R3 recorded.

Publication remains fail-closed:

```
records with publicationState        26
states                               {"unpublished": 26}
non-null ownerApprovedAt              0
non-null approvalManifestId           0
non-null contentChecksum              0
content/approval-manifests/          .gitkeep only
content/changes/                     .gitkeep only
```

### 3.6 The regression fixtures are substantive, not vacuous

The focused suite grows 65 → 85. The twenty added cases are the four
mechanism-A statements plus the comma, semicolon and period controls (7); the
three legitimate negation controls asserted **clean** (3); and the seven
mechanism-B statements plus the conjunction, comma, semicolon and period forms
of the triad (10). Because ten of the twenty assert `toEqual([])` or an
equivalent clean result, a gate that simply rejected everything would fail this
suite. The pre-existing positive controls for trailing calibration
(`'Resistance training increases hypertrophy and results may vary by
individual.'`, `'Resistance training increases hypertrophy, according to limited
evidence.'`) and the R2 rider-localisation test that asserts the scoped half
alone stays clean are all still present and green.

---

## 4. What remains — and why it is a third site, not an unclosed `I7-R3`

### 4.1 The finding

`NEW_ASSERTION_BOUNDARY` (`validation.ts:169–170`) is:

```ts
/;|\b(?:and|but|while|whereas|though|although|however|yet|so)\s+(?!…)/gi;
```

Eight joiners outside that enumeration do not register as new assertions, so an
exemption can still reach across them. Six statements per mechanism, at the
certainty each path governs:

| #   | Statement                                                         | Joiner      | Lint      |
| --- | ----------------------------------------------------------------- | ----------- | --------- |
| MA1 | "The effect is not consistent whilst all trainees improve."       | `whilst`    | **clean** |
| MA2 | "The result is not generalisable because every athlete responds." | `because`   | **clean** |
| MA3 | "It is not settled therefore everyone responds."                  | `therefore` | **clean** |
| MA4 | "This is not always true or all lifters gain size."               | `or`        | **clean** |
| MA5 | "The finding is not robust since all humans respond."             | `since`     | **clean** |
| MB1 | "Heavy loading causes growth, whilst the sample may be small."    | `whilst`    | **clean** |
| MB2 | "Deloading prevents overreaching, therefore the taper may help."  | `therefore` | **clean** |

The same statements with a joiner that **is** in the set are rejected, which
isolates the vocabulary — not the patch — as the cause:

```
REJECT  "The effect is not consistent while all trainees improve."      <- while, in set
REJECT  "It is not settled so everyone responds."                       <- so, in set
REJECT  "This is not always true and all lifters gain size."            <- and, in set
```

`whilst` is the sharpest case: it is an ordinary British-English synonym of
`while`, which the set already covers, so the gap is a vocabulary omission
rather than a structural one. `or` is a coordinating conjunction, which places
it inside the literal wording of R3's `I7-R3` description even though R3 did not
probe it.

### 4.2 It is pre-existing at every candidate commit

Every statement above, evaluated against all four implementations in one process:

```
                                                                    R1     R2     R3     R4
"The effect is not consistent whilst all trainees improve."         clean  clean  clean  clean
"The result is not generalisable because every athlete responds."   clean  clean  clean  clean
"It is not settled therefore everyone responds."                    clean  clean  clean  clean
"This is not always true or all lifters gain size."                 clean  clean  clean  clean
"The finding is not robust since all humans respond."               clean  clean  clean  clean
"Heavy loading causes growth, whilst the sample may be small."      clean  clean  clean  clean
"Deloading prevents overreaching, therefore the taper may help."    clean  clean  clean  clean
```

Uniform across R1, R2, R3 and R4. This remediation neither introduced nor
widened it. The 703-statement differential in §6 confirms the same conclusion at
scale: of 298 statements clean at both R3 and R4, **every one** is grouped under
a joiner outside the recorded set (`because` 33, `since` 33, `or` 33,
`therefore` 33, `whilst` 33, `plus` 33, `then` 33, `also` 33) or is a
legitimate control that must be clean.

### 4.3 It equally affects paths R3 examined and passed

This is the decisive point, and it is why the finding cannot be read as an
unclosed `I7-R3`. `crossesAssertionBoundary` is shared. The same vocabulary gap
opens the **preceding-hedge** path and the **single-trial preamble** path —
the two causal off-switches R3 audited in its §3.3 and explicitly confirmed as
holding, scoring 39 of 40:

```
                                                                                  R1     R2     R3     R4
"The sample may be small, whilst the squat causes hypertrophy."                   clean  clean  clean  clean
"Limited evidence suggests a change, therefore volume causes strength."           clean  clean  clean  clean
"No evidence covers the taper, since deloading prevents overreaching."            clean  clean  clean  clean
"Limited evidence suggests a change, or volume causes strength."                  clean  clean  clean  clean
"In one study of 12 men, the press moved 5 kg whilst volume causes strength."     clean  clean  clean  clean
"In one trial with 20 lifters, the load rose 4 kg therefore volume causes ..."    clean  clean  clean  clean

and the same shapes with a recorded joiner:
"The sample may be small, while the squat causes hypertrophy."                    clean  clean  clean  REJECT
"Limited evidence suggests a change, so volume causes strength."                  clean  clean  clean  REJECT
"In one study of 12 men, the press moved 5 kg but volume causes strength."        clean  clean  REJECT REJECT
```

R3 reported running ten fresh single-trial attacks "across every boundary
token" — that is, across every token **inside** the set. The blind spot is
therefore shared by R3's own passing evidence for those paths. A finding that
equally falsifies a criterion R3 passed, on code this patch never touched, is
not a defect of this remediation.

### 4.4 Fixing it was expressly outside the authorized scope

`reviews/releases/SBLA-011-owner-authorization-r4.md` states: "**Only the two
sites in R3 section 10.1 may change**," names the two bindings, and adds that
the authorization "does not turn R3 into PASS or establish a general entitlement
to more review rounds." R3 §10.1 goes further and certifies the vocabulary:
"`crossesAssertionBoundary` **already encodes exactly the right boundary set**
(`;` and `and|but|while|whereas|though|although|however|yet|so` …)," instructing
the author to reuse it. The author reused it, unmodified (§3.2).

Widening the literal would alter the preceding-hedge and single-trial paths and
the eleven `I5-R2` branches that already depend on it, requiring the
re-verification of previously accepted criteria that the two-site authorization
exists to prevent. Grading a candidate as failing because it did not exceed its
authorization, on a primitive the previous reviewer certified as correct, would
be unfair and would make the authorization meaningless.

### 4.5 The one new exception this patch does introduce

Mechanism B's replacement adds a named escape:

```ts
const explicitResultVariability = /\band\s+results\s+(?:may|might)\b/i.test(
  clause.slice(causalTokenEnd, trailingCalibrationEnd),
);
if (!crossesBoundary || explicitResultVariability) return false;
```

It bypasses the boundary test when that literal phrase appears after the causal
token. It admits statements where a new assertion intervenes:

```
clean  "Resistance training increases hypertrophy and results may vary by individual."   <- intended
clean  "Volume causes strength, but the mechanism is unclear and results may vary."
clean  "Volume causes strength, the mechanism is proven, and results may vary."
```

Two mitigations are real. All three were **already clean at R1, R2 and R3**, so
this is strictly narrower than the whole-clause `hasLowCalibration` it replaced
— the 703-statement differential finds zero cases where the new code is more
permissive than the old. And a trailing "results may vary" is, on the natural
reading, a disclosure that calibrates the result just asserted. The handoff
discloses the exception and its reasoning rather than burying it. I record it as
`N10-R4`, Minor.

### 4.6 What I did not find

- No regression, on any of 939 distinct statements (§6).
- No false rejection, on 135 real promoted texts or 22 legitimate controls.
- No content, research, approval, graph, source, grade or publication-state
  change.
- No modification to any prior review artifact or handoff.
- No repair of the candidate by this review.

---

## 5. Findings

### 5.1 CRITICAL

**None.**

### 5.2 IMPORTANT

**None.**

`I7-R3` — the sole Important finding of R3 — is **CLOSED**. Evidence: §3.3
(mechanism A: 4/4 statements now rejected, 6/6 joining-device controls correct,
3/3 legitimate controls clean, 9/9 fresh attacks rejected) and §3.4 (mechanism
B: 7/7 statements now rejected, 7/7 control-triad forms correct, 5/5 legitimate
hedges clean, 4/4 trailing-calibration controls clean, 8/8 fresh attacks
rejected), with zero false rejections across 135 promoted texts (§3.5) and zero
regressions across 939 statements (§6).

### 5.3 MINOR — new in R4, nonblocking, with impact and destination

**`N9-R4` — the shared new-assertion boundary vocabulary is incomplete, so
exceptions can still be crossed by `because`, `since`, `or`, `therefore`,
`whilst`, `plus`, `then` and `also`.**

_Site:_ `src/lib/content/validation.ts:169–170` (`NEW_ASSERTION_BOUNDARY`) —
**not** either of the two sites this remediation was authorized to change.

_Evidence:_ §4.1–§4.3. Seven natural-prose statements of the banned class pass
clean, of which `whilst` and `or` are the strongest because `while` is already
covered and `or` is a coordinating conjunction.

_Impact:_ **lower than `I7-R3`.** Three independent reasons. (a) It is
pre-existing and unchanged at all four candidate commits, verified
statement-by-statement, so it is not a defect of any SBLA-011 remediation
(§4.2). (b) It equally affects the preceding-hedge and single-trial paths that
R3 audited and passed, so treating it as blocking here would retroactively
invalidate accepted criteria on untouched code (§4.3). (c) Nothing is published
— 26/26 records `unpublished`, three approval fields null — and all 135 promoted
texts pass and contain none of these shapes, so there is no live
mis-publication. Against that: the shapes are natural prose, and a drafter
writing British English could plausibly produce the `whilst` form. This is why
it is recorded as a Minor rather than closed.

_Severity rationale:_ R3 graded `I7-R3` Important because an exception was
**unbound from the token it scoped**. That structural defect is repaired: the
exemptions are now positionally bound and 321 previously-clean statements are
rejected. What remains is breadth of a certified shared vocabulary at a third
site the authorization forbade changing (§4.4) — the same class as `N6-R3` and
`N7-R3`, which R3 itself graded Minor for exactly this reason ("branch breadth
rather than inherited exemption"). Under AGENTS.md, a nonblocking Minor is
permissible when impact and follow-up destination are recorded; both are
recorded here.

_Destination:_ **SBLA-012 lint hardening**, folded together with `N6-R3`,
`N7-R3` and `N8-R3` as one task. The concrete change is to extend the
`NEW_ASSERTION_BOUNDARY` alternation to at least
`because|since|or|therefore|whilst|plus|then|also|thus|hence|moreover`, then
re-run the full 135-field corpus and the eleven `I5-R2` branches to confirm no
qualifier false-rejects — the measurement R3 §3.5 showed is mandatory before
touching these branches. It must **not** be attempted inside SBLA-011.

**`N10-R4` — the `explicitResultVariability` escape bypasses the boundary test
it sits next to.**

_Site:_ `src/lib/content/validation.ts:461–466`.

_Evidence:_ §4.5. "Volume causes strength, but the mechanism is unclear and
results may vary." passes clean at `certainty: 'low'` although a new assertion
separates the causal token from the disclosure.

_Impact:_ **low.** All affected shapes were already clean at R1, R2 and R3, so
the exception is strictly narrower than the `hasLowCalibration(clauseContaining(…))`
call it replaced; the differential finds zero statements where the new code is
more permissive. The trailing phrase is itself a calibration of the result just
asserted, which is the reading the handoff gives and which I consider defensible.
The exception is narrowly literal (`and results may|might`) rather than a general
class. It is disclosed in the handoff's "Decisions made" rather than silent.

_Destination:_ **SBLA-012 lint hardening**, alongside `N9-R4`. Preferred fix: keep
the disclosure but require it to attach to the causal assertion — for example by
rejecting the escape when a boundary other than the `and` introducing `results`
lies between the causal token and the phrase.

**`N11-R4` — the remediation handoff's acceptance criterion 2 is stated more
broadly than the authorization permits, and is not literally met.**

_Site:_ `reviews/releases/SBLA-011-r3-remediation-handoff.md`, "Acceptance
criteria" item 2: "All 15 R3 residual statements are rejected…".

_Evidence:_ R3 §7.4 records 16 primary-set leaks comprising 15 distinct
statements. Of those, the report reproduces 14 verbatim: four mechanism-A
(§4.1), seven mechanism-B (§4.2) and the three Minor shapes `N6-R3`, `N7-R3` and
`N8-R3` (§5.3); the fifteenth is not reproduced anywhere in the report text, so
I could not replay it and say so here rather than implying I did. Of the 14 I
could replay, the eleven `I7-R3` statements now reject (§3.3, §3.4) and the
three Minor shapes remain clean:

```
clean  "Every tier-2 lifter everywhere benefits in this slice."           (N6-R3 shape)
clean  "Across seven trials, all 7 humans everywhere respond."            (N7-R3 shape)
clean  "The study reports a change, and every participant everywhere gains."  (N8-R3 shape)
```

_Impact:_ **documentation only, and the candidate is correct.** The owner
authorization routes `N6-R3` and `N7-R3` to SBLA-012 and permits `N8-R3` to
close "only if it is an automatic consequence of the mechanism-A fix" — it was
not, because the mechanism-A change is confined to the negation branch and
`N8-R3` lives in the `study reports … every specimen` branch at
`validation.ts:212–224`. The handoff's own "Constraints" and "Decisions made"
sections state this correctly and explicitly say "N8-R3 is not represented as
closed by this patch." The defect is solely that acceptance criterion 2, read in
isolation, claims more than the authorization asked for and could be
mis-recorded as met in full.

_Destination:_ the SBLA-011 acceptance record. The criterion should be read as
"all eleven `I7-R3` statements are rejected"; `N6-R3`, `N7-R3` and `N8-R3`
remain open with their R3 destinations. No code change.

### 5.4 Prior findings — status in this candidate

| Finding              | Round | Status at `59ec56d`                                                                                   |
| -------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
| `C1`                 | R1    | closed at R2; regression-only here — checksum path byte-identical (§3.2)                              |
| `I1`–`I4`, `I6`      | R1    | closed at R2; regression-only here (§3.2, §6)                                                         |
| `I5` → `I5-R2`       | R1/R2 | closed at R3 and still closed — all four joining devices agree on both paths (§3.3, §3.4)             |
| **`I7-R3`**          | R3    | **CLOSED** — 11/11 statements rejected, 22/22 legitimate controls clean, 17/17 fresh attacks rejected |
| `N1` (R2 Minor)      | R2    | closed at R3 by measurement; not reopened                                                             |
| `N2`–`N5` (R2 Minor) | R2    | out of authorized scope; destinations unchanged; not reopened and not silently closed                 |
| `N6-R3`, `N7-R3`     | R3    | **open**, routed to SBLA-012 per owner authorization; shapes confirmed still clean (§5.3)             |
| `N8-R3`              | R3    | **open** — did not close as a free consequence; routed to SBLA-012 (§5.3 `N11-R4`)                    |
| R1 `M1`–`M7`, `M9`   | R1    | out of authorized scope; remain open with recorded destinations                                       |
| R1 `M8`              | R1    | closed at R2 by explicit R1 instruction                                                               |

No prior finding is represented as fixed that I did not verify, and none is
silently closed.

---

## 6. Regression safety

The 703-statement differential corpus was generated systematically rather than
hand-picked: six negation prefixes × twenty joiners × three universal riders
(360), five hedges × twenty joiners × three causal riders (300), three causal
assertions × eleven trailing disclosures (33), and ten legitimate controls. Each
statement was evaluated against all four candidate implementations in one
process.

| Comparison                    | Statements rejected there but **clean** at `59ec56d` |
| ----------------------------- | ---------------------------------------------------: |
| `478411a` (R1 candidate) → R4 |                                                **0** |
| `ebb1e41` (R2 candidate) → R4 |                                                **0** |
| `f95cfaf` (R3 candidate) → R4 |                                                **0** |

| Comparison                    | Statements clean there but **rejected** at `59ec56d` |
| ----------------------------- | ---------------------------------------------------: |
| `f95cfaf` (R3 candidate) → R4 |                                              **321** |

**No statement rejected by any earlier candidate is clean at this one.** The
gate is monotonically stronger and 321 statements stronger than the candidate it
replaces. All ten legitimate controls are clean at all four versions.

Other regression evidence:

- **Diff scope.** Exactly three paths from `cf7efc5`, matching the handoff's
  declared list (§3.1).
- **Blast radius.** Three hunks, all inside the certainty-lint region; all seven
  critical validators and all six shared primitives byte-identical (§3.2).
- **Protected trees byte-identical** — `content/`, `content-drafts/`,
  `research/`, `public/data/`, `docs/` (§3.5).
- **Graph bundle byte-identical**, blob `df815a01…`, SHA-256 `4bd4787c…`,
  deterministic across three consecutive recompilations (§7.3).
- **Publication still fail-closed** — 26/26 `unpublished`, three approval fields
  null, manifest and change directories carrying only `.gitkeep` (§3.5).
- **No prior artifact modified** (§1.6).
- **Full gate green twice** on the pinned runtime, every count matching the
  handoff (§7.2).

---

## 7. Commands run and real results

### 7.1 Pinned runtime

```
$ node --version      v24.20.0      (host default is v24.14.0 and does not satisfy the engine)
$ pnpm --version      11.24.0
$ pnpm install --frozen-lockfile    Done in 8.2s using pnpm v11.24.0
```

`package.json` declares `"engines": {"node": ">=24.20.0 <25", "pnpm": "11.24.0"}`
and `"packageManager": "pnpm@11.24.0"`. Both satisfied exactly. The pinned Node
was taken from the `fnm` installation rather than the host default.

### 7.2 `pnpm verify` — exit 0, three times

| Gate stage                      | Result observed                                                               | Handoff claim | Match |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------- | ----- |
| Prettier / ESLint / Astro check | `Result (69 files): 0 errors, 0 warnings, 0 hints`                            | 69 files, 0   | ✓     |
| Unit tests                      | `Test Files 20 passed (20)`, `Tests 317 passed (317)`                         | 20 / 317      | ✓     |
| Promotion check                 | `SBLA-009 promotion verified 94 production records.`                          | 94            | ✓     |
| Content validation              | `Content validation passed: 95 records.`                                      | 95            | ✓     |
| MDX lint                        | `MDX claim lint passed: 0 public MDX files checked.`                          | pass          | ✓     |
| Graph                           | `Graph validation passed: 94 nodes and 120 edges match deterministic output.` | 94 / 120      | ✓     |
| Research integrity              | `Research integrity passed: 1 complete bundle checked (SBLA-009).`            | 1 bundle      | ✓     |
| Evidence status                 | `Evidence status passed: 68 sources checked as of 2026-09-16.`                | 68 sources    | ✓     |
| Static build                    | `1 page(s) built in 539ms` / `507ms`                                          | 1 page        | ✓     |
| Portability                     | `Test Files 3 passed (3)`, `Tests 17 passed (17)`                             | 17/17         | ✓     |
| Foundation contract             | `Foundation contract passed at C:\src\s011review-r4\`                         | pass          | ✓     |
| Asset spike / decision          | both passed                                                                   | pass          | ✓     |

Both runs exited 0 with identical counts. Every count the handoff records is
accurate.

A third run was made after this report was written and formatted, to confirm the
gate stays green with the new file present — this report is the only path the
review adds, and `pnpm format:check` covers it. That run also exited 0 with the
identical counts above. Its tree differs from the reviewed tree only by this
report, so the two runs in the table remain the evidence for the candidate
itself.

### 7.3 Focused suite and graph determinism

```
$ pnpm vitest run tests/unit/content-validation.test.ts
Test Files  1 passed (1)
Tests  85 passed (85)
exit 0
```

85/85, matching the handoff exactly, and 20 more than R3's 65.

```
$ pnpm validate:graph ×3, hashing public/data/evidence-graph.v1.json after each
4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446
4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446
4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446
```

Byte-identical across three recompilations, identical to the committed blob, and
equal to the value R3 recorded.

### 7.4 Probe totals, and the candidate was not modified by this review

| Probe set                                                     | Statements | Correct | Residual |
| ------------------------------------------------------------- | ---------: | ------: | -------: |
| R3 §4.1 replay + joining-device + legitimate controls         |         14 |      14 |        0 |
| R3 §4.2 replay + control triad + legitimate hedges            |         19 |      19 |        0 |
| Legitimate trailing-calibration controls                      |          4 |       4 |        0 |
| Fresh mechanism-A attacks (my wording)                        |          9 |       9 |        0 |
| Fresh mechanism-B attacks (my wording)                        |          8 |       8 |        0 |
| Joiners outside the recorded boundary set                     |         13 |       1 |       12 |
| R3 Minor shapes `N6-R3`, `N7-R3`, `N8-R3` (routed, not scope) |          3 |       0 |        3 |
| **Primary probe-set total**                                   |     **70** |  **55** |   **15** |
| Cross-version differential grid (× 4 commits = 2,812 evals)   |        703 |       — |        — |
| Residual + shared-primitive study (× 4 commits = 124 evals)   |         31 |       — |        — |
| Promoted corpus sweep (× 2 implementations = 270 evals)       |        135 |     135 |        0 |

The 15 primary-set residuals are the 12 `N9-R4` statements and the 3 routed R3
Minor shapes. **Zero** are `I7-R3` statements. **Zero** are false rejections.

```
$ git status --porcelain=v1     (no output, after all probes, both verify runs and three graph runs)
$ git rev-parse HEAD            59ec56d774cbbd2e7ec1810fb22d506bf2864a9e
$ git rev-parse HEAD^{tree}     dc3f4f3212072f995374d6e5309687ed62d8f5f6
```

The candidate is unmodified. Every probe program was written outside the
repository. No file under review was repaired, reformatted or staged.

### 7.5 Measurement honesty

Token usage is not instrumented in this environment, so no figure is reported
and none is estimated. Measurable proxies for this round: 1 frozen install, 3
full `pnpm verify` runs (2 on the candidate tree, 1 with this report present), 1
focused vitest run, 3 `pnpm validate:graph` runs, 1 `prettier` check/write pair
on this file, 4 scratch probe programs covering 3,276 lint evaluations over 939
distinct texts, and 1 full 135-field corpus sweep against each of two
implementations.

---

## 8. Criterion-by-criterion matrix

Criterion 13 was audited in full. Every other row was checked **for regression
only** against §6 and carries its R3 result forward; those rows are not a fresh
independent audit and must not be read as one.

| #   | Criterion (queue row §18 / handoff)                                                        | R1       | R2       | R3       | R4                    | Evidence                                             |
| --- | ------------------------------------------------------------------------------------------ | -------- | -------- | -------- | --------------------- | ---------------------------------------------------- |
| 1   | Candidate changes only the bounded files listed in the handoff                             | PASS     | PASS     | PASS     | **PASS**              | §3.1 — 3 paths from `cf7efc5`, exactly as declared   |
| 2   | `pnpm evidence:status && pnpm verify` passes from a clean checkout                         | PASS     | PASS     | PASS     | **PASS**              | §7.2 — exit 0 twice on the pinned runtime            |
| 3   | 23 claims promoted exactly as R4 approved                                                  | PASS     | PASS     | PASS     | **PASS (regression)** | §3.5 — `content/` tree byte-identical                |
| 4   | 68 cited sources have faithful production metadata                                         | PASS     | PASS     | PASS     | **PASS (regression)** | §3.5 — sources tree byte-identical                   |
| 5   | Sources have valid current status                                                          | PASS     | PASS     | PASS     | **PASS (regression)** | §7.2 — `evidence:status` exit 0, 68 sources          |
| 6   | One muscle and two exercise records validate                                               | PASS     | PASS     | PASS     | **PASS (regression)** | §7.2 — 95 records validated                          |
| 7   | Deterministic 94-node/120-edge graph with no missing references                            | PARTIAL  | PASS     | PASS     | **PASS**              | §7.3 — 3/3 recompilations byte-identical             |
| 8   | Graph fails closed on reference and manifest defects                                       | PARTIAL  | PASS     | PASS     | **PASS (regression)** | §3.2 — manifest/review validators byte-identical     |
| 9   | Approval-manifest rules: exact checksum coverage                                           | FAIL     | PASS     | PASS     | **PASS (regression)** | §3.2 — `recordContentChecksum` byte-identical        |
| 10  | No claim renders publicly without approved state, owner approval, manifest ID and checksum | FAIL     | PASS     | PASS     | **PASS (regression)** | §3.5 — 26/26 unpublished, three fields null          |
| 11  | Mixed/qualified evidence is disclosed with source roles and locators                       | PASS     | PASS     | PASS     | **PASS (regression)** | §3.5 — records byte-identical                        |
| 12  | No unconstrained factual MDX or raw HTML passes the lint                                   | FAIL     | PASS     | PASS     | **PASS (regression)** | §3.2, §7.2 — MDX lint untouched and green            |
| 13  | **Certainty-lint exceptions are narrowly bounded**                                         | **FAIL** | **FAIL** | **FAIL** | **PASS**              | **§3.3, §3.4** — `I7-R3` closed; `N9-R4` Minor, §5.3 |
| 14  | No owner approval or publication eligibility inferred from R4                              | PASS     | PASS     | PASS     | **PASS (regression)** | §3.5 — 26/26 unpublished                             |
| 15  | No SBLA-012+ surface pre-empted                                                            | PASS     | PASS     | PASS     | **PASS (regression)** | §3.5 — manifests and changes carry only `.gitkeep`   |
| 16  | Role boundary and immutability respected by this review                                    | PASS     | PASS     | PASS     | **PASS**              | §1.5, §1.6, §7.4                                     |

Criterion 13, the sole failure at R1, R2 and R3, now passes. All sixteen rows
are PASS.

---

## 9. What this remediation got right

Recorded deliberately, so that a PASS does not flatten the distinctions and so
none of it is redone:

- **The fix is the minimum that works.** Two sites, one file, one existing
  primitive reused, no new vocabulary, no parser, no content change. It deletes
  `hasLowCalibration` outright rather than leaving a dead permissive path, which
  is why `I5-R2`'s named function no longer exists anywhere in the file.
- **Positional binding, not blanket banning.** The mechanism-A test asks whether
  a boundary lies _between_ the `not` and the matched token. That is why
  "…though not in every study that measured it" — a real promoted text
  containing a boundary token — stays clean while "This is not always true and
  all lifters gain size." is rejected. A cruder implementation would have broken
  promoted content; this one does not, and 135/135 confirms it.
- **Monotonic strengthening with zero false rejections.** 321 new catches, 0
  regressions, 0 false rejections, over 939 distinct statements and four
  implementations. That is an unusually clean result for a change to a
  natural-language heuristic.
- **The intermediate failure is disclosed.** The handoff records that a first
  attempt broke the positive control "Resistance training increases hypertrophy
  and results may vary by individual" because the calibration slice ended at
  `may`, and that the check was corrected to bind through `results may/might`. I
  reproduced that control green (§3.4). Recording a failed attempt that nobody
  would otherwise see is the behaviour the evidence rules ask for.
- **Scope discipline under pressure.** The handoff explicitly declines to fold
  in `N8-R3` because doing so would touch a third site outside the two-site
  authorization, and says so rather than quietly taking the free win R3 §10.1
  suggested might be available. §4.3 shows that restraint was correct: the third
  site is entangled with paths that would then need re-verification.
- **The handoff is accurate.** Every count I re-ran matched it: 85/85 focused,
  317/317 unit, 20 test files, 69 files 0 diagnostics, 94 production records, 95
  records, 94/120 graph, 1 bundle, 68 sources, 1 page, 17/17 portability. Its
  one overstatement is acceptance criterion 2 (`N11-R4`), and its own
  Constraints section contradicts that overstatement correctly.

---

## 10. Destinations and the acceptance position

### 10.1 What carries forward to SBLA-012

One lint-hardening task should carry four items together, because they are the
same class — breadth of a bounded regex heuristic — and because fixing any one
of them requires the same 135-field false-rejection measurement:

| Item     | Site                    | Summary                                               |
| -------- | ----------------------- | ----------------------------------------------------- |
| `N6-R3`  | `validation.ts:237`     | `tier-\d … in this slice` does not constrain the noun |
| `N7-R3`  | `validation.ts:280–301` | `all <N>` matches the number without noun agreement   |
| `N8-R3`  | `validation.ts:212–224` | `study reports … every specimen` spans a conjunction  |
| `N9-R4`  | `validation.ts:169–170` | boundary vocabulary omits eight ordinary joiners      |
| `N10-R4` | `validation.ts:461–466` | `results may/might` escape bypasses the boundary test |

`N9-R4` subsumes `N8-R3` if the vocabulary fix is accompanied by the
`crossesAssertionBoundary` call R3 §10.1 describes for that branch.

### 10.2 On the acceptance scope, stated once and not argued

CLAUDE.md and AGENTS.md permit one bounded remediation and one complete-artifact
recheck; that budget was extended twice by explicit owner authorization, the
second time recording that it "does not establish a general additional-review
entitlement." This round consumed the final authorized recheck and returns PASS.

I am not requesting, recommending or implying a fifth round. `N9-R4`, `N10-R4`
and `N11-R4` are recorded as nonblocking Minors with impact and destination, per
the AGENTS.md rule that permits exactly that, and they do not constitute a new
named material risk that changes the acceptance scope. Under CLAUDE.md, "Do not
request or create extra review layers after PASS unless a new named material
risk changes the acceptance scope" — none does.

One factual input the owner may want, which is mine to supply and not to weigh:
criterion 13 is enforced by a regex heuristic, and both R3 and this round found
previously undetected shapes in it. Each round of probing has found fewer and
narrower ones — R1 and R2 found `I5`/`I5-R2`; R3 found `I7-R3` plus three
Minors; R4 finds no Important and three Minors, two of them on code this
remediation did not touch. If the owner wants a certainty gate with a stronger
guarantee than "no reviewer has yet found a shape it misses," that is a design
decision for SBLA-012 — a clause-level parser rather than a widened
alternation — and not something a further review round of this implementation
can deliver.

---

## 11. Reviewer limitations

- **Scope.** Focused criterion-13 recheck plus regression safety. Criteria 1–12
  and 14–16 are regression-only (§6) and marked as such in §8.
- **Heuristic audit of a heuristic gate.** §2 and §4 state this directly. My
  clean results mean my attacks failed, not that the families are sound.
- **One R3 residual statement could not be replayed.** R3 §7.4 counts 15
  distinct residuals; its text reproduces 14. I replayed those 14 and report
  their status in §5.3 `N11-R4`. I did not guess at the fifteenth.
- **No network access**; no primary source opened; no scientific entailment
  re-litigated.
- **Role-path boundary evidence is not self-certified** (§1.5). The
  authoritative check must be run by Codex or CI from a trusted checkout.
- **Browser, e2e, a11y, visual and performance suites were not run.**
- **Token usage is not instrumented** (§7.5).

---

## 12. Verdict

**PASS — 0 Critical, 0 Important, 3 Minor (`N9-R4`, `N10-R4`, `N11-R4`, all
nonblocking with impact and destination recorded).**

`passRequiresZeroCritical` is satisfied. `passRequiresZeroImportant` is
satisfied.

**Reviewed commit:** `59ec56d774cbbd2e7ec1810fb22d506bf2864a9e`
**Reviewed tree:** `dc3f4f3212072f995374d6e5309687ed62d8f5f6`
**`src/lib/content/validation.ts` SHA-256:**
`0787ca60c7f7ad96e1049bf4e9c521a2fd7beb12f6043c47d180d981d7ad2fc9`
**Graph bundle SHA-256:**
`4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`, unchanged
**R3 report reviewed against:** `cf7efc5c8e15923e1d8b314785ce946716b68e9e`,
SHA-256 `b5cee8420b5f406d4a282229e330e30549437696e808dd6a7159b3ebbde81873`

`I7-R3` is closed. Both certainty exceptions are now bound to the token they
scope: all eleven statements R3 reproduced as demonstrating the finding are
rejected, all four joining devices agree on both paths, all twenty-two
legitimate controls stay clean, and seventeen fresh attacks in wording that
appears nowhere in the prior record are rejected. All 135 promoted texts pass
unchanged with zero false rejections. The gate is monotonically stronger than
every earlier candidate — 321 new catches and zero regressions across 939
distinct statements evaluated against four implementations. Content, research,
approval and graph data are byte-identical; the graph bundle is deterministic
across three recompilations; publication remains fail-closed at 26/26
unpublished; and the full pinned gate passes twice with every count matching the
handoff.

Criterion 13 is met. The residual breadth of the shared boundary vocabulary is
recorded as `N9-R4`, a nonblocking Minor routed to SBLA-012: it is pre-existing
and unchanged at all four candidate commits, it lives at a third site the owner
authorization forbade changing, it equally affects paths R3 examined and passed,
and R3 itself certified that vocabulary as correct and instructed its reuse.

Per the repository stop rule I did not repair the candidate and wrote nothing
outside `reviews/releases/SBLA-011-r4.md`. SBLA-011's independent acceptance
review is complete.
