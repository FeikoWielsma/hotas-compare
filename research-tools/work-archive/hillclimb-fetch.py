import sys, re, json
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
import urllib.request

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")
OUT.mkdir(parents=True, exist_ok=True)

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/json"})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
        print("URL", url, "STATUS", r.status, "CT", r.headers.get("content-type"), "LEN", len(data))
        return data

def save(name, data, text=True):
    p = OUT / name
    if text:
        p.write_text(data if isinstance(data, str) else data.decode("utf-8", "replace"), encoding="utf-8")
    else:
        p.write_bytes(data if isinstance(data, bytes) else data.encode())
    print("SAVED", p, "bytes", p.stat().st_size)

html = get("https://flyhoneycomb.com/pages/downloads").decode("utf-8", "replace")
save("honeycomb-downloads.html", html)
hrefs = sorted(set(re.findall(r'href="([^"]+)"', html)))
print("--- HREFS", len(hrefs))
for h in hrefs:
    low = h.lower()
    if any(x in low for x in ["pdf", "download", "cdn", "file", "mapping", "manual", "input"]):
        print(h)
