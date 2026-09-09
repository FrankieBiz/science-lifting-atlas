# Gate A — anatomy asset and fallback decision

**Decision date:** 2026-09-09  
**Outcome:** **YES — approve the 2D-authoritative hybrid; NO purchase**  
**Authority:** owner-delegated project decision, recorded by Codex  
**Machine record:** [`anatomy-asset-decision.json`](../../licenses/anatomy-asset-decision.json), SHA-256 `98078059b1385a258776145fa0b528a046098f77843503c57eda6b744fb57a27`

## Decision

The complete core atlas will use original, evidence-reviewed semantic vector
diagrams and equivalent text for all 28 required targets. BodyParts3D 4.0 is
approved only as optional progressive 3D enhancement for the 23 targets that
SBLA-005 mapped. The five absent targets—latissimus dorsi, rectus abdominis,
internal oblique, transversus abdominis, and multifidus—remain 2D/text-only
unless a separately licensed source clears later gates. No commercial asset is
purchased.

## Evidence and inspectable artifacts

- SBLA-005 score: **73/100**, still measurement rather than blanket approval.
- Coverage: **23/28**, with the exact gaps above; see
  [`bodyparts3d-mesh-mapping.json`](../../licenses/bodyparts3d-mesh-mapping.json).
- Source: **BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction**, pinned by the
  two archive filenames, byte counts, and SHA-256 values in the machine record.
- License: [official DBCLS terms](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html),
  checked 2026-09-09: CC BY 4.0 International, derivative work and
  redistribution permitted with attribution. Historical CC BY-SA 2.1 Japan OBJ
  notices remain conservatively applied.
- Performance: 2,874,932-byte representative GLB; 3.811125 ms native and
  6.0015 ms reduced-simulation median frame cost; see
  [`bodyparts3d-performance.json`](../../licenses/bodyparts3d-performance.json).
- Feasibility and limits:
  [`bodyparts3d-feasibility.json`](../../licenses/bodyparts3d-feasibility.json).
- Independent SBLA-005 review:
  [`SBLA-005-r1.md`](../../../reviews/releases/SBLA-005-r1.md), PASS with zero
  Critical and zero Important findings.

## Risks accepted, not hidden

- BodyParts3D cannot supply five required pulling/trunk targets.
- Source material/UV survival failed; all selected meshes are open; the measured
  artifact has no rig, skeleton context, or animation.
- Only one adult male presentation was observed.
- The reduced performance profile is a simulation, not a physical mid-tier
  phone result.
- Historical and current license notices must both ship until legal review
  resolves their boundary.

These risks are acceptable only because the semantic 2D/text path is complete,
authoritative, accessible without WebGL, and produced later from reviewed
scientific evidence—not inferred from the 3D mesh.

## Cost

- Purchase: **$0**
- Recurring asset license fee: **$0**
- Purchase/license archive: not applicable; no commercial delivery exists.
- Future cost: staff/agent effort to research, review, design, and generate the
  vector baseline and production derivatives in SBLA-008 through SBLA-015.

## Choices and signed outcome

| Choice                                  | Yes/No  | Reason                                                         |
| --------------------------------------- | ------- | -------------------------------------------------------------- |
| Approve 2D-authoritative hybrid         | **YES** | Complete accessible baseline plus useful bounded 3D            |
| Use BodyParts3D as sole/complete source | **NO**  | Coverage and capability failures                               |
| Purchase a commercial asset now         | **NO**  | No acquired, licensed, checksum-pinned benchmark candidate     |
| Combine with Z-Anatomy                  | **NO**  | Below the 4/5 license-clarity floor                            |
| Use OpenStax assets                     | **NO**  | NonCommercial and AI-ingestion restriction                     |
| Defer all 3D                            | **NO**  | The 23-target measured subset is useful within hard boundaries |

## Next proof

SBLA-007 may begin only after independent Account-B review of this exact
decision commit. SBLA-013 must generate and checksum production assets;
SBLA-015 must prove the no-WebGL journey and physical-device performance before
the interactive anatomy experience can be approved.
