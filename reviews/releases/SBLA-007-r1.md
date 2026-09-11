# SBLA-007 Review R1

**Task:** SBLA-007 — Evidence schemas and validators
**Reviewer role:** Claude Review (Account B), independent acceptance review, round 1
**Reviewer account:** dariel@beyondlimitscarefoundation.org (Claude Code / Opus 5, fresh
independent reviewer session; did not author or remediate this candidate)
**Review date:** 2026-09-11
**Reviewer worktree:** `C:\src\s007r1`
**Reviewer branch:** `claude-review/SBLA-007-r1-new-device`
**Reviewed candidate commit:** `a48981a8c1a8a66b4345251633a841fc4e08df5c` _(immutable)_
**Reviewed candidate tree:** `81de159aa0533b318011ed3eda2ff3dca59da8a5` _(immutable)_
**Accepted dependency base:** `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`
**Coordination claim commit:** `d8e6c34da23a509689d50f09fc97df7b9baafe3e`
**Runtime:** Node.js `v24.20.0`, pnpm `11.24.0` (both confirmed in this session)
**Reviewer write path:** `reviews/releases/SBLA-007-r1.md` (sole permitted path; nothing else
was modified)

**Verdict: FAIL.**
**Unresolved Critical: 0 · Unresolved Important: 3 · Minor (non-blocking, with destinations): 10**

All six mechanical acceptance criteria that this session could execute pass: `pnpm verify`,
`pnpm test:e2e`, and the accepted-base range whitespace check are green on the exact candidate,
the record-discovery and identifier contracts are genuinely fail-closed, the SBLA-006 Minor
follow-ups assigned to this task are closed, and no scientific content, graph output, network
client, or later-task production work entered the candidate.

The candidate nevertheless fails on three substantive defects, each reproduced end-to-end through
the real commands on a disposable copy, each with a passing control that isolates the cause:

1. Millisecond-precision ISO timestamps defeat the history/evidence-packet ordering invariant in
   both directions — it accepts records whose `updatedAt` really precedes `createdAt`, and rejects
   valid records with a false message. This is the exact invariant the handoff's "Exact provenance
   remediation (2026-09-10)" section claims to have established.
2. Published change records — one of the two record families that carry review metadata — never
   undergo review-date currency validation. A published change record with a review date three
   years in the future and a review due date overdue since 2020 passes every gate.
3. A calibration token anywhere in a statement disables the entire categorical-causal gate, so a
   low-certainty claim may assert categorical causation as long as an unrelated clause contains
   "may".

---

## 1. Scope, boundary, and what this review is

This is the single independent Account-B acceptance review for SBLA-007. I did not author or
remediate the candidate and did not repair it. Every finding below is returned to its author.

I wrote exactly one file in this repository: this report. The candidate worktree was verified
clean before and after the review, at the exact candidate commit and tree. All adversarial
mutation work ran in disposable directories outside the repository
(`%TEMP%\sbla007-adv`, since removed), against either a read-only import of the candidate's
modules or a `git archive` export of the candidate tree. The candidate's own files were never
written.

**Severity rubric used.** The repository defines no formal severity table, so this report applies:

- **Critical** — the candidate can publish an unsupported claim or unlicensed media, breaks a role
  write boundary, or makes a required gate structurally unable to fail.
- **Important** — a stated acceptance criterion, design rule, or master-plan gate condition is
  demonstrably unenforced or wrongly enforced on schema-legal input, and the fix is bounded.
- **Minor** — a real defect whose present impact is contained, recoverable by the author, or
  deferred to a named later task. Recorded with impact and destination, per AGENTS.md.

---

## 2. Provenance and environment verification

Every binding in the dispatch packet was independently confirmed before any review work began.

| Check               | Command                                                 | Result                                                         |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| Reviewer branch     | `git rev-parse --abbrev-ref HEAD`                       | `claude-review/SBLA-007-r1-new-device`                         |
| Candidate commit    | `git rev-parse HEAD`                                    | `a48981a8c1a8a66b4345251633a841fc4e08df5c`                     |
| Candidate tree      | `git rev-parse "HEAD^{tree}"`                           | `81de159aa0533b318011ed3eda2ff3dca59da8a5`                     |
| Worktree clean      | `git status --porcelain --untracked-files=all`          | empty, before and after the review                             |
| Dependency ancestry | `git merge-base --is-ancestor bbeddc06... HEAD`         | exit 0 — accepted base is an ancestor                          |
| Exact-path claim    | `git show d8e6c34d... -- docs/runbooks/current-work.md` | one added row; paths owned = `reviews/releases/SBLA-007-r1.md` |
| Node.js             | `node --version`                                        | `v24.20.0`                                                     |
| pnpm                | `pnpm --version`                                        | `11.24.0`                                                      |

The coordination claim commit `d8e6c34d` is **not** an ancestor of the candidate
(`git merge-base --is-ancestor` exit 1), which is correct: the claim lives on the coordination
branch and the reviewed candidate stays immutable.

---

## 3. Required commands — actually run, real results

All four were executed by me in `C:\src\s007r1` on the exact candidate.

**`pnpm install --frozen-lockfile`** — PASS. `Already up to date. Done in 246ms using pnpm v11.24.0`.

**`pnpm verify`** — PASS, exit 0. Real output:

- Prettier `format:check` clean; ESLint clean (`--max-warnings 0`).
- `astro check`: 55 files — 0 errors, 0 warnings, 0 hints.
- `vitest run tests/unit`: **16 files, 222 tests passed**.
- `validate:content`: `Content validation passed: 0 records.`
- `validate:graph`: `Graph validation passed: 0 nodes checked; graph generation remains SBLA-011.`
- `evidence:status`: `Evidence status passed: 0 sources checked as of 2026-09-11; live network acquisition remains a later task.`
- `astro build`: 1 page built, `[build] Complete!`
- `test:portability`: **3 files, 17 tests passed**.
- `verify:foundation`: `Foundation contract passed at C:\src\s007r1\`
- `assets:spike` and `assets:decision`: both pass.

**`pnpm test:e2e`** — PASS, exit 0.
`ok 1 [chromium] › tests\e2e\foundation.spec.ts:5:1 › serves a useful static foundation without
client JavaScript (449ms)` — `1 passed (5.6s)`.

**`git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a...HEAD`** — PASS, exit 0, no output.

These reproduce the handoff's claimed results. The only difference is `evidence:status` reporting
`as of 2026-09-11` rather than `2026-09-10`, which is correct: `SBLA_AS_OF` is unset, so the
command defaults to the current UTC date. That is the documented behavior, not a discrepancy.

This session had no environment limitation that blocked any required check. Every result in this
report is first-party.

---

## 4. Findings

### Important

#### I-1 — Millisecond ISO timestamps break the record-history ordering invariant in both directions

**Where:** `src/lib/content/schemas.ts:97` (`historyMetadataSchema`) and
`src/lib/content/schemas.ts:442` (`evidencePacketSchema`), both reading
`if (updatedAt < createdAt)`. Root cause is `ISO_TIMESTAMP_PATTERN` at
`src/lib/content/schemas.ts:16-17`, which admits an optional `.\d{1,3}` fraction:

```ts
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
```

Both comparisons are lexicographic string comparisons. `'Z'` is U+005A and `'.'` is U+002E, so
`"…T12:00:00Z"` sorts **after** `"…T12:00:00.500Z"` even though it is 500 ms earlier. Within any
single second, a second-precision timestamp always compares as later than a millisecond-precision
one, inverting the invariant.

**Failure scenario — false negative (fails open).** Evidence packet with
`createdAt: "2026-09-01T12:00:00.500Z"` and `updatedAt: "2026-09-01T12:00:00Z"`. `updatedAt`
genuinely precedes `createdAt`. Written to `research/packets/` in a disposable export of the
candidate tree and run through the real command:

```text
$ SBLA_AS_OF=2026-09-11 node scripts/content/validate.mjs
Content validation passed: 4 records.
exit=0
```

**Failure scenario — false positive (rejects valid data with a false message).** The same packet
with the order corrected to `createdAt: "2026-09-01T12:00:00Z"`,
`updatedAt: "2026-09-01T12:00:00.500Z"` — a legitimate 500 ms-later update:

```text
$ SBLA_AS_OF=2026-09-11 node scripts/content/validate.mjs
Content validation failed:
- [SCHEMA_INVALID] research/packets/evidence-packet-ms-forward.json:updatedAt: updatedAt must not
  precede createdAt Remediation: Correct the value at this path to match the evidence-record
  authoring schema.
exit=1
```

The diagnostic asserts something factually untrue about the record, and the only repair the guide
offers is to discard real precision.

**Control.** A second-precision reversal (`createdAt` 2026-01-02, `updatedAt` 2026-01-01) is
correctly rejected, so the check works — it is specifically the fractional-second class that
inverts.

**Why Important.** Acceptance criterion 1 requires "stable normalized identity and lifecycle
invariants", and criterion 2 requires the commands to "fail closed with structured actionable
errors". This invariant fails open on one input class and produces a false error on another. It
also falsifies the handoff's "Exact provenance remediation (2026-09-10)" claim that the candidate
now enforces "monotonic evidence-packet creation/update timestamps": it does not, for the
millisecond timestamps `isoTimestampSchema` itself accepts. The defect reaches `claimSchema` and
`changeRecordSchema` through `commonEntityFields.history`, and `evidencePacketSchema` directly —
three of the five families.

**Remediation.** Compare instants, not strings, in both places. For example, add a shared helper
beside `isRealIsoTimestamp` and use it at `schemas.ts:97` and `schemas.ts:442`:

```ts
const instant = (value: string) => Date.parse(value);
if (instant(updatedAt) < instant(createdAt)) {
  /* addIssue */
}
```

Alternatively, drop the optional fraction from `ISO_TIMESTAMP_PATTERN` so every stored timestamp
is second-precision and the string comparison becomes total. Either fix needs a red test covering
both directions of the fractional-second pair, since the existing fixtures use only
second-precision timestamps and cannot catch this.

---

#### I-2 — Published change records never undergo review-date currency validation

**Where:** `src/lib/content/validation.ts:341` — `validatePublishedReviewDates` is called only
inside `for (const claim of graph.claims)` (invoked at `validation.ts:361`). `RecordGraph`
(`validation.ts:259-263`) has no slot for change records, and `scripts/graph/validate.mjs:24-26`
feeds change records into the graph as bare identifier strings:

```js
const entityIds = loaded.records
  .filter((record) => record.kind === 'changeRecord')
  .map((record) => record.data.id);
```

`changeRecordSchema` (`schemas.ts:525-536`) spreads `commonEntityFields`, so a change record
carries `publicationState`, `review.lastReviewedAt`, and `review.reviewDueAt`, and
`validateCommonLifecycle` requires all three to be non-null when published. Nothing then checks
whether those dates are _coherent_ or _current_. `REVIEW_DATE_IN_FUTURE`, `REVIEW_SCHEDULE_INVALID`,
and `REVIEW_OVERDUE` are unreachable for this family.

**Failure scenario.** Take the repository's own valid change-record fixture, set
`review.lastReviewedAt: "2029-01-01"` (a review dated three years in the future) and
`review.reviewDueAt: "2020-01-01"` (overdue by almost six years), leave
`publicationState: "published"`, and run all three gates in a disposable export:

```text
$ SBLA_AS_OF=2026-09-11 node scripts/content/validate.mjs
Content validation passed: 4 records.            exit=0
$ SBLA_AS_OF=2026-09-11 node scripts/graph/validate.mjs
Graph validation passed: 3 nodes checked; ...    exit=0
$ SBLA_AS_OF=2026-09-11 node scripts/evidence/status.mjs
Evidence status passed: 1 sources checked ...    exit=0
```

The identical mutation applied to a published _claim_ is correctly rejected with
`REVIEW_DATE_IN_FUTURE` and `REVIEW_OVERDUE`, which is what makes this a coverage gap rather than
a policy choice.

**Why Important.** Acceptance criterion 3 requires that "review dates ... are deterministic
against an explicit `asOf` date" for cross-record validation generally, not for claims only. The
design (`docs/superpowers/specs/2026-09-09-sbla-007-evidence-schemas-design.md:25`) states that "a
published record must be approved, owner-approved, **current for review**, and tied to an approval
manifest/checksum" — "current for review" is enforced for one of the two published families.
Master plan §10.8 lists "Review dates are missing or overdue beyond the allowed grace period" as a
build-failure condition without restricting it to claims. Change records are a first-class SBLA-007
family (design line 19) and a registered Astro collection (`src/content.config.ts:21-24`), and
nothing in the handoff defers their review dates to a later task. A future `lastReviewedAt` is a
falsified review record that this project's gates exist to catch.

**Remediation.** Generalize the check. Narrow `validatePublishedReviewDates` to the common shape it
actually uses (`{ id, publicationState, review }`) rather than `ClaimRecord`, add a `changeRecords`
slot to `RecordGraph`, pass the loaded change records from `scripts/graph/validate.mjs` instead of
only their IDs, and run the same three date checks over both families. Add red fixtures for a
published change record that is overdue, future-dated, and reverse-scheduled.

---

#### I-3 — A calibration token anywhere in the statement disables the whole categorical-causal gate

**Where:** `src/lib/content/validation.ts:192-197`:

```ts
function hasUncalibratedCausalLanguage(statement: string) {
  if (LOW_CALIBRATION_PATTERN.test(statement)) return false;
  return [...statement.matchAll(CAUSAL_PATTERN)].some(
    (match) => !isDirectlyNegated(statement, match.index),
  );
}
```

`LOW_CALIBRATION_PATTERN` (`validation.ts:154-155`) is tested against the entire statement. A
single occurrence of `may`, `might`, `suggests`, `limited evidence`, `no evidence`, `is plausible`,
`hypothesis`, or `cannot establish` — anywhere, in any clause, attached to any proposition —
short-circuits `CERTAINTY_OVERSTATED` for every causal verb in the statement.

**Failure scenario.** A published `certainty: "low"` claim, written into a disposable export of the
candidate tree and run through the real graph gate:

```json
"statement": "Resistance training increases pectoralis-major hypertrophy; individual results may vary."
```

```text
$ SBLA_AS_OF=2026-09-11 node scripts/graph/validate.mjs
Graph validation passed: 3 nodes checked; graph generation remains SBLA-011.
exit=0
```

**Control — the only change is deleting the unrelated clause.** Same record, statement shortened to
`"Resistance training increases pectoralis-major hypertrophy."`:

```text
$ SBLA_AS_OF=2026-09-11 node scripts/graph/validate.mjs
Graph validation failed:
- [CERTAINTY_OVERSTATED] claim-may-escape-hatch.statement: Categorical causal wording exceeds the
  recorded certainty. Remediation: Use calibrated wording such as "may" or "suggests," or
  strengthen and re-review the evidence.
exit=1
```

So the gate works, and appending "individual results may vary" — ordinary boilerplate a drafting
agent would plausibly add — is sufficient to switch it off on the same categorical assertion.
`"In May 2020 the protocol increased strength."` at `certainty: "low"` is clean for the same
reason; a month name is enough.

**Why Important.** Master plan §9.5 specifies for Low certainty: allowed phrasing "may",
"suggests", "limited evidence indicates"; **avoid: causal certainty**. The design
(`...-design.md:29`) states "Low-certainty records cannot use categorical causal language."
The implementation permits exactly that. The master plan §16 risk register
(`docs/product/master-plan.md:1738`) rates "AI hallucinates or overstates claims" — with
"certainty mismatch" as a named trigger — High/Critical, and lists this gate among its
mitigations. The candidate's own test at
`tests/unit/content-validation.test.ts:177-184` pins the intended behavior with an _adjacent_
calibration ("Limited evidence suggests this exercise may increase ..."), which passes under both
the current implementation and a correct one — so the existing suite cannot distinguish them.

This is a bounded fix, not a request for a scientific-language classifier. I am not reporting the
general imprecision of the regex approach, which the handoff discloses; I am reporting that the
calibration token is not required to govern the causal verb it is supposed to calibrate.

**Remediation.** Scope calibration to the clause containing the causal match rather than the whole
statement. Split the statement on `[.;!?]` (and optionally on `,` before a coordinating
conjunction), then for each causal match test `LOW_CALIBRATION_PATTERN` only against that match's
own clause — or require the calibration token to appear within a bounded window before the causal
verb, mirroring the existing `isDirectlyNegated` prefix-window technique at `validation.ts:185-190`.
Add red tests for the split-clause case and for a calibration token that follows the causal verb in
a different sentence.

---

### Minor (non-blocking; impact and destination recorded)

**M-1 — `constructor` as a review target bypasses the exact checksum binding.**
_(Confirmed end-to-end.)_ `src/lib/content/schemas.ts:493` tests
`if (!review.targetChecksums[targetId])`. `z.record` yields an ordinary object, so
`targetChecksums['constructor']` resolves through `Object.prototype` to the truthy `Object`
function and the "Missing immutable checksum" issue never fires. A review record at
`reviews/evidence/constructor.json` with `targetIds: ["constructor"]` and `targetChecksums: {}` —
no checksum at all for its reviewed target — passes: `Content validation passed: 2 records.`
exit 0. The control id `valueof` is correctly rejected. _Impact:_ contained —
`entityIdSchema` admits only lowercase kebab case, so `constructor` is the single reachable
`Object.prototype` key, and no plausible record is named that. It is nevertheless a fail-open in
the exact reviewed-target/checksum binding that the "Exact provenance remediation" section added.
_Follow-up:_ `Object.hasOwn(review.targetChecksums, targetId)`, or build the lookup as a `Map`.
_Destination:_ SBLA-007 remediation alongside I-1 (same schema file, same invariant family).

**M-2 — only the DOI URL is normalized; the other URL slots accept any scheme.**
`src/lib/content/schemas.ts:316-321` types all three URLs as bare `z.url()`, and the canonical-form
check at `schemas.ts:386-395` runs only when `identifiers.doi !== null`. Confirmed accepted:
`urls.primary: "javascript:alert(1)"`, `"data:text/html,<script>x</script>"`,
`"file:///C:/secrets.env"`; `urls.pubmed: "javascript:alert(1)"`; `urls.doi: "javascript:alert(1)"`
when `identifiers.doi` is null; and `urls.pubmed: "https://example.com/not-pubmed"` alongside
`pmid: "1"` with no binding between them. _Impact:_ no live exposure in SBLA-007 — nothing renders
or fetches these values — but master plan §10.8 names "A source URL/DOI fails normalization" as a
build-failure condition, and the design (line 16) promises "normalized identifiers and URLs". The
canonical PubMed form already appears in the valid fixture
(`tests/fixtures/evidence-schemas/records.valid.json:16`) without being enforced. I graded this
Minor rather than Important because the handoff explicitly defers "URL equivalence" to later tasks
and the consequence is entirely downstream; if the owner reads §10.8 as binding on SBLA-007, it
should be re-graded. _Follow-up:_ restrict all three URLs to `https:` (allowing `http:` only if a
source genuinely requires it), and require `urls.pubmed === "https://pubmed.ncbi.nlm.nih.gov/<pmid>/"`
when `identifiers.pmid` is set. _Destination:_ SBLA-007 if §10.8 is binding here, otherwise the
task that first renders or resolves source URLs.

**M-3 — `CERTAINTY_UNIVERSAL` false-positives on ordinary scientific phrasing.**
`src/lib/content/validation.ts:150`. `\ball\b` matches inside `all-cause`, so
`"Resistance training reduces all-cause mortality risk in older adults."` is rejected as universal
wording at `certainty: "high"`. `\b100\s*%` rejects `"A 100 % attendance rate was recorded."`
Both are common, correct evidence prose, and the emitted message ("Universal or guaranteed wording
is not allowed") is wrong for them. `"Overall adherence was similar"` is correctly clean, so the
word-boundary handling is otherwise right. _Impact:_ fail-closed direction — blocks correct content
rather than admitting bad content, and the author can reword. _Follow-up:_ exclude `all-cause`
(and hyphen-joined compounds generally) from the `all` alternative; require `100 %` to be adjacent
to an efficacy/outcome term rather than any numeral context. _Destination:_ SBLA-007 language-gate
hardening or the first content task that hits it.

**M-4 — the comparative outcome test is satisfied by any `for <word>`.**
`src/lib/content/validation.ts:178` accepts a comparative when the following clause matches
`\b(?:for|at|in terms of)\s+\S+` anywhere. `"Squats are better, as shown for instance in two
trials."` and `"Squats are the best, for example in beginners."` both pass with no named outcome,
contradicting master plan §9.5 ("'Better' is prohibited without 'better for what?'"). Separately,
`COMPARATIVE_PATTERN` (`validation.ts:151`) covers only `best|better|superior|optimal`, so
`"Squats produce greater hypertrophy than leg press."`, `"Squats are the most effective exercise."`,
and `"Squats outperform leg press."` are not tested for a named outcome at all. _Impact:_ the
outcome requirement is weaker than §9.5 states; no unsupported claim reaches publication on this
path alone, since sources, review, and approval still gate it. _Follow-up:_ reject the discourse
markers `for example`, `for instance`, `for the most part` as outcome tokens, and extend the
comparative vocabulary. _Destination:_ SBLA-007 language-gate hardening.

**M-5 — no Unicode or invisible-character normalization before linting.**
`src/lib/content/validation.ts:159-197` matches raw input. `"Training al\u200Bways increases
strength."` (zero-width space inside the word), `"Training ａlways ..."` (fullwidth `ａ`), and
`"Training álways ..."` (`a` + combining acute) all evade `CERTAINTY_UNIVERSAL`, while the plain
and uppercase forms are caught. _Impact:_ the zero-width case is the realistic one — text pasted
from PDFs and publisher pages routinely carries ZWSP and soft hyphens, so this can happen by
accident in exactly the drafting workflow this project uses, and the rendered page would read
"always" to a human. _Follow-up:_ apply `String.prototype.normalize('NFKC')` and strip
`\p{Cf}` format characters before every language check. _Destination:_ SBLA-007 language-gate
hardening.

**M-6 — `scope.population` and `scope.conditions` are not language-linted.**
`src/lib/content/validation.ts:341-360` lints `statement`, `plainLanguage`, and each `qualifiers`
entry. `scope.population: "everyone, always"` with `scope.conditions: ["always"]` is clean. These
are public claim prose that define the claim's boundary, and the universal-language rule applies at
every grade. _Impact:_ narrow — scope fields are short controlled phrases and the handoff records
the linted surface as statement/plain-language/qualifiers, so this is an incomplete remediation
rather than an undisclosed one. _Follow-up:_ lint `scope.population` and each `scope.conditions`
entry with paths `<id>.scope.population` and `<id>.scope.conditions.<n>`. _Destination:_ SBLA-007
language-gate hardening.

**M-7 — a missing record root crashes the gates with an unstructured error.**
`scripts/foundation/scan-records.mjs:10` calls `readdir` on each of the four `RECORD_ROOTS`
(`scripts/content/validate.mjs:13-18`) with no existence handling, so
`loadAndValidateRecords` rejects. Reproduced against a scratch root lacking
`research/packets`:
`THREW Error: ENOENT: no such file or directory, scandir '...\research\packets'`. All three
commands inherit it. _Impact:_ not reachable in the candidate tree — all four roots exist and are
held open by `.gitkeep` — and the failure is still fail-closed (nonzero exit). But the design
(line 35) requires "Every failure is a structured issue with a stable code, JSON-style path,
concise explanation, and author action", and a stack trace is not that. `research/packets` and
`reviews/evidence` are held open by nothing but a one-byte `.gitkeep`. _Follow-up:_ catch `ENOENT`
per root and emit a structured `RECORD_ROOT_MISSING` issue (documented in the authoring guide), or
skip absent roots deliberately. _Destination:_ SBLA-007 adapter hardening.

**M-8 — identifier-list uniqueness is enforced inconsistently across families.**
`reviewRecordSchema` requires unique `targetIds` (`schemas.ts:484-490`), but
`evidencePacketSchema.includedSourceIds` (`schemas.ts:415`) and
`changeRecordSchema.affectedIds` (`schemas.ts:528`) both accept duplicates — confirmed accepted.
_Impact:_ low; duplicates are redundant rather than contradictory, and the included/excluded
disjointness check still holds. It is a consistency gap in the same invariant family the provenance
remediation tightened. _Follow-up:_ apply the same uniqueness refinement to both arrays.
_Destination:_ SBLA-007 remediation alongside I-1.

**M-9 — an uppercase record extension is rejected with a misleading diagnostic.**
`scripts/content/validate.mjs:94` lowercases the extension for the allow-list check, but
`scripts/content/validate.mjs:153` passes that lowercased value to
`path.basename(relativePath, extension)`, which only strips an exactly matching suffix. A file
`content/sources/source-a.JSON` therefore yields
`[RECORD_PATH_ID_MISMATCH] Record ID source-a does not match filename source-a.JSON` rather than a
statement about the extension. _Impact:_ fail-closed, and the emitted remediation ("Rename the file
to `source-a.json`") happens to be the correct action, so an author is not led astray — but the
reported cause is wrong. _Follow-up:_ derive `expectedId` from the real extension
(`path.extname(relativePath)`), or reject non-lowercase extensions explicitly.
_Destination:_ SBLA-007 adapter hardening.

**M-10 — two small identifier-block edges.** `identifiers.pmid: "0"` is accepted
(`schemas.ts:305`, `/^\d{1,9}$/` permits a semantically impossible PMID). And when a DOI is stored
with a URL prefix, the canonical-URL message at `schemas.ts:392` concatenates it into
`DOI URL must be canonical: https://doi.org/https://doi.org/10.1234/abc`. _Impact:_ cosmetic; in
the second case the correct primary issue (`identifiers.doi`) is emitted alongside it, so the
author still sees the real problem. _Follow-up:_ require `[1-9]\d{0,8}` for PMID; suppress the
derived URL message when the DOI itself failed its pattern. _Destination:_ SBLA-007 schema polish.

---

## 5. What I verified as correct

Recorded so the bounded remediation does not disturb work that is already right.

**Record discovery and parsing — every documented failure mode fires, on Windows.** Against a
scratch root: `RECORD_NOT_REGULAR_FILE` on a real NTFS symlink, `RECORD_EXTENSION_UNSUPPORTED` on
`.txt` and on a file with no extension, `RECORD_KIND_UNSUPPORTED` on `content/glossary/`,
`RECORD_PARSE_FAILED` on truncated JSON and on malformed YAML (with the parser's line/column),
`RECORD_PATH_ID_MISMATCH` on a stem/ID divergence. `readme.md` (case-insensitively), dotfiles, and
`research/packets/*-handoff.md` are ignored as documented; `research/packets/notes.md` is not.
Nested subdirectories are discovered recursively and validated.

**Deterministic `asOf` handling.** `validateAsOfDate` rejects `2026-02-30`, `2026-13-01`, `""`,
`today`, `2026-9-1`, `26-09-11`, `2026-09-11T00:00:00Z`, and `" 2026-09-11"`, and accepts only real
calendar dates. Both time-aware adapters call it before loading data
(`scripts/graph/validate.mjs:11-15`, `scripts/evidence/status.mjs:11-15`), so an invalid
`SBLA_AS_OF` is a structured `AS_OF_INVALID` issue, not an exception. The internal
`assertIsoDate` guard inside `validateRecordGraph`/`validateSourceStatus` does throw, which is the
correct defense-in-depth split and matches the handoff's recorded decision.

**Date boundaries are consistent and documented.** `nextStatusCheckAt <= asOf` → overdue;
`statusCheckedAt > asOf` → future; `nextStatusCheckAt <= statusCheckedAt` → invalid schedule; the
same `due <= asOf` convention holds for claim review dates. Each boundary behaves exactly as
`docs/authoring/evidence-record-errors.md` describes, including the equality cases.

**Source status.** All four adverse statuses behave as specified: `retracted` → `SOURCE_RETRACTED`;
`corrected`, `expression-of-concern`, `superseded` → `SOURCE_REEVALUATION_REQUIRED`. A missing
`statusSource` fails closed even when method and both dates are present. Adverse status is checked
for every cited source role of a published claim, not just `supports` — verified with a `qualifies`
link. `pnpm evidence:status` additionally checks every loaded source regardless of citation, so an
orphan retracted source is not missed at the command level.

**Identifier contracts.** Uppercase DOI, URL-prefixed DOI, non-canonical `http://doi.org/...`, a
null `urls.doi` alongside a present DOI, whitespace-padded PMID, lowercase `pmc12345`, and an
all-null identifier block are each rejected at the right path with a usable remediation.

**Publication lifecycle.** A published record missing any of `reviewState: approved`,
`ownerApprovedAt`, `lastReviewedAt`, `reviewDueAt`, `approvalManifestId`, or `contentChecksum`
produces all six issues at once plus the missing-supporting-source issue — seven distinct paths,
not a short-circuit. `.strict()` rejects unknown keys on every family. Homoglyph IDs (Cyrillic
`а`), uppercase IDs, and trailing-dash IDs are rejected.

**Graph integrity.** `ID_DUPLICATE` across claim/source/entity IDs, `REFERENCE_MISSING` for
missing sources, relationship targets, and relationship claim IDs, `PUBLISHED_CLAIM_UNSOURCED`,
`PUBLIC_RELATIONSHIP_UNCITED`, and `PUBLIC_RELATIONSHIP_CLAIM_UNPUBLISHED` all fire correctly.
Reference resolution is order-independent (a relationship may target a record defined later in the
list).

**Provenance-remediation invariants hold except as noted in M-1.** Duplicate `targetIds`,
checksum keys absent from `targetIds`, non-kebab checksum keys, a `pass` verdict with an unresolved
blocking finding, and an evidence packet listing one source as both included and excluded are all
rejected.

**Documentation coverage.** `docs/authoring/evidence-record-errors.md` documents 27 issue codes;
27 codes are emitted; `tests/unit/evidence-schemas.test.ts:77-118` keeps them synchronized. Each
documented code carries a rejected condition, a minimal failing example, and a remediation.
Acceptance criterion 4 is met. (The closed-claim row at `docs/runbooks/current-work.md:39` says
"26 authoring diagnostics" — I confirmed that was accurate for the commit that row pins,
`a7bd6f2a...`, which had 26. It is not a stale claim.)

**Schema composability.** The design (line 21) says the exports compose. I tested it:
`commonEntitySchema.extend({ ... })` preserves `validateCommonLifecycle` — an extended schema still
produces all six publication issues. The claim holds.

**Scope boundary — acceptance criterion 5 is met.** The accepted-base-to-candidate diff touches 32
files with no scientific content: `content/`, `content-drafts/`, `research/packets/`, and
`reviews/evidence/` contain zero JSON/YAML records. No graph output is generated. No network client
entered the candidate — the only `fetch` calls in the tree are in `scripts/assets/benchmark.mjs`
and `scripts/assets/full-benchmark.mjs`, neither of which is in the diff. The SBLA-006 Minor
follow-ups assigned to this task are genuinely closed: Minor-3 fail-open scores
(`decision.mjs:163-166`, now `Number.isFinite(...) && >= 4`), Minor-4 unvalidated guardrails
(`decision.mjs:264-273`), Minor-5 gate-packet digest binding
(`decision.mjs:47-50` and `decision.mjs:314-321`), Minor-6 percent-decoding
(`decision.mjs:42-45`, now `fileURLToPath`), and Minor-1 via the `.gitattributes` whitespace
attribute — the range `git diff --check` is clean in my own run. The Windows receipt repair in
`scripts/assets/blender/convert.py` is a two-line `rev-parse` + `cat-file blob` substitution and
its contract test passes here.

---

## 6. Verified as not defects

Recorded to prevent re-litigation.

- **Shared `/g` regexes do not leak `lastIndex`.** `UNIVERSAL_PATTERN`, `COMPARATIVE_PATTERN`, and
  `CAUSAL_PATTERN` are module-level `/g` regexes, but they are consumed only through
  `String.prototype.matchAll`, which clones the regex and never mutates the original. Repeated
  calls are stable.
- **`evidence:status` reporting `as of 2026-09-11`** is the documented default-to-today behavior,
  not drift from the handoff's `2026-09-10`.
- **Evidence packets and review records are not Astro collections.** Only claims, sources, and
  changes are registered (`src/content.config.ts`). That is correct — packets and review records
  live outside `content/` by design ("auditable research inputs, never public entities") and are
  covered by the command-line gates.
- **`scheduled`, `superseded`, and `withdrawn` records are not gated like `published`.** I
  confirmed `validateCommonLifecycle` returns early for them (`schemas.ts:159`). Given that
  scheduling is explicitly deferred, and that a withdrawn or superseded record should not be forced
  to retain approval data, I do not treat this as a defect. Flagging it here so the decision is
  visible rather than implicit.
- **The coordination ledger row for this review does not record a tree hash**, unlike the builder
  row. That row lives on the coordination branch (`d8e6c34d`), outside the reviewed candidate, so
  it is not a candidate defect. It is the residue of SBLA-006 Minor-7 and belongs to ledger
  hygiene; the dispatch packet did supply both commit and tree, and I verified both.

---

## 7. Verdict and required next step

**FAIL.**

- **Unresolved Critical: 0**
- **Unresolved Important: 3** — I-1, I-2, I-3
- **Minor: 10** — M-1 through M-10, non-blocking, each with impact and destination recorded

Acceptance criteria 6 (`pnpm verify`, Chromium E2E, accepted-base range whitespace check) and 5
(scope boundary) are met on the exact candidate. Criterion 4 (documented issue codes) is met.
Criteria 1, 2, and 3 are not: the history/packet ordering invariant fails open and false-positives
on schema-legal input (I-1); review-date currency is unenforced for one of the two published
families (I-2); and the low-certainty causal gate can be switched off by an unrelated clause (I-3).
Criterion 7 is therefore not satisfied.

Per AGENTS.md, this FAIL is followed by **one bounded Codex remediation** and **one
complete-artifact recheck** in a new append-only `reviews/releases/SBLA-007-r2.md`. Recommended
remediation scope: I-1, I-2, I-3, and — since they sit in the same two files and the same invariant
families — M-1 and M-8. Each repair must land as a red test first; the existing suite passes on the
current behavior for all three Important findings and cannot detect their regression. The other
Minors may be carried to their recorded destinations.

I did not repair the candidate, and I wrote no path other than this report.
