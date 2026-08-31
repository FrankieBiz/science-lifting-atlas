# Current work ledger

Every agent claims its task and its exact paths here **before** editing, and
closes the claim when the handoff lands. This ledger is how a second session
discovers what is already owned without reading anyone's chat history.

Rules:

- Claim before you edit. One writer owns a file at a time. Codex records every
  restricted-role claim on that role's behalf because Claude Research and
  Claude Review cannot write this ledger.
- Record the exact branch, worktree, and **base commit** you started from.
- A claim is stale after **24 hours** with no handoff and no active session.
- **Codex is the only merge authority.** Only Codex may clear a stale claim, and
  only after checking the branch and worktree for unmerged changes and recording
  the recovery action below. Never delete unmerged work.
- A builder claim closes when its immutable handoff is committed. Independent
  review owns only its exact append-only report path, claimed by Codex before
  the reviewer writes. Codex closes that review claim when the immutable report
  is committed. A failed review creates a new bounded remediation claim; it
  never silently reopens the builder claim.

The canonical state machine and authorities are
[`operating-policy.json`](operating-policy.json). This ledger records instances
of that policy; prose cannot expand an agent's authority.

## Active claims

Every active claim records: Task, Role, Branch, Worktree, Base commit, Started,
Expected handoff, and Paths owned.

| Task                             | Role                      | Branch                             | Worktree                                      | Base commit                                | Started              | Expected handoff                                       | Paths owned                                            |
| -------------------------------- | ------------------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------------ | -------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| SBLA-002 Claude Review readiness | Claude Review (account B) | `claude-review/SBLA-002-readiness` | `.worktrees/sbla-002-claude-review-readiness` | `107c44504438398934d56755b51cff3437b7e0f9` | 2026-08-31 13:14 EDT | `reviews/releases/SBLA-002-claude-review-readiness.md` | `reviews/releases/SBLA-002-claude-review-readiness.md` |

## Closed claims

| Task                      | Role                        | Branch                                 | Base commit                                | Closed               | Handoff                                                          | Result                                                                                                                                                      |
| ------------------------- | --------------------------- | -------------------------------------- | ------------------------------------------ | -------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SBLA-001                  | Codex                       | `codex/SBLA-001-repository-foundation` | `399966fc1ccb0dbcdd8d4d3620e19b3d401e70bb` | 2026-08-29           | `reviews/releases/SBLA-001-handoff.md`                           | Implementation candidate `9ac1408`; acceptance-record/integration base `141b639`; accepted after Round 2 review                                             |
| SBLA-002 builder          | Codex                       | `codex/SBLA-002-agent-operating-model` | `141b63913b75791a6630303fdd1936fc615b3471` | 2026-08-30 12:58 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Candidate `af1b920`; Round 1 failed with four Important findings; bounded remediation opened at 13:23                                                       |
| SBLA-002 remediation      | Codex                       | `codex/SBLA-002-agent-operating-model` | `af1b920afef8614c5cfc58bb1ddedfbab9933bc3` | 2026-08-30 13:30 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Repair candidate `66299986a588eb44d64331844c9b0e561d363b61`; repository findings repaired; external §18 simulations remain                                  |
| SBLA-002 review R2        | Codex reviewer              | `codex/SBLA-002-agent-operating-model` | `c6f7d52358e12817a01fcdb528735a7cdf6cae5c` | 2026-08-30 15:50 EDT | `reviews/releases/SBLA-002-r2.md`                                | FAIL with four Important findings; report preserved. The exact-path claim was not recorded before dispatch; recovery is documented below.                   |
| SBLA-002 remediation R2   | Codex                       | `codex/SBLA-002-agent-operating-model` | `c6f7d52358e12817a01fcdb528735a7cdf6cae5c` | 2026-08-30 15:59 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Repair candidate `cb2ded3da5e9fb2336e471e78c2cef317f25f75f`; all three locally actionable Round 2 findings repaired; external §18 simulations remain.       |
| SBLA-002 coordination fix | Codex                       | `codex/SBLA-002-agent-operating-model` | `679e81762089b30684f1eb3436829dee58f66f72` | 2026-08-30 16:03 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Candidate `26376e9c07179443683f54dce071c19613529b77`; claim record isolated on Codex coordination branch; restricted diff stays based on reviewed artifact. |
| SBLA-002 review R3        | Independent Codex reviewer  | `codex/SBLA-002-independent-review-r3` | `3f05124895c974db2d159b75f08ed491ec148912` | 2026-08-30 16:14 EDT | `reviews/releases/SBLA-002-r3.md`                                | Report commit `fd3220565ece00a82c1b1267734a55d64db34287`; FAIL with mutable-HEAD-policy self-authorization and external Claude simulations open.            |
| SBLA-002 remediation R3   | Codex                       | `codex/SBLA-002-agent-operating-model` | `38335746bc80027fb81fd78531ea1b07417a686c` | 2026-08-30 16:19 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Repair candidate `a4b147b42eae7e5268f646f0362553c482dca51d`; trusted base policy/runner repairs green; external Claude simulations remain.                  |
| SBLA-002 role mapping     | Codex                       | `codex/SBLA-002-agent-operating-model` | `4acd27cc30261db1f177d0b4fe6523c938e12294` | 2026-08-31 12:11 EDT | `reviews/releases/SBLA-002-handoff.md`                           | Reconciliation candidate `09cd757eed8965b54704a676cb3ea993a481d775`; sequential timing accepted; distinct Claude Team accounts A/B preserved.               |
| SBLA-002 Research ready   | Claude Research (account A) | `claude-research/SBLA-002-readiness`   | `e22cdf3855c069e356659c513eab2600a7815a2c` | 2026-08-31 13:10 EDT | `research/packets/SBLA-002-claude-research-readiness-handoff.md` | Final role commit `f2e0f00543bdc923e0b436059598314c237f1f85`; trusted boundary passed for exactly three `research/` paths; integrated through `94cd82c`.    |

## Recovery log

Record every stale-claim clearance and every unusual integration action here,
with what was checked and what was preserved.

| Date       | Action                                                                                                                                                                          | Checked                                                                                                        | Outcome                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-30 | Repository relocated from `~/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas` to `~/dev/science-lifting-atlas`; `git worktree repair` run against the moved worktree | `git fsck` clean; all refs and reflogs intact; `pnpm verify` green at the new path                             | No work lost; original `.git` retained at the old path as a backup pending owner deletion                                                          |
| 2026-08-30 | `main` fast-forwarded `399966f` → `141b639` (accepted SBLA-001)                                                                                                                 | `main` confirmed a strict ancestor; fast-forward only                                                          | `codex/SBLA-001-repository-foundation` preserved, not deleted                                                                                      |
| 2026-08-30 | Round 2 reviewer was dispatched before an exact report-path claim was committed                                                                                                 | Reviewer wrote only `reviews/releases/SBLA-002-r2.md`; Git status and report scope checked                     | Report preserved; omission recorded rather than backdated; Codex-mediated pre-claim is mandatory from Round 3 onward                               |
| 2026-08-30 | Pre-review rehearsal found the claim commit would contaminate the restricted-role diff after the prior remediation claim was closed                                             | No reviewer had been dispatched; only six bounded policy/test/docs files had local edits                       | Opened this correction claim before committing; separate coordination and reviewer branches now make the role diff exact                           |
| 2026-08-31 | Claude committed role-mapping prose directly to the Codex SBLA-002 branch without a prior ledger claim                                                                          | Commit `4acd27c` changes only `docs/runbooks/claude-environments.md`; worktree and readiness branch were clean | Preserved the commit, opened a bounded Codex reconciliation claim, and required correction against master plan §§13.3–13.4 before readiness output |
