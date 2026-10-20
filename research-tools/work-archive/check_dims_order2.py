import yaml, glob

count = 0
for f in glob.glob("src/content/components/**/*.yaml", recursive=True):
    content = open(f, encoding="utf-8").read()
    if "dimensions_mm:" in content:
        lines = [line.strip() for line in content.splitlines() if "dimensions_mm:" in line or "weight_g:" in line]
        print(f.replace("\\", "/"), lines)
        count += 1
        if count >= 10: break
