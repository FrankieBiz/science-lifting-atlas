# R-shoulder — Shoulder region (revision)

Branch: bp/R-shoulder · Base: 0e149e9 · Head: 6f282b4 (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: injury names plain-first ("Top-of-shoulder pain (subacromial pain, or impingement)", "Shoulder labral tears (including SLAP)", "Shoulder dislocation and instability", "Collarbone-end sprain (AC joint sprain)"). The overview and summaries are unchanged.
- **Query bug fixed:** the rehab query had `shoulder pain[ti]` unquoted, which PubMed reads as `shoulder` in any field AND `pain[ti]`. It is now `"shoulder pain"[ti]`.
- `mustMatch` widened with `scapul|supraspinatus` on all four categories. The mechanics query deliberately includes `scapula*`, and its shoulder-blade titles failed the old pattern (hit rate 86% on the stored 50 until widened).
- Placement unchanged (front `42, 23.5`, zoom 2.3).
- `src/data/studies/shoulder.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest)     | Spot check of the 20 newest                                                                                                                                                                                                                                                                    |
| --------- | ------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 9,143        | 20/20                              | 17/20 on topic (rotator cuff repair and tears, labral and instability papers); 3 marginal (a YouTube-video quality study, a fatty-infiltration and BMI paper, a VR rehabilitation trial). Mostly surgical-outcome papers because that is most of the rotator cuff literature.                  |
| rehab     | 2,310        | 20/20                              | 17/20 on topic (exercise, motor control, scapular stabilization, postoperative rehabilitation); 3 marginal (a muscle-energy-technique paper, an imaging-reliability paper, a pain-fear paper)                                                                                                  |
| training  | 742          | 20/20                              | 14/20 on topic (shoulder strength, EMG during exercise, scapular-focused exercise, shoulder press grip width); 6 marginal (a questionnaire psychometric paper, a qualitative-study paper, two imaging or nerve-dysfunction papers, a handedness asymmetry paper, a joint-position-sense paper) |
| mechanics | 1,508        | 19/20 before widening, 20/20 after | 17/20 on topic (shoulder and scapular kinematics, anatomy, handstand and throwing biomechanics); 3 marginal (an osteopathic-technique meta-analysis, a neurologic-complications surgery review, an anatomical-variant imaging review)                                                          |

**Update (follow-up branch bp/R-shoulder-training):** the 14/20 training spot check above was fixed. The training query no longer uses the shared \`TRAIN\` constant (its \`electromyography[tiab]\` term pulled in diagnostic and qualitative papers). It now needs a shoulder-strength, exercise or lifting phrase in the title (shoulder press, overhead press, lateral raise, shoulder strength or strengthening, rotator cuff strength or exercise, scapular exercise or strengthening, deltoid, shoulder muscle) plus a training, exercise, strength, press, raise, hypertrophy, activation or resistance word, with the earlier exclusions plus \`NOT nursing NOT "machine learning" NOT wheelchair NOT parabadminton NOT surgeons NOT immobilization NOT "electrical muscle stimulation" NOT percussive\`. Result: 283 matches, 20/20 \`mustMatch\`, about 18/20 on topic (the strays are a YouTube video-quality study and a handedness-asymmetry study). The blurb is now "Shoulder strength, exercise, and lifting research." The owner decision on this exception is no longer needed.

## Query changes

- injuries, rehab, training, mechanics (shared): `NOT arthroplasty NOT "Editorial Commentary" NOT hemiplegic NOT stroke NOT "brain injury" NOT spastic NOT "Glucagon-Like" NOT "GLP-1" NOT opioid NOT cannabis NOT tumor* NOT tumour* NOT arthrodesis NOT "artificial intelligence" NOT "AI-based"`.
- injuries adds `NOT insurance NOT spin NOT bioinductive NOT "tendon-to-bone"`.
- rehab adds `NOT "Rehabilitation Experiences" NOT "Support Needs" NOT regeneration NOT laser NOT "physical agent"`.
- training adds `NOT exoskeleton* NOT decoding NOT "Feature-Level" NOT "sEMG-IMU" NOT graft NOT vagus NOT ergonomic* NOT implant* NOT "neural control" NOT methodological NOT "pain-related fear"`.
- mechanics adds `NOT nerve* NOT injection NOT golf NOT obesity NOT "muscle energy" NOT mobilization NOT "Dynamic Anterior" NOT "new normal" NOT interscalene NOT fractur* NOT plate`.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 on Node v24.20.0 (0 type errors; 28 unit files passed, including the relevance test on all 50 stored titles per category).
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `shoulder` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose). With this region the snapshot is empty.
- Training spot check was 14/20, since fixed by the follow-up above.
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner read-through of `/body/shoulder/`.
