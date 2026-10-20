import yaml, glob
gimbals = set()
for f in glob.glob("src/content/**/*.yaml", recursive=True):
    data = yaml.safe_load(open(f, encoding="utf-8"))
    hw = data.get("hardware") or {}
    g = hw.get("gimbal")
    if g is not None:
        gimbals.add(str(g))
print("Gimbals found:", sorted(gimbals))
