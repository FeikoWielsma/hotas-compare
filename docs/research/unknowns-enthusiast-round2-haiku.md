# Enthusiast catalog unknowns — round 2 (VKB, VIRPIL, WINCTRL)

Checked 2026-10-20. Scope: VKB, VIRPIL and WINCTRL component and bundle YAML only. Products were not added, restored or merged. Discontinued original VIRPIL Constellation Alpha L/R remain absent.

## Applied changes

- **VKB platform (18 files: 13 components, 5 bundles).** `xbox` and `ps5` set to `unsupported`; `pc` unchanged. Source: [VKB Australia controllers FAQ](https://vkb-sim.com.au/collections/all-controllers), which states VKB controllers are "compatible with Windows PCs" and "not compatible with Xbox, PS5, Apple or any other platforms." The same FAQ URL was added to each file's `platform_compatibility.sources`. Detached grips and modules are noted as requiring their compatible VKB base or controller on Windows PC.
- **Materials from manufacturer listing text** (`vkbsimcontrollers.com`):
  - `gladiator-nxt-evo-base`: `abs`, `glass_fiber_pa` (gimbal), `steel` (baseplate). Replaces `steel_plate`.
  - `stecs-throttle-max`: `abs`, `glass_fiber_pa`, `steel`. Replaces `polymer`, `steel`.
- **Dimensions from manufacturer drawing:** [STECS Mini drawing](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/STECS-Mini.pdf?v=1772660043) (linked from the Mini product page, title "STECS Mini"). `stecs-throttle-mini`: `dimensions_mm: [155.4, 146, 194]`, read as width × depth × height from the bottom, plan and side views. Materials from the Mini listing: `abs`, `glass_fiber_pa`, `aluminium`. The Mini listing says "Tabletop baseplate crafted from aluminum", and the Max listing says steel; these are different products.
- **URSA MINOR (WINCTRL), from user manuals:**
  - [Airlines Joystick L manual V1.3](https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf), section 1.3 "LxWxH: 227mm*217mm*230mm; Weight: 0.98Kg". `ursa-minor-airline-joystick-l`: `weight_g: 980`, `dimensions_mm: [227, 217, 230]`.
  - [Fighter Joystick R manual V1.3](https://eu.winctrl.com/static/download/QmTvHcYNoR17Ro8AHmA7j6jpqwnHHbaYWS8dXGxM8QbTgh?filename=URSA+MINOR-Fighter-Joystick+R-User+Manual+V1.3+20250708.pdf), section 1.3 "L*W*H: 227mm*217mm*246mm; Wight: 1.05Kg". `ursa-minor-fighter-joystick-r`: `dimensions_mm: [227, 217, 246]`. Weight corrected from 1100 g to 1050 g.
  - Both dimension pages were visually inspected.

Dimension tuples are in the order the drawings label them (L×W×H). The schema does not define axis order.

## Checked, not applied (identity or variant conflict)

- **VKB `t-rudder-mk5` (T-Rudder Mk.V):** The only dimension drawing found is [VKB-Sim T-RdrMkIV_drw.pdf](https://cdn.shopify.com/s/files/1/0808/7827/2731/files/VKB-Sim_T-RdrMkIV_drw.pdf?v=1772660043), titled "VKB-Sim T-Rudder MkIV". It reads 380 × 211 × 88 mm (plate 16 mm). Product page is "T-Rudders Mk.V". Not applied because MkIV and Mk.V are not confirmed identical.
- **WINCTRL `cyber-taurus-base`:** [Cyber Taurus base manual](https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL%20Cyber%20Taurus%20Joystick%20Base%20User%20Manual%2020260430.pdf), section 1.3 table: three model codes, all 166 mm wide and 342 mm high:
  - CT.JB.E.B.29.MET.1: 267 × 166 × 342 mm, 11.5 kg.
  - CT.JB.E.D.16.MET.1: 320 × 166 × 342 mm, 17.5 kg.
  - CT.JB.E.B.82.MET.1: 320 × 166 × 342 mm, 18.5 kg.
  The YAML does not record a model code. Its existing `weight_g: 1600` matches none of the manual's models and is not corrected here; this needs the owner's model code.
- **WINCTRL `orion-2-base`:** Only candidate source is the [J2-2 base manual](https://eu.winctrl.com/static/download/QmQHHeiMhWatgMrJhm9QpHuQ7KDoHC6SuFG3aq39JyMAgx?filename=J2-2-BASE-User%20Manual%20EN%20V1.2.pdf), section 1.3 "height 213mm*213mm*120mm". Not applied: J2-2 is not confirmed as the Orion 2 Joystick Base.

## Still unresolved

| Product file | Field(s) | Attempted source and reason |
|---|---|---|
| vkb/* (all) | physical.dimensions_mm, connectivity.usb (connector type) | [Gladiator base](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-base-only-us), [Gunfighter base](https://vkbsimcontrollers.com/products/gunfighter-mk-iv-base-only-us), [F-14 grip](https://vkbsimcontrollers.com/products/gnx-f-14-add-on-grip-us), [KG12](https://vkbsimcontrollers.com/products/gnx-kg12-add-on-grip-us), [SEM](https://vkbsimcontrollers.com/products/gnx-sem-side-extension-module-us), [Omni Throttle L](https://vkbsimcontrollers.com/products/gladiator-nxt-evo-omni-throttle-left-hand-us), [STECS Max](https://vkbsimcontrollers.com/products/stecs-throttle-system-mk-ii-max-us): no dimensions, weight or connector type stated. Only the Mini and T-Rudder drawing PDFs exist in the Downloads list; the Downloads section lists profile templates and the NJoy32 utility only. |
| vkb/gladiator-nxt-evo-base, stecs-throttle-max, etc. | physical.weight_g | Not stated on listing pages checked; existing values not re-verified this round. |
| vkb/stecs-throttle-max | physical.dimensions_mm | No dimension PDF linked from the Max listing. |
| vkb/t-rudder-mk5 | physical.dimensions_mm | Drawing is labelled MkIV (see above). |
| virpil/cdt-vmax-throttle | physical.dimensions_mm, physical.weight_g, connectivity.usb | [Product page](https://virpil-controls.eu/vpc-cdt-vmax-throttle.html) fields blank; [CDT-VMAX manual](https://support.virpil.com/en/support/solutions/articles/47001260812-cdt-vmax-throttle-user-manual) states no dimensions, weight or connector type; box includes a 4-pin USB-XS9 cable only. |
| virpil/mongoost-50cm3-base | physical.dimensions_mm | [Product page](https://virpil-controls.eu/vpc-mongoost-50cm3-base.html) blank; [base manual](https://support.virpil.com/en/support/solutions/articles/47001218494--base-vpc-mongoost-50cm3-base-user-manual) states no dimensions; USB 4-pin port documented (already present in YAML). |
| virpil/* (other) | physical dims, weight, hardware.* | Product pages blank for "Product Dimensions (mm)" and "Product Weight (kg)". Manuals identified in the [VIRPIL support index](https://support.virpil.com/en/support/solutions/47000011535) for Constellation Alpha Prime Grip, Control Panel #1/#2, Rotor Plus TCS, VMAX Prime, MongoosT-50CM3 Throttle, ACE pedals, WarBRD-D base were **listed but not opened** in this round. Archer SF, CDT Aero/AeroMax and Flanker/Hawk manuals were not found in the index. |
| winctrl/* | platform.xbox, platform.ps5 | Search for WINCTRL Xbox/PS5 compatibility returned no WINCTRL result. Remain unknown, not unsupported. |
| winctrl/orion-2-base | physical.dimensions_mm | Only J2-2 manual found; identity not confirmed. |
| winctrl/cyber-taurus-base | physical.dimensions_mm, physical.weight_g | Three model variants; model code not in YAML. |
| winctrl/f16-ex-viper-grip, f16-icp-module, f18-hornet-grip, orion-2-f16-throttle, orion-2-f18-throttle, pfp3-cockpit-module, skywalker-rudder-pedals | dimensions and control maps | Exact manuals not yet fetched this round; WINCTRL product pages are JavaScript-rendered and the earlier preview snapshot timed out. |

## Evidence limits

- VKB Australia FAQ applies to all VKB controllers and throttles, as established by the parent. The FAQ is the VKB Australia store's; the US store listings are the same brand.
- Materials were taken only where the listing text states them. Not verified: weights and existing `materials` values not named in the sources above.
- Control-level details (grip directions, backlight, stages) on VKB listings were checked: the SCG, SEM and STECS listings name hat center-push, the F-14 grip names a center-push hat and dual-stage trigger, and the KG12 names an 8-way hat. No control data was changed this round because the existing records already cover these items.
