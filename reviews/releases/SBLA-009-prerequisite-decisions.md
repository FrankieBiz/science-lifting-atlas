# SBLA-009 prerequisite decisions

**Decision date:** 2026-09-13

**Decision authority:** Owner-delegated Codex integration

**Accepted scope base:** `0fde685a33118c7ffcdcaf189e104c37ac2cea66`

**Applies to:** SBLA-009 search execution, screening, extraction, appraisal,
synthesis, and draft claims

## Outcome

SBLA-009 may begin once this artifact and its bounded preprint-schema change are
verified. These decisions resolve the owner and reviewer choices intentionally
left open by SBLA-008. They do not alter the accepted question after results are
seen; they freeze its operational interpretation before SBLA-009 opens or
screens any result behind the disclosed Europe PMC E1 count.

## Frozen scientific scope

### U2 / EU2 — keep the index cable fly narrow

The primary Y condition remains the **bilateral standing cable fly at shoulder
height** defined in SBLA-008. Pec deck, dumbbell fly, bench-lying cable fly,
high-to-low and low-to-high cable paths, and unilateral variants remain named
related conditions.

- Do not silently widen Y or pool a related condition into the primary X-versus-Y
  comparison.
- Retrieve, label, and extract related-condition evidence so absence and
  contradiction are visible.
- If no eligible direct Y evidence survives screening, report that absence. A
  later widening requires a dated scope amendment and a new search; it cannot
  retroactively become the primary result.
- This decision is made with the already disclosed Europe PMC E1 route count of
  334 visible, but without opening or screening any record behind that count.

### A2 — estimand is difference in change

The decision-relevant estimand is the between-condition **difference in change**
for X versus Y. An additive design asking whether adding Y to X adds benefit is a
different question and is outside this slice. SBLA-009 must not mix additive and
substitution contrasts.

### U3 / EU1 — contralateral designs are sensitivity evidence

Within-participant contralateral-limb designs are eligible for retrieval and full
extraction but are not part of the primary synthesis. They form a separately
labelled, pre-specified sensitivity analysis because the unilateral variants,
cross-education risk, shared systemic factors, and paired estimand differ from
the bilateral between-participant index comparison. Never pool the two contrast
types into one estimate.

### U4 / EU3 — regional hypertrophy is secondary

Whole-muscle pectoralis-major hypertrophy is the primary tier-1 outcome. Regional
clavicular-versus-sternocostal hypertrophy is a separate secondary question. It
must be extracted by measurement site and may explain disagreement, but it does
not replace or silently upgrade the primary whole-muscle outcome.

### U5 / EU4 — include non-English records

There is no language exclusion. Apply the ladder already specified in the
eligibility plan: authorized English material first, then documented
machine-assisted translation for screening and numeric extraction. Record the
tool, version when available, date, passages relied on, and uncertainty.
Decision-critical prose requires a second check by an independent translation,
a fluent reader, or an authoritative English version before it can support a
published claim. If full text remains unobtainable, retain the record as
`awaiting-full-text`; do not relabel it as excluded for language.

## Frozen evidence architecture

### SE-U2 / SU8 — strict packet plus validated companions

Keep `evidencePacketSchema` compact and unchanged for SBLA-009. The executor must
produce three versioned artifacts with explicit cross-links:

1. A strict schema-valid evidence packet containing included source IDs,
   substantive exclusions, synthesis, and the decision log.
2. A search-receipt artifact containing, for every attempted route, the database
   and platform/version, exact submitted query, execution timestamp, result
   count, returned query translation when supplied, transport used, and failures
   or access limitations.
3. A screening-flow artifact containing every retrieved record and exactly one
   terminal state: `duplicate`, `excluded`, `awaiting-full-text`, or `included`.

The screening-flow artifact is authoritative for reconciliation:

`unique records after deduplication = excluded + awaiting-full-text + included`

and

`records retrieved = duplicates + unique records after deduplication`.

Duplicates are deduplication events, **not exclusions**. They appear only in the
screening-flow companion with their retained-record link. An
`awaiting-full-text` record is neither included nor excluded and likewise appears
only in the companion until resolved. The packet may summarize these counts but
must not invent packet states or encode either category as a substantive
exclusion. This decision supersedes the provisional mapping in SBLA-008
eligibility-plan §6.4 for SBLA-009 and closes M-9 by using the complete four-state
arithmetic.

Companion artifacts are not an excuse for free-form prose. SBLA-009 must define
their field contract before the first executed search is recorded and validate
all entries before handoff. A later reusable schema is allowed, but search work
does not wait for a generalized product-schema redesign.

### SE-U1 — preserve design and state review stage separately

A preprint is a publication stage, not a study design. `sourceSchema.type`
therefore remains design-oriented. This change adds required
`publication.stage` with four explicit values:

- `peer-reviewed`
- `preprint`
- `other-non-peer-reviewed`
- `not-applicable`

`publication.status` continues to represent current/corrected/retracted lifecycle
state. A randomized trial preprint is consequently recorded as
`type: randomized-trial`, `publication.stage: preprint`, and normally
`publication.status: current`. Preprints remain subject to SBLA-008's hard limit:
they cannot be the sole support for a published claim and must be rechecked for a
peer-reviewed successor.

## Execution instructions carried into SBLA-009

- Start from accepted `main` after this prerequisite commit is integrated.
- Carry the 2026-09-11 Europe PMC E1 count of 334 into the new search receipt;
  label it historical and execute a fresh dated search.
- Re-test the four S2 MeSH descriptors in Europe PMC when reachable (R2 M-7).
- Preserve historical anchor observations while making new receipts authoritative
  (R2 M-8).
- Re-check and narrowly describe Cochrane access from the actual client used; do
  not work around access controls (R2 M-10).
- When the accepted SBLA-008 files are next edited, correct their round-one
  provenance headers (R2 M-6), the declared-item total (R3 M-11), and the dated
  verification summary (R3 M-12). These prose cleanups do not block search.

## Exit gate

Before Claude Research receives SBLA-009, Codex must demonstrate:

- the preprint-stage fixture and missing-stage regression test pass;
- the complete repository verification suite passes;
- the committed diff touches only the five claimed paths; and
- the SBLA-009 research claim names exact artifact paths, branch, worktree, and
  base commit.
