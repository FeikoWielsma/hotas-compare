import json, re
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(r"C:\Users\feiko\hotas-compare\work\hillclimb")
for p in sorted(OUT.glob("us-*.js")):
    obj = json.loads(p.read_text(encoding="utf-8"))
    print("=" * 80)
    print(p.name)
    print("TITLE", obj.get("title"))
    print("HANDLE", obj.get("handle"))
    print("VENDOR", obj.get("vendor"))
    variants = obj.get("variants") or []
    for v in variants:
        print("VAR", v.get("title"), "price_cents", v.get("price"), "sku", v.get("sku"), "available", v.get("available"))
    body = re.sub("<[^>]+>", "\n", obj.get("description") or "")
    body = re.sub(r"\n+", "\n", body)
    print(body[:4000])
