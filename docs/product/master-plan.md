# Science-Based Lifting Atlas — Master Product, Evidence, and Execution Plan

> **For Codex and Claude:** This is the single source of truth for planning and executing the project. Read it completely before acting. Do not silently change product scope, scientific standards, schemas, architecture, or ownership rules. Propose changes in an Architecture Decision Record (ADR) and obtain the project owner's approval.
>
> **For agentic implementation:** Work one checked task at a time. Codex is the repository maintainer and integration owner. Claude Research produces evidence packets and draft content. Claude Review independently audits research, claims, UX, and completed milestones. No model may approve its own output.

**Goal:** Build a free, premium, evidence-first web atlas where serious lifters, coaches, and trainers can explore human anatomy, understand muscle function, connect muscles to exercises, and inspect the evidence behind every meaningful training claim.

**Architecture:** Use a static-first, typed knowledge graph as the product's factual core. Render fast indexable content pages around a progressively loaded cinematic 3D anatomy explorer. Keep research acquisition, AI synthesis, validation, publication, and monitoring as separate, auditable stages.

**Recommended stack:** pnpm workspace; Astro with TypeScript; React islands for complex interaction; Three.js through React Three Fiber for 3D; Zod-validated YAML/MDX content; build-time graph generation; Pagefind for static search; Vitest, Playwright, axe-core, and Lighthouse CI; GitHub Actions; Cloudflare Pages plus R2 or an equivalent free-tier static host/object store.

**Planning date:** 2026-08-29  
**Project status:** Planning approved; implementation not started  
**Primary audience:** Serious lifters  
**Secondary audience:** Coaches and personal trainers  
**Business model at launch:** Free; no monetization  
**Production constraint:** AI-only labor using ChatGPT Pro/Codex and two Claude Team accounts, with the human owner acting as product owner and final approver  
**Quality strategy:** Deep polish and strong evidence coverage before catalog breadth  

---

## 1. Executive decision summary

The product is not a generic fitness blog, an exercise list, a workout tracker, or an AI chatbot. It is a visual evidence graph for resistance training.

Its core promise is:

> Select any trainable structure on a human body, understand what it does, see how exercises load it, and inspect the evidence and uncertainty behind every meaningful claim.

The experience should feel like a cinematic anatomy museum combined with a restrained scientific journal. A user may begin with the body, a muscle, an exercise, a movement, or a question. Every route converges on the same structured records and atomic claims, so explanations and citations remain consistent across the site.

The first release is intentionally finite:

- All major trainable skeletal-muscle groups, with subdivisions only when they materially change function or training decisions.
- Approximately 75–120 cornerstone resistance exercises.
- A deeply polished 3D explorer with accessible non-3D equivalents.
- High-quality muscle, exercise, comparison, evidence, glossary, and methodology pages.
- Claim-level citations, evidence certainty, applicability, and uncertainty labels.
- No accounts, subscriptions, individual behavioral or workout/progress tracking, program generation, community, nutrition, rehabilitation, or unrestricted AI chat. Minimal aggregate product analytics is optional under Section 11.8.

The site may later add a constrained question-answering interface, but only after the approved knowledge graph is large enough to ground every answer. Such an interface must retrieve from approved claims and source records; it must never answer from unconstrained model memory.

---

## 2. Product principles and non-negotiable guardrails

### 2.1 Product principles

1. **Evidence is a visible product feature.** Citations, study type, certainty, applicability, and update status must be understandable without opening a methodology paper.
2. **The anatomy model is navigation, not decoration.** Every selectable structure must map to a stable content identifier and meaningful related content.
3. **No fake precision.** Do not turn ambiguous literature into exact rankings, percentages, activation scores, or universal prescriptions.
4. **Show uncertainty without becoming unusable.** Each page needs a clear practical takeaway followed by deeper evidence detail.
5. **Separate fact, synthesis, and inference.** Users should be able to distinguish established anatomy, observed study results, the project's synthesis, and practical interpretation.
6. **Static-first by default.** The initial product does not need accounts or a runtime database. Static delivery improves speed, cost, security, reproducibility, and resilience.
7. **Progressive enhancement.** Core learning and navigation must work when WebGL is unavailable, data saving is enabled, motion is reduced, or assistive technology is used.
8. **One canonical fact, many presentations.** A claim is authored and reviewed once, then reused by muscle pages, exercise pages, comparisons, tooltips, search, and future interfaces.
9. **AI accelerates work; it does not become evidence.** Models discover, extract, draft, test, and critique. Sources support claims.
10. **The site earns authority slowly.** It must never imply medical review, peer review, or institutional endorsement that did not occur.

### 2.2 Explicitly prohibited behavior

- Publishing a factual training claim without a claim record and at least one valid supporting source.
- Using a model's internal knowledge, a search-result snippet, or another website's summary as the final source.
- Citing a paper merely because its topic is related; the cited source must support the exact nearby claim.
- Presenting EMG amplitude as a direct measurement of hypertrophy.
- Presenting acute swelling, hormonal response, soreness, pump, or fatigue as direct long-term growth evidence.
- Claiming one exercise is universally “best” without a clearly defined outcome, comparator, population, and certainty level.
- Treating “no significant difference” as proof of equivalence.
- Ignoring sample size, study duration, training status, exercise technique, range of motion, supervision, or conflicts of interest.
- Copying paywalled text, abstracts, figures, tables, textbook prose, or imagery beyond allowed use.
- Ingesting a source into an AI system when its terms prohibit AI ingestion.
- Publishing medical diagnosis, injury treatment, rehabilitation, or individualized medical advice.
- Hiding contradictory evidence, null results, limitations, or post-publication corrections.
- Calling a dual-model review “expert review,” “peer review,” or “clinician reviewed.”

---

## 3. Audience, jobs to be done, and success metrics

### 3.1 Primary persona: serious lifter

**Context:** Trains consistently, knows common exercises, encounters conflicting online claims, and wants decisions grounded in anatomy and research without reading every paper.

**Jobs:**

- Understand the function and training relevance of a muscle or region.
- Identify exercises that plausibly load a target structure and understand why.
- Compare similar exercises by mechanics, constraints, and evidence—not popularity.
- Trace a claim to its sources and see how confident the project is.
- Learn what is known, what is inferred, and what remains uncertain.

### 3.2 Secondary persona: coach or trainer

**Context:** Needs concise explanations for programming decisions and client education, while recognizing differences in equipment, anatomy, tolerance, and skill.

**Jobs:**

- Find defensible explanations and citations quickly.
- Compare movements by target, joint demands, setup constraints, and substitutions.
- Share stable links to specific muscles, exercises, claims, or evidence views.
- Use consistent terminology across coaching materials.

### 3.3 Success metrics

Do not optimize for raw page views. Instrument the following privacy-preserving product signals:

| Outcome | Metric | Initial target after sufficient traffic |
|---|---|---|
| Findability | Search or anatomy selections that reach a relevant detail page | ≥80% |
| Exploration | Detail-page sessions that follow at least one related entity | ≥35% |
| Evidence engagement | Sessions that open evidence details or a source | ≥12% |
| Comprehension | Unmoderated task success on “what it does / how to train it / how certain is this?” | ≥85% |
| Trust | User rating that evidence labels were clear and honest | ≥4/5 |
| Return value | Aggregate repeat-visit signal only if it can be measured without persistent individual identifiers | Optional; omit rather than weaken privacy |
| Content integrity | Published claims with valid references and completed audit | 100% |
| Citation integrity | Sampled citations that support their associated claim | 100% target; any miss blocks release |
| Accessibility | Unresolved applicable WCAG 2.2 AA failures | 0 |
| Performance | LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile | Pass on mobile and desktop |

The Core Web Vitals thresholds above follow Google's current published guidance for LCP, INP, and CLS. Treat them as field targets, not merely Lighthouse scores: [Web Vitals](https://web.dev/articles/vitals).

---

## 4. Release scope

### 4.1 Release 1 includes

- Desktop, tablet, and mobile web app.
- Interactive adult male and female anatomy presentations if the selected asset license and performance budget permit; otherwise one anatomically complete muscular model with inclusive presentation and a documented path to additional body models.
- Front, back, left, right, focus, isolate, and reset views.
- Skin/surface, superficial musculature, deep-muscle subsets where training-relevant, and skeleton context where useful.
- Text search, command-style quick search, filters, breadcrumbs, related entities, and deep links.
- Muscle, muscle subdivision, exercise, joint action, equipment, movement pattern, claim, source, glossary, methodology, attribution, correction, and changelog records.
- 75–120 exercises selected for coverage and usefulness, not novelty.
- Side-by-side comparison for two exercises.
- Static source pages with DOI/PMID links and all claims supported by each source.
- Evidence grades, claim status, applicability tags, and plain-language uncertainty.
- Citation export for individual sources in a common style or structured metadata.
- Source correction/retraction status.
- Accessible list-based anatomy explorer and reduced-motion/non-WebGL modes.
- SEO metadata, sitemap, canonical URLs, social cards, and structured data appropriate to each page.
- Privacy-respecting, cookieless analytics if available on the chosen host.

### 4.2 Release 1 excludes

- Workout logging, personal records, fatigue management, calendars, and progress analytics.
- Program builders or prescriptive routines.
- Accounts, profiles, saved favorites, comments, and social features.
- Client management.
- Nutrition and supplementation.
- Injury diagnosis, rehabilitation plans, pain triage, or treatment.
- A public free-form chatbot.
- User-generated content.
- Automated paper summaries published without review.
- Exercise leaderboards and context-free rankings.
- “Muscle activation percentages” or pseudo-quantitative heat maps.
- Native mobile apps.
- Localization beyond preparing the architecture for later translation.

### 4.3 Initial anatomy coverage

Create records for at least the following training-relevant structures, then refine subdivisions during evidence design:

- Pectoralis major regions; pectoralis minor only where relevant.
- Deltoid anterior, middle, and posterior regions.
- Latissimus dorsi; teres major; trapezius regions; rhomboids.
- Rotator cuff muscles as functional/stability context, without turning the site into a rehabilitation guide.
- Biceps brachii, brachialis, brachioradialis, and triceps brachii heads.
- Major forearm flexor/extensor groupings where individual-muscle detail would not improve training decisions.
- Rectus abdominis, external/internal oblique, transversus abdominis, and spinal erector/multifidus groupings with careful claims.
- Gluteus maximus, medius, and minimus.
- Quadriceps components; hamstring components.
- Hip adductor group and major hip flexors.
- Gastrocnemius heads, soleus, and tibialis anterior.

Do not force every visible mesh to have a full training page. Some structures should exist as anatomical context only.

### 4.4 Initial exercise coverage strategy

Select 75–120 exercises to cover the graph, including:

- Horizontal, incline, and vertical presses.
- Horizontal and vertical pulls.
- Shoulder isolation and rear-shoulder movements.
- Elbow flexion and extension variations.
- Squat, split-squat, leg press, and knee-extension patterns.
- Hinge, hip-extension, knee-flexion, and back-extension patterns.
- Hip abduction and adduction patterns.
- Straight- and bent-knee plantar-flexion patterns.
- Trunk flexion, anti-extension, anti-rotation, lateral flexion, and loaded-carry patterns.
- Machine, cable, dumbbell, barbell, and bodyweight representatives.

Every exercise must justify its inclusion through one of four labels: `foundational`, `high-use`, `distinct-mechanics`, or `coverage-gap`.

---

## 5. Information architecture and core user journeys

### 5.1 Top-level navigation

1. **Explore Body** — primary 3D entry point.
2. **Muscles** — searchable/filterable index and accessible alternative to the 3D model.
3. **Exercises** — searchable/filterable exercise library.
4. **Compare** — two-exercise structured comparison.
5. **Evidence** — claims, source library, evidence map, updates, and corrections.
6. **Learn** — methodology, glossary, and “how to read the evidence.”
7. **Search** — global command/search interface available everywhere.

### 5.2 Primary journey: body to understanding

`Landing → Explore Body → select region → hover/focus muscle → select muscle → summary drawer → full muscle page → related exercises → exercise page → evidence drawer/source`

Requirements:

- The selected body part remains visually highlighted when the drawer opens.
- Hover is never required; keyboard focus and tap provide equivalent behavior.
- Selection creates a URL state so the view can be shared and restored.
- The summary drawer answers “what is it, what does it do, why does it matter?” before presenting detail.
- Evidence badges open explanations, not just tooltips.

### 5.3 Secondary journey: exercise to anatomy

`Search exercise → exercise page → interactive target map → primary/secondary/stabilizing role explanation → mechanics → substitutions/comparisons → evidence`

The target map must express role categories and uncertainty. It must not imply a precise contribution percentage unless a source directly establishes one under comparable conditions.

### 5.4 Coach journey: compare and share

`Compare → select two exercises → choose comparison outcome → review structured differences → expand evidence → copy stable URL`

Possible outcome lenses:

- Target-muscle rationale.
- Joint actions and range.
- Resistance profile and external moment considerations.
- Stability/skill/equipment constraints.
- Population and evidence applicability.

Comparisons must not generate a single “winner” unless the question is narrowly defined and the evidence supports it. Default conclusion language should be contextual: “prefer A when…; prefer B when…; evidence is insufficient for…”.

### 5.5 Research journey

`Evidence index → filter by topic / study design / year / certainty → source page → supported claims → related entities → change history`

This journey exists to make the project's reasoning inspectable, not to reproduce journal content.

---

## 6. Page specifications

### 6.1 Home page

Purpose: Establish authority, demonstrate interaction immediately, and offer non-3D routes.

Required modules:

- Minimal navigation and search.
- Cinematic anatomical hero with one clear instruction: “Select a structure.”
- Three proof points: interactive anatomy, exercise mechanics, claim-level evidence.
- Continue-by-region cards.
- Featured comparison that demonstrates contextual reasoning.
- “How evidence works” strip with direct link to methodology.
- Recently reviewed or updated topics.
- Footer with methodology, corrections, attribution, privacy, accessibility, and repository/about links.

Avoid a long marketing page. The product itself should be the hero.

### 6.2 Anatomy explorer

Desktop layout:

- Center: 3D canvas occupying approximately 55–65% of the viewport.
- Left rail: layer, sex/body presentation, region, and view controls.
- Right contextual panel: selection summary, roles, linked exercises, certainty snapshot, and full-page action.
- Top: global navigation, search, and share/reset controls.
- Bottom: compact view controls and progressive-load status.

Mobile layout:

- Canvas or static anatomical view in upper portion.
- Bottom sheet for selection detail.
- Large tap targets; no precision-only selection.
- Search and region list as first-class alternatives.
- Device-capability check may default low-power devices to a lighter 3D scene or high-resolution 2D plates.

Core interactions:

- Orbit with constrained angles; zoom; pan only when useful.
- Hover/focus outline; selection fill; related structures with lower-emphasis glow.
- Double-select or isolate control for isolation.
- X-ray/skeleton context only when it answers a question.
- Breadcrumb path: body → region → structure → subdivision.
- Reset, undo selection, and share view.
- Reduced-motion mode removes camera fly-throughs and animated material transitions.

### 6.3 Muscle page

Order the page from practical understanding to scientific depth:

1. Name, synonyms, region, status, last reviewed date.
2. Plain-language purpose statement.
3. Interactive isolated anatomy view plus accessible image/list alternative.
4. Attachments/structure overview when relevant.
5. Joint actions and context-dependent functions.
6. Lengthened, shortened, and mid-range positions described without overclaiming training outcomes.
7. Exercise relationships by role and rationale.
8. Regional or subdivision considerations.
9. Practical takeaways.
10. What is uncertain or commonly overstated.
11. Claim-by-claim evidence table.
12. References, changes, correction link, and related glossary terms.

### 6.4 Exercise page

1. Name, aliases, equipment, movement pattern, difficulty/context—not a universal difficulty score.
2. High-quality motion loop or staged stills; no autoplay audio.
3. Setup and execution checkpoints.
4. Joint actions by phase.
5. Target, assisting, and stabilizing structures with rationale and evidence type.
6. External resistance and moment-arm discussion with explicit assumptions.
7. Range-of-motion and body-position considerations.
8. Limiting factors and common technique variations.
9. When the exercise may be useful.
10. Substitutions chosen by the user's actual constraint.
11. Comparison links.
12. Evidence, uncertainty, and revision history.

Technique cues should describe observable execution, not enforce one “perfect” form. Safety language should remain general and direct users with pain, injury, or medical concerns to qualified professionals.

### 6.5 Comparison page

- Sticky entity headers.
- User-selectable outcome lens.
- Structured rows with matched definitions.
- Differences, similarities, unknowns, and context.
- Evidence quality for each row.
- No arbitrary weighted score.
- Stable shareable query/slug.

### 6.6 Source page

- Full bibliographic metadata.
- DOI, PMID/PMCID, registry ID where available, and publisher link.
- Study design, population, sample, duration, interventions/comparators, outcomes, and funding/conflicts.
- Access basis: open full text, full text obtained lawfully, abstract only, metadata only.
- Risk-of-bias fields appropriate to study design.
- Project-authored summary with limitations.
- Every project claim using the source.
- Correction, expression-of-concern, or retraction status and last check date.
- No reproduced protected tables, figures, or extensive text.

### 6.7 Methodology page

The methodology page must be unusually clear. It should disclose:

- Who operates the project.
- The AI-only production constraint.
- Exactly how AI is used.
- That AI review is not credentialed expert review.
- Search, screening, extraction, appraisal, synthesis, citation, update, and correction processes.
- Evidence-grade definitions and their limits.
- How conflicts and disagreements are handled.
- Known limitations of the initial catalog.
- How to report an error.

---

## 7. Premium visual and interaction direction

### 7.1 Chosen direction: Clinical Cinematic

Use realistic 3D anatomy, controlled dark gallery lighting, translucent contextual layers, precise labeling, restrained color, and museum-grade motion. Blend this with the typography and calm information hierarchy of a modern scientific atlas. Use the “performance lab” aesthetic only for optional analytical overlays.

The product must not resemble a neon gym app, a video game HUD, or a medical-device dashboard.

### 7.2 Visual system

Suggested starting tokens, subject to contrast testing:

- Background: near-black navy/graphite, not pure black.
- Elevated surface: blue-charcoal with subtle warm neutrality.
- Primary text: cool off-white.
- Secondary text: desaturated blue-gray.
- Anatomical muscle: restrained coral/carmine family.
- Active structure: brighter warm coral with luminance contrast.
- Evidence-high: desaturated teal.
- Evidence-moderate: ochre.
- Evidence-low/uncertain: muted violet or neutral gray; never alarming red.
- Warning/correction: amber; retraction: explicit red plus text/icon.

Typography:

- A high-quality variable grotesk or humanist sans for interface and body.
- A restrained serif may be used for plate numbers, editorial pullouts, or feature headings, not dense UI.
- Use tabular numerals for study and measurement data.
- Avoid ultra-light weights and low-contrast gray.

Layout and depth:

- Generous negative space.
- Hairline dividers and subtle optical borders.
- Two or three elevation levels only.
- Large, calm type rather than oversized marketing headlines.
- Motion should communicate spatial continuity, selection, and hierarchy.

### 7.3 Motion principles

- 180–260 ms for most UI transitions.
- 400–700 ms for deliberate camera transitions.
- Spring motion only where it improves spatial comprehension.
- Never animate continuously without purpose.
- Pause rendering when the 3D canvas is offscreen or the tab is hidden.
- Respect `prefers-reduced-motion` everywhere.
- Provide an immediate transition option for users prone to motion sensitivity.

### 7.4 3D selection and rendering rules

- Each selectable mesh has a stable `meshId` mapped to one anatomy entity ID.
- Selection must not rely on color alone; use outline, label, text state, and focus indication.
- Use physically plausible but simplified materials optimized for readability.
- Avoid photorealistic gore, excessive vascular detail, or visual clutter.
- The initial view should load a low-detail silhouette or preview before the interactive model.
- Load deeper layers and high-resolution textures on demand.
- Use compressed glTF/GLB with Meshopt or Draco where testing supports it, and KTX2/Basis textures where useful.
- Build at least three level-of-detail tiers or equivalent segmented bundles.
- Preserve a 2D anatomy plate and structured list for every selectable region.

### 7.5 Accessibility target

Target WCAG 2.2 Level AA. WCAG 2.2 is the current W3C Recommendation, and conformance requires testable accessibility across content and code, including dynamic content: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

The normative release gate is **zero unresolved applicable Level A or AA success-criterion failures** across the defined representative page and state matrix. Severity labels help prioritize repairs but do not excuse a conformance failure. Automated tools are necessary but insufficient; the matrix must include keyboard, screen-reader, reflow/zoom, reduced-motion, contrast, touch, no-WebGL, loading, error, and open-drawer states. Claude Review records findings, Codex repairs them, and the owner adjudicates genuinely ambiguous applicability questions using the W3C normative text. Ambiguity defaults to fail-closed. If the product cannot meet the target, do not claim conformance and do not launch until the owner explicitly reduces scope or supplies a conforming alternative.

3D-specific requirements:

- Every action reachable with keyboard.
- Visible focus state outside and inside the explorer controls.
- A semantic anatomy tree/list synchronized with the selection.
- Text alternatives that communicate location and relationship.
- No drag-only control; buttons for rotate, view, layer, isolate, and reset.
- Minimum target sizes and no focus obscured by drawers.
- A fully usable no-WebGL experience.
- Screen reader announcements for selection and layer changes.

---

## 8. Anatomy asset acquisition and licensing gate

The anatomy asset is the only planned paid build input. Do not purchase anything until the technical spike is complete.

### 8.1 Required asset capabilities

- Adult human skeletal-muscle anatomy with reliable naming.
- Separately selectable muscle meshes; useful subdivisions where relevant.
- Skeleton context and optional surface/skin layer.
- Consistent coordinate system and origin.
- Clean topology adequate for browser optimization.
- UVs/materials that survive web conversion.
- Male and female presentations preferred.
- Explicit right to modify, optimize, render on the web, distribute to site visitors, and use in a free public product.
- Commercially flexible terms preferred even though launch is free, to avoid a future rebuild.
- Clear attribution requirements.
- No prohibition on AI-assisted processing or code generation around the asset.

### 8.2 Candidate paths

**Path A — purchased commercial asset, recommended if it passes the spike.**  
Best chance of premium visuals, cleaner topology, and future flexibility. Require a written license archive and checksum of delivered files.

**Path B — Z-Anatomy.**  
Z-Anatomy is an open anatomy project and its published repository license is CC BY-SA 4.0. Share-alike and attribution obligations must be understood before adapting or redistributing it: [Z-Anatomy repository license](https://github.com/LluisV/Z-Anatomy/blob/PC-Version/LICENSE). Keep original and derived assets in a clearly attributed asset package and do not assume the entire application inherits or avoids share-alike without obtaining actual legal guidance.

**Path C — BodyParts3D/Anatomography.**  
Potentially useful for broad mesh coverage and ontology mapping, but topology, presentation quality, and exact current license/attribution terms must be verified from DBCLS before use: [BodyParts3D/Anatomography](https://bp3d-dev.dbcls.jp/).

### 8.3 Asset spike scorecard

Score each candidate 0–5 on:

| Criterion | Weight |
|---|---:|
| Anatomical coverage and naming accuracy | 20% |
| Mesh separability and mapping | 15% |
| Visual quality after optimization | 15% |
| Browser performance | 15% |
| License clarity and future flexibility | 20% |
| Ease of scripted Blender/glTF pipeline | 10% |
| Male/female or inclusive presentation options | 5% |

Reject any candidate with license clarity below 4/5, regardless of total score.

### 8.4 Asset handling rules

- Store original purchased/open assets outside the public repository unless their license permits repository distribution.
- Check in only authorized derivatives and required attribution notices.
- Create `docs/licenses/anatomy-assets.md` with source, purchase record, license snapshot, modifications, and attribution text.
- Create a deterministic Blender Python conversion pipeline; never rely on undocumented manual edits.
- Generate a machine-readable mesh manifest containing source mesh name, normalized entity ID, material, LOD, bounds, and checksum.
- Do not use generative image models to fabricate anatomical structures presented as accurate anatomy.

---

## 9. Scientific evidence and citation system

### 9.1 Why a custom system is required

Resistance-training questions combine several evidence families that cannot be ranked by one simplistic pyramid:

- Descriptive anatomy and terminology.
- Biomechanical modeling and direct measurements.
- Acute physiology and EMG.
- Longitudinal training interventions.
- Observational evidence.
- Systematic reviews and meta-analyses.
- Consensus and position statements.

Study design must be judged against the claim. A cadaver/anatomy reference can be highly appropriate for an attachment claim but weak for predicting hypertrophy. A training RCT may answer an adaptation question but not establish universal joint mechanics.

### 9.2 Methodological foundation

Use established methods as references, while explicitly stating that this project is an adapted educational evidence system and not an official GRADE or Cochrane review program:

- The official GRADE Book describes assessing certainty in evidence about effects and is replacing the older handbook: [GRADE Book](https://book.gradepro.org/).
- The Cochrane Handbook covers question formulation, searching, bias assessment, synthesis, GRADE, and interpretation: [Cochrane Handbook](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current).
- PRISMA 2020 provides transparent reporting guidance for systematic reviews: [PRISMA 2020](https://www.prisma-statement.org/prisma-2020).
- CONSORT 2025 is the current reporting guideline for randomized trials and may inform extraction completeness: [CONSORT 2025](https://www.equator-network.org/reporting-guidelines/consort/).

### 9.3 Claim taxonomy

Every publishable assertion must use one of these claim types:

| Claim type | Example form | Preferred evidence |
|---|---|---|
| Anatomy | “Structure X originates/inserts at…” | Authoritative anatomy references, ontology records, primary anatomical research |
| Function | “X contributes to action Y under condition Z” | Anatomy, in vivo biomechanics, modeling with stated assumptions |
| Exercise mechanics | “Changing setup A changes external demand B” | Direct kinematics/kinetics, validated models, transparent mechanical derivation |
| Acute response | “Exercise A produced greater acute measure B in population C” | Direct acute comparative studies |
| Longitudinal adaptation | “Protocol A changed outcome B over duration C” | Longitudinal RCTs; systematic reviews when sufficiently comparable |
| Association | “Variable A is associated with outcome B” | Observational evidence; no causal language |
| Practical synthesis | “A may be useful when constraint C applies” | Explicit synthesis linked to underlying claims |
| Safety/context | “People with condition/symptom X should seek…” | Conservative public-health/clinical guidance; avoid individualized advice |

### 9.4 Evidence certainty scale

Rate certainty for each claim, not each article or page.

**High**

- Directly relevant evidence with low major bias concerns.
- Consistent across multiple appropriate studies or supported by a strong, current synthesis.
- Reasonably precise for the scope of the claim.
- Little important indirectness for the target population, intervention, comparator, and outcome.

**Moderate**

- Evidence is generally supportive but one material limitation remains: risk of bias, inconsistency, imprecision, indirectness, or sparse replication.
- The practical conclusion is unlikely to reverse completely but may narrow.

**Low**

- Limited direct evidence, important design limitations, conflicting results, or substantial indirectness.
- Use cautious language such as “may,” “suggests,” or “is plausible.”

**Very low / hypothesis**

- Primarily mechanistic inference, acute proxy, expert interpretation, or highly uncertain evidence.
- May be included only when useful and explicitly labeled as a hypothesis or inference.

**Established descriptive fact**

- Reserved for stable nomenclature or basic anatomy supported by appropriate authoritative references.
- Do not use this label for comparative training outcomes.

Certainty is separate from:

- **Effect magnitude:** trivial, small, moderate, large, or not estimable.
- **Direction:** favors A, favors B, mixed, no clear difference, or unknown.
- **Applicability:** direct, partially direct, or indirect to the site's target user.
- **Recency:** current, review due, or stale.

### 9.5 Language calibration

| Certainty | Allowed phrasing | Avoid |
|---|---|---|
| High | “does,” “increases,” “is,” within the exact claim scope | “always,” “guarantees,” “best for everyone” |
| Moderate | “likely,” “probably,” “evidence supports” | categorical universal language |
| Low | “may,” “suggests,” “limited evidence indicates” | causal certainty |
| Very low | “is plausible,” “hypothesis,” “cannot establish” | recommendations presented as evidence-backed |

All conclusions must name the outcome. “Better” is prohibited without “better for what?”

### 9.6 Source discovery and metadata

Primary discovery channels:

- PubMed/MEDLINE, using MeSH plus free text. NLM identifies MeSH as its controlled vocabulary for indexing PubMed: [MeSH](https://www.ncbi.nlm.nih.gov/mesh).
- PubMed E-utilities for structured acquisition. NCBI documents E-utilities as the public API for Entrez databases including PubMed and PMC: [NCBI APIs](https://www.ncbi.nlm.nih.gov/home/develop/api/).
- Crossref REST API for DOI and publication metadata. Crossref exposes member-deposited scholarly metadata and post-publication updates: [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/).
- Citation chaining from included reviews and primary studies.
- Trial registries and publisher pages when needed to verify protocols, outcomes, corrections, or supplementary material.

Use API identification and rate limits. Do not scrape sites when an official API or lawful export exists.

### 9.7 Retraction and correction control

- Check every DOI against Crossref metadata before publication.
- Query Crossref/Retraction Watch data for retractions and updates.
- Store `publicationStatus`, `statusCheckedAt`, and the status source.
- Block a source marked retracted from supporting a live claim.
- Route expressions of concern and major corrections to manual AI re-evaluation before publication.
- Run a scheduled full-catalog status check at least monthly.

**Emergency static-site response:** A status check that detects a retraction, expression of concern, or material correction must create a blocking incident with the affected source and a reverse-graph list of every dependent claim and page. Notify the owner immediately. Within 24 hours of confirmation, Codex must generate and deploy an emergency content revision that either (a) removes affected claims/pages, or (b) replaces them with a prominent correction state that does not repeat the unsupported claim. A failed normal build must not leave the old assertion silently live: the emergency pipeline uses a minimal known-good branch, can unpublish affected IDs without rebuilding 3D assets, and includes a tested rollback to the most recent scientifically valid content snapshot. The incident closes only after Claude Review verifies the deployed pages and a public change record is published.

Crossref makes Retraction Watch data available through its REST API and downloadable dataset: [Crossref Retraction Watch documentation](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/).

Non-DOI sources use a source-type-specific status method:

| Source type | Authoritative verification | Maximum age at publication | Failure behavior |
|---|---|---:|---|
| PMID/PMCID without DOI | NCBI PubMed/PMC record and linked notices | 30 days | Block new publication; incident if already live and materially changed |
| Book/textbook | Official publisher edition/errata page and ISBN/edition | 12 months | Mark stale and block new claims until manually rechecked |
| Anatomy ontology/dataset | Official release page/repository, version, checksum, and change log | 12 months | Pin prior valid version; block updated claims until mapping review |
| Guideline/position statement | Issuing organization's official page and supersession notice | 90 days | Block or supersede dependent recommendation claims |
| Institutional web reference | Official canonical URL plus archived access date | 6 months | Mark stale; replace or manually verify before publication |
| Other/no authoritative status feed | Manual verification against publisher/issuer and documented search for withdrawal/correction | 6 months | Ineligible for new publication when overdue |

Every source records `statusMethod`, `statusSource`, `statusCheckedAt`, `nextStatusCheckAt`, and version/edition where applicable. A transient API outage fails the current check without falsely labeling a source invalid; new publication remains blocked until a successful check, while live content enters a visible internal incident queue for retry and risk assessment.

### 9.8 Research pipeline

Use this auditable state machine:

`scope → search → acquire → screen → extract → appraise → synthesize → draft → citation-audit → adversarial-review → owner-approve → publish → monitor`

Each stage writes a separate artifact. A downstream stage may not overwrite upstream material.

1. **Scope:** Write a PICO/PECO-style question where applicable; define population, exercise/protocol, comparator, outcome, timeframe, and exclusions.
2. **Search:** Save exact database, date, full query, filters, and result count.
3. **Acquire:** Store lawful metadata and links; store full text only where access and local use permit it.
4. **Screen:** Record include/exclude decisions and a reason.
5. **Extract:** Capture study facts into a fixed schema; distinguish reported data from interpretation.
6. **Appraise:** Assess design-specific bias and applicability.
7. **Synthesize:** Compare findings, heterogeneity, directness, and gaps. Never average incompatible outcomes casually.
8. **Draft:** Produce atomic claims and reader-facing text only from the evidence packet.
9. **Citation audit:** A separate model verifies each claim against the exact cited passage or data.
10. **Adversarial review:** Search for contradictory evidence, overreach, missing qualifiers, and alternative explanations.
11. **Owner approval:** Human owner reviews a concise decision packet and approves publication.
12. **Publish:** Codex integrates records only after all gates pass.
13. **Monitor:** Re-run searches and status checks on schedule.

### 9.9 Full-text and copyright rules

- Metadata may be stored where provider terms permit.
- Do not publish copied abstracts, article text, tables, or figures.
- Project summaries must be original and traceable.
- If only an abstract is available, set `accessLevel: abstract-only` and narrow claims to what the abstract actually supports.
- Do not infer missing methods or results.
- Keep quotation fragments minimal and only when necessary.
- Record licenses for any reused image, diagram, dataset, or model.
- OpenStax Anatomy & Physiology 2e is openly available under CC BY-NC-SA, but its official page now states it may not be ingested into LLMs or generative AI offerings without permission. Because this is an AI-only workflow, do not ingest or adapt it unless explicit permission is obtained: [OpenStax Anatomy & Physiology 2e preface and terms](https://openstax.org/books/anatomy-and-physiology-2e/pages/preface).

### 9.10 AI cross-review protocol

AI independence is procedural, not scientific credentialing.

- Claude Research creates the evidence packet and draft claim set.
- Claude Review receives the question, packet, sources, and rubric—but not Claude Research's chain-of-thought or persuasive commentary.
- Claude Review attempts to falsify claims, checks citation entailment, and reports pass/fail with reasons.
- Codex runs automated schema, DOI, status, link, and graph checks, then integrates approved content.
- Codex may flag scientific issues but must not waive failed evidence gates.
- A claim disputed by the two reviewers remains `blocked` until the conflict is resolved from sources or the claim is weakened/removed.
- The public methodology page must say “independently checked by a second AI system,” never “peer reviewed.”

### 9.11 Update cadence

| Content type | Search refresh | Mandatory review |
|---|---:|---:|
| Fast-moving training outcome claims | Every 6 months | Annually or when new material evidence appears |
| Stable anatomy/function | Annually | Every 24 months |
| Exercise mechanics | Annually | Every 18 months |
| Source correction/retraction status | Monthly automated check | Immediate on flag |
| Methodology | Every 6 months | On any workflow/schema change |

---

## 10. Knowledge graph and content schemas

### 10.1 Entity types

- `anatomy-region`
- `muscle`
- `muscle-region-or-head`
- `bone-landmark`
- `joint`
- `joint-action`
- `movement-pattern`
- `exercise`
- `exercise-variation`
- `equipment`
- `claim`
- `source`
- `evidence-packet`
- `glossary-term`
- `asset`
- `change-record`
- `approval-manifest`

Use lowercase kebab-case IDs that never depend on display names. IDs are immutable after publication.

### 10.2 Relationship types

- `part-of`
- `located-in`
- `attaches-to`
- `crosses-joint`
- `contributes-to-action`
- `lengthened-by`
- `shortened-by`
- `primary-target-of`
- `assists-in`
- `stabilizes-during`
- `variation-of`
- `uses-equipment`
- `substitute-for`
- `contrasts-with`
- `supported-by`
- `qualifies`
- `contradicts`
- `supersedes`

Every relationship may have a `claimId`; no training-relevant relationship should exist as an uncited assertion.

### 10.3 Claim record example

```yaml
id: claim-pec-major-horizontal-adduction
type: function
reviewState: approved
publicationState: published
statement: "The pectoralis major contributes to humeral horizontal adduction."
plainLanguage: "It helps move the upper arm across the torso."
scope:
  population: adult-human
  conditions:
    - glenohumeral-joint
qualifiers:
  - "Contribution varies with shoulder position and the action of other muscles."
evidence:
  certainty: high
  applicability: direct
  direction: not-applicable
  magnitude: not-applicable
sourceLinks:
  - sourceId: source-example-001
    locator: "chapter/figure/page or exact extracted field"
    role: supports
    supportStrength: direct
  - sourceId: source-example-contradiction
    locator: "exact location of conflicting or qualifying evidence"
    role: qualifies
    supportStrength: direct
review:
  researchedBy: claude-research
  auditedBy: claude-review
  integratedBy: codex
  ownerApprovedAt: "<ISO-8601 timestamp before publication>"
  lastReviewedAt: null
  reviewDueAt: null
history:
  createdAt: null
  updatedAt: null
```

### 10.4 Source record example

```yaml
id: source-doi-10_xxxx_example
type: randomized-trial
title: "Exact title"
authors: []
year: 2025
identifiers:
  doi: "10.xxxx/example"
  pmid: null
  pmcid: null
urls:
  doi: "https://doi.org/10.xxxx/example"
  pubmed: null
access:
  level: full-text-open
  license: null
study:
  population: ""
  sampleSize: null
  durationWeeks: null
  intervention: ""
  comparator: ""
  outcomes: []
quality:
  riskOfBias: some-concerns
  applicability: partially-direct
  notes: []
publication:
  status: current
  statusCheckedAt: null
  statusSource: crossref
  statusMethod: doi-crossref-retraction-watch
  nextStatusCheckAt: null
funding: null
conflicts: null
projectSummary: "Original summary; no copied abstract."
```

### 10.5 Exercise record minimum fields

- Identity, aliases, slug, publication status.
- Equipment and setup requirements.
- Movement pattern and unilateral/bilateral classification.
- Staged execution phases.
- Joint actions per phase.
- Range-of-motion notes with measurement basis.
- Muscle relationships by `primary`, `assisting`, `stabilizing`, or `uncertain`.
- Resistance source, line of force, relevant external moment discussion, and assumptions.
- Variations and substitutions linked by constraint.
- Cues, common deviations, and general safety boundary.
- Claim IDs for every factual or comparative statement.
- Asset IDs for images/video/3D pose.
- Review and freshness metadata.

### 10.6 Minimum fields for remaining entity types

| Entity | Storage | Required fields beyond common identity/status/review metadata |
|---|---|---|
| Anatomy region | `content/anatomy-regions/` | parent region, child structures, body views, mesh/poster assets |
| Muscle subdivision/head | `content/muscle-subdivisions/` | parent muscle, regional description, distinguishing claims, mesh IDs |
| Bone landmark | `content/bone-landmarks/` | parent bone/region, attachment relationships, ontology IDs |
| Joint | `content/joints/` | articulating structures, degrees of freedom, linked actions |
| Joint action | `content/joint-actions/` | joint, plane/axis where applicable, definition claim, synonyms |
| Movement pattern | `content/movement-patterns/` | definition, included exercises, boundary/exclusion notes |
| Exercise variation | `content/exercise-variations/` | canonical exercise, changed variables, resulting claim IDs |
| Equipment | `content/equipment/` | equipment class, resistance source, aliases |
| Evidence packet | `research/packets/` | question, search IDs, included source IDs, synthesis, decision log |
| Asset | `content/assets/` | type, source/license, file IDs, dimensions/duration, entity mappings |
| Change record | `content/changes/` | affected IDs, reason, before/after summary, approval and deployment IDs |
| Approval manifest | `content/approval-manifests/` | immutable manifest ID, scope/batch ID, exact entity/page IDs and checksums, source commit, required review-report IDs/checksums, owner identity, approval decision/timestamp, integrator, deployment eligibility, superseded-manifest ID |

All publishable entity types separate **review state** (`draft`, `in-review`, `blocked`, `approved`) from **publication state** (`unpublished`, `scheduled`, `published`, `superseded`, `withdrawn`). A record may become `published` only when `reviewState: approved`, `ownerApprovedAt` is non-null, all required checks are current, and the exact content checksum appears in an approved page or batch manifest. Any content change resets review state to `in-review` unless a schema-defined non-substantive change exemption is recorded. Research packets are auditable inputs and never become public merely because a content record references them.

Claim source links use `role: supports | qualifies | contradicts | neutral-context`. Every link includes a locator and support-strength/directness field. The build must render an “Evidence is mixed or qualified” disclosure whenever an approved claim has `qualifies` or `contradicts` links, and the evidence view must show those sources alongside supporting evidence. Contradictory evidence may not remain only in private research notes.

Approval manifests are append-only and immutable. An approval applies only to the exact checksums and source commit listed in the manifest; changing any included entity/page invalidates eligibility and requires a new manifest. A new manifest may supersede an older one but never edits or deletes it. The graph compiler joins every live page/claim to exactly one current, owner-approved manifest, verifies all checksums and required review reports, and fails on missing manifests, duplicate-current manifests, checksum drift, an unapproved decision, or a supersession chain that does not terminate cleanly.

### 10.7 Enforceable claim rendering rules

Factual prose may not be written as unconstrained MDX. Public content must use one of these mechanisms:

- `<Claim id="claim-id" />` renders the approved statement and citation from the claim record.
- `<ClaimGroup ids={[...]} framing="..." />` renders a reviewed synthesis block whose framing text is stored and audited in a synthesis record.
- Explicitly marked `editorial` fields may contain navigation, transitions, instructions, or disclosed opinion, but no external factual assertion.

An MDX AST linter must reject sentences in factual sections that are not inside an approved claim component. Raw HTML is prohibited. Each page schema enumerates which fields are factual, editorial, or presentation-only. An exceptional free-prose block requires an `escapeReviewId`, a full citation audit, and Claude Review approval; it is intended for unusual methodology explanation, not ordinary authoring. Rendered pages include hidden machine-readable claim IDs so end-to-end tests can compare visible factual blocks to the approved registry.

### 10.8 Graph integrity rules

The build fails when:

- An ID is duplicated or a reference is missing.
- A published claim has no source.
- A cited source is retracted, has a missing/failed status method, has no `nextStatusCheckAt`, or has an overdue status check under the source-type policy in Section 9.7.
- A public relationship lacks a required claim.
- A live page contains a claim whose `reviewState` is not `approved`, whose `publicationState` is not `published`, whose `ownerApprovedAt` is null, or whose checksum is absent from the applicable approved manifest.
- A source URL/DOI fails normalization.
- A selectable mesh has no entity mapping or an entity points to a missing mesh.
- Synonyms collide without an explicit disambiguation record.
- Review dates are missing or overdue beyond the allowed grace period.
- Content contains banned certainty phrases inconsistent with its grade.

---

## 11. Technical architecture

### 11.1 Why static-first

Release 1 has no accounts, user content, payments, or personalized data. A runtime database would add cost, attack surface, operational work, and schema complexity without adding user value. Build the approved graph into static pages and versioned JSON bundles.

Use a runtime service only if a future feature proves it needs one.

### 11.2 Recommended application architecture

- **Astro:** page routing, static generation, layouts, content rendering, sitemap, metadata, and minimal client JavaScript.
- **React islands:** anatomy explorer, compare interface, global command search, and other stateful interaction.
- **React Three Fiber/Three.js:** 3D scene graph, raycasting, materials, camera, loading, and render-loop control.
- **Zod:** schemas for content, research artifacts, mesh manifests, and generated graph data.
- **MDX:** curated editorial body sections only; factual claims still reference typed IDs.
- **Pagefind:** build-time search index for pages and structured metadata.
- **Static JSON graph:** generated from validated source records for client-side related-entity traversal.
- **Cloudflare Pages:** static host candidate.
- **Cloudflare R2 or equivalent:** large GLB/KTX2 assets with cache headers and cross-origin configuration.

Astro content collections support schema validation and references and can generate static routes, matching the typed, static-first plan: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/).

### 11.3 Repository structure

```text
science-lifting-atlas/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── astro.config.mjs
├── tsconfig.json
├── .github/
│   ├── workflows/ci.yml
│   ├── workflows/source-status.yml
│   └── pull_request_template.md
├── docs/
│   ├── adr/
│   ├── evidence-methodology.md
│   ├── editorial-style.md
│   ├── licenses/anatomy-assets.md
│   ├── product/
│   └── runbooks/
├── content/
│   ├── anatomy-regions/
│   ├── muscles/
│   ├── muscle-subdivisions/
│   ├── bone-landmarks/
│   ├── joints/
│   ├── joint-actions/
│   ├── movement-patterns/
│   ├── exercises/
│   ├── exercise-variations/
│   ├── equipment/
│   ├── claims/
│   ├── sources/
│   ├── assets/
│   ├── approval-manifests/
│   ├── glossary/
│   └── changes/
├── content-drafts/
│   ├── muscles/
│   ├── exercises/
│   └── syntheses/
├── research/
│   ├── questions/
│   ├── searches/
│   ├── screening/
│   ├── extractions/
│   ├── appraisals/
│   ├── syntheses/
│   └── packets/
├── reviews/
│   ├── evidence/
│   ├── citations/
│   ├── ux/
│   └── releases/
├── public/
│   ├── anatomy/
│   │   ├── manifests/
│   │   ├── models/
│   │   ├── posters/
│   │   └── attributions/
│   ├── exercise-media/
│   └── fonts/
├── scripts/
│   ├── blender/
│   ├── content/
│   ├── evidence/
│   └── release/
├── src/
│   ├── components/
│   ├── features/
│   │   ├── anatomy-explorer/
│   │   ├── comparison/
│   │   ├── evidence/
│   │   └── search/
│   ├── layouts/
│   ├── lib/
│   │   ├── content/
│   │   ├── evidence/
│   │   ├── graph/
│   │   └── seo/
│   ├── pages/
│   ├── styles/
│   └── content.config.ts
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    ├── accessibility/
    ├── performance/
    ├── visual/
    └── fixtures/
```

### 11.4 Feature boundaries

**`anatomy-explorer`**

- Owns scene initialization, camera, mesh registry, selection, layer state, focus/keyboard bridge, and accessible anatomy tree.
- Depends on generated manifest and entity summary data.
- Does not own editorial content or evidence grading.

**`evidence`**

- Owns evidence badges, claim cards, source lists, status warnings, and methodology explanations.
- Consumes validated claim/source records.
- Does not fetch arbitrary research at runtime.

**`comparison`**

- Owns selection of exactly two comparable entities, outcome lens, structured rows, and stable URL state.
- Computes presentation from existing records; it does not invent comparative conclusions.

**`search`**

- Owns indexed terms, synonyms, disambiguation, results ranking, and command UI.
- Uses build-time index; no model call.

**`content pipeline`**

- Validates schemas, normalizes identifiers, creates the graph, checks publication gates, generates search documents, and fails loudly.
- Must be deterministic and testable.

### 11.5 Data flow

```text
Official APIs / lawful source access
    ↓
Research artifacts (immutable by stage)
    ↓
Evidence packet + atomic claim drafts
    ↓ independent citation and adversarial reviews
Approved YAML/MDX content records
    ↓ Zod + integrity + source-status checks
Generated graph / search index / static routes
    ↓
Astro pages + React/Three anatomy island
    ↓
Static host + versioned model CDN
```

### 11.6 Error and fallback behavior

- If a model bundle fails, show the anatomy poster/list and preserve page navigation.
- If WebGL context is lost, offer retry and switch to fallback after one failed retry.
- If a content record fails validation, fail the build; never silently omit it.
- If an external source link is unavailable, keep the local metadata, mark the link check, and link DOI resolver/PubMed where possible.
- If a source becomes retracted or materially corrected, invoke the emergency unpublish/correction deployment in Section 9.7; do not rely on an unchanged last deployment to communicate the incident.
- If client JavaScript fails, static page content and source lists remain readable.
- If search fails, index pages and anatomy list remain navigable.

### 11.7 Security and privacy

- No accounts or user database in Release 1.
- Strict Content Security Policy; limit script origins.
- Self-host fonts where license permits.
- Pin dependencies and run automated audits.
- Sanitize any MDX or generated HTML at build time; do not permit arbitrary raw HTML from research artifacts.
- Use Subresource Integrity where appropriate for external static assets, or avoid external scripts.
- Collect no sensitive health data.
- Use cookieless analytics with minimal event names and no free-text queries unless explicitly scrubbed.
- Publish a plain-language privacy page even if no cookies are used.

### 11.8 Free-infrastructure and analytics gate

The operating-cost target is **$0/month excluding the anatomy-model purchase and domain registration**. No service may auto-upgrade or incur usage charges. Any forecast above $5/month requires an owner decision and ADR.

Before provider selection, Codex must model at least 10,000, 100,000, and 1,000,000 monthly page views using measured HTML/JS/image/model transfer, build frequency, object operations, and log/analytics volume. Record current provider quotas with date and source; never copy assumed free-tier limits from model memory. Configure usage alerts at 70% and 85% where the provider supports them. Verify the site can export and deploy to a second static host from the same build artifact.

**Queue-staging clarification for SBLA-003 only (owner-authorized 2026-09-01; not final provider or ADR approval):** measure every artifact and payload that exists at SBLA-003, and use explicit budget-derived ceilings for components that the approved queue has not built yet. Label the result capacity planning, not a forecast. Before any production provider activation, SBLA-012 must replace the HTML/JS/image inputs, SBLA-015 must replace the model/media inputs, and SBLA-016 must replace the Pagefind input with representative measurements and rerun all three scenarios. This makes the Phase 0 queue executable; it does not weaken or waive those later measurement gates.

Analytics is optional and must not block launch. Release 1 must not create a persistent per-user identifier solely to calculate retention. If a cookieless provider can report aggregate repeat visits without persistent individual tracking, the metric may be used with disclosure; otherwise omit it. Allowed event names are enumerated (`search_submitted`, `entity_selected`, `related_opened`, `evidence_opened`, `source_opened`, `comparison_shared`, `webgl_fallback`) and contain entity IDs or controlled categories only—never raw queries, URLs containing health information, or free text. Pre-launch performance gates use lab measurements; field Core Web Vitals become a post-launch gate only after the sample is sufficient for a stable 75th percentile.

### 11.9 Exercise media production and license gate

Release 1 should prefer scripted staged stills, joint-path diagrams, and short rigged 3D loops derived from an asset whose license explicitly permits those outputs. Do not depend on generated photoreal human video: technique drift and anatomical artifacts are too difficult to validate. If the anatomy model cannot be rigged appropriately, use authored vector/staged diagrams and omit motion rather than publish misleading movement.

Every exercise-media asset needs a record with source, generation method, license, technique version, reviewer, linked exercise/phase, duration/dimensions, accessibility description, and checksum. Claude Research defines the observable technique checkpoints; Codex produces the media deterministically; Claude Review compares every keyframe/phase with the approved exercise record. Initial budgets: poster ≤200 KB in modern formats; short loop target ≤1.5 MB and hard ceiling 3 MB; load only on intent or viewport entry. Add exercise-media accuracy, rights, and production capacity to the asset spike and risk register.

---

## 12. Testing and quality gates

### 12.1 Test layers

**Schema tests**

- Valid and invalid fixtures for every entity.
- Enum, date, identifier, relationship, and publication-state validation.

**Graph integrity tests**

- Referential integrity.
- No cycles where relationships prohibit cycles.
- Orphan detection.
- Mesh/entity mapping completeness.
- Synonym collision detection.

**Evidence tests**

- Published claims require approved evidence and a source.
- Certainty-language linting.
- DOI/PMID normalization.
- Retraction/correction status rules.
- Review freshness rules.
- Citation locator presence.

**Unit tests**

- Entity adapters, filters, relationship traversal, URL state, comparison rows, evidence badges, and fallback selection.

**Component tests**

- Keyboard anatomy controls.
- Selection drawer behavior.
- Evidence expand/collapse.
- Search/disambiguation.

**End-to-end tests**

- Body → muscle → exercise → source journey.
- Exercise → compare → share → reload journey.
- No-WebGL journey.
- Mobile bottom-sheet journey.
- Keyboard-only journey.

**Accessibility tests**

- axe automated checks on every page archetype.
- Keyboard walkthrough.
- Screen reader smoke tests.
- High zoom and text reflow.
- Reduced motion, high contrast, and color-independence checks.

**Visual regression tests**

- Desktop and mobile screenshots for all archetypes.
- Deterministic 3D camera snapshots using fixed renderer settings where possible.
- Dark/light OS rendering behavior if only one site theme is offered.

**Performance tests**

- Bundle budgets.
- Initial anatomy asset transfer.
- Time to first useful static content.
- WebGL frame time on representative low/mid/high devices.
- Memory and context-loss behavior.
- Lighthouse CI as a regression indicator; field Web Vitals after launch.

### 12.2 Initial budgets

- Static non-3D page JavaScript: target ≤100 KB gzip, hard ceiling 160 KB before exception.
- Anatomy page application JavaScript excluding 3D engine: target ≤180 KB gzip.
- Initial 3D preview/model payload on desktop: target ≤6 MB; hard ceiling 10 MB.
- Initial mobile interactive payload: target ≤3 MB or default to progressive 2D/light 3D.
- No page-level layout shift from delayed anatomy/citation components.
- 3D interaction target: 55–60 fps on a defined mid-tier test device; graceful 30 fps mode on low-tier devices.
- Pause or reduce render loop when idle.

Budgets may change only through an ADR containing measured evidence and an alternative considered.

### 12.3 Page Definition of Done

A muscle or exercise page is publishable only when:

- All required schema fields are complete.
- Every factual/comparative statement maps to approved claim IDs.
- Every claim passes citation and adversarial review.
- No source is retracted or improperly licensed.
- Practical takeaways match the certainty level.
- Uncertainty and limitations are visible.
- Related entity links are valid.
- 3D mapping or accessible visual fallback exists.
- Mobile, keyboard, and screen-reader flows pass.
- Page archetype visual regression is approved.
- Performance budgets pass.
- Owner approval is recorded either for the individual page or through an approved batch manifest containing the exact page/content checksums. Batch approval is valid only after the owner reviews the required representative set: at least one muscle page, one exercise page, one comparison/evidence path, and every new page archetype or materially new claim pattern in that batch.

### 12.4 Release Definition of Done

- Scope catalog is complete; no placeholder pages.
- All CI checks pass from a clean checkout.
- Critical and high security findings are zero.
- Unresolved applicable WCAG 2.2 Level A or AA failures are zero across the representative state matrix; the conformance report names every tested page/state, tool, manual method, and reviewer.
- All DOI/source status checks pass.
- Every published claim has already passed a full first-pass citation-entailment and adversarial review. Immediately before release, an additional randomly selected 10% plus every high-impact comparative claim is re-audited from source, with zero unsupported claims.
- Every page type completes the primary journey on desktop and mobile.
- No-WebGL fallback is complete.
- License/attribution inventory is complete.
- Backup/restore and rollback runbooks are tested.
- Methodology, limitations, correction, accessibility, privacy, and attribution pages are public.

---

## 13. AI team operating model

### 13.1 Human owner

The human owner is accountable for:

- Vision, naming, scope, and final product decisions.
- Purchasing/licensing the anatomy model.
- Providing lawful access to source material.
- Approving milestone gates and public releases.
- Resolving conflicts that evidence cannot resolve.
- Never being asked to manually write code or research summaries unless desired.

The owner should receive short decision packets, not raw model debate.

### 13.2 Codex — Technical Lead, Maintainer, and Integrator

Codex owns:

- Repository initialization and branch hygiene.
- Architecture and ADR implementation.
- Schemas, validation, graph compiler, search index, and build tooling.
- UI, design system, 3D engine, accessibility, performance, and deployment.
- Blender/glTF automation scripts and asset manifests.
- Automated tests, CI, security, and release tooling.
- Integrating only research/content that passes gates.
- Converting review failures into tracked fixes.
- Maintaining `AGENTS.md`, task state, and exact commands.

Codex must not:

- Invent or approve scientific claims.
- Weaken a failed evidence gate to make a build pass.
- rewrite Claude's source extraction silently.
- merge simultaneous edits without inspecting the diff.

### 13.3 Claude Research — Evidence Lead and Content Drafter

Use Claude Team account A for this role.

Claude Research owns:

- Research questions and search strategies.
- Screening logs and source metadata.
- Structured extraction and risk/applicability notes.
- Evidence synthesis and contradiction maps.
- Atomic claim drafts with scope and evidence grades.
- Editorial drafts generated strictly from approved claims.
- Glossary and plain-language explanations.
- Content backlog coverage reports.

Claude Research writes only within assigned `research/` paths and designated draft content paths. It must never edit application code, schemas, published content, CI, or release state.

### 13.4 Claude Review — Independent Evidence, UX, and Release Auditor

Use Claude Team account B for this role.

Claude Review owns:

- Citation entailment audits.
- Adversarial evidence review and contradictory-source search.
- Scope/wording/certainty checks.
- Content consistency and plagiarism-style checks.
- UX specification review against audience and accessibility requirements.
- Milestone acceptance review using the relevant checklist.
- Random pre-release claim audit.

Claude Review writes only to `reviews/`. It does not repair the work it audits. Findings go back to the original owner for repair, then Claude Review rechecks the complete artifact.

### 13.5 Work ownership matrix

| Work product | Creates | Reviews | Integrates/approves |
|---|---|---|---|
| Product/architecture decision | Codex drafts | Claude Review | Human owner |
| Research question/search | Claude Research | Claude Review | Human owner for major scope |
| Source extraction | Claude Research | Claude Review sample/full based on risk | Codex validates schema |
| Claim set | Claude Research | Claude Review | Human owner + Codex integration |
| Editorial page | Claude Research | Claude Review | Codex |
| Schema/pipeline | Codex | Claude Review against spec | Codex after tests |
| UI/3D implementation | Codex | Claude Review UX audit + automated tests | Human owner at visual gates |
| Scientific methodology | Claude Research + Codex | Claude Review | Human owner |
| Release | Codex | Claude Review | Human owner |

### 13.6 Handoff packet format

Every handoff must include:

```markdown
# Handoff: <task ID and title>

## Objective
## Inputs and exact paths
## Constraints
## Work completed
## Decisions made
## Tests/checks run and results
## Known uncertainties
## Files created or modified
## Required reviewer action
## Acceptance criteria
```

No handoff may rely on hidden chat context. The repository artifact must be sufficient.

### 13.7 Conflict and edit rules

- One writer owns a file at a time.
- Claude Research and Claude Review never edit the same artifact.
- Codex is the only agent that promotes draft content to published `content/` paths.
- Claude Research writes candidate pages only to `content-drafts/`; Claude Review writes only immutable review reports to `reviews/<discipline>/<task-id>-r<number>.md`.
- Use branches `codex/<task-id>-<slug>`, `claude-research/<task-id>-<slug>`, and `claude-review/<task-id>-<slug>`. If the tools cannot share branches safely, use separate Git worktrees created from the same reviewed base commit.
- Before work begins, claim the task and exact paths in `docs/runbooks/current-work.md` with owner, branch/worktree, base commit, start time, and expected handoff. Codex is the only merge authority.
- An ownership lock becomes stale after 24 hours with no handoff or active session. Codex may clear it only after checking the branch/worktree for unmerged changes and recording the recovery action; never delete unmerged work.
- Review reports are append-only. A new review round creates a new `-r<number>` file and points to the exact commit/artifact checksum reviewed.
- Before editing, inspect repository status and existing diffs.
- Never discard another agent's changes.
- If two outputs conflict, create a decision note with evidence; do not blend them silently.
- Every milestone ends with a clean, tested commit and a reviewer report.

Every task uses these repository commands after Task SBLA-001 defines them:

- `pnpm verify` — format check, lint, type-check, unit/integration tests, schema/graph/evidence validation, and production build.
- `pnpm test:e2e` — representative end-to-end journeys.
- `pnpm test:a11y` — automated accessibility matrix; manual results remain separate.
- `pnpm test:visual` — deterministic page and 3D snapshots.
- `pnpm test:performance` — bundle and asset budgets plus lab checks.
- `pnpm evidence:status` — identifier normalization plus source-type-specific current-status, version/edition, correction/retraction/supersession, and freshness checks for DOI and non-DOI sources. Missing, failed, or overdue checks return non-zero when they affect content eligible for publication.

The command names are a contract. Task SBLA-001 must implement them even if underlying tools change.

### 13.8 Model prompts

#### Codex session header

```text
Read the entire master plan, AGENTS.md, current-work.md, and all ADRs relevant to this task.
You are the technical lead and repository integrator. Work only on the assigned task ID.
Preserve existing work. Use tests first for behavior changes. Do not invent or approve scientific claims.
Run the exact acceptance checks, record results, update the handoff packet, and stop at the review gate.
```

#### Claude Research session header

```text
Read the entire master plan and the assigned research question packet.
You are the evidence lead. Use only lawful, identifiable sources. Separate extracted facts from interpretation.
Do not use model memory as evidence. Do not draft beyond the claim scope. Record search strategy, access level,
study limitations, applicability, conflicts, contradictory evidence, exact citation locators, and uncertainty.
Write only to the assigned research/draft paths and produce a complete handoff packet.
```

#### Claude Review session header

```text
Read the entire master plan, the assigned artifact, sources, and acceptance rubric.
You are an independent adversarial reviewer. Do not repair the artifact. Attempt to falsify its claims and identify
missing qualifiers, unsupported citations, licensing problems, accessibility failures, and scope drift.
Return PASS or FAIL per criterion with evidence and exact paths/locations. Write only to the assigned review file.
```

### 13.9 Claude environment readiness and file transfer

Complete this gate before SBLA-008. Do not assume a Claude Team web account has repository, terminal, Git, or local full-text access.

**Preferred environment:** Each Claude role runs in a repository-capable environment with its own worktree, least-privilege Git credentials, and access only to the task's lawful source directory. Production deployment credentials and unrelated full-text sources are never exposed.

**Readiness test for each account:**

- Read the master plan and a test task packet.
- Read assigned repository paths at the reviewed base commit.
- Create a file in its permitted path, produce a diff, and create a handoff packet.
- For repository-capable use, create the correctly named branch and commit without touching prohibited paths.
- For evidence work, open one lawful test source and produce a locator-backed extraction.
- Pass a path-boundary check that rejects edits outside the role's allowed directories.

**Web/chat-only fallback:** Codex creates a versioned task bundle containing the master plan, schemas, assigned artifacts, source metadata, and only those full-text files whose license/access terms and the owner's authorization permit upload to that service. The owner uploads the bundle and downloads Claude's returned Markdown/YAML files. Codex places returned files into permitted draft/review paths, records their original checksums, validates them as untrusted input, and commits them. If restricted full text cannot lawfully be uploaded, that Claude account may not review claims dependent on it; use a repository/local environment with lawful access or exclude/narrow the claim. Never paste secrets, Git credentials, private keys, or deployment tokens into chat.

Record environment type, Git remote/credential method, source-transfer method, allowed directories, readiness result, and fallback in `docs/runbooks/claude-environments.md`. SBLA-008 is blocked until both Claude roles pass or the fallback is demonstrated end-to-end.

---

## 14. Phased execution roadmap

Do not begin mass content production or full 3D integration before the “vertical slice” gate. Each phase must create working, reviewable output.

### Phase 0 — Foundation and risk retirement

**Outcome:** A repository, operating rules, decision records, and validated choices for architecture and anatomy assets.

#### Task 0.1 — Initialize the repository

**Owner:** Codex  
**Reviewer:** Claude Review

**Files:** Create the root files and directories shown in Section 11.3.

- [ ] Initialize Git and the pnpm workspace.
- [ ] Pin the current stable Node.js and pnpm versions in the repository.
- [ ] Scaffold Astro + TypeScript with strict settings.
- [ ] Add formatting, linting, unit test, E2E, and type-check commands.
- [ ] Create `AGENTS.md` and `CLAUDE.md` containing the role and handoff rules from this plan.
- [ ] Create `docs/runbooks/current-work.md` and task/handoff templates.
- [ ] Add `.superpowers/`, original licensed assets, full-text source files, secrets, and local caches to `.gitignore` as appropriate.
- [ ] Run a clean install, test, build, and preview.
- [ ] Commit the working baseline.

**Acceptance:** A clean checkout can install, test, and build from documented commands.

#### Task 0.2 — Record architecture decisions

**Owner:** Codex  
**Reviewer:** Claude Review  
**Approver:** Human owner

- [ ] Write ADRs for static-first architecture, Astro/React islands, file-based content, search, hosting, asset delivery, and no runtime AI.
- [ ] Include alternatives and reversal cost.
- [ ] Verify current free-tier constraints before selecting providers.
- [ ] Obtain owner approval.

#### Task 0.3 — Anatomy asset spike

**Owner:** Codex  
**Reviewer:** Claude Review  
**Approver:** Human owner

- [ ] Acquire evaluation versions or lawful samples for up to three candidates.
- [ ] Archive license terms and attribution requirements.
- [ ] Create a scripted Blender import/normalize/export proof.
- [ ] Map at least pectoralis major, deltoid regions, biceps, triceps, lats, quads, hamstrings, and gluteus maximus.
- [ ] Export compressed browser assets.
- [ ] Render a fixed cinematic scene and accessible fallback.
- [ ] Measure payload, frame time, memory, selection accuracy, and visual quality.
- [ ] Score candidates using Section 8.3.
- [ ] Purchase/select only after owner approval.

**Kill condition:** If no candidate reaches the license and performance gates, pause the full 3D plan and ship the vertical slice with licensed 2D anatomical plates while a better asset is sourced.

### Phase 1 — Evidence-system vertical slice

**Outcome:** One muscle, two exercises, and one comparison pass the complete evidence workflow.

Use pectoralis major plus a flat press and a cable/fly variation as the representative slice, unless the evidence scoping step identifies a better test case.

#### Task 1.1 — Implement evidence schemas and validators

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Write failing schema tests for claim, source, evidence packet, review, and change records.
- [ ] Implement Zod schemas.
- [ ] Add identifier normalization, publication states, certainty-language lints, and review-date validation.
- [ ] Add graph integrity and retraction-status test fixtures.
- [ ] Document exact authoring errors and remediation.

#### Task 1.2 — Run the manual research prototype

**Owner:** Claude Research  
**Reviewer:** Claude Review

- [ ] Write one scoped research question for muscle function and one comparative exercise question.
- [ ] Save exact PubMed/MeSH queries and dates.
- [ ] Screen sources and record exclusions.
- [ ] Extract study/reference data into the schema.
- [ ] Create claims, qualifiers, evidence grades, and contradictory-evidence notes.
- [ ] Produce muscle and exercise drafts.
- [ ] Run independent citation audit and adversarial review.
- [ ] Revise until all claims pass or are removed.

**Acceptance:** Another model can reconstruct why each claim exists from repository artifacts alone.

#### Task 1.3 — Validate the pipeline economics and quality

**Owner:** Codex  
**Inputs:** Both Claude reports

- [ ] Record AI sessions, elapsed owner review time, source count, claims created, failed claims, and rework causes.
- [ ] Estimate effort for 40–60 muscle records and 75–120 exercise records with a 30% retry buffer.
- [ ] Reduce redundant steps only if auditability remains intact.
- [ ] Decide whether full claim coverage is feasible before expanding scope.

### Phase 2 — Design system and static product shell

**Outcome:** A premium, accessible static site shell with realistic content and all core page archetypes.

#### Task 2.1 — Design tokens and component primitives

**Owner:** Codex  
**Reviewer:** Claude Review  
**Approver:** Human owner

- [ ] Implement color, type, spacing, radii, border, shadow, motion, and depth tokens.
- [ ] Create buttons, links, tabs, drawers, accordions, breadcrumbs, entity chips, evidence badges, source cards, filters, and empty/error states.
- [ ] Create WCAG contrast and focus tests.
- [ ] Produce desktop/mobile visual snapshots with real vertical-slice content.
- [ ] Obtain owner approval before expanding components.

#### Task 2.2 — Page archetypes

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Home.
- [ ] Anatomy explorer shell.
- [ ] Muscle detail.
- [ ] Exercise detail.
- [ ] Comparison.
- [ ] Source detail.
- [ ] Methodology/glossary.
- [ ] Search/index.
- [ ] Error and no-JavaScript states.

**Acceptance:** All pages work with vertical-slice content, keyboard navigation, responsive layouts, and valid source links before the final 3D model is connected.

### Phase 3 — Anatomy engine

**Outcome:** Production-ready selection, layers, URL state, accessible controls, and asset pipeline.

#### Task 3.1 — Deterministic asset pipeline

**Owner:** Codex

- [ ] Preserve authorized source asset and checksum.
- [ ] Script naming normalization, transforms, material assignment, mesh separation/merge policy, LOD generation, texture conversion, compression, and manifest output.
- [ ] Create regression checks for mesh count, IDs, bounds, and missing entities.
- [ ] Document attribution and update process.

#### Task 3.2 — Scene and interaction engine

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Write reducer/state tests for selection, hover/focus, isolation, layers, camera presets, reset, and URL serialization.
- [ ] Implement scene loading and progressive asset tiers.
- [ ] Implement mouse, touch, and keyboard selection.
- [ ] Synchronize semantic anatomy tree with the 3D scene.
- [ ] Implement context loss, loading, and failure fallbacks.
- [ ] Respect reduced motion and low-power mode.
- [ ] Add deterministic screenshot positions.

#### Task 3.3 — Performance pass

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Test representative low-, mid-, and high-tier hardware.
- [ ] Profile parse, GPU upload, draw calls, texture memory, raycasting, and idle rendering.
- [ ] Segment model bundles by layer/region if full-model payload fails.
- [ ] Enforce asset budgets in CI.
- [ ] Document measurements and exceptions.

### Phase 4 — Knowledge graph, search, and comparison

**Outcome:** All approved content can be discovered and traversed consistently.

#### Task 4.1 — Graph compiler

**Owner:** Codex

- [ ] Write failing tests for references, orphans, invalid relationship types, cycles, and publication gates.
- [ ] Build deterministic normalized graph output.
- [ ] Generate reverse relationships and related-entity summaries.
- [ ] Generate build report with counts, warnings, stale reviews, and coverage gaps.

#### Task 4.2 — Search

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Index names, aliases, anatomy terms, exercises, equipment, claims, and glossary terms.
- [ ] Add spelling/alias handling and disambiguation.
- [ ] Exclude blocked/draft records.
- [ ] Test top queries for every major region and common exercise alias.
- [ ] Provide index navigation when JavaScript is unavailable.

#### Task 4.3 — Comparison engine

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Define comparable fields and outcome lenses.
- [ ] Render differences from structured records.
- [ ] Cite each comparison row.
- [ ] Encode state in a stable URL.
- [ ] Prevent unsupported ranking/winner output.

### Phase 5 — Content production waves

**Outcome:** Deep, audited coverage expands without reducing quality.

Use small batches. Never produce the entire catalog before review.

**Wave order:**

1. Chest and shoulders.
2. Back and elbow flexors/extensors.
3. Quadriceps, hamstrings, and calves.
4. Glutes, adductors, abductors, and hip flexors.
5. Trunk and remaining forearm/context structures.
6. Cross-region comparison and glossary completion.

For each wave:

- [ ] Claude Research scopes questions and a coverage matrix.
- [ ] Claude Review approves search strategies before mass extraction.
- [ ] Claude Research acquires, screens, extracts, appraises, and synthesizes.
- [ ] Claude Research drafts atomic claims and pages.
- [ ] Claude Review completes citation-entailment and adversarial review for every claim before publication. High-impact comparative claims receive a second reviewer pass in the release audit.
- [ ] Failed claims are revised or removed.
- [ ] Codex validates and integrates one small batch.
- [ ] Codex runs full build/test/graph/source-status checks.
- [ ] Claude Review audits the rendered pages for consistency and UX.
- [ ] Human owner reviews a representative muscle, exercise, comparison, and evidence view.
- [ ] Human owner approves or rejects the exact batch manifest; Codex records the decision, page/content checksums, and approval timestamp through each page's manifest reference.
- [ ] Batch is committed and tagged complete.

### Phase 6 — Release hardening

#### Task 6.1 — Accessibility

**Owner:** Codex  
**Reviewer:** Claude Review  
**Approver:** Human owner for any disputed applicability decision

- [ ] Complete automated and manual WCAG 2.2 AA audit.
- [ ] Test keyboard, VoiceOver, zoom/reflow, reduced motion, touch target size, focus visibility, and no-WebGL mode.
- [ ] Publish accessibility statement and known limitations.

#### Task 6.2 — Performance and resilience

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Run lab tests on all archetypes.
- [ ] Run throttled network/device tests.
- [ ] Validate caching, immutable asset versioning, CDN ranges, and fallback behavior.
- [ ] Test offline/reload behavior appropriate to a static site.
- [ ] Configure field Web Vitals measurement without sensitive data.

#### Task 6.3 — Security, privacy, and license audit

**Owner:** Codex  
**Reviewer:** Claude Review

- [ ] Dependency and secret scans.
- [ ] CSP and security headers.
- [ ] No unauthorized third-party scripts.
- [ ] Complete asset/source license inventory.
- [ ] Verify every required attribution is rendered.
- [ ] Confirm no protected source text is published.

#### Task 6.4 — Scientific release audit

**Owner:** Claude Review  
**Remediation owner:** Claude Research for evidence/content; Codex for pipeline/rendering  
**Approver:** Human owner

- [ ] Refresh all source statuses.
- [ ] Re-audit a random 10% claim sample plus every high-impact comparison claim.
- [ ] Verify evidence labels and methodology disclosures.
- [ ] Resolve or prominently disclose every known contradiction.
- [ ] Freeze a versioned content snapshot.

#### Task 6.5 — Beta and launch

**Owner:** Codex  
**Reviewer:** Claude Review  
**Approver:** Human owner

- [ ] Recruit a small test group of serious lifters and coaches; they evaluate usability, not scientific truth.
- [ ] Run scripted find/understand/verify/share tasks.
- [ ] Fix critical task failures.
- [ ] Complete rollback drill.
- [ ] Obtain Claude Review release report.
- [ ] Obtain human owner go/no-go approval.
- [ ] Deploy and monitor.

### Phase 7 — Ongoing operation

- [ ] Monthly retraction/correction check.
- [ ] Monthly broken-link and dependency checks.
- [ ] Quarterly content-gap and search-zero-result review.
- [ ] Six-month fast-moving evidence refresh.
- [ ] Annual methodology audit.
- [ ] Versioned corrections with public change notes.
- [ ] Consider a grounded question interface only after benchmarked retrieval can answer from approved claims with citation precision ≥99% on the test set and abstain reliably when evidence is absent.

---

## 15. Content production estimates and realistic expectations

AI-only production removes payroll but not the work of defining, checking, and integrating a credible product. Track three quantities separately: model execution time, supervised agent work, and human-owner review time. Parallel model sessions may reduce calendar time but do not reduce the amount of evidence or QA work.

Use these planning units rather than optimistic page counts:

| Unit | Expected supervised AI effort after pipeline stabilizes |
|---|---:|
| Stable descriptive muscle record | 2–5 agent-hours across research, review, integration |
| Complex muscle/subdivision record | 5–10 agent-hours |
| Exercise record | 3–8 agent-hours |
| Evidence-heavy comparison topic | 8–20 agent-hours |
| New polished page archetype | 12–30 agent-hours |
| Production 3D asset pipeline | 40–100 agent-hours plus iteration |

The catalog alone yields roughly 305–1,560 supervised agent-hours at the stated low/high record counts and ranges. Adding seven major page archetypes, the 3D pipeline, comparisons, integration, audits, and a 30% rework/reserve factor produces a realistic planning envelope of **700–2,000 supervised agent-hours**, plus approximately **100–300 human-owner review/decision hours**. A serious Release 1 is therefore more plausibly a 6–12 month part-time project than a short website sprint. Measure the vertical slice and replace these broad estimates with observed throughput before approving the final catalog.

Do not reduce scientific review to meet a date. Reduce catalog breadth instead.

---

## 16. Risk register and mitigations

| Risk | Likelihood / impact | Early signal | Mitigation |
|---|---|---|---|
| Anatomy model license is incompatible | Medium / Critical | Ambiguous web redistribution or AI terms | License gate, archive terms, prefer commercial flexibility |
| 3D model is too heavy | High / High | >10 MB initial payload, low-device frame drops | LOD, region bundles, compression, posters, 2D fallback |
| Mesh anatomy does not match content taxonomy | High / High | Unmapped or incorrectly grouped muscles | Manifest spike before purchase; explicit mapping table |
| AI hallucinates or overstates claims | High / Critical | Unsupported locators, certainty mismatch | Atomic claims, source extraction, independent audit, fail-closed publication |
| Two models agree on the same error | Medium / Critical | Reviews repeat language rather than inspect sources | Blind review packet, adversarial prompts, random owner/source checks, disclose AI-only process |
| Literature is sparse or indirect | High / Medium | Most claims depend on acute proxies | Publish uncertainty; narrow claim; remove rankings |
| Copyright/license violation | Medium / Critical | Copied abstract/table, unclear asset terms | Access-level field, similarity checks, attribution inventory, no prohibited ingestion |
| Scope expands toward “everything fitness” | High / High | Nutrition, programs, tracking enter backlog | Release boundary and ADR approval |
| Premium UI compromises accessibility | Medium / High | canvas-only interaction, low contrast | Semantic parallel UI, WCAG gates, reduced motion, no-WebGL flow |
| Free hosting limits are exceeded | Medium / Medium | 3D bandwidth or build limits | Versioned CDN assets, provider spike, usage alerts, host portability |
| Exercise media is inaccurate or unlicensed | Medium / High | Technique drift, unclear generation rights, oversized loops | Deterministic licensed 3D/vector pipeline, per-asset records, phase review, media budgets, omission fallback |
| Static content build becomes slow | Medium / Medium | CI exceeds 10–15 minutes | Incremental generation/caching; split asset pipeline from page build |
| Content becomes stale | High / High | overdue review dates | Scheduled checks, freshness UI, fail/flag rules |
| Brand appears medically authoritative | Medium / High | users interpret as diagnosis | Explicit educational scope, careful language, methodology and safety boundaries |

---

## 17. Decision gates

The owner should make only the following high-leverage decisions:

1. **Gate A — Asset:** Approve anatomy model purchase/selection after the spike.
2. **Gate B — Vertical slice:** Approve the muscle/exercise/evidence experience before scaling content.
3. **Gate C — Visual system:** Approve the Clinical Cinematic design on desktop and mobile.
4. **Gate D — Scope:** Approve final muscle and exercise catalog after production estimates are measured.
5. **Gate E — Beta:** Approve release candidate after science, accessibility, performance, license, and UX audits.
6. **Gate F — Launch:** Approve public deployment and methodology disclosures.

Every gate packet should fit on one page and contain: decision, evidence, screenshots/links, risks, cost, recommendation, and explicit yes/no choices.

---

## 18. First 20 tasks in exact order

This manifest is the authoritative operational queue and resolves any ambiguity in the narrative phases. Do not skip ahead. Every task starts from the reviewed commit named by its dependency and ends with the standard handoff packet. `pnpm verify` is required wherever a repository implementation exists; a failed required check blocks handoff.

| ID | Owner → reviewer/approver | Depends on | Required outputs | Verification and pass condition |
|---|---|---|---|---|
| SBLA-001 | Codex → Claude Review | Master plan | Repository baseline; root configs; command contract; documented clean-checkout setup | `pnpm install --frozen-lockfile && pnpm verify`; clean checkout passes |
| SBLA-002 | Codex → Claude Review | 001 | `AGENTS.md`, `CLAUDE.md`, handoff template, current-work ledger, branch/worktree runbook, Claude environment-readiness/fallback report | Both Claude roles complete path/source/handoff simulation or chat-only fallback; reviewer can start without chat context; `pnpm verify` |
| SBLA-003 | Codex → Claude Review → Owner | 001 | ADRs for static architecture, content data, hosting, analytics, and $0 infrastructure model at three traffic scenarios | Quotas cited with access date; portability build deployed/tested; owner approves |
| SBLA-004 | Codex → Claude Review | 003 | Anatomy/exercise-media candidate license inventory, sample files, deterministic spike script | License fields complete; samples lawful; script repeatable; `pnpm verify` |
| SBLA-005 | Codex → Claude Review | 004 | Candidate benchmark, mesh mapping, media feasibility, payload/frame/memory results, weighted scorecard | All Section 8 gates measured; no candidate license score <4 proceeds |
| SBLA-006 | Owner decides; Codex records/commits → Claude Review | 005 | Signed-off asset decision or documented 2D fallback decision; purchase/license archive if applicable | Exact selected source/version/license/checksum and owner decision recorded in repository; reviewed commit created |
| SBLA-007 | Codex → Claude Review | 002,006 | Common entity schemas plus claim/source/evidence/review/change schemas and fixtures | Invalid fixtures fail; valid fixtures pass; `pnpm verify` |
| SBLA-008 | Claude Research → Claude Review | 007 | Vertical-slice questions, PICO/PECO where applicable, search strings, inclusion/exclusion plan | Review report passes scope, reproducibility, and contradiction-search criteria |
| SBLA-009 | Claude Research → Claude Review | 008 | Search, screening, extraction, appraisal, synthesis, and draft claims for one muscle/two exercises | Artifacts complete; no memory-only evidence; exact locators present |
| SBLA-010 | Claude Review → Claude Research remediation | 009 | Full citation-entailment and adversarial review for every claim | All criteria PASS; disputed/unsupported claims removed or remain blocked |
| SBLA-011 | Codex → Claude Review | 007,010 | Approved vertical-slice content, graph compiler, MDX claim components, AST lint, status checks | `pnpm evidence:status && pnpm verify`; no uncited factual prose or broken refs |
| SBLA-012 | Codex → Claude Review → Owner | 011 | Design tokens and realistic home/muscle/exercise/source/methodology archetypes | `pnpm test:a11y && pnpm test:visual && pnpm verify`; owner approves direction |
| SBLA-013 | Codex → Claude Review | 006,012 | Production Blender/glTF/media pipeline and versioned manifests | Deterministic checksums/mapping; budgets pass; `pnpm test:performance` |
| SBLA-014 | Codex → Claude Review | 013 | Anatomy-engine reducer/state tests, scene, selection, layers, URL state, semantic tree | Unit/E2E tests pass; mouse/touch/keyboard parity; `pnpm verify` |
| SBLA-015 | Codex → Claude Review → Owner | 014 | Complete accessible 3D vertical slice plus no-WebGL/low-power fallbacks | Full journey passes E2E, AA matrix, visual and performance gates; owner approves |
| SBLA-016 | Codex → Claude Review | 011,015 | Search, synonyms/disambiguation, related graph traversal, two-entity comparison | Search query suite and comparison citation tests pass; `pnpm verify` |
| SBLA-017 | Claude Research → Claude Review → Owner | 010,015,016 | Final catalog/coverage matrix, observed throughput, revised effort estimate | Every record justified; owner approves batch size and scope |
| SBLA-018 | Claude Research → Claude Review; Codex integrates; Owner approves batch | 017 | Content Wave 1 complete through every evidence gate plus exact batch manifest | Every claim reviewed; owner-approved checksums recorded; pages pass DoD; `pnpm evidence:status && pnpm verify` |
| SBLA-019 | Same role chain as 018 | 018 | Remaining owner-approved waves, each independently committed and reviewed | Each exact batch manifest is owner-approved before publication; no placeholders; full coverage report |
| SBLA-020 | Codex + Claude Review → Owner | 019 | Release candidate, conformance/license/science/security/performance reports, emergency drill, rollback artifact | All Section 12.4 and Section 19 mandatory gates pass; owner signs go/no-go |

**Handoff destinations:** Builder tasks end in `reviews/releases/<task-id>-handoff.md`; evidence tasks end in `research/packets/<task-id>-handoff.md`; review tasks end in their discipline-specific `reviews/` path and cite the exact commit/checksum reviewed. The next task may start only from the commit named in the approved prior handoff.

---

## 19. Final acceptance rubric

The rubric is a gate, not a subjective scorecard. Mandatory dimensions must be `PASS`; non-mandatory quality dimensions must be at least `READY`. “Polished” or “accurate” without the named evidence artifact is not a result.

| Dimension | Required result | Objective evidence artifact | Mandatory |
|---|---|---|---:|
| Scientific integrity | Every live claim approved; certainty and applicability complete; conflicts disclosed | Claim registry report + full first-pass review reports + 10% additional release audit | Yes |
| Citation integrity | Zero unresolved unsupported or mismatched live claims in the latest review for each claim and in the release sample; prior failed rounds remain preserved as audit history | Latest citation-entailment reports with source locators/checksums plus append-only earlier reports | Yes |
| Anatomy accuracy | 100% selectable-mesh mapping; zero known material naming/mapping defects | Mesh manifest validator + mapping audit + owner-approved visual sample | Yes |
| UX usefulness | ≥85% completion for defined find/understand/verify/share beta tasks; no critical journey blocker | Anonymized beta task report with scripts and results | No (`READY` at target) |
| Visual quality | All archetypes match approved token system; zero unapproved visual regressions | Owner-approved reference snapshots + visual regression report | No (`READY` when approved) |
| Accessibility | Zero unresolved applicable A/AA failures across state matrix | Automated results + manual WCAG conformance report | Yes |
| Performance | Lab budgets pass; post-launch field targets reported when statistically usable | Bundle/model report + device matrix + later field dashboard | Yes for lab; field is post-launch |
| Licensing | Every public asset/source use has source, terms, rights basis, attribution, and checksum | Complete license inventory and rendered-attribution audit | Yes |
| Resilience | No-WebGL, model-load failure, JS failure, stale source, emergency unpublish, and rollback drills pass | E2E/failure-injection report + deployment drill records | Yes |
| Maintainability | Clean checkout reproduces build; commands and handoffs work; no orphan/stale locks | CI run, clean-checkout log, graph report, task-ledger audit | Yes |

Mandatory owner question before launch:

> If a skeptical coach opens any important claim, can they see exactly what is asserted, why the project believes it, how certain that belief is, what limits it, and which source supports it?

If the answer is not clearly yes, do not launch that claim.

---

## 20. Canonical references for the build team

These references govern process and infrastructure; they are not blanket evidence for lifting claims.

- [GRADE Book — official GRADE guidance](https://book.gradepro.org/)
- [Cochrane Handbook for Systematic Reviews of Interventions](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current)
- [PRISMA 2020 Statement](https://www.prisma-statement.org/prisma-2020)
- [CONSORT 2025 via EQUATOR Network](https://www.equator-network.org/reporting-guidelines/consort/)
- [NCBI APIs and PubMed E-utilities](https://www.ncbi.nlm.nih.gov/home/develop/api/)
- [NLM Medical Subject Headings](https://www.ncbi.nlm.nih.gov/mesh)
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- [Crossref Retraction Watch data](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google Web Vitals](https://web.dev/articles/vitals)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Z-Anatomy repository license](https://github.com/LluisV/Z-Anatomy/blob/PC-Version/LICENSE)
- [BodyParts3D/Anatomography](https://bp3d-dev.dbcls.jp/)
- [OpenStax Anatomy & Physiology 2e terms](https://openstax.org/books/anatomy-and-physiology-2e/pages/preface)

---

## 21. Instruction to the first working session

Do not start by building the homepage or importing a full anatomy model.

Start with `SBLA-001`. Establish the repository, roles, schemas, review state, and repeatable commands. The first meaningful product milestone is not a pretty landing page; it is one complete vertical slice in which a user selects one anatomical structure, reaches an excellent muscle page, compares two exercises, opens the exact supporting claims and sources, and can do the whole journey with keyboard controls and without WebGL.

Once that slice is excellent, scale the system—not before.
