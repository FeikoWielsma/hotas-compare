import urllib.request, json, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'language': 'en'
}

req = urllib.request.Request('https://eu.winctrl.com/home/list/get', headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        with open('work/winctrl_list_get.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Success! Saved to work/winctrl_list_get.json")
except Exception as e:
    print("Error:", e)
