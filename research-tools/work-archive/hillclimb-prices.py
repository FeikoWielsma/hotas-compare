import sys, re
from pathlib import Path
import urllib.request
sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")

def get(url, name):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
            print("OK", r.status, len(data), r.geturl())
            (OUT / name).write_bytes(data)
            return data.decode("utf-8", "replace")
    except Exception as e:
        print("FAIL", url, type(e).__name__, e)
        return ""

urls = {
    "tb-uk-fs2.html": "https://uk.turtlebeach.com/products/velocity-one-flight-stick-ii",
    "tb-uk-dt.html": "https://uk.turtlebeach.com/products/velocity-one-dual-throttle",
    "tb-uk-fd.html": "https://uk.turtlebeach.com/products/velocity-one-flight-deck",
    "tb-uk-yoke.html": "https://uk.turtlebeach.com/products/velocity-one-flight",
    "tb-uk-rudder.html": "https://uk.turtlebeach.com/products/velocity-one-rudder",
    "tb-uk-fs1.html": "https://uk.turtlebeach.com/products/velocity-one-flight-stick",
    "bravo-9.jpg": "https://flyhoneycomb.com/cdn/shop/files/GH662729_HC003042_BRAVO-THROTTLE-QUADRANT_9.jpg?v=1756653266&width=1600",
    "bravo-14.jpg": "https://flyhoneycomb.com/cdn/shop/files/GH662729_HC003042_BRAVO-THROTTLE-QUADRANT_14.jpg?v=1756653266&width=1600",
    "bravo-15.jpg": "https://flyhoneycomb.com/cdn/shop/files/HC003042_BRAVO-THROTTLE-QUADRANT_15.jpg?v=1756653266&width=1600",
}
for name, url in urls.items():
    text = get(url, name)
    if name.endswith("html") and text:
        prices = sorted(set(re.findall(r"(?:£|€|\$)\s?\d+[.,]\d{2}", text)))
        vat = []
        low = text.lower()
        for key in ["vat", "tax", "incl.", "including"]:
            i = low.find(key)
            if i >= 0:
                vat.append(text[max(0,i-40):i+80].replace("\n"," "))
        print("  prices", prices[:12])
        print("  vat", vat[:4])

# downloads page text snippet
raw = (OUT / "mfg-downloads.html").read_text(encoding="utf-8", errors="replace")
text = re.sub(r"<[^>]+>", " ", raw)
text = re.sub(r"\s+", " ", text)
print("DOWNLOADS", text[text.lower().find("download"):text.lower().find("download")+1500])
