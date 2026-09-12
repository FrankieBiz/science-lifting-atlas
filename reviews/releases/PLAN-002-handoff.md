# Handoff: PLAN-002 — Balanced Claude implementation role

## Objective

Authorize Claude Code account A to perform bounded implementation work while
preserving Codex as technical lead and integrator, Claude account B as the
independent reviewer, and the existing evidence and acceptance gates.

## Inputs and exact paths

- Candidate base: `519fa546eca2a02a85a05095c17faae2ca5e8d80`
- Implementation commit: `c59660c823b873df138a8b5cdb68cc200d77cc03`
- Test-stabilization candidate commit:
  `cc3583789929203d7464dd836f7e85b3be91082a`
- Candidate tree: `fb7b2a651c525cc385062afff489dcdabd2a3a5a`
- Branch: `codex/claude-builder-role`
- Worktree: `C:\src\sbla-role-balance`
- Structured policy: `docs/runbooks/operating-policy.json`
- Decision: `docs/adr/0007-balanced-agent-implementation.md`
- Role-path validator: `scripts/foundation/role-paths.mjs`
- CLI enforcement: `scripts/foundation/check-role-paths.mjs`

## Constraints

- Codex remains technical lead, integrator, and the only role authorized to
  merge, record acceptance, close stale work, or promote scientific content.
- Claude account B remains independent and may not implement an artifact it
  reviews.
- Claude account A may edit only the exact normalized paths in a live,
  Codex-recorded claim.
- Claude Builder access is deny-by-default when no allowed paths are supplied.
- `content/`, `reviews/`, and `docs/runbooks/current-work.md` remain protected
  from Claude Builder changes.
- Multiple Account A sessions require separate worktrees and disjoint claims.
- Preserve all scientific, citation, licensing, accessibility, performance,
  resilience, owner-approval, and release gates.

## Work completed

- Added the Claude Builder role for Account A to the human and structured
  operating contracts.
- Added exact-path claim validation with normalization, duplicate rejection,
  protected-path denial, symlink and gitlink boundary checks, and base-policy
  trust.
- Added a CLI that evaluates a proposed change set against an explicit allowed
  path list while the policy itself remains deny-by-default.
- Kept Claude Research available to Account A and Claude Review assigned to
  independent Account B.
- Documented branch, worktree, handoff, and multi-session behavior.
- Added proposed ADR 0007 and updated the master plan and project entry-point
  instructions.
- Added unit and contract tests covering the role definition and enforcement.

## Decisions made

- Account A can be used heavily for implementation, but only inside an exact
  Codex-recorded path claim on a dedicated branch and worktree.
- Account A may also perform research when that role is separately claimed.
- Account B owns independent acceptance review and does not repair candidates.
- Codex owns task decomposition, claim recording, integration, stale-work
  handling, scientific-content promotion, and acceptance recording.
- Parallel Account A sessions are permitted only when their worktrees and exact
  file claims do not overlap.
- The machine-readable Builder policy deliberately contains an empty default
  allowlist; task-specific paths must be supplied explicitly to the validator.

## Tests/checks run and results

- Initial focused RED run: 43 tests ran; 35 passed and 8 failed because the old
  operating model had no Claude Builder role or exact-path enforcement.
- First `pnpm verify`: failed in TypeScript checking on two implicit-any errors
  in the new path normalizer; the implementation was typed and rerun.
- Focused GREEN run including filesystem coverage: 45/45 tests passed.
- Subsequent `pnpm verify`: failed the foundation contract because the ADR did
  not contain the required literal independent-review statement; the statement
  was added without changing the policy.
- A later full run reached one unrelated five-second timeout in
  `asset-conversion.test.ts`; its isolated rerun passed 21/21.
- The first full run with this handoff reached a five-second Windows subprocess
  timeout in the new empty-diff CLI test after 216/217 tests passed; its isolated
  file rerun passed 17/17. The test now has an explicit ten-second allowance for
  repository setup and subprocess cleanup.
- Stabilized focused run: 45/45 role and operating-model tests passed.
- Final `pnpm verify`: PASS — Prettier, ESLint, Astro typecheck with 0 errors and
  warnings, 16 unit files with 217/217 tests, content/graph/evidence gates,
  one-page Astro build, 3 portability files with 17/17 tests, foundation
  contract, asset spike, and asset decision checks.

## Known uncertainties

- The first real Claude Builder task still needs to prove the exact-path gate in
  live use, including its worktree and claim discipline.
- ADR 0007 and this candidate require independent Account B review before they
  can be integrated or accepted.
- Account B is currently session-quota blocked until 22:00 EDT on 2026-09-11;
  this is a scheduling constraint, not review evidence.
- The coordination branch gained Graphify entry-point instructions after this
  candidate's base, so integration must reconcile `AGENTS.md` and `CLAUDE.md`
  deliberately rather than overwrite either contract.

## Files created or modified

- `AGENTS.md`
- `CLAUDE.md`
- `docs/adr/0007-balanced-agent-implementation.md`
- `docs/product/master-plan.md`
- `docs/runbooks/operating-policy.json`
- `docs/runbooks/branch-and-worktree.md`
- `docs/runbooks/claude-environments.md`
- `reviews/releases/PLAN-002-handoff.md`
- `scripts/foundation/role-paths.mjs`
- `scripts/foundation/check-role-paths.mjs`
- `scripts/foundation/operating-model.mjs`
- `tests/unit/role-paths.test.ts`
- `tests/unit/role-paths-cli.test.ts`
- `tests/unit/operating-model-contract.test.ts`

## Required reviewer action

Claude Review account B must independently review the immutable candidate and
write only the exact pre-claimed append-only report path. The review must:

1. compare the human contracts, ADR, master plan, and structured policy;
2. adversarially test path normalization, duplicate claims, unclaimed paths,
   protected paths, symlinks, gitlinks, and base-policy trust;
3. confirm Codex alone retains integration, acceptance, stale-work, and
   scientific-content promotion authority;
4. confirm Account B cannot implement the artifact it reviews; and
5. verify multiple Account A sessions cannot share a worktree or overlapping
   claims.

Return PASS only with zero Critical and Important findings. Record nonblocking
Minor findings explicitly. Do not repair the candidate.

## Acceptance criteria

- Independent Account B review returns PASS with zero unresolved Critical or
  Important findings.
- `pnpm verify` passes on the immutable candidate.
- Claude Builder is denied without an explicit exact-path allowlist.
- Unclaimed, duplicated, protected, symlink-crossing, and gitlink-crossing paths
  are rejected.
- Codex remains the sole integration and acceptance authority.
- The first live Builder assignment uses a separate worktree and a disjoint,
  exact-path claim before ADR 0007 is marked Accepted.
