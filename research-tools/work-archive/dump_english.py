import os, sys

sys.stdout.reconfigure(encoding='utf-8')

def print_manual(name, max_pages=8):
    path = f"work/moza_txt/{name}.txt"
    if not os.path.exists(path):
        print(f"Missing {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    pages = content.split("--- PAGE ")
    print(f"\n{'='*30} {name.upper()} ({len(pages)-1} pages total) {'='*30}")
    for p in pages[1:max_pages+1]:
        lines = [l.strip() for l in p.split('\n') if l.strip()]
        if not lines: continue
        page_num = lines[0].split(' ---')[0]
        # check if it looks like English
        text = "\n".join(lines[1:])
        print(f"\n--- Page {page_num} ---")
        print(text)

# Let's inspect ay90, ab6, ab9, mhg, mtq, mtp, mfy_pro, mtlp
for n in ['ay90', 'ab6', 'ab9', 'mhg', 'mtq', 'mtp', 'mfy_pro', 'mtlp']:
    print_manual(n, max_pages=7)
