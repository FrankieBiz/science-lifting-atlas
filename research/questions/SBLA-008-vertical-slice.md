# Research questions — SBLA-008 evidence-system vertical slice

- Task: SBLA-008 (§18 queue row; §14 Phase 1 Task 1.2 scope step)
- Role: Claude Research (account A) — evidence lead, not the independent reviewer
- Pipeline stage: **`scope` only** (§9.8). No acquisition, screening, extraction,
  appraisal, synthesis, or drafting is performed or claimed here. One route-level
  composite search was run at scope time and is disclosed rather than denied:
  Europe PMC E1, 2026-09-11, `hitCount` 334
  (`research/searches/SBLA-008-search-strategy.md` §4.2). No record behind it was
  retrieved, opened, screened, or cited.
- Base commit: `0752d5021da72eed840f61ae06f6c1966906c177`
- Date written: 2026-09-11
- Companion files: `research/searches/SBLA-008-search-strategy.md`,
  `research/screening/SBLA-008-eligibility-plan.md`,
  `research/packets/SBLA-008-handoff.md`

## 0. What this document is and is not

This file defines **two questions and their boundaries**. It contains no
scientific finding, no certainty grade, and no claim about anatomy, exercise, or
training. Every anatomical or physiological term below is used to _delimit a
search_, not to assert a fact. Whether the clavicular and sternocostal portions
of the pectoralis major actually differ in any measured way is exactly what
SBLA-009 must find out from sources; nothing in this file presupposes an answer,
and no sentence here may be promoted to `content/`.

Where this document names a structure, an action, or an exercise mechanic, treat
it as **a scoping label drawn from the master plan and from controlled
vocabularies I verified** (see the search strategy's verification log), not as an
extracted fact. The one exception is explicitly marked: §2 records that
`Pectoralis Muscles` (MeSH D010369) has no narrower descriptor, which is a
verified property of the vocabulary and is recorded because it changes how the
questions must be searched.

Model memory is not evidence (CLAUDE.md; §13.8). Nothing below is offered as
evidence.

---

## 1. The representative slice

§14 Phase 1 fixes the slice: "Use pectoralis major plus a flat press and a
cable/fly variation as the representative slice, unless the evidence scoping step
identifies a better test case."

This scoping step **does not** propose a better test case. The slice is retained
as written. Three reasons, recorded so a reviewer can challenge them:

1. §4.3 lists "Pectoralis major regions" as required initial anatomy coverage, so
   the slice exercises the regional-subdivision problem the graph must solve
   anyway.
2. §4.4 requires machine, cable, dumbbell, barbell, and bodyweight
   representatives; a barbell multi-joint press against a cable single-joint fly
   exercises two of those in one comparison and carries the `foundational` and
   `distinct-mechanics` inclusion labels respectively.
3. §2.2 prohibits presenting EMG amplitude as hypertrophy evidence and prohibits
   a universal "best". A press-versus-fly comparison is the case where that
   prohibition bites hardest, so it is a good stress test of the evidence system
   rather than an easy one.

**Assumption A1 (scope).** I assume the slice is meant to be searched as _one
muscle plus two named exercises_, not as a general "chest training" review.
Everything below narrows accordingly. If the owner intended a broader chest
review, Q2 is under-scoped and must be reopened before SBLA-009.

---

## 2. Naming and identifier anchors

These anchors exist so that two models searching independently resolve the same
structure. They are vocabulary facts, verified on 2026-09-11 and recorded in full
(URL, method, response) in `research/searches/SBLA-008-search-strategy.md` §2.

| Anchor          | Identifier                                                    | Role in this task                                          |
| --------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| MeSH descriptor | `Pectoralis Muscles` D010369, tree A02.633.567.775            | The only PubMed controlled-vocabulary handle available     |
| MeSH entry term | "Pectoralis Major", "Pectoralis Minor" (entry terms **only**) | Neither is a descriptor; neither can be searched as `[mh]` |
| UBERON          | `UBERON:0002381` "pectoralis major"                           | Ontology anchor for the muscle record                      |
| FMA             | `FMA:9627` (cross-reference of UBERON:0002381)                | Secondary anatomical anchor                                |

**Verified vocabulary fact V1.** `Pectoralis Muscles` D010369 has **no narrower
MeSH descriptor**: a MeSH SPARQL query for descriptors whose tree number starts
with `A02.633.567.775` returned only D010369 itself. Two consequences bind every
search in this slice:

- MeSH **cannot** separate pectoralis major from pectoralis minor, and **cannot**
  address the clavicular or sternocostal portions at all. Free-text terms are
  therefore mandatory, not a recall supplement.
- `[mh]` explosion on this descriptor is a no-op, so `"Pectoralis Muscles"[mh]`
  and `"Pectoralis Muscles"[mh:noexp]` retrieve the same set. The strategy uses
  the exploded form for forward compatibility if NLM later adds children, and the
  executor must re-check V1 at execution time.

**Unresolved U1.** Terminologia Anatomica (TA2) could not be reached on
2026-09-11 (FIPAT host connection failure; see the search strategy's verification
log). The slice therefore has no verified _official Latin/TA_ nomenclature anchor,
only MeSH, UBERON, and FMA. SBLA-009 must either reach TA2 or record its absence
in the muscle record's provenance; it must not substitute model memory for it.

---

## 3. Exercise definitions

Both exercises are defined here as **reproducible protocol specifications**, so
that screening can decide whether a given study's exercise is or is not the index
exercise. The definitions are operational boundaries for this project, not claims
about how anyone should train. Each specification separates:

- **Defining attributes** — a study failing any of these is not the index
  exercise;
- **Recorded modifiers** — permitted variation that must be extracted verbatim
  and may drive sensitivity analysis;
- **Distinct conditions** — related movements that are _not_ pooled with the
  index exercise by default.

### 3.1 Exercise X — barbell flat bench press (index "flat press")

| Field                                | Specification                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slug (proposed)                      | `barbell-flat-bench-press`                                                                                                                                                                                                                                                                         |
| Class                                | Multi-joint, bilateral, free-weight, supine horizontal press                                                                                                                                                                                                                                       |
| Defining: implement                  | A single straight barbell loaded with free weight                                                                                                                                                                                                                                                  |
| Defining: support                    | A horizontal bench; backrest inclination 0° ± 5° from horizontal                                                                                                                                                                                                                                   |
| Defining: body position              | Supine on the bench; torso and hips supported by the bench; feet in contact with the floor or a platform                                                                                                                                                                                           |
| Defining: grip                       | Pronated (overhand), both hands on the bar, hands outside shoulder width                                                                                                                                                                                                                           |
| Defining: joint actions (concentric) | Shoulder horizontal adduction and/or flexion **with** elbow extension                                                                                                                                                                                                                              |
| Defining: range of motion            | Bar descends to contact or near-contact with the torso and returns to full or near-full elbow extension                                                                                                                                                                                            |
| Defining: resistance source          | Gravity acting on the barbell                                                                                                                                                                                                                                                                      |
| Recorded modifier                    | Grip width, reported absolutely and/or normalised to biacromial or shoulder width                                                                                                                                                                                                                  |
| Recorded modifier                    | Bar touch point (upper sternum, mid sternum, xiphoid/lower chest)                                                                                                                                                                                                                                  |
| Recorded modifier                    | Paused versus touch-and-go; concentric and eccentric cadence                                                                                                                                                                                                                                       |
| Recorded modifier                    | Degree of lumbar extension ("arch") and whether scapular position was prescribed                                                                                                                                                                                                                   |
| Recorded modifier                    | Load (%1RM or RM zone), repetitions, sets, rest, frequency, proximity to failure, supervision, programme duration                                                                                                                                                                                  |
| Recorded modifier                    | Whether the bar path was self-selected or prescribed; spotter use                                                                                                                                                                                                                                  |
| Distinct condition — not pooled      | Smith-machine bench press; chest-press machine; dumbbell bench press; incline or decline bench press (any inclination outside 0° ± 5°); floor press; board or other deliberate partial-ROM press; accommodating resistance (bands or chains); unilateral press; push-up and every bodyweight press |
| Exclusion                            | Ballistic or throw variants; 1RM testing with no training exposure; any protocol delivered as rehabilitation of a diagnosed shoulder pathology                                                                                                                                                     |

### 3.2 Exercise Y — bilateral standing cable fly at shoulder height (index "cable/fly variation")

| Field                                | Specification                                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slug (proposed)                      | `cable-fly-standing-bilateral-shoulder-height`                                                                                                                                  |
| Class                                | Single-joint, bilateral, cable-resisted shoulder horizontal adduction                                                                                                           |
| Defining: implement                  | Two cable stacks or pulleys, one per hand, each with a single handle                                                                                                            |
| Defining: pulley origin              | Both pulleys at approximately shoulder height (mid setting)                                                                                                                     |
| Defining: body position              | Standing, split or parallel stance, torso upright to slightly forward-inclined                                                                                                  |
| Defining: elbow                      | Elbow held at a fixed, slightly flexed angle throughout; **no intentional elbow extension** contributes to the movement                                                         |
| Defining: joint actions (concentric) | Shoulder horizontal adduction, with the hands travelling toward each other in front of the torso                                                                                |
| Defining: resistance source          | Cable tension, with the line of force set by the cable path rather than by the gravity vector alone                                                                             |
| Recorded modifier                    | Pulley height in absolute or normalised terms; cable path length; stance; torso inclination                                                                                     |
| Recorded modifier                    | Elbow angle in degrees and how it was controlled                                                                                                                                |
| Recorded modifier                    | End-range hand position (hands meeting, crossing, or stopping short) and start-range position                                                                                   |
| Recorded modifier                    | Load, repetitions, sets, rest, frequency, proximity to failure, supervision, programme duration                                                                                 |
| Recorded modifier                    | Machine make and model, and whether the stack used a cam or a constant-radius pulley                                                                                            |
| Distinct condition — not pooled      | Pec deck or machine fly; dumbbell fly on a bench; cable fly performed lying supine on a bench; high-to-low and low-to-high crossover variants; single-arm cable fly; banded fly |
| Exclusion                            | Fly performed with intentional elbow extension (that is a press, not a fly); fly delivered as shoulder rehabilitation                                                           |

**Decision D1.** The comparator is a **cable** fly rather than a dumbbell or
machine fly. §14 permits "a cable/fly variation"; the cable version is chosen
because the mechanical contrast with X is largest and most legible: single-joint
versus multi-joint, and a cable-determined line of force versus a
gravity-determined one. That makes the comparison a `distinct-mechanics` case
under §4.4 rather than a near-duplicate.

**Decision D2 (pooling).** Studies of pec deck, dumbbell fly, or bench-lying
cable fly are **retained and extracted** as pre-specified _related_ conditions,
because excluding them outright would suppress relevant and possibly
contradictory evidence. They are **not** pooled with Y by default, and any
synthesis that combines them must state the pooling decision and justify it. The
same applies to dumbbell and machine flat presses relative to X.

**Unresolved U2.** The pooling rule above is a methodological choice made by this
role, not something the master plan fixes. If the owner judges that the
literature is too sparse for Y as defined to yield any evidence, the correct
remedy is to widen Y _explicitly in a revised scope file_, not to quietly pool at
synthesis time.

**U2 is being decided with partial yield already visible.** The intended
condition was that U2 be settled before any question-level yield existed. That
condition no longer holds and the file says so rather than implying otherwise: on
2026-09-11 the Europe PMC E1 composite string was run without a zero-yield anchor
and returned `hitCount` 334, which is a route-level count for one of the planned
routes (`research/searches/SBLA-008-search-strategy.md` §4.2; R1 finding I-1). No
record behind that count was opened, screened, or cited, and it says nothing
about how many of the 334 are eligible. It is nonetheless a yield figure, and
whoever settles U2 will have seen it. The single-term index counts that actually
motivate widening Y — §4.1 of that file — were observed before the composite was
run. The owner should record the U2 decision together with its stated rationale,
so a later reader can judge for themselves whether the 334 bore on it.

---

## 4. Q1 — muscle-function question

### 4.1 Question

> In adult humans, what are the bony attachments of the pectoralis major, which
> glenohumeral joint actions does each of its clavicular and sternocostal
> portions contribute to, and does the relative contribution of the two portions
> vary with humeral position (elevation angle and plane of elevation)?

### 4.2 Sub-questions and the claim types they can support

| ID  | Sub-question                                                                                                                     | §9.3 claim type               | Frame that fits                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| Q1a | What are the origins, insertion, fibre arrangement, and innervation of the pectoralis major, and how are its portions delimited? | Anatomy                       | Descriptive (no PICO)                                        |
| Q1b | Which glenohumeral actions does each portion contribute to?                                                                      | Function                      | Descriptive with an internal comparator (portion vs portion) |
| Q1c | Does the relative contribution of the portions vary with humeral elevation angle or plane?                                       | Function / exercise-mechanics | PECO-style (exposure = humeral position)                     |

### 4.3 Structured fields

PICO/PECO applies "where applicable" (§9.8 step 1). It does **not** fit Q1a,
partly fits Q1b, and fits Q1c. Fields are populated where meaningful and marked
not-applicable with a reason where not. Faking a frame would be theatre; the
SBLA-002 precedent for refusing an inapplicable frame is deliberately followed.

| Field                | Q1a                                                                                                                    | Q1b                                                                                                                                                                           | Q1c                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Population           | Adult humans (≥18 y), any sex, no known pectoral or shoulder pathology; cadaveric adult specimens admissible           | Same, plus in vivo adults                                                                                                                                                     | In vivo adults; cadaveric or modelled data admissible only as indirect                                                     |
| Exposure / condition | Not applicable — the "exposure" is the structure itself                                                                | The joint action being performed or simulated                                                                                                                                 | Humeral elevation angle and plane of elevation                                                                             |
| Comparator           | Not applicable — descriptive                                                                                           | Clavicular portion versus sternocostal portion; and pectoralis major versus neighbouring horizontal adductors where reported                                                  | Position level versus position level, within the same portion                                                              |
| Outcome              | Attachment sites, fibre and fascicle orientation, portion boundaries, innervation, architectural parameters            | Evidence that a portion contributes to a named action: moment-arm sign and magnitude, activation during the action, effect of loss or transfer, direct mechanical measurement | Change in the portion-wise measure across positions                                                                        |
| Timeframe            | Cross-sectional or static                                                                                              | Cross-sectional or single-session                                                                                                                                             | Cross-sectional or single-session                                                                                          |
| Setting              | Anatomy laboratory, imaging suite, biomechanics laboratory                                                             | As Q1a, plus in vivo biomechanics laboratory                                                                                                                                  | In vivo biomechanics or imaging laboratory                                                                                 |
| Estimand             | Not applicable — descriptive summary, reported with the measurement method and specimen or participant characteristics | Direction and, where reported, magnitude of each portion's mechanical or electrophysiological contribution to the named action, at the reported humeral position              | Within-person or within-specimen change in the portion-wise measure per unit or per level of humeral position, as reported |

### 4.4 Outcome measures admissible for Q1, by directness

Ordered from most to least direct **for the claim being made**, not by study
prestige.

1. **Direct structural observation** — cadaveric dissection, documented
   attachment mapping, imaging-derived morphology. Directly supports Q1a.
2. **Direct mechanical measurement or measured-geometry modelling** — moment arms
   measured by tendon excursion or imaging; measured line of action. Directly
   supports Q1b and Q1c.
3. **Regional intramuscular or fine-wire electromyography** with a stated
   normalisation and a stated portion-identification method. Supports Q1b and Q1c
   as evidence of _activation_, which is not the same as _contribution to torque_.
4. **Surface electromyography over a portion**, with electrode placement,
   normalisation, and crosstalk handling reported. Weaker than 3 and carries a
   mandatory crosstalk qualifier.
5. **Musculoskeletal model output** where geometry is inherited rather than
   measured. Indirect; usable only with the model's assumptions stated.

**Hard constraint.** §2.2 prohibits presenting EMG amplitude as a direct
measurement of hypertrophy. It follows that no Q1 outcome above may be carried
into Q2's hypertrophy tier. Tiers 3–5 here support function and mechanics claims
only.

### 4.5 Q1 exclusions

- Non-human anatomy, except where a study explicitly validates a human finding
  and is labelled indirect.
- Paediatric populations, and any population with pectoral agenesis (for example
  Poland sequence), pectoral tear, prior pectoral transfer or reconstruction,
  thoracic surgery affecting the muscle, breast surgery involving the pectoral
  bed, or neurological impairment of the pectoral nerves — unless used
  deliberately as _contradiction or boundary evidence_ and labelled as an
  indirect population.
- Studies that report "pectoralis" without distinguishing major from minor, where
  the distinction matters to the claim, unless the method makes the distinction
  recoverable.
- Narrative summaries with no primary observation and no traceable primary
  citation.
- Sources whose terms prohibit AI ingestion. OpenStax _Anatomy & Physiology 2e_
  is named in §9.9 and is excluded for this reason.

---

## 5. Q2 — comparative exercise question

### 5.1 Question

> In healthy adults performing supervised resistance training, does a programme
> using the barbell flat bench press (Exercise X, §3.1) differ from one using the
> bilateral standing cable fly (Exercise Y, §3.2) in pectoralis major hypertrophy,
> and secondarily in task-specific maximal strength, when training variables are
> equated or reported?

The question names the outcome, as §9.5 requires. It asks "differ in what", never
"which is better".

### 5.2 PICO fields

| Field                  | Specification                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P — Population**     | Healthy adults 18–45 y, any sex, any training status, free of upper-limb, shoulder, or thoracic injury or surgery. **Pre-specified subgroups:** training status (untrained / recreationally trained / resistance-trained ≥1 y); sex; age 46–65 y as a separate subgroup, never pooled with the primary band without a stated reason. |
| **I — Intervention**   | Exercise X as defined in §3.1, performed as the pectoral-targeted exercise of the condition.                                                                                                                                                                                                                                         |
| **C — Comparator**     | Exercise Y as defined in §3.2, performed as the pectoral-targeted exercise of the condition. **Secondary admissible comparators**, recorded separately and never silently substituted for Y: pec deck or machine fly, dumbbell fly, bench-lying cable fly, X and Y combined, and a no-pectoral-exercise or usual-training control.   |
| **O — Outcomes**       | The five-tier hierarchy in §5.3, plus the mandatory harms tier.                                                                                                                                                                                                                                                                      |
| **T — Timeframe**      | Tier 1 requires ≥6 weeks of training exposure, with ≥8 weeks preferred and <6 weeks recorded as a pre-specified reason to downgrade. Tier 2 follows the intervention duration. Tiers 3–5 are acute or single-session.                                                                                                                |
| **Setting**            | Supervised laboratory or gym resistance training; unsupervised training admissible if adherence measurement is reported. Biomechanics or EMG laboratory for tiers 3 and 4.                                                                                                                                                           |
| **Design eligibility** | Set per outcome tier in `research/screening/SBLA-008-eligibility-plan.md` §3.                                                                                                                                                                                                                                                        |

### 5.3 Outcome priority hierarchy

The hierarchy is a **decision rule about what a claim may rest on**, not a ranking
of study quality. A claim may not be graded higher than the tier of the evidence
that actually supports it.

| Tier                                | Outcome                                                                                                                                                           | Measurement requirements                                                                                                          | §9.3 claim type it can support         | Hard limit                                                                                                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 — Primary**                     | Pectoralis major size change: muscle thickness, anatomical or physiological cross-sectional area, or volume; regional (clavicular vs sternocostal) where reported | MRI, CT, or B-mode ultrasound with stated site, probe orientation, rest and hydration control, and reliability; ≥6 weeks exposure | `longitudinal-adaptation`              | Only tier 1 may support a hypertrophy claim                                                                                                                                                     |
| **2 — Secondary**                   | Task-specific maximal strength change (1RM in a named lift; isometric or isokinetic horizontal-adduction torque)                                                  | Named test, stated familiarisation and reliability                                                                                | `longitudinal-adaptation`              | Must carry a task-specificity qualifier; a 1RM bench-press gain after bench-press training is partly practice, and may never be reported as hypertrophy                                         |
| **3 — Mechanistic, supporting**     | External joint moment, moment arm, muscle–tendon length or excursion, kinematics and kinetics, resistance profile across the range                                | Stated model or measurement, stated assumptions, stated coordinate system                                                         | `exercise-mechanics`                   | May explain a tier-1 or tier-2 result; may never substitute for one                                                                                                                             |
| **4 — Indirect proxy**              | Surface or intramuscular EMG amplitude, normalised                                                                                                                | Electrode placement, normalisation reference, filtering, crosstalk handling, and which portion was sampled                        | `acute-response`, `exercise-mechanics` | **§2.2:** must never be presented as a direct measurement of hypertrophy; every use carries that qualifier                                                                                      |
| **5 — Context only**                | Acute muscle-thickness swelling, blood flow, RPE, soreness, lactate, hormonal response, "pump", session fatigue                                                   | As reported                                                                                                                       | `acute-response` at most               | **§2.2:** never evidence of long-term growth; may appear only as context, never as a reason to prefer either exercise                                                                           |
| **H — Harms (parallel, mandatory)** | Shoulder or pectoral pain incidence, adverse events, injuries, dropout and its stated reasons, tolerability                                                       | As reported, including zero-event reporting and "not reported"                                                                    | `safety-context`                       | Collected for every included study regardless of efficacy tier; absence of reporting is itself recorded. §4.2 and §9.9 forbid turning this into rehabilitation or individualised medical advice |

**Rule H1.** A study reporting only tier 4 or tier 5 outcomes can never support a
comparative training recommendation. It may support an exercise-mechanics or
acute-response claim with its own scope.

**Rule H2.** "No significant difference" is never recorded as equivalence (§2.2).
The extraction must capture the estimate, its interval, and the study's power or
precision, and the synthesis must state whether the data can distinguish "no
difference" from "not enough information".

**Rule H3.** No claim arising from Q2 may use "better" without naming the
outcome, population, comparator, and certainty (§9.5), and none may assert a
universal best (§2.2).

### 5.4 Estimand for the tier-1 outcome

Stated explicitly so that SBLA-009 extracts the same quantity from every study and
does not silently average incompatible things (§9.8 step 7).

| Attribute                  | Specification                                                                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Population                 | §5.2 P, at the subgroup level reported                                                                                                                                                                                                                                                              |
| Treatment condition        | Exercise X as specified, as the pectoral-targeted exercise                                                                                                                                                                                                                                          |
| Comparator condition       | Exercise Y as specified, as the pectoral-targeted exercise                                                                                                                                                                                                                                          |
| Endpoint                   | Change from baseline to end of intervention in the reported pectoralis major size measure, at the reported measurement site or sites                                                                                                                                                                |
| Population-level summary   | Between-condition difference in change. Standardised mean difference for cross-study comparison **and**, where units permit, the raw difference in millimetres or square centimetres, because a standardised effect alone hides practical size                                                      |
| Design contrast            | Between-participant for parallel-group designs; **within-participant** for unilateral or contralateral-limb designs, which are common in this literature and must be recorded as a distinct contrast, never pooled with between-participant contrasts without an explicit decision                  |
| Intercurrent events        | Dropout, non-adherence, injury, illness, concurrent pectoral training, and diet or bodyweight change. **Treatment-policy strategy preferred** — analyse as allocated. Where only a per-protocol or completers analysis is reported, record that and treat it as a pre-specified reason to downgrade |
| Missing data               | Record the handling actually used; record when it is not stated                                                                                                                                                                                                                                     |
| Training-variable equating | Record whether sets, repetitions, load, proximity to failure, volume load, rest, frequency, and total exposure were equated, and by which definition. An unequated comparison is not invalid but answers a different question and must be labelled                                                  |
| Measurement timing         | Record the interval between the final training session and the post-test, because acute swelling contaminates short intervals — that is tier 5 crossing into tier 1                                                                                                                                 |

**Assumption A2.** I assume the decision-relevant estimand is the _difference in
change_, not the _change under X alone_. If the owner's real question is "does
adding Y to X add anything", that is an additive-design question with a different
comparator and it is **not** covered by this scope. Flagged for the reviewer.

**Unresolved U3.** Whether within-participant (contralateral-limb) studies are
eligible for the primary synthesis, or only for a sensitivity analysis, is left
open here. Arguments both ways are recorded in the eligibility plan §3.4. A
reviewer or the owner should settle it before SBLA-009 screens, so that the rule
is not chosen after the results are visible.

### 5.5 Technique boundaries that change eligibility

| Boundary             | Rule                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bench inclination    | 0° ± 5° for X. Outside that, the study is a distinct condition (incline or decline), extracted separately                                                                                         |
| Range of motion      | Full ROM as defined in §3.1 for X. Deliberate partial-ROM, board, or pin-press conditions are distinct conditions                                                                                 |
| Elbow action in Y    | Any intentional elbow extension disqualifies the condition as Y                                                                                                                                   |
| Pulley height in Y   | Approximately shoulder height. High-to-low and low-to-high are distinct conditions                                                                                                                |
| Implement            | Barbell for X, cable for Y. Substituting the implement makes it a distinct condition                                                                                                              |
| Load progression     | Must be reported; unreported progression is a recorded limitation, not an exclusion                                                                                                               |
| Proximity to failure | Must be reported or inferable; unreported is a recorded limitation                                                                                                                                |
| Supervision          | Must be reported; unsupervised is admissible with adherence data                                                                                                                                  |
| Concurrent training  | Other pectoral-loading exercises in the same programme must be reported. If both conditions share the same additional pectoral work, the contrast is diluted and this is recorded as indirectness |

### 5.6 Q2 exclusions

- Non-human studies.
- Clinical or rehabilitation populations (post-operative shoulder, rotator-cuff
  repair, post-mastectomy, neurological impairment), except as explicit
  contradiction or boundary evidence, labelled indirect.
- Athletes training for a competitive bench-press total where the exposure cannot
  be separated from sport-specific skill practice, unless the study reports the
  pectoral outcome separately.
- Studies where the pectoral training exposure cannot be attributed to X or Y
  because the programme mixed many pectoral exercises without separation.
- Studies whose only outcome is tier 5.
- Supplement, drug, or ergogenic-aid trials where the exercise contrast is not the
  manipulated variable.
- Sources whose terms prohibit AI ingestion (§9.9).
- Retracted sources, for the purpose of supporting a live claim (§9.7). Retracted
  work is still read and recorded in the contradiction map.

---

## 6. Cross-cutting scope limits

- **Both questions are read-only with respect to `content/`.** SBLA-008 produces
  no claims. SBLA-009 produces draft claims; publication is gated later in §9.8.
- **Certainty is assigned per claim, not per article** (§9.4), and is assigned in
  SBLA-009 at the appraisal and synthesis stages, not here.
- **No causal language** may attach to association-type findings (§9.3).
- **Applicability** must be recorded for every claim as direct, partially direct,
  or indirect to the site's target user, who is a serious lifter or coach (§3.1,
  §3.2), not a patient.
- **The site never gives medical, diagnostic, or rehabilitation advice** (§4.2).
  Harms-tier findings are reported as context and a conservative boundary, never
  as treatment.

---

## 7. Assumptions and unresolved scope decisions (consolidated)

| ID  | Type       | Statement                                                                                                                                                                          | Who should resolve it                                  |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| A1  | Assumption | The slice is one muscle plus two named exercises, not a general chest-training review                                                                                              | Reviewer; owner if contested                           |
| A2  | Assumption | The decision-relevant estimand is the difference in change between X and Y, not an additive "X plus Y" question                                                                    | Reviewer; owner if contested                           |
| A3  | Assumption | "A flat press" is best instantiated as the barbell flat bench press, the `foundational` and most commonly studied case                                                             | Reviewer                                               |
| A4  | Assumption | Access to full text will be uneven; the plan is written so that abstract-only records still have a defined fate rather than being silently dropped                                 | Reviewer                                               |
| U1  | Unresolved | No verified Terminologia Anatomica anchor; FIPAT unreachable on 2026-09-11                                                                                                         | SBLA-009 executor; record absence if still unreachable |
| U2  | Unresolved | Whether Y may be widened to pec deck or dumbbell fly if the literature for Y as defined is empty. Now being decided with one route-level yield figure visible (§3, Europe PMC 334) | Owner, **before** SBLA-009 searches                    |
| U3  | Unresolved | Whether contralateral-limb within-participant designs enter the primary synthesis or only a sensitivity analysis                                                                   | Reviewer or owner, **before** screening                |
| U4  | Unresolved | Whether the regional (clavicular vs sternocostal) hypertrophy outcome is part of the primary tier-1 estimand or a separate secondary question                                      | Reviewer                                               |
| U5  | Unresolved | Whether non-English records will be translated or excluded; this scope plans for inclusion with a recorded translation method, which costs time SBLA-009 may not have              | Owner, on cost grounds                                 |

---

## 8. What SBLA-009 must produce against this scope

1. Executed searches matching `research/searches/SBLA-008-search-strategy.md`,
   each with database, date, exact query, filters, and result count (§9.8 step 2),
   plus the PubMed `querytranslation` string for every PubMed search. One search
   row already exists and must be carried in rather than dropped: the Europe PMC
   E1 composite run at scope time, `searchedAt` 2026-09-11, `resultCount` 334
   (§4.2 of that file). Record it and the run of the amended E1 string as two
   separate rows, with their two dates and two counts.
2. A screening log implementing `research/screening/SBLA-008-eligibility-plan.md`,
   with one recorded reason per exclusion.
3. Extractions that separate reported data from interpretation (§9.8 step 5).
4. A contradiction map populated from the deliberate contradiction search, not
   assembled after the fact.
5. Draft claims, each with scope, certainty, direction, magnitude, applicability,
   and exact locators — or an explicit record that the evidence did not support a
   claim, which is an acceptable and expected outcome.
