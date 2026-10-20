import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')

files = ['ay90', 'ab6', 'ab9', 'mhg', 'mtq', 'mtp', 'mfy_pro', 'mtlp', 'mrp']

for name in files:
    path = f"work/moza_txt/{name}.txt"
    if not os.path.exists(path):
        print(f"Missing {path}")
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"\n==================== {name.upper()} ====================")
    pages = content.split("--- PAGE ")
    for p in pages[1:10]:
        lines = [l.strip() for l in p.split('\n') if l.strip()]
        page_num = lines[0].split(' ---')[0] if lines else '?'
        text_preview = "\n  ".join(lines[1:30])
        print(f"--- Page {page_num} ---")
        print("  " + text_preview)
