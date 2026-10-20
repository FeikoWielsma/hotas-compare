import requests, re, json
from urllib.parse import urljoin

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

def get_page(url):
    try:
        r = requests.get(url, headers=UA, timeout=30)
        return r.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

for p in ["https://mozaracing.com/collections/flight-series", "https://mozaracing.com/collections/flight-series?page=2"]:
    print(f"\n--- {p} ---")
    html = get_page(p)
    products = sorted(set(re.findall(r'href=["\'](/products/[^"\']+)["\']', html)))
    for prod in products:
        print("  ", prod)

print("\n--- HMA150 ---")
hma_html = get_page("https://mozaracing.com/pages/hma150")
print("HMA150 length:", len(hma_html))
# Find title or description
title = re.search(r'<title>([^<]+)</title>', hma_html)
if title:
    print("Title:", title.group(1))
h1 = re.findall(r'<h[1-3][^>]*>([^<]+)</h[1-3]>', hma_html)
print("Headers:", h1[:10])
