# Research companion integrity gate

`pnpm validate:research` is the deterministic, read-only gate for the four JSON
artifacts that carry an evidence task from search through its evidence packet.
It checks bookkeeping integrity; it does not decide whether a study is true,
whether a claim is entailed, or whether anything may be published.

## Bundle discovery

The command groups files by the case-insensitive task stem in these exact
locations:

| Component  | Path contract                                         |
| ---------- | ----------------------------------------------------- |
| Search     | `research/searches/<task>-search-receipts.json`       |
| Screening  | `research/screening/<task>-screening-flow.json`       |
| Extraction | `research/extractions/<task>-source-extractions.json` |
| Packet     | `research/packets/<task>-evidence-packet.json`        |

A repository whose four companion directories exist but contain no matching
component files is a truthful empty state and passes with
`0 complete bundles checked`. A selected root that contains none of those
directories fails with `ROOT_INVALID`, which prevents a typo or stale path from
reporting PASS. Once any component exists, all four must exist: the command
fails a partial bundle rather than silently skipping it. To require one task
even when none of its files exists, run:

```text
pnpm validate:research --bundle SBLA-009
```

Tests and trusted external checks may select a repository root with `--root`.
The default is the current working directory.

## Structured contracts added by this gate

### Retrieval-event default

Every screening record may carry a nonnegative integer `retrievalEvents`. If
any record omits it, the screening artifact must state the default as a number,
not prose:

```json
{
  "fieldContract": {
    "retrievalEventsDefault": 1
  }
}
```

The gate derives `recordsRetrieved` and `duplicateRetrievalEvents` using the
explicit record value first and this default second. Without a usable default,
those totals cannot be derived and the bundle fails.

### Acquisition attempts

Every `awaiting-full-text` record and every included `abstract-only` or
`metadata-only` record must have at least one acquisition attempt. Each attempt
uses this shape:

```json
{
  "step": "institutional-repository",
  "attemptedAt": "2026-09-13",
  "result": "HTTP 200; accepted manuscript obtained"
}
```

`step` and `result` must be nonempty, and `attemptedAt` must be a real ISO 8601
date or timestamp. The R1 artifacts used opaque strings such as
`"europepmc-fulltextxml:200"`; remediation must migrate those strings instead
of grandfathering them, because a response without its attempt date cannot
establish when acquisition occurred.

### Closed access and fact-basis vocabularies

Screening and extraction access levels use exactly `full-text-open`,
`full-text-limited`, `abstract-only`, or `metadata-only`. Every included
extraction must fall into exactly one of those four categories.

Every extraction carries an explicit `reportedFacts` array; `[]` is the honest
empty state. Each fact's `basis` is a comma-delimited combination of
`abstract`, `abstract-only`, `full-text`, `metadata`, and
`machine-translated`. Unknown spelling variants fail instead of silently
disabling the access check.

## What is derived

The validator recomputes the following from the records rather than trusting
their summaries:

- unique, excluded, awaiting-full-text, included, retrieval-event, duplicate,
  and per-exclusion-code screening totals;
- both frozen reconciliation equations;
- the sum of search-receipt `recordsRetrievedIntoScreening` values versus the
  screening `recordsRetrieved` total;
- every packet search versus exactly one search receipt by receipt identity,
  submitted query, execution date, and result count;
- included screening IDs versus extraction `recordId` values;
- awaiting-full-text screening IDs versus the extraction register;
- extraction `proposedSourceId` values versus packet `includedSourceIds`;
- extraction counts for included sources, full-text, abstract-only,
  non-English, preprint, corrected, plus optional metadata-only and
  awaiting-full-text counts;
- complete access-level coverage of every included extraction;
- screening versus extraction access level for every included record; and
- whether a reported fact marked `full-text` comes from an access level that
  actually permits a full-text basis.

Receipt, record, extraction, proposed-source, awaiting-register, and packet
source IDs must be present and unique. Recognized execution/status dates must
be real calendar dates. Count fields must be nonnegative safe integers. Every
extraction must record a nonempty language code.

## Stable issue codes

Every issue identifies an artifact and an exact JSON path. Output is sorted by
artifact, path, code, and message, independent of object insertion order.

| Code                                   | Meaning and repair                                                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ID_INVALID`                           | A contracted ID is empty or not a string. Assign a stable ID and update references.                                        |
| `ID_DUPLICATE`                         | An ID repeats within its namespace. Give the later record a unique ID and update references.                               |
| `DATE_INVALID`                         | An execution, generation, packet, or publication-status date is not a real ISO date/timestamp. Record the actual date.     |
| `COUNT_INVALID`                        | A count is not a nonnegative safe integer. Replace it with the measured integer.                                           |
| `SEARCH_QUERY_REQUIRED`                | A receipt omits its exact nonempty submitted query. Record the query actually sent to the database.                        |
| `SEARCH_SCREENING_TOTAL_MISMATCH`      | Search receipts and screening disagree on records retrieved. Reconcile receipt imports to retrieval events.                |
| `TERMINAL_STATE_INVALID`               | A screening record lacks one scalar allowed terminal state. Record exactly one of the four states.                         |
| `SCREENING_TOTAL_MISMATCH`             | A declared screening or exclusion-code total differs from raw records. Recompute it.                                       |
| `RECONCILIATION_EQUATION_ONE_MISMATCH` | `unique = excluded + awaiting-full-text + included` does not close or is not marked true.                                  |
| `RECONCILIATION_EQUATION_TWO_MISMATCH` | `retrieved = duplicate retrieval events + unique` does not close or is not marked true.                                    |
| `RETRIEVAL_EVENTS_DEFAULT_MISSING`     | Records omit `retrievalEvents` without a structured numeric default. Add the default or explicit values.                   |
| `ACQUISITION_LADDER_REQUIRED`          | An awaiting or included lower-access record has no acquisition attempt. Run and record the lawful ladder.                  |
| `ACQUISITION_ATTEMPT_STEP_REQUIRED`    | A ladder attempt does not name the route tried. Add a nonempty `step`.                                                     |
| `ACQUISITION_ATTEMPT_DATE_INVALID`     | A ladder attempt lacks a real `attemptedAt`. Migrate it to the structured attempt shape.                                   |
| `ACQUISITION_ATTEMPT_RESULT_REQUIRED`  | A ladder attempt lacks a nonempty result. Record the actual observed response.                                             |
| `INCLUDED_EXTRACTION_IDS_MISMATCH`     | Screening included IDs and extraction record IDs differ. Rebuild the extraction set from screening.                        |
| `AWAITING_IDS_MISMATCH`                | The screening and extraction awaiting-full-text sets differ. Rebuild the register.                                         |
| `PACKET_SOURCE_IDS_MISMATCH`           | Packet source IDs and extraction proposed-source IDs differ. Rebuild the packet list.                                      |
| `EXTRACTION_COUNT_MISMATCH`            | An extraction summary count differs from `extractions[]` or `awaitingFullText`. Recompute all counts together.             |
| `ACCESS_LEVEL_INVALID`                 | A screening or extraction access level is outside the closed vocabulary. Record one allowed level.                         |
| `ACCESS_LEVEL_BREAKDOWN_MISMATCH`      | Allowed access categories do not account for every included extraction. Correct access levels and counts.                  |
| `ACCESS_LEVEL_MISMATCH`                | Screening and extraction record different access levels. Record the same observed level in both.                           |
| `REPORTED_FACTS_REQUIRED`              | An extraction omits its explicit `reportedFacts` array. Add the array, using `[]` only for an honest empty state.          |
| `FACT_BASIS_INVALID`                   | A fact basis contains an unrecognized token or shape. Use only the documented comma-delimited vocabulary.                  |
| `FULL_TEXT_BASIS_EXCEEDS_ACCESS`       | A fact claims full-text basis while the source is abstract- or metadata-only. Obtain/document the text or lower the basis. |
| `LANGUAGE_REQUIRED`                    | An extraction language is null or empty. Record the source language and keep translation details separately.               |
| `PACKET_SEARCH_QUERY_REQUIRED`         | A packet search omits the nonempty query copied from its receipt. Restore the exact receipt query.                         |
| `PACKET_SEARCH_RECEIPTS_MISMATCH`      | Packet searches do not exactly mirror search receipts. Rebuild them from receipt identity, query, date, and count.         |
| `ARGUMENT_INVALID`                     | CLI flags are incomplete or unknown. Use `--root <repository>` and optional `--bundle <task-id>`.                          |
| `ROOT_INVALID`                         | The selected root contains no companion directories. Point the gate at the repository root.                                |
| `BUNDLE_MISSING`                       | An explicitly selected task has no component. Create all four files or correct the task ID.                                |
| `BUNDLE_PARTIAL`                       | At least one but fewer than four companion files exists. Complete the bundle before handoff.                               |
| `JSON_PARSE_FAILED`                    | A component cannot be read as JSON. Repair syntax without changing scientific content.                                     |

## Boundaries and limitations

This gate intentionally does not:

- search literature, obtain full text, or infer whether a recorded result is
  accurate;
- judge citation entailment, risk of bias, certainty, or scientific scope;
- modify a research artifact, claim, review state, or publication state; or
- replace Claude Review's complete citation and adversarial audit.

An internally consistent false statement can pass this mechanical gate. A
scientifically correct artifact can fail when its bookkeeping is incomplete.
Both properties are deliberate: the validator closes structural gaps without
granting Codex scientific authority.
