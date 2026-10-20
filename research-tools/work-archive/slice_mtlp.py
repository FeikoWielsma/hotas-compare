from PIL import Image

im = Image.open('work/pdf_extracted_imgs/mtlp/p1_img2_2571x1271.jpeg')
print("p1_img2 size:", im.size)

# The image is 2571x1271. Let's crop it into smaller vertical slices and save to work/mtlp_crops/
w, h = im.size
for i in range(5):
    left = i * (w // 5)
    right = (i + 1) * (w // 5)
    slice_im = im.crop((left, 0, right, h))
    slice_im.save(f'work/mtlp_crops/slice_{i}.png')

print("Saved 5 slices")
