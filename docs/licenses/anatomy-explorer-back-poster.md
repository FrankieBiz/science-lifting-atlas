# Anatomy explorer back-view poster

- **Source:** the project's derived BodyParts3D model at
  `assets/derived/bodyparts3d/anatomy-explorer.glb`.
- **Method:** rendered by `pnpm assets:render-posters`
  (`scripts/assets/render-posters.py`), a software rasteriser that draws the
  model above with the explorer's own camera: 32° field of view, position
  `(0, 0.88, ±3.45)` (negative for this back view), target `(0, 0.86, 0)`. It
  writes 3448×2688 transparent PNGs, four times the 862×672 frame the plate and
  hotspot points are measured against, so every point keeps its place. The
  presentation differs from the interactive explorer: per-muscle tone, a
  key / fill / rim light rig, ambient occlusion, seam lines between muscles, a
  rim-weighted skin shell, and smoothed shading normals. No mesh vertex is
  edited or added. The front poster, `anatomy-explorer-poster.png`, is rendered
  the same way from the front view. The renderer is deterministic, and
  `pnpm assets:render-posters -- --check` confirms each poster's silhouette
  matches the model through that camera (intersection over union of at least
  0.98; the browser-captured originals scored 0.9955 and 0.9957). Pages receive
  WebP variants generated at build time. The earlier browser captures from
  `pnpm assets:capture-posters` used the explorer's flatter single-colour
  materials; running that script replaces these posters with that look.
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Attribution:** BodyParts3D, © The Database Center for Life Science licensed
  under CC Attribution 4.0 International.

Source license: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html>.
