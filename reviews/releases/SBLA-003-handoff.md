# Handoff: SBLA-003 — Architecture, hosting, analytics, and $0 infrastructure ADRs

## Objective

Deliver the SBLA-003 row of master plan §18: ADRs for static architecture,
content data, hosting, and analytics, plus a $0 infrastructure model at three
traffic scenarios, with quotas cited with access date and the portability build
tested.

## Inputs and exact paths

- Canonical plan: `docs/product/master-plan.md` (§11.1, §11.2, §11.7, §11.8,
  §12.2, §18)
- Dependency per §18: **SBLA-001**, accepted at
  `141b63913b75791a6630303fdd1936fc615b3471`
- Base commit: `141b63913b75791a6630303fdd1936fc615b3471`
- Branch: `codex/SBLA-003-architecture-adrs`
- Worktree: `.worktrees/sbla-003-architecture-adrs`

## Constraints

- SBLA-003 owns architecture and provider decisions only. It defines no entity
  or claim schema (SBLA-007), selects no anatomy asset (SBLA-004–006), and
  builds no product surface (SBLA-012+).
- §11.8 forbids copying assumed free-tier limits from model memory; every quota
  is sourced and dated.
- No scientific claim, media asset, or content record was added.
- Nothing was deployed. Deploying publishes the project and is an owner action.

### Process note on the base commit

§18 names SBLA-003's dependency as **SBLA-001**, so this branch starts from
`141b639`, not from the SBLA-002 candidate. Consequently the SBLA-002 operating
model (`AGENTS.md`, `CLAUDE.md`, `docs/runbooks/**`) does not exist on this
branch, and the current-work ledger could not be used. The claim is recorded
here in the ledger's own fields instead:

| Field            | Value                                                 |
| ---------------- | ----------------------------------------------------- |
| Task             | SBLA-003                                              |
| Role             | Codex                                                 |
| Branch           | `codex/SBLA-003-architecture-adrs`                    |
| Worktree         | `.worktrees/sbla-003-architecture-adrs`               |
| Base commit      | `141b63913b75791a6630303fdd1936fc615b3471`            |
| Started          | 2026-08-30 18:41 EDT                                  |
| Expected handoff | `reviews/releases/SBLA-003-handoff.md`                |
| Paths owned      | `docs/adr/**`, `reviews/releases/SBLA-003-handoff.md` |

When SBLA-002 is accepted and merged, this claim must be back-recorded into
`docs/runbooks/current-work.md` as a closed claim. Integrating both branches will
conflict only on `README.md` if SBLA-003 is later extended to touch it; it does
not touch it today.

## Work completed

Five ADRs plus a machine-readable evidence record:

- `docs/adr/0001-static-first-architecture.md` — ratifies static-first with no
  runtime service; fixes the §11.2 stack; makes build-time validation the only
  path to a published fact.
- `docs/adr/0002-content-data-and-graph.md` — records are Git files under
  `content/`; Zod is the single validation authority for both Astro collections
  and the standalone validators; the graph is generated, never hand-edited;
  claims are referenced by typed ID. Explicitly does **not** define the schemas,
  which are SBLA-007's.
- `docs/adr/0003-hosting-and-asset-delivery.md` — Cloudflare Pages primary, R2
  for large assets, GitHub Pages as portability target, no Pages Functions;
  carries the measured portability result below.
- `docs/adr/0004-analytics.md` — **no analytics provider in Release 1**, with the
  reasoning and the exact conditions for a superseding ADR.
- `docs/adr/0005-zero-cost-infrastructure-model.md` — the three-scenario model.
- `docs/adr/provider-quotas.json` — every quota with source URL and access date,
  plus a `reverifyBy` date of 2026-11-30.
- `docs/adr/README.md` — ADR format, immutability rule, index, and the
  cite-your-source requirement.

## Decisions made

- **Adopt Cloudflare Web Analytics for Release 1 pageviews.** The first draft of
  ADR 0004 recommended shipping with no analytics, on the stated ground that
  Cloudflare's documentation did not describe its cookie, fingerprinting, or
  sampling behaviour. **That premise was false** — it came from reading only the
  product overview page. The FAQ states the sampling behaviour verbatim, and
  Cloudflare's documentation states it uses no client-side state and does not
  fingerprint. Master plan §4.1 lists cookieless analytics as a Release 1
  deliverable "if available on the chosen host", and the condition is met, so
  shipping without it would have been an uncited descope. Custom events are _not_
  adopted: whether the seven enumerated §11.8 event names are supported was not
  established, so only pageview measurement is in scope.
- **GitHub Pages, not Netlify, as the portability target — on capacity, not
  opacity.** The first draft claimed Netlify "cannot be modelled". That was
  wrong: the pricing page states conversion rates (20 credits/GB bandwidth, 2
  credits/10k requests, 15 credits/deploy) against a 300-credit free allowance,
  which yields a computable ceiling of ~15 GB/month before deploys and requests
  are counted. That covers scenario 1 but not scenario 2 or 3.
- **Builds, not bandwidth, are the binding free-tier constraint.** Static
  requests are documented unmetered, so the 500 builds/month ceiling is what the
  70%/85% alerts must watch.
- **The cost model is labelled budget-derived, not measured.** Only the
  foundation shell exists today, so Release 1 weights come from §12.2 budgets
  and are marked for re-measurement at SBLA-012/015 rather than presented as a
  forecast.
- **Pessimistic mix and no cache credit** (90/10 split, every visitor downloads
  everything) so the $0 conclusion is not flattered by optimistic assumptions.

## Pre-review remediation

An adversarial pre-review audit of candidate `0df3e9d` found factual errors in
the first draft. All were repaired before this handoff:

| Finding                                                                                                                 | Repair                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ADR 0004's premise — that Cloudflare's docs do not state cookie/fingerprint/sampling behaviour — is false               | ADR 0004 rewritten; decision reversed to adopt                                                                    |
| ADR 0004 descoped the §4.1 Release 1 analytics item without citing §4.1                                                 | §4.1 now cited as the governing requirement                                                                       |
| "Netlify cannot be modelled" is refuted by its own pricing page                                                         | Conversion rates recorded; rejection re-argued on computed capacity                                               |
| ADR 0005 said GitHub Pages' 100 GB limit "is exceeded at scenario 2" when 91.3 GB is within it                          | Corrected to ~91% of the limit, ~9% headroom; rejection re-grounded on the 1 GB site cap and commercial-use terms |
| The 90/10 traffic mix was labelled "deliberately pessimistic" though it is a guess and the model's most sensitive input | Relabelled honestly, with the sensitivity stated                                                                  |
| "R2 is required, not merely preferred" rested on an unmeasured asset size                                               | Made conditional on the 25 MiB per-file limit; notes §12.2 budgets sit under it                                   |
| The model silently omits exercise-media loops and the search index                                                      | Omission now stated explicitly as a gap                                                                           |
| The "measured" gzip figure was not reproducible                                                                         | Method stated (`cat` then `gzip -9`); flagged indicative, raw total is authoritative                              |
| All five ADRs violated the Status vocabulary the same commit defines                                                    | Normalised to `Proposed`                                                                                          |

## Tests/checks run and results

Pinned runtime: Node.js `v24.20.0`, pnpm `11.24.0`.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)**: Prettier PASS; ESLint PASS 0 warnings;
  `astro check` 23 files, 0 errors/warnings/hints; 3 unit files, 10 tests;
  content/graph/evidence adapters PASS in foundation mode; 1 page built;
  foundation contract PASS.
- **Measured** foundation build transfer: `index.html` 1,593 B, CSS 4,214 B,
  total **5,816 B raw / 2,331 B gzip**.
- **Portability, Test 1 — root.** `dist/` served by `python3 -m http.server`
  (no Cloudflare, Astro, or Node runtime): `/` → 200, `/_astro/index.*.css` →
  200, page content assertion present. Host independence confirmed.
- **Portability, Test 2 — subpath.** Same artifact served at
  `/science-lifting-atlas/`: page → 200, but the CSS reference
  `/_astro/index.*.css` → **404**, because the build emits root-absolute asset
  paths. Recorded as a constraint in ADR 0003.
- **Link integrity:** 13 relative links across `docs/adr/` checked, 0 broken.
- **Cited sources:** all 5 provider URLs returned HTTP 200 on 2026-08-30.
- Arithmetic in ADR 0005 re-checked by hand against the stated per-view figures.

## Known uncertainties

- **The cost model is budget-derived, not measured.** No Release 1 page exists.
  If real page weights exceed §12.2 budgets, every scenario grows proportionally.
  It must be re-run at SBLA-012 and SBLA-015.
- **The 5-object-reads-per-3D-view assumption** in the R2 operations table is an
  estimate, not a measurement. It has three orders of magnitude of headroom, so
  it does not change the $0 conclusion, but it is not evidence.
- **Nothing has been deployed.** Portability is proven against a generic static
  server, not against Cloudflare Pages or GitHub Pages themselves. A real deploy
  needs owner authorisation and a domain.
- **Provider terms change.** Every quota is a point-in-time reading with a
  2026-11-30 re-verification date. Netlify's shift to credits is a live example
  of why.
- **Netlify was not fully evaluated** — only enough to establish it could not be
  modelled from its pricing page on the access date.
- **`pnpm test:e2e` was not run** on this branch: Chromium cannot launch in this
  sandboxed shell (`bootstrap_check_in … Permission denied`). SBLA-003 changes no
  runtime code — it adds only Markdown and JSON — but the gate is unrun here.
- The GitHub Pages fallback covers the **shell only**; its bandwidth and size
  limits cannot carry 3D assets, so failover implies the 2D degraded path.

## Files created or modified

Created:

- `docs/adr/0001-static-first-architecture.md`
- `docs/adr/0002-content-data-and-graph.md`
- `docs/adr/0003-hosting-and-asset-delivery.md`
- `docs/adr/0004-analytics.md`
- `docs/adr/0005-zero-cost-infrastructure-model.md`
- `docs/adr/provider-quotas.json`
- `reviews/releases/SBLA-003-handoff.md`

Modified:

- `docs/adr/README.md`

## Required reviewer action

Independently review this branch at its final commit and return PASS or FAIL per
criterion to `reviews/releases/SBLA-003-r1.md`. Do not repair the artifact.

Specifically decide:

1. Whether every quota in `provider-quotas.json` matches its cited source, and
   whether any was taken from memory rather than the page.
2. Whether the three-scenario model satisfies §11.8, and whether labelling it
   budget-derived is an acceptable answer to "measured transfer" given that no
   Release 1 page exists yet.
3. Whether the $0 conclusion survives your own arithmetic.
4. Whether the portability evidence satisfies "can export and deploy to a second
   static host from the same build artifact", given the demonstrated subpath
   limitation and that no real deploy occurred.
5. Whether deferring analytics is correct under §11.8, or whether Release 1
   requires a provider decision now.
6. Whether ADR 0002 stays clear of SBLA-007's schema ownership.
7. Whether starting from `141b639` rather than the SBLA-002 candidate, and
   recording the claim in the handoff instead of the ledger, is acceptable.

## Acceptance criteria

- ADRs exist for static architecture, content data, hosting, and analytics.
- A $0 model covers 10,000, 100,000, and 1,000,000 monthly page views.
- Every provider quota carries a source URL and an access date.
- The portability property is tested from the same build artifact, with results
  recorded including failures.
- No SBLA-001 command, gate, or test is renamed, removed, or weakened.
- No later-task scope (schemas, assets, design system, content) is pre-empted.
- `pnpm verify` exits zero and the working tree is clean.
- The owner approves the provider direction and the $0 model, per §18.
