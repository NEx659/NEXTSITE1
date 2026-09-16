[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
if (-not (Test-Path $datasetPath)) {
    $datasetPath = 'c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json'
}

$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$otherProvinces = @(
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "พิษณุโลก", "ชลบุรี", "ระยอง", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"
)

# Udon districts
$udonDistricts = @(
    "เมืองอุดร", "เมืองอุดรธานี", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม"
)

$excludedList = [System.Collections.Generic.List[object]]::new()
$keptList = [System.Collections.Generic.List[object]]::new()

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    
    # Check if text is an error object
    if ($p.error -or $p.'#error') {
        $excludedList.Add([pscustomobject]@{
            index = $i
            pageName = $p.pageName
            reason = "Apify error/no_items"
            details = "ไม่ใช่โพสต์หน้างาน (Error placeholder)"
            text = ""
        })
        continue
    }

    # Extract location context from post text (look near 📍, พิกัด, สถานที่, หน้างาน, ต., อ., จ.)
    $isOtherSite = $false
    $detectedProv = ""
    $detectedReason = ""

    # Look for explicit patterns like "จ.หนองคาย", "จังหวัดหนองคาย", "อ.เมือง จ.ขอนแก่น", "พิกัด: ... สกลนคร"
    foreach ($prov in $otherProvinces) {
        $pattern1 = "(?:จ\.|จว\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน|อ\.[^\s\n,]+|ต\.[^\s\n,]+)\s*(?:[^\n]*?)\b$prov\b"
        $pattern2 = "\b$prov\b"
        
        if ($text -match "(?:จ\.|จังหวัด|พิกัด|สถานที่ก่อสร้าง|หน้างาน)\s*[:\s]*[^\n]*?$prov") {
            # Found explicit province in location context
            # Check if this line ALSO has Udon Thani (e.g. comparing or multi-branch)
            $matchedLine = $matches[0]
            if ($matchedLine -notmatch "อุดร") {
                $isOtherSite = $true
                $detectedProv = $prov
                $detectedReason = "ระบุสถานที่หน้างานเป็น จ.$prov ($matchedLine)"
                break
            }
        }
    }

    # Second pass: check direct pattern "จ.<other>"
    if (-not $isOtherSite) {
        foreach ($prov in $otherProvinces) {
            if ($text -match "(?:จ\.|จังหวัด)$prov") {
                $matchedWord = $matches[0]
                # Check if it's explicitly located there
                # If the post does NOT mention อุดรธานี or any Udon district
                $hasUdon = ($text -match "อุดรธานี|จ\.อุดร|จังหวัดอุดร")
                $hasUdonDist = $false
                foreach ($ud in $udonDistricts) {
                    if ($text -match $ud) { $hasUdonDist = $true; break }
                }

                if (-not $hasUdon -and -not $hasUdonDist) {
                    $isOtherSite = $true
                    $detectedProv = $prov
                    $detectedReason = "ระบุ $matchedWord โดยไม่มีระบุอุดรธานีในเนื้อหา"
                    break
                }
            }
        }
    }

    if ($isOtherSite) {
        $excludedList.Add([pscustomobject]@{
            index = $i
            pageName = if ($p.pageName) { $p.pageName } else { $p.inputUrl }
            reason = $detectedReason
            detectedProvince = $detectedProv
            text = if ($text.Length -gt 150) { $text.Substring(0, 150) + "..." } else { $text }
        })
    } else {
        $keptList.Add($p)
    }
}

Write-Host "============================================="
Write-Host "TOTAL POSTS SCANNED: $($posts.Count)"
Write-Host "POSTS TO EXCLUDE (OTHER PROVINCES): $($excludedList.Count)"
Write-Host "POSTS TO KEEP (UDON THANI / UNSPECIFIED): $($keptList.Count)"
Write-Host "============================================="

Write-Host "`nDETAILED BREAKDOWN BY PROVINCE:"
$excludedList | Group-Object detectedProvince | Sort-Object Count -Descending | ForEach-Object {
    Write-Host " - จ.$($_.Name): $($_.Count) โพสต์"
}

Write-Host "`n--- LIST OF EXCLUDED POSTS ---"
for ($k = 0; $k -lt $excludedList.Count; $k++) {
    $item = $excludedList[$k]
    Write-Host "[$($k+1)] Index $($item.index) | เพจ: $($item.pageName)"
    Write-Host "    เหตุผล: $($item.reason)"
    Write-Host "    ข้อความ: $($item.text -replace "`r?`n", " ")"
    Write-Host ""
}
