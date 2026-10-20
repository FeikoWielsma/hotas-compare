import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages\cdt-aeromax-r-flightstick.html.html")
html = p.read_text(encoding="utf-8", errors="replace")
urls = sorted(set(re.findall(r'https://virpil-controls\.eu/media/[^"\']+', html)))
for u in urls:
    if any(x in u.lower() for x in ("wysiwyg", "catalog/product", "renditions")):
        print(u[:220])
print("--- count", len(urls))
