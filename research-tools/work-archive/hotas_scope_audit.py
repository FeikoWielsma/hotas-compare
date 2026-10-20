"""List physical-control and reference gaps in the requested catalog families."""
from pathlib import Path
import yaml

ROOT = Path('src/content')
FAMILIES = ('virpil', 'vkb', 'moza', 'slaw')
OPTIONAL = {
    'hat': ('ways', 'push'), 'analog_ministick': ('push',),
    'trigger': ('stages', 'action'), 'lever': ('analog', 'push'),
    'slider': ('analog', 'positions'), 'encoder': ('push',),
    'scroll_wheel': ('push',), 'rotary': ('mode', 'positions', 'push'),
    'toggle': ('ways', 'momentary', 'push'), 'rocker': ('analog', 'push'),
    'switch': ('positions', 'push', 'momentary'),
}

def main():
    components = {}
    for brand in FAMILIES:
        folder = ROOT / 'components' / brand
        for path in sorted(folder.glob('*.yaml')):
            d = yaml.safe_load(path.read_text(encoding='utf-8'))
            key = f'{brand}/{path.stem}'
            components[key] = d
            gaps = []
            if d.get('controls_evidence', {}).get('coverage') != 'complete':
                gaps.append('inventory=' + str(d.get('controls_evidence', {}).get('coverage', 'missing')))
            for i, c in enumerate(d.get('controls', [])):
                if c.get('type') in OPTIONAL:
                    for f in OPTIONAL[c['type']]:
                        if c.get(f) is None:
                            gaps.append(f"control[{i}] {c['type']}.{f}")
                elif c.get('type') in ('button', 'axis', 'detent'):
                    continue
                else:
                    gaps.append(f"control[{i}] generic/unrecognized type={c.get('type')}")
            axes = (d.get('hardware') or {}).get('axes') or []
            if not axes and (d.get('hardware') or {}).get('axis_count') is None:
                if d.get('category') not in ('grip', 'module'):
                    gaps.append('analog axis list/count missing')
            for p in ('pc', 'xbox', 'ps5'):
                if d.get('platform_compatibility', {}).get(p, 'unknown') == 'unknown':
                    gaps.append(f'platform.{p}=unknown')
            if d.get('verification') == 'draft':
                gaps.append('verification=draft')
            if gaps:
                print(f"COMPONENT {key}: " + '; '.join(gaps))
    for brand in FAMILIES:
        folder = ROOT / 'bundles' / brand
        for path in sorted(folder.glob('*.yaml')):
            d = yaml.safe_load(path.read_text(encoding='utf-8'))
            missing = [c for c in d.get('components', []) if c not in components]
            gaps = []
            if missing:
                gaps.append('unresolved components=' + ','.join(missing))
            for p in ('pc', 'xbox', 'ps5'):
                if d.get('platform_compatibility', {}).get(p, 'unknown') == 'unknown':
                    gaps.append(f'platform.{p}=unknown')
            if d.get('verification') == 'draft':
                gaps.append('verification=draft')
            if gaps:
                print(f"BUNDLE {brand}/{path.stem}: " + '; '.join(gaps))

if __name__ == '__main__':
    main()
