# PLAN-002 owner acceptance

- Date: 2026-09-27
- Decision: Accepted
- Base commit: `7f75ec58a26a1bc83ca6e4d5a81aed0e3d5fb10a`
- Decision record: [`ADR 0007`](../../docs/adr/0007-throughput-and-parallel-delivery.md)
- Review tier: Build (policy, docs, tooling). Under ADR 0007 D1 the owner gate
  is the acceptance; no independent review round is required.

## Owner direction

The owner asked for a re-review of the plan to remove an efficiency problem,
received ADR 0007 as a Proposed record with its supporting measurements, and
replied "i approve" on 2026-09-27. That approval covers D1–D8, including the
public beta after Wave 1 (D6) and the Codex role being held by a non-authoring,
non-reviewing Claude Code session (D8). It does not waive any scientific,
licensing, accessibility, performance, or resilience gate.

## Change set

- ADR 0007 set to Accepted; ADR index updated.
- `docs/runbooks/operating-policy.json` schema version 2: review tiers,
  two-round cap outside the evidence tier, lint-bypass severity, evidence
  pipeline tiers, the flexible Codex role, Claude Code environments, delivery
  lanes, 2D-authoritative anatomy, and a beta that may follow SBLA-018.
- `scripts/foundation/operating-model.mjs` and its contract tests enforce the
  new fields and prose sentinels. The validator no longer requires `CLAUDE.md`
  or `docs/runbooks/claude-environments.md`, which the owner deleted in
  `7f75ec5`. Their load-bearing rules and the environment record now live in
  `AGENTS.md`. This restores a passing `pnpm verify` on the base.
- Master plan: status line, §9.8 claim-tier pipeline, §11.3 tree, §12.3 2D
  publication rule, §13 risk tiers, §13.9 record location, Phase 5 wave note,
  §17 Gate E timing, and §18 lanes and dependencies. SBLA-016 now depends on
  011 and 012, SBLA-017 on 010, SBLA-018 on 012 and 017, and SBLA-020 on 016
  and 019, plus 015 if 3D ships.
- `AGENTS.md`, `README.md`, and `docs/runbooks/README.md` rewritten to match.
- New `pnpm handoff` command (`scripts/release/handoff.mjs`, pure logic in
  `handoff-facts.mjs`, tests in `tests/unit/handoff-facts.test.ts`), added to
  the required command contract.
- `tests/unit/operating-model-filesystem.test.ts` now skips a local
  `.pnpm-store` and `.playwright-mcp` when copying the repository fixture.

## Implementation note on D7

The proposed D7 let restricted Claude roles write their own ledger lines. That
would widen write boundaries that `check-role-paths` compares against an
immutable base policy. The accepted D7 text instead has the session holding the
Codex role record the claim when it starts the task. That removes the owner's
courier step without touching write boundaries.

## Checks

- `pnpm verify` (Node.js v24.20.0, pnpm 11.24.0): PASS. 328 unit tests, 17
  portability tests, all content, graph, research, evidence, foundation, and
  asset gates.
- `pnpm handoff PLAN-002 --base a03eeef --run "pnpm evidence:status"`: printed
  exact commits, tree, runtime, three changed paths, and the real check output.
- `pnpm test:e2e`: not run to completion. The local sandbox blocks Chromium's
  Mach port registration (`bootstrap_check_in ... Permission denied (1100)`).
  This change touches no rendered page; rerun it outside the sandbox before the
  next UI milestone.

## Deferred

| Item                                                                                               | Destination                           |
| -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Rerun `pnpm test:e2e` outside the sandbox                                                          | First SBLA-012 builder self-check     |
| PLAN-001 Minor M-9 to M-11 (terminology, forbidden weakening phrases, immutable-artifact manifest) | Next operating-model hardening change |
