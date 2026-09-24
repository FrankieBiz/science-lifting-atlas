# Body model selection for local review

Recorded: 2026-09-24  
Authority: owner request to decide whether the researched model is good enough, choose one, and add it  
Status: bounded local review prototype; production acceptance pending

## Selection

Use BodyParts3D 4.0 for an optional first pectoralis major study. The existing
139-mesh evaluation GLB does not form a convincing complete figure: the head
and complete feet are absent. The full Human Atlas adaptation is too large for
this page's first slice. A new 1.25 MB derivative combines its complete skin
surface with the six pectoralis major meshes approved in
`../../licenses/bodyparts3d-mesh-mapping.json`. The pectoralis parts align to
the source body and remain independently identifiable in the GLB. The asset is
good enough for a narrow local review preview, but it is not the finished
clinical or atlas-wide body model.

The model is built by `scripts/assets/build-body-model.py` from the exact
Human Atlas revision and four source files pinned in
`../../licenses/bodyparts3d-first-slice-manifest.json`. This repackages
BodyParts3D geometry; it does not import Human Atlas code or science copy.
DBCLS CC BY 4.0 attribution and the historical OBJ CC BY-SA 2.1 Japan notice
are retained in the manifest.

## Integration boundary

The viewer is limited to the unpublished, noindex pectoralis prototype. It
loads viewer code and geometry after user activation. The existing static
image, plain text, claims, qualifiers, and source routes remain usable without
JavaScript or WebGL. Other muscles are not represented by this small GLB.

This owner-directed preview is an exception to the _work pause_ in
`../design/SBLA-012-anatomy-production-hold.md`; the production hold and
SBLA-013 through SBLA-015 queue remain active. It is not an SBLA-012 visual
sign-off or a release of the full anatomy pipeline. Before production use,
the project still needs the seven explicit restart decisions in that hold,
independent scientific and technical review, owner visual approval, device
and accessibility checks, and measured performance acceptance.
