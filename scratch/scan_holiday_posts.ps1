[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
if (-not (Test-Path $datasetPath)) {
    $datasetPath = 'c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json'
}

$rawPosts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# 1. Step 1 filter (already approved: exclude other provinces)
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

Write-Host "Total posts after Step 1: $($step1Posts.Count)"

# 2. Search for Holiday Announcements
$holidayKeywords = @(
    "วันหยุด", "หยุดทำการ", "ปิดทำการ", "แจ้งวันหยุด", "วันหยุดเทศกาล",
    "วันหยุดปีใหม่", "วันหยุดสงกรานต์", "หยุดสงกรานต์", "หยุดปีใหม่", "สุขสันต์วันสงกรานต์",
    "สวัสดีวันสงกรานต์", "สุขสันต์วันปีใหม่", "สวัสดีปีใหม่", "วันหยุดยาว", "ประกาศหยุด",
    "แจ้งหยุด", "เปิดทำการปกติ", "เปิดให้บริการตามปกติ", "หยุดให้บริการ", "ปิดให้บริการ"
)

$holidayPosts = [System.Collections.Generic.List[object]]::new()
$unsurePosts = [System.Collections.Generic.List[object]]::new()
$remainingPosts = [System.Collections.Generic.List[object]]::new()

foreach ($p in $step1Posts) {
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    
    $foundHoliday = $null
    foreach ($kw in $holidayKeywords) {
        if ($text -match $kw) {
            $foundHoliday = $kw
            break
        }
    }
    
    if ($foundHoliday) {
        # Check if the post also talks about actual site progress or if it's purely a greeting/closure announcement
        $isPureHoliday = $true
        if ($text -match "เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|ส่งมอบ|ก่อสร้างจริง|พิกัด|ตรวจงาน") {
            # Might be a holiday greeting with site update or mixed
            $unsurePosts.Add([pscustomobject]@{
                index = $p.originalIndex
                pageName = $p.pageName
                matchedWord = $foundHoliday
                text = $text
                note = "มีคำวันหยุด แต่มีคำเกี่ยวกับหน้างานด้วย"
            })
        } else {
            $holidayPosts.Add([pscustomobject]@{
                index = $p.originalIndex
                pageName = $p.pageName
                matchedWord = $foundHoliday
                text = $text
                note = "ประกาศวันหยุด/ปิดทำการ/คำอวยพรเทศกาลชัดเจน"
            })
        }
    } else {
        $remainingPosts.Add($p)
    }
}

Write-Host "============================================="
Write-Host "CLEAR HOLIDAY ANNOUNCEMENT POSTS: $($holidayPosts.Count)"
Write-Host "UNSURE / MIXED POSTS: $($unsurePosts.Count)"
Write-Host "REMAINING NON-HOLIDAY POSTS: $($remainingPosts.Count)"
Write-Host "============================================="

Write-Host "`n--- CLEAR HOLIDAY ANNOUNCEMENTS (TO EXCLUDE) ---"
for ($k = 0; $k -lt $holidayPosts.Count; $k++) {
    $item = $holidayPosts[$k]
    Write-Host "[$($k+1)] Index $($item.index) | เพจ: $($item.pageName) | คำที่พบ: $($item.matchedWord)"
    Write-Host "    ข้อความ: $($item.text -replace "`r?`n", " ")"
    Write-Host ""
}

if ($unsurePosts.Count -gt 0) {
    Write-Host "`n--- UNSURE / MIXED POSTS (TO REVIEW) ---"
    for ($k = 0; $k -lt $unsurePosts.Count; $k++) {
        $item = $unsurePosts[$k]
        Write-Host "[$($k+1)] Index $($item.index) | เพจ: $($item.pageName) | คำที่พบ: $($item.matchedWord)"
        Write-Host "    ข้อความ: $($item.text -replace "`r?`n", " ")"
        Write-Host ""
    }
}
