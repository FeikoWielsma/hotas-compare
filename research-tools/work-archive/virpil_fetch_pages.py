import re
import time
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}
urls = [
    "https://virpil-controls.eu/robots.txt",
    "https://virpil-controls.eu/atlas-ffb-base.html",
    "https://virpil-controls.eu/atlas-pro-ffb-base.html",
    "https://virpil-controls.eu/b-jet-ministick-module.html",
    "https://virpil-controls.eu/b-jet-yoke-handle.html",
    "https://virpil-controls.eu/vpc-dual-sf-collective-grip.html",
    "https://virpil-controls.eu/vpc-rotor-tcs-base-upgraded.html",
    "https://virpil-controls.eu/vpc-sharka-50-collective-grip.html",
    "https://virpil-controls.eu/constellation-vega-yoke-handle.html",
    "https://virpil-controls.eu/vector-flight-yoke-base.html",
    "https://virpil-controls.eu/vector-lmc-panel.html",
    "https://virpil-controls.eu/vector-gmc-panel.html",
    "https://virpil-controls.eu/vector-emc-panel.html",
    "https://virpil-controls.eu/prm-hes-module.html",
    "https://virpil-controls.eu/prm-hat-module.html",
    "https://virpil-controls.eu/vpc-universal-control-panel-3.html",
    "https://virpil-controls.eu/universal-control-panel-3-axis-handles.html",
    "https://virpil-controls.eu/r1-falcon-rudder-pedals.html",
    "https://virpil-controls.eu/r1-legend-rudder-pedals.html",
    "https://virpil-controls.eu/r1-falcon-footplates.html",
    "https://virpil-controls.eu/r1-legend-footplates.html",
    "https://virpil-controls.eu/vpc-ace-interceptor-pedals.html",
    "https://virpil-controls.eu/vpc-ace-torq-pedals.html",
    "https://virpil-controls.eu/vpc-mongoost-50cm3-throttle.html",
    "https://virpil-controls.eu/cdt-aeromax-l-flightstick.html",
    "https://virpil-controls.eu/cdt-aeromax-lz-flightstick-omnithrottle.html",
    "https://virpil-controls.eu/cdt-aeromax-r-flightstick.html",
    "https://virpil-controls.eu/cdt-aeromax-rz-flightstick-omnithrottle.html",
    "https://support.virpil.com/en/support/solutions/articles/47001275968-cdt-aeromax-flightstick-user-manual",
]
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
out.mkdir(parents=True, exist_ok=True)

for url in urls:
    slug = url.rstrip("/").split("/")[-1][:80]
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            data = r.read()
            ext = ".txt" if url.endswith("robots.txt") else ".html"
            (out / f"{slug}{ext}").write_bytes(data)
            print(f"OK {r.status} {len(data):7d} {r.geturl()[:110]}")
    except Exception as e:
        print("FAIL", url, type(e).__name__, e)
    time.sleep(0.2)
