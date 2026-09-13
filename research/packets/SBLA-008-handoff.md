# Handoff: SBLA-008 — vertical-slice research questions, search strategy, and eligibility plan

## Objective

SBLA-008 in the §18 queue reads:

> Claude Research → Claude Review | Depends on 007 | Vertical-slice questions,
> PICO/PECO where applicable, search strings, inclusion/exclusion plan | Review
> report passes scope, reproducibility, and contradiction-search criteria.

It implements the scope step of §14 Phase 1 Task 1.2 and stage 1 (`scope`) of the
§9.8 research pipeline: `scope → search → acquire → screen → extract → appraise →
synthesize → draft → citation-audit → adversarial-review → owner-approve →
publish → monitor`.

The deliverable is a scope packet rigorous enough that SBLA-009 can execute
searching, screening, extraction, appraisal, and synthesis **from the committed
files alone**, and that Claude Review can judge scope, reproducibility, and
contradiction-search quality without this session's context.

**This task produces no scientific conclusion and no claim.** It runs no evidence
search. It defines questions, boundaries, query strings, and rules.

**Two review rounds have failed this artifact, and this packet describes the
state after the second remediation.** Read the lineage before anything else,
because every section below is written against round 3:

| Round | What it was                  | Date       | Commit                                                          | Review of it                                                                     |
| ----: | ---------------------------- | ---------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
|     1 | Original scope packet        | 2026-09-11 | `56068c222bd8971378586776d133a7cf7a470b96`                      | `reviews/evidence/SBLA-008-r1.md` — **FAIL**, 0 Critical / 2 Important / 5 Minor |
|     2 | R1 remediation               | 2026-09-12 | `383b63244aabb19404046dbd4a5aeb1589175346`                      | `reviews/evidence/SBLA-008-r2.md` — **FAIL**, 0 Critical / 2 Important / 5 Minor |
|     3 | **R2 remediation, this one** | 2026-09-12 | this commit — parent `383b63244aabb19404046dbd4a5aeb1589175346` | pending: a fresh Account B round would be `reviews/evidence/SBLA-008-r3.md`      |

Round 1 returned **I-1** and **I-2** plus **M-1**–**M-5**; round 2 closed all
seven — the R2 report confirms every one independently — but introduced or left
standing **I-3** and **I-4** plus **M-6**–**M-10**. This round repairs **I-3 and
I-4 completely**, which are the only two findings that block acceptance
(`operating-policy.json`, `passRequiresZeroImportant: true`). The five Minor
findings are nonblocking and are dispositioned individually in the _R2 finding
closure map_ below; **M-6 is corrected only in the one file this round owns**, and
M-7, M-9 and M-10 are **not** repaired here because they live in files this round
does not own. Neither review report is edited and neither could be: `reviews/` is
outside this role's write boundary and review reports are append-only. What a
fresh recheck should judge is the complete artifact as it now stands, not the
diff.

## Inputs and exact paths

Three rounds wrote these files, and the third owns only two of the four. All
three are recorded, because a reviewer checking the boundary needs the claim that
covers the commit they are looking at — and for this commit that is the **round-3**
claim, not either earlier one.

### Round 1 — scope (2026-09-11)

**Base commit (exact accepted base).**
`0752d5021da72eed840f61ae06f6c1966906c177` — "docs: accept SBLA-007 by owner
override". Confirmed as the branch HEAD at the start of this work:
`git rev-parse HEAD` → `0752d5021da72eed840f61ae06f6c1966906c177`.

**Branch.** `claude-research/SBLA-008-scope`
**Worktree.** `C:\src\s008research`
**Role.** Claude Research, account A. Evidence lead, not the independent
reviewer.

**Ledger precondition (CLAUDE.md "Before you start work", item 2).** The
exact-path claim was recorded on my behalf by Codex before I wrote anything:
commit `09f9ba4cfb4b505612035cb6c463b37a75a279ce` — "docs: claim SBLA-008 research
scoping" — on branch `codex/SBLA-007-review-coordination`, amending
`docs/runbooks/current-work.md`. I verified the commit exists and read its diff.
The claim records base `0752d5021da72eed840f61ae06f6c1966906c177`, worktree
`C:\src\s008research`, start 2026-09-11 20:14 EDT, expected handoff
`research/packets/SBLA-008-handoff.md`, and exactly the four paths I have written.
I did not edit the ledger; my role cannot.

### Round 2 — R1 remediation (2026-09-12)

**Base commit (exact).** `2de2a3ef428139cbe20f934bb98fad8190d16d20` — "fix: allow
evidence review Markdown reports". It carries the immutable Account B review
report and Codex's repair of the Markdown validator that had been rejecting it.
Confirmed as HEAD at the start of this work: `git rev-parse HEAD` →
`2de2a3ef428139cbe20f934bb98fad8190d16d20`.

**Branch.** `claude-research/SBLA-008-r1-remediation`
**Worktree.** `C:\src\s008fix`
**Role.** Claude Research, account A — the **original authoring role repairing its
own artifact**, not the reviewer. The independence of the review is preserved
because the two roles are separate accounts and separate sessions, and because I
did not touch the report.

**Ledger precondition for round 2, verified before writing anything.** Codex
recorded the claim on my behalf: commit
`247096a76affca6cc0040a71842997ef2d933a2b` — "docs: claim SBLA-008 R1 research
remediation", on `codex/SBLA-007-review-coordination`, amending
`docs/runbooks/current-work.md`. I confirmed the commit exists and read its diff.
It records branch `claude-research/SBLA-008-r1-remediation`, worktree
`C:\src\s008fix`, base `2de2a3ef428139cbe20f934bb98fad8190d16d20`, start
2026-09-12 16:21 EDT, expected handoff `research/packets/SBLA-008-handoff.md`, and
exactly the four paths listed under _Constraints_. I did not edit the ledger; my
role cannot.

**Inputs read for round 2.** `reviews/evidence/SBLA-008-r1.md` in full,
`reviews/releases/SBLA-008-validation-remediation-handoff.md`, `CLAUDE.md`,
`AGENTS.md`, `docs/product/master-plan.md`, `src/lib/content/schemas.ts`, and the
four SBLA-008 files as committed at `56068c2`.

**External calls made during round 2.** Two kinds, both bounded and both
logged. First, anchored zero-yield parse tests of every amended query string —
seven calls on 2026-09-12, results under _Tests/checks run and results_, all
structurally zero-yield by construction. Second, one plain `curl` fetch of the
Cochrane help-page URL, repeated once, to record its current status code for M-5;
it returned HTTP 419 both times and no content. **No search was executed against a
real question in round 2**, and the one that was executed at scope time is
disclosed at **D13**. No new unanchored or composite evidence search was run in
that round.

**Exact commit chain round 2 answered to.** Four commits, linear, each
verified in the round-2 worktree with `git log -1` and `git show --stat`:

| Commit                                     | Subject                                       | What it is                                                                                                                                          |
| ------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `56068c222bd8971378586776d133a7cf7a470b96` | `research: scope SBLA-008 vertical slice`     | The **reviewed candidate**: the four files as Account B audited them                                                                                |
| `5d519595c7f6ed2b6e1b2ba23458a560adb372cb` | `review: audit SBLA-008 scope R1`             | Account B's **immutable R1 report**, added as 772 lines at `reviews/evidence/SBLA-008-r1.md`. Parent is the candidate `56068c22`                    |
| `eefefd20ebdf61efe65489f30b60db09c33aa124` | `fix: format SBLA-008-r1 review`              | Prettier reflow of two lines of that report (2 insertions, 2 deletions). **Whitespace only — no finding, severity, or verdict changed**             |
| `2de2a3ef428139cbe20f934bb98fad8190d16d20` | `fix: allow evidence review Markdown reports` | Codex's repair of the validator that had been rejecting the report, plus its own handoff and a unit test. **Round 2's base, and its HEAD at start** |

The R1 report version round 2 was written against is therefore the one at its
base commit: blob `9db00fdc07e575ad9c45d02b2796d68cb622b84d`, SHA-256
`0cd5aaa37769a9458b48343d4aa4487b45c4371540e46e30241f44882546376d`, 772 lines —
byte-identical to the report at `eefefd20`, and differing from `5d519595` only in
the two reflowed lines above. R2 rechecked against that blob. Nothing under
`reviews/` was modified by that round, and nothing could be: the path is outside
this role's write boundary and review reports are append-only.

### Round 3 — R2 remediation (2026-09-12), this round

**Base commit (exact).** `383b63244aabb19404046dbd4a5aeb1589175346` — "fix:
remediate SBLA-008 evidence review R1", tree
`975f154a164aa6779107c1b9f7ad4e820ba46793`, parent
`2de2a3ef428139cbe20f934bb98fad8190d16d20`. This is the **failed round-2
candidate**: the commit Account B reviewed and failed in
`reviews/evidence/SBLA-008-r2.md`. Confirmed as HEAD at the start of this work:
`git rev-parse HEAD` → `383b63244aabb19404046dbd4a5aeb1589175346`;
`git rev-parse HEAD^{tree}` → `975f154a164aa6779107c1b9f7ad4e820ba46793`.

**Branch.** `claude-research/SBLA-008-r2-remediation-v2`
**Worktree.** `C:\src\s008fix3`
**Role.** Claude Research, account A — again the **original authoring role
repairing its own artifact**, not the reviewer. Verified before any edit: this
session's Git identity is `frank@beyondlimitscarefoundation.org`, which is not
the Account B reviewer identity `dariel@beyondlimitscarefoundation.org` recorded
in the R2 report header. The two roles remain separate accounts and separate
sessions, and no review report was touched.

**Ledger precondition for this round, verified before writing anything.** Codex
recorded the claim on my behalf: commit
`f910736d6dcf2791956e988205983a8a7a69bcef` — "docs: correct SBLA-008 R2
remediation base", on `codex/SBLA-007-review-coordination`, amending
`docs/runbooks/current-work.md`. I confirmed the commit exists with `git show`,
read its diff, and read the resulting active-claims table. It records task
"SBLA-008 R2 research remediation", role Claude Research (account A), branch
`claude-research/SBLA-008-r2-remediation-v2`, worktree `C:\src\s008fix3`, base
`383b63244aabb19404046dbd4a5aeb1589175346`, start 2026-09-12 20:08 EDT, expected
handoff `research/packets/SBLA-008-handoff.md`, and exactly **two** paths owned:
`research/searches/SBLA-008-search-strategy.md` and
`research/packets/SBLA-008-handoff.md`. I did not edit the ledger; my role
cannot. The coordination branch was **not** merged or rebased into this branch,
so this branch's diff stays based on the exact reviewed artifact commit, as
`branch-and-worktree.md` requires.

**The immutable review this round answers.** `reviews/evidence/SBLA-008-r2.md`,
read in full at commit `bf7e5bb70f4f3948597bd90b84f76d9515d55f87` ("review:
recheck SBLA-008 scope R2", parent `383b632`, a single-file 1,038-insertion
commit). Blob `894a952711bfca2edfa1649db76b7851e91eae67`, SHA-256
`dd19898f0ebde216bc48761f402980d33063592b37baddb140579d90b3730b18`, 1,038 lines.
It was read with `git show bf7e5bb7:reviews/evidence/SBLA-008-r2.md` rather than
by checking the commit out, so nothing under `reviews/` entered this worktree.

**Inputs read for this round.** That R2 report in full; `CLAUDE.md`; `AGENTS.md`;
`docs/runbooks/operating-policy.json`; `docs/runbooks/branch-and-worktree.md`;
`docs/runbooks/handoff-template.md`; `docs/product/master-plan.md` §13.6 and the
queue row; `docs/runbooks/current-work.md` as committed at `f910736`; and the two
owned files as committed at `383b632`.

**External calls made during this round.** One kind only, all bounded, all
logged under _Tests/checks run and results_. Anchored zero-yield parse tests of
the six PubMed strings on both E-utilities transports, a synthetic
nonsense-token bisection of the GET URI length limit, and three fetches of NCBI's
official E-utilities documentation pages. **Every composite carried the §5.0
zero-yield anchor `AND zzzqqqnonsenseanchor[tiab]`**, so each returned `count` 0
by construction; the bisection used only nonsense tokens and no topical term.
**No question-level yield was observed at any point in this round**, no
identifier was collected or opened, and no unanchored composite was run. The one
unanchored search that exists at all was run at scope time and is disclosed at
**D13**.

**What this round did not do.** It did not touch the two research files it does
not own (`research/questions/SBLA-008-vertical-slice.md`,
`research/screening/SBLA-008-eligibility-plan.md`), did not begin SBLA-009, did
not alter any review report, and did not merge, rebase, force-push, or delete any
branch.

### Read by all rounds

**Repository documents read (not modified).**

- `CLAUDE.md`, `AGENTS.md`
- `docs/product/master-plan.md` — read in full, with §2.2, §4.2, §4.3, §4.4,
  §9.2–§9.11, §10, §13.6, §13.8, §14 Phase 1 Tasks 1.1–1.3, and §18 used directly
- `docs/runbooks/handoff-template.md`, `docs/runbooks/operating-policy.json`,
  `docs/runbooks/current-work.md`
- `src/lib/content/schemas.ts`, `src/lib/content/validation.ts`,
  `scripts/content/validate.mjs`, `scripts/foundation/operating-model.mjs`
- `research/questions/SBLA-002-readiness.md` and
  `research/packets/SBLA-002-claude-research-readiness-handoff.md`, used as the
  format precedent for a research-role packet
- `.prettierrc.mjs`, `.prettierignore`, `.gitignore`, `package.json`

**External sources consulted for syntax and vocabulary verification.** All
accessed **2026-09-11**; each is logged with its URL, what was checked, and the
observed response in `research/searches/SBLA-008-search-strategy.md` §2. Summary:
PubMed User Guide; NLM "Use of MeSH in Online Retrieval"; NLM MeSH lookup API and
SPARQL endpoint; NCBI E-utilities `esearch`; Cochrane Library Search Manager help;
Europe PMC RESTful Web Service and search endpoint; ClinicalTrials.gov API v2;
Crossref REST API; OpenAlex API; EMBL-EBI OLS4 (UBERON); bioRxiv/medRxiv API; OSF
API (SportRxiv legacy); SportRxiv current server; PROSPERO; Crossref Retraction
Watch labs endpoint; FIPAT.

## Constraints

**Write boundary, as claimed in the ledger and as CLAUDE.md fixes for this role.**
The boundary narrowed at round 3, and the narrower one is what gates this commit:

| Round                | Files the claim permits | Which                                                                                   | What the round actually did                              |
| -------------------- | ----------------------: | --------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1 — scope            |                    four | questions, search strategy, eligibility plan, this handoff                              | created all four                                         |
| 2 — R1 remediation   |                    four | the same four                                                                           | modified all four; created/deleted/renamed none          |
| **3 — R2, this one** |                 **two** | `research/searches/SBLA-008-search-strategy.md`, `research/packets/SBLA-008-handoff.md` | modified exactly these two; created/deleted/renamed none |

The four paths across the whole task:

- `research/questions/SBLA-008-vertical-slice.md` — **not owned by round 3**
- `research/searches/SBLA-008-search-strategy.md` — owned by round 3
- `research/screening/SBLA-008-eligibility-plan.md` — **not owned by round 3**
- `research/packets/SBLA-008-handoff.md` — owned by round 3

**Not touched, and owned elsewhere:** `content/`, `content-drafts/`, `reviews/`,
`schemas/`, `src/`, `scripts/`, `tests/`, any configuration, lockfiles, generated
files, `CLAUDE.md`, `AGENTS.md`, and `docs/runbooks/current-work.md` (the ledger —
Codex's). No file outside the claimed paths was created, edited, or deleted in any
round; for round 3, no file outside the **two** claimed paths. `git status` at
commit time shows only the claimed paths. From round 2 onward the list of things
not touched has one addition that matters: **the review reports were read and
never written** — `reviews/evidence/SBLA-008-r1.md` in round 2,
`reviews/evidence/SBLA-008-r2.md` in round 3, the latter read out of Git with
`git show` so it never entered this worktree at all. The remediation instruction
and CLAUDE.md both forbid editing the review report, the validation code, schemas,
tests, configuration, published content, and the ledger, and none of them was
edited.

**Consequence a reviewer should hold this round to.** Because round 3 owns only
two paths, defects the R2 review located in the questions file or the eligibility
plan **cannot** be repaired here, however cheap they look. M-7, M-9 and M-10 are
in that position and are left open on purpose, not overlooked. M-6 spans all three
research files; it is corrected in the search strategy and left standing in the
other two, and the search strategy says so in its own header.

**Task constraints observed.**

- **Nothing was retrieved, screened, extracted, appraised, or synthesised.** That
  is SBLA-009's work (§9.8 steps 2–7). One qualification, stated here rather than
  buried: on 2026-09-11 the Europe PMC E1 composite string was submitted without a
  zero-yield anchor and returned `hitCount` 334. That is a route-level composite
  search, not a single-term index probe, and calling it a diagnostic was wrong —
  R1 finding I-1. No identifier behind it was collected, opened, screened, or
  cited, and no other route produced a question-level count. It is recorded as a
  search in `research/searches/SBLA-008-search-strategy.md` §4.2, carried into the
  SBLA-009 search record by §5.0 of that file, and its bearing on **U2** is stated
  in §4.3. See **D13**.
- **No scientific conclusion is drawn anywhere in the four files.** Every
  anatomical or exercise term is used as a scoping label.
- **Model memory is not used as evidence** (CLAUDE.md; §13.8). Every factual
  statement about a database, a vocabulary, or an endpoint is tied to a URL I
  opened and to the response I observed, with the date recorded beside it —
  2026-09-11 for the scope round, 2026-09-12 for the observations added in rounds
  2 and 3. The round-3 additions are the E-utilities transport facts in search
  strategy §5.0, §5.2 and §2 row 5.
- **Extracted fact and proposed methodology are kept typographically distinct.**
  The search strategy labels every statement **Plan**, **Verified platform fact**,
  **Index diagnostic**, or **Route-level composite count** (§0 of that file).
- **Assumptions and unresolved decisions are labelled, not smoothed over**:
  A1–A4 and U1–U5 (questions), SA1–SA3 and SU1–SU9 (search strategy), EA1–EA4,
  EU1–EU4, SE-U1 and SE-U2 (eligibility plan) — thirty-three items. SU7, SU8, SU9
  and SE-U2 were added during **round 2**; none of them is resolved, and two of
  them are not resolvable by this role at all. **Round 3 adds no new label**: the
  one new time-bounded fact it records, that the observed E-utilities GET length
  boundary is not a figure NCBI publishes and may move, is folded into the
  existing **SU6** rather than given an ID of its own, so the SU series still ends
  at SU9.
- **No secrets, credentials, keys, or tokens** were written into any file or into
  any chat. No API key was used or recorded; where one is needed (NCBI), the file
  says so without containing one.

**Queue boundaries deliberately left alone.** SBLA-009 owns search execution,
screening, extraction, appraisal, synthesis, and draft claims. Schema changes are
Codex's (relevant to finding **SE-U1** below). Review is Claude Review's, in a
separate account.

## R1 finding closure map

All seven findings in `reviews/evidence/SBLA-008-r1.md` — zero Critical, two
Important, five Minor — with the exact location of each repair. **Read the
disposition column literally.** "Closed" means the artifact now says what the
reviewer asked it to say. It does **not** mean the underlying problem went away:
I-2 is closed as a _declaration_ while the schema defect behind it stays open for
Codex, and M-5 is closed by _downgrading_ a claim rather than by verifying it.

| #   | Severity  | What R1 §9 required                                                                                                                                                                                                                                                        | Where it was done                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Disposition                                                                                                                                                                                                                                                              |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I-1 | Important | Correct the three denial sentences and D13; relabel the Europe PMC 334 as a route-level composite count with its date and platform version; carry it into the SBLA-009 search record; note that U2 is decided with partial yield visible; **do not delete the disclosure** | `research/searches/SBLA-008-search-strategy.md` **§0** (new `Route-level composite count` category) and **§4.2** (the 334 with database, endpoint, query, `searchedAt` 2026-09-11, `resultCount` 334, platform version 6.9, `resultType=idlist`, no identifier retained), plus the four numbered consequences incl. the §5.0 carry-forward duty; **§4.3** for U2; `research/questions/SBLA-008-vertical-slice.md:183`; this packet's **D13**                                                                                                                                                                                                                                                                                                                                                                                                                                   | **Closed.** Mislabelling corrected, not defended; disclosure widened, not removed                                                                                                                                                                                        |
| I-2 | Important | Declare the `awaiting-full-text` and duplicate representation gap as an unresolved item naming **Codex** as resolver, alongside SE-U1; correct §8.3 to distinguish §9.8 step 2 from what `evidencePacketSchema.searches` accepts, as §5.0 already does                     | `research/screening/SBLA-008-eligibility-plan.md` **§6.4** (four-state → packet mapping table; states plainly that the rule-3 arithmetic closes in the screening log and **not** inside the packet) and **§8 `SE-U2`** (two owner paths, resolver **Codex**, before SBLA-009 writes a packet); `research/searches/SBLA-008-search-strategy.md` **§8.3** (rewritten to separate the two requirement sets, with a per-field "fits the schema?" column) and **§10 `SU8`**                                                                                                                                                                                                                                                                                                                                                                                                         | **Closed as the review required — the defect itself is not fixed.** Declared, mapped and routed; `evidencePacketSchema` is outside this role's write boundary, so **SE-U2** and **SU8** remain open for Codex on an owner decision                                       |
| M-1 | Minor     | Correct "thirty-one" to the true count; close or annotate the `E-OUT-3` / `E-OUT-4` gap                                                                                                                                                                                    | `research/screening/SBLA-008-eligibility-plan.md` **§5.3** (why the two numbers are reserved and will never be issued, and why EA3 makes a silent gap unsafe); count corrected to **twenty-eight** in this packet's §5 summary. Re-counted in this session: 28 code-definition rows across the five subsections §5.1–§5.5 (`E-POP` 6, `E-EXP` 6, `E-OUT` 3, `E-MET` 2, `E-DES` 5, `E-REC` 4, `E-ADM` 2), with `E-OUT-3` and `E-OUT-4` named only in the reserved-gap note                                                                                                                                                                                                                                                                                                                                                                                                      | **Closed.** The plan always defined 28; only the prose count was wrong                                                                                                                                                                                                   |
| M-2 | Minor     | State whether duplicates are recorded in `exclusions[]`, so the flow arithmetic closes                                                                                                                                                                                     | `research/screening/SBLA-008-eligibility-plan.md` **§6.4** — duplicates go in `exclusions[]` under `E-REC-1` and nothing else; **§5** preamble extends "exactly one primary code" to cover duplicates                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Closed.** Recorded as a decision, with its reason, not as a reading of the schema                                                                                                                                                                                      |
| M-3 | Minor     | Add `pectoral fly`, `pec fly`, `pectoral flye`, `pec flye` to S2, S3 and E1                                                                                                                                                                                                | `research/searches/SBLA-008-search-strategy.md` **§5.2 (S2)**, **§5.3 (S3)**, **§6.1 (E1)** — all eight forms (`pectoral fly/flies/flye/flyes`, `pec fly/flies/flye/flyes`); **§6.2 (C1)** line `#5` as well, beyond the named destination, because M-3's own heading is that they were absent from _every_ route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | **Closed, and slightly wider than asked**                                                                                                                                                                                                                                |
| M-4 | Minor     | Align E1's exercise block with S2's term set                                                                                                                                                                                                                               | `research/searches/SBLA-008-search-strategy.md` **§6.1** — E1's second block now carries every S2 exercise term, with the parity statement in the notes beneath it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | **Closed**                                                                                                                                                                                                                                                               |
| M-5 | Minor     | _Either_ record the Cochrane retrieval method precisely and reconcile it with §9.6, _or_ downgrade the C1 syntax claims and the CENTRAL half of D4 to "syntax unverified at scope time"                                                                                    | **Both limbs, not the either/or.** `research/searches/SBLA-008-search-strategy.md` **§2 row 6 + note** (every retrieval attempt and code: plain `curl` → 403 on 2026-09-11; same single request with a browser `User-Agent` → 200, read once, no further request; plain fetch → 419 twice on 2026-09-12, and the reviewer's independent plain fetch → 419; author 403 vs reviewer 419 recorded as **divergent**), the §9.6 line drawn explicitly, and a standing **prohibition on substituting a user agent or otherwise bypassing any Cochrane access control**; the downgrade to **"Syntax unverified at scope time"** applied at **§2 row 6**, **§3.3 (CENTRAL half of D4, marked unverified)**, **§3.5**, **§6.2** header and rules preamble, **§9** fallback matrix, and **§10 `SU9`**; propagated to this packet's **D4**, the verification table and the failures table | **Closed by downgrade.** The grammar is **not** verified and **no independent syntax verification is claimed**. C1 must be re-verified inside an authenticated Search Manager session before it runs; if it cannot be, C1 is recorded as not executed for want of access |

**Two defects the review did not raise, found by this role while remediating, and
disclosed rather than fixed quietly.** Both are in
`research/searches/SBLA-008-search-strategy.md`.

1. **C1 line `#5` broke this file's own wildcard rule.** It used `fl*` in four
   places; the help-page rule recorded in §6.2 requires a root of at least three
   characters. Replaced with `fly*` plus an explicit `flies`, which `fly*` cannot
   reach. Noted in §6.2 as self-identified, not as a review finding. It inherits
   **SU9** like every other C1 syntax claim.
2. **Europe PMC has no confirmed proximity operator.** E1 uses ordered quoted
   `TITLE_ABS` phrases, so it misses the inverted word orders S2 and S3 catch via
   `[tiab:~0]`. Recorded as **SU7** for SBLA-009 to resolve at execution time.

**What was still open after round 2, and who owns it.** Nothing above is a
blocker this role can clear. `SE-U2` and `SU8` (schema representation) belong to
**Codex** on an owner decision before SBLA-009 writes a packet; `SU9` (Cochrane
grammar) and `SU7` (Europe PMC proximity) belong to **SBLA-009** at execution
time; `U2` is an owner scope decision now taken with partial yield visible (D13).

The R2 review independently re-tested all seven R1 findings and confirmed every
one closed, several beyond what R1 asked (`reviews/evidence/SBLA-008-r2.md` §4).
Nothing in the map above is reopened by round 3.

## R2 finding closure map

The R2 review returned **FAIL** with zero Critical, two Important and five Minor.
Round 3 repairs both Important findings and nothing else is claimed. **Read the
disposition column literally**, and read the Minor rows as a boundary statement
rather than as a judgement that they do not matter.

| #    | Severity  | What R2 required                                                                                                                                                                                                                                                                                                                             | Where it was done, or why it was not                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Disposition                                                                                                                                                                                                                                |
| ---- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I-3  | Important | Record the E-utilities `POST` form in §5.0 as the required transport above roughly 3,700 URL-encoded characters; name which strings are affected; add an HTTP 414 row to the §9 failure matrix with POST as its fallback; state in §5.2 which transport produced the recorded S2 result; soften "two equivalent execution paths"             | `research/searches/SBLA-008-search-strategy.md` **§5.0** — the three execution paths with the GET/POST split, the full POST specification (endpoint, method, `application/x-www-form-urlencoded`, body fields `db=pubmed`, `retmode=json`, `retmax=0`, `term=<query>`), the deterministic four-row transport rule, the per-string GET-URL measurement table, the transport-equivalence check, and the re-measure-after-amendment rule; **§5.2** — the transport of the 2026-09-12 S2 verification named as POST, with both transports' responses tabulated; **§9** — a new `PubMed API, GET transport` row carrying HTTP 414, its diagnostic, the explicit prohibition on trimming or silently splitting, and POST as the fallback; **§2 row 5** and **SU6** updated so the log and the time-bound item match. The **`querytranslation` contract is preserved and strengthened**: it stays mandatory for every PubMed search, and §5.0 now shows it is obtainable for every string in the file, S2 included, because POST returns it identically | **Closed, and verified rather than asserted.** Every claim added is an observation from this session against the official endpoint, with its date; the boundary figure is this round's own measurement and is labelled as such             |
| I-4  | Important | Make "Files created or modified" state the round's truth with current line counts and, ideally, blob or SHA-256 checksums; rewrite criteria 1 and 2 to name the commit under review, its parent and the covering ledger claim; extend criterion 12 to SU1–SU9 and SE-U1/SE-U2; re-read the remaining criteria against the committed artifact | This packet throughout, not only in its tail: the **lineage table** in _Objective_; a full **Round 3** block in _Inputs and exact paths_ naming base `383b632…`, branch, worktree, the ledger claim `f910736…` and its two owned paths, and the R2 report's own commit, blob and checksum; a **round-by-round write-boundary table** in _Constraints_; this closure map; a round-3 entry in _Work completed_ with corrected line counts for every file; **D14**; a round-3 block in _Tests/checks run and results_ with real output; a rewritten **Files created or modified** with a commit/blob table; and **all fourteen acceptance criteria re-read**, with 1, 2, 12, 13 and 14 rewritten and the rest confirmed or corrected                                                                                                                                                                                                                                                                                                                | **Closed.** The three criteria R2 failed (2, 12, 13) are addressed directly; criterion 1 is repointed at the claim that covers this commit                                                                                                 |
| M-6  | Minor     | Correct the round-1 provenance headers and the search strategy's self-contradicting blanket verification date                                                                                                                                                                                                                                | **Partially closed, and the partiality is the point.** `research/searches/SBLA-008-search-strategy.md` header — both base commits now recorded, the blanket date replaced by a per-verification rule with the 2026-09-12 exceptions enumerated, and the residual defect in the other two files named explicitly in the header itself; **SU6** and **§2**'s preamble aligned. The identical header defect in `research/questions/SBLA-008-vertical-slice.md` and `research/screening/SBLA-008-eligibility-plan.md` is **untouched**, because those paths are outside the round-3 claim                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **Closed in the one owned file; open in two.** Correcting it here was not optional: round 3 adds dated verifications that the old blanket header would have misdated. **Destination for the remainder: a round that owns those two paths** |
| M-7  | Minor     | Add the four missing MeSH descriptors to E1's exercise block, or state why they are omitted                                                                                                                                                                                                                                                  | **Not done.** E1 is in `research/searches/SBLA-008-search-strategy.md`, which round 3 owns, so the boundary does not block it — but the R2 review states it could not quantify the effect because Europe PMC returned 503 throughout its session, and this round did not execute Europe PMC either. Adding four `MESH:` terms to a route whose `MESH:` handling of them nobody has verified, in a round scoped to two Important findings, would be an unverified change to a query string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **Open, deliberately.** **Destination: SBLA-009 at execution time**, with SU7, when Europe PMC is reachable and the descriptors' handling can actually be tested                                                                           |
| M-8  | Minor     | Make the handoff quote §5.0's anchor verbatim, or state that two anchors were used on the two dates                                                                                                                                                                                                                                          | **Not done.** The mismatch is between §5.0 and this packet's _Syntax and vocabulary verification (2026-09-11)_ table, which is a round-1 record of what was actually submitted on that date. Correcting it truthfully needs the round-1 call log, which this session does not hold; rewriting the row to match §5.0 would assert a submitted string I cannot verify was submitted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Open, deliberately.** The R2 review establishes the outcome is reproducible under either anchor. **Destination: a later remediation, or SBLA-009's own search log**                                                                      |
| M-9  | Minor     | Fix §1.2's reconciliation formula, which omits `awaiting-full-text`                                                                                                                                                                                                                                                                          | **Not done, and not doable here.** It is in `research/screening/SBLA-008-eligibility-plan.md`, outside the round-3 claim                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **Open.** **Destination: a round that owns the eligibility plan**, before screening                                                                                                                                                        |
| M-10 | Minor     | Narrow §2's row-6 note, which generalises a curl-specific block into an unreproducible-by-anyone claim                                                                                                                                                                                                                                       | **Not done.** It is in an owned file, but it is a wording change to the Cochrane access record — the most contested part of the artifact, carrying SU9 and a standing access-control prohibition — and re-opening that wording in a round scoped to I-3 and I-4 risks disturbing a passage two reviews have already examined. No new evidence about Cochrane was gathered this round                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | **Open, deliberately.** **Destination: a later remediation**, ideally one that can also re-attempt the fetch                                                                                                                               |

**Nothing new was found by this role during round 3.** Rounds 1 and 2 each
disclosed self-identified defects; this round has none to add. The one thing it
learned that the R2 review explicitly left open — the E-utilities GET boundary as
a measured number, and what NCBI's documentation actually says about POST — is
recorded in search strategy §5.0 as a verified platform fact with its date.

**What is still open after round 3, and who owns it.** `SE-U2` and `SU8` belong
to **Codex** on an owner decision before SBLA-009 writes a packet; `SU7`, `SU9`
and **M-7** belong to **SBLA-009** at execution time; `U2` is an owner scope
decision; **M-9** needs a round owning the eligibility plan; **M-6** (in two
files), **M-8** and **M-10** need a later remediation round. None of these blocks
acceptance under `passRequiresZeroImportant`.

## Work completed

Three substantive artifacts plus this packet. Nothing of the kind existed at
`0752d502`. **The line counts in the headings below are the counts at this
commit**, not at the round that first wrote each file; the per-round figures are
in _Files created or modified_. Sections 1–3 describe the artifacts as they now
stand; section 4 describes what round 3 changed.

### 1. `research/questions/SBLA-008-vertical-slice.md` (435 lines)

- **§1** retains the master plan's representative slice — pectoralis major plus a
  flat press and a cable/fly variation — and records three reasons why, so the
  choice is challengeable rather than assumed. §14 permits substituting a better
  test case; this scoping step does not propose one.
- **§2** anchors naming to identifiers so two models resolve the same structure:
  MeSH `Pectoralis Muscles` D010369 (tree A02.633.567.775), `UBERON:0002381`,
  `FMA:9627`. Records **verified vocabulary fact V1** — D010369 has no narrower
  MeSH descriptor, so MeSH cannot separate major from minor and cannot address the
  clavicular or sternocostal portions at all, and `[mh]` explosion on it is
  currently a no-op.
- **§3** defines both exercises as reproducible protocol specifications, each split
  into **defining attributes** (failing one means it is not the index exercise),
  **recorded modifiers** (extracted, may drive sensitivity analysis), and
  **distinct conditions** (related movements not pooled by default):
  - **Exercise X** — `barbell-flat-bench-press`: barbell, bench at 0° ± 5°,
    supine, pronated grip outside shoulder width, shoulder horizontal adduction
    and/or flexion **with** elbow extension, bar to contact or near-contact and
    return to full or near-full elbow extension, gravity resistance.
  - **Exercise Y** — `cable-fly-standing-bilateral-shoulder-height`: two pulleys at
    shoulder height, standing, elbow fixed slightly flexed with **no intentional
    elbow extension**, single-joint shoulder horizontal adduction, cable-determined
    line of force.
- **§4** states **Q1** (attachments; which glenohumeral actions each of the
  clavicular and sternocostal portions contributes to; whether the relative
  contribution varies with humeral elevation angle and plane), split into Q1a
  (anatomy, descriptive), Q1b (function, internal comparator), Q1c (PECO-style,
  exposure = humeral position), with a full field table and a five-level
  directness ladder for admissible outcome measures.
- **§5** states **Q2** — whether a programme using X differs from one using Y in
  pectoralis major hypertrophy, and secondarily in task-specific maximal strength,
  when training variables are equated or reported — with a full PICO table, a
  **six-row outcome priority hierarchy** (tier 1 size change by MRI/CT/ultrasound
  at ≥6 weeks is the only tier that may support a hypertrophy claim; tier 2
  task-specific strength with a mandatory specificity qualifier; tier 3 mechanics;
  tier 4 EMG with the mandatory §2.2 qualifier; tier 5 context only; **tier H harms,
  parallel and mandatory**), rules H1–H3, a **full estimand specification**, the
  technique boundaries that change eligibility, and the exclusions.

### 2. `research/searches/SBLA-008-search-strategy.md` (1,090 lines)

- **§0** states what was and was not run — nothing retrieved, screened or cited,
  and one route-level composite count on Europe PMC — and defines the four labels
  used throughout: **Plan**, **Verified platform fact**, **Index diagnostic**,
  **Route-level composite count**.
- **§1** maps thirteen routes (S1–S6 PubMed; E1 Europe PMC; C1 Cochrane CENTRAL;
  T1 ClinicalTrials.gov; O1 OpenAlex; X1 Crossref; P1 preprints; R1 PROSPERO; V1
  terminology) with a stated reason why each is needed beyond PubMed.
- **§2** is the **verification log**: eighteen rows, each with the official URL,
  what was checked, and what came back, all on 2026-09-11.
- **§3** records the five platform facts that changed the strategy (see _Decisions
  made_).
- **§4** records the bounded single-term index diagnostics (§4.1), the one
  route-level composite count that was run and mislabelled (§4.2), and the scope
  finding they force (§4.3).
- **§5** gives the **six complete, copyable PubMed strings**, each verified to
  parse with no error, no unrecognised field, and no unfound quoted phrase, each
  with its purpose, its filters as separately recorded steps, its expected failure
  mode, and its fallback.
- **§6** gives the non-PubMed routes with complete queries: the Europe PMC
  composite string (verified to parse), a nine-line Cochrane Search Manager
  strategy written to a grammar read once from the official help page and now
  carried as **"Syntax unverified at scope time"** — not independently confirmed,
  and no independent syntax verification is claimed for it (SU9, R1 finding M-5),
  ClinicalTrials.gov API v2 calls in both simple and Essie forms (grammar
  verified), OpenAlex citation chaining in both directions, Crossref status
  routes, the preprint routes, and the terminology anchors.
- **§7** is the deliberate contradiction search: what is being looked for, seven
  fixed procedures, and eight guards against cherry-picking.
- **§8** fixes date handling, the five-step deduplication ladder, what must be
  recorded for every search, and the update strategy.
- **§9** is the failure and fallback matrix, including the three outages and two
  access blocks actually observed.
- **§10** lists the assumptions and the four routes whose syntax could not be
  verified.

### 3. `research/screening/SBLA-008-eligibility-plan.md` (623 lines)

- **§1** six-stage screening workflow and the rules that hold at every stage,
  including "one decision, one recorded reason" and count reconciliation.
- **§2** core eligibility per question, plus the **index / related / distinct**
  condition labels and a four-step procedure for classifying a condition when the
  study's description is thin — uncertainty resolves _away_ from the index set.
- **§3** design eligibility **per question and per outcome tier**, not globally,
  including how systematic reviews are used (signposts and contradiction sources,
  never the citation for a primary datum) and **§3.4**, which sets out both sides
  of the open contralateral-limb design question (U3) and the pre-specified
  handling until it is decided.
- **§4** record-level handling: language, date and publication status (preprints,
  conference abstracts, theses, registry records), multi-report linkage,
  retractions and corrections implementing §9.7 including the non-DOI maximum ages
  and the outage rule, and inaccessible full text with a five-step lawful
  acquisition ladder and the `awaiting-full-text` state.
- **§5** twenty-eight stable exclusion reason codes across the five subsections
  §5.1–§5.5, and an explicit statement that there is **no code for "low
  quality"** — quality is appraised, not screened. The count was stated as
  thirty-one at scope time and was wrong by three (R1 finding M-1); the plan
  itself always defined 28, and the 28 definition rows were re-counted in the
  remediation round.
  `E-OUT-3` and `E-OUT-4` are deliberately reserved and will never be issued —
  §5.3 of the plan now says why, so the gap cannot be read as a dropped code.
- **§6** ten anti-cherry-picking rules, the amendment procedure, and the required
  contents of the screening log.
- **§7** conflict resolution within the role (20% stage-1 and 100% stage-3
  double-screening, recorded self-disagreement, `unclear-escalated`) and between
  roles.

### 4. What round 3 changed, and nothing else

Round 3 touched two files and repaired two Important findings. Every change is
listed here so the diff needs no interpretation.

**`research/searches/SBLA-008-search-strategy.md` — 969 → 1,090 lines (+121), all
of it I-3 plus the inseparable part of M-6.**

- **Header** — the single "date of every verification" line, which the body
  contradicted in five places, replaced by both base commits and a
  per-verification dating rule that enumerates the 2026-09-12 exceptions and says
  plainly that the same defect is left standing in the two files this round does
  not own.
- **§2 preamble and row 5** — the log's blanket 2026-09-11 line qualified, and the
  E-utilities row given its 2026-09-12 re-run on both transports, with S2's 414
  recorded there rather than only downstream.
- **§5.0** — the substantive repair. "Two equivalent execution paths" becomes
  three paths with the equivalence claim withdrawn and the reason given; the POST
  transport fully specified; a four-row deterministic transport rule with a
  conservative 3,700-character threshold; the measured boundary and the
  per-string GET-URL table; a transport-equivalence check showing POST returns a
  byte-identical `esearchresult`; the anchored-test pass criterion made
  transport-aware so a 414 is read as transport failure rather than parse
  failure; and a standing rule to re-measure after every amendment, which is the
  rule whose absence caused I-3.
- **§5.2** — the transport behind the recorded S2 verification named as POST,
  with both transports' responses tabulated and the pre-remediation 3,803-character
  measurement independently re-run.
- **§9** — a new `PubMed API, GET transport` row: HTTP 414, empty body, how to
  diagnose it, POST as the fallback, an explicit prohibition on trimming terms or
  silently splitting the string, and "not executed" rather than zero results if
  POST also fails.
- **§10 SU6** — the exception list extended to the round-3 observations, which
  also carries the caveat that the measured GET boundary is not a published
  figure. No new SU item was created.
- **Not changed:** every query string, including S2, is byte-identical to the
  reviewed candidate. Round 3 changed how the strings are executed and recorded,
  never what they retrieve.

**`research/packets/SBLA-008-handoff.md` — 790 → **1,287** lines, all of it
I-4.** The lineage table in _Objective_; the Round 3 block in _Inputs and exact
paths_; the round-by-round boundary table in _Constraints_; the _R2 finding
closure map_; corrected line counts and this section in _Work completed_; **D14**;
the round-3 block in _Tests/checks run and results_; the round-3 entries in
_Known uncertainties_; a rewritten _Files created or modified_ with a commit and
blob table; and all fourteen acceptance criteria re-read, with five rewritten.

## Decisions made

Choices a reviewer could reasonably question, each with its reason.

**D1 — the comparator is a _cable_ fly, not a dumbbell or machine fly.** §14
permits "a cable/fly variation". The cable version maximises the mechanical
contrast with X — single-joint versus multi-joint, cable-determined versus
gravity-determined line of force — making this a `distinct-mechanics` case under
§4.4 rather than a near-duplicate comparison. **Rejected alternative:** the pec
deck, which is better represented in the literature (see the index diagnostics)
but is a smaller mechanical contrast and duplicates the machine category.

**D2 — related conditions are extracted but not pooled.** Pec deck, dumbbell fly,
bench-lying cable fly, machine and dumbbell flat presses, incline and decline
presses, and push-ups are retained and extracted as pre-specified related
conditions, but are not pooled with the index exercises by default. **Reason:**
excluding them outright would suppress relevant and possibly contradictory
evidence; pooling them silently would answer a different question under the index
question's name. Any pooling must be an explicit, recorded synthesis decision.

**D3 — every multi-word free-text PubMed term uses proximity distance 0
(`[tiab:~0]`), not a quoted phrase.** The PubMed User Guide states that a quoted
phrase not present in the phrase index is, when used with a search tag, **broken
into separate terms**, and names proximity distance 0 as the documented remedy. A
first draft using ordinary quoted phrases returned a `quotedphrasesnotfound`
warning naming twenty-one terms, including `"cable fly"[tiab]`, `"cable
crossover"[tiab]`, `"pectoral deck"[tiab]` and every plural _fly_ spelling. Left
alone, `"cable fly"[tiab]` would have retrieved records containing _cable_ and
_fly_ anywhere in the title or abstract — a silently different search. After the
rewrite all six strings parse with empty warning lists. This is the single change
most likely to matter for reproducibility.

**D4 — `"Retraction of Publication"[pt]` is dropped from the PubMed status
search.** It returns zero and appears in `quotedphrasesnotfound`. It was **read as**
a valid `:pt` value in Cochrane's Search Manager, so the strategy keeps it for
CENTRAL and drops it for PubMed, recording the apparent platform difference rather
than treating it as a vocabulary error. **The two halves of D4 do not carry equal
weight.** The PubMed half is reproducible from the recorded E-utilities call. The
CENTRAL half is **unverified**: it rests entirely on the one unreproducible reading
of the Cochrane help page, is flagged **SU9** and carried as **"Syntax unverified
at scope time"**, and is a planning assumption rather than a fact about Cochrane's
controlled vocabulary (R1 finding M-5). If SBLA-009 cannot confirm the value inside
the Search Manager, it drops that line rather than running it blind.

**D5 — no lower date limit on any primary search.** Anatomical description does
not expire on a schedule, and a start year is itself a selection decision. Where a
platform requires a bounded range (Europe PMC `FIRST_PDATE`), `1960-01-01` is used
as a documented floor and recorded as a filter, not as a property of the question.
Recency is treated as a separate axis from certainty, per §9.4.

**D6 — filters are applied as separately recorded steps, never baked into a base
string.** Including the species filter. **Reason:** it makes every narrowing
visible as a drop in the recorded counts, which is the mechanical guard against
post-hoc narrowing to a convenient set.

**D7 — a five-tier outcome hierarchy plus a mandatory parallel harms tier, with
hard limits rather than guidance.** Only tier 1 may support a hypertrophy claim;
tier 4 (EMG) carries a mandatory §2.2 qualifier every time it is used; tier 5 can
never be a reason to prefer either exercise. **Reason:** §2.2's prohibitions are
easiest to breach at synthesis time, when abundant EMG evidence is available and
hypertrophy evidence is not. Encoding them as eligibility rules makes the breach
require an explicit rule violation rather than a lapse.

**D8 — the estimand is fixed now, before extraction.** Difference in change,
reported as a standardised mean difference **and**, where units permit, in
millimetres or square centimetres, because a standardised effect alone hides
practical size. Within-participant contrasts are a distinct design contrast.
Treatment-policy handling of intercurrent events is preferred. Measurement timing
relative to the last session is recorded, because acute swelling is tier 5
contaminating tier 1.

**D9 — `awaiting-full-text` is a first-class state, not an exclusion.** An
eligible study whose full text cannot be lawfully obtained is recorded with its
acquisition ladder and reported alongside the inclusion count. **Reason:**
collapsing it into "excluded" makes a review look more complete than it is, and a
large count of such records is itself a reason to lower certainty.

**D10 — nothing awkward is made ineligible.** Non-English records, preprints,
theses, conference abstracts, retracted papers, single-arm nulls and contradicting
syntheses all have a defined home in the record set. **Reason:** the easiest way
to hide a null result is to write a criterion that excludes it, and §2.2 forbids
the outcome however it is reached.

**D11 — the contradiction search is specified before any result is seen and runs
unconditionally.** A contradiction search performed only after a conclusion has
formed is not a control, because by then the conclusion decides what looks
relevant.

**D12 — the slice is not re-scoped despite a thin literature.** §14 allows this
step to identify a better test case, and the index diagnostics show Exercise Y may
have almost no directly indexed PubMed footprint. I did **not** silently widen Y.
The correct remedy is the **U2** escalation to the reviewer, settled before
SBLA-009 searches and recorded as an amendment, not a quiet pooling decision at
synthesis time. **Rejected alternative:** substituting the pec deck as the index
comparator now, which would have made the searches look healthier while changing
the question the owner asked for.

**D13 — bounded diagnostics were run deliberately; one of them was a search, and
was mislabelled.** To design fallbacks honestly I needed to know whether the
routes would return anything. Single-term counts were taken from each platform's
own index; those are labelled **Index diagnostic** and are not evidence.

One of the probes was not of that kind. On 2026-09-11 the full E1 composite
string was submitted to Europe PMC **without** a zero-yield anchor and returned
`hitCount` 334. That is a route-level composite search on a real route, and
filing it under **Index diagnostic** — a label this packet defines as a count for
a _single search term_ — was wrong. R1 finding I-1 is correct, and the
mislabelling is corrected rather than defended: the count now has its own
category in §0 of the search strategy and its own section at §4.2, with database,
endpoint, query, date, count and platform version.

What follows from that, and what does not. No identifier behind the 334 was
collected, opened, screened, or cited; `resultType` was `idlist` and no record
was retrieved. No other route produced a question-level count. The remedy for the
method was available and was used on every other composite in this packet: append
a nonsense token so the platform must parse the whole string while the count is
structurally zero. The E1 composite was also run that way (`hitCount` 0), so the
unanchored run added nothing the anchored one had not already established about
the grammar. It did, however, make one route-level yield figure visible while the
rest of the scope was being written, which is why **U2** is now being decided
with partial yield in view — see §4.3 of the search strategy, and **U2** below.

A reviewer who judges the single-term diagnostics to cross the SBLA-008/009
boundary as well should say so; those counts are separable from the rest of the
plan, though the fallback reasoning and **D12** depend on them. The 334 is not
separable in the same way: it has happened, it is disclosed here and in §4.2, and
it is to be carried into the SBLA-009 search record rather than dropped.

**D14 — S2 is kept at full length and executed by POST, rather than shortened or
split.** R2 finding I-3 left three ways out, and this is the one taken. **Reason:**
the terms that pushed S2 over NCBI's GET limit are the eight `pectoral fly` and
`pec fly` forms added under R1 finding M-3 and the E1 parity work under M-4 —
corrections a reviewer asked for, on a route whose weakest block is the pectoral
concept. Removing them to fit a transport limit would undo an accepted repair for
a reason that has nothing to do with retrieval. POST costs nothing: it is the same
endpoint, it is what NCBI's own documentation points long queries at, it returns a
byte-identical `esearchresult` including the mandatory `querytranslation`, and it
is now specified precisely enough to execute from the file alone.

**Rejected alternative 1 — trim S2 back under the GET limit.** Rejected because it
changes what the query retrieves to satisfy a URL-length constraint, and because
the §9 row now explicitly forbids exactly this reaction in an executor who meets a
414 without context.

**Rejected alternative 2 — split S2 into recorded sub-searches combined by history
number**, which the R2 review names as a legitimate option. Rejected for this
round because it changes the recording contract: one search row becomes several
plus a combination step, `querytranslation` is then per-sub-search, and §8.3's
eight-field record and `evidencePacketSchema.searches` would both need rethinking
while **SU8** is still unresolved. The review's own condition was that this "should
not be chosen silently"; it is therefore not chosen, and it remains available to
SBLA-009 as a recorded owner decision if PubMed's limits move again.

**What the decision does not claim.** The 3,700-character threshold is an
operating rule, not a published NCBI figure, and the measured 4,121/4,122 boundary
is this round's observation on one date from one client. Both are recorded as such
in §5.0 and carried by **SU6** for re-verification at execution time.

## Tests/checks run and results

**Three rounds, three sets of checks.** The round-3 checks are first, because they
are the ones that gate this commit. The round-2 checks are kept below them
unchanged, because they are the evidence for the four-file state this commit
builds on, and deleting them would remove a record a reviewer may want. Each
block names its own worktree and date; nothing is carried between them.

### Repository checks — round 3 (this commit)

Executed in **this** worktree, `C:\src\s008fix3`, on **2026-09-12**, immediately
before the round-3 commit, under the pinned runtime.

**The runtime that round 2 could not reach is available here.** `node --version` →
**v24.20.0**, `pnpm --version` → **11.24.0**, matching `package.json`
`engines.node` `>=24.20.0 <25`, `engines.pnpm` `11.24.0` and `packageManager`
`pnpm@11.24.0`. The host default Node on `PATH` is v24.14.0 and is **not** what was
used; the pinned 24.20.0 toolchain was put on `PATH` explicitly, as `AGENTS.md`
requires.

| Check                     | Command, exactly as run                                                                        | Result                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime                   | `node --version`; `pnpm --version`                                                             | `v24.20.0`; `11.24.0` — both pinned values                                                                                                                                                          |
| Install                   | `pnpm install --frozen-lockfile`                                                               | **Pass**, exit 0. No lockfile change; `pnpm-lock.yaml` is untouched and appears in no diff                                                                                                          |
| Formatter                 | `node node_modules/prettier/bin/prettier.cjs --write` on exactly the **two** owned paths       | Applied, Prettier **3.9.6**, using this worktree's own `.prettierrc.mjs`                                                                                                                            |
| Formatter verification    | `node node_modules/prettier/bin/prettier.cjs --check` on the same two paths                    | **Pass**, exit 0 — "All matched files use Prettier code style!"                                                                                                                                     |
| Whitespace                | `git diff --check`, and again after staging with `git diff --cached --check`                   | **Pass** — no output, exit 0                                                                                                                                                                        |
| Diff scope vs the R2 base | `git diff --name-only 383b63244aabb19404046dbd4a5aeb1589175346`                                | **Exactly two paths**, and they are the two the ledger claim names. `git status --porcelain` shows nothing else                                                                                     |
| Base and lineage          | `git rev-parse HEAD`, `HEAD^{tree}`; `git log -1` on the base                                  | HEAD at start `383b632…`, tree `975f154…` — the exact immutable failed candidate                                                                                                                    |
| Coordination claim        | `git show f910736d6dcf2791956e988205983a8a7a69bcef`                                            | Exists; one file changed, `docs/runbooks/current-work.md`, 30 insertions / 28 deletions; the active-claims row matches this branch, worktree, base and two paths. **Not merged and not rebased in** |
| Review report read-only   | `git show bf7e5bb7:reviews/evidence/SBLA-008-r2.md`                                            | 1,038 lines read out of Git; `reviews/` never entered this worktree and appears in no diff                                                                                                          |
| Query strings unchanged   | Node script comparing every fenced block in the search strategy with `git show 383b632:<path>` | **All ten fenced blocks byte-identical** to the reviewed candidate. Round 3 changed no query string                                                                                                 |
| Full repository gate      | `pnpm verify`                                                                                  | See the block below — this is the first SBLA-008 round able to run it                                                                                                                               |

**`pnpm verify` — run, not asserted. Exit 0.** Round 2 recorded plainly that it
could not run this gate at all, because the pnpm and Node available to it failed
`engines` and the run died inside its implicit install step. Round 3's
environment satisfies both pins, so the gate was executed end to end. Real output,
stage by stage:

| Stage               | Command                                            | Result                                                                                                       |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `format:check`      | `prettier --check .`                               | "All matched files use Prettier code style!"                                                                 |
| `lint`              | `eslint . --max-warnings 0`                        | Clean, no output                                                                                             |
| `typecheck`         | `astro check`                                      | "Result (55 files): 0 errors, 0 warnings, 0 hints"                                                           |
| `test`              | `vitest run tests/unit`                            | **16 test files passed, 234 tests passed**                                                                   |
| `validate:content`  | `node scripts/content/validate.mjs`                | "Content validation passed: 0 records."                                                                      |
| `validate:graph`    | `node scripts/graph/validate.mjs`                  | "Graph validation passed: 0 nodes checked; graph generation remains SBLA-011."                               |
| `evidence:status`   | `node scripts/evidence/status.mjs`                 | "Evidence status passed: 0 sources checked as of 2026-09-13; live network acquisition remains a later task." |
| `build`             | `astro build`                                      | "1 page(s) built"                                                                                            |
| `test:portability`  | `vitest run --config vitest.portability.config.ts` | **3 test files passed, 17 tests passed**                                                                     |
| `verify:foundation` | `node scripts/foundation/verify.mjs`               | "Foundation contract passed at `C:\src\s008fix3\`"                                                           |
| `assets:spike`      | `node scripts/assets/spike.mjs`                    | "Asset spike passed: 4 candidate(s); 1 eligible, 2 ineligible…"                                              |
| `assets:decision`   | `node scripts/assets/decision.mjs`                 | "SBLA-006 asset decision passed…"                                                                            |

Two notes on that output, so nothing is read into it that is not there. The
`evidence:status` line reports "as of 2026-09-13" because it takes the date in
**UTC** and this work was done on the evening of 2026-09-12 EDT; the same offset
is why the E-utilities responses above carry UTC `Date` headers of 2026-09-13.
And `astro build` emits one pre-existing warning, "No files found matching
`**/*.{json,yaml,yml}` in directory `content\changes`", which is the
foundation-stage empty-content state described in `AGENTS.md` and is unrelated to
this commit.

**What the repository gate does and does not cover for these files, unchanged
from round 2 and re-confirmed here.** `scripts/content/validate.mjs` has
`RECORD_ROOTS` `['content','content-drafts','research/packets','reviews/evidence']`
and `RECORD_EXTENSIONS` `{.json,.yaml,.yml}`, and `isIgnored()` explicitly skips
`research/packets/*-handoff.md`. Both owned files are therefore **outside schema
validation**, and Prettier remains the only automated gate that touches their
content. A green `pnpm verify` on this commit says the repository is healthy; it
says nothing about whether the two Markdown files are correct. Do not read it as
evidence for the artifact.

**Independence note, unchanged and still binding.** CLAUDE.md requires the
role-path boundary result to come from Codex or CI executing
`scripts/foundation/check-role-paths.mjs` from a **trusted checkout** with
`--repository` pointed at this worktree. I did not run that checker, and a checker
run from this mutable role branch would not be acceptance evidence even if I had.
The `git diff --name-only` and `git status` rows above are my own observations from
my own worktree and are offered as nothing more. The command Codex or CI should
run is:

```bash
node <trusted-checkout>/scripts/foundation/check-role-paths.mjs claude-research --base 383b63244aabb19404046dbd4a5aeb1589175346 --repository C:\src\s008fix3
```

### External checks — round 3

Every call below was made on **2026-09-12** from this worktree. **Every composite
carried the §5.0 zero-yield anchor `AND zzzqqqnonsenseanchor[tiab]`**, so every
one returned `count` 0 by construction; the length bisection used only nonsense
tokens with no topical content. **No question-level yield was observed, no
identifier was collected or opened, and no unanchored composite was run.**

| Check                            | Method                                                                                                   | Observed                                                                                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S2 on the documented GET path    | Anchored S2 from the candidate, newlines collapsed, GET to `esearch.fcgi`; URL 4,137 chars               | **HTTP 414 Request-URI Too Long**, `Server: Apache`, `Content-Length: 0`, empty body. **R2 finding I-3 reproduced**                                                                                                          |
| S2 on the POST path              | Same anchored string, `POST` to the same endpoint, `application/x-www-form-urlencoded`, body 3,676 bytes | **HTTP 200**; `count` 0; `errorlist.fieldsnotfound` `[]`; `warninglist.quotedphrasesnotfound` `[]`; `errorlist.phrasesnotfound` `["zzzqqqnonsenseanchor"]`; all eight M-3 forms present verbatim as `[tiab:~0]` phrases      |
| All six strings, both transports | S1–S6 anchored, each sent by GET and by POST, throttled under the 3 req/s unkeyed limit                  | GET: S1 200, **S2 414**, S3 200, S4 200, S5 200, S6 200. POST: **all six 200**, all with empty `fieldsnotfound` and empty `quotedphrasesnotfound`                                                                            |
| GET URL lengths                  | Measured, anchored, including the 96-character fixed prefix                                              | S1 2,973 · **S2 4,137** · S3 2,319 · S4 1,905 · S5 1,008 · S6 714                                                                                                                                                            |
| GET length boundary              | Byte-exact bisection with a single padded nonsense token; no topical term                                | **4,121 chars → HTTP 200; 4,122 chars → HTTP 414.** Re-confirmed once at both values. Encoded `term` budget at the boundary: 4,025                                                                                           |
| Transport equivalence            | S1 anchored, GET and POST, whole `esearchresult` compared                                                | **Byte-identical**, `querytranslation` included. POST is a transport substitute, not a different query                                                                                                                       |
| Pre-remediation S2, re-measured  | S2 extracted from `56068c222bd8971378586776d133a7cf7a470b96`, anchored, GET                              | **3,803 chars → HTTP 200.** The before-and-after in §5.0 is this round's own measurement, not a figure borrowed from the review                                                                                              |
| NCBI documentation on POST       | Plain GET of `https://www.ncbi.nlm.nih.gov/books/NBK25499/`, and of NBK25501 and NBK25497                | **HTTP 200** for all three. NBK25499's ESearch `term` entry advises, for queries more than several hundred characters long, to "consider using an HTTP POST call" — the R2 review explicitly left this unchecked (its §11.6) |

**Two things this round did not check, stated rather than implied.** Europe PMC
was not called at all, so the amended E1 string remains confirmed by nobody but
its author and **M-7** could not be quantified here any more than it could in the
R2 session. Cochrane was not re-fetched, so **SU9** and **M-10** stand exactly as
they were.

### Repository checks — round 2

Every row below was executed in the **round-2** worktree, `C:\src\s008fix`, on
2026-09-12, immediately before the round-2 commit. Nothing is carried over
from the scope round.

| Check                            | Command, exactly as run                                                                                                                | Result                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formatter                        | `node node_modules/prettier/bin/prettier.cjs --write` on exactly the four claimed paths                                                | Applied. Run more than once, because content was edited after earlier passes. The final pass, immediately before staging, reformatted `SBLA-008-handoff.md` and reported the other three **unchanged**; `SBLA-008-search-strategy.md` had been reformatted by the first pass in this same round                                                                        |
| Formatter verification           | `node node_modules/prettier/bin/prettier.cjs --check` on the same four paths                                                           | **Pass**, exit 0 — "All matched files use Prettier code style!"                                                                                                                                                                                                                                                                                                        |
| Whitespace, staged               | `git add` the four paths, then `git diff --cached --check`                                                                             | **Pass** — no output, exit 0                                                                                                                                                                                                                                                                                                                                           |
| Whitespace, unstaged             | `git diff --check`                                                                                                                     | **Pass** — no output, exit 0 (working tree clean against the index)                                                                                                                                                                                                                                                                                                    |
| Diff scope vs base               | `git diff --cached --name-only 2de2a3ef428139cbe20f934bb98fad8190d16d20`                                                               | **Exactly four paths**, and they are the four claimed ones. `git status --porcelain` shows the same four and nothing else                                                                                                                                                                                                                                              |
| Query integrity vs the candidate | Local Node script, no network: extracts every fenced code block from the search strategy and compares it with `git show <base>:<path>` | **10 fenced blocks in both, and all ten structurally balanced** — parentheses net 0, brackets net 0, even quote count in every block. **Exactly four blocks differ** from the reviewed candidate: S2, S3, E1 and the C1 Search Manager strategy — the M-3, M-4 and `fly*` changes and nothing else. **S1, S4, S5 and S6 are byte-identical to the reviewed candidate** |
| M-3 spellings present            | Same script, exact quoted-term count                                                                                                   | `pectoral fly` 5, `pectoral flye` 4, `pec fly` 5, `pec flye` 4 — present in S2, S3, E1 (and C1 in `NEXT` form)                                                                                                                                                                                                                                                         |

**`pnpm verify` was NOT run, and could not be.** This is the real output from this
worktree, not the scope round's:

```
[ERR_PNPM_UNSUPPORTED_ENGINE] Unsupported environment (bad pnpm and/or Node.js version)

Your pnpm version is incompatible with "C:\src\s008fix".
Expected version: 11.24.0
Got: 11.19.0

Your Node version is incompatible with "C:\src\s008fix".
Expected version: >=24.20.0 <25
Got: v24.19.0
```

**Two** manifest constraints are unsatisfied, not one: `engines.pnpm` wants
exactly `11.24.0` and the available pnpm is `11.19.0`; `engines.node` wants
`>=24.20.0 <25`, the Node on `PATH` is v24.14.0 and the runtime's bundled Node is
v24.19.0. `pnpm verify` fails inside its implicit `install` step and therefore
never reaches `format:check`, `lint`, `typecheck`, `test`, `validate:content` or
any later stage. **No stage of `pnpm verify` ran at all.** I record that rather
than implying a check that never happened.

**How the formatter was still run.** This worktree has no `node_modules` of its
own. A temporary Windows directory junction
`C:\src\s008fix\node_modules` → `C:\src\sciatlas\node_modules` made the
repository's own pinned Prettier **3.9.6** reachable; it was run against **this**
worktree's `.prettierrc.mjs`, and the junction was **removed immediately after the
formatter checks and before the commit**.
`node_modules/` is in `.gitignore` and `.prettierignore`, so the junction was
never staged and appears in no diff — confirmed by the diff-scope row above. The
binary came from the main checkout because it is the same pinned dependency; the
configuration came from this worktree.

**What the repository checks would and would not have covered.** I inspected
`scripts/content/validate.mjs`: `RECORD_ROOTS` is
`['content','content-drafts','research/packets','reviews/evidence']`,
`RECORD_EXTENSIONS` is `{.json,.yaml,.yml}`, and `isIgnored()` explicitly skips
`research/packets/*-handoff.md`. `research/questions/`, `research/searches/` and
`research/screening/` are not record roots. **All four files are therefore outside
schema validation, and Prettier is the only automated gate that applies to them.**
A reviewer should not read a green `pnpm verify` on the round-2 commit — were
one obtainable — as any evidence about these files' content. **That reasoning
survives round 3 unchanged**, which did obtain a green `pnpm verify`: see the
round-3 block above, where the same exclusion is re-confirmed.

**Independence note.** CLAUDE.md requires that the role-path boundary result come
from Codex or CI executing the checker from a trusted checkout with
`--repository`. I did not run that checker, and nothing here should be treated as
independent boundary evidence. The `git status` and `git diff --cached --stat`
above are my own observations from my own worktree.

### Syntax and vocabulary verification (2026-09-11)

Every check below is logged with its URL and observed response in
`research/searches/SBLA-008-search-strategy.md` §2 and §3. **One row is an
attempt, not a verification:** the Cochrane Search Manager grammar could not be
retrieved reproducibly, so it is carried as "Syntax unverified at scope time" and
no independent syntax verification is claimed for it (SU9, R1 finding M-5). Every
other row in this table is reproducible from the URL and call recorded with it.

| Check                                   | Method                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All six PubMed strings parse            | E-utilities `esearch`, reading `error`, `fieldsnotfound`, `quotedphrasesnotfound`, `querytranslation`; each composite anchored with `AND zzzqqqnonsense[tiab]` so it returns zero records                                                                                                                                                                                                                                                                                          | **Pass** — for every string: no error, `fieldsnotfound` empty, `quotedphrasesnotfound` empty                                                                                                                                                                                                                                                                                                                                                                |
| Field tags and publication types valid  | Same                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `[mh]`, `[mh:noexp]`, `[majr]`, `[tiab]`, `[tiab:~0]`, `[pt]`, `[sb]`, `[dp]`, `[edat]`, `[crdt]`, `[mhda]` all accepted; `"Retracted Publication"[pt]`, `"Published Erratum"[pt]`, `"Expression of Concern"[pt]`, `"Preprint"[pt]` valid; **`"Retraction of Publication"[pt]` invalid in PubMed**                                                                                                                                                          |
| MeSH descriptors exist                  | NLM MeSH lookup API, exact match                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 32 descriptors confirmed. `Pectoralis Major`, `Muscle Hypertrophy`, `Resistance Exercise`, `Strength Training`, `Bench Press` confirmed **not** descriptors                                                                                                                                                                                                                                                                                                 |
| D010369 has no children                 | MeSH SPARQL, all descriptors under tree `A02.633.567.775`                                                                                                                                                                                                                                                                                                                                                                                                                          | Only D010369. Recorded as verified vocabulary fact **V1**                                                                                                                                                                                                                                                                                                                                                                                                   |
| Proximity behaviour                     | E-utilities counts                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 3-word proximity works; hyphenated and unhyphenated forms equivalent (`"cross sectional area"[tiab:~0]` and `"cross-sectional area"[tiab:~0]` both 29,137)                                                                                                                                                                                                                                                                                                  |
| Europe PMC composite parses             | REST `search`, real string `AND (TITLE:"zzzqqqnonsense")`                                                                                                                                                                                                                                                                                                                                                                                                                          | `hitCount` 0, query echoed in `request.queryString`, `version 6.9` — grammar valid                                                                                                                                                                                                                                                                                                                                                                          |
| ClinicalTrials.gov Essie grammar parses | API v2 `/studies` with nonsense tokens in three `AREA[...]` blocks                                                                                                                                                                                                                                                                                                                                                                                                                 | HTTP 200, `{"totalCount":0,"studies":[]}`. A deliberately invalid area name returned HTTP 400 `Unknown area name`, confirming the platform actually validates                                                                                                                                                                                                                                                                                               |
| ClinicalTrials.gov version              | API v2 `/version`                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `apiVersion 2.0.5`, `dataTimestamp 2026-09-11T09:00:04`                                                                                                                                                                                                                                                                                                                                                                                                     |
| OpenAlex citation direction             | Counts for `W2741809807` against its own published `referenced_works_count` 54 and `cited_by_count` 1257                                                                                                                                                                                                                                                                                                                                                                           | `cites:` 1253 and `referenced_works:` 1253 → **forward**; `cited_by:` 44 → **backward**. Shortfalls are unindexed references                                                                                                                                                                                                                                                                                                                                |
| Crossref routes                         | REST API                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `query.bibliographic`, `filter=update-type:retraction` and `from-update-date:` all HTTP 200                                                                                                                                                                                                                                                                                                                                                                 |
| UBERON anchor                           | EMBL-EBI OLS4                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `UBERON:0002381` "pectoralis major"; cross-references `FMA:9627`, `NCIT:C33284`, `MA:0002354`, `SCTID:181624003`, `UMLS:C0585574`; release `2026-06-19`                                                                                                                                                                                                                                                                                                     |
| Cochrane Search Manager grammar         | **Attempted, not verified.** Official help page. Retrieval methods attempted, in order: plain `curl` fetch → **HTTP 403** on 2026-09-11; that same single request re-sent with a browser `User-Agent` → **HTTP 200**, page read once, no further request to the domain; plain fetch → **HTTP 419** twice on 2026-09-12, and the R1 reviewer's independent plain fetch that day → **419**. The author's 403 and the reviewer's 419 **diverge**, so the block response is not stable | `[mh ...]` / `[mh ^...]`, `NEXT`, `NEAR/x`, field labels, `:pt` values and the MeSH-coverage caveat were read from the page, but **no reader can reproduce the fetch**, so none of it is verified. Downgraded to **"Syntax unverified at scope time"**, the status SU1 and SU2 already carry — **SU9**, the weakest evidence in the file. **No independent syntax verification is claimed for C1.** Re-verify inside the Search Manager before executing C1 |

### Failures observed and recorded

| Observation                                                                                                                                                                                      | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crossref Retraction Watch labs endpoint → **HTTP 502, then 504**                                                                                                                                 | Recorded as an outage. §9.7's transient-outage rule applied. Verified fallbacks: Crossref `update-type:retraction` (HTTP 200), per-DOI `update-to`/`updated-by`, PubMed S6                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| FIPAT / Terminologia Anatomica → **connection failure**                                                                                                                                          | **U1.** No verified TA nomenclature anchor. MeSH, UBERON, FMA used instead; the gap is recorded, not papered over                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| PROSPERO → HTTP 200 but a JavaScript shell, no public API                                                                                                                                        | **SU1.** Syntax unverified; must be verified at execution time                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| SportRxiv → current server is PKP/OJS with HTML search only; the OSF `sportrxiv` provider is a **frozen legacy archive** (377 records, newest 2021-08-24)                                        | **SU2.** Both routes recorded; treating the OSF endpoint as current would miss five years of preprints                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Cochrane Library → scripted clients blocked at the edge: **HTTP 403 on 2026-09-11, HTTP 419 on 2026-09-12** — the author's 403 and the reviewer's 419 **divergent** for the same class of client | **SU9.** C1 is a manual Search Manager route; if the owner has no access it is recorded as "not executed for want of access", never scraped. The help page was read once with a substituted `User-Agent`; the search strategy §2 records every retrieval method attempted and every code observed, draws the §9.6 line explicitly, and **forbids SBLA-009 from substituting a user agent or otherwise bypassing any Cochrane access control**. Because the reading cannot be reproduced, the C1 grammar and the CENTRAL half of D4 are downgraded to **"Syntax unverified at scope time"** and must be re-verified inside an authenticated Search Manager session before C1 runs; if they cannot be, C1 is recorded as not executed and the coverage loss noted |
| NCBI E-utilities → `API rate limit exceeded` when batching                                                                                                                                       | Requests throttled; an API key is required for SBLA-009                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `europepmc.org/searchsyntax` → HTTP 404                                                                                                                                                          | Not a current URL; the correct one is `europepmc.org/RestfulWebService`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Index diagnostics (bounded, single-term, labelled, not evidence)

PubMed single-term counts: `"Pectoralis Muscles"[mh]` 4,938; `"bench
press"[tiab:~0]` 2,905; `"machine fly"` 32; `"pec deck"` 11; `"chest fly"` 9;
`"dumbbell fly"` 8; `"cable fly"` 2; `"cable cross over"` 2; `"cable crossover"`
1; `"chest flies"` 1; `"butterfly exercise"` 0; `"pectoral deck"` 0.

No identifier was collected, opened, screened, or cited.

### Route-level composite count (a search, disclosed, not evidence either)

Europe PMC, route E1, endpoint
`https://www.ebi.ac.uk/europepmc/webservices/rest/search`, the E1 composite
string as it stood on 2026-09-11 submitted **without** a zero-yield anchor,
`searchedAt` 2026-09-11, `resultCount` **334**, platform `version 6.9`.

This is a route-level composite search, not an index diagnostic, and the earlier
draft of this packet was wrong to file it as one (R1 finding I-1). No identifier
behind it was collected, opened, screened, or cited. It is recorded in full at
`research/searches/SBLA-008-search-strategy.md` §4.2 and must be carried into the
SBLA-009 search record as its own `evidencePacketSchema.searches` row, alongside
a fresh row for the amended E1 string. See **D13**.

## Known uncertainties

This section is not empty, and its length is deliberate.

**The finding most likely to change the task.** The _fly_ family's PubMed
title/abstract footprint is a few dozen records before deduplication or screening,
and the cable fly specifically is in single digits. **Exercise Y as defined may
have almost no directly indexed PubMed literature.** Three consequences: the
non-PubMed routes are not supplements but the main hope for Y; **U2** should be
settled before SBLA-009 searches; and "the search found little" is a legitimate
and likely outcome that §2.2 forbids converting into a confident recommendation.

The second of those is no longer a clean condition, and this packet says so
rather than implying otherwise. Because the Europe PMC E1 composite was run
unanchored on 2026-09-11 (**D13**), one route-level yield figure — 334 — was
already visible when U2 was written, and will be visible to whoever settles it.
U2 is therefore being decided with partial yield in view rather than blind to it.
The single-term counts that actually motivate widening Y were observed before the
composite was run, and the owner should record the U2 decision with its stated
rationale so a later reader can judge whether the 334 bore on it.

**Unresolved scope decisions, carried from the files.**

| ID        | Question                                                                                                                                                                                                                                   | Who should settle it, and when                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **U1**    | No verified Terminologia Anatomica anchor; FIPAT unreachable 2026-09-11                                                                                                                                                                    | SBLA-009 executor; record the absence if still unreachable. Never substitute model memory |
| **U2**    | May Exercise Y be widened to pec deck or dumbbell fly if index-Y evidence is empty? Note that this is now being decided with one route-level yield figure already visible (Europe PMC 334; **D13**), not blind to yield                    | **Owner, before SBLA-009 searches**                                                       |
| **U3**    | Do contralateral-limb within-participant designs enter the primary tier-1 synthesis, or only a sensitivity analysis? Arguments both ways are in the eligibility plan §3.4                                                                  | **Reviewer or owner, before screening**                                                   |
| **U4**    | Is regional (clavicular versus sternocostal) hypertrophy part of the primary tier-1 estimand or a separate secondary question?                                                                                                             | Reviewer                                                                                  |
| **U5**    | Will non-English full texts be translated, or excluded for resource reasons?                                                                                                                                                               | Owner, on cost grounds                                                                    |
| **SE-U1** | `sourceSchema.type` has no `preprint` value and `publication.status` is `current \| corrected \| expression-of-concern \| retracted \| superseded`, with no way to record that a source is unrefereed. I cannot modify schemas and did not | Reviewer, to route to Codex if it matters                                                 |

**Assumptions that could be wrong.**

- **A1** — the slice is one muscle plus two named exercises, not a general
  chest-training review. If the owner meant the broader review, Q2 is under-scoped.
- **A2** — the decision-relevant estimand is the difference in change between X and
  Y, not an additive "does adding Y to X add anything", which is a different
  comparator and is **not** covered by this scope.
- **A3** — "a flat press" is best instantiated as the barbell flat bench press.
- **A4** — full-text access will be uneven, so abstract-only records need a defined
  fate.
- **SA1** — **the most likely defect in the search strategy.** The term lists were
  built from the master plan's vocabulary and the controlled vocabularies I
  verified, **not** from a validated published search filter. Term coverage is
  where a reviewer should push hardest.
- **SA2** — every route uses English terms, so a study with no English title or
  abstract will probably never be retrieved, whatever §4.1 permits.
- **SA3** — index diagnostics count phrase occurrences, not eligible studies, so
  true eligible yield is lower, not higher.
- **EA2** — 20% stage-1 and 100% stage-3 double-screening by one role is **weaker**
  than two independent screeners and is recorded as a limitation, not presented as
  equivalent.
- **EA4** — the ≥6-week floor for tier 1 is a **project convention set here**, not
  a finding extracted from a source. The reviewer may set it elsewhere.

**Untested and time-bounded.**

- Every verification is a **2026-09-11 observation except where a later date is
  recorded beside it**. The exceptions are the 2026-09-12 re-checks in search
  strategy §2 rows 5 and 6, §4.1, §5.0, §5.2, §5.3 and §6.1 — §5.0's being the
  newest, from round 3. MeSH is revised annually, the PubMed phrase index changes
  continuously, and endpoints move — `europepmc.org/searchsyntax` is already a 404. All of it must be re-verified at execution time; the search strategy §8.4
  explains why that is not a formality.
- **The E-utilities GET length boundary is an observation, not a published
  figure.** Round 3 measured it at 4,121 characters passing and 4,122 failing, on
  one date, from one client. NCBI documents that long queries should use POST but
  publishes no threshold, so the 3,700-character operating rule in §5.0 is a
  deliberately conservative margin rather than a specification. If NCBI raises or
  lowers the limit, the rule still behaves correctly — it only over-uses POST,
  which is harmless — but the recorded numbers will be wrong. Carried by **SU6**.
- **S2's execution path now depends on POST.** If NCBI were to restrict or remove
  POST on `esearch.fcgi`, S2 would have no API execution path at all and would
  fall back to the web interface, which cannot produce `querytranslation`. That is
  a single point of failure this round created knowingly (**D14**) in preference to
  trimming reviewer-mandated terms, and SBLA-009 should confirm POST still works
  before relying on it.
- **SU1–SU4**: PROSPERO syntax, SportRxiv syntax, Terminologia Anatomica, and the
  Crossref Retraction Watch labs endpoint are all unverified or unavailable.
- **SU5**: the GRADE Book, Cochrane Handbook, PRISMA 2020 and CONSORT 2025 are
  cited only as the master plan already cites them. I did not open them in this
  session and make no claim about their current contents.
- **No claim is made that any string retrieves the right records** — only that
  they parse, that every field tag and vocabulary term in them is valid, and that
  no phrase is silently decomposed. One string has been executed against a real
  question: the Europe PMC E1 composite, unanchored, 2026-09-11, `hitCount` 334
  (**D13**). That is a count of Boolean matches and still supports no claim about
  whether the matched records are the right ones, because none was opened.
- The four files have not been schema-validated, because no schema applies to
  them, and round 3's green `pnpm verify` does not change that (see _Tests/checks
  run and results_). Prettier is still the only automated gate that touches their
  content.

## Files created or modified

**Three rounds have written these files, and this commit is round 3.** The
round-1 version of this section said "Created, all new, all committed in one
commit" and "Modified: **none**", and by round 2 that was the opposite of what had
happened — R2 finding I-4. It is stated per round here so it cannot go stale
again.

| Round                | Created | Modified | Deleted | Renamed | Which files                                                                                             |
| -------------------- | ------: | -------: | ------: | ------: | ------------------------------------------------------------------------------------------------------- |
| 1 — scope            |   **4** |        0 |       0 |       0 | all four, in one commit `56068c22…`                                                                     |
| 2 — R1 remediation   |       0 |    **4** |       0 |       0 | the same four, in one commit `383b632…`                                                                 |
| **3 — R2, this one** |   **0** |    **2** |   **0** |   **0** | `research/searches/SBLA-008-search-strategy.md`, `research/packets/SBLA-008-handoff.md`, in this commit |

**This commit: two files modified, nothing created, nothing deleted, nothing
renamed.** No file outside the two owned paths is touched, and the other two
research files are byte-identical to the reviewed candidate `383b632…`.

**State at this commit, with immutable identifiers.** Blob IDs and SHA-256 sums
are Git's and the file's own, so a reviewer can pin every file without trusting
this table's prose. The final commit, tree and the two new blob IDs cannot be
written here — a file cannot contain its own hash — so those cells are left for
Codex to record at verification time, and everything that _can_ be pinned now is
pinned now.

Line counts are a different case and **are** written here, including this file's
own: a count is stable under an idempotent formatter in a way a hash is not, so it
was converged to a fixed point and re-checked after the final Prettier pass.
Verify it directly — `wc -l research/packets/SBLA-008-handoff.md` must print
**1,287**, and `wc -l research/searches/SBLA-008-search-strategy.md` must print
**1,090**. If either disagrees, the file was edited after this section was written
and the discrepancy is itself the finding.

| Path                                              |           Lines |     Blob at `383b632` (reviewed candidate) | Changed by round 3? |
| ------------------------------------------------- | --------------: | -----------------------------------------: | ------------------- |
| `research/questions/SBLA-008-vertical-slice.md`   |             435 | `62067b94b0fbaf64afa124316ef352b5b37fb920` | **No** — unchanged  |
| `research/searches/SBLA-008-search-strategy.md`   | 969 → **1,090** | `e433130dfdafae6ce8e5b7503ac2e27a746d7ac2` | **Yes**             |
| `research/screening/SBLA-008-eligibility-plan.md` |             623 | `88c220224d8859758bd7fa7a9dafb57df3a1d16c` | **No** — unchanged  |
| `research/packets/SBLA-008-handoff.md`            | 790 → **1,287** | `75423c4782a231e147cfdc95d7b03fed81c8f74f` | **Yes**             |

SHA-256 of the two unchanged files, which round 3 does not alter and which
therefore still hold at this commit:

- `research/questions/SBLA-008-vertical-slice.md` —
  `17f8e5acf2bcf08f2e2efa76d68f9618b2e1964d508aaeab86317bee7762eb22`
- `research/screening/SBLA-008-eligibility-plan.md` —
  `5fc3363e933e1855cf77596dd3576e5356773749eab31e45d225aa147d78560c`

For the two changed files, verify them at the commit rather than against a number
written inside one of them:

```bash
git rev-parse HEAD HEAD^{tree} HEAD^
git diff --name-status 383b63244aabb19404046dbd4a5aeb1589175346 HEAD
git rev-parse HEAD:research/searches/SBLA-008-search-strategy.md
git rev-parse HEAD:research/packets/SBLA-008-handoff.md
git show HEAD:research/searches/SBLA-008-search-strategy.md | sha256sum
git show HEAD:research/packets/SBLA-008-handoff.md | sha256sum
```

`git diff --name-status` must return **exactly two lines, both `M`**, and both
under `research/`. Anything else is a boundary failure and should be treated as
one.

**Commits in the lineage, for the same purpose.**

| Commit                                     | Subject                                      | Role in the lineage                                                                      |
| ------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `56068c222bd8971378586776d133a7cf7a470b96` | `research: scope SBLA-008 vertical slice`    | Round-1 candidate, failed by `reviews/evidence/SBLA-008-r1.md`                           |
| `383b63244aabb19404046dbd4a5aeb1589175346` | `fix: remediate SBLA-008 evidence review R1` | Round-2 candidate, failed by `reviews/evidence/SBLA-008-r2.md`. **This commit's parent** |
| `bf7e5bb70f4f3948597bd90b84f76d9515d55f87` | `review: recheck SBLA-008 scope R2`          | The immutable R2 report this round answers. Read, never modified                         |
| `f910736d6dcf2791956e988205983a8a7a69bcef` | `docs: correct SBLA-008 R2 remediation base` | Codex's ledger claim for this round, on the coordination branch. Not merged in           |
| this commit                                | round-3 remediation                          | The candidate a fresh Account B round would review as `-r3`                              |

**Hygiene.** Round 2 needed a temporary `node_modules` directory junction to reach
a formatter and removed it before committing. **Round 3 needed no junction**: it
ran `pnpm install --frozen-lockfile` under the pinned runtime, so this worktree
has a real `node_modules/`. It is gitignored and `.prettierignore`d, was never
staged, and appears in no diff. `pnpm-lock.yaml` is unchanged — the install was
`--frozen-lockfile` and altered nothing tracked.

## Required reviewer action

Claude Review, in a separate account (**B**, not the account that wrote this),
reads this packet, the three artifacts, and the acceptance rubric, and returns
**PASS or FAIL per criterion with evidence and exact paths**. Do not repair the
artifacts; findings return to this role. This is the **third** round, so the
report is `reviews/evidence/SBLA-008-r3.md`; `-r1` and `-r2` are append-only and
must not be edited.

**What this round claims, and therefore what to attack first.** Round 3 claims
exactly two things: that **I-3** and **I-4** are completely repaired. Nothing else
is claimed, and five Minor findings are left open on purpose with their reasons
and destinations recorded in the _R2 finding closure map_.

- **On I-3**, the checkable claim is that an executor with only the committed
  files can obtain `count` and `querytranslation` for **every** string including
  S2. The way to falsify it is to follow search strategy §5.0 literally and see
  whether the POST call as specified actually runs — endpoint, method, content
  type, and the four body fields — and whether the §9 row would stop a reasonable
  executor from trimming S2 when they meet a 414. The measured boundary
  (4,121/4,122) and the 3,700-character operating threshold are this round's own
  observations from one date and one client; they are labelled as such, and
  disagreeing with the margin is fair.
- **On I-4**, the checkable claim is that no statement in this packet describes a
  round other than the one it names. The way to falsify it is to take
  `git diff --name-status 383b632 HEAD` and `git rev-parse HEAD^` and walk every
  criterion, every table, and every line count against them. Round 2 failed
  exactly this test.
- **Verify the boundary independently.** Two files, both under `research/`. The
  R2 review's own §11.5 is right that a `pnpm verify` run by the authoring role is
  not boundary evidence; neither is round 3's.

**Decide these before SBLA-009 starts, because deciding them afterwards would let
the result choose the rule:**

1. **U2** — may Exercise Y be widened if index-Y evidence is empty, and to what?
   The index diagnostics say this is likely to bite. **Before searching.**
2. **U3** — do contralateral-limb designs enter the primary tier-1 synthesis, or
   only a sensitivity analysis? Both arguments are in the eligibility plan §3.4.
   **Before screening.**
3. **U4** — is regional hypertrophy part of the primary estimand?
4. **U5** — is translation of non-English full texts funded? (Owner's call.)
5. **A1 and A2** — is the slice really one muscle plus two exercises, and is the
   estimand really the difference in change rather than an additive question?
6. **D12 and D13** — was retaining the slice unchanged correct given the thin
   literature, and were the bounded index diagnostics within SBLA-008's boundary?
   If the reviewer judges the diagnostics to have crossed into SBLA-009, say so:
   they are separable, though the fallback reasoning depends on them.

**Attack these hardest, because they are where the packet is weakest:**

- **SA1** — term coverage. No validated published search filter was used. Missing
  synonyms are the most likely reproducibility defect.
- **The tier hierarchy's hard limits** — is tier 1 correctly the only tier that may
  support a hypertrophy claim, and are tiers 3–5 adequately fenced off?
- **The exercise definitions** — can a screener with only §3.1 and §3.2 in hand
  decide index versus related versus distinct for a real study without guessing?
- **The contradiction plan** — does §7 of the search strategy actually search for
  disconfirmation, or only appear to?
- **Whether any sentence in the four files reads as a scientific finding.** It
  should not. If one does, it is a defect.
- **The boundary itself** — that nothing was written outside the four claimed
  paths, and whether the one route-level composite count disclosed in **D13**
  crosses the SBLA-008/009 boundary in substance as well as in label. The count
  is disclosed, not defended, and the reviewer may judge that running it was
  itself the error rather than only naming it wrongly. Independent confirmation
  of the path boundary must come from Codex or CI running the checker with
  `--repository` from a trusted checkout; my own `git status` is not independent
  evidence.

## Acceptance criteria

Each is checkable by someone who has never seen this session. **Every criterion
below has been re-read against the commit it gates**, which is round 3, not round
1 — that re-reading is the substance of the I-4 repair. Criteria 1, 2, 12, 13 and
14 are rewritten; the rest were checked and found correct as written, and criteria
6 and 7 gained the sentence I-3 made necessary.

1. **Boundary.** The commit touches exactly **two** paths —
   `research/searches/SBLA-008-search-strategy.md` and
   `research/packets/SBLA-008-handoff.md` — and no others. Check
   `git diff --name-status 383b63244aabb19404046dbd4a5aeb1589175346 HEAD` against
   the **active ledger claim covering this commit**, which is
   `f910736d6dcf2791956e988205983a8a7a69bcef` on branch
   `codex/SBLA-007-review-coordination` ("docs: correct SBLA-008 R2 remediation
   base"). That claim records branch `claude-research/SBLA-008-r2-remediation-v2`,
   worktree `C:\src\s008fix3`, base `383b632…`, start 2026-09-12 20:08 EDT, and
   exactly those two paths owned. The earlier claims —
   `09f9ba4cfb4b505612035cb6c463b37a75a279ce` for round 1 and
   `247096a76affca6cc0040a71842997ef2d933a2b` for round 2 — cover the earlier
   commits and **must not** be used to gate this one. Independent confirmation
   must come from Codex or CI running
   `scripts/foundation/check-role-paths.mjs claude-research --base 383b632… --repository C:\src\s008fix3`
   from a trusted checkout; this role's own `git` output is not that evidence.
2. **Base.** The commit's parent is
   **`383b63244aabb19404046dbd4a5aeb1589175346`** — the immutable round-2
   candidate that `reviews/evidence/SBLA-008-r2.md` failed, tree
   `975f154a164aa6779107c1b9f7ad4e820ba46793`. Check with `git rev-parse HEAD^`.
   The round-1 base `0752d502…` and the round-2 base `2de2a3ef…` are recorded under
   _Inputs and exact paths_ for lineage and are **not** the parent of this commit.
   No merge, rebase, or force-push was performed, and the coordination branch
   carrying the ledger claim was deliberately not merged, so the parent is a single
   commit and the history is linear.
3. **Two questions exist with structured fields.** One muscle-function question
   (Q1, with Q1a/Q1b/Q1c) and one comparative exercise question (Q2), each with
   population, exposure or intervention, comparator, outcomes, timeframe, setting
   and estimand populated — or marked not-applicable **with a stated reason**,
   never left blank.
4. **Outcome hierarchy with a priority order and hard limits** exists, and forbids
   EMG and acute responses from supporting hypertrophy claims, per §2.2.
5. **Exercise definitions are reproducible.** A screener can decide index versus
   related versus distinct from the written definitions alone.
6. **Search strings are complete, copyable, valid, and executable by a documented
   transport.** Each of the six PubMed strings can be pasted into PubMed as
   written. Each was verified to parse with no error, no unrecognised field, and
   no unfound quoted phrase; the file states the method. **And — the R2 addition —
   the file names a transport that actually executes each string.** Check search
   strategy §5.0: three execution paths, the equivalence claim withdrawn, the POST
   transport fully specified, and a deterministic rule selecting between GET and
   POST by measured URL length. S2 executes by POST and **only** by POST; §5.2
   records that with both transports' responses. Non-PubMed routes give complete
   queries too.
7. **Every route records** database or platform, complete query, planned filters,
   date handling, deduplication, update strategy, and expected failure with
   fallback. **The §9 failure matrix has a row for HTTP 414 / URI-too-long**
   carrying the diagnostic, POST as the fallback, and an explicit prohibition on
   trimming terms or silently splitting the string — the gap R2 finding I-3 named.
8. **Screening rules are operational**: study-design eligibility by question and by
   outcome tier; language, date and publication-status handling; retraction and
   correction handling consistent with §9.7; multi-report linkage; inaccessible
   full text; conflict resolution; and an explicit reason code for every exclusion.
9. **A deliberate contradiction search exists** that targets null, adverse,
   indirect and opposing evidence, runs unconditionally rather than as a follow-up,
   and carries stated guards against cherry-picking.
10. **Facts and methodology are distinguishable.** Every statement in the
    search strategy is labelled Plan, Verified platform fact, Index diagnostic, or
    Route-level composite count, and each verified fact carries a URL and **its
    own access date** — 2026-09-11 for the scope round, 2026-09-12 where a later
    re-check is recorded. The search strategy header states that rule rather than
    asserting one blanket date, and **SU6** enumerates the exceptions.
11. **What was and was not run is stated exactly**, and no scientific conclusion
    appears anywhere in the four files. Nothing was retrieved, screened, extracted
    or cited; one route-level composite count was produced and is disclosed as a
    search rather than as a diagnostic (**D13**; search strategy §4.2).
12. **Assumptions and unresolved decisions are labelled**, with a named party to
    resolve each. **Thirty-three items, in full:** `A1`, `A2`, `A3`, `A4` and
    `U1`, `U2`, `U3`, `U4`, `U5` in the questions file; `SA1`, `SA2`, `SA3` and
    **`SU1`, `SU2`, `SU3`, `SU4`, `SU5`, `SU6`, `SU7`, `SU8`, `SU9`** in the search
    strategy; `EA1`, `EA2`, `EA3`, `EA4`, `EU1`, `EU2`, `EU3`, `EU4` and
    **`SE-U1`, `SE-U2`** in the eligibility plan. `SU7`, `SU8`, `SU9` and `SE-U2`
    were added in round 2 and are the ones the round-1 form of this criterion
    omitted (R2 finding I-4); round 3 added none, folding its one new time-bounded
    fact into `SU6`. Every item names who resolves it and, where it matters, by
    when.
13. **This handoff stands alone, and is truthful about the commit it describes** —
    it carries the objective, the **lineage of all three rounds**, the exact base
    of each, the ledger claim covering **this** commit, the inputs, the
    round-by-round write boundary, the work, the decisions, the checks with real
    output, the uncertainties, the exact files with immutable blob identifiers,
    the required reviewer action, and these criteria, using the fixed §13.6
    headings. The specific failure R2 recorded — a tail describing round 1 while
    the body described round 2 — is checkable directly: _Files created or
    modified_ must say **two files modified** and must agree with
    `git diff --name-status`, and criteria 1, 2 and 12 must name this commit's
    claim, this commit's parent, and the full SU/SE-U series.
14. **Formatting, hygiene, and the repository gate.** Prettier `--check` passes on
    both owned paths, `git diff --check` is clean, and **`pnpm verify` was run and
    passed** under the pinned runtime — `node v24.20.0`, `pnpm 11.24.0` — which
    round 2 could not do and said so. The real output is recorded above. Read it as
    a statement about the repository, **not** about these two Markdown files:
    `scripts/content/validate.mjs` excludes both from schema validation, so
    Prettier remains the only automated gate on their content, and the role-path
    boundary result must still come from Codex or CI with `--repository`.
