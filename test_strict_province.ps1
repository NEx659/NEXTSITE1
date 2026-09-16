# Strict Province Filter Test
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$otherProvinces = @(
    'หนองคาย', 'หนองบัวลำภู', 'สกลนคร', 'ขอนแก่น', 'เลย', 'บึงกาฬ', 'กาฬสินธุ์',
    'ร้อยเอ็ด', 'นครพนม', 'มหาสารคาม', 'มุกดาหาร', 'ชัยภูมิ', 'นครราชสีมา', 'โคราช',
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

function Test-StrictOtherProvince($post) {
    if ($post.error -or $post.'#error') { return $true }
    $text = if ($post.text) { [string]$post.text } elseif ($post.message) { [string]$post.message } else { '' }
    if (-not $text) { return $false }

    # 1. Strip company contact / office footers BEFORE any checking!
    $bodyText = $text
    $footerMarkers = @(
        '📌', '📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|ที่อยู่สำนักงาน|พิกัดสำนักงาน|แผนที่สำนักงาน|สำนักงานตั้งอยู่)',
        'ที่ตั้ง\s*สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่',
        'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร\s*0', 'Tel:', 'Line ID', '#รับสร้างบ้าน'
    )
    foreach ($fm in $footerMarkers) {
        $m = [regex]::Match($bodyText, $fm, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success -and $m.Index -gt 10) {
            $bodyText = $bodyText.Substring(0, $m.Index)
        }
    }

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

$filteredOtherProv = 0
$otherProvListFound = @()

foreach ($p in $rawPosts) {
    if (Test-StrictOtherProvince $p) {
        $filteredOtherProv++
        $rawTxt = if ($p.text) { [string]$p.text } else { [string]$p.message }
        $cleanTxt = ($rawTxt -replace '\s+', ' ')
        $snip = if ($cleanTxt.Length -gt 140) { $cleanTxt.Substring(0, 140) } else { $cleanTxt }
        $otherProvListFound += [pscustomobject]@{
            Page = $p.pageName
            Snippet = $snip
            Url = $p.url
        }
    }
}

Write-Host ('Total strictly excluded other province posts: ' + $filteredOtherProv)
$otherProvListFound | Select-Object -First 10 | ForEach-Object {
    Write-Host ('- ' + $_.Page + ': ' + $_.Snippet + '...')
}