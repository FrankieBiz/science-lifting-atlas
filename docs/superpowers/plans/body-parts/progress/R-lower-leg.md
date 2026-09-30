# R-lower-leg — Lower leg region

Branch: bp/R-lower-leg · Base: 6479806 · Head: 401f23e (plus this note) · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `src/data/body-parts/regions/lower-leg.ts` published: overview, key parts, four injuries (text from the validated draft), plate front `47, 79.5` (zoom 2.3), hotspots front `47, 79.5` (shin) and **back** `47, 75` (calf). Both checked with `mark-points.py`: the front ring is on the shin, the back ring on the upper calf belly.
- Four queries tuned from the §6 seeds; `src/data/studies/lower-leg.json` fetched, 50 studies in each category.
- `muscle-map.ts` already lists `lower-leg` first for gastrocnemius, soleus and tibialis anterior, so those explorer links now go to Lower leg instead of Ankle and foot.
- Achilles topics stay with ankle-and-foot, as the brief says.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                                                |
| --------- | ------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 430          | 20/20                          | 18/20 on topic (exertional compartment syndrome, medial tibial stress syndrome, calf and gastrocnemius strains); 2 marginal (a popliteal entrapment case; a cruciate injury case with gastrocnemius tears) |
| rehab     | 194          | 20/20                          | 19/20 on topic; 1 marginal (proximal tibial stress fracture with knee osteoarthritis)                                                                                                                      |
| training  | 197          | 20/20                          | 19/20 on topic (calf raises, plantar flexor and eccentric training, soleus exercises); 1 marginal (a desmoid-tumor case mimicking calf hypertrophy)                                                        |
| mechanics | 316          | 20/20                          | 18/20 on topic (calf stiffness, fascicle behavior, tibialis anterior anatomy, tibial loading); 2 marginal (a clubfoot tendon-transfer technique; an MRI deep-learning segmentation paper)                  |

All four totals are above 150.

## Query changes from the §6 seeds (all for drift)

- injuries: `NOT supraspinatus NOT forearm NOT cruciate NOT recession NOT nerve` (compartment syndrome elsewhere, gastrocnemius recession nerve injury).
- rehab: dropped the generic `"calf muscle"[ti]` term (it returned imaging, venous thrombosis, machine-learning and MRI-coil papers) and used `calf AND (strain/injur/tear)` plus `"calf muscle injur*"` instead; `NOT forearm NOT thrombosis NOT orthos* NOT supraspinatus`.
- training: the shared `TRAIN` pattern includes `electromyography[tiab]`, which returned stroke, peripheral-artery, vestibular and machine-learning EMG papers. The query uses an inline pattern without it, keeping resistance/strength training, hypertrophy, calf raise and strengthening; `NOT stroke NOT hemipar* NOT gait NOT arterial NOT "machine learning" NOT thrombosis NOT sarcopeni* NOT hypothyroid* NOT "intellectual disabilit*" NOT botulinum* NOT nursing NOT avulsion NOT myopathy NOT "muscle mass"`.
- mechanics: dropped the general `tibia*[ti]` (it returned tibial fracture fixation, knee implants and tibial slope papers) for `"tibial loading"`, `"tibial stress"`, `"tibial strain"`, `"tibial bone"`; `NOT fractur* NOT plate* NOT implant* NOT arthroplasty NOT nail* NOT screw* NOT orthos* NOT nerve* NOT flap*`.
- `mustMatch` unchanged from §6.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed; last line: SBLA-006 asset decision passed). Hotspot-spacing and validator tests pass with the new back hotspot.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- Query changes listed above. The training query deliberately does not use the shared `TRAIN` constant.
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages to cross-check in this environment, so it stays conservative and general. Please read it on the page.

## Needs from other tasks / owner

- R-ankle-and-foot (Lane L) must drop the calf terms from its training query per §6 so the pages do not duplicate; the studies still overlap with ankle-and-foot's current list until then. It can also tighten the widened `ankle-and-foot/training` mustMatch back (see T3 note).
- Owner read-through of `/body/lower-leg/`.
