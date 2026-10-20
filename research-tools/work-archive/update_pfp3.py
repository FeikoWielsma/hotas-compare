import yaml

text = """brand: winctrl
name: PFP3 Programmable Flight Panel Module
category: module
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: Official listing/manual establishes computer USB use; no exact product source establishes Xbox or PS5 support or incompatibility.
  sources:
    - https://eu.winctrl.com/view/goods-details.html?id=1065
status: current
handedness: n/a
mount:
  provides: null
  accepts: []
controls: []
controls_evidence:
  coverage: partial
  source: https://eu.winctrl.com/view/goods-details.html?id=1065
  checked: '2026-10-19'
  notes: >-
    Rendered storefront record ID 1065 is titled/described as Panel of Auto Pilot 3, while the assigned file is PFP3. Download Center has an exact PFP-3N (Panel of Flight Plan) manual, a different model. Neither is safe evidence for this assigned SKU, so counts remain undocumented pending identity confirmation.

hardware:
  gimbal: null
  sensor: null
  axes: []
  force_adjustable: null
  cams_swappable: null
  damping: null
  extension_support: false
  throw_deg: null
connectivity:
  usb: c
  standalone_usb: true
software: SimApp Pro
physical:
  materials: []
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
  - https://eu.winctrl.com/view/shopping.html
  - https://eu.winctrl.com/view/goods-details.html?id=1065
  - https://eu.winctrl.com/static/download/QmbGxzEGivxtFbfrnZMJNK68t6kx4XcbkBN4Qsct9L9ALQ?filename=PFP-3N-User+Manual+V1.0-20250124.pdf

images: []
"""

with open("src/content/components/winctrl/pfp3-cockpit-module.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated pfp3-cockpit-module.yaml successfully")
