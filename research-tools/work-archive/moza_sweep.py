import requests, re, json

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

def get_page(url):
    try:
        r = requests.get(url, headers=UA, timeout=30)
        return r.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

print("Fetching mozaracing.com/flight ...")
flight_html = get_page("https://mozaracing.com/flight")
links = set(re.findall(r'href=["\']([^"\']+)["\']', flight_html))
flight_links = sorted([l for l in links if any(k in l.lower() for k in ['product', 'page', 'flight', 'ab6', 'ab9', 'ay', 'mfy', 'mh', 'mr', 'mt', 'tq', 'z-axis'])])

print(f"Found {len(flight_links)} flight links:")
for l in flight_links:
    print("  ", l)

print("\nFetching flight-accessories ...")
acc_html = get_page("https://us.mozaracing.com/collections/flight-accessories")
links2 = set(re.findall(r'href=["\']([^"\']+)["\']', acc_html))
acc_links = sorted([l for l in links2 if '/products/' in l])
print(f"Found {len(acc_links)} accessory products:")
for l in acc_links:
    print("  ", l)

print("\nFetching support solutions ...")
supp_html = get_page("https://support.mozaracing.com/en/support/solutions")
supp_links = sorted(set(re.findall(r'href=["\']([^"\']+/solutions/(?:articles|folders)/[^"\']+)["\']', supp_html)))
print(f"Found {len(supp_links)} support links:")
for l in supp_links:
    print("  ", l)
