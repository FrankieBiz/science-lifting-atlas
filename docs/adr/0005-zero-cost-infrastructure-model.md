# ADR 0005 — $0/month infrastructure model at three traffic scenarios

- Status: Proposed
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-03
- Supersedes: none

## Context

Master plan §11.8 sets an operating-cost target of **$0/month excluding the
anatomy-model purchase and domain registration**. No service may auto-upgrade or
incur usage charges. The plan requires 10,000, 100,000, and 1,000,000 monthly
page-view scenarios covering HTML, JavaScript, image/model transfer, build
frequency, object operations, and log/analytics volume.

The owner-authorized §11.8 queue-staging clarification makes that requirement
executable at SBLA-003 without pretending later product components exist: this
task measures every current artifact/payload and uses explicit budget-derived
limits for not-yet-built components—hard ceilings where the plan defines them,
and labelled targets or task-local ceilings otherwise. This is **capacity
planning, not a forecast** and not final provider approval. Representative
measurements and a full rerun remain mandatory before production provider
activation.

The provider package was read from official documentation on 2026-09-01; the
analytics/SRI decision and mutable beacon measurement were reverified on
2026-09-03. Exact source dates are recorded in
[`provider-quotas.json`](provider-quotas.json). Re-verify by 2026-12-01.

## Measured foundation build

The current repository can measure only the one-page SBLA-001 foundation shell.
The 2026-09-01 pinned build emitted:

| Artifact class             | Raw bytes | Independent gzip -9 |
| -------------------------- | --------: | ------------------: |
| HTML (`index.html`)        |     1,595 |                 733 |
| CSS (`assets/index.*.css`) |     4,214 |               1,693 |
| JavaScript                 |         0 |                   0 |
| Images                     |         0 |                   0 |
| 3D models                  |         0 |                   0 |
| Other emitted files        |         9 |             **214** |
| **Complete `dist/`**       | **5,818** |           **2,640** |

The raw count is the sum of every emitted file. The gzip values compress files
independently and are diagnostic, not a claim about a future host’s exact
content negotiation. One real build and deployment occurred during SBLA-003,
but there is no production history from which to measure monthly build
frequency or cache behaviour. The 214-byte “other” gzip contribution is 8.1%
of the complete diagnostic gzip total and is stated explicitly rather than
dismissed as immaterial.

The unversioned Cloudflare Web Analytics beacon was separately measured at
30,294 raw bytes and 10,125 gzip transfer bytes on 2026-09-03, up from 28,467
raw and 9,509 gzip bytes on 2026-09-01. Its report payloads are not measurable
until a site is configured. Analytics is disabled in the launch baseline; these
volatile script bytes appear only in the optional-activation sensitivity.

## Phase 0 capacity model

Representative Release 1 product surfaces do not exist yet. The
future-component inputs below use the master plan's **hard ceiling wherever one
exists** and an explicitly labelled planning ceiling or target where the plan
defines no hard ceiling. They are not measurements or forecasts and receive no
browser/CDN cache credit.

| Component                  | Per applicable view | Basis                                         |
| -------------------------- | ------------------: | --------------------------------------------- |
| HTML + CSS                 |               25 KB | SBLA-003 planning allowance                   |
| Non-3D application JS      |         160 KB gzip | master plan §12.2 hard ceiling                |
| Anatomy application JS     |         180 KB gzip | master plan §12.2 target                      |
| Exercise poster            |              200 KB | master plan §11.9 budget                      |
| Exercise loop              |                3 MB | master plan §11.9 hard ceiling                |
| Desktop initial 3D payload |               10 MB | master plan §12.2 hard ceiling                |
| Pagefind index             |                1 MB | interim SBLA-003 ceiling; measure in SBLA-016 |
| Analytics beacon script    |      10.125 KB gzip | optional sensitivity; measured 2026-09-03     |
| Analytics report payload   |         1 KB/report | optional sensitivity; unmeasured ceiling      |

Traffic mix is 90% non-3D and 10% anatomy-with-3D. To close the earlier omission,
every non-3D view is charged a poster and hard-ceiling exercise loop, and every
view is charged the full interim Pagefind index. This is deliberately harsher
than likely transfer because those assets load on interaction and caches exist.
The 90/10 mix itself is not conservative; it is an unmeasured assumption and
must be replaced with real aggregate traffic after launch.

Weighted launch-baseline transfer per page view:

- HTML/CSS: 25 KB
- application JS: 162 KB
- poster images: 180 KB
- exercise loops: 2.7 MB
- Pagefind index: 1 MB
- 3D model transfer: 1 MB
- analytics: 0
- **total: 5.067 MB/page view**

The optional integrity-gated analytics sensitivity adds the currently measured
10.125 KB script plus a 2 KB two-report ceiling, for **5.079125 MB/page view**.
The six-decimal value is retained only so the arithmetic can be reproduced;
scenario totals are rounded to two decimals because the unversioned script is
volatile and the future-component inputs are planning limits, not measurements.

## Three scenarios

### Transfer

Decimal units are used for modelling (1 GB = 1,000 MB).

| Monthly page views | HTML/CSS |  App JS | Images | Exercise loops | Search index | 3D models | Launch analytics | **Launch total** | Optional analytics sensitivity | **Optional total** |
| -----------------: | -------: | ------: | -----: | -------------: | -----------: | --------: | ---------------: | ---------------: | -----------------------------: | -----------------: |
|             10,000 |  0.25 GB | 1.62 GB | 1.8 GB |          27 GB |        10 GB |     10 GB |             0 GB |     **50.67 GB** |                        0.12 GB |       **50.79 GB** |
|            100,000 |   2.5 GB | 16.2 GB |  18 GB |         270 GB |       100 GB |    100 GB |             0 GB |    **506.70 GB** |                        1.21 GB |      **507.91 GB** |
|          1,000,000 |    25 GB |  162 GB | 180 GB |       2,700 GB |     1,000 GB |  1,000 GB |             0 GB |  **5,067.00 GB** |                       12.13 GB |    **5,079.13 GB** |

The optional column combines one 10.125 KB gzip beacon transfer and two 1 KB
report payloads per completed pageview. It is a sensitivity, not the launch
configuration. The launch totals therefore remain valid even if the script
changes again before the optional activation decision.

### Builds and object operations

Build demand does not scale automatically with traffic. Content waves and code
merges are capped operationally at 10 builds/day, approximately 300/month.
Static-object demand uses an eight-request/page-view planning allowance. Pages
documents static requests as free and unlimited.

| Monthly page views | Builds/month | Pages static object GETs | R2 Class A | R2 Class B | Hypothetical R2 reads if activated |
| -----------------: | -----------: | -----------------------: | ---------: | ---------: | ---------------------------------: |
|             10,000 |         ≤300 |                   80,000 |          0 |          0 |                              5,000 |
|            100,000 |         ≤300 |                  800,000 |          0 |          0 |                             50,000 |
|          1,000,000 |         ≤300 |                8,000,000 |          0 |          0 |                            500,000 |

The hypothetical column retains the prior sensitivity assumption of five reads
per 3D view. It is not selected-provider usage: R2 is disabled, so actual R2
operations are zero in every scenario.

### Analytics and logs

| Mode                 | Monthly completed page views | Load reports | Web Vitals/leave reports | Total RUM reports | Custom events | Budgeted ingestion | Raw log export | Persistent per-user records |
| -------------------- | ---------------------------: | -----------: | -----------------------: | ----------------: | ------------: | -----------------: | -------------: | --------------------------: |
| Launch baseline      |                       10,000 |            0 |                        0 |                 0 |             0 |                  0 |              0 |                           0 |
| Launch baseline      |                      100,000 |            0 |                        0 |                 0 |             0 |                  0 |              0 |                           0 |
| Launch baseline      |                    1,000,000 |            0 |                        0 |                 0 |             0 |                  0 |              0 |                           0 |
| Optional sensitivity |                       10,000 |       10,000 |                   10,000 |            20,000 |             0 |              20 MB |              0 |                           0 |
| Optional sensitivity |                      100,000 |      100,000 |                  100,000 |           200,000 |             0 |             200 MB |              0 |                           0 |
| Optional sensitivity |                    1,000,000 |    1,000,000 |                1,000,000 |         2,000,000 |             0 |               2 GB |              0 |                           0 |

Cloudflare's [FAQ](https://developers.cloudflare.com/web-analytics/faq/) says a
traditional page reports at the load event and when the user leaves. Its [data
collection documentation](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/)
says Core Web Vitals report at the first hidden state after load. Both were
accessed 2026-09-01. The optional sensitivity therefore assumes every modelled
pageview completes and emits both reports, each at the unmeasured 1 KB ceiling;
network loss is not used to reduce it. The launch baseline emits no report.

Cloudflare documents no ingestion sampling. The official [Web Analytics limits
page](https://developers.cloudflare.com/web-analytics/limits/) lists site and
rules limits but no ingestion quota; this sourced absence is not treated as
“unlimited” and remains a re-verification risk. Field Core Web Vitals wait for
enough data to produce a stable 75th percentile.

## Cost and hard-stop outcome

| Cost driver                    |    10k |   100k |     1M | Hard-cost boundary                            |
| ------------------------------ | -----: | -----: | -----: | --------------------------------------------- |
| Pages static requests/transfer |     $0 |     $0 |     $0 | Free, unlimited static requests               |
| Pages builds                   |     $0 |     $0 |     $0 | ≤300 vs 500 Free-plan builds                  |
| Pages asset storage/delivery   |     $0 |     $0 |     $0 | ≤20,000 files; each ≤25 MiB                   |
| Web Analytics                  |     $0 |     $0 |     $0 | Off at launch; optional SRI-gated sensitivity |
| R2                             |     $0 |     $0 |     $0 | **Not activated**                             |
| GitHub Pages proof             |     $0 |     $0 |     $0 | Non-production public proof only              |
| **Total**                      | **$0** | **$0** | **$0** | No metered product enabled                    |

**The $0/month outcome holds at all three scenarios** because traffic is served
only by free static Pages features. R2 is excluded even though the hypothetical
operations fit its free allowance: R2 can bill overage and therefore fails the
stricter “may not incur usage charges” rule.

## Decision

1. Propose Cloudflare Pages Free static delivery for site and Release 1 assets;
   owner approval remains pending.
2. Do not enable Pages Functions, Workers Paid, R2, a paid plan, or another
   metered add-on.
3. Enforce the 25 MiB per-file boundary. Compress/split/omit oversized assets or
   use the 2D fallback.
4. Launch without analytics. Optional Cloudflare Web Analytics may activate
   later only through automatic injection after the emitted production HTML is
   verified to contain an `integrity` attribute; manual embedding is prohibited.
5. Before any production provider activation, replace HTML/JS/image inputs with
   representative SBLA-012 measurements, model/media inputs with SBLA-015
   measurements, and the Pagefind input with an SBLA-016 measurement; then
   rerun every scenario.
6. Escalate any nonzero cost forecast or any proposed metered service through a
   superseding ADR and owner decision.

## Consequences

- This Phase 0 model can compare provider capacity, but it cannot authorize
  production activation until SBLA-012/015/016 replace every future-component
  ceiling and all scenarios are rerun.
- The $0 conclusion is insensitive to traffic transfer only because the
  proposed path excludes metered products. It does not imply that multi-terabyte
  payloads are performant or desirable.
- The no-charge boundary can force compression, delayed loading, omission, or a
  2D fallback instead of moving an oversized asset into metered storage.
- The launch baseline has no analytics script, report transfer, ingestion, raw
  logs, or persistent user records. The optional sensitivity models two reports
  per completed pageview; its undocumented ingestion ceiling and integrity gate
  both require re-verification before activation.
- Free Pages build usage requires manual weekly review because documented
  controls do not expose the requested configurable thresholds.

## 70% and 85% usage controls

The reviewed Cloudflare documentation does not expose configurable Free Pages
build alerts. Generic usage-billing notifications are documented for
Professional/pay-as-you-go accounts, not as a Pages Free build counter. No
Cloudflare account credential/project existed here, so no alert configuration
is claimed.

The operational substitute is weekly build-count review with actions at 350
builds (70%) and 425 builds (85%). Netlify’s unselected Free plan has fixed
50%/75%/100% notices, not configurable 70%/85% thresholds. GitHub Pages does not
document configurable Pages quota alerts. R2 budget alerts are informational and
do not cap charges, so R2 remains disabled rather than “protected” by an alert.

## Alternatives considered

- **Cloudflare R2.** Capacity fits the hypothetical operation model, but metered
  overage and automatic threshold billing violate the no-charge rule.
- **Netlify Free.** Its hard limit cannot incur cost, but 300 credits cap pure
  bandwidth at 15 GB before requests/deploys. Even the 10k capacity scenario
  exceeds that ceiling.
- **GitHub Pages as primary.** The 1 GB site limit, 100 GB/month soft bandwidth
  limit, and commercial-use restriction reject it. It remains the successfully
  deployed portability proof.
- **Runtime server/database.** Rejected by §11.1 and would create both runtime
  cost and security surface.

## Reversal cost

- Updating assumptions and rerunning the model is **low** cost because inputs are
  explicit.
- Moving the unchanged static artifact to another host is **low to moderate**
  cost; quotas, headers, alerts, and terms still require review.
- Activating a separate asset store is **moderate** cost because URLs, CORS,
  caching, operations, fallback, and hard cost controls must be implemented.
- Moving to runtime infrastructure is **high** cost and requires superseding ADRs
  0001, 0003, and this record.
