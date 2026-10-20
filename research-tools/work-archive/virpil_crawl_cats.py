import re
import time
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}
cats = [
    "https://virpil-controls.eu/shop",
    "https://virpil-controls.eu/shop/force-feedback",
    "https://virpil-controls.eu/shop/flightsticks",
    "https://virpil-controls.eu/shop/flightsticks/grips",
    "https://virpil-controls.eu/shop/flightsticks/bases",
    "https://virpil-controls.eu/shop/flightsticks/all-in-one",
    "https://virpil-controls.eu/shop/collectives",
    "https://virpil-controls.eu/shop/collectives/collective-grips",
    "https://virpil-controls.eu/shop/collectives/collective-bases",
    "https://virpil-controls.eu/shop/yokes",
    "https://virpil-controls.eu/shop/yokes/grips",
    "https://virpil-controls.eu/shop/yokes/bases",
    "https://virpil-controls.eu/shop/yokes/control-panels",
    "https://virpil-controls.eu/shop/yokes/button-modules",
    "https://virpil-controls.eu/shop/throttles",
    "https://virpil-controls.eu/shop/control-panels",
    "https://virpil-controls.eu/shop/rudder-pedals",
    "https://virpil-controls.eu/bundles",
    "https://virpil-controls.eu/bundles/ready-to-fly",
    "https://virpil-controls.eu/shop/sale.html",
]
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-cats")
out.mkdir(parents=True, exist_ok=True)

link_re = re.compile(
    r'<a class="product-item-link"\s+href="([^"]+)"[^>]*>\s*(.*?)\s*</a>',
    re.S,
)

for url in cats:
    slug = url.rstrip("/").split("virpil-controls.eu/")[-1].replace("/", "_")
    fetch = url if "?" in url else url + "?product_list_limit=100"
    req = urllib.request.Request(fetch, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
            (out / f"{slug}.html").write_bytes(data)
            text = data.decode("utf-8", "replace")
            items = link_re.findall(text)
            pages = sorted(set(re.findall(r'href="([^"]*\?p=\d+)"', text)))
            print(f"OK {r.status} {len(data):7d} items={len(items):3d} extra_pages={len(pages)} {url}")
            for href, name in items:
                name = re.sub(r"\s+", " ", name).strip()
                print(f"   {name} | {href}")
            if pages:
                print("   PAGES", pages[:8])
    except Exception as e:
        print("FAIL", url, type(e).__name__, e)
    time.sleep(0.25)
