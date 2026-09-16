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
Write-Host "Total raw items in JSON: $($rawPosts.Count)"

# Step 1 Filter: Exclude posts that explicitly mention other provinces
$otherProvinces = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "สารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แพร่", "น่าน", "พะเยา", "แม่ฮ่องสอน", "พิษณุโลก", "สุโขทัย", "ตาก", "อุตรดิตถ์", "เพชรบูรณ์", "พิจิตร", "กำแพงเพชร", "นครสวรรค์", "อุทัยธานี",
    "กรุงเทพ", "กทม", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "สมุทรสาคร", "สมุทรสงคราม", "นครปฐม", "อยุธยา", "พระนครศรีอยุธยา", "สระบุรี", "ลพบุรี", "สิงห์บุรี", "อ่างทอง", "ชัยนาท",
    "ชลบุรี", "ระยอง", "จันทบุรี", "ตราด", "ฉะเชิงเทรา", "ปราจีนบุรี", "นครนายก", "สระแก้ว",
    "เพชรบุรี", "ประจวบคีรีขันธ์", "ราชบุรี", "กาญจนบุรี", "สุพรรณบุรี",
    "ภูเก็ต", "กระบี่", "พังงา", "สุราษฎร์ธานี", "นครศรีธรรมราช", "สงขลา", "หาดใหญ่", "ตรัง", "พัทลุง", "สตูล", "ชุมพร", "ระนอง", "ยะลา", "ปัตตานี", "นราธิวาส"
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
    "วังสะพุง", "เชียงคาน", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "ท่าลี่", "ปากชม", "นาแห้ว", "ภูหลวง", "ผาขาว", "เอราวัณ", "หนองหิน",
    "เซกา", "บึงโขงหลง", "โซ่พิสัย", "ปากคาด", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สังคม", "รัตนวาปี", "สระใคร", "เฝ้าไร่", "โพธิ์ตาก",
    "พังโคน", "สว่างแดนดิน", "วานรนิวาส", "พรรณานิคม", "อากาศอำนวย", "กุสุมาลย์", "กุดบาก", "คำตากล้า", "เจริญศิลป์", "เต่างอย", "โคกศรีสุพรรณ", "นิคมน้ำอูน", "ภูพาน", "โพนนาแก้ว",
    "นากลาง", "ศรีบุญเรือง", "โนนสัง", "นาวัง", "สุวรรณคูหา",
    "บ้านไผ่", "ชุมแพ", "น้ำพอง", "กระนวน", "พระยืน", "หนองเรือ", "พล", "บ้านแฮด", "โนนศิลา", "เขาสวนกวาง", "อุบลรัตน์", "มัญจาคีรี", "ชนบท", "แวงน้อย", "แวงใหญ่", "โคกโพธิ์ไชย", "เปือยน้อย", "ภูเวียง", "ภูผาม่าน", "ซำสูง", "ม.ขอนแก่น", "มข.",
    "ยางตลาด", "กมลาไสย", "สมเด็จ", "กุฉินารายณ์", "สหัสขันธ์", "ห้วยผึ้ง", "หนองกุงศรี",
    "เกษตรวิสัย", "เสลภูมิ", "โพนทอง", "สุวรรณภูมิ", "อาจสามารถ", "พนมไพร",
    "โกสุมพิสัย", "วาปีปทุม", "กันทรวิชัย", "พยัคฆภูมิพิสัย",
    "ธาตุพนม", "เรณูนคร", "ศรีสงคราม", "ท่าอุเทน", "นาแก", "บ้านแพง",
    "นิคมคำสร้อย", "ดอนตาล", "หว้านใหญ่", "หนองสูง",
    "ภูเขียว", "แก้งคร้อ", "บ้านเขว้า", "เกษตรสมบูรณ์", "คอนสาร", "คอนสวรรค์",
    "ปากช่อง", "พิมาย", "สีคิ้ว", "ปักธงชัย", "สูงเนิน", "โชคชัย", "ด่านขุนทด",
    "วารินชำราบ", "เดชอุดม", "พิบูลมังสาหาร"
)

function Get-SiteBody($text) {
    if (-not $text) { return '' }
    $bodyText = $text
    $footerMarkers = @(
        '📌', '📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|ที่อยู่สำนักงาน|พิกัดสำนักงาน|แผนที่สำนักงาน|สำนักงานตั้งอยู่)',
        'ที่ตั้ง\s*สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่',
        '____________________', '“ ใส่ใจทุกรายละเอียด', '● ปรึกษาฟรี', '● ประเมิณหน้างานฟรี', '● ประเมินหน้างานฟรี', 'Contact for work',
        'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร\s*0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP'
    )
    foreach ($fm in $footerMarkers) {
        $m = [regex]::Match($bodyText, $fm, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success -and $m.Index -gt 10) {
            $bodyText = $bodyText.Substring(0, $m.Index)
        }
    }
    return $bodyText.Trim()
}

function Test-IsOtherProvince($p) {
    if ($p.error -or $p.'#error') { return $true }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    # 1. Strip company contact / office footers BEFORE any checking!
    $bodyText = Get-SiteBody $text

    # 2. Check line by line in the post body (site info)
    $lines = $bodyText -split '\r?\n'
    foreach ($line in $lines) {
        $trim = $line.Trim()
        if (-not $trim) { continue }

        # Check explicit location prefixes
        if ($trim -match '📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|ที่ตั้งโครงการ|โลเคชั่น|location|ส่งมอบบ้าน|บ้านพักอาศัย|โครงการบ้าน|สร้างบ้านที่|บ้านคุณ') {
            foreach ($prov in $otherProvinces) {
                $provRegex = if ($prov -in @('เลย', 'อุบล', 'กทม')) { '(?:จ\.|จังหวัด)\s*' + $prov } else { '(?:จ\.|จังหวัด)?\s*' + $prov }
                if ($trim -match $provRegex -and $trim -notmatch 'อุดร') {
                    return $true
                }
            }
            foreach ($dist in $outsideDistricts) {
                if ($trim -match ('(?:อ\.|อำเภอ|ต\.|ตำบล)?\s*' + [regex]::Escape($dist)) -and $trim -notmatch 'อุดร') {
                    return $true
                }
            }
        }

        # Check any direct mention of other provinces in body lines
        foreach ($prov in $otherProvinces) {
            $provRegex = '(?:จ\.|จังหวัด)\s*' + [regex]::Escape($prov)
            if ($trim -match $provRegex -and $trim -notmatch 'อุดร') {
                return $true
            }
        }
        foreach ($dist in $outsideDistricts) {
            $distRegex = '(?:อ\.|อำเภอ)\s*' + [regex]::Escape($dist)
            if ($trim -match $distRegex -and $trim -notmatch 'อุดร') {
                return $true
            }
        }
    }

    # 3. Overall body text check (excluding footer)
    foreach ($prov in $otherProvinces) {
        $provRegex = '(?:จ\.|จังหวัด|หน้างาน|พิกัด)\s*[:\s]*' + [regex]::Escape($prov)
        if ($bodyText -match $provRegex -and $bodyText -notmatch 'อุดร') {
            return $true
        }
    }
    foreach ($dist in $outsideDistricts) {
        $distRegex = '(?:อ\.|อำเภอ|หน้างาน|พิกัด)\s*[:\s]*' + [regex]::Escape($dist)
        if ($bodyText -match $distRegex -and $bodyText -notmatch 'อุดร') {
            return $true
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

# Step 3 Filter: Ads/Promo Keywords
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
        $body = Get-SiteBody $text
        # Strip promo giveaway lines and slogans
        $bodyNoGifts = $body -replace '(?m)^\s*(?:🎁|🎉|🎊|ฟรี!|แถมฟรี|ของแถม|ฟรี\s*[:!]).*$', ''
        $bodyNoGifts = $bodyNoGifts -replace '(?:จนถึงวันส่งมอบ|ตั้งแต่เริ่มจน|ตั้งแต่วันแรกจน|ตั้งแต่ฐานรากจนถึง|เรื่องการสร้างบ้าน|ไว้ใจ\s*\|)', ''

        # Check real work + Udon
        $hasRealWork = ($bodyNoGifts -match "งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|โครงเหล็ก|ส่งมอบบ้าน|ส่งมอบงาน")
        if ($hasRealWork -and ($body -match "อุดร|อุดรธานี" -or $body -match "(?:อ\.|อำเภอ)\s*เมือง")) {
            return $false # Keep
        }

        # Check Udon Districts
        foreach ($dist in $udonDistricts) {
            if ($body -match [regex]::Escape($dist)) {
                return $false # Keep
            }
        }

        if ($body -match "(?:อ\.|อำเภอ)\s*เมือง" -and $body -match "อุดร") {
            return $false # Keep
        }

        # Check Person / Customer Names
        if ($body -match "(?:บ้านคุณ|บ้านพักคุณ|Owner)\s*[:\s]*([ก-๙a-zA-Z]+)") {
            $c = $matches[1]
            if ($c -notmatch '^(?:ของคุณ|ของบ้านคุณ|ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา|ตรงตามความต้องการ|ตั้งแต่วันแรก)$') {
                return $false # Keep
            }
        }

        if ($body -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)") {
            $pName = $matches[1]
            if ($pName -notmatch '^(?:คุณภาพ|มาตรฐาน|มืออาชีพ|ประสบการณ์)$') {
                return $false # Keep
            }
        }

        return $true # Exclude
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
    "ออกแบบ", "รับออกแบบ", "งานออกแบบ", "เขียนแบบ", "ดีไซน์", "บริการออกแบบ", "ออกแบบตกแต่ง",
    "Design by", "DESIGN BY", "design by", "ไอเดียผังบ้าน", "แบบบ้าน", "แปลนบ้าน"
)

function Test-IsDesignWithoutDistrictOrPerson($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }

    $isDesign = $false
    foreach ($kw in $designKeywords) {
        if ($text -match [regex]::Escape($kw)) {
            $isDesign = $true
            break
        }
    }

    if ($isDesign) {
        foreach ($dist in $udonDistricts) {
            if ($text -match [regex]::Escape($dist)) {
                return $false # Keep
            }
        }

        if ($text -match "(?:อ\.|อำเภอ)\s*เมือง" -and $text -match "อุดร") {
            return $false # Keep
        }

        if ($text -match "(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)") {
            return $false # Keep
        }

        if ($text -match "(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?") {
            return $false # Keep
        }

        if ($text -match "(?:คุณ)\s*([ก-๙a-zA-Z]+)") {
            if ($matches[0] -notmatch "คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า") {
                return $false # Keep
            }
        }

        return $true # Exclude
    }

    return $false
}

# Step 6 Filter: Exclude recruitment, hiring, job vacancies
$recruitmentKeywords = @(
    "รับสมัคร", "รับสมัครงาน", "รับสมัครพนักงาน", "เปิดรับสมัคร", "เปิดรับสมัครงาน",
    "ตำแหน่งงานว่าง", "ตำแหน่งที่เปิดรับ", "ประกาศรับสมัคร", "สมัครงาน", "รับสมัครด่วน",
    "รับช่าง", "หาช่าง", "รับโฟร์แมน", "หาโฟร์แมน", "รับวิศวกร", "รับสถาปนิก",
    "we are hiring", "we're hiring", "hiring", "job vacancy", "join our team",
    "walk-in interview", "ส่ง resume", "ส่ง portfolio", "อัตราจ้าง", "วุฒิการศึกษา",
    "คุณสมบัติผู้สมัคร", "นักศึกษาฝึกงาน", "รับนักศึกษาฝึกงาน", "เปิดรับฝึกงาน"
)

function Test-IsRecruitmentPost($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    
    $clean = $text -replace 'สัมภาษณ์\s*(?:เจ้าของบ้าน|ลูกค้า|คุณ)', ''
    $clean = $clean -replace '(?:ร่วมงาน|ได้ร่วมงาน)\s*(?:ก่อสร้าง|กับ|สร้างบ้าน)', ''
    $clean = $clean -replace 'ร่วมงานเลี้ยง', ''
    
    foreach ($kw in $recruitmentKeywords) {
        if ($clean.ToLower().Contains($kw.ToLower())) {
            return $true
        }
    }
    return $false
}

# Step 7 Filter: Exclude corporate PR, new logo, anniversaries, ranking, cover/profile changes, empty posts
function Test-IsCompanyPROrEmpty($p) {
    $text = if ($p.text) { [string]$p.text.Trim() } elseif ($p.message) { [string]$p.message.Trim() } else { '' }
    
    # 1. Blank or very short
    if (-not $text -or $text.Length -lt 15) {
        if ($text -notmatch 'เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ส่งมอบ|ก่ออิฐ') {
            return $true
        }
    }
    
    # 2. Profile/Cover update
    if ($text -match 'ได้อัพเดตรูปโปรไฟล์|ได้อัพเดตรูปภาพหน้าปก|updated (?:their )?(?:profile|cover) photo') {
        return $true
    }
    
    # 3. Corporate PR, Anniversaries, New Logo, Government registration
    $isPR = ($text -match 'NEW LOGO|โลโก้ใหม่|เปลี่ยนโลโก้|Rebrand Logo|20th Anniversary|Anniversary|ครบรอบ\s*\d+\s*ปี|\d+\s*YEARS OF|ขึ้นทะเบียนและจัดชั้น|จัดชั้นผู้ประกอบการ|กรมบัญชีกลาง|ถ่าย\s*present')
    if ($isPR) {
        $hasSite = ($text -match 'เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|ส่งมอบบ้าน|ส่งมอบงาน')
        if (-not $hasSite) {
            return $true
        }
    }
    return $false
}

$posts = [System.Collections.Generic.List[object]]::new()
$excludedOtherProv = 0
$excludedHoliday = 0
$excludedAds = 0
$excluded3D = 0
$excludedDesign = 0
$excludedRecruit = 0
$excludedCompanyPR = 0

for ($i = 0; $i -lt $rawPosts.Count; $i++) {
    $p = $rawPosts[$i]
    if (Test-IsOtherProvince $p) {
        $excludedOtherProv++
    } elseif (Test-IsHolidayAnnouncement $p) {
        $excludedHoliday++
    } elseif (Test-IsAdWithoutDistrictOrPerson $p) {
        $excludedAds++
    } elseif (Test-IsPure3DOrGraphicRender $p) {
        $excluded3D++
    } elseif (Test-IsDesignWithoutDistrictOrPerson $p) {
        $excludedDesign++
    } elseif (Test-IsRecruitmentPost $p) {
        $excludedRecruit++
    } elseif (Test-IsCompanyPROrEmpty $p) {
        $excludedCompanyPR++
    } else {
        $posts.Add($p)
    }
}

Write-Host "Filtered out explicit other provinces (Step 1): $excludedOtherProv posts"
Write-Host "Filtered out holiday announcements (Step 2): $excludedHoliday posts"
Write-Host "Filtered out pure ads/promotions (Step 3): $excludedAds posts"
Write-Host "Filtered out 3D renders / graphics (Step 4): $excluded3D posts"
Write-Host "Filtered out design without district/person (Step 5): $excludedDesign posts"
Write-Host "Filtered out recruitment / job posts (Step 6): $excludedRecruit posts"
Write-Host "Filtered out corporate PR / profile / empty (Step 7): $excludedCompanyPR posts"
Write-Host "Remaining valid posts: $($posts.Count) posts"

# Read companies template from js/data.js
$dataJs = Get-Content -LiteralPath 'js/data.js' -Raw -Encoding UTF8
$startTag = 'var UDON_COMPANIES = '
$sIdx = $dataJs.IndexOf($startTag)
$endTag = "];`r`n`r`nif (typeof window"
if (-not $dataJs.Contains($endTag)) {
    $endTag = "];`n`nif (typeof window"
}
$eIdx = $dataJs.IndexOf($endTag)
$jsonPart = $dataJs.Substring($sIdx + $startTag.Length, $eIdx - ($sIdx + $startTag.Length) + 1).Trim()
$companies = $jsonPart | ConvertFrom-Json

function Get-ProperSlug($url) {
    if (-not $url) { return '' }
    $u = [string]$url.ToLower().Trim()
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\/', '')
    
    if ($u -match 'profile\.php\?id=([0-9]+)') {
        return "profile.php?id=" + $matches[1]
    }
    
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/posts\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/videos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/photos\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/reels?\/.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\?.*$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, '\/$', '')
    $u = [System.Text.RegularExpressions.Regex]::Replace($u, 'people\/[^\/]+\/', '')
    return $u
}

$compMap = @{}
foreach ($c in $companies) {
    $compMap[$c.id] = [System.Collections.Generic.List[object]]::new()
}

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $pUrlRaw = ($p.facebookUrl, $p.inputUrl, $p.url, $p.topLevelUrl | Where-Object { $_ } | Select-Object -First 1)
    $pSlug = Get-ProperSlug $pUrlRaw
    $pName = if ($p.pageName) { $p.pageName.ToLower().Trim() } else { '' }
    $uName = if ($p.user -and $p.user.name) { $p.user.name.ToLower().Trim() } else { '' }
    
    $found = $null
    
    foreach ($c in $companies) {
        $cSlug = Get-ProperSlug $c.facebookUrl
        if ($cSlug -and $pSlug -and ($cSlug -eq $pSlug)) {
            $found = $c; break
        }
    }
    
    if (-not $found -and $p.inputUrl) {
        $inSlug = Get-ProperSlug $p.inputUrl
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $inSlug -and ($cSlug -eq $inSlug)) {
                $found = $c; break
            }
        }
    }
    
    if (-not $found) {
        foreach ($c in $companies) {
            $cSlug = Get-ProperSlug $c.facebookUrl
            if ($cSlug -and $pSlug -and ($pSlug.Contains($cSlug) -or $cSlug.Contains($pSlug))) {
                $found = $c; break
            }
        }
    }
    
    if (-not $found) {
        foreach ($c in $companies) {
            $cName = if ($c.name) { $c.name.ToLower() } else { '' }
            $cEng = if ($c.engName) { $c.engName.ToLower() } else { '' }
            if ($pName -and ($cName.Contains($pName) -or $pName.Contains($cName))) {
                $found = $c; break
            } elseif ($uName -and ($cName.Contains($uName) -or $uName.Contains($cName))) {
                $found = $c; break
            } elseif ($cEng -and $pName -and ($cEng.Contains($pName) -or $pName.Contains($cEng))) {
                $found = $c; break
            }
        }
    }
    
    if ($found) {
        $compMap[$found.id].Add($p)
    }
}

function Get-SiteKey($text, $dist) {
    if (-not $text) { return "site_" + $dist }
    $b = Get-SiteBody $text
    
    # 1. Project / K.xxx
    if ($b -match 'Project\s*\|\s*(?:K\.|คุณ)?\s*([a-zA-Z0-9_\-]+)') {
        return "cust_" + $matches[1].ToLower()
    }
    
    # 2. Thai Customer
    if ($b -match '(?:บ้านคุณ|บ้านพักคุณ|ลูกค้าคุณ|คุณ)\s*([ก-๙a-zA-Z]+)') {
        $c = $matches[1] -replace 'เเ', 'แ'
        if ($c -notmatch '^(?:ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา)$') {
            return "cust_" + $c
        }
    }
    
    # 3. Landmark / Project ID
    if ($b -match 'โชว์รูมอุดรเซ็นเตอร์ฟิล์ม|เซ็นเตอร์ฟิล์ม') { return "landmark_center_film" }
    if ($b -match 'พีที|ปั๊ม\s*pt|บ้านปูลู') { return "landmark_pt_pulu" }
    if ($b -match 'Good Vibes|กู๊ดไวบ์') { return "landmark_good_vibes" }
    if ($b -match 'สุขคณา') { return "landmark_sukkhana" }
    if ($b -match 'MDUD\s*251') { return "proj_mdud_251" }
    if ($b -match 'ศุภาลัย') { return "landmark_supalai" }
    if ($b -match 'รชยา') { return "landmark_rachaya" }
    if ($b -match 'อภิทาวน์') { return "landmark_apitown" }
    if ($b -match 'วิลลาจจิโอ') { return "landmark_villaggio" }
    
    # 4. Fallback signature
    $firstLine = ($b -split '\r?\n')[0].Trim()
    if ($firstLine.Length -gt 25) { $firstLine = $firstLine.Substring(0, 25) }
    return "line_" + ($firstLine -replace '[^a-zA-Z0-9ก-๙]', '_')
}

$totalProjectsCount = 0

foreach ($c in $companies) {
    $compPosts = $compMap[$c.id] | Sort-Object -Property time -Descending
    $projectsList = [System.Collections.Generic.List[object]]::new()
    $seenSiteKeys = [System.Collections.Generic.HashSet[string]]::new()
    
    $stageBreakdown = @{
        groundbreak = 0
        foundation = 0
        structure = 0
        finishing = 0
    }
    
    for ($idx = 0; $idx -lt $compPosts.Count; $idx++) {
        $p = $compPosts[$idx]
        $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
        $textLower = $text.ToLower()
        
        $siteKey = Get-SiteKey $text ($c.district)
        if ($seenSiteKeys.Contains($siteKey)) {
            continue # Skip older duplicate post for the same project
        }
        $seenSiteKeys.Add($siteKey) | Out-Null
        
        $stageKey = 'structure'
        $stageText = 'งานโครงสร้างและก่อฉาบอาคาร'
        $prog = 50
        
        if ($textLower.Contains('ยกเสาเอก') -or $textLower.Contains('เสาเข็ม') -or $textLower.Contains('ตอกเสา') -or $textLower.Contains('วางผัง')) {
            $stageKey = 'groundbreak'
            $stageText = 'พิธียกเสาเอกและวางผังเริ่มงานก่อสร้าง'
            $prog = 15
        } elseif ($textLower.Contains('ฐานราก') -or $textLower.Contains('คานคอดิน') -or $textLower.Contains('ตอม่อ') -or $textLower.Contains('เทลีน') -or $textLower.Contains('ผูกเหล็ก')) {
            $stageKey = 'foundation'
            $stageText = 'งานฐานราก ตอม่อ และคานคอดิน'
            $prog = 35
        } elseif ($textLower.Contains('ส่งมอบ') -or $textLower.Contains('ทาสี') -or $textLower.Contains('ปูกระเบื้อง') -or $textLower.Contains('ตรวจงาน') -or $textLower.Contains('สุขภัณฑ์') -or $textLower.Contains('ฝ้าเพดาน')) {
            $stageKey = 'finishing'
            $stageText = 'งานสถาปัตย์ ตกแต่ง และเตรียมส่งมอบ'
            $prog = 85
        }
        
        $stageBreakdown[$stageKey]++
        
        # Build Title
        $rawLines = [string[]]($text -split "`r?`n")
        $firstLine = ""
        foreach ($ln in $rawLines) {
            $trimmed = $ln.Trim()
            if ($trimmed.Length -gt 0) {
                $firstLine = $trimmed
                break
            }
        }
        if (-not $firstLine) {
            $firstLine = "โครงการ $($c.name) #$($idx + 1)"
        }
        $firstLine = $firstLine -replace '^[\s\p{P}\p{S}]+', ''
        if ([string]::IsNullOrWhiteSpace($firstLine)) {
            $firstLine = "โครงการ $($c.name) #$($idx + 1)"
        }
        $projTitle = if ($firstLine.Length -gt 60) { $firstLine.Substring(0, 60) + '...' } else { $firstLine }
        
        # Date
        $dateStr = 'ล่าสุด'
        if ($p.time) {
            try {
                $dt = [DateTime]::Parse($p.time)
                $dateStr = $dt.ToString('dd/MM/yyyy')
            } catch {
                $dateStr = 'ล่าสุด'
            }
        }
        
        # Post URL
        $pUrl = if ($p.url) { $p.url } elseif ($p.postUrl) { $p.postUrl } elseif ($p.facebookUrl) { $p.facebookUrl } else { $c.facebookUrl }
        
        $projObj = [pscustomobject]@{
            projectId = "$($c.id)-$($idx + 1)"
            name = $projTitle
            location = "อ.$($c.district) จ.$($c.province)"
            province = $c.province
            district = $c.district
            gps = $c.coordinates
            stage = $stageText
            stageKey = $stageKey
            trackingStatus = 'pending'
            progressPercent = $prog
            estValue = '5.5 ล้านบาท'
            buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
            caption = if ($text) { $text } else { "โครงการก่อสร้างและอัปเดตหน้าเพจ $($c.name)" }
            postedTime = $dateStr
            postUrl = $pUrl
            boq = @(
                [pscustomobject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                [pscustomobject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
            )
        }
        $projectsList.Add($projObj)
    }
    
    $c.projects = $projectsList
    $c.totalProjects = $projectsList.Count
    $c.newProjectsThisMonth = $projectsList.Count
    $c.totalValueMillion = [Math]::Round(($projectsList.Count * 5.5), 1)
    $c.revenuePotentialText = "฿$([Math]::Round(($projectsList.Count * 0.5), 1))M"
    
    $c.stageBreakdown = [pscustomobject]@{
        groundbreak = $stageBreakdown['groundbreak']
        foundation = $stageBreakdown['foundation']
        structure = $stageBreakdown['structure']
        finishing = $stageBreakdown['finishing']
    }
    
    if ($compPosts.Count -gt 0) {
        $latest = $compPosts[0]
        $lTime = if ($latest.time) { 
            try { [DateTime]::Parse($latest.time).ToString('dd/MM/yyyy') } catch { 'ล่าสุด' }
        } else { 'ล่าสุด' }
        $lCap = if ($latest.text) { $latest.text } elseif ($latest.message) { $latest.message } else { "อัปเดตหน้างานสร้างบ้าน $($c.name)" }
        $c.facebookSignal = [pscustomobject]@{
            postDate = $lTime
            pageName = $c.name
            caption = $lCap
            likes = if ($latest.likesCount) { [int]$latest.likesCount } else { 0 }
            comments = if ($latest.commentsCount) { [int]$latest.commentsCount } else { 0 }
            shares = if ($latest.sharesCount) { [int]$latest.sharesCount } else { 0 }
            detectedKeywords = @($c.province, 'รับสร้างบ้าน')
        }
        $c.aiRecommendation = "$($c.totalProjects) โครงการในพื้นที่ (ผ่านการคัดกรองแล้ว)"
    } else {
        $c.facebookSignal = [pscustomobject]@{
            postDate = '-'
            pageName = $c.name
            caption = 'ไม่มีโพสต์ในพื้นที่อุดรธานี'
            likes = 0
            comments = 0
            shares = 0
            detectedKeywords = @()
        }
        $c.aiRecommendation = "0 โครงการในพื้นที่อุดร"
    }
    
    $totalProjectsCount += $projectsList.Count
}

Write-Host "========================================="
Write-Host "TOTAL PROJECTS INJECTED INTO DATA: $totalProjectsCount"
Write-Host "========================================="
