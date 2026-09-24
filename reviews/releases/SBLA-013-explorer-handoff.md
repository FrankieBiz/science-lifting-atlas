# Homepage anatomy explorer handoff

Date: 2026-09-24
Builder: Codex
Branch: `codex/SBLA-013-bodyparts3d-first-slice`
Base: `6f11149`
Candidate: the commit containing this handoff

The owner requested the attractive interactive model on the website. The
homepage now presents a full muscular anatomy workspace with 23 mapped muscle
groups, search, model click selection, selected-muscle highlighting, isolation,
front/back views, zoom, reset, keyboard rotation, and a full-body static image.
The model loads near the viewport; loading failure retains the static image,
list, and retry action. Rendering occurs on interaction or resize instead of a
continuous animation loop. Production has no unpublished evidence links;
the local review build links the pectoralis selection to its record.

Source: pinned BodyParts3D adaptation from Human Atlas, revision
`5bb5713aab18d7fe9380c3339eb09f173491ea06`. The 140-part GLB is 2,965,672 bytes.
SHA-256: `4573baabdc50844959cb69e85eb20deba380c95476ab33db7f1e4e6279a10b81`.
Full provenance and mesh mapping are in
`docs/licenses/anatomy-explorer-manifest.json`. Current and historical license
notices are retained. The five previously absent muscle groups are not offered.

Verification: `pnpm verify` passed, including 325 unit tests, accessibility,
visual, content/evidence, portability, typecheck, lint, format, build, and
asset checks. `pnpm test:e2e` passed all 7, including interactive readiness,
search, selection, isolation, view controls, failure fallback, narrow reflow,
and publication boundaries. `pnpm test:prototype` passed all 9.
`pnpm test:performance` passed its one foundation contract; this is not a
physical-device 3D performance measurement. Browser control confirmed the
rendered homepage and back view. The static poster was captured directly from
the rendered canvas, without UI overlays.

Limits: the model is a source-specific adult male; geometry includes known
coverage gaps and no exercise animation. Some surface detail remains uneven.
Physical-device GPU/memory/frame-time measurements and independent anatomical
review remain pending before full production milestone acceptance. Vite warns
about the lazy viewer chunk size. Existing evidence and formal review gates
remain active. No milestone is self-accepted.

Preview: `http://127.0.0.1:4324/#anatomy-explorer`.
