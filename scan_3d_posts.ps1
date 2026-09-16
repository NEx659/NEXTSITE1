[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$jsonPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
if (-not (Test-Path $jsonPath)) {
    $jsonPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
}

$raw = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = if ($raw -is [array]) { $raw } else { $raw.items }

$otherProvincesList = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "กรุงเทพ", "กทม"
)
$outsideDistrictsList = @(
    "เซกา", "บึงโขงหลง", "โซ่พิสัย", "ปากคาด", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สังคม", "รัตนวาปี", "สระใคร", "เฝ้าไร่",
    "พังโคน", "สว่างแดนดิน", "วานรนิวาส", "พรรณานิคม", "อากาศอำนวย",
    "นากลาง", "ศรีบุญเรือง", "โนนสัง", "นาวัง", "สุวรรณคูหา",
    "วังสะพุง", "เชียงคาน", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "ท่าลี่", "ปากชม",
    "บ้านไผ่", "ชุมแพ", "น้ำพอง", "กระนวน", "พระยืน", "หนองเรือ", "พล", "ม.ขอนแก่น", "มข."
)
$udonDistrictsList = @(
    "เมืองอุดรธานี", "เมืองอุดร", "อำเภอเมือง", "อ.เมือง", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม", "ไชยวาน",
    "หมูม่น", "หมากแข้ง", "หนองบัว", "สามพร้าว", "บ้านจั่น", "บ้านจาน", "หนองนาคำ", "บ้านตาด",
    "โนนสูง", "บ้านเลื่อม", "เชียงพิณ", "กุดสระ", "นาดี", "บ้านขาว", "หนองไผ่", "นาข่า",
    "หนองขอนกว้าง", "นิคมสงเคราะห์", "โคกสะอาด", "เชียงแหว", "จำปี", "ผาสุก", "ดอนหายโศก",
    "บ้านเชียง", "หนองเม็ก", "โพนสูง", "สร้างแป้น", "สุมเส้า", "สุขคณา", "โนนตูม", "โนนยาง",
    "นาม่วง", "เชียงกรม", "บ้านปูลู", "รังษิณา", "ดอนเสือ", "หนองประจักษ์", "ยูดีทาวน์",
    "อุดรธานี", "จ.อุดร", "จังหวัดอุดร", "จ. อุดร", "เมือง, อุดร", "เมือง อุดร", "udon"
)

function Test-IsOtherProvince($p) {
    if ($p.error -or $p.'#error') { return $true }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $hasClearUdon = ($text -match "(?:พิกัด|หน้างาน|สถานที่)[\s:]*[^\n]*?(?:อุดร|หนองขอนกว้าง|บ้านจั่น|หมูม่น|วังสามหมอ|หมากแข้ง|หนองบัว|สามพร้าว|กุมภวาปี|หนองหาน|บ้านดุง|เพ็ญ|กุดจับ)")
    $lines = $text -split "\r?\n"
    foreach ($line in $lines) {
        $trimLine = $line.Trim()
        if ($trimLine -match "พิกัด|หน้างาน|สถานที่ก่อสร้าง|ที่ตั้งโครงการ|โลเคชั่น|location") {
            foreach ($prov in $otherProvincesList) {
                $provRegex = if ($prov -in @('เลย','อุบล','กทม')) { "(?:จ\.|จังหวัด)\s*$prov" } else { "(?:จ\.|จังหวัด)?\s*$prov" }
                if ($trimLine -match $provRegex -and $trimLine -notmatch "อุดร" -and -not $hasClearUdon) {
                    return $true
                }
            }
            foreach ($dist in $outsideDistrictsList) {
                if ($trimLine -match "(?:อ\.|อำเภอ)\s*$dist" -and $trimLine -notmatch "อุดร" -and -not $hasClearUdon) {
                    return $true
                }
            }
        }
    }
    $bodyText = $text
    $footerMarkers = @("ที่ตั้ง สำนักงาน", "ที่ตั้งสำนักงาน", "สำนักงานใหญ่", "สนใจติดต่อ", "โทร 0", "Tel:", "Line ID", "#รับสร้างบ้าน", "#DREAM UP")
    foreach ($fm in $footerMarkers) {
        $idx = $bodyText.IndexOf($fm)
        if ($idx -gt 15) { $bodyText = $bodyText.Substring(0, $idx) }
    }
    foreach ($prov in $otherProvincesList) {
        if ($bodyText -match "(?:จ\.|จังหวัด|หน้างาน|พิกัด)\s*[:\s]*$prov" -and -not $hasClearUdon) {
            $hasUdon = ($bodyText -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
            $hasUdonDist = $false
            foreach ($ud in $udonDistrictsList) {
                if ($bodyText -match $ud) { $hasUdonDist = $true; break }
            }
            if (-not $hasUdon -and -not $hasUdonDist) { return $true }
        }
    }
    return $false
}

function Test-IsHoliday($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    if ($text -match "การพัฒนา\s*ไม่มีวันหยุด|ไม่มีวันหยุด") {
        if ($text -match "สำนักงานใหม่|ก่อสร้าง") { return $false }
    }
    if ($text -match "แจ้งวันหยุด|วันหยุดนักขัตฤกษ์|ประกาศวันหยุด|หยุดทำการ|ปิดทำการ|สุขสันต์วันแม่|วันแม่แห่งชาติ|Happy Mother's Day|สุขสันต์วันสงกรานต์|สวัสดีปีใหม่|วันหยุดยาว") {
        if ($text -notmatch "เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ตอกเสาเข็ม") { return $true }
    }
    return $false
}

function Test-IsAd($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $adKeywords = @("โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี", "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ", "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ", "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร\.ม\.ละ")
    $isAd = $false
    foreach ($kw in $adKeywords) {
        if ($text -match $kw) { $isAd = $true; break }
    }
    if ($isAd) {
        $hasRealWork = ($text -match "งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|สุขภัณฑ์|โครงเหล็ก|ส่งมอบบ้าน|ส่งมอบงาน")
        if ($hasRealWork -and ($text -match "อุดร|อุดรธานี" -or $text -match "(?:อ\.|อำเภอ)\s*เมือง")) { return $false }
        foreach ($dist in $udonDistrictsList) {
            if ($text -match [regex]::Escape($dist)) { return $false }
        }
        if ($text -match "(?:อ\.|อำเภอ)\s*เมือง" -and $text -match "อุดร") { return $false }
        if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") { return $false }
        if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?") { return $false }
        if ($text -match "(?:คุณ)\s*([ก-๙a-zA-Z]+)") {
            if ($matches[0] -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") { return $false }
        }
        return $true
    }
    return $false
}

# Current valid posts
$currentPosts = @()
foreach ($p in $posts) {
    if (-not (Test-IsOtherProvince $p) -and -not (Test-IsHoliday $p) -and -not (Test-IsAd $p)) {
        $currentPosts += $p
    }
}

Write-Host "Current valid posts before 3D filter: $($currentPosts.Count)"

# 3D / Graphic / Architectural Render detection
$threeDKeywords = @(
    "3d", "3D", "ภาพ 3d", "ภาพ 3D", "ภาพ3d", "ภาพ3D", "รูป 3d", "รูป 3D", "รูป3d", "รูป3D",
    "แบบ 3d", "แบบ 3D", "แบบ3d", "แบบ3D", "กราฟิก", "กราฟฟิก", "โมเดล", "perspective",
    "งานออกแบบ 3d", "งานออกแบบ 3D", "งานออกแบบบ้าน", "ออกแบบบ้าน 3d", "ออกแบบบ้าน 3D",
    "render", "เรนเดอร์", "sketchup", "lumion", "autocad", "ภาพจำลอง", "แปลนบ้าน", "แบบแปลน"
)

$threeDCandidates = @()
foreach ($p in $currentPosts) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    $matchedKW = @()
    foreach ($kw in $threeDKeywords) {
        if ($text -match [regex]::Escape($kw)) {
            $matchedKW += $kw
        }
    }
    if ($matchedKW.Count -gt 0) {
        $hasRealSite = ($text -match "เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|ส่งมอบบ้าน|งานติดตั้งสุขภัณฑ์|งานทาสีโครงเหล็ก")
        $threeDCandidates += [PSCustomObject]@{
            Post = $p
            MatchedKW = ($matchedKW -join ", ")
            HasRealSite = $hasRealSite
        }
    }
}

Write-Host "========================================="
Write-Host "Found $($threeDCandidates.Count) candidate posts with 3D/Graphic keywords"
Write-Host "========================================="

$idx = 1
foreach ($c in $threeDCandidates) {
    $p = $c.Post
    $u = if ($p.user) { $p.user.name } else { $p.pageName }
    $lines = ($p.text -split "\r?\n") | Where-Object { $_.Trim().Length -gt 0 }
    $l1 = if ($lines.Count -gt 0) { $lines[0] } else { "" }
    $l2 = if ($lines.Count -gt 1) { $lines[1] } else { "" }
    
    Write-Host "-----------------------------------------"
    Write-Host "[$idx] เพจ/บริษัท: $u"
    Write-Host "URL: $($p.url)"
    Write-Host "คีย์เวิร์ดที่พบ: $($c.MatchedKW)"
    Write-Host "มีงานก่อสร้างจริงปนอยู่ด้วยหรือไม่: $($c.HasRealSite)"
    Write-Host "เนื้อหา: $l1 | $l2"
    $idx++
}
