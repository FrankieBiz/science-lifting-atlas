# Handoff: SBLA-011 criterion-13 remediation after R2

## Objective

Close the sole Important finding in `reviews/releases/SBLA-011-r2.md`,
`I5-R2`, without changing scientific content or reopening any nonblocking
finding. The failed gate allowed a legitimately scoped universal quantifier to
license an unrelated universal in the same punctuation clause. The
owner-authorized scope also includes the equivalent causal-assertion boundary
inside the same certainty-language criterion.

## Inputs and exact paths

- Failed R2 candidate: `ebb1e41bc115e281255c72b3b7242ebc8096cc4d`,
  tree `79475730e53bc834ce98731a86f195316b43cf9f`.
- Governing R2 report commit:
  `462c4fb55c14e5618bac936f2e5a30abb487e887`.
- Owner authorization and exact-path claim: coordination commit
  `adeea3c` on `origin/codex/SBLA-007-review-coordination`, in
  `reviews/releases/SBLA-011-owner-authorization-r3.md` and
  `docs/runbooks/current-work.md`.
- Remediation branch: `codex/SBLA-011-r2-remediation`.
- Remediation worktree: `C:\src\s011fix2`.
- Implementation commit: `0a2bc3622f674ac9c9409e7c7933a86b3a61a5ee`.
- Implementation tree: `adb3d9e05acb2a81e35df2e5645101e4f4cb635b`.

## Constraints

- No record under `content/`, `content-drafts/`, or `research/` may change.
- No approval, publication-state, graph-data, source, grade, or wording edit is
  allowed.
- R2's five new Minor findings and all remaining R1 Minor findings are outside
  this authorization.
- Account A advised read-only; Codex alone implemented the patch; Account B
  remains the independent verdict role.
- The next review is a focused criterion-13 recheck authorized by the owner. It
  does not convert R2 to PASS by assertion.

## Work completed

`src/lib/content/validation.ts` now evaluates each certainty exception against
the universal token currently being adjudicated:

- before/after clause windows are derived from the current match index;
- sample exceptions require the noun after the current `every` to match the
  enumerated sample noun and do not cross an earlier universal;
- study, methodological-domain, tier, normalization, negation, and measurement
  exceptions require their defining syntax immediately around the current
  token;
- `all <count>` requires a real earlier enumeration with the same numeric
  value; and
- enumerated-study and multi-factor exceptions require the exact local syntax
  they are intended to protect.

The equivalent causal path is bounded at a new-assertion boundary. A
single-trial preamble or calibration hedge can still license coordinated
outcomes with the same grammatical subject, but cannot license a later causal
claim introduced with a new subject.

`tests/unit/content-validation.test.ts` adds paired controls for every
universal-exception family: each legitimate scoped phrase is clean alone and
the same phrase with a joined generic rider is rejected. It also adds the R2
period/semicolon controls, count mismatch and generic-factor attacks, causal
new-subject attacks, same-subject causal positive controls, and a 23-record
guard over every promoted `statement` and `plainLanguage` field.

## Decisions made

R2 Minor N1 recommended deleting eight branches described as serving no
promoted claim. The first implementation followed that guidance. Full graph
validation then failed closed on nine promoted qualifier fields, demonstrating
that the branches do serve the graph validator even though they serve none of
the 46 public statement/plain-language fields counted by R2. The branches were
therefore retained and token-anchored instead of weakening qualifier
validation. No qualifier text changed.

Account A's read-only attack found the same clause-laundering shape in the
single-trial and preceding-hedge causal exceptions. The owner authorization
expressly covers universal or causal-token scoping within criterion 13, so the
same patch bounds those exceptions at new grammatical assertions. Trailing
calibration and ascent/descent moment-arm branches already cap causal-token
counts and were left unchanged.

## Tests/checks run and results

- `pnpm vitest run tests/unit/content-validation.test.ts` — PASS, 65/65.
- `pnpm validate:graph` — PASS, deterministic 94 nodes and 120 edges.
- `pnpm evidence:status` — PASS, 68 sources checked as of 2026-09-16.
- Final `pnpm verify` — PASS:
  - Prettier, ESLint, and Astro check: 69 files, zero diagnostics;
  - unit tests: 20 files, 297/297;
  - promotion check: 94 production records;
  - content validation: 95 records;
  - MDX lint: pass;
  - graph: 94 nodes / 120 edges, byte-identical committed output;
  - research integrity: one complete bundle;
  - evidence status: 68 sources;
  - static build: one page;
  - portability: 17/17;
  - foundation and both asset gates: pass.
- `git diff --check` — PASS.
- `git diff -- public/data/evidence-graph.v1.json` — empty.

One intermediate check is deliberately recorded: the first `pnpm verify`
attempt, after deleting the eight N1 branches, FAILED at `validate:graph` with
nine `CERTAINTY_UNIVERSAL` qualifier issues. That strategy was not committed.
The final token-anchored implementation preserves qualifier validation and
passes the complete gate above.

## Known uncertainties

- Independent Account-B confirmation is still pending; this handoff is not a
  PASS verdict.
- The certainty lint remains a bounded natural-language heuristic rather than a
  general semantic parser. This patch addresses the exact R2 laundering
  mechanism and the same new-assertion mechanism on causal exceptions; it does
  not claim exhaustive linguistic proof.
- R1 and R2 Minor findings retain their recorded destinations and are not
  silently closed here.

## Files created or modified

- `src/lib/content/validation.ts`
- `tests/unit/content-validation.test.ts`
- `reviews/releases/SBLA-011-r2-remediation-handoff.md`

No other tracked path differs from R2 report commit
`462c4fb55c14e5618bac936f2e5a30abb487e887`.

## Required reviewer action

Claude Review account B must independently recheck criterion 13 against the
immutable handoff commit. At minimum:

1. replay all R2 section 3.7 joined, period, and semicolon probes;
2. verify each paired test rejects the joined rider rather than merely flagging
   the legitimate scoped portion;
3. attack every remaining exception with a fresh second universal token;
4. attack the single-trial and hedge exceptions with a fresh new-subject causal
   assertion, while confirming same-subject coordinated outcomes remain clean;
5. confirm all 23 promoted statements and plain-language fields remain clean,
   qualifiers still validate, and the graph bundle is unchanged; and
6. run the focused suite and full pinned `pnpm verify`.

The reviewer owns only a newly pre-claimed append-only report path and must not
repair this candidate.

## Acceptance criteria

1. Independent review returns zero Critical and zero Important findings for
   criterion 13.
2. Every R2 laundering example and fresh equivalent is rejected at the
   offending joined token, with the legitimate scoped control still clean.
3. All promoted claim fields and qualifier validation remain accepted without
   any content change.
4. `pnpm verify` passes on Node 24.20.0 and pnpm 11.24.0.
5. The candidate changes only the two implementation/test files and this
   handoff; `public/data/evidence-graph.v1.json` remains byte-identical.
