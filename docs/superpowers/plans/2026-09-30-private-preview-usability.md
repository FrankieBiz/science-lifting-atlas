# Private Preview Usability Implementation Plan

> **For agentic workers:** Follow the repository claim and handoff rules. This is owner-directed `PREVIEW-UX-001`, an improvement to the private prototype at `b5d11a0`. It does not accept SBLA-013 or publish evidence to a public audience.

**Goal:** Make every visible prompt in the private preview describe the current selection and lead to the action it names.

**Architecture:** Keep the model's 23 selection targets distinct from the single available Pectoralis evidence guide. The explorer owns the selected structure; the guide switches between Pectoralis evidence and a selected-structure empty state. Keep unpublished claims and existing publication boundaries unchanged.

**Tech Stack:** Astro, TypeScript, Playwright, pnpm 11.24.0, Node.js 24.20.0.

---

## Evidence and design

- Reproduced the reported Gastrocnemius path on the static private-preview build at desktop and mobile sizes. The guide heading changes to Gastrocnemius but its introduction still promises research and its fallback sends the visitor to Pectoralis. The sidebar also keeps “Open learning guide” available for a muscle without a guide.
- The homepage’s “Explore the atlas” button goes directly to the Pectoralis record while the body explorer is on the same page. The methodology still says a distinct Claude account reviews work, contrary to accepted ADR 0009.
- The 73-page static preview has no broken internal links or fragment destinations. Desktop and 390px mobile routes have no horizontal overflow in the sampled main journey. Claim records and scientific wording do not need edits for this usability repair.

## Work steps

1. Add browser tests that select Gastrocnemius and another unsupported muscle, expect selected-specific model guidance, no Pectoralis-only promise or guide action in that context, and a working return to the Pectoralis guide. Verify these tests fail for the current copy/behavior.
2. Make the guide intro, status badge, and empty state follow the selected muscle. Keep the Pectoralis evidence guide available when Pectoralis is selected; do not frame it as Gastrocnemius information.
3. Make sidebar guide/evidence actions conditional on the Pectoralis selection. Give the unavailable-selection state a clear next action in the model without implying a research guide exists.
4. Test that the homepage’s primary CTA reaches the body explorer, and align methodology wording with a fresh, independent nonauthor reviewer session. Verify the tests fail before changing the page copy.
5. Run focused browser journeys at desktop, 390px and 320px, keyboard and no-JavaScript fallbacks, the internal-link audit, `pnpm test:prototype`, and pinned `pnpm verify`. Inspect before/after screenshots for clarity and reflow.
6. Generate a clean, exact-commit handoff. Keep the result on this isolated private-preview branch. Redeployment preserves owner-private access and never represents this prototype as approved public science.
