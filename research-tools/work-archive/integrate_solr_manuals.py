from pathlib import Path
import yaml

root = Path('src/content/components/thrustmaster')
manual1 = 'https://ts.thrustmaster.com/download/accessories/Manuals/SOL-R/Sol-R_FlightStick_user-manual_21L.pdf'
manual6 = 'https://ts.thrustmaster.com/download/accessories/Manuals/SOL-R/Sol-R_6_Throttle_user-manual.pdf'

def read(name):
    return yaml.safe_load((root / name).read_text(encoding='utf-8'))

def save(name, data, source):
    if source not in data['sources']:
        data['sources'].append(source)
    (root / name).write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=100), encoding='utf-8')

d = read('sol-r-stick.yaml')
for c in d['controls']:
    c['source'] = manual1
    if c['type'] == 'hat':
        c.update(ways=8, push=True)
    elif c['type'] == 'analog_ministick':
        c['push'] = True
    elif c.get('label') == 'Secondary trigger':
        c.pop('stages', None)
    elif c.get('label') == 'Thumbwheel':
        c.update(type='scroll_wheel', push=True, label='Digital scroll wheel with center click')
        c.pop('notes', None)
    elif c['type'] == 'toggle':
        c['ways'] = 2
    elif c['type'] == 'button' and c.get('location') == 'base':
        c['backlit'] = True
    elif c.get('label') == 'Selector switch':
        c['positions'] = 4
    elif c.get('label') == 'Rotary knob':
        c.update(type='encoder', push=True, label='Base rotary encoder with center click')
d['controls'].extend([
    dict(type='button', count=3, location='grip', label='Two front action buttons and one installed rear button', source=manual1),
    dict(type='switch', count=1, positions=2, location='base', label='Left-handed / right-handed configuration selector', source=manual1),
    dict(type='axis', kind='twist', count=1, location='grip', label='Lockable grip twist', source=manual1),
])
d['controls_evidence'].update(coverage='complete', source=manual1, checked='2026-10-20', notes='Visually reconciled English manual pages 7-10 and 20-22. Two eight-way clickable hats, clickable ministick, clickable digital scroll wheel, three installed grip buttons, four two-position base toggles, eight backlit base pads, clickable encoder and four-position selector. Includes physical handedness selector; spare rear button and alternate POV mappings are not extra controls. Secondary trigger action remains unspecified. Published eight-axis total includes virtual axes; it is not an inventory of eight separate analog mechanisms.')
save('sol-r-stick.yaml', d, manual1)

d = read('sol-r-5-base.yaml')
for c in d['controls']:
    c['source'] = manual1
    if c['type'] == 'toggle': c['ways'] = 2
    elif c['type'] == 'button': c['backlit'] = True
    elif c.get('label') == 'Selector switch': c['positions'] = 4
    elif c.get('label') == 'Rotary knob': c.update(type='encoder', push=True, label='Base rotary encoder with center click')
d['controls'].append(dict(type='switch', count=1, positions=2, location='base', label='Left-handed / right-handed configuration selector', source=manual1))
d['hardware']['axes'].append(dict(name='Mini-throttle'))
d['controls_evidence'].update(coverage='complete', source=manual1, notes='Sol-R 5 product page identifies the shared Sol-R base controls. English Sol-R flightstick manual pages 9-10 and 20 visually identify four two-position toggles, eight backlit pads, clickable encoder, four-position rotary selector, mini-throttle and handedness configuration switch. Software actions are not standalone button counts.')
save('sol-r-5-base.yaml', d, manual1)

d = read('sol-r-6-throttle.yaml')
for c in d['controls']:
    c['source'] = manual6
    if c['type'] == 'button':
        c['count'] = 3
        c['label'] = 'Three standalone action buttons (1, 2, 3)'
    elif c['type'] == 'analog_ministick': c['push'] = True
    elif c['type'] == 'rotary': c.update(mode='analog', label='Radio rotary knob / antenna axis')
    elif c['type'] == 'detent': c['location'] = 'base'
d['controls'].append(dict(type='toggle', ways=2, count=1, location='handle', label='Two-position toggle (button outputs 4 and 5)', source=manual6))
d['hardware']['axes'] = [dict(name=name) for name in ['Throttle Z', 'Ministick X', 'Ministick Y', 'Rudder rocker RZ', 'Antenna slider']]
d['controls_evidence'].update(coverage='complete', source=manual6, notes='English manual pages 6-7 and mapping page 14 visually establish three standalone buttons, one two-position toggle, clickable ministick, two four-way hats, one eight-way POV, analog radio rotary knob, self-centering rudder rocker and throttle. Toggle outputs 4/5 are one physical control; ministick click 6 is integrated. Five named axes are documented. Pages 16-18 establish one repositionable detent part with four configurations, not four installed detent controls. Undocumented hat clicks and button backlighting remain unset.')
save('sol-r-6-throttle.yaml', d, manual6)
