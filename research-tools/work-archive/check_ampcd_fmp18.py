import re, sys

sys.stdout.reconfigure(encoding='utf-8')

for name in ['ampcd_us', 'fmp18_us']:
    with open(f"work/product_pages/{name}.html", 'r', encoding='utf-8') as f:
        html = f.read()
    print(f"\n==================== {name} ====================")
    # Find all image links
    imgs = set(re.findall(r'(?:src|data-src|srcset)=["\']([^"\']+\.(?:webp|png|jpg|jpeg)[^"\']*)["\']', html, re.I))
    for img in sorted(imgs):
        clean = img.split('?')[0]
        if any(k in clean.lower() for k in ['ampcd', 'fmp18', 'block', 'panel']):
            print("  IMG:", clean)
    # Find text in headings or paragraphs
    texts = re.findall(r'<(?:h[1-4]|p|li|td)[^>]*>(.*?)</(?:h[1-4]|p|li|td)>', html, re.DOTALL)
    for t in texts[:30]:
        c = re.sub(r'<[^>]+>', '', t).strip()
        if len(c) > 10 and not any(k in c.lower() for k in ['copyright', 'subscribe', 'cart', 'footer']):
            print("  TEXT:", c)
