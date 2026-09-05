# SBLA-003 — Independent Claude Review, Round 2 (acceptance audit)

## Review identity and scope

- **Task:** SBLA-003 — Architecture, hosting, analytics, and $0 infrastructure ADRs
- **Round:** 2 (acceptance)
- **Role:** Claude Review (account B), independent and adversarial
- **Reviewed candidate (exact, immutable):**
  `5bd35e320aa74bfcdbf839849c5fadc7c52292fe`
- **Candidate subject:** `chore: close SBLA-003 fallback remediation`
- **Candidate tree:** `git ls-tree` over 139 tracked files (enumerated and hashed below)
- **Reviewer branch:** `claude-review/SBLA-003-r2-acceptance`
- **Reviewer worktree:** `.worktrees/sbla-003-claude-review-r2-acceptance`
- **Coordination claim commit:** `7cc5cffddbdc01ca59f0db1383409c4d803eaaea`
- **Report path (sole writable path):** `reviews/releases/SBLA-003-r2.md`
- **Review date:** 2026-09-04
- **Report status:** append-only. This report does not modify
  `reviews/releases/SBLA-003-r1.md`,
  `reviews/releases/SBLA-003-r1-addendum.md`, or
  `reviews/releases/SBLA-003-internal-r1.md`, and does not repair the artifact.

### Independence statement

This reviewer wrote no repository file other than this report, and edited
nothing under audit. Every executable check below was run against a
byte-identical export of the candidate tree in a scratch directory
(`$TMPDIR/sbla-r2/repo`), created with `git archive HEAD | tar -x`, so that
building, installing dependencies, and running an independently authored probe
suite could not touch the reviewed worktree. The reviewed worktree was clean at
the candidate before this file was written and contains no other change.

The conclusions below rest on this reviewer's own executions, not on the
handoff's narrative. Where a handoff claim was checked, it was recomputed from
first principles rather than read.

### Pre-write verification (four required conditions)

| Condition                                                    | Result                                                                        |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Reviewer worktree HEAD equals the exact reviewed candidate   | **PASS** — `git rev-parse HEAD` = `5bd35e320aa74bfcdbf839849c5fadc7c52292fe`  |
| Reviewer worktree is clean before writing                    | **PASS** — `git status --porcelain=v1` empty                                  |
| The exact-path claim is committed before the reviewer writes | **PASS** — `7cc5cff` adds one Active-claims row for this exact path           |
| The claim records the reviewed candidate as its base commit  | **PASS** — claim row base commit = `5bd35e320aa74bfcdbf839849c5fadc7c52292fe` |

`git merge-base --is-ancestor 5bd35e3 7cc5cff` succeeds, and
`git log --oneline 5bd35e3..7cc5cff` returns exactly one commit
(`7cc5cff chore: claim SBLA-003 Account-B acceptance review`) whose diff touches
only `docs/runbooks/current-work.md` (3 insertions, 2 deletions). The claim is
therefore correctly isolated on the coordination branch and does not contaminate
the reviewed artifact. At the candidate itself the **Active claims** table is
empty and every SBLA-003 claim appears under **Closed claims**.

### Artifacts read in full, without editing

`docs/product/master-plan.md` (1,827 lines), `AGENTS.md`, `CLAUDE.md`,
`README.md`, `docs/adr/README.md`, all five ADRs
(`0001`–`0005`), `docs/adr/provider-quotas.json`,
`docs/runbooks/current-work.md`, `reviews/releases/SBLA-003-handoff.md`
(804 lines), `reviews/releases/SBLA-003-r1.md` (908 lines),
`reviews/releases/SBLA-003-r1-addendum.md` (195 lines),
`reviews/releases/SBLA-003-internal-r1.md` (210 lines),
`scripts/portability/static-server.mjs`,
`tests/integration/portability.test.ts`,
`tests/integration/portability/resource-references.ts`,
`tests/integration/portability/resource-references.test.ts`,
`tests/integration/portability/static-server.test.ts`,
`tests/integration/portability/server-lifecycle.ts`,
`tests/e2e/foundation.spec.ts`, `astro.config.mjs`, `src/pages/index.astro`,
`vitest.portability.config.ts`, `playwright.config.ts`, `package.json`,
`pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.github/workflows/ci.yml`,
`scripts/foundation/role-paths.mjs`, `scripts/foundation/check-role-paths.mjs`.

---

## Runtime environment and its caveat

`AGENTS.md:92-99` pins `node --version` to `v24.20.0` and `pnpm --version` to
`11.24.0`. This reviewer's host provides:

| Tool | Required  | Available | Status                                        |
| ---- | --------- | --------- | --------------------------------------------- |
| Node | `24.20.0` | `26.0.0`  | **off-pin** — no version manager on this host |
| pnpm | `11.24.0` | `11.0.9`  | **off-pin**, and unable to execute at all     |

`pnpm` fails before doing any work because it writes a temporary file into
`$HOME` and into the target directory, both of which this reviewer's sandbox
denies:

```
[ERROR] EPERM: operation not permitted, open '.../_tmp_76779_8aca38522e18fd1c2d0e108cc262f046'
```

`pnpm install --frozen-lockfile` and every `pnpm <script>` invocation are
therefore **not runnable by this reviewer**. Per the review instruction, this is
recorded as an environment limitation and is **explicitly not treated as a
candidate defect**. Codex independently recorded a pinned `pnpm verify` PASS on
`v24.20.0` / `11.24.0` at this candidate.

**Mitigation actually performed.** Rather than skip the gates, every underlying
command was executed directly with `npm` 11.12.1 and `npx` against the
byte-identical export. The `engines` range was violated only by a warning
(`npm warn EBADENGINE ... required: { node: '>=24.20.0 <25' }, current: v26.0.0`),
which npm does not enforce absent `engine-strict`. All fifteen direct
`devDependencies` resolved at their exact pinned versions:

```
@astrojs/check 0.9.10   @playwright/test 1.62.1   @types/node 24.13.3
astro 7.2.9             eslint 9.39.5             eslint-config-prettier 10.1.8
eslint-plugin-astro 1.6.0                         eslint-plugin-jsx-a11y 6.10.2
globals 17.11.0         parse5 8.0.1              prettier 3.9.6
prettier-plugin-astro 0.14.1                      typescript 6.0.3
typescript-eslint 8.68.0                          vitest 4.1.11
```

Transitive resolution came from npm rather than `pnpm-lock.yaml`, so this run
corroborates the pinned run rather than replacing it. That residual gap is the
only part of the verification this reviewer could not close, and it is an
environment gap, not a finding.

### Export integrity

```bash
git archive HEAD | tar -x -C "$TMPDIR/sbla-r2/repo"
# then, per file: git hash-object <file> compared to git ls-files -s
src lines: 139  copy lines: 139
COPY MATCHES CANDIDATE TREE EXACTLY (139 files, all blob hashes equal)
```

Every artifact file was additionally re-compared by SHA-256 after all reviewer
activity, confirming the reviewer's probes changed nothing under audit:

```
tests/integration/portability.test.ts                      IDENTICAL
tests/integration/portability/resource-references.ts       IDENTICAL
tests/integration/portability/resource-references.test.ts  IDENTICAL
tests/integration/portability/static-server.test.ts        IDENTICAL
tests/integration/portability/server-lifecycle.ts          IDENTICAL
scripts/portability/static-server.mjs                      IDENTICAL
astro.config.mjs / src/pages/index.astro                   IDENTICAL
vitest.portability.config.ts / playwright.config.ts        IDENTICAL
```

The three reviewer-authored files (`zz-adversarial-r2.test.ts`,
`zz-counts.test.ts`, `playwright.review.config.ts`) exist only in the scratch
export and were never present in the reviewed worktree.

---

## Commands run and real results

### Repository gates (each executed by this reviewer)

| Command                                                | Result                                                    |
| ------------------------------------------------------ | --------------------------------------------------------- |
| `npx prettier --check .`                               | **PASS** — "All matched files use Prettier code style!"   |
| `npx eslint . --max-warnings 0`                        | **PASS** — exit 0, zero output                            |
| `npx astro check`                                      | **PASS** — 37 files, 0 errors, 0 warnings, 0 hints        |
| `npx vitest run tests/unit`                            | **PASS** — 7 files, 47 tests                              |
| `npx vitest run tests/accessibility`                   | **PASS** — 1 file, 1 test                                 |
| `npx vitest run tests/visual`                          | **PASS** — 1 file, 1 test                                 |
| `npx vitest run tests/performance`                     | **PASS** — 1 file, 1 test                                 |
| `node scripts/content/validate.mjs`                    | **PASS** — exit 0, "foundation mode; 0 records"           |
| `node scripts/graph/validate.mjs`                      | **PASS** — exit 0, "foundation mode; 0 nodes and 0 edges" |
| `node scripts/evidence/status.mjs`                     | **PASS** — exit 0, "foundation mode; 0 sources checked"   |
| `node scripts/foundation/verify.mjs`                   | **PASS** — exit 0, "Foundation contract passed"           |
| `npx astro build`                                      | **PASS** — 1 page, 9 files emitted, completed in 485 ms   |
| `npx vitest run --config vitest.portability.config.ts` | **PASS** — **3 files, 17 tests**                          |
| `npm audit --audit-level=high`                         | **PASS** — 0 vulnerabilities across 651 dependencies      |
| `npx playwright test` (E2E)                            | **NOT RUN** — sandbox cannot launch Chromium; see below   |

`pnpm verify` chains exactly these steps
(`package.json:32`), and every constituent step passed independently.

### The one gate this reviewer could not execute

`pnpm test:e2e` could not be run. Two independent sandbox limits blocked it:

1. `npx playwright install chromium` failed to fetch
   `chromium-headless-shell` (`Download failure, code=1`), though the full
   Chrome-for-Testing build (356 MB) did download.
2. Launching that full browser is refused by the macOS sandbox:
   `FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed:
kr == KERN_SUCCESS. bootstrap_check_in ...: Permission denied (1100)`.

Notably, the webServer half **did** start successfully once
`ASTRO_PREVIEW_BACKGROUND=0` was applied — matching the artifact's own
`playwright.config.ts:22`, which already sets it. Only the browser process is
blocked. This is an environment limitation and **not a candidate defect**.

**Equivalent evidence supplied instead.** The E2E spec
(`tests/e2e/foundation.spec.ts:3-15`) disables JavaScript and asserts two strings
are visible. This reviewer verified the assertion structurally against the real
build:

- `grep -c '<script' dist/index.html` → **0**
- `find dist -name '*.js' | wc -l` → **0**
- `<h1 id="page-title">Science-Based Lifting Atlas</h1>` present as static HTML
- `<p class="thesis">Evidence-first resistance training anatomy</p>` present as static HTML
- the same page returns HTTP 200 with both strings from a generic static server
  at both mounts (portability suite, executed and green)

With zero script tags and zero emitted JavaScript, the JavaScript-disabled
requirement is satisfied by construction. That is strong but not identical
evidence, and it is labelled as such.

---

## Independent reproduction of the acceptance artifacts

### Content-manifest digest — reproduced exactly

Running the ADR's own recipe (`docs/adr/0003-hosting-and-asset-delivery.md:128`)
from inside a `dist/` this reviewer built from the candidate source:

```bash
find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256
f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc  -
```

This matches the recorded acceptance digest character for character. The
handoff's claim that the parser/test dependency does not change the built
artifact is therefore confirmed independently: a build from candidate `5bd35e3`,
on a **different Node major version** than the one used by the builder,
reproduces the digest recorded for source commit `9f26a3a3`.

Per-file digests:

```
bc1ac51076b718db0343aa69136f25e9248360c3675fbe65da27333ae5187110  ./index.html
76a9808cd41f62deae3f4c609fa4fd58d28a57f083b414a137e48aa20d271d5e  ./assets/index.DlWfByZd.css
dc51b8c96c2d745df3bd5590d990230a482fd247123599548e0632fdbf97fc22  ./health.txt
01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b  ./…/.gitkeep  (×6)
```

### Second-host proof — re-verified live, byte-for-byte

The public deployment was fetched during this review and compared against the
locally built files:

| File         | Live SHA-256 (downloaded 2026-09-04)                               | Local build | Match         |
| ------------ | ------------------------------------------------------------------ | ----------- | ------------- |
| `index.html` | `bc1ac51076b718db0343aa69136f25e9248360c3675fbe65da27333ae5187110` | same        | **IDENTICAL** |
| CSS          | `76a9808cd41f62deae3f4c609fa4fd58d28a57f083b414a137e48aa20d271d5e` | same        | **IDENTICAL** |
| `health.txt` | `dc51b8c96c2d745df3bd5590d990230a482fd247123599548e0632fdbf97fc22` | same        | **IDENTICAL** |

All three URLs returned HTTP 200 at
`https://frankiebiz.github.io/sbla-003-portability-proof-20260901/`, including
the project-mount `health.txt` and the wordmark `./` target. The live page and
CSS digests also equal the values recorded at
`docs/adr/0003-hosting-and-asset-delivery.md:120-121`. The second-host claim is
genuine, current, and independently reproducible.

### Capacity arithmetic — recomputed from first principles

Recomputed from the ADR's own inputs (`docs/adr/0005:68-78`) and 90/10 mix:

```
app JS   = .9×160 + .1×180 = 162 KB        (ADR: 162 KB)      OK
poster   = .9×200          = 180 KB        (ADR: 180 KB)      OK
loop     = .9×3            = 2.7 MB        (ADR: 2.7 MB)      OK
3D       = .1×10           = 1.0 MB        (ADR: 1 MB)        OK
launch/view   = 5.067 MB                   (ADR: 5.067 MB)    OK
optional/view = 5.079125 MB                (ADR: 5.079125 MB) OK
```

| Views     | HTML/CSS | App JS | Images | Loops | Search | 3D    | Launch total | Column sum |
| --------- | -------- | ------ | ------ | ----- | ------ | ----- | ------------ | ---------- |
| 10,000    | 0.25     | 1.62   | 1.8    | 27    | 10     | 10    | **50.67**    | 50.67 ✔    |
| 100,000   | 2.50     | 16.20  | 18     | 270   | 100    | 100   | **506.70**   | 506.70 ✔   |
| 1,000,000 | 25       | 162    | 180    | 2,700 | 1,000  | 1,000 | **5,067.00** | 5,067.00 ✔ |

Every published cell reproduces, and every row's components sum to its stated
total. Secondary figures also reproduce: builds 70%/85% of 500 = **350 / 425**;
object GETs at 8/view = **80,000 / 800,000 / 8,000,000**; hypothetical R2 reads
at 5 per 3D view = **5,000 / 50,000 / 500,000**; RUM reports at 2/view =
**20,000 / 200,000 / 2,000,000** → **20 MB / 200 MB / 2 GB**; "other" gzip share
= 214 / 2,640 = **8.11%** (ADR states 8.1%); Netlify 300 credits ÷ 20 credits/GB
= **15 GB**, which is far below the 10k launch total of 50.67 GB.

### Measured shell bytes — reproduced exactly

Independently measured on this reviewer's own build:

| Class        | Raw   | ADR   | gzip -9 | ADR   |
| ------------ | ----- | ----- | ------- | ----- |
| HTML         | 1,595 | 1,595 | 733     | 733   |
| CSS          | 4,214 | 4,214 | 1,693   | 1,693 |
| Other (7 f.) | 9     | 9     | 214     | 214   |
| **Total**    | 5,818 | 5,818 | 2,640   | 2,640 |

### Analytics beacon — re-measured exactly

```
raw identity bytes : 30294   (ADR records 30,294 on 2026-09-03)
gzip body bytes    : 10125   (ADR records 10,125 on 2026-09-03)
cache-control: public, max-age=86400        etag: W/"2026.9.1"
```

Every recorded byte count, the cache lifetime, and the ETag reproduce exactly.
The recorded 2026-09-01 → 2026-09-03 drift is likewise arithmetically sound
(raw 6.42%, gzip 6.48%; ADR states 6.5%).

### Provider evidence

`jq empty docs/adr/provider-quotas.json` → **valid JSON**. The record contains
**exactly 18 unique http(s) URLs**, matching the handoff's claim, and **all 18
returned HTTP 200** when probed during this review. Every one of the five
provider blocks carries both `source` and `accessedOn`, and the
`cloudflare-web-analytics` block carries a per-fact `factSources` map with its
own `source`/`sources` and `accessedOn` (2026-09-01, with SRI facts at
2026-09-03).

Fact/inference separation is explicit and disciplined: provider statements sit
under `providerFact`/`fact`, and project conclusions are labelled `inference`,
`capacityInference`, `proposedDirection`, `projectDecision`, or
`operationalFallback`. The absent ingestion quota is recorded as _"not stated on
the official Web Analytics Limits page; this sourced absence is not unlimited
capacity"_ — the correct epistemic move. No 70%/85% alert is credited to any
provider; each provider's `alerting` block states the documented reality and
labels the substitute as an operational fallback.

### Dependency and licence integrity

| Check                              | Result                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `parse5` pinned exactly            | **PASS** — `package.json:41` `"parse5": "8.0.1"`                                                                  |
| Lockfile integrity vs npm registry | **PASS** — both `sha512-z1e/HMG90obSGeidlli3hj7cbocou0/wa5HacvI3ASx34PecNjNQeaHNo5WIZpWofN9kgkqV1q5YvXe3F0FoPw==` |
| `parse5` licence                   | **PASS** — MIT (registry metadata and installed `LICENSE`); handoff claim confirmed                               |
| Transitive dependency              | **PASS** — only `entities@8.0.0`, BSD-2-Clause (permissive)                                                       |
| All 15 devDeps in `pnpm-lock.yaml` | **PASS** — every specifier exact and resolved                                                                     |
| Vulnerability audit                | **PASS** — 0 vulnerabilities, 651 dependencies                                                                    |

### Documentation integrity

- **§13.6 heading format:** the ten mandated headings at
  `docs/product/master-plan.md:1289-1298` were extracted and `diff`ed against
  the handoff's level-2 headings. The diff is **empty** — 10/10, each exactly
  once, in the mandated order, zero duplicates.
- **Relative links:** 30 relative markdown links across `README.md`,
  `master-plan.md`, `AGENTS.md`, `CLAUDE.md`, the six `docs/adr/*.md`, and the
  handoff were resolved against the filesystem. **0 broken.**
- **Append-only integrity:** all three prior review artifacts are byte-identical
  to the commits that introduced them.

| Report                    | Original commit | Candidate | Result        |
| ------------------------- | --------------- | --------- | ------------- |
| `SBLA-003-r1.md`          | `4e1c0b8`       | `5bd35e3` | **UNCHANGED** |
| `SBLA-003-r1-addendum.md` | `07ecccc`       | `5bd35e3` | **UNCHANGED** |
| `SBLA-003-internal-r1.md` | `53645c8`       | `5bd35e3` | **UNCHANGED** |

Recorded identities also match exactly: `SBLA-003-r1.md` is 908 lines /
68,419 bytes / SHA-256 `51a2a470…455f`, and the addendum is 195 lines /
10,368 bytes / SHA-256 `4d756a19…1df3` — both precisely as the recovery log and
handoff record them. All files are regular mode `100644`.

- **File inventory:** `git diff --name-status 95d3ac3 5bd35e3` yields 16 changed
  files. All 16 appear in the handoff's **Files created or modified** section
  (including `README.md`, the IR1-m-1 repair). No omission found.
- **Test suite integrity:** no `.skip`, `.only`, `.todo`, `xit`, or `xdescribe`
  anywhere under `tests/`. `git diff --check` clean.

---

## Formal verification of the two pre-claim parser observations

These were the read-only observations that caused the previous Round 2 dispatch
to be canceled. Both are the subject of the candidate's final remediation, and
both were verified here **by execution**, not by reading the diff. This reviewer
authored an independent 71-probe suite against the candidate's own module.

### Observation 1 — `<noscript>` fallback resources must be visible

**VERIFIED CLOSED.** `tests/integration/portability/resource-references.ts:57`
and `:90` now parse with `{ scriptingEnabled: false }`.

| Probe | Construct                                                             | Result                       |
| ----- | --------------------------------------------------------------------- | ---------------------------- |
| A1    | `<noscript><img src="/ns.webp">`                                      | collected                    |
| A2    | `<head><noscript><link rel=stylesheet href="/ns.css">`                | collected                    |
| A3    | `<noscript><picture><source srcset>…<img>`                            | all three collected          |
| A5    | `<noscript><a href="/ns-page">`                                       | collected (navigation)       |
| A4    | **contrapositive** — same input under parse5's _default_ scripting on | `<img>` count **0** vs **1** |

Probe A4 is the load-bearing one: it proves the fix is not cosmetic. Under
parse5's default (`scriptingEnabled: true`) the `<noscript>` child is raw text
and the element count is 0; with the flag it is 1. A JavaScript-disabled browser
would fetch that resource, and the gate now sees it.

### Observation 2 — inert `<template>` content must not be collected

**VERIFIED CLOSED.** `walkElements` (`resource-references.ts:137-145`) descends
only through `childNodes` and never through a template's `content` fragment.

| Probe | Construct                                         | Result                                             |
| ----- | ------------------------------------------------- | -------------------------------------------------- |
| B1    | `<template><img src="/t.webp">`                   | `[]` — not collected                               |
| B2    | nested `<template><template><img>`                | `[]` — not collected                               |
| B3    | template inside `<noscript>`, plus a real sibling | only the real resource collected                   |
| B4    | `<template><a href="/t-nav">`                     | `[]` — navigation also inert                       |
| B5    | **mechanism proof** — parse5 tree shape           | `template.childNodes = []`, `content` holds 1 node |
| B6    | sibling after a template                          | still collected — the walk is not aborted          |

B5 confirms the mechanism rather than the symptom: parse5 parks template
children in a separate `DocumentFragment`, so the `'childNodes' in node`
recursion at `:142` is structurally correct, not incidentally correct.

### Full adversarial probe results

71 probes, **71 pass**. Coverage: `<noscript>` (5), `<template>` (6), quoting
and case (8), origin/protocol filtering (12), `srcset`/`imagesrcset` (13),
`a`/`area` navigation (5), the element/attribute allow-list (4), mount
containment (5), `<base href>` (1), robustness (12).

Findings worth recording as _positive_ results:

- **Quoting/tokenizer:** unquoted values, single quotes, uppercase tags and
  attributes, entity decoding (`&amp;` → `&`), duplicate-attribute first-wins,
  and `>` inside _any_ earlier quoted attribute all behave correctly. Unclosed
  quoted attributes do not throw.
- **Origin filtering:** cross-origin absolute, protocol-relative cross-origin,
  differing port, differing scheme, `data:`, `blob:`, `javascript:`, `mailto:`,
  `tel:`, and pure fragments are all correctly excluded; protocol-relative
  _same-origin_ is correctly included.
- **`srcset`:** density and width descriptors, comma-with-no-space, leading and
  trailing commas, newline separation, and empty values all parse correctly. A
  `data:` URL containing an internal comma does **not** produce a phantom
  candidate, and a mixed `data:`/network `srcset` still yields the network URL.
- **Raw-text safety:** markup inside `<script>`, `<textarea>`, and HTML comments
  is correctly _not_ collected; foster-parented markup inside `<table>` still is.
- **Coverage map:** the eleven mapped elements and the seven recognised
  metadata keys all resolve; `data-src` and `<div background>` correctly do not.
- **Mount containment:** `isPathInsideMount` (`:100-103`) correctly accepts the
  bare mount and everything below it, and correctly **rejects** prefix-confusion
  siblings (`/science-lifting-atlas-evil`, `/science-lifting-atlasX`) and
  root-absolute assets under a subpath mount. No prefix bug exists.

**Three probes initially disagreed with the implementation. All three were this
reviewer's own errors, and the implementation was correct in each case.** They
are recorded because an adversarial review that silently discards its own
false positives is not auditable:

1. `srcset="/a.png,/b.png"` returns one candidate, not two. Checked against the
   HTML Standard's srcset algorithm: step 6 collects a sequence of _non-whitespace_
   characters, so with no whitespace the entire string is one URL. The
   implementation is **spec-correct**; the probe was wrong.
2. `<area href>` outside a `<map>` _is_ collected. The probe's assertion
   contradicted its own title. Behaviour is correct.
3. SVG `xlink:href` _is_ collected. Inspection of the parse tree shows parse5's
   foreign-attribute adjustment rewrites it to `{name: 'href', prefix: 'xlink'}`,
   so the allow-list catches legacy SVG references too — **broader** coverage
   than this reviewer assumed.

### Static server — adversarial re-check

`scripts/portability/static-server.mjs` was re-read against its tests. Decoding
happens before the traversal check (`:73` then `:79-85`), so `%2e%2e%2f` is
caught; both lexical containment (`:96-100`) and `realpath` containment
(`:112-115`) are enforced; `isInside` (`:141-143`) uses `base + sep` and so
cannot be fooled by a sibling directory sharing a prefix; expected filesystem
errors map to 403/404 while unexpected ones remain visible as 500 (`:151-166`).
The 308 trailing-slash redirect (`:119-126`) preserves the query string. All
six focused server tests pass.

---

## Verification of all twelve combined Round 1 findings

Every finding was re-checked against the candidate independently, not accepted
from the handoff's table.

| ID         | Sev.      | Independent verification at the candidate                                                                                                                                                                                                                                   | Status     |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **R1-I-1** | Important | `docs/adr/0003:207-209` and `docs/adr/0005:233-235` now say the same thing. Recomputed: 300 ÷ 20 = 15 GB < 50.67 GB. No contradiction remains.                                                                                                                              | **CLOSED** |
| **R1-I-2** | Important | `docs/adr/0003:44-54` marks `assetsPrefix: '.'` and `href="./"` mount-root-only and defines the route-depth-aware gate; `:191-194` repeats it under Consequences.                                                                                                           | **CLOSED** |
| **R1-I-3** | Important | `docs/adr/0004:59-68` prohibits manual embedding and gates optional activation on an observed `integrity` attribute, invoking §11.7's "avoid external scripts" branch. Mirrored in JSON.                                                                                    | **CLOSED** |
| **R1-I-4** | Important | Ten §13.6 headings verified by empty `diff` against `master-plan.md:1289-1298` — once each, in order.                                                                                                                                                                       | **CLOSED** |
| **R1-I-5** | Important | `current-work.md` recovery log records the 2026-09-02 omission without back-dating and requires pre-claimed append-only reports. No fabricated report exists.                                                                                                               | **CLOSED** |
| **R1-I-6** | Important | Parser replaced with `parse5@8.0.1`; verified by 71 independent probes. `<area>` covered (`resource-references.ts:91`); `>`-in-quoted-attribute and image-map fixtures exist at `resource-references.test.ts:13-14,28`; scope decision recorded at `docs/adr/0003:137-156`. | **CLOSED** |
| **R1-m-1** | Minor     | `docs/adr/0003:154` states "three files and seventeen tests". Measured: **3 files, 17 tests**. Accurate.                                                                                                                                                                    | **CLOSED** |
| **R1-m-2** | Minor     | `docs/adr/0005:68-78` basis column checked against the plan: 160 KB and 10 MB are §12.2 _hard ceilings_; 180 KB is a §12.2 _target_; 3 MB is a §11.9 _hard ceiling_; 200 KB is a §11.9 budget; HTML/CSS and Pagefind are labelled task-local. Every label is correct.       | **CLOSED** |
| **R1-m-3** | Minor     | `docs/adr/0005:54-58,98-102` records both measurements and the drift, and rounds displayed totals. Re-measured values match exactly.                                                                                                                                        | **CLOSED** |
| **R1-m-4** | Minor     | Recipe at `docs/adr/0003:123-134`; **executed by this reviewer and reproduced the acceptance digest exactly**. The whitespace-in-filename caveat is stated.                                                                                                                 | **CLOSED** |
| **R1-m-5** | Minor     | `static-server.mjs:119-126` returns 308; `static-server.test.ts:120-131` asserts `Location: /sub/` then 200. Test executed and green.                                                                                                                                       | **CLOSED** |
| **R1-m-6** | Minor     | `docs/adr/0005:50-52` states the exact 214 bytes and 8.1%. Recomputed: 214/2,640 = 8.11%.                                                                                                                                                                                   | **CLOSED** |

### Internal review findings

| ID          | Sev.      | Independent verification                                                                                                                                      | Status     |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **IR1-I-1** | Important | At the candidate, **Active claims** is empty and `SBLA-003 remediation R1` appears under **Closed claims** with its close time and candidate/handoff commits. | **CLOSED** |
| **IR1-m-1** | Minor     | `README.md` is present in the handoff's "Modified during Round 1 remediation" inventory, and matches the real diff.                                           | **CLOSED** |

**All fourteen prior findings (six Important + six Minor from Round 1, plus one
Important + one Minor from internal review) are independently confirmed closed.**

---

## Criteria-by-criteria results

### The nine numbered reviewer criteria

| #     | Criterion                                                                                                                                                                                                                | Result   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| **1** | Five ADR decisions, alternatives, consequences, reversal costs match §§11.1–11.2 and Phase 0 task 0.2, including no runtime AI                                                                                           | **PASS** |
| **2** | Every decision-relevant provider fact supported by dated official source; no inference presented as a guarantee                                                                                                          | **PASS** |
| **3** | Three-scenario capacity model measures current output, uses hard ceilings, labels targets, separates launch from optional, preserves SBLA-012/015/016 rerun                                                              | **PASS** |
| **4** | No-auto-charge rule satisfied by excluding metered services; 70%/85% limitation and fallback honest                                                                                                                      | **PASS** |
| **5** | No-analytics baseline and optional injection gate obey §11.7 SRI plus privacy/event/log restrictions, consistently across ADR, JSON, and capacity model                                                                  | **PASS** |
| **6** | One unchanged artifact deploys and works at a second static host; prose makes no future-route claim and imposes the recursive gate                                                                                       | **PASS** |
| **7** | ADR 0002 stays clear of SBLA-007 schema ownership; no later-task scope pre-empted                                                                                                                                        | **PASS** |
| **8** | SBLA-002 operating model, handoff format, recovery log, command contract, claim ledger, and owner-approval boundary intact                                                                                               | **PASS** |
| **9** | All six Important and six Minor combined Round 1 findings closed with evidence, including quote-safe parser, `<area>` and `<noscript>` coverage, inert-template exclusion, trailing-slash RED/GREEN, and manifest recipe | **PASS** |

**Notes on individual criteria.**

**1 — PASS.** All five ADRs carry `Status: Proposed`, `Date`, `Task`, and the
five mandated sections from `docs/adr/README.md`. ADR 0001 fixes exactly the
§11.2 stack and states the no-runtime-AI decision plus its high reversal cost
(`0001:38-43`, `:79-81`). Phase 0 task 0.2's checklist items — static-first,
Astro/React islands, file content, search, hosting, asset delivery, no runtime
AI, alternatives, reversal cost, verified free-tier constraints — are each
covered. Owner approval correctly remains outstanding.

**2 — PASS.** 18/18 sources reachable and dated; per-fact mapping present;
fact/inference separation explicit throughout. This reviewer found no case where
a project conclusion is dressed as a provider promise. The sourced-absence
handling of the ingestion quota is exemplary.

**3 — PASS.** Every figure reproduces (above). The measured shell is separated
from the planning envelope; each planning input carries its basis; the
SBLA-012/015/016 pre-activation rerun appears in the §11.8 clarification, in
ADR 0005's Decision item 5, and in Consequences. "Capacity planning, not a
forecast" is stated repeatedly.

**4 — PASS.** R2 is excluded on principle (`0003:36-39`, `0005:176-178`) rather
than on fitting a free tier — a stricter reading than §11.8 required. The
70%/85% clause is handled honestly: the documentation genuinely does not expose
configurable Free Pages build alerts, no alert is claimed configured, and the
weekly-review fallback at 350/425 is arithmetically correct and labelled an
operational substitute for all four providers considered.

**5 — PASS.** The launch baseline contains no analytics script; the optional
path is gated on an _observed_ `integrity` attribute in real production HTML;
manual embedding is prohibited with Cloudflare's own reason cited. Custom
events, raw logs, and persistent identifiers are zero in both modes and in the
machine record. ADR 0004, ADR 0005, and `provider-quotas.json` agree.

**6 — PASS.** Independently confirmed the strongest way available: a build from
the candidate reproduced the acceptance manifest exactly, and the live
deployment currently serves those exact bytes. Coverage limits are disclosed
rather than overstated (`0003:154-163`), and the recursive expansion gate binds
future tasks.

**7 — PASS.** `docs/adr/0002:7-8` explicitly defers schemas to SBLA-007 and
fixes only the mechanism. No SBLA-004–006 asset selection, SBLA-007 schema, or
later product surface is pre-empted anywhere in the package.

**8 — PASS.** Command contract in `package.json` matches `AGENTS.md:76-83`
unchanged. The ledger is coherent at the candidate. The recovery log records
every irregularity — including two omitted internal reviews, a canceled Round 2
dispatch, an exhausted internal reviewer, and the pre-claim parser memo — without
back-dating any of them. Role boundaries hold: the reviewed diff contains no
Claude-Review-authored change, and the coordination claim is isolated.

**9 — PASS.** See the fourteen-row verification table above.

### The ten acceptance-criteria bullets

| Acceptance criterion                                                                       | Result                                                                                                                                                         |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADRs 0003 and 0005 agree Netlify's 15 GB cannot carry the 10k scenario                     | **PASS**                                                                                                                                                       |
| ADR 0003 states mount-root-only, defines the future gate, names coverage, records 17 tests | **PASS** — coverage list matches the implementation exactly                                                                                                    |
| Addendum digest preserved; parser tests prove the seven listed constructs                  | **PASS** — digest exact; all constructs verified by execution                                                                                                  |
| ADR 0004 and JSON prohibit manual embed, select no analytics, require SRI first            | **PASS**                                                                                                                                                       |
| ADR 0005 uses plan hard ceilings, exposes targets, exact gzip bytes, both models           | **PASS**                                                                                                                                                       |
| Content-manifest recipe reproduces `f73ea50…2cdc`                                          | **PASS** — reproduced by this reviewer                                                                                                                         |
| Static server returns tested trailing-slash redirect without weakening containment         | **PASS**                                                                                                                                                       |
| Handoff has the ten §13.6 headings once and in order; omissions recorded not fabricated    | **PASS** — empty diff against the spec                                                                                                                         |
| Pinned `pnpm verify`, E2E, manifest, live proof, JSON parse, links, role/scope checks      | **PASS with caveat** — all constituent gates run and green; the pinned runner and the browser E2E were not runnable by this reviewer (environment, not defect) |
| Independent Account-B Round 2 returns PASS before the owner gate                           | **This report** — see verdict                                                                                                                                  |

---

## Findings

### Critical findings

**None.**

### Important findings

**None.**

This reviewer specifically attempted to break the parser remediation rather than
confirm it, and produced 71 probes across nine attack surfaces. No probe found
a defect in the candidate. The three probes that initially disagreed were all
reviewer errors, corrected and re-verified above.

### Minor findings

None of the following blocks acceptance. All four are latent or presentational,
and each is recorded with its exact location.

#### R2-m-1 — Both collectors ignore `<base href>` when resolving relative URLs

**Location:** `tests/integration/portability/resource-references.ts:54,88`
(`const page = new URL(pageUrl)`) and `:116` (`new URL(raw, page)`).

Relative references are always resolved against the page URL. A `<base href>`
element, which a browser honours, is not consulted. Verified by probe I1:

```html
<head>
  <base href="/other-root/" />
</head>
<body>
  <img src="rel.png" />
</body>
```

resolves to `/science-lifting-atlas/rel.png`; a browser would fetch
`/other-root/rel.png`.

**Why it is only Minor, and why it is still worth recording.** The current
artifact emits no `<base>` element, so nothing is wrong today, and ADR 0003
already scopes the suite to the current shell. It is worth recording because
`<base href>` is a natural candidate for the _deferred_ nested-route strategy
that R1-I-2 requires (`docs/adr/0003:50-54`), and `docs/adr/0003:158-163`
obliges future tasks to **extend** this parser rather than replace it. If a
route task adopts `<base>`, the containment gate would silently validate the
wrong URLs. The recursive-extension gate should name `<base href>` explicitly.

#### R2-m-2 — `toBeGreaterThan(0)` is a weak regression guard, currently satisfied by a single reference

**Location:** `tests/integration/portability.test.ts:100` and `:138`.

This reviewer measured the real coverage by assertion against the built
artifact: the current `dist/index.html` yields **exactly one** resource
reference (`./assets/index.DlWfByZd.css`) and **exactly one** navigation
reference (`./`; `#main` is correctly skipped).

The guard would therefore still pass if a future change reduced a
many-reference page to one. The limitation is disclosed honestly at
`docs/adr/0003:154-163` and `:195-199`, so this is not a truthfulness problem —
but when the recursive gate is implemented, the count assertion should become a
floor derived from the artifact rather than `> 0`.

#### R2-m-3 — Rounding convention is unstated at an exact midpoint

**Location:** `docs/adr/0005-zero-cost-infrastructure-model.md:114` (and `:99-102`).

The 1,000,000-view optional figures are exactly `12.125 GB` and
`5,079.125 GB` — precise midpoints at two decimal places. The ADR publishes
`12.13` and `5,079.13` (round-half-up); round-half-even yields `12.12` and
`5,079.12`. The ADR says totals "are rounded to two decimals" but does not say
which rule applies at a tie.

Materially irrelevant — the cost outcome is $0 under either — but the ADR's own
stated purpose for retaining six decimals is that "the arithmetic can be
reproduced" (`:100-101`), and at this one cell a reproducer using the other
common convention gets a different digit. One clause naming the rule would close
it.

#### R2-m-4 — Navigation collector compares tag and attribute names case-sensitively; the resource collector does not

**Location:** `tests/integration/portability/resource-references.ts:91-92`
(`element.tagName !== 'a'`, `name === 'href'`) versus `:58,63,68`, which apply
`.toLowerCase()` throughout.

This reviewer **could not construct an input where it misbehaves**: parse5
lowercases HTML tag and attribute names during tokenization, and probes C5
(`<A HREF="/UPNAV">`) and F4 (SVG `<a href>`) both pass. It is recorded only as
a latent inconsistency between two functions in the same module that are
described as sharing one parsing approach — a hardening note, not a defect.

---

## Fact versus inference

**Verified by execution in this session:** the candidate/claim commit
relationship and clean worktree; the byte-identical 139-file export; all
fourteen repository gates listed above; the 17-test portability suite; the
content-manifest digest; the live second-host page/CSS/health digests; 18/18
provider URL reachability; the beacon's raw/gzip bytes, cache-control, and
ETag; every capacity-model figure and column sum; the measured shell byte
counts; the §13.6 heading diff; the byte-identity of three prior review reports
and their recorded digests/lines/bytes; the parse5 registry integrity, licence,
and dependency; 0 vulnerabilities across 651 dependencies; 30 relative links;
71 adversarial parser probes; the exact reference census of the built artifact.

**Inference, labelled as such:** that the JavaScript-disabled E2E requirement is
satisfied — argued from zero `<script>` tags, zero emitted JavaScript, and both
asserted strings present in static HTML served at 200, but **not** confirmed in
a browser here. That `<base href>` is a plausible future nested-route mechanism
(R2-m-1) is judgement, not measurement; the resolution behaviour itself is
measured.

**Not verified by this reviewer:** the pinned `node@24.20.0` /
`pnpm@11.24.0 --frozen-lockfile` run, and `pnpm test:e2e` in Chromium. Both were
blocked by this reviewer's sandbox, both are recorded as environment
limitations, and neither is treated as a candidate defect. Codex independently
recorded a pinned PASS at this candidate.

---

## Role and scope audit

- This reviewer wrote exactly one repository file: `reviews/releases/SBLA-003-r2.md`,
  which is inside the `reviews/` boundary that `scripts/foundation/role-paths.mjs:13`
  assigns to `claude-review`, and matches the append-only pattern
  `reviews/<discipline>/<task-id>-r<number>.md` required by `AGENTS.md:66-67`.
- No existing file was modified. No prior review report was edited. The artifact
  under review was not repaired, and no defect was fixed on the reviewer's behalf.
- All build, install, and probe activity occurred in a scratch export outside the
  repository; the reviewed worktree was clean before this file was created.
- The owner gate is untouched: all five ADRs remain `Proposed`, no provider is
  approved, no Cloudflare account/project/alert/analytics site is claimed
  configured, and the §11.8 clarification is correctly limited to queue staging.

---

## Overall verdict

# PASS

**Zero Critical findings. Zero Important findings. Four Minor findings, none
blocking.**

All nine numbered reviewer criteria PASS. All ten acceptance-criteria bullets
PASS, with one explicitly recorded environment caveat on the pinned-runtime and
browser-E2E gates that is a limitation of this reviewer's sandbox and not a
property of the candidate. All fourteen prior findings — six Important and six
Minor from combined Round 1, plus one Important and one Minor from internal
review — are independently confirmed closed. Both pre-claim parser observations
are formally verified closed by execution, including a contrapositive proof that
the `scriptingEnabled: false` change is load-bearing and a tree-shape proof that
template inertness is structural rather than incidental.

The package's evidentiary discipline is unusually strong for this stage. Three
independent reconstructions — the content manifest, the capacity arithmetic, and
the analytics beacon measurement — each reproduced the recorded values exactly,
and the live second-host deployment still serves bytes identical to a build this
reviewer produced on a different Node major version. Provider facts are dated,
sourced, and cleanly separated from project inference, and the one place where
the master plan asks for something the provider does not offer (configurable
70%/85% alerts) is handled by documenting the absence rather than inventing a
capability.

**SBLA-003 is recommended for the owner approval gate.** Owner approval remains
a separate and still-outstanding decision covering the proposed Cloudflare Pages
Free direction, the $0 model, the no-analytics launch baseline, and the optional
post-launch analytics gate.

### Report scope and worktree state

This report reviews commit `5bd35e320aa74bfcdbf839849c5fadc7c52292fe` on branch
`claude-review/SBLA-003-r2-acceptance` in worktree
`.worktrees/sbla-003-claude-review-r2-acceptance`. Coordination commit
`7cc5cffddbdc01ca59f0db1383409c4d803eaaea` was used only as claim evidence and
was not reviewed as artifact content. The worktree was clean at the reviewed
commit before this file was written and contains no other change.
