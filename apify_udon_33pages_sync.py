# -*- coding: utf-8 -*-
"""
NEXTSITE AI - UDON THANI 33 PAGES APIFY SCRAPER & FILTERING PIPELINE
ดึงโพสต์จาก 33 เพจรับสร้างบ้าน จ.อุดรธานี และคัดกรองเฉพาะโพสต์ที่มีคำว่า "อุดร" หรือ 20 อำเภอ (สูงสุด 5 โพสต์ล่าสุดต่อเพจ)
"""

import os
import json
import re
from datetime import datetime

# ==========================================
# 1. กำหนดค่า APIFY TOKEN
# ==========================================
APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN", "YOUR_APIFY_API_TOKEN")

# ==========================================
# 2. รายชื่อ 33 เพจเป้าหมายใน จ.อุดรธานี
# ==========================================
TARGET_33_PAGES = [
    {"id": "udon-01", "name": "มหารุ่งโรจน์ รับสร้างบ้าน อุดรธานี", "url": "https://www.facebook.com/maharungroj/?locale=th_TH"},
    {"id": "udon-02", "name": "UD Home Engineering รับสร้างบ้านอุดร", "url": "https://www.facebook.com/UD.HomeEn/?locale=th_TH"},
    {"id": "udon-03", "name": "MODERN DE House Builder อุดรธานี", "url": "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"},
    {"id": "udon-04", "name": "Twenty Six House รับสร้างบ้านอุดรธานี", "url": "https://www.facebook.com/Twentysix.house/?locale=th_TH"},
    {"id": "udon-05", "name": "Nasit House and Design อุดรธานี", "url": "https://www.facebook.com/nasithouseanddesign/?locale=th_TH"},
    {"id": "udon-06", "name": "ส.การช่าง รับสร้างบ้านอุดรธานี", "url": "https://www.facebook.com/share/1DizCH5LWR/?mibextid=wwXIfr"},
    {"id": "udon-07", "name": "เอสเค บิลดิ้งโฮม อุดรธานี", "url": "https://www.facebook.com/share/1976Zj9Qc4/?mibextid=wwXIfr"},
    {"id": "udon-08", "name": "ซีเนียร์ โฮมบิลเดอร์ อุดรธานี", "url": "https://www.facebook.com/share/1Du2j6MnLh/?mibextid=wwXIfr"},
    {"id": "udon-09", "name": "เฟิร์สแลนด์ แอนด์ ทาวน์ อุดรธานี", "url": "https://www.facebook.com/firstlandtown/?locale=th_TH"},
    {"id": "udon-10", "name": "แอลเอช รับสร้างบ้าน อุดรธานี", "url": "https://www.facebook.com/LH2553/?locale=th_TH"},
    {"id": "udon-11", "name": "พีเจ โฮมดีไซน์ อุดรธานี", "url": "https://www.facebook.com/share/1KVoCEXt6J/?mibextid=wwXIfr"},
    {"id": "udon-12", "name": "วัฒนาการช่าง รับสร้างบ้านอุดรธานี", "url": "https://www.facebook.com/wattanahousebuilding/"},
    {"id": "udon-13", "name": "จูปิเตอร์ คอนสตรัคชั่น อุดรธานี", "url": "https://www.facebook.com/JupiterCompanyLimited/?locale=th_TH"},
    {"id": "udon-14", "name": "เคเคซี โฮมบิลเดอร์ อุดรธานี", "url": "https://www.facebook.com/kkchome.co.th/"},
    {"id": "udon-15", "name": "338 รับสร้างบ้าน สาขาอุดรธานี", "url": "https://www.facebook.com/ubon338/?locale=th_TH"},
    {"id": "udon-16", "name": "เคดับบลิว โฮม อุดรธานี", "url": "https://www.facebook.com/KWHOME2018/?locale=th_TH"},
    {"id": "udon-17", "name": "ธนเศรษฐ์ รับสร้างบ้าน อุดรธานี", "url": "https://www.facebook.com/THANASETHOFFICIAL/?locale=th_TH"},
    {"id": "udon-18", "name": "บ้านอรุณ รับสร้างบ้าน อุดรธานี", "url": "https://www.facebook.com/baanarun.homebuilding/"},
    {"id": "udon-19", "name": "เอสพี โฮมคอนสตรัคชั่น อุดรธานี", "url": "https://www.facebook.com/profile.php?id=61586971197602"},
    {"id": "udon-20", "name": "สมาร์ทลิฟวิ่ง รับสร้างบ้านอุดร", "url": "https://www.facebook.com/share/1CAVeACDiW/?mibextid=wwXIfr"},
    {"id": "udon-21", "name": "เอดี โฮม แอนด์ ดีไซน์ อุดรธานี", "url": "https://www.facebook.com/adhomeanddesign/"},
    {"id": "udon-22", "name": "โกลด์เฮ้าส์ พร็อพเพอร์ตี้ อุดรธานี", "url": "https://www.facebook.com/goldhouseproperty/?locale=th_TH"},
    {"id": "udon-23", "name": "มายด์โฮม แกรนด์ อุดรธานี", "url": "https://www.facebook.com/MindHome.Grand/"},
    {"id": "udon-comp-33", "name": "หจก. เอกชัย รุ่งเรือง การช่าง", "url": "https://www.facebook.com/profile.php?id=100078939424242"}
]

# ==========================================
# 3. คีย์เวิร์ดจังหวัด และ 20 อำเภอใน จ.อุดรธานี
# ==========================================
PROVINCE_KEYWORDS = ["อุดร", "อุดรธานี", "จ.อุดร", "udon", "udon thani"]

DISTRICT_LIST = [
    {"district": "เมืองอุดรธานี", "terms": ["เมืองอุดรธานี", "เมืองอุดร", "อำเภอเมืองอุดร", "อ.เมือง จ.อุดร", "อ.เมือง อุดร", "อ.เมืองอุดร", "อำเภอเมือง", "บ้านหนองใส", "หนองใส", "หมากแข้ง", "บ้านเลื่อม", "หนองบัว", "หนองขอนกว้าง", "บ้านจาน", "เชียงพิณ", "หนองนาคำ", "หมูม่น", "โนนสูง", "สามพร้าว", "บ้านจั่น", "กุดสระ", "นิคมสงเคราะห์", "นาดี", "รังษิณา", "ขนส่งรังษิณา", "อุดรดุษฎี", "ถนนอุดรดุษฎี", "ดอนเสือ", "หนองประจักษ์", "ยูดีทาวน์"]},
    {"district": "กุดจับ", "terms": ["กุดจับ", "อำเภอกุดจับ", "อ.กุดจับ", "ตาลเลียน", "เมืองเพีย"]},
    {"district": "หนองวัวซอ", "terms": ["หนองวัวซอ", "อำเภอหนองวัวซอ", "อ.หนองวัวซอ", "กุดหมากไฟ", "หนองอ้อ"]},
    {"district": "กุมภวาปี", "terms": ["กุมภวาปี", "อำเภอกุมภวาปี", "อ.กุมภวาปี", "พันดอน"]},
    {"district": "โนนสะอาด", "terms": ["โนนสะอาด", "อำเภอโนนสะอาด", "อ.โนนสะอาด"]},
    {"district": "หนองหาน", "terms": ["หนองหาน", "อำเภอหนองหาน", "อ.หนองหาน", "บ้านเชียง"]},
    {"district": "ทุ่งฝน", "terms": ["ทุ่งฝน", "อำเภอทุ่งฝน", "อ.ทุ่งฝน"]},
    {"district": "ไชยวาน", "terms": ["ไชยวาน", "อำเภอไชยวาน", "อ.ไชยวาน"]},
    {"district": "ศรีธาตุ", "terms": ["ศรีธาตุ", "อำเภอศรีธาตุ", "อ.ศรีธาตุ"]},
    {"district": "วังสามหมอ", "terms": ["วังสามหมอ", "อำเภอวังสามหมอ", "อ.วังสามหมอ"]},
    {"district": "บ้านดุง", "terms": ["บ้านดุง", "อำเภอบ้านดุง", "อ.บ้านดุง", "คำชะโนด"]},
    {"district": "บ้านผือ", "terms": ["บ้านผือ", "อำเภอบ้านผือ", "อ.บ้านผือ"]},
    {"district": "น้ำโสม", "terms": ["น้ำโสม", "อำเภอน้ำโสม", "อ.น้ำโสม", "นางัว"]},
    {"district": "เพ็ญ", "terms": ["เพ็ญ", "อำเภอเพ็ญ", "อ.เพ็ญ"]},
    {"district": "สร้างคอม", "terms": ["สร้างคอม", "อำเภอสร้างคอม", "อ.สร้างคอม"]},
    {"district": "หนองแสง", "terms": ["หนองแสง", "อำเภอหนองแสง", "อ.หนองแสง"]},
    {"district": "นายูง", "terms": ["นายูง", "อำเภอนายูง", "อ.นายูง"]},
    {"district": "พิบูลย์รักษ์", "terms": ["พิบูลย์รักษ์", "อำเภอพิบูลย์รักษ์", "อ.พิบูลย์รักษ์"]},
    {"district": "กู่แก้ว", "terms": ["กู่แก้ว", "อำเภอกู่แก้ว", "อ.กู่แก้ว"]},
    {"district": "ประจักษ์ศิลปาคม", "terms": ["ประจักษ์ศิลปาคม", "ประจักษ์", "อำเภอประจักษ์", "อ.ประจักษ์ศิลปาคม", "นาม่วง", "ต.นาม่วง", "เชียงกรม", "บ้านเชียงกรม"]}
]

KHONKAEN_DISTRICTS = [
    {"district": "เมืองขอนแก่น", "terms": ["เมืองขอนแก่น", "อำเภอเมืองขอนแก่น", "อ.เมืองขอนแก่น", "อ.เมือง ขอนแก่น", "เมือง ขอนแก่น", "กังสดาล", "บึงแก่นนคร", "โนนทัน", "ศิลา", "บ้านเป็ด", "ในเมืองขอนแก่น", "มอดินแดง", "บึงหนองโคตร", "มข.", "มหาวิทยาลัยขอนแก่น", "โนนทัน - บึงแก่นนคร"]},
    {"district": "บ้านฝาง", "terms": ["บ้านฝาง", "อำเภอบ้านฝาง", "อ.บ้านฝาง"]},
    {"district": "พระยืน", "terms": ["พระยืน", "อำเภอพระยืน", "อ.พระยืน"]},
    {"district": "หนองเรือ", "terms": ["หนองเรือ", "อำเภอหนองเรือ", "อ.หนองเรือ", "ดอนโมง"]},
    {"district": "ชุมแพ", "terms": ["ชุมแพ", "อำเภอชุมแพ", "อ.ชุมแพ", "โนนหัน"]},
    {"district": "สีชมพู", "terms": ["สีชมพู", "อำเภอสีชมพู", "อ.สีชมพู"]},
    {"district": "น้ำพอง", "terms": ["น้ำพอง", "อำเภอน้ำพอง", "อ.น้ำพอง", "น้ำพองพัฒนา"]},
    {"district": "อุบลรัตน์", "terms": ["อุบลรัตน์", "อำเภออุบลรัตน์", "อ.อุบลรัตน์", "เขื่อนอุบลรัตน์"]},
    {"district": "กระนวน", "terms": ["กระนวน", "อำเภอกระนวน", "อ.กระนวน"]},
    {"district": "บ้านไผ่", "terms": ["บ้านไผ่", "อำเภอบ้านไผ่", "อ.บ้านไผ่"]},
    {"district": "เปือยน้อย", "terms": ["เปือยน้อย", "อำเภอเปือยน้อย", "อ.เปือยน้อย"]},
    {"district": "พล", "terms": ["เมืองพล", "อำเภอพล", "อ.พล", "เทศบาลเมืองพล"]},
    {"district": "แวงใหญ่", "terms": ["แวงใหญ่", "อำเภอแวงใหญ่", "อ.แวงใหญ่"]},
    {"district": "แวงน้อย", "terms": ["แวงน้อย", "อำเภอแวงน้อย", "อ.แวงน้อย"]},
    {"district": "หนองสองห้อง", "terms": ["หนองสองห้อง", "อำเภอหนองสองห้อง", "อ.หนองสองห้อง"]},
    {"district": "ภูเวียง", "terms": ["ภูเวียง", "อำเภอภูเวียง", "อ.ภูเวียง"]},
    {"district": "มัญจาคีรี", "terms": ["มัญจาคีรี", "อำเภอมัญจาคีรี", "อ.มัญจาคีรี"]},
    {"district": "ชนบท", "terms": ["ชนบท", "อำเภอชนบท", "อ.ชนบท"]},
    {"district": "เขาสวนกวาง", "terms": ["เขาสวนกวาง", "อำเภอเขาสวนกวาง", "อ.เขาสวนกวาง"]},
    {"district": "ภูผาม่าน", "terms": ["ภูผาม่าน", "อำเภอภูผาม่าน", "อ.ภูผาม่าน"]},
    {"district": "ซำสูง", "terms": ["ซำสูง", "อำเภอซำสูง", "อ.ซำสูง"]},
    {"district": "โคกโพธิ์ไชย", "terms": ["โคกโพธิ์ไชย", "อำเภอโคกโพธิ์ไชย", "อ.โคกโพธิ์ไชย"]},
    {"district": "หนองนาคำ", "terms": ["หนองนาคำ", "อำเภอหนองนาคำ", "อ.หนองนาคำ"]},
    {"district": "บ้านแฮด", "terms": ["บ้านแฮด", "อำเภอบ้านแฮด", "อ.บ้านแฮด"]},
    {"district": "โนนศิลา", "terms": ["โนนศิลา", "อำเภอโนนศิลา", "อ.โนนศิลา"]},
    {"district": "เวียงเก่า", "terms": ["เวียงเก่า", "อำเภอเวียงเก่า", "อ.เวียงเก่า"]}
]

def check_strict_udon_location(raw_text):
    if not raw_text:
        return False, None, []
    
    # ดึงเฉพาะ 3-4 บรรทัดแรกของโพสต์เพื่อคัดกรองหน้างานจริง (เพราะข้อความหลังๆ มักเป็นข้อความติดต่อ/โปรโมชั่นทั่วไป)
    lines = [l.strip() for l in str(raw_text).splitlines() if l.strip()]
    top_4_text = " ".join(lines[:4])
    
    # ตัดส่วน Footer / ท้ายโพสต์
    footer_delims = [
        "**รับงานเริ่มต้น", "รับงานเริ่มต้น", "ยื่นสินเชื่อ ออกแบบ", "การันตีด้วยผลงาน", "พร้อมบริการสุดพิเศษ",
        "สนใจสร้างบ้าน", "สนใจสอบถาม", "สอบถามข้อมูล", "สอบถามเพิ่มเติม",
        "ปรึกษาเรื่องสร้างบ้าน", "ติดต่อเรา", "รับดูแลลูกค้า", "พื้นที่ให้บริการ", "บริการสร้างบ้านในพื้นที่",
        "ครอบคลุมพื้นที่", "โซนให้บริการ", "พิกัดสำนักงาน", "ที่ตั้งสำนักงาน", "ที่ตั้งออฟฟิศ", "พิกัดออฟฟิศ",
        "ถ.เลี่ยงเมืองอุดร", "ต.บ้านจั่น อ.เมือง", "ต.บ้านเลื่อม อ.เมือง", "ฟรี ! ดำเนินการ", "ฟรี! ดำเนินการ", "ฟรี ! ยื่นขอ", "ฟรี! ยื่นขอ",
        "ฟรี ! ออกแบบ", "ฟรี! ออกแบบ", "maps.app.goo.gl", "https://maps", "โทร.", "โทร :",
        "| อุดรธานี", "| สกลนคร", "📍 facebook", "facebook :", "#รับสร้างบ้าน", "#สร้างบ้าน", "#syhouse"
    ]
    
    body_text = top_4_text if top_4_text else raw_text
    for delim in footer_delims:
        idx = body_text.find(delim)
        if idx != -1 and idx > 20:
            body_text = body_text[:idx]
            
    # ตัด Hashtags ออก
    body_text_no_tags = re.sub(r"#\S+", " ", body_text)
    text_lower = body_text_no_tags.lower()

    # ตรวจจับโพสต์โฆษณา / ขายแบบ 3D / สโลแกนประชาสัมพันธ์ / โปรโมชั่น (ไม่ใช่หน้างานจริง)
    marketing_catalog_patterns = [
        "เพราะบ้านคือความฝัน", "สร้างบ้านทั้งที", "วันแรกจนถึงวันรับกุญแจ", "วันรับกุญแจ",
        "ดูแลตั้งแต่เริ่มออกแบบจนส่งมอบ", "ออกแบบจนส่งมอบ", "ควบคุมงานโดยวิศวกร",
        "การันตีความน่าเชื่อถือ", "ชื่อนี้ที่มั่นใจ", "รับงานเริ่มต้น", "การันตีด้วยผลงานคุณภาพ",
        "บริการครบวงจร", "สร้างจริง เสร็จจริง", "ยื่นสินเชื่อทุกธนาคาร", "ฟรี ! ดำเนินการยื่นสินเชื่อ",
        "เริ่มต้นเพียง", "ราคาเริ่มต้น", "โปรโมชั่นพิเศษ", "แถมฟรีเสาเข็ม",
        "ปรึกษาฟรี", "จองวันนี้", "รับส่วนลด", "แจกฟรี", "ผ่อนเริ่มต้น", "กู้ได้เต็ม",
        "แบบบ้านยอดนิยม", "แบบบ้านแนะนำ", "แบบบ้านขายดี",
        "พร้อมให้คุณเป็นเจ้าของ", "แพ็กเกจสร้างบ้าน", "จองโปรโมชั่น", "แบบบ้าน modern",
        "3d", "perspective", "ภาพ 3d", "ภาพสามมิติ", "ภาพจำลอง", "ภาพเสมือนจริง",
        "วางแผนทิศบ้าน", "ก่อนสร้างบ้าน", "ทิศแดด", "ทิศลม", "ผลงานสร้างเสร็จจริงกว่า", "ผลงานคุณภาพมากกว่า"
    ]

    # คีย์เวิร์ดสัญญาณหน้างานที่กำลังก่อสร้างจริง (Active On-site Construction Signals)
    construction_site_keywords = [
        "ยกเสาเอก", "พิธียกเสาเอก", "เสาเอก", "ฤกษ์ยกเสาเอก", "ลงเสาเอก", "ยกเสาโท",
        "ลงเสาเข็ม", "เสาเข็ม", "ตอกเสาเข็ม", "เจาะเสาเข็ม",
        "ฐานราก", "งานฐานราก", "ตอม่อ", "คานคอดิน", "เทคาน", "ผูกเหล็ก", "เทพื้น", "เทคอนกรีต", "เทปูน",
        "ตั้งเสา", "มุงหลังคา", "โครงหลังคา", "โครงสร้าง", "งานโครงสร้าง", "ก่ออิฐ", "ฉาบปูน",
        "site update", "อัปเดตหน้างาน", "อัพเดทหน้างาน", "อัปเดตไซด์งาน", "อัพเดทไซด์งาน",
        "อัปเดตความคืบหน้า", "อัพเดทความคืบหน้า", "ความคืบหน้าหน้างาน", "ความคืบหน้าไซด์งาน", "ความคืบหน้างานก่อสร้าง",
        "ส่งมอบบ้าน", "ส่งมอบงาน", "ตรวจงาน", "ตรวจหน้างาน", "ตรวจรับบ้าน", "สู่การเริ่มต้นก่อสร้างจริง"
    ]
    
    is_active_construction = any(k in text_lower for k in construction_site_keywords)
    has_customer_home = any(k in text_lower for k in ["บ้านคุณ", "บ้านของคุณ", "ของบ้านคุณ", "ของคุณหมอ", "ของคุณ"])

    # ตรวจสอบว่าตรงกับอำเภอใน จ.อุดรธานี หรือไม่
    matched_udon_district = None
    found_terms = []
    for d in DISTRICT_LIST:
        for t in d["terms"]:
            if t.lower() in text_lower:
                matched_udon_district = d["district"]
                found_terms.append(t)
                break
        if matched_udon_district:
            break

    # รายชื่อจังหวัดอื่นนอกเหนืออุดรธานีในข้อความหลัก (ถ้าไม่ใช่แค่ hashtag ท้ายโพสต์)
    # แต่ถ้าเป็นโพสต์หน้างานก่อสร้างจริงจากเพจผู้รับเหมาอุดร ให้พิจารณาว่าเป็นหน้างานจริง
    other_provinces_strict = [
        "ขอนแก่น", "สกลนคร", "ร้อยเอ็ด", "กาฬสินธุ์", "หนองบัวลำภู", "นครพนม",
        "เลย", "บึงกาฬ", "มหาสารคาม", "อุบลราชธานี", "นครราชสีมา", "โคราช",
        "เชียงใหม่", "กรุงเทพ", "กทม", "ชลบุรี", "ระยอง"
    ]

    # กฎการคัดกรองตามที่กำหนด:
    # 1) ถ้าเป็น "หน้างานที่กำลังก่อสร้างจริง" (ยกเสาเอก, ฐานราก, โครงสร้าง, Site Update, บ้านคุณ...)
    #    -> ดึงมาเลย! แม้จะไม่มีชื่ออำเภอในอุดร (กำหนดอำเภอเป็น เมืองอุดรธานี หรือ อำเภอที่พบ)
    if is_active_construction or (has_customer_home and any(k in text_lower for k in ["ก่อสร้าง", "สร้าง", "เสา", "คาน", "แบบ"])):
        final_dist = matched_udon_district if matched_udon_district else "เมืองอุดรธานี"
        signal_tags = found_terms if found_terms else ["หน้างานก่อสร้างจริง"]
        if any(k in text_lower for k in ["ยกเสาเอก", "พิธียกเสาเอก", "เสาเอก"]): signal_tags.append("ยกเสาเอก")
        if any(k in text_lower for k in ["ฐานราก", "คานคอดิน", "ตอม่อ"]): signal_tags.append("งานฐานราก")
        if any(k in text_lower for k in ["โครงสร้าง", "เสา", "หลังคา"]): signal_tags.append("งานโครงสร้าง")
        if any(k in text_lower for k in ["site update", "อัปเดต", "ความคืบหน้า"]): signal_tags.append("Site Update")
        return True, final_dist, signal_tags, "อุดรธานี"

    # 2) ถ้ามีชื่อ "อำเภอในอุดรธานี" ระบุชัดเจน -> ดึงมา
    if matched_udon_district is not None:
        return True, matched_udon_district, found_terms, "อุดรธานี"

    # 3) ถ้ามีแค่ #รับสร้างบ้านอุดรธานี หรือคำทั่วไป ลอยๆ โดยไม่มีอำเภอและไม่ใช่หน้างานก่อสร้างจริง -> ไม่ต้องดึง
    return False, None, [], "อุดรธานี"

def run_apify_scraper_33_pages(max_posts_per_page=10):
    """
    รัน Apify Scraper สำหรับ 33 เพจ และดึงผลลัพธ์มาคัดกรอง 10 โพสต์ล่าสุดต่อเพจ
    """
    try:
        from apify_client import ApifyClient
    except ImportError:
        print("⚠️ กรุณาติดตั้ง apify-client ก่อนด้วยคำสั่ง: pip install apify-client")
        return None

    if APIFY_API_TOKEN == "YOUR_APIFY_API_TOKEN":
        print("⚠️ กรุณาระบุ APIFY_API_TOKEN ก่อนรันสคริปต์")
        return None

    client = ApifyClient(APIFY_API_TOKEN)
    
    print(f"🚀 [1/3] เริ่มสั่งรัน Apify Scraper สำหรับ {len(TARGET_33_PAGES)} เพจใน จ.อุดรธานี...")
    
    start_urls = [{"url": p["url"]} for p in TARGET_33_PAGES]
    
    run_input = {
        "startUrls": start_urls,
        "resultsLimit": 25,          # ดึงมา 25 โพสต์ล่าสุดต่อเพจเพื่อนำมาคัดกรอง
        "maxPosts": len(TARGET_33_PAGES) * 25,
        "commentsMode": "NONE",
        "proxy": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"]
        }
    }
    
    run = client.actor("apify/facebook-posts-scraper").call(run_input=run_input)
    dataset_id = run["defaultDatasetId"]
    print(f"✅ [2/3] Apify Scraper ทำงานเสร็จสิ้น (Dataset ID: {dataset_id})")
    
    print("🔍 [3/3] กำลังคัดกรองโพสต์ตามคีย์เวิร์ด จ.อุดรธานี และ 20 อำเภอ...")
    raw_items = client.dataset(dataset_id).list_items().items
    
    # จัดกลุ่มโพสต์ตามเพจ
    filtered_results = {}
    for comp in TARGET_33_PAGES:
        filtered_results[comp["url"]] = {
            "companyId": comp["id"],
            "companyName": comp["name"],
            "pageUrl": comp["url"],
            "posts": []
        }
        
    for item in raw_items:
        page_url = item.get("pageUrl") or item.get("facebookUrl") or ""
        post_text = item.get("text") or item.get("postText") or item.get("caption") or ""
        
        is_match, district_name, matched_kws, prov_name = check_strict_udon_location(post_text)
        if is_match:
            # จับคู่กับเพจเป้าหมาย
            for target_url, group in filtered_results.items():
                if target_url in page_url or (page_url and page_url in target_url):
                    if len(group["posts"]) < max_posts_per_page:
                        group["posts"].append({
                            "postId": item.get("id"),
                            "postUrl": item.get("url") or item.get("postUrl"),
                            "postedTime": item.get("time") or item.get("timestamp"),
                            "province": prov_name,
                            "district": district_name,
                            "matchedKeywords": matched_kws,
                            "text": post_text.strip(),
                            "likes": item.get("likesCount", 0),
                            "comments": item.get("commentsCount", 0),
                            "shares": item.get("sharesCount", 0)
                        })
                    break

    # บันทึกไฟล์ผลลัพธ์
    output_path = os.path.join(os.path.dirname(__file__), "udon_33pages_filtered_posts.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(list(filtered_results.values()), f, ensure_ascii=False, indent=2)
        
    print(f"🎉 สำเร็จ! บันทึกผลการคัดกรองลงที่: {output_path}")
    return filtered_results

if __name__ == "__main__":
    run_apify_scraper_33_pages(max_posts_per_page=10)
