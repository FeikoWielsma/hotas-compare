import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('work/moza_txt/ma3f_efcm.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split('--- PAGE ')
for p in pages[1:6]:
    print("=== PAGE ===")
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    for l in lines[:30]:
        print(" ", l)
