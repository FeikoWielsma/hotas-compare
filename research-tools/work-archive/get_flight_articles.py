import requests, re

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

folders = [
    '70000488149', # Control Panel
    '70000488147', # Flightsticks & Yokes
    '70000487296', # Flight Bases
    '70000489915', # Rudder Pedals
    '70000488148', # Throttle Panels
]

all_articles = {}

for f in folders:
    url = f"https://support.mozaracing.com/en/support/solutions/folders/{f}"
    r = requests.get(url, headers=UA, timeout=30)
    links = set(re.findall(r'href=["\'](/en/support/solutions/articles/[^"\']+)["\']', r.text))
    print(f"\nFolder {f} has {len(links)} article links:")
    for l in sorted(links):
        full_url = f"https://support.mozaracing.com{l}"
        all_articles[l] = full_url
        print("  ", full_url)

with open('work/moza_support_articles.txt', 'w', encoding='utf-8') as out:
    for k, v in sorted(all_articles.items()):
        out.write(f"{v}\n")
