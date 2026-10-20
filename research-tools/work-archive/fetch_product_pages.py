import os, requests

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

urls = {
    'tqa_us': 'https://us.mozaracing.com/products/tqa-mod',
    'tqb_us': 'https://us.mozaracing.com/products/tqb-mod',
    'ab6_bundle_us': 'https://us.mozaracing.com/products/ab6-bundle',
    'ab6_bundle_eu': 'https://eu.mozaracing.com/products/ab6-bundle',
    'ampcd_us': 'https://us.mozaracing.com/products/ampcd',
    'fmp18_us': 'https://us.mozaracing.com/products/fmp18',
    'ma3f_efcm_l_us': 'https://us.mozaracing.com/products/ma3f-efcm-l',
    'ma3f_efcm_r_us': 'https://us.mozaracing.com/products/ma3f-efcm-r',
    'ay210_us': 'https://us.mozaracing.com/products/ay210-yoke-base',
}

os.makedirs('work/product_pages', exist_ok=True)

for name, url in urls.items():
    try:
        r = requests.get(url, headers=UA, timeout=30)
        with open(f"work/product_pages/{name}.html", 'w', encoding='utf-8') as f:
            f.write(r.text)
        print(f"Fetched {name}: status {r.status_code}, len {len(r.text)}")
    except Exception as e:
        print(f"Error {name}: {e}")
