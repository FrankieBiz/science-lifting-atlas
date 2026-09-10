# SBLA-007 Evidence Schemas and Validators Implementation Plan

> **For Codex:** Execute this plan one task at a time with test-driven development. Stop after the immutable builder handoff; Account B must independently accept the candidate.

**Goal:** Establish one deterministic, fail-closed Zod authority for common entity metadata and claim, source, evidence-packet, review, and change records, with fixtures that prove valid records pass and invalid records fail for actionable reasons.

**Architecture:** Keep record shape validation pure and reusable in `src/lib/content/schemas.ts`. Put cross-record, time-relative, graph, and certainty-language checks in `src/lib/content/validation.ts`, with an explicit `asOf` date so builds are reproducible. Astro collections and the three command-line adapters consume the same schemas and validation functions. SBLA-011 still owns graph compilation; this task validates references and publication safety but does not generate the public graph.

**Tech stack:** TypeScript 6, Zod 4, Astro content collections, Node.js 24, Vitest 4, JSON/YAML fixtures.

**Scope boundary:** No scientific claims, public pages, MDX claim rendering, live literature acquisition, graph bundle generation, or source-status network client. SBLA-007 supplies the contracts those later tasks consume. The SBLA-006 performance-record parsing follow-up remains assigned to SBLA-013.

---

## Task 1: Lock the contract with adversarial fixtures

**Files:**

- Create: `tests/fixtures/evidence-schemas/records.valid.json`
- Create: `tests/fixtures/evidence-schemas/records.invalid.json`
- Create: `tests/fixtures/evidence-schemas/graph-cases.json`
- Create: `tests/fixtures/evidence-schemas/source-status-cases.json`
- Create: `tests/unit/evidence-schemas.test.ts`
- Create: `tests/unit/content-validation.test.ts`

1. Add representative valid fixtures for each required record kind and common entity metadata.
2. Add one-field invalid fixtures for IDs, DOI/URL normalization, review/publication state, timestamps, unsupported certainty wording, missing locators, stale source checks, retractions, and missing references.
3. Write tests that import the not-yet-created schema and validation APIs and assert stable issue codes, record paths, and remediation text.
4. Run the focused tests and record the expected red result caused by missing implementation modules.
5. Commit only after the red result is observed.

## Task 2: Implement the shared Zod schemas

**Files:**

- Create: `src/lib/content/schemas.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

1. Add direct, pinned `zod` and `yaml` dependencies rather than relying on Astro's transitive packages.
2. Implement reusable primitives for immutable kebab-case IDs, normalized DOI/PMID/PMCID values, absolute canonical URLs, ISO dates/timestamps, non-empty text, checksums, review state, and publication state.
3. Implement common entity identity, lifecycle, review, history, and relationship schemas.
4. Implement discriminated schemas for `claim`, `source`, `evidence-packet`, `review`, and `change-record`.
5. Enforce local invariants with Zod refinements, including approved/published state requirements, claim source locators, identifier presence, and explicit change/review provenance.
6. Run focused schema tests until green.

## Task 3: Implement deterministic cross-record validation

**Files:**

- Create: `src/lib/content/validation.ts`
- Modify: `tests/unit/content-validation.test.ts`

1. Return structured issues with stable `code`, `path`, `message`, and `remediation` fields.
2. Validate duplicate IDs, missing claim/source/entity references, published claims without sources, public relationships without claim IDs, and contradictory/qualifying evidence visibility inputs.
3. Validate retracted, corrected, expression-of-concern, failed, missing, and overdue source-status states against an explicit `asOf` date.
4. Enforce certainty-language calibration and reject unqualified “better,” universals, and causal wording inconsistent with the claim's certainty.
5. Prove deterministic boundary behavior with exact-date fixtures and run focused tests until green.

## Task 4: Replace foundation placeholders with shared adapters

**Files:**

- Modify: `src/content.config.ts`
- Modify: `scripts/content/validate.mjs`
- Modify: `scripts/graph/validate.mjs`
- Modify: `scripts/evidence/status.mjs`
- Modify: `tests/unit/content-validation.test.ts`

1. Register the supported file-backed collections with the same Zod schemas used by command-line validation.
2. Add safe JSON/YAML record loading that rejects symbolic links, unsupported extensions, malformed documents, and path/type mismatches.
3. Make `validate:content` validate all supported records and print actionable issue details while continuing to report the truthful zero-record state.
4. Make `validate:graph` run the bounded cross-record integrity checks without compiling graph output.
5. Make `evidence:status` run source-status checks with a caller-overridable, ISO `SBLA_AS_OF` value for deterministic tests and UTC today by default for normal operation.
6. Add subprocess tests for clean empty repositories and malformed fixtures, then run the focused suites.

## Task 5: Close the SBLA-006 safety follow-ups assigned to SBLA-007

**Files:**

- Modify: `scripts/assets/decision.mjs`
- Modify: `tests/unit/asset-decision.test.ts`

1. Write failing mutations for the two unvalidated guardrail booleans and a missing license-clarity score.
2. Add checks that fail closed for all six policy booleans and absent/non-numeric score data.
3. Replace URL pathname root resolution with `fileURLToPath` and test operation from a checkout path containing spaces.
4. Validate that the Gate A packet cites the current decision-record checksum; do not rewrite the already accepted packet.
5. Run the asset-decision and portability-focused tests until green.

## Task 6: Document authoring failures and verify the complete candidate

**Files:**

- Create: `docs/authoring/evidence-record-errors.md`
- Modify: `docs/runbooks/current-work.md`
- Create: `reviews/releases/SBLA-007-handoff.md`

1. Document every public issue code with the rejected condition, a minimal failing example, and exact remediation.
2. Run formatting, lint, type checking, all unit tests, content/graph/evidence adapters, production build, portability checks, foundation checks, and both asset gates through `pnpm verify`.
3. Run `pnpm test:e2e` separately in Chromium.
4. Run range `git diff --check` from the accepted base and record the exact output.
5. Commit the implementation candidate, record its commit and tree in the handoff, close the builder claim, and create the immutable handoff commit.
6. Stop. Create a fresh reviewer branch/worktree from the exact candidate, pre-claim only `reviews/releases/SBLA-007-r1.md`, and dispatch Account B for independent adversarial acceptance.

## Acceptance evidence

- Every valid fixture parses and every invalid fixture fails for its intended stable issue code.
- The standalone content, graph, and evidence commands use the shared schema authority and fail closed.
- The full `pnpm verify` chain and Chromium E2E pass on the immutable candidate.
- The handoff records exact commit, tree, base, changed paths, command output, deferred scope, and Account A advisory limitations.
- Account B later reports PASS with zero unresolved Critical or Important findings in a separate append-only review report.
