# Science-Based Lifting Atlas

An evidence-first, static web atlas for resistance-training anatomy, exercise mechanics, and claim-level source inspection.

**SBLA-001 through SBLA-011 have passed their required queue reviews.**
SBLA-012 is the current static vertical-slice task. The repository contains
reviewed but unpublished records for one muscle, two exercises, 23 claims, and
68 sources, along with the schemas, evidence gates, graph compiler, and local
prototype page archetypes. The ordinary build still emits no public scientific
claim or entity route because owner publication approval is absent. The
accepted asset direction is 2D/text authoritative, with BodyParts3D limited to
optional enhancement; no asset was purchased. The canonical product and
execution requirements live in
[`docs/product/master-plan.md`](docs/product/master-plan.md).

On 2026-09-24 the owner removed SBLA-012's 3–5 participant gate. The static
acceptance checks and remaining independent-review/owner-approval steps are
recorded in
[`SBLA-012-static-acceptance.md`](docs/product/usability/SBLA-012-static-acceptance.md).
The owner hold on production anatomy work for SBLA-013 through SBLA-015 remains
active.

## Prerequisites

- Node.js 24.20.0 LTS (exactly; see `.node-version` and `.nvmrc`)
- Corepack from the Node.js 24 distribution
- Git

## Clean-checkout setup

```bash
corepack enable
corepack prepare pnpm@11.24.0 --activate
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm verify
pnpm test:e2e
pnpm test:prototype # local-only unpublished review build
```

On Linux CI, install Chromium system dependencies with:

```bash
pnpm exec playwright install --with-deps chromium
```

## Commands

| Command                 | Current behavior                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Run the Astro development server.                                                                                                                                            |
| `pnpm build`            | Generate the static production output.                                                                                                                                       |
| `pnpm preview`          | Preview the most recent static build.                                                                                                                                        |
| `pnpm verify`           | Run formatting, linting, type checking, unit tests, content/graph/evidence checks, the production build, repository contract, asset scorecard, and Gate A decision contract. |
| `pnpm test:portability` | Serve the existing static output with a bare `node:http` server. For direct use, run `pnpm build && pnpm test:portability`; `pnpm verify` already builds first.              |
| `pnpm test:e2e`         | Build and test the static output in Chromium, including JavaScript-disabled behavior.                                                                                        |
| `pnpm test:prototype`   | Check the local-only unpublished static journey in Chromium with JavaScript disabled; refuses CI and production environments.                                                |
| `pnpm test:a11y`        | Check the executable static-slice accessibility contract.                                                                                                                    |
| `pnpm test:visual`      | Check the current visual token and layout contract; screenshot baselines remain future work.                                                                                 |
| `pnpm test:performance` | Check that the master-plan budgets are represented. Later tasks measure actual bundles and assets.                                                                           |
| `pnpm evidence:status`  | Validate the 68 recorded source statuses and due dates; live network acquisition remains later work.                                                                         |

## Current boundaries

- Do not publish the reviewed vertical-slice records without an owner-approved
  manifest and the evidence gate. The normal build deliberately excludes their
  routes and graph data.
- Agent roles, branch/worktree rules, the current-work ledger, the handoff template, and Claude environment readiness are defined in [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), and [`docs/runbooks/`](docs/runbooks/). The canonical structured policy is [`docs/runbooks/operating-policy.json`](docs/runbooks/operating-policy.json). Claim your task in [`docs/runbooks/current-work.md`](docs/runbooks/current-work.md) before editing; restricted Claude roles ask Codex to record their exact-path claim.
- Both Claude accounts passed the readiness test recorded in [`docs/runbooks/claude-environments.md`](docs/runbooks/claude-environments.md); SBLA-002 no longer blocks SBLA-008.
- SBLA-003 establishes the accepted architecture/provider ADRs, dated free-tier
  model, and same-artifact second-host portability proof. Account-B Round 1 is preserved at
  `reviews/releases/SBLA-003-r1.md`, with its same-session late finding preserved
  separately at `reviews/releases/SBLA-003-r1-addendum.md`. The combined six
  Important and six Minor findings have bounded, freshly verified repairs. The
  final pre-review `<noscript>` fallback observation is also repaired and
  verified. Round 2 is preserved at `reviews/releases/SBLA-003-r2.md` and
  returned PASS with zero Critical and zero Important findings; owner approval
  was recorded on 2026-09-05.
- SBLA-004's accepted license inventory, lawful sample, coverage evaluator, and
  deterministic spike are recorded in `reviews/releases/SBLA-004-handoff.md`.
  Account-B Round 2 is preserved at `reviews/releases/SBLA-004-r2.md` and
  returned PASS with zero Critical and zero Important findings.
- SBLA-005's accepted benchmark is recorded in
  `reviews/releases/SBLA-005-handoff.md`; its measured 73/100 remains a
  recommendation, not an asset selection. Account-B Round 1 is preserved at
  `reviews/releases/SBLA-005-r1.md` and returned PASS with zero Critical and
  zero Important findings.
- SBLA-006's owner-delegated Gate A candidate approves original,
  evidence-reviewed 2D/vector and text as the authoritative path for all 28
  targets, with BodyParts3D 4.0 limited to optional 3D enhancement for 23 mapped
  targets. The five missing targets remain 2D-only, cost is $0, and no
  commercial asset is purchased. See
  `docs/product/gates/SBLA-006-asset-decision.md`. Account-B Round 2 is
  preserved at `reviews/releases/SBLA-006-r2.md` and returned PASS with zero
  Critical and zero Important findings after 47 adversarial mutations and a
  live primary-license check.
- SBLA-007 and SBLA-011 replaced foundation-mode adapters with validated
  evidence/content/graph pipelines. SBLA-011 Round 4 returned PASS with zero
  Critical and zero Important findings for the final criterion-13 repair.

Work follows the authoritative SBLA-001–SBLA-020 queue in master plan §18.
