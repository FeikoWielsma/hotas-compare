"""Extract text from downloaded WINCTRL manuals."""
import sys
from pathlib import Path

import fitz

sys.stdout.reconfigure(encoding="utf-8")
PDFS = Path(__file__).resolve().parent / "winctrl-sweep" / "pdfs"
TEXT = Path(__file__).resolve().parent / "winctrl-sweep" / "pdf-text"
TEXT.mkdir(exist_ok=True)

index = json_lines = []
for pdf in sorted(PDFS.glob("*.pdf")):
    doc = fitz.open(pdf)
    parts = []
    for i, page in enumerate(doc):
        t = page.get_text("text") or ""
        parts.append(f"\n\n===== PAGE {i+1} / {doc.page_count} =====\n{t}")
    out = TEXT / (pdf.stem + ".txt")
    out.write_text("".join(parts), encoding="utf-8")
    chars = sum(len(p) for p in parts)
    print(f"{pdf.name} pages={doc.page_count} chars={chars}")
    doc.close()
