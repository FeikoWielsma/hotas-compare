from PIL import Image

# Let's inspect the controls on MTLP.
# In F/A-18 landing panel:
# Top left:
# - SELECTIVE JETTISON (rotary knob with 5 positions + PUSH button in center: JETT)
# - LAUNCH BAR (2-position toggle: EXTEND / RETRACT)
# - FLAP (3-position toggle: AUTO / HALF / FULL)
# - ANTI SKID (2-position toggle: ON / OFF)
# - LDG & TAXI LIGHT (2-position toggle: ON / OFF)
# - HOOK BYPASS (2-position toggle: FIELD / CARRIER)
# - LANDING GEAR LEVER (with internal mechanical / LED indicator, 2 positions: UP / DOWN)
# - ARRESTING HOOK LEVER (2 positions: UP / DOWN, with Hall sensor)
# - PARKING BRAKE / EMERG BRK HANDLE (pull and rotate, with Hall sensor)

# Let's check how many total controls that is:
# 1. Rotary: Selective Jettison knob (selector, multi-position)
# 2. Button: JETT center push button
# 3. Toggle: Launch Bar switch
# 4. Toggle: Flap switch
# 5. Toggle: Anti Skid switch
# 6. Toggle: LDG & Taxi Light switch
# 7. Toggle: Hook Bypass switch (or similar)
# 8. Lever: Landing Gear lever (lever)
# 9. Lever: Tailhook lever (lever)
# 10. Lever: Emergency / Parking Brake handle (pull/rotate lever)

print("Hypothesis: ~10 physical controls generating 25 logical switch signals.")
