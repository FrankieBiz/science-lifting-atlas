# R-neck — Neck region

Branch: `bp/R-neck` · Base: `d42f486` · Agent: GPT-6 Luna (Lane L)

## Status: BLOCKED

The training query did not meet the plan's relevance threshold after five
previews. The latest version returns 229 PubMed matches and has a 20/20
`mustMatch` hit rate, but only about 15 of the 20 newest titles clearly fit
neck training or strength. The query and generated studies were not published
or fetched. Per plan §11, work stops here pending owner direction; later Lane L
tasks have not started.

## Query previews

| Category  | PubMed total        | `mustMatch` | Spot check                                                                                                                              |
| --------- | ------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 4,904               | 20/20       | 20/20 clearly about neck pain, cervical radiculopathy, whiplash, or neck strain                                                         |
| rehab     | 1,676               | 20/20       | 20/20 clearly about neck pain, radiculopathy, whiplash, or related rehabilitation                                                       |
| training  | 229 (fifth preview) | 20/20       | About 15/20 clearly about neck or upper-trapezius training/strength; residual cancer, general neck pain, and non-training titles remain |
| mechanics | 541                 | 20/20       | 20/20 on cervical-spine structure, movement, or mechanics                                                                               |

Training previews progressively narrowed the broad `cervical`/`neck` search
with title exclusions. A phrase-only version fell to 22 matches, below the
required 150 for this region. The fifth preview still missed the 18/20 title
relevance threshold, so no further attempts were made.

## Candidate query and changes made

- No region or study data changes are retained. The five-preview candidate
  training query was:

  ```text
  ((neck[ti] OR cervical[ti] OR "upper trapezius"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR strengthening[tiab])) NOT cancer[ti] NOT carcinoma[ti] NOT neoplasm[ti] NOT HPV[ti] NOT oncology[ti] NOT lumbar[ti] NOT cervix[ti] NOT cytology[ti] NOT migraine[ti] NOT nursing[ti] NOT abscess[ti] NOT myelopathy[ti] NOT "head and neck"[ti] NOT screening[ti] NOT dysplasia[ti] NOT precancer*[ti] NOT femor*[ti] NOT headache[ti] NOT trauma[ti]
  ```

- The mechanics preview used `("cervical spine"[ti] OR "cervical
vertebrae"[ti] OR "cervical kinematics"[ti]) AND` the shared `MECH`
  pattern; it had 541 matches and 20/20 relevant newest titles. This query
  was not retained because the task is blocked on the training category.
- No changes to `src/data/studies/neck.json`.

## Checks

- The exploratory verification with temporary region query edits failed in
  `tests/unit/body-parts-registry.test.ts` because it asserts the original neck
  queries byte-for-byte. Those edits were removed; no test file was changed.
- Clean-state `pnpm format && pnpm verify`: passed. Prettier and ESLint passed;
  Astro check reported 0 errors, warnings, or hints; 418 unit tests, 5
  accessibility tests, 4 visual tests, and 17 portability tests passed; the
  content, graph, research, evidence, build, foundation, and asset-decision
  checks passed. Build emitted the existing large-chunk warning.
- `pnpm test:e2e`: not run for this blocked task.

## Medical reference check

The required safety note matches general-public red-flag guidance in
[MedlinePlus neck pain guidance](https://medlineplus.gov/ency/article/003025.htm)
and [MedlinePlus emergency-room guidance](https://medlineplus.gov/ency/patientinstructions/000593.htm).
No injury wording changes were needed.

## Needs from owner

- Decide whether to accept the neck-training title relevance as a documented
  exception, or provide a query/category direction that can meet §5's 18/20
  threshold within five previews.
- Once resolved, finish the region, fetch neck studies, run required checks,
  and continue with R-shoulder.
