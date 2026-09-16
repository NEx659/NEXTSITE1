[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
if (-not (Test-Path $datasetPath)) {
    $datasetPath = 'c:\Users\pannipan\Downloads\N\scripts\facebook_54_pages_posts.json'
}

$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# List of other provinces in Thailand (excluding อุดรธานี / อุดร)
# Focus on explicit province mentions, e.g. "จ.ขอนแก่น", "จังหวัดขอนแก่น", "จ.สกลนคร", "จ.หนองคาย", "จ.หนองบัวลำภู", "จ.เลย", "จ.บึงกาฬ", "จ.กาฬสินธุ์", "จ.ร้อยเอ็ด", "จ.นครพนม", "จ.มหาสารคาม", "จ.มุกดาหาร", "จ.ชัยภูมิ", "จ.โคราช", "จ.นครราชสีมา", "กรุงเทพ", "กทม", etc.

$otherProvincePatterns = @(
    "จ\.ขอนแก่น", "จังหวัดขอนแก่น", "จ\. สกลนคร", "จ\.สกลนคร", "จังหวัดสกลนคร",
    "จ\.หนองคาย", "จังหวัดหนองคาย", "จ\.หนองบัวลำภู", "จังหวัดหนองบัวลำภู",
    "จ\.เลย", "จังหวัดเลย", "จ\.บึงกาฬ", "จังหวัดบึงกาฬ",
    "จ\.กาฬสินธุ์", "จังหวัดกาฬสินธุ์", "จ\.ร้อยเอ็ด", "จังหวัดร้อยเอ็ด",
    "จ\.นครพนม", "จังหวัดนครพนม", "จ\.มหาสารคาม", "จังหวัดมหาสารคาม",
    "จ\.มุกดาหาร", "จังหวัดมุกดาหาร", "จ\.ชัยภูมิ", "จังหวัดชัยภูมิ",
    "จ\.นครราชสีมา", "จังหวัดนครราชสีมา", "จ\.โคราช", "จ\.อุบล", "จังหวัดอุบลราชธานี",
    "จ\.ยโสธร", "จังหวัดยโสธร", "จ\.อำนาจเจริญ", "จังหวัดอำนาจเจริญ",
    "จ\.สุรินทร์", "จังหวัดสุรินทร์", "จ\.ศรีสะเกษ", "จังหวัดศรีสะเกษ",
    "จ\.บุรีรัมย์", "จังหวัดบุรีรัมย์", "กรุงเทพ", "กทม\.", "จ\.นนทบุรี", "จ\.ปทุมธานี",
    "จ\.สมุทรปราการ", "จ\.ชลบุรี", "จ\.ระยอง", "จ\.เชียงใหม่", "จ\.เชียงราย", "จ\.พิษณุโลก"
)

$excludedPosts = [System.Collections.Generic.List[object]]::new()
$keptPosts = [System.Collections.Generic.List[object]]::new()

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $text = if ($p.text) { [string]$p.text } elseif ($p.message) { [string]$p.message } else { '' }
    
    # Check if explicitly mentions other province and does NOT mention Udon Thani in the same context as site location
    $matchedOther = $null
    foreach ($pattern in $otherProvincePatterns) {
        if ($text -match $pattern) {
            $matchedOther = $matches[0]
            break
        }
    }
    
    if ($matchedOther) {
        # Check if text also mentions อุดรธานี
        $hasUdon = ($text -match "อุดร|จ\.อุดร|จังหวัดอุดร")
        $excludedPosts.Add([pscustomobject]@{
            index = $i
            pageName = $p.pageName
            matchedProvince = $matchedOther
            hasUdonMention = $hasUdon
            postUrl = if ($p.url) { $p.url } elseif ($p.facebookUrl) { $p.facebookUrl } else { $p.inputUrl }
            textSnippet = if ($text.Length -gt 120) { $text.Substring(0, 120) + "..." } else { $text }
        })
    } else {
        $keptPosts.Add($p)
    }
}

Write-Host "=========================================="
Write-Host "TOTAL RAW POSTS: $($posts.Count)"
Write-Host "EXPLICIT OTHER PROVINCES FOUND: $($excludedPosts.Count)"
Write-Host "REMAINING POSTS: $($keptPosts.Count)"
Write-Host "=========================================="

Write-Host "`nSample of posts detected with explicit other provinces:"
foreach ($ex in ($excludedPosts | Select-Object -First 25)) {
    Write-Host "[$($ex.index)] เพจ: $($ex.pageName) | พบ: $($ex.matchedProvince) (มีคำว่าอุดรด้วยไหม: $($ex.hasUdonMention))"
    Write-Host "   ข้อความ: $($ex.textSnippet -replace "`r?`n", " ")"
    Write-Host "---------------------------------------------------------"
}
