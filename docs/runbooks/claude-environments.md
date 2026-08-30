# Claude environment readiness and file transfer

Master plan section 13.9 requires this record before **SBLA-008**. Do not assume
a Claude Team web account has repository, terminal, Git, or local full-text
access. This file records what has actually been demonstrated, not what is
assumed to work.

**Current gate status: NOT COMPLETE.** The Codex role is demonstrated. The two
Claude Team accounts have not been provisioned or tested. SBLA-008 remains
blocked until both roles pass the readiness test below or the chat-only
fallback is demonstrated end to end. See [Outstanding owner action](#outstanding-owner-action).

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

Step 6 is executable. Run it against a role and a set of changed paths:

```bash
node scripts/foundation/check-role-paths.mjs claude-research research/questions/test.md
node scripts/foundation/check-role-paths.mjs claude-review reviews/evidence/test.md
```

The check exits non-zero when a role touches a path it does not own, so a
failed boundary is a build failure rather than a matter of opinion.

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

### Known environment limitation

`pnpm test:e2e` cannot run inside the sandboxed shell used by this session:
Chromium aborts at launch with
`bootstrap_check_in ... Permission denied` from
`mach_port_rendezvous_mac.cc`, because the sandbox denies Mach port
registration. This is an environment limitation, not a repository defect — the
Astro build and preview server start normally and the page's asserted content
was confirmed in the built output and in a real browser.

Run `pnpm test:e2e` in an unsandboxed shell or in CI, where it is already part
of the pipeline. Do not treat a sandboxed skip as a pass.

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

## Outstanding owner action

SBLA-008 stays blocked until these are done and recorded above:

1. Provision Claude Team account A (Research) and account B (Review) as separate
   accounts, so the review is genuinely independent.
2. Decide each account's environment type: repository-capable or chat-only.
3. Run the six-step readiness test for each account and record the date and
   result in the environment record table.
4. If chat-only, demonstrate the bundle fallback end to end at least once —
   bundle out, Markdown back, committed by Codex with checksums recorded.
