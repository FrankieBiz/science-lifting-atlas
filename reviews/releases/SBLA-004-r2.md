# SBLA-004 — Independent Claude Review, Round 2

## Review identity and scope

- Task: SBLA-004 — anatomy/exercise-media candidate license inventory,
  lawful sample files, and deterministic spike script.
- Round: 2, the complete-artifact acceptance recheck after one bounded
  remediation.
- Reviewer: Claude Review, Account B (BeyondLimitsCareFoundation / Dari).
- Reviewed candidate: `213af29cc4c6713d41f133fdbc8acbecb0a5ab15`.
- Candidate tree: `f65909c52d7220003d122ddf42b93f32ce02fbcf`.
- Accepted base: `78e21065793ef567889398b4f3e54d05df744662`.
- Reviewer branch: `claude-review/SBLA-004-r2`.
- Reviewer worktree: `.worktrees/sbla-004-claude-review-r2`.
- Review date: 2026-09-05.

Account B performed the review in the Claude desktop task titled
`SBLA-004 complete-artifact acceptance recheck`. The reviewer authored the
substance of this report in that task and made no repository changes. Claude's
sandbox denied writes beneath the repository and its scratch-file action
stalled, so Codex transcribed the completed response into this sole claimed
append-only path. No implementation was repaired during review.

## Verdict

**PASS — zero Critical findings and zero Important findings.**

All two Important findings and all five Minor findings from Round 1 are closed.
Four new Minor findings are nonblocking and have explicit SBLA-005 follow-up
destinations. The governing rule permits PASS only when zero Critical and zero
Important findings remain; that condition is met. The stop rule therefore
requires integration of this report and progression to SBLA-005, not another
review layer.

## Identity and execution boundary

The exact HEAD and tree matched the active Account-B claim, and the reviewer
worktree was clean at the start and end. Because the sandbox blocked repository
writes, executable checks ran under Node v24.20.0 and pnpm 11.24.0 in a
byte-identical scratch clone. The clone reported the same commit and tree, and
the tracked-file index hash matched the reviewer worktree.

`pnpm install --frozen-lockfile` passed. `pnpm verify` passed, including 78 unit
tests, 17 portability tests, the production build, the foundation verification,
and the deterministic asset spike. Three consecutive asset-spike runs produced
byte-identical output.

The reviewer could not launch Chromium for `pnpm test:e2e` or
`pnpm assets:benchmark`: macOS denied the Chromium Mach-port operation, the same
reviewer-sandbox limitation observed in Round 1. This is an environment
limitation, not an implementation failure. The recorded benchmark was instead
audited structurally and arithmetically, and the builder/CI browser checks must
be independently reconfirmed before final integration.

## Round 1 closure

### I-1 — placeholder score bypass: CLOSED

Adversarial and process-level probes confirmed that an unselected placeholder
must remain `acquired: false`, must have all scores null, can never be complete,
and can never receive a weighted total. Placeholder records carrying scores,
`acquired: true`, or both fail closed and the spike exits nonzero. The intended
unselected/unscored placeholder remains valid.

### I-2 — unsupported coverage conclusion: CLOSED

Account B independently downloaded all eight BodyParts3D metadata files from
the primary source. Every byte count, line count, and checksum matched the
manifest. The explicit 28-target evaluator reproduced 23 present and five
absent targets:

- latissimus dorsi;
- rectus abdominis;
- internal oblique;
- transversus abdominis;
- multifidus.

The three spinal-erector components — iliocostalis, longissimus, and spinalis —
are present, correcting the Round 1 terminology error. The five absences were
confirmed independently against the downloaded labels. The result remains
explicitly a label-level observation, not a mesh-level score.

### M-1 through M-5: CLOSED

- M-1: the coverage method is executable, versioned, and test-pinned rather
  than a prose-only scan.
- M-2: null, undefined, primitive, and malformed candidate entries report
  issues without crashing and make the process fail closed.
- M-3: the current CC BY 4.0 deed is linked alongside the preserved historical
  notice.
- M-4: the benchmark records the unmasked WebGL vendor and renderer. The run is
  identified as Google Inc. (Google), ANGLE Vulkan SwiftShader, so the timing is
  not presented as hardware-GPU performance.
- M-5: the handoff and ledger together provide the exact candidate, tree,
  Round 1 report, integration, remediation, branch, worktree, and report-path
  identity chain.

## Independent evidence checks

### License facts

Account B re-read the current primary sources for BodyParts3D, Z-Anatomy, and
OpenStax A&P 2e. The BodyParts3D page returned HTTP 200, identified CC BY 4.0,
permitted redistribution and derivative works with attribution, and matched the
recorded attribution string. Z-Anatomy's app license and separate model-license
document matched the recorded top-level, ShareAlike, and six component-license
facts, including the NonCommercial and unstated-license components; its 3/5
clarity score and `selectionEligible: false` conclusion are justified. OpenStax
confirmed CC BY-NC-SA 4.0 and the recorded LLM-use and image-attribution text.
Path A remains a deliberately unacquired and unscored placeholder.

### Sample legality and provenance

The current BodyParts3D terms permit repository distribution of part or whole
with attribution. The unchanged sample retains its historical notice, and its
license file carries both notices and the attribution and warranty language.

The official 64,888,505-byte archive was independently downloaded. Its SHA-256
matched
`9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`.
`partof_BP3D_4.0_obj_99/FJ1446.obj` appeared exactly once; the fresh extraction
was byte-identical to the checked-in 105,005-byte sample with SHA-256
`964ab8e287e7f44f14b07d8c7694ec70eee63bc9d7b1eeb3c5dc79e80460336d`.
Both independent counting and the project parser reproduced 1,019 vertices,
1,019 normals, zero texture coordinates, 1,536 faces, and 1,536 triangles.
Ontology metadata independently corroborated concept FMA45874, file FJ1446,
and representation BP6970. A one-byte mutation was rejected by the checksum
guard.

### Benchmark and scorecard

The recorded medians recompute correctly from all five measured trials: 1.0 ms
fetch, 1.3 ms parse, 2.0 ms upload-and-draw, and 5.1 ms total. Every trial is
internally additive. The protocol validates size and checksum, serves locally
with no-store headers, discards one warmup, cross-checks browser and Node
geometry counts, waits for `gl.finish()`, and reports medians. The record
explicitly says this single 1,536-triangle SwiftShader run is acquisition proof
and a repeatability baseline, not the SBLA-005 whole-atlas performance score.

All seven §8.3 score labels and weights match and sum to 100. The license clarity
floor remains 4/5 and is pinned independently in tests. No technical score is
populated in SBLA-004, no weighted total is awarded, and no asset is selected or
purchased.

### Accepted gates and scope

The accepted `pnpm verify` chain is preserved verbatim with only the asset spike
appended. Portability and foundation gates were neither weakened nor reordered,
and no toolchain or CI configuration changed. The remediation touched exactly
the 13 claimed paths and left the Round 1 report immutable. The artifact does
not overreach into SBLA-005 selection or SBLA-006 acquisition.

## New findings

### Critical

None.

### Important

None.

### N-1 (Minor) — candidate completeness ignores license issues

`scripts/assets/scorecard.mjs` computes per-candidate `complete` and
`weightedTotal` without including `licenceIssues`. The overall evaluator still
folds those issues into the run, prints the failures, and exits 1, so the gate
cannot pass incorrectly. The defect is the misleading per-candidate object and
summary line once SBLA-005 begins populating real scores. The handoff's claim
that every incompletely licensed record is refused also needs one clause for
the valid unselected-placeholder exception.

Follow-up: in SBLA-005, require `licenceIssues.length === 0` for completeness,
add a regression case, and clarify the placeholder exception in the successor
handoff.

### N-2 (Minor) — display lines key on status, not outcome

`scripts/assets/spike.mjs` can print a reassuring per-candidate line for a
placeholder carrying scores, a malformed null item, or an unlicensed fully
scored record, before the run correctly prints the issue and exits 1. The gate
is fail-closed; the remaining impact is operator-diagnostic noise.

Follow-up: in SBLA-005, key display output on whether a total was actually
computed and on the malformed result state.

### N-3 (Minor) — compound-target coverage rule is inconsistent

Eight compound targets require all named components, but deltoid regions,
trapezius regions, and triceps-brachii heads currently pass on a bare parent
substring. Synthetic labels for a deltoid bone landmark, ligament, or vessel
can therefore create a false positive. This does not change the present 23/28
result: the primary BodyParts3D metadata genuinely contains all three deltoid
regions, all three trapezius parts, and all three triceps heads.

Follow-up: before SBLA-005 assigns `coverage_naming`, give these three targets
explicit component groups (or document why a parent label is sufficient) and
pin the rule in `tests/unit/asset-coverage.test.ts`.

### N-4 (Minor) — the benchmark test does not recompute recorded medians

The benchmark unit test pins sample identity, geometry, protocol, trial count,
and renderer fields but does not derive `mediansMs` from the recorded trials.
The current values were independently recomputed and are correct; the risk is a
future hand-edited or stale SBLA-005 record.

Follow-up: in SBLA-005, assert the exported median calculation against all four
recorded metric arrays.

## Acceptance summary

| Dimension                                          | Result                         |
| -------------------------------------------------- | ------------------------------ |
| Exact candidate and tree                           | PASS                           |
| Round 1 I-1 and I-2                                | CLOSED                         |
| Round 1 M-1 through M-5                            | CLOSED                         |
| Malformed and placeholder behavior                 | PASS, fail-closed              |
| 28-target result                                   | PASS, 23 present / 5 absent    |
| Current license facts and lawful sample            | PASS                           |
| Archive/sample provenance and tamper guard         | PASS                           |
| Scorecard weights and license floor                | PASS                           |
| Recorded benchmark evidence                        | PASS on all non-browser checks |
| Accepted verification and portability gates        | PASS                           |
| Browser E2E and live benchmark in reviewer sandbox | NOT RUN — sandbox denial       |
| Critical / Important / Minor                       | 0 / 0 / 4                      |

## Required next step

Integrate this report, independently reconfirm `pnpm test:e2e` and
`pnpm assets:benchmark` on the Codex host where Chromium launches, close the R2
claim, accept SBLA-004, and proceed to SBLA-005. Carry N-1 through N-4 forward,
confirm the five coverage gaps at mesh level, and reverify license facts by
2026-11-30. Do not add another SBLA-004 review layer.

## Overall verdict

**PASS.** Zero Critical findings and zero Important findings remain. SBLA-004
is accepted at candidate `213af29cc4c6713d41f133fdbc8acbecb0a5ab15`, tree
`f65909c52d7220003d122ddf42b93f32ce02fbcf`, subject only to Codex's independent
reconfirmation of the two browser commands that Account B's sandbox could not
launch.
