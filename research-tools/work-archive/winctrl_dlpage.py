import re
import urllib.request
from pathlib import Path

req = urllib.request.Request(
    "https://eu.winctrl.com/view/regular.html",
    headers={"User-Agent": "Mozilla/5.0"},
)
html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "replace")
out = Path(r"C:\Users\feiko\hotas-compare\work\winctrl-sweep\regular.html")
out.write_text(html, encoding="utf-8")
print("len", len(html))
scripts = re.findall(r'src="([^"]+)"', html)
print("scripts", scripts)
for pat in ["selectProduct", "download", "type_id", "typeId"]:
    if pat.lower() in html.lower():
        print("contains", pat)
