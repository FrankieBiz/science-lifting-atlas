# Body model local review handoff

Date: 2026-09-24  
Builder: Codex  
Branch: `codex/SBLA-013-bodyparts3d-first-slice`  
Base: `35ff358891ec471eabbb836a9fbd6f28f2f5128e`  
Implementation: `9de3f95f47ab3f71dc977e3feb7a671768a7d3f9`  
Candidate: the commit containing this handoff and closed work-ledger row  
Status: implemented local review preview; production acceptance pending

## Result

The pectoralis prototype offers an optional BodyParts3D 4.0 model with a
complete body surface and six pectoralis major parts. Pointer, touch, and
keyboard controls rotate and zoom; reset restores camera distance, direction,
target, and field of view. A failed model request offers retry and preserves
the static image and evidence. The asset and viewer load only on activation.

The 1,251,304-byte GLB is generated deterministically from Human Atlas commit
`5bb5713aab18d7fe9380c3339eb09f173491ea06`, using four checksum-pinned source
files and the six approved pectoralis mesh identifiers. Output SHA-256:
`eb153315295908627d1b09f2ffd8555c28378291492f39b1853677c09ca013be`.
The source, adaptation, current attribution, and historic license notice are
recorded in `docs/licenses/bodyparts3d-first-slice-manifest.json`.

The GLB is served by the development server or copied into build output only
when `SBLA_012_PROTOTYPE=local-owner-review`. The ordinary build emits neither
the GLB nor the unpublished pectoralis page. The noindex and evidence
publication boundaries remain active.

## Verification

- `pnpm verify`: passed at initial implementation `b6e3114`: 324 unit tests,
  5 accessibility tests, 4 visual tests, 17 portability tests, lint, typecheck,
  formatting, content/graph/research validation, build, and asset gates.
- After the final camera, retry, and development-server refinements:
  formatting, lint, and typecheck passed again, with zero Astro diagnostics.
- `pnpm test:e2e`: 5 passed, including unpublished route and graph exclusion.
- `pnpm test:performance`: 1 foundation contract passed. This does not
  establish physical-device 3D frame-time or memory acceptance.
- `pnpm test:prototype`: all 9 passed on the final implementation, including
  activation-only GLB loading, actual rendered ready state, zoom/reset camera
  restoration, request-failure recovery, no-JavaScript fallback, reflow,
  navigation, and noindex disclosure.
- A second source build reproduced the exact GLB hash without changes.
- The local development endpoint returned bytes with the same GLB hash.
- Browser control inspected the full figure, an oblique view, and zoom/reset
  on the desktop layout and the narrow layout. Pectoralis geometry remains
  aligned to the translucent body; the head and feet fit the initial frame.

An earlier full verification attempt experienced four 5-second timeouts in
existing tests while the machine was slow. The fresh full run passed all 324
unit tests. The build retains a Vite warning for the large viewer JavaScript
chunk; that chunk is dynamically loaded after activation.

## Review boundary and next work

This is the owner-directed exception recorded in
`docs/product/gates/SBLA-013-model-selection-decision.md`. It is not acceptance
of SBLA-013, SBLA-014, or SBLA-015 and should not be merged as a production
anatomy release. Independent scientific/technical review, owner visual
approval, physical-device performance and accessibility evidence, and the
full production restart decisions remain pending.

Only the pectoralis major is highlighted. This is a source-specific adult
male model, without exercise animation or the rest of the atlas's muscle
coverage. The complete-body shape is suitable for the first study; the
material and anatomy presentation remain a review candidate.

## Local preview

Build: `SBLA_012_PROTOTYPE=local-owner-review pnpm build`  
Development: `SBLA_012_PROTOTYPE=local-owner-review pnpm dev`  
Route: `/muscles/pectoralis-major/#body-model`

The task leaves a static local preview at
`http://127.0.0.1:4324/muscles/pectoralis-major/#body-model`.
