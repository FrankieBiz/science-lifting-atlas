# Claude environment readiness and file transfer

Master plan section 13.9 requires this record before **SBLA-008**. Do not assume
a Claude Team web account has repository, terminal, Git, or local full-text
access. This file records what has actually been demonstrated, not what is
assumed to work.

**Current gate status: NOT COMPLETE.** The Codex role is demonstrated. The two
Claude Team accounts have not been provisioned or tested. Authoritative master
plan §18 therefore blocks SBLA-002 acceptance now, and SBLA-008 also remains
blocked, until both roles pass the readiness test below or the chat-only
fallback is demonstrated end to end. See
[Outstanding owner action](#outstanding-owner-action).

## Environment record

| Field                  | Codex (technical lead)                                   | Claude Research (account A)    | Claude Review (account B)   |
| ---------------------- | -------------------------------------------------------- | ------------------------------ | --------------------------- |
| Environment type       | Repository-capable local shell with its own Git worktree | Not provisioned                | Not provisioned             |
| Git remote             | None configured; repository is local-only                | Not provisioned                | Not provisioned             |
| Credential method      | No remote credentials in use; nothing to expose          | Not provisioned                | Not provisioned             |
| Source-transfer method | Direct local filesystem access                           | Not provisioned                | Not provisioned             |
| Allowed directories    | Entire repository                                        | `research/`, `content-drafts/` | `reviews/`                  |
| Readiness result       | PASS (2026-08-30, see evidence below)                    | OUTSTANDING                    | OUTSTANDING                 |
| Fallback               | Not required                                             | Versioned bundle, see below    | Versioned bundle, see below |

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
  --repository <claude-review-worktree>
```

The checker requires a clean target worktree, resolves the hexadecimal base to
a Git commit, requires it to be an ancestor of the target `HEAD`, loads and
validates write boundaries from that trusted base rather than mutable `HEAD`,
derives every changed path from `<base>...HEAD`, canonicalizes each
repository-relative path, and exits non-zero when a role touches a path it does
not own. The caller cannot pass an incomplete path subset, self-authorize by
editing policy, or substitute a modified target-branch checker.

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

| Plan role                                           | Filled by                                 | Notes                                         |
| --------------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Codex — technical lead, integrator, merge authority | **ChatGPT Codex**                         | Authored the SBLA-002 r1/r2/r3 review reports |
| Claude Research — evidence lead (account A)         | **Claude Team account**                   | Writes only `research/`, `content-drafts/`    |
| Claude Review — independent auditor (account B)     | **Claude Team account, separate session** | Writes only `reviews/`                        |

## Runs are sequential, not parallel

The two Claude role runs are performed **one after another in independent
sessions**, not simultaneously. Nothing in master plan §13.9 requires
concurrency: it requires _independence_, which a separate session satisfies.

What independence actually requires, and what it does not:

- **Required:** the session performing a Claude Review audit must not be the
  session that authored the artifact under review. Independence is about _who
  judged the work_, not about wall-clock separation.
- **Required:** each role writes only within its own paths, enforced by
  `check-role-paths.mjs` run by Codex from a trusted checkout.
- **Not required:** the two runs happening at the same time, or the accounts
  existing simultaneously before either run may start.

Consequently the readiness gate is satisfied by two sequential runs, and
`Readiness result` in the environment record is filled in per role as each run
completes rather than only when both are done.

### Standing constraint on Claude Review

A Claude session that has acted in the Codex role — authoring SBLA-002, SBLA-003,
or SBLA-004 — **must not** serve as Claude Review for those tasks. Their
independent review belongs to ChatGPT Codex or to a Claude session with no
authorship of them. Record which session audited what, so this cannot be
violated by accident later.

## Outstanding owner action

SBLA-002 acceptance and SBLA-008 stay blocked until these are done and recorded
above:

1. Run the six-step readiness test for the **Claude Research** role in a Claude
   Team session, and record the date and result in the environment record table.
2. Run it separately for the **Claude Review** role in a different session,
   subject to the standing constraint above.
3. Decide each role's environment type: repository-capable or chat-only.
4. If chat-only, demonstrate the bundle fallback end to end at least once —
   bundle out, Markdown back, committed by Codex with checksums recorded.

Steps 1 and 2 may be done on different days. Neither blocks the other.
