import os, sys, requests, fitz

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}

manuals = {
    'ab9': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ab9_force_feedback_base_manual.pdf',
    'ay210': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ay210_ffb_yoke_base_manual.pdf',
    'ab6': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ab6_flight_simulator_manual.pdf',
    'ay90': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_AY90_Yoke_Base_User_Manual.pdf',
    'mh16': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mh16_flightstick_manual.pdf',
    'ma3x': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_ma3x_side_stick_manual.pdf',
    'mfy_handle': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MFY_Yoke_Handle-User_Manual_update.pdf',
    'mhg': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mhg_flightsticks_manual.pdf',
    'mfy_pro': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MFY_Pro_Yoke_Handle_User_Manual.pdf',
    'mtp': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtp_throttle_panel_manual.pdf',
    'mtq': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtq_throttle_panel_manual.pdf',
    'mtlp': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_mtlp_panel_manual.pdf',
    'mrp': 'https://image.mozaracing.com/manuals/moza_mrp_rudder_pedals_manual.pdf',
    'z_axis': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/moza_z_axis_manual.pdf',
    'ma3f_efcm': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MA3F_Electronic_Flight_Control_Modules_User_Manual.pdf',
    'ma3f_fcd': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MA3F_Flight_Computer_Display_User_Manual.pdf',
    'mb7f_fcd': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MB7F_Flight_Computer_Display_User_Manual.pdf',
    'mgx1000': 'https://cdn.shopify.com/s/files/1/0937/0802/6176/files/MOZA_MGX1000_Instrument_Panel_User_Manual.pdf',
}

os.makedirs('work/moza_pdfs', exist_ok=True)
os.makedirs('work/moza_pages', exist_ok=True)

for name, url in manuals.items():
    pdf_path = f"work/moza_pdfs/{name}.pdf"
    if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
        print(f"Downloading {name} from {url} ...")
        try:
            r = requests.get(url, headers=UA, timeout=60)
            if r.status_code == 200 and r.content[:4] == b'%PDF':
                with open(pdf_path, 'wb') as f:
                    f.write(r.content)
                print(f"  Saved {name}.pdf ({len(r.content)} bytes)")
            else:
                print(f"  Failed {name}: status {r.status_code}, prefix {r.content[:10]}")
                continue
        except Exception as e:
            print(f"  Error {name}: {e}")
            continue
    else:
        print(f"Using cached {pdf_path}")

    # Render pages to PNG
    try:
        doc = fitz.open(pdf_path)
        print(f"{name}: {len(doc)} pages")
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=200)
            out_png = f"work/moza_pages/{name}_page_{i+1}.png"
            pix.save(out_png)
    except Exception as e:
        print(f"Error rendering {name}: {e}")
