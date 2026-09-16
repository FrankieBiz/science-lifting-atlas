# Evidence record authoring errors

The SBLA-007 content, graph, and evidence commands fail closed. Each diagnostic
has this form:

```text
- [ISSUE_CODE] record/path: explanation Remediation: exact author action
```

Run `pnpm validate:content`, `pnpm validate:graph`, and
`pnpm evidence:status` after changing records. Set `SBLA_AS_OF=YYYY-MM-DD` when a
reproducible historical result is required. The examples below show only the
smallest relevant fragment; a real record must also contain every field required
by its schema.

## Record discovery and parsing

### `RECORD_NOT_REGULAR_FILE`

- Rejected: a record path is a symbolic link, directory, or special entry.
- Minimal failing example: `content/claims/example.yml` is a symbolic link.
- Remediation: Replace the entry with a checked-in regular JSON or YAML record.

### `RECORD_EXTENSION_UNSUPPORTED`

- Rejected: a discovered record does not end in `.json`, `.yaml`, or `.yml`.
- Minimal failing example: `content/sources/example.txt`.
- Remediation: Use `.json`, `.yaml`, or `.yml` for structured records.

### `RECORD_KIND_UNSUPPORTED`

- Rejected: a structured file is under a directory that SBLA-007 does not yet
  map to an accepted schema.
- Minimal failing example: `content/exercises/example.json`.
- Remediation: Move the record to its canonical supported directory or complete
  the queue task that owns its schema.

### `RECORD_PARSE_FAILED`

- Rejected: JSON or YAML syntax cannot be parsed.
- Minimal failing example: `{"id":`.
- Remediation: Correct the JSON or YAML syntax and rerun content validation.

### `RECORD_PATH_ID_MISMATCH`

- Rejected: the record ID and filename stem differ.
- Minimal failing example: file `claim-a.json` contains `{"id":"claim-b"}`.
- Remediation: Rename the file to `<record-id>.<existing-extension>` or correct
  the record ID before publication.

### `SCHEMA_INVALID`

- Rejected: a field is missing, extra, malformed, or violates a local record
  invariant.
- Minimal failing example: `{"id":"Claim A"}` uses a non-normalized ID and
  omits the rest of the claim contract.
- Remediation: Correct every reported path to match the evidence-record schema.
  IDs use immutable lowercase kebab case; DOI values are lowercase bare DOIs
  paired with `https://doi.org/<doi>`; published records require completed
  independent-review, owner-approval, manifest, checksum, and review-date data.

## Deterministic date input

### `AS_OF_INVALID`

- Rejected: `SBLA_AS_OF` is not a real `YYYY-MM-DD` calendar date.
- Minimal failing example: `SBLA_AS_OF=2026-02-30`.
- Remediation: Set `SBLA_AS_OF` to a real calendar date in `YYYY-MM-DD` form.

## Source status

### `SOURCE_STATUS_METHOD_MISSING`

- Rejected: `publication.statusMethod` is null or empty.
- Minimal failing example: `publication: { statusMethod: null }`.
- Remediation: Record the source-type-specific status method before this source
  can support publication.

### `SOURCE_STATUS_SOURCE_MISSING`

- Rejected: `publication.statusSource` is null or empty.
- Minimal failing example: `publication: { statusSource: null }`.
- Remediation: Record the authoritative URL, registry, publisher, or issuer used
  for the status check.

### `SOURCE_STATUS_DATE_MISSING`

- Rejected: `statusCheckedAt` or `nextStatusCheckAt` is null.
- Minimal failing example:
  `publication: { statusCheckedAt: null, nextStatusCheckAt: "2026-10-01" }`.
- Remediation: Run the authoritative status check and record both ISO dates.

### `SOURCE_STATUS_CHECKED_IN_FUTURE`

- Rejected: `statusCheckedAt` is later than the explicit `asOf` date.
- Minimal failing example: `statusCheckedAt: "2026-09-10"` with
  `SBLA_AS_OF=2026-09-09`.
- Remediation: Correct the check date or use the reproducible `asOf` date for
  which the check had already occurred.

### `SOURCE_STATUS_SCHEDULE_INVALID`

- Rejected: `nextStatusCheckAt` is not later than `statusCheckedAt`.
- Minimal failing example: both fields are `2026-09-08`.
- Remediation: Set `nextStatusCheckAt` to a policy-compliant date after
  `statusCheckedAt`.

### `SOURCE_STATUS_OVERDUE`

- Rejected: `nextStatusCheckAt` is on or before `asOf`.
- Minimal failing example: `nextStatusCheckAt: "2026-09-09"` with
  `SBLA_AS_OF=2026-09-09`.
- Remediation: Recheck the authoritative source status and set a new
  policy-compliant due date.

### `SOURCE_RETRACTED`

- Rejected: a source has `publication.status: retracted`.
- Minimal failing example: `publication: { status: "retracted" }`.
- Remediation: Block or withdraw dependent claims and publish the required
  correction record.

### `SOURCE_REEVALUATION_REQUIRED`

- Rejected: source status is `corrected`, `expression-of-concern`, or
  `superseded`.
- Minimal failing example: `publication: { status: "expression-of-concern" }`.
- Remediation: Reevaluate every dependent claim before publication or continued
  use.

## Review freshness

### `REVIEW_DATE_IN_FUTURE`

- Rejected: a published claim's `review.lastReviewedAt` is later than `asOf`.
- Minimal failing example: `lastReviewedAt: "2026-09-10"` with
  `SBLA_AS_OF=2026-09-09`.
- Remediation: Correct `lastReviewedAt` or use the reproducible `asOf` date for
  which the review had already occurred.

### `REVIEW_SCHEDULE_INVALID`

- Rejected: `reviewDueAt` is not later than `lastReviewedAt`.
- Minimal failing example: both fields are `2026-09-08`.
- Remediation: Set `reviewDueAt` to a policy-compliant date after
  `lastReviewedAt`.

### `REVIEW_OVERDUE`

- Rejected: a published claim's `reviewDueAt` is on or before `asOf`.
- Minimal failing example: `reviewDueAt: "2026-09-09"` with
  `SBLA_AS_OF=2026-09-09`.
- Remediation: Re-review the claim and record a new policy-compliant review due
  date, or unpublish it.

## Claim wording

### `CERTAINTY_UNIVERSAL`

- Rejected: the statement uses universal or guaranteed wording.
- Minimal failing example: `This exercise always works for everyone.`
- Remediation: Narrow the population, conditions, comparator, and outcome to
  what the evidence establishes.

### `OUTCOME_REQUIRED`

- Rejected: `best`, `better`, `superior`, or `optimal` appears without an
  explicit `for`, `at`, or `in terms of` outcome.
- Minimal failing example: `Exercise A is better.`
- Remediation: State better for which measured outcome, population, comparator,
  and conditions; for example, `may be better for measured outcome X`.

### `CERTAINTY_OVERSTATED`

- Rejected: a low- or very-low-certainty statement uses categorical causal
  wording without calibration.
- Minimal failing example: `This exercise will improve strength.` with
  `certainty: low`.
- Remediation: Use calibrated wording such as `may` or `suggests`, or strengthen
  and re-review the evidence.

### `HYPOTHESIS_DISCLOSURE_REQUIRED`

- Rejected: very-low-certainty wording does not disclose that it is a
  hypothesis, inference, plausible explanation, or unable to establish the
  effect.
- Minimal failing example: `This setup changes regional hypertrophy.` with
  `certainty: very-low`.
- Remediation: Explicitly label the statement as a hypothesis, inference, or
  plausible explanation.

## Graph integrity

### `CONTENT_CHECKSUM_MISMATCH`

- Rejected: a published record's stored checksum is not the SHA-256 of its
  canonical content with only `contentChecksum` normalized to null.
- Minimal failing example: edit a claim statement after its checksum was
  approved.
- Remediation: Recompute the checksum, obtain review and owner approval, and
  append a new manifest.

### `APPROVAL_MANIFEST_MISSING`

- Rejected: a published record names no existing approval manifest.
- Minimal failing example: `approvalManifestId: "approval-missing"`.
- Remediation: Reference the immutable manifest that covers the exact record.

### `APPROVAL_MANIFEST_INELIGIBLE`

- Rejected: the referenced manifest is rejected or not deployment eligible.
- Minimal failing example: `decision: "rejected"` with a published record.
- Remediation: Keep the record unpublished until an eligible manifest exists.

### `APPROVAL_MANIFEST_SUPERSEDED`

- Rejected: a published record is still bound to a manifest replaced by a
  later manifest in the same chain.
- Minimal failing example: manifest B supersedes A while the record names A.
- Remediation: Bind the record to the one current owner-approved manifest.

### `APPROVAL_CHECKSUM_MISMATCH`

- Rejected: the current manifest does not contain the record's computed
  canonical checksum.
- Minimal failing example: the manifest echoes an old or author-supplied digest.
- Remediation: Review the exact current content and append a manifest containing
  its computed checksum.

### `MANIFEST_REVIEW_PATH_MISSING`

- Rejected: a required review path is invalid or does not exist exactly.
- Minimal failing example: `reviews/releases/missing-r1.md`.
- Remediation: Add the immutable report at the exact path or correct the
  manifest.

### `MANIFEST_REVIEW_PATH_CASE_MISMATCH`

- Rejected: a required review path differs from the tracked path by letter case.
- Minimal failing example: `Reviews/releases/report.md` for tracked `reviews/`.
- Remediation: Use the exact repository path casing.

### `MANIFEST_REVIEW_NOT_REGULAR_FILE`

- Rejected: a required review resolves to a directory, link, or special entry.
- Minimal failing example: `requiredReviews[].path` names a directory.
- Remediation: Reference a checked-in regular review file.

### `MANIFEST_REVIEW_CHECKSUM_MISMATCH`

- Rejected: the SHA-256 of the required review file differs from the manifest.
- Minimal failing example: edit a review report after its digest was recorded.
- Remediation: Preserve the immutable report and record its exact digest in a
  newly approved manifest.

### `ID_DUPLICATE`

- Rejected: the same ID occurs in more than one claim, source, or entity record.
- Minimal failing example: two source files both contain `id: source-a`.
- Remediation: Assign one immutable ID to each record and update references
  deliberately.

### `PUBLISHED_CLAIM_UNSOURCED`

- Rejected: a published claim has no source links.
- Minimal failing example: `publicationState: published` with `sourceLinks: []`.
- Remediation: Add exact supporting source links or unpublish the claim.

### `REFERENCE_MISSING`

- Rejected: a source, relationship target, or relationship claim ID does not
  exist in the loaded record set.
- Minimal failing example: `sourceLinks: [{ sourceId: "source-missing", ... }]`.
- Remediation: Add the validated referenced record or correct the referenced ID.

### `PUBLIC_RELATIONSHIP_UNCITED`

- Rejected: a public relationship has no `claimId`.
- Minimal failing example:
  `relationships: [{ public: true, claimId: null, ... }]`.
- Remediation: Attach an approved claim ID or keep the relationship non-public.

### `PUBLIC_RELATIONSHIP_CLAIM_UNPUBLISHED`

- Rejected: a public relationship cites a claim that is not published.
- Minimal failing example: a public relationship has
  `claimId: "claim-draft"` while that claim has
  `publicationState: "unpublished"`.
- Remediation: Publish and approve the cited claim, cite another published
  claim, or keep the relationship non-public.

## Exit behavior

Any reported issue makes the command exit nonzero. Fix the authoring error; do
not weaken or bypass a validator to make a record pass. Source-status network
acquisition, graph generation, public scientific content, and MDX claim
rendering remain owned by later queue tasks.
