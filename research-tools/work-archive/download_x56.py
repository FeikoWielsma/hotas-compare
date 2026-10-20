import urllib.request

url = "https://www.logitech.com/assets/65324/x56-hotas.pdf"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp, open("work/logi-x56.pdf", "wb") as f:
        f.write(resp.read())
    print("Downloaded logi-x56.pdf successfully")
except Exception as e:
    print("Download failed:", e)
