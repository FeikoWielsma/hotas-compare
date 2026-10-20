import urllib.request, re, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
for js_name in ['config.js', 'request.js']:
    try:
        url = f'https://eu.winctrl.com/view/js/{js_name}'
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            text = resp.read().decode('utf-8', errors='ignore')
            print(f"=== {js_name} ===")
            print(text[:1000])
    except Exception as e:
        print(f"Error {js_name}: {e}")
