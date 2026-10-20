import yaml, glob

for f in sorted(glob.glob("src/content/components/winctrl/*.yaml")):
    data = yaml.safe_load(open(f, encoding="utf-8"))
    sources = data.get("sources", [])
    ev_source = (data.get("controls_evidence") or {}).get("source")
    print(f"=== {data['name']} ({f}) ===")
    print("  category:", data.get("category"))
    print("  controls_evidence:", ev_source)
    print("  sources:", sources)
