# SBLA-009 research-companion integrity gate handoff

## Scope and identity

- Task: Codex hardening follow-up for the SBLA-009 evidence workflow
- Role: Codex
- Branch: `codex/SBLA-009-research-integrity-gate`
- Worktree: `C:\\src\\s009integrity`
- Base commit: `ff67c615d204a71f414370f4064969435d9bbc70`
- Implementation commit: `5c9481a59937cc805fe3bd00646d4260b23e6bfd`
- Date verified: 2026-09-14

## Problem

The existing schema and evidence-status checks validate individual artifacts, but they do not prove
that the four SBLA research companions agree with one another. The frozen SBLA-009 R1 candidate can
therefore pass the older repository gates while still containing incomplete acquisition histories,
contradictory access/basis claims, missing language values, and count or identifier drift between
screening, extraction, search, and packet records.

## Change

`scripts/evidence/research-integrity.mjs` adds a deterministic, offline, read-only companion gate. It:

- discovers complete task bundles from versioned search-receipt, screening-flow, source-extraction,
  and evidence-packet paths;
- fails partial bundles instead of silently skipping them;
- accepts `--root <repository>` and `--bundle <task-id>` for frozen-candidate and external-worktree
  probes;
- requires a structured `fieldContract.retrievalEventsDefault` when records omit explicit retrieval
  event counts;
- requires each acquisition-ladder attempt to be a structured
  `{step, attemptedAt, result}` object with a real ISO date and nonempty observations;
- requires lawful ladder evidence for every `awaiting-full-text` record and every included source
  whose access remains `abstract-only` or `metadata-only`;
- reconciles terminal-state, retrieval-event, exclusion-code, extraction-access, language,
  awaiting-full-text, included-source, search-count, and packet-source totals and identifier sets;
- rejects a reported fact whose `full-text` basis exceeds the source access recorded in screening or
  extraction; and
- emits stable issue codes, exact artifact paths, JSON paths, explanations, and remediation text.

`package.json` now runs this gate as `validate:research` within `pnpm verify`. The focused unit suite
uses a valid four-artifact fixture plus isolated one-defect mutations to prove every validation code,
deterministic ordering, non-mutation, selected-bundle operation, partial-bundle failure, missing-bundle
failure, and malformed-JSON failure. `docs/authoring/research-integrity-errors.md` defines the authoring
contract and every diagnostic.

The command intentionally performs no live literature search, access inference, schema migration, or
scientific adjudication. It validates recorded evidence and reconciliation only.

## Red-to-green evidence

Before implementation, the focused regression test failed because the checker module did not exist:

```text
pnpm vitest run tests/unit/research-integrity.test.ts
Test Files  1 failed (1)
Error: Failed to load url ../../scripts/evidence/research-integrity.mjs
```

After implementation:

```text
Test Files  1 passed (1)
Tests       7 passed (7)
```

## Frozen-candidate proof

The following external-worktree command was run from this branch against the clean immutable Account-A
candidate at `8cee805ce53289cec9d62336defce2a45d7b9da5`:

```powershell
node C:\src\s009integrity\scripts\evidence\research-integrity.mjs `
  --root C:\src\s009research --bundle SBLA-009
```

It exits `1` and reports exactly:

| Issue code                            | Count | Meaning in the frozen candidate                                     |
| ------------------------------------- | ----: | ------------------------------------------------------------------- |
| `ACQUISITION_LADDER_REQUIRED`         |    62 | 22 awaiting-full-text plus 40 included lower-access records         |
| `ACQUISITION_ATTEMPT_DATE_INVALID`    |    75 | opaque attempts without a real `attemptedAt` date                   |
| `ACQUISITION_ATTEMPT_RESULT_REQUIRED` |    75 | the same attempts lack a structured observed result                 |
| `FULL_TEXT_BASIS_EXCEEDS_ACCESS`      |     7 | reported facts claim full-text basis above recorded source access   |
| `LANGUAGE_REQUIRED`                   |     3 | extraction language is absent                                       |
| `RETRIEVAL_EVENTS_DEFAULT_MISSING`    |     1 | 1,789 omitted per-record values have no declared structured default |

This is a detection proof, not remediation. Claude Research account A owns corrections in the active
`claude-research/SBLA-009-r1-remediation` worktree. That candidate must make this exact command pass
before Account B receives the complete R2 evidence recheck.

## Verification

The final pre-handoff `pnpm verify` passed from implementation commit `5c9481a`:

- Prettier: pass
- ESLint: pass
- Astro/TypeScript: 57 files, 0 errors, 0 warnings, 0 hints
- Unit tests: 17 files, 245 tests passed
- Content validation: pass
- Graph validation: pass
- Research integrity: pass (`0 complete bundles checked` on this pre-evidence base)
- Evidence status: pass
- Static build: pass
- Portability: 3 files, 17 tests passed
- Foundation contract: pass
- Asset spike and decision gates: pass
- `git diff --check`: pass

The zero-bundle repository result is expected on base `ff67c61`: SBLA-009 evidence is still isolated on
its research branch. The frozen-candidate proof above exercises the real complete bundle through the
same CLI.

## Files and checksums at the implementation commit

| Path                                                    | Lines | SHA-256                                                            |
| ------------------------------------------------------- | ----: | ------------------------------------------------------------------ |
| `package.json`                                          |    59 | `3f5960aac3450c1433a5167a00229b9deef2f92a2baa7dcb4317496ac3fd51c0` |
| `scripts/evidence/research-integrity.mjs`               | 1,164 | `c8ff88d8d3d9942eb923300d4cd72ccc4aa4083ce459d2a724b9dfb45496ae9f` |
| `tests/unit/research-integrity.test.ts`                 |   220 | `de486013b99799e7d52ffa6549de24e24e5abb2c1447220a5683768611801370` |
| `tests/fixtures/research-integrity/valid-bundle.json`   |   166 | `48935ea3f2a3d6243bbd16cd1c51b4de3611b67ebd6280246fac1861c14020e5` |
| `tests/fixtures/research-integrity/invalid-bundle.json` |   207 | `2d24543af5733c1610016329a3deef3d8307c9de9c847b3f1c64eb6698b76b92` |
| `docs/authoring/research-integrity-errors.md`           |   139 | `6260d67ed540c31bdc726e6eb5940fcf5db35a30610d34dd3424fcb5f9f3ff2d` |

## Integration and remaining work

This branch is ready for an independent implementation review. After a PASS with zero Critical and
zero Important findings, Codex may integrate it into `main`. Integration does not make the current
SBLA-009 research candidate acceptable by itself: Account A must satisfy this gate on its final eleven
owned artifacts, all existing content and cross-link gates must also pass, and Account B must still
perform the single complete R2 scientific review.
