import urllib.request

manuals = {
    't2_throttle_base': 'QmWTD6KLXTeybV5Brapf3RKXgrB52mBaF4poG67qhoMeoY',
    'f16_throttle_handle': 'QmVFGazAj4BdEn5rUL273NxNsNJs6ynRrQ7Wvg5vSU5Knr',
    'viperace_throttle_grip_v2': 'QmVogWajtbAAa6iTNGjYJBncNX696Loiwywwf3FDMjyL1A',
    'j2_orion_base': 'QmXi7KXuGuoQGKUhmxeQaQLk8jHBHyKnjpvApgPuGxNcyf',
    'icp_manual': 'QmVUekeGd37nnGiFxhEufKT7Mjtw5zkySFZPLSTgVmFYHN',
    'carrierace_f18_grip': 'QmZPAZez5Jc22RgvWKVPgq1hTGqbrK4Kr4uhfyGtbXjno3',
    'f18_install_guide': 'QmTbz3Hcsc2WsWxfpTarWhymaaYTBPziMVTQikfCCp3Xja'
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, h in manuals.items():
    url = f"https://eu.winctrl.com/static/download/{h}?filename={name}.pdf"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(f"work/{name}.pdf", "wb") as f:
            f.write(resp.read())
        print(f"Downloaded {name} successfully")
    except Exception as e:
        print(f"Failed {name}: {e}")
