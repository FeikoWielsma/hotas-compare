import re, sys

sys.stdout.reconfigure(encoding='utf-8')

pages = ['ab6_bundle_us', 'ampcd_us', 'fmp18_us', 'ma3f_efcm_l_us', 'ma3f_efcm_r_us']

for p in pages:
    with open(f"work/product_pages/{p}.html", 'r', encoding='utf-8') as f:
        html = f.read()
    clean = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)
    lines = [l.strip() for l in re.findall(r'>([^<]+)<', clean) if l.strip()]
    print(f"\n==================== {p.upper()} ====================")
    title = re.search(r'<title>([^<]+)</title>', html)
    if title: print("Title:", title.group(1))
    # print price
    price = re.search(r'\$(\d+(?:\.\d+)?)', html)
    if price: print("Price USD:", price.group(0))
    # print relevant lines
    for l in lines[:100]:
        if any(k in l.lower() for k in ['bundle', 'display', 'screen', 'module', 'switch', 'button', 'spec', 'includes', 'in the box', 'overview', 'features', 'resolution', 'dimension', 'weight']):
            print("  ", l)
