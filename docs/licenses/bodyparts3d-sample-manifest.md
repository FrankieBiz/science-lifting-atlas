# BodyParts3D — sample acquisition manifest and coverage observation

Accessed **2026-08-30**. Download index:
<https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>

This closes part of the §18 SBLA-004 "sample files" deliverable: it records
exactly what lawful samples exist, where, at what size, and with what checksum,
so SBLA-005 can acquire them without re-deriving any of it.

**No BodyParts3D file is committed to this repository.** The licence permits
redistribution, so §8.4's exception would allow it — but CC BY-SA 2.1 Japan
attaches share-alike to derivative works, and the share-alike boundary between an
asset package and this application is one of the unresolved legal questions
recorded in [`anatomy-assets.md`](anatomy-assets.md). Committing licensed geometry
before that is resolved could create obligations the owner has not agreed to.
Acquisition is therefore a deliberate owner decision, not a blocked one.

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

### Mesh archives — NOT fetched

| File                         |   Size | Note                                 |
| ---------------------------- | -----: | ------------------------------------ |
| `isa_BP3D_4.0_obj_99.zip`    | 136 MB | Wavefront OBJ, 99% polygon reduction |
| `partof_BP3D_4.0_obj_99.zip` |  62 MB | Wavefront OBJ, 99% polygon reduction |

Sizes are as published on the download index; checksums are unknown because the
archives were not downloaded.

## Coverage observation against master plan §4.3

**This is an observation from published English labels, not a §8.3 score.**
SBLA-005 owns scoring `coverage_naming`, and should confirm this by inspecting
meshes, not labels.

Method: case-insensitive substring search for each §4.3 structure across all
**eight** metadata files above (60,317 lines total).

**24 of 28 structures present. 4 absent:**

| Absent structure     | §4.3 requirement                                                      |
| -------------------- | --------------------------------------------------------------------- |
| **latissimus dorsi** | "Latissimus dorsi; teres major; trapezius regions; rhomboids."        |
| **rectus abdominis** | "Rectus abdominis, external/internal oblique, transversus abdominis…" |
| **erector spinae**   | "…spinal erector/multifidus groupings with careful claims."           |
| **multifidus**       | "…spinal erector/multifidus groupings with careful claims."           |

Loose substring counts across all 60,317 lines: `latissimus` **0**, `abdominis`
**0**, `erector` **0**, `spinae` **0**, `multifid` **0**, `hamstring` **0**.

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

Latissimus dorsi, rectus abdominis, and the spinal erectors are among the most
trained muscles in the sport this atlas is about. Their absence from the
published naming metadata is a **material coverage risk for the only candidate
that currently passes the licence gate**.

Caveat, stated plainly: this is a search of labels in the ontology metadata, not
an inspection of the 198 MB of meshes. A mesh could still exist under an FMA
concept whose label differs from every term searched. Three things make that
unlikely — zero hits across 60,317 lines, the Japanese-label file adding no
concepts, and the neighbouring back muscles all being present — but none of them
is mesh inspection, so this remains an observation and not proof.

**SBLA-005 must resolve this before SBLA-006's decision**, because the
combination — Path B licence-ineligible, Path C possibly coverage-inadequate,
OpenStax ineligible — would leave Path A (purchase) as the only viable route.
