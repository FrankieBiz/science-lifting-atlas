# R-lower-back — Lower back region (revision)

Branch: bp/R-lower-back · Base: 936c829 · Head: 64c1ccf (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: injury names plain-first ("Pinched nerve from a disc (disc herniation and sciatica)", "Low back muscle strain", "Vertebral stress fracture (spondylolysis)"); added "Sacroiliac joint pain" (five injuries). The overview already had a lifting sentence. The required safety note is unchanged and matches the §6 wording.
- Placement: hero plate moved to the **back** view at `50, 41` (zoom 2.0); hotspots are front `50, 43` and back `50, 41`. `mark-points.py` shows the back ring on the lumbar erectors just above the pelvis.
- `src/data/studies/lower-back.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                                                                                           |
| --------- | ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 16,373       | 20/20                          | 18/20 about low back pain; 2 marginal (an immune-neural review of disc degeneration; an ankle-instability review). Mostly chronic low back pain trials; the newest 20 rarely show spondylolysis or sprain papers because pain trials are so numerous. |
| rehab     | 5,852        | 20/20                          | 19/20 on topic (exercise, physiotherapy, telerehabilitation, meta-analyses); 1 marginal (an astronaut exercise-countermeasures paper)                                                                                                                 |
| training  | 223          | 20/20                          | 16/20 on topic (deadlift, trunk strength, resistance training for back pain); 4 marginal (two hamstring Nordic-exercise trials, a load-velocity monitoring paper, a hammock-exercise autonomic study)                                                 |
| mechanics | 1,404        | 20/20                          | 18/20 on topic (spinal loading in lifting, lumbar stiffness and kinematics); 2 marginal (a muscle-stimulation technique paper; a lumbar traction trial)                                                                                               |

The training spot check is 16/20, below the plan's 18/20 bar. I did not keep tightening it because the total is already only 223 (above the 150 minimum), and further exclusions risk dropping real deadlift papers. **Owner call:** accept this as an exception or ask for a narrower query; the `mustMatch` test passes (20/20), so it is only the spot check that is short.

## Query changes

- injuries and rehab: added `NOT decoction NOT herbal NOT "machine learning" NOT prevalence NOT "cross-cultural" NOT "conflicts of interest" NOT affordability NOT disparities NOT "text network" NOT "job satisfaction" NOT caregivers NOT bisphenol NOT radiomics NOT Ayurvedic NOT "CMS"`.
- training: `NOT astronaut* NOT "machine learning" NOT lifestyle`.
- mechanics: the seed's bare `spine` and `spinal` terms returned cervical, thoracic, surgical-fusion and aging-spine papers. The query now requires `"lumbar spine"`, `lumbar`, `"low back"`, `"spinal loading"` or `"spinal load*"` with lifting, squat, biomechanics, kinematics, loading, range of motion or stiffness, plus `NOT cervical NOT thoracic NOT surgery NOT surgical NOT exosuit NOT reconstruction NOT radiograph* NOT aging NOT embalming NOT deformity NOT arterial NOT protocol NOT fusion NOT interbody NOT endoscopic NOT arthroplasty NOT "ball-and-socket" NOT traction NOT manipulation`. The shared `MECH` constant is not used; the loading terms are inline.
- `mustMatch` unchanged from the T1 version.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 on Node v24.20.0 (0 type errors; 28 unit files passed). Hotspot-spacing and validator tests pass with the new back hotspot.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `lower-back` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose).
- **Training spot check 16/20** (above), recorded rather than hidden.
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general. The safety note is the §6 text.

## Needs from other tasks / owner

- Owner decision on the training spot check (accept or narrow).
- Owner read-through of `/body/lower-back/`.
