import os
import numpy as np
from PIL import Image

# Resolve target directory
public_dir = os.path.abspath("artifacts/revenex/public")
img_path = os.path.join(public_dir, "Prasanna.png")

if not os.path.exists(img_path):
    print("Prasanna.png not found.")
    exit(1)

# Open image
img = Image.open(img_path)
data = np.array(img)
height, width, channels = data.shape
print(f"Loaded image size: {width}x{height}")

# Above y = 280 is the neck/head area. 
# The background logos are located to the left and right of his head.
# We will zero out pixels above y = 280 that are outside the central head boundary (columns 135 to 232).
for y in range(height):
    if y < 280:
        # Erase background elements on the left side
        data[y, 0:135, 3] = 0
        # Erase background elements on the right side
        data[y, 232:width, 3] = 0

# Save updated image
cleaned_img = Image.fromarray(data)

# Recrop to new bounding box
bbox = cleaned_img.getbbox()
if bbox:
    cropped_img = cleaned_img.crop(bbox)
    cropped_img.save(img_path)
    print(f"Successfully erased background logos and cropped to size: {cropped_img.size}")
else:
    cleaned_img.save(img_path)
    print("Successfully cleaned image.")
