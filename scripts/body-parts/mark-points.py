#!/usr/bin/env python3
"""Draw each region's plate and hotspot points on the anatomy posters.

Usage: python3 scripts/body-parts/mark-points.py [slug]

Writes $TMPDIR/marked-front.png and $TMPDIR/marked-back.png (the back file only
when the back poster exists) and prints both paths. Open the PNGs and check the
rings sit on the right anatomy. Solid ring = plate, thin dashed ring = hotspot.
"""
import json
import math
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw

POSTERS = {
    "front": "assets/derived/bodyparts3d/anatomy-explorer-poster.png",
    "back": "assets/derived/bodyparts3d/anatomy-explorer-poster-back.png",
}
BACKGROUND = (0x28, 0x28, 0x2E, 255)
RING = (225, 29, 72, 255)
SCALE = 2
FRAME = (862, 672)  # POSTER_FRAME in src/lib/body-parts/poster.ts
NODE_SCRIPT = (
    "import('./src/data/body-parts/index.ts').then(m => console.log(JSON.stringify("
    "m.ALL_BODY_PARTS.map(({slug, plate, hotspots}) => ({slug, plate, hotspots})))))"
)


def load_regions(only):
    out = subprocess.run(
        ["node", "--input-type=module", "-e", NODE_SCRIPT],
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    regions = json.loads(out)
    return [r for r in regions if only is None or r["slug"] == only]


def dashed_ring(draw, cx, cy, radius, width):
    steps = 24
    for i in range(steps):
        if i % 2:
            continue
        a0 = 360 * i / steps
        a1 = 360 * (i + 1) / steps
        draw.arc(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            a0,
            a1,
            fill=RING,
            width=width,
        )


def render(view, regions, out_path):
    # Rings and labels are sized for the 862x672 frame the points are
    # measured against; the poster files are captured at a multiple of it.
    poster = Image.open(POSTERS[view]).convert("RGBA").resize(FRAME, Image.LANCZOS)
    canvas = Image.new("RGBA", poster.size, BACKGROUND)
    canvas.alpha_composite(poster)
    bbox = poster.split()[3].getbbox()
    draw = ImageDraw.Draw(canvas)
    w, h = poster.size
    for region in regions:
        points = []
        if region["plate"]["view"] == view:
            points.append(("plate", region["plate"]))
        points += [("hotspot", s) for s in region["hotspots"] if s["view"] == view]
        for kind, p in points:
            cx, cy = p["x"] / 100 * w, p["y"] / 100 * h
            if kind == "plate":
                r = 14
                draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=RING, width=3)
                label_dx = r + 4
            else:
                r = 8
                dashed_ring(draw, cx, cy, r, 2)
                label_dx = -r - 4
            text = region["slug"]
            tx = cx + label_dx if label_dx > 0 else cx + label_dx - 6 * len(text)
            draw.text((tx, cy - 5), text, fill=(255, 255, 255, 255))
    if bbox:
        pad = 40
        canvas = canvas.crop(
            (
                max(bbox[0] - pad, 0),
                max(bbox[1] - pad // 2, 0),
                min(bbox[2] + pad, w),
                min(bbox[3] + pad // 2, h),
            )
        )
    canvas = canvas.resize((canvas.width * SCALE, canvas.height * SCALE), Image.LANCZOS)
    canvas.save(out_path)
    return out_path


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    regions = load_regions(only)
    if not regions:
        sys.exit(f"No region named {only!r}")
    tmp = os.environ.get("TMPDIR") or tempfile.gettempdir()
    for view in ("front", "back"):
        if not os.path.exists(POSTERS[view]):
            print(f"skipped {view}: {POSTERS[view]} does not exist yet")
            continue
        print(render(view, regions, os.path.join(tmp, f"marked-{view}.png")))


if __name__ == "__main__":
    main()
