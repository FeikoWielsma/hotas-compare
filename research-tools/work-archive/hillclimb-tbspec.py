import re, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")

def text(name):
    raw = (OUT / name).read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"<script[\s\S]*?</script>", " ", raw)
    t = re.sub(r"<style[\s\S]*?</style>", " ", t)
    t = re.sub(r"<[^>]+>", "\n", t)
    t = re.sub(r"&amp;", "&", t)
    t = re.sub(r"&#39;", "'", t)
    t = re.sub(r"&nbsp;", " ", t)
    t = re.sub(r"\n+", "\n", t)
    return t

for name in ["tb-uk-rudder.html", "tb-uk-yoke.html", "tb-uk-fd.html", "tb-uk-fs2.html", "tb-uk-dt.html", "tb-uk-fs1.html"]:
    t = text(name)
    print("=" * 20, name)
    low = t.lower()
    for key in ["technical specifications", "weight", "dimension", "compatibility", "connections", "hall"]:
        i = low.find(key)
        print("--", key, i)
        if i >= 0:
            print(t[i:i+900].replace("\n", " | "))
            print()
