# ADR 0001 — Static-first application architecture

- Status: Accepted
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-01

## Context

Master plan §11.1 establishes that Release 1 has no accounts, user content,
payments, or personalized data, and that a runtime database would add cost,
attack surface, operational work, and schema complexity without adding user
value. §11.2 names the intended stack. This ADR ratifies that as a decision with
consequences, so later tasks inherit a settled architecture rather than
re-litigating it.

## Decision

Build the approved knowledge graph into **static pages and versioned JSON
bundles** at build time. No runtime application server and no runtime database
in Release 1.

The stack is fixed as:

| Concern                                                   | Choice                                             |
| --------------------------------------------------------- | -------------------------------------------------- |
| Routing, static generation, layouts, metadata             | Astro                                              |
| Stateful interaction (anatomy explorer, compare, search)  | React islands                                      |
| 3D scene graph, raycasting, materials, camera             | React Three Fiber / Three.js                       |
| Schemas for content, research artifacts, manifests, graph | Zod                                                |
| Curated editorial body sections                           | MDX, with factual claims referencing typed IDs     |
| Search                                                    | Pagefind, build-time index                         |
| Related-entity traversal                                  | Static JSON graph generated from validated records |

A runtime service may be introduced only when a specific feature is proven to
require one, via a superseding ADR.

**No runtime AI is part of Release 1.** AI may assist the offline research and
drafting workflow only inside the role, evidence, and review boundaries in the
master plan. The published site performs no inference, exposes no chat endpoint,
and sends no user input to a model provider. A future runtime-AI feature must
prove a user need, privacy model, scientific review boundary, hard cost control,
and graceful static fallback in a superseding ADR.

## Consequences

- Every user-visible fact must exist as a validated record **at build time**.
  There is no runtime escape hatch for unvalidated content — which is the point:
  it makes the evidence gates structurally unavoidable.
- The site remains useful with client JavaScript disabled, as SBLA-001 already
  demonstrates. Islands enhance; they do not gate content.
- Hosting stays on unmetered static delivery, which is what makes the $0 target
  reachable (see [ADR 0005](0005-zero-cost-infrastructure-model.md)).
- Content scale is bounded by build time and by the host's 20,000-files-per-site
  limit rather than by database capacity. At Release 1 coverage this is not
  close to binding, but a future mass-content wave must measure it.
- MDX must be sanitised at build time; §11.7 forbids arbitrary raw HTML from
  research artifacts reaching a page.

## Alternatives considered

- **Runtime CMS or database-backed rendering.** Rejected per §11.1: no Release 1
  feature needs it, and it would let unvalidated content reach users.
- **Client-side rendering of the whole atlas.** Rejected: it breaks the
  no-JavaScript requirement, harms indexability of evidence pages, and moves
  claim rendering away from build-time validation.
- **Pre-rendering into a runtime cache.** Rejected as strictly more moving parts
  than static output for the same result.
- **Runtime AI search, recommendation, or chat.** Rejected: unrestricted AI chat
  is outside Release 1 scope, inference would add privacy and cost exposure, and
  generated answers could bypass the claim-level evidence gate.

## Reversal cost

- Replacing Pagefind or one React island is **low to moderate** cost because
  pages, records, and the generated graph remain host-independent inputs.
- Replacing Astro or the file-to-page pipeline is **high** cost because routing,
  content integration, metadata, and build gates would need reimplementation.
- Adding a runtime service or runtime AI is **high** cost: it adds deployment,
  security, privacy, observability, fallback, and evidence-control surfaces.
  The static pages and versioned JSON remain reusable, which limits data
  migration cost even if the delivery architecture changes.
