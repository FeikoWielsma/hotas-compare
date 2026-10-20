import requests, re
from PIL import Image
from io import BytesIO

UA = {'User-Agent': 'Mozilla/5.0'}
r = requests.get('https://us.mozaracing.com/products/ab6-bundle', headers=UA)
imgs = set(re.findall(r'(?:src|data-src|srcset)=["\']([^"\']+\.(?:webp|png|jpg|jpeg)[^"\']*)["\']', r.text, re.I))
for img in sorted(imgs):
    clean = img.split('?')[0]
    if 'ab6' in clean.lower() or 'bundle' in clean.lower():
        print(clean)
        # Download and test
        full_url = f"https:{clean}" if clean.startswith('//') else clean
        try:
            res = requests.get(full_url, headers=UA)
            im = Image.open(BytesIO(res.content))
            print("  Downloaded:", im.size, im.format)
            if im.size[0] >= 800 and not clean.endswith('Mobile.png'):
                im.save('public/images/moza/ab6-flight-simulator-bundle.webp', 'WEBP', quality=90)
                print("  Saved public/images/moza/ab6-flight-simulator-bundle.webp!")
                break
        except Exception as e:
            print("  Error:", e)
