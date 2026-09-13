# SBLA-009 case-sensitive cross-link validation handoff

## Scope and identity

- Task: Codex hardening follow-up from `reviews/evidence/SBLA-009-r1.md`, finding I-1
- Role: Codex
- Branch: `codex/SBLA-009-cross-link-validation`
- Worktree: `C:\\src\\s009linkgate`
- Base commit: `303b23fb7e4a8794c9d83e64b5b3d4253006074f`
- Implementation commit: `8453b36236242ac940e572d210ea776909095442`
- Implementation tree: `2f45ba2301847c6d3a27923131229d34e793af72`
- Date: 2026-09-13

## Problem

The SBLA-009 R1 evidence candidate contains four structured `crossLinks.evidencePacket` values whose
letter casing differs from the tracked packet filename. Windows resolves those strings because NTFS is
case-insensitive, while the static Linux target does not. The existing validation gate therefore
returned success for references that would break after deployment.

The R1 report also identifies two wrong-case Markdown links. This gate deliberately covers structured
`crossLinks` fields; Claude Research still owns correction of all six artifact references during the
bounded R1 remediation.

## Change

`scripts/content/validate.mjs` now:

- scans JSON and YAML under `content/`, `content-drafts/`, `research/`, and `reviews/` for `crossLinks`
  objects without treating unpublished drafts as published records;
- accepts repository-relative targets with an optional `@<semantic-version>` suffix;
- rejects absolute, traversal, backslash, empty, and otherwise non-normalized targets;
- resolves each target one directory segment at a time and compares the recorded spelling with the
  real directory entry, so the result is independent of host filesystem case behavior;
- emits distinct actionable issues for a case mismatch, a missing target, and an invalid target; and
- handles nested `crossLinks` objects and cyclic parsed YAML object graphs without recursion loops.

`tests/unit/foundation-adapters.test.ts` adds subprocess coverage proving that the real
`validate:content` command rejects a differently cased target on Windows, accepts exact casing, finds a
nested missing target, and continues to keep draft records outside the production record schemas.

## Red-to-green evidence

Before implementation:

```text
pnpm vitest run tests/unit/foundation-adapters.test.ts
Test Files  1 failed (1)
Tests       1 failed | 10 passed (11)
AssertionError: promise resolved ... instead of rejecting
```

After implementation:

```text
pnpm vitest run tests/unit/foundation-adapters.test.ts
Test Files  1 passed (1)
Tests       11 passed (11)
```

The first full verification run caught a real TypeScript edge case (`split(...)[0]` could be
`undefined`). Codex fixed it with an explicit empty-string fallback, then reran typecheck, the focused
suite, and the complete gate. No failing implementation was committed.

## Frozen-candidate proof

Running the new validator from this branch against the immutable research worktree
`C:\\src\\s009research` at `8cee805ce53289cec9d62336defce2a45d7b9da5` reports exactly four
`CROSS_LINK_CASE_MISMATCH` issues:

1. `content-drafts/syntheses/SBLA-009-atomic-claims.json:crossLinks.evidencePacket`
2. `research/extractions/SBLA-009-source-extractions.json:crossLinks.evidencePacket`
3. `research/screening/SBLA-009-screening-flow.json:crossLinks.evidencePacket`
4. `research/searches/SBLA-009-search-receipts.json:crossLinks.evidencePacket`

Each message identifies the recorded uppercase target and the actual tracked lowercase target
`research/packets/sbla-009-evidence-packet.json`. The process exits successfully only because the
probe explicitly asserts that the four expected defects were found.

## Verification

The final pre-handoff `pnpm verify` passed:

- Prettier: pass
- ESLint: pass
- Astro/TypeScript: 55 files, 0 errors, 0 warnings, 0 hints
- Unit tests: 16 files, 238 tests passed
- Content validation: pass
- Graph validation: pass
- Evidence status: pass
- Static build: pass
- Portability: 3 files, 17 tests passed
- Foundation contract: pass
- Asset spike and decision gates: pass
- `git diff --check`: pass

## Files and checksums at the implementation commit

| Path                                     | Lines | SHA-256                                                            |
| ---------------------------------------- | ----: | ------------------------------------------------------------------ |
| `scripts/content/validate.mjs`           |   367 | `d1073cfb6735fb2fd14cf1ba6cf3c18c5b15eddd4f331ab4c180f4cd3aa928bb` |
| `tests/unit/foundation-adapters.test.ts` |   432 | `6822c2ce5aeb4ad381ce37ba1ef07456585add4c58dff0ced4618906b0b79a13` |

## Integration and remaining work

This change is ready for Codex to integrate into `main`. It prevents future structured cross-link
casing regressions but does not repair the frozen Account-A evidence candidate. Account A must still
fix the four structured values and both Markdown links in its claimed remediation worktree, after
which the gate must pass on that exact candidate and Account B must perform the single complete R2
evidence recheck.
