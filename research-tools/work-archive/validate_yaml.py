import glob, yaml, sys

sys.stdout.reconfigure(encoding='utf-8')

errors = 0
files = glob.glob('src/content/components/moza/*.yaml') + glob.glob('src/content/bundles/moza/*.yaml')
print(f"Validating {len(files)} MOZA YAML files...")

for f in sorted(files):
    try:
        with open(f, 'r', encoding='utf-8') as yf:
            data = yaml.safe_load(yf)
            assert isinstance(data, dict), "Root must be a dictionary"
            assert 'brand' in data, "Must have brand"
            assert 'name' in data, "Must have name"
            print(f"  OK: {f}")
    except Exception as e:
        print(f"  ERROR in {f}: {e}")
        errors += 1

print(f"\nTotal errors: {errors}")
if errors > 0:
    sys.exit(1)
