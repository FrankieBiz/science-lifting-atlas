# R-hip-and-groin — Hip and groin region (revision)

Branch: bp/R-hip-and-groin · Base: 1cb7ae3 · Head: 058ae99 (plus this note) · Agent: Claude Sonnet 5.5 (Lane L task taken under the owner's "fully autonomous" direction; see lane-s-takeover.md)

## Done

- Text re-read against §7: tagline and overview now name the groin and adductors; injury names are plain-first with the clinical term in parentheses ("Hip pinching (femoroacetabular impingement)", "Outer hip pain (gluteal tendinopathy)", "Hip arthritis (osteoarthritis)"); added "Groin pain (adductor-related groin pain)" and "Front-of-hip strain (hip flexor strain)" (six injuries, the maximum); added the pubic symphysis to key parts (six items).
- Back-view hotspot added on the glute at `47, 47.5`. `mark-points.py` showed the first guess (45, 48) on the outer edge of the glute, so it was moved onto the muscle belly. Front plate and hotspot unchanged (`45.5, 46.9`, zoom 2.1).
- `src/data/studies/hip-and-groin.json` refetched, 50 studies per category.

## Final PubMed totals and preview results

| Category  | PubMed total | mustMatch hit rate (20 newest) | Spot check of the 20 newest                                                                                                                                                                        |
| --------- | ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| injuries  | 2,601        | 20/20                          | 18/20 on topic (impingement, labral, gluteal tendinopathy, hip-related groin pain); 2 marginal (a hip-arthroscopy trial protocol for a postless distraction method; a pain-catastrophizing review) |
| rehab     | 900          | 20/20                          | 17/20 on topic; 3 marginal (two knee-and-hip osteoarthritis service-use papers; a minimal-clinically-important-difference methods paper)                                                           |
| training  | 262          | 20/20                          | 18/20 on topic (gluteal EMG, hip abduction and extension exercise); 2 marginal (two chronic-low-back-pain glute studies)                                                                           |
| mechanics | 1,154        | 20/20                          | 17/20 on topic; 3 marginal (a hip-arthroscopy dysplasia review; a scoping review of surgical stress modeling; an EMS technique paper)                                                              |

## Query changes

- injuries: added `"athletic pubalgia"`, `"adductor-related"`, `"hip flexor strain"`; `NOT kidney NOT "pressure injur*" NOT fractur* NOT arthroplasty NOT hernia` (acute kidney injury and pressure-injury papers matched "hip AND injur*").
- rehab: `NOT qualitative NOT "lived experience*" NOT perception* NOT registry NOT expectations NOT neurolysis NOT embolization NOT hernia NOT arthroplasty`.
- training: `glute*` replaced by `gluteus OR gluteal OR glutes` (`glute*` matched "gluten" in a neuropathy case); `NOT robot* NOT paralysis NOT "older adults"`.
- mechanics: `NOT arthroplasty NOT fractur* NOT fixation NOT screw* NOT plate* NOT reconstruction NOT nerve* NOT stroke NOT inpatient NOT "total hip"` (fracture-fixation and post-operative gait papers).
- `mustMatch` unchanged from the T1 version.

## Checks (real output)

- pnpm format && pnpm verify: exit 0 on Node v24.20.0 (0 type errors; 28 unit files passed). Earlier runs failed only `operating-model-filesystem.test.ts` (10 s hook timeout copying the repo) while the machine load average was 14 to 200; that test passes alone in about 1.5 s and was not changed. The Node 24.20.0 toolchain I had used earlier was in a temp directory that disappeared, so I re-downloaded it from nodejs.org into the scratchpad.
- pnpm test:e2e: not run: sandbox blocks browsers.

## Deviations from the plan

- **Lane crossing:** a Lane L task done by Lane S under the owner's autonomous direction.
- **Test edit outside the R-task file list:** removed the `hip-and-groin` entry from `QUERY_SNAPSHOT` in `tests/unit/body-parts-registry.test.ts` (queries changed on purpose).
- Owner review: injury wording was written from general knowledge and the §6 brief; I could not open MedlinePlus/NHS/AAOS pages here, so it stays conservative and general.

## Needs from other tasks / owner

- Owner read-through of `/body/hip-and-groin/`.
