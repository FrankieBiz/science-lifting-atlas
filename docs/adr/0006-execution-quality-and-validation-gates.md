# ADR 0006 — Execution quality and validation gates

- Status: Proposed
- Date: 2026-09-05
- Task: PLAN-001
- Supersedes: none

## Context

SBLA-001 through SBLA-003 established the repository, operating model, and
architecture. The project has 3 of 20 accepted queue gates but has not yet
demonstrated its central user journey. SBLA-003 also showed that overlapping
pre-reviews and acceptance reviews can add coordination work after the required
quality threshold is already met.

The project needs a review policy that preserves independent scrutiny without
mistaking review volume for product progress, plus a progress model that does
not convert unequal queue items into a misleading completion percentage.

## Decision

Adopt the execution-quality design in
[`2026-09-05-execution-quality-correction-design.md`](../superpowers/specs/2026-09-05-execution-quality-correction-design.md):

- builder self-checks, automated gates, and one independent acceptance review
  are the default milestone quality layers;
- PASS requires zero unresolved Critical and Important findings;
- nonblocking Minor findings may be recorded for later hardening;
- an extra pre-review requires a named material risk;
- FAIL opens one bounded remediation followed by one full-artifact recheck;
- progress is reported as accepted capabilities and user-journey proof, not one
  overall percentage before SBLA-017 observes throughput; and
- SBLA-012 adds a 3–5 participant formative usability check for
  find/understand/verify/share tasks before owner direction approval.

## Consequences

Review cycles become bounded and easier to audit. The independent gate remains,
but internal review is risk-triggered rather than habitual. Project updates are
more honest about the gap between foundation work and user value. SBLA-012 gains
a small coordination cost in exchange for detecting costly UX mistakes before
3D production.

The policy does not reduce claim-level review, final release audit, owner
approval, or any mandatory scientific, licensing, accessibility, performance,
and resilience gate.

## Alternatives considered

- Preserve layered review as the default: rejected because it increases cycle
  time without defining a stronger pass threshold.
- Remove independent milestone review: rejected because automated checks cannot
  judge all evidence, licensing, UX, and scope risks.
- Report `accepted tasks / 20` as overall completion: rejected because queue
  items are not equal in scope or delivered user value.
- Defer user testing to SBLA-015: rejected because static archetypes can validate
  the core information journey earlier and more cheaply.

## Reversal cost

Low. The review count and progress fields can be changed in a superseding ADR
and machine-readable policy. Removing the SBLA-012 check would save little work
but lose early evidence about the central journey. This ADR does not alter data
formats, production infrastructure, or published content.
