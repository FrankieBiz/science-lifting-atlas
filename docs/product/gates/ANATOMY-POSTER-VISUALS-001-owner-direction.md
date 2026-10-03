# Anatomy poster presentation upgrade

Recorded: 2026-10-02  
Authority: owner request, in session: "I want the stronger visual updated"  
Status: bounded exception, like the 2026-09-24 model-selection exception. It
does **not** release the SBLA-012 anatomy production hold. Recorded by the
Claude Code session holding the Codex role; the owner confirms it by approving
the branch.

## Why

The figures on the site look flat. The `bp/hq-anatomy-capture` note
(`docs/superpowers/plans/body-parts/progress/hq-anatomy-capture.md`) found two
causes: simplified geometry, and presentation (every muscle one grey-beige
colour, a uniformly milky skin shell, no ambient occlusion or seam definition).
The geometry ceiling is the BodyParts3D source, which is only published at 99%
polygon reduction. Presentation is the part that can be improved without
changing any asset, and the same note calls it "the larger visual win".

## What is permitted

Regenerate the two non-interactive posters
(`assets/derived/bodyparts3d/anatomy-explorer-poster.png` and
`...-back.png`) from the already-shipped `anatomy-explorer.glb`, using
`scripts/assets/render-posters.py`:

- the explorer's own camera (32° field of view, position `(0, 0.88, ±3.45)`,
  target `(0, 0.86, 0)`) and the 862 × 672 frame, so every hotspot and plate
  point stays valid;
- per-muscle tone variation, key / fill / rim lighting, ambient occlusion,
  seam lines between muscles, and a rim-weighted skin shell;
- the existing default selection (pectoralis major) highlighted, brighter than
  its neighbours so it still reads through the site's greyscale poster filter.

## What stays held

- No Blender install, no mesh edits, no new or replacement GLB, no new asset
  evaluation, no purchase.
- No change to the interactive explorer's materials or lighting
  (`AnatomyExplorer.astro` is claimed by PREVIEW-UX-001, whose handoff awaits
  independent review). The interactive view will look different from the new
  posters until that is coordinated.
- The posters remain a clearly labelled, non-interactive evaluation view. They
  are not presented as final-quality anatomy.
- BodyParts3D / DBCLS CC BY 4.0 attribution is unchanged; the poster is still
  derived from the same model.

## Acceptance

- Automated: each poster's silhouette matches the model seen through the
  explorer camera (intersection over union at least 0.98, measured at poster
  resolution by `pnpm assets:render-posters -- --check`). Measured: the previous
  browser-captured posters 0.9955 (front) and 0.9957 (back); the new posters
  0.9967 and 0.9968. So framing and hotspots hold. `pnpm verify` passes.
- Regenerate with `pnpm assets:render-posters` (needs Python 3 with numpy and
  Pillow). Do not run `pnpm assets:capture-posters` afterwards; it replaces
  these posters with the explorer's flatter look.
- Visual: no browser was available to the authoring session. The owner, or
  whoever the owner designates, inspects the home page, body map and a body-part
  page in a real browser before this goes live.
