import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz
for f in sys.argv[1:]:
    d = fitz.open(f)
    print(f, 'pages=', d.page_count)
    for i, p in enumerate(d):
        if i >= 12: break
        t = ' '.join(p.get_text().split())
        print('  p%d imgs=%d len=%d: %s' % (i+1, len(p.get_images()), len(t), t[:110]))
