from PIL import Image

# Let's inspect MTQ images
im = Image.open('public/images/moza/mtq-throttle.webp')
print('MTQ image size:', im.size)

# Let's also check support article 70000679590 text if we have it in work/moza-research/raw
import os, glob
for f in glob.glob('work/moza-research/raw/*.html'):
    with open(f, 'r', encoding='utf-8') as hf:
        c = hf.read()
        if '70000679590' in c or 'mtq-throttle-quadrant-support' in c:
            print("Found MTQ support page in", f)
