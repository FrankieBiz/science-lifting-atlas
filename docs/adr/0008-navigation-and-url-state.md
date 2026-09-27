# ADR 0008 — Navigation, URL state, and cross-entry journeys

- Status: Accepted
- Date: 2026-09-27
- Task: Pre-SBLA-012 scoping (navigation/IA review requested by the owner)

## Context

The repository currently has no navigable application: `src/pages/` contains
only the foundation status page (`index.astro`), and `src/layouts`,
`src/components`, and every `src/features/*` directory are empty placeholders.
Real navigation is scoped to **SBLA-012** ("design tokens and realistic
home/muscle/exercise/source/methodology archetypes; small formative usability
report"), which is next in the master-plan §18 queue and not yet claimed.

Before SBLA-012 starts, this ADR reviews the navigation model that master plan
§5 (information architecture and core user journeys) and §6 (page
specifications) already describe, to find mechanics that are underspecified in
a way that would cause inconsistent implementation or a confusing back-button
experience. §5.2 already requires that "selection creates a URL state so the
view can be shared and restored" — the gaps below are about *which*
interactions create that state and how pages that are reachable from more than
one entry point present themselves consistently.

Seven concrete gaps were found:

1. §5.2's drawer → full-page journey and §6.2's "evidence drawer/source" step
   never say whether opening a drawer (anatomy selection summary, evidence
   peek) pushes browser history or is ephemeral UI state. Without a decision,
   the browser Back button's behavior is implementation-defined per component
   author, which is the single most common source of "navigation feels
   broken" complaints in usability testing.
2. A muscle page is reachable from the 3D explorer (§5.2), the Muscles index
   (§5.1), and an exercise page's "target map" (§5.3/§6.4). No section says
   what breadcrumb ancestry the page shows when reached from a different
   parent each time, or on cold entry.
3. §5.1 lists seven top-level destinations (Explore Body, Muscles, Exercises,
   Compare, Evidence, Learn, Search) plus §6.2's "global navigation, search,
   and share/reset controls" bar, while §6.1 asks for "minimal navigation" on
   the home page. No section defines how this collapses below a mobile
   breakpoint, or whether Share/Reset are page-scoped or site-wide chrome.
4. §6.4 item 11 lists "comparison links" on an exercise page, and §5.4's coach
   journey starts fresh at Compare with both slots empty. Nothing says whether
   a comparison link from a detail page pre-fills that entity into Compare.
5. §5.2 ends at an "evidence drawer/source," while §6.6 describes a full
   standalone source page with complete bibliographic metadata. It is not
   specified whether these are the same navigation (leaving the muscle/exercise
   page) or a two-tier pattern (inline peek, then an explicit action to the
   full page) — which materially changes whether checking a citation costs the
   user their anatomy/exercise context, contrary to Principle 1 ("Evidence is
   a visible product feature... understandable without opening a methodology
   paper").
6. §5.2–§5.5 all narrate journeys that *start* at Landing or a top-level nav
   destination. None describes the chrome/orientation shown to a visitor who
   lands directly on a detail page from a search engine or a shared deep
   link — the entry point §4.1's "deep links" commitment and §3.3's exploration
   metric ("detail-page sessions that follow at least one related entity
   ≥35%") both depend on.
7. §5.1's "Learn" item bundles methodology, glossary, and "how to read the
   evidence" — three separate record/page types per §4.1 — without saying
   whether it is a dropdown/mega-menu or a plain index page.

## Decision

Resolve each gap as follows. SBLA-012 must implement these defaults unless a
later ADR supersedes them.

1. **URL state for every user-perceived navigation step, including drawers.**
   Opening the anatomy selection drawer, the evidence peek drawer (see #5),
   and navigating to a full page are each a distinct history entry (query
   param or path segment, e.g. `/explore?region=chest&muscle=pectoralis-major`,
   `?evidence=<claim-id>`). Closing a drawer is a history pop, not a bare UI
   toggle that leaves stale URL state behind.
2. **Referrer-based breadcrumbs with a canonical cold-entry fallback.**
   Breadcrumbs reflect the actual path the visitor took when it is known
   (session-tracked, not a hardcoded parent field per entity). On cold entry
   (#6), fall back to the shallowest canonical path: Home → top-level section
   → entity (e.g., Home → Muscles → Pectoralis major).
3. **Two-tier responsive nav.** Search stays visible at every breakpoint.
   Below a defined mobile breakpoint, the remaining six top-level destinations
   collapse into one overflow control opening a full-height sheet, reusing the
   bottom-sheet pattern §6.2 already specifies for the explorer. Share/Reset
   are scoped to the anatomy-explorer page only; they are not global chrome.
4. **Comparison entities carry state from their referring page.** A
   "compare" link on a muscle/exercise page pre-fills that entity into
   Compare Slot A (`/compare?a=<entity-id>`) and lands the user on Slot-B
   selection. Compare reached from the top-level nav starts with both slots
   empty.
5. **Two-tier evidence pattern.** An inline evidence peek (claim text,
   certainty grade, 1–3 line source summary) opens in place, without leaving
   the referring page, using the URL-state rule in #1. An explicit "view full
   source" action inside the peek navigates to the standalone source page
   (§6.6). The global "Evidence" nav destination is the browsable hub/index,
   not the peek drawer's UI.
6. **Add a sixth documented journey: cold entry.** `Search engine or shared
   link → detail page → contextual breadcrumb (#2 fallback) + related-entities
   rail`. Every detail-page archetype (muscle, exercise, comparison, source)
   renders this orientation rail regardless of entry path, so a visitor who
   never saw the home page can still tell where they are and how to browse
   further.
7. **"Learn" is a plain index page**, not a dropdown/mega-menu: `/learn` links
   to Methodology, Glossary, and "How to read the evidence" as ordinary page
   links. This keeps the nav bar consistent with §6.1's "minimal navigation"
   and gives Learn a stable, indexable URL per §4.1's canonical-URL
   requirement.

## Consequences

- SBLA-012's design-token and archetype work has concrete, testable answers
  for drawer-vs-page history, breadcrumb ancestry, mobile nav collapse,
  Compare hand-off, and the evidence peek/full-page split, instead of leaving
  each builder to improvise.
- The formative usability report SBLA-012 must produce (3–5 representative
  lifters/coaches attempting find/understand/verify/share tasks) gains an
  explicit browser-Back check and a cold-entry (deep-link) task, since #1 and
  #6 are exactly the failure modes formative usability testing exists to
  catch.
- §12.1's end-to-end test list ("body → muscle → exercise → source journey,"
  "exercise → compare → share → reload journey") can now be written
  deterministically against the URL-state rules in #1 and #4 instead of
  against unspecified component behavior.
- Master plan §5 is not edited by this ADR; §5's journey narratives remain the
  authoritative high-level flows, and this ADR is the operational
  supplement SBLA-012 implements against, consistent with how ADR 0004
  supplements §11.8 without rewriting it.

## Alternatives considered

- **Leave drawers as ephemeral UI state with no URL entry.** Rejected: directly
  contradicts §5.2's own "selection creates a URL state" requirement and
  produces a Back button that silently skips a step the user remembers taking.
- **Single-tier evidence (claim badge always navigates to the full source
  page).** Rejected: costs the user their anatomy/exercise context on every
  citation check, contradicting Principle 1's "understandable without opening
  a methodology paper."
- **Hardcode one fixed parent per entity for breadcrumbs** (e.g., every muscle
  page's breadcrumb always reads Home → Muscles → X, even when reached from
  the 3D explorer). Rejected: it is simpler to build but actively misleads a
  user who just navigated Explore Body → Chest → Pectoralis major by showing
  them a path they didn't take.
- **A full mega-menu for all seven top-level items on every breakpoint.**
  Rejected: conflicts with §6.1's explicit "minimal navigation" requirement
  for the home page and adds unnecessary complexity for a 7-item set that
  fits a simple overflow pattern.

## Reversal cost

- Decisions #2, #3, and #7 are **low** cost to change later: they affect
  presentation/chrome, not stored data or URLs.
- Decisions #1, #4, and #5 are **moderate** cost to change later because they
  define shareable URL shapes; changing them after SBLA-012 ships means either
  redirecting old shared links or breaking them. Get these right before
  SBLA-012's URL scheme is implemented and tested.
- Decision #6 (cold-entry journey) is **low** cost: it is an additive
  requirement on existing detail-page archetypes, not a new page type.

## Owner approval

Owner approved all seven decisions without amendment on 2026-09-27. SBLA-012
must treat them as binding when it builds the navigation shell.
