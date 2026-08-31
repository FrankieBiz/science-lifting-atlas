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
- Round 2 reviewed candidate: `c6f7d52358e12817a01fcdb528735a7cdf6cae5c`
- Round 2 repair candidate: `cb2ded3da5e9fb2336e471e78c2cef317f25f75f`
- Pre-review coordination-fix candidate:
  `26376e9c07179443683f54dce071c19613529b77`
- Round 3 reviewed candidate: `3f05124895c974db2d159b75f08ed491ec148912`
- Round 3 repair candidate: `a4b147b42eae7e5268f646f0362553c482dca51d`
- Owner-directed sequential-run/tool-mapping candidate:
  `4acd27cc30261db1f177d0b4fe6523c938e12294`
- Role-mapping reconciliation candidate:
  `09cd757eed8965b54704a676cb3ea993a481d775`
- Claude Research readiness commit:
  `f2e0f00543bdc923e0b436059598314c237f1f85`
- Round 4 Claude Review report commit:
  `555d6dd0a406ca50af94ee887c071640bc5ef17b`
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

- `docs/runbooks/operating-policy.json` — canonical structured authority,
  lifecycle, and write boundaries. Markdown explains this policy but cannot
  expand it.
- `scripts/foundation/operating-model.mjs` — pure validator requiring every
  artifact to exist, the handoff template to carry all ten §13.6 headings, each
  document to retain its load-bearing rules, and the structured policy to match
  the authoritative values exactly.
- `scripts/foundation/role-paths.mjs` + `check-role-paths.mjs` — immutable
  checker-side write-boundary constants cross-checked against policy loaded from
  the trusted base, plus a Git-derived CLI for §13.9 step 6. The CLI requires a
  clean worktree, requires the base to be an ancestor of `HEAD`, and enumerates
  additions, modifications, deletions, Git modes, and both sides of renames from
  the reviewed base, so a caller cannot omit a prohibited change. Claude Review
  additionally requires the one exact Codex-claimed path and may only add that
  new regular report file.
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

Round 2 review at `c6f7d52358e12817a01fcdb528735a7cdf6cae5c`
returned FAIL with four Important findings. This remediation:

- makes the Git-derived boundary check include deletions and treat renames as a
  deletion plus addition, requires the reviewed base to be an ancestor, and
  adds executable regressions for all three cases;
- replaces policy-by-English-blacklist as the source of authority with a strict
  structured policy consumed by role-path enforcement and checked by
  `pnpm verify`;
- defines a Codex-mediated exact-path claim and immutable closure lifecycle for
  restricted reviewers, corrects `CLAUDE.md` so Claude never edits the ledger,
  and records the missing Round 2 pre-claim honestly in the recovery log; and
- corrects the environment record to identify the original sandbox as the
  SBLA-002 builder sandbox, not a Claude environment.

A final pre-review rehearsal then caught that placing Codex's claim commit in a
restricted role branch would contaminate the Git-derived role diff. The
structured policy and runbooks now keep the durable claim on the Codex
coordination branch while the restricted branch starts from the exact reviewed
artifact commit. The lifecycle contract test pins both values.

Round 3 review at `3f05124895c974db2d159b75f08ed491ec148912`
returned FAIL with two Important findings. At that candidate, the external
Claude simulations remained outstanding. The locally actionable path-gate
finding was repaired by loading write authority from the exact trusted base
commit and by supporting a trusted-checkout runner that targets the restricted
worktree explicitly. Tests reproduce both same-commit policy
self-authorization and target-branch checker replacement.

On 2026-08-31, the owner clarified that the two Claude readiness runs will be
sequential and that ChatGPT Codex fills the Codex role. Sequential timing is
compatible with the master plan. The runbook still requires distinct Claude
Team account A and account B, because §§13.3–13.4 make that identity separation
explicit; separate sessions in one account are not substituted for it. Internal
Codex review reports remain useful pre-review evidence but do not count as the
Claude Review gate.

Both readiness runs are now complete. Account A committed its three-path
Research packet at `f2e0f00543bdc923e0b436059598314c237f1f85`. Distinct account
B committed the immutable Round 4 review at
`555d6dd0a406ca50af94ee887c071640bc5ef17b`; Codex independently confirmed the
one-file boundary and pinned verification. Round 4 returned FAIL with two
Important findings. This remediation synchronizes the stale handoff and makes
the exact append-only review claim executable: one required `--allowed-path`,
add-only status, and regular-file Git mode. It also pins the distinct A/B
identity rule in structured policy. A new Round 5 remains the acceptance gate.

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
- **Structured policy is authoritative.** Authority, claim lifecycle, and role
  boundaries plus the distinct Claude account identity contract live in
  `operating-policy.json`. The validator checks its exact schema and values, and
  the role-path checker consumes its boundaries. Markdown retains required
  routing statements and explicitly cannot override the structured policy.
  Exact phrase checks remain defense-in-depth only; no claim of general
  natural-language interpretation is made.
- **Executable path-boundary check.** §13.9 step 6 asks for a boundary check;
  the checker now derives the role's complete committed diff from an exact base
  SHA instead of trusting caller-supplied paths. Deletions are included, renames
  are evaluated as old and new paths, and a divergent base is rejected.
- **Trusted checker, trusted policy.** Codex or CI invokes the checker from a
  trusted checkout with `--repository <restricted-worktree>`. The checker loads
  `operating-policy.json` from the exact base commit, validates its boundaries
  against the immutable checker contract, and never authorizes from mutable
  target `HEAD` state.
- **Separate ownership states.** A builder claim closes with its immutable
  handoff. Review owns only its append-only report. A failed review creates a
  separately bounded remediation claim so a disappeared author cannot leave an
  already-handed-off builder claim permanently active. Because restricted
  reviewers cannot edit the ledger, Codex records and closes their exact report
  claims on their behalf on the coordination branch. The restricted role branch
  remains based on the reviewed artifact commit, keeping Codex ledger edits out
  of its role-path diff.

## Tests/checks run and results

Run with the pinned runtime (Node.js `v24.20.0`, pnpm `11.24.0`) at the new
repository path.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)** after Round 4 remediation:
  - Prettier check PASS
  - ESLint PASS, zero warnings
  - `astro check` — 30 files, 0 errors, 0 warnings, 0 hints
  - Unit tests — 7 files, 47 tests passed
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
- Changing the structured merge authority to Claude Review → unit contract
  failure naming `authority.merge`.
- Changing builder-claim closure to post-review or making Claude Review record
  its own broad claim → unit contract failures naming the exact lifecycle
  fields.
- Restoring each mutation → exit **0**.

Role-boundary coverage uses temporary Git repositories and exact reviewed bases:

- A clean, committed, review-only diff → exit 0 for Claude Review.
- A complete diff containing `src/pages/index.astro` → exit 1.
- Deleting prohibited `src/pages/index.astro` while adding an allowed review
  file → exit 1, naming the deleted path.
- Renaming prohibited `src/pages/index.astro` into `reviews/` → evaluated as
  deletion plus addition and exit 1, naming the prohibited source path.
- A base commit that is not an ancestor of `HEAD` → exit 2.
- A same-commit policy edit that grants Claude Review the empty prefix while
  changing application code → exit 1, naming the policy and prohibited paths.
- A target branch that replaces its checker and changes application code → the
  trusted external checker exits 1, naming the modified checker path.
- Omitting Claude Review's exact `--allowed-path` → exit 2.
- Modifying an existing review report, modifying the artifact under review, or
  adding any second path beneath `reviews/` → exit 1 with the exact violation.
- Adding a symlink at the exact claimed report path → exit 1, naming Git mode
  `120000`.
- Traversal such as `reviews/../src/pages/index.astro` → canonicalized and
  rejected.
- Absolute/repository-escaping paths → rejected.
- Dirty worktree or empty committed diff → rejected.
- Unknown role → rejected.

Additional required gates after Round 4 remediation:

- `pnpm test:e2e` — PASS, 1 Chromium test with JavaScript disabled.
- `pnpm test:a11y` — PASS, 1 test.
- `pnpm test:visual` — PASS, 1 test.
- `pnpm test:performance` — PASS, 1 test.
- `pnpm audit --audit-level high` — PASS, no known vulnerabilities.

## Known uncertainties

- **The §18 pass condition for SBLA-002 is not yet met.** Claude Research account
  A passed at `f2e0f00543bdc923e0b436059598314c237f1f85`; distinct Claude Review
  account B passed the environment-readiness simulation and committed Round 4
  at `555d6dd0a406ca50af94ee887c071640bc5ef17b`. Round 4's substantive verdict
  was FAIL because this handoff was stale and the review gate did not yet
  enforce its exact append-only path. This remediation corrects both defects;
  acceptance still requires a fresh independent account-B review of the new
  exact candidate.
- Markdown policy descriptions are explanatory rather than authoritative. The
  machine-readable policy now pins the distinct A/B identity rule and exact
  append-only review-claim lifecycle. Exact phrase lint remains defense-in-depth
  and is not represented as a semantic theorem prover.
- The repository has no Git remote. Nothing has been pushed or published.

## Files created or modified

Created:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/runbooks/handoff-template.md`
- `docs/runbooks/current-work.md`
- `docs/runbooks/branch-and-worktree.md`
- `docs/runbooks/claude-environments.md`
- `docs/runbooks/operating-policy.json`
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
- `reviews/releases/SBLA-002-r2.md`
- `reviews/releases/SBLA-002-r3.md`
- `reviews/releases/SBLA-002-r4.md`

## Required reviewer action

Distinct Claude Review account B must independently review the repaired exact
commit in a new session and return PASS or FAIL per criterion, with evidence and
exact paths, to `reviews/releases/SBLA-002-r5.md`. Do not repair the artifact and
do not overwrite any prior round.

Specifically decide:

1. Whether the six artifacts satisfy the SBLA-002 row of §18 and are usable
   without chat context.
2. Whether `AGENTS.md` and `CLAUDE.md` faithfully encode §13.2–13.4, §13.7, and
   §13.8 without inventing authority the master plan does not grant.
3. Whether the handoff template matches §13.6 exactly.
4. Whether the ledger and runbook implement §13.7, including the 24-hour stale
   rule and Codex-only merge authority.
5. Confirm both distinct-account role simulations remain complete and that
   readiness PASS is not confused with the Round 4 candidate FAIL.
6. Whether the added validators strengthen the contract without weakening any
   SBLA-001 gate.
7. Whether the trusted-checkout runner rejects target-branch policy and checker
   self-modification while deriving the complete target worktree diff.
8. Whether the Codex-mediated review claim is durably recorded before review
   and can be closed without granting the reviewer ledger access.
9. Whether the repository relocation and `main` fast-forward were recorded
   adequately.
10. Whether Claude Review can change only the one exact claimed new report and
    the gate rejects prior-report edits, artifact edits, extra paths, and
    non-regular Git entries.

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
  ancestor base, requires a clean/non-empty worktree state, canonicalizes paths,
  includes deletions and both sides of renames, and rejects out-of-boundary
  writes, unknown roles, mutable-policy self-authorization, replacement of the
  target branch's checker, modifications or extra paths under an exact review
  claim, and non-regular Git entries.
- The structured policy requires distinct Claude Team accounts A and B and
  rejects the claim that a second session in the same account satisfies review.
- The environment record and this handoff agree that both readiness simulations
  passed, Round 4 failed on candidate defects, and Round 5 is the acceptance
  review.
- No SBLA-001 command, gate, or review report was renamed, removed, or weakened.
- `pnpm verify`, `pnpm test:a11y`, `pnpm test:visual`, and
  `pnpm test:performance` exit zero.
- `pnpm test:e2e` is green in an unsandboxed environment or in CI.
- Both separate Claude roles complete their §18 path/source/handoff simulation
  or the documented chat-only fallback is demonstrated end to end.
- The final working tree is clean.
