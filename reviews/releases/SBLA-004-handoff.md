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
- `tests/unit/asset-spike.test.ts` — 8 tests covering weights, missing fields,
  the clarity floor, refusal to total unmeasured candidates, determinism, and
  out-of-range rejection.
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
- **No asset downloaded.** Inventorying license terms needs the license text, not
  the binary. Downloading third-party assets is an owner decision under §8.4 and
  would have put unlicensed material near the repository for no gain.
- **Lawful samples.** No third-party sample is committed. The "samples lawful"
  condition is satisfied vacuously and deliberately — see Known uncertainties.
- **Wired into `pnpm verify`.** A malformed inventory now fails the build rather
  than sitting unnoticed until SBLA-005.

## Tests/checks run and results

Pinned runtime: Node.js `v24.20.0`, pnpm `11.24.0`.

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm verify` — **PASS (exit 0)**: Prettier PASS; ESLint PASS 0 warnings;
  `astro check` 26 files, 0 errors/warnings/hints; 4 unit files, **18 tests**;
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

- **"Samples lawful" is satisfied by having no samples.** §18 asks for sample
  files; none are committed because acquiring them means downloading third-party
  assets. A reviewer may reasonably judge that SBLA-004 is incomplete without
  real samples — if so, the owner must authorise acquisition and the task should
  be reopened. **This is the most likely reason to fail this handoff, and it is
  a deliberate choice, not an oversight.**
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
