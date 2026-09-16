$jsonTemplate = @'
        "id":  "comp-udon-28",
        "name":  "บริษัท การิน บ้านสวย จำกัด (Karin Bansuay)",
        "engName":  "Karin Bansuay Co., Ltd.",
        "category":  "รับสร้างบ้านคุณภาพและตกแต่งบ้านสวย (TSIC 41001)",
        "province":  "อุดรธานี",
        "district":  "เมืองอุดรธานี",
        "address":  "เมืองอุดรธานี จ.อุดรธานี",
        "phone":  "080 419 9099",
        "contactPerson":  "บริษัท การิน บ้านสวย จำกัด (Karin Bansuay)",
        "totalProjects":  0,
        "newProjectsThisMonth":  0,
        "totalValueMillion":  0,
        "growthRate":  40,
        "areaExpansion":  "เมืองอุดรธานี อุดรธานี",
        "verificationStatus":  {
                                   "isVerified":  true,
                                   "confidence":  "100%",
                                   "evidenceSource":  "Facebook Page | DBD: 0415562024567",
                                   "permitStatus":  "TSIC 41001"
                               },
        "stageBreakdown":  {
                               "groundbreak":  0,
                               "foundation":  0,
                               "structure":  0,
                               "finishing":  0
                           },
        "latestTimelineStage":  "groundbreak",
        "revenuePotentialText":  "฿0.0M - ฿0.0M",
        "coordinates":  [
                            17.426,
                            102.771
                        ],
        "googleMapsUrl":  "https://maps.app.goo.gl/7z72u7gtyswCyU6o6",
        "gmaps":  "https://maps.app.goo.gl/7z72u7gtyswCyU6o6",
        "facebookUrl":  "https://www.facebook.com/KarinBansuay/?locale=th_TH",
        "facebookSignal":  {
                               "postDate":  "22/08/2026",
                               "pageName":  "บริษัท การิน บ้านสวย จำกัด (Karin Bansuay)",
                               "caption":  "📍 รับสร้างบ้านทั่วภาคอีสาน (โพสต์ล่าสุดเป็นไซต์งานต่างจังหวัด: สกลนคร, ร้อยเอ็ด, หนองคาย, หนองบัวลำภู, บึงกาฬ)",
                               "likes":  0,
                               "comments":  0,
                               "shares":  0,
                               "detectedKeywords":  [
                                                        "SCG"
                                                    ]
                           },
        "projects":  [

                     ],
        "aiShortRec":  "ไม่พบไซต์งานก่อสร้างใน จ.อุดรธานี (โพสต์ทั้งหมดเป็นงานต่างจังหวัด: สกลนคร, ร้อยเอ็ด, หนองคาย, หนองบัวลำภู, บึงกาฬ)",
        "aiRecommendation":  "ปัจจุบันโพสต์ทั้งหมดของบริษัทเป็นงานนอกพื้นที่ จ.อุดรธานี แนะนำติดตามโพสต์ใหม่เมื่อเริ่มเปิดไซต์งานในพื้นที่ จ.อุดรธานี",
        "salesActionPlan":  [

                            ]
    }
'@

$baseContent = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", [System.Text.Encoding]::UTF8)

# Find start of comp-udon-28
$idxStart = $baseContent.IndexOf('"id":  "comp-udon-28"')
if ($idxStart -lt 0) { $idxStart = $baseContent.IndexOf('"id": "comp-udon-28"') }

# Find start of comp-udon-29
$idxEnd = $baseContent.IndexOf('"id":  "comp-udon-29"')
if ($idxEnd -lt 0) { $idxEnd = $baseContent.IndexOf('"id": "comp-udon-29"') }

$braceBefore28 = $baseContent.LastIndexOf('{', $idxStart)
$braceBefore29 = $baseContent.LastIndexOf('{', $idxEnd)

$part1 = $baseContent.Substring(0, $braceBefore28 + 1) + "`r`n"
$part3 = "`r`n    ," + $baseContent.Substring($braceBefore29)

$finalContent = $part1 + $jsonTemplate + $part3

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", $finalContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", $finalContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated comp-udon-28 (Karin Bansuay) to 0 projects!"
