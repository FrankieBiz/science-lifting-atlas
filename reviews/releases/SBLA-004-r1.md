# SBLA-004 — Independent Claude Review, Round 1 (acceptance audit)

## Review identity and scope

- **Task:** SBLA-004 — Anatomy/exercise-media candidate license inventory, lawful
  sample files, deterministic spike script (master plan §18)
- **Round:** 1 (acceptance)
- **Role:** Claude Review (account B), independent and adversarial
- **Reviewed candidate (exact, immutable):**
  `098be6201987552c0ed789f3ada8a64e39472aab`
- **Candidate subject:** `docs: hand off reconciled SBLA-004 candidate`
- **Candidate tree:** `ceafc648e9381e10296be5bd7243793fe086a8b9`
- **Accepted base:** `78e21065793ef567889398b4f3e54d05df744662`
  (confirmed ancestor of the candidate)
- **Bounded diff audited:** `78e2106..098be62` — 14 files, 5,332 insertions,
  5 deletions
- **Reviewer branch:** `claude-review/SBLA-004-r1`
- **Reviewer worktree:** `.worktrees/sbla-004-claude-review-r1`
- **Coordination claim commit:** `cfa5083e08d3a03112e7bc9dc28e7038fa341bcc`
  on `codex/SBLA-004-asset-license-reconciliation`
- **Report path (sole writable path):** `reviews/releases/SBLA-004-r1.md`
- **Review date:** 2026-09-05
- **Report status:** append-only. This report repairs nothing and modifies no
  other file. A further round creates `reviews/releases/SBLA-004-r2.md`.

### Verdict

**FAIL** — two unresolved Important findings. Zero Critical. Five Minor
findings are recorded as nonblocking with explicit impact and repair
destination.

Per `docs/runbooks/operating-policy.json`
(`passRequiresZeroImportant: true`) and AGENTS.md, this candidate cannot be
accepted until I-1 and I-2 are repaired. The correct next step is **one bounded
remediation followed by one complete-artifact recheck** — not an additional
review layer.

### Independence and boundary statement

This reviewer wrote no repository file. Every executable check was run against a
byte-identical clone of the candidate in a scratch directory
(`$TMPDIR/sbla004`), created with `git clone --no-hardlinks` followed by
`git checkout 098be62`; its tree hash `ceafc648e9381e10296be5bd7243793fe086a8b9`
is identical to the reviewed worktree's tree, confirming byte identity. Probe
mutations were made only in disposable copies (`$TMPDIR/probe2`), never in the
reviewed worktree.

The reviewed worktree was clean (`git status --porcelain` empty) at
`098be6201987552c0ed789f3ada8a64e39472aab` before, during, and after this review.

**Sandbox limitation, stated plainly.** This session's sandbox denies all writes
under `/Users/frankbisignano/dev/science-lifting-atlas/`. A write probe returned
`Operation not permitted`. Consequently this reviewer **could not create, `git
add`, or commit `reviews/releases/SBLA-004-r1.md`**. The report is delivered
byte-for-byte for Codex to place at that exact path and commit unmodified. Its
line count, byte count, and SHA-256 are stated in the closing section so the
committed object can be checked against what this reviewer authored.

### Claim-boundary verification

The claim recorded at `cfa5083` grants this role exactly one append-only path,
`reviews/releases/SBLA-004-r1.md`, with base commit
`098be6201987552c0ed789f3ada8a64e39472aab`. That matches the artifact under
review. Verified.

The builder's own claim row at `098be62` lists 14 owned paths. Extracted from the
ledger's `Paths owned` cell and compared against `git diff --name-only
78e2106..098be62`, the two sets are **identical, 14 for 14**. No write occurred
outside the claimed boundary.

---

## Method

Everything below was executed or read directly. No fact is recalled.

**Runtime.** Pinned Node.js `v24.20.0` and pnpm `11.24.0`, obtained with
`npx --yes --package=node@24.20.0` and a pnpm 11.24.0 binary placed ahead on
`PATH` (the repository's nested `pnpm` calls otherwise resolve to the host's
pnpm 11.0.9 and abort on the `packageManager` check). `pnpm install
--frozen-lockfile` succeeded: `Done in 2.7s using pnpm v11.24.0`.

**Primary sources.** All four licence sources were fetched over the network in
this session and read, not recalled.

**Provenance.** The 62 MB BodyParts3D archive and all eight metadata files were
downloaded independently and checksummed against the artifact's claims.

**Adversarial probes.** A 22-case fail-closed probe suite was written against
`scripts/assets/scorecard.mjs`, plus process-level probes of
`scripts/assets/spike.mjs` against mutated inventories.

---

## Findings

Severity definitions follow AGENTS.md: Critical and Important block PASS; Minor
may be deferred only when impact and follow-up destination are recorded.

### I-1 (Important) — `status: "placeholder"` silently bypasses licence validation and still scores

**Location:** `scripts/assets/scorecard.mjs:183-184`

```js
licenceIssues:
  status === 'placeholder' ? [] : validateLicenseFields(candidate),
```

**Evidence.** Appending this record to `docs/licenses/asset-candidates.json` in a
disposable copy and running `node scripts/assets/spike.mjs` under pinned Node
24.20.0:

```json
{
  "id": "sneaky",
  "name": "Unlicensed vendor asset",
  "status": "placeholder",
  "license": {},
  "scores": {
    "coverage_naming": 5,
    "mesh_separability": 5,
    "visual_quality": 5,
    "browser_performance": 5,
    "license_clarity": 5,
    "pipeline_ease": 5,
    "presentation_options": 5
  }
}
```

Observed output:

```
- Unlicensed vendor asset: PLACEHOLDER — no vendor selected; not scored.

Asset spike passed: 5 candidate(s); 1 eligible, 2 ineligible under the §8.3 licence-clarity floor of 4/5.
```

**Process exit code: 0. The gate passed.**

A direct call to `evaluateCandidate` on the same record returns
`rejected=false, complete=true, licenceIssues=0, weightedTotal=100`. So the
record _was_ fully scored; the display branch in `spike.mjs:35-38` prints
"not scored" because it keys on `status`, not on whether a total was computed.
The operator therefore sees a reassuring line that contradicts the object.

**Impact.**

1. It defeats the §18 SBLA-004 pass condition "License fields complete". A
   candidate with **zero** licence fields — no name, no source, no access date,
   no attribution, no commercial-use determination — passes the gate.
2. `status: "placeholder"` is precisely what `path-a-commercial` carries. Path A
   is the purchased commercial asset — master plan §8's only planned paid build
   input. This bypass sits on the exact record SBLA-005 will populate with a
   real vendor, and SBLA-006 will spend money on.
3. It falsifies an explicit handoff claim. `reviews/releases/SBLA-004-handoff.md`
   states: "The runner refuses malformed, missing, non-array, empty, duplicated,
   or **incompletely licensed** candidate data." For placeholder records that is
   not true, and the run output would not reveal it.

**Why Important and not Critical.** The committed inventory is unaffected:
`path-a-commercial` carries all-null scores, so no false total is produced today.
The §8.3 licence-clarity floor itself still fires for placeholder records (a
placeholder scoring `license_clarity: 3` without `selectionEligible: false` is
still reported as an issue). The defect is latent, not currently mis-reporting.

**Repair destination.**

- `scripts/assets/scorecard.mjs` — validate licence fields whenever any score is
  non-null, or constrain `placeholder` to records with `acquired: false` and
  all-null scores; and make the `spike.mjs` display branch key on whether a total
  was computed rather than on `status`.
- `tests/unit/asset-spike.test.ts` — add a regression case: a placeholder with a
  populated `scores` block must fail.
- `reviews/releases/SBLA-004-handoff.md` — correct the "incompletely licensed"
  claim.

---

### I-2 (Important) — the §4.3 coverage observation is wrong in both directions

**Locations:**

- `docs/licenses/asset-candidates.json` → `coverageObservation.structuresAbsent`,
  `structuresPresent: 24`, `structuresRequired: 28`
- `docs/licenses/bodyparts3d-sample-manifest.md` → "24 of 28 structures present.
  4 absent" table and the "Why this matters now" section
- `reviews/releases/SBLA-004-handoff.md` → "did not find latissimus dorsi,
  rectus abdominis, erector spinae, or multifidus"

This reviewer independently downloaded all eight metadata files. **Every byte
count, line count, and SHA-256 prefix in the manifest reproduced exactly**, and
the total is 60,317 lines as claimed. The disagreement is not about the data; it
is about what was concluded from it.

**(a) `erector spinae` is listed as absent, but the group is published — with meshes.**

`isa_inclusion_relation_list.txt` contains:

```
FMA32515  postvertebral muscle          FMA32559  superficial postvertebral muscle
FMA32559  superficial postvertebral muscle  FMA77177  iliocostalis
FMA32559  superficial postvertebral muscle  FMA77178  longissimus
FMA32559  superficial postvertebral muscle  FMA77179  spinalis
FMA32559  superficial postvertebral muscle  FMA77180  splenius
```

`iliocostalis`, `longissimus`, and `spinalis` are the three columns of the
erector spinae. All three are present, with left/right and regional
subdivisions — 10 distinct `iliocostalis` names, 10 distinct `longissimus`
names, and `spinalis`, `spinalis thoracis`, `left spinalis thoracis`,
`right spinalis thoracis`.

These are not bare ontology nodes. `isa_element_parts.txt` maps them to real
mesh file ids — 36 `iliocostalis`/`longissimus` rows carry one, for example:

```
FMA22709  longissimus thoracis   FJ1535
FMA22711  longissimus cervicis   FJ1534
FMA22702  iliocostalis lumborum  FJ1527
FMA22703  iliocostalis thoracis  FJ1528
```

The zero counts the artifact reports for `erector` and `spinae` are correct and
reproduced exactly; they are a terminology artifact. BodyParts3D uses FMA's
preferred term `superficial postvertebral muscle` for the group and names the
columns individually. §4.3 asks for "spinal erector/multifidus **groupings**" —
that grouping is available.

The artifact's own method already accepts component-level decomposition
elsewhere: `hamstring` returns 0 hits and is correctly **not** listed as absent,
because `biceps femoris` (33), `semitendinosus` (13), and `semimembranosus` (13)
are present. Spinal erectors were not given the same treatment.

**(b) Two structures §4.3 names explicitly are genuinely absent and are not listed.**

- `internal oblique` — **0** distinct names across all eight files.
- `transversus abdominis` — **0**. All 21 `transversus` hits are
  `transversus thoracis` / `left` / `right` (chest, not abdomen).
- `FMA20278 muscle of anterior abdominal wall` has exactly **one** child in the
  entire inclusion list: `FMA13335 external oblique`.

§4.3 reads "Rectus abdominis, external/internal oblique, transversus abdominis".
Of those four, only external oblique is published — three are missing, yet the
absent list names one.

**(c) Confirmed correct.** These three absences reproduced and are genuine:
`latissimus dorsi` (0 hits for `latissimus`; 0 hits for `dorsi` anywhere across
60,317 lines), `rectus abdominis` (0; the only `rectus` names are extraocular —
inferior/lateral/medial rectus), and `multifidus` (0; `FMA32561 deep
postvertebral muscle` has children `interspinalis muscle`,
`intertransversarius muscle`, `rotator muscle` only).

The corroboration counts also reproduced exactly: pectoralis major 72,
deltoid 69, trapezius 44, rhomboid 42, teres major 13. So did the two supporting
claims — 96 distinct names containing "muscle", and 2,905 distinct concept ids
shared between `isa_parts_list.txt` and `isa_parts_list_e.txt` (excluding the
header row).

**Impact.** The headline ratio "24 of 28" and the four-item absent list are the
inputs SBLA-005 is instructed to verify and SBLA-006 decides on. The handoff
elevates them to "a material coverage risk for the only candidate that currently
passes the licence gate" and "If the gap persists, Path A may be the only viable
route" — that is, toward a purchase. A list wrong in both directions sends
SBLA-005 hunting a structure that already exists with meshes, while letting two
real §4.3 gaps pass unexamined.

**What survives.** The _conclusion_ is not refuted and arguably strengthens:
latissimus dorsi, rectus abdominis, multifidus, internal oblique, and transversus
abdominis are all genuinely absent. BodyParts3D does have a material coverage
gap. The defect is the enumeration presented as verified fact, not the existence
of risk.

**On the artifact's caveat.** The manifest does say "A mesh could still exist
under an FMA concept whose label differs from every term searched." That caveat
is honest and names this exact failure mode. It does not discharge the finding,
because the artifact then asserts the specific absences as findings, builds a
purchase-relevant risk statement on them, and states "24 of 28" as a result. A
caveat that a number may be wrong does not make a wrong number acceptable in a
record another task must act on.

**Repair destination.**

- `docs/licenses/bodyparts3d-sample-manifest.md` — correct the absent list and
  the ratio; state that BodyParts3D publishes the erector spinae columns under
  `superficial postvertebral muscle`.
- `docs/licenses/asset-candidates.json` — same correction in
  `coverageObservation`.
- `reviews/releases/SBLA-004-handoff.md` — correct the coverage paragraph.

---

### M-1 (Minor, nonblocking) — the 28-structure enumeration and search terms are unrecorded

**Location:** `docs/licenses/bodyparts3d-sample-manifest.md`,
`docs/licenses/asset-candidates.json` (`coverageObservation.method`)

The method is described ("case-insensitive substring search for each master plan
§4.3 structure") but neither the list of 28 structures nor the search strings is
recorded. §4.3 is prose with grouped bullets; a reasonable enumeration yields
roughly 30 named structures depending on how "components" and "groupings" are
split, so "24 of 28" cannot be reconstructed or audited by anyone.

**Impact.** The ratio is not reproducible, which is why the I-2 errors went
undetected. §18 requires a repeatable script for this milestone; this particular
observation is the one artifact in the diff that is not mechanically repeatable.

**Follow-up destination.** Record the explicit structure list and search strings
in `docs/licenses/bodyparts3d-sample-manifest.md`, or better, commit the search
as a script under `scripts/assets/`, during the I-2 repair.

---

### M-2 (Minor, nonblocking) — `null`/`undefined` array elements throw instead of reporting

**Location:** `scripts/assets/scorecard.mjs:121` (`const id = candidate.id ?? …`)

The module documents: "Never throws on bad data: a malformed score becomes a
reported issue so a multi-candidate inventory surfaces every problem in one
run." Probes:

```
array element = null       -> THREW: TypeError: Cannot read properties of null (reading 'id')
array element = undefined  -> THREW: TypeError: Cannot read properties of undefined (reading 'id')
array element = "str"      -> issues=9  FAILS-CLOSED
array element = 5          -> issues=9  FAILS-CLOSED
```

`evaluateInventory` is called outside any `try`/`catch` in `spike.mjs:24`, so at
process level a `null` element **exits 1** — it does fail closed — but with an
uncaught stack trace instead of the documented issue list, and it stops at the
first bad element rather than reporting every problem in one run.

**Impact.** No gate is defeated; this is a documented-contract violation and
degraded operator diagnostics. A `null` left by a JSON edit is a realistic input.

**Follow-up destination.** Guard in `scripts/assets/scorecard.mjs` plus a case in
`tests/unit/asset-spike.test.ts`. Deferrable to SBLA-005.

---

### M-3 (Minor, nonblocking) — the CC BY 4.0 deed is not linked from the sample notice

**Location:** `assets/samples/bodyparts3d/LICENSE.md`

The notice links the DBCLS licence page and, at line 26, the CC BY-SA 2.1 Japan
deed directly. It does **not** link `https://creativecommons.org/licenses/by/4.0/`
— the deed for the licence the sample is primarily distributed under. Grep for
`creativecommons.org` across `assets/samples/bodyparts3d/LICENSE.md` and
`docs/licenses/` returns exactly one hit, the 2.1 Japan deed.

**Impact.** Low. CC BY 4.0 §3(a)(1) asks for a notice referring to the licence
and a URI where reasonably practicable; the linked DBCLS page does state and link
CC BY 4.0, so the obligation is arguably discharged indirectly. The asymmetry —
the historical licence linked directly, the operative one only transitively — is
worth closing while the file is open.

**Follow-up destination.** `assets/samples/bodyparts3d/LICENSE.md`, at the same
time as any other licence edit.

---

### M-4 (Minor, nonblocking) — the benchmark record does not identify the WebGL renderer

**Location:** `scripts/assets/benchmark.mjs` (`environment` block),
`docs/licenses/bodyparts3d-browser-benchmark.json`

Playwright's own launch line for this Chromium build contains
`--enable-unsafe-swiftshader`. Headless Chromium therefore rasterizes WebGL in
**software** (SwiftShader), not on the GPU. The recorded `environment` block
captures `node`, `playwrightChromium`, `platform`, and `headless: true`, but not
`UNMASKED_RENDERER_WEBGL` / `UNMASKED_VENDOR_WEBGL`.

**Impact.** The `uploadAndDraw` median (2.0 ms) is a software-rasterizer figure.
If SBLA-005 measures on a GPU-backed browser and compares against this baseline,
the comparison is invalid and nothing in the record would reveal the mismatch.
Substantially mitigated by the handoff's explicit and correct disclaimer that
these are not candidate performance scores and that SBLA-005 must run the full
representative scene.

**Follow-up destination.** `scripts/assets/benchmark.mjs` should record the
renderer strings; `docs/licenses/bodyparts3d-browser-benchmark.json` should carry
them. Required before SBLA-005 assigns the §8.3 `browser_performance` score.

---

### M-5 (Minor, nonblocking) — the handoff never names the commit under review

**Location:** `reviews/releases/SBLA-004-handoff.md`

The handoff names `Implementation candidate: 8482a29a460fbe3dd9759ee213f1d24a2e0b74fa`,
but lists `reviews/releases/SBLA-004-handoff.md` among the files it created — and
that file exists only at `098be62`. The reviewed commit `098be62` appears nowhere
in the handoff.

**Impact.** §18 states "The next task may start only from the commit named in the
approved prior handoff." As written, SBLA-005 has no unambiguous base. Recoverable
from the ledger claim and from this report, so impact is low.

**Follow-up destination.** `reviews/releases/SBLA-004-handoff.md` — name the
reviewed commit explicitly in the remediation.

---

## Verification actually executed

Pinned runtime confirmed before every run: `node --version` → `v24.20.0`;
`pnpm --version` → `11.24.0`.

### `pnpm verify` — PASS (exit 0)

Run against the byte-identical clone at `098be62`. Every step matches the
handoff's claimed result:

| Step                        | Result                                              |
| --------------------------- | --------------------------------------------------- |
| `prettier --check .`        | PASS — "All matched files use Prettier code style!" |
| `eslint . --max-warnings 0` | PASS — zero warnings                                |
| `astro check`               | PASS — 42 files, 0 errors, 0 warnings, 0 hints      |
| `vitest run tests/unit`     | PASS — 9 files, 70 tests                            |
| `validate:content`          | PASS — foundation mode; 0 records                   |
| `validate:graph`            | PASS — foundation mode; 0 nodes, 0 edges            |
| `evidence:status`           | PASS — foundation mode; 0 sources                   |
| `astro build`               | PASS — 1 page, static                               |
| `test:portability`          | PASS — 3 files, 17 tests                            |
| `verify:foundation`         | PASS — "Foundation contract passed"                 |
| `assets:spike`              | PASS — 4 candidates; 1 eligible, 2 ineligible       |

Focused asset suite run separately: **2 files, 21 tests PASS** — matching the
handoff's "21/21".

### Gate preservation — PASS

The `package.json` diff shows the accepted verification chain reproduced
**verbatim** with `&& pnpm assets:spike` appended as the final step. The
portability gate (`pnpm test:portability`) and `verify:foundation` remain in
their original positions. Nothing was reordered, weakened, or removed. No CI
workflow, ESLint, Prettier, TypeScript, or Vitest configuration file appears in
the diff; `.github/workflows/ci.yml` runs `pnpm verify` and `pnpm test:e2e`, so
the new scorecard gate is picked up by CI automatically.

Note in the candidate's favour: byte-identity of the sample is enforced inside
`pnpm verify` — `tests/unit/asset-benchmark.test.ts` calls
`validateSampleIdentity` against the checked-in file — so a tampered or
regenerated `FJ1446.obj` fails CI without needing a browser.

### `pnpm test:e2e` and `pnpm assets:benchmark` — NOT RUN (environment blocked)

Both were attempted under the pinned runtime and both failed to launch Chromium:

```
FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS.
bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer: Permission denied (1100)
```

This is a macOS sandbox denial of Mach port registration in this reviewer's
environment, not a defect in the artifact. **This reviewer therefore did not
independently confirm the handoff's "`pnpm test:e2e`: Chromium PASS" or
"`pnpm assets:benchmark`: PASS".** Those two claims remain builder-attested. They
are not the basis of this FAIL verdict, and they should be re-confirmed by Codex
or CI, where Chromium launches normally.

Everything about the benchmark that does not require launching a browser **was**
verified — see the next section.

---

## Independent primary-source and provenance verification

### Licence facts — every field reproduced from the cited current source

**BodyParts3D — `https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html`**
(fetched 2026-09-05, HTTP 200). The page states "Last updated : 2025/02/27" and
"The license for this database is specified in the Creative Commons Attribution
4.0 International", with the required attribution string verbatim:
`BodyParts3D, © The Database Center for Life Science licensed under CC
Attribution 4.0 International`. It grants free redistribution of "part or whole
of the data" and derivative works, with attribution. The candidate JSON's
`accessedOn`, `name`, `version`, `attributionString`, `commercialUse`,
`modification`, and `webDistribution` all match. **Verified.**

**Z-Anatomy.** `https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/LICENSE`
(HTTP 200) licenses the _app_ on line 1 and defers models on lines 2–3, exactly
as the artifact describes. The referenced model document was fetched via
`docs.google.com/document/d/…/export?format=txt` (HTTP 200) and confirms:

- `topLevelQuote` — verbatim match, including "even commercially".
- `shareAlikeQuote` — "ShareAlike: Derivative works must be shared under
  CC-BY-SA 4.0." — verbatim match.
- All **six** `componentLicences` entries match exactly, including
  `Anatomy of the Inner Ear` = CC-BY-NC-SA 4.0, `Kidney` (Lissie Cowley) =
  CC-BY-NC 4.0, and `Brainder / White matter` = **not stated in the source**
  (confirmed: the document lists it under Reference models with no licence).

The downgrade to 3/5 clarity and `selectionEligible: false` is correct and
well-reasoned. **Verified.**

**OpenStax A&P 2e — `https://openstax.org/books/anatomy-and-physiology-2e/pages/preface`**
(HTTP 200). CC BY-NC-SA 4.0 confirmed. Both quoted strings are verbatim:
the LLM prohibition ("This book may not be used in the training of large language
models or otherwise be ingested into large language models or generative AI
offerings without OpenStax's permission.") and the image attribution ("Copyright
Rice University, OpenStax, under CC BY-NC-SA 4.0 license."). **Verified.**

**Path A** is an unscored placeholder with no source to verify; that is correct
under §8, which forbids purchasing before the spike completes.

I attempted to find a stronger legal reading than the artifact's and could not.
Treating the sample as subject to both the current CC BY 4.0 terms and its
embedded CC BY-SA 2.1 Japan notice is the conservative position, and the 4/5
rather than 5/5 clarity score is the honest consequence.

### Sample legality and attribution — PASS (with M-3)

- The current DBCLS terms explicitly permit redistribution of part or whole with
  attribution, so §8.4's "unless their license permits repository distribution"
  condition is satisfied for checking the file in.
- The file is unmodified, so no ShareAlike obligation on derivative works is
  triggered under either notice; verbatim redistribution with attribution and
  notice preservation is permitted by both.
- The historical CC BY-SA 2.1 Japan header is preserved verbatim inside the OBJ
  (lines 2–3), and `assets/samples/bodyparts3d/LICENSE.md` carries both notices,
  disclaims endorsement, and disclaims warranty.
- Both files are regular files, Git mode `100644`.
- The repository has no top-level `LICENSE`, so no repository-level licence
  conflict arises from this addition.
- Only gap: the CC BY 4.0 deed is not linked directly — recorded as M-3.

### Archive and sample provenance — PASS, fully reproduced

This reviewer downloaded the source archive independently:

| Claim              | Artifact                                           | Independently measured                                             | Result    |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| Archive bytes      | 64,888,505                                         | 64,888,505                                                         | match     |
| Archive SHA-256    | `9fbc713f…61c97`                                   | `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97` | match     |
| Sample bytes       | 105,005                                            | 105,005                                                            | match     |
| Sample SHA-256     | `964ab8e2…36d`                                     | `964ab8e287e7f44f14b07d8c7694ec70eee63bc9d7b1eeb3c5dc79e80460336d` | match     |
| Lines              | 3,590                                              | 3,590                                                              | match     |
| Vertices / normals | 1,019 / 1,019                                      | 1,019 / 1,019                                                      | match     |
| Faces / triangles  | 1,536 / 1,536                                      | 1,536 / 1,536                                                      | match     |
| Concept            | FMA45874, abdominal part of right pectoralis major | header line 11                                                     | match     |
| Modifications      | none                                               | —                                                                  | see below |

The archive was extracted and the extracted
`partof_BP3D_4.0_obj_99/FJ1446.obj` compared against the checked-in file with
`cmp`. **Byte-identical — zero differences.** The "no modification" claim is
independently confirmed, not merely asserted.

All eight metadata files were downloaded and checksummed. **All eight byte
counts, line counts, and SHA-256 prefixes match the manifest exactly**, and the
total is 60,317 lines as claimed.

### Benchmark genuineness — PASS on everything checkable without a browser

Chromium could not launch here (above), but the recorded result was audited
arithmetically and structurally:

- **Medians are correctly derived.** Recomputing the median of each trial array
  reproduces every recorded value: fetch 0.9, parse 1.3, uploadAndDraw 2.0,
  total 5.2. Four for four.
- **Every trial is internally additive.** `fetch + parse + uploadAndDraw` equals
  `total` for all five trials with delta exactly 0 — consistent with the script's
  `totalMs = gpuEnd - fetchStart` over contiguous phases.
- **Every one of the 20 recorded values is an exact multiple of 0.1 ms**, which
  is Chrome's 100 µs `performance.now()` clamp for non-cross-origin-isolated
  pages. Fabricated timings would not land on that lattice by chance.

Taken together this is strong evidence of a genuine recorded run rather than
invented numbers.

The protocol itself is sound and honest: the script validates byte size and
SHA-256 _before_ launching (`runBenchmark` calls `validateSampleIdentity` at
`benchmark.mjs:106`), discards one warmup trial, measures five, cross-checks the
in-browser parser's geometry counts against the Node parser and throws on any
divergence, and reports medians rather than means.

**On overstatement — the handoff does not overstate.** It states explicitly that
these "are not a BodyParts3D candidate performance score", that "a single
1,536-triangle mesh cannot represent whole-atlas payload, frame time, or memory",
and that SBLA-005 must run the complete representative scene. The JSON's
`$comment` repeats the point. The handoff also volunteers a repeat run with a
28.7 ms draw outlier and explains why the median is used. That is the correct
posture. The one gap is the unrecorded renderer — M-4.

### Scorecard determinism and fail-closed behaviour — FAIL (I-1)

Weights and floor are correct and properly pinned. `SPIKE_CRITERIA` reproduces
§8.3 exactly — coverage_naming 20, mesh_separability 15, visual_quality 15,
browser_performance 15, license_clarity 20, pipeline_ease 10,
presentation_options 5, summing to 100 — and `LICENSE_CLARITY_FLOOR` is 4.
`tests/unit/asset-spike.test.ts` pins each weight and the floor against
**transcribed literals**, not values derived from the module, so an edit to the
module cannot move the goalposts with the suite green. That is the right
technique and it is correctly applied. **The master plan's weights and licence
floor were not moved.**

Determinism confirmed: identical input yields byte-identical output across
repeated calls.

23 adversarial cases were probed — 22 in-process against `evaluateInventory`,
plus a malformed-JSON probe against `spike.mjs` at process level. One is a
valid-input control that correctly passes. Nineteen fail closed:

| Probe                                                                  | Result                       |
| ---------------------------------------------------------------------- | ---------------------------- |
| `candidates` null / `[]` / `{}` / `"nope"` / whole inventory undefined | fails closed                 |
| array element `"str"` / `5`                                            | fails closed (9 issues each) |
| duplicate candidate ids                                                | fails closed                 |
| missing licence field (`source`)                                       | fails closed                 |
| `source` not an http(s) URL (`"TODO"`)                                 | fails closed                 |
| `accessedOn` not ISO (`"yesterday"`)                                   | fails closed                 |
| sub-floor clarity, unacknowledged                                      | fails closed                 |
| sub-floor clarity, acknowledged without reason                         | fails closed                 |
| score 9 / −1 / `NaN` / `"4"`                                           | fails closed                 |
| unknown status (`"draft"`)                                             | fails closed                 |
| malformed JSON                                                         | exits 1 with a clean message |

Two do not:

| Probe                                              | Result                                     |
| -------------------------------------------------- | ------------------------------------------ |
| array element `null` / `undefined`                 | uncaught `TypeError` (M-2 — still exits 1) |
| **placeholder with empty licence and full scores** | **exit 0, gate passes (I-1)**              |

The refusal to compute a weighted total until every criterion is measured is
correctly implemented and correctly tested; BodyParts3D reports "6 criteria
awaiting SBLA-005 measurement" and no total, which is exactly right.

### Scope honesty for SBLA-005 / SBLA-006 — FAIL (I-2), otherwise strong

The boundary itself is drawn correctly and stated repeatedly:

- The handoff states "This milestone does not select an asset or create a
  user-facing atlas. SBLA-005 owns full candidate measurement; SBLA-006 owns
  selection."
- Six technical criteria are `null` for every inventoried candidate, and the
  running gate confirms it rather than merely asserting it.
- `anatomy-assets.md` opens with "no anatomy asset has been selected, purchased,
  or approved" and closes with an explicit "What has not been done" section.
- The spike prints "No asset is selected, purchased, or approved. SBLA-005
  measures; SBLA-006 decides." on every successful run.
- The candidate JSON's `$comment` states plainly that inventing a technical score
  "would defeat the spike gate".
- Two self-corrections are recorded rather than quietly fixed: the Z-Anatomy
  clarity downgrade from 4 to 3, and the metadata set correction from five files
  / 47,137 lines to eight files / 60,317 lines. Both are creditable.

This is genuinely honest scope discipline and it is the strongest part of the
candidate. The failure is narrower: the **coverage risk** — the one thing in this
milestone most likely to change SBLA-006's decision — is stated with an
enumeration that is wrong in both directions (I-2) and cannot be reproduced (M-1).

---

## The seven reviewer questions

**1. Every licence field against its cited current primary source — PASS.**
All four records verified against the live sources in this session. DBCLS's
2025-02-27 CC BY 4.0 page, attribution string, Z-Anatomy's app-vs-model licence
split, all six component licences including both NonCommercial ones and the
unstated Brainder entry, and OpenStax's NC terms plus the LLM-ingestion
prohibition all reproduce verbatim. No field was recalled rather than read, and
no field was overstated.

**2. Is distributing the unchanged FJ1446 sample with both notices lawful and
fully attributed — PASS, with Minor M-3.**
Yes. The current CC BY 4.0 terms expressly permit redistributing part or whole of
the data with attribution, satisfying §8.4's conditional. The file is unmodified,
so no ShareAlike obligation on derivative works arises under either notice. The
embedded historical notice is preserved verbatim, and `LICENSE.md` carries the
current attribution string exactly as the licensor requires, plus an endorsement
and warranty disclaimer. The only gap is that the CC BY 4.0 deed is linked only
transitively via the DBCLS page while the superseded 2.1 Japan deed is linked
directly (M-3). Handling the sample under both notices is conservative and
correct; I could not construct a stronger interpretation that the record fails to
support.

**3. Archive/sample provenance, hashes, geometry counts, absence of modification
— PASS.**
Fully reproduced independently. I downloaded the 64,888,505-byte archive, matched
its SHA-256, extracted `partof_BP3D_4.0_obj_99/FJ1446.obj`, and confirmed with
`cmp` that the checked-in file is **byte-identical**. Bytes, SHA-256, line count,
vertex/normal/face/triangle counts, and the FMA45874 concept all match. All eight
metadata files also reproduced byte-for-byte. This is the best-evidenced part of
the submission.

**4. Is the benchmark genuine, repeatable, and does it avoid overstating a
candidate-level result — PASS on genuineness and on not overstating; repeatability
partly builder-attested; Minor M-4.**
Genuine: medians correctly derived, every trial exactly additive, all 20 values on
Chrome's 100 µs clamp lattice, checksum gate before launch, browser-vs-Node
geometry cross-check that throws on divergence. Not overstated: the handoff and
the JSON both state clearly that this is acquisition proof and a repeatability
baseline, not a §8.3 browser-performance score, and that SBLA-005 must run the
full scene — that is exactly the right qualification. I could not execute
Chromium in this sandbox, so the live repeat is builder-attested and should be
re-confirmed by CI. The record omits the WebGL renderer, and headless Chromium
runs SwiftShader in software — M-4.

**5. Is the scorecard deterministic and does it fail closed without moving the
plan's weights or licence floor — FAIL (I-1); weights and floor untouched.**
Deterministic: yes, verified. Weights and floor: correct, unmoved, and pinned
against transcribed literals so a module edit cannot silently move them — good
engineering. Fails closed: for 19 of the 22 adversarial cases probed, yes. But a candidate
labelled `status: "placeholder"` with a completely empty licence object and a
perfect 5/5 across all seven criteria **passes with exit 0** and is displayed as
"not scored" while having actually been scored 100/100. That defeats the §18
"License fields complete" condition on the one record type Path A uses, and
falsifies the handoff's claim that the runner refuses "incompletely licensed
candidate data". This is the primary blocker.

**6. Were the accepted `pnpm verify` and portability gates preserved — PASS.**
Yes. The `package.json` diff shows the accepted chain reproduced verbatim with
`&& pnpm assets:spike` appended as an additional final step; nothing reordered,
weakened, or removed. The portability gate and `verify:foundation` retain their
positions and both pass (3 files / 17 tests; "Foundation contract passed"). No
CI, lint, format, TypeScript, or test-config file appears in the diff. I ran the
complete chain under pinned Node 24.20.0 / pnpm 11.24.0 and it is green, matching
every figure the handoff reports.

**7. Are the remaining SBLA-005/SBLA-006 work and the coverage risk stated
honestly — FAIL (I-2), with Minor M-1; scope boundary itself is honest.**
The scope boundary is stated honestly and repeatedly, enforced mechanically by
null technical scores, and reinforced by two voluntary self-corrections. That
part is exemplary. The coverage risk is not stated accurately: `erector spinae`
is reported absent when BodyParts3D publishes all three of its columns with mesh
ids, while `internal oblique` and `transversus abdominis` are genuinely absent
and go unlisted; the "24 of 28" ratio is therefore unreliable and, because the
enumeration is unrecorded (M-1), unauditable. The underlying conclusion — that
BodyParts3D has a material coverage gap — survives and is if anything
understated, but the specific facts feeding SBLA-006's purchase decision must be
corrected.

---

## Acceptance summary

| Criterion (§18 SBLA-004)                                | Verdict                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Licence fields complete for every inventoried candidate | **PASS**                                                     |
| Licence fields verified against current primary sources | **PASS**                                                     |
| Samples lawful, attributed, unmodified                  | **PASS** (Minor M-3)                                         |
| Sample provenance independently reproducible            | **PASS**                                                     |
| Spike script repeatable                                 | **PASS**                                                     |
| Spike script deterministic                              | **PASS**                                                     |
| Spike script fails closed                               | **FAIL** — I-1                                               |
| §8.3 weights and licence floor unmoved and pinned       | **PASS**                                                     |
| Benchmark genuine and not overstated                    | **PASS** (Minor M-4)                                         |
| Accepted `pnpm verify` and portability gates preserved  | **PASS**                                                     |
| `pnpm verify` green on pinned runtime                   | **PASS** — exit 0                                            |
| `pnpm test:e2e` green                                   | **NOT VERIFIED HERE** — Chromium blocked in reviewer sandbox |
| SBLA-005/SBLA-006 scope boundary honest                 | **PASS**                                                     |
| Coverage risk stated accurately                         | **FAIL** — I-2                                               |
| Write boundary respected (14/14 claimed paths)          | **PASS**                                                     |

**Critical: 0. Important: 2 (I-1, I-2). Minor: 5 (M-1 … M-5), all nonblocking
with impact and destination recorded.**

### Required next step

One bounded remediation covering I-1 and I-2, then one complete-artifact recheck
as `reviews/releases/SBLA-004-r2.md`. Do not add a review layer. The five Minor
findings may be folded into the same remediation or deferred as recorded; M-4
must be closed before SBLA-005 assigns `browser_performance`.

### What this candidate got right

Recorded so the remediation does not disturb it: the licence research is genuine
primary-source work that reproduced verbatim on every field; the sample is
byte-identical to the official archive and its identity is enforced inside CI;
the benchmark record is arithmetically sound and honestly qualified; the §8.3
weights and floor are pinned against transcribed literals; the technical scores
are correctly left null; the scope boundary is stated plainly and enforced
mechanically; and two earlier errors were corrected in the open rather than
quietly. The two blocking findings are narrow and repairable.

---

## Report scope and worktree state

- **Verdict: FAIL.**
- **Reviewed commit: `098be6201987552c0ed789f3ada8a64e39472aab`** (tree
  `ceafc648e9381e10296be5bd7243793fe086a8b9`).
- Branch: `claude-review/SBLA-004-r1`;
  worktree `.worktrees/sbla-004-claude-review-r1`.
- Intended sole changed path: `reviews/releases/SBLA-004-r1.md`, a new regular
  file (Git mode `100644`), status `A`.
- `git status --porcelain` in the reviewed worktree: **empty (clean)** at
  `098be62` before, during, and after this review. This reviewer changed nothing.
- **This reviewer could not `git add` or commit.** The sandbox denies writes under
  `/Users/frankbisignano/dev/science-lifting-atlas/` (write probe: `Operation not
permitted`). **Codex must commit this report unmodified at
  `reviews/releases/SBLA-004-r1.md`.** Its line count, byte count, and SHA-256 are
  reported with delivery so the committed object can be verified byte-for-byte
  against what this reviewer authored.
- All executable checks ran against a byte-identical clone in `$TMPDIR/sbla004`;
  probe mutations were confined to disposable copies and never touched the
  reviewed worktree.

This report is immutable and append-only. Any further round creates
`reviews/releases/SBLA-004-r2.md` and never edits this file.
