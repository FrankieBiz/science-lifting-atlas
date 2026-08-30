# Anatomy asset license inventory

**Status: no anatomy asset has been selected, purchased, downloaded, or
approved.** Master plan §8 forbids purchasing anything until the technical spike
is complete. This file is the §8.4 licence record; the machine-readable source of
truth is [`asset-candidates.json`](asset-candidates.json).

Every licence fact below was read from the cited primary source on
**2026-08-30**. None is recalled. Re-verify by **2026-11-30**.

## Candidates

| Path | Candidate                   | Licence            | Commercial     | Share-alike |    Clarity |
| ---- | --------------------------- | ------------------ | -------------- | ----------- | ---------: |
| A    | Purchased commercial asset  | vendor-specific    | —              | —           | not scored |
| B    | Z-Anatomy                   | CC BY-SA 4.0       | permitted      | required    |        4/5 |
| C    | BodyParts3D / Anatomography | CC BY-SA 2.1 Japan | permitted      | required    |        4/5 |
| ref  | OpenStax A&P 2e             | CC BY-NC-SA 4.0    | **prohibited** | required    |        5/5 |

### Path B — Z-Anatomy

Source: <https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/LICENSE>

Creative Commons Attribution-ShareAlike 4.0 International. Commercial use,
modification, and web distribution are permitted; attribution is required.
Share-alike attaches to adapted material:

> The Adapter's License You apply must be a Creative Commons license with the
> same License Elements, this version or later, or a BY-SA Compatible License.

**Open question.** Whether an optimised mesh derived from Z-Anatomy obliges the
surrounding application to any particular licence is unresolved. §8.2 explicitly
warns against assuming either way without actual legal guidance. The working
plan is to keep the asset package separately licensed and clearly attributed, but
that plan needs legal confirmation before Path B can be selected.

### Path C — BodyParts3D / Anatomography

Source: <https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/README_e.html>

Creative Commons Attribution-Share Alike 2.1 Japan. Access, redistribution, and
derivative works are permitted under attribution and share-alike. Required
attribution string, verbatim:

> BodyParts3D, Copyright© The Database Center for Life Science licensed by CC
> Attribution-Share Alike 2.1 Japan

Distributed as Wavefront OBJ meshes plus tab-delimited text, in 95% and 99%
polygon-reduction variants.

**Two caveats.** The licence is _not_ stated on the `bp3d-dev.dbcls.jp` landing
page named in master plan §20 — it had to be found on the DBCLS data archive.
And CC BY-SA 2.1 Japan is a national, unported-era instrument, not CC BY-SA 4.0;
compatibility must be checked before mixing Path B and Path C material.

### Reference — OpenStax Anatomy & Physiology 2e

Source: <https://openstax.org/books/anatomy-and-physiology-2e/pages/preface>

CC BY-NC-SA 4.0. **NonCommercial**, which conflicts with §8.1's preference for
commercially flexible terms "to avoid a future rebuild". Usable as a reading
reference for editorial accuracy; **not** usable as the basis of the 2D fallback
if the atlas may ever become commercial. Image attribution, verbatim:

> Copyright Rice University, OpenStax, under CC BY-NC-SA 4.0 license.

## Exercise media

No separate candidate set. Per §11.9, exercise media derives from the selected
anatomy asset as scripted staged stills, joint-path diagrams, and short rigged
3D loops. The selected asset's licence must therefore explicitly permit rigging,
rendering, and web distribution of derived media — this is a selection criterion,
not an afterthought.

Generated photoreal human video is excluded by §11.9. Generative image models
must not be used to fabricate anatomical structures presented as accurate
anatomy (§8.4).

## Handling rules in force

- Original assets stay **outside** this repository unless their licence permits
  repository distribution (§8.4).
- Only authorised derivatives and required attribution notices are checked in.
- A purchased asset requires a written licence archive and a checksum of the
  delivered files before it can be scored (§8.2).
- Conversion must be a deterministic Blender/glTF pipeline; no undocumented
  manual edits (§8.4).

## What has not been done

- No asset has been downloaded. Acquiring third-party binaries is an owner
  decision and is not required to inventory licences.
- No technical criterion has been scored. SBLA-005 owns measurement.
- No legal advice has been obtained on the share-alike boundary.
