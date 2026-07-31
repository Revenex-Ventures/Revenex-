import sys
import os

try:
    from rembg import remove
except ImportError:
    print("Error: rembg library not found. Please install it first using: pip install rembg pillow")
    sys.exit(1)

# Resolve target directory
public_dir = os.path.abspath("artifacts/revenex/public")

team_images = ["Rounak", "Rohan", "Prasanna"]

for name in team_images:
    input_path = os.path.join(public_dir, f"{name}.jpg")
    output_path = os.path.join(public_dir, f"{name}.png")
    
    if not os.path.exists(input_path):
        print(f"Source file not found: {input_path}")
        continue
        
    print(f"Removing background from {name}.jpg...")
    try:
        with open(input_path, 'rb') as f_in:
            input_data = f_in.read()
            output_data = remove(input_data)
            with open(output_path, 'wb') as f_out:
                f_out.write(output_data)
        print(f"Saved transparent cutout to: {output_path}")
    except Exception as e:
        print(f"Error processing {name}.jpg: {e}")
