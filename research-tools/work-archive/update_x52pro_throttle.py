text = """brand: logitech
name: X52 Pro Throttle
category: throttle
status: current
handedness: n/a
mount: null
controls:
  - type: lever
    kind: throttle_single
    analog: true
    push: false
    location: handle
    label: Progressive throttle
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: detent
    count: 2
    location: handle
    label: Idle and afterburner detents
    customizable: true
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: button
    location: handle
    count: 2
    backlit: true
    label: Two fire buttons on throttle head
    notes: Manual product tour (p.4) shows two fire buttons on the throttle head.
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: scroll_wheel
    location: handle
    label: Rear index-finger scroll wheel
    push: true
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: hat
    ways: 8
    push: false
    location: handle
    label: Thumb POV hat
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: hat
    ways: 8
    push: true
    location: handle
    label: Mouse controller hat mode
    notes: Mouse controller can function as a hat; alternate mode, not an additional simultaneously installed control.
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: button
    location: handle
    backlit: false
    label: Mouse left button
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: button
    location: handle
    backlit: true
    label: Clutch button
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: slider
    analog: true
    center_detent: false
    location: handle
    label: Thumb slider
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  - type: rotary
    mode: analog
    count: 2
    push: false
    location: handle
    label: Analog throttle rotaries
    source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
controls_evidence:
  coverage: partial
  source: https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
  checked: '2026-10-19'
  notes: Shared X52 Pro manual describes throttle head and base controls. Throttle rotary/slider behavior is described as axes, but exact physical segmentation differs across X52 revision and standard/Pro bundle manuals; coverage remains partial.
hardware:
  gimbal: null
  sensor: potentiometer
  axes:
  - name: Throttle
    sensor: potentiometer
  force_adjustable: true
  cams_swappable: false
  extension_support: false
connectivity:
  usb: a_cable
  standalone_usb: true
software: Logitech G HUB
physical:
  weight_g: 728
  dimensions_mm: [170, 170, 190]
  materials:
  - abs
  - metal
prices:
- region: EU
  currency: EUR
  amount: 130
  incl_vat: true
  store: amazon.de
  verified: '2026-10-01'
  source: manual
- region: UK
  currency: GBP
  amount: 112
  incl_vat: true
  store: amazon.co.uk
  verified: '2026-10-01'
  source: manual
- region: US
  currency: USD
  amount: 136
  incl_vat: false
  store: amazon.com
  verified: '2026-10-01'
  source: manual
verification: draft
sources:
- https://www.logitechg.com/en-us/products/flight.html
- https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-simulator-controller.945-000022
- https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
images:
  - file: /images/logitech/x52-pro-throttle.webp
    source: https://www.logitechg.com/en-us/shop/p/x52-pro-space-flight-simulator-controller.945-000022
    caption: X52 Pro Throttle
platform_compatibility:
  pc: supported
  xbox: unknown
  ps5: unknown
  notes: Manual documents Windows setup through Windows Game Controllers and G HUB; no Xbox or PS5 statement appears in the manual or official SKU page. Console support remains unknown.
  sources:
  - https://www.logitech.com/assets/65327/x52-professional-hotas.pdf
"""

with open("src/content/components/logitech/x52-pro-throttle.yaml", "w", encoding="utf-8") as f:
    f.write(text)
print("Updated x52-pro-throttle.yaml successfully")
