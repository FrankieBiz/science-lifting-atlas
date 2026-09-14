# Handoff: SBLA-009 research-integrity gate R1 remediation

## Objective

Close the five Important false-pass and execution defects in the independent
Account-B review at
`reviews/releases/SBLA-009-research-integrity-gate-r1.md`, plus the adjacent
missing acquisition-step check, without weakening any existing evidence rule or
adjudicating scientific content. This is the one bounded remediation required
by the repository stop rule before a complete R2 implementation recheck.

## Inputs and exact paths

- Failed review commit: `e514937e26031ab322c57be75f247aa381a6ab97`
- Failed review tree: `a7ad6b9310c02b260557d1abbd3a8fa9868662a8`
- Original implementation commit: `5c9481a59937cc805fe3bd00646d4260b23e6bfd`
- Remediation branch: `codex/SBLA-009-integrity-gate-r1-remediation`
- Remediation worktree: `C:\src\s009gate-fix1`
- Remediation implementation commit: `8f49f511adcbeaadbec2f76225254b94b01039db`
- Remediation implementation tree: `643c45fc9a785037bba872afa034603f89816bda`
- Account-A evidence candidate checked externally:
  `0880d5fbeedd57fb852469d447e9e441bd955d91`
- Frozen failed evidence candidate checked externally:
  `8cee805ce53289cec9d62336defce2a45d7b9da5`

The active claim owns exactly the validator, focused test, two fixtures,
authoring contract, and this handoff.

## Constraints

Codex may validate evidence bookkeeping but may not invent, repair, or approve a
scientific claim. This change does not edit Account A's eleven research and
draft artifacts, does not modify the immutable R1 report, and does not integrate
either candidate. Account B remains the independent implementation reviewer.
SBLA-010 remains the later complete scientific citation-entailment and
adversarial review.

## Work completed

The gate now:

- reconciles the sum of every receipt's `recordsRetrievedIntoScreening` against
  screening `recordsRetrieved`;
- reconciles every packet search to exactly one receipt using receipt identity,
  exact submitted query, execution date, and result count;
- accepts an explicit packet `receiptId` or the existing `receipt R-###` marker
  in its database description, preserving compatibility with the real packet;
- rejects screening and extraction access levels outside
  `full-text-open`, `full-text-limited`, `abstract-only`, and `metadata-only`;
- verifies those four access categories account for every included extraction;
- requires every extraction to carry an explicit `reportedFacts` array;
- validates each fact basis as a comma-delimited combination of `abstract`,
  `abstract-only`, `full-text`, `metadata`, and `machine-translated`, then keeps
  the existing full-text-versus-access enforcement;
- requires every acquisition attempt to include a nonempty `step` as well as
  the already enforced date and result;
- distinguishes a truthful empty evidence tree from a wrong root: all four
  companion directories may be empty, but a root containing none fails with
  `ROOT_INVALID`;
- rejects duplicate `--root` flags even when the first resolves to the current
  directory; and
- documents the working pinned-pnpm command as
  `pnpm validate:research --bundle SBLA-009`.

The focused fixture now includes packet search summaries linked to its two
receipts. Isolated mutations cover every new stable diagnostic, and direct CLI
tests cover invalid-root and duplicate-root behavior.

## Decisions made

- Implemented I-1 instead of weakening the original reconciliation claim. The
  real Account-A candidate already supplies all required identities and agrees
  across companions, so an actual four-artifact gate is both useful and
  satisfiable.
- Kept packet compatibility by reading the structured `receiptId` when present
  and the existing human-readable `receipt R-###` marker otherwise. Matching
  still requires exact query, date, and count equality.
- Treated `abstract` and `abstract-only` as distinct valid fact-basis tokens.
  The current remediation candidate honestly uses both; source access remains
  the separate closed four-value contract.
- Resolved Minor M-1 with the adjacent acquisition-contract work. M-2 through
  M-5 remain nonblocking as graded by R1; the new tests nevertheless replace
  the most consequential missing CLI and bypass coverage.
- Preserved truthful zero-bundle operation when the four expected directories
  exist. This repository needs that state before evidence is merged, while a
  typo or unrelated directory can no longer report PASS.

## Tests/checks run and results

Red regression run before implementation:

```text
pnpm exec vitest run tests/unit/research-integrity.test.ts
Test Files  1 failed (1)
Tests       4 failed | 6 passed (10)
```

The four failures demonstrated search reconciliation, packet reconciliation,
invalid-root, and duplicate-root bypasses. After the first implementation pass,
the suite correctly exposed a fixture inconsistency (`4` receipt imports versus
`5` screening retrievals); the fixture was corrected to describe the valid
state rather than weakening the check.

Final focused run:

```text
pnpm exec vitest run tests/unit/research-integrity.test.ts
Test Files  1 passed (1)
Tests       10 passed (10)
```

External validation of Account A's committed candidate:

```text
node scripts/evidence/research-integrity.mjs --root C:\src\s009fix1 --bundle SBLA-009
Research integrity passed: 1 complete bundle checked (SBLA-009).
```

The candidate has 51 receipts, 51 packet searches, and 2,343 receipt imports
equal to 2,343 screening retrieval events. The validator makes no claim that
those scientific records are correct; Account B must review that separately.

External validation of the frozen pre-remediation evidence candidate exits 1
with 298 issues: 75 each for missing acquisition step/date/result, 62 empty
ladders, 7 full-text-basis access violations, 3 missing languages, and 1 missing
retrieval-event default.

Final repository verification at implementation commit `8f49f51`:

```text
pnpm verify
```

- Prettier: pass
- ESLint: pass
- Astro/TypeScript: 57 files, 0 errors, 0 warnings, 0 hints
- Unit tests: 17 files, 248 tests passed
- Content validation: pass
- Graph validation: pass
- Research integrity: pass (`0 complete bundles checked` on this pre-evidence tree)
- Evidence status: pass
- Production build: pass
- Portability: 3 files, 17 tests passed
- Foundation contract, asset spike, and asset decision: pass
- `git diff --check`: pass

## Known uncertainties

- Packet receipt identity is still encoded inside the existing `database` prose
  when `receiptId` is absent. The gate supports a future explicit field, but
  migrating the scientific packet is Account A's authority, not this task's.
- The gate proves cross-artifact consistency, not whether a recorded API result,
  access outcome, source interpretation, or scientific conclusion is true.
- The nonblocking recursive-discovery, case-collision, empty-stem, primary-reason
  location, and degenerate-zero observations remain recorded in immutable R1.
  None is silently claimed as fixed here.

## Files created or modified

| Path                                                                          |          Lines | SHA-256                                                            |
| ----------------------------------------------------------------------------- | -------------: | ------------------------------------------------------------------ |
| `scripts/evidence/research-integrity.mjs`                                     |          1,365 | `90367899918e0046b886f8113f75d61f4c7781555bdaaff9a180e713d058a83c` |
| `tests/unit/research-integrity.test.ts`                                       |            337 | `a4fe1e4623b9a27a90f059a5bfdcb7efa9b599f5f177d7a19c63621cde3914ea` |
| `tests/fixtures/research-integrity/valid-bundle.json`                         |            182 | `ee2b8e578a1c0912575d21fa3e3bef0652f407d302e7d14f1cffe2663b9964c0` |
| `tests/fixtures/research-integrity/invalid-bundle.json`                       |            291 | `bf2e7dc3079707476f9cd583dfe0089e109a0846019cae950aed232896aee563` |
| `docs/authoring/research-integrity-errors.md`                                 |            167 | `327f938f7c9bd7edbc2550f705a725ca09825b8941a38b9b59bd7fa8bc43c129` |
| `reviews/releases/SBLA-009-research-integrity-gate-r1-remediation-handoff.md` | _this handoff_ | _committed with the final handoff commit_                          |

## Required reviewer action

Account B performs one complete R2 recheck from the final handoff commit. It
must reproduce every R1 Important probe, attempt new false-pass and false-fail
mutations around the implemented contracts, run focused and full verification,
confirm exact compatibility with Account A's `0880d5f` candidate, and write
only the append-only path
`reviews/releases/SBLA-009-research-integrity-gate-r2.md`.

Return PASS only with zero unresolved Critical and zero unresolved Important
findings. Do not repair the implementation during review.

## Acceptance criteria

- All five R1 Important findings are demonstrably closed.
- Minor M-1 is closed; remaining deferred Minors retain their recorded impact
  and destination.
- Every stable diagnostic is exercised by an isolated mutation with its exact
  artifact and JSON path.
- Wrong roots and duplicate root flags fail; a real empty repository evidence
  tree still passes truthfully.
- The corrected Account-A candidate passes this exact gate, while the frozen
  failed candidate still fails with its unresolved defects.
- `pnpm verify` passes on the immutable remediation candidate.
- Account B's complete R2 report returns PASS with zero Critical and zero
  Important findings before integration.
