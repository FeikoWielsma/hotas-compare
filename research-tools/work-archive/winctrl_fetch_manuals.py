"""Request official manuals for every EU store listing."""
import json
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent / "winctrl-sweep"
data = json.loads((ROOT / "eu_winctrl_com_home_list_get.json").read_text(encoding="utf-8"))["data"]
listing = []
seen = set()
for item in data["list"]:
    key = (item["id"], item.get("sku_id") or 0)
    if key in seen:
        continue
    seen.add(key)
    listing.append({"sku_id": item.get("sku_id") or 0, "shop_id": item["id"]})

body = json.dumps({"typeId": 4, "list": listing}).encode()
req = urllib.request.Request(
    "https://eu.winctrl.com/home/download/selectProductDownload",
    data=body,
    headers={
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "language": "en",
        "Accept": "application/json",
    },
)
raw = urllib.request.urlopen(req, timeout=90).read()
(ROOT / "manuals-type4.json").write_bytes(raw)
payload = json.loads(raw)
print("errno", payload.get("errno"), "errmsg", payload.get("errmsg"), "bytes", len(raw))
rows = payload.get("data") or []
print("rows", len(rows))
if rows:
    print("keys", rows[0].keys())
    print(json.dumps(rows[0], ensure_ascii=False)[:800])
# group by shop
by = {}
for row in rows:
    by.setdefault(row.get("shop_id") or row.get("shop_name"), []).append(row)
print("groups", len(by))
for row in rows:
    print(
        f"{row.get('shop_id')} | {row.get('shop_name')} | {row.get('name')} | {row.get('format')} | {row.get('ipfs_hash')}"
    )
