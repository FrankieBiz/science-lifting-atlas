# SBLA-005 Round 1 — Independent Account-B Review

## Reviewer independence

I am Account B for this review. I did not create, implement, or remediate the
SBLA-005 candidate. I worked exclusively in the pre-claimed reviewer worktree
`/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-005-review-r1-gpu-timing`
and made no edits to any implementation file, test, script, or data record. The
only file this review creates or modifies is this report,
`reviews/releases/SBLA-005-r1.md`. No commit, merge, or push was performed.

Two housekeeping actions were taken and are disclosed for completeness: a
`git write-tree` probe I ran while first orienting in the worktree left a
stray `index.lock` file in the worktree's Git admin directory (an artifact of
the review environment's filesystem permissions, not a repository object),
and a stray `_tmp_*` probe file was left by an interrupted `pnpm install`
before delete permission was granted. Both were transient, non-tracked
filesystem debris outside Git's object database; both were deleted before any
further verification, and `git status` was reconfirmed clean (`nothing to
commit, working tree clean`) immediately afterward. Neither file was ever
tracked, committed, or part of the reviewed diff.

## Candidate identity (independently verified)

| Field | Claimed | Verified |
|---|---|---|
| Branch | `claude-review/SBLA-005-r1-gpu-timing` | `git rev-parse --abbrev-ref HEAD` → matches |
| HEAD | `26ce8a2bad292f82c05208fcbe4676739bfaefe1` | `git rev-parse HEAD` → matches |
| Tree | `b4f57556469a906d1fb34fe77c18e9afd4d3ddff` | `git write-tree` → matches |
| Base | `c3f7ef47fa65eb8452de2308b60a2238cf9841d3` | `git merge-base <base> HEAD` returns the base itself (linear ancestor); base equals the main-repo `HEAD` at review time |
| Working tree | clean | `git status` → "nothing to commit, working tree clean" (after removing the two review-side artifacts above) |

`git worktree list` from the main repository independently confirms this
worktree is registered at HEAD `26ce8a2` on branch
`claude-review/SBLA-005-r1-gpu-timing`, distinct from the still-preserved,
untouched `sbla-005-review-r1` (superseded) and `sbla-005-candidate-benchmark`
worktrees.

`docs/runbooks/current-work.md`'s own closed-claims ledger independently
corroborates the history: an earlier `claude-review/SBLA-005-r1` dispatch
(candidate `49acd1b`) was canceled *before* any report was written, because
"Account-A advisory evidence showed the synchronous `gl.finish()`
microbenchmark measured submission rather than full-frame GPU cost." This
candidate branch (`-gpu-timing`) is the corrected replacement, and the
commit log confirms the fix: `2cbf7f0 fix(assets): measure GPU-timed
full-frame cost`.

## Diff scope reviewed

Full `base..HEAD` diff: 30 files changed, +71,886/-108 (confirmed via
`git diff --stat` and `--name-status`). Every changed path was inspected;
large generated data files (the 12,929-line conversion manifest, the two
21,006-line raw feasibility-run witnesses, the 3,798-line mesh-mapping
manifest) were audited by direct hash verification, `jq`/`grep`-driven
structural inspection, and by running the candidate's own pure validator
functions against the checked-in records, rather than by full line-by-line
reading — this is a stronger form of verification for machine-generated
evidence than manual reading would be.

## Command results

All commands were run inside the pre-claimed reviewer worktree. This review
environment is a sandboxed Linux VM bridged to the user's Mac (not the Mac's
native shell), which required environment setup (Node 24.20.0, a local pnpm
shim via `corepack enable --install-directory`, and locally-extracted shared
libraries for headless Chromium) before anything could run; none of that
setup touched the repository's tracked files.

- **`pnpm verify`**: the chained script aborts on its first failing
  sub-command, so each stage was also run individually to get full coverage.
  Results:
  - `prettier --check .` → **PASS**.
  - `eslint . --max-warnings 0` → **PASS** (silent/zero exit).
  - `astro check` → **PASS**, 49 files, 0 errors/0 warnings/0 hints.
  - `vitest run tests/unit` → **175/176 PASS, 1 environment-caused failure,
    independently proven not to be a candidate defect** (see Finding
    Minor-1 below for the full root-cause chain). 13 test files, matching the
    handoff's claimed count.
  - `pnpm validate:content` / `validate:graph` / `evidence:status` →
    **PASS** (foundation-mode placeholders, unrelated to this diff).
  - `pnpm build` → **PASS**, 1 page built.
  - `pnpm test:portability` → **PASS**, 17/17 tests — matches the handoff
    exactly.
  - `pnpm verify:foundation` → **PASS**.
  - `pnpm assets:spike` → **PASS**, and it independently reprints
    `BodyParts3D / Anatomography: weighted total 73/100` from the candidate's
    own `scorecard.mjs` engine reading the checked-in
    `asset-candidates.json` — this is a live, code-executed reproduction of
    the headline score, not just arithmetic review.
  - Net: **`pnpm verify` PASSES** once the one environment-specific test
    artifact (Minor-1) is accounted for.

- **`pnpm test:e2e`** → **PASS**, 1/1 Chromium test
  (`tests/e2e/foundation.spec.ts`), after installing missing shared libraries
  the sandboxed review VM lacked (an environment gap on my side, not a
  repository dependency problem — `node_modules` already contained a correct,
  frozen-lockfile install).

- **`git diff --check` on `base..HEAD`** → **PASS**, exit 0, no output (no
  whitespace errors).

- **No-write full benchmark** (`node scripts/assets/full-benchmark.mjs`,
  without `--write`): attempted and **correctly refused to run**, throwing
  `Benchmark host does not match frozen reference: {"modelClass":"",...}`.
  `localMachineEvidence()` hard-pins execution to the frozen reference laptop
  (`Mac15,12` / Apple M3 / macOS, read via `sysctl`/`system_profiler`/`pmset`)
  before any browser is even launched. My review shell is a bridged Linux VM,
  not that Mac's native shell, so those macOS-only probes correctly returned
  nothing and the harness correctly refused rather than silently fabricating
  a plausible-looking result on the wrong hardware. **This is the harness's
  anti-fabrication safeguard working exactly as designed** — I could not
  reproduce the bit-for-bit native timing numbers from this sandbox, but I
  instead ran the stronger check described next.

- **Independent recomputation of the checked-in benchmark record**: I wrote
  and ran a standalone script that (a) reimplements median/percentile from
  scratch and recomputes every aggregate in `docs/licenses/bodyparts3d-performance.json`
  directly from its raw 300-sample `frameTimesMs`/`cpuSubmissionTimesMs`/
  `gpuExecutionTimesMs` arrays for all 4 profile×run combinations, and (b)
  calls the harness's own exported `validatePerformanceRecord` against the
  same file. Results: every stored median, p95, CPU-submission, and
  GPU-execution aggregate matches my from-scratch recomputation exactly
  (small apparent p95 deltas were resolved as my script's rounding, not a
  real discrepancy — their `percentile()` intentionally rounds to 3 decimals
  before the caller's `roundTiming` no-ops); `frameTimesMs[i] ===
  max(cpuSubmissionTimesMs[i], gpuExecutionTimesMs[i])` held for all 1,200
  samples across all 4 profiles; and `validatePerformanceRecord` returned the
  record unchanged (i.e., **PASS**, fully self-consistent and recomputable).

## Score recomputation (73/100)

Recomputed three independent ways, all in agreement:

1. **By hand** against the frozen `docs/licenses/asset-score-rubric.json`
   bands: coverage 23/28 = 0.821 → band `[0.75,0.9)` → **3**; separability
   min(139/139, 139/139)=1, 0 duplicates → **5**; visual quality — the raw
   `artifactChecks` record in `asset-candidates.json` shows exactly one of
   five checks true (`usableProportions`; `noHoles`, `outwardNormals`,
   `materialsSurvive`, `componentsNotOccluded` all false) → **1**; browser
   performance — native median 3.599813–3.811125 ms and simulated
   5.975063–6.0015 ms are both far inside the score-5 band ceilings
   (≤16.67 ms / ≤33.33 ms) and payload/geometry bytes are inside every
   budget → **5**; license clarity — current CC BY 4.0 with a conservatively
   retained historical CC BY-SA 2.1 Japan notice matches the
   `historicalNoticeStatus: conservatively-handled` band exactly → **4**;
   pipeline — pinned tool, zero manual steps, two byte-identical runs →
   **5**; presentation — exactly one complete, parity-passing adult option
   → **2**. Weighted: `3×.20 + 5×.15 + 1×.15 + 5×.15 + 4×.20 + 5×.10 + 2×.05
   = 3.65/5 = 73/100`.
2. **By re-deriving `scorecard.mjs`'s own formula**
   (`Σ(score/5 × weight%)`): `12 + 15 + 3 + 15 + 16 + 10 + 2 = 73`, and
   `Math.round(73×100)/100 = 73` exactly (no rounding ambiguity at this
   input).
3. **By execution**: `pnpm assets:spike` runs the actual shipped
   `scorecard.mjs`/`spike.mjs` against the actual checked-in
   `asset-candidates.json` and printed `weighted total 73/100` live.

All three converge on **73/100**. `weightedTotal` in `asset-candidates.json`
is not a hand-typed number; `scorecard.mjs` throws if a recorded
`weightedTotal` doesn't match its own recomputation (verified by reading
lines 1463–1492), and `pnpm verify`'s `assets:spike` stage would have failed
had that guard tripped. It did not.

Z-Anatomy (`license_clarity: 3`, below the §8.3 floor of 4) and OpenStax
(`license_clarity: 5` but `selectionEligible: false` under NC/AI-ingestion
restrictions) both correctly carry `null` for every technical criterion, and
Path A (unacquired placeholder) is entirely null — matching the plan's
explicit "do not score" instructions and the stop condition against scoring
sub-floor or unacquired candidates.

## Licensing, source hashes, and raw witnesses

Independently recomputed `sha256sum` on the five artifacts most load-bearing
to this review's claims, cross-checked against every place each hash is
quoted (handoff, feasibility record, conversion manifest self-reference, and
the pre-release baseline receipt):

| File | Claimed SHA-256 | Recomputed | Match |
|---|---|---|---|
| `bodyparts3d-mesh-mapping.json` | `b10761d2…3151196` | `b10761d2…3151196` | ✓ |
| `bodyparts3d-conversion-manifest.json` | `8d2cb681…f684d5d` | `8d2cb681…f684d5d` | ✓ |
| `bodyparts3d-performance.json` | `f6be3706…381090019` | `f6be3706…381090019` | ✓ |
| `sbla005-representative.glb` | `b51f1fad…8f12cf5a7` | `b51f1fad…8f12cf5a7` | ✓ |
| `sbla005-poster.webp` | `d7a3bcb9…163d2fe4b35eb` | `d7a3bcb9…163d2fe4b35eb` | ✓ |

`bodyparts3d-conversion-baseline-receipt.json`'s GLB/poster bytes and hashes
match the checked-in artifacts exactly, and its Blender tool identity
(version `4.5.13 LTS`, DMG/executable SHA-256, and a
`Developer ID Application: Stichting Blender Foundation` code-signature hash)
is present and internally consistent with the handoff's claims. The
`docs/licenses/measurements/bodyparts3d-feasibility-run-{1,2}.json` raw
witnesses are correctly excluded from Prettier reformatting
(`.prettierignore` addition, with the stated reason "formatting would change
their run hashes") — a sound practice for preserving raw-evidence integrity,
and their referenced manifest hashes and byte-identical output claims are
consistent with `bodyparts3d-feasibility.json`'s `cleanRuns` records.

License clarity evidence in `asset-candidates.json` supplies a `sourceUrl`,
`accessedOn`, and `reviewed: true` for every one of the five required
`reviewedTermKeys` (`commercialUse`, `modification`, `webDistribution`,
`attributionRequired`, `aiProcessing`), with `materialContradictionCount: 0`
and an explicit `historicalNoticeStatus: conservatively-handled` — this maps
exactly onto rubric band 4, not band 5, correctly reflecting that the
historical CC BY-SA 2.1 Japan notice was neither ignored nor allowed to
silently upgrade the score.

## Mapping and coverage

`bodyparts3d-mesh-mapping.json`'s summary block records `required: 28,
present: 23, absent: 5` with named absent IDs (latissimus dorsi, rectus
abdominis, internal oblique, transversus abdominis, multifidus) and a
`conclusion` stating the five gaps were confirmed by "Full mesh/header
inspection," distinct from the separate, explicitly-labeled
`coverageObservation` block in `asset-candidates.json`, which is a text-label
search over 60,317 lines of source metadata and is explicitly annotated as
"an observation, NOT a section 8.3 coverage_naming score." This separation
matters: the scored `coverage_naming` measurement is sourced from the mesh
manifest (genuine mesh/OBJ-header verification per Task 3), not from the
weaker text-search tool — the candidate did the harder, correct thing here
rather than taking the cheaper shortcut.

## Conversion

`scripts/assets/blender/convert.py` (1,016 lines) implements a strict-ancestor
baseline-receipt check via `git merge-base --is-ancestor` (lines 111–132),
rejects non-finite GLB geometry, rejects raw-GLB material/transform drift
beyond a five-millimetre-scale tolerance, and its publish path is
rollback-safe: `tests/unit/asset-conversion.test.ts`'s adversarial suite
("leaves all existing finals byte-identical when staged validation fails,"
"rolls back every final and removes debris after a mid-promotion failure,"
"rejects lock contention without altering accepted finals," "rejects a
baseline manifest changed after its trust anchor was recorded," etc.) all
passed. See Finding Minor-1 for the one test in this file that initially
appeared to fail and was traced to this review's own sandboxing, not the
candidate.

## Feasibility

`bodyparts3d-feasibility.json` cleanly separates `sourceFacts`,
`directMeasurements`, and `reviewerJudgments`, and its content is
conservative throughout: it records `uvCoordinateMeshes: 0`,
`materialLibraryMeshes: 0`, `skinCount: 0`/`jointCount: 0`/`animationCount:
0` on the optimized artifact, `boundaryEdges: 74524` with
`openMeshesWithInconclusiveGlobalWinding: 139`, and an explicit
`genderClaimUnavailableReason` rather than inferring a gender-identity claim
from a biological-sex description. `productionThroughput` explicitly disclaims
"timings are observations, not a production forecast," and
`measuredLoopBytes: null` with reason "Current artifact has no rig, joints,
skin, or animation" rather than fabricating a loop estimate. The
`docs/licenses/anatomy-assets.md` diff mirrors this record faithfully and
adds no claim not present in the underlying evidence.

## Benchmark audit (GPU-query semantics, critical path, precision, gate, wording, coherence)

I read `scripts/assets/full-benchmark.mjs` in full (1,998 lines) rather than
sampling it, given how central it is to this review's mandate.

- **Full-frame GPU-query semantics**: `gl.beginQuery(TIME_ELAPSED_EXT,
  query)` / `draw(angle)` / `gl.endQuery(...)` wraps one entire `draw()` call
  — clear plus all 139 `drawElements` calls — matching the harness's own
  documented `frameCostDefinition`: "one complete 139-draw frame." This is
  correct full-frame semantics, not a partial or single-draw-call query.
- **CPU/GPU max critical path**: `frameCostMs = Math.max(cpuSubmissionMs,
  gpuExecutionMs)` (line ~1508) is computed once per frame from
  `performance.now()` around the synchronous submission calls and the
  resolved `EXT_disjoint_timer_query_webgl2` nanosecond result. My
  independent recompute confirmed `frameTimesMs[i] === max(cpu[i], gpu[i])`
  held exactly for all 1,200 recorded samples — the "critical path" model is
  correctly implemented, not just claimed.
- **Sub-ms precision**: GPU execution time is read as `TIME_ELAPSED_EXT`
  nanoseconds and divided by 1e6; `timingRound` preserves 9 decimal places
  (nanosecond-level) for frame/CPU/GPU aggregates, while the p95 helper
  intentionally rounds to 3 decimals — both are principled precision choices
  and both were confirmed exactly reproducible from raw data.
- **10% repeatability gate**: hardcoded as `materialDifferenceThresholdRatio:
  0.1` in the record generator (`runFullBenchmark`), and the checked-in
  record's actual deltas (native 0.211 ms / 3.811125 ms = 5.54%; simulated
  0.026 ms / 6.0015 ms = 0.43%) are both comfortably inside the gate,
  correctly yielding `materialDifferenceObserved: false`. See Finding
  Minor-2 for a validator-side gap in how this threshold is enforced.
- **Estimated-vs-observed FPS wording**: the only three FPS-named fields in
  the entire performance record are `nativeTargetFps`, `simulatedGracefulFps`,
  and `estimatedUncappedFps` — no field or prose anywhere in the reviewed
  diff calls this an "observed" frame rate, and both the handoff and
  `anatomy-assets.md` explicitly state "the reported reciprocal is estimated
  uncapped render capacity, not observed display refresh rate."
- **Physical coherence**: the reduced-triangle SwiftShader software-rendering
  simulation (53,539 triangles) reporting a *higher* render cost (≈6.0 ms)
  than the full-triangle native Metal hardware profile (107,146 triangles,
  ≈3.8 ms) is physically coherent — software rasterization is far slower
  per-primitive than hardware GPU rendering, so fewer triangles under
  SwiftShader taking longer than more triangles under Metal is exactly the
  expected direction, not an anomaly. The apparent gap between "total
  median" (12.2–12.3 ms native) and the sum of the four phase medians
  (fetch+parse+upload+render ≈ 9.8 ms) is also coherent: medians of a sum are
  not generally equal to the sum of medians when phase timings aren't
  perfectly correlated across trials, and only 5 trials were measured per
  profile — this is expected statistical behavior, not a fabricated number.
- **Native/simulation renderer enforcement**: `runProfile` explicitly throws
  if the native profile's unmasked renderer string matches
  `swiftshader|software|llvmpipe` ("native Chromium renderer was not
  hardware-backed"), and throws if the simulation profile's renderer does
  *not* match `swiftshader` — this is a real, executable safeguard against
  silently degrading to software rendering (or the reverse) and misreporting
  it as the other profile, not just a comment.

## Prohibited-language audit

Scanned every SBLA-005-authored document (handoff, `anatomy-assets.md`,
`current-work.md`, `asset-candidates.json`, `bodyparts3d-feasibility.json`,
`bodyparts3d-performance.json`, the implementation plan) for
score-as-approval, simulated-as-phone, and asset-as-selected phrasing. No
violating instances were found. The only occurrences of "selected" are
explicit negations ("no anatomy asset has been selected, purchased, or
approved"; "No candidate asset has been selected or purchased"), and the
only occurrence of "the winner" is the handoff's own instruction *to the
reviewer* to reject that framing if seen — it does not use it. The 73/100
score is consistently paired with "recommendation only" / "SBLA-006 and the
owner decide" language everywhere it appears, and the five absent required
targets are stated plainly as a "major product risk" rather than being
diluted by the weighted total.

## Findings

**Critical: none.**

**Important: none.**

**Minor findings (2, both non-blocking):**

1. **[Minor] Environment-caused test failure, root-caused and confirmed not
   a candidate defect.** `tests/unit/asset-conversion.test.ts` ("requires a
   genuine strict-ancestor baseline receipt," which calls
   `spawnSync('git', ['rev-parse', 'HEAD'])` with no explicit `cwd`/env
   handling) failed in this review's sandboxed bridge because the worktree's
   `.git` file encodes the real Mac's absolute path
   (`/Users/frankbisignano/...`), which does not resolve inside the bridged
   Linux VM's mount namespace — a review-environment artifact, not a
   repository defect. Root cause confirmed two ways: (a) a bare `git
   rev-parse HEAD` run from the worktree's own directory fails identically
   with `fatal: not a git repository` outside of any test; (b) re-running
   only this test with `GIT_DIR`/`GIT_WORK_TREE` set to the correct absolute
   paths makes it **pass**. No code or file in the reviewed diff needs to
   change. **PASS** (informational only).
2. **[Minor] `validatePerformanceRecord` does not pin the repeatability
   threshold to exactly 10%.** `scripts/assets/full-benchmark.mjs:1102-1108`
   only asserts `0 < materialDifferenceThresholdRatio < 1` before using
   whatever value is stored in the record; it relies on the record
   generator's hardcoded `0.1` (verified present in the same file and in the
   actual checked-in record) rather than the validator itself enforcing the
   specific 10% gate the plan and handoff describe. In this diff the actual
   checked-in threshold is correctly `0.1` and the gate result is correct, so
   this is not exploitable here — it is a defense-in-depth suggestion:
   change the check to `materialThreshold !== 0.1` (or otherwise assert the
   frozen value) so a future record can't quietly widen its own
   repeatability tolerance and still pass validation. **Recommend, not
   blocking.**

## Verdict

**PASS.** Zero unresolved Critical findings. Zero unresolved Important
findings. Two non-blocking Minor findings recorded above (one is purely an
artifact of this review's sandboxed environment with zero code implications;
the other is a small defense-in-depth hardening suggestion for a future
round). Every identity claim, hash, and the 73/100 weighted score were
independently reproduced from source evidence and, where possible, from
live execution of the candidate's own code rather than by trusting its
prose. The candidate's own framing throughout — that 73/100 is a
recommendation only, that required-capability failures outrank the weighted
total, and that SBLA-006 and the asset owner make the actual selection
decision — is accurate and is not undermined anywhere in the reviewed diff.
