[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = if ($raw -is [array]) { $raw } else { $raw.items }

$otherProvincesList = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)

$outsideDistricts = @(
    "เซกา", "บึงโขงหลง", "โซ่พิสัย", "ปากคาด", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สังคม", "รัตนวาปี", "สระใคร", "เฝ้าไร่",
    "พังโคน", "สว่างแดนดิน", "วานรนิวาส", "พรรณานิคม", "อากาศอำนวย",
    "นากลาง", "ศรีบุญเรือง", "โนนสัง", "นาวัง", "สุวรรณคูหา",
    "วังสะพุง", "เชียงคาน", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "ท่าลี่", "ปากชม",
    "บ้านไผ่", "ชุมแพ", "น้ำพอง", "กระนวน", "พระยืน", "หนองเรือ", "พล", "มข."
)

function Check-PostProvince($p) {
    $text = [string]$p.text
    if (-not $text) { return @{ isOther = $false } }
    
    $lines = $text -split "\r?\n"
    
    # 1. Check lines that describe location / site
    foreach ($line in $lines) {
        $trimLine = $line.Trim()
        # Look for location marker lines
        if ($trimLine -match "📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|โลเคชั่น|location") {
            # If this specific location line mentions another province
            foreach ($prov in $otherProvincesList) {
                if ($trimLine -match "(?:จ\.|จังหวัด)?\s*$prov" -and $trimLine -notmatch "อุดร") {
                    return @{ isOther = $true; reason = "Location line has other province: $trimLine" }
                }
            }
            # If this specific location line mentions an outside district
            foreach ($dist in $outsideDistricts) {
                if ($trimLine -match "(?:อ\.|อำเภอ)?\s*$dist" -and $trimLine -notmatch "อุดร") {
                    return @{ isOther = $true; reason = "Location line has outside district: $trimLine" }
                }
            }
        }
    }
    
    # 2. General province check in the body (excluding footer)
    # Cut off footer
    $bodyText = $text
    $footerMarkers = @("ที่ตั้ง สำนักงาน", "ที่ตั้งสำนักงาน", "สำนักงานใหญ่", "สนใจติดต่อ", "โทร 0", "Tel:", "Line ID", "แฮชแท็ก", "#")
    foreach ($fm in $footerMarkers) {
        $idx = $bodyText.IndexOf($fm)
        if ($idx -gt 15) {
            $bodyText = $bodyText.Substring(0, $idx)
        }
    }
    
    foreach ($prov in $otherProvincesList) {
        $provRegex = "(?:จ\.|จังหวัด|หน้างาน|พิกัด)\s*[:\s]*$prov"
        if ($bodyText -match $provRegex) {
            $m = $Matches[0]
            if ($bodyText -notmatch "อุดรธานี|จ\.อุดร|จังหวัดอุดร|หมูม่น|หมากแข้ง|กุมภวาปี|หนองหาน|บ้านดุง|เพ็ญ|กุดจับ") {
                return @{ isOther = $true; reason = "Body has $m without Udon" }
            }
        }
    }
    
    return @{ isOther = $false }
}

$lhPosts = $posts | Where-Object { [string]$_.user.name -match "Little Home" -or [string]$_.pageName -match "LH2553" -or [string]$_.inputUrl -match "LH2553" }
Write-Host "=== Little Home Posts Check ==="
$lhIdx = 1
foreach ($p in $lhPosts) {
    $res = Check-PostProvince $p
    Write-Host "[$lhIdx] URL: $($p.url)"
    $l1 = ($p.text -split "\r?\n")[0]
    Write-Host "     Line 1: $l1"
    Write-Host "     IsOtherProvince: $($res.isOther) | Reason: $($res.reason)"
    $lhIdx++
}
