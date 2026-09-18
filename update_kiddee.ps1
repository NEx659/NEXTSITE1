# Update comp-udon-21 in js/data.js and js/app.js

$dataContent = Get-Content -Raw -Encoding UTF8 "js/data.js"

$kiddeeNewObj = @'
    {
        "id":  "comp-udon-21",
        "name":  "ห้างหุ้นส่วนจํากัด คิดดีเฮาส์คอนสทรัคชั่น",
        "engName":  "Kiddee House Construction Ltd., Part.",
        "category":  "รับเหมาก่อสร้าง ออกแบบ และรีโนเวทอาคาร (TSIC 41001)",
        "province":  "อุดรธานี",
        "district":  "หนองวัวซอ",
        "address":  "อ.หนองวัวซอ / อ.เมืองอุดรธานี จ.อุดรธานี",
        "phone":  "088 563 6587",
        "contactPerson":  "ฝ่ายประสานงาน หจก.คิดดีเฮาส์คอนสทรัคชั่น (Line: Archtiger / 088-563-6587)",
        "totalProjects":  1,
        "newProjectsThisMonth":  1,
        "totalValueMillion":  1.8,
        "growthRate":  35,
        "areaExpansion":  "หนองวัวซอ, เมืองอุดรธานี",
        "verificationStatus":  {
                                   "isVerified":  true,
                                   "confidence":  "100%",
                                   "evidenceSource":  "Facebook Page: Kiddeehouseconstruction | Line: Archtiger | DBD: 0415564017890",
                                   "permitStatus":  "TSIC 41001"
                               },
        "stageBreakdown":  {
                               "groundbreak":  0,
                               "foundation":  0,
                               "structure":  0,
                               "finishing":  1
                           },
        "latestTimelineStage":  "finishing",
        "revenuePotentialText":  "฿0.8M",
        "coordinates":  [
                            17.165,
                            102.572
                        ],
        "googleMapsUrl":  "https://maps.app.goo.gl/EwJXZoaML2cEZwYZ7",
        "gmaps":  "https://maps.app.goo.gl/EwJXZoaML2cEZwYZ7",
        "facebookUrl":  "https://www.facebook.com/Kiddeehouseconstruction",
        "facebookSignal":  {
                               "postDate":  "27/7/2569",
                               "pageName":  "ห้างหุ้นส่วนจํากัด คิดดีเฮาส์คอนสทรัคชั่น",
                               "caption":  "ส่งมอบงานรีโนเวทบ้าน 2 ชั้น ขอบพระคุณ ครอบครัวคุณวิเชียรและคุณก้อย ที่ไว้วางใจให้ทีมงานดำเนินการก่อสร้างในครั้งนี้ครับ 🏡 หน้างาน อ.หนองวัวซอ จ.อุดรธานี 📞 088-563-6587 | Line: Archtiger",
                               "likes":  0,
                               "comments":  0,
                               "shares":  0,
                               "detectedKeywords":  [
                                                        "อุดรธานี",
                                                        "หนองวัวซอ",
                                                        "รีโนเวทบ้าน 2 ชั้น",
                                                        "คุณวิเชียร คุณก้อย"
                                                    ]
                           },
        "projects":  [
                         {
                             "projectId":  "comp-udon-21-1",
                             "name":  "โครงการปรับปรุงและรีโนเวทบ้านพักอาศัย 2 ชั้น คุณวิเชียร & คุณก้อย 📍 อ.หนองวัวซอ จ.อุดรธานี",
                             "location":  "อ.หนองวัวซอ จ.อุดรธานี",
                             "province":  "อุดรธานี",
                             "district":  "หนองวัวซอ",
                             "gps":  [
                                         17.165,
                                         102.572
                                     ],
                             "stage":  "งานปรับปรุงโครงสร้าง ซ่อมแซมผนัง และตกแต่งสถาปัตย์รีโนเวท",
                             "stageKey":  "finishing",
                             "trackingStatus":  "pending",
                             "progressPercent":  100,
                             "estValue":  "1.8 ล้านบาท",
                             "buildingType":  "บ้านพักอาศัย 2 ชั้น (งานรีโนเวทครบวงจร)",
                             "caption":  "ส่งมอบงานรีโนเวทบ้าน 2 ชั้น\nขอบพระคุณ ครอบครัวคุณวิเชียรและคุณก้อย\nที่ไว้วางใจให้ทีมงานดำเนินการก่อสร้างในครั้งนี้ครับ\n🏡 หน้างาน อ.หนองวัวซอ จ.อุดรธานี\n📞 088-563-6587 | Line: Archtiger",
                             "postedTime":  "27/7/2569",
                             "postUrl":  "https://www.facebook.com/Kiddeehouseconstruction/posts/pfbid0QMH6uHqU6TFnLsvBbqcTyU2pgrTn2mUApLvbeWdCV1nKM3LpTCLf8DRwHvNdCkYGl",
                             "boq":  [
                                         {
                                             "sku":  "เคมีภัณฑ์ซ่อมแซมโครงสร้างและปูนฉาบซ่อมผิว SCG / จระเข้",
                                             "qty":  "40 ถุง",
                                             "estCost":  "฿18,500",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "แผ่นสมาร์ทบอร์ด SCG และยิปซัมตราช้างสำหรับงานกั้นห้อง/ฝ้า",
                                             "qty":  "90 แผ่น",
                                             "estCost":  "฿22,500",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "ชุดสุขภัณฑ์และอุปกรณ์ห้องน้ำ COTTO Renovate Series",
                                             "qty":  "3 ชุด",
                                             "estCost":  "฿45,000",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         },
                                         {
                                             "sku":  "กระเบื้องปูพื้นและผนัง COTTO Modern & ปูนกาวซีเมนต์",
                                             "qty":  "150 ตร.ม.",
                                             "estCost":  "฿60,000",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         }
                                     ]
                         }
                     ],
        "aiShortRec":  "พบ 1 โครงการงานรีโนเวทบ้านพักอาศัย 2 ชั้น ใน จ.อุดรธานี (อ.หนองวัวซอ)",
        "aiRecommendation":  "ผู้รับเหมามีความเชี่ยวชาญทั้งงานสร้างใหม่และงานรีโนเวท แนะนำนำเสนอโซลูชันเคมีภัณฑ์ซ่อมแซม ปูนกาวซีเมนต์ และสุขภัณฑ์ COTTO Renovate",
        "salesActionPlan":  [

                            ],
        "tag":  "new",
        "opportunityScore":  80,
        "scgCode":  null,
        "sales2025":  0,
        "sales2026":  0,
        "customDiagnostic":  "ห้างหุ้นส่วนจํากัด คิดดีเฮาส์คอนสทรัคชั่น (Kiddeehouseconstruction) รับสร้างบ้าน ออกแบบ และรีโนเวทอาคารใน จ.อุดรธานี โทร. 088-563-6587 (Line: Archtiger) มีผลงานส่งมอบงานปรับปรุงและรีโนเวทบ้านพักอาศัย 2 ชั้น (ครอบครัวคุณวิเชียรและคุณก้อย อ.หนองวัวซอ) มีศักยภาพในการใช้วัสดุเคมีภัณฑ์ซ่อมแซม โซลูชันกั้นห้องสมาร์ทบอร์ด SCG กระเบื้อง และสุขภัณฑ์ COTTO ต่อเนื่อง",
        "customRecommendations":  [
                                      "\u003cstrong\u003eเคมีภัณฑ์ก่อสร้างและน้ำยาประสานคอนกรีต SCG / จระเข้:\u003c/strong\u003e นำเสนอโซลูชันเคมีภัณฑ์ซ่อมแซมรอยแตกร้าวและน้ำยาประสานสำหรับงานรีโนเวทโครงสร้างอาคารเดิม",
                                      "\u003cstrong\u003eแผ่น SCG สมาร์ทบอร์ด และยิปซัมตราช้าง:\u003c/strong\u003e นำเสนอระบบผนังเบาและฝ้าเพดานสำหรับงานแบ่งกั้นพื้นที่ใช้สอยใหม่",
                                      "\u003cstrong\u003eกระเบื้องและปูนกาวซีเมนต์ COTTO Extra Bond:\u003c/strong\u003e ล็อกสเปกปูนกาวปูทับกระเบื้องเดิมและกระเบื้องโมเดิร์นปูพื้น-ผนัง",
                                      "\u003cstrong\u003eชุดสุขภัณฑ์และก๊อกน้ำ COTTO Renovate \u0026 Water Saving:\u003c/strong\u003e นำเสนอแพ็กเกจสุขภัณฑ์ประหยัดน้ำและติดตั้งง่ายสำหรับงานเปลี่ยนระบบสุขาภิบาลบ้านรีโนเวท"
                                  ]
    }
'@

# Replace comp-udon-21 in dataContent using regex
$pattern = '(?s)\{\s*"id":\s*"comp-udon-21",.*?\n    \}(?=,\r?\n    \{\r?\n        "id":\s*"comp-udon-26")'
if ($dataContent -match $pattern) {
    $newDataContent = [regex]::Replace($dataContent, $pattern, $kiddeeNewObj.Trim())
    [System.IO.File]::WriteAllText("$pwd/js/data.js", $newDataContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced comp-udon-21 in js/data.js successfully!"
} else {
    Write-Host "Pattern not matched for comp-udon-21!"
}
