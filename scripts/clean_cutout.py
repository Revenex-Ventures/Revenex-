import os
import numpy as np
from PIL import Image
from scipy.ndimage import label

# Resolve target directory
public_dir = os.path.abspath("artifacts/revenex/public")
img_path = os.path.join(public_dir, "Prasanna.png")

if not os.path.exists(img_path):
    print("Prasanna.png not found.")
    exit(1)

# Open image
img = Image.open(img_path)
data = np.array(img)
alpha = data[:, :, 3]

# Create a binary mask of solid pixels
mask = alpha > 10

# Label connected components
labeled_mask, num_features = label(mask)
print(f"Found {num_features} connected components in the alpha channel.")

if num_features > 0:
    # Find the sizes of each component (index 1 to num_features)
    sizes = [np.sum(labeled_mask == i) for i in range(1, num_features + 1)]
    largest_label = np.argmax(sizes) + 1
    print(f"Largest component size: {sizes[largest_label - 1]} pixels.")
    
    # Create mask of only the largest component (Prasanna's body)
    cleaned_mask = (labeled_mask == largest_label)
    
    # Zero out all other pixels in the alpha channel
    alpha[~cleaned_mask] = 0
    
    # Apply soft edge erosion on the alpha channel to clean up border noise around shoulders
    # We will zero out any single isolated pixels or stray pixels near the edges
    height, width = alpha.shape
    for y in range(height):
        # Find first and last solid pixel in this row
        solid_pixels = np.where(alpha[y, :] > 0)[0]
        if len(solid_pixels) > 5:
            left_border = solid_pixels[0]
            right_border = solid_pixels[-1]
            # If there's a detached or low-density block on the left/right, clear it
            # (e.g., if there's a gap of transparency followed by pixels)
            row = alpha[y, :]
            # Smoothly shave off outer 2 pixels on the left and right borders to clean up edge noise
            alpha[y, left_border:left_border+3] = 0
            alpha[y, right_border-3:right_border+1] = 0

    data[:, :, 3] = alpha
    
    # Save the cleaned image
    cleaned_img = Image.fromarray(data)
    
    # Crop to the new clean bounding box of the non-zero pixels
    bbox = cleaned_img.getbbox()
    if bbox:
        cropped_img = cleaned_img.crop(bbox)
        cropped_img.save(img_path)
        print(f"Successfully cleaned and cropped Prasanna.png to size: {cropped_img.size}")
    else:
        cleaned_img.save(img_path)
        print("Successfully cleaned Prasanna.png (no new crop needed).")
else:
    print("No features detected in the alpha mask.")
