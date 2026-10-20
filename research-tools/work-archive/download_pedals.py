import urllib.request

url = "https://eu.winctrl.com/static/download/QmTY8EjMA7JwXrPhnkf6ksToihf49mrjEPx6Uz45DBeh2X?filename=orion_pedals.pdf"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp, open("work/orion_pedals.pdf", "wb") as f:
        f.write(resp.read())
    print("Downloaded orion_pedals.pdf")
except Exception as e:
    print("Failed:", e)
