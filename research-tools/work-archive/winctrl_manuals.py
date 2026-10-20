"""Pull manual URLs and a short spec excerpt from shop details."""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parent / "winctrl-sweep" / "details"


def walk(obj, acc):
    if isinstance(obj, dict):
        if "FileName" in obj and ("url" in obj or "Url" in obj):
            acc.append(obj)
        for v in obj.values():
            walk(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            walk(v, acc)


def main() -> None:
    rows = []
    for path in sorted(OUT.glob("*.json"), key=lambda p: int(p.stem)):
        payload = json.loads(path.read_text(encoding="utf-8"))
        data = payload.get("data") or {}
        if not isinstance(data, dict):
            continue
        mans = []
        walk(data.get("related_downloads") or data.get("manuals") or {}, mans)
        # also top-level manuals field
        pics = data.get("pics") or []
        rows.append(
            {
                "id": data.get("id") or int(path.stem),
                "title": data.get("title"),
                "price": data.get("price"),
                "goods_no": data.get("goods_no"),
                "pics": pics[:2],
                "manuals": [
                    {"name": m.get("FileName"), "url": m.get("url") or m.get("Url")}
                    for m in mans
                ],
            }
        )
        print(f"\n## {path.stem} {data.get('title')} €{data.get('price')} {data.get('goods_no')}")
        print("pics", pics[:1])
        if mans:
            for m in mans:
                print(" MAN", m.get("FileName"), m.get("url") or m.get("Url"))
        else:
            print(" MAN none")
    (OUT.parent / "manual-index.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
