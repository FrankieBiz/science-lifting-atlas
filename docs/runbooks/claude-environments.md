# Claude environment readiness and file transfer

Master plan section 13.9 requires this record before **SBLA-008**. Do not assume
a Claude Team web account has repository, terminal, Git, or local full-text
access. This file records what has actually been demonstrated, not what is
assumed to work.

**Current readiness status: COMPLETE.** Codex, Claude Research account A, and
distinct Claude Review account B have all completed the repository-capable
readiness test. **SBLA-002 acceptance status: PASS.** Round 5 independently
confirmed that both Round 4 Important findings are repaired; Codex then passed
the trusted exact-path boundary and pinned verification gates. Two Minor
findings remain recorded and do not block acceptance.

**Claude Builder status: CONFIGURED; first-task proof pending.** ADR 0007 adds
the Account-A implementation role after the original readiness exercise. It
uses the same repository-capable Claude Code environment already demonstrated
by account A, but its first assigned task must additionally prove the new
multi-path exact-claim gate before that task can be accepted.

## Environment record

| Field                  | Codex (technical lead)                                   | Claude Research (account A)                                          | Claude Review (account B)                                                                                                          |
| ---------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Environment type       | Repository-capable local shell with its own Git worktree | Claude desktop Code session with its own local Git worktree          | Claude desktop Code session with its own local Git worktree                                                                        |
| Git remote             | None configured; repository is local-only                | None configured; repository is local-only                            | None configured; repository is local-only                                                                                          |
| Credential method      | No remote credentials in use; nothing to expose          | No remote credentials used or exposed                                | No remote credentials used or exposed                                                                                              |
| Source-transfer method | Direct local filesystem access                           | Direct local filesystem plus an assigned inline CC0 fixture          | Direct local filesystem plus the assigned inline CC0 fixture used to audit the Research extraction                                 |
| Allowed directories    | Entire repository                                        | `research/`, `content-drafts/`                                       | `reviews/`, narrowed by the gate to the one exact claimed new report path                                                          |
| Readiness result       | PASS (2026-08-30, see evidence below)                    | PASS (2026-08-31, `f2e0f005`; trusted boundary passed, see evidence) | PASS (2026-08-31, `555d6dd`; R4 readiness passed); R5 acceptance PASS (`9c53820`; trusted boundary and pinned verification passed) |
| Fallback               | Not required                                             | Not required                                                         | Not required; the versioned bundle fallback remains documented but undemonstrated because it was not used                          |

## Readiness test

Each account must complete every step and the result must be recorded in the
table above with a date.

1. Read the master plan and a test task packet.
2. Read the assigned repository paths at the reviewed base commit.
3. Create a file in its permitted path, produce a diff, and write a handoff
   packet from `handoff-template.md`.
4. For repository-capable use, create the correctly named branch and commit
   without touching a prohibited path.
5. For evidence work, open one lawful test source and produce a
   locator-backed extraction.
6. Pass a path-boundary check that rejects edits outside the role's allowed
   directories.

Step 6 is executable. Codex or CI runs the script from a trusted checkout
against the role's complete committed diff from the reviewed base. The
restricted role does not establish its own boundary evidence from mutable code:

```bash
node <trusted-checkout>/scripts/foundation/check-role-paths.mjs \
  claude-research --base <reviewed-base-sha> \
  --repository <claude-research-worktree>
node <trusted-checkout>/scripts/foundation/check-role-paths.mjs \
  claude-review --base <reviewed-base-sha> \
  --repository <claude-review-worktree> \
  --allowed-path <exact-claimed-new-review-report-path>
```

The checker requires a clean target worktree, resolves the hexadecimal base to
a Git commit, requires it to be an ancestor of the target `HEAD`, loads and
validates write boundaries from that trusted base rather than mutable `HEAD`,
derives every changed path from `<base>...HEAD`, canonicalizes each
repository-relative path, and exits non-zero when a role touches a path it does
not own. The caller cannot pass an incomplete path subset, self-authorize by
editing policy, or substitute a modified target-branch checker. Claude Review
must also name exactly one Codex-recorded `--allowed-path`; its complete diff
must add that one regular file and may not modify, delete, rename, or add any
other path. Restricted-role symlinks and Git links are rejected by mode.

## Codex readiness evidence (2026-08-30)

Demonstrated in the SBLA-002 session at base commit
`141b63913b75791a6630303fdd1936fc615b3471`:

- Read the master plan and every SBLA-001 review artifact from the repository.
- Created branch `codex/SBLA-002-agent-operating-model` in its own worktree from
  the reviewed base commit.
- Created files in permitted paths and produced a reviewable diff.
- Ran the pinned runtime (Node.js `24.20.0`, pnpm `11.24.0`) and a frozen
  install.
- Ran `pnpm verify`, `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance` green.
- Produced this handoff-backed record with no reliance on chat context.

### Environment-specific browser evidence

The original SBLA-002 builder sandbox could not launch Chromium because its
sandbox denied Mach-port registration. That result remains a truthful
limitation of that environment, not Claude readiness evidence. During Round 1
remediation on 2026-08-30, Codex
cleared the builder's orphaned preview process and ran the canonical
`pnpm test:e2e` command with the pinned runtime: one Chromium test passed with
JavaScript disabled.

Each future account still records its own actual command capability. One
environment's successful browser run must not be copied into another account's
readiness result.

## Claude Research readiness evidence (2026-08-31)

Demonstrated by Claude Team account A on branch
`claude-research/SBLA-002-readiness`, starting from the Codex-assigned corrected
base `e22cdf3855c069e356659c513eab2600a7815a2c`:

- Read the master plan, operating contract, runbooks, prior review history, and
  the task packet from the repository.
- Verified the exact-path claim committed by Codex at `77a750f` before writing.
- Created only the three claimed files under `research/`, including a standalone
  handoff and a seven-fact extraction in which every fact has an exact `[L#]`
  locator into the assigned lawful CC0 fixture.
- Kept extracted facts separate from interpretation and recorded limitations,
  applicability, conflicts, contradictory-evidence scope, and uncertainty.
- Committed the final role-owned state as
  `f2e0f00543bdc923e0b436059598314c237f1f85` and left the worktree clean.
- Ran the pinned Node.js `24.20.0` / pnpm `11.24.0` `pnpm verify` gate green: 7
  test files and 42 tests passed, the build completed, and the foundation
  contract passed.
- Codex independently ran `check-role-paths.mjs` from its trusted checkout
  against the complete `e22cdf3...f2e0f00` diff. The gate passed for exactly
  three added `research/` paths; Codex then integrated the role commits through
  coordination commit `94cd82c`.

The durable handoff is
`research/packets/SBLA-002-claude-research-readiness-handoff.md`. This simulation
proves environment and operating-model plumbing only; none of its fixture
content may be promoted to `content/` or used as lifting evidence.

## Claude Review readiness evidence (2026-08-31)

Demonstrated by distinct Claude Team account B on branch
`claude-review/SBLA-002-readiness`, starting from reviewed artifact commit
`107c44504438398934d56755b51cff3437b7e0f9`:

- Read the master plan, complete SBLA-002 candidate, prior review history,
  Research artifacts, exact Codex claim, and the assigned synthetic source.
- Created and committed only `reviews/releases/SBLA-002-r4.md` as
  `555d6dd0a406ca50af94ee887c071640bc5ef17b`, then left the worktree clean.
- Ran Node.js `24.20.0` / pnpm `11.24.0` `pnpm verify` green. Codex independently
  reran the same pinned gate green: 7 test files, 42 tests, build, and foundation
  contract all passed on the reviewed candidate.
- Codex ran the trusted boundary checker against the complete
  `107c4450...555d6dd` diff. It passed for exactly one added review report.
- The readiness simulation passed, while the substantive Round 4 verdict was
  **FAIL** with two Important candidate findings. Readiness and acceptance are
  separate results; the latter requires remediation and a new review round.

The immutable review is `reviews/releases/SBLA-002-r4.md`. Account B did not
author SBLA-002, SBLA-003, SBLA-004, or the account-A readiness artifacts.

## Claude Review Round 5 acceptance evidence (2026-08-31)

Distinct Claude Team account B audited candidate
`0636754db244f0d628edc7acb22d99291c8b5135` in a new session on branch
`claude-review/SBLA-002-r5`, under the exact Codex claim recorded at
`4defd73832881e1d857fd64857d7bf526de0dc7c`:

- The reviewer rechecked every Round 4 finding and returned PASS on all ten
  criteria, with no Critical or Important finding.
- Seventeen throwaway-repository probes rejected prior-report edits, artifact
  edits, extra paths, symlinks, Git links, policy tampering, checker replacement,
  and argument abuse as specified.
- The reviewer ran `pnpm verify` on a Git export whose tree hash matched the
  candidate exactly: Node.js `24.20.0`, pnpm `11.24.0`, 7 test files and 47
  tests, 30 checked files with zero errors, one built page, and the foundation
  contract all passed.
- The reviewer-authored report is `reviews/releases/SBLA-002-r5.md`, committed
  as `9c538209bef0f13204090d7203e173e5091316e1`. Because the account-B Bash
  sandbox could not write the external worktree, Codex placed the delivered
  37,711-byte report there byte-for-byte (SHA-256
  `c974e5d838fdd02892ad1a2ae1ddacc06e5fc75fb5ca1d1b150d34e9f0cd96a2`) before
  committing; this fallback is recorded in the ledger.
- Codex independently confirmed the clean one-file `A` diff with regular mode
  `100644`, ran the trusted checker with the exact `--allowed-path`, and reran
  pinned `pnpm verify` successfully before acceptance.

Round 5 recorded two nonblocking Minor findings: stale completion tense in this
environment record, repaired by this acceptance record, and the carried
account-A wording issue from R4-M-3. The latter remains outside Codex ownership
and does not affect source entailment or SBLA-002 acceptance.

## Preferred environment

Each Claude role runs in a repository-capable environment with its own worktree,
least-privilege Git credentials, and access only to the task's lawful source
directory. Production deployment credentials and unrelated full-text sources are
never exposed to either account.

## Chat-only fallback

If an account cannot reach the repository:

1. Codex creates a versioned task bundle containing the master plan, the
   relevant schemas, the assigned artifacts, source metadata, and only those
   full-text files whose license and access terms — and the owner's
   authorization — permit upload to that service.
2. The owner uploads the bundle and downloads Claude's returned Markdown/YAML.
3. Codex places the returned files into permitted draft or review paths, records
   their original checksums, validates them as untrusted input, and commits them.

Constraints that are not negotiable:

- If restricted full text cannot lawfully be uploaded, that account may not
  review claims that depend on it. Use a repository or local environment with
  lawful access, or narrow or exclude the claim.
- Never paste secrets, Git credentials, private keys, or deployment tokens into
  a chat service.
- Returned files are untrusted input until validated.

Bundles are written to `research/source-transfer-bundles/`, which is ignored by
Git so restricted material is never committed.

## Role-to-tool mapping (owner-confirmed 2026-08-31)

Master plan §13 names three roles but does not dictate which product fills each
one. The owner's actual toolchain is:

| Plan role                                           | Filled by                          | Notes                                                                         |
| --------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| Codex — technical lead, integrator, merge authority | **ChatGPT Codex**                  | Implements, assigns bounded packages, verifies, and integrates                |
| Claude Builder — implementation partner (account A) | **Claude Team account A**          | Implements only exact Codex-claimed paths; never reviews or merges            |
| Claude Research — evidence lead (account A)         | **Claude Team account A**          | Writes only `research/`, `content-drafts/`                                    |
| Claude Review — independent auditor (account B)     | **Distinct Claude Team account B** | Uses a separate account and session; writes one exact report under `reviews/` |

## Concurrent use with distinct accounts, profiles, and worktrees

Claude Code supports isolated state directories through `CLAUDE_CONFIG_DIR`.
Authenticate each Team account once into a different directory, then launch
each from its own terminal and Git worktree. The two processes may run at the
same time; they do not share credentials, settings, history, or worktree state.

```powershell
$env:CLAUDE_CONFIG_DIR = '<profile-directory-for-account-A>'
claude

# In a second PowerShell process and a different Git worktree:
$env:CLAUDE_CONFIG_DIR = '<profile-directory-for-account-B>'
claude
```

Account A may also run more than one Builder/Research chat, but all Account-A
chats consume the same account quota. Every live session needs its own worktree
and a disjoint exact claim. Account B can run concurrently as reviewer only
after the candidate is immutable; it must not access or repair an in-progress
artifact it will later accept.

What independence actually requires, and what it does not:

- **Required:** Claude Builder/Research runs in account A and Claude Review runs
  in distinct account B, each in its own profile and session.
- **Required:** the account/session performing a Claude Review audit must not
  have authored the artifact under review. Independence is about _who judged
  the work_, not about wall-clock separation.
- **Required:** each role writes only within its own paths, enforced by
  `check-role-paths.mjs` run by Codex from a trusted checkout.
- **Not sufficient:** opening two sessions under one Claude Team account.
- **Allowed, not required:** both accounts being logged in and running
  simultaneously from separate profile directories and worktrees.

Consequently the identity gate is satisfied whether the runs are sequential or
concurrent, provided they use distinct accounts A and B and preserve authorship
independence. `Readiness result` is filled in per role as each run completes.

### Standing constraint on Claude Review

A Claude account or session that acted as an author — including by making
Codex-owned changes to SBLA-002, SBLA-003, or SBLA-004 — **must not** serve as
Claude Review for those artifacts. Internal ChatGPT Codex review may catch
defects but does not replace the authoritative Claude Review gate. Record which
account/session authored and audited each artifact so this cannot be violated
by accident later.

## SBLA-002 acceptance result

The owner-side environment decision is complete: both Claude roles are
repository-capable, and the normal readiness fallback was not needed. Codex
repaired the two Important Round 4 findings and distinct account B passed the
fresh append-only Round 5 audit with no unresolved blocking finding. The trusted
boundary and pinned verification gates also passed, so SBLA-002 is accepted and
no longer blocks its dependants in the ordered queue.
