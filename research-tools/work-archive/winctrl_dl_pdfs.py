"""Download unique WINCTRL manuals and extract text."""
import json
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent / "winctrl-sweep"
PDFS = ROOT / "pdfs"
TEXT = ROOT / "pdf-text"
PDFS.mkdir(exist_ok=True)
TEXT.mkdir(exist_ok=True)

rows = json.loads((ROOT / "manuals-type4.json").read_text(encoding="utf-8"))["data"]
# skip obvious non-control accessories
SKIP = ("desk mount", "finger lift", "panel mount", "extension of collective", "joystick extension", "cam/spring", "mfssb kits")

seen = set()
jobs = []
for row in rows:
    h = row["ipfs_hash"]
    if h in seen:
        continue
    name = (row.get("name") or "").lower()
    shop = (row.get("shop_name") or "").lower()
    blob = name + " " + shop
    if any(s in blob for s in SKIP):
        continue
    seen.add(h)
    jobs.append(row)

print("download", len(jobs))
for row in jobs:
    h = row["ipfs_hash"]
    dest = PDFS / f"{h}.pdf"
    if not dest.exists() or dest.stat().st_size < 1000:
        url = f"https://eu.winctrl.com/static/download/{h}?filename={h}.pdf"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            data = urllib.request.urlopen(req, timeout=90).read()
        except Exception as e:
            print("FAIL", row.get("name"), e)
            continue
        dest.write_bytes(data)
        print("GET", len(data), row.get("name"))
    else:
        print("HAVE", row.get("name"))

# extract text
import fitz  # pymupdf may be missing

print("--- extract later ---")
