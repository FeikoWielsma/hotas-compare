"""Fetch WINCTRL/WINWING store catalogs and download indexes."""
import json
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parent / "winctrl-sweep"
OUT.mkdir(exist_ok=True)

HOSTS = [
    "https://eu.winctrl.com",
    "https://us.winctrl.com",
    "https://eu.winwingsim.com",
    "https://us.winwingsim.com",
    "https://winwingsim.com",
]
PATHS = [
    "/home/list/get",
    "/home/masterCategory/getMasterAll",
    "/home/download/getManual",
    "/home/download/selectProductDownload",
    "/home/download/getList",
]


def fetch(url: str) -> tuple[int, bytes, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json,text/plain,*/*",
            "language": "en",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read()
            return r.status, body, r.headers.get("Content-Type", "")
    except Exception as e:
        code = int(getattr(e, "code", 0) or 0)
        try:
            body = e.read()
        except Exception:
            body = str(e).encode()
        return code, body, str(e)


def main() -> None:
    for host in HOSTS:
        for path in PATHS:
            url = host + path
            status, body, ctype = fetch(url)
            name = host.replace("https://", "").replace(".", "_") + path.replace("/", "_") + ".json"
            path_out = OUT / name
            path_out.write_bytes(body)
            preview = body[:120].decode("utf-8", "replace").replace("\n", " ")
            print(f"{status:4} {len(body):8} {url} :: {preview[:100]}")


if __name__ == "__main__":
    main()
