import json, sys
sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('work/winctrl_manuals_list.json', encoding='utf-8'))
for item in data.get("data", []):
    name = item.get("name", "")
    if any(k in name.lower() for k in ['rudder', 'pedal', 'skywalker', 'foot']):
        print(item.get("name"), "->", item.get("ipfs_hash"))
