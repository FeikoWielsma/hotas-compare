from pathlib import Path
import yaml

root = Path('src/content/components/turtle-beach')
for name, target in [('velocityone-flightstick-ii.yaml', 'Dual analog levers'), ('velocityone-dual-throttle.yaml', 'Base lever (multifunction lever with detent buttons)')]:
    p = root / name
    d = yaml.safe_load(p.read_text(encoding='utf-8'))
    d['controls'] = [c for c in d['controls'] if 'detent buttons (' not in c.get('label', '').lower()]
    for c in d['controls']:
        if c.get('label') == target:
            c['button_contacts'] = 2
            c['notes'] = 'Two electrical end-detent contacts per lever, actuated by lever travel; not separate push-button bodies.'
            c['location'] = 'base'
        elif c['type'] == 'analog_ministick':
            c['location'] = 'grip' if 'flightstick-ii' in name else 'handle'
        elif c['type'] in ['encoder', 'switch']:
            c['location'] = 'base'
        elif c['type'] == 'scroll_wheel' and 'flightstick-ii' in name:
            c['location'] = 'grip'
    d['controls_evidence']['notes'] += ' End-detent contacts are attached to their lever records and excluded from standalone push-button counts.'
    d['sources'].extend(c['source'] for c in d['controls'] if c.get('source') not in d['sources'])
    d['sources'] = list(dict.fromkeys(d['sources']))
    p.write_text(yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=100), encoding='utf-8')

p = Path('src/pages/components/[...slug].astro')
s = p.read_text(encoding='utf-8')
s = s.replace("c.connectivity?.standalone_usb ? 'Yes' : 'No'", "c.connectivity?.standalone_usb == null ? 'Not specified' : c.connectivity.standalone_usb ? 'Yes' : 'No'")
p.write_text(s, encoding='utf-8')
