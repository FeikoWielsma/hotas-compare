import json

data = json.load(open('work/winctrl_list_get.json', encoding='utf-8'))
print("errno:", data.get("errno"))
d = data.get("data", {})
print("Categories:", len(d.get("category", [])))
for c in d.get("category", []):
    print("  Category:", c)
print("Products list count:", len(d.get("list", [])))
for p in d.get("list", [])[:15]:
    print("  Product:", p.get("id"), p.get("name"), p.get("model"))
