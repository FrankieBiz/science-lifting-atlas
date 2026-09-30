# R-wrist-and-hand — Wrist and hand region (revision)

Branch: bp/R-wrist-and-hand · Base: bcaf8c4 · Head: f8a728a (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: injury names plain-first ("Nerve squeeze at the wrist (carpal tunnel syndrome)", "Thumb-side wrist pain (De Quervain tenosynovitis)", "Little-finger-side wrist pain (TFCC injury)"); added "Catching finger (trigger finger)" (five injuries). The overview already had a lifting sentence.
- `mustMatch` fixed on all four categories: bare `finger` also matched "kinetic fingerprint" (a chemistry paper passed the test), so it is now `finger(?!print)`.
- Placement unchanged. The plate is at front `39.3, 49.6` and the hotspot at `60.7, 49.6` (opposite hands, as set up in T1); I did not change either.
- `src/data/studies/wrist-and-hand.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                                                                                                                    |
| --------- | ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| injuries  | 7,095        | 20/20                          | 18/20 on topic (carpal tunnel, TFCC, ulnar-sided wrist pain); 2 marginal (a Romanian-language scale validation; an antibiotic-prophylaxis trial for carpal tunnel release). Mostly carpal tunnel.                                                                              |
| rehab     | 1,483        | 20/20                          | 17/20 on topic; 3 marginal (a dual-task resistance-exercise trial, a GLP-1 outcome paper (now excluded), a cortical-remodeling imaging paper)                                                                                                                                  |
| training  | 533          | 18/20                          | 17/20 on topic (grip and forearm training, blood-flow-restriction and climbing grip work); 3 marginal (a pediatric distal-forearm-fracture ultrasound paper, a stretching-and-rolling comparison, a medical-training-therapy rehab trial). Stored 50 titles pass the 90% test. |
| mechanics | 1,061        | 20/20                          | 18/20 on topic (wrist kinematics, carpal theories, finger biomechanics); 2 marginal (a smartphone finger-kinematics tool for cervical myelopathy; a teacher-hand anatomy-lecture trial)                                                                                        |

All four totals are above 150. Training is the weakest category; the topic (grip as a training target, as opposed to grip as a health marker) is genuinely small.

## Query changes

- injuries: added `"trigger finger"[ti]`; `NOT "machine learning" NOT "deep learning" NOT "artificial intelligence" NOT amyloidosis NOT hemodialysis NOT prosthe* NOT periprosthetic NOT fusion NOT arthroplasty NOT "nerve transfer" NOT surgical NOT "wait times" NOT "regional variations" NOT stroke`.
- rehab: the same exclusions plus `NOT spasticity NOT "neural common drive" NOT "blood pressure" NOT cardiac NOT fracture* NOT smartwatch NOT walking NOT "Glucagon-Like" NOT "GLP-1" NOT "step counting"`.
- training: rebuilt. The seed `(grip strength OR handgrip OR forearm OR wrist) AND (resistance/strength/grip training)` returned only 89 matches, mostly grip strength as a marker of mortality, cognition and osteoporosis. The query now pairs grip/forearm/finger-flexor/wrist-extensor/climber terms with training, exercise, strengthening, blood-flow restriction, resistance or hypertrophy in the title, with exclusions for mortality, cognition, osteoporosis, blood pressure, hypertension, stroke, older adults, cardiovascular and sympathetic-nerve physiology, and similar. The shared `TRAIN` constant is not used.
- mechanics: the same exclusions plus `NOT surgical NOT "e-skin" NOT forensic NOT "kinetic fingerprint*" NOT "food matrix" NOT plate* NOT "external fixation" NOT transfer* NOT nerve* NOT shoulder NOT classification NOT "surgical skill" NOT imaging NOT implant* NOT EEG NOT autistic NOT toddler* NOT pediatric NOT dataset NOT decoding NOT tactile NOT Auslan NOT "hand-to-mouth" NOT AI-based NOT neurotization NOT brachialis`.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 on Node v24.20.0 (0 type errors; 28 unit files passed, including the relevance test on all 50 stored titles per category).
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `wrist-and-hand` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose).
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner read-through of `/body/wrist-and-hand/`.
