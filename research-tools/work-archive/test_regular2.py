import urllib.request, re, sys
sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request('https://eu.winctrl.com/view/regular.html', headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# look for api urls or ajax calls in script tags
for s in re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL):
    for line in s.splitlines():
        if any(k in line.lower() for k in ['http', 'api', 'url', 'get', 'post', 'ajax', 'fetch']):
            print("LINE:", line.strip())

for link in re.findall(r'src=["\']([^"\']+\.js)["\']', html):
    print("JS:", link)
