"""Render specific manual pages for visual reading."""
import sys
from pathlib import Path

import fitz

sys.stdout.reconfigure(encoding="utf-8")
PDFS = Path(__file__).resolve().parent / "winctrl-sweep" / "pdfs"
OUT = Path(__file__).resolve().parent / "winctrl-sweep" / "pages"
OUT.mkdir(exist_ok=True)
# 1-based page numbers
jobs = {
    "QmNu2Koz6sDJ5YGgUVWx1fKTm4f85RW7kMBTQS9jdkFkwt": [6, 7, 8],
    "QmTY8EjMA7JwXrPhnkf6ksToihf49mrjEPx6Uz45DBeh2X": [4, 5, 6],
    "Qmcuf2Z4sK1fhbBHysbeCX94yxL9HHS2QPERHpYXpW4hxR": [4],
    "QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b": [8, 9],
    "QmVLFu6k2SkWsQfRgw9o6iryfTg9WQYgD1GHKRRm9Sjvkk": [4],
}
for h, pages in jobs.items():
    doc = fitz.open(PDFS / f"{h}.pdf")
    for n in pages:
        page = doc[n - 1]
        pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6))
        dest = OUT / f"{h[-6:]}-p{n}.png"
        pix.save(dest)
        print(dest.name, pix.width, pix.height)
    doc.close()
