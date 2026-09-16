# Release review: SBLA-011 production evidence vertical slice, round 2

**Task:** SBLA-011 — the one permitted complete-artifact recheck of the Codex bounded remediation
that answers the seven blocking findings in `reviews/releases/SBLA-011-r1.md` (master plan §18 queue
row SBLA-011; §14 Phase 1).
**Reviewer role:** Claude Review (Account B), independent adversarial release audit.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
advise on, or remediate any SBLA-011 artifact. I received no authoring-role reasoning beyond the
committed artifacts, the committed handoffs, and the coordination ledger. I am the same Account-B
role that produced R1; this is the recheck R1 itself scheduled, not an added review layer.
**Review date:** 2026-09-16.
**Reviewer worktree:** `C:\src\s011review-r2`
**Reviewer branch:** `claude-review/SBLA-011-r2`
**Reviewer write path:** `reviews/releases/SBLA-011-r2.md` — sole permitted path, pre-claimed by
Codex before I wrote (AGENTS.md role table; CLAUDE.md "Never repairs the artifact under review";
`operating-policy.json` `writeBoundaries["claude-review"] = ["reviews/"]`). Every adversarial probe
ran in a scratch working copy held outside the repository.

**Reviewed candidate commit:** `ebb1e41bc115e281255c72b3b7242ebc8096cc4d` _(immutable)_
**Reviewed candidate tree:** `79475730e53bc834ce98731a86f195316b43cf9f` _(immutable)_
**Remediation implementation commit:** `805a75b78ec8626e8b2d96ad0a4b7b87fcaf4bfb`, tree
`da5cb79d19edd5501a7d21e3ac3f82029ebbd0b1`
**Failed R1 candidate:** `478411a7aa11da717d7a3de29fe7ad93d0d3604a`, tree
`c527f9d26de03890d9ad2d8ebca61c968ff76f0d`
**Governing R1 report:** `reviews/releases/SBLA-011-r1.md` at commit
`a01824ffdaf5b37488e907b37146db857773fb6c` — FAIL, 1 Critical, 6 Important, 9 Minor
**Governing handoff:** `reviews/releases/SBLA-011-r1-remediation-handoff.md`
**Accepted base commit:** `6e5948f6423d0e603ef4838c3393398c47c27c9b`
**Committed graph bundle:** `public/data/evidence-graph.v1.json`, SHA-256
`4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`, 67,872 bytes — unchanged from R1
**Runtime used:** Node.js `v24.20.0`, pnpm `11.24.0` (pinned exactly per AGENTS.md "Runtime")

---

## 0. Verdict

**FAIL — 0 Critical, 1 Important, 5 new Minor (nonblocking).**

The acceptance rule in CLAUDE.md, AGENTS.md and `operating-policy.json`
(`passRequiresZeroCritical`, `passRequiresZeroImportant`) is **not** satisfied: one Important finding
is unresolved.

**Six of the seven blockers are genuinely closed, and several are closed more strongly than the
remediation claims.** I reproduced every one of them independently, with working positive controls
so that a "pass" cannot be confused with a gate that simply rejects everything:

- **C1 is closed.** The exact R1 exploit — publish a claim under an approved, deployment-eligible
  manifest, then silently rewrite its `statement` and `plainLanguage` — now fails with both
  `CONTENT_CHECKSUM_MISMATCH` and `APPROVAL_CHECKSUM_MISMATCH` (§3.1). The manifest entry is now
  compared against the **computed** digest, not the record's self-declared string, so agreement can
  no longer be arranged by construction. `pnpm graph:compile` itself also exits 1, so an integrator
  cannot regenerate the bundle to paper over the drift. An exhaustive field sweep shows the digest
  covers **22 of 22** mutated fields, with only the self-referential `contentChecksum` normalized.
- **I1 is closed.** `preview` is gone from `Claim.astro` and `ClaimGroup.astro` entirely and
  eligibility is unconditional. The R1 bypass route now fails the build (exit 1) and emits no HTML,
  where R1 recorded exit 0 and a published `data-publication-state="unpublished"` document (§3.2).
  The MDX lint independently rejects `preview` in five spellings including three levels deep.
- **I2 is closed, and more thoroughly than R1 asked.** Required reviews are resolved with exact
  repository casing, required to be regular files, and hashed from disk. Missing, case-mismatched,
  non-regular and checksum-mismatched artifacts each fail closed with their own documented code
  (§3.3).
- **I3 is closed.** A record bound to a superseded manifest fails with
  `APPROVAL_MANIFEST_SUPERSEDED`, while the positive control — the same record bound to the current
  successor — still passes (§3.4).
- **I4 is closed structurally rather than by pinning a locale.** `localeCompare` is gone from the
  compiler; ordering uses an explicit code-point comparator and a field-by-field edge tuple. Across
  **14 compilations** (7 input orders × 2 locale modes, including a Lithuanian collator installed as
  `String.prototype.localeCompare`) every byte matched the committed bundle, with **0**
  `localeCompare` calls during compilation (§3.5). R1 Minor M8 is dissolved with it, as R1's own
  remediation plan item 4 directed.
- **I6 is closed.** All 21 unsafe MDX shapes I threw at it are blocked — raw HTML, free expressions
  and unsupported components inside `Editorial`, `Claim` and `ClaimGroup`, at three levels of
  nesting, inside blockquotes, list items, table cells and inline text (§3.6).

**Why it nevertheless fails.** **I5 is not closed.** All 14 adversarial statements from R1 §5.7 are
now correctly rejected and all 23 promoted claims still compile clean, so the vocabulary-keyed
waivers R1 objected to are genuinely gone. But the replacement exceptions are evaluated **per
clause, not per quantifier**: `hasUniversalLanguage` iterates each universal match, then tests the
_whole surrounding clause_ for scoping evidence. One properly scoped quantifier therefore exempts
every other universal quantifier sharing that clause. A sentence that the gate rejects on its own
passes once it is comma-joined to a scoped one:

```
REJECTED  "Every lifter everywhere benefits."
CLEAN     "In 20 participants, every participant gained size, and every lifter everywhere benefits."
REJECTED  "In 20 participants, every participant gained size. Every lifter everywhere benefits."
```

Splitting the rider into its own sentence — or separating it with a semicolon — restores the
rejection, which isolates clause scope as the cause beyond argument. The same laundering works
through three independent exception families (§3.7). This is not a contrived shape: "state the
study result, then over-generalize in the same sentence" is the single most natural way an evidence
draft over-claims, and "Five studies, all in trained men, show all lifters gain size." passes clean
at `moderate` certainty.

R1's remediation plan item 7 asked for "exceptions that require the universal quantifier **itself**
to be scoped to a named study, sample or measurement." The delivered exceptions require the
_clause_ to contain scoping evidence and then exempt whichever quantifier matched. The handoff's
claim that "Narrow exceptions cover only explicit sample references, enumerated inputs, exact
methodological domains, a quantified single-trial result, and measured ascent/descent moment arms"
overstates what was built: they also cover any additional universal sitting in the same clause.

**The Important is not currently exploited.** All 26 promoted records remain `unpublished` with null
owner approval, manifest ID and checksum; all 23 promoted statements are R4-approved verbatim and
pass the lint; nothing is reader-facing. As in R1, this blocks acceptance as a mechanism defect —
which is exactly what an acceptance review of a mechanism-building task exists to catch, and is the
same reasoning R1 applied to C1 and the remediation accepted.

**The evidence corpus is untouched.** `content/claims`, `content/sources`, `content/muscles` and
`content/exercises` are **byte-identical** to the failed candidate at the Git tree level, the graph
bundle is byte-identical, and no research artifact or prior review report was modified — the R1
report still hashes to the exact SHA-256 and byte count R1 recorded for itself (§4).

`pnpm evidence:status && pnpm verify` passes end to end, twice, on the pinned runtime, with every
count matching the handoff (§6).

§9 sets out what a fix requires. It also records a governance point the owner must decide rather
than a reviewer: the single bounded-remediation budget in the stop rule is now spent.

---

## 1. Provenance verification — performed before reading anything under review

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD
ebb1e41bc115e281255c72b3b7242ebc8096cc4d
$ git rev-parse HEAD^{tree}
79475730e53bc834ce98731a86f195316b43cf9f
$ git rev-parse --abbrev-ref HEAD
claude-review/SBLA-011-r2
$ git status --porcelain=v1
(no output)
```

Both match the commit and tree named in the remediation handoff and in the Codex claim record.

### 1.2 Ancestry

```
$ git log --oneline -5
ebb1e41 docs: hand off SBLA-011 R1 remediation
805a75b fix: enforce SBLA-011 publication gates
a01824f review: audit SBLA-011 production slice R1 — FAIL
478411a docs: hand off SBLA-011 production slice
8df97fc feat: build approved evidence vertical slice
```

The candidate is the remediation handoff commit on top of the remediation implementation commit
`805a75b`, which sits directly on the immutable R1 report commit `a01824f`, which sits on the failed
candidate `478411a`. The remediation was therefore based on the exact reviewed artifact commit, as
`operating-policy.json` `lifecycle.restrictedRoleDiffBase` requires.

### 1.3 Remote parity and release state

```
$ git ls-remote origin | grep -E "SBLA-011|refs/heads/main"
a01824ffdaf5b37488e907b37146db857773fb6c  refs/heads/claude-review/SBLA-011-r1
478411a7aa11da717d7a3de29fe7ad93d0d3604a  refs/heads/codex/SBLA-011-production-slice
ebb1e41bc115e281255c72b3b7242ebc8096cc4d  refs/heads/codex/SBLA-011-r1-remediation
6e5948f6423d0e603ef4838c3393398c47c27c9b  refs/heads/main
```

Exact parity. `origin/codex/SBLA-011-r1-remediation` equals my `HEAD`; the R1 report branch and the
failed candidate branch are unmoved at their recorded commits. **`origin/main` is still
`6e5948f`** — the SBLA-010 acceptance commit — so no part of SBLA-011 has been integrated, and the
prohibition on merging before a PASS recheck is being honoured.

### 1.4 The exact one-path review claim, verified before writing

My role cannot write `docs/runbooks/current-work.md`, so I verified the Codex-recorded claim on the
coordination branch before writing anything:

```
$ git show codex/SBLA-007-review-coordination:docs/runbooks/current-work.md | grep SBLA-011
| SBLA-011 complete recheck R2 | Claude Review (account B) | `claude-review/SBLA-011-r2` |
  `C:\src\s011review-r2` | `ebb1e41bc115e281255c72b3b7242ebc8096cc4d` | 2026-09-16 15:24 EDT |
  `reviews/releases/SBLA-011-r2.md` | `reviews/releases/SBLA-011-r2.md` |
```

Branch, worktree, base commit, expected handoff and the single owned path all match this session.
Note that `docs/runbooks/current-work.md` **on the candidate branch** contains no SBLA-011 row; the
claim lives only on the Codex coordination branch, as CLAUDE.md prescribes
(`claimRecordLocation: "codex-coordination-branch"`). That is correct behaviour, not an omission.

### 1.5 Role-path boundary

This review adds exactly one file, `reviews/releases/SBLA-011-r2.md`, and modifies, deletes or
renames nothing. All probe material — scratch working copy, harnesses, fixtures, logs and the
`.astro` probe routes — lived in `…/jobs/027f2542/tmp/`, outside the repository.

**One disclosure.** Early in the session a shell-redirection typo in one of my own commands
(`2>\&1` instead of `2>&1`) created a zero-byte untracked file named `&1` in the worktree root. It
was never staged, never committed, and is not part of the candidate. I removed it as soon as
`git status` surfaced it, and re-confirmed `git status --porcelain=v1` empty with
`HEAD^{tree}` still `79475730e53bc834ce98731a86f195316b43cf9f`. The candidate's tracked tree was
never modified at any point.

---

## 2. Methods, and the limits of this review

This is a **complete-artifact recheck**, not a diff review. I re-ran the full gate chain, re-derived
the corpus invariants from scratch, and re-probed every mechanism R1 exercised — including the ones
R1 passed — rather than trusting that untouched code stayed correct.

For each blocker I wrote an **independent** probe rather than reading the candidate's own test for
it, and paired every negative probe with a **positive control**, so that a blocked exploit is
distinguishable from a gate that rejects everything. Where the remediation supplied fixtures, I
treated them as claims to be checked, not evidence.

For I5 and I6 I deliberately went beyond replaying R1's tables. Statements and MDX shapes that were
already in R1 were available to the remediation author as targets, so passing them proves only that
the author read the report. I therefore wrote fresh adversarial sets aimed at the **new** exception
logic, which is where the residual finding was found.

Scratch probes used a `git archive HEAD` export outside the repository with the installed
`node_modules` junctioned in, so probe code is the candidate's code, byte for byte.

Limits are recorded in §10.

---

## 3. The seven blockers, independently reproduced

### 3.1 C1 — closed. The checksum now binds real content

`src/lib/content/checksum.ts` is new. `recordContentChecksum` hashes the canonical JSON of the
record with **only** `contentChecksum` normalized to `null`, which breaks the self-reference while
leaving every other field covered. `validatePublishedManifestCoverage`
(`src/lib/content/validation.ts:495–559`) now computes that digest and checks it twice:

```ts
const computedChecksum = recordContentChecksum(record);
if (record.contentChecksum !== computedChecksum) /* CONTENT_CHECKSUM_MISMATCH */
if (!entry || entry.checksum !== computedChecksum) /* APPROVAL_CHECKSUM_MISMATCH */
```

The manifest entry is compared to the **computed** digest, not to the record's declared string. The
R1 defect — two author-supplied strings agreeing by construction — is structurally gone.

**The R1 exploit, replayed.** Using the candidate's own loader and checksum code, I published
`claim-pectoralis-major-portions` (approved, owner-approved, manifest-bound, correct computed
checksum `63c97b6c751b65fd522aa53ca6fe51a6ca05c9b569696bbe6d628eeea4425030`), wrote an approved
deployment-eligible manifest covering that digest with a genuine required-review entry, then
rewrote the claim's `statement` and `plainLanguage` while leaving checksum and manifest untouched —
exactly R1 §5.1. Neutral replacement wording was used so no other lint could fire and mask the
result.

| Scenario                                            | `graph:compile` | `validate:content` | `validate:graph` | `evidence:status` | Codes                                                     |
| --------------------------------------------------- | --------------- | ------------------ | ---------------- | ----------------- | --------------------------------------------------------- |
| `approved-baseline` (approved text)                 | 0               | 0                  | 0                | 0                 | — **gate passes, as it must**                             |
| `content-drift` (**text rewritten after approval**) | **1**           | 0                  | **1**            | 0                 | `CONTENT_CHECKSUM_MISMATCH`, `APPROVAL_CHECKSUM_MISMATCH` |

```
Graph validation failed:
- [CONTENT_CHECKSUM_MISMATCH] claim-pectoralis-major-portions.contentChecksum: The record checksum
  does not match its canonical content.
- [APPROVAL_CHECKSUM_MISMATCH] claim-pectoralis-major-portions.contentChecksum: Manifest
  manifest-sbla-011-probe does not cover the record's exact checksum.
```

`pnpm graph:compile` also exits 1, so the "recompile and commit" move that made R1's exploit
invisible is itself blocked. The `approved-baseline` row is the control that matters: a correctly
approved published claim passes the whole chain, so the failure above is discrimination, not
blanket rejection.

**Field coverage, swept exhaustively.** Trusting that "every other field remains covered" would be
taking the remediation's word for it, so I mutated 22 distinct fields and compared digests:

```
COVERED  statement · plainLanguage · qualifiers[0] · qualifiers(drop) · scope.population ·
         scope.conditions · evidence.certainty · evidence.applicability · sourceLinks[0].locator ·
         sourceLinks[0].role · sourceLinks[0].sourceId · sourceLinks ORDER swap ·
         sourceLinks(drop) · reviewState · publicationState · approvalManifestId ·
         review.ownerApprovedAt · review.reviewDueAt · id · type · relationships(add) ·
         history.updatedAt
covered 22/22 mutations
contentChecksum self-reference normalized: YES (by design)
```

Source-link **order** is covered, which matters: R1 §3.1 proved order fidelity of the promotion, and
the checksum now protects it. Master plan §10.6 — "changing any included entity/page invalidates
eligibility and requires a new manifest" — is satisfied.

### 3.2 I1 — closed. The public preview escape hatch is gone

`preview` no longer appears in `Claim.astro` or `ClaimGroup.astro` in any form: not in `Props`, not
destructured, not forwarded to children. The five-part eligibility test is unconditional:

```ts
const eligible =
  claim.reviewState === 'approved' &&
  claim.publicationState === 'published' &&
  claim.review.ownerApprovedAt !== null &&
  claim.approvalManifestId !== null &&
  claim.contentChecksum !== null;
if (!eligible)
  throw new Error(`Claim ${id} is not eligible for public rendering.`);
```

**Reproduced end-to-end** with real Astro builds against `claim-bench-press-pectoralis-activation`,
which is `unpublished` with `ownerApprovedAt`, `approvalManifestId` and `contentChecksum` all null —
the same claim and the same two routes R1 used:

```
P1  <Claim id="claim-bench-press-pectoralis-activation" />
    [ERROR] Claim … is not eligible for public rendering.     BUILD EXIT=1   (R1: exit 1)
P2  <Claim id="claim-bench-press-pectoralis-activation" preview />
    [ERROR] Claim … is not eligible for public rendering.     BUILD EXIT=1   (R1: exit 0 — BYPASS)
    dist/probe/index.html emitted? NO                         (R1: YES, published unapproved claim)
```

The R1 bypass is dead. **Positive control P3:** the same component, with
`claim-pectoralis-major-portions` genuinely published under a valid manifest, builds cleanly
(exit 0) and emits correct markup, so the component still works rather than merely always throwing.

**Criterion 11 re-verified through the modified component.** R1 passed mixed-evidence disclosure,
but `Claim.astro` changed, so I re-proved it rather than assuming. Publishing the mixed-evidence
claim and building:

```
1 data-claim-id="claim-bench-press-pectoralis-activation"
1 data-publication-state="published"
1 evidence-claim__mixed">Evidence is mixed or qualified.<
1 data-source-role="qualifies"
3 data-source-role="supports"
```

Disclosure line, all four source roles with exact locators, and the hidden machine-readable claim ID
required by §10.7 are all intact.

The MDX lint now independently rejects the attribute (`MDX_PREVIEW_FORBIDDEN`) in every spelling I
tried — `preview`, `preview={true}`, `preview={false}`, on `ClaimGroup`, and nested three
`Editorial` levels deep. `preview={false}` being rejected is the right call: the attribute has no
legitimate use, so refusing it outright is stricter than refusing only truthy values.

### 3.3 I2 — closed. Required reviews are resolved and hashed from disk

`validateRequiredReviewArtifacts` (`scripts/content/validate.mjs:173–230`) walks each
`requiredReviews[].path` segment by segment through `readdir`, rejects anything that is not an exact
casing match, `lstat`s the result to require a regular file, then SHA-256s the bytes and compares.
It is called from `loadAndValidateRecords`, which `validate:content`, `validate:graph`,
`graph:compile` and `evidence:status` all funnel through.

Four independent probes, each against an otherwise-valid published claim:

| Probe                                                  | `compile` | `content` | `graph` | `status` | Code                                 |
| ------------------------------------------------------ | --------- | --------- | ------- | -------- | ------------------------------------ |
| `reviews/releases/NEVER-EXISTED.md` (R1's own fixture) | 1         | 1         | 1       | 1        | `MANIFEST_REVIEW_PATH_MISSING`       |
| correct path, checksum `eeee…e`                        | 1         | 1         | 1       | 1        | `MANIFEST_REVIEW_CHECKSUM_MISMATCH`  |
| `reviews/releases/sbla-011-r1.md` (wrong case)         | 1         | 1         | 1       | 1        | `MANIFEST_REVIEW_PATH_CASE_MISMATCH` |
| `reviews/releases` (a directory, not a file)           | 1         | 1         | 1       | 1        | `MANIFEST_REVIEW_NOT_REGULAR_FILE`   |

The case-mismatch check is a real improvement over what R1 asked for: on Windows and macOS a
case-insensitive filesystem would otherwise let `Reviews/Releases/…` resolve and hash correctly
while pointing at a path that does not exist in Git. The non-regular-file check closes the
symlink/directory substitution R1 did not probe. §10.6's "verifies all checksums and required review
reports" is now met.

### 3.4 I3 — closed. Superseded manifests cannot authorize publication

`validatePublishedManifestCoverage` now receives the `supersededManifestIds` set already computed by
`validateManifestChain` and emits `APPROVAL_MANIFEST_SUPERSEDED`.

| Probe                                                                | `compile` | `content` | `graph` | Result                                       |
| -------------------------------------------------------------------- | --------- | --------- | ------- | -------------------------------------------- |
| Claim bound to manifest **A**, with **B** superseding A (R1 fixture) | 1         | 0         | **1**   | `APPROVAL_MANIFEST_SUPERSEDED` — **blocked** |
| **Positive control:** same chain, claim bound to current **B**       | 0         | 0         | 0       | passes — 96 nodes, 120 edges                 |

The control is the point: the check distinguishes retired from current rather than rejecting any
record whose manifest participates in a supersession chain. §10.6's "exactly one **current**,
owner-approved manifest" is now enforced.

### 3.5 I4 — closed structurally. The graph bytes cannot depend on a locale

`localeCompare` is gone from `src/lib/graph/compiler.ts`. Ordering uses `compareCodepoint` (a plain
`<`/`>` comparison) for canonical object keys and node IDs, and `compareEdges`, a field-by-field
tuple comparator over `from`, `type`, `to`, `locator`. The `edgeKey` helper and its
collation-ignorable `\u0000` separator — R1 Minor **M8** — no longer exist, which is what R1's
remediation plan item 4 directed.

I did not pin a locale and re-measure; I tested whether locale can matter at all. Driving the
candidate's own `compileEvidenceGraph` over **7 input orders** (natural, 5 seeded shuffles,
reversed) under **2 collation regimes** — host default, and a Lithuanian `Intl.Collator` installed
as `String.prototype.localeCompare`, the exact collation R1 used to break the old compiler:

```
Intl.Collator default locale: en-US
committed bytes sha256: 4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446 (67,872 bytes)

IDENTICAL  natural order          IDENTICAL  shuffled seed 1..5          IDENTICAL  reversed order
localeCompare calls during compilation: 0
RESULT: all compilations byte-identical to the committed bundle          (both regimes)
```

**14 of 14 compilations byte-identical**, and **zero** `localeCompare` calls — the instrumented
counter proves the compiler never consults ICU, so no host locale can move a node or an edge. A
subprocess run with `LANG=lt_LT.UTF-8 LC_ALL=lt_LT.UTF-8` gave the same result. This is a stronger
fix than the locale pinning R1 proposed, because it removes the dependency instead of configuring
it.

The committed bundle's SHA-256 is **unchanged from R1**, independently confirming the handoff's
claim that recompilation produced identical bytes and that no graph data record was altered.

### 3.6 I6 — closed. The MDX lint recurses through allowed containers

`scanSafetyDescendants` (`src/lib/content/mdx-lint.ts:118–148`) walks the full subtree of
`Editorial`, `Claim` and `ClaimGroup`, applying the raw-JSX, module/expression and
unsupported-component rules at every depth and re-entering nested containers.

I ran 24 unsafe shapes plus 4 controls through the candidate's own `lintMdxClaims`. **All 21
applicable unsafe cases are blocked** and all 4 controls stay clean. R1's own bypass table first:

| R1 bypass                                    | R1 result | R2 result                       |
| -------------------------------------------- | --------- | ------------------------------- |
| `<Editorial>` ⊃ `<div id="x">`               | ALLOW     | `MDX_RAW_HTML`                  |
| `<Editorial>` ⊃ `{globalThis.process.env.…}` | ALLOW     | `MDX_MODULE_SYNTAX_UNSUPPORTED` |
| `<Editorial>` ⊃ `<Callout>`                  | ALLOW     | `MDX_COMPONENT_UNSUPPORTED`     |
| `<Claim id="a">` ⊃ `<div>`                   | ALLOW     | `MDX_RAW_HTML`                  |
| `<ClaimGroup ids={[…]}>` ⊃ `<span>`          | ALLOW     | `MDX_RAW_HTML`                  |

Then fresh shapes written for this recheck, which the remediation author had no list of:

| R2 probe                                        | Result                          |
| ----------------------------------------------- | ------------------------------- |
| `Editorial` ⊃ `Editorial` ⊃ `<div>`             | `MDX_RAW_HTML`                  |
| `Editorial` ⊃ `ClaimGroup` ⊃ `<div>`            | `MDX_RAW_HTML`                  |
| `Claim` ⊃ `Editorial` ⊃ `<div>`                 | `MDX_RAW_HTML`                  |
| `Editorial` ⊃ blockquote ⊃ `<div>`              | `MDX_RAW_HTML`                  |
| `Editorial` ⊃ table cell ⊃ `<div>`              | `MDX_RAW_HTML`                  |
| `Editorial` ⊃ inline `<b>` beside text          | `MDX_RAW_HTML`                  |
| `Editorial` ⊃ list item ⊃ `{expression}`        | `MDX_MODULE_SYNTAX_UNSUPPORTED` |
| `Editorial` ⊃ inline `{secret}` in text         | `MDX_MODULE_SYNTAX_UNSUPPORTED` |
| `Editorial`×3 ⊃ `<Claim preview />`             | `MDX_PREVIEW_FORBIDDEN`         |
| inline `<Editorial><div/></Editorial>` in prose | `MDX_UNCITED_FACTUAL_PROSE`     |

Controls — bare `<Claim id/>`, bare `<ClaimGroup ids/>`, a heading, and `<Editorial>` with plain
text — all return clean, so the recursion did not make the lint reject legitimate authoring.

Two results are _correctly_ clean and must not be miscounted as bypasses: factual prose and lists
inside `<Editorial>` (R1 explicitly declined to weight these, since §10.7 permits an explicit
editorial boundary), and arbitrary prose as a `Claim` child (R1 Minor **M4**, out of remediation
scope). Both remain as R1 left them.

### 3.7 I5 — NOT closed. The exceptions are bounded per clause, not per quantifier

**What the remediation did achieve.** The six incidental-keyword waivers
(`contrast|normalised|tier-\d|this slice|operator experience|measured by`), the bare `all <number>`
waiver, the whole-statement `in one study` waiver and the broad `^During` causal off-switch are all
gone. Replaying **R1 §5.7 verbatim**:

```
controls correctly rejected: 3/3
R1 bypasses now rejected:    14/14
```

Every one of R1's 17 statements now behaves correctly, including the handoff's own counter-example
class ("Every lifter gains pectoralis size …, measured by ultrasound." →
`CERTAINTY_UNIVERSAL`). And there are no false rejections: all **23** promoted claims compile clean
across both `statement` and `plainLanguage` (46 texts, 0 issues).

**The residual.** `hasUniversalLanguage` (`src/lib/content/validation.ts:168–255`) iterates every
universal match, but each exception test is applied to `clauseContaining(statement, match.index)` —
the whole clause. `clauseContaining` splits only on `.`, `;`, `!` and `?`, so a comma-joined rider
shares the clause with the scoped quantifier and inherits its exemption. The matched token is never
required to be the scoped one.

Three minimal triples, each isolating the mechanism against a different exception family. In every
case the rider is rejected standing alone, and becomes clean purely by being comma-joined:

| #   | Scoped part (clean alone)                            | Rider (rejected alone)              | Comma-joined |
| --- | ---------------------------------------------------- | ----------------------------------- | ------------ |
| A   | "In 20 participants, every participant gained size." | "Every lifter everywhere benefits." | **CLEAN**    |
| B   | "Five studies, all in trained men, report a change." | "All lifters gain size."            | **CLEAN**    |
| C   | "Every tier-1 programme in this slice works."        | "Every lifter gains from it."       | **CLEAN**    |

And the controls that prove clause scope is the cause, not wording:

```
REJECTED  "In 20 participants, every participant gained size. Every lifter everywhere benefits."
REJECTED  "In 20 participants, every participant gained size; every lifter everywhere benefits."
CLEAN     "In 20 participants, every participant gained size, and every lifter everywhere benefits."
```

Of 22 fresh adversarial statements written for this recheck, 6 pass that should not:

| Statement (all `moderate` unless noted)                                                    | Lint      |
| ------------------------------------------------------------------------------------------ | --------- |
| "In 20 participants, every participant gained size, and every lifter everywhere benefits." | **clean** |
| "The study reports that every specimen behaved this way, so every athlete will too."       | **clean** |
| "Five studies, all in trained men, show all lifters gain size."                            | **clean** |
| "Across seven trials, all 7 trials agree that all humans respond."                         | **clean** |
| "Every tier-1 programme in this slice works, and every lifter gains from it."              | **clean** |
| "Normalised every value, we conclude every athlete improves."                              | **clean** |

"every lifter everywhere benefits", "every athlete will too", "all lifters gain size" and "all
humans respond" are precisely the generic promises §10.8 and the acceptance criterion exist to
block. The remaining 16 statements are correctly rejected, including every attempt to widen the
`<N> specimens … every specimen`, `of all the X muscles`, and ascent/descent moment-arm exceptions
by substituting nouns or stacking causal verbs — those exceptions are genuinely tight. Two
legitimate controls ("Not all lifters gain …", "There is no evidence at all that …") correctly stay
clean.

**Aggravating factor.** Only **3** of the 46 promoted texts contain a universal token at all, and
they need exactly three exception branches: the negation prefix ("not in every study"), `of all the
X muscles`, and `<N> specimens … every specimen`. The other branches — `tier-\d … in this slice`,
`normalised every …`, `contrast|programmes|protocols … differing in every …`, `<N> studies, all`,
`all <N>`, `all change|vary|differ`, `never be evidence of`, `study reports … every specimen` —
serve **no promoted claim**. They exist only to be narrow enough to reject R1's specific
statements. Three of those unused branches are the ones my probes exploited. Exception surface that
protects nothing but can be laundered is a net loss.

**Severity.** Important, matching R1's grading of the same finding. The acceptance criterion
"certainty-lint exceptions are narrowly bounded" is not met while a clause boundary launders an
unscoped universal, and the shape is natural prose rather than a contrived string. As in R1, the
practical risk today is bounded — all 23 promoted statements are R4-approved verbatim and nothing is
published — but SBLA-011's job is to build the gate, and the gate admits the class it exists to
block.

---

## 4. The evidence corpus and prior artifacts are unchanged

### 4.1 Claims, sources and page records are byte-identical to the failed candidate

Compared at the Git tree level, which is a byte-exact comparison of every file and name in each
directory:

```
$ for d in content/claims content/sources content/muscles content/exercises; do
    git rev-parse 478411a:$d; git rev-parse HEAD:$d; done
content/claims       IDENTICAL  5bcec956a4b2680ad71df93400ebc7d5af021318
content/sources      IDENTICAL  d7ada27581d98c0b43937bbc778e30bc4347efd0
content/muscles      IDENTICAL  edf684d1b400d263b0c10f6fbf0af7f14b7ff07d
content/exercises    IDENTICAL  a80ef7ae34e93dc3a0a2c021982cae2e6b655964
content/approval-manifests  IDENTICAL (empty)   content/changes  IDENTICAL (empty)
public/data          IDENTICAL  b1d96bba3f89253374134ad18afff632bab37d09
```

23 claims, 68 sources, 1 muscle, 2 exercises, 0 manifests, 0 change records — unchanged. R1's
proofs that the 23 claims match the R4-approved values byte-for-byte and that the 68 sources are
faithful across 680 fields therefore carry forward without needing to be redone; nothing in this
remediation could have disturbed them.

### 4.2 Publication is still fail-closed across every promoted record

```
records checked: 26
all 26 are unpublished with ownerApprovedAt / approvalManifestId / contentChecksum all null
```

No owner approval or publication eligibility was inferred from the R4 evidence review, and the
remediation did not quietly publish anything to exercise its new code paths — the new happy and
adversarial manifest paths are driven entirely by fixtures. All 68 sources remain `"status":
"current"`.

### 4.3 No prior research or review artifact was modified

```
$ git diff --name-status a01824f..HEAD -- reviews/ research/ content-drafts/
A  reviews/releases/SBLA-011-r1-remediation-handoff.md
```

The only addition is the remediation's own handoff. The R1 report is untouched, and hashes to
exactly what R1 recorded for itself:

```
$ git show HEAD:reviews/releases/SBLA-011-r1.md | sha256sum ; wc -c
2fecef9e8516899df5c21ef1573ff97d37c618e377551ffb4fc233956715c8ef   64397
```

Both match R1's self-recorded values. Append-only immutability is intact.

### 4.4 Diff scope equals the handoff's declared file list

```
$ git diff --name-status 478411a..HEAD    # 16 files: 3 A, 13 M
$ git diff --stat 478411a..HEAD | tail -1
16 files changed, 1823 insertions(+), 99 deletions(-)
```

Of the 16, two are the R1 report and the remediation handoff, which are artifacts of the ancestry
rather than code. The remaining 14 match the handoff's "Files changed" list exactly — no omissions,
no extras. `docs/authoring/evidence-record-errors.md` documents all eight new codes with minimal
failing examples, and each matches the code I observed empirically.

---

## 5. Findings

### 5.1 CRITICAL

**None.** R1's C1 is closed and independently verified (§3.1).

### 5.2 IMPORTANT

**I5-R2 — The certainty-lint exceptions are scoped to the clause rather than to the quantifier, so
a properly scoped universal launders an unscoped one sharing its clause.**
`src/lib/content/validation.ts:168–255`. Each exception is tested against
`clauseContaining(statement, match.index)`, and `clauseContaining` splits only on `.`, `;`, `!`,
`?` — so a comma-joined rider inherits the exemption. Demonstrated in §3.7 with three minimal
triples across three independent exception families, plus `.`/`;` controls that restore the
rejection and prove clause scope is the cause. Six fresh adversarial statements pass clean,
including "In 20 participants, every participant gained size, and every lifter everywhere
benefits." and "Five studies, all in trained men, show all lifters gain size."
_Violates:_ master plan §10.8 (banned certainty phrases inconsistent with grade must fail the
build); acceptance criterion "Certainty-lint exceptions are narrowly bounded"; R1 remediation plan
item 7 ("exceptions that require the universal quantifier **itself** to be scoped"); the handoff's
Decisions-made claim that the exceptions "cover only explicit sample references, enumerated inputs,
exact methodological domains…".
_Mitigation:_ no record is published; all 23 promoted statements are R4-approved verbatim and pass
the lint; 14 of 14 R1 statements and 16 of 22 fresh ones are correctly rejected. This is a mechanism
defect, not a live mis-publication.
_Destination:_ SBLA-011 — see §9 for the governance question this raises.

### 5.3 MINOR — new in R2, nonblocking, with impact and destination

**N1 — Eight certainty-exception branches serve no promoted claim.** Only 3 of 46 promoted texts
contain a universal token, needing 3 branches; `tier-\d … in this slice`, `normalised every …`,
`contrast|programmes|protocols … differing in every …`, `<N> studies, all`, `all <N>`,
`all change|vary|differ`, `never be evidence of`, and `study reports … every specimen` protect
nothing. _Impact:_ pure added surface; three of them are the branches exploited in §3.7. _Destination:_
fold into the I5-R2 fix — delete rather than re-scope any branch no approved text needs.

**N2 — `lintMdxClaims` throws instead of reporting on malformed MDX.** `import x from "y";` inside
`<Editorial>` raises `Could not parse import/exports with acorn` out of remark, which
`scripts/content/lint-mdx.mjs` does not catch. _Impact:_ the gate fails **closed** (uncaught
exception → non-zero exit), so this is diagnostics quality, not a bypass: an author sees a stack
trace instead of a coded lint issue. _Destination:_ SBLA-012, wrap the parse in try/catch and emit a
`MDX_PARSE_FAILED` issue.

**N3 — Required-review verification lives in the script layer, not the shared library.**
`validateRequiredReviewArtifacts` is in `scripts/content/validate.mjs`, not in
`src/lib/content/validation.ts` beside the other manifest rules. Every current caller funnels
through `loadAndValidateRecords`, so the composite gate holds today (verified in §3.3, all four
entry points exit 1). _Impact:_ a future consumer calling `validateRecordGraph` directly would skip
review verification. _Destination:_ SBLA-012, move it beside `validateManifestChain`.

**N4 — `hasOutcomeFreeComparative` accepts any token after `for` / `in terms of`.**
`validation.ts:259–278` requires only a non-excluded word to follow, so "The bench press is better
for results." and "The bench press is superior in terms of things." pass clean, while R1's "better
for everything" is correctly blocked by the negative lookahead. _Impact:_ a vague comparator can
name a non-outcome; a regex cannot judge whether a noun is a measured outcome. _Destination:_
SBLA-012 page-schema work, or accept as a documented limit of the lint.

**N5 — One pre-existing unpinned `localeCompare` remains at `scripts/assets/mesh-map.mjs:614`,**
against four pinned `'en-US'` sites in the same file. _Impact:_ none for SBLA-011 — that file
predates this milestone, is outside the remediation's bounded scope, and its output is not
byte-compared by any gate. Recorded so it is not lost. _Destination:_ asset-pipeline hardening.

### 5.4 The nine R1 Minors — none improperly claimed as fixed

The handoff states "R1 Minors M1–M9 remain nonblocking and are not silently represented as fixed."
I verified each against the candidate rather than accepting the statement:

| R1 Minor                                               | Status in this candidate                                                        | Evidence                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| M1 — `study.sampleSize` / `durationWeeks` null         | **open**                                                                        | 68 sources, 0 non-null `sampleSize`, 0 non-null `durationWeeks`             |
| M2 — `Claim.astro` renders no `qualifiers`             | **open**                                                                        | 0 occurrences of `qualifiers` in the component; absent from P3 HTML         |
| M3 — headings/frontmatter exempt from the MDX lint     | **open**                                                                        | `isPresentationNode` still skips `heading`, `thematicBreak`, `yaml`, `toml` |
| M4 — `Claim`/`ClaimGroup` children unlinted, discarded | **open** (child _safety_ linting improved as an I6 side effect)                 | neither component declares `<slot />`; prose children still clean           |
| M5 — `relatedEntityIds` not referentially validated    | **open**                                                                        | no reference in `validation.ts`                                             |
| M6 — `validate:content` misses graph-level defects     | **open**                                                                        | content-drift: `validate:content` 0 while `validate:graph` 1 (§3.1)         |
| M7 — the green gate is time-bounded                    | **open**                                                                        | earliest `nextStatusCheckAt` still `2026-10-13`, ~27 days out               |
| M8 — `edgeKey`'s `\u0000` separator                    | **closed** — authorized: R1 plan item 4 said "fold in M8"; handoff disclosed it | `edgeKey` and `\u0000` no longer exist (§3.5)                               |
| M9 — MDX surface untested end to end                   | **open**                                                                        | 0 `Editorial` components, no `@astrojs/mdx`, 0 public MDX files             |

M8 is the only one closed, it was closed at R1's explicit instruction as part of I4, and the handoff
disclosed it rather than presenting it silently. The handoff's statement is accurate.

---

## 6. Commands run and real results

### 6.1 Pinned runtime

```
$ node --version      v24.20.0
$ pnpm --version      11.24.0
$ pnpm install --frozen-lockfile
  Done in 16.7s using pnpm v11.24.0                           (exit 0)
```

The host default is Node `v24.14.0` / pnpm `11.19.0`, which do not satisfy `engines`
(`node >=24.20.0 <25`, `pnpm 11.24.0`). Per AGENTS.md "Runtime" I used the pinned toolchain
explicitly, not the default.

### 6.2 `pnpm evidence:status && pnpm verify` — exit 0, twice

Run twice from the clean worktree; identical output both times.

```
Evidence status passed: 68 sources checked as of 2026-09-16.            EVIDENCE_STATUS_EXIT=0
$ prettier --check .          All matched files use Prettier code style!
$ eslint . --max-warnings 0   (clean)
$ astro check                 Result (69 files): 0 errors, 0 warnings, 0 hints
$ vitest run tests/unit       Test Files 20 passed (20)   Tests 274 passed (274)
$ promote-sbla-009 --check    SBLA-009 promotion verified 94 production records.
$ validate.mjs                Content validation passed: 95 records.
$ lint-mdx.mjs                MDX claim lint passed: 0 public MDX files checked.
$ graph/validate.mjs          Graph validation passed: 94 nodes and 120 edges match deterministic output.
$ research-integrity.mjs      Research integrity passed: 1 complete bundle checked (SBLA-009).
$ evidence/status.mjs         Evidence status passed: 68 sources checked as of 2026-09-16.
$ astro build                 1 page(s) built
$ vitest portability          Test Files 3 passed (3)   Tests 17 passed (17)
$ foundation/verify.mjs       Foundation contract passed
$ assets/spike.mjs            Asset spike passed: 4 candidate(s); 1 eligible, 2 ineligible
$ assets/decision.mjs         SBLA-006 asset decision passed
                                                                        VERIFY_EXIT=0
```

Every count matches the remediation handoff exactly: 69 Astro-checked files, 274 unit tests, 94
promoted records, 95 validated records, 94 nodes / 120 edges, 1 research bundle, 68 sources, 1 static
page, 17 portability tests. The handoff's verification section is accurate.

The zero-file MDX scan is truthful and disclosed: no public MDX route exists yet (R1 Minor M9), so
the AST gate is exercised by unit tests and by my §3.6 probes rather than by repository files.

### 6.3 The candidate was not modified by this review

```
$ git status --porcelain=v1        (no output, after all probes and both verify runs)
$ git rev-parse HEAD               ebb1e41bc115e281255c72b3b7242ebc8096cc4d
$ git rev-parse HEAD^{tree}        79475730e53bc834ce98731a86f195316b43cf9f
```

See §1.5 for the one stray untracked file I created and removed.

---

## 7. Criterion-by-criterion matrix

| #   | Criterion (queue row §18 / handoff)                                                        | R1                    | R2       | Evidence                                                                         |
| --- | ------------------------------------------------------------------------------------------ | --------------------- | -------- | -------------------------------------------------------------------------------- |
| 1   | Candidate changes only the bounded files listed in the handoff                             | PASS                  | **PASS** | §4.4 — 16 files, list matches exactly, no prior artifact modified                |
| 2   | `pnpm evidence:status && pnpm verify` passes from a clean checkout                         | PASS (host-qualified) | **PASS** | §6.2 — exit 0 twice; the I4 locale caveat is now gone (§3.5); M7 horizon remains |
| 3   | 23 claims promoted exactly as R4 approved                                                  | PASS                  | **PASS** | §4.1 — claims tree byte-identical to the failed candidate                        |
| 4   | 68 cited sources have faithful production metadata                                         | PASS                  | **PASS** | §4.1 — sources tree byte-identical                                               |
| 5   | Sources have valid current status                                                          | PASS                  | **PASS** | §4.2 — 68/68 `current`; `evidence:status` exit 0                                 |
| 6   | One muscle and two exercise records validate                                               | PASS                  | **PASS** | §4.1, §6.2 — trees identical, 95 records validated                               |
| 7   | Deterministic 94-node/120-edge graph with no missing references                            | **PARTIAL**           | **PASS** | §3.5 — 14/14 compilations byte-identical, 0 `localeCompare` calls                |
| 8   | Graph fails closed on reference and manifest defects                                       | **PARTIAL**           | **PASS** | §3.3, §3.4 — required reviews verified; superseded manifests rejected            |
| 9   | Approval-manifest rules: exact checksum coverage                                           | **FAIL**              | **PASS** | §3.1 — content drift blocked; 22/22 fields covered                               |
| 10  | No claim renders publicly without approved state, owner approval, manifest ID and checksum | **FAIL**              | **PASS** | §3.2 — `preview` removed; both routes exit 1; no HTML emitted                    |
| 11  | Mixed/qualified evidence is disclosed with source roles and locators                       | PASS                  | **PASS** | §3.2 — re-verified through the modified component                                |
| 12  | No unconstrained factual MDX or raw HTML passes the lint                                   | **FAIL**              | **PASS** | §3.6 — 21/21 unsafe shapes blocked, 4/4 controls clean                           |
| 13  | Certainty-lint exceptions are narrowly bounded                                             | **FAIL**              | **FAIL** | **I5-R2** — §3.7, clause-scope laundering, 6 fresh overclaims pass               |
| 14  | No owner approval or publication eligibility inferred from R4                              | PASS                  | **PASS** | §4.2 — 26/26 unpublished, three fields null                                      |
| 15  | No SBLA-012+ surface pre-empted                                                            | PASS                  | **PASS** | manifests and changes still empty; one shell page; no new route                  |
| 16  | Role boundary and immutability respected by this review                                    | PASS                  | **PASS** | §1.5, §4.3, §6.3                                                                 |

Thirteen of the sixteen criteria that R1 could not fully pass are now passing. Criterion 13 is the
sole remaining failure.

---

## 8. What this remediation got right

Recorded deliberately, because a FAIL verdict should not obscure it and because none of this should
be redone:

- **C1's fix is the right shape.** Normalizing only the self-referential field, rather than
  excluding a hand-listed set, is why the digest covers 22/22 fields including source-link order.
- **I4 was solved by removing the dependency, not configuring it.** Zero `localeCompare` calls is a
  stronger guarantee than any pinned locale, and it dissolved M8 as a side effect.
- **I2 exceeded its brief** with exact-casing resolution and a regular-file requirement, closing
  case-insensitive-filesystem and symlink substitutions that R1 never asked about.
- **The regression tests are substantive**, not vacuous: the C1 test asserts no checksum issues on
  the correct fixture _before_ mutating and asserting both codes, so it would fail if the gate
  simply rejected everything.
- **The handoff is honest.** Every count I re-ran matched it; it discloses the zero-file MDX scan,
  states plainly that M1–M9 were not fixed, and does not claim the slice is publishable. Its one
  overstatement is the scope of the I5 exceptions (§5.2).

---

## 9. Bounded remediation guidance, and one governance question

### 9.1 The fix

One finding, one file, no promoted record or graph data affected:

**I5-R2** — make each exception test the **matched quantifier**, not its clause. Concretely: compute
the exception window from `match.index` rather than from the clause, or require the scoping evidence
to be adjacent to the matched token (for example, the sample reference must precede _this_ `every`
with no intervening coordinating conjunction), so that a comma-joined rider cannot inherit it.
Deleting the eight branches that serve no promoted claim (**N1**) removes three of the exploited
surfaces outright and should come first — it may be most of the fix.

Regression fixtures should include the three minimal triples in §3.7 together with their `.` and `;`
controls, the six fresh statements in the table there, and a re-run of all 23 promoted claims to
confirm no false rejection appears. Test that the rider is rejected **in** the joined sentence, not
merely that some issue is raised somewhere.

The five Minors in §5.3 and the eight open R1 Minors in §5.4 are **not** part of this and must not
expand it.

### 9.2 The governance question — for the owner, not for a reviewer

CLAUDE.md, AGENTS.md and `operating-policy.json`
(`failedReviewAction: "bounded-remediation-then-full-artifact-recheck"`) allow **one** bounded
remediation followed by **one** complete-artifact recheck. That budget is now spent: R1 → bounded
remediation → this recheck. The policy does not describe what follows a failed recheck, and the
remediation handoff states that no further review layer is permitted absent new material risk.

I am not authorized to grant myself another round, and I am not treating this finding as a "new
material risk" that reopens the scope — it is the unclosed remainder of R1's own I5, which is
precisely what this recheck existed to test. The decision belongs to the owner. The options I can
see, stated neutrally:

1. **Owner-approved second remediation and recheck** for criterion 13 alone, on the model of the
   existing `reviews/releases/SBLA-007-owner-override.md` precedent.
2. **Owner override accepting the residual as a recorded Minor**, on the grounds that nothing is
   published, all 23 promoted statements pass, and the gate is materially stronger than at R1. This
   would need the impact and follow-up destination recorded, per the nonblocking-Minor rule.
3. **Defer criterion 13 to SBLA-012** with the certainty lint explicitly out of SBLA-011's accepted
   scope.

I have no view on which is right, and recording the choice is Codex's and the owner's to make. What
I can state is the finding and its evidence, which is what §5.2 and §3.7 do.

---

## 10. Reviewer limitations

- **No network access.** No DOI, PMID, PMCID or URL was re-resolved, and no primary source was
  re-read. Source identity and status currency are audited as record-internal consistency only.
- **Scientific entailment was not re-litigated.** That is SBLA-010's accepted scope, closed by
  `reviews/evidence/SBLA-009-r4.md` (PASS). Because the claim and source trees are byte-identical to
  the failed candidate (§4.1), R1's byte-exactness proofs carry forward; I re-derived the tree
  identity rather than re-running R1's 680-field comparison.
- **Locale divergence was proved by removing the dependency, not by booting another host.** I
  instrumented `String.prototype.localeCompare` and counted zero calls during compilation, which is
  a stronger result than a single alternate-locale run, but I did not build on a Lithuanian-locale
  machine.
- **`pnpm test:e2e`, `test:a11y`, `test:visual` and `test:performance` were not run.** The SBLA-011
  queue row does not require them and no rendered scientific page exists to exercise. My Astro
  builds were targeted probe routes, not the a11y or visual matrices.
- **Probe coverage is finite.** 22 certainty statements, 28 MDX shapes, 8 manifest scenarios, 22
  checksum field mutations and 14 graph compilations. A clean result means those specific
  manipulations behave correctly, not that the mechanism is exhaustively proven. The I5-R2 finding
  in particular was found only because I wrote statements aimed at the _new_ logic; I cannot
  guarantee no further class exists in the gates I passed.
- **The `preview` attribute is rejected by the MDX lint and ignored by the components, but the
  components' `Props` interfaces are TypeScript-only.** MDX is not type-checked, so the lint is the
  operative guard there; since eligibility is now unconditional, a stray attribute is inert either
  way.
- **The authoritative role-path boundary result is not mine to produce.** Per CLAUDE.md, it must come
  from Codex or CI running `scripts/foundation/check-role-paths.mjs` from a trusted checkout against
  this worktree with `--repository` and `--allowed-path reviews/releases/SBLA-011-r2.md`. The Git
  evidence in §1.5, §4.3 and §6.3 is what I can establish from inside my own branch, and it should
  not be treated as a substitute for that trusted run.

---

## 11. Verdict

**FAIL — 0 Critical, 1 Important, 5 new Minor (nonblocking).**

Six of the seven blocking findings are closed, and I could not defeat any of them: the approval
manifest now binds real content across every field (**C1**), the public render path has no bypass
left (**I1**), required review reports are resolved with exact casing and hashed from disk
(**I2**), retired manifests are rejected while current ones still pass (**I3**), the graph bundle
cannot depend on a host locale because the compiler no longer consults one (**I4**), and the MDX
lint blocks raw HTML, free expressions, unsupported components and `preview` at every nesting depth
I could construct (**I6**). The 23 claims, 68 sources and 3 page records are byte-identical to the
failed candidate, the graph bundle is byte-identical, all 26 records remain fail-closed on
publication, no prior evidence or review artifact was altered, and `pnpm evidence:status && pnpm
verify` passes twice with every count matching the handoff. That work is accepted on its merits and
should not be redone.

Acceptance is blocked on one finding. The certainty lint's replacement exceptions are bounded by
clause rather than by quantifier, so a sentence that states a properly scoped result and then
over-generalizes in the same breath — the most natural way an evidence draft over-claims — passes
clean: "In 20 participants, every participant gained size, and every lifter everywhere benefits."
Rejected alone, accepted when comma-joined. That is the acceptance criterion this milestone widened
the gate to satisfy, and it is not yet satisfied.

The single bounded-remediation budget in the stop rule is spent, so how to proceed is an owner
decision (§9.2), not a reviewer's to grant.

---

_This report is immutable and append-only. It reviews commit
`ebb1e41bc115e281255c72b3b7242ebc8096cc4d`, tree `79475730e53bc834ce98731a86f195316b43cf9f`._
