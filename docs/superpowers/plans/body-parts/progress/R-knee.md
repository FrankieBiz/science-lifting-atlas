# R-knee — Knee region (revision)

Branch: bp/R-knee · Base: 888db0e · Head: be5cea8 (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: injury names plain-first with the clinical term in parentheses ("Kneecap pain (patellofemoral pain)", "Jumper’s knee (patellar tendinopathy)", "Knee arthritis (osteoarthritis)"); added a lifting sentence; added iliotibial band syndrome as a sixth injury (§6 option, within the maximum of six).
- Training query made knee-specific per §6: `(squat* OR "knee extens*" OR "leg press" OR "patellar tendon" OR knee) AND TRAIN`. Quadriceps and hamstring terms are gone (Thigh owns them), which closes the overlap noted in R-thigh. The `mustMatch` widening I added in T3 is reverted.
- `mustMatch` now accepts "leg-press" as well as "leg press" (hyphen variant); otherwise the §6 pattern.
- Plate and hotspot unchanged (front `47.6, 69.9`, zoom 2.3).
- `src/data/studies/knee.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest)                      | Spot check of the 20 newest                                                                                                                                                                                                                                   |
| --------- | ------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 20,569       | 20/20                                               | 18/20 on topic, nearly all ACL and meniscus; 2 marginal (quadriceps motor-unit firing after surgery; a hip-and-knee muscle-volume energetics study). Patellofemoral pain and jumper's knee rarely appear in the newest 20 because ACL papers are so numerous. |
| rehab     | 6,608        | 20/20                                               | 18/20 on topic (knee osteoarthritis and ACL rehabilitation); 2 marginal (a knee-surgeon decision-making survey; a methotrexate biomarker trial)                                                                                                               |
| training  | 1,730        | 19/20 (the miss is "leg-press" hyphen, now matched) | 17/20 on topic (squat, leg-press, knee-extension training); 3 marginal (a multiligament injury case report; wall-squat blood-pressure trial; a rating-of-effort review)                                                                                       |
| mechanics | 2,805        | 20/20                                               | 18/20 on topic (knee loading, landing and stop-jump mechanics); 2 marginal (a foundation-model simulation review; a foam-rolling paper)                                                                                                                       |

## Query changes

- injuries: added `"iliotibial band syndrome"[ti]`; `NOT "deep learning" NOT chatbot* NOT "artificial intelligence" NOT "large language"` (AI chatbot and diagnosis papers).
- rehab: the same AI exclusions plus `NOT perception* NOT qualitative`.
- training: retargeted per §6 (above) plus the AI exclusions and `NOT exoskeleton* NOT implantation NOT surrogate` (exoskeleton, cartilage-implantation and graph-surrogate papers).
- mechanics: the AI exclusions plus `NOT arthroplasty NOT replacement NOT fractur* NOT popliteal NOT pin` (total-knee-arthroplasty papers were about half the newest results).

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed). Two runs failed only `operating-model-filesystem.test.ts` (a 10 s hook timeout copying the repo) while the machine load average was 14-24; the next full run was green and that test passes alone in about 1.5 s. No test was changed to get past it.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `knee` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose).
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner read-through of `/body/knee/`.
