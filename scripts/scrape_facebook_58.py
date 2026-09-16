import os
import json
from apify_client import ApifyClient

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# 1. ใส่ Apify API Token ของคุณที่นี่ (หาได้จาก Apify Console -> Settings -> Integrations -> API Tokens)
APIFY_TOKEN = os.getenv("APIFY_TOKEN", "YOUR_APIFY_API_TOKEN")

# 2. ตั้งค่าการดึงข้อมูล
POSTS_PER_PAGE = 15                       # ดึง 15 โพสต์ล่าสุดต่อเพจ (สูงสุด 15 โครงการ)
ACTOR_ID = "apify/facebook-posts-scraper" # Facebook Posts Scraper Actor บน Apify

def main():
    base_dir = os.path.dirname(__file__)
    config_path = os.path.join(base_dir, "apify_actor_config_58.json")
    
    with open(config_path, "r", encoding="utf-8") as f:
        actor_input = json.load(f)

    # อัปเดตการตั้งค่า 10 โพสต์ต่อเพจ
    total_pages = len(actor_input.get("startUrls", []))
    actor_input["resultsLimit"] = POSTS_PER_PAGE
    actor_input["maxPosts"] = total_pages * POSTS_PER_PAGE
    actor_input["commentsMode"] = "NONE" # ข้ามคอมเมนต์เพื่อความรวดเร็วและประหยัด CUs
    actor_input["caption"] = True

    print(f"🚀 เตรียมดึงข้อมูล {total_pages} เพจ (เพจละ {POSTS_PER_PAGE} โพสต์ รวมสูงสุด {actor_input['maxPosts']} โพสต์)")

    if APIFY_TOKEN == "YOUR_APIFY_API_TOKEN":
        print("\n⚠️ [แจ้งเตือน] กรุณาใส่ APIFY_TOKEN ก่อนสั่งรันผ่าน Python หรือสามารถคัดลอก JSON ใน apify_actor_config_58.json ไปวางในหน้าเว็บ Apify Console ได้ทันทีครับ")
        return

    # เริ่มเรียกรัน Actor
    client = ApifyClient(APIFY_TOKEN)
    print("⏳ กำลังเริ่มสั่งรัน Actor บน Apify...")
    run = client.actor(ACTOR_ID).call(run_input=actor_input)

    dataset_id = run["defaultDatasetId"]
    print(f"✅ ดึงข้อมูลสำเร็จ! Dataset ID: {dataset_id}")

    # ดึงผลลัพธ์มาบันทึกไฟล์
    output_file = os.path.join(base_dir, "facebook_58_pages_posts.json")
    items = list(client.dataset(dataset_id).iterate_items())
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"🎉 บันทึกผลลัพธ์ {len(items)} โพสต์ เรียบร้อยแล้วที่: {output_file}")

if __name__ == "__main__":
    main()
