import urllib.request

urls = {
    'ursa_l': 'https://eu.winctrl.com/static/download/QmTNG9wYC7V5h4a5U4m2ZbYY55uag2c3wQc2MUw9m7KXHK?filename=URSA+MINOR-Airlines-Joystick+L-User+Manual-V1.3.pdf',
    'ursa_r_13': 'https://eu.winctrl.com/static/download/QmTvHcYNoR17Ro8AHmA7j6jpqwnHHbaYWS8dXGxM8QbTgh?filename=URSA+MINOR-Fighter-Joystick+R-User+Manual+V1.3+20250708.pdf',
    'ursa_r_10': 'https://eu.winctrl.com/static/download/QmZmKJ7NdwQ8FDSQrSCgHTz8czJdWTEi9YduELWz63pqMU?filename=URSA+MINOR-Fighter-Joystick+R-User+Manual+EN+V1.0.pdf'
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
