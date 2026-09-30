# R-upper-back — Upper back region

Branch: bp/R-upper-back · Base: 954676c · Head: d4736d3 (plus this note) · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `src/data/body-parts/regions/upper-back.ts` published: overview, key parts, five injuries (text from the validated draft), **back-view** plate and hotspot `50, 30` (zoom 2.1). `mark-points.py` on the back poster shows the ring between the shoulder blades at rhomboid level.
- Four queries tuned from the §6 seeds; `src/data/studies/upper-back.json` fetched, 50 studies in each category.
- `muscle-map.ts` already lists `upper-back` first for rhomboids and trapezius, so those explorer links now go to Upper back.
- No safety note: not required for this region.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                            |
| --------- | ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 391          | 20/20                          | 18/20 on topic; 2 marginal (a shoulder-surgery technique paper on scapular dyskinesis; an infraspinatus exercise-reliability paper)    |
| rehab     | 123          | 20/20                          | 18/20 on topic; 2 marginal (scapular kinematics with supraspinatus architecture; a breast-reconstruction scapular dyskinesis analysis) |
| training  | 178          | 20/20                          | 19/20 on topic (rows, pulldowns, scapular and trapezius exercise EMG); 1 about validity of surface electrodes                          |
| mechanics | 396          | 20/20                          | 20/20 on topic (scapular kinematics, thoracic kyphosis and range of motion, scapular anatomy)                                          |

Rehab (123) is below 150 but above 60, which the plan allows for narrow regions.

## Query changes from the §6 seeds (all for drift)

The seeds drifted badly, so all four changed. Each change and the reason:

- injuries: `latissimus dorsi` limited to injury/strain/rupture/avulsion (seed's `tear*` returned tendon-transfer surgery for rotator-cuff tears); `NOT transfer* NOT tenotomy NOT plication NOT endoscop* NOT surgical NOT intraoperative` (shoulder and spine surgery technique papers).
- rehab: `thoracic spine` limited to mobilization/manipulation/exercise/manual therapy (seed returned spine tumors, fistulas, fusion); `NOT tumor* NOT neoplasm* NOT fistula* NOT fusion NOT endoscop* NOT resection NOT tenotomy NOT plication NOT transfer* NOT Latarjet NOT "rotator cuff" NOT instability NOT "machine learning"`.
- training: replaced bare `scapular`/`trapezius` with exercise-specific terms (pulldown, pull-up, chin-up, rows, scapular retraction/strengthening/stabilization, scapular or trapezius with exercise/strengthen/training/activ, middle/lower trapezius, rhomboid); `NOT botulinum* NOT "trigger point*" NOT transfer* NOT winging NOT arthroscop* NOT plication NOT tenotomy`. The seed returned trapezius botulinum, trigger-point and scapular-winging diagnostic papers.
- mechanics: dropped bare `thoracic[ti]` (it returned thoracic aortic aneurysm and aortic-repair papers); now `thoracic spine`, `thoracic kyphosis`, `thoracic vertebra*`, `scapul*`, `rib cage`; `NOT aort* NOT fractur* NOT arthroplasty NOT scoliosis NOT plate NOT screw* NOT pedicle NOT transfer* NOT nerve* NOT intercostal`.
- `mustMatch` tightened from the §6 pattern: bare `thoracic` became `thoracic (spine|spinal|pain|disc|kyphosis|vertebra)` and bare `row` became `\brow(s|ing)?\b`, so the pattern cannot be satisfied by aortic or "narrow"/"arrow" titles. Hit rates above use the tightened pattern.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed; last line: SBLA-006 asset decision passed). The relevance test passes with the tightened `mustMatch` on all 200 stored titles.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- Query and `mustMatch` changes listed above; rehab total under 150 (allowed).
- `progress/R-chest.md` table reformatted by `pnpm format` (separate commit; content unchanged).
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages to cross-check in this environment, so it stays conservative and general. The "scapular dyskinesis" card says it is a movement pattern, not an injury by itself, as the brief asks. Please read it on the page.

## Needs from other tasks / owner

- Owner read-through of `/body/upper-back/`.
