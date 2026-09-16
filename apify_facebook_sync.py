#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NEXTSITE AI - APIFY FACEBOOK POSTS SCRAPER & AI PIPELINE
เชื่อมต่อกับ Apify Actor (apify/facebook-posts-scraper) เพื่อดึงโพสต์สดจากเพจรับสร้างบ้านสกลนคร
วิเคราะห์สเตจก่อสร้าง ตรวจจับวัสดุ SCG และอัปเดตลง js/data.js อัตโนมัติ
"""

import os
import json
import re
import datetime

# รายชื่อ 39 เพจเป้าหมายในจังหวัดสกลนคร
TARGET_PAGE_URLS = [
    "https://www.facebook.com/SYC.House2022/",
    "https://www.facebook.com/338builderSakonnakhon/?locale=th_TH",
    "https://www.facebook.com/natureestatethailand/?locale=th_TH",
    "https://www.facebook.com/p/NATCHA-HOME-100083457546393/",
    "https://www.facebook.com/heddee22builder",
    "https://www.facebook.com/smartdesingarchitect",
    "https://www.facebook.com/people/JS-HOME-รับสร้างบ้านสกลนคร/61556066266070/"
]

def generate_apify_actor_input(max_posts_per_page=5):
    """
    สร้าง Configuration JSON สำหรับส่งให้ Apify Actor (apify/facebook-posts-scraper)
    """
    actor_input = {
        "startUrls": [{"url": url} for url in TARGET_PAGE_URLS],
        "resultsLimit": max_posts_per_page,
        "maxPosts": len(TARGET_PAGE_URLS) * max_posts_per_page,
        "onlyPostsNewerThan": (datetime.datetime.now() - datetime.timedelta(days=60)).strftime("%Y-%m-%d"),
        "commentsMode": "NONE",
        "proxy": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"]
        }
    }
    return actor_input

def analyze_post_with_ai(post_text, page_url, post_url, post_date_str):
    """
    ประมวลผลข้อความโพสต์เพื่อจำแนกสเตจการก่อสร้าง และถอดรายการวัสดุ SCG (BOQ)
    """
    text = post_text or ""
    
    # คำค้นหาสเตจ
    is_groundbreak = bool(re.search(r"เสาเอก|เสาโท|ตอกเสาเข็ม|เสาเข็มเจาะ|เปิดหน้างาน|สำรวจดิน", text))
    is_foundation = bool(re.search(r"ฐานราก|คานคอดิน|เสาตอม่อ|เทตอม่อ|เทฐานราก", text))
    is_structure = bool(re.search(r"โครงสร้าง|ขึ้นเสา|คานชั้น|โครงหลังคา|มุงหลังคา|ซีแพค|excella|neutile", text, re.IGNORECASE))
    is_finishing = bool(re.search(r"ก่อฉาบ|ปูผนัง|ทาสี|กระเบื้อง|สุขภัณฑ์|cotto|ตกแต่ง", text, re.IGNORECASE))
    
    if is_groundbreak:
        stage_key = "groundbreak"
        stage_name = "พึ่งเริ่มตอกเสาเข็ม"
        progress = 5
        recommended_sku = "ปูนซีเมนต์ไฮดรอลิก SCG & คอนกรีต CPAC งานเสาเข็ม"
    elif is_foundation:
        stage_key = "foundation"
        stage_name = "วางฐานรากและเทคานคอดิน"
        progress = 20
        recommended_sku = "ปูนซีเมนต์ SCG และคอนกรีต CPAC 240 ksc"
    elif is_structure:
        stage_key = "structure"
        stage_name = "ขึ้นโครงสร้างเสา-คาน และเตรียมมุงหลังคา"
        progress = 45
        recommended_sku = "กระเบื้องหลังคา SCG NeuTile/Excella และปูนโครงสร้าง"
    else:
        stage_key = "finishing"
        stage_name = "งานก่อผนังและตกแต่ง"
        progress = 75
        recommended_sku = "อิฐมวลเบา Q-CON, ปูนเสือมอร์ตาร์, สุขภัณฑ์ COTTO"

    # ดึงคีย์เวิร์ด
    keywords = []
    for kw in ["เสาเอก", "เสาเข็มเจาะ", "ฐานราก", "โครงสร้าง", "มุงหลังคา", "Contemporary", "Modern", "ไทยประยุกต์", "วาริชภูมิ", "สว่างแดนดิน", "พังโคน", "นิตโย", "สกลนคร"]:
        if kw.lower() in text.lower():
            keywords.append(kw)
            
    return {
        "stageKey": stage_key,
        "stageName": stage_name,
        "progressPercent": progress,
        "recommendedSku": recommended_sku,
        "keywords": keywords,
        "captionSnippet": text[:180] + ("..." if len(text) > 180 else ""),
        "postUrl": post_url or page_url,
        "postedTime": post_date_str or "ตรวจพบล่าสุด"
    }

def main():
    print("=" * 60)
    print("🚀 NEXTSITE AI - APIFY FACEBOOK SCRAPER PIPELINE")
    print("=" * 60)
    
    config = generate_apify_actor_input(max_posts_per_page=5)
    config_path = os.path.join(os.path.dirname(__file__), "apify_actor_config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
        
    print(f"✅ บันทึกไฟล์ Apify Actor Config: {config_path}")
    print(f"📋 จำนวนเพจเป้าหมายในสกลนคร: {len(TARGET_PAGE_URLS)} เพจ")
    print("\nวิธีรันผ่าน Apify CLI หรือ Apify Console:")
    print("1. ติดตั้ง apify-cli: npm install -g apify-cli")
    print("2. เรียกใช้: apify call apify/facebook-posts-scraper --input-file=scripts/apify_actor_config.json")
    print("3. นำผลลัพธ์ JSON กลับมาให้ระบบอัปเดต data.js ทันที!")

if __name__ == "__main__":
    main()
