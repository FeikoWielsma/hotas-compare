from PIL import Image

# Let's inspect mtq_panel.png
im = Image.open('work/mtq_panel.png')
w, h = im.size

# Let's crop vertical columns: left column, center-left, center, center-right, right
for i in range(4):
    left = i * (w // 4)
    right = (i + 1) * (w // 4)
    im.crop((left, 0, right, h)).save(f'work/mtq_col_{i}.png')

print("Saved 4 columns of MTQ panel")
