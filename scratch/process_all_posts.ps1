$dataJsPath = "js/data.js"
$postsJsonPath = "scripts/facebook_54_pages_posts.json"

$rawContent = Get-Content $dataJsPath -Raw -Encoding UTF8
$jsonStr = $rawContent -replace '(?s)^.*?var\s+UDON_COMPANIES\s*=\s*\[', '[' -replace '(?s)\];.*$', ']'
$companies = $jsonStr | ConvertFrom-Json

foreach ($c in $companies) {
    $c.projects = @()
    $c.totalProjects = 0
    $c.newProjectsThisMonth = 0
    $c.totalValueMillion = 0
    $c.stageBreakdown = [PSCustomObject]@{
        groundbreak = 0
        foundation = 0
        structure = 0
        finishing = 0
    }
}

$udonDistricts = @(
    'เมืองอุดรธานี', 'กุมภวาปี', 'หนองหาน', 'บ้านดุง', 'เพ็ญ', 'กุดจับ', 
    'โนนสะอาด', 'ศรีธาตุ', 'วังสามหมอ', 'ทุ่งฝน', 'สร้างคอม', 'หนองแสง', 
    'หนองวัวซอ', 'บ้านผือ', 'น้ำโสม', 'นายูง', 'พิบูลย์รักษ์', 'กู่แก้ว', 
    'ประจักษ์ศิลปาคม', 'ไชยวาน'
)

$udonZones = @(
    'หมากแข้ง', 'หนองบัว', 'สามพร้าว', 'บ้านจาน', 'หนองนาคำ', 'บ้านตาด', 
    'โนนสูง', 'บ้านเลื่อม', 'เชียงพิณ', 'หมูม่น', 'กุดสระ', 'นาดี', 'บ้านขาว', 
    'หนองไผ่', 'นาข่า', 'หนองขอนกว้าง', 'นิคมสงเคราะห์', 'โคกสะอาด',
    'เชียงแหว', 'จำปี', 'ผาสุก', 'ดอนหายโศก', 'บ้านเชียง', 'หนองเม็ก', 'โพนสูง',
    'อภิทาวน์', 'ศุภาลัย', 'รชยา', 'วิลลาจจิโอ', 'สีหราช', 'แลนด์แอนด์เฮ้าส์', 'คันทรีการ์เด้น',
    'สุขคณา', 'ซอยสุขคณา', 'สร้างแป้น', 'โนนตูม', 'สุมเส้า', 'โนนยาง'
)

$posts = Get-Content $postsJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$accepted = 0
$rejected = 0
$matchedCount = 0

foreach ($item in $posts) {
    $rawText = $item.text
    if (-not $rawText) { $rawText = $item.postText }
    if (-not $rawText) { $rawText = $item.caption }
    
    $rawPageName = $item.pageName
    if (-not $rawPageName -and $item.user) { $rawPageName = $item.user.name }
    
    $ocrText = $item.ocrText
    if (-not $ocrText -and $item.media -and $item.media[0]) { $ocrText = $item.media[0].ocrText }
    
    $checkInLoc = $item.locationName
    if (-not $checkInLoc) { $checkInLoc = $item.placeName }
    if (-not $checkInLoc) { $checkInLoc = $item.city }
    
    $combined = "$rawText $rawPageName $ocrText $checkInLoc"
    $t = $combined.ToLower()
    $postedTime = $item.time
    if (-not $postedTime) { $postedTime = $item.postedTime }
    
    # 1. Reject internal / non-construction
    if ($t -match 'ฝึกงาน|วันเกิด|ทำบุญบริษัท|ทำบุญออฟฟิศ|รับสมัครงาน|สัมมนา|งานเลี้ยงบริษัท|ฤกษ์ดี|ฤกษ์มงคล|วันมงคล|เทวีฤกษ์|ภูมิปาโลฤกษ์|ดูดวง|ฮวงจุ้ย|สาระน่ารู้') {
        $rejected++
        continue
    }

    # 2. Check other provinces
    $tNoHash = $t -replace '#[^\s]+', ''
    $isUdonExplicit = ($tNoHash -match 'อุดรธานี') -and ($udonDistricts | Where-Object { $tNoHash.Contains($_) })
    
    $otherProvs = @('ขอนแก่น', 'khon kaen', 'khonkaen', 'สกลนคร', 'หนองคาย', 'หนองบัวลำภู', 'ร้อยเอ็ด', 'roiet', 'มหาสารคาม', 'กาฬสินธุ์', 'ยโสธร', 'มุกดาหาร', 'อุบล', 'โคราช', 'นครราชสีมา', 'เชียงใหม่', 'กรุงเทพ', 'bangkok')
    $isOther = $false
    foreach ($op in $otherProvs) {
        if ($tNoHash.Contains($op) -and -not $isUdonExplicit) {
            $isOther = $true
            break
        }
    }
    if ($tNoHash -match 'จังหวัดเลย|เทศบาลเมืองเลย|เมืองเลย|วังสะพุง|เชียงคาน|loei' -and -not $isUdonExplicit) {
        $isOther = $true
    }
    if ($isOther) {
        $rejected++
        continue
    }

    # 3. MANDATORY: Must have Udon district or village
    $hasUdon = $false
    $matchedDist = 'เมืองอุดรธานี'
    foreach ($d in $udonDistricts) {
        if ($tNoHash.Contains($d) -or $tNoHash.Contains("อ.$d") -or $tNoHash.Contains("อำเภอ$d")) {
            $hasUdon = $true
            $matchedDist = $d
            break
        }
    }
    if (-not $hasUdon) {
        foreach ($z in $udonZones) {
            if ($tNoHash.Contains($z)) {
                $hasUdon = $true
                if ($z -eq 'สร้างแป้น' -or $z -eq 'สุมเส้า') { $matchedDist = 'เพ็ญ' }
                elseif ($z -eq 'โนนตูม' -or $z -eq 'โนนยาง' -or $z -eq 'สุขคณา' -or $z -eq 'หนองนาคำ') { $matchedDist = 'เมืองอุดรธานี' }
                else { $matchedDist = "เมืองอุดรธานี" }
                break
            }
        }
    }
    if (-not $hasUdon) {
        $rejected++
        continue
    }

    # Find company
    $matchedComp = $null
    foreach ($c in $companies) {
        $slug = ''
        if ($c.facebookUrl) {
            $slug = ($c.facebookUrl.TrimEnd('/') -split '/')[-1]
            $slug = $slug -replace '\?.*$', ''
        }
        $cNameClean = $c.name -replace 'บริษัท|จำกัด|ห้างหุ้นส่วน|หจก|รับสร้างบ้าน', ''
        $cNameClean = $cNameClean.Trim().ToLower()
        
        if ($slug -and $combined.ToLower().Contains($slug.ToLower())) {
            $matchedComp = $c
            break
        }
        if ($cNameClean.Length -ge 3 -and $combined.ToLower().Contains($cNameClean)) {
            $matchedComp = $c
            break
        }
        if ($c.phone -and $c.phone.Length -ge 8) {
            $cleanPhone = $c.phone -replace '\D', ''
            if ($cleanPhone.Length -ge 8 -and $combined.Contains($cleanPhone.Substring($cleanPhone.Length - 8))) {
                $matchedComp = $c
                break
            }
        }
    }

    if (-not $matchedComp) {
        $rejected++
        continue
    }

    # Customer Name
    $cust = ''
    if ($combined -match 'คุณ([ก-๙a-zA-Z]{2,15})') {
        $candidate = $matches[1]
        $black = @('ภาพ', 'งาน', 'ลูกค้า', 'สร้าง', 'บ้าน', 'ดี', 'เรา', 'ท่าน', 'พี่', 'น้อง', 'ใหม่', 'SCG', 'อุดร')
        if ($black -notcontains $candidate) {
            $cust = $candidate
        }
    }
    if ($combined -match 'พี่ปิ๊ก') { $cust = 'พี่ปิ๊ก' }
    if ($combined -match 'คุณแท็ค|คุณนิด') { $cust = 'แท็ค-นิด' }
    if ($combined -match 'คุณกนกวรรณ') { $cust = 'กนกวรรณ' }
    if ($combined -match 'คุณพลอย') { $cust = 'พลอย' }

    # Stage
    $stageKey = 'structure'
    $stage = 'งานโครงสร้างอาคาร'
    $opp = 'โครงหลังคาสำเร็จรูป SCG Smart Truss, แผ่นหลังคา SCG, ปูนฉาบอิฐมวลเบา เสือ มอร์ตาร์'
    $val = 3.5

    if ($combined -match 'ส่งมอบบ้าน|ส่งมอบงาน|ตรวจรับบ้าน|ส่งมอบผลงาน') {
        $stageKey = 'finishing'
        $stage = 'ส่งมอบบ้านเสร็จสมบูรณ์ / โอกาสงานต่อเติม'
        $opp = 'สินค้าตกแต่งต่อเติม, งานสวน SCG Landscape, หลังคาโรงจอดรถ, ฉนวน STAY COOL'
        $val = 3.8
    } elseif ($combined -match 'รีโนเวท|ต่อเติม|โรงจอดรถ|ต่อเติมครัว|ปรับปรุง') {
        $stageKey = 'finishing'
        $stage = 'งานรีโนเวทและต่อเติมอาคาร'
        $opp = 'แผ่นสมาร์ทบอร์ด SCG, ปูนซ่อมแซมโครงสร้าง, กระเบื้อง COTTO, สุขภัณฑ์ COTTO'
        $val = 2.5
    } elseif ($combined -match 'เสาเอก|ยกเสา|ลงเสาเข็ม|ตอกเสาเข็ม') {
        $stageKey = 'groundbreak'
        $stage = 'ยกเสาเอก / เริ่มลงเสาเข็มเปิดหน้างาน'
        $opp = 'คอนกรีตผสมเสร็จ CPAC 240 ksc, ปูนซีเมนต์ไฮดรอลิก SCG, เหล็กเส้น มอก.'
        $val = 3.5
    } elseif ($combined -match 'ฐานราก|คานคอดิน|เทเสา|ตอม่อ|เทลีน') {
        $stageKey = 'foundation'
        $stage = 'งานฐานรากและเสาโครงสร้าง'
        $opp = 'คอนกรีตผสมเสร็จ CPAC 240 ksc, เหล็กข้ออ้อย SCG, ปูนซีเมนต์ SCG'
        $val = 3.5
    } elseif ($combined -match 'smart truss|โครงหลังคา|มุงหลังคา|กระเบื้องหลังคา|แผ่นหลังคา') {
        $stageKey = 'structure'
        $stage = 'งานโครงสร้างหลังคาและมุงหลังคา SCG'
        $opp = 'โครงหลังคาสำเร็จรูป SCG Smart Truss, กระเบื้องหลังคา SCG Prestige, ฉนวน STAY COOL'
        $val = 3.5
    } elseif ($combined -match 'ระบบไฟฟ้า|เดินระบบไฟฟ้า|ระบบประปา|งานระบบ|ตกแต่ง|ทาสี|ปูกระเบื้อง|สุขภัณฑ์|ฝ้า') {
        $stageKey = 'finishing'
        $stage = 'งานตกแต่งภายในและติดตั้งสุขภัณฑ์'
        $opp = 'ปูนเสือ มอร์ตาร์ ฉาบละเอียด, แผ่นสมาร์ทบอร์ด SCG, กระเบื้อง COTTO, สุขภัณฑ์ COTTO'
        $val = 3.5
    }

    # Title
    $title = ''
    if ($combined -match 'ส่งมอบบ้าน|ส่งมอบผลงาน') {
        $title = if ($cust) { "ส่งมอบบ้านคุณ$cust อ.$matchedDist" } else { "โครงการส่งมอบบ้าน อ.$matchedDist" }
    } elseif ($combined -match 'รีโนเวท|ต่อเติม|โรงจอดรถ|ต่อเติมครัว') {
        $title = if ($cust) { "งานรีโนเวท/ต่อเติม (คุณ$cust) อ.$matchedDist" } else { "งานรีโนเวท/ต่อเติมอาคาร อ.$matchedDist" }
    } elseif ($cust) {
        $title = "โครงการบ้านคุณ$cust อ.$matchedDist"
    } else {
        $title = "ไซต์งานก่อสร้าง อ.$matchedDist ($stage)"
    }

    $exists = $matchedComp.projects | Where-Object { $_.title -eq $title -or ($_.district -eq $matchedDist -and $_.stageKey -eq $stageKey) }
    if (-not $exists) {
        $projObj = [PSCustomObject]@{
            id = "proj-$($matchedComp.id)-$($matchedComp.projects.Count + 1)"
            title = $title
            district = $matchedDist
            stage = $stage
            stageKey = $stageKey
            valueMillion = $val
            date = if ($postedTime) { ($postedTime -split 'T')[0] } else { '2026-09-04' }
            status = "กำลังดำเนินการ ($stage)"
            source = "Facebook: $($matchedComp.name)"
            opportunity = $opp
        }
        $matchedComp.projects += $projObj
        $matchedComp.totalProjects = $matchedComp.projects.Count
        $matchedComp.newProjectsThisMonth = $matchedComp.projects.Count
        $matchedComp.totalValueMillion = [Math]::Round(($matchedComp.totalProjects * $val), 1)
        $matchedComp.revenuePotentialText = "฿$([Math]::Round(($matchedComp.totalValueMillion * 0.2), 1))M - ฿$([Math]::Round(($matchedComp.totalValueMillion * 0.25), 1))M"
        $matchedComp.stageBreakdown.$stageKey++
        $matchedComp.latestTimelineStage = $stageKey
        $matchedComp.areaExpansion = "$matchedDist อุดรธานี"
        
        $accepted++
        Write-Host "✅ Filtered & Added: [$($matchedComp.name)] -> $title ($stage)"
    }
}

Write-Host "=========================================="
Write-Host "Total Verified Udon Projects Filtered: $accepted"
Write-Host "Total Filtered Out (Ads/Non-Udon/Non-Construction): $rejected"
Write-Host "=========================================="

$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "// NEXTSITE AI - VERIFIED UDON THANI CONTRACTORS MASTER DATASET (54 COMPANIES)`nvar UDON_COMPANIES = " + $newJson + ";`n`nif (typeof window !== 'undefined') {`n  window.UDON_COMPANIES = UDON_COMPANIES;`n  window.MASTER_COMPANIES = UDON_COMPANIES;`n}"
[System.IO.File]::WriteAllText("js/data.js", $finalJs, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("js/baseline_1_data.js", $finalJs, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated js/data.js and js/baseline_1_data.js!"
