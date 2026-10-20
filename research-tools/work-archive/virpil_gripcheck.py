import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
for p in sorted(root.glob("cdt-aeromax*.html")):
    t = p.read_text(encoding="utf-8", errors="replace")
    hits = sorted(set(re.findall(r"AEROMAX[_A-Z0-9]*GRIP[^\"']*", t)))
    print(p.name, hits or "NONE")
