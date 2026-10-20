import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
for p in sorted(root.glob("*.html")):
    html = p.read_text(encoding="utf-8", errors="replace")
    skus = re.findall(r'class="value"\s*>(VPC-[^<]+)', html)
    sku2 = re.findall(r'data-product-sku="([^"]+)"', html)
    if skus or sku2:
        print(p.name, skus[:3], sku2[:2])
