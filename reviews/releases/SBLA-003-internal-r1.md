# SBLA-003 Round 1 remediation — internal review

## Review identity and scope

| Item               | Value                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ |
| Reviewed candidate | `618af60fea08b0c47f1435761e503b35d3e9f4b6`                                           |
| Exact diff base    | `95d3ac3de9f352b5d79b0f506d188d110ee180a2`                                           |
| Reviewed range     | `95d3ac3de9f352b5d79b0f506d188d110ee180a2..618af60fea08b0c47f1435761e503b35d3e9f4b6` |
| Review branch      | `codex/SBLA-003-internal-review-r1`                                                  |
| Review worktree    | `.worktrees/sbla-003-internal-review-r1`                                             |
| Sole review output | `reviews/releases/SBLA-003-internal-r1.md`                                           |
| Review date        | 2026-09-03                                                                           |

This is an independent internal Codex review of the bounded remediation. It is
not the required Account-B Claude Review Round 2 and does not approve the five
Proposed ADRs or substitute for the owner gate. No artifact under review was
repaired by this review.

The review covered the complete nine-file candidate diff and relevant
surrounding files, including `docs/product/master-plan.md` (especially §§11.1,
11.2, 11.7–11.9, 12.2, 13.6–13.7, and 18), `AGENTS.md`,
`docs/runbooks/operating-policy.json`, the branch/worktree and current-work
runbooks, all five ADRs, `reviews/releases/SBLA-003-r1.md`, and
`reviews/releases/SBLA-003-handoff.md`.

## Verdict

**Ready for Account-B Round 2? With fixes.**

The substantive remediation is correct: all five Important and six Minor
Round 1 findings are repaired, the security-sensitive server change is covered
and passes, the capacity arithmetic is exact, and the handoff now has the ten
mandatory headings. Two newly observed process/documentation defects remain.
The Important ledger defect must be corrected before Account-B Round 2 is
dispatched; the Minor file-inventory omission should be corrected in the same
bounded follow-up.

Finding counts:

- Critical: **0**
- Important: **1**
- Minor: **1**

## Findings

### Critical

None.

### Important

#### IR1-I-1 — The remediation builder claim remains active after its immutable handoff was committed

**Location:** `docs/runbooks/current-work.md:17-21,34`; governing requirements
at `docs/runbooks/branch-and-worktree.md:87-100`.

Candidate `618af60...` commits the remediation and the rewritten handoff, but
the ledger still lists `SBLA-003 remediation R1` under **Active claims**. The
repository contract says a builder claim closes when its immutable handoff is
committed, and the finishing runbook requires the ledger entry to be closed
before stopping at the review gate. The later coordination commit that records
this internal review's exact report path also leaves the remediation claim
active, so this is not merely an artifact of keeping the restricted reviewer
claim outside the reviewed diff.

**Impact:** The canonical ledger falsely reports the builder's nine bounded
paths as still owned while review is underway. That can block or conflict with
later work and fails the handoff's own criterion that the claim ledger and
accepted SBLA-002 lifecycle remain intact
(`reviews/releases/SBLA-003-handoff.md:580-582`). This is the same process
surface that Round 1 required the remediation to make auditable.

**Fix:** In a bounded Codex follow-up, move `SBLA-003 remediation R1` from
Active claims to Closed claims, record the real close time and immutable
candidate/handoff commit, and preserve the separate exact-path review claim on
the coordination branch. Do not rewrite review history. Because the handoff
also needs the Minor inventory correction below, publish and identify one new
immutable candidate before dispatching Account-B Round 2.

### Minor

#### IR1-m-1 — The handoff omits `README.md` from its Round 1 file inventory

**Location:** `reviews/releases/SBLA-003-handoff.md:516-551`.

The candidate diff modifies `README.md`, and the remediation claim correctly
included that path before implementation, but the mandatory **Files created or
modified** section lists only the other eight changed files under “Modified
during Round 1 remediation.”

**Impact:** A reviewer relying on the self-contained handoff can miss a changed
public status artifact, and the inventory does not exactly describe the
reviewed range. The README change itself is accurate and in scope, so this does
not affect runtime behavior or the ADR decision.

**Fix:** Add `README.md` to the Round 1 modified-file list and re-run the exact
range/path check when publishing the follow-up candidate.

## Round 1 finding closure

| Prior finding                                          | Result   | Evidence                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1-I-1 — Netlify contradiction                         | **PASS** | ADRs 0003 and 0005 now both state that the 15 GB maximum cannot carry even the 10k hard-capacity scenario.                                                                                                                                                                   |
| R1-I-2 — nested-route asset-prefix failure undisclosed | **PASS** | ADR 0003 explicitly marks `assetsPrefix: '.'` and `href="./"` mount-root-only, explains the nested-route failure, and requires a route-depth-aware dual-mount replacement before nesting routes.                                                                             |
| R1-I-3 — §11.7 SRI not addressed                       | **PASS** | ADR 0004 and the machine record select no analytics at launch, prohibit the unpinnable manual embed, and gate optional automatic injection on an observed `integrity` attribute plus CSP testing. The cited Cloudflare FAQ and Pages setup documentation support both paths. |
| R1-I-4 — nonconforming handoff headings                | **PASS** | All ten §13.6 `##` headings appear exactly once and in the required order.                                                                                                                                                                                                   |
| R1-I-5 — omitted internal review records               | **PASS** | `docs/runbooks/current-work.md:73` records the two omissions without fabricating retrospective reports and requires future pre-claims plus immutable reports.                                                                                                                |
| R1-m-1 — stale portability count/coverage              | **PASS** | ADR 0003 states three files/twelve tests and current `href`/`src`/`srcset` resource plus navigation coverage. Fresh verification reports 3/3 files and 12/12 tests.                                                                                                          |
| R1-m-2 — targets described as ceilings                 | **PASS** | ADR 0005 uses 160 KB non-3D JS, 3 MB exercise loop, and 10 MB 3D hard ceilings, while labeling the anatomy JS target and local planning inputs.                                                                                                                              |
| R1-m-3 — volatile beacon precision                     | **PASS** | The 2026-09-03 30,294 raw/10,125 gzip measurement and prior drift are recorded; scenario outputs are rounded.                                                                                                                                                                |
| R1-m-4 — missing manifest recipe                       | **PASS** | ADR 0003 and the handoff state the exact sorted per-file SHA-256 recipe and its filename limitation. A fresh reproduction yields `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`.                                                                         |
| R1-m-5 — missing directory redirect                    | **PASS** | The server returns 308 with `Location: /sub/`; the redirected fixture returns 200. The focused test is part of the twelve-test passing portability suite.                                                                                                                    |
| R1-m-6 — other gzip bytes hidden                       | **PASS** | ADR 0005 reports exactly 214 bytes, 8.1% of the 2,640-byte diagnostic gzip total.                                                                                                                                                                                            |

## Acceptance review

|   # | Handoff review criterion                                                                                  | Result                           |
| --: | --------------------------------------------------------------------------------------------------------- | -------------------------------- |
|   1 | Five ADR decisions, consequences, alternatives, reversal costs, static architecture, and no runtime AI    | **PASS**                         |
|   2 | Dated decision-relevant provider facts and fact/inference separation                                      | **PASS**                         |
|   3 | Three-scenario hard-capacity model, launch/optional analytics separation, and SBLA-012/015/016 rerun gate | **PASS**                         |
|   4 | No-auto-charge boundary and honest 70%/85% operating fallback                                             | **PASS**                         |
|   5 | No-analytics launch plus SRI-gated optional analytics, privacy, event, and log restrictions               | **PASS**                         |
|   6 | Same-artifact current-shell proof without overstating future route/asset coverage                         | **PASS**                         |
|   7 | ADR 0002 preserves SBLA-007 schema ownership and later-task scope                                         | **PASS**                         |
|   8 | SBLA-002 operating model, handoff, recovery log, command contract, ledger, and owner boundary             | **FAIL** — IR1-I-1; also IR1-m-1 |
|   9 | All five Important and six Minor Round 1 findings closed with evidence                                    | **PASS**                         |

The owner gate remains correctly pending and is not a finding.

## Correctness, arithmetic, and security review

- The launch model recomputes exactly: `25 KB + 162 KB + 180 KB + 2.7 MB +
1 MB + 1 MB = 5.067 MB/view`. Optional analytics adds `10.125 KB + 2 KB`
  for `5.079125 MB/view`.
- The published scenario totals are correct in decimal units: launch
  `50.67 / 506.70 / 5,067.00 GB`; optional
  `50.79 / 507.91 / 5,079.13 GB`.
- Fresh file-by-file gzip checks reproduce 733 HTML, 1,693 CSS, and 214 other
  bytes, totaling 2,640 bytes. The nine-file raw total remains 5,818 bytes.
- The redirect is applied only after lexical and realpath containment. Existing
  malformed-encoding, encoded-traversal, escaping-symlink, missing-file, and
  unexpected-filesystem-error tests remain green. No new exploitable path or
  response-header issue was identified.
- Launch contains no analytics script. Optional activation is fail-closed on
  observed SRI and CSP behavior; the manual mutable script path is prohibited.
- R2, Functions, paid Workers, and other metered services remain disabled, so
  the $0 result does not depend on an informational alert stopping overage.

## Scope and process review

- The exact candidate range changes nine files, all within the remediation
  claim after its path corrections/expansion and before implementation.
- The three pre-implementation commits in the range modify only the ledger; the
  implementation/handoff commit changes the eight remaining files.
- No `research/`, `content-drafts/`, published `content/`, SBLA-007 schema, or
  SBLA-004–006 asset work is touched.
- The independent review claim is recorded on the Codex coordination branch at
  commit `2ad6ddf` for exactly `reviews/releases/SBLA-003-internal-r1.md`, based
  on candidate `618af60...`; that coordination-only commit is not part of the
  reviewed artifact diff.
- The stable command contract is unchanged. `pnpm verify` still builds before
  the portability suite.

## Checks run

| Check                                                  | Result                                                                                                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Candidate/base/branch/status and full range inspection | **PASS** — exact SHAs; clean before report creation; nine changed paths                                                                                                            |
| `git diff --check 95d3ac3..618af60`                    | **PASS**                                                                                                                                                                           |
| Pinned runtime                                         | **PASS** — Node `v24.20.0`, pnpm `11.24.0`                                                                                                                                         |
| `pnpm verify`                                          | **PASS** — format; lint; 0 Astro diagnostics; 7 unit files/47 tests; content/graph/evidence foundation checks; production build; 3 portability files/12 tests; foundation contract |
| `pnpm test:e2e`                                        | **PASS** — 1 Chromium test, including JavaScript-disabled foundation behavior                                                                                                      |
| `jq` parse of `provider-quotas.json`                   | **PASS**                                                                                                                                                                           |
| Exact §13.6 heading enumeration                        | **PASS** — ten required headings, once and in order                                                                                                                                |
| Capacity arithmetic reconstruction                     | **PASS** — all component and scenario totals reproduce                                                                                                                             |
| Fresh artifact manifest recipe                         | **PASS** — exact `f73ea505...` digest                                                                                                                                              |
| Fresh raw/gzip file accounting                         | **PASS** — 5,818 raw; 2,640 independent gzip; 214 other gzip                                                                                                                       |
| Provider-source reachability                           | **PASS** — all 18 unique recorded URLs returned HTTP 200 on 2026-09-03                                                                                                             |
| Changed analytics/SRI source-content check             | **PASS** — official FAQ documents automatic-injection `integrity` and the unsafe manual case; official setup docs document Pages injection on the next deployment                  |

The public second-host deployment was not redeployed in this internal review.
That is acceptable for this bounded range because no Astro source, build
configuration, or generated-artifact input changed; the fresh build reproduced
the exact manifest already tied to the successful public proof.

## Strengths

- The analytics remedy uses the plan's safest branch—no external script at
  launch—and makes optional activation evidence-gated rather than aspirational.
- The capacity document cleanly separates measured shell bytes, plan hard
  ceilings, local planning limits, launch configuration, and optional
  sensitivity.
- The nested-route limitation is now explicit before later route-owning tasks
  can inherit the mount-root-only workaround.
- The directory redirect is a small, well-placed behavior change with a focused
  regression test and no weakening of containment checks.
- The recovery entry preserves audit truth instead of manufacturing missing
  reports.

## Recommendations

1. Close the remediation claim and correct the handoff inventory in one bounded
   follow-up candidate.
2. Re-run the pinned `pnpm verify`, `pnpm test:e2e`, manifest, heading, and exact
   path checks on that candidate.
3. Commit a fresh exact-path claim based on the corrected immutable candidate,
   then dispatch Account-B Round 2. Do not treat this internal review as the
   required Account-B report or as owner approval.
