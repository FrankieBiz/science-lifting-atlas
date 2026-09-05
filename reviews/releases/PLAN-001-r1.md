# Review: PLAN-001 Round 1 — Execution quality correction (Account-B acceptance)

## Review identity and scope

| Field                | Value                                                         |
| -------------------- | ------------------------------------------------------------- |
| Task                 | PLAN-001 — Execution quality correction                       |
| Round                | R1 (first independent acceptance review)                      |
| Reviewer role        | Claude Review, Team account B (independent adversarial audit)  |
| Reviewed commit      | `86627faaa5e53fe1f2c741eb0aa3966a3a97c8c9`                    |
| Base commit          | `f674fb70e6f30f2f6bf979766e46c4b6e98483b2`                    |
| Review branch        | `claude-review/PLAN-001-r1`                                    |
| Review worktree      | `.worktrees/plan-001-claude-review-r1`                         |
| Handoff under review | `reviews/releases/PLAN-001-handoff.md`                         |
| Report path (claimed) | `reviews/releases/PLAN-001-r1.md`                             |
| Review date          | 2026-09-05                                                     |

The exact-path claim was verified before writing. `docs/runbooks/current-work.md`
on the Codex coordination branch `codex/execution-quality-correction`
(`e62ffab`, "chore: claim PLAN-001 Account-B review") records an active claim for
task "PLAN-001 review R1", role "Claude Review (account B)", branch
`claude-review/PLAN-001-r1`, worktree `.worktrees/plan-001-claude-review-r1`,
base commit `86627faaa5e53fe1f2c741eb0aa3966a3a97c8c9`, expected handoff and
paths owned `reviews/releases/PLAN-001-r1.md`. The reviewed artifact commit
`86627fa` itself carries an empty active-claims table, which is the intended
isolation described in `operating-policy.json`
(`lifecycle.claimRecordLocation: codex-coordination-branch`). The only
difference between `86627fa` and the coordination tip is that ledger row.

This report is append-only and creates exactly one new file. No artifact under
review was repaired, and no other path was modified.

## Documents read in full

- `AGENTS.md` (reviewed revision, 126 lines)
- `CLAUDE.md` (reviewed revision, 123 lines)
- `docs/product/master-plan.md` (complete, 1844 lines)
- `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`
- `docs/superpowers/plans/2026-09-05-execution-quality-correction.md`
- `docs/adr/0006-execution-quality-and-validation-gates.md` and `docs/adr/README.md`
- `docs/runbooks/operating-policy.json`
- `docs/runbooks/current-work.md` (reviewed revision and coordination tip)
- `reviews/releases/PLAN-001-handoff.md`
- `scripts/foundation/operating-model.mjs`, `scripts/foundation/verify.mjs`
- `tests/unit/operating-model-contract.test.ts`
- `package.json`, `.github/workflows/ci.yml`
- Complete diff `f674fb7..86627fa` (12 files, +576/−9)

## Environment

| Item                        | Observed                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Host                        | macOS (darwin 25.6.0), sandboxed review session                 |
| Node.js available            | `v26.0.0` — **not** the pinned `v24.20.0`                      |
| pnpm                        | Not usable; `pnpm` aborted with `EPERM ... _tmp_*` inside the worktree |
| corepack                    | `0.34.6`                                                        |
| `node_modules/`             | Absent in this worktree; install not possible (see limitations) |
| Shell write access to worktree | **Denied.** `touch reviews/releases/.write-test-$$` → `Operation not permitted` |
| Editor write access to worktree | **Permitted.** This report was written directly to the claimed path |
| Git index operations        | **Denied.** `git add` → `fatal: Unable to create '.../index.lock': Operation not permitted` |

### Environment limitation (stated plainly)

The reviewing sandbox permits reads everywhere in
`/Users/frankbisignano/dev/science-lifting-atlas` and permits the editor tool to
write this one file, but denies shell writes and all Git index operations in the
worktree. Concretely:

- This report **was** created at the claimed path
  `reviews/releases/PLAN-001-r1.md`. It is present but **untracked** —
  `git status --porcelain` reports exactly one entry,
  `?? reviews/releases/PLAN-001-r1.md`, and `git diff --stat HEAD` is empty,
  confirming no tracked artifact was modified.
- It could **not** be staged or committed: `git add` fails with
  `Unable to create '/Users/frankbisignano/dev/science-lifting-atlas/.git/worktrees/plan-001-claude-review-r1/index.lock': Operation not permitted`.
  Codex must commit the file to close the review claim.
- Dependencies could not be installed, so `pnpm verify` and `pnpm test:e2e`
  could not be run under the pinned runtime.

This matches the recurring condition already documented in the
`docs/runbooks/current-work.md` recovery log for the Account-B rounds dated
2026-08-31, 2026-09-02, and 2026-09-05 ("could not write the review worktree",
"its sandbox could not create the Git index lock").

Consequently every result below is either (a) a read-only Git or filesystem
observation, or (b) a pure-JavaScript execution of the repository's own
validator under an unpinned Node 26. Nothing in this report claims a pinned
`pnpm verify` or `pnpm test:e2e` result that this session did not run.

## Commands run and real results

| # | Command | Result |
| - | ------- | ------ |
| 1 | `git rev-parse HEAD` | `86627faaa5e53fe1f2c741eb0aa3966a3a97c8c9` — matches the assigned commit |
| 2 | `git status --porcelain=v1` | Empty; tracked tree clean at review start |
| 3 | `git diff --stat f674fb7 86627fa` | 12 files changed, 576 insertions(+), 9 deletions(-) |
| 4 | `git diff f674fb7 86627fa \| grep '^-'` | Exactly 9 removed lines; enumerated and adjudicated below |
| 5 | `node scripts/foundation/verify.mjs` (Node 26, unpinned) | `Foundation contract passed at .../plan-001-claude-review-r1/`, exit 0 |
| 6 | Drift probe against `validateOperatingModel` (Node 26) | 5 scenarios; results in "Independent drift probe" below |
| 7 | `grep -rhc "^\s*it(" tests/unit/*.ts` | HEAD 48; base 47 — corroborates the handoff's "48/48 unit tests" |
| 8 | `grep -n "toEqual(\[\])" tests/unit/operating-model-contract.test.ts` | Exactly one happy-path assertion — corroborates the claimed RED "2 failed" |
| 9 | `git diff --check f674fb7 86627fa` | Two trailing-whitespace reports at design-spec lines 3–4 (see Minor M-8) |
| 10 | `git merge-base codex/SBLA-004-asset-license-inventory f674fb7` | `0df3e9d7c20c8401004ef0a82177471f2a0c65cf` |
| 11 | `git merge-base --is-ancestor f674fb7 codex/SBLA-004-asset-license-inventory` | `NO` — the stale branch is not descended from the accepted base |
| 12 | `git grep -n "master-plan" -- scripts/ tests/` | One hit only: a CLAUDE.md link substring in `operating-model.mjs:46` |
| 13 | `git grep -c "SBLA-004" docs/runbooks/current-work.md` | `1` — the new PLAN-001 row only; no SBLA-004 claim or recovery entry |
| 14 | `test -e reviews/releases/PLAN-001-r1.md` | Absent before this report — append-only convention respected |

### Independent drift probe

I loaded the reviewed `scripts/foundation/operating-model.mjs` directly, fed it
the reviewed document contents, and mutated one input per scenario. This is the
same pure function `pnpm verify` invokes through `scripts/foundation/verify.mjs`.

| Scenario | Mutation | Validator result |
| -------- | -------- | ---------------- |
| A | None (HEAD as-is) | No issues — validator accepts the candidate |
| B | `defaultIndependentReviewCount: 2`, `overallPercentAllowedAfter: "immediately"` | Rejected with exactly the two strings the new unit test asserts |
| C | `passRequiresZeroImportant: false` | Rejected: `... passRequiresZeroImportant must equal true` |
| D | `AGENTS.md` prose rewritten to "zero unresolved Critical findings; Important and Minor findings may be recorded for follow-up" (sentinel sentence left intact) | **No issues — validator accepts** |
| E | `AGENTS.md` sentinel sentence replaced by "Two independent acceptance reviews are the default" | Rejected: `operating document missing required content: AGENTS.md -> One independent acceptance review is the default` |

Scenarios B, C and E confirm the new machine-readable guard works as the handoff
describes. Scenario D is the basis of finding I-1.

## Verification of the builder's recorded evidence

I could not re-run the pinned checks, so I tested the handoff's claims for
internal consistency against the repository instead.

- **"48/48 unit tests"** — corroborated. Top-level `it(` declarations across
  `tests/unit/*.ts` are 47 at `f674fb7` and 48 at `86627fa`; the single added
  test is `enforces the one-review stop rule and evidence-based progress reporting`.
- **"RED: 14 tests ran; 12 passed and 2 failed"** — consistent. The contract
  test file goes 13 → 14 tests. Before the validator change, the fixture's new
  `qualityControl` object makes `hasExactKeys(root, ...)` fail, which breaks the
  single `expect(issues).toEqual([])` happy-path assertion (line 159) plus the
  new test. Exactly two failures is the expected RED shape.
- **"GREEN: 14/14"** — consistent with scenario A/B/C/E results above.
- **"Foundation contract"** — independently reproduced green (command 5), albeit
  under Node 26 rather than the pinned Node 24.20.0.
- **`pnpm verify` / `pnpm test:e2e` pinned results** — not independently
  verified. See "What I did not verify".

## Reviewer questions

### Q1 — Does the correction preserve every substantive product, evidence, and release gate? **PASS**

Falsification attempt: I enumerated every deleted line in the reviewed range
(command 4). All nine are accounted for and none removes a gate:

1. `AGENTS.md` "Every milestone ends with a clean, tested commit and a reviewer
   report." → replaced by "...and its required independent reviewer report."
   This is strictly stronger, not weaker.
2–8. `docs/adr/README.md` index table rows, re-emitted at a wider column width.
   ADRs 0001–0005 all retain `Accepted`; none was edited, renumbered, or removed.
   `docs/adr/0006` is added at `Proposed`.
9. The `SBLA-012` §18 row, replaced by a superset row. The original verification
   text `pnpm test:a11y && pnpm test:visual && pnpm verify` and `owner approves
   direction` both survive verbatim; the new clauses only add requirements.

I then checked the gates the correction could plausibly have eroded, and each is
byte-unchanged at `86627fa`:

- §12.3 Page Definition of Done and §12.4 Release Definition of Done, including
  "an additional randomly selected 10% plus every high-impact comparative claim
  is re-audited from source, with zero unsupported claims".
- §19 acceptance rubric, including UX usefulness "≥85% completion for defined
  find/understand/verify/share beta tasks" and every `Mandatory: Yes` dimension.
- §7.5 / §12 accessibility gate ("zero unresolved applicable Level A or AA
  success-criterion failures"), §9.7 retraction/emergency response, §9.10 AI
  cross-review protocol, §11.8 infrastructure gate, §13.5 ownership matrix,
  §17 owner decision gates A–F, Phase 5 wave checklist and Phase 6.1–6.5.
- ADR 0006 states the carve-out explicitly: "The policy does not reduce
  claim-level review, final release audit, owner approval, or any mandatory
  scientific, licensing, accessibility, performance, and resilience gate."

No substantive gate is removed, weakened, or made conditional.

### Q2 — Does it state one consistent review lifecycle across all human and structured contracts? **PASS**

I compared the five thresholds across all four contracts plus the ADR:

| Threshold | `operating-policy.json` | master plan §13.7 | `AGENTS.md` | `CLAUDE.md` | ADR 0006 |
| --------- | ----------------------- | ----------------- | ----------- | ----------- | -------- |
| Review count | `defaultIndependentReviewCount: 1` | "one independent acceptance review" | "One independent acceptance review is the default" | "one independent acceptance review by default" | "one independent acceptance review" |
| Pass threshold | `passRequiresZeroCritical`/`Important: true` | "zero unresolved Critical and Important findings" | "zero unresolved Critical or Important findings" | "zero unresolved Critical and Important findings" | same |
| Minor handling | `minorFindingsMayBeDeferredWhenNonblocking: true` | "recorded for later hardening" | "recorded for follow-up" | "recorded for later hardening" | same |
| Extra pre-review | `additionalPreReviewRequiresNamedMaterialRisk: true` | "only when the handoff names a material risk" | same | *(not stated — see M-2)* | "requires a named material risk" |
| Failed review | `failedReviewAction: bounded-remediation-then-full-artifact-recheck` | "one bounded remediation followed by one complete-artifact recheck" | "open one bounded remediation, then recheck the complete artifact once" | "review the complete repaired artifact once" | same |
| Progress unit | `progressUnit: accepted-capabilities-and-user-journey-proof` | five-fact protocol | five-fact protocol | *(not stated; not that file's scope)* | same |
| Percentage boundary | `overallPercentAllowedAfter: SBLA-017-observed-throughput` | "before SBLA-017 ... and the owner approves the revised estimate" | same | *(not stated)* | same |

No contradiction exists between any two contracts as written today. The
lifecycle also composes correctly with the pre-existing
`lifecycle.failedReviewOpens: bounded-remediation-claim` and with the
current-work ledger rule "A failed review creates a new bounded remediation
claim; it never silently reopens the builder claim."

The criterion is met on its terms. Three precision gaps (M-1, M-2, M-3) and the
enforcement gap (I-1) are recorded separately; none of them is a present-tense
contradiction.

### Q3 — Does it prevent misleading progress reporting without hiding queue status? **PASS**

The protocol prohibits exactly one thing — a single overall product-completion
percentage — and only until SBLA-017 records observed throughput. It
simultaneously *requires* reporting accepted §18 queue gates, so queue status is
mandated rather than suppressed. The design's five-fact list makes the
`x/20` gate count the first required fact, and the master plan adds the
interpretation rule: "queue counts are process progress, not a proxy for
delivered product value."

Falsification attempt: I checked whether this collides with §15, which already
publishes a "700–2,000 supervised agent-hours" envelope and instructs
"Measure the vertical slice and replace these broad estimates with observed
throughput before approving the final catalog." It does not collide — the new
rule is the same instruction applied to reporting, and it names SBLA-017, which
§18 already defines as the task producing "observed throughput, revised effort
estimate" with owner approval. The boundary is anchored to a real queue item
with a real deliverable, not to an unfalsifiable future event.

ADR 0006's context statement "3 of 20 accepted queue gates" is accurate against
the ledger: SBLA-001, SBLA-002 and SBLA-003 are recorded closed and accepted;
SBLA-004 onward are not.

### Q4 — Does SBLA-012 add useful early validation without replacing the later beta gate? **PASS**

The later gate is intact and untouched:

- §19 rubric: "UX usefulness — ≥85% completion for defined find/understand/
  verify/share beta tasks; no critical journey blocker" with evidence artifact
  "Anonymized beta task report with scripts and results". Unchanged.
- Phase 6.5 Beta and launch: "Recruit a small test group of serious lifters and
  coaches ... Run scripted find/understand/verify/share tasks. Fix critical task
  failures." Unchanged.
- §17 Gate E (Beta) unchanged.

The new SBLA-012 clause is explicitly labelled formative in three places: the
§18 row ("small formative usability report"), the design ("This is formative
validation, not the final beta or a claim of statistical confidence; the larger
≥85% task-success gate remains in the release rubric"), and ADR 0006's
consequences. The design's non-goals additionally forbid "Claiming the current
foundation shell is a usable product."

Falsification attempt: I checked whether the new SBLA-012 clause could be read
as satisfying §19's UX dimension early. It cannot — §19 names a distinct
evidence artifact (beta task report) and a numeric threshold that SBLA-012's
3–5 participants cannot produce, and the design says so directly. The SBLA-012
addition also does not weaken SBLA-015's owner gate for the full 3D journey.

One executability risk is recorded as M-5.

### Q5 — Is the SBLA-004 reconciliation direction executable and non-destructive? **PASS**

**Factually grounded.** The design asserts "The existing SBLA-004 branch began
before SBLA-003 was accepted." I verified this independently:
`codex/SBLA-004-asset-license-inventory` is at `01ffe0a` and its merge-base with
the accepted base `f674fb7` is `0df3e9d`, an intermediate SBLA-003 commit;
`git merge-base --is-ancestor f674fb7 <branch>` returns false. The branch
carries 8 changed files / +1236 lines, including its own
`reviews/releases/SBLA-004-handoff.md`, `docs/licenses/asset-candidates.json`,
`scripts/assets/spike.mjs` and `tests/unit/asset-spike.test.ts`.

**Characterization is grounded.** The design requires replacing
"placeholder-only evidence with lawful real sample files plus repeatable browser
measurements". `scripts/assets/spike.mjs:35–37` on that branch emits
`PLACEHOLDER — no vendor selected; not scored.`, and its handoff records
"Path A is `status: \"placeholder\"`". The direction describes real content, not
an assumed defect.

**Non-destructive.** The instruction is "treat the stale SBLA-004 commits as
inputs, not as a merge candidate" and "Do not integrate the existing stale
SBLA-004 branch directly." Nothing directs deletion of the branch, worktree, or
commits. `AGENTS.md` retains "Never discard another agent's work" and the ledger
retains "Never delete unmerged work." The plan also fences the current branch:
"Do not begin SBLA-004 edits in this branch."

**Executable.** Plan Task 6 sequences the new branch after acceptance
("Create a new SBLA-004 branch from the accepted main commit"), which is a
commit that will exist at that point, and bounds the port ("port only bounded
inventory/spike work, then add lawful real samples and repeatable browser
measurements before SBLA-004 review"). The stale branch is discoverable from the
repository alone via `git branch --list '*SBLA-004*'`, and its handoff lives on
that branch. The design's failure handling also covers the realistic bad case:
"If lawful SBLA-004 samples cannot be obtained, record the candidate as blocked
or select a documented 2D fallback; do not substitute an unlicensed asset."

Locator precision is recorded as M-6.

## Findings

### Critical — none

No finding in this round violates a §2.2 prohibition, weakens a mandatory §12.4
or §19 gate, or would cause an unsupported claim, unlicensed asset, or
accessibility regression to reach publication.

### Important

#### I-1 — The design record and handoff overstate what `pnpm verify` enforces; master-plan and ADR drift are not detected at all, and the prose pass threshold can be silently weakened

**Locations**

- `docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md`,
  section "Verification": "The operating policy is machine-readable and
  validated by the foundation contract. The master plan, repository
  instructions, Claude instructions, ADR, and policy must state the same
  thresholds. `pnpm verify` must reject drift."
- `reviews/releases/PLAN-001-handoff.md`, "Work completed": "Extended the
  foundation validator and unit fixture so policy drift fails `pnpm verify`."

**What is actually enforced.** `pnpm verify` reaches the operating contract only
through `pnpm verify:foundation` → `scripts/foundation/verify.mjs` →
`validateOperatingModel`. That function reads exactly the union of
`REQUIRED_OPERATING_PATHS`, `REQUIRED_DOC_SNIPPETS` keys and
`FORBIDDEN_DOC_SNIPPETS` keys. That union is `AGENTS.md`, `CLAUDE.md`,
`docs/runbooks/handoff-template.md`, `docs/runbooks/current-work.md`,
`docs/runbooks/branch-and-worktree.md`, `docs/runbooks/claude-environments.md`,
`docs/runbooks/operating-policy.json`.

- `docs/product/master-plan.md` is **never read**. `git grep -n "master-plan" --
  scripts/ tests/` returns a single hit, `operating-model.mjs:46`, which is a
  required *substring inside CLAUDE.md* (a link check), not a check of the plan.
- `docs/adr/0006-execution-quality-and-validation-gates.md` is **never read**.
- `.github/workflows/ci.yml` runs only `pnpm install --frozen-lockfile`,
  `pnpm verify`, and `pnpm test:e2e`; there is no supplementary doc check.
- For `AGENTS.md` and `CLAUDE.md`, only two literal sentinels were added
  (`One independent acceptance review is the default`, `SBLA-017`, and
  `one independent acceptance review`). The thresholds themselves are unguarded.

**Failure scenario (executed, scenario D above).** Rewrite the `AGENTS.md`
sentence to "A candidate passes when it has zero unresolved Critical findings;
Important and Minor findings may be recorded for follow-up", leaving the
sentinel sentence in place. `validateOperatingModel` returns **no issues**, so
`pnpm verify` stays green — while `operating-policy.json` still declares
`passRequiresZeroImportant: true`. The structured and prose contracts now
disagree on the single most consequential threshold in this correction, silently.
The same applies, with no sentinel at all, to the master plan's
"Review stop rule (owner-approved 2026-09-05)" and "Progress protocol" blocks
and to every word of ADR 0006: they can be edited to say anything, and
`pnpm verify` will not notice.

**Why this is Important rather than Minor.** The stated purpose of this
changeset is that the five contracts cannot silently diverge; the design's own
Verification section is the mechanism it offers for that guarantee. As written,
the record asserts a property the implementation does not have for two of the
five documents it names (the canonical master plan and the decision record), and
for the pass-threshold wording in the other two. A future Codex or Claude
session that edits the master plan's stop rule, runs `pnpm verify`, and sees
green would be entitled by this record to conclude the change was contract-
checked. That is precisely the drift the correction exists to prevent. Under
`AGENTS.md` ("Record the real output; never describe a check you did not run")
and `CLAUDE.md` ("A confident sentence without those is a defect, not a style
choice"), an overstated check description is a defect in the artifact, not a
stylistic preference.

**Bounded repair options (author's choice; not a repair by this reviewer).**
Either (a) narrow the two sentences to what is true — the structured policy and
named sentinel sentences are validated, and master-plan/ADR alignment is a
human-maintained obligation; or (b) extend `REQUIRED_DOC_SNIPPETS` to cover
`docs/product/master-plan.md` and `docs/adr/0006-*.md` with the load-bearing
threshold strings, and add threshold-level sentinels for `AGENTS.md`/`CLAUDE.md`,
with the matching RED/GREEN evidence. Option (b) also closes M-1 through M-4
mechanically.

### Minor (nonblocking; recorded for follow-up hardening)

**M-1 — `CLAUDE.md` states the stop rule without the "milestone acceptance"
scoping or the claim-level carve-out.** `CLAUDE.md:57–61` says "The project uses
one independent acceptance review by default ... Do not request or create extra
review layers after PASS ...", placed immediately after the role list that
includes "citation entailment audits", "milestone acceptance review", and "the
random pre-release claim audit". `AGENTS.md:64` scopes the rule to "each
milestone" and ADR 0006 states the carve-out explicitly, but neither qualifier
appears in `CLAUDE.md`. Impact: a session reading only `CLAUDE.md` could argue
that §12.4's mandatory "randomly selected 10% plus every high-impact comparative
claim" release re-audit, or Phase 5's "second reviewer pass in the release
audit", is a prohibited extra layer. Not Critical because the master plan wins
on conflict (stated in both `AGENTS.md:4–6` and `CLAUDE.md:7–9`) and both gates
remain mandatory in §12.4/§19. Follow-up: add "milestone acceptance" scoping and
the ADR 0006 carve-out sentence to `CLAUDE.md`.

**M-2 — `CLAUDE.md` omits the risk-triggered pre-review rule.** It covers only
the post-PASS case. `additionalPreReviewRequiresNamedMaterialRisk: true` and the
`AGENTS.md`/master-plan sentence about a handoff naming a material risk have no
counterpart in the Claude-facing file, so one of the two always-loaded
instruction files states half the rule. Follow-up: mirror the sentence.

**M-3 — The deferral condition for Minor findings exists in only one document.**
The design requires that "Nonblocking Minor findings may be deferred only when
their impact and follow-up destination are recorded." The master plan,
`AGENTS.md`, `CLAUDE.md` and the policy field
`minorFindingsMayBeDeferredWhenNonblocking` all state the permission without the
condition. Follow-up: carry the condition into the enforceable contracts, or
drop it from the design so the strictest statement is not the least visible one.

**M-4 — `overallPercentAllowedAfter` encodes only half its prose condition.**
The prose requires both that SBLA-017 record observed throughput *and* that the
owner approve the revised estimate; the JSON token is
`SBLA-017-observed-throughput`. The gap is small because §18's SBLA-017 row
already routes through "→ Owner ... owner approves batch size and scope", but
the structured field read alone is weaker than the prose. Follow-up: rename the
token or add an explicit owner-approval field.

**M-5 — The new SBLA-012 pass condition creates a human-recruitment dependency
with no documented fallback.** The row now requires "3–5 representative
lifters/coaches attempt find/understand/verify/share tasks" as part of the pass
condition, in a project whose stated production constraint is "AI-only labor ...
with the human owner acting as product owner and final approver". The design's
"Failure handling" section anticipates unobtainable SBLA-004 samples and
Critical journey blockers but not unavailable participants. Impact: SBLA-012
could stall on a dependency only the owner can satisfy, with no recorded
blocked/deferred path. Not Important because Phase 6.5 already assumes the
project can recruit a small test group, the owner is already in SBLA-012's
approval chain, and the ADR mechanism exists to adjust. Follow-up: add a
recruitment-failure branch (for example: record blocked, or run with the owner
plus a documented reduced-confidence note, and carry the gap into the §19 UX
dimension).

**M-6 — The SBLA-004 reconciliation direction carries no repository locator, and
the ledger has no SBLA-004 record.** The design says "The existing SBLA-004
branch" and plan Task 6 lists "**Files:** determined by the review result and
the existing SBLA-004 handoff" — but neither names
`codex/SBLA-004-asset-license-inventory`, its tip `01ffe0a`, its fork point
`0df3e9d`, or the worktree `.worktrees/sbla-004-asset-license-inventory`, and
`reviews/releases/SBLA-004-handoff.md` does not exist on `main` or at the
reviewed commit (it exists only on that stale branch).
`docs/runbooks/current-work.md` — whose stated purpose is that "a second session
discovers what is already owned without reading anyone's chat history" —
contains exactly one `SBLA-004` occurrence, the new PLAN-001 row; there is no
SBLA-004 active claim, closed claim, or recovery-log entry for a branch holding
+1236 unmerged lines. The ledger gap predates PLAN-001, but PLAN-001 adopts the
reconciliation as an objective and is the natural place to close it. Follow-up:
name the exact branch/commit/worktree in the plan, and add a recovery-log row
recording that the stale SBLA-004 work is preserved as input.

**M-7 — "owner-approved 2026-09-05" is stamped into the canonical plan on a
paraphrased general instruction.** The design's Approval record states the owner
"asked Codex on 2026-09-05 to understand the response, edit the project as
needed, and continue the work. That instruction approves this correction's
direction." The design itself is careful ("Owner-approved direction ...
independent review pending"; "The repository change still requires the normal
independent review before integration"), but the two master-plan headings read
flatly as "(owner-approved 2026-09-05)" with no direction-versus-change
distinction, and no verbatim owner instruction or decision note exists in the
repository to corroborate the scope of that approval. A general "continue the
work" instruction is being carried into the canonical plan as approval of five
specific contract changes, one of which (SBLA-012 participant testing) adds a
new blocking pass condition. Not Important because ADR 0006 is held at
`Proposed`, the change cannot merge without the owner's acceptance commit, and
handoff acceptance criterion 4 preserves that sequencing. Follow-up: quote the
instruction verbatim in a repository decision note, and mark the master-plan
labels "owner-approved direction" to match the design's own wording.

**M-8 — `git diff --check` is not clean across the reviewed range.** Command 9
reports trailing whitespace at
`docs/superpowers/specs/2026-09-05-execution-quality-correction-design.md:3` and
`:4`. These are two-space Markdown hard breaks and match existing house style
(33 such lines already exist in `docs/product/master-plan.md`), so I treat them
as cosmetic rather than a formatting defect. The handoff records
"`git diff --check`: PASS before implementation commit", which is true of the
pre-commit working-tree invocation but not of the committed range; the two
statements are easy to confuse. Follow-up: state which invocation was run, or
use a non-whitespace hard break.

## Acceptance criteria

| # | Criterion (from `reviews/releases/PLAN-001-handoff.md`) | Result |
| - | -------------------------------------------------------- | ------ |
| 1 | All five review questions PASS with zero unresolved Critical or Important findings | **FAIL** — all five questions PASS, but one unresolved Important finding (I-1) remains |
| 2 | Structured policy and prose agree on review count, pass threshold, remediation behavior, progress unit, and percentage boundary | **PASS** — verified field by field in the Q2 table; no present-tense contradiction |
| 3 | `pnpm verify` and `pnpm test:e2e` pass under the pinned runtime | **NOT VERIFIED** — this sandbox cannot install or write in the worktree; see "What I did not verify". Not counted as a finding against the artifact |
| 4 | ADR 0006 remains Proposed until the review report is integrated and owner acceptance is recorded | **PASS** — `docs/adr/0006-...md:3` reads `Status: Proposed` and `docs/adr/README.md:26` lists it as `Proposed`; no owner-acceptance commit exists in the range |
| 5 | The accepted next task begins from main, not the stale SBLA-004 branch | **PASS** — plan Task 6 directs a new branch from the accepted main commit and treats `01ffe0a`'s history as inputs; verified non-destructive |

## Reviewer-question summary

| Question | Result |
| -------- | ------ |
| Q1 Preserves every substantive product/evidence/release gate | **PASS** |
| Q2 States one consistent review lifecycle across all human and structured contracts | **PASS** |
| Q3 Prevents misleading progress reporting without hiding queue status | **PASS** |
| Q4 Adds useful early validation without replacing the later beta gate | **PASS** |
| Q5 Gives an executable, non-destructive SBLA-004 reconciliation direction | **PASS** |

## What I did not verify

1. `pnpm verify` and `pnpm test:e2e` under the pinned Node 24.20.0 / pnpm
   11.24.0. Dependencies are not installed in this worktree and the sandbox
   denies shell writes there, so neither install nor run was possible.
   The foundation contract — the component this changeset actually modifies —
   was reproduced green under Node 26 (command 5), and the unit-test count and
   RED/GREEN shape were corroborated statically, but the format, lint,
   type-check, content/graph/evidence, build, portability and Playwright legs
   rest on the builder's recorded results, not on mine.
2. Prettier formatting of the changed Markdown and JSON (`pnpm format:check`),
   for the same reason. `git diff --check` was run instead; see M-8.
3. Whether the owner's 2026-09-05 instruction, as paraphrased in the design's
   Approval record, covers the full scope of the five changes. No verbatim
   record exists in the repository; see M-7.
4. The substance of the stale SBLA-004 work beyond the topology, placeholder
   status, and file inventory reported above. SBLA-004 is a separate task with
   its own future review.

## Verdict

**FAIL** — one unresolved Important finding (I-1). Zero Critical findings. Eight
nonblocking Minor findings (M-1 … M-8) are recorded above for follow-up.

This is a narrow failure. The correction's substance holds up under
falsification: no gate is weakened, the four prose contracts and the structured
policy agree today, the SBLA-012 addition is genuinely additive and does not
touch the ≥85% beta gate, and the SBLA-004 direction is factually grounded,
executable, and non-destructive. The single blocking defect is that the design
record and handoff describe a drift-detection guarantee that the implementation
does not provide for the canonical master plan, for ADR 0006, or for the prose
pass threshold — demonstrated by drift-probe scenario D, where a materially
weakened `AGENTS.md` threshold leaves `pnpm verify` green.

Per the stop rule this candidate itself establishes, the correct next step is
**one bounded remediation** addressing I-1 (by narrowing the claim or by
extending the validator, with RED/GREEN evidence), followed by **one
complete-artifact recheck**. Minor findings M-1 … M-8 are explicit follow-up
hardening items and must not be silently closed. No additional review layer
should be created beyond that single recheck.

## Reviewer boundary statement

This session wrote exactly one file, `reviews/releases/PLAN-001-r1.md`, the path
pre-claimed by Codex on the coordination branch. It repaired nothing, edited no
artifact under review, and modified no other path; `git status --porcelain`
after authoring reports a single untracked entry and nothing else.

The sandbox denied Git index operations, so this session could not stage or
commit the report. The file is present and untracked in the review worktree.
Codex must commit it to close the review claim and should record the recovery
action, as it did for the comparable Account-B rounds already logged on
2026-08-31, 2026-09-02, and 2026-09-05.
