"""Summarize WINCTRL store lists into a compact catalog."""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent / "winctrl-sweep"


def load(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def summarize(label: str, filename: str) -> None:
    data = load(filename)["data"]
    print(f"\n===== {label} =====")
    print("categories:")
    for c in data["category"]:
        print(f"  {c.get('id')} pid={c.get('pid')} {c.get('name')}")
    lst = data["list"]
    print(f"products {len(lst)}")
    print("keys", sorted(lst[0].keys()))
    lines = []
    for item in lst:
        pics = item.get("pics") or []
        pic = pics[0] if pics else ""
        desc = (item.get("description") or "").replace("\n", " ")[:180]
        lines.append(
            {
                "id": item.get("id"),
                "sku_id": item.get("sku_id") or item.get("sku"),
                "cat": item.get("category_id"),
                "title": item.get("title"),
                "price": item.get("price"),
                "price2": item.get("price2"),
                "currency": item.get("currency_unit"),
                "goods_no": item.get("goods_no"),
                "stock": item.get("total_stock"),
                "pre": item.get("preOrder"),
                "suspend": item.get("suspend_sales"),
                "pic": pic,
                "desc": desc,
            }
        )
    out = ROOT / f"summary-{label}.json"
    out.write_text(json.dumps(lines, ensure_ascii=False, indent=2), encoding="utf-8")
    for row in lines:
        print(
            f"{row['id']:>6} cat={row['cat']} {row['currency']}{row['price']} sku={row['sku_id']} | {row['title']}"
        )


def main() -> None:
    summarize("eu", "eu_winctrl_com_home_list_get.json")
    summarize("us", "us_winwingsim_com_home_list_get.json")
    manuals = load("eu_winctrl_com_home_download_getManual.json")["data"]
    print("\n===== manuals", len(manuals), "=====")
    for m in manuals:
        print(m.get("FileName"), "|", m.get("url", "")[:120])


if __name__ == "__main__":
    main()
