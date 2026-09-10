# Science-Based Lifting Atlas — Windows transfer handoff

**Prepared:** 2026-09-09  
**Repository:** `https://github.com/FrankieBiz/science-lifting-atlas`  
**Accepted branch:** `main`  
**Active branch:** `codex/SBLA-007-evidence-schemas`  
**Local source repository:** `/Users/frankbisignano/dev/science-lifting-atlas`  
**Local active worktree:** `/Users/frankbisignano/dev/science-lifting-atlas/.worktrees/sbla-007-evidence-schemas`

## Purpose and product

Science-Based Lifting Atlas is a static-first, evidence-visible resistance-training anatomy and exercise atlas. Its core promise is: select a trainable structure, understand what it does, see how exercises load it, and inspect the evidence and uncertainty behind every meaningful claim.

The master plan is authoritative at `docs/product/master-plan.md`. Section 18 contains the queue `SBLA-001` through `SBLA-020`. Work in order and do not report a speculative overall completion percentage: the durable progress measure is accepted gates.

## Exact current stage

- Accepted: SBLA-001 through SBLA-006.
- Queue progress: 6 of 20 accepted gates, or 30% by gate count.
- Current task: SBLA-007, evidence schemas and validators.
- SBLA-007 is in progress, not accepted, and must remain off `main` until independent review passes.
- The accepted `main` checkpoint before SBLA-007 is `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`.
- The active SBLA-007 checkpoint is recorded below after the transfer commit is created.

## Accepted history that must remain intact

SBLA-006 ended with a 2D-authoritative anatomy decision and optional bounded BodyParts3D 3D enhancement. The accepted decision covers 23 of 28 mapped targets, preserves five explicit 2D-only gaps, requires no purchase, and makes the non-WebGL path authoritative. Its independent Account-B R2 review is `reviews/releases/SBLA-006-r2.md`, verdict PASS, zero Critical, zero Important, eight nonblocking Minor findings.

Do not alter any prior review report. They are append-only evidence. Do not delete historical task or reviewer branches.

## Role model

- Codex owns architecture, schemas, tooling, tests, UI, integration, commits, and merges.
- Claude Research Account A owns research questions, extraction, synthesis, and draft claim/page artifacts. It does not write application code or published content.
- Claude Review Account B independently audits the exact immutable candidate and writes only a new `reviews/.../<task>-rN.md` report. It never repairs what it reviews.
- The owner approves only the queue items that explicitly name Owner in section 18.

Account A on the Mac is a personal Free Claude account without Claude Code workspace access. It can provide a self-contained read-only advisory in chat, but it cannot honestly claim repository inspection. Account B is the Team workspace account with Claude Code/Cowork access and is reserved for the formal independent review.

## SBLA-007 required outcome

Section 18 requires common entity schemas plus claim, source, evidence-packet, review, and change schemas and fixtures. Invalid fixtures must fail, valid fixtures must pass, and `pnpm verify` must pass. Task 1.1 further requires identifier normalization, separate review/publication states, certainty-language linting, review-date checks, graph-integrity fixtures, retraction-status fixtures, and exact authoring errors with remediation.

The bounded design is recorded at `docs/superpowers/specs/2026-09-09-sbla-007-evidence-schemas-design.md`, and the execution plan is `docs/superpowers/plans/2026-09-09-sbla-007-evidence-schemas.md`.

## Work implemented at this checkpoint

- Added strict Zod schemas and reusable primitives in `src/lib/content/schemas.ts`.
- Added deterministic graph, source-status, and certainty-language checks in `src/lib/content/validation.ts`; pure time-relative functions require an explicit `asOf` ISO date.
- Added valid and invalid fixtures under `tests/fixtures/evidence-schemas/`.
- Added schema and cross-record tests, including missing/duplicate references, source retraction/status, due-date boundaries, and wording calibration.
- Replaced the foundation-only content/graph/evidence adapters with shared-schema adapters that support JSON/YAML and reject symbolic links, malformed input, unsupported types/extensions, and filename/ID mismatches.
- Registered empty-capable Astro collections for claims, sources, and change records using the same schemas.
- Hardened the accepted SBLA-006 decision validator for missing license scores, all six policy guardrails, Gate A packet checksum drift, and checkout paths containing spaces.
- Added direct pinned development dependencies `zod@4.5.2` and `yaml@2.9.0`.

No scientific content, public claim, graph bundle, MDX claim component, or live network status client was added. Those remain later queue work.

## Verification state at transfer

The first focused run failed because the schema/validation modules did not exist, establishing the required red test baseline. After implementation, 24 focused tests passed and Astro type checking passed with zero errors. A full `pnpm verify` must still be run and recorded after formatting and after incorporating any material Account-A advisory findings. Treat this branch as a cleanly preserved work-in-progress checkpoint, not a finished SBLA-007 candidate.

## Account-A advisory status

A complete SBLA-007 advisory packet was sent to Claude Account A asking for adversarial analysis of schema omissions, invariants, normalization edge cases, deterministic date rules, certainty-language behavior, graph/retraction fixtures, and scope boundaries. Retrieve and assess that response before freezing the candidate. It is advisory only and does not replace Account B acceptance.

## Exact next actions

1. Follow `docs/runbooks/windows-setup.md`, switch to `codex/SBLA-007-evidence-schemas`, and confirm the transfer checkpoint matches GitHub.
2. Read the Account-A advisory response and implement only material, in-scope corrections with tests first.
3. Finish adapter subprocess tests and exact authoring-error documentation.
4. Run `pnpm format`, then focused tests, `pnpm verify`, `pnpm test:e2e`, and range `git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a...HEAD`.
5. Create the SBLA-007 implementation candidate and `reviews/releases/SBLA-007-handoff.md`, recording exact commit, tree, changed paths, real command output, and deferred scope.
6. Close the builder claim in `docs/runbooks/current-work.md`.
7. From the immutable candidate, create a distinct reviewer branch/worktree; pre-claim only `reviews/releases/SBLA-007-r1.md`; dispatch Claude Account B for adversarial review.
8. Merge into `main` only after the latest Account-B report says PASS with zero unresolved Critical and Important findings and the trusted role-path boundary passes.

## Handoff prompt for the next agent

Read this file in full, then read `AGENTS.md`, `docs/product/master-plan.md` sections 9, 10, 13, and 18, `docs/adr/0002-content-data-and-graph.md`, `docs/runbooks/current-work.md`, `reviews/releases/SBLA-006-handoff.md`, `reviews/releases/SBLA-006-r2.md`, and both SBLA-007 design/plan documents. Verify Git branch, HEAD, tree, status, remotes, Node/pnpm versions, `pnpm install --frozen-lockfile`, and the current focused tests before editing. Continue only SBLA-007. Preserve all prior reports and branches. Use tests before behavior changes. Do not add scientific content or merge to main. Codex owns implementation; Account A may advise without claiming repository access; Account B must independently review the immutable candidate and must write only the pre-claimed append-only report path.

## Transfer identity

The exact transfer commit and tree are filled in immediately before push:

- Active checkpoint commit: `TRANSFER_COMMIT_PENDING`
- Active checkpoint tree: `TRANSFER_TREE_PENDING`
- Expected remote: `origin https://github.com/FrankieBiz/science-lifting-atlas.git`
