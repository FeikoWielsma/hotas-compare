import urllib.request, re, sys
sys.stdout.reconfigure(encoding='utf-8')

req = urllib.request.Request('https://eu.winctrl.com/view/regular.html', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

for m in re.finditer(r'commodityByDatas\s*[:=]\s*([^\n;]+)', html):
    print("commodityByDatas:", m.group(0))
