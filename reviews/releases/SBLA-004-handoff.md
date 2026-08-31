# Handoff: SBLA-004 — Anatomy and exercise-media license inventory and spike script

## Objective

Deliver the SBLA-004 row of master plan §18: a candidate license inventory for
anatomy and exercise media, lawful samples, and a deterministic spike script,
with license fields complete, samples lawful, the script repeatable, and
`pnpm verify` green.

## Inputs and exact paths

- Canonical plan: `docs/product/master-plan.md` (§8.1–§8.4 asset gate, §8.3
  scorecard, §11.9 exercise media, §18, §20 candidate references)
- Dependency per §18: **SBLA-003**, candidate
  `0df3e9d7c20c8401004ef0a82177471f2a0c65cf`
- Base commit: `0df3e9d7c20c8401004ef0a82177471f2a0c65cf`
- Branch: `codex/SBLA-004-asset-license-inventory`
- Worktree: `.worktrees/sbla-004-asset-license-inventory`

### Dependency caveat a reviewer must weigh

SBLA-003 has **not** been reviewed or owner-approved. This branch is built on
its candidate commit because §18 names SBLA-003 as the dependency, but if
SBLA-003's hosting or asset-delivery decisions change under review, ADR 0003's
R2-for-large-assets premise — which this inventory assumes — may need revisiting.
Nothing here depends on the $0 model or the analytics decision.

## Constraints

- §8 forbids purchasing anything until the technical spike is complete. Nothing
  was purchased.
- §8.4 keeps original assets outside the repository. **No third-party asset was
  downloaded.** Acquiring binaries is an owner decision and is not needed to
  inventory license terms.
- SBLA-004 inventories and tools only. SBLA-005 measures; SBLA-006 records the
  owner's decision.
- No scientific claim, anatomy media, or content record was added.
- No legal advice was obtained or invented.

## Work completed

- `docs/licenses/asset-candidates.json` — machine-readable inventory of four
  candidates. Every license field carries its **primary source URL and access
  date**; none is recalled. Includes a `reverifyBy` date of 2026-11-30 and the
  §11.9 exercise-media strategy.
- `docs/licenses/anatomy-assets.md` — the §8.4 license record in prose, with
  verbatim attribution strings and the open questions stated plainly.
- `scripts/assets/scorecard.mjs` — pure validator: the §8.3 criteria and weights,
  the required license-field list, `validateLicenseFields`, `evaluateCandidate`,
  `evaluateInventory`.
- `scripts/assets/spike.mjs` — deterministic CLI producing the scorecard report.
- `tests/unit/asset-spike.test.ts` — 16 tests pinning the §8.3 weights and floor
  to literals, and covering missing/malformed fields, inventory malformations,
  status validation, duplicate ids, eligibility acknowledgement, refusal to total
  unmeasured candidates, and determinism.
- `package.json` — new stable command `pnpm assets:spike`, appended to
  `pnpm verify`. The SBLA-001 `REQUIRED_VERIFY_STEPS` order is unchanged.

### License findings

| Path | Candidate            | License            | Commercial     |    Clarity | Source read               |
| ---- | -------------------- | ------------------ | -------------- | ---------: | ------------------------- |
| A    | Purchased commercial | vendor-specific    | —              | not scored | no vendor selected        |
| B    | Z-Anatomy            | CC BY-SA 4.0       | permitted      |        4/5 | repository `LICENSE`      |
| C    | BodyParts3D          | CC BY-SA 2.1 Japan | permitted      |        4/5 | DBCLS data-archive README |
| ref  | OpenStax A&P 2e      | CC BY-NC-SA 4.0    | **prohibited** |        5/5 | OpenStax preface          |

Three findings worth the reviewer's attention:

1. **BodyParts3D's license is not on the page master plan §20 links.**
   `bp3d-dev.dbcls.jp` states only "©2010 DBCLS - Anatomography". The license and
   the exact attribution string had to be read from the DBCLS data archive, which
   is the primary source cited. Its license is CC BY-SA **2.1 Japan** — a national,
   unported-era instrument, not 4.0 — so Path B/Path C compatibility is an open
   question before mixing sources.
2. **OpenStax A&P 2e is NonCommercial.** §8.1 prefers commercially flexible terms
   "to avoid a future rebuild", so it cannot back the 2D fallback if the atlas may
   ever be commercial. Its terms are perfectly clear, hence clarity 5/5 —
   _clear_ is not the same as _suitable_, and the scorecard deliberately does not
   conflate them.
3. **Z-Anatomy's share-alike boundary is unresolved.** Whether an optimised
   derived mesh obliges the surrounding application to any license is exactly what
   §8.2 warns against assuming. Recorded as an open legal question, scored 4/5
   rather than 5/5 for that reason.

## Decisions made

- **Technical criteria are left `null`, not estimated.** Six of the seven §8.3
  criteria need real meshes, Blender, and a browser benchmark, which §18 assigns
  to SBLA-005. The script therefore **refuses to produce a weighted total** while
  any criterion is unmeasured rather than emitting a number that looks like
  evidence. Only `license_clarity` is scored, because only license work was in
  scope.
- **Path A is `status: "placeholder"`.** With no vendor selected it has no
  license to record, so requiring complete fields would fail the gate for the
  wrong reason. Placeholders are reported and skipped; `inventoried` candidates
  must have complete fields.
- **No asset downloaded, and the §18 "sample files" deliverable is NOT met.**
  The first draft justified this by citing §8.4's "Store original purchased/open
  assets outside the public repository" — but that rule ends
  "**unless their license permits repository distribution**", and both CC BY-SA
  candidates _do_ permit redistribution. The truncated quotation made a
  permission look like a prohibition. Corrected: lawful samples were permitted,
  none were gathered, and this task is therefore **incomplete on that
  deliverable**. It is recorded as an open item rather than argued away.
- **Wired into `pnpm verify`.** A malformed inventory now fails the build rather
  than sitting unnoticed until SBLA-005.

## Pre-review remediation

An adversarial pre-review audit of candidate `4b0a830` found defects including
two rated CRITICAL. All were repaired before this handoff:

| Finding                                                                                                                                                                                                                                 | Repair                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Z-Anatomy recorded as blanket CC BY-SA 4.0 / commercial-permitted.** The cited `LICENSE` licenses the _app_ and defers models to a separate document listing CC-BY-NC-SA 4.0 and CC-BY-NC 4.0 reference models inside the human model | Licence chain followed and recorded; component licences enumerated; attribution string populated; clarity re-scored 4 → **3**, below the §8.3 floor; marked `selectionEligible: false` |
| **`spike.mjs` printed "passed" and exited 0 on an inventory with no candidates** — also on a missing, null, non-array, or unparseable list                                                                                              | `evaluateInventory` now fails closed on all five; malformed JSON is caught and reported                                                                                                |
| OpenStax recorded as having no AI-processing restriction, though its cited page prohibits LLM ingestion                                                                                                                                 | Corrected and quoted verbatim; marked ineligible under §8.1                                                                                                                            |
| An unvalidated `status` string disabled both gates                                                                                                                                                                                      | `status` validated against `VALID_STATUSES`; unknown values are inventory defects                                                                                                      |
| Unit tests derived expectations from the constants under test, so the clarity floor and required-field list could be gutted with the suite green                                                                                        | Expectations re-pinned to **literals** transcribed from §8.3                                                                                                                           |
| Individual §8.3 weights unpinned — a redistribution preserving the sum passed                                                                                                                                                           | Each weight pinned individually                                                                                                                                                        |
| Licence-field validation was presence-only, so `"source": "TODO"` passed                                                                                                                                                                | `source` format-checked as an http(s) URL, `accessedOn` as an ISO date                                                                                                                 |
| An out-of-range score threw an uncaught `RangeError`, aborting before other candidates were checked                                                                                                                                     | Collected as a reported issue; every problem surfaces in one run                                                                                                                       |
| Duplicate candidate ids undetected                                                                                                                                                                                                      | Detected and reported                                                                                                                                                                  |
| `evaluateInventory` was exported, listed as delivered, but never called or tested                                                                                                                                                       | Now the single entry point used by `spike.mjs`, and covered by tests                                                                                                                   |
| The "samples lawful" argument rested on a truncated quote of §8.4                                                                                                                                                                       | Corrected; the deliverable is now recorded as unmet                                                                                                                                    |

Also found: two primary sources disagree on the BodyParts3D licence — Z-Anatomy
attributes it CC-BY 4.0, DBCLS states CC-BY-SA 2.1 Japan. Recorded as an
unresolved conflict, with DBCLS treated as authoritative.

Re-run of the break battery after repair: **13 malformation cases, all exit 1**;
the real inventory exits 0.

## Tests/checks run and results

Pinned runtime: Node.js `v24.20.0`, pnpm `11.24.0`.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)**: Prettier PASS; ESLint PASS 0 warnings;
  `astro check` 26 files, 0 errors/warnings/hints; 4 unit files, **26 tests**;
  content/graph/evidence adapters PASS; 1 page built; foundation contract PASS;
  asset spike PASS.
- `pnpm test:a11y`, `pnpm test:visual`, `pnpm test:performance` — PASS.
- **Determinism:** `spike.mjs` run 5 times produced **one** unique MD5
  (`07ff3cf8ec85b9404c653ed8aafa3f57`). No timestamps, randomness, or
  filesystem-order dependence in the output.
- **Fails closed 1:** deleting `commercialUse` from an inventoried candidate →
  exit **1**, `path-b-z-anatomy: missing licence field: commercialUse`.
- **Fails closed 2:** setting `license_clarity` to 3 → exit **1**,
  `Z-Anatomy: REJECTED (licence clarity 3 is below the required floor of 4)`.
- **Restored:** exit **0**.
- All four cited license URLs returned HTTP 200 on 2026-08-30.

## Known uncertainties

- **The §18 "sample files" deliverable is unmet.** §8.4 permits repository
  distribution where the licence allows it, and both CC BY-SA candidates allow
  it, so no rule prevented gathering lawful samples. None were gathered.
  SBLA-005's benchmarking depends on them. **A reviewer should treat SBLA-004 as
  incomplete on this deliverable.**
- **Only `license_clarity` is scored.** Every weighted total is `null` by design.
  The scorecard is unexercised on a fully-scored real candidate outside unit
  tests.
- **The clarity scores are judgements, not measurements.** 4/5 for Z-Anatomy and
  BodyParts3D reflects unresolved compatibility and share-alike questions; a
  reviewer may score them differently, and both sit exactly on the §8.3 floor,
  so a one-point downward revision would reject them.
- **No legal advice.** The share-alike boundary and the 2.1-Japan/4.0
  compatibility question both need a lawyer, not another agent.
- **License terms change.** All four readings are point-in-time with a
  2026-11-30 re-verification date.
- **`pnpm test:e2e` was not run** — Chromium cannot launch in this sandboxed
  shell. This task changes no runtime code.
- SBLA-003, this task's dependency, is itself unreviewed.

## Files created or modified

Created:

- `docs/licenses/asset-candidates.json`
- `scripts/assets/scorecard.mjs`
- `scripts/assets/spike.mjs`
- `tests/unit/asset-spike.test.ts`
- `reviews/releases/SBLA-004-handoff.md`

Modified:

- `docs/licenses/anatomy-assets.md`
- `package.json`

## Required reviewer action

Independently review this branch at its final commit and return PASS or FAIL per
criterion to `reviews/releases/SBLA-004-r1.md`. Do not repair the artifact.

Specifically decide:

1. Whether every license field matches its cited primary source, and whether any
   was recalled rather than read.
2. **Whether "samples lawful" is satisfied by committing no samples**, or whether
   SBLA-004 requires real candidate samples and must be reopened.
3. Whether leaving six of seven criteria unscored is correct scope discipline or
   an incomplete deliverable.
4. Whether the 4/5 clarity scores are defensible, given the floor is 4.
5. Whether the spike script is genuinely deterministic and fails closed.
6. Whether appending `assets:spike` to `pnpm verify` weakens any SBLA-001 gate.
7. Whether basing on an unreviewed SBLA-003 is acceptable.

## Acceptance criteria

- A candidate inventory exists covering anatomy and exercise media, with every
  license field complete for each inventoried candidate.
- Every license fact carries a primary source URL and an access date.
- The spike script is deterministic and repeatable.
- The script fails closed on incomplete license fields and enforces the §8.3
  license-clarity floor of 4/5.
- No asset is purchased, downloaded, selected, or approved.
- No SBLA-001 command, gate, or test is renamed, removed, or weakened.
- `pnpm verify` exits zero and the working tree is clean.
