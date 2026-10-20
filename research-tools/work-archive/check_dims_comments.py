import yaml, glob

for f in glob.glob("src/content/**/*.yaml", recursive=True):
    txt = open(f, encoding="utf-8").read()
    if "dimensions_mm:" in txt:
        for line in txt.splitlines():
            if "dimensions" in line or "width" in line.lower() or "height" in line.lower() or "depth" in line.lower():
                print(f.replace("\\", "/"), ":", line.strip())
