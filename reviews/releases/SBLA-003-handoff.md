# Handoff: SBLA-003 — Architecture, hosting, analytics, and $0 infrastructure ADRs

## Status

The bounded spec remediation is complete and ready for another compliance
check, followed by independent Claude Review. Candidate `e8fe598...` failed its
first compliance check with four Important and two Minor findings; every finding
and repair is preserved below. All five ADRs remain **Proposed**. The
owner-authorized §11.8 queue-staging clarification is not final approval of any
provider, analytics choice, or ADR.

## Objective

Deliver master plan §18 task SBLA-003 and Phase 0 task 0.2:

- decide static-first architecture, Astro/React islands, file content, Pagefind,
  hosting, asset delivery, analytics, and no runtime AI;
- record alternatives and reversal cost;
- model $0/month at 10,000, 100,000, and 1,000,000 monthly page views with
  transfer, builds, object operations, and analytics/log volume;
- verify decision-relevant provider facts from primary sources; and
- build once, deploy that unchanged artifact to a second static host, and test
  the real deployment.

## Inputs and repository state

- Canonical plan: `docs/product/master-plan.md` (§4.1, §10, §11.1, §11.2,
  §11.7, §11.8, §11.9, §12.2, §18)
- Exact §18 dependency: accepted SBLA-001 commit
  `141b63913b75791a6630303fdd1936fc615b3471`
- Preliminary SBLA-003 candidate:
  `790576994402b9ae17b72174938d3b105d3bbcee`
- Accepted operating-model mainline merged before remediation:
  `77a76231df2f9ce8c127885e1383e1da4034b1f5`
- Remediation start HEAD:
  `84c3e06b2cb6e487fabcfa897d128490be05394a`
- First remediated handoff commit:
  `35e8591abb8fc05b63ed3094ef99ae38312d4f65`
- Failed spec-review candidate and spec-remediation start:
  `e8fe598a5899656db1c816bef4b8a996c1546383`
- Spec-remediation claim commit:
  `6ca365c0665480db19e15406290dfe38341f08f6`
- Branch: `codex/SBLA-003-architecture-adrs`
- Worktree: `.worktrees/sbla-003-architecture-adrs`
- Spec-remediation claim: `docs/runbooks/current-work.md`, committed before the
  seven bounded documentation files were edited. The earlier portability claim
  was separately expanded before `astro.config.mjs` and `src/pages/index.astro`
  were edited.

The remediation preserves the accepted SBLA-002 operating model. It does not
define the SBLA-007 schemas, select SBLA-004–006 assets, or build later product
surfaces.

## Work completed

### Architecture package

- `docs/adr/0001-static-first-architecture.md` adopts static pages and versioned
  JSON, Astro, React islands, R3F/Three.js, Zod, MDX with typed claim IDs,
  Pagefind, a generated graph, and explicitly no runtime AI.
- `docs/adr/0002-content-data-and-graph.md` adopts Git-backed file records,
  shared Zod validation, generated graph output, typed claim references, and
  fail-closed validation without pre-empting SBLA-007 schema ownership.
- `docs/adr/0003-hosting-and-asset-delivery.md` proposes Cloudflare Pages Free
  static delivery, keeps Release 1 assets under its 25 MiB/file boundary,
  excludes metered R2, and records the current-shell GitHub Pages portability
  proof and the required future expansion gate.
- `docs/adr/0004-analytics.md` proposes Cloudflare Web Analytics only as an
  optional, launch-nonblocking aggregate pageview direction. It permits no raw
  queries/free text, persistent per-user ID, raw log export, or unsupported
  custom events.
- `docs/adr/0005-zero-cost-infrastructure-model.md` separates measured
  foundation output from Phase 0 budget-derived capacity inputs, includes a
  Consequences section, and covers every required dimension at all three
  traffic scenarios.
- Every ADR or the package records alternatives and reversal cost, including
  the high reversal cost of introducing runtime AI.

### Canonical queue-staging clarification

The owner authorized this exact narrow addition to master plan §11.8 so the
approved queue order is executable without fake measurements:

> **Queue-staging clarification for SBLA-003 only (owner-authorized 2026-09-01;
> not final provider or ADR approval):** measure every artifact and payload that
> exists at SBLA-003, and use explicit budget-derived ceilings for components
> that the approved queue has not built yet. Label the result capacity planning,
> not a forecast. Before any production provider activation, SBLA-012 must
> replace the HTML/JS/image inputs, SBLA-015 must replace the model/media inputs,
> and SBLA-016 must replace the Pagefind input with representative measurements
> and rerun all three scenarios. This makes the Phase 0 queue executable; it does
> not weaken or waive those later measurement gates.

This clarification authorizes queue staging only. It does not accept the
Proposed provider direction or waive Claude Review and final owner approval.

### Spec-compliance remediation

| Finding at `e8fe598...`                                                         | Repair                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Important: future JS/image/model/Pagefind inputs were not measurable in Phase 0 | Added the narrow §11.8 clarification above; ADR 0005 now calls the result capacity planning, not a forecast, and requires SBLA-012/015/016 measurements plus a complete rerun before provider activation |
| Important: one report/pageview undercounted Cloudflare RUM                      | Modelled a load report plus a Web Vitals/leave report—two 1 KB reports per completed pageview—and recomputed every affected number                                                                       |
| Important: portability prose claimed future coverage                            | Limited evidence to the current homepage/current references and added the exact recursive route/asset expansion gate                                                                                     |
| Important: Web Analytics facts lacked exact source mapping                      | Added the official privacy-first product page, current Limits page, FAQ, data-collection page, and per-fact URL/access-date mapping                                                                      |
| Minor: ADR 0005 lacked Consequences                                             | Added the required section                                                                                                                                                                               |
| Minor: README stage was stale                                                   | Now states SBLA-002 accepted and SBLA-003 Proposed under remediation/review                                                                                                                              |

### Current provider evidence

`docs/adr/provider-quotas.json` was reverified on **2026-09-01** from official
provider documentation only. It distinguishes provider facts from project
inference and records a 2026-12-01 re-verification date.

Decision-relevant findings:

- Cloudflare Pages Free: 500 builds/month, one concurrent build, 20,000 files,
  25 MiB/file, and free/unlimited static asset requests.
- R2: 10 GB-month, 1 million Class A, and 10 million Class B free allowances,
  followed by metered overage; threshold billing can charge a payment method.
  R2 is therefore not activated.
- GitHub Pages: 1 GB published-site limit, 100 GB/month soft bandwidth limit,
  and a commercial-hosting restriction. It is only a public portability proof.
- Netlify Free: 300 credits with a hard no-overage boundary, but at most 15 GB
  if all credits went to bandwidth; requests/deploys reduce that capacity.
- Cloudflare Web Analytics: free; no cookie/local-storage state or analytics
  fingerprinting; every received report recorded; seven days unsampled then
  aggregated; query sampling; no query-string logging; and custom events not
  supported. The exact official source for each fact and its 2026-09-01 access
  date is mapped in `provider-quotas.json`. The current official Limits page
  lists site/rule limits but no ingestion quota; that is a sourced absence, not
  an unlimited-capacity claim.

No provider was credited with an unsupported 70%/85% alert. Cloudflare's
reviewed documentation does not expose configurable Free Pages build-count
alerts. The evidence-backed operating fallback is a weekly review at 350 builds
(70%) and correction/release-blocking builds only at 425 (85%). No Cloudflare
project or alert configuration is claimed.

### Measured and modelled infrastructure

The final foundation artifact contains nine files and measures:

| Class         | Raw bytes | Independent gzip -9 |
| ------------- | --------: | ------------------: |
| HTML          |     1,595 |                 733 |
| CSS           |     4,214 |               1,693 |
| JS/images/3D  |         0 |                   0 |
| Other files   |         9 |        not material |
| Complete dist |     5,818 |               2,640 |

Those are measurements of the current shell only. The Phase 0 capacity model
measures every existing artifact/payload and uses explicit budget-derived
ceilings for future HTML/JS/image/model/Pagefind components, without cache
credit. It is not a forecast. It records builds, Pages object GETs, actual zero
R2 operations, hypothetical R2 sensitivity, two RUM reports per completed
pageview, zero custom events, zero raw logs, and zero persistent user records at
10k/100k/1M views.

The two-report capacity input produces 20k/200k/2M reports and
20 MB/200 MB/2 GB of unmeasured ceiling payload at the three scenarios. Weighted
transfer is 3.274509 MB per completed pageview, yielding 32.75 GB, 327.45 GB,
and 3,274.51 GB. SBLA-012/015/016 must replace all future-component inputs with
representative measurements and rerun every scenario before production provider
activation.

The $0 result depends on a hard product boundary, not on staying within a
metered free allowance: use only Cloudflare Pages Free static delivery and the
optional free analytics service; do not activate R2, Functions, Workers Paid,
or another metered product.

## Portability implementation and TDD evidence

The preliminary candidate added a bare `node:http` static server, a dedicated
Vitest integration config, and `pnpm test:portability` inside the stable
`pnpm verify` contract. Remediation changed the test from pinning a known
subpath failure to requiring one artifact to work at both mounts.

TDD cycles on 2026-09-01:

1. **RED:** generated `/_astro/index.*.css` escaped
   `/science-lifting-atlas/`. `vite.base: './'` was overridden by Astro;
   Astro `base: './'` emitted `/./_astro/...` and remained red.
2. **GREEN:** Astro `build.assetsPrefix: '.'` emitted a mount-relative URL.
3. **RED:** the exact branch-based GitHub Pages publication path could not
   carry the host-reserved `_astro` directory without a host-specific marker.
4. **GREEN:** supported Astro `build.assets: 'assets'` emitted a generic asset
   directory. No post-build mutation was introduced.
5. The first external deployment rendered page/CSS byte-identically, but a
   later navigation inspection found its wordmark `href="/"` escaped to the
   GitHub host root. This earlier proof is intentionally retained in ADR 0003
   as incomplete evidence.
6. **RED:** the new navigation contract failed because `/` was outside
   `/science-lifting-atlas/`.
7. **GREEN:** the minimum application change used the standard
   document-relative `href="./"`. All five tests pass for the current homepage
   and its current HTML references/anchors at a root and project subpath.

Astro documents standard anchor navigation and does not rewrite manually
authored root links for `base`. The current homepage's document-relative link is
correct because that page sits at the mount root; it is not a general nested
route solution.

The suite does not recursively inspect future routes or CSS `url()`, JSON,
Pagefind, font, or GLB dependencies. Before any task adds/nests routes or adds an
asset class, it must extend the suite to recursively enumerate every
`dist/**/*.html`, exercise every route at root and subpath, check all same-origin
HTML references/anchors and relevant CSS/JSON/Pagefind/font/GLB references, and
verify route-aware home navigation from the same unchanged artifact.

## Exact current-shell second-host deployment evidence

Deployment date: **2026-09-01**. The owner-authorized proof used the existing
authenticated GitHub account and made no billing, paid-plan, secret, custom
domain, or unrelated account change.

- Source repository commit used for the artifact:
  `9f26a3a3d94bb2ea763304f57e817d39758c5bf6`
- Exact artifact content-manifest SHA-256:
  `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`
- Public deployment-only repository:
  <https://github.com/FrankieBiz/sbla-003-portability-proof-20260901>
- Deployment repository commit:
  `569eef0d0ff4d2528f0fd7eaf0f5a0e7fa3e92ca`
- GitHub Pages run:
  <https://github.com/FrankieBiz/sbla-003-portability-proof-20260901/actions/runs/33524170082>
  — success
- Public URL:
  <https://frankiebiz.github.io/sbla-003-portability-proof-20260901/>

The deployment repository's `main` branch contains only the nine generated
`dist/` files. `diff -qr --exclude=.git dist DEPLOYMENT_COPY` returned no
difference before the push. After the Pages run completed:

- page: HTTP 200; downloaded/local SHA-256 both
  `bc1ac51076b718db0343aa69136f25e9248360c3675fbe65da27333ae5187110`;
- referenced CSS: HTTP 200; downloaded/local SHA-256 both
  `76a9808cd41f62deae3f4c609fa4fd58d28a57f083b414a137e48aa20d271d5e`;
- wordmark `./` navigation: HTTP 200 at the project URL; and
- `health.txt`: HTTP 200 under the project mount.

The earlier, superseded run `33515952080` proved page/CSS delivery but failed
the later navigation inspection. It is not the acceptance proof.

## Verification results

Pinned runtime throughout: Node.js `v24.20.0`, pnpm `11.24.0`.

- Post-mainline baseline before remediation: `pnpm install --frozen-lockfile`
  PASS; `pnpm verify` PASS with 7 unit files/47 tests, 4 portability tests,
  production build, and foundation contract.
- Final `pnpm verify`: PASS with Prettier, ESLint (0 warnings), Astro diagnostics
  (0 errors/warnings/hints), 7 unit files/47 tests, foundation-mode
  content/graph/evidence validation, production build, 5 portability tests,
  and foundation contract.
- `pnpm test:e2e`: PASS, 1 Chromium test including the JavaScript-disabled
  static foundation.
- `jq empty docs/adr/provider-quotas.json`: PASS.
- README/master-plan/ADR/handoff relative-link check: PASS, 19 checked and 0
  broken.
- All 17 unique URLs in `provider-quotas.json`: HTTP 200 on 2026-09-01; the
  privacy, limits, FAQ, and data-collection pages were also read directly.
- Beacon transfer remeasurement: PASS, 28,467 identity bytes and 9,509 gzip
  body bytes; `cache-control: public, max-age=86400`.
- Independent integer-byte arithmetic: PASS at 3,274,509 B/completed view, two
  reports/view, and 32.75/327.45/3,274.51 GB; object-operation arithmetic also
  PASS.
- One-off spec assertions: PASS for all six repairs, all five Proposed statuses,
  and absence of stale one-report totals.
- `git diff --check`: PASS.

## Files created or modified for SBLA-003

Created in the preliminary candidate:

- `docs/adr/0001-static-first-architecture.md`
- `docs/adr/0002-content-data-and-graph.md`
- `docs/adr/0003-hosting-and-asset-delivery.md`
- `docs/adr/0004-analytics.md`
- `docs/adr/0005-zero-cost-infrastructure-model.md`
- `docs/adr/provider-quotas.json`
- `reviews/releases/SBLA-003-handoff.md`
- `scripts/portability/static-server.mjs`
- `tests/integration/portability.test.ts`
- `vitest.portability.config.ts`

Modified across the preliminary candidate and remediation:

- `README.md`
- `astro.config.mjs`
- `docs/adr/README.md`
- `docs/product/master-plan.md` (§11.8 queue-staging clarification only)
- `docs/runbooks/current-work.md`
- `package.json`
- `src/pages/index.astro`
- `tests/integration/portability.test.ts`

## Self-review

- Reviewed the full SBLA-003 diff from its exact SBLA-001 dependency and the
  bounded remediation diff from `84c3e06...`.
- Confirmed no stable command/gate was renamed, removed, weakened, or reordered
  around its prerequisites.
- Confirmed all ADR statuses remain Proposed and no owner approval is implied.
- Confirmed the owner-authorized master-plan clarification is limited to queue
  staging and does not approve the Proposed ADRs.
- Confirmed provider facts are dated and mapped to exact sources; inference,
  measured shell bytes, and budget-derived capacity inputs are labelled
  separately.
- Confirmed the analytics and cost ADRs agree: optional pageview analytics is
  included as one script plus two reports per completed view, while custom
  events, raw logs, and persistent per-user records are zero.
- Confirmed portability claims stop at the current homepage/output and record
  the recursive expansion gate for future routes and assets.
- Confirmed R2 is excluded rather than protected by a non-blocking budget alert.
- Confirmed the proof repo is non-production, has no custom domain, contains no
  secret/source/workflow, and serves bytes identical to the local artifact.

The earlier handoff's “no Important defect” statement was invalidated by the
spec-compliance failure at `e8fe598...`; this handoff supersedes it rather than
hiding the review result.

After applying every recorded repair and rechecking the six criteria against
the bounded diff, self-review found no remaining Critical or Important defect.

## Remaining concerns and owner decisions

- Provider quotas and terms are time-unstable; reverify by 2026-12-01 and before
  production provider activation.
- Future HTML/JS/image/model/Pagefind weights, traffic mix, build frequency,
  object request count, and report payload are capacity inputs, not production
  measurements or a forecast. Replace them at SBLA-012/015/016 and rerun all
  scenarios before production provider activation.
- No Cloudflare account/project was authenticated here. The production Pages
  project, CSP/privacy integration, optional analytics beacon, and weekly quota
  review remain future implementation; none is falsely claimed configured.
- The official Cloudflare Web Analytics Limits page documents no ingestion
  quota, and the FAQ says custom events are not supported. Analytics must remain
  optional, pageviews-only, and launch-nonblocking until reverified.
- GitHub Pages is a public non-production proof, not a commercial fallback for
  the full atlas. Its repository should be removed or replaced if its proof
  purpose ends or commercial restrictions become relevant.
- Owner approval is still required for the proposed provider direction, $0
  model, and optional analytics choice.

## Required independent reviewer action

Review the final branch without repairing it and write the exact append-only
report `reviews/releases/SBLA-003-r1.md`. Return PASS or FAIL per criterion:

1. All five ADR decisions, alternatives, consequences, and reversal costs match
   master plan §§11.1–11.2 and Phase 0 task 0.2, including no runtime AI.
2. Every decision-relevant provider fact is supported by its dated official
   source and no inference is presented as a provider guarantee.
3. The three-scenario Phase 0 capacity model measures all current output,
   labels every future-component ceiling without calling it measured or a
   forecast, models two reports per completed view, and preserves the mandatory
   SBLA-012/015/016 pre-activation measurement rerun.
4. The no-auto-charge rule is satisfied by excluding metered services, and the
   70%/85% alert limitation and fallback are honest.
5. The optional analytics decision obeys the privacy/event/log restrictions and
   is represented consistently in the cost model.
6. One unchanged current-shell artifact actually deploys and works at a second
   static host, while the prose makes no future-route/asset coverage claim and
   imposes the recursive expansion gate before those outputs are added.
7. ADR 0002 stays clear of SBLA-007 schema ownership and no later-task scope is
   pre-empted.
8. The accepted SBLA-002 operating model, stable command contract, claim ledger,
   and owner-approval boundary remain intact.
