#!/usr/bin/env python3
"""Render the front and back anatomy posters with a software rasteriser.

Why this exists: scripts/assets/capture-posters.mjs captures the posters from a
live browser, which is not available everywhere. This script renders the same
shipped model (assets/derived/bodyparts3d/anatomy-explorer.glb) with the same
camera and 862 x 672 frame, so every hotspot and plate point, which are stored
as percentages of that frame, still lands on the same anatomy. What changes is
the presentation: per-muscle tone, three-light rig, ambient occlusion, seam
lines between muscles, and a rim-weighted skin shell.

No mesh is edited and no asset is added. See
docs/product/gates/ANATOMY-POSTER-VISUALS-001-owner-direction.md.

Usage (from the repository root):
    python3 scripts/assets/render-posters.py                 # write both posters
    python3 scripts/assets/render-posters.py --view front    # one view
    python3 scripts/assets/render-posters.py --scale 1       # quick preview
    python3 scripts/assets/render-posters.py --check         # verify, no writing

Requires numpy and Pillow.
"""

from __future__ import annotations

import argparse
import json
import struct
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
GLB = ROOT / "assets/derived/bodyparts3d/anatomy-explorer.glb"
OUTPUTS = {
    "front": ROOT / "assets/derived/bodyparts3d/anatomy-explorer-poster.png",
    "back": ROOT / "assets/derived/bodyparts3d/anatomy-explorer-poster-back.png",
}

# Must match src/lib/body-parts/poster.ts: hotspots are percentages of this frame.
FRAME = (862, 672)
DEFAULT_SCALE = 4  # poster pixels per frame pixel

# Must match the explorer camera in AnatomyExplorer.astro.
FOV_DEG = 32.0
CAMERA_HEIGHT = 0.88
CAMERA_DISTANCE = 3.45
TARGET = np.array([0.0, 0.86, 0.0])

SKIN_SOURCE_ID = "FJ2810"
SELECTED_ENTITY = "pectoralis-major"  # the explorer's default selection


# --------------------------------------------------------------------------- #
# Model
# --------------------------------------------------------------------------- #


class Model:
    """Concatenated triangle soup plus per-mesh metadata."""

    def __init__(self, path: Path):
        data = path.read_bytes()
        magic, version, _ = struct.unpack_from("<4sII", data, 0)
        if magic != b"glTF" or version != 2:
            raise ValueError(f"{path} is not a glTF 2.0 binary")
        json_len, _ = struct.unpack_from("<II", data, 12)
        gltf = json.loads(data[20 : 20 + json_len])
        offset = 20 + json_len
        bin_len, _ = struct.unpack_from("<II", data, offset)
        blob = memoryview(data)[offset + 8 : offset + 8 + bin_len]
        if any(
            k in node
            for node in gltf["nodes"]
            for k in ("translation", "rotation", "scale", "matrix", "children")
        ):
            raise ValueError("Node transforms are not supported by this renderer")

        def accessor(index: int) -> np.ndarray:
            a = gltf["accessors"][index]
            view = gltf["bufferViews"][a["bufferView"]]
            if "byteStride" in view:
                raise ValueError("Interleaved buffers are not supported")
            dtype = {5126: np.float32, 5123: np.uint16, 5125: np.uint32}[
                a["componentType"]
            ]
            width = {"SCALAR": 1, "VEC3": 3}[a["type"]]
            start = view.get("byteOffset", 0) + a.get("byteOffset", 0)
            arr = np.frombuffer(
                blob, dtype=dtype, count=a["count"] * width, offset=start
            )
            return arr.reshape(-1, width) if width > 1 else arr

        positions, normals, triangles, tri_mesh = [], [], [], []
        self.meshes: list[dict] = []
        base = 0
        for node in gltf["nodes"]:
            mesh = gltf["meshes"][node["mesh"]]
            prim = mesh["primitives"][0]
            pos = accessor(prim["attributes"]["POSITION"]).astype(np.float64)
            nrm = accessor(prim["attributes"]["NORMAL"]).astype(np.float64)
            idx = accessor(prim["indices"]).astype(np.int64).reshape(-1, 3)
            extras = node.get("extras", {})
            mesh_id = len(self.meshes)
            self.meshes.append(
                {
                    "name": node.get("name", ""),
                    "source_id": extras.get("sourceId", ""),
                    "entities": extras.get("entityIds", []),
                }
            )
            positions.append(pos)
            normals.append(nrm)
            triangles.append(idx + base)
            tri_mesh.append(np.full(len(idx), mesh_id, dtype=np.int32))
            base += len(pos)
        self.pos = np.concatenate(positions)
        self.nrm = np.concatenate(normals)
        self.tris = np.concatenate(triangles)
        self.tri_mesh = np.concatenate(tri_mesh)
        self.skin_mesh = next(
            i for i, m in enumerate(self.meshes) if m["source_id"] == SKIN_SOURCE_ID
        )

    def smooth_normals(self, iterations: int, crease: float) -> None:
        """Smooth the shading normals over the mesh graph, keeping sharp creases.

        The shipped model was simplified to 30% of its triangles, which leaves
        small dents that strong lighting turns into a crumpled look. Only the
        normals used for shading are changed; no vertex position is touched.
        """
        if iterations <= 0:
            return
        a, b, c = self.tris[:, 0], self.tris[:, 1], self.tris[:, 2]
        src = np.concatenate([a, b, c, b, c, a])
        dst = np.concatenate([b, c, a, a, b, c])
        normal = self.nrm.copy()
        for _ in range(iterations):
            similarity = np.einsum("nc,nc->n", normal[src], normal[dst])
            weight = np.clip((similarity - crease) / (1.0 - crease), 0.0, 1.0)
            total = normal.copy()
            np.add.at(total, src, normal[dst] * weight[:, None])
            length = np.linalg.norm(total, axis=1, keepdims=True)
            normal = total / np.maximum(length, 1e-12)
        self.nrm = normal


# --------------------------------------------------------------------------- #
# Camera
# --------------------------------------------------------------------------- #


class Camera:
    def __init__(self, view: str, width: int, height: int):
        sign = 1.0 if view == "front" else -1.0
        self.eye = np.array([0.0, CAMERA_HEIGHT, sign * CAMERA_DISTANCE])
        forward = TARGET - self.eye
        self.forward = forward / np.linalg.norm(forward)
        right = np.cross(self.forward, [0.0, 1.0, 0.0])
        self.right = right / np.linalg.norm(right)
        self.up = np.cross(self.right, self.forward)
        self.f = 1.0 / np.tan(np.radians(FOV_DEG) / 2.0)
        self.aspect = FRAME[0] / FRAME[1]
        self.width, self.height = width, height

    def project(self, p: np.ndarray):
        """Return screen x, y (pixels, y down) and view depth for world points."""
        rel = p - self.eye
        xc, yc, zc = rel @ self.right, rel @ self.up, rel @ self.forward
        ndc_x = self.f / self.aspect * xc / zc
        ndc_y = self.f * yc / zc
        sx = (ndc_x + 1.0) * 0.5 * self.width
        sy = (1.0 - ndc_y) * 0.5 * self.height
        return sx, sy, zc


# --------------------------------------------------------------------------- #
# Rasteriser
# --------------------------------------------------------------------------- #


class Buffers:
    def __init__(self, width: int, height: int):
        self.w, self.h = width, height
        self.inv_depth = np.zeros(width * height, dtype=np.float32)  # 0 = empty
        self.tri = np.full(width * height, -1, dtype=np.int32)


def _fragments(ax, ay, bx, by, cx, cy, det, xmin, ymin, xmax, ymax, K):
    """Candidate pixel samples for a batch of triangles whose bbox fits K x K."""
    ar = np.arange(K, dtype=np.float64)
    gx = xmin[:, None, None] + ar[None, None, :]
    gy = ymin[:, None, None] + ar[None, :, None]
    px, py = gx + 0.5, gy + 0.5
    ax_, ay_ = ax[:, None, None], ay[:, None, None]
    bx_, by_ = bx[:, None, None], by[:, None, None]
    cx_, cy_ = cx[:, None, None], cy[:, None, None]
    d = det[:, None, None]
    w0 = ((bx_ - px) * (cy_ - py) - (cx_ - px) * (by_ - py)) / d
    w1 = ((cx_ - px) * (ay_ - py) - (ax_ - px) * (cy_ - py)) / d
    w2 = 1.0 - w0 - w1
    inside = (
        (w0 >= 0)
        & (w1 >= 0)
        & (w2 >= 0)
        & (gx <= xmax[:, None, None])
        & (gy <= ymax[:, None, None])
    )
    return gx, gy, w0, w1, w2, inside


def rasterise(buf: Buffers, sx, sy, inv_z, tris: np.ndarray, tri_ids: np.ndarray):
    """Z-buffer the given triangles. Both faces are drawn, like the explorer."""
    W, H = buf.w, buf.h
    a, b, c = tris[:, 0], tris[:, 1], tris[:, 2]
    ax, ay, bx, by, cx, cy = sx[a], sy[a], sx[b], sy[b], sx[c], sy[c]
    det = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay)
    xmin = np.ceil(np.minimum(np.minimum(ax, bx), cx) - 0.5).astype(np.int64)
    xmax = np.floor(np.maximum(np.maximum(ax, bx), cx) - 0.5).astype(np.int64)
    ymin = np.ceil(np.minimum(np.minimum(ay, by), cy) - 0.5).astype(np.int64)
    ymax = np.floor(np.maximum(np.maximum(ay, by), cy) - 0.5).astype(np.int64)
    xmin, ymin = np.maximum(xmin, 0), np.maximum(ymin, 0)
    xmax, ymax = np.minimum(xmax, W - 1), np.minimum(ymax, H - 1)
    keep = (np.abs(det) > 1e-9) & (xmax >= xmin) & (ymax >= ymin)
    size = np.maximum(xmax - xmin, ymax - ymin) + 1
    iza, izb, izc = inv_z[a], inv_z[b], inv_z[c]

    def commit(sel, K, chunk):
        for start in range(0, len(sel), chunk):
            s = sel[start : start + chunk]
            gx, gy, w0, w1, w2, inside = _fragments(
                ax[s],
                ay[s],
                bx[s],
                by[s],
                cx[s],
                cy[s],
                det[s],
                xmin[s],
                ymin[s],
                xmax[s],
                ymax[s],
                K,
            )
            n = int(inside.sum())
            if not n:
                continue
            iw = (
                w0 * iza[s][:, None, None]
                + w1 * izb[s][:, None, None]
                + w2 * izc[s][:, None, None]
            )[inside]
            pix = gy.astype(np.int64) * W + gx.astype(np.int64)
            pix = np.broadcast_to(pix, inside.shape)[inside]
            ids = np.broadcast_to(tri_ids[s][:, None, None], inside.shape)[inside]
            iw32 = iw.astype(np.float32)
            np.maximum.at(buf.inv_depth, pix, iw32)
            win = iw32 >= buf.inv_depth[pix]
            buf.tri[pix[win]] = ids[win]

    idx = np.nonzero(keep)[0]
    k = 1
    while k <= 64:
        sel = idx[(size[idx] <= k) & (size[idx] > k // 2)]
        if len(sel):
            commit(sel, k, max(1, 1_500_000 // (k * k)))
        k *= 2
    for t in idx[size[idx] > 64]:  # a few large triangles (skin, head)
        commit(np.array([t]), int(size[t]), 1)


# --------------------------------------------------------------------------- #
# Shading
# --------------------------------------------------------------------------- #


def srgb_to_linear(c):
    c = np.asarray(c, dtype=np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def hex_linear(h: str):
    h = h.lstrip("#")
    return srgb_to_linear([int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4)])


def aces(x):
    """Narkowicz ACES filmic fit, the same family as three.js ACESFilmic."""
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    return np.clip((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0)


def stable_unit(key: str, salt: str) -> float:
    """Deterministic value in [0, 1) from a string, independent of Python's hash seed."""
    h = 2166136261
    for ch in f"{salt}:{key}":
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return (h % 100_003) / 100_003.0


# Warm tissue palette; groups are spread across it so neighbours differ.
MUSCLE_TONES = [
    "#b88a7d",
    "#a97869",
    "#c79a88",
    "#9a6d60",
    "#b58472",
    "#cca491",
]
SELECTED_COLOR = "#ff8272"
SKIN_COLOR = "#a9b7c5"

# Everything that shapes the look, in one place. Luminance carries the image:
# the site shows these posters through a greyscale + contrast filter, screen
# blended over a dark gradient.
LOOK = {
    "exposure": 0.80,  # scene-linear gain before tone mapping
    "key": 1.75,  # warm key light, upper left of the camera
    "fill": 0.28,  # cool fill, right
    "hemi": 0.20,  # sky / ground ambient
    "rim": 0.85,  # cool rim from behind, boosted at grazing angles
    "spec": 0.34,  # sheen on wet tissue
    "ao": 1.40,  # ambient-occlusion strength
    "seam": 0.45,  # darkening where one muscle meets another
    "skin_alone_alpha": 0.62,  # skin where no muscle is behind it (head, hands, feet)
    "skin_veil_base": 0.03,  # skin veil over muscle, face-on
    "skin_veil_edge": 0.95,  # extra veil toward the silhouette
    "skin_gain": 0.80,  # brightness of the skin shell
    "selected_glow": 1.00,  # emissive lift on the selected muscle
    "albedo_min": 0.22,  # luminance band for muscle albedo (linear)
    "albedo_max": 0.34,
    "skin_edge_power": 2.2,  # how tightly the skin glow hugs the silhouette
    "normal_smoothing": 3,  # iterations of crease-preserving normal smoothing
    "normal_crease": 0.55,  # neighbours more than ~57 degrees apart are not blended
}


def mesh_albedo(model: Model, mesh_id: int) -> np.ndarray:
    """Linear albedo for one muscle mesh: group palette plus per-mesh jitter."""
    meta = model.meshes[mesh_id]
    if SELECTED_ENTITY in meta["entities"]:
        return hex_linear(SELECTED_COLOR)
    group = meta["entities"][0] if meta["entities"] else meta["source_id"]
    base = hex_linear(
        MUSCLE_TONES[int(stable_unit(group, "group") * len(MUSCLE_TONES))]
    )
    jitter = 0.80 + 0.40 * stable_unit(meta["source_id"], "mesh")
    albedo = base * jitter
    # Keep every muscle inside one luminance band so no group blows out.
    y = 0.2126 * albedo[0] + 0.7152 * albedo[1] + 0.0722 * albedo[2]
    return albedo * (np.clip(y, LOOK["albedo_min"], LOOK["albedo_max"]) / y)


def render_view(model: Model, view: str, scale: int, ss: int, log=print):
    full_w, full_h = FRAME[0] * scale, FRAME[1] * scale
    rw, rh = full_w * ss, full_h * ss
    cam = Camera(view, rw, rh)

    sx, sy, zc = cam.project(model.pos)
    inv_z = 1.0 / zc

    # Render only the figure's bounding box, padded, aligned to the supersample.
    pad = 8 * ss
    x0 = max(0, int(np.floor(sx.min())) - pad) // ss * ss
    x1 = min(rw, int(np.ceil(sx.max())) + pad + ss) // ss * ss
    y0 = max(0, int(np.floor(sy.min())) - pad) // ss * ss
    y1 = min(rh, int(np.ceil(sy.max())) + pad + ss) // ss * ss
    w, h = x1 - x0, y1 - y0
    sxr, syr = sx - x0, sy - y0
    log(f"  {view}: region {w}x{h} (supersample {ss})")

    is_skin = model.tri_mesh == model.skin_mesh
    muscle_ids = np.nonzero(~is_skin)[0]
    skin_ids = np.nonzero(is_skin)[0]

    t = time.time()
    muscle = Buffers(w, h)
    rasterise(muscle, sxr, syr, inv_z, model.tris[muscle_ids], muscle_ids)
    skin = Buffers(w, h)
    rasterise(skin, sxr, syr, inv_z, model.tris[skin_ids], skin_ids)
    log(f"  {view}: rasterised in {time.time() - t:.1f}s")

    return shade(model, cam, muscle, skin, (x0, y0, w, h), ss, full_w, full_h, log)


def gbuffer(model: Model, cam: Camera, buf: Buffers, origin, pix: np.ndarray):
    """Perspective-correct position, normal, depth and mesh id for covered pixels."""
    x0, y0, _, _ = origin
    tri = buf.tri[pix]
    verts = model.tris[tri]
    py = (pix // buf.w) + y0 + 0.5
    px = (pix % buf.w) + x0 + 0.5
    sx, sy, zc = cam.project(model.pos[verts.reshape(-1)])
    sx, sy, zc = sx.reshape(-1, 3), sy.reshape(-1, 3), zc.reshape(-1, 3)
    ax, bx, cx = sx[:, 0], sx[:, 1], sx[:, 2]
    ay, by, cy = sy[:, 0], sy[:, 1], sy[:, 2]
    det = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay)
    w0 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) / det
    w1 = ((cx - px) * (ay - py) - (ax - px) * (cy - py)) / det
    w2 = 1.0 - w0 - w1
    iw = np.stack([w0, w1, w2], axis=1) / zc
    persp = iw / iw.sum(axis=1, keepdims=True)
    position = np.einsum("nk,nkc->nc", persp, model.pos[verts])
    normal = np.einsum("nk,nkc->nc", persp, model.nrm[verts])
    normal /= np.maximum(np.linalg.norm(normal, axis=1, keepdims=True), 1e-12)
    depth = 1.0 / iw.sum(axis=1)
    return position, normal, depth, model.tri_mesh[tri]


def ambient_occlusion(depth: np.ndarray, covered: np.ndarray, ss: int) -> np.ndarray:
    """Cheap screen-space occlusion: neighbours nearer to the camera darken a pixel."""
    d = np.where(covered, depth, np.float32(np.nan)).astype(np.float32)
    far = np.float32(np.nanmax(d) + 1.0)
    d = np.where(covered, d, far)
    occ = np.zeros_like(d)
    count = 0
    # (radius in final-resolution pixels, samples around the ring)
    for radius, samples in ((1.5, 8), (4.0, 8), (9.0, 8), (20.0, 8)):
        r = max(1, round(radius * ss))
        for k in range(samples):
            angle = 2.0 * np.pi * (k + 0.5 * (radius > 4.0)) / samples
            dx, dy = round(np.cos(angle) * r), round(np.sin(angle) * r)
            neighbour = np.roll(np.roll(d, dy, axis=0), dx, axis=1)
            # How much nearer the neighbour is, in metres, saturating at 4 cm.
            nearer = np.clip((d - neighbour - 0.002) / 0.04, 0.0, 1.0)
            occ += nearer * (1.0 / (1.0 + 0.04 * r / ss))
            count += 1
    return np.clip(1.0 - LOOK["ao"] * occ / count, 0.0, 1.0)


def shade(model, cam, muscle, skin, origin, ss, full_w, full_h, log):
    x0, y0, w, h = origin
    n = w * h
    m_cov = muscle.tri >= 0
    s_cov = skin.tri >= 0
    pix_m = np.nonzero(m_cov)[0]
    pix_s = np.nonzero(s_cov)[0]
    log(f"  covered: muscle {len(pix_m):,}px, skin {len(pix_s):,}px")

    depth = np.full(n, np.float32(np.inf))
    mesh = np.full(n, -1, dtype=np.int32)
    normal = np.zeros((n, 3), dtype=np.float32)
    pos_m, nrm_m, dep_m, mesh_m = gbuffer(model, cam, muscle, origin, pix_m)
    depth[pix_m], mesh[pix_m], normal[pix_m] = dep_m, mesh_m, nrm_m

    skin_depth = np.full(n, np.float32(np.inf))
    skin_normal = np.zeros((n, 3), dtype=np.float32)
    pos_s, nrm_s, dep_s, _ = gbuffer(model, cam, skin, origin, pix_s)
    skin_depth[pix_s], skin_normal[pix_s] = dep_s, nrm_s

    # Where only skin is visible (head, hands, feet) it is the surface we shade.
    surface_depth = np.where(
        m_cov, depth, np.where(s_cov, skin_depth, np.float32(np.inf))
    )
    covered = (m_cov | s_cov).reshape(h, w)
    ao = ambient_occlusion(surface_depth.reshape(h, w), covered, ss).reshape(-1)

    # Seams: darken where the visible mesh changes between neighbouring pixels.
    mesh_grid = np.where(m_cov, mesh, -2).reshape(h, w)
    seam = np.zeros((h, w), dtype=np.float32)
    for axis in (0, 1):
        for shift in (1, -1):
            other = np.roll(mesh_grid, shift, axis=axis)
            seam += ((other != mesh_grid) & (mesh_grid >= 0) & (other != -2)).astype(
                np.float32
            )
    seam = np.clip(seam, 0.0, 1.0).reshape(-1)

    eye = cam.eye

    # Lights follow the camera so both views are lit alike: key upper left,
    # cool fill from the right, rim from behind.
    def world_dir(right, up, forward):
        v = right * cam.right + up * cam.up + forward * (-cam.forward)
        return v / np.linalg.norm(v)

    key = world_dir(-0.80, 0.55, 0.50)
    fill = world_dir(0.65, 0.10, 0.75)
    rim = world_dir(0.70, 0.35, -0.80)

    def light(position, nrm, albedo, roughness_gloss, ao_term, seam_term):
        view = eye - position
        view /= np.linalg.norm(view, axis=1, keepdims=True)
        flip = (np.einsum("nc,nc->n", nrm, view) < 0)[:, None]
        nrm = np.where(flip, -nrm, nrm)
        ndv = np.clip(np.einsum("nc,nc->n", nrm, view), 0.0, 1.0)

        def lambert(direction, wrap):
            return np.clip(
                (np.einsum("nc,c->n", nrm, direction) + wrap) / (1 + wrap), 0.0, 1.0
            )

        key_c, fill_c, rim_c = (
            hex_linear("#fff1e4"),
            hex_linear("#b9d3ff"),
            hex_linear("#cfe2ff"),
        )
        sky, ground = hex_linear("#e6eef8"), hex_linear("#4d4350")
        up = np.einsum("nc,c->n", nrm, cam.up)
        hemi = (
            ground[None, :] * (1 - (up * 0.5 + 0.5))[:, None]
            + sky[None, :] * (up * 0.5 + 0.5)[:, None]
        )
        diffuse = (
            LOOK["key"] * lambert(key, 0.25)[:, None] * key_c[None, :]
            + LOOK["fill"] * lambert(fill, 0.1)[:, None] * fill_c[None, :]
            + LOOK["hemi"] * hemi * ao_term[:, None]
        )
        diffuse *= ao_term[:, None] ** 0.8
        half = key + view
        half /= np.linalg.norm(half, axis=1, keepdims=True)
        spec_pow = 26.0 * roughness_gloss
        spec = (np.clip(np.einsum("nc,nc->n", nrm, half), 0.0, 1.0) ** spec_pow) * LOOK[
            "spec"
        ]
        fres = (1.0 - ndv) ** 3
        rim_light = np.clip(np.einsum("nc,c->n", nrm, rim), 0.0, 1.0) ** 1.4 * (
            0.25 + 1.4 * fres
        )
        out = albedo * diffuse
        out += (spec * ao_term)[:, None] * key_c[None, :]
        out += (LOOK["rim"] * rim_light * ao_term)[:, None] * rim_c[None, :]
        out *= (1.0 - LOOK["seam"] * seam_term)[:, None]
        return out, fres

    color = np.zeros((n, 3), dtype=np.float64)
    alpha = np.zeros(n, dtype=np.float64)

    if len(pix_m):
        albedo = np.array(
            [mesh_albedo(model, int(i)) for i in range(len(model.meshes))]
        )
        selected = np.array([SELECTED_ENTITY in m["entities"] for m in model.meshes])
        a = albedo[mesh_m]
        lit, _ = light(pos_m, nrm_m.astype(np.float64), a, 1.0, ao[pix_m], seam[pix_m])
        # The default selection gets a glow so it still reads when the site's
        # filter turns the poster greyscale.
        glow = (
            selected[mesh_m][:, None]
            * hex_linear("#5a1e18")[None, :]
            * LOOK["selected_glow"]
        )
        color[pix_m] = lit + glow
        alpha[pix_m] = 1.0

    # Skin shell. Over muscle it is a thin veil, strongest at the silhouette;
    # alone (head, hands, feet) it is a pale, lit form.
    if len(pix_s):
        skin_albedo = np.tile(hex_linear(SKIN_COLOR), (len(pix_s), 1))
        lit_s, fres_s = light(
            pos_s,
            nrm_s.astype(np.float64),
            skin_albedo,
            0.6,
            ao[pix_s],
            np.zeros(len(pix_s)),
        )
        lit_s = lit_s * LOOK["skin_gain"]
        over_muscle = m_cov[pix_s] & (depth[pix_s] >= skin_depth[pix_s] - 0.004)
        veil = np.clip(
            LOOK["skin_veil_base"]
            + LOOK["skin_veil_edge"] * fres_s ** LOOK["skin_edge_power"],
            0.0,
            0.75,
        )
        a_skin = np.where(
            over_muscle, veil, np.where(m_cov[pix_s], 0.0, LOOK["skin_alone_alpha"])
        )
        base = color[pix_s]
        base_a = alpha[pix_s]
        color[pix_s] = lit_s * a_skin[:, None] + base * (1.0 - a_skin)[:, None] * 1.0
        alpha[pix_s] = a_skin + base_a * (1.0 - a_skin)
        # Premultiplied colour: where there was no muscle, base is zero already.

    # Tone map (premultiplied colour is unpremultiplied first), then box-filter
    # the supersampled image down to the poster resolution.
    safe = np.maximum(alpha, 1e-6)[:, None]
    straight = color / safe
    mapped = linear_to_srgb(aces(straight * LOOK["exposure"]))
    premult = mapped * alpha[:, None]
    rgba = np.concatenate([premult, alpha[:, None]], axis=1).reshape(h, w, 4)
    rgba = rgba.reshape(h // ss, ss, w // ss, ss, 4).mean(axis=(1, 3))
    a_out = rgba[..., 3:4]
    rgb_out = np.where(a_out > 1e-6, rgba[..., :3] / np.maximum(a_out, 1e-6), 0.0)
    tile = np.concatenate([rgb_out, a_out], axis=2)
    canvas = np.zeros((full_h, full_w, 4), dtype=np.float32)
    canvas[y0 // ss : y0 // ss + tile.shape[0], x0 // ss : x0 // ss + tile.shape[1]] = (
        tile
    )
    return canvas


def to_image(canvas: np.ndarray) -> Image.Image:
    return Image.fromarray((np.clip(canvas, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")


# --------------------------------------------------------------------------- #
# Verification
# --------------------------------------------------------------------------- #


def silhouette(model: Model, view: str, scale: int) -> np.ndarray:
    """Binary silhouette of the model at poster scale, with no shading."""
    w, h = FRAME[0] * scale, FRAME[1] * scale
    cam = Camera(view, w, h)
    sx, sy, zc = cam.project(model.pos)
    buf = Buffers(w, h)
    ids = np.arange(len(model.tris))
    rasterise(buf, sx, sy, 1.0 / zc, model.tris, ids)
    return (buf.tri >= 0).reshape(h, w)


def check(model: Model, minimum_iou: float, directory: Path | None = None) -> bool:
    """Compare each poster's silhouette with the model's, at poster resolution.

    This proves the framing (and so every hotspot) still matches the model seen
    through the explorer camera. It runs at full resolution so that
    anti-aliased edges are compared like for like.
    """
    ok = True
    want = (FRAME[0] * DEFAULT_SCALE, FRAME[1] * DEFAULT_SCALE)
    for view, default_path in OUTPUTS.items():
        path = default_path if directory is None else directory / default_path.name
        if not path.exists():
            print(f"{view}: {path} is missing")
            ok = False
            continue
        image = Image.open(path).convert("RGBA")
        if image.size != want:
            print(f"{view}: poster is {image.size}, expected {want}")
            ok = False
            continue
        poster = np.asarray(image)[..., 3] >= 8
        model_mask = silhouette(model, view, DEFAULT_SCALE)
        inter = np.logical_and(poster, model_mask).sum()
        union = np.logical_or(poster, model_mask).sum()
        iou = inter / union if union else 0.0
        print(f"{view}: silhouette IoU {iou:.4f} (minimum {minimum_iou})")
        ok = ok and iou >= minimum_iou
    return ok


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--view", choices=["front", "back", "both"], default="both")
    parser.add_argument(
        "--scale", type=int, default=DEFAULT_SCALE, help="poster pixels per frame pixel"
    )
    parser.add_argument("--supersample", type=int, default=2)
    parser.add_argument(
        "--out", type=Path, help="write previews here instead of the asset paths"
    )
    parser.add_argument(
        "--check", action="store_true", help="verify committed posters, write nothing"
    )
    parser.add_argument("--min-iou", type=float, default=0.98)
    parser.add_argument(
        "--posters", type=Path, help="with --check, verify posters in this directory"
    )
    parser.add_argument(
        "--look",
        action="append",
        default=[],
        metavar="KEY=VALUE",
        help="override a LOOK setting for this run (for tuning), e.g. --look exposure=0.7",
    )
    args = parser.parse_args(argv)
    for item in args.look:
        key, _, value = item.partition("=")
        if key not in LOOK:
            parser.error(f"unknown LOOK setting {key!r}; choose from {', '.join(LOOK)}")
        LOOK[key] = type(LOOK[key])(float(value))

    model = Model(GLB)
    model.smooth_normals(LOOK["normal_smoothing"], LOOK["normal_crease"])
    if args.check:
        return 0 if check(model, args.min_iou, args.posters) else 1

    views = ["front", "back"] if args.view == "both" else [args.view]
    for view in views:
        started = time.time()
        canvas = render_view(model, view, args.scale, args.supersample)
        target = OUTPUTS[view] if args.out is None else args.out / OUTPUTS[view].name
        target.parent.mkdir(parents=True, exist_ok=True)
        to_image(canvas).save(target, optimize=True)
        print(f"{view}: wrote {target} in {time.time() - started:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
