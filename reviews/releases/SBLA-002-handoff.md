# Handoff: SBLA-002 — Agent operating model

## Objective

Deliver the SBLA-002 row of the authoritative queue in master plan §18:
repository-local `AGENTS.md` and `CLAUDE.md`, a reusable handoff template, a
current-work ledger, a branch/worktree runbook, and a Claude
environment-readiness and fallback report — with `pnpm verify` green.

## Inputs and exact paths

- Canonical plan: `docs/product/master-plan.md` (§13 roles, §13.6 handoff
  format, §13.7 conflict/edit rules, §13.9 environment readiness, §18 queue)
- Dependency: SBLA-001, accepted at `141b63913b75791a6630303fdd1936fc615b3471`
- Prior handoff and reviews: `reviews/releases/SBLA-001-handoff.md`,
  `reviews/releases/SBLA-001-r1.md`, `reviews/releases/SBLA-001-r2.md`
- Base commit: `141b63913b75791a6630303fdd1936fc615b3471`
- Branch: `codex/SBLA-002-agent-operating-model`
- Worktree: `.worktrees/sbla-002-agent-operating-model`
- Repository root: `/Users/frankbisignano/dev/science-lifting-atlas`

## Constraints

- SBLA-002 owns only the operating model. It does not touch architecture ADRs
  (SBLA-003), media licensing (SBLA-004–006), evidence schemas (SBLA-007), the
  design system (SBLA-012), or any product surface.
- The SBLA-001 command contract is stable: no command was renamed, removed, or
  weakened, and `REQUIRED_VERIFY_STEPS` is unchanged.
- The immutable Round 1 and Round 2 SBLA-001 review reports are preserved
  untouched.
- No scientific claim, anatomy asset, or evidence record was added.

## Work completed

Six required artifacts, each written so a reviewer can act without chat context:

- `AGENTS.md` — shared operating contract: reading order, repository stage,
  role/write-boundary matrix, task lifecycle, handoff destinations, command
  contract, runtime pins, editing rules, publication guardrails.
- `CLAUDE.md` — Claude-specific instructions: role selection, the two session
  headers verbatim from §13.8, evidence rules that override fluency, start and
  finish procedure.
- `docs/runbooks/handoff-template.md` — reusable template carrying all ten §13.6
  headings plus destinations and the no-chat-context rule.
- `docs/runbooks/current-work.md` — ledger with active claims, closed claims,
  and a recovery log; encodes the 24-hour stale rule and Codex-only merge
  authority.
- `docs/runbooks/branch-and-worktree.md` — naming, starting from a reviewed
  base, finishing, fast-forward integration, worktree removal and repair, stale
  ownership, and the non-negotiable edit rules.
- `docs/runbooks/claude-environments.md` — §13.9 environment record, the
  six-step readiness test, Codex readiness evidence, the chat-only bundle
  fallback, and the outstanding owner action that blocks SBLA-008.

The operating model is enforced, not merely documented:

- `scripts/foundation/operating-model.mjs` — pure validator requiring every
  artifact to exist, the handoff template to carry all ten §13.6 headings, and
  each document to retain its load-bearing rules.
- `scripts/foundation/role-paths.mjs` + `check-role-paths.mjs` — pure validator
  and CLI for §13.9 step 6, so a role writing outside its boundary is a non-zero
  exit rather than a matter of opinion.
- `scripts/foundation/verify.mjs` — extended to run both validators; the two
  filesystem collection loops were extracted into helpers with identical
  semantics.
- `docs/runbooks/README.md` and `README.md` — updated to route a new reader to
  the runbooks and to record that SBLA-008 is blocked.

Repository state actions performed under owner authorization:

- Relocated the repository from
  `~/Documents/Codex/2026-08-29/g/outputs/science-lifting-atlas` to
  `~/dev/science-lifting-atlas` and ran `git worktree repair`. `git fsck` is
  clean and all refs and reflogs are intact.
- Fast-forwarded `main` `399966f` → `141b639` (the accepted SBLA-001 commit).
  `codex/SBLA-001-repository-foundation` is preserved, not deleted.

Both actions are recorded in the ledger's recovery log.

## Decisions made

- **Separate module rather than editing SBLA-001's accepted contract.** The
  operating-model rules live in their own validator so SBLA-001's reviewed
  `contract.mjs` and its tests stay byte-identical. Alternative rejected:
  folding new paths into `REQUIRED_PATHS`, which would have mixed ownership of
  an already-accepted artifact.
- **Wired into `verify.mjs` rather than adding a `verify` step.** Adding a
  pipeline step would have changed the command contract that SBLA-001's tests
  pin. Hooking the existing `verify:foundation` step keeps `pnpm verify`
  identical in shape while still enforcing SBLA-002.
- **Literal-substring rule checks.** Documents are checked for a small set of
  load-bearing phrases rather than by structure, so prose can be improved freely
  but a rule cannot be silently deleted. The trade-off is that a deliberate
  rewording must update the contract in the same change — which is the intent.
- **Executable path-boundary check.** §13.9 step 6 asks for a boundary check;
  making it a script rather than a paragraph means the readiness test is
  repeatable by whoever runs it next.
- **Ledger claim left open pending review.** The task stops at the review gate,
  so ownership is not released until review completes and any repairs land.

## Tests/checks run and results

Run with the pinned runtime (Node.js `v24.20.0`, pnpm `11.24.0`) at the new
repository path.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)**:
  - Prettier check PASS
  - ESLint PASS, zero warnings
  - `astro check` — 28 files, 0 errors, 0 warnings, 0 hints
  - Unit tests — 5 files, 24 tests passed
  - Content adapter — foundation mode, 0 records
  - Graph adapter — foundation mode, 0 nodes and 0 edges
  - Evidence adapter — foundation mode, 0 sources
  - Static build — 1 page
  - Repository foundation contract PASS
- `pnpm test:a11y` — PASS, 1 test.
- `pnpm test:visual` — PASS, 1 test.
- `pnpm test:performance` — PASS, 1 test.
- `pnpm test:e2e` — **NOT RUN.** See Known uncertainties.

Fail-closed evidence at the filesystem level, not only against fixtures:

- Hiding `AGENTS.md` → `verify:foundation` exit **1**, reporting the missing
  path and each missing rule.
- Rewording the ledger's `24 hours` stale rule → exit **1**, naming the exact
  dropped rule.
- Restoring both → exit **0**.

Role-boundary CLI, exercised in both directions:

- `claude-research research/questions/test.md` → exit 0
- `claude-review reviews/evidence/test.md` → exit 0
- `claude-research src/pages/index.astro` → exit 1
- `claude-review content-drafts/muscles/x.md` → exit 1
- unknown role → exit 1

## Known uncertainties

- **The §18 pass condition for SBLA-002 is not fully met.** It requires both
  Claude roles to complete the path/source/handoff simulation or the documented
  chat-only fallback. Claude Team accounts A and B have not been provisioned, so
  neither run has happened. This handoff delivers the documented procedure, the
  environment record, and the executable boundary check — not the two completed
  runs. `docs/runbooks/claude-environments.md` records both roles as
  `OUTSTANDING` and SBLA-008 as blocked. **A reviewer should treat this as the
  open item on SBLA-002.**
- `pnpm test:e2e` could not run in this session's sandboxed shell: Chromium
  aborts at launch with `bootstrap_check_in ... Permission denied` from
  `mach_port_rendezvous_mac.cc`. The Astro build and preview server start
  normally, and the page content the spec asserts was confirmed in the built
  `dist/index.html` and in a real browser against the preview server, but that
  is corroboration, not a run of the gate. It must be run unsandboxed or in CI.
- The literal-substring contract cannot tell an improvement from a regression in
  prose. It only guarantees a named rule is still present.
- The repository has no Git remote. Nothing has been pushed or published.
- An untracked `.pnpm-store/` directory exists at the repository root, created
  when the sandboxed shell could not reach the user-level pnpm store. It is a
  local artifact, not project content, and is not in `.gitignore`.

## Files created or modified

Created:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/runbooks/handoff-template.md`
- `docs/runbooks/current-work.md`
- `docs/runbooks/branch-and-worktree.md`
- `docs/runbooks/claude-environments.md`
- `scripts/foundation/operating-model.mjs`
- `scripts/foundation/role-paths.mjs`
- `scripts/foundation/check-role-paths.mjs`
- `tests/unit/operating-model-contract.test.ts`
- `tests/unit/role-paths.test.ts`
- `reviews/releases/SBLA-002-handoff.md`

Modified:

- `scripts/foundation/verify.mjs`
- `docs/runbooks/README.md`
- `README.md`

## Required reviewer action

Independently review this branch at its final commit and return PASS or FAIL per
criterion, with evidence and exact paths, to
`reviews/releases/SBLA-002-r1.md`. Do not repair the artifact.

Specifically decide:

1. Whether the six artifacts satisfy the SBLA-002 row of §18 and are usable
   without chat context.
2. Whether `AGENTS.md` and `CLAUDE.md` faithfully encode §13.2–13.4, §13.7, and
   §13.8 without inventing authority the master plan does not grant.
3. Whether the handoff template matches §13.6 exactly.
4. Whether the ledger and runbook implement §13.7, including the 24-hour stale
   rule and Codex-only merge authority.
5. Whether `claude-environments.md` satisfies §13.9's required record fields and
   whether the un-provisioned accounts should block SBLA-002 acceptance or be
   carried as a tracked blocker on SBLA-008.
6. Whether the added validators strengthen the contract without weakening any
   SBLA-001 gate.
7. Whether the repository relocation and `main` fast-forward were recorded
   adequately.

## Acceptance criteria

- Every SBLA-002 output named in §18 exists and is internally consistent.
- The handoff template carries all ten §13.6 headings.
- The ledger records owner, branch/worktree, base commit, start time, and
  expected handoff, and states the 24-hour stale rule and Codex-only merge
  authority.
- `claude-environments.md` records environment type, Git remote/credential
  method, source-transfer method, allowed directories, readiness result, and
  fallback for each role, and names SBLA-008 as blocked.
- The operating-model contract fails closed when an artifact is missing or a
  load-bearing rule is dropped, demonstrated at the filesystem level.
- The role path-boundary check rejects out-of-boundary writes and unknown roles.
- No SBLA-001 command, gate, or review report was renamed, removed, or weakened.
- `pnpm verify`, `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance` exit zero.
- `pnpm test:e2e` is confirmed green in an unsandboxed environment or in CI
  before this task is considered fully accepted.
- The final working tree is clean.
