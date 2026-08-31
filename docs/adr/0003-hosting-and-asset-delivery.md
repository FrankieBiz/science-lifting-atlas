# ADR 0003 — Hosting and asset delivery

- Status: Proposed
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
   allowance is 10 GB-month, and Class B reads are 10M/month — far above the
   modelled need. The binding rule is conditional, not a blanket dependency:
   **any single asset above the Pages 25 MiB per-file limit must be served from
   R2.** Whether the anatomy model actually exceeds 25 MiB is unmeasured — §12.2
   budgets the initial desktop 3D payload at 6 MB target / 10 MB ceiling, both
   _under_ the limit. SBLA-005 measures. If every asset stays under 25 MiB, R2 is
   an optimisation rather than a requirement.
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
- The portability fallback covers the **shell only**, decided on the 1 GB
  published-site cap, which conflicts with 3D assets directly. On bandwidth the
  picture is less dramatic than it first looks: the modelled 100k-page-view
  scenario reaches ≈91.3 GB, _within_ the 100 GB/month soft limit at about 91% of
  it. Scenario 3 exceeds it roughly ninefold. Under failover the site should
  degrade to its no-WebGL 2D path rather than serve models.
- GitHub Pages' terms exclude commercial use. If the atlas ever becomes
  commercial, this fallback must be replaced and this ADR superseded.
- **This property is now enforced, not just observed.** `pnpm test:portability`
  builds once and serves `dist/` from a bare `node:http` server — no Astro,
  Cloudflare, or adapter — asserting that the home page renders, that every asset
  the HTML references resolves at a domain root, and that no server-side redirect
  is needed. It runs inside `pnpm verify` after the build.

  The same suite also pins the subpath limitation. If a future change makes the
  build subpath-safe, the check **fails deliberately** with a message telling the
  author to update this ADR, so the documented constraint and the real behaviour
  cannot drift apart in either direction.

## Alternatives considered

- **Netlify as the portability target.** Not selected on capacity. Its pricing
  page does state credit conversion rates (20 credits/GB bandwidth against a
  300-credit free allowance), giving a ceiling of ~15 GB/month before deploys and
  requests are counted. That covers scenario 1 but not scenario 2 or 3, whereas
  GitHub Pages' 100 GB soft limit leaves far more headroom for the shell.
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
