import requests, re

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

url = "https://support.mozaracing.com/en/support/solutions/articles/70000666514-user-manual"
r = requests.get(url, headers=UA, timeout=30)
print(f"User manual article status: {r.status_code}, length: {len(r.text)}")

# Find all links in the article
links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r.text, re.DOTALL)
print(f"Found {len(links)} links:")
for href, text in links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if any(k in href.lower() or k in clean_text.lower() for k in ['pdf', 'flight', 'ab6', 'ab9', 'ay', 'mfy', 'mh', 'mr', 'mt', 'tq', 'z-axis', 'stick', 'yoke', 'pedal', 'throttle', 'manual']):
        print(f"  {clean_text} -> {href}")
