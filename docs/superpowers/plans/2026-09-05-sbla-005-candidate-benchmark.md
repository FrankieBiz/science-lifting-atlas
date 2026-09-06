# SBLA-005 Candidate Benchmark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Measure every Section 8 scorecard dimension for each license-eligible
candidate, prove BodyParts3D mesh mapping and representative-scene feasibility,
and produce a deterministic weighted scorecard without selecting or purchasing
an asset.

**Architecture:** Freeze a machine-readable scoring rubric before measuring.
Keep archive acquisition outside Git, turn primary metadata and mesh headers
into a compact checked-in mapping manifest, and benchmark a reproducibly chosen
representative scene in Chromium. Pure modules own validation and arithmetic;
thin command wrappers acquire files and print deterministic records. SBLA-006,
not this task, owns the final asset decision.

**Tech Stack:** Node.js 24.20.0, pnpm 11.24.0, JavaScript ESM, Vitest,
Playwright Chromium/WebGL, official BodyParts3D metadata and OBJ archive, JSON
and Markdown evidence records.

---

## File map

- `docs/licenses/asset-score-rubric.json`: immutable 0–5 measurement rules for
  all seven §8.3 criteria, frozen before candidate measurement.
- `scripts/assets/scorecard.mjs`: validates licenses and measurements, computes
  completeness and weighted totals only for fully valid records.
- `scripts/assets/spike.mjs`: reports candidate outcomes without contradictory
  success-looking lines.
- `scripts/assets/coverage.mjs`: applies one consistent component-aware rule to
  all 28 required targets.
- `scripts/assets/mesh-map.mjs`: pure metadata/header mapping functions plus a
  CLI that reads an externally acquired official archive workspace.
- `docs/licenses/bodyparts3d-mesh-mapping.json`: compact, checksum-bound mapping
  result for all required targets and every representative mesh.
- `scripts/assets/blender/convert.py`: deterministic Blender spike that imports
  the mapped OBJ set, preserves selectable objects, normalizes coordinates and
  materials, creates fixed LODs, exports GLB, and renders a fixed-camera poster.
- `docs/licenses/bodyparts3d-conversion-manifest.json`: source-to-derived mesh,
  material, LOD, bounds, checksum, tool-version, and timing proof.
- `assets/derived/bodyparts3d/sbla005-representative.glb`: authorized optimized
  browser artifact produced only if it fits the repository and performance
  budgets.
- `assets/derived/bodyparts3d/sbla005-poster.webp`: fixed-camera accessible
  fallback/visual-inspection artifact at the §11.9 poster budget.
- `scripts/assets/full-benchmark.mjs`: reproducibly builds and runs the complete
  representative browser scene without committing the large source archive.
- `docs/licenses/bodyparts3d-performance.json`: payload, frame-time, geometry
  memory, observed JS heap, renderer, trial, and environment evidence.
- `docs/licenses/bodyparts3d-feasibility.json`: measured visual, pipeline, and
  presentation facts with exact evidence and limitation fields.
- `docs/licenses/asset-candidates.json`: populated SBLA-005 scores and totals for
  eligible candidates; ineligible and placeholder records remain unscored.
- `docs/licenses/anatomy-assets.md`: human-readable measurement and risk record.
- `reviews/releases/SBLA-005-handoff.md`: immutable candidate identity,
  commands, results, uncertainties, and independent review request.
- `tests/unit/asset-*.test.ts`: test-first guards for every rule and record.

## Task 1: Close the four accepted Round 2 hardening findings

**Files:**

- Modify: `tests/unit/asset-spike.test.ts`
- Modify: `tests/unit/asset-coverage.test.ts`
- Modify: `tests/unit/asset-benchmark.test.ts`
- Modify: `scripts/assets/scorecard.mjs`
- Modify: `scripts/assets/spike.mjs`
- Modify: `scripts/assets/coverage.mjs`

- [ ] Add a failing test proving a fully scored but unlicensed record is neither
      complete nor totaled.
- [ ] Run the focused test and confirm the existing per-candidate result fails.
- [ ] Require `licenceIssues.length === 0` in the completeness predicate.
- [ ] Add failing process-output tests for malformed, invalid-placeholder, and
      unlicensed fully scored records.
- [ ] Run the tests and confirm the current status-based summaries fail them.
- [ ] Make the CLI print explicit invalid/incomplete outcomes from the evaluated
      result rather than the input status alone.
- [ ] Add failing tests requiring explicit anterior/middle/posterior deltoid,
      ascending/descending/transverse trapezius, and long/lateral/medial triceps
      components.
- [ ] Replace the three bare-parent rules with component groups and keep the
      independently reproduced BodyParts3D result at 23/28.
- [ ] Add a failing test that changes one stored median while preserving trials.
- [ ] Recompute and assert all four medians from the trial arrays.
- [ ] Run all focused asset tests; expect green.
- [ ] Commit the bounded hardening change.

## Task 2: Freeze the score rubric before measurement

**Files:**

- Create: `docs/licenses/asset-score-rubric.json`
- Modify: `tests/unit/asset-spike.test.ts`
- Modify: `scripts/assets/scorecard.mjs`

- [ ] Write failing tests requiring exactly the seven §8.3 criterion IDs,
      labels, weights, score bands, evidence fields, and rejection floor.
- [ ] Define deterministic 0–5 bands before reading candidate outcomes:
      coverage uses required-target ratios plus zero material mapping defects;
      separability uses selectable-mesh and mapping rates; visual quality uses
      documented artifact checks after deterministic normalization;
      browser performance uses the existing payload/frame/memory budgets;
      license uses the accepted clarity rules; pipeline uses repeatable scripted
      steps; presentation uses the presence and parity of adult presentation
      options.
- [ ] State that a missing required measurement produces no score, not zero, and
      blocks completeness.
- [ ] Validate every candidate score against the rubric and keep the license
      floor at 4/5.
- [ ] Run focused tests and commit the rubric before acquiring benchmark data.

## Task 3: Reproduce the full mesh mapping from official data

**Files:**

- Create: `tests/unit/asset-mesh-map.test.ts`
- Create: `scripts/assets/mesh-map.mjs`
- Create: `docs/licenses/bodyparts3d-mesh-mapping.json`
- Modify: `package.json`

- [ ] Write fixture-first failing tests for metadata parsing, target-to-concept
      matching, component completeness, duplicate mesh IDs, absent archive
      entries, OBJ header identity, and deterministic output ordering.
- [ ] Implement pure parsers for the official element-parts, parts-list, and
      representation metadata already checksum-pinned by SBLA-004.
- [ ] Implement an external-workspace CLI that accepts explicit metadata and
      extracted-archive paths; never stores the full source archive in Git.
- [ ] Reject any metadata or archive input whose expected checksum, size, or
      identity does not match the accepted manifest.
- [ ] Map all 28 required targets to exact ontology IDs and OBJ file IDs. Require
      every present component's OBJ to exist and every selected OBJ header to
      agree with metadata.
- [ ] Generate a compact manifest containing source identity, target/component,
      ontology ID, representation ID, OBJ ID, file bytes, triangle count,
      bounds, checksum, and inclusion/exclusion reason.
- [ ] Confirm the five label-level gaps against the actual archive. If a missing
      label has a correctly mapped mesh under another term, update the evaluator
      and record the correction; never preserve 23/28 merely for continuity.
- [ ] Run focused tests twice and compare generated bytes.
- [ ] Commit the mapping module, tests, command, and manifest.

## Task 4: Prove a deterministic Blender-to-browser conversion

**Files:**

- Create: `scripts/assets/blender/convert.py`
- Create: `tests/unit/asset-conversion.test.ts`
- Create: `docs/licenses/bodyparts3d-conversion-manifest.json`
- Create conditionally: `assets/derived/bodyparts3d/sbla005-representative.glb`
- Create: `assets/derived/bodyparts3d/sbla005-poster.webp`
- Modify: `package.json`

- [ ] Write failing contract tests for pinned Blender version, explicit source
      manifest, deterministic coordinate normalization, separate named objects,
      material assignment, fixed LOD settings, fixed camera/light settings,
      checksums, bounds, and conversion timing.
- [ ] Verify Blender is available at an explicitly recorded version. If it is
      unavailable, install or acquire a pinned official build outside the
      repository; do not substitute an undocumented OBJ-only path.
- [ ] Implement the smallest deterministic Blender Python spike that imports all
      representative mapped OBJs, preserves one selectable object per mapped
      structure, normalizes origin/scale, assigns a neutral review material,
      creates reproducible LODs, exports GLB, and renders a fixed-camera poster.
- [ ] Run the conversion twice from clean output directories and require equal
      scene structure, mesh counts, bounds, and decoded geometry. Record file
      hashes; if Blender container metadata makes whole-file hashes vary, locate
      and document that nondeterminism rather than claiming byte identity.
- [ ] Validate every §8.4 manifest field: source mesh name, normalized entity ID,
      material, LOD, bounds, and checksum. Require 100% mapping for every
      selectable object included in the derived artifact.
- [ ] Measure the GLB and poster. The poster must be ≤200 KB. The GLB is judged
      against §12.2's ≤6 MB desktop target, 10 MB hard ceiling, and ≤3 MB mobile
      interactive target/fallback rule; 25 MiB is recorded only as the accepted
      host's per-file ceiling, never as a product performance target.
- [ ] Inspect the fixed artifact for holes, inverted normals, lost components,
      broken materials, occlusion, and unusable proportions. Store exact
      observed defects and screenshots/checksums needed to reproduce the visual
      judgment.
- [ ] Commit the conversion spike, tests, manifest, and only budget-compliant
      authorized derivatives.

## Task 5: Measure a complete representative browser scene

**Files:**

- Create: `tests/unit/asset-full-benchmark.test.ts`
- Create: `scripts/assets/full-benchmark.mjs`
- Create: `docs/licenses/bodyparts3d-performance.json`
- Modify: `package.json`

- [ ] Write failing tests that derive the representative scene from the Task 4
      optimized GLB plus conversion manifest and reject a missing, extra,
      duplicate, tampered, or source-OBJ substitute artifact.
- [ ] Define the scene as every distinct mapped OBJ needed to represent all
      available required target components, plus the accepted context rule; do
      not cherry-pick the fastest sample.
- [ ] Add pure measurement-record validation for source payload, transferred
      bytes, parsed vertices/triangles, draw calls, geometry buffer bytes,
      observed JS heap when available, WebGL identity, warmups, trials, frame
      samples, percentiles, and failure state.
- [ ] Build the browser harness around the Task 4 optimized GLB, serve it with
      no-store headers, checksum it before launch, cross-check its scene graph
      and geometry against the conversion manifest, and reject any mismatch.
- [ ] Freeze two performance profiles before measuring: native hardware-backed
      Chromium on the explicitly identified local reference laptop (record only
      model class, chip/GPU class, RAM, OS, browser, power state, viewport, and
      pixel ratio; never record serial or device identifiers), and a labeled
      low-power simulation using the product's reduced LOD plus documented CPU
      throttling and SwiftShader software rendering. Treat the latter only as a
      conservative fallback simulation, never as a physical low-tier device.
- [ ] Prove the native profile is hardware-backed from its unmasked renderer.
      If hardware-backed Chromium cannot run, or if the low-power profile cannot
      be reproduced, record the device-dependent measurement as unavailable and
      block `browser_performance` completeness rather than scoring from the
      SBLA-004 single-OBJ SwiftShader baseline.
- [ ] Record at least one warmup and five cold load/parse/upload trials, then 300
      animation frames after stabilization. Report median and p95 frame time;
      call `gl.finish()` where applicable.
- [ ] Measure deterministic geometry memory from buffer byte lengths. Record
      browser-reported JS heap only as an observed nonportable supplement and
      use `null` plus a reason when unavailable.
- [ ] Record payload against §12.2's ≤6 MB desktop target, 10 MB hard ceiling,
      and ≤3 MB mobile interactive target/fallback rule. Record 25 MiB separately
      as a host file ceiling. Score frame performance against the 55–60 fps
      target only from the native defined reference profile. Require the reduced
      low-power simulation to sustain the graceful 30 fps mode, and label that
      result as a simulation requiring later physical-device confirmation.
- [ ] Run the benchmark twice. Preserve both runs or their variance and explain
      any material difference.
- [ ] Add tests that recompute every aggregate from raw trials and frame samples.
- [ ] Commit the harness, tests, command, and measured record.

## Task 6: Record exercise-media and presentation feasibility

**Files:**

- Create: `docs/licenses/bodyparts3d-feasibility.json`
- Modify: `docs/licenses/anatomy-assets.md`
- Modify: `tests/unit/asset-spike.test.ts`

- [ ] Write failing tests requiring evidence for UV/material survival, topology
      defects, coordinate/origin consistency, skeleton/skin context, rig and
      animation support, deterministic stills, accessible fallback, derived-media
      rights, measured production throughput, poster/loop budgets, and
      male/female or inclusive presentation options.
- [ ] Inspect the deterministic optimized artifact and fixed-camera poster and
      record only observed facts. A missing rig, skin layer, UV, presentation,
      or other capability remains missing; do not infer it from labels.
- [ ] Prove that the accepted BodyParts3D terms permit the generated GLB, poster,
      and any later staged stills/loops, with the required attribution carried
      into each derived-media record.
- [ ] Measure conversion and render throughput from repeated clean runs and
      report meshes/minute, derived bytes/source bytes, and operator steps. Do
      not convert one successful run into an unsupported production forecast.
- [ ] Test the media modes §11.9 actually permits: a deterministic staged-still
      path and static joint-path/accessibility fallback must be feasible; record
      whether a short rigged loop is possible from the source. If BodyParts3D has
      no suitable rig, record loops as unsupported and require authored vector
      or staged diagrams rather than treating that as an unmeasured future item.
- [ ] Record the §11.9 poster target (≤200 KB), loop target (≤1.5 MB), loop hard
      ceiling (3 MB), and load-on-intent rule. If no accurate approved exercise
      checkpoints exist yet, explicitly block technique-accuracy approval until
      Claude Research defines them; measure tooling feasibility without inventing
      an anatomically approved movement.
- [ ] Distinguish source facts, direct measurements, and reviewer judgments in
      separate fields.
- [ ] Record screenshots only if they are deterministic and necessary for the
      visual score; otherwise record exact mesh-level checks and the limitation.
- [ ] Validate that every rubric score is traceable to evidence in the mapping,
      performance, feasibility, or accepted license record.
- [ ] Run focused tests and commit the feasibility record.

## Task 7: Populate and validate the weighted scorecard

**Files:**

- Modify: `docs/licenses/asset-candidates.json`
- Modify: `scripts/assets/scorecard.mjs`
- Modify: `scripts/assets/spike.mjs`
- Modify: `tests/unit/asset-spike.test.ts`

- [ ] Write failing tests that require all seven scores for every
      license-eligible acquired candidate and forbid technical scores or totals
      for ineligible candidates and the unacquired commercial placeholder.
- [ ] Populate BodyParts3D scores strictly from the frozen rubric and measured
      records. Do not score Z-Anatomy because its accepted license clarity is
      3/5. Preserve OpenStax's accepted 5/5 clarity while leaving all technical
      scores null because `selectionEligible: false` under its NonCommercial and
      AI-ingestion restrictions. Do not score Path A without an acquired asset.
- [ ] Compute the weighted total from validated scores and preserve the raw
      component scores, evidence references, and explicit failure risks.
- [ ] Make the command state that SBLA-005 measures and recommends only;
      SBLA-006 and the owner decide.
- [ ] Run adversarial mutations for altered weights, missing evidence, stale
      licenses, a score outside 0–5, a license score below 4, and a placeholder
      total; every mutation must fail closed.
- [ ] Run the focused suite and commit the measured scorecard.

## Task 8: Verify, document, and hand off

**Files:**

- Modify: `docs/licenses/anatomy-assets.md`
- Create: `reviews/releases/SBLA-005-handoff.md`
- Modify: `docs/runbooks/current-work.md`

- [ ] Write the handoff with exact accepted base, implementation candidate,
      branch/worktree, all created/modified paths, acquisition commands, source
      checksums, measurement environment, raw and aggregate results, scorecard,
      four carried Minor closures, and remaining SBLA-006 decisions.
- [ ] State whether BodyParts3D has any material coverage, mapping, visual,
      performance, license, pipeline, or presentation failure. Do not dilute a
      failed required capability with its weighted total.
- [ ] Run the pinned `pnpm verify`, `pnpm test:e2e`, representative benchmark,
      deterministic regeneration comparison, and `git diff --check`.
- [ ] Commit the implementation, then a separate immutable handoff candidate.
- [ ] Close the builder claim with exact commit IDs and command results.
- [ ] Create a clean reviewer worktree at the exact handoff candidate, pre-claim
      only `reviews/releases/SBLA-005-r1.md`, and dispatch one complete
      Account-B Claude Review. PASS requires zero Critical and zero Important
      findings.

## Stop conditions

- Do not purchase an asset or select the final path; SBLA-006 owns that gate.
- Do not commit the 62 MiB source archive or an unapproved large derivative.
- Do not score a candidate whose license clarity is below 4/5 or whose explicit
  `selectionEligible` decision is false for another accepted license reason.
- Do not invent a value when browser memory, source presentation, or another
  required measurement is unavailable; record `null`, the reason, and block the
  candidate's completeness.
- Do not proceed to independent review unless every §8.3 dimension is measured
  or the candidate is explicitly ineligible before technical scoring.
