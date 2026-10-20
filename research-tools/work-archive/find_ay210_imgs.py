import re

with open('work/product_pages/ay210_us.html', 'r', encoding='utf-8') as f:
    html = f.read()

imgs = set(re.findall(r'(?:src|data-src|srcset)=["\']([^"\']+\.(?:webp|png|jpg|jpeg)[^"\']*)["\']', html, re.I))
for img in sorted(imgs):
    clean = img.split('?')[0]
    if any(k in clean.lower() for k in ['ay210', 'products', 'yoke']):
        print(clean)
