import urllib.request, re, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request('https://eu.winctrl.com/view/regular.html', headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Find where selectProductDownload is called
pos = html.find('selectProductDownload')
if pos != -1:
    print(html[pos-200:pos+500])
else:
    print("Not in regular.html")
