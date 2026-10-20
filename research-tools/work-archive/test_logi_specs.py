import urllib.request, re, json

urls = {
    'x56': 'https://www.logitechg.com/en-us/shop/p/x56-space-flight-vr-simulator-controller',
    'x52pro': 'https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-system',
    'x52': 'https://www.logitechg.com/en-us/shop/p/x52-space-flight-system',
    'pedals': 'https://www.logitechg.com/en-us/shop/p/flight-simulator-rudder-pedals.945-000024',
    'yoke': 'https://www.logitechg.com/en-us/shop/p/flight-simulator-yoke-system.945-000023',
    'quadrant': 'https://www.logitechg.com/en-us/shop/p/flight-simulator-throttle-quadrant.945-000032',
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Look for script tag or state with specs
            matches = re.findall(r'(\b(?:Length|Width|Height|Weight|Physical Specifications)\b[^\<\>]{0,100})', html, re.IGNORECASE)
            print(f"=== {name} (length {len(html)}) ===")
            # Check if there is JSON-LD or Next.js / Nuxt / AEM state
            scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
            found_spec = False
            for s in scripts:
                if 'specifications' in s.lower() or 'weight' in s.lower():
                    # check for dimensions
                    for line in s.splitlines():
                        if any(k in line.lower() for k in ['length', 'width', 'height', 'weight_g', 'dimension']):
                            print("  script line:", line.strip()[:150])
                            found_spec = True
                            break
                    if found_spec: break
            if not found_spec:
                print("  No spec in script tags, checking matches:")
                for m in matches[:5]:
                    print("   ", m.strip())
    except Exception as e:
        print(f"=== {name} ERROR: {e} ===")
