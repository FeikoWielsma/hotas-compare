import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\feiko\hotas-compare")
detail = json.loads((ROOT / "work/winctrl-sweep/details/342.json").read_text(encoding="utf-8"))["data"]
pics = detail.get("pics") or []
print("pics", pics[:3])
path = pics[0]
url = "https://eu.winctrl.com" + urllib.parse.quote(path)
print(url)
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
data = urllib.request.urlopen(req, timeout=60).read()
print("bytes", len(data), data[:8])
ext = ".jpg"
if data[:8].startswith(b"\x89PNG"):
    ext = ".png"
elif data[:4] == b"RIFF":
    ext = ".webp"
out = ROOT / f"public/images/winctrl/orion-2-viperace-ex-throttle{ext}"
out.write_bytes(data)
yaml_path = ROOT / "src/content/bundles/winctrl/orion-2-viperace-ex-throttle.yaml"
text = yaml_path.read_text(encoding="utf-8")
if "images:" not in text:
    text = text.rstrip() + f"""
images:
- file: /images/winctrl/orion-2-viperace-ex-throttle{ext}
  source: https://eu.winctrl.com/view/goods-details.html?id=342
  caption: Orion 2 ViperAce EX Throttle
"""
    yaml_path.write_text(text, encoding="utf-8")
    print("yaml patched")
else:
    print("yaml already has images")
