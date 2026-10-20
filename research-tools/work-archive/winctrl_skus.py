"""Fetch SKU variants for combo listings."""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parent / "winctrl-sweep"
IDS = [6485, 385, 342, 374, 1825, 340, 369, 375, 725, 324, 343, 1805]


def get(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "language": "en", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


for gid in IDS:
    url = "https://eu.winctrl.com/home/shop/get?" + urllib.parse.urlencode({"id": gid, "all": 1})
    raw = get(url)
    data = json.loads(raw).get("data") or {}
    # print compact sku-like fields
    interesting = {}
    if isinstance(data, dict):
        for k in (
            "title",
            "price",
            "goods_no",
            "sku_id",
            "suk",
            "goods_select_partss",
            "sub_product_goods_no",
            "discount_package",
            "goodsNames",
        ):
            if k in data:
                interesting[k] = data[k]
        (OUT / "details" / f"{gid}-all.json").write_bytes(raw)
    print("\n====", gid, "====")
    print(json.dumps(interesting, ensure_ascii=False)[:2500])
