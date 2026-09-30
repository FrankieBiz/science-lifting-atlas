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
   [`docs/adr/0007-throughput-and-parallel-delivery.md`](docs/adr/0007-throughput-and-parallel-delivery.md)
   sets the current review tiers and delivery lanes.
2. `docs/runbooks/current-work.md` — who owns what right now.
3. `docs/runbooks/branch-and-worktree.md` — how to claim isolated work.
4. The approved handoff for the task your task depends on.

## Repository stage

The queue in master plan section 18 runs `SBLA-001` through `SBLA-020`.
`SBLA-001` through `SBLA-011` are accepted. From `SBLA-012` onward, work runs in
three parallel lanes, each in its own order:

| Lane     | Tasks, in order                      | Note                                                          |
| -------- | ------------------------------------ | ------------------------------------------------------------- |
| Product  | `SBLA-012` → `SBLA-016`              | Design system and page archetypes, then search and comparison |
| Evidence | `SBLA-017` → `SBLA-018` → `SBLA-019` | Catalog, then content waves; publishes with 2D anatomy plates |
| 3D       | `SBLA-013` → `SBLA-014` → `SBLA-015` | Optional enhancement; never blocks content publication        |

A task starts only when its section 18 dependencies are accepted. Do not skip
ahead within a lane, and do not silently combine a queue item with work another
task owns.

**Owner hold recorded 2026-09-17:** production Blender, glTF/media-pipeline,
anatomy-engine, and interactive 3D work in SBLA-013 through SBLA-015 must not
start until the human owner explicitly releases the hold in a new repository
decision. Continue SBLA-012's static archetypes, evidence journey, responsive
design, accessibility, and owner-directed static acceptance work. Do not lower the intended
3D quality target, substitute a rushed body asset, install Blender, or treat the
current evaluation render as production approval while the hold is active. See
`docs/product/design/SBLA-012-anatomy-production-hold.md`.

Foundation-stage validators intentionally reject content records until the
schema tasks that own them are complete. A validator that rejects your new file
is usually correct; confirm the owning task before changing the validator.

Body-part directory pages follow ADR 0010 and its plan; they are outside the
claim pipeline.

## Roles and write boundaries

| Role            | Owns                                                                | May write                      | Must never write                                                               |
| --------------- | ------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Codex           | Architecture, schemas, tooling, UI, tests, CI, release, integration | Anything in the repository     | —                                                                              |
| Claude Research | Research questions, extraction, synthesis, claim and page drafts    | `research/`, `content-drafts/` | Application code, schemas, published `content/`, CI, release state, `reviews/` |
| Claude Review   | Independent citation, UX, and release audits                        | `reviews/`                     | Everything else, including the artifact under review                           |

**Codex** names a role, not a vendor. The Codex role may be filled by Codex or
by a Claude Code session on an account that neither authored nor reviews the
artifact in question. Whichever session holds the role inherits every Codex
authority and restriction below.

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

## Review tiers

Review effort follows risk. See ADR 0007 D1–D3.

| Tier         | Scope                                                                                 | Independent review                                                                       |
| ------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| E — Evidence | Claims, citations, certainty, syntheses                                               | Every claim is independently reviewed. Rounds continue while science findings stay open. |
| P — Publish  | Code that decides what becomes public: gates, manifests, validators, claim components | One review per change set                                                                |
| B — Build    | UI, tooling, CI, docs, runbooks, asset pipeline                                       | Automated checks and builder self-check; reviewed at owner gates B, C, and E             |

There is no third review round outside the evidence tier. If Critical or
Important findings remain after the recheck, the owner decides in writing:
accept with recorded risk, narrow scope, or drop the item.

Lints are safety nets, not proofs. A new wording that slips past an automated
prose lint is a Minor finding with a fixture for the next change. It blocks only
when approved content actually exploits it.

Review reports lead with a findings table and target 1,500 words outside the
evidence tier.

## Evidence pipeline tiers

| Claim types                                                                                | Pipeline                                                                      |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `anatomy` and `function` claims at `established-descriptive-fact` certainty                | Two or more authoritative sources, exact locators, citation-entailment review |
| `exercise-mechanics`, `acute-response`, `safety-context`                                   | Saved targeted search, extraction, citation entailment, contradiction search  |
| `longitudinal-adaptation`, comparative claims, and any claim a practical takeaway rests on | Full master plan §9.8 pipeline                                                |

A claim contradicted during review moves to the full pipeline. Search and
screening records are kept once per wave and topic and reused across records.

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

- Builder tasks end in `reviews/releases/<task-id>-handoff.md`. Generate the
  commit, tree, changed-path, and check-result facts with
  `pnpm handoff <task-id> --base <commit>`; never copy hashes by hand.
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
| `pnpm handoff`          | Machine-generated handoff facts: base, commit, tree, changed paths, and real check results                     |

A required check that fails blocks the handoff. Record the real output; never
describe a check you did not run.

## Claude roles and environments

Claude Research and Claude Review each run as a repository-capable Claude Code
session in its own worktree, on distinct Claude Team accounts (Research on
account A, Review on account B). A same-account session never satisfies
independent review.

- Claude Research writes only `research/` and `content-drafts/`.
- Claude Review writes only its one pre-claimed, append-only report under
  `reviews/`.
- Neither role writes the ledger. The session holding the Codex role records
  the exact-path claim on the restricted role's behalf when it starts the task
  (Codex records the exact-path claim on every restricted-role task), so the
  owner never carries a claim between tools.
- Before handoff, run
  `node scripts/foundation/check-role-paths.mjs <role> --base <commit>`
  (Claude Review adds `--allowed-path <report>`).

Environment record, kept current here:

| Field                  | Claude Research                                          | Claude Review                                                          |
| ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Environment type       | Claude Code, repository worktree                         | Claude Code, repository worktree                                       |
| Git remote             | `origin` over the owner's authenticated HTTPS/SSH        | `origin` over the owner's authenticated HTTPS/SSH                      |
| Source-transfer method | Lawful sources fetched in-session; no uploads            | Same sources, fetched independently                                    |
| Allowed directories    | `research/`, `content-drafts/`                           | Exact `reviews/<discipline>/<task>-r<n>.md`                            |
| Readiness result       | PASS 2026-08-31 at `f2e0f005`; trusted boundary passed   | PASS 2026-08-31 at `555d6dd`; SBLA-002 R5 acceptance PASS at `9c53820` |
| Fallback               | Chat-only bundle per master plan §13.9, emergencies only | Chat-only bundle per master plan §13.9, emergencies only               |

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
