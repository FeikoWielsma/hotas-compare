import yaml, pathlib, sys
sys.stdout.reconfigure(encoding="utf-8")
root = pathlib.Path(r"src/content/components/thrustmaster")
for p in sorted(root.glob("*.yaml")):
    data = yaml.safe_load(p.read_text(encoding="utf-8"))
    ev = data.get("controls_evidence") or {}
    cov = ev.get("coverage", "MISSING")
    ctrls = data.get("controls") or []
    imgs = data.get("images") or []
    print(f"=== {p.name} | {data.get('category')} | coverage={cov} | images={len(imgs)} | n={len(ctrls)}")
    for i, c in enumerate(ctrls):
        keys = []
        for k in ("type", "count", "kind", "ways", "mode", "positions", "analog", "label"):
            if k in c and c[k] is not None:
                keys.append(f"{k}={c[k]}")
        print(f"  [{i}] " + ", ".join(keys))
    if ev.get("notes"):
        print("  NOTE:", str(ev["notes"])[:300].replace("\n", " "))
    for img in imgs:
        print("  IMG:", img.get("file"))
