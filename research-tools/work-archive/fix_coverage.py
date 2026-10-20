import glob

for f in glob.glob('src/content/components/moza/*.yaml'):
    with open(f, 'r', encoding='utf-8') as yf:
        c = yf.read()
    if 'coverage: full' in c:
        c = c.replace('coverage: full', 'coverage: complete')
        with open(f, 'w', encoding='utf-8') as yf:
            yf.write(c)
        print(f"Fixed {f}")
