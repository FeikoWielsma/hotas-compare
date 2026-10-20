import json
from pathlib import Path

root = Path(r"C:\Users\feiko\hotas-compare\work\winctrl-sweep\details")
for gid in (2825, 2945, 2585, 2705, 543, 546, 1705, 1845):
    data = json.loads((root / f"{gid}.json").read_text(encoding="utf-8"))["data"]
    keys = ["title", "price", "total_stock", "suspend_sales", "OutOfStockInfo", "goods_no", "deadline"]
    print(gid, {k: data.get(k) for k in keys})
