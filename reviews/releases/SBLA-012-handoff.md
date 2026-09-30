# Handoff: SBLA-012 — Realistic static atlas and visual redesign

**Status:** Builder candidate ready for independent Claude Review, followed by
owner visual approval. No acceptance or main-branch merge is claimed.

## Objective

Deliver the home, muscle, exercise, source, and methodology archetypes in
master plan §18 SBLA-012. Apply the owner's 2026-09-24 Apple-inspired visual
direction and replace the participant gate with the explicitly authorized
static acceptance path.

## Inputs and exact paths

- Repository: `https://github.com/FrankieBiz/science-lifting-atlas.git`
- Branch: `codex/SBLA-012-realistic-static-slice`
- Worktree: `.worktrees/sbla-012-realistic-static-slice`
- Reviewed SBLA-011 dependency: `a03eeefd9298115452a50754aec5a41a510cc7be` (R4 PASS).
- Current claim base: `e848320e07253848808dd6acfcf1b08fec9270bb`.
- Redesign input: `06e7324abf5a74270dd3d575040997e274a399f9`.
- Tested implementation: `ebfc4d432cc16011b6c6a13c02c5c6b6f964c834`.
- Acceptance record: `docs/product/usability/SBLA-012-static-acceptance.md`.
- Owner decisions: `docs/product/gates/SBLA-012-usability-decision.md` and
  `docs/product/design/SBLA-012-anatomy-production-hold.md`.

The immutable review candidate is the commit containing this handoff and the
closed ledger row. Record its full hash in the separate review claim before
formal dispatch. This document follows the implementation with documentation
only.

## Constraints

Scientific records, extraction wording, source locators, publication approval,
and the production anatomy hold are preserved. Normal builds must omit
unpublished evidence routes and graph data. The local prototype is for review
only and must not be deployed. SBLA-013 through SBLA-015 remain on hold.

## Work completed

- Five consistent static page archetypes and shared evidence components.
- A white/fog/graphite design system with native system typography, blue
  actions, restrained rose category labels, and a compact translucent header.
- Homepage anatomy plate, direct collection navigation, evidence trail, and
  methodology explanation. The existing attributed evaluation image is reused.
- Shared record opening sections with working takeaway and evidence anchors.
- Source metadata, contribution, qualifier, and exact-locator presentation
  integrated into the shared responsive stylesheet.
- Responsive phone and tablet layouts, focus indicators, reduced motion, and
  functional native disclosures without client JavaScript.
- Local-only unpublished routes with visible warnings and noindex metadata;
  ordinary builds preserve the publication boundary.
- An owner-authorized static acceptance record and reproducible browser suite.

## Decisions made

The owner authorized a substantial visual redesign. The updated visual
philosophy supersedes the earlier art-direction image and editorial styling.
The dramatic anatomy plate is balanced with quiet reading surfaces. Direct
anchors replace decorative record badges to make the opening section useful.
Tablet layouts stack before the image's intrinsic proportions can force a
horizontal overflow. Scientific certainty is communicated in words as well as
color. No new client runtime, external font, or scientific content was added
for this redesign.

## Tests/checks run and results

Runtime: Node.js `v24.20.0`, pnpm `11.24.0`.

- `pnpm verify`: PASS — 323 unit tests, 5 accessibility contract checks,
  4 visual contract checks, 17 portability checks, lint/typecheck, all
  content/evidence/graph/foundation/asset gates, and a 2-route normal build.
- `pnpm test:e2e`: PASS — 5 Chromium checks, including ordinary-build route
  and public-graph exclusion for unpublished evidence.
- `pnpm test:prototype`: PASS — 6 Chromium checks with JavaScript disabled;
  local build generates 73 routes. Covers evidence/source traversal, share
  routes, methodology, keyboard entry, mobile reflow, reduced motion,
  publication warnings/noindex, record anchors, and five phone/tablet widths.
- `git diff --check`: PASS before implementation commit.
- Builder visual inspection: all five archetypes on desktop and phone;
  additional 320 px narrow layouts and 768 px tablet homepage inspection.

Failures and repairs: the new tablet regression test initially found 781 px
of document width at a 705 px viewport. The responsive hero fix passes the
complete prototype suite. An obsolete meta-description expectation and ledger
formatting were repaired before the final successful verification run.
A read-only technical diff preflight identified the tablet issue; it is not
formal independent acceptance.

## Known uncertainties

Independent Claude acceptance and owner visual approval remain pending.
Automated contract tests are not pixel screenshot tests. Browser inspection
used Chromium and does not establish cross-browser or assistive-technology
coverage. No participant sessions occurred, and no human-comprehension result
is claimed. Anatomy media and movement schematics remain static evaluation
material. Production provider measurements and subsequent held 3D work are
not authorized by this handoff.

## Files created or modified

The following bounds the full SBLA-012 branch diff from the reviewed SBLA-011
dependency; scientific content records are unchanged:

- `AGENTS.md`
- `README.md`
- `astro.config.mjs`
- `docs/product/design/SBLA-012-anatomy-production-hold.md`
- `docs/product/design/SBLA-012-art-direction.png`
- `docs/product/design/SBLA-012-visual-philosophy.md`
- `docs/product/gates/SBLA-012-usability-decision.md`
- `docs/product/master-plan.md`
- `docs/product/usability/SBLA-012-formative-plan.md`
- `docs/product/usability/SBLA-012-formative-report.md`
- `docs/product/usability/SBLA-012-static-acceptance.md`
- `docs/runbooks/current-work.md`
- `package.json`
- `playwright.prototype.config.ts`
- `public/data/evidence-graph.v1.json`
- `reviews/releases/SBLA-012-handoff.md`
- `scripts/graph/compile.mjs`
- `scripts/graph/validate.mjs`
- `scripts/portability/rewrite-relative-assets.mjs`
- `src/components/sbla-012/EntitySpecimen.astro`
- `src/components/sbla-012/EvidenceRail.astro`
- `src/components/sbla-012/PrototypeBanner.astro`
- `src/components/sbla-012/PrototypeClaim.astro`
- `src/components/sbla-012/SiteHeader.astro`
- `src/layouts/AtlasLayout.astro`
- `src/lib/graph/compiler.ts`
- `src/lib/presentation/sbla012.ts`
- `src/pages/exercises/[slug].astro`
- `src/pages/index.astro`
- `src/pages/methodology.astro`
- `src/pages/muscles/[slug].astro`
- `src/pages/sources/[sourceId].astro`
- `src/styles/global.css`
- `src/styles/tokens.css`
- `tests/accessibility/sbla-012.test.ts`
- `tests/e2e/foundation.spec.ts`
- `tests/e2e/sbla-012.spec.ts`
- `tests/integration/portability.test.ts`
- `tests/prototype/sbla-012.spec.ts`
- `tests/unit/sbla-011-graph-compiler.test.ts`
- `tests/unit/sbla-012-presentation.test.ts`
- `tests/visual/sbla-012.test.ts`

## Required reviewer action

Audit the exact candidate against master plan §18 SBLA-012 and the static
acceptance record. Reproduce normal and prototype builds, inspect all five
archetypes, verify source/qualifier visibility and the publication boundary,
and evaluate keyboard, mobile, reduced-motion, and stable-link behavior.
Record an independent append-only report in the exact path claimed by Codex.
Do not repair the artifact. A passing report must precede owner approval of the
visual direction and integration. This handoff does not waive either step.

## Acceptance criteria

1. All required commands pass on the pinned runtime.
2. Find, understand, verify, share, and methodology journeys work without
   JavaScript and preserve source locators and uncertainty.
3. Keyboard entry, visible focus, reduced motion, and phone/tablet reflow work.
4. Normal builds cannot expose unpublished evidence; review routes clearly
   disclose their status and prohibit indexing.
5. No unresolved Critical or Important independent-review findings remain.
6. The owner approves the visual direction after independent review passes.
7. Production anatomy remains on hold until a separate owner decision.
