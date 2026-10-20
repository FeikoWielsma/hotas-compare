import json

rows = json.loads(open('work/catalog-unknowns-after.json', encoding='utf-8').read())
for r in rows:
    if r['brand'] in ['logitech', 'winctrl'] and r['id'].startswith('components/'):
        print(f"{r['id']} ({r['name']}): {len(r['gaps'])} gaps -> {r['gaps']}")
