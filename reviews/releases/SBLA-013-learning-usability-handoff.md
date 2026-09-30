# Handoff: SBLA-013 learning usability checkpoint

## Objective

Review the project page and make existing anatomy and science content easier to learn interactively, following the owner's 2026-09-25 request and existing learning roadmap.

## Inputs and exact paths

Base `25e8f0a`, branch `codex/SBLA-013-bodyparts3d-first-slice`, worktree `.worktrees/sbla-013-bodyparts3d-first-slice`. Design/review: `docs/superpowers/specs/2026-09-25-learning-usability-design.md`. Reviewed homepage, explorer, muscle, exercise, source and methodology templates, canonical claims, and existing tests.

## Constraints

Existing publication gates remain intact. Knowledge checks use local-review prompt copy with canonical claim statements or qualifiers as explanations. No new scientific records, diagnosis, injury frequency estimates, animation claims, or formal milestone acceptance. User explicitly requested commits even for unfinished work.

## Work completed

- Actionable public homepage entry to the body explorer while keeping evidence status visible.
- Camera focus isolates selected geometry and fits its bounding sphere; subsequent selections refocus, reset restores full-body viewing, fallback disables controls.
- Explorer instructions and direct learning-guide link.
- Guide section position, previous/next navigation with panel focus, final full-record link and usable return action from missing guides that clears the muscle filter.
- Four optional knowledge checks on attachments, leverage, surface measurement limits and injury-report interpretation. Answer feedback is textual and explains using exact canonical records. Shared claim renderer brings them to homepage and detailed records. No-JS answer disclosure remains available.
- Replaced the shared bench-like exercise illustration with canonical scope text so the cable fly no longer displays a misleading bench diagram.

## Decisions made

Integrated learning into existing claims instead of duplicating content into a course. Section position is not described as mastery. No persistent learning tracking. Advisory spec review highlighted prompt traceability, no-JS access, focus synchronization and visibility of deep structures; implementation uses claim-keyed prompts, exact feedback, native disclosure, focused panels and isolation.

## Tests/checks run and results

Pinned Node v24.20.0 with existing installed tools. Package-manager invocations stalled under the restricted environment, so direct installed binaries were used; `pnpm verify` is NOT claimed as passing.

- ESLint: PASS.
- Astro check: 100 files, 0 errors, 0 warnings, 0 hints.
- Vitest unit/accessibility/visual suites: 28 files, 335 tests PASS.
- Production build: PASS; explicit HTML check confirms unpublished learning guide/check content absent.
- Prototype build: PASS, 73 pages.
- Generated HTML audit: 73 pages, 789 internal links, zero missing targets/fragments or duplicate IDs.
- Content promotion check, content validation, MDX lint, graph validation, research integrity, stored evidence status: PASS. 68 source records checked; no live retraction search performed.
- Foundation contract: PASS.
- Portability suite: 6 tests passed, 11 skipped across two failed setup suites because `listen EPERM` blocks localhost server binding.
- Local Python preview server: blocked with `PermissionError: Operation not permitted` on bind. Browser suite invocation could not progress through its package-manager web-server command and was stopped. New Playwright scenarios are written but NOT verified passing. No live screenshot or browser interaction is claimed.
- Initial red test attempt also stalled at the package-manager invocation; only the final direct unit execution completed.

## Known uncertainties

This is a committed implementation checkpoint, not a release-ready acceptance. Live keyboard, camera framing, mobile layout and answer interactions need Playwright/manual verification in a server-enabled session. Physical-device GPU and screen-reader checks remain pending. Detailed science still covers only pectoralis and the existing exercise slice; the other mapped groups need researched content. The model remains static, without validated movement animation.

## Files created or modified

- `docs/runbooks/current-work.md`
- `docs/superpowers/specs/2026-09-25-learning-usability-design.md`
- `reviews/releases/SBLA-013-learning-usability-handoff.md`
- `src/components/sbla-013/MuscleGuide.astro`
- `src/components/sbla-013/AnatomyExplorer.astro`
- `src/components/sbla-013/LearningCheck.astro`
- `src/lib/presentation/learning-checks.ts`
- `src/styles/muscle-guide.css`
- `src/components/sbla-012/PrototypeClaim.astro`
- `src/components/sbla-012/EntitySpecimen.astro`
- `src/pages/index.astro`
- `src/pages/exercises/[slug].astro`
- `tests/unit/learning-checks.test.ts`
- `tests/prototype/learning-usability.spec.ts`
- `tests/e2e/anatomy-explorer.spec.ts`

## Required reviewer action

Run `pnpm verify`, `pnpm test:e2e`, and `pnpm test:prototype` under pinned runtime in a server-enabled environment. Inspect 320px/mobile and desktop layouts, focus/reset after selection changes, all four quiz answers, no-JS disclosures and publication exclusion. Independently inspect each question against its canonical claim before publication. No merge or deployment performed.

## Acceptance criteria

All above interactive scenarios pass in a browser, existing tests remain passing, publication stays fail-closed, and independent acceptance is recorded. These criteria are not yet fully satisfied because server-dependent verification is blocked.
