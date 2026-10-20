import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image

src = Path(r"C:\Users\feiko\hotas-compare\work\virpil-mapimg\47001275883-_Y9aNaqTKtdC98VNVofR8glRaEwO0HYNJFw.jpg")
im = Image.open(src)
print("size", im.size)
w, h = im.size
out = Path(r"C:\Users\feiko\hotas-compare\work\virpil-mapimg")
# lower half and right side and left axis legend
crops = {
    "aero_low": (0, int(h * 0.55), w, h),
    "aero_left": (0, int(h * 0.15), int(w * 0.35), int(h * 0.7)),
    "aero_top": (int(w * 0.2), 0, int(w * 0.8), int(h * 0.4)),
}
for name, box in crops.items():
    im.crop(box).save(out / f"{name}.jpg", quality=90)
    print("wrote", name, box)

ucp = Path(r"C:\Users\feiko\hotas-compare\work\virpil-mapimg\47001264833-_u2PBFWTmFZEb-C-93pMxQZXd3a7YY57fqA.png")
im2 = Image.open(ucp)
print("ucp", im2.size)
w, h = im2.size
im2.crop((0, 0, w, int(h * 0.55))).save(out / "ucp_top.jpg", quality=85)
im2.crop((0, int(h * 0.45), w, h)).save(out / "ucp_bot.jpg", quality=85)
