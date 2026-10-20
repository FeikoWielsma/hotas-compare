"""Fetch /home/shop/get for selected WINCTRL goods and extract text."""
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parent / "winctrl-sweep" / "details"
OUT.mkdir(parents=True, exist_ok=True)

IDS = [
    335, 325, 6605, 306, 471, 338, 339, 377, 1685, 476, 1765,
    326, 307, 308, 5205, 5625, 5705, 5765, 333, 373, 334, 466,
    705, 551, 553, 552, 556, 555, 6245, 6265,
    2825, 2945, 2585, 2705, 1705, 1845, 543, 546,
    1385, 1965, 2005, 1985, 1665,
    845, 865, 550, 544, 945, 402, 412, 6625, 322, 965, 1005, 985,
    542, 323, 1065, 422, 1585, 1565, 1405, 2065, 1865, 1245, 1265, 2085,
    6485, 375, 385, 342, 725, 340, 369, 1805, 343, 324, 374, 332, 1785,
    3185, 3205, 3225, 381, 1405,
]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
            "language": "en",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def strip_html(html: str) -> str:
    html = re.sub(r"(?is)<script.*?>.*?</script>", " ", html)
    html = re.sub(r"(?is)<style.*?>.*?</style>", " ", html)
    html = re.sub(r"(?i)<br\s*/?>", "\n", html)
    html = re.sub(r"(?i)</p>", "\n", html)
    html = re.sub(r"(?i)</li>", "\n", html)
    html = re.sub(r"(?i)</tr>", "\n", html)
    html = re.sub(r"(?i)</h[1-6]>", "\n", html)
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def main() -> None:
    # also try download center categories
    for path in (
        "/home/download/selectProductDownload?id=1",
        "/home/download/getProductType",
        "/home/download/getType",
        "/home/download/selectType",
    ):
        try:
            body = fetch("https://eu.winctrl.com" + path)
            print("PROBE", path, body[:180])
        except Exception as e:
            print("PROBE FAIL", path, e)

    for gid in IDS:
        dest = OUT / f"{gid}.json"
        if dest.exists() and dest.stat().st_size > 200:
            print("skip", gid)
            continue
        url = "https://eu.winctrl.com/home/shop/get?" + urllib.parse.urlencode({"id": gid})
        try:
            raw = fetch(url)
        except Exception as e:
            print("FAIL", gid, e)
            continue
        dest.write_bytes(raw)
        try:
            payload = json.loads(raw)
        except Exception:
            print("BADJSON", gid, len(raw))
            continue
        data = (payload or {}).get("data") or {}
        if isinstance(data, list):
            print("LIST", gid, len(data))
            continue
        title = data.get("title")
        manuals = data.get("related_downloads") or data.get("manuals")
        content = data.get("content") or ""
        text = strip_html(content) if isinstance(content, str) else ""
        text_path = OUT / f"{gid}.txt"
        header = f"TITLE: {title}\nPRICE: {data.get('price')} {data.get('currency_unit')}\nGOODS: {data.get('goods_no')}\nSKU: {data.get('sku_id')}\n"
        # manuals compact
        man_txt = json.dumps(manuals, ensure_ascii=False)[:1500] if manuals else ""
        text_path.write_text(header + "MANUALS: " + man_txt + "\n\n" + text[:12000], encoding="utf-8")
        print(f"OK {gid} {title} content={len(content) if isinstance(content, str) else 0} text={len(text)}")


if __name__ == "__main__":
    main()
