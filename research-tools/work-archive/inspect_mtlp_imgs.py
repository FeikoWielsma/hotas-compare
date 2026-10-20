import os
from PIL import Image

# Let's inspect the images in work/pdf_extracted_imgs/mtlp
imgs = [
    'work/pdf_extracted_imgs/mtlp/p1_img2_2571x1271.jpeg',
    'work/pdf_extracted_imgs/mtlp/p4_img1_1248x662.jpeg',
    'work/pdf_extracted_imgs/mtlp/p4_img2_1248x662.jpeg',
    'work/pdf_extracted_imgs/mtlp/p5_img1_1263x670.jpeg'
]

for p in imgs:
    im = Image.open(p)
    print(p, im.size)

# Also let's crop p5_img1 which is "Only MTLP Connected" Cockpit diagram
im5 = Image.open('work/pdf_extracted_imgs/mtlp/p5_img1_1263x670.jpeg')
# save crops
os.makedirs('work/mtlp_crops', exist_ok=True)
im5.save('work/mtlp_crops/p5_full.png')
# let's crop left half and right half
w, h = im5.size
im5.crop((0, 0, w//2, h)).save('work/mtlp_crops/p5_left.png')
im5.crop((w//2, 0, w, h)).save('work/mtlp_crops/p5_right.png')

# Let's also inspect p1_img2 which is the product overview
im1 = Image.open('work/pdf_extracted_imgs/mtlp/p1_img2_2571x1271.jpeg')
im1.save('work/mtlp_crops/p1_full.png')
w1, h1 = im1.size
im1.crop((0, 0, w1//3, h1)).save('work/mtlp_crops/p1_left.png')
im1.crop((w1//3, 0, 2*w1//3, h1)).save('work/mtlp_crops/p1_mid.png')
im1.crop((2*w1//3, 0, w1, h1)).save('work/mtlp_crops/p1_right.png')
print("Saved MTLP crops")
