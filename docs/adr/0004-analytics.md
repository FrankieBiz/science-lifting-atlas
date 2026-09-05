# ADR 0004 — Analytics in Release 1

- Status: Accepted
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-03

## Context

Master plan §4.1 lists privacy-respecting, cookieless analytics if available on
the chosen host, while §11.8 explicitly makes analytics optional and says it
must not block launch. The decision can adopt a suitable provider without
turning it into a release gate.

§11.8 also forbids creating a persistent per-user identifier solely to calculate
retention. The only allowed custom event names are `search_submitted`,
`entity_selected`, `related_opened`, `evidence_opened`, `source_opened`,
`comparison_shared`, and `webgl_fallback`. Events may contain entity IDs or
controlled categories only—never raw queries, URLs containing health
information, or free text.

§11.7 requires a strict Content Security Policy with limited script origins, no
sensitive health data, a plain-language privacy page even when no cookies are
used, and Subresource Integrity where appropriate for external static assets—or
that external scripts be avoided.

## Verified provider facts

Each exact official Cloudflare source below was reopened on the access date
shown in its row. The same fact-to-source mapping is machine-readable under
`cloudflare-web-analytics` in
[`provider-quotas.json`](provider-quotas.json).

| Question                    | Documented answer                                                                                                                    | Exact official source                                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cost / personal data        | Free and privacy-first; does not collect or use visitors' personal data                                                              | [About](https://developers.cloudflare.com/web-analytics/about/), accessed 2026-09-01                                                                                                             |
| Cookies / client-side state | Does not use cookies, `localStorage`, or other client-side state for analytics                                                       | [Privacy-first Web Analytics](https://www.cloudflare.com/web-analytics/), accessed 2026-09-01                                                                                                    |
| Fingerprinting              | Does not fingerprint by IP address, User Agent, or other data for analytics                                                          | [Privacy-first Web Analytics](https://www.cloudflare.com/web-analytics/), accessed 2026-09-01                                                                                                    |
| Reports per completed page  | Traditional pages report at load and on leave; Core Web Vitals report at the first hidden state after load                           | [FAQ](https://developers.cloudflare.com/web-analytics/faq/) and [data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/), accessed 2026-09-01 |
| Ingestion sampling          | Script fires on every pageview; every received report is recorded without ingestion sampling                                         | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-01                                                                                                                 |
| Retention                   | Unsampled for 7 days, then aggregated to around 10%                                                                                  | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-01                                                                                                                 |
| Query sampling              | 0.0001%–100%, dynamically selected by filter and volume                                                                              | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-01                                                                                                                 |
| Query strings               | Not logged                                                                                                                           | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-01                                                                                                                 |
| Documented limits           | 10 non-proxied sites, no proxied-site limit, 1,000 sites viewed in parallel, and zero rules on Free                                  | [Limits](https://developers.cloudflare.com/web-analytics/limits/), accessed 2026-09-01                                                                                                           |
| Documented ingestion quota  | The official Limits page enumerates site/rule limits but no ingestion quota; this is a sourced absence, not “unlimited”              | [Limits](https://developers.cloudflare.com/web-analytics/limits/), accessed 2026-09-01                                                                                                           |
| Custom-event support        | Not supported                                                                                                                        | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-01                                                                                                                 |
| Subresource Integrity       | Automatic injection includes an `integrity` attribute; a manual embed cannot safely use one because the beacon is not version-pinned | [FAQ](https://developers.cloudflare.com/web-analytics/faq/), accessed 2026-09-03                                                                                                                 |
| Pages setup                 | Enabling Web Analytics on a Pages project automatically adds the script on the next deployment                                       | [Get started](https://developers.cloudflare.com/web-analytics/get-started/), accessed 2026-09-03                                                                                                 |

These facts satisfy the privacy boundary for aggregate pageviews without the
atlas creating a persistent identifier.

## Decision

**Launch without analytics. Retain Cloudflare Web Analytics only as an optional
post-launch aggregate-pageview candidate**, subject to these boundaries and
owner approval:

1. **No manual beacon embed.** Cloudflare does not version-pin the manual script,
   so a safe `integrity` attribute cannot be applied. The Release 1 source and
   built artifact therefore contain no analytics script.
2. **Integrity-gated automatic activation only.** After the production Pages
   project and domain exist, optional analytics may activate only through
   Cloudflare's automatic setup, after the actual emitted production HTML is
   verified to contain an `integrity` attribute and the CSP is tested. If the
   attribute is absent or automatic injection is unavailable, analytics remains
   disabled. This invokes §11.7's “avoid external scripts” branch until SRI is
   demonstrated rather than assumed.
3. **Pageviews only if activated.** Cloudflare documents that custom events are
   not supported. If support is added later, only the seven enumerated names and
   controlled values are permitted after re-verification.
4. **Never block launch.** Integration, privacy disclosure, CSP, or integrity
   work cannot delay launch; the no-analytics baseline is the default.
5. **No persistent per-user identifier and no retention proxy.** Do not add a
   cookie, local-storage value, fingerprint, or other identifier to estimate
   repeat use. If a metric cannot be reported in aggregate without one, omit it.
6. **No raw logs.** Release 1 does not enable Logpush, retained request-log
   export, or another per-request log store.

A plain-language privacy page is published either way. The beacon must not gate
content, and the site must remain useful with JavaScript disabled.

Pre-launch performance gates remain lab measurements. Field Core Web Vitals
become a post-launch gate only after enough observations exist for a stable 75th
percentile; elapsed time alone is not sufficient.

## Analytics and log volume

The Phase 0 **launch baseline uses zero RUM reports** because analytics is off.
It also retains an optional-activation sensitivity of **two RUM reports per
completed pageview** and zero custom events. Cloudflare's FAQ documents a load
report and a leave report for traditional pages; its data-collection page says
Core Web Vitals report at the first hidden state after load. The sensitivity
assumes both arrive and takes no credit for network loss.

The unversioned beacon measured 30,294 raw bytes / 10,125 gzip response-body
bytes on 2026-09-03 and advertised a one-day cache lifetime. It measured 28,467
raw / 9,509 gzip bytes on 2026-09-01, so its transfer input moved 6.5% in two
days. ADR 0005 therefore rounds displayed scenario totals and gives the optional
sensitivity no cache credit; these bytes are not part of the launch baseline.

Report payloads cannot be measured without a configured analytics site, so ADR
0005 assigns an explicit unmeasured 1 KB/report ceiling. At the three scenarios
the optional sensitivity produces 20k/200k/2M reports and budgeted ingestion of
20 MB/200 MB/2 GB. The launch baseline produces none. Raw-log volume,
custom-event volume, and stored per-user records remain zero in both modes.

## Consequences

- The launch CSP permits no analytics script origin because the launch artifact
  contains no third-party script.
- Optional activation adds one third-party script origin only after automatic
  injection is verified to emit an `integrity` attribute in the actual
  production HTML and the CSP change passes a staging check. Otherwise the
  provider remains disabled.
- Long-window counts are approximate after provider aggregation; do not present
  them as precise cohort or retention data.
- Cost remains $0 because the service is free. Lack of a documented ingestion
  quota is an uncertainty to re-check, not permission to claim unlimited use.
- The optional sensitivity adds the currently measured 10.125 KB gzip script
  plus a 2 KB two-report payload ceiling to each completed pageview. The launch
  baseline adds zero analytics transfer.

## Alternatives considered

- **No analytics.** Selected for launch because it satisfies §11.7 without an
  external script and §11.8 says analytics must not block launch. Optional
  automatic activation remains available after its integrity gate passes.
- **Manual Cloudflare beacon embed.** Rejected because Cloudflare does not
  version-pin the script and documents no safe way to attach an `integrity`
  attribute.
- **Self-hosted analytics.** Rejected: requires runtime compute/storage, weakens
  ADR 0001, and risks recurring cost.
- **Server-log analysis.** Rejected: the selected free static path does not
  expose a retained request-log product, and Release 1 does not add one.
- **A richer event analytics provider.** Rejected until controlled events,
  privacy behaviour, hard cost controls, and quotas are verified.

## Reversal cost

- Leaving Web Analytics disabled is **zero** implementation cost and changes no
  content, routing, or evidence record.
- Disabling an automatically injected beacon later is **low** cost: turn off the
  provider setting and remove its CSP allowance.
- Switching cookieless pageview providers is **moderate** cost because privacy
  behaviour, sampling, CSP, quotas, transfer, and disclosures must be reviewed.
- Adding controlled events is **moderate** cost: schemas and tests must reject
  every non-enumerated name, raw query, health-bearing URL, and free-text field.

## Open items for the owner

- Owner approval is not yet recorded. Confirm the no-analytics launch baseline
  and whether integrity-gated automatic pageview analytics may be activated
  afterward.
