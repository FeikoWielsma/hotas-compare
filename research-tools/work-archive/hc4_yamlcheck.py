import sys, glob
sys.stdout.reconfigure(encoding='utf-8')
import yaml
bad = 0
for f in sorted(glob.glob('src/content/components/thrustmaster/*.yaml')):
    try:
        yaml.safe_load(open(f, encoding='utf-8'))
    except Exception as e:
        bad += 1; print('PARSE FAIL', f, e)
print('files parsed; failures =', bad)
