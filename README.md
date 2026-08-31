# Science-Based Lifting Atlas

An evidence-first, static web atlas for resistance-training anatomy, exercise mechanics, and claim-level source inspection.

The repository is currently at **SBLA-001: repository foundation**. It contains the verified static shell and stable command contract, but no scientific content, anatomy asset, production schema, or public evidence claim. The canonical product and execution requirements live in [`docs/product/master-plan.md`](docs/product/master-plan.md).

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

| Command                 | Foundation-stage behavior                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Run the Astro development server.                                                                                                                    |
| `pnpm build`            | Generate the static production output.                                                                                                               |
| `pnpm preview`          | Preview the most recent static build.                                                                                                                |
| `pnpm verify`           | Run formatting, linting, type checking, unit tests, stage-aware content/graph/evidence checks, the production build, and the repository contract.    |
| `pnpm test:portability` | Build and serve the static output from a bare `node:http` server to prove the artifact needs no host-specific runtime.                               |
| `pnpm test:e2e`         | Build and test the static output in Chromium, including JavaScript-disabled behavior.                                                                |
| `pnpm test:a11y`        | Check the executable foundation accessibility contract. Later tasks expand this into the full accessibility matrix.                                  |
| `pnpm test:visual`      | Check deterministic viewport definitions. Later tasks add screenshot baselines.                                                                      |
| `pnpm test:performance` | Check that the master-plan budgets are represented. Later tasks measure actual bundles and assets.                                                   |
| `pnpm evidence:status`  | Report zero sources in foundation mode. It fails closed if source records appear before SBLA-007/SBLA-011 implement their schemas and status checks. |

## Current boundaries

- Do not add scientific or anatomy records yet; foundation validators intentionally reject them.
- SBLA-002 owns repository-local agent roles, branch/worktree operating rules, the current-work ledger, and Claude environment readiness.
- SBLA-003 owns architecture/provider ADRs and current free-tier modeling.
- SBLA-004 through SBLA-006 own anatomy and exercise-media license selection.
- SBLA-007 and SBLA-011 replace foundation-mode adapters with validated evidence/content/graph pipelines.

Work follows the authoritative SBLA-001–SBLA-020 queue in master plan §18.
