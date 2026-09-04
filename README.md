# Science-Based Lifting Atlas

An evidence-first, static web atlas for resistance-training anatomy, exercise mechanics, and claim-level source inspection.

**SBLA-002 is accepted; the combined SBLA-003 Account-B Round 1 remediation is implemented and freshly verified.** All five SBLA-003 ADRs remain Proposed; fresh independent review, Account-B Round 2, and owner approval are pending. The repository contains the verified static shell and stable command contract, but no scientific content, anatomy asset, production schema, or public evidence claim. The canonical product and execution requirements live in [`docs/product/master-plan.md`](docs/product/master-plan.md).

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

| Command                 | Foundation-stage behavior                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Run the Astro development server.                                                                                                                               |
| `pnpm build`            | Generate the static production output.                                                                                                                          |
| `pnpm preview`          | Preview the most recent static build.                                                                                                                           |
| `pnpm verify`           | Run formatting, linting, type checking, unit tests, stage-aware content/graph/evidence checks, the production build, and the repository contract.               |
| `pnpm test:portability` | Serve the existing static output with a bare `node:http` server. For direct use, run `pnpm build && pnpm test:portability`; `pnpm verify` already builds first. |
| `pnpm test:e2e`         | Build and test the static output in Chromium, including JavaScript-disabled behavior.                                                                           |
| `pnpm test:a11y`        | Check the executable foundation accessibility contract. Later tasks expand this into the full accessibility matrix.                                             |
| `pnpm test:visual`      | Check deterministic viewport definitions. Later tasks add screenshot baselines.                                                                                 |
| `pnpm test:performance` | Check that the master-plan budgets are represented. Later tasks measure actual bundles and assets.                                                              |
| `pnpm evidence:status`  | Report zero sources in foundation mode. It fails closed if source records appear before SBLA-007/SBLA-011 implement their schemas and status checks.            |

## Current boundaries

- Do not add scientific or anatomy records yet; foundation validators intentionally reject them.
- Agent roles, branch/worktree rules, the current-work ledger, the handoff template, and Claude environment readiness are defined in [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), and [`docs/runbooks/`](docs/runbooks/). The canonical structured policy is [`docs/runbooks/operating-policy.json`](docs/runbooks/operating-policy.json). Claim your task in [`docs/runbooks/current-work.md`](docs/runbooks/current-work.md) before editing; restricted Claude roles ask Codex to record their exact-path claim.
- Both Claude accounts passed the readiness test recorded in [`docs/runbooks/claude-environments.md`](docs/runbooks/claude-environments.md); SBLA-002 no longer blocks SBLA-008.
- SBLA-003 proposes the architecture/provider ADRs, dated free-tier model, and
  same-artifact second-host portability proof. Account-B Round 1 is preserved at
  `reviews/releases/SBLA-003-r1.md`, with its same-session late finding preserved
  separately at `reviews/releases/SBLA-003-r1-addendum.md`. The combined six
  Important and six Minor findings have bounded, freshly verified repairs. Fresh
  independent review, Round 2, and owner approval remain pending.
- SBLA-004 through SBLA-006 own anatomy and exercise-media license selection.
- SBLA-007 and SBLA-011 replace foundation-mode adapters with validated evidence/content/graph pipelines.

Work follows the authoritative SBLA-001–SBLA-020 queue in master plan §18.
