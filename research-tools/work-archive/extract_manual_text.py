import os, fitz

os.makedirs('work/moza_txt', exist_ok=True)

pdf_dir = 'work/moza_pdfs'
for f in os.listdir(pdf_dir):
    if f.endswith('.pdf'):
        name = f[:-4]
        doc = fitz.open(os.path.join(pdf_dir, f))
        out_txt = os.path.join('work/moza_txt', f"{name}.txt")
        with open(out_txt, 'w', encoding='utf-8') as out:
            for i, page in enumerate(doc):
                text = page.get_text()
                out.write(f"--- PAGE {i+1} ---\n")
                out.write(text + "\n\n")
        print(f"Extracted {name}: {len(doc)} pages")
