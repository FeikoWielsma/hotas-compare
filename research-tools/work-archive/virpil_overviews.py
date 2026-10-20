import re
from pathlib import Path
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.skip += 1
        if tag in {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "br", "td"}:
            self.parts.append("\n")
    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.skip:
            self.skip -= 1
        if tag in {"p", "li", "tr", "h1", "h2", "h3", "h4"}:
            self.parts.append("\n")
    def handle_data(self, data):
        if self.skip:
            return
        text = re.sub(r"\s+", " ", data).strip()
        if text:
            self.parts.append(text + " ")

def extract_div(html, class_name):
    marker = f'class="{class_name}"'
    i = html.find(marker)
    if i < 0:
        return ""
    # start at the div
    start = html.rfind("<div", 0, i)
    # naive depth walk
    depth = 0
    j = start
    while j < len(html):
        open_i = html.find("<div", j)
        close_i = html.find("</div>", j)
        if close_i < 0:
            break
        if open_i != -1 and open_i < close_i:
            depth += 1
            j = open_i + 4
        else:
            depth -= 1
            j = close_i + 6
            if depth == 0:
                return html[start:j]
    return html[start:start+20000]

root = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-overviews")
out.mkdir(exist_ok=True)

for p in sorted(root.glob("*.html")):
    if p.name.startswith("4700") or p.name.startswith("ext-"):
        continue
    html = p.read_text(encoding="utf-8", errors="replace")
    chunks = []
    for cls in ("product attribute overview", "product attribute description"):
        block = extract_div(html, cls)
        if not block:
            continue
        parser = TextExtractor()
        parser.feed(block)
        text = "".join(parser.parts)
        text = re.sub(r"\n{2,}", "\n", text).strip()
        chunks.append(f"## {cls}\n{text}")
    # additional attributes table rows
    attrs = re.findall(r'class="col label"[^>]*>\s*([^<]+)</th>\s*<td class="col data"[^>]*>(.*?)</td>', html, re.S)
    if attrs:
        lines = []
        for k, v in attrs:
            v = re.sub(r"<[^>]+>", " ", v)
            v = re.sub(r"\s+", " ", v).strip()
            lines.append(f"{k.strip()}: {v}")
        chunks.append("## attributes\n" + "\n".join(lines))
    title = re.search(r'<span class="base"[^>]*>(.*?)</span>', html, re.S)
    price = re.search(r'data-price-amount="([0-9.]+)"', html)
    header = f"# {title.group(1).strip() if title else p.name}\nprice={price.group(1) if price else '?'}\nfile={p.name}\n"
    body = header + "\n\n".join(chunks)
    (out / (p.stem + ".txt")).write_text(body, encoding="utf-8")
    print(p.name, "overview_chars", len(body))
