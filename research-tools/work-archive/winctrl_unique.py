"""Deduplicate EU catalog and print identity + manuals + description."""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent / "winctrl-sweep"
data = json.loads((ROOT / "eu_winctrl_com_home_list_get.json").read_text(encoding="utf-8"))["data"]
cats = {c["id"]: c["name"] for c in data["category"]}

# group by normalized title
groups: dict[str, list] = {}
for item in data["list"]:
    title = re.sub(r"\s+", " ", (item.get("title") or "").strip())
    key = title.lower()
    groups.setdefault(key, []).append(item)

rows = []
for key, items in groups.items():
    primary = min(items, key=lambda x: x["id"])
    ids = [i["id"] for i in items]
    manuals = primary.get("manuals") or []
    man_names = []
    if isinstance(manuals, list):
        for m in manuals:
            if isinstance(m, dict):
                man_names.append(m.get("FileName") or m.get("url") or str(m)[:80])
            else:
                man_names.append(str(m)[:80])
    elif isinstance(manuals, dict):
        man_names.append(str(list(manuals.keys()))[:120])
    desc = re.sub(r"\s+", " ", (primary.get("description") or ""))[:400]
    goods = sorted({(i.get("goods_no") or "") for i in items})
    rows.append(
        {
            "ids": ids,
            "cat": cats.get(primary["category_id"], str(primary["category_id"])),
            "title": re.sub(r"\s+", " ", primary["title"].strip()),
            "price": primary.get("price"),
            "goods_no": goods,
            "manuals": man_names,
            "desc": desc,
            "sku_id": primary.get("sku_id"),
            "pics": (primary.get("pics") or [])[:1],
        }
    )

rows.sort(key=lambda r: (r["cat"], r["title"]))
(ROOT / "unique-eu.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"unique titles {len(rows)} from {len(data['list'])}")
for r in rows:
    print(
        f"[{r['cat']}] ids={r['ids']} €{r['price']} sku={r['sku_id']} goods={r['goods_no']}\n  {r['title']}\n  manuals={r['manuals']}\n  desc={r['desc'][:220]}\n"
    )
