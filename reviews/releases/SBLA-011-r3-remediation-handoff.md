# Handoff: SBLA-011 final criterion-13 closure

## Objective

Close `I7-R3`, the sole Important finding in
`reviews/releases/SBLA-011-r3.md`, by binding the last two certainty-language
exceptions to the assertion they actually scope. This is the owner-authorized
final criterion-13 remediation for SBLA-011.

## Inputs and exact paths

- Failed R3 candidate: `f95cfaf0296332b02bb9df8a49128228a5a7d574`.
- Governing R3 report commit:
  `cf7efc5c8e15923e1d8b314785ce946716b68e9e`, tree
  `0e8b3c4ce2b586ffe996dfaec394181ff1aec8ae`.
- Owner authorization and claim: coordination commit `bf30496` on
  `origin/codex/SBLA-007-review-coordination`.
- Branch: `codex/SBLA-011-r3-remediation`.
- Worktree: `C:\src\s011fix3`.
- Implementation commit: `a0ee0ddd98186862d99d9591de7472e7d1cc8fd8`.
- Implementation tree: `bbd72d0431d7a4be51ccd41b9fbdec4cee0cd80c`.

## Constraints

Only the two `I7-R3` sites and their regression tests are in scope. No content,
qualifier wording, research, source, grade, approval, graph data, or publication
state may change. R3 Minors N6-R3 and N7-R3 remain assigned to SBLA-012. N8-R3
is not represented as closed by this patch. Account B remains the independent
verdict role and may not repair the candidate.

## Work completed

In `src/lib/content/validation.ts`:

1. The short negation-prefix exemption now locates the actual `not` span and
   calls the existing `crossesAssertionBoundary` helper before exempting the
   matched universal. A negation may still govern `all`, `always`, `every`, or
   `universally` directly, but cannot jump across `and`, `but`, `yet`, `so`, or
   the other recorded new-assertion boundaries.
2. The single-causal-token fallback no longer calls whole-clause
   `hasLowCalibration`. It locates the trailing calibration token and checks its
   position and assertion boundary relative to the causal token. The two
   previously supported trailing disclosures remain accepted: direct
   `according to limited evidence` and explicit `results may/might vary`.

`tests/unit/content-validation.test.ts` adds every R3 §4.1 and §4.2 attack,
including conjunction, comma, semicolon, and period forms; the three legitimate
negated-universal controls; and the existing legitimate trailing-calibration
controls remain green.

## Decisions made

The existing `crossesAssertionBoundary` primitive was reused rather than adding
another parser or exception vocabulary. For trailing `results may vary`, the
gate retains a narrowly named positive control because the generic boundary
detector correctly sees a grammatical new subject, while the complete phrase
is itself the disclosure that calibrates the preceding result. Other
new-subject hedges do not receive that exception.

The R3 Minors were not folded in. N8-R3 would require editing a third exception
site, contrary to the exact two-site authorization; N6-R3 and N7-R3 retain their
SBLA-012 destinations.

## Tests/checks run and results

- `pnpm vitest run tests/unit/content-validation.test.ts` — PASS, 85/85.
- `pnpm validate:graph` — PASS, 94 nodes / 120 edges.
- Final `pnpm verify` — PASS:
  - formatting, lint, and Astro: 69 files, zero diagnostics;
  - unit tests: 20 files, 317/317;
  - promotion: 94 production records;
  - content: 95 records;
  - MDX lint: pass;
  - graph: 94 nodes / 120 edges;
  - research integrity: one complete bundle;
  - evidence status: 68 sources;
  - static build: one page;
  - portability: 17/17;
  - foundation and asset gates: pass.
- `git diff --check` — PASS.
- `git diff -- public/data/evidence-graph.v1.json` — empty.

One intermediate focused run failed one existing positive control,
`Resistance training increases hypertrophy and results may vary by individual`,
because the calibration-position slice ended at `may`. The narrow positive
check was corrected to bind through `results may/might`; the final 85/85 and
317/317 results above are after that correction.

## Known uncertainties

- Independent Account-B R4 confirmation is pending; this handoff is not a PASS
  verdict.
- The certainty lint is intentionally a bounded heuristic, not a general
  semantic parser. R3 Minors N6-R3, N7-R3, and N8-R3 retain their recorded
  destinations and do not block this exact criterion-13 closure.

## Files created or modified

- `src/lib/content/validation.ts`
- `tests/unit/content-validation.test.ts`
- `reviews/releases/SBLA-011-r3-remediation-handoff.md`

No other tracked path differs from R3 report commit
`cf7efc5c8e15923e1d8b314785ce946716b68e9e`.

## Required reviewer action

Claude Review account B must perform the pre-claimed focused R4 recheck against
the immutable handoff commit. It must independently replay all R3 §4.1 and §4.2
attacks and punctuation controls, confirm the scoped halves remain clean,
confirm all 135 promoted texts still pass the same gated checks, run the focused
suite and full pinned `pnpm verify`, and confirm content/research/approval/graph
data are unchanged. The report must explicitly decide `I7-R3` and criterion 13.

## Acceptance criteria

1. R4 returns zero Critical and zero Important findings for criterion 13.
2. All 15 R3 residual statements are rejected while legitimate negation and
   trailing-calibration controls stay clean.
3. All 135 promoted fields and the production graph remain accepted without
   content changes.
4. Full pinned `pnpm verify` passes.
5. The candidate diff is exactly the two implementation/test files and this
   handoff.
