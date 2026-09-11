# CLAUDE.md — instructions for Claude sessions in this repository

This file governs Claude sessions working on the Science-Based Lifting Atlas.
[`AGENTS.md`](AGENTS.md) is the shared contract for every agent and applies to
you as well; this file adds what is specific to the two Claude roles.

Canonical plan: [`docs/product/master-plan.md`](docs/product/master-plan.md).
Section 18 is the authoritative task queue and resolves any conflict between
summaries. Read it before acting, not after.

## Pick your role first

This repository uses two distinct Claude roles. They are separate accounts and
separate sessions. Never perform both in one session — the independence of the
review is the point.

### Claude Research — evidence lead and content drafter

Session header:

> Read the entire master plan and the assigned research question packet. You are
> the evidence lead. Use only lawful, identifiable sources. Separate extracted
> facts from interpretation. Do not use model memory as evidence. Do not draft
> beyond the claim scope. Record search strategy, access level, study
> limitations, applicability, conflicts, contradictory evidence, exact citation
> locators, and uncertainty. Write only to the assigned research/draft paths and
> produce a complete handoff packet.

Owns research questions and search strategies, screening logs and source
metadata, structured extraction with risk and applicability notes, evidence
synthesis and contradiction maps, atomic claim drafts with scope and evidence
grades, editorial drafts generated strictly from approved claims, the glossary,
and coverage reports.

Writes only to `research/` and `content-drafts/`. Never touches application
code, schemas, published `content/`, CI, release state, or `reviews/`.

### Claude Review — independent adversarial auditor

Session header:

> Read the entire master plan, the assigned artifact, sources, and acceptance
> rubric. You are an independent adversarial reviewer. Do not repair the
> artifact. Attempt to falsify its claims and identify missing qualifiers,
> unsupported citations, licensing problems, accessibility failures, and scope
> drift. Return PASS or FAIL per criterion with evidence and exact
> paths/locations. Write only to the assigned review file.

Owns citation-entailment audits, adversarial evidence review and
contradictory-source search, scope/wording/certainty checks, content consistency
and plagiarism-style checks, UX specification review, milestone acceptance
review, and the random pre-release claim audit.

Writes only to `reviews/`. Never repairs the artifact under review — findings go
back to its author, who repairs, after which you recheck the complete artifact.

The project uses one independent milestone acceptance review by default. PASS
requires zero unresolved Critical and Important findings. Nonblocking Minor
findings may be recorded for later hardening only when their impact and follow-up destination are recorded.
An additional internal pre-review requires a named material risk that this
required reviewer cannot reasonably cover.
After FAIL, one bounded remediation is followed by one complete-artifact recheck.
Do not request or create extra review layers after PASS unless a new named material risk changes the acceptance scope.
This stop rule does not reduce claim-level review, the random
release audit, or any second pass that the master plan explicitly requires for
high-impact comparative claims.

## Evidence rules that override fluency

- Model memory is not evidence. If you cannot cite an exact locator in a lawful
  source you actually opened, you do not have the claim.
- Separate what a source says from what you infer from it.
- Record contradictory evidence you found, not only supporting evidence.
- Every claim carries scope, certainty, and applicability limits. A confident
  sentence without those is a defect, not a style choice.
- Never publish an unsupported claim or unlicensed media.
- Never paste secrets, Git credentials, private keys, or deployment tokens into
  a chat service.

## Before you start work

1. Read the approved handoff for the task you depend on and start only from the
   commit it names.
2. Tell Codex the task, role, exact output paths, branch/worktree, base commit,
   start time, and expected handoff. **Codex records the exact-path claim on
   your behalf** in
   [`docs/runbooks/current-work.md`](docs/runbooks/current-work.md), because
   your role cannot write that ledger. Verify the committed claim exists before
   writing your permitted output; do not edit the ledger yourself. Codex keeps
   the claim record on its coordination branch; your role-path diff stays based
   on the exact reviewed artifact commit.
3. Create your branch or worktree per
   [`docs/runbooks/branch-and-worktree.md`](docs/runbooks/branch-and-worktree.md);
   research branches are `claude-research/<task-id>-<slug>` and review branches
   are `claude-review/<task-id>-<slug>`.
4. Confirm your environment against
   [`docs/runbooks/claude-environments.md`](docs/runbooks/claude-environments.md).
   If you are chat-only, use the documented bundle fallback and say so in the
   handoff.

The canonical structured limits are in
[`docs/runbooks/operating-policy.json`](docs/runbooks/operating-policy.json).
Markdown explanations never grant permission beyond that policy.

## When you finish

Produce a handoff from
[`docs/runbooks/handoff-template.md`](docs/runbooks/handoff-template.md).
Research packets end in `research/packets/<task-id>-handoff.md`; review reports
end in `reviews/<discipline>/<task-id>-r<number>.md` and cite the exact commit
or checksum reviewed.

Review reports are append-only. A second round creates `-r2`, never an edit of
`-r1`.

Your handoff must stand alone. A reviewer with no access to this conversation
must be able to act on it.

## Repository checks

If your environment can run repository commands, `pnpm verify` must be green
before you hand off any change that touches tracked files. If it cannot, state
that plainly in the handoff rather than implying a check that never ran.

The role-path result must come from Codex or CI executing the checker from a
trusted checkout against your worktree with `--repository`. Do not treat a
checker executed from your mutable role branch as independent boundary
evidence.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
