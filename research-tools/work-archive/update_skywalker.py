import yaml

text = """brand: winctrl
name: Skywalker Rudder Pedals
category: pedals
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: Official listing/manual establishes computer USB use; no exact product source establishes Xbox or PS5 support or incompatibility.
  sources:
    - https://eu.winctrl.com/view/goods-details.html?id=543
status: current
handedness: ambi
mount:
  provides: null
  accepts: []
controls:
  - type: axis
    kind: rudder
    count: 1
    location: other
    label: Main yaw axis
    source: https://eu.winctrl.com/view/goods-details.html?id=543
  - type: axis
    kind: other
    count: 2
    location: other
    label: Left and right pedal pitch axes (brake function not specified)
    source: https://eu.winctrl.com/view/goods-details.html?id=543
controls_evidence:
  coverage: complete
  source: https://eu.winctrl.com/view/goods-details.html?id=543
  checked: '2026-10-19'
  notes: >-
    Rendered official Orion/Skywalker pedal page explicitly gives a 38-degree main axis, independently pivoting left/right pedal footrests (30-degree pitch), and Hall sensors on main and pedal axes. Three selectable control modes are mechanical spring/return configurations, not extra electrical switches. Product badge may read Skywalker or Orion2; manufacturer says performance parameters are the same. Whether the pedal pitch axes serve as toe brakes is unspecified.
hardware:
  gimbal: pendular
  force_adjustable: true
  cams_swappable: true
  damping: optional_damper
  extension_support: false
  throw_deg: 38
  axes:
    - name: Rudder
      sensor: hall
    - name: Left pedal pitch
      sensor: hall
    - name: Right pedal pitch
      sensor: hall
connectivity:
  usb: c
  standalone_usb: true
software: SimApp Pro
physical:
  materials:
    - metal
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
    amount: 286.61
    incl_vat: true
    store: eu.winctrl.com
    url: https://eu.winctrl.com/view/goods-details.html?id=543
    verified: '2026-10-19'
    source: manual
verification: draft
sources:
  - https://eu.winctrl.com/view/goods-details.html?id=543

images:
  - file: /images/winctrl/skywalker-rudder-pedals.jpg
    source: https://eu.winctrl.com/view/goods-details.html?id=543
    caption: Skywalker Rudder Pedals
"""

with open("src/content/components/winctrl/skywalker-rudder-pedals.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated skywalker-rudder-pedals.yaml successfully")
