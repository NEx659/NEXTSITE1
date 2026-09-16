[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = if ($raw -is [array]) { $raw } else { $raw.items }

$otherProvincesList = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)

$udonDistrictsAndZonesList = @(
    "เมืองอุดรธานี", "เมืองอุดร", "อำเภอเมือง", "อ.เมือง", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม", "ไชยวาน",
    "หมูม่น", "หมากแข้ง", "หนองบัว", "สามพร้าว", "บ้านจั่น", "บ้านจาน", "หนองนาคำ", "บ้านตาด",
    "โนนสูง", "บ้านเลื่อม", "เชียงพิณ", "กุดสระ", "นาดี", "บ้านขาว", "หนองไผ่", "นาข่า",
    "หนองขอนกว้าง", "นิคมสงเคราะห์", "โคกสะอาด", "เชียงแหว", "จำปี", "ผาสุก", "ดอนหายโศก",
    "บ้านเชียง", "หนองเม็ก", "โพนสูง", "สร้างแป้น", "สุมเส้า", "สุขคณา", "โนนตูม", "โนนยาง",
    "นาม่วง", "เชียงกรม", "บ้านปูลู", "รังษิณา", "ดอนเสือ", "หนองประจักษ์", "ยูดีทาวน์",
    "อุดรธานี", "จ.อุดร", "จังหวัดอุดร", "จ. อุดร"
)

function Test-IsExplicitOtherProvince($post) {
    if ($post.error -or $post.'#error') { return $true }
    $text = [string]$post.text
    if (-not $text) { return $false }
    
    # Check if location/site is explicitly in other province
    foreach ($prov in $otherProvincesList) {
        $locRegex = "(?:จ\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน)[\s:]*[^\n]*?$prov"
        if ($text -match $locRegex) {
            $m = $Matches[0]
            if ($m -notmatch "อุดร") {
                # Ensure post is not actually an Udon site with other marketing mentions
                $siteInUdon = ($text -match "พิกัด[^\n]*?อุดร" -or $text -match "พิกัด[^\n]*?หมูม่น" -or $text -match "หน้างาน[^\n]*?อุดร")
                if (-not $siteInUdon) {
                    return $true
                }
            }
        }
    }
    
    foreach ($prov in $otherProvincesList) {
        $provRegex = "(?:จ\.|จังหวัด)$prov"
        if ($text -match $provRegex) {
            $hasUdon = ($text -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
            $hasUdonDist = $false
            foreach ($ud in $udonDistrictsAndZonesList) {
                if ($text -match $ud) { $hasUdonDist = $true; break }
            }
            if (-not $hasUdon -and -not $hasUdonDist) {
                return $true
            }
        }
    }
    return $false
}

function Test-IsHolidayAnnouncement($post) {
    $text = [string]$post.text
    if (-not $text) { return $false }
    if ($text -match "การพัฒนา ไม่มีวันหยุด" -or $text -match "ไม่มีวันหยุด") {
        if ($text -match "สำนักงานใหม่" -or $text -match "ก่อสร้าง") { return $false }
    }
    $holidayRegex = "(?:แจ้งวันหยุด|วันหยุดนักขัตฤกษ์|ประกาศวันหยุด|หยุดทำการ|ปิดทำการ|สุขสันต์วันแม่|วันแม่แห่งชาติ|Happy Mother's Day|สุขสันต์วันสงกรานต์|สวัสดีปีใหม่|วันหยุดยาว)"
    if ($text -match $holidayRegex) {
        if ($text -notmatch "เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ตอกเสาเข็ม") {
            return $true
        }
    }
    return $false
}

function Test-IsAdWithoutDistrictOrPerson($post) {
    $text = [string]$post.text
    if (-not $text) { return $false }
    
    $adPromoKeywordsList = @(
        "โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ",
        "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี",
        "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ",
        "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ",
        "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร.ม.ละ"
    )
    
    $isAd = $false
    foreach ($kw in $adPromoKeywordsList) {
        if ($text -match $kw) { $isAd = $true; break }
    }
    
    if ($isAd) {
        # Check if actual construction task is being updated
        if ($text -match "งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|สุขภัณฑ์|โครงเหล็ก|ส่งมอบ") {
            # If it has real construction task + Udon context -> KEEP!
            foreach ($dist in $udonDistrictsAndZonesList) {
                if ($text -match $dist) { return $false }
            }
        }
        
        foreach ($dist in $udonDistrictsAndZonesList) {
            if ($text -match $dist) { return $false }
        }
        
        if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") {
            return $false
        }
        if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?") {
            return $false
        }
        if ($text -match "(?:คุณ)\s*([ก-๙a-zA-Z]+)") {
            if ($Matches[0] -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") {
                return $false
            }
        }
        return $true
    }
    return $false
}

$validPosts = @()
foreach ($p in $posts) {
    if (-not (Test-IsExplicitOtherProvince $p) -and -not (Test-IsHolidayAnnouncement $p) -and -not (Test-IsAdWithoutDistrictOrPerson $p)) {
        $validPosts += $p
    }
}

Write-Host "Total raw: $($posts.Count)"
Write-Host "Total valid after fix: $($validPosts.Count)"

$lhValid = @()
foreach ($p in $validPosts) {
    $t = [string]$p.text
    $u = if ($p.user) { [string]$p.user.name } else { '' }
    $pname = [string]$p.pageName
    $inp = [string]$p.inputUrl
    $fb = [string]$p.facebookUrl
    
    if ($t -match 'Little Home' -or $u -match 'Little Home' -or $pname -match 'LH2553' -or $inp -match 'LH2553' -or $fb -match 'LH2553') {
        $lhValid += $p
    }
}
Write-Host "Little Home valid posts: $($lhValid.Count)"
foreach ($p in $lhValid) {
    Write-Host "----------------"
    Write-Host "URL: $($p.url)"
    $txt = [string]$p.text
    Write-Host "Text: $($txt.Substring(0, [Math]::Min(120, $txt.Length)).Replace(\"`n\", ' '))"
}
