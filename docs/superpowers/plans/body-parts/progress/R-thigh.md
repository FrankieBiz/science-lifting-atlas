# R-thigh — Thigh region

Branch: bp/R-thigh · Base: 4df0579 · Head: 109935f (plus this note) · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `src/data/body-parts/regions/thigh.ts` published: overview, key parts, five injuries (text from the validated draft), plate front `46.4, 58.5` (zoom 2.0), hotspots front `46.4, 58.5` and **back** `47, 60` on the hamstrings. Both checked with `mark-points.py`: the front ring is on the quadriceps; the back hotspot started at x 46 (outer edge of the thigh) and was moved to 47 so it sits on the muscle belly.
- Four queries tuned from the §6 seeds; `src/data/studies/thigh.json` fetched, 50 studies in each category.
- `muscle-map.ts` already lists `thigh` first for quadriceps and hamstrings, so those explorer links now go to Thigh instead of Knee.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                           |
| --------- | ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 853          | 20/20                          | 19/20 on topic; 1 marginal (strength recovery after a multiligament knee injury)                                                                      |
| rehab     | 891          | 20/20                          | 19/20 on topic (hamstring injury rehab, proximal avulsion repair, Nordic exercise dose); 1 marginal (skier muscle morphology)                         |
| training  | 864          | 20/20                          | 18/20 on topic; 2 marginal (quadriceps atrophy after ACL reconstruction; motor-unit firing studies)                                                   |
| mechanics | 433          | 20/20                          | 18/20 on topic (fascicle length, muscle architecture, tendon anatomy); 2 marginal (patellar tendinopathy loading trial; MR strength-prediction model) |

All four totals are above 150.

## Query changes from the §6 seeds (all for drift)

- rehab: `NOT graft* NOT "anterior cruciate" NOT ACL NOT reconstruction` (hamstring-graft ACL papers).
- training: `NOT stroke NOT gait NOT device NOT sensor* NOT textile NOT cycling NOT graft* NOT "muscle pump"` (the TRAIN EMG term pulled device-validation and patient-gait papers).
- mechanics: dropped `femur[ti]` (hip and fracture-fixation papers); `NOT fractur* NOT nail* NOT plate NOT fixation NOT nerve* NOT block NOT reconstruction NOT patellofemoral NOT "muscle pump" NOT adipose NOT "anterior cruciate" NOT graft* NOT flap* NOT crouch`.
- injuries: unchanged from the seed.
- `mustMatch` unchanged from §6.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed; last line: SBLA-006 asset decision passed). Hotspot-spacing and validator tests pass with the new back hotspot.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- Query changes listed above; back hotspot x 47 (plan estimate was ~46).
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages to cross-check in this environment, so it stays conservative and general. Please read it on the page.

## Needs from other tasks / owner

- R-knee (Lane L) must drop quadriceps/hamstring terms from its training query per §6 so the two pages do not duplicate; studies here still overlap with knee's current lists until then.
- Owner read-through of `/body/thigh/`.
