# Handoff: SBLA-009 research-integrity gate R2 remediation

## Objective

Close the sole Important finding N-1 in the immutable Account-B R2 report:
require the exact query leg of packet-to-receipt reconciliation to exist on both
companions, rather than allowing two missing values to compare equal. This is
the one narrow bounded remediation required before the complete R3 recheck.

## Inputs and exact paths

- Failed R2 review commit: `015f0ecbf31791983919baad15f9c1f1934e5edf`
- Failed R2 review tree: `9a8b04be7d6cbeb5a46643cc6c19c8668dcd0ab9`
- R1 remediation handoff: `866028813f79be0c302e1c9ea3e394d42e9ca4fd`
- Branch: `codex/SBLA-009-integrity-gate-r2-remediation`
- Worktree: `C:\src\s009gate-fix2`
- Implementation commit: `84852282dd0b22db150092f8cb17506ab110534a`
- Implementation tree: `8b128686a2f6e0b9b4c9f2d25bd516815af6af29`
- Real Account-A candidate used for compatibility:
  `0880d5fbeedd57fb852469d447e9e441bd955d91`
- Frozen pre-remediation evidence candidate:
  `8cee805ce53289cec9d62336defce2a45d7b9da5`

## Constraints

This remediation may validate bookkeeping but may not edit or approve Account
A's scientific artifacts. It does not change the immutable R1 or R2 review
reports, relax an existing diagnostic, integrate a branch, or perform SBLA-010.
The review explicitly requested narrow N-1 scope.

## Work completed

- Added `SEARCH_QUERY_REQUIRED` at each receipt's exact
  `$.receipts[index].submittedQuery` path.
- Added `PACKET_SEARCH_QUERY_REQUIRED` at each packet search's exact
  `$.searches[index].query` path.
- Both checks require a nonempty string before the existing exact equality
  comparison runs. Missing, `null`, empty, array, or other non-string values
  therefore fail instead of satisfying the identity vacuously.
- Added one isolated invalid-fixture mutation for each stable code and a direct
  regression that deletes both fields from the same valid pair.
- Added both codes to the authoring error table.
- Folded in nonblocking N-2's one-line correction: the printed
  `FACT_BASIS_INVALID` remediation now names the valid `abstract` token as well
  as `abstract-only`, `full-text`, `metadata`, and `machine-translated`.

## Decisions made

- Enforced the query contract instead of deleting it from documentation. The
  master plan requires the full query, and all 51 real receipts and all 51
  packet searches already carry matching nonempty values.
- Used two stable codes because the two companion paths have different owners
  and remediation actions. The existing mismatch code remains responsible for
  unequal valid strings.
- Did not expand into N-3 through N-6 or deferred R1 Minors M-2 through M-5.
  Their impacts and destinations remain recorded in the append-only reports.

## Tests/checks run and results

Before implementation:

```text
pnpm exec vitest run tests/unit/research-integrity.test.ts
Test Files  1 failed (1)
Tests       2 failed | 9 passed (11)
```

The new direct regression received `[]`, and the code-coverage set equality
showed both stable codes absent from the implementation.

After implementation:

```text
pnpm exec vitest run tests/unit/research-integrity.test.ts
Test Files  1 passed (1)
Tests       11 passed (11)
```

External real-candidate check:

```text
node scripts/evidence/research-integrity.mjs --root C:\src\s009fix1 --bundle SBLA-009
Research integrity passed: 1 complete bundle checked (SBLA-009).
```

External frozen-candidate check still exits 1 with exactly 298 issues in the
same distribution documented by R2: 75 each missing acquisition step/date/result,
62 empty ladders, 7 full-text-basis access violations, 3 missing languages, and
1 missing retrieval-event default.

Final `pnpm verify` passes:

- Prettier and ESLint: pass
- Astro/TypeScript: 57 files, 0 errors, 0 warnings, 0 hints
- Unit tests: 17 files, 249 tests passed
- Content, graph, research-integrity, and evidence-status gates: pass
- Production build: pass
- Portability: 3 files, 17 tests passed
- Foundation, asset spike, and asset decision gates: pass
- `git diff --check`: pass

## Known uncertainties

The nonblocking findings remain exactly where R2 records them: basis-remediation
wording N-2 is closed here, while access coercion N-3, case-insensitive receipt
collision N-4, sibling/partial-root visibility N-5, incoherent secondary
full-text diagnostic N-6, and deferred R1 Minors remain future hardening. None
can make the current real candidate pass when N-1 evidence is absent, and none
is represented as resolved by this handoff.

## Files created or modified

| Path                                                                          |          Lines | SHA-256                                                            |
| ----------------------------------------------------------------------------- | -------------: | ------------------------------------------------------------------ |
| `scripts/evidence/research-integrity.mjs`                                     |          1,389 | `e4f1467b429a78c121bf979f7c34d515ca5b930cbd068d21ce2f96119c1cd9dd` |
| `tests/unit/research-integrity.test.ts`                                       |            373 | `71ce7100fdd487a57c0a80287e09c9fdd6e7ca7f600f014e7f646bad545df491` |
| `tests/fixtures/research-integrity/invalid-bundle.json`                       |            307 | `daf9272cc75ecc37d889783fc43056e4724cb97caf368df962e2cff896bdd1f0` |
| `docs/authoring/research-integrity-errors.md`                                 |            169 | `afdaed5e777077ad5fead167f1637039ab867fdada867ba3232f0613b683cbaa` |
| `reviews/releases/SBLA-009-research-integrity-gate-r2-remediation-handoff.md` | _this handoff_ | _committed with the final handoff commit_                          |

## Required reviewer action

Account B performs the one complete R3 implementation recheck at the final
handoff commit. Reproduce all R2 N-1 missing/null/empty/schema-drift probes,
confirm the two new exact-path diagnostics and N-2 wording, rerun the complete
prior artifact battery in proportion to risk, run focused and full verification,
and validate Account A candidate `0880d5f` externally. Write only
`reviews/releases/SBLA-009-research-integrity-gate-r3.md` and do not repair the
artifact under review.

Return PASS only with zero unresolved Critical and zero unresolved Important
findings.

## Acceptance criteria

- Every receipt has a nonempty `submittedQuery` or fails at its exact path.
- Every packet search has a nonempty `query` or fails at its exact path.
- Two mutually absent, null, empty, or renamed fields cannot pass.
- Unequal valid queries continue to fail the existing exact reconciliation.
- Account A's committed 51-by-51 real bundle passes unchanged.
- The frozen failed evidence candidate still fails with 298 issues.
- Focused tests, full `pnpm verify`, and committed-range whitespace checks pass.
- Account B returns R3 PASS with zero Critical and zero Important findings before
  integration.
