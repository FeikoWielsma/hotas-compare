import urllib.request, json, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'language': 'en'
}

payload = {"typeId": 4, "list": []}
req = urllib.request.Request('https://eu.winctrl.com/home/download/selectProductDownload', 
                             data=json.dumps(payload).encode('utf-8'), 
                             headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Success! Keys:", data.keys() if isinstance(data, dict) else len(data))
        with open('work/winctrl_manuals_list.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Manual count:", len(data.get("data", [])))
        for item in data.get("data", [])[:20]:
            print(" ", item.get("name"), "-->", item.get("url"))
except Exception as e:
    print("Error:", e)
