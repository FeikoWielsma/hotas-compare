import re
from pathlib import Path

def slice_around(path, needles, window=800):
    html = Path(path).read_text(encoding="utf-8", errors="replace")
    # strip tags lightly for context
    text = re.sub(r"<style[\s\S]*?</style>", " ", html)
    text = re.sub(r"<script[\s\S]*?</script>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    print("\n====", Path(path).name, "len", len(text))
    for n in needles:
        i = text.find(n)
        print("---", n, "idx", i)
        if i >= 0:
            print(text[max(0, i-200): i+window])

base = Path(r"C:\Users\feiko\hotas-compare\work\virpil-pages")
slice_around(base / "vpc-dual-sf-collective-grip.html.html", ["Input Type", "Single Stage Trigger", "COMPLETE CONTROL SET"])
slice_around(base / "vpc-universal-control-panel-3.html.html", ["UNIVERSAL CONTROL PANEL # 3 INPUTS", "Axis Levers", "Tactile Switches"])
slice_around(base / "cdt-aeromax-r-flightstick.html.html", ["grip", "button", "hat", "trigger", "AEROMAX"])
