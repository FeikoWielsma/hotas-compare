import re, json, sys

sys.stdout.reconfigure(encoding='utf-8')

pages = ['ab6_bundle_us', 'ampcd_us', 'fmp18_us', 'ma3f_efcm_l_us', 'ma3f_efcm_r_us']

for p in pages:
    with open(f"work/product_pages/{p}.html", 'r', encoding='utf-8') as f:
        html = f.read()
    
    print(f"\n==================== {p.upper()} ====================")
    # Search for json-ld
    json_lds = re.findall(r'<script\s+type="application/ld\+json">({.*?})</script>', html, re.DOTALL)
    for j in json_lds:
        try:
            data = json.loads(j)
            if data.get('@type') == 'Product':
                print("Name:", data.get('name'))
                print("Description:", data.get('description')[:300] if data.get('description') else '')
                offers = data.get('offers')
                if isinstance(offers, list):
                    for o in offers:
                        print("Offer:", o.get('price'), o.get('priceCurrency'))
                elif isinstance(offers, dict):
                    print("Offer:", offers.get('price'), offers.get('priceCurrency'))
        except Exception as e:
            pass

    # Search for descriptions / content in product details
    desc = re.findall(r'<div[^>]*class="[^"]*(?:product__description|product-description|rte)[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
    if desc:
        clean_desc = re.sub(r'<[^>]+>', ' ', desc[0]).strip()
        print("Product Description:", clean_desc[:400])
