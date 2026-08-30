# ADR 0004 — Analytics in Release 1

- Status: Proposed — requires owner approval
- Date: 2026-08-30
- Task: SBLA-003

## Context

Master plan §11.8 states that analytics is **optional and must not block
launch**; that Release 1 must not create a persistent per-user identifier solely
to calculate retention; that allowed event names are enumerated
(`search_submitted`, `entity_selected`, `related_opened`, `evidence_opened`,
`source_opened`, `comparison_shared`, `webgl_fallback`); and that events may
carry entity IDs or controlled categories only — never raw queries, URLs
containing health information, or free text.

§11.7 additionally requires a strict Content Security Policy with limited script
origins, no sensitive health data collection, and a plain-language privacy page
even when no cookies are used.

## Decision

**Ship Release 1 with no analytics provider.**

Consequently:

- No third-party analytics script is added, so the CSP can forbid external
  script origins outright rather than carving out an exception.
- No persistent identifier, cookie, or client-side state is created for
  measurement.
- A plain-language privacy page is still published, stating plainly that the
  site collects nothing.
- Pre-launch performance gates use **lab** measurements, per §11.8. Field Core
  Web Vitals remain a post-launch gate and are not a launch dependency.

Adopting any analytics provider later requires a superseding ADR that records,
from provider documentation with an access date: whether it sets cookies or
client-side state, whether it fingerprints, its sampling behaviour, its cost at
the §11.8 traffic scenarios, and the exact enumerated events to be sent.

## Why not adopt a privacy-first provider now

Cloudflare Web Analytics was examined on 2026-08-30. Its overview page describes
it as "Privacy-first analytics for your website without changing DNS or using
Cloudflare proxy" and as available on all plans, but **that page did not state
whether it sets cookies or client-side state, whether it fingerprints, or how it
samples**.

§11.8 forbids relying on assumed provider behaviour, and §11.7 constrains what
may be collected. Adopting a provider whose data practices could not be
established from its documentation on the access date would be exactly the kind
of memory-based assumption the master plan prohibits. Since analytics is
explicitly optional and must not block launch, the correct decision is to defer
rather than to guess.

## Consequences

- Release 1 launches with **no usage data**. Success metrics in §3.3 that depend
  on measured behaviour cannot be reported at launch and must be sourced from
  the beta task testing in §19 instead.
- The strictest possible CSP becomes available, which is a security gain.
- The decision is cheap to revisit: the enumerated event list is already fixed,
  so a later provider evaluation is a bounded task.
- No cost, no quota, and no log volume enter the §11.8 model — this is why
  [ADR 0005](0005-zero-cost-infrastructure-model.md) records zero analytics
  volume.

## Alternatives considered

- **Cloudflare Web Analytics now.** Deferred, for the documentation reason above.
  It remains the leading candidate for a later evaluation given the host choice.
- **Self-hosted analytics.** Rejected for Release 1: it requires a runtime
  service, contradicting [ADR 0001](0001-static-first-architecture.md) and
  threatening the $0 target.
- **Server log analysis.** Not available: static hosting on the free plan does
  not expose retained request logs, and pulling them would add cost.
