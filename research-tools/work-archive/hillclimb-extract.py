import re, sys
from pathlib import Path
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.skip:
            self.skip -= 1
        if tag in ("p", "li", "h1", "h2", "h3", "tr", "br", "div"):
            self.parts.append("\n")
    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)

def text_of(name):
    raw = (OUT / name).read_text(encoding="utf-8", errors="replace")
    p = TextExtractor()
    p.feed(raw)
    text = re.sub(r"[ \t]+", " ", "".join(p.parts))
    text = re.sub(r"\n{2,}", "\n", text)
    return text

for name in ["bravo.html", "bravo-lite.html", "alpha.html", "alpha-lite.html", "charlie.html", "foxtrot.html", "sierra.html", "flap-kit.html"]:
    text = text_of(name)
    print("=" * 20, name, "len", len(text))
    # print windows around keywords
    low = text.lower()
    for key in ["system compatibility", "dimension", "weight", "sensor", "hall", "usb", "material", "lever", "detent", "backlight", "led", "tension", "software"]:
        i = low.find(key)
        if i >= 0:
            print(f"\n-- {key} @ {i}")
            print(text[max(0,i-80):i+400].replace("\n", " | "))

print("=" * 20, "MFG ME109")
text = text_of("mfg-me109.html")
print(text[:6000])
print("=" * 20, "MFG DOWNLOADS links")
raw = (OUT / "mfg-downloads.html").read_text(encoding="utf-8", errors="replace")
for h in sorted(set(re.findall(r'href=\"([^\"]+)\"', raw))):
    if re.search(r"pdf|zip|download|manual|spec", h, re.I):
        print(h)
