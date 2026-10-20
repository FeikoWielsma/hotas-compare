import os, fitz

pdf_dir = 'work/moza_pdfs'
out_dir = 'work/pdf_extracted_imgs'
os.makedirs(out_dir, exist_ok=True)

for f in sorted(os.listdir(pdf_dir)):
    if f.endswith('.pdf'):
        name = f[:-4]
        target_dir = os.path.join(out_dir, name)
        os.makedirs(target_dir, exist_ok=True)
        doc = fitz.open(os.path.join(pdf_dir, f))
        count = 0
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            image_list = page.get_images(full=True)
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_filename = f"p{page_idx+1}_img{img_idx+1}_{base_image['width']}x{base_image['height']}.{image_ext}"
                with open(os.path.join(target_dir, image_filename), "wb") as f_out:
                    f_out.write(image_bytes)
                count += 1
        print(f"{name}: extracted {count} images")
