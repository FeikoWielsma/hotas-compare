import urllib.request, re, json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def print_tech_specs(name, url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    print(f"=== {name} ===")
    pos = html.find('techSpecs:')
    if pos != -1:
        # print the next 2000 chars
        snippet = html[pos:pos+3000]
        # find all facet / value pairs
        for f, v in re.findall(r'facet:"([^"]+)",(?:versions:"[^"]*",later:"[^"]*",)?value:"([^"]*)"', snippet):
            if v:
                print(f"  {f}: {v}")
            else:
                print(f"  [{f}]")
    else:
        print("techSpecs not found")

print_tech_specs('x56', 'https://www.logitechg.com/en-us/shop/p/x56-space-flight-vr-simulator-controller')
print_tech_specs('pedals', 'https://www.logitechg.com/en-us/shop/p/flight-simulator-rudder-pedals.945-000024')
print_tech_specs('yoke', 'https://www.logitechg.com/en-us/shop/p/flight-simulator-yoke-system.945-000023')
print_tech_specs('quadrant', 'https://www.logitechg.com/en-us/shop/p/flight-simulator-throttle-quadrant.945-000032')
