# Audit other provinces
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-15_18-10-04-887.json'
$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# All other 76 provinces in Thailand + outside districts in Isan / surrounding Udon
$outsideProvinces = @(
    'เลย', 'วังสะพุง', 'เชียงคาน', 'ด่านซ้าย', 'ภูเรือ', 'ภูกระดึง', 'ท่าลี่', 'ปากชม', 'นาแห้ว', 'ภูหลวง', 'ผาขาว', 'เอราวัณ', 'หนองหิน',
    'ขอนแก่น', 'มข.', 'ม.ขอนแก่น', 'บ้านไผ่', 'ชุมแพ', 'น้ำพอง', 'กระนวน', 'พระยืน', 'หนองเรือ', 'พล', 'บ้านแฮด', 'โนนศิลา', 'เขาสวนกวาง', 'อุบลรัตน์', 'มัญจาคีรี', 'ชนบท', 'แวงน้อย', 'แวงใหญ่', 'โคกโพธิ์ไชย', 'เปือยน้อย', 'ภูเวียง', 'ภูผาม่าน', 'ซำสูง',
    'หนองคาย', 'ท่าบ่อ', 'โพนพิสัย', 'ศรีเชียงใหม่', 'สังคม', 'รัตนวาปี', 'สระใคร', 'เฝ้าไร่', 'โพธิ์ตาก',
    'หนองบัวลำภู', 'นากลาง', 'ศรีบุญเรือง', 'โนนสัง', 'นาวัง', 'สุวรรณคูหา',
    'บึงกาฬ', 'เซกา', 'บึงโขงหลง', 'โซ่พิสัย', 'ปากคาด', 'พรเจริญ', 'ศรีวิไล', 'บุ่งคล้า',
    'สกลนคร', 'พังโคน', 'สว่างแดนดิน', 'วานรนิวาส', 'พรรณานิคม', 'อากาศอำนวย', 'กุสุมาลย์', 'กุดบาก', 'คำตากล้า', 'เจริญศิลป์', 'เต่างอย', 'โคกศรีสุพรรณ', 'นิคมน้ำอูน', 'ภูพาน', 'โพนนาแก้ว',
    'กาฬสินธุ์', 'ยางตลาด', 'กมลาไสย', 'สมเด็จ', 'กุฉินารายณ์', 'สหัสขันธ์', 'ห้วยผึ้ง', 'หนองกุงศรี',
    'ร้อยเอ็ด', 'เกษตรวิสัย', 'เสลภูมิ', 'โพนทอง', 'สุวรรณภูมิ', 'อาจสามารถ', 'พนมไพร',
    'มหาสารคาม', 'สารคาม', 'โกสุมพิสัย', 'วาปีปทุม', 'กันทรวิชัย', 'พยัคฆภูมิพิสัย', 'เชียงยืน (มหาสารคาม)',
    'นครพนม', 'ธาตุพนม', 'เรณูนคร', 'ศรีสงคราม', 'ท่าอุเทน', 'นาแก', 'บ้านแพง',
    'มุกดาหาร', 'นิคมคำสร้อย', 'ดอนตาล', 'หว้านใหญ่', 'หนองสูง',
    'ชัยภูมิ', 'ภูเขียว', 'แก้งคร้อ', 'บ้านเขว้า', 'เกษตรสมบูรณ์', 'คอนสาร', 'คอนสวรรค์',
    'นครราชสีมา', 'โคราช', 'ปากช่อง', 'พิมาย', 'สีคิ้ว', 'ปักธงชัย', 'สูงเนิน', 'โชคชัย', 'ด่านขุนทด',
    'อุบลราชธานี', 'อุบล', 'วารินชำราบ', 'เดชอุดม', 'พิบูลมังสาหาร',
    'ยโสธร', 'อำนาจเจริญ', 'สุรินทร์', 'ศรีสะเกษ', 'บุรีรัมย์',
    'เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แพร่', 'น่าน', 'พะเยา', 'แม่ฮ่องสอน', 'พิษณุโลก', 'สุโขทัย', 'ตาก', 'อุตรดิตถ์', 'เพชรบูรณ์', 'พิจิตร', 'กำแพงเพชร', 'นครสวรรค์', 'อุทัยธานี',
    'กรุงเทพ', 'กทม', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'สมุทรสงคราม', 'นครปฐม', 'อยุธยา', 'พระนครศรีอยุธยา', 'สระบุรี', 'ลพบุรี', 'สิงห์บุรี', 'อ่างทอง', 'ชัยนาท',
    'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก', 'สระแก้ว',
    'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี',
    'ภูเก็ต', 'กระบี่', 'พังงา', 'สุราษฎร์ธานี', 'นครศรีธรรมราช', 'สงขลา', 'หาดใหญ่', 'ตรัง', 'พัทลุง', 'สตูล', 'ชุมพร', 'ระนอง', 'ยะลา', 'ปัตตานี', 'นราธิวาส'
)

# Identify any post in the raw dataset that has site work in other province
$leakedPosts = @()

foreach ($p in $rawPosts) {
    if ($p.error -or $p.'#error') { continue }
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    if (-not $text) { continue }

    # Isolate the site location lines vs footer office lines
    $lines = $text -split '\r?\n'
    $siteLines = @()
    $isFooter = $false

    foreach ($line in $lines) {
        $trim = $line.Trim()
        if ($trim -match '📌|📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|ที่อยู่สำนักงาน|พิกัดสำนักงาน)|ที่ตั้ง\s*สำนักงาน|สำนักงานใหญ่|สนใจติดต่อ|โทร\s*0|Tel:|Line ID') {
            $isFooter = $true
        }
        if (-not $isFooter) {
            $siteLines += $trim
        }
    }
    $siteText = $siteLines -join ' '

    # Also check album title or first 3 lines
    $topText = ($lines | Select-Object -First 5) -join ' '

    # Check if siteText or topText contains outside province
    foreach ($prov in $outsideProvinces) {
        $matchPattern = '(?:จ\.|จังหวัด|อ\.|อำเภอ|ต\.|ตำบล|พิกัด|หน้างาน|สถานที่|สถานที่ก่อสร้าง|ที่ตั้งโครงการ|แปลงที่|ส่งมอบบ้าน|บ้านคุณ[^\s]+\s+)\s*[:\s]*' + [regex]::Escape($prov)
        if ($siteText -match $matchPattern -or $topText -match $matchPattern -or $siteText -match ('\b' + [regex]::Escape($prov) + '\b') -or $siteText -match ('หน้างาน\s*[^\\n]*?' + [regex]::Escape($prov))) {
            # Make sure it is not mentioning Udon Thani as the site
            $isUdonSite = $false
            if ($siteText -match 'หน้างาน\s*[^\\n]*?(?:อุดร|เมืองอุดร|กุมภวาปี|หนองหาน|บ้านดุง|เพ็ญ|กุดจับ|โนนสะอาด|ศรีธาตุ|วังสามหมอ|ทุ่งฝน|สร้างคอม|หนองแสง|หนองวัวซอ|บ้านผือ|น้ำโสม|นายูง|พิบูลย์รักษ์|กู่แก้ว|ประจักษ์|ไชยวาน|หมูม่น|บ้านจั่น|หนองขอนกว้าง|หมากแข้ง|สามพร้าว|นาดี|บ้านตาด)') {
                $isUdonSite = $true
            }

            if (-not $isUdonSite) {
                $leakedPosts += [pscustomobject]@{
                    Page = $p.pageName
                    ProvMatched = $prov
                    Snippet = ($text -replace '\s+', ' ').Substring(0, [Math]::Min(140, ($text -replace '\s+', ' ').Length))
                    Url = $p.url
                }
                break
            }
        }
    }
}

Write-Host ('=== Total Other Province Posts Detected: ' + $leakedPosts.Count)
$i = 1
foreach ($lp in $leakedPosts) {
    Write-Host ('[' + $i + '] Page: ' + $lp.Page + ' | Province/District: ' + $lp.ProvMatched)
    Write-Host ('    Snippet: ' + $lp.Snippet + '...')
    Write-Host ('    URL: ' + $lp.Url)
    $i++
}