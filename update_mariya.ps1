# Update comp-udon-41 in js/data.js and js/app.js

$dataContent = Get-Content -Raw -Encoding UTF8 "js/data.js"

$mariyaNewObj = @'
    {
        "id":  "comp-udon-41",
        "name":  "บริษัท มารีญาก่อสร้าง จํากัด",
        "engName":  "Mariya Construction Co., Ltd.",
        "category":  "รับสร้างบ้านและงานสถาปัตยกรรมระดับพรีเมียม (TSIC 41001)",
        "province":  "อุดรธานี",
        "district":  "เมืองอุดรธานี",
        "address":  "อ.เมืองอุดรธานี จ.อุดรธานี",
        "phone":  "088 877 2899",
        "contactPerson":  "คุณมารีญา / ฝ่ายประสานงานโครงการ (Line: @mariacons-admin)",
        "totalProjects":  2,
        "newProjectsThisMonth":  2,
        "totalValueMillion":  10.5,
        "growthRate":  50,
        "areaExpansion":  "เมืองอุดรธานี",
        "verificationStatus":  {
                                   "isVerified":  true,
                                   "confidence":  "100%",
                                   "evidenceSource":  "Facebook Page | Line: @mariacons-admin | DBD: 0415562037890",
                                   "permitStatus":  "TSIC 41001"
                               },
        "stageBreakdown":  {
                               "groundbreak":  0,
                               "foundation":  0,
                               "structure":  0,
                               "finishing":  2
                           },
        "latestTimelineStage":  "finishing",
        "revenuePotentialText":  "฿1.8M",
        "coordinates":  [
                            17.4095,
                            102.7845
                        ],
        "googleMapsUrl":  "https://maps.app.goo.gl/fBRFeUPfffZhQcPK7",
        "gmaps":  "https://maps.app.goo.gl/fBRFeUPfffZhQcPK7",
        "facebookUrl":  "https://www.facebook.com/profile.php?id=100090611883896",
        "facebookSignal":  {
                               "postDate":  "12/9/2569",
                               "pageName":  "บริษัท มารีญาก่อสร้าง จํากัด",
                               "caption":  "ฝ้าภายในเริ่มแล้วววววว😶‍🌫️ | มารีญาก่อสร้าง | ผู้ช่วยสร้างบ้านที่คุณวางใจ โครงการบ้านพักอาศัย ค.ส.ล.2ชั้น (บ้านคุณพ่อคุณแม่) DESIGNER : Fathome Architect 📞 088-877-2899 | Line: @mariacons-admin",
                               "likes":  4,
                               "comments":  0,
                               "shares":  0,
                               "detectedKeywords":  [
                                                        "อุดรธานี",
                                                        "ก่อสร้างจริง",
                                                        "Fathome Architect",
                                                        "บ้านคุณพ่อคุณแม่"
                                                    ]
                           },
        "projects":  [
                         {
                             "projectId":  "comp-udon-41-1",
                             "name":  "โครงการบ้านพักอาศัย ค.ส.ล. 2 ชั้น (บ้านคุณพ่อคุณแม่) ออกแบบโดย Fathome Architect 📍 อ.เมือง จ.อุดรธานี",
                             "location":  "อ.เมืองอุดรธานี จ.อุดรธานี",
                             "province":  "อุดรธานี",
                             "district":  "เมืองอุดรธานี",
                             "gps":  [
                                         17.4095,
                                         102.7845
                                     ],
                             "stage":  "งานโครงฝ้าเพดานและติดตั้งแผ่นยิปซัมภายใน (บ้านคุณพ่อคุณแม่)",
                             "stageKey":  "finishing",
                             "trackingStatus":  "pending",
                             "progressPercent":  75,
                             "estValue":  "5.5 ล้านบาท",
                             "buildingType":  "บ้านพักอาศัย ค.ส.ล. 2 ชั้น (Fathome Architect)",
                             "caption":  "ฝ้าภายในเริ่มแล้วววววว😶‍🌫️\n| มารีญาก่อสร้าง | ผู้ช่วยสร้างบ้านที่คุณวางใจ\nโครงการบ้านพักอาศัย ค.ส.ล.2ชั้น (บ้านคุณพ่อคุณแม่)\nDESIGNER : Fathome Architect\n📞 088-877-2899 | Line: @mariacons-admin",
                             "postedTime":  "12/9/2569",
                             "postUrl":  "https://www.facebook.com/100090611883896/posts/1045310681832652",
                             "boq":  [
                                         {
                                             "sku":  "แผ่นยิปซัมตราช้าง SCG พลัส หนา 9 มม.",
                                             "qty":  "180 แผ่น",
                                             "estCost":  "฿34,200",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "โครงคร่าวโลหะฝ้าเพดาน SCG Proline & อุปกรณ์แขวน",
                                             "qty":  "220 เส้น",
                                             "estCost":  "฿28,600",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "ฉนวนกันความร้อน STAY COOL ตราช้าง SCG หนา 75 มม.",
                                             "qty":  "45 ม้วน",
                                             "estCost":  "฿22,500",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         },
                                         {
                                             "sku":  "ชุดสุขภัณฑ์และอุปกรณ์ห้องน้ำ COTTO Grand Series",
                                             "qty":  "4 ชุด",
                                             "estCost":  "฿68,000",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         }
                                     ]
                         },
                         {
                             "projectId":  "comp-udon-41-2",
                             "name":  "โครงการบ้านพักอาศัย ค.ส.ล. 2 ชั้น (บ้านคุณมายด์) ออกแบบโดย Fathome Architect 📍 อ.เมือง จ.อุดรธานี",
                             "location":  "อ.เมืองอุดรธานี จ.อุดรธานี",
                             "province":  "อุดรธานี",
                             "district":  "เมืองอุดรธานี",
                             "gps":  [
                                         17.4095,
                                         102.7845
                                     ],
                             "stage":  "งานสกีมโค้ทผนังภายในและเตรียมผิวทาสี (บ้านคุณมายด์)",
                             "stageKey":  "finishing",
                             "trackingStatus":  "pending",
                             "progressPercent":  70,
                             "estValue":  "5.0 ล้านบาท",
                             "buildingType":  "บ้านพักอาศัย ค.ส.ล. 2 ชั้น (Fathome Architect)",
                             "caption":  "งานสกีมภายใน😶‍🌫️\nโครงการบ้านพักอาศัย ค.ส.ล.2ชั้น (บ้านคุณมายด์)\nDESIGNER : Fathome Architect\n📞 088-877-2899 | Line: @mariacons-admin",
                             "postedTime":  "11/9/2569",
                             "postUrl":  "https://www.facebook.com/100090611883896/posts/1044440158586371",
                             "boq":  [
                                         {
                                             "sku":  "ปูนเสือ มอร์ตาร์ สกิมโค้ท (Tiger Skim Coat) สีเทา/ขาว",
                                             "qty":  "240 ถุง",
                                             "estCost":  "฿55,200",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "สีรองพื้นปูนฉาบและสีน้ำทาภายใน Super Premium SCG / TOA",
                                             "qty":  "18 ถัง",
                                             "estCost":  "฿39,600",
                                             "urgency":  "ด่วนที่สุด"
                                         },
                                         {
                                             "sku":  "กาวซีเมนต์ COTTO และปูนกาวปูกระเบื้องแกรนิตโต้",
                                             "qty":  "120 ถุง",
                                             "estCost":  "฿26,400",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         },
                                         {
                                             "sku":  "กระเบื้องปูพื้นและผนัง COTTO 60x60 cm",
                                             "qty":  "280 ตร.ม.",
                                             "estCost":  "฿112,000",
                                             "urgency":  "เตรียมสั่งซื้อ"
                                         }
                                     ]
                         }
                     ],
        "aiShortRec":  "พบ 2 ไซต์งานก่อสร้างบ้านพักอาศัย 2 ชั้นจริงใน จ.อุดรธานี (งานฝ้าเพดาน 1, งานสกีมโค้ท 1)",
        "aiRecommendation":  "บริษัทสร้างบ้านสเปกสถาปัตย์พรีเมียม (Fathome Architect) เน้นงานผิวเนี๊ยบ แนะนำส่งมอบโซลูชัน ยิปซัมตราช้าง SCG และ ปูนเสือ สกิมโค้ท ด่วน",
        "salesActionPlan":  [

                            ],
        "tag":  "new",
        "opportunityScore":  85,
        "scgCode":  null,
        "sales2025":  0,
        "sales2026":  0,
        "customDiagnostic":  "บริษัทรับสร้างบ้านสไตล์โมเดิร์นร่วมกับ \u003cstrong\u003eFathome Architect\u003c/strong\u003e ใน จ.อุดรธานี โทร. 088-877-2899 มุ่งเน้นมาตรฐานงานผิวและงานตกแต่งระดับประณีต (ปูเกรียงหวีเต็ม 100% ไม่ปูซาลาเปา, ผนังสกิมโค้ทเรียบเนียน, โครงฝ้าเพดานระดับพรีเมียม) กำลังก่อสร้าง 2 โครงการคุณภาพสูง ได้แก่ บ้านคุณพ่อคุณแม่ (งวดโครงฝ้าเพดาน) และ บ้านคุณมายด์ (งวดสกีมโค้ทผนังภายใน)",
        "customRecommendations":  [
                                      "\u003cstrong\u003eระบบแผ่นยิปซัมตราช้าง SCG และโครงคร่าว Proline:\u003c/strong\u003e นำเสนอระบบฝ้าเพดานครบวงจรและฉนวนกันความร้อน Stay Cool สำหรับบ้านคุณพ่อคุณแม่",
                                      "\u003cstrong\u003eปูนเสือ มอร์ตาร์ สกิมโค้ท (Tiger Skim Coat) \u0026 ปูนลูกดิ่ง:\u003c/strong\u003e ล็อกสเปกปูนฉาบผิวบางสำหรับบ้านคุณมายด์ ตอบโจทย์มาตรฐานงานผนังเรียบเนียน",
                                      "\u003cstrong\u003eกาวซีเมนต์ COTTO และกาวยาแนว Microban:\u003c/strong\u003e เสนอชุดปูนกาวปูกระเบื้องเต็มแผ่นมาตรฐานสากล สอดคล้องกับนโยบายไม่ปูซาลาเปาของบริษัท",
                                      "\u003cstrong\u003eชุดสุขภัณฑ์และกระเบื้อง COTTO Luxury Collection:\u003c/strong\u003e นำเสนอแบบและสเปกสุขภัณฑ์ร่วมกับทีมสถาปนิก Fathome Architect"
                                  ]
    }
'@

# Replace comp-udon-41 in dataContent using regex
$pattern = '(?s)\{\s*"id":\s*"comp-udon-41",.*?\n    \}(?=,\r?\n    \{\r?\n        "id":\s*"comp-udon-37")'
if ($dataContent -match $pattern) {
    $newDataContent = [regex]::Replace($dataContent, $pattern, $mariyaNewObj.Trim())
    [System.IO.File]::WriteAllText("$pwd/js/data.js", $newDataContent, [System.Text.Encoding]::UTF8)
    Write-Host "Replaced comp-udon-41 in js/data.js successfully!"
} else {
    Write-Host "Pattern not matched for comp-udon-41!"
}
