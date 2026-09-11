# Handoff: SBLA-007 — Evidence schemas and validators

**Status:** Replacement immutable builder candidate pending a fresh independent
Account-B review.
This is not acceptance and must not be merged to `main` unless the latest
Account-B report says PASS with zero unresolved Critical and Important findings.

## Objective

Satisfy master plan §18 task SBLA-007 by establishing one deterministic,
fail-closed Zod authority for common entity metadata and claim, source,
evidence-packet, review, and change records; expose the same authority through
Astro and the content, graph, and evidence command-line gates; prove the
contracts with adversarial fixtures; and document every public authoring error.

## Inputs and exact paths

- Repository: `https://github.com/FrankieBiz/science-lifting-atlas.git`
- Windows checkout:
  `C:\Users\frank.DESKTOP-8VOID7R\Documents\Codex\2026-09-09\clone-https-github-com-frankiebiz-science\work\science-lifting-atlas`
- Branch: `codex/SBLA-007-evidence-schemas`
- Accepted base: `bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`
- Transfer code checkpoint: `a7c5b24bbf6fc268afcb17fe43a8a48f6d7e6df6`
- Transfer checkpoint tree: `8d177ffa66e96465fdc75d6132a425b555d8be74`
- Verified cloned branch head before this continuation:
  `b6925f805e3b257129cf2d9127ac6d69c003d813`
- Superseded pre-advisory handoff candidate:
  `cabb387aaf7122b97e314ec7909c33a963d1ac71`
- Account-A remediation implementation:
  `d9e987ca8f717075f395b1e37813806e0c0a8e52`
- Remediation implementation tree: `33514da5b5e2d0f609edafe763db74c6f5792a10`
- Final implementation-plus-verification commit:
  `9a5f5eabba256b5a7e72c182ac0f98c0e3f1a846`
- Final implementation-plus-verification tree:
  `7d4c3a69cf0b120815b0d030e58bbe84782bfb06`
- Runtime: official Node.js `v24.20.0`, Corepack-prepared pnpm `11.24.0`
- Design:
  `docs/superpowers/specs/2026-09-09-sbla-007-evidence-schemas-design.md`
- Plan:
  `docs/superpowers/plans/2026-09-09-sbla-007-evidence-schemas.md`
- Transfer runbook: `docs/runbooks/windows-transfer-handoff.md`
- Accepted dependency handoff: `reviews/releases/SBLA-006-handoff.md`
- Passing dependency report: `reviews/releases/SBLA-006-r2.md`

The immutable review candidate is the commit that adds this handoff and closes
the builder claim. Its exact commit and tree must be recorded in the separate
pre-dispatch review claim before Account B receives the review prompt.

## Constraints

- Continue only SBLA-007. Do not add scientific claims, public pages, MDX claim
  rendering, live literature acquisition, graph generation, production media,
  or an anatomy interaction.
- SBLA-011 owns graph compilation and public bundles. Later evidence-monitoring
  work owns network acquisition. SBLA-013 owns performance-record semantics and
  production media.
- Preserve every earlier branch, commit, handoff, and review report. No existing
  report was edited.
- Codex owns implementation. Account A may advise but cannot claim repository
  inspection. Account B must independently audit the exact immutable candidate,
  must not repair it, and may write only the pre-claimed append-only report.
- Do not merge to `main` before Account B reports PASS with zero unresolved
  Critical and Important findings and the trusted role-path boundary passes.

## Work completed

1. Preserved the checkpoint's shared schemas, Astro collection registrations,
   safe JSON/YAML loader, graph validation, source-status validation, evidence
   fixtures, and bounded SBLA-006 guardrail follow-ups.
2. Added structured validation for invalid `SBLA_AS_OF`, missing authoritative
   status sources, future status-check dates, reversed status schedules,
   future/overdue claim reviews, and reversed review schedules.
3. Made every cited source of a published claim undergo adverse publication-
   status validation, including qualifying and contradictory links.
4. Expanded conservative language checks to catch additional categorical causal
   forms while permitting outcome-qualified comparative wording.
5. Added real subprocess coverage for invalid deterministic dates, empty-state
   success, malformed records, unsupported extensions, missing references, and
   retracted sources.
6. Added `docs/authoring/evidence-record-errors.md`, documenting all 27 public
   issue codes with rejection conditions, minimal examples, and exact repairs;
   a unit test keeps the guide and public codes synchronized.
7. Closed Windows-only verification gaps: correct URL/path expectations, the
   Windows Python launcher, benchmark import probing, deterministic filesystem-
   error classification, cross-platform Playwright environment injection, and
   LF/binary attributes for checksum-stable assets.
8. Added a direct pinned `cookie@2.0.1` development dependency so Astro's
   prerender build cannot resolve an unrelated CommonJS package from an ambient
   ancestor `node_modules` directory on Windows.
9. Retrieved the missing Account-A read-only advisory before Account B accessed
   the candidate. Added red tests and bounded corrections for the material
   findings: public relationships now require a published cited claim; language
   checks cover statement, plain-language, and qualifiers; common universal
   forms are rejected; directly negated causal wording is not treated as an
   overclaim; and outcome-qualified comparatives may contain intervening words.

## Account-A advisory disposition

Account A explicitly stated that it had no repository access and performed only
a self-contained desk review. Its response was assessed against the actual code:

- The alleged wall-clock determinism gap was not present: future dates are
  compared only with explicit `asOf`.
- The alleged missing supporting-source rule was not present: `claimSchema`
  requires at least one `supports` link for publication.
- Claim withdrawal already exists as `publicationState: withdrawn`; automated
  source-status acquisition and scheduling remain explicitly deferred.
- Global duplicate-ID detection was already implemented across claims, sources,
  and entity IDs. DOI, PMID, and PMCID canonical forms were already enforced.
- Fail-closed handling of corrected, expression-of-concern, and superseded
  sources is intentional pending manual reevaluation.
- The public-relationship unpublished-claim leak, negation false positive,
  comparative-clause false positive, common universal false negatives, and
  unlinted public claim fields were material and were repaired with tests.
- An explicit test now proves very-low disclosure remains independent of the
  general low-certainty calibration gate.
- URL equivalence, live status acquisition, scheduling, graph compilation, and
  approval-manifest byte binding remain owned by their later tasks; SBLA-007
  stores their normalized structural inputs and fails closed where specified.

## Decisions made

- Invalid `SBLA_AS_OF` is a structured command error rather than an uncaught
  exception. Both time-aware command adapters validate it before loading data.
- A source-status check is not auditable without `statusSource`; absence fails
  closed even when method and dates exist.
- A published claim is affected by adverse status on every cited source role,
  not only a `supports` link. Qualification and contradiction are still part of
  the publication record and cannot bypass retraction handling.
- Due dates are invalid on the boundary (`due <= asOf`), matching the existing
  source-status convention and making historical runs deterministic.
- Windows adaptations live primarily in tests and configuration. The accepted
  benchmark implementations and checksum-pinned evidence artifacts were not
  rewritten.
- Existing Markdown hardbreak bytes in the transfer handoff are preserved. A
  path-specific whitespace attribute makes the mandated accepted-base range
  check truthful without rewriting historical transfer content.
- Account B's first pre-dispatch claim was canceled without candidate access or
  a report when expired OAuth prevented dispatch and Account A's material
  advisory arrived. The clean superseded reviewer worktree and empty report path
  were preserved rather than rewritten or backdated.

## Tests/checks run and results

- Initial focused baseline:
  `pnpm vitest run tests/unit/evidence-schemas.test.ts tests/unit/content-validation.test.ts tests/unit/foundation-adapters.test.ts tests/unit/asset-decision.test.ts`
  — FAIL; 23 passed and one Windows path expectation failed because it expected
  POSIX `/tmp/Sci Atlas` instead of the correct Windows-resolved path.
- Adversarial adapter red run after adding tests — FAIL; 20 passed and seven new
  cases failed before their structured validation and portability support were
  implemented.
- Focused final run of the same four files — PASS; four files and 35 tests.
- Intermediate full `pnpm verify` — FAIL in inherited Windows-only asset tests:
  benchmark direct-execution detection used a POSIX file URL assumption,
  `python3` resolved to the Microsoft Store alias, and checkout line conversion
  changed checksum-pinned bytes. Tests/configuration and Git attributes were
  corrected without modifying benchmark implementations or pinned evidence.
- Intermediate `pnpm build` — FAIL because generated Astro prerender code
  resolved ambient ancestor `cookie@0.7.2` CommonJS. Adding direct pinned
  `cookie@2.0.1` removed the shadowing; the build then passed.
- Intermediate portability suite — FAIL; a 300-character missing path produced
  a normal 404 on Windows instead of the Linux-specific expected 500. The test
  now exercises the pure unexpected-error classifier with deterministic `EIO`.
- First `pnpm test:e2e` — FAIL because the web-server command used POSIX inline
  environment syntax. `playwright.config.ts` now supplies the variable through
  Playwright's cross-platform `env` field.
- Second `pnpm test:e2e` — FAIL before test execution because the fresh machine
  lacked Playwright Chromium. `pnpm exec playwright install chromium` installed
  pinned Chromium/headless-shell revision 1234.
- `pnpm format` — PASS; all tracked files unchanged after formatting.
- Final focused run — PASS; four files, 35 tests.
- Final `pnpm verify` — PASS: Prettier clean, ESLint clean, Astro check reports
  55 files with zero errors/warnings/hints, 16 unit files with 211 tests pass,
  content validation passes with zero records, graph validation passes with zero
  nodes, evidence status passes with zero sources as of 2026-09-10, production
  build emits one page, three portability files with 17 tests pass, foundation
  verification passes, and both asset gates pass.
- Final `pnpm test:e2e` — PASS; 1/1 Chromium production-build journey.
- `git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a`
  before the implementation commit — PASS with no output after the historical
  hardbreak path attribute was recorded.
- `git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a...HEAD`
  at implementation commit `a7bd6f2a45665f0d5bf94c57c77ed709b1774a95`
  — PASS with no output.
- Account-A remediation TDD red:
  `pnpm vitest run tests/unit/content-validation.test.ts` — FAIL as expected;
  nine new adversarial cases failed before implementation.
- Account-A remediation focused green:
  `pnpm vitest run tests/unit/content-validation.test.ts tests/unit/evidence-schemas.test.ts tests/unit/foundation-adapters.test.ts`
  — PASS; three files and 32 tests. A later independent-disclosure case raised
  the final unit total by one.
- Deep nested remediation-worktree `pnpm verify` — FAIL only in the inherited
  historical asset-receipt probe: the absolute Windows path plus the long
  `commit:path` argument exceeded legacy `MAX_PATH`, so Git reported the
  committed receipt absent. The same commit was fast-forwarded into the shorter
  canonical checkout before final verification; no asset implementation or
  evidence artifact was changed.
- First remediation full run in the short checkout — FAIL at Astro typecheck on
  a possibly undefined split result. The local type was corrected and formatted.
- Final remediation `pnpm verify` in the canonical checkout — PASS: Prettier,
  ESLint, and Astro check clean; 16 unit files and 222 tests pass; all content,
  graph, evidence, build, 17 portability, foundation, and asset gates pass.
- Final remediation `pnpm test:e2e` — PASS; 1/1 Chromium production-build
  journey.
- Final remediation accepted-base range `git diff --check` — PASS with no
  output.

## Known uncertainties

- Account A's advisory was based only on the self-contained summary and regexes
  supplied in chat. It did not inspect this checkout, run fixtures, or provide
  acceptance evidence. Its material observations were independently reproduced
  as red tests before remediation; summary-based false alarms are recorded above.
- The validators intentionally use conservative English-language regexes, not a
  scientific-language classifier. Account B should try adversarial punctuation,
  phrasing, and Unicode boundary cases.
- The content collections truthfully contain zero scientific records. The
  fixtures prove the contracts, not publication readiness of future content.
- Playwright Chromium revision 1234 was installed in the user's local Playwright
  cache; it is not a repository artifact.
- Independent Account-B acceptance is pending. This handoff is not
  self-acceptance.

## Files created or modified

Complete accepted-base candidate diff through the implementation commit:

- `.gitattributes`
- `docs/authoring/evidence-record-errors.md`
- `docs/runbooks/current-work.md`
- `docs/runbooks/windows-setup.md`
- `docs/runbooks/windows-transfer-handoff.md`
- `docs/superpowers/plans/2026-09-09-sbla-007-evidence-schemas.md`
- `docs/superpowers/specs/2026-09-09-sbla-007-evidence-schemas-design.md`
- `package.json`
- `playwright.config.ts`
- `pnpm-lock.yaml`
- `scripts/assets/decision.mjs`
- `scripts/content/validate.mjs`
- `scripts/evidence/status.mjs`
- `scripts/graph/validate.mjs`
- `scripts/portability/static-server.mjs`
- `src/content.config.ts`
- `src/lib/content/schemas.ts`
- `src/lib/content/validation.ts`
- `tests/fixtures/evidence-schemas/graph-cases.json`
- `tests/fixtures/evidence-schemas/records.invalid.json`
- `tests/fixtures/evidence-schemas/records.valid.json`
- `tests/fixtures/evidence-schemas/source-status-cases.json`
- `tests/integration/portability/static-server.test.ts`
- `tests/unit/asset-benchmark.test.ts`
- `tests/unit/asset-conversion.test.ts`
- `tests/unit/asset-decision.test.ts`
- `tests/unit/asset-full-benchmark.test.ts`
- `tests/unit/content-validation.test.ts`
- `tests/unit/evidence-schemas.test.ts`
- `tests/unit/foundation-adapters.test.ts`
- `reviews/releases/SBLA-007-handoff.md` (added by the immutable handoff commit,
  after the implementation commit identified above)

## Required reviewer action

Claude Review Account B must independently inspect the exact immutable handoff
candidate without repairing it and write only the pre-claimed
`reviews/releases/SBLA-007-r1.md`. Reproduce the candidate commit/tree, install
the exact lockfile with Node 24.20.0 and pnpm 11.24.0, run `pnpm verify` and
`pnpm test:e2e`, and adversarially test:

1. every schema family, lifecycle transition, identifier normalization, and
   record-discovery failure;
2. deterministic `asOf` validation and all due-date boundaries;
3. source roles, missing references, retraction/correction handling, and review
   freshness;
4. certainty-language false negatives and false positives;
5. structured issue paths, messages, remediation, and documentation coverage;
6. the SBLA-007 scope boundary and the exact restricted reviewer path.

The report must state PASS or FAIL, enumerate Critical, Important, and Minor
findings, and identify every unresolved Critical or Important finding. Account B
must not modify candidate files or propose its own work as accepted evidence.

## Acceptance criteria

SBLA-007 is complete only when all are independently checkable:

1. All five record families and common metadata validate through one shared Zod
   authority, with stable normalized identity and lifecycle invariants.
2. Content, graph, and evidence commands fail closed with structured actionable
   errors and remain truthful for the zero-record state.
3. Cross-record references, review dates, publication status, and certainty
   wording are deterministic against an explicit `asOf` date.
4. Every public issue code has a checked-in rejected condition, minimal failing
   example, and exact remediation.
5. No scientific content, graph output, network client, or later-task production
   work entered the candidate.
6. `pnpm verify`, Chromium E2E, and the accepted-base range whitespace check pass
   on the immutable candidate.
7. The latest independent Account-B report says PASS with zero unresolved
   Critical and zero unresolved Important findings, and its trusted exact-path
   boundary passes.

## Round 1 bounded remediation (2026-09-11)

Claude Review Account B returned FAIL in `reviews/releases/SBLA-007-r1.md` with
zero Critical, three Important, and ten Minor findings. Codex performed the one
bounded remediation allowed by the review stop rule on branch
`codex/SBLA-007-r1-remediation` in worktree
`C:\Users\frank.DESKTOP-8VOID7R\OneDrive\Documents\ChatGPT\SBLA`.

The remediation started from reviewed report commit
`6e299c44c465ff34e81ec4e1c492f9b9274b2289`. The implementation commit is
`88853733b83e1b5ad48bb953e21768474394687b`, with tree
`38c39ddbb148781caf09e5ab9d4d7851deb0e69e`.

### Finding disposition

- I-1 repaired: entity-history and evidence-packet timestamp ordering now
  compares parsed instants instead of lexicographic timestamp strings. Tests
  cover both directions of a second/fractional-second pair.
- I-2 repaired: `RecordGraph` now carries complete change records; the graph
  adapter passes them through, and published change records undergo the same
  future, reverse-schedule, and overdue review-date checks as claims.
- I-3 repaired: calibration is evaluated only in the causal verb's own clause,
  before the causal match. An unrelated later clause can no longer disable the
  gate, and a calendar expression such as `May 2020` is not treated as modal
  calibration.
- M-1 repaired: checksum presence uses `Object.hasOwn`, so inherited keys such
  as `constructor` cannot satisfy a review target.
- M-8 repaired: evidence-packet included-source IDs and change-record affected
  IDs must be unique.
- M-2 through M-7, M-9, and M-10 remain nonblocking and retain the destinations
  recorded in R1. They were not pulled into this bounded remediation.

### Remediation tests and checks

- Red run before implementation:
  `pnpm vitest run tests/unit/evidence-schemas.test.ts tests/unit/content-validation.test.ts`
  — FAIL as expected: six new assertions failed and 25 existing tests passed.
- Focused green run after implementation: the same command — PASS, two files
  and 31 tests.
- `pnpm verify` — PASS: formatting, lint, Astro/TypeScript diagnostics, 16 unit
  files with 228 tests, content/graph/evidence validation, production build,
  17 portability tests, foundation contract, and both asset gates.
- `pnpm test:e2e` — PASS: 1/1 Chromium production-build journey.
- `git diff --check 6e299c44c465ff34e81ec4e1c492f9b9274b2289...88853733b83e1b5ad48bb953e21768474394687b`
  — PASS with no output.

### Round 2 required reviewer action

Account B must create a fresh `claude-review/SBLA-007-r2-*` branch and worktree
from the immutable commit containing this section. Codex must first commit an
exact-path claim for only `reviews/releases/SBLA-007-r2.md`. Account B then
rechecks the complete SBLA-007 artifact, every R1 Important finding, M-1 and
M-8, and the unchanged acceptance rubric. Account B must not repair the
candidate. SBLA-007 passes only if R2 records zero unresolved Critical and zero
unresolved Important findings and the trusted role-boundary gate passes.

## Windows receipt portability remediation (2026-09-10)

Read-only verification of the earlier replacement candidate
`7a3111889c67527dfc4edc04b76055c124d26862` in its long nested reviewer
worktree exposed an inherited SBLA-005 test failure before any Account-B
dispatch or report write. The receipt probe passed a long
`<commit>:docs/licenses/bodyparts3d-conversion-baseline-receipt.json` argument
to `git show`; Windows Git interpreted that long argument as a filename and
failed with `Filename too long`, masking the test's intended tampered-receipt
assertion. The prior reviewer worktree remains clean at the superseded
candidate and no `SBLA-007-r1.md` report exists.

The bounded repair resolves the committed receipt to its blob ID with
`git rev-parse`, then reads the blob with `git cat-file blob <id>`. It changes
only `scripts/assets/blender/convert.py`; the existing strict-ancestor,
tamper, and genuine-receipt test reproduces the Windows failure red and passes
green after the repair. The implementation commit is
`da59b10b5c56193b397e2ea75388ec4df0fab748`, tree
`4f4740ea3b2211249aecbd82ee756c308395e14c`.

Because this Windows host has legacy executable-path limits, nested long
worktrees can also prevent esbuild from spawning even when repository code is
correct. The formal Account-B review must therefore use a short, recorded
Windows worktree path. Verification of the repair ran from
`C:\Users\frank.DESKTOP-8VOID7R\Documents\Codex\2026-09-09\clone-https-github-com-frankiebiz-science\work\s007v`:

- focused BodyParts3D conversion contract: 21/21 tests PASS;
- `pnpm verify`: PASS — 222 unit tests, 17 portability tests, zero Astro
  diagnostics, production build, foundation, and asset gates;
- `pnpm test:e2e`: PASS — 1/1 Chromium production journey;
- `git diff --check bbeddc06b53962a8f76e4d0f5d0871e20fa4075a...da59b10b5c56193b397e2ea75388ec4df0fab748`:
  PASS with no output.

This repair is a Windows execution guardrail required to make the already
required candidate verification reproducible. It adds no scientific content,
graph output, network client, production media, or other later-task work.
The next reviewer claim must pin the immutable handoff commit that contains
this section, use the short path, and remain restricted to its one append-only
report file.

## Exact provenance remediation (2026-09-10)

A later Codex self-audit found two local-invariant gaps before Account B was
dispatched and before any report existed. Review records allowed duplicate
`targetIds` and checksum entries for IDs absent from `targetIds`, so the schema
did not guarantee the design's exact reviewed-target/checksum binding. Evidence
packets also allowed one source to appear in both `includedSourceIds` and
`exclusions`, making a screening decision internally contradictory. Packet
`updatedAt` could additionally precede `createdAt`, unlike the common history
contract.

The prior short-path review claim was canceled while its worktree was still
clean at `4e14a6a6cf257f5f5517780f538f195f911abfea`; no Account-B prompt was sent
and no `SBLA-007-r1.md` existed. Four adversarial fixture mutations were added
first. The focused schema test failed red on the first duplicate-target case,
then passed after the refinements were implemented.

The bounded repair now requires unique review target IDs, an exact checksum-key
subset with no unreviewed target entries (while retaining the existing missing-
checksum check), disjoint included/excluded evidence decisions, and monotonic
evidence-packet creation/update timestamps. The implementation commit is
`f8385841c3429a0e8cb9508f13a36f46a2dfbc1a`, tree
`7618592a537c449e72254024727bc672edd31770`.

Verification from the short Windows remediation checkout:

- focused schema red: FAIL as expected on duplicate review targets;
- focused schema green: 4/4 tests PASS, including all invalid fixture cases;
- `pnpm verify`: PASS — 222 unit tests, 17 portability tests, zero Astro
  diagnostics, production build, foundation, and asset gates;
- `pnpm test:e2e`: PASS — 1/1 Chromium production journey;
- accepted-base and working-tree `git diff --check`: PASS with no output.

The immutable review candidate is the commit that adds this section. A fresh
Account-B claim must record that exact commit and tree, use a short Windows
worktree path, and permit only `reviews/releases/SBLA-007-r1.md`.

## Round 2 bounded remediation (2026-09-11)

Account B's complete-artifact R2 report at
`reviews/releases/SBLA-007-r2.md` returned FAIL with zero Critical, one
Important, and nine nonblocking Minor findings. I-1, I-2, M-1, and M-8 were
confirmed repaired. I-3 remained open for lowercase and punctuated calendar
uses of `may`, and R2 recorded M-11 for legitimate calibration following the
causal verb in the same clause.

Codex opened `codex/SBLA-007-r2-remediation` from reviewer commit
`6a55a954df8735c162568869e7d75429b4006d2f`. Account B subsequently authored
the mechanical Prettier correction at
`53d1537dc5a99ccdb8b16e61c832b29d18959197`; Codex replayed that report-only
commit as `b01c756a7c8c7d1058179be506b69a36ffcced7d` before freezing the repair.
The final formatted R2 report SHA-256 is
`f830212097fb8273a748f0927cbdacc4d97002180c19ce9db1abe5f7e953d897`.

Five new regression cases were added before implementation. The focused test
failed red on all five: lowercase `may 2020`, `May, 2020`, `May 3, 2020`, an
`and`-joined trailing hedge, and a comma-joined `limited evidence` hedge.

The repair now identifies the complete punctuation-bounded clause containing
each causal match and evaluates calibration across that clause. `may` and
`might` are rejected as calibration when their following text introduces a
numeric date, rather than relying on one capitalized date spelling. Genuine
pre-verb and trailing same-clause calibration remains accepted; calibration in
a different `.;!?`-bounded clause cannot excuse the causal statement.

The implementation commit is
`fb6a30bf73e339d810e83da09be009c5d1151259`, tree
`2c75b9d193204e74c504b2cf6f74f750cacdad3f`.

Checks run from the saved Windows Codex worktree:

- Red: `pnpm vitest run tests/unit/content-validation.test.ts` — FAIL as
  expected, five new cases failed and 23 existing tests passed.
- Focused green:
  `pnpm vitest run tests/unit/content-validation.test.ts tests/unit/evidence-schemas.test.ts`
  — PASS, 36/36 tests.
- `pnpm verify` — PASS: Prettier and ESLint clean, zero Astro/TypeScript
  diagnostics, 16 unit files with 233 tests, content/graph/evidence validation,
  production build, 17 portability tests, foundation contract, and both asset
  gates.
- `pnpm test:e2e` — PASS, 1/1 Chromium production-build journey.
- `git diff --check 6a55a954df8735c162568869e7d75429b4006d2f`
  — PASS with no output.

A fresh Account-B complete-artifact recheck must start from the immutable
handoff commit containing this section, use a new `claude-review/SBLA-007-r3-*`
branch/worktree, and write only `reviews/releases/SBLA-007-r3.md`. Account B
must recheck all prior Important findings, M-11, the complete acceptance rubric,
and general regressions without repairing the candidate. SBLA-007 passes only
with zero unresolved Critical and Important findings plus the trusted exact-path
boundary.
