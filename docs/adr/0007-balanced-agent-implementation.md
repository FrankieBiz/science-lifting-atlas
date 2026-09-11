# ADR 0007 — Balanced Codex and Claude implementation

- Status: Accepted
- Date: 2026-09-11
- Task: PLAN-002
- Supersedes: the implementation ownership limits in master plan §13.2–13.3

## Context

The original operating model reserved repository implementation for Codex and
limited Claude Team account A to research and content drafts. In practice,
account A is also strong at implementation, while the project benefits from
using both paid systems without losing continuity or independent acceptance.
The owner explicitly authorized a stronger implementation role for account A.

Unbounded shared writes would create collisions and make it difficult to prove
who authored or reviewed an artifact. Using account B as both author and
reviewer would invalidate the intended independent gate.

## Decision

Add a Claude Builder role filled by Claude Team account A. Codex remains the
technical lead, repository maintainer, only merge authority, stale-claim
authority, content-promotion authority, and release integrator. Either Codex or
Claude Builder may implement substantial code, schema, tooling, test, refactor,
and implementation-documentation packages.

Claude Builder is deny-by-default. Before it writes, Codex commits an exact list
of claimed files to the coordination ledger. A trusted checkout verifies the
complete branch diff against that list. Builder claims cannot include published
`content/`, `reviews/`, or `docs/runbooks/current-work.md`. Account A may run
multiple Builder or Research sessions concurrently only in separate worktrees
with disjoint claims.

Account B remains the independent Claude Review role. It does not
implement or repair the artifact it audits. No account-B session may review its
own output. Every builder stops at the review gate; only Codex integrates a
passing candidate.

## Consequences

Account A can now contribute directly to implementation instead of being
underused, and Codex can concentrate more effort on architecture, decomposition,
integration, verification, and difficult cross-cutting work. Exact claims and
separate worktrees permit useful concurrency without silent file collisions.

The additional role adds claim and worktree administration. Account A's Builder
and Research sessions share that Claude account's usage pool, so concurrency
increases throughput but does not create extra quota. Account B is intentionally
kept out of implementation when it is the acceptance reviewer.

## Alternatives considered

- Keep implementation Codex-only: rejected because it unnecessarily neglects
  account A's implementation strength and paid capacity.
- Give account A unrestricted repository access: rejected because concurrent
  sessions could collide and provenance would be weak.
- Let account B implement between reviews: rejected because authorship would
  make later Account-B acceptance ambiguous or invalid.
- Use Account A only for advisory code pasted back by Codex: rejected because it
  loses executable verification, commit provenance, and clean handoffs.

## Reversal cost

Low. Stop issuing Claude Builder claims and remove the role in a superseding
ADR. Existing branches and handoffs remain ordinary Git history; product data
and runtime architecture are unchanged.
