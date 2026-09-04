# ADR 0003 — Hosting and asset delivery

- Status: Proposed
- Date: 2026-08-30
- Task: SBLA-003
- Reverified: 2026-09-02
- Round 1 remediation: 2026-09-03
- Late Round 1 addendum remediation: 2026-09-04
- Related: [ADR 0001](0001-static-first-architecture.md), [ADR 0005](0005-zero-cost-infrastructure-model.md)

## Context

Master plan §11.2 names Cloudflare Pages as the static-host candidate and
Cloudflare R2 “or equivalent” for large GLB/KTX2 assets. §11.8 requires one
unchanged static build artifact to deploy to a second host and forbids any
service that can auto-upgrade or incur usage charges.

Provider facts were re-read from official documentation on 2026-09-01 and are
recorded in [`provider-quotas.json`](provider-quotas.json). Cloudflare documents
500 Free-plan Pages builds/month, 20,000 files/site, 25 MiB/file, and free,
unlimited static requests. R2 has a free allowance but then charges metered
overage; Cloudflare budget alerts are informational and do not cap usage. The
independent Account-B reviewer reverified every decision-relevant provider fact
from the cited official sources on 2026-09-02.

## Decision

1. **Proposed primary host: Cloudflare Pages Free, static features only.** If
   approved, Release 1 uses no Pages Functions, runtime Worker, paid plan, or
   metered add-on.
2. **Asset delivery: Pages itself while every file is ≤25 MiB.** The current
   6 MB target/10 MB ceiling for initial desktop 3D and the 3 MB exercise-loop
   ceiling fit. SBLA-005 must measure real assets. If an asset exceeds 25 MiB,
   compress, split, stream as independently bounded files, or ship the 2D
   fallback; do not silently activate a metered store.
3. **Do not activate R2 in Release 1.** Its metered overage can incur charges,
   which conflicts with §11.8 even though the modelled usage fits its free tier.
   R2 remains a future alternative only if a provider-enforced hard cost cap is
   verified and a superseding ADR is owner-approved.
4. **Second host: GitHub Pages.** It is a portability proof and emergency shell
   fallback, not the production host. Its 1 GB published-site cap, 100 GB/month
   soft bandwidth limit, and commercial-use restriction prevent using it as the
   primary Release 1 host.
5. **Make the current shell artifact host-safe.** Astro
   `build.assetsPrefix: '.'` makes the current generated stylesheet URL
   relative, and `build.assets: 'assets'` avoids a host-reserved underscore
   directory. No post-build rewrite or host-specific build is permitted. The
   current homepage wordmark uses `href="./"`, which is correct only because the
   homepage sits at the deployment mount root. Both choices are
   **mount-root-only**: on a nested route, `./assets/...` resolves below that
   route and `./` navigates back to that route instead of the site home. Before
   adding a nested route, its owning task must replace these choices with a
   deterministic route-depth-aware URL strategy that still lets one unchanged
   artifact pass both deployment mounts.

## Same-artifact deployment proof

### Local red/green proof

On 2026-09-01 the positive subpath test was written before configuration:

- **RED:** `pnpm test:portability` failed because
  `/_astro/index.DlWfByZd.css` escaped `/science-lifting-atlas/`.
- `vite.base: './'` still emitted an absolute URL because Astro controlled the
  generated link; Astro `base: './'` emitted `/./_astro/...`; both remained red.
- **GREEN:** the supported Astro `build.assetsPrefix` option emitted a relative
  link. A second red/green cycle moved generated assets from `_astro/` to the
  generic `assets/` directory required by the branch-based GitHub Pages path.
- `pnpm build && pnpm test:portability` passed the first four tests against one
  `dist/`: page and generated assets at `/`, no redirect/rewrite, and the same
  page/assets mounted at `/science-lifting-atlas/`.
- The first real project-subpath deployment exposed a second defect that the
  asset-only test did not cover: the wordmark's author-supplied `href="/"`
  navigated to the GitHub host root. A new same-origin navigation test was
  written first and failed on that escaped path.
- **GREEN:** changing only the current homepage wordmark to `href="./"`
  retained the deployment mount at both a root and project subpath. The
  five-test suite at that point passed against that one-page artifact.

[Vite documents relative bases for unknown deployment paths](https://vite.dev/guide/build#relative-base),
and [Astro documents `build.assets` and `build.assetsPrefix`](https://docs.astro.build/en/reference/configuration-reference/#buildassets).
Using `.` as the Astro prefix is a project inference, verified by emitted HTML
and local/external tests rather than asserted as provider behaviour. These
documentation pages were accessed 2026-09-01.

[Astro documents ordinary `<a>` elements for navigation](https://docs.astro.build/en/guides/routing/#linking-to-pages),
and [Astro's issue tracker confirms that the `base` setting does not rewrite
manually authored links](https://github.com/withastro/astro/issues/11159).
Therefore the current homepage's `./` is intentionally document-relative:
unlike a build-time concrete base, it works for this mount-root page when the
final mount is not known while building. A nested route would resolve `./` to
its own directory and needs route-aware home-link logic instead.

### Real GitHub Pages deployment

The first external proof from repository commit `7a2ea935...` demonstrated
byte-identical page and CSS delivery, but the subsequent navigation inspection
found that its wordmark escaped the project mount. It is retained as a failed,
superseded proof rather than counted as acceptance evidence: manifest
`88f6ee82...`, deployment commit `41090ca...`, Pages run `33515952080`, and
downloaded page SHA-256 `64ec65e6...`.

After the navigation test and fix, the exact `dist/` produced from repository
commit `9f26a3a3d94bb2ea763304f57e817d39758c5bf6` was copied without mutation over
the same deployment-only public repository. Its `main` branch contains only
those nine generated files: no application source, workflow, secret, custom
domain, or billing configuration.

| Evidence                                 | Result                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| Local `dist/` content-manifest SHA-256   | `f73ea5056c48dfda96e2b83735ae8adb1b4c02d1665213041bcfb69ca2592cdc`                     |
| Deployment-copy content-manifest SHA-256 | same                                                                                   |
| Deployment repository commit             | `569eef0d0ff4d2528f0fd7eaf0f5a0e7fa3e92ca`                                             |
| GitHub Pages run                         | `33524170082`, success                                                                 |
| Public URL                               | <https://frankiebiz.github.io/sbla-003-portability-proof-20260901/>                    |
| Page                                     | HTTP 200; expected title/content present                                               |
| Referenced CSS                           | HTTP 200 at `assets/index.DlWfByZd.css`                                                |
| Wordmark `./` navigation                 | HTTP 200; remains at the project URL                                                   |
| `health.txt`                             | HTTP 200 at the project subpath                                                        |
| Downloaded page SHA-256                  | `bc1ac51076b718db0343aa69136f25e9248360c3675fbe65da27333ae5187110`, identical to local |
| Downloaded CSS SHA-256                   | `76a9808cd41f62deae3f4c609fa4fd58d28a57f083b414a137e48aa20d271d5e`, identical to local |

The content-manifest digest is defined, from inside `dist/`, as the SHA-256 of
the lexicographically sorted per-file SHA-256 lines, including each command's
leading `./` pathname:

```bash
find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256
```

The current artifact contains no whitespace or newline in a filename. A future
task that permits either must first replace this recipe with a null-delimited
manifest format and record the resulting new digest; silently changing the
recipe would invalidate the acceptance artifact.

This satisfies “export and deploy to a second static host from the same build
artifact” for the current one-page shell only. The current quote-aware HTML
parser inspects same-origin:

- `href` on `<link>`, SVG `<image>`/`<use>`, and navigation `<a>`/`<area>`;
- `src` on `<audio>`, `<embed>`, `<iframe>`, `<img>`, `<input>`, `<script>`,
  `<source>`, `<track>`, and `<video>`;
- `srcset` on `<img>`/`<source>` and `imagesrcset` on `<link>`;
- `poster` on `<video>` and `data` on `<object>`; and
- `content` on recognized Open Graph, Twitter, itemprop image, and Microsoft
  tile-image metadata.

The parser accepts valid quoted and unquoted attributes, including `>` inside a
quoted value. Generic metadata, custom lazy-load attributes such as `data-src`,
fragments, and external or non-HTTP(S) URLs are intentionally outside this
same-origin static-file fetch check. The current suite has three files and
fifteen tests. It does not recursively inspect future routes, CSS `url()`
values, JSON, Pagefind, fonts, or GLB dependencies.

Before a task adds or nests a route or introduces a new asset class, that task
must extend the portability suite to recursively enumerate every
`dist/**/*.html`; exercise each route at a domain root and project subpath;
validate all same-origin HTML references and anchors plus relevant CSS `url()`,
JSON, Pagefind, font, and GLB references; and verify route-aware home navigation.
The same unchanged `dist/` must pass both mounts before that task can hand off.

## Usage thresholds

Cloudflare’s reviewed documentation does **not** document configurable Free
Pages build-count alerts. Its generic usage-billing notifications are described
for Professional/pay-as-you-go accounts, not as a Free Pages build counter.
Therefore no 70%/85% provider alert was claimed or configured. Until a supported
control is verified, the deployment runbook is:

- review the Pages build count weekly;
- at 350 builds/month (70%), batch non-urgent changes;
- at 425 (85%), allow only correction or release-blocking builds until reset.

No Cloudflare account/project credential was available in this worktree, so the
primary Pages project and operational review cannot be configured before owner
approval. GitHub Pages likewise documents no configurable 70%/85% Pages quota
alerts.

## Consequences

- The production path cannot produce usage charges because it uses only Free
  Pages static delivery and optional free Web Analytics.
- The 25 MiB per-file boundary is a release gate. A large model cannot be
  “temporarily” moved to R2 without superseding this ADR.
- The current homepage, current stylesheet, health file, and current wordmark
  are portable to a domain root or project subpath. No claim is made for routes
  or asset classes that do not yet exist.
- `build.assetsPrefix: '.'` and the homepage `href="./"` fail on nested routes.
  A future route task must replace both with a route-depth-aware strategy before
  it may add or nest a route; the recursive dual-mount gate must prove the
  replacement against one unchanged artifact.
- Every task that expands routes or asset classes inherits the recursive
  portability-suite extension gate above; the current fifteen tests alone are
  insufficient evidence for that future output. The local harness now returns
  a 308 trailing-slash redirect for a directory request, matching the ordinary
  static-host behavior that those future route tests must exercise.
- GitHub Pages is non-production proof infrastructure. If the project becomes
  commercial, its deployment must be removed or replaced.

## Alternatives considered

- **R2 for all large assets.** Not selected: free allowances are ample, but
  metered overage and automatic billing violate the no-charge rule.
- **Netlify Free as primary or portability target.** Its hard free limit is safe
  from charges, but 300 monthly credits provide at most 15 GB before requests
  and deploys. Even the 10k hard-capacity scenario exceeds that ceiling.
- **GitHub Pages as primary.** Rejected on the 1 GB site cap, 100 GB soft
  bandwidth limit, and terms restricting commercial hosting.
- **A CDN in front of a runtime origin.** Rejected by §11.1; Release 1 has no
  runtime requirement.

## Reversal cost

- Moving the current unchanged one-page artifact to another root or
  subpath-capable static host is **low** cost; the real GitHub Pages deployment
  demonstrates only that present boundary.
- Changing asset hosts is **moderate** cost because URLs, CORS, cache headers,
  integrity, fallback behaviour, and quota monitoring must be revalidated.
- Introducing runtime hosting is **high** cost because security, observability,
  failure modes, and cost controls become new product surfaces.

## Open items for the owner

- Owner approval is not yet recorded. Confirm Cloudflare Pages Free as the
  production direction and confirm that no paid plan or metered add-on will be
  enabled.
- Confirm the future domain separately; this ADR does not register or attach one.
