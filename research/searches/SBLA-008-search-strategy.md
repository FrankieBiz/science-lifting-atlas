# Search strategy — SBLA-008 evidence-system vertical slice

- Task: SBLA-008 (§18 queue row; §14 Phase 1 Task 1.2 scope step)
- Role: Claude Research (account A) — evidence lead, not the independent reviewer
- Pipeline stage: **`scope` only** (§9.8 step 1). The `search` stage belongs to
  SBLA-009.
- Base commit: `0752d5021da72eed840f61ae06f6c1966906c177`
- Date written and date of every verification below: **2026-09-11**
- Questions this serves: `research/questions/SBLA-008-vertical-slice.md` (Q1, Q2)

## 0. Status boundary — read this before quoting anything from this file

**No evidence search has been run.** No records have been retrieved, screened,
extracted, or cited. No result set exists. This file is a _plan_, plus a
_verification log_ of the query languages the plan uses.

Three categories of statement appear below and are labelled throughout:

| Label                      | Meaning                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plan**                   | Proposed methodology for SBLA-009. Not executed.                                                                                                                                                                                                                                                                              |
| **Verified platform fact** | Something I observed by calling an official endpoint or reading an official documentation page on 2026-09-11, with the URL and the observed response recorded.                                                                                                                                                                |
| **Index diagnostic**       | A bounded count returned by a database's own index for a _single search term_, run only to size the strategy and design its fallbacks (§4). These are counts of how many records use a phrase. They are **not** evidence, **not** a search result set, and no identifier from them was collected, opened, screened, or cited. |

Nothing here is a scientific conclusion about anatomy, exercise, or training, and
model memory is not used as evidence anywhere in this file (CLAUDE.md; §13.8).

---

## 1. Route map

| ID  | Route                                                             | Serves                                                                                     | Why this route rather than PubMed alone                                                                                      |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| S1  | PubMed / MEDLINE                                                  | Q1 anatomy and function                                                                    | MeSH indexing plus a large anatomy and biomechanics corpus                                                                   |
| S2  | PubMed / MEDLINE                                                  | Q2, precision arm                                                                          | Requires exercise **and** pectoral **and** outcome concepts                                                                  |
| S3  | PubMed / MEDLINE                                                  | Q2, recall arm                                                                             | Drops the pectoral requirement; catches trials that never name the muscle in title or abstract                               |
| S4  | PubMed / MEDLINE                                                  | Contradiction, harms, null results, measurement-validity literature                        | §9 requires contradictory evidence to be sought, not stumbled upon                                                           |
| S5  | PubMed / MEDLINE                                                  | Existing systematic reviews and meta-analyses                                              | Reference-list mining is the highest-yield route in a sparse literature                                                      |
| S6  | PubMed / MEDLINE                                                  | Retraction, erratum, expression-of-concern, and commentary surveillance                    | §9.7                                                                                                                         |
| E1  | Europe PMC REST                                                   | All questions; preprints; non-MEDLINE journals                                             | Broader source coverage than MEDLINE alone, including `SRC:PPR` preprints, with a documented public API                      |
| C1  | Cochrane Library CENTRAL (Search Manager)                         | Q2 trial discovery                                                                         | CENTRAL aggregates trial records, including registry records, that MEDLINE indexing can miss                                 |
| T1  | ClinicalTrials.gov API v2                                         | Q2 registered-but-unpublished trials                                                       | Publication-bias probe; §9.6 names trial registries                                                                          |
| O1  | OpenAlex                                                          | Forward and backward citation chaining; sports-science journals with thin MEDLINE coverage | The project has no SPORTDiscus licence; OpenAlex is the free, API-documented substitute for coverage and for citation graphs |
| X1  | Crossref REST API                                                 | DOI metadata, update notices, retraction discovery                                         | §9.6 and §9.7 name Crossref explicitly                                                                                       |
| P1  | bioRxiv / medRxiv API, SportRxiv, OSF                             | Preprints, including negative results that never reach a journal                           | Contradiction plan §7                                                                                                        |
| R1  | PROSPERO                                                          | Registered reviews in progress; duplicate-effort check                                     | Publication-bias probe                                                                                                       |
| V1  | NLM MeSH (browser, lookup API, SPARQL) and EMBL-EBI OLS4 / UBERON | Terminology anchoring                                                                      | Ensures two models resolve the same structure                                                                                |

---

## 2. Verification log

Every row was executed or fetched by me on **2026-09-11**. "Observed" records what
came back, so a reviewer can re-run the same call and compare.

| #   | Source (official)                       | URL                                                                              | What I verified                                                                                                 | Observed                                                                                                                                                             |
| --- | --------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | PubMed User Guide (NLM)                 | `https://pubmed.ncbi.nlm.nih.gov/help/`                                          | Field tags, Boolean rules, truncation rules, proximity syntax, date syntax, subsets, phrase-index behaviour     | HTTP 200; page states "Last update: September 1, 2026"                                                                                                               |
| 2   | NLM, "Use of MeSH in Online Retrieval"  | `https://www.nlm.nih.gov/mesh/intro_retrieval.html`                              | The `[mh:noexp]` tag                                                                                            | HTTP 200; page Last Reviewed 9 July 2025; states that to search the broader subject without the indented subjects, the search is qualified with the tag `[mh:noexp]` |
| 3   | NLM MeSH lookup API                     | `https://id.nlm.nih.gov/mesh/lookup/descriptor?label=<label>&match=exact`        | Which candidate terms are real descriptors                                                                      | See §3.1                                                                                                                                                             |
| 4   | NLM MeSH SPARQL endpoint                | `https://id.nlm.nih.gov/mesh/sparql`                                             | Whether D010369 has narrower descriptors                                                                        | Only D010369 occupies tree `A02.633.567.775`; no children                                                                                                            |
| 5   | NCBI E-utilities `esearch`              | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`                     | That each final query parses; field-tag validity; `querytranslation` availability                               | All six strings: no `ERROR`, empty `fieldsnotfound`, empty `quotedphrasesnotfound`                                                                                   |
| 6   | Cochrane Library Search Manager help    | `https://www.cochranelibrary.com/search-manager-help`                            | `[mh ...]` / `[mh ^...]`, `NEAR`, `NEAR/x`, `NEXT`, wildcards, field labels, `:pt` values, MeSH-coverage caveat | HTTP 200 via `curl` with a browser user agent; HTTP 403 to a plain fetch                                                                                             |
| 7   | Europe PMC RESTful Web Service          | `https://europepmc.org/RestfulWebService`                                        | Base URL, parameters, field names                                                                               | HTTP 200. `https://europepmc.org/searchsyntax` returns HTTP 404 and is **not** a current URL                                                                         |
| 8   | Europe PMC search endpoint              | `https://www.ebi.ac.uk/europepmc/webservices/rest/search`                        | That `MESH:`, `TITLE_ABS:`, `KW:`, `LANG:`, `SRC:`, `FIRST_PDATE:[a TO b]` parse                                | Query echoed back in `request.queryString`; `version 6.9`                                                                                                            |
| 9   | ClinicalTrials.gov API v2               | `https://clinicaltrials.gov/api/v2/version`, `/studies/search-areas`, `/studies` | API version; valid area names; that `AREA[...]` Essie expressions parse                                         | `apiVersion 2.0.5`, `dataTimestamp 2026-09-11T09:00:04`; a deliberately invalid area returned HTTP 400 `Unknown area name`                                           |
| 10  | Crossref REST API                       | `https://api.crossref.org/works`                                                 | `query.bibliographic`, `filter=update-type:retraction`, `filter=from-update-date:`                              | HTTP 200 for each                                                                                                                                                    |
| 11  | OpenAlex API                            | `https://api.openalex.org/works`                                                 | `filter=default.search:`, `cites:`, `cited_by:`, `referenced_works:`, `from_publication_date:`, `type:`         | HTTP 200 for each; direction semantics resolved in §3.4                                                                                                              |
| 12  | EMBL-EBI OLS4                           | `https://www.ebi.ac.uk/ols4/` (UBERON)                                           | `UBERON:0002381` label, synonyms, cross-references                                                              | Label "pectoralis major"; cross-references include `FMA:9627`, `NCIT:C33284`, `MA:0002354`, `SCTID:181624003`, `UMLS:C0585574`; UBERON release `2026-06-19`          |
| 13  | bioRxiv / medRxiv API                   | `https://api.biorxiv.org/details/biorxiv/<doi>`                                  | Endpoint shape                                                                                                  | HTTP 200; returns `{"messages":[{"status":"no posts found"}],"collection":[]}` for a non-existent DOI                                                                |
| 14  | OSF API (SportRxiv legacy archive)      | `https://api.osf.io/v2/preprints/?filter[provider]=sportrxiv`                    | Provider filter; archive extent                                                                                 | HTTP 200; total 377; newest `date_published` 2021-08-24                                                                                                              |
| 15  | SportRxiv current server                | `https://sportrxiv.org/index.php/server/search/search?query=<terms>`             | That the current server is a PKP/OJS preprint server with an HTML search route                                  | HTTP 200; `https://sportrxiv.org/` redirects to `https://sportrxiv.org/index.php/server`                                                                             |
| 16  | PROSPERO                                | `https://www.crd.york.ac.uk/prospero/`                                           | Reachability                                                                                                    | HTTP 200 but a JavaScript application shell; **no query syntax could be verified and no public API was found**                                                       |
| 17  | Crossref Retraction Watch labs endpoint | `https://api.labs.crossref.org/data/retractionwatch`                             | Availability                                                                                                    | **HTTP 502, then 504.** Unavailable on 2026-09-11                                                                                                                    |
| 18  | FIPAT / Terminologia Anatomica          | `https://fipat.library.dal.ca/ta2/`                                              | Reachability                                                                                                    | **Connection failure (`curl` exit 000).** Unreachable on 2026-09-11                                                                                                  |

**Not re-fetched this session.** The methodological references in §9.2 and §20 —
GRADE Book, Cochrane Handbook, PRISMA 2020, CONSORT 2025 — are used here only as
the master plan already cites them. I did not open them in this session and make
no claim about their current contents.

---

## 3. Verified platform facts that changed the strategy

These are the reasons the queries look the way they do. Each one would silently
corrupt the search if left undiscovered, so each is recorded rather than absorbed.

### 3.1 MeSH cannot address this muscle at the level the slice needs

Exact-match lookups against `https://id.nlm.nih.gov/mesh/lookup/descriptor`:

| Label queried           | Result                                                          |
| ----------------------- | --------------------------------------------------------------- |
| Pectoralis Muscles      | `D010369` — **is** a descriptor                                 |
| Pectoralis Major        | `[]` — **not** a descriptor (it is an entry term under D010369) |
| Pectoralis Major Muscle | `[]`                                                            |
| Muscle Hypertrophy      | `[]`                                                            |
| Hypertrophy, Muscle     | `[]`                                                            |
| Resistance Exercise     | `[]`                                                            |
| Strength Training       | `[]` (entry term under `Resistance Training` D055070)           |
| Bench Press             | `[]`                                                            |

Confirmed descriptors used in the strings below: `Pectoralis Muscles` D010369,
`Muscle, Skeletal` D018482, `Muscle Fibers, Skeletal` D018485, `Resistance
Training` D055070, `Weight Lifting` D014891, `Exercise` D015444, `Exercise
Therapy` D005081, `Exercise Test` D005080, `Athletic Performance` D054874,
`Electromyography` D004576, `Hypertrophy` D006984, `Muscle Development` D024510,
`Muscle Strength` D053580, `Organ Size` D009929, `Biomechanical Phenomena`
D001696, `Muscle Contraction` D009119, `Isometric Contraction` D007537, `Range of
Motion, Articular` D016059, `Torque` D019415, `Movement` D009068, `Adaptation,
Physiological` D000222, `Shoulder` D012782, `Shoulder Joint` D012785, `Arm`
D001132, `Thoracic Wall` D035441, `Anatomy` D000715, `Anatomy, Regional` D000718,
`Anatomic Landmarks` D059925, `Cadaver` D002102, `Dissection` D004210, `Magnetic
Resonance Imaging` D008279, `Ultrasonography` D014463.

A MeSH SPARQL query for every descriptor whose tree number begins
`A02.633.567.775` returned only D010369. **Consequence:** MeSH provides no handle
for pectoralis major as distinct from pectoralis minor, and none at all for the
clavicular or sternocostal portions. Free-text terms carry the specificity, and
`[mh]` explosion on D010369 is currently a no-op. SBLA-009 must re-check this,
because NLM revises MeSH annually.

### 3.2 The quoted-phrase trap, and the fix

The PubMed User Guide states, on the page verified at row 1:

- "If you use quotes and the phrase is not found in the phrase index, the quotes
  are ignored and the terms are processed using automatic term mapping."
- "If you use a search tag and the phrase is not found in the phrase index, the
  phrase will be broken into separate terms."
- "Phrases may appear in a PubMed record but not be in the phrase index. To search
  for a phrase that is not found in the phrase index, use a proximity search with
  a distance of 0."

A first draft of these strings used ordinary quoted phrases with `[tiab]`. When
parsed through E-utilities, PubMed returned a `quotedphrasesnotfound` warning
listing twenty-one of them, including `"cable fly"[tiab]`, `"cable
crossover"[tiab]`, `"pectoral deck"[tiab]`, `"machine fly"[tiab]`, `"butterfly
exercise"[tiab]`, `"barbell press"[tiab]` and every plural fly spelling. Left
unfixed, each of those would have been silently decomposed into separate words,
so `"cable fly"[tiab]` would have retrieved records containing _cable_ and _fly_
anywhere in the title or abstract — a different and much noisier search than the
one documented.

**Every multi-word free-text term in the final strings therefore uses proximity
distance 0 — `"…"[tiab:~0]` — rather than a bare quoted phrase.** After the
rewrite, all six strings parse with an empty `quotedphrasesnotfound` and an empty
`fieldsnotfound`. Proximity distance 0 matches adjacent terms in either order and
is not subject to the phrase index. It also normalises hyphens: `"cross sectional
area"[tiab:~0]` and `"cross-sectional area"[tiab:~0]` returned the identical
count of 29,137.

Proximity is available only for Title, Title/Abstract, and Affiliation, so MeSH
and publication-type terms keep quoted form; those are controlled vocabularies and
are not affected.

### 3.3 One publication-type value does not work in PubMed

| Value                                                                                                            | PubMed `[pt]` behaviour                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `"Retracted Publication"[pt]`                                                                                    | Valid; index diagnostic 34,546                                          |
| `"Retraction of Publication"[pt]`                                                                                | **Returns 0 and raises `quotedphrasesnotfound`.** Not usable as written |
| `"Published Erratum"[pt]`                                                                                        | Valid; 211,686                                                          |
| `"Expression of Concern"[pt]`                                                                                    | Valid; 3,902                                                            |
| `"Preprint"[pt]`                                                                                                 | Valid; 67,320                                                           |
| `"Randomized Controlled Trial"[pt]`, `"Comparative Study"[pt]`, `"Systematic Review"[pt]`, `"Meta-Analysis"[pt]` | Valid (parsed with empty `fieldsnotfound`)                              |

`Retraction of Publication` **is** a valid `:pt` value in Cochrane's Search
Manager (row 6), so this is a platform difference, not a vocabulary error. S6
drops it for PubMed and keeps it for CENTRAL.

### 3.4 OpenAlex citation-direction semantics, resolved empirically

The two directions are easy to invert, so I disambiguated them against a work
whose own counts are published by the API:

| Call                                                              | Result                                               |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| `/works/W2741809807?select=referenced_works_count,cited_by_count` | `referenced_works_count: 54`, `cited_by_count: 1257` |
| `filter=cites:W2741809807`                                        | 1253 → **forward** chaining: works citing it         |
| `filter=referenced_works:W2741809807`                             | 1253 → same as `cites:`; an alias                    |
| `filter=cited_by:W2741809807`                                     | 44 → **backward** chaining: works it cites           |

**Consequence:** `cites:` and `referenced_works:` mean "cites X"; `cited_by:`
means "cited by X", i.e. X's own reference list. The small shortfalls (1253 vs
1257, 44 vs 54) are unindexed references and must not be mistaken for a complete
reference list.

### 3.5 Cochrane CENTRAL MeSH coverage caveat

The Search Manager help states that only records from PubMed, MEDLINE and
ClinicalTrials.gov have MeSH terms assigned. A CENTRAL strategy that leans on
`[mh ...]` therefore under-retrieves exactly the hand-searched and registry
records CENTRAL exists to add. C1 below puts the weight on free text.

### 3.6 SportRxiv moved; the OSF archive is frozen

The OSF provider `sportrxiv` holds 377 preprints with a newest publication date of
2021-08-24, while `sportrxiv.org` now redirects to a PKP/OJS preprint server. The
OSF route is therefore a **legacy archive**, not the current server, and both must
be searched. This is recorded because treating the OSF endpoint as current would
silently miss five years of preprints.

---

## 4. Index diagnostics

**These are not evidence and not a search.** Each is a single-term count returned
by a database's own index, run on 2026-09-11 to size the strategy and to write
honest fallback rules. No identifier was collected, opened, screened, or cited,
and no composite question query was executed.

| Term                            | PubMed count |
| ------------------------------- | -----------: |
| `"Pectoralis Muscles"[mh]`      |        4,938 |
| `"bench press"[tiab:~0]`        |        2,905 |
| `"machine fly"[tiab:~0]`        |           32 |
| `"pec deck"[tiab:~0]`           |           11 |
| `"chest fly"[tiab:~0]`          |            9 |
| `"dumbbell fly"[tiab:~0]`       |            8 |
| `"cable fly"[tiab:~0]`          |            2 |
| `"cable cross over"[tiab:~0]`   |            2 |
| `"cable crossover"[tiab:~0]`    |            1 |
| `"chest flies"[tiab:~0]`        |            1 |
| `"butterfly exercise"[tiab:~0]` |            0 |
| `"pectoral deck"[tiab:~0]`      |            0 |

Europe PMC, composite E1 string below, `hitCount` 334.

**Finding that the reviewer must act on.** The index footprint of the _fly_
family in PubMed titles and abstracts is on the order of a few dozen records
before any deduplication or screening, and the cable fly specifically is in
single digits. The `"machine fly"` count is additionally inflated by unrelated
senses of the words. Exercise X is well represented; **Exercise Y as defined may
have almost no directly indexed PubMed literature.** Three consequences:

1. S3, E1, C1, O1 and P1 are not optional supplements. They are the routes most
   likely to hold whatever evidence exists for Y.
2. Unresolved item **U2** in the questions file — whether Y may be widened to pec
   deck or dumbbell fly — should be settled by the reviewer _before_ SBLA-009
   searches, not after the yield is visible.
3. "The search found little" is a legitimate and likely outcome. §2.2 forbids
   converting a thin evidence base into a confident comparative recommendation,
   and the screening plan's §6 anti-cherry-picking rules exist for exactly this
   case.

---

## 5. PubMed searches S1–S6

### 5.0 How to run and record these

**Plan.** For each search, SBLA-009 records: database, platform URL, the exact
query string as pasted, filters applied as separate recorded steps, the search
date, the result count, **and the PubMed `querytranslation` string returned by
E-utilities**, which is the only artifact that proves what PubMed actually ran.
This satisfies §9.8 step 2 and populates `evidencePacketSchema.searches`
(`database`, `query`, `searchedAt`, `resultCount`) from
`src/lib/content/schemas.ts`.

Two equivalent execution paths, both to be recorded:

- **Web:** paste the string into the PubMed search box at
  `https://pubmed.ncbi.nlm.nih.gov/`. Save the permalink the User Guide describes
  for reproducibility. Whitespace and newlines are not significant.
- **API:** `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=<url-encoded query>`,
  collapsing internal newlines to single spaces. Read `count` and
  `querytranslation`. Use an NCBI API key; without one the endpoint rate-limits
  at three requests per second, which I hit during verification.

Applying a field tag turns off automatic term mapping, and truncation with `*`
turns off both automatic term mapping and MeSH explosion (User Guide, row 1).
Every term below is deliberately tagged, so no string depends on automatic term
mapping and none will drift when NLM changes the mapping tables.

### 5.1 S1 — Q1, pectoralis major structure and function

**Purpose.** Anatomy, architecture, innervation, portion boundaries, moment arms,
and regional activation at the glenohumeral joint.

```text
("Pectoralis Muscles"[mh] OR pectoral*[tiab] OR "pec major"[tiab:~0] OR "musculus pectoralis major"[tiab:~0] OR "chest muscle"[tiab:~0] OR "chest muscles"[tiab:~0]) AND ("Anatomy"[mh] OR "Anatomy, Regional"[mh] OR "Anatomic Landmarks"[mh] OR "Cadaver"[mh] OR "Dissection"[mh] OR "Muscle Fibers, Skeletal"[mh] OR "Biomechanical Phenomena"[mh] OR "Muscle Contraction"[mh] OR "Isometric Contraction"[mh] OR "Range of Motion, Articular"[mh] OR "Torque"[mh] OR "Movement"[mh] OR "Electromyography"[mh] OR "Magnetic Resonance Imaging"[mh] OR "Ultrasonography"[mh] OR anatom*[tiab] OR morpholog*[tiab] OR architect*[tiab] OR attach*[tiab] OR insertion*[tiab] OR innervat*[tiab] OR pennation*[tiab] OR compartment*[tiab] OR subdivision*[tiab] OR "moment arm"[tiab:~0] OR "moment arms"[tiab:~0] OR "line of action"[tiab:~0] OR "line of pull"[tiab:~0] OR "fiber orientation"[tiab:~0] OR "fibre orientation"[tiab:~0] OR "fascicle orientation"[tiab:~0] OR "clavicular head"[tiab:~0] OR "clavicular portion"[tiab:~0] OR "clavicular fibers"[tiab:~0] OR "clavicular fibres"[tiab:~0] OR sternocostal[tiab] OR "sternal head"[tiab:~0] OR "sternal portion"[tiab:~0] OR "abdominal head"[tiab:~0] OR "costal head"[tiab:~0] OR "motor point"[tiab:~0] OR "motor points"[tiab:~0] OR "regional activation"[tiab:~0] OR "regional difference"[tiab:~0] OR "regional differences"[tiab:~0] OR "neuromuscular compartment"[tiab:~0] OR "neuromuscular compartments"[tiab:~0]) AND ("Shoulder"[mh] OR "Shoulder Joint"[mh] OR "Arm"[mh] OR "Thoracic Wall"[mh] OR shoulder[tiab] OR glenohumeral[tiab] OR humer*[tiab] OR "horizontal adduction"[tiab:~0] OR "transverse adduction"[tiab:~0] OR "horizontal flexion"[tiab:~0] OR "shoulder flexion"[tiab:~0] OR "internal rotation"[tiab:~0] OR "medial rotation"[tiab:~0] OR adduction[tiab] OR "scapular plane"[tiab:~0] OR "elevation angle"[tiab:~0] OR "abduction angle"[tiab:~0])
```

Verified to parse on 2026-09-11: no `ERROR`, `fieldsnotfound` empty,
`quotedphrasesnotfound` empty.

- **Filters, applied and recorded separately, never baked into the base string:**
  (a) none — record the unfiltered count first; (b) species, as
  `AND "humans"[mh]`, recorded as a separate count so the loss is visible;
  (c) no date limit (see §8).
- **Deliberate high-recall terms:** `pectoral*` also matches _pectoralis minor_
  and _pectoral girdle_; `humer*` matches _humeral_ and _humerus_. Screening, not
  the query, removes these.
- **Expected failure mode:** the species filter drops comparative-anatomy work
  that legitimately informs human structure. That is why it is a recorded
  separate step and not part of the base string.
- **Fallback:** if the unfiltered count is unmanageable, add
  `AND "Pectoralis Muscles"[majr]` as a _recorded narrowing step_, keeping the
  broad count on file so the narrowing is auditable.

### 5.2 S2 — Q2, precision arm

**Purpose.** Exercise concept **and** pectoral concept **and** outcome concept.

```text
("Resistance Training"[mh] OR "Weight Lifting"[mh] OR "Exercise"[mh] OR "Exercise Therapy"[mh] OR "Exercise Test"[mh] OR "Athletic Performance"[mh] OR "bench press"[tiab:~0] OR "bench presses"[tiab:~0] OR "bench pressing"[tiab:~0] OR "chest press"[tiab:~0] OR "chest presses"[tiab:~0] OR "chest pressing"[tiab:~0] OR "barbell press"[tiab:~0] OR "barbell presses"[tiab:~0] OR "dumbbell press"[tiab:~0] OR "dumbbell presses"[tiab:~0] OR "machine press"[tiab:~0] OR "smith machine"[tiab:~0] OR "cable fly"[tiab:~0] OR "cable flies"[tiab:~0] OR "cable flye"[tiab:~0] OR "cable flyes"[tiab:~0] OR "chest fly"[tiab:~0] OR "chest flies"[tiab:~0] OR "chest flye"[tiab:~0] OR "chest flyes"[tiab:~0] OR "dumbbell fly"[tiab:~0] OR "dumbbell flies"[tiab:~0] OR "dumbbell flye"[tiab:~0] OR "dumbbell flyes"[tiab:~0] OR "machine fly"[tiab:~0] OR "machine flies"[tiab:~0] OR "pec deck"[tiab:~0] OR "peck deck"[tiab:~0] OR "pectoral deck"[tiab:~0] OR "cable crossover"[tiab:~0] OR "cable crossovers"[tiab:~0] OR "cable cross over"[tiab:~0] OR "butterfly exercise"[tiab:~0] OR "butterfly machine"[tiab:~0] OR "resistance training"[tiab:~0] OR "resistance exercise"[tiab:~0] OR "strength training"[tiab:~0] OR "weight training"[tiab:~0] OR "multi joint"[tiab:~0] OR multijoint[tiab] OR "single joint"[tiab:~0] OR singlejoint[tiab]) AND ("Pectoralis Muscles"[mh] OR pectoral*[tiab] OR "pec major"[tiab:~0] OR "chest muscle"[tiab:~0] OR "chest muscles"[tiab:~0] OR "upper body"[tiab:~0]) AND ("Hypertrophy"[mh] OR "Muscle Development"[mh] OR "Muscle Strength"[mh] OR "Organ Size"[mh] OR "Electromyography"[mh] OR "Biomechanical Phenomena"[mh] OR "Adaptation, Physiological"[mh] OR "Torque"[mh] OR "Muscle, Skeletal"[mh] OR hypertroph*[tiab] OR "muscle thickness"[tiab:~0] OR "muscle thicknesses"[tiab:~0] OR "cross sectional area"[tiab:~0] OR "muscle volume"[tiab:~0] OR "muscle size"[tiab:~0] OR "muscle mass"[tiab:~0] OR "lean mass"[tiab:~0] OR "muscle growth"[tiab:~0] OR "one repetition maximum"[tiab:~0] OR 1RM[tiab] OR "maximal strength"[tiab:~0] OR "maximum strength"[tiab:~0] OR "muscle activation"[tiab:~0] OR "muscle activity"[tiab:~0] OR electromyogra*[tiab] OR EMG[tiab] OR "moment arm"[tiab:~0] OR "moment arms"[tiab:~0] OR "joint moment"[tiab:~0] OR "joint moments"[tiab:~0] OR kinemat*[tiab] OR kinetic*[tiab] OR "resistance profile"[tiab:~0] OR "force profile"[tiab:~0])
```

Verified to parse on 2026-09-11; all three warning lists empty.

- **Filters (separate recorded steps):** none; then `AND "humans"[mh]`; then
  `AND "adult"[mh]` only as a sensitivity step, never as the primary filter,
  because age indexing is unreliable in this literature.
- **Expected failure mode:** the pectoral block is the weak link. A trial titled
  "effects of two upper-body exercises on muscle thickness" that never writes
  _pectoral_ and is not MeSH-indexed will be missed here. That is precisely what
  S3 exists to catch.
- **Fallback:** if S2 returns near-nothing, do not narrow further. Move weight to
  S3, E1, C1 and O1 and record that S2 was low-yield.

### 5.3 S3 — Q2, recall arm

**Purpose.** Drop the pectoral requirement entirely; keep named exercises and
outcomes. Includes push-up deliberately, as an alternative horizontal-press
comparator that may carry contradictory or boundary evidence.

```text
("bench press"[tiab:~0] OR "bench presses"[tiab:~0] OR "bench pressing"[tiab:~0] OR "chest press"[tiab:~0] OR "chest presses"[tiab:~0] OR "cable fly"[tiab:~0] OR "cable flies"[tiab:~0] OR "cable flye"[tiab:~0] OR "cable flyes"[tiab:~0] OR "chest fly"[tiab:~0] OR "chest flies"[tiab:~0] OR "chest flye"[tiab:~0] OR "chest flyes"[tiab:~0] OR "dumbbell fly"[tiab:~0] OR "dumbbell flies"[tiab:~0] OR "dumbbell flye"[tiab:~0] OR "dumbbell flyes"[tiab:~0] OR "pec deck"[tiab:~0] OR "peck deck"[tiab:~0] OR "pectoral deck"[tiab:~0] OR "cable crossover"[tiab:~0] OR "cable crossovers"[tiab:~0] OR "butterfly exercise"[tiab:~0] OR "butterfly machine"[tiab:~0] OR "push up"[tiab:~0] OR "push ups"[tiab:~0] OR pushup*[tiab]) AND ("Hypertrophy"[mh] OR "Muscle Development"[mh] OR "Muscle Strength"[mh] OR "Organ Size"[mh] OR "Electromyography"[mh] OR "Biomechanical Phenomena"[mh] OR hypertroph*[tiab] OR "muscle thickness"[tiab:~0] OR "cross sectional area"[tiab:~0] OR "muscle volume"[tiab:~0] OR "muscle size"[tiab:~0] OR "muscle activation"[tiab:~0] OR "muscle activity"[tiab:~0] OR electromyogra*[tiab] OR EMG[tiab] OR "moment arm"[tiab:~0] OR kinemat*[tiab] OR kinetic*[tiab] OR strength[tiab])
```

Verified to parse on 2026-09-11.

- **Filters:** none first; then `AND "humans"[mh]`.
- **Expected failure mode:** `strength[tiab]` is a very broad term and will import
  noise. Accepted deliberately — this arm exists for recall, and screening is the
  right place to pay that cost.

### 5.4 S4 — contradiction, harms, and measurement-validity search

**Purpose.** Actively seek null results, opposing findings, adverse events, and
the methodological literature that would undermine a confident claim. This is a
search _for_ disconfirmation, run whatever S2 and S3 return, and its results are
screened before any synthesis is written.

```text
("bench press"[tiab:~0] OR "bench presses"[tiab:~0] OR "chest press"[tiab:~0] OR "cable fly"[tiab:~0] OR "chest fly"[tiab:~0] OR "dumbbell fly"[tiab:~0] OR "pec deck"[tiab:~0] OR "cable crossover"[tiab:~0] OR "Pectoralis Muscles"[mh] OR pectoral*[tiab]) AND ("no significant difference"[tiab:~0] OR "no significant differences"[tiab:~0] OR "no difference"[tiab:~0] OR "no differences"[tiab:~0] OR "similar increases"[tiab:~0] OR "similarly effective"[tiab:~0] OR equivalence[tiab] OR "non inferiority"[tiab:~0] OR noninferiority[tiab] OR "did not differ"[tiab:~0] OR "did not increase"[tiab:~0] OR "no effect"[tiab:~0] OR "trivial effect"[tiab:~0] OR underpowered[tiab] OR "publication bias"[tiab:~0] OR "selective reporting"[tiab:~0] OR "risk of bias"[tiab:~0] OR "conflict of interest"[tiab:~0] OR "adverse event"[tiab:~0] OR "adverse events"[tiab:~0] OR injur*[tiab] OR "pectoralis major rupture"[tiab:~0] OR "pectoralis major tear"[tiab:~0] OR "shoulder pain"[tiab:~0] OR dropout*[tiab] OR "drop out"[tiab:~0] OR crosstalk[tiab] OR "cross talk"[tiab:~0] OR reliability[tiab] OR "measurement error"[tiab:~0] OR swelling[tiab] OR edema[tiab] OR oedema[tiab])
```

Verified to parse on 2026-09-11. See §7 for the full contradiction plan this
search sits inside.

### 5.5 S5 — existing syntheses, for reference-list mining

```text
("Pectoralis Muscles"[mh] OR pectoral*[tiab] OR "bench press"[tiab:~0] OR "chest press"[tiab:~0] OR "cable fly"[tiab:~0] OR "chest fly"[tiab:~0] OR "dumbbell fly"[tiab:~0] OR "pec deck"[tiab:~0] OR "cable crossover"[tiab:~0]) AND ("Resistance Training"[mh] OR "Weight Lifting"[mh] OR "resistance training"[tiab:~0] OR "resistance exercise"[tiab:~0] OR "strength training"[tiab:~0]) AND (systematic[sb] OR "Systematic Review"[pt] OR "Meta-Analysis"[pt] OR "Scoping Review"[pt] OR "umbrella review"[tiab:~0] OR "scoping review"[tiab:~0] OR "network meta-analysis"[tiab:~0])
```

Verified to parse on 2026-09-11. `systematic[sb]` is the PubMed systematic-review
subset documented in the User Guide.

**Use.** Every included synthesis has its reference list mined in both directions
(§6.5). Existing syntheses are also the fastest route to discovering that a
question is already answered, or already known to be unanswerable.

### 5.6 S6 — status surveillance

```text
("Pectoralis Muscles"[mh] OR pectoral*[tiab] OR "bench press"[tiab:~0] OR "chest press"[tiab:~0] OR "cable fly"[tiab:~0] OR "chest fly"[tiab:~0] OR "dumbbell fly"[tiab:~0] OR "pec deck"[tiab:~0] OR "cable crossover"[tiab:~0]) AND ("Retracted Publication"[pt] OR "Published Erratum"[pt] OR "Expression of Concern"[pt] OR "Comment"[pt] OR "Letter"[pt] OR "Editorial"[pt])
```

Verified to parse on 2026-09-11. `"Retraction of Publication"[pt]` is
deliberately absent — see §3.3.

**Use.** S6 is run at search time **and** re-run on the §9.11 monthly cadence. A
hit against an already-included source triggers §9.7, including the emergency
response if the source is already supporting live content.

---

## 6. Non-PubMed routes

### 6.1 E1 — Europe PMC REST

**Endpoint.** `https://www.ebi.ac.uk/europepmc/webservices/rest/search`
**Parameters.** `query`, `format=json`, `pageSize` (max 1000), `cursorMark` for
paging, `resultType` (`idlist` | `lite` | `core`), `sort`.

```text
((MESH:"Pectoralis Muscles") OR (TITLE_ABS:"pectoralis") OR (TITLE_ABS:"pectoral") OR (KW:"pectoralis major")) AND ((TITLE_ABS:"bench press") OR (TITLE_ABS:"chest press") OR (TITLE_ABS:"cable fly") OR (TITLE_ABS:"cable crossover") OR (TITLE_ABS:"pec deck") OR (TITLE_ABS:"dumbbell fly") OR (TITLE_ABS:"chest fly") OR (TITLE_ABS:"machine fly") OR (MESH:"Resistance Training") OR (MESH:"Weight Lifting") OR (TITLE_ABS:"resistance training")) AND (FIRST_PDATE:[1960-01-01 TO 2026-09-11])
```

Verified to parse on 2026-09-11; Europe PMC echoed the query in
`request.queryString` and reported `version 6.9`.

- **Anatomy variant:** replace the second block with the S1 attribute concepts
  expressed as `TITLE_ABS:` terms.
- **Preprint variant:** add `AND (SRC:"PPR")`; restrict to journals with
  `AND (SRC:"MED" OR SRC:"PMC" OR SRC:"AGR" OR SRC:"CBA")` when a
  published-only set is wanted. Both `SRC` values were verified to parse.
- **Language:** `AND (LANG:"eng")` parses, but is applied as a _separate recorded
  step_, never baked in (§6.8).
- **Deduplication key:** Europe PMC returns `id`, `source`, `pmid`, `pmcid`,
  `doi` — enough for the §7 dedup rule without opening records.
- **Expected failure and fallback:** Europe PMC has periodic maintenance windows.
  On a non-200 or a schema change, record the failure with its timestamp, retry
  once after the documented interval, and if it still fails, record the route as
  **not executed** rather than substituting a different database silently.

### 6.2 C1 — Cochrane Library CENTRAL, Search Manager

Syntax verified against `https://www.cochranelibrary.com/search-manager-help` on
2026-09-11. The Cochrane Library has no public API for this project, so C1 is run
by hand in the Search Manager and the line-by-line strategy plus per-line counts
are pasted into the SBLA-009 search record.

```text
#1  [mh "Pectoralis Muscles"]
#2  (pectoral* or (pec NEXT major) or (chest NEXT muscle*)):ti,ab,kw
#3  #1 OR #2
#4  [mh "Resistance Training"] OR [mh "Weight Lifting"] OR [mh ^Exercise]
#5  ((bench NEXT press*) or (chest NEXT press*) or (chest NEXT fl*) or (cable NEXT fl*) or (dumbbell NEXT fl*) or (machine NEXT fl*) or (pec NEXT deck) or (pectoral NEXT deck) or (cable NEXT crossover*) or (butterfly NEXT exercis*) or (resistance NEXT train*) or (strength NEXT train*)):ti,ab,kw
#6  #4 OR #5
#7  (hypertroph* or (muscle NEXT thickness) or (cross NEXT sectional NEXT area) or (muscle NEXT volume) or (muscle NEXT size) or (muscle NEXT activation) or (muscle NEXT activity) or electromyograph* or EMG or (one NEXT repetition NEXT maximum) or 1RM or strength):ti,ab,kw
#8  #3 AND #6 AND #7
#9  #8 AND ([pt "Retracted publication"] OR [pt "Retraction of publication"] OR [pt "Expression of concern"])
```

Syntax rules that shaped this, all verified on the help page:

- `[mh vaccines]` explodes; `[mh ^vaccines]` does not; multi-word descriptors need
  quotes; qualifiers are written in capitals after a slash.
- `NEXT` is adjacency; `NEAR` and `NEAR/x` are proximity.
- Wildcards `*` and `?` need a root of at least three characters and **cannot be
  used inside a quoted phrase** — which is why every multi-word term above uses
  `NEXT` rather than quotes.
- Field labels `:ti :ab :kw :au :pt :so :doi :an :tp :crg :la`, combinable as
  `:ti,ab,kw`. `:kw` includes MeSH but without explosion.
- `:pt` values include `Retracted publication`, `Retraction of publication`,
  `Expression of concern`, `Preprint`, and `Trial registry record`.
- Only PubMed, MEDLINE and ClinicalTrials.gov records carry MeSH in CENTRAL
  (§3.5), so `#2`, `#5` and `#7` carry the retrieval, not `#1` and `#4`.

**Expected failure and fallback.** The Cochrane Library is subscription-gated for
parts of its content and blocks scripted access — a plain fetch of the help page
returned HTTP 403 during verification. If the owner has no Cochrane access,
record C1 as **not executed for want of access**, and note that trial coverage
then rests on E1, T1, and O1. Do not scrape it; §9.6 forbids scraping where an
official route exists, and no official API exists here.

### 6.3 T1 — ClinicalTrials.gov API v2

**Endpoint.** `https://clinicaltrials.gov/api/v2/studies`
**Verified on 2026-09-11.** `apiVersion` 2.0.5, `dataTimestamp`
2026-09-11T09:00:04. Area names come from
`https://clinicaltrials.gov/api/v2/studies/search-areas`; the verified areas and
their short parameters include `BasicSearch`/`term`, `ConditionSearch`/`cond`,
`InterventionSearch`/`intr`, `OutcomeSearch`/`outc`, `TitleSearch`/`titles`,
`LocationSearch`/`locn`, `IdSearch`/`id`, `SponsorSearch`/`spons`. An invalid area
name returns HTTP 400 with `Unknown area name`, which is how the grammar below was
validated.

Simple form, recommended for the first pass:

```text
GET https://clinicaltrials.gov/api/v2/studies
  ?query.intr=bench press OR chest press OR cable fly OR chest fly OR dumbbell fly OR pec deck OR cable crossover OR resistance training
  &query.term=pectoralis OR pectoral OR chest
  &countTotal=true&pageSize=100&format=json
```

Essie expression form, for a targeted second pass:

```text
GET https://clinicaltrials.gov/api/v2/studies
  ?query.term=AREA[InterventionSearch](bench press OR chest press OR cable fly OR chest fly OR dumbbell fly OR pec deck OR cable crossover) AND AREA[OutcomeSearch](hypertrophy OR muscle thickness OR cross-sectional area OR muscle strength OR one repetition maximum)
  &countTotal=true&pageSize=100&format=json
```

The Essie grammar — `AREA[<AreaName>](...)`, parentheses, `OR`, `AND`, quoted
multi-word tokens — was verified to parse on 2026-09-11 using placeholder tokens
in exactly this shape, returning HTTP 200; the topical strings differ from the
validated shape only in the literal words inside the parentheses.

**Purpose.** Registered-but-unpublished trials are the cleanest available
publication-bias probe for a sparse literature. Record every registration whose
intervention matches X or Y, whether or not a publication exists, and record
registrations with a completion date more than 24 months past and no located
publication as a **suspected unpublished result** in the contradiction map.

**Expected failure and fallback.** The human-facing search pages are JavaScript
shells and must not be scraped; use the API. If the API is unavailable, record T1
as not executed with the timestamp.

### 6.4 O1 — OpenAlex

**Endpoint.** `https://api.openalex.org/works`, with
`mailto=<contact>` for the polite pool. Verified on 2026-09-11.

| Use                                     | Call                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Topic sweep                             | `?filter=default.search:cable fly pectoralis&per-page=200`                   |
| Forward chaining from an included work  | `?filter=cites:W<id>` (works citing it)                                      |
| Backward chaining from an included work | `?filter=cited_by:W<id>` (its own reference list)                            |
| Date window                             | `?filter=from_publication_date:1960-01-01,to_publication_date:<search date>` |
| Review filter                           | `?filter=type:review,default.search:<terms>`                                 |

**Why this route exists.** The project has no SPORTDiscus licence. A large part of
the strength-and-conditioning literature sits in journals with partial or no
MEDLINE indexing, and OpenAlex is the free, documented, API-accessible index that
covers them. It is used for **discovery and citation graphs only**; every
candidate it surfaces is then resolved to a DOI or PMID and verified against the
publisher or NCBI record before any extraction. A search-engine record is never
the final source (§2.2).

**Direction semantics** are the trap here and are resolved empirically in §3.4.
The reference-list shortfalls observed there mean backward chaining via OpenAlex
is a _supplement to_, not a _replacement for_, reading the reference list of an
obtained full text.

**Expected failure and fallback.** OpenAlex metadata quality varies, and abstracts
are stored as inverted indexes. On a mismatch between OpenAlex and the publisher
record, the publisher or NCBI record wins and the discrepancy is recorded.

### 6.5 X1 — Crossref REST API

Verified on 2026-09-11. Use `mailto` for the polite pool.

| Use                                            | Call                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Resolve and verify a DOI                       | `https://api.crossref.org/works/<DOI>` — read `update-to`, `updated-by`, `relation`, `type`, `issued`, `container-title` |
| Retraction sweep                               | `https://api.crossref.org/works?filter=update-type:retraction,from-update-date:<last check date>`                        |
| Bibliographic lookup for an unlinked reference | `https://api.crossref.org/works?query.bibliographic=<citation string>&rows=5`                                            |

**Retraction Watch.** §9.7 names the Crossref/Retraction Watch data. The endpoint
`https://api.labs.crossref.org/data/retractionwatch` returned **HTTP 502 and then
504 on 2026-09-11** and could not be verified. **Fallback, in order:** (1) the
Crossref `update-type:retraction` filter above, which was verified working;
(2) the per-DOI `update-to` / `updated-by` fields; (3) PubMed S6. §9.7's transient
outage rule applies — an outage fails the check without labelling any source
invalid, and new publication stays blocked until a check succeeds.

### 6.6 P1 — preprints

| Server                    | Route                                                                              | Status on 2026-09-11                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| bioRxiv / medRxiv         | `https://api.biorxiv.org/details/<server>/<doi>`; date-interval listing endpoints  | Verified reachable. **The API has no keyword search**, so it is used to _confirm and version_ a preprint found elsewhere, not to discover one                                              |
| Any preprint, by keyword  | Europe PMC `AND (SRC:"PPR")` (§6.1)                                                | Verified. This is the discovery route                                                                                                                                                      |
| SportRxiv, current        | `https://sportrxiv.org/index.php/server/search/search?query=<terms>`               | Verified reachable; a PKP/OJS server returning HTML. No documented Boolean API — **query syntax unverified**; SBLA-009 must treat it as a keyword browse and record exactly what was typed |
| SportRxiv, legacy archive | `https://api.osf.io/v2/preprints/?filter[provider]=sportrxiv&sort=-date_published` | Verified; 377 records, newest 2021-08-24. A frozen archive, not the current server                                                                                                         |

**Handling rule.** A preprint is `publicationStatus` preprint, is never the sole
support for a published claim, and must be re-checked for a subsequent
peer-reviewed version at every update cycle. Preprints matter most here for the
contradiction plan: negative results are less likely to be published and more
likely to sit on a preprint server or nowhere at all.

### 6.7 R1 — PROSPERO

`https://www.crd.york.ac.uk/prospero/` was reachable on 2026-09-11 but is a
JavaScript application shell; no public API and **no query syntax could be
verified**. **Plan:** a manual keyword browse for registered reviews on
resistance-exercise selection and pectoral hypertrophy, recording the exact terms
typed, the date, and the registration IDs found. **This route is marked
syntax-unverified and must be re-verified at execution time.** If it cannot be
used, record it as not executed; it is a duplicate-effort and publication-bias
check, not a primary evidence route.

### 6.8 V1 — terminology anchoring

- **MeSH:** `https://meshb.nlm.nih.gov/`, the lookup API at
  `https://id.nlm.nih.gov/mesh/lookup/descriptor`, and the SPARQL endpoint at
  `https://id.nlm.nih.gov/mesh/sparql`. Re-run the §3.1 checks at execution time
  and record the MeSH year.
- **UBERON via EMBL-EBI OLS4:** `UBERON:0002381`, cross-referenced to `FMA:9627`,
  `NCIT:C33284`, `MA:0002354`, `SCTID:181624003`, `UMLS:C0585574`; UBERON release
  `2026-06-19`. Record the release IRI as the version, per the §9.7 ontology row.
- **Terminologia Anatomica:** unreachable (§2 row 18). **Unresolved U1.** Record
  the absence; do not substitute model memory for official nomenclature.

---

## 7. Deliberate contradiction search

§2.2 forbids hiding contradictory evidence, null results, limitations, or
post-publication corrections, and §9.8 step 10 requires an adversarial pass. A
contradiction search that only runs _after_ a conclusion has formed is not a
control, because by then the conclusion decides what looks relevant. The plan
below is therefore specified **now**, before any result is seen, and is run
whatever the primary searches return.

### 7.1 The five things being searched for

| Target                                                 | Why it is easy to miss                                                                        | Route                                                               |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Null and non-significant results**                   | Less likely to be published, and when published, less likely to be phrased as a finding       | S4 null-language block; T1 unpublished registrations; P1 preprints  |
| **Opposing results**                                   | A second study favouring the other exercise may sit in a journal outside MEDLINE              | S3, E1, C1, O1                                                      |
| **Adverse and harm evidence**                          | Rarely the study's headline; often only in a table or a dropout line                          | S4 harms block; the mandatory harms tier in the questions file §5.3 |
| **Indirect evidence that undermines directness**       | Different population, different technique, different measurement timing                       | Screening records indirectness rather than excluding it silently    |
| **Evidence that the measurement itself is unreliable** | Crosstalk, ultrasound reliability, acute swelling contaminating post-tests, EMG normalisation | S4 measurement-validity block                                       |

### 7.2 Fixed procedures

1. **S4 runs unconditionally**, not as a follow-up, and its screening decisions are
   logged in the same log as S1–S3 so a reviewer can see they were made under the
   same rules.
2. **Registry-to-publication reconciliation.** Every T1 registration matching X or
   Y is chased to a publication. A completed registration older than 24 months
   with no located publication is recorded as a suspected unpublished result, with
   the registration ID, in the contradiction map.
3. **Both-directions citation chaining.** For every included study and every
   synthesis from S5, run both OpenAlex directions (§3.4) and read the obtained
   full text's own reference list. Forward chaining is the route that finds the
   later study contradicting an earlier one.
4. **Reference-list mining of opposing syntheses.** If any synthesis reaches a
   conclusion opposite to the emerging one, its reference list is mined in full
   before the synthesis stage closes.
5. **Retraction and correction sweep before synthesis.** S6 plus X1 for every
   included DOI (§9.7).
6. **Every included study is read for its own limitations section** and for
   declared conflicts of interest; both are extracted as fields, not as prose.
7. **Searched-and-found-nothing is recorded as a result.** Each contradiction
   route records its date, query, and count even when the count is zero. A route
   that was not run is recorded as not run, never as empty.

### 7.3 Guards against cherry-picking

| Guard                                          | Mechanism                                                                                                                                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Criteria fixed before results are seen         | Eligibility lives in `research/screening/SBLA-008-eligibility-plan.md`, committed at this task, before any search runs. Any later change is an amendment with a date, a reason, and the pre-change version retained                                           |
| No post-hoc narrowing to a convenient set      | Filters are applied as separately recorded steps with their own counts, so every narrowing is visible as a drop in the recorded numbers                                                                                                                       |
| No silent drop                                 | Every excluded record carries exactly one recorded primary reason (eligibility plan §5), and the count of excluded records must reconcile with the count retrieved                                                                                            |
| No favourable-subset synthesis                 | The estimand is fixed in the questions file §5.4 before extraction. Any subgroup or sensitivity analysis not pre-specified there is labelled post-hoc and cannot raise certainty                                                                              |
| No overclaiming from absence                   | §2.2 and rule H2 in the questions file: "no significant difference" is never equivalence. A thin evidence base yields a low-certainty or no claim, never a confident one                                                                                      |
| No proxy substitution                          | The tier hierarchy in the questions file §5.3 is a hard rule: tiers 3–5 cannot support a hypertrophy claim, however abundant they are                                                                                                                         |
| Contradiction map is an input, not an appendix | The contradiction map is written during screening and extraction and is an input to synthesis; `sourceLinkSchema` already carries `role: contradicts` and `supportStrength`, so contradicting sources attach to claims structurally rather than as a footnote |
| Independent check                              | Claude Review, in a separate account, receives the packet and rubric but not this role's reasoning (§9.10), and searches independently for contradictory evidence                                                                                             |

---

## 8. Date handling, deduplication, recording, and updates

### 8.1 Date handling

- **No lower date limit on any primary search.** Anatomical description and
  cadaveric work do not expire on a schedule, and imposing a start year is itself
  a selection decision. Where a platform requires a bounded range — Europe PMC's
  `FIRST_PDATE` — use `1960-01-01` as a documented floor and record it as a
  filter, not as a property of the question.
- **Upper bound is the search date**, recorded as an ISO date, matching
  `evidencePacketSchema.searches[].searchedAt`.
- **PubMed date syntax**, from the User Guide: `yyyy/mm/dd:yyyy/mm/dd[dp]` for
  publication date, `[edat]` for Entrez date, `[crdt]` for create date, `[mhda]`
  for MeSH date. For _update_ runs, use `[edat]` or `[crdt]` rather than `[dp]`,
  because a record added to PubMed today may carry an older publication date and
  would be missed by a `[dp]` window.
- **Recency is a claim property, not a filter.** §9.4 treats recency as separate
  from certainty; an old study is appraised, not excluded for age.

### 8.2 Deduplication

Applied in this order, and the order matters because later keys are weaker:

1. **DOI**, normalised to lower case with any `https://doi.org/` prefix stripped.
2. **PMID**, then **PMCID**.
3. **Registry ID** (`NCT…`, PROSPERO ID) for registry records.
4. **Preprint-to-publication linkage:** a preprint and its published version are
   **one study, two records**. Link them, keep both in the record set, and count
   the study once. The published version is the citable source.
5. **Fuzzy fallback** when no identifier exists: normalised first-author surname +
   publication year + normalised title. Any match resolved this way is flagged for
   human-visible confirmation rather than merged silently.

Every deduplication decision is recorded with the key that produced it, so the
PRISMA-style flow numbers reconcile. Multi-report studies — several papers from
one dataset — are a **linkage** problem, not a deduplication problem, and are
handled in the eligibility plan §4.3.

### 8.3 What must be recorded for every search

Required by §9.8 step 2 and by `evidencePacketSchema.searches`:

| Field                     | Note                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `database`                | Platform name and the exact endpoint or interface used                                                                                                                   |
| `query`                   | The string exactly as submitted, before any URL encoding                                                                                                                 |
| `searchedAt`              | ISO date                                                                                                                                                                 |
| `resultCount`             | Integer, from the platform's own count                                                                                                                                   |
| Filters                   | Each as its own step with its own count                                                                                                                                  |
| Platform version          | PubMed "last update" date; Europe PMC `version`; ClinicalTrials.gov `apiVersion` and `dataTimestamp`; OpenAlex and Crossref response metadata; MeSH year; UBERON release |
| PubMed `querytranslation` | Mandatory. It is the only proof of what PubMed actually executed                                                                                                         |
| Failures                  | Any non-200, timeout, or rate limit, with its timestamp                                                                                                                  |

### 8.4 Update strategy

Per §9.11: fast-moving training-outcome claims refresh every 6 months; stable
anatomy and function annually; exercise mechanics annually; source status monthly.

- **Re-run** S1–S6 and E1 on the cadence, using `[edat]`/`[crdt]` windowing from
  the previous search date so the update is incremental and its yield is legible.
- **Re-verify before re-running**, because this task has already found three ways
  a platform can move under a stored query: MeSH gains and loses descriptors, the
  PubMed phrase index changes ("Automated processes regularly add new phrases to
  the index"), and endpoints move or disappear — `europepmc.org/searchsyntax` is
  already a 404. A stored query that silently changes meaning is worse than no
  stored query.
- **Status checks** (S6, X1) run monthly and independently of the content refresh.
- **Record each refresh as a new search row.** Never overwrite a prior search
  record; §9.8 forbids a downstream stage overwriting upstream material.

---

## 9. Failure and fallback matrix

| Route                     | Observed or expected failure                                                                   | Fallback                                                                                                                             | Recorded as                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| PubMed API                | Rate limit at 3 requests/second without an API key — **hit during verification on 2026-09-11** | Use an NCBI API key; throttle; fall back to the web interface with saved permalinks                                                  | Failure timestamp plus the retry                                                                      |
| PubMed phrase index       | Quoted phrase silently decomposed                                                              | Proximity `~0` (§3.2); re-check `quotedphrasesnotfound` on every run                                                                 | Warning list copied into the search record                                                            |
| MeSH                      | Descriptor added, removed, or renamed                                                          | Re-run §3.1 lookups; record the MeSH year; re-check V1                                                                               | Diff against the values recorded here                                                                 |
| Europe PMC                | Maintenance window, non-200                                                                    | One retry; then record as not executed                                                                                               | Explicitly "not executed", never as zero results                                                      |
| Cochrane CENTRAL          | Subscription gate; HTTP 403 to scripted access — **observed on 2026-09-11**                    | Manual Search Manager session; if no access, record as not executed and note the coverage loss                                       | "Not executed for want of access"                                                                     |
| ClinicalTrials.gov        | JavaScript shell on human-facing pages                                                         | Use API v2 only; never scrape                                                                                                        | Route note                                                                                            |
| Crossref Retraction Watch | **HTTP 502 then 504 on 2026-09-11**                                                            | Crossref `update-type:retraction`; per-DOI `update-to`/`updated-by`; PubMed S6                                                       | Outage recorded; §9.7 transient-outage rule applied; publication stays blocked until a check succeeds |
| OpenAlex                  | Metadata mismatch with the publisher record                                                    | Publisher or NCBI record wins                                                                                                        | Discrepancy recorded                                                                                  |
| bioRxiv API               | No keyword search                                                                              | Discover preprints through Europe PMC `SRC:"PPR"`; use the API to confirm and version                                                | Route note                                                                                            |
| SportRxiv                 | No documented Boolean API; **syntax unverified**                                               | Keyword browse with the exact terms recorded; verify at execution time                                                               | "Syntax unverified at scope time"                                                                     |
| PROSPERO                  | JavaScript shell; no API; **syntax unverified**                                                | Manual browse with terms recorded; if unusable, record as not executed                                                               | "Syntax unverified at scope time"                                                                     |
| Terminologia Anatomica    | **Host unreachable on 2026-09-11**                                                             | Retry at execution; otherwise anchor on MeSH, UBERON, FMA and record the gap                                                         | Unresolved U1                                                                                         |
| Any route                 | Yield near zero for Exercise Y                                                                 | Do **not** widen the definition silently. Escalate unresolved U2 to the reviewer, then amend the scope file with a date and a reason | Amendment record                                                                                      |

---

## 10. Assumptions and unverified items in this file

| ID  | Statement                                                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SA1 | **Assumption.** The term lists are adequate for discovery. They were built from the master plan's vocabulary and from the controlled vocabularies verified in §3, not from a validated published search filter. The reviewer should treat term coverage as the most likely defect in this file. |
| SA2 | **Assumption.** English-language search terms suffice for discovery even though the eligibility plan permits non-English records. A non-English study with no English title or abstract will be missed by every route here. Recorded rather than solved.                                        |
| SA3 | **Assumption.** Index diagnostics (§4) are a fair proxy for likely yield. They count title/abstract phrase occurrences, not eligible studies, so the true eligible yield is lower, not higher.                                                                                                  |
| SU1 | **Unverified.** PROSPERO query syntax.                                                                                                                                                                                                                                                          |
| SU2 | **Unverified.** SportRxiv (current PKP server) query syntax.                                                                                                                                                                                                                                    |
| SU3 | **Unverified.** Terminologia Anatomica; host unreachable.                                                                                                                                                                                                                                       |
| SU4 | **Unverified.** Crossref Retraction Watch labs endpoint; HTTP 502/504.                                                                                                                                                                                                                          |
| SU5 | **Not re-fetched.** GRADE Book, Cochrane Handbook, PRISMA 2020, CONSORT 2025 — cited as the master plan cites them, not opened in this session.                                                                                                                                                 |
| SU6 | **Time-bounded.** Every verification is a 2026-09-11 observation. All of it must be re-verified at execution time; §8.4 explains why that is not a formality.                                                                                                                                   |
