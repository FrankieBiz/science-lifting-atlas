# BodyParts3D — sample acquisition manifest and coverage observation

Metadata accessed **2026-08-30**; license and mesh archive re-verified
**2026-09-05**. Download index:
<https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>

This closes the §18 SBLA-004 "sample files" deliverable with a real unchanged
mesh, exact provenance, and a repeatable browser measurement. The complete
archive remains outside the repository; the smallest relevant mesh needed to
exercise the real parsing and WebGL path is checked in.

The current DBCLS license page grants CC BY 4.0. The sample itself retains an
older CC BY-SA 2.1 Japan header; both permit redistribution with attribution.
The repository preserves the header and includes the current and historical
notices in `assets/samples/bodyparts3d/LICENSE.md`.

## Acquired real mesh sample

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Repository path    | `assets/samples/bodyparts3d/FJ1446.obj`                            |
| Source archive     | `partof_BP3D_4.0_obj_99.zip`                                       |
| Path in archive    | `partof_BP3D_4.0_obj_99/FJ1446.obj`                                |
| Concept            | FMA45874 — abdominal part of right pectoralis major                |
| Bytes              | 105,005                                                            |
| Lines              | 3,590                                                              |
| Vertices / normals | 1,019 / 1,019                                                      |
| Faces / triangles  | 1,536 / 1,536                                                      |
| SHA-256            | `964ab8e287e7f44f14b07d8c7694ec70eee63bc9d7b1eeb3c5dc79e80460336d` |
| Modifications      | None; byte-identical ZIP extraction                                |

The 64,888,505-byte source archive was downloaded from the official current
endpoint and checksummed as
`9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`.
It is not checked in.

`pnpm assets:benchmark` verifies the sample's byte size and SHA-256 before
opening Chromium, then performs one warmup plus five uncached trials that fetch,
parse, upload, and draw the real geometry. The recorded run is in
[`bodyparts3d-browser-benchmark.json`](bodyparts3d-browser-benchmark.json).

## Published files

Base URL: `https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/`

### Ontology and naming metadata — fetched and verified

All **eight** published text files, tab-separated. Fetched to a temporary
directory, checksummed, then discarded. **60,317 lines total.**

| File                                 |     Bytes |  Lines | SHA-256 (first 16) |
| ------------------------------------ | --------: | -----: | ------------------ |
| `isa_element_parts.txt`              | 1,142,159 | 29,550 | `a3de74423f943b0d` |
| `isa_inclusion_relation_list.txt`    |   207,664 |  2,905 | `26e7d818e03a8c90` |
| `isa_parts_list.txt`                 |   302,828 |  2,906 | `e5f32398b916e259` |
| `isa_parts_list_e.txt`               |   128,086 |  2,906 | `ab7796deedd49205` |
| `partof_element_parts.txt`           |   651,179 | 17,944 | `3f5f6df1028eb122` |
| `partof_inclusion_relation_list.txt` |    91,241 |  1,368 | `1b40738270931e3c` |
| `partof_parts_list.txt`              |   142,590 |  1,369 | `dd29cceba270ffaa` |
| `partof_parts_list_e.txt`            |    59,351 |  1,369 | `9224080557053e6f` |

Full SHA-256 values for the five files first fetched are:
`isa_parts_list_e` `ab7796deedd49205e77f3609a1cb8c53e2bbee14ecb5c9a6ca05227469780513`,
`partof_parts_list_e` `9224080557053e6f1322f1e13ab27f0ecde0db19bb3b505f0631afad230eeebd`,
`isa_element_parts` `a3de74423f943b0d724ae8f59b3a817f87c423a544f8db98113b1980817cbeaf`,
`partof_element_parts` `3f5f6df1028eb122b30de77c711597b6bb8e5541658e5985859fd228adbf88ea`,
`partof_inclusion_relation_list` `1b40738270931e3c1d955ce34e0fce0d8d10d8c5ad543463e40b4b4c0243007c`.

Schema of `isa_element_parts.txt`: `concept id` (FMA), `name` (English),
`element file id` — it maps an anatomical concept to its mesh file.

`isa_parts_list.txt` adds `kanji` and `kana` columns to the English list. It
contains the **same 2,905 distinct concept ids**, so it adds no structures — only
Japanese labels. That rules out the possibility that a structure exists under a
Japanese-only name.

**Correction:** an earlier revision of this file described five metadata files
and 47,137 lines as the complete set. There are eight files and 60,317 lines. The
three missed files (`isa_parts_list.txt`, `partof_parts_list.txt`,
`isa_inclusion_relation_list.txt`) have now been fetched and searched; they did
not change the finding below, but the earlier "complete set" claim was wrong.

### Mesh archives

| File                         |   Size | Note                                  |
| ---------------------------- | -----: | ------------------------------------- |
| `isa_BP3D_4.0_obj_99.zip`    | 136 MB | Wavefront OBJ, 99% polygon reduction  |
| `partof_BP3D_4.0_obj_99.zip` |  62 MB | Fetched and checksummed on 2026-09-05 |

Sizes are as published on the download index. The larger IS-A archive remains
unfetched because the PART-OF archive supplied the smallest relevant sample
needed for this milestone.

## Coverage observation against master plan §4.3

**This is an observation from published English labels, not a §8.3 score.**
SBLA-005 owns scoring `coverage_naming`, and should confirm this by inspecting
meshes, not labels.

Method: `scripts/assets/coverage.mjs` evaluates an explicit 28-target list from
§4.3 across all **eight** metadata files above (60,317 lines total). Each simple
target has a recorded case-insensitive label term. Each compound target requires
every recorded component group, so a literal umbrella label is not required.
This makes the observation repeatable and prevents inconsistent treatment of
groups such as hamstrings and spinal erectors.

After downloading the eight files into one directory, reproduce with:

```sh
pnpm assets:coverage /path/to/bodyparts3d-metadata/*.txt
```

**23 of 28 structures present. 5 absent:**

| Absent structure          | §4.3 requirement                                                      |
| ------------------------- | --------------------------------------------------------------------- |
| **latissimus dorsi**      | "Latissimus dorsi; teres major; trapezius regions; rhomboids."        |
| **rectus abdominis**      | "Rectus abdominis, external/internal oblique, transversus abdominis…" |
| **internal oblique**      | "Rectus abdominis, external/internal oblique, transversus abdominis…" |
| **transversus abdominis** | "Rectus abdominis, external/internal oblique, transversus abdominis…" |
| **multifidus**            | "…spinal erector/multifidus groupings with careful claims."           |

Loose substring counts across all 60,317 lines: `latissimus` **0**, `abdominis`
**0**, `multifid` **0**, and `hamstring` **0**. The zero `hamstring` hit does
not create an absence because biceps femoris, semitendinosus, and
semimembranosus are all present.

The explicit target ids and exact term groups are versioned in
`COVERAGE_TARGETS`. Important compound rules include all four rotator-cuff
muscles; anterior and posterior forearm compartments; all four quadriceps
components; all three hamstring components; iliacus plus psoas major; both
gastrocnemius heads; and iliocostalis plus longissimus plus spinalis for the
spinal erector grouping.

The spinal erector group is present even though the literal strings `erector`
and `spinae` are absent. BodyParts3D/FMA publishes the group as “superficial
postvertebral muscle” and maps its iliocostalis, longissimus, and spinalis
components to meshes (for example FJ1527 and FJ1535). This correction applies
the same component-aware rule already used for hamstrings.

The contrast is what makes this credible rather than a search artefact — the
_neighbouring_ back muscles are all present: `pectoralis major` 72, `deltoid` 69,
`trapezius` 44, `rhomboid` 42, `teres major` 13. A dataset that names teres major
and the rhomboids 55 times between them, while never once naming latissimus
dorsi, has a genuine gap rather than a naming-convention mismatch.

Two further observations:

1. Only **96 distinct names** across the whole set contain the word "muscle".
2. Naming is largely at **group or compartment granularity** — "deep extrinsic
   muscle of shoulder", "muscle of anterior compartment of arm", "gluteal
   muscle" — rather than individually named muscles. §4.3 asks for
   individual-muscle records for most of the trained musculature, and §6.3
   requires a per-muscle page.

## Why this matters now

Latissimus dorsi, rectus abdominis, the internal oblique, transversus
abdominis, and multifidus are important trained structures. Their absence from
the published naming metadata is a **material coverage risk for the only
candidate that currently passes the licence gate**.

Caveat, stated plainly: this is an evaluation of labels in the ontology metadata, not
an inspection of the 198 MB of meshes. A mesh could still exist under an FMA
concept whose label differs from every term searched. Three things make that
unlikely — zero hits across 60,317 lines, the Japanese-label file adding no
concepts, and the neighbouring back muscles all being present — but none of them
is mesh inspection, so this remains an observation and not proof.

**SBLA-005 must resolve this before SBLA-006's decision**, because the
combination — Path B licence-ineligible, Path C possibly coverage-inadequate,
OpenStax ineligible — would leave Path A (purchase) as the only viable route.
