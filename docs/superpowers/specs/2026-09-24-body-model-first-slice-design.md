# Body model first slice

## Owner direction and scope

On 2026-09-24, the owner asked Codex to decide whether the investigated body
model is good enough, choose a model, and add it to the website. This delegates
the model decision and authorizes a bounded interactive implementation. It does
not claim SBLA-012 acceptance or completion of the SBLA-013 through SBLA-015
production gates.

## Decision

Use BodyParts3D 4.0 as the source. The earlier SBLA-006 decision already
approved it as an optional 3D enhancement for 23 of 28 mapped targets. The
existing 139-mesh review GLB omits the head and complete feet when viewed in a
browser, so it is not suitable as a whole-body hero. A complete BodyParts3D
body-surface mesh with six separately mapped pectoralis major meshes gives an
accurate whole-body silhouette and precise first-muscle emphasis at roughly
1.25 MB. It is sufficient for an optional first slice, not the finished atlas
model. The canonical source, historic OBJ notice, and license attribution must
travel with the derivative.

The source geometry is taken from the browser-ready BodyParts3D 4.0 adaptation
in Human Atlas, pinned by Git commit and per-file hashes. The build script
creates the GLB deterministically from the seven selected meshes. No Human Atlas
scientific descriptions or application code are imported.

## Experience

The pectoralis major page keeps its static anatomical plate and all evidence
content. Beneath the opening section, a quiet card offers **Explore the body in
3D**. Activation downloads the local GLB and the viewer code. The model shows
a neutral translucent adult male body surface and the two sides of pectoralis
major in rose. Pointer/touch orbit and zoom come from the viewer component; an
accessible reset control restores the front angle. The card explains that the
model is a source-specific anatomical reference and that scientific takeaways
remain in the page content. With JavaScript or WebGL unavailable, the static
plate and page text remain complete.

## Performance, provenance, and acceptance

The initial page transfers no 3D geometry. The GLB has a 3 MB mobile ceiling
and a 6 MB desktop target; this seven-part slice is substantially below both.
The asset manifest records source revision, selected mesh identifiers, license,
output hash, byte count, and known coverage limits. A meaningful asset test
must reject a missing or changed mesh, a changed GLB, and incorrect attribution.
Browser checks must show that the load button reveals the model without losing
the evidence route, that the normal public build still excludes unpublished
muscle pages, and that no-JavaScript use retains the static path.

This first slice is a review candidate. Independent scientific/technical review
and owner visual inspection remain before production acceptance.
