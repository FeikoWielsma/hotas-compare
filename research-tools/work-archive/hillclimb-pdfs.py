import sys, re
from pathlib import Path
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")

def fetch(url, name):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
        print(url, r.status, r.headers.get("content-type"), len(data), r.geturl())
        (OUT / name).write_bytes(data)

fetch("https://mfg-sim.com/download/Specifications.pdf", "mfg-specifications.pdf")
fetch("https://mfg-sim.com/download/CAM_Presentation.pdf", "mfg-cam.pdf")
fetch("https://mfg-sim.com/downloads/", "mfg-downloads.html")

# larger canto preview attempts
base = "https://d1c96hlcey6qkb.cloudfront.net/2ae072ac-979c-43ac-8653-246483b1c776/a48f213784264a0e9746c11219a748d3"
for suffix in [".jpg", ".800.jpg", ".1600.jpg", ".png", ".pdf"]:
    url = base + suffix
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read()
            print("CANTO", suffix, r.status, r.headers.get("content-type"), len(data))
            (OUT / ("canto" + suffix.replace(".", "_"))).write_bytes(data)
    except Exception as e:
        print("CANTO FAIL", suffix, type(e).__name__, e)
