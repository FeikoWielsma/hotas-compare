import json
from pathlib import Path

p = Path(r"C:\Users\feiko\hotas-compare\work\winctrl-sweep\us_winwingsim_com_home_list_get.json")
data = json.loads(p.read_text(encoding="utf-8"))["data"]["list"]
for item in data:
    if item["id"] == 6485:
        print("US", item.get("price"), item.get("sku_id"), item.get("goods_no"), item.get("title"))
p2 = Path(r"C:\Users\feiko\hotas-compare\work\winctrl-sweep\eu_winctrl_com_home_list_get.json")
data = json.loads(p2.read_text(encoding="utf-8"))["data"]["list"]
for item in data:
    if item["id"] == 6485:
        print("EU", item.get("price"), item.get("sku_id"), item.get("goods_no"))
