from PIL import Image, ImageDraw, ImageFont
import os

# Create gradient background
width, height = 940, 788
gradient = Image.new('RGB', (width, height))
draw = ImageDraw.Draw(gradient)

# Create gradient from #F43F5E to #FDA4AF to #FFE4E6
def hex_to_rgb(hex_color):
    return tuple(int(hex_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))

start_color = hex_to_rgb('#F43F5E')
middle_color = hex_to_rgb('#FDA4AF')
end_color = hex_to_rgb('#FFE4E6')

# Linear gradient interpolation
def interpolate_color(start, end, factor):
    return tuple(int(start[i] + (end[i] - start[i]) * factor) for i in range(3))

# Create gradient
for y in range(height):
    for x in range(width):
        # Calculate position based on 135-degree angle
        dist = (x + y) / (width + height)
        if dist < 0.5:
            color = interpolate_color(start_color, middle_color, dist * 2)
        else:
            color = interpolate_color(middle_color, end_color, (dist - 0.5) * 2)
        draw.point((x, y), color)

# Open original image
original_path = "/Users/admin/Desktop/Nail /Réel Vidéo Instagram conseils Marketing moderne et simple blanc  (Bài đăng Facebook).png"
original = Image.open(original_path)

# Resize original to fit within gradient (max 85% of dimensions)
max_width = int(width * 0.85)
max_height = int(height * 0.85)
original.thumbnail((max_width, max_height), Image.LANCZOS)

# Calculate position to center original image
x_offset = (width - original.width) // 2
y_offset = (height - original.height) // 2

# Paste original image on top of gradient
if original.mode == 'RGBA':
    gradient.paste(original, (x_offset, y_offset), original)
else:
    gradient.paste(original, (x_offset, y_offset))

# Save result
output_path = "/Users/admin/Desktop/Nail /Reel_Instagram_Gradient2_Pink.png"
gradient.save(output_path, 'PNG', quality=100)

print(f"✅ Gradient background applied successfully!")
print(f"📁 Output: {output_path}")
