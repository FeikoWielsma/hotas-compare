import re, sys

sys.stdout.reconfigure(encoding='utf-8')

for name in ['tqa_us', 'tqb_us']:
    with open(f"work/product_pages/{name}.html", 'r', encoding='utf-8') as f:
        html = f.read()
    clean = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)
    lines = [l.strip() for l in re.findall(r'>([^<]+)<', clean) if l.strip()]
    print(f"\n==================== {name} ====================")
    for i, l in enumerate(lines):
        if any(k in l.lower() for k in ['lever', 'button', 'thrust', 'reverse', 'tqa', 'tqb', 'detent', 'airbus', 'boeing', 'tqf', 'specs', 'features']):
            print(f"  {l}")
