# Addendum to SBLA-003 Round 1 independent Claude Review — finding R1-I-6

## Status of this document

This is **not** a replacement for `reviews/releases/SBLA-003-r1.md`. That report
is committed at `4e1c0b8182beb20a97ade4c5f7ddca5aaedb2c59` on
`claude-review/SBLA-003-r1` and integrated at `95d3ac3` on
`codex/SBLA-003-architecture-adrs`, with SHA-256
`51a2a470399b92129a2a17b75824987df88b397992a3608040cf22bccf40455f`. Review
reports are append-only (`CLAUDE.md:118-120`, `AGENTS.md:66-67`), so this
reviewer did not and will not edit it.

The round-1 review session continued after that commit landed and found one
further **Important** finding. This addendum records it, states exactly what it
changes in the committed report's arithmetic, and leaves the placement decision
to Codex as merge authority.

Same reviewer, same session, same artifact: commit
`c9c9fbe96c2af2ae2a0f57b22c647b6bf6073203`, tree
`a56a5cb07c0ae0297485e9d20d4f23cab00945c4`. Nothing under audit was edited.

## Placement decision for Codex

`4e1c0b8` is unmerged: `git branch -a --contains 4e1c0b8` returns only
`claude-review/SBLA-003-r1`, and `main` is still at `77a7623`. Two defensible
options; the choice belongs to Codex, not to this reviewer.

1. **Amend the unmerged round-1 report.** The round was still open when
   `4e1c0b8` was committed, so folding R1-I-6 in keeps a single coherent r1 and
   avoids a remediation that starts from a knowingly incomplete list. The
   reviewer holds a fully merged and Prettier-clean version of that report at
   1,024 lines, SHA-256
   `d4edc37d749bd5f8f97b9d245f507f46b33dc0a88cc9cdba965773c16d308375`, which
   differs from the committed file only by this finding and its consequential
   count and criterion updates.
2. **Leave r1 as committed and carry R1-I-6 into the remediation scope**, with
   the formal record made in `reviews/releases/SBLA-003-r2.md`. This is the
   stricter reading of append-only.

Either way, **R1-I-6 must be in the remediation scope.** What must not happen is
the finding being dropped because it arrived after the commit.

## Corrections to the committed report

If option 1 is taken, these are the only changes:

| Location in `SBLA-003-r1.md` | Committed text                                                       | Corrected text                                                                            |
| ---------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Criterion 7 result           | `**PASS** (2 Minor)`                                                 | `**FAIL** (R1-I-6)`                                                                       |
| Overall verdict              | "Seven of ten criteria pass. Three fail on five Important findings." | "Six of ten criteria pass. Four fail on six Important findings."                          |
| Required reviewer action     | "address the five Important findings"                                | "address the six Important findings"; R1-I-6 is the only one that changes executable code |
| Conditions for acceptance    | five numbered items                                                  | six, adding the R1-I-6 remedy below                                                       |

The overall verdict remains **FAIL**. No PASS criterion becomes a FAIL other
than criterion 7, and no finding already recorded is withdrawn or downgraded.

## R1-I-6 — The resource collector silently misses every resource on a tag whose earlier attribute value contains `>`, and `<area href>` is checked by nothing

### The defect

`tests/integration/portability/resource-references.ts:24` matches tags with:

```js
const tags = htmlWithoutComments.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/giu);
```

`[^>]*` stops at the first `>` in the byte stream. A `>` inside a quoted
attribute value is valid HTML and does not terminate the tag, so every attribute
after it becomes invisible to the collector — including a root-absolute `src`
that would escape the deployment mount. The check then passes green without ever
having looked at the resource.

### Reproduced against real Astro output, not a synthetic string

Astro does not escape `>` inside attribute values. Built with the reviewed
`astro.config.mjs`:

```astro
---
const alt = 'Squat > Deadlift comparison';
---

<img alt={alt} src="/health.txt" />
```

emits, verbatim:

```html
<img alt="Squat > Deadlift comparison" src="/health.txt" />
```

Passed to the project's own `collectSameOriginResourceReferences`, that page
returns `[]`. The root-absolute `/health.txt` — exactly the class of reference
that broke the first GitHub Pages deployment and prompted the navigation test —
is never checked for mount containment and never fetched.

Attribute order is the only thing that saves it. With `src` written before
`alt`, the identical page returns `["/health.txt"]`. A portability gate whose
result depends on the order an author happened to write two attributes is not a
gate.

Alt text containing `>` is not contrived for this product. The domain is
exercise and muscle comparison; `"Squat > Deadlift"`, `"Phase 2 > lockout"`, and
breadcrumb-style alt text all produce it naturally, and SBLA-016 is a
two-entity comparison feature.

### `<area href>` is checked by neither half of the suite

The collector excludes it as navigation: `resource-references.ts:9` puts `area`
in `NAVIGATION_ELEMENTS` and lines 38-40 skip it. The navigation test's regex at
`tests/integration/portability.test.ts:133` is
`/<a\b[^>]*href="([^"]+)"/g`, where `\b` asserts a word boundary that does not
exist between `a` and `r`, so `<a\b` does not match `<area`. Verified:
`/<a\b/.test('<area href="/x">')` returns `false`. An image-map link that
escapes the mount would be caught by nothing.

### Full probe results

Nine constructs through `collectSameOriginResourceReferences`:

| Construct                                                 | Resources returned             |
| --------------------------------------------------------- | ------------------------------ |
| `<img src="/control.png" alt="">` (control)               | `["/control.png"]`             |
| `<embed src="/e.svg">`                                    | `["/e.svg"]`                   |
| `<video poster="/poster.jpg" src="/v.mp4">`               | `["/v.mp4"]` — `poster` missed |
| `<meta property="og:image" content="/og.png">`            | `[]`                           |
| `<link rel="preload" as="image" imagesrcset="/a.png 1x">` | `[]`                           |
| `<object data="/thing.svg">`                              | `[]`                           |
| `<img src=/unquoted.png alt="">`                          | `[]`                           |
| `<area href="/area-target" shape="rect">`                 | `[]`                           |
| `<img alt="a > b" src="/gt-case.png">`                    | `[]`                           |

The last two are silent parser failures. The middle group are coverage limits:
`poster`, `imagesrcset`, `<object data>`, `<meta property="og:image" content>`,
and unquoted attribute values are all uncollected. Of those, `og:image` is the
one most likely to matter, since a root-absolute social-preview URL breaks on a
project subpath exactly as the wordmark did.

### Why Important rather than Minor

The current artifact is **not** affected. All 37 attribute values in the built
`index.html` were checked and none contains `>`, so the round-1 deployment proof
stands unchanged and the live GitHub Pages evidence is unaffected.

It is Important because of what the suite is being used for. ADR 0003 offers it
as the standing portability evidence
(`docs/adr/0003-hosting-and-asset-delivery.md:116-119, 154-156`), and the
recursive-extension gate at lines 121-126 requires future tasks to _extend_ this
parser rather than replace it, so every future route inherits the defect at the
moment routes start to exist.

It is also a surviving instance of the exact failure class the code-quality
round was convened to close. The handoff at
`reviews/releases/SBLA-003-handoff.md:187-188` states that "the resource fixture
proves the former false-negative path directly", and it does — the `/assets/`
substring filter is genuinely fixed. But a new silent false-negative path was
introduced alongside that fix and no fixture covers it. This is the second time
in this review that a repair was found not to have been carried across the whole
surface it applies to; R1-I-1 is the first.

### Remedy

Make the collector quote-aware or replace it with a real HTML parse; bring
`<area href>` under one of the two checks; and add fixtures for a `>`-bearing
attribute value and an image-map link. Decide explicitly whether `poster`,
`imagesrcset`, `<object data>`, and `og:image` are in scope, and record that
decision in ADR 0003 rather than leaving it implicit in the collector.

As the sixth numbered item under "Conditions for acceptance":

> 6. **R1-I-6** — Make the resource collector quote-aware or replace it with a
>    real HTML parse, bring `<area href>` under one of the two checks, and add
>    fixtures for a `>`-bearing attribute value and an image-map link. Decide
>    explicitly whether `poster`, `imagesrcset`, `<object data>`, and
>    `og:image` are in scope, and record that decision in ADR 0003.

## Fact versus inference

**Verified by this session:** the nine collector-probe results above; that Astro
emits a raw `>` inside an `alt` attribute value; that the collector returns `[]`
for that emitted page and `["/health.txt"]` for the attribute-order-reversed
page; that `/<a\b/.test('<area href="/x">')` is `false`; and that none of the 37
attribute values in the current built `index.html` contains `>`.

**Inference, labelled:** that alt text containing `>` is likely in this
product's comparison-heavy domain. The mechanism is measured; the likelihood is
judgement.

## Scope statement

This addendum was authored outside the repository. No repository file was
created, modified, or deleted by this reviewer at any point in this round. The
review worktree `.worktrees/sbla-003-claude-review-r1` is clean at
`4e1c0b8182beb20a97ade4c5f7ddca5aaedb2c59`, which contains exactly one file
change: `reviews/releases/SBLA-003-r1.md`, added.
