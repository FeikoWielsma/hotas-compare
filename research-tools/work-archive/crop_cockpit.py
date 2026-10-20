from PIL import Image

im = Image.open('work/pdf_extracted_imgs/mtlp/p5_img1_1263x670.jpeg')
# In MOZA Cockpit, the left side has sidebar, middle has device diagram, right side has settings
w, h = im.size
print("Cockpit screenshot size:", w, h)
# Let's crop the device diagram area in the middle/left
diagram = im.crop((int(w*0.1), int(h*0.1), int(w*0.75), int(h*0.95)))
diagram.save('work/mtlp_crops/cockpit_diagram.png')

# Also crop the right panel (settings/list)
settings = im.crop((int(w*0.75), 0, w, h))
settings.save('work/mtlp_crops/cockpit_settings.png')
print("Cropped cockpit diagram and settings")
