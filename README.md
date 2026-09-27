# Science-Based Lifting Atlas

An evidence-first, static web atlas for resistance-training anatomy, exercise mechanics, and claim-level source inspection.

**SBLA-001 through SBLA-011 are accepted.** The repository contains the
static shell, command contract, license inventory, the Gate A 2D-authoritative
anatomy decision, validated evidence schemas, and one reviewed evidence slice:
pectoralis major, barbell flat bench press, and standing cable fly, with 23
approved claims and 68 sources compiled into a deterministic evidence graph.
Those claims are not yet published; publication needs owner approval of an
exact batch manifest.

From SBLA-012 onward, work follows
[ADR 0007](docs/adr/0007-throughput-and-parallel-delivery.md): risk-tiered
review and three parallel lanes (Product, Evidence, 3D). The canonical product
and execution requirements live in
[`docs/product/master-plan.md`](docs/product/master-plan.md).

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
```

On Linux CI, install Chromium system dependencies with:

```bash
pnpm exec playwright install --with-deps chromium
```

## Commands

| Command                 | Foundation-stage behavior                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Run the Astro development server.                                                                                                                                                        |
| `pnpm build`            | Generate the static production output.                                                                                                                                                   |
| `pnpm preview`          | Preview the most recent static build.                                                                                                                                                    |
| `pnpm verify`           | Run formatting, linting, type checking, unit tests, stage-aware content/graph/evidence checks, the production build, repository contract, asset scorecard, and Gate A decision contract. |
| `pnpm test:portability` | Serve the existing static output with a bare `node:http` server. For direct use, run `pnpm build && pnpm test:portability`; `pnpm verify` already builds first.                          |
| `pnpm test:e2e`         | Build and test the static output in Chromium, including JavaScript-disabled behavior.                                                                                                    |
| `pnpm test:a11y`        | Check the executable foundation accessibility contract. Later tasks expand this into the full accessibility matrix.                                                                      |
| `pnpm test:visual`      | Check deterministic viewport definitions. Later tasks add screenshot baselines.                                                                                                          |
| `pnpm test:performance` | Check that the master-plan budgets are represented. Later tasks measure actual bundles and assets.                                                                                       |
| `pnpm evidence:status`  | Report identifier, retraction, and freshness status for every source record; fails closed on a stale or retracted source.                                                                |
| `pnpm handoff`          | Print or `--write` the machine-generated handoff facts: base, commit, tree, changed paths, and real `--run` check results.                                                               |

## Current boundaries

- Publish nothing without an owner-approved batch manifest; the claim components fail closed.
- Agent roles, review tiers, Claude environments, branch/worktree rules, the current-work ledger, and the handoff template are defined in [`AGENTS.md`](AGENTS.md) and [`docs/runbooks/`](docs/runbooks/). The canonical structured policy is [`docs/runbooks/operating-policy.json`](docs/runbooks/operating-policy.json). Claim your task in [`docs/runbooks/current-work.md`](docs/runbooks/current-work.md) before editing; the session holding the Codex role records restricted-role claims.
- Generate handoff facts with `pnpm handoff <task-id> --base <commit>`.
- Accepted history and every review round are preserved under [`reviews/`](reviews/); decisions are in [`docs/adr/`](docs/adr/) and [`docs/product/gates/`](docs/product/gates/).

Work follows the authoritative SBLA-001–SBLA-020 queue in master plan §18.
