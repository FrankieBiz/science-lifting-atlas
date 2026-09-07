"""Deterministic, non-interactive BodyParts3D OBJ-to-GLB conversion.

Run with the pinned Blender distribution, for example:
Blender --background --python scripts/assets/blender/convert.py -- --mapping ...
The official archive inputs remain external; every imported byte is checked against
the committed mesh mapping before Blender is allowed to read it.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import json
import math
import os
import platform
import shutil
import struct
import subprocess
import sys
import tempfile
import time
import uuid
from pathlib import Path

TRANSACTION_PROBE = "--transaction-probe" in sys.argv
POLICY_PROBE = "--publication-policy-probe" in sys.argv
BASELINE_AUTH_PROBE = "--baseline-auth-probe" in sys.argv
RAW_GLB_PROBE = "--raw-glb-probe" in sys.argv
RECEIPT_PROBE = "--receipt-probe" in sys.argv
if not any((TRANSACTION_PROBE, POLICY_PROBE, BASELINE_AUTH_PROBE, RAW_GLB_PROBE, RECEIPT_PROBE)):
    import bpy
    from mathutils import Vector

BLENDER_VERSION = "4.5.13"
MAPPING_SHA256 = "b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196"
NEUTRAL_MATERIAL = "SBLA_Neutral_Review"
LOD_RATIO = 0.15
EXPECTED_BLENDER_VERSION = (4, 5, 13)
EXPECTED_BLENDER_VERSION_STRING = "4.5.13 LTS"
LIGHTS = (
    ("SBLA005_Key", (3.0, -4.0, 5.0), 1100),
    ("SBLA005_Fill", (-3.0, -2.0, 2.0), 550),
)
STAGE_PREFIX = ".sbla005-conversion-stage-"
LOCK_NAME = ".bodyparts3d-conversion.lock"
ARTIFACT_NAMES = {
    "glb": "sbla005-representative.glb",
    "poster": "sbla005-poster.webp",
    "manifest": "bodyparts3d-conversion-manifest.json",
}
ACTIVE_STAGE = None
FLOAT32_BOUND_TOLERANCE_METRES = 0.0000005
MATERIAL_CLAIM = {"name": NEUTRAL_MATERIAL, "baseColorRgba": [0.58, 0.24, 0.16, 1.0],
                  "metallic": 0.0, "roughness": 0.62, "alphaMode": "OPAQUE", "doubleSided": True}
REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
ACCEPTED_OUTPUT_DIR = (REPOSITORY_ROOT / "assets/derived/bodyparts3d").resolve()
ACCEPTED_MANIFEST = (REPOSITORY_ROOT / "docs/licenses/bodyparts3d-conversion-manifest.json").resolve()
RECEIPT_RELATIVE_PATH = "docs/licenses/bodyparts3d-conversion-baseline-receipt.json"
ACCEPTED_RECEIPT = (REPOSITORY_ROOT / RECEIPT_RELATIVE_PATH).resolve()
EXECUTABLE_SHA256 = "49fa4d4694f55b37b58b18d99a71bdc8228d30545caa2e16c9f99952f4c76f55"
CODESIGN_ID = "org.blenderfoundation.blender"
CODESIGN_TEAM = "68UA947AUU"
CODESIGN_AUTHORITY = "Developer ID Application: Stichting Blender Foundation (68UA947AUU)"
CODESIGN_FULL_SHA256 = "e1603c3bd5b6af74898ea9f53fc668eb02a3979c3f1ceb5b708687c42e7fd8fd"


def finite_number(value):
    """Accept real JSON numbers only; bool and non-finite floats fail closed."""
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def finite_vector(value, length, label):
    if not isinstance(value, (list, tuple)) or len(value) != length or not all(finite_number(item) for item in value):
        raise RuntimeError(f"{label} must contain exactly {length} finite numbers")
    return list(value)


def outside_repository(path):
    return not Path(path).resolve().is_relative_to(REPOSITORY_ROOT)


def publication_policy(baseline_only, compare_values, output_dir, manifest_path):
    """Fail closed before generation chooses a baseline or accepted release."""
    supplied = [bool(value) for value in compare_values]
    output_dir, manifest_path = Path(output_dir).resolve(), Path(manifest_path).resolve()
    if baseline_only:
        if any(supplied):
            raise RuntimeError("baseline-only generation cannot consume comparison inputs")
        if not outside_repository(output_dir) or not outside_repository(manifest_path):
            raise RuntimeError("baseline-only outputs must remain outside the repository")
        return "baseline-unpublished"
    if not all(supplied):
        raise RuntimeError("release publication requires prior manifest, GLB, and poster comparison inputs, the expected manifest SHA-256, and a strict-ancestor baseline receipt")
    if output_dir != ACCEPTED_OUTPUT_DIR or manifest_path != ACCEPTED_MANIFEST:
        raise RuntimeError("release publication must target the accepted repository artifact paths")
    return "published-release"


def digest_bytes(value):
    return hashlib.sha256(value).hexdigest()


def git_command(arguments):
    return subprocess.run(["git", *arguments], cwd=REPOSITORY_ROOT, check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def load_committed_receipt(receipt_path, receipt_commit, working_bytes_override=None):
    receipt_path = Path(receipt_path).resolve()
    if receipt_path != ACCEPTED_RECEIPT:
        raise RuntimeError("baseline receipt must use the accepted repository path")
    try:
        resolved = git_command(["rev-parse", "--verify", receipt_commit + "^{commit}"]).stdout.decode().strip()
        head = git_command(["rev-parse", "HEAD"]).stdout.decode().strip()
        ancestor = subprocess.run(["git", "merge-base", "--is-ancestor", resolved, head],
                                  cwd=REPOSITORY_ROOT).returncode == 0
    except subprocess.CalledProcessError as error:
        raise RuntimeError("baseline receipt commit is not a valid Git commit") from error
    if not ancestor or resolved == head:
        raise RuntimeError("baseline receipt commit must be a strict ancestor of current HEAD")
    try:
        committed_bytes = git_command(["show", resolved + ":" + RECEIPT_RELATIVE_PATH]).stdout
        blob = git_command(["rev-parse", resolved + ":" + RECEIPT_RELATIVE_PATH]).stdout.decode().strip()
    except subprocess.CalledProcessError as error:
        raise RuntimeError("baseline receipt is absent from the supplied ancestor commit") from error
    working_bytes = (Path(working_bytes_override).read_bytes() if working_bytes_override
                     else receipt_path.read_bytes())
    if working_bytes != committed_bytes:
        raise RuntimeError("receipt bytes differ from the committed Git blob")
    receipt = json.loads(committed_bytes)
    if receipt.get("status") != "pre-release-commitment":
        raise RuntimeError("baseline receipt is not a pre-release commitment")
    return receipt, {"commit": resolved, "blob": blob, "sha256": digest_bytes(committed_bytes)}


def run_identity(status):
    return {
        "runId": str(uuid.uuid4()),
        "createdAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "mode": status,
        "tool": {"versionString": EXPECTED_BLENDER_VERSION_STRING,
                 "distributionSha256": "663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53"},
        "source": {"mappingSha256": MAPPING_SHA256},
    }


def verify_blender_runtime_provenance():
    """Bind this pinned macOS arm64 run to the signed Blender executable."""
    if sys.platform != "darwin" or platform.machine() != "arm64":
        raise RuntimeError("pinned Blender conversion is verified only on macOS arm64")
    executable = Path(bpy.app.binary_path).resolve()
    if digest(executable) != EXECUTABLE_SHA256:
        raise RuntimeError("running Blender executable SHA-256 is not the pinned identity")
    try:
        subprocess.run(["codesign", "--verify", "--strict", str(executable)], check=True,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        detail = subprocess.run(["codesign", "-d", "--verbose=6", str(executable)], check=True,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stderr
    except (FileNotFoundError, subprocess.CalledProcessError) as error:
        raise RuntimeError("running Blender executable failed strict macOS code-signature verification") from error
    lines = detail.splitlines()
    value = lambda prefix: next((line.split("=", 1)[1] for line in lines if line.startswith(prefix)), None)
    authority = next((line.split("=", 1)[1] for line in lines if line.startswith("Authority=")), None)
    observed = {"identifier": value("Identifier="), "teamIdentifier": value("TeamIdentifier="),
                "authority": authority, "cdHashFullSha256": value("CandidateCDHashFull sha256=")}
    expected = {"identifier": CODESIGN_ID, "teamIdentifier": CODESIGN_TEAM,
                "authority": CODESIGN_AUTHORITY, "cdHashFullSha256": CODESIGN_FULL_SHA256}
    if observed != expected:
        raise RuntimeError("running Blender code signature does not match the pinned official publisher identity")
    return {"platform": "macOS arm64", "executableSha256": EXECUTABLE_SHA256,
            "codeSignature": observed,
            "limitation": "Pinned and publisher-authenticated only for the verified macOS arm64 pipeline."}


def load_authenticated_baseline(manifest_path, expected_sha256, glb_path, poster_path, current_output_dir,
                                receipt_path=None, receipt_commit=None):
    """Read each input once, then authenticate and compare only those bytes."""
    manifest_path, glb_path, poster_path = map(lambda value: Path(value).resolve(),
                                               (manifest_path, glb_path, poster_path))
    receipt = receipt_git = None
    if receipt_path or receipt_commit:
        if not receipt_path or not receipt_commit:
            raise RuntimeError("baseline receipt path and commit must both be supplied")
        receipt, receipt_git = load_committed_receipt(receipt_path, receipt_commit)
    snapshots = {"manifest": manifest_path.read_bytes(), "glb": glb_path.read_bytes(),
                 "poster": poster_path.read_bytes()}
    if len(expected_sha256) != 64 or any(character not in "0123456789abcdef" for character in expected_sha256):
        raise RuntimeError("baseline manifest SHA-256 trust anchor must be 64 lowercase hexadecimal characters")
    if digest_bytes(snapshots["manifest"]) != expected_sha256:
        raise RuntimeError("baseline manifest does not match the caller-supplied SHA-256 trust anchor")
    baseline = json.loads(snapshots["manifest"])
    publication, identity = baseline.get("publication", {}), baseline.get("runIdentity", {})
    if publication.get("status") != "baseline-unpublished" or publication.get("commitMarker") is not None:
        raise RuntimeError("authenticated comparison manifest is not an unpublished baseline")
    try:
        uuid.UUID(identity["runId"])
        datetime.fromisoformat(identity["createdAt"].replace("Z", "+00:00"))
    except (KeyError, ValueError) as error:
        raise RuntimeError("baseline run identity is invalid") from error
    expected_identity = {
        "mode": "baseline-unpublished",
        "tool": {"versionString": EXPECTED_BLENDER_VERSION_STRING,
                 "distributionSha256": "663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53"},
        "source": {"mappingSha256": MAPPING_SHA256},
    }
    if any(identity.get(key) != value for key, value in expected_identity.items()):
        raise RuntimeError("baseline run provenance does not match the pinned tool and source identities")
    if baseline.get("tool", {}).get("runtime") != {"version": [4, 5, 13], "versionString": EXPECTED_BLENDER_VERSION_STRING}:
        raise RuntimeError("baseline manifest runtime identity is invalid")
    if baseline.get("tool", {}).get("officialDistribution", {}).get("sha256") != expected_identity["tool"]["distributionSha256"]:
        raise RuntimeError("baseline manifest distribution identity is invalid")
    if baseline.get("source", {}).get("mappingManifest", {}).get("sha256") != MAPPING_SHA256:
        raise RuntimeError("baseline manifest source mapping identity is invalid")
    if not all(outside_repository(path) for path in (manifest_path, glb_path, poster_path)):
        raise RuntimeError("authenticated baseline manifest and artifacts must remain outside the repository")
    current_output_dir = Path(current_output_dir).resolve()
    if glb_path.parent == current_output_dir or poster_path.parent == current_output_dir:
        raise RuntimeError("baseline and current runs must use distinct artifact directories")
    for name, path in (("glb", glb_path), ("poster", poster_path)):
        record = baseline.get("artifacts", {}).get(name, {})
        if Path(record.get("path", "")).resolve() != path:
            raise RuntimeError("baseline " + name + " path does not match its authenticated manifest")
        if digest_bytes(snapshots[name]) != record.get("sha256") or len(snapshots[name]) != record.get("bytes"):
            raise RuntimeError("baseline " + name + " does not match its authenticated manifest")
    if receipt:
        committed = receipt.get("baseline", {})
        if (committed.get("manifestSha256") != expected_sha256
                or committed.get("runId") != identity["runId"]
                or committed.get("createdAt") != identity["createdAt"]):
            raise RuntimeError("ancestor receipt does not bind the authenticated baseline manifest")
        for name in ("glb", "poster"):
            committed_artifact = committed.get("artifacts", {}).get(name, {})
            record = baseline["artifacts"][name]
            if (committed_artifact.get("name") != Path(record["path"]).name
                    or committed_artifact.get("sha256") != record["sha256"]
                    or committed_artifact.get("bytes") != record["bytes"]):
                raise RuntimeError("ancestor receipt does not bind the authenticated baseline " + name)
        if (receipt.get("source", {}).get("mappingSha256") != MAPPING_SHA256
                or receipt.get("tool", {}).get("versionString") != EXPECTED_BLENDER_VERSION_STRING
                or receipt.get("tool", {}).get("distributionSha256") != expected_identity["tool"]["distributionSha256"]):
            raise RuntimeError("ancestor receipt does not bind the pinned source and tool")
        receipt_signature = receipt.get("tool", {}).get("macosCodeSignature", {})
        if (receipt.get("tool", {}).get("executableSha256") != EXECUTABLE_SHA256
                or receipt_signature != {"identifier": CODESIGN_ID, "teamIdentifier": CODESIGN_TEAM,
                                         "authority": CODESIGN_AUTHORITY,
                                         "cdHashFullSha256": CODESIGN_FULL_SHA256}):
            raise RuntimeError("ancestor receipt does not bind the signed Blender executable")
    authenticated = {"manifestSha256": expected_sha256, "runId": identity["runId"],
                     "createdAt": identity["createdAt"],
                     "trustAnchor": "caller-supplied SHA-256 verified before JSON parsing",
                     "snapshotFlow": "Manifest, GLB, and poster were each read once; authentication and comparison used those same private snapshot bytes."}
    if receipt_git:
        authenticated["receipt"] = receipt_git
    return baseline, authenticated, snapshots


def transaction_paths(output_dir, manifest_path):
    """Create one unique staging sibling for every would-be final artifact."""
    output_dir = Path(output_dir).resolve()
    manifest_path = Path(manifest_path).resolve()
    output_dir.parent.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix=STAGE_PREFIX, dir=output_dir.parent))
    staged = {name: stage / filename for name, filename in ARTIFACT_NAMES.items()}
    finals = {
        "glb": output_dir / ARTIFACT_NAMES["glb"],
        "poster": output_dir / ARTIFACT_NAMES["poster"],
        "manifest": manifest_path,
    }
    return stage, staged, finals


def promote_staged_artifacts(staged, finals, failure_after=None):
    """Manifest-last transaction-style promotion with complete rollback.

    Three cross-directory renames cannot be kernel-atomic. The manifest is the
    commit marker: consumers must accept the GLB and poster only when their
    hashes match it. A scoped directory lock serializes promotion, while local
    snapshots restore every previous final after any promotion exception.
    """
    lock = finals["manifest"].parent / LOCK_NAME
    try:
        lock.mkdir()
    except FileExistsError as error:
        raise RuntimeError("conversion promotion lock is already held: " + str(lock)) from error
    existed = {}
    snapshots_complete = False
    backup_dir = staged["manifest"].parent / ".rollback"
    try:
        backup_dir.mkdir()
        for name, final in finals.items():
            existed[name] = final.is_file()
            if existed[name]:
                shutil.copy2(final, backup_dir / name)
        snapshots_complete = True
        for name in ("glb", "poster", "manifest"):
            os.replace(staged[name], finals[name])
            if failure_after == name:
                label = "GLB" if name == "glb" else name
                raise RuntimeError("forced promotion failure after " + label)
    except Exception:
        if snapshots_complete:
            # Restore the old commit marker first. During rollback, consumers
            # either see the old valid release or reject a hash mismatch.
            for name in ("manifest", "poster", "glb"):
                final = finals[name]
                if existed[name]:
                    restore = backup_dir / (name + ".restore")
                    shutil.copy2(backup_dir / name, restore)
                    os.replace(restore, final)
                elif final.exists():
                    final.unlink()
        raise
    finally:
        shutil.rmtree(backup_dir, ignore_errors=True)
        try:
            lock.rmdir()
        except FileNotFoundError:
            pass


def publish_staged_artifacts(stage, staged, finals, validator, failure_after=None):
    """Validate only staged bytes, then promote or leave accepted finals intact."""
    try:
        validator(staged)
        promote_staged_artifacts(staged, finals, failure_after=failure_after)
    finally:
        shutil.rmtree(stage, ignore_errors=True)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stable_json(value):
    return json.dumps(value, indent=2, sort_keys=True) + "\n"


def args_after_double_dash():
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def selected_meshes(mapping):
    """Return checksum-bound representative meshes in stable file-ID order."""
    selected = {}
    for target in mapping["coverage"]["targets"]:
        for component in target["components"]:
            for mesh in component["meshes"]:
                prior = selected.get(mesh["fileId"])
                if prior and prior["sha256"] != mesh["sha256"]:
                    raise RuntimeError("conflicting source identity for " + mesh["fileId"])
                selected[mesh["fileId"]] = mesh
    return [selected[key] for key in sorted(selected)]


def external_source(mesh, isa_dir, partof_dir):
    """Resolve only an OBJ whose bytes exactly match the mapping identity."""
    filename = mesh["fileId"] + ".obj"
    candidates = [isa_dir / filename, partof_dir / filename]
    matches = [path for path in candidates if path.is_file() and digest(path) == mesh["sha256"]]
    if len(matches) != 1:
        raise RuntimeError("expected one checksum-valid external OBJ for " + mesh["fileId"])
    if matches[0].stat().st_size != mesh["bytes"]:
        raise RuntimeError("source byte count differs for " + mesh["fileId"])
    return matches[0]


def scene_bounds(objects):
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return {
        "min": [round(min(point[i] for point in points), 9) for i in range(3)],
        "max": [round(max(point[i] for point in points), 9) for i in range(3)],
    }


def geometry_fingerprint(objects):
    """Stable decoded geometry identity independent of GLB JSON/container metadata."""
    payload = []
    for obj in sorted(objects, key=lambda item: item.name):
        mesh = obj.data
        payload.append({
            "name": obj.name,
            "vertices": len(mesh.vertices),
            "polygons": len(mesh.polygons),
            "triangles": sum(len(poly.vertices) - 2 for poly in mesh.polygons),
            "bounds": {
                "min": [round(min(v.co[i] for v in mesh.vertices), 9) for i in range(3)],
                "max": [round(max(v.co[i] for v in mesh.vertices), 9) for i in range(3)],
            },
        })
    return payload


def triangle_referenced_bounds(mesh):
    """Bounds of vertices actually referenced by exported polygon triangles."""
    referenced = {vertex for polygon in mesh.polygons for vertex in polygon.vertices}
    if not referenced:
        raise RuntimeError("mesh has no triangle-referenced vertices")
    points = [mesh.vertices[index].co for index in referenced]
    return {"min": [round(min(point[i] for point in points), 9) for i in range(3)],
            "max": [round(max(point[i] for point in points), 9) for i in range(3)]}


def mesh_health(objects):
    """Conservative structural checks; boundary edges are not automatically defects."""
    boundary_edges = non_manifold_edges = degenerate_faces = 0
    for obj in objects:
        mesh = obj.data
        mesh.update(calc_edges=True)
        incidence = {}
        for polygon in mesh.polygons:
            vertices = list(polygon.vertices)
            for index, vertex in enumerate(vertices):
                edge = tuple(sorted((vertex, vertices[(index + 1) % len(vertices)])))
                incidence[edge] = incidence.get(edge, 0) + 1
        boundary_edges += sum(1 for count in incidence.values() if count == 1)
        non_manifold_edges += sum(1 for count in incidence.values() if count > 2)
        degenerate_faces += sum(1 for polygon in mesh.polygons if polygon.area <= 1e-12)
    return {"boundaryEdges": boundary_edges, "nonManifoldEdges": non_manifold_edges,
            "degenerateFaces": degenerate_faces}


def normal_winding_health(objects):
    """Distinguish local winding consistency from provable closed-mesh orientation."""
    same_direction = zero_area = closed_outward = closed_inward = open_inconclusive = 0
    classifications = []
    for obj in objects:
        mesh = obj.data
        directed = {}
        signed_volume = 0.0
        for polygon in mesh.polygons:
            if polygon.area <= 1e-12 or polygon.normal.length <= 1e-12:
                zero_area += 1
            vertices = list(polygon.vertices)
            for index, vertex in enumerate(vertices):
                following = vertices[(index + 1) % len(vertices)]
                key = tuple(sorted((vertex, following)))
                direction = (vertex, following)
                directed.setdefault(key, []).append(direction)
            anchor = mesh.vertices[vertices[0]].co
            for index in range(1, len(vertices) - 1):
                first, second = mesh.vertices[vertices[index]].co, mesh.vertices[vertices[index + 1]].co
                signed_volume += anchor.dot(first.cross(second)) / 6.0
        boundary = sum(1 for edges in directed.values() if len(edges) == 1)
        conflicts = sum(1 for edges in directed.values() if len(edges) == 2 and edges[0] == edges[1])
        if boundary:
            orientation = "inconclusive-open"
            open_inconclusive += 1
        elif signed_volume < 0:
            orientation = "inward-closed"
            closed_inward += 1
        else:
            orientation = "outward-closed"
            closed_outward += 1
        classifications.append({"name": obj.name, "boundaryEdges": boundary, "signedVolumeMetresCubed": round(signed_volume, 12), "globalOrientation": orientation, "localSameDirectionSharedEdges": conflicts})
        for edges in directed.values():
            if len(edges) == 2 and edges[0] == edges[1]:
                same_direction += 1
    return {"method": "decoded-glb-local-winding-plus-closed-signed-volume", "zeroAreaFaces": zero_area,
            "sameDirectionSharedEdges": same_direction,
            "closedOutward": closed_outward, "closedInward": closed_inward, "openInconclusive": open_inconclusive,
            "perMesh": classifications,
            "result": "local-consistency-pass" if zero_area == 0 and same_direction == 0 else "local-consistency-fail"}


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)


def decoded_glb_structure(path):
    """Independently decode a GLB and report only its exported mesh structure."""
    clear_scene()
    bpy.ops.import_scene.gltf(filepath=str(path))
    objects = sorted((item for item in bpy.context.scene.objects if item.type == "MESH"), key=lambda item: item.name)
    return {"objects": len(objects), "meshObjects": len(objects), "names": [item.name for item in objects],
            "sceneBoundsMetres": scene_bounds(objects), "decodedGeometry": geometry_fingerprint(objects),
            "meshHealth": mesh_health(objects), "normalWinding": normal_winding_health(objects)}


def glb_document_and_binary(path):
    blob = path.read_bytes()
    if blob[:4] != b"glTF" or struct.unpack_from("<I", blob, 4)[0] != 2:
        raise RuntimeError("invalid GLB header")
    json_length, json_kind = struct.unpack_from("<II", blob, 12)
    if json_kind != 0x4E4F534A:
        raise RuntimeError("GLB JSON chunk is missing")
    document = json.loads(blob[20:20 + json_length].decode("utf-8").rstrip(" "))
    binary_header = 20 + json_length
    binary_length, binary_kind = struct.unpack_from("<II", blob, binary_header)
    if binary_kind != 0x004E4942:
        raise RuntimeError("GLB binary chunk is missing")
    binary = blob[binary_header + 8:binary_header + 8 + binary_length]
    return document, binary


def accessor_values(document, binary, accessor_index):
    accessor = document["accessors"][accessor_index]
    view = document["bufferViews"][accessor["bufferView"]]
    formats = {5121: ("B", 1), 5123: ("H", 2), 5125: ("I", 4), 5126: ("f", 4)}
    widths = {"SCALAR": 1, "VEC3": 3}
    if accessor["componentType"] not in formats or accessor["type"] not in widths:
        raise RuntimeError("unsupported raw GLB accessor representation")
    if accessor.get("sparse") is not None or view.get("buffer", 0) != 0:
        raise RuntimeError("unsupported sparse or external raw GLB accessor")
    code, component_bytes = formats[accessor["componentType"]]
    width = widths[accessor["type"]]
    packed_bytes = component_bytes * width
    stride = view.get("byteStride", packed_bytes)
    if stride < packed_bytes:
        raise RuntimeError("raw GLB accessor stride is invalid")
    start = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    view_end = view.get("byteOffset", 0) + view["byteLength"]
    values = []
    for index in range(accessor["count"]):
        offset = start + index * stride
        if offset + packed_bytes > len(binary) or offset + packed_bytes > view_end:
            raise RuntimeError("raw GLB accessor exceeds its binary buffer")
        value = struct.unpack_from("<" + code * width, binary, offset)
        if code == "f" and not all(math.isfinite(component) for component in value):
            raise RuntimeError("raw GLB accessor contains a non-finite numeric value")
        values.append(value[0] if width == 1 else value)
    return values


def identity_node_transform(node):
    identity_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    translation = finite_vector(node.get("translation", [0, 0, 0]), 3, "node translation")
    rotation = finite_vector(node.get("rotation", [0, 0, 0, 1]), 4, "node rotation")
    scale = finite_vector(node.get("scale", [1, 1, 1]), 3, "node scale")
    matrix = finite_vector(node.get("matrix", identity_matrix), 16, "node matrix")
    return (translation == [0, 0, 0]
            and rotation == [0, 0, 0, 1]
            and scale == [1, 1, 1]
            and matrix == identity_matrix)


def raw_glb_evidence(path, object_records, material_claim=MATERIAL_CLAIM):
    """Decode GLB JSON and binary accessors without Blender re-import."""
    document, binary = glb_document_and_binary(path)
    expected = {record["name"]: record for record in object_records}
    nodes = document.get("nodes", [])
    if len(nodes) != 139 or len(expected) != 139:
        raise RuntimeError("raw GLB node count does not match required mapped object count")
    material = document.get("materials", [{}])[0]
    pbr = material.get("pbrMetallicRoughness", {})
    actual_material = {"name": material.get("name"), "baseColorRgba": pbr.get("baseColorFactor", [1, 1, 1, 1]),
                       "metallic": pbr.get("metallicFactor", 1), "roughness": pbr.get("roughnessFactor", 1),
                       "alphaMode": material.get("alphaMode", "OPAQUE"), "doubleSided": material.get("doubleSided", False)}
    actual_color = finite_vector(actual_material["baseColorRgba"], 4, "raw GLB baseColorFactor")
    declared_color = finite_vector(material_claim["baseColorRgba"], 4, "declared baseColorRgba")
    scalar_keys = ("metallic", "roughness")
    for key in scalar_keys:
        if not finite_number(actual_material[key]) or not finite_number(material_claim[key]):
            raise RuntimeError(f"raw GLB material {key} must be a finite number")
    if not isinstance(actual_material["doubleSided"], bool) or not isinstance(material_claim["doubleSided"], bool):
        raise RuntimeError("raw GLB material doubleSided must be boolean")
    if (actual_material["name"] != material_claim["name"]
            or actual_material["alphaMode"] != material_claim["alphaMode"]
            or actual_material["doubleSided"] != material_claim["doubleSided"]
            or any(abs(actual_material[key] - material_claim[key]) > 0.000001 for key in scalar_keys)
            or any(abs(actual_color[index] - declared_color[index]) > 0.000001 for index in range(4))):
        raise RuntimeError("raw GLB material does not match every declared material property")
    evidence = []
    transform_max_delta = 0.0
    accessor_max_delta = 0.0
    seen = set()
    for node in nodes:
        name, extras = node.get("name"), node.get("extras", {})
        if name in seen or name not in expected or "mesh" not in node:
            raise RuntimeError("raw GLB has missing, duplicate, or unexpected mapped node")
        if not identity_node_transform(node):
            raise RuntimeError("selectable node transform must be identity for " + str(name))
        seen.add(name)
        record = expected[name]
        if extras.get("sbla_source_file_id") != record["source"]["fileId"] or extras.get("sbla_source_sha256") != record["source"]["sha256"] or extras.get("sbla_entity_id") != record["normalized"]["entityId"] or extras.get("sbla_lod_ratio") != LOD_RATIO:
            raise RuntimeError("raw GLB node extras do not bind to source mapping")
        mesh = document["meshes"][node["mesh"]]
        primitives = mesh.get("primitives", [])
        if mesh.get("name") != name + "_LOD15" or len(primitives) != 1 or primitives[0].get("material") != 0:
            raise RuntimeError("raw GLB mesh or primitive material linkage is invalid")
        primitive = primitives[0]
        if primitive.get("mode", 4) != 4:
            raise RuntimeError("raw GLB primitive is not a triangle list")
        if "indices" not in primitive:
            raise RuntimeError("raw GLB triangle primitive lacks an index accessor")
        index_accessor = document["accessors"][primitive["indices"]]
        if index_accessor.get("type") != "SCALAR" or index_accessor.get("normalized", False):
            raise RuntimeError("triangle index accessor must be non-normalized SCALAR")
        if index_accessor.get("componentType") not in (5121, 5123, 5125):
            raise RuntimeError("triangle index accessor component type must be unsigned integer")
        if index_accessor.get("sparse") is not None:
            raise RuntimeError("triangle index accessor must not be sparse")
        if index_accessor.get("count", 0) <= 0 or index_accessor["count"] % 3:
            raise RuntimeError("triangle index accessor count must be positive and divisible by three")
        position_index = primitive["attributes"]["POSITION"]
        position_accessor = document["accessors"][position_index]
        if position_accessor["componentType"] != 5126 or position_accessor["type"] != "VEC3" or "indices" not in primitive:
            raise RuntimeError("raw GLB primitive lacks indexed float32 POSITION geometry")
        positions = accessor_values(document, binary, position_index)
        indices = accessor_values(document, binary, primitive["indices"])
        if not indices or any(not isinstance(index, int) for index in indices) or max(indices) >= len(positions):
            raise RuntimeError("raw GLB primitive indices are invalid")
        referenced = [positions[index] for index in set(indices)]
        browser_bounds = {"min": [min(point[i] for point in referenced) for i in range(3)],
                          "max": [max(point[i] for point in referenced) for i in range(3)]}
        declared_bounds = {"min": position_accessor.get("min", []), "max": position_accessor.get("max", [])}
        for key in ("min", "max"):
            declared_bounds[key] = finite_vector(
                declared_bounds[key], 3, f"raw GLB POSITION accessor {key} bounds"
            )
            finite_vector(browser_bounds[key], 3, f"calculated browser {key} bounds")
        accessor_delta = max(abs(actual - declared) for key in ("min", "max")
                             for actual, declared in zip(browser_bounds[key], declared_bounds[key]))
        accessor_max_delta = max(accessor_max_delta, accessor_delta)
        if accessor_delta > FLOAT32_BOUND_TOLERANCE_METRES:
            raise RuntimeError("raw GLB POSITION bounds differ from triangle-referenced geometry for " + name)
        blender_bounds = record["normalized"]["preExportReferencedBoundsMetres"]
        for key in ("min", "max"):
            finite_vector(blender_bounds.get(key), 3, f"Blender triangle-referenced {key} bounds")
        transformed = {"min": [blender_bounds["min"][0], blender_bounds["min"][2], -blender_bounds["max"][1]], "max": [blender_bounds["max"][0], blender_bounds["max"][2], -blender_bounds["min"][1]]}
        for key in ("min", "max"):
            finite_vector(transformed[key], 3, f"transformed browser {key} bounds")
        delta = max(abs(actual - expected) for key in ("min", "max") for actual, expected in zip(browser_bounds[key], transformed[key]))
        transform_max_delta = max(transform_max_delta, delta)
        if delta > FLOAT32_BOUND_TOLERANCE_METRES:
            raise RuntimeError("raw GLB POSITION bounds differ from triangle-referenced geometry after Blender-to-browser transform for " + name)
        evidence.append({"name": name, "mesh": mesh["name"],
                         "browserBoundsMetres": {key: [round(value, 9) for value in values] for key, values in browser_bounds.items()},
                         "accessorDeclaredBoundsMetres": declared_bounds,
                         "blenderTriangleReferencedBoundsMetres": blender_bounds, "positionAccessor": position_index,
                         "nodeTransform": "identity", "material": actual_material, "extras": extras})
    if seen != set(expected):
        raise RuntimeError("raw GLB omitted an expected mapped node")
    return {"coordinateSpace": "glTF browser Y-up: [x, z, -y] from Blender [x, y, z]",
            "boundsComparison": {"semantics": "triangle-referenced POSITION vertices only",
                                 "toleranceMetres": FLOAT32_BOUND_TOLERANCE_METRES,
                                 "toleranceBasis": "two float32 ULPs at the documented scene magnitude below 2 metres",
                                 "maximumObservedDeltaMetres": round(transform_max_delta, 12),
                                 "maximumAccessorMetadataDeltaMetres": round(accessor_max_delta, 12)},
            "browserTransformMaxDeltaMetres": round(transform_max_delta, 12), "material": actual_material, "objects": 139,
            "names": sorted(seen), "objectsEvidence": sorted(evidence, key=lambda item: item["name"])}


def validate_staged_release(staged, expected_status):
    """Fail closed on the staged release before any accepted final is replaced."""
    for path in staged.values():
        if not path.is_file():
            raise RuntimeError("staged release is missing " + str(path))
    manifest = json.loads(staged["manifest"].read_text())
    if manifest["tool"]["runtime"] != {"version": [4, 5, 13], "versionString": "4.5.13 LTS"}:
        raise RuntimeError("staged manifest Blender runtime is not pinned")
    expected_runtime_provenance = {
        "platform": "macOS arm64", "executableSha256": EXECUTABLE_SHA256,
        "codeSignature": {"identifier": CODESIGN_ID, "teamIdentifier": CODESIGN_TEAM,
                          "authority": CODESIGN_AUTHORITY,
                          "cdHashFullSha256": CODESIGN_FULL_SHA256},
        "limitation": "Pinned and publisher-authenticated only for the verified macOS arm64 pipeline.",
    }
    if manifest["tool"].get("runtimeProvenance") != expected_runtime_provenance:
        raise RuntimeError("staged manifest lacks signed Blender runtime provenance")
    if manifest["source"]["mappingManifest"]["sha256"] != MAPPING_SHA256:
        raise RuntimeError("staged manifest mapping identity is invalid")
    identity = manifest.get("runIdentity", {})
    if identity.get("mode") != expected_status or identity.get("tool", {}).get("versionString") != EXPECTED_BLENDER_VERSION_STRING or identity.get("source", {}).get("mappingSha256") != MAPPING_SHA256:
        raise RuntimeError("staged run identity does not bind the requested mode, tool, and source")
    glb, poster = manifest["artifacts"]["glb"], manifest["artifacts"]["poster"]
    for name, record in (("glb", glb), ("poster", poster)):
        if staged[name].stat().st_size != record["bytes"] or digest(staged[name]) != record["sha256"]:
            raise RuntimeError("staged " + name + " does not match its manifest identity")
    if glb["bytes"] > glb["hardCeilingBytes"] or poster["bytes"] > poster["ceilingBytes"]:
        raise RuntimeError("staged release exceeds an artifact budget")
    raw = manifest["rawGltfEvidence"]
    if raw["coordinateSpace"] != "glTF browser Y-up: [x, z, -y] from Blender [x, y, z]" or raw["objects"] != 139 or len(raw["objectsEvidence"]) != 139:
        raise RuntimeError("staged raw GLB coordinate or object metadata is incomplete")
    normal = manifest["visualInspection"]["normalWinding"]
    if normal["result"] != "local-consistency-pass" or normal["zeroAreaFaces"] != 0 or normal["sameDirectionSharedEdges"] != 0 or normal["closedInward"] != 0:
        raise RuntimeError("staged decoded GLB normal evidence failed")
    if expected_status == "published-release":
        deterministic = manifest["determinism"]
        required = ("sceneStructureEqual", "decodedGeometryEqual", "boundsEqual", "glbBytesEqual",
                    "posterBytesEqual", "priorArtifactAuthenticated")
        if deterministic["cleanRuns"] != 2 or not all(deterministic.get(key) is True for key in required):
            raise RuntimeError("staged release lacks an authenticated distinct-run comparison")
        authenticated = manifest.get("authenticatedBaseline", {})
        receipt = authenticated.get("receipt", {})
        if (len(authenticated.get("manifestSha256", "")) != 64
                or authenticated.get("runId") is None
                or authenticated.get("snapshotFlow") != "Manifest, GLB, and poster were each read once; authentication and comparison used those same private snapshot bytes."
                or len(receipt.get("commit", "")) != 40
                or len(receipt.get("blob", "")) != 40
                or len(receipt.get("sha256", "")) != 64):
            raise RuntimeError("staged release lacks its authenticated baseline trust anchor")
    publication = manifest.get("publication", {})
    if publication.get("status") != expected_status:
        raise RuntimeError("staged publication status does not match the requested mode")
    if expected_status == "published-release" and publication.get("commitMarker") != "docs/licenses/bodyparts3d-conversion-manifest.json":
        raise RuntimeError("staged release manifest-last publication contract is missing")
    if expected_status == "baseline-unpublished" and publication.get("commitMarker") is not None:
        raise RuntimeError("staged baseline must not claim a release commit marker")


def main():
    global ACTIVE_STAGE
    parser = argparse.ArgumentParser()
    parser.add_argument("--mapping", required=True)
    parser.add_argument("--isa-dir", required=True)
    parser.add_argument("--partof-dir", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--compare-manifest")
    parser.add_argument("--compare-manifest-sha256")
    parser.add_argument("--compare-glb")
    parser.add_argument("--compare-poster")
    parser.add_argument("--baseline-receipt")
    parser.add_argument("--baseline-receipt-commit")
    parser.add_argument("--baseline-only", action="store_true")
    options = parser.parse_args(args_after_double_dash())
    started = time.perf_counter()
    compare_values = (options.compare_manifest, options.compare_manifest_sha256,
                      options.compare_glb, options.compare_poster,
                      options.baseline_receipt, options.baseline_receipt_commit)
    publication_status = publication_policy(options.baseline_only, compare_values,
                                            options.output_dir, options.manifest)
    if bpy.app.version != EXPECTED_BLENDER_VERSION or bpy.app.version_string != EXPECTED_BLENDER_VERSION_STRING:
        raise RuntimeError("pinned Blender runtime mismatch: expected 4.5.13 LTS")
    runtime_provenance = verify_blender_runtime_provenance()
    mapping_path = Path(options.mapping).resolve()
    if digest(mapping_path) != MAPPING_SHA256:
        raise RuntimeError("mapping manifest SHA-256 does not match accepted SBLA-005 identity")
    mapping = json.loads(mapping_path.read_text())
    isa_dir, partof_dir = Path(options.isa_dir), Path(options.partof_dir)
    final_output_dir, final_manifest_path = Path(options.output_dir), Path(options.manifest)
    other = authenticated_baseline = baseline_snapshots = None
    if publication_status == "published-release":
        other, authenticated_baseline, baseline_snapshots = load_authenticated_baseline(
            options.compare_manifest, options.compare_manifest_sha256,
            options.compare_glb, options.compare_poster, final_output_dir,
            options.baseline_receipt, options.baseline_receipt_commit)
    stage, staged, finals = transaction_paths(final_output_dir, final_manifest_path)
    ACTIVE_STAGE = stage
    output_dir, manifest_path = stage, staged["manifest"]
    baseline_glb_snapshot = baseline_poster_snapshot = None
    if baseline_snapshots:
        baseline_glb_snapshot = stage / ".authenticated-baseline.glb"
        baseline_poster_snapshot = stage / ".authenticated-baseline.webp"
        baseline_glb_snapshot.write_bytes(baseline_snapshots["glb"])
        baseline_poster_snapshot.write_bytes(baseline_snapshots["poster"])

    clear_scene()
    collection = bpy.data.collections.new("SBLA005_Selectable_Anatomy")
    bpy.context.scene.collection.children.link(collection)
    material = bpy.data.materials.new(NEUTRAL_MATERIAL)
    material.diffuse_color = (0.58, 0.24, 0.16, 1.0)
    material.metallic = 0.0
    material.roughness = 0.62

    objects, object_records = [], []
    for mesh in selected_meshes(mapping):
        source = external_source(mesh, isa_dir, partof_dir)
        before = set(bpy.data.objects)
        bpy.ops.wm.obj_import(filepath=str(source), validate_meshes=True)
        created = [item for item in bpy.data.objects if item not in before and item.type == "MESH"]
        if len(created) != 1:
            raise RuntimeError("expected one imported mesh object for " + mesh["fileId"])
        obj = created[0]
        obj.name = "BP3D_" + mesh["fileId"]
        obj.data.name = obj.name + "_LOD15"
        for linked in list(obj.users_collection):
            linked.objects.unlink(obj)
        collection.objects.link(obj)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.context.scene.cursor.location = (0.0, 0.0, 0.0)
        bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
        # Blender's OBJ importer creates a conversion rotation.  Clear it so the
        # published world axes remain source X/Y/Z after millimetre-to-metre scaling.
        obj.rotation_euler = (0.0, 0.0, 0.0)
        obj.scale = (0.001, 0.001, 0.001)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        modifier = obj.modifiers.new("SBLA005_FixedLOD15", "DECIMATE")
        modifier.decimate_type = "COLLAPSE"
        modifier.ratio = LOD_RATIO
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        obj.data.materials.clear()
        obj.data.materials.append(material)
        obj["sbla_source_file_id"] = mesh["fileId"]
        obj["sbla_source_sha256"] = mesh["sha256"]
        obj["sbla_entity_id"] = mesh["conceptId"]
        obj["sbla_lod_ratio"] = LOD_RATIO
        obj.select_set(False)
        objects.append(obj)
        object_records.append({
            "name": obj.name,
            "source": {"fileId": mesh["fileId"], "sha256": mesh["sha256"], "bytes": mesh["bytes"]},
            "normalized": {"entityId": mesh["conceptId"], "material": NEUTRAL_MATERIAL,
                           "boundsMetres": {"min": [round(v, 9) for v in mesh["geometryBounds"]["min"]],
                                             "max": [round(v, 9) for v in mesh["geometryBounds"]["max"]]}},
            "lod": {"name": "LOD15", "method": "fixed-ratio-decimation", "ratio": LOD_RATIO},
        })

    # The mapping coordinates are millimetres.  Records above intentionally retain
    # source-space bounds; this block records output-space bounds from Blender.
    decoded_geometry = geometry_fingerprint(objects)
    health = mesh_health(objects)
    object_by_name = {item["name"]: item for item in object_records}
    for item in decoded_geometry:
        object_by_name[item["name"]]["normalized"]["preExportBoundsMetres"] = item["bounds"]
    for obj in objects:
        object_by_name[obj.name]["normalized"]["preExportReferencedBoundsMetres"] = triangle_referenced_bounds(obj.data)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    glb_path = output_dir / "sbla005-representative.glb"
    bpy.ops.export_scene.gltf(filepath=str(glb_path), export_format="GLB", use_selection=True,
                              export_materials="EXPORT", export_apply=True, export_cameras=False,
                              export_lights=False, export_extras=True, export_yup=True)

    bpy.ops.object.select_all(action="DESELECT")
    camera_data = bpy.data.cameras.new("SBLA005_FixedCamera")
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 2.4
    camera = bpy.data.objects.new("SBLA005_FixedCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (2.6, -4.2, 1.7)
    camera.rotation_euler = (Vector((0.0, 0.0, 0.72)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = camera
    camera_record = {"type": "ORTHO", "location": [2.6, -4.2, 1.7], "target": [0.0, 0.0, 0.72],
                     "rotationEuler": [round(value, 9) for value in camera.rotation_euler], "orthoScale": 2.4,
                     "resolution": [800, 1000]}
    lights = []
    for name, location, energy in LIGHTS:
        light_data = bpy.data.lights.new(name, "AREA")
        light_data.energy, light_data.shape, light_data.size = energy, "DISK", 5.0
        light_data.color = (1.0, 1.0, 1.0)
        light_data.use_shadow = True
        light_data.diffuse_factor = 1.0
        light_data.specular_factor = 1.0
        light = bpy.data.objects.new(name, light_data)
        bpy.context.scene.collection.objects.link(light)
        light.location = location
        light.rotation_euler = (Vector((0.0, 0.0, 0.72)) - light.location).to_track_quat('-Z', 'Y').to_euler()
        lights.append({"name": name, "type": "AREA", "location": list(location),
                       "rotationEuler": [round(value, 9) for value in light.rotation_euler],
                       "energy": energy, "shape": "DISK", "size": 5.0, "color": [1.0, 1.0, 1.0],
                       "useShadow": True, "diffuseFactor": 1.0, "specularFactor": 1.0})
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 800, 1000, 100
    scene.render.image_settings.file_format='WEBP'
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.quality = 80
    scene.render.film_transparent = False
    scene.world.color = (0.035, 0.035, 0.035)
    poster_path = output_dir / "sbla005-poster.webp"
    scene.render.filepath = str(poster_path)
    bpy.ops.render.render(write_still=True)

    structure = decoded_glb_structure(glb_path)
    raw_evidence = raw_glb_evidence(glb_path, object_records)
    raw_by_name = {item["name"]: item["browserBoundsMetres"] for item in raw_evidence["objectsEvidence"]}
    if len(object_records) != 139 or len(raw_by_name) != 139 or set(object_by_name) != set(raw_by_name):
        raise RuntimeError("exported GLB object mapping is incomplete, duplicated, or contains an unexpected name")
    for name, record in object_by_name.items():
        record["normalized"]["coordinateSpace"] = raw_evidence["coordinateSpace"]
        record["normalized"]["boundsMetres"] = raw_by_name[name]
    comparison = {"cleanRuns": 2 if other else 1, "sceneStructureEqual": None, "decodedGeometryEqual": None, "boundsEqual": None,
                  "glbBytesEqual": None, "priorArtifactAuthenticated": False,
                  "note": "Second clean-run comparison is required before acceptance."}
    if other:
        previous = decoded_glb_structure(baseline_glb_snapshot)
        comparison.update({"cleanRuns": 2, "sceneStructureEqual": previous["objects"] == structure["objects"] and previous["meshObjects"] == structure["meshObjects"] and previous["names"] == structure["names"],
                           "decodedGeometryEqual": previous["decodedGeometry"] == structure["decodedGeometry"],
                           "boundsEqual": previous["sceneBoundsMetres"] == structure["sceneBoundsMetres"],
                           "glbBytesEqual": digest_bytes(baseline_snapshots["glb"]) == digest(glb_path), "priorArtifactAuthenticated": True,
                           "posterBytesEqual": digest_bytes(baseline_snapshots["poster"]) == digest(poster_path),
                           "priorGlbSha256": digest_bytes(baseline_snapshots["glb"]),
                           "note": "Prior GLB hash/bytes were authenticated against its manifest; both GLBs were independently decoded in Blender."})
        if not all(comparison[key] for key in ("sceneStructureEqual", "decodedGeometryEqual", "boundsEqual", "glbBytesEqual", "posterBytesEqual", "priorArtifactAuthenticated")):
            raise RuntimeError("deterministic conversion comparison failed")
    elapsed = round(time.perf_counter() - started, 3)
    manifest = {"schemaVersion": 1, "candidate": "path-c-bodyparts3d",
      "runIdentity": run_identity(publication_status),
      "authenticatedBaseline": authenticated_baseline,
      "tool": {"officialDistribution": {"format": "official macOS DMG", "sha256": "663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53"}, "runtime": {"version": list(bpy.app.version), "versionString": bpy.app.version_string}, "runtimeProvenance": runtime_provenance},
      "source": {"mappingManifest": {"path": "docs/licenses/bodyparts3d-mesh-mapping.json", "sha256": MAPPING_SHA256}, "archiveInputsStoredInGit": False},
      "normalization": {"sourceUnits": "millimetres", "outputUnits": "metres", "origin": "world-origin-preserved", "sourceToBlender": {"scale": 0.001, "axisTransform": [1,0,0,0,1,0,0,0,1], "space": "Blender [x, y, z]"}, "blenderToBrowserGltf": {"transform": "[x, z, -y]", "space": "glTF browser Y-up"}},
      "material": MATERIAL_CLAIM,
      "lod": {"method": "fixed-ratio-decimation", "ratio": LOD_RATIO, "export": "LOD15 only; later reduced mode must be separately benchmarked"},
      "objects": object_records,
      "rawGltfEvidence": raw_evidence,
      "determinism": {**comparison, "structure": structure},
      "artifacts": {"hostPerFileCeilingBytes": 26214400,
        "glb": {"path": "assets/derived/bodyparts3d/sbla005-representative.glb" if publication_status == "published-release" else str(finals["glb"]), "bytes": glb_path.stat().st_size, "sha256": digest(glb_path), "desktopTargetBytes": 6000000, "hardCeilingBytes": 10000000, "mobileInteractiveBytes": 3000000},
        "poster": {"path": "assets/derived/bodyparts3d/sbla005-poster.webp" if publication_status == "published-release" else str(finals["poster"]), "bytes": poster_path.stat().st_size, "sha256": digest(poster_path), "ceilingBytes": 200000}},
      "poster": {"camera": camera_record, "light": lights},
      "publication": {"status": publication_status,
        "semantics": "Transaction-style manifest-last promotion with rollback; not kernel-atomic across directories." if publication_status == "published-release" else "External first-run baseline only; unpublished and ineligible for consumer acceptance.",
        "commitMarker": "docs/licenses/bodyparts3d-conversion-manifest.json" if publication_status == "published-release" else None,
        "consumerAcceptance": "Consumers accept the GLB and poster only when their bytes match the SHA-256 identities in the committed manifest." if publication_status == "published-release" else "Consumers must not accept baseline-only artifacts."},
      "timing": {"conversionSeconds": elapsed, "objectCount": len(objects)},
      "visualInspection": {"programmatic": structure["meshHealth"], "normalWinding": structure["normalWinding"], "holes": "Boundary edges are recorded programmatically and are not automatically holes; no mesh-repair operation was applied.", "invertedNormals": "Decoded GLB directed-edge consistency found no same-direction shared edges and no zero-area faces.", "lostComponents": "All 139 checksum-mapped source meshes imported as one selectable object each. The fixed poster visibly lacks a head and complete distal limbs because this representative scene contains only mapped muscle meshes, not a full-body skin or skeleton layer.", "material": "One neutral opaque review material assigned to every exported object.", "occlusion": "Fixed whole-body poster necessarily has anatomical overlap; interactive selection is required for concealed meshes.", "proportions": "Uniform 0.001 mm-to-m scale only; no coordinate deformation applied."}}
    manifest_path.write_text(stable_json(manifest))
    publish_staged_artifacts(stage, staged, finals,
                             lambda paths: validate_staged_release(paths, publication_status))
    ACTIVE_STAGE = None


def transaction_probe():
    """Exercise the real publication transaction without requiring Blender."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--transaction-probe", action="store_true")
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--failure", choices=("none", "validation", "after-glb", "after-poster", "after-manifest"), required=True)
    options = parser.parse_args()
    stage, staged, finals = transaction_paths(options.output_dir, options.manifest)
    staged["glb"].write_bytes(b"new-glb")
    staged["poster"].write_bytes(b"new-poster")
    staged["manifest"].write_bytes(b"new-manifest")

    def validate(_paths):
        if options.failure == "validation":
            raise RuntimeError("forced staged validation failure")

    failure_after = options.failure.removeprefix("after-") if options.failure.startswith("after-") else None
    publish_staged_artifacts(stage, staged, finals, validate, failure_after=failure_after)


def publication_policy_probe():
    """Exercise the production publication gate without loading Blender."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--publication-policy-probe", action="store_true")
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--compare-manifest")
    parser.add_argument("--compare-manifest-sha256")
    parser.add_argument("--compare-glb")
    parser.add_argument("--compare-poster")
    parser.add_argument("--baseline-receipt")
    parser.add_argument("--baseline-receipt-commit")
    parser.add_argument("--baseline-only", action="store_true")
    options = parser.parse_args()
    status = publication_policy(options.baseline_only,
                                (options.compare_manifest, options.compare_manifest_sha256,
                                 options.compare_glb, options.compare_poster,
                                 options.baseline_receipt, options.baseline_receipt_commit),
                                options.output_dir, options.manifest)
    print(status)


def baseline_auth_probe():
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline-auth-probe", action="store_true")
    parser.add_argument("--compare-manifest", required=True)
    parser.add_argument("--compare-manifest-sha256", required=True)
    parser.add_argument("--compare-glb", required=True)
    parser.add_argument("--compare-poster", required=True)
    parser.add_argument("--current-output-dir", required=True)
    options = parser.parse_args()
    _, authenticated, _ = load_authenticated_baseline(
        options.compare_manifest, options.compare_manifest_sha256,
        options.compare_glb, options.compare_poster, options.current_output_dir)
    print(stable_json(authenticated), end="")


def receipt_probe():
    """Exercise the Git-backed pre-release commitment without loading Blender."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--receipt-probe", action="store_true")
    parser.add_argument("--baseline-receipt", required=True)
    parser.add_argument("--baseline-receipt-commit", required=True)
    parser.add_argument("--working-bytes-override")
    options = parser.parse_args()
    receipt, git_identity = load_committed_receipt(
        options.baseline_receipt, options.baseline_receipt_commit,
        options.working_bytes_override)
    print(stable_json({"receipt": receipt, "git": git_identity}), end="")


def raw_glb_probe():
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-glb-probe", action="store_true")
    parser.add_argument("--glb", required=True)
    parser.add_argument("--manifest", required=True)
    options = parser.parse_args()
    manifest = json.loads(Path(options.manifest).read_text())
    print(stable_json(raw_glb_evidence(Path(options.glb), manifest["objects"], manifest["material"])), end="")


if __name__ == "__main__":
    try:
        if TRANSACTION_PROBE:
            transaction_probe()
        elif POLICY_PROBE:
            publication_policy_probe()
        elif BASELINE_AUTH_PROBE:
            baseline_auth_probe()
        elif RAW_GLB_PROBE:
            raw_glb_probe()
        elif RECEIPT_PROBE:
            receipt_probe()
        else:
            main()
    except Exception as error:
        print("SBLA005 conversion failed: " + str(error), file=sys.stderr)
        sys.exit(1)
    finally:
        if ACTIVE_STAGE is not None:
            shutil.rmtree(ACTIVE_STAGE, ignore_errors=True)
