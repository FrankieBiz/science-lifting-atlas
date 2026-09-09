# Handoff: SBLA-005 — candidate benchmark and measured scorecard

**Status:** Accepted on `main` at
`2e08f4371b1744b1b917dad858355e0b29b1c484` after the one plan-required
independent Account-B Claude Review passed with zero Critical and zero Important
findings. This remains a measurement and recommendation milestone, not an
asset-selection decision.

## Acceptance addendum

- Exact reviewed candidate: `26ce8a2bad292f82c05208fcbe4676739bfaefe1`
- Candidate tree: `b4f57556469a906d1fb34fe77c18e9afd4d3ddff`
- Reviewer-authored report: `reviews/releases/SBLA-005-r1.md`
- Reviewer report commit: `b3596209a977229fcd335b85fef5467360a27e10`
- Integrated report commit: `4427c86c04b3d9fe626bba729f98176caa387f64`
- Report SHA-256:
  `64791abd88cf5cccbac2a0170ddd1224816cd66f99f4bddc50e9cdb42d157e90`
- Verdict: PASS; 0 Critical, 0 Important, 2 nonblocking Minor findings
- Acceptance/traceability closure: `2e08f4371b1744b1b917dad858355e0b29b1c484`
- Exact dependency base for SBLA-006:
  `2e08f4371b1744b1b917dad858355e0b29b1c484`

The acceptance closure changes only traceability and formatter boundaries after
the reviewed candidate. It does not change the measured artifacts, scorecard,
benchmark, or immutable reviewer report.

## Candidate identity and boundary

- Accepted base: `c3f7ef47fa65eb8452de2308b60a2238cf9841d3`
- Implementation candidate: `2cbf7f0184c0e1fed674e2f146e7fad873d3b927`
- Branch: `codex/SBLA-005-candidate-benchmark`
- Builder worktree:
  `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-005-candidate-benchmark`
- Repository: `/Users/frankbisignano/dev/science-lifting-atlas`
- Required review report: `reviews/releases/SBLA-005-r1.md`
- Selection authority: SBLA-006 owner gate

The immutable handoff candidate is the commit that adds this file and closes
the builder claim. Its exact hash is recorded by the subsequent review-claim
commit before Account B is dispatched. Neither candidate is to be amended or
rebased after it is claimed. An earlier working commit, `9bf5f4e`, was amended
while Task 5 was still under internal repair; it is not a formal review
candidate and no acceptance claim relies on it. The replacement history is
preserved locally, including final Task 5 commit `ef789fa`.

No Git remote is configured. The candidate is locally reproducible but is not
backed up off this computer. This is the largest remaining project-level
operational risk and cannot be closed without a repository URL or authorization
to create one.

## Decision headline: required-capability failures outrank 73/100

BodyParts3D is the only acquired, license-eligible candidate that could be
fully measured. Its deterministic weighted score is **73/100**, but it is not
selected and should not be treated as a sufficient sole source. The following
master-plan §8.1 capability failures and unproven requirements are decision
gates above the weighted total:

| Capability                                         | Result                                              | Severity and SBLA-006 consequence                                                                                                                                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adult skeletal-muscle anatomy with reliable naming | **FAIL as a complete lifting-atlas source**         | Five required targets are absent: latissimus dorsi, rectus abdominis, internal oblique, transversus abdominis, and multifidus. These gaps block core pulling and trunk/bracing coverage unless another source or authored 2D/vector fallback supplies them. |
| Skeleton context                                   | **NOT DEMONSTRATED in the representative pipeline** | The measured artifact contains muscle meshes only; no skeleton, head, full distal limbs, or skin layer is present. SBLA-006 must require a complementary context layer or a different asset.                                                                |
| UVs/materials survive web conversion               | **FAIL**                                            | The selected OBJ inputs have no UV coordinates or resolved material libraries. The GLB uses one deterministic replacement material; this is not source-material survival.                                                                                   |
| Clean topology adequate for optimization           | **LIMITED, not a clean-topology pass**              | Every mesh is open with 74,524 boundary edges. There are zero degenerate faces, non-manifold edges, or same-direction shared edges, and the optimized artifact performs well, but global winding remains inconclusive.                                      |
| Exercise animation/rig path                        | **UNSUPPORTED from this source**                    | The artifact has zero skins, joints, and animations. Exercise media requires authored vector or staged diagrams unless a separately licensed rig is added.                                                                                                  |
| Presentation options                               | **LIMITED**                                         | One adult human male presentation was observed; no female, body-shape, or broader inclusive variant was demonstrated.                                                                                                                                       |

Mapping/separability, scripted conversion, browser payload/render cost, and the
current license floor pass their measured rules. Browser performance was
measured on an Apple M3 reference laptop and in a conservative software-rendered
simulation, not on a physical mid-tier mobile device. The host was on battery;
that confound is explicit and physical-device confirmation remains required.

## Weighted scorecard

The rubric was frozen before candidate measurement in
`docs/licenses/asset-score-rubric.json`. `scripts/assets/scorecard.mjs` derives
each score from evidence, rejects a mismatch, and recomputes the total.

| Criterion                               |   Weight |      Score | Evidence result                                                                                                       |
| --------------------------------------- | -------: | ---------: | --------------------------------------------------------------------------------------------------------------------- |
| Anatomical coverage and naming accuracy |      20% |        3/5 | 23/28 required targets; zero mapping defects; five material absences                                                  |
| Mesh separability and mapping           |      15% |        5/5 | 139/139 selectable meshes and 139/139 valid mappings                                                                  |
| Visual quality after optimization       |      15% |        1/5 | Deterministic proportions pass; source materials, clean closed topology, and whole-scene visibility do not            |
| Browser performance                     |      15% |        5/5 | 2,874,932-byte GLB; 2,753,652 geometry bytes; GPU-timed full-frame medians 3.811125 ms native and 6.0015 ms simulated |
| License clarity and flexibility         |      20% |        4/5 | Current CC BY 4.0 terms pass; historical CC BY-SA 2.1 Japan notice is conservatively retained                         |
| Scripted Blender/glTF pipeline          |      10% |        5/5 | Pinned, non-interactive, two clean byte-identical output runs                                                         |
| Presentation options                    |       5% |        2/5 | One complete adult human male presentation; no additional variants                                                    |
| **Weighted total**                      | **100%** | **73/100** | Recommendation only; required-capability table above controls the decision framing                                    |

The exact arithmetic is
`3×.20 + 5×.15 + 1×.15 + 5×.15 + 4×.20 + 5×.10 + 2×.05 = 3.65/5 = 73/100`.

Z-Anatomy remains unscored because accepted license clarity is 3/5. OpenStax
remains unscored because `selectionEligible:false` under its NonCommercial and
AI-ingestion restrictions. Path A remains an unacquired, unscored commercial
placeholder; no vendor was selected and nothing was purchased.

## Official acquisition and mesh-map reproduction

The source workspace stays outside Git. From an empty external directory:

```sh
SBLA_BP3D_URL='https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST'
curl --fail --location --remote-name "$SBLA_BP3D_URL/isa_BP3D_4.0_obj_99.zip"
curl --fail --location --remote-name "$SBLA_BP3D_URL/partof_BP3D_4.0_obj_99.zip"
curl --fail --location --remote-name "$SBLA_BP3D_URL/isa_element_parts.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/isa_inclusion_relation_list.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/isa_parts_list_e.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/isa_parts_list.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/partof_element_parts.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/partof_inclusion_relation_list.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/partof_parts_list_e.txt"
curl --fail --location --remote-name "$SBLA_BP3D_URL/partof_parts_list.txt"
```

Validate the downloaded bytes against this table before extraction:

| File                                 |       Bytes | SHA-256                                                            |
| ------------------------------------ | ----------: | ------------------------------------------------------------------ |
| `isa_BP3D_4.0_obj_99.zip`            | 142,903,898 | `40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e` |
| `partof_BP3D_4.0_obj_99.zip`         |  64,888,505 | `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97` |
| `isa_element_parts.txt`              |   1,142,159 | `a3de74423f943b0d724ae8f59b3a817f87c423a544f8db98113b1980817cbeaf` |
| `isa_inclusion_relation_list.txt`    |     207,664 | `26e7d818e03a8c909fe09c561f38d0d513423c87681f9450a803bc38f5b07564` |
| `isa_parts_list_e.txt`               |     128,086 | `ab7796deedd49205e77f3609a1cb8c53e2bbee14ecb5c9a6ca05227469780513` |
| `isa_parts_list.txt`                 |     302,828 | `e5f32398b916e259b88b8aabadac347fe4e0d6bcb2b6535a45ec66b5e60b32b5` |
| `partof_element_parts.txt`           |     651,179 | `3f5f6df1028eb122b30de77c711597b6bb8e5541658e5985859fd228adbf88ea` |
| `partof_inclusion_relation_list.txt` |      91,241 | `1b40738270931e3c1d955ce34e0fce0d8d10d8c5ad543463e40b4b4c0243007c` |
| `partof_parts_list_e.txt`            |      59,351 | `9224080557053e6f1322f1e13ab27f0ecde0db19bb3b505f0631afad230eeebd` |
| `partof_parts_list.txt`              |     142,590 | `dd29cceba270ffaa5d5f53003b1c3284f70a15fba7137bb81f26f176f4bdb5e3` |

After extracting the ZIP files, reproduce the compact manifest with:

```sh
pnpm assets:mesh-map \
  --metadata-dir "$SBLA_SOURCE_DIR" \
  --isa-archive "$SBLA_SOURCE_DIR/isa_BP3D_4.0_obj_99.zip" \
  --partof-archive "$SBLA_SOURCE_DIR/partof_BP3D_4.0_obj_99.zip" \
  --isa-mesh-dir "$SBLA_SOURCE_DIR/isa_BP3D_4.0_obj_99" \
  --partof-mesh-dir "$SBLA_SOURCE_DIR/partof_BP3D_4.0_obj_99" \
  --out "$SBLA_OUTPUT_DIR/bodyparts3d-mesh-mapping.json"
```

The result contains 139 unique selected OBJ meshes from 54,495,284 source
bytes. It confirms 23 present and five absent targets. The checked-in mapping
SHA-256 is
`b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196`.

## Deterministic conversion and artifact identity

The conversion runtime is Blender 4.5.13 LTS on macOS arm64:

- official DMG SHA-256:
  `663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53`
- executable SHA-256:
  `49fa4d4694f55b37b58b18d99a71bdc8228d30545caa2e16c9f99952f4c76f55`
- Developer ID authority:
  `Developer ID Application: Stichting Blender Foundation (68UA947AUU)`

The non-interactive conversion command shape is:

```sh
/private/tmp/sbla005-tools/Blender-4.5.13.app/Contents/MacOS/Blender \
  --background --python scripts/assets/blender/convert.py -- \
  --mapping docs/licenses/bodyparts3d-mesh-mapping.json \
  --isa-dir "$SBLA_SOURCE_DIR/isa_BP3D_4.0_obj_99" \
  --partof-dir "$SBLA_SOURCE_DIR/partof_BP3D_4.0_obj_99" \
  --output-dir "$SBLA_OUTPUT_DIR" \
  --manifest "$SBLA_OUTPUT_DIR/bodyparts3d-conversion-manifest.json" \
  --compare-manifest docs/licenses/bodyparts3d-conversion-manifest.json \
  --compare-manifest-sha256 8d2cb6813a49be110c47729da208f3093b74788e7ae479b55e6f8abdef684d5d \
  --compare-glb assets/derived/bodyparts3d/sbla005-representative.glb \
  --compare-poster assets/derived/bodyparts3d/sbla005-poster.webp \
  --baseline-receipt docs/licenses/bodyparts3d-conversion-baseline-receipt.json \
  --baseline-receipt-commit 0f118314ae602777752370ec6d0a5bd69bfa5a54
```

Two clean conversion witnesses are retained in
`docs/licenses/measurements/bodyparts3d-feasibility-run-1.json` and
`bodyparts3d-feasibility-run-2.json`. They took 12.571 and 8.084 seconds, or
663.431708 and 1,031.667491 meshes/minute. Both produced byte-identical
authorized outputs. A fresh external regeneration in
`/private/tmp/sbla005-task8-regeneration.onN2pj` again matched both artifact
hashes and matched the normalized manifest structure byte-for-byte after only
external output paths were removed.

| Artifact            |     Bytes | SHA-256                                                            |
| ------------------- | --------: | ------------------------------------------------------------------ |
| Representative GLB  | 2,874,932 | `b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7` |
| Fixed poster WebP   |    11,906 | `d7a3bcb98e380910cfc762f259e5d3f1e1434f71c8caecc66ee163d2fe4b35eb` |
| Conversion manifest |         — | `8d2cb6813a49be110c47729da208f3093b74788e7ae479b55e6f8abdef684d5d` |

## Browser measurement environment and results

Runtime: Node.js 24.20.0, pnpm 11.24.0, Playwright 1.62.1, Chromium
151.0.7922.34 (`a596b1cfc6353e987fcec8d71a23a28cd6a9e7a6b4e20b908e4c4fcffe51158e`).
Reference machine: Mac15,12, Apple M3 8-core CPU/8-core GPU, 16 GiB RAM,
macOS 26.6.2, Metal 4, battery power, 1280×720 viewport, pixel ratio 1.

The full scene is every Task 4 mapped selectable object: 139 objects, 139
meshes, 139 draw calls, 87,949 vertices, 107,146 triangles, and 2,753,652
geometry-buffer bytes. The reduced simulation keeps all 139 objects while
sampling 53,539 triangles, 73,619 vertices, and 2,088,090 geometry bytes.

Every profile uses one warmup, five cold no-store load/parse/upload trials,
30 discarded `requestAnimationFrame` stabilization frames, then 300 GPU-timed
full-frame samples. Each sample combines CPU submission time with
`EXT_disjoint_timer_query_webgl2` execution time for one complete 139-draw
frame. Fresh browser contexts, UUIDs, timestamps,
payload-bound receipts, and evidence digests prove trial/run independence.

| Run/profile                        | Fetch median | Parse median | Upload median | Total median | Render-cost median | p95 render cost | Observed JS heap |
| ---------------------------------- | -----------: | -----------: | ------------: | -----------: | -----------------: | --------------: | ---------------: |
| Run 1 native Metal                 |       4.8 ms |       0.3 ms |        1.1 ms |      12.3 ms |        3.599813 ms |        7.321 ms |      4,892,139 B |
| Run 1 reduced SwiftShader + 4× CPU |      14.9 ms |       1.5 ms |       46.2 ms |      76.9 ms |        5.975063 ms |        6.532 ms |      9,265,488 B |
| Run 2 native Metal                 |       4.6 ms |       0.4 ms |        1.1 ms |      12.2 ms |        3.811125 ms |        7.788 ms |      4,867,807 B |
| Run 2 reduced SwiftShader + 4× CPU |      14.6 ms |       1.4 ms |       45.0 ms |      75.0 ms |          6.0015 ms |        6.552 ms |      9,253,460 B |

Native render-cost median delta is 0.211 ms; simulated delta is 0.026 ms. Both
remain within the scale-independent 10% repeatability gate. The payload
passes the 6 MB desktop target, 10 MB hard ceiling, 3 MB mobile-interactive
target, and 25 MiB host file ceiling. The software simulation is a fallback
stress profile, not evidence from a physical low-tier phone. The checked-in
performance record SHA-256 is
`f6be37064594e603a849079ec32e340ae7260efb8702a228a7cb4c7381090019`.
Reciprocals of the critical-path costs are estimated uncapped render capacity,
not observed display refresh rate.

## Four carried SBLA-004 Round 2 Minor closures

All four accepted follow-ups were closed in `c828061` and retained through the
candidate:

1. Candidate completeness now requires `licenceIssues.length === 0`; a fully
   scored but unlicensed record cannot total or complete.
2. CLI summaries use evaluated outcomes and explicitly report malformed,
   invalid-placeholder, unlicensed, and incomplete records.
3. Deltoid, trapezius, and triceps use explicit component groups while the
   independently reproduced BodyParts3D result remains 23/28.
4. All four stored benchmark medians are recomputed from raw trials and drift
   fails closed.

## Verification evidence at implementation candidate

The following fresh checks ran on 2026-09-09 after the GPU-query frame-timing
repair:

- `pnpm assets:full-benchmark`: PASS; wrote two independently receipted runs
  summarized above.
- `pnpm verify`: PASS after one formatting correction; 13 unit-test files and
  176 tests passed, Astro reported zero errors/warnings/hints, production built
  one page, 17 portability tests passed, foundation contract passed, and the
  scorecard reported one eligible measured candidate at 73/100.
- `pnpm test:e2e`: PASS, 1/1 Chromium test.
- `git diff --check`: PASS.
- fresh Blender regeneration: GLB and poster byte-identical; normalized
  manifest structure byte-identical.

`pnpm verify` proves repository integrity and scorecard consistency. It does
not select the asset or override the required-capability failures.

## Bounded task diff

Created:

- `assets/derived/bodyparts3d/sbla005-poster.webp`
- `assets/derived/bodyparts3d/sbla005-representative.glb`
- `docs/licenses/asset-score-rubric.json`
- `docs/licenses/bodyparts3d-conversion-baseline-receipt.json`
- `docs/licenses/bodyparts3d-conversion-manifest.json`
- `docs/licenses/bodyparts3d-feasibility.json`
- `docs/licenses/bodyparts3d-mesh-mapping.json`
- `docs/licenses/bodyparts3d-performance.json`
- `docs/licenses/measurements/bodyparts3d-feasibility-run-1.json`
- `docs/licenses/measurements/bodyparts3d-feasibility-run-2.json`
- `docs/superpowers/plans/2026-09-05-sbla-005-candidate-benchmark.md`
- `scripts/assets/blender/convert.py`
- `scripts/assets/full-benchmark.mjs`
- `scripts/assets/mesh-map.mjs`
- `tests/unit/asset-conversion.test.ts`
- `tests/unit/asset-full-benchmark.test.ts`
- `tests/unit/asset-mesh-map.test.ts`
- `reviews/releases/SBLA-005-handoff.md`

Modified:

- `.gitignore`
- `.prettierignore`
- `docs/licenses/anatomy-assets.md`
- `docs/licenses/asset-candidates.json`
- `docs/runbooks/current-work.md`
- `package.json`
- `scripts/assets/coverage.mjs`
- `scripts/assets/scorecard.mjs`
- `scripts/assets/spike.mjs`
- `tests/unit/asset-benchmark.test.ts`
- `tests/unit/asset-coverage.test.ts`
- `tests/unit/asset-spike.test.ts`

The accepted pre-existing real-sample files and
`docs/licenses/bodyparts3d-browser-benchmark.json` remain inputs but are not
changed in this bounded diff.

## SBLA-006 owner decisions

SBLA-006 must make one explicit path decision; SBLA-005 does not make it:

1. evaluate and, only after the gate passes, purchase a commercial asset with
   complete lifting-muscle coverage, clean web-ready visuals, skeleton context,
   and broader presentation options;
2. use BodyParts3D only as a mapped base plus another licensed 3D source for
   missing structures/context;
3. use BodyParts3D for the 23 mapped targets and author evidence-reviewed 2D or
   vector anatomy/exercise fallbacks for the five gaps; or
4. choose a 2D-first launch and defer premium 3D anatomy.

Because Path A has not been acquired, SBLA-005 did not perform a head-to-head
commercial comparison. Account B should reject any wording that calls
BodyParts3D “the winner,” treats 73/100 as selection approval, presents the
simulation as a phone result, or minimizes the five absent targets.

## Independent review request

Account-B Claude Review should reproduce candidate/tree identity, inspect every
path in the bounded diff, rerun the available commands, recompute all seven
scores and the weighted total, verify the source/artifact digests, and write
only `reviews/releases/SBLA-005-r1.md`. The report must state PASS or FAIL and
enumerate Critical, Important, and Minor findings. SBLA-005 may be accepted only
with zero unresolved Critical and zero unresolved Important findings.
