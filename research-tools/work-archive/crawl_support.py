import requests, re

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

def get_page(url):
    try:
        r = requests.get(url, headers=UA, timeout=30)
        return r.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

html = get_page("https://support.mozaracing.com/en/support/solutions")
# find all solution folders or articles
folders = set(re.findall(r'href=["\'](/en/support/solutions/folders/\d+)["\']', html))
print(f"Found {len(folders)} folders")

flight_articles = []

for f in folders:
    url = f"https://support.mozaracing.com{f}"
    f_html = get_page(url)
    title = re.search(r'<title>([^<]+)</title>', f_html)
    t = title.group(1) if title else ""
    # find articles
    articles = re.findall(r'<a\s+href=["\'](/en/support/solutions/articles/\d+-[^"\']+)["\'][^>]*>([^<]+)</a>', f_html)
    if any(k in t.lower() or any(k in a[1].lower() for a in articles) for k in ['flight', 'ab6', 'ab9', 'ay', 'mfy', 'mh', 'mr', 'mt', 'tq', 'z-axis', 'stick', 'throttle', 'yoke', 'pedal', 'fcd', 'efcm', 'cdu', 'panel']):
        print(f"\nFolder {f}: {t}")
        for art_url, art_title in articles:
            print(f"  Article: {art_title.strip()} -> {art_url}")
            flight_articles.append((art_title.strip(), f"https://support.mozaracing.com{art_url}"))

print(f"\nTotal flight articles found: {len(flight_articles)}")
