import sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
html = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb\mfg-base.html").read_text(encoding="utf-8", errors="replace")
for needle in ["495", "490mm", "490 mm", "reduced 5", "20 degree", "21°", "61", "52", "configurator", "Windows"]:
    i = html.find(needle)
    print("====", needle, i)
    if i >= 0:
        snippet = html[max(0, i-180):i+280]
        snippet = snippet.replace("\n", " ")
        print(snippet[:500])
