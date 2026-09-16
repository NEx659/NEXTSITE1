[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Include functions
$otherProvinces = @(
    'vientiane', 'laos', 'เวียงจันทน์', 'สปป.ลาว', 'ลาว', 'หลวงพระบาง', 'ปากเซ', 'cambodia', 'myanmar', 'vietnam',
    'หนองคาย', 'หนองบัวลำภู', 'สกลนคร', 'ขอนแก่น', 'เลย', 'บึงกาฬ', 'กาฬสินธุ์',
    'ร้อยเอ็ด', 'นครพนม', 'มหาสารคาม', 'สารคาม', 'มุกดาหาร', 'ชัยภูมิ', 'นครราชสีมา', 'โคราช',
    'อุบลราชธานี', 'อุบล', 'ยโสธร', 'อำนาจเจริญ', 'สุรินทร์', 'ศรีสะเกษ', 'บุรีรัมย์',
    'เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แพร่', 'น่าน', 'พะเยา', 'แม่ฮ่องสอน', 'พิษณุโลก', 'สุโขทัย', 'ตาก', 'อุตรดิตถ์', 'เพชรบูรณ์', 'พิจิตร', 'กำแพงเพชร', 'นครสวรรค์', 'อุทัยธานี',
    'กรุงเทพ', 'กทม', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'สมุทรสงคราม', 'นครปฐม', 'อยุธยา', 'พระนครศรีอยุธยา', 'สระบุรี', 'ลพบุรี', 'สิงห์บุรี', 'อ่างทอง', 'ชัยนาท',
    'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก', 'สระแก้ว',
    'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี',
    'ภูเก็ต', 'กระบี่', 'พังงา', 'สุราษฎร์ธานี', 'นครศรีธรรมราช', 'สงขลา', 'หาดใหญ่', 'ตรัง', 'พัทลุง', 'สตูล', 'ชุมพร', 'ระนอง', 'ยะลา', 'ปัตตานี', 'นราธิวาส'
)

$outsideDistricts = @(
    'วังสะพุง', 'เชียงคาน', 'ด่านซ้าย', 'ภูเรือ', 'ภูกระดึง', 'ท่าลี่', 'ปากชม', 'นาแห้ว', 'ภูหลวง', 'ผาขาว', 'เอราวัณ', 'หนองหิน',
    'เซกา', 'บึงโขงหลง', 'โซ่พิสัย', 'ปากคาด', 'พรเจริญ', 'ศรีวิไล', 'บุ่งคล้า',
    'ท่าบ่อ', 'โพนพิสัย', 'ศรีเชียงใหม่', 'สังคม', 'รัตนวาปี', 'สระใคร', 'เฝ้าไร่', 'โพธิ์ตาก',
    'พังโคน', 'สว่างแดนดิน', 'วานรนิวาส', 'พรรณานิคม', 'อากาศอำนวย', 'กุสุมาลย์', 'กุดบาก', 'คำตากล้า', 'เจริญศิลป์', 'เต่างอย', 'โคกศรีสุพรรณ', 'นิคมน้ำอูน', 'ภูพาน', 'โพนนาแก้ว',
    'นากลาง', 'ศรีบุญเรือง', 'โนนสัง', 'นาวัง', 'สุวรรณคูหา',
    'บ้านไผ่', 'ชุมแพ', 'น้ำพอง', 'กระนวน', 'พระยืน', 'หนองเรือ', 'พล', 'บ้านแฮด', 'โนนศิลา', 'เขาสวนกวาง', 'อุบลรัตน์', 'มัญจาคีรี', 'ชนบท', 'แวงน้อย', 'แวงใหญ่', 'โคกโพธิ์ไชย', 'เปือยน้อย', 'ภูเวียง', 'ภูผาม่าน', 'ซำสูง', 'ม.ขอนแก่น', 'มข.',
    'ยางตลาด', 'กมลาไสย', 'สมเด็จ', 'กุฉินารายณ์', 'สหัสขันธ์', 'ห้วยผึ้ง', 'หนองกุงศรี',
    'เกษตรวิสัย', 'เสลภูมิ', 'โพนทอง', 'สุวรรณภูมิ', 'อาจสามารถ', 'พนมไพร',
    'โกสุมพิสัย', 'วาปีปทุม', 'กันทรวิชัย', 'พยัคฆภูมิพิสัย',
    'ธาตุพนม', 'เรณูนคร', 'ศรีสงคราม', 'ท่าอุเทน', 'นาแก', 'บ้านแพง',
    'นิคมคำสร้อย', 'ดอนตาล', 'หว้านใหญ่', 'หนองสูง',
    'ภูเขียว', 'แก้งคร้อ', 'บ้านเขว้า', 'เกษตรสมบูรณ์', 'คอนสาร', 'คอนสวรรค์',
    'ปากช่อง', 'พิมาย', 'สีคิ้ว', 'ปักธงชัย', 'สูงเนิน', 'โชคชัย', 'ด่านขุนทด',
    'วารินชำราบ', 'เดชอุดม', 'พิบูลมังสาหาร'
)

$udonDistricts = @(
    'เมืองอุดรธานี', 'เมืองอุดร', 'อ.เมือง', 'อำเภอเมือง', 'ต.บ้านจั่น', 'ต.หนองบัว', 'ต.หมากแข้ง', 'ต.บ้านเลื่อม', 'ต.หมูม่น', 'ต.เชียงยืน', 'เชียงยืน', 'หนองใส', 'หนองประจักษ์', 'สามพร้าว', 'นาดี', 'บ้านตาด', 'นิคมสงเคราะห์', 'กุดสระ', 'บ้านโคกก่อง', 'ต.โคกกลาง', 'หนองสวรรค์', 'ตลาดไทศิริ',
    'กุมภวาปี', 'อ.กุมภวาปี', 'อำเภอกุมภวาปี', 'พันดอน', 'ห้วยเกิ้ง',
    'หนองหาน', 'อ.หนองหาน', 'อำเภอหนองหาน', 'บ้านเชียง',
    'บ้านดุง', 'อ.บ้านดุง', 'อำเภอบ้านดุง', 'คำชะโนด',
    'เพ็ญ', 'อ.เพ็ญ', 'อำเภอเพ็ญ',
    'กุดจับ', 'อ.กุดจับ', 'อำเภอกุดจับ',
    'โนนสะอาด', 'อ.โนนสะอาด', 'อำเภอโนนสะอาด',
    'ศรีธาตุ', 'อ.ศรีธาตุ', 'อำเภอศรีธาตุ',
    'วังสามหมอ', 'อ.วังสามหมอ', 'อำเภอวังสามหมอ',
    'ทุ่งฝน', 'อ.ทุ่งฝน', 'อำเภอทุ่งฝน',
    'สร้างคอม', 'อ.สร้างคอม', 'อำเภอสร้างคอม',
    'หนองแสง', 'อ.หนองแสง', 'อำเภอหนองแสง',
    'หนองวัวซอ', 'อ.หนองวัวซอ', 'อำเภอหนองวัวซอ',
    'บ้านผือ', 'อ.บ้านผือ', 'อำเภอบ้านผือ',
    'น้ำโสม', 'อ.น้ำโสม', 'อำเภอน้ำโสม',
    'นายูง', 'อ.นายูง', 'อำเภอนายูง',
    'พิบูลย์รักษ์', 'อ.พิบูลย์รักษ์', 'อำเภอพิบูลย์รักษ์',
    'กู่แก้ว', 'อ.กู่แก้ว', 'อำเภอกู่แก้ว',
    'ประจักษ์ศิลปาคม', 'อ.ประจักษ์ศิลปาคม', 'อ.ประจักษ์',
    'ไชยวาน', 'อ.ไชยวาน', 'อำเภอไชยวาน'
)

function Get-SiteBody($text) {
    if (-not $text) { return '' }
    $str = $text
    $footerMarkers = @(
        '📌', '📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|ที่อยู่สำนักงาน|พิกัดสำนักงาน|แผนที่สำนักงาน|สำนักงานตั้งอยู่)',
        'ที่ตั้ง\s*สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่', 'ที่อยู่สำนักงาน',
        '____________________', '“ ใส่ใจทุกรายละเอียด', '● ปรึกษาฟรี', '● ประเมิณหน้างานฟรี', '● ประเมินหน้างานฟรี', 'Contact for work',
        'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร\s*0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP'
    )
    foreach ($fm in $footerMarkers) {
        $m = [regex]::Match($str, $fm, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success -and $m.Index -gt 10) {
            $str = $str.Substring(0, $m.Index)
        }
    }
    return $str.Trim()
}

function Test-IsOtherProvince($p) {
    if ($p.error -or $p.'#error') { return $true }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $body = Get-SiteBody $text
    $lines = $body -split '\r?\n'

    foreach ($line in $lines) {
        $trim = $line.Trim()
        if (-not $trim) { continue }
        if ($trim -match '📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|ที่ตั้งโครงการ|โลเคชั่น|location|site\s*location|ส่งมอบบ้าน|บ้านพักอาศัย|โครงการบ้าน|สร้างบ้านที่|บ้านคุณ') {
            foreach ($prov in $otherProvinces) {
                $provRegex = if ($prov -in @('เลย', 'อุบล', 'กทม', 'ลาว')) { '(?:จ\.|จังหวัด|ประเทศ)?\s*' + $prov } else { $prov }
                if ($trim -match $provRegex -and $trim -notmatch 'อุดร') { return $true }
            }
            foreach ($dist in $outsideDistricts) {
                if ($trim -match ('(?:อ\.|อำเภอ|ต\.|ตำบล)?\s*' + [regex]::Escape($dist)) -and $trim -notmatch 'อุดร') { return $true }
            }
        }
        foreach ($prov in $otherProvinces) {
            $provRegex = '(?:จ\.|จังหวัด|location\s*[:\|]|site\s*location\s*[:\|])?\s*' + [regex]::Escape($prov)
            if ($trim -match $provRegex -and $trim -notmatch 'อุดร') { return $true }
        }
        foreach ($dist in $outsideDistricts) {
            $distRegex = '(?:อ\.|อำเภอ)\s*' + [regex]::Escape($dist)
            if ($trim -match $distRegex -and $trim -notmatch 'อุดร') { return $true }
        }
    }

    foreach ($prov in $otherProvinces) {
        $provRegex = '(?:จ\.|จังหวัด|หน้างาน|พิกัด|location|site\s*location)\s*[:\s\|]*' + [regex]::Escape($prov)
        if ($body -match $provRegex -and $body -notmatch 'อุดร') { return $true }
    }
    foreach ($dist in $outsideDistricts) {
        $distRegex = '(?:อ\.|อำเภอ|หน้างาน|พิกัด)\s*[:\s]*' + [regex]::Escape($dist)
        if ($body -match $distRegex -and $body -notmatch 'อุดร') { return $true }
    }
    return $false
}

function Test-IsHoliday($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    if ($text -match 'การพัฒนา\s*ไม่มีวันหยุด|ไม่มีวันหยุด') {
        if ($text -match 'สำนักงานใหม่|ก่อสร้าง') { return $false }
    }
    if ($text -match 'แจ้งวันหยุด|วันหยุดนักขัตฤกษ์|ประกาศวันหยุด|หยุดทำการ|ปิดทำการ|สุขสันต์วันแม่|วันแม่แห่งชาติ|Happy Mother''s Day|สุขสันต์วันสงกรานต์|สวัสดีปีใหม่|วันหยุดยาว') {
        if ($text -notmatch 'เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ตอกเสาเข็ม') { return $true }
    }
    return $false
}

$adKws = @('โปรโมชั่น', 'โปรโมชัน', 'ราคาพิเศษ', 'ลดกระหน่ำ', 'แจกฟรี', 'ของแถม', 'ฟรีของแถม', 'แถมฟรี', 'จองวันนี้', 'ผ่อนเริ่มต้น', 'กู้ได้เต็ม', 'ยื่นสินเชื่อ', 'แบบบ้านขายดี', 'แบบบ้านยอดนิยม', '10 แบบบ้าน', 'ราคาเริ่มต้น', 'เริ่มต้นเพียง', 'ตารางเมตรละ', 'ตร\.ม\.ละ')

function Test-IsAd($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $body = Get-SiteBody $text
    $isAd = $false
    foreach ($kw in $adKws) {
        if ($text -match $kw) { $isAd = $true; break }
    }
    if ($isAd) {
        $hasSiteTask = ($body -match 'งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|สุขภัณฑ์|โครงเหล็ก|ส่งมอบบ้าน|ส่งมอบงาน')
        if ($hasSiteTask -and ($body -match 'อุดร' -or $body -match '(?:อ\.|อำเภอ)\s*เมือง')) { return $false }
        foreach ($ud in $udonDistricts) {
            if ($body -match [regex]::Escape($ud)) { return $false }
        }
        if ($body -match '(?:บ้านคุณ|Owner|ลูกค้าคุณ|คุณหมอ|เสี่ย|อาจารย์)\s*[:\s]*([^\s\n,]+)') { return $false }
        return $true
    }
    return $false
}

function Test-Is3D($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $is3D = ($text -match '(?:ภาพ|รูป|แบบ|โมเดล|งานออกแบบ|แปลน)\s*3[dD]|3[dD]\s*(?:perspective|render|ภาพ|รูป|แบบ)|perspective|render|ภาพจำลอง|แบบแปลน|ขึ้นภาพ\s*3[dD]|#แบบบ้าน|แบบบ้านพักอาศัย\s*ค\.ส\.ล')
    if ($is3D) {
        $hasSiteTask = ($text -match 'เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|ส่งมอบบ้าน|ส่งมอบงาน|งานติดตั้งสุขภัณฑ์|งานทาสีโครงเหล็ก|งานปูกระเบื้อง|งานฝ้า|งานเดินระบบ|งานติดบัว|งานติดอุปกรณ์ไฟฟ้า|On site:|SITE UPDATE')
        if (-not $hasSiteTask) { return $true }
    }
    return $false
}

$designKws = @('ออกแบบ', 'รับออกแบบ', 'งานออกแบบ', 'เขียนแบบ', 'ดีไซน์', 'บริการออกแบบ', 'ออกแบบตกแต่ง', 'Design by', 'DESIGN BY', 'design by', 'ไอเดียผังบ้าน', 'แบบบ้าน', 'แปลนบ้าน')

function Test-IsDesign($p) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { return $false }
    $body = Get-SiteBody $text
    $isDesign = $false
    foreach ($kw in $designKws) {
        if ($body -match [regex]::Escape($kw)) { $isDesign = $true; break }
    }
    if ($isDesign) {
        foreach ($ud in $udonDistricts) {
            if ($body -match [regex]::Escape($ud)) { return $false }
        }
        if ($body -match '(?:อ\.|อำเภอ)\s*เมือง' -and $body -match 'อุดร') { return $false }
        if ($body -match '(?:บ้านคุณ|บ้านพักคุณ|Owner|owner)\s*[:\s]*([^\s\n,]+)') { return $false }
        if ($body -match '(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?') { return $false }
        if ($body -match '(?:คุณ)\s*([ก-๙a-zA-Z]+)' -and $matches[0] -notmatch 'คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า') { return $false }
        return $true
    }
    return $false
}

$valid = @()
foreach ($p in $rawPosts) {
    if (-not (Test-IsOtherProvince $p) -and -not (Test-IsHoliday $p) -and -not (Test-IsAd $p) -and -not (Test-Is3D $p) -and -not (Test-IsDesign $p)) {
        $valid += $p
    }
}

Write-Host ('Total Valid Posts in Pipeline: ' + $valid.Count)

# Group by page and analyze duplicates
$grouped = $valid | Group-Object -Property pageName

$allDups = @()
foreach ($g in $grouped) {
    $posts = $g.Group
    # Find customers/site keys
    $siteGroups = @{}
    foreach ($p in $posts) {
        $b = Get-SiteBody $p.text
        $key = ''
        
        # 1. Customer
        if ($b -match '(?:บ้านคุณ|บ้านพักคุณ|ลูกค้าคุณ|คุณ)\s*([ก-๙a-zA-Z]+)') {
            $c = $matches[1]
            if ($c -notmatch 'ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ') {
                $key = 'cust_' + $c
            }
        }
        # 2. Specific landmark
        if (-not $key) {
            if ($b -match 'พีที|ปั๊ม\s*pt|บ้านปูลู') { $key = 'pt_pulu' }
            elseif ($b -match 'ปตท|อเมซอน') { $key = 'ptt_amazon' }
            elseif ($b -match '7-11|เซเว่น') { $key = '7eleven' }
            elseif ($b -match 'Good Vibes') { $key = 'good_vibes' }
            elseif ($b -match 'ศุภาลัย') { $key = 'supalai' }
            elseif ($b -match 'รชยา') { $key = 'rachaya' }
            elseif ($b -match 'อภิทาวน์') { $key = 'apitown' }
            elseif ($b -match 'สุขคณา') { $key = 'sukkhana' }
        }
        
        if ($key) {
            if (-not $siteGroups.ContainsKey($key)) {
                $siteGroups[$key] = @()
            }
            $siteGroups[$key] += $p
        }
    }
    
    foreach ($k in $siteGroups.Keys) {
        if ($siteGroups[$k].Count -gt 1) {
            $allDups += [pscustomobject]@{
                Page = $g.Name
                SiteKey = $k
                Count = $siteGroups[$k].Count
                Posts = $siteGroups[$k]
            }
        }
    }
}

Write-Host ('========================================')
Write-Host ('FOUND ' + $allDups.Count + ' DUPLICATE GROUPS ACROSS PAGES')
Write-Host ('========================================')

foreach ($d in $allDups) {
    Write-Host ''
    Write-Host ('▶ เพจ: ' + $d.Page + ' | โครงการ: ' + $d.SiteKey + ' (พบ ' + $d.Count + ' โพสต์ซ้ำ)')
    $sortedPosts = $d.Posts | Sort-Object -Property time -Descending
    $idx = 1
    foreach ($p in $sortedPosts) {
        $status = if ($idx -eq 1) { '[เลือกโพสต์ล่าสุดนี้]' } else { '[คัดออก เพราะเป็นงานซ้ำ]' }
        $snip = ($p.text -replace '\s+', ' ')
        if ($snip.Length -gt 100) { $snip = $snip.Substring(0, 100) + '...' }
        Write-Host ('   ' + $idx + '. ' + $status + ' วันที่: ' + $p.time + ' | ' + $snip)
        $idx++
    }
}
