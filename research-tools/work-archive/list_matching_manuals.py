import json, sys
sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('work/winctrl_manuals_list.json', encoding='utf-8'))
items = data.get("data", [])
print(f"Total manuals in database: {len(items)}")

targets = ['16', '18', 'orion', 'skywalker', 'icp', 'pfp', 'taurus', 'ursa', 'hornet', 'viper', 't2', 'j2']

seen = set()
for item in items:
    name = item.get("name", "")
    h = item.get("ipfs_hash", "")
    ver = item.get("version", "")
    lang = item.get("language_id", "")
    key = (name, h)
    if key in seen: continue
    seen.add(key)
    
    if any(t in name.lower() for t in targets):
        print(f"[{lang}] {name} (v{ver}) -> hash: {h}")
