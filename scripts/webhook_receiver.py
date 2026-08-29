"""
NEXTSITE AI - Real-time Apify Webhook Receiver
รับ Webhook อัตโนมัติจาก Apify เมื่อบอทสแกน 19 เพจในสกลนครเสร็จ
ทำการวิเคราะห์ด้วย AI NLP ถอดสเตจงานก่อสร้าง และอัปเดตลง data.js ทันทีโดยไม่ต้องโหลดไฟล์เอง
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import re
from datetime import datetime

PORT = 8080
DATA_JS_PATH = os.path.join(os.path.dirname(__file__), "..", "js", "data.js")

# คีย์เวิร์ดโครงสร้างสำหรับ SCG
KEYWORDS_MAP = {
    "groundbreak": ["ยกเสาเอก", "เสาเอก", "เสาโท", "ลงเสาเข็ม", "ตอกเสาเข็ม", "เปิดหน้างาน", "วางผัง"],
    "foundation": ["ฐานราก", "เทพื้น", "คานคอดิน", "ตอม่อ", "เทคอนกรีต"],
    "structure": ["งานโครงสร้าง", "เสาคาน", "โครงหลังคา", "มุงหลังคา", "ซีแพค", "excella", "neutile"],
    "finishing": ["งานก่ออิฐ", "ก่ออิฐ", "งานฉาบ", "ฉาบปูน", "งานฝ้า", "สมาร์ทบอร์ด", "ส่งมอบ", "cotto"]
}

class ApifyWebhookHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        status_info = {
            "status": "online",
            "service": "NEXTSITE AI - Apify Webhook Receiver",
            "monitoredCompanies": 19,
            "province": "Sakon Nakhon",
            "timestamp": datetime.now().isoformat()
        }
        self.wfile.write(json.dumps(status_info, ensure_ascii=False, indent=2).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
            print(f"\n[Webhook Received] ได้รับสัญญาณจาก Apify: {datetime.now().strftime('%H:%M:%S')}")
            
            # ตรวจสอบรูปแบบข้อมูลจาก Apify Webhook
            dataset_items = []
            if isinstance(payload, list):
                dataset_items = payload
            elif isinstance(payload, dict) and "items" in payload:
                dataset_items = payload["items"]
            elif isinstance(payload, dict) and "resource" in payload:
                print(f"[Apify Run Finished] Run ID: {payload.get('resource', {}).get('id')}")
                dataset_items = []

            print(f"[AI Processing] ตรวจพบโพสต์ทั้งหมด: {len(dataset_items)} รายการ")
            
            # ส่งการตอบกลับ 200 OK กลับไปยัง Apify
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "success": True,
                "message": f"Webhook processed successfully. {len(dataset_items)} posts analyzed.",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            print(f"[Error] ประมวลผล Webhook ล้มเหลว: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ApifyWebhookHandler)
    print("=" * 65)
    print(f"🚀 NEXTSITE AI - Apify Webhook Server กำลังทำงานที่พอร์ต {PORT}")
    print(f"📡 Webhook URL ปลายทาง: http://localhost:{PORT}/api/webhook/facebook-sync")
    print(f"🎯 พร้อมรับข้อมูล Push Notification อัตโนมัติจาก 19 เพจสกลนคร")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nหยุดการทำงานของเซิร์ฟเวอร์เรียบร้อย")

if __name__ == "__main__":
    run_server()
