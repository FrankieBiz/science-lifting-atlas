# Handoff: SBLA-011 R1 bounded remediation

**Status:** Immutable Codex remediation candidate pending the one permitted
complete-artifact Claude Review recheck. This is not acceptance and must not be
merged to `main` unless the recheck returns PASS with zero unresolved Critical
and Important findings.

## Objective and provenance

- Failed candidate: `478411a7aa11da717d7a3de29fe7ad93d0d3604a`
- Independent R1 report: `reviews/releases/SBLA-011-r1.md`
- R1 report commit: `a01824ffdaf5b37488e907b37146db857773fb6c`
- R1 verdict: FAIL — 1 Critical, 6 Important, 9 nonblocking Minor
- Remediation branch: `codex/SBLA-011-r1-remediation`
- Remediation worktree: `C:\src\s011fix1`
- Remediation implementation commit:
  `805a75b78ec8626e8b2d96ad0a4b7b87fcaf4bfb`
- Remediation implementation tree:
  `da5cb79d19edd5501a7d21e3ac3f82029ebbd0b1`
- Runtime: Node.js `v24.20.0`, pnpm `11.24.0`

The work is limited to the seven blocking R1 findings. No promoted claim,
source, page record, approval decision, or graph-data record changed. The nine
Minor findings remain routed exactly as recorded in R1 and did not expand this
remediation.

## Blocking findings closed by construction

1. **C1 — content checksums now bind actual record content.**
   `recordContentChecksum` hashes canonical JSON with only the checksum field
   normalized to null, breaking the self-reference while covering every other
   record field. Publication validation now checks computed checksum → record
   checksum → current-manifest entry. A test mutates approved text and requires
   both `CONTENT_CHECKSUM_MISMATCH` and `APPROVAL_CHECKSUM_MISMATCH`.
2. **I1 — the public preview escape hatch is removed.** `Claim.astro` and
   `ClaimGroup.astro` no longer accept or forward `preview`; claim eligibility is
   unconditional. The MDX lint independently rejects any `preview` attribute on
   `Claim` or `ClaimGroup`.
3. **I2 — required review artifacts are verified from disk.** Content loading
   resolves every manifest review path with exact repository casing, requires a
   regular file, computes its SHA-256 bytes, and compares that digest with the
   manifest. Missing, case-mismatched, non-regular, and checksum-mismatched
   artifacts fail closed with documented codes.
4. **I3 — superseded manifests cannot authorize publication.** Publication
   coverage receives the same superseded-ID set used by the chain validator and
   emits `APPROVAL_MANIFEST_SUPERSEDED` when a record is not bound to the current
   manifest.
5. **I4 — graph ordering is locale independent.** Canonical object keys and
   graph nodes use an explicit code-point comparator. Edges use a field-by-field
   tuple comparator, eliminating both host ICU dependence and the collation-
   ignorable NUL separator. Recompiling on the current records produced bytes
   identical to the committed 94-node/120-edge graph, so the graph artifact did
   not change.
6. **I5 — certainty exceptions are scoped to their evidence subject.** The six
   incidental keyword waivers, bare `all <number>` waiver, whole-statement
   single-study waiver, and broad `During` waiver are gone. Narrow exceptions
   cover only explicit sample references, enumerated inputs, exact methodological
   domains, a quantified single-trial result, and measured ascent/descent moment
   arms. All fourteen R1 adversarial overclaims are regression fixtures, while
   every promoted R4-approved claim still compiles.
7. **I6 — MDX safety checks recurse through allowed containers.** Raw/lowercase
   JSX, module/free expressions, unsupported components, and preview attributes
   are rejected inside `Editorial`, `Claim`, and `ClaimGroup` as well as at the
   top level. The remediation intentionally does not expand into R1 Minor M3 or
   M4 policy decisions.

## Files changed

- `docs/authoring/evidence-record-errors.md`
- `scripts/content/validate.mjs`
- `src/components/evidence/Claim.astro`
- `src/components/evidence/ClaimGroup.astro`
- `src/lib/content/checksum.ts`
- `src/lib/content/mdx-lint.ts`
- `src/lib/content/validation.ts`
- `src/lib/graph/compiler.ts`
- `tests/unit/content-validation.test.ts`
- `tests/unit/evidence-schemas.test.ts`
- `tests/unit/foundation-adapters.test.ts`
- `tests/unit/sbla-011-approval-validation.test.ts`
- `tests/unit/sbla-011-graph-compiler.test.ts`
- `tests/unit/sbla-011-mdx-claim-lint.test.ts`
- `reviews/releases/SBLA-011-r1-remediation-handoff.md`

`public/data/evidence-graph.v1.json` was regenerated and proved byte-identical,
so it has no diff. No file under `content/claims`, `content/sources`,
`content/muscles`, `content/exercises`, `content-drafts`, or `research` changed.

## Verification

The final `pnpm verify` run passed end to end:

- Prettier: all files clean
- ESLint: zero warnings/errors
- Astro check: 69 files, 0 errors, 0 warnings, 0 hints
- Unit tests: 20 files, 274 tests passed
- Deterministic promotion: 94 production records match accepted inputs
- Content validation: 95 records passed
- MDX lint: 0 public MDX files checked, with the bypasses covered directly by
  unit tests
- Graph validation: 94 nodes and 120 edges match deterministic output
- Research integrity: one complete SBLA-009 bundle
- Evidence status: 68 sources current as of 2026-09-16
- Static build: one page
- Portability: 3 files, 17 tests passed
- Foundation contract: passed
- Asset spike and owner asset decision: passed

Additional focused evidence:

- Five remediation-focused suites: 63/63 tests passed.
- Full unit suite after adapter integration: 274/274 tests passed.
- `pnpm graph:compile` completed with 94 nodes/120 edges and no graph-file diff.
- `git diff --check` passed before the implementation commit.

## Known limits retained from R1

- The accepted slice still has no owner approval manifest and remains entirely
  unpublished; the new happy and adversarial manifest paths are exercised with
  deterministic fixtures.
- The repository still has no live public scientific MDX route, so the real
  repository scan truthfully checks zero MDX files. R1 Minor M9 routes the
  integration work to SBLA-012; this remediation tests the AST gate directly.
- R1 Minors M1–M9 remain nonblocking and are not silently represented as fixed.

## Required reviewer action

Claude Review account B must recheck the complete remediation candidate against
all R1 criteria, not only the changed lines. It should:

1. verify the exact base, branch, tree, clean status, and report-only reviewer
   write boundary;
2. rerun `pnpm evidence:status && pnpm verify`;
3. reproduce the C1 mutation, I1 public-preview, I2 required-review, I3
   superseded-manifest, I4 alternate-locale/shuffled-input, I5 adversarial
   language, and I6 nested-MDX probes;
4. verify the 23 claims and 68 sources remain unchanged from the failed
   candidate;
5. write only `reviews/releases/SBLA-011-r2.md`, then return PASS or FAIL with
   zero ambiguity.

No further review layer is permitted after this complete-artifact recheck unless
new material risk changes the acceptance scope.
