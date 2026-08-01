"""Reframe team cutout photos so every member occupies the same visual space.

Reference composition (Rohan.png, 1186x1327):
  - subject height ~96% of canvas height (1276px)
  - top padding ~4% (51px)
  - horizontally centered
  - bottom flush with the canvas edge

The other three cutouts (Rounak.png, Prasanna.png, Isha.png) are reprojected onto the same
canvas and subject scale so they render at the exact same size as Rohan.
"""

import os
import numpy as np
from PIL import Image, ImageFilter

PUBLIC_DIR = os.path.abspath("artifacts/revenex/public")

TARGET_W, TARGET_H = 1186, 1327
SUBJECT_FRAC_H = 0.96
TOP_PAD_FRAC = 0.04
ALPHA_THRESHOLD = 10

TARGETS = ["Rounak.png", "Prasanna.png", "Isha.png"]

def subject_bbox(img: Image.Image):
    data = np.array(img)
    alpha = data[:, :, 3]
    ys, xs = np.where(alpha > ALPHA_THRESHOLD)
    if len(ys) == 0:
        raise ValueError("no non-transparent pixels found")
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)

def process(name: str) -> None:
    path = os.path.join(PUBLIC_DIR, name)
    if not os.path.exists(path):
        print(f"Target not found: {path}")
        return
        
    img = Image.open(path).convert("RGBA")

    left, top, right, bottom = subject_bbox(img)
    subject = img.crop((left, top, right, bottom))
    sw, sh = subject.size
    print(f"{name}: subject crop {sw}x{sh}")

    target_subject_h = round(TARGET_H * SUBJECT_FRAC_H)
    scale = target_subject_h / sh
    subject = subject.resize(
        (max(1, round(sw * scale)), target_subject_h), Image.Resampling.LANCZOS
    )

    # Slight unsharp to compensate for resizing softness
    if scale > 1.05 or scale < 0.95:
        subject = subject.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=3))

    sw, sh = subject.size
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    x = (TARGET_W - sw) // 2
    y = round(TARGET_H * TOP_PAD_FRAC)
    canvas.paste(subject, (x, y), subject)

    canvas.save(path)
    print(
        f"wrote {name}: {TARGET_W}x{TARGET_H} "
        f"subject {sw}x{sh} fracH={sh / TARGET_H:.2f} "
        f"topPad={y / TARGET_H:.2f} leftPad={x / TARGET_W:.2f} rightPad={(TARGET_W - x - sw) / TARGET_W:.2f}"
    )

for name in TARGETS:
    process(name)
