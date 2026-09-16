[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'scripts/facebook_54_pages_posts.json'
if (-not (Test-Path $datasetPath)) {
    $latestDownload = Get-ChildItem -Path "$env:USERPROFILE\Downloads\dataset_facebook-posts-scraper_*.json" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestDownload) {
        $datasetPath = $latestDownload.FullName
    }
}

Write-Host "Loading dataset from: $datasetPath"
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$otherProvinces = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)

$udonDistricts = @(
    "เมืองอุดรธานี", "เมืองอุดร", "อ.เมือง", "อำเภอเมือง", "ต.บ้านจั่น", "ต.หนองบัว", "ต.หมากแข้ง", "ต.บ้านเลื่อม", "ต.หมูม่น", "ต.เชียงยืน", "เชียงยืน", "หนองใส", "หนองประจักษ์", "สามพร้าว", "นาดี", "บ้านตาด", "นิคมสงเคราะห์", "กุดสระ", "บ้านโคกก่อง", "ต.โคกกลาง", "หนองสวรรค์", "ตลาดไทศิริ",
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

$outsideDistricts = @(
    "เซกา", "บึงโขงหลง", "โซ่พิสัย", "ปากคาด", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สังคม", "รัตนวาปี", "สระใคร", "เฝ้าไร่",
    "พังโคน", "สว่างแดนดิน", "วานรนิวาส", "พรรณานิคม", "อากาศอำนวย",
    "นากลาง", "ศรีบุญเรือง", "โนนสัง", "นาวัง", "สุวรรณคูหา",
    "วังสะพุง", "เชียงคาน", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "ท่าลี่", "ปากชม",
    "บ้านไผ่", "ชุมแพ", "น้ำพอง", "กระนวน", "พระยืน", "หนองเรือ", "พล", "ม.ขอนแก่น", "มข."
)

function Test-IsOtherProvince($p) {
    if ($p.error -or $p.'#error') { return $true }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    $lines = $text -split "\r?\n"
    foreach ($line in $lines) {
        $trimLine = $line.Trim()
        if ($trimLine -match "📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|โลเคชั่น|location") {
            foreach ($prov in $otherProvinces) {
                if ($trimLine -match "(?:จ\.|จังหวัด)?\s*$prov" -and $trimLine -notmatch "อุดร") {
                    return $true
                }
            }
            foreach ($dist in $outsideDistricts) {
                if ($trimLine -match "(?:อ\.|อำเภอ)?\s*$dist" -and $trimLine -notmatch "อุดร") {
                    return $true
                }
            }
        }
    }

    $bodyText = $text
    $footerMarkers = @("ที่ตั้ง สำนักงาน", "ที่ตั้งสำนักงาน", "สำนักงานใหญ่", "สนใจติดต่อ", "โทร 0", "Tel:", "Line ID", "#รับสร้างบ้าน")
    foreach ($fm in $footerMarkers) {
        $idx = $bodyText.IndexOf($fm)
        if ($idx -gt 15) {
            $bodyText = $bodyText.Substring(0, $idx)
        }
    }

    foreach ($prov in $otherProvinces) {
        if ($bodyText -match "(?:จ\.|จังหวัด|หน้างาน|พิกัด)\s*[:\s]*$prov") {
            $hasUdon = ($bodyText -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
            $hasUdonDist = $false
            foreach ($ud in $udonDistricts) {
                if ($bodyText -match $ud) { $hasUdonDist = $true; break }
            }
            if (-not $hasUdon -and -not $hasUdonDist) {
                return $true
            }
        }
    }

    return $false
}

function Test-IsHolidayAnnouncement($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    if ($text -match "การพัฒนา\s*ไม่มีวันหยุด|ไม่มีวันหยุด") {
        if ($text -match "สำนักงานใหม่|ก่อสร้าง") {
            return $false
        }
    }

    if ($text -match "แจ้งวันหยุด|วันหยุดนักขัตฤกษ์|ประกาศวันหยุด|หยุดทำการ|ปิดทำการ|สุขสันต์วันแม่|วันแม่แห่งชาติ|Happy Mother's Day|สุขสันต์วันสงกรานต์|สวัสดีปีใหม่|วันหยุดยาว") {
        if ($text -notmatch "เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ตอกเสาเข็ม") {
            return $true
        }
    }
    return $false
}

$adPromoKeywords = @(
    "โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ",
    "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี",
    "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ",
    "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ",
    "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร\.ม\.ละ"
)

function Test-IsAdWithoutDistrictOrPerson($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    $isAd = $false
    foreach ($kw in $adPromoKeywords) {
        if ($text -match $kw) {
            $isAd = $true
            break
        }
    }

    if ($isAd) {
        $hasRealWork = ($text -match "งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|สุขภัณฑ์|โครงเหล็ก|ส่งมอบบ้าน|ส่งมอบงาน")
        if ($hasRealWork -and ($text -match "อุดร|อุดรธานี" -or $text -match "(?:อ\.|อำเภอ)\s*เมือง")) {
            return $false
        }

        foreach ($dist in $udonDistricts) {
            if ($text -match [regex]::Escape($dist)) {
                return $false
            }
        }

        if ($text -match "(?:อ\.|อำเภอ)\s*เมือง" -and $text -match "อุดร") {
            return $false
        }

        if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") {
            return $false
        }

        if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?") {
            return $false
        }

        if ($text -match "(?:คุณ)\s*([ก-๙a-zA-Z]+)") {
            if ($matches[0] -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") {
                return $false
            }
        }

        return $true
    }

    return $false
}

function Test-IsPure3DOrGraphicRender($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    $is3D = ($text -match "(?:ภาพ|รูป|แบบ|โมเดล|งานออกแบบ|แปลน)\s*3[dD]|3[dD]\s*(?:perspective|render|ภาพ|รูป|แบบ)|perspective|render|ภาพจำลอง|แบบแปลน|ขึ้นภาพ\s*3[dD]|#แบบบ้าน|แบบบ้านพักอาศัย\s*ค\.ส\.ล")
    if ($is3D) {
        $hasSiteTask = ($text -match "เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|ส่งมอบบ้าน|ส่งมอบงาน|งานติดตั้งสุขภัณฑ์|งานทาสีโครงเหล็ก|งานปูกระเบื้อง|งานฝ้า|งานเดินระบบ|งานติดบัว|งานติดอุปกรณ์ไฟฟ้า|On site:|SITE UPDATE")
        if (-not $hasSiteTask) {
            return $true
        }
    }
    return $false
}

$designKeywords = @(
    "ออกแบบ", "รับออกแบบ", "งานออกแบบ", "เขียนแบบ", "ดีไซน์", "บริการออกแบบ", "ออกแบบตกแต่ง", "Design by", "DESIGN BY", "design by", "ไอเดียผังบ้าน", "แบบบ้าน", "แปลนบ้าน"
)

function Test-HasDistrict($text) {
    foreach ($dist in $udonDistricts) {
        if ($text -match [regex]::Escape($dist)) { return $true }
    }
    if ($text -match "(?:อ\.|อำเภอ)\s*เมือง" -and $text -match "อุดร") { return $true }
    return $false
}

function Test-HasPersonName($text) {
    if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") {
        return $true
    }
    if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?") {
        return $true
    }
    if ($text -match "(?:คุณ)\s*([ก-๙a-zA-Z]+)") {
        if ($matches[0] -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") {
            return $true
        }
    }
    return $false
}

$remainingAfterStep4 = [System.Collections.Generic.List[object]]::new()
for ($i = 0; $i -lt $rawPosts.Count; $i++) {
    $p = $rawPosts[$i]
    if (-not (Test-IsOtherProvince $p) -and -not (Test-IsHolidayAnnouncement $p) -and -not (Test-IsAdWithoutDistrictOrPerson $p) -and -not (Test-IsPure3DOrGraphicRender $p)) {
        $remainingAfterStep4.Add($p)
    }
}

Write-Host "Remaining posts after Steps 1-4: $($remainingAfterStep4.Count)"

$designCandidates = [System.Collections.Generic.List[object]]::new()

foreach ($p in $remainingAfterStep4) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    $hasDesign = $false
    $matchedKw = ""
    foreach ($kw in $designKeywords) {
        if ($text -match [regex]::Escape($kw)) {
            $hasDesign = $true
            $matchedKw = $kw
            break
        }
    }

    if ($hasDesign) {
        $hasDist = Test-HasDistrict $text
        $hasPerson = Test-HasPersonName $text

        if (-not $hasDist -and -not $hasPerson) {
            $designCandidates.Add([pscustomobject]@{
                PageName = $p.pageName
                Keyword = $matchedKw
                TextSnippet = ($text -replace '\s+', ' ').Substring(0, [Math]::Min(140, ($text -replace '\s+', ' ').Length))
                Url = $p.url
                FullText = $text
            })
        }
    }
}

Write-Host "Found $($designCandidates.Count) design posts without Udon district and without Person Name:"
$idx = 1
foreach ($c in $designCandidates) {
    Write-Host "`n[$idx] Page: $($c.PageName) (Keyword: '$($c.Keyword)')"
    Write-Host "Snippet: $($c.TextSnippet)..."
    Write-Host "URL: $($c.Url)"
    $idx++
}
