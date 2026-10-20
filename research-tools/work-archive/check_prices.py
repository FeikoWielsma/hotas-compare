import requests, json, re

UA = {'User-Agent': 'Mozilla/5.0'}
for r, u in [('US', 'https://us.mozaracing.com/products/ab6-bundle'), ('EU', 'https://eu.mozaracing.com/products/ab6-bundle'), ('UK', 'https://uk.mozaracing.com/products/ab6-bundle')]:
    res = requests.get(u, headers=UA)
    m = re.search(r'"price":\s*"?([0-9.]+)"?,\s*"priceCurrency":\s*"([A-Z]+)"', res.text)
    if m:
        print(r, m.group(1), m.group(2))
    else:
        print(r, "status:", res.status_code)
