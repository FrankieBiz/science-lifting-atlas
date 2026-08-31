# Handoff: SBLA-002 — Claude Research environment-readiness simulation

## Objective

Complete the Claude Research half of the master plan §13.9 readiness gate, which
authoritative §18 makes a pass condition for SBLA-002: prove this role can read
the repository at a reviewed commit, write only inside its permitted paths,
extract from a lawful source with exact locators, and produce a handoff that
stands alone without chat context.

## Inputs and exact paths

- Canonical plan: `docs/product/master-plan.md` (§13.3, §13.6–§13.9, §18)
- Operating contract: `AGENTS.md`, `CLAUDE.md`
- Runbooks: `docs/runbooks/branch-and-worktree.md`,
  `docs/runbooks/claude-environments.md`, `docs/runbooks/handoff-template.md`,
  `docs/runbooks/current-work.md`, `docs/runbooks/operating-policy.json`
- Prior review history: `reviews/releases/SBLA-002-r1.md`, `-r2.md`, `-r3.md`,
  and `reviews/releases/SBLA-002-handoff.md`
- Base commit: `e22cdf3855c069e356659c513eab2600a7815a2c`
- Ledger claim: committed by Codex at `77a750fa9e868e73c5bc46e0f273a085371c247a`
  on `codex/SBLA-002-agent-operating-model`
- Branch: `claude-research/SBLA-002-readiness`
- Worktree: `.worktrees/sbla-002-claude-research-readiness`
- Source: the CC0 readiness fixture supplied inline in the readiness packet

### Base provenance

The packet originally named `555dc237c24cab0e3b25caefa55a6a91ba888d62`. Codex
subsequently issued `e22cdf3855c069e356659c513eab2600a7815a2c` as the corrected
base and committed the path claim against it, so this run has no unilateral base
deviation: it starts from the commit Codex assigned.

`e22cdf3` also corrects an error in an earlier Codex-role edit made by _this_
Claude session. That edit asserted a separate **session** satisfies §13.9
independence. Codex tightened it: §§13.3–13.4 require distinct Claude Team
**accounts** A and B, and two sessions in one account do not substitute for that
identity boundary. The correction is accepted and materially narrows who may
perform the outstanding Claude Review run.

## Constraints

- Claude Research writes **only** `research/` and `content-drafts/`. This run
  touched only three files under `research/`.
- The ledger is not mine to edit. Codex committed the ownership claim at
  `77a750f` on its own coordination branch, so it is deliberately **not** part of
  this role's diff, per §13.7 and the packet.
- Model memory is not evidence (§13.8). Every extracted fact carries a line
  locator into the assigned fixture.
- This is a readiness simulation. **No output may be promoted to `content/`**, and
  it establishes nothing about anatomy, exercise, or training.

## Work completed

- `research/questions/SBLA-002-readiness.md` — the test research question, scoped
  to what the fixture can actually answer, with search strategy recorded as "not
  applicable" rather than fabricated.
- `research/extractions/SBLA-002-readiness.md` — source record (title, version,
  licence, provenance, access level, locator scheme, retrieval date); seven
  extracted facts F1–F7 each with an `[L#]` locator; interpretation held in a
  separate section; risk-of-bias and limitations; applicability; conflicts;
  contradictory-evidence search; per-claim uncertainty.
- This handoff.

## Decisions made

- **No PICO/PECO.** The fixture has no population, intervention, comparator, or
  outcome. §9.3 wants atomic answerable questions; inventing a PICO frame for an
  operating-model source would be theatre. Recorded as a limitation instead.
- **No search strategy.** The source was assigned directly, so there is no
  database, query string, or screening log. Writing one would misrepresent a
  plumbing test as evidence work.
- **No evidence grade assigned.** The fixture is not a study, so §9.4 certainty
  language does not apply. Assigning a grade would corrupt the certainty scale
  before SBLA-007 defines it.
- **"No contradictory evidence" reported as near-vacuous.** With one
  self-consistent seven-line source, the honest reading is that the fixture is
  too narrow to contradict itself — not that contradiction was robustly ruled
  out. Stated explicitly so it cannot be quoted as strength.
- **Fixture corroborates the repository, does not establish it.** F4/F5 agree
  with `AGENTS.md` and `CLAUDE.md`; a fixture agreeing with the repo is weak
  evidence about the world and adequate for a plumbing test.

## Tests/checks run and results

- Branch `claude-research/SBLA-002-readiness` in its own worktree at base
  `e22cdf3`. Confirmed clean before any file was written.
- Ledger claim verified present at `77a750f` before writing, and confirmed to
  name exactly the three paths below and the base `e22cdf3`.
- All twelve files the packet requires reading were confirmed present at the base
  commit.
- Three permitted target directories confirmed present.
- **Boundary check — must be run by Codex from a trusted checkout**, not by this
  role, since a role validating its own boundary is not a control:

  ```
  node <codex-checkout>/scripts/foundation/check-role-paths.mjs \
    claude-research --base e22cdf3855c069e356659c513eab2600a7815a2c \
    --repository <repo>/.worktrees/sbla-002-claude-research-readiness
  ```

  Expected: exit 0, three paths, all under `research/`.

- `pnpm verify`: **PASS (exit 0)** — see the recorded result below.
- `git diff --name-status e22cdf3...HEAD`: three `A` rows, all under
  `research/`, recorded verbatim in the returned result.

## Known uncertainties

- **The ledger claim is recorded** at `77a750f`, so the procedural gap noted in
  the draft of this handoff is closed. It was committed by Codex, not by this
  role, which is what §13.7 requires.
- **The boundary gate has not been run from a trusted checkout.** Only Codex can
  satisfy that control.
- **This run proves plumbing, not research competence.** A CC0 seven-line fixture
  says nothing about handling a paywalled RCT with ambiguous reporting. §13.9
  step 5 asks for "one lawful test source" and this satisfies the letter; a
  reviewer may reasonably want a real paper before trusting SBLA-008.
- **The Claude Review half is still outstanding** and, per the corrected
  `claude-environments.md`, must run in a **distinct Claude Team account B** —
  not merely a new session in this account. It also must not be an account that
  authored SBLA-002/003/004, which excludes this one.
- **`pnpm verify` covers the repository, not the research content.** It proves
  these files break no gate; it does not and cannot judge whether the extraction
  is good evidence work. Only the reviewer can.

## Files created or modified

Created, all within this role's permitted paths:

- `research/questions/SBLA-002-readiness.md`
- `research/extractions/SBLA-002-readiness.md`
- `research/packets/SBLA-002-claude-research-readiness-handoff.md`

Modified: none. Nothing outside `research/` was touched.

## Required reviewer action

Confirm or reject the Claude Research half of the §13.9 gate, and record the
result in the `Readiness result` column of
`docs/runbooks/claude-environments.md`. Specifically decide:

1. Whether the diff is confined to `research/`, verified by the boundary gate run
   from a trusted checkout.
2. Whether every extracted fact carries an exact locator and no claim exceeds the
   source.
3. Whether facts and interpretation are genuinely separated.
4. Whether omitting PICO/PECO, a search strategy, and an evidence grade is
   correct scope discipline or an evasion.
5. Whether a CC0 fixture satisfies §13.9 step 5's "one lawful test source", or
   whether a real paywalled source is required before SBLA-008.
6. Whether basing on `4acd27c` rather than the packet's `555dc23` is acceptable.

## Acceptance criteria

- Branch and worktree correctly named, created from the reviewed base commit.
- A durable ledger claim exists, committed by Codex, covering exactly these three
  paths.
- The diff touches nothing outside `research/`, proven by the boundary gate.
- Every extracted fact has an exact locator; interpretation is separated;
  limitations, applicability, conflicts, contradictory evidence, and uncertainty
  are all recorded.
- The handoff is actionable with no access to this session.
- `pnpm verify` is green, or its absence is explicitly stated.
