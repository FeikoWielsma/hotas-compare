import os
from PIL import Image

for f in sorted(os.listdir('work/pdf_extracted_imgs/mtq')):
    if f.endswith('.jpeg') or f.endswith('.png'):
        im = Image.open(os.path.join('work/pdf_extracted_imgs/mtq', f))
        print(f, im.size)
