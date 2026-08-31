# ADR 0004 — Analytics in Release 1

- Status: Proposed
- Date: 2026-08-30
- Task: SBLA-003
- Revision: rewritten 2026-08-30 after review. The first draft recommended
  shipping with no analytics on the stated grounds that Cloudflare's
  documentation did not describe its cookie, fingerprinting, or sampling
  behaviour. **That premise was false** — it rested on reading only the product
  overview page. The behaviour is documented, so the decision is reversed.

## Context

Master plan **§4.1 lists "Privacy-respecting, cookieless analytics if available
on the chosen host" as a Release 1 deliverable.** It is conditional, not
optional-by-default: the condition is availability on the chosen host.

§11.8 adds that analytics must not block launch; that Release 1 must not create
a persistent per-user identifier solely to calculate retention; that allowed
event names are enumerated (`search_submitted`, `entity_selected`,
`related_opened`, `evidence_opened`, `source_opened`, `comparison_shared`,
`webgl_fallback`); and that events may carry entity IDs or controlled categories
only — never raw queries, URLs containing health information, or free text.

§11.7 requires a strict Content Security Policy with limited script origins, no
sensitive health data, and a plain-language privacy page even when no cookies
are used.

## What the documentation actually says

Read 2026-08-30; recorded in [`provider-quotas.json`](provider-quotas.json)
under `cloudflare-web-analytics`.

| Question                    | Documented answer                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Cost                        | Free, available on all plans                                                                                                                 |
| Cookies / client-side state | None used for analytics                                                                                                                      |
| Fingerprinting              | Not performed for analytics                                                                                                                  |
| Sampling (ingestion)        | "The beacon script will fire on every pageview. The data ingestion pipeline does not apply sampling—every received beacon will be recorded." |
| Sampling (retention)        | "We retain unsampled beacon data for the past 7 days, after this point data is aggregated down to around 10%."                               |
| Sampling (query)            | 0.0001%–100%, dynamically selected by filter                                                                                                 |
| Visitor methodology         | Counts page views arriving from a different site rather than tracking individuals                                                            |
| Beacon script               | Required; manual embed for sites not proxied through Cloudflare                                                                              |

This satisfies §4.1's "privacy-respecting, cookieless" wording and §11.8's
prohibition on a persistent per-user identifier: the product does not create one.

## Decision

**Adopt Cloudflare Web Analytics for Release 1 pageview measurement**, subject to
the two conditions below.

1. **Pageview analytics only at launch.** Whether the seven enumerated §11.8
   event names can be sent as custom events was **not** established from
   documentation on the access date. Custom events are therefore _not_ adopted
   here. A follow-up task must establish support before any event is sent, and
   no event may carry raw queries or free text.
2. **Analytics must not block launch (§11.8).** If integration is not ready, ship
   without it and add it afterwards. It is not a release gate.

A plain-language privacy page is published either way, stating what the beacon
does and does not collect.

Pre-launch performance gates remain **lab** measurements per §11.8. Field Core
Web Vitals stay a post-launch gate.

## Consequences

- **The CSP must permit one external script origin** for the beacon. This is a
  real cost: ADR 0001's static-first posture would otherwise allow forbidding
  external scripts outright. §11.7 requires _limited_ script origins, not zero,
  so this is conformant — but it is a weakening, and it should be the only
  exception.
- The beacon is client-side JavaScript. It must not gate content, and the site
  must remain fully useful with JavaScript disabled, per the SBLA-001 contract.
- Retention beyond 7 days is ~10% aggregated. Any metric requiring precise
  long-window counts cannot rely on this source; §19's beta task testing remains
  the source for behavioural success metrics.
- Cost stays $0 — the service is free on all plans, so
  [ADR 0005](0005-zero-cost-infrastructure-model.md) is unaffected.
- Adopting analytics does **not** license retention metrics that would need a
  persistent identifier. Those remain out of scope under §11.8.

## Alternatives considered

- **No analytics at all.** This was the first draft's decision. Rejected on
  re-reading: §4.1 lists cookieless analytics as a Release 1 item conditional on
  host availability, and the condition is met. Dropping it would be a descope
  requiring explicit owner approval, not a default.
- **Self-hosted analytics.** Rejected: requires a runtime service, contradicting
  [ADR 0001](0001-static-first-architecture.md) and threatening the $0 target.
- **Server log analysis.** Not available: free static hosting does not expose
  retained request logs.

## Open items for the owner

- Confirm adopting Cloudflare Web Analytics, given it requires one external
  script origin in the CSP.
- If you would rather ship with **no** analytics, that is a §4.1 descope and
  should be recorded as such in a superseding ADR — not left implicit.
