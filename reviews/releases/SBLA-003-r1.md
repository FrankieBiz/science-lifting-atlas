# Handoff: SBLA-003 Round 1 independent Claude Review

## Objective

Decide whether the SBLA-003 architecture, hosting, analytics, and $0
infrastructure ADR package at commit
`c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203` satisfies acceptance under the
authoritative queue row at `docs/product/master-plan.md:1752` and Phase 0 task
0.2, and under the eight criteria the builder's handoff nominates at
`reviews/releases/SBLA-003-handoff.md:450-478`.

This is the independent Claude Review round required by master plan §18 for
SBLA-003. It is the first round; no prior `reviews/releases/SBLA-003-r*.md`
exists. This report does not repair the artifact and no file under audit was
edited by this run.

### Independence statement

This is **distinct Claude Team account B**, acting as Claude Review, in a **new
session**. This session did not author SBLA-001, SBLA-002, SBLA-003, SBLA-004,
the Claude Research account-A readiness artifacts, or any SBLA-003 remediation.
It ignored all prior Claude sessions and re-derived every judgement below from
the repository, the pinned build, and live provider documentation.

Recorded as an explicit limit on that statement, consistent with
`reviews/releases/SBLA-002-r4.md:23-33` and
`reviews/releases/SBLA-002-r5.md:21-28`: account identity is a property of the
environment the owner provisioned. It cannot be proven from inside the
repository, because every commit carries the same Git author
`Francis Bisignano <frankabisignano@gmail.com>`. The constraint at
`docs/runbooks/operating-policy.json:17-22` therefore rests on owner
provisioning plus the ledger record, not on in-repository evidence.

## Inputs and exact paths

### Commits, branch, worktree

| Item                        | Value                                                 |
| --------------------------- | ----------------------------------------------------- |
| Repository                  | `/Users/frankbisignano/dev/science-lifting-atlas`     |
| Artifact commit reviewed    | `c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203`            |
| Artifact tree SHA           | `a56a5cb07c0ae0297485e9d20d4f23cab00945c4`            |
| Artifact parent SHA         | `0f55b09ff2d286b0a2c3c3725d91b5f0ec037e34`            |
| `docs/adr` tree SHA         | `c0d4a79d6cd46c92855ac83601f5b191ab0b1123`            |
| `provider-quotas.json` blob | `917558e34ea3047b6b40de47f4c2e960afc06757`            |
| Codex exact-path claim      | `f3d25d12d64402e9fb36353b86a5e8dd37a34691`            |
| Branch                      | `claude-review/SBLA-003-r1`                           |
| Worktree                    | `.worktrees/sbla-003-claude-review-r1`                |
| Role                        | `claude-review`, account B                            |
| Sole permitted output path  | `reviews/releases/SBLA-003-r1.md`                     |
| Accepted §18 dependency     | `141b63913b75791a6630303fdd1936fc615b3471` (SBLA-001) |
| Accepted mainline merged    | `77a76231df2f9ce8c127885e1383e1da4034b1f5` (SBLA-002) |
| Review date                 | 2026-09-02                                            |

### Pre-write verification (four required conditions, all passed)

1. `git rev-parse --abbrev-ref HEAD` → `claude-review/SBLA-003-r1`.
2. `git rev-parse HEAD` → `c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203`.
3. `git status --porcelain` → empty before and after this review.
4. `git show f3d25d1:docs/runbooks/current-work.md` records exactly one active
   claim: task `SBLA-003 review R1`, role `Claude Review (account B)`, branch
   `claude-review/SBLA-003-r1`, worktree `.worktrees/sbla-003-claude-review-r1`,
   base commit `c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203`, expected handoff
   `reviews/releases/SBLA-003-r1.md`, and paths owned
   "Exact append-only report path `reviews/releases/SBLA-003-r1.md` only".
   `git show --name-only f3d25d1` touches only
   `docs/runbooks/current-work.md`, so the claim is coordination-only and does
   not contaminate the reviewed artifact.

### Artifacts read without editing

- `docs/product/master-plan.md` in full, with §§4.1, 10, 11.1, 11.2, 11.7,
  11.8, 11.9, 12.2, 13.6, 18 read line by line.
- `AGENTS.md`, `CLAUDE.md`, `README.md`.
- `docs/adr/README.md`, `docs/adr/0001`–`0005`, `docs/adr/provider-quotas.json`.
- `docs/runbooks/current-work.md`, `handoff-template.md`,
  `operating-policy.json`, `branch-and-worktree.md`, `claude-environments.md`.
- `reviews/releases/SBLA-003-handoff.md`; `SBLA-001-handoff.md`,
  `SBLA-002-handoff.md`, and `SBLA-002-r1`–`r5` for format and severity
  precedent.
- `astro.config.mjs`, `src/pages/index.astro`, `package.json`,
  `vitest.portability.config.ts`, `.github/workflows/ci.yml`,
  `scripts/portability/static-server.mjs`,
  `tests/integration/portability.test.ts`,
  `tests/integration/portability/{resource-references.ts,resource-references.test.ts,server-lifecycle.ts,static-server.test.ts}`,
  `scripts/foundation/verify.mjs`, `scripts/foundation/operating-model.mjs`.
- Git history of the ADR statements at issue, via
  `git log -L` on `docs/adr/0003` and `docs/adr/0005`.

## Constraints

- Claude Review may write only `reviews/`
  (`docs/runbooks/operating-policy.json:23-27`); this round's claim narrows that
  to the single path `reviews/releases/SBLA-003-r1.md`.
- Review reports are append-only. A second round creates `-r2`; this file is
  never edited in place (`CLAUDE.md:118-120`, `AGENTS.md:66-67`).
- This role never repairs the artifact under review (`AGENTS.md:38,43`). Every
  finding below is a finding, not a patch, and no remediation was attempted.
- Pending owner approval is not treated as a defect. All five ADRs are
  `Proposed` by design and §18 routes SBLA-003 through
  `Codex → Claude Review → Owner`.
- This round judges SBLA-003 only. SBLA-004–007 and SBLA-011–016 scope was
  checked for pre-emption but not reviewed on its merits.

## Work completed

Independent re-derivation of the package, in four passes: provider-fact
falsification against live official sources; arithmetic and unit
reconstruction from first principles; a fresh pinned-configuration build with
byte-level comparison against the live second-host deployment; and adversarial
probing of the portability harness.

### Provider facts re-verified from live official sources on 2026-09-02

Every decision-relevant fact in `docs/adr/provider-quotas.json` was re-read
today from the exact URL the file cites, one day after its recorded
`accessedOn` date. All 17 unique URLs returned HTTP 200 and, with one exception
noted under Known uncertainties, returned readable documentation.

| Recorded fact                                                                                                            | Independent result on 2026-09-02                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages Free 500 builds/month, 1 concurrent                                                                                | Confirmed verbatim: "Builds per month / 500", "1 build at a time" (Pages Limits, last updated Jul 16 2026)                                                                                                                            |
| Pages Free 20,000 files/site                                                                                             | Confirmed: "Cloudflare Pages sites can contain up to 20,000 files on the Free plan"                                                                                                                                                   |
| Pages 25 MiB per file                                                                                                    | Confirmed: "The maximum file size for a single Cloudflare Pages site asset is 25 MiB"                                                                                                                                                 |
| Pages 100 custom domains, 100 projects/account                                                                           | Confirmed (Free column `100`; "limit of 100 projects per account")                                                                                                                                                                    |
| Pages static asset requests free and unlimited                                                                           | Confirmed: "On both free and paid plans, requests to static assets are free and unlimited" (Pages Functions pricing)                                                                                                                  |
| Pages Functions 100,000 requests/day, midnight UTC reset                                                                 | Confirmed on the same page                                                                                                                                                                                                            |
| R2 free tier 10 GB-month, 1M Class A, 10M Class B, free egress                                                           | Confirmed verbatim in the R2 pricing free-tier table                                                                                                                                                                                  |
| R2 free tier Standard-only                                                                                               | Confirmed: "The free tier only applies to Standard storage, and does not apply to Infrequent Access storage"                                                                                                                          |
| R2 overage $0.015/GB-month, $4.50/M Class A, $0.36/M Class B                                                             | Confirmed in the Standard column of the R2 pricing table                                                                                                                                                                              |
| Threshold billing charges a payment method automatically                                                                 | Confirmed verbatim: "Cloudflare automatically generates a mid-cycle invoice… Your payment method on file is charged", and "applies to all Cloudflare products with usage-based pricing. This includes products such as R2"            |
| Budget alerts informational, do not cap                                                                                  | Confirmed verbatim: "Budget alerts are informational only. They do not pause or cap usage." Also "available to Pay-as-you-go accounts only"                                                                                           |
| Usage-based billing notifications are Professional-plus                                                                  | Confirmed: "If you are on a Professional plan or higher, you can monitor the usage of individual Cloudflare add-ons by turning on email notifications"                                                                                |
| GitHub Pages 1 GB published site, 1 GB source recommendation                                                             | Confirmed verbatim                                                                                                                                                                                                                    |
| GitHub Pages 100 GB/month soft bandwidth                                                                                 | Confirmed verbatim                                                                                                                                                                                                                    |
| GitHub Pages 10 builds/hour soft limit, not applicable with a custom Actions workflow                                    | Confirmed verbatim                                                                                                                                                                                                                    |
| GitHub Pages commercial restriction                                                                                      | Confirmed verbatim                                                                                                                                                                                                                    |
| Netlify Free 300 credits, hard limit                                                                                     | Confirmed: pricing page "300 credit limit"; credits doc "Free … 300 credits/month … Hard limit"                                                                                                                                       |
| Netlify "free plan is always free, with hard monthly limits that cannot be exceeded or incur any costs"                  | Confirmed verbatim on the pricing page FAQ                                                                                                                                                                                            |
| Netlify 20 credits/GB bandwidth, 2 credits/10,000 web requests, 15 credits/production deploy, 10 credits/GB-hour compute | Confirmed verbatim in the credits doc                                                                                                                                                                                                 |
| Netlify fixed 50%/75%/100% usage notices                                                                                 | Confirmed verbatim: "We'll notify you by email and in-app as you approach your limits at 50%, 75%, and 100% of usage"                                                                                                                 |
| Web Analytics free and privacy-first, no visitor personal data                                                           | Confirmed verbatim on the About page                                                                                                                                                                                                  |
| No cookies/localStorage/client-side state; no fingerprinting by IP or User Agent                                         | Confirmed verbatim on `cloudflare.com/web-analytics` and repeated on the Core Web Vitals page                                                                                                                                         |
| Traditional pages report at load and on leave                                                                            | Confirmed verbatim: "For traditional websites, not Single Page Applications (SPAs), the Web Analytics beacon reports to the /cdn-cgi/rum/ endpoint when the page has finished loading (load event) and when the user leaves the page" |
| Core Web Vitals report at first hidden visibility state after load                                                       | Confirmed verbatim on the data-origin-and-collection page                                                                                                                                                                             |
| No ingestion sampling; every received beacon recorded                                                                    | Confirmed verbatim: "The data ingestion pipeline does not apply sampling—every received beacon will be recorded"                                                                                                                      |
| Unsampled 7 days then ~10%                                                                                               | Confirmed verbatim                                                                                                                                                                                                                    |
| Query sampling 0.0001%–100%, filter- and volume-selected                                                                 | Confirmed verbatim                                                                                                                                                                                                                    |
| Query strings not logged                                                                                                 | Confirmed verbatim: "Cloudflare Web Analytics do not log query strings to avoid collecting potentially sensitive data"                                                                                                                |
| Custom events not supported                                                                                              | Confirmed verbatim: "Does Web Analytics support custom events? Not yet"                                                                                                                                                               |
| Limits page: 10 non-proxied sites, no proxied limit, 1,000 parallel, 0 Free rules                                        | Confirmed verbatim (Limits page, last updated Aug 12 2026)                                                                                                                                                                            |
| Limits page documents no ingestion quota                                                                                 | Confirmed. The page enumerates only site and rules limits. The file's framing of this as "a sourced absence, not unlimited capacity" is accurate                                                                                      |

No fact in `provider-quotas.json` was refuted. Every field labelled
`inference`, `capacityInference`, `proposedDirection`, `projectDecision`, or
`operationalFallback` is genuinely a project conclusion and is not presented as
a provider promise. The R2 exclusion is the strongest-evidenced decision in the
package: Cloudflare's own threshold-billing page states that accumulated
usage charges are collected from a payment method on file automatically, which
is exactly the failure mode §11.8 forbids.

### Arithmetic and units reconstructed from first principles

Every number in ADR 0005 was recomputed independently from the stated inputs
rather than checked against the builder's totals.

Weighted per-view derivation at a 90% non-3D / 10% anatomy mix:

- application JS: `0.9 × 100 KB + 0.1 × 180 KB = 108 KB` — matches line 83.
- poster images: `0.9 × 200 KB = 180 KB` — matches line 84.
- exercise loops: `0.9 × 1.5 MB = 1.35 MB` — matches line 85.
- 3D transfer: `0.1 × 6 MB = 0.6 MB` — matches line 87.
- sub-megabyte terms: `25 + 108 + 9.509 + 180 + 2 = 324.509 KB`.
- megabyte terms: `1.35 + 1 + 0.6 = 2.95 MB = 2,950 KB`.
- total: `3,274.509 KB = 3.274509 MB/page view` — matches line 89 exactly.

Scenario totals in decimal units (1 GB = 1,000 MB), recomputed column by
column, reproduce every published cell including the rounded `0.095` and
`0.951` analytics-JS entries:

- 10,000 views → `32.74509 GB`, published `32.75 GB`.
- 100,000 views → `327.4509 GB`, published `327.45 GB`.
- 1,000,000 views → `3,274.509 GB`, published `3,274.51 GB`.

Object operations at the eight-request planning allowance reproduce
`80,000 / 800,000 / 8,000,000`. The hypothetical R2 sensitivity at five reads
per 3D view reproduces `5,000 / 50,000 / 500,000`, all inside the verified
10-million Class B free allowance, which makes the ADR's statement that R2 is
excluded on principle rather than on capacity correct. Two reports per completed
view reproduce `20,000 / 200,000 / 2,000,000` reports and, at the explicit 1 KB
unmeasured ceiling, `20 MB / 200 MB / 2 GB` of budgeted ingestion. Custom
events, raw log export, and persistent per-user records are zero in every row,
matching ADR 0004's decision.

No arithmetic, unit, or scenario error was found.

### Fresh build reproduced byte-for-byte, and the live proof re-verified

The reviewed worktree could not be built in place because this session's
sandbox denies writes under the repository. An exact copy of the reviewed
worktree was made to a writable scratch directory, its stale `dist/` and
`.astro/` were set aside, and the artifact was rebuilt from source. The
repository itself was never written.

The rebuild independently reproduces every measurement in ADR 0005 and every
hash in ADR 0003:

| Quantity                       | ADR value                                                          | Independently measured                             |
| ------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------- |
| Files emitted                  | nine                                                               | nine                                               |
| `index.html` raw bytes         | 1,595                                                              | 1,595                                              |
| `index.html` gzip -9           | 733                                                                | 733                                                |
| `assets/index.*.css` raw bytes | 4,214                                                              | 4,214                                              |
| CSS gzip -9                    | 1,693                                                              | 1,693                                              |
| Other emitted files, raw       | 9                                                                  | 9 (six 1-byte `.gitkeep` plus 3-byte `health.txt`) |
| Complete `dist/` raw           | 5,818                                                              | 5,818                                              |
| Complete `dist/` gzip -9       | 2,640                                                              | 2,640                                              |
| `index.html` SHA-256           | `bc1ac51076b718db0343aa69136f25e9248360c3675fbe65da27333ae5187110` | identical                                          |
| CSS SHA-256                    | `76a9808cd41f62deae3f4c609fa4fd58d28a57f083b414a137e48aa20d271d5e` | identical                                          |
| Content-manifest SHA-256       | `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc` | identical                                          |

The manifest digest was reproduced as
`find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256` executed
inside `dist/`. That method is not documented anywhere in the package and had
to be recovered by trial; see finding R1-m-4.

The live second-host deployment was then re-verified over the network today:

| Check                                                               | Result on 2026-09-02                                                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `https://frankiebiz.github.io/sbla-003-portability-proof-20260901/` | HTTP 200, 1,595 bytes, SHA-256 `bc1ac510…`, byte-identical to the fresh local build                 |
| `…/assets/index.DlWfByZd.css`                                       | HTTP 200, 4,214 bytes, SHA-256 `76a9808c…`, byte-identical                                          |
| `…/health.txt`                                                      | HTTP 200 under the project mount                                                                    |
| Wordmark `./` navigation                                            | HTTP 200, final URL remains the project mount                                                       |
| `https://frankiebiz.github.io/` (host root)                         | HTTP 404, which confirms the superseded `href="/"` defect really did escape the mount               |
| Deployment repository                                               | public, `main` default, created 2026-09-01, no custom domain                                        |
| Deployment commit `569eef0d…`                                       | exists, message "deploy: correct mount-relative navigation", 2026-09-01T15:11:06Z                   |
| Deployment tree at that commit                                      | exactly the nine generated files; no application source, workflow, secret, or billing configuration |
| Pages run `33524170082`                                             | `pages build and deployment`, head SHA `569eef0d…`, completed, conclusion success                   |
| Superseded run `33515952080`                                        | head SHA `41090caa…`, matching ADR 0003's superseded-proof record                                   |
| Total workflow runs on the repository                               | 2, consistent with the recorded narrative                                                           |

The §11.8 clause "verify the site can export and deploy to a second static host
from the same build artifact" is satisfied for the current shell, and the
evidence is reproducible by a third party from this report alone.

### Adversarial probing of the portability harness

Thirteen hostile request targets were fired at
`scripts/portability/static-server.mjs` against a fixture containing an
out-of-root secret, an escaping directory symlink, and an escaping file
symlink. No probe leaked out-of-root content:

| Target                                   | Status | Body                             |
| ---------------------------------------- | ------ | -------------------------------- |
| `/../outside/secret.txt`                 | 403    | Forbidden                        |
| `/%2e%2e/outside/secret.txt`             | 403    | Forbidden                        |
| `/%252e%252e/outside/secret.txt`         | 404    | Not Found                        |
| `/..%2f..%2foutside/secret.txt`          | 403    | Forbidden                        |
| `/%2e%2e%5coutside/secret.txt`           | 403    | Forbidden                        |
| `/sub/../../outside/secret.txt`          | 403    | Forbidden                        |
| `/linkfile` (symlink to an outside file) | 403    | Forbidden                        |
| `/index.html%00.txt`                     | 403    | Forbidden                        |
| `//outside/secret.txt`                   | 404    | Not Found                        |
| `/%ZZ` (malformed encoding)              | 400    | Bad Request, handler stays alive |
| `/sub`                                   | 404    | Not Found                        |
| `/sub/`                                  | 200    | correct body                     |
| `/`                                      | 200    | correct body                     |

The layered defence is sound: the handler decodes inside `try`/`catch` and
returns 400 rather than dying on `URIError`; it rejects decoded `..` segments
before any filesystem call; it enforces lexical containment; and it enforces
`realpath` containment so no intermediate or terminal symlink can cross the
served root. `respondToFilesystemError` maps only `ENOENT`/`ENOTDIR`/`EISDIR`
to 404 and `EACCES`/`EPERM`/`ELOOP` to 403, leaving every other fault visible
as 500 — verified by the suite's own `ENAMETOOLONG` case. The resource
collector correctly discovers root-absolute `href`, `src`, and `srcset`
candidates that the former `/assets/` substring filter would have missed, and
correctly excludes navigation elements, `data:`, `blob:`, `mailto:`, external
origins, and `data-src`.

### Scope, role, and contract audit

- The SBLA-003 diff against the accepted mainline `77a7623` touches 21 files.
  Every one is inside Codex's authority. Nothing under `research/`,
  `content-drafts/`, or published `content/` was touched, and no schema,
  licensing, anatomy, or homepage-design work was pre-empted.
- The change to `docs/product/master-plan.md` is exactly the two-line
  owner-authorized §11.8 queue-staging clarification at line 1074 and nothing
  else, confirmed by a full-file diff.
- ADR 0002 explicitly reserves the entity and claim schemas to SBLA-007 in its
  header note and states the mechanism only. ADR 0003 defers real asset
  measurement to SBLA-005. ADR 0005 decision 4 defers HTML/JS/image inputs to
  SBLA-012, model/media to SBLA-015, and Pagefind to SBLA-016, which matches
  the §18 rows for those tasks. No later-task scope is consumed.
- The stable command contract in `AGENTS.md:76-84` is intact: `pnpm verify`,
  `test:e2e`, `test:a11y`, `test:visual`, `test:performance`, and
  `evidence:status` all still exist with their names unchanged.
  `test:portability` is an addition inside `verify`, which the contract permits,
  and `verify` still builds before it runs.
- `.github/workflows/ci.yml` is untouched by SBLA-003 and still pins
  `node@24.20.0` and pnpm `11.24.0`, then runs `pnpm verify` followed by
  `pnpm test:e2e`.
- The active-claims table is empty at the reviewed commit; the review claim
  lives only in the coordination commit `f3d25d1`, so this role's diff stays
  based on the exact reviewed artifact as
  `operating-policy.json:12` requires.

## Decisions made

- **The eight criteria the builder nominated were adopted, then extended.** A
  reviewer that only answers the author's own questions cannot find a defect
  the author did not anticipate. Two further criteria were added and judged:
  ADR internal consistency and completeness, and handoff-format plus
  review-record discipline. Both revealed Important findings.
- **Provider facts were re-read rather than diffed.** Checking that a URL still
  returns 200 is not verification; three of this round's confirmations required
  reading the page body, and one URL returns 200 with an error body to a plain
  client.
- **The build was reproduced, not trusted.** Reproducing `f73ea505…` from source
  is the only way to know that the live deployment serves this artifact and not
  a coincidentally similar one.
- **The nested-route hazard was proven, not asserted.** Rather than reason about
  `build.assetsPrefix: '.'`, a throwaway nested page was added in the scratch
  copy and built, and the emitted URL was fetched. The repository artifact was
  not modified.
- **Severity follows decision impact.** Findings that would change what a later
  task builds, or that break a canonical format contract, are Important.
  Findings that mislead a reader without changing a decision are Minor. Nothing
  found rises to Critical: no published claim, licence, or cost conclusion is
  wrong.
- **Pending owner approval was excluded from severity**, per the review brief
  and because §18 routes this task through the owner by design.

## Tests/checks run and results

### Pinned runtime — NOT satisfied, and this is a real limitation

`AGENTS.md:88-99` pins Node.js `v24.20.0` and pnpm `11.24.0`. Neither is
obtainable in this session:

- `node --version` → `v26.0.0` (Homebrew); the only other interpreter present
  is `/usr/local/bin/node` → `v24.14.0`. Both fall outside
  `engines.node: >=24.20.0 <25`.
- `pnpm --version` → `11.0.9`. `corepack pnpm --version` fails with
  `EPERM, mkdir '/Users/frankbisignano/.cache/node/corepack/v1'`, so the pinned
  pnpm cannot be provisioned.
- Consequently `pnpm install --frozen-lockfile`, `pnpm verify`, and
  `pnpm test:e2e` all abort with
  `ERR_PNPM_UNSUPPORTED_ENGINE … Expected version: >=24.20.0 <25 / Got: v26.0.0`.

Every stage of `pnpm verify` was therefore run individually, using the
repository's own installed binaries under Node `v26.0.0`, against an exact copy
of the reviewed worktree. This is weaker evidence than a pinned `pnpm verify`
and is reported as such. It is not a defect in the artifact. CI still pins the
correct runtime, and the builder's own pinned runs are recorded at
`reviews/releases/SBLA-003-handoff.md:312-350`.

### Stage results

| Stage                  | Command                                              | Result                                                             |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Format                 | `prettier --check .`                                 | PASS — "All matched files use Prettier code style!"                |
| Lint                   | `eslint . --max-warnings 0`                          | PASS — exit 0, no output                                           |
| Type-check             | `astro check`                                        | PASS — 41 files, 0 errors, 0 warnings, 0 hints                     |
| Unit tests             | `vitest run tests/unit`                              | PASS — 7 files, 47 tests                                           |
| Content validation     | `node scripts/content/validate.mjs`                  | PASS — foundation mode, 0 records                                  |
| Graph validation       | `node scripts/graph/validate.mjs`                    | PASS — foundation mode, 0 nodes, 0 edges                           |
| Evidence status        | `node scripts/evidence/status.mjs`                   | PASS — foundation mode, 0 sources                                  |
| Production build       | `astro build`                                        | PASS — 1 page, nine files, manifest `f73ea505…`                    |
| Portability            | `vitest run --config vitest.portability.config.ts`   | PASS — 3 files, 11 tests                                           |
| Foundation contract    | `node scripts/foundation/verify.mjs`                 | PASS — "Foundation contract passed"                                |
| End-to-end             | `playwright test`                                    | **NOT RUN** — see below                                            |
| Provider URLs          | 17 unique URLs from `provider-quotas.json`           | all HTTP 200 on 2026-09-02                                         |
| Live deployment        | page, CSS, `./` navigation, `health.txt`             | all HTTP 200, page and CSS byte-identical to the fresh build       |
| Deployment repository  | tree, commit, and both Pages runs via the GitHub API | all confirmed                                                      |
| Hostile request probes | 13 targets against the static server                 | no leak; results tabled above                                      |
| Nested-route probe     | added page, built, fetched emitted asset URL         | asset 404, home link mis-resolves; see R1-I-2                      |
| Beacon remeasurement   | `curl` with identity and gzip encodings              | 30,294 / 10,125 bytes today vs 28,467 / 9,509 recorded; see R1-m-3 |

### Checks deliberately or unavoidably not run

- **`pnpm test:e2e` — not run.** Chromium cannot launch in this sandbox:
  `FATAL:base/apple/mach_port_rendezvous_mac.cc:159 Check failed: kr == KERN_SUCCESS … Permission denied (1100)`.
  The one assertion it makes was verified by other means instead: the built
  `dist/index.html` contains no `<script>` element at all, and both required
  strings ("Science-Based Lifting Atlas", "Evidence-first resistance training
  anatomy") are present in the static bytes and are asserted by the portability
  suite. The JavaScript-disabled claim is therefore substantiated, but not by
  the named command.
- **`pnpm test:a11y`, `test:visual`, `test:performance` — not run.** These are
  not part of SBLA-003's acceptance row and their suites do not yet exist at
  foundation stage.
- One residual process from the failed Playwright attempt, an `astro preview`
  server bound to `127.0.0.1:4321` serving the **scratch copy** (PID 33987),
  could not be terminated from inside this sandbox: `ps` and `pkill` are
  blocked and `kill 33987` returns "operation not permitted". It touches no
  repository file and is loopback-only. Stop it with:

  ```bash
  kill 33987
  ```

### Git and scope checks

- `git status --porcelain` in the review worktree: empty, before and after.
- `git diff c9c9fbe -- .`: empty, confirming the reviewed tree is unmodified.
- `git diff --stat 77a7623 c9c9fbe`: 21 files, 2,054 insertions, 35 deletions,
  all within role.
- `git show --name-only f3d25d1`: only `docs/runbooks/current-work.md`.

## Known uncertainties

- **Runtime deviation.** The pinned `pnpm verify` and `pnpm test:e2e` were not
  executed. Stage-by-stage equivalents passed under Node `v26.0.0`. A pinned
  run remains the authoritative evidence, and CI provides it.
- **Account identity is unprovable from inside the repository.** See the
  independence statement.
- **One cited source resisted plain retrieval.** The Netlify credits
  documentation URL returns HTTP 200 with the body
  `edge function invocation failed` to a default client; it returned full
  content only with browser-like headers. Every Netlify fact was ultimately
  confirmed verbatim, so this is a limitation of naive URL checking rather than
  a defect. It does show that the handoff's "all 17 URLs returned HTTP 200"
  evidence is weaker than it sounds: status alone does not prove a page was
  readable, let alone read.
- **The internal spec and code-quality reviews could not be read.** They exist
  only as the builder's own summaries inside its handoff. See R1-I-5. Every
  repair those rounds claim was therefore re-derived here from the artifact
  rather than checked against a reviewer's record.
- **Provider terms are time-unstable.** All facts were true on 2026-09-02. The
  `reverifyBy: 2026-12-01` discipline is appropriate and the beacon change
  observed within one day shows why.
- **Traffic mix and build frequency are unmeasured.** The 90/10 mix, the
  10-builds-per-day cap, and the eight-object-requests-per-view allowance have
  no measured basis. The ADR says so for the mix; the other two are less
  explicitly flagged. None affects the $0 conclusion.
- **`assetsPrefix: '.'` was tested only for one nested depth.** The probe used
  `/muscles/probe/`. Deeper nesting will fail the same way, but only one depth
  was measured.

## Files created or modified

This review created exactly one file:

- `reviews/releases/SBLA-003-r1.md` — this report.

No other repository file was created, modified, moved, or deleted. Work outside
the repository, all of it discardable: an exact copy of the reviewed worktree
and a nested-route probe copy under this session's scratch directory, plus
fetched provider pages and downloaded deployment bytes.

## Required reviewer action

This report is the review. What follows is what its recipients must do.

**Codex must** open a bounded remediation claim in
`docs/runbooks/current-work.md` before editing anything, then address the five
Important findings. R1-I-1, R1-I-2, and R1-I-3 are ADR-content repairs.
R1-I-4 is a handoff-format repair. R1-I-5 requires a decision about the missing
review records, not a silent backfill: reports must not be written after the
fact as though they had existed. Recording the omission in the recovery log,
as was done for the Round 2 claim omission on 2026-08-30, is the precedent that
fits.

**Codex must not** treat this round's PASS results as transferable. After
remediation, the complete artifact returns for a Round 2 independent review at
`reviews/releases/SBLA-003-r2.md`; this file is never edited.

**The owner must** note that this verdict is about evidence quality and
internal consistency, not about the provider direction. The direction itself
survived every falsification attempt this round made.

## Acceptance criteria

### Per-criterion result

| #   | Criterion                                                                                                                                                                                         | Result                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | All five ADR decisions, alternatives, consequences, and reversal costs match §§11.1–11.2 and Phase 0 task 0.2, including no runtime AI                                                            | **PASS**                  |
| 2   | Every decision-relevant provider fact is supported by its dated official source, and no inference is presented as a provider guarantee                                                            | **PASS**                  |
| 3   | The three-scenario Phase 0 model measures all current output, labels every future-component input, models two reports per completed view, and preserves the SBLA-012/015/016 pre-activation rerun | **PASS** (2 Minor)        |
| 4   | The no-auto-charge rule is satisfied by excluding metered services, and the 70%/85% alert limitation and fallback are honest                                                                      | **PASS**                  |
| 5   | The optional analytics decision obeys the privacy, event, and log restrictions and is represented consistently in the cost model                                                                  | **FAIL** (R1-I-3)         |
| 6   | One unchanged current-shell artifact actually deploys and works at a second static host, the prose makes no future-route or asset coverage claim, and the recursive expansion gate is imposed     | **PASS**                  |
| 7   | The portability harness is safe against malformed encoding, traversal, symlink escape, and unexpected filesystem faults, and covers the current artifact's resource references                    | **PASS** (2 Minor)        |
| 8   | The five ADRs are internally consistent, complete in their Consequences, and honest about reversal cost                                                                                           | **FAIL** (R1-I-1, R1-I-2) |
| 9   | Role separation, the exact append-only claim, the write boundary, the stable command contract, and later-task scope are all intact                                                                | **PASS**                  |
| 10  | The builder handoff follows the mandatory §13.6 format, and each review round that produced findings left an append-only report                                                                   | **FAIL** (R1-I-4, R1-I-5) |

### Overall verdict

**FAIL.** Seven of ten criteria pass. Three fail on five Important findings.
Six Minor findings are recorded and none blocks acceptance on its own.

The substance of SBLA-003 is strong, and this verdict should not be read as
doubt about it. Every provider fact survived independent re-reading from live
official sources one day after the recorded access date. Every number in the
capacity model was reproduced from first principles. The build reproduces
byte-for-byte from source and the live second-host deployment still serves those
exact bytes. The static server resisted thirteen hostile probes. The R2
exclusion is better evidenced than the plan required. What fails is narrower:
one contradiction between two ADRs, one undisclosed consequence of a recorded
configuration decision, one unaddressed §11.7 security clause, and two breaks
in the process contract that governs how this work is recorded.

### Critical findings

None.

### Important findings

#### R1-I-1 — ADR 0003 and ADR 0005 contradict each other about Netlify at the 10,000-view scenario

`docs/adr/0003-hosting-and-asset-delivery.md:164-166` states:

> **Netlify Free as primary or portability target.** Its hard free limit is safe
> from charges, but 300 monthly credits provide at most 15 GB before requests
> and deploys. It cannot carry the 100k or 1M scenarios.

`docs/adr/0005-zero-cost-infrastructure-model.md:208-210` states the opposite
about the same provider, ceiling, and scenario:

> **Netlify Free.** Its hard limit cannot incur cost, but 300 credits cap pure
> bandwidth at 15 GB before requests/deploys. Even the 10k capacity scenario
> exceeds that ceiling.

ADR 0005 is correct on the package's own numbers: the 10,000-view scenario is
`32.75 GB`, which exceeds the 15 GB derived ceiling by more than a factor of
two. ADR 0003's enumeration of "the 100k or 1M scenarios" tells a reader that
Netlify does cover 10k, which is false.

The provenance confirms this is stale text, not a difference of opinion.
`git log -L 160,170:docs/adr/0003-hosting-and-asset-delivery.md` shows the
statement was written at `19212e3` as "That covers scenario 1 but not scenario
2 or 3", when the model's 10k figure was still small, and was reworded at
`35e8591` into its current form while preserving that implication. The spec
remediation at `627f836` — which raised the model by adding poster, loop,
Pagefind, and second-report inputs — corrected ADR 0005's sentence in the same
commit and left ADR 0003's untouched.

This matters beyond tidiness: `docs/adr/README.md:3-5` makes an accepted ADR
immutable and authoritative. Freezing two contradictory capacity statements
into the same approved package means a later task can cite whichever one suits
it. It also shows the spec-remediation fix for the report-count undercount was
not propagated across the package, which is the same class of defect that
review round was convened to close.

The decision is unaffected: Netlify is rejected under either reading, and more
firmly under the correct one.

#### R1-I-2 — ADR 0003 records `build.assetsPrefix: '.'` without disclosing that it breaks asset resolution on every non-root route

`docs/adr/0003-hosting-and-asset-delivery.md:40-46` records the configuration
as decision 5 and discloses exactly one limitation — that the wordmark's
`href="./"` "is correct only because the homepage sits at the deployment mount
root". Lines 81-84 repeat that caveat for navigation. Nothing in the Decision or
Consequences sections says that the _asset_ prefix has the same defect, and it
is the more damaging half.

Proven empirically rather than inferred. A single nested page was added to a
scratch copy of the reviewed artifact and built with the reviewed
`astro.config.mjs`:

- emitted at `dist/muscles/probe/index.html`:
  `href="./assets/global.DlWfByZd.css"`
- the asset actually exists only at `dist/assets/global.DlWfByZd.css`
- served through the project's own harness:
  `/muscles/probe/` → 200, `/muscles/probe/assets/global.DlWfByZd.css` → **404**,
  `/assets/global.DlWfByZd.css` → 200

So every nested route this configuration emits will load unstyled, and its
`./` home link will resolve to its own directory. `docs/adr/README.md:9-11`
requires a Consequences section precisely so that later tasks inherit the known
costs of a settled decision. SBLA-011 and SBLA-012 will add routes, and the
ADR as written hands them a configuration that silently fails, described only
as needing a wider test suite.

The recursive-extension gate at lines 121-126 would eventually catch this,
because it requires exercising every `dist/**/*.html` at both mounts. But a
gate that detects a failure is not a substitute for a Consequences entry that
predicts it. The honest form of this decision is that `assetsPrefix: '.'`
is a mount-root-only solution and that a nested-route site needs a different
mechanism.

#### R1-I-3 — ADR 0004 adopts an external third-party script without addressing the §11.7 Subresource Integrity requirement

`docs/product/master-plan.md:1063` requires:

> Use Subresource Integrity where appropriate for external static assets, or
> avoid external scripts.

ADR 0004 proposes exactly one external script — the Cloudflare beacon — and
addresses CSP at length (`docs/adr/0004-analytics.md:91-92`: "The CSP permits
one external script origin for the beacon. This is the only planned third-party
script exception"). It never mentions Subresource Integrity. `grep -ri
"subresource\|integrity" docs/adr/` returns no SRI discussion in any of the five
ADRs; the only hits are the unrelated word "integrity" in ADR 0002 and a
generic mention in ADR 0003's reversal cost.

The gap is not theoretical, and Cloudflare's own documentation is the source.
The Web Analytics FAQ, read 2026-09-02 — the same page ADR 0004 cites eight
times — states that with the manually embedded script "there is no current way
to safely apply an integrity attribute because we do not support version-pinning
our beacon script", while the automatic-injection path does receive an
`integrity` attribute. Automatic injection requires the domain to be proxied
through Cloudflare, which is a deployment-topology decision this ADR does not
make.

Independent confirmation that the script is genuinely unpinned: the beacon
measured 28,467 raw / 9,509 gzip bytes on 2026-09-01 per
`provider-quotas.json`, and 30,294 raw / 10,125 gzip bytes on 2026-09-02, with
`etag: W/"2026.9.1"`. The content changed within a day.

So ADR 0004 proposes an unpinnable, mutable third-party script into a §11.7
"strict Content Security Policy; limit script origins" context without either
satisfying the SRI clause, invoking the "or avoid external scripts" branch, or
recording why neither applies. A reader of this ADR cannot tell whether the
requirement was considered. Note that §11.7's escape hatch is available and
cheap here — analytics is explicitly optional and launch-nonblocking — so this
is a disclosure and reasoning gap, not an unavoidable conflict.

#### R1-I-4 — The SBLA-003 handoff does not use the mandatory §13.6 handoff format

`docs/product/master-plan.md:1282-1300` fixes ten handoff headings.
`docs/runbooks/handoff-template.md:3-5` restates them and says "do not rename,
reorder, or drop one". `AGENTS.md:4-6` makes the master plan authoritative.

`reviews/releases/SBLA-003-handoff.md` conforms to none of that. Its headings
are `Status`, `Objective`, `Inputs and repository state`, `Work completed`,
`Portability implementation and TDD evidence`, `Exact current-shell second-host
deployment evidence`, `Verification results`, `Files created or modified for
SBLA-003`, `Self-review`, `Remaining concerns and owner decisions`, and
`Required next reviewer actions`.

Against the required set:

| Required §13.6 heading            | Status in the SBLA-003 handoff                      |
| --------------------------------- | --------------------------------------------------- |
| `## Objective`                    | present                                             |
| `## Inputs and exact paths`       | renamed to `Inputs and repository state`            |
| `## Constraints`                  | **absent**                                          |
| `## Work completed`               | present                                             |
| `## Decisions made`               | **absent**                                          |
| `## Tests/checks run and results` | renamed to `Verification results`                   |
| `## Known uncertainties`          | renamed to `Remaining concerns and owner decisions` |
| `## Files created or modified`    | renamed to `Files created or modified for SBLA-003` |
| `## Required reviewer action`     | renamed to `Required next reviewer actions`         |
| `## Acceptance criteria`          | **absent**                                          |

`reviews/releases/SBLA-001-handoff.md` and
`reviews/releases/SBLA-002-handoff.md` both carry all ten headings exactly, in
order, so this is a regression against established practice rather than an
unclear rule.

Two of the three absent sections carry real review weight. Without
`## Constraints`, the reviewer must infer what the task was forbidden to do;
the constraint content here is buried in two sentences at the end of `Inputs
and repository state`. Without `## Acceptance criteria`, there is no section
whose conditions are, in the template's words, "checkable by someone other than
you" — the eight criteria in `Required next reviewer actions` are the author's
instructions to the reviewer, which is a different thing from the conditions
that make the task complete.

The reason this survived: `scripts/foundation/operating-model.mjs:272-290`
checks the required headings against `docs/runbooks/handoff-template.md` only.
No check validates an actual handoff, so `pnpm verify` passes. Whether to close
that gap is a separate decision for the operating-model owner and is out of
this task's scope; the finding here is the non-conforming handoff itself.

#### R1-I-5 — Two SBLA-003 review rounds produced findings but left no append-only review report, and no review claim

`AGENTS.md:66-67` requires: "Review reports are append-only at
`reviews/<discipline>/<task-id>-r<number>.md` and cite the exact commit
reviewed." `docs/runbooks/operating-policy.json:11,14` sets
`reviewClaimScope: exact-append-only-report-path` and
`reviewClaimCloses: immutable-review-report-commit`.

The SBLA-003 handoff records two review rounds that found substantive defects:

- a spec-compliance review of `e8fe598…` that found four Important and two
  Minor findings (`reviews/releases/SBLA-003-handoff.md:151-166`);
- a code-quality review of `16fda3b…` that found two Important and four Minor
  findings (`reviews/releases/SBLA-003-handoff.md:170-185`).

Neither produced a report. `reviews/releases/` contains no `SBLA-003-r*.md` at
the reviewed commit. Neither appears in the ledger as a review claim: the
`Closed claims` table at `docs/runbooks/current-work.md:54-55` records only
`SBLA-003 spec remediation` and `SBLA-003 code-quality remediation`, both with
role `Codex`. By `operating-policy.json:15`
(`failedReviewOpens: bounded-remediation-claim`), those remediation claims are
themselves evidence that two reviews failed and were never recorded as reviews.

SBLA-002 shows the intended shape: `reviews/releases/SBLA-002-r2.md` (role
"Codex reviewer") and `SBLA-002-r3.md` (role "Independent Codex reviewer") were
both committed, both claimed, and both preserved after their findings were
repaired.

The consequence is concrete and it landed on this review. The only surviving
account of what those rounds found is the builder's own table of findings
against itself, inside the artifact under audit. There is no independent record
to check the repairs against, so this round had to re-derive the whole package
from the artifact instead of confirming that specific findings were closed. The
handoff's statement at
`reviews/releases/SBLA-003-handoff.md:425-428` — that self-review found no
remaining Critical or Important defect — is exactly the claim an append-only
review report exists to test, and this round refutes it with five Important
findings.

This should not be repaired by writing the two reports now. A report
back-dated after the fact is worse than a recorded omission. The 2026-08-30
recovery-log entry at `docs/runbooks/current-work.md:66` — "Report preserved;
omission recorded rather than backdated" — is the precedent that applies.

### Minor findings

#### R1-m-1 — ADR 0003's portability test count and reference coverage are stale

`docs/adr/0003-hosting-and-asset-delivery.md:155` says "the current five tests
alone are insufficient evidence", and line 70 says "All five portability tests
then passed". The suite at the reviewed commit is three files and eleven tests,
independently confirmed: `vitest run --config vitest.portability.config.ts` →
"Test Files 3 passed (3) / Tests 11 passed (11)". The handoff has the right
figure at line 251; the ADR was not updated when `eed479e` added the focused
files.

Relatedly, lines 116-117 describe the coverage as "the built homepage and its
present HTML `href`/`src` references and anchors", but `eed479e` added `srcset`
support in `tests/integration/portability/resource-references.ts:1,31-43`. The
ADR understates what the suite now does.

#### R1-m-2 — The capacity model's "ceilings" are master-plan targets, not the plan's hard ceilings

`docs/adr/0005-zero-cost-infrastructure-model.md:56-57` calls the
future-component inputs "budget-derived planning ceilings", and the §11.8
clarification at `docs/product/master-plan.md:1074` authorizes "explicit
budget-derived ceilings". The table's own Basis column at lines 62-67 is honest
that these are targets, and that is the discrepancy: master plan §12.2 sets a
non-3D JS _hard ceiling_ of 160 KB against the 100 KB target used, and a
desktop 3D hard ceiling of 10 MB against the 6 MB used; §11.9 sets an exercise
loop hard ceiling of 3 MB against the 1.5 MB used.

Recomputing with the plan's hard ceilings gives roughly 5.08 MB per view and
scenario totals near `50.8 / 507.9 / 5,078.5 GB`, about 55% above the published
figures. A true ceiling model would use those.

This does not change the $0 conclusion, which does not depend on transfer
volume at all: Cloudflare documents static asset requests as free and
unlimited, independently confirmed today. It does mean line 76's claim that the
model "overstates likely transfer" is a claim about expected load, not a
ceiling guarantee, and the two are being described with one word.

#### R1-m-3 — The analytics beacon input is already stale, and is carried to six significant figures

`provider-quotas.json` records `beaconScriptRawBytes: 28467` and
`beaconScriptGzipBodyBytes: 9509`, measured 2026-09-01. Measured 2026-09-02
from the same URL: 30,294 identity bytes and 10,125 gzip bytes,
`etag: W/"2026.9.1"`, `cache-control: public, max-age=86400`. The
cache-control value matches; the byte counts do not.

The record is correctly dated, so this is not a false claim — and Cloudflare's
FAQ states they deliberately do not version-pin the beacon, so drift is
expected. The observation is about precision: ADR 0005 line 89 publishes
`3.274509 MB/page view`, six significant figures, on an input that moved 6.5%
within 24 hours. Substituting today's measurement gives `3.275125 MB/view` and
`32.75 / 327.51 / 3,275.13 GB`. Immaterial to the conclusion, and a reason to
state the analytics input to fewer digits or with an explicit volatility note.

#### R1-m-4 — The content-manifest SHA-256 is the acceptance artifact, but its computation is documented nowhere

`f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc` appears in
`docs/adr/0003-hosting-and-asset-delivery.md:103` and four times in the
handoff, and it is the value that ties the local build to the deployed bytes.
No file states how it is derived. This round recovered the method by trying
candidate formulations until one matched:

```bash
find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256
```

run with `dist/` as the working directory. Three plausible near-variants —
stripping the `./` prefix, using `-print0` with `sort -z`, and a `tar` digest —
produce different values, so a reviewer without the exact recipe cannot confirm
the artifact identity. `docs/runbooks/handoff-template.md:13-16` requires that a
handoff stand alone; a digest whose definition is unstated does not.

#### R1-m-5 — The portability harness diverges from real static hosts on directory requests

`scripts/portability/static-server.mjs:87-93` returns 404 for a path that does
not end in `/` and is not a file: `/sub` → 404 while `/sub/` → 200, confirmed
by probe. GitHub Pages and Cloudflare Pages both redirect `/sub` to `/sub/`.

The test at `tests/integration/portability.test.ts:114-119` asserts that no
redirect is needed to serve the index, which is true at the mount root. But the
harness's own inability to redirect means it cannot detect a future artifact
that depends on host directory-redirect behaviour, and it will report 404 for
extensionless nested routes that work fine in production. Worth recording
alongside the recursive-extension gate, since both come due at the same task.

#### R1-m-6 — "not material" describes 8% of the stated gzip total

`docs/adr/0005-zero-cost-infrastructure-model.md:40` marks the gzip column for
"Other emitted files" as "not material" while line 41 totals the complete
`dist/` at 2,640 gzip bytes. Independently measured, HTML and CSS contribute
`733 + 1,693 = 2,426`, so the "not material" files contribute 214 bytes, 8.1%
of the total. The figures are diagnostic by the ADR's own statement at lines
43-46, so nothing downstream is wrong; the label is just looser than the number.

### Fact versus inference

Recorded because `CLAUDE.md:100-108` requires it, and because the distinction
carried real weight in this round.

**Verified by this session, independently:** every provider quota and privacy
statement tabled under "Work completed", each re-read today from the cited
URL; every arithmetic result in ADR 0005, recomputed from the stated inputs;
the nine-file artifact, its raw and gzip byte counts, and all three SHA-256
digests, reproduced from source; the live deployment's status codes and
byte-identity; the deployment repository's tree, commit, and both Pages runs;
the eleven passing portability tests; the thirteen hostile-probe results; and
the nested-route asset 404.

**Inference by this session, labelled as such:** that `assetsPrefix: '.'` will
fail at deeper nesting than the one depth probed (R1-I-2 measured one level);
that the §11.7 SRI clause is satisfiable here by invoking its
"avoid external scripts" branch, since analytics is optional (R1-I-3 — the
plan permits it, but no owner decision exists); and the recomputed
hard-ceiling capacity figures in R1-m-2, which are this reviewer's arithmetic
on the plan's ceilings, not a project model.

**Correctly labelled inference in the artifact, and accepted as such:** the
"two reports per completed traditional pageview" figure carries
`capacityInference` in `provider-quotas.json:149`, and ADR 0005 line 132 says
capacity "assumes" both reports arrive. Cloudflare documents a load report and
a leave report for traditional pages, and separately documents Core Web Vitals
reporting at the first hidden visibility state; the package treats the Vitals
report and the leave report as one beacon to reach two. That merge is a
judgement, not documented provider behaviour, and it is disclosed as one. A
reader of ADR 0004's table alone could miss the distinction, since line 37
presents the timing facts as the "documented answer" and line 74 then presents
"two RUM reports" as the model input without restating the merge. Noted, not
raised as a finding — the machine-readable record labels it correctly, and two
is the conservative direction relative to one.

**Not established either way:** the 90/10 traffic mix, the 10-builds-per-day
operational cap, and the eight-object-requests-per-view allowance. ADR 0005
line 76 flags the mix explicitly as an unmeasured assumption; the other two are
presented as planning allowances without the same caveat. None affects the $0
outcome.

### Role and scope audit

| Check                                | Result                                                                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Role write boundary respected        | PASS — exactly one file authored, `reviews/releases/SBLA-003-r1.md`                                                                                                 |
| Artifact repaired                    | No — nothing under audit was edited; every finding is a finding                                                                                                     |
| Append-only respected                | PASS — first round, no prior `SBLA-003-r*.md` existed                                                                                                               |
| Exact claim verified before writing  | PASS — `f3d25d1` records the single path, and touches only the ledger                                                                                               |
| Reviewed tree unmodified             | PASS — `git status --porcelain` empty, `git diff c9c9fbe -- .` empty                                                                                                |
| Artifact's own role/scope discipline | PASS — 21 files, all Codex-owned; no `research/`, `content-drafts/`, or `content/` write; master-plan change is exactly the authorized two-line §11.8 clarification |
| Later-task scope pre-empted          | No — SBLA-007 schemas, SBLA-005 asset measurement, and SBLA-012/015/016 inputs are all explicitly deferred                                                          |
| Stable command contract              | PASS — all six contract commands intact; `test:portability` added inside `verify`, which still builds first                                                         |

### Conditions for acceptance

SBLA-003 becomes acceptable when all five Important findings are resolved and
the complete artifact passes a Round 2 independent review:

1. **R1-I-1** — Reconcile ADR 0003's Netlify statement with ADR 0005's, using
   the package's own 10,000-view figure. Check the rest of ADR 0003 for other
   text the spec remediation did not reach.
2. **R1-I-2** — Add a Consequences entry to ADR 0003 stating that
   `build.assetsPrefix: '.'` resolves relative to the requesting document and
   therefore breaks assets on any non-root route, and say what a nested-route
   site will need instead.
3. **R1-I-3** — Address §11.7's SRI clause in ADR 0004: satisfy it, invoke its
   "or avoid external scripts" branch, or record why neither is possible,
   citing Cloudflare's own statement that the manual embed cannot carry
   `integrity`.
4. **R1-I-4** — Rewrite `reviews/releases/SBLA-003-handoff.md` to the ten §13.6
   headings, restoring `Constraints`, `Decisions made`, and `Acceptance
criteria` as their own sections.
5. **R1-I-5** — Record the two missing review rounds in the recovery log rather
   than back-dating reports, and record how future internal review rounds will
   leave append-only reports.

The six Minor findings should be addressed in the same remediation but do not
individually block acceptance.

**Owner gate.** Owner approval is a separate gate and was not treated as a
defect in this round. Per `docs/product/master-plan.md:1752`, SBLA-003 runs
`Codex → Claude Review → Owner`. All five ADRs are correctly `Proposed`; the
§11.8 queue-staging clarification is correctly scoped to queue staging and
approves no provider; and nothing in the package claims a Cloudflare account,
project, alert, or analytics site was configured — independently confirmed. The
owner still owes decisions on Cloudflare Pages Free as the production
direction, on the $0 model, on whether optional analytics ships at launch, and
on the future domain. Those decisions should follow, not precede, the
remediation above — R1-I-1 and R1-I-3 both bear on what is being approved.

### Report scope and worktree state

This report reviews commit `c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203` on branch
`claude-review/SBLA-003-r1` in worktree
`.worktrees/sbla-003-claude-review-r1`. The coordination commit
`f3d25d12d64402e9fb36353b86a5e8dd37a34691` was used only as claim evidence and
was not reviewed as artifact content. The worktree was clean at the reviewed
commit before this file was written and contains no other change.
