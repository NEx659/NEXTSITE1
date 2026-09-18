$content = [System.IO.File]::ReadAllText('c:\Users\pannipan\Downloads\N\js\data.js', [System.Text.Encoding]::UTF8)

# Target comp-udon-58 replacement block
$target = '"id":  "comp-udon-58",'
$idx = $content.LastIndexOf($target)
if ($idx -gt 0) {
    # Find the end of this object before '];'
    $endIdx = $content.LastIndexOf('];')
    $prefix = $content.Substring(0, $idx)
    
    $mosaicObj = @'
"id":  "comp-udon-58",
        "name":  "ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น",
        "engName":  "Mosaic Design and Construction Ltd., Part.",
        "category":  "รับสร้างบ้านและงานก่อสร้างครบวงจร (TSIC 41001)",
        "province":  "อุดรธานี",
        "district":  "เมืองอุดรธานี",
        "address":  "เมืองอุดรธานี จ.อุดรธานี",
        "phone":  "081 954 4006",
        "contactPerson":  "ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น",
        "totalProjects":  1,
        "newProjectsThisMonth":  1,
        "totalValueMillion":  1.8,
        "growthRate":  40,
        "areaExpansion":  "เมืองอุดรธานี",
        "verificationStatus":  {
                                   "isVerified":  true,
                                   "confidence":  "100%",
                                   "evidenceSource":  "Facebook Page | DBD: 0415567000606",
                                   "permitStatus":  "TSIC 41001"
                               },
        "stageBreakdown":  {
                               "groundbreak":  0,
                               "foundation":  0,
                               "structure":  0,
                               "finishing":  1
                           },
        "latestTimelineStage":  "finishing",
        "revenuePotentialText":  "฿1.5M - ฿2.2M",
        "coordinates":  [
                            17.4031,
                            102.7744
                        ],
        "googleMapsUrl":  "https://maps.app.goo.gl/LEX12WYqLSQy2Xo2A",
        "gmaps":  "https://maps.app.goo.gl/LEX12WYqLSQy2Xo2A",
        "facebookUrl":  "https://www.facebook.com/profile.php?id=100083320623771",
        "facebookSignal":  {
                               "postDate":  "24 ส.ค.",
                               "pageName":  "Mosaic design & construction",
                               "caption":  "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ ที่ดิน เล็กแคบติดถนน การทำงานต้องสะดวกรวดเร็วง่ายต่อการสร้าง ต้องระวังไม่กระทบข้างเคียง เพราะ บ้านถูกปลวกกินทุกหลัง ต้องระวังการก่อสร้างเป็นพิเศษ Design & built : Mosaic design & construction Location : udonthani",
                               "likes":  12,
                               "comments":  2,
                               "shares":  1,
                               "detectedKeywords":  [
                                                        "ก่อสร้าง",
                                                        "built",
                                                        "design",
                                                        "udonthani"
                                                    ]
                           },
        "projects":  [
                         {
                             "id":  "proj-mosaic-01",
                             "projectId":  "proj-mosaic-01",
                             "name":  "โครงการบ้านพักอาศัย อุดรธานี (Complete 6 months later)",
                             "title":  "โครงการบ้านพักอาศัย อุดรธานี (Complete 6 months later)",
                             "stage":  "งานส่งมอบบ้าน / ตรวจรับ",
                             "stageKey":  "delivery",
                             "location":  "อ.เมืองอุดรธานี จ.อุดรธานี",
                             "district":  "เมืองอุดรธานี",
                             "province":  "อุดรธานี",
                             "date":  "24 สิงหาคม",
                             "postedTime":  "24 ส.ค.",
                             "caption":  "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ ที่ดิน เล็กแคบติดถนน การทำงานต้องสะดวกรวดเร็วง่ายต่อการสร้าง ต้องระวังไม่กระทบข้างเคียง เพราะ บ้านถูกปลวกกินทุกหลัง ต้องระวังการก่อสร้างเป็นพิเศษ Design & built : Mosaic design & construction Location : udonthani",
                             "facebookPostUrl":  "https://www.facebook.com/profile.php?id=100083320623771",
                             "siteProof":  {
                                               "postUrl":  "https://www.facebook.com/profile.php?id=100083320623771",
                                               "postedTime":  "24 สิงหาคม",
                                               "caption":  "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ Design & built : Mosaic design & construction Location : udonthani"
                                           },
                             "scgMaterials":  "สุขภัณฑ์และก๊อกน้ำ COTTO, สีทาบ้าน SCG, เคมีภัณฑ์กันซึม SCG, กระเบื้องปูพื้น",
                             "trackingStatus":  "pending"
                         }
                     ],
        "aiShortRec":  "งานส่งมอบ/ตรวจรับ (1 โครงการ)",
        "aiRecommendation":  "เสนอแพ็กเกจสุขภัณฑ์ COTTO, เคมีภัณฑ์กันซึม และกระเบื้อง SCG สำหรับโครงการถัดไป",
        "salesActionPlan":  [
                                "เข้าแสดงความยินดีในโอกาสส่งมอบบ้านและสอบถามแผนงานโครงการใหม่ปี 2026",
                                "นำเสนอโปรโมชันวัสดุ SCG / COTTO ครบวงจร"
                            ]
    }
];

if (typeof window !== 'undefined') {
  window.UDON_COMPANIES = UDON_COMPANIES;
}
'@

    $final = $prefix + $mosaicObj
    [System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\js\data.js', $final, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully updated comp-udon-58 in data.js!"
} else {
    Write-Output "comp-udon-58 not found!"
}
