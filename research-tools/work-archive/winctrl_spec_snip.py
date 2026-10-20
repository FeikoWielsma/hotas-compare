"""Print the performance-parameter window from each manual."""
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
TEXT = Path(__file__).resolve().parent / "winctrl-sweep" / "pdf-text"
# hash -> label
LABELS = {
    "QmQewYduBVWvwYSvVxzH9GAseJyDfFVeUspknKwbzpeuZo": "32-throttle",
    "QmYhqkwsuNS7KKEEFbrsGtD5776QMcK55JWAEXNNRBou8U": "strikeace-15",
    "QmVFGazAj4BdEn5rUL273NxNsNJs6ynRrQ7Wvg5vSU5Knr": "viper-ex-throttle-v32",
    "QmZPAZez5Jc22RgvWKVPgq1hTGqbrK4Kr4uhfyGtbXjno3": "carrierace-grip",
    "Qmbw11j3CZkVhfaFXFNx3aYRU2fJMKRLJj8eC7DtNyghMm": "f16-grip-v21",
    "QmeVnq8phBC74SGCu2hfpkEqhUYjMmXMZwctDuiCChS9Cw": "f16-grip-v10",
    "QmQK51quPeFthZY6Qy3R46LtyS5wv6XPhco4nkYQbW66CA": "3xx-grip",
    "QmbtefE6pJx7LbNeTm1bweTUdRynrhDa5eB1jAtwgxfSz2": "ka50",
    "QmNZhTmbj8UTnsyfy8YSoJ5we9XLV7RcjdJRjrZTyBMhii": "gemini",
    "QmWTD6KLXTeybV5Brapf3RKXgrB52mBaF4poG67qhoMeoY": "orion-throttle-base",
    "QmQHHeiMhWatgMrJhm9QpHuQ7KDoHC6SuFG3aq39JyMAgx": "j2-2-base",
    "QmRTrd8xqZo8sNRZRLQv4dGq8ukc6bb37WuBBuESup4Yaq": "super-libra",
    "QmabSXmvPxNp2ZXHidaDhGq73XGHyKicn6YWrgQksanXDp": "fighter-l",
    "QmTvHcYNoR17Ro8AHmA7j6jpqwnHHbaYWS8dXGxM8QbTgh": "fighter-r",
    "QmfFcdFqWFoe3S1vo51wpCPW9ZKRnDc6mRPb7sd6S45y6R": "space-l",
    "QmRCiq3fVwnXeQQu4re2geG4oPFSPxYYCbjtFGE9WR1CXJ": "space-r",
    "QmRwKSeCfwDz515Bk8qVY5weZbPCGbgqE4dMHjxbQFgc4T": "airline-r",
    "QmUio6d7HvAeeYGSxhBs7RNaUM4waaRvRhv2nvTzo1y3Ri": "nws-l",
    "QmcW5ZWJhzpvm8UcnrQeHcZfyxh9w6hYv4RFaN9uQZYbKu": "nws-r",
    "QmchgWqWW5Ebro72Q2QC8mSmQhkUj2qST24C8H3jPZhTza": "pap3",
    "QmbGxzEGivxtFbfrnZMJNK68t6kx4XcbkBN4Qsct9L9ALQ": "pfp3n",
    "Qme9Ze3mTQd3T5DNiThEsTAJNWt1qHjAsV1QGFGWebH2Ep": "pfp4",
    "QmYXF4nioKgqenQJ3LJRqbwimFJxFkKdw54m297cfSNkQN": "pfp7",
    "QmXRD7YaBFQ84AWQvaK4Qm4Qn8dSyh3xrZZgUiFgs33VKP": "mcdu",
    "QmaNia5yLCgSvvnhtU6n1k1bwDHfYV5K8CSdnLEk2K7MCx": "fcu",
    "QmUZU73aqkdY3Zs59noF8oKHM43A9WtoqVvxcCTRAk7Xjc": "efis-l",
    "QmNxtiacuKV6KPA9xhGHK236fhhx9Vc16yeDEGpiYBhJ4t": "efis-r",
    "QmVrk3UKELySkVn4UjK9XrzVBn32Mtih2LCtKMocgVnFAt": "pac",
    "QmVKXy8jQzVyfdmWFSTxkc9hXAwpMMmSBYMN4YEFAgazcL": "agp",
    "QmWZ594jqQ6Qa2GVZ6mfWL4ZDvAo37NFeYqtPQ1aekWJh7": "ecam",
    "QmNVm4aVgsu3xrcCmACpPvMtgoiJn3rSdsBX9ohpYpmSw2": "tcas",
    "QmeE6f3JKbduJmQt8Ck9EA2LNyh6Uw1wrjS8GqZFAwAEPD": "rmp",
    "QmRZUBzvsURGGZ84ma9T4LRS5gEVekPFf3qjWmJeNmb82g": "pdc3m",
    "QmUCdN2byoGPYV7Ayz82cEhLG96zQ48H6a4ZuDosFViZ9B": "pdc3n",
    "QmZQ47N54H4j4xh4a3PWPVWo2szubdDzdB3iKx8Arj4o9a": "pto2",
    "Qmc6qiCzmdAfKppzyXpd3yukyuFEM6NmMqGmDwkxjKSAQT": "pcr",
    "QmVUekeGd37nnGiFxhEufKT7Mjtw5zkySFZPLSTgVmFYHN": "icp",
    "QmPM5B75RK5UGNrmuc9CWAb2DtE4Gygtqu4aPGzVX4qUNv": "mfd",
    "QmZhYCnLyWXRbasmafyG11UF5gfouw2PXiz6KdDvdgrJ48": "hud",
    "QmREPuUfauWWYjBq5VwR2wiYgpwmZkca1XAbxjsUntBmHP": "ufc",
    "QmNjs6oJuxhJ5KPNn5qAh84VkD6mMPkt6FLx4xwP6YDhfS": "carrier-ufc2",
    "QmYFqVUUAVJcG5Xyg9XuRtMhMwyvWiWGcz7SYZhfCTa6XK": "display",
}

keys = ("button", "switch", "wheel", "encoder", "axis", "hat", "knob", "lever", "rocker", "rotary", "hall", "usb", "weight", "mm")
out = []
for h, label in LABELS.items():
    text = (TEXT / f"{h}.txt").read_text(encoding="utf-8")
    # first 12 pages only
    pages = text.split("===== PAGE ")
    chunk = []
    for p in pages[1:13]:
        body = p.split("\n", 1)[-1]
        for line in body.splitlines():
            low = line.lower()
            if any(k in low for k in keys) and len(line.strip()) > 2:
                chunk.append(line.strip())
    out.append(f"\n## {label}\n" + "\n".join(chunk[:40]))
Path = Path
dest = TEXT.parent / "spec-snip.txt"
dest.write_text("\n".join(out), encoding="utf-8")
print("wrote", dest, "chars", dest.stat().st_size)
