"""Write WINCTRL catalog YAML from manuals and EU store listings already downloaded."""
import json
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\feiko\hotas-compare")
COMP = ROOT / "src" / "content" / "components" / "winctrl"
BUND = ROOT / "src" / "content" / "bundles" / "winctrl"
IMG = ROOT / "public" / "images" / "winctrl"
LIST = json.loads((ROOT / "work" / "winctrl-sweep" / "eu_winctrl_com_home_list_get.json").read_text(encoding="utf-8"))["data"]["list"]
US = json.loads((ROOT / "work" / "winctrl-sweep" / "us_winwingsim_com_home_list_get.json").read_text(encoding="utf-8"))["data"]["list"]
BY_ID = {}
for item in LIST:
    BY_ID.setdefault(item["id"], item)
US_BY_ID = {}
for item in US:
    US_BY_ID.setdefault(item["id"], item)

CHECKED = "2026-10-20"


def manual(ipfs: str, filename: str) -> str:
    return f"https://eu.winctrl.com/static/download/{ipfs}?filename={filename}"


def goods(gid: int) -> str:
    return f"https://eu.winctrl.com/view/goods-details.html?id={gid}"


def price_amount(raw) -> float | None:
    if raw is None:
        return None
    text = str(raw).strip().replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(",", "")
    elif "," in text:
        return None
    try:
        value = float(text)
    except ValueError:
        return None
    if value <= 0 or value >= 100000:
        return None
    return value


def prices(gid: int) -> list[dict]:
    rows = []
    eu = price_amount(BY_ID.get(gid, {}).get("price"))
    if eu is not None:
        rows.append(
            {
                "region": "EU",
                "currency": "EUR",
                "amount": eu,
                "incl_vat": True,
                "store": "eu.winctrl.com",
                "url": goods(gid),
                "verified": CHECKED,
                "source": "manual",
            }
        )
    us = price_amount(US_BY_ID.get(gid, {}).get("price"))
    if us is not None:
        rows.append(
            {
                "region": "US",
                "currency": "USD",
                "amount": us,
                "incl_vat": False,
                "store": "us.winwingsim.com",
                "url": f"https://us.winwingsim.com/view/goods-details.html?id={gid}",
                "verified": CHECKED,
                "source": "manual",
            }
        )
    return rows


PC = {
    "pc": "supported",
    "xbox": "unknown",
    "ps5": "unknown",
    "notes": "Official listing or manual establishes computer USB or SimAppPro use. No exact product source reviewed here establishes Xbox or PS5 support or incompatibility.",
}


def plat(sources: list[str]) -> dict:
    data = dict(PC)
    data["sources"] = sources
    return data


def dump(path: Path, data: dict) -> None:
    import yaml

    class Dumper(yaml.SafeDumper):
        pass

    def represent_str(dumper, value):
        style = "|" if "\n" in value else None
        return dumper.represent_scalar("tag:yaml.org,2002:str", value, style=style)

    Dumper.add_representer(str, represent_str)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        yaml.dump(data, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=100),
        encoding="utf-8",
    )


def save_image(slug: str, gid: int) -> str | None:
    item = BY_ID.get(gid) or {}
    pics = item.get("pics") or []
    if not pics:
        return None
    url = "https://eu.winctrl.com" + pics[0]
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        blob = urllib.request.urlopen(req, timeout=60).read()
    except Exception as exc:
        print("IMG FAIL", slug, exc)
        return None
    if blob[:3] == b"\xff\xd8\xff":
        ext = "jpg"
    elif blob[:8] == b"\x89PNG\r\n\x1a\n":
        ext = "png"
    elif blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        ext = "webp"
    else:
        ext = "img"
        print("IMG UNKNOWN", slug, blob[:16])
    dest = IMG / f"{slug}.{ext}"
    dest.write_bytes(blob)
    return f"/images/winctrl/{slug}.{ext}"


def image_block(slug: str, gid: int, caption: str) -> list[dict]:
    file = save_image(slug, gid)
    if not file:
        return []
    return [{"file": file, "source": goods(gid), "caption": caption}]


CT_PEDAL_MAN = manual(
    "QmNu2Koz6sDJ5YGgUVWx1fKTm4f85RW7kMBTQS9jdkFkwt",
    "WINCTRL-Cyber-Taurus-32-Rudder-Pedals-20260430.pdf",
)
CT_BASE_MAN = manual(
    "QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b",
    "WINCTRL-Cyber-Taurus-Joystick-Base-User-Manual-20260430.pdf",
)
COMBAT_MAN = manual(
    "QmVLFu6k2SkWsQfRgw9o6iryfTg9WQYgD1GHKRRm9Sjvkk",
    "WINCTRL-URSA-MINOR-Combat-Throttle-Metal-1.0.pdf",
)
EX_MAN = manual(
    "QmTJyiSsaZi1KUzCu5PhtTK1uebwuCeCCLX8HwXDWZTW6X",
    "WINCTRL-URSA-MINOR-32-Throttle-Metal-Extension-1.0-User-Manual.pdf",
)
ORION32_MAN = manual(
    "QmTY8EjMA7JwXrPhnkf6ksToihf49mrjEPx6Uz45DBeh2X",
    "WINCTRL-Orion-32-Rudder-Pedals-Metal-1.0-User-Manual-1229.pdf",
)
R1_MAN = manual(
    "Qmcuf2Z4sK1fhbBHysbeCX94yxL9HHS2QPERHpYXpW4hxR",
    "R1-Metal-Base-DAMPER1-User-Manual-EN-V2.1.pdf",
)

PEDAL_NOTE = (
    "Manual performance drawing shows ±38° spindle travel each side of center and a 15° brake arc on each pedal. "
    "The specification table prints spindle stroke as 38 mm, which conflicts with the degree callouts on the same page; "
    "the degree drawing is used. 192 and 530 differ in published main-shaft force and mass. "
    "The 32-series height is 320 mm and the Combat (CT.F.R) height is 227 mm."
)


def pedal_controls(src: str) -> list[dict]:
    return [
        {"type": "axis", "kind": "rudder", "count": 1, "location": "other", "label": "Main spindle, ±38°", "source": src},
        {"type": "axis", "kind": "toe_brake", "count": 2, "location": "other", "label": "Left and right pedal brakes, 15° each", "source": src},
        {"type": "button", "count": 1, "location": "base", "label": "Power button", "source": src},
    ]


def write_pedals() -> None:
    specs = [
        ("cyber-taurus-32-rudder-pedals-eb192", "Cyber Taurus 32 Rudder Pedals E.B.192", 2825, [438, 546, 320], 12000, "CT.32.R.E.B.192.MET.1"),
        ("cyber-taurus-32-rudder-pedals-eb530", "Cyber Taurus 32 Rudder Pedals E.B.530", 2945, [438, 546, 320], 15500, "CT.32.R.E.B.530.MET.1"),
        ("cyber-taurus-combat-rudder-pedals-eb192", "Cyber Taurus Combat Rudder Pedals E.B.192", 2585, [438, 544, 227], 12000, "CT.F.R.E.B.192.MET.1"),
        ("cyber-taurus-combat-rudder-pedals-eb530", "Cyber Taurus Combat Rudder Pedals E.B.530", 2705, [438, 544, 227], 15500, "CT.F.R.E.B.530.MET.1"),
    ]
    for slug, name, gid, dims, weight, model in specs:
        srcs = [CT_PEDAL_MAN, goods(gid)]
        dump(
            COMP / f"{slug}.yaml",
            {
                "brand": "winctrl",
                "name": name,
                "category": "pedals",
                "platform_compatibility": plat(srcs),
                "status": "current",
                "handedness": "ambi",
                "mount": {"provides": None, "accepts": []},
                "controls": pedal_controls(CT_PEDAL_MAN),
                "controls_evidence": {
                    "coverage": "complete",
                    "source": CT_PEDAL_MAN,
                    "checked": CHECKED,
                    "notes": f"Model {model}. {PEDAL_NOTE} USB-B and a 48 V supply are required. One power button is on the interface panel.",
                },
                "hardware": {
                    "gimbal": "force_feedback",
                    "axes": [{"name": "Rudder"}, {"name": "Left brake"}, {"name": "Right brake"}],
                    "throw_deg": 76,
                    "extension_support": False,
                },
                "connectivity": {"usb": "b", "standalone_usb": True},
                "software": "SimApp Pro",
                "physical": {"weight_g": weight, "dimensions_mm": dims, "materials": ["metal"]},
                "prices": prices(gid),
                "verification": "draft",
                "sources": srcs,
                "images": image_block(slug, gid, name),
            },
        )
        print("pedal", slug)


def write_bases() -> None:
    rows = [
        ("cyber-taurus-base-eb82", "Cyber Taurus Joystick Base E.B.82", 5705, [320, 166, 342], 18500, "CT.JB.E.B.82.MET.1", "82 N·m in direction A"),
        ("cyber-taurus-base-ed16", "Cyber Taurus Joystick Base E.D.16", 5765, [320, 166, 342], 17500, "CT.JB.E.D.16.MET.1", "16 N·m in each listed direction"),
    ]
    for slug, name, gid, dims, weight, model, torque in rows:
        srcs = [CT_BASE_MAN, goods(gid)]
        dump(
            COMP / f"{slug}.yaml",
            {
                "brand": "winctrl",
                "name": name,
                "category": "base",
                "platform_compatibility": plat(srcs),
                "status": "current",
                "handedness": "n/a",
                "mount": {"provides": None, "accepts": ["winctrl-grip"]},
                "controls": [
                    {"type": "button", "count": 1, "location": "base", "backlit": False, "label": "Power button", "source": CT_BASE_MAN}
                ],
                "controls_evidence": {
                    "coverage": "complete",
                    "source": CT_BASE_MAN,
                    "checked": CHECKED,
                    "notes": (
                        f"Manual model {model}. Pitch and roll are each ±15°. Published peak torque: {torque}. "
                        "Dimensions are length × width × height from the manual table. The illustrated unit on that page is the 267 mm E.B.29 chassis. "
                        "GB and duplicate EU listing IDs of the same goods code are the same chassis."
                    ),
                },
                "hardware": {
                    "gimbal": "force_feedback",
                    "axes": [{"name": "X"}, {"name": "Y"}],
                    "force_adjustable": True,
                    "cams_swappable": False,
                    "extension_support": True,
                    "throw_deg": 30,
                },
                "connectivity": {"usb": "b", "standalone_usb": True},
                "software": "SimApp Pro",
                "physical": {"weight_g": weight, "dimensions_mm": dims, "materials": ["metal"]},
                "prices": prices(gid),
                "verification": "draft",
                "sources": srcs,
                "images": image_block(slug, gid, name),
            },
        )
        print("base", slug)


def component(slug, name, category, gid, srcs, controls, evidence, **extra):
    data = {
        "brand": "winctrl",
        "name": name,
        "category": category,
        "platform_compatibility": plat(srcs),
        "status": extra.pop("status", "current"),
        "handedness": extra.pop("handedness", "n/a"),
        "mount": extra.pop("mount", {"provides": None, "accepts": []}),
        "controls": controls,
        "controls_evidence": evidence,
        "hardware": extra.pop("hardware", None),
        "connectivity": extra.pop("connectivity", {"standalone_usb": None}),
        "prices": prices(gid) if gid else [],
        "verification": "draft",
        "sources": srcs,
        "images": image_block(slug, gid, name) if gid else [],
    }
    for key in ("software", "physical"):
        if key in extra:
            data[key] = extra.pop(key)
    if extra:
        raise SystemExit(f"unused {slug} {extra}")
    # drop null hardware
    if data["hardware"] is None:
        data.pop("hardware")
    dump(COMP / f"{slug}.yaml", data)
    print("component", slug)


def write_rest() -> None:
    t32 = manual("QmQewYduBVWvwYSvVxzH9GAseJyDfFVeUspknKwbzpeuZo", "WINCTRL-URSA-MINOR-32-Throttle-Metal-1.0-User-manual-20260310.pdf")
    tbase = manual("QmWTD6KLXTeybV5Brapf3RKXgrB52mBaF4poG67qhoMeoY", "T2-ORION-THROTTLE-BASE-II-User-MANUAL-EN-V1.1.pdf")
    j22 = manual("QmQHHeiMhWatgMrJhm9QpHuQ7KDoHC6SuFG3aq39JyMAgx", "J2-2-BASE-User-Manual-EN-V1.2.pdf")
    f16l = manual("QmabSXmvPxNp2ZXHidaDhGq73XGHyKicn6YWrgQksanXDp", "URSA-MINOR-Fighter-Joystick-L-User-Manual-v1.3.pdf")
    space_l = manual("QmfFcdFqWFoe3S1vo51wpCPW9ZKRnDc6mRPb7sd6S45y6R", "URSA-MINOR-Space-Joystick-L-User-Manual-V1.3.pdf")
    space_r = manual("QmRCiq3fVwnXeQQu4re2geG4oPFSPxYYCbjtFGE9WR1CXJ", "URSA-MINOR-Space-Joystick-R-User-Manual-V1.3.pdf")
    air_r = manual("QmRwKSeCfwDz515Bk8qVY5weZbPCGbgqE4dMHjxbQFgc4T", "URSA-MINOR-Airlines-Joystick-R-User-Manual-V1.3.pdf")
    nws_l = manual("QmUio6d7HvAeeYGSxhBs7RNaUM4waaRvRhv2nvTzo1y3Ri", "Winctrl-Steering-Handwheel-Left-1.0-User-Manual.pdf")
    nws_r = manual("QmcW5ZWJhzpvm8UcnrQeHcZfyxh9w6hYv4RFaN9uQZYbKu", "Winctrl-Steering-Handwheel-Right-1.0-User-Manual.pdf")
    carrier = manual("QmZPAZez5Jc22RgvWKVPgq1hTGqbrK4Kr4uhfyGtbXjno3", "WINCTRL-CarrierAce-Joystick-Grip-R-Metal-2.0-User-Manual-V1.0.pdf")
    pap = manual("QmchgWqWW5Ebro72Q2QC8mSmQhkUj2qST24C8H3jPZhTza", "Panel-of-Auto-Pilot-3-User-Manual-20250523.pdf")
    agp = manual("QmVKXy8jQzVyfdmWFSTxkc9hXAwpMMmSBYMN4YEFAgazcL", "WINCTRL-32-AGP-Metal-1.0-User-Manual-EN-V1.1-20251120.pdf")
    ecam = manual("QmWZ594jqQ6Qa2GVZ6mfWL4ZDvAo37NFeYqtPQ1aekWJh7", "WINCTRL-32-ECAM-Panel-1.0-User-Manual-EN-V1.1-20250923.pdf")
    tcas = manual("QmNVm4aVgsu3xrcCmACpPvMtgoiJn3rSdsBX9ohpYpmSw2", "WINCTRL-32-TCAS-1.0-User-Manual-EN-V1.1-20260105.pdf")
    rmp = manual("QmeE6f3JKbduJmQt8Ck9EA2LNyh6Uw1wrjS8GqZFAwAEPD", "WINCTRL-32-RMP-1.0-User-Manual-V1.1-20260522.pdf")
    pac = manual("QmVrk3UKELySkVn4UjK9XrzVBn32Mtih2LCtKMocgVnFAt", "WINCTRL-32-PAC-Metal-1.0-User-Manual-20250904.pdf")
    pdc_m = manual("QmRZUBzvsURGGZ84ma9T4LRS5gEVekPFf3qjWmJeNmb82g", "WINCTRL-3M-PDC-1.0-User-Manual-EN-V1.1-20250711.pdf")
    pdc_n = manual("QmUCdN2byoGPYV7Ayz82cEhLG96zQ48H6a4ZuDosFViZ9B", "WINCTRL-3N-PDC-1.0-User-Manual-EN-V1.1-20250711.pdf")
    ufc2 = manual("QmNjs6oJuxhJ5KPNn5qAh84VkD6mMPkt6FLx4xwP6YDhfS", "WINCTRL-CarrierAce-UFC-2.0-20260512.pdf")
    pfp3n = manual("QmbGxzEGivxtFbfrnZMJNK68t6kx4XcbkBN4Qsct9L9ALQ", "PFP-3N-User-Manual-V1.0-20250124.pdf")
    pfp4 = manual("Qme9Ze3mTQd3T5DNiThEsTAJNWt1qHjAsV1QGFGWebH2Ep", "PFP-4-User-Manual-V1.0-20250124.pdf")
    pfp7 = manual("QmYXF4nioKgqenQJ3LJRqbwimFJxFkKdw54m297cfSNkQN", "PFP-7-User-Manual-V1.0-20240124.pdf")
    mcdu = manual("QmXRD7YaBFQ84AWQvaK4Qm4Qn8dSyh3xrZZgUiFgs33VKP", "MCDU-32-User-Manual-V1.0-202502019.pdf")
    pto2 = manual("QmZQ47N54H4j4xh4a3PWPVWo2szubdDzdB3iKx8Arj4o9a", "PTO2-User-Manual-EN-V1.1.pdf")
    viper_ex = manual("QmVFGazAj4BdEn5rUL273NxNsNJs6ynRrQ7Wvg5vSU5Knr", "THROTTLE-HANDLE-OF-16-HOTAS-User-Manual-EN-V3.2.pdf")
    grip16 = manual("Qmbw11j3CZkVhfaFXFNx3aYRU2fJMKRLJj8eC7DtNyghMm", "JOYSTICK-GRIP-OF-16-HOTAS-User-MANUAL-EN-V-2.1.pdf")

    component(
        "orion-2-throttle-base",
        "Orion 2 Throttle Base",
        "base",
        334,
        [tbase, goods(334)],
        [],
        {
            "coverage": "partial",
            "source": tbase,
            "checked": CHECKED,
            "notes": "Throttle Base II manual publishes 272×165×93 mm and an 80° thumb-wheel travel. It does not enumerate base-mounted buttons. The 10th-anniversary listing (goods 466, same price) uses this manual; no hardware difference is stated, so it is not a separate record.",
        },
        hardware={"throw_deg": None, "extension_support": False},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"dimensions_mm": [272, 165, 93], "materials": ["metal"]},
        mount={"provides": None, "accepts": []},
    )
    component(
        "ursa-minor-combat-throttle",
        "URSA MINOR Combat Throttle Metal",
        "throttle",
        1965,
        [COMBAT_MAN, goods(1965)],
        [
            {"type": "lever", "kind": "throttle_dual", "analog": True, "count": 1, "location": "base", "label": "Two throttle axes, 65°", "source": COMBAT_MAN},
            {"type": "button", "count": 8, "location": "base", "label": "Base push buttons", "source": COMBAT_MAN},
            {"type": "button", "count": 3, "location": "handle", "label": "Grip push buttons", "source": COMBAT_MAN},
            {"type": "hat", "count": 3, "ways": 5, "push": True, "location": "handle", "label": "Five-way switches with center press", "source": COMBAT_MAN},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 3, "push": False, "location": "base", "label": "Three-position rotary switch", "source": COMBAT_MAN},
            {"type": "encoder", "count": 2, "push": False, "location": "base", "label": "Single-axis encoders, 30 detents", "source": COMBAT_MAN},
            {"type": "toggle", "count": 1, "ways": 3, "location": "handle", "label": "Three-position toggle", "source": COMBAT_MAN},
            {"type": "toggle", "count": 1, "location": "handle", "label": "Slide switch, 2.5 mm each side", "source": COMBAT_MAN},
            {"type": "toggle", "count": 1, "location": "base", "label": "Synchronization lock", "source": COMBAT_MAN},
            {"type": "rotary", "count": 1, "mode": "analog", "push": False, "location": "handle", "label": "Potentiometer thumbwheel, 300°", "source": COMBAT_MAN},
            {"type": "rotary", "count": 1, "mode": "analog", "location": "handle", "label": "Self-centering thumbwheel, 50°", "source": COMBAT_MAN},
            {"type": "analog_ministick", "count": 1, "push": False, "location": "handle", "label": "Mini joystick, 20°", "source": COMBAT_MAN},
            {"type": "detent", "count": 5, "customizable": False, "location": "base", "label": "Detents present when the detent switch is on", "source": COMBAT_MAN},
        ],
        {
            "coverage": "complete",
            "source": COMBAT_MAN,
            "checked": CHECKED,
            "notes": "Counts are the Combat Throttle Metal manual sections 1.2.2 through 1.2.12 and do not include the separate EX panel. The product page states two Hall-sensed throttle axes. Finger lifts are mechanical parts in that manual and are not counted as switches. The slide switch travel is given per side; position count is not numbered.",
        },
        hardware={"sensor": "hall", "axes": [{"name": "Left throttle", "sensor": "hall"}, {"name": "Right throttle", "sensor": "hall"}], "throw_deg": 65, "force_adjustable": True},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 1460, "dimensions_mm": [300, 174, 190], "materials": ["aluminium", "plastic"]},
    )
    component(
        "ursa-minor-combat-t-ex",
        "URSA MINOR Combat T EX",
        "module",
        1985,
        [EX_MAN, goods(1985)],
        [
            {"type": "toggle", "count": 2, "ways": 3, "location": "panel", "label": "Three-position toggle switches", "source": EX_MAN},
            {"type": "button", "count": 1, "location": "panel", "label": "Push button, 35 mm published travel", "source": EX_MAN},
            {"type": "button", "count": 2, "location": "panel", "label": "Short-press buttons", "source": EX_MAN},
            {"type": "rocker", "count": 2, "location": "panel", "label": "Rocker switches", "source": EX_MAN},
            {"type": "rotary", "count": 1, "location": "panel", "label": "Auto-reset rotary wheel, 84°", "source": EX_MAN},
            {"type": "rotary", "count": 2, "mode": "analog", "location": "panel", "label": "Thumb wheels, 80°", "source": EX_MAN},
        ],
        {
            "coverage": "complete",
            "source": EX_MAN,
            "checked": CHECKED,
            "notes": "Standalone EX panel. The diagram labels the toggles as three-position and the specification counts two of them. The 35 mm push-button travel is printed in the manual; it is not converted to 0.35 mm.",
        },
        connectivity={"standalone_usb": False},
        physical={"weight_g": 220, "dimensions_mm": [241, 51, 81]},
    )
    component(
        "ursa-minor-32-throttle",
        "URSA MINOR 32 Throttle Metal",
        "throttle",
        1385,
        [t32, goods(1385)],
        [
            {"type": "lever", "kind": "throttle_single", "analog": True, "count": 1, "location": "base", "label": "Main axis, 65°", "source": t32},
            {"type": "trigger", "count": 1, "location": "handle", "label": "Trigger, 78° travel", "source": t32},
            {"type": "button", "count": 1, "location": "handle", "label": "Grip button, 3 mm", "source": t32},
            {"type": "button", "count": 1, "location": "base", "label": "Scale cancellation key", "source": t32},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 3, "location": "base", "label": "Three-position switch, 90°", "source": t32},
            {"type": "toggle", "count": 1, "ways": 2, "location": "base", "label": "Two-position switch", "source": t32},
        ],
        {
            "coverage": "partial",
            "source": t32,
            "checked": CHECKED,
            "notes": "The manual names an additional group of buttons with 0.3 mm travel but does not give their count. Published weight is internally inconsistent (1.3 kg and 1.1 lb), so weight is unset. USB-C.",
        },
        hardware={"throw_deg": 65, "axes": [{"name": "Throttle"}]},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"dimensions_mm": [250, 125, 160], "materials": ["aluminium"]},
    )
    component(
        "strikeace-e-throttle-grip",
        "StrikeAce E Metal Throttle Grip",
        "throttle",
        476,
        [goods(476), manual("QmYhqkwsuNS7KKEEFbrsGtD5776QMcK55JWAEXNNRBou8U", "THROTTLE-HANDLE-OF-15E-15EX-HOTAS-User-Manual-EN-V1.1.pdf")],
        [
            {"type": "button", "count": 17, "location": "handle", "label": "Buttons", "source": goods(476)},
            {"type": "hat", "count": 3, "ways": 5, "location": "handle", "label": "Five-way hat switches", "source": goods(476)},
            {"type": "rotary", "count": 1, "mode": "analog", "location": "handle", "label": "Hall thumbwheel", "source": goods(476)},
            {"type": "axis", "count": 3, "kind": "other", "location": "handle", "label": "Axes stated on the product page", "source": goods(476)},
        ],
        {
            "coverage": "partial",
            "source": goods(476),
            "checked": CHECKED,
            "notes": "EU product page for StrikeAce E lists 38 physical switches, 17 buttons, 3 axes, 1 thumbwheel and 3 five-way hats. The headline switch total is not added again on top of those items. Five-way center-press behavior is not stated. The shared 15E/15EX manual drawing does not separate E from EX counts.",
        },
        connectivity={"standalone_usb": False},
        hardware={"sensor": "hall", "axis_count": 3},
    )
    component(
        "strikeace-ex-ii-throttle-grip",
        "StrikeAce EX II Metal Throttle Grip",
        "throttle",
        471,
        [goods(471), manual("QmYhqkwsuNS7KKEEFbrsGtD5776QMcK55JWAEXNNRBou8U", "THROTTLE-HANDLE-OF-15E-15EX-HOTAS-User-Manual-EN-V1.1.pdf")],
        [
            {"type": "button", "count": 18, "location": "handle", "label": "Buttons", "source": goods(471)},
            {"type": "hat", "count": 6, "ways": 5, "location": "handle", "label": "Five-way hat switches", "source": goods(471)},
            {"type": "rotary", "count": 2, "mode": "analog", "location": "handle", "label": "Dual Hall thumbwheels", "source": goods(471)},
            {"type": "scroll_wheel", "count": 1, "location": "handle", "label": "Scroll wheel", "source": goods(471)},
            {"type": "axis", "count": 4, "kind": "other", "location": "handle", "label": "Axes stated on the product page", "source": goods(471)},
        ],
        {
            "coverage": "partial",
            "source": goods(471),
            "checked": CHECKED,
            "notes": "EU page lists 57 physical switches, 18 buttons, 4 axes, 3 thumbwheels and 6 five-way hats, then describes dual Hall thumbwheels and one scroll wheel. Those three are recorded as the thumbwheel total. Center-press on the five-ways is not stated.",
        },
        connectivity={"standalone_usb": False},
        hardware={"sensor": "hall", "axis_count": 4},
    )
    component(
        "viperace-ex-throttle-grip",
        "ViperAce EX Metal Throttle Grip",
        "throttle",
        339,
        [viper_ex, goods(339)],
        [
            {"type": "lever", "kind": "throttle_single", "analog": True, "count": 1, "location": "handle", "label": "Throttle travel 80° (18° idle, 44° normal, 18° afterburner)", "source": viper_ex},
        ],
        {
            "coverage": "partial",
            "source": viper_ex,
            "checked": CHECKED,
            "notes": "Manual V3.2 gives size, mass and the 80° throw. The button map is a numbered drawing without a written count, so button, hat and wheel totals are not copied off the key numbers.",
        },
        hardware={"throw_deg": 80},
        connectivity={"standalone_usb": False},
        physical={"weight_g": 800, "dimensions_mm": [210, 101, 181], "materials": ["metal"]},
    )
    component(
        "viperace-joystick-grip",
        "ViperAce Metal Joystick Grip",
        "grip",
        377,
        [goods(377), grip16],
        [
            {"type": "hat", "count": 4, "ways": 4, "push": True, "location": "grip", "label": "Four-direction switches with press", "source": goods(377)},
            {"type": "hat", "count": 1, "ways": 8, "push": True, "location": "grip", "label": "Eight-direction switch with press", "source": goods(377)},
            {"type": "button", "count": 11, "location": "grip", "label": "Press switches", "source": goods(377)},
            {"type": "trigger", "count": 1, "stages": 2, "location": "grip", "label": "Long-travel two-stage metal trigger", "source": goods(377)},
            {"type": "trigger", "count": 1, "location": "grip", "label": "Hall sensor trigger", "source": goods(377)},
        ],
        {
            "coverage": "partial",
            "source": goods(377),
            "checked": CHECKED,
            "notes": "This is goods JGRIP-16X1, the grip without the shaker kit. The page says vibration needs an additional EX kit. The shared F-16 grip manual also covers the EX grip and does not isolate a second control map. Whether the 11 press switches include the triggers is not stated, so both are kept as published.",
        },
        connectivity={"standalone_usb": False},
        hardware={"sensor": "hall"},
        mount={"provides": "winctrl-grip", "accepts": []},
        handedness="right",
    )
    component(
        "carrierace-joystick-grip",
        "CarrierAce Joystick Grip Right",
        "grip",
        1685,
        [carrier, goods(1685)],
        [
            {"type": "hat", "count": 3, "ways": 5, "push": True, "location": "grip", "label": "Five-way switches", "source": carrier},
            {"type": "hat", "count": 1, "ways": 8, "push": True, "location": "grip", "label": "Nine-way switch", "source": carrier},
            {"type": "button", "count": 2, "location": "grip", "label": "Auto-reset buttons", "source": carrier},
            {"type": "rotary", "count": 1, "push": True, "location": "grip", "label": "Wheel with center press", "source": carrier},
            {"type": "axis", "count": 1, "kind": "other", "location": "grip", "label": "Axis with an end switch, about 15°", "source": carrier},
        ],
        {
            "coverage": "partial",
            "source": carrier,
            "checked": CHECKED,
            "notes": "Diagram callouts are three five-way switches, one nine-way switch, two auto-reset buttons, one wheel and one axis with an end switch. The nine-way description includes eight directions plus center press, recorded as an 8-way hat with push. A hand rest is mechanical. Connector is PS/2 6-pin to the base.",
        },
        connectivity={"standalone_usb": False, "usb": None},
        physical={"weight_g": 550, "dimensions_mm": [105, 135, 200], "materials": ["metal"]},
        mount={"provides": "winctrl-grip", "accepts": []},
        handedness="right",
    )
    stick_controls = lambda src: [
        {"type": "button", "count": 14, "location": "base", "label": "Button switches", "source": src},
        {"type": "hat", "count": 1, "location": "grip", "label": "HAT", "source": src},
        {"type": "analog_ministick", "count": 1, "location": "grip", "label": "Mini joystick", "source": src},
        {"type": "slider", "count": 1, "analog": True, "location": "base", "label": "38 mm potentiometer slider", "source": src},
    ]
    component(
        "ursa-minor-fighter-joystick-l",
        "Ursa Minor Fighter Joystick Left",
        "stick_fixed",
        705,
        [f16l, goods(705)],
        stick_controls(f16l),
        {"coverage": "partial", "source": f16l, "checked": CHECKED, "notes": "V1.3 left fighter manual states 14 button switches, a HAT, mini-joystick calibration and a 38 mm slider. HAT way count and trigger stage count are on the drawing and are not numbered in the text. X/Y travel is ±15° and twist is ±20°. USB connector type is not named."},
        hardware={"throw_deg": 30, "axes": [{"name": "X"}, {"name": "Y"}, {"name": "Twist"}, {"name": "Rx"}, {"name": "Ry"}, {"name": "Throttle"}]},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 1050, "dimensions_mm": [227, 217, 246]},
        handedness="left",
    )
    component(
        "ursa-minor-space-joystick-l",
        "Ursa Minor Space Joystick Left",
        "stick_fixed",
        553,
        [space_l, goods(553)],
        stick_controls(space_l),
        {"coverage": "partial", "source": space_l, "checked": CHECKED, "notes": "V1.3 space-left manual states 14 button switches, a HAT, mini-joystick calibration and a 38 mm slider. HAT direction count is not stated in text. Height is 228 mm, unlike the fighter sticks."},
        hardware={"throw_deg": 30, "axes": [{"name": "X"}, {"name": "Y"}, {"name": "Twist"}, {"name": "Throttle"}]},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 1050, "dimensions_mm": [227, 217, 228]},
        handedness="left",
    )
    component(
        "ursa-minor-space-joystick-r",
        "Ursa Minor Space Joystick Right",
        "stick_fixed",
        552,
        [space_r, goods(552)],
        stick_controls(space_r),
        {"coverage": "partial", "source": space_r, "checked": CHECKED, "notes": "V1.3 space-right manual states 14 button switches, a HAT and a 38 mm slider. Mini-joystick calibration is in the same manual family. Published mass is 0.98 kg."},
        hardware={"throw_deg": 30, "axes": [{"name": "X"}, {"name": "Y"}, {"name": "Twist"}, {"name": "Throttle"}]},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 980, "dimensions_mm": [227, 217, 228]},
        handedness="right",
    )
    component(
        "ursa-minor-airline-joystick-r",
        "Ursa Minor Airline Joystick Right",
        "stick_fixed",
        555,
        [air_r, goods(555)],
        [
            {"type": "button", "count": 14, "location": "base", "label": "Button switches", "source": air_r},
            {"type": "hat", "count": 1, "ways": 5, "push": False, "location": "grip", "label": "Hidden five-way switch under magnetic cover", "source": air_r, "notes": "The manual calls this a five-way switch. Direction count versus center press is not separated."},
            {"type": "hat", "count": 1, "location": "grip", "label": "HAT", "source": air_r},
            {"type": "slider", "count": 1, "analog": True, "location": "base", "label": "Potentiometer slider", "source": air_r},
        ],
        {"coverage": "partial", "source": air_r, "checked": CHECKED, "notes": "Right-hand airline V1.3 manual matches the left-hand control classes: 14 buttons, hidden five-way switch, HAT and slider. HAT way count is not stated. Mass 0.98 kg. Dimensions 227×217×230 mm."},
        hardware={"throw_deg": 30, "axes": [{"name": "X"}, {"name": "Y"}, {"name": "Twist"}, {"name": "Throttle"}]},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 980, "dimensions_mm": [227, 217, 230]},
        handedness="right",
    )
    for slug, name, gid, src in (
        ("nws-handwheel-l", "32 NWS Handwheel Left", 6245, nws_l),
        ("nws-handwheel-r", "32 NWS Handwheel Right", 6265, nws_r),
    ):
        component(
            slug,
            name,
            "stick_fixed",
            gid,
            [src, goods(gid)],
            [
                {"type": "axis", "count": 1, "kind": "other", "location": "grip", "label": "Tiller, ±75°", "source": src},
                {"type": "button", "count": 1, "location": "grip", "label": "Pedal disconnect button, 3 mm", "source": src},
            ],
            {"coverage": "complete", "source": src, "checked": CHECKED, "notes": "Nose-wheel steering tiller. One button and ±75° rotation. USB-C. No other switches are named."},
            hardware={"throw_deg": 150, "axes": [{"name": "Tiller"}]},
            connectivity={"usb": "c", "standalone_usb": True},
            software="SimApp Pro",
            physical={"weight_g": 920, "dimensions_mm": [145, 135, 127]},
            handedness="left" if slug.endswith("-l") else "right",
        )
    component(
        "pfp3-cockpit-module",
        "Panel of Auto Pilot 3",
        "module",
        1065,
        [pap, goods(1065)],
        [
            {"type": "button", "count": 17, "location": "panel", "label": "Pushbutton switches, 3 mm", "source": pap},
            {"type": "rotary", "count": 5, "mode": "analog", "push": False, "location": "panel", "label": "Rotary knobs, 360°, no detents", "source": pap},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 5, "push": False, "location": "panel", "label": "Five-position knob, 120°", "source": pap},
            {"type": "encoder", "count": 1, "location": "panel", "label": "Optical encoder thumbwheel, 360°", "source": pap},
            {"type": "toggle", "count": 2, "ways": 2, "location": "panel", "label": "Two-position toggle and two-position switch", "source": pap},
        ],
        {"coverage": "complete", "source": pap, "checked": CHECKED, "notes": "Goods 1065 is Panel of Auto Pilot 3, not PFP-3N. The parts diagram labels a two-position toggle and a separate two-position switch. The magnetic AT switch is sold separately and is not counted. The older catalog file pfp3-cockpit-module.yaml pointed at this same goods ID."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 920, "dimensions_mm": [470, 52, 92]},
    )
    component(
        "agp-32-metal",
        "32 AGP Metal",
        "module",
        1585,
        [agp, goods(1585)],
        [
            {"type": "button", "count": 4, "location": "panel", "label": "Push buttons, 3 mm", "source": agp},
            {"type": "button", "count": 1, "location": "panel", "label": "Latching switch, 2.4 mm", "source": agp},
            {"type": "toggle", "count": 1, "ways": 2, "location": "panel", "label": "Locking toggle, 30°", "source": agp},
            {"type": "rotary", "count": 3, "mode": "analog", "push": True, "location": "panel", "label": "Pressable knobs, 360°", "source": agp},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 3, "push": False, "location": "panel", "label": "Three-position knob, 90°", "source": agp},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 3, "location": "panel", "label": "Three-position auto-reset knob, 60°", "source": agp},
            {"type": "lever", "kind": "other", "analog": True, "count": 1, "location": "panel", "label": "Landing-gear lever", "source": goods(1585)},
        ],
        {"coverage": "complete", "source": agp, "checked": CHECKED, "notes": "Manual control totals. The product page adds a Hall sensor on the gear-lever axis. Gear-lever travel is not given a degree value in the sections used here."},
        hardware={"sensor": "hall", "axes": [{"name": "Gear lever", "sensor": "hall"}]},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 610, "dimensions_mm": [180, 148, 38], "materials": ["metal"]},
    )
    component(
        "ecam-32",
        "32 ECAM",
        "module",
        1565,
        [ecam, goods(1565)],
        [
            {"type": "button", "count": 22, "location": "panel", "label": "Push buttons, 0.25 mm", "source": ecam},
        ],
        {"coverage": "complete", "source": ecam, "checked": CHECKED, "notes": "22 push buttons. One button has a flip cover with 180° axial rotation; the cover is not an extra button. Product page says four of the buttons are in the extension area."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 170, "dimensions_mm": [150, 75, 51]},
    )
    component(
        "tcas-32",
        "32 TCAS",
        "module",
        1865,
        [tcas, goods(1865)],
        [
            {"type": "button", "count": 10, "location": "panel", "label": "Silicone push buttons", "source": tcas},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 3, "push": False, "location": "panel", "label": "Three-position rotary, 60°", "source": tcas},
            {"type": "rotary", "count": 2, "mode": "selector", "positions": 2, "push": False, "location": "panel", "label": "Two-position rotaries, 35°", "source": tcas},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 4, "push": False, "location": "panel", "label": "Four-position rotary, 90°", "source": tcas},
            {"type": "rotary", "count": 1, "mode": "selector", "positions": 2, "push": False, "location": "panel", "label": "Two-position rotary, 60°", "source": tcas},
        ],
        {"coverage": "complete", "source": tcas, "checked": CHECKED, "notes": "Specification section counts one 3-position rotary, two 2-position rotaries at 35°, one 4-position rotary, one further 2-position rotary at 60°, and 10 buttons."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 140, "dimensions_mm": [146, 55, 57]},
    )
    component(
        "rmp-32",
        "32 RMP",
        "module",
        2065,
        [rmp, goods(2065)],
        [
            {"type": "button", "count": 14, "location": "panel", "label": "Short-press buttons", "source": rmp},
            {"type": "toggle", "count": 1, "ways": 2, "location": "panel", "label": "Two-position locking toggle, 24°", "source": rmp},
            {"type": "encoder", "count": 1, "push": True, "location": "panel", "label": "Double encoder", "source": rmp},
        ],
        {"coverage": "complete", "source": rmp, "checked": CHECKED, "notes": "14 buttons, one locking toggle and one double encoder with center press. A NAV button cover flips 175° and is not an extra button. The manual does not split the double encoder into two shafts."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 210, "dimensions_mm": [146, 82, 73]},
    )
    component(
        "pac-32-metal",
        "32 PAC Metal",
        "module",
        1405,
        [pac, goods(1405)],
        [
            {"type": "lever", "kind": "speedbrake", "analog": True, "count": 1, "location": "panel", "label": "Speed brake, 75°", "source": pac},
            {"type": "lever", "kind": "flap", "analog": True, "count": 1, "location": "panel", "label": "Flaps, 75°", "source": pac},
            {"type": "button", "count": 1, "location": "panel", "label": "Reset button", "source": pac},
            {"type": "rotary", "count": 1, "push": True, "location": "panel", "label": "Parking brake, 90°, lift to rotate", "source": pac},
            {"type": "rotary", "count": 1, "location": "panel", "label": "Rudder trim, 90°, auto-reset", "source": pac},
            {"type": "toggle", "count": 1, "ways": 3, "momentary": True, "location": "panel", "label": "Three-position auto-reset switch", "source": pac},
        ],
        {"coverage": "complete", "source": pac, "checked": CHECKED, "notes": "Connects to the URSA MINOR 32 throttle over the manual's SATA-style link, so it is not recorded as standalone USB. Mass 0.75 kg."},
        connectivity={"standalone_usb": False},
        software="SimApp Pro",
        physical={"weight_g": 750, "dimensions_mm": [217, 140, 130], "materials": ["metal"]},
        hardware={"axes": [{"name": "Speed brake"}, {"name": "Flaps"}]},
    )
    component(
        "pdc-3m",
        "3M PDC",
        "module",
        1245,
        [pdc_m, goods(1245)],
        [
            {"type": "button", "count": 14, "location": "panel", "label": "Ten silicone buttons and four press buttons", "source": pdc_m},
            {"type": "toggle", "count": 2, "ways": 3, "location": "panel", "label": "Three-position toggles", "source": pdc_m},
            {"type": "encoder", "count": 1, "push": False, "location": "panel", "label": "Detent-free encoder", "source": pdc_m},
        ],
        {"coverage": "complete", "source": pdc_m, "checked": CHECKED, "notes": "10 silicone buttons plus 4 press buttons. The manual says the center switch cannot be pressed when the outer layer is at PLN; that is a mechanical interlock, not a separate control."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 260, "dimensions_mm": [117, 52, 92]},
    )
    component(
        "pdc-3n",
        "3N PDC",
        "module",
        1265,
        [pdc_n, goods(1265)],
        [
            {"type": "button", "count": 13, "location": "panel", "label": "Nine silicone buttons and four press buttons", "source": pdc_n},
            {"type": "toggle", "count": 2, "ways": 3, "location": "panel", "label": "Three-position toggles", "source": pdc_n},
        ],
        {"coverage": "complete", "source": pdc_n, "checked": CHECKED, "notes": "Unlike 3M PDC, this manual does not list an encoder."},
        connectivity={"usb": "c", "standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 260, "dimensions_mm": [117, 52, 92]},
    )
    component(
        "carrierace-ufc-2",
        "CarrierAce UFC 2",
        "module",
        2085,
        [ufc2, goods(2085)],
        [
            {"type": "button", "count": 26, "location": "panel", "label": "Key switches, 3.5 mm full travel", "source": ufc2},
            {"type": "toggle", "count": 1, "ways": 3, "location": "panel", "label": "Three-position toggle, 24°", "source": ufc2},
            {"type": "rotary", "count": 3, "mode": "analog", "push": False, "location": "panel", "label": "Rotary knobs, 300°", "source": ufc2},
            {"type": "encoder", "count": 2, "location": "panel", "label": "Spring-return pull knobs, 30 detents", "source": ufc2},
        ],
        {"coverage": "complete", "source": ufc2, "checked": CHECKED, "notes": "UFC 2.0. The product page says the older UFC 1.0 seesaw switches are not on this unit."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 730, "dimensions_mm": [195, 87, 173]},
    )
    for slug, name, gid, src in (
        ("pfp-3n", "PFP 3N", 965, pfp3n),
        ("pfp-4", "PFP 4", 1005, pfp4),
        ("pfp-7", "PFP 7", 985, pfp7),
        ("mcdu-32", "MCDU", 945, mcdu),
    ):
        component(
            slug,
            name,
            "module",
            gid,
            [src, goods(gid)],
            [],
            {"coverage": "partial", "source": src, "checked": CHECKED, "notes": "Manual distinguishes line-select keys (1.0 mm) from keypad keys (1.3 mm) and shows a display, but it never states how many of each key are installed. No count is inferred from a typical MCDU layout."},
            connectivity={"standalone_usb": True},
            software="SimApp Pro",
            physical={"weight_g": 470, "dimensions_mm": [228, 146, 28.5]},
        )
    component(
        "pto-2",
        "PTO 2 Panel of Take Off",
        "module",
        542,
        [pto2, goods(542)],
        [
            {"type": "switch", "count": 41, "location": "panel", "label": "Physical switches", "source": goods(542)},
            {"type": "rotary", "count": 6, "location": "panel", "label": "Thumbwheels", "source": goods(542)},
            {"type": "hat", "count": 1, "ways": 5, "location": "panel", "label": "Five-way switch", "source": goods(542)},
        ],
        {"coverage": "partial", "source": goods(542), "checked": CHECKED, "notes": "Product page lists 41 physical switches, 6 thumbwheels and 1 five-way switch, and Hall sensors on the landing-gear, hook, parking-brake and wing-fold handles. The 41 switches are not broken into buttons versus toggles. Landing-gear handle is described as a 3-position hidden switch. Dimensions 249×130×103 mm and mass 1.9 kg are from the PTO2 manual."},
        hardware={"sensor": "hall"},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 1900, "dimensions_mm": [249, 130, 103]},
    )


def write_bundles() -> None:
    def bundle(slug, name, category, gid, components, sources, notes=None):
        data = {
            "brand": "winctrl",
            "name": name,
            "category": category,
            "platform_compatibility": plat(sources),
            "status": "current",
            "components": components,
            "prices": prices(gid),
            "verification": "draft",
            "sources": sources,
            "images": image_block(slug, gid, name),
        }
        dump(BUND / f"{slug}.yaml", data)
        print("bundle", slug, notes or "")

    bundle(
        "ursa-minor-combat-hotas",
        "URSA MINOR Combat HOTAS",
        "hotas_bundle",
        6485,
        ["winctrl/ursa-minor-fighter-joystick-r", "winctrl/ursa-minor-combat-throttle"],
        [goods(6485)],
    )
    bundle(
        "ursa-minor-combat-throttle-ex",
        "URSA MINOR Combat Throttle Metal EX",
        "system",
        2005,
        ["winctrl/ursa-minor-combat-throttle", "winctrl/ursa-minor-combat-t-ex"],
        [goods(2005), COMBAT_MAN, EX_MAN],
    )
    bundle(
        "ursa-minor-32-throttle-pac",
        "URSA MINOR 32 Throttle and 32 PAC",
        "system",
        1665,
        ["winctrl/ursa-minor-32-throttle", "winctrl/pac-32-metal"],
        [goods(1665)],
    )
    bundle(
        "orion-2-navyace-throttle",
        "Orion 2 NavyAce Throttle",
        "system",
        375,
        ["winctrl/orion-2-throttle-base", "winctrl/orion-2-f18-throttle"],
        [goods(375)],
    )
    bundle(
        "orion-2-strikeace-throttle",
        "Orion 2 StrikeAce E Throttle",
        "system",
        385,
        ["winctrl/orion-2-throttle-base", "winctrl/strikeace-e-throttle-grip"],
        [goods(385)],
    )
    bundle(
        "orion-2-viperace-joystick",
        "Orion 2 ViperAce Joystick",
        "stick_combo",
        374,
        ["winctrl/orion-2-base", "winctrl/viperace-joystick-grip"],
        [goods(374)],
    )
    bundle(
        "orion-2-navyace-joystick",
        "Orion 2 NavyAce Joystick",
        "stick_combo",
        332,
        ["winctrl/orion-2-base", "winctrl/f18-hornet-grip"],
        [goods(332)],
    )
    bundle(
        "orion-2-carrierace-joystick",
        "Orion 2 CarrierAce Joystick",
        "stick_combo",
        1785,
        ["winctrl/orion-2-base", "winctrl/carrierace-joystick-grip"],
        [goods(1785)],
    )
    bundle(
        "orion-2-carrierace-hotas",
        "Orion 2 CarrierAce HOTAS",
        "hotas_bundle",
        1805,
        ["winctrl/orion-2-base", "winctrl/carrierace-joystick-grip", "winctrl/orion-2-throttle-base", "winctrl/orion-2-f18-throttle"],
        [goods(1805)],
    )
    bundle(
        "orion-2-hotas-max",
        "Orion 2 HOTAS MAX",
        "hotas_bundle",
        343,
        ["winctrl/orion-2-base", "winctrl/f16-ex-viper-grip", "winctrl/orion-2-throttle-base", "winctrl/strikeace-ex-ii-throttle-grip"],
        [goods(343)],
    )
    bundle(
        "orion-2-hotas-metal-warthog",
        "Orion 2 HOTAS Metal Warthog",
        "hotas_bundle",
        324,
        ["winctrl/orion-2-base", "winctrl/viperace-joystick-grip", "winctrl/orion-2-throttle-base", "winctrl/strikeace-e-throttle-grip"],
        [goods(324)],
    )
    bundle(
        "orion-2-strikeace-hotas",
        "Orion 2 StrikeAce HOTAS",
        "hotas_bundle",
        1825,
        ["winctrl/orion-2-base", "winctrl/carrierace-joystick-grip", "winctrl/orion-2-throttle-base", "winctrl/strikeace-ex-ii-throttle-grip"],
        [goods(1825)],
    )
    bundle(
        "cyber-taurus-eb29-viperace-joystick",
        "Cyber Taurus E.B.29 ViperAce Joystick",
        "stick_combo",
        3185,
        ["winctrl/cyber-taurus-base", "winctrl/f16-ex-viper-grip"],
        [goods(3185)],
    )
    bundle(
        "cyber-taurus-eb82-viperace-joystick",
        "Cyber Taurus E.B.82 ViperAce Joystick",
        "stick_combo",
        3205,
        ["winctrl/cyber-taurus-base-eb82", "winctrl/f16-ex-viper-grip"],
        [goods(3205)],
    )
    bundle(
        "cyber-taurus-ed16-viperace-joystick",
        "Cyber Taurus E.D.16 ViperAce Joystick",
        "stick_combo",
        3225,
        ["winctrl/cyber-taurus-base-ed16", "winctrl/f16-ex-viper-grip"],
        [goods(3225)],
    )
    bundle(
        "efis-combo",
        "EFIS Combo",
        "system",
        885,
        ["winctrl/efis-l", "winctrl/efis-r"],
        [goods(885)],
    )
    bundle(
        "pdc-3-combo",
        "3 PDC Combo",
        "system",
        1645,
        ["winctrl/pdc-3m", "winctrl/pdc-3n"],
        [goods(1645)],
    )
    bundle(
        "glareshield-3",
        "3 Glareshield",
        "system",
        6125,
        ["winctrl/pfp3-cockpit-module", "winctrl/pdc-3m", "winctrl/pdc-3n"],
        [goods(6125)],
    )
    bundle(
        "orion-2-viperace-ex-throttle",
        "Orion 2 ViperAce Throttle",
        "system",
        342,
        ["winctrl/orion-2-throttle-base", "winctrl/orion-2-f16-throttle"],
        [goods(342)],
    )


def write_small_panels() -> None:
    efis_l = manual("QmUZU73aqkdY3Zs59noF8oKHM43A9WtoqVvxcCTRAk7Xjc", "EFIS-32L-User-Manual-V1.0-2024.09.pdf")
    efis_r = manual("QmNxtiacuKV6KPA9xhGHK236fhhx9Vc16yeDEGpiYBhJ4t", "EFIS-32R-User-Manual-V1.0-2024.09.pdf")
    fcu = manual("QmaNia5yLCgSvvnhtU6n1k1bwDHfYV5K8CSdnLEk2K7MCx", "FCU-User-Manual-V2.1-2024.11.pdf")
    mfd = manual("QmPM5B75RK5UGNrmuc9CWAb2DtE4Gygtqu4aPGzVX4qUNv", "MFD1-User-Manual-EN-V1.4.pdf")
    hud = manual("QmZhYCnLyWXRbasmafyG11UF5gfouw2PXiz6KdDvdgrJ48", "HUD1-User-Manual-EN-V1.2.pdf")
    ufc = manual("QmREPuUfauWWYjBq5VwR2wiYgpwmZkca1XAbxjsUntBmHP", "UFC1-User-Manual-EN-V1.3.pdf")
    disp = manual("QmYFqVUUAVJcG5Xyg9XuRtMhMwyvWiWGcz7SYZhfCTa6XK", "D1-User-Manual-EN-V1.4.pdf")
    component(
        "efis-l",
        "EFIS L",
        "module",
        845,
        [efis_l, goods(845)],
        [{"type": "rotary", "count": 1, "mode": "analog", "push": True, "location": "panel", "label": "PULL STD knob, 360° and 2.5 mm push-pull", "source": efis_l}],
        {"coverage": "partial", "source": efis_l, "checked": CHECKED, "notes": "The manual text extracted here specifies the PULL STD knob and the 158×103.2×75 mm body. Other EFIS keys are not given a count."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 360, "dimensions_mm": [158, 103.2, 75]},
    )
    component(
        "efis-r",
        "EFIS R",
        "module",
        865,
        [efis_r, goods(865)],
        [{"type": "rotary", "count": 1, "mode": "analog", "push": True, "location": "panel", "label": "PULL STD knob, 360° and 2.5 mm push-pull", "source": efis_r}],
        {"coverage": "partial", "source": efis_r, "checked": CHECKED, "notes": "Same PULL STD knob description as EFIS L. The manual line L*W*H 15×103.2×75 mm conflicts with a 15 mm length and is not stored. Mass 0.36 kg is stored."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 360},
    )
    component(
        "fcu-unit",
        "FCU Unit",
        "module",
        550,
        [fcu, goods(550)],
        [{"type": "rotary", "count": 4, "mode": "analog", "push": True, "location": "panel", "label": "Knobs, 360° and 2.5 mm push-pull", "source": fcu}],
        {"coverage": "partial", "source": fcu, "checked": CHECKED, "notes": "Manual states four push/pull knobs. Additional FCU buttons are drawn but not counted in the text. One knob is described as a two-position push-pull rotary; that split is not given its own count."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 500, "dimensions_mm": [262, 103, 79]},
    )
    component(
        "mfd-unit",
        "MFD Unit",
        "module",
        402,
        [mfd, goods(402)],
        [],
        {"coverage": "partial", "source": mfd, "checked": CHECKED, "notes": "MFD1 manual publishes 170×107×95 mm and 0.97 kg. Bezel button count is not stated in the extracted text."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 970, "dimensions_mm": [170, 107, 95]},
    )
    component(
        "navyace-hud",
        "NavyAce HUD",
        "module",
        412,
        [hud, goods(412)],
        [],
        {"coverage": "partial", "source": hud, "checked": CHECKED, "notes": "HUD1 manual publishes 206×115×63 mm and 0.88 kg. Button count is not stated in the extracted text."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 880, "dimensions_mm": [206, 115, 63]},
    )
    component(
        "navyace-ufc",
        "NavyAce UFC",
        "module",
        6625,
        [ufc, goods(6625)],
        [],
        {"coverage": "partial", "source": ufc, "checked": CHECKED, "notes": "UFC1 manual publishes 195×87×172 mm and 1.5 kg. Key count is not stated in the extracted text. CarrierAce UFC 2 is a different product."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
        physical={"weight_g": 1500, "dimensions_mm": [195, 87, 172]},
    )
    component(
        "usb-instrument-display",
        "USB 3.0 Instrument Display",
        "module",
        422,
        [disp, goods(422)],
        [],
        {"coverage": "partial", "source": disp, "checked": CHECKED, "notes": "Display manual states a 1024×768 screen. Physical button count is not stated. The x3 listing is a quantity pack of this display, not a different device."},
        connectivity={"standalone_usb": True},
        software="SimApp Pro",
    )


def write_identity() -> None:
    # E.B.29 replaces the generic Cyber Taurus base record. Slug stays cyber-taurus-base.
    srcs = [CT_BASE_MAN, goods(5205)]
    dump(
        COMP / "cyber-taurus-base.yaml",
        {
            "brand": "winctrl",
            "name": "Cyber Taurus Joystick Base E.B.29",
            "category": "base",
            "platform_compatibility": plat(srcs),
            "status": "current",
            "handedness": "n/a",
            "mount": {"provides": None, "accepts": ["winctrl-grip"]},
            "controls": [
                {"type": "button", "count": 1, "location": "base", "backlit": False, "label": "Power button", "source": CT_BASE_MAN}
            ],
            "controls_evidence": {
                "coverage": "complete",
                "source": CT_BASE_MAN,
                "checked": CHECKED,
                "notes": "This record is chassis CT.JB.E.B.29.MET.1 (EU goods 5205). Pitch and roll are ±15°. Peak torque is 29 N·m in direction A. E.B.82 and E.D.16 are separate records. The GB listing uses the same goods code and is not a second chassis.",
            },
            "hardware": {
                "gimbal": "force_feedback",
                "axes": [{"name": "X"}, {"name": "Y"}],
                "force_adjustable": True,
                "cams_swappable": False,
                "extension_support": True,
                "throw_deg": 30,
            },
            "connectivity": {"usb": "b", "standalone_usb": True},
            "software": "SimApp Pro",
            "physical": {"weight_g": 11500, "dimensions_mm": [267, 166, 342], "materials": ["metal"]},
            "prices": prices(5205),
            "verification": "draft",
            "sources": srcs,
            "images": image_block("cyber-taurus-base", 5205, "Cyber Taurus Joystick Base E.B.29"),
        },
    )
    navy = goods(306)
    dump(
        COMP / "orion-2-f18-throttle.yaml",
        {
            "brand": "winctrl",
            "name": "NavyAce Metal Throttle Grip",
            "category": "throttle",
            "platform_compatibility": plat([navy]),
            "status": "current",
            "handedness": "n/a",
            "mount": {"provides": None, "accepts": []},
            "controls": [
                {"type": "hat", "count": 2, "ways": 4, "push": True, "location": "handle", "label": "Four-direction switches with press", "source": navy},
                {"type": "button", "count": 3, "location": "handle", "label": "Press switches", "source": navy},
                {"type": "analog_ministick", "count": 1, "push": True, "location": "handle", "label": "Mini joystick with press", "source": navy},
                {"type": "rotary", "count": 1, "mode": "analog", "location": "handle", "label": "Spring-loaded Hall thumbwheel", "source": navy},
                {"type": "toggle", "count": 1, "ways": 3, "location": "handle", "label": "Three-stage switch", "source": navy},
                {"type": "toggle", "count": 1, "momentary": True, "location": "handle", "label": "Speed-brake spring-loaded switch", "source": navy},
            ],
            "controls_evidence": {
                "coverage": "partial",
                "source": navy,
                "checked": CHECKED,
                "notes": "Goods 306, model text TGRIP-18. The page lists two grips in the box (left and right). Counts above are the page's own bullet list, not the adjacent competitor comparison table. A finger lift or dual-throttle connector is required on Orion and Gemini bases. The earlier goods 375 page is the throttle combo, not this grip.",
            },
            "hardware": {"sensor": "hall"},
            "connectivity": {"standalone_usb": False},
            "physical": {"materials": ["aluminium"]},
            "prices": prices(306),
            "verification": "draft",
            "sources": [navy],
            "images": image_block("orion-2-f18-throttle", 306, "NavyAce Metal Throttle Grip"),
        },
    )
    srcs = [ORION32_MAN, goods(1705)]
    orion_controls = [
        {"type": "axis", "kind": "rudder", "count": 1, "location": "other", "label": "Main shaft, 76°", "source": ORION32_MAN},
        {"type": "axis", "kind": "toe_brake", "count": 2, "location": "other", "label": "Left and right pedal brakes, 15°", "source": ORION32_MAN},
    ]
    dump(
        COMP / "orion-32-rudder-pedals.yaml",
        {
            "brand": "winctrl",
            "name": "Orion 32 Rudder Pedals Metal",
            "category": "pedals",
            "platform_compatibility": plat(srcs),
            "status": "current",
            "handedness": "ambi",
            "mount": {"provides": None, "accepts": []},
            "controls": orion_controls,
            "controls_evidence": {
                "coverage": "complete",
                "source": ORION32_MAN,
                "checked": CHECKED,
                "notes": "Drawing shows 546×333×318 mm. The caption prints 54 mm for the long side; the drawing's 546 mm is used. Product page says Hall sensors on both pedals and the main axis. Damper is a separate purchase on this SKU. This is goods O.32.R.MET.1, not the older R1 Orion Metal pedals.",
            },
            "hardware": {
                "sensor": "hall",
                "axes": [
                    {"name": "Rudder", "sensor": "hall"},
                    {"name": "Left brake", "sensor": "hall"},
                    {"name": "Right brake", "sensor": "hall"},
                ],
                "throw_deg": 76,
                "damping": "optional_damper",
                "extension_support": False,
            },
            "connectivity": {"standalone_usb": True},
            "software": "SimApp Pro",
            "physical": {"weight_g": 8000, "dimensions_mm": [546, 333, 318], "materials": ["metal"]},
            "prices": prices(1705),
            "verification": "draft",
            "sources": srcs,
            "images": image_block("orion-32-rudder-pedals", 1705, "Orion 32 Rudder Pedals Metal"),
        },
    )
    srcs_d = [ORION32_MAN, goods(1845)]
    dump(
        COMP / "orion-32-rudder-pedals-damper.yaml",
        {
            "brand": "winctrl",
            "name": "Orion 32 Rudder Pedals Metal with Damper",
            "category": "pedals",
            "platform_compatibility": plat(srcs_d),
            "status": "current",
            "handedness": "ambi",
            "mount": {"provides": None, "accepts": []},
            "controls": orion_controls,
            "controls_evidence": {
                "coverage": "complete",
                "source": ORION32_MAN,
                "checked": CHECKED,
                "notes": "Same Orion 32 manual as the standard pedal. This goods code is O.32.R.MET.DAM.1, so the damper is included. The manual's 8.0 kg figure is the standard pedal manual and is not repeated here as a damper-equipped mass.",
            },
            "hardware": {
                "sensor": "hall",
                "axes": [
                    {"name": "Rudder", "sensor": "hall"},
                    {"name": "Left brake", "sensor": "hall"},
                    {"name": "Right brake", "sensor": "hall"},
                ],
                "throw_deg": 76,
                "damping": "damper",
                "extension_support": False,
            },
            "connectivity": {"standalone_usb": True},
            "software": "SimApp Pro",
            "physical": {"dimensions_mm": [546, 333, 318], "materials": ["metal"]},
            "prices": prices(1845),
            "verification": "draft",
            "sources": srcs_d,
            "images": image_block("orion-32-rudder-pedals-damper", 1845, "Orion 32 Rudder Pedals Metal with Damper"),
        },
    )
    srcs_r = [R1_MAN, goods(546)]
    dump(
        COMP / "orion-metal-rudder-pedals-damper.yaml",
        {
            "brand": "winctrl",
            "name": "Orion Metal Flight Rudder Pedals with Damper",
            "category": "pedals",
            "platform_compatibility": plat(srcs_r),
            "status": "current",
            "handedness": "ambi",
            "mount": {"provides": None, "accepts": []},
            "controls": [
                {"type": "axis", "kind": "rudder", "count": 1, "location": "other", "label": "Yaw, 38°", "source": R1_MAN},
                {"type": "axis", "kind": "toe_brake", "count": 2, "location": "other", "label": "Pedal pitch, 30°", "source": R1_MAN},
            ],
            "controls_evidence": {
                "coverage": "complete",
                "source": R1_MAN,
                "checked": CHECKED,
                "notes": "R1 metal pedal plus damper. Manual table: pitch 30° at 7.5 kg and yaw 38°. The yaw force cell says the  figure applies after the damper is installed. Published size 542×320×224 mm and 8.4 kg come from that same R1+DAMPER1 manual. The standard edition without the damper in the box is the existing skywalker-rudder-pedals record (goods 543).",
            },
            "hardware": {
                "axes": [{"name": "Rudder"}, {"name": "Left pedal pitch"}, {"name": "Right pedal pitch"}],
                "throw_deg": 38,
                "damping": "damper",
                "extension_support": False,
            },
            "connectivity": {"standalone_usb": True},
            "software": "SimApp Pro",
            "physical": {"weight_g": 8400, "dimensions_mm": [542, 320, 224], "materials": ["metal"]},
            "prices": prices(546),
            "verification": "draft",
            "sources": srcs_r,
            "images": image_block("orion-metal-rudder-pedals-damper", 546, "Orion Metal Flight Rudder Pedals with Damper"),
        },
    )
    print("identity records")


if __name__ == "__main__":
    write_pedals()
    write_bases()
    write_identity()
    write_rest()
    write_small_panels()
    write_bundles()
    print("emit done")
