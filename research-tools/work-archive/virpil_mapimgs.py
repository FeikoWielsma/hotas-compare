import re
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}
root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-manuals")
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-mapimg")
out.mkdir(exist_ok=True)
files = [
    "47001257030-vpc-apache-64-collective-grip.html",
    "47001264833-vpc-control-panel-3.html",
    "47001275883-cdt-aeromax-r-flightstick.html",
    "47001179891-vpc-sharka-50-collective-grip-user-manual.html",
    "47001251614-apache-64-collective-grip-user-manuals.html",
    "47001258795-control-panel-3-user-manual.html",
]
for name in files:
    html = (root / name).read_text(encoding="utf-8", errors="replace")
    urls = sorted(set(re.findall(r"https?://[^\"'\s>]+\.(?:png|jpg|jpeg|webp)", html, re.I)))
    print("\n==", name, len(urls))
    for u in urls:
        if any(x in u.lower() for x in ("logo", "icon", "favicon", "avatar")):
            continue
        print(u[:180])
        slug = re.sub(r"[^a-zA-Z0-9._-]", "_", u.split("/")[-1])[:80]
        dest = out / f"{name[:12]}_{slug}"
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        try:
            req = urllib.request.Request(u, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r:
                dest.write_bytes(r.read())
                print("  saved", dest.stat().st_size)
        except Exception as e:
            print("  FAIL", e)
