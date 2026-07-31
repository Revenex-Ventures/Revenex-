import sys
import os
from PIL import Image

try:
    from rembg import remove, new_session
except ImportError:
    print("Error: rembg not found.")
    sys.exit(1)

# Resolve target directory
public_dir = os.path.abspath("artifacts/revenex/public")

input_path = os.path.join(public_dir, "Prasanna.jpg")
output_path = os.path.join(public_dir, "Prasanna.png")

if not os.path.exists(input_path):
    print(f"Source file not found: {input_path}")
    sys.exit(1)

print("Removing background using u2net_human_seg specialized model...")
try:
    # Use the human segmentation model to ignore all non-human objects
    session = new_session("u2net_human_seg")
    
    with open(input_path, 'rb') as f_in:
        input_data = f_in.read()
        output_data = remove(input_data, session=session)
        with open(output_path, 'wb') as f_out:
            f_out.write(output_data)
    print("Successfully generated transparent cutout: Prasanna.png")
    
    # Crop the image to center on the person down to chest/hands
    img = Image.open(output_path)
    bbox = img.getbbox() # get boundary box of non-zero pixels
    if bbox:
        # Crop the transparent borders slightly to frame the figure cleanly
        cropped = img.crop(bbox)
        
        # Let's verify dimensions
        width, height = cropped.size
        # We can crop or scale to make sure it includes from head to hands/torso cleanly
        cropped.save(output_path)
        print(f"Cropped image bounding box dimensions: {cropped.size}")
        
except Exception as e:
    print(f"Error: {e}")
