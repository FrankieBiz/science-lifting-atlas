# ADR 0005 — $0/month infrastructure model at three traffic scenarios

- Status: Proposed
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-01
- Supersedes: none

## Context

Master plan §11.8 sets an operating-cost target of **$0/month excluding the
anatomy-model purchase and domain registration**. No service may auto-upgrade or
incur usage charges. The plan requires 10,000, 100,000, and 1,000,000 monthly
page-view scenarios covering HTML, JavaScript, image/model transfer, build
frequency, object operations, and log/analytics volume.

All provider facts were re-read from official documentation on 2026-09-01 and
are recorded with source URLs in
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
| Other emitted files        |         9 |        not material |
| **Complete `dist/`**       | **5,818** |           **2,640** |

The raw count is the sum of every emitted file. The gzip values compress files
independently and are diagnostic, not a claim about a future host’s exact
content negotiation. One real build and deployment occurred in this remediation,
but there is no production history from which to measure monthly build frequency
or cache behaviour.

The Cloudflare Web Analytics beacon script was separately measured at 28,467 raw
bytes and 9,509 gzip transfer bytes. Its beacon payload is not measurable until
a site is configured.

## Budget-derived Release 1 model

The product does not exist yet, so Release 1 numbers below are **budget-derived
planning ceilings, not measurements or forecasts**. They are deliberately
modelled with no browser/CDN cache credit.

| Component                  | Per applicable view | Basis                                         |
| -------------------------- | ------------------: | --------------------------------------------- |
| HTML + CSS                 |               25 KB | SBLA-003 planning allowance                   |
| Non-3D application JS      |         100 KB gzip | master plan §12.2 target                      |
| Anatomy application JS     |         180 KB gzip | master plan §12.2 target                      |
| Exercise poster            |              200 KB | master plan §11.9 budget                      |
| Exercise loop              |              1.5 MB | master plan §11.9 target                      |
| Desktop initial 3D payload |                6 MB | master plan §12.2 target                      |
| Pagefind index             |                1 MB | interim SBLA-003 ceiling; measure in SBLA-016 |
| Analytics beacon script    |       9.509 KB gzip | measured 2026-09-01                           |
| Analytics beacon payload   |                1 KB | explicit planning ceiling; unmeasured         |

Traffic mix is 90% non-3D and 10% anatomy-with-3D. To close the earlier omission,
every non-3D view is charged a poster and target-size exercise loop, and every
view is charged the full interim Pagefind index. This overstates likely transfer
because those assets load on interaction and caches exist. The 90/10 mix itself
is not conservative; it is an unmeasured assumption and must be replaced with
real aggregate traffic after launch.

Weighted per page view:

- HTML/CSS: 25 KB
- application JS: 108 KB
- analytics script JS: 9.509 KB
- poster images: 180 KB
- exercise loops: 1.35 MB
- Pagefind index: 1 MB
- 3D model transfer: 0.6 MB
- analytics beacon payload: 1 KB
- **total: 3.273509 MB/page view**

## Three scenarios

### Transfer

Decimal units are used for modelling (1 GB = 1,000 MB).

| Monthly page views | HTML/CSS |  App JS | Analytics JS | Images | Exercise loops | Search index | 3D models | Beacon payload |       **Total** |
| -----------------: | -------: | ------: | -----------: | -----: | -------------: | -----------: | --------: | -------------: | --------------: |
|             10,000 |  0.25 GB | 1.08 GB |     0.095 GB | 1.8 GB |        13.5 GB |        10 GB |      6 GB |        0.01 GB |    **32.74 GB** |
|            100,000 |   2.5 GB | 10.8 GB |     0.951 GB |  18 GB |         135 GB |       100 GB |     60 GB |         0.1 GB |   **327.35 GB** |
|          1,000,000 |    25 GB |  108 GB |     9.509 GB | 180 GB |       1,350 GB |     1,000 GB |    600 GB |           1 GB | **3,273.51 GB** |

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

| Monthly page views | Pageview beacons | Custom events | Budgeted beacon ingestion | Raw log export | Persistent per-user records |
| -----------------: | ---------------: | ------------: | ------------------------: | -------------: | --------------------------: |
|             10,000 |           10,000 |             0 |                     10 MB |              0 |                           0 |
|            100,000 |          100,000 |             0 |                    100 MB |              0 |                           0 |
|          1,000,000 |        1,000,000 |             0 |                      1 GB |              0 |                           0 |

Cloudflare documents no ingestion sampling and no quota in the official pages
reviewed. “No documented quota” is not treated as “unlimited”; it is a
re-verification risk. Field Core Web Vitals wait for enough data to produce a
stable 75th percentile.

## Cost and hard-stop outcome

| Cost driver                    |    10k |   100k |     1M | Hard-cost boundary               |
| ------------------------------ | -----: | -----: | -----: | -------------------------------- |
| Pages static requests/transfer |     $0 |     $0 |     $0 | Free, unlimited static requests  |
| Pages builds                   |     $0 |     $0 |     $0 | ≤300 vs 500 Free-plan builds     |
| Pages asset storage/delivery   |     $0 |     $0 |     $0 | ≤20,000 files; each ≤25 MiB      |
| Web Analytics                  |     $0 |     $0 |     $0 | Free; optional and removable     |
| R2                             |     $0 |     $0 |     $0 | **Not activated**                |
| GitHub Pages proof             |     $0 |     $0 |     $0 | Non-production public proof only |
| **Total**                      | **$0** | **$0** | **$0** | No metered product enabled       |

**The $0/month outcome holds at all three scenarios** because traffic is served
only by free static Pages features. R2 is excluded even though the hypothetical
operations fit its free allowance: R2 can bill overage and therefore fails the
stricter “may not incur usage charges” rule.

## Decision

1. Use Cloudflare Pages Free static delivery for site and Release 1 assets.
2. Do not enable Pages Functions, Workers Paid, R2, a paid plan, or another
   metered add-on.
3. Enforce the 25 MiB per-file boundary. Compress/split/omit oversized assets or
   use the 2D fallback.
4. Re-run this model with measured pages at SBLA-012, measured anatomy/media at
   SBLA-015, and measured Pagefind output at SBLA-016.
5. Escalate any nonzero cost forecast or any proposed metered service through a
   superseding ADR and owner decision.

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
  bandwidth at 15 GB before requests/deploys. Even the 10k conservative scenario
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
