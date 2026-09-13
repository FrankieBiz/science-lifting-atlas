# SBLA-009 content-drafts validation handoff

**Role:** Codex  
**Base:** `8ca59e850beb0770554074d474a3ff3a9e16710a`  
**Branch:** `codex/SBLA-009-content-drafts-validation`  
**Worktree:** `C:\src\s009draftgate`

## Decision

`content-drafts/` is an authoring workspace, not a published structured-record
root. The content validator now scans only canonical structured records under
`content/` and `research/packets/`, plus structured review records under
`reviews/evidence/`. Draft Markdown and task-specific staging bundles remain
subject to formatting, Git, role-boundary, and later review/promotion gates, but
they are not forced through a production record schema before Codex splits and
promotes them.

This is the smallest change that allows the SBLA-009 outputs required by master
plan §18: muscle and exercise drafts plus an atomic-claim staging bundle. It does
not weaken validation for anything publishable under `content/`, for strict
evidence packets, or for structured review records.

## Regression proof

The new adapter test creates both a Markdown exercise draft and a JSON atomic
claim bundle under `content-drafts/` and requires the real validation subprocess
to report zero structured records.

- Red: the focused adapter suite failed 1 of 10 tests. The real command reported
  `RECORD_EXTENSION_UNSUPPORTED` for the Markdown draft and
  `RECORD_KIND_UNSUPPORTED` for the JSON staging bundle.
- Green: remove only `content-drafts` from `RECORD_ROOTS`; all canonical roots
  and their fail-closed checks remain unchanged.

## Verification required before integration

- `pnpm exec vitest run tests/unit/foundation-adapters.test.ts`
- `pnpm verify`
- `git diff --check`
- exact changed-path inspection against the base

After integration, the uncommitted Claude Research artifacts in
`C:\src\s009research` can be advanced to this commit without overlap because
they touch only their eleven separately claimed `research/` and
`content-drafts/` paths.
