#!/usr/bin/env python3
"""Build the local pectoralis review GLB from pinned BodyParts3D geometry.

Usage: python3 scripts/assets/build-body-model.py --source /path/to/Human-Atlas
The source is the exact Human Atlas revision listed below, not a floating URL.
"""

import argparse
import hashlib
import json
import struct
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_COMMIT = "5bb5713aab18d7fe9380c3339eb09f173491ea06"
SOURCE_URL = "https://github.com/slorksmo/Human-Atlas"
SOURCE_HASHES = {
    "atlas.json": "d6979fc62cf18fa4f08a9e6efae8fdac9ec383c5a1f3c757920125ac758429fe",
    "body-1.bin": "aa077a4675f0d0dd3c9b0af39dc8cf6bcb348c3bf7d283478d4206ce30a5a0de",
    "body-3.bin": "6febb76b50423331f66802a63bb43f04f99ce08129837015910eed43d0719268",
    "body-10.bin": "4a959d998acd35cf88518a0f2f8ab99b42d9f69c7ce0d6a814df315eeac807ac",
}
PART_IDS = ("FJ2810", "FJ1446", "FJ1446M", "FJ1447", "FJ1447M", "FJ1464", "FJ1464M")
MODEL_PATH = Path("assets/derived/bodyparts3d/sbla013-pectoralis.glb")
MANIFEST_PATH = Path("docs/licenses/bodyparts3d-first-slice-manifest.json")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def build(source):
    revision = subprocess.check_output(
        ["git", "-C", str(source), "rev-parse", "HEAD"], text=True
    ).strip()
    if revision != SOURCE_COMMIT:
        raise ValueError(f"Unexpected source revision: {revision}")

    source_dir = source / "public" / "models"
    blobs = {name: (source_dir / name).read_bytes() for name in SOURCE_HASHES}
    for name, expected in SOURCE_HASHES.items():
        if sha256(blobs[name]) != expected:
            raise ValueError(f"Source checksum mismatch: {name}")

    source_parts = {part["id"]: part for part in json.loads(blobs["atlas.json"])["parts"]}
    if any(part_id not in source_parts for part_id in PART_IDS):
        raise ValueError("One or more selected meshes are absent from the source")

    mapping = json.loads((ROOT / "docs/licenses/bodyparts3d-mesh-mapping.json").read_text())
    approved = next(target for target in mapping["coverage"]["targets"] if target["id"] == "pectoralis-major")
    mapped = {
        mesh["fileId"]
        for component in approved["components"]
        for mesh in component["meshes"]
    }
    if mapped != set(PART_IDS[1:]):
        raise ValueError(f"Pectoralis selection differs from approved mapping: {mapped}")

    payload = bytearray()
    views, accessors, meshes, nodes = [], [], [], []

    def append_blob(data, target):
        offset = len(payload)
        payload.extend(data)
        while len(payload) % 4:
            payload.append(0)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": target})
        return len(views) - 1

    for part_id in PART_IDS:
        part = source_parts[part_id]
        chunk = blobs[f"body-{part['chunk']}.bin"]
        positions = chunk[part["positions"]:part["positions"] + part["vertexCount"] * 12]
        normals = chunk[part["normals"]:part["normals"] + part["vertexCount"] * 6]
        indices = chunk[part["indices"]:part["indices"] + part["indexCount"] * 4]
        if len(positions) != part["vertexCount"] * 12 or len(normals) != part["vertexCount"] * 6 or len(indices) != part["indexCount"] * 4:
            raise ValueError(f"Truncated mesh: {part_id}")
        position_view = append_blob(positions, 34962)
        normal_view = append_blob(normals, 34962)
        index_view = append_blob(indices, 34963)
        accessors.extend([
            {"bufferView": position_view, "componentType": 5126, "count": part["vertexCount"], "type": "VEC3", "min": part["bounds"][0], "max": part["bounds"][1]},
            {"bufferView": normal_view, "componentType": 5122, "count": part["vertexCount"], "type": "VEC3", "normalized": True},
            {"bufferView": index_view, "componentType": 5125, "count": part["indexCount"], "type": "SCALAR"},
        ])
        index = len(meshes)
        meshes.append({"name": part["name"], "primitives": [{"attributes": {"POSITION": len(accessors) - 3, "NORMAL": len(accessors) - 2}, "indices": len(accessors) - 1, "material": 0 if part_id == "FJ2810" else 1}]})
        nodes.append({"name": part["name"], "mesh": index, "extras": {"sourceId": part_id, "conceptId": part["conceptId"]}})

    gltf = {
        "asset": {"version": "2.0", "generator": "SBLA BodyParts3D first-slice study"},
        "scene": 0, "scenes": [{"nodes": list(range(len(nodes)))}],
        "nodes": nodes, "meshes": meshes, "accessors": accessors,
        "bufferViews": views, "buffers": [{"byteLength": len(payload)}],
        "materials": [
            {"name": "Anatomical silhouette", "pbrMetallicRoughness": {"baseColorFactor": [0.7, 0.76, 0.82, 0.3], "metallicFactor": 0, "roughnessFactor": 0.68}, "doubleSided": True, "alphaMode": "BLEND"},
            {"name": "Pectoralis major", "pbrMetallicRoughness": {"baseColorFactor": [0.82, 0.12, 0.20, 1], "metallicFactor": 0, "roughnessFactor": 0.6}, "doubleSided": True},
        ],
    }
    json_chunk = bytearray(json.dumps(gltf, separators=(",", ":")).encode())
    while len(json_chunk) % 4:
        json_chunk.append(32)
    model = (struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(json_chunk) + 8 + len(payload))
             + struct.pack("<I4s", len(json_chunk), b"JSON") + json_chunk
             + struct.pack("<I4s", len(payload), b"BIN\0") + payload)
    if len(model) >= 3_000_000:
        raise ValueError("Model exceeds first-slice mobile ceiling")

    manifest = {
        "status": "local-owner-review-prototype; not production acceptance",
        "source": {
            "dataset": "BodyParts3D 4.0",
            "adaptation": {"repository": SOURCE_URL, "commit": SOURCE_COMMIT, "files": SOURCE_HASHES},
            "attribution": "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
            "licenseUrl": "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html",
            "historicNotice": "Source OBJ comments retain a CC BY-SA 2.1 Japan notice; preserve this notice pending legal review.",
        },
        "selectedPartIds": PART_IDS,
        "model": {"path": str(MODEL_PATH), "bytes": len(model), "sha256": sha256(model)},
        "coverageLimits": "Complete adult male body-surface silhouette with only six pectoralis major parts highlighted; no other selectable muscles or exercise motion.",
    }
    (ROOT / MODEL_PATH).write_bytes(model)
    (ROOT / MANIFEST_PATH).write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"{MODEL_PATH}: {len(model)} bytes, SHA-256 {sha256(model)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Pinned Human Atlas checkout")
    build(parser.parse_args().source.resolve())
