import sys, re
from pathlib import Path
import urllib.request
sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
urls = {
    "fs2": "https://de.turtlebeach.com/products/velocity-one-flight-stick-ii",
    "dt": "https://de.turtlebeach.com/products/velocity-one-dual-throttle",
    "fd": "https://de.turtlebeach.com/products/velocity-one-flight-deck",
}
for name, url in urls.items():
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            text = r.read().decode("utf-8", "replace")
            print("OK", name, r.status, r.geturl(), len(text))
    except Exception as e:
        print("FAIL", name, type(e).__name__, e)
        continue
    prices = sorted(set(re.findall(r"(?:€|£|\$)\s?\d+[.,]\d{2}", text)))
    aria = re.findall(r'aria-label="([^"]*price[^"]*|€[^"]+|\d+[.,]\d{2})"', text)
    testid = re.findall(r'data-testid="price"[^>]*aria-label="([^"]+)"', text)
    print("  prices", prices[:15])
    print("  testid", testid[:4])
    i = text.lower().find("mwst")
    j = text.lower().find("vat")
    print("  mwst", text[i-30:i+60].replace("\n"," ") if i>=0 else None)
    print("  vat", text[j-30:j+60].replace("\n"," ") if j>=0 else None)
