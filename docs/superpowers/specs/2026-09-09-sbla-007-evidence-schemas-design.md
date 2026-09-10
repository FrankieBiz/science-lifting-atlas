# SBLA-007 Evidence Schemas and Validators Design

## Decision

Use a layered, deterministic validation system. Zod owns individual record shape and local invariants. A separate pure validator owns relationships between records, publication eligibility, review deadlines, source status, and certainty-language checks. Both Astro and the command-line gates import these same authorities.

This is preferable to putting every rule in Astro collection configuration because the evidence and graph commands also need the rules, and it is preferable to a custom all-in-one validator because Zod gives typed, path-specific authoring errors and matches the architecture already accepted in ADR 0002.

## Records and identity

All stable identifiers use lowercase kebab case and never derive from display names after publication. The common entity contract contains an ID, entity type, review state, publication state, review metadata, history metadata, and optional typed relationships. Review state and publication state remain separate.

The first complete record families are:

- Claims: atomic statements, plain language, scope, qualifiers, evidence grade, source links, and lifecycle metadata.
- Sources: bibliographic identity, normalized identifiers and URLs, access/study/quality metadata, publication-status checks, and an original project summary.
- Evidence packets: a scoped question, reproducible searches, included/excluded source decisions, synthesis, and decision log. They are auditable research inputs, never public entities.
- Review records: exact reviewed targets/checksums, independent reviewer role, verdict, findings, and timestamp.
- Change records: affected IDs, reason, before/after summaries, approval reference, deployment reference, and lifecycle metadata.

The schema exports are composable so later entity schemas can extend the common contract without duplicating publication safety rules.

## Publication and evidence safety

A published record must be approved, owner-approved, current for review, and tied to an approval manifest/checksum. A content change cannot silently preserve approval: substantive changes require a new review state and manifest. These rules are checked from explicit data rather than inferred from Git history.

A published claim must cite at least one source with an exact locator and directness value. Source-link roles distinguish support, qualification, contradiction, and neutral context. A retracted source cannot support a live claim. Corrections or expressions of concern block publication until reevaluated. Missing, failed, or overdue status checks fail closed for publication-eligible content.

Certainty wording is checked conservatively. Low-certainty records cannot use categorical causal language; very-low-certainty records must disclose hypothesis/inference; universal guarantees are rejected at every grade; and “better” is rejected unless an outcome is named. The linter returns codes and exact remediation rather than rewriting scientific prose.

## Determinism and errors

No schema consults the wall clock. Any time-relative rule receives an explicit `asOf` ISO date. Command-line use defaults that value to the current UTC date, while tests and later release manifests pin it. This keeps fixtures and historical builds reproducible.

Every failure is a structured issue with a stable code, JSON-style path, concise explanation, and author action. A checked-in authoring guide maps every public issue code to a minimal failing example and repair. Unknown record types, extensions, symbolic links, malformed documents, and mismatched storage paths are errors rather than skipped input.

## Boundaries

SBLA-007 validates graph references but does not generate a graph; SBLA-011 owns compilation and public bundles. It defines source-status state but does not call Crossref, PubMed, or other networks; later monitoring tasks own acquisition. It registers empty-capable collections but creates no scientific content. It also closes the bounded SBLA-006 guardrail, checksum, score fail-open, and path-portability follow-ups assigned to this task, while leaving performance-record semantic validation to SBLA-013.

## Verification

Checked-in fixtures cover every required record family plus duplicate/missing IDs, normalized and malformed identifiers, all lifecycle transitions, certainty mismatches, due-date boundaries, qualifying/contradictory links, retracted sources, and graph reference failures. Unit tests prove the pure APIs; subprocess tests prove the real commands fail closed. The final candidate must pass `pnpm verify`, Chromium E2E, range whitespace checks, and an independent Account-B review with no unresolved Critical or Important findings.
