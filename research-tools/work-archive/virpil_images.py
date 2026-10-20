import urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}
out = Path(r"C:\Users\feiko\hotas-compare\public\images\virpil")
pairs = {
    "atlas-ffb-base.png": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/f/f/ffb_atlas.3705.png",
    "atlas-pro-ffb-base.png": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/f/f/ffb_atlas.3705_1.png",
    "b-jet-yoke-handle.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/b/j/bjet_01_1.jpg",
    "b-jet-ministick-module.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/b/j/bjet_ministickmodule.jpg",
    "constellation-vega-yoke-handle.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/e/vega_01.jpg",
    "vector-flight-yoke-base.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/e/vectoryoke_01.jpg",
    "vector-lighting-mcp.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-414-001_01_1.jpg",
    "vector-gear-mcp.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-414-002_01.jpg",
    "vector-engine-mcp.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-414-003_01.jpg",
    "prm-hat-module.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-633-05_01.jpg",
    "prm-hes-module.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-633-04_01.jpg",
    "vpc-dual-sf-collective-grip.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-014_03.jpg",
    "vpc-sharka-50-collective-grip.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-011_01-e.jpg",
    "vpc-rotor-tcs-base-upgraded.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-111-200_01.jpg",
    "vpc-control-panel-3.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-403-001_01.jpg",
    "r1-falcon-rudder-pedals.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-305-001_04.jpg",
    "r1-legend-rudder-pedals.jpg": "https://virpil-controls.eu/media/catalog/product/cache/a4d9809fa9f5cf72bca38b0996da933b/v/p/vpc-305-002_01.jpg",
}
for name, url in pairs.items():
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    dest = out / name
    dest.write_bytes(data)
    print(f"{name} {len(data)}")
