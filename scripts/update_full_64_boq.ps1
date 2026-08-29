# Script to generate full 64 projects with 100% comprehensive BOQ materials for all 5 SCG categories

$companiesData = Get-Content -Path "c:\Users\pannipan\Downloads\N\js\data.js" -Raw -Encoding UTF8

# Define rich BOQ items per stage
$boqGroundbreak = @(
  @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"; qty = "500 ถุง"; estCost = "฿85,000"; urgency = "ด่วนที่สุด" },
  @{ sku = "คอนกรีตผสมเสร็จ CPAC Super Plus 240 ksc"; qty = "35 คิว"; estCost = "฿77,000"; urgency = "ด่วนที่สุด" }
)

$boqFoundation = @(
  @{ sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"; qty = "65 คิว"; estCost = "฿143,000"; urgency = "กำลังใช้งาน" },
  @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานฐานราก"; qty = "350 ถุง"; estCost = "฿59,500"; urgency = "เตรียมสั่งซื้อ" }
)

$boqStructure = @(
  @{ sku = "กระเบื้องหลังคา SCG NeuTile/Prestige"; qty = "220 ตร.ม."; estCost = "฿154,000"; urgency = "ด่วนที่สุด" },
  @{ sku = "ปูนเสือมอร์ตาร์ งานก่อฉาบ"; qty = "250 ถุง"; estCost = "฿35,000"; urgency = "เตรียมสั่งซื้อ" },
  @{ sku = "ไม้สังเคราะห์ SCG D-COR & สมาร์ทบอร์ด"; qty = "120 ตร.ม."; estCost = "฿48,000"; urgency = "วางสเปก" },
  @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG เสาคาน"; qty = "200 ถุง"; estCost = "฿34,000"; urgency = "กำลังใช้งาน" }
)

$boqFinishing = @(
  @{ sku = "อิฐมวลเบา Q-CON ขนาด 7.5 ซม."; qty = "2,200 ก้อน"; estCost = "฿48,400"; urgency = "เตรียมสั่งซื้อ" },
  @{ sku = "ปูนเสือมอร์ตาร์ งานฉาบละเอียด"; qty = "300 ถุง"; estCost = "฿36,000"; urgency = "เตรียมสั่งซื้อ" },
  @{ sku = "ไม้สังเคราะห์ SCG D-COR ตกแต่งฟาซาด"; qty = "100 ตร.ม."; estCost = "฿45,000"; urgency = "เตรียมสั่งซื้อ" },
  @{ sku = "สุขภัณฑ์และกระเบื้องปูพื้น COTTO"; qty = "4 ชุด / 150 ตร.ม."; estCost = "฿95,000"; urgency = "เตรียมส่งมอบ" }
)
