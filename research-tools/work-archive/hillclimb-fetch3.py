import sys, re, json
from pathlib import Path
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            data = r.read()
            print(f"OK {r.status} {len(data)} {r.headers.get('content-type')} {r.geturl()}")
            return data, r.geturl(), r.headers.get("content-type")
    except Exception as e:
        print(f"FAIL {url} {type(e).__name__}: {e}")
        return None, None, None

pages = {
    "bravo.html": "https://flyhoneycomb.com/products/bravo-throttle-quadrant",
    "bravo-lite.html": "https://flyhoneycomb.com/products/bravo-throttle-quadrant-lite",
    "alpha.html": "https://flyhoneycomb.com/products/alpha-flight-controls",
    "alpha-lite.html": "https://flyhoneycomb.com/products/alpha-flight-controls-lite",
    "charlie.html": "https://flyhoneycomb.com/products/charlie-rudder-pedals",
    "foxtrot.html": "https://flyhoneycomb.com/products/foxtrot-aviation-stick",
    "sierra.html": "https://flyhoneycomb.com/products/sierra-tpm-module",
    "flap-kit.html": "https://flyhoneycomb.com/products/flap-kit-for-bravo",
    "mfg-me109.html": "https://mfg-sim.com/rudders/mfg-crosswind-v3-me109-rudder-pedals.html",
    "mfg-base.html": "https://mfg-sim.com/rudders/mfg-crosswind-v3-base.html",
    "mfg-damper.html": "https://mfg-sim.com/rudder-acessories/hydraulic-damper-universal-kit-for-v1-3-pedals.html",
    "mfg-foot.html": "https://mfg-sim.com/rudder-acessories/footrest-kit-for-mfg-rudder-pedals.html",
}
for name, url in pages.items():
    data, final, ct = fetch(url)
    if data:
        (OUT / name).write_bytes(data)
        text = data.decode("utf-8", "replace")
        # pdf and interesting links
        links = sorted(set(re.findall(r'https?://[^\"\'\s>]+\.(?:pdf|zip)', text, flags=re.I)))
        links += sorted(set(re.findall(r'href=\"([^\"]+)\"', text)))
        interesting = [h for h in links if re.search(r'pdf|spec|manual|dimension|attachment|download', h, re.I)]
        print("  interesting", len(interesting))
        for h in interesting[:25]:
            print("   ", h[:180])

tb = [
    "https://uk.turtlebeach.com/products/velocity-one-flight-stick-ii.js",
    "https://uk.turtlebeach.com/products/velocity-one-dual-throttle.js",
    "https://uk.turtlebeach.com/products/velocity-one-flight-deck.js",
    "https://uk.turtlebeach.com/products/velocity-one-flight.js",
    "https://uk.turtlebeach.com/products/velocity-one-rudder.js",
    "https://uk.turtlebeach.com/products/velocity-one-flight-stick.js",
    "https://de.turtlebeach.com/products/velocity-one-flight-stick-ii.js",
    "https://eu.turtlebeach.com/products/velocity-one-flight-stick-ii.js",
    "https://www.turtlebeach.com/de/products/velocity-one-flight-stick-ii.js",
]
for url in tb:
    data, final, ct = fetch(url)
    if data and ct and ("json" in ct or "javascript" in ct):
        try:
            obj = json.loads(data)
            title = obj.get("title")
            variants = [(v.get("title"), v.get("price"), v.get("sku")) for v in obj.get("variants", [])]
            print("  ", title, variants)
        except Exception as e:
            print("  parse", e, data[:120])
