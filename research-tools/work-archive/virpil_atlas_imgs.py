import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
for name in ["atlas-ffb-base.html.html", "atlas-pro-ffb-base.html.html"]:
    html = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages") .joinpath(name).read_text(encoding="utf-8", errors="replace")
    urls = sorted(set(re.findall(r"https://virpil-controls\.eu/media/(?:catalog/product|wysiwyg)[^\"']+\.(?:jpg|png|webp)", html)))
    print("\n", name)
    for u in urls:
        if "logo" in u or "icon" in u:
            continue
        print(u.split("virpil-controls.eu/media/")[-1][:140])
