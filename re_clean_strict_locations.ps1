# Re-clean all companies with strict location extraction (ignoring hashtag spam)
$dataPath = "c:\Users\pannipan\Downloads\N\js\baseline_1_data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

# Known non-Udon provinces and out-of-province districts/subdistricts
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

# Udon Thani valid locations
$udonValidLocations = @(
    "เมืองอุดรธานี", "เมืองอุดร", "อ.เมืองอุดร", "อำเภอเมืองอุดร", "จ.อุดรธานี", "จังหวัดอุดรธานี", "อุดรธานี",
    "กุมภวาปี", "หนองหาน", "บ้านดุง", "กุดจับ", "โนนสะอาด",
    "เพ็ญ", "วังสามหมอ", "น้ำโสม", "หนองแสง", "หนองวัวซอ", "บ้านผือ", "ไชยวาน", "ทุ่งฝน",
    "สร้างคอม", "ศรีธาตุ", "พิบูลย์รักษ์", "นายูง", "ประจักษ์ศิลปาคม", "กู่แก้ว",
    "บ้านจั่น", "หนองบัว", "หมากแข้ง", "บ้านเลื่อม", "หมูม่น", "หนองใส", "หนองประจักษ์",
    "สามพร้าว", "นาดี", "บ้านตาด", "นิคมสงเคราะห์", "กุดสระ", "คำชะโนด", "บ้านเชียง", "เชียงยืน", "หนองเม็ก", "ดอนหายโศก"
)

$excludeKeywords = @(
    "10 แบบบ้าน", "แบบบ้านยอดนิยม", "แบบบ้านดีไซน์", "แบบบ้านขายดี", "แบบบ้านแนะนำ", "แบบบ้านสวย", "แบบบ้านทันสมัย", "แบบบ้านโมเดิร์น", "แบบบ้านทรง",
    "แบบบ้านชั้นเดียว", "แบบบ้าน 2 ชั้น", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ", "โปรโมชั่น", "โปรโมชัน", "จองและทำสัญญา", "จองวันนี้", "รับส่วนลด", "แจกฟรี", "ฟรีของแถม", "แถมฟรี",
    "ยื่นสินเชื่อ", "กู้ได้เต็ม", "ผ่อนเริ่มต้น", "อยากสร้างบ้านทั้งที", "สร้างสุข สร้างฝัน", "เพราะบ้านคือความฝัน", "สร้างบ้านคือเรื่องง่าย", "งบประมาณไม่บานปลาย",
    "ทำไมถึงใช้", "ทำไมเราถึงใช้", "ทำไมต้อง", "ความรู้เรื่องบ้าน", "เกร็ดความรู้", "ข้อควรรู้", "รู้หรือไม่", "หลายคนที่ติดตาม", "คลิปนี้มีคำตอบ", "ข้อดีข้อเสีย",
    "3d", "perspective", "ภาพ 3d", "ภาพจำลอง", "ภาพเสมือนจริง",
    "monthly meeting", "MONTHLY MEETING", "การประชุมประจำเดือน", "การประชุม", "ประชุมประจำเดือน", "ประชุม", "สัมมนา", "อบรม",
    "ceo onsite", "CEO Onsite", "ราคาถูกแค่ไหน", "สาระเล็ก ๆ", "สาระเล็กๆ", "สร้างบ้านอย่างไรไม่ให้โดนทิ้งงาน", "คำคม", "ข้อคิด", "podcast", "พอดแคสต์",
    "ด้วยบริบทของจังหวัด", "บริบทของจังหวัด"
)

$removalLog = @()

foreach ($comp in $companies) {
    if (-not $comp.projects -or $comp.projects.Count -eq 0) { continue }

    $cleanedProjects = @()
    $seenCustomerKeys = @{}

    foreach ($proj in $comp.projects) {
        $cap = $proj.caption
        if (-not $cap) { $cap = $proj.name }

        # Split body text from hashtag block
        $bodyText = $cap
        if ($bodyText -match '(?s)^(.*?)(\n\s*#[^\n]+)+$') {
            $bodyText = $matches[1]
        }
        $bodyLower = $bodyText.ToLower()

        # Check 1: Exclude ads / meeting / talk content
        $isExcludedContent = $false
        $reason = ""
        foreach ($ek in $excludeKeywords) {
            if ($bodyLower.Contains($ek.ToLower())) {
                $isExcludedContent = $true
                $reason = "Ad/Meeting/Tip: $ek"
                break
            }
        }
        if ($isExcludedContent) {
            $removalLog += [PSCustomObject]@{ Company = $comp.name; Project = $proj.name; Reason = $reason }
            continue
        }

        # Check 2: Check primary location in body text
        # Specifically look for explicit mention of other province in bodyText or in the location line (📍...)
        $isOtherProv = $false
        $otherProvDetected = ""

        # Extract location lines (lines starting with 📍, 🏡, บ้าน, อ., ต., จ.)
        $locLines = ($bodyText -split "`n") | Where-Object { $_ -match '(📍|🏡|พิกัด|สถานที่|อำเภอ|ตำบล|จังหวัด|อ\.|ต\.|จ\.)' }
        $locTextToInspect = if ($locLines) { $locLines -join " " } else { $bodyText }

        foreach ($op in $strictOtherProvinces) {
            if ($locTextToInspect.Contains($op)) {
                # Check if it also has an explicit Udon Thani district in the same location context
                $hasUdonDistrictInLoc = $false
                foreach ($ut in $udonValidLocations) {
                    if ($locTextToInspect.Contains($ut)) {
                        # If both are present, make sure it's not "อ.สว่างแดนดิน จ.สกลนคร"
                        if ($op -match '(สกลนคร|สว่างแดนดิน|หนองคาย|หนองบัวลำภู|ขอนแก่น|บึงกาฬ|ร้อยเอ็ด|กาฬสินธุ์|เลย)' -and $locTextToInspect -match "(จ\.$op|จังหวัด$op|อ\.$op|อำเภอ$op|ต\.$op|ตำบล$op)") {
                            # It explicitly states it is in that other province!
                            $hasUdonDistrictInLoc = $false
                            break
                        } else {
                            $hasUdonDistrictInLoc = $true
                        }
                    }
                }

                if (-not $hasUdonDistrictInLoc) {
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

        # Check 3: Customer deduplication (keep only latest update for same customer)
        $custKey = ""
        if ($cap -match '(บ้านคุณ[^\s,]+|บ้านพักอาศัยคุณ[^\s,]+|ของคุณ[^\s,]+|Owner\s+คุณ\s*([^\n\r]+))') {
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

Write-Output "=== STRICT CLEANUP COMPLETED ==="
Write-Output "Total removed items: $($removalLog.Count)"
$removalLog | Format-Table -AutoSize | Out-String | Write-Output
