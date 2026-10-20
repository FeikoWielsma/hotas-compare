import sys, re, json
from pathlib import Path
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")
OUT.mkdir(parents=True, exist_ok=True)

def fetch(url, name=None, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
            final = r.geturl()
            ct = r.headers.get("content-type")
            print(f"OK {r.status} {len(data)} {ct} {url} -> {final}")
            if name:
                p = OUT / name
                if binary or (ct and "text" not in ct and "json" not in ct and "html" not in ct):
                    p.write_bytes(data)
                else:
                    p.write_text(data.decode("utf-8", "replace"), encoding="utf-8")
                print("  saved", p.name)
            return data, final, ct
    except Exception as e:
        print(f"FAIL {url} {type(e).__name__}: {e}")
        return None, None, None

docs = {
    "alpha-lite-map": "https://media.canto.global/b/K42S6",
    "foxtrot-input": "https://media.canto.global/v/HoneycombAeronautical/s/QJFB1",
    "foxtrot-kit-input": "https://media.canto.global/b/HV8QI",
    "throttle-box-input": "https://media.canto.global/b/Q0GQM",
}
for name, url in docs.items():
    fetch(url, name + ".bin", binary=True)

handles = [
    "bravo-throttle-quadrant",
    "bravo-throttle-quadrant-lite",
    "alpha-flight-controls",
    "alpha-flight-controls-xpc",
    "alpha-flight-controls-lite",
    "foxtrot-aviation-stick",
    "foxtrot-takeoff-kit",
    "foxtrot-throttle-box",
    "sierra-tpm-module",
    "charlie-rudder-pedals",
]
for h in handles:
    data, final, ct = fetch(f"https://flyhoneycomb.com/products/{h}.js", f"us-{h}.js")
    if data and ct and "json" in ct:
        try:
            obj = json.loads(data)
        except Exception as e:
            print("  json fail", e)
            continue
        print("  TITLE", obj.get("title"), "PRICE", obj.get("price"), "VARIANTS", [(v.get("title"), v.get("price"), v.get("sku")) for v in obj.get("variants", [])])
        body = re.sub("<[^>]+>", " ", obj.get("description") or "")
        body = re.sub(r"\s+", " ", body)
        print("  DESC", body[:1800])
        print("---")
