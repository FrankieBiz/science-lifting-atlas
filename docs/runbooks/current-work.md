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
- A builder claim closes when its immutable handoff is committed. Independent
  review is non-owning outside its exact append-only report path. A failed review
  creates a new bounded remediation claim; it never silently reopens the builder
  claim.

## Active claims

Every active claim records: Task, Role, Branch, Worktree, Base commit, Started,
Expected handoff, and Paths owned.

None. SBLA-002 is awaiting the two external Claude-role readiness simulations
required by authoritative §18; no repository path is locked while that external
gate is pending.

## Closed claims

| Task                 | Role  | Branch                                 | Base commit                                | Closed               | Handoff                                | Result                                                                                                                     |
| -------------------- | ----- | -------------------------------------- | ------------------------------------------ | -------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| SBLA-001             | Codex | `codex/SBLA-001-repository-foundation` | `399966fc1ccb0dbcdd8d4d3620e19b3d401e70bb` | 2026-08-29           | `reviews/releases/SBLA-001-handoff.md` | Implementation candidate `9ac1408`; acceptance-record/integration base `141b639`; accepted after Round 2 review            |
| SBLA-002 builder     | Codex | `codex/SBLA-002-agent-operating-model` | `141b63913b75791a6630303fdd1936fc615b3471` | 2026-08-30 12:58 EDT | `reviews/releases/SBLA-002-handoff.md` | Candidate `af1b920`; Round 1 failed with four Important findings; bounded remediation opened at 13:23                      |
| SBLA-002 remediation | Codex | `codex/SBLA-002-agent-operating-model` | `af1b920afef8614c5cfc58bb1ddedfbab9933bc3` | 2026-08-30 13:30 EDT | `reviews/releases/SBLA-002-handoff.md` | Repair candidate `66299986a588eb44d64331844c9b0e561d363b61`; repository findings repaired; external §18 simulations remain |

## Recovery log

Record every stale-claim clearance and every unusual integration action here,
with what was checked and what was preserved.

| Date       | Action                                                                                                                                                                          | Checked                                                                            | Outcome                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 2026-08-30 | Repository relocated from `~/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas` to `~/dev/science-lifting-atlas`; `git worktree repair` run against the moved worktree | `git fsck` clean; all refs and reflogs intact; `pnpm verify` green at the new path | No work lost; original `.git` retained at the old path as a backup pending owner deletion |
| 2026-08-30 | `main` fast-forwarded `399966f` → `141b639` (accepted SBLA-001)                                                                                                                 | `main` confirmed a strict ancestor; fast-forward only                              | `codex/SBLA-001-repository-foundation` preserved, not deleted                             |
