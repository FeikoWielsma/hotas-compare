import sys, glob, os
sys.stdout.reconfigure(encoding='utf-8')
import fitz
for f in sorted(glob.glob('*.pdf')):
    d = fitz.open(f)
    print(f, 'pages=', d.page_count)
    for i, p in enumerate(d):
        t = p.get_text().strip().replace('\n', ' | ')
        print('  p%d imgs=%d len=%d: %s' % (i+1, len(p.get_images()), len(t), t[:160]))
