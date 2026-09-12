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

## Inputs and exact paths

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
Exactly four files, all new:

- `research/questions/SBLA-008-vertical-slice.md`
- `research/searches/SBLA-008-search-strategy.md`
- `research/screening/SBLA-008-eligibility-plan.md`
- `research/packets/SBLA-008-handoff.md`

**Not touched, and owned elsewhere:** `content/`, `content-drafts/`, `reviews/`,
`schemas/`, `src/`, `scripts/`, `tests/`, any configuration, `CLAUDE.md`,
`AGENTS.md`, and `docs/runbooks/current-work.md` (the ledger — Codex's). No file
outside the four paths was created, edited, or deleted. `git status` at commit
time shows only those four.

**Task constraints observed.**

- **No evidence search was executed.** Nothing was retrieved, screened, extracted,
  appraised, or synthesised. That is SBLA-009's work (§9.8 steps 2–7).
- **No scientific conclusion is drawn anywhere in the four files.** Every
  anatomical or exercise term is used as a scoping label.
- **Model memory is not used as evidence** (CLAUDE.md; §13.8). Every factual
  statement about a database, a vocabulary, or an endpoint is tied to a URL I
  opened on 2026-09-11 and to the response I observed.
- **Extracted fact and proposed methodology are kept typographically distinct.**
  The search strategy labels every statement **Plan**, **Verified platform fact**,
  or **Index diagnostic** (§0 of that file).
- **Assumptions and unresolved decisions are labelled, not smoothed over**:
  A1–A4 and U1–U5 (questions), SA1–SA3 and SU1–SU6 (search strategy), EA1–EA4,
  EU1–EU4 and SE-U1 (eligibility plan).
- **No secrets, credentials, keys, or tokens** were written into any file or into
  any chat. No API key was used or recorded; where one is needed (NCBI), the file
  says so without containing one.

**Queue boundaries deliberately left alone.** SBLA-009 owns search execution,
screening, extraction, appraisal, synthesis, and draft claims. Schema changes are
Codex's (relevant to finding **SE-U1** below). Review is Claude Review's, in a
separate account.

## Work completed

Three substantive artifacts plus this packet. Nothing of the kind existed at
`0752d502`.

### 1. `research/questions/SBLA-008-vertical-slice.md` (414 lines)

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

### 2. `research/searches/SBLA-008-search-strategy.md` (746 lines)

- **§0** states plainly that no search has been run, and defines the three labels
  used throughout: **Plan**, **Verified platform fact**, **Index diagnostic**.
- **§1** maps thirteen routes (S1–S6 PubMed; E1 Europe PMC; C1 Cochrane CENTRAL;
  T1 ClinicalTrials.gov; O1 OpenAlex; X1 Crossref; P1 preprints; R1 PROSPERO; V1
  terminology) with a stated reason why each is needed beyond PubMed.
- **§2** is the **verification log**: eighteen rows, each with the official URL,
  what was checked, and what came back, all on 2026-09-11.
- **§3** records the five platform facts that changed the strategy (see _Decisions
  made_).
- **§4** records the bounded index diagnostics and the scope finding they force.
- **§5** gives the **six complete, copyable PubMed strings**, each verified to
  parse with no error, no unrecognised field, and no unfound quoted phrase, each
  with its purpose, its filters as separately recorded steps, its expected failure
  mode, and its fallback.
- **§6** gives the non-PubMed routes with complete queries: the Europe PMC
  composite string (verified to parse), a nine-line Cochrane Search Manager
  strategy written to the verified Search Manager grammar, ClinicalTrials.gov API
  v2 calls in both simple and Essie forms (grammar verified), OpenAlex citation
  chaining in both directions, Crossref status routes, the preprint routes, and
  the terminology anchors.
- **§7** is the deliberate contradiction search: what is being looked for, seven
  fixed procedures, and eight guards against cherry-picking.
- **§8** fixes date handling, the five-step deduplication ladder, what must be
  recorded for every search, and the update strategy.
- **§9** is the failure and fallback matrix, including the three outages and two
  access blocks actually observed.
- **§10** lists the assumptions and the four routes whose syntax could not be
  verified.

### 3. `research/screening/SBLA-008-eligibility-plan.md` (552 lines)

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
- **§5** thirty-one stable exclusion reason codes in five families, and an explicit
  statement that there is **no code for "low quality"** — quality is appraised,
  not screened.
- **§6** ten anti-cherry-picking rules, the amendment procedure, and the required
  contents of the screening log.
- **§7** conflict resolution within the role (20% stage-1 and 100% stage-3
  double-screening, recorded self-disagreement, `unclear-escalated`) and between
  roles.

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
search.** It returns zero and appears in `quotedphrasesnotfound`. It **is** a valid
`:pt` value in Cochrane's Search Manager, so the strategy keeps it for CENTRAL and
drops it for PubMed, and records the platform difference rather than treating it
as a vocabulary error.

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

**D13 — bounded index diagnostics were run deliberately, and are labelled.** To
design fallbacks honestly I needed to know whether the routes would return
anything. Single-term counts were taken from each platform's own index. No
identifier was collected, opened, screened, or cited, and no composite question
query was executed. They are labelled **Index diagnostic** and explicitly declared
not to be evidence. A reviewer who judges even this to cross the SBLA-008/009
boundary should say so; the counts are separable from the rest of the plan, though
the fallback reasoning and **D12** depend on them.

## Tests/checks run and results

### Repository checks

| Check                            | Command                                                                                                    | Result                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Formatter                        | `node node_modules/prettier/bin/prettier.cjs --write` on the four paths                                    | Applied. All four reformatted to repository style       |
| Formatter verification           | `node node_modules/prettier/bin/prettier.cjs --check` on the four paths                                    | **Pass** — "All matched files use Prettier code style!" |
| Whitespace                       | `git add` the four paths, then `git diff --cached --check`                                                 | **Pass** — no output, exit 0                            |
| Diff scope                       | `git status --porcelain` and `git diff --cached --stat`                                                    | Only the four claimed paths appear                      |
| Query integrity after formatting | Node script asserting each of the six validated PubMed strings appears byte-for-byte in the committed file | **Pass** — S1–S6 all `PRESENT-VERBATIM`                 |

**`pnpm verify` was NOT run. It could not be run in this environment.** `pnpm`
fails before executing anything:

```
Your Node version is incompatible with "C:\src\s008research".
Expected version: >=24.20.0 <25
Got: v24.19.0
```

The Node on `PATH` is v24.14.0 and the runtime's bundled Node is v24.19.0; the
manifest's `engines.node` floor is `>=24.20.0`. Neither satisfies it. I am
recording this plainly rather than implying a check that never ran.

**How the formatter was still run.** This worktree has no `node_modules`. I
created a temporary Windows directory junction
`C:\src\s008research\node_modules` → `C:\src\sciatlas\node_modules`, ran the
repository's own Prettier **3.9.6** against the worktree's own
`.prettierrc.mjs`, and **removed the junction afterwards**. `node_modules/` is
listed in `.gitignore` and `.prettierignore`; the junction was never committed and
no longer exists. The Prettier binary came from the main checkout because it is
the same pinned dependency, and the configuration came from this worktree.

**What the repository checks would and would not have covered.** I inspected
`scripts/content/validate.mjs`: `RECORD_ROOTS` is
`['content','content-drafts','research/packets','reviews/evidence']`,
`RECORD_EXTENSIONS` is `{.json,.yaml,.yml}`, and `isIgnored()` explicitly skips
`research/packets/*-handoff.md`. `research/questions/`, `research/searches/` and
`research/screening/` are not record roots. **All four files are therefore outside
schema validation, and Prettier is the only automated gate that applies to them.**
A reviewer should not read a green `pnpm verify` on this commit — were one
obtainable — as any evidence about these files' content.

**Independence note.** CLAUDE.md requires that the role-path boundary result come
from Codex or CI executing the checker from a trusted checkout with
`--repository`. I did not run that checker, and nothing here should be treated as
independent boundary evidence. The `git status` and `git diff --cached --stat`
above are my own observations from my own worktree.

### Syntax and vocabulary verification (2026-09-11)

Every check below is logged with its URL and observed response in
`research/searches/SBLA-008-search-strategy.md` §2 and §3.

| Check                                   | Method                                                                                                                                                                                    | Result                                                                                                                                                                                                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All six PubMed strings parse            | E-utilities `esearch`, reading `error`, `fieldsnotfound`, `quotedphrasesnotfound`, `querytranslation`; each composite anchored with `AND zzzqqqnonsense[tiab]` so it returns zero records | **Pass** — for every string: no error, `fieldsnotfound` empty, `quotedphrasesnotfound` empty                                                                                                                                                                                                       |
| Field tags and publication types valid  | Same                                                                                                                                                                                      | `[mh]`, `[mh:noexp]`, `[majr]`, `[tiab]`, `[tiab:~0]`, `[pt]`, `[sb]`, `[dp]`, `[edat]`, `[crdt]`, `[mhda]` all accepted; `"Retracted Publication"[pt]`, `"Published Erratum"[pt]`, `"Expression of Concern"[pt]`, `"Preprint"[pt]` valid; **`"Retraction of Publication"[pt]` invalid in PubMed** |
| MeSH descriptors exist                  | NLM MeSH lookup API, exact match                                                                                                                                                          | 32 descriptors confirmed. `Pectoralis Major`, `Muscle Hypertrophy`, `Resistance Exercise`, `Strength Training`, `Bench Press` confirmed **not** descriptors                                                                                                                                        |
| D010369 has no children                 | MeSH SPARQL, all descriptors under tree `A02.633.567.775`                                                                                                                                 | Only D010369. Recorded as verified vocabulary fact **V1**                                                                                                                                                                                                                                          |
| Proximity behaviour                     | E-utilities counts                                                                                                                                                                        | 3-word proximity works; hyphenated and unhyphenated forms equivalent (`"cross sectional area"[tiab:~0]` and `"cross-sectional area"[tiab:~0]` both 29,137)                                                                                                                                         |
| Europe PMC composite parses             | REST `search`, real string `AND (TITLE:"zzzqqqnonsense")`                                                                                                                                 | `hitCount` 0, query echoed in `request.queryString`, `version 6.9` — grammar valid                                                                                                                                                                                                                 |
| ClinicalTrials.gov Essie grammar parses | API v2 `/studies` with nonsense tokens in three `AREA[...]` blocks                                                                                                                        | HTTP 200, `{"totalCount":0,"studies":[]}`. A deliberately invalid area name returned HTTP 400 `Unknown area name`, confirming the platform actually validates                                                                                                                                      |
| ClinicalTrials.gov version              | API v2 `/version`                                                                                                                                                                         | `apiVersion 2.0.5`, `dataTimestamp 2026-09-11T09:00:04`                                                                                                                                                                                                                                            |
| OpenAlex citation direction             | Counts for `W2741809807` against its own published `referenced_works_count` 54 and `cited_by_count` 1257                                                                                  | `cites:` 1253 and `referenced_works:` 1253 → **forward**; `cited_by:` 44 → **backward**. Shortfalls are unindexed references                                                                                                                                                                       |
| Crossref routes                         | REST API                                                                                                                                                                                  | `query.bibliographic`, `filter=update-type:retraction` and `from-update-date:` all HTTP 200                                                                                                                                                                                                        |
| UBERON anchor                           | EMBL-EBI OLS4                                                                                                                                                                             | `UBERON:0002381` "pectoralis major"; cross-references `FMA:9627`, `NCIT:C33284`, `MA:0002354`, `SCTID:181624003`, `UMLS:C0585574`; release `2026-06-19`                                                                                                                                            |
| Cochrane Search Manager grammar         | Official help page                                                                                                                                                                        | `[mh ...]` / `[mh ^...]`, `NEXT`, `NEAR/x`, field labels, `:pt` values, and the MeSH-coverage caveat confirmed                                                                                                                                                                                     |

### Failures observed and recorded

| Observation                                                                                                                                               | Response                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crossref Retraction Watch labs endpoint → **HTTP 502, then 504**                                                                                          | Recorded as an outage. §9.7's transient-outage rule applied. Verified fallbacks: Crossref `update-type:retraction` (HTTP 200), per-DOI `update-to`/`updated-by`, PubMed S6 |
| FIPAT / Terminologia Anatomica → **connection failure**                                                                                                   | **U1.** No verified TA nomenclature anchor. MeSH, UBERON, FMA used instead; the gap is recorded, not papered over                                                          |
| PROSPERO → HTTP 200 but a JavaScript shell, no public API                                                                                                 | **SU1.** Syntax unverified; must be verified at execution time                                                                                                             |
| SportRxiv → current server is PKP/OJS with HTML search only; the OSF `sportrxiv` provider is a **frozen legacy archive** (377 records, newest 2021-08-24) | **SU2.** Both routes recorded; treating the OSF endpoint as current would miss five years of preprints                                                                     |
| Cochrane Library → HTTP 403 to scripted access                                                                                                            | C1 is a manual Search Manager route; if the owner has no access it is recorded as "not executed for want of access", never scraped                                         |
| NCBI E-utilities → `API rate limit exceeded` when batching                                                                                                | Requests throttled; an API key is required for SBLA-009                                                                                                                    |
| `europepmc.org/searchsyntax` → HTTP 404                                                                                                                   | Not a current URL; the correct one is `europepmc.org/RestfulWebService`                                                                                                    |

### Index diagnostics (bounded, labelled, not evidence)

PubMed single-term counts: `"Pectoralis Muscles"[mh]` 4,938; `"bench
press"[tiab:~0]` 2,905; `"machine fly"` 32; `"pec deck"` 11; `"chest fly"` 9;
`"dumbbell fly"` 8; `"cable fly"` 2; `"cable cross over"` 2; `"cable crossover"`
1; `"chest flies"` 1; `"butterfly exercise"` 0; `"pectoral deck"` 0. Europe PMC
composite: `hitCount` 334.

No identifier was collected, opened, screened, or cited. No composite question
query was executed. See **D13**.

## Known uncertainties

This section is not empty, and its length is deliberate.

**The finding most likely to change the task.** The _fly_ family's PubMed
title/abstract footprint is a few dozen records before deduplication or screening,
and the cable fly specifically is in single digits. **Exercise Y as defined may
have almost no directly indexed PubMed literature.** Three consequences: the
non-PubMed routes are not supplements but the main hope for Y; **U2** should be
settled before searching, not after the yield is visible; and "the search found
little" is a legitimate and likely outcome that §2.2 forbids converting into a
confident recommendation.

**Unresolved scope decisions, carried from the files.**

| ID        | Question                                                                                                                                                                                                                                   | Who should settle it, and when                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **U1**    | No verified Terminologia Anatomica anchor; FIPAT unreachable 2026-09-11                                                                                                                                                                    | SBLA-009 executor; record the absence if still unreachable. Never substitute model memory |
| **U2**    | May Exercise Y be widened to pec deck or dumbbell fly if index-Y evidence is empty?                                                                                                                                                        | **Reviewer, before SBLA-009 searches**                                                    |
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

- Every verification is a **2026-09-11 observation**. MeSH is revised annually, the
  PubMed phrase index changes continuously, and endpoints move —
  `europepmc.org/searchsyntax` is already a 404. All of it must be re-verified at
  execution time; the search strategy §8.4 explains why that is not a formality.
- **SU1–SU4**: PROSPERO syntax, SportRxiv syntax, Terminologia Anatomica, and the
  Crossref Retraction Watch labs endpoint are all unverified or unavailable.
- **SU5**: the GRADE Book, Cochrane Handbook, PRISMA 2020 and CONSORT 2025 are
  cited only as the master plan already cites them. I did not open them in this
  session and make no claim about their current contents.
- No search string has been executed against a real question, so **no claim is made
  that any of them retrieves the right records** — only that they parse, that every
  field tag and vocabulary term in them is valid, and that no phrase is silently
  decomposed.
- The four files have not been schema-validated, because no schema applies to them
  (see _Tests/checks run and results_).

## Files created or modified

Created, all new, all committed in one commit:

| Path                                              |     Lines | Purpose                                                                                                                                        |
| ------------------------------------------------- | --------: | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `research/questions/SBLA-008-vertical-slice.md`   |       414 | Q1 and Q2 with PICO/PECO fields, exercise definitions, outcome hierarchy, estimand, technique boundaries, exclusions                           |
| `research/searches/SBLA-008-search-strategy.md`   |       746 | Verification log, six PubMed strings, non-PubMed routes, contradiction search, dedup and update strategy, failure matrix                       |
| `research/screening/SBLA-008-eligibility-plan.md` |       552 | Screening workflow, eligibility by question and outcome tier, record-level handling, exclusion codes, anti-cherry-picking, conflict resolution |
| `research/packets/SBLA-008-handoff.md`            | this file | Immutable handoff                                                                                                                              |

Modified: **none.** Deleted: **none.** No file outside these four paths was
touched. A temporary `node_modules` directory junction was created to run the
formatter and then removed; it is gitignored and was never committed.

## Required reviewer action

Claude Review, in a separate account, reads this packet, the three artifacts, and
the acceptance rubric, and returns **PASS or FAIL per criterion with evidence and
exact paths**. Do not repair the artifacts; findings return to this role.

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
- **The boundary itself** — that nothing was written outside the four claimed paths
  and that no search was executed. Independent confirmation of the path boundary
  must come from Codex or CI running the checker with `--repository` from a trusted
  checkout; my own `git status` is not independent evidence.

## Acceptance criteria

Each is checkable by someone who has never seen this session.

1. **Boundary.** The commit touches exactly the four claimed paths and no others.
   Check `git show --stat` on the commit against the ledger claim at
   `09f9ba4cfb4b505612035cb6c463b37a75a279ce`.
2. **Base.** The commit's parent is `0752d5021da72eed840f61ae06f6c1966906c177`.
3. **Two questions exist with structured fields.** One muscle-function question
   (Q1, with Q1a/Q1b/Q1c) and one comparative exercise question (Q2), each with
   population, exposure or intervention, comparator, outcomes, timeframe, setting
   and estimand populated — or marked not-applicable **with a stated reason**,
   never left blank.
4. **Outcome hierarchy with a priority order and hard limits** exists, and forbids
   EMG and acute responses from supporting hypertrophy claims, per §2.2.
5. **Exercise definitions are reproducible.** A screener can decide index versus
   related versus distinct from the written definitions alone.
6. **Search strings are complete, copyable, and valid.** Each of the six PubMed
   strings can be pasted into PubMed as written. Each was verified to parse with no
   error, no unrecognised field, and no unfound quoted phrase; the file states the
   method. Non-PubMed routes give complete queries too.
7. **Every route records** database or platform, complete query, planned filters,
   date handling, deduplication, update strategy, and expected failure with
   fallback.
8. **Screening rules are operational**: study-design eligibility by question and by
   outcome tier; language, date and publication-status handling; retraction and
   correction handling consistent with §9.7; multi-report linkage; inaccessible
   full text; conflict resolution; and an explicit reason code for every exclusion.
9. **A deliberate contradiction search exists** that targets null, adverse,
   indirect and opposing evidence, runs unconditionally rather than as a follow-up,
   and carries stated guards against cherry-picking.
10. **Facts and methodology are distinguishable.** Every statement in the search
    strategy is labelled Plan, Verified platform fact, or Index diagnostic, and
    each verified fact carries a URL and the 2026-09-11 access date.
11. **No search is claimed to have been run**, and no scientific conclusion appears
    anywhere in the four files.
12. **Assumptions and unresolved decisions are labelled**, with a named party to
    resolve each: A1–A4, U1–U5, SA1–SA3, SU1–SU6, EA1–EA4, EU1–EU4, SE-U1.
13. **This handoff stands alone** — it carries the objective, the exact base, the
    inputs, the constraints, the work, the decisions, the checks with real output,
    the uncertainties, the exact files, the required reviewer action, and these
    criteria, using the fixed §13.6 headings.
14. **Formatting and hygiene.** Prettier `--check` passes on all four paths and
    `git diff --check` is clean. That `pnpm verify` could not run in this
    environment is stated plainly above rather than implied to have passed.
