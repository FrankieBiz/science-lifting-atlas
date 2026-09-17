# AGENTS.md — repository operating contract

This file is the repository-local operating contract for every agent that works
here. It is binding for all roles. Where this file and
[`docs/product/master-plan.md`](docs/product/master-plan.md) disagree, the master
plan wins and this file must be corrected in the same change.

[`docs/runbooks/operating-policy.json`](docs/runbooks/operating-policy.json) is
the canonical machine-readable authority, lifecycle, and write-boundary policy.
The prose in this file and the runbooks explains that policy but cannot expand
or override it. `pnpm verify` rejects a structured policy that differs from the
master-plan contract.

Read before doing anything:

1. `docs/product/master-plan.md` — canonical product, evidence, and execution
   plan. Section 18 is the authoritative task queue.
2. `docs/runbooks/current-work.md` — who owns what right now.
3. `docs/runbooks/branch-and-worktree.md` — how to claim isolated work.
4. The approved handoff for the task your task depends on.

## Repository stage

The queue in master plan section 18 runs `SBLA-001` through `SBLA-020`. Work the
queue in order. Do not skip ahead, and do not silently combine a queue item with
later architecture, licensing, evidence-schema, anatomy, or homepage work.

**Owner hold recorded 2026-09-17:** production Blender, glTF/media-pipeline,
anatomy-engine, and interactive 3D work in SBLA-013 through SBLA-015 must not
start until the human owner explicitly releases the hold in a new repository
decision. Continue SBLA-012's static archetypes, evidence journey, responsive
design, accessibility, and formative usability work. Do not lower the intended
3D quality target, substitute a rushed body asset, install Blender, or treat the
current evaluation render as production approval while the hold is active. See
`docs/product/design/SBLA-012-anatomy-production-hold.md`.

Foundation-stage validators intentionally reject content records until the
schema tasks that own them are complete. A validator that rejects your new file
is usually correct; confirm the owning task before changing the validator.

## Roles and write boundaries

| Role            | Owns                                                                | May write                      | Must never write                                                               |
| --------------- | ------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Codex           | Architecture, schemas, tooling, UI, tests, CI, release, integration | Anything in the repository     | —                                                                              |
| Claude Research | Research questions, extraction, synthesis, claim and page drafts    | `research/`, `content-drafts/` | Application code, schemas, published `content/`, CI, release state, `reviews/` |
| Claude Review   | Independent citation, UX, and release audits                        | `reviews/`                     | Everything else, including the artifact under review                           |

Three rules follow from that table and are not negotiable:

- Codex is the only role that promotes a draft into published `content/`.
- Claude Review never repairs what it audits. Findings go back to the author.
- Claude Research and Claude Review never edit the same artifact.

Codex additionally must not invent or approve a scientific claim, weaken a
failed evidence gate to make a build pass, silently rewrite an extraction, or
merge concurrent edits without reading the diff.

## Task lifecycle

1. Claim the task and its exact paths in `docs/runbooks/current-work.md`.
2. Create the task branch and worktree from the reviewed base commit named in
   the dependency's approved handoff. See
   [`docs/runbooks/branch-and-worktree.md`](docs/runbooks/branch-and-worktree.md).
3. Write the test before the behavior whenever behavior changes.
4. Run the required checks and record the real results.
5. Write the handoff from
   [`docs/runbooks/handoff-template.md`](docs/runbooks/handoff-template.md).
6. Stop at the review gate. Do not self-accept.

## Review stop rule and progress reporting

One independent acceptance review is the default for each milestone. Builder
self-checks and automated verification happen before that review. An additional
internal pre-review is allowed only when the handoff names a material risk that
the required reviewer cannot reasonably cover. A candidate passes when it has
zero unresolved Critical and Important findings. Nonblocking Minor findings may
be recorded for follow-up only when their impact and follow-up destination are recorded.
After a failed review, open one bounded remediation, then recheck the complete artifact once.
Do not add review layers after PASS unless a new named material risk changes the acceptance scope.

Report progress through accepted queue gates, demonstrated user journeys,
current shippable capability, blockers, and the next proof. Do not report an
overall product-completion percentage before SBLA-017 records observed vertical-
slice throughput and the owner approves the revised estimate.

Handoff destinations:

- Builder tasks end in `reviews/releases/<task-id>-handoff.md`.
- Evidence tasks end in `research/packets/<task-id>-handoff.md`.
- Review reports are append-only at `reviews/<discipline>/<task-id>-r<number>.md`
  and cite the exact commit reviewed. A new round never overwrites an old one.

No handoff may depend on chat context. The repository artifact must be enough.

## Command contract

These names are stable. Tasks may change what runs underneath them; nothing may
rename or remove them.

| Command                 | Purpose                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm verify`           | Format, lint, type-check, unit tests, content/graph/evidence validation, production build, repository contract |
| `pnpm test:e2e`         | End-to-end journeys against the production build                                                               |
| `pnpm test:a11y`        | Automated accessibility matrix                                                                                 |
| `pnpm test:visual`      | Deterministic visual snapshots                                                                                 |
| `pnpm test:performance` | Bundle and asset budgets                                                                                       |
| `pnpm evidence:status`  | Source identifier, retraction, and freshness checks                                                            |

A required check that fails blocks the handoff. Record the real output; never
describe a check you did not run.

## Runtime

Node.js and pnpm are pinned exactly. Confirm before running anything:

```bash
node --version   # must print v24.20.0
pnpm --version   # must print 11.24.0
pnpm install --frozen-lockfile
```

The host default Node.js may be newer than the repository engine. Use the pinned
runtime, not the default.

## Editing rules

- One writer owns a file at a time.
- Inspect `git status` and existing diffs before editing.
- Never discard another agent's work.
- If two outputs conflict, write a decision note with evidence. Do not blend
  them silently.
- Every milestone ends with a clean, tested commit and its required independent
  reviewer report.

## Publication guardrails

Never publish an unsupported scientific claim, unlicensed media, or a production
evidence record that has not passed its gate. Never paste secrets, Git
credentials, private keys, or deployment tokens into a chat service.
