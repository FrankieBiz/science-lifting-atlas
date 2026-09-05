# Execution Quality Correction Design

**Status:** Owner-approved direction on 2026-09-05; independent review pending  
**Decision record:** [`ADR 0006`](../../adr/0006-execution-quality-and-validation-gates.md)  
**Applies from:** SBLA-004 onward

## Context

The first three queue gates established unusually strong scientific,
architectural, and operational safeguards. They did not yet demonstrate the
product's central user journey. SBLA-003 also accumulated overlapping internal
and external review attempts after defects were already bounded. That history
improved the artifact, but it made review count look like progress and obscured
the more important question: what useful capability can a lifter or coach use?

The correction preserves every evidence, licensing, accessibility, and owner
approval gate. It changes how work is reviewed and how progress is reported.

## Goals

- Keep one independent acceptance gate for every milestone.
- Stop adding review layers once the required reviewer passes the artifact.
- Convert a failed review into one bounded repair and one complete recheck.
- Report delivered capability and user-journey proof separately from queue
  completion.
- Validate the first realistic static vertical slice with representative users
  at SBLA-012, before expensive 3D production.
- Reconcile SBLA-004 from the accepted SBLA-003 base instead of merging its
  stale branch history.

## Non-goals

- Weakening scientific, citation, licensing, accessibility, or release gates.
- Replacing Claude Review account B as the independent reviewer required by the
  role map.
- Treating Minor findings as ignorable; they remain explicit backlog items.
- Claiming the current foundation shell is a usable product.
- Estimating an overall completion percentage before throughput is observed.

## Selected approach

### One-review stop rule

Every milestone receives three quality layers: builder self-checks, automated
verification, and one plan-required independent acceptance review. A separate
internal pre-review is exceptional and must name a material risk the required
reviewer cannot reasonably cover.

PASS requires zero unresolved Critical and Important findings. Nonblocking
Minor findings may be deferred only when their impact and follow-up destination
are recorded. FAIL opens one bounded remediation claim. The reviewer then
rechecks the complete repaired artifact once. A passing recheck ends the review
cycle unless a newly discovered material risk changes the acceptance scope.

### Capability-based progress

Every project update reports five facts:

1. accepted queue gates, expressed as `x/20`;
2. central user journey, expressed as demonstrated or not demonstrated;
3. current shippable capability in plain language;
4. active blockers or material risks; and
5. the next proof that will materially advance the product.

Queue gates measure process completion, not product value. The project must not
publish one overall completion percentage before SBLA-017 records observed
vertical-slice throughput and the owner approves a revised effort estimate.

### Early user validation at SBLA-012

The first realistic static home, muscle, exercise, source, and methodology
archetypes must be tested with 3–5 representative serious lifters or coaches.
Each participant attempts four tasks: find a target, understand the practical
takeaway, verify the evidence, and share the relevant state or page.

The report records task outcomes, observed confusion, severity, participant
type, and changes made. Any Critical journey blocker is fixed before owner
direction approval. This is formative validation, not the final beta or a claim
of statistical confidence; the larger ≥85% task-success gate remains in the
release rubric.

### SBLA-004 reconciliation

The existing SBLA-004 branch began before SBLA-003 was accepted. Its commits are
inputs, not an integration candidate. A new SBLA-004 reconciliation branch must
start at the accepted SBLA-003 commit. Codex ports only the bounded SBLA-004
changes, resolves them against the accepted operating contract, and replaces
placeholder-only evidence with lawful real sample files plus repeatable browser
measurements before review.

## Alternatives considered

### Keep layered review as the default

Rejected. Extra independent perspectives can be useful, but review count is not
a quality metric. Making every layer mandatory increases cycle time and creates
coordination defects without changing the acceptance threshold.

### Remove independent milestone review

Rejected. Automated checks cannot judge evidence entailment, licensing nuance,
visual direction, or scope overreach. The independent gate remains essential.

### Report a rough overall percentage now

Rejected. Three accepted foundation gates out of twenty do not mean the product
is 15% complete, because later evidence, content, UI, 3D, and audit tasks differ
greatly in size. SBLA-017 exists to replace broad estimates with observed
throughput.

### Wait until the complete 3D slice for user testing

Rejected. SBLA-012 can expose navigation, comprehension, evidence, and sharing
problems before the costly asset and scene pipeline is locked. SBLA-015 still
retains the full 3D owner gate.

## Failure handling

- If the required reviewer fails a candidate, preserve the report, repair only
  the bounded findings, and recheck the full artifact.
- If a Minor finding becomes blocking in context, reclassify it before PASS.
- If user testing exposes a Critical journey blocker, fix and rerun the affected
  tasks before owner approval.
- If lawful SBLA-004 samples cannot be obtained, record the candidate as blocked
  or select a documented 2D fallback; do not substitute an unlicensed asset.
- If observed SBLA-017 throughput invalidates the Release 1 scope, reduce catalog
  breadth before weakening evidence review.

## Verification

The operating policy is machine-readable and validated by the foundation
contract. The master plan, repository instructions, Claude instructions, ADR,
and policy must state the same thresholds. `pnpm verify` must reject drift.

## Approval record

After reviewing a candid direction assessment, owner Francis Bisignano asked
Codex on 2026-09-05 to understand the response, edit the project as needed, and
continue the work. That instruction approves this correction's direction. The
repository change still requires the normal independent review before
integration.
