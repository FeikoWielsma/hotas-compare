import yaml

text = """brand: winctrl
name: Ursa Minor Airline Joystick Left
category: stick_fixed
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: Official listing/manual establishes computer USB use; no exact product source establishes Xbox or PS5 support or incompatibility.
  sources:
    - https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
status: current
handedness: left
mount:
  provides: null
  accepts: []
controls:
- type: button
  count: 14
  backlit: false
  location: base
  label: Button switches
  source: https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
- type: switch
  count: 1
  positions: 2
  momentary: false
  push: false
  location: grip
  label: Multifunction switch (key 20)
  source: https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
- type: hat
  count: 1
  ways: 5
  push: false
  location: grip
  label: Hidden five-way switch under magnetic cover
  source: https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
  notes: Manufacturer calls this a five-way control; direction count versus center-push interpretation is not confirmed. Neither five directional contacts nor center push is assumed.
- type: slider
  analog: true
  positions: 2
  center_detent: false
  count: 1
  location: base
  label: 38 mm throttle slider
  source: https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
controls_evidence:
  coverage: partial
  source: https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf
  checked: '2026-10-19'
  notes: 'Exact left-hand V1.3 manual found in official Download Center (manual cover says V1.0 2024.06): it labels 14 button switches, multifunction switch key 20, a hidden 5-way switch under a magnetic cover, a HAT, X/Y axes, Z rotation axis, and a 38 mm potentiometer slider. The 14-button map appears on the base; function map identifies the grip controls. HAT direction count and push behavior are not stated. The prior R-hand manual URL was the wrong variant. Five-way marketing terminology is preserved without guessing the split between directional contacts and center press.'
hardware:
  gimbal: pincer
  sensor: hall
  axes:
    - name: X
      sensor: hall
    - name: Y
      sensor: hall
    - name: Twist
      sensor: hall
    - name: Throttle
  force_adjustable: false
  cams_swappable: false
  damping: integrated_clutches
  extension_support: false
  throw_deg: 30
connectivity:
  usb: c
  standalone_usb: true
software: SimApp Pro
physical:
  weight_g: 980
  dimensions_mm:
  - 217
  - 227
  - 230
  materials:
  - glass_fiber_nylon
  - abs
use_case_fit:
  modern_jet: 4
  heli: 3
  ww2: 3
  ga: 3
  airliner: 3
  space_hotas: 4
  space_hosas: 3
prices:
  - region: EU
    currency: EUR
    amount: 59.90
    incl_vat: true
    store: eu.winctrl.com
    url: https://eu.winctrl.com/view/goods-details.html?id=559
    verified: '2026-10-19'
    source: manual
verification: draft
sources:
  - https://eu.winctrl.com/view/goods-details.html?id=559
  - https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf

images:
  - file: /images/winctrl/ursa-minor-airline-joystick-l.jpg
    source: https://eu.winctrl.com/view/goods-details.html?id=559
    caption: Ursa Minor Airline Joystick Left
"""

with open("src/content/components/winctrl/ursa-minor-airline-joystick-l.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated ursa-minor-airline-joystick-l.yaml successfully")
