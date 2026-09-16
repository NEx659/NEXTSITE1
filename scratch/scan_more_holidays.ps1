[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
if (-not (Test-Path $datasetPath)) {
    $datasetPath = 'c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json'
}

$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# 1. Step 1 filter
$otherProvinces = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)
$udonDistricts = @(
    "เมืองอุดร", "เมืองอุดรธานี", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม"
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

$step1Posts = [System.Collections.Generic.List[object]]::new()
for ($i = 0; $i -lt $rawPosts.Count; $i++) {
    $p = $rawPosts[$i]
    if (-not (Test-IsOtherProvince $p)) {
        $p | Add-Member -NotePropertyName "originalIndex" -NotePropertyValue $i -Force
        $step1Posts.Add($p)
    }
}

$moreHolidayTerms = @(
    "วันแม่", "วันพ่อ", "สงกรานต์", "ปีใหม่", "ตรุษจีน", "วันแรงงาน",
    "วันวิสาขบูชา", "วันอาสาฬหบูชา", "เข้าพรรษา", "ออกพรรษา", "วันปิยมหาราช",
    "หยุดยาว", "ปิดทำการ", "หยุดทำการ", "แจ้งวันหยุด"
)

$foundList = [System.Collections.Generic.List[object]]::new()

foreach ($p in $step1Posts) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    
    foreach ($term in $moreHolidayTerms) {
        if ($text -match $term) {
            $foundList.Add([pscustomobject]@{
                index = $p.originalIndex
                pageName = $p.pageName
                term = $term
                text = $text
            })
            break
        }
    }
}

Write-Host "Total matches for all holiday/occasion terms: $($foundList.Count)"
foreach ($f in $foundList) {
    Write-Host "--------------------------------------------------------"
    Write-Host "Index $($f.index) | เพจ: $($f.pageName) | พบคำว่า: $($f.term)"
    Write-Host "ข้อความ: $($f.text -replace "`r?`n", " ")"
}
