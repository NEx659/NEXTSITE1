[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$items = if ($raw -is [array]) { $raw } else { $raw.items }

$lh1 = $items | Where-Object { $_.url -like '*pfbid08DtmkCtgmdCxB9tyJcnCwbvYKYGkFBUdsysdRQ1EyLZE5pNSguD5WEev2vSSNh2Ll*' } | Select-Object -First 1

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

$text = [string]$lh1.text

Write-Host "Checking Post 1:"
# Test Step 1:
foreach ($prov in $otherProvincesList) {
    $locPattern = "(?:จ\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน)[\s:]*[^\n]*?$prov"
    if ($text -match $locPattern) {
        Write-Host "Matched locPattern: $($Matches[0]) (Prov: $prov)"
    }
}
foreach ($prov in $otherProvincesList) {
    $provPattern = "(?:จ\.|จังหวัด)$prov"
    if ($text -match $provPattern) {
        Write-Host "Matched provPattern: $($Matches[0])"
    }
}

# Test Step 3:
$adPromoKeywordsList = @(
    "โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ",
    "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี",
    "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ",
    "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ",
    "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร.ม.ละ"
)
$isAd = $false
foreach ($kw in $adPromoKeywordsList) {
    if ($text -match $kw) { $isAd = $true; Write-Host "Matched Ad KW: $kw" }
}

$hasDist = $false
foreach ($d in $udonDistrictsList) {
    if ($text -match $d) { $hasDist = $true; Write-Host "Matched Dist: $d" }
}
Write-Host "Has Udon District in list: $hasDist"

