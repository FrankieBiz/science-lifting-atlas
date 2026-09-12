# Eligibility and screening plan — SBLA-008 evidence-system vertical slice

- Task: SBLA-008 (§18 queue row; §14 Phase 1 Task 1.2 scope step)
- Role: Claude Research (account A) — evidence lead, not the independent reviewer
- Pipeline stage: **`scope` only** (§9.8 step 1). The `screen` stage is SBLA-009.
- Base commit: `0752d5021da72eed840f61ae06f6c1966906c177`
- Date written: 2026-09-11
- Companions: `research/questions/SBLA-008-vertical-slice.md` (Q1, Q2, exercise
  definitions, outcome tiers), `research/searches/SBLA-008-search-strategy.md`
  (routes and verification log)

## 0. What this document is and is not

**No screening has been performed.** No record has been retrieved, screened,
included, or excluded. There is no screening log yet, and no count in this file
describes a set of studies.

This file fixes the **rules** — before any result is visible, which is the only
time they can be fixed honestly. §9.8 separates `scope` from `screen` precisely so
that eligibility cannot be reverse-engineered from a result set. Every rule below
is therefore a **plan**, and every rule is written to be executable by a different
model with no access to this conversation.

Two deliberate properties:

1. **Every rule states what to do when the information is missing**, because
   "not reported" is the most common state in this literature and a plan that has
   no branch for it will silently drop studies.
2. **Nothing is excluded merely for being inconvenient.** Where a record is
   awkward — non-English, abstract-only, a preprint, a retracted paper, a
   contradicting result — the rule keeps it in the record set with a label, rather
   than removing it. §2.2 forbids hiding null and contradictory results, and the
   easiest way to hide one is to make it ineligible.

Model memory is not evidence (CLAUDE.md; §13.8). Nothing here is offered as
evidence about anatomy, exercise, or training.

---

## 1. Screening workflow

### 1.1 Stages

| Stage                        | Input                         | Decision                                                                     | Recorded                              |
| ---------------------------- | ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| **0. Deduplication**         | Raw records from every route  | Same study or not                                                            | Dedup key used (search strategy §8.2) |
| **1. Title/abstract screen** | Deduplicated records          | Include / Exclude / Unclear                                                  | Reason code for every exclusion       |
| **2. Acquisition**           | Stage-1 includes and unclears | Full text obtained / not                                                     | Access level (§4.5)                   |
| **3. Full-text screen**      | Everything from stage 2       | Include / Exclude / Related-condition / Contradiction-set                    | Reason code for every exclusion       |
| **4. Classification**        | Stage-3 includes              | Question (Q1 / Q2 / both), outcome tier, index exercise or related condition | Tier and condition labels             |
| **5. Linkage**               | Classified records            | Study-level grouping of multiple reports (§4.3)                              | Study ID and its report list          |

### 1.2 Rules that hold at every stage

- **One decision, one recorded reason.** Every exclusion carries exactly one
  **primary** reason code from §5. Additional reasons may be recorded as
  secondary, but the primary code is what the counts reconcile against, and
  `evidencePacketSchema.exclusions[]` takes exactly one `reason` string per
  excluded source.
- **Liberal at stage 1, strict at stage 3.** At title/abstract, `Unclear` is
  promoted to stage 2, never excluded. A record is excluded at stage 1 only when
  the title or abstract makes ineligibility unambiguous. The cost of a wrong
  stage-1 exclusion is invisible; the cost of a wrong stage-2 promotion is a few
  minutes.
- **Exclusion at stage 3 requires the full text in hand**, or the explicit
  abstract-only route in §4.5.
- **Counts must reconcile.** Retrieved − duplicates − stage-1 exclusions −
  stage-3 exclusions = included. A discrepancy is a defect, not a rounding issue.
- **No rule is changed after results are seen** except by the amendment procedure
  in §6.2.

---

## 2. Core eligibility

### 2.1 Q1 — pectoralis major structure and function

**Include** a record that reports **primary observation or primary measurement**
bearing on any of:

- attachments, fibre or fascicle arrangement, architectural parameters, portion
  boundaries, or innervation of the pectoralis major (Q1a);
- the contribution of the pectoralis major, or of a named portion, to a
  glenohumeral action, by any of the five directness levels in the questions file
  §4.4 (Q1b);
- how that contribution varies with humeral elevation angle or plane of elevation
  (Q1c).

**Population:** adult humans (≥18 y), any sex; cadaveric adult specimens are
eligible for Q1a and Q1b. Age not reported → include and record "age not
reported" as a limitation; do not infer it.

**Exclude** per the questions file §4.5, using the codes in §5.

**Portion-resolution rule.** A record that reports only whole "pectoralis major"
without portion resolution is **eligible for Q1a and Q1b** and **ineligible for
Q1c**, since Q1c is defined at portion level. A record that says only
"pectoralis" without distinguishing major from minor is excluded (code `E-POP-3`)
**unless** the method makes the distinction recoverable — for example, an
electrode site or a dissection description that identifies the structure
unambiguously. Record which it was.

### 2.2 Q2 — Exercise X versus Exercise Y

**Include** a record that satisfies all four:

1. **Population** — healthy adults 18–45 y (46–65 y is an eligible, separately
   labelled subgroup), free of upper-limb, shoulder, or thoracic injury or
   surgery, per questions file §5.2.
2. **Exposure** — at least one condition is Exercise X (§3.1) or Exercise Y
   (§3.2) as defined, or a pre-specified **related condition** (§2.3).
3. **Comparison** — a between- or within-condition contrast exists that bears on
   X versus Y, including contrasts against a secondary admissible comparator
   listed in questions file §5.2 C.
4. **Outcome** — at least one tier 1–4 outcome, or a tier-H harms outcome, from
   the hierarchy in questions file §5.3.

**Tier-5-only rule.** A study whose only outcome is tier 5 (acute swelling, pump,
soreness, lactate, hormones, RPE) is **excluded from Q2** with code `E-OUT-5`.
This is a direct application of §2.2. It is excluded from the _efficacy_ question
only: if it also reports harms or dropout, it is retained in the harms set.

**Single-arm rule.** A single-arm study of X or Y alone, with no comparator, is
**not eligible for the primary Q2 synthesis** (code `E-DES-4`) but **is retained
in the contradiction set** when it reports a null or adverse result, because a
single-arm null is exactly the kind of evidence a comparative review tends to
lose.

### 2.3 Index, related, and distinct conditions

Three labels, applied at stage 4 and carried into extraction:

| Label        | Meaning                                                                                                                                                                                                                                                                                                                                            | Effect                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Index**    | Meets every defining attribute of X (§3.1) or Y (§3.2)                                                                                                                                                                                                                                                                                             | Eligible for the primary synthesis                                                                                                              |
| **Related**  | Named as a pre-specified related condition in questions file §3.1, §3.2 and Decision D2 — pec deck or machine fly, dumbbell fly, bench-lying cable fly, high-to-low or low-to-high crossover, single-arm cable fly, banded fly, Smith-machine or machine or dumbbell flat press, incline or decline press, floor press, partial-ROM press, push-up | **Extracted, not pooled** with the index condition by default. Any pooling is an explicit, justified, recorded synthesis decision (Decision D2) |
| **Distinct** | Neither of the above; an upper-body exercise outside the slice                                                                                                                                                                                                                                                                                     | Excluded with code `E-EXP-1` unless it functions as contradiction or boundary evidence, in which case it is retained and labelled indirect      |

**Judging a condition when the description is thin.** Apply in order:

1. If a **defining attribute is reported and violated** → not index. Example: a
   bench inclination of 30° → related (incline press), not index X.
2. If a **defining attribute is not reported** → judge by the attributes that
   _are_ reported and record the missing one as a limitation. A study describing
   "flat barbell bench press to the chest" with no grip width is still index X
   with "grip width not reported".
3. If **two or more defining attributes are unreported and the condition cannot
   be distinguished from a related condition** → classify as related, not index,
   and record the ambiguity. Uncertainty resolves _away_ from the index set, so
   the primary synthesis never silently absorbs an unverifiable condition.
4. If a figure, video, or supplementary file resolves the ambiguity, use it and
   record the locator.

---

## 3. Study-design eligibility

Design eligibility is set **per question and per outcome tier**, not globally. A
design adequate for a mechanics claim can be useless for a hypertrophy claim, and
a single global list would hide that.

### 3.1 Q1 design eligibility

| Design                                                      | Q1a                      | Q1b                      | Q1c                      | Note                                                                                                    |
| ----------------------------------------------------------- | ------------------------ | ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Cadaveric dissection / anatomical morphometry               | Eligible                 | Eligible                 | Indirect                 | Record specimen number, age, sex, embalming, and how portions were delimited                            |
| In vivo imaging morphology (MRI, CT, ultrasound, DTI)       | Eligible                 | Eligible                 | Eligible                 | Record sequence, plane, and landmarking                                                                 |
| Measured moment-arm study (tendon excursion, imaging-based) | Partly                   | Eligible                 | Eligible                 | The most direct mechanical evidence available for Q1b and Q1c                                           |
| Intramuscular / fine-wire EMG                               | Not eligible             | Eligible                 | Eligible                 | Activation, not torque contribution — mandatory qualifier                                               |
| Surface EMG                                                 | Not eligible             | Eligible                 | Eligible                 | Mandatory crosstalk qualifier; portion sampling must be stated                                          |
| Musculoskeletal model with inherited geometry               | Not eligible             | Indirect                 | Indirect                 | Assumptions must be stated or the record is excluded (`E-MET-2`)                                        |
| Anatomy textbook or atlas                                   | Eligible with limits     | Eligible with limits     | Not eligible             | Edition and page locator required; §9.9 ingestion terms must permit use                                 |
| Ontology or terminology record (MeSH, UBERON, FMA, TA)      | Naming only              | Not eligible             | Not eligible             | Anchors identity, never function                                                                        |
| Clinical case report or surgical series                     | Boundary only            | Boundary only            | Not eligible             | Retained as indirect boundary evidence (for example, function after tear or transfer), never as primary |
| Narrative review                                            | Not eligible as a source | Not eligible as a source | Not eligible as a source | Used only to find primary studies; excluded as `E-DES-5` if cited for a fact                            |

### 3.2 Q2 design eligibility by outcome tier

| Tier                           | Eligible designs                                                                                                                                                                                                                          | Explicitly not eligible for that tier                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **1 — hypertrophy**            | Randomised parallel-group trial; randomised within-participant (contralateral-limb) trial, subject to §3.4; non-randomised controlled trial with allocation method reported; prospective controlled cohort with training exposure defined | Cross-sectional comparisons of trained populations; single-session studies; any acute measurement; modelling; EMG of any kind |
| **2 — task-specific strength** | As tier 1                                                                                                                                                                                                                                 | As tier 1                                                                                                                     |
| **3 — mechanics**              | Within-participant biomechanics study (kinematics, kinetics, moment arms, resistance profile); measured-geometry modelling; instrumented-implement study                                                                                  | Anything without a stated measurement or model                                                                                |
| **4 — EMG proxy**              | Within-participant acute EMG comparison with stated normalisation, electrode placement, and crosstalk handling                                                                                                                            | Studies with no normalisation reference, or no statement of which portion was sampled (`E-MET-1`)                             |
| **5 — context**                | Acute-response designs                                                                                                                                                                                                                    | Never sufficient alone (§2.2); `E-OUT-5` when it is the only outcome                                                          |
| **H — harms**                  | Any design that reports adverse events, pain incidence, injuries, or dropout with reasons, including case reports and case series                                                                                                         | None. Harms are collected from every eligible design, and "not reported" is recorded as a finding                             |

### 3.3 Systematic reviews and meta-analyses

Eligible as **signposts and as contradiction sources**, never as the citation for
a primary datum.

- A synthesis is included when it bears on Q1 or Q2. Its **reference list is mined
  in both directions** (search strategy §7.2).
- A claim is cited to the **primary study**, located and read, not to the review
  that summarised it. A review may be cited for its own pooled estimate, labelled
  as such, with its risk-of-bias and heterogeneity assessment recorded.
- Where two syntheses disagree, both are retained and the disagreement is recorded
  in the contradiction map. Choosing the agreeable one is cherry-picking (§6.1).

### 3.4 Within-participant contralateral-limb designs — the open decision (U3)

This is the single design question most likely to change the tier-1 result, so the
arguments are recorded here in full and the decision is deliberately **not** taken
by this role.

**Context.** In upper-body hypertrophy research, a common design trains one limb
with one exercise and the other limb with another, and compares limbs within the
same person. It is not obscure: for a bilateral barbell press versus a
cable/dumbbell movement, a unilateral protocol is often the only way to equate the
person.

**For admitting them to the primary synthesis.** They remove between-person
variance in diet, sleep, genetics, and adherence, which is the dominant noise
source in a hypertrophy trial; excluding them may remove the best-controlled
evidence that exists and leave the question unanswerable.

**Against.** They require a unilateral variant of X, which by §3.1 and §5.5 is a
**distinct condition**, so the design may not test X at all; cross-education
between limbs can contaminate the contrast; systemic factors act on both limbs and
compress the observable difference; and the contrast is a within-person
difference, which is not the same estimand as the between-group difference
specified in questions file §5.4.

**Pre-specified handling until the decision is taken.** Extract every such study
in full, label the contrast `within-participant`, and **do not pool it with
between-participant contrasts**. Report it as a pre-specified sensitivity analysis
with its own estimate. If the reviewer or owner later admits these designs to the
primary synthesis, the pooling is done once, explicitly, with the decision and its
date recorded.

**Who decides:** the reviewer or the owner, **before screening begins** — so that
the rule is not chosen after the direction of the result is visible.

---

## 4. Record-level handling

### 4.1 Language

- **No language restriction on eligibility.** A record is not excluded for being
  non-English.
- Every search route is nonetheless written in English terms, so a study with no
  English title or abstract will probably never be retrieved. That is a real
  limitation of the search, recorded as **SA2** in the search strategy, not a
  property of these criteria.
- A non-English record that _is_ retrieved follows this ladder: (1) an official
  English abstract or an authorised English version; (2) machine translation of
  the full text, with the tool and date recorded, used for screening and for
  extraction of numeric data only; (3) if a claim would rest materially on a
  translated passage, record that fact and downgrade applicability, because a
  translated locator is weaker evidence than a read one.
- Non-Latin-script records: transliterate the citation, keep the original
  title verbatim in the source record.
- **Unresolved U5** in the questions file — whether the owner will fund
  translation at all — is a cost decision, not a methods decision. Until it is
  answered, translation is planned for and the plan is marked provisional. If the
  owner declines, the correct record is "non-English records excluded for
  resource reasons" as a stated limitation (`E-ADM-2`), never a silent omission.

### 4.2 Date and publication status

**Date.** No lower date limit (search strategy §8.1). Age is appraised, never
used as an exclusion. §9.4 treats recency as an axis separate from certainty, so
an older anatomical study is not downgraded for age alone, while an older training
study may be downgraded for method or applicability reasons that are stated
individually.

**Publication status** and how each is treated:

| Status                                | Eligible?                                              | Handling                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Peer-reviewed journal article         | Yes                                                    | Standard route                                                                                                                                                                                                                                                                                                              |
| **Preprint**                          | Yes, with a hard limit                                 | Never the sole support for a published claim. Record the server, posting date, and version. Re-check for a peer-reviewed version at every update cycle (§9.11) and supersede the record when one appears. Especially important for the contradiction plan, since null results disproportionately stop at the preprint stage |
| **Conference abstract**               | Yes, as a lead and as publication-bias evidence        | Insufficient detail for extraction in almost every case. Chase it to a full report; if none exists after a reasonable interval, record it as a possible unpublished result in the contradiction map. Never the sole support for a claim                                                                                     |
| **Thesis or dissertation**            | Yes                                                    | Often contains null results that were never submitted to a journal. Record supervision, institution, and whether a peer-reviewed version exists                                                                                                                                                                             |
| **Registry record with results**      | Yes, for harms and for publication-bias reconciliation | ClinicalTrials.gov results sections are a legitimate reported-outcome source; record the NCT ID and the results-posting date                                                                                                                                                                                                |
| **Registry record without results**   | Not a source                                           | Recorded in the contradiction map as a suspected unpublished result when completion is >24 months past (search strategy §7.2)                                                                                                                                                                                               |
| **Retracted**                         | See §4.4                                               |                                                                                                                                                                                                                                                                                                                             |
| **Expression of concern / corrected** | See §4.4                                               |                                                                                                                                                                                                                                                                                                                             |

**Schema observation, for the reviewer, not an action for this role.**
`sourceSchema.type` in `src/lib/content/schemas.ts` has no `preprint` value and
`sourceSchema.publication.status` has no `preprint` value; the status enum is
`current`, `corrected`, `expression-of-concern`, `retracted`, `superseded`. A
preprint would therefore have to be typed by its design with status `current`,
which does not record that it is unrefereed. I am not permitted to modify schemas
and have not done so; recorded here as **SE-U1** so the reviewer can route it to
Codex if it matters.

### 4.3 Multi-report linkage

Several reports from one dataset are a **linkage** problem, not a duplication
problem: dropping the extra reports loses data, and counting them separately
double-counts participants.

**Procedure.**

1. Group reports into a **study**, identified by the trial registration ID where
   one exists, otherwise by the combination of registration, sample size and
   composition, recruitment window, site, intervention protocol, and author
   overlap.
2. Nominate one **primary report** per study per outcome tier — normally the one
   reporting the pre-specified primary outcome at the primary timepoint.
3. Extract from **all** reports in the group, attributing each datum to the report
   it came from, with its own locator. Companion papers, secondary analyses,
   protocols, registry entries, and supplementary files frequently carry the
   harms, the dropout reasons, and the pre-specified outcome list.
4. **Count the study once** in every synthesis and in every flow count.
5. Where reports disagree — different n, different means, a primary outcome that
   changed between protocol and publication — record the discrepancy explicitly.
   A changed primary outcome is selective-reporting evidence and belongs in the
   contradiction map.
6. Suspected but unconfirmed overlap (same author group, same period, no
   registration) is recorded as **suspected overlap**, kept in a sensitivity
   analysis, and never merged silently.

### 4.4 Retractions, corrections, and expressions of concern

Implements §9.7. Every included source carries `publicationStatus`,
`statusMethod`, `statusSource`, `statusCheckedAt`, and `nextStatusCheckAt`.

| Finding                                                                 | Effect on eligibility                       | Required action                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retracted**                                                           | Blocked from supporting a live claim (§9.7) | Retained in the record set and read. Recorded in the contradiction map with the retraction notice's locator and its stated reason. Any synthesis that would have relied on it says so explicitly. If it is already supporting live content, §9.7's emergency response applies |
| **Expression of concern**                                               | Not automatically excluded                  | Routed to manual re-evaluation before publication (§9.7). Any claim it supports carries the concern as a stated qualifier                                                                                                                                                     |
| **Material correction / erratum**                                       | Eligible                                    | Extract from the **corrected** values; record both the original and the correction, and which was used                                                                                                                                                                        |
| **Superseded** (newer edition, newer guideline, newer ontology release) | Eligible, versioned                         | Record the version actually consulted and check whether the superseding version changes the datum                                                                                                                                                                             |

**When status is checked.** (a) At acquisition, for every record entering stage 2;
(b) before any synthesis is written; (c) monthly thereafter for the whole catalogue
(§9.11), via search S6 and Crossref route X1.

**Non-DOI sources** follow the §9.7 source-type table for maximum age at
publication: PMID/PMCID without DOI 30 days; book or textbook 12 months; anatomy
ontology or dataset 12 months; guideline or position statement 90 days;
institutional web reference 6 months; other 6 months. An overdue check blocks new
publication.

**Outage rule.** The Crossref Retraction Watch labs endpoint returned HTTP 502 and
then 504 on 2026-09-11 (search strategy §2 row 17, §6.5). §9.7 governs: a
transient outage **fails the check** without labelling any source invalid, new
publication stays blocked until a check succeeds, and live content enters the
incident queue. The verified fallbacks are Crossref `update-type:retraction`, the
per-DOI `update-to` and `updated-by` fields, and PubMed S6.

### 4.5 Inaccessible full text

Maps to `sourceSchema.access.level`: `full-text-open`, `full-text-limited`,
`abstract-only`, `metadata-only`.

**Acquisition ladder, in order, recording what was tried and what it returned:**

1. Publisher open access, or the licensed copy the owner can lawfully obtain.
2. PubMed Central, including author manuscripts.
3. An institutional or funder repository version, with the version recorded
   (accepted manuscript versus version of record — page and table numbers differ,
   and a locator must match the version cited).
4. The preprint version, recorded as a preprint (§4.2).
5. An author request, with the date recorded.

**No unlawful acquisition, at any point.** Not shadow libraries, not circumvented
paywalls, not scraping where an official route exists (§9.6, §2.2). If the ladder
ends without the text, the ladder ends.

**Disposition when the full text cannot be obtained:**

| Situation                                                                      | Disposition                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abstract clearly shows the record is ineligible                                | Exclude at stage 1 with the substantive reason code, not an access code                                                                                                                                                                                                      |
| Abstract shows it is **eligible or possibly eligible**, full text unobtainable | **`awaiting-full-text`.** Record it in the log with `access.level: abstract-only`, the ladder steps tried, and the date. It is **not** an exclusion and **not** an inclusion                                                                                                 |
| Numeric data appear in the abstract                                            | May be used **only** for a tier-3 or tier-4 claim with applicability downgraded and the abstract-only basis stated. **Never** for a tier-1 hypertrophy claim, which requires the methods (measurement site, timing, reliability, equating) that an abstract does not contain |
| Full text obtained after synthesis begins                                      | Re-screen it and record the late arrival; do not quietly leave it out because the synthesis is written                                                                                                                                                                       |

**Why `awaiting-full-text` is its own state.** An inaccessible eligible study is
an unresolved gap in the evidence base, and collapsing it into "excluded" makes
the review look more complete than it is. The count of `awaiting-full-text`
records is reported alongside the inclusion count, and a large count is itself a
reason to lower certainty.

**Where the state lives.** In the screening log it is its own state. In the
evidence packet it has no home at all, because `evidencePacketSchema` offers only
`includedSourceIds` and `exclusions[]`. §6.4 sets out the full mapping and the
unresolved item it produces (**SE-U2**); the short version is that an
`awaiting-full-text` record is written into neither packet array, and its count is
carried in prose instead.

---

## 5. Exclusion reason codes

Exactly one **primary** code per excluded record, and that rule covers duplicates
as well: a duplicate is recorded in `exclusions[]` under `E-REC-1` and under
nothing else, never under a second substantive code. §6.4 gives the full mapping
from the four rule-3 states onto the packet and states plainly where the
arithmetic does and does not close; R1 finding M-2 was right that the earlier
draft left this to the screener to guess.

Codes are stable strings so a later run can be compared with this one. The code
plus its plain-language text is what goes into
`evidencePacketSchema.exclusions[].reason`. There are **28** codes across the
five families below, and the numbering has one deliberate gap, explained at §5.3.

### 5.1 Population

| Code      | Reason                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `E-POP-1` | Non-human                                                                                                                                                                 |
| `E-POP-2` | Paediatric or adolescent population (<18 y), not separable                                                                                                                |
| `E-POP-3` | "Pectoralis" not resolvable to pectoralis major where the distinction matters                                                                                             |
| `E-POP-4` | Clinical, post-operative, or rehabilitation population (Q2), and not used as boundary evidence                                                                            |
| `E-POP-5` | Pectoral agenesis, tear, transfer, reconstruction, thoracic or breast surgery affecting the pectoral bed, or pectoral-nerve impairment, and not used as boundary evidence |
| `E-POP-6` | Older adults outside the eligible bands and not separable                                                                                                                 |

### 5.2 Exposure and comparator

| Code      | Reason                                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `E-EXP-1` | Exercise is neither an index nor a pre-specified related condition                                                                            |
| `E-EXP-2` | Pectoral exposure cannot be attributed to X or Y because many pectoral exercises were mixed without separation                                |
| `E-EXP-3` | Exercise contrast is not the manipulated variable (supplement, drug, or other ergogenic trial)                                                |
| `E-EXP-4` | Competitive bench-press training where sport-specific skill practice cannot be separated, and the pectoral outcome is not reported separately |
| `E-EXP-5` | Protocol delivered as rehabilitation of a diagnosed shoulder pathology                                                                        |
| `E-EXP-6` | Exercise description too incomplete to classify even as a related condition                                                                   |

### 5.3 Outcome

| Code      | Reason                                                                  |
| --------- | ----------------------------------------------------------------------- |
| `E-OUT-1` | No outcome in tiers 1–4 and no harms outcome                            |
| `E-OUT-2` | Outcome is not pectoralis-specific and cannot be resolved to the muscle |
| `E-OUT-5` | Tier-5 outcomes only (§2.2)                                             |

**`E-OUT-3` and `E-OUT-4` are reserved and will never be issued.** After
`E-OUT-2`, an outcome code is numbered for the outcome tier it excludes on, and
tiers 3 and 4 are eligible: `E-OUT-1` excludes a record only when it carries no
outcome in tiers 1–4 and no harms outcome, and `E-OUT-5` covers the one tier that
is context-only. There is therefore no tier-3 or tier-4 exclusion to name, and the
two numbers stay unused rather than being reassigned to something else. This is
stated because R1 finding M-1 was right that the gap was unexplained; under EA3 a
silent gap invites a later screener to reuse `E-OUT-3` for an unrelated reason and
make two runs incomparable.

### 5.4 Design and method

| Code      | Reason                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------- |
| `E-DES-1` | Design ineligible for the tier claimed (§3.1, §3.2)                                                                         |
| `E-DES-2` | Training exposure shorter than 6 weeks for a tier-1 outcome                                                                 |
| `E-DES-3` | Cross-sectional comparison of populations offered as evidence of a training effect                                          |
| `E-DES-4` | Single-arm, no comparator (Q2 primary synthesis only; retained in the contradiction set when the result is null or adverse) |
| `E-DES-5` | Narrative review, editorial, opinion, or textbook passage cited for a primary datum with no traceable primary source        |
| `E-MET-1` | Measurement method not reported to the minimum stated in the tier's requirements                                            |
| `E-MET-2` | Model output with assumptions not stated                                                                                    |

### 5.5 Record and administrative

| Code      | Reason                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `E-REC-1` | Duplicate record of an already-included report (deduplication, not an exclusion of a study)                                                                                    |
| `E-REC-2` | Secondary report of an included study, linked under §4.3 rather than counted separately                                                                                        |
| `E-REC-3` | Source terms prohibit AI ingestion (§9.9; OpenStax _Anatomy & Physiology 2e_ is the named case)                                                                                |
| `E-REC-4` | Retracted, for the purpose of supporting a live claim (§9.7). Still read and recorded in the contradiction map                                                                 |
| `E-ADM-1` | Full text unobtainable **and** abstract insufficient — use only when the record is also ineligible on substance; otherwise use `awaiting-full-text`, which is not an exclusion |
| `E-ADM-2` | Excluded for stated resource reasons, for example an owner decision not to fund translation. Requires the decision, its date, and its author                                   |

**No code for "not useful", "off-topic" in general, or "low quality".** Quality is
appraised, not screened; a weak study that meets the criteria is included and
appraised, and its weakness drives certainty, not eligibility. A screener who
wants to exclude something and cannot find a code has found either a missing code
(add it by amendment, §6.2) or a preference (not a criterion).

---

## 6. Anti-cherry-picking discipline

§2.2 forbids hiding null results, contradictory findings, limitations, and
post-publication corrections. Screening is where that hiding is easiest and
hardest to detect, so the controls are procedural rather than aspirational.

### 6.1 Standing rules

| #   | Rule                                                                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Criteria precede results.** This file is committed at SBLA-008, before any search is run. Its commit is the proof of ordering                                                                                                                                                                             |
| 2   | **Screen contradiction-search results under the same rules.** S4's yield goes through the same stages, the same codes, and the same log. A separate, laxer or stricter standard for inconvenient evidence is the failure mode this rule exists to prevent                                                   |
| 3   | **Exclusion counts reconcile.** Every retrieved record ends in exactly one state: duplicate, excluded with a code, `awaiting-full-text`, or included. The arithmetic must close                                                                                                                             |
| 4   | **Direction-blind decisions where feasible.** At stage 1, decide from population, exposure, comparator, and outcome type — not from the result. Where the abstract states the result, the screener records that the decision was made with the direction visible                                            |
| 5   | **Symmetry test before synthesis closes.** For each exclusion code used more than a handful of times, ask whether it was applied evenly to records favouring X, favouring Y, and reporting no difference. An asymmetry that cannot be explained by the criteria is a defect to fix, not a pattern to report |
| 6   | **Null results are reported, always.** A study meeting the criteria and finding nothing is included and reported with the same prominence as one finding something                                                                                                                                          |
| 7   | **Absence of evidence is reported as absence**, never as evidence of no difference (Rule H2; §2.2)                                                                                                                                                                                                          |
| 8   | **"We found nothing" is a valid deliverable.** If the evidence does not support a claim, SBLA-009 records that (questions file §8 item 5). No claim is manufactured to fill a page                                                                                                                          |
| 9   | **Unclear beats convenient.** Any record whose eligibility is genuinely uncertain after full text goes to the second screener (§7), never to the screener's own preference                                                                                                                                  |
| 10  | **Related conditions are not quietly promoted.** If the index-condition evidence is empty, the remedy is the U2 escalation in the questions file, not a synthesis that pools related conditions and calls them X and Y                                                                                      |

### 6.2 Amendment procedure

Criteria may need to change — an unanticipated design, a term that means something
different in practice. Changing them is allowed; changing them invisibly is not.

An amendment records: the date; the exact rule before and after; the reason; who
decided; and **whether any results had been seen at the time**. Amendments made
after results are visible are flagged as such, are treated as post-hoc, and cannot
raise certainty. The pre-amendment version stays in git history, which is why this
file is committed before screening rather than written alongside it.

### 6.3 What the screening log must contain

So that SBLA-009's log is auditable and reconcilable:

| Field                 | Note                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Record ID             | DOI, PMID, PMCID, or registry ID; internal ID if none                                          |
| Route                 | Which search (S1–S6, E1, C1, T1, O1, X1, P1, R1) retrieved it, all of them, not just the first |
| Dedup key             | Which key merged it, if merged (search strategy §8.2)                                          |
| Stage-1 decision      | Include / Exclude + code / Unclear                                                             |
| Acquisition           | Ladder steps tried, dates, resulting `access.level`                                            |
| Stage-3 decision      | Include / Exclude + code / Related / Contradiction-set                                         |
| Question              | Q1a, Q1b, Q1c, Q2, or several                                                                  |
| Outcome tiers present | 1–5, H                                                                                         |
| Condition label       | Index X, index Y, related (named), distinct                                                    |
| Contrast type         | Between-participant or within-participant (§3.4)                                               |
| Study group ID        | For multi-report linkage (§4.3)                                                                |
| Publication status    | With `statusCheckedAt` and `statusSource` (§4.4)                                               |
| Screener and date     | Both screeners where double-screened                                                           |
| Disagreement          | Whether there was one, and how it resolved (§7)                                                |

### 6.4 How the four states map onto the evidence packet

Rule 3 requires every retrieved record to end in exactly one of four states —
duplicate, excluded with a code, `awaiting-full-text`, or included — and
requires the arithmetic to close. `evidencePacketSchema` in
`src/lib/content/schemas.ts` offers two per-record arrays: `includedSourceIds`,
and a `.strict()` `exclusions[]` of `{sourceId, reason}`. Four states, two
buckets, and no field for a retrieved total. R1 findings I-2 and M-2 are both
about that mismatch, and the plan did not previously say how it resolves. It
says so now.

| Plan state           | Where it goes in the packet                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Included             | `includedSourceIds`                                                                                   |
| Excluded with a code | `exclusions[]`, `reason` = the code plus its plain-language text (§5)                                 |
| Duplicate            | `exclusions[]`, `reason` = `E-REC-1` plus its text — **yes, duplicates go in `exclusions[]`**         |
| `awaiting-full-text` | **Neither array.** Reported by count in `synthesis`; the per-record detail stays in the screening log |

**Duplicates are recorded in `exclusions[]` (M-2).** This is a decision, not a
reading of the schema, and it is made this way for one reason: `exclusions[]` is
the only per-record structure the packet has, so a duplicate left out of it
disappears from the packet entirely and the retrieved-versus-accounted arithmetic
stops closing. `E-REC-1` already says in its own text that it is "deduplication,
not an exclusion of a study", so the true state stays recoverable from the packet
by reading the reason string. A screener must therefore read "exactly one
**primary** code per excluded record" (§5) as covering duplicates too, and must
not also record the duplicate under a substantive code.

**`awaiting-full-text` is recorded in neither array, and that is the gap (I-2).**
Writing it to `exclusions[]` would contradict §4.5, which states the record is
"**not** an exclusion and **not** an inclusion", and would make the review look
more complete than it is — the exact failure §4.5 exists to prevent. Writing it to
`includedSourceIds` would assert an inclusion that was never made. So the packet
can carry the count only in prose. The consequence is stated rather than smoothed
over: the rule 3 arithmetic closes in the **screening log**, which is the
executor's own artifact (§6.3); it does **not** close inside the packet, and it is
not machine-checkable there. `synthesis` and `decisionLog[].decision` are free
text and can narrate the four numbers, but a narrated number is not a validated
one.

**This is not repairable by this role.** Schemas are outside the Claude Research
write boundary (CLAUDE.md). It is recorded as **SE-U2** in §8 and routed to Codex,
with the two paths the owner must choose between stated there. The same gap on the
search-record side is **SU8** in the search strategy §10.

---

## 7. Conflict resolution

### 7.1 Within the research role

SBLA-009 may be executed by a single session. A single screener has no
disagreement to resolve, which is a weakness, not a convenience, and the plan
compensates:

- **Double-screen a sample.** Re-screen at least 20% of stage-1 records, and
  **100% of stage-3 records**, in a separate pass on a separate day, blind to the
  first pass's decision where the tooling allows. Record the agreement rate. A low
  rate means the criteria are ambiguous and must be sharpened by amendment before
  screening continues.
- **Self-disagreement is recorded**, not silently overwritten. The second pass's
  decision stands; both are logged.
- **Unresolved after two passes** → `unclear-escalated`, carried into the packet
  as an open item for the reviewer. It is not resolved by the screener's
  preference.

### 7.2 Between roles

| Situation                                                             | Resolution                                                                                                                                                                                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Review disputes an inclusion or exclusion                      | The reviewer does **not** repair the artifact (CLAUDE.md). The finding returns to this role, which re-screens the record, records the outcome and its reason, and the reviewer rechecks the complete artifact |
| Reviewer and research role still disagree after one remediation round | Escalate to the owner with both positions stated in one place, each with its criterion reference. The owner's decision is recorded with its date                                                              |
| A criterion itself is disputed, not its application                   | Amend under §6.2, with the dispute recorded as the reason                                                                                                                                                     |
| A scope question is disputed (U1–U5, SE-U1)                           | Owner decides; the amendment is recorded in the scope files, not applied informally at screening time                                                                                                         |

**The independence rule holds throughout.** Claude Review works in a separate
account and session and does not receive this role's reasoning beyond the
committed artifacts (§9.10). This file is written to be sufficient on its own for
that reason.

---

## 8. Assumptions and unresolved items in this file

| ID    | Type       | Statement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Who resolves it                                                                      |
| ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| EA1   | Assumption | The four-way outcome of every record (duplicate / excluded / `awaiting-full-text` / included) is exhaustive. If SBLA-009 finds a record that fits none, that is a defect in this plan and an amendment is required                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | SBLA-009 executor, by amendment                                                      |
| EA2   | Assumption | 20% stage-1 and 100% stage-3 double-screening is a proportionate substitute for two independent screeners. It is weaker than two screeners and is recorded as a limitation, not presented as equivalent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Reviewer                                                                             |
| EA3   | Assumption | Reason codes are stable identifiers. New codes are added by amendment; existing codes are never redefined, since redefinition would make two runs incomparable                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | SBLA-009 executor                                                                    |
| EA4   | Assumption | The ≥6-week minimum for tier 1 is a defensible floor for detecting training-induced size change with the stated methods. It is a **project convention set here**, not a finding extracted from a source, and the reviewer may set it elsewhere                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Reviewer                                                                             |
| EU1   | Unresolved | **U3** — whether within-participant contralateral-limb designs enter the primary tier-1 synthesis (§3.4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Reviewer or owner, **before screening**                                              |
| EU2   | Unresolved | **U2** — whether Exercise Y may be widened if index-Y evidence is empty. §2.3 and rule 10 in §6.1 both depend on the answer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Reviewer, **before searching**                                                       |
| EU3   | Unresolved | **U4** — whether regional (clavicular versus sternocostal) hypertrophy is part of the primary tier-1 estimand or a separate secondary question                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Reviewer                                                                             |
| EU4   | Unresolved | **U5** — whether non-English full texts will be translated (§4.1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Owner, on cost grounds                                                               |
| SE-U1 | Unresolved | `sourceSchema` has no representation for "preprint" as a type or a publication status (§4.2). Not actionable by this role — schemas are outside its write boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Reviewer, to route to Codex if it matters                                            |
| SE-U2 | Unresolved | `evidencePacketSchema` cannot represent the four-way outcome that rule 3 and EA1 make load-bearing. The `.strict()` `searches[]` object holds only `database`, `query`, `searchedAt`, `resultCount`, and the only per-record arrays are `includedSourceIds` and `exclusions[]`, so `awaiting-full-text` has no home, there is no retrieved total, and the PRISMA-style arithmetic is narratable but not validatable (§6.4). The search-record half of the same gap is **SU8** in the search strategy §10. **Two paths, and the owner picks one:** (a) extend `evidencePacketSchema` to carry a retrieved count, an `awaitingFullText` array, and the per-search fields §9.8 step 2 requires — a Codex task, and a schema change to an artifact accepted at SBLA-007; or (b) amend this plan and the search strategy so the recorded states map onto what the schema already accepts, accepting that the flow arithmetic is then only narrated. Not actionable by this role — schemas are outside its write boundary | **Codex**, on an owner decision between (a) and (b), before SBLA-009 writes a packet |
