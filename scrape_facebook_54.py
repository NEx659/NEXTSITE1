import re
import json
import os
from apify_client import ApifyClient

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# 1. ใส่ Apify API Token ของคุณที่นี่ (หาได้จาก Apify Console -> Settings -> API Tokens)
APIFY_TOKEN = os.getenv("APIFY_TOKEN", "YOUR_APIFY_API_TOKEN")

# 2. ตั้งค่าการดึงข้อมูล
POSTS_PER_PAGE = 8       # ดึง 8 โพสต์ล่าสุดต่อเพจ
ACTOR_ID = "apify/facebook-posts-scraper"  # หรือ actor ที่คุณใช้งาน เช่น KoenCode/facebook-post-scraper

# ==============================================================================
# STEP 1: ดึงรายชื่อ 54 Facebook Page URLs จากฐานข้อมูลโปรเจกต์
# ==============================================================================
def get_54_page_urls():
    base_dir = os.path.dirname(__file__)
    build_file = os.path.join(base_dir, "build_udon_54.js")
    
    with open(build_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # ดึง URL จากฟิลด์ fb ในไฟล์ build_udon_54.js
    urls = re.findall(r'"fb":\s*"([^"]+)"', content)
    
    # กรอง URL ที่ซ้ำออก และจัดรูปแบบให้เป็น Apify StartUrls format
    unique_urls = []
    seen = set()
    for u in urls:
        if u and u not in seen:
            seen.add(u)
            unique_urls.append({"url": u})
            
    print(f"📋 ดึงรายชื่อเพจสำเร็จ: {len(unique_urls)} เพจ")
    return unique_urls

def main():
    start_urls = get_54_page_urls()
    total_posts_limit = len(start_urls) * POSTS_PER_PAGE

    # Payload Config ส่งให้ Apify Actor
    actor_input = {
        "startUrls": start_urls,
        "resultsLimit": POSTS_PER_PAGE,      # 8 โพสต์ล่าสุดต่อเพจ
        "maxPosts": total_posts_limit,       # สูงสุด 54 * 8 = 432 โพสต์
        "commentsMode": "NONE",             # ข้ามคอมเมนต์เพื่อประหยัดเวลาและโควต้า
        "caption": True
    }

    # บันทึก Config เก็บไว้ตรวจสอบ
    config_file = os.path.join(os.path.dirname(__file__), "apify_actor_config_54.json")
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(actor_input, f, ensure_ascii=False, indent=2)
    print(f"💾 บันทึกไฟล์ Input Config แล้วที่: {config_file}")

    if APIFY_TOKEN == "YOUR_APIFY_API_TOKEN":
        print("\n⚠️ [แจ้งเตือน] กรุณาเปลี่ยน 'YOUR_APIFY_API_TOKEN' เป็น Token จริงของคุณก่อนรันดึงข้อมูล")
        print("หรือนำไฟล์ scripts/apify_actor_config_54.json ไปแปะในช่อง Input บนหน้าเว็บ Apify ได้ทันที!")
        return

    # ==============================================================================
    # STEP 2: สั่งรัน Actor และรอผลลัพธ์
    # ==============================================================================
    print(f"\n🚀 กำลังสั่ง Apify รันสแกน {len(start_urls)} เพจ (เพจละ {POSTS_PER_PAGE} โพสต์ รวม ~{total_posts_limit} โพสต์)...")
    client = ApifyClient(APIFY_TOKEN)
    run = client.actor(ACTOR_ID).call(run_input=actor_input)

    dataset_id = run["defaultDatasetId"]
    print(f"✅ สแกนเสร็จสิ้น! Dataset ID: {dataset_id}")

    # ==============================================================================
    # STEP 3: โหลดข้อมูลผลลัพธ์และบันทึก
    # ==============================================================================
    print("📦 กำลังดาวน์โหลดข้อมูลจาก Dataset...")
    items = client.dataset(dataset_id).list_items().items
    print(f"🎉 ได้ข้อมูลโพสต์ทั้งหมด {len(items)} โพสต์!")

    output_file = os.path.join(os.path.dirname(__file__), "..", "data", "facebook_54_pages_posts.json")
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"📁 บันทึกข้อมูลเรียบร้อยแล้ว: {output_file}")

if __name__ == "__main__":
    main()
