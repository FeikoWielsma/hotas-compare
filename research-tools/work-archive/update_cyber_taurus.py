import yaml

text = """brand: winctrl
name: Cyber Taurus Force Feedback Flight Stick Base
category: base
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: Official listing/manual establishes computer USB use; no exact product source establishes Xbox or PS5 support or incompatibility.
  sources:
    - https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf
status: current
handedness: n/a
mount:
  provides: null
  accepts:
    - winctrl-grip
controls:
  - type: button
    location: base
    count: 1
    backlit: false
    label: Power button
    source: https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf
controls_evidence:
  coverage: complete
  source: https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf
  checked: '2026-10-19'
  notes: >-
    Manual lists one power button on the base, plus a second power button only on the slave interface marked for applicable configurations. The base axes are not buttons; emergency-stop RJ4P4C ports are connectors, not physical switches. Treat this inventory as one installed base power button; exact motor variant affects interfaces, not this control.
hardware:
  gimbal: force_feedback
  axes:
    - name: X
    - name: Y
  force_adjustable: true
  cams_swappable: false
  extension_support: true
  throw_deg: 30
connectivity:
  usb: b
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
prices: []
verification: draft
sources:
  - https://eu.winctrl.com/view/shopping.html
  - https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf

images: []
"""

with open("src/content/components/winctrl/cyber-taurus-base.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated cyber-taurus-base.yaml successfully")
