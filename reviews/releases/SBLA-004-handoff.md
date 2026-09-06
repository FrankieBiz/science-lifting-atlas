# Handoff: SBLA-004 — asset license inventory and real-sample spike

**Status:** **Accepted on 2026-09-05.** Account-B Claude Review Round 2
passed the exact candidate `213af29cc4c6713d41f133fdbc8acbecb0a5ab15`
with zero Critical, zero Important, and four nonblocking Minor findings. Codex
independently reconfirmed the Chromium E2E and real benchmark checks that the
reviewer's macOS sandbox could not launch. The four Minor findings are accepted
as explicit SBLA-005 hardening work; none defeats the SBLA-004 gate.

## Objective and candidate

Deliver master plan §18 task SBLA-004: an anatomy/exercise-media candidate
license inventory, lawful sample files, and a deterministic spike script with
complete license fields, repeatable browser evidence, and `pnpm verify` green.

- Accepted dependency: SBLA-003 on `main`
- Fresh reconciliation base:
  `78e21065793ef567889398b4f3e54d05df744662`
- Round 1 reviewed candidate:
  `098be6201987552c0ed789f3ada8a64e39472aab`
- Round 1 report commit:
  `9faa74ec94080b2dda708011fe4ea5b82e567268`
- Round 1 integration / remediation base:
  `6332ab23843f6616fb805ecc7bb0d221ce550ae6`
- Remediation implementation:
  `9b350c4c2e7462a80f9a1fcc29a5048617fc9ed5`
- Final reviewed candidate:
  `213af29cc4c6713d41f133fdbc8acbecb0a5ab15`
- Candidate tree: `f65909c52d7220003d122ddf42b93f32ce02fbcf`
- Account-B Round 2 report role commit:
  `a896914e3581dd9bc73a9aeb20618403cdff1267`
- Report integration / closed-review commit:
  `fafdc36597d5ca90d4330c3214aa1ee7ec8fddf2`
- Owner-acceptance claim commit:
  `3c5c398926f77494af5cc5be0c2057008be69354`
- Branch: `codex/SBLA-004-asset-license-reconciliation`
- Worktree: `.worktrees/sbla-004-asset-license-reconciliation`
- Independent recheck report: `reviews/releases/SBLA-004-r2.md`

The exact complete-artifact candidate and tree were recorded in the R2 claim
before dispatch and reproduced by Account B. The report is preserved as an
append-only artifact. Claude's sandbox could not write it to disk, so Codex
transcribed the completed review response into the sole claimed path and
recorded that recovery honestly in the ledger.

The stale branch `codex/SBLA-004-asset-license-inventory` was not merged. Its
four bounded task commits were treated as inputs and replayed onto accepted
main. The accepted portability, operating-model, and review gates remain intact.

## Delivered capability

SBLA-004 now supplies:

- a machine-readable inventory for a commercial placeholder, Z-Anatomy,
  BodyParts3D, and OpenStax reference material;
- complete primary-source license fields for every inventoried candidate;
- explicit eligibility and rejection reasons instead of treating license
  clarity as the same thing as suitability;
- one real, lawful, byte-identical BodyParts3D OBJ sample with full provenance
  and attribution;
- a deterministic scorecard that fails closed on malformed or incomplete
  inventory data;
- an explicit, component-aware 28-target coverage evaluator with regression
  tests;
- a repeatable headless-Chromium/WebGL benchmark that validates the sample
  checksum, fetches and parses the OBJ, uploads it, draws it, and reports
  per-trial and median timings; and
- unit gates that pin the score weights, license floor, sample identity,
  geometry counts, and recorded browser protocol.

This milestone does not select an asset or create a user-facing atlas. SBLA-005
owns full candidate measurement; SBLA-006 owns selection.

## Current license findings

All facts below were read from the named primary sources rather than recalled.

| Path      | Candidate                  | Current result                                                                                                                                                           |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A         | Purchased commercial asset | Placeholder only; no vendor selected and no purchase made.                                                                                                               |
| B         | Z-Anatomy                  | Ineligible at 3/5 clarity because its model document lists mixed NonCommercial reference components whose shipped-geometry boundary is unresolved.                       |
| C         | BodyParts3D                | Eligible to measure at 4/5 clarity. The current DBCLS page states CC BY 4.0; the acquired OBJ retains an older CC BY-SA 2.1 Japan header, so both notices are preserved. |
| Reference | OpenStax A&P 2e            | Ineligible for ingestion-based use because its terms are NonCommercial and explicitly restrict LLM ingestion without permission.                                         |

DBCLS's current license page was updated 2025-02-27 and now states CC BY 4.0
International. This resolves the stale branch's earlier claim that DBCLS and
Z-Anatomy disagreed about the current BodyParts3D license. The sample's embedded
historical notice remains visible and is handled conservatively; no unsupported
retroactive relicensing claim is made.

Exercise media remains derived from the eventual selected anatomy asset, as
master plan §11.9 requires. Its license must permit rigging, rendered stills,
short loops, and web distribution.

## Lawful real sample

The official current PART-OF 99% archive was downloaded on 2026-09-05:

- source:
  `https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_BP3D_4.0_obj_99.zip`
- archive bytes: 64,888,505
- archive SHA-256:
  `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`
- extracted path: `partof_BP3D_4.0_obj_99/FJ1446.obj`
- repository path: `assets/samples/bodyparts3d/FJ1446.obj`
- sample bytes: 105,005
- sample SHA-256:
  `964ab8e287e7f44f14b07d8c7694ec70eee63bc9d7b1eeb3c5dc79e80460336d`
- concept: FMA45874, abdominal part of right pectoralis major
- geometry: 1,019 vertices, 1,019 normals, 1,536 faces/triangles
- modifications: none; byte-identical extraction

The complete 62 MB archive remains outside the repository. The 105 KB sample is
the smallest relevant geometry needed to exercise the genuine format and browser
path. Its unchanged header and `assets/samples/bodyparts3d/LICENSE.md` preserve
the current and historical notices.

## Browser measurement protocol

Run:

```sh
npx --yes --package=node@24.20.0 --call 'pnpm assets:benchmark'
```

The script verifies byte size and SHA-256 before launching Chromium. It performs
one warmup and five measured uncached trials against a local HTTP server, parses
the real OBJ into typed arrays, creates a 320×320 WebGL canvas, uploads the
geometry, draws it, calls `gl.finish()`, and reports timings. Node and browser
parsers must return identical geometry counts.

The recorded darwin-arm64 / HeadlessChrome 151 run has median times of 1.0 ms
fetch, 1.3 ms parse, 2.0 ms upload-and-draw, and 5.1 ms total. It explicitly
records `Google Inc. (Google)` as the vendor and ANGLE/SwiftShader as the WebGL
renderer, so these values are not presented as physical-GPU measurements. A
later repeat returned 0.8 / 1.2 / 2.1 / 4.3 ms.

These measurements prove the sample and procedure are real and repeatable. They
are not a BodyParts3D candidate performance score: a single 1,536-triangle mesh
cannot represent whole-atlas payload, frame time, or memory. SBLA-005 must run
the complete representative scene and assign the §8.3 technical scores.

## Deterministic scorecard and fail-closed behavior

`pnpm assets:spike` validates the inventory and reports eligibility without
inventing technical values. Six technical criteria remain `null` until SBLA-005.
The runner refuses malformed, missing, non-array, empty, duplicated, or
incompletely licensed candidate data. Null, undefined, and primitive candidate
entries become reported errors rather than uncaught exceptions. A commercial
placeholder must set `acquired:false`, must keep all scores null, can never be
complete, and can never receive a weighted total. It also rejects
unacknowledged sub-floor license scores and refuses to compute a weighted total
until every criterion is measured.

The accepted verification sequence was preserved verbatim, including the
portability gate; `pnpm assets:spike` is appended as an additional final step.

## Coverage observation for SBLA-005

The eight published BodyParts3D metadata files contain 60,317 lines. The
versioned evaluator names all 28 master plan §4.3 targets and the exact label or
component groups used for each. It finds 23 of 28 targets and does not find
latissimus dorsi, rectus abdominis, internal oblique, transversus abdominis, or
multifidus. The spinal erector grouping is present through its iliocostalis,
longissimus, and spinalis mesh-mapped components; Round 1 correctly identified
the old `erector spinae` absence as a terminology error. Only 96 distinct names
contain “muscle,” and many labels are group- or compartment-level.

This is a material risk because BodyParts3D is the only currently
license-eligible open 3D candidate. It is still an observation, not a score:
SBLA-005 must verify coverage against the actual mesh archive and ontology
mapping before SBLA-006 decides. If the gap persists, Path A may be the only
viable route.

## Verification evidence

Pinned runtime: Node.js 24.20.0, pnpm 11.24.0.

- Test-driven remediation: focused RED reproduced both Important findings and
  the missing WebGL identity; focused asset tests then passed 29/29.
- `pnpm verify`: PASS.
  - Prettier PASS.
  - ESLint PASS with zero warnings.
  - Astro check: 44 files, zero errors, warnings, or hints.
  - Unit tests: 10 files, 78 tests PASS.
  - Content, graph, and evidence adapters PASS.
  - Production build PASS: one static page.
  - Portability: 3 files, 17 tests PASS.
  - Foundation contract PASS.
  - Asset scorecard PASS: four records, one eligible, two ineligible, one
    placeholder.
- `pnpm test:e2e`: Chromium PASS; the static foundation remains useful with
  client JavaScript disabled.
- `pnpm assets:benchmark`: PASS on the checksum-pinned real sample and repeated
  successfully.

## Files in the bounded task diff

Created:

- `assets/samples/bodyparts3d/FJ1446.obj`
- `assets/samples/bodyparts3d/LICENSE.md`
- `docs/licenses/asset-candidates.json`
- `docs/licenses/bodyparts3d-browser-benchmark.json`
- `docs/licenses/bodyparts3d-sample-manifest.md`
- `scripts/assets/benchmark.mjs`
- `scripts/assets/coverage.mjs`
- `scripts/assets/scorecard.mjs`
- `scripts/assets/spike.mjs`
- `tests/unit/asset-benchmark.test.ts`
- `tests/unit/asset-coverage.test.ts`
- `tests/unit/asset-spike.test.ts`
- `reviews/releases/SBLA-004-handoff.md`

Modified:

- `docs/licenses/anatomy-assets.md`
- `package.json`

Coordination-only changes to `docs/runbooks/current-work.md` record the claim
and the stale-branch recovery.

## Known limits and required next decisions

- This is not legal advice. Z-Anatomy's mixed component boundary remains open.
- BodyParts3D's current license page and the downloaded OBJ's historical header
  differ. Preserving both notices is deliberately conservative; the reviewer
  should flag any stronger legal interpretation.
- Only one small real mesh is benchmarked. Whole-model coverage, optimization,
  memory, payload, frame rate, visual quality, separability, pipeline effort,
  and presentation options remain SBLA-005 work.
- The metadata coverage gap must be confirmed against the actual meshes.
- License facts must be re-verified by 2026-11-30.
- Before assigning SBLA-005 scores, make per-candidate completeness require no
  license issues and clarify the valid unselected-placeholder exception.
- Make spike summary lines reflect the actual result state so malformed or
  failing records cannot print reassuring diagnostic text.
- Give deltoid regions, trapezius regions, and triceps-brachii heads explicit
  component groups before using the evaluator on another candidate.
- Make the benchmark test recompute all four medians from the recorded trials.

## Round 1 remediation map

| Finding | Closure                                                                                                                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I-1     | Placeholder invariant and malformed-entry tests now prevent scoring, completion, acquisition, or uncaught failure.                                                    |
| I-2     | Component-aware evaluator returns the corrected 23/28 result and exact five-target absent set.                                                                        |
| M-1     | `COVERAGE_TARGETS` records all 28 targets and term groups; unit tests pin the list and compound behavior.                                                             |
| M-2     | Null, undefined, array, and primitive candidate entries report validation issues without throwing.                                                                    |
| M-3     | The sample notice now links the current CC BY 4.0 deed as well as both primary notices.                                                                               |
| M-4     | The benchmark records unmasked WebGL vendor and renderer and checks they remain stable across trials.                                                                 |
| M-5     | This handoff identifies the exact R1 chain and remediation commit; the canonical exact R2 candidate is pinned in the ledger claim and must be copied into the report. |

## Independent complete-artifact recheck

Completed by distinct Claude Review Account B. The append-only Round 2 report
returns PASS with zero Critical and zero Important findings and explicitly
closes I-1, I-2, and M-1 through M-5. It independently reproduced the license
facts, archive and sample hashes, geometry, 23/28 coverage observation,
scorecard determinism, weights, license floor, accepted command chain, and
scope boundary.

The reviewer sandbox could not launch Chromium. Codex therefore reran both
commands under the pinned Node 24.20.0 and pnpm 11.24.0 runtime before owner
acceptance:

- `pnpm test:e2e`: PASS, 1/1 Chromium test.
- `pnpm assets:benchmark`: PASS on the checksum-pinned sample; the repeat run
  reported SwiftShader explicitly and remained a non-candidate baseline.

No further SBLA-004 review is required. Preserve both review rounds unchanged.
Any future regression creates a new append-only round instead of modifying the
accepted history.
