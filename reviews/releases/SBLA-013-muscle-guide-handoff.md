# Handoff: SBLA-013 owner-directed muscle guide follow-up

## Objective

Deliver the owner's requested Markdown quality roadmap and begin building richer interactive muscle learning, continuing the existing owner-directed SBLA-013 preview scope.

## Inputs and exact paths

Base `6191e5d`, branch `codex/SBLA-013-bodyparts3d-first-slice`, worktree `.worktrees/sbla-013-bodyparts3d-first-slice`. Existing explorer handoff: `reviews/releases/SBLA-013-explorer-handoff.md`. Canonical claims in `content/claims/`; existing `PrototypeClaim.astro` and prototype publication classifier reused.

## Constraints

No scientific claim creation or approval, no lifecycle changes, no milestone self-acceptance. Science guide is explicitly local-review-only. This is an owner-directed follow-up, not a claim that the production anatomy milestone is accepted.

## Work completed

Markdown product roadmap and sequenced implementation plan. Pectoralis guide with Overview, Movement, Training and Injury context. Six existing claims retain certainty and complete evidence disclosures. List and mesh selection share one event path; other muscles show a truthful unavailable state. Accessible keyboard tabs, no-JS readable sections, narrow-screen layout and focus recovery are included.

## Decisions made

Reuse canonical claims rather than create medical copy. Display existing injury qualifiers outside disclosure, with bench-press-specific context. Build a separate guide component to keep presentation out of the renderer. Scientific content remains absent from normal production HTML. Initial guide state reads the selected muscle to avoid event-registration races.

## Tests/checks run and results

- Initial two guide tests failed because the guide did not exist, as expected.
- First implemented run: 10 passed, one test failed on ambiguous matching of a repeated qualifier; selector narrowed.
- Source-link test extension initially failed due to a missing request fixture binding; corrected.
- `pnpm verify`: PASS (325 unit tests plus accessibility, visual, graph, content, evidence, build, portability, foundation and asset checks).
- `pnpm test:e2e`: 8 passed, including production HTML exclusion.
- Final `pnpm test:prototype`: 11 passed, including source HTTP resolution, selection, keyboard, 320px reflow and no-JS guide.
- Live in-app browser: local homepage reloaded; Injury context selected; visible label, caveats and responsive layout inspected.

## Known uncertainties

Only pectoralis has a detailed scientific guide. Other mapped muscles have identity and model interaction only. Camera focus, rigged movement animation, exercise comparison and shared selection URLs are planned follow-ups. Physical mobile GPU performance and manual screen-reader review remain unmeasured. Canonical records remain unpublished pending their existing owner gate.

## Files created or modified

- `docs/runbooks/current-work.md`
- `docs/superpowers/plans/2026-09-24-interactive-muscle-guides.md`
- `src/components/sbla-013/AnatomyExplorer.astro`
- `src/components/sbla-013/MuscleGuide.astro`
- `src/styles/muscle-guide.css`
- `tests/prototype/muscle-guide.spec.ts`
- `tests/e2e/anatomy-explorer.spec.ts`
- `reviews/releases/SBLA-013-muscle-guide-handoff.md`

## Required reviewer action

Independently review final branch diff for faithful claim rendering, local-only publication behavior, selection synchronization and accessible interactions. Advisory plan review is not formal milestone acceptance. No merge or deployment performed.

## Acceptance criteria

Selecting a muscle updates the guide without stale claims. Pectoralis has four accessible sections and source links that resolve. Injury frequency is not inferred from case reports. All sections are readable without JavaScript. Normal build excludes unpublished guide content. Plan, tests and handoff are committed with the implementation.
