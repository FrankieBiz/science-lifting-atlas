# Windows setup and verification

This project is designed to move through Git. Do not copy `.worktrees/`, `node_modules/`, `.astro/`, `dist/`, or temporary asset archives between computers.

## Required software

Install these on Windows before cloning:

1. Git for Windows.
2. Node.js `24.20.0` exactly.
3. pnpm `11.24.0` exactly, enabled through Corepack.
4. GitHub CLI if an agent will create branches or inspect GitHub from the terminal.

Use PowerShell for the commands below.

```powershell
git clone https://github.com/FrankieBiz/science-lifting-atlas.git
cd science-lifting-atlas
git fetch --all --prune
git switch codex/SBLA-007-evidence-schemas
corepack enable
corepack prepare pnpm@11.24.0 --activate
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm verify
pnpm exec playwright install chromium
pnpm test:e2e
```

The two version commands must print `v24.20.0` and `11.24.0`. Stop if they do not.

## Branch meanings

- `main` is the accepted line. It contains accepted SBLA-001 through SBLA-006.
- `codex/SBLA-007-evidence-schemas` is the current in-progress task. It must not be merged into `main` until its immutable handoff exists and Account B independently reports PASS with zero unresolved Critical or Important findings.
- Historical task and review branches are evidence. Do not delete or rewrite them.

## Continuing safely on Windows

Before editing, read `AGENTS.md`, `docs/product/master-plan.md`, `docs/runbooks/current-work.md`, the latest accepted handoff, and `docs/runbooks/windows-transfer-handoff.md`.

Create a Windows worktree from the existing task branch rather than editing `main`:

```powershell
git switch main
git worktree add .worktrees/sbla-007-evidence-schemas codex/SBLA-007-evidence-schemas
cd .worktrees/sbla-007-evidence-schemas
pnpm install --frozen-lockfile
pnpm verify
```

If Git says the branch is already checked out, use the primary clone directly only after confirming it is on `codex/SBLA-007-evidence-schemas`; do not create a second branch with the same task ID.

## GitHub safety

- Never force-push `main` or a task/review branch.
- Never commit secrets, GitHub tokens, downloaded proprietary assets, `node_modules`, or temporary benchmark archives.
- Push the current branch after every clean checkpoint: `git push -u origin HEAD`.
- Treat GitHub as transfer and backup, not as acceptance. Only the repository's recorded review process can accept a task.
