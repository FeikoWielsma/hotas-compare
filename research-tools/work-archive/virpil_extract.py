import re
from pathlib import Path
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0
        self.skip_tags = {"script", "style", "noscript"}
    def handle_starttag(self, tag, attrs):
        if tag in self.skip_tags:
            self.skip += 1
    def handle_endtag(self, tag):
        if tag in self.skip_tags and self.skip:
            self.skip -= 1
        if tag in {"p", "div", "li", "tr", "h1", "h2", "h3", "br", "td"}:
            self.parts.append("\n")
    def handle_data(self, data):
        if self.skip:
            return
        text = data.strip()
        if text:
            self.parts.append(text + " ")

root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-text")
out.mkdir(exist_ok=True)

for p in sorted(root.glob("*.html")):
    raw = p.read_text(encoding="utf-8", errors="replace")
    pdfs = sorted(set(re.findall(r'https?://[^"\']+\.pdf', raw, re.I)))
    support = sorted(set(re.findall(r'https://support\.virpil\.com[^"\']+', raw)))
    skus = sorted(set(re.findall(r'VPC[- ][A-Z0-9-]+', raw)))
    parser = TextExtractor()
    parser.feed(raw)
    text = re.sub(r"[ \t]+", " ", "".join(parser.parts))
    text = re.sub(r"\n{2,}", "\n", text)
    # keep a window around likely spec content
    (out / (p.stem + ".txt")).write_text(text, encoding="utf-8")
    print("=" * 80)
    print(p.name, "chars", len(text), "pdfs", len(pdfs), "support", len(support))
    print("SKUS", skus[:12])
    print("PDFS", pdfs[:8])
    print("SUPPORT", support[:6])
