import sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
html = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb\mfg-base.html").read_text(encoding="utf-8", errors="replace")
low = html.lower()
for pat in ["usb", "cam", "490", "cable", "hall", "width"]:
    print(pat, low.count(pat))
i = html.find("USB")
print("--- USB context", i)
if i >= 0:
    print(html[max(0, i-300):i+500])
i = html.find("CAM")
print("--- CAM context", i)
if i >= 0:
    print(html[max(0, i-200):i+400])
i = low.find("490")
print("--- 490", i)
if i >= 0:
    print(html[max(0, i-200):i+200])
