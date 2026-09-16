$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

# Non-Udon locations (districts and provinces)
$strictOtherProvinces = @(
    "สกลนคร", "สว่างแดนดิน", "คำตากล้า", "พังโคน", "วานรนิวาส", "อากาศอำนวย", "ภูพาน", "กุสุมาลย์",
    "ร้อยเอ็ด", "เกษตรวิสัย", "เสลภูมิ", "พนมไพร", "โพนทอง", "อาจสามารถ", "ธวัชบุรี",
    "หนองคาย", "โพธิ์ตาก", "ท่าบ่อ", "โพนพิสัย", "สังคม", "ศรีเชียงใหม่", "รัตนวาปี", "สระใคร", "ปะโค",
    "หนองบัวลำภู", "นากลาง", "ศรีบุญเรือง", "นาวัง", "สุวรรณคูหา", "โนนสัง", "ด่านช้าง", "นาคำไฮ",
    "บึงกาฬ", "โซ่พิสัย", "ปากคาด", "เซกา", "บึงโขงหลง", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ยโสธร", "กุดชุม", "เลิงนกทา", "ทรายมูล", "ป่าติ้ว", "มหาชนะชัย", "ค้อวัง", "ไทยเจริญ",
    "กาฬสินธุ์", "ท่าคันโท", "สมเด็จ", "กุฉินารายณ์", "กมลาไสย", "ยางตลาด", "ห้วยผึ้ง", "สหัสขันธ์",
    "ขอนแก่น", "น้ำพอง", "กระนวน", "ชุมแพ", "บ้านไผ่", "พล", "ภูเวียง", "มัญจาคีรี", "อุบลรัตน์", "เขาสวนกวาง",
    "นครพนม", "ธาตุพนม", "เรณูนคร", "นาแก", "ศรีสงคราม", "บ้านแพง", "ท่าอุเทน", "ปลาปาก",
    "เลย", "เชียงคาน", "วังสะพุง", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "นาแห้ว", "ปากชม", "เอราวัณ", "ท่าลี่",
    "มุกดาหาร", "มหาสารคาม", "ศรีสะเกษ", "อุบลราชธานี", "อำนาจเจริญ", "ชัยภูมิ", "นครราชสีมา", "โคราช", "กรุงเทพ"
)

# Ad, Article, Tip, PR keywords to strictly exclude
$adAndTipKeywords = @(
    "10 แบบบ้าน", "แบบบ้านยอดนิยม", "แบบบ้านดีไซน์", "แบบบ้านขายดี", "แบบบ้านแนะนำ", "แบบบ้านสวย", "แบบบ้านทันสมัย", "แบบบ้านโมเดิร์น", "แบบบ้านทรง",
    "แบบบ้านชั้นเดียว", "แบบบ้าน 2 ชั้น", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ", "โปรโมชั่น", "โปรโมชัน", "จองและทำสัญญา", "จองวันนี้", "รับส่วนลด", "แจกฟรี", "ฟรีของแถม", "แถมฟรี",
    "ยื่นสินเชื่อ", "กู้ได้เต็ม", "ผ่อนเริ่มต้น", "อยากสร้างบ้านทั้งที", "สร้างบ้านทั้งที", "สร้างสุข สร้างฝัน", "เพราะบ้านคือความฝัน", "สร้างบ้านคือเรื่องง่าย", "งบประมาณไม่บานปลาย",
    "ทำไมถึงใช้", "ทำไมเราถึงใช้", "ทำไมต้อง", "ความรู้เรื่องบ้าน", "เกร็ดความรู้", "ข้อควรรู้", "รู้หรือไม่", "หลายคนที่ติดตาม", "คลิปนี้มีคำตอบ", "ข้อดีข้อเสีย",
    "เคล็ดลับ", "ทริค", "ทริคดีๆ", "วิธีเลือก", "วิธีดูแล", "หน้าฝนนี้ต้องรู้", "กลัวผู้รับเหมาทิ้งงาน", "สิ่งที่น่ากลัวที่สุด", "สิ่งที่เจ้าของบ้านกลัวที่สุด", "สร้างบ้านอย่างไรไม่ให้โดนทิ้งงาน", "วางผังทิศทางบ้าน", "ลดกลิ่นอับ", "ฮวงจุ้ย", "มีทริคดีๆมาฝาก",
    "3d", "perspective", "ภาพ 3d", "ภาพจำลอง", "ภาพเสมือนจริง",
    "monthly meeting", "MONTHLY MEETING", "การประชุมประจำเดือน", "การประชุม", "ประชุมประจำเดือน", "ประชุม", "สัมมนา", "อบรม",
    "ceo onsite", "CEO Onsite", "ราคาถูกแค่ไหน", "สาระเล็ก ๆ", "สาระเล็กๆ", "คำคม", "ข้อคิด", "podcast", "พอดแคสต์",
    "new chapter", "20 years of", "ฉลองครบรอบ", "ก้าวสำคัญของ", "อยากสร้างบ้าน...สร้างสบาย", "สวยงามมีสไตล์",
    "พาไปดูผลิตภัณฑ์", "cotto", "โชว์รูม", "วัสดุก่อผนัง", "อิฐ eco block", "อิฐ ekoblok", "คุณสมบัติของอิฐ", "ข้อดีของอิฐ",
    "อัปเดตความรู้", "อัพเดตความรู้", "ให้ความรู้และสาธิต", "สาธิตการใช้งาน", "สาธิตผลิตภัณฑ์", "อบรมทีมช่าง", "ทีม scg", "ทีมscg", "ผู้เชี่ยวชาญจาก scg", "การสาธิตครั้งนี้",
    "ถ้าหน้าบ้านเป็นแบบนี้", "ถ้าเป็นบ้านของคุณ", "จากภาพออกแบบสู่", "ภาพออกแบบสู่"
)

# Real Job Site Indicators (must match at least one in body)
$realSiteIndicators = @(
    "อัพเดทหน้างาน", "อัพเดท", "อัปเดตหน้างาน", "อัปเดต", "ความคืบหน้า", "site update", "SITE UPDATE", "project update", "PROJECT UPDATE", "new project", "NEW PROJECT",
    "ส่งมอบงาน", "ส่งมอบบ้าน", "ตรวจรับบ้าน", "พิธียกเสาเอก", "ยกเสาเอก", "ลงเสาเข็ม", "ฐานราก", "ตอกเสาเข็ม", "เทคาน", "เทพื้น", "โครงหลังคา", "มุงหลังคา", "ก่อฉาบ", "ฉาบปูน", "งานสี", "ฝ้าเพดาน", "ปูกระเบื้อง",
    "โครงการ mdud", "โครงการ", "ไซต์งาน", "หน้างาน", "renovation", "บ้านพักอาศัย", "owner คุณ", "บ้านคุณ", "ของคุณ", "ฤกษ์ดี"
)

$removalLog = @()

foreach ($comp in $companies) {
    if (-not $comp.projects -or $comp.projects.Count -eq 0) { continue }

    $cleanedProjects = @()
    $seenCustomerKeys = @{}

    foreach ($proj in $comp.projects) {
        $cap = $proj.caption
        if (-not $cap) { $cap = $proj.name }

        # Strip hashtag block
        $bodyText = $cap
        if ($bodyText -match '(?s)^(.*?)(\n\s*#[^\n]+)+$') {
            $bodyText = $matches[1]
        }
        $bodyLower = $bodyText.ToLower()

        # Check 1: Exclude Ads / Tips / Articles / PR / Training / Demos
        $isAdOrTip = $false
        $adReason = ""
        foreach ($ak in $adAndTipKeywords) {
            if ($bodyLower.Contains($ak.ToLower())) {
                $isAdOrTip = $true
                $adReason = "Ad/Tip/Training/Article: $ak"
                break
            }
        }
        if ($isAdOrTip) {
            $removalLog += [PSCustomObject]@{ Company = $comp.name; Project = $proj.name; Reason = $adReason }
            continue
        }

        # Check 2: Must have a real job site indicator
        $hasSiteIndicator = $false
        foreach ($ind in $realSiteIndicators) {
            if ($bodyLower.Contains($ind.ToLower()) -or $proj.name.ToLower().Contains($ind.ToLower())) {
                $hasSiteIndicator = $true
                break
            }
        }
        if (-not $hasSiteIndicator) {
            $removalLog += [PSCustomObject]@{ Company = $comp.name; Project = $proj.name; Reason = "No Real Site Indicator" }
            continue
        }

        # Check 3: Check other provinces in location lines
        $isOtherProv = $false
        $otherProvDetected = ""
        $locLines = ($bodyText -split "`n") | Where-Object { $_ -match '(📍|🏡|พิกัด|สถานที่|อำเภอ|ตำบล|จังหวัด|อ\.|ต\.|จ\.)' }
        $locTextToInspect = if ($locLines) { $locLines -join " " } else { $bodyText }

        foreach ($op in $strictOtherProvinces) {
            if ($locTextToInspect.Contains($op)) {
                if ($locTextToInspect -match "(จ\.$op|จังหวัด$op|อ\.$op|อำเภอ$op|ต\.$op|ตำบล$op)") {
                    $isOtherProv = $true
                    $otherProvDetected = $op
                    break
                }
            }
        }

        if ($isOtherProv) {
            $removalLog += [PSCustomObject]@{ Company = $comp.name; Project = $proj.name; Reason = "Other Province: $otherProvDetected" }
            continue
        }

        # Check 4: Duplicate customer update
        $custKey = ""
        if ($cap -match '(บ้านคุณ[^\s,]+|บ้านพักอาศัยคุณ[^\s,]+|ของคุณ[^\s,]+|Owner\s+คุณ\s*([^\n\r]+)|โครงการ\s*MDUD\s*\d+)') {
            $custKey = $matches[0].Trim()
        }

        if ($custKey -and $seenCustomerKeys.ContainsKey($custKey)) {
            $removalLog += [PSCustomObject]@{ Company = $comp.name; Project = $proj.name; Reason = "Duplicate Customer: $custKey" }
            continue
        }

        if ($custKey) {
            $seenCustomerKeys[$custKey] = $true
        }

        $cleanedProjects += $proj
    }

    $comp.projects = $cleanedProjects
    $comp.totalProjects = $cleanedProjects.Count
    $comp.newProjectsThisMonth = $cleanedProjects.Count
    $comp.totalValueMillion = [Math]::Round($cleanedProjects.Count * 5.5, 1)

    $gb = 0; $fd = 0; $st = 0; $fn = 0
    foreach ($vp in $cleanedProjects) {
        if ($vp.stageKey -eq 'groundbreak') { $gb++ }
        elseif ($vp.stageKey -eq 'foundation') { $fd++ }
        elseif ($vp.stageKey -eq 'structure') { $st++ }
        elseif ($vp.stageKey -eq 'finishing') { $fn++ }
        else { $st++ }
    }
    $comp.stageBreakdown = [PSCustomObject]@{
        groundbreak = $gb
        foundation = $fd
        structure = $st
        finishing = $fn
    }

    if ($cleanedProjects.Count -gt 0) {
        $comp.aiShortRec = "พบ $($cleanedProjects.Count) ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (ฐานราก: $fd, โครงสร้าง: $st, สถาปัตย์: $fn)"
    } else {
        $comp.aiShortRec = "ไม่พบไซต์งานก่อสร้างใน จ.อุดรธานี ในช่วงเวลาที่สำรวจ"
    }
}

$newJson = $companies | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)

Write-Output "=== RIGOROUS REAL SITES FILTER COMPLETED ==="
Write-Output "Total removed items: $($removalLog.Count)"
$removalLog | Format-Table -AutoSize | Out-String | Write-Output
