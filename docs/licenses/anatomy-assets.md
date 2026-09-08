# Anatomy asset license inventory

**Status: no anatomy asset has been selected, purchased, or approved.** One
unchanged BodyParts3D mesh sample has been lawfully acquired for the technical
spike. Master plan §8 still forbids a purchase or selection until that spike is
complete. This file is the §8.4 licence record; the machine-readable source of
truth is [`asset-candidates.json`](asset-candidates.json).

Every licence fact below was read from a primary source. The BodyParts3D license
and download were re-verified on **2026-09-05**; the other sources were read on
**2026-08-30**. None is recalled. Re-verify by **2026-11-30**.

## Candidates

| Path | Candidate                   | Licence                                        | Commercial     |    Clarity | Eligible    |
| ---- | --------------------------- | ---------------------------------------------- | -------------- | ---------: | ----------- |
| A    | Purchased commercial asset  | vendor-specific                                | —              | not scored | placeholder |
| B    | Z-Anatomy                   | CC BY-SA 4.0 **with NonCommercial components** | mixed          |        3/5 | **No**      |
| C    | BodyParts3D / Anatomography | CC BY 4.0; sample retains historical SA notice | permitted      |        4/5 | Yes         |
| ref  | OpenStax A&P 2e             | CC BY-NC-SA 4.0                                | **prohibited** |        5/5 | **No**      |

Only **one** candidate is currently eligible to proceed. That is a material
finding, not a formality.

### Path B — Z-Anatomy — INELIGIBLE pending legal review

Licence chain, and it matters:

1. <https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/LICENSE> —
   master plan §20 cites this. Its **first three lines license the _app_** and
   defer the models elsewhere: "For more information about the license of
   Z-Anatomy's models, please visit the following link".
2. <https://docs.google.com/document/d/1peWW_7IiVgTTAwcI_auv38YSJ6qGWRuTMxzzhkRpXIk/edit>
   — the model licence document that link points to.

The model document opens permissively:

> All the code and content shared by 'Z-Anatomy' is under CC-BY-SA 4.0 license.
> You are free to: Share, adapt, and redistribute the material for any purpose,
> even commercially.

But its ATTRIBUTIONS / HUMAN MODEL section lists components under **mixed**
licences, including two NonCommercial ones:

| Component                                                              | Licence                                  |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| BodyParts3D                                                            | CC-BY 4.0 _(as attributed by Z-Anatomy)_ |
| Z-Anatomy                                                              | CC-BY-SA 4.0                             |
| Cranial Nerves and Foramina — University of Dundee, CAHID              | CC-BY 4.0                                |
| **Anatomy of the Inner Ear — University of Dundee School of Medicine** | **CC-BY-NC-SA 4.0**                      |
| **Kidney — Lissie Cowley**                                             | **CC-BY-NC 4.0**                         |
| Brainder / White matter — University of Washington                     | not stated                               |

**Two unresolved problems**, either of which blocks selection:

1. Two reference models are NonCommercial. Whether their geometry ships in the
   distributed model or was used only as modelling reference is **not
   established** from the source.
2. The share-alike boundary between an optimised derived mesh and the
   surrounding application remains open, exactly as §8.2 warns.

The earlier BodyParts3D license disagreement is resolved for current downloads:
DBCLS's license page was updated on 2025-02-27 and now also states CC BY 4.0.

Scored **3/5** for clarity — below the §8.3 floor — and recorded
`selectionEligible: false`. An earlier draft of this file scored it 4/5 on the
strength of "the repository's own LICENSE file", without following the referral
that file gives on its own second line. That was wrong and is corrected here.

### Path C — BodyParts3D / Anatomography

Current source: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html>

Creative Commons Attribution 4.0 International. The current license page was
last updated 2025-02-27 and permits access, redistribution, and derivative works
with attribution. Required attribution string, verbatim:

> BodyParts3D, © The Database Center for Life Science licensed under CC
> Attribution 4.0 International

Distributed as Wavefront OBJ meshes plus tab-delimited text, in 95% and 99%
polygon-reduction variants.

**Historical notice.** The unchanged `FJ1446.obj` sample extracted from the
current archive still embeds the older CC BY-SA 2.1 Japan notice. The repository
preserves that notice and conservatively treats the sample as subject to both
notices rather than assuming the current page retroactively changes its embedded
terms. This is why clarity remains 4/5 rather than 5/5.

### Reference — OpenStax Anatomy & Physiology 2e — INELIGIBLE

Source: <https://openstax.org/books/anatomy-and-physiology-2e/pages/preface>

CC BY-NC-SA 4.0. Two disqualifiers:

1. **NonCommercial**, conflicting with §8.1's preference for commercially
   flexible terms "to avoid a future rebuild".
2. **It prohibits LLM ingestion**, verbatim:

   > This book may not be used in the training of large language models or
   > otherwise be ingested into large language models or generative AI offerings
   > without OpenStax's permission.

§8.1 lists "No prohibition on AI-assisted processing" as a required capability,
and this project is executed by AI agents, so the restriction is directly
disqualifying for ingestion-based use. A human may still read it as a reference.

Image attribution, verbatim:

> Copyright Rice University, OpenStax, under CC BY-NC-SA 4.0 license.

## Exercise media

No separate candidate set. Per §11.9, exercise media derives from the selected
anatomy asset as scripted staged stills, joint-path diagrams, and short rigged 3D
loops. The selected asset's licence must therefore explicitly permit rigging,
rendering, and web distribution of derived media — a selection criterion, not an
afterthought.

Generated photoreal human video is excluded by §11.9. Generative image models
must not be used to fabricate anatomical structures presented as accurate anatomy
(§8.4).

### SBLA-005 measured feasibility — BodyParts3D

The machine-readable evidence is
[`bodyparts3d-feasibility.json`](bodyparts3d-feasibility.json). It separates
source facts, direct measurements, and reviewer judgments so an unavailable
capability cannot be mistaken for a positive result.

- **Static anatomy and staged-still tooling:** feasible. Two new clean runs of
  the pinned Blender 4.5.13 pipeline produced the same 2,874,932-byte GLB and
  the same 11,906-byte WebP poster. The poster is well below the 200 KB target.
  This proves the deterministic rendering path, not an approved exercise pose.
- **Throughput observation:** the two clean 139-mesh runs took 12.571 and 8.084
  seconds: 663.431708 and 1,031.667491 meshes/minute. The GLB plus poster is
  2,886,838 bytes from 54,495,284 selected source bytes, a 0.052974089
  derived/source byte ratio. Each run was one non-interactive operator command
  with zero manual editing. These are local measurements, not a production
  forecast.
- **Representative browser scene:** two fresh runs each loaded all 139 mapped
  objects. The GLB is 2,874,932 bytes and geometry buffers are 2,753,652 bytes.
  The final native Apple M3 profile measured a 0.15 ms median synchronous
  draw-plus-`gl.finish()` render cost and 4,595,816 bytes of precise JS heap;
  the reduced SwiftShader/4× CPU-throttle simulation measured 0.09 ms. The
  harness uses `requestAnimationFrame` only for stabilization, then times ten
  completed draws per each of 300 samples so display vsync does not masquerade
  as render cost. Both pass their frozen bands, but the simulation is not a
  physical mobile-device result and the battery-power environment remains a
  documented confound requiring later physical-device confirmation.
- **Materials and UVs:** all 139 selected OBJ files contain normals and a
  material-use name, but none contains UV coordinates or a material-library
  reference. The GLB contains one deterministic neutral review material, zero
  textures, zero images, and zero texture-coordinate primitives. This is a
  replacement material, not proof that source appearance survived.
- **Topology and coordinates:** the decoded GLB has zero degenerate faces, zero
  non-manifold edges, and zero same-direction shared edges. All 139 meshes are
  open, with 74,524 boundary edges, so global inward/outward winding remains
  inconclusive. World origin is preserved; millimetres are uniformly converted
  to metres; the maximum measured browser-transform difference is
  0.000000000498 m against a 0.0000005 m tolerance.
- **Rigged loops:** unsupported by the current source and artifact. The GLB has
  zero skins, joints, and animations, and the inspected source has no observed
  rig. Exercise media must use authored vector or staged diagrams unless a
  separately licensed and validated rig is added. Any later loop must target
  1.5 MB, remain below 3 MB, and load only on intent.
- **Accessibility:** a static joint-path diagram plus equivalent text can work
  without WebGL. Exercise-specific start/midpoint/end, joint path,
  range-of-motion, and common-error checkpoints are still blocked until Claude
  Research supplies cited, approved checkpoints. No movement is inferred from
  the mesh.
- **Presentation:** DBCLS describes the singular whole-body source model as an
  **adult human male**. One presentation from that model was inspected. The
  source makes no gender-identity claim, and no female, body-shape, or broader
  inclusive variant was observed. The scorecard must not claim presentation
  choices that are absent.

The current CC BY 4.0 terms permit adaptation and redistribution of the GLB,
poster, staged stills, and any later authored loop with attribution. Because the
downloaded OBJ headers retain a historical CC BY-SA 2.1 Japan notice, the
project conservatively preserves and applies both notices unless later legal
review resolves that boundary. Every derived-media record must carry the
required BodyParts3D attribution shown above.

## Handling rules in force

- §8.4: "Store original purchased/open assets outside the public repository
  **unless their license permits repository distribution.**" BodyParts3D's
  current CC BY 4.0 license and the sample's historical CC BY-SA 2.1 Japan notice
  both permit redistribution with attribution, so the unchanged sample and its
  full notice are checked in.
- Only authorised derivatives and required attribution notices are checked in.
- A purchased asset requires a written licence archive and a checksum of the
  delivered files before it can be scored (§8.2).
- Conversion must be a deterministic Blender/glTF pipeline; no undocumented
  manual edits (§8.4).

## What has not been done

- No candidate asset has been selected or purchased. The full BodyParts3D
  archives were acquired and checksum-verified outside Git for the SBLA-005
  spike; only authorized, budget-compliant derivatives and compact evidence are
  checked in.
- The measured scorecard is 73/100 and remains a recommendation only; SBLA-006
  and the owner decide. Five required targets are absent: latissimus dorsi,
  rectus abdominis, internal oblique, transversus abdominis, and multifidus.
  Because these are central to pulling and trunk/bracing coverage, this is a
  major product risk that the weighted total must not dilute.
- The SBLA-005 milestone is not accepted until its immutable handoff and
  independent review pass with no Critical or Important findings.
- No legal advice has been obtained on the Z-Anatomy NonCommercial components,
  its unclear reference-model boundary, or the share-alike boundary.
