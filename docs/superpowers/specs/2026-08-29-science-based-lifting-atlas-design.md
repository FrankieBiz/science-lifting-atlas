# Science-Based Lifting Atlas Design

**Status:** Approved for implementation on 2026-08-29  
**Canonical product plan:** [`docs/product/master-plan.md`](../../product/master-plan.md)  
**First implementation milestone:** SBLA-001

## Product outcome

Build a free, premium, evidence-first web atlas for serious lifters and coaches. A user can begin with a body structure, muscle, exercise, movement, or research question; traverse the same typed knowledge graph; and inspect the claim-level evidence, applicability, uncertainty, and revision state behind every meaningful training assertion.

Release 1 is intentionally finite: major trainable skeletal-muscle groups, roughly 75–120 cornerstone exercises, a high-polish anatomy explorer with complete non-3D alternatives, two-exercise comparison, search, evidence/source pages, and public methodology. It excludes accounts, tracking, program generation, nutrition, rehabilitation, community features, monetization, and unrestricted AI chat.

## Approaches considered

### 1. Evidence-first vertical slice — selected

Establish a reproducible repository and publication gates, then take one muscle, two exercises, and one comparison through the complete evidence, content, UI, accessibility, and review workflow. Scale only after the slice passes.

This best controls the two existential risks: publishing unsupported scientific claims and committing to an unusable anatomy asset. It also yields measured content-production costs before catalog scope is locked.

### 2. Experience-first prototype

Build the cinematic explorer and page shells first, then add evidence infrastructure. This would create earlier visual momentum but invites data-model rework, inaccessible interaction assumptions, and placeholder content that could quietly become product truth.

### 3. Catalog-first production

Research and author the full muscle/exercise catalog before building the product. This maximizes apparent content progress but postpones validation of claim rendering, review economics, asset taxonomy, and user comprehension. Rework risk is unacceptable.

## Architecture

The factual core is a versioned, file-based, Zod-validated knowledge graph. Astro statically generates indexable pages and structured JSON. React islands own only stateful interactions such as anatomy selection, comparison, and global search. React Three Fiber/Three.js renders the progressive 3D experience from a deterministic mesh manifest. Pagefind provides static search. Release 1 has no runtime database, account system, or model calls.

Subsystem boundaries are explicit:

- The content pipeline validates records, claims, source status, publication approval, relationships, and generated graph output. It fails closed.
- The evidence UI renders approved claim and source records; it never retrieves or synthesizes research at runtime.
- The anatomy explorer owns scene state, camera, selection, layers, URL state, and the synchronized semantic anatomy tree; it does not own scientific prose.
- Comparison renders structured, cited differences for exactly two entities and never invents a winner.
- Search consumes only build-time-approved public records.

## Data and publication flow

Lawful source discovery produces immutable stage artifacts: scope, search, acquisition, screening, extraction, appraisal, synthesis, drafting, citation audit, adversarial review, and owner approval. Approved claims and sources are promoted into public content records only when their exact checksums appear in an immutable approval manifest. The build then validates and compiles static routes, graph bundles, and search documents.

Changing substantive content invalidates its approval. Retracted, materially corrected, stale, unverified, or improperly linked sources block publication. Contradictory and qualifying evidence remains visible in the public evidence view.

## Interaction and accessibility

The visual direction is Clinical Cinematic: realistic anatomy, calm dark-gallery lighting, restrained anatomical color, precise labels, and journal-like typography. The anatomy model is navigation rather than decoration.

Every 3D action has a keyboard- and touch-operable control. Selection is represented by outline, label, focus, and text state rather than color alone. A synchronized semantic anatomy tree, anatomical posters, structured lists, reduced-motion behavior, and a complete no-WebGL route are first-class product surfaces. WCAG 2.2 AA applies to the representative page-and-state matrix; unresolved applicable A/AA failures block launch.

## Failure behavior

Invalid content fails the build instead of disappearing. A failed or lost WebGL context falls back to posters and lists without losing navigation. JavaScript failure leaves static content and sources readable. Search failure leaves index pages usable. A retraction or material correction creates a blocking incident and uses the isolated emergency content pipeline to remove or visibly correct affected claims without rebuilding 3D assets.

## Security, privacy, and licensing

Release 1 stores no accounts, health records, free-text analytics queries, or persistent identity solely for retention measurement. It uses a strict Content Security Policy, pinned dependencies, build-time sanitization, no arbitrary raw HTML, self-hosted assets where licensing permits, and minimal cookieless aggregate analytics only if it passes the privacy/cost gate.

No anatomy or exercise-media asset may proceed without documented rights to modify, optimize, render, and distribute it on the public web. Original restricted assets and lawful full text remain outside the public repository. The deterministic conversion pipeline records source versions, checksums, entity mappings, and required attribution.

## Testing strategy

Testing follows the pyramid in the master plan: schema fixtures, graph integrity, evidence/publication gates, pure unit tests, component interaction, end-to-end journeys, automated and manual accessibility, deterministic visual regression, and measured performance budgets. Behavior changes use red-green-refactor. `pnpm verify` is the authoritative repository check and must include formatting, linting, type checking, unit/integration tests, schema/graph/evidence validation, and a production build.

## Execution order

The authoritative queue is SBLA-001 through SBLA-020 in the canonical master plan. Work may not skip dependencies. Each task starts from the reviewed commit named by its predecessor and ends with a repository-contained handoff packet, test evidence, independent review, and a clean commit. The first meaningful product gate is the complete evidence-system vertical slice—not a standalone marketing page or a full anatomy import.

## Approval record

The owner supplied the complete master plan with `Project status: Planning approved; implementation not started`, then explicitly instructed Codex to build it. That instruction approves this design and authorizes beginning SBLA-001 without changing the plan’s scientific, product, architecture, scope, or ownership constraints.
