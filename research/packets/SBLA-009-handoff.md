# Handoff: SBLA-009 — evidence pass and draft claims

## Objective

SBLA-009 in master plan §18 requires Claude Research, followed by Claude Review,
to deliver:

> Search, screening, extraction, appraisal, synthesis, and draft claims for one
> muscle/two exercises.

The pass condition is that the artifacts are complete, contain no memory-only
evidence, and give exact locators. This task executes the `search → acquire →
screen → extract → appraise → synthesize → draft` portion of the §9.8 research
pipeline for the SBLA-008 vertical slice: pectoralis major, barbell flat bench
press (X), and bilateral standing cable fly at shoulder height (Y).

The result is a **candidate for independent Account-B review**, not accepted or
published content. Nothing in `content/` changed.

### Authorship and continuity disclosure

Claude Research Account A performed the searches, screening, extraction,
appraisal, synthesis, and scientific drafting and created the ten scientific
artifacts listed below. Its max-effort Opus session
`8f6e0e90-793c-49fb-aad8-a717823f3661` reached its usage limit after 1 hour 16
minutes, before it could run its already-written packet generator or create this
administrative handoff.

Codex then:

1. corrected the uncreated packet filename in the coordination claim so the
   lowercase record ID and filename invariant could agree;
2. ran Account A's external `build-packet.mjs` after changing only that output
   path and its now-obsolete path note;
3. formatted the Account-A artifacts without changing their scientific content;
4. repaired the independently exposed `content-drafts/` validation gate on a
   separate Codex branch and advanced this still-uncommitted worktree to the
   fixed accepted base; and
5. assembled this handoff mechanically from the Account-A artifacts, repository
   metadata, and real command output.

Codex did not add, approve, or alter a scientific claim. The transfer is recorded
before this file was written in the coordination ledger. Account B remains the
independent reviewer and must audit the complete artifact, including this
continuity path.

## Inputs and exact paths

### Accepted dependency

- SBLA-008 accepted commit:
  `0fde685a33118c7ffcdcaf189e104c37ac2cea66`.
- SBLA-009 prerequisite decisions and preprint-stage schema:
  `8ca59e850beb0770554074d474a3ff3a9e16710a`.
- Non-overlapping content-draft validation repair integrated after Account A
  wrote its artifacts: `303b23fb7e4a8794c9d83e64b5b3d4253006074f`.
- Current research diff base:
  `303b23fb7e4a8794c9d83e64b5b3d4253006074f`.

The base advancement is explicit: Account A began at `8ca59e8`; before any
research commit, Codex fast-forwarded the branch to `303b23f`. The three Codex
gate files do not overlap any research path. The role-boundary diff for this
candidate is measured from `303b23f` and contains only the eleven claimed paths.

### Workspace identity

- Branch: `claude-research/SBLA-009-evidence`
- Worktree: `C:\src\s009research`
- Claude role: Claude Research, Account A
- Continuity role: Codex, handoff path only
- Coordination branch: `codex/SBLA-007-review-coordination`
- Latest claim-transfer record at handoff time:
  `6cbfd32` (`docs: transfer SBLA-009 continuity handoff`)

### Governing inputs read

- `AGENTS.md`
- `CLAUDE.md`
- `docs/product/master-plan.md`
- `docs/runbooks/current-work.md` from the coordination branch
- `reviews/releases/SBLA-008-acceptance.md`
- `reviews/releases/SBLA-009-prerequisite-decisions.md`
- `research/questions/SBLA-008-vertical-slice.md`
- `research/searches/SBLA-008-search-strategy.md`
- `research/screening/SBLA-008-eligibility-plan.md`
- `research/packets/SBLA-008-handoff.md`

## Constraints

- Claude Research could write only the ten claimed `research/` and
  `content-drafts/` scientific paths. Codex could write only this transferred
  handoff path inside the research candidate.
- No model-memory fact may support a claim. A source had to be opened and its
  access level and locator recorded.
- No copyrighted full text is stored. Metadata, lawful links, original summaries,
  and minimal locators are retained.
- No access-control workaround was permitted. In particular, no substituted user
  agent was used for Cochrane, and provider blocks were recorded rather than
  bypassed.
- Index Y stayed narrow. Related fly conditions were retained but not silently
  pooled or promoted.
- Contralateral designs could only enter a separate sensitivity analysis.
- Regional hypertrophy remained secondary.
- Non-English records remained eligible under the recorded translation ladder.
- Duplicates are deduplication events, not exclusions. `awaiting-full-text` is
  neither included nor excluded.
- `content-drafts/` remains unpublished. SBLA-010 owns the complete independent
  evidence/citation/adversarial review; SBLA-011 owns schema splitting, content
  promotion, and graph/UI integration.

## Work completed

### Artifact inventory

All JSON files parse after formatting. Counts and sizes below are measured from
the candidate worktree before commit.

| Artifact                                                                   | Role                                   |                Measured size | Main contents                                                                                                          |
| -------------------------------------------------------------------------- | -------------------------------------- | ---------------------------: | ---------------------------------------------------------------------------------------------------------------------- |
| `research/searches/SBLA-009-search-receipts.json`                          | Account A                              |  133,277 bytes / 1,185 lines | 43 receipts, platform/version/transport/query/count/failure fields, historical and fresh E1 rows                       |
| `research/screening/SBLA-009-screening-flow.json`                          | Account A                              | 752,730 bytes / 18,450 lines | 1,109 unique records, 252 duplicate retrieval events, four-state terminal decisions, amendments, exclusion-code counts |
| `research/extractions/SBLA-009-source-extractions.json`                    | Account A                              |  303,079 bytes / 6,756 lines | 76 structured extractions plus the awaiting-full-text register and proposed source IDs                                 |
| `research/appraisals/SBLA-009-appraisals.md`                               | Account A                              |     21,479 bytes / 233 lines | Tier-specific risk-of-bias, applicability, named defects, status and certainty treatment                               |
| `research/syntheses/SBLA-009-synthesis.md`                                 | Account A                              |     25,325 bytes / 314 lines | Q1/Q2 synthesis, contradiction map, publication-bias probe, heterogeneity, limitations                                 |
| `research/packets/sbla-009-evidence-packet.json`                           | Account A generator, executed by Codex |     60,307 bytes / 465 lines | Strict `evidencePacketSchema` object: 43 searches, 76 included IDs, 16 substantive exclusions, decision log            |
| `content-drafts/muscles/pectoralis-major.md`                               | Account A                              |      8,990 bytes / 135 lines | Unpublished reader draft with claim/source references and boundaries                                                   |
| `content-drafts/exercises/barbell-flat-bench-press.md`                     | Account A                              |      8,144 bytes / 125 lines | Unpublished X draft with evidence-tier separation                                                                      |
| `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md` | Account A                              |     10,351 bytes / 150 lines | Unpublished Y draft centered on evidence absence and related-condition limits                                          |
| `content-drafts/syntheses/SBLA-009-atomic-claims.json`                     | Account A                              |   60,380 bytes / 1,163 lines | 22 unpublished draft claims and 5 explicit absence records                                                             |
| `research/packets/SBLA-009-handoff.md`                                     | Codex continuity                       |                    this file | Standalone provenance, checks, limitations, and review instructions                                                    |

### Search and screening result

The versioned companion artifacts close both prerequisite equations:

- `records retrieved = duplicates + unique after deduplication`
- `1361 = 252 + 1109`
- `unique after deduplication = excluded + awaiting-full-text + included`
- `1109 = 1009 + 24 + 76`

The sum of all exclusion-code counts is 1,009. No duplicate and no
`awaiting-full-text` record appears as a substantive exclusion in the strict
packet. The packet contains only 16 exclusions that reached candidate-evidence
stage or required explicit retraction/multi-report handling; the complete
per-record disposition remains in the screening companion.

The historical Europe PMC E1 count of 334 is preserved as its own labelled
receipt. Account A reports fresh amended E1 counts of 397 for the original date
window and 398 for the window extended through 2026-09-13. PubMed S1–S4
route-level composites returned 11,765 records; the declared retrieval design
brought six pre-specified PubMed strata and the other named routes into
record-level screening rather than silently claiming exhaustive screening of
all composite hits.

### Evidence result recorded by Account A

The primary X-versus-index-Y hypertrophy question remains unanswered in the
retrieved evidence. Account A records no study of index Y and no study comparing
X with a cable fly for pectoralis-major size. The artifacts label this as absence
of evidence, not equivalence or ineffectiveness, and contain no press-versus-fly
hypertrophy claim.

The candidate instead drafts scoped claims about Q1 anatomy/function, regional
differentiation, limited pectoralis size-change evidence, and one related
press-versus-cable mechanics comparison. These are only Account-A draft claims.
Nine contradictions are retained. Two retrieved retracted sources, PMID 31188644
and PMID 30779716, are blocked from supporting live claims.

The pre-specified contralateral sensitivity set is empty. Regional hypertrophy
remains a secondary question. No incompatible outcomes were pooled.

## Decisions made

1. **Retain narrow Y.** No related fly becomes index Y merely because direct
   evidence is absent. This implements the pre-search owner decision and avoids
   result-driven scope expansion.
2. **Use companion artifacts as authoritative flow provenance.** The strict
   evidence packet remains compact; the search receipt and screening flow carry
   fields and terminal states the packet schema intentionally lacks.
3. **Declare the retrieval design.** Account A records all composite counts but
   screens pre-specified retrieval strata because record-level screening of all
   11,765 S1–S4 hits was not feasible in one pass. The unscreened residual is a
   limitation, not hidden completeness.
4. **Amend deduplication transparently.** `AM-2` applies normalized-title fuzzy
   keys across identifier-bearing and identifier-less records. Thirteen
   fuzzy-only merges were manually confirmed.
5. **Retain post-hoc exclusion-code amendments.** `AM-1` adds administrative or
   classificatory codes after results were visible and explicitly forbids the
   amendment from raising certainty.
6. **Apply the full-text rule even when costly.** Ten otherwise eligible tier-1
   trials remain `awaiting-full-text`; abstract-only evidence was not promoted
   to a tier-1 datum.
7. **Record publication stage separately from lifecycle status.** Preprints use
   `publication.stage: preprint` while retaining their actual study design.
8. **Correct the packet path before creation.** The lowercase
   `sbla-009-evidence-packet.json` matches `id: sbla-009-evidence-packet` and the
   accepted path-to-ID validator.

## Tests/checks run and results

### Account-A environment and generation

- Pinned runtime installation completed after an initial host-runtime install
  command failed.
- Four existing and newly generated JSON artifacts were parsed successfully
  before packet generation.
- Account A's generator produced 43 packet searches, 76 included IDs, 16 packet
  exclusions, and a 60,307-byte strict packet.

### Schema and arithmetic checks run by Codex

- `validateRecord('evidencePacket', packet)` against
  `src/lib/content/schemas.ts`: **success**.
- JSON parsing for all five structured candidate files: **success**.
- Screening equations and `exclusionCodeCounts` sum: **success**, values stated
  above.

### Formatting and repository gates

The first targeted Prettier check found style drift in six Account-A files.
`pnpm exec prettier --write` changed formatting only; a second repository-wide
format check passed.

The first `pnpm verify` then failed at `validate:content` because the accepted
validator treated all required `content-drafts/` files as published structured
records. Codex reproduced that failure in a subprocess test, fixed it on the
separate branch `codex/SBLA-009-content-drafts-validation`, and integrated final
commit `303b23fb7e4a8794c9d83e64b5b3d4253006074f` into `main`. The focused test
failed red 1/10 and passed green 10/10; the gate branch's full suite passed 237
unit tests and 17 portability tests.

After fast-forwarding this uncommitted research branch to that exact base,
Codex ran `pnpm verify` with all ten scientific artifacts and the strict packet
present. Result: **PASS**.

- Prettier: all matched files pass.
- ESLint: pass with zero warnings.
- Astro check: 55 files, zero errors/warnings/hints.
- Unit tests: 16 files, 237 tests passed.
- Content validation: one strict record passed.
- Graph validation: pass; graph generation remains SBLA-011.
- Evidence status: pass for zero promoted sources; source promotion remains
  SBLA-011.
- Production build: one static page built.
- Portability: 3 files, 17 tests passed.
- Foundation contract: pass.
- Asset spike and decision gates: pass.
- `git diff --check`: pass after formatting.

The final committed-range role boundary, exact changed-path list, and immutable
commit/tree are completed immediately after this handoff is committed and must
be recorded in the coordination ledger and Account-B review claim. A handoff
cannot contain its own Git object ID without changing that object.

## Known uncertainties

1. **Search completeness is limited.** The large composite yields were not all
   screened. Review R-RULE-1, every retrieval stratum, and every quantified
   residual before accepting any absence statement.
2. **Cochrane CENTRAL was not searched.** There was no authenticated Search
   Manager session; no workaround was attempted.
3. **Twenty-four records await full text.** Ten are eligible tier-1 trials whose
   data cannot be used under the scope's abstract-only rule.
4. **Fifty of 76 included sources were abstract-only.** A reviewer must ensure
   no draft claim exceeds what its accessible locator supports.
5. **Double screening was not performed on a separate day** as the scope
   specified. This is a process deviation and a direct reviewer target.
6. **Two governing search-syntax defects remain routed to the scope owner.** The
   search receipts and synthesis identify them; do not imply the original scope
   strings were flawless.
7. **Terminologia Anatomica remained unreachable.** U1 is unresolved; no model
   memory was substituted for an official anchor.
8. **One corrected systematic review was not used for numeric claims** because
   its erratum could not be read from this client.
9. **The strongest comparative result is related, not direct.** Its cable
   cross-over omits enough technique attributes that it cannot establish index
   Y under the frozen eligibility rule.
10. **The contradiction scout did not contribute evidence.** Its first launch
    had network tools denied; the corrected copy ended without a retrievable
    repository artifact. Nothing from that session is represented as evidence.
11. **Account A hit its usage limit before handoff.** This file is a disclosed
    Codex continuity artifact. Account B must not infer a completed Account-A
    self-check beyond the checks actually listed.

## Files created or modified

Relative to base `303b23fb7e4a8794c9d83e64b5b3d4253006074f`, the candidate
owns exactly:

1. `research/searches/SBLA-009-search-receipts.json`
2. `research/screening/SBLA-009-screening-flow.json`
3. `research/extractions/SBLA-009-source-extractions.json`
4. `research/appraisals/SBLA-009-appraisals.md`
5. `research/syntheses/SBLA-009-synthesis.md`
6. `research/packets/sbla-009-evidence-packet.json`
7. `research/packets/SBLA-009-handoff.md`
8. `content-drafts/muscles/pectoralis-major.md`
9. `content-drafts/exercises/barbell-flat-bench-press.md`
10. `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md`
11. `content-drafts/syntheses/SBLA-009-atomic-claims.json`

No file under published `content/`, application code, tests, CI, release state,
or `reviews/` belongs to this research candidate.

## Required reviewer action

Claude Review Account B must independently review the **complete eleven-file
candidate**, not only this handoff or the latest diff. The append-only report path
will be pre-claimed by Codex before review.

At minimum, Account B must:

1. reproduce the two reconciliation equations and inspect duplicate and
   `awaiting-full-text` treatment;
2. assess whether R-RULE-1 and the route coverage make each absence statement
   appropriately qualified;
3. sample excluded records across every issued code, all fuzzy-only merges, every
   included source, and all 24 `awaiting-full-text` records for classification
   correctness;
4. verify every one of the 22 draft claims and 5 absence records against the
   exact source locator and access level, with particular attention to the 50
   abstract-only included sources;
5. attempt to falsify the Q1 anatomy/function synthesis and the limited Q2
   related-condition statements using contradictory sources;
6. verify that neither EMG nor mechanics is presented as hypertrophy evidence;
7. verify that no related fly condition is promoted to index Y and no additive,
   between-participant, contralateral, or regional estimand is mixed;
8. independently confirm publication status handling, the two retractions, the
   corrected-review exclusion from numeric claims, and preprint restrictions;
9. validate the strict evidence packet and every cross-link/version/ID; and
10. report every Critical, Important, and Minor finding with exact artifact
    location and remediation destination, returning an explicit PASS or FAIL.

## Acceptance criteria

SBLA-009 is complete only when all of the following are independently checkable:

- the research candidate is committed and pushed from the exact base stated
  above;
- the trusted Claude Research boundary reports exactly the eleven allowed paths;
- committed-range whitespace and full `pnpm verify` pass;
- all structured files parse and the strict evidence packet validates;
- every retrieved record reconciles to exactly one terminal state and both
  equations close;
- every draft claim has an opened source, exact locator, scope, certainty,
  applicability, and access-level limit;
- absence is not converted into equivalence, ineffectiveness, or a universal
  training recommendation;
- all contradictory, corrected, retracted, abstract-only, preprint, inaccessible,
  and non-English evidence is handled as the governing artifacts require;
- Account B's append-only report returns PASS with zero unresolved Critical and
  zero unresolved Important findings; and
- any nonblocking Minor finding states its impact and follow-up destination.

Until those conditions hold, every reader-facing file in `content-drafts/`
remains unpublished and SBLA-010/SBLA-011 must not promote it.
