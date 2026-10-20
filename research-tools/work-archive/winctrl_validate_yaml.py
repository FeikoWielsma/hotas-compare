import yaml
from pathlib import Path

root = Path(r"C:\Users\feiko\hotas-compare")
missing = []
count = 0
for folder in (
    root / "src/content/components/winctrl",
    root / "src/content/bundles/winctrl",
):
    for path in folder.glob("*.yaml"):
        count += 1
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        for image in data.get("images") or []:
            file = root / "public" / image["file"].lstrip("/")
            if not file.exists():
                missing.append(f"{path.name}: {image['file']}")
print("yaml", count)
print("missing", missing or "none")
