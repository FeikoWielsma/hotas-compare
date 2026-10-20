import urllib.request, re

urls = [
    'https://winctrl.com/view/regular.html',
    'https://cn.winctrl.com/view/regular.html',
    'https://eu.winctrl.com/view/regular.html'
]
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"=== {url} (len {len(html)}) ===")
            # find all static/download links or manual titles
            for m in re.finditer(r'static/download/([^"\'\s>]+)', html):
                print("  download link:", m.group(0)[:120])
            for m in re.finditer(r'([^"\'<>\n]+\.pdf)', html):
                print("  pdf:", m.group(0)[:100])
    except Exception as e:
        print(f"Error {url}: {e}")
