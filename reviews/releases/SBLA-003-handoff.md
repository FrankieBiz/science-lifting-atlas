# Handoff: SBLA-003 — Architecture, hosting, analytics, and $0 infrastructure ADRs

**Status:** Account-B Claude Review Round 1 at `c9c9fbe...` returned FAIL with
five Important and six Minor findings, and a late addendum from that same review
added one Important parser finding. The immutable artifacts are preserved at
`reviews/releases/SBLA-003-r1.md` and
`reviews/releases/SBLA-003-r1-addendum.md`. All twelve combined findings are
implemented. A final pre-review probe found that default parser settings missed
`<noscript>` fallback resources and walked inert `<template>` contents; that
bounded follow-up is implemented and freshly verified. Fresh independent review
remains pending.
Internal review returned With fixes for one ledger-lifecycle defect and one
inventory omission; both are repaired in a bounded follow-up. All five ADRs
remain **Proposed**; Account-B Round 2 and owner approval remain pending.

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

## Inputs and exact paths

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
- Spec-remediation implementation/handoff commit:
  `627f8360d02d05050872f3615ea98345eb33f1c1`
- Spec-remediation claim closure and code-quality review candidate:
  `16fda3b24b5f9905ded03cec4da7b86391ef00ab`
- Code-quality remediation claim commit:
  `da9eb913dd5c25249396a21792f24da41fe66514`
- Code-quality remediation implementation commit:
  `eed479e7b28bafdfeeea534fa868e67ce34474bb`
- Code-quality remediation handoff and closed-claim candidate:
  `c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203`
- Account-B Round 1 report commit/integration:
  `4e1c0b8182beb20a97ade4c5f7ddca5aaedb2c59` /
  `95d3ac3de9f352b5d79b0f506d188d110ee180a2`
- Round 1 remediation claim and exact-path expansions:
  `f221d728f85022a6ed133bcc57a6ea07a75a8fc5` /
  `107266ac6f51d597797aa5e2e4caf53b9ae59695` /
  `d2fdea27af071de043b1e72596a536a7d6bf3152`
- Round 1 remediation implementation/handoff candidate:
  `618af60fea08b0c47f1435761e503b35d3e9f4b6`
- Internal review report commit/integration:
  `53645c87ea426f5d9d9f37af7bcf87fcbafe4b45` /
  `8155f5abad2e915d4fe21998da611dbca500b9cd`
- Internal-review remediation claim commit:
  `fc04180ce83656322b44b18e672271df12cd17c6`
- Internal-review remediation closure candidate:
  `21ef3f8ddd1080536ce3b9ba0a4d14727750292b`
- First Round 2 coordination claim, canceled before dispatch after the late
  addendum was discovered:
  `6732db34efa4bfaa93fa330822bafaee6c139715`
- Late Account-B Round 1 addendum preservation commit:
  `07eccccd5977b0223473b2aa69d350462708b683`
- R1-I-6 remediation claim commit:
  `bf8522d7f5eeca8c215f80e49ceeb0abda04eaa1`
- First post-remediation Round 2 claim, canceled before dispatch when the
  pre-claim fallback probe arrived:
  `41a2b017a56b3b127e4b65957fb336170badd289`
- No-JavaScript fallback remediation claim commit:
  `c42b17ded508e90058d67cf986fc862fb6f2ac62`
- Branch: `codex/SBLA-003-architecture-adrs`
- Worktree: `.worktrees/sbla-003-architecture-adrs`
- The spec-remediation and code-quality-remediation claims were each committed
  in `docs/runbooks/current-work.md` before their bounded files were edited. The
  earlier portability claim was separately expanded before `astro.config.mjs`
  and `src/pages/index.astro` were edited.

The remediation preserves the accepted SBLA-002 operating model. It does not
define the SBLA-007 schemas, select SBLA-004–006 assets, or build later product
surfaces.

## Constraints

- Codex owns only the bounded remediation paths recorded in
  `docs/runbooks/current-work.md`; the Account-B review report is immutable.
- Do not back-date the two omitted internal review reports. Record the process
  omission in the recovery log and require exact claims plus append-only reports
  for every future review round.
- Do not approve a provider, create a production project, attach a domain,
  enable a paid or metered service, or activate analytics in this task.
- Keep the current one-page portability proof honest. Nested routes, Pagefind,
  fonts, JSON, CSS `url()`, and GLB coverage remain later-task gates.
- Preserve the stable command contract and the accepted SBLA-002 role model.
- No runtime AI, scientific content, evidence schema, or anatomy asset is in
  scope.

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
- `docs/adr/0004-analytics.md` selects no analytics for launch and retains
  Cloudflare Web Analytics only as an optional post-launch candidate through
  automatic injection with an observed SRI attribute. It prohibits manual
  embedding, raw queries/free text, persistent per-user IDs, raw log export,
  and unsupported custom events.
- `docs/adr/0005-zero-cost-infrastructure-model.md` separates measured
  foundation output from the Phase 0 hard-capacity envelope, labels every
  remaining target/assumption, separates the zero-analytics launch baseline
  from the optional sensitivity, and covers every required dimension at all
  three traffic scenarios.
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

The compliance re-review of those six repairs passed at `16fda3b...`; that is
not an independent Claude Review or final ADR approval.

### Code-quality remediation

| Finding at `16fda3b...`                                      | Repair                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Important: request parsing and filesystem escape hazards     | Malformed request encoding returns 400 without terminating the handler; encoded `..` segments return 403; lexical and resolved-real-path containment blocks escaping symlinks; expected filesystem outcomes map to 403/404 and unexpected faults remain visible as 500 |
| Important: resource discovery ignored non-`/assets/` paths   | Added one typed collector for same-origin resource-bearing `href`, `src`, and `srcset`; the root and project-mount checks now test every discovered current-homepage resource for mount containment and HTTP 200                                                       |
| Minor: setup/teardown could leak or hang                     | Server variables are optional; the shared close helper resolves when absent and rejects close errors; partial startup closes the first server; fixture teardown aggregates cleanup failures                                                                            |
| Minor: README misstated direct command behavior              | README now states that `pnpm test:portability` consumes existing `dist/`, documents `pnpm build && pnpm test:portability` for direct use, and notes that `pnpm verify` already builds first                                                                            |
| Minor: Vitest include was broader than the portability suite | The portability config now includes only `tests/integration/portability.test.ts` and focused tests below `tests/integration/portability/`                                                                                                                              |
| Minor: status prose was stale                                | README and this handoff now state that spec remediation/re-review passed, the code-quality fix is implemented with re-review pending, and independent Claude Review/owner approval remain                                                                              |

The resource fixture proves the former false-negative path directly: a valid
relative stylesheet does not mask root-absolute `/favicon.svg`, `/poster.webp`,
`/app.js`, or a root-absolute `srcset` candidate. Navigation anchors,
`data:`/`blob:`/`mailto:` values, external origins, and non-resource
`data-src` attributes are excluded from this byte-fetch check; same-origin
navigation remains covered by its separate test.

### Account-B Round 1 remediation

The immutable Account-B report `reviews/releases/SBLA-003-r1.md` reviewed
`c9c9fbe...` and returned FAIL with no Critical, five Important, and six Minor
findings. A late artifact from the same review session is preserved independently
at `reviews/releases/SBLA-003-r1-addendum.md`; it adds one Important finding and
does not rewrite the original report. Each combined finding was checked against
the repository before remediation.

| Finding                                                          | Verified repair                                                                                                                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1-I-1: ADRs 0003/0005 contradicted each other on Netlify        | ADR 0003 now agrees that the 15 GB maximum cannot carry even the 10k hard-capacity scenario.                                                                                                                                          |
| R1-I-2: `assetsPrefix: '.'` nested-route failure was undisclosed | ADR 0003 now marks both the asset prefix and `href="./"` mount-root-only and requires a route-depth-aware dual-mount replacement before any nested route.                                                                             |
| R1-I-3: the optional beacon ignored §11.7 SRI                    | ADR 0004 and the machine record select no analytics at launch, prohibit manual embedding, and allow optional automatic activation only after actual production HTML contains `integrity`.                                             |
| R1-I-4: this handoff violated §13.6                              | The handoff now contains the ten mandatory headings exactly once and in order, with explicit Constraints, Decisions, and Acceptance criteria.                                                                                         |
| R1-I-5: two internal reviews left no reports/claims              | The recovery log records the omission without fabricating retrospective reports and requires every future review to be pre-claimed and append-only.                                                                                   |
| R1-I-6: regex HTML parsing silently missed valid references      | The resource and navigation collectors now walk a standards-aware HTML parse tree, including quoted `>` characters, unquoted attributes, `<area href>`, responsive images, media posters, object data, and recognized image metadata. |
| R1-m-1: portability count/reference coverage was stale           | The original repair recorded twelve tests and `href`/`src`/`srcset` plus navigation coverage; the late parser remediation expands and records the current fifteen-test scope.                                                         |
| R1-m-2: targets were called ceilings                             | ADR 0005 now uses the 160 KB non-3D JS, 3 MB loop, and 10 MB 3D hard ceilings; remaining targets/allowances are labelled.                                                                                                             |
| R1-m-3: volatile beacon bytes carried false precision            | The 2026-09-03 30,294 raw / 10,125 gzip measurement and earlier drift are recorded; displayed scenario totals are rounded.                                                                                                            |
| R1-m-4: manifest digest recipe was missing                       | ADR 0003 and this handoff define the exact sorted per-file SHA-256 recipe.                                                                                                                                                            |
| R1-m-5: the harness returned 404 instead of a directory redirect | A focused RED test observed 404 for `/sub`; the minimal server change returns 308 to `/sub/`, and the focused suite is GREEN.                                                                                                         |
| R1-m-6: 8.1% of diagnostic gzip was called immaterial            | ADR 0005 reports the exact 214-byte contribution and percentage.                                                                                                                                                                      |

### Internal review follow-up

The claimed append-only internal report
`reviews/releases/SBLA-003-internal-r1.md` reviewed exact candidate
`618af60...` and returned **With fixes** with zero Critical, one Important, and
one Minor finding. Its substantive review passed the original eleven Account-B
Round 1 repairs, exact arithmetic, SRI decision, portability/security behavior,
and scope. That review preceded discovery of the late R1-I-6 addendum and did not
review the parser repair. The bounded follow-up closes both internal findings:

- **IR1-I-1:** the completed `SBLA-003 remediation R1` claim and the internal
  review claim are now closed in the ledger; only this exact two-path follow-up
  claim remains active until its corrected handoff is committed.
- **IR1-m-1:** `README.md` is now present in the complete Round 1 modified-file
  inventory below.

### Late Account-B addendum and parser remediation

The addendum was found in the still-open Account-B Round 1 session before Round
2 was dispatched. Its exact bytes are preserved at
`reviews/releases/SBLA-003-r1-addendum.md`: 10,368 bytes, 195 lines, SHA-256
`4d756a1935ffedca92f9ce7f502ec30c41f122a2dd88355ce05a3a8e20a91df3`.
The first Round 2 claim was canceled before any prompt or report was created, so
the parser defect could be repaired and independently reviewed with the rest of
the candidate.

The original regex split an HTML start tag at a `>` inside a quoted attribute.
The exact valid input `<img alt="Squat > Deadlift" src="/health.txt">` therefore
returned no resource, and `<area href>` was excluded from both resource and
navigation paths. Additional direct probes confirmed false negatives for
`poster`, `imagesrcset`, `<object data>`, recognized image metadata, and unquoted
attributes.

The bounded repair uses exact development dependency `parse5@8.0.1` to walk the
HTML tree. Resource collection is now an explicit element/attribute allow-list:
same-origin `href` on `<image>`/`<use>`, `src` on the supported media/embed/image/
script elements, `srcset`, `<link imagesrcset>`, `<video poster>`, `<object
data>`, and recognized image metadata. Navigation collection uses the same
parser for `<a href>` and `<area href>`. Generic metadata, lazy-load `data-src`,
fragments, external origins, and non-HTTP schemes remain intentionally excluded.

Before the formal Round 2 prompt was sent, Account B's still-open Round 1
session probed the repair and found two parser-mode behaviors. The observation
memo remains outside the repository and is explicitly not a review report: 124
lines, 7,611 bytes, SHA-256
`fd6f51b953e12902b8e04bdf8f51b7df024ba0c3fc266d7aef277b93f14843c3`.
Default parse5 scripting mode represented `<noscript>` children as raw text, so
the collector missed fallback resources loaded by a JavaScript-disabled
browser. The walker also descended into inert `<template>` content that a
browser does not fetch. The formal review claim was canceled before dispatch.
The repair parses static HTML with scripting disabled and no longer descends
into template document fragments.

The content-manifest acceptance digest is reproduced from inside `dist/` with:

```bash
find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256
```

The current artifact has no whitespace or newline in a filename. A future
filename-policy change must introduce and record a null-delimited manifest
format rather than silently changing this digest definition.

### Current provider evidence

`docs/adr/provider-quotas.json` records the 2026-09-01 provider verification and
the analytics/SRI decision re-verification on **2026-09-03**, from official
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
  supported. Cloudflare also says automatic injection adds `integrity`, while a
  manual embed cannot safely use SRI because the script is not version-pinned;
  the manual path is rejected. The exact source/access date for each fact is
  mapped in `provider-quotas.json`. The current official Limits page lists
  site/rule limits but no ingestion quota; that is a sourced absence, not an
  unlimited-capacity claim.

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
| Other files   |         9 |                 214 |
| Complete dist |     5,818 |               2,640 |

Those are measurements of the current shell only. The Phase 0 capacity model
measures every existing artifact/payload, uses master-plan hard ceilings where
they exist, and labels remaining targets or planning ceilings for future
HTML/JS/image/model/Pagefind components, without cache credit. It is not a
forecast. It records builds, Pages object GETs, actual zero R2 operations,
hypothetical R2 sensitivity, zero launch analytics, and a separate optional
two-report sensitivity with zero custom events, raw logs, or persistent user
records at 10k/100k/1M views.

The launch envelope is 5.067 MB per completed pageview, yielding
50.67/506.70/5,067.00 GB. The optional analytics sensitivity adds the currently
measured 10.125 KB gzip beacon plus two 1 KB reports per completed view, yielding
50.79/507.91/5,079.13 GB and 20 MB/200 MB/2 GB of unmeasured report payload.
SBLA-012/015/016 must replace all future-component inputs with representative
measurements and rerun every scenario before production provider activation.

The $0 result depends on a hard product boundary, not on staying within a
metered free allowance: use only Cloudflare Pages Free static delivery, launch
without analytics, and do not activate R2, Functions, Workers Paid, or another
metered product. Optional free analytics remains outside the launch baseline
until its automatic-injection integrity gate passes.

### Portability implementation and TDD evidence

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
   document-relative `href="./"`. The five-test suite at that point passed for
   the current homepage and its then-current HTML references/anchors at a root
   and project subpath.

Code-quality TDD cycles on 2026-09-01 and 2026-09-02:

1. **RED — request safety:** one focused file ran four cases: malformed `%ZZ`
   timed out with an unhandled `URIError`, one encoded traversal returned 404
   instead of the asserted explicit 403, and an escaping directory symlink
   returned 200 with the outside file body. The other encoded traversal case
   already returned 403. Result: three failed, one passed, one unhandled error.
2. **GREEN — request safety:** guarded URL/percent decoding, raw decoded-segment
   rejection, lexical containment, and `realpath` containment made all focused
   cases pass. Added checks prove a normal file remains 200, a missing file is
   404, and an unexpected `ENAMETOOLONG` filesystem fault is 500 rather than a
   disguised 404.
3. **RED — resource discovery:** the focused fixture could not import the
   not-yet-created collector, so the suite failed before running a test. The
   fixture requires a relative stylesheet plus root-absolute favicon, image,
   script, and `srcset` resources to be discovered even though the old
   `/assets/` substring filter would have seen only the stylesheet.
4. **GREEN — resource discovery:** the typed collector and shared mount helper
   made the fixture and both real deployment-mount checks pass. A follow-up RED
   fixture showed that `data-src` was incorrectly captured as `src`; anchoring
   the attribute matcher to attribute boundaries returned it to GREEN while
   retaining explicit exclusions for navigation and unsupported/external URLs.
5. **GREEN — pre-R1 portability suite:** three files and eleven tests passed.
   The main four tests covered the current built homepage at both mounts; the
   seven focused tests covered resource collection and server safety/error
   behavior.

Round 1 directory-behavior TDD on 2026-09-03:

1. **RED:** the focused real-server test requested `/sub` for a fixture
   containing `sub/index.html` and received 404 instead of the required redirect.
2. **GREEN:** the server now returns 308 with `Location: /sub/`; the redirected
   page returns 200 with the expected bytes. The full portability suite now has
   three files and twelve tests.

Late Round 1 parser-remediation TDD on 2026-09-04:

1. **RED — resources:** the focused suite returned no `/health.txt` for an
   `<img>` whose earlier quoted attribute contained `>`, and discovered only the
   video source from a fixture that also required poster, unquoted image,
   `imagesrcset`, object-data, and metadata references. Result: two failed, one
   passed.
2. **GREEN — resources:** the parse-tree collector made all three focused tests
   pass. The first strict typecheck exposed an unchecked `content` access; an
   explicit property guard made lint and typecheck pass.
3. **RED — navigation:** the new quoted-`>` anchor and `<area href>` test failed
   because the shared navigation collector did not yet exist. Result: one
   failed, three passed.
4. **GREEN — navigation and complete focused scope:** the parser-backed
   navigation collector made all four focused tests pass. The full portability
   suite passed three files and fifteen tests, including a mixed data/network
   `srcset` case that still discovers the network candidate.

Pre-review fallback-parser TDD on 2026-09-04:

1. **RED:** the focused suite expected a `<noscript>` poster to be collected and
   an inert `<template>` image to be ignored. Both tests failed exactly: the
   poster result was empty and the template result contained its image.
2. **GREEN:** parsing with `scriptingEnabled: false` exposed no-JavaScript
   fallback elements; stopping at template document fragments removed the inert
   false positive. All six focused parser tests passed, followed by clean ESLint
   and Astro diagnostics.

Astro documents standard anchor navigation and does not rewrite manually
authored root links for `base`. The current homepage's document-relative link is
correct because that page sits at the mount root; it is not a general nested
route solution.

The suite covers current HTML navigation plus the explicit HTML resource
allow-list above with standards-aware quoted/unquoted parsing. It does not
recursively inspect future routes or CSS `url()`, JSON, Pagefind, font, or GLB
dependencies. Before any task adds/nests routes or adds an asset class, it must
extend the suite to recursively enumerate every `dist/**/*.html`, exercise every
route at root and subpath, check all same-origin HTML references/anchors and
relevant CSS/JSON/Pagefind/font/GLB references, and verify route-aware home
navigation from the same unchanged artifact.

### Exact current-shell second-host deployment evidence

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

The 2026-09-02 code-quality remediation changes only the local portability
server/tests/configuration and status documentation; it does not change an Astro
source, build configuration, or generated artifact input. A fresh build
reproduced content-manifest
`f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`.
The live proof was rechecked afterward: page, referenced CSS, `./` navigation,
and `health.txt` each returned HTTP 200, and downloaded page/CSS bytes still
matched the rebuilt local files at SHA-256 `bc1ac5107...` and `76a9808cd...`
respectively. The existing public artifact proof therefore remains valid; no
redeployment was needed or performed.

## Decisions made

- Retain Cloudflare Pages Free static delivery as the proposed host and keep R2,
  Functions, Workers Paid, and every metered product disabled.
- Launch without analytics. Cloudflare Web Analytics remains an optional
  post-launch candidate only through automatic injection after the actual
  production HTML is verified to contain an `integrity` attribute; manual
  embedding is prohibited because the beacon is not version-pinned.
- Use master-plan hard ceilings in the capacity envelope wherever they exist.
  Keep targets or task-local planning ceilings only where the plan defines no
  hard ceiling, and label them accordingly.
- Keep `build.assetsPrefix: '.'` for the current mount-root-only shell, while
  recording that it and `href="./"` fail for nested routes. The first task that
  adds a nested route must implement and prove a deterministic route-depth-aware
  replacement against both mounts from one unchanged artifact.
- Make the local portability harness redirect directory requests without a
  trailing slash so it does not diverge from ordinary static-host behavior.
- Parse HTML with `parse5@8.0.1` and explicit element/attribute allow-lists for
  both resources and navigation; do not use start-tag regular expressions for
  security- or acceptance-relevant discovery.
- Parse static output with scripting disabled to inspect `<noscript>` fallbacks,
  and exclude inert `<template>` document fragments until application code
  instantiates them.
- Define the exact content-manifest digest recipe in the ADR and this handoff so
  the live-artifact identity can be independently reproduced.
- Preserve the two missing internal-review records as a recovery-log omission;
  do not fabricate retrospective reports.

## Tests/checks run and results

The repository command contract was freshly verified with Node.js `v24.20.0`
and pnpm `11.24.0`. The official Node distribution checksum passed before the
temporary pinned runtime was used.

- Post-mainline baseline before remediation: `pnpm install --frozen-lockfile`
  PASS; `pnpm verify` PASS with 7 unit files/47 tests, 4 portability tests,
  production build, and foundation contract.
- Spec-remediation `pnpm verify`: PASS with Prettier, ESLint (0 warnings), Astro
  diagnostics (0 errors/warnings/hints), 7 unit files/47 tests, foundation-mode
  content/graph/evidence validation, production build, 5 portability tests, and
  foundation contract.
- Code-quality-remediation `pnpm verify`: PASS with Prettier, ESLint (0
  warnings), Astro diagnostics (0 errors/warnings/hints), 7 unit files/47 tests,
  foundation-mode content/graph/evidence validation, production build, 3
  portability files/11 tests, and foundation contract.
- Round 1 remediation `pnpm install --frozen-lockfile`: PASS; `pnpm verify`:
  PASS with Prettier, ESLint (0 warnings), Astro diagnostics across 37 files (0
  errors/warnings/hints), 7 unit files/47 tests, foundation-mode
  content/graph/evidence validation, production build, 3 portability files/12
  tests, and foundation contract.
- The first focused post-GREEN typecheck exposed one strict-JS
  `string | undefined` diagnostic in raw-path extraction; tracing it to indexed
  `split` access and replacing that access with an explicit suffix index made
  the focused tests, ESLint, and Astro diagnostics all pass on the next run.
- Round 1 remediation `pnpm test:e2e`: PASS, 1 Chromium test including the
  JavaScript-disabled static foundation.
- Fresh-build content-manifest comparison: PASS at
  `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`.
- Independent capacity arithmetic: PASS at 5.067 MB launch and 5.079125 MB
  optional per completed view; all transfer/report scenario values reproduce.
- Exact §13.6 heading assertion: PASS for all ten headings, once and in order.
- Live proof recheck on 2026-09-03: PASS with HTTP 200 for page, CSS,
  document-relative navigation, and health; rebuilt-local/downloaded page, CSS,
  and health SHA-256 values match byte-for-byte.
- `jq empty docs/adr/provider-quotas.json`: PASS.
- README/master-plan/ADR/handoff relative-link check: PASS, 19 checked and 0
  broken.
- All 18 unique URLs in `provider-quotas.json`: reachable on 2026-09-03; the
  decision-relevant analytics FAQ, setup, and overview pages were also read
  directly.
- Beacon transfer remeasurement on 2026-09-03: PASS, 30,294 identity bytes and
  10,125 gzip body bytes; `cache-control: public, max-age=86400`; ETag
  `W/"2026.9.1"`.
- Original Round 1 finding assertions: PASS for all eleven original repairs, all
  five Proposed statuses, launch/optional model separation, then-current
  reference/test counts, and absence of stale scenario totals.
- Round 1 remediation `git diff --check`: PASS.
- R1-I-6 first focused RED: expected quote-safe and expanded resource discovery;
  two tests failed and one passed.
- R1-I-6 resource GREEN: three focused tests passed; the subsequent strict
  typecheck diagnostic was repaired with explicit property narrowing.
- R1-I-6 navigation RED/GREEN: the missing collector produced one failed/three
  passed, then the shared parser-backed implementation produced four/four.
- R1-I-6 current portability check: PASS, 3 files/15 tests; ESLint and Astro
  diagnostics also PASS with 0 errors, warnings, or hints.
- Combined Round 1 remediation `pnpm install --frozen-lockfile`: PASS with the
  pinned lockfile and existing pnpm store.
- Combined Round 1 remediation `pnpm verify`: PASS with Prettier, ESLint (0
  warnings), Astro diagnostics across 37 files (0 errors/warnings/hints), 7 unit
  files/47 tests, foundation-mode content/graph/evidence validation, production
  build, 3 portability files/15 tests, and the foundation contract.
- Combined Round 1 remediation `pnpm test:e2e`: PASS, 1 Chromium test including
  the JavaScript-disabled static foundation.
- Combined Round 1 remediation `pnpm audit --audit-level high`: PASS with no
  known vulnerabilities. `parse5@8.0.1` is MIT-licensed and its lockfile
  integrity is recorded.
- Post-remediation content-manifest comparison: PASS at
  `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`;
  the parser/test dependency does not change the built artifact.
- Pre-review fallback parser RED: PASS as a diagnostic, with both new tests
  failing for the expected `<noscript>` false negative and `<template>` false
  positive.
- Pre-review fallback parser focused GREEN: PASS, 1 file/6 tests; ESLint and
  Astro diagnostics also PASS with 0 errors, warnings, or hints.
- Final fallback-parser `pnpm verify`: PASS with Prettier, ESLint (0 warnings),
  Astro diagnostics across 37 files (0 errors/warnings/hints), 7 unit files/47
  tests, foundation-mode content/graph/evidence validation, production build, 3
  portability files/17 tests, and the foundation contract.
- Final fallback-parser `pnpm test:e2e`: PASS, 1 Chromium test with JavaScript
  disabled.
- Final content-manifest comparison: PASS and unchanged at
  `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`.

### Self-review

- Reviewed the full SBLA-003 diff from its exact SBLA-001 dependency and the
  bounded remediation diff from `84c3e06...`.
- Confirmed no stable command/gate was renamed, removed, weakened, or reordered
  around its prerequisites.
- Confirmed all ADR statuses remain Proposed and no owner approval is implied.
- Confirmed the owner-authorized master-plan clarification is limited to queue
  staging and does not approve the Proposed ADRs.
- Confirmed provider facts are dated and mapped to exact sources; inference,
  measured shell bytes, master-plan hard ceilings, and remaining planning
  inputs are labelled separately.
- Confirmed the analytics and cost ADRs agree: the launch baseline has no
  analytics transfer, while the optional integrity-gated sensitivity includes
  one script plus two reports per completed view; custom events, raw logs, and
  persistent per-user records are zero in both modes.
- Confirmed portability claims stop at the current homepage/output and record
  the recursive expansion gate for future routes and assets, including the
  disclosed mount-root-only asset prefix/home link.
- Reviewed the bounded code-quality diff from `16fda3b...`: malformed targets
  cannot reject outside the request handler, decoded traversal is rejected
  before filesystem access, resolved paths cannot cross the real served root,
  and unexpected filesystem faults are observable as 500.
- Confirmed the parse-tree collectors preserve quoted `>` and unquoted
  attributes; cover the explicit same-origin `href`, `src`, `srcset`,
  `imagesrcset`, `poster`, `data`, and recognized metadata allow-list; and
  include both `<a>` and `<area>` navigation without conflating unsupported/
  external schemes or lazy-load `data-src` with static resource fetches. Both
  mounts enforce containment and HTTP 200 for every collected current-homepage
  resource.
- Confirmed static parsing exposes resources loaded only in the no-JavaScript
  `<noscript>` path and does not require inert template resources to exist
  before client code instantiates them.
- Confirmed startup/teardown closes partial or complete server sets and reports
  close/cleanup errors rather than hanging or discarding them.
- Confirmed the stable command contract is unchanged: `pnpm verify` still builds
  before portability; direct `pnpm test:portability` still intentionally
  consumes the existing artifact.
- Confirmed R2 is excluded rather than protected by a non-blocking budget alert.
- Confirmed the proof repo is non-production, has no custom domain, contains no
  secret/source/workflow, and serves bytes identical to the local artifact.

The earlier handoff's “no Important defect” statement was invalidated by the
spec-compliance failure at `e8fe598...`; this handoff supersedes it rather than
hiding the review result.

The final fallback-parser follow-up is freshly verified and still requires fresh
independent review. This handoff does not claim acceptance or a passing Round 2
verdict.

## Known uncertainties

- Provider quotas and terms are time-unstable; reverify by 2026-12-01 and before
  production provider activation.
- Future HTML/JS/image/model/Pagefind weights, traffic mix, build frequency,
  object request count, and report payload are capacity inputs, not production
  measurements or a forecast. Replace them at SBLA-012/015/016 and rerun all
  scenarios before production provider activation.
- No Cloudflare account/project was authenticated here. The production Pages
  project, CSP/privacy integration, optional automatically injected analytics,
  and weekly quota review remain future implementation; none is falsely claimed
  configured. Manual beacon embedding is prohibited.
- The official Cloudflare Web Analytics Limits page documents no ingestion
  quota, and the FAQ says custom events are not supported. Analytics must remain
  disabled at launch, optional, pageviews-only, and launch-nonblocking. Optional
  activation also requires an observed `integrity` attribute in production HTML.
- GitHub Pages is a public non-production proof, not a commercial fallback for
  the full atlas. Its repository should be removed or replaced if its proof
  purpose ends or commercial restrictions become relevant.
- Owner approval is still required for the proposed provider direction, $0
  model, no-analytics launch baseline, and optional post-launch analytics gate.

## Files created or modified

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

Created during code-quality remediation:

- `tests/integration/portability/resource-references.test.ts`
- `tests/integration/portability/resource-references.ts`
- `tests/integration/portability/server-lifecycle.ts`
- `tests/integration/portability/static-server.test.ts`

Created by the independent Account-B review:

- `reviews/releases/SBLA-003-r1.md`
- `reviews/releases/SBLA-003-r1-addendum.md`

Created by the independent internal review:

- `reviews/releases/SBLA-003-internal-r1.md`

Modified during Round 1 remediation:

- `README.md`
- `docs/adr/0003-hosting-and-asset-delivery.md`
- `docs/adr/0004-analytics.md`
- `docs/adr/0005-zero-cost-infrastructure-model.md`
- `docs/adr/provider-quotas.json`
- `docs/runbooks/current-work.md`
- `reviews/releases/SBLA-003-handoff.md`
- `scripts/portability/static-server.mjs`
- `tests/integration/portability/static-server.test.ts`

Modified during late R1-I-6 remediation:

- `README.md`
- `docs/adr/0003-hosting-and-asset-delivery.md`
- `docs/runbooks/current-work.md`
- `package.json`
- `pnpm-lock.yaml`
- `reviews/releases/SBLA-003-handoff.md`
- `tests/integration/portability.test.ts`
- `tests/integration/portability/resource-references.test.ts`
- `tests/integration/portability/resource-references.ts`

Modified during the pre-review fallback-parser follow-up:

- `README.md`
- `docs/adr/0003-hosting-and-asset-delivery.md`
- `docs/runbooks/current-work.md`
- `reviews/releases/SBLA-003-handoff.md`
- `tests/integration/portability/resource-references.test.ts`
- `tests/integration/portability/resource-references.ts`

## Required reviewer action

Independently review the Round 1 remediation from
`95d3ac3de9f352b5d79b0f506d188d110ee180a2` through the new immutable candidate.
Do not repair it. Write the exact append-only report
`reviews/releases/SBLA-003-r2.md` only after Codex commits its exact-path claim.
Return PASS or FAIL per criterion:

1. All five ADR decisions, alternatives, consequences, and reversal costs match
   master plan §§11.1–11.2 and Phase 0 task 0.2, including no runtime AI.
2. Every decision-relevant provider fact is supported by its dated official
   source and no inference is presented as a provider guarantee.
3. The three-scenario Phase 0 capacity model measures all current output, uses
   hard ceilings where the master plan defines them, labels every remaining
   target or planning ceiling, separates the no-analytics launch baseline from
   the two-report optional sensitivity, and preserves the mandatory
   SBLA-012/015/016 pre-activation measurement rerun.
4. The no-auto-charge rule is satisfied by excluding metered services, and the
   70%/85% alert limitation and fallback are honest.
5. The no-analytics launch baseline and optional automatic-injection gate obey
   §11.7 SRI plus the privacy/event/log restrictions and are represented
   consistently in the machine record and capacity model.
6. One unchanged current-shell artifact actually deploys and works at a second
   static host, while the prose makes no future-route/asset coverage claim and
   imposes the recursive expansion gate before those outputs are added.
7. ADR 0002 stays clear of SBLA-007 schema ownership and no later-task scope is
   pre-empted.
8. The accepted SBLA-002 operating model, exact handoff format, recovery log,
   stable command contract, claim ledger, and owner-approval boundary remain
   intact.
9. All six Important and six Minor combined Round 1 findings are closed with
   evidence, including the quote-safe parser, `<area>` and `<noscript>` coverage,
   inert-template exclusion, the trailing-slash RED/GREEN test, and reproducible
   manifest recipe.

## Acceptance criteria

- ADRs 0003 and 0005 agree that Netlify's 15 GB maximum cannot carry even the
  10,000-view hard-capacity scenario.
- ADR 0003 states that `assetsPrefix: '.'` and `href="./"` are mount-root-only,
  defines the future route-depth-aware gate, names all current HTML reference
  coverage, and records the seventeen-test suite accurately.
- The exact late addendum digest is preserved, and parser tests prove quoted and
  unquoted attributes, `<area>` navigation, responsive-image sources, media
  posters, object data, recognized image metadata, and mixed data/network
  `srcset` handling.
- ADR 0004 and `provider-quotas.json` prohibit manual beacon embedding, select
  no analytics for launch, and require verified automatic-injection SRI before
  optional activation.
- ADR 0005 uses plan hard ceilings where available, exposes the remaining
  targets/assumptions, reports exact non-HTML/CSS gzip bytes, and gives both the
  zero-analytics launch model and optional sensitivity at 10k/100k/1M views.
- The content-manifest recipe reproduces
  `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`.
- The generic static server returns a tested trailing-slash redirect for a
  directory request without weakening traversal or symlink containment.
- This handoff contains the ten mandatory §13.6 headings exactly once and in
  order; the two missing internal-review reports are recorded as omissions, not
  fabricated retrospectively.
- The pinned `pnpm verify`, `pnpm test:e2e`, manifest comparison, live proof
  recheck, JSON parse, link check, and role/scope checks all pass with a clean
  worktree.
- Independent Account-B Round 2 returns PASS before the owner gate is applied.
