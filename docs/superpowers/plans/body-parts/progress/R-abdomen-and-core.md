# R-abdomen-and-core — Abdomen and core region

Branch: bp/R-abdomen-and-core · Base: 9466af5 · Head: 27fcba2 (plus this note) · Agent: Claude Sonnet 5.5 (Lane S)

## Done

- `src/data/body-parts/regions/abdomen-and-core.ts` published: overview, key parts, four injuries, required safety note (text from the validated draft), plate and hotspot front `50, 37` (zoom 2.1; ring checked with `mark-points.py`, it sits on the center of the abdominal wall).
- Four queries tuned from the §6 seeds; `src/data/studies/abdomen-and-core.json` fetched, 50 studies in each category.
- `muscle-map.ts` already lists `abdomen-and-core` first for external oblique, so that explorer link now goes here.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                  |
| --------- | ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| injuries  | 194          | 20/20                          | 18/20 on topic; 2 marginal (a postmortem-CT study of abdominal-wall trauma; a letter on abdominoplasty and sexual function). Mostly diastasis recti.         |
| rehab     | 265          | 20/20                          | 18/20 on topic; 2 marginal (core-stability programs in non-lifting populations: urinary symptoms, older-adult Pilates)                                       |
| training  | 497          | 20/20                          | 19/20 on topic (core, plank, trunk-muscle training and EMG); 1 marginal (a precision-medicine review of postpartum rectus separation)                        |
| mechanics | 514          | 20/20                          | 18/20 on topic (trunk-muscle EMG, abdominal bracing, intra-abdominal pressure); 2 marginal (back-pain subgroup EMG; pelvic-floor activation during Valsalva) |

All four totals are above 150.

## Query changes from the §6 seeds (all for drift)

- injuries: seed returned almost only inguinal-hernia mesh and robotic-repair surgery (4,584 matches). Hernia now requires an athlete/sport/exercise/lifting/strenuous term in title or abstract; `NOT mesh NOT laparoscop* NOT robot* NOT "learning curve" NOT repair NOT carcinoma`. Result is dominated by diastasis recti and a few hernia and trauma papers.
- rehab: `inguinal hernia` limited to athlete/sport/return-to; `NOT stroke NOT ataxia NOT temporomandibular NOT "intensive care" NOT parkinson* NOT "cerebral palsy" NOT youtube NOT veteran*` plus the same surgery exclusions as injuries.
- training: replaced bare `abdominal*[ti]` (it returned abdominal aortic aneurysm, abdominal obesity, endometriosis pain) with `abdominal muscle*`, `abdominal exercise*`, `abdominal training`, `abdominal strength*`; `NOT stroke NOT ataxia NOT aort* NOT obes* NOT endometriosis NOT "older adults" NOT laparoscop* NOT fall* NOT scoliosis NOT "timed up" NOT "timed-up-and-go" NOT amput* NOT spondylolysis NOT cervical NOT anticipatory`.
- mechanics: replaced `bracing[ti]` (it returned hip, joint and scoliosis bracing) with `"abdominal bracing"`; `NOT stroke NOT scoliosis NOT "older adults" NOT fall* NOT "sit-to-stand" NOT "genital hiatus" NOT amput* NOT "timed up" NOT "timed-up-and-go" NOT epidural NOT stimulation NOT anticipatory NOT urinary NOT proprioceptive NOT "spinal cord"`. `MECH` is written inline with `electromyograph*[tiab]`, as the brief says.
- `mustMatch` tightened from the §6 pattern: bare `core` became `\bcore\b` (it matched "score") and bare `brac` became `\bbrac(e|ing)\b` (it matched "brachial").

## Checks (real output)

- pnpm format && pnpm verify: exit 0 (0 type errors; 28 unit files passed; last line: SBLA-006 asset decision passed).
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- Query and `mustMatch` changes listed above.
- Owner review: injury and safety-note wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages to cross-check in this environment, so it stays conservative and general. The injuries list on the page covers strain and hernias, but the newest-first study list is mostly diastasis recti because hernia surgery papers are excluded. Please read it on the page.

## Needs from other tasks / owner

- Owner read-through of `/body/abdomen-and-core/`.
