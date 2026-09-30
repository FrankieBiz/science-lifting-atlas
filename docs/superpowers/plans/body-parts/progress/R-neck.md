# R-neck — Neck region (revision)

Branch: `bp/R-neck` · Base: `e26d026` · Head: `bd81aae` (plus this note) · Agent: GPT-6 Luna (Lane L)

## Done

- Re-read the overview against §7. Added the lifting connection, removed an unsupported frequency statement from the non-specific neck pain summary, and made the injury names plain-first with clinical terms in parentheses: "Pinched neck nerve (cervical radiculopathy)" and "Whiplash (whiplash-associated disorder)."
- Kept the required safety note for neck pain after impact and neurological warning signs.
- Kept the front plate and hotspot at `50, 17.5` (plate zoom `2.4`). `python3 scripts/body-parts/mark-points.py neck` confirms the ring is centered on the neck.
- Tuned all four PubMed categories and fetched `src/data/studies/neck.json`: 50 studies in each category.
- Removed neck's T1-era query snapshot from `tests/unit/body-parts-registry.test.ts`, following the prior owner-directed region revisions. The test still checks the unchanged original queries for regions not yet revised.

## Final PubMed totals and preview results

| Category  | PubMed total | `mustMatch` hit rate (20 newest) | Spot check of the 20 newest                                                                                |
| --------- | ------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| injuries  | 4,904        | 20/20                            | 20/20 on topic (neck pain, cervical radiculopathy, whiplash, or neck strain)                               |
| rehab     | 1,676        | 20/20                            | 19/20 on topic; 1 marginal cervical chiropractic case with a history of artery compromise                  |
| training  | 141          | 20/20                            | 20/20 on topic (neck strength, cervical muscle strength, neck-specific training, and upper-trapezius work) |
| mechanics | 541          | 20/20                            | 19/20 on topic; 1 marginal paper focused on a computational localization method for cervical anatomy       |

The training total is below 150 but above 60, using the plan's allowance for
narrow regions. Its title terms require neck or cervical muscle strength and
training rather than matching the ambiguous standalone word `cervical`.

## Query changes

- Injuries and rehab remained at their existing queries; both cleared the
  relevance checks.
- Training now requires a title match for neck muscle, cervical muscle, neck
  strength, neck strengthening, or upper trapezius, plus a title match for
  training/exercise/strength. Excludes `femor*`, radiotherapy, cancer, and
  oncology to remove femoral-neck and cancer-care drift.
- Mechanics now uses `"cervical spine"`, `"cervical vertebrae"`, or
  `"cervical kinematics"` with the shared `MECH` pattern. This removes the
  femoral, aortic, and other unrelated uses of "neck" from the newest-title
  sample.
- `mustMatch` stayed as specified in §6.

## Medical reference check

Injury summaries and the safety note were checked against [MedlinePlus neck
pain guidance](https://medlineplus.gov/ency/article/003025.htm), [MedlinePlus
emergency-room guidance](https://medlineplus.gov/ency/patientinstructions/000593.htm),
and [NHS whiplash guidance](https://www.nhs.uk/conditions/whiplash/). Wording
stays general and does not include treatment advice.

## Checks (real output)

- Node.js `v24.20.0`; pnpm `11.24.0`.
- `pnpm format && pnpm verify`: passed. Astro check reported 0 errors,
  warnings, or hints; 28 unit suites/418 tests passed; accessibility 2
  suites/5 tests passed; visual 2 suites/4 tests passed; portability 3
  suites/17 tests passed; content, graph, research, evidence, build,
  foundation, and asset-decision checks passed. Build emitted the existing
  large-chunk warning.
- `pnpm test:e2e`: 18 passed.
- `git diff --check`: passed.

## Deviations from the plan

- **Owner-directed continuation:** after the initial five previews failed the
  title relevance threshold, the owner directed Lane L to continue toward
  completion. Further previews found a focused query that meets the title
  relevance target and the narrow-region count allowance.
- **Test edit outside the R-task file list:** removed only the neck entry from
  `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts`, consistent with
  the already merged owner-directed R-knee, R-ankle-and-foot, and R-hip-and-
  groin revisions. No behavior assertions were changed.

## Needs from other tasks / owner

- Owner read-through of `/body/neck/`.
