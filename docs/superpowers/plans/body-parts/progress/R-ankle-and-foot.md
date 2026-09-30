# R-ankle-and-foot — Ankle and foot region (revision)

Branch: bp/R-ankle-and-foot · Base: d42f486 · Head: 3705831 (plus this note) · Agent: Claude Sonnet 5.5 (took this Lane L task under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: removed the "strongest tendon in the body" claim ("one of the largest"), added a lifting sentence, wrote injury names plain-first with the clinical term in parentheses ("Rolled ankle (lateral ankle sprain)", "Achilles tendon pain (Achilles tendinopathy)", "Heel pain (plantar fasciitis)"), removed the rehab-advice phrase "if not rehabilitated", and added a fifth injury (forefoot stress fracture).
- Training query retargeted to ankle and foot per §6 (calf terms moved to Lower leg, which already holds them); `mustMatch` for training restored to the ankle/foot pattern (I had widened it in T3; that widening is reverted).
- Plate and hotspot unchanged (front `46.6, 87.5`, zoom 2.4).
- `src/data/studies/ankle-and-foot.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                        |
| --------- | ------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 4,572        | 20/20                          | 18/20 on topic (mostly chronic ankle instability, Achilles rupture and plantar heel pain); 2 marginal (single-leg hop in masters runners; trunk-perturbation posture study)        |
| rehab     | 2,482        | 20/20                          | 18/20 on topic; 2 marginal (a finite-element Achilles model; a pediatric clubfoot procedure)                                                                                       |
| training  | 912          | 20/20                          | 18/20 on topic (balance and proprioceptive training, peroneal and intrinsic foot muscle work); 2 marginal (a review of anterior ankle impingement; ageing ankle mechanics in gait) |
| mechanics | 2,200        | 20/20                          | 17/20 on topic; 3 marginal (an ankle-fusion plate study; markerless gait-system validation; orthoses in metatarsal pain)                                                           |

## Query changes

- injuries: added `("stress fracture*" AND (metatarsal OR foot))` for the new card.
- rehab: unchanged from the T1 version.
- training: replaced calf/soleus seed with `(ankle OR foot OR "intrinsic foot" OR toe) AND (TRAIN OR "balance training" OR "proprioceptive training")` per §6, plus `NOT stroke NOT acupuncture NOT ultrasound NOT arthroplasty NOT "foot drop" NOT amput* NOT prosthe* NOT diabet*` (stroke foot-drop acupuncture, hand/wrist/foot ultrasound thresholds, arthroplasty and amputee papers).
- mechanics: `NOT arthroplasty NOT amput* NOT prosthe* NOT nerve* NOT surgical NOT knee NOT patellofemoral NOT tibiofemoral NOT children` (implant, amputee, nerve-anatomy and knee-compression papers).

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed). One earlier run failed only `operating-model-filesystem.test.ts` (a 10 s hook timeout copying the repo) while the machine's load average was 24; that test passes alone in 1.5 s and the next full run was green. No test was changed to get past it.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** this is a Lane L task, done by Lane S because the owner directed fully autonomous operation and Luna had not started the R tasks.
- **Test edit outside the R-task file list:** removed the `ankle-and-foot` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (added one comment line explaining that revised regions leave the snapshot). That snapshot only guarded the T1 refactor; the queries changed on purpose. No other assertion was touched.
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner read-through of `/body/ankle-and-foot/`.
