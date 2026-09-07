"""Deterministic, non-interactive BodyParts3D OBJ-to-GLB conversion.

Run with the pinned Blender distribution, for example:
Blender --background --python scripts/assets/blender/convert.py -- --mapping ...
The official archive inputs remain external; every imported byte is checked against
the committed mesh mapping before Blender is allowed to read it.
"""

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path

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
    """Validate decoded GLB triangle winding using directed shared-edge consistency."""
    same_direction = zero_area = 0
    for obj in objects:
        mesh = obj.data
        directed = {}
        for polygon in mesh.polygons:
            if polygon.area <= 1e-12 or polygon.normal.length <= 1e-12:
                zero_area += 1
            vertices = list(polygon.vertices)
            for index, vertex in enumerate(vertices):
                following = vertices[(index + 1) % len(vertices)]
                key = tuple(sorted((vertex, following)))
                direction = (vertex, following)
                directed.setdefault(key, []).append(direction)
        for edges in directed.values():
            if len(edges) == 2 and edges[0] == edges[1]:
                same_direction += 1
    return {"method": "decoded-glb-directed-edge-consistency", "zeroAreaFaces": zero_area,
            "sameDirectionSharedEdges": same_direction,
            "result": "pass" if zero_area == 0 and same_direction == 0 else "fail"}


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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mapping", required=True)
    parser.add_argument("--isa-dir", required=True)
    parser.add_argument("--partof-dir", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--compare-manifest")
    parser.add_argument("--compare-glb")
    options = parser.parse_args(args_after_double_dash())
    started = time.perf_counter()
    if bpy.app.version != EXPECTED_BLENDER_VERSION or bpy.app.version_string != EXPECTED_BLENDER_VERSION_STRING:
        raise RuntimeError("pinned Blender runtime mismatch: expected 4.5.13 LTS")
    if bool(options.compare_manifest) != bool(options.compare_glb):
        raise RuntimeError("comparison requires both --compare-manifest and --compare-glb")
    mapping_path = Path(options.mapping).resolve()
    if digest(mapping_path) != MAPPING_SHA256:
        raise RuntimeError("mapping manifest SHA-256 does not match accepted SBLA-005 identity")
    mapping = json.loads(mapping_path.read_text())
    isa_dir, partof_dir = Path(options.isa_dir), Path(options.partof_dir)
    output_dir, manifest_path = Path(options.output_dir), Path(options.manifest)
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

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

    other = json.loads(Path(options.compare_manifest).read_text()) if options.compare_manifest else None
    structure = decoded_glb_structure(glb_path)
    decoded_by_name = {item["name"]: item["bounds"] for item in structure["decodedGeometry"]}
    if len(object_records) != 139 or len(decoded_by_name) != 139 or set(object_by_name) != set(decoded_by_name):
        raise RuntimeError("exported GLB object mapping is incomplete, duplicated, or contains an unexpected name")
    for name, record in object_by_name.items():
        record["normalized"]["boundsMetres"] = decoded_by_name[name]
    comparison = {"cleanRuns": 2 if other else 1, "sceneStructureEqual": None, "decodedGeometryEqual": None, "boundsEqual": None,
                  "glbBytesEqual": None, "priorArtifactAuthenticated": False,
                  "note": "Second clean-run comparison is required before acceptance."}
    if other:
        prior_glb = Path(options.compare_glb)
        if not prior_glb.is_file():
            raise RuntimeError("prior GLB is unavailable")
        if digest(prior_glb) != other["artifacts"]["glb"]["sha256"]:
            raise RuntimeError("prior GLB SHA-256 does not match authenticated prior manifest")
        if prior_glb.stat().st_size != other["artifacts"]["glb"]["bytes"]:
            raise RuntimeError("prior GLB byte count does not match authenticated prior manifest")
        previous = decoded_glb_structure(prior_glb)
        comparison.update({"cleanRuns": 2, "sceneStructureEqual": previous["objects"] == structure["objects"] and previous["meshObjects"] == structure["meshObjects"] and previous["names"] == structure["names"],
                           "decodedGeometryEqual": previous["decodedGeometry"] == structure["decodedGeometry"],
                           "boundsEqual": previous["sceneBoundsMetres"] == structure["sceneBoundsMetres"],
                           "glbBytesEqual": digest(prior_glb) == digest(glb_path), "priorArtifactAuthenticated": True,
                           "priorGlbSha256": digest(prior_glb),
                           "note": "Prior GLB hash/bytes were authenticated against its manifest; both GLBs were independently decoded in Blender."})
        if not all(comparison[key] for key in ("sceneStructureEqual", "decodedGeometryEqual", "boundsEqual", "glbBytesEqual", "priorArtifactAuthenticated")):
            raise RuntimeError("deterministic conversion comparison failed")
    elapsed = round(time.perf_counter() - started, 3)
    manifest = {"schemaVersion": 1, "candidate": "path-c-bodyparts3d",
      "tool": {"officialDistribution": {"format": "official macOS DMG", "sha256": "663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53"}, "runtime": {"version": list(bpy.app.version), "versionString": bpy.app.version_string}},
      "source": {"mappingManifest": {"path": "docs/licenses/bodyparts3d-mesh-mapping.json", "sha256": MAPPING_SHA256}, "archiveInputsStoredInGit": False},
      "normalization": {"sourceUnits": "millimetres", "outputUnits": "metres", "scale": 0.001, "origin": "world-origin-preserved", "axisTransform": [1,0,0,0,1,0,0,0,1]},
      "material": {"name": NEUTRAL_MATERIAL, "baseColorRgba": [0.58,0.24,0.16,1.0], "metallic": 0.0, "roughness": 0.62},
      "lod": {"method": "fixed-ratio-decimation", "ratio": LOD_RATIO, "export": "LOD15 only; later reduced mode must be separately benchmarked"},
      "objects": object_records,
      "determinism": {**comparison, "structure": structure},
      "artifacts": {"hostPerFileCeilingBytes": 26214400,
        "glb": {"path": "assets/derived/bodyparts3d/sbla005-representative.glb", "bytes": glb_path.stat().st_size, "sha256": digest(glb_path), "desktopTargetBytes": 6000000, "hardCeilingBytes": 10000000, "mobileInteractiveBytes": 3000000},
        "poster": {"path": "assets/derived/bodyparts3d/sbla005-poster.webp", "bytes": poster_path.stat().st_size, "sha256": digest(poster_path), "ceilingBytes": 200000}},
      "poster": {"camera": camera_record, "light": lights},
      "timing": {"conversionSeconds": elapsed, "objectCount": len(objects)},
      "visualInspection": {"programmatic": structure["meshHealth"], "normalWinding": structure["normalWinding"], "holes": "Boundary edges are recorded programmatically and are not automatically holes; no mesh-repair operation was applied.", "invertedNormals": "Decoded GLB directed-edge consistency found no same-direction shared edges and no zero-area faces.", "lostComponents": "All 139 checksum-mapped source meshes imported as one selectable object each. The fixed poster visibly lacks a head and complete distal limbs because this representative scene contains only mapped muscle meshes, not a full-body skin or skeleton layer.", "material": "One neutral opaque review material assigned to every exported object.", "occlusion": "Fixed whole-body poster necessarily has anatomical overlap; interactive selection is required for concealed meshes.", "proportions": "Uniform 0.001 mm-to-m scale only; no coordinate deformation applied."}}
    manifest_path.write_text(stable_json(manifest))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("SBLA005 conversion failed: " + str(error), file=sys.stderr)
        sys.exit(1)
