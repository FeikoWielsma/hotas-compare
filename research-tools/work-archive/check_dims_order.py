import yaml, glob

for f in glob.glob("src/content/components/**/*.yaml", recursive=True):
    data = yaml.safe_load(open(f, encoding="utf-8"))
    phys = data.get("physical") or {}
    dims = phys.get("dimensions_mm")
    if dims:
        print(f, dims)
        break
