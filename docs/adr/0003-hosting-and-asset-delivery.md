# ADR 0003 — Hosting and asset delivery

- Status: Proposed — requires owner approval
- Date: 2026-08-30
- Task: SBLA-003
- Related: [ADR 0001](0001-static-first-architecture.md), [ADR 0005](0005-zero-cost-infrastructure-model.md)

## Context

Master plan §11.2 names Cloudflare Pages as the static host candidate and
Cloudflare R2 "or equivalent" for large GLB/KTX2 assets. §11.8 requires that the
site can **export and deploy to a second static host from the same build
artifact**, so the project is never captive to one provider.

Quotas cited here were read on 2026-08-30 and are recorded in
[`provider-quotas.json`](provider-quotas.json).

## Decision

1. **Primary host: Cloudflare Pages (Free).** Static asset requests are
   documented as "free and unlimited", which removes traffic from the cost model
   entirely.
2. **Large assets: Cloudflare R2 (Free tier).** Egress is Free, storage
   allowance is 10 GB-month, and Class B reads are 10M/month — all far above the
   modelled need. R2 is also required, not merely preferred, because Pages
   enforces a **25 MiB maximum file size** that a full anatomy GLB can exceed.
3. **Portability target: GitHub Pages**, for the HTML/CSS/JS shell only.
4. **No Pages Functions in Release 1.** Functions consume a 100,000/day quota
   shared with Workers; a purely static build keeps the site on the unmetered
   path.

## Portability: verified, with one real constraint

The build artifact was tested for host independence on 2026-08-30.

**Test 1 — generic static server at a domain root.** `dist/` was served by
`python3 -m http.server`, a server with no Cloudflare, Astro, or Node runtime:

| Request                | Result  |
| ---------------------- | ------- |
| `/`                    | 200     |
| `/_astro/index.*.css`  | 200     |
| Page content assertion | present |

The artifact needs no host-specific runtime, adapter, redirect rules, or
configuration. **Portability at a domain root is confirmed.**

**Test 2 — served under a subpath, the GitHub Pages _project site_ shape.** The
same `dist/` was served at `/science-lifting-atlas/`:

| Request                                           | Result  |
| ------------------------------------------------- | ------- |
| `/science-lifting-atlas/`                         | 200     |
| `/_astro/index.*.css` (as referenced by the HTML) | **404** |

The built HTML references assets **root-absolutely** (`href="/_astro/…"`), so
under a subpath every asset reference escapes the site root and 404s. The page
returns 200 but renders unstyled.

**This is a genuine portability constraint, not a theoretical one.** Deploying to
a second host is only artifact-identical when that host serves the site at a
domain root.

## Consequences

- A GitHub Pages fallback must use either a **user/organisation site** or a
  **custom apex domain**, both of which serve at a root. A default _project_
  site (`<user>.github.io/<repo>/`) requires an Astro `base` setting and a
  **different build**, which would break the "same build artifact" requirement.
- The portability fallback covers the **shell only**. GitHub Pages' 1 GB site
  cap and 100 GB/month soft bandwidth limit cannot carry the 3D assets: the
  modelled 100k-page-view scenario already reaches ≈91 GB. Under failover, the
  site must degrade to its no-WebGL 2D path rather than serve models.
- GitHub Pages' terms exclude commercial use. If the atlas ever becomes
  commercial, this fallback must be replaced and this ADR superseded.
- A future task must add a portability regression check that builds once and
  serves the artifact from a non-Cloudflare server, so this property cannot
  silently regress.

## Alternatives considered

- **Netlify as the portability target.** Not selected: on the access date its
  free plan was expressed as a 300-credit allowance with no byte or build-minute
  quotas stated on the pricing page, so it cannot be modelled against §11.8
  without a further sourced reading.
- **Serving large assets from Pages.** Rejected: the 25 MiB per-file limit makes
  it unsafe for anatomy models, and it would couple asset delivery to the host.
- **A CDN in front of a runtime origin.** Rejected by §11.1 — no runtime service
  is justified for Release 1.

## Open items for the owner

- Confirm the domain to register, and that it will serve at an apex/root so the
  portability property holds.
- Confirm the Cloudflare account, and that no paid plan or auto-upgrade is
  enabled on it.
- An actual deployment has **not** been performed. Deploying is an outward-facing
  action that publishes the project and requires owner authorisation; this ADR
  proves the artifact is deployable, not that it was deployed.
