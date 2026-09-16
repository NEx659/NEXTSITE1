[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$otherProvinces = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)
$udonDistricts = @(
    "เมืองอุดรธานี", "เมืองอุดร", "อ.เมือง", "อำเภอเมือง", "ต.บ้านจั่น", "ต.หนองบัว", "ต.หมากแข้ง", "ต.บ้านเลื่อม", "ต.หมูม่น", "ต.เชียงยืน", "เชียงยืน", "หนองใส", "หนองประจักษ์", "สามพร้าว", "นาดี", "บ้านตาด", "นิคมสงเคราะห์", "กุดสระ", "บ้านโคกก่อง", "ต.โคกกลาง",
    "กุมภวาปี", "อ.กุมภวาปี", "อำเภอกุมภวาปี", "พันดอน", "ห้วยเกิ้ง",
    "หนองหาน", "อ.หนองหาน", "อำเภอหนองหาน", "บ้านเชียง",
    "บ้านดุง", "อ.บ้านดุง", "อำเภอบ้านดุง", "คำชะโนด",
    "เพ็ญ", "อ.เพ็ญ", "อำเภอเพ็ญ",
    "กุดจับ", "อ.กุดจับ", "อำเภอกุดจับ",
    "โนนสะอาด", "อ.โนนสะอาด", "อำเภอโนนสะอาด",
    "ศรีธาตุ", "อ.ศรีธาตุ", "อำเภอศรีธาตุ",
    "วังสามหมอ", "อ.วังสามหมอ", "อำเภอวังสามหมอ",
    "ทุ่งฝน", "อ.ทุ่งฝน", "อำเภอทุ่งฝน",
    "สร้างคอม", "อ.สร้างคอม", "อำเภอสร้างคอม",
    "หนองแสง", "อ.หนองแสง", "อำเภอหนองแสง",
    "หนองวัวซอ", "อ.หนองวัวซอ", "อำเภอหนองวัวซอ",
    "บ้านผือ", "อ.บ้านผือ", "อำเภอบ้านผือ",
    "น้ำโสม", "อ.น้ำโสม", "อำเภอน้ำโสม",
    "นายูง", "อ.นายูง", "อำเภอนายูง",
    "พิบูลย์รักษ์", "อ.พิบูลย์รักษ์", "อำเภอพิบูลย์รักษ์",
    "กู่แก้ว", "อ.กู่แก้ว", "อำเภอกู่แก้ว",
    "ประจักษ์ศิลปาคม", "อ.ประจักษ์ศิลปาคม", "อ.ประจักษ์",
    "ไชยวาน", "อ.ไชยวาน", "อำเภอไชยวาน"
)

function Test-IsOtherProvince($p) {
    if ($p.error -or $p.'#error') { return $true }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    foreach ($prov in $otherProvinces) {
        if ($text -match "(?:จ\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน)\s*[:\s]*[^\n]*?$prov") {
            if ($matches[0] -notmatch "อุดร") { return $true }
        }
    }
    foreach ($prov in $otherProvinces) {
        if ($text -match "(?:จ\.|จังหวัด)$prov") {
            $hasUdon = ($text -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
            $hasUdonDist = $false
            foreach ($ud in $udonDistricts) {
                if ($text -match $ud) { $hasUdonDist = $true; break }
            }
            if (-not $hasUdon -and -not $hasUdonDist) { return $true }
        }
    }
    return $false
}

function Test-IsHolidayAnnouncement($p) {
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

$step2Posts = [System.Collections.Generic.List[object]]::new()
for ($i = 0; $i -lt $rawPosts.Count; $i++) {
    $p = $rawPosts[$i]
    if (-not (Test-IsOtherProvince $p) -and -not (Test-IsHolidayAnnouncement $p)) {
        $p | Add-Member -NotePropertyName "originalIndex" -NotePropertyValue $i -Force
        $step2Posts.Add($p)
    }
}

# Strict Ad/Promo Patterns
# We exclude if it is pure promo / catalog / marketing / generic loan pitch WITHOUT Udon district and WITHOUT person name
$adPromoKeywords = @(
    "โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ",
    "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี",
    "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ",
    "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ",
    "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร\.ม\.ละ"
)

function Check-HasUdonDistrictOrPersonName($text) {
    # 1. Check 20 Udon districts & subdistricts
    foreach ($dist in $udonDistricts) {
        if ($text -match [regex]::Escape($dist)) {
            return @{ hasMatch = $true; reason = "พบอำเภอ/ตำบลในอุดร: $dist" }
        }
    }
    
    # 2. Check Customer / Person Names (บ้านคุณ..., ของคุณ..., คุณหมอ..., อาจารย์..., ช่าง..., ผอ...., เสี่ย..., พี่..., แม่..., ป้า..., ลุง..., ท่านอาจารย์)
    if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") {
        return @{ hasMatch = $true; reason = "พบชื่อเจ้าของบ้าน: $($matches[0])" }
    }
    
    if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s+([ก-๙a-zA-Z]+)") {
        return @{ hasMatch = $true; reason = "พบชื่อบุคคล/ลูกค้า: $($matches[0])" }
    }

    if ($text -match "(?:คุณ)\s+([ก-๙a-zA-Z]+)") {
        $candidate = $matches[0]
        if ($candidate -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") {
            return @{ hasMatch = $true; reason = "พบชื่อคุณ: $candidate" }
        }
    }

    return @{ hasMatch = $false; reason = "ไม่มีอำเภอและไม่มีชื่อคน" }
}

$excludedAdPosts = [System.Collections.Generic.List[object]]::new()
$keptPosts = [System.Collections.Generic.List[object]]::new()

foreach ($p in $step2Posts) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    
    $isAd = $false
    $matchedKw = ""
    foreach ($kw in $adPromoKeywords) {
        if ($text -match $kw) {
            $isAd = $true
            $matchedKw = $kw
            break
        }
    }
    
    if ($isAd) {
        $check = Check-HasUdonDistrictOrPersonName $text
        if ($check.hasMatch) {
            $keptPosts.Add($p)
        } else {
            $excludedAdPosts.Add([pscustomobject]@{
                index = $p.originalIndex
                pageName = $p.pageName
                adWord = $matchedKw
                text = $text
            })
        }
    } else {
        $keptPosts.Add($p)
    }
}

Write-Host "============================================="
Write-Host "TOTAL CHECKED: $($step2Posts.Count)"
Write-Host "EXCLUDED ADS/PROMO (NO DISTRICT & NO PERSON NAME): $($excludedAdPosts.Count)"
Write-Host "TOTAL KEPT AFTER STEP 3: $($keptPosts.Count)"
Write-Host "============================================="

for ($k = 0; $k -lt $excludedAdPosts.Count; $k++) {
    $item = $excludedAdPosts[$k]
    Write-Host "---------------------------------------------"
    Write-Host "[$($k+1)] Index $($item.index) | เพจ: $($item.pageName) | คำโฆษณา: $($item.adWord)"
    Write-Host "ข้อความ: $($item.text -replace "`r?`n", " ")"
}
