"""Sweep WINCTRL storefronts and download center. Temporary research helper."""
import json
import re
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*",
}

OUT = Path(__file__).resolve().parent / "winctrl-sweep"


def fetch(url: str, data: bytes | None = None, headers: dict | None = None) -> tuple[int, str, dict]:
    h = dict(UA)
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            body = r.read()
            ctype = r.headers.get("Content-Type", "")
            text = body.decode("utf-8", "replace")
            return r.status, text, {"ctype": ctype, "len": len(body)}
    except Exception as e:
        if hasattr(e, "code"):
            try:
                body = e.read().decode("utf-8", "replace")
            except Exception:
                body = str(e)
            return int(getattr(e, "code", 0) or 0), body[:2000], {"error": str(e)}
        return 0, str(e), {"error": str(e)}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    url = "https://eu.winctrl.com/view/shopping.html"
    status, html, meta = fetch(url)
    print("shopping", status, meta)
    (OUT / "shopping.html").write_text(html, encoding="utf-8")
    scripts = re.findall(r'src=["\']([^"\']+)["\']', html)
    print("scripts", len(scripts))
    for s in scripts:
        print(" ", s)
    # look for api-ish strings
    hits = set(re.findall(r"/home/[A-Za-z0-9_./?-]+", html))
    hits |= set(re.findall(r"/api/[A-Za-z0-9_./?-]+", html))
    print("inline hits", len(hits))
    for h in sorted(hits)[:80]:
        print(" ", h)


if __name__ == "__main__":
    main()
