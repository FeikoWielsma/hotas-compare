import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
names = [
    "atlas-ffb-base.html.html",
    "atlas-pro-ffb-base.html.html",
    "b-jet-ministick-module.html.html",
    "b-jet-yoke-handle.html.html",
    "constellation-vega-yoke-handle.html.html",
    "prm-hat-module.html.html",
    "prm-hes-module.html.html",
    "r1-falcon-rudder-pedals.html.html",
    "r1-legend-rudder-pedals.html.html",
    "vector-emc-panel.html.html",
    "vector-flight-yoke-base.html.html",
    "vector-gmc-panel.html.html",
    "vector-lmc-panel.html.html",
    "vpc-dual-sf-collective-grip.html.html",
    "vpc-rotor-tcs-base-upgraded.html.html",
    "vpc-sharka-50-collective-grip.html.html",
    "vpc-universal-control-panel-3.html.html",
    "vpc-ace-interceptor-pedals.html.html",
    "vpc-ace-torq-rudder-pedals.html.html",
]
for name in names:
    p = root / name
    if not p.exists():
        print("MISSING", name)
        continue
    html = p.read_text(encoding="utf-8", errors="replace")
    sku = re.search(r'itemprop="sku"[^>]*>([^<]+)', html)
    if not sku:
        sku = re.search(r'"sku"\s*:\s*"([^"]+)"', html)
    stock = "out of stock" if re.search(r"out of stock|unavailable", html, re.I) else ""
    if "Add to Cart" in html or "tocart" in html:
        stock = (stock + " add-to-cart").strip()
    if "Pre-Order" in html or "pre-order" in html:
        stock = (stock + " preorder-text").strip()
    imgs = re.findall(r"https://virpil-controls\.eu/media/catalog/product/[^\"']+\.(?:jpg|png|webp)", html)
    # prefer non-cache full if present else first unique basename
    uniq = []
    for u in imgs:
        base = u.split("/")[-1].split("?")[0]
        if base not in [x.split("/")[-1] for x in uniq]:
            uniq.append(u)
    print(f"{name}\n  sku={sku.group(1).strip() if sku else '?'}\n  stock={stock}\n  img={uniq[0] if uniq else '?'}")
