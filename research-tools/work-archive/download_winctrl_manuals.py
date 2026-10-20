import urllib.request

urls = {
    'cyber_taurus': 'https://eu.winctrl.com/static/download/QmPeEHsVbPU2BfDBwXPwzQwoVGrafx6ZsvGdxBVS5WGF8b?filename=WINCTRL+Cyber+Taurus+Joystick+Base+User+Manual+20260430.pdf',
    'ex2_j2_2': 'https://eu.winctrl.com/static/download/QmPtTVatYdWyuGYVSFHMhBXTEWM9iU3g5S2nomoLczHDuS?filename=EX2_J2_2-User+Manual+EN+V1.2.pdf',
    'f16_grip': 'https://eu.winctrl.com/static/download/Qmbw11j3CZkVhfaFXFNx3aYRU2fJMKRLJj8eC7DtNyghMm?filename=JOYSTICK+GRIP+OF+16+H.O.T.A.S-User+MANUAL+EN+V+2.1.pdf',
    'pfp_3n': 'https://eu.winctrl.com/static/download/QmbGxzEGivxtFbfrnZMJNK68t6kx4XcbkBN4Qsct9L9ALQ?filename=PFP-3N-User+Manual+V1.0-20250124.pdf',
    'j2_2_base': 'https://eu.winctrl.com/static/download/QmQHHeiMhWatgMrJhm9QpHuQ7KDoHC6SuFG3aq39JyMAgx?filename=J2-2-BASE-User%20Manual%20EN%20V1.2.pdf'
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(f"work/{name}.pdf", "wb") as f:
            f.write(resp.read())
        print(f"Downloaded {name} successfully")
    except Exception as e:
        print(f"Failed {name}: {e}")
