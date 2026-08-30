# Handoff: SBLA-002 — Agent operating model

## Objective

Deliver the SBLA-002 row of the authoritative queue in master plan §18:
repository-local `AGENTS.md` and `CLAUDE.md`, a reusable handoff template, a
current-work ledger, a branch/worktree runbook, and a Claude
environment-readiness and fallback report — with `pnpm verify` green.

## Inputs and exact paths

- Canonical plan: `docs/product/master-plan.md` (§13 roles, §13.6 handoff
  format, §13.7 conflict/edit rules, §13.9 environment readiness, §18 queue)
- Dependency: SBLA-001 implementation candidate
  `9ac14081f13f191eaf6feaa67fb98d2f18e14bbd`; acceptance-record and integration
  base `141b63913b75791a6630303fdd1936fc615b3471`
- Prior handoff and reviews: `reviews/releases/SBLA-001-handoff.md`,
  `reviews/releases/SBLA-001-r1.md`, `reviews/releases/SBLA-001-r2.md`
- Base commit: `141b63913b75791a6630303fdd1936fc615b3471`
- Round 1 candidate: `af1b920afef8614c5cfc58bb1ddedfbab9933bc3`
- Round 1 repair candidate: `66299986a588eb44d64331844c9b0e561d363b61`
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
- `scripts/foundation/role-paths.mjs` + `check-role-paths.mjs` — canonical path
  validator and Git-derived CLI for §13.9 step 6. The CLI requires a clean
  worktree and enumerates the complete committed diff from the reviewed base,
  so a caller cannot omit a prohibited change.
- `scripts/foundation/verify.mjs` — extended to run both validators; the two
  filesystem collection loops were extracted into helpers with identical
  semantics.
- `docs/runbooks/README.md` and `README.md` — updated to route a new reader to
  the runbooks and to record that SBLA-008 is blocked.

Round 1 review at `af1b920afef8614c5cfc58bb1ddedfbab9933bc3` returned FAIL
with four Important findings. Remediation:

- canonicalizes role paths and rejects traversal/absolute/escaping input;
- makes the role CLI derive a complete non-empty committed diff from an exact
  reviewed base and reject dirty worktrees;
- enforces exact handoff heading order/uniqueness, contradictory policy phrases,
  and regular-file policy artifacts;
- separates builder, review, and remediation claim lifecycles;
- clarifies the SBLA-001 implementation-candidate versus acceptance-record SHAs;
- restores Claude Review's plagiarism-style responsibility; and
- preserves the mandatory external Claude-account simulations as an explicit
  unresolved gate rather than weakening it.

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
- **Layered policy checks.** Documents retain load-bearing phrases, the handoff
  template's level-two headings must appear exactly once in canonical order,
  contradictory authority/lifecycle phrases fail, and required policy artifacts
  must be regular files rather than symlinks. This is intentionally narrower
  than general natural-language interpretation but closes the Round 1 bypasses.
- **Executable path-boundary check.** §13.9 step 6 asks for a boundary check;
  the checker now derives the role's complete committed diff from an exact base
  SHA instead of trusting caller-supplied paths.
- **Separate ownership states.** A builder claim closes with its immutable
  handoff. Review owns only its append-only report. A failed review creates a
  separately bounded remediation claim so a disappeared author cannot leave an
  already-handed-off builder claim permanently active.

## Tests/checks run and results

Run with the pinned runtime (Node.js `v24.20.0`, pnpm `11.24.0`) at the new
repository path.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)** after Round 1 remediation:
  - Prettier check PASS
  - ESLint PASS, zero warnings
  - `astro check` — 30 files, 0 errors, 0 warnings, 0 hints
  - Unit tests — 7 files, 34 tests passed
  - Content adapter — foundation mode, 0 records
  - Graph adapter — foundation mode, 0 nodes and 0 edges
  - Evidence adapter — foundation mode, 0 sources
  - Static build — 1 page
  - Repository foundation contract PASS
- `pnpm test:a11y` — PASS, 1 test.
- `pnpm test:visual` — PASS, 1 test.
- `pnpm test:performance` — PASS, 1 test.
- `pnpm test:e2e` — PASS, 1 Chromium test with JavaScript disabled. The original
  builder sandbox could not launch Chromium; Codex ran the canonical command
  during remediation after clearing its orphaned preview process.

Fail-closed evidence at the filesystem level, not only against fixtures:

- Replacing `AGENTS.md` with a symlink in an isolated repository copy →
  `verify:foundation` exit **1**, reporting the missing regular-file artifact.
- Rewording the ledger's `24 hours` stale rule → exit **1**, naming the exact
  dropped rule.
- Reordering or duplicating the ten handoff headings → unit contract failure.
- Adding a conflicting Claude merge-authority grant → unit contract failure.
- Restoring each mutation → exit **0**.

Role-boundary coverage uses temporary Git repositories and exact reviewed bases:

- A clean, committed, review-only diff → exit 0 for Claude Review.
- A complete diff containing `src/pages/index.astro` → exit 1.
- Traversal such as `reviews/../src/pages/index.astro` → canonicalized and
  rejected.
- Absolute/repository-escaping paths → rejected.
- Dirty worktree or empty committed diff → rejected.
- Unknown role → rejected.

## Known uncertainties

- **The §18 pass condition for SBLA-002 is not fully met.** It requires both
  Claude roles to complete the path/source/handoff simulation or the documented
  chat-only fallback. Claude Team accounts A and B have not been provisioned, so
  neither run has happened. This handoff delivers the documented procedure, the
  environment record, and the executable boundary check — not the two completed
  runs. `docs/runbooks/claude-environments.md` records both roles as
  `OUTSTANDING` and SBLA-008 as blocked. **A reviewer should treat this as the
  open item on SBLA-002.**
- Natural-language policy validation remains deliberately bounded: exact
  heading structure, required rules, prohibited authority/lifecycle grants, and
  regular-file artifacts are enforced, but this is not a general semantic
  theorem prover.
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
- `tests/unit/operating-model-filesystem.test.ts`
- `tests/unit/role-paths-cli.test.ts`
- `tests/unit/role-paths.test.ts`
- `reviews/releases/SBLA-002-handoff.md`

Modified:

- `scripts/foundation/verify.mjs`
- `docs/runbooks/README.md`
- `README.md`

Independent review artifact preserved with the repair:

- `reviews/releases/SBLA-002-r1.md`

## Required reviewer action

Independently review the repaired exact commit and return PASS or FAIL per
criterion, with evidence and exact paths, to
`reviews/releases/SBLA-002-r2.md`. Do not repair the artifact and do not
overwrite Round 1.

Specifically decide:

1. Whether the six artifacts satisfy the SBLA-002 row of §18 and are usable
   without chat context.
2. Whether `AGENTS.md` and `CLAUDE.md` faithfully encode §13.2–13.4, §13.7, and
   §13.8 without inventing authority the master plan does not grant.
3. Whether the handoff template matches §13.6 exactly.
4. Whether the ledger and runbook implement §13.7, including the 24-hour stale
   rule and Codex-only merge authority.
5. Confirm that authoritative §18 still blocks SBLA-002 acceptance until both
   separate Claude role simulations or the end-to-end fallback are actually
   completed; do not count this Codex remediation/review as either run.
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
- The role path-boundary check derives the complete committed diff from an exact
  base, requires a clean/non-empty worktree state, canonicalizes paths, and
  rejects out-of-boundary writes and unknown roles.
- No SBLA-001 command, gate, or review report was renamed, removed, or weakened.
- `pnpm verify`, `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance` exit zero.
- `pnpm test:e2e` is green in an unsandboxed environment or in CI.
- Both separate Claude roles complete their §18 path/source/handoff simulation
  or the documented chat-only fallback is demonstrated end to end.
- The final working tree is clean.
