import json

data = json.load(open('work/winctrl_manuals_list.json', encoding='utf-8'))
for item in data.get("data", []):
    # filter for products we care about
    name = item.get("name", "")
    for kw in ['16', '18', 'Orion', 'Skywalker', 'ICP', 'PFP', 'Taurus', 'Ursa']:
        if kw.lower() in name.lower():
            print(f"Name: {name} | Keys: {list(item.keys())}")
            # print all fields that have a path or link or id
            for k, v in item.items():
                if v and any(sub in str(v).lower() for sub in ['pdf', 'static', 'download', 'http', 'ipfs', 'url']):
                    print(f"   {k}: {v}")
            break
