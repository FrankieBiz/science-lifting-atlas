# ADR 0005 — $0/month infrastructure model at three traffic scenarios

- Status: Proposed — requires owner approval
- Date: 2026-08-30
- Task: SBLA-003
- Supersedes: none

## Context

Master plan §11.8 sets an operating-cost target of **$0/month excluding the
anatomy-model purchase and domain registration**, forbids services that
auto-upgrade or incur usage charges, and requires any forecast above $5/month to
carry an owner decision and its own ADR.

It also requires modelling at least 10,000, 100,000, and 1,000,000 monthly page
views using measured transfer, build frequency, object operations, and
log/analytics volume — and requires that provider quotas be recorded with date
and source rather than recalled.

All quotas below were read from provider documentation on **2026-08-30** and are
recorded machine-readably in [`provider-quotas.json`](provider-quotas.json).

## Measurement basis, and its limits

The only true measurement available today is the SBLA-001 foundation build:

| Artifact             |     Bytes |      Gzip |
| -------------------- | --------: | --------: |
| `index.html`         |     1,593 |         — |
| `_astro/index.*.css` |     4,214 |         — |
| **Total build**      | **5,816** | **2,331** |

That is a one-page shell, not the product. Release 1 transfer is therefore
modelled from the master plan §12.2 budgets, which are the contractual ceilings
future pages must meet:

| Component                           |           Budget used | Source  |
| ----------------------------------- | --------------------: | ------- |
| Non-3D page JS                      |  100 KB gzip (target) | §12.2   |
| Anatomy page JS excluding 3D engine |  180 KB gzip (target) | §12.2   |
| Desktop initial 3D payload          |         6 MB (target) | §12.2   |
| Exercise poster image               |                200 KB | §11.9   |
| HTML + CSS per page                 | 25 KB gzip (modelled) | derived |

**This model is budget-derived, not measured, and must be re-run against real
measurements at SBLA-012 and SBLA-015 before it is treated as a forecast.**

Modelled per-view transfer:

- Non-3D page view: 25 KB + 100 KB + 200 KB poster ≈ **325 KB**
- Anatomy view including 3D payload: 25 KB + 180 KB + 6 MB ≈ **6.2 MB**

Mix assumption: **90% non-3D, 10% anatomy-with-3D**, and no CDN or browser cache
credit. Both are deliberately pessimistic; real caching of the model and the
shared CSS/JS should reduce these materially.

## Three scenarios

| Monthly page views | Non-3D transfer | 3D transfer | **Total egress** |
| -----------------: | --------------: | ----------: | ---------------: |
|             10,000 |          2.9 GB |      6.2 GB |     **≈ 9.1 GB** |
|            100,000 |         29.3 GB |       62 GB |      **≈ 91 GB** |
|          1,000,000 |        292.5 GB |      620 GB |     **≈ 913 GB** |

Object operations on R2, assuming ~5 object reads per 3D view:

|  Scenario | 3D views | Class B reads | Free allowance |
| --------: | -------: | ------------: | -------------- |
|    10,000 |    1,000 |         5,000 | 10,000,000     |
|   100,000 |   10,000 |        50,000 | 10,000,000     |
| 1,000,000 |  100,000 |       500,000 | 10,000,000     |

Build frequency: content waves and code merges are modelled at ≤10 builds/day
worst case ≈ 300/month, against a 500/month free allowance.

Log/analytics volume: **zero**, because ADR 0004 ships Release 1 with no
analytics provider.

## Cost outcome

| Cost driver           | 10k    | 100k   | 1M     | Why                                                |
| --------------------- | ------ | ------ | ------ | -------------------------------------------------- |
| Pages static requests | $0     | $0     | $0     | "requests to static assets are free and unlimited" |
| Pages bandwidth       | $0     | $0     | $0     | Not metered on the free plan                       |
| Pages builds          | $0     | $0     | $0     | ~300/month vs 500 allowance                        |
| R2 storage            | $0     | $0     | $0     | Assets well under 10 GB-month                      |
| R2 egress             | $0     | $0     | $0     | Egress is Free                                     |
| R2 Class B ops        | $0     | $0     | $0     | ≤500k vs 10M allowance                             |
| Analytics             | $0     | $0     | $0     | None in Release 1                                  |
| **Total**             | **$0** | **$0** | **$0** |                                                    |

**The $0/month target holds at all three scenarios** on Cloudflare Pages + R2,
excluding the anatomy model purchase and domain registration as §11.8 permits.

## Decision

1. Model Release 1 on **Cloudflare Pages** for the static site and **Cloudflare
   R2** for large 3D/media assets.
2. Treat the **500 builds/month** ceiling as the binding free-tier constraint,
   not bandwidth. Configure usage alerts at **70% (350 builds)** and **85% (425
   builds)** where the provider supports them, per §11.8.
3. Treat the **25 MiB Pages per-file limit** as a hard architectural boundary:
   any single asset above it must be served from R2, never from Pages.
4. Re-run this model against measured page weights at SBLA-012 and SBLA-015, and
   re-verify every quota by **2026-11-30**.
5. Escalate to the owner with a new ADR if any scenario forecasts above
   $5/month.

## Consequences

- The dominant cost risk is **not** traffic; it is build frequency and per-file
  size. Content waves that rebuild on every record merge could approach the
  build ceiling; batch them.
- Because R2 egress is free and static requests are unmetered, traffic growth
  does not threaten the $0 target on this provider pair. Provider _policy
  change_ does — hence the fixed re-verification date.
- The pessimistic no-cache assumption means real usage should sit well below
  these figures; the model should not be used to justify heavier budgets.

## Alternatives considered

- **Netlify.** Rejected as un-modellable on the access date: its free plan is
  expressed as a 300-credit allowance and the pricing page did not state byte or
  build-minute quotas, so it cannot satisfy §11.8's "record current provider
  quotas with date and source" without a further sourced reading.
- **GitHub Pages as primary.** Rejected: its 100 GB/month soft bandwidth limit is
  exceeded at scenario 2 (≈91 GB is already at 91% of it) and massively at
  scenario 3, its 1 GB site cap conflicts with 3D assets, and its terms exclude
  commercial use. It remains the portability target — see ADR 0003.
- **Runtime server or database.** Rejected by §11.1: Release 1 has no accounts,
  user content, payments, or personalized data.
