import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz
# args: pdf page[,page...]
d = fitz.open(sys.argv[1])
for n in sys.argv[2].split(','):
    print(f'--- {sys.argv[1]} p{n}')
    print(' '.join(d[int(n)-1].get_text().split()))
