# Handoff: SBLA-008 evidence-review Markdown validation repair

## Objective

Reconcile the documented append-only Markdown evidence-review path with the
structured-record validator so an evidence review can coexist with machine-
readable review records without weakening extension validation generally.

## Inputs and exact paths

- Base: `eefefd20ebdf61efe65489f30b60db09c33aa124`
- Triggering report: `reviews/evidence/SBLA-008-r1.md`
- Coordination claim: `4c904b4bd6cebc99c8fde827c2d15db35f2b8d3f`
- Branch: `codex/SBLA-008-review-markdown-validation`
- Worktree: `C:\src\s008gate`
- Modified validator: `scripts/content/validate.mjs`
- Regression coverage: `tests/unit/foundation-adapters.test.ts`

## Constraints

- Preserve the accepted structured review schema for JSON and YAML records.
- Do not relocate or rewrite the independent reviewer report.
- Do not ignore arbitrary Markdown or unsupported extensions under
  `reviews/evidence/`.
- Match only the documented append-only `<task-id>-r<number>.md` report form.
- Do not alter the scientific FAIL verdict or Account A's research artifacts.

## Work completed

- Added a subprocess regression proving that an append-only
  `reviews/evidence/SBLA-008-r1.md` report is allowed alongside structured
  records.
- Added a negative assertion proving an arbitrary
  `reviews/evidence/notes.md` file remains rejected.
- Narrowly excluded only evidence-review Markdown basenames ending in a
  positive round number such as `-r1.md` from structured-record parsing.

## Decisions made

- `reviews/evidence/` remains a structured review-record root.
- Human-readable append-only reports are distinguished by the documented
  `-r<number>.md` suffix rather than by ignoring every Markdown file.
- Round numbering starts at one; `-r0.md` is not accepted by the exemption.

## Tests/checks run and results

- Focused RED: 1/9 adapter tests failed with
  `RECORD_EXTENSION_UNSUPPORTED` for the documented report path.
- Focused GREEN: 9/9 adapter tests passed after the narrow exemption.
- Direct `node scripts/content/validate.mjs`: PASS with zero structured records.
- Full repository verification is run on the completed candidate before commit.

## Known uncertainties

- The repository does not yet require a paired structured review record for
  every Markdown report. That is a separate data-model decision.
- This repair addresses report discovery only; Account B's two Important and
  five Minor scientific-scope findings still require Account A remediation.

## Files created or modified

- `scripts/content/validate.mjs`
- `tests/unit/foundation-adapters.test.ts`
- `reviews/releases/SBLA-008-validation-remediation-handoff.md`

## Required reviewer action

During the SBLA-008 complete-artifact recheck, confirm that the documented
evidence-review Markdown path passes content validation, arbitrary Markdown is
still rejected, structured review JSON/YAML files are still parsed, and the
change does not broaden Claude role write authority.

## Acceptance criteria

- `reviews/evidence/SBLA-008-r1.md` does not trigger
  `RECORD_EXTENSION_UNSUPPORTED`.
- `reviews/evidence/notes.md` still triggers
  `RECORD_EXTENSION_UNSUPPORTED`.
- Structured review records remain validated against `reviewSchema`.
- Focused adapter tests and `pnpm verify` pass.
- The independent review report and research candidate are byte-unchanged.
