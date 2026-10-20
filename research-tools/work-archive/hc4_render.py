import sys, os
sys.stdout.reconfigure(encoding='utf-8')
import fitz
# usage: render.py <pdf> <outdir> <dpi> <page,page,...> [prefix]
pdf, outdir, dpi, pages = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
prefix = sys.argv[5] if len(sys.argv) > 5 else os.path.splitext(os.path.basename(pdf))[0]
os.makedirs(outdir, exist_ok=True)
d = fitz.open(pdf)
for n in pages.split(','):
    n = int(n)
    pix = d[n-1].get_pixmap(dpi=dpi)
    out = os.path.join(outdir, f'{prefix}-p{n}-{dpi}.png')
    pix.save(out)
    print(out, pix.width, pix.height)
