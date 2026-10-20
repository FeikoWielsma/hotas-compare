from PIL import Image

im4 = Image.open('work/pdf_extracted_imgs/mtq/p4_img1_600x334.jpeg')
im4.save('work/mtq_p4_img1.png')

im9 = Image.open('work/pdf_extracted_imgs/mtq/p9_img1_603x319.jpeg')
im9.save('work/mtq_p9_img1.png')

print("Saved MTQ p4 and p9 images")
