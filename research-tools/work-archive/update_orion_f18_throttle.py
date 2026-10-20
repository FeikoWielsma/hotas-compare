import yaml

text = """brand: winctrl
name: Orion 2 FA-18 Dual Throttle Handles
category: throttle
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: The official Orion 2 throttle-base page describes PC software/USB operation; referenced goods ID 375 currently shows a NavyAce throttle combo rather than the assigned F/A-18 handle SKU. No exact source establishes Xbox or PS5 support or incompatibility.
  sources:
    - https://eu.winctrl.com/view/goods-details.html?id=375
    - https://eu.winctrl.com/h5/Orion2_Throttle_Base/en/
status: current
handedness: n/a
mount:
  provides: null
  accepts: []
controls: []
controls_evidence:
  coverage: partial
  source: https://eu.winctrl.com/view/goods-details.html?id=375
  checked: '2026-10-19'
  notes: >-
    The current rendered goods ID 375 page is titled Orion2 NavyAce Throttle Combo and lists the Orion2 throttle base, NavyAce metal throttle grip, and dual throttle connector. It does not describe an F/A-18 dual-handle control layout. Generic Orion2 detent information does not verify this assigned handle pair; no unsupported counts are asserted.

hardware:
  gimbal: sliding throttle rail
  sensor: null
  axes: []
  force_adjustable: null
  cams_swappable: null
  damping: null
  extension_support: false
  throw_deg: null
connectivity:
  usb: null
  standalone_usb: false
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
prices: []
verification: draft
sources:
  - https://eu.winctrl.com/h5/Orion2_Throttle_Base/en/
  - https://eu.winctrl.com/view/goods-details.html?id=375
images:
  - file: /images/winctrl/orion-2-f18-throttle.jpg
    source: https://eu.winctrl.com/view/goods-details.html?id=375
    caption: Orion 2 FA-18 Dual Throttle Handles
"""

with open("src/content/components/winctrl/orion-2-f18-throttle.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated orion-2-f18-throttle.yaml successfully")
