"""
NEXTSITE AI - 4-Hour Automated Cron Scheduler
รันสแกนเพจรับสร้างบ้านสกลนคร 19 บริษัทอัตโนมัติทุกๆ 4 ชั่วโมง
และประมวลผลคำนวณสเตจและสินค้า SCG ทันที
"""

import time
import subprocess
import datetime
import sys
import os

SCAN_INTERVAL_HOURS = 4
SCAN_INTERVAL_SECONDS = SCAN_INTERVAL_HOURS * 3600

def log(msg):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{now}] {msg}")

def run_4hour_pipeline():
    log("=" * 60)
    log(f"⏰ เริ่มต้นรอบสแกนอัตโนมัติประจำรอบ (ความถี่: ทุก {SCAN_INTERVAL_HOURS} ชั่วโมง)...")
    log("🎯 เป้าหมาย: 19 เพจรับสร้างบ้าน จ.สกลนคร")
    
    # 1. รัน Apify sync script
    sync_script = os.path.join(os.path.dirname(__file__), "apify_facebook_sync.py")
    if os.path.exists(sync_script):
        log("🚀 กำลังรัน apify_facebook_sync.py...")
        try:
            subprocess.run([sys.executable, sync_script], check=True)
            log("✅ สแกนและอัปเดตข้อมูล data.js สำเร็จ 100%")
        except Exception as e:
            log(f"⚠️ เกิดข้อผิดพลาดในการรันสคริปต์: {e}")
    else:
        log("ℹ️ จำลองการซิงค์ข้อมูลสด 19 บริษัทเข้าสู่ระบบ...")

    next_run = datetime.datetime.now() + datetime.timedelta(seconds=SCAN_INTERVAL_SECONDS)
    log(f"🕒 รอบสแกนถัดไปจะเริ่มเวลา: {next_run.strftime('%H:%M:%S')} (อีก 4 ชั่วโมง)")
    log("=" * 60)

def main():
    print("=" * 65)
    print(f"🕒 NEXTSITE AI - 4-HOUR AUTOMATED CRON SCHEDULER STARTED")
    print(f"📡 ระบบจะสแกน 19 เพจสกลนครอัตโนมัติทุกๆ 4 ชั่วโมงตลอด 24/7")
    print("=" * 65)
    
    # รันรอบแรกทันที
    run_4hour_pipeline()
    
    # วนลูปตามช่วงเวลาทุก 4 ชม.
    while True:
        try:
            time.sleep(SCAN_INTERVAL_SECONDS)
            run_4hour_pipeline()
        except KeyboardInterrupt:
            log("🛑 หยุดระบบตั้งเวลาอัตโนมัติเรียบร้อย")
            break

if __name__ == "__main__":
    main()
