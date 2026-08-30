# Current work ledger

Every agent claims its task and its exact paths here **before** editing, and
closes the claim when the handoff lands. This ledger is how a second session
discovers what is already owned without reading anyone's chat history.

Rules:

- Claim before you edit. One writer owns a file at a time.
- Record the exact branch, worktree, and **base commit** you started from.
- A claim is stale after **24 hours** with no handoff and no active session.
- **Codex is the only merge authority.** Only Codex may clear a stale claim, and
  only after checking the branch and worktree for unmerged changes and recording
  the recovery action below. Never delete unmerged work.
- Closing a claim requires a handoff path, not a promise.

## Active claims

| Task     | Role  | Branch                                 | Worktree                                    | Base commit                                | Started              | Expected handoff                       | Paths owned                                                                                                                                                                                                                                  |
| -------- | ----- | -------------------------------------- | ------------------------------------------- | ------------------------------------------ | -------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SBLA-002 | Codex | `codex/SBLA-002-agent-operating-model` | `.worktrees/sbla-002-agent-operating-model` | `141b63913b75791a6630303fdd1936fc615b3471` | 2026-08-30 11:40 EDT | `reviews/releases/SBLA-002-handoff.md` | `AGENTS.md`, `CLAUDE.md`, `docs/runbooks/**`, `scripts/foundation/operating-model.mjs`, `scripts/foundation/role-paths.mjs`, `scripts/foundation/verify.mjs`, `tests/unit/operating-model-contract.test.ts`, `tests/unit/role-paths.test.ts` |

SBLA-002 status: implementation complete and the handoff is delivered at
`reviews/releases/SBLA-002-handoff.md`. The claim stays open until independent
review completes and any repairs land, because ownership is not released at the
review gate. Its one open item is the un-provisioned Claude Team accounts
recorded in [`claude-environments.md`](claude-environments.md).

## Closed claims

| Task     | Role  | Branch                                 | Base commit                                | Closed     | Handoff                                | Result                                     |
| -------- | ----- | -------------------------------------- | ------------------------------------------ | ---------- | -------------------------------------- | ------------------------------------------ |
| SBLA-001 | Codex | `codex/SBLA-001-repository-foundation` | `399966fc1ccb0dbcdd8d4d3620e19b3d401e70bb` | 2026-08-29 | `reviews/releases/SBLA-001-handoff.md` | Accepted at `141b639` after Round 2 review |

## Recovery log

Record every stale-claim clearance and every unusual integration action here,
with what was checked and what was preserved.

| Date       | Action                                                                                                                                                                          | Checked                                                                            | Outcome                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 2026-08-30 | Repository relocated from `~/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas` to `~/dev/science-lifting-atlas`; `git worktree repair` run against the moved worktree | `git fsck` clean; all refs and reflogs intact; `pnpm verify` green at the new path | No work lost; original `.git` retained at the old path as a backup pending owner deletion |
| 2026-08-30 | `main` fast-forwarded `399966f` → `141b639` (accepted SBLA-001)                                                                                                                 | `main` confirmed a strict ancestor; fast-forward only                              | `codex/SBLA-001-repository-foundation` preserved, not deleted                             |
