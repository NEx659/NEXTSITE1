# Audit and clean all 54 companies according to the user's strict rules
$dataPath = "c:\Users\pannipan\Downloads\N\js\baseline_1_data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

# Known other provinces and out-of-province districts
$otherProvincesKeywords = @(
    "สกลนคร", "คำตากล้า", "พังโคน", "วานรนิวาส", "อากาศอำนวย", "สว่างแดนดิน",
    "ร้อยเอ็ด", "เกษตรวิสัย", "เสลภูมิ", "พนมไพร", "โพนทอง", "อาจสามารถ",
    "หนองคาย", "โพธิ์ตาก", "ท่าบ่อ", "โพนพิสัย", "สังคม", "ศรีเชียงใหม่", "รัตนวาปี", "สระใคร", "ต.ปะโค",
    "หนองบัวลำภู", "นากลาง", "ศรีบุญเรือง", "นาวัง", "สุวรรณคูหา", "ต.ด่านช้าง", "ต.นาคำไฮ",
    "บึงกาฬ", "โซ่พิสัย", "ปากคาด", "เซกา", "บึงโขงหลง", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ยโสธร", "กุดชุม", "เลิงนกทา", "ทรายมูล", "ป่าติ้ว", "มหาชนะชัย", "ค้อวัง", "ไทยเจริญ",
    "กาฬสินธุ์", "ท่าคันโท", "สมเด็จ", "กุฉินารายณ์", "กมลาไสย", "ยางตลาด", "ห้วยผึ้ง",
    "ขอนแก่น", "น้ำพอง", "กระนวน", "ชุมแพ", "บ้านไผ่", "พล", "ภูเวียง", "มัญจาคีรี",
    "นครพนม", "ธาตุพนม", "เรณูนคร", "นาแก", "ศรีสงคราม", "บ้านแพง", "ท่าอุเทน",
    "เลย", "เชียงคาน", "วังสะพุง", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "นาแห้ว", "ปากชม",
    "มุกดาหาร", "มหาสารคาม", "ศรีสะเกษ", "อุบลราชธานี", "อำนาจเจริญ", "ชัยภูมิ", "นครราชสีมา", "โคราช", "กรุงเทพ"
)

# Udon Thani positive districts/subdistricts
$udonTerms = @(
    "เมืองอุดร", "อ.เมืองอุดร", "อำเภอเมืองอุดร", "กุมภวาปี", "หนองหาน", "บ้านดุง", "กุดจับ", "โนนสะอาด",
    "เพ็ญ", "วังสามหมอ", "น้ำโสม", "หนองแสง", "หนองวัวซอ", "บ้านผือ", "ไชยวาน", "ทุ่งฝน",
    "สร้างคอม", "ศรีธาตุ", "พิบูลย์รักษ์", "นายูง", "ประจักษ์ศิลปาคม", "กู่แก้ว",
    "ต.บ้านจั่น", "ต.หนองบัว", "ต.หมากแข้ง", "ต.บ้านเลื่อม", "ต.หมูม่น", "หนองใส", "หนองประจักษ์",
    "สามพร้าว", "นาดี", "บ้านตาด", "นิคมสงเคราะห์", "กุดสระ", "คำชะโนด", "บ้านเชียง"
)

# Exclusion keywords for non-construction posts
$excludeKeywords = @(
    "10 แบบบ้าน", "แบบบ้านยอดนิยม", "แบบบ้านดีไซน์", "แบบบ้านขายดี", "แบบบ้านแนะนำ", "แบบบ้านสวย", "แบบบ้านทันสมัย", "แบบบ้านโมเดิร์น", "แบบบ้านทรง",
    "แบบบ้านชั้นเดียว", "แบบบ้าน 2 ชั้น",
    "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ", "โปรโมชั่น", "โปรโมชัน", "จองและทำสัญญา", "จองวันนี้", "รับส่วนลด", "แจกฟรี", "ฟรีของแถม", "แถมฟรี",
    "ยื่นสินเชื่อ", "กู้ได้เต็ม", "ผ่อนเริ่มต้น",
    "อยากสร้างบ้านทั้งที", "สร้างสุข สร้างฝัน", "เพราะบ้านคือความฝัน", "สร้างบ้านคือเรื่องง่าย", "งบประมาณไม่บานปลาย",
    "ทำไมถึงใช้", "ทำไมเราถึงใช้", "ทำไมต้อง", "ความรู้เรื่องบ้าน", "เกร็ดความรู้", "ข้อควรรู้", "รู้หรือไม่", "หลายคนที่ติดตาม", "คลิปนี้มีคำตอบ", "ข้อดีข้อเสีย",
    "3d", "perspective", "ภาพ 3d", "ภาพจำลอง", "ภาพเสมือนจริง",
    "monthly meeting", "MONTHLY MEETING", "การประชุมประจำเดือน", "การประชุม", "ประชุมประจำเดือน", "ประชุม", "สัมมนา", "อบรม",
    "ceo onsite", "CEO Onsite", "ราคาถูกแค่ไหน", "สาระเล็ก ๆ", "สาระเล็กๆ", "สร้างบ้านอย่างไรไม่ให้โดนทิ้งงาน", "คำคม", "ข้อคิด", "podcast", "พอดแคสต์",
    "ด้วยบริบทของจังหวัด", "บริบทของจังหวัด"
)

$report = @()

foreach ($comp in $companies) {
    if (-not $comp.projects -or $comp.projects.Count -eq 0) {
        continue
    }

    $validProjects = @()
    $seenCustomerKeys = @{}

    foreach ($proj in $comp.projects) {
        $cap = $proj.caption
        if (-not $cap) { $cap = $proj.name }
        $capLower = $cap.ToLower()

        # Check 1: Non-construction content exclusion (Ads, tips, CEO talks, Meetings)
        $isExcluded = $false
        $excludeReason = ""
        foreach ($ek in $excludeKeywords) {
            if ($capLower.Contains($ek.ToLower())) {
                $isExcluded = $true
                $excludeReason = "Content match: $ek"
                break
            }
        }
        if ($isExcluded) {
            $report += [PSCustomObject]@{
                Company = $comp.name
                Project = $proj.name
                Status = "REMOVED"
                Reason = $excludeReason
            }
            continue
        }

        # Check 2: Location check (Check if outside Udon Thani)
        $hasUdonMatch = $false
        foreach ($ut in $udonTerms) {
            if ($cap.Contains($ut)) {
                $hasUdonMatch = $true
                break
            }
        }

        $hasOtherProv = $false
        $otherProvName = ""
        foreach ($op in $otherProvincesKeywords) {
            if ($cap.Contains($op)) {
                $hasOtherProv = $true
                $otherProvName = $op
                break
            }
        }

        # If it explicitly mentions another province and DOES NOT mention an Udon district -> Exclude
        if ($hasOtherProv -and -not $hasUdonMatch) {
            $report += [PSCustomObject]@{
                Company = $comp.name
                Project = $proj.name
                Status = "REMOVED"
                Reason = "Other Province: $otherProvName"
            }
            continue
        }

        # Check 3: Deduplication for same customer in same company
        $custKey = ""
        if ($cap -match '(บ้านคุณ[^\s,]+|บ้านพักอาศัยคุณ[^\s,]+|ของคุณ[^\s,]+)') {
            $custKey = $matches[1]
        }

        if ($custKey -and $seenCustomerKeys.ContainsKey($custKey)) {
            $report += [PSCustomObject]@{
                Company = $comp.name
                Project = $proj.name
                Status = "REMOVED"
                Reason = "Duplicate customer: $custKey (kept latest)"
            }
            continue
        }

        if ($custKey) {
            $seenCustomerKeys[$custKey] = $true
        }

        $validProjects += $proj
        $report += [PSCustomObject]@{
            Company = $comp.name
            Project = $proj.name
            Status = "KEPT"
            Reason = "Valid Udon Project"
        }
    }

    # Update company project list
    $comp.projects = $validProjects
    $comp.totalProjects = $validProjects.Count
    $comp.newProjectsThisMonth = $validProjects.Count
    $comp.totalValueMillion = [Math]::Round($validProjects.Count * 5.5, 1)

    $gb = 0; $fd = 0; $st = 0; $fn = 0
    foreach ($vp in $validProjects) {
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

    if ($validProjects.Count -gt 0) {
        $comp.aiShortRec = "พบ $($validProjects.Count) ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (ฐานราก: $fd, โครงสร้าง: $st, สถาปัตย์: $fn)"
    } else {
        $comp.aiShortRec = "ไม่พบไซต์งานก่อสร้างใน จ.อุดรธานี ในช่วงเวลาที่สำรวจ"
    }
}

# Write back cleaned data
$newJson = $companies | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)

# Output summary report
$report | Group-Object Company | ForEach-Object {
    $kept = ($_.Group | Where-Object { $_.Status -eq 'KEPT' }).Count
    $removed = ($_.Group | Where-Object { $_.Status -eq 'REMOVED' }).Count
    Write-Output "Company: $($_.Name) | KEPT: $kept | REMOVED: $removed"
}
