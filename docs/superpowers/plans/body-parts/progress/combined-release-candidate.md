# Combined release candidate

Branch: `bp/digital-assets-merge` · Head: 2774c1b (plus this note) · Built on the integration tip `c2ea6fd` (which includes the deployed Site source `a8bc490`).

## What is combined

| Branch                                    | What it adds                                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `FrankieBiz/body-parts-atlas` @ `c2ea6fd` | All 13 regions, the homepage body map, study-list upgrades, Q1 browser fixes, and the recorded release.                    |
| `bp/digital-assets`                       | Brand icons, web manifest, robots.txt, social cards, and the head tags that use them.                                      |
| (this branch) `AtlasLayout.astro`         | Optional `PUBLIC_SITE_URL`: absolute `og:image`, `twitter:image` and a canonical link when set; unchanged output when not. |
| `FrankieBiz/fix-low-quality-app`          | Anatomy posters rendered at 4x and served as responsive WebP.                                                              |

## Deliberately not merged

- `FrankieBiz/feat-newest-first-categorized`: the earliest plain-styled prototype of the same feature, branched from `main` before any of this work. Everything in it is superseded; merging it would regress the finished pages.
- The SBLA review, research and Codex coordination branches (`claude-review/*`, `claude-research/*`, `codex/SBLA-*`, `codex/PLAN-*`, `FrankieBiz/review-nav-path-audit` and similar): a different workstream with its own role-owned queue. They are not body-part work and were not asked about individually.

## Verification (Node v24.20.0, pnpm 11.24.0)

- `pnpm install --frozen-lockfile`: lockfile consistent.
- `pnpm verify`: exit 0. 0 type errors; 31 unit files / 439 tests; 5 accessibility tests; 4 visual tests; portability; build of 15 pages; foundation and asset decisions.
- `pnpm test:performance`: 1/1.
- Built-output link check: 15 pages, 555 internal references including image `srcset` entries, 0 broken.
- `pnpm test:e2e`: not run by me (no browser in this sandbox). An outside run reported by the owner (47 tests, 47 passed; the total matches `playwright test --list`, 47 tests in 7 files) found one real defect that nothing else had caught: the layout's `theme-color` was `#ffffff` while the web manifest and `digital-assets.spec.ts` expect `#0b0e11`. Fixed in the commit after this note's first version. I have not independently reproduced the passing run.
