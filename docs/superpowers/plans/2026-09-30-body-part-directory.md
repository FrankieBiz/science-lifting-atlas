# Body-Part Directory — Full Build Plan

> **Read this whole file before you touch anything.** It is written so that a
> fast agent (GPT‑6 Luna, Claude Sonnet 5.5, or similar) can pick up any one
> task below and finish it without chat context. Every task names the exact
> files it owns, the steps, the commands, and how to know it is done.
>
> **Owner direction, 2026-09-30:** body-part pages are general educational
> overviews plus automatically listed PubMed studies. They are **not**
> scientific claims and do **not** go through the claim/evidence review
> pipeline. Review is: automated checks + the owner reading the page. Task T5
> records this as ADR 0010. Until T5 lands, this paragraph is the authority for
> every `BP-*` task.

---

## 0. What exists today (start here)

Branch `FrankieBiz/body-parts-atlas`, built on `codex/SBLA-013-private-usability`
(the white, Apple-inspired "Atlas" design with the 3D body explorer). Eight
body-part pages already work.

| Path                                                     | What it is                                                                                                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/body-parts.ts`                                 | **One file** with all 8 regions: overview text, injuries, 4 PubMed queries each, plate focus point, explorer muscle ids. T1 splits this into one file per region. |
| `src/data/studies/<slug>.json`                           | Generated study lists (20 per category). **Never hand-edit.** Only `pnpm studies:fetch` writes these.                                                             |
| `scripts/studies/fetch.mjs`                              | Queries PubMed E-utilities (esearch + esummary), de-duplicates across a page's categories, sorts newest first, writes the JSON.                                   |
| `src/lib/studies/studies.ts`                             | Pure helpers: `toStudy`, `publishedDate` (earlier of online vs issue date), `sortNewestFirst`, `studyType`, `dateParts`, `formatAuthors`, `cleanTitle`.           |
| `src/lib/studies/load.ts`                                | `loadStudies(slug)` and `studyCount(slug)` via `import.meta.glob`.                                                                                                |
| `src/components/body-parts/RegionPlate.astro`            | Dark anatomy "plate": the explorer poster, grayscale, cropped and zoomed so the region is centered, with a pulsing rose ring. Variants `hero` and `card`.         |
| `src/pages/body/[part].astro`                            | Region page: hero + plate, "What it does", main parts, injury cards, research with category tabs (progressive enhancement), "Explore another body part".          |
| `src/styles/body-parts.css`                              | All styles for the above plus the homepage grid. Uses tokens from `src/styles/tokens.css`.                                                                        |
| `src/pages/index.astro`                                  | Homepage. Section `#body-parts` ("Browse by body part") renders one card per region.                                                                              |
| `src/components/sbla-013/AnatomyExplorer.astro`          | 3D explorer. Each muscle button carries `data-region-slug`/`data-region-name`; the selection panel shows a "`<Region>`: overview, injuries & research ›" link.    |
| `src/components/sbla-012/SiteHeader.astro`               | Header nav includes "Body parts" → `#body-parts`.                                                                                                                 |
| `tests/unit/studies.test.ts`                             | Unit tests for the helpers, the data files, and the muscle → region mapping.                                                                                      |
| `tests/e2e/body-parts.spec.ts`                           | Browser journey: home → Elbow → tabs → newest-first → PubMed links; no-JS fallback.                                                                               |
| `assets/derived/bodyparts3d/anatomy-explorer-poster.png` | 862 × 672 transparent PNG, **front view only**. Body bounding box ≈ x 315–547, y 43–639 px. Pectoralis is highlighted red; plates render it grayscale.            |

Current regions: `shoulder`, `elbow`, `wrist-and-hand`, `neck`, `lower-back`,
`hip`, `knee`, `ankle-and-foot`.

---

## 1. Goal and final region list

Thirteen published regions, in this display order and grouping:

| Group      | Slug               | Name             | Status now                           |
| ---------- | ------------------ | ---------------- | ------------------------------------ |
| Upper body | `neck`             | Neck             | exists → revise                      |
| Upper body | `shoulder`         | Shoulder         | exists → revise                      |
| Upper body | `chest`            | Chest            | **new**                              |
| Upper body | `upper-back`       | Upper back       | **new** (back view)                  |
| Upper body | `elbow`            | Elbow            | exists → revise                      |
| Upper body | `wrist-and-hand`   | Wrist and hand   | exists → revise                      |
| Trunk      | `abdomen-and-core` | Abdomen and core | **new**                              |
| Trunk      | `lower-back`       | Lower back       | exists → revise (moves to back view) |
| Lower body | `hip-and-groin`    | Hip and groin    | rename of `hip` → revise             |
| Lower body | `thigh`            | Thigh            | **new**                              |
| Lower body | `knee`             | Knee             | exists → revise                      |
| Lower body | `lower-leg`        | Lower leg        | **new**                              |
| Lower body | `ankle-and-foot`   | Ankle and foot   | exists → revise                      |

Every region page ends up with:

1. Hero: name, tagline, "Read the research" button, three metrics, anatomy plate (front or back view).
2. "What it does." paragraph and "Main parts" card.
3. "Common injuries." cards, plus a safety note.
4. "Newest first." research: 4 tabs (Injuries · Rehab and treatment · Training and strength · Anatomy and biomechanics), **up to 50 studies each**, newest first, "Show more", type filter (All · Reviews · Trials), and "See all N on PubMed ↗".
5. "Explore another body part", grouped.

Homepage gets a clickable **front + back body map** with a hotspot per region, and the card grid grouped Upper body / Trunk / Lower body.

**Out of scope:** individual muscle pages, user accounts, AI summaries of studies, any change to `content/`, claims, evidence gates, reviews, or the prototype banner logic.

---

## 2. Rules every agent follows

### 2.1 Hard rules (breaking one = task fails)

1. **Only edit the files your task owns** (see the ownership table in §4). If you need a change elsewhere, stop and write it in your progress note under "Needs from other tasks".
2. **Never hand-write or edit study data.** Studies come only from `pnpm studies:fetch`. Never invent a title, PMID, DOI, author, or date.
3. **Never weaken, skip, or delete a test to make a check pass.** If a test is wrong, say so in your progress note and stop.
4. **Do not touch:** `content/**`, `research/**`, `reviews/**`, `content-drafts/**`, `docs/runbooks/operating-policy.json`, `docs/product/master-plan.md`, evidence/claim components, `src/lib/presentation/sbla012.ts`, publication gates.
5. **Relative links only.** The site must work under any sub-path (`tests/integration/portability.test.ts`). Region pages live at `/body/<slug>/`, so the site root is `../../` and a sibling region is `../<slug>/`. `AtlasLayout` already computes `rootHref`.
6. **No duplicate HTML `id`s.** Study panels use `studies-<categoryId>`; headings use `heading-<categoryId>`.
7. **Commit only on your task branch.** Never push, merge to `main`, or deploy. The owner does those.
8. **Report real results.** Paste the actual tail of command output into your progress note. Never claim a check you did not run.

### 2.2 Environment (read before running anything)

- **Node must be exactly v24.20.0; pnpm 11.24.0.** Check with `node --version`.
  - In the Claude Code sandbox on this machine the pinned Node is at
    `/private/tmp/claude-501/node-v24.20.0-darwin-arm64/bin`. Prefix commands:
    `export PATH=/private/tmp/claude-501/node-v24.20.0-darwin-arm64/bin:$PATH`.
  - If that directory is gone: `curl -fsSL https://nodejs.org/dist/v24.20.0/node-v24.20.0-darwin-arm64.tar.gz | tar -xz -C "$TMPDIR"` and use `$TMPDIR/node-v24.20.0-darwin-arm64/bin`.
  - The host default Node (v26) fails `pnpm install` with `ERR_PNPM_UNSUPPORTED_ENGINE`. That is expected; switch Node.
- **Install:** `pnpm install --frozen-lockfile --store-dir "$TMPDIR/pnpm-store"`.
  **Never let a `.pnpm-store/` folder appear inside the worktree.** `tests/unit/operating-model-filesystem.test.ts` copies the repo and times out (10 s) if a 400 MB store is inside it. If `ls -a` shows `.pnpm-store`, delete it (`rm -rf .pnpm-store`); `node_modules` does not depend on it.
- **PubMed network access:** host `eutils.ncbi.nlm.nih.gov`. `pnpm studies:fetch` already sets `NODE_USE_ENV_PROXY=1` so Node's `fetch` uses the sandbox proxy. Plain `node` scripts that call `fetch` need that variable too. In a Claude Code sandbox, pass `allowed_domains: ["eutils.ncbi.nlm.nih.gov"]`.
- **Browsers do not launch inside the Claude Code sandbox.** Chromium dies with `SIGTRAP` or `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied`. That is the sandbox, not the code. **Do not change code to "fix" it.** Tasks that need a browser (T2, e2e, screenshots) must run where browsers work (owner terminal, or an agent environment with browser access). Record "not run: sandbox blocks browsers" when that is the reason.
- **Formatting:** a hook may run Prettier on save. Always run `pnpm format` before `pnpm verify`.
- **`.mjs` files are type-checked** (`checkJs`). Add JSDoc types (`/** @param {string} x */`) or `pnpm typecheck` fails with `implicitly has an 'any' type`.
- **TypeScript imported by Node scripts** (anything under `src/data/body-parts/` and `src/lib/studies/`, `src/lib/body-parts/`) must:
  - import other TS files **with the `.ts` extension** (`import x from './shared.ts'`);
  - use `import type { … }` for type-only imports (`verbatimModuleSyntax` is on, and Node crashes on a plain import of a type);
  - use only erasable TS syntax: **no `enum`, no `namespace`, no constructor parameter properties.**
- **Stash is shared across worktrees.** Never `git stash`/`git stash pop`. Use a WIP commit.

### 2.3 Required checks for every task

```bash
pnpm format
pnpm verify              # must exit 0
```

`pnpm verify` runs format check, lint, typecheck, unit tests, content/graph/evidence validation, build, portability, and repository-contract checks. Additionally, where a browser is available:

```bash
pnpm test:e2e            # must pass
```

### 2.4 Branches, worktrees, and progress notes

- Integration branch: `FrankieBiz/body-parts-atlas`. Base commit for Phase 1 is recorded by T0 in `docs/superpowers/plans/body-parts/progress/T0.md`.
- Each task: `git worktree add ../bp-<task-id> -b bp/<task-id> <base-commit>` from the main checkout, work there, commit there.
- Commit style: Conventional Commits, e.g. `feat(body-parts): add chest region`. One task = one or a few commits.
- Each task writes **its own** progress note: `docs/superpowers/plans/body-parts/progress/<task-id>.md` (so parallel tasks never edit the same file). Template:

```markdown
# <task-id> — <title>

Branch: bp/<task-id> · Base: <commit> · Head: <commit> · Agent: <model name>

## Done

- …

## Checks (real output)

- pnpm verify: <last 5 lines>
- pnpm test:e2e: <result or "not run: sandbox blocks browsers">

## Deviations from the plan

- none | …

## Needs from other tasks / owner

- none | …
```

- These tasks do **not** add entries to `docs/runbooks/current-work.md` and do **not** use `pnpm handoff`; the progress note is the handoff (ADR 0010).

---

## 3. Phases and schedule

```
Phase 0 (serial, owner + 1 agent)   T0 baseline commit ──► T2 back-view poster (needs browser)
Phase 1 (parallel)                  T1 registry split + validator      T5 ADR 0010
Phase 2 (parallel, after T1)        T3 study-list upgrades             T4 homepage body map (needs T2)
Phase 3 (parallel, after T3)        R-* region tasks, 13 of them, fully independent
Phase 4 (serial)                    Q1 integration QA + screenshots ──► owner review ──► owner merges/deploys
```

Merge order into `FrankieBiz/body-parts-atlas`: T0 → T2 → T1 → T5 → T3 → T4 → R-* (any order) → Q1.
The owner (or one designated integrator session) merges with `git merge --no-ff bp/<task-id>` after reading the diff and the progress note, then runs `pnpm verify` on the integration branch.

### Suggested model assignment

| Task                                                                                                   | Suggested model                       | Why                                   |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------- |
| T0                                                                                                     | owner / this session                  | Needs owner approval to commit        |
| T1, T3                                                                                                 | Claude Sonnet 5.5                     | Type-heavy refactor + script logic    |
| T4                                                                                                     | GPT‑6 Luna                            | UI component, independent files       |
| T2, Q1                                                                                                 | whichever model has a working browser | Need Playwright outside the sandbox   |
| T5                                                                                                     | GPT‑6 Luna                            | Docs only                             |
| R-chest, R-upper-back, R-abdomen-and-core, R-thigh, R-lower-leg                                        | Claude Sonnet 5.5                     | New regions, more research-query work |
| R-neck, R-shoulder, R-elbow, R-wrist-and-hand, R-lower-back, R-hip-and-groin, R-knee, R-ankle-and-foot | GPT‑6 Luna                            | Revisions of existing content         |

Swap freely; the tasks do not depend on which model runs them.

---

## 4. File ownership

A file has exactly one owning task at a time. Anything not listed is off-limits.

| Task       | Owns (may create/edit)                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T0         | git commit only; `docs/superpowers/plans/body-parts/progress/T0.md`                                                                                                                                                                                                                                                                                                                                 |
| T2         | `scripts/assets/capture-posters.mjs`, `assets/derived/bodyparts3d/anatomy-explorer-poster-back.png`, `docs/licenses/anatomy-explorer-back-poster.md`, `package.json` (one script line), progress note                                                                                                                                                                                               |
| T1         | `src/data/body-parts.ts` (delete), `src/data/body-parts/**`, `src/lib/body-parts/**`, `src/components/body-parts/RegionPlate.astro`, `scripts/body-parts/mark-points.py`, `src/data/studies/hip.json` → `hip-and-groin.json` (git mv only), import-path updates in every file that imports `data/body-parts`, `tests/unit/studies.test.ts`, `tests/unit/body-parts-registry.test.ts`, progress note |
| T5         | `docs/adr/0010-body-part-directory.md`, `docs/adr/README.md` (index line), `AGENTS.md` (one pointer paragraph only), progress note                                                                                                                                                                                                                                                                  |
| T3         | `scripts/studies/fetch.mjs`, `scripts/studies/preview.mjs`, `src/lib/studies/**`, `src/pages/body/[part].astro`, `src/styles/body-parts.css`, `package.json` (script lines), `src/data/studies/*.json` (regenerated), `tests/unit/studies.test.ts`, `tests/unit/study-relevance.test.ts`, `tests/e2e/body-parts.spec.ts`, progress note                                                             |
| T4         | `src/components/body-parts/BodyMap.astro`, `src/lib/body-parts/body-map.ts`, `src/styles/body-map.css`, `src/pages/index.astro` (the `#body-parts` section only), `tests/unit/body-map.test.ts`, `tests/e2e/body-map.spec.ts`, progress note                                                                                                                                                        |
| R-`<slug>` | `src/data/body-parts/regions/<slug>.ts`, `src/data/studies/<slug>.json` (generated), progress note. **Nothing else.**                                                                                                                                                                                                                                                                               |
| Q1         | `scripts/qa/screens.mjs`, `package.json` (one script line), `tests/e2e/body-parts-all.spec.ts`, progress note                                                                                                                                                                                                                                                                                       |

Allowed cross-phase edits (the phases never overlap, so these cannot conflict):

- **T1** changes the import and the JSDoc `import(...)` type in `scripts/studies/fetch.mjs` from `../../src/data/body-parts.ts` to `../../src/data/body-parts/index.ts`. That is its only edit to that file; T3 rewrites the file later. Without it, `pnpm typecheck` fails with TS2307.
- **T1** and **T3** both touch `tests/unit/studies.test.ts` in different phases.
- **T3** may edit **only the `mustMatch` lines** of the 8 existing region files if the new relevance test fails for them. It must record every change in its progress note.
- **T4** may edit **only the `hotspots` coordinates** of region files if the hotspot-spacing test fails. It must record every change in its progress note.
- After Phase 2, R tasks own their region files completely again.

---

## 5. Task specs

### T0 — Baseline commit (owner-approved)

1. In the `mackerel` worktree on `FrankieBiz/body-parts-atlas`, confirm `git status` shows only body-part work (listed in §0) and `ls -a` shows no `.pnpm-store`.
2. `pnpm format && pnpm verify` → must exit 0.
3. Commit: `feat(body-parts): body-part pages with newest-first PubMed studies`.
4. Write `progress/T0.md` with the commit hash. **That hash is the Phase 1 base.**

### T2 — Back-view anatomy poster (needs a working browser)

**Why:** upper back, lower back, glutes, hamstrings, and calves are on the back of the body; the only poster is front view.

**Output:** `assets/derived/bodyparts3d/anatomy-explorer-poster-back.png`, 862 × 672, transparent background, same framing as the front poster, rendered from the same BodyParts3D model (CC BY 4.0, already approved — no new asset source).

Steps:

1. Write `scripts/assets/capture-posters.mjs` (Playwright, JSDoc-typed). It expects a server at `http://127.0.0.1:4321` (`pnpm build && pnpm preview --host 127.0.0.1 --port 4321`), then:
   1. `chromium.launch()`, context with `viewport: { width: 1440, height: 1000 }`, `deviceScaleFactor: 1`.
   2. `goto('/')`, click the button `Load interactive anatomy` (`[data-load]`), wait until `[data-explorer-status]` has text `Ready to explore` (timeout 60 s).
   3. Force the canvas size: `page.evaluate` sets the `[data-stage]` element's `style.width = '862px'` and `style.height = '672px'`, then wait two animation frames. Assert `canvas.width === 862 && canvas.height === 672`; if not, print the actual values and exit 1.
   4. Click `[data-view="back"]`, wait two animation frames.
   5. `const dataUrl = await page.evaluate(() => document.querySelector('[data-anatomy-canvas]').toDataURL('image/png'))` (the renderer uses `preserveDrawingBuffer: true` and `alpha: true`, so the background is transparent).
   6. Decode base64 and write the PNG to the output path. Also write a front capture to `$TMPDIR/front-check.png` using the same steps with `data-view="front"`.
2. Add `"assets:capture-posters": "node scripts/assets/capture-posters.mjs"` to `package.json`.
3. Run it. Then verify alignment with Python/PIL:
   ```bash
   python3 -c "from PIL import Image; [print(p, Image.open(p).size, Image.open(p).split()[3].getbbox()) for p in ['assets/derived/bodyparts3d/anatomy-explorer-poster.png','assets/derived/bodyparts3d/anatomy-explorer-poster-back.png']]"
   ```
   The back bounding box must be within ±12 px of `(315, 43, 547, 639)` on every edge. If not, report the numbers and stop (do not hand-crop).
4. Look at the image. It must show the body from behind, with no UI overlays.
5. Write `docs/licenses/anatomy-explorer-back-poster.md`: source (same GLB `assets/derived/bodyparts3d/anatomy-explorer.glb`), method (canvas capture, back camera `(0, 0.88, -3.45)`), license CC BY 4.0 © DBCLS, attribution line used on the site. **Do not edit** `docs/licenses/anatomy-explorer-manifest.json`.
6. `pnpm verify`, commit, progress note.

If no browser is available anywhere: write the script, commit it, and in the progress note ask the owner to run `pnpm build && (pnpm preview --host 127.0.0.1 --port 4321 &) && pnpm assets:capture-posters`.

### T1 — Split the registry, add validation, add the back view (Phase 1)

**Why:** 13 parallel region tasks cannot all edit one file. After T1, each region is its own file and a validator enforces the writing rules automatically.

#### T1.1 New structure

```
src/data/body-parts/
  types.ts          # interfaces only
  shared.ts         # category helper, query templates, labels, groups, order
  muscle-map.ts     # explorer muscle id -> preferred region slugs
  index.ts          # registry: ALL_BODY_PARTS, BODY_PARTS, GROUPS, lookups
  regions/
    neck.ts shoulder.ts chest.ts upper-back.ts elbow.ts wrist-and-hand.ts
    abdomen-and-core.ts lower-back.ts hip-and-groin.ts thigh.ts knee.ts
    lower-leg.ts ankle-and-foot.ts
src/lib/body-parts/
  plate.ts          # pure plate crop math (moved out of RegionPlate.astro)
  validate.ts       # pure validator for a published region
scripts/body-parts/mark-points.py
```

#### T1.2 `types.ts` (exact shape)

```ts
export type RegionGroup = 'upper-body' | 'trunk' | 'lower-body';
export type PosterView = 'front' | 'back';
export type CategoryId = 'injuries' | 'rehab' | 'training' | 'mechanics';

/** A point on a poster, in percent of the poster's width (x) and height (y). */
export interface PosterPoint {
  view: PosterView;
  x: number;
  y: number;
}

export interface StudyCategory {
  id: CategoryId;
  label: string;
  blurb: string;
  /** Full PubMed term, already including the human/English/abstract filters. */
  query: string;
  /** Titles of fetched studies should match this; used by the relevance test. */
  mustMatch: RegExp;
}

export interface Injury {
  name: string;
  summary: string;
}

export interface BodyPart {
  slug: string;
  name: string;
  group: RegionGroup;
  /** 'planned' regions are skipped everywhere: no page, no card, no hotspot. */
  status: 'published' | 'planned';
  tagline: string;
  whatItDoes: string;
  keyParts: string[];
  commonInjuries: Injury[];
  /** Red-flag guidance shown under the injury cards. Required for some regions. */
  safetyNote?: string;
  /** Hero/card plate: which poster, where to center, how far to zoom. */
  plate: PosterPoint & { zoom: number };
  /** Clickable points on the homepage body map. At least one. */
  hotspots: PosterPoint[];
  /** Exactly four, in order: injuries, rehab, training, mechanics. */
  categories: StudyCategory[];
}
```

The old `focus` field becomes `plate` (add `view: 'front'`). The old `muscles` field is removed (replaced by `muscle-map.ts`).

#### T1.3 `shared.ts`

Export:

```ts
import type { CategoryId, RegionGroup, StudyCategory } from './types.ts';

export const HUMAN_ENGLISH = 'AND humans[mh] AND english[la] AND hasabstract';
export const REHAB =
  '(exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])';
export const TRAIN =
  '("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])';
export const MECH =
  '(biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])';
export const CATEGORY_LABELS: Record<CategoryId, string> = {
  injuries: 'Injuries',
  rehab: 'Rehab and treatment',
  training: 'Training and strength',
  mechanics: 'Anatomy and biomechanics',
};
export const GROUPS: { id: RegionGroup; label: string }[] = [
  { id: 'upper-body', label: 'Upper body' },
  { id: 'trunk', label: 'Trunk' },
  { id: 'lower-body', label: 'Lower body' },
];
export const REGION_ORDER = [
  'neck',
  'shoulder',
  'chest',
  'upper-back',
  'elbow',
  'wrist-and-hand',
  'abdomen-and-core',
  'lower-back',
  'hip-and-groin',
  'thigh',
  'knee',
  'lower-leg',
  'ankle-and-foot',
] as const;
/** Regions whose page must show a safetyNote. */
export const SAFETY_NOTE_REQUIRED = [
  'neck',
  'chest',
  'abdomen-and-core',
  'lower-back',
];

export function category(
  id: CategoryId,
  blurb: string,
  topic: string,
  mustMatch: RegExp,
): StudyCategory {
  return {
    id,
    label: CATEGORY_LABELS[id],
    blurb,
    query: `(${topic}) ${HUMAN_ENGLISH}`,
    mustMatch,
  };
}
```

Move the current inline REHAB/TRAIN/MECH strings out of the region queries: each region's query becomes `category('rehab', '…', `(${topic}) AND ${REHAB}`, /…/i)`. The **resulting query strings must be identical** to today's for the 8 existing regions (so their study files stay valid). Add a unit test that snapshots the 32 existing query strings before the refactor and compares after (write the snapshot test first, run it green on the old file, then refactor).

#### T1.4 Region files

- Each file: `import type { BodyPart } from '../types.ts'; import { category, REHAB, TRAIN, MECH } from '../shared.ts'; const region: BodyPart = { … }; export default region;`
- Move the 8 existing regions over verbatim (content unchanged except: `hip` → slug `hip-and-groin`, name `Hip and groin`; `focus` → `plate` with `view: 'front'`; add `group`; add `hotspots` exactly as listed for that region in §6 (usually the plate point; **wrist-and-hand differs**: `60.7, 49.6`; hip-and-groin's back hotspot waits for its R task); add `status: 'published'`; add the `mustMatch` pattern from §6 to every category — the R tasks may refine them). If, after T1, an existing region fails the relevance test from T3, that is the R task's job to fix, not T1's.
- `git mv src/data/studies/hip.json src/data/studies/hip-and-groin.json` and change `"slug": "hip"` to `"slug": "hip-and-groin"` inside it (the only allowed hand edit to a study file).
- Create the 5 new regions as **planned stubs** so the registry is complete and R tasks only fill them in:

```ts
const region: BodyPart = {
  slug: 'chest',
  name: 'Chest',
  group: 'upper-body',
  status: 'planned',
  tagline: '',
  whatItDoes: '',
  keyParts: [],
  commonInjuries: [],
  plate: { view: 'front', x: 50, y: 26, zoom: 2.1 },
  hotspots: [{ view: 'front', x: 50, y: 26 }],
  categories: [],
};
```

Use the plate/hotspot estimates from §6 for each new region.

#### T1.5 `index.ts`

```ts
import type { BodyPart, RegionGroup } from './types.ts';
import { MUSCLE_REGIONS } from './muscle-map.ts';
import neck from './regions/neck.ts';
// … one import per REGION_ORDER entry, in that order
export const ALL_BODY_PARTS: BodyPart[] = [neck, shoulder /* … */];
export const BODY_PARTS = ALL_BODY_PARTS.filter(
  (p) => p.status === 'published',
);
export { GROUPS, REGION_ORDER } from './shared.ts';
export type * from './types.ts';
export function findBodyPart(slug: string) {
  return BODY_PARTS.find((p) => p.slug === slug);
}
export function bodyPartsInGroup(group: RegionGroup) {
  return BODY_PARTS.filter((p) => p.group === group);
}
export function bodyPartForMuscle(muscleId: string): BodyPart | undefined {
  /* first published slug in MUSCLE_REGIONS[muscleId] */
}
```

#### T1.6 `muscle-map.ts` (final mapping, written once, never edited by R tasks)

The first slug that is **published** wins, so links work before and after new regions ship.

```ts
export const MUSCLE_REGIONS: Record<string, readonly string[]> = {
  'pectoralis-major': ['chest', 'shoulder'],
  'deltoid-regions': ['shoulder'],
  'rotator-cuff': ['shoulder'],
  'teres-major': ['shoulder'],
  rhomboids: ['upper-back', 'shoulder'],
  'trapezius-regions': ['upper-back', 'neck'],
  'biceps-brachii': ['elbow'],
  brachialis: ['elbow'],
  brachioradialis: ['elbow'],
  'triceps-brachii': ['elbow'],
  'forearm-flexors-extensors': ['wrist-and-hand'],
  'external-oblique': ['abdomen-and-core', 'lower-back'],
  'spinal-erectors': ['lower-back'],
  'gluteus-maximus': ['hip-and-groin'],
  'gluteus-medius': ['hip-and-groin'],
  'gluteus-minimus': ['hip-and-groin'],
  'major-hip-flexors': ['hip-and-groin'],
  'hip-adductors': ['hip-and-groin'],
  quadriceps: ['thigh', 'knee'],
  hamstrings: ['thigh', 'knee'],
  'gastrocnemius-heads': ['lower-leg', 'ankle-and-foot'],
  soleus: ['lower-leg', 'ankle-and-foot'],
  'tibialis-anterior': ['lower-leg', 'ankle-and-foot'],
};
```

Update `AnatomyExplorer.astro` only if its import path changes (`../../data/body-parts` → `../../data/body-parts/index.ts`); no other explorer edits.

#### T1.7 Plate math and back poster

- Move the math in `RegionPlate.astro` into `src/lib/body-parts/plate.ts`:
  ```ts
  export const POSTERS = {
    front: { width: 862, height: 672 },
    back: { width: 862, height: 672 },
  } as const;
  /** Position the poster so (x, y) sits at the plate centre. plateRatio = plate height / plate width. */
  export function plateImageStyle(
    point: { x: number; y: number },
    zoom: number,
    plateRatio: number,
    poster = POSTERS.front,
  ) {
    const ratio = poster.height / poster.width;
    const width = zoom * 100;
    return {
      width,
      left: 50 - (point.x / 100) * width,
      top: 50 - ((point.y / 100) * zoom * ratio * 100) / plateRatio,
    };
  }
  ```
  Unit-test it with the elbow numbers from the current build (hero: zoom 2.6, plateRatio 1.25 → width 260, left −56.08, top −10.32).
- `RegionPlate.astro` imports both posters (`anatomy-explorer-poster.png?url` and `anatomy-explorer-poster-back.png?url`), picks by `part.plate.view`, and captions "`<Name>` · front view" / "· back view".
- If T2 has not landed yet, T1 stops at this step and waits (do not create a placeholder image).

#### T1.8 Validator `src/lib/body-parts/validate.ts`

`validateBodyPart(part: BodyPart): string[]` returns human-readable errors (empty = valid). It runs only on `status: 'published'` regions. Rules:

| Field                                                       | Rule                                                                                                           |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `slug`                                                      | in `REGION_ORDER`; kebab-case                                                                                  |
| `tagline`                                                   | 10–70 characters, ends with `.`                                                                                |
| `whatItDoes`                                                | 50–110 words                                                                                                   |
| `keyParts`                                                  | 4–7 items, each 3–80 characters                                                                                |
| `commonInjuries`                                            | 4–6 items; `name` 3–60 chars; `summary` 8–40 words, ends with `.`                                              |
| `safetyNote`                                                | required if slug in `SAFETY_NOTE_REQUIRED`; 15–60 words when present                                           |
| `categories`                                                | exactly 4, ids in order `injuries, rehab, training, mechanics`; `blurb` 3–90 chars; `mustMatch.source !== '.'` |
| `plate`                                                     | `0 < x < 100`, `0 < y < 100`, `1.5 ≤ zoom ≤ 3.2`                                                               |
| `hotspots`                                                  | 1–2 items, coordinates in range                                                                                |
| prose (tagline, whatItDoes, keyParts, injuries, safetyNote) | must **not** match `BANNED` below                                                                              |

```ts
export const BANNED =
  /\b(proven|prove[sn]?|best|guarantee[sd]?|cure[sd]?|studies (show|prove)|research (shows|proves)|you should|you must|always|never|miracle|optimal)\b|\d+\s?%|\bper ?cent\b/i;
```

Add `tests/unit/body-parts-registry.test.ts`:

1. `ALL_BODY_PARTS.map(p => p.slug)` equals `REGION_ORDER`, and each file name equals its slug.
2. Every published region passes `validateBodyPart` (print all errors in the failure message).
3. Every explorer muscle (`docs/licenses/anatomy-explorer-manifest.json` → `entities[].id`) has a `MUSCLE_REGIONS` entry; every slug in the map exists in `REGION_ORDER`; `bodyPartForMuscle(id)` returns a published region.
4. Every published region has `src/data/studies/<slug>.json`.
5. The query-snapshot test from T1.3.

Placeholder patterns are never allowed: T1 writes the real §6 `mustMatch` for the 8 existing regions. Do not add environment switches or skip flags to the validator.

#### T1.9 `scripts/body-parts/mark-points.py`

A helper for R tasks to check coordinates visually. Usage: `python3 scripts/body-parts/mark-points.py [slug]`. Reads plate/hotspot coordinates by running `node --input-type=module -e "import('./src/data/body-parts/index.ts').then(m => console.log(JSON.stringify(m.ALL_BODY_PARTS.map(({slug, plate, hotspots}) => ({slug, plate, hotspots})))))"`, composites each poster onto `#28282e`, draws a red ring + slug label at every point (plate = solid ring, hotspot = dashed/thinner), crops to the body, upscales 2×, and writes `$TMPDIR/marked-front.png` and `$TMPDIR/marked-back.png`, printing both paths. Agents then open the PNGs (image-reading tool) and check the rings sit on the right anatomy.

#### T1 done when

`pnpm verify` green; the site builds the same 8 pages at the same URLs **except** `/body/hip/` is now `/body/hip-and-groin/`; the explorer links still work; progress note written.

### T5 — ADR 0010 (Phase 1, docs only)

Create `docs/adr/0010-body-part-directory.md` (0007–0009 are taken across branches):

- **Status:** Accepted by owner, 2026-09-30.
- **Context:** owner wants a simple, browsable directory: click a body part → plain overview + common injuries + categorized studies, newest first, linked to PubMed. The claim pipeline is too slow for this and the owner does not want AI review of everything.
- **Decision:**
  1. Body-part pages (`/body/<slug>/`) are general education and an automated literature listing, not scientific claims.
  2. They do not use `content/` collections, claim components, approval manifests, or evidence tiers, and are not subject to Claude Review.
  3. Boundaries that keep them out of claim territory: no recommendations, dosages, statistics, rankings of evidence, or "studies show" language (enforced by `validateBodyPart`); studies are listed, never summarized or endorsed; every page says lists are automatic and not individually vetted.
  4. Quality control = automated checks (`pnpm verify`, relevance test, validator) + owner read-through before publishing a region.
  5. Tasks run under `docs/superpowers/plans/2026-09-30-body-part-directory.md`, hand off through per-task progress notes, and do not use the `current-work.md` ledger.
- **Consequences:** faster delivery; risk of occasional off-topic or low-quality studies in lists (mitigated by title filters and the relevance test); overview text errors possible (mitigated by owner review and conservative wording rules).

Add one line to `docs/adr/README.md`'s index (match the existing format). Add one short paragraph to `AGENTS.md` under "Repository stage": "Body-part directory pages follow ADR 0010 and its plan; they are outside the claim pipeline." Then run `pnpm verify` — the repository-contract tests check `AGENTS.md`; if they fail because of your paragraph, remove the `AGENTS.md` edit, keep the ADR, and note it in the progress note. **Do not edit `docs/runbooks/operating-policy.json` or the master plan.**

### T3 — Study-list upgrades (Phase 2, after T1)

#### T3.1 Fetch script (`scripts/studies/fetch.mjs`)

1. Import from `../../src/data/body-parts/index.ts`; fetch only `BODY_PARTS` (published).
2. `PER_CATEGORY = 50`; over-fetch `100` ids per search for cross-category de-duplication (order: injuries → rehab → training → mechanics; a study keeps the first category it appears in).
3. Capture esearch's `count` per category.
4. Always send `tool=science-lifting-atlas`. If `process.env.NCBI_API_KEY` is set, append `api_key` and use a 120 ms request gap; otherwise 400 ms. Do not send an email address.
5. `esummary` accepts many ids; send the 50 in one request per category.
6. Write the new file shape (update `StudyFile` in `src/lib/studies/studies.ts`):
   ```ts
   export interface StudyFile {
     slug: string;
     fetchedAt: string; // YYYY-MM-DD
     categories: Record<CategoryId, Study[]>;
     totals: Record<CategoryId, number>; // PubMed match count
     queries: Record<CategoryId, string>; // exact term used
   }
   ```
7. Safety: if any category returns fewer than **10** studies, print an error for that region/category, **do not overwrite** that region's file, continue with others, and exit 1 at the end.
8. After writing, print a summary per region: `elbow: injuries 50 (+7 new), rehab 50 (+3 new) …` comparing PMIDs with the previous file.
9. CLI: `pnpm studies:fetch` (all) or `pnpm studies:fetch elbow knee`.

#### T3.2 Preview tool (`scripts/studies/preview.mjs`, `pnpm studies:preview`)

For R tasks to tune queries without writing files:

```bash
pnpm studies:preview chest injuries          # uses the query in the region file
pnpm studies:preview --query '<raw topic>'   # ad hoc; wraps with HUMAN_ENGLISH
```

Prints: total count, then the 20 newest as `YYYY-MM-DD | type | ✓/✗ | title` where ✓/✗ is the category's `mustMatch` result, and finally `mustMatch hit rate: 19/20`.

#### T3.3 Pure helpers (`src/lib/studies/studies.ts`), each with unit tests

- `studyKind(type: string | null): 'review' | 'trial' | 'other'` — review: Meta-analysis, Systematic review, Review, Guideline; trial: Randomized trial, Clinical trial; everything else (including Trial protocol, Case report, null) → other.
- `pubmedSearchUrl(query: string): string` → `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}&sort=date`.
- `relevanceMisses(studies: Study[], mustMatch: RegExp): Study[]`.

#### T3.4 Relevance test (`tests/unit/study-relevance.test.ts`)

For every published region and category: at least **90 %** of stored titles match `mustMatch`. This test must fail the build (no report-only mode). If it fails for one of the 8 existing regions after you regenerate the studies, fix it by editing that category's `mustMatch` (allowed, see §4). Only if widening `mustMatch` would stop it meaning anything should you tighten the query instead, and in that case record it for the R task. On failure print the region, category, hit rate, and up to 10 missing titles, plus the hint "tighten the query or widen mustMatch; run pnpm studies:preview".

#### T3.5 Region page (`src/pages/body/[part].astro`, `src/styles/body-parts.css`)

Keep everything that exists. Add:

1. Under each panel header: "`50` newest of `3,404` on PubMed · **See all ↗**" (`pubmedSearchUrl(queries[id])`, `target="_blank" rel="noopener"`, visually hidden "(opens in a new tab)"). Format totals with `toLocaleString('en-US')`.
2. Each `<li>` gets `data-kind="review|trial|other"`.
3. **Type filter** above the panels: a `role="group" aria-label="Study type"` with three buttons `All`, `Reviews`, `Trials` (`aria-pressed`). Rendered with the `hidden` attribute; the script un-hides it. Filtering applies to all panels. When a filter leaves a panel empty, show "No `reviews` among the newest 50. **See all on PubMed ↗**".
4. **Show more:** the script shows the first 10 rows of the (filtered) list per panel and adds a button "Show more" under the list, revealing 20 more per click; label includes what is left, e.g. "Show more · 30 left"; hidden when nothing is left. Changing filter or tab resets to 10. Keyboard focus moves to the first newly revealed row link.
5. **Without JavaScript**, every row in every panel is visible and the filter/show-more controls stay hidden (this is what the no-JS e2e test checks).
6. Hero plate uses `part.plate.view`; "Explore another body part" is grouped by `GROUPS` (three small labeled rows of pills).
7. If `part.safetyNote` exists, render it instead of the default note under injuries, with the same `.region-note` style plus a left rose border.
8. Keep the tabs script small (< 3 KB); `pnpm test:performance` must still pass.

#### T3.6 Regenerate and test

`pnpm studies:fetch` for the published regions, then extend `tests/e2e/body-parts.spec.ts`: filter to Reviews shows only `data-kind="review"` rows; "Show more" increases visible rows from 10 to 30; "See all" link starts with `https://pubmed.ncbi.nlm.nih.gov/?term=`.

**Done when** `pnpm verify` green, e2e green (or recorded as sandbox-blocked), progress note written.

### T4 — Homepage body map (Phase 2, needs T1 + T2)

#### T4.1 Layout

Inside the existing `#body-parts` section on the homepage (keep its header text):

```
[ header: "Browse by body part" / "Start where it matters to you." ]
[ FRONT figure  |  BACK figure  |  grouped list: Upper body / Trunk / Lower body ]
[ card grid, grouped under the three group labels ]
```

- Desktop (> 62rem): two figures side by side, grouped list on the right.
- Tablet: figures side by side, list below.
- Phone (≤ 44rem): **one figure at a time** with a segmented Front/Back toggle (buttons, `aria-pressed`). Without JavaScript both figures stack vertically.

#### T4.2 `src/lib/body-parts/body-map.ts` (pure, unit-tested)

```ts
/** Body crop on each poster, in poster percent. Tune once from the alpha bbox. */
export const BODY_CROP = {
  front: { x0: 34, x1: 66, y0: 4, y1: 97 },
  back: { x0: 34, x1: 66, y0: 4, y1: 97 }, // re-measure from the back poster's alpha bbox (T2)
} as const;
export function mapImageStyle(view): {
  width: number;
  left: number;
  top: number;
}; // % of figure
export function mapPoint(point: PosterPoint): { left: number; top: number }; // % of figure
export function figureAspect(view): number; // width / height
export function closestPairPx(
  points: PosterPoint[],
  figureWidthPx: number,
): number;
```

Formulas: crop width `cw = x1 − x0`, height `ch = y1 − y0`. Image `width = 100 / (cw / 100)`, `left = −x0 / cw × 100`, `top = −y0 / ch × 100`. Point `left = (x − x0) / cw × 100`, `top = (y − y0) / ch × 100`. Figure aspect `= (cw × 862) / (ch × 672)`.

Unit tests: formulas on known values; **every pair of hotspots in the same view is ≥ 44 px apart at a 320 px figure width** (prints the offending pair). If a pair is too close, T4 moves one of the two hotspots, for example mirroring it to the other limb (x → 100 − x). This is allowed, see §4. Record the change in the progress note. In Phase 3, R tasks must keep this test passing when they move their own hotspots.

#### T4.3 `BodyMap.astro`

- Each figure: dark rounded panel (same gradient as `.region-plate`), the poster image with the plate's grayscale treatment, and one `<a class="body-map__spot">` per hotspot of each published region in that view, positioned with `mapPoint`.
- Spot markup: `<a href="./body/<slug>/" class="body-map__spot" style="left:…%;top:…%"><span class="body-map__dot" aria-hidden="true"></span><span class="body-map__label">Elbow</span></a>`. The label is the accessible name. Hit area 44 × 44 px (`translate: -50% -50%`), visible dot 12 px, rose, soft pulse (disabled under `prefers-reduced-motion`). Label pill appears on hover and focus-visible, positioned above the dot; on touch devices, show labels always on the active figure (`@media (hover: none)`).
- Caption under each figure: "Front" / "Back".
- Attribution line under the map: "BodyParts3D © DBCLS · CC BY 4.0" linking to the license URL used in the explorer.
- Styles in `src/styles/body-map.css` (import it from the component). Reuse tokens; no new colors except those already in `tokens.css`.

#### T4.4 Card grid

Group the existing cards under `<h3>` group labels using `bodyPartsInGroup`. Keep `RegionPlate` card variant.

#### T4.5 Tests

- `tests/unit/body-map.test.ts` (above).
- `tests/e2e/body-map.spec.ts`: on desktop, clicking the Elbow spot lands on `/body/elbow/`; every spot link has an accessible name and resolves (HTTP 200); at 390 px width the toggle switches figures; with JavaScript disabled both figures are visible.

### R-`<slug>` — One region (Phase 3, after T3). Template for all 13.

Work in `bp/R-<slug>`. Edit only `src/data/body-parts/regions/<slug>.ts` and the generated `src/data/studies/<slug>.json`.

1. **Read** §6 for your region and §7 (writing rules).
2. **Write the overview** (`tagline`, `whatItDoes`, `keyParts`, `commonInjuries`, `safetyNote` if required). Before finalizing, check each injury description against a reputable general-public reference (e.g., MedlinePlus, NHS, AAOS OrthoInfo). If references disagree or you are unsure, use the more conservative, general wording. Do not add citations to the page.
3. **Build the four queries** with `category(...)`, starting from §6's seeds.
4. **Tune each query** with `pnpm studies:preview <slug> <category>` until:
   - PubMed total ≥ 150 (≥ 60 allowed for `mechanics` and for narrow regions; note it in the progress note),
   - at least 18 of the 20 newest are clearly about this region and this category (read the titles; judge, don't just trust ✓),
   - `mustMatch` hit rate ≥ 19/20.
     Fix drift with `NOT term[ti]` or by tightening `[ti]` terms (see §8 recipes). Never use `[tiab]` for the region term itself — it pulls in off-topic papers.
5. **Place the plate and hotspots:** set coordinates, run `python3 scripts/body-parts/mark-points.py <slug>`, open the PNG, adjust until the ring is centered on the region. Front view: viewer-left = the body's right side. Existing regions use the viewer-left limb; keep that unless T4 reported a hotspot conflict for your region.
6. Set `status: 'published'` (new regions).
7. `pnpm studies:fetch <slug>` → must print 4 categories with ≥ 30 studies each (≥ 15 allowed only where step 4 allowed a lower total).
8. `pnpm format && pnpm verify`. The validator and relevance test will tell you exactly what is wrong; fix the region file, not the tests.
9. Commit `feat(body-parts): add <name> region` or `feat(body-parts): revise <name> region`.
10. Progress note: include the four final PubMed totals, the preview hit rates, and a 20-title spot check verdict per category ("19/20 on topic; 1 about X").

**Revision tasks (existing regions)** also: re-read the existing text against §7 and fix violations; tighten `mustMatch` from the T1 version if needed; remove any overlap §6 calls out.

---

## 6. Region briefs

Coordinates are starting estimates in poster percent — always confirm with `mark-points.py`. "Back" coordinates must be measured on the T2 back poster. Suggested content is a starting point, not text to paste; rewrite to the rules in §7. `topic` strings below are the part inside `category(id, blurb, <topic>, mustMatch)` (the helper adds the human/English filters). Where a seed shows `AND REHAB`, write it as `` `(${topic}) AND ${REHAB}` ``.

### Upper body

**neck** — revise. Plate front `x 50, y 17.5, zoom 2.4`; hotspot front `50, 17.5`.

- Keep content; add `safetyNote` (required): seek urgent care for neck pain after a fall or impact, or with numbness, weakness, loss of coordination, or severe headache.
- `mustMatch`: `/neck|cervical|whiplash|trapezius|radiculopathy/i`.
- Training query currently includes "upper trapezius"; keep it, but upper-back owns general trapezius training (below). Accept cross-page duplicates.

**shoulder** — revise. Plate front `42, 23.5, 2.3`; hotspot front `42, 23.5`.

- Fix spelling to US English ("centred" → "centered").
- Remove `scapula*[ti]` from the mechanics query (upper-back owns scapular mechanics) — keep `shoulder[ti] OR glenohumeral[ti]`.
- `mustMatch`: `/shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press/i`.

**chest** — new. Plate front `50, 26, 2.1`; hotspot front `50, 26`.

- Tagline idea: the pressing engine.
- Function: pectoralis major brings the arm across and in front of the body and helps push; the rib cage protects heart and lungs and moves with breathing.
- Key parts: pectoralis major (clavicular and sternocostal heads), pectoralis minor, sternum and ribs, serratus anterior, sternoclavicular joint.
- Injuries: pectoralis major tendon rupture (classically during heavy bench pressing; bruising and weakness; needs prompt surgical assessment), pec muscle strain, costochondritis (chest-wall pain where ribs meet the breastbone), sternoclavicular joint sprain, rib stress fracture (e.g., in rowers).
- `safetyNote` (required): chest pain can come from the heart or lungs; get emergency care for chest pain with breathlessness, sweating, nausea, or pain spreading to the arm, jaw, or back.
- Queries:
  - injuries: `("pectoralis major"[ti] AND (rupture*[ti] OR tear*[ti] OR injur*[ti] OR repair*[ti])) OR costochondritis[ti] OR "chest wall pain"[ti] OR sternoclavicular[ti]`
  - rehab: `("pectoralis major"[ti] OR "chest wall pain"[ti] OR costochondritis[ti] OR sternoclavicular[ti]) AND REHAB`
  - training: `(pectoral*[ti] OR "bench press"[ti] OR "chest press"[ti] OR "push-up"[ti] OR "push up"[ti] OR "chest fly"[ti]) AND TRAIN`
  - mechanics: `(pectoral*[ti] OR "bench press"[ti] OR "chest wall"[ti] OR sternoclavicular[ti]) AND MECH`
- `mustMatch`: `/pectoral|bench|chest|push-?up|sternoclav|costochond|rib/i`.

**upper-back** — new. Plate **back** `x 50, y 30, zoom 2.1` (measure); hotspot back same.

- Function: the thoracic spine supports the rib cage and allows rotation; muscles here move and steady the shoulder blades for rows, pull-ups, and overhead work.
- Key parts: thoracic spine (T1–T12) and ribs, scapula (shoulder blade), trapezius (upper, middle, lower), rhomboids, latissimus dorsi, thoracic erector spinae.
- Injuries: thoracic (mid-back) pain, muscle strain (rhomboid or trapezius), scapular dyskinesis (altered shoulder-blade movement; describe it as a movement pattern often linked with shoulder symptoms, not an injury in itself), latissimus dorsi strain or tear (rare; throwing and pulling), thoracic disc herniation (uncommon).
- Queries:
  - injuries: `"thoracic pain"[ti] OR "thoracic spine pain"[ti] OR "mid-back pain"[ti] OR "upper back pain"[ti] OR "scapular dyskinesis"[ti] OR ("latissimus dorsi"[ti] AND (injur*[ti] OR tear*[ti] OR strain*[ti])) OR "thoracic disc herniation"[ti]`
  - rehab: `("thoracic pain"[ti] OR "thoracic spine"[ti] OR "scapular dyskinesis"[ti] OR "upper back pain"[ti]) AND REHAB`
  - training: `("lat pulldown"[ti] OR "pull-up"[ti] OR "pull up"[ti] OR "chin-up"[ti] OR latissimus[ti] OR trapezius[ti] OR rhomboid*[ti] OR "bent-over row"[ti] OR "seated row"[ti] OR scapular[ti]) AND TRAIN`
  - mechanics: `("thoracic spine"[ti] OR thoracic[ti] OR scapul*[ti]) AND MECH NOT "thoracic surgery"[ti]`
- `mustMatch`: `/thoracic|scapul|trapezius|rhomboid|latissimus|pull-?up|chin-?up|pulldown|row|upper back|mid-back/i`.

**elbow** — revise. Plate front `40.8, 37.2, 2.6`; hotspot front `40.8, 37.2`.

- `mustMatch`: `/elbow|epicondyl|biceps|triceps|brachialis|ulnar collateral|cubital|arm curl|upper arm/i`.
- Keep the existing `NOT femoris[ti]` on distal biceps terms.

**wrist-and-hand** — revise. Plate front `39.3, 49.6, 2.6`; hotspot front: **mirror to the other hand** `60.7, 49.6` (keeps it apart from the hip hotspot).

- `mustMatch`: `/wrist|hand|carpal|finger|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i`.

### Trunk

**abdomen-and-core** — new. Plate front `50, 37, 2.1`; hotspot front `50, 37`.

- Tagline idea: the brace behind every big lift.
- Function: abdominal muscles bend and twist the trunk and, with the diaphragm, pelvic floor, and back muscles, stiffen it so force can pass between the legs and arms.
- Key parts: rectus abdominis, external and internal obliques, transversus abdominis, linea alba, diaphragm and pelvic floor, inguinal canal.
- Injuries: abdominal or oblique muscle strain ("side strain"), inguinal hernia (a bulge in the groin, often noticed when straining or lifting), umbilical hernia, diastasis recti (widening of the gap between the two sides of the rectus abdominis, common during and after pregnancy).
- `safetyNote` (required): get urgent care for sudden severe abdominal pain, a hernia bulge that becomes painful, firm, or cannot be pushed back, or abdominal pain with fever or vomiting.
- Queries:
  - injuries: `("abdominal muscle"[ti] AND (strain*[ti] OR injur*[ti])) OR "oblique strain"[ti] OR "side strain"[ti] OR "inguinal hernia"[ti] OR "umbilical hernia"[ti] OR "diastasis recti"[ti] OR "rectus diastasis"[ti] OR "abdominal wall injur*"[ti]`
  - rehab: `("diastasis recti"[ti] OR "rectus diastasis"[ti] OR "inguinal hernia"[ti] OR "abdominal muscle"[ti] OR "core stability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "return to"[tiab])`
  - training: `("core stability"[ti] OR "core strength"[ti] OR "core training"[ti] OR "core muscle*"[ti] OR abdominal*[ti] OR "trunk muscle*"[ti] OR plank*[ti] OR "rectus abdominis"[ti] OR oblique*[ti]) AND TRAIN`
  - mechanics: `("intra-abdominal pressure"[ti] OR "abdominal muscle*"[ti] OR "trunk muscle*"[ti] OR bracing[ti] OR valsalva[ti] OR "trunk stiffness"[ti]) AND (MECH OR electromyograph*[tiab])` — write MECH inline since this combines it.
- `mustMatch`: `/abdom|core|trunk|oblique|rectus|hernia|diastasis|plank|brac|intra-abdominal|valsalva/i`.

**lower-back** — revise; **moves to back view.** Plate back `50, 43, 2.0` (measure); hotspot back same.

- Add `safetyNote` (required): get urgent care for back pain with numbness around the groin or buttocks, new bladder or bowel problems, leg weakness that is getting worse, fever, or after a significant fall or impact.
- `mustMatch`: `/low back|lumbar|sciatica|spondyl|disc|deadlift|back extensor|trunk|spine|spinal|lifting|back pain/i`.

### Lower body

**hip-and-groin** — revise (renamed from hip). Plate front `45.5, 46.9, 2.1`; hotspots front `45.5, 46.9` and back glutes `~45, 47` (measure).

- Update name, tagline, and `whatItDoes` to include the groin.
- Key parts: add adductors and pubic symphysis (replace a less useful item to stay ≤ 7).
- Injuries: FAI, labral tear, gluteal tendinopathy, adductor-related groin pain, hip flexor strain, hip osteoarthritis (max 6 — pick the six most relevant to active adults).
- Injuries query: add `OR "athletic pubalgia"[ti] OR "adductor-related"[ti] OR "hip flexor strain"[ti]`.
- `mustMatch`: `/hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i`.

**thigh** — new. Plate front `46.4, 58.5, 2.0`; hotspots front `46.4, 58.5` and back hamstrings `~46, 60` (measure).

- Tagline idea: the biggest muscles you own.
- Function: the quadriceps straighten the knee and help lift the thigh; the hamstrings bend the knee and extend the hip; together they power running, jumping, squatting, and deadlifting.
- Key parts: femur, quadriceps (rectus femoris, vastus lateralis, medialis, intermedius), hamstrings (biceps femoris, semitendinosus, semimembranosus), adductors, iliotibial band.
- Injuries: hamstring strain (common in sprinting), quadriceps strain (often rectus femoris, kicking and sprinting), thigh contusion ("dead leg"), proximal hamstring tendon avulsion (tendon pulled off the sitting bone; needs prompt specialist assessment), femoral stress fracture (deep, persistent thigh or groin pain in runners).
- Queries:
  - injuries: `(hamstring*[ti] AND (strain*[ti] OR injur*[ti] OR tear*[ti] OR avulsion*[ti])) OR ("quadriceps"[ti] AND (strain*[ti] OR injur*[ti] OR contusion*[ti])) OR "rectus femoris injur*"[ti] OR "thigh contusion"[ti] OR "femoral stress fracture"[ti]`
  - rehab: `(hamstring*[ti] OR "quadriceps strain"[ti] OR "thigh muscle injur*"[ti]) AND (REHAB OR prevention[tiab] OR "return to sport"[tiab])` — write REHAB inline.
  - training: `(quadriceps[ti] OR hamstring*[ti] OR "leg extension"[ti] OR "leg curl"[ti] OR nordic[ti] OR vastus[ti] OR "rectus femoris"[ti] OR "biceps femoris"[ti] OR "thigh muscle*"[ti]) AND TRAIN`
  - mechanics: `(hamstring*[ti] OR quadriceps[ti] OR "biceps femoris"[ti] OR vastus[ti] OR femur[ti] OR thigh[ti]) AND (MECH OR architecture[ti] OR fascicle*[ti])` — inline.
- `mustMatch`: `/hamstring|quadricep|thigh|femor|vastus|rectus femoris|biceps femoris|nordic|leg (curl|extension)/i`.
- Overlap: knee's training query currently includes quadriceps/hamstrings; R-knee removes them (below).

**knee** — revise. Plate front `47.6, 69.9, 2.3`; hotspot front same.

- Training query becomes knee-specific: `(squat*[ti] OR "knee extens*"[ti] OR "leg press"[ti] OR "patellar tendon"[ti] OR knee[ti]) AND TRAIN`.
- Consider adding iliotibial band syndrome (outer-knee pain in runners) if it fits within 6 injuries.
- `mustMatch`: `/knee|ACL|cruciate|menisc|patell|squat|leg press|tibiofemoral|iliotibial/i`.

**lower-leg** — new. Plate front `47, 79.5, 2.3`; hotspots front `47, 79.5` (shin) and back calf `~47, 75` (measure).

- Tagline idea: calf and shin, the springs you run on.
- Function: the calf muscles point the foot and push you off the ground; the shin muscles lift the foot and control landing; the tibia carries body weight to the ankle.
- Key parts: tibia and fibula, gastrocnemius and soleus (calf), tibialis anterior, fibular (peroneal) muscles, interosseous membrane.
- Injuries: calf strain (often the inner gastrocnemius, "tennis leg"), medial tibial stress syndrome ("shin splints"), tibial stress fracture, chronic exertional compartment syndrome (tight, aching pain during exercise that eases with rest). Achilles problems stay on ankle-and-foot.
- Queries:
  - injuries: `"calf strain"[ti] OR "calf muscle injur*"[ti] OR (gastrocnemius[ti] AND (strain*[ti] OR tear*[ti] OR injur*[ti])) OR "medial tibial stress"[ti] OR "shin splints"[ti] OR "tibial stress fracture"[ti] OR ("compartment syndrome"[ti] AND exertional[ti])`
  - rehab: `("calf strain"[ti] OR "calf muscle"[ti] OR "medial tibial stress"[ti] OR "shin splints"[ti] OR "tibial stress fracture"[ti] OR "exertional compartment"[ti]) AND REHAB`
  - training: `(calf[ti] OR "triceps surae"[ti] OR "plantar flexor*"[ti] OR gastrocnemius[ti] OR soleus[ti] OR "tibialis anterior"[ti]) AND TRAIN` (this moves here from ankle-and-foot)
  - mechanics: `(tibia*[ti] OR "lower leg"[ti] OR calf[ti] OR "triceps surae"[ti] OR gastrocnemius[ti] OR soleus[ti]) AND (MECH OR stiffness[ti])` — inline.
- `mustMatch`: `/calf|tibia|shin|gastrocnem|soleus|triceps surae|plantar flex|compartment|lower leg|fibul/i`.

**ankle-and-foot** — revise. Plate front `46.6, 87.5, 2.4`; hotspot front same.

- Training query becomes ankle/foot-specific: `(ankle[ti] OR foot[ti] OR "intrinsic foot"[ti] OR toe[ti]) AND (TRAIN OR "balance training"[tiab] OR "proprioceptive training"[tiab])` — inline.
- `mustMatch`: `/ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i`.

---

## 7. Writing rules (the validator enforces the measurable ones)

1. **Audience:** a regular lifter, not a clinician. US English. Short sentences. Reading level around grade 8.
2. **Jargon:** plain name first, clinical name in parentheses the first time: "Tennis elbow (lateral epicondylopathy)". Use the same order for every injury on a page.
3. **Tagline:** one fragment or short sentence, ≤ 70 characters, ends with a period, a little voice ("The hinge between upper arm and forearm.").
4. **What it does:** 3–4 sentences, 50–110 words — movements, then structure, then why it matters in lifting. No advice.
5. **Main parts:** 4–7 noun phrases.
6. **Injuries:** 4–6, the ones active adults most commonly meet (do not claim a ranking). Summary = what it is + typical cause or main symptom, ≤ 40 words.
7. **Never:** treatment or exercise advice, recovery timelines, numbers or statistics (anatomy counts like "seven vertebrae" are fine), "proven", "best", "always/never", "studies show", drug or injection recommendations, fear language.
8. **Safety notes:** factual red flags, then "get urgent care" / "see a clinician". Required for neck, chest, abdomen-and-core, lower-back.
9. **Consistency:** match the tone of the existing elbow page — it is the reference.

---

## 8. PubMed query recipes

- **Field tags:** `[ti]` = title only (use for the region term), `[tiab]` = title/abstract (fine for method terms like "resistance training"), `[mh]` = MeSH heading. Truncate with `*` (`scapul*`). Quote phrases.
- **Precedence:** PubMed evaluates left to right. Always parenthesize mixed AND/OR: `A OR (B AND C) OR D`.
- **Kill drift:** add `NOT <term>[ti]`, e.g. `NOT femoris[ti]` (biceps femoris showing up under elbow), `NOT "thoracic surgery"[ti]`, `NOT rat[ti] NOT mice[ti]` if animal studies slip through.
- **Too few results:** widen synonyms in `[ti]` first; only then broaden to `[tiab]` for secondary terms.
- **Check the count quickly:**
  `curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=$(python3 -c 'import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))' '<full term>')"`
  but prefer `pnpm studies:preview`, which also shows titles.
- **Dates:** the list uses the earlier of the online and issue dates, so a paper printed in "2026 Dec" but online in August shows as August.

---

## 9. Q1 — Integration QA (Phase 4, needs a browser)

1. `scripts/qa/screens.mjs` + `"qa:screens"` script: builds are assumed served on 4321; captures full-page PNGs of `/` and every `/body/<slug>/` at 1440 × 1000 and 390 × 844 into `test-results/screens/` (git-ignored), plus the elbow page with the Rehab tab and Reviews filter active.
2. `tests/e2e/body-parts-all.spec.ts`: for every published region — page loads, `h1` = name, 4 tabs, dates newest-first in every panel, first study links to PubMed, "See all" link present, no horizontal scroll at 320 px (`document.documentElement.scrollWidth <= 320`), no console errors.
3. Run `pnpm verify`, `pnpm test:e2e`, `pnpm test:performance`, `pnpm qa:screens` on the integration branch after all merges.
4. Progress note with results and the screenshot folder path; then **stop** for the owner's visual review.

---

## 10. Definition of done (whole project)

- 13 regions published; each has 4 categories with ≥ 30 studies (≥ 15 where a narrow region was recorded), newest first, working PubMed links.
- Homepage body map with front and back hotspots for every region; grouped cards; explorer links resolve to the right regions.
- `pnpm verify`, `pnpm test:e2e`, `pnpm test:performance` green on `FrankieBiz/body-parts-atlas`.
- Every task has a progress note with real check output.
- Owner has read each region page and approved the look on desktop and phone.
- Owner merges and deploys. Agents never deploy.

## 11. When to stop and ask the owner

- A check fails for a reason outside your owned files.
- A query cannot reach the §5 R-task thresholds after five honest attempts.
- You are unsure whether an injury description is accurate.
- A task would need a file owned by another task.
- The browser-dependent step cannot run anywhere you have access to.

## 12. Refresh after launch

`pnpm studies:fetch` (optionally with `NCBI_API_KEY`) → review the printed summary → `pnpm verify` → commit `chore(studies): refresh <date>`. Cadence is the owner's choice (manual by default). If a refresh makes the relevance test fail, fix the region's query in a normal R-style change; never edit the JSON.
