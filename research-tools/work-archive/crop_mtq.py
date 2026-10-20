from PIL import Image

im = Image.open('public/images/moza/mtq-throttle.webp')
w, h = im.size
# Crop the base panel below the levers
# MTQ has a base panel in front of the levers
panel = im.crop((int(w*0.1), int(h*0.35), int(w*0.9), int(h*0.85)))
panel.save('work/mtq_panel.png')
print("Saved MTQ panel image, size:", panel.size)
