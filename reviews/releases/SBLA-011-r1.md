# Release review: SBLA-011 production evidence vertical slice, round 1

**Task:** SBLA-011 — independent acceptance review of the Codex builder candidate that promotes the
R4-approved one-muscle/two-exercise evidence slice into production records, compiles a deterministic
static evidence graph, adds fail-closed MDX claim components and an AST prose lint, and keeps
`pnpm evidence:status && pnpm verify` green (master plan §18 queue row SBLA-011; §14 Phase 1).
**Reviewer role:** Claude Review (Account B), independent adversarial release audit.
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5). I did not author,
advise on, or remediate any SBLA-011 artifact. I received no authoring-role reasoning beyond the
committed artifacts, the committed handoff, and the coordination ledger.
**Review dates:** 2026-09-15 to 2026-09-16.
**Reviewer worktree:** `C:\src\s011review-r1`
**Reviewer branch:** `claude-review/SBLA-011-r1`
**Reviewer write path:** `reviews/releases/SBLA-011-r1.md` — sole permitted path. No other file was
created, edited, staged, or committed inside the repository. No artifact under review was repaired,
reformatted, or staged (AGENTS.md role table; CLAUDE.md "Never repairs the artifact under review";
`operating-policy.json` `writeBoundaries["claude-review"] = ["reviews/"]`). Every adversarial probe
ran in a scratch working copy held outside the repository.

**Reviewed candidate commit:** `478411a7aa11da717d7a3de29fe7ad93d0d3604a` _(immutable)_
**Reviewed candidate tree:** `c527f9d26de03890d9ad2d8ebca61c968ff76f0d` _(immutable)_
**Accepted base commit:** `6e5948f6423d0e603ef4838c3393398c47c27c9b`, tree
`96a3e9ba2db40a18a84e1ffdf626b56b0e3d7349`
**Implementation commit:** `8df97fcbb93cd14e6b05927acb2e2f253816c8a2`, tree
`7f0da387beb4f0354c4c1d76c0597cd10e85cdbf`
**Governing handoff:** `reviews/releases/SBLA-011-handoff.md` (221 lines)
**Governing evidence acceptance:** `reviews/evidence/SBLA-009-r4.md` — PASS, 0 Critical, 0 Important
**Committed graph bundle:** `public/data/evidence-graph.v1.json`, SHA-256
`4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`
**Runtime used:** Node.js `v24.20.0`, pnpm `11.24.0` (pinned exactly per AGENTS.md "Runtime")

---

## 0. Verdict

**FAIL — 1 Critical, 6 Important, 9 Minor (nonblocking).**

The acceptance rule in CLAUDE.md, AGENTS.md and `operating-policy.json`
(`passRequiresZeroCritical`, `passRequiresZeroImportant`) is **not** satisfied: this candidate carries
one unresolved Critical and six unresolved Important findings.

**What this candidate gets right, and it is a great deal.** The evidence-promotion half of SBLA-011
is excellent and I could not falsify it. All 23 R4-approved atomic claims are promoted
**byte-exactly** — a canonical deep comparison across the eight scientific fields (`id`, `type`,
`statement`, `plainLanguage`, `scope`, `qualifiers`, `evidence`, `sourceLinks`) over all 23 claims
returns **zero differences and zero source-link order differences** (§3.1). All 68 cited source
records are **byte-faithful** to the approved extraction across **680 compared schema-bearing
fields, zero mismatches**, including every `publication` status block (§3.3). The 94-node/120-edge
graph is independently re-derived from the records by my own arithmetic, not taken on trust (§4.1).
Every one of the 26 promoted claim and page records is fail-closed on publication: **26/26** are
`publicationState: unpublished` with `ownerApprovedAt: null`, `approvalManifestId: null`, and
`contentChecksum: null` (§3.4). No owner approval or publication eligibility was inferred from the
R4 evidence review. No prior research or review artifact was modified. `pnpm evidence:status &&
pnpm verify` passes from this clean worktree on the pinned runtime, twice (§7.2).

**Why it nevertheless fails.** SBLA-011's other half is the set of _mechanisms_ that are supposed to
make publication fail-closed in future milestones, and I was able to defeat several of them from
outside. The decisive one is Critical finding **C1**: a record's `contentChecksum` is never derived
from, or compared against, that record's actual content. `validation.ts:480` compares the manifest
entry's checksum string to the record's own self-declared `contentChecksum` string — two
author-supplied values — so they agree by construction. I published a claim, bound it to an approved,
deployment-eligible manifest, then **silently rewrote its `statement` and `plainLanguage`**, and the
full gate chain (`validate:content`, `validate:graph`, `evidence:status`) returned **exit 0 on every
step** (§5.1). That is the exact scenario master plan §10.6 says must be impossible: "An approval
applies only to the exact checksums and source commit listed in the manifest; changing any included
entity/page invalidates eligibility and requires a new manifest." The handoff lists "exact checksum
coverage" and "exact manifest-checksum graph validation" as delivered work (items 3 and 4); the
coverage is present in form but vacuous in substance.

**The Critical is not currently exploited.** Nothing in this candidate is published — all 26 records
are `unpublished` with null owner approval — so no reader-facing claim is mis-bound today. The
defect is in the mechanism that the next milestones will rely on, which is precisely what an
acceptance review of a mechanism-building task exists to catch.

The six Important findings are: an unguarded `preview` prop that renders ineligible claims onto a
public static route (**I1**, reproduced end-to-end with emitted HTML); manifest `requiredReviews`
entries that are never resolved or verified (**I2**); published records permitted to bind to a
_superseded_ rather than the _current_ manifest (**I3**); locale-dependent graph ordering that makes
the byte-compared artifact non-deterministic across hosts (**I4**); certainty-lint exceptions added
by this milestone that admit generic universal and causal overclaims (**I5**, 12 of 17 adversarial
statements pass); and an MDX AST lint that does not descend into `Editorial`, `Claim`, or
`ClaimGroup` subtrees, so raw HTML and free MDX expressions pass inside an `<Editorial>` wrapper
(**I6**). Findings I1, I5 and I6 are three of the surfaces the handoff itself asked me to probe
("Required reviewer action" items 4, 5, 6); all three are defeatable as delivered.

Nine Minor findings are recorded in §6.3 with impact and follow-up destination, per the nonblocking
rule. They do not contribute to this verdict.

A single bounded remediation is sufficient. All seven blocking findings live in five files
(`src/lib/content/validation.ts`, `src/lib/graph/compiler.ts`, `src/lib/content/mdx-lint.ts`,
`src/components/evidence/Claim.astro`, `src/components/evidence/ClaimGroup.astro`) and none requires
touching a promoted claim, a source record, or the graph data beyond recompiling it. §9 sets out the
bounded plan.

---

## 1. Provenance verification — performed before reading anything under review

### 1.1 HEAD, tree, branch, cleanliness

```
$ git rev-parse HEAD
478411a7aa11da717d7a3de29fe7ad93d0d3604a
$ git rev-parse HEAD^{tree}
c527f9d26de03890d9ad2d8ebca61c968ff76f0d
$ git rev-parse --abbrev-ref HEAD
claude-review/SBLA-011-r1
$ git status --porcelain=v1
(no output)
```

The candidate commit and tree match the coordination ledger and the handoff exactly.

### 1.2 Ancestry and the accepted base

```
$ git log --format='%H %T %ad %s' --date=iso -3
478411a7aa11da717d7a3de29fe7ad93d0d3604a c527f9d26de03890d9ad2d8ebca61c968ff76f0d 2026-09-15 19:45:32 -0400 docs: hand off SBLA-011 production slice
8df97fcbb93cd14e6b05927acb2e2f253816c8a2 7f0da387beb4f0354c4c1d76c0597cd10e85cdbf 2026-09-15 19:44:11 -0400 feat: build approved evidence vertical slice
6e5948f6423d0e603ef4838c3393398c47c27c9b 96a3e9ba2db40a18a84e1ffdf626b56b0e3d7349 2026-09-15 18:50:16 -0400 review: audit SBLA-009 evidence pass R4 — PASS
```

The candidate is the direct child of the implementation commit, which is the direct child of the
accepted SBLA-010/R4 base named in the handoff. Every commit and tree hash the handoff asserts is
correct. The candidate is the later commit that adds the handoff, exactly as the handoff states.

### 1.3 Remote parity and release state

```
$ git rev-parse origin/codex/SBLA-011-production-slice
478411a7aa11da717d7a3de29fe7ad93d0d3604a
$ git rev-parse origin/main
6e5948f6423d0e603ef4838c3393398c47c27c9b
$ git branch -r --contains 478411a7aa11da717d7a3de29fe7ad93d0d3604a
  origin/codex/SBLA-011-production-slice
```

The candidate is pushed and is reachable only from its own builder branch. `origin/main` and local
`main` both remain at the accepted base `6e5948f`. The candidate has **not** been merged to `main`,
which is correct: the handoff forbids merging before a PASS, and this review does not return one.

### 1.4 The exact one-path review claim, verified before writing

The ledger claim is kept on the coordination branch, as CLAUDE.md prescribes, not on the candidate.
`docs/runbooks/current-work.md` at `478411a` contains no SBLA-011 row; the claim is at line 35 of
that file on `codex/SBLA-007-review-coordination`, identical on the local and remote ref:

```
| SBLA-011 implementation review R1 | Claude Review (account B) | `claude-review/SBLA-011-r1` |
  `C:\src\s011review-r1` | `478411a7aa11da717d7a3de29fe7ad93d0d3604a` | 2026-09-15 19:45 EDT |
  `reviews/releases/SBLA-011-r1.md` | `reviews/releases/SBLA-011-r1.md` |
```

Branch, worktree, base commit, and the single writable path all match this session. I verified the
committed claim existed before writing my permitted output, and I did not edit the ledger.

### 1.5 Whitespace and role-path boundary

```
$ git diff --check 6e5948f6423d0e603ef4838c3393398c47c27c9b..HEAD
(no output)
```

No whitespace errors in the entire accepted-base diff. After all probes in §5, `git status
--porcelain=v1` remains empty and `git rev-parse HEAD` is unchanged (§7.3).

---

## 2. Methods, and the limits of this review

I worked only from committed artifacts. I read `AGENTS.md`, `CLAUDE.md`, the SBLA-011 handoff, master
plan §§10.6–10.8, 11.2–11.6, 12, 13.3, and the §18 SBLA-011 queue row before acting, and
`reviews/evidence/SBLA-009-r4.md` to establish what "R4-approved" means.

**Runtime.** The repository pins Node `24.20.0` and pnpm `11.24.0`. The host default was Node
`v24.14.0` and pnpm `11.19.0`, which do not satisfy `engines`. I activated the pinned pair through
the machine's `fnm` install (`$APPDATA\fnm\node-versions\v24.20.0\installation`, whose corepack shim
resolves pnpm `11.24.0`) and used it for every command in this report.

**Independence of probes.** I did not modify the candidate to test it. I made a scratch copy of the
worktree outside the repository (`…/jobs/c95f2b44/tmp/scratch`, `node_modules` supplied by a
junction), and every adversarial mutation — manifests, published records, `.astro` probe routes,
graph tampering — happened only there. Probe harnesses that call the candidate's own exported
functions (`lintMdxClaims`, `lintClaimLanguage`, `compileEvidenceGraph`, `recordChecksum`) import
them from the repository read-only and themselves live outside it.

**What I could not do.** I have no network access, so I did not re-resolve a single DOI, PMID, or URL
against a live registry, and I did not re-read a primary source. Source _identity_ and _status
currency_ are audited here as record-internal consistency and as faithfulness to the R4-approved
extraction, not as live-registry truth; live acquisition is explicitly a later operations task. I
also did not re-audit the _scientific entailment_ of the 23 claims against their sources — that is
SBLA-010's accepted scope, closed by R4 — and I confine myself to proving that what was promoted is
exactly what R4 approved. I did not run `pnpm test:e2e`, `test:a11y`, `test:visual`, or
`test:performance`; SBLA-011's queue row does not require them and there is no rendered scientific
page for them to exercise.

---

## 3. The promotion is exact — four independent proofs

### 3.1 All 23 claims match the R4-approved values byte-for-byte

I compared each production record in `content/claims/` against its entry in the approved
`content-drafts/syntheses/SBLA-009-atomic-claims.json`, using a canonical comparison that sorts
object keys (production records are key-sorted for deterministic formatting) but **preserves array
order**, so a reordered source-link list would still be caught.

```
draft claim count: 23 | production claim file count: 23 | production claim id count: 23
ID SET IDENTICAL: true   missing from production: []   extra in production: []
scientific-field diffs (id/type/statement/plainLanguage/scope/qualifiers/evidence/sourceLinks): 0
source-link ORDER diffs: 0
total source links: 92   distinct cited sources: 68
roles:            {"supports":51,"qualifies":26,"contradicts":11,"neutral-context":4}
supportStrengths: {"direct":45,"partially-direct":32,"indirect":15}
claim types:      {"anatomy":6,"exercise-mechanics":6,"function":3,"longitudinal-adaptation":3,"acute-response":3,"safety-context":2}
certainty:        {"low":11,"moderate":7,"established-descriptive-fact":2,"very-low":2,"high":1}
```

Every one of the 23 filenames equals `<id>.json`. Not one statement, plain-language rendering,
scope, qualifier, certainty grade, applicability, direction, magnitude, source ID, locator, role, or
support-strength value differs from the R4-approved artifact. **No new scientific conclusion was
introduced.**

The research-only fields are correctly dropped rather than leaked: no production claim contains
`recordIds` or `rederivation`, matching the handoff's stated projection rule.

Per-claim, all 23 compared EXACT. The set includes the highest-risk records — the 12-link
`claim-bench-press-inclination-shifts-regional-activation` that carried R3's single blocking finding,
and the 8-link mixed-evidence `claim-press-versus-fly-activation-mixed` at `very-low` certainty.

### 3.2 The 68 promoted sources are exactly the cited set

```
source files: 68   cited source ids (distinct, across all 92 links): 68
cited but no file : (none)
file but not cited: (none)   -> sets identical
```

There is no orphan source record and no dangling citation. The approved extraction contains 89
entries; the 21 not promoted are exactly those no approved claim cites (89 − 21 = 68), which is the
correct conservative behaviour.

### 3.3 Source metadata is faithful to the approved extraction

Comparing every production source against its `sourceSchemaFields` entry in
`research/extractions/SBLA-009-source-extractions.json`:

```
schema-bearing fields compared (type/title/authors/year/identifiers/urls/access/quality/funding/conflicts): 680
mismatches: 0
publication blocks compared: 68   mismatches: 0
production fields NOT supplied by the extraction (Codex projections): id, projectSummary, study
```

The `publication` block — status, `statusMethod`, `statusSource`, `statusCheckedAt`,
`nextStatusCheckAt` — comes from the approved research artifact, not from anything Codex invented.

I spot-checked the three Codex-projected fields on `source-pmid-23444001`,
`source-handle-1793-62857` and `source-bookshelf-nbk525991`. In each case `study.population` is the
verbatim first `reportedFacts[].fact` string, `study.comparator` is the extraction's `contrastType`,
`study.outcomes` are the extraction's question IDs, and `projectSummary` restates the extraction's
`researchRoleInference`/`designNote`. These are projections, not interpretation — the handoff's
description is accurate.

Record-level source posture:

```
publication status : {"current":68}                 sources missing statusMethod/statusSource: 0
access levels      : {"abstract-only":37,"full-text-open":31}
source types       : {"observational-study":44,"anatomy-reference":15,"randomized-trial":4,
                      "meta-analysis":2,"book-textbook":2,"systematic-review":1}
risk of bias       : {"some-concerns":36,"not-applicable":17,"high":10,"not-assessed":5}
applicability      : {"partially-direct":46,"indirect":12,"direct":10}
statusCheckedAt    : 2026-09-13 -> 2026-09-15    nextStatusCheckAt: 2026-10-13 -> 2026-10-15
sources with no DOI/PMID/PMCID/ISBN: source-handle-1793-62857 (stable primary repository URL)
```

The single identifier-free source is the handle-identified thesis the handoff names, and the schema
change that admits it (`sourceSchema.superRefine`, `schemas.ts:558–570`) is correctly narrow: it
accepts a stable `urls.primary` **only** when all four of DOI, PMID, PMCID and ISBN are null, and it
still enforces canonical `https://doi.org/<doi>` whenever a DOI is present.

### 3.4 Publication remains fail-closed across every promoted record

```
lifecycle invariants across 23 claims + 1 muscle + 2 exercises = 26 records
  publicationState !== 'unpublished' : 0
  review.ownerApprovedAt !== null    : 0
  approvalManifestId !== null        : 0
  contentChecksum !== null           : 0
  violations: 0 / 26
```

`reviewState: approved` is set, which R4 permits; publication state, owner identity, timestamp,
manifest and checksum are all correctly withheld. The constraint "no owner approval or publication
eligibility is inferred from the R4 evidence review" is met.

The one muscle and two exercise records are structurally sound: factual sections are claim-ID lists
only; `projectDefinition.editorial` is the literal `true` on both exercises, so the project's own
scope statements are schema-marked editorial rather than presented as external fact; and
`equipmentIds`/`movementPatternIds` are empty because those entity types belong to later queue
tasks rather than being invented here.

---

## 4. The graph is complete and correctly fail-closed — but not deterministic across hosts

### 4.1 94 nodes and 120 edges, independently re-derived

I did not accept the committed counts. I recomputed them from the records:

```
nodes = 23 claims + 68 sources + 1 muscle + 2 exercises                 = 94   ✓
edges = 92 claim->source links + 28 page->claim 'contains-claim' edges  = 120  ✓
        contains-claim per page: pectoralis-major 11 + bench 11 + fly 6 = 28
claims referenced by NO page          : 0
page claim IDs with no claim record   : 0
relatedEntityIds resolution           : 4/4 resolve
```

A fresh in-memory compile is byte-identical to the committed bundle on this host, and the committed
file's digest matches the handoff exactly:

```
fresh compile === committed bytes: true
committed SHA-256: 4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446
```

`compileEvidenceGraph` runs `validateRecordGraph` first and throws `GraphCompilationError` before
emitting anything, so the compiler cannot produce a bundle from an invalid record set. The
`sourceStatusSnapshot` is derived from record dates rather than wall-clock time, so the _content_ of
the bundle is time-independent, as the handoff claims.

### 4.2 The graph gate fails closed on tampering and on broken references

Run in the scratch copy, with real exit codes:

| Probe                                    | Command                           | Result                                    |
| ---------------------------------------- | --------------------------------- | ----------------------------------------- |
| One byte changed in the committed bundle | `node scripts/graph/validate.mjs` | `[GRAPH_OUTPUT_STALE]` **exit 1**         |
| Committed bundle deleted                 | `node scripts/graph/validate.mjs` | `[GRAPH_OUTPUT_STALE]` **exit 1**         |
| Claim cites a non-existent source        | `node scripts/graph/validate.mjs` | `[REFERENCE_MISSING]` **exit 1**          |
| Baseline restored                        | `node scripts/graph/validate.mjs` | `94 nodes and 120 edges match` **exit 0** |

Graph staleness and missing references are genuinely fail-closed.

One note for §6.3: with the dangling source reference in place, `node scripts/content/validate.mjs`
still reported `Content validation passed: 95 records` and **exit 0**. That is a deliberate division
of labour — `validate:content` is per-record schema validation, `validate:graph` owns cross-record
referential integrity — and both are in the pinned `verify` chain, so the composite gate holds. It is
recorded as Minor M6 only because the command name invites over-reading.

---

## 5. Adversarial probes that succeeded — the blocking findings

All probes below ran in the scratch copy outside the repository. The candidate was never modified.

### 5.1 C1 — the approval manifest binds nothing (Critical)

`contentChecksum` is declared (`schemas.ts:169`), required non-null when published
(`schemas.ts:232`), and compared at `validation.ts:480`:

```ts
const entry = manifest[entryType].find(
  (candidate) => candidate.id === record.id,
);
if (!entry || entry.checksum !== record.contentChecksum) {
  /* APPROVAL_CHECKSUM_MISMATCH */
}
```

Both sides are author-supplied strings. A full trace confirms nothing ever computes a digest of a
record and compares it to that record's `contentChecksum`:

```
$ git grep -n "contentChecksum\|recordChecksum" -- src scripts tests
scripts/content/promote-sbla-009.mjs:99:  contentChecksum: null,
src/components/evidence/Claim.astro:21:  claim.contentChecksum !== null;       <- non-null check only
src/lib/content/schemas.ts:169 / 195 / 232                                     <- declaration + non-null
src/lib/content/validation.ts:480:  entry.checksum !== record.contentChecksum  <- string vs string
src/lib/graph/compiler.ts:65:  export function recordChecksum(value)           <- the only digest fn…
src/lib/graph/compiler.ts:101 / 108 / 116 / 124 / 130                          <- …used ONLY for graph node fields
tests/fixtures/evidence-schemas/records.valid.json:51:  "contentChecksum": "aaaa…"  <- fixture uses a constant
```

`recordChecksum()` exists and is correct, but it is used exclusively to stamp the informational
`recordChecksum` field on graph nodes. It never guards publication.

**The demonstration.** I took the real `claim-pectoralis-major-portions`, set it `published` /
`approved` / owner-approved with a future review date, gave it `contentChecksum: "aaaa…a"` (64 hex),
and wrote an approved, deployment-eligible manifest listing that same `"aaaa…a"`. That is the
`approved-baseline` row. I then **rewrote the claim's `statement` and `plainLanguage`** — leaving the
checksum and the manifest untouched — recompiled the graph as an integrator would, and re-ran the
gate chain. Neutral replacement wording was chosen deliberately so that no _other_ lint could fire
and mask the result:

| Scenario                                            | `validate:content` | `validate:graph` | `evidence:status` | Outcome                           |
| --------------------------------------------------- | ------------------ | ---------------- | ----------------- | --------------------------------- |
| `approved-baseline` (approved text)                 | 0                  | 0                | 0                 | **gate passes** (expected)        |
| `content-drift` (**text rewritten after approval**) | 0                  | 0                | 0                 | **GATE PASSES — no issue raised** |
| `review-report-bogus` (fabricated required review)  | 0                  | 0                | 0                 | **GATE PASSES** (finding I2)      |
| `superseded-binding` (bound to superseded manifest) | 0                  | 0                | 0                 | **GATE PASSES** (finding I3)      |

The claim's owner-approved text was replaced and every gate stayed green. Master plan §10.6 requires
the opposite: "changing any included entity/page invalidates eligibility and requires a new
manifest." §10.8 requires the build to fail when a live page contains a claim "whose checksum is
absent from the applicable approved manifest" — a condition that cannot be meaningfully evaluated
when the checksum is unrelated to the content.

For completeness, the checksum comparison _does_ catch the case where the two strings simply differ,
and the surrounding manifest rules do work (§5.2). The defect is that agreement is trivially arranged
and carries no information about the content.

**Mitigation, stated plainly:** no record in this candidate is published, so nothing is mis-bound
today. This blocks acceptance as a mechanism defect, not as a live mis-publication.

### 5.2 Manifest rules that do work — probed and confirmed

Before reporting what fails, I confirmed what holds. Each row is a real manifest written to
`content/approval-manifests/` in the scratch copy against a genuinely published claim:

| Probe                                             | Blocking code                                 | Result  |
| ------------------------------------------------- | --------------------------------------------- | ------- |
| Published claim, zero manifests on disk           | `APPROVAL_MANIFEST_MISSING`                   | blocked |
| Manifest checksum differs from record             | `APPROVAL_CHECKSUM_MISMATCH`                  | blocked |
| Manifest lists a different entity ID              | `APPROVAL_CHECKSUM_MISMATCH`                  | blocked |
| `decision: rejected`                              | `APPROVAL_MANIFEST_INELIGIBLE`                | blocked |
| `deploymentEligible: false`                       | `APPROVAL_MANIFEST_INELIGIBLE`                | blocked |
| Two current manifests in one scope                | `MANIFEST_CURRENT_DUPLICATE`                  | blocked |
| 2-cycle A→B→A                                     | `MANIFEST_SUPERSESSION_CYCLE`                 | blocked |
| 3-cycle A→B→C→A                                   | `MANIFEST_SUPERSESSION_CYCLE`                 | blocked |
| Supersedes a manifest that does not exist         | `MANIFEST_SUPERSESSION_MISSING`               | blocked |
| Self-supersession                                 | `SCHEMA_INVALID` (schema `superRefine`)       | blocked |
| `decision: rejected` + `deploymentEligible: true` | `SCHEMA_INVALID`                              | blocked |
| Cited source set to `retracted`                   | `SOURCE_RETRACTED` (`evidence:status` exit 1) | blocked |
| Cited source `nextStatusCheckAt` in the past      | `SOURCE_STATUS_OVERDUE` (exit 1)              | blocked |

Duplicate-current detection, cycle detection at depth 2 and 3, dangling supersession, manifest
ineligibility, retraction and freshness all behave correctly. This is solid work.

### 5.3 I2 — manifest `requiredReviews` are never verified (Important)

`approvalManifestSchema` requires at least one `requiredReviews` entry with `id`, `path` and
`checksum` (`schemas.ts:409–420`), but nothing resolves the path, checks that the file exists, or
compares the checksum. My `review-report-bogus` manifest cited
`reviews/releases/NEVER-EXISTED.md` with checksum `eeee…e` and the whole chain returned exit 0
(table in §5.1).

Master plan §10.6 is explicit: "The graph compiler joins every live page/claim to exactly one
current, owner-approved manifest, **verifies all checksums and required review reports**, and fails
on missing manifests, duplicate-current manifests, checksum drift, an unapproved decision, or a
supersession chain that does not terminate cleanly." Five of those six obligations are implemented;
required-review verification is not.

### 5.4 I3 — a published record may bind to a superseded manifest (Important)

`validatePublishedManifestCoverage` (`validation.ts:447–491`) looks the manifest up by ID and checks
`decision`, `deploymentEligible` and the checksum. It never asks whether that manifest is still
_current_. In `superseded-binding` I wrote manifest A (approved, deployment-eligible, covering the
published claim) and manifest B superseding A; the claim stayed bound to the retired A and the chain
returned exit 0.

§10.6 requires the compiler to join every live page/claim "to exactly one **current**, owner-approved
manifest." The `supersededIds` set already computed in `validateManifestChain` (`validation.ts:385`)
makes this a small fix.

### 5.5 I1 — the `preview` prop renders ineligible claims onto a public route (Important)

`Claim.astro:16–27` computes the correct five-part eligibility test and then gates it on a prop:

```ts
const eligible =
  claim.reviewState === 'approved' &&
  claim.publicationState === 'published' &&
  claim.review.ownerApprovedAt !== null &&
  claim.approvalManifestId !== null &&
  claim.contentChecksum !== null;
if (!preview && !eligible)
  throw new Error(`Claim ${id} is not eligible for public rendering; …`);
```

Nothing in the repository distinguishes a public surface from a "non-public review surface" — there
is no such route, guard, test, or documented concept; `preview` appears nowhere outside these two
components. `ClaimGroup.astro:31,35` forwards `preview` to every child. And the AST lint that is
supposed to constrain authoring **explicitly permits it**: for a `Claim` flow element the lint checks
only that an `id` attribute exists (`mdx-lint.ts:99–108`), so `<Claim id="…" preview />` and
`<ClaimGroup ids={[…]} preview />` both pass with zero issues.

I reproduced this end-to-end by building two identical public routes in the scratch copy, differing
only in the prop, against a claim that is `unpublished` with `ownerApprovedAt: null`,
`approvalManifestId: null` and `contentChecksum: null`:

```
P1  <Claim id="claim-bench-press-pectoralis-activation" />
    [ERROR] Claim claim-bench-press-pectoralis-activation is not eligible for public rendering…
    BUILD EXIT=1                                              <- gate holds

P2  <Claim id="claim-bench-press-pectoralis-activation" preview />
    [build] 1 page(s) built …  BUILD EXIT=0                   <- gate bypassed
```

`dist/probe/index.html` was emitted, publishing the unapproved claim — and it carries its own
disclosure of the violation in the markup:

```html
<article
  class="evidence-claim"
  data-claim-id="claim-bench-press-pectoralis-activation"
  data-review-state="approved"
  data-publication-state="unpublished"
>
  <p>
    The chest muscle works during a barbell bench press, both its upper and
    lower parts.
  </p>
  <p class="evidence-claim__mixed">Evidence is mixed or qualified.</p>
</article>
```

This contradicts the acceptance criterion "No claim can render publicly without approved
review/publication state, non-null owner approval, manifest ID, and checksum," and handoff work item
6 ("Public rendering rejects missing, unpublished, unapproved, owner-unapproved, or manifest-unbound
claims"). The word doing the work is "public," and nothing defines or enforces it.

**What this same probe proves is working.** The mixed-evidence disclosure required by §10.6 is
correct and complete: "Evidence is mixed or qualified." is rendered because the claim carries
`qualifies` links, and all four sources are listed with `data-source-role` and exact locators —
supporting, qualifying and contradictory roles side by side, not left in private research notes.
Hidden machine-readable claim IDs (`data-claim-id`) are present as §10.7 requires. `Claim.astro:57`
throws on a missing source, and `ClaimGroup.astro:13–27` rejects empty/duplicate ID lists, unknown
IDs, and a `framing` value that is not itself an audited claim ID — that last check is stricter than
§10.7 requires and is a good decision.

### 5.6 I6 — the MDX AST lint does not descend into allowed containers (Important)

`lintMdxClaims` iterates `tree.children` — top-level blocks only — and `continue`s on `Editorial`,
`Claim` and `ClaimGroup` without inspecting their subtrees (`mdx-lint.ts:70–125`). The only recursive
check is `visit(tree,'html',…)`, which is effectively dead for MDX because remark-mdx parses markup
as `mdxJsx*` nodes rather than `html` nodes.

I ran 32 cases through the candidate's own exported `lintMdxClaims`. Every baseline rejection works
correctly at top level:

| Top-level case                             | Result                                                 |
| ------------------------------------------ | ------------------------------------------------------ |
| Bare factual paragraph                     | `MDX_UNCITED_FACTUAL_PROSE`                            |
| `<div>…</div>`                             | `MDX_RAW_HTML`                                         |
| `<Callout>…</Callout>`                     | `MDX_COMPONENT_UNSUPPORTED`                            |
| `import` / `export` / `{expression}`       | `MDX_MODULE_SYNTAX_UNSUPPORTED`                        |
| `<Claim />` / `<ClaimGroup />`             | `MDX_CLAIM_ID_MISSING` / `MDX_CLAIM_GROUP_IDS_MISSING` |
| Prose + inline `<Claim/>` in one paragraph | `MDX_UNCITED_FACTUAL_PROSE`                            |
| Blockquote / list / table prose            | `MDX_UNCITED_FACTUAL_PROSE`                            |
| Inline lowercase JSX beside text           | `MDX_UNCITED_FACTUAL_PROSE`                            |

Wrapping the same content in `<Editorial>` defeats it:

| Bypass                                            | Result                                   |
| ------------------------------------------------- | ---------------------------------------- |
| `<Editorial>` ⊃ `<div id="x">…</div>`             | **ALLOW** — raw HTML passes              |
| `<Editorial>` ⊃ `{globalThis.process.env.SECRET}` | **ALLOW** — free expression passes       |
| `<Editorial>` ⊃ `<Callout>…</Callout>`            | **ALLOW** — unsupported component passes |
| `<Editorial>` ⊃ factual paragraph / nested list   | **ALLOW**                                |
| `<Claim id="a">` ⊃ arbitrary prose / `<div>`      | **ALLOW**                                |
| `<ClaimGroup ids={[…]}>` ⊃ `<span>`               | **ALLOW**                                |

The first three are unconditional prohibitions, not judgement calls: §10.7 says "Raw HTML is
prohibited," §11.7 says "do not permit arbitrary raw HTML," and the lint's own message says "Public
content cannot execute imports, exports, or free expressions." Inside an `<Editorial>` wrapper it
can. This defeats the acceptance criterion "No unconstrained factual MDX or raw HTML passes the
lint."

Uncited _prose_ inside `<Editorial>` is a weaker complaint — §10.7 does permit an explicit editorial
boundary and an AST gate cannot judge whether a sentence is an external factual assertion — so I do
not weight that alone. The raw-HTML, free-expression and unsupported-component cases carry this
finding. The `Claim`/`ClaimGroup` child cases are Minor (M4) rather than Important because neither
component declares a `<slot />`, so Astro silently discards those children at render.

### 5.7 I5 — the certainty-lint exceptions admit generic overclaims (Important)

The handoff's Decisions-made section states the new exceptions "prevent false rejection of the
R4-approved text without permitting generic promises such as 'all participants'," and asks me to test
exactly that. `git diff --stat 6e5948f..HEAD -- src/lib/content/validation.ts` shows 244 insertions
and 2 deletions, and the exception clauses are all additions of this milestone.

Two are the problem. `hasUniversalLanguage` (`validation.ts:208–216`) waives `all`/`every` whenever
the surrounding clause merely _contains_ one of six unrelated keywords:

```js
/\b(?:contrast|normalised|tier-\d|this slice|operator experience|measured by)\b/i.test(
  clause,
);
```

and `validation.ts:200–206` waives `all` whenever the next token is a number.
`hasUncalibratedCausalLanguage` (`validation.ts:284–295`) disables the **entire** causal-calibration
check for any statement matching `/^During\b.*\b(?:moment arms?|force|activation|thickness)\b/i` or
containing "in one study."

Running the candidate's own `lintClaimLanguage`, all seven controls are correctly rejected and **12
of 17 adversarial statements pass clean**:

| Statement                                                                                              | Grade    | Lint                    |
| ------------------------------------------------------------------------------------------------------ | -------- | ----------------------- |
| _control_ "Bench pressing always increases pectoralis size in everyone."                               | moderate | `CERTAINTY_UNIVERSAL` ✓ |
| _control_ "All participants gain pectoralis size from bench pressing."                                 | moderate | `CERTAINTY_UNIVERSAL` ✓ |
| _control_ "The bench press is better than the fly."                                                    | moderate | `OUTCOME_REQUIRED` ✓    |
| "Every lifter gains pectoralis size from bench pressing, **measured by** ultrasound."                  | moderate | **clean**               |
| "All lifters should expect pectoralis growth in **this slice**."                                       | moderate | **clean**               |
| "Every trainee benefits from the bench press **contrast**."                                            | moderate | **clean**               |
| "All lifters gain size regardless of **operator experience**."                                         | moderate | **clean**               |
| "Every athlete improves when **normalised** to bodyweight."                                            | moderate | **clean**               |
| "All lifters respond identically in **tier-1** programmes."                                            | moderate | **clean**               |
| "**All 100** lifters in the general population gain pectoralis size."                                  | moderate | **clean**               |
| "Bench pressing works for the vast majority **of all** lifters."                                       | moderate | **clean**               |
| "In 20 participants, every human being who trains gains muscle."                                       | moderate | **clean**               |
| "Wide grip increases … and causes hypertrophy; this was seen **in one study**."                        | low      | **clean**               |
| "**During** training, the bench press increases **force**, improves strength and prevents injury."     | low      | **clean**               |
| "Wide grip increases activation by 40% and produces greater hypertrophy, though results **may** vary." | low      | **clean**               |
| "The bench press is better **for everything**."                                                        | moderate | **clean**               |
| "The bench press is superior **strength**."                                                            | moderate | **clean**               |

The fourth row is the handoff's own counter-example class — "every lifter … gains" is a generic
promise about all lifters — admitted by a keyword that has nothing to do with universality. The
`^During` clause is the widest: it switches the causal gate off entirely for a whole class of
sentence at `low` and `very-low` certainty. A single hedge word anywhere in a sentence licences a
categorical 40% causal claim, because `hasLowCalibration` is evaluated over the whole clause.

§10.8 makes "content contains banned certainty phrases inconsistent with its grade" a build-failure
condition; this implementation does not enforce it. The practical risk today is bounded — all 23
promoted statements are R4-approved verbatim, so the lint never has to catch anything in this slice —
but SBLA-011 _widened_ a safety gate, and the widening admits the class of statement the gate exists
to block. The handoff is right that a regex is not a semantic model; the finding is not that it is
imperfect, but that these specific exceptions key on incidental vocabulary rather than on whether the
universal quantifier is actually scoped.

### 5.8 I4 — graph ordering is locale-dependent, so the bytes are not deterministic (Important)

`compiler.ts` sorts nodes, edges and canonical object keys with bare `localeCompare`:

```ts
132:  ].sort((left, right) => left.id.localeCompare(right.id));
151:  ].sort((left, right) => edgeKey(left).localeCompare(edgeKey(right)));
 56:      .sort(([left], [right]) => left.localeCompare(right))
```

`a.localeCompare(b)` uses the ICU default locale, which is taken from the operating system. Because
`validate:graph` byte-compares a fresh compile against the committed file, the gate's verdict depends
on the operator's machine locale. Driving the candidate's real `compileEvidenceGraph` and applying
its own comparator under a different default locale:

```
fresh compile === committed bytes (this host, ICU default en-US):   true   -> validate:graph PASSES
if the ICU default locale were lt-LT:                               false  -> validate:graph FAILS (GRAPH_OUTPUT_STALE)
   node positions differing: 2/94      edge positions differing: 10/120
   first divergence: "claim-pectoralis-major-humeral-footprint"
                 vs "claim-pectoralis-major-hypertrophy-with-chest-resistance-training"
```

(Lithuanian collation orders `y` between `i` and `k`, so `hu…` and `hy…` swap.) A clean checkout on
such a host fails `pnpm verify` with `GRAPH_OUTPUT_STALE` on an untouched, correct repository — and an
integrator who "fixed" it by recompiling would commit a bundle that then fails everywhere else.

This contradicts the handoff's stated property, "identical inputs produce identical bytes," and
master plan §11.4's requirement that the content pipeline "must be deterministic and testable." The
repository already knows the remedy: pre-existing `scripts/assets/mesh-map.mjs` pins the locale
explicitly at four of five call sites (`localeCompare(b, 'en-US')`). The new compiler — the one file
whose output is byte-compared — is the one that omits it.

The failure mode is a false alarm rather than a silent pass, which is why this is Important and not
Critical. The candidate's own determinism test cannot detect it:
`sbla-011-graph-compiler.test.ts:43` compiles twice in the same process under the same locale.

Related, recorded as Minor M8: `edgeKey` joins fields with `\u0000`, but NUL is collation-ignorable —
`'a\u0000b'.localeCompare('ab') === 0` — so the separator provides no field boundary under collation.
I checked all 120 edges and found **0** distinct keys that collate equal, so nothing is currently
ambiguous.

---

## 6. Findings

### 6.1 CRITICAL

**C1 — A record's `contentChecksum` is never derived from or verified against its content, so an
approval manifest binds nothing.**
`validation.ts:480` compares two author-supplied strings; `recordChecksum()` (`compiler.ts:65`) is
used only for informational graph-node fields. Demonstrated in §5.1: a published, owner-approved,
manifest-covered claim had its `statement` and `plainLanguage` rewritten after approval and
`validate:content`, `validate:graph` and `evidence:status` all returned exit 0.
_Violates:_ master plan §10.6 (approval applies only to exact checksums; changing an included entity
invalidates eligibility), §10.8 (build must fail when a live claim's checksum is absent from the
applicable approved manifest); handoff work items 3 and 4.
_Mitigation:_ no record in this candidate is published, so nothing is mis-bound today.
_Destination:_ SBLA-011 remediation.

### 6.2 IMPORTANT

**I1 — The `preview` prop bypasses all five publication-eligibility checks on a public route, and the
AST lint permits it.** `Claim.astro:23`, `ClaimGroup.astro:31,35`, `mdx-lint.ts:99–117`. Reproduced
end-to-end in §5.5: identical public routes, exit 1 without the prop and exit 0 with it, emitting
`data-publication-state="unpublished"` into `dist/probe/index.html`.
_Violates:_ acceptance criterion "No claim can render publicly without approved review/publication
state, non-null owner approval, manifest ID, and checksum"; handoff work item 6.

**I2 — Manifest `requiredReviews` entries are never resolved or verified.** No code reads the `path`,
checks existence, or compares the `checksum` (§5.3).
_Violates:_ §10.6, "verifies all checksums and required review reports."

**I3 — A published record may bind to a superseded manifest.**
`validatePublishedManifestCoverage` (`validation.ts:447–491`) never consults currency, though
`validateManifestChain` already computes `supersededIds` (`validation.ts:385`) (§5.4).
_Violates:_ §10.6, "joins every live page/claim to exactly one **current**, owner-approved manifest."

**I4 — The byte-compared graph bundle is ordered with unpinned `localeCompare`, so its bytes depend on
the host's ICU default locale.** `compiler.ts:56,132,151`. Under an `lt-LT` default, 2/94 node and
10/120 edge positions move and `validate:graph` fails `GRAPH_OUTPUT_STALE` on a correct repository
(§5.8).
_Violates:_ §11.4 determinism; handoff "identical inputs produce identical bytes"; deviates from the
repository's own pinned-locale convention in `scripts/assets/mesh-map.mjs`.

**I5 — Certainty-lint exceptions added by this milestone admit generic universal and causal
overclaims.** `validation.ts:200–216, 284–295`. 12 of 17 adversarial statements pass clean, including
the handoff's own counter-example class (§5.7).
_Violates:_ §10.8 banned-certainty-phrase rule; handoff Decisions-made ("without permitting generic
promises such as 'all participants'"); reviewer action item 6.

**I6 — The MDX AST lint does not descend into `Editorial`, `Claim`, or `ClaimGroup` subtrees, so raw
HTML, free MDX expressions, and unsupported components pass inside an `<Editorial>` wrapper.**
`mdx-lint.ts:70–125`; the recursive `html` visitor is dead for MDX input (§5.6).
_Violates:_ §10.7 ("Raw HTML is prohibited"), §11.7; acceptance criterion "No unconstrained factual
MDX or raw HTML passes the lint."

### 6.3 MINOR — nonblocking, with impact and destination recorded

**M1 — `study.sampleSize` and `study.durationWeeks` are null for all 68 sources**, although the counts
appear in the free-text `study.population` (e.g. "20 hemithoraxes", "14 apparently healthy male
students"). _Impact:_ any later logic keying on structured sample size sees nothing; no current
consumer. _Destination:_ SBLA-017 coverage work, or a research-side extraction field.

**M2 — `Claim.astro` renders no `qualifiers`.** Only `plainLanguage`/`statement`, the mixed-evidence
line, certainty, and the source list are shown; the approved qualifiers are dropped. _Impact:_ §12.3
requires "uncertainty and limitations are visible" on a publishable page. _Destination:_ SBLA-012.

**M3 — Headings and frontmatter are exempt from the MDX lint.** `isPresentationNode`
(`mdx-lint.ts:40–47`) skips `heading`, `yaml`, `toml`; a heading carrying a factual sentence renders
publicly unchecked. This is an asserted design choice (`sbla-011-mdx-claim-lint.test.ts:6`), so it is
recorded rather than treated as a defect. _Destination:_ SBLA-012 page-schema field classification.

**M4 — `Claim`/`ClaimGroup` children are unlinted and silently discarded.** Neither component declares
a `<slot />`, so authored children vanish at render with no warning. _Impact:_ confusing authoring; no
reader-facing leak. _Destination:_ SBLA-012.

**M5 — `relatedEntityIds` is not referentially validated.** `validateRecordGraph` checks
`relationships[].targetId` but not `relatedEntityIds`; all 4 current values resolve by construction.
_Destination:_ SBLA-016 related-graph traversal.

**M6 — `validate:content` passes with a dangling cross-record reference** (§4.2); only `validate:graph`
catches it. Both are in the pinned chain, so the composite gate holds; the command name invites
over-reading. _Destination:_ documentation or a renamed command.

**M7 — The green gate is time-bounded.** `asOf` defaults to the wall-clock date and the earliest
`nextStatusCheckAt` is **2026-10-13**, so `pnpm evidence:status` and `pnpm verify` begin failing with
`SOURCE_STATUS_OVERDUE` on that date (~27 days from this review). Designed freshness behaviour, but
"passes from a clean checkout" is not open-ended. _Destination:_ operations/status-refresh task.

**M8 — `edgeKey`'s `\u0000` separator is collation-ignorable**, so it provides no field boundary under
`localeCompare` (`compiler.ts:80`). 0 of 120 current edge keys collate equal. _Destination:_ fold into
the I4 fix.

**M9 — The MDX surface is untested end-to-end.** No `Editorial` component exists in the repository and
`@astrojs/mdx` is not installed or configured in `astro.config.mjs`, so Astro cannot render MDX at all
and `lint:content-prose` scans 0 files. The handoff discloses the zero-file scan; the missing
component and integration are recorded here for completeness. _Impact:_ lowers the current
reachability of I1 and I6 but not their status as mechanism defects. _Destination:_ SBLA-012.

---

## 7. Commands run and real results

### 7.1 Pinned runtime

```
$ node --version      v24.20.0
$ pnpm --version      11.24.0
$ pnpm install --frozen-lockfile
  Packages: +578 … Done in 6.5s using pnpm v11.24.0      (exit 0)
```

### 7.2 `pnpm evidence:status && pnpm verify` from this clean worktree — exit 0

Run 1 (2026-09-15, before probing) and run 2 (2026-09-16, after every probe in §5) both passed with
identical counts. Run-1 output:

```
$ pnpm evidence:status
Evidence status passed: 68 sources checked as of 2026-09-15; live network acquisition remains a later task.
  evidence:status EXITCODE: 0

$ pnpm verify
$ prettier --check .          All matched files use Prettier code style!
$ eslint . --max-warnings 0   (clean)
$ astro check                 Result (67 files): 0 errors, 0 warnings, 0 hints
$ vitest run tests/unit       Test Files 19 passed (19) | Tests 254 passed (254)
$ content:slice:check         SBLA-009 promotion verified 94 production records.
$ validate:content            Content validation passed: 95 records.
$ lint:content-prose          MDX claim lint passed: 0 public MDX files checked.
$ validate:graph              Graph validation passed: 94 nodes and 120 edges match deterministic output.
$ validate:research           Research integrity passed: 1 complete bundle checked (SBLA-009).
$ evidence:status             Evidence status passed: 68 sources checked as of 2026-09-15.
$ astro build                 1 page(s) built in 651ms
$ test:portability            Test Files 3 passed (3) | Tests 17 passed (17)
$ verify:foundation           Foundation contract passed
$ assets:spike                Asset spike passed: 4 candidate(s); 1 eligible, 2 ineligible
$ assets:decision             SBLA-006 asset decision passed
  verify EXITCODE: 0
```

Run 2 reproduced every line, with `evidence:status` reporting `68 sources checked as of 2026-09-16`
and `1 page(s) built in 561ms`; `verify EXITCODE: 0`.

Two `[WARN] [glob-loader] No files found matching …` notices for the empty `content/approval-manifests`
and `content/changes` collections are expected for a slice with no manifest and no change record.

Every count the handoff asserts is reproduced exactly: 67 typechecked files, 254 unit tests across 19
files, 94 promoted records, 95 validated records, 0 MDX files, 94 nodes/120 edges, 1 research bundle,
68 sources, 1 built page, 17 portability tests.

### 7.3 The candidate was not modified by this review

```
$ git status --porcelain=v1        (no output, after all probes)
$ git rev-parse HEAD               478411a7aa11da717d7a3de29fe7ad93d0d3604a
$ git diff --check 6e5948f..HEAD   (no output)
```

All scratch material — the working copy, probe harnesses, logs and the `.astro` probe routes — lived
in `…/jobs/c95f2b44/tmp/`, outside the repository, and none of it is committed.

### 7.4 Diff scope against the accepted base

```
$ git diff --name-status 6e5948f..HEAD | awk '{print $1}' | sort | uniq -c
    107 A        8 M
$ git diff --stat 6e5948f..HEAD | tail -1
    115 files changed, 8837 insertions(+), 28 deletions(-)
```

107 added (23 claims, 68 sources, 3 page records, 1 generated graph, 9 pipeline/component/test files,
`src/content/.gitkeep`, 2 components, and the handoff) and 8 modified (`package.json`,
`pnpm-lock.yaml`, `scripts/content/validate.mjs`, `scripts/graph/validate.mjs`,
`src/content.config.ts`, `src/lib/content/schemas.ts`, `src/lib/content/validation.ts`,
`tests/unit/foundation-adapters.test.ts`). This equals the handoff's stated implementation commit
(114 files, 8,616 insertions, 28 deletions) plus exactly the 221-line handoff itself. The file list
matches the handoff's "Files created or modified" section with no omissions and no extras.

`git diff --name-status 6e5948f..HEAD | grep -E "(research/|reviews/)"` returns only
`A reviews/releases/SBLA-011-handoff.md`. **No prior research artifact or immutable review report was
modified**, satisfying the "preserve all prior evidence artifacts and immutable review reports"
constraint.

---

## 8. Criterion-by-criterion matrix

| #   | Criterion (queue row §18 / handoff)                                                        | Verdict                   | Evidence                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Candidate changes only the bounded files listed in the handoff                             | **PASS**                  | §7.4 — 115 files, list matches exactly, no prior artifact touched                                                                                                                                            |
| 2   | `pnpm evidence:status && pnpm verify` passes from a clean checkout                         | **PASS** (host-qualified) | §7.2 — exit 0 twice on the pinned runtime; see I4 for the locale caveat and M7 for the 2026-10-13 horizon                                                                                                    |
| 3   | 23 claims promoted exactly as R4 approved                                                  | **PASS**                  | §3.1 — 0 diffs across 8 scientific fields, 0 link-order diffs                                                                                                                                                |
| 4   | 68 cited sources have faithful production metadata                                         | **PASS**                  | §3.3 — 680 fields compared, 0 mismatches; 68 publication blocks, 0 mismatches                                                                                                                                |
| 5   | Sources have valid current status                                                          | **PASS**                  | §3.3 — 68/68 `current`, 0 missing statusMethod/statusSource; retraction and overdue probes block (§5.2)                                                                                                      |
| 6   | One muscle and two exercise records validate                                               | **PASS**                  | §3.4 — schema-valid, claim-ID-only factual sections, editorial project definitions                                                                                                                           |
| 7   | Deterministic 94-node/120-edge graph with no missing references                            | **PARTIAL**               | Counts and completeness **PASS** (§4.1, independently re-derived); determinism **FAIL** across hosts (**I4**)                                                                                                |
| 8   | Graph fails closed on reference and manifest defects                                       | **PARTIAL**               | Staleness, missing refs, duplicate-current, cycles, dangling/self supersession, ineligibility all **PASS** (§4.2, §5.2); required-review verification (**I2**) and current-manifest binding (**I3**) missing |
| 9   | Approval-manifest rules: exact checksum coverage                                           | **FAIL**                  | **C1** — §5.1, content rewritten after approval, full chain exit 0                                                                                                                                           |
| 10  | No claim renders publicly without approved state, owner approval, manifest ID and checksum | **FAIL**                  | **I1** — §5.5, reproduced with emitted public HTML                                                                                                                                                           |
| 11  | Mixed/qualified evidence is disclosed with source roles and locators                       | **PASS**                  | §5.5 — disclosure line plus all four roles with exact locators; `data-claim-id` present                                                                                                                      |
| 12  | No unconstrained factual MDX or raw HTML passes the lint                                   | **FAIL**                  | **I6** — §5.6, raw HTML and free expressions pass inside `<Editorial>`                                                                                                                                       |
| 13  | Certainty-lint exceptions are narrowly bounded                                             | **FAIL**                  | **I5** — §5.7, 12 of 17 adversarial overclaims pass                                                                                                                                                          |
| 14  | No owner approval or publication eligibility inferred from R4                              | **PASS**                  | §3.4 — 26/26 records unpublished, `ownerApprovedAt` null, manifest and checksum null                                                                                                                         |
| 15  | No SBLA-012+ surface pre-empted (no manifest, route, design system, search, 3D)            | **PASS**                  | `content/approval-manifests/` and `content/changes/` empty; one shell page built; no design tokens or scientific route added                                                                                 |
| 16  | Role boundary and immutability respected by this review                                    | **PASS**                  | §1.4, §7.3 — one pre-claimed path, candidate unmodified, probes outside the repository                                                                                                                       |

---

## 9. Bounded remediation plan

One bounded remediation, then one complete-artifact recheck, per the CLAUDE.md/AGENTS.md stop rule.
All seven blocking findings live in five files; none requires touching a promoted claim, a source
record, or `public/data/evidence-graph.v1.json` except to recompile it.

1. **C1** — Define and enforce the canonical content checksum. Compute a record's digest over its
   canonical JSON with `contentChecksum` (and any other self-referential field) excluded, using the
   existing `canonicalJson`/`recordChecksum` helpers, and make `validatePublishedManifestCoverage`
   verify _computed digest → record `contentChecksum` → manifest entry checksum_ rather than comparing
   two declared strings. Add an invalid fixture that mutates a published record's text and asserts the
   gate fails.
2. **I2** — In `validateManifestChain` or its caller, resolve each `requiredReviews[].path`, require
   the file to exist, and compare its digest to the recorded `checksum`.
3. **I3** — Reuse the `supersededIds` set already built at `validation.ts:385` to reject a published
   record bound to a superseded manifest.
4. **I4** — Pin the collation at all three `compiler.ts` sites (`localeCompare(x, 'en-US')`, matching
   `scripts/assets/mesh-map.mjs`) or switch to a plain codepoint comparator; fold in M8 by using a
   separator that survives comparison. Recompile and commit the bundle. Add a test that sorts under at
   least one divergent locale.
5. **I1** — Remove `preview` from the public path, or gate it behind a build-time flag that production
   builds cannot set, and reject a `preview` attribute in `mdx-lint.ts` for `Claim`/`ClaimGroup`.
6. **I6** — Recurse into `Editorial`, `Claim` and `ClaimGroup` subtrees, applying at minimum the
   unconditional raw-HTML, module-syntax and unsupported-component rules. Add the six bypass cases
   from §5.6 as fixtures.
7. **I5** — Replace the clause-keyword whitelist (`contrast|normalised|tier-\d|this slice|operator
experience|measured by`), the bare `all <number>` waiver and the `^During…` causal off-switch with
   exceptions that require the universal quantifier itself to be scoped to a named study, sample or
   measurement. Re-run the 17 adversarial statements in §5.7 as fixtures alongside the existing
   certainty tests, and confirm all 23 R4-approved statements still pass.

The nine Minor findings in §6.3 are **not** part of this remediation and must not expand it. They are
recorded with impact and destination as the nonblocking rule permits.

No additional review layer is requested or permitted beyond the single complete-artifact recheck that
follows this remediation.

---

## 10. Reviewer limitations

- No network access: no DOI, PMID, PMCID, or URL was re-resolved against a live registry, and no
  primary source was re-read. Source identity and status currency are audited as record-internal
  consistency and faithfulness to the R4-approved extraction only.
- Scientific entailment of the 23 claims was **not** re-litigated; that is SBLA-010's accepted scope,
  closed by `reviews/evidence/SBLA-009-r4.md` (PASS, 0 Critical, 0 Important). This review proves only
  that what was promoted is exactly what R4 approved.
- `pnpm test:e2e`, `test:a11y`, `test:visual`, and `test:performance` were not run; the SBLA-011 queue
  row does not require them and no rendered scientific page exists to exercise.
- The I4 locale divergence was demonstrated by driving the candidate's own compiler and applying its
  own comparator under an alternate locale, because this Windows host derives the ICU default from the
  OS and ignores `LANG`/`LC_ALL`. `a.localeCompare(b)` is by specification
  `a.localeCompare(b, <default locale>)`, so the simulation is faithful, but I did not boot a
  Lithuanian-locale machine.
- Probe coverage is finite. A clean result in §5.2 means those specific manipulations were blocked,
  not that the manifest system is exhaustively proven.

---

## 11. Verdict

**FAIL — 1 Critical, 6 Important, 9 Minor (nonblocking).**

`pnpm evidence:status && pnpm verify` passes from a clean worktree on the pinned runtime, the 23
R4-approved claims and 68 cited sources are promoted byte-exactly with zero scientific drift, the
94-node/120-edge graph is complete and independently confirmed, every promoted record is fail-closed
on publication, and no prior evidence or review artifact was touched. That work is accepted on its
merits and should not be redone.

Acceptance is blocked because the mechanisms this task exists to deliver can be defeated from
outside: an approval manifest that binds no content (**C1**), a public render path that ignores every
eligibility check when passed one prop (**I1**), unverified required reviews (**I2**), retired
manifests accepted as current (**I3**), a byte-compared artifact whose bytes depend on the operator's
locale (**I4**), a certainty gate that admits the exact overclaims it was widened around (**I5**), and
an AST lint that stops at the door of the container authors are told to use (**I6**).

One bounded remediation per §9, then one complete-artifact recheck.

---

_This report is immutable and append-only. A second round creates `reviews/releases/SBLA-011-r2.md`._
