# R-elbow — Elbow region (revision)

Branch: bp/R-elbow · Base: b403f6e · Head: eb92997 (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: the overview already has a lifting sentence and the injury names were mostly plain-first; I renamed the last card to "Ulnar nerve irritation (cubital tunnel syndrome)". The six injuries, seven key parts and all summaries are unchanged.
- Placement unchanged (front `40.8, 37.2`, zoom 2.6).
- `src/data/studies/elbow.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                                                                                            |
| --------- | ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| injuries  | 2,572        | 20/20                          | 18/20 on topic (tennis elbow, UCL, distal biceps, cubital tunnel); 2 marginal (a medial-elbow surgical approach review; pediatric medial-epicondyle fractures)                                                                                         |
| rehab     | 653          | 20/20                          | 18/20 on topic (conservative treatment, shockwave, eccentric exercise, biceps rupture management); 2 marginal (two pediatric fracture papers)                                                                                                          |
| training  | 235          | 20/20                          | 16/20 on topic (arm curl, elbow-flexor training and hypertrophy, biceps EMG and adaptations); 4 marginal (a muscle-brain connectivity paper, a deep-tendon-reflex diagnostic paper, a motor-evoked-potential paper, an age-related coordination paper) |
| mechanics | 445          | 20/20                          | 18/20 on topic (elbow anatomy, joint loading in pitching, range of motion); 2 marginal (a pediatric fracture obliquity paper; a door-opening loading study)                                                                                            |

The training spot check is 16/20, below the plan's 18/20 bar. The elbow-flexor training literature is small (235 matches) and mixes in neuromuscular research, and further exclusions start removing real arm-curl papers. **Owner call:** accept as an exception or ask for a narrower query. The `mustMatch` test passes (20/20 on the preview, and on all 50 stored titles).

## Query changes

- injuries: `NOT "nerve transfer*" NOT reinnervation NOT "supercharged" NOT osteotomy NOT fixation NOT osseous NOT "UK Biobank"`.
- rehab: unchanged from the T1 version.
- training: `NOT orthotic NOT orthosis NOT exoskeleton* NOT "human-in-the-loop" NOT "hill-type" NOT myoelectric NOT diabetes NOT "muscle aging" NOT intracortical NOT spectral NOT "motor unit" NOT assisted` (exoskeleton and orthosis control, muscle-model and intracortical papers). The query still uses the shared `TRAIN` constant.
- mechanics: `NOT prosthe* NOT fracture* NOT arthroplasty NOT "pose estimation" NOT "neural network" NOT wavelet NOT smartphone* NOT golf NOT "shoulder arthroplasty"`.
- `mustMatch` unchanged from the T1 version.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 on Node v24.20.0 (0 type errors; 28 unit files passed).
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `elbow` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose).
- **Training spot check 16/20** (above), recorded rather than hidden.
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner decision on the training spot check (accept or narrow).
- Owner read-through of `/body/elbow/`.
