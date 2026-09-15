# Handoff: SBLA-011 — Production evidence vertical slice

**Status:** Immutable Codex builder candidate pending independent Claude Review
(account B). This is not acceptance and must not be merged to `main` unless the
latest review report returns PASS with zero unresolved Critical and Important
findings.

## Objective

Satisfy master plan §18 task SBLA-011: promote the R4-approved one-muscle/two-
exercise evidence slice into production records, compile a deterministic static
evidence graph, add fail-closed MDX claim components and an AST prose lint, and
make `pnpm evidence:status && pnpm verify` pass without uncited factual prose or
broken references.

## Inputs and exact paths

- Repository: `https://github.com/FrankieBiz/science-lifting-atlas.git`
- Branch: `codex/SBLA-011-production-slice`
- Worktree: `C:\src\s011vertical`
- Accepted base commit: `6e5948f6423d0e603ef4838c3393398c47c27c9b`
- Accepted base tree: `96a3e9ba2db40a18a84e1ffdf626b56b0e3d7349`
- Implementation commit: `8df97fcbb93cd14e6b05927acb2e2f253816c8a2`
- Implementation tree: `7f0da387beb4f0354c4c1d76c0597cd10e85cdbf`
- Approved evidence report: `reviews/evidence/SBLA-009-r4.md`
- Approved claim source:
  `content-drafts/syntheses/SBLA-009-atomic-claims.json`
- Approved source extraction input:
  `research/extractions/SBLA-009-source-extractions.json`
- Approved page drafts: `content-drafts/muscles/pectoralis-major.md`,
  `content-drafts/exercises/barbell-flat-bench-press.md`, and
  `content-drafts/exercises/cable-fly-standing-bilateral-shoulder-height.md`
- Graph artifact: `public/data/evidence-graph.v1.json`; SHA-256
  `4bd4787c56d4d14e9aed1059b9fd812ae7f0f8b8c01ff681037ac0f433d2f446`
- Runtime: Node.js `v24.20.0`, pnpm `11.24.0`

The immutable review candidate is the later commit that adds this handoff. Its
exact commit and tree must be recorded in the coordination ledger's separate
review claim before Account B receives the prompt.

## Constraints

- Promote only text and citations accepted by SBLA-010 R4. Codex may transform
  structure but must not make a new scientific conclusion.
- Keep every promoted claim and page `publicationState: unpublished` and
  `ownerApprovedAt: null`. The R4 scientific audit is not human publication
  approval.
- Do not create an approval manifest, live scientific route, design system,
  search, comparison UI, or 3D interaction. SBLA-012 and later queue tasks own
  those surfaces and owner decisions.
- Preserve all prior evidence artifacts and immutable review reports.
- Account B must independently audit the exact candidate and may write only its
  pre-claimed append-only report; it must not repair the candidate.

## Work completed

1. Deterministically promoted all 23 R4-approved atomic claims and their 68
   cited source extractions into validated production JSON without changing the
   approved claim wording or source-link locators.
2. Added approved-but-unpublished records for `pectoralis-major`,
   `barbell-flat-bench-press`, and
   `cable-fly-standing-bilateral-shoulder-height`. Their factual sections are
   claim-ID lists; project definitions are explicitly editorial.
3. Added muscle, exercise, content-section, and immutable approval-manifest
   schemas and registered their Astro collections. Publication remains fail-
   closed on owner approval, review freshness, manifest eligibility, and exact
   checksum coverage.
4. Added manifest-chain, duplicate-current-manifest, page-to-claim eligibility,
   and exact manifest-checksum graph validation.
5. Added a deterministic graph compiler. The committed bundle contains 94
   nodes and 120 edges and is byte-compared with a fresh in-memory compile by
   `pnpm validate:graph`.
6. Added `<Claim>` and `<ClaimGroup>` Astro components. Public rendering rejects
   missing, unpublished, unapproved, owner-unapproved, or manifest-unbound
   claims. Mixed/qualified claims disclose that state and show supporting,
   qualifying, and contradictory source roles with exact locators.
7. Added a remark/MDX AST lint that rejects raw HTML, unsupported components,
   imports/exports/free expressions, missing claim IDs, and text-bearing public
   blocks outside `Claim`, `ClaimGroup`, or explicit `Editorial` boundaries.
8. Added `content:slice:promote`, `content:slice:check`, `graph:compile`, and
   `lint:content-prose`; the non-mutating checks are in the pinned `verify`
   chain.
9. Preserved the SBLA-007 empty-repository contract and all 254 pre-existing
   and new unit expectations while adding focused graph/compiler and AST-lint
   coverage.

## Decisions made

- Production review state and publication state remain separate. R4 permits
  `reviewState: approved`; it does not permit a fabricated owner identity,
  timestamp, content checksum, approval manifest, or public route.
- The promotion tool copies the accepted claim schema fields exactly and drops
  research-only `recordIds`/`rederivation` metadata that the production claim
  schema intentionally does not expose.
- Source `study` and `projectSummary` fields are deterministic projections of
  the accepted extraction's reported facts, condition labels, contrast type,
  questions, and research-role inference. No network acquisition or new
  interpretation occurs.
- A stable primary repository URL satisfies the source identity rule when DOI,
  PMID, PMCID, and ISBN are all unavailable; this is required for the accepted
  handle-identified thesis.
- Certainty lint retains its adversarial universal-language tests but recognizes
  bounded sample statements, negated `at all`, anatomical `superior-inferior`,
  single-study framing, case-report/mixed-evidence disclosure, and explicit
  methodological rules. These prevent false rejection of the R4-approved text
  without permitting generic promises such as “all participants.”
- The graph omits wall-clock generation time. Its source-status snapshot is
  derived from records, so identical inputs produce identical bytes.

## Tests/checks run and results

- Initial focused graph/MDX run — FAIL: one legacy fixture retained a missing
  relationship target; inline MDX `Editorial` and lowercase HTML parsed as text
  JSX. The fixture and AST classification were corrected; the focused rerun
  passed 5/5 tests.
- First full unit run — FAIL: six compatibility cases exposed the stable five-
  evidence-kind list and isolated adapter fixture dependencies. SBLA-011 added
  a separate expanded kind list, copied compiler dependencies in subprocess
  fixtures, and preserved the truthful empty-state message.
- Compatibility rerun: `pnpm test` — PASS, 19 files and 254 tests.
- First promotion run — FAIL before writes because research-only `recordIds`
  are not a production claim field; the exact production-field projection was
  added.
- Second promotion run — FAIL before writes because the accepted handle thesis
  has no DOI/PMID/PMCID/ISBN; the schema now accepts its stable primary
  repository URL.
- First graph compile over real records — FAIL on conservative regex false
  positives in already-audited bounded measurements and evidence caveats. The
  lint was narrowed with explicit bounded-language cases while the original 28
  certainty-language tests stayed green.
- `pnpm content:slice:check` — PASS, 94 generated production records match their
  accepted inputs byte-for-byte after deterministic formatting.
- `pnpm validate:content` — PASS, 95 records (94 production plus the accepted
  evidence packet).
- `pnpm validate:graph` — PASS, 94 nodes and 120 edges match the committed
  deterministic output.
- `pnpm evidence:status` — PASS, 68 sources checked as of 2026-09-15.
- `pnpm validate:research` — PASS, one complete SBLA-009 bundle.
- Final `pnpm verify` — PASS: Prettier and ESLint clean; Astro check reports 67
  files and zero diagnostics; 254 unit tests pass; promotion/content/MDX/graph/
  research/status gates pass; static build emits one shell page; 17 portability
  tests pass; foundation and both asset gates pass.
- `git diff --check` before implementation commit — PASS with no output.
- Implementation commit changes 114 files with 8,616 insertions and 28
  deletions; 23 claim files, 68 source files, three page records, one generated
  graph, pipeline code, components, tests, package metadata, and no prior
  research/review artifact modifications.

## Known uncertainties

- Account A was account-wide usage-blocked before producing its planned SBLA-
  011 advisory. Codex completed the implementation; Account B remains clean for
  the required independent review.
- There is intentionally no public scientific MDX file or live scientific page,
  so the repository-level MDX scan reports zero files. The AST behavior is
  exercised directly by five focused tests, and the components compile during
  Astro typecheck/build. Publishing a real route requires owner-approved exact
  checksums and an immutable manifest.
- The approval-manifest schema and graph rules are implemented but the accepted
  slice has no manifest by design. Account B should add adversarial scratch
  probes for missing, mismatched, duplicate-current, cyclic, and ineligible
  manifests without modifying the candidate.
- The certainty lint remains a deterministic English regex gate, not a semantic
  model. Account B should probe whether the bounded exceptions permit a generic
  overclaim with superficially similar wording.
- Source status checks are record-based and current through the recorded due
  dates; live network acquisition remains owned by later operations work.

## Files created or modified

- Production data: all 23 `content/claims/*.json`, all 68
  `content/sources/*.json`, `content/muscles/pectoralis-major.json`, and both
  `content/exercises/*.json` records.
- Generated bundle: `public/data/evidence-graph.v1.json`.
- Commands: `scripts/content/lint-mdx.mjs`,
  `scripts/content/promote-sbla-009.mjs`, `scripts/content/validate.mjs`,
  `scripts/graph/compile.mjs`, and `scripts/graph/validate.mjs`.
- Runtime/schema: `src/content.config.ts`, `src/content/.gitkeep`,
  `src/lib/content/mdx-lint.ts`, `src/lib/content/registry.ts`,
  `src/lib/content/schemas.ts`, `src/lib/content/validation.ts`, and
  `src/lib/graph/compiler.ts`.
- Components: `src/components/evidence/Claim.astro` and
  `src/components/evidence/ClaimGroup.astro`.
- Tests: `tests/unit/foundation-adapters.test.ts`,
  `tests/unit/sbla-011-graph-compiler.test.ts`, and
  `tests/unit/sbla-011-mdx-claim-lint.test.ts`.
- Package state: `package.json` and `pnpm-lock.yaml`.
- Handoff: `reviews/releases/SBLA-011-handoff.md`.

## Required reviewer action

Account B must inspect the exact immutable candidate from the coordination
ledger and independently decide whether:

1. the promoted claim text/source links are exactly the R4-approved values;
2. all cited sources have faithful production metadata and valid current status;
3. the graph is deterministic, complete, and fail-closed on reference and
   manifest defects;
4. claim components cannot publicly render ineligible records and disclose
   mixed/contradictory evidence;
5. MDX factual prose and raw HTML cannot bypass the AST gate;
6. the added certainty-lint exceptions are narrowly bounded;
7. all SBLA-011 queue criteria pass without pre-empting owner publication or
   SBLA-012 design work.

The reviewer must rerun at least `pnpm evidence:status && pnpm verify`, inspect
the generated graph parity, perform adversarial scratch probes, and write only
the pre-claimed append-only review report.

## Acceptance criteria

- The exact review candidate changes only the bounded files listed above.
- Account B returns PASS with zero unresolved Critical and Important findings.
- `pnpm evidence:status && pnpm verify` passes from a clean checkout.
- The 23 claims, 68 sources, one muscle, and two exercises validate and compile
  to the committed 94-node/120-edge graph with no missing references.
- No unconstrained factual MDX or raw HTML passes the lint.
- No claim can render publicly without approved review/publication state,
  non-null owner approval, manifest ID, and checksum.
- No owner approval or publication eligibility is inferred from the R4 evidence
  review.
