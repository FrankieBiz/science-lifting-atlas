# Appraisal — SBLA-009 evidence pass

- Task: SBLA-009 (§18 queue row; §14 Phase 1 Task 1.2, `appraise` stage of the §9.8 pipeline)
- Role: Claude Research (account A) — evidence lead, not the independent reviewer
- Base commit: `8ca59e850beb0770554074d474a3ff3a9e16710a`
- Date: 2026-09-13; corrected 2026-09-15 in the SBLA-010 R2 bounded remediation
- Artifact version: 2.0.0
- Revision: R1 bounded remediation against
  [`reviews/evidence/SBLA-009-r1.md`](../../reviews/evidence/SBLA-009-r1.md) at
  `8154f1167062403a96ee5d6ec0fc63bd50ebfd17`. Changes are listed in §7.
- Second revision: SBLA-010 R2 bounded remediation against
  [`reviews/evidence/SBLA-009-r2.md`](../../reviews/evidence/SBLA-009-r2.md) at
  `f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46` (SHA-256
  `3428d3feb9b58bb150ac4c93375d868cabc5dc3f5597e83e50503b30a47a12b5`). Changes are
  listed in §8. The artifact version stays 2.0.0 because that report's finding N-3
  prescribes pinning the three drafts to `atomic-claims.json@2.0.0`.
- Companions, all at version 2.0.0 except the evidence packet, which carries no version
  field because its schema is strict and does not own one; its version is stated in its
  own `synthesis` text and the gap is routed to Codex in the handoff:
  [`research/searches/SBLA-009-search-receipts.json`](../searches/SBLA-009-search-receipts.json),
  [`research/screening/SBLA-009-screening-flow.json`](../screening/SBLA-009-screening-flow.json),
  [`research/extractions/SBLA-009-source-extractions.json`](../extractions/SBLA-009-source-extractions.json),
  [`research/syntheses/SBLA-009-synthesis.md`](../syntheses/SBLA-009-synthesis.md),
  [`research/packets/sbla-009-evidence-packet.json`](../packets/sbla-009-evidence-packet.json),
  [`content-drafts/syntheses/SBLA-009-atomic-claims.json`](../../content-drafts/syntheses/SBLA-009-atomic-claims.json)
- Governing scope: [`research/questions/SBLA-008-vertical-slice.md`](../questions/SBLA-008-vertical-slice.md),
  [`research/screening/SBLA-008-eligibility-plan.md`](../screening/SBLA-008-eligibility-plan.md),
  [`reviews/releases/SBLA-009-prerequisite-decisions.md`](../../reviews/releases/SBLA-009-prerequisite-decisions.md)

## 0. What this document is

This is the `appraise` stage: design-specific risk of bias and applicability for the
89 included sources, plus the one thing appraisal is really for in this slice —
saying which evidence can carry which claim type, and which cannot carry anything.
The count was 76 in the first pass, 88 after the R1 bounded remediation, and 89 after
the SBLA-010 R2 remediation obtained the full text of G1944.

Every number quoted here comes from the extraction artifact, where it sits beside
its locator. Nothing here is a claim; the claims are in
`content-drafts/syntheses/SBLA-009-atomic-claims.json` and the reasoning that
connects them to this appraisal is in the synthesis.

## 1. The appraisal that matters most

**There is no tier-1 evidence for the index comparison, and there is no tier-1
evidence for index exercise Y at all.**

Not "weak evidence". None. After 2,343 retrieval events, 1,956 unique records, a
fly-family probe built to be exhaustive across thirty phrase variants on PubMed and
twenty-six on Europe PMC, and backward and forward citation chasing over the whole
included set, this pass retrieved:

- zero studies in which a **bilateral standing cable fly at shoulder height** is a
  trained condition, with or without a comparator;
- zero studies comparing a barbell flat bench press with any cable fly for a
  pectoralis major size outcome;
- zero trial registrations, across 159 ClinicalTrials.gov records matched on
  intervention and outcome, in which any fly-family exercise is a randomised
  condition.

Everything below is about what exists _around_ that hole.

## 2. Risk-of-bias and applicability by evidence group

### 2.1 Tier 1 — pectoralis major size change

Three trials survived to full text and can carry a tier-1 statement. Ten more are
eligible on their abstracts and are held at `awaiting-full-text` because the
eligibility plan §4.5 forbids taking a tier-1 hypertrophy datum from an abstract.
That rule cost this pass most of its tier-1 evidence and it was applied anyway.

| Record | Design and contrast                                                                              | Risk of bias  | Applicability    | What it can carry                                                                                |
| ------ | ------------------------------------------------------------------------------------------------ | ------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| G0098  | 8 wk machine butterfly vs pectoral stretching vs non-training control, n = 81, ultrasound        | some concerns | partially direct | That a **machine fly**, trained alone, increases pectoralis major thickness against no training  |
| G0118  | 8 wk horizontal vs incline vs combined bench press, n = 47 randomised / 30 measured, once weekly | some concerns | partially direct | That **bench press** training changes pectoralis thickness, and that the change is site-specific |
| G0132  | 8 wk bench press at 40% 1RM vs load-matched push-up, n = 18, ultrasound                          | **high**      | partially direct | Direction only; its between-group pectoralis numbers are unusable (see §3.1)                     |

Common limitations across all three: none has a registered protocol recorded in
the retrieved text; none reports an intention-to-treat analysis; all use B-mode
ultrasound at one or a few sites, and the repository's own measurement sources
(G0684, G0674, G0108) show that operator experience, imaging plane and the choice
between volume and cross-sectional area all move the number.

**G0098 is the load-bearing tier-1 source for the fly family and it is a machine
butterfly, not a cable fly.** Its group allocation is described but not detailed;
there is no statement of randomisation sequence, allocation concealment or
blinded outcome assessment. Its interesting result — that 15 minutes a day of
static stretching produced the same thickness change as 5×10–12 at 10–12RM three
times a week — is reported here with the same prominence it has in the paper,
because burying it would be exactly the selective reporting §2.2 prohibits.

### 2.2 Tier 2 — task-specific strength

| Record | Design and contrast                                                | Risk of bias  | Applicability    | Mandatory qualifier                                                               |
| ------ | ------------------------------------------------------------------ | ------------- | ---------------- | --------------------------------------------------------------------------------- |
| G0052  | 8 wk volume-equated single-joint vs multi-joint programmes, n = 36 | some concerns | **indirect**     | The tier-2 outcome is 1RM bench press, which only the multi-joint group practised |
| G0118  | isometric bench press strength, three groups                       | some concerns | partially direct | No control arm                                                                    |
| G0098  | isometric strength in the butterfly start position                 | some concerns | partially direct | The test position matches the trained exercise for the strength group             |

G0052 is the closest longitudinal analogue in this pass to "press family versus
fly family", and it is indirect on every axis at once: whole programmes rather
than two exercises, a pec deck and an incline dumbbell fly rather than a cable
fly, no pectoralis size measure, a test the multi-joint group trained, and
concurrent pre-season soccer in both arms. Its 8.1 % versus 10.9 % 1RM difference
is a real reported number and it is not evidence that presses build more pectoral
muscle than flies.

### 2.3 Tier 3 — mechanics

| Record | What was measured                                                                | Risk of bias  | Applicability    |
| ------ | -------------------------------------------------------------------------------- | ------------- | ---------------- |
| G0034  | Shoulder, elbow and wrist joint moments and RoM, bench press vs cable cross-over | some concerns | partially direct |
| G0436  | Shoulder and elbow moment arms through the bench press sticking region           | some concerns | partially direct |
| G0117  | Net and strength-normalised joint moments with lateral barbell forces            | some concerns | direct           |
| G0263  | Net joint moments and moment arms across expertise and sex                       | some concerns | direct           |
| G0005  | Concentric peak and mean force, gravitational vs pneumatic resistance            | some concerns | partially direct |
| G0970  | Modelled glenohumeral torque demand on a pec deck machine, cam-pulley effect     | some concerns | indirect         |
| G0798  | Full-body multibody model including the dumbbell fly (**preprint**)              | some concerns | indirect         |
| G0517  | Static optimisation underestimates antagonist activity                           | some concerns | indirect         |

G0034 is the only source in the whole pass that measures the index press and a
cable fly-family condition in the same participants with the same instrumentation,
and it is therefore the backbone of the comparison this task was set. Three things
bound it:

1. Its cable cross-over is **not index Y**. Pulley height is not reported, the
   elbow angle was not prescribed, and stance is not described. Eligibility plan
   §2.3 rule 3 resolves two or more unreported defining attributes away from the
   index set, so this is a related condition.
2. Loads were 15 % and 30 % of body weight, not a percentage of 1RM, so relative
   intensity is unknown and may differ between exercises.
3. The shoulder was modelled as the humerus relative to the thorax with no
   separate scapula, which the authors name as their key limitation and which
   matters most at exactly the end-range of the bench press.

G0117 and G0263 together mean that a bench press joint-moment figure is a property
of a lifter's technique as much as of the exercise, and that a moment computed
from vertical barbell force alone is wrong. Both constrain how far G0034's numbers
can be generalised.

### 2.4 Tier 4 — activation

Nineteen included sources report electromyography, the nineteenth being G1944, added
in the SBLA-010 R2 remediation. Every one of them carries the same two qualifiers, and
the second is unusual in being supported from inside this slice's own evidence set
rather than asserted:

- **§2.2 bar.** EMG amplitude is never a measurement of hypertrophy. No tier-4
  source in this pass may support a size claim.
- **Method fragility, measured.** G0274 states that standard bipolar surface EMG
  mischaracterises pectoralis major activity in common tasks. G0520 shows why:
  innervation-zone positions shift medially within the muscle during the bench
  press, and amplitude read over a moving innervation zone is not comparable.
  G0265 says in print that the bench press inclination literature is contradictory
  and that measurement artefact is the likely reason.

So the tier-4 evidence in this slice is internally contradictory by the admission
of the researchers who measured it most carefully, and the contradiction is not
resolvable from the retrieved data. That is recorded in the synthesis contradiction
map rather than resolved by preferring the study with the tidier result.

The three press-versus-fly activation comparisons illustrate it:

| Record | Comparison                                               | Reported direction                                                                      |
| ------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| G0042  | Barbell bench press vs dumbbell flyes at 6RM             | Higher pectoralis major activation in the press across most phases                      |
| G0077  | Barbell bench press, dumbbell press, dumbbell fly at 6RM | **No significant difference** in activation level; less relative time active in the fly |
| G0031  | Bench press vs dumbbell fly at 50 % 1RM                  | Per-exercise pectoralis values not in the retrievable abstract                          |

G0042 and G0077 disagree, both are abstract-only, both are small, and neither can
be preferred on the evidence retrieved. Under rule H2 the G0077 null is recorded as
"not enough information", not as equivalence.

**G1944 — the source recovered in the R2 remediation.** Arseneault, Roy and Sercia
(2021), twelve bench-press variations, n = 13 men, risk of bias `some concerns`,
applicability `partially direct`. It is the most portion-resolved bench-press source in
the pass and it carries four named defects. (a) Its design **crosses** inclination with
grip type and grip width and loads each of the twelve cells at that cell's own 12RM, so
no between-inclination contrast in it is an isolated inclination effect. (b) Its
analysed sample size is ambiguous: 13 were recruited, one withdrew, and the analysed n
is never restated. (c) Its normalisation reference is ambiguous — "the highest EMG value
obtained during the exercises **and/or** the maximum voluntary isometric contraction" —
so its percentages cannot be compared with MVIC-normalised studies. (d) It reports
pairwise significance only, with no per-contrast effect size, exact p-value, mean or
standard deviation, so no effect estimate can be taken from it. It also contradicts its
own Abstract for the clavicular head (§3.6). What it can carry is its **null**
statements about inclination within matched grips, and nothing else; it supports no size
claim and no index-Y claim.

### 2.5 Q1 — anatomy and function

Twenty-six included sources bear on the muscle itself. The strongest are cadaveric
or in vivo primary observations; two are tertiary reference chapters used only
where no primary source in the set reports the fact as its own observation.

**Regional differentiation is the best-supported finding in this entire pass.** It
is reported by five methods, in five independent groups, across three decades:

| Method                                  | Records                                                | What each shows                                                                  |
| --------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Measured moment arms (tendon excursion) | G0361, G0556, G0599                                    | Sub-regions of the pectoralis major have significantly different leverage        |
| Segmental and high-density surface EMG  | G0264, G0341, G0422, G0569, G0265                      | Regions activate differently and by task and direction                           |
| Shear-wave elastography                 | G0241, G0270, G0303                                    | Regions differ in passive stretch response and in activation-dependent stiffness |
| Cadaveric innervation                   | G0292, G0532, G0399, G0548, G0554, G0262, G0318, G0388 | Multiple separate nerve entry points and territories                             |
| Exercise EMG with portion resolution    | G0090, G0103, G0288, G0348, G0381                      | Bench angle and grip shift the balance between heads                             |

Risk of bias for the cadaveric work is `not-applicable` in the trial sense; its
real limitations are specimen number (eight to forty), age (one series has a mean
donor age of 57.9 years), fixation, and single-ancestry sampling in one series.
Applicability is `partially-direct`: the target user is a living lifter, and
embalmed tissue is not.

## 3. Sources with a specific, named defect

### 3.1 G0132 — duplicated pectoralis values

The abstract and the results section of the retrieved full text both print the
pectoralis major pre and post values for the bench press group and for the push-up
group as identical: 17.0 (SD 2.8) mm to 20.8 (SD 4.8) mm in both arms. Two
independently randomised groups cannot plausibly produce identical means _and_
identical standard deviations at both timepoints. At least one printed pair is a
transcription error in the published article.

Consequence: the **between-group** pectoralis comparison from this trial is not
usable as a numeric estimate, and this pass does not use it as one. The within-arm
direction survives, because both arms are reported as increasing with p < 0.01 and
the triceps and biceps values differ between arms as one would expect. Risk of bias
is set to `high` on this basis alone, before the nine-per-arm sample size and the
48-hour post-test are considered.

### 3.2 G0521 — an unread correction

Crossref records an erratum (DOI `10.1111/joa.13417`, 2021-05-17) updating this
systematic review of glenohumeral moment arms. The erratum's content could not be
retrieved: the publisher platform returned HTTP 403 to this client and no
workaround was attempted. Under eligibility plan §4.4 a corrected source must be
extracted from the corrected values. Since the correction could not be read,
**no number from this review is carried into any claim**, and it is used only as a
signpost that measured moment-arm data exist.

### 3.3 G0288 — implausible effect sizes

The retrievable abstract reports an effect-size range of d = 2.78 to 7.80 for a
between-condition activation difference in ten participants. Standardised effects
of that magnitude for an EMG amplitude comparison are not credible as stable
population estimates. The direction (clavicular head more excited on an incline) is
carried; the magnitudes are not.

### 3.4 Two retracted records, found and blocked

The contradiction stratum retrieved two records carrying the PubMed publication
type `Retracted Publication`: PMID 31188644 and PMID 30779716, both on resistance
training volume. Both are blocked from supporting a live claim under §9.7 and are
recorded in the contradiction map. Neither was going to support a claim in this
slice, but finding them is the point of running the check.

### 3.5 Preprint handling

One included source is a preprint (G0798, Research Square, CC BY 4.0, posted
2024-07-10). Under the frozen SE-U1 decision it is recorded with
`publication.stage: preprint` and `publication.status: current`, and under
SBLA-008's hard limit it can never be the sole support for a published claim. It
is not the sole support for anything drafted here.

### 3.6 G1944 — a conclusion its own table contradicts

G1944's Abstract concludes that "the bench press exercise performed with a wide
pronation grip at 0° can maximize the activation of the three heads of the PM". Its own
Table 3 lists that exact position, HPW, among the positions of **minimum** activation
for the **clavicular** head, and its Practical Application point 3 states that in the
horizontal bench press "a closer grip leads to a better recruitment" of that head. The
Abstract conclusion is therefore false of the paper for one of the three heads it claims
to maximise.

Table 3 and the Results text are the primary record and are what the extraction relies
on. The Abstract conclusion, and the bodybuilding programming advice in Practical
Application points 6 and 7 that rests on it, are recorded under
`extraction.authorsInterpretation` as author interpretation and are not extracted as
findings. This is the same handling given to G1903's Featured Application in §3.3 and
contradiction-map rows C-12, C-14 and C-15, and for the same reason: a source that
contradicts itself does not get to pick which half this project quotes.

## 4. Certainty, assigned per claim rather than per source

§9.4 requires certainty per claim. The grades this appraisal supports, and the
reason for each ceiling:

| Claim family                                                                 | Ceiling                      | Why it cannot go higher                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pectoralis major attachments and portions                                    | established-descriptive-fact | Multiple primary cadaveric observations plus an authoritative reference; §9.4 reserves this grade for exactly this                                                                                                                                       |
| Pectoralis major innervation                                                 | moderate                     | Primary series disagree with the tertiary two-nerve account and with each other on branch count                                                                                                                                                          |
| Pectoralis major contributes to shoulder adduction and horizontal adduction  | high                         | Measured moment arms plus activation, consistent across methods                                                                                                                                                                                          |
| Regional differentiation within the muscle                                   | moderate                     | Five methods agree on the phenomenon; magnitudes are not comparable across methods, and samples are small                                                                                                                                                |
| Bench press changes pectoralis major thickness                               | low                          | Three usable trials, one with a data-integrity defect, no control arm in another, small samples                                                                                                                                                          |
| A machine fly changes pectoralis major thickness                             | low                          | One trial, one measurement site, allocation not detailed                                                                                                                                                                                                 |
| Bench press versus cable fly for hypertrophy                                 | **no claim possible**        | Zero direct studies; absence is reported as absence                                                                                                                                                                                                      |
| Cable cross-over loads the shoulder more than the bench press at matched %BW | low                          | One study, twenty participants, unreported pulley height, %BW loading, simplified shoulder model                                                                                                                                                         |
| Pectoralis major rupture occurs during the bench press                       | low                          | Case reports and a case-series meta-analysis; no denominator, so no rate                                                                                                                                                                                 |
| Pectoralis major rupture occurs on a fly machine                             | very-low                     | **One** German-language case report, abstract-only, machine-assisted translation with no second check. It now has its own claim record with its own scope, rather than being attributed to the bench-press rupture claim                                 |
| Bench inclination shifts activation toward the clavicular portion            | low                          | Re-derived. The sternocostal decrease is consistent; the clavicular response is not. A peak near 30° with reduced performance above 45°, a whole-contraction null, and a pooled clavicular null (p = 0.81, I² = 92.6 %) all contradict a monotonic shift |
| Bench press versus a fly-family exercise for activation                      | very-low                     | Four primary comparisons, three of them null, none of them index Y, one un-normalised; the pooled estimates carry I² of 94.9 % and 98 %                                                                                                                  |

No claim in this slice reaches `high` on a comparative training question, and none
uses the word "better".

## 5. Applicability to the site's target user

The target user is a serious lifter or coach (§3.1, §3.2), not a patient.

- **Direct**: the tier-4 bench press activation studies in resistance-trained men,
  and the measurement-method sources.
- **Partially direct**: the tier-1 trials (untrained or recreationally active
  participants, one with once-weekly training), the cadaveric anatomy (embalmed
  tissue, older donors), and G0034 (loads set by body weight, not by 1RM).
- **Indirect**: G0052 (soccer players, programme-level), the modelling sources, the
  harms sources (post-operative or case-level populations), and everything read
  through machine translation.

Two sampling gaps are worth naming because they cut across the set. Most included
exercise studies are male-only; the regional-activation study that is strongest on
portion differentiation (G0264) is female-only, and the elastography study (G0270)
reports that age and sex change pectoralis stiffness. So the regional findings are
established in samples that barely overlap, and no included source establishes them
across sexes in the same protocol.

## 6. Limitations of this appraisal

- **L-A1.** Single appraiser, no independent second rater, no formal tool applied.
  Risk of bias here is a structured judgement against the design-specific criteria
  in the eligibility plan, not a RoB 2 or ROBINS-I score. It is weaker than a
  two-rater tool-based assessment and is not presented as equivalent.
- **L-A2.** Forty-six of the 89 included sources were appraised from their abstracts.
  For those, "risk of bias" is bounded by what an abstract discloses, which is
  systematically less than the full text would show. The first pass reported fifty of 76
  while also holding two sources at `metadata-only`; after the R1 acquisition ladder was
  run and recorded, nine sources moved to `full-text-open` and none remains at
  `metadata-only`.
- **L-A3.** Funding and conflict-of-interest statements were read for the full-text
  sources and recorded inside `reportedFacts` where present. They were not
  transcribed into the structured `funding` and `conflicts` fields for every
  source, and those fields are `null` meaning _not extracted_, not _absent_.
- **L-A4.** _Closed by the R1 remediation._ The dissertation this appraisal named as
  the one study that would most change it (G1016, "Electromyographical analysis of the
  pectoralis major muscle during various chest exercises") **was obtained and read**:
  21,237,276 bytes from the MINDS@UW institutional repository, sha256
  `81a2a094349a0fccd822247cf2d36b08449bffe2035d30869521049c2dc6a950`, no
  authentication and no access control circumvented. It does report a cable condition,
  and it does not change the index-Y absence. Its bent-forward cable crossover is
  described in the Methods as performed with the arms at chest height and parallel to the
  floor, but the **pulley origin height is never stated**, and Figure 2 depicts handles
  above shoulder height with a downward-and-inward path. Under the frozen §3.2 attribute
  table the pulley origin is a defining attribute of index Y and high-to-low crossover is
  a named distinct condition, so this is a related condition. It is appraised at **high**
  risk of bias for three reasons recorded on its extraction: EMG normalised to the
  barbell bench press itself rather than to an MVIC, so no condition has an independent
  scale; concentric and eccentric phases averaged together; and the bodyweight conditions
  not load-matched to the 80 % 1RM used elsewhere. It is grey literature and may never be
  sole support for a published claim.
- **L-A5.** The twelve sources added by the R1 remediation were appraised in this round.
  Seven were appraised from full text and five from abstracts, and each carries its named
  defects on its extraction record: the 2023 meta-analysis for extreme heterogeneity
  (I² 87.6–98 %), implausibly large pooled standardised mean differences consistent with
  imputed standard deviations, and an internal contradiction between its Table 3 and its
  own Featured Application; the beginners' bench-angle study for fixing load at 50 % of
  the 0° 1RM without re-determining it per angle, so relative intensity varies with angle;
  and the push-up-versus-bench-press comparison for running both conditions to task
  failure, which confounds activation with repetitions completed.

## 7. What the R1 bounded remediation changed in this appraisal

| Finding  | Change                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C-1**  | §6 L-A4 is closed: the dissertation named as the one study that would most change this appraisal was obtained and read, and it is appraised at high risk of bias with its three named defects.                                                       |
| **I-1**  | The evidence-packet link in the header is corrected to the committed lowercase filename.                                                                                                                                                             |
| **I-7**  | §4 now reads "three usable trials" for the bench-press thickness ceiling, matching the §2.1 table that already listed three. The claim record, the synthesis and both drafts now agree.                                                              |
| **I-11** | §4 splits the single rupture row into a bench-press row and a fly-machine row, because the fly-machine statement rests on one abstract-only machine-translated German case report and now has its own claim record with its own scope and certainty. |
| **I-12** | §6 L-A2 is recomputed from the completed acquisition ladder: forty-six of 88 abstract-only, none at `metadata-only`.                                                                                                                                 |
| **I-13** | §4 gains an explicit bench-inclination ceiling of `low`, with the three contradicting results that set it.                                                                                                                                           |
| **M-3**  | The two StatPearls chapters are corrected from `metadata-only` to `full-text-open`; their facts always carried basis `full-text`, which was the internal contradiction M-3 identified.                                                               |
| **M-4**  | The three `null` `extraction.language` fields are completed.                                                                                                                                                                                         |
| **new**  | §6 gains **L-A5**, appraising the twelve sources the remediation added and naming the defect on each.                                                                                                                                                |

## 8. What the SBLA-010 R2 bounded remediation changed in this appraisal

Against [`reviews/evidence/SBLA-009-r2.md`](../../reviews/evidence/SBLA-009-r2.md) at
`f67b6dff72f47bb94768e85f43f8cb4ed0fc8d46` (FAIL — 0 Critical, 4 Important, 13 Minor).

| Finding            | Change                                                                                                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M-3**            | The header said "Companions, all at version **1.0.0**" while every companion was at 2.0.0 and this artifact's own version was 2.0.0. Corrected, with the evidence packet's missing version field stated rather than glossed.                                                                  |
| **N-1**            | §2.4 appraises **G1944**, the CC BY source the review proved had been recorded as unobtainable, and names its four defects: a crossed design that confounds inclination with grip and load, an ambiguous analysed sample size, an ambiguous normalisation reference, and no effect estimates. |
| **new**            | New §3.6 records that G1944's Abstract conclusion is contradicted by its own Table 3 for the clavicular head, and gives it the same handling as G1903's Featured Application.                                                                                                                 |
| **M-3**            | §0 and §1 carried first-pass counts — 76 included sources, 1,361 retrievals, 1,109 unique records — after the R1 remediation had changed all three. They now read 89 included sources, 2,343 retrieval events and 1,956 unique records, and §0 states the count's history.                    |
| **I-12 follow-on** | §6 L-A2 is recomputed to forty-six of **89** included sources appraised from their abstracts. The R1 row in §7 recording "forty-six of 88" is left as the historical record of that round.                                                                                                    |

**No risk-of-bias or applicability grade was raised in this round.** G1944 enters at
`some concerns` / `partially direct` and is admitted only for its null statements.
