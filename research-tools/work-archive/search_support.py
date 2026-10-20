import requests, re

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

terms = ['ay90', 'mhg', 'tqa', 'tqb', 'mtlp', 'mrp', 'ab6', 'ab9', 'mtq', 'mtp', 'mfy', 'ay210', 'ampcd', 'fmp18', 'ma3f', 'mb7f', 'mgx1000', 'flight']

found_articles = {}

for term in terms:
    url = f"https://support.mozaracing.com/en/support/search/solutions?term={term}"
    r = requests.get(url, headers=UA, timeout=30)
    links = set(re.findall(r'href=["\'](/en/support/solutions/articles/[^"\']+)["\']', r.text))
    print(f"Search '{term}' found {len(links)} articles")
    for l in links:
        full = f"https://support.mozaracing.com{l}"
        found_articles[full] = term

print(f"\nTotal unique articles found via search: {len(found_articles)}")
for url in sorted(found_articles):
    print("  ", url)
