# Interactive Muscle Guides Implementation Plan

> **For agentic workers:** Use the executing-plans skill to implement this plan task by task. Preserve the existing scientific publication gates.

**Goal:** Make selecting a muscle the start of a beautiful, useful, source-backed learning experience.

**Architecture:** Keep Astro static content and the existing Three.js explorer. A separate guide component consumes a muscle-selection event and presents canonical claim records through the existing evidence renderer. Detailed unpublished guides are rendered only in the explicitly enabled local review build.

**Tech Stack:** Astro, TypeScript, Three.js, Playwright, existing validated JSON evidence records.

## Product direction

A calm, generous layout: body above, selected muscle guide beneath, readable typography, warm neutral surfaces and one rose accent. Progressive disclosure provides depth without a wall of text. Controls must work with keyboard, touch, reduced motion, failed WebGL, and narrow screens.

### Ideas ranked by value

1. **Muscle guide:** Overview, Movement, Training, Injury context. Every meaningful claim has certainty, applicability, qualifiers and its exact source trail. Start with pectoralis major, whose reviewed draft records already exist.
2. **Focus and connections:** Focus selected anatomy; show related muscles and exercises from validated graph edges. Never infer attachment landmarks from mesh names.
3. **Movement lab:** Play/pause and scrub a validated joint movement; explain agonists and limits. Requires a rigged model and independently checked biomechanics. The present model is static, so animation is a separate asset task.
4. **Exercise comparison:** Compare study populations, interventions, outcomes and uncertainty side by side. Avoid invented activation percentages or universal best-exercise rankings.
5. **Learning mode:** Anatomy identification quizzes and guided tours based exclusively on published records; optional local bookmarks and shareable selection URLs.
6. **Coverage expansion:** Add muscles through the research → claim review → integration → owner publication sequence, measured by complete user journeys rather than a raw muscle count.

## Accuracy and injury content

Use existing atomic claims without rewriting their meaning. Show certainty close to the statement and preserve contradictory/qualifying evidence. Do not equate EMG with growth. Case reports establish reported injury context, not how common injuries are. No diagnosis, treatment, rehab plans or symptom triage in this scope. New injury topics need an evidence packet before UI copy. Never label an AI review clinician review. Keep source review dates in canonical records; freshness and retraction checks remain release gates.

## First build: exact responsibilities

- `src/components/sbla-013/MuscleGuide.astro`: local-only scientific guide, accessible section switcher, truthful missing-guide state. Render canonical `PrototypeClaim` cards once each, using `./sources/` homepage links.
- `src/components/sbla-013/AnatomyExplorer.astro`: render the guide and dispatch `atlas:muscle-selected` with `{ id, name }` for both list and mesh selection.
- `src/styles/muscle-guide.css`: responsive guide layout, visible focus, hidden-state handling, no motion dependency.
- `tests/prototype/muscle-guide.spec.ts`: source disclosure, keyboard section navigation, selection synchronization, no-JS access and narrow viewport.
- `tests/e2e/anatomy-explorer.spec.ts`: production HTML must contain no unpublished guide claims.
- `reviews/releases/SBLA-013-muscle-guide-handoff.md`: actual verification, remaining work and review status.

### Task 1: Test the learning journey

- [x] Add a prototype test that selects Injury context, opens evidence, verifies source links and selects Biceps brachii; pectoral content must disappear.
- [x] Add keyboard, no-JS and mobile checks. Native section links become tabs only after JavaScript enhancement; all sections remain readable without JavaScript.
- [x] Assert production response HTML excludes the guide's claim IDs.
- [x] Run `pnpm test:prototype --grep "muscle guide"` and observe failure before implementation.

### Task 2: Build the first guide

- [x] Reuse approved unpublished claims: attachments/portions for overview, adduction for movement, chest-resistance-training hypertrophy and surface-EMG limitation for training, bench-press rupture for injury context.
- [x] Put a visible local-review label above the guide. Injury context includes a visible reminder that reports cannot establish frequency.
- [x] Implement list/mesh event synchronization. Preserve current section on changing muscles; show no stale pectoral facts when another muscle is selected.
- [x] Implement arrow/Home/End keyboard navigation and linked tab/panel IDs; focus must remain visible.
- [x] Keep all scientific content absent from production HTML, not merely hidden by CSS.

### Task 3: Verify and commit

- [x] Run pinned Node v24.20.0 / pnpm 11.24.0; format changed files.
- [x] Run `pnpm verify`, `pnpm test:e2e`, `pnpm test:prototype`.
- [x] Inspect the local preview, then record results and limits in the handoff.
- [x] Commit and push the branch as requested. Do not self-accept or merge the milestone.

## Subsequent delivery order and completion criteria

**Next:** camera focus, selected-muscle URL state, source-backed exercise cards, and navigation from guide to muscle page. Completion: selection survives reload; invalid IDs fall back safely; controls fit mobile; evidence links resolve.

**Then:** validate asset coverage and rigging feasibility, benchmark physical mobile devices, add more independently reviewed muscle guides. Completion: every selectable region has explicit coverage status, verified mesh mapping, credible content, measured performance, and usable fallback.

**Then:** movement lab and evidence comparisons. Completion: animations are labeled schematic where appropriate, pose/range correctness has recorded review, comparisons preserve outcome and population distinctions, reduced motion has static equivalents.

**Release:** zero broken evidence links or leaked unpublished claims; passing content/graph/freshness checks; keyboard and screen-reader review; touch and real-device model performance; independent acceptance and owner publication decision. Participant recruitment is not a release gate, per the owner's earlier decision.

## Deliberate first-build limits

This iteration implements the guide foundation and one substantive muscle example. It does not fabricate guides for the other 22 mapped groups, certify model accuracy, animate unrigged meshes, or publish currently unpublished science. Camera focus and movement animation remain explicit follow-ups.

## First-build status — 2026-09-24

Implemented and checked. Advisory plan review identified publication gating, exact injury wording, initial selection and hidden-panel focus risks; the implementation addresses each. Automated verification passed; independent milestone acceptance remains pending. The roadmap above remains future work.
