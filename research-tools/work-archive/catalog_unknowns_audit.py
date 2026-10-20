"""Task-local audit of unresolved facts; never edits product data."""
from collections import Counter
from pathlib import Path
import json
import yaml

CONTROL_FIELDS = {
    'hat': ['ways', 'push'], 'analog_ministick': ['push'], 'button': ['backlit'],
    'trigger': ['stages', 'action'], 'lever': ['analog', 'push'],
    'slider': ['analog', 'positions', 'center_detent'], 'encoder': ['push'],
    'scroll_wheel': ['push'], 'rotary': ['mode', 'positions', 'push'],
    'toggle': ['ways', 'momentary', 'push'], 'rocker': ['analog', 'push'],
    'detent': ['customizable'], 'switch': ['positions', 'push', 'momentary'],
}

def collect():
    rows = []
    for kind in ['components', 'bundles']:
        for path in sorted(Path('src/content', kind).rglob('*.yaml')):
            data = yaml.safe_load(path.read_text(encoding='utf-8'))
            gaps = []
            for platform in ['pc', 'xbox', 'ps5']:
                if data.get('platform_compatibility', {}).get(platform, 'unknown') == 'unknown':
                    gaps.append('platform.' + platform)
            if kind == 'components':
                if data.get('controls_evidence', {}).get('coverage') != 'complete':
                    gaps.append('controls.inventory')
                for i, control in enumerate(data.get('controls', [])):
                    for field in CONTROL_FIELDS.get(control['type'], []):
                        if control.get(field) is None:
                            gaps.append(f'controls[{i}].{field}')
                    if not control.get('location') and data['category'] not in ['base', 'grip']:
                        gaps.append(f'controls[{i}].location')
                hardware = data.get('hardware') or {}
                for field in ['sensor', 'gimbal', 'force_adjustable', 'cams_swappable', 'damping', 'extension_support', 'throw_deg']:
                    if hardware.get(field) is None:
                        gaps.append('hardware.' + field)
                if not hardware.get('axes') and hardware.get('axis_count') is None:
                    gaps.append('hardware.axes')
                for field in ['weight_g', 'dimensions_mm', 'materials']:
                    if not (data.get('physical') or {}).get(field):
                        gaps.append('physical.' + field)
                if not data.get('connectivity', {}).get('usb'):
                    gaps.append('connectivity.usb')
                if data.get('connectivity', {}).get('standalone_usb') is None:
                    gaps.append('connectivity.standalone_usb')
                if not data.get('software'):
                    gaps.append('software')
            regions = {price['region'] for price in data.get('prices', [])}
            for region in ['EU', 'UK', 'US']:
                if region not in regions:
                    gaps.append('prices.' + region)
            rows.append(dict(id=kind + '/' + path.relative_to(Path('src/content', kind)).as_posix(),
                             brand=data['brand'], name=data['name'], category=data['category'], gaps=gaps))
    return rows

def counts(rows):
    result = Counter()
    for row in rows:
        for field in row['gaps']:
            if field.startswith('controls['): key = 'Control behavior/location properties'
            elif field.startswith('platform.'): key = 'Platform compatibility fields'
            elif field.startswith('hardware.'): key = 'Hardware specification fields'
            elif field.startswith('physical.'): key = 'Physical specification fields'
            elif field.startswith('prices.'): key = 'Regional price gaps'
            else: key = field
            result[key] += 1
    return result

if __name__ == '__main__':
    rows = collect()
    Path('work/catalog-unknowns-after.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
    before = json.loads(Path('work/catalog-unknowns-before.json').read_text(encoding='utf-8'))
    # Backfill this newly audited field from the original saved YAML, not today's files.
    saved = json.loads(Path('work/catalog-values-before-unknown-research.json').read_text(encoding='utf-8'))
    for row in before:
        key = ('src/content/' + row['id']).replace('/', '\\')
        if row['id'].startswith('components/') and saved.get(key, {}).get('connectivity', {}).get('standalone_usb') is None:
            row['gaps'].append('connectivity.standalone_usb')
    old, new = counts(before), counts(rows)
    print(json.dumps(dict(before=old, after=new), indent=2))
    lines = ['# Remaining catalog unknowns', '', 'Audited 2026-10-20 against the saved YAML; this report includes both unpublished facts and fields that may be inapplicable. Missing values have not been replaced with guesses. Complete inventory coverage establishes physical control counts, not every optional control property.', '',
             f'Baseline: {len(before)} products. Current catalog: {len(rows)} products. Scope changes include separate HOTAS variants and removal of the unsupported J04 alias duplicate; raw field counts are not a fixed-denominator progress score.', '',
             '| Gap family | Before | Remaining |', '| --- | ---: | ---: |']
    for field in dict.fromkeys([*old, *new]):
        lines.append(f'| {field} | {old[field]} | {new[field]} |')
    lines += ['', '## What still needs evidence', '',
              '- **Control details:** undocumented center clicks, trigger actions, switch return behavior and button backlighting. Some physical inventories are still partial; software button totals do not establish physical counts.',
              '- **Hardware and physical data:** original Alpha sensor technology; exact axis sensors, travel and damping on many products; missing weight, dimensions and material specifications. Gimbal/cam/extension fields may not apply to detached grips or passive accessories.',
              '- **Conflicting or ambiguous specifications:** SCG grip-only versus packed weight, conflicting TCA Boeing yoke weights, and unlabeled dimension order. These cannot be resolved by selecting whichever figure fills a blank.',
              '- **Exact SKU identity:** some WINCTRL source URLs now identify different combos; Cyber Taurus manuals cover multiple variants. Historical bundles lack an exact current purchasable SKU or matching regional price.',
              '- **Platform and regional sales:** console support remains unknown where exact manufacturer evidence does not establish it. Missing EU/UK/US prices are not filled by currency conversion or prices for related variants.', '',
              'See [parent integration findings](research/unknowns-parent-integration.md) for the manual-diagram breakthroughs and corrections. The raw counts below are not a count of independently researchable questions: optional/inapplicable fields and newly identified physical controls affect the totals.', '',
              '## Research evidence', '',
              'See the cited `unknowns-*-round*.md` notes in [research](research/) for investigated sources, corrections and reasons individual facts remain unresolved. Earlier research is historical and may be superseded by current YAML.', '',
              'The rows below identify exact missing keys. Published aggregate axes are accepted without inventing names. Analog controls have continuous travel: missing discrete position counts on documented analog rotaries/sliders are not actionable research gaps, although the raw audit retains them for consistent before/after counts. Mechanical accessories may have no USB port or software; absence in source data is not proof that the field applies. Regional prices are product/region observations, not converted estimates. Hands-on verdicts and editorial scores are not researchable manufacturer facts and are excluded.', '',
              '## Per-product gaps', '', '| Product | Missing source-data fields |', '| --- | --- |']
    for row in rows:
        if row['gaps']:
            label = row['name'].replace('|', '\\|')
            lines.append(f"| [{label}](../src/content/{row['id']}) | " + ', '.join(f'`{gap}`' for gap in row['gaps']) + ' |')
    Path('docs/catalog-unknowns.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
