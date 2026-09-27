# ADR 0007 — Throughput, risk-tiered review, and parallel delivery

- Status: Accepted (owner approval 2026-09-27)
- Date: 2026-09-27
- Task: PLAN-002 (owner-requested efficiency re-review)
- Supersedes: none. Amends ADR 0006's review-count rules and master plan
  §9.8, §12.3, §14 Phase 5, §17, and §18 dependencies.

## Context

After 29 calendar days and 254 commits the project has 11 of 20 queue gates
accepted, 23 approved but unpublished claims covering one muscle and two
exercises, and one placeholder page. Release 1 needs roughly 28 muscles and
75–120 exercises. At the observed rate the content waves alone run for most of
a year.

Measured cost drivers (from `reviews/` and `git log` at `7f75ec5`):

1. **Review volume, not review value.** 34 review reports, median 5,624 words,
   about 224,000 words in total, against about 6,800 words of application
   source. Only 1 of 12 reviewed tasks (SBLA-005) passed on the first round. SBLA-002 took five
   rounds and SBLA-009 took seven (four evidence plus three integrity-gate).
   SBLA-011 took four, even though ADR 0006 already specifies one remediation
   and one recheck.
2. **What those rounds found.** Of 67 Critical or Important findings:
   Science 19, Publish-gate 20, Bookkeeping 14, Tooling/CI 7, Lint arms race 5,
   License 1, UX 1. The science and publish-gate findings (39, or 58%) justify
   independent review; SBLA-009's extra evidence rounds caught real errors,
   including a missed 2023 meta-analysis and a misread sample of 80 versus 5.
   The bookkeeping, tooling, and lint findings (26, or 39%) came mostly from
   the process auditing itself. SBLA-011 rounds 2 and 3 existed only to chase
   new wordings past a certainty regex, which no finite regex can close.
3. **A serial critical path through 3D.** §18 makes SBLA-017 (catalog) wait
   for SBLA-015 (full 3D slice), and every content wave waits for 017. Gate A
   already made 2D the authoritative anatomy path, so 3D is an enhancement.
   The longest job in the project is blocked behind an optional one.
4. **Uniform rigor for non-uniform claims.** Descriptive anatomy facts
   (attachments, innervation) go through the same systematic
   search–screen–appraise pipeline as training-outcome claims. SBLA-009
   produced about 300,000 words of research artifacts, including a 1.7 MB
   screening file, for 23 claims.
5. **The owner as courier.** Work moves by hand between Codex, a Claude
   account without repository access, and a second Claude account, across
   Mac and Windows machines. Handoffs restate commit and tree hashes in prose,
   which is itself the source of many bookkeeping findings.

## Decision

Keep every scientific, licensing, accessibility, and publication gate. Cut
ceremony and serialization.

### D1. Review by risk tier

| Tier             | Scope                                                                                 | Independent review                                                                     |
| ---------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **E — Evidence** | Claims, citations, certainty, syntheses                                               | Every claim, as today. Extra rounds allowed when science findings remain open.         |
| **P — Publish**  | Code that decides what becomes public: gates, manifests, validators, claim components | One review per change set. Two-round cap.                                              |
| **B — Build**    | UI, tooling, CI, docs, runbooks, assets pipeline                                      | Automated checks and builder self-check only. Reviewed at milestone gates C, B, and E. |

### D2. Hard round cap outside Tier E

Review, one bounded remediation, one recheck. If Critical or Important
findings remain after the recheck, the owner decides in writing: accept with
recorded risk, narrow scope, or drop the item. There is no third round.

### D3. Lints are safety nets, not proofs

Automated prose lints (certainty language, MDX boundaries) are defense in
depth behind human-equivalent claim review. A reviewer who finds a new bypass
wording records it as Minor with a fixture, and the builder adds the fixture
in the next change. A lint bypass blocks only when approved content actually
exploits it.

### D4. Claim-tier evidence pipeline

| Claim types                                                                         | Pipeline                                                                                                                              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `anatomy`, `function` with certainty `established-descriptive-fact`                 | Two or more authoritative primary or reference sources, exact locators, citation-entailment check. No systematic search or screening. |
| `exercise-mechanics`, `acute-response`, `safety-context`                            | Targeted search with a saved query, extraction, citation entailment, contradiction search.                                            |
| `longitudinal-adaptation`, comparative, and any claim a practical takeaway rests on | Full §9.8 pipeline, unchanged.                                                                                                        |

Every claim is still independently checked. Search and screening records are
kept once per wave and topic and reused across records, not rebuilt per page.

### D5. Parallel lanes

Replace the §18 dependency chain from SBLA-012 onward with three lanes that
converge at release:

| Lane                 | Tasks                                                                         | Depends on                                      |
| -------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| **Product**          | 012 design system and archetypes → 016 search and compare → 2D anatomy plates | 011                                             |
| **Evidence**         | 017 catalog (starts now) → 018 Wave 1 (chest and shoulders) → 019 later waves | 010 for 017; 012 archetypes for 018 publication |
| **3D (enhancement)** | 013 pipeline → 014 engine → 015 3D slice                                      | 006, 012 tokens                                 |

§12.3's "3D mapping or accessible visual fallback exists" is satisfied by the
authoritative 2D plate, so pages publish without waiting for 3D.

### D6. Ship a public beta after Wave 1

Gate E (beta) may run after SBLA-018 with the product lane complete and 3D
optional. Later waves ship as owner-approved increments. Gate F (full launch)
stays after SBLA-019 and SBLA-020.

### D7. One environment, machine-written bookkeeping

- Both Claude roles run as repository-capable Claude Code sessions in their own
  worktrees, on distinct accounts, with `check-role-paths` enforcing write
  boundaries. The chat-only fallback remains for emergencies only.
- A `pnpm handoff <task>` script writes the commit, tree, changed paths, and
  real check output into the handoff. Reviewers stop auditing hand-copied
  hashes.
- Claims are recorded by whichever session holds the Codex role (D8), in the
  same session that starts the task, so the owner never carries a claim
  between tools. Restricted write boundaries are unchanged. _Implementation
  note: the proposal let restricted roles write the ledger directly; that
  would widen boundaries that `check-role-paths` compares against an immutable
  base policy, and D8 removes the courier step without it._
- Review reports lead with a findings table. Target length is 1,500 words
  outside Tier E.

### D8. Builder capacity

The builder role may be filled by Codex or by a Claude Code session on an
account that is neither the author's nor the reviewer's for that artifact.
Independence rests on the author never reviewing their own work, not on vendor.
This allows two builder sessions to run the Product and 3D lanes in parallel.

## Consequences

- Roughly half of past review rounds would not have occurred. The science and
  publish-gate findings that justified review would still have been caught.
- Content production can start this week instead of after 3D is finished.
- Users get a public, useful product after one content wave.
- The certainty lint may admit wordings that a determined adversary constructs.
  Tier E claim review, not the lint, remains the guarantee. That was always the
  real control.
- Light-tier anatomy claims forgo systematic search. Risk: a contested
  descriptive fact is missed. Mitigation: any claim contradicted during review
  is promoted to the full pipeline, and the contradiction search in
  `exercise-mechanics` claims often surfaces anatomy disputes.
- `operating-policy.json`, `scripts/foundation/operating-model.mjs`, and the
  operating-model contract tests encode ADR 0006. Acceptance requires one
  Codex change set updating them, plus master plan §9.8, §12.3, §14, §18,
  `AGENTS.md`, and the README, in the same change.

## Alternatives considered

- **Keep current process, add parallel sessions.** Rejected: more sessions
  multiply the same bookkeeping loops and the owner's courier load.
- **Drop independent review for everything but claims.** Rejected: 20
  publish-gate findings show that the code deciding what goes public needs
  independent eyes.
- **Sample-audit claims instead of reviewing each one.** Rejected: master plan
  §3.3 targets 100% citation integrity, and SBLA-009 shows AI drafts carry real
  errors.
- **Cut 3D entirely.** Not needed. Moving it off the critical path captures
  most of the benefit and keeps the option.

## Reversal cost

Low. Every change is policy and dependency ordering. No data format,
published content, or evidence record changes. A later ADR can restore any
removed layer; claim records remain fully reviewed throughout.
