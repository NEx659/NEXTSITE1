[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$jsonPath = "C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json"
$content = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
$items = if ($content -is [array]) { $content } else { $content.items }

$otherProvincesList = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)
$udonDistrictsList = @(
    "เมืองอุดร", "เมืองอุดรธานี", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม"
)

function Test-OtherProvince($post) {
    $text = [string]$post.text
    if (-not $text) { return $false }
    foreach ($prov in $otherProvincesList) {
        $locPattern = "(?:จ\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน)[\s:]*[^\n]*?$prov"
        if ($text -match $locPattern) {
            $matched = $Matches[0]
            if ($matched -notmatch "อุดร") {
                return @{ isOther = $true; reason = "Matched locPattern: $matched" }
            }
        }
    }
    foreach ($prov in $otherProvincesList) {
        $provPattern = "(?:จ\.|จังหวัด)$prov"
        if ($text -match $provPattern) {
            $hasUdon = ($text -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
            $hasUdonDist = $false
            foreach ($ud in $udonDistrictsList) {
                if ($text -match $ud) { $hasUdonDist = $true; break }
            }
            if (-not $hasUdon -and -not $hasUdonDist) {
                return @{ isOther = $true; reason = "Matched provPattern: $prov (no udon)" }
            }
        }
    }
    return @{ isOther = $false }
}

$lhPosts = $items | Where-Object { 
    $t = [string]$_.text
    $u = if ($_.user) { [string]$_.user.name } else { "" }
    $p = [string]$_.pageName
    $inp = [string]$_.inputUrl
    $fb = [string]$_.facebookUrl
    $t -match "หมูม่น" -or $u -match "Little Home" -or $p -match "LH2553" -or $inp -match "LH2553" -or $fb -match "LH2553"
}

Write-Host "Total Little Home posts: $($lhPosts.Count)"
$idx = 1
foreach ($p in $lhPosts) {
    Write-Host "=========================================="
    Write-Host "[$idx] URL: $($p.url)"
    Write-Host "InputUrl: $($p.inputUrl) | PageName: $($p.pageName)"
    $resOther = Test-OtherProvince $p
    Write-Host "IsOtherProvince: $($resOther.isOther) | Reason: $($resOther.reason)"
    
    $txt = [string]$p.text
    Write-Host "Snippet:`n$($txt.Substring(0, [Math]::Min(200, $txt.Length)))"
    $idx++
}
