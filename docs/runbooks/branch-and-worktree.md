# Branch and worktree runbook

Isolated work per task, from a reviewed base, with no shared checkout. This
runbook is the operational form of master plan section 13.7.

## Naming

Branches are named by role and task:

- `codex/<task-id>-<slug>`
- `claude-research/<task-id>-<slug>`
- `claude-review/<task-id>-<slug>`

The task ID is the queue ID (`SBLA-002`, `SBLA-007`, …). The slug is short,
lowercase, and hyphenated. One branch per queue item; do not reuse a branch for
a later task.

Worktrees live under `.worktrees/<task-id-lowercased>-<slug>/` and are ignored
by Git.

## Starting a task

Start from the reviewed base commit named in the approved handoff of the task
you depend on — not from whatever `main` happens to be.

```bash
git fetch --all                      # only if a remote is configured
git log --oneline -1 <base-commit>   # confirm the base you were given
git worktree add .worktrees/<task-id-lowercased>-<slug> \
  -b <role>/<task-id>-<slug> <base-commit>
```

Then claim the task in
[`current-work.md`](current-work.md) before you edit anything, and install with
the pinned runtime:

```bash
node --version   # must print v24.20.0
pnpm --version   # must print 11.24.0
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` must be green on the untouched base before you start. If it is
not, stop and report — you have inherited a broken base, not created one.

### Restricted Claude-role claims

Claude Research and Claude Review cannot edit the ledger. Before either role
writes, it sends Codex the task, role, exact output paths, branch/worktree, base
commit, start time, and expected handoff. Codex records the claim in
[`current-work.md`](current-work.md) and commits it. The restricted role verifies
that committed claim on the Codex coordination branch, then writes only within
the structured policy boundary. Its separate role branch stays based on the
exact reviewed artifact commit, so the Codex-authored ledger change is outside
the restricted role's diff.

Codex or CI runs the path gate from a trusted checkout, targeting the restricted
worktree explicitly:

```bash
node <trusted-checkout>/scripts/foundation/check-role-paths.mjs \
  <claude-research-or-claude-review> \
  --base <reviewed-artifact-commit> \
  --repository <restricted-role-worktree>
```

The trusted checker loads `operating-policy.json` from the exact base commit and
rejects a target diff that edits the checker, the policy, or any other
out-of-boundary path. Running a possibly edited checker from the target branch
is not acceptance evidence.

For independent review, **Codex records the exact append-only report path**
before dispatch. The review claim owns no builder file. When the report becomes
an immutable commit, Codex records closure. If the report fails, Codex opens a
separate bounded remediation claim; the closed builder and review claims do not
reopen.

## Finishing a task

A builder claim closes when its immutable handoff is committed.

1. `pnpm verify` green, plus any other gates the queue row requires.
2. Working tree clean; every intended file committed.
3. Handoff written from [`handoff-template.md`](handoff-template.md).
4. Ledger entry closed in [`current-work.md`](current-work.md).
5. Stop at the review gate. Do not merge your own task.

Review owns only its append-only report path and does not keep the builder's
files locked. If a report fails, Codex opens a new remediation claim naming the
failed candidate as its base and the exact repair paths. A pending review is a
status, not an ownership lock.

The canonical authority, lifecycle, and boundary values are in
[`operating-policy.json`](operating-policy.json). This runbook is explanatory
and cannot grant a role permissions absent from that structured policy.

## Integration

**Codex is the only merge authority.** Research and review roles never merge,
never rebase another role's branch, and never force-push.

Integrate only a reviewed commit, and prefer a fast-forward so the reviewed
commit ID survives:

```bash
git switch main
git merge --ff-only <role>/<task-id>-<slug>
```

Preserve the task branch after merging. Never delete or discard a branch that
holds reviewed work without explicit owner confirmation.

## Removing a worktree

Remove the worktree, keep the branch:

```bash
git worktree remove .worktrees/<task-id-lowercased>-<slug>
git worktree list
```

If a worktree directory was moved or deleted outside Git, repair the links
rather than re-cloning:

```bash
git worktree repair <path-to-worktree>
git worktree prune
```

## Stale ownership

A ledger claim is stale after 24 hours with no handoff and no active session.
Only Codex may clear one, and only after checking the branch and worktree for
unmerged changes and recording the recovery action in the ledger. Never delete
unmerged work.

## Rules that do not bend

- One writer owns a file at a time.
- Inspect `git status` and existing diffs before editing.
- Never discard another agent's changes.
- Review reports are append-only; a new round is a new `-r<number>` file.
- If two outputs conflict, write a decision note with evidence rather than
  blending them.
