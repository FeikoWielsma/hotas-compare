import re
import sys
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.skip += 1
        if tag in {"p", "li", "br", "h1", "h2", "h3", "tr"}:
            self.parts.append("\n")
    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.skip:
            self.skip -= 1
    def handle_data(self, data):
        if self.skip:
            return
        t = re.sub(r"\s+", " ", data).strip()
        if t:
            self.parts.append(t + " ")

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}
urls = [
    "https://support.virpil.com/en/support/solutions/articles/47001258804-rotor-tcs-base-upgraded-user-manual",
    "https://support.virpil.com/en/support/solutions/articles/47001258794-rotor-plus-tcs-base-upgraded-user-manual",
    "https://support.virpil.com/en/support/solutions/articles/47001179891-vpc-sharka-50-collective-grip-user-manual",
    "https://support.virpil.com/en/support/solutions/articles/47001257030-vpc-apache-64-collective-grip",
    "https://support.virpil.com/en/support/solutions/articles/47001251614-apache-64-collective-grip-user-manuals",
    "https://support.virpil.com/en/support/solutions/articles/47001258795-control-panel-3-user-manual",
    "https://support.virpil.com/en/support/solutions/articles/47001264833-vpc-control-panel-3",
    "https://support.virpil.com/en/support/solutions/articles/47001270299-r1-falcon-rudder-pedals-user-manual",
    "https://support.virpil.com/en/support/solutions/articles/47001275883-cdt-aeromax-r-flightstick",
    "https://virpil-controls.eu/vpc-ace-torq-rudder-pedals.html",
    "https://virpil-controls.eu/vpc-mongoost-50cm3-throttle-b-stock.html",
    "https://virpil-controls.eu/catalogsearch/result/?q=sharka+control+panel",
    "https://virpil-controls.eu/catalogsearch/result/?q=p-jet",
]
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-manuals")
out.mkdir(exist_ok=True)
for url in urls:
    slug = url.rstrip("/").split("/")[-1][:90]
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
            path = out / f"{slug}.html"
            path.write_bytes(data)
            html = data.decode("utf-8", "replace")
            parser = TextExtractor()
            parser.feed(html)
            text = re.sub(r"\n{2,}", "\n", "".join(parser.parts))
            (out / f"{slug}.txt").write_text(text, encoding="utf-8")
            pdfs = re.findall(r"https?://[^\"']+\.pdf", html, re.I)
            print(f"OK {r.status} {len(data):7d} pdfs={len(pdfs)} {slug}")
            if pdfs:
                print(" ", pdfs[:3])
    except Exception as e:
        print("FAIL", slug, type(e).__name__, e)
    time.sleep(0.2)
