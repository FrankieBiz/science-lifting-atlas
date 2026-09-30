# R-chest — Chest region

Branch: bp/R-chest · Base: dedb57a · Head: 443d014 (plus this note) · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `src/data/body-parts/regions/chest.ts` published: overview, key parts, five injuries, required safety note (text from the validated draft), plate and hotspot front `50, 26` (zoom 2.1; ring checked with `mark-points.py`, it sits on the center of the chest).
- Four queries tuned from the §6 seeds; `src/data/studies/chest.json` fetched, 50 studies in each category.
- `muscle-map.ts` already lists `chest` first for pectoralis major, so the explorer link now goes to Chest.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                              |
| --------- | ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| injuries  | 434          | 19/20                          | 19/20 on topic; 1 about a spine surgical approach (FAMA) that mentions sterno-clavicular dislocation     |
| rehab     | 121          | 20/20                          | 20/20 on topic (sternoclavicular joint and pectoralis major rupture treatment)                           |
| training  | 280          | 20/20 (seed-tuned run)         | 20/20 on topic (bench press, push-up); earlier scapular-surgery papers removed with NOT terms            |
| mechanics | 119          | 20/20 (seed-tuned run)         | 20/20 on topic (bench press kinematics, pectoral and SC anatomy); breast-surgery and ARDS papers removed |

Rehab (121) and mechanics (119) are below 150 but above 60, which the plan allows for narrow regions.

## Query changes from the §6 seeds (all for drift)

- injuries: dropped `"chest wall pain"[ti]` (pulled in nerve entrapment, tuberculosis, spondyloarthritis cases); limited `sternoclavicular` to dislocation/sprain/injury/instability (infections and arthritis dominated); added `avulsion*` and `"stress fracture*" AND rib*` (rib stress fracture); `NOT tubercul* NOT infect* NOT "chest tube"`.
- rehab: same sternoclavicular limits; `pectoralis major` limited to rupture/tear/tendon/injury; dropped `chest wall pain`; `NOT flap* NOT infect* NOT tubercul* NOT "chest tube"`.
- training: `NOT scapular[ti] NOT arthroscopic[ti]` (scapular-dyskinesis surgery papers).
- mechanics: dropped `"chest wall"[ti]` (ARDS, respiratory, breast-surgery papers); `NOT breast* NOT arthroplasty NOT flap*`.
- `mustMatch` unchanged from §6.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed; last line: SBLA-006 asset decision passed).
- Hotspot spacing test (T4) and validator passed as part of unit tests.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- Query changes listed above. Rehab and mechanics totals under 150 (allowed).
- Owner review: injury and safety-note wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages to cross-check in this environment, so the wording stays conservative and general. Please read it on the page.

## Needs from other tasks / owner

- Owner read-through of `/body/chest/`.
