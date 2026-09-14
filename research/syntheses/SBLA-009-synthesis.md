# Evidence synthesis — SBLA-009

- Task: SBLA-009 (§18 queue row; §14 Phase 1 Task 1.2, `synthesize` stage of the §9.8 pipeline)
- Role: Claude Research (account A) — evidence lead, not the independent reviewer
- Base commit: `8ca59e850beb0770554074d474a3ff3a9e16710a`
- Date: 2026-09-13; revised 2026-09-13 in the R1 bounded remediation
- Artifact version: 2.0.0
- Revision: R1 bounded remediation against
  [`reviews/evidence/SBLA-009-r1.md`](../../reviews/evidence/SBLA-009-r1.md) at
  `8154f1167062403a96ee5d6ec0fc63bd50ebfd17`. Every change is listed in §8.
- Companions, all at version 2.0.0:
  [`research/searches/SBLA-009-search-receipts.json`](../searches/SBLA-009-search-receipts.json),
  [`research/screening/SBLA-009-screening-flow.json`](../screening/SBLA-009-screening-flow.json),
  [`research/extractions/SBLA-009-source-extractions.json`](../extractions/SBLA-009-source-extractions.json),
  [`research/appraisals/SBLA-009-appraisals.md`](../appraisals/SBLA-009-appraisals.md),
  [`research/packets/sbla-009-evidence-packet.json`](../packets/sbla-009-evidence-packet.json),
  [`content-drafts/syntheses/SBLA-009-atomic-claims.json`](../../content-drafts/syntheses/SBLA-009-atomic-claims.json)

## 0. The headline, stated first

**Q2 has no answer, and this synthesis does not manufacture one.**

The comparative question this slice was built around — does a programme using the
barbell flat bench press differ from one using the bilateral standing cable fly at
shoulder height in pectoralis major hypertrophy — cannot be answered from the
retrieved evidence, because **no study of the index cable fly was retrieved by any
route this project ran**. Not a weak study. Not an indirect one. None.

That absence now rests on opened documents rather than on an assumption. The R1 review
established that the single record this pass had itself called the most directly
relevant press-versus-fly source had never been opened. It has been: G1016 was obtained
from its institutional repository and read in full, and its cable condition is a
bent-forward crossover whose pulley origin height the Methods do not state and whose
Figure 2 depicts a high-to-low path, so the frozen §3.2 attribute table makes it a
related condition and not index Y. Independent corroboration now sits alongside the
project's own search: a 2023 systematic review and meta-analysis of pectoralis major
EMG in the bench press and other pectoral exercises searched PubMed/MEDLINE, SPORTDiscus
and Web of Science to March 2023, hand-screened every selected article's reference list,
and included 23 studies whose exercise-type comparators are push-ups, dumbbell exercises,
elastic resistance and a chest press. No cable fly appears anywhere in it.

The scope file anticipated this in §4.3 of the search strategy: "Exercise Y as
defined may have almost no directly indexed PubMed literature." That prediction is
now a result, and under the frozen U2/EU2 decision the correct response is to
report the absence, not to widen Y and call a pec deck a cable fly.

What the pass did find is a usable mechanics comparison between the index press and
a cable cross-over, a set of activation comparisons that disagree with each other
for a reason their own authors identify, one trial of a machine fly against no
training, and an unusually well-corroborated finding about the muscle itself.

## 1. Q1 — the pectoralis major

### 1.1 Direct evidence: structure

The muscle's gross attachments are described consistently by an authoritative
reference chapter (G0244) and are consistent with the background description in a
primary cadaveric paper (G0292, attributed there to its own reference and recorded
as such, not as that paper's observation): origin from the anterior surface of the
medial half of the clavicle, the anterior surface of the sternum, the upper costal
cartilages, and the aponeurosis of the external oblique; insertion at the lateral
lip of the intertubercular sulcus of the humerus.

The humeral end is where primary measurement exists and where the textbook account
is wrong in a specific way. G0281 imaged and then sectioned fourteen fresh-frozen
upper extremities and found the footprint to be 75 (SD 9) mm superior-inferior and
7 (SD 1) mm medial-lateral, with the clavicular head tendon shorter than the
sternal head tendon (19 (SD 8) mm versus 38 (SD 8) mm medial-lateral superiorly).
In **all fourteen specimens** the enthesis was unilaminar with abundant
fibrocartilage; ultrasound, MRI and histology each failed to find the layers that
the literature routinely describes. G0236 independently records that the layered
description "remains controversial", and G0356 records that "there is little
consensus regarding the complex musculotendinous architecture" of this muscle.

Variation is common rather than exceptional: G0292 found the textbook configuration
in 63.75 % of 80 specimens, with a separate clavicular portion the most frequent
departure.

### 1.2 Direct evidence: innervation, and a disagreement

The tertiary account is clean: lateral pectoral nerve to the clavicular head,
medial pectoral nerve to the sternocostal head (G0244); medial pectoral nerve from
the medial cord, C8–T1, supplying the lower half of the muscle (G0505).

The primary series are messier and they do not agree with it or fully with each
other:

- G0292 dissected 80 specimens from 40 cadavers (22 male, 18 female; mean donor age
  69.3 ± 11.8 years, range 48–90) and reports the muscle as **mainly innervated by the
  lateral pectoral nerve**. Within that series, **five randomly selected muscles** were
  examined by Sihler whole-mount nerve staining, and a contribution from the
  **intercostal nerves** was confirmed in every one of those five. Eighty is the
  gross-dissection total; the intercostal finding rests on the five stained muscles, and
  the earlier draft of this synthesis attributed it to all eighty.
- G0399 found, in all 29 dissections, that the pectoral nerves exit at trunk level
  as **three** distinct nerves, naming a superior pectoral nerve to the lateral
  clavicular portion.
- G0548 found **three constant branches** in 26 plexuses.
- G0621 reports the territory account proportionally rather than categorically: the
  medial pectoral nerve passes through pectoralis minor in 62 % of people and
  around it in 38 %, supplying the lower half or two thirds; the lateral nerve
  supplies the proximal third or more. (The abstract attributes those proportions
  to earlier work, so they are carried as reported-from.)
- G0532 counts multiple separate nerve entry points into the muscle rather than one.

The synthesis position is therefore: the two-nerve, one-nerve-per-head account is a
useful simplification and is not what the primary dissection literature reports.
That is why the innervation claim is graded `moderate` and carries a variation
qualifier, rather than `established-descriptive-fact`.

### 1.3 Direct evidence: function

Measured leverage puts the pectoralis major among the principal adductors at the
glenohumeral joint: G0599, using tendon excursion in cadaveric specimens across
four motions, found the largest depressor (adductor) moment arms in the pectoralis
major, latissimus dorsi and teres major. G0361 and G0556 measured 18 sub-regions in
eight specimens and found **significant differences in moment arm between
sub-regions of the pectoralis major** (p < 0.01). G0556 also shows that
internal-rotation leverage is dominated by the inferior subscapularis (peaks of
24.4–27.0 mm), which is why "the pectoralis major internally rotates the humerus"
is carried with a qualifier rather than as a headline action.

### 1.4 The best-corroborated finding in this pass: regional differentiation

Five independent method families, five research groups, three decades, one
conclusion: the pectoralis major does not behave as a single unit.

- **Leverage.** Sub-regions have significantly different moment arms (G0361, G0556).
- **Activation.** High-density surface EMG in **twenty-nine** healthy young females,
  across two independent experiments, found the
  middle sternocostal region activating **12–108 % more** than the clavicular and
  superior sternocostal regions during extension, adduction with external rotation,
  and high-elevation internal rotation, and 7–22 % more than the superior
  sternocostal region in high-elevation adduction (G0264). Segmental EMG found
  heterogeneous activity across the breadth of the muscle during ballistic adduction
  (G0341), independent segmental control during isometric actions (G0422), and
  segment coordination that tracks movement direction, line of action and moment arm
  (G0569).
- **Tissue mechanics.** The passive stretch response is region-specific in vivo
  (G0241); activation-dependent stiffness differs between the clavicular and
  sternocostal regions and changes with age and sex (G0270); material properties
  differ between the fibre regions (G0303).
- **Innervation.** Multiple separate nerve entry points and territories (§1.2).
- **Exercise.** Bench inclination reverses which head is more excited (G0103);
  clavicular activation rises with bench angle (G0348); grip width and forearm
  rotation shift the balance between portions (G0381); regional excitation differs
  across bench press ranges of motion at four sampled sites (G0090).

Certainty `moderate`, not `high`: every individual sample is small, the magnitudes
are not comparable across methods, and the strongest activation study is
female-only while most of the exercise studies are male-only.

### 1.5 Absent for Q1

- **No Terminologia Anatomica anchor.** FIPAT was unreachable again on 2026-09-13
  (connection failure). Unresolved item U1 stands; the muscle draft records the
  absence rather than substituting model memory for official nomenclature.
- **No architectural parameters extracted.** Fascicle length, pennation angle and
  physiological cross-sectional area for the pectoralis major were not obtained in
  this pass. G0356 modelled the architecture in three dimensions but its numbers
  were not retrievable.

## 2. Q2 — barbell flat bench press versus bilateral standing cable fly

### 2.1 Direct evidence: none

Zero records. The strata designed to find it:

| Stratum                                 | Count | Fly-family records that reached inclusion                   |
| --------------------------------------- | ----: | ----------------------------------------------------------- |
| PubMed 30-phrase fly family (N-RS1)     |    77 | 0 studies of a cable fly as a trained or measured condition |
| Europe PMC 26-phrase fly family         |    51 | 0                                                           |
| Europe PMC fly family, preprints only   |     1 | 0                                                           |
| OpenAlex quoted phrase "cable fly"      |     4 | 0                                                           |
| ClinicalTrials.gov intervention+outcome |   159 | 0 registrations manipulating any fly-family exercise        |

Of the 77 PubMed fly-family records, 25 are materials-science or computer-science
papers retrieved because PubMed proximity distance 0 matches adjacent words in
either order, so `"machine fly"[tiab:~0]` matches "on-the-fly machine learning".
Three are patents for a "chest fly box system". That is the shape of this
literature: the index exercise is common in gyms and close to absent from indexed
research.

**Reported as absence, per anti-cherry-picking rule 7: absence of evidence is not
evidence of no difference.** Nothing here says the two exercises produce the same
hypertrophy. It says nobody has measured it.

### 2.2 Direct-ish evidence: one mechanics comparison

G0034 is the only retrieved study measuring the index press and a cable fly-family
condition in the same twenty participants with the same instrumentation.

| Exercise             | Max absolute shoulder moment, Nm/kg, at 15 % BW | at 30 % BW           |
| -------------------- | ----------------------------------------------- | -------------------- |
| Flat bench press     | 0.442 (SD 0.046)                                | 0.760 (SD 0.079)     |
| Incline bench press  | 0.418 (SD 0.041)                                | 0.712 (SD 0.080)     |
| **Cable cross-over** | **0.650 (SD 0.113)**                            | **1.026 (SD 0.192)** |
| Cable pull-over      | 0.611 (SD 0.086)                                | 1.09 (SD 0.155)      |

Both cable exercises produced significantly larger maximum shoulder moments than
both bench press exercises at both loads (p < 0.0125). Flat and incline bench press
did not differ from each other; the two cable exercises did not differ from each
other. Elbow flexion–extension range of motion was far larger in the press
(79.5 (SD 6.2)° flat at 15 % BW) than in the cross-over (21.8 (SD 10.9)°), and the
elbow moment reversed sign between them.

What this supports: at matched percentages of body weight, a cable cross-over
imposes a **larger and more variable shoulder moment** and a **much smaller elbow
excursion** than a flat barbell bench press. What it does not support: anything
about muscle size, muscle force, or which exercise to choose. Its cable cross-over
is a related condition with an unreported pulley height, and the load was set by
body weight rather than by 1RM, so relative intensity is unknown.

### 2.3 Related-condition evidence: what the fly family can show

- **A machine fly increases pectoralis major thickness against no training.**
  G0098: 8 weeks, 5 × 10–12 at 10–12RM, three times a week, n = 81 across three
  arms, ultrasound with in-study ICC 0.966–0.961. Strength group versus control
  d = 0.533 (right, p = 0.029) and d = 0.721 (left, p = 0.002).
- **In the same trial, 15 minutes a day of static stretching produced a
  statistically indistinguishable thickness change** (stretching versus strength:
  right p = 0.983 d = 0.036, left p = 0.905 d = 0.087). This is reported with equal
  prominence. It does not mean stretching and training are equivalent; it means one
  81-participant trial could not separate them on this measure.
- **A dumbbell fly activates the clavicular portion strongly** (G0392, G0391),
  though with 1990s two-channel instrumentation and no numeric values in the
  retrievable text.
- **A pec deck machine's cam geometry changes the torque demand across the range**
  (G0970, Portuguese, machine-translated, modelled not measured).

### 2.4 Related-condition evidence: what the press family can show

- **Bench press training changes pectoralis major thickness, non-uniformly.**
  G0118: eight weeks, once weekly, n = 30 measured; the only between-group
  difference of three measurement sites was at the second intercostal space,
  favouring the incline group over the horizontal group by 0.62 cm (95 % CI 0.23 to
  1.0, p = 0.003).
- **Low-load bench press training increases pectoralis major thickness.** G0132,
  8 weeks at 40 % 1RM to failure; both arms increased (p < 0.01), with no
  between-group difference against a load-matched push-up. The pectoralis numbers in
  that paper are printed identically for both arms, which cannot be right; see
  appraisal §3.1. Direction only.
- **Bench angle, grip width and range of motion change which part of the muscle is
  loaded**, not merely how much (G0103, G0348, G0288, G0381, G0090).
- **The external demand is not constant through a repetition.** The shoulder moment
  arm of the bar decreases continuously through the ascent, and the elbow moment arm
  reaches its minimum at the sticking region (G0436).

### 2.5 Indirect evidence: single-joint versus multi-joint programmes

G0052 is the closest longitudinal analogue and is indirect on every axis. Eight
weeks, volume-equated, 36 amateur soccer players: a programme of only single-joint
exercises (chest work: pec deck machine and incline dumbbell fly) against a
programme of only multi-joint exercises (chest work: bench press and incline bench
press). 1RM bench press rose 8.1 % versus 10.9 %, significantly favouring the
multi-joint programme (p < 0.05). Body composition by DEXA did not differ.

Three reasons this cannot be read as "presses build more chest than flies": the
outcome is the exercise the multi-joint group trained and the single-joint group did
not; no pectoralis-specific size measure was taken; and the contrast is whole
programmes differing in every exercise, not two chest exercises. G0179 is carried
specifically to hold the task-specificity qualifier in place.

### 2.6 Sensitivity analysis, pre-specified and empty

The frozen U3/EU1 decision requires within-participant contralateral-limb designs to
be extracted in full and reported as a **separately labelled sensitivity analysis**,
never pooled with between-participant contrasts.

**The sensitivity analysis contains zero eligible studies.** No retrieved record
trains one limb with the index press and the other with a fly-family condition.
Every included tier-1 study uses a between-participant contrast. One record that
would have entered it — a within-subject pec deck volume comparison (G0012) — is
held at `awaiting-full-text` because the eligibility plan forbids taking a tier-1
datum from an abstract.

The pre-specification is kept in the record anyway: it was fixed before results
were seen, and an empty pre-specified analysis is a result.

### 2.7 Secondary question: regional hypertrophy

Under the frozen U4/EU3 decision, regional clavicular-versus-sternocostal
hypertrophy is a separate secondary question and does not upgrade the primary
whole-muscle outcome.

The retrieved evidence is thin and it does not line up cleanly with the activation
evidence:

- **Activation** says bench inclination reverses which head is more excited (G0103),
  and that clavicular activation rises with bench angle (G0348, G0288).
- **Hypertrophy** says one of three measurement sites differed after eight weeks of
  incline versus horizontal bench press, at the upper site, in the direction the
  activation evidence predicts (G0118) — in ten participants per group, once weekly.
- **Everything else is `awaiting-full-text`** (G0012, G0110, G0124).

So there is a single small, site-specific tier-1 result in the direction the tier-4
evidence predicts, and that is all. The mechanism story is more developed than the
outcome evidence, which is exactly the situation §2.2 warns about.

## 3. Contradiction map

Assembled from the deliberate contradiction search (stratum N-RS6, 211 records) and
from disagreements found inside the included set, not after a conclusion had formed.

| #    | Contradiction                                                                                                                                                                                                                                            | Records                                    | How it is handled                                                                                                                                                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-1  | Press versus fly activation: higher in the press, versus no significant difference                                                                                                                                                                       | G0042 vs G0077                             | Both carried. Neither preferred. The null is recorded as "not enough information" under rule H2                                                                                        |
| C-2  | The bench press inclination EMG literature is contradictory, by the admission of the group that measured it best                                                                                                                                         | G0265, G0520, G0274                        | Treated as a measurement-validity problem, not an effect. All tier-4 claims carry the surface-EMG qualifier                                                                            |
| C-3  | The pectoralis major enthesis: bilaminar in the standard description, unilaminar in all 14 imaged-and-sectioned specimens                                                                                                                                | G0281 vs G0236, G0244                      | The primary imaging-plus-histology finding is reported, with the disagreement stated                                                                                                   |
| C-4  | Innervation: two nerves, one per head, versus three trunk-level nerves, intercostal contribution, and 62/38 % variation                                                                                                                                  | G0244, G0505 vs G0292, G0399, G0548, G0621 | The primary series win on grading; the claim is `moderate` with a variation qualifier                                                                                                  |
| C-5  | Grip width changes pectoralis activation (G0381) versus no significant grip-width effect in elite athletes (G0135)                                                                                                                                       | G0381 vs G0135                             | Both carried. Populations and protocols differ (isometric holds versus 6RM sets in national-level competitors)                                                                         |
| C-6  | Eight weeks of machine-fly training and eight weeks of daily static stretching produced indistinguishable thickness change                                                                                                                               | G0098 (internal)                           | Reported at full prominence; it constrains how confidently any fly-family hypertrophy claim can be stated                                                                              |
| C-7  | Two retracted training-volume papers were retrieved by the contradiction stratum                                                                                                                                                                         | PMID 31188644, 30779716                    | Blocked from supporting a live claim under §9.7; recorded here so the block is visible                                                                                                 |
| C-8  | A systematic review of glenohumeral moment arms carries an erratum that could not be read                                                                                                                                                                | G0521                                      | No number from it is used anywhere                                                                                                                                                     |
| C-9  | A tier-1 trial prints identical pectoralis values for both randomised arms                                                                                                                                                                               | G0132                                      | Between-group estimate discarded; risk of bias set to high                                                                                                                             |
| C-10 | Bench inclination and the clavicular portion: a monotonic shift toward the clavicular head, versus a peak near 30° with reduced pectoralis performance above 45°, versus no whole-contraction difference at all, versus no significant pooled difference | G0103, G0348 vs G1881, G1872, G1903        | Claim 14 re-derived. The monotonic wording is withdrawn, certainty lowered from moderate to low, direction changed to mixed, and all four contradicting sources are cited on the claim |
| C-11 | Press versus fly activation, enlarged: one un-normalised comparison favours the press, three comparisons find no significant difference, and a meta-analysis finds a sternal difference with I² = 98 % and no clavicular difference                      | G0042 vs G0077, G1896, G1016, G1903        | Supersedes C-1. All five carried, none preferred. Certainty held at very-low; the enlarged base did not raise it                                                                       |
| C-12 | The 2023 meta-analysis contradicts itself on the decline contrast: its Table 3 and Results report no significant decline effect for either portion, while its Featured Application and Abstract conclusion assert a directional decline effect           | G1903 (internal)                           | The Table and Results are the primary record and are what the extraction relies on. The inconsistency is recorded as a quality defect of the source, not smoothed                      |
| C-13 | Exercise order changes fly activation by roughly 19 percentage points of MVIC, which destabilises any single press-versus-fly activation comparison                                                                                                      | G0062 (internal)                           | Carried as a qualifier on claim 21. It is the reason no press-versus-fly activation difference is presented as a property of the exercises                                             |

## 4. Publication-bias probe

- **159 ClinicalTrials.gov registrations** matched the intervention-and-outcome
  Essie expression. None registers a fly-family exercise as a manipulated condition.
  There is therefore no registered-but-unpublished cable fly trial to suspect: the
  gap is upstream of publication bias, at the point where nobody has run the study.
- **Preprint routes** returned one fly-family preprint on Europe PMC and nothing
  relevant on SportRxiv or the frozen OSF archive (377 records, newest 2021-08-24).
- **Two retracted papers** were found and blocked (C-7).

## 5. Heterogeneity and why nothing was pooled

Nothing in this synthesis is pooled, and the reasons are structural rather than
statistical:

- The tier-1 trials differ in training status (untrained, recreationally active),
  frequency (once to three times weekly), load (40 % 1RM to 10–12RM), duration
  (4 to 8 weeks), measurement instrument and measurement site.
- Tier-1 outcomes are measured as muscle thickness at one site, muscle thickness at
  three intercostal sites, and cross-sectional area. The repository's own
  measurement sources show these are not interchangeable: imaging plane changes the
  cross-sectional area obtained (G0674), volume and cross-sectional area give
  different size–strength relationships (G0108), and operator experience is a
  measurable error source in panoramic ultrasound (G0684).
- Tier-4 outcomes are normalised to different MVIC references, over electrode sites
  that move relative to the innervation zone during the movement being measured
  (G0520).

§9.8 step 7 forbids averaging incompatible outcomes casually. Two or three small
trials measuring different things in different people is not a meta-analysis.

## 6. What a reader may take from this slice

Stated plainly, because a synthesis that cannot be summarised is not finished:

1. The pectoralis major is a regionally differentiated muscle, and that is the
   best-supported statement in this pass.
2. It is a principal adductor and horizontal adductor at the glenohumeral joint.
3. Chest resistance training increases its thickness; the **three** usable trials say
   so at low certainty — a machine fly against no training, a horizontal-versus-incline
   bench press trial, and a low-load bench press versus push-up trial whose between-group
   numbers are discarded for a data-integrity defect, leaving only its direction.
4. A cable cross-over loads the shoulder joint more, and the elbow far less, than a
   flat barbell bench press at matched percentages of body weight.
5. **Whether a bench press or a cable fly produces more pectoralis major growth is
   unknown and untested.** Anyone who tells a lifter otherwise is not citing a study
   of the cable fly, because there isn't one.

## 7. Limitations of this synthesis

- **L-1. The search was not exhaustive.** Route-level composites returned 11,765
  PubMed records across S1–S4 alone; the pre-specified retrieval strata brought 911
  of them into screening in the first pass. The R1 remediation added two strata, eight
  non-English probes, backward and forward citation chasing and four targeted retrievals,
  taking the screened set from 1,109 to **1,956** unique records. The difference between
  a composite count and a screened set is still a real recall gap, and the chasing itself
  is bounded: forward chasing is truncated at 200 citing works per seed, and a
  pre-specified relevance expression reduced 3,479 chased works to 841 before screening.
  Both residuals are quantified in the search receipts. This is a prototype of the
  pipeline, not a systematic review.
- **L-2. Cochrane CENTRAL was not searched.** No subscription or Search Manager
  session exists for this project. Trial coverage rests on Europe PMC,
  ClinicalTrials.gov and OpenAlex.
- **L-3. Ten eligible tier-1 records are `awaiting-full-text`**, because the
  eligibility plan forbids taking a tier-1 hypertrophy datum from an abstract and no
  lawful full text was obtained. If those were read, the tier-1 picture could change
  materially. They are listed by record ID in the extraction artifact.
- **L-4. Forty-six of 88 included sources were read as abstracts only.** Their facts
  are bounded by what an abstract discloses. The first pass reported fifty of 76 while
  also holding two sources at `metadata-only`, which understated the shortfall; the
  acquisition ladder run in the remediation moved nine sources up to `full-text-open`
  and left no source at `metadata-only`.
- **L-5. Publisher edge blocks.** Wiley, Elsevier, ScienceDirect, MDPI's PDF
  endpoint and the NATA platform returned HTTP 403 or interstitial pages to this
  client. No workaround was attempted, and no Cochrane URL was reached by
  substituting a user agent.
- **L-6. Funding and conflict fields are not systematically populated.** `null` in
  those fields means not extracted, not absent.
- **L-7. Two non-English sources were read through machine-assisted translation with
  no second independent check**, so neither can carry a decision-critical prose claim
  alone. A third, the Portuguese bench-press-versus-machine-fly comparison added by the
  remediation, needed no machine translation: it carries an authorised English abstract
  published alongside the Portuguese text, which is step 1 of the ladder. Non-English
  records that could not be obtained at all remain in the awaiting-full-text register
  with their dated ladders.
- **L-8. Double screening was not performed as specified.** The eligibility plan
  requires re-screening 20 % of stage-1 and 100 % of stage-3 records on a separate
  pass on a separate day. This pass ran in a single session on a single day, so the
  second pass was neither blind nor separated. Assumption EA2 already records that a
  single screener is weaker than two; this deviation makes it weaker still.
- **L-9. Search-syntax defects were found in the governing strategy and not fixed
  here.** `"machine fly"[tiab:~0]` retrieves "on-the-fly machine learning"; Europe
  PMC supports a proximity operator that E1 does not use. Both are recorded in the
  search receipts and routed to the owning role, because the SBLA-008 strategy file
  is outside this task's claimed paths.
- **L-10. Single analyst, no independent verification of any extracted number** until
  the SBLA-010 citation-entailment audit runs.
- **L-11. Screening of the 848 records added by the remediation used a two-pass
  method, and the first pass was a rule set rather than 756 individual judgements.**
  A written, deterministic, ordered rule set over title and abstract terminated 756
  records; the 93 it did not terminate were adjudicated individually against the
  title-stated manipulated variable. The rule set can only exclude, so a
  misclassification inside it is an over-exclusion — a recall cost, not a false
  inclusion that could inflate a claim. Abstracts were obtainable for 541 of the 848,
  so 307 were screened on title alone, which is a weaker decision and is marked by the
  absence of an abstract in the retrieval metadata.
- **L-12. The bounded remediation is one round.** It closes the findings the R1 report
  raised; it is not a re-execution of the review from scratch, and it inherits every
  first-pass limitation not named in that report.

## 8. What the R1 bounded remediation changed in this synthesis

Recorded so that a reviewer can diff this synthesis against its first version without
reading the artifact twice. Every item names the R1 finding it answers.

| Finding    | Change                                                                                                                                                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C-1**    | §0 now states that the absence rests on opened documents. G1016 was obtained from its institutional repository (21,237,276 bytes, sha256 `81a2a094…`) and read; its cable condition is a high-to-low crossover with an unstated pulley origin, so it is a related condition and index Y remains unstudied. |
| **I-1**    | The evidence-packet link in the header is corrected to the committed lowercase filename `sbla-009-evidence-packet.json`.                                                                                                                                                                                   |
| **I-2**    | The 2023 systematic review and meta-analysis (DOI `10.3390/app13085203`) is retrieved, extracted and cited in §0 as external corroboration of the index-Y absence and in the contradiction map as C-10 and C-11.                                                                                           |
| **I-4**    | §7 L-1 now records that backward and forward citation chasing exist, and states their two bounds.                                                                                                                                                                                                          |
| **I-6**    | §7 L-7 records that the Portuguese bench-press-versus-machine-fly comparison needed no machine translation because it carries an authorised English abstract.                                                                                                                                              |
| **I-7**    | §6 item 3 now says three usable trials, names all three, and states which one contributes direction only.                                                                                                                                                                                                  |
| **I-8**    | The awaiting-full-text tier-1 count is ten in every location; L-3 was already correct and is unchanged.                                                                                                                                                                                                    |
| **I-9(a)** | §1.2 now attributes the intercostal-contribution finding to the **five** Sihler-stained muscles rather than to all 80 dissected specimens, and states the donor demographics.                                                                                                                              |
| **I-9(b)** | §1.4 now reports **twenty-nine** healthy young females across two experiments, not twenty.                                                                                                                                                                                                                 |
| **I-12**   | §7 L-4 is recomputed: forty-six of 88 included sources are abstract-only, no source remains at `metadata-only`, and nine sources moved to `full-text-open` after the ladder was run.                                                                                                                       |
| **I-13**   | Contradiction map row **C-10** records the inclination disagreement in full and states that claim 14 was re-derived, its wording withdrawn and its certainty lowered.                                                                                                                                      |
| **new**    | Rows **C-11**, **C-12** and **C-13** record the enlarged press-versus-fly disagreement, the 2023 review's internal contradiction on the decline contrast, and the exercise-order instability that destabilises any single activation comparison.                                                           |
| **new**    | §7 gains **L-11** (the two-pass screening method and its bound) and **L-12** (the remediation is one bounded round).                                                                                                                                                                                       |
