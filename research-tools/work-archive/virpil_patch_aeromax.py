from pathlib import Path

root = Path(r"C:\Users\feiko\hotas-compare\src\content\components\virpil")
mapping = "https://support.virpil.com/en/support/solutions/articles/47001275883-cdt-aeromax-r-flightstick"
note = (
    "Exact-SKU product page embeds a labeled grip diagram (dual-stage trigger, flip trigger, "
    "three 4-way hats with push, three push buttons, analogue ministick, 2-way slider, paddle switch, "
    "brake lever axis, lockable twist). The AEROMAX mapping sheet linked from these listings names "
    "X/Y, twist Z, brake RZ, ministick RX/RY with a center push, and slider axis SL. Two side levers "
    "drawn on that sheet, one marked DL, are the optional throttle modules sold separately and are "
    "not part of this bare stick. Programmable LEDs on the diagram are indicators, not inputs."
)

files = {
    "cdt-aeromax-l-flightstick.yaml": "https://virpil-controls.eu/cdt-aeromax-l-flightstick.html",
    "cdt-aeromax-lz-flightstick.yaml": "https://virpil-controls.eu/cdt-aeromax-lz-flightstick-omnithrottle.html",
    "cdt-aeromax-r-flightstick.yaml": "https://virpil-controls.eu/cdt-aeromax-r-flightstick.html",
    "cdt-aeromax-rz-flightstick.yaml": "https://virpil-controls.eu/cdt-aeromax-rz-flightstick-omnithrottle.html",
}
old_grip = {
    "cdt-aeromax-l-flightstick.yaml": "https://virpil-controls.eu/cdt-aero-l-grip.html",
    "cdt-aeromax-lz-flightstick.yaml": "https://virpil-controls.eu/cdt-aero-l-grip.html",
    "cdt-aeromax-r-flightstick.yaml": "https://virpil-controls.eu/cdt-aero-r-grip.html",
    "cdt-aeromax-rz-flightstick.yaml": "https://virpil-controls.eu/cdt-aero-r-grip.html",
}
old_slider = {
    "cdt-aeromax-l-flightstick.yaml": "https://support.virpil.com/en/support/solutions/articles/47001285225-vpc-cdt-aero-l-grip",
    "cdt-aeromax-lz-flightstick.yaml": "https://support.virpil.com/en/support/solutions/articles/47001285225-vpc-cdt-aero-l-grip",
    "cdt-aeromax-r-flightstick.yaml": "https://support.virpil.com/en/support/solutions/articles/47001285226-vpc-cdt-aero-r-grip",
    "cdt-aeromax-rz-flightstick.yaml": "https://support.virpil.com/en/support/solutions/articles/47001285226-vpc-cdt-aero-r-grip",
}

for name, page in files.items():
    path = root / name
    text = path.read_text(encoding="utf-8")
    text = text.replace(old_grip[name], page)
    text = text.replace(old_slider[name], mapping)
    text = text.replace(
        "notes: AEROMAX uses the AEROMAX grip design; the CDT-AERO mapping template depicts this as a continuous SLDR axis (0–100).",
        "notes: Official AEROMAX mapping sheet labels this control as analog axis SL. The product diagram calls the same control a 2-way slider.",
    )
    text = text.replace("coverage: partial", "coverage: complete")
    text = text.replace("checked: '2026-10-19'", "checked: '2026-10-20'")
    # evidence notes paragraph is one logical line in some files and wrapped in others
    start = text.find("notes: Exact SKU")
    if start < 0:
        raise SystemExit(f"notes not found in {name}")
    end = text.find("\nhardware:", start)
    text = text[:start] + "notes: " + note + text[end:]
    if mapping not in text.split("sources:", 1)[-1]:
        text = text.replace(
            "sources:\n",
            "sources:\n  - " + mapping + "\n",
            1,
        )
    path.write_text(text, encoding="utf-8")
    print("patched", name)
